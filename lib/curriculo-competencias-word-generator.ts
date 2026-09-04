/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia EGB/BGU — A4 LANDSCAPE
 *
 * Estructura:
 * 1. Encabezado (Institución / Año)
 * 2. Datos Informativos
 * 3. DCD y Competencias
 * 4. Estrategia Didáctica (fases con colores)
 * 5. Evaluación
 * 6. Firmas
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionCurriculoCompetencias } from "../data/types-curriculo-competencias";
import type { CompetenciaTransversalCode } from "../data/competencias-transversales";

// ── Colores ──────────────────────────────────────────────────────
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";
const COLOR_BORDER = "A9C3C8";
const WHITE = "FFFFFF";
const BLACK = "1A1A1A";

// Colores competencias
const COMP_COLORS: Record<string, { bg: string; fg: string }> = {
  C: { bg: "3498DB", fg: "FFFFFF" },
  M: { bg: "E74C3C", fg: "FFFFFF" },
  CD: { bg: "9B59B6", fg: "FFFFFF" },
  CS: { bg: "27AE60", fg: "FFFFFF" },
};

// Colores ERCA
const ERCA_COLORS: Record<string, string> = {
  INICIO: "2980B9",
  DESARROLLO: "27AE60",
  CIERRE: "E67E22",
  Experiencia: "2980B9",
  Reflexión: "8E44AD",
  Conceptualización: "27AE60",
  Aplicación: "E67E22",
};

// ── Dimensiones A4 landscape ──
const PW = 16838;
const MAR = 560;
const TW = PW - 2 * MAR; // 15718

// ── Bordes ──
const B = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

const B_NONE = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
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

function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 9, color: COLOR_PRIMARY })], TW, {
        cs: 4,
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
export async function generarCurriculoCompetenciasWordEGBBGU(
  plan: PlanificacionCurriculoCompetencias
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // ── 1. Encabezado ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "INSTITUCIÓN", { bold: true, size: 10 })], TW * 0.6, { bg: COLOR_HEADER }),
            tc([p(`Año Lectivo: ${plan.periodoPedagogico || "—"}`, { size: 9 })], TW * 0.4, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [TW * 0.6, TW * 0.4]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 2. Datos Informativos ──
  children.push(makeTable([sectionRow("DATOS INFORMATIVOS")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW * 0.35),
            tc([p(`Asignatura: ${plan.asignatura || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Grado: ${plan.grado || "—"}`, { size: 8 })], TW * 0.15),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.1),
            tc([p(`Nivel: ${plan.nivel || "—"}`, { size: 8 })], TW * 0.15),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], TW * 0.35),
            tc([p(`Fecha: ${plan.fecha || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Período: ${plan.periodoPedagogico || "—"}`, { size: 8 })], TW * 0.4),
          ],
        }),
      ],
      TW,
      [TW * 0.35, TW * 0.25, TW * 0.15, TW * 0.1, TW * 0.15]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 3. DCD y Competencias ──
  children.push(makeTable([sectionRow("APRENDIZAJE DISCIPLINAR — DCD Y COMPETENCIAS")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("DCD:", { bold: true, size: 8 }), p(plan.destreza?.codigo || plan.indicadorEvaluacion || "—", { size: 8 })], TW * 0.3),
            tc(
              [
                p("Competencias:", { bold: true, size: 8 }),
                new Paragraph({
                  spacing: { after: 0, before: 40 },
                  children: plan.competenciasAsociadas.map((c) => competencyBadge(c)),
                }),
              ],
              TW * 0.3
            ),
            tc([p("Descripción:", { bold: true, size: 8 }), p(plan.destreza?.descripcion || "—", { size: 8 })], TW * 0.4),
          ],
        }),
        new TableRow({
          children: [
            tc([p("Indicador:", { bold: true, size: 8 }), p(plan.indicadorEvaluacion || "—", { size: 8 })], TW * 0.5),
            tc([p("Objetivo:", { bold: true, size: 8 }), p(plan.objetivoAprendizaje || "—", { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.3, TW * 0.4]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 4. Estrategia Didáctica ──
  children.push(makeTable([sectionRow("ESTRATEGIA DIDÁCTICA")], TW, [TW]));
  const fases = plan.estructuraDidactica?.fases || [];
  if (fases.length > 0) {
    const colW = Math.floor(TW / fases.length);
    const colWidths = fases.map((_, i) => (i === fases.length - 1 ? TW - colW * (fases.length - 1) : colW));
    children.push(
      makeTable(
        [
          new TableRow({
            children: fases.map((fase) =>
              tc(
                [
                  p(fase.titulo, { bold: true, size: 9, color: WHITE }),
                  p(`${fase.duracionMinutos} min`, { size: 7, color: WHITE }),
                ],
                colW,
                { bg: ERCA_COLORS[fase.titulo] || COLOR_PRIMARY }
              )
            ),
          }),
          new TableRow({
            children: fases.map((fase) =>
              tc(
                fase.actividades.map((act) => p(`• ${act.texto}`, { size: 7 })),
                colW
              )
            ),
          }),
        ],
        TW,
        colWidths
      )
    );
  }

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 5. Evaluación ──
  children.push(makeTable([sectionRow("EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Técnica:", { bold: true, size: 8 }), p(plan.tecnicaEvaluacion || "—", { size: 8 })], TW * 0.35),
            tc([p("Instrumento:", { bold: true, size: 8 }), p(plan.instrumentoEvaluacion || "—", { size: 8 })], TW * 0.35),
            tc([p("Actividades:", { bold: true, size: 8 }), p(plan.actividadesEvaluacion || "—", { size: 8 })], TW * 0.3),
          ],
        }),
      ],
      TW,
      [TW * 0.35, TW * 0.35, TW * 0.3]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 6. Recursos ──
  if (plan.recursos) {
    children.push(makeTable([sectionRow("RECURSOS")], TW, [TW]));
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p(plan.recursos, { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
    children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  }

  // ── 7. Firmas ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("________________________", { size: 8 }), p("Docente", { size: 7, align: "center" })], TW * 0.33),
            tc([p("________________________", { size: 8 }), p("Coordinador", { size: 7, align: "center" })], TW * 0.33),
            tc([p("________________________", { size: 8 }), p("Director", { size: 7, align: "center" })], TW * 0.34),
          ],
        }),
      ],
      TW,
      [TW * 0.33, TW * 0.33, TW * 0.34]
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
