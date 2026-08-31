import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { normalizarDocxPca } from "../server/import-formato/docx-normalizer";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
});

function buscarNodos(arbol: any[], tag: string): any[] {
  const encontrados: any[] = [];
  const recorrer = (nodos: any[]) => {
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

function textoDeNodo(nodo: any[]): string {
  let out = "";
  for (const hijo of nodo) {
    const tag = Object.keys(hijo).find((k) => k !== ":@");
    if (!tag) continue;
    if (tag === "w:t") {
      const valor = hijo[tag];
      out += Array.isArray(valor)
        ? valor.map((v) => v["#text"] ?? "").join("")
        : (hijo["#text"] ?? "");
    } else if (Array.isArray(hijo[tag])) {
      out += textoDeNodo(hijo[tag]);
    }
  }
  return out;
}

function nodoKey(nodo: any): string | undefined {
  return Object.keys(nodo).find((k) => k !== ":@");
}

function celdaSimple(texto: string): string {
  return `<w:tc xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:r><w:t>${texto}</w:t></w:r></w:p></w:tc>`;
}

function celdaVacia(): string {
  return `<w:tc xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p></w:tc>`;
}

function celdaConMerge(colSpan: number): string {
  return `<w:tc xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:tcPr><w:gridSpan w:val="${colSpan}"/></w:tcPr><w:p><w:r><w:t>merged</w:t></w:r></w:p></w:tc>`;
}

function fila(...celdas: string[]): string {
  return `<w:tr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${celdas.join("")}</w:tr>`;
}

function tablaUnidades(): string {
  return `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:tblGrid><w:gridCol w:w="788"/><w:gridCol w:w="2364"/><w:gridCol w:w="2836"/><w:gridCol w:w="2836"/><w:gridCol w:w="3467"/><w:gridCol w:w="2679"/><w:gridCol w:w="788"/></w:tblGrid>
    ${fila(celdaSimple("N.°"), celdaSimple("Título de la unidad"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones metodológicas"), celdaSimple("Evaluación"), celdaSimple("Duración en semanas"))}
    ${fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))}
    ${fila(celdaSimple("2."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))}
  </w:tbl>`;
}

function tablaFirmas(): string {
  return `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:tblGrid><w:gridCol w:w="5253"/><w:gridCol w:w="5253"/><w:gridCol w:w="5252"/></w:tblGrid>
    ${fila(celdaSimple("ELABORADO"), celdaSimple("REVISADO"), celdaSimple("APROBADO"))}
    ${fila(celdaSimple("DOCENTE(S):"), celdaSimple("NOMBRE:"), celdaSimple("NOMBRE:"))}
  </w:tbl>`;
}

function tablaBasura(): string {
  return `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5000"/></w:tblGrid>
    ${fila(celdaSimple("Dato irrelevante 1"), celdaSimple("Dato irrelevante 2"))}
  </w:tbl>`;
}

function construirDocx(bodyContent: string): Promise<Buffer> {
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyContent}
    <w:sectPr><w:pgSz w:w="16838" w:h="11906"/></w:sectPr>
  </w:body>
</w:document>`;

  return crearDocxZip(xml);
}

async function crearDocxZip(documentXml: string): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("word/document.xml", documentXml);
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return Buffer.from(buffer);
}

async function contarParrafosFueraDeTablas(buffer: Buffer): Promise<number> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = zip.file("word/document.xml");
  if (!docXml) return 0;

  const content = await docXml.async("string");
  const arbol = parser.parse(content);
  const body = buscarNodos(arbol, "w:body");
  if (body.length === 0) return 0;

  const bodyKey = Object.keys(body[0]).find((k) => k !== ":@");
  if (!bodyKey) return 0;

  const children = Array.isArray(body[0][bodyKey]) ? body[0][bodyKey] : [];
  let count = 0;
  for (const child of children) {
    const key = Object.keys(child).find((k) => k !== ":@");
    if (key === "w:p") {
      const kids = Array.isArray(child[key]) ? child[key] : [];
      const texto = textoDeNodo(kids).trim();
      if (texto.length > 0) count++;
    }
  }
  return count;
}

async function contarTablas(buffer: Buffer): Promise<number> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = zip.file("word/document.xml");
  if (!docXml) return 0;

  const content = await docXml.async("string");
  const arbol = parser.parse(content);
  return buscarNodos(arbol, "w:tbl").length;
}

async function contarFilasVacias(buffer: Buffer, tablaIndex: number): Promise<number> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = zip.file("word/document.xml");
  if (!docXml) return 0;

  const content = await docXml.async("string");
  const arbol = parser.parse(content);
  const tablas = buscarNodos(arbol, "w:tbl");
  const tabla = tablas[tablaIndex];
  if (!tabla) return 0;

  const key = Object.keys(tabla).find((k) => k !== ":@");
  if (!key) return 0;

  const children = Array.isArray(tabla[key]) ? tabla[key] : [];
  let emptyCount = 0;
  for (const child of children) {
    const childKey = Object.keys(child).find((k) => k !== ":@");
    if (childKey !== "w:tr") continue;

    const celdas = buscarNodos([child], "w:tc");
    let allEmpty = true;
    for (const celda of celdas) {
      const cKey = Object.keys(celda).find((k) => k !== ":@");
      if (!cKey) continue;
      const celdaChildren = Array.isArray(celda[cKey]) ? celda[cKey] : [];
      const texto = textoDeNodo(celdaChildren).trim();
      if (texto.length > 0) {
        allEmpty = false;
        break;
      }
    }
    if (allEmpty) emptyCount++;
  }
  return emptyCount;
}

describe("docx-normalizer", () => {
  it("preserva un buffer DOCX válido y lo puede re-abrir JSZip", async () => {
    const buffer = await construirDocx(
      tablaUnidades() + tablaFirmas()
    );
    const resultado = await normalizarDocxPca(buffer);
    const zip = await JSZip.loadAsync(resultado);
    const doc = zip.file("word/document.xml");
    expect(doc).not.toBeNull();
  });

  it("elimina párrafos basura fuera de tablas", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>TÉRMINOS DE REFERENCIA PARA LA CONTRATACIÓN</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>SUBSECRETARÍA DE FUNDAMENTOS EDUCATIVOS</w:t></w:r></w:p>` +
      tablaUnidades() +
      tablaFirmas()
    );

    const resultado = await normalizarDocxPca(buffer);
    const parrafos = await contarParrafosFueraDeTablas(resultado);
    expect(parrafos).toBe(0);
  });

  it("conserva párrafos de sección (OBJETIVOS, BIBLIOGRAFÍA, etc.)", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>OBJETIVOS DEL ÁREA</w:t></w:r></w:p>` +
      tablaUnidades() +
      tablaFirmas()
    );

    const resultado = await normalizarDocxPca(buffer);
    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const content = await docXml!.async("string");
    expect(content).toContain("OBJETIVOS DEL ÁREA");
  });

  it("elimina tablas extra no reconocidas", async () => {
    const buffer = await construirDocx(
      tablaBasura() + tablaUnidades() + tablaFirmas()
    );

    const resultado = await normalizarDocxPca(buffer);
    const numTablas = await contarTablas(resultado);
    expect(numTablas).toBe(2);
  });

  it("conserva tabla de unidades y tabla de firmas", async () => {
    const buffer = await construirDocx(
      tablaUnidades() + tablaFirmas()
    );

    const resultado = await normalizarDocxPca(buffer);
    const numTablas = await contarTablas(resultado);
    expect(numTablas).toBe(2);

    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const content = await docXml!.async("string");
    expect(content).toContain("N.°");
    expect(content).toContain("ELABORADO");
  });

  it("elimina filas completamente vacías", async () => {
    const tablaConVacias =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5000"/></w:tblGrid>` +
      fila(celdaSimple("Dato real"), celdaSimple("Otro dato")) +
      fila(celdaVacia(), celdaVacia()) +
      fila(celdaVacia(), celdaVacia()) +
      fila(celdaSimple("Más datos"), celdaSimple("Aquí")) +
      `</w:tbl>`;

    const buffer = await construirDocx(tablaConVacias);
    const resultado = await normalizarDocxPca(buffer);
    const vacias = await contarFilasVacias(resultado, 0);
    expect(vacias).toBe(0);
  });

  it("conserva filas con al menos una celda con contenido", async () => {
    const tabla =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/></w:tblGrid>` +
      fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")) +
      fila(celdaSimple("1."), celdaSimple("Contenido"), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6")) +
      fila(celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("También contenido"), celdaVacia(), celdaVacia(), celdaVacia()) +
      `</w:tbl>`;

    const buffer = await construirDocx(tabla);
    const resultado = await normalizarDocxPca(buffer);

    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const content = await docXml!.async("string");
    expect(content).toContain("Contenido");
    expect(content).toContain("También contenido");
  });

  it("preserva atributos de merge (gridSpan)", async () => {
    const tabla =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/></w:tblGrid>` +
      fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")) +
      fila(celdaConMerge(2), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia()) +
      `</w:tbl>`;

    const buffer = await construirDocx(tabla);
    const resultado = await normalizarDocxPca(buffer);

    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const content = await docXml!.async("string");
    expect(content).toContain('w:gridSpan w:val="2"');
  });

  it("preserva bordes de celdas", async () => {
    const tablaConBordes =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/></w:tblGrid>` +
      `<w:tr><w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:color="A9C3C8"/></w:tcBorders></w:tcPr><w:p><w:r><w:t>N.°</w:t></w:r></w:p></w:tc>` +
      celdaSimple("Título") + celdaSimple("Objetivos específicos") + celdaSimple("Contenidos") + celdaSimple("Orientaciones") + celdaSimple("Evaluación") + celdaSimple("Duración") +
      `</w:tr>` +
      `<w:tr>${celdaSimple("1.")}${celdaVacia()}${celdaVacia()}${celdaVacia()}${celdaVacia()}${celdaVacia()}${celdaSimple("6")}</w:tr>` +
      `</w:tbl>`;

    const buffer = await construirDocx(tablaConBordes);
    const resultado = await normalizarDocxPca(buffer);

    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const content = await docXml!.async("string");
    expect(content).toContain("tcBorders");
    expect(content).toContain("A9C3C8");
  });

  it("maneja buffer corrupto sin lanzar error", async () => {
    const buffer = Buffer.from("esto no es un docx");
    const resultado = await normalizarDocxPca(buffer);
    expect(Buffer.isBuffer(resultado)).toBe(true);
  });

  it("maneja DOCX sin word/document.xml", async () => {
    const zip = new JSZip();
    zip.file("dummy.xml", "<root/>");
    const buffer = Buffer.from(await zip.generateAsync({ type: "nodebuffer" }));
    const resultado = await normalizarDocxPca(buffer);
    expect(Buffer.isBuffer(resultado)).toBe(true);
  });

  it("output tiene tamaño razonable (no se infla)", async () => {
    const input = await construirDocx(tablaUnidades() + tablaFirmas());
    const resultado = await normalizarDocxPca(input);
    expect(resultado.length).toBeLessThanOrEqual(input.length * 1.5);
    expect(resultado.length).toBeGreaterThan(100);
  });
});
