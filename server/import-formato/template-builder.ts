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
  rowSpan: number;
  colSpan: number;
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
 * Analiza el XML de un DOCX y extrae la estructura completa de tablas
 * con rowSpan, colSpan y texto original de cada celda.
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

    let maxCols = 0;
    const rows: FilaInfo[] = filasXml.map((fila, filaIdx) => {
      const celdasXml = buscarNodos([fila], "w:tc");
      const cells: CeldaInfo[] = celdasXml.map((celda, celdaIdx) => {
        const key = Object.keys(celda).find((k) => k !== ":@")!;
        const texto = textoDeNodo(celda[key]).trim();
        const rowSpan = extraerAtributo(celda, "vMerge") ?? 1;
        const colSpan = extraerAtributo(celda, "gridSpan") ?? 1;

        return {
          index: celdaIdx,
          rowSpan: rowSpan === 0 ? 1 : rowSpan, // vMerge=0 significa "continuar"
          colSpan,
          textoOriginal: texto,
        };
      });

      if (cells.length > maxCols) maxCols = cells.length;

      return { index: filaIdx, cells };
    });

    return {
      index: tablaIdx,
      filas: rows.length,
      columnas: maxCols,
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
 * el valor de la celda contigua.
 */
function detectarBindingsPca(
  estructura: PlantillaEstructura
): FieldBinding[] {
  const bindings: FieldBinding[] = [];

  // Patrones de búsqueda: texto de celda → campo canónico
  const patrones: Array<{
    patron: RegExp;
    campo: string;
    tipo: FieldBinding["tipo"];
  }> = [
    { patron: /NOMBRE.*INSTITUCI/i, campo: "institucion", tipo: "text" },
    { patron: /DOCENTE/i, campo: "docente", tipo: "text" },
    { patron: /ARE[AÁ]/i, campo: "area", tipo: "text" },
    { patron: /GRADO/i, campo: "grado", tipo: "text" },
    { patron: /A[NÑ]O.*LECTIVO/i, campo: "anioLectivo", tipo: "text" },
    { patron: /CARGA.*HORARIA/i, campo: "cargaHorariaSemanal", tipo: "number" },
    { patron: /SEMANAS.*TRABAJO/i, campo: "semanasTrabajoTotal", tipo: "number" },
    { patron: /EVALUACI/i, campo: "semanasEvaluacion", tipo: "number" },
    { patron: /OBJETIVOS.*AREA/i, campo: "objetivosArea", tipo: "text" },
    { patron: /OBJETIVOS.*GRADO/i, campo: "objetivosGrado", tipo: "text" },
    { patron: /BIBLIOGRAF/i, campo: "bibliografia", tipo: "text" },
    { patron: /OBSERVACIONES/i, campo: "observaciones", tipo: "text" },
  ];

  // Recorrer todas las tablas y filas buscando patrones
  for (const tabla of estructura.tablas) {
    for (const fila of tabla.rows) {
      for (let celdaIdx = 0; celdaIdx < fila.cells.length; celdaIdx++) {
        const celda = fila.cells[celdaIdx];
        const texto = celda.textoOriginal.trim();

        for (const { patron, campo, tipo } of patrones) {
          if (patron.test(texto)) {
            // La valor suele estar en la siguiente celda de la misma fila
            const siguienteCelda = fila.cells[celdaIdx + 1];
            if (siguienteCelda && siguienteCelda.textoOriginal.trim()) {
              bindings.push({
                id: campo,
                campo,
                tipo,
                ubicacion: {
                  tipo: "docx-cell",
                  tabla: tabla.index,
                  fila: fila.index,
                  columna: siguienteCelda.index,
                },
                obligatorio: ["institucion", "docente", "area", "grado"].includes(campo),
              });
            }
            break;
          }
        }
      }
    }
  }

  return bindings;
}

/**
 * Detecta la región repetible de unidades en el PCA.
 * Busca la fila con "DESARROLLO DE UNIDADES" y la siguiente fila
 * que contiene los encabezados de columna de las unidades.
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
        // La fila de encabezados de unidades suele ser 2 filas después
        const filaEncabezados = tabla.rows[fila.index + 2];
        if (!filaEncabezados) continue;

        // Verificar que tenga encabezados como "N.°", "Título", etc.
        const textos = filaEncabezados.cells.map((c) =>
          c.textoOriginal.trim().toUpperCase()
        );
        const tieneEncabezadosUnidades =
          textos.some((t) => /N[.°]/.test(t)) ||
          textos.some((t) => /T[ÍI]TULO/.test(t)) ||
          textos.some((t) => /OBJETIVOS.*ESP/.test(t));

        if (tieneEncabezadosUnidades) {
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
            columnas: [
              { campo: "numero", columna: 0 },
              { campo: "titulo", columna: 1 },
              { campo: "objetivosEspecificos", columna: 2 },
              { campo: "dcds", columna: 3 },
              { campo: "orientacionesMetodologicas", columna: 4 },
              { campo: "evaluacion", columna: 5 },
              { campo: "duracionSemanas", columna: 6 },
            ],
          };
        }
      }
    }
  }

  return null;
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
  });

  return {
    estructura,
    bindings: plantillaBindings,
    configuracion,
  };
}
