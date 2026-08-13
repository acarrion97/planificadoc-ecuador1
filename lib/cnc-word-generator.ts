/**
 * Genera el documento Word (.docx) del plan "Conecta, Nivela y Crea" (CNC) —
 * las 5 semanas de arranque del año escolar (Semana 1 Conecta, Semanas 2-3
 * Nivela, Semanas 4-5 Crea), en modalidad general (EGB/BGU) o Bachillerato
 * Técnico.
 *
 * Módulo intencionalmente independiente de lib/semanal-word-generator.ts,
 * lib/adaptacion-word-generator.ts y lib/bt-word-generator.ts (duplica sus
 * pequeños helpers de estilo, que no están exportados) — parte del
 * aislamiento del módulo CNC respecto a los flujos existentes.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType, VerticalAlign,
} from "docx";
import type { PlanConectaNivelaCrea } from "../data/types-cnc";

const WHITE = "FFFFFF";
const BLACK = "000000";
const BG_TITLE = "0F766E";
const BG_SECTION = "115E59";
const BG_SUBHEAD = "ECFDF5";
const BG_EVAL_OFICIAL = "DC2626";

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
    colspan?: number;
  } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
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

export async function generarWordPlanCNC(plan: PlanConectaNivelaCrea): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const esBT = plan.modalidad === "bt";

  // ── Título ──
  children.push(
    new Paragraph({
      shading: shade(BG_TITLE),
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "CONECTA, NIVELA Y CREA", bold: true, size: 30, color: WHITE, font: "Arial" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: esBT ? "Arranque del año escolar — Bachillerato Técnico" : "Arranque del año escolar — 5 semanas",
          size: 20, color: "555555", italics: true, font: "Arial",
        }),
      ],
    })
  );

  // ── I. IDENTIFICACIÓN ──
  children.push(sectionHeading("I. IDENTIFICACIÓN"));
  const filasId = [
    labelValueRow("Institución educativa", plan.institucion),
    labelValueRow("Docente", plan.docente),
    labelValueRow("Grado / Paralelo", `${plan.grado || "—"} / ${plan.paralelo || "—"}`),
    labelValueRow("Año lectivo", plan.anioLectivo),
    labelValueRow("Modalidad", esBT ? "Bachillerato Técnico" : "General (EGB/BGU)"),
  ];
  if (esBT) {
    filasId.push(labelValueRow("Módulo", plan.moduloId || "—"));
  }
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: filasId }));

  // ── II. SEMANA 1 — CONECTA ──
  children.push(sectionHeading("II. SEMANA 1 — CONECTA"));
  children.push(
    new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "Actividades de adaptación", bold: true, size: 20, font: "Arial" })] })
  );
  for (const a of plan.semana1.actividadesAdaptacion.filter(Boolean)) {
    children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: a, size: 20, font: "Arial" })] }));
  }

  children.push(
    new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Diagnóstico académico (Lengua y Matemática)", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
  );
  if (plan.semana1.diagnosticoAcademico.length) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Área", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Destreza", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Nivel detectado", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      ],
    });
    const rows = plan.semana1.diagnosticoAcademico.map((d) => new TableRow({
      children: [
        simpleCell(d.area, { size: 10 }),
        simpleCell(`${d.destrezaCodigo}: ${d.destrezaDescripcion}`, { size: 10 }),
        simpleCell(d.nivelDetectado, { size: 10 }),
      ],
    }));
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] }));
  }

  if (esBT && plan.semana1BT) {
    children.push(
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Reconocimiento de espacios técnicos", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
    );
    for (const e of plan.semana1BT.reconocimientoEspacios.filter(Boolean)) {
      children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: e, size: 20, font: "Arial" })] }));
    }
    if (plan.semana1BT.diagnosticoTecnico.length) {
      children.push(
        new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "Diagnóstico técnico (criterios reales del módulo)", bold: true, size: 20, font: "Arial" })] })
      );
      for (const d of plan.semana1BT.diagnosticoTecnico) {
        children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `${d.criterioTexto} — ${d.nivelDetectado}`, size: 20, font: "Arial" })] }));
      }
    }
  }

  children.push(
    new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Diagnóstico socioemocional", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
  );
  for (const h of plan.semana1.diagnosticoSocioemocional) {
    children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `${h.habilidadId}${h.observaciones ? " — " + h.observaciones : ""}`, size: 20, font: "Arial" })] }));
  }
  children.push(
    new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Coordinación DECE: ", bold: true, size: 20, font: "Arial" }), new TextRun({ text: plan.semana1.coordinacionDece || "—", size: 20, font: "Arial" })] })
  );

  // ── III. SEMANAS 2-3 — NIVELA ──
  children.push(sectionHeading("III. SEMANAS 2-3 — NIVELA"));
  if (plan.semana2y3.actividadesNivelacion.length) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Área", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Destreza", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Actividad", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Semana", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      ],
    });
    const rows = plan.semana2y3.actividadesNivelacion.map((a) => new TableRow({
      children: [
        simpleCell(a.area, { size: 10 }),
        simpleCell(`${a.destrezaCodigo}: ${a.destrezaDescripcion}`, { size: 10 }),
        simpleCell(a.descripcionActividad || "—", { size: 10 }),
        simpleCell(String(a.semana), { size: 10, align: AlignmentType.CENTER }),
      ],
    }));
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] }));
  }

  if (esBT && plan.semana2y3BT?.actividadesNivelacionTecnica.length) {
    children.push(
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Nivelación técnica", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
    );
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Criterio técnico", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Actividad", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Articulación con Matemática", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      ],
    });
    const rows = plan.semana2y3BT.actividadesNivelacionTecnica.map((a) => new TableRow({
      children: [
        simpleCell(a.criterioTexto, { size: 10 }),
        simpleCell(a.descripcionActividad || "—", { size: 10 }),
        simpleCell(a.articulacionMatematica || "—", { size: 10 }),
      ],
    }));
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] }));
  }

  children.push(
    new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "Parejas de conivelación (tutoría entre pares)", bold: true, size: 22, color: BG_TITLE, font: "Arial" })] })
  );
  if (plan.semana2y3.parejasConivelacion.length) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Apoya", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Apoyado", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
        simpleCell("Destreza foco", { bold: true, color: WHITE, bg: BG_SECTION, size: 10 }),
      ],
    });
    const rows = plan.semana2y3.parejasConivelacion.map((p) => new TableRow({
      children: [
        simpleCell(p.estudianteApoyoNombre, { size: 10 }),
        simpleCell(p.estudianteApoyadoNombre, { size: 10 }),
        simpleCell(p.destrezaFocoDescripcion, { size: 10 }),
      ],
    }));
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] }));
  } else {
    children.push(new Paragraph({ children: [new TextRun({ text: "—", size: 20, color: "666666", font: "Arial" })] }));
  }

  // ── IV. SEMANAS 4-5 — CREA ──
  children.push(sectionHeading("IV. SEMANAS 4-5 — CREA"));
  children.push(
    new Paragraph({
      shading: shade(BG_EVAL_OFICIAL),
      spacing: { before: 100, after: 120 },
      children: [new TextRun({ text: "ESTE PROYECTO CONSTITUYE UNA EVALUACIÓN CUALITATIVA FORMATIVA OFICIAL", bold: true, size: 20, color: WHITE, font: "Arial" })],
    })
  );

  if (esBT && plan.semana4y5BT) {
    const p = plan.semana4y5BT.productoAcreditable;
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          labelValueRow("Tipo de producto acreditable", p.tipo.replace(/_/g, " ")),
          labelValueRow("Descripción", p.descripcion),
        ],
      })
    );
  } else {
    const p = plan.semana4y5.proyecto;
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          labelValueRow("Título", p.titulo),
          labelValueRow("Áreas integradas", p.areasIntegradas.join(", ") || "—"),
        ],
      }),
      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "Descripción", bold: true, size: 20, font: "Arial" })] }),
      new Paragraph({ children: [new TextRun({ text: p.descripcion || "—", size: 20, font: "Arial" })] })
    );
    if (p.evidenciasCognitivas.length) {
      children.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "Evidencias cognitivas", bold: true, size: 20, font: "Arial" })] }));
      for (const e of p.evidenciasCognitivas) children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: e, size: 20, font: "Arial" })] }));
    }
    if (p.evidenciasActitudinales.length) {
      children.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "Evidencias actitudinales", bold: true, size: 20, font: "Arial" })] }));
      for (const e of p.evidenciasActitudinales) children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: e, size: 20, font: "Arial" })] }));
    }
  }

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
