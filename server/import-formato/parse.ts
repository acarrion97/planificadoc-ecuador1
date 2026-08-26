import { parseDocx } from "./parse-docx";
import { parseDoc } from "./parse-doc";
import { ArchivoNoProcesableError, DocumentoParseado, ExtensionSoportada } from "./types";

const EXTENSIONES_SOPORTADAS: ExtensionSoportada[] = ["doc", "docx", "pdf"];

export function extensionDe(fileName: string): ExtensionSoportada | null {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName.trim());
  const ext = match?.[1]?.toLowerCase();
  return (EXTENSIONES_SOPORTADAS as string[]).includes(ext ?? "") ? (ext as ExtensionSoportada) : null;
}

/**
 * Despacha al parser correspondiente según la extensión y normaliza el
 * resultado a `DocumentoParseado`. Lanza `ArchivoNoProcesableError` si el
 * archivo está dañado o no se puede leer (spec.md, Requirement:
 * Reconocimiento del tipo y estructura del formato → Scenario: Documento
 * dañado o no se puede leer).
 */
export async function parseDocumento(buffer: Buffer, extension: ExtensionSoportada): Promise<DocumentoParseado> {
  if (extension === "docx") {
    const { textoPlano, tablas } = await parseDocx(buffer);
    return { extension, textoPlano, tablas };
  }
  if (extension === "doc") {
    const { textoPlano } = await parseDoc(buffer);
    return { extension, textoPlano, tablas: [] };
  }
  if (extension === "pdf") {
    const { parsePdf } = await import("./parse-pdf");
    const { textoPlano } = await parsePdf(buffer);
    return { extension, textoPlano, tablas: [] };
  }
  throw new ArchivoNoProcesableError();
}
