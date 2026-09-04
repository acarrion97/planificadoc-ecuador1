/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia Inicial/Preparatoria — A4 LANDSCAPE
 *
 * Estructura:
 * 1. Título / Datos generales
 * 2. Por cada ámbito: competencia, destrezas
 * 3. Por cada clase: INICIO / DESARROLLO / CIERRE + DUA
 * 4. NEE (si aplica)
 * 5. Bibliografía
 * 6. Firmas (4)
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

  // ── 1. Título / Datos generales ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "INSTITUCIÓN", { bold: true, size: 10 })], TW * 0.6, { bg: COLOR_HEADER }),
            tc([p(`Grado: ${plan.grado || "—"}`, { size: 9 })], TW * 0.4, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [TW * 0.6, TW * 0.4]
    )
  );

  children.push(new Paragraph({ spacing: { after: 60 }, children: [] }));

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW * 0.4),
            tc([p(`Duración: ${plan.duracion || "—"}`, { size: 8 })], TW * 0.3),
            tc([p(`Estado: ${plan.status || "—"}`, { size: 8 })], TW * 0.3),
          ],
        }),
      ],
      TW,
      [TW * 0.4, TW * 0.3, TW * 0.3]
    )
  );

  children.push(new Paragraph({ spacing: { after: 60 }, children: [] }));

  // ── 2. Objetivo General ──
  children.push(makeTable([sectionRow("OBJETIVO GENERAL")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p(plan.objetivoGeneral || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  children.push(new Paragraph({ spacing: { after: 60 }, children: [] }));

  // ── 3. Ámbitos de Desarrollo ──
  for (const ambito of plan.ambitos) {
    children.push(makeTable([sectionRow(`ÁMBITO: ${ambito.ambito.toUpperCase()}`)], TW, [TW]));

    // Competencia del ámbito
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc([p("Competencia:", { bold: true, size: 8 }), p(`${ambito.competenciaCodigo} — ${ambito.competenciaDescripcion}`, { size: 8 })], TW * 0.5),
              tc([
                p("Transversales:", { bold: true, size: 8 }),
                new Paragraph({
                  spacing: { after: 0, before: 40 },
                  children: ambito.competenciasTransversales.map((c) => competencyBadge(c)),
                }),
              ], TW * 0.5),
            ],
          }),
        ],
        TW,
        [TW * 0.5, TW * 0.5]
      )
    );

    children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));

    // Destrezas
    if (ambito.destrezas.length > 0) {
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc(
                  [p("Destrezas:", { bold: true, size: 8 }), ...ambito.destrezas.map((d) => p(`• ${d}`, { size: 7 }))],
                  TW
                ),
              ],
            }),
          ],
          TW,
          [TW]
        )
      );
      children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
    }

    // Clases
    for (const clase of ambito.clases) {
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc([p(`Clase ${clase.numero}: ${clase.tema}`, { bold: true, size: 9 })], TW * 0.6),
                tc([p(`Metodología: ${clase.metodologia || "—"}`, { size: 8 })], TW * 0.4),
              ],
            }),
          ],
          TW,
          [TW * 0.6, TW * 0.4]
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
                    new Paragraph({
                      spacing: { after: 0, before: 20 },
                      children: [competencyBadge(act.competencia)],
                    }),
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

      // Evaluación de la clase
      if (clase.metodoEvaluacion.length > 0) {
        children.push(
          makeTable(
            [
              new TableRow({
                children: [
                  tc(
                    [
                      p("Evaluación:", { bold: true, size: 7 }),
                      p(clase.metodoEvaluacion.join(" · "), { size: 7 }),
                    ],
                    TW
                  ),
                ],
              }),
            ],
            TW,
            [TW]
          )
        );
      }

      children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
    }
  }

  // ── 4. NEE ──
  if (plan.adaptacionesNEE && plan.adaptacionesNEE.length > 0) {
    children.push(makeTable([sectionRow("NECESIDADES EDUCATIVAS ESPECIALES")], TW, [TW]));
    for (const nee of plan.adaptacionesNEE) {
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc([p(`Grado ${nee.grado}:`, { bold: true, size: 8 }), p(nee.necesidadEducativa, { size: 7 })], TW * 0.25),
                tc([p("Adaptación DCD:", { bold: true, size: 7 }), p(nee.adaptacionDCD, { size: 7 })], TW * 0.25),
                tc([p("Estrategias:", { bold: true, size: 7 }), p(nee.adaptacionEstrategias, { size: 7 })], TW * 0.25),
                tc([p("Recursos:", { bold: true, size: 7 }), p(nee.adaptacionRecursos, { size: 7 })], TW * 0.25),
              ],
            }),
          ],
          TW,
          [TW * 0.25, TW * 0.25, TW * 0.25, TW * 0.25]
        )
      );
    }
    children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  }

  // ── 5. Bibliografía ──
  if (plan.bibliografia) {
    children.push(makeTable([sectionRow("BIBLIOGRAFÍA")], TW, [TW]));
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p(plan.bibliografia, { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
    children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  }

  // ── 6. Observaciones ──
  if (plan.observaciones) {
    children.push(makeTable([sectionRow("OBSERVACIONES")], TW, [TW]));
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p(plan.observaciones, { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
    children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  }

  // ── 7. Firmas (4) ──
  const firmas = plan.firmas;
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p("________________________", { size: 8 }),
                p(firmas?.elaborado || "Elaborado", { size: 7, align: "center" }),
              ],
              TW * 0.25
            ),
            tc(
              [
                p("________________________", { size: 8 }),
                p(firmas?.revisado || "Revisado", { size: 7, align: "center" }),
              ],
              TW * 0.25
            ),
            tc(
              [
                p("________________________", { size: 8 }),
                p(firmas?.coordinador || "Coordinador", { size: 7, align: "center" }),
              ],
              TW * 0.25
            ),
            tc(
              [
                p("________________________", { size: 8 }),
                p(firmas?.aprobado || "Aprobado", { size: 7, align: "center" }),
              ],
              TW * 0.25
            ),
          ],
        }),
      ],
      TW,
      [TW * 0.25, TW * 0.25, TW * 0.25, TW * 0.25]
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
