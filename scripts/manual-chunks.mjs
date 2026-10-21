/**
 * Genera `server/manual-chunks.generated.ts` a partir de `public/manual/*.md`
 * para que el asistente virtual busque en el manual desde el servidor.
 * Cada fragmento es una sección (## / ###) de a lo sumo ~1800 caracteres.
 *
 * Uso: node scripts/manual-chunks.mjs   (volver a correr si cambia el manual)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirManual = join(raiz, "public", "manual");
const indice = JSON.parse(readFileSync(join(dirManual, "index.json"), "utf8"));

const MAX = 1800;
const slug = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const chunks = [];
for (const cap of indice.chapters) {
  const lineas = readFileSync(join(dirManual, cap.file), "utf8").split(/\r?\n/);
  let seccion = null;
  let seccionId = null;
  let buf = [];

  const cerrar = () => {
    const texto = buf.join("\n").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\n{3,}/g, "\n\n").trim();
    buf = [];
    if (texto.length < 20) return;
    // Parte secciones largas por párrafos para no exceder MAX.
    let actual = "";
    for (const parr of texto.split(/\n\n+/)) {
      if (actual && actual.length + parr.length > MAX) {
        chunks.push({ capId: cap.id, capTitulo: cap.title, seccion, seccionId, texto: actual });
        actual = "";
      }
      actual += (actual ? "\n\n" : "") + parr;
    }
    if (actual) chunks.push({ capId: cap.id, capTitulo: cap.title, seccion, seccionId, texto: actual });
  };

  for (const l of lineas) {
    const m = /^(#{1,3})\s+(.*)$/.exec(l);
    if (m) {
      cerrar();
      if (m[1].length >= 2) {
        seccion = m[2];
        seccionId = slug(m[2]);
      }
      continue;
    }
    buf.push(l);
  }
  cerrar();
}

const salida =
  "// Archivo generado por scripts/manual-chunks.mjs — no editar a mano.\n" +
  "export interface ManualChunk {\n  capId: string;\n  capTitulo: string;\n  seccion: string | null;\n  seccionId: string | null;\n  texto: string;\n}\n\n" +
  `export const MANUAL_CHUNKS: ManualChunk[] = ${JSON.stringify(chunks, null, 1)};\n`;
writeFileSync(join(raiz, "server", "manual-chunks.generated.ts"), salida);
console.log(`${chunks.length} fragmentos`);
