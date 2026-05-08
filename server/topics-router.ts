import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

/**
 * Router tRPC para generación de temas y planificaciones con IA.
 * - generateAi: Genera 2 temas alternativos basados en el tema del docente
 * - generatePlan: Genera la planificación ERCA completa con Marzano + DUA
 */
export const topicsRouter = router({
  /**
   * Genera 2 temas alternativos basados en el tema que el docente escribió.
   * El docente escribe su propio tema y la IA sugiere 2 variaciones.
   */
  generateAi: publicProcedure
    .input(
      z.object({
        codigoDestreza: z.string().min(1),
        descripcionDestreza: z.string().min(10),
        area: z.string().min(1),
        bloque: z.string().optional(),
        subnivel: z.number().optional(),
        temaDocente: z.string().optional(),
        temasExistentes: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { codigoDestreza, descripcionDestreza, area, bloque, subnivel, temaDocente, temasExistentes } = input;

      const isEFL = area === "EFL";
      const temasExistentesTexto = temasExistentes?.length
        ? isEFL
          ? `\n\nIMPORTANT: These topics already exist, DO NOT repeat them:\n${temasExistentes.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
          : `\n\nIMPORTANTE: Ya existen estos temas, NO los repitas:\n${temasExistentes.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
        : "";

      const areaNames: Record<string, string> = {
        M: "Matemática",
        LL: "Lengua y Literatura",
        CN: "Ciencias Naturales",
        CS: "Estudios Sociales",
        EF: "Educación Física",
        ECA: "Educación Cultural y Artística",
        EFL: "English as a Foreign Language",
      };

      const areaNombre = areaNames[area] || area;
      const temaBase = temaDocente ? (isEFL ? `\nTEACHER'S TOPIC: "${temaDocente}"\nGenerate 2 ALTERNATIVE topics related to the teacher's topic but with different approaches.` : `\nTEMA DEL DOCENTE: "${temaDocente}"\nGenera 2 temas ALTERNATIVOS relacionados con el tema del docente pero con enfoques diferentes.`) : "";

      const prompt = isEFL
        ? `You are an expert in pedagogy and the Ecuadorian EFL curriculum. Generate 2 CREATIVE and SPECIFIC class topics for the following skill.

SKILL: ${codigoDestreza}
AREA: ${areaNombre}
${bloque ? `BLOCK: ${bloque}` : ""}
${subnivel ? `SUBLEVEL: ${subnivel}` : ""}
DESCRIPTION: ${descripcionDestreza}${temaBase}${temasExistentesTexto}

For EACH topic generate:
1. A creative and engaging title (max 60 characters)
2. A brief class description (max 100 characters)
3. The specific learning objective
4. A 45-minute class structure with 4 ERCA phases:
   - EXPERIENCE (10 minutes): 4 activities
   - REFLECTION (10 minutes): 4 activities
   - CONCEPTUALIZATION (15 minutes): 5 activities
   - APPLICATION (10 minutes): 5 activities
5. List of 5 required resources
6. Formative assessment (technique and instrument)

MANDATORY - Use Marzano's Taxonomy verbs for each ERCA stage:
- EXPERIENCE: Use RETRIEVAL and COMPREHENSION verbs (Recognize, Recall, Identify, Name, Describe, Explain, Interpret, Predict)
- REFLECTION: Use ANALYSIS and METACOGNITION verbs (Compare, Classify, Analyze, Differentiate, Evaluate, Reflect, Monitor, Justify)
- CONCEPTUALIZATION: Use COMPREHENSION and ANALYSIS verbs (Integrate, Represent, Explain, Summarize, Compare, Classify, Organize, Generalize)
- APPLICATION: Use KNOWLEDGE UTILIZATION and METACOGNITION verbs (Investigate, Experiment, Solve, Apply, Design, Construct, Evaluate, Plan)

Each activity MUST start with one of these Marzano verbs. NEVER use generic verbs like "Do", "Make", "Work".
- Topics must be CONTEXTUALIZED to Ecuadorian reality
- ALL content must be in ENGLISH
- DO NOT use emojis

Respond ONLY with valid JSON:
{
  "temas": [
    {
      "titulo": "string",
      "descripcionBreve": "string",
      "objetivoClase": "string",
      "estructura": {
        "experiencia": { "titulo": "Experience", "duracion": "10 minutes", "actividades": ["string","string","string","string"] },
        "reflexion": { "titulo": "Reflection", "duracion": "10 minutes", "actividades": ["string","string","string","string"] },
        "conceptualizacion": { "titulo": "Conceptualization", "duracion": "15 minutes", "actividades": ["string","string","string","string","string"] },
        "aplicacion": { "titulo": "Application", "duracion": "10 minutes", "actividades": ["string","string","string","string","string"] }
      },
      "recursos": ["string","string","string","string","string"],
      "evaluacionFormativa": "string"
    }
  ]
}`
        : `Eres un experto en pedagogía y currículo educativo ecuatoriano. Genera 2 temas de clase CREATIVOS y ESPECÍFICOS para la siguiente destreza.

DESTREZA: ${codigoDestreza}
ÁREA: ${areaNombre}
${bloque ? `BLOQUE: ${bloque}` : ""}
${subnivel ? `SUBNIVEL: ${subnivel}` : ""}
DESCRIPCIÓN: ${descripcionDestreza}${temaBase}${temasExistentesTexto}

Para CADA tema genera:
1. Un título creativo y atractivo (máximo 60 caracteres)
2. Una descripción breve de la clase (máximo 100 caracteres)
3. El objetivo de aprendizaje específico
4. Estructura de clase de 45 minutos con 4 fases ERCA:
   - EXPERIENCIA (10 minutos): 4 actividades
   - REFLEXIÓN (10 minutos): 4 actividades
   - CONCEPTUALIZACIÓN (15 minutos): 5 actividades
   - APLICACIÓN (10 minutos): 5 actividades
5. Lista de 5 recursos necesarios
6. Evaluación formativa (técnica e instrumento)

OBLIGATORIO - Usar verbos de la Taxonomía de Marzano para cada etapa ERCA:
- EXPERIENCIA: Usar verbos de RECUPERACIÓN y COMPRENSIÓN (Reconocer, Recordar, Identificar, Nombrar, Describir, Explicar, Interpretar, Predecir)
- REFLEXIÓN: Usar verbos de ANÁLISIS y METACOGNICIÓN (Comparar, Clasificar, Analizar, Diferenciar, Evaluar, Reflexionar, Monitorear, Justificar)
- CONCEPTUALIZACIÓN: Usar verbos de COMPRENSIÓN y ANÁLISIS (Integrar, Representar, Explicar, Resumir, Comparar, Clasificar, Organizar, Generalizar)
- APLICACIÓN: Usar verbos de UTILIZACIÓN DEL CONOCIMIENTO y METACOGNICIÓN (Investigar, Experimentar, Resolver, Aplicar, Diseñar, Construir, Evaluar, Planificar)

Cada actividad DEBE iniciar con uno de estos verbos de Marzano. NUNCA usar infinitivos genéricos como "Realizar", "Hacer", "Trabajar".
- Los temas deben ser CONTEXTUALIZADOS a la realidad ecuatoriana
- Usa español correcto con tildes y ñ
- NO uses emojis

Responde ÚNICAMENTE con un JSON válido:
{
  "temas": [
    {
      "titulo": "string",
      "descripcionBreve": "string",
      "objetivoClase": "string",
      "estructura": {
        "experiencia": { "titulo": "Experiencia", "duracion": "10 minutos", "actividades": ["string","string","string","string"] },
        "reflexion": { "titulo": "Reflexión", "duracion": "10 minutos", "actividades": ["string","string","string","string"] },
        "conceptualizacion": { "titulo": "Conceptualización", "duracion": "15 minutos", "actividades": ["string","string","string","string","string"] },
        "aplicacion": { "titulo": "Aplicación", "duracion": "10 minutos", "actividades": ["string","string","string","string","string"] }
      },
      "recursos": ["string","string","string","string","string"],
      "evaluacionFormativa": "string"
    }
  ]
}`;

      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: isEFL
                ? "You are a pedagogical assistant specialized in the Ecuadorian EFL curriculum. You respond ONLY with valid JSON, no additional text. ALL content must be in English."
                : "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error(isEFL ? "No response received from AI model" : "No se recibió respuesta del modelo de IA");
        }

        const parsed = JSON.parse(content);
        if (!parsed.temas || !Array.isArray(parsed.temas)) {
          throw new Error(isEFL ? "AI response does not have the expected format" : "La respuesta de IA no tiene el formato esperado");
        }

        const temasConId = parsed.temas.map((tema: any) => ({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
          titulo: tema.titulo || (isEFL ? "AI-generated topic" : "Tema generado por IA"),
          descripcionBreve: tema.descripcionBreve || "",
          objetivoClase: tema.objetivoClase || "",
          estructura: {
            experiencia: {
              titulo: tema.estructura?.experiencia?.titulo || (isEFL ? "Experience" : "Experiencia"),
              duracion: tema.estructura?.experiencia?.duracion || (isEFL ? "10 minutes" : "10 minutos"),
              actividades: Array.isArray(tema.estructura?.experiencia?.actividades)
                ? tema.estructura.experiencia.actividades
                : [isEFL ? "Identify prior knowledge through experiences." : "Identificar conocimientos previos mediante vivencias."],
            },
            reflexion: {
              titulo: tema.estructura?.reflexion?.titulo || (isEFL ? "Reflection" : "Reflexión"),
              duracion: tema.estructura?.reflexion?.duracion || (isEFL ? "10 minutes" : "10 minutos"),
              actividades: Array.isArray(tema.estructura?.reflexion?.actividades)
                ? tema.estructura.reflexion.actividades
                : [isEFL ? "Analyze the experience through guided questions." : "Analizar la experiencia mediante preguntas dirigidas."],
            },
            conceptualizacion: {
              titulo: tema.estructura?.conceptualizacion?.titulo || (isEFL ? "Conceptualization" : "Conceptualización"),
              duracion: tema.estructura?.conceptualizacion?.duracion || (isEFL ? "15 minutes" : "15 minutos"),
              actividades: Array.isArray(tema.estructura?.conceptualizacion?.actividades)
                ? tema.estructura.conceptualizacion.actividades
                : [isEFL ? "Explain the formal content." : "Explicar el contenido formal."],
            },
            aplicacion: {
              titulo: tema.estructura?.aplicacion?.titulo || (isEFL ? "Application" : "Aplicación"),
              duracion: tema.estructura?.aplicacion?.duracion || (isEFL ? "10 minutes" : "10 minutos"),
              actividades: Array.isArray(tema.estructura?.aplicacion?.actividades)
                ? tema.estructura.aplicacion.actividades
                : [isEFL ? "Apply learning to practical exercises." : "Aplicar lo aprendido a ejercicios prácticos."],
            },
          },
          recursos: Array.isArray(tema.recursos) ? tema.recursos : [isEFL ? "Student textbook" : "Texto del estudiante"],
          evaluacionFormativa: tema.evaluacionFormativa || (isEFL ? "Direct observation and anecdotal record." : "Observación directa y registro anecdótico."),
          generadoPorIA: true,
        }));

        return { success: true, temas: temasConId };
      } catch (error: any) {
        console.error("[topics-router] Error generating AI topics:", error);
        return {
          success: false,
          temas: [],
          error: error.message || (isEFL ? "Error generating AI topics" : "Error al generar temas con IA"),
        };
      }
    }),

  /**
   * Genera la planificación ERCA completa con:
   * - Verbos de Taxonomía de Marzano por etapa
   * - Indicadores DUA (3 principios) por actividad
   * - Ejes transversales integrados (si aplica)
   * - Competencias transversalizadas (si aplica)
   */
  generatePlan: publicProcedure
    .input(
      z.object({
        codigoDestreza: z.string().min(1),
        descripcionDestreza: z.string().min(10),
        area: z.string().min(1),
        bloque: z.string().optional(),
        subnivel: z.number().optional(),
        tema: z.string().min(1),
        ejesTransversales: z.array(z.string()).optional(),
        competencias: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { codigoDestreza, descripcionDestreza, area, bloque, subnivel, tema, ejesTransversales, competencias } = input;

      const isEFL = area === "EFL";

      const areaNames: Record<string, string> = {
        M: "Matemática", LL: "Lengua y Literatura", CN: "Ciencias Naturales",
        CS: "Estudios Sociales", EF: "Educación Física", ECA: "Educación Cultural y Artística",
        EFL: "English as a Foreign Language",
      };
      const areaNombre = areaNames[area] || area;

      const ejesTexto = ejesTransversales?.length
        ? isEFL
          ? `\nCROSS-CUTTING THEMES to integrate: ${ejesTransversales.join(", ")}\nYou MUST naturally integrate these themes into the activities.`
          : `\nEJES TRANSVERSALES a integrar: ${ejesTransversales.join(", ")}\nDEBES integrar estos ejes de forma natural en las actividades.`
        : "";

      const competenciasTexto = competencias?.length
        ? isEFL
          ? `\nCOMPETENCIES to develop: ${competencias.join(", ")}\nYou MUST transversalize these competencies across the activities.`
          : `\nCOMPETENCIAS a desarrollar: ${competencias.join(", ")}\nDEBES transversalizar estas competencias en las actividades.`
        : "";

      const duaInstruccion = isEFL
        ? `\nUDL (Universal Design for Learning): For EACH activity, indicate which UDL principles it covers:
- "I" = Engagement (green) - motivates and involves students
- "R" = Representation (pink) - presents information in multiple ways
- "A" = Action & Expression (blue) - allows students to demonstrate learning in different ways
GUARANTEE that in each ERCA stage, ALL 3 UDL principles are covered across the activities.
In the "dua" array for each activity, put true/false for each principle.`
        : `\nDUA (Diseño Universal para el Aprendizaje): Para CADA actividad, indica qué principios DUA cubre:
- "I" = Implicación (verde) - motiva e involucra a los estudiantes
- "R" = Representación (rosa) - presenta la información de múltiples formas
- "A" = Acción y Expresión (azul) - permite demostrar el aprendizaje de diferentes maneras
GARANTIZA que en cada etapa ERCA, los 3 principios DUA estén cubiertos entre las actividades.
En el array "dua" de cada actividad, pon true/false para cada principio.`;

      const prompt = isEFL
        ? `Generate a complete 45-minute ERCA lesson plan.

SKILL: ${codigoDestreza}
AREA: ${areaNombre}
${bloque ? `BLOCK: ${bloque}` : ""}
${subnivel ? `SUBLEVEL: ${subnivel}` : ""}
DESCRIPTION: ${descripcionDestreza}
TOPIC: ${tema}${ejesTexto}${competenciasTexto}

MANDATORY - Use Marzano's Taxonomy verbs:
- EXPERIENCE: RETRIEVAL/COMPREHENSION verbs (Recognize, Recall, Identify, Name, Describe, Explain, Interpret, Predict)
- REFLECTION: ANALYSIS/METACOGNITION verbs (Compare, Classify, Analyze, Differentiate, Evaluate, Reflect, Monitor, Justify)
- CONCEPTUALIZATION: COMPREHENSION/ANALYSIS verbs (Integrate, Represent, Explain, Summarize, Compare, Classify, Organize, Generalize)
- APPLICATION: KNOWLEDGE UTILIZATION/METACOGNITION verbs (Investigate, Experiment, Solve, Apply, Design, Construct, Evaluate, Plan)
${duaInstruccion}

Respond ONLY with valid JSON:
{
  "objetivoClase": "string",
  "estructura": {
    "experiencia": { "titulo": "Experience", "duracion": "10 minutes", "actividades": ["string","string","string","string"], "dua": [{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true}] },
    "reflexion": { "titulo": "Reflection", "duracion": "10 minutes", "actividades": ["string","string","string","string"], "dua": [{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false}] },
    "conceptualizacion": { "titulo": "Conceptualization", "duracion": "15 minutes", "actividades": ["string","string","string","string","string"], "dua": [{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":false,"A":true}] },
    "aplicacion": { "titulo": "Application", "duracion": "10 minutes", "actividades": ["string","string","string","string","string"], "dua": [{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":true},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true},{"I":true,"R":true,"A":true}] }
  },
  "recursos": ["string","string","string","string","string"],
  "evaluacionFormativa": "string"
}`
        : `Genera una planificación ERCA completa de 45 minutos.

DESTREZA: ${codigoDestreza}
ÁREA: ${areaNombre}
${bloque ? `BLOQUE: ${bloque}` : ""}
${subnivel ? `SUBNIVEL: ${subnivel}` : ""}
DESCRIPCIÓN: ${descripcionDestreza}
TEMA: ${tema}${ejesTexto}${competenciasTexto}

OBLIGATORIO - Usar verbos de la Taxonomía de Marzano:
- EXPERIENCIA: Verbos de RECUPERACIÓN/COMPRENSIÓN (Reconocer, Recordar, Identificar, Nombrar, Describir, Explicar, Interpretar, Predecir)
- REFLEXIÓN: Verbos de ANÁLISIS/METACOGNICIÓN (Comparar, Clasificar, Analizar, Diferenciar, Evaluar, Reflexionar, Monitorear, Justificar)
- CONCEPTUALIZACIÓN: Verbos de COMPRENSIÓN/ANÁLISIS (Integrar, Representar, Explicar, Resumir, Comparar, Clasificar, Organizar, Generalizar)
- APLICACIÓN: Verbos de UTILIZACIÓN/METACOGNICIÓN (Investigar, Experimentar, Resolver, Aplicar, Diseñar, Construir, Evaluar, Planificar)
${duaInstruccion}

Responde ÚNICAMENTE con JSON válido:
{
  "objetivoClase": "string",
  "estructura": {
    "experiencia": { "titulo": "Experiencia", "duracion": "10 minutos", "actividades": ["string","string","string","string"], "dua": [{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true}] },
    "reflexion": { "titulo": "Reflexión", "duracion": "10 minutos", "actividades": ["string","string","string","string"], "dua": [{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false}] },
    "conceptualizacion": { "titulo": "Conceptualización", "duracion": "15 minutos", "actividades": ["string","string","string","string","string"], "dua": [{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":false,"A":true}] },
    "aplicacion": { "titulo": "Aplicación", "duracion": "10 minutos", "actividades": ["string","string","string","string","string"], "dua": [{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":true},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true},{"I":true,"R":true,"A":true}] }
  },
  "recursos": ["string","string","string","string","string"],
  "evaluacionFormativa": "string"
}`;

      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: isEFL
                ? "You are a pedagogical assistant specialized in the Ecuadorian EFL curriculum. You respond ONLY with valid JSON. ALL content in English."
                : "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error(isEFL ? "No response from AI" : "Sin respuesta de IA");
        }

        const parsed = JSON.parse(content);

        // Normalizar la estructura y DUA
        const fases = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;
        const estructura: any = {};

        for (const fase of fases) {
          const faseData = parsed.estructura?.[fase];
          const actividades = Array.isArray(faseData?.actividades) ? faseData.actividades : [];
          const duaArr = Array.isArray(faseData?.dua) ? faseData.dua : [];

          // Normalizar DUA: asegurar que los 3 principios estén cubiertos en la fase
          const duaActividades = actividades.map((_: any, i: number) => {
            const d = duaArr[i] || {};
            return {
              implicacion: !!d.I,
              representacion: !!d.R,
              accionExpresion: !!d.A,
            };
          });

          // Verificar cobertura: si algún principio no está cubierto, forzar en la última actividad
          const tieneImplicacion = duaActividades.some((d: any) => d.implicacion);
          const tieneRepresentacion = duaActividades.some((d: any) => d.representacion);
          const tieneAccion = duaActividades.some((d: any) => d.accionExpresion);

          if (duaActividades.length > 0) {
            const last = duaActividades[duaActividades.length - 1];
            if (!tieneImplicacion) last.implicacion = true;
            if (!tieneRepresentacion) last.representacion = true;
            if (!tieneAccion) last.accionExpresion = true;
          }

          estructura[fase] = {
            titulo: faseData?.titulo || fase,
            duracion: faseData?.duracion || "10 minutos",
            actividades,
            duaActividades,
          };
        }

        return {
          success: true,
          plan: {
            objetivoClase: parsed.objetivoClase || "",
            estructura,
            recursos: Array.isArray(parsed.recursos) ? parsed.recursos : [],
            evaluacionFormativa: parsed.evaluacionFormativa || "",
          },
        };
      } catch (error: any) {
        console.error("[topics-router] Error generating plan:", error);
        return {
          success: false,
          plan: null,
          error: error.message || (isEFL ? "Error generating plan" : "Error al generar planificación"),
        };
      }
    }),
});
