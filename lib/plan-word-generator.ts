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
import type { Planificacion } from "../data/types";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { INSERCIONES_CURRICULARES } from "../data/inserciones-curriculares";
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
function resolveInserciones(plan: Planificacion, isEFL: boolean): string {
  const ids = (plan.insercionesCurriculares as string[] | undefined) || (plan.insercionCurricular ? [(plan.insercionCurricular as string)] : []);
  if (ids.length === 0) return "—";
  return ids.map((id: string) => {
    const ins = INSERCIONES_CURRICULARES.find(i => i.id === id);
    return ins ? (isEFL ? ins.nameEN : ins.nombreCorto) : id;
  }).filter(Boolean).join(", ");
}

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

  const insercionesText = resolveInserciones(plan, isEFL);
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
         t("Inserción Curricular:", "Curricular Insertion:"), insercionesText,
         t("Fecha Inicio:", "Start Date:"),   (plan as any).fechaInicio || "___/___/______"),
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

  // Competencias
  const destrezaCompetencias = (plan as any).competencias || [];
  const competenciasStr = destrezaCompetencias.length > 0
    ? destrezaCompetencias.join(", ")
    : "";

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
          ...(competenciasStr ? [p(competenciasStr, { size: 7, color: "666666" })] : []),
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
          size: { width: PW, height: 11906, orientation: "landscape" as any },
          margin: { top: MAR, bottom: MAR, left: MAR, right: MAR },
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}
