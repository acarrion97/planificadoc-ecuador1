/**
 * Búsqueda (BM25 simple) sobre los fragmentos del manual de usuario para el
 * asistente virtual. Sin dependencias ni embeddings: el manual es pequeño
 * (~140 fragmentos) y esto corre en la propia función serverless.
 */
import { MANUAL_CHUNKS, type ManualChunk } from "./manual-chunks.generated";

const STOPWORDS = new Set(
  (
    "a al algo ante con como cual cuales cuando de del desde donde el ella ellos en es esta este esto estos eso " +
    "hay la las le les lo los me mi mis muy no nos o para pero por que se si sin sobre su sus te tu tus un una uno unas unos " +
    "y ya puedo puede pueden quiero quisiera necesito hacer hago"
  ).split(/\s+/),
);

export function normalizar(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Tokeniza, quita stopwords y reduce plurales simples (planes→plan, destrezas→destreza). */
export function tokenizar(t: string): string[] {
  return normalizar(t)
    .split(/[^a-z0-9.]+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (w.length > 4 ? w.replace(/(es|s)$/, "") : w));
}

interface DocIndexado {
  chunk: ManualChunk;
  tf: Map<string, number>;
  len: number;
}

let indice: { docs: DocIndexado[]; df: Map<string, number>; avgLen: number } | null = null;

function construir() {
  const docs: DocIndexado[] = MANUAL_CHUNKS.map((chunk) => {
    // El título de la sección pesa triple: suele nombrar el tema que se consulta.
    const titulo = `${chunk.capTitulo} ${chunk.seccion ?? ""}`;
    const tokens = [...tokenizar(titulo), ...tokenizar(titulo), ...tokenizar(titulo), ...tokenizar(chunk.texto)];
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, len: tokens.length };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(docs.length, 1);
  indice = { docs, df, avgLen };
  return indice;
}

export interface Resultado {
  chunk: ManualChunk;
  score: number;
}

export function buscarEnManual(consulta: string, k = 5): Resultado[] {
  const { docs, df, avgLen } = indice ?? construir();
  const q = [...new Set(tokenizar(consulta))];
  if (q.length === 0) return [];
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.75;

  return docs
    .map((d) => {
      let score = 0;
      for (const t of q) {
        const f = d.tf.get(t);
        if (!f) continue;
        const n = df.get(t) ?? 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen));
      }
      return { chunk: d.chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, c) => c.score - a.score)
    .slice(0, k);
}
