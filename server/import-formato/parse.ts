import { parseDocx } from "./parse-docx";
import { parseDoc } from "./parse-doc";
import {
  ArchivoNoProcesableError,
  DocumentoParseado,
  ExtensionSoportada,
} from "./types";

const EXTENSIONES_SOPORTADAS: ExtensionSoportada[] = ["doc", "docx"];

export function extensionDe(fileName: string): ExtensionSoportada | null {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName.trim());
  const ext = match?.[1]?.toLowerCase();

  return (EXTENSIONES_SOPORTADAS as string[]).includes(ext ?? "")
    ? (ext as ExtensionSoportada)
    : null;
}

/**
 * Detecta la firma real del archivo.
 *
 * DOCX: ZIP (PK...)
 * DOC:  OLE Compound File (D0 CF 11 E0 A1 B1 1A E1)
 * PDF:  %PDF-
 */
function detectarFormato(buffer: Buffer): ExtensionSoportada | null {
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (
      (buffer[2] === 0x03 && buffer[3] === 0x04) ||
      (buffer[2] === 0x05 && buffer[3] === 0x06) ||
      (buffer[2] === 0x07 && buffer[3] === 0x08)
    )
  ) {
    return "docx";
  }

  const firmaDoc = [
    0xd0, 0xcf, 0x11, 0xe0,
    0xa1, 0xb1, 0x1a, 0xe1,
  ];

  if (
    buffer.length >= firmaDoc.length &&
    firmaDoc.every((byte, index) => buffer[index] === byte)
  ) {
    return "doc";
  }

  if (
    buffer.length >= 5 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return "pdf";
  }

  return null;
}

/**
 * Despacha al parser correspondiente según el contenido real del archivo.
 *
 * La extensión declarada se utiliza como referencia, pero no se confía en ella
 * para decidir qué parser recibe el buffer.
 */
export async function parseDocumento(
  buffer: Buffer,
  extension: ExtensionSoportada
): Promise<DocumentoParseado> {
  const formatoReal = detectarFormato(buffer);

  console.log("[parse-documento] Formato detectado:", {
    extensionDeclarada: extension,
    formatoReal,
    primerosBytes: buffer.subarray(0, 8).toString("hex"),
  });

  if (!formatoReal) {
    throw new ArchivoNoProcesableError();
  }

  switch (formatoReal) {
    case "docx": {
      const { textoPlano, tablas } = await parseDocx(buffer);
      return { extension: "docx", textoPlano, tablas };
    }

    case "doc": {
      const { textoPlano } = await parseDoc(buffer);
      return { extension: "doc", textoPlano, tablas: [] };
    }

    case "pdf": {
      const { parsePdf } = await import("./parse-pdf");
      const { textoPlano } = await parsePdf(buffer);
      return { extension: "pdf", textoPlano, tablas: [] };
    }
  }
}