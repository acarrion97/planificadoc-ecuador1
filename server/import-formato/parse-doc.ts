import WordExtractor from "word-extractor";
import { ArchivoNoProcesableError } from "./types";

/**
 * Extrae texto plano de un `.doc` legacy (OLE2/Compound File) vía
 * `word-extractor` (pura JS). No preserva estructura de tabla — el
 * reconocimiento de campos sobre `.doc` cae a la heurística de encabezados
 * de sección sobre texto plano, con menor precisión que `.docx` (ver
 * design.md, Decisión 2 y Riesgos).
 */
export class DocLegacyNoSoportadoError extends Error {
  constructor() {
    super("DOC_LEGACY_NO_SOPORTADO");
    this.name = "DocLegacyNoSoportadoError";
  }
}

export async function parseDoc(buffer: Buffer): Promise<{ textoPlano: string }> {
  try {
    const extractor = new WordExtractor();
    const documento = await extractor.extract(buffer);
    const textoPlano = documento.getBody();
    if (!textoPlano || textoPlano.trim().length === 0) {
      throw new ArchivoNoProcesableError();
    }
    return { textoPlano };
  } catch (err) {
    if (err instanceof ArchivoNoProcesableError) throw err;
    console.error("[parse-doc] Error parseando .doc:", err);
    throw new DocLegacyNoSoportadoError();
  }
}
