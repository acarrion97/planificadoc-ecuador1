/**
 * Genera el documento Word (.docx) del plan "Conecta, Nivela y Crea" (CNC) —
 * las 5 semanas de arranque del año escolar (Semana 1 Conecta, Semanas 2-3
 * Nivela, Semanas 4-5 Crea), en modalidad general (EGB/BGU) o Bachillerato
 * Técnico.
 *
 * Estructura y paleta replican intencionalmente lib/semanal-word-generator.ts:
 * UNA sola tabla continua (título colspan → "DATOS INFORMATIVOS" colspan →
 * filas etiqueta/valor pareadas → filas de sección colspan por cada semana →
 * tablas de detalle), banda de título azul marino (#003366), filas de sección
 * celeste (#DDEFF1) con texto azul oscuro, cabeceras de columna azul oscuro
 * (#1A3A5C) con texto blanco, celdas de etiqueta celeste claro (#EAF4F6) —
 * para que el documento se vea consistente con el formato institucional
 * MinEduc que ya usan los docentes en la planificación semanal.
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
// Paleta institucional MinEduc — igual a lib/semanal-word-generator.ts
const BG_TITLE = "003366";
const BG_COLHEAD = "1A3A5C";
const BG_SECTION = "DDEFF1";
const BG_SUBHEAD = "EAF4F6";
const TEXT_SECTION = "1A3A5C";
const SUBTITLE_COLOR = "A8C4E0";
const BG_EVAL_OFICIAL = "DC2626";

const NUM_COLS = 4;

const BORDER_DEF = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

function shade(color: string) {
  return { fill: color, color, type: ShadingType.CLEAR };
}

/** Celda simple con un único TextRun */
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

/** Celda con múltiples párrafos (uno por línea de `lines`), opcionalmente con viñetas */
function multiLineCell(lines: string[], opts: { size?: number; color?: string; bullet?: boolean; colspan?: number } = {}): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    verticalAlign: VerticalAlign.TOP,
    borders: BORDER_DEF,
    children: (lines.length ? lines : ["—"]).map(
      (line) =>
        new Paragraph({
          bullet: opts.bullet ? { level: 0 } : undefined,
          spacing: { after: 40 },
          children: [new TextRun({ text: line, size: (opts.size ?? 9) * 2, color: opts.color ?? BLACK, font: "Arial" })],
        })
    ),
  });
}

/** Fila de sección — banda celeste con texto azul marino, ocupa todas las columnas */
function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [simpleCell(label, { bold: true, size: 9, bg: BG_SECTION, color: TEXT_SECTION, colspan: NUM_COLS })],
  });
}

/** Fila con dos pares etiqueta/valor, igual que las filas de "DATOS INFORMATIVOS" de la planificación semanal */
function dosLabelValueRow(label1: string, value1: string, label2: string, value2: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(value1 || "—", { size: 8 }),
      simpleCell(label2, { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(value2 || "—", { size: 8 }),
    ],
  });
}

/** Fila con un único par etiqueta/valor ocupando el resto de columnas */
function labelValueRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label, { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(value || "—", { size: 8, colspan: NUM_COLS - 1 }),
    ],
  });
}

/** Fila de subtítulo dentro de una sección (etiqueta en cursiva azul, ocupa todas las columnas) */
function subHeadingRow(text: string): TableRow {
  return new TableRow({
    children: [simpleCell(text, { bold: true, italic: true, size: 9, color: BG_TITLE, colspan: NUM_COLS })],
  });
}

/** Fila con lista de viñetas ocupando todas las columnas */
function bulletsRow(lines: string[]): TableRow {
  return new TableRow({ children: [multiLineCell(lines, { bullet: true, colspan: NUM_COLS })] });
}

/** Fila de cabecera de tabla de detalle (fondo azul oscuro, texto blanco) */
function headerRow(labels: string[]): TableRow {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l) => simpleCell(l, { bold: true, color: WHITE, bg: BG_COLHEAD, size: 8 })),
  });
}

export async function generarWordPlanCNC(plan: PlanConectaNivelaCrea): Promise<Blob> {
  const esBT = plan.modalidad === "bt";
  const rows: TableRow[] = [];

  // ══════════════════════════════════════════════════════════════
  // CABECERA PRINCIPAL
  // ══════════════════════════════════════════════════════════════
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: NUM_COLS,
        shading: shade(BG_TITLE),
        borders: BORDER_DEF,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "CONECTA, NIVELA Y CREA", bold: true, size: 24, color: WHITE, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: esBT ? "Arranque del año escolar — Bachillerato Técnico" : "Arranque del año escolar — 5 semanas",
              size: 16, color: SUBTITLE_COLOR, font: "Arial",
            })],
          }),
        ],
      }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════
  // DATOS INFORMATIVOS
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("DATOS INFORMATIVOS"));
  rows.push(dosLabelValueRow("Institución:", plan.institucion, "Docente:", plan.docente));
  rows.push(dosLabelValueRow("Grado / Paralelo:", `${plan.grado || "—"} / ${plan.paralelo || "—"}`, "Año lectivo:", plan.anioLectivo));
  rows.push(dosLabelValueRow(
    "Modalidad:", esBT ? "Bachillerato Técnico" : "General (EGB/BGU)",
    "Módulo:", esBT ? (plan.moduloId || "—") : "—",
  ));

  // ══════════════════════════════════════════════════════════════
  // SEMANA 1 — CONECTA
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("SEMANA 1 — CONECTA"));
  rows.push(subHeadingRow("Actividades de adaptación"));
  rows.push(bulletsRow(plan.semana1.actividadesAdaptacion.filter(Boolean)));

  rows.push(subHeadingRow("Diagnóstico académico (Lengua y Matemática)"));
  if (plan.semana1.diagnosticoAcademico.length) {
    rows.push(headerRow(["Área", "Destreza", "Destreza", "Nivel detectado"]));
    for (const d of plan.semana1.diagnosticoAcademico) {
      rows.push(new TableRow({
        children: [
          simpleCell(d.area, { size: 8 }),
          simpleCell(`${d.destrezaCodigo}: ${d.destrezaDescripcion}`, { size: 8, colspan: 2 }),
          simpleCell(d.nivelDetectado, { size: 8 }),
        ],
      }));
    }
  } else {
    rows.push(bulletsRow([]));
  }

  if (esBT && plan.semana1BT) {
    rows.push(subHeadingRow("Reconocimiento de espacios técnicos"));
    rows.push(bulletsRow(plan.semana1BT.reconocimientoEspacios.filter(Boolean)));
    if (plan.semana1BT.diagnosticoTecnico.length) {
      rows.push(subHeadingRow("Diagnóstico técnico (criterios reales del módulo)"));
      rows.push(bulletsRow(plan.semana1BT.diagnosticoTecnico.map((d) => `${d.criterioTexto} — ${d.nivelDetectado}`)));
    }
  }

  rows.push(subHeadingRow("Diagnóstico socioemocional"));
  rows.push(bulletsRow(plan.semana1.diagnosticoSocioemocional.map((h) => `${h.habilidadId}${h.observaciones ? " — " + h.observaciones : ""}`)));

  rows.push(labelValueRow("Coordinación DECE:", plan.semana1.coordinacionDece));

  if (plan.semana1.tecnicasReflexion.filter(Boolean).length) {
    rows.push(subHeadingRow("Técnicas de reflexión"));
    rows.push(bulletsRow(plan.semana1.tecnicasReflexion.filter(Boolean)));
  }

  // ══════════════════════════════════════════════════════════════
  // SEMANAS 2-3 — NIVELA
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("SEMANAS 2-3 — NIVELA"));
  if (plan.semana2y3.actividadesNivelacion.length) {
    rows.push(headerRow(["Área", "Destreza", "Actividad", "Semana"]));
    for (const a of plan.semana2y3.actividadesNivelacion) {
      rows.push(new TableRow({
        children: [
          simpleCell(a.area, { size: 8 }),
          simpleCell(`${a.destrezaCodigo}: ${a.destrezaDescripcion}`, { size: 8 }),
          simpleCell(a.descripcionActividad || "—", { size: 8 }),
          simpleCell(String(a.semana), { size: 8, align: AlignmentType.CENTER }),
        ],
      }));
    }
  } else {
    rows.push(bulletsRow([]));
  }

  if (esBT && plan.semana2y3BT?.actividadesNivelacionTecnica.length) {
    rows.push(subHeadingRow("Nivelación técnica"));
    rows.push(headerRow(["Criterio técnico", "Criterio técnico", "Actividad", "Articulación con Matemática"]));
    for (const a of plan.semana2y3BT.actividadesNivelacionTecnica) {
      rows.push(new TableRow({
        children: [
          simpleCell(a.criterioTexto, { size: 8, colspan: 2 }),
          simpleCell(a.descripcionActividad || "—", { size: 8 }),
          simpleCell(a.articulacionMatematica || "—", { size: 8 }),
        ],
      }));
    }
  }

  rows.push(subHeadingRow("Parejas de conivelación (tutoría entre pares)"));
  if (plan.semana2y3.parejasConivelacion.length) {
    rows.push(headerRow(["Apoya", "Apoyado", "Destreza foco", "Destreza foco"]));
    for (const p of plan.semana2y3.parejasConivelacion) {
      rows.push(new TableRow({
        children: [
          simpleCell(p.estudianteApoyoNombre, { size: 8 }),
          simpleCell(p.estudianteApoyadoNombre, { size: 8 }),
          simpleCell(p.destrezaFocoDescripcion, { size: 8, colspan: 2 }),
        ],
      }));
    }
  } else {
    rows.push(bulletsRow([]));
  }

  // ══════════════════════════════════════════════════════════════
  // SEMANAS 4-5 — CREA
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("SEMANAS 4-5 — CREA"));
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: NUM_COLS,
        shading: shade(BG_EVAL_OFICIAL),
        borders: BORDER_DEF,
        children: [new Paragraph({
          children: [new TextRun({ text: "ESTE PROYECTO CONSTITUYE UNA EVALUACIÓN CUALITATIVA FORMATIVA OFICIAL", bold: true, size: 18, color: WHITE, font: "Arial" })],
        })],
      }),
    ],
  }));

  if (esBT && plan.semana4y5BT) {
    const p = plan.semana4y5BT.productoAcreditable;
    rows.push(labelValueRow("Tipo de producto acreditable:", p.tipo.replace(/_/g, " ")));
    rows.push(labelValueRow("Descripción:", p.descripcion));
  } else {
    const p = plan.semana4y5.proyecto;
    rows.push(labelValueRow("Título:", p.titulo));
    rows.push(labelValueRow("Áreas integradas:", p.areasIntegradas.join(", ") || "—"));
    rows.push(labelValueRow("Descripción:", p.descripcion));
    if (p.evidenciasCognitivas.length) {
      rows.push(subHeadingRow("Evidencias cognitivas"));
      rows.push(bulletsRow(p.evidenciasCognitivas));
    }
    if (p.evidenciasActitudinales.length) {
      rows.push(subHeadingRow("Evidencias actitudinales"));
      rows.push(bulletsRow(p.evidenciasActitudinales));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}
