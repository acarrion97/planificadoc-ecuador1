import { randomUUID } from "crypto";
import { DocumentoParseado, ImportHandler, PcaCamposExtraidos, ResultadoGuardado } from "../types";
import { mapearCamposPca } from "../mapear-pca";
import { completarPcaConIA, inferirCodigoArea, PlanificacionExistente } from "../completar-pca";
import { construirPlantilla } from "../template-builder";
import { storagePut } from "../../storage";
import {
  findMatchingPcaDocuments,
  createPcaDocument,
  updatePcaFormDataAndAiResult,
  createFormatoPlantilla,
  setPcaFormatoPlantillaId,
} from "../../db";

/**
 * Handler de importación para PCA (Planificación Curricular Anual).
 *
 * Migrado de importar-formato-router.ts para usar el nuevo contrato
 * ImportHandler<Campos, ResultadoIA>.
 *
 * Si se proporciona originalBuffer, crea una FormatoPlantilla para
 * exportar en el mismo formato original.
 */
export const pcaHandler: ImportHandler<PcaCamposExtraidos, Awaited<ReturnType<typeof completarPcaConIA>>> = {
  mapear(documento: DocumentoParseado): PcaCamposExtraidos {
    return mapearCamposPca(documento);
  },

  async completar(
    campos: PcaCamposExtraidos,
    sessionId: string
  ) {
    const areaCodigo = inferirCodigoArea(campos.area);

    const candidatos = await findMatchingPcaDocuments({
      sessionId,
      area: areaCodigo,
      grado: campos.grado,
      anioLectivo: campos.anioLectivo,
    });

    const existenteRow = candidatos[0] ?? null;

    const existente: PlanificacionExistente = existenteRow
      ? {
          formData: JSON.parse(existenteRow.formData),
          aiResult: existenteRow.aiResult
            ? JSON.parse(existenteRow.aiResult)
            : null,
        }
      : null;

    return completarPcaConIA(campos, existente);
  },

  async guardar(
    campos: PcaCamposExtraidos,
    resultadoIA: Awaited<ReturnType<typeof completarPcaConIA>>,
    sessionId: string,
    originalBuffer?: Buffer
  ): Promise<ResultadoGuardado> {
    const { aiResult, subnivel } = resultadoIA;
    const areaCodigo = inferirCodigoArea(campos.area);

    // Buscar PCA existente para actualizar
    const candidatos = await findMatchingPcaDocuments({
      sessionId,
      area: areaCodigo,
      grado: campos.grado,
      anioLectivo: campos.anioLectivo,
    });

    const existenteRow = candidatos[0] ?? null;

    const formData = {
      ...(existenteRow ? JSON.parse(existenteRow.formData) : {}),

      institucion:
        campos.institucion ||
        (existenteRow ? JSON.parse(existenteRow.formData).institucion : "") ||
        "",

      docente:
        campos.docente ||
        (existenteRow ? JSON.parse(existenteRow.formData).docente : "") ||
        "",

      area: areaCodigo,
      subnivel,

      grado:
        campos.grado ||
        (existenteRow ? JSON.parse(existenteRow.formData).grado : "") ||
        "",

      anioLectivo:
        campos.anioLectivo ||
        (existenteRow ? JSON.parse(existenteRow.formData).anioLectivo : "") ||
        "",

      paralelo:
        (existenteRow ? JSON.parse(existenteRow.formData).paralelo : "") || "",

      cargaHorariaSemanal:
        campos.cargaHorariaSemanal ??
        (existenteRow ? JSON.parse(existenteRow.formData).cargaHorariaSemanal : null) ??
        5,

      semanasTrabajoTotal:
        campos.semanasTrabajoTotal ??
        (existenteRow ? JSON.parse(existenteRow.formData).semanasTrabajoTotal : null) ??
        40,

      semanasEvaluacion:
        campos.semanasEvaluacion ??
        (existenteRow ? JSON.parse(existenteRow.formData).semanasEvaluacion : null) ??
        8,

      usaEjesTransversales:
        (existenteRow ? JSON.parse(existenteRow.formData).usaEjesTransversales : null) ?? false,

      ejesTransversales:
        (existenteRow ? JSON.parse(existenteRow.formData).ejesTransversales : null) ?? [],

      unidades:
        campos.unidades.length > 0
          ? campos.unidades.map((u) => ({
              id: randomUUID(),
              numero: u.numero,
              dcdsSeleccionadas: [],
              duracionSemanas: u.duracionSemanas ?? 4,
            }))
          : (existenteRow ? JSON.parse(existenteRow.formData).unidades : null) ?? [],

      metodologiasActivas:
        (existenteRow ? JSON.parse(existenteRow.formData).metodologiasActivas : null) ?? [],

      tecnicasEvaluacion:
        (existenteRow ? JSON.parse(existenteRow.formData).tecnicasEvaluacion : null) ?? [],

      bibliografiaDocente:
        campos.bibliografia ||
        (existenteRow ? JSON.parse(existenteRow.formData).bibliografiaDocente : "") ||
        "",

      firmaElaboradoPor:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaElaboradoPor : "") || "",

      firmaElaboradoFecha:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaElaboradoFecha : "") || "",

      firmaRevisadoPor:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaRevisadoPor : "") || "",

      firmaRevisadoFecha:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaRevisadoFecha : "") || "",

      firmaAprobadoPor:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaAprobadoPor : "") || "",

      firmaAprobadoFecha:
        (existenteRow ? JSON.parse(existenteRow.formData).firmaAprobadoFecha : "") || "",
    };

    let pcaId: number;
    let formatoPlantillaId: number | null = null;

    // ── Crear plantilla si se proporcionó buffer original ──────────
    if (originalBuffer) {
      try {
        const plantilla = await construirPlantilla(originalBuffer, campos);

        // Subir buffer original a storage (no guardar base64 en BD)
        const storagePath = `plantillas/${sessionId}/${Date.now()}-pca.docx`;
        const { key: templateStorageKey } = await storagePut(
          storagePath,
          originalBuffer,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        formatoPlantillaId = await createFormatoPlantilla({
          sessionId,
          nombre: `PCA - ${campos.institucion || "Sin nombre"} - ${campos.anioLectivo || ""}`,
          tipoPlanificacion: "pca",
          formatoOrigen: "docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          storageKey: templateStorageKey,
          estructura: JSON.stringify(plantilla.estructura),
          bindings: JSON.stringify(plantilla.bindings),
          configuracion: JSON.stringify(plantilla.configuracion),
        });

        console.log(`[pca-handler] Plantilla creada: ${formatoPlantillaId}, storage: ${templateStorageKey}`);
      } catch (err) {
        console.warn("[pca-handler] No se pudo crear plantilla:", err);
        // No bloqueamos el flujo por esto
      }
    }

    // ── Guardar PCA ───────────────────────────────────────────────
    if (existenteRow) {
      pcaId = existenteRow.id;
      await updatePcaFormDataAndAiResult(
        pcaId,
        JSON.stringify(formData),
        JSON.stringify(aiResult)
      );
      // Asociar plantilla al PCA existente
      if (formatoPlantillaId) {
        await setPcaFormatoPlantillaId(pcaId, formatoPlantillaId);
      }
    } else {
      pcaId = await createPcaDocument({
        sessionId,
        status: "generated",
        formData: JSON.stringify(formData),
        aiResult: JSON.stringify(aiResult),
        formatoPlantillaId: formatoPlantillaId ?? null,
      });
    }

    return {
      resourceId: pcaId,
      destination: `/pca-preview/${pcaId}`,
    };
  },
};
