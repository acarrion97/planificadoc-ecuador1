import PDFParser from "pdf2json";
import { ArchivoNoProcesableError } from "./types";

/**
 * Extrae el texto de un PDF (por página, concatenado) usando pdf2json
 * (puro JS, sin dependencias nativas como @napi-rs/canvas).
 */
export async function parsePdf(buffer: Buffer): Promise<{ textoPlano: string }> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", () => {
      reject(new ArchivoNoProcesableError());
    });

    parser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = parser.getRawTextContent();
        if (!text || text.trim().length === 0) {
          reject(new ArchivoNoProcesableError());
          return;
        }
        resolve({ textoPlano: text });
      } catch {
        reject(new ArchivoNoProcesableError());
      }
    });

    parser.parseBuffer(buffer);
  });
}
