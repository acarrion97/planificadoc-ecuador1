/**
 * Genera el documento Word (.docx) para Planificación Semanal de Educación Inicial
 * Formato: "PLANIFICACIÓN SEMANAL POR EXPERIENCIA DE APRENDIZAJE"
 * Compatible con Inicial 1 (3-4 años) e Inicial 2 (4-5 años)
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType, HeightRule,
} from "docx";
import type { PlanificacionInicialSemanal, AmbitoInicial, ClaseInicial } from "../data/types-inicial";

// ── Colores (tonos azul celeste) ──────────────────────────────────────────────
const BG_HEADER   = "1A6BAE";  // azul oscuro — encabezados principales
const BG_COL_HDR  = "2E86C1";  // azul medio — sub-encabezados de columna
const BG_LABEL    = "D6EAF8";  // azul claro — celdas de etiqueta
const BG_AMBITO   = "EBF5FB";  // azul muy claro — fondo ámbito
const BG_ADAPT    = "FADBD8";  // rojo suave — adaptaciones curriculares
const DARK_TEXT   = "1A1A1A";
const WHITE       = "FFFFFF";

// Colores de texto para etiquetas de etapas (sin fondo, solo texto)
const COLOR_INICIO     = "154360";  // azul noche
const COLOR_DESARROLLO = "145A32";  // verde oscuro
const COLOR_CIERRE     = "784212";  // ámbar oscuro

// ── Dimensiones A4 landscape ─────────────────────────────────────────────────
// 16838 × 11906 twips. Márgenes 720 c/u.
const PW = 16838; const PH = 11906; const MAR = 720;
const TABLE_W = PW - 2 * MAR; // 15398 twips

// ── Columnas ─────────────────────────────────────────────────────────────────
// Tabla de 12 columnas base iguales (~1283 c/u) → permite 4 firmas exactamente
// iguales (3 cols cada una) y un proceso ancho (6 cols).
//
// Distribución de colSpans por tipo de fila:
//   Título        : 12
//   Info (label|val|label|val) : 2 | 4 | 2 | 4
//   Objetivo      : 2 | 10
//   Encab. contenido / datos   : 2 | 2 | 2 | 6
//   Firmas        : 3 | 3 | 3 | 3   ← 4 IGUALES
//
const COL  = 1283;  // ancho base (10 cols)
const COLW = 1284;  // ancho base ampliado (cols 6 y 12)
// Suma: 10 × 1283 + 2 × 1284 = 12 830 + 2 568 = 15 398 ✓

// Anchos lógicos de contenido (colSpan:2 c/u, excepto Proceso colSpan:6)
const AMB_W  = COL  + COL;                    // cols 1-2  = 2 566
const COMP_W = COL  + COL;                    // cols 3-4  = 2 566
const DEST_W = COL  + COLW;                   // cols 5-6  = 2 567
const PROC_W = COL + COL + COL + COL + COL + COLW; // cols 7-12 = 7 699

// Anchos de firmas (colSpan:3 c/u → 4 firmas iguales)
const SIG1 = COL  + COL  + COL;   // cols 1-3  = 3 849
const SIG2 = COL  + COL  + COLW;  // cols 4-6  = 3 850
const SIG3 = COL  + COL  + COL;   // cols 7-9  = 3 849
const SIG4 = COL  + COL  + COLW;  // cols 10-12 = 3 850
// Suma firmas: 3 849 + 3 850 + 3 849 + 3 850 = 15 398 ✓

// Anchos de filas informativas (colSpan:2 label | colSpan:4 valor)
const INFO_LBL = COL + COL;                  // 2 566
const INFO_VAL = COL + COL + COL + COLW;     // 5 133

// Padding celda
const CP = { top: 60, bottom: 60, left: 115, right: 115 };

// Borde estándar
const B = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "9DC3E6" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "9DC3E6" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "9DC3E6" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "9DC3E6" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function p(runs: TextRun[], align: string = AlignmentType.LEFT): Paragraph {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Paragraph({ children: runs, alignment: align as any, spacing: { after: 0 } });
}

function run(text: string, opts?: {
  bold?: boolean;
  size?: number;
  color?: string;
  italics?: boolean;
}): TextRun {
  return new TextRun({
    text,
    bold:    opts?.bold    ?? false,
    size:    opts?.size    ?? 16,
    color:   opts?.color   ?? DARK_TEXT,
    italics: opts?.italics ?? false,
    font: "Calibri",
  });
}

function emptyPara(): Paragraph {
  return new Paragraph({ children: [run("")], spacing: { after: 0 } });
}

interface TcOpts {
  colSpan?: number;
  rowSpan?: number;
  bg?: string;
  bold?: boolean;
  size?: number;
  color?: string;
  align?: string;
  valign?: string;
}

/** Celda con texto simple */
function tc(text: string, width: number, opts: TcOpts = {}): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    columnSpan: opts.colSpan,
    rowSpan:    opts.rowSpan,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verticalAlign: (opts.valign ?? VerticalAlign.CENTER) as any,
    shading: opts.bg ? { type: ShadingType.CLEAR, fill: opts.bg } : undefined,
    margins: CP,
    borders: B,
    children: [
      p([run(text, { bold: opts.bold, size: opts.size ?? 16, color: opts.color })],
        opts.align ?? AlignmentType.LEFT),
    ],
  });
}

/** Celda con múltiples párrafos */
function tcM(paras: Paragraph[], width: number, opts: TcOpts = {}): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    columnSpan: opts.colSpan,
    rowSpan:    opts.rowSpan,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verticalAlign: (opts.valign ?? VerticalAlign.TOP) as any,
    shading: opts.bg ? { type: ShadingType.CLEAR, fill: opts.bg } : undefined,
    margins: CP,
    borders: B,
    children: paras.length > 0 ? paras : [emptyPara()],
  });
}

function tableRow(cells: TableCell[], minHeight?: number): TableRow {
  return new TableRow({
    children: cells,
    height: minHeight
      ? { value: minHeight, rule: HeightRule.ATLEAST }
      : undefined,
  });
}

// ── Constructor del Proceso Metodológico ──────────────────────────────────────

function buildProcesoCell(clase: ClaseInicial): TableCell {
  const ps: Paragraph[] = [];

  // Encabezado de la clase
  ps.push(p([run(
    `Clase N.° ${clase.numero} — ${clase.tema}`,
    { bold: true, size: 17 }
  )], AlignmentType.CENTER));

  ps.push(p([run(
    `Objetivo: ${clase.objetivoEspecifico}`,
    { size: 15, italics: true }
  )]));

  ps.push(p([run(
    `Metodología: ${clase.metodologia}`,
    { size: 15, bold: true }
  )]));

  // INICIO
  ps.push(p([run("INICIO", { bold: true, size: 16, color: COLOR_INICIO })]));
  for (const act of clase.inicio) {
    ps.push(p([run(`• ${act}`, { size: 15 })]));
  }

  // DESARROLLO
  ps.push(p([run("DESARROLLO", { bold: true, size: 16, color: COLOR_DESARROLLO })]));
  for (const act of clase.desarrollo) {
    ps.push(p([run(`• ${act}`, { size: 15 })]));
  }

  // CIERRE
  ps.push(p([run("CIERRE", { bold: true, size: 16, color: COLOR_CIERRE })]));
  for (const act of clase.cierre) {
    ps.push(p([run(`• ${act}`, { size: 15 })]));
  }

  // Método de evaluación
  if (clase.metodoEvaluacion.length > 0) {
    ps.push(p([run("Método de observación:", { bold: true, size: 15 })]));
    for (const m of clase.metodoEvaluacion) {
      ps.push(p([run(`• ${m}`, { size: 15 })]));
    }
  }

  return tcM(ps, PROC_W, { colSpan: 6, valign: VerticalAlign.TOP });
}

// ── Filas de un ámbito ────────────────────────────────────────────────────────

function buildAmbitoRows(ambito: AmbitoInicial): TableRow[] {
  const rows: TableRow[] = [];
  const nClases = Math.max(ambito.clases.length, 1);

  // Celda Ámbito (rowSpan, colSpan:2)
  const ambitoCell = tcM(
    [p([run(ambito.ambito, { bold: true, size: 16 })], AlignmentType.CENTER)],
    AMB_W,
    { bg: BG_AMBITO, colSpan: 2, rowSpan: nClases, valign: VerticalAlign.CENTER }
  );

  // Celda Competencia (rowSpan, colSpan:2)
  const compCell = tcM([
    p([run(ambito.competenciaCodigo, { bold: true, size: 15 })], AlignmentType.CENTER),
    emptyPara(),
    p([run(ambito.competenciaDescripcion, { size: 14 })]),
  ], COMP_W, { colSpan: 2, rowSpan: nClases, valign: VerticalAlign.TOP });

  // Celda Destreza (rowSpan, colSpan:2)
  const destPs: Paragraph[] = [];
  for (const d of ambito.destrezas) {
    destPs.push(p([run(d, { size: 15 })]));
    destPs.push(emptyPara());
  }
  if (ambito.ejesTransversales?.length) {
    destPs.push(emptyPara());
    destPs.push(p([run("Ejes transversales:", { bold: true, size: 14 })]));
    for (const eje of ambito.ejesTransversales) {
      destPs.push(p([run(eje, { size: 14, italics: true })]));
    }
  }
  const destCell = tcM(destPs, DEST_W, { colSpan: 2, rowSpan: nClases, valign: VerticalAlign.TOP });

  // Primera fila: ámbito + competencia + destreza + proceso[0]
  if (ambito.clases.length > 0) {
    rows.push(tableRow([
      ambitoCell,
      compCell,
      destCell,
      buildProcesoCell(ambito.clases[0]),
    ], 800));

    // Filas siguientes: solo proceso
    for (let i = 1; i < ambito.clases.length; i++) {
      rows.push(tableRow([buildProcesoCell(ambito.clases[i])], 800));
    }
  } else {
    rows.push(tableRow([ambitoCell, compCell, destCell, tcM([], PROC_W, { colSpan: 6 })], 500));
  }

  return rows;
}

// ── Tabla completa ────────────────────────────────────────────────────────────

function buildTable(plan: PlanificacionInicialSemanal): Table {
  const rows: TableRow[] = [];

  // ── Título ───────────────────────────────────────────────────────────────
  rows.push(tableRow([
    tc("PLANIFICACIÓN SEMANAL POR EXPERIENCIA DE APRENDIZAJE", TABLE_W, {
      colSpan: 12, bg: BG_HEADER, bold: true, size: 22,
      color: WHITE, align: AlignmentType.CENTER,
    }),
  ], 600));

  // ── Datos informativos (colSpans: 2 | 4 | 2 | 4 = 12) ────────────────────
  rows.push(tableRow([
    tc("NOMBRE DE LA\nINSTITUCIÓN:", INFO_LBL, { colSpan: 2, bg: BG_LABEL, bold: true, size: 15 }),
    tc(plan.institucion,             INFO_VAL, { colSpan: 4, size: 15 }),
    tc("NOMBRE DEL DOCENTE:",        INFO_LBL, { colSpan: 2, bg: BG_LABEL, bold: true, size: 15 }),
    tc(plan.docente,                 INFO_VAL, { colSpan: 4, size: 15 }),
  ], 420));

  rows.push(tableRow([
    tc("GRADO/CURSO:",    INFO_LBL, { colSpan: 2, bg: BG_LABEL, bold: true, size: 15 }),
    tc(plan.grado,        INFO_VAL, { colSpan: 4, size: 15 }),
    tc("DURACIÓN/FECHA:", INFO_LBL, { colSpan: 2, bg: BG_LABEL, bold: true, size: 15 }),
    tc(plan.duracion,     INFO_VAL, { colSpan: 4, size: 15 }),
  ], 380));

  // Objetivo general (colSpans: 2 | 10 = 12)
  rows.push(tableRow([
    tc("OBJETIVO GENERAL:", INFO_LBL, { colSpan: 2, bg: BG_LABEL, bold: true, size: 15 }),
    tcM(
      [p([run(plan.objetivoGeneral, { size: 15 })])],
      TABLE_W - INFO_LBL,
      { colSpan: 10 }
    ),
  ], 420));

  // ── Encabezados de columnas (colSpans: 2 | 2 | 2 | 6 = 12) ──────────────
  rows.push(tableRow([
    tc("ÁMBITOS DE DESARROLLO Y APRENDIZAJE", AMB_W, {
      colSpan: 2, bg: BG_COL_HDR, bold: true, size: 15, color: WHITE,
      align: AlignmentType.CENTER,
    }),
    tc("COMPETENCIA / HABILIDAD", COMP_W, {
      colSpan: 2, bg: BG_COL_HDR, bold: true, size: 15, color: WHITE,
      align: AlignmentType.CENTER,
    }),
    tc("DESTREZA CON CRITERIO DE DESEMPEÑO", DEST_W, {
      colSpan: 2, bg: BG_COL_HDR, bold: true, size: 15, color: WHITE,
      align: AlignmentType.CENTER,
    }),
    tc("PROCESO METODOLÓGICO", PROC_W, {
      colSpan: 6, bg: BG_COL_HDR, bold: true, size: 15, color: WHITE,
      align: AlignmentType.CENTER,
    }),
  ], 420));

  // ── Filas de ámbitos ──────────────────────────────────────────────────────
  for (const ambito of plan.ambitos) {
    rows.push(...buildAmbitoRows(ambito));
  }

  // ── Adaptaciones curriculares (colSpans: 12 / 2|2|2|6 / 2|2|2|6) ─────────
  const gradoLabel = plan.gradoAdaptacion ? ` GRADO ${plan.gradoAdaptacion}` : "";
  rows.push(tableRow([
    tc(`ADAPTACIONES CURRICULARES${gradoLabel}`, TABLE_W, {
      colSpan: 12, bg: BG_ADAPT, bold: true, size: 15, align: AlignmentType.CENTER,
    }),
  ], 380));

  rows.push(tableRow([
    tc("DESCRIPCIÓN DE NEE",               AMB_W,  { colSpan: 2, bg: BG_LABEL, bold: true, size: 14, align: AlignmentType.CENTER }),
    tc("COMPETENCIA",                      COMP_W, { colSpan: 2, bg: BG_LABEL, bold: true, size: 14, align: AlignmentType.CENTER }),
    tc("DESTREZA CON CRITERIO DE DESEMPEÑO", DEST_W, { colSpan: 2, bg: BG_LABEL, bold: true, size: 14, align: AlignmentType.CENTER }),
    tc("PROCESO METODOLÓGICO",             PROC_W, { colSpan: 6, bg: BG_LABEL, bold: true, size: 14, align: AlignmentType.CENTER }),
  ], 360));

  const neeList = plan.adaptacionesNEE ?? [];
  const neeFilas = neeList.length > 0 ? neeList : [null, null];
  for (const nee of neeFilas) {
    rows.push(tableRow([
      tc(nee?.descripcionNEE ?? "", AMB_W,  { colSpan: 2, size: 14 }),
      tc(nee?.competencia    ?? "", COMP_W, { colSpan: 2, size: 14 }),
      tc(nee?.destreza       ?? "", DEST_W, { colSpan: 2, size: 14 }),
      tc(nee?.proceso        ?? "", PROC_W, { colSpan: 6, size: 14 }),
    ], 340));
  }

  // ── Bibliografía ──────────────────────────────────────────────────────────
  rows.push(tableRow([
    tc("BIBLIOGRAFÍA / WEBGRAFÍA", TABLE_W, { colSpan: 12, bg: BG_LABEL, bold: true, size: 15 }),
  ], 360));
  rows.push(tableRow([
    tc(plan.bibliografia ?? "", TABLE_W, { colSpan: 12, size: 14 }),
  ], 400));

  // ── Observaciones ─────────────────────────────────────────────────────────
  rows.push(tableRow([
    tc("OBSERVACIONES:", TABLE_W, { colSpan: 12, bg: BG_LABEL, bold: true, size: 15 }),
  ], 360));
  rows.push(tableRow([
    tc(plan.observaciones ?? "", TABLE_W, { colSpan: 12, size: 14 }),
  ], 400));

  // ── Firmas (4 IGUALES: colSpan:3 c/u → 3+3+3+3 = 12) ────────────────────
  const elab  = plan.elaboradoPor;
  const rev   = plan.revisadoPor;
  const coord = plan.coordinadorPor;
  const apro  = plan.aprobadoPor;

  rows.push(tableRow([
    tc("ELABORADO", SIG1,       { colSpan: 3, bg: BG_HEADER, bold: true, size: 15, color: WHITE, align: AlignmentType.CENTER }),
    tc("REVISADO",  SIG2 + SIG3, { colSpan: 6, bg: BG_HEADER, bold: true, size: 15, color: WHITE, align: AlignmentType.CENTER }),
    tc("APROBADO",  SIG4,       { colSpan: 3, bg: BG_HEADER, bold: true, size: 15, color: WHITE, align: AlignmentType.CENTER }),
  ], 380));

  rows.push(tableRow([
    tcM([
      p([run(elab?.cargo  ?? "DOCENTE",          { bold: true, size: 14 })]),
      p([run(elab?.nombre ?? "",                 { size: 14 })]),
    ], SIG1, { colSpan: 3, valign: VerticalAlign.TOP }),
    tcM([
      p([run(rev?.cargo   ?? "DECE",             { bold: true, size: 14 })]),
      p([run(rev?.nombre  ?? "",                 { size: 14 })]),
    ], SIG2, { colSpan: 3, valign: VerticalAlign.TOP }),
    tcM([
      p([run(coord?.cargo  ?? "COORDINADORA/A",  { bold: true, size: 14 })]),
      p([run(coord?.nombre ?? "",                { size: 14 })]),
    ], SIG3, { colSpan: 3, valign: VerticalAlign.TOP }),
    tcM([
      p([run(apro?.cargo  ?? "VICERRECTOR/A",    { bold: true, size: 14 })]),
      p([run(apro?.nombre ?? "",                 { size: 14 })]),
    ], SIG4, { colSpan: 3, valign: VerticalAlign.TOP }),
  ], 500));

  rows.push(tableRow([
    tc("Firma:", SIG1, { colSpan: 3, size: 14 }),
    tc("Firma:", SIG2, { colSpan: 3, size: 14 }),
    tc("Firma:", SIG3, { colSpan: 3, size: 14 }),
    tc("Firma:", SIG4, { colSpan: 3, size: 14 }),
  ], 450));

  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    rows,
  });
}

// ── Exportación principal ─────────────────────────────────────────────────────

export async function generarWordPlanificacionInicial(
  plan: PlanificacionInicialSemanal
): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: PW, height: PH },
          margin: { top: MAR, bottom: MAR, left: MAR, right: MAR },
        },
      },
      children: [buildTable(plan)],
    }],
  });

  return Packer.toBlob(doc);
}
