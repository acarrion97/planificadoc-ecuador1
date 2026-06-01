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
- Técnicas de evaluación: ${tecnicasTexto}

UNIDADES DEL TRIMESTRE:
${unidadesTexto}

GENERA ÚNICAMENTE JSON con esta estructura exacta, sin texto adicional, sin bloques markdown:
{
  "objetivosTrimestre": "Objetivos específicos de aprendizaje para el ${input.trimestre}, alineados al currículo oficial MinEduc para ${areaNombre} en ${subnivelNombre} ${input.grado}. Articular con la progresión curricular del año lectivo.",
  "unidades": [
    {
      "numero": 1,
      "titulo": "Título descriptivo y pedagógico de la unidad",
      "objetivosEspecificos": "Objetivos específicos de aprendizaje de esta unidad, alineados a las DCD seleccionadas",
      "contenidos": "Contenidos conceptuales, procedimentales y actitudinales organizados temáticamente",
      "orientacionesMetodologicas": "${input.modeloPedagogico === "ACC" ? "Descripción breve del proceso de enseñanza-aprendizaje usando el modelo ACC: Anticipación (activación de conocimientos previos y motivación), Construcción del conocimiento (desarrollo del nuevo aprendizaje con recursos y estrategias activas) y Consolidación (aplicación, síntesis y transferencia). Máximo 3 frases, una por fase. Sin detallar actividades específicas de clase." : "Descripción breve del proceso de enseñanza-aprendizaje usando el método ERCA: Experiencia (activación de saberes previos), Reflexión (análisis y cuestionamiento), Conceptualización (construcción del conocimiento) y Aplicación (práctica en contexto). Máximo 4 frases, una por fase. Sin detallar actividades específicas de clase."}",
      "evaluacion": "Criterios de evaluación e indicadores de logro articulados con las técnicas de evaluación seleccionadas",
      "duracionSemanas": número
    }
  ]
}

REGLAS OBLIGATORIAS:
- Alinea todo al currículo priorizado vigente del Ministerio de Educación del Ecuador
- Los contenidos DEBEN corresponder exactamente a las DCD indicadas por el docente
- Las orientaciones metodológicas siguen el modelo ${input.modeloPedagogico === "ACC" ? "ACC (3 fases: Anticipación, Construcción, Consolidación)" : "ERCA (4 fases: Experiencia, Reflexión, Conceptualización, Aplicación)"}, son breves y generales — NO detalles de actividades de clase
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
          max_tokens: 8192,
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
            ? parsed.unidades.map((u: any) => ({
                numero: u.numero || 1,
                titulo: toStr(u.titulo) || "Unidad sin título",
                objetivosEspecificos: toStr(u.objetivos_especificos || u.objetivosEspecificos),
                contenidos: toStr(u.contenidos),
                orientacionesMetodologicas: toStr(u.orientaciones_metodologicas || u.orientacionesMetodologicas),
                evaluacion: toStr(u.evaluacion),
                duracionSemanas: u.duracion_semanas || u.duracionSemanas || 1,
              }))
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
      seccion: z.enum(["objetivos_trimestre", "unidad"]),
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
