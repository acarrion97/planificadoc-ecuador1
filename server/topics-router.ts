import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";

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

OBLIGATORIO - Taxonomía de Marzano por etapa ERCA:
- EXPERIENCIA: RECUPERACIÓN/COMPRENSIÓN → Reconocer, Recordar, Identificar, Nombrar, Describir, Explicar, Interpretar, Predecir
- REFLEXIÓN: ANÁLISIS/METACOGNICIÓN → Comparar, Clasificar, Analizar, Diferenciar, Evaluar, Reflexionar, Monitorear, Justificar
- CONCEPTUALIZACIÓN: COMPRENSIÓN/ANÁLISIS → Integrar, Representar, Explicar, Resumir, Comparar, Clasificar, Organizar, Generalizar
- APLICACIÓN: UTILIZACIÓN/METACOGNICIÓN → Investigar, Experimentar, Resolver, Aplicar, Diseñar, Construir, Evaluar, Planificar

FORMATO EXACTO DE CADA ACTIVIDAD — REGLA ABSOLUTA:
✅ CORRECTO: "Reconocer figuras geométricas observando objetos del entorno."
✅ CORRECTO: "Identificar características comunes clasificando materiales concretos."
✅ CORRECTO: "Comparar conjuntos según sus atributos mediante preguntas guiadas."
❌ PROHIBIDO: "Los estudiantes reconocerán..." → NUNCA usar sujeto + tiempo verbal
❌ PROHIBIDO: "Se realizarán dinámicas de..." → NUNCA usar voz pasiva refleja
❌ PROHIBIDO: "El docente pedirá que..." → NUNCA describir acción del docente
❌ PROHIBIDO: "Realizar una actividad..." → NUNCA verbos genéricos sin contenido
ESTRUCTURA: VERBO MARZANO EN INFINITIVO + objeto + modo/contexto. Sin sujeto. Sin conjugación.
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
                ? "You are a pedagogical assistant specialized in the Ecuadorian EFL curriculum. You respond ONLY with valid JSON, no additional text. ALL content must be in English. CRITICAL: Every activity MUST start with a Marzano taxonomy verb in infinitive form. NEVER use subject + conjugated verb (e.g. 'Students will...'). NEVER use passive voice (e.g. 'Activities will be...'). Format: VERB + object + context."
                : "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional. CRÍTICO: Cada actividad DEBE iniciar con un verbo de la Taxonomía de Marzano en INFINITIVO. NUNCA usar sujeto + verbo conjugado ('Los estudiantes reconocerán...'). NUNCA usar voz pasiva ('Se realizarán...'). FORMATO: VERBO INFINITIVO + objeto + contexto.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error(isEFL ? "No response received from AI model" : "No se recibió respuesta del modelo de IA");
        }

        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch {
          try {
            parsed = JSON.parse(repairJson(content));
          } catch {
            throw new Error(isEFL ? "The AI returned an incomplete response. Please try again." : "La IA devolvió una respuesta incompleta. Por favor intenta de nuevo.");
          }
        }
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
In the "dua" array for each activity, put true/false for each principle.
CRITICAL: Do NOT include DUA indicators (I:true, R:false, A:true) in the activity text strings. The DUA info goes ONLY in the separate "dua" array.`
        : `\nDUA (Diseño Universal para el Aprendizaje): Para CADA actividad, indica qué principios DUA cubre:
- "I" = Implicación (verde) - motiva e involucra a los estudiantes
- "R" = Representación (rosa) - presenta la información de múltiples formas
- "A" = Acción y Expresión (azul) - permite demostrar el aprendizaje de diferentes maneras
GARANTIZA que en cada etapa ERCA, los 3 principios DUA estén cubiertos entre las actividades.
En el array "dua" de cada actividad, pon true/false para cada principio.
CRÍTICO: NO incluyas indicadores DUA (I:true, R:false, A:true) en el texto de las actividades. La info DUA va SOLO en el array "dua" separado.`;

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

OBLIGATORIO - Taxonomía de Marzano por etapa ERCA:
- EXPERIENCIA: RECUPERACIÓN/COMPRENSIÓN → Reconocer, Recordar, Identificar, Nombrar, Describir, Explicar, Interpretar, Predecir
- REFLEXIÓN: ANÁLISIS/METACOGNICIÓN → Comparar, Clasificar, Analizar, Diferenciar, Evaluar, Reflexionar, Monitorear, Justificar
- CONCEPTUALIZACIÓN: COMPRENSIÓN/ANÁLISIS → Integrar, Representar, Explicar, Resumir, Comparar, Clasificar, Organizar, Generalizar
- APLICACIÓN: UTILIZACIÓN/METACOGNICIÓN → Investigar, Experimentar, Resolver, Aplicar, Diseñar, Construir, Evaluar, Planificar

FORMATO EXACTO DE CADA ACTIVIDAD — REGLA ABSOLUTA:
✅ CORRECTO: "Reconocer figuras geométricas observando objetos del entorno."
✅ CORRECTO: "Identificar características comunes clasificando materiales concretos."
✅ CORRECTO: "Comparar conjuntos según sus atributos mediante preguntas guiadas."
❌ PROHIBIDO: "Los estudiantes reconocerán..." → NUNCA usar sujeto + tiempo verbal
❌ PROHIBIDO: "Se realizarán dinámicas de..." → NUNCA usar voz pasiva refleja
❌ PROHIBIDO: "El docente pedirá que..." → NUNCA describir acción del docente
❌ PROHIBIDO: "Realizar una actividad..." → NUNCA verbos genéricos sin contenido
ESTRUCTURA: VERBO MARZANO EN INFINITIVO + objeto + modo/contexto. Sin sujeto. Sin conjugación.
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
                ? "You are a pedagogical assistant specialized in the Ecuadorian EFL curriculum. You respond ONLY with valid JSON. ALL content in English. CRITICAL: Every activity MUST start with a Marzano taxonomy verb in infinitive form. NEVER use subject + conjugated verb. NEVER use passive voice. Format: VERB + object + context."
                : "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido. CRÍTICO: Cada actividad DEBE iniciar con un verbo de Marzano en INFINITIVO. NUNCA sujeto + conjugado ('Los estudiantes reconocerán...'). NUNCA voz pasiva ('Se realizarán...'). FORMATO: VERBO INFINITIVO + objeto + contexto.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error(isEFL ? "No response from AI" : "Sin respuesta de IA");
        }

        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch {
          try {
            parsed = JSON.parse(repairJson(content));
          } catch {
            throw new Error(isEFL ? "The AI returned an incomplete response. Please try again." : "La IA devolvió una respuesta incompleta. Por favor intenta de nuevo.");
          }
        }

        // Normalizar la estructura y DUA
        const fases = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;
        const estructura: any = {};

        for (const fase of fases) {
          const faseData = parsed.estructura?.[fase];
          // Limpiar texto de actividades: remover patrones DUA que la IA incluye en el texto
          // Patrones: (I:true, R:false, A:true), (I:false, R:true, A:false), etc.
          const rawActividades = Array.isArray(faseData?.actividades) ? faseData.actividades : [];
          const actividades = rawActividades.map((act: any) => {
            if (typeof act !== "string") return String(act);
            return act
              .replace(/\s*\(\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\)\s*/gi, "")
              .replace(/\s*\[\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\]\s*/gi, "")
              .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
              .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
              .trim();
          });
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

  generateWeekPlan: publicProcedure
    .input(
      z.object({
        dias: z.array(
          z.object({
            dia: z.string(),
            horas: z.array(
              z.object({
                horaIndex: z.number(),
                codigoDestreza: z.string(),
                descripcionDestreza: z.string(),
                area: z.string(),
                bloque: z.string().optional(),
                subnivel: z.number().optional(),
                tema: z.string(),
                ejesTransversales: z.array(z.string()).optional(),
                competencias: z.array(z.string()).optional(),
                metodologias: z.array(z.string()).optional(),
                deporteEnfoque: z.string().optional(),
                indicadoresEvaluacion: z.array(z.string()).optional(),
                criteriosEvaluacion: z.array(z.string()).optional(),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Aplanar todos los pares dia+hora en una lista de tasks
      type Task = {
        dia: string;
        diaNumero: number;
        horaIndex: number;
        codigoDestreza: string;
        descripcionDestreza: string;
        area: string;
        bloque?: string;
        subnivel?: number;
        tema: string;
        ejesTransversales?: string[];
        competencias?: string[];
        metodologias?: string[];
        deporteEnfoque?: string;
        indicadoresEvaluacion?: string[];
        criteriosEvaluacion?: string[];
      };

      const DIA_NUMERO: Record<string, number> = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 };

      const tasks: Task[] = [];
      for (const diaConfig of input.dias) {
        for (const hora of diaConfig.horas) {
          tasks.push({ dia: diaConfig.dia, diaNumero: DIA_NUMERO[diaConfig.dia.toLowerCase()] ?? 1, ...hora });
        }
      }

      const areaNames: Record<string, string> = {
        M: "Matemática", LL: "Lengua y Literatura", CN: "Ciencias Naturales",
        CS: "Estudios Sociales", EF: "Educación Física", ECA: "Educación Cultural y Artística",
        EFL: "English as a Foreign Language", "CN.B": "Biología", "CN.Q": "Química",
        "CN.F": "Física", "CS.H": "Historia", "CS.F": "Filosofía",
        EG: "Emprendimiento y Gestión",
      };

      // Función que genera el plan para una sola hora
      async function generateOneHour(task: Task) {
        const isEFL = task.area === "EFL";
        const areaNombre = areaNames[task.area] || task.area;

        const ejesTexto = task.ejesTransversales?.length
          ? isEFL
            ? `\nCROSS-CUTTING THEMES to integrate: ${task.ejesTransversales.join(", ")}`
            : `\nEJES TRANSVERSALES a integrar: ${task.ejesTransversales.join(", ")}`
          : "";

        const competenciasTexto = task.competencias?.length
          ? isEFL
            ? `\nCOMPETENCIES to develop: ${task.competencias.join(", ")}`
            : `\nCOMPETENCIAS a desarrollar: ${task.competencias.join(", ")}`
          : "";

        const duaInstruccion = isEFL
          ? `\nUDL: For EACH activity indicate which UDL principles it covers in the "dua" array: I=Engagement, R=Representation, A=Action&Expression. CRITICAL: Do NOT include DUA in activity text strings.`
          : `\nDUA: Para CADA actividad indica principios DUA en el array "dua": I=Implicación, R=Representación, A=Acción/Expresión. CRÍTICO: NO incluyas DUA en el texto de actividades.`;

        const deporteCtx = task.deporteEnfoque
          ? `\n⚽ DEPORTE SELECCIONADO: "${task.deporteEnfoque}". TODAS las actividades de las fases ERCA DEBEN contextualizarse específicamente a ${task.deporteEnfoque}: usa técnicas, gestos técnicos, situaciones de juego, reglamento y vocabulario propio de este deporte. La evaluación formativa también debe medir habilidades propias de ${task.deporteEnfoque}.`
          : "";

        // Progresión pedagógica por día de la semana (req 2)
        const progresionES = [
          "",
          "\nPROGRESIÓN SEMANAL — DÍA 1 (Lunes): Inicia con actividades concretas, manipulativas y de exploración. Vocabulario simple. Materiales físicos. Actividades de reconocimiento y descripción.",
          "\nPROGRESIÓN SEMANAL — DÍA 2 (Martes): Incrementa complejidad. Introduce comparación y clasificación. Conecta con lo trabajado el día anterior usando nuevas situaciones.",
          "\nPROGRESIÓN SEMANAL — DÍA 3 (Miércoles): Complejidad media. Actividades de análisis e integración de conceptos. Generalización a nuevos contextos.",
          "\nPROGRESIÓN SEMANAL — DÍA 4 (Jueves): Mayor abstracción. Resolución de problemas y aplicación en situaciones nuevas. Mayor autonomía del estudiante.",
          "\nPROGRESIÓN SEMANAL — DÍA 5 (Viernes): Síntesis y cierre. Actividades de diseño, creación o evaluación. Mayor complejidad cognitiva según Marzano. Consolidación de la semana.",
        ];
        const progresionEN = [
          "",
          "\nWEEKLY PROGRESSION — DAY 1 (Monday): Start with concrete, hands-on exploration activities. Simple vocabulary. Physical materials. Recognition and description activities.",
          "\nWEEKLY PROGRESSION — DAY 2 (Tuesday): Increase complexity. Introduce comparison and classification. Connect to prior day using new situations.",
          "\nWEEKLY PROGRESSION — DAY 3 (Wednesday): Medium complexity. Analysis and concept integration. Generalization to new contexts.",
          "\nWEEKLY PROGRESSION — DAY 4 (Thursday): Higher abstraction. Problem-solving and application in new situations. Greater student autonomy.",
          "\nWEEKLY PROGRESSION — DAY 5 (Friday): Synthesis and closure. Design, creation, or evaluation tasks. Higher cognitive complexity. Week consolidation.",
        ];
        const progresionCtx = isEFL
          ? (progresionEN[task.diaNumero] ?? "")
          : (progresionES[task.diaNumero] ?? "");

        // Coherencia curricular — usa solo indicadores/criterios de esta destreza (req 1 & 7)
        const indText = task.indicadoresEvaluacion?.length
          ? task.indicadoresEvaluacion.map(i => `  • ${i}`).join("\n")
          : "";
        const ceText = task.criteriosEvaluacion?.length
          ? task.criteriosEvaluacion.map(c => `  • ${c}`).join("\n")
          : "";
        const coherenciaCtxES = `\nCOHERENCIA CURRICULAR — REGLA ABSOLUTA:\nLos indicadores, criterios y objetivo de evaluación DEBEN derivarse EXCLUSIVAMENTE de la destreza ${task.codigoDestreza}. NUNCA inventes indicadores de otras destrezas o bloques curriculares.${indText ? `\nIndicadores oficiales de esta destreza (basa la evaluación en estos):\n${indText}` : ""}${ceText ? `\nCriterios de evaluación oficiales:\n${ceText}` : ""}`;
        const coherenciaCtxEN = `\nCURRICULAR COHERENCE — ABSOLUTE RULE:\nIndicators, criteria, and evaluation objectives MUST derive EXCLUSIVELY from skill ${task.codigoDestreza}. NEVER invent indicators from other skills or curricular blocks.${indText ? `\nOfficial indicators for this skill (base evaluation on these):\n${indText}` : ""}${ceText ? `\nOfficial evaluation criteria:\n${ceText}` : ""}`;
        const coherenciaCtx = isEFL ? coherenciaCtxEN : coherenciaCtxES;

        // Esquema JSON extendido con evaluacionEstructurada y rubricaSemanal (req 3 & 5)
        const jsonSchemaES = `{"objetivoClase":"string","estructura":{"experiencia":{"titulo":"Experiencia","duracion":"10 minutos","actividades":["string","string","string","string"],"dua":[{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true}]},"reflexion":{"titulo":"Reflexión","duracion":"10 minutos","actividades":["string","string","string","string"],"dua":[{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false}]},"conceptualizacion":{"titulo":"Conceptualización","duracion":"15 minutos","actividades":["string","string","string","string","string"],"dua":[{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":false,"A":true}]},"aplicacion":{"titulo":"Aplicación","duracion":"10 minutos","actividades":["string","string","string","string","string"],"dua":[{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":true},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true},{"I":true,"R":true,"A":true}]}},"recursos":["string","string","string","string","string"],"evaluacionFormativa":"string","evaluacionEstructurada":{"tecnica":"Técnica de evaluación (Observación directa / Prueba oral / Portafolio / Autoevaluación)","instrumento":"Instrumento concreto (Lista de cotejo / Rúbrica / Registro anecdótico / Escala de valoración)","evidencia":"Descripción concreta de qué produce o hace el estudiante como evidencia observable","criterio":"Criterio de logro medible derivado de los indicadores oficiales de la destreza"},"rubricaSemanal":[{"criterio":"Primer criterio de evaluación (máx 60 chars)","excelente":"Siempre Alcanza: descripción del desempeño óptimo y autónomo","satisfactorio":"Alcanza: descripción del desempeño esperado con pequeños errores","enProceso":"Próximo a Alcanzar: desempeño parcial, requiere apoyo del docente","noAlcanza":"No Alcanza: no demuestra el aprendizaje esperado"},{"criterio":"Segundo criterio de evaluación","excelente":"Siempre Alcanza: ...","satisfactorio":"Alcanza: ...","enProceso":"Próximo a Alcanzar: ...","noAlcanza":"No Alcanza: ..."},{"criterio":"Tercer criterio de evaluación","excelente":"Siempre Alcanza: ...","satisfactorio":"Alcanza: ...","enProceso":"Próximo a Alcanzar: ...","noAlcanza":"No Alcanza: ..."}]}`;
        const jsonSchemaEN = `{"objetivoClase":"string","estructura":{"experiencia":{"titulo":"Experience","duracion":"10 minutes","actividades":["string","string","string","string"],"dua":[{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true}]},"reflexion":{"titulo":"Reflection","duracion":"10 minutes","actividades":["string","string","string","string"],"dua":[{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false}]},"conceptualizacion":{"titulo":"Conceptualization","duracion":"15 minutes","actividades":["string","string","string","string","string"],"dua":[{"I":true,"R":true,"A":false},{"I":false,"R":true,"A":true},{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":false},{"I":true,"R":false,"A":true}]},"aplicacion":{"titulo":"Application","duracion":"10 minutes","actividades":["string","string","string","string","string"],"dua":[{"I":true,"R":false,"A":true},{"I":false,"R":true,"A":true},{"I":true,"R":true,"A":false},{"I":false,"R":false,"A":true},{"I":true,"R":true,"A":true}]}},"recursos":["string","string","string","string","string"],"evaluacionFormativa":"string","evaluacionEstructurada":{"tecnica":"Evaluation technique (Direct observation / Oral test / Portfolio / Self-assessment)","instrumento":"Specific instrument (Checklist / Rubric / Anecdotal record / Rating scale)","evidencia":"Concrete description of what the student produces or does as observable evidence","criterio":"Measurable achievement criterion derived from the official skill indicators"},"rubricaSemanal":[{"criterio":"First evaluation criterion (max 60 chars)","excelente":"Always Achieves: description of optimal autonomous performance","satisfactorio":"Achieves: description of expected performance with minor errors","enProceso":"Near Achievement: partial performance, requires teacher support","noAlcanza":"Does Not Achieve: does not demonstrate expected learning"},{"criterio":"Second evaluation criterion","excelente":"Always Achieves: ...","satisfactorio":"Achieves: ...","enProceso":"Near Achievement: ...","noAlcanza":"Does Not Achieve: ..."},{"criterio":"Third evaluation criterion","excelente":"Always Achieves: ...","satisfactorio":"Achieves: ...","enProceso":"Near Achievement: ...","noAlcanza":"Does Not Achieve: ..."}]}`;

        const prompt = isEFL
          ? `Generate a complete 45-minute ERCA lesson plan.\nSKILL: ${task.codigoDestreza}\nAREA: ${areaNombre}\n${task.bloque ? `BLOCK: ${task.bloque}` : ""}${task.subnivel ? `\nSUBLEVEL: ${task.subnivel}` : ""}\nDESCRIPTION: ${task.descripcionDestreza}\nTOPIC: ${task.tema}${ejesTexto}${competenciasTexto}${coherenciaCtx}${progresionCtx}\n\nMANDATORY - Marzano Taxonomy:\n- EXPERIENCE: Recognize, Recall, Identify, Describe, Explain\n- REFLECTION: Compare, Analyze, Evaluate, Reflect, Justify\n- CONCEPTUALIZATION: Integrate, Explain, Summarize, Classify, Generalize\n- APPLICATION: Investigate, Solve, Apply, Design, Construct${duaInstruccion}\n\nRespond ONLY with valid JSON:\n${jsonSchemaEN}`
          : `Genera una planificación ERCA completa de 45 minutos.\nDESTREZA: ${task.codigoDestreza}\nÁREA: ${areaNombre}\n${task.bloque ? `BLOQUE: ${task.bloque}` : ""}${task.subnivel ? `\nSUBNIVEL: ${task.subnivel}` : ""}\nDESCRIPCIÓN: ${task.descripcionDestreza}\nTEMA: ${task.tema}${ejesTexto}${competenciasTexto}${deporteCtx}${coherenciaCtx}${progresionCtx}\n\nOBLIGATORIO - Taxonomía de Marzano:\n- EXPERIENCIA: Reconocer, Recordar, Identificar, Describir, Explicar\n- REFLEXIÓN: Comparar, Analizar, Evaluar, Reflexionar, Justificar\n- CONCEPTUALIZACIÓN: Integrar, Explicar, Resumir, Clasificar, Generalizar\n- APLICACIÓN: Investigar, Resolver, Aplicar, Diseñar, Construir\n\nFORMATO EXACTO DE CADA ACTIVIDAD — REGLA ABSOLUTA:\n✅ CORRECTO: "Reconocer figuras geométricas observando objetos del entorno."\n✅ CORRECTO: "Comparar conjuntos según sus atributos mediante preguntas guiadas."\n❌ PROHIBIDO: "Los estudiantes reconocerán..." → NUNCA sujeto + tiempo verbal\n❌ PROHIBIDO: "Se realizarán dinámicas de..." → NUNCA voz pasiva refleja\n❌ PROHIBIDO: "El docente pedirá que..." → NUNCA acción del docente\nESTRUCTURA: VERBO MARZANO EN INFINITIVO + objeto + modo. Sin sujeto. Sin conjugación.${duaInstruccion}\n\nResponde ÚNICAMENTE con JSON válido:\n${jsonSchemaES}`;

        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: isEFL
                ? "You are a pedagogical assistant specialized in the Ecuadorian EFL curriculum. Respond ONLY with valid JSON. ALL content in English."
                : "Eres un asistente pedagógico especializado en el currículo ecuatoriano. Respondes ÚNICAMENTE con JSON válido.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") throw new Error("Sin respuesta de IA");

        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch {
          parsed = JSON.parse(repairJson(content));
        }

        const fases = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;
        const estructura: any = {};
        for (const fase of fases) {
          const faseData = parsed.estructura?.[fase];
          const rawActividades = Array.isArray(faseData?.actividades) ? faseData.actividades : [];
          const actividades = rawActividades.map((act: any) => {
            if (typeof act !== "string") return String(act);
            return act
              .replace(/\s*\(\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\)\s*/gi, "")
              .replace(/\s*\[\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\]\s*/gi, "")
              .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
              .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
              .trim();
          });
          const duaArr = Array.isArray(faseData?.dua) ? faseData.dua : [];
          const duaActividades = actividades.map((_: any, i: number) => {
            const d = duaArr[i] || {};
            return { implicacion: !!d.I, representacion: !!d.R, accionExpresion: !!d.A };
          });
          const tieneI = duaActividades.some((d: any) => d.implicacion);
          const tieneR = duaActividades.some((d: any) => d.representacion);
          const tieneA = duaActividades.some((d: any) => d.accionExpresion);
          if (duaActividades.length > 0) {
            const last = duaActividades[duaActividades.length - 1];
            if (!tieneI) last.implicacion = true;
            if (!tieneR) last.representacion = true;
            if (!tieneA) last.accionExpresion = true;
          }
          estructura[fase] = {
            titulo: faseData?.titulo || fase,
            duracion: faseData?.duracion || "10 minutos",
            actividades,
            duaActividades,
          };
        }

        const evalEst = parsed.evaluacionEstructurada;
        const rubrica = Array.isArray(parsed.rubricaSemanal) ? parsed.rubricaSemanal : undefined;

        return {
          objetivoClase: parsed.objetivoClase || "",
          estructura,
          recursos: Array.isArray(parsed.recursos) ? parsed.recursos : [],
          evaluacionFormativa: parsed.evaluacionFormativa || "",
          evaluacionEstructurada: evalEst && typeof evalEst === "object" && evalEst.tecnica
            ? { tecnica: evalEst.tecnica, instrumento: evalEst.instrumento, evidencia: evalEst.evidencia, criterio: evalEst.criterio }
            : undefined,
          rubricaSemanal: rubrica?.length ? rubrica : undefined,
        };
      }

      try {
        // Generar todos los planes en paralelo
        const results = await Promise.all(
          tasks.map(async (task) => {
            try {
              const plan = await generateOneHour(task);
              return { dia: task.dia, horaIndex: task.horaIndex, success: true, plan };
            } catch (err: any) {
              return { dia: task.dia, horaIndex: task.horaIndex, success: false, plan: null, error: err.message };
            }
          })
        );

        // Reagrupar por día
        const diasConPlanes: Record<string, { horaIndex: number; plan: any; error?: string }[]> = {};
        for (const r of results) {
          if (!diasConPlanes[r.dia]) diasConPlanes[r.dia] = [];
          diasConPlanes[r.dia].push({ horaIndex: r.horaIndex, plan: r.plan, error: (r as any).error });
        }

        return { success: true, diasConPlanes };
      } catch (error: any) {
        console.error("[topics-router] Error generating week plan:", error);
        return { success: false, diasConPlanes: {}, error: error.message };
      }
    }),
});
