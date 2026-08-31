import JSZip from "jszip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import {
  PlantillaBindings,
  FieldBinding,
  RepeatRegion,
  DocxCellLocation,
} from "./types";
import { obtenerIconosDestreza } from "../../src/data/iconosPorDestreza";
import { ICONOS_DCD_BASE64 } from "../../lib/iconos-base64";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  preserveOrder: true,
  format: false,
});

type XmlNode = Record<string, any>;

// ─── Contexto de renderizado (para manejar imágenes y ZIP) ───────────────────

type RenderContext = {
  zip: JSZip;
  nextRelId: number;
  imagesToAdd: Array<{ relId: string; targetPath: string; base64Data: string }>;
};

// ─── Funciones XML ──────────────────────────────────────────────────────────

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

/**
 * Reemplaza el texto de un nodo w:tc (celda) preservando los estilos.
 */
function reemplazarTextoEnCelda(celda: XmlNode, nuevoTexto: string): void {
  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  const textos = buscarNodos(celda[key] ?? [], "w:t");

  if (textos.length === 0) {
    const contenido = celda[key];
    if (!Array.isArray(contenido)) return;

    const runs = buscarNodos(contenido, "w:r");
    let nuevoRun: XmlNode;
    if (runs.length > 0) {
      nuevoRun = JSON.parse(JSON.stringify(runs[0]));
      const tNodes = buscarNodos([nuevoRun], "w:t");
      for (const t of tNodes) {
        const tKey = Object.keys(t).find((k) => k !== ":@");
        if (tKey === "w:t") {
          if (Array.isArray(t["w:t"])) {
            t["w:t"][0]["#text"] = nuevoTexto;
          } else {
            t["#text"] = nuevoTexto;
          }
          return;
        }
      }
      const runChildren = nuevoRun["w:r"];
      if (Array.isArray(runChildren)) {
        runChildren.push({ "w:t": [{ "#text": nuevoTexto }] });
      }
    } else {
      nuevoRun = {
        "w:r": [
          { "w:t": [{ "#text": nuevoTexto }] },
        ],
      };
    }

    const pNodes = buscarNodos(contenido, "w:p");
    if (pNodes.length > 0) {
      const ultimoP = pNodes[pNodes.length - 1];
      const pKey = Object.keys(ultimoP).find((k) => k !== ":@");
      if (pKey && Array.isArray(ultimoP[pKey])) {
        ultimoP[pKey].push(nuevoRun);
      }
    } else {
      const nuevoP: XmlNode = { "w:p": [nuevoRun] };
      contenido.push(nuevoP);
    }
    return;
  }

  let primero = true;
  for (const nodoTexto of textos) {
    if (primero) {
      const valKey = Object.keys(nodoTexto).find((k) => k !== ":@");
      if (valKey === "w:t") {
        if (Array.isArray(nodoTexto["w:t"])) {
          nodoTexto["w:t"][0]["#text"] = nuevoTexto;
        } else {
          nodoTexto["#text"] = nuevoTexto;
        }
      }
      primero = false;
    } else {
      const valKey = Object.keys(nodoTexto).find((k) => k !== ":@");
      if (valKey === "w:t") {
        if (Array.isArray(nodoTexto["w:t"])) {
          nodoTexto["w:t"][0]["#text"] = "";
        } else {
          nodoTexto["#text"] = "";
        }
      }
    }
  }
}

// ─── Normalización de valores ────────────────────────────────────────────────

function valorParaDocx(valor: unknown): string {
  if (valor == null) return "";
  if (typeof valor === "string") return valor;
  if (typeof valor === "number" || typeof valor === "boolean") return String(valor);
  if (Array.isArray(valor)) {
    return valor.map(valorParaDocx).filter(Boolean).join("\n");
  }
  if (typeof valor === "object") {
    return Object.values(valor as Record<string, unknown>)
      .map(valorParaDocx)
      .filter(Boolean)
      .join("\n");
  }
  return String(valor);
}

// ─── Anchos de columna ──────────────────────────────────────────────────────

/**
 * Lee el ancho de una celda en twips desde w:tcPr > w:tcW.
 * Retorna 0 si no tiene ancho definido.
 */
function leerAnchoCelda(celda: XmlNode): number {
  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return 0;

  const contenido = celda[key];
  if (!Array.isArray(contenido)) return 0;

  const tcPr = contenido.find((n: XmlNode) => {
    const k = Object.keys(n).find((kk) => kk !== ":@");
    return k === "w:tcPr";
  });
  if (!tcPr) return 0;

  const tcPrKey = Object.keys(tcPr).find((k) => k !== ":@")!;
  const tcPrChildren = tcPr[tcPrKey];
  if (!Array.isArray(tcPrChildren)) return 0;

  const tcW = tcPrChildren.find((n: XmlNode) => {
    const k = Object.keys(n).find((kk) => kk !== ":@");
    return k === "w:tcW";
  });
  if (!tcW) return 0;

  const attrs = tcW[":@"];
  if (!attrs) return 0;
  const val = attrs["@_w:w"] ?? attrs["@_w"];
  return val !== undefined ? parseInt(String(val), 10) : 0;
}

/**
 * Establece el ancho de una celda en twips.
 * Crea w:tcPr > w:tcW si no existe.
 */
function setAnchoCelda(celda: XmlNode, ancho: number): void {
  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  let contenido = celda[key];
  if (!Array.isArray(contenido)) {
    contenido = [];
    celda[key] = contenido;
  }

  let tcPr = contenido.find((n: XmlNode) => {
    const k = Object.keys(n).find((kk) => kk !== ":@");
    return k === "w:tcPr";
  });

  if (!tcPr) {
    tcPr = { "w:tcPr": [] };
    contenido.unshift(tcPr);
  }

  const tcPrKey = Object.keys(tcPr).find((k) => k !== ":@")!;
  let tcPrChildren = tcPr[tcPrKey];
  if (!Array.isArray(tcPrChildren)) {
    tcPrChildren = [];
    tcPr[tcPrKey] = tcPrChildren;
  }

  let tcW = tcPrChildren.find((n: XmlNode) => {
    const k = Object.keys(n).find((kk) => kk !== ":@");
    return k === "w:tcW";
  });

  if (!tcW) {
    tcW = { ":@": { "@_w:type": "dxa" }, "w:tcW": [] };
    tcPrChildren.push(tcW);
  }

  // Set width
  tcW[":@"] = { "@_w:w": String(ancho), "@_w:type": "dxa" };
}

/**
 * Recalcula todos los anchos de columna de una tabla cuando se agrega una nueva columna.
 * Escala proporcionalmente para que quepa dentro del ancho de página.
 */
function recalcularAnchosTabla(
  tabla: XmlNode,
  filas: XmlNode[],
  numColumnasOriginal: number
): void {
  const ANCHO_PAGINA_DXA = 9026; // A4 con márgenes de 1" (aprox)

  // Leer anchos de la primera fila de datos
  const primeraFila = filas[0];
  if (!primeraFila) return;

  const celdasPrimeraFila = buscarNodos([primeraFila], "w:tc");
  const anchosOriginales: number[] = [];
  for (let i = 0; i < Math.min(numColumnasOriginal, celdasPrimeraFila.length); i++) {
    anchosOriginales.push(leerAnchoCelda(celdasPrimeraFila[i]));
  }

  const totalOriginal = anchosOriginales.reduce((a, b) => a + b, 0);
  if (totalOriginal <= 0) return;

  // Calcular ancho para la nueva columna (promedio de las existentes)
  const anchoPromedio = totalOriginal / anchosOriginales.length;
  const nuevoTotal = totalOriginal + anchoPromedio;

  // Si excede el ancho de página, escalar proporcionalmente
  let factor = 1;
  if (nuevoTotal > ANCHO_PAGINA_DXA) {
    factor = ANCHO_PAGINA_DXA / nuevoTotal;
  }

  // Aplicar anchos escalados a TODAS las filas de la tabla
  const todasLasFilas = buscarNodos([tabla], "w:tr");
  for (const fila of todasLasFilas) {
    const celdas = buscarNodos([fila], "w:tc");
    for (let i = 0; i < celdas.length; i++) {
      if (i < anchosOriginales.length) {
        // Columnas originales: escalar
        setAnchoCelda(celdas[i], Math.round(anchosOriginales[i] * factor));
      } else {
        // Nueva columna (Destrezas): ancho promedio escalado
        setAnchoCelda(celdas[i], Math.round(anchoPromedio * factor));
      }
    }
  }
}

// ─── Iconos DCD ─────────────────────────────────────────────────────────────

/**
 * Extrae los bytes raw de un data URI base64.
 */
function dataUriToBuffer(dataUri: string): Buffer {
  const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

/**
 * Genera el nodo XML DrawingML para una imagen inline en DOCX.
 * cx/cy están en EMU (English Metric Units). 1 pt ≈ 12700 EMU.
 */
function crearNodoDrawing(
  relId: string,
  nombreArchivo: string,
  sizeEmu: number
): XmlNode {
  return {
    "w:drawing": [
      {
        ":@": {
          "@xmlns:wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
          "@xmlns:a": "http://schemas.openxmlformats.org/drawingml/2006/main",
          "@xmlns:pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
          "@xmlns:r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        },
      },
      {
        "wp:inline": [
          {
            ":@": {
              "@distT": "0",
              "@distB": "0",
              "@distL": "0",
              "@distR": "0",
            },
          },
          {
            "wp:extent": [],
            ":@": { "@cx": String(sizeEmu), "@cy": String(sizeEmu) },
          },
          {
            "wp:docPr": [],
            ":@": { "@id": relId, "@name": nombreArchivo },
          },
          {
            "a:graphic": [
              {
                "a:graphicData": [
                  {
                    ":@": {
                      "@uri": "http://schemas.openxmlformats.org/drawingml/2006/picture",
                    },
                  },
                  {
                    "pic:pic": [
                      {
                        "pic:nvPicPr": [
                          {
                            "pic:cNvPr": [],
                            ":@": {
                              "@id": relId,
                              "@name": nombreArchivo,
                            },
                          },
                          {
                            "pic:cNvPicPr": [],
                          },
                        ],
                      },
                      {
                        "pic:blipFill": [
                          {
                            "a:blip": [],
                            ":@": { "@r:embed": `rId${relId}` },
                          },
                          {
                            "a:stretch": [
                              {
                                "a:fillRect": [],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        "pic:spPr": [
                          {
                            "a:xfrm": [
                              {
                                "a:off": [],
                                ":@": { "@x": "0", "@y": "0" },
                              },
                              {
                                "a:ext": [],
                                ":@": {
                                  "@cx": String(sizeEmu),
                                  "@cy": String(sizeEmu),
                                },
                              },
                            ],
                          },
                          {
                            "a:prstGeom": [],
                            ":@": { "@prst": "rect" },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Agrega contenido DCD (texto + iconos) a una celda.
 * Soporta tanto string simple como array de objetos DCD.
 */
function agregarContenidoDcdACelda(
  celda: XmlNode,
  dcds: any,
  ctx: RenderContext,
  iconSizeEmu: number
): void {
  // Normalizar: si es string, dividir por líneas
  let lineas: Array<{ texto: string; codigo?: string }> = [];
  if (typeof dcds === "string") {
    lineas = dcds
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const match = l.match(/^([^:]+):\s*(.+)$/);
        return match
          ? { texto: l, codigo: match[1].trim() }
          : { texto: l };
      });
  } else if (Array.isArray(dcds)) {
    lineas = dcds.map((d: any) => {
      if (typeof d === "string") {
        const match = d.match(/^([^:]+):\s*(.+)$/);
        return match
          ? { texto: d, codigo: match[1].trim() }
          : { texto: d };
      }
      return {
        texto: d.codigo && d.enunciado
          ? `${d.codigo}: ${d.enunciado}`
          : d.enunciado || d.codigo || String(d),
        codigo: d.codigo,
      };
    });
  }

  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  // Crear un w:p con todo el contenido
  const paragraphChildren: XmlNode[] = [];

  for (const linea of lineas) {
    // Texto de la línea
    const runTextNode: XmlNode = {
      "w:r": [
        { "w:t": [{ "#text": linea.texto }] },
      ],
    };
    paragraphChildren.push(runTextNode);

    // Iconos para esta línea
    if (linea.codigo) {
      const iconNames = obtenerIconosDestreza(linea.codigo);
      for (const iconName of iconNames) {
        const dataUri = ICONOS_DCD_BASE64[iconName];
        if (!dataUri) continue;

        const relId = ctx.nextRelId++;
        const archivoNombre = `${iconName}.png`;

        ctx.imagesToAdd.push({
          relId: String(relId),
          targetPath: `word/media/${archivoNombre}`,
          base64Data: dataUri,
        });

        const drawingNode = crearNodoDrawing(
          String(relId),
          archivoNombre,
          iconSizeEmu
        );

        // Agregar espacio antes del icono
        paragraphChildren.push({
          "w:r": [{ "w:t": [{ "#text": " " }] }],
        });
        paragraphChildren.push(drawingNode);
      }
    }

    // Salto de línea entre DCDs (excepto la última)
    if (lineas.indexOf(linea) < lineas.length - 1) {
      paragraphChildren.push({
        "w:r": [{ "w:br": [] }],
      });
    }
  }

  // Reemplazar contenido de la celda con el nuevo w:p
  const contenido = celda[key];
  if (Array.isArray(contenido)) {
    // Eliminar w:p existentes y agregar nuevo
    const nuevosContenidos = contenido.filter((n: XmlNode) => {
      const k = Object.keys(n).find((kk) => kk !== ":@");
      return k !== "w:p" && k !== "w:r" && k !== "w:t";
    });
    nuevosContenidos.push({ "w:p": paragraphChildren });
    celda[key] = nuevosContenidos;
  }
}

// ─── Renderizado de campos simples ──────────────────────────────────────────

function renderizarCampos(
  tablas: XmlNode[],
  bindings: FieldBinding[],
  datos: Record<string, any>
): void {
  for (const binding of bindings) {
    const valor = datos[binding.campo];
    if (valor === undefined || valor === null) continue;

    const loc = binding.ubicacion as DocxCellLocation;
    if (loc.tipo !== "docx-cell") continue;

    const tabla = tablas[loc.tabla];
    if (!tabla) continue;

    const filas = buscarNodos([tabla], "w:tr");
    const fila = filas[loc.fila];
    if (!fila) continue;

    const celdas = buscarNodos([fila], "w:tc");
    const celda = celdas[loc.columna];
    if (!celda) continue;

    const textoValor = valorParaDocx(valor);

    if (binding.transformacion === "append-after-label") {
      const key = Object.keys(celda).find((k) => k !== ":@");
      if (key && key === "w:tc") {
        const contenido = celda[key];
        if (Array.isArray(contenido)) {
          const textos = buscarNodos([contenido], "w:t");
          let textoActual = "";
          for (const nodo of textos) {
            const nodoKey = Object.keys(nodo).find((k) => k !== ":@");
            if (nodoKey === "w:t") {
              if (Array.isArray(nodo["w:t"])) {
                textoActual += nodo["w:t"][0]["#text"] ?? "";
              } else {
                textoActual += nodo["#text"] ?? "";
              }
            }
          }
          const textoFinal = `${textoActual.trim()} ${textoValor}`.trim();
          reemplazarTextoEnCelda(celda, textoFinal);
        } else {
          reemplazarTextoEnCelda(celda, textoValor);
        }
      }
    } else {
      reemplazarTextoEnCelda(celda, textoValor);
    }
  }
}

// ─── Renderizado de regiones repetibles ─────────────────────────────────────

function renderizarRegionRepetible(
  tabla: XmlNode,
  region: RepeatRegion,
  items: any[],
  ctx: RenderContext
): void {
  if (!items || items.length === 0) return;

  const filas = buscarNodos([tabla], "w:tr");
  const filaPlantilla = filas[region.ubicacion.filaPlantilla];
  if (!filaPlantilla) return;

  const tieneColumnaDcds = region.columnas.some((c) => c.campo === "dcds");
  const itemsTienenDcds = items.some((item) => item.dcds && String(item.dcds).trim() !== "");
  const necesitaAgregarDcds = itemsTienenDcds && !tieneColumnaDcds;

  // Detectar cuántas columnas tiene la plantilla (antes de agregar Destrezas)
  const celdasPlantilla = buscarNodos([filaPlantilla], "w:tc");
  const numColumnasOriginal = celdasPlantilla.length;

  // Función auxiliar: llenar celdas de una fila con datos de un item
  function llenarFila(fila: XmlNode, item: any): void {
    const celdas = buscarNodos([fila], "w:tc");
    for (const col of region.columnas) {
      if (col.campo === "dcds") continue; // Manejado aparte con iconos
      const valor = item[col.campo];
      if (valor === undefined || valor === null) continue;
      const celda = celdas[col.celdaFisica];
      if (!celda) continue;
      reemplazarTextoEnCelda(celda, valorParaDocx(valor));
    }
  }

  // Función auxiliar: agregar columna dcds a una fila si se necesita
  function agregarColumnaDcds(fila: XmlNode): void {
    const celdas = buscarNodos([fila], "w:tc");
    if (celdas.length === 0) return;
    const ultimaCelda = celdas[celdas.length - 1];
    const nuevaCelda = JSON.parse(JSON.stringify(ultimaCelda));
    // Limpiar contenido
    const textos = buscarNodos([nuevaCelda], "w:t");
    for (const nodo of textos) {
      const nodoKey = Object.keys(nodo).find((k) => k !== ":@");
      if (nodoKey === "w:t") {
        if (Array.isArray(nodo["w:t"])) {
          nodo["w:t"][0]["#text"] = "";
        } else {
          nodo["#text"] = "";
        }
      }
    }
    const filaKey = Object.keys(fila).find((k) => k !== ":@");
    if (filaKey && Array.isArray(fila[filaKey])) {
      fila[filaKey].push(nuevaCelda);
    }
  }

  // Paso 1: Reemplazar la fila plantilla IN SITU con el primer item
  if (necesitaAgregarDcds) {
    agregarColumnaDcds(filaPlantilla);
  }
  llenarFila(filaPlantilla, items[0]);

  // Llenar columna Destrezas con iconos
  if (necesitaAgregarDcds && items[0].dcds) {
    const celdasActualizadas = buscarNodos([filaPlantilla], "w:tc");
    const ultimaCelda = celdasActualizadas[celdasActualizadas.length - 1];
    if (ultimaCelda) {
      agregarContenidoDcdACelda(ultimaCelda, items[0].dcds, ctx, 180000);
    }
  }

  // Paso 2: Para los items restantes (2+), clonar e insertar después de la fila plantilla
  const nuevasFilas: XmlNode[] = [];

  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    const nuevaFila = JSON.parse(JSON.stringify(filaPlantilla));

    if (necesitaAgregarDcds) {
      agregarColumnaDcds(nuevaFila);
    }

    llenarFila(nuevaFila, item);

    if (necesitaAgregarDcds && item.dcds) {
      const celdasActualizadas = buscarNodos([nuevaFila], "w:tc");
      const ultimaCelda = celdasActualizadas[celdasActualizadas.length - 1];
      if (ultimaCelda) {
        agregarContenidoDcdACelda(ultimaCelda, item.dcds, ctx, 180000);
      }
    }

    nuevasFilas.push(nuevaFila);
  }

  // Agregar encabezado "Destrezas" si hace falta
  if (necesitaAgregarDcds) {
    const filaEncabezados = filas[region.ubicacion.filaPlantilla - 1];
    if (filaEncabezados) {
      const celdasEncabezado = buscarNodos([filaEncabezados], "w:tc");
      if (celdasEncabezado.length > 0) {
        const ultimaCeldaEnc = celdasEncabezado[celdasEncabezado.length - 1];
        const nuevaCeldaEnc = JSON.parse(JSON.stringify(ultimaCeldaEnc));
        const textos = buscarNodos([nuevaCeldaEnc], "w:t");
        let primero = true;
        for (const nodo of textos) {
          const nodoKey = Object.keys(nodo).find((k) => k !== ":@");
          if (nodoKey === "w:t") {
            if (primero) {
              if (Array.isArray(nodo["w:t"])) {
                nodo["w:t"][0]["#text"] = "Destrezas";
              } else {
                nodo["#text"] = "Destrezas";
              }
              primero = false;
            } else {
              if (Array.isArray(nodo["w:t"])) {
                nodo["w:t"][0]["#text"] = "";
              } else {
                nodo["#text"] = "";
              }
            }
          }
        }
        const filaEncKey = Object.keys(filaEncabezados).find((k) => k !== ":@");
        if (filaEncKey && Array.isArray(filaEncabezados[filaEncKey])) {
          filaEncabezados[filaEncKey].push(nuevaCeldaEnc);
        }
      }
    }
  }

  // Recalcular anchos si se agregó columna
  if (necesitaAgregarDcds) {
    recalcularAnchosTabla(tabla, filas, numColumnasOriginal);
  }

  // Insertar las nuevas filas DESPUÉS de la fila plantilla
  const contenidoTabla = tabla[Object.keys(tabla).find((k) => k !== ":@")!];
  if (Array.isArray(contenidoTabla)) {
    let indiceFilaPlantilla = -1;
    for (let i = 0; i < contenidoTabla.length; i++) {
      if (contenidoTabla[i] === filaPlantilla) {
        indiceFilaPlantilla = i;
        break;
      }
    }
    if (indiceFilaPlantilla >= 0) {
      contenidoTabla.splice(indiceFilaPlantilla + 1, 0, ...nuevasFilas);
    }
  }
}

// ─── Gestión de relaciones del DOCX ─────────────────────────────────────────

/**
 * Lee las relaciones existentes del DOCX y retorna el máximo rId numérico.
 */
async function leerMaxRelId(zip: JSZip): Promise<number> {
  const relsFile = zip.file("word/_rels/document.xml.rels");
  if (!relsFile) return 0;

  const relsXml = await relsFile.async("string");
  const relsArbol = parser.parse(relsXml);

  let maxId = 0;
  const buscarRelId = (nodos: XmlNode[]) => {
    for (const nodo of nodos) {
      const attrs = nodo[":@"];
      if (attrs) {
        const id = attrs["@_Id"] ?? attrs["@_id"];
        if (id) {
          const match = String(id).match(/rId(\d+)/);
          if (match) {
            maxId = Math.max(maxId, parseInt(match[1], 10));
          }
        }
      }
      const key = Object.keys(nodo).find((k) => k !== ":@");
      if (key && Array.isArray(nodo[key])) {
        buscarRelId(nodo[key]);
      }
    }
  };

  buscarRelId([relsArbol]);
  return maxId;
}

/**
 * Actualiza el archivo word/_rels/document.xml.rels con las nuevas relaciones.
 */
async function actualizarRels(
  zip: JSZip,
  imagesToAdd: Array<{ relId: string; targetPath: string }>
): Promise<void> {
  if (imagesToAdd.length === 0) return;

  const relsFile = zip.file("word/_rels/document.xml.rels");
  let relsXml = "";

  if (relsFile) {
    relsXml = await relsFile.async("string");
  } else {
    relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
  }

  // Agregar nuevas relaciones al XML
  const relacionesNuevas = imagesToAdd
    .map(
      (img) =>
        `<Relationship Id="${img.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${img.targetPath}"/>`
    )
    .join("\n    ");

  relsXml = relsXml.replace(
    "</Relationships>",
    `    ${relacionesNuevas}\n</Relationships>`
  );

  zip.file("word/_rels/document.xml.rels", relsXml);
}

/**
 * Actualiza [Content_Types].xml para incluir image/png si no existe.
 */
async function actualizarContentTypes(zip: JSZip): Promise<void> {
  const ctFile = zip.file("[Content_Types].xml");
  if (!ctFile) return;

  let ctXml = await ctFile.async("string");
  if (!ctXml.includes('Extension="png"')) {
    ctXml = ctXml.replace(
      "</Types>",
      `  <Default Extension="png" ContentType="image/png"/>\n</Types>`
    );
    zip.file("[Content_Types].xml", ctXml);
  }
}

// ─── Renderer principal ─────────────────────────────────────────────────────

export async function renderizarDocxPlantilla(
  templateBuffer: Buffer,
  bindings: PlantillaBindings,
  datos: Record<string, any>,
  archivosAdicionales?: Record<string, Buffer>
): Promise<Buffer> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(templateBuffer);
  } catch {
    throw new Error("No se pudo leer el archivo DOCX plantilla.");
  }

  const documentXml = zip.file("word/document.xml");
  if (!documentXml) {
    throw new Error("El DOCX plantilla no contiene word/document.xml.");
  }

  const xmlContent = await documentXml.async("string");
  const arbol = parser.parse(xmlContent);

  const tablas = buscarNodos(arbol, "w:tbl");

  // Contexto para manejar imágenes
  const maxRelId = await leerMaxRelId(zip);
  const ctx: RenderContext = {
    zip,
    nextRelId: maxRelId + 1,
    imagesToAdd: [],
  };

  // 1. Renderizar campos simples
  console.log("[renderer] Datos recibidos:", Object.keys(datos).filter(k => datos[k]));
  console.log("[renderer] Bindings de campos:", bindings.campos.map(b => ({
    campo: b.campo,
    tabla: (b.ubicacion as any).tabla,
    fila: (b.ubicacion as any).fila,
    columna: (b.ubicacion as any).columna,
    valor: datos[b.campo] ? String(datos[b.campo]).substring(0, 30) : "(vacío)",
  })));
  renderizarCampos(tablas, bindings.campos, datos);

  // 2. Renderizar regiones repetibles
  for (const region of bindings.regionesRepetibles) {
    const tabla = tablas[region.ubicacion.tabla];
    if (!tabla) continue;

    const items = datos[region.origenDatos];
    if (!Array.isArray(items)) continue;

    renderizarRegionRepetible(tabla, region, items, ctx);
  }

  // 3. Serializar el XML modificado
  const xmlModificado = builder.build(arbol);
  zip.file("word/document.xml", xmlModificado);

  // 4. Agregar imágenes de iconos al ZIP
  for (const img of ctx.imagesToAdd) {
    const buffer = dataUriToBuffer(img.base64Data);
    zip.file(img.targetPath, buffer);
  }

  // 5. Actualizar relaciones y content types
  await actualizarRels(zip, ctx.imagesToAdd);
  await actualizarContentTypes(zip);

  // 6. Agregar archivos adicionales si los hay
  if (archivosAdicionales) {
    for (const [nombre, contenido] of Object.entries(archivosAdicionales)) {
      zip.file(nombre, contenido);
    }
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
