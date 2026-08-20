/**
 * Genera el documento Word (.docx) del plan "Conecta, Nivela y Crea" (CNC) —
 * las 5 semanas de arranque del año escolar (Semana 1 Conecta, Semanas 2-3
 * Nivela, Semanas 4-5 Crea), en modalidad general (EGB/BGU) o Bachillerato
 * Técnico.
 *
 * Estructura replica intencionalmente lib/semanal-word-generator.ts: UNA sola
 * tabla continua de 6 columnas (título colspan → "DATOS INFORMATIVOS" colspan
 * → filas etiqueta/valor pareadas → filas de detalle por SEMANA con las
 * cabeceras SEMANA | DESTREZAS CON CRITERIOS DE DESEMPEÑO | INDICADORES DE
 * EVALUACIÓN | ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y
 * APRENDIZAJE | RECURSOS | ACTIVIDADES EVALUATIVAS), mismo tamaño de letra
 * uniforme en todo el documento y texto en negrita negro (sin colores de
 * texto) — solo la banda de título y las cabeceras de columna/sección
 * conservan el fondo azul institucional, igual que en la planificación
 * semanal real. Se agrupa por SEMANA (no por día) para no dejar casilleros
 * vacíos cuando hay pocas actividades registradas.
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
import { buscarPorCodigo } from "../data";

/** Indicadores de evaluación reales del catálogo curricular para una destreza (igual que semanal-word-generator) */
function indicadoresDe(codigo: string): string[] {
  return buscarPorCodigo(codigo)?.indicadoresEvaluacion ?? [];
}

/** Indicadores reales de una lista de destrezas — si una destreza no tiene indicadores en el catálogo, cae al nivel detectado */
function indicadoresParaDestrezas(items: { destrezaCodigo: string; nivelDetectado?: string }[]): string[] {
  const out: string[] = [];
  for (const it of items) {
    const ind = indicadoresDe(it.destrezaCodigo);
    if (ind.length) out.push(...ind);
    else if (it.nivelDetectado) out.push(`Nivel detectado: ${it.nivelDetectado}`);
  }
  return out;
}

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

const COLUMNAS_SEMANA = [
  "SEMANA",
  "DESTREZAS CON CRITERIOS DE DESEMPEÑO",
  "INDICADORES DE EVALUACIÓN",
  "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE",
  "RECURSOS",
  "ACTIVIDADES EVALUATIVAS",
];

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

/** Celda con el número de semana — negrita negro, centrada */
function semanaCell(label: string): TableCell {
  return new TableCell({
    borders: BORDER_DEF,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: label, bold: true, size: FS * 2, color: BLACK, font: "Arial" })],
    })],
  });
}

/** Celda de contenido para una fila de semana — una línea por item, "—" si está vacía */
function semanaContentCell(lines: string[]): TableCell {
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
  rows.push(headerRow(COLUMNAS_SEMANA));
  rows.push(new TableRow({
    children: [
      semanaCell("SEMANA 1"),
      semanaContentCell(plan.semana1.diagnosticoAcademico.map((d) => `${d.destrezaCodigo}: ${d.destrezaDescripcion}`)),
      semanaContentCell(indicadoresParaDestrezas(plan.semana1.diagnosticoAcademico)),
      semanaContentCell(plan.semana1.actividadesAdaptacion.filter(Boolean)),
      semanaContentCell(plan.aiResult?.recursosSemana1Sugeridos ?? []),
      semanaContentCell(["Diagnóstico dual (académico y socioemocional)"]),
    ],
  }));

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
  rows.push(headerRow(COLUMNAS_SEMANA));
  for (const numSemana of [2, 3] as const) {
    const actividadesSemana = plan.semana2y3.actividadesNivelacion.filter((a) => a.semana === numSemana);
    // Reparte las parejas de conivelación entre ambas semanas por índice
    const parejasSemana = plan.semana2y3.parejasConivelacion.filter(
      (_, i) => (numSemana === 2 ? i % 2 === 0 : i % 2 === 1)
    );
    rows.push(new TableRow({
      children: [
        semanaCell(`SEMANA ${numSemana}`),
        semanaContentCell(actividadesSemana.map((a) => `${a.destrezaCodigo}: ${a.destrezaDescripcion}`)),
        semanaContentCell(indicadoresParaDestrezas(actividadesSemana)),
        semanaContentCell(actividadesSemana.map((a) => a.descripcionActividad || "—")),
        semanaContentCell(parejasSemana.map((p) => `Conivelación: ${p.estudianteApoyoNombre || "—"} → ${p.estudianteApoyadoNombre || "—"} (${p.destrezaFocoDescripcion})`)),
        semanaContentCell(plan.aiResult?.actividadesEvaluativasNivelacionSugeridas ?? []),
      ],
    }));
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
          children: [new TextRun({ text: "ESTE PROYECTO INTERDISCIPLINARIO CORRESPONDE A LA EVALUACIÓN SUMATIVA DEL TRIMESTRE", bold: true, size: FS * 2, color: WHITE, font: "Arial" })],
        })],
      }),
    ],
  }));

  if (esBT && plan.semana4y5BT) {
    const p = plan.semana4y5BT.productoAcreditable;
    rows.push(labelValueRow("Tipo de producto acreditable:", p.tipo.replace(/_/g, " ")));
    rows.push(labelValueRow("Descripción:", p.descripcion));
    rows.push(headerRow(COLUMNAS_SEMANA));
    rows.push(new TableRow({
      children: [
        semanaCell("SEMANA 4"),
        semanaContentCell([p.tipo.replace(/_/g, " ")]),
        semanaContentCell([]),
        semanaContentCell(p.actividadesSemana4?.filter(Boolean).length ? p.actividadesSemana4.filter(Boolean) : ["Diseño y elaboración del producto acreditable"]),
        semanaContentCell(plan.semana1BT?.reconocimientoEspacios.filter(Boolean) ?? []),
        semanaContentCell(["Seguimiento formativo del proceso de elaboración"]),
      ],
    }));
    rows.push(new TableRow({
      children: [
        semanaCell("SEMANA 5"),
        semanaContentCell([p.tipo.replace(/_/g, " ")]),
        semanaContentCell([]),
        semanaContentCell(p.actividadesSemana5?.filter(Boolean).length ? p.actividadesSemana5.filter(Boolean) : ["Presentación del producto acreditable"]),
        semanaContentCell(plan.semana1BT?.reconocimientoEspacios.filter(Boolean) ?? []),
        semanaContentCell(["Evaluación sumativa del trimestre"]),
      ],
    }));
  } else {
    const p = plan.semana4y5.proyecto;
    rows.push(labelValueRow("Título:", p.titulo));
    rows.push(labelValueRow("Áreas integradas:", p.areasIntegradas.join(", ") || "—"));
    rows.push(labelValueRow("Descripción:", p.descripcion));
    rows.push(labelValueRow("Producto final:", p.productoFinal));
    rows.push(headerRow(COLUMNAS_SEMANA));
    rows.push(new TableRow({
      children: [
        semanaCell("SEMANA 4"),
        semanaContentCell(p.destrezasReforzadas),
        semanaContentCell(p.evidenciasCognitivas),
        semanaContentCell(p.actividadesSemana4?.filter(Boolean).length ? p.actividadesSemana4.filter(Boolean) : ["Diseño y desarrollo del proyecto interdisciplinario"]),
        semanaContentCell(p.areasIntegradas),
        semanaContentCell(["Seguimiento formativo del desarrollo del proyecto"]),
      ],
    }));
    rows.push(new TableRow({
      children: [
        semanaCell("SEMANA 5"),
        semanaContentCell(p.destrezasReforzadas),
        semanaContentCell(p.evidenciasActitudinales),
        semanaContentCell(p.actividadesSemana5?.filter(Boolean).length ? p.actividadesSemana5.filter(Boolean) : ["Presentación y socialización del proyecto interdisciplinario"]),
        semanaContentCell(p.areasIntegradas),
        semanaContentCell(["Evaluación sumativa del trimestre"]),
      ],
    }));
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
