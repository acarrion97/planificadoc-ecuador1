import { PDFParse } from "pdf-parse";
import { ArchivoNoProcesableError } from "./types";

/**
 * Extrae el texto de un PDF (por página, concatenado). Un PDF generado a
 * partir de tablas no expone estructura de tabla nativa, así que solo se usa
 * texto plano + heurística de encabezados de sección (ver design.md,
 * Decisión 3) — menor precisión de campo-a-campo que `.docx`.
 */
export async function parsePdf(buffer: Buffer): Promise<{ textoPlano: string }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const resultado = await parser.getText();
    if (!resultado.text || resultado.text.trim().length === 0) {
      throw new ArchivoNoProcesableError();
    }
    return { textoPlano: resultado.text };
  } catch (err) {
    if (err instanceof ArchivoNoProcesableError) throw err;
    throw new ArchivoNoProcesableError();
  } finally {
    await parser.destroy().catch(() => {});
  }
}
