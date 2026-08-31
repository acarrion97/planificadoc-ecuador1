import { DocumentoParseado, FilaTabla, PcaCamposExtraidos } from "./types";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
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
 * Busca la primera fila cuyo texto concatenado contenga `fragmento`.
 * Devuelve el índice o -1 si no se encuentra.
 */
function buscarFilaPorTexto(filas: FilaTabla[], fragmento: string): number {
  const objetivo = normalizar(fragmento);
  return filas.findIndex((fila) =>
    fila.some((celda) => normalizar(celda).includes(objetivo))
  );
}

/**
 * Busca la siguiente fila DESDE `desde` (exclusivo) que contenga `etiqueta`
 * y devuelve el valor de la celda siguiente (o la misma si tiene ":").
 * Se limita a `hasta` (exclusivo) para no cruzar secciones.
 */
function valorEntreSecciones(
  filas: FilaTabla[],
  desde: number,
  hasta: number,
  etiqueta: string
): string | undefined {
  const norm = normalizar(etiqueta);
  for (let i = desde + 1; i < Math.min(hasta, filas.length); i++) {
    for (let c = 0; c < filas[i].length; c++) {
      if (normalizar(filas[i][c]).startsWith(norm)) {
        // Intentar siguiente celda primero
        if (c + 1 < filas[i].length && filas[i][c + 1].trim()) {
          return filas[i][c + 1].trim();
        }
        // Fallback: después del ":"
        const match = filas[i][c].match(/^[^:]+:\s*(.+)$/);
        if (match) return match[1].trim();
      }
    }
  }
  return undefined;
}

/**
 * Extrae el contenido textual de una sección completa (todas las filas
 * entre `desde` y `hasta`), excluyendo la fila del encabezado.
 */
function extraerContenidoSeccion(filas: FilaTabla[], desde: number, hasta: number): string {
  const lineas: string[] = [];
  for (let i = desde + 1; i < Math.min(hasta, filas.length); i++) {
    const textoFila = filas[i].map((c) => c.trim()).filter(Boolean).join(" ");
    if (textoFila.trim()) {
      lineas.push(textoFila.trim());
    }
  }
  return lineas.join("\n");
}

/**
 * Mapea la estructura de tablas extraída de un `.docx` reconocido como PCA a
 * `PcaCamposExtraidos`. Usa delimitación por secciones para evitar que el
 * contenido de una sección se mezcle con la siguiente.
 *
 * Estructura típica del PCA:
 *   1. DATOS INFORMATIVOS
 *   2. TIEMPO
 *   3. OBJETIVOS GENERALES
 *   4. INSERCIONES CURRICULARES
 *   5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN
 *   6. BIBLIOGRAFÍA / WEBGRAFÍA
 *   7. OBSERVACIONES
 *   Firma (ELABORADO | REVISADO | APROBADO)
 */
export function mapearCamposPca(doc: DocumentoParseado): PcaCamposExtraidos {
  const filas = doc.tablas.flat();

  // ── Límites de sección ────────────────────────────────────────────────
  const idxObjetivos = buscarFilaPorTexto(filas, "OBJETIVOS");
  const idxInserciones = buscarFilaPorTexto(filas, "INSERCIONES");
  const idxUnidades = buscarFilaPorTexto(filas, "DESARROLLO DE UNIDADES");
  const idxBibliografia = buscarFilaPorTexto(filas, "BIBLIOGRAF");
  const idxObservaciones = buscarFilaPorTexto(filas, "OBSERVACIONES");
  const idxFirma = buscarFilaPorTexto(filas, "ELABORADO");

  // Límite final para secciones de contenido
  const limiteContenido = idxFirma !== -1 ? idxFirma : filas.length;

  // ── Fila 0 (Logo | Institución | Año lectivo) ────────────────────────
  const filaEncabezado = doc.tablas[0]?.[0];
  const institucion = celdaSignificativa(filaEncabezado?.[1], "NOMBRE DE LA INSTITUCIÓN")
    ?? celdaSignificativa(filaEncabezado?.[1], "NOMBRE INSTITUCION");
  const anioLectivo = celdaSignificativa(filaEncabezado?.[2], "AÑO LECTIVO");

  // ── Datos informativos ────────────────────────────────────────────────
  const docente = valorEntreSecciones(filas, -1, limiteContenido, "DOCENTE");
  const area = valorEntreSecciones(filas, -1, limiteContenido, "AREA:")
    ?? valorEntreSecciones(filas, -1, limiteContenido, "ÁREA:");
  const grado = valorEntreSecciones(filas, -1, limiteContenido, "GRADO/CURSO")
    ?? valorEntreSecciones(filas, -1, limiteContenido, "GRADO");
  const nivelEducativo = valorEntreSecciones(filas, -1, limiteContenido, "NIVEL EDUCATIVO");
  const paralelo = valorEntreSecciones(filas, -1, limiteContenido, "PARALELO");

  // ── Sección 2: Tiempo ─────────────────────────────────────────────────
  const idxTiempo = buscarFilaPorTexto(filas, "CARGA HORARIA SEMANAL");
  const limiteTiempo = idxInserciones !== -1 ? idxInserciones : (idxUnidades !== -1 ? idxUnidades : filas.length);
  const valoresTiempo = idxTiempo !== -1 && idxTiempo + 1 < Math.min(limiteTiempo, filas.length)
    ? filas[idxTiempo + 1]
    : undefined;
  const cargaHorariaSemanal = aNumero(valoresTiempo?.[0]);
  const semanasTrabajoTotal = aNumero(valoresTiempo?.[1]);
  const semanasEvaluacion = aNumero(valoresTiempo?.[2]);
  const totalSemanasClases = aNumero(valoresTiempo?.[3]);
  const totalPeriodos = aNumero(valoresTiempo?.[4]);

  // ── Sección 3: Objetivos (dos columnas: área | grado) ────────────────
  let objetivosArea: string | undefined;
  let objetivosGrado: string | undefined;

  if (idxObjetivos !== -1) {
    // Límite: siguiente sección conocida
    const limiteObjetivos = idxInserciones !== -1
      ? idxInserciones
      : (idxUnidades !== -1 ? idxUnidades : limiteContenido);

    // Buscar fila de etiquetas "Objetivos del área | Objetivos del grado"
    for (let i = idxObjetivos + 1; i < Math.min(limiteObjetivos, filas.length); i++) {
      const fila = filas[i];
      const textos = fila.map((c) => normalizar(c));

      const tieneArea = textos.some((t) => /OBJETIVOS?\s+DEL?\s+[AÁ]REA/.test(t));
      const tieneGrado = textos.some((t) => /OBJETIVOS?\s+DEL?\s+(GRADO|CURSO)/.test(t));

      if (tieneArea || tieneGrado) {
        // Esta fila tiene las etiquetas; la siguiente fila tiene el contenido
        if (i + 1 < limiteObjetivos) {
          const filaContenido = filas[i + 1];
          if (tieneArea) {
            objetivosArea = filaContenido[0]?.trim() || undefined;
          }
          if (tieneGrado) {
            objetivosGrado = filaContenido[filaContenido.length > 1 ? 1 : 0]?.trim() || undefined;
          }
        }
        break;
      }
    }

    // Fallback: si no se encontraron las etiquetas explícitas,
    // buscar contenido directamente después del encabezado de objetivos.
    // Saltar filas que parezcan etiquetas o encabezados de sección.
    if (!objetivosArea && !objetivosGrado) {
      for (let i = idxObjetivos + 1; i < Math.min(limiteObjetivos, filas.length); i++) {
        const fila = filas[i];
        const textoFila = fila.map((c) => c.trim()).filter(Boolean).join(" ");
        if (!textoFila) continue;

        // Saltar filas que son etiquetas de objetivos
        const esEtiqueta = fila.some((c) => {
          const n = normalizar(c);
          return /OBJETIVOS?\s+DEL?\s+(AREA|AÁREA|GRADO|CURSO)/.test(n);
        });
        if (esEtiqueta) continue;

        // Saltar encabezados de sección (empiezan con número + punto)
        const esEncabezadoSeccion = fila.some((c) => {
          const n = normalizar(c);
          return /^\d+\.\s+/.test(n) && /[A-Z]{3,}/.test(n);
        });
        if (esEncabezadoSeccion) continue;

        if (!objetivosArea && fila[0]?.trim()) {
          objetivosArea = fila[0].trim();
          if (fila[1]?.trim()) {
            objetivosGrado = fila[1].trim();
          }
          break;
        }
      }
    }
  }

  // ── Sección 4: Inserciones curriculares ──────────────────────────────
  let insercionesCurriculares: string | undefined;
  if (idxInserciones !== -1) {
    const limiteInserciones = idxUnidades !== -1 ? idxUnidades : limiteContenido;
    insercionesCurriculares = extraerContenidoSeccion(filas, idxInserciones, limiteInserciones) || undefined;
  }

  // ── Sección 6+7: Bibliografía y Observaciones ─────────────────────────
  let bibliografia: string | undefined;
  let observaciones: string | undefined;

  if (idxBibliografia !== -1) {
    const limiteBiblio = idxObservaciones !== -1 ? idxObservaciones : limiteContenido;
    bibliografia = extraerContenidoSeccion(filas, idxBibliografia, limiteBiblio) || undefined;
  }
  if (idxObservaciones !== -1) {
    observaciones = extraerContenidoSeccion(filas, idxObservaciones, limiteContenido) || undefined;
  }

  // ── Firmas ────────────────────────────────────────────────────────────
  const firmas = extraerFirmas(filas, idxFirma);

  // ── Sección 5: Unidades ──────────────────────────────────────────────
  const limiteUnidades = idxBibliografia !== -1 ? idxBibliografia : limiteContenido;
  const filasUnidades =
    idxUnidades !== -1 ? filas.slice(idxUnidades + 1, limiteUnidades) : [];

  // Buscar fila de encabezados de unidades (debe tener "N.°", "Título", etc.)
  let idxFilaEncabezadosUnidades = -1;
  for (let i = 0; i < filasUnidades.length; i++) {
    const textos = filasUnidades[i].map((c) => normalizar(c));
    const coincidencias = [
      textos.some((t) => /N[.°]/.test(t)),
      textos.some((t) => /T[ÍI]TULO/.test(t)),
      textos.some((t) => /OBJETIVOS.*ESP/.test(t)),
      textos.some((t) => /CONTENIDOS/.test(t)),
      textos.some((t) => /ORIENTACIONES/.test(t)),
      textos.some((t) => /EVALUACI/.test(t)),
      textos.some((t) => /DURACI|SEMANAS/.test(t)),
    ].filter(Boolean).length;

    if (coincidencias >= 2) {
      idxFilaEncabezadosUnidades = i;
      break;
    }
  }

  // Extraer unidades solo después de la fila de encabezados
  const unidadesFuente =
    idxFilaEncabezadosUnidades !== -1
      ? filasUnidades.slice(idxFilaEncabezadosUnidades + 1)
      : filasUnidades;

  const unidades = unidadesFuente
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
    paralelo,
    anioLectivo,
    nivelEducativo,
    cargaHorariaSemanal,
    semanasTrabajoTotal,
    semanasEvaluacion,
    totalSemanasClases,
    totalPeriodos,
    objetivosArea,
    objetivosGrado,
    insercionesCurriculares,
    bibliografia,
    observaciones,
    ...firmas,
    unidades,
  };
}

/**
 * Extrae las rúbricas de firmas del PCA.
 * La estructura típica es:
 *   Fila N:   ELABORADO | REVISADO | APROBADO
 *   Fila N+1: DOCENTE:  | VICERRECTOR: | DIRECTOR:
 *   Fila N+2: Firma:    | Firma:       | Firma:
 *   Fila N+3: Fecha:    | Fecha:       | Fecha:
 */
function extraerFirmas(
  filas: FilaTabla[],
  idxFilaELABORADO: number
): {
  firmaElaboradoPor?: string;
  firmaElaboradoFecha?: string;
  firmaRevisadoPor?: string;
  firmaRevisadoFecha?: string;
  firmaAprobadoPor?: string;
  firmaAprobadoFecha?: string;
} {
  const result: Record<string, string> = {};
  if (idxFilaELABORADO === -1) return result as any;

  const filaElaborado = filas[idxFilaELABORADO];
  if (!filaElaborado) return result as any;

  // Detectar qué columnas tienen ELABORADO/REVISADO/APROBADO
  const columnas: Array<{ tipo: "elaborado" | "revisado" | "aprobado"; idx: number }> = [];
  for (let c = 0; c < filaElaborado.length; c++) {
    const txt = normalizar(filaElaborado[c]);
    if (/^ELABORADO/.test(txt)) columnas.push({ tipo: "elaborado", idx: c });
    else if (/^REVISADO/.test(txt)) columnas.push({ tipo: "revisado", idx: c });
    else if (/^APROBADO/.test(txt)) columnas.push({ tipo: "aprobado", idx: c });
  }

  // Buscar nombre y fecha en las siguientes filas (hasta 5)
  for (let abajo = 1; abajo <= 5 && (idxFilaELABORADO + abajo) < filas.length; abajo++) {
    const filaAbajo = filas[idxFilaELABORADO + abajo];
    const textoAbajo = filaAbajo.map((c) => normalizar(c)).join(" ");

    // Fila con nombres (DOCENTE/DIRECTOR/VICERRECTOR/NOMBRE)
    if (/DOCENTE|DIRECTOR|VICERRECTOR|RECTOR|NOMBRE/.test(textoAbajo)) {
      for (const col of columnas) {
        if (col.idx < filaAbajo.length) {
          const celda = filaAbajo[col.idx];
          const valor = extraerValorDespuesDeDosPuntos(celda);
          if (valor) {
            const key = col.tipo === "elaborado" ? "firmaElaboradoPor"
              : col.tipo === "revisado" ? "firmaRevisadoPor"
              : "firmaAprobadoPor";
            result[key] = valor;
          }
        }
      }
    }

    // Fila con fechas
    if (/FECHA/.test(textoAbajo)) {
      for (const col of columnas) {
        if (col.idx < filaAbajo.length) {
          const celda = filaAbajo[col.idx];
          const valor = extraerValorDespuesDeDosPuntos(celda)
            ?? (normalizar(celda).includes("FECHA") ? celda.split(":").pop()?.trim() : undefined);
          if (valor) {
            const key = col.tipo === "elaborado" ? "firmaElaboradoFecha"
              : col.tipo === "revisado" ? "firmaRevisadoFecha"
              : "firmaAprobadoFecha";
            result[key] = valor;
          }
        }
      }
    }
  }

  return result as any;
}

/** Extrae el valor después de ":" en una celda */
function extraerValorDespuesDeDosPuntos(texto: string | undefined): string | undefined {
  if (!texto) return undefined;
  const match = texto.match(/^[^:]+:\s*(.+)$/);
  return match ? match[1].trim() : undefined;
}
