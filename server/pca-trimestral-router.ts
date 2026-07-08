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
  EG: "Emprendimiento y Gestión",
};

const SUBNIVEL_NAMES: Record<number, string> = {
  1: "Preparatoria",
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
    return `Unidad ${u.numero}:\nDCD seleccionadas:\n${dcds}\nDuración: ${u.duracionSemanas} semanas`;
  }).join("\n\n");

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
- Técnicas de evaluación: ${tecnicasTexto}${deporteCtx}

UNIDADES DEL TRIMESTRE:
${unidadesTexto}

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
      "evaluacion": "OBLIGATORIO (no dejar vacío): 3-5 indicadores de logro específicos y observables para las DCD trabajadas, articulados con las técnicas de evaluación elegidas. Cada indicador inicia con verbo en infinitivo observable (ej: Demuestra, Ejecuta, Analiza, Resuelve, Crea).",
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
- El campo "evaluacion" es OBLIGATORIO: NUNCA lo dejes vacío ni como "". Escribe mínimo 3 indicadores de logro específicos y medibles para las DCD de esa unidad
- Los indicadores DEBEN articularse con las técnicas de evaluación elegidas
- Los objetivos del trimestre DEBEN ser específicos para el ${input.trimestre} (no del año completo)
- Usa lenguaje técnico-pedagógico apropiado para el nivel educativo
- Responde SOLO con el JSON, sin nada más`;
}

// ─── Router ──────────────────────────────────────────────────────────────────

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

        // 5. Guardar resultado en BD (status → "generated")
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
      seccion: z.enum(["objetivos_trimestre", "unidad", "evaluacion_unidad"]),
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

        if (input.seccion === "unidad" && input.unidadNumero != null) {
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

        await setPcaAiResult(input.pcaId, JSON.stringify(aiResult));
        return { success: true, aiResult };
      } catch (error: any) {
        return { success: false, error: error.message || "Error al regenerar" };
      }
    }),
});
