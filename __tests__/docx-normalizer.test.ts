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

function tablaGenerica(...filas: string[]): string {
  return `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5000"/></w:tblGrid>
    ${filas.join("")}
  </w:tbl>`;
}

function tablaConEncabezadosPCA(...filas: string[]): string {
  return `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/></w:tblGrid>
    ${filas.join("")}
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
    if (key === "w:p") count++;
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

async function conteudo(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = zip.file("word/document.xml");
  if (!docXml) return "";
  return docXml.async("string");
}

describe("docx-normalizer", () => {
  it("preserva un buffer DOCX válido y lo puede re-abrir JSZip", async () => {
    const buffer = await construirDocx(
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );
    const resultado = await normalizarDocxPca(buffer);
    const zip = await JSZip.loadAsync(resultado);
    expect(zip.file("word/document.xml")).not.toBeNull();
  });

  it("elimina párrafos basura administrativos fuera de tablas", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>TÉRMINOS DE REFERENCIA PARA LA CONTRATACIÓN</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>SUBSECRETARÍA DE FUNDAMENTOS EDUCATIVOS</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>DIRECCIÓN NACIONAL DE CURRÍCULO</w:t></w:r></w:p>` +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );

    const resultado = await normalizarDocxPca(buffer);
    const parrafos = await contarParrafosFueraDeTablas(resultado);
    expect(parrafos).toBe(0);
  });

  it("elimina patrones de basura adicionales (COMPROMISO, ATRIBUCIONES, etc.)", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>COMPROMISO DEL PROVEEDOR</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>ATRIBUCIONES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>PLAN DE ACCIÓN</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>FUENTES DE FINANCIAMIENTO</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>CRONOGRAMA DE ACTIVIDADES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>SISTEMA DE SEGUIMIENTO</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>SISTEMA DE CONTROL</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>RÉGIMEN DE PENALIDADES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>OBLIGACIONES DEL PROVEEDOR</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>CONSIDERACIONES GENERALES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>DISPOSICIONES GENERALES</w:t></w:r></w:p>` +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );

    const resultado = await normalizarDocxPca(buffer);
    const parrafos = await contarParrafosFueraDeTablas(resultado);
    expect(parrafos).toBe(0);
  });

  it("conserva TODOS los párrafos que no son basura administrativa", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>OBJETIVOS DEL ÁREA</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>BIBLIOGRAFÍA</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>OBSERVACIONES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>INSERCIONES CURRICULARES</w:t></w:r></w:p>` +
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>EJES TRANSVERSALES</w:t></w:r></w:p>` +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );

    const resultado = await normalizarDocxPca(buffer);
    const content = await conteudo(resultado);
    expect(content).toContain("OBJETIVOS DEL ÁREA");
    expect(content).toContain("BIBLIOGRAFÍA");
    expect(content).toContain("OBSERVACIONES");
    expect(content).toContain("INSERCIONES CURRICULARES");
    expect(content).toContain("EJES TRANSVERSALES");
  });

  it("conserva TODAS las tablas (incluyendo las que no son PCA)", async () => {
    const tablaBasura = tablaGenerica(
      fila(celdaSimple("Dato irrelevante 1"), celdaSimple("Dato irrelevante 2"))
    );

    const buffer = await construirDocx(
      tablaBasura +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );

    const resultado = await normalizarDocxPca(buffer);
    const numTablas = await contarTablas(resultado);
    expect(numTablas).toBe(2);
  });

  it("conserva filas completamente vacías en tablas", async () => {
    const tabla =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5000"/></w:tblGrid>` +
      fila(celdaSimple("Dato real"), celdaSimple("Otro dato")) +
      fila(celdaVacia(), celdaVacia()) +
      fila(celdaVacia(), celdaVacia()) +
      fila(celdaSimple("Más datos"), celdaSimple("Aquí")) +
      `</w:tbl>`;

    const buffer = await construirDocx(tabla);
    const resultado = await normalizarDocxPca(buffer);
    const content = await conteudo(resultado);
    expect(content).toContain("Dato real");
    expect(content).toContain("Más datos");

    const zip = await JSZip.loadAsync(resultado);
    const docXml = zip.file("word/document.xml");
    const docContent = await docXml!.async("string");
    const arbol = parser.parse(docContent);
    const tablas = buscarNodos(arbol, "w:tbl");
    const filas = buscarNodos([tablas[0]], "w:tr");
    expect(filas.length).toBe(4);
  });

  it("preserva atributos de merge (gridSpan)", async () => {
    const tabla =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5000"/></w:tblGrid>` +
      fila(celdaConMerge(2)) +
      `</w:tbl>`;

    const buffer = await construirDocx(tabla);
    const resultado = await normalizarDocxPca(buffer);
    const content = await conteudo(resultado);
    expect(content).toContain('w:gridSpan w:val="2"');
  });

  it("preserva bordes de celdas", async () => {
    const tablaConBordes =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="10000"/></w:tblGrid>` +
      `<w:tr><w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:color="A9C3C8"/></w:tcBorders></w:tcPr><w:p><w:r><w:t>test</w:t></w:r></w:p></w:tc></w:tr>` +
      `</w:tbl>`;

    const buffer = await construirDocx(tablaConBordes);
    const resultado = await normalizarDocxPca(buffer);
    const content = await conteudo(resultado);
    expect(content).toContain("tcBorders");
    expect(content).toContain("A9C3C8");
  });

  it("preserva alturas de filas existentes", async () => {
    const tabla =
      `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:tblGrid><w:gridCol w:w="10000"/></w:tblGrid>` +
      `<w:tr><w:trPr><w:trHeight w:val="2000" w:hRule="atLeast"/></w:trPr><w:tc><w:p><w:r><w:t>test</w:t></w:r></w:p></w:tc></w:tr>` +
      `</w:tbl>`;

    const buffer = await construirDocx(tabla);
    const resultado = await normalizarDocxPca(buffer);
    const content = await conteudo(resultado);
    expect(content).toContain("w:trHeight");
    expect(content).toContain('w:val="2000"');
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

  it("output tiene tamaño razonable (no se infla ni colapsa)", async () => {
    const input = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>TÉRMINOS DE REFERENCIA</w:t></w:r></w:p>` +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );
    const resultado = await normalizarDocxPca(input);
    expect(resultado.length).toBeGreaterThan(100);
    expect(resultado.length).toBeLessThanOrEqual(input.length * 1.5);
  });

  it("conserva párrafos vacíos entre secciones", async () => {
    const buffer = await construirDocx(
      `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>` +
      tablaConEncabezadosPCA(
        fila(celdaSimple("N.°"), celdaSimple("Título"), celdaSimple("Objetivos específicos"), celdaSimple("Contenidos"), celdaSimple("Orientaciones"), celdaSimple("Evaluación"), celdaSimple("Duración")),
        fila(celdaSimple("1."), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaVacia(), celdaSimple("6"))
      )
    );

    const resultado = await normalizarDocxPca(buffer);
    const parrafos = await contarParrafosFueraDeTablas(resultado);
    expect(parrafos).toBe(1);
  });
});
