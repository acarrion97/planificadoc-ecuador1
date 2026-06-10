/**
 * Genera el documento Word (.docx) para Planificación Semanal — A4 landscape
 * Formato oficial MinEduc Ecuador 2026-2027
 *
 * 6 columnas:
 *   DÍA | DESTREZAS DCD | INDICADORES | ESTRATEGIAS ERCA+DUA | RECURSOS | ACTIVIDADES EVALUATIVAS
 *
 * La columna ESTRATEGIAS contiene las 4 fases ERCA en una sola celda,
 * cada fase con cabecera de color propio y cuadritos DUA (■) al final de cada actividad.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionSemanal, ConfiguracionDia } from "../data/types";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const BG_TITLE     = "003366";
const BG_COLHEAD   = "1A3A5C";
const BG_SECTION   = "DDEFF1";
const BG_SUBHEAD   = "EAF4F6";
const WHITE        = "FFFFFF";
const BLACK        = "000000";

// Fases ERCA — cabecera (dark) + fondo claro para actividades
const FASE = {
  experiencia:      { dark: "2980B9", light: "EBF5FB", label: "EXPERIENCIA"      },
  reflexion:        { dark: "8E44AD", light: "F5EEF8", label: "REFLEXIÓN"        },
  conceptualizacion:{ dark: "27AE60", light: "EAFAF1", label: "CONCEPTUALIZACIÓN" },
  aplicacion:       { dark: "E67E22", light: "FEF9E7", label: "APLICACIÓN"       },
} as const;
type FaseKey = keyof typeof FASE;

// DUA colores
const DUA_R = "EC4899"; // Representación  (rosado)
const DUA_A = "1E3A5F"; // Acción/Expresión (azul oscuro)
const DUA_I = "22C55E"; // Implicación      (verde)

// ─── Anchos de columna (A4 landscape: 16838 - 2×560 = 15718 twips) ───────────
const COL = {
  dia:  700,
  dcd:  2250,
  ind:  2400,
  est:  5700,
  rec:  2150,
  eva:  2518,
} as const;
// Total: 700+2250+2400+5700+2150+2518 = 15718 ✓

const BORDER_DEF = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

const BORDER_NONE = {
  top:    { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shade(color: string) {
  return { fill: color, color, type: ShadingType.CLEAR };
}

/** Celda simple con un único TextRun */
function simpleCell(
  text: string,
  opts: {
    bold?: boolean; italic?: boolean; size?: number;
    color?: string; bg?: string; align?: typeof AlignmentType[keyof typeof AlignmentType];
    colspan?: number; rowspan?: number;
  } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    rowSpan:    opts.rowspan,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.bg ? shade(opts.bg) : undefined,
    borders: BORDER_DEF,
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text || "—",
            bold:    opts.bold    ?? false,
            italics: opts.italic  ?? false,
            size:    (opts.size ?? 8) * 2,
            color:   opts.color   ?? BLACK,
            font:    "Arial",
          }),
        ],
      }),
    ],
  });
}

/** Fila de sección (cabecera azul que ocupa las 6 columnas) */
function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label, {
        bold: true, size: 9, bg: BG_SECTION,
        color: "1A3A5C", colspan: 6,
      }),
    ],
  });
}

/** Párrafo con fondo de color (para cabeceras de fase ERCA) */
function faseHeaderPara(label: string, duracion: string | undefined, bgColor: string): Paragraph {
  return new Paragraph({
    shading: shade(bgColor),
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({
        text: `${label}${duracion ? ` (${duracion})` : ""}`,
        bold: true, size: 14, color: WHITE, font: "Arial",
      }),
    ],
  });
}

/** Párrafo de actividad con cuadritos DUA al final */
function actividadPara(
  num: number,
  texto: string,
  dua: { representacion: boolean; accionExpresion: boolean; implicacion: boolean },
): Paragraph {
  // Limpia artefactos de DUA residuales en el texto
  const clean = texto
    .replace(/\s*\(\s*I\s*:\s*(true|false)[^)]*\)\s*/gi, "")
    .replace(/\s*\[\s*I\s*:\s*(true|false)[^\]]*\]\s*/gi, "")
    .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
    .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
    .trim();

  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent:  { left: 60 },
    children: [
      new TextRun({ text: `${num}. ${clean}  `, size: 13, font: "Arial", color: "222222" }),
      // ■ Representación
      new TextRun({ text: "■", size: 14, color: dua.representacion ? DUA_R : "F9C6DD", font: "Arial" }),
      new TextRun({ text: "■", size: 14, color: dua.accionExpresion ? DUA_A : "C5D4E0", font: "Arial" }),
      new TextRun({ text: "■", size: 14, color: dua.implicacion     ? DUA_I : "C3EDD0", font: "Arial" }),
    ],
  });
}

/** Párrafo de leyenda DUA (arriba de la columna estrategias) */
function duaLegendPara(): Paragraph {
  return new Paragraph({
    spacing: { before: 10, after: 30 },
    children: [
      new TextRun({ text: "■ ", size: 13, color: DUA_R, font: "Arial" }),
      new TextRun({ text: "Representación   ", size: 12, color: "666666", font: "Arial" }),
      new TextRun({ text: "■ ", size: 13, color: DUA_A, font: "Arial" }),
      new TextRun({ text: "Acción/Expresión   ", size: 12, color: "666666", font: "Arial" }),
      new TextRun({ text: "■ ", size: 13, color: DUA_I, font: "Arial" }),
      new TextRun({ text: "Implicación", size: 12, color: "666666", font: "Arial" }),
    ],
  });
}

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaSemanaKey = typeof DIAS[number];
const DIA_LABEL: Record<DiaSemanaKey, string> = {
  lunes: "LUNES", martes: "MARTES", miercoles: "MIÉRCOLES", jueves: "JUEVES", viernes: "VIERNES",
};
const DIA_BG: Record<DiaSemanaKey, string> = {
  lunes: "EFF6FF", martes: "F0FDF4", miercoles: "FEFCE8", jueves: "FFF7ED", viernes: "FAF5FF",
};
const DIA_COLOR: Record<DiaSemanaKey, string> = {
  lunes: "1E3A8A", martes: "166534", miercoles: "854D0E", jueves: "9A3412", viernes: "6B21A8",
};

// ─── Export principal ─────────────────────────────────────────────────────────

export async function generarWordSemanal(semana: PlanificacionSemanal): Promise<Blob> {
  const rows: TableRow[] = [];

  // ══════════════════════════════════════════════════════════════
  // CABECERA PRINCIPAL
  // ══════════════════════════════════════════════════════════════
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: 6,
        shading: shade(BG_TITLE),
        borders: BORDER_DEF,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: "PLANIFICACIÓN MICROCURRICULAR SEMANAL",
              bold: true, size: 24, color: WHITE, font: "Arial",
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: `Semana: ${semana.semanaInicio} — ${semana.semanaFin}`,
              size: 16, color: "A8C4E0", font: "Arial",
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
  rows.push(new TableRow({
    children: [
      simpleCell("Institución:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.institucion || "—", { size: 8, colspan: 2 }),
      simpleCell("Docente:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.docente || "—", { size: 8, colspan: 2 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Grado / Curso:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(`${semana.grado || "—"} — ${semana.paralelo || "—"}`, { size: 8 }),
      simpleCell("Nivel:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.nivel || "—", { size: 8 }),
      simpleCell("Trimestre:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.trimestre || "—", { size: 8 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Unidad N.°:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.numeroUnidad || "—", { size: 8 }),
      simpleCell("Título de la unidad:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.tituloUnidad || "—", { size: 8, colspan: 3 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Objetivos de la unidad:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      simpleCell(semana.objetivosUnidad || "—", { size: 8, colspan: 5 }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════
  // DUA
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("PRINCIPIOS DUA (Diseño Universal para el Aprendizaje)"));
  rows.push(new TableRow({
    children: [
      simpleCell("Representación (rosa):",    { bold: true, size: 8, bg: BG_SUBHEAD, color: "9D174D" }),
      simpleCell(semana.duaRepresentacion || "—",  { size: 8 }),
      simpleCell("Acción / Expresión (azul):", { bold: true, size: 8, bg: BG_SUBHEAD, color: "1E3A8A" }),
      simpleCell(semana.duaAccionExpresion || "—", { size: 8 }),
      simpleCell("Implicación (verde):",       { bold: true, size: 8, bg: BG_SUBHEAD, color: "166534" }),
      simpleCell(semana.duaImplicacion || "—",     { size: 8 }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════
  // CABECERA DE COLUMNAS
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("DESARROLLO SEMANAL POR DÍA"));
  rows.push(new TableRow({
    children: [
      simpleCell("DÍA",
        { bold: true, size: 8, bg: BG_COLHEAD, color: WHITE, align: AlignmentType.CENTER }),
      simpleCell("DESTREZAS CON CRITERIOS\nDE DESEMPEÑO",
        { bold: true, size: 8, bg: BG_COLHEAD, color: WHITE }),
      simpleCell("INDICADORES DE\nEVALUACIÓN",
        { bold: true, size: 8, bg: BG_COLHEAD, color: WHITE }),
      // Cabecera ESTRATEGIAS con leyenda DUA inline
      new TableCell({
        shading: shade(BG_COLHEAD),
        borders: BORDER_DEF,
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({
            children: [new TextRun({
              text: "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE",
              bold: true, size: 16, color: WHITE, font: "Arial",
            })],
          }),
          new Paragraph({
            children: [new TextRun({
              text: "Estrategias metodológicas diversificadas con base al DUA",
              size: 13, color: "A8C4E0", font: "Arial", italics: true,
            })],
          }),
          duaLegendPara(),
        ],
      }),
      simpleCell("RECURSOS",
        { bold: true, size: 8, bg: BG_COLHEAD, color: WHITE }),
      simpleCell("ACTIVIDADES\nEVALUATIVAS",
        { bold: true, size: 8, bg: BG_COLHEAD, color: WHITE }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════
  // FILAS POR DÍA
  // ══════════════════════════════════════════════════════════════
  const diasActivos = DIAS.filter(d => semana.dias[d]?.activo);

  for (const dia of diasActivos) {
    const diaConfig: ConfiguracionDia = semana.dias[dia];
    const horasConPlan = diaConfig.horas.filter(h => h.temaSeleccionado);
    if (horasConPlan.length === 0) continue;

    for (let hi = 0; hi < horasConPlan.length; hi++) {
      const hora     = horasConPlan[hi];
      const plan     = hora.temaSeleccionado!;
      const est      = plan.estructura as any;
      const destreza = hora.destreza;

      // ── Col 1: DÍA (rowSpan por el número de horas del día) ──────────────
      const diaCell = hi === 0
        ? new TableCell({
            rowSpan: horasConPlan.length,
            borders: BORDER_DEF,
            shading: shade(DIA_BG[dia]),
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: DIA_LABEL[dia],
                    bold: true, size: 18,
                    color: DIA_COLOR[dia], font: "Arial",
                  }),
                ],
              }),
              ...(horasConPlan.length > 1 ? [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `Hora ${hi + 1}`,
                  size: 13, color: "888888", font: "Arial",
                })],
              })] : []),
            ],
          })
        : undefined;

      // ── Col 2: DESTREZA DCD ──────────────────────────────────────────────
      const dcdChildren: Paragraph[] = [
        new Paragraph({
          children: [new TextRun({
            text: hora.codigoDestreza || "—",
            bold: true, size: 16, color: "003366", font: "Arial",
          })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: destreza?.descripcion || "",
            size: 14, font: "Arial", color: BLACK,
          })],
          spacing: { after: 40 },
        }),
      ];
      if (plan.objetivoClase) {
        dcdChildren.push(new Paragraph({
          children: [new TextRun({
            text: plan.objetivoClase,
            size: 13, font: "Arial", italics: true, color: "444444",
          })],
          spacing: { before: 40 },
          border: { left: { style: BorderStyle.SINGLE, size: 6, color: "003366" } },
          indent: { left: 80 },
        }));
      }

      // ── Col 3: INDICADORES DE EVALUACIÓN ────────────────────────────────
      const indicadores = destreza?.indicadoresEvaluacion ?? [];
      const indChildren: Paragraph[] = indicadores.length
        ? indicadores.map((ind, i) => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun({ text: ind, size: 13, font: "Arial", color: BLACK })],
          }))
        : [new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial", color: "999999" })] })];

      // ── Col 4: ESTRATEGIAS ERCA + DUA ────────────────────────────────────
      const estChildren: Paragraph[] = [];

      const FASES_ORDER: { key: FaseKey; duracion?: string }[] = [
        { key: "experiencia" },
        { key: "reflexion" },
        { key: "conceptualizacion" },
        { key: "aplicacion" },
      ];

      for (const { key } of FASES_ORDER) {
        const fase = est?.[key];
        if (!fase?.actividades?.length) continue;
        const cfg = FASE[key];

        // Cabecera de fase con fondo de color
        estChildren.push(faseHeaderPara(
          cfg.label,
          fase.duracion,
          cfg.dark,
        ));

        // Actividades con DUA
        (fase.actividades as string[]).forEach((act, i) => {
          const dua = fase.duaActividades?.[i] ?? {
            representacion: false, accionExpresion: false, implicacion: false,
          };
          estChildren.push(actividadPara(i + 1, act, dua));
        });

        // Pequeño espacio entre fases
        estChildren.push(new Paragraph({ children: [], spacing: { before: 40, after: 0 } }));
      }

      if (estChildren.length === 0) {
        estChildren.push(new Paragraph({
          children: [new TextRun({ text: "—", size: 14, font: "Arial", color: "999999" })],
        }));
      }

      // ── Col 5: RECURSOS ──────────────────────────────────────────────────
      const recursos = plan.recursos ?? [];
      const recChildren: Paragraph[] = recursos.length
        ? recursos.map(r => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun({ text: r, size: 13, font: "Arial", color: BLACK })],
          }))
        : [new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial", color: "999999" })] })];

      // ── Col 6: ACTIVIDADES EVALUATIVAS ───────────────────────────────────
      const evaChildren: Paragraph[] = [];
      if (plan.evaluacionFormativa) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: plan.evaluacionFormativa, size: 13, font: "Arial", color: BLACK })],
          spacing: { after: 40 },
        }));
      }
      if (hora.tecnicasEvaluacion?.length) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: "Técnicas:", bold: true, size: 13, font: "Arial", color: "003366" })],
          spacing: { after: 20 },
        }));
        hora.tecnicasEvaluacion.forEach(t =>
          evaChildren.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: t, size: 13, font: "Arial", color: BLACK })],
          }))
        );
      }
      const criterios = destreza?.criteriosEvaluacion ?? [];
      if (criterios.length) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: "Criterios:", bold: true, size: 13, font: "Arial", color: "003366" })],
          spacing: { before: 40, after: 20 },
        }));
        criterios.forEach(c =>
          evaChildren.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: c, size: 12, font: "Arial", color: "333333" })],
          }))
        );
      }
      if (evaChildren.length === 0) {
        evaChildren.push(new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial", color: "999999" })] }));
      }

      // ── Construir la fila ────────────────────────────────────────────────
      const cells: TableCell[] = [];
      if (diaCell) cells.push(diaCell);

      cells.push(
        new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: dcdChildren }),
        new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: indChildren }),
        new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: estChildren }),
        new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: recChildren }),
        new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: evaChildren }),
      );

      rows.push(new TableRow({ children: cells }));
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIRMAS
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("FIRMAS"));
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: 2, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "ELABORADO POR (DOCENTE)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: semana.docente || "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
      new TableCell({
        columnSpan: 2, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "REVISADO POR (VICERRECTOR)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
      new TableCell({
        columnSpan: 2, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "APROBADO POR (DIRECTOR/RECTOR)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════
  // CONSTRUIR DOCUMENTO
  // ══════════════════════════════════════════════════════════════
  const table = new Table({
    layout: TableLayoutType.FIXED,
    width:  { size: 15718, type: WidthType.DXA },
    columnWidths: [COL.dia, COL.dcd, COL.ind, COL.est, COL.rec, COL.eva],
    rows,
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 16838, height: 11906 }, // A4 landscape
          margin: { top: 560, bottom: 560, left: 560, right: 560 },
        },
      },
      children: [table],
    }],
  });

  return Packer.toBlob(doc);
}
