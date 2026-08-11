/**
 * Genera el documento Word (.docx) "Plan de Unidad de Trabajo" para
 * Bachillerato Técnico (BT) — formato institucional (A4 vertical), replicando
 * la estructura del Excel oficial: Datos de referencia, Desarrollo de la
 * Unidad de Trabajo, Adaptaciones Curriculares, Bibliografía/Webgrafía y
 * firmas Elaborado/Revisado/Aprobado.
 *
 * Módulo intencionalmente independiente de lib/semanal-word-generator.ts y
 * lib/adaptacion-word-generator.ts (duplica sus pequeños helpers de estilo,
 * que no están exportados) — parte del aislamiento del sistema BT respecto
 * al flujo EGB/BGU existente.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType, VerticalAlign,
} from "docx";
import type { PlanUnidadTrabajoBT } from "../data/types-bt";

const WHITE = "FFFFFF";
const BLACK = "000000";
const BG_TITLE = "003366";
const BG_SECTION = "1A3A5C";
const BG_SUBHEAD = "EAF4F6";

const BORDER_DEF = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

function shade(color: string) {
  return { fill: color, color, type: ShadingType.CLEAR };
}

function simpleCell(
  text: string,
  opts: {
    bold?: boolean; italic?: boolean; size?: number;
    color?: string; bg?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    colspan?: number; rowspan?: number;
  } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    rowSpan: opts.rowspan,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.bg ? shade(opts.bg) : undefined,
    borders: BORDER_DEF,
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text || "—",
            bold: opts.bold ?? false,
            italics: opts.italic ?? false,
            size: (opts.size ?? 12) * 2,
            color: opts.color ?? BLACK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

/** Celda con múltiples párrafos (uno por línea de `lines`) */
function multiLineCell(lines: string[], opts: { size?: number; color?: string } = {}): TableCell {
  return new TableCell({
    verticalAlign: VerticalAlign.TOP,
    borders: BORDER_DEF,
    children: (lines.length ? lines : ["—"]).map(
      (line) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: line, size: (opts.size ?? 11) * 2, color: opts.color ?? BLACK, font: "Arial" })],
        })
    ),
  });
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    shading: shade(BG_SECTION),
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: label, bold: true, size: 24, color: WHITE, font: "Arial" })],
  });
}

function labelValueRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label, { bold: true, size: 11, bg: BG_SUBHEAD, colspan: 1 }),
      simpleCell(value || "—", { size: 11, colspan: 3 }),
    ],
  });
}

export async function generarWordPlanBT(plan: PlanUnidadTrabajoBT): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // ── Título ──
  children.push(
    new Paragraph({
      shading: shade(BG_TITLE),
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "PLAN DE UNIDAD DE TRABAJO", bold: true, size: 30, color: WHITE, font: "Arial" }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Bachillerato Técnico", size: 20, color: "555555", italics: true, font: "Arial" }),
      ],
    })
  );

  // ── 1.- DATOS DE REFERENCIA ──
  children.push(sectionHeading("1.- DATOS DE REFERENCIA"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        labelValueRow("Figura profesional", plan.institucion ? `${plan.nombreModuloFormativo}` : plan.nombreModuloFormativo),
        labelValueRow("Institución educativa", plan.institucion),
        labelValueRow("Docente", plan.docente),
        labelValueRow("Curso / Paralelo", `${plan.curso || "—"} / ${plan.paralelo || "—"}`),
        labelValueRow("Año lectivo", plan.anioLectivo),
        labelValueRow("Módulo formativo", plan.nombreModuloFormativo),
        labelValueRow("Objetivo del módulo", plan.objetivoModuloFormativo),
        labelValueRow("Unidad de Trabajo", `N.° ${plan.unidadTrabajo.numero} — ${plan.unidadTrabajo.nombre}`),
        labelValueRow("Horas pedagógicas", String(plan.unidadTrabajo.tiempoEstimadoPeriodos || plan.horasPedagogicas || "—")),
      ],
    })
  );

  // ── 2.- DESARROLLO DE LA UNIDAD DE TRABAJO ──
  children.push(sectionHeading("2.- DESARROLLO DE LA UNIDAD DE TRABAJO"));

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      simpleCell("N.°", { bold: true, color: WHITE, bg: BG_SECTION, size: 10, align: AlignmentType.CENTER }),
      simpleCell("Nombre", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Objetivo", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Tiempo", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Secuencia de la actividad", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Recursos", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Criterios", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      simpleCell("Técnica / Instrumento", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
    ],
  });

  const procRows = plan.unidadTrabajo.procedimientos.map((p, i) => {
    const criteriosTexto = plan.procedimientoCriterioEvaluacion
      .filter((pc) => pc.procedimientoId === p.id)
      .map((pc) => pc.criterioEvaluacionId)
      .join(", ");
    const secuencia = p.fases.map((f) => `${f.nombre}: ${f.descripcion}`);
    return new TableRow({
      children: [
        simpleCell(String(i + 1), { size: 10, align: AlignmentType.CENTER }),
        simpleCell(p.nombre, { size: 10, bold: true }),
        simpleCell(p.objetivo, { size: 10 }),
        simpleCell(p.tiempo, { size: 10 }),
        multiLineCell(secuencia, { size: 9 }),
        multiLineCell(p.recursos, { size: 9 }),
        simpleCell(criteriosTexto || "—", { size: 9 }),
        simpleCell(`${p.evaluacion.tecnica}\n${p.evaluacion.instrumento}`, { size: 9 }),
      ],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...procRows],
    })
  );

  // Contenidos + estrategias metodológicas
  children.push(
    new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Contenidos", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
  );
  const { conceptuales, procedimentales, actitudinales } = plan.unidadTrabajo.contenidos;
  for (const [label, items] of [
    ["Conceptuales", conceptuales],
    ["Procedimentales", procedimentales],
    ["Actitudinales", actitudinales],
  ] as const) {
    if (!items.length) continue;
    children.push(
      new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial" })] })
    );
    for (const item of items) {
      children.push(
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: item, size: 20, font: "Arial" })] })
      );
    }
  }
  if (plan.unidadTrabajo.estrategiasMetodologicas.length) {
    children.push(
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Estrategias metodológicas", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
    );
    for (const e of plan.unidadTrabajo.estrategiasMetodologicas) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: e.nombre, bold: true, size: 20, font: "Arial" }),
            ...(e.descripcion ? [new TextRun({ text: `: ${e.descripcion}`, size: 20, font: "Arial" })] : []),
          ],
        })
      );
    }
  }

  // ── 3.- ADAPTACIONES CURRICULARES ──
  children.push(sectionHeading("3.- ADAPTACIONES CURRICULARES"));
  if (plan.adaptacionesCurriculares?.length) {
    for (const adap of plan.adaptacionesCurriculares) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                simpleCell("Especificación de la necesidad educativa atendida", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
                simpleCell("Especificación de la adaptación aplicada", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
              ],
            }),
            new TableRow({
              children: [
                simpleCell(`${adap.categoriaNecesidad}${adap.descripcionNecesidad ? " — " + adap.descripcionNecesidad : ""}`, { size: 10 }),
                multiLineCell(adap.adaptacionesAcceso?.map((a) => `${a.categoria}: ${a.descripcion}`) || [], { size: 9 }),
              ],
            }),
          ],
        })
      );
    }
  } else {
    children.push(
      new Paragraph({ children: [new TextRun({ text: "No se registraron adaptaciones curriculares para esta unidad.", italics: true, size: 20, color: "666666", font: "Arial" })] })
    );
  }

  // ── 4.- BIBLIOGRAFÍA/WEBGRAFÍA ──
  children.push(sectionHeading("4.- BIBLIOGRAFÍA/WEBGRAFÍA"));
  if (plan.bibliografiaWebgrafia?.length) {
    for (const ref of plan.bibliografiaWebgrafia) {
      children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: ref, size: 20, font: "Arial" })] }));
    }
  } else {
    children.push(
      new Paragraph({ children: [new TextRun({ text: "—", size: 20, color: "666666", font: "Arial" })] })
    );
  }

  // ── Firmas ──
  const firmaCell = (label: string, nombre?: string) =>
    new TableCell({
      borders: BORDER_DEF,
      verticalAlign: VerticalAlign.TOP,
      children: [
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial" })] }),
        new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: `Nombre: ${nombre || "________________________"}`, size: 18, font: "Arial" })] }),
        new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "Firma: ________________________", size: 18, font: "Arial" })] }),
        new Paragraph({ children: [new TextRun({ text: "Fecha: ________________________", size: 18, font: "Arial" })] }),
      ],
    });

  children.push(
    new Paragraph({ spacing: { before: 260 }, children: [] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            firmaCell("ELABORADO POR (Docente)", plan.elaboradoPor?.nombre || plan.docente),
            firmaCell("REVISADO POR", plan.revisadoPor?.nombre),
            firmaCell("APROBADO POR", plan.aprobadoPor?.nombre),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
