import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";

/**
 * Router tRPC para generación IA de Planificación de Educación Inicial.
 * Genera: objetivoEspecifico + actividades de Inicio, Desarrollo y Cierre
 * basándose en el ámbito, destreza, tema y grado seleccionados por el docente.
 */
export const inicialRouter = router({
  /**
   * Genera objetivo específico + actividades (Inicio / Desarrollo / Cierre)
   * para una clase de Educación Inicial usando IA.
   */
  generateClase: publicProcedure
    .input(
      z.object({
        /** "Inicial 1 (3-4 años)" | "Inicial 2 (4-5 años)" */
        grado: z.string().min(1),
        /** Nombre del ámbito, ej: "Comprensión del Mundo Real y Simbólico" */
        ambito: z.string().min(1),
        /** Código de la competencia, ej: "INI.4.4.1" */
        competenciaCodigo: z.string().min(1),
        /** Descripción completa de la competencia */
        competenciaDescripcion: z.string().min(5),
        /** Destrezas seleccionadas */
        destrezas: z.array(z.string()).min(1),
        /** Ejes transversales seleccionados */
        ejesTransversales: z.array(z.string()).optional(),
        /** Tema escrito por el docente, ej: "Color rojo" */
        tema: z.string().min(1),
        /** Metodología elegida, ej: "Juego-trabajo" */
        metodologia: z.string().default("Juego-trabajo"),
        /** Número de clase dentro de la semana */
        numeroClase: z.number().int().min(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      const {
        grado,
        ambito,
        competenciaCodigo,
        competenciaDescripcion,
        destrezas,
        ejesTransversales,
        tema,
        metodologia,
        numeroClase,
      } = input;

      const edadRango = grado.includes("3") ? "3 a 4 años" : "4 a 5 años";
      const ejesTexto = ejesTransversales?.length
        ? ejesTransversales.join(", ")
        : "Permanencia Escolar";

      const prompt = `Eres un experto en Educación Inicial del Ecuador (Currículo Priorizado 2024 MinEduc). \
Diseña una clase de "${metodologia}" para niños de ${edadRango}.

DATOS DE LA CLASE
- Grado       : ${grado}
- Ámbito      : ${ambito}
- Competencia : ${competenciaCodigo} — ${competenciaDescripcion}
- Destreza(s) : ${destrezas.join(" / ")}
- Tema        : ${tema}
- Clase N.°   : ${numeroClase}
- Ejes transv.: ${ejesTexto}

INSTRUCCIONES
1. El OBJETIVO ESPECÍFICO debe ser una sola oración clara que inicie con un verbo en infinitivo \
   y sea alcanzable en una clase de 45 minutos. Debe responder EXACTAMENTE a la destreza indicada \
   y al tema "${tema}". Si la destreza dice "reconocer", el objetivo debe ser reconocer, no mezclar ni crear.

2. INICIO (4-5 ítems): Saludo/bienvenida, clima y fecha, asistencia participativa, \
   canción o video motivador relacionado con "${tema}", activación del tema. Rutinas concretas.

3. DESARROLLO (6-9 ítems): Actividades que trabajen DIRECTAMENTE la destreza con el tema "${tema}". \
   Si el tema es un color primario (rojo, amarillo, azul), las actividades deben ser de RECONOCIMIENTO \
   e IDENTIFICACIÓN del color en objetos reales, NO de mezcla de colores (los primarios no se mezclan). \
   Incluir: presentación del color con objetos reales, caja sorpresa, láminas, preguntas abiertas, \
   canción del color. Contextualizados a la realidad ecuatoriana. \
   Usar verbos de acción: Observar, Identificar, Nombrar, Señalar, Comparar, Reconocer, Explorar.

4. CIERRE (3-4 ítems): Actividad de cuadernillo o ficha de trabajo (colorear, puntear, pegar), \
   retroalimentación personalizada, felicitación, despedida.

REGLAS ESTRICTAS
- ESTRUCTURA: Sigue la Taxonomía de Marzano. CADA ítem DEBE comenzar con un VERBO EN INFINITIVO. \
  Ejemplos válidos: "Saludar a los niños...", "Observar las imágenes...", "Identificar el color...", \
  "Cantar la canción...", "Presentar la lámina...", "Preguntar a los niños...", "Felicitar a los estudiantes...". \
  NUNCA empieces un ítem con artículo, sustantivo, adjetivo ni frase sin verbo infinitivo.
- Cada actividad debe ser coherente con la destreza y el tema. NO inventes contenidos que contradigan \
  la naturaleza del tema (ej: un color primario NO se puede obtener mezclando otros colores).
- Lenguaje simple y concreto, apropiado para niños de ${edadRango}.
- Actividades basadas en juego, movimiento, canciones y materiales manipulativos.
- No uses emojis.
- Español correcto con tildes y ñ.
- Máximo 90 caracteres por ítem.

Responde ÚNICAMENTE con este JSON válido:
{
  "objetivoEspecifico": "string",
  "inicio": ["string", "string", "string", "string", "string"],
  "desarrollo": ["string", "string", "string", "string", "string", "string", "string"],
  "cierre": ["string", "string", "string", "string"]
}`;

      const result = await invokeLLM({
        messages: [{ role: "user", content: prompt }],
        responseFormat: { type: "json_object" },
        maxTokens: 2048,
      });

      const raw = result.choices?.[0]?.message?.content;
      if (!raw || typeof raw !== "string") {
        throw new Error("La IA no devolvió contenido válido. Intenta de nuevo.");
      }

      let parsed: {
        objetivoEspecifico: string;
        inicio: string[];
        desarrollo: string[];
        cierre: string[];
      };

      try {
        parsed = JSON.parse(raw);
      } catch {
        try {
          parsed = JSON.parse(repairJson(raw));
        } catch {
          throw new Error("Error al procesar la respuesta de la IA. Intenta de nuevo.");
        }
      }

      // Validación básica de estructura
      if (
        !parsed.objetivoEspecifico ||
        !Array.isArray(parsed.inicio) ||
        !Array.isArray(parsed.desarrollo) ||
        !Array.isArray(parsed.cierre)
      ) {
        throw new Error("La respuesta de la IA está incompleta. Intenta de nuevo.");
      }

      return {
        objetivoEspecifico: parsed.objetivoEspecifico,
        inicio:      parsed.inicio.filter(Boolean),
        desarrollo:  parsed.desarrollo.filter(Boolean),
        cierre:      parsed.cierre.filter(Boolean),
      };
    }),
});
