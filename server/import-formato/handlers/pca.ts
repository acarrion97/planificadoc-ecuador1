import { randomUUID } from "crypto";
import { DocumentoParseado, ImportHandler, PcaCamposExtraidos, ResultadoGuardado } from "../types";
import { mapearCamposPca } from "../mapear-pca";
import { completarPcaConIA, inferirCodigoArea, PlanificacionExistente } from "../completar-pca";
import { construirPlantilla } from "../template-builder";
import { normalizarDocxPca } from "../docx-normalizer";
import { storagePut } from "../../storage";
import {
  findMatchingPcaDocuments,
  createPcaDocument,
  updatePcaFormDataAndAiResult,
  createFormatoPlantilla,
  setPcaFormatoPlantillaId,
} from "../../db";
import type { PcaAiResult } from "../schemas";

/**
 * Fusiona unidades importadas del documento con unidades generadas por IA.
 * Prioridad: datos importados > datos IA > datos existentes.
 */
function fusionarUnidades(
  unidadesImportadas: PcaCamposExtraidos["unidades"],
  unidadesIA: PcaAiResult["unidades"],
  existenteRow: any
): any[] {
  const unidadesExistentes = existenteRow
    ? (JSON.parse(existenteRow.formData).unidades ?? [])
    : [];

  // Si hay unidades importadas, fusionar cada una con su correspondiente de IA
  if (unidadesImportadas.length > 0) {
    return unidadesImportadas.map((unidadImportada, index) => {
      const unidadIA = unidadesIA.find((u) => u.numero === unidadImportada.numero) || unidadesIA[index];
      const unidadExistente = unidadesExistentes.find((u: any) => u.numero === unidadImportada.numero);

      return {
        id: unidadExistente?.id || randomUUID(),
        numero: unidadImportada.numero ?? unidadIA?.numero ?? index + 1,
        titulo: unidadImportada.titulo || unidadIA?.titulo || "",
        objetivosEspecificos: unidadImportada.objetivosEspecificos || unidadIA?.objetivosEspecificos || "",
        contenidos: unidadImportada.contenidos || unidadIA?.contenidos || "",
        orientacionesMetodologicas: unidadImportada.orientacionesMetodologicas || unidadIA?.orientacionesMetodologicas || "",
        evaluacion: unidadImportada.evaluacion || unidadIA?.evaluacion || "",
        dcdsSeleccionadas:
          (unidadImportada as any).dcds
            ? [(unidadImportada as any).dcds]
            : unidadExistente?.dcdsSeleccionadas || [],
        duracionSemanas: unidadImportada.duracionSemanas ?? unidadIA?.duracionSemanas ?? 4,
      };
    });
  }

  // Si no hay importadas pero sí IA, usar IA
  if (unidadesIA.length > 0) {
    return unidadesIA.map((u, index) => {
      const unidadExistente = unidadesExistentes.find((e: any) => e.numero === u.numero);
      return {
        id: unidadExistente?.id || randomUUID(),
        numero: u.numero ?? index + 1,
        titulo: u.titulo ?? "",
        objetivosEspecificos: u.objetivosEspecificos ?? "",
        contenidos: u.contenidos ?? "",
        orientacionesMetodologicas: u.orientacionesMetodologicas ?? "",
        evaluacion: u.evaluacion ?? "",
        dcdsSeleccionadas: unidadExistente?.dcdsSeleccionadas || [],
        duracionSemanas: u.duracionSemanas ?? 4,
      };
    });
  }

  // Fallback: usar unidades existentes
  return unidadesExistentes;
}

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
        campos.paralelo ||
        (existenteRow ? JSON.parse(existenteRow.formData).paralelo : "") ||
        "",

      nivelEducativo:
        campos.nivelEducativo ||
        (existenteRow ? JSON.parse(existenteRow.formData).nivelEducativo : "") ||
        "",

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

      totalSemanasClases:
        campos.totalSemanasClases ??
        (campos.semanasTrabajoTotal && campos.semanasEvaluacion
          ? campos.semanasTrabajoTotal - campos.semanasEvaluacion
          : null) ??
        (existenteRow ? JSON.parse(existenteRow.formData).totalSemanasClases : null) ??
        32,

      totalPeriodos:
        campos.totalPeriodos ??
        (campos.cargaHorariaSemanal && campos.totalSemanasClases
          ? campos.cargaHorariaSemanal * campos.totalSemanasClases
          : null) ??
        (existenteRow ? JSON.parse(existenteRow.formData).totalPeriodos : null) ??
        160,

      usaEjesTransversales:
        (existenteRow ? JSON.parse(existenteRow.formData).usaEjesTransversales : null) ?? false,

      ejesTransversales:
        (existenteRow ? JSON.parse(existenteRow.formData).ejesTransversales : null) ?? [],

      // Fusionar unidades importadas + unidades generadas por IA
      unidades: fusionarUnidades(campos.unidades, aiResult.unidades, existenteRow),

      metodologiasActivas:
        (existenteRow ? JSON.parse(existenteRow.formData).metodologiasActivas : null) ?? [],

      tecnicasEvaluacion:
        (existenteRow ? JSON.parse(existenteRow.formData).tecnicasEvaluacion : null) ?? [],

      // Fusionar objetivos: importados primero, luego IA, luego existentes
      objetivosArea:
        campos.objetivosArea ||
        aiResult.objetivosArea ||
        (existenteRow ? JSON.parse(existenteRow.formData).objetivosArea : "") ||
        "",

      objetivosGrado:
        campos.objetivosGrado ||
        aiResult.objetivosGrado ||
        (existenteRow ? JSON.parse(existenteRow.formData).objetivosGrado : "") ||
        "",

      // Fusionar bibliografía: importada primero, luego IA, luego existentes
      bibliografiaDocente:
        campos.bibliografia ||
        aiResult.bibliografiaSugerida ||
        (existenteRow ? JSON.parse(existenteRow.formData).bibliografiaDocente : "") ||
        "",

      // Fusionar observaciones: importadas primero, luego IA, luego existentes
      observaciones:
        campos.observaciones ||
        aiResult.observaciones ||
        (existenteRow ? JSON.parse(existenteRow.formData).observaciones : "") ||
        "",

      // Inserciones curriculares: importadas primero, luego existentes
      insercionesCurriculares:
        campos.insercionesCurriculares ||
        (existenteRow ? JSON.parse(existenteRow.formData).insercionesCurriculares : "") ||
        "",

      // Fusionar firmas: importadas primero, luego existentes
      firmaElaboradoPor:
        campos.firmaElaboradoPor ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaElaboradoPor : "") ||
        "",

      firmaElaboradoFecha:
        campos.firmaElaboradoFecha ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaElaboradoFecha : "") ||
        "",

      firmaRevisadoPor:
        campos.firmaRevisadoPor ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaRevisadoPor : "") ||
        "",

      firmaRevisadoFecha:
        campos.firmaRevisadoFecha ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaRevisadoFecha : "") ||
        "",

      firmaAprobadoPor:
        campos.firmaAprobadoPor ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaAprobadoPor : "") ||
        "",

      firmaAprobadoFecha:
        campos.firmaAprobadoFecha ||
        (existenteRow ? JSON.parse(existenteRow.formData).firmaAprobadoFecha : "") ||
        "",
    };

    let pcaId: number;
    let formatoPlantillaId: number | null = null;

    // ── Crear plantilla si se proporcionó buffer original ──────────
    if (originalBuffer) {
      // Verificar si el buffer es un DOCX válido (ZIP con word/document.xml)
      const isDocx =
        originalBuffer.length >= 4 &&
        originalBuffer[0] === 0x50 &&
        originalBuffer[1] === 0x4b &&
        originalBuffer[2] === 0x03 &&
        originalBuffer[3] === 0x04;

      if (isDocx) {
        try {
          const bufferNormalizado = await normalizarDocxPca(originalBuffer);

          const plantilla = await construirPlantilla(bufferNormalizado, campos);

          const templateBufferBase64 = bufferNormalizado.toString("base64");

          formatoPlantillaId = await createFormatoPlantilla({
            sessionId,
            nombre: `PCA - ${campos.institucion || "Sin nombre"} - ${campos.anioLectivo || ""}`,
            tipoPlanificacion: "pca",
            formatoOrigen: "docx",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            storageKey: "local",
            templateBufferBase64,
            estructura: JSON.stringify(plantilla.estructura),
            bindings: JSON.stringify(plantilla.bindings),
            configuracion: JSON.stringify(plantilla.configuracion),
          });

          console.log(`[pca-handler] Plantilla creada: ${formatoPlantillaId}`);
        } catch (err) {
          console.error("[pca-handler] ERROR creando plantilla:", err);
          // No bloqueamos el flujo por esto
        }
      } else {
        console.log("[pca-handler] Archivo no es DOCX, omitiendo creación de plantilla");
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
