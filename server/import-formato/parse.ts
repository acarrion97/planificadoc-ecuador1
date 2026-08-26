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
 * Detecta si el buffer es realmente un .docx (ZIP/ZIP2) aunque la extensión diga .doc.
 * DOCX magic: PK (0x50 0x4B), DOC magic: D0 CF 11 E0 A1 B1 1A E1.
 */
function esDocx(buffer: Buffer): boolean {
  return buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;
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
    if (esDocx(buffer)) {
      const { textoPlano, tablas } = await parseDocx(buffer);
      return { extension: "docx", textoPlano, tablas };
    }
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
