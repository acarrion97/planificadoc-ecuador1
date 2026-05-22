import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import {
  createPcaDocument,
  getPcaDocument,
  setPcaAiResult,
  setPcaClientTxId,
  getPcaDocumentsBySession,
} from "./db";
import { TODAS_LAS_DESTREZAS } from "../data/index";

const PCA_PRICE_CENTS = 1499; // $14.99

/** Área names para el prompt */
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

/** Schema de una unidad enviada desde el frontend */
const UnidadSchema = z.object({
  id: z.string(),
  numero: z.number(),
  dcdsSeleccionadas: z.array(z.object({ codigo: z.string(), enunciado: z.string() })),
  duracionSemanas: z.number(),
});

/** Schema completo del formulario */
const FormDataSchema = z.object({
  institucion: z.string(),
  docente: z.string(),
  area: z.string(),
  subnivel: z.number(),
  grado: z.string(),
  anioLectivo: z.string(),
  paralelo: z.string(),
  cargaHorariaSemanal: z.number(),
  semanasTrabajoTotal: z.number(),
  semanasEvaluacion: z.number(),
  usaEjesTransversales: z.boolean(),
  ejesTransversales: z.array(z.string()),
  unidades: z.array(UnidadSchema),
  metodologiasActivas: z.array(z.string()),
  tecnicasEvaluacion: z.array(z.string()),
  bibliografiaDocente: z.string(),
  firmaElaboradoPor: z.string(),
  firmaElaboradoFecha: z.string(),
  firmaRevisadoPor: z.string(),
  firmaRevisadoFecha: z.string(),
  firmaAprobadoPor: z.string(),
  firmaAprobadoFecha: z.string(),
});

/** Construye el prompt para la IA */
function buildPcaPrompt(input: z.infer<typeof FormDataSchema>): string {
  const areaNombre = AREA_NAMES[input.area] || input.area;
  const subnivelNombre = SUBNIVEL_NAMES[input.subnivel] || `Subnivel ${input.subnivel}`;
  const totalSemanas = input.semanasTrabajoTotal - input.semanasEvaluacion;
  const totalPeriodos = totalSemanas * input.cargaHorariaSemanal;

  const ejesTexto = input.usaEjesTransversales && input.ejesTransversales.length > 0
    ? input.ejesTransversales.join(", ")
    : "Ninguno";

  const metodologiasTexto = input.metodologiasActivas.length > 0
    ? input.metodologiasActivas.join(", ")
    : "No especificadas";

  const tecnicasTexto = input.tecnicasEvaluacion.length > 0
    ? input.tecnicasEvaluacion.join(", ")
    : "No especificadas";

  const unidadesTexto = input.unidades.map((u, idx) => {
    const dcdsTexto = u.dcdsSeleccionadas.length > 0
      ? u.dcdsSeleccionadas.map(d => `  - ${d.codigo}: "${d.enunciado}"`).join("\n")
      : "  (Sin DCD específicas seleccionadas)";
    return `Unidad ${u.numero}:\nDCD seleccionadas:\n${dcdsTexto}\nDuración: ${u.duracionSemanas} semanas`;
  }).join("\n\n");

  return `Eres un experto en currículo educativo ecuatoriano. Genera una Planificación Curricular Anual (PCA) completa siguiendo el formato oficial del Ministerio de Educación del Ecuador (Instructivo PCA 2021).

DATOS DEL DOCENTE:
- Institución: ${input.institucion}
- Docente(s): ${input.docente}
- Área/Asignatura: ${areaNombre}
- Subnivel: ${subnivelNombre}
- Grado/Curso: ${input.grado}
- Año lectivo: ${input.anioLectivo}
- Carga horaria semanal: ${input.cargaHorariaSemanal} períodos
- Total semanas de clase: ${totalSemanas}
- Total períodos: ${totalPeriodos}
- Ejes transversales: ${ejesTexto}
- Metodologías activas: ${metodologiasTexto}
- Técnicas de evaluación: ${tecnicasTexto}

UNIDADES PLANIFICADAS POR EL DOCENTE:
${unidadesTexto}

GENERA ÚNICAMENTE JSON con esta estructura exacta, sin texto adicional, sin bloques markdown:
{
  "objetivos_area": "Texto completo de los objetivos del área para el subnivel indicado, alineados al currículo oficial MinEduc",
  "objetivos_grado": "Texto completo de los objetivos específicos del grado/curso indicado",
  "unidades": [
    {
      "numero": 1,
      "titulo": "Título descriptivo y pedagógico de la unidad",
      "objetivos_especificos": "Objetivos específicos de aprendizaje de esta unidad, alineados a las DCD seleccionadas",
      "contenidos": "Contenidos conceptuales, procedimentales y actitudinales organizados por bloque temático",
      "orientaciones_metodologicas": "Estrategias metodológicas activas específicas para esta unidad, considerando las metodologías seleccionadas por el docente",
      "evaluacion": "Criterios de evaluación e indicadores de logro articulados con las técnicas de evaluación seleccionadas",
      "duracion_semanas": número
    }
  ],
  "bibliografia_sugerida": "Referencias bibliográficas en normas APA 7.ª edición, mínimo 5 fuentes actualizadas y pertinentes al área y subnivel",
  "observaciones": "Observaciones pedagógicas generales para la implementación de la PCA, incluyendo atención a la diversidad y principios DUA"
}

REGLAS OBLIGATORIAS:
- Alinea todo al currículo priorizado vigente del Ministerio de Educación del Ecuador
- Los contenidos DEBEN corresponder exactamente a las DCD indicadas por el docente
- Las orientaciones metodológicas DEBEN reflejar las metodologías activas seleccionadas
- Los indicadores DEBEN articularse con las técnicas de evaluación elegidas
- Los objetivos del área DEBEN ser los del currículo oficial para ${areaNombre} en ${subnivelNombre}
- Usa lenguaje técnico-pedagógico apropiado para el nivel de educación
- Responde SOLO con el JSON, sin nada más`;
}

export const pcaRouter = router({
  /**
   * Genera la PCA con IA y la guarda en DB.
   * Retorna el ID del documento para navegar a la vista previa.
   */
  generatePca: publicProcedure
    .input(z.object({
      sessionId: z.string().min(1),
      formData: FormDataSchema,
    }))
    .mutation(async ({ input }) => {
      // 1. Crear documento en BD con status "draft"
      const docId = await createPcaDocument({
        sessionId: input.sessionId,
        status: "draft",
        formData: JSON.stringify(input.formData),
      });

      try {
        // 2. Construir prompt y llamar a la IA
        const prompt = buildPcaPrompt(input.formData);

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

        // 4. Normalizar y validar la estructura
        const aiResult = {
          objetivosArea: parsed.objetivos_area || "",
          objetivosGrado: parsed.objetivos_grado || "",
          unidades: Array.isArray(parsed.unidades)
            ? parsed.unidades.map((u: any) => ({
                numero: u.numero || 1,
                titulo: u.titulo || "Unidad sin título",
                objetivosEspecificos: u.objetivos_especificos || "",
                contenidos: u.contenidos || "",
                orientacionesMetodologicas: u.orientaciones_metodologicas || "",
                evaluacion: u.evaluacion || "",
                duracionSemanas: u.duracion_semanas || 1,
              }))
            : [],
          bibliografiaSugerida: parsed.bibliografia_sugerida || "",
          observaciones: parsed.observaciones || "",
        };

        // 5. Guardar resultado en BD
        await setPcaAiResult(docId, JSON.stringify(aiResult));

        return { success: true, pcaId: docId };
      } catch (error: any) {
        console.error("[pca-router] Error generating PCA:", error);
        // El documento quedó en "draft" — el frontend puede reintentar
        return {
          success: false,
          pcaId: docId,
          error: error.message || "Error al generar la PCA. Intenta de nuevo.",
        };
      }
    }),

  /**
   * Obtiene un documento PCA por ID.
   */
  getPca: publicProcedure
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
   * Verifica el estado de pago de un documento (polling desde el frontend).
   */
  getStatus: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await getPcaDocument(input.id);
      if (!doc) return { status: "not_found" as const };
      return { status: doc.status };
    }),

  /**
   * Lista las PCA de una sesión.
   */
  listMisPcas: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const docs = await getPcaDocumentsBySession(input.sessionId);
      return docs.map(d => ({
        id: d.id,
        status: d.status,
        formData: d.formData ? JSON.parse(d.formData) : null,
        createdAt: d.createdAt,
      }));
    }),

  /**
   * Regenera una sección específica de la PCA (post-pago).
   * Llama a la IA solo para la sección indicada.
   */
  regenerarSeccion: publicProcedure
    .input(z.object({
      pcaId: z.number(),
      seccion: z.enum(["objetivos_area", "objetivos_grado", "unidad", "bibliografia", "observaciones"]),
      unidadNumero: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const doc = await getPcaDocument(input.pcaId);
      if (!doc || doc.status !== "paid") {
        return { success: false, error: "Documento no encontrado o no pagado" };
      }

      const formData = JSON.parse(doc.formData);
      const aiResult = doc.aiResult ? JSON.parse(doc.aiResult) : {};

      // Construir un prompt específico para la sección
      const areaNombre = AREA_NAMES[formData.area] || formData.area;
      const subnivelNombre = SUBNIVEL_NAMES[formData.subnivel] || `Subnivel ${formData.subnivel}`;

      let prompt = "";
      let responseKey = "";

      if (input.seccion === "objetivos_area") {
        prompt = `Genera los objetivos generales del área de ${areaNombre} para el ${subnivelNombre}, alineados al currículo oficial MinEduc Ecuador. Responde SOLO con JSON: {"objetivos_area": "texto completo"}`;
        responseKey = "objetivos_area";
      } else if (input.seccion === "objetivos_grado") {
        prompt = `Genera los objetivos específicos del grado "${formData.grado}" de ${areaNombre}, alineados al currículo oficial MinEduc Ecuador. Responde SOLO con JSON: {"objetivos_grado": "texto completo"}`;
        responseKey = "objetivos_grado";
      } else if (input.seccion === "unidad" && input.unidadNumero != null) {
        const unidadForm = formData.unidades.find((u: any) => u.numero === input.unidadNumero);
        if (!unidadForm) return { success: false, error: "Unidad no encontrada" };
        const dcdsTexto = unidadForm.dcdsSeleccionadas.map((d: any) => `- ${d.codigo}: "${d.enunciado}"`).join("\n");
        prompt = `Regenera la Unidad ${input.unidadNumero} de la PCA de ${areaNombre} con estas DCD:\n${dcdsTexto}\nDuración: ${unidadForm.duracionSemanas} semanas.\nMetodologías: ${formData.metodologiasActivas.join(", ") || "no especificadas"}.\nTécnicas evaluación: ${formData.tecnicasEvaluacion.join(", ") || "no especificadas"}.\nResponde SOLO con JSON: {"titulo":"","objetivos_especificos":"","contenidos":"","orientaciones_metodologicas":"","evaluacion":""}`;
        responseKey = "unidad";
      } else if (input.seccion === "bibliografia") {
        prompt = `Genera bibliografía adicional en APA 7.ª edición para ${areaNombre} ${subnivelNombre} con mínimo 5 referencias actualizadas y pertinentes. Responde SOLO con JSON: {"bibliografia_sugerida": "referencias"}`;
        responseKey = "bibliografia_sugerida";
      } else if (input.seccion === "observaciones") {
        prompt = `Genera observaciones pedagógicas para la implementación de la PCA de ${areaNombre} ${subnivelNombre}, incluyendo atención a la diversidad y principios DUA. Responde SOLO con JSON: {"observaciones": "texto"}`;
        responseKey = "observaciones";
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

        // Actualizar solo la sección correspondiente en aiResult
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
        } else if (responseKey === "objetivos_area") {
          aiResult.objetivosArea = parsed.objetivos_area || aiResult.objetivosArea;
        } else if (responseKey === "objetivos_grado") {
          aiResult.objetivosGrado = parsed.objetivos_grado || aiResult.objetivosGrado;
        } else if (responseKey === "bibliografia_sugerida") {
          aiResult.bibliografiaSugerida = parsed.bibliografia_sugerida || aiResult.bibliografiaSugerida;
        } else if (responseKey === "observaciones") {
          aiResult.observaciones = parsed.observaciones || aiResult.observaciones;
        }

        await setPcaAiResult(input.pcaId, JSON.stringify(aiResult));
        return { success: true, aiResult };
      } catch (error: any) {
        return { success: false, error: error.message || "Error al regenerar" };
      }
    }),
});
