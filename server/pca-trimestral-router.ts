import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import {
  createPcaDocument,
  getPcaDocument,
  setPcaAiResult,
  setPcaStatusPaidFree,
  getActiveAnnualSubscription,
  setPcaClientTxId,
  getPcaDocumentsBySession,
} from "./db";
import { TODAS_LAS_DESTREZAS } from "../data/index";
import {
  conOficial,
  indicadoresOficialesTexto,
  objetivosOficiales,
  objetivosOficialesTexto,
} from "../lib/oficiales-curriculares";

const PCA_TRIMESTRAL_PRICE_CENTS = 999; // $9.99

// ─── Nombres legibles ─────────────────────────────────────────────────────────

const AREA_NAMES: Record<string, string> = {
  M: "Matemática",
  LL: "Lengua y Literatura",
  CN: "Ciencias Naturales",
  CS: "Estudios Sociales",
  EF: "Educación Física",
  ECA: "Educación Cultural y Artística",
  EFL: "Lengua Extranjera (Inglés)",
  "CN.B": "Biología",
  "CN.Q": "Química",
  "CN.F": "Física",
  "CS.H": "Historia",
  "CS.F": "Filosofía",
  "CS.EC": "Educación para la Ciudadanía",
  KAI: "Cívica — Acompañamiento Integral en el Aula",
  EG: "Emprendimiento y Gestión",
};

const SUBNIVEL_NAMES: Record<number, string> = {
  0: "Educación Inicial (3-4 años)",
  1: "Preparatoria (1.° EGB)",
  2: "Básica Elemental (2.° - 4.°)",
  3: "Básica Media (5.° - 7.°)",
  4: "Básica Superior (8.° - 10.°)",
  5: "Bachillerato General Unificado",
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

const UnidadSchema = z.object({
  id: z.string(),
  numero: z.number(),
  dcdsSeleccionadas: z.array(z.object({ codigo: z.string(), enunciado: z.string() })),
  duracionSemanas: z.number(),
  titulo: z.string().optional(),
  objetivosEspecificos: z.string().optional(),
  deporteEnfoque: z.string().optional(),
});

const FormDataTrimestralSchema = z.object({
  tipo: z.literal("trimestral"),
  trimestre: z.enum(["Primer Trimestre", "Segundo Trimestre", "Tercer Trimestre"]),
  institucion: z.string(),
  docente: z.string(),
  area: z.string(),
  subnivel: z.number(),
  grado: z.string(),
  anioLectivo: z.string(),
  paralelo: z.string(),
  cargaHorariaSemanal: z.number(),
  semanasTotal: z.number(),
  semanasEvaluacion: z.number(),
  usaEjesTransversales: z.boolean(),
  ejesTransversales: z.array(z.string()),
  unidades: z.array(UnidadSchema),
  modeloPedagogico: z.enum(["ERCA", "ACC"]).default("ERCA"),
  metodologiasActivas: z.array(z.string()),
  tecnicasEvaluacion: z.array(z.string()),
  firmaElaboradoPor: z.string(),
  firmaElaboradoFecha: z.string(),
  firmaRevisadoPor: z.string(),
  firmaRevisadoFecha: z.string(),
  firmaAprobadoPor: z.string(),
  firmaAprobadoFecha: z.string(),
  deporteEnfoque: z.string().optional(),
});

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildPcaTrimestralPrompt(input: z.infer<typeof FormDataTrimestralSchema>): string {
  const areaNombre    = AREA_NAMES[input.area] || input.area;
  const subnivelNombre = SUBNIVEL_NAMES[input.subnivel] || `Subnivel ${input.subnivel}`;
  const semanasClase  = Math.max(0, input.semanasTotal - input.semanasEvaluacion);
  const totalPeriodos = semanasClase * input.cargaHorariaSemanal;

  const ejesTexto = input.usaEjesTransversales && input.ejesTransversales.length > 0
    ? input.ejesTransversales.join(", ")
    : "Ninguno";

  const metodologiasTexto = input.metodologiasActivas.length > 0
    ? input.metodologiasActivas.join(", ")
    : "No especificadas";

  const tecnicasTexto = input.tecnicasEvaluacion.length > 0
    ? input.tecnicasEvaluacion.join(", ")
    : "No especificadas";

  const unidadesTexto = input.unidades.map((u) => {
    const dcds = u.dcdsSeleccionadas.length > 0
      ? u.dcdsSeleccionadas.map(d => `  - ${d.codigo}: "${d.enunciado}"`).join("\n")
      : "  (Sin DCD específicas seleccionadas)";
    const tituloLinea = u.titulo?.trim()
      ? `TÍTULO PREDEFINIDO (úsalo exactamente, no lo cambies): "${u.titulo.trim()}"`
      : "";
    // Objetivos e indicadores OFICIALES del catálogo MinEduc: la IA no los
    // redacta, únicamente los transcribe tal cual (o el docente impone los suyos).
    const objOficiales = objetivosOficialesTexto(u.dcdsSeleccionadas);
    const indOficiales = indicadoresOficialesTexto(u.dcdsSeleccionadas);
    const objetivosLinea = u.objetivosEspecificos?.trim()
      ? `OBJETIVOS PREDEFINIDOS (úsalos exactamente, no los cambies): "${u.objetivosEspecificos.trim()}"`
      : objOficiales
        ? `OBJETIVOS OFICIALES DEL CATÁLOGO MINEDUC (copia este texto EXACTAMENTE en "objetivosEspecificos", sin redactar nada nuevo):\n${objOficiales}`
        : "";
    const indicadoresLinea = indOficiales
      ? `INDICADORES DE EVALUACIÓN OFICIALES DEL CATÁLOGO MINEDUC (copia este texto EXACTAMENTE en "evaluacion", sin redactar indicadores nuevos):\n${indOficiales}`
      : "";
    const modeloFases = input.modeloPedagogico === "ACC"
      ? "Anticipación, Construcción y Consolidación"
      : "Experiencia, Reflexión, Conceptualización y Aplicación";
    const deporteLinea = u.deporteEnfoque?.trim()
      ? `⚽ DEPORTE DE ESTA UNIDAD: "${u.deporteEnfoque}". TODAS las actividades de las fases ${modeloFases} DEBEN contextualizarse específicamente a ${u.deporteEnfoque}: usa técnicas, gestos técnicos, situaciones de juego, reglamento y vocabulario propio de este deporte. Los indicadores de evaluación también deben medir habilidades propias de ${u.deporteEnfoque}.`
      : "";
    return [
      `Unidad ${u.numero}:`,
      `DCD seleccionadas:\n${dcds}`,
      `Duración: ${u.duracionSemanas} semanas`,
      tituloLinea,
      objetivosLinea,
      indicadoresLinea,
      deporteLinea,
    ].filter(Boolean).join("\n");
  }).join("\n\n");

  // Objetivos oficiales de TODO el trimestre: unión de los objetivos de las DCD
  // de todas las unidades (sin repetir), que es lo que debe ir en
  // "objetivosTrimestre".
  const objTrimestreOficiales = objetivosOficialesTexto(
    input.unidades.flatMap((u) => u.dcdsSeleccionadas)
  );

  const eflCtx = input.area === "EFL"
    ? `\n🇬🇧 IDIOMA OBLIGATORIO: Esta planificación es para LENGUA EXTRANJERA (INGLÉS). Todos los títulos de unidades, objetivos específicos, contenidos, actividades de las fases ${input.modeloPedagogico === "ACC" ? "Anticipación, Construcción y Consolidación" : "Experiencia, Reflexión, Conceptualización y Aplicación"} e indicadores de evaluación DEBEN estar redactados EN INGLÉS. Solo los campos administrativos (institución, docente, año lectivo) permanecen en español.`
    : "";

  const kaiCtx = input.area === "KAI"
    ? `\n🏛️ PERÍODO KAI — EVALUACIÓN CUALITATIVA OBLIGATORIA: Esta es una Planificación del período "Cívica — Acompañamiento Integral en el Aula (KAI)". La sección de evaluación ("evaluacion") de CADA unidad DEBE ser estrictamente CUALITATIVA. No uses calificaciones numéricas. Usa únicamente: A = Muy Satisfactorio / B = Satisfactorio / C = Poco Satisfactorio. Describe los indicadores actitudinales que se observarán para asignar cada nivel. Las actividades deben promover la formación ciudadana, la convivencia democrática y la ética pública.`
    : "";

  const deporteCtx = input.deporteEnfoque
    ? `\n⚽ DEPORTE/DISCIPLINA SELECCIONADO: "${input.deporteEnfoque}". TODAS las actividades de las fases ${input.modeloPedagogico === "ACC" ? "Anticipación, Construcción y Consolidación" : "Experiencia, Reflexión, Conceptualización y Aplicación"} DEBEN contextualizarse específicamente a ${input.deporteEnfoque}: usa técnicas, gestos técnicos, situaciones de juego, reglamento y vocabulario propio de este deporte. Los indicadores de evaluación también deben medir habilidades propias de ${input.deporteEnfoque}.`
    : "";

  return `Eres un experto en currículo educativo ecuatoriano. Genera una Planificación Curricular Trimestral (PCT) completa siguiendo el formato oficial del Ministerio de Educación del Ecuador.

DATOS DEL PERÍODO:
- Institución: ${input.institucion}
- Docente(s): ${input.docente}
- Área/Asignatura: ${areaNombre}
- Subnivel: ${subnivelNombre}
- Grado/Curso: ${input.grado}
- Año lectivo: ${input.anioLectivo}
- Trimestre: ${input.trimestre}
- Carga horaria semanal: ${input.cargaHorariaSemanal} períodos
- Total semanas de clase: ${semanasClase}
- Total períodos del trimestre: ${totalPeriodos}
- Ejes transversales: ${ejesTexto}
- Metodologías activas: ${metodologiasTexto}
- Técnicas de evaluación: ${tecnicasTexto}${eflCtx}${deporteCtx}${kaiCtx}

UNIDADES DEL TRIMESTRE:
${unidadesTexto}

OBJETIVOS OFICIALES DEL ${input.trimestre.toUpperCase()} (catálogo MinEduc) — usa EXACTAMENTE este texto en "objetivosTrimestre", sin reformularlo:
${objTrimestreOficiales || "(El catálogo no trae objetivos para estas DCD: redáctalos alineados al currículo oficial.)"}

TAXONOMÍA DE MARZANO — aplica estos niveles en cada fase ${input.modeloPedagogico}:
${input.modeloPedagogico === "ACC" ? `- ANTICIPACIÓN → Nivel 1 Recuperación (activar saberes previos: reconocer, recordar, ejecutar procedimientos conocidos)
- CONSTRUCCIÓN → Niveles 2-3 Comprensión y Análisis (integrar, representar, comparar, clasificar, analizar errores, generalizar)
- CONSOLIDACIÓN → Nivel 4 Utilización del Conocimiento (resolver problemas reales, tomar decisiones, experimentar, investigar)` : `- EXPERIENCIA → Nivel 1 Recuperación (activar saberes previos: reconocer, recordar, ejecutar procedimientos conocidos)
- REFLEXIÓN → Niveles 2-3 Comprensión y Análisis (integrar nuevo conocimiento, comparar, clasificar, analizar errores, generalizar)
- CONCEPTUALIZACIÓN → Nivel 2 Comprensión profunda (representar, simbolizar, construir significado, organizar conceptos)
- APLICACIÓN → Nivel 4 Utilización del Conocimiento (resolver problemas reales, tomar decisiones, experimentar, crear)`}

GENERA ÚNICAMENTE JSON con esta estructura exacta, sin texto adicional, sin bloques markdown:
{
  "objetivosTrimestre": "Objetivos específicos para el ${input.trimestre} alineados al currículo MinEduc Ecuador para ${areaNombre} ${subnivelNombre} ${input.grado}",
  "unidades": [
    {
      "numero": 1,
      "titulo": "Título descriptivo de la unidad",
      "objetivosEspecificos": "Objetivos de aprendizaje alineados a las DCD",
      "contenidos": "Contenidos conceptuales, procedimentales y actitudinales",
      "orientacionesMetodologicas": [
        {
          "dcd": "código de la DCD (ej: M.2.1.15)",
          "fases": ${input.modeloPedagogico === "ACC" ? `{
            "anticipacion": ["actividad concisa 1 (Marzano N1: recuperación)", "actividad concisa 2"],
            "construccion": ["actividad concisa 1 (Marzano N2-3: comprensión/análisis)", "actividad concisa 2"],
            "consolidacion": ["actividad concisa 1 (Marzano N4: utilización)", "actividad concisa 2"]
          }` : `{
            "experiencia": ["actividad concisa 1 (Marzano N1: recuperación)", "actividad concisa 2"],
            "reflexion": ["actividad concisa 1 (Marzano N2-3: comprensión/análisis)", "actividad concisa 2"],
            "conceptualizacion": ["actividad concisa 1 (Marzano N2: comprensión profunda)", "actividad concisa 2"],
            "aplicacion": ["actividad concisa 1 (Marzano N4: utilización)", "actividad concisa 2"]
          }`}
        }
      ],
      "evaluacion": "OBLIGATORIO (no dejar vacío): si la unidad trae INDICADORES OFICIALES, transcríbelos tal cual. Si no, escribe 3-5 indicadores de logro específicos y observables para las DCD trabajadas, articulados con las técnicas de evaluación elegidas. Cada indicador inicia con verbo en infinitivo observable (ej: Demuestra, Ejecuta, Analiza, Resuelve, Crea).",
      "duracionSemanas": número
    }
  ]
}

REGLAS OBLIGATORIAS:
- orientacionesMetodologicas es un ARRAY: un objeto por cada DCD seleccionada, con su código y sus fases
- Cada actividad DEBE iniciar con un VERBO EN INFINITIVO siguiendo Marzano (ej: "Reconocer...", "Identificar...", "Analizar...", "Resolver...", "Crear..."). NUNCA uses "Los estudiantes" al inicio.
- Aplica Taxonomía de Marzano: nivel 1 en Experiencia/Anticipación, niveles 2-3 en Reflexión/Construcción, nivel 4 en Aplicación/Consolidación
- Exactamente 2 actividades por fase (ni más, ni menos). Concisas pero específicas y progresivas dentro de cada nivel de Marzano
- Alinea todo al currículo priorizado vigente del Ministerio de Educación del Ecuador
- El campo "evaluacion" es OBLIGATORIO: NUNCA lo dejes vacío ni como "". Cuando la unidad traiga INDICADORES OFICIALES DEL CATÁLOGO, usa exactamente esos textos; si no, escribe mínimo 3 indicadores de logro específicos y medibles para las DCD de esa unidad
- Los indicadores DEBEN articularse con las técnicas de evaluación elegidas
- Los objetivos del trimestre DEBEN ser específicos para el ${input.trimestre} (no del año completo) y, si se indicaron OBJETIVOS OFICIALES, transcríbelos tal cual
- Usa lenguaje técnico-pedagógico apropiado para el nivel educativo
- Responde SOLO con el JSON, sin nada más`;
}

// ─── Router ──────────────────────────────────────────────────────────────────

type UnidadFormPct = z.infer<typeof UnidadSchema>;

/** Texto que guarda la IA para cada unidad de la PCT. */
interface UnidadPctIa {
  numero: number;
  objetivosEspecificos: string;
  evaluacion: string;
  [k: string]: any;
}

/**
 * Sustituye en una unidad de la PCT los indicadores de evaluación y, si el
 * docente no escribió los suyos en el formulario, los objetivos específicos,
 * por los textos OFICIALES del catálogo MinEduc (si los hay).
 */
function aplicarOficialesUnidadPct(
  unidad: UnidadPctIa | undefined,
  form: UnidadFormPct | undefined
): void {
  if (!unidad) return;
  const dcds = form?.dcdsSeleccionadas ?? [];

  const indicadores = indicadoresOficialesTexto(dcds);
  if (indicadores) unidad.evaluacion = indicadores;

  if (!form?.objetivosEspecificos?.trim()) {
    const objetivos = objetivosOficialesTexto(dcds);
    if (objetivos) unidad.objetivosEspecificos = objetivos;
  }
}

/**
 * Prioriza los textos OFICIALES del catálogo MinEduc sobre lo redactado por la IA:
 *
 * - `evaluacion` (indicadores) y `objetivosTrimestre`: se sustituyen siempre que
 *   el catálogo trae texto para las DCD seleccionadas.
 * - `objetivosEspecificos`: solo si el docente NO escribió los suyos en el
 *   formulario —su entrada explícita manda sobre el catálogo—.
 *
 * Si el catálogo no tiene texto para esas DCD se conserva lo que generó la IA.
 */
function aplicarOficialesPct(
  aiResult: { objetivosTrimestre: string; unidades: UnidadPctIa[] },
  unidades: UnidadFormPct[]
): void {
  const objTrimestre = objetivosOficialesTexto(
    unidades.flatMap((u) => u.dcdsSeleccionadas)
  );
  if (objTrimestre) aiResult.objetivosTrimestre = objTrimestre;

  aiResult.unidades.forEach((unidad, idx) => {
    const form =
      unidades.find((f) => f.numero === unidad.numero) ?? unidades[idx];
    aplicarOficialesUnidadPct(unidad, form);
  });
}

export const pcaTrimestralRouter = router({
  /**
   * Genera la PCT con IA y la guarda en DB.
   * Retorna el ID del documento para navegar a la vista previa.
   */
  generatePcaTrimestral: publicProcedure
    .input(z.object({
      sessionId: z.string().min(1),
      email: z.string().email().optional(),
      formData: FormDataTrimestralSchema,
    }))
    .mutation(async ({ input }) => {
      // 0. Verificar suscripción anual → PCT incluida sin costo
      let isAnnualSubscriber = false;
      if (input.email) {
        const annualSub = await getActiveAnnualSubscription(input.email);
        isAnnualSubscriber = !!annualSub;
        if (isAnnualSubscriber) {
          console.log("[pca-trimestral-router] Annual subscriber detected:", input.email);
        }
      }

      // 1. Crear documento en BD con status "draft"
      const docId = await createPcaDocument({
        sessionId: input.sessionId,
        status: "draft",
        formData: JSON.stringify(input.formData),
      });

      try {
        // 2. Construir prompt y llamar a la IA
        const prompt = buildPcaTrimestralPrompt(input.formData);

        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional ni bloques markdown.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 16000,
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("Sin respuesta de la IA");
        }

        // 3. Parsear respuesta con reparación de JSON truncado
        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch {
          try {
            parsed = JSON.parse(repairJson(content));
          } catch {
            throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
          }
        }

        // 4. Normalizar campos (la IA puede devolver objetos en vez de strings)
        const toStr = (val: any): string => {
          if (typeof val === "string") return val;
          if (val === null || val === undefined) return "";
          if (Array.isArray(val)) return val.map(toStr).join("; ");
          if (typeof val === "object") return Object.values(val).map(toStr).join(" | ");
          return String(val);
        };

        const aiResult = {
          objetivosTrimestre: toStr(parsed.objetivos_trimestre || parsed.objetivosTrimestre),
          unidades: Array.isArray(parsed.unidades)
            ? parsed.unidades.map((u: any) => {
                // Preservar orientacionesMetodologicas como array de DCDs (no convertir a string)
                const orientRaw = u.orientaciones_metodologicas || u.orientacionesMetodologicas;
                let orientaciones: any;
                if (Array.isArray(orientRaw)) {
                  // Filtrar DCDs con todas las fases vacías (artefacto de truncación de JSON)
                  const hasFases = (item: any) => {
                    const f = item?.fases || {};
                    return Object.values(f).some((v: any) => Array.isArray(v) && v.length > 0);
                  };
                  orientaciones = orientRaw.filter(hasFases);
                  if (orientaciones.length === 0) orientaciones = orientRaw; // fallback: keep all
                } else {
                  orientaciones = orientRaw && typeof orientRaw === "object" ? orientRaw : toStr(orientRaw);
                }
                return {
                  numero: u.numero || 1,
                  titulo: toStr(u.titulo) || "Unidad sin título",
                  objetivosEspecificos: toStr(u.objetivos_especificos || u.objetivosEspecificos),
                  contenidos: toStr(u.contenidos),
                  orientacionesMetodologicas: orientaciones,
                  evaluacion: toStr(
                    u.evaluacion ||
                    u.evaluacion_criterios ||
                    u.criterios_evaluacion ||
                    u.indicadores_evaluacion ||
                    u.indicadores ||
                    u.criterios
                  ),
                  duracionSemanas: u.duracion_semanas || u.duracionSemanas || 1,
                };
              })
            : [],
        };

        // 5. Objetivos e indicadores OFICIALES del catálogo MinEduc: el texto del
        //    Ministerio tiene prioridad sobre lo redactado por la IA. Los objetivos
        //    que escribió el docente en el formulario se conservan tal cual.
        aplicarOficialesPct(aiResult, input.formData.unidades);

        // 6. Guardar resultado en BD (status → "generated")
        await setPcaAiResult(docId, JSON.stringify(aiResult));

        // 6. Si es suscriptor anual, desbloquear automáticamente
        if (isAnnualSubscriber) {
          await setPcaStatusPaidFree(docId);
          return { success: true, pcaId: docId, autoUnlocked: true };
        }

        return { success: true, pcaId: docId, autoUnlocked: false };
      } catch (error: any) {
        console.error("[pca-trimestral-router] Error generating PCT:", error);
        return {
          success: false,
          pcaId: docId,
          autoUnlocked: false,
          error: error.message || "Error al generar la PCT. Intenta de nuevo.",
        };
      }
    }),

  /**
   * Obtiene un documento PCT por ID.
   */
  getPcaTrimestral: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await getPcaDocument(input.id);
      if (!doc) return { found: false, doc: null };

      return {
        found: true,
        doc: {
          id: doc.id,
          sessionId: doc.sessionId,
          status: doc.status,
          formData: doc.formData ? JSON.parse(doc.formData) : null,
          aiResult: doc.aiResult ? JSON.parse(doc.aiResult) : null,
          amountPaid: doc.amountPaid,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      };
    }),

  /**
   * Verifica el estado de pago (polling desde el frontend).
   */
  getStatusTrimestral: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await getPcaDocument(input.id);
      if (!doc) return { status: "not_found" as const };
      return { status: doc.status };
    }),

  /**
   * Lista las PCT de una sesión.
   */
  listMisPcasTrimestral: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const docs = await getPcaDocumentsBySession(input.sessionId);
      return docs
        .filter(d => {
          try {
            const fd = d.formData ? JSON.parse(d.formData) : {};
            return fd.tipo === "trimestral";
          } catch {
            return false;
          }
        })
        .map(d => ({
          id: d.id,
          status: d.status,
          formData: d.formData ? JSON.parse(d.formData) : null,
          createdAt: d.createdAt,
        }));
    }),

  /**
   * Regenera una sección específica de la PCT (post-pago).
   */
  regenerarSeccionTrimestral: publicProcedure
    .input(z.object({
      pcaId: z.number(),
      seccion: z.enum(["objetivos_trimestre", "unidad", "evaluacion_unidad", "titulo_objetivos"]),
      unidadNumero: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const doc = await getPcaDocument(input.pcaId);
      if (!doc || doc.status !== "paid") {
        return { success: false, error: "Documento no encontrado o no pagado" };
      }

      const formData = JSON.parse(doc.formData);
      const aiResult = doc.aiResult ? JSON.parse(doc.aiResult) : {};
      const areaNombre = AREA_NAMES[formData.area] || formData.area;
      const subnivelNombre = SUBNIVEL_NAMES[formData.subnivel] || `Subnivel ${formData.subnivel}`;

      let prompt = "";
      let responseKey = "";

      if (input.seccion === "objetivos_trimestre") {
        prompt = `Genera los objetivos específicos para el ${formData.trimestre} de ${areaNombre} en ${subnivelNombre} ${formData.grado}, alineados al currículo oficial MinEduc Ecuador. Responde SOLO con JSON: {"objetivos_trimestre": "texto completo"}`;
        responseKey = "objetivos_trimestre";
      } else if (input.seccion === "unidad" && input.unidadNumero != null) {
        const unidadForm = formData.unidades.find((u: any) => u.numero === input.unidadNumero);
        if (!unidadForm) return { success: false, error: "Unidad no encontrada" };
        const dcdsTexto = unidadForm.dcdsSeleccionadas.map((d: any) => `- ${d.codigo}: "${d.enunciado}"`).join("\n");
        prompt = `Regenera la Unidad ${input.unidadNumero} de la PCT de ${areaNombre} (${formData.trimestre}) con estas DCD:\n${dcdsTexto}\nDuración: ${unidadForm.duracionSemanas} semanas.\nMetodologías: ${formData.metodologiasActivas.join(", ") || "no especificadas"}.\nTécnicas evaluación: ${formData.tecnicasEvaluacion.join(", ") || "no especificadas"}.\nIMPORTANTE: orientaciones_metodologicas sigue el modelo ${formData.modeloPedagogico === "ACC" ? "ACC (Anticipación, Construcción del conocimiento, Consolidación) — máximo 3 frases breves y generales" : "ERCA (Experiencia, Reflexión, Conceptualización, Aplicación) — máximo 4 frases breves y generales"} — no detallar actividades específicas de clase.
Responde SOLO con JSON: {"titulo":"","objetivos_especificos":"","contenidos":"","orientaciones_metodologicas":"","evaluacion":""}`;
        responseKey = "unidad";
      } else if (input.seccion === "titulo_objetivos" && input.unidadNumero != null) {
        const unidadForm = formData.unidades.find((u: any) => u.numero === input.unidadNumero);
        if (!unidadForm) return { success: false, error: "Unidad no encontrada" };
        const dcdsTexto = unidadForm.dcdsSeleccionadas.map((d: any) => `- ${d.codigo}: "${d.enunciado}"`).join("\n");
        prompt = `Genera el título y los objetivos específicos para la Unidad ${input.unidadNumero} de la PCT de ${areaNombre} (${formData.trimestre}) en ${subnivelNombre} ${formData.grado}.
DCD seleccionadas:\n${dcdsTexto}
Duración: ${unidadForm.duracionSemanas} semanas.
El título debe ser descriptivo y atractivo (máx 60 caracteres). Los objetivos deben estar alineados al currículo oficial MinEduc Ecuador y expresados con verbos en infinitivo observable.
Responde SOLO con JSON: {"titulo": "string", "objetivos_especificos": "string"}`;
        responseKey = "titulo_objetivos";
      } else if (input.seccion === "evaluacion_unidad" && input.unidadNumero != null) {
        const unidadForm = formData.unidades.find((u: any) => u.numero === input.unidadNumero);
        if (!unidadForm) return { success: false, error: "Unidad no encontrada" };
        const dcdsTexto = unidadForm.dcdsSeleccionadas.map((d: any) => `- ${d.codigo}: "${d.enunciado}"`).join("\n");
        prompt = `Genera los indicadores de evaluación para la Unidad ${input.unidadNumero} del PCT de ${areaNombre} ${subnivelNombre} ${formData.grado} (${formData.trimestre}).
DCD trabajadas:\n${dcdsTexto}
Técnicas de evaluación: ${formData.tecnicasEvaluacion.join(", ") || "no especificadas"}.
OBLIGATORIO: 3-5 indicadores de logro específicos, observables y medibles, articulados con las técnicas de evaluación y las DCD listadas. Cada indicador inicia con verbo en infinitivo (ej: Demuestra, Ejecuta, Analiza, Resuelve, Crea).
Responde SOLO con JSON: {"evaluacion": "Indicador 1... Indicador 2... Indicador 3..."}`;
        responseKey = "evaluacion_unidad";
      }

      // Indicadores y objetivos del trimestre salen del catálogo oficial del
      // MinEduc: si el catálogo trae texto para esas DCD no hay nada que
      // regenerar con IA, se devuelve el texto oficial tal cual.
      const oficialSeccion =
        input.seccion === "objetivos_trimestre"
          ? objetivosOficialesTexto(
              formData.unidades?.flatMap((u: any) => u.dcdsSeleccionadas)
            )
          : input.seccion === "evaluacion_unidad" && input.unidadNumero != null
            ? indicadoresOficialesTexto(
                formData.unidades?.find(
                  (u: any) => u.numero === input.unidadNumero
                )?.dcdsSeleccionadas
              )
            : "";

      if (oficialSeccion) {
        if (input.seccion === "objetivos_trimestre") {
          aiResult.objetivosTrimestre = oficialSeccion;
        } else if (input.unidadNumero != null) {
          const idx = aiResult.unidades?.findIndex(
            (u: any) => u.numero === input.unidadNumero
          );
          if (idx >= 0) aiResult.unidades[idx].evaluacion = oficialSeccion;
        }
        await setPcaAiResult(input.pcaId, JSON.stringify(aiResult));
        return { success: true, aiResult };
      }

      try {
        const result = await invokeLLM({
          messages: [
            { role: "system", content: "Eres un asistente pedagógico ecuatoriano. Responde ÚNICAMENTE con JSON válido." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 4096,
        });

        const rawContent = result.choices[0]?.message?.content;
        const content = typeof rawContent === "string" ? rawContent : "{}";
        const parsed = JSON.parse(content);

        if (input.seccion === "titulo_objetivos" && input.unidadNumero != null) {
          const idx = aiResult.unidades?.findIndex((u: any) => u.numero === input.unidadNumero);
          if (idx >= 0) {
            aiResult.unidades[idx] = {
              ...aiResult.unidades[idx],
              titulo: parsed.titulo || aiResult.unidades[idx].titulo,
              objetivosEspecificos: parsed.objetivos_especificos || aiResult.unidades[idx].objetivosEspecificos,
            };
          }
        } else if (input.seccion === "unidad" && input.unidadNumero != null) {
          const idx = aiResult.unidades?.findIndex((u: any) => u.numero === input.unidadNumero);
          if (idx >= 0) {
            aiResult.unidades[idx] = {
              ...aiResult.unidades[idx],
              titulo: parsed.titulo || aiResult.unidades[idx].titulo,
              objetivosEspecificos: parsed.objetivos_especificos || aiResult.unidades[idx].objetivosEspecificos,
              contenidos: parsed.contenidos || aiResult.unidades[idx].contenidos,
              orientacionesMetodologicas: parsed.orientaciones_metodologicas || aiResult.unidades[idx].orientacionesMetodologicas,
              evaluacion: parsed.evaluacion || aiResult.unidades[idx].evaluacion,
            };
          }
        } else if (responseKey === "evaluacion_unidad" && input.unidadNumero != null) {
          const idx = aiResult.unidades?.findIndex((u: any) => u.numero === input.unidadNumero);
          if (idx >= 0 && parsed.evaluacion) {
            aiResult.unidades[idx] = {
              ...aiResult.unidades[idx],
              evaluacion: parsed.evaluacion,
            };
          }
        } else if (responseKey === "objetivos_trimestre") {
          aiResult.objetivosTrimestre = parsed.objetivos_trimestre || aiResult.objetivosTrimestre;
        }

        // Los textos OFICIALES del catálogo MinEduc mandan sobre lo que acaba de
        // redactar la IA, pero SOLO en la unidad regenerada: así no se pisan las
        // ediciones que el docente hizo en las otras.
        if (input.unidadNumero != null) {
          aplicarOficialesUnidadPct(
            aiResult.unidades?.find((u: any) => u.numero === input.unidadNumero),
            formData.unidades?.find((u: any) => u.numero === input.unidadNumero)
          );
        }

        await setPcaAiResult(input.pcaId, JSON.stringify(aiResult));
        return { success: true, aiResult };
      } catch (error: any) {
        return { success: false, error: error.message || "Error al regenerar" };
      }
    }),

  /**
   * Genera título y objetivos para una unidad dada sus DCDs.
   * Valida coherencia: si el docente propuso un tema que no concuerda con las DCDs,
   * devuelve coherente=false con un mensajeAlerta explicativo.
   */
  generarTituloObjetivosUnidad: publicProcedure
    .input(z.object({
      area: z.string(),
      subnivel: z.number(),
      grado: z.string(),
      trimestre: z.string(),
      dcdsSeleccionadas: z.array(z.object({ codigo: z.string(), enunciado: z.string() })),
      tituloPropuesto: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const areaNombre     = AREA_NAMES[input.area] || input.area;
      const subnivelNombre = SUBNIVEL_NAMES[input.subnivel] || `Subnivel ${input.subnivel}`;
      const dcdsTexto      = input.dcdsSeleccionadas
        .map(d => `- ${d.codigo}: "${d.enunciado}"`)
        .join("\n");

      const tituloCtx = input.tituloPropuesto?.trim()
        ? `\nEl docente propone el tema/título: "${input.tituloPropuesto.trim()}"\nAnaliza si este tema es coherente con las DCD listadas. Si NO lo es, devuelve coherente: false con un mensajeAlerta claro indicando qué tema sería más apropiado.`
        : "";

      const prompt = `Eres un experto en currículo educativo ecuatoriano. Genera el título de unidad y los objetivos específicos para una unidad de PCT.

ÁREA: ${areaNombre}
NIVEL/SUBNIVEL: ${subnivelNombre} — ${input.grado}
TRIMESTRE: ${input.trimestre}
DCD seleccionadas:
${dcdsTexto}${tituloCtx}

REGLAS:
- Si las DCD y el tema propuesto son coherentes (o no hay tema propuesto): genera título y objetivos alineados al currículo MinEduc Ecuador. coherente: true.
- Si el tema propuesto NO concuerda con las DCD seleccionadas: coherente: false, deja titulo y objetivosEspecificos vacíos, y en mensajeAlerta explica brevemente la incoherencia y sugiere un tema más adecuado.
- Título: descriptivo y atractivo, máx 70 caracteres.
- Objetivos: redactados con verbos en infinitivo observable, alineados a las DCD.

Responde SOLO con JSON válido:
{"coherente":true,"titulo":"string","objetivosEspecificos":"string","mensajeAlerta":""}`;

      try {
        const result = await invokeLLM({
          messages: [
            { role: "system", content: "Eres un asistente pedagógico ecuatoriano. Responde ÚNICAMENTE con JSON válido." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1024,
        });
        const raw    = result.choices[0]?.message?.content;
        const parsed = JSON.parse(typeof raw === "string" ? raw : "{}");
        // La IA puede devolver arrays/objetivos en vez de strings ("objetivosEspecificos":
        // ["…", "…"]); si se guardan así, el cliente luego revienta con
        // "objetivosEspecificos.trim is not a function". Siempre se normaliza.
        const aTexto = (v: any): string => {
          if (typeof v === "string") return v;
          if (v === null || v === undefined) return "";
          if (Array.isArray(v)) return v.map(aTexto).filter(Boolean).join("\n");
          if (typeof v === "object") return Object.values(v).map(aTexto).filter(Boolean).join("\n");
          return String(v);
        };
        return {
          success:       true,
          coherente:     parsed.coherente !== false,
          titulo:        aTexto(parsed.titulo),
          // Los objetivos oficiales del catálogo MinEduc tienen prioridad sobre
          // los que redacta la IA.
          objetivosEspecificos: conOficial(
            objetivosOficiales(input.dcdsSeleccionadas),
            aTexto(parsed.objetivosEspecificos || parsed.objetivos_especificos)
          ),
          mensajeAlerta: aTexto(parsed.mensajeAlerta),
        };
      } catch (err: any) {
        return { success: false, coherente: false, titulo: "", objetivosEspecificos: "", mensajeAlerta: err.message };
      }
    }),

  /**
   * Guarda ediciones manuales de título y/u objetivos de una unidad.
   */
  actualizarCamposUnidad: publicProcedure
    .input(z.object({
      pcaId: z.number(),
      unidadNumero: z.number(),
      titulo: z.string().optional(),
      objetivosEspecificos: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const doc = await getPcaDocument(input.pcaId);
      if (!doc || doc.status !== "paid") {
        return { success: false, error: "Documento no encontrado o no pagado" };
      }
      const aiResult = doc.aiResult ? JSON.parse(doc.aiResult) : {};
      const idx = aiResult.unidades?.findIndex((u: any) => u.numero === input.unidadNumero);
      if (idx == null || idx < 0) return { success: false, error: "Unidad no encontrada" };
      if (input.titulo !== undefined) aiResult.unidades[idx].titulo = input.titulo;
      if (input.objetivosEspecificos !== undefined) aiResult.unidades[idx].objetivosEspecificos = input.objetivosEspecificos;
      await setPcaAiResult(input.pcaId, JSON.stringify(aiResult));
      return { success: true, aiResult };
    }),
});
