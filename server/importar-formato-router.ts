import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createImportedFormatDocument,
  updateImportedFormatDocument,
  getImportedFormatDocument,
  listFormatoPlantillas,
} from "./db";
import { extensionDe, parseDocumento } from "./import-formato/parse";
import { reconocerTipo } from "./import-formato/matcher";
import { importar, tipoImplementado, registrarHandler } from "./import-formato/importer";
import { pcaHandler } from "./import-formato/handlers/pca";
import {
  ArchivoNoProcesableError,
  ResultadoImportacion,
} from "./import-formato/types";
import { DocLegacyNoSoportadoError } from "./import-formato/parse-doc";

// ─── Registrar handlers ─────────────────────────────────────────────────────
registrarHandler("pca", pcaHandler);

// ─── Constantes ─────────────────────────────────────────────────────────────

const TAMANO_MAXIMO_BYTES = 15 * 1024 * 1024; // 15 MB

const SubirInput = z.object({
  sessionId: z.string().min(1),
  email: z.string().email().optional(),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  /**
   * Contenido del archivo en base64.
   *
   * Puede venir como:
   *   UEsDB...
   *
   * o como Data URL:
   *   data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDB...
   */
  fileBase64: z.string().min(1),
});

// ─── Formato físico ─────────────────────────────────────────────────────────

type FormatoFisico =
  | "zip"
  | "pdf"
  | "doc"
  | "rtf"
  | "xml"
  | "svg"
  | "png"
  | "jpg"
  | "unknown";

function detectarFormatoFisico(buffer: Buffer): FormatoFisico {
  if (buffer.length < 4) return "unknown";

  // ZIP / DOCX / XLSX / PPTX
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return "zip";
  }

  // Algunas variantes ZIP
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x06 || buffer[3] === 0x08)
  ) {
    return "zip";
  }

  // PDF
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "pdf";
  }

  // DOC antiguo / OLE Compound File
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    )
  ) {
    return "doc";
  }

  // RTF
  if (buffer.subarray(0, 5).toString("ascii") === "{\\rtf") {
    return "rtf";
  }

  // XML
  const inicio = buffer
    .subarray(0, Math.min(buffer.length, 100))
    .toString("utf8")
    .trimStart();

  if (inicio.startsWith("<?xml") || inicio.startsWith("<html") || inicio.startsWith("<HTML")) {
    return "xml";
  }

  // SVG
  if (inicio.startsWith("<svg") || inicio.startsWith("<SVG") || inicio.includes("<svg ")) {
    return "svg";
  }

  // PNG
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return "png";
  }

  // JPG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  return "unknown";
}

// ─── Decodificación Base64 ──────────────────────────────────────────────────

function decodificarBase64(value: string): Buffer {
  let raw = value.trim();

  // Data URL: data:application/...;base64,UEsDB...
  if (raw.startsWith("data:")) {
    const coma = raw.indexOf(",");
    if (coma === -1) {
      throw new Error("El Data URL del archivo está incompleto.");
    }
    const metadata = raw.slice(0, coma);
    if (!metadata.toLowerCase().includes(";base64")) {
      throw new Error("El archivo recibido no está codificado como Base64.");
    }
    raw = raw.slice(coma + 1);
  }

  // Eliminar espacios y saltos de línea.
  raw = raw.replace(/\s/g, "");

  if (!raw) {
    throw new Error("El contenido del archivo está vacío.");
  }

  // Validación básica de Base64.
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(raw)) {
    throw new Error("El contenido Base64 no es válido.");
  }

  if (raw.length % 4 !== 0) {
    throw new Error("El contenido Base64 está incompleto.");
  }

  const buffer = Buffer.from(raw, "base64");

  if (buffer.length === 0) {
    throw new Error("El archivo está vacío.");
  }

  return buffer;
}

// ─── Validación extensión vs contenido ──────────────────────────────────────

function validarExtensionContraContenido(
  extension: string,
  formatoFisico: FormatoFisico
): string | null {
  switch (extension) {
    case "docx":
      if (formatoFisico !== "zip") {
        return (
          "El archivo tiene extensión .docx, pero su contenido no corresponde " +
          "a un documento Word válido. Verifica que el archivo no haya sido " +
          "alterado o convertido incorrectamente antes de subirlo."
        );
      }
      break;
    case "pdf":
      if (formatoFisico !== "pdf") {
        return "El archivo tiene extensión .pdf, pero su contenido no corresponde a un PDF válido.";
      }
      break;
    case "doc":
      if (formatoFisico !== "doc") {
        return "El archivo tiene extensión .doc, pero su contenido no corresponde a un documento Word antiguo válido.";
      }
      break;
    default:
      return null;
  }
  return null;
}

// ─── Router ─────────────────────────────────────────────────────────────────

export const importarFormatoRouter = router({
  /**
   * Sube, analiza y completa un documento importado en una sola llamada.
   *
   * Flujo:
   *   1. Validar extensión y tamaño
   *   2. Decodificar Base64
   *   3. Detectar formato físico (magic bytes)
   *   4. Validar extensión vs contenido
   *   5. Guardar original en storage
   *   6. Crear registro en DB
   *   7. Parsear documento
   *   8. Reconocer tipo (con manejo de ambigüedad)
   *   9. Despachar a handler específico
   *  10. Devolver resultado polimórfico con destination
   */
  subirYProcesar: publicProcedure
    .input(SubirInput)
    .mutation(async ({ input }): Promise<ResultadoImportacion> => {
      // ── 1. Validar extensión ────────────────────────────────────────
      const extension = extensionDe(input.fileName);

      if (!extension) {
        return {
          success: false,
          importId: null,
          error: "Formato no soportado. Sube un archivo .doc, .docx o .pdf.",
        };
      }

      // ── 2. Decodificar Base64 ──────────────────────────────────────
      let buffer: Buffer;

      try {
        buffer = decodificarBase64(input.fileBase64);
      } catch (err: any) {
        console.warn("[importar-formato] Error decodificando Base64:", err?.message);
        return {
          success: false,
          importId: null,
          error: err?.message || "No se pudo leer el contenido del archivo.",
        };
      }

      if (buffer.length === 0) {
        return {
          success: false,
          importId: null,
          error: "El archivo está vacío.",
        };
      }

      // ── 3. Validar tamaño ──────────────────────────────────────────
      if (buffer.length > TAMANO_MAXIMO_BYTES) {
        return {
          success: false,
          importId: null,
          error: `El archivo excede el tamaño máximo permitido (${Math.round(
            TAMANO_MAXIMO_BYTES / (1024 * 1024)
          )} MB).`,
        };
      }

      // ── 4. Detectar formato físico ─────────────────────────────────
      const formatoFisico = detectarFormatoFisico(buffer);
      const primerosBytes = buffer.subarray(0, 16).toString("hex");

      console.log("[importar-formato] Archivo recibido:", {
        fileName: input.fileName,
        mimeType: input.mimeType,
        extension,
        base64Length: input.fileBase64.length,
        bufferLength: buffer.length,
        formatoFisico,
        primerosBytes,
      });

      // ── 5. Validar extensión vs contenido ──────────────────────────
      const errorFormato = validarExtensionContraContenido(extension, formatoFisico);

      if (errorFormato) {
        console.warn("[importar-formato] Archivo rechazado por incompatibilidad:", {
          fileName: input.fileName,
          extension,
          formatoFisico,
          primerosBytes,
        });
        return {
          success: false,
          importId: null,
          error: errorFormato,
        };
      }

      // DOCX debe ser realmente un ZIP
      if (extension === "docx" && formatoFisico !== "zip") {
        return {
          success: false,
          importId: null,
          error: "El documento Word no tiene una estructura DOCX válida.",
        };
      }

      // ── 6. Guardar original en storage ─────────────────────────────
      let storageKey: string | null = null;

      try {
        const safeSession = input.sessionId.replace(/[^a-zA-Z0-9._-]/g, "_");
        const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const { key } = await storagePut(
          `importados/${safeSession}/${Date.now()}-${safeFileName}`,
          buffer,
          input.mimeType
        );
        storageKey = key;
      } catch (err: any) {
        console.warn("[importar-formato] No se pudo respaldar el archivo en storage:", err?.message);
        // No bloqueamos el flujo por esto.
      }

      // ── 7. Crear registro en DB ────────────────────────────────────
      const importId = await createImportedFormatDocument({
        sessionId: input.sessionId,
        fileName: input.fileName,
        mimeType: input.mimeType,
        storageKey,
      });

      await updateImportedFormatDocument(importId, { status: "analizando" });

      // ── 8. Parsear documento ───────────────────────────────────────
      try {
        const documentoParseado = await parseDocumento(buffer, extension);

        console.log("[importar-formato] Documento parseado:", {
          importId,
          extension,
          formatoFisico,
        });

        // ── 9. Reconocer tipo ────────────────────────────────────────
        const reconocimiento = reconocerTipo(documentoParseado);

        console.log("[importar-formato] Reconocimiento:", reconocimiento);

        // ── Caso: no reconocido ──────────────────────────────────────
        if (reconocimiento.estado === "no_reconocido") {
          const error =
            "No se pudo reconocer el formato del documento. " +
            "Verifica que sea un formato oficial MinEduc soportado.";

          await updateImportedFormatDocument(importId, {
            status: "error",
            errorMensaje: error,
            tipoDetectado: null,
          });

          return {
            success: false,
            importId,
            error,
          };
        }

        // ── Caso: ambiguo ────────────────────────────────────────────
        if (reconocimiento.estado === "ambiguo") {
          const error =
            "No pudimos determinar con seguridad el tipo de planificación. " +
            "Por favor, selecciona el tipo correcto.";

          await updateImportedFormatDocument(importId, {
            status: "ambiguo",
            errorMensaje: error,
          });

          return {
            success: false,
            importId,
            error,
            candidatos: reconocimiento.candidatos,
          };
        }

        // ── Caso: reconocido ─────────────────────────────────────────
        const { tipo } = reconocimiento;

        if (!tipoImplementado(tipo)) {
          const error =
            `Se reconoció el formato "${tipo}", ` +
            "pero el completado automático para este tipo todavía " +
            "no está disponible.";

          await updateImportedFormatDocument(importId, {
            status: "error",
            errorMensaje: error,
            tipoDetectado: tipo,
          });

          return {
            success: false,
            importId,
            error,
          };
        }

        // ── 10. Despachar a handler ──────────────────────────────────
        await updateImportedFormatDocument(importId, {
          tipoDetectado: tipo,
        });

        const resultado = await importar(
          documentoParseado,
          tipo,
          input.sessionId,
          importId,
          buffer  // ← buffer original para crear plantilla
        );

        if (resultado.success) {
          await updateImportedFormatDocument(importId, {
            status: "completado",
            planificacionId: resultado.resourceId,
          });
        } else {
          await updateImportedFormatDocument(importId, {
            status: "error",
            errorMensaje: resultado.error,
          });
        }

        return resultado;
      } catch (err: any) {
        let mensaje: string;

        if (err instanceof DocLegacyNoSoportadoError) {
          mensaje =
            "El archivo .doc no es compatible con este formato antiguo. " +
            "Abre el archivo en Word y guárdalo como .docx, luego vuelve a intentar.";
        } else if (err instanceof ArchivoNoProcesableError) {
          mensaje = "El archivo no pudo procesarse. Verifica que no esté dañado.";
        } else {
          mensaje = err?.message || "No se pudo completar la importación. Intenta de nuevo.";
        }

        console.error("[importar-formato] Error procesando documento:", {
          importId,
          fileName: input.fileName,
          extension,
          formatoFisico,
          primerosBytes,
          error: err,
        });

        await updateImportedFormatDocument(importId, {
          status: "error",
          errorMensaje: mensaje,
        });

        return {
          success: false,
          importId,
          error: mensaje,
        };
      }
    }),

  /**
   * Consulta el estado de una importación.
   */
  getImportacion: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await getImportedFormatDocument(input.id);

      if (!doc) {
        return { found: false as const };
      }

      return {
        found: true as const,
        status: doc.status,
        tipoDetectado: doc.tipoDetectado,
        errorMensaje: doc.errorMensaje,
        planificacionId: doc.planificacionId,
      };
    }),

  /**
   * Lista todas las plantillas importadas de una sesión.
   */
  listarPlantillas: publicProcedure
    .input(z.object({ sessionId: z.string().min(1), tipoPlanificacion: z.string().optional() }))
    .query(async ({ input }) => {
      return listFormatoPlantillas(input.sessionId, input.tipoPlanificacion);
    }),
});
