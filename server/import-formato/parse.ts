import { parseDocx } from "./parse-docx";
import { parseDoc } from "./parse-doc";
import {
  ArchivoNoProcesableError,
  DocumentoParseado,
  ExtensionSoportada,
} from "./types";

/**
 * Extensiones que puede recibir el importador.
 *
 * El parser también valida la firma real del archivo, por lo que no
 * confiamos únicamente en la extensión declarada por el usuario.
 */
const EXTENSIONES_SOPORTADAS: ExtensionSoportada[] = [
  "doc",
  "docx",
  "pdf",
];

export function extensionDe(
  fileName: string
): ExtensionSoportada | null {
  const nombre = fileName.trim().toLowerCase();

  const match = /\.([a-z0-9]+)$/.exec(nombre);
  const ext = match?.[1];

  if (!ext) {
    return null;
  }

  return EXTENSIONES_SOPORTADAS.includes(
    ext as ExtensionSoportada
  )
    ? (ext as ExtensionSoportada)
    : null;
}

/**
 * Detecta la firma real del archivo mediante sus primeros bytes.
 *
 * DOCX: ZIP
 *       50 4B 03 04
 *
 * DOC:  OLE Compound File
 *       D0 CF 11 E0 A1 B1 1A E1
 *
 * PDF:  %PDF-
 *       25 50 44 46 2D
 */
function detectarFormato(
  buffer: Buffer
): ExtensionSoportada | null {
  // ---------------------------------------------------------
  // DOCX
  // ---------------------------------------------------------
  //
  // Un DOCX es un ZIP. Los paquetes ZIP normalmente comienzan
  // con PK (50 4B).
  //
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (
      // ZIP con archivos
      (buffer[2] === 0x03 && buffer[3] === 0x04) ||

      // ZIP vacío
      (buffer[2] === 0x05 && buffer[3] === 0x06) ||

      // ZIP spanned
      (buffer[2] === 0x07 && buffer[3] === 0x08)
    )
  ) {
    return "docx";
  }

  // ---------------------------------------------------------
  // DOC antiguo
  // ---------------------------------------------------------
  const firmaDoc = [
    0xd0,
    0xcf,
    0x11,
    0xe0,
    0xa1,
    0xb1,
    0x1a,
    0xe1,
  ];

  if (
    buffer.length >= firmaDoc.length &&
    firmaDoc.every(
      (byte, index) => buffer[index] === byte
    )
  ) {
    return "doc";
  }

  // ---------------------------------------------------------
  // PDF
  // ---------------------------------------------------------
  //
  // PDF comienza con:
  // %PDF-
  //
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
 * Despacha al parser correspondiente según el contenido REAL
 * del archivo.
 *
 * La extensión declarada se utiliza como información de entrada,
 * pero NO determina qué parser se ejecuta.
 *
 * Esto evita confiar en archivos como:
 *
 *   documento.docx
 *   contenido real: SVG
 *
 * En ese caso detectarFormato() devuelve null y el archivo
 * se rechaza como no procesable.
 */
export async function parseDocumento(
  buffer: Buffer,
  extension: ExtensionSoportada
): Promise<DocumentoParseado> {
  if (!buffer || buffer.length === 0) {
    throw new ArchivoNoProcesableError();
  }

  const formatoReal = detectarFormato(buffer);

  console.log(
    "[parse-documento] Formato detectado:",
    {
      extensionDeclarada: extension,
      formatoReal,
      tamanoBytes: buffer.length,
      primerosBytes: buffer
        .subarray(0, 16)
        .toString("hex"),
    }
  );

  // No reconocimos ninguna firma soportada.
  if (!formatoReal) {
    console.warn(
      "[parse-documento] No se pudo detectar una firma válida:",
      {
        extensionDeclarada: extension,
        primerosBytes: buffer
          .subarray(0, 16)
          .toString("hex"),
      }
    );

    throw new ArchivoNoProcesableError();
  }

  // ---------------------------------------------------------
  // DOCX
  // ---------------------------------------------------------
  if (formatoReal === "docx") {
    try {
      const { textoPlano, tablas } =
        await parseDocx(buffer);

      return {
        extension: "docx",
        textoPlano,
        tablas,
      };
    } catch (error) {
      console.error(
        "[parse-documento] Error procesando DOCX:",
        error
      );

      throw new ArchivoNoProcesableError();
    }
  }

  // ---------------------------------------------------------
  // DOC
  // ---------------------------------------------------------
  if (formatoReal === "doc") {
    try {
      const { textoPlano } =
        await parseDoc(buffer);

      return {
        extension: "doc",
        textoPlano,
        tablas: [],
      };
    } catch (error) {
      console.error(
        "[parse-documento] Error procesando DOC:",
        error
      );

      throw new ArchivoNoProcesableError();
    }
  }

  // ---------------------------------------------------------
  // PDF
  // ---------------------------------------------------------
  if (formatoReal === "pdf") {
    try {
      const { parsePdf } =
        await import("./parse-pdf");

      const { textoPlano } =
        await parsePdf(buffer);

      return {
        extension: "pdf",
        textoPlano,
        tablas: [],
      };
    } catch (error) {
      console.error(
        "[parse-documento] Error procesando PDF:",
        error
      );

      throw new ArchivoNoProcesableError();
    }
  }

  // Este punto solo existe para satisfacer el análisis exhaustivo
  // si ExtensionSoportada incorpora nuevos formatos en el futuro.
  throw new ArchivoNoProcesableError();
}

