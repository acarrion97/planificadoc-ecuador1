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

function nodoKey(nodo: XmlNode): string | undefined {
  return Object.keys(nodo).find((k) => k !== ":@");
}

function nodoChildren(nodo: XmlNode): XmlNode[] | undefined {
  const key = nodoKey(nodo);
  if (!key) return undefined;
  const val = nodo[key];
  return Array.isArray(val) ? val : undefined;
}

// ─── Garbage patterns ───────────────────────────────────────────────────────

const PATRONES_BASURA = [
  /^T[ÉE]RMINOS\s+DE\s+REFERENCIA/i,
  /^SUBSECRETAR[ÍI]A\s+DE/i,
  /^DIRECCI[ÓO]N\s+NACIONAL\s+DE\s+CURR[ÍI]CULO/i,
  /^MINISTERIO\s+DE\s+EDUCACI[ÓO]N/i,
  /^FICHA\s+T[ÉE]CNICA/i,
  /^MEMOR[ÁA]NDUM/i,
  /^CIRCULAR\s+N[ÚU]MERO/i,
  /^RESOLUCI[ÓO]N/i,
  /^ACTA\s+/i,
  /^ACUERDO\s+/i,
  /^CONTRATO\s+/i,
  /^PROCESO\s+DE\s+CONTRATACI[ÓO]N/i,
  /^INVITACI[ÓO]N\s+A\s+LA\s+OFERTA/i,
  /^BASES\s+DE\s+LA\s+CONTRATACI[ÓO]N/i,
  /^PRESUPUESTO\s+BASE/i,
  /^OBJETO\s+DEL\s+CONTRATO/i,
  /^PLAZO\s+DE\s+EJECUCI[ÓO]N/i,
  /^FORMA\s+DE\s+PAGO/i,
  /^COMPROMISO(\s+DEL|\s+DE|\s+PARA|\s*:)/i,
  /^ATRIBUCIONES/i,
  /^PLAN\s+DE\s+ACCI[ÓO]N/i,
  /^FUENTES\s+DE\s+FINANCIAMIENTO/i,
  /^CRONOGRAMA\s+DE\s+ACTIVIDADES/i,
  /^SISTEMA\s+DE\s+SEGUIMIENTO/i,
  /^SISTEMA\s+DE\s+CONTROL/i,
  /^R[ÉE]GIMEN\s+DE\s+PENALIDADES/i,
  /^OBLIGACIONES\s+DEL\s+PROVEEDOR/i,
  /^CONSIDERACIONES\s+GENERALES/i,
  /^DISPOSICIONES\s+GENERALES/i,
  /^ANEXOS?(\s*:|\s+\d)/i,
  /^FORMATOS?(\s*:|\s+\d)/i,
];

function esBasura(texto: string): boolean {
  const limpio = texto.trim();
  if (limpio.length === 0) return false;
  return PATRONES_BASURA.some((p) => p.test(limpio));
}

// ─── Main normalizer ────────────────────────────────────────────────────────

/**
 * Normaliza un DOCX de PCA eliminando exclusivamente párrafos
 * administrativos basura que aparecen fuera de las tablas.
 *
 * NO elimina tablas, NO elimina filas vacías, NO modifica alturas,
 * NO toca merges, bordes ni formato. Conserva todo intacto para que
 * template-builder pueda detectar la estructura correctamente.
 */
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

  const tablaNodes = new Set(buscarNodos(bodyChildren, "w:tbl"));

  let removidos = 0;
  const hijosFiltrados = bodyChildren.filter((nodo) => {
    const key = nodoKey(nodo);
    if (!key) return true;

    if (key === "w:tbl") return true;

    if (key === "w:p") {
      const children = nodoChildren(nodo) ?? [];
      const texto = textoDeNodo(children).trim();

      if (texto.length === 0) return true;

      if (esBasura(texto)) {
        removidos++;
        return false;
      }

      return true;
    }

    return true;
  });

  if (removidos > 0) {
    console.log(`[docx-normalizer] Párrafos basura eliminados: ${removidos}`);
    bodyNode[bodyKey] = hijosFiltrados;

    const xmlLimpio = builder.build(arbol);
    zip.file("word/document.xml", xmlLimpio);
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
