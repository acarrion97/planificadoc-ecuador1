/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia EGB/BGU — A4 LANDSCAPE
 *
 * Estructura (según formato oficial MINEDUC):
 * 1. Encabezado (Unidad Educativa / Año lectivo)
 * 2. Título: Planificación microcurricular
 * 3. Datos Informativos
 * 4. Situación de aprendizaje (Título + Descripción)
 * 5. Conexión interdisciplinar (Asignaturas)
 * 6. Competencias específicas + Indicadores de evaluación (Saberes)
 * 7. Estrategias metodológicas desde el DUA + Recursos
 * 8. Técnicas e instrumentos de evaluación
 * 9. Semanas 1-8 (inicio/desarrollo/cierre + Técnica + Instrumento)
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
            tc([p(`Asignatura: ${plan.asignatura || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Grado/Curso: ${plan.grado || "—"}`, { size: 8 })], TW * 0.15),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.1),
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], TW * 0.15),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`No. de semanas: ${plan.estructuraDidactica?.fases?.length || 8}`, { size: 8 })], TW * 0.5),
            tc([p(`Nivel: ${plan.nivel || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Fecha: ${plan.fecha || "—"}`, { size: 8 })], TW * 0.25),
          ],
        }),
      ],
      TW,
      [TW * 0.35, TW * 0.25, TW * 0.15, TW * 0.1, TW * 0.15]
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
            tc([p("Título:", { bold: true, size: 8 }), p(plan.objetivoAprendizaje || "—", { size: 8 })], TW * 0.3),
            tc([p("Descripción:", { bold: true, size: 8 }), p(plan.destreza?.descripcion || "—", { size: 8 })], TW * 0.7),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.7]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 5. Conexión interdisciplinar ──
  children.push(makeTable([sectionRow("CONEXIÓN INTERDISCIPLINAR")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Asignaturas:", { bold: true, size: 8 }), p(plan.asignatura || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 6. Competencias específicas + Indicadores ──
  children.push(makeTable([sectionRow("COMPETENCIAS ESPECÍFICAS E INDICADORES DE EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
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
            tc([p("Indicador:", { bold: true, size: 8 }), p(plan.indicadorEvaluacion || "—", { size: 8 })], TW * 0.7),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.7]
    )
  );

  // Saberes
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Saberes:", { bold: true, size: 8 })], TW * 0.2),
            tc([p("Declarativos:", { bold: true, size: 8 }), p(plan.destreza?.descripcion || "—", { size: 7 })], TW * 0.27),
            tc([p("Procedimentales:", { bold: true, size: 8 }), p(plan.actividadesEvaluacion || "—", { size: 7 })], TW * 0.27),
            tc([p("Actitudinales:", { bold: true, size: 8 }), p(plan.tecnicaEvaluacion || "—", { size: 7 })], TW * 0.26),
          ],
        }),
      ],
      TW,
      [TW * 0.2, TW * 0.27, TW * 0.27, TW * 0.26]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 7. Estrategias metodológicas desde el DUA + Recursos ──
  children.push(makeTable([sectionRow("ESTRATEGIAS METODOLÓGICAS DESDE EL DUA Y RECURSOS")], TW, [TW]));
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

  // Recursos
  if (plan.recursos) {
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p("Recursos:", { bold: true, size: 8 }), p(plan.recursos, { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
  }

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 8. Técnicas e instrumentos de evaluación ──
  children.push(makeTable([sectionRow("TÉCNICAS E INSTRUMENTOS DE EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Técnica:", { bold: true, size: 8 }), p(plan.tecnicaEvaluacion || "—", { size: 8 })], TW * 0.5),
            tc([p("Instrumento:", { bold: true, size: 8 }), p(plan.instrumentoEvaluacion || "—", { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW * 0.5, TW * 0.5]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 9. Semanas 1-8 ──
  children.push(makeTable([sectionRow("DESARROLLO DE LA EXPERIENCIA DE APRENDIZAJE")], TW, [TW]));
  
  // Generar 8 semanas
  for (let semana = 1; semana <= 8; semana++) {
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p(`SEMANA ${semana}`, { bold: true, size: 9, color: COLOR_PRIMARY })], TW, { bg: COLOR_SECTION })] })],
        TW,
        [TW]
      )
    );

    // Inicio, Desarrollo, Cierre
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc([p("Sugerencias para el inicio:", { bold: true, size: 8 })], TW * 0.33),
              tc([p("Sugerencias para el desarrollo:", { bold: true, size: 8 })], TW * 0.34),
              tc([p("Sugerencias para el cierre:", { bold: true, size: 8 })], TW * 0.33),
            ],
          }),
          new TableRow({
            children: [
              tc([p("—", { size: 8 })], TW * 0.33),
              tc([p("—", { size: 8 })], TW * 0.34),
              tc([p("—", { size: 8 })], TW * 0.33),
            ],
          }),
        ],
        TW,
        [TW * 0.33, TW * 0.34, TW * 0.33]
      )
    );

    // Técnica e Instrumento
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc([p("Técnica:", { bold: true, size: 8 }), p(plan.tecnicaEvaluacion || "—", { size: 8 })], TW * 0.5),
              tc([p("Instrumento:", { bold: true, size: 8 }), p(plan.instrumentoEvaluacion || "—", { size: 8 })], TW * 0.5),
            ],
          }),
        ],
        TW,
        [TW * 0.5, TW * 0.5]
      )
    );

    children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
  }

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
