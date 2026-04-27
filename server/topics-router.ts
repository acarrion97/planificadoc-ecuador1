import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

/**
 * Router tRPC para generación de temas con IA.
 * Genera temas de clase personalizados para una destreza específica
 * usando el LLM integrado del servidor.
 */
export const topicsRouter = router({
  generateAi: publicProcedure
    .input(
      z.object({
        codigoDestreza: z.string().min(1),
        descripcionDestreza: z.string().min(10),
        area: z.string().min(1),
        bloque: z.string().optional(),
        subnivel: z.number().optional(),
        temasExistentes: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { codigoDestreza, descripcionDestreza, area, bloque, subnivel, temasExistentes } = input;

      const temasExistentesTexto = temasExistentes?.length
        ? `\n\nIMPORTANTE: Ya existen estos temas sugeridos, NO los repitas. Genera temas DIFERENTES:\n${temasExistentes.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
        : "";

      const areaNames: Record<string, string> = {
        M: "Matemática",
        LL: "Lengua y Literatura",
        CN: "Ciencias Naturales",
        CS: "Estudios Sociales",
        EF: "Educación Física",
        ECA: "Educación Cultural y Artística",
      };

      const areaNombre = areaNames[area] || area;

      const prompt = `Eres un experto en pedagogía y currículo educativo ecuatoriano. Genera 3 temas de clase CREATIVOS y ESPECÍFICOS para la siguiente destreza del currículo ecuatoriano.

DESTREZA: ${codigoDestreza}
ÁREA: ${areaNombre}
${bloque ? `BLOQUE: ${bloque}` : ""}
${subnivel ? `SUBNIVEL: ${subnivel}` : ""}
DESCRIPCIÓN: ${descripcionDestreza}
${temasExistentesTexto}

Para CADA tema genera:
1. Un título creativo y atractivo (máximo 60 caracteres)
2. Una descripción breve de la clase (máximo 100 caracteres)
3. El objetivo de aprendizaje específico
4. Estructura de clase de 45 minutos con 4 fases ERCA:
   - EXPERIENCIA (10 minutos): 4 actividades de activación de conocimientos previos y vivencias
   - REFLEXIÓN (10 minutos): 4 actividades de análisis y cuestionamiento de la experiencia
   - CONCEPTUALIZACIÓN (15 minutos): 5 actividades de construcción formal del conocimiento
   - APLICACIÓN (10 minutos): 5 actividades de transferencia y práctica del aprendizaje
5. Lista de 5 recursos necesarios
6. Evaluación formativa (técnica e instrumento)

IMPORTANTE:
- Los temas deben ser CONTEXTUALIZADOS a la realidad ecuatoriana
- Las actividades deben ser PRÁCTICAS y APLICABLES en el aula
- Cada tema debe tener un enfoque diferente (teórico, práctico, lúdico)
- TODAS las actividades DEBEN comenzar con un VERBO EN INFINITIVO (Presentar, Realizar, Explicar, Solicitar, Guiar, Organizar, etc.). NUNCA uses sustantivos (Presentación, Realización, Introducción, Uso, Trabajo). Ejemplo correcto: "Presentar el tema mediante un video" NO "Presentación del tema mediante un video"
- Usa español correcto con tildes y ñ
- NO uses emojis

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "temas": [
    {
      "titulo": "string",
      "descripcionBreve": "string",
      "objetivoClase": "string",
      "estructura": {
        "experiencia": {
          "titulo": "Experiencia",
          "duracion": "10 minutos",
          "actividades": ["string", "string", "string", "string"]
        },
        "reflexion": {
          "titulo": "Reflexión",
          "duracion": "10 minutos",
          "actividades": ["string", "string", "string", "string"]
        },
        "conceptualizacion": {
          "titulo": "Conceptualización",
          "duracion": "15 minutos",
          "actividades": ["string", "string", "string", "string", "string"]
        },
        "aplicacion": {
          "titulo": "Aplicación",
          "duracion": "10 minutos",
          "actividades": ["string", "string", "string", "string", "string"]
        }
      },
      "recursos": ["string", "string", "string", "string", "string"],
      "evaluacionFormativa": "string"
    }
  ]
}`;

      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("No se recibió respuesta del modelo de IA");
        }

        // Parse the JSON response
        const parsed = JSON.parse(content);

        if (!parsed.temas || !Array.isArray(parsed.temas)) {
          throw new Error("La respuesta de IA no tiene el formato esperado");
        }

        // Validate and add IDs to each tema
        const temasConId = parsed.temas.map((tema: any) => ({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
          titulo: tema.titulo || "Tema generado por IA",
          descripcionBreve: tema.descripcionBreve || "",
          objetivoClase: tema.objetivoClase || "",
          estructura: {
            experiencia: {
              titulo: tema.estructura?.experiencia?.titulo || "Experiencia",
              duracion: tema.estructura?.experiencia?.duracion || "10 minutos",
              actividades: Array.isArray(tema.estructura?.experiencia?.actividades)
                ? tema.estructura.experiencia.actividades
                : ["Activar conocimientos previos mediante vivencias."],
            },
            reflexion: {
              titulo: tema.estructura?.reflexion?.titulo || "Reflexión",
              duracion: tema.estructura?.reflexion?.duracion || "10 minutos",
              actividades: Array.isArray(tema.estructura?.reflexion?.actividades)
                ? tema.estructura.reflexion.actividades
                : ["Formular preguntas de análisis sobre la experiencia."],
            },
            conceptualizacion: {
              titulo: tema.estructura?.conceptualizacion?.titulo || "Conceptualización",
              duracion: tema.estructura?.conceptualizacion?.duracion || "15 minutos",
              actividades: Array.isArray(tema.estructura?.conceptualizacion?.actividades)
                ? tema.estructura.conceptualizacion.actividades
                : ["Presentar el contenido formal."],
            },
            aplicacion: {
              titulo: tema.estructura?.aplicacion?.titulo || "Aplicación",
              duracion: tema.estructura?.aplicacion?.duracion || "10 minutos",
              actividades: Array.isArray(tema.estructura?.aplicacion?.actividades)
                ? tema.estructura.aplicacion.actividades
                : ["Transferir lo aprendido a ejercicios prácticos."],
            },
          },
          recursos: Array.isArray(tema.recursos) ? tema.recursos : ["Texto del estudiante"],
          evaluacionFormativa: tema.evaluacionFormativa || "Observación directa y registro anecdótico.",
          generadoPorIA: true,
        }));

        return {
          success: true,
          temas: temasConId,
        };
      } catch (error: any) {
        console.error("[topics-router] Error generating AI topics:", error);
        return {
          success: false,
          temas: [],
          error: error.message || "Error al generar temas con IA",
        };
      }
    }),
});
