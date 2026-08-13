/**
 * Genera el documento Word (.docx) del plan "Conecta, Nivela y Crea" (CNC) —
 * las 5 semanas de arranque del año escolar (Semana 1 Conecta, Semanas 2-3
 * Nivela, Semanas 4-5 Crea), en modalidad general (EGB/BGU) o Bachillerato
 * Técnico.
 *
 * Estructura replica intencionalmente lib/semanal-word-generator.ts: UNA sola
 * tabla continua de 6 columnas (título colspan → "DATOS INFORMATIVOS" colspan
 * → filas etiqueta/valor pareadas → "DESARROLLO SEMANAL POR DÍA" con las
 * mismas 6 cabeceras de columna — DÍA | DESTREZAS CON CRITERIOS DE DESEMPEÑO |
 * INDICADORES DE EVALUACIÓN | ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA
 * ENSEÑANZA Y APRENDIZAJE | RECURSOS | ACTIVIDADES EVALUATIVAS), mismo tamaño
 * de letra uniforme en todo el documento y texto en negrita negro (sin colores
 * de texto) — solo la banda de título y las cabeceras de columna/sección
 * conservan el fondo azul institucional, igual que en la planificación
 * semanal real.
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
const BG_EVAL_OFICIAL = "DC2626";

const NUM_COLS = 6;
// Tamaño de letra único para todo el contenido de la tabla (en puntos)
const FS = 8;

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaKey = typeof DIAS[number];
const DIA_LABEL: Record<DiaKey, string> = {
  lunes: "LUNES", martes: "MARTES", miercoles: "MIÉRCOLES", jueves: "JUEVES", viernes: "VIERNES",
};

const COLUMNAS_DIA = [
  "DÍA",
  "DESTREZAS CON CRITERIOS DE DESEMPEÑO",
  "INDICADORES DE EVALUACIÓN",
  "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE",
  "RECURSOS",
  "ACTIVIDADES EVALUATIVAS",
];

/** Distribuye una lista de items en 5 casilleros (lunes..viernes), agrupando por índice % 5 */
function agruparPorDia<T>(items: T[]): T[][] {
  const buckets: T[][] = [[], [], [], [], []];
  items.forEach((it, i) => buckets[i % 5].push(it));
  return buckets;
}

const BORDER_DEF = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

function shade(color: string) {
  return { fill: color, color, type: ShadingType.CLEAR };
}

/** Celda simple con un único TextRun — negrita/negro por defecto, sin colores de texto */
function simpleCell(
  text: string,
  opts: {
    bold?: boolean; bg?: string; textColor?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
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
            size: FS * 2,
            color: opts.textColor ?? BLACK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

/** Celda con múltiples párrafos (uno por línea de `lines`), opcionalmente con viñetas */
function multiLineCell(lines: string[], opts: { bullet?: boolean; colspan?: number; bold?: boolean } = {}): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    verticalAlign: VerticalAlign.TOP,
    borders: BORDER_DEF,
    children: (lines.length ? lines : ["—"]).map(
      (line) =>
        new Paragraph({
          bullet: opts.bullet ? { level: 0 } : undefined,
          spacing: { after: 40 },
          children: [new TextRun({ text: line, size: FS * 2, bold: opts.bold ?? false, color: BLACK, font: "Arial" })],
        })
    ),
  });
}

/** Fila de sección — banda celeste con texto negro en negrita, ocupa todas las columnas */
function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [simpleCell(label, { bold: true, bg: BG_SECTION, colspan: NUM_COLS })],
  });
}

/** Fila con dos pares etiqueta/valor, igual que las filas de "DATOS INFORMATIVOS" de la planificación semanal (colspan 1+2+1+2=6) */
function dosLabelValueRow(label1: string, value1: string, label2: string, value2: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label1, { bold: true, bg: BG_SUBHEAD }),
      simpleCell(value1 || "—", { colspan: 2 }),
      simpleCell(label2, { bold: true, bg: BG_SUBHEAD }),
      simpleCell(value2 || "—", { colspan: 2 }),
    ],
  });
}

/** Fila con un único par etiqueta/valor ocupando el resto de columnas */
function labelValueRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label, { bold: true, bg: BG_SUBHEAD }),
      simpleCell(value || "—", { colspan: NUM_COLS - 1 }),
    ],
  });
}

/** Fila de subtítulo dentro de una sección — negrita negro, ocupa todas las columnas */
function subHeadingRow(text: string): TableRow {
  return new TableRow({
    children: [simpleCell(text, { bold: true, colspan: NUM_COLS })],
  });
}

/** Fila con lista de viñetas ocupando todas las columnas */
function bulletsRow(lines: string[]): TableRow {
  return new TableRow({ children: [multiLineCell(lines, { bullet: true, colspan: NUM_COLS })] });
}

/** Fila de cabecera de tabla de detalle (fondo azul oscuro, texto blanco negrita) */
function headerRow(labels: string[]): TableRow {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l) => simpleCell(l, { bold: true, textColor: WHITE, bg: BG_COLHEAD })),
  });
}

/** Celda con el nombre del día — negrita negro, sin color de fondo por día */
function diaCell(dia: DiaKey): TableCell {
  return new TableCell({
    borders: BORDER_DEF,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: DIA_LABEL[dia], bold: true, size: FS * 2, color: BLACK, font: "Arial" })],
    })],
  });
}

/** Celda de contenido para una fila de día — una línea por item, "—" si está vacía */
function diaContentCell(lines: string[]): TableCell {
  return new TableCell({
    verticalAlign: VerticalAlign.TOP,
    borders: BORDER_DEF,
    children: (lines.length ? lines : ["—"]).map(
      (line) => new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: line, size: FS * 2, color: BLACK, font: "Arial" })] })
    ),
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
            children: [new TextRun({ text: "CONECTA, NIVELA Y CREA", bold: true, size: FS * 2 + 6, color: WHITE, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: esBT ? "Arranque del año escolar — Bachillerato Técnico" : "Arranque del año escolar — 5 semanas",
              size: FS * 2, color: WHITE, font: "Arial",
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
  rows.push(subHeadingRow("DESARROLLO SEMANAL POR DÍA"));
  rows.push(headerRow(COLUMNAS_DIA));
  {
    const actividadesPorDia = agruparPorDia(plan.semana1.actividadesAdaptacion.filter(Boolean));
    const diagnosticoPorDia = agruparPorDia(plan.semana1.diagnosticoAcademico);
    DIAS.forEach((dia, i) => {
      rows.push(new TableRow({
        children: [
          diaCell(dia),
          diaContentCell(diagnosticoPorDia[i].map((d) => `${d.destrezaCodigo}: ${d.destrezaDescripcion}`)),
          diaContentCell(diagnosticoPorDia[i].map((d) => d.nivelDetectado)),
          diaContentCell(actividadesPorDia[i]),
          diaContentCell([]),
          diaContentCell(["Diagnóstico dual (académico y socioemocional)"]),
        ],
      }));
    });
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
  rows.push(subHeadingRow("DESARROLLO SEMANAL POR DÍA"));
  rows.push(headerRow(COLUMNAS_DIA));
  for (const numSemana of [2, 3] as const) {
    rows.push(subHeadingRow(`Semana ${numSemana}`));
    const actividadesSemana = plan.semana2y3.actividadesNivelacion.filter((a) => a.semana === numSemana);
    const actividadesPorDia = agruparPorDia(actividadesSemana);
    // Reparte las parejas de conivelación entre ambas semanas por índice, solo para referencia visual del día
    const parejasSemana = agruparPorDia(
      plan.semana2y3.parejasConivelacion.filter((_, i) => (numSemana === 2 ? i % 2 === 0 : i % 2 === 1))
    );
    DIAS.forEach((dia, i) => {
      rows.push(new TableRow({
        children: [
          diaCell(dia),
          diaContentCell(actividadesPorDia[i].map((a) => `${a.destrezaCodigo}: ${a.destrezaDescripcion}`)),
          diaContentCell([]),
          diaContentCell(actividadesPorDia[i].map((a) => a.descripcionActividad || "—")),
          diaContentCell(parejasSemana[i].map((p) => `Conivelación: ${p.estudianteApoyoNombre || "—"} → ${p.estudianteApoyadoNombre || "—"} (${p.destrezaFocoDescripcion})`)),
          diaContentCell([]),
        ],
      }));
    });
  }

  if (esBT && plan.semana2y3BT?.actividadesNivelacionTecnica.length) {
    rows.push(subHeadingRow("Nivelación técnica"));
    rows.push(new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Criterio técnico", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
        simpleCell("Actividad", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
        simpleCell("Articulación con Matemática", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
      ],
    }));
    for (const a of plan.semana2y3BT.actividadesNivelacionTecnica) {
      rows.push(new TableRow({
        children: [
          simpleCell(a.criterioTexto, { colspan: 2 }),
          simpleCell(a.descripcionActividad || "—", { colspan: 2 }),
          simpleCell(a.articulacionMatematica || "—", { colspan: 2 }),
        ],
      }));
    }
  }

  rows.push(subHeadingRow("Parejas de conivelación (tutoría entre pares)"));
  if (plan.semana2y3.parejasConivelacion.length) {
    rows.push(new TableRow({
      tableHeader: true,
      children: [
        simpleCell("Apoya", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
        simpleCell("Apoyado", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
        simpleCell("Destreza foco", { bold: true, textColor: WHITE, bg: BG_COLHEAD, colspan: 2 }),
      ],
    }));
    for (const p of plan.semana2y3.parejasConivelacion) {
      rows.push(new TableRow({
        children: [
          simpleCell(p.estudianteApoyoNombre, { colspan: 2 }),
          simpleCell(p.estudianteApoyadoNombre, { colspan: 2 }),
          simpleCell(p.destrezaFocoDescripcion, { colspan: 2 }),
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
          children: [new TextRun({ text: "ESTE PROYECTO CONSTITUYE UNA EVALUACIÓN CUALITATIVA FORMATIVA OFICIAL", bold: true, size: FS * 2, color: WHITE, font: "Arial" })],
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
