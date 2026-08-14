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
  TextRun, ImageRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type {
  PlanificacionSemanal, ConfiguracionDia, AdaptacionCurricular,
  GradoAdaptacion, TipoNEE,
} from "../data/types";
import { TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO } from "../data/types";
import { obtenerIconosDestreza } from "../src/data/iconosPorDestreza";
import { ICONOS_DCD_BASE64 } from "./iconos-base64";

// ─── Íconos DCD (competencias/inserciones curriculares) ─────────────────────
// Imágenes reales (base64, 72x72 origen) incrustadas vía ImageRun, extraídas
// y verificadas desde los PDF oficiales del currículo priorizado.
const ICONO_DCD_SIZE = 16; // px en el documento

/** Runs (imagen + texto) con los íconos (competencias/inserciones) de un código DCD. */
function iconosDcdRuns(codigo: string | undefined | null): (TextRun | ImageRun)[] {
  if (!codigo) return [];
  const iconos = obtenerIconosDestreza(codigo);
  const runs: (TextRun | ImageRun)[] = [];
  for (const nombre of iconos) {
    const data = ICONOS_DCD_BASE64[nombre];
    if (!data) continue;
    runs.push(new ImageRun({
      data,
      transformation: { width: ICONO_DCD_SIZE, height: ICONO_DCD_SIZE },
    }));
    runs.push(new TextRun({ text: " ", size: 18 }));
  }
  return runs;
}

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
  dia:  1000,   // ampliado para que MIÉRCOLES/JUEVES/VIERNES entren sin cortar
  dcd:  2200,
  ind:  2300,
  est:  5500,
  rec:  2050,
  eva:  2668,
} as const;
// Total: 1000+2200+2300+5500+2050+2668 = 15718 ✓

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
            size:    (opts.size ?? 12) * 2,
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
        bold: true, size: 18, color: WHITE, font: "Arial",
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
      new TextRun({ text: `${num}. ${clean}  `, size: 18, font: "Arial", color: "222222" }),
      // ■ Representación
      new TextRun({ text: "■", size: 14, color: dua.representacion ? DUA_R : "F9C6DD", font: "Arial" }),
      new TextRun({ text: "■", size: 14, color: dua.accionExpresion ? DUA_A : "C5D4E0", font: "Arial" }),
      new TextRun({ text: "■", size: 14, color: dua.implicacion     ? DUA_I : "C3EDD0", font: "Arial" }),
    ],
  });
}

/** Párrafo de leyenda DUA — solo cuadritos de color */
function duaLegendPara(): Paragraph {
  return new Paragraph({
    spacing: { before: 10, after: 30 },
    children: [
      new TextRun({ text: "■ ", size: 20, color: DUA_R, font: "Arial" }),
      new TextRun({ text: "■ ", size: 20, color: DUA_A, font: "Arial" }),
      new TextRun({ text: "■",  size: 20, color: DUA_I, font: "Arial" }),
    ],
  });
}

// ─── Paleta adaptaciones curriculares ────────────────────────────────────────
const BG_ADAPT_TITLE = "4A1942";  // violeta oscuro — cabecera de sección
const BG_ADAPT_HEAD  = "7B2D8B";  // violeta medio — subcabecera por estudiante
const BG_ADAPT_LEFT  = "F9F5FF";  // violeta muy claro — celda izquierda

// ─── Helpers para adaptaciones ───────────────────────────────────────────────

function parBoldValor(label: string, valor: string, size = 9): Paragraph {
  return new Paragraph({
    spacing: { after: 18 },
    children: [
      new TextRun({ text: label + " ", bold: true, size: size * 2, font: "Arial", color: BLACK }),
      new TextRun({ text: valor, size: size * 2, font: "Arial", color: BLACK }),
    ],
  });
}

function parSeccionAdapt(label: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 14 },
    children: [new TextRun({ text: label, bold: true, size: 18, font: "Arial", color })],
  });
}

function parBloquePedagogico(
  bloque: { categoria: string; descripcion: string; estrategias: string[] },
): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 20, after: 10 },
      children: [
        new TextRun({ text: bloque.categoria + ": ", bold: true, size: 18, font: "Arial", color: "003366" }),
        new TextRun({ text: bloque.descripcion, size: 18, font: "Arial", color: BLACK }),
      ],
    }),
    ...bloque.estrategias.map(e =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 10 },
        children: [new TextRun({ text: e, size: 18, font: "Arial", color: "333333" })],
      })
    ),
  ];
}

/** Tabla anidada para bloques de adaptación (Categoría | Descripción | Estrategias) */
function adaptacionInnerTable(
  items: Array<{ categoria: string; descripcion: string; estrategias: string[] }>,
  headerBg: string,
): Table {
  const hRow = new TableRow({
    tableHeader: true,
    children: [
      simpleCell("CATEGORÍA",   { bold: true, size: 9, bg: headerBg, color: WHITE }),
      simpleCell("DESCRIPCIÓN", { bold: true, size: 9, bg: headerBg, color: WHITE }),
      simpleCell("ESTRATEGIAS", { bold: true, size: 9, bg: headerBg, color: WHITE }),
    ],
  });
  const dRows = items.map(item =>
    new TableRow({
      children: [
        simpleCell(item.categoria,   { bold: true, size: 9, bg: "F5F3FF" }),
        simpleCell(item.descripcion, { size: 9 }),
        new TableCell({
          borders: BORDER_DEF,
          verticalAlign: VerticalAlign.TOP,
          children: item.estrategias.map(e =>
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `• ${e}`, size: 18, font: "Arial", color: BLACK })],
            })
          ),
        }),
      ],
    })
  );
  return new Table({
    width: { size: 12518, type: WidthType.DXA },
    columnWidths: [2700, 4200, 5618],
    rows: [hRow, ...dRows],
  });
}

/** Tabla de una columna para listas simples (metodologías, recursos) */
function bulletInnerTable(items: string[], bg?: string): Table {
  return new Table({
    width: { size: 12518, type: WidthType.DXA },
    rows: items.map(item =>
      new TableRow({
        children: [
          new TableCell({
            borders: BORDER_DEF,
            shading: bg ? { fill: bg, color: bg, type: ShadingType.CLEAR } : undefined,
            children: [
              new Paragraph({
                spacing: { after: 20 },
                children: [new TextRun({ text: `• ${item}`, size: 18, font: "Arial", color: BLACK })],
              }),
            ],
          }),
        ],
      })
    ),
  });
}

/**
 * Genera las filas de la tabla para la sección de Adaptaciones Curriculares.
 * Devuelve array vacío si no hay adaptaciones activas (documento idéntico al original).
 */
function crearSeccionAdaptacionesCurriculares(adaptaciones: AdaptacionCurricular[]): TableRow[] {
  const activas = adaptaciones.filter(a => a.incluirEnExportacion !== false);
  if (activas.length === 0) return [];

  const filas: TableRow[] = [];

  filas.push(sectionRow(
    `ADAPTACIONES CURRICULARES — ${activas.length} estudiante${activas.length !== 1 ? "s" : ""}`
  ));

  for (const adap of activas) {
    const tipoInfo = TIPOS_NEE_INFO[adap.tipoNecesidad as TipoNEE];
    const tipoNombre = tipoInfo?.nombre ?? adap.tipoNecesidad;
    const gradoInfo = GRADO_ADAPTACION_INFO[adap.gradoAdaptacion as GradoAdaptacion];
    const codigoLabel = adap.nombreEstudiante
      ? `${adap.nombreEstudiante} (${adap.codigoEstudiante})`
      : adap.codigoEstudiante;

    // Subcabecera por estudiante (fondo violeta oscuro)
    filas.push(new TableRow({
      children: [
        simpleCell(
          `${codigoLabel}   ·   ${tipoNombre}   ·   ${gradoInfo.nombre}`,
          { bold: true, size: 9, bg: BG_ADAPT_HEAD, color: WHITE, colspan: 6 }
        ),
      ],
    }));

    // Celda izquierda: identificación del estudiante
    const leftChildren: Paragraph[] = [
      new Paragraph({
        spacing: { before: 0, after: 30 },
        children: [new TextRun({ text: "IDENTIFICACIÓN", bold: true, size: 18, color: BG_ADAPT_TITLE, font: "Arial" })],
      }),
      parBoldValor("Código:", adap.codigoEstudiante),
      parBoldValor("NEE:", tipoNombre),
      parBoldValor("Grado de adaptación:", gradoInfo.nombre),
    ];
    if (adap.descripcionNecesidad) {
      leftChildren.push(new Paragraph({
        spacing: { before: 20, after: 0 },
        children: [new TextRun({
          text: adap.descripcionNecesidad,
          size: 18, italics: true, font: "Arial", color: "555555",
        })],
      }));
    }

    // Celda derecha: contenido de la adaptación (mezcla Paragraph + Table)
    const rightChildren: (Paragraph | Table)[] = [];

    // Destreza original
    rightChildren.push(new Paragraph({
      spacing: { before: 0, after: 14 },
      children: [
        new TextRun({ text: "Destreza: ", bold: true, size: 18, color: "003366", font: "Arial" }),
        new TextRun({ text: adap.codigoDestreza, bold: true, size: 18, font: "Arial", color: BLACK }),
        ...(adap.descripcionDestreza ? [new TextRun({
          text: " — " + adap.descripcionDestreza,
          size: 18, italics: true, font: "Arial", color: "444444",
        })] : []),
      ],
    }));

    // Grado 2/3: destreza, criterio e indicadores adaptados en tabla
    if (adap.gradoAdaptacion >= 2) {
      const infoRows: TableRow[] = [];
      if (adap.destrezaAdaptada) {
        infoRows.push(new TableRow({ children: [
          simpleCell("DESTREZA ADAPTADA:", { bold: true, size: 9, bg: "EDE9FE", color: BG_ADAPT_TITLE }),
          simpleCell(adap.destrezaAdaptada, { size: 9, bold: true }),
        ]}));
      }
      if (adap.criterioAdaptado) {
        infoRows.push(new TableRow({ children: [
          simpleCell("Criterio adaptado:", { bold: true, size: 9, bg: "F5F3FF", color: BG_ADAPT_TITLE }),
          simpleCell(adap.criterioAdaptado, { size: 9 }),
        ]}));
      }
      if (adap.indicadoresAdaptados?.length) {
        infoRows.push(new TableRow({ children: [
          simpleCell("Indicadores adaptados:", { bold: true, size: 9, bg: "F5F3FF", color: BG_ADAPT_TITLE }),
          new TableCell({
            borders: BORDER_DEF,
            verticalAlign: VerticalAlign.TOP,
            children: adap.indicadoresAdaptados.map(ind =>
              new Paragraph({ spacing: { after: 16 }, children: [new TextRun({ text: `• ${ind}`, size: 18, font: "Arial", color: BLACK })] })
            ),
          }),
        ]}));
      }
      if (infoRows.length) {
        rightChildren.push(new Table({
          width: { size: 12518, type: WidthType.DXA },
          columnWidths: [3200, 9318],
          rows: infoRows,
        }));
      }
    }

    if (adap.adaptacionesPorDia?.length) {
      // ── ADAPTACIONES POR DÍA — formato 3 columnas (igual al word de adaptaciones) ──
      rightChildren.push(parSeccionAdapt("ADAPTACIONES POR DÍA", "000000"));
      const ERCA_SEMANAL_CFG = [
        { key: "experiencia",       label: "EXPERIENCIA",       dark: "2980B9", light: "EBF5FB" },
        { key: "reflexion",         label: "REFLEXIÓN",         dark: "8E44AD", light: "F5EEF8" },
        { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", dark: "27AE60", light: "EAFAF1" },
        { key: "aplicacion",        label: "APLICACIÓN",        dark: "E67E22", light: "FEF9E7" },
      ] as const;

      for (let di = 0; di < adap.adaptacionesPorDia.length; di++) {
        const dp = adap.adaptacionesPorDia[di];

        // Columna izquierda: objetivo(s) + fases ERCA + leyenda DUA
        const leftContent: (Paragraph | Table)[] = [];
        if (dp.objetivo) {
          leftContent.push(new Paragraph({
            spacing: { before: 20, after: 8 },
            indent: { left: 30 },
            children: [
              new TextRun({ text: "Objetivo: ", bold: true, size: 18, font: "Arial", color: BLACK }),
              new TextRun({ text: dp.objetivo, size: 18, italics: true, font: "Arial", color: "444444" }),
            ],
          }));
        }
        if ((dp as any).objetivoAdaptado) {
          leftContent.push(new Paragraph({
            spacing: { before: 0, after: 12 },
            indent: { left: 30 },
            children: [
              new TextRun({ text: "Obj. adaptado: ", bold: true, size: 18, font: "Arial", color: BLACK }),
              new TextRun({ text: (dp as any).objetivoAdaptado, bold: true, size: 18, font: "Arial", color: BLACK }),
            ],
          }));
        }
        for (const { key, label, dark, light } of ERCA_SEMANAL_CFG) {
          const val = (dp.adaptacionERCA as any)[key];
          if (val) {
            leftContent.push(new Paragraph({
              shading: { fill: dark, color: dark, type: ShadingType.CLEAR },
              spacing: { before: 8, after: 0 },
              indent: { left: 30 },
              children: [new TextRun({ text: label, bold: true, size: 18, font: "Arial", color: WHITE })],
            }));
            leftContent.push(new Paragraph({
              shading: { fill: light, color: light, type: ShadingType.CLEAR },
              spacing: { before: 0, after: 8 },
              indent: { left: 40 },
              children: [new TextRun({ text: val, size: 18, font: "Arial", color: BLACK })],
            }));
          }
        }
        leftContent.push(duaLegendPara());

        // Columna central: recursos
        const middleContent: Paragraph[] = dp.recursosAdaptados?.length
          ? dp.recursosAdaptados.map(r => new Paragraph({
              spacing: { before: 8, after: 12 },
              children: [new TextRun({ text: `• ${r}`, size: 18, font: "Arial", color: BLACK })],
            }))
          : [new Paragraph({ children: [new TextRun({ text: "—", size: 18, font: "Arial", color: BLACK })] })];

        // Columna derecha: evaluación
        const evalContent: Paragraph[] = [new Paragraph({
          spacing: { before: 10, after: 10 },
          indent: { left: 30 },
          children: [new TextRun({ text: dp.evaluacionAdaptada || "—", size: 18, font: "Arial", color: BLACK })],
        })];

        // Tabla 3 columnas — total 12518 DXA
        rightChildren.push(new Table({
          width: { size: 12518, type: WidthType.DXA },
          columnWidths: [6000, 3259, 3259],
          rows: [
            // Fila 0: encabezado del día (colspan=3)
            new TableRow({ children: [
              new TableCell({
                columnSpan: 3,
                borders: BORDER_DEF,
                children: [new Paragraph({
                  spacing: { before: 25, after: 25 },
                  indent: { left: 40 },
                  children: [new TextRun({ text: dp.dia.toUpperCase(), bold: true, size: 18, font: "Arial", color: BLACK })],
                })],
              }),
            ]}),
            // Fila 2: gran encabezado ERCA (colspan=3)
            new TableRow({ children: [
              new TableCell({
                columnSpan: 3,
                borders: BORDER_DEF,
                shading: { fill: "1A3A5C", color: "1A3A5C", type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    spacing: { before: 16, after: 4 },
                    indent: { left: 30 },
                    children: [new TextRun({ text: "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE", bold: true, size: 18, font: "Arial", color: WHITE })],
                  }),
                  new Paragraph({
                    spacing: { before: 0, after: 8 },
                    indent: { left: 30 },
                    children: [new TextRun({ text: "Estrategias metodológicas diversificadas con base al DUA", italics: true, size: 18, font: "Arial", color: "CCCCCC" })],
                  }),
                ],
              }),
            ]}),
            // Fila 3: cabeceras de columna
            new TableRow({ children: [
              simpleCell("ESTRATEGIAS ERCA ADAPTADAS", { bold: true, size: 9, bg: "374151", color: WHITE, align: AlignmentType.CENTER }),
              simpleCell("RECURSOS ADAPTADOS",         { bold: true, size: 9, bg: "374151", color: WHITE, align: AlignmentType.CENTER }),
              simpleCell("EVALUACIÓN ADAPTADA",        { bold: true, size: 9, bg: "374151", color: WHITE, align: AlignmentType.CENTER }),
            ]}),
            // Fila 4: contenido
            new TableRow({ children: [
              new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: leftContent }),
              new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: middleContent }),
              new TableCell({ borders: BORDER_DEF, verticalAlign: VerticalAlign.TOP, children: evalContent }),
            ]}),
          ],
        }));
      }
    } else {
      // ── SECCIONES GENÉRICAS (sin planificación semanal vinculada) ─────────
      if (adap.adaptacionesAcceso?.length) {
        rightChildren.push(parSeccionAdapt("ADAPTACIONES DE ACCESO", "1A3A5C"));
        rightChildren.push(adaptacionInnerTable(adap.adaptacionesAcceso, "1A3A5C"));
      }
      if (adap.gradoAdaptacion >= 2 && adap.adaptacionesProceso?.length) {
        rightChildren.push(parSeccionAdapt("ADAPTACIONES DE PROCESO", "8E44AD"));
        rightChildren.push(adaptacionInnerTable(adap.adaptacionesProceso, "8E44AD"));
      }
      if (adap.gradoAdaptacion >= 3 && adap.adaptacionesResultado?.length) {
        rightChildren.push(parSeccionAdapt("ADAPTACIONES DE RESULTADO", "E67E22"));
        rightChildren.push(adaptacionInnerTable(adap.adaptacionesResultado, "E67E22"));
      }
      if (adap.metodologiasSugeridas?.length) {
        rightChildren.push(parSeccionAdapt("METODOLOGÍAS SUGERIDAS", "003366"));
        rightChildren.push(bulletInnerTable(adap.metodologiasSugeridas, "F0F4FA"));
      }
      if (adap.recursosEspecificos?.length) {
        rightChildren.push(parSeccionAdapt("RECURSOS ESPECÍFICOS", "444444"));
        rightChildren.push(bulletInnerTable(adap.recursosEspecificos));
      }
    }

    // Seguimiento y observaciones
    if (adap.seguimiento) {
      rightChildren.push(new Paragraph({
        spacing: { before: 20, after: 10 },
        children: [
          new TextRun({ text: "Seguimiento: ", bold: true, size: 18, font: "Arial", color: "003366" }),
          new TextRun({ text: adap.seguimiento, size: 18, font: "Arial", color: "333333" }),
        ],
      }));
    }
    if (adap.observaciones) {
      rightChildren.push(new Paragraph({
        spacing: { before: 14, after: 0 },
        children: [
          new TextRun({ text: "Observaciones: ", bold: true, size: 18, font: "Arial", color: "555555" }),
          new TextRun({ text: adap.observaciones, size: 18, italics: true, font: "Arial", color: "555555" }),
        ],
      }));
    }

    filas.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: BORDER_DEF,
          shading: shade(BG_ADAPT_LEFT),
          verticalAlign: VerticalAlign.TOP,
          children: leftChildren,
        }),
        new TableCell({
          columnSpan: 4,
          borders: BORDER_DEF,
          verticalAlign: VerticalAlign.TOP,
          children: rightChildren as any,
        }),
      ],
    }));
  }

  return filas;
}

// Colores niveles rúbrica
const RUB_AA = "16A34A"; // Verde   — Siempre Alcanza
const RUB_A  = "2563EB"; // Azul    — Alcanza
const RUB_PA = "D97706"; // Ámbar   — Próximo a Alcanzar
const RUB_NA = "DC2626"; // Rojo    — No Alcanza

/** Tabla de rúbrica balanceada (5 columnas) como tabla anidada */
function rubricaInnerTable(
  rubrica: Array<{ criterio: string; excelente: string; satisfactorio: string; enProceso: string; noAlcanza: string }>
): Table {
  const hRow = new TableRow({
    tableHeader: true,
    children: [
      simpleCell("CRITERIO DE EVALUACIÓN",  { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE }),
      simpleCell("SIEMPRE ALCANZA\n(Sobresaliente)", { bold: true, size: 9, bg: RUB_AA, color: WHITE }),
      simpleCell("ALCANZA\n(Satisfactorio)",         { bold: true, size: 9, bg: RUB_A,  color: WHITE }),
      simpleCell("PRÓXIMO A ALCANZAR\n(En proceso)",  { bold: true, size: 9, bg: RUB_PA, color: WHITE }),
      simpleCell("NO ALCANZA",                       { bold: true, size: 9, bg: RUB_NA, color: WHITE }),
    ],
  });
  const dRows = rubrica.map((row, idx) =>
    new TableRow({
      children: [
        simpleCell(`${idx + 1}. ${row.criterio}`, { bold: true, size: 9 }),
        simpleCell(row.excelente,      { size: 9, bg: "F0FDF4" }),
        simpleCell(row.satisfactorio,  { size: 9, bg: "EFF6FF" }),
        simpleCell(row.enProceso,      { size: 9, bg: "FFFBEB" }),
        simpleCell(row.noAlcanza,      { size: 9, bg: "FEF2F2" }),
      ],
    })
  );
  // Total 15718 DXA — balanceado para 5 columnas
  return new Table({
    width: { size: 15718, type: WidthType.DXA },
    columnWidths: [3400, 3080, 3080, 3080, 3078],
    rows: [hRow, ...dRows],
  });
}

/** Genera las filas de la sección Rúbrica de Evaluación (req 5) */
function crearSeccionRubrica(semana: PlanificacionSemanal): TableRow[] {
  // Recolectar rúbricas únicas por código de destreza
  const rubricasPorDestreza = new Map<string, Array<{ criterio: string; excelente: string; satisfactorio: string; enProceso: string; noAlcanza: string }>>();
  for (const dia of (["lunes", "martes", "miercoles", "jueves", "viernes"] as const)) {
    const config = semana.dias[dia];
    if (!config?.activo) continue;
    for (const hora of config.horas) {
      const plan = hora.temaSeleccionado as any;
      if (!plan?.rubricaSemanal?.length) continue;
      if (!rubricasPorDestreza.has(hora.codigoDestreza)) {
        rubricasPorDestreza.set(hora.codigoDestreza, plan.rubricaSemanal);
      }
    }
  }
  if (rubricasPorDestreza.size === 0) return [];

  const filas: TableRow[] = [sectionRow("RÚBRICA DE EVALUACIÓN")];

  for (const [codigo, rubrica] of rubricasPorDestreza.entries()) {
    // Subheader por destreza
    filas.push(new TableRow({
      children: [
        simpleCell(`Destreza: ${codigo}`, { bold: true, size: 9, bg: "1A3A5C", color: WHITE, colspan: 6 }),
      ],
    }));
    // Tabla de rúbrica como nested table en un single-cell colspan=6
    filas.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 6,
          borders: BORDER_DEF,
          verticalAlign: VerticalAlign.TOP,
          children: [rubricaInnerTable(rubrica)] as any,
        }),
      ],
    }));
  }

  return filas;
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

export async function generarWordSemanal(
  semana: PlanificacionSemanal,
  adaptaciones?: AdaptacionCurricular[],
): Promise<Blob> {
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
              bold: true, size: 18, color: WHITE, font: "Arial",
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: `Semana: ${semana.semanaInicio} — ${semana.semanaFin}`,
              size: 18, color: "A8C4E0", font: "Arial",
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
      simpleCell("Institución:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.institucion || "—", { size: 9, colspan: 2 }),
      simpleCell("Docente:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.docente || "—", { size: 9, colspan: 2 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Asignatura:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell((semana as any).asignatura || semana.nivel || "—", { size: 9 }),
      simpleCell("Subnivel:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell((semana as any).subnivel || semana.nivel || "—", { size: 9 }),
      simpleCell("Trimestre:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.trimestre || "—", { size: 9 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Grado / Curso:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(`${semana.grado || "—"} — Paralelo ${semana.paralelo || "—"}`, { size: 9 }),
      simpleCell("Nivel:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.nivel || "—", { size: 9 }),
      simpleCell("Períodos:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.periodos || "—", { size: 9 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Unidad N.°:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.numeroUnidad || "—", { size: 9 }),
      simpleCell("Título de la unidad:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.tituloUnidad || "—", { size: 9, colspan: 3 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      simpleCell("Objetivos de la unidad:", { bold: true, size: 9, bg: BG_SUBHEAD }),
      simpleCell(semana.objetivosUnidad || "—", { size: 9, colspan: 5 }),
    ],
  }));

  // ══════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════
  // CABECERA DE COLUMNAS
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("DESARROLLO SEMANAL POR DÍA"));
  rows.push(new TableRow({
    children: [
      simpleCell("DÍA",
        { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE, align: AlignmentType.CENTER }),
      simpleCell("DESTREZAS CON CRITERIOS\nDE DESEMPEÑO",
        { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE }),
      simpleCell("INDICADORES DE\nEVALUACIÓN",
        { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE }),
      // Cabecera ESTRATEGIAS con leyenda DUA inline
      new TableCell({
        shading: shade(BG_COLHEAD),
        borders: BORDER_DEF,
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({
            children: [new TextRun({
              text: "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE",
              bold: true, size: 18, color: WHITE, font: "Arial",
            })],
          }),
          new Paragraph({
            children: [new TextRun({
              text: "Estrategias metodológicas diversificadas con base al DUA",
              size: 18, color: "A8C4E0", font: "Arial", italics: true,
            })],
          }),
          duaLegendPara(),
        ],
      }),
      simpleCell("RECURSOS",
        { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE }),
      simpleCell("ACTIVIDADES\nEVALUATIVAS",
        { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE }),
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
                  size: 18, color: "888888", font: "Arial",
                })],
              })] : []),
            ],
          })
        : undefined;

      // ── Col 2: DESTREZA DCD (código + descripción, sin duplicar) ────────
      const chipsRuns = iconosDcdRuns(hora.codigoDestreza);
      const dcdChildren: Paragraph[] = [
        new Paragraph({
          children: [new TextRun({
            text: hora.codigoDestreza || "—",
            bold: true, size: 18, color: "003366", font: "Arial",
          })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: destreza?.descripcion || "",
            size: 18, font: "Arial", color: "222222",
          })],
          spacing: { after: chipsRuns.length ? 40 : 0 },
        }),
        ...(chipsRuns.length
          ? [new Paragraph({ spacing: { after: 0 }, children: chipsRuns })]
          : []),
      ];

      // ── Col 3: INDICADORES DE EVALUACIÓN ────────────────────────────────
      const indicadores = destreza?.indicadoresEvaluacion ?? [];
      const indChildren: Paragraph[] = indicadores.length
        ? indicadores.map((ind, i) => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun({ text: ind, size: 18, font: "Arial", color: BLACK })],
          }))
        : [new Paragraph({ children: [new TextRun({ text: "—", size: 18, font: "Arial", color: "999999" })] })];

      // ── Col 4: ESTRATEGIAS ERCA + DUA ────────────────────────────────────
      const estChildren: Paragraph[] = [];

      // Objetivo de clase al inicio de la columna estrategias
      if (plan.objetivoClase) {
        estChildren.push(new Paragraph({
          shading: shade("F0F4FA"),
          spacing: { before: 0, after: 60 },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: "003366" } },
          indent: { left: 80 },
          children: [
            new TextRun({ text: "Objetivo: ", bold: true, size: 18, color: "003366", font: "Arial" }),
            new TextRun({ text: plan.objetivoClase, size: 18, italics: true, color: "333333", font: "Arial" }),
          ],
        }));
      }

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
          children: [new TextRun({ text: "—", size: 18, font: "Arial", color: "999999" })],
        }));
      }

      // ── Col 5: RECURSOS ──────────────────────────────────────────────────
      const recursos = plan.recursos ?? [];
      const recChildren: Paragraph[] = recursos.length
        ? recursos.map(r => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun({ text: r, size: 18, font: "Arial", color: BLACK })],
          }))
        : [new Paragraph({ children: [new TextRun({ text: "—", size: 18, font: "Arial", color: "999999" })] })];

      // ── Col 6: ACTIVIDADES EVALUATIVAS ───────────────────────────────────
      const evaChildren: Paragraph[] = [];
      const evalEst = (plan as any).evaluacionEstructurada;
      if (evalEst) {
        // Req 3: evaluación estructurada (Técnica / Instrumento / Evidencia / Criterio)
        for (const [label, value] of [
          ["Técnica:", evalEst.tecnica],
          ["Instrumento:", evalEst.instrumento],
          ["Evidencia:", evalEst.evidencia],
          ["Criterio:", evalEst.criterio],
        ] as [string, string][]) {
          if (value) {
            evaChildren.push(new Paragraph({
              spacing: { before: 20, after: 24 },
              children: [
                new TextRun({ text: label + " ", bold: true, size: 18, font: "Arial", color: "003366" }),
                new TextRun({ text: value, size: 18, font: "Arial", color: "333333" }),
              ],
            }));
          }
        }
      } else if (plan.evaluacionFormativa) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: plan.evaluacionFormativa, size: 18, font: "Arial", color: BLACK })],
          spacing: { after: 40 },
        }));
      }
      if (hora.tecnicasEvaluacion?.length) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: "Técnicas:", bold: true, size: 18, font: "Arial", color: "003366" })],
          spacing: { after: 20 },
        }));
        hora.tecnicasEvaluacion.forEach(t =>
          evaChildren.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: t, size: 18, font: "Arial", color: BLACK })],
          }))
        );
      }
      const criterios = destreza?.criteriosEvaluacion ?? [];
      if (criterios.length) {
        evaChildren.push(new Paragraph({
          children: [new TextRun({ text: "Criterios oficiales:", bold: true, size: 18, font: "Arial", color: "003366" })],
          spacing: { before: 40, after: 20 },
        }));
        criterios.forEach(c =>
          evaChildren.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: c, size: 18, font: "Arial", color: "333333" })],
          }))
        );
      }
      if (evaChildren.length === 0) {
        evaChildren.push(new Paragraph({ children: [new TextRun({ text: "—", size: 18, font: "Arial", color: "999999" })] }));
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
  // ADAPTACIONES CURRICULARES (antes de las firmas)
  // ══════════════════════════════════════════════════════════════
  const adaptacionesRows = crearSeccionAdaptacionesCurriculares(
    adaptaciones ?? semana.adaptacionesCurriculares ?? []
  );
  rows.push(...adaptacionesRows);

  // ══════════════════════════════════════════════════════════════
  // FIRMAS
  // ══════════════════════════════════════════════════════════════
  rows.push(sectionRow("FIRMAS Y APROBACIÓN"));

  // Fila con etiquetas de cargo (fondo azul oscuro)
  rows.push(new TableRow({
    children: [
      simpleCell("ELABORADO POR", { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE, colspan: 2, align: AlignmentType.CENTER }),
      simpleCell("REVISADO POR", { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE, colspan: 2, align: AlignmentType.CENTER }),
      simpleCell("APROBADO POR", { bold: true, size: 9, bg: BG_COLHEAD, color: WHITE, colspan: 2, align: AlignmentType.CENTER }),
    ],
  }));

  // Fila con el cargo
  rows.push(new TableRow({
    children: [
      simpleCell("Docente", { bold: false, size: 9, bg: BG_SUBHEAD, colspan: 2, align: AlignmentType.CENTER }),
      simpleCell("Vicerrector/a", { bold: false, size: 9, bg: BG_SUBHEAD, colspan: 2, align: AlignmentType.CENTER }),
      simpleCell("Director/a - Rector/a", { bold: false, size: 9, bg: BG_SUBHEAD, colspan: 2, align: AlignmentType.CENTER }),
    ],
  }));

  // Fila con nombre y espacio para firma
  const firmaCell = (nombre: string) => new TableCell({
    columnSpan: 2,
    borders: BORDER_DEF,
    verticalAlign: VerticalAlign.TOP,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 200 },
        children: [new TextRun({ text: nombre || " ", size: 18, font: "Arial", color: "333333" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "003366" } },
        spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "Firma", size: 18, color: "888888", font: "Arial", italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 40 },
        children: [new TextRun({ text: "Fecha: ____________", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  });

  rows.push(new TableRow({
    children: [
      firmaCell(semana.docente),
      firmaCell(""),
      firmaCell(""),
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
