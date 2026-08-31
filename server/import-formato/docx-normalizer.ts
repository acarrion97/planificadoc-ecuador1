import JSZip from "jszip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

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

// ─── XML helpers ────────────────────────────────────────────────────────────

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

function extraerAtributo(nodo: XmlNode, attr: string): string | undefined {
  const attrs = nodo[":@"];
  if (!attrs) return undefined;
  return attrs[`@_w:${attr}`] ?? attrs[`@_${attr}`];
}

function nodoKey(nodo: XmlNode): string | undefined {
  return Object.keys(nodo).find((k) => k !== ":@");
}

function nodoChildren(nodo: XmlNode): XmlNode[] | undefined {
  const key = nodoKey(nodo);
  if (!key) return undefined;
  const val = nodo[key];
  return Array.isArray(val) ? val : undefined;
}

// ─── Table identification ───────────────────────────────────────────────────

const PALABRAS_UNIDADES = [
  /N[.°]/,
  /T[ÍI]TULO/,
  /OBJETIVOS.*ESP/,
  /CONTENIDOS/,
  /ORIENTACIONES/,
  /METODOLOG/,
  /EVALUACI/,
  /DURACI/,
  /SEMANAS/,
  /DESTREZAS?/,
  /DCD/,
];

const PALABRAS_FIRMAS = [
  /^ELABORADO(\s+POR)?$/i,
  /^REVISADO(\s+POR)?$/i,
  /^APROBADO(\s+POR)?$/i,
  /^DOCENTE\s*:/i,
  /^VICERRECTOR\s*:/i,
  /^DIRECTOR\s*:/i,
];

const PALABRAS_SECCION = [
  /OBJETIVOS/,
  /BIBLIOGRAF/,
  /INSERCIONES/,
  /EJES\s*TRANSVERSALES/,
  /OBSERVACIONES/,
  /DESARROLLO/,
  /DATOS\s*INFORMATIVOS/,
  /TIEMPO/,
  /PLAN\s*CURRICULAR/,
  /INSTITUCI/,
];

type TablaClasificacion = {
  tipo: "unidades" | "firmas" | "desconocida";
  indice: number;
};

function clasificarTabla(tabla: XmlNode): TablaClasificacion["tipo"] {
  const filas = buscarNodos([tabla], "w:tr");
  let scoreUnidades = 0;
  let scoreFirmas = 0;

  for (const fila of filas) {
    const celdas = buscarNodos([fila], "w:tc");
    for (const celda of celdas) {
      const key = nodoKey(celda);
      if (!key) continue;
      const texto = textoDeNodo(celda[key] ?? []).trim().toUpperCase();

      if (PALABRAS_UNIDADES.some((p) => p.test(texto))) scoreUnidades++;
      if (PALABRAS_FIRMAS.some((p) => p.test(texto))) scoreFirmas++;
    }
  }

  if (scoreUnidades >= 2) return "unidades";
  if (scoreFirmas >= 1) return "firmas";
  return "desconocida";
}

function clasificarTablas(arbol: XmlNode[]): {
  tablaPrincipal: number | null;
  tablaFirmas: number | null;
  tablasExtra: number[];
} {
  const tablasXml = buscarNodos(arbol, "w:tbl");
  let tablaPrincipal: number | null = null;
  let tablaFirmas: number | null = null;
  const tablasExtra: number[] = [];

  for (let i = 0; i < tablasXml.length; i++) {
    const tipo = clasificarTabla(tablasXml[i]);
    switch (tipo) {
      case "unidades":
        if (tablaPrincipal === null) tablaPrincipal = i;
        else tablasExtra.push(i);
        break;
      case "firmas":
        if (tablaFirmas === null) tablaFirmas = i;
        else tablasExtra.push(i);
        break;
      default:
        tablasExtra.push(i);
        break;
    }
  }

  return { tablaPrincipal, tablaFirmas, tablasExtra };
}

// ─── Cleaning functions ─────────────────────────────────────────────────────

function esParrafoSeccion(texto: string): boolean {
  const upper = texto.trim().toUpperCase();
  return upper.length > 0 && PALABRAS_SECCION.some((p) => p.test(upper));
}

function limpiarParrafosFueraDeTablas(body: XmlNode[]): XmlNode[] {
  const tablaNodes = new Set(buscarNodos(body, "w:tbl"));

  const hijos = body.filter((nodo) => {
    const key = nodoKey(nodo);
    if (!key) return true;

    if (key === "w:tbl") return true;

    if (key === "w:p") {
      const children = nodoChildren(nodo) ?? [];
      const texto = textoDeNodo(children).trim();

      if (texto.length === 0) return false;

      if (esParrafoSeccion(texto)) return true;

      return false;
    }

    return true;
  });

  return hijos;
}

function esFilaVacia(fila: XmlNode): boolean {
  const key = nodoKey(fila);
  if (!key || key !== "w:tr") return false;

  const celdas = buscarNodos([fila], "w:tc");
  if (celdas.length === 0) return true;

  for (const celda of celdas) {
    const cKey = nodoKey(celda);
    if (!cKey) continue;
    const children = nodoChildren(celda) ?? [];
    const texto = textoDeNodo(children).trim();
    if (texto.length > 0) return false;
  }

  return true;
}

function limpiarFilasVacias(tabla: XmlNode): void {
  const key = nodoKey(tabla);
  if (!key || key !== "w:tbl") return;

  const children = nodoChildren(tabla);
  if (!children) return;

  const nuevasHijos = children.filter((nodo) => {
    const nKey = nodoKey(nodo);
    if (nKey === "w:tr") {
      return !esFilaVacia(nodo);
    }
    return true;
  });

  tabla[key] = nuevasHijos;
}

function tieneAlturaFila(fila: XmlNode): boolean {
  const key = nodoKey(fila);
  if (!key) return false;

  const children = nodoChildren(fila) ?? [];
  for (const hijo of children) {
    const hKey = nodoKey(hijo);
    if (hKey === "w:trPr") {
      const trPrChildren = nodoChildren(hijo) ?? [];
      for (const prop of trPrChildren) {
        const pKey = nodoKey(prop);
        if (pKey === "w:trHeight") return true;
      }
    }
  }
  return false;
}

function normalizarAlturaFilas(
  tabla: XmlNode,
  alturaMinima: number = 1500
): void {
  const filas = buscarNodos([tabla], "w:tr");

  for (const fila of filas) {
    if (tieneAlturaFila(fila)) continue;

    const key = nodoKey(fila);
    if (!key) continue;

    const children = nodoChildren(fila) ?? [];

    let trPr = children.find((h) => nodoKey(h) === "w:trPr");

    if (!trPr) {
      trPr = { "w:trPr": [] };
      children.unshift(trPr);
    }

    const trPrChildren = nodoChildren(trPr) ?? [];
    const yaTieneAltura = trPrChildren.some(
      (p) => nodoKey(p) === "w:trHeight"
    );

    if (!yaTieneAltura) {
      trPrChildren.push({
        "w:trHeight": [],
        ":@": {
          "@_w:val": String(alturaMinima),
          "@_w:hRule": "atLeast",
        },
      });
      trPr["w:trPr"] = trPrChildren;
    }
  }
}

function eliminarFilasAntesDeEncabezadoUnidades(
  tabla: XmlNode,
  indiceTabla: number,
  indicesPrincipales: { tablaPrincipal: number | null }
): void {
  if (indicesPrincipales.tablaPrincipal !== indiceTabla) return;

  const filas = buscarNodos([tabla], "w:tr");

  let indiceEncabezados = -1;
  for (let i = 0; i < filas.length; i++) {
    const celdas = buscarNodos([filas[i]], "w:tc");
    const textos = celdas.map((c) => {
      const key = nodoKey(c);
      return key ? textoDeNodo(c[key] ?? []).trim().toUpperCase() : "";
    });

    const coincidencias = [
      textos.some((t) => /N[.°]/.test(t)),
      textos.some((t) => /T[ÍI]TULO/.test(t)),
      textos.some((t) => /OBJETIVOS.*ESP/.test(t)),
      textos.some((t) => /ORIENTACIONES/.test(t)),
      textos.some((t) => /EVALUACI/.test(t)),
    ].filter(Boolean).length;

    if (coincidencias >= 2) {
      indiceEncabezados = i;
      break;
    }
  }

  if (indiceEncabezados <= 0) return;

  const key = nodoKey(tabla);
  if (!key) return;

  const children = nodoChildren(tabla) ?? [];
  const filasXml = children.filter((n) => nodoKey(n) === "w:tr");
  const noFilas = children.filter((n) => nodoKey(n) !== "w:tr");

  const filasAEliminar = indiceEncabezados;
  const filasRestantes = filasXml.slice(filasAEliminar);

  tabla[key] = [...noFilas, ...filasRestantes];
}

// ─── Main normalizer ────────────────────────────────────────────────────────

export async function normalizarDocxPca(buffer: Buffer): Promise<Buffer> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    return buffer;
  }

  const documentXml = zip.file("word/document.xml");
  if (!documentXml) return buffer;

  const xmlContent = await documentXml.async("string");
  const arbol = parser.parse(xmlContent);

  const body = buscarNodos(arbol, "w:body");
  if (body.length === 0) return buffer;

  const bodyNode = body[0];
  const bodyKey = nodoKey(bodyNode);
  if (!bodyKey) return buffer;

  const bodyChildren = nodoChildren(bodyNode);
  if (!bodyChildren) return buffer;

  const clasificacion = clasificarTablas(bodyChildren);

  console.log("[docx-normalizer] Clasificación de tablas:", clasificacion);

  const tablasXml = buscarNodos(bodyChildren, "w:tbl");
  const indicesExtraSet = new Set(clasificacion.tablasExtra);

  for (let i = 0; i < tablasXml.length; i++) {
    if (indicesExtraSet.has(i)) {
      const idx = bodyChildren.indexOf(tablasXml[i]);
      if (idx !== -1) bodyChildren.splice(idx, 1);
    }
  }

  const tablasRestantes = buscarNodos(bodyChildren, "w:tbl");
  for (const tabla of tablasRestantes) {
    limpiarFilasVacias(tabla);
    normalizarAlturaFilas(tabla);
  }

  if (clasificacion.tablaPrincipal !== null) {
    const tablaPrincipal = tablasRestantes.find((t) => {
      const tipo = clasificarTabla(t);
      return tipo === "unidades";
    });
    if (tablaPrincipal) {
      eliminarFilasAntesDeEncabezadoUnidades(
        tablaPrincipal,
        clasificacion.tablaPrincipal,
        { tablaPrincipal: clasificacion.tablaPrincipal }
      );
    }
  }

  const bodyLimpio = limpiarParrafosFueraDeTablas(bodyChildren);
  bodyNode[bodyKey] = bodyLimpio;

  const xmlLimpio = builder.build(arbol);
  zip.file("word/document.xml", xmlLimpio);

  return zip.generateAsync({ type: "nodebuffer" });
}
