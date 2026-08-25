import { DocumentoParseado, FilaTabla, PcaCamposExtraidos } from "./types";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();
}

/** Busca en una fila la celda que empieza con `etiqueta` y devuelve la siguiente celda no vacía DE LA MISMA FILA. */
function valorTrasEtiquetaMismaFila(fila: FilaTabla, etiqueta: string): string | undefined {
  const idx = fila.findIndex((celda) => normalizar(celda).startsWith(normalizar(etiqueta)));
  if (idx === -1) return undefined;
  for (let i = idx + 1; i < fila.length; i++) {
    if (fila[i].trim().length > 0) return fila[i].trim();
  }
  return undefined;
}

function buscarEnFilas(filas: FilaTabla[], etiqueta: string): string | undefined {
  for (const fila of filas) {
    const valor = valorTrasEtiquetaMismaFila(fila, etiqueta);
    if (valor !== undefined) return valor;
  }
  return undefined;
}

/** Índice de la primera fila que contenga (en cualquier celda) un texto que incluya `fragmento`. */
function indiceFilaConTexto(filas: FilaTabla[], fragmento: string): number {
  const objetivo = normalizar(fragmento);
  return filas.findIndex((fila) => fila.some((celda) => normalizar(celda).includes(objetivo)));
}

function aNumero(texto: string | undefined): number | undefined {
  if (!texto) return undefined;
  const n = parseInt(texto.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? undefined : n;
}

function celdaSignificativa(texto: string | undefined, placeholder: string): string | undefined {
  const limpio = texto?.trim();
  if (!limpio) return undefined;
  return normalizar(limpio) === normalizar(placeholder) ? undefined : limpio;
}

/**
 * Mapea la estructura de tablas extraída de un `.docx` reconocido como PCA a
 * `PcaCamposExtraidos`. El formato oficial MinEduc mezcla dos patrones
 * distintos (verificados contra el PCA 2016-2017 real usado al proponer este
 * change, ver __tests__/fixtures/pca-oficial-2016-2017.doc):
 *  - "etiqueta: valor" dentro de la MISMA fila (Área, Docente, Grado/curso).
 *  - una fila de encabezados seguida de una fila de valores en las MISMAS
 *    columnas (Tiempo, Objetivos generales, Bibliografía/Observaciones, y la
 *    fila 0 Logo|Institución|Año lectivo).
 * Campos no encontrados quedan `undefined` para que el paso de IA los
 * complete (spec.md, Requirement: Completado de campos con IA).
 */
export function mapearCamposPca(doc: DocumentoParseado): PcaCamposExtraidos {
  const filas = doc.tablas.flat();

  // Fila 0 (Logo | Institución | Año lectivo): posicional, no "etiqueta: valor"
  // — en el formato oficial el docente reemplaza el texto placeholder de la
  // celda por su propio dato, así que no queda una etiqueta que buscar.
  const filaEncabezado = doc.tablas[0]?.[0];
  const institucion = celdaSignificativa(filaEncabezado?.[1], "NOMBRE DE LA INSTITUCIÓN");
  const anioLectivo = celdaSignificativa(filaEncabezado?.[2], "AÑO LECTIVO");

  const docente = buscarEnFilas(filas, "DOCENTE");
  const area = buscarEnFilas(filas, "AREA:") ?? buscarEnFilas(filas, "ÁREA:");
  const grado = buscarEnFilas(filas, "GRADO/CURSO") ?? buscarEnFilas(filas, "GRADO");

  // Sección 2 (Tiempo): fila de encabezados + fila de valores en las mismas columnas.
  const idxTiempo = indiceFilaConTexto(filas, "CARGA HORARIA SEMANAL");
  const valoresTiempo = idxTiempo !== -1 ? filas[idxTiempo + 1] : undefined;
  const cargaHorariaSemanal = aNumero(valoresTiempo?.[0]);
  const semanasTrabajoTotal = aNumero(valoresTiempo?.[1]);
  const semanasEvaluacion = aNumero(valoresTiempo?.[2]);

  // Sección 3 (Objetivos generales): misma estructura encabezado + valores.
  const idxObjetivos = indiceFilaConTexto(filas, "OBJETIVOS DEL AREA") !== -1
    ? indiceFilaConTexto(filas, "OBJETIVOS DEL AREA")
    : indiceFilaConTexto(filas, "OBJETIVOS DEL ÁREA");
  const valoresObjetivos = idxObjetivos !== -1 ? filas[idxObjetivos + 1] : undefined;
  const objetivosArea = celdaSignificativa(valoresObjetivos?.[0], "");
  const objetivosGrado = celdaSignificativa(valoresObjetivos?.[1], "");

  // Sección 6+7 (Bibliografía | Observaciones): misma estructura.
  const idxBiblio = indiceFilaConTexto(filas, "BIBLIOGRAF");
  const valoresBiblio = idxBiblio !== -1 ? filas[idxBiblio + 1] : undefined;
  const bibliografia = celdaSignificativa(valoresBiblio?.[0], "");
  const observaciones = celdaSignificativa(valoresBiblio?.[1], "");

  // Sección 5 (Unidades): solo entre su encabezado y el de Bibliografía, para
  // no confundir celdas numéricas de otras secciones (ej. "5" de carga
  // horaria) con un número de unidad.
  const idxUnidadesInicio = indiceFilaConTexto(filas, "DESARROLLO DE UNIDADES");
  const filasUnidades =
    idxUnidadesInicio !== -1 && idxBiblio !== -1 ? filas.slice(idxUnidadesInicio + 1, idxBiblio) : [];

  const unidades = filasUnidades
    .filter((fila) => /^\d+\.?$/.test(fila[0]?.trim() ?? ""))
    .map((fila) => ({
      numero: aNumero(fila[0]) ?? 0,
      titulo: fila[1]?.trim() || undefined,
      objetivosEspecificos: fila[2]?.trim() || undefined,
      contenidos: fila[3]?.trim() || undefined,
      orientacionesMetodologicas: fila[4]?.trim() || undefined,
      evaluacion: fila[5]?.trim() || undefined,
      duracionSemanas: aNumero(fila[6]),
    }))
    .filter((u) => u.numero > 0);

  return {
    institucion,
    docente,
    area,
    grado,
    anioLectivo,
    cargaHorariaSemanal,
    semanasTrabajoTotal,
    semanasEvaluacion,
    objetivosArea,
    objetivosGrado,
    bibliografia,
    observaciones,
    unidades,
  };
}
