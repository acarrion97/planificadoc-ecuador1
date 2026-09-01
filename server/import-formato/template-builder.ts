import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import {
  PlantillaEstructura,
  FieldBinding,
  RepeatRegion,
  PlantillaBindings,
  PlantillaAnalisis,
  PlantillaConfiguracion,
  PcaCamposExtraidos,
} from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
});

type XmlNode = Record<string, any>;

// ─── Funciones de extracción XML ────────────────────────────────────────────

function textoDeNodo(nodo: XmlNode[]): string {
  let out = "";
  for (const hijo of nodo) {
    const tag = Object.keys(hijo).find((k) => k !== ":@");
    if (!tag) continue;
    if (tag === "w:t") {
      const valor = hijo[tag];
      out += Array.isArray(valor)
        ? valor.map((v) => v["#text"] ?? "").join("")
        : (hijo["#text"] ?? "");
    } else if (tag === "w:tab") {
      out += "\t";
    } else if (tag === "w:br" || tag === "w:cr") {
      out += "\n";
    } else if (Array.isArray(hijo[tag])) {
      out += textoDeNodo(hijo[tag]);
    }
  }
  return out;
}

function buscarNodos(arbol: XmlNode[], tag: string): XmlNode[] {
  const encontrados: XmlNode[] = [];
  const recorrer = (nodos: XmlNode[]) => {
    for (const nodo of nodos) {
      const key = Object.keys(nodo).find((k) => k !== ":@");
      if (!key) continue;
      if (key === tag) encontrados.push(nodo);
      if (Array.isArray(nodo[key])) recorrer(nodo[key]);
    }
  };
  recorrer(arbol);
  return encontrados;
}

function extraerAtributo(nodo: XmlNode, attr: string): number | undefined {
  const attrs = nodo[":@"];
  if (!attrs) return undefined;
  const val = attrs[`@_w:${attr}`] ?? attrs[`@_${attr}`];
  return val !== undefined ? parseInt(String(val), 10) : undefined;
}

// ─── Análisis de estructura DOCX ────────────────────────────────────────────

type CeldaInfo = {
  index: number;
  colSpan: number;
  gridIndex: number; // posición lógica en la rejilla (después de aplicar gridSpan)
  textoOriginal: string;
};

type FilaInfo = {
  index: number;
  cells: CeldaInfo[];
};

type TablaInfo = {
  index: number;
  filas: number;
  columnas: number;
  rows: FilaInfo[];
};

/**
 * Resuelve qué celda física (índice en cells[]) ocupa una columna lógica del grid.
 * Considera gridSpan y vMerge para encontrar la celda correcta.
 *
 * @param fila - FilaInfo que contiene las celdas analizadas
 * @param gridCol - Columna lógica del grid (0-indexed)
 * @returns Índice en fila.cells[] o -1 si no se encontró
 */
function resolverCeldaPorColumnaGrid(fila: FilaInfo, gridCol: number): number {
  for (let i = 0; i < fila.cells.length; i++) {
    const celda = fila.cells[i];
    if (gridCol >= celda.gridIndex && gridCol < celda.gridIndex + celda.colSpan) {
      return i;
    }
  }
  return -1;
}

/**
 * Analiza el XML de un DOCX y extrae la estructura completa de tablas
 * con colSpan, posición lógica (gridIndex) y texto original de cada celda.
 *
 * vMerge: simplemente ignoramos filas continuación (sin restart) porque
 * no aportan una nueva fila visual — la celda viene de arriba.
 */
export async function analizarEstructuraDocx(
  buffer: Buffer
): Promise<PlantillaEstructura> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new Error("No se pudo leer el archivo DOCX.");
  }

  const documentXml = zip.file("word/document.xml");
  if (!documentXml) {
    throw new Error("El archivo DOCX no contiene word/document.xml.");
  }

  const xmlContent = await documentXml.async("string");
  const arbol = parser.parse(xmlContent);

  const tablasXml = buscarNodos(arbol, "w:tbl");

  const tablas: TablaInfo[] = tablasXml.map((tabla, tablaIdx) => {
    const filasXml = buscarNodos([tabla], "w:tr");

    let maxGridCols = 0;
    let gridCursor = 0; // posición actual en la rejilla lógica

    const rows: FilaInfo[] = filasXml.map((fila, filaIdx) => {
      const celdasXml = buscarNodos([fila], "w:tc");
      const cells: CeldaInfo[] = [];

      // Reconstruir la rejilla lógica: saltar columnas ocupadas por gridSpan
      // de filas anteriores (merge vertical implícito por posición)
      gridCursor = 0;

      for (const celda of celdasXml) {
        // Saltar columnas ocupadas por celdas gridSpan de filas anteriores
        // Simplificación: si la celda anterior en esta fila tiene gridSpan > 1,
        // el cursor avanza. Para merge vertical real necesitaríamos un mapa
        // de celdas activas, pero para el PCA oficial con solo gridSpan basta.

        const colSpan = extraerAtributo(celda, "gridSpan") ?? 1;
        const vMergeVal = extraerAtributo(celda, "vMerge");
        const isRestart = vMergeVal === undefined ||
          vMergeVal === 0 ||
          extraerAtributo(celda, "vMerge", "val") === "restart";

        // Ignorar celdas de continuación de merge vertical (no restart)
        // Solo si no es restart y tiene vMerge definido
        if (vMergeVal !== undefined && vMergeVal !== 0 && !isRestart) {
          // Celda de continuación: ocupa espacio visual pero no tiene contenido propio
          gridCursor += colSpan;
          continue;
        }

        const key = Object.keys(celda).find((k) => k !== ":@")!;
        const texto = textoDeNodo(celda[key]).trim();

        cells.push({
          index: cells.length,
          colSpan,
          gridIndex: gridCursor,
          textoOriginal: texto,
        });

        gridCursor += colSpan;
      }

      if (gridCursor > maxGridCols) maxGridCols = gridCursor;

      return { index: filaIdx, cells };
    });

    return {
      index: tablaIdx,
      filas: rows.length,
      columnas: maxGridCols,
      rows,
    };
  });

  return {
    version: 1,
    tipo: "docx",
    tablas,
  };
}

// ─── Detección de bindings para PCA ─────────────────────────────────────────

/**
 * Heurísticas para mapear celdas del PCA a campos canónicos.
 * Busca etiquetas en la primera celda de cada fila y asigna
 * la celda contigua como destino del binding.
 *
 * IMPORTANTE: La celda destino puede estar vacía en la plantilla oficial,
 * ya que es el sistema quien debe llenarla. Por eso no exigimos texto
 * en la celda destino.
 */
function detectarBindingsPca(
  estructura: PlantillaEstructura
): FieldBinding[] {
  const bindings: FieldBinding[] = [];

  // Patrones de búsqueda: texto de celda → campo canónico
  // Campos tipo "etiqueta | valor" en la misma fila.
  // Patrones flexibles: ^ y $ solo en patrones que no pueden confundir.
  //
  // NOTA: Los patrones de firmas (ELABORADO, REVISADO, APROBADO) se detectan
  // exclusivamente en el tercer paso (detectar rúbricas) porque necesitan
  // buscar en filas debajo, no en la siguiente celda.
  const patrones: Array<{
    patron: RegExp;
    campo: string;
    tipo: FieldBinding["tipo"];
    /** Si true, el valor reemplaza la celda del label (no la siguiente) */
    inPlace?: boolean;
  }> = [
    // Cabecera PCA — placeholders que deben reemplazarse en el mismo sitio
    { patron: /^NOMBRE\s*(?:DE\s*LA\s*)?INSTITUCI[ÓO]N$/i, campo: "institucion", tipo: "text", inPlace: true },
    { patron: /^A[NÑ]O\s*LECTIVO$/i, campo: "anioLectivo", tipo: "text", inPlace: true },
    // Etiquetas con valor en la celda contigua O después del ":" en la misma celda
    { patron: /^DOCENTE\(S\)\s*:\s*.+/i, campo: "docente", tipo: "text" },
    { patron: /^DOCENTE\s*:\s*.+/i, campo: "docente", tipo: "text" },
    { patron: /^DOCENTE\(S\)\s*:?\s*$/i, campo: "docente", tipo: "text" },
    { patron: /^DOCENTE\s*:?\s*$/i, campo: "docente", tipo: "text" },
    { patron: /^ÁREA\s*:?\s*$/i, campo: "area", tipo: "text" },
    { patron: /^ASIGNATURA\s*:?\s*$/i, campo: "asignatura", tipo: "text" },
    { patron: /^GRADO\/CURSO\s*:?\s*$/i, campo: "grado", tipo: "text" },
    { patron: /^NIVEL EDUCATIVO\s*:?\s*$/i, campo: "nivelEducativo", tipo: "text" },
    { patron: /^PARALELO\s*:?\s*$/i, campo: "paralelo", tipo: "text" },
  ];

  // Recorrer todas las tablas y filas buscando patrones
  for (const tabla of estructura.tablas) {
    for (const fila of tabla.rows) {
      let gridCol = 0; // posición lógica actual en la rejilla

      for (let celdaIdx = 0; celdaIdx < fila.cells.length; celdaIdx++) {
        const celda = fila.cells[celdaIdx];
        const texto = celda.textoOriginal.trim();

        for (const { patron, campo, tipo, inPlace } of patrones) {
          if (patron.test(texto)) {
            // Verificar que no exista ya un binding para este campo
            const yaExiste = bindings.some((b) => b.campo === campo);
            if (yaExiste) break;

            // Caso 0: inPlace — el valor reemplaza la celda del label (ej: "NOMBRE INSTITUCION")
            if (inPlace) {
              bindings.push({
                id: campo,
                campo,
                tipo,
                ubicacion: {
                  tipo: "docx-cell",
                  tabla: tabla.index,
                  fila: fila.index,
                  columna: celda.index,
                },
                obligatorio: ["institucion", "docente", "area", "grado"].includes(campo),
              });
              break;
            }

            // Caso 1: valor en la siguiente celda de la misma fila
            // Usar gridCol para encontrar la siguiente columna lógica
            const siguienteGridCol = gridCol + celda.colSpan;
            const idxSiguiente = resolverCeldaPorColumnaGrid(fila, siguienteGridCol);
            if (idxSiguiente >= 0) {
              bindings.push({
                id: campo,
                campo,
                tipo,
                ubicacion: {
                  tipo: "docx-cell",
                  tabla: tabla.index,
                  fila: fila.index,
                  columna: fila.cells[idxSiguiente].index,
                },
                obligatorio: ["institucion", "docente", "area", "grado"].includes(campo),
              });
              break;
            }

            // Caso 2: label y valor en la MISMA celda (ej: "NOMBRE: Escuela...")
            // El valor está después del ":"
            const matchColon = texto.match(/^([^:]+):\s*(.+)$/);
            if (matchColon) {
              bindings.push({
                id: campo,
                campo,
                tipo,
                ubicacion: {
                  tipo: "docx-cell",
                  tabla: tabla.index,
                  fila: fila.index,
                  columna: celda.index,
                },
                transformacion: "append-after-label",
                obligatorio: ["institucion", "docente", "area", "grado"].includes(campo),
              });
              break;
            }

            // Caso 3: No hay siguiente celda ni ":" → buscar debajo
            // (para etiquetas como "OBJETIVOS DEL ÁREA")
            break;
          }
        }

        gridCol += celda.colSpan;
      }
    }
  }

  // ── Segundo paso: detectar bindings "encabezado → fila siguiente utilizable" ──────
  // Para secciones donde el encabezado y el contenido están en filas consecutivas:
  //   Fila N:   [OBJETIVOS DEL ÁREA] [OBJETIVOS DEL GRADO]
  //   Fila N+1: [     VACÍA         ] [      VACÍA          ]
  //   Fila N+2: [     contenido     ] [      contenido      ]  ← si hay fila intermedia
  // Estos NUNCA deben buscar en la misma fila.
  // Buscamos hasta 4 filas debajo para encontrar una celda destino válida.
  function agregarBindingDebajo(
    tabla: TablaInfo,
    filaIdx: number,
    gridCol: number,
    campo: string,
    tipo: FieldBinding["tipo"]
  ) {
    for (
      let siguienteIdx = filaIdx + 1;
      siguienteIdx < Math.min(tabla.rows.length, filaIdx + 5);
      siguienteIdx++
    ) {
      const filaDestino = tabla.rows[siguienteIdx];

      // Usar grid resolver para encontrar la celda en la misma columna del grid
      const idxCelda = resolverCeldaPorColumnaGrid(filaDestino, gridCol);
      if (idxCelda >= 0) {
        bindings.push({
          id: campo,
          campo,
          tipo,
          ubicacion: {
            tipo: "docx-cell",
            tabla: tabla.index,
            fila: filaDestino.index,
            columna: filaDestino.cells[idxCelda].index,
          },
          obligatorio: false,
        });
        return;
      }

      // Fallback: si no se encontró por grid, usar la primera celda disponible
      if (filaDestino.cells.length > 0) {
        bindings.push({
          id: campo,
          campo,
          tipo,
          ubicacion: {
            tipo: "docx-cell",
            tabla: tabla.index,
            fila: filaDestino.index,
            columna: filaDestino.cells[0].index,
          },
          obligatorio: false,
        });
        return;
      }
    }
  }

  const patronesFilaSiguiente: Array<{
    patron: RegExp;
    campo: string;
    tipo: FieldBinding["tipo"];
  }> = [
    // Objetivos generales: valor en la fila de debajo del encabezado
    { patron: /OBJETIVOS.*[ÁA]REA/i, campo: "objetivosArea", tipo: "text" },
    { patron: /OBJETIVOS.*GRADO/i, campo: "objetivosGrado", tipo: "text" },
    // Tiempo: el valor está debajo del encabezado
    { patron: /CARGA.*HORARIA/i, campo: "cargaHorariaSemanal", tipo: "number" },
    { patron: /(NO\.?|N[ÚU]MERO).*SEMANAS.*TRABAJO|SEMANAS.*TRABAJO/i, campo: "semanasTrabajoTotal", tipo: "number" },
    { patron: /EVALUACI[ÓO]N.*APRENDIZAJE|APRENDIZAJE.*IMPREVISTOS|EVALUACI[ÓO]N\s*$/i, campo: "semanasEvaluacion", tipo: "number" },
    { patron: /TOTAL.*SEMANAS.*CLASE/i, campo: "totalSemanasClases", tipo: "number" },
    { patron: /TOTAL.*PER[IÍ]ODOS/i, campo: "totalPeriodos", tipo: "number" },
    // Secciones de contenido
    { patron: /BIBLIOGRAF/i, campo: "bibliografia", tipo: "text" },
    { patron: /OBSERVACIONES/i, campo: "observaciones", tipo: "text" },
    { patron: /EJES.*TRANSVERSALES/i, campo: "ejesTransversales", tipo: "text" },
  ];

  // Inserciones curriculares: el binding apunta a la FILA DEBAJO del encabezado,
  // no al encabezado mismo, para no reemplazar "4. INSERCIONES CURRICULARES".
  const patronesContenidoDebajo: Array<{
    patron: RegExp;
    campo: string;
    tipo: FieldBinding["tipo"];
  }> = [
    { patron: /INSERCIONES.*CURRICULARES/i, campo: "insercionesCurriculares", tipo: "text" },
  ];

  for (const tabla of estructura.tablas) {
    for (let filaIdx = 0; filaIdx < tabla.rows.length - 1; filaIdx++) {
      const fila = tabla.rows[filaIdx];
      let gridCol = 0;

      for (let celdaIdx = 0; celdaIdx < fila.cells.length; celdaIdx++) {
        const celda = fila.cells[celdaIdx];
        const texto = celda.textoOriginal.trim();
        const currentGridCol = gridCol;

        for (const { patron, campo, tipo } of patronesFilaSiguiente) {
          if (patron.test(texto)) {
            const yaExiste = bindings.some((b) => b.campo === campo);
            if (yaExiste) break;

            agregarBindingDebajo(tabla, filaIdx, currentGridCol, campo, tipo);
            break;
          }
        }

        for (const { patron, campo, tipo } of patronesContenidoDebajo) {
          if (patron.test(texto)) {
            const yaExiste = bindings.some((b) => b.campo === campo);
            if (yaExiste) break;

            agregarBindingDebajo(tabla, filaIdx, currentGridCol, campo, tipo);
            break;
          }
        }

        gridCol += celda.colSpan;
      }
    }
  }

  // ── Tercer paso: detectar rúbricas de firmas ────────────────────────────────
  // Estructura esperada:
  // ELABORADO | REVISADO | APROBADO
  // NOMBRE:    | NOMBRE:  | NOMBRE:
  // Firma:     | Firma:   | Firma:
  // Fecha:     | Fecha:   | Fecha:
  const rolesFirma = [
    {
      patron: /^ELABORADO\s*$/i,
      nombre: "firmaElaboradoPor",
      fecha: "firmaElaboradoFecha",
    },
    {
      patron: /^REVISADO\s*$/i,
      nombre: "firmaRevisadoPor",
      fecha: "firmaRevisadoFecha",
    },
    {
      patron: /^APROBADO\s*$/i,
      nombre: "firmaAprobadoPor",
      fecha: "firmaAprobadoFecha",
    },
  ];

  for (const tabla of estructura.tablas) {
    for (let filaIdx = 0; filaIdx < tabla.rows.length; filaIdx++) {
      const fila = tabla.rows[filaIdx];
      let gridCol = 0;

      for (let celdaIdx = 0; celdaIdx < fila.cells.length; celdaIdx++) {
        const celda = fila.cells[celdaIdx];
        const texto = celda.textoOriginal.trim();
        const currentGridCol = gridCol;

        const rol = rolesFirma.find((r) => r.patron.test(texto));
        if (!rol) {
          gridCol += celda.colSpan;
          continue;
        }

        // Buscar NOMBRE: y FECHA: debajo del encabezado, en la misma columna del grid
        // Estructura esperada:
        //   Fila N:   ELABORADO | REVISADO | APROBADO
        //   Fila N+1: DOCENTE:  | VICERRECTOR: | DIRECTOR:  ← etiquetas
        //   Fila N+2: [nombre]  | [nombre]      | [nombre]  ← DESTINO para nombre
        //   Fila N+3: Firma:    | Firma:         | Firma:
        //   Fila N+4: Fecha:    | Fecha:         | Fecha:    ← DESTINO para fecha
        for (
          let abajo = filaIdx + 1;
          abajo < Math.min(tabla.rows.length, filaIdx + 6);
          abajo++
        ) {
          const filaAbajo = tabla.rows[abajo];

          // Usar grid resolver para encontrar la celda en la misma columna del grid
          const idxCeldaAbajo = resolverCeldaPorColumnaGrid(filaAbajo, currentGridCol);
          if (idxCeldaAbajo < 0) continue;

          const celdaAbajo = filaAbajo.cells[idxCeldaAbajo];
          const etiqueta = celdaAbajo.textoOriginal.trim();

          // Si encontramos la fila de etiquetas (DOCENTE:, NOMBRE:, etc.),
          // la celda destino está en la SIGUIENTE fila (una más abajo)
          if (/^(?:NOMBRE|DOCENTE|DIRECTOR|VICERRECTOR|RECTOR)\s*:/i.test(etiqueta)) {
            const yaExiste = bindings.some((b) => b.campo === rol.nombre);
            if (!yaExiste && abajo + 1 < tabla.rows.length) {
              const filaDestino = tabla.rows[abajo + 1];
              const idxCeldaDestino = resolverCeldaPorColumnaGrid(filaDestino, currentGridCol);
              if (idxCeldaDestino >= 0) {
                bindings.push({
                  id: rol.nombre,
                  campo: rol.nombre,
                  tipo: "text",
                  ubicacion: {
                    tipo: "docx-cell",
                    tabla: tabla.index,
                    fila: filaDestino.index,
                    columna: filaDestino.cells[idxCeldaDestino].index,
                  },
                  obligatorio: false,
                });
              }
            }
          }

          if (/^FECHA\s*:/i.test(etiqueta)) {
            const yaExiste = bindings.some((b) => b.campo === rol.fecha);
            if (!yaExiste) {
              bindings.push({
                id: rol.fecha,
                campo: rol.fecha,
                tipo: "text",
                ubicacion: {
                  tipo: "docx-cell",
                  tabla: tabla.index,
                  fila: filaAbajo.index,
                  columna: celdaAbajo.index,
                },
                transformacion: "append-after-label",
                obligatorio: false,
              });
            }
          }
        }

        gridCol += celda.colSpan;
      }
    }
  }

  return bindings;
}

/**
 * Detecta la región repetible de unidades en el PCA.
 * Busca la fila con "DESARROLLO DE UNIDADES" y la fila de encabezados
 * de columnas (N.°, Título, etc.) que puede estar 1-3 filas después.
 */
function detectarRegionUnidadesPca(
  estructura: PlantillaEstructura
): RepeatRegion | null {
  for (const tabla of estructura.tablas) {
    for (const fila of tabla.rows) {
      const textoFila = fila.cells
        .map((c) => c.textoOriginal)
        .join(" ")
        .toUpperCase();

      if (textoFila.includes("DESARROLLO DE UNIDADES")) {
        // Buscar la fila de encabezados en las siguientes 1-5 filas
        for (let offset = 1; offset <= 5; offset++) {
          const filaEncabezados = tabla.rows[fila.index + offset];
          if (!filaEncabezados) continue;

          // Verificar que tenga encabezados como "N.°", "Título", etc.
          // Exigir al menos 2 coincidencias para evitar falsos positivos
          const textos = filaEncabezados.cells.map((c) =>
            c.textoOriginal.trim().toUpperCase()
          );
          const coincidencias = [
            textos.some((t) => /N[.°]/.test(t)),
            textos.some((t) => /T[ÍI]TULO/.test(t)),
            textos.some((t) => /OBJETIVOS.*ESP/.test(t)),
            textos.some((t) => /CONTENIDOS/.test(t)),
            textos.some((t) => /ORIENTACIONES/.test(t)),
            textos.some((t) => /EVALUACI/.test(t)),
            textos.some((t) => /DURACI|SEMANAS/.test(t)),
          ].filter(Boolean).length;

          const tieneEncabezadosUnidades = coincidencias >= 2;

          if (tieneEncabezadosUnidades) {
            // Mapear columnas usando gridIndex (posición lógica en la rejilla)
            const columnas = mapearColumnasUnidades(filaEncabezados.cells);

            return {
              id: "unidades",
              nombre: "Unidades de planificación",
              origenDatos: "unidades",
              ubicacion: {
                tipo: "docx-table",
                tabla: tabla.index,
                filaInicio: filaEncabezados.index + 1,
                filaPlantilla: filaEncabezados.index + 1,
              },
              columnas,
            };
          }
        }
      }
    }
  }

  return null;
}

/**
 * Mapea los encabezados de columna de unidades a campos canónicos.
 * Usa gridIndex (posición lógica en la rejilla) para el mapeo.
 * Filtra columnas auxiliares (como numeración de página) que no son contenido.
 */
function mapearColumnasUnidades(
  cells: CeldaInfo[]
): Array<{ campo: string; columna: number; celdaFisica: number }> {
  const mapeo: Array<{ campo: string; columna: number; celdaFisica: number }> = [];

  for (const cell of cells) {
    const enc = cell.textoOriginal.trim().toUpperCase();

    // Filtrar columnas auxiliares (solo números, puntuación, etc.)
    if (/^\d+$/.test(enc) || /^[.\-–—]+$/.test(enc) || enc.length === 0) {
      continue;
    }

    const col = cell.gridIndex;

    if (/N[.°]/.test(enc)) {
      mapeo.push({ campo: "numero", columna: col, celdaFisica: cell.index });
    } else if (/T[ÍI]TULO/.test(enc)) {
      mapeo.push({ campo: "titulo", columna: col, celdaFisica: cell.index });
    } else if (/OBJETIVOS.*ESP/.test(enc)) {
      mapeo.push({ campo: "objetivosEspecificos", columna: col, celdaFisica: cell.index });
    } else if (/CONTENIDOS/.test(enc)) {
      mapeo.push({ campo: "contenidos", columna: col, celdaFisica: cell.index });
    } else if (/ORIENTACIONES/.test(enc) || /METODOLOG/.test(enc)) {
      mapeo.push({ campo: "orientacionesMetodologicas", columna: col, celdaFisica: cell.index });
    } else if (/EVALUACI/.test(enc)) {
      mapeo.push({ campo: "evaluacion", columna: col, celdaFisica: cell.index });
    } else if (/DURACI/.test(enc) || /SEMANAS/.test(enc)) {
      mapeo.push({ campo: "duracionSemanas", columna: col, celdaFisica: cell.index });
    } else if (/DESTREZAS?|DCD|DESTREZA CON CRITERIO/i.test(enc)) {
      mapeo.push({ campo: "dcds", columna: col, celdaFisica: cell.index });
    }
  }

  // Fallback: si no se pudo mapear, usar posiciones por defecto
  // NOTA: El fallback no incluye "dcds" para no crear columna inexistente en plantillas sin ella
  if (mapeo.length === 0) {
    return [
      { campo: "numero", columna: 0, celdaFisica: 0 },
      { campo: "titulo", columna: 1, celdaFisica: 1 },
      { campo: "objetivosEspecificos", columna: 2, celdaFisica: 2 },
      { campo: "contenidos", columna: 3, celdaFisica: 3 },
      { campo: "orientacionesMetodologicas", columna: 4, celdaFisica: 4 },
      { campo: "evaluacion", columna: 5, celdaFisica: 5 },
    ];
  }

  return mapeo;
}

// ─── Builder principal ──────────────────────────────────────────────────────

/**
 * Analiza un DOCX y crea la plantilla completa con estructura y bindings.
 *
 * Flujo:
 *   1. Extraer estructura XML (tablas, filas, celdas, rowSpan/colSpan)
 *   2. Detectar bindings de campos simples (institucion, docente, etc.)
 *   3. Detectar regiones repetibles (unidades)
 *   4. Generar configuración de exportación
 */
export async function construirPlantilla(
  buffer: Buffer,
  camposExtraidos?: PcaCamposExtraidos
): Promise<PlantillaAnalisis> {
  const estructura = await analizarEstructuraDocx(buffer);

  // Detectar bindings usando heurísticas
  const bindingsDetectados = detectarBindingsPca(estructura);

  // Detectar regiones repetibles
  const regionUnidad = detectarRegionUnidadesPca(estructura);
  const regionesRepetibles: RepeatRegion[] = regionUnidad
    ? [regionUnidad]
    : [];

  // Completar bindings con datos extraídos si están disponibles
  const bindings: FieldBinding[] = bindingsDetectados.map((b) => {
    if (camposExtraidos && b.campo in camposExtraidos) {
      const valor = (camposExtraidos as any)[b.campo];
      if (valor !== undefined && valor !== null) {
        return { ...b, valorDetectado: String(valor) };
      }
    }
    return b;
  });

  const plantillaBindings: PlantillaBindings = {
    campos: bindings,
    regionesRepetibles,
  };

  const configuracion: PlantillaConfiguracion = {
    nombreArchivo: "planificacion-exportada",
  };

  console.log("[template-builder] Plantilla construida:", {
    tablas: estructura.tablas.length,
    bindings: bindings.length,
    regionesRepetibles: regionesRepetibles.length,
    camposDetectados: bindings.map((b) => ({
      campo: b.campo,
      tabla: (b.ubicacion as any).tabla,
      fila: (b.ubicacion as any).fila,
      columna: (b.ubicacion as any).columna,
    })),
  });

  return {
    estructura,
    bindings: plantillaBindings,
    configuracion,
  };
}
