import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

/**
 * Test específico: verificar que el renderer puede escribir en celdas vacías.
 *
 * Crea un DOCX mínimo con:
 * - Una tabla con 2 filas
 * - Fila 0: [etiqueta] [valor existente]
 * - Fila 1: [etiqueta] [CELDA VACÍA]
 *
 * Luego usa el renderer para escribir en ambas celdas y verifica que ambas se llenan.
 */

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

/** Crea un DOCX mínimo con una tabla que tiene celdas vacías */
async function crearDocxPrueba(): Promise<Buffer> {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:w10="urn:schemas-microsoft-com:office:word"
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
            mc:Ignorable="w14 wp14">
  <w:body>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9000" w:type="dxa"/>
      </w:tblPr>
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:r>
              <w:t>Etiqueta</w:t>
            </w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:r>
              <w:t>Valor existente</w:t>
            </w:r>
          </w:p>
        </w:tc>
      </w:tr>
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:r>
              <w:t>Objetivos del área</w:t>
            </w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
          <w:p/>
        </w:tc>
      </w:tr>
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:r>
              <w:t>Completamente vacía</w:t>
            </w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>
        </w:tc>
      </w:tr>
    </w:tbl>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="720" w:footer="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;

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

  return zip.generateAsync({ type: "nodebuffer" });
}

describe("renderer: escritura en celdas vacías", () => {
  it("reemplaza texto en celda que tiene w:t existente", async () => {
    const { renderizarDocxPlantilla } = await import(
      "../server/import-formato/template-docx-renderer"
    );

    const templateBuffer = await crearDocxPrueba();

    const bindings = {
      campos: [
        {
          id: "campo1",
          campo: "campo1",
          tipo: "text" as const,
          ubicacion: {
            tipo: "docx-cell" as const,
            tabla: 0,
            fila: 0,
            columna: 1,
          },
          obligatorio: false,
        },
      ],
      regionesRepetibles: [],
    };

    const datos = { campo1: "Valor nuevo" };

    const resultado = await renderizarDocxPlantilla(templateBuffer, bindings, datos);

    // Parsear el resultado y verificar
    const zip = await JSZip.loadAsync(resultado);
    const docXml = await zip.file("word/document.xml")!.async("string");
    const arbol = parser.parse(docXml);

    // Buscar todos los w:t en el documento
    const textos: string[] = [];
    const buscarTextos = (nodos: any[]) => {
      for (const nodo of nodos) {
        const key = Object.keys(nodo).find((k) => k !== ":@");
        if (!key) continue;
        if (key === "w:t") {
          const val = Array.isArray(nodo["w:t"]) ? nodo["w:t"][0]["#text"] : nodo["#text"];
          if (val) textos.push(val);
        }
        if (Array.isArray(nodo[key])) buscarTextos(nodo[key]);
      }
    };
    buscarTextos(arbol);

    expect(textos).toContain("Valor nuevo");
    expect(textos).toContain("Etiqueta");
    // "Valor existente" fue reemplazado por "Valor nuevo" — eso es correcto
    expect(textos).not.toContain("Valor existente");
  });

  it("escribe en celda con w:p vacío (sin w:r ni w:t)", async () => {
    const { renderizarDocxPlantilla } = await import(
      "../server/import-formato/template-docx-renderer"
    );

    const templateBuffer = await crearDocxPrueba();

    const bindings = {
      campos: [
        {
          id: "objetivosArea",
          campo: "objetivosArea",
          tipo: "text" as const,
          ubicacion: {
            tipo: "docx-cell" as const,
            tabla: 0,
            fila: 1,
            columna: 1,
          },
          obligatorio: false,
        },
      ],
      regionesRepetibles: [],
    };

    const datos = { objetivosArea: "Comprender las relaciones matemáticas" };

    const resultado = await renderizarDocxPlantilla(templateBuffer, bindings, datos);

    // Parsear el resultado
    const zip = await JSZip.loadAsync(resultado);
    const docXml = await zip.file("word/document.xml")!.async("string");
    const arbol = parser.parse(docXml);

    const textos: string[] = [];
    const buscarTextos = (nodos: any[]) => {
      for (const nodo of nodos) {
        const key = Object.keys(nodo).find((k) => k !== ":@");
        if (!key) continue;
        if (key === "w:t") {
          const val = Array.isArray(nodo["w:t"]) ? nodo["w:t"][0]["#text"] : nodo["#text"];
          if (val) textos.push(val);
        }
        if (Array.isArray(nodo[key])) buscarTextos(nodo[key]);
      }
    };
    buscarTextos(arbol);

    expect(textos).toContain("Comprender las relaciones matemáticas");
    expect(textos).toContain("Objetivos del área");
  });

  it("escribe en celda completamente vacía (sin w:p)", async () => {
    const { renderizarDocxPlantilla } = await import(
      "../server/import-formato/template-docx-renderer"
    );

    const templateBuffer = await crearDocxPrueba();

    const bindings = {
      campos: [
        {
          id: "campoVacio",
          campo: "campoVacio",
          tipo: "text" as const,
          ubicacion: {
            tipo: "docx-cell" as const,
            tabla: 0,
            fila: 2,
            columna: 1,
          },
          obligatorio: false,
        },
      ],
      regionesRepetibles: [],
    };

    const datos = { campoVacio: "Texto en celda vacía" };

    const resultado = await renderizarDocxPlantilla(templateBuffer, bindings, datos);

    // Parsear el resultado
    const zip = await JSZip.loadAsync(resultado);
    const docXml = await zip.file("word/document.xml")!.async("string");
    const arbol = parser.parse(docXml);

    const textos: string[] = [];
    const buscarTextos = (nodos: any[]) => {
      for (const nodo of nodos) {
        const key = Object.keys(nodo).find((k) => k !== ":@");
        if (!key) continue;
        if (key === "w:t") {
          const val = Array.isArray(nodo["w:t"]) ? nodo["w:t"][0]["#text"] : nodo["#text"];
          if (val) textos.push(val);
        }
        if (Array.isArray(nodo[key])) buscarTextos(nodo[key]);
      }
    };
    buscarTextos(arbol);

    expect(textos).toContain("Texto en celda vacía");
    expect(textos).toContain("Completamente vacía");
  });
});
