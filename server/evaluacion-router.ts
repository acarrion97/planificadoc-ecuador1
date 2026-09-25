import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import { getDb } from "./db";
import { evaluacionesDiagnosticas } from "../drizzle/schema";
import { enfasisMarzanoPorSubnivel } from "../lib/curriculo-prerrequisitos";
import type { Subnivel } from "../data/types";
import { svgADataUri } from "./evaluacion-svg";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const DcdSugerirSchema = z.object({
  codigo: z.string().min(1),
  descripcion: z.string().min(1),
  indicadores: z.array(z.string()).default([]),
  criterios: z.array(z.string()).default([]),
});

const PreguntaSugeridaSchema = z.object({
  enunciado: z.string().min(1),
  tipo: z.enum(["opcion_multiple", "v_f", "respuesta_corta", "ejercicio"]),
  dificultad: z.enum(["basica", "media", "avanzada"]),
  puntaje: z.number().positive(),
  dcdCodigo: z.string().min(1),
  opciones: z
    .array(z.object({
      texto: z.string().default(""),
      /** Opción visual: SVG autocontenido; se convierte a data URI en `imagen` */
      svg: z.string().optional(),
      esCorrecta: z.boolean(),
    }))
    .optional(),
  respuestaCorrecta: z.string().optional(),
  retroalimentacion: z.string().optional(),
});

const SugerirPreguntasResultSchema = z.object({
  preguntas: z.array(PreguntaSugeridaSchema).min(1),
});

const SugerirNombreSchema = z.object({
  area: z.string().min(1),
  grado: z.string().default(""),
  paralelo: z.string().default(""),
  anioLectivo: z.string().default(""),
});

const SugerirNombreResultSchema = z.object({
  nombre: z.string().min(1),
});

const GuardarBackupSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(["borrador", "publicada", "aplicada", "analizada"]),
  form: z.string().min(1),
  aiResult: z.string().optional(),
  existingId: z.number().optional(),
});

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildSugerirPrompt(
  dcds: z.infer<typeof DcdSugerirSchema>[],
  subnivel: Subnivel | null
): string {
  const contexto = dcds
    .map((d) => {
      const indicadores = d.indicadores.length
        ? d.indicadores.map((i) => `  - ${i}`).join("\n")
        : "  (sin indicadores en el catálogo — usa solo la descripción de la destreza)";
      const criterios = d.criterios.length
        ? d.criterios.map((c) => `  - ${c}`).join("\n")
        : "";
      return `DESTREZA ${d.codigo}: "${d.descripcion}"
INDICADORES DE EVALUACIÓN REALES:
${indicadores}
${criterios ? `CRITERIOS DE EVALUACIÓN REALES:\n${criterios}` : ""}`;
    })
    .join("\n\n");

  // Énfasis cognitivo (taxonomía de Marzano) que la fuente oficial ejemplifica
  // para este subnivel; si no lo nombra, se aplica solo la regla general.
  const enfasis = subnivel != null ? enfasisMarzanoPorSubnivel(subnivel) : null;
  const enfasisTexto = enfasis
    ? `Para este subnivel la fuente oficial ejemplifica el énfasis en: ${enfasis}. Usa ese nivel cognitivo en la pregunta abierta de cada destreza.`
    : `La fuente oficial no ejemplifica un énfasis cognitivo para este curso: en la pregunta abierta de cada destreza sube al menos hasta la comprensión o el análisis, nunca te quedes en la memorización.`;

  return `Eres un docente ecuatoriano experto en construir evaluaciones diagnósticas. Diseñas preguntas para identificar CONOCIMIENTOS PREVIOS de los estudiantes ANTES de enseñar una destreza, no para medir el dominio final.

CONTEXTO CURRICULAR REAL (usa ÚNICAMENTE estos indicadores y destrezas — NO inventes contenidos curriculares ni otros aprendizajes):

${contexto}

MARCO OFICIAL (Herramientas sugeridas para la evaluación diagnóstica, MinEduc 2026):
- La evaluación diagnóstica valora de manera CUALITATIVA el estado de desarrollo de los aprendizajes al inicio del proceso. Su resultado sirve para detectar necesidades educativas y refuerzo, no para calificar.
- El ERROR MÁS FRECUENTE, y que esta evaluación debe evitar, es plantear únicamente ítems de recuperación del conocimiento por memorización: preguntas literales del tipo "¿Qué es X?" o "Defina X". Ninguna pregunta puede tener esa forma.
- Etapas del sistema cognitivo de la taxonomía de Marzano que deben considerarse: recuperación del conocimiento, comprensión, análisis, utilización del conocimiento (aplicación) y metacognición.
- ${enfasisTexto}
- Trascender la memorización NO significa usar lenguaje complejo: la redacción debe ser sencilla y adecuada a la edad.
- La prueba objetiva debe cumplir cuatro características: objetividad (criterios de corrección claros y uniformes), validez (evalúa los aprendizajes previstos), confiabilidad (resultados consistentes) e intencionalidad (responde al propósito diagnóstico).

REGLAS:
- Genera exactamente 2 preguntas por cada destreza, distribuidas entre sus indicadores.
- Cada pregunta evalúa exactamente un indicador real listado arriba (o, si no hay indicadores, la destreza descrita).
- De las 2 preguntas de cada destreza: UNA es de prueba objetiva ("opcion_multiple" o "v_f", nivel recuperación del conocimiento y comprensión) y la OTRA es abierta ("respuesta_corta" o "ejercicio", en el nivel cognitivo del énfasis indicado arriba). Nunca las dos del mismo tipo.
- PLANTEAMIENTO OBLIGATORIO: todo ítem parte de una situación previa breve —un texto, un caso o una escena imaginable— que el estudiantado lee y analiza antes de responder. El enunciado incluye primero esa situación y después la consigna. No generes consignas sueltas sin situación.
- Varía el FORMATO de los ítems "opcion_multiple" entre los cuatro formatos oficiales, no uses siempre el mismo:
  · formato simple: 4 opciones, se elige la correcta.
  · ordenamiento: el enunciado numera 3-4 elementos y cada opción es una secuencia (ej. "A) 1, 4, 2, 3").
  · completamiento: el enunciado deja 2-3 espacios "__________" y cada opción es la serie de palabras que los completa, separadas por " – ".
  · emparejamiento: el enunciado lista elementos numerados y características con letras, y cada opción es una combinación (ej. "A. 1b, 2a, 3c").
- "opcion_multiple": 4 opciones, exactamente UNA con esCorrecta=true. Las distractoras deben ser plausibles y del mismo tipo y extensión que la correcta — nunca absurdas ni notoriamente más largas.
- OPCIONES VISUALES: cuando la destreza se evalúa mejor con imágenes (figuras y cuerpos geométricos, fracciones representadas, conteo de objetos, gráficos estadísticos, relojes, rectas numéricas, patrones, simetría, ciclos o esquemas simples), un ítem "opcion_multiple" puede tener opciones con imagen. Para eso añade a CADA opción del ítem el campo "svg" con un SVG autocontenido y sencillo:
  · empieza con <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90"> y termina con </svg>;
  · solo formas básicas (rect, circle, ellipse, line, polyline, polygon, path, text corto, g) con colores planos y stroke visible;
  · prohibido: script, style, image, use, foreignObject, href, url(), eventos; máximo 1500 caracteres por SVG;
  · las opciones visuales se distinguen solo por su dibujo; "texto" queda vacío ("") o es una etiqueta breve que no revele la respuesta.
  Usa opciones visuales solo cuando aporten a la evaluación (como máximo en la mitad de los ítems de opción múltiple); en las demás áreas omite "svg".
- "v_f": dos opciones de texto "Verdadero" y "Falso", una con esCorrecta=true. La afirmación debe requerir comprensión, no reconocimiento literal.
- "respuesta_corta" y "ejercicio": incluye "respuestaCorrecta" con la respuesta o resolución esperada concisa, que sirva como criterio de corrección uniforme.
- "dificultad" refleja el nivel cognitivo del ítem: "basica" = recuperación y comprensión; "media" = análisis; "avanzada" = utilización del conocimiento (aplicación).
- "puntaje": 1 para basica, 2 para media, 3 para avanzada.
- "retroalimentacion": OBLIGATORIA en todas las preguntas. Es retroalimentación descriptiva dirigida al estudiantado, que promueve la metacognición: explica qué se esperaba comprender y ofrece una pista para que el estudiante revise su propio razonamiento. No basta con nombrar el contenido evaluado.
- Si las destrezas tienen contexto ecuatoriano posible (lugares, oficios, productos, historia local), úsalo en los planteamientos.

Responde ÚNICAMENTE con JSON válido con este esquema:
{
  "preguntas": [
    { "enunciado": "string (situación previa + consigna)", "tipo": "opcion_multiple|v_f|respuesta_corta|ejercicio", "dificultad": "basica|media|avanzada", "puntaje": 1, "dcdCodigo": "string", "opciones": [{ "texto": "string", "svg": "string (opcional, solo opciones visuales)", "esCorrecta": boolean }], "respuestaCorrecta": "string", "retroalimentacion": "string" }
  ]
}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

async function ensureEvaluacionTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`evaluaciones_diagnosticas\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sessionId\` varchar(320) NOT NULL,
        \`status\` enum('borrador','publicada','aplicada','analizada') NOT NULL DEFAULT 'borrador',
        \`form\` text,
        \`aiResult\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_ev_sessionId\` (\`sessionId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureEvaluacionTable warning:", err?.message);
    }
  }
}

export const evaluacionRouter = router({
  /**
   * Sugiere un nombre conciso y profesional para la evaluación diagnóstica.
   */
  sugerirNombre: publicProcedure
    .input(SugerirNombreSchema)
    .mutation(async ({ input }) => {
      const contexto = [
        input.area && `- Área: ${input.area}`,
        input.grado && `- Grado: ${input.grado}`,
        input.paralelo && `- Paralelo: ${input.paralelo}`,
        input.anioLectivo && `- Año lectivo: ${input.anioLectivo}`,
      ]
        .filter(Boolean)
        .join("\n");

      const prompt = `Genera un nombre conciso y profesional para una evaluación diagnóstica inicial del sistema educativo ecuatoriano.

CONTEXTO:
${contexto || "- Sin contexto adicional"}

REGLAS:
- Formato tipo: "Diagnóstico inicial de {Área} · {grado} {paralelo} · {año lectivo}".
- Conciso, sin comillas, apto como nombre de evaluación.

Responde ÚNICAMENTE con JSON válido:
{ "nombre": "string" }`;

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en evaluación diagnóstica del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 200,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      const result = SugerirNombreResultSchema.safeParse(parsed);
      if (!result.success) {
        throw new Error("La IA no devolvió un nombre válido. Intenta de nuevo.");
      }

      return result.data;
    }),

  /**
   * Sugiere preguntas por DCD con IA, fundamentadas EXCLUSIVAMENTE en los
   * indicadores/criterios reales del catálogo. No incorpora nada: devuelve
   * propuestas para que el docente las revise, edite o descarte.
   */
  sugerirPreguntas: publicProcedure
    .input(z.object({
      dcds: z.array(DcdSugerirSchema).min(1),
      /** Subnivel del curso, para calibrar el énfasis cognitivo (Marzano). Opcional: si no llega, se aplica solo la regla general. */
      subnivel: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = buildSugerirPrompt(input.dcds, (input.subnivel ?? null) as Subnivel | null);

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en evaluación diagnóstica del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        // Cada ítem ahora lleva planteamiento (situación previa) + opciones +
        // retroalimentación descriptiva: son respuestas notablemente más largas
        // que las del formato anterior de consigna suelta.
        // + margen para los SVG de las opciones visuales.
        maxTokens: 9000,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      const result = SugerirPreguntasResultSchema.safeParse(parsed);
      if (!result.success) {
        throw new Error("La IA no devolvió preguntas válidas. Intenta de nuevo.");
      }

      // SVG → data URI en `imagen`. Si un SVG no pasa la validación y la
      // opción queda sin texto, la pregunta no es respondible: se descarta.
      type PreguntaSugerida = Omit<z.infer<typeof PreguntaSugeridaSchema>, "opciones"> & {
        opciones?: { texto: string; imagen?: string; esCorrecta: boolean }[];
      };
      const preguntas = result.data.preguntas.flatMap((p): PreguntaSugerida[] => {
        if (!p.opciones) return [p as PreguntaSugerida];
        const opciones = p.opciones.map(({ svg, ...o }) => {
          const imagen = svgADataUri(svg);
          return { ...o, texto: o.texto.trim(), ...(imagen ? { imagen } : {}) };
        });
        if (opciones.some((o) => !o.texto && !o.imagen)) return [];
        return [{ ...p, opciones }];
      });
      if (preguntas.length === 0) {
        throw new Error("La IA no devolvió preguntas válidas. Intenta de nuevo.");
      }

      return { preguntas };
    }),

  /**
   * Guarda el backup best-effort de una evaluación en la nube. Si la BD no
   * está disponible o la tabla no existe, no es crítico: la fuente de verdad
   * es AsyncStorage.
   */
  guardarBackup: publicProcedure
    .input(GuardarBackupSchema)
    .mutation(async ({ input }) => {
      try {
        await ensureEvaluacionTable();
        const db = await getDb();
        if (!db) return { id: null };

        const row = {
          sessionId: input.sessionId,
          status: input.status,
          form: input.form,
          aiResult: input.aiResult ?? null,
        };

        if (input.existingId) {
          await db
            .update(evaluacionesDiagnosticas)
            .set(row)
            .where(eq(evaluacionesDiagnosticas.id, input.existingId));
          return { id: input.existingId };
        }
        const res = await db.insert(evaluacionesDiagnosticas).values(row);
        return { id: (res as any).insertId as number };
      } catch (err) {
        console.warn("[evaluacion] DB backup failed (non-critical):", err);
        return { id: null };
      }
    }),

  /** Lista los backups de una sesión (para restaurar) */
  list: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        return db
          .select({
            id: evaluacionesDiagnosticas.id,
            sessionId: evaluacionesDiagnosticas.sessionId,
            status: evaluacionesDiagnosticas.status,
            createdAt: evaluacionesDiagnosticas.createdAt,
          })
          .from(evaluacionesDiagnosticas)
          .where(eq(evaluacionesDiagnosticas.sessionId, input.sessionId))
          .orderBy(desc(evaluacionesDiagnosticas.createdAt))
          .limit(50);
      } catch {
        return [];
      }
    }),
});