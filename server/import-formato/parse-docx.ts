import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { ArchivoNoProcesableError, FilaTabla } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
});

type XmlNode = Record<string, any>;

/** Recorre un nodo w:p (párrafo) o w:tc (celda) preservando el orden y concatena sus w:t. */
function textoDeNodo(nodo: XmlNode[]): string {
  let out = "";
  for (const hijo of nodo) {
    const tag = Object.keys(hijo).find((k) => k !== ":@");
    if (!tag) continue;
    if (tag === "w:t") {
      const valor = hijo[tag];
      out += Array.isArray(valor) ? valor.map((v) => v["#text"] ?? "").join("") : (hijo["#text"] ?? "");
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

/**
 * Lee un `.docx` recorriendo `word/document.xml` directamente (tablas → filas
 * → celdas → texto) en vez de convertir a HTML intermedio, para preservar la
 * correspondencia celda→campo que necesita el reconocimiento de formato (ver
 * design.md, Decisión 1).
 */
export async function parseDocx(buffer: Buffer): Promise<{ textoPlano: string; tablas: FilaTabla[][] }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new ArchivoNoProcesableError();
  }

  const documentXml = zip.file("word/document.xml");
  if (!documentXml) {
    throw new ArchivoNoProcesableError();
  }

  let xmlContent: string;
  try {
    xmlContent = await documentXml.async("string");
  } catch {
    throw new ArchivoNoProcesableError();
  }

  let arbol: XmlNode[];
  try {
    arbol = parser.parse(xmlContent);
  } catch {
    throw new ArchivoNoProcesableError();
  }

  const tablasXml = buscarNodos(arbol, "w:tbl");
  const tablas: FilaTabla[][] = tablasXml.map((tabla) => {
    const filasXml = buscarNodos([tabla], "w:tr");
    return filasXml.map((fila): FilaTabla => {
      const celdasXml = buscarNodos([fila], "w:tc");
      return celdasXml.map((celda) => {
        const key = Object.keys(celda).find((k) => k !== ":@")!;
        return textoDeNodo(celda[key]).trim();
      });
    });
  });

  // Párrafos fuera de tablas (ej. título, observaciones sueltas) — se anexan
  // como texto libre para el matcher/heurísticas de secciones no tabulares.
  const parrafosXml = buscarNodos(arbol, "w:p");
  const textoPlano = parrafosXml
    .map((p) => {
      const key = Object.keys(p).find((k) => k !== ":@")!;
      return textoDeNodo(p[key]);
    })
    .filter((t) => t.trim().length > 0)
    .join("\n");

  return { textoPlano, tablas };
}
