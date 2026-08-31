import JSZip from "jszip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import {
  PlantillaBindings,
  FieldBinding,
  RepeatRegion,
  DocxCellLocation,
} from "./types";
import { obtenerIconosDestreza } from "../../src/data/iconosPorDestreza";

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

// ─── Mapa de iconos DCD a texto Unicode ─────────────────────────────────────

const ICONO_TEXTO: Record<string, string> = {
  competencias_comunicacionales: "\u270D",
  competencias_matematicas: "\u2211",
  competencias_digitales: "\u2328",
  competencias_socioemocionales: "\u2764",
  insercion_civica_etica_integridad: "\u2696",
  insercion_desarrollo_sostenible: "\u2618",
  insercion_educacion_financiera: "\u20A1",
  insercion_educacion_socioemocional: "\u263A",
  insercion_educacion_vial: "\u26A0",
  insercion_seguridad_integral: "\u26E8",
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

  const todasLasFilas = buscarNodos([tabla], "w:tr");
  for (const fila of todasLasFilas) {
    const celdas = buscarNodos([fila], "w:tc");
    for (let i = 0; i < celdas.length; i++) {
      if (i < anchosOriginales.length) {
        setAnchoCelda(celdas[i], Math.round(anchosOriginales[i] * factor));
      } else {
        setAnchoCelda(celdas[i], Math.round(anchoPromedio * factor));
      }
    }
  }
}

// ─── DCD icons (texto con símbolos Unicode) ────────────────────────────────

function agregarContenidoDcdACelda(celda: XmlNode, dcds: any): void {
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
        return match ? { texto: d, codigo: match[1].trim() } : { texto: d };
      }
      return {
        texto: d.codigo && d.enunciado ? `${d.codigo}: ${d.enunciado}` : d.enunciado || d.codigo || String(d),
        codigo: d.codigo,
      };
    });
  }

  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  const paragraphChildren: XmlNode[] = [];

  for (let idx = 0; idx < lineas.length; idx++) {
    const linea = lineas[idx];

    // Agregar iconos Unicode antes del texto
    if (linea.codigo) {
      const iconNames = obtenerIconosDestreza(linea.codigo);
      for (const iconName of iconNames) {
        const icono = ICONO_TEXTO[iconName];
        if (icono) {
          paragraphChildren.push({
            "w:r": [
              { "w:rPr": [{ "w:sz": [{ ":@": { "@_w:val": "14" } }] }] },
              { "w:t": [{ "#text": `${icono} ` }] },
            ],
          });
        }
      }
    }

    // Texto de la línea
    paragraphChildren.push({
      "w:r": [{ "w:t": [{ "#text": linea.texto }] }],
    });

    // Salto de línea entre DCDs
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

    const filas = buscarNodos([tabla], "w:tr");
    const fila = filas[loc.fila];
    if (!fila) continue;

    const celdas = buscarNodos([fila], "w:tc");
    const celda = celdas[loc.columna];
    if (!celda) continue;

    const textoValor = valorParaDocx(valor);
    if (!textoValor) continue;

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
  items: any[]
): void {
  if (!items || items.length === 0) return;

  const filas = buscarNodos([tabla], "w:tr");
  const filaPlantilla = filas[region.ubicacion.filaPlantilla];
  if (!filaPlantilla) return;

  const tieneColumnaDcds = region.columnas.some((c) => c.campo === "dcds");
  const itemsTienenDcds = items.some((item) => item.dcds && String(item.dcds).trim() !== "");
  const necesitaAgregarDcds = itemsTienenDcds && !tieneColumnaDcds;

  const celdasPlantilla = buscarNodos([filaPlantilla], "w:tc");
  const numColumnasOriginal = celdasPlantilla.length;

  function llenarFila(fila: XmlNode, item: any): void {
    const celdas = buscarNodos([fila], "w:tc");
    for (const col of region.columnas) {
      if (col.campo === "dcds") continue;
      const valor = item[col.campo];
      if (valor === undefined || valor === null) continue;
      const celda = celdas[col.celdaFisica];
      if (!celda) continue;
      reemplazarTextoEnCelda(celda, valorParaDocx(valor));
    }
  }

  function agregarColumnaDcds(fila: XmlNode): void {
    const celdas = buscarNodos([fila], "w:tc");
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

  if (necesitaAgregarDcds && items[0].dcds) {
    const celdasActualizadas = buscarNodos([filaPlantilla], "w:tc");
    const ultimaCelda = celdasActualizadas[celdasActualizadas.length - 1];
    if (ultimaCelda) {
      agregarContenidoDcdACelda(ultimaCelda, items[0].dcds);
    }
  }

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
        agregarContenidoDcdACelda(ultimaCelda, item.dcds);
      }
    }

    nuevasFilas.push(nuevaFila);
  }

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

  console.log("[renderer] Bindings de campos:", bindings.campos.map(b => ({
    campo: b.campo,
    tabla: (b.ubicacion as any).tabla,
    fila: (b.ubicacion as any).fila,
    columna: (b.ubicacion as any).columna,
    valor: datos[b.campo] ? String(datos[b.campo]).substring(0, 30) : "(vacío)",
  })));

  renderizarCampos(tablas, bindings.campos, datos);

  for (const region of bindings.regionesRepetibles) {
    const tabla = tablas[region.ubicacion.tabla];
    if (!tabla) continue;

    const items = datos[region.origenDatos];
    if (!Array.isArray(items)) continue;

    renderizarRegionRepetible(tabla, region, items);
  }

  const xmlModificado = builder.build(arbol);
  zip.file("word/document.xml", xmlModificado);

  if (archivosAdicionales) {
    for (const [nombre, contenido] of Object.entries(archivosAdicionales)) {
      zip.file(nombre, contenido);
    }
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
