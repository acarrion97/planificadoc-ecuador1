import { z } from "zod";

/**
 * Esquema de salida de IA para el completado de una PCA importada — mismos
 * campos que consume `generarWordPca` (ver lib/pca-word-generator.ts) y que
 * guarda `pcaDocuments.aiResult`, pero tipados en vez de `any` y validados
 * con `.parse()` antes de persistir (design.md, Decisión 5 — a diferencia
 * del flujo normal de generación en pca-router.ts, que no valida la salida
 * de la IA).
 */
export const PcaUnidadAiSchema = z.object({
  numero: z.number(),
  titulo: z.string(),
  objetivosEspecificos: z.string(),
  contenidos: z.string(),
  orientacionesMetodologicas: z.string(),
  evaluacion: z.string(),
  duracionSemanas: z.number(),
});

export const PcaAiResultSchema = z.object({
  objetivosArea: z.string(),
  objetivosGrado: z.string(),
  unidades: z.array(PcaUnidadAiSchema),
  bibliografiaSugerida: z.string(),
  observaciones: z.string(),
});

export type PcaAiResult = z.infer<typeof PcaAiResultSchema>;

/**
 * Espejo en JSON Schema del esquema zod de arriba, para pasarlo como
 * `response_format: { type: "json_schema" }` a `invokeLLM` (server/_core/llm.ts)
 * y así pedirle a la IA que devuelva exactamente esta forma. Se mantiene a
 * mano (no hay `zod-to-json-schema` en el proyecto) — si se le agrega un
 * campo a `PcaAiResultSchema` hay que reflejarlo aquí también.
 */
export const PCA_AI_RESULT_JSON_SCHEMA = {
  name: "pca_ai_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["objetivosArea", "objetivosGrado", "unidades", "bibliografiaSugerida", "observaciones"],
    properties: {
      objetivosArea: { type: "string" },
      objetivosGrado: { type: "string" },
      unidades: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "numero",
            "titulo",
            "objetivosEspecificos",
            "contenidos",
            "orientacionesMetodologicas",
            "evaluacion",
            "duracionSemanas",
          ],
          properties: {
            numero: { type: "number" },
            titulo: { type: "string" },
            objetivosEspecificos: { type: "string" },
            contenidos: { type: "string" },
            orientacionesMetodologicas: { type: "string" },
            evaluacion: { type: "string" },
            duracionSemanas: { type: "number" },
          },
        },
      },
      bibliografiaSugerida: { type: "string" },
      observaciones: { type: "string" },
    },
  },
} as const;
