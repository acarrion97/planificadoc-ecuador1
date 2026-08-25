/**
 * Genera documentos de prueba en el formato oficial MinEduc de PCA
 * (.docx), con marca de agua de logo institucional y datos de la
 * institución en el pie de página — para probar el flujo de importación
 * (openspec/changes/importar-formato-planificacion) sin depender de
 * archivos reales de docentes.
 *
 * Uso: pnpm tsx scripts/generar-doc-prueba-pca.ts
 * Escribe un .docx por institución de muestra en scripts/output/.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  ImageRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  Header,
  Footer,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  TextWrappingType,
} from "docx";
import { circuloPngBase64 } from "./lib/mini-png";

export type UnidadPrueba = {
  numero: number;
  duracionSemanas?: number;
  // Deliberadamente sin título/objetivos/contenidos/evaluación — simula un
  // docente que solo llenó lo básico a mano; el resto lo completa la IA.
};

export type DatosDocPrueba = {
  institucion: string;
  anioLectivo: string;
  area: string;
  asignatura?: string;
  docente: string;
  grado: string;
  nivelEducativo: string;
  cargaHorariaSemanal?: number;
  semanasTrabajoTotal?: number;
  semanasEvaluacion?: number;
  unidades: UnidadPrueba[];
  direccionInstitucion: string;
  telefonoInstitucion: string;
  colorMarcaAgua: string; // hex sin '#', ej. "7C3AED"
};

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const borders = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function celda(texto: string, opts: { span?: number; bold?: boolean } = {}): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: texto, bold: opts.bold, size: 18 })] })],
    columnSpan: opts.span,
    borders,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: VerticalAlign.CENTER,
  });
}

function celdaVacia(span?: number): TableCell {
  return celda(" ", { span });
}

function filaSeccion(titulo: string): TableRow {
  return new TableRow({ children: [celda(titulo, { span: 7, bold: true })] });
}

function construirTablaPrincipal(datos: DatosDocPrueba): Table {
  const filas: TableRow[] = [
    new TableRow({
      children: [celda("LOGO INSTITUCIONAL"), celda(datos.institucion, { span: 5 }), celda(datos.anioLectivo)],
    }),
    new TableRow({ children: [celda("PLAN  CURRICULAR  ANUAL", { span: 7, bold: true })] }),
    filaSeccion("1. DATOS INFORMATIVOS"),
    new TableRow({
      children: [celda("Área:"), celda(datos.area, { span: 2 }), celda("Asignatura:"), celda(datos.asignatura ?? datos.area, { span: 3 })],
    }),
    new TableRow({ children: [celda("Docente(s):"), celda(datos.docente, { span: 6 })] }),
    new TableRow({
      children: [celda("Grado/curso:"), celda(datos.grado, { span: 2 }), celda("Nivel Educativo:"), celda(datos.nivelEducativo, { span: 3 })],
    }),
    filaSeccion("2. TIEMPO"),
    new TableRow({
      children: [
        celda("Carga horaria semanal", { bold: true }),
        celda("No. Semanas de trabajo", { bold: true }),
        celda("Evaluación del aprendizaje e imprevistos", { bold: true }),
        celda("Total de semanas clases", { bold: true }),
        celda("Total de periodos", { bold: true }, ),
        celdaVacia(2),
      ],
    }),
    new TableRow({
      children: [
        celda(String(datos.cargaHorariaSemanal ?? "")),
        celda(String(datos.semanasTrabajoTotal ?? "")),
        celda(String(datos.semanasEvaluacion ?? "")),
        celdaVacia(),
        celdaVacia(),
        celdaVacia(2),
      ],
    }),
    filaSeccion("3. OBJETIVOS  GENERALES"),
    new TableRow({ children: [celda("Objetivos del área", { span: 3, bold: true }), celda("Objetivos del grado/curso", { span: 4, bold: true })] }),
    // Deliberadamente vacíos: la IA los completa al importar.
    new TableRow({ children: [celdaVacia(3), celdaVacia(4)] }),
    new TableRow({ children: [celda("4. EJES TRANSVERSALES:", { span: 3, bold: true }), celdaVacia(4)] }),
    filaSeccion("DESARROLLO DE UNIDADES DE PLANIFICACIÓN*"),
    new TableRow({
      children: [
        celda("N.º", { bold: true }),
        celda("Título de la unidad de planificación", { bold: true }),
        celda("Objetivos específicos de la unidad de planificación", { bold: true }),
        celda("Contenidos**", { bold: true }),
        celda("Orientaciones metodológicas", { bold: true }),
        celda("Evaluación***", { bold: true }),
        celda("Duración en semanas", { bold: true }),
      ],
    }),
    ...datos.unidades.map(
      (u) =>
        new TableRow({
          children: [
            celda(`${u.numero}.`),
            celdaVacia(),
            celdaVacia(),
            celdaVacia(),
            celdaVacia(),
            celdaVacia(),
            celda(u.duracionSemanas != null ? String(u.duracionSemanas) : " "),
          ],
        })
    ),
    new TableRow({
      children: [
        celda("6. BIBLIOGRAFÍA/ WEBGRAFÍA (Utilizar normas APA VI edición)", { span: 5, bold: true }),
        celda("7. OBSERVACIONES", { span: 2, bold: true }),
      ],
    }),
    new TableRow({ children: [celdaVacia(5), celdaVacia(2)] }),
    new TableRow({ children: [celda("ELABORADO", { bold: true }), celda("REVISADO", { bold: true }), celda("APROBADO", { bold: true }), celdaVacia(4)] }),
    new TableRow({ children: [celda("DOCENTE(S):"), celda("NOMBRE:"), celda("NOMBRE:"), celdaVacia(4)] }),
  ];

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: filas });
}

export async function construirDocPruebaPca(datos: DatosDocPrueba): Promise<Buffer> {
  const marcaAguaPng = Buffer.from(circuloPngBase64({ colorHex: datos.colorMarcaAgua, alpha: 60 }), "base64");

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: marcaAguaPng,
                    transformation: { width: 260, height: 260, rotation: -30 },
                    floating: {
                      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, align: HorizontalPositionAlign.CENTER },
                      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, align: VerticalPositionAlign.CENTER },
                      behindDocument: true,
                      wrap: { type: TextWrappingType.NONE },
                    },
                  } as any),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${datos.institucion} • ${datos.direccionInstitucion} • Tel: ${datos.telefonoInstitucion}`,
                    size: 14,
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [construirTablaPrincipal(datos)],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

const INSTITUCIONES_DE_MUESTRA: DatosDocPrueba[] = [
  {
    institucion: "Unidad Educativa \"Simón Bolívar\"",
    anioLectivo: "2025-2026",
    area: "Matemática",
    docente: "Lcda. María Fernanda Torres",
    grado: "8vo EGB",
    nivelEducativo: "Básica Superior",
    cargaHorariaSemanal: 5,
    semanasTrabajoTotal: 40,
    semanasEvaluacion: 8,
    unidades: [{ numero: 1, duracionSemanas: 6 }, { numero: 2, duracionSemanas: 6 }],
    direccionInstitucion: "Av. Amazonas N34-451, Quito",
    telefonoInstitucion: "02-2345678",
    colorMarcaAgua: "7C3AED",
  },
  {
    institucion: "Escuela de Educación Básica \"Eugenio Espejo\"",
    anioLectivo: "2025-2026",
    area: "Ciencias Naturales",
    docente: "Ing. Carlos Andrés Vega",
    grado: "5to EGB",
    nivelEducativo: "Básica Media",
    cargaHorariaSemanal: 4,
    semanasTrabajoTotal: 40,
    semanasEvaluacion: 6,
    unidades: [{ numero: 1, duracionSemanas: 8 }],
    direccionInstitucion: "Calle Bolívar y Sucre, Cuenca",
    telefonoInstitucion: "07-2891234",
    colorMarcaAgua: "0E7490",
  },
  {
    institucion: "Colegio Nacional \"Vicente Rocafuerte\"",
    anioLectivo: "2025-2026",
    area: "Física",
    docente: "Msc. Patricia Elizabeth Rojas",
    grado: "2do BGU",
    nivelEducativo: "Bachillerato General Unificado",
    cargaHorariaSemanal: 3,
    semanasTrabajoTotal: 40,
    semanasEvaluacion: 8,
    unidades: [{ numero: 1, duracionSemanas: 10 }, { numero: 2, duracionSemanas: 10 }, { numero: 3, duracionSemanas: 10 }],
    direccionInstitucion: "Malecón 1508, Guayaquil",
    telefonoInstitucion: "04-2567890",
    colorMarcaAgua: "DC2626",
  },
];

async function main() {
  const outDir = join(__dirname, "output");
  mkdirSync(outDir, { recursive: true });
  for (const datos of INSTITUCIONES_DE_MUESTRA) {
    const buffer = await construirDocPruebaPca(datos);
    const nombreArchivo = `PCA-prueba-${datos.institucion.replace(/[^a-zA-Z0-9]+/g, "-")}.docx`;
    writeFileSync(join(outDir, nombreArchivo), buffer);
    console.log(`Generado: scripts/output/${nombreArchivo}`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
