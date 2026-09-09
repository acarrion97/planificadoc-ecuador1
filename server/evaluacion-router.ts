import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import { getDb } from "./db";
import { evaluacionesDiagnosticas } from "../drizzle/schema";

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
    .array(z.object({ texto: z.string().min(1), esCorrecta: z.boolean() }))
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

function buildSugerirPrompt(dcds: z.infer<typeof DcdSugerirSchema>[]): string {
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

  return `Eres un docente ecuatoriano experto en construir evaluaciones diagnósticas. Diseñas preguntas para identificar CONOCIMIENTOS PREVIOS de los estudiantes ANTES de enseñar una destreza, no para medir el dominio final.

CONTEXTO CURRICULAR REAL (usa ÚNICAMENTE estos indicadores y destrezas — NO inventes contenidos curriculares ni otros aprendizajes):

${contexto}

REGLAS:
- Genera 2 preguntas por cada destreza, distribuidas entre sus indicadores.
- Cada pregunta evalúa exactamente un indicador real listado arriba (o, si no hay indicadores, la destreza descrita).
- Variedad de tipos: usa "opcion_multiple", "v_f", "respuesta_corta" y "ejercicio" según convenga.
- "opcion_multiple": 4 opciones, exactamente UNA con esCorrecta=true, plausibles y niveladas (opciones distractoras realistas).
- "v_f": dos opciones de texto "Verdadero" y "Falso", una con esCorrecta=true.
- "respuesta_corta" y "ejercicio": incluye "respuestaCorrecta" con la respuesta o resolución esperada concisa.
- "puntaje": 1 para básica, 2 para media, 3 para avanzada.
- "retroalimentacion": 1 oración pedagógica que explica el aprendizaje evaluado.
- Lenguaje apropiado para el nivel educativo y el aula ecuatoriana.

Responde ÚNICAMENTE con JSON válido con este esquema:
{
  "preguntas": [
    { "enunciado": "string", "tipo": "opcion_multiple|v_f|respuesta_corta|ejercicio", "dificultad": "basica|media|avanzada", "puntaje": 1, "dcdCodigo": "string", "opciones": [{ "texto": "string", "esCorrecta": boolean }], "respuestaCorrecta": "string", "retroalimentacion": "string" }
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
    .input(z.object({ dcds: z.array(DcdSugerirSchema).min(1) }))
    .mutation(async ({ input }) => {
      const prompt = buildSugerirPrompt(input.dcds);

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en evaluación diagnóstica del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 4000,
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

      return result.data;
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