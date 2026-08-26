import { randomUUID } from "crypto";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createImportedFormatDocument,
  updateImportedFormatDocument,
  getImportedFormatDocument,
  findMatchingPcaDocuments,
  createPcaDocument,
  updatePcaFormDataAndAiResult,
} from "./db";
import { extensionDe, parseDocumento } from "./import-formato/parse";
import { reconocerTipo } from "./import-formato/matcher";
import { mapearCamposPca } from "./import-formato/mapear-pca";
import { completarPcaConIA, inferirCodigoArea, inferirSubnivel } from "./import-formato/completar-pca";
import { ArchivoNoProcesableError, TIPOS_IMPLEMENTADOS } from "./import-formato/types";
import { DocLegacyNoSoportadoError } from "./import-formato/parse-doc";

const TAMANO_MAXIMO_BYTES = 15 * 1024 * 1024; // 15 MB — mismo orden de magnitud que el límite de audio en voiceTranscription.ts

const SubirInput = z.object({
  sessionId: z.string().min(1),
  email: z.string().email().optional(),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  /** Contenido del archivo en base64 (mismo patrón que server/_core/imageGeneration.ts) */
  fileBase64: z.string().min(1),
});

type SubirResult =
  | { success: true; importId: number; tipo: "pca"; pcaId: number }
  | { success: false; importId: number | null; error: string };

export const importarFormatoRouter = router({
  /**
   * Sube, analiza y completa un documento importado en una sola llamada
   * (mismo patrón síncrono que pcaRouter.generatePca). Devuelve el id de la
   * PCA resultante para navegar directamente a /pca-preview/{pcaId}, que ya
   * implementa la descarga y el paywall existentes (design.md, Decisión 7).
   */
  subirYProcesar: publicProcedure.input(SubirInput).mutation(async ({ input }): Promise<SubirResult> => {
    const extension = extensionDe(input.fileName);
    if (!extension) {
      return { success: false, importId: null, error: "Formato no soportado. Sube un archivo .doc, .docx o .pdf." };
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(input.fileBase64, "base64");
    } catch {
      return { success: false, importId: null, error: "No se pudo leer el archivo subido." };
    }

    if (buffer.length === 0) {
      return { success: false, importId: null, error: "El archivo está vacío." };
    }
    if (buffer.length > TAMANO_MAXIMO_BYTES) {
      return {
        success: false,
        importId: null,
        error: `El archivo excede el tamaño máximo permitido (${Math.round(TAMANO_MAXIMO_BYTES / (1024 * 1024))} MB).`,
      };
    }

    let storageKey: string | null = null;
    try {
      const safeSession = input.sessionId.replace(/[^a-zA-Z0-9._-]/g, "_");
      const { key } = await storagePut(
        `importados/${safeSession}/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        buffer,
        input.mimeType
      );
      storageKey = key;
    } catch (err: any) {
      console.warn("[importar-formato] No se pudo respaldar el archivo en storage:", err?.message);
      // No bloqueamos el flujo por esto — el análisis puede continuar sin respaldo.
    }

    const importId = await createImportedFormatDocument({
      sessionId: input.sessionId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      storageKey,
    });

    await updateImportedFormatDocument(importId, { status: "analizando" });

    try {
      const documentoParseado = await parseDocumento(buffer, extension);
      const reconocimiento = reconocerTipo(documentoParseado);

      if (reconocimiento.tipo === "no_reconocido") {
        const error = "No se pudo reconocer el formato del documento. Verifica que sea un formato oficial MinEduc soportado.";
        await updateImportedFormatDocument(importId, { status: "error", errorMensaje: error, tipoDetectado: null });
        return { success: false, importId, error };
      }

      if (!TIPOS_IMPLEMENTADOS.includes(reconocimiento.tipo)) {
        const error = `Se reconoció el formato "${reconocimiento.tipo}", pero el completado automático para este tipo todavía no está disponible.`;
        await updateImportedFormatDocument(importId, {
          status: "error",
          errorMensaje: error,
          tipoDetectado: reconocimiento.tipo,
        });
        return { success: false, importId, error };
      }

      // Única rama implementada en esta etapa: PCA (ver tasks.md, alcance MVP).
      const camposExtraidos = mapearCamposPca(documentoParseado);
      await updateImportedFormatDocument(importId, {
        tipoDetectado: "pca",
        camposExtraidos: JSON.stringify(camposExtraidos),
      });

      const areaCodigo = inferirCodigoArea(camposExtraidos.area);
      const candidatos = await findMatchingPcaDocuments({
        sessionId: input.sessionId,
        area: areaCodigo,
        grado: camposExtraidos.grado,
        anioLectivo: camposExtraidos.anioLectivo,
      });
      const existenteRow = candidatos[0] ?? null;
      const existente = existenteRow
        ? {
            formData: JSON.parse(existenteRow.formData),
            aiResult: existenteRow.aiResult ? JSON.parse(existenteRow.aiResult) : null,
          }
        : null;

      const { aiResult, subnivel } = await completarPcaConIA(camposExtraidos, existente);

      // Combina: valores ya presentes en el documento importado (prioridad) >
      // valores de una PCA existente del docente > defaults neutrales — ver
      // spec.md, Requirement: Completado de campos con IA.
      const formData = {
        ...(existente?.formData ?? {}),
        institucion: camposExtraidos.institucion || existente?.formData?.institucion || "",
        docente: camposExtraidos.docente || existente?.formData?.docente || "",
        area: areaCodigo,
        subnivel,
        grado: camposExtraidos.grado || existente?.formData?.grado || "",
        anioLectivo: camposExtraidos.anioLectivo || existente?.formData?.anioLectivo || "",
        paralelo: existente?.formData?.paralelo || "",
        cargaHorariaSemanal: camposExtraidos.cargaHorariaSemanal ?? existente?.formData?.cargaHorariaSemanal ?? 5,
        semanasTrabajoTotal: camposExtraidos.semanasTrabajoTotal ?? existente?.formData?.semanasTrabajoTotal ?? 40,
        semanasEvaluacion: camposExtraidos.semanasEvaluacion ?? existente?.formData?.semanasEvaluacion ?? 8,
        usaEjesTransversales: existente?.formData?.usaEjesTransversales ?? false,
        ejesTransversales: existente?.formData?.ejesTransversales ?? [],
        unidades:
          camposExtraidos.unidades.length > 0
            ? camposExtraidos.unidades.map((u) => ({
                id: randomUUID(),
                numero: u.numero,
                dcdsSeleccionadas: [],
                duracionSemanas: u.duracionSemanas ?? 4,
              }))
            : existente?.formData?.unidades ?? [],
        metodologiasActivas: existente?.formData?.metodologiasActivas ?? [],
        tecnicasEvaluacion: existente?.formData?.tecnicasEvaluacion ?? [],
        bibliografiaDocente: camposExtraidos.bibliografia || existente?.formData?.bibliografiaDocente || "",
        firmaElaboradoPor: existente?.formData?.firmaElaboradoPor || "",
        firmaElaboradoFecha: existente?.formData?.firmaElaboradoFecha || "",
        firmaRevisadoPor: existente?.formData?.firmaRevisadoPor || "",
        firmaRevisadoFecha: existente?.formData?.firmaRevisadoFecha || "",
        firmaAprobadoPor: existente?.formData?.firmaAprobadoPor || "",
        firmaAprobadoFecha: existente?.formData?.firmaAprobadoFecha || "",
      };

      let pcaId: number;
      if (existenteRow) {
        pcaId = existenteRow.id;
        await updatePcaFormDataAndAiResult(pcaId, JSON.stringify(formData), JSON.stringify(aiResult));
      } else {
        pcaId = await createPcaDocument({
          sessionId: input.sessionId,
          status: "generated",
          formData: JSON.stringify(formData),
          aiResult: JSON.stringify(aiResult),
        });
      }

      await updateImportedFormatDocument(importId, {
        status: "completado",
        resultado: JSON.stringify({ formData, aiResult }),
        planificacionId: pcaId,
      });

      return { success: true, importId, tipo: "pca", pcaId };
    } catch (err: any) {
      let mensaje: string;
      if (err instanceof DocLegacyNoSoportadoError) {
        mensaje = "El archivo .doc no es compatible con este formato antiguo. Abre el archivo en Word y guárdalo como .docx, luego vuelve a intentar.";
      } else if (err instanceof ArchivoNoProcesableError) {
        mensaje = "El archivo no pudo procesarse. Verifica que no esté dañado.";
      } else {
        mensaje = err?.message || "No se pudo completar la importación. Intenta de nuevo.";
      }
      await updateImportedFormatDocument(importId, { status: "error", errorMensaje: mensaje });
      return { success: false, importId, error: mensaje };
    }
  }),

  /** Consulta el estado de una importación (para mostrar progreso/errores). */
  getImportacion: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const doc = await getImportedFormatDocument(input.id);
    if (!doc) return { found: false as const };
    return {
      found: true as const,
      status: doc.status,
      tipoDetectado: doc.tipoDetectado,
      errorMensaje: doc.errorMensaje,
      planificacionId: doc.planificacionId,
    };
  }),
});
