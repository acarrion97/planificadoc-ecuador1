/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia Inicial/Preparatoria — A4 LANDSCAPE
 *
 * Estructura (según formato oficial MINEDUC):
 * 1. Encabezado (Unidad Educativa / Año lectivo)
 * 2. Título: Planificación microcurricular
 * 3. Datos Informativos (Docente, Trimestre, Nivel/Subnivel, No. de semanas, Grado, Número de niñas y niños, Paralelo)
 * 4. Situación de aprendizaje (Título + Descripción)
 * 5. Conexiones curriculares (Ámbitos de desarrollo y aprendizaje, Competencias Específica, Indicadores de evaluación)
 * 6. Saberes (Declarativos, Procedimentales, Actitudinales)
 * 7. Desarrolla de la experiencia de aprendizaje (Experiencias de aprendizaje y estrategias metodológicas desde el DUA)
 * 8. Recursos
 * 9. Evaluación (Técnicas, Instrumentos)
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionInicialCurriculo } from "../data/types-curriculo-competencias";
import type { CompetenciaTransversalCode } from "../data/competencias-transversales";

// ── Colores ──
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";
const WHITE = "FFFFFF";
const BLACK = "1A1A1A";

const COMP_COLORS: Record<string, { bg: string; fg: string }> = {
  C: { bg: "3498DB", fg: "FFFFFF" },
  M: { bg: "E74C3C", fg: "FFFFFF" },
  CD: { bg: "9B59B6", fg: "FFFFFF" },
  CS: { bg: "27AE60", fg: "FFFFFF" },
};

// ── Dimensiones A4 landscape ──
const PW = 16838;
const MAR = 560;
const TW = PW - 2 * MAR;

// ── Bordes ──
const B = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

// ── Helpers ──
function p(
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; align?: string } = {}
): Paragraph {
  return new Paragraph({
    alignment: (opts.align as any) || AlignmentType.LEFT,
    spacing: { after: 0, before: 0 },
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
        size: (opts.size ?? 8) * 2,
        color: opts.color ?? BLACK,
        font: "Arial",
      }),
    ],
  });
}

function tc(
  paragraphs: Paragraph[],
  width: number,
  opts: { cs?: number; bg?: string; vAlign?: string; borders?: any } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.cs ?? 1,
    width: { size: width, type: WidthType.DXA },
    verticalAlign: (opts.vAlign as any) ?? VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: opts.borders ?? B,
    children: paragraphs.length > 0 ? paragraphs : [p("")],
  });
}

function makeTable(rows: TableRow[], totalW: number, colWidths: number[]): Table {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

function sectionRow(label: string, cs = 1): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 9, color: COLOR_PRIMARY })], TW, {
        cs,
        bg: COLOR_SECTION,
      }),
    ],
  });
}

function competencyBadge(code: CompetenciaTransversalCode): TextRun {
  const c = COMP_COLORS[code] || { bg: "888888", fg: "FFFFFF" };
  return new TextRun({
    text: ` ${code} `,
    bold: true,
    size: 16,
    color: c.fg,
    font: "Arial",
    shading: { fill: c.bg, type: ShadingType.CLEAR },
  });
}

// ── Generador principal ──
export async function generarCurriculoCompetenciasWordInicial(
  plan: PlanificacionInicialCurriculo
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // ── 1. Encabezado ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "Unidad Educativa…", { bold: true, size: 10 })], TW * 0.6, { bg: COLOR_HEADER }),
            tc([p(`Año lectivo: ${plan.periodoPedagogico || "—"}`, { size: 9 })], TW * 0.4, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [TW * 0.6, TW * 0.4]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 2. Título ──
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Planificación microcurricular", { bold: true, size: 12, align: "center" })], TW)] })],
      TW,
      [TW]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 3. Datos Informativos ──
  children.push(makeTable([sectionRow("DATOS INFORMATIVOS")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW * 0.35),
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Nivel / Subnivel: ${plan.nivel || "—"}`, { size: 8 })], TW * 0.2),
            tc([p(`Grado: ${plan.grado || "—"}`, { size: 8 })], TW * 0.2),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`No. de semanas clase: ${plan.ambitos?.length || 1}`, { size: 8 })], TW * 0.35),
            tc([p(`Número de niñas y niños: —`, { size: 8 })], TW * 0.25),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.2),
            tc([p(`Duración: ${plan.duracion || "—"}`, { size: 8 })], TW * 0.2),
          ],
        }),
      ],
      TW,
      [TW * 0.35, TW * 0.25, TW * 0.2, TW * 0.2]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 4. Situación de aprendizaje ──
  children.push(makeTable([sectionRow("SITUACIÓN DE APRENDIZAJE")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Título:", { bold: true, size: 8 }), p(plan.objetivoGeneral || "—", { size: 8 })], TW * 0.3),
            tc([p("Descripción:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.destrezas?.[0] || "—", { size: 8 })], TW * 0.7),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.7]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 5. Conexiones curriculares ──
  children.push(makeTable([sectionRow("CONEXIONES CURRICULARES")], TW, [TW]));
  
  // Ámbitos de desarrollo y aprendizaje
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Ámbitos de desarrollo y aprendizaje:", { bold: true, size: 8 })], TW * 0.4),
            tc([p(plan.ambitos?.map(a => a.ambito).join(", ") || "—", { size: 8 })], TW * 0.6),
          ],
        }),
      ],
      TW,
      [TW * 0.4, TW * 0.6]
    )
  );

  // Competencias Específica
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Competencias Específica:", { bold: true, size: 8 })], TW * 0.4),
            tc([p(plan.ambitos?.[0]?.competenciaDescripcion || "—", { size: 8 })], TW * 0.6),
          ],
        }),
      ],
      TW,
      [TW * 0.4, TW * 0.6]
    )
  );

  // Indicadores de evaluación
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Indicadores de evaluación:", { bold: true, size: 8 })], TW * 0.4),
            tc([p(plan.ambitos?.[0]?.destrezas?.join(", ") || "—", { size: 8 })], TW * 0.6),
          ],
        }),
      ],
      TW,
      [TW * 0.4, TW * 0.6]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 6. Saberes ──
  children.push(makeTable([sectionRow("SABERES")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Declarativos:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.destrezas?.[0] || "—", { size: 7 })], TW * 0.33),
            tc([p("Procedimentales:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.clases?.[0]?.inicio?.[0]?.texto || "—", { size: 7 })], TW * 0.34),
            tc([p("Actitudinales:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.clases?.[0]?.cierre?.[0]?.texto || "—", { size: 7 })], TW * 0.33),
          ],
        }),
      ],
      TW,
      [TW * 0.33, TW * 0.34, TW * 0.33]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 7. Desarrolla de la experiencia de aprendizaje ──
  children.push(makeTable([sectionRow("DESARROLLA DE LA EXPERIENCIA DE APRENDIZAJE")], TW, [TW]));
  
  // Experiencias de aprendizaje y estrategias metodológicas desde el DUA
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Experiencias de aprendizaje y estrategias metodológicas desde el DUA:", { bold: true, size: 8 })], TW),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // Por cada ámbito y clase
  for (const ambito of plan.ambitos) {
    for (const clase of ambito.clases) {
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc([p(`Ámbito: ${ambito.ambito} - Clase ${clase.numero}: ${clase.tema}`, { bold: true, size: 9 })], TW),
              ],
            }),
          ],
          TW,
          [TW]
        )
      );

      // Fases: INICIO / DESARROLLO / CIERRE
      const fases = [
        { label: "INICIO", actividades: clase.inicio },
        { label: "DESARROLLO", actividades: clase.desarrollo },
        { label: "CIERRE", actividades: clase.cierre },
      ];

      const colW = Math.floor(TW / 3);
      const colWidths = [colW, colW, TW - 2 * colW];

      children.push(
        makeTable(
          [
            new TableRow({
              children: fases.map((fase) =>
                tc([p(fase.label, { bold: true, size: 8, color: WHITE })], colW, {
                  bg: fase.label === "INICIO" ? "2980B9" : fase.label === "DESARROLLO" ? "27AE60" : "E67E22",
                })
              ),
            }),
            new TableRow({
              children: fases.map((fase) =>
                tc(
                  fase.actividades.flatMap((act) => [
                    p(`• ${act.texto}`, { size: 7 }),
                  ]),
                  colW
                )
              ),
            }),
          ],
          TW,
          colWidths
        )
      );

      children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
    }
  }

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 8. Recursos ──
  children.push(makeTable([sectionRow("RECURSOS")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Recursos:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.clases?.[0]?.metodologia || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 9. Evaluación ──
  children.push(makeTable([sectionRow("EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Técnicas:", { bold: true, size: 8 }), p(plan.ambitos?.[0]?.clases?.[0]?.metodoEvaluacion?.join(", ") || "—", { size: 8 })], TW * 0.5),
            tc([p("Instrumentos:", { bold: true, size: 8 }), p("—", { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW * 0.5, TW * 0.5]
    )
  );

  // ── Construir documento ──
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 16 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PW, height: 11906 },
            margin: { top: MAR, bottom: MAR, left: MAR, right: MAR },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
