/**
 * Genera el documento Word (.docx) para Planificación Microcurricular
 * Formato oficial MinEduc Ecuador 2026-2027 — A4 LANDSCAPE
 * Replica la misma estructura que el generador PDF.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType, HeightRule,
} from "docx";
import type { Planificacion, AdaptacionCurricular } from "../data/types";
import { AREAS_INFO, SUBNIVEL_NAMES, TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO, type TipoNEE, type GradoAdaptacion } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { HABILIDADES_SOCIOEMOCIONALES } from "../data/habilidades-socioemocionales";

// ── Colores (mismo esquema que el PDF) ────────────────────────────────────────
const ROSA      = "D4A5C7";  // encabezados sección (morado/rosa)
const ROSA_DARK = "B07595";  // borde sección
const LABEL_BG  = "F5E6F0";  // fondo etiquetas
const HEADER_BG = "003366";  // azul MinEduc
const WHITE     = "FFFFFF";
const BLACK     = "1A1A1A";

// Colores ERCA
const EXP_C  = "2980B9";
const REF_C  = "8E44AD";
const CONC_C = "27AE60";
const APL_C  = "E67E22";

// ── Dimensiones A4 landscape ──────────────────────────────────────────────────
// 16838 × 11906 twips. Márgenes 560 cada lado.
const PW    = 16838;
const MAR   = 560;
const TW    = PW - 2 * MAR;  // 15718 twips

// ── Bordes estándar ────────────────────────────────────────────────────────────
const B = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

const B_NONE = {
  top:    { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function p(
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; align?: string; italic?: boolean } = {}
): Paragraph {
  return new Paragraph({
    alignment: (opts.align as any) || AlignmentType.LEFT,
    spacing: { after: 0, before: 0 },
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
        italics: opts.italic ?? false,
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

function makeTable(
  rows: TableRow[],
  totalW: number,
  colWidths: number[]
): Table {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

/** Fila de título de sección (fondo rosa, texto bold) */
function sectionTitleRow(label: string, cols: number, colW: number[]): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 8, color: BLACK })], colW.reduce((a, b) => a + b, 0), {
        cs: cols, bg: ROSA,
      }),
    ],
  });
}

/** Párrafo separador entre tablas (sin espaciado) */
function sep(): Paragraph {
  return new Paragraph({ spacing: { after: 60, before: 0 }, children: [] });
}

// ── Datos helpers ──────────────────────────────────────────────────────────────
function resolveHabilidades(plan: Planificacion, isEFL: boolean): string {
  const ids: string[] = (plan as any).habilidadesSocioemocionales || [];
  if (ids.length === 0) return isEFL ? "Not specified" : "No especificadas";
  return ids.map(id => {
    const h = HABILIDADES_SOCIOEMOCIONALES.find(x => x.id === id);
    return h ? (isEFL ? h.nameEN : h.nombre) : id;
  }).filter(Boolean).join(", ");
}

function resolveMetodologias(plan: Planificacion, isEFL: boolean): string {
  const ids: string[] = (plan.metodologiasActivas as string[] | undefined) || [];
  if (ids.length === 0) return "—";
  return ids.map(id => {
    const m = METODOLOGIAS_ACTIVAS.find(x => x.id === id);
    return m ? (isEFL ? m.nameEN : m.nombre) : id;
  }).filter(Boolean).join(", ");
}

function resolveTecnicas(plan: Planificacion, isEFL: boolean): string {
  const ids: string[] = (plan as any).tecnicasEvaluacionSeleccionadas || (plan as any).tecnicasEvaluacion || [];
  if (!Array.isArray(ids) || ids.length === 0) return "Lista de cotejo, rúbrica de evaluación";
  return ids.map(id => {
    const t = TECNICAS_EVALUACION.find(x => x.id === id);
    return t ? (isEFL ? t.nameEN : t.nombre) : id;
  }).filter(Boolean).join(", ");
}

/** Construye las filas ERCA para la celda de estrategias */
function buildERCAParagraphs(plan: Planificacion, isEFL: boolean): Paragraph[] {
  const est = (plan as any).temaSeleccionado?.estructura || (plan as any).estructura;
  if (!est) {
    const fallback = (plan as any).actividades || "";
    return [p(fallback || (isEFL ? "Not specified" : "No especificadas"), { size: 7 })];
  }

  const fases = [
    { key: "experiencia",       label: isEFL ? "EXPERIENCE"        : "EXPERIENCIA",        color: EXP_C  },
    { key: "reflexion",         label: isEFL ? "REFLECTION"        : "REFLEXIÓN",          color: REF_C  },
    { key: "conceptualizacion", label: isEFL ? "CONCEPTUALIZATION" : "CONCEPTUALIZACIÓN",  color: CONC_C },
    { key: "aplicacion",        label: isEFL ? "APPLICATION"       : "APLICACIÓN",         color: APL_C  },
  ];

  const result: Paragraph[] = [];

  // Leyenda DUA
  result.push(new Paragraph({
    spacing: { after: 40, before: 0 },
    children: [
      new TextRun({ text: "▪ ", color: "EC4899", size: 14, font: "Arial" }),
      new TextRun({ text: isEFL ? "Representation  " : "Representación  ", size: 14, font: "Arial" }),
      new TextRun({ text: "▪ ", color: "1E3A5F", size: 14, font: "Arial" }),
      new TextRun({ text: isEFL ? "Action & Expression  " : "Acción y Expresión  ", size: 14, font: "Arial" }),
      new TextRun({ text: "▪ ", color: "22C55E", size: 14, font: "Arial" }),
      new TextRun({ text: isEFL ? "Engagement" : "Implicación", size: 14, font: "Arial" }),
    ],
  }));

  for (const fase of fases) {
    const data = est[fase.key];
    if (!data) continue;

    const actividades: string[] = data.actividades || [];
    const duaActividades: any[] = data.duaActividades || [];
    const duracion: string = data.duracion || "";

    // Cabecera fase (colored background via shading won't work in a paragraph,
    // so we use colored text bold)
    result.push(new Paragraph({
      spacing: { after: 20, before: 60 },
      children: [
        new TextRun({
          text: `${fase.label}${duracion ? ` (${duracion})` : ""}`,
          bold: true, size: 15, color: fase.color, font: "Arial",
        }),
      ],
    }));

    result.push(new Paragraph({
      spacing: { after: 20, before: 0 },
      children: [new TextRun({ text: isEFL ? "Activities:" : "Actividades:", bold: true, size: 14, font: "Arial" })],
    }));

    actividades.forEach((act: string, idx: number) => {
      const dua = duaActividades[idx] || {};
      const cleanAct = act
        .replace(/\s*\(\s*I\s*:\s*(true|false)[^)]*\)\s*/gi, "")
        .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
        .trim();

      const runs: TextRun[] = [
        new TextRun({ text: `${idx + 1}. ${cleanAct} `, size: 14, font: "Arial" }),
      ];
      if (dua.representacion)  runs.push(new TextRun({ text: "▪", color: "EC4899", size: 14, font: "Arial" }));
      if (dua.accionExpresion) runs.push(new TextRun({ text: "▪", color: "1E3A5F", size: 14, font: "Arial" }));
      if (dua.implicacion)     runs.push(new TextRun({ text: "▪", color: "22C55E", size: 14, font: "Arial" }));

      result.push(new Paragraph({ spacing: { after: 20, before: 0 }, children: runs }));
    });
  }

  return result;
}

// ── Adaptaciones curriculares (planificación diaria) ─────────────────────────

const ADAPT_DARK  = "4A1942";  // violeta oscuro
const ADAPT_MID   = "7B2D8B";  // violeta medio
const ADAPT_LIGHT = "F9F5FF";  // violeta muy claro

/** Fila de título de la sección de adaptaciones (fondo violeta oscuro) */
function adaptTitleRow(label: string): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 9, color: WHITE })], TW, { cs: 1, bg: ADAPT_DARK }),
    ],
  });
}

/** Celda de identificación del estudiante (izquierda) */
function adaptIdParagraphs(
  adap: AdaptacionCurricular,
  tipoNombre: string,
  gradoInfo: { nombre: string },
): Paragraph[] {
  const paras: Paragraph[] = [
    p("IDENTIFICACIÓN", { bold: true, size: 7, color: ADAPT_DARK }),
    p(""),
    p(`Código: ${adap.codigoEstudiante}`, { size: 7 }),
    p(`NEE: ${tipoNombre}`, { size: 7 }),
    p(`Grado de adaptación: ${gradoInfo.nombre}`, { size: 7 }),
  ];
  if (adap.descripcionNecesidad) {
    paras.push(p(""));
    paras.push(p(adap.descripcionNecesidad, { size: 6, italic: true, color: "555555" }));
  }
  return paras;
}

/** Tabla de 3 columnas para bloques de acceso/proceso/resultado */
function adaptBlockTable(
  items: Array<{ categoria: string; descripcion: string; estrategias: string[] }>,
  headerBg: string,
): Table {
  const cols = [3300, 5200, TW - 8500];
  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        tc([p("CATEGORÍA", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[0], { bg: headerBg }),
        tc([p("DESCRIPCIÓN", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[1], { bg: headerBg }),
        tc([p("ESTRATEGIAS", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[2], { bg: headerBg }),
      ],
    }),
    ...items.map(item =>
      new TableRow({
        children: [
          tc([p(item.categoria, { bold: true, size: 7 })], cols[0], { bg: "F5F3FF" }),
          tc([p(item.descripcion, { size: 7 })], cols[1]),
          tc(item.estrategias.map(e => p(`• ${e}`, { size: 7 })), cols[2]),
        ],
      })
    ),
  ];
  return makeTable(rows, TW, cols);
}

/** Tabla de una columna para listas (metodologías, recursos) */
function adaptBulletTable(items: string[], bg?: string): Table {
  return makeTable(
    items.map(item => new TableRow({ children: [tc([p(`• ${item}`, { size: 7 })], TW, { bg })] })),
    TW,
    [TW]
  );
}

/** Adaptación ERCA por día/clase — tabla de 3 columnas */
function adaptDiaTable(dp: any): Table {
  const left: Paragraph[] = [];
  if (dp.objetivo) left.push(p(`Objetivo: ${dp.objetivo}`, { size: 6, italic: true, color: "444444" }));
  if (dp.objetivoAdaptado) left.push(p(`Obj. adaptado: ${dp.objetivoAdaptado}`, { size: 7, bold: true }));

  const ERCA_CFG = [
    { key: "experiencia",       label: "EXPERIENCIA",       dark: "2980B9", light: "EBF5FB" },
    { key: "reflexion",         label: "REFLEXIÓN",         dark: "8E44AD", light: "F5EEF8" },
    { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", dark: "27AE60", light: "EAFAF1" },
    { key: "aplicacion",        label: "APLICACIÓN",        dark: "E67E22", light: "FEF9E7" },
  ] as const;
  for (const { key, label, dark, light } of ERCA_CFG) {
    const val = (dp.adaptacionERCA as any)?.[key];
    if (!val) continue;
    left.push(p(label, { bold: true, size: 7, color: WHITE }));
    left.push(p(val, { size: 7 }));
  }

  const middle: Paragraph[] = (dp.recursosAdaptados?.length || 0)
    ? dp.recursosAdaptados.map((r: string) => p(`• ${r}`, { size: 7 }))
    : [p("—", { size: 7 })];

  const right: Paragraph[] = [p(dp.evaluacionAdaptada || "—", { size: 7 })];

  const cols = [Math.floor(TW * 0.46), Math.floor(TW * 0.27), TW - Math.floor(TW * 0.46) - Math.floor(TW * 0.27)];
  return makeTable([
    new TableRow({
      children: [
        tc([p(String(dp.dia || "Clase").toUpperCase(), { bold: true, size: 7 })], TW, { cs: 3, bg: ADAPT_LIGHT }),
      ],
    }),
    new TableRow({
      children: [
        tc([p("ESTRATEGIAS ERCA ADAPTADAS", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[0], { bg: "374151" }),
        tc([p("RECURSOS ADAPTADOS", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[1], { bg: "374151" }),
        tc([p("EVALUACIÓN ADAPTADA", { bold: true, size: 7, color: WHITE, align: AlignmentType.CENTER })], cols[2], { bg: "374151" }),
      ],
    }),
    new TableRow({
      children: [
        tc(left, cols[0]),
        tc(middle, cols[1]),
        tc(right, cols[2]),
      ],
    }),
  ], TW, cols);
}

/**
 * Genera la sección de Adaptaciones Curriculares para la planificación diaria.
 * Devuelve array vacío si no hay adaptaciones activas (documento idéntico al original).
 */
function crearSeccionAdaptacionesDiarias(plan: Planificacion): (Table | Paragraph)[] {
  const adaptaciones: AdaptacionCurricular[] = (plan as any).adaptacionesCurriculares || [];
  const activas = adaptaciones.filter(a => a.incluirEnExportacion !== false);
  if (activas.length === 0) return [];

  const items: (Table | Paragraph)[] = [];
  items.push(makeTable(
    [adaptTitleRow(`ADAPTACIONES CURRICULARES — ${activas.length} estudiante${activas.length !== 1 ? "s" : ""}`)],
    TW,
    [TW]
  ));

  for (const adap of activas) {
    const tipoNombre = TIPOS_NEE_INFO[adap.tipoNecesidad as TipoNEE]?.nombre ?? adap.tipoNecesidad;
    const gradoInfo = GRADO_ADAPTACION_INFO[adap.gradoAdaptacion as GradoAdaptacion];
    const codigoLabel = adap.nombreEstudiante
      ? `${adap.nombreEstudiante} (${adap.codigoEstudiante})`
      : adap.codigoEstudiante;

    const right: (Paragraph | Table)[] = [];

    // Destreza original
    right.push(new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Destreza: ", bold: true, size: 14, font: "Arial", color: "003366" }),
        new TextRun({ text: adap.codigoDestreza, bold: true, size: 14, font: "Arial", color: BLACK }),
        ...(adap.descripcionDestreza ? [new TextRun({
          text: " — " + adap.descripcionDestreza, size: 14, italics: true, font: "Arial", color: "444444",
        })] : []),
      ],
    }));

    // Grado 2/3: destreza, criterio e indicadores adaptados
    if (adap.gradoAdaptacion >= 2) {
      const infoRows: TableRow[] = [];
      if (adap.destrezaAdaptada) {
        infoRows.push(new TableRow({ children: [
          tc([p("DESTREZA ADAPTADA:", { bold: true, size: 7, color: ADAPT_DARK })], 3500, { bg: "EDE9FE" }),
          tc([p(adap.destrezaAdaptada, { size: 7, bold: true })], TW - 3500),
        ]}));
      }
      if (adap.criterioAdaptado) {
        infoRows.push(new TableRow({ children: [
          tc([p("Criterio adaptado:", { bold: true, size: 7, color: ADAPT_DARK })], 3500, { bg: "F5F3FF" }),
          tc([p(adap.criterioAdaptado, { size: 7 })], TW - 3500),
        ]}));
      }
      if (adap.indicadoresAdaptados?.length) {
        infoRows.push(new TableRow({ children: [
          tc([p("Indicadores adaptados:", { bold: true, size: 7, color: ADAPT_DARK })], 3500, { bg: "F5F3FF" }),
          tc(adap.indicadoresAdaptados.map(ind => p(`• ${ind}`, { size: 7 })), TW - 3500),
        ]}));
      }
      if (infoRows.length) right.push(makeTable(infoRows, TW, [3500, TW - 3500]));
    }

    if (adap.adaptacionesPorDia?.length) {
      right.push(p("ADAPTACIONES POR DÍA", { bold: true, size: 8 }));
      adap.adaptacionesPorDia.forEach(dp => right.push(adaptDiaTable(dp)));
    } else {
      if (adap.adaptacionesAcceso?.length) {
        right.push(p("ADAPTACIONES DE ACCESO", { bold: true, size: 8, color: "1A3A5C" }));
        right.push(adaptBlockTable(adap.adaptacionesAcceso, "1A3A5C"));
      }
      if (adap.gradoAdaptacion >= 2 && adap.adaptacionesProceso?.length) {
        right.push(p("ADAPTACIONES DE PROCESO", { bold: true, size: 8, color: "8E44AD" }));
        right.push(adaptBlockTable(adap.adaptacionesProceso, "8E44AD"));
      }
      if (adap.gradoAdaptacion >= 3 && adap.adaptacionesResultado?.length) {
        right.push(p("ADAPTACIONES DE RESULTADO", { bold: true, size: 8, color: "E67E22" }));
        right.push(adaptBlockTable(adap.adaptacionesResultado, "E67E22"));
      }
      if (adap.metodologiasSugeridas?.length) {
        right.push(p("METODOLOGÍAS SUGERIDAS", { bold: true, size: 8, color: "003366" }));
        right.push(adaptBulletTable(adap.metodologiasSugeridas, "F0F4FA"));
      }
      if (adap.recursosEspecificos?.length) {
        right.push(p("RECURSOS ESPECÍFICOS", { bold: true, size: 8, color: "444444" }));
        right.push(adaptBulletTable(adap.recursosEspecificos));
      }
    }

    if (adap.seguimiento) {
      right.push(new Paragraph({
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({ text: "Seguimiento: ", bold: true, size: 14, font: "Arial", color: BLACK }),
          new TextRun({ text: adap.seguimiento, size: 14, font: "Arial", color: BLACK }),
        ],
      }));
    }
    if (adap.observaciones) {
      right.push(new Paragraph({
        spacing: { after: 20 },
        children: [new TextRun({ text: adap.observaciones, italics: true, size: 14, font: "Arial", color: "555555" })],
      }));
    }

    const LEFT_W = Math.floor(TW * 0.25);
    const RIGHT_W = TW - LEFT_W;

    items.push(makeTable([
      new TableRow({
        children: [
          tc([p(`${codigoLabel}  ·  ${tipoNombre}  ·  ${gradoInfo.nombre}`, { bold: true, size: 8, color: WHITE })], TW, { cs: 2, bg: ADAPT_MID }),
        ],
      }),
      new TableRow({
        children: [
          tc(adaptIdParagraphs(adap, tipoNombre, gradoInfo), LEFT_W, { bg: ADAPT_LIGHT }),
          tc(right as any, RIGHT_W),
        ],
      }),
    ], TW, [LEFT_W, RIGHT_W]));
  }

  return items;
}

// ── Exportación principal ──────────────────────────────────────────────────────
export async function generarWordPlanificacion(plan: Planificacion): Promise<Blob> {
  const isEFL = plan.destreza?.area === "EFL";
  const areaInfo = AREAS_INFO[plan.destreza?.area as keyof typeof AREAS_INFO];
  const subnivelName = SUBNIVEL_NAMES[(plan.destreza?.subnivel ?? 1) as keyof typeof SUBNIVEL_NAMES] || "—";
  const t = (es: string, en: string) => isEFL ? en : es;

  const children: (Table | Paragraph)[] = [];

  // ══════════════════════════════════════════════════════════════════════════
  // ENCABEZADO — tabla de 3 celdas: SELLO | INSTITUCIÓN | AÑO LECTIVO
  // ══════════════════════════════════════════════════════════════════════════
  const C_SELLO = 2000;
  const C_INST  = TW - 4000;
  const C_ANO   = 2000;

  children.push(makeTable(
    [new TableRow({ children: [
      tc([p("SELLO", { bold: true, size: 8, color: HEADER_BG })], C_SELLO, { borders: B }),
      tc([p(plan.institucion || t("UNIDAD EDUCATIVA", "EDUCATIONAL INSTITUTION"), { bold: true, size: 10, color: HEADER_BG, align: AlignmentType.CENTER })], C_INST, { borders: B }),
      tc([p("2026 - 2027", { bold: true, size: 10, color: HEADER_BG, align: AlignmentType.RIGHT })], C_ANO, { borders: B }),
    ]})],
    TW, [C_SELLO, C_INST, C_ANO]
  ));

  // TÍTULO PRINCIPAL
  children.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }));
  children.push(makeTable(
    [new TableRow({ children: [
      tc([p(t(`PLANIFICACIÓN MICROCURRICULAR DE CLASE — ${areaInfo?.name?.toUpperCase() || ""}`,
             `MICROCURRICULAR LESSON PLAN — ${areaInfo?.name?.toUpperCase() || ""}`),
        { bold: true, size: 10, color: BLACK, align: AlignmentType.CENTER })], TW, { cs: 1, bg: ROSA }),
    ]})],
    TW, [TW]
  ));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 1: DATOS INFORMATIVOS (6 columnas)
  // ══════════════════════════════════════════════════════════════════════════
  const D1 = Math.floor(TW * 0.14);  // label  ~2200
  const D2 = Math.floor(TW * 0.14);  // value  ~2200
  const D3 = Math.floor(TW * 0.16);  // label  ~2515
  const D4 = Math.floor(TW * 0.20);  // value  ~3143
  const D5 = Math.floor(TW * 0.12);  // label  ~1886
  const D6 = TW - D1 - D2 - D3 - D4 - D5; // value (resto)

  const nivel = (plan as any).nivel || (plan.destreza?.subnivel <= 4 ? "Educación General Básica" : "Bachillerato General Unificado");

  function dRow(l1: string, v1: string, l2: string, v2: string, l3: string, v3: string): TableRow {
    return new TableRow({ children: [
      tc([p(l1, { bold: true, size: 7 })], D1, { bg: LABEL_BG }),
      tc([p(v1, { size: 7 })],             D2),
      tc([p(l2, { bold: true, size: 7 })], D3, { bg: LABEL_BG }),
      tc([p(v2, { size: 7 })],             D4),
      tc([p(l3, { bold: true, size: 7 })], D5, { bg: LABEL_BG }),
      tc([p(v3, { size: 7 })],             D6),
    ]});
  }

  children.push(makeTable([
    sectionTitleRow(t("1. DATOS INFORMATIVOS", "1. GENERAL INFORMATION"), 6, [D1,D2,D3,D4,D5,D6]),
    dRow(t("Grado/Curso:", "Grade/Level:"),   plan.grado || "—",
         t("Período Pedagógico:", "Period:"), (plan as any).periodoPedagogico || areaInfo?.name || "—",
         t("Trimestre:", "Quarter:"),          plan.trimestre || "Primero"),
    dRow(t("Nivel:", "Level:"),               nivel,
         t("Fecha Inicio:", "Start Date:"),   (plan as any).fechaInicio || "___/___/______",
         "", ""),
    dRow(t("Subnivel:", "Sublevel:"),         subnivelName,
         t("Nombre Docente:", "Teacher:"),    plan.docente || "—",
         t("Fecha Fin:", "End Date:"),        (plan as any).fechaFin || "___/___/______"),
    new TableRow({ children: [
      tc([p(t("Paralelo:", "Section:"), { bold: true, size: 7 })], D1, { bg: LABEL_BG }),
      tc([p(plan.paralelo || "—", { size: 7 })], D2),
      tc([p("", { size: 7 })], D3 + D4 + D5 + D6, { cs: 4 }),
    ]}),
  ], TW, [D1, D2, D3, D4, D5, D6]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 2: PRINCIPIOS DUA
  // ══════════════════════════════════════════════════════════════════════════
  const DUA_L = Math.floor(TW * 0.55);
  const DUA_R = TW - DUA_L;

  const duaPrincipios: Paragraph[] = [
    new Paragraph({ spacing: { after: 30, before: 0 }, children: [
      new TextRun({ text: "I. ", bold: true, size: 15, font: "Arial" }),
      new TextRun({ text: t("Proporcionar múltiples formas de representación: ¿qué?", "Provide multiple means of representation: What?"), size: 15, font: "Arial" }),
      new TextRun({ text: " ▪", color: "EC4899", size: 15, font: "Arial" }),
    ]}),
    new Paragraph({ spacing: { after: 30, before: 0 }, children: [
      new TextRun({ text: "II. ", bold: true, size: 15, font: "Arial" }),
      new TextRun({ text: t("Proporcionar múltiples formas de acción y expresión: ¿Cómo?", "Provide multiple means of action and expression: How?"), size: 15, font: "Arial" }),
      new TextRun({ text: " ▪", color: "1E3A5F", size: 15, font: "Arial" }),
    ]}),
    new Paragraph({ spacing: { after: 0, before: 0 }, children: [
      new TextRun({ text: "III. ", bold: true, size: 15, font: "Arial" }),
      new TextRun({ text: t("Proporcionar múltiples formas de implicación o participación: ¿Por qué?", "Provide multiple means of engagement or participation: Why?"), size: 15, font: "Arial" }),
      new TextRun({ text: " ▪", color: "22C55E", size: 15, font: "Arial" }),
    ]}),
  ];

  const pct = (plan as any).estilosAprendizajePorcentaje;
  const estiloLines = [
    `• VISUAL${pct ? ` (${pct.visual}%)` : ""}: ${t("diagramas, gráficas, colores, textos, esquemas.", "diagrams, graphics, colors, texts, outlines.")}`,
    `• AUDITIVO${pct ? ` (${pct.auditivo}%)` : ""}: ${t("debates, discusiones, seminarios, música.", "debates, discussions, seminars, music.")}`,
    `• LECTOR–ESCRITOR${pct ? ` (${pct.lectorEscritor}%)` : ""}: ${t("libros, textos, lecturas, toma de notas.", "books, texts, readings, note-taking.")}`,
    `• KINESTÉSICO${pct ? ` (${pct.kinestesico}%)` : ""}: ${t("demostraciones, actividades físicas, juegos de roles.", "demonstrations, physical activities, role plays.")}`,
  ];

  children.push(makeTable([
    sectionTitleRow(t("2. PRINCIPIOS DUA", "2. UDL PRINCIPLES"), 2, [DUA_L, DUA_R]),
    new TableRow({ children: [
      tc(duaPrincipios, DUA_L),
      tc([
        p(t("3. ESTILOS DE APRENDIZAJE:", "3. LEARNING STYLES:"), { bold: true, size: 7 }),
        ...estiloLines.map(l => p(l, { size: 7 })),
      ], DUA_R),
    ]}),
  ], TW, [DUA_L, DUA_R]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 4: HABILIDADES SOCIOEMOCIONALES
  // ══════════════════════════════════════════════════════════════════════════
  children.push(makeTable([
    sectionTitleRow(t("4. HABILIDADES SOCIOEMOCIONALES ASOCIADAS", "4. ASSOCIATED SOCIOEMOTIONAL SKILLS"), 1, [TW]),
    new TableRow({ children: [tc([p(resolveHabilidades(plan, isEFL), { size: 8 })], TW)] }),
  ], TW, [TW]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 5: OBJETIVOS
  // ══════════════════════════════════════════════════════════════════════════
  const objText = (plan as any).objetivoAprendizaje
    || (Array.isArray(plan.destreza?.objetivos) ? plan.destreza.objetivos.join("\n") : plan.destreza?.objetivos || "—");

  children.push(makeTable([
    sectionTitleRow(t("5. OBJETIVOS", "5. OBJECTIVES"), 1, [TW]),
    new TableRow({ children: [tc([p(objText, { size: 8 })], TW)] }),
  ], TW, [TW]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 6: CRITERIOS DE EVALUACIÓN
  // ══════════════════════════════════════════════════════════════════════════
  const criterios: string[] = plan.destreza?.criteriosEvaluacion || [];
  const criteriosText = criterios.length > 0 ? criterios.join("\n") : "—";

  children.push(makeTable([
    sectionTitleRow(t("6. CRITERIOS DE EVALUACIÓN", "6. ASSESSMENT CRITERIA"), 1, [TW]),
    new TableRow({ children: [tc([p(criteriosText, { size: 8 })], TW)] }),
  ], TW, [TW]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // TEMA (si existe)
  // ══════════════════════════════════════════════════════════════════════════
  const temaTitulo: string = (plan as any).temaSeleccionado?.titulo || (plan as any).temaClase || "";
  if (temaTitulo) {
    children.push(makeTable([
      new TableRow({ children: [
        tc([p(`${t("Tema", "Topic")}: ${temaTitulo}`, { bold: true, size: 9, color: HEADER_BG })], TW, { bg: "EAF2F8" }),
      ]}),
    ], TW, [TW]));
    children.push(sep());
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TABLA PRINCIPAL: Destreza | Indicadores | Estrategias | Recursos | Evaluación
  // Proporciones del PDF: 20% | 18% | 32% | 12% | 18%
  // ══════════════════════════════════════════════════════════════════════════
  const M1 = Math.floor(TW * 0.20);  // Destreza
  const M2 = Math.floor(TW * 0.18);  // Indicadores
  const M3 = Math.floor(TW * 0.32);  // Estrategias
  const M4 = Math.floor(TW * 0.12);  // Recursos
  const M5 = TW - M1 - M2 - M3 - M4; // Evaluación

  // Recursos
  const recursosText: string = (plan as any).temaSeleccionado?.recursos?.join(", ")
    || (Array.isArray(plan.recursos) ? (plan.recursos as string[]).join(", ") : (plan.recursos as any) || "—");

  // Evaluación formativa
  const evaluacionText: string = (plan as any).temaSeleccionado?.evaluacionFormativa
    || (plan as any).evaluacion || "—";

  // Indicadores de evaluación
  const indicadores: string[] = plan.destreza?.indicadoresEvaluacion || [];
  const indicadoresText = indicadores.length > 0 ? indicadores.join("\n") : "—";

  // Técnicas e instrumentos
  const tecnicasText = (plan as any).tecnicasInstrumentos || t(
    "Observación de participación, análisis de casos.",
    "Direct observation, participation analysis."
  );
  const instrumentosText = resolveTecnicas(plan, isEFL);

  // Estrategias ERCA
  const ercaParas = buildERCAParagraphs(plan, isEFL);

  children.push(makeTable([
    // Cabecera
    new TableRow({
      tableHeader: true,
      children: [
        tc([p(t("DESTREZAS CON CRITERIOS DE DESEMPEÑO", "PERFORMANCE CRITERIA SKILLS"), { bold: true, size: 7, color: BLACK, align: AlignmentType.CENTER })], M1, { bg: ROSA }),
        tc([p(t("INDICADORES DE EVALUACIÓN", "ASSESSMENT INDICATORS"), { bold: true, size: 7, color: BLACK, align: AlignmentType.CENTER })], M2, { bg: ROSA }),
        tc([p(t("ESTRATEGIAS METODOLÓGICAS ACTIVAS Y DIVERSIFICADAS CON BASE AL DUA", "ACTIVE METHODOLOGICAL STRATEGIES AND UDL-BASED DIVERSIFIED STRATEGIES"), { bold: true, size: 7, color: BLACK, align: AlignmentType.CENTER })], M3, { bg: ROSA }),
        tc([p(t("RECURSOS", "RESOURCES"), { bold: true, size: 7, color: BLACK, align: AlignmentType.CENTER })], M4, { bg: ROSA }),
        tc([p(t("ACTIVIDADES EVALUATIVAS", "ASSESSMENT ACTIVITIES"), { bold: true, size: 7, color: BLACK, align: AlignmentType.CENTER })], M5, { bg: ROSA }),
      ],
    }),
    // Contenido
    new TableRow({
      children: [
        // Destreza
        tc([
          p(plan.destreza?.codigo || "—", { bold: true, size: 8 }),
          p(""),
          p(plan.destreza?.descripcion || "—", { size: 8 }),
        ], M1),
        // Indicadores
        tc([
          p(t("Indicadores de evaluación:", "Assessment indicators:"), { bold: true, size: 7 }),
          ...indicadores.map((ind, i) => p(`${i + 1}. ${ind}`, { size: 7 })),
        ], M2),
        // Estrategias ERCA
        tc(ercaParas, M3),
        // Recursos
        tc([p(recursosText, { size: 8 })], M4),
        // Evaluación
        tc([
          p(t("Indicadores de evaluación:", "Assessment indicators:"), { bold: true, size: 7 }),
          p(evaluacionText, { size: 7 }),
          p(""),
          p(t("Técnica:", "Technique:"), { bold: true, size: 7 }),
          p(tecnicasText, { size: 7 }),
          p(""),
          p(t("Instrumento:", "Instrument:"), { bold: true, size: 7 }),
          p(instrumentosText, { size: 7 }),
        ], M5),
      ],
    }),
  ], TW, [M1, M2, M3, M4, M5]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // DUA DETALLADO
  // ══════════════════════════════════════════════════════════════════════════
  const dua = (plan as any).dua || {};
  const duaRows: TableRow[] = [
    sectionTitleRow(t("DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)", "UNIVERSAL DESIGN FOR LEARNING (UDL)"), 1, [TW]),
    new TableRow({ children: [
      tc([
        p(t("Principio 1: Múltiples formas de Representación", "Principle 1: Multiple Means of Representation"), { bold: true, size: 7, color: "EC4899" }),
        p(t("El QUÉ del aprendizaje", "The WHAT of learning"), { size: 7, italic: true, color: "666666" }),
        p(dua.representacion || t("Presentar la información mediante recursos visuales, auditivos y manipulativos.", "Present information through visual, auditory, and hands-on resources."), { size: 7 }),
      ], TW, { cs: 1 }),
    ]}),
    new TableRow({ children: [
      tc([
        p(t("Principio 2: Múltiples formas de Acción y Expresión", "Principle 2: Multiple Means of Action and Expression"), { bold: true, size: 7, color: "1E3A5F" }),
        p(t("El CÓMO del aprendizaje", "The HOW of learning"), { size: 7, italic: true, color: "666666" }),
        p(dua.accionExpresion || t("Permitir que los estudiantes demuestren lo aprendido de forma oral, escrita, gráfica o práctica.", "Allow students to demonstrate learning through oral, written, graphic, or practical means."), { size: 7 }),
      ], TW, { cs: 1 }),
    ]}),
    new TableRow({ children: [
      tc([
        p(t("Principio 3: Múltiples formas de Implicación", "Principle 3: Multiple Means of Engagement"), { bold: true, size: 7, color: "22C55E" }),
        p(t("El POR QUÉ del aprendizaje", "The WHY of learning"), { size: 7, italic: true, color: "666666" }),
        p(dua.implicacion || t("Motivar a los estudiantes mediante actividades significativas y conexión con su contexto.", "Motivate students through meaningful activities and connection to their context."), { size: 7 }),
      ], TW, { cs: 1 }),
    ]}),
  ];
  children.push(makeTable(duaRows, TW, [TW]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // OBSERVACIONES
  // ══════════════════════════════════════════════════════════════════════════
  children.push(makeTable([
    sectionTitleRow(t("OBSERVACIONES", "OBSERVATIONS"), 1, [TW]),
    new TableRow({ children: [
      tc([p((plan as any).observaciones || " ", { size: 8 })], TW),
    ], height: { value: 400, rule: HeightRule.ATLEAST }}),
  ], TW, [TW]));

  children.push(sep());

  // ══════════════════════════════════════════════════════════════════════════
  // ADAPTACIONES CURRICULARES
  // ══════════════════════════════════════════════════════════════════════════
  children.push(...crearSeccionAdaptacionesDiarias(plan));

  // ══════════════════════════════════════════════════════════════════════════
  // FIRMAS — 3 columnas iguales
  // ══════════════════════════════════════════════════════════════════════════
  const F = Math.floor(TW / 3);
  const F3 = TW - F - F;

  children.push(makeTable([
    new TableRow({
      children: [
        tc([
          p(t("ELABORADO POR", "PREPARED BY"), { bold: true, size: 8 }),
          p(plan.docente || "—", { size: 8 }),
          p(""),
          p("Firma: ___________________________", { size: 8, color: "888888" }),
        ], F),
        tc([
          p(t("REVISADO POR", "REVIEWED BY"), { bold: true, size: 8 }),
          p("—", { size: 8 }),
          p(""),
          p("Firma: ___________________________", { size: 8, color: "888888" }),
        ], F),
        tc([
          p(t("APROBADO POR", "APPROVED BY"), { bold: true, size: 8 }),
          p("—", { size: 8 }),
          p(""),
          p("Firma: ___________________________", { size: 8, color: "888888" }),
        ], F3),
      ],
      height: { value: 800, rule: HeightRule.ATLEAST },
    }),
  ], TW, [F, F, F3]));

  // ══════════════════════════════════════════════════════════════════════════
  // DOCUMENTO
  // ══════════════════════════════════════════════════════════════════════════
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: PW, height: 11906 }, // landscape: width(16838) > height(11906)
          margin: { top: MAR, bottom: MAR, left: MAR, right: MAR },
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}
