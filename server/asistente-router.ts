import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { buscarEnManual } from "./asistente-manual";

/**
 * Asistente virtual: responde dudas de uso del sistema buscando en el manual
 * de usuario (RAG ligero) y dejando que la IA redacte una respuesta clara.
 */

interface Fuente {
  capId: string;
  capTitulo: string;
  seccion: string | null;
  seccionId: string | null;
}

const SISTEMA = `Eres "Doc", el asistente virtual de PlanificaDoc Ecuador, una aplicación para que docentes ecuatorianos creen planificaciones curriculares (plan diario, semanal, PCA, PCT, Conecta Nivela y Crea, evaluación diagnóstica, proyecto interdisciplinar, bachillerato técnico, currículo por competencias, educación inicial y preparatoria).

Reglas:
- Responde SOLO con la información del MANUAL que se te entrega. Si el manual no cubre la pregunta, dilo con honestidad y sugiere contactar a soporte (soporte@planificadoc.app o el grupo de WhatsApp en Mi cuenta).
- No inventes pantallas, botones, precios ni funciones.
- Responde en español, con tono cercano y respetuoso, breve: máximo 150 palabras.
- Si son pasos, enuméralos (1., 2., 3.) indicando el nombre exacto de los botones o menús entre comillas.
- Texto plano: sin encabezados Markdown ni tablas; puedes usar listas con "-" o numeradas.
- No des consejos pedagógicos ni curriculares. Si preguntan algo ajeno al uso de la aplicación, indica amablemente que solo puedes ayudar con el uso de PlanificaDoc.`;

const MENSAJE_SIN_MANUAL =
  "No encontré eso en el manual. ¿Puede reformular su pregunta con otras palabras? También puede escribir a soporte@planificadoc.app o al grupo de WhatsApp (Mi cuenta).";

export const asistenteRouter = router({
  preguntar: publicProcedure
    .input(
      z.object({
        pregunta: z.string().trim().min(2).max(500),
        historial: z
          .array(z.object({ rol: z.enum(["usuario", "asistente"]), texto: z.string().max(1500) }))
          .max(6)
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const historial = input.historial ?? [];
      // Suma la pregunta anterior para que "¿y cómo lo descargo?" conserve el tema.
      const previa = historial.filter((h) => h.rol === "usuario").slice(-1).map((h) => h.texto);
      const resultados = buscarEnManual([...previa, input.pregunta].join(" "), 5);

      if (resultados.length === 0) {
        return { respuesta: MENSAJE_SIN_MANUAL, fuentes: [] as Fuente[] };
      }

      const contexto = resultados
        .map(
          (r, i) =>
            `[Fragmento ${i + 1}] ${r.chunk.capTitulo}${r.chunk.seccion ? " › " + r.chunk.seccion : ""}\n${r.chunk.texto}`,
        )
        .join("\n\n---\n\n");

      const result = await invokeLLM({
        messages: [
          { role: "system", content: `${SISTEMA}\n\nMANUAL (fragmentos relevantes):\n\n${contexto}` },
          ...historial.map((h) => ({
            role: h.rol === "usuario" ? ("user" as const) : ("assistant" as const),
            content: h.texto,
          })),
          { role: "user", content: input.pregunta },
        ],
        maxTokens: 600,
      });

      const raw = result.choices[0]?.message?.content;
      const respuesta = (typeof raw === "string" ? raw : "").trim() || MENSAJE_SIN_MANUAL;

      // Fuentes únicas (capítulo + sección) de los 3 mejores fragmentos.
      const vistas = new Set<string>();
      const fuentes: Fuente[] = [];
      for (const r of resultados.slice(0, 3)) {
        const clave = `${r.chunk.capId}#${r.chunk.seccionId ?? ""}`;
        if (vistas.has(clave)) continue;
        vistas.add(clave);
        fuentes.push({
          capId: r.chunk.capId,
          capTitulo: r.chunk.capTitulo,
          seccion: r.chunk.seccion,
          seccionId: r.chunk.seccionId,
        });
      }
      return { respuesta, fuentes };
    }),
});
