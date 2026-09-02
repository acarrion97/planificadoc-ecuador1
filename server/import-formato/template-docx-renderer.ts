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

function extraerAtributo(nodo: XmlNode, attr: string): string | undefined {
  const attrs = nodo[":@"];
  if (!attrs) return undefined;
  return attrs[`@_w:${attr}`] ?? attrs[`@_${attr}`];
}

/**
 * Busca hijos directos (no recursivos) de un nodo con el tag dado.
 * Usa esto en lugar de buscarNodos para w:tr dentro de w:tbl y w:tc dentro de w:tr
 * para evitar incluir filas/celdas de tablas anidadas.
 */
function hijosDirectos(nodo: XmlNode, tag: string): XmlNode[] {
  const key = Object.keys(nodo).find((k) => k !== ":@");
  if (!key) return [];
  const contenido = nodo[key];
  if (!Array.isArray(contenido)) return [];
  return contenido.filter((hijo: XmlNode) => {
    const hijoKey = Object.keys(hijo).find((k) => k !== ":@");
    return hijoKey === tag;
  });
}

/**
 * Obtiene las celdas de una fila, ignorando celdas de continuación de vMerge.
 * Esto确保 que los índices físicos coincidan con los almacenados en los bindings
 * por template-builder.ts (que también omite celdas vMerge continuation).
 */
function celdasSinVMerge(fila: XmlNode): XmlNode[] {
  return hijosDirectos(fila, "w:tc").filter((celda) => {
    const vMergeVal = extraerAtributo(celda, "vMerge");
    // Incluir si no tiene vMerge, si es "restart", o si es "0"
    if (vMergeVal === undefined) return true;
    if (vMergeVal === "restart") return true;
    if (vMergeVal === "0") return true;
    // vMerge continuation: excluir
    return false;
  });
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

  tcW[":@"] = { "@_w:w": String(ancho), "@_w:type": "dxa" };
}

function recalcularAnchosTabla(
  tabla: XmlNode,
  filas: XmlNode[],
  numColumnasOriginal: number
): void {
  const ANCHO_PAGINA_DXA = 9026;

  const primeraFila = filas[0];
  if (!primeraFila) return;

  const celdasPrimeraFila = buscarNodos([primeraFila], "w:tc");
  const anchosOriginales: number[] = [];
  for (let i = 0; i < Math.min(numColumnasOriginal, celdasPrimeraFila.length); i++) {
    anchosOriginales.push(leerAnchoCelda(celdasPrimeraFila[i]));
  }

  const totalOriginal = anchosOriginales.reduce((a, b) => a + b, 0);
  if (totalOriginal <= 0) return;

  const anchoPromedio = totalOriginal / anchosOriginales.length;
  const nuevoTotal = totalOriginal + anchoPromedio;

  let factor = 1;
  if (nuevoTotal > ANCHO_PAGINA_DXA) {
    factor = ANCHO_PAGINA_DXA / nuevoTotal;
  }

  const todasLasFilas = hijosDirectos(tabla, "w:tr");
  for (const fila of todasLasFilas) {
    const celdas = hijosDirectos(fila, "w:tc");
    for (let i = 0; i < celdas.length; i++) {
      if (i < anchosOriginales.length) {
        setAnchoCelda(celdas[i], Math.round(anchosOriginales[i] * factor));
      } else {
        setAnchoCelda(celdas[i], Math.round(anchoPromedio * factor));
      }
    }
  }
}

// ─── DCD Icons: imagen inline en DOCX ───────────────────────────────────────

const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const NS_WP = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
const NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main";
const NS_PIC = "http://schemas.openxmlformats.org/drawingml/2006/picture";

/**
 * Extrae bytes raw de un data URI base64.
 */
function dataUriToBuffer(dataUri: string): Buffer {
  const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

/**
 * Asegura que el elemento raíz del XML tenga los namespaces necesarios
 * para DrawingML (wp, a, pic, r).
 */
function asegurarNamespaces(arbol: XmlNode[]): void {
  const doc = arbol.find((n) => {
    const k = Object.keys(n).find((kk) => kk !== ":@");
    return k === "w:document";
  });
  if (!doc) return;

  const attrs = doc[":@"] || {};
  const requiredNs: [string, string][] = [
    ["@_xmlns:wp", NS_WP],
    ["@_xmlns:a", NS_A],
    ["@_xmlns:pic", NS_PIC],
    ["@_xmlns:r", NS_R],
  ];
  for (const [key, val] of requiredNs) {
    if (!attrs[key]) {
      attrs[key] = val;
    }
  }
  doc[":@"] = attrs;
}

/**
 * Genera el nodo XML <w:r> que contiene <w:drawing><wp:inline> con la imagen.
 * Estructura verificada contra la salida del library docx (ImageRun).
 */
function crearRunConImagen(
  relId: string,
  fileName: string,
  sizeEmu: number,
  imageId: number
): XmlNode {
  const sz = String(sizeEmu);
  const rid = `rId${relId}`;
  return {
    "w:r": [
      {
        "w:drawing": [
          {
            "wp:inline": [
              { ":@": { "@_distT": "0", "@_distB": "0", "@_distL": "0", "@_distR": "0" } },
              { "wp:extent": [], ":@": { "@_cx": sz, "@_cy": sz } },
              { "wp:effectExtent": [], ":@": { "@_t": "0", "@_r": "0", "@_b": "0", "@_l": "0" } },
              { "wp:docPr": [], ":@": { "@_id": String(imageId), "@_name": "", "@_descr": "", "@_title": "" } },
              {
                "wp:cNvGraphicFramePr": [
                  {
                    "a:graphicFrameLocks": [],
                    ":@": { "@_xmlns:a": NS_A, "@_noChangeAspect": "1" },
                  },
                ],
              },
              {
                "a:graphic": [
                  {
                    "a:graphicData": [
                      {
                        "pic:pic": [
                          {
                            ":@": { "@_xmlns:pic": NS_PIC },
                            "pic:nvPicPr": [
                              {
                                "pic:cNvPr": [],
                                ":@": { "@_id": "0", "@_name": "", "@_descr": "" },
                              },
                              {
                                "pic:cNvPicPr": [
                                  {
                                    "a:picLocks": [],
                                    ":@": { "@_noChangeAspect": "1", "@_noChangeArrowheads": "1" },
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            "pic:blipFill": [
                              {
                                "a:blip": [],
                                ":@": { "@_r:embed": rid, "@_cstate": "none" },
                              },
                              { "a:srcRect": [] },
                              {
                                "a:stretch": [
                                  { "a:fillRect": [] },
                                ],
                              },
                            ],
                          },
                          {
                            "pic:spPr": [
                              {
                                "a:xfrm": [
                                  { "a:off": [], ":@": { "@_x": "0", "@_y": "0" } },
                                  { "a:ext": [], ":@": { "@_cx": sz, "@_cy": sz } },
                                ],
                              },
                              {
                                "a:prstGeom": [
                                  { "a:avLst": [] },
                                ],
                                ":@": { "@_prst": "rect" },
                              },
                            ],
                            ":@": { "@_bwMode": "auto" },
                          },
                        ],
                      },
                    ],
                    ":@": { "@_uri": NS_PIC },
                  },
                ],
                ":@": { "@_xmlns:a": NS_A },
              },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Agrega contenido DCD (texto + iconos imagen) a una celda.
 */
function agregarContenidoDcdACelda(
  celda: XmlNode,
  dcds: any,
  imagenes: Array<{ relId: string; fileName: string; buffer: Buffer }>,
  baseRelId: number
): void {
  let lineas: Array<{ texto: string; codigo?: string }> = [];
  if (typeof dcds === "string") {
    lineas = dcds
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const match = l.match(/^([^:]+):\s*(.+)$/);
        return match ? { texto: l, codigo: match[1].trim() } : { texto: l };
      });
  } else if (Array.isArray(dcds)) {
    lineas = dcds.map((d: any) => {
      if (typeof d === "string") {
        const match = d.match(/^([^:]+):\s*(.+)$/);
        return match ? { texto: d, codigo: match[1].trim() } : { texto: d };
      }
      return {
        texto: d.codigo && d.enunciado ? `${d.codigo}: ${d.enunciado}` : d.enunciado || d.codigo || String(d),
        codigo: d.codigo,
      };
    });
  } else if (dcds && typeof dcds === "object") {
    const d = dcds as any;
    lineas = [{
      texto: d.codigo && d.enunciado ? `${d.codigo}: ${d.enunciado}` : d.enunciado || d.codigo || String(d),
      codigo: d.codigo,
    }];
  }

  if (lineas.length === 0) return;

  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  const paragraphChildren: XmlNode[] = [];
  let imageId = 100;

  for (let idx = 0; idx < lineas.length; idx++) {
    const linea = lineas[idx];

    paragraphChildren.push({
      "w:r": [{ "w:t": [{ "#text": linea.texto }] }],
    });

    if (linea.codigo) {
      try {
        const iconNames = obtenerIconosDestreza(linea.codigo);
        for (const iconName of iconNames) {
          const dataUri = ICONOS_DCD_BASE64[iconName];
          if (!dataUri) continue;

          const relId = String(baseRelId + imagenes.length + 1);
          const fileName = `${iconName}.png`;
          const buffer = dataUriToBuffer(dataUri);

          imagenes.push({ relId, fileName, buffer });

          const sizeEmu = 15 * 12700;
          const imageRun = crearRunConImagen(relId, fileName, sizeEmu, imageId++);

          paragraphChildren.push({
            "w:r": [{ "w:t": [{ "#text": " " }] }],
          });
          paragraphChildren.push(imageRun);
        }
      } catch (e) {
        console.error(`Error agregando íconos para ${linea.codigo}:`, e);
      }
    }

    if (idx < lineas.length - 1) {
      paragraphChildren.push({
        "w:r": [{ "w:br": [] }],
      });
    }
  }

  const contenido = celda[key];
  if (Array.isArray(contenido)) {
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

    const filas = hijosDirectos(tabla, "w:tr");
    const fila = filas[loc.fila];
    if (!fila) continue;

    const celdas = celdasSinVMerge(fila);
    const celda = celdas[loc.columna];
    if (!celda) continue;

    const textoValor = valorParaDocx(valor);
    if (!textoValor) continue;

    if (binding.transformacion === "append-after-label") {
      const cellKey = Object.keys(celda).find((k) => k !== ":@");
      if (cellKey && cellKey === "w:tc") {
        const contenido = celda[cellKey];
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
  imagenes: Array<{ relId: string; fileName: string; buffer: Buffer }>,
  baseRelId: number
): void {
  if (!items || items.length === 0) return;

  const filas = hijosDirectos(tabla, "w:tr");
  const filaPlantilla = filas[region.ubicacion.filaPlantilla];
  if (!filaPlantilla) return;

  const tieneColumnaDcds = region.columnas.some((c) => c.campo === "dcds");
  const itemsTienenDcds = items.some((item) => item.dcds && String(item.dcds).trim() !== "");
  const necesitaAgregarDcds = itemsTienenDcds && !tieneColumnaDcds;

  const celdasPlantilla = celdasSinVMerge(filaPlantilla);
  const numColumnasOriginal = celdasPlantilla.length;

  function llenarFila(fila: XmlNode, item: any): void {
    const celdas = celdasSinVMerge(fila);
    for (const col of region.columnas) {
      const valor = item[col.campo];
      if (valor === undefined || valor === null) continue;
      const celda = celdas[col.celdaFisica];
      if (!celda) continue;
      if (col.campo === "dcds") {
        agregarContenidoDcdACelda(celda, valor, imagenes, baseRelId);
      } else {
        reemplazarTextoEnCelda(celda, valorParaDocx(valor));
      }
    }
  }

  function agregarColumnaDcds(fila: XmlNode): void {
    const celdas = hijosDirectos(fila, "w:tc");
    if (celdas.length === 0) return;
    const ultimaCelda = celdas[celdas.length - 1];
    const nuevaCelda = JSON.parse(JSON.stringify(ultimaCelda));
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

  if (necesitaAgregarDcds) {
    agregarColumnaDcds(filaPlantilla);
  }
  llenarFila(filaPlantilla, items[0]);

  const nuevasFilas: XmlNode[] = [];

  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    const nuevaFila = JSON.parse(JSON.stringify(filaPlantilla));

    if (necesitaAgregarDcds) {
      agregarColumnaDcds(nuevaFila);
    }

    llenarFila(nuevaFila, item);

    nuevasFilas.push(nuevaFila);
  }

  if (necesitaAgregarDcds) {
    const filaEncabezados = filas[region.ubicacion.filaPlantilla - 1];
    if (filaEncabezados) {
      const celdasEncabezado = hijosDirectos(filaEncabezados, "w:tc");
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

  if (necesitaAgregarDcds) {
    recalcularAnchosTabla(tabla, filas, numColumnasOriginal);
  }

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

// ─── Gestión de imágenes en el ZIP ──────────────────────────────────────────

async function leerMaxRelId(zip: JSZip): Promise<number> {
  const relsFile = zip.file("word/_rels/document.xml.rels");
  if (!relsFile) return 0;

  const relsXml = await relsFile.async("string");
  let maxId = 0;
  const regex = /Id="rId(\d+)"/g;
  let match;
  while ((match = regex.exec(relsXml)) !== null) {
    maxId = Math.max(maxId, parseInt(match[1], 10));
  }
  return maxId;
}

async function agregarAlRels(
  zip: JSZip,
  entries: Array<{ relId: string; type: string; target: string }>
): Promise<void> {
  if (entries.length === 0) return;

  const relsFile = zip.file("word/_rels/document.xml.rels");
  let relsXml = "";

  if (relsFile) {
    relsXml = await relsFile.async("string");
  } else {
    relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
  }

  const newRels = entries
    .map(
      (e) =>
        `<Relationship Id="rId${e.relId}" Type="${e.type}" Target="${e.target}"/>`
    )
    .join("\n    ");

  relsXml = relsXml.replace("</Relationships>", `    ${newRels}\n</Relationships>`);
  zip.file("word/_rels/document.xml.rels", relsXml);
}

async function agregarPngContentType(zip: JSZip): Promise<void> {
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

/**
 * Reemplaza placeholders de texto en un árbol XML (para footers, headers, etc.)
 * Busca patrones como {{campo}} o {campo} y los reemplaza con datos del contexto.
 */
function reemplazarPlaceholdersEnXml(nodo: XmlNode, datos: Record<string, any>): void {
  if (!nodo || typeof nodo !== "object") return;

  const key = Object.keys(nodo).find((k) => k !== ":@");
  if (!key) return;

  // Si es un nodo de texto w:t, reemplazar placeholders
  if (key === "w:t") {
    const texto = Array.isArray(nodo["w:t"])
      ? nodo["w:t"][0]?.["#text"]
      : nodo["#text"];
    if (typeof texto === "string" && texto.includes("{")) {
      let nuevoTexto = texto;
      for (const [campo, valor] of Object.entries(datos)) {
        if (valor == null) continue;
        const strValor = String(valor);
        // Reemplazar {campo} y {{campo}}
        const regex = new RegExp(`\\{\\{?${campo}\\}?\\}`, "gi");
        nuevoTexto = nuevoTexto.replace(regex, strValor);
      }
      if (Array.isArray(nodo["w:t"])) {
        nodo["w:t"][0]["#text"] = nuevoTexto;
      } else {
        nodo["#text"] = nuevoTexto;
      }
    }
    return;
  }

  // Recorrer hijos
  const contenido = nodo[key];
  if (Array.isArray(contenido)) {
    for (const hijo of contenido) {
      if (hijo && typeof hijo === "object") {
        reemplazarPlaceholdersEnXml(hijo, datos);
      }
    }
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

  console.log("[renderer] Bindings de campos:", bindings.campos.map((b) => ({
    campo: b.campo,
    tabla: (b.ubicacion as any).tabla,
    fila: (b.ubicacion as any).fila,
    columna: (b.ubicacion as any).columna,
    valor: datos[b.campo] ? String(datos[b.campo]).substring(0, 30) : "(vacío)",
  })));

  renderizarCampos(tablas, bindings.campos, datos);

  const imagenes: Array<{ relId: string; fileName: string; buffer: Buffer }> = [];

  // Calcular maxRelId ANTES del render para que los rId en DrawingML coincidan con los del ZIP
  const maxRelId = await leerMaxRelId(zip);

  for (const region of bindings.regionesRepetibles) {
    const tabla = tablas[region.ubicacion.tabla];
    if (!tabla) continue;

    const items = datos[region.origenDatos];
    if (!Array.isArray(items)) continue;

    renderizarRegionRepetible(tabla, region, items, imagenes, maxRelId);
  }

  // Asegurar namespaces DrawingML en el root
  if (imagenes.length > 0) {
    asegurarNamespaces(arbol);
  }

  const xmlModificado = builder.build(arbol);
  zip.file("word/document.xml", xmlModificado);

  // ── Procesar footers (word/footer*.xml) ────────────────────────────────────
  const footerFiles = Object.keys(zip.files).filter(
    (name) => /^word\/footer\d+\.xml$/.test(name) && !zip.files[name]?.dir
  );
  for (const footerPath of footerFiles) {
    const footerFile = zip.file(footerPath);
    if (!footerFile) continue;
    const footerXml = await footerFile.async("string");
    const footerArbol = parser.parse(footerXml);
    reemplazarPlaceholdersEnXml(footerArbol, datos);
    const footerModificado = builder.build(footerArbol);
    zip.file(footerPath, footerModificado);
  }

  // ── Procesar headers (word/header*.xml) ────────────────────────────────────
  const headerFiles = Object.keys(zip.files).filter(
    (name) => /^word\/header\d+\.xml$/.test(name) && !zip.files[name]?.dir
  );
  for (const headerPath of headerFiles) {
    const headerFile = zip.file(headerPath);
    if (!headerFile) continue;
    const headerXml = await headerFile.async("string");
    const headerArbol = parser.parse(headerXml);
    reemplazarPlaceholdersEnXml(headerArbol, datos);
    const headerModificado = builder.build(headerArbol);
    zip.file(headerPath, headerModificado);
  }

  // Agregar imágenes al ZIP y actualizar rels + content types
  if (imagenes.length > 0) {
    const IMAGE_REL_TYPE =
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    const relEntries: Array<{ relId: string; type: string; target: string }> = [];

    for (const img of imagenes) {
      zip.file(`word/media/${img.fileName}`, img.buffer);

      relEntries.push({
        relId: img.relId,
        type: IMAGE_REL_TYPE,
        target: `media/${img.fileName}`,
      });
    }

    await agregarAlRels(zip, relEntries);
    await agregarPngContentType(zip);
  }

  if (archivosAdicionales) {
    for (const [nombre, contenido] of Object.entries(archivosAdicionales)) {
      zip.file(nombre, contenido);
    }
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
