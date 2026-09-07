/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia EGB/BGU — A4 LANDSCAPE
 *
 * Estructura (según formato oficial MINEDUC):
 * PÁGINA 1:
 *   1. Encabezado (Unidad Educativa / Año lectivo)
 *   2. Título: Planificación microcurricular
 *   3. Datos Informativos (Docente, Grado, Paralelo, Asignatura, No. semanas)
 *   4. Situación de aprendizaje (Título + Descripción)
 *   5. Conexión interdisciplinar (Asignaturas)
 *   6. Competencias específicas + Indicadores de evaluación / Saberes
 * PÁGINAS 2-3:
 *   7. Tabla Destrezas | Indicadores | Actividades (con datos reales)
 * PÁGINAS 4+:
 *   8. Estrategia metodológica desde el DCA | Recursos | Técnicas e instrumentos
 * PÁGINAS 5+ (una por semana):
 *   9. Semana X: Inicio / Desarrollo / Cierre | (contenido) | Técnicas / Instrumento
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionCurriculoCompetencias } from "../data/types-curriculo-competencias";
import type { CompetenciaTransversalCode } from "../data/competencias-transversales";
import { saberesData } from "../data/saberes-data";

// ── Colores ──────────────────────────────────────────────────────
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";
const WHITE = "FFFFFF";
const BLACK = "1A1A1A";

const COMP_COLORS: Record<string, { bg: string; fg: string }> = {
  C: { bg: "3498DB", fg: "FFFFFF" },
  M: { bg: "E74C3C", fg: "FFFFFF" },
  CD: { bg: "9B59B6", fg: "FFFFFF" },
  CS: { bg: "27AE60", fg: "FFFFFF" },
};

const ERCA_COLORS: Record<string, string> = {
  INICIO: "2980B9",
  DESARROLLO: "27AE60",
  CIERRE: "E67E22",
  Experiencia: "2980B9",
  Reflexión: "8E44AD",
  Conceptualización: "27AE60",
  Aplicación: "E67E22",
};

// ── Dimensiones A4 landscape ──
const PW = 16838;
const MAR = 560;
const TW = PW - 2 * MAR;

const B = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

const LOWERCASE_WORDS = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "para", "a"]);

function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && LOWERCASE_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function p(
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; align?: string } = {}
): Paragraph {
  return new Paragraph({
    alignment: (opts.align as any) || AlignmentType.LEFT,
    spacing: { after: 0, before: 0 },
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
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
  opts: { cs?: number; rs?: number; bg?: string; vAlign?: string; borders?: any } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.cs ?? 1,
    rowSpan: opts.rs ?? 1,
    width: { size: width, type: WidthType.DXA },
    verticalAlign: (opts.vAlign as any) ?? VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: opts.borders ?? B,
    children: paragraphs.length > 0 ? paragraphs : [p("")],
  });
}

function makeTable(rows: TableRow[], totalW: number, colWidths: number[]): Table {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

function sectionRow(label: string, cs = 1): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 9, color: COLOR_PRIMARY })], TW, {
        cs,
        bg: COLOR_SECTION,
      }),
    ],
  });
}

function competencyBadge(code: CompetenciaTransversalCode): TextRun {
  const c = COMP_COLORS[code] || { bg: "888888", fg: "FFFFFF" };
  return new TextRun({
    text: ` ${code} `,
    bold: true,
    size: 16,
    color: c.fg,
    font: "Arial",
    shading: { fill: c.bg, type: ShadingType.CLEAR },
  });
}

// ── Generador principal ──
export async function generarCurriculoCompetenciasWordEGBBGU(
  plan: PlanificacionCurriculoCompetencias
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // ═══════════════════════════════════════════════════════════════
  // PÁGINA 1
  // ═══════════════════════════════════════════════════════════════

  // ── 1. Encabezado ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Unidad Educativa:", { bold: true, size: 8 }), p(` ${plan.institucion || "—"}`, { size: 9 })], TW * 0.6, { bg: COLOR_HEADER }),
            tc([p(`Año lectivo: ${plan.periodoPedagogico || "—"}`, { size: 9 })], TW * 0.4, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [TW * 0.6, TW * 0.4]
    )
  );

  // ── 2. Título ──
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Planificación microcurricular", { bold: true, size: 12, align: "center" })], TW)] })],
      TW,
      [TW]
    )
  );

  // ── 3. Datos Informativos ──
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Docente: ${toTitleCase(plan.docente || "—")}`, { size: 8 })], TW * 0.4),
            tc([p(`Grado-Paralelo: ${plan.grado || "—"} - ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.3),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.3),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`Asignatura: ${toTitleCase(plan.asignatura || "—")}`, { size: 8 })], TW * 0.5),
            tc([p(`No. de semanas: ${plan.estructuraDidactica?.fases?.length || 8}`, { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW * 0.4, TW * 0.3, TW * 0.3]
    )
  );

  // ── 4. Situación de aprendizaje ──
  children.push(makeTable([sectionRow("SITUACIÓN DE APRENDIZAJE")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [tc([p("Título:", { bold: true, size: 8 }), p(plan.objetivoAprendizaje || "—", { size: 8 })], TW)],
        }),
        new TableRow({
          children: [tc([p("Descripción:", { bold: true, size: 8 }), p(plan.destreza?.descripcion || "—", { size: 8 })], TW)],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ── 5. Conexión interdisciplinar ──
  children.push(makeTable([sectionRow("CONEXIÓN INTERDISCIPLINAR")], TW, [TW]));

  const asignaturasConexion = plan.conexionInterdisciplinar?.asignaturas?.length
    ? plan.conexionInterdisciplinar.asignaturas
    : [];

  const filasConexion: TableRow[] = [];

  if (asignaturasConexion.length > 0) {
    for (const asig of asignaturasConexion) {
      filasConexion.push(
        new TableRow({
          children: [
            tc([p(asig, { size: 8 })], TW),
          ],
        })
      );
    }
  } else {
    // Fallback: mostrar solo el área actual con su CE
    filasConexion.push(
      new TableRow({
        children: [
          tc([p(`${plan.asignatura || "—"}: ${plan.destreza?.criteriosEvaluacion?.[0] || "—"}`, { size: 8 })], TW),
        ],
      })
    );
  }

  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Asignaturas:", { bold: true, size: 8, color: WHITE })], TW, { bg: COLOR_PRIMARY }),
          ],
        }),
        ...filasConexion,
      ],
      TW,
      [TW]
    )
  );

  // ── 6. Competencias + Indicadores + Saberes ──
  children.push(makeTable([sectionRow("COMPETENCIAS ESPECÍFICAS E INDICADORES DE EVALUACIÓN")], TW, [TW]));

  const competenciasEspecificas = plan.destreza?.criteriosEvaluacion || [];
  const indicadoresDcd = plan.destreza?.indicadoresEvaluacion || [];

  // Buscar saberes en saberesData usando el código CE
  const ceCode = competenciasEspecificas[0]?.split(".")[0] + "." + competenciasEspecificas[0]?.split(".")[1] + "." + competenciasEspecificas[0]?.split(".")[2] || "";
  const saberesFromData = saberesData[ceCode];

  const COL_IND = Math.floor(TW * 0.34);
  const COL_DEC = Math.floor(TW * 0.22);
  const COL_PRO = Math.floor(TW * 0.22);
  const COL_ACT = TW - COL_IND - COL_DEC - COL_PRO;

  // Generar filas de indicadores + saberes
  const filasIndicadores: TableRow[] = [];

  // Extraer códigos base para saberes (ej: M.5.1 → D.M.5.1, P.M.5.1, A.M.5.1)
  const dcdCodigo = plan.destreza?.codigo || "";
  const prefijoArea = dcdCodigo ? dcdCodigo.split(".")[0] : "";
  const subSecuencial = dcdCodigo ? dcdCodigo.split(".").slice(1).join(".") : "";

  for (let i = 0; i < indicadoresDcd.length; i++) {
    const indCodigo = indicadoresDcd[i] || "—";

    // Generar códigos de saberes
    const numSaber = i + 1;
    const codigoDec = prefijoArea ? `D.${prefijoArea}.${subSecuencial}.${numSaber}` : "";
    const codigoPro = prefijoArea ? `P.${prefijoArea}.${subSecuencial}.${numSaber}` : "";
    const codigoAct = prefijoArea ? `A.${prefijoArea}.${subSecuencial}.${numSaber}` : "";

    // Usar saberes del catálogo si existen
    const declarativo = plan.saberes?.declarativos || saberesFromData?.declarativos || "—";
    const procedimentales = plan.saberes?.procedimentales || saberesFromData?.procedimentales || "—";
    const actitudinales = plan.saberes?.actitudinales || saberesFromData?.actitudinales || "—";

    filasIndicadores.push(
      new TableRow({
        children: [
          tc([p(indCodigo, { size: 7 })], COL_IND),
          tc([p(`${codigoDec}. ${declarativo}`, { size: 7 })], COL_DEC),
          tc([p(`${codigoPro}. ${procedimentales}`, { size: 7 })], COL_PRO),
          tc([p(`${codigoAct}. ${actitudinales}`, { size: 7 })], COL_ACT),
        ],
      })
    );
  }

  // Si no hay indicadores, crear al menos una fila
  if (filasIndicadores.length === 0) {
    filasIndicadores.push(
      new TableRow({
        children: [
          tc([p("—", { size: 7 })], COL_IND),
          tc([p("—", { size: 7 })], COL_DEC),
          tc([p("—", { size: 7 })], COL_PRO),
          tc([p("—", { size: 7 })], COL_ACT),
        ],
      })
    );
  }

  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Indicadores de evaluación", { bold: true, size: 8, color: WHITE })], COL_IND, { bg: COLOR_PRIMARY }),
            tc([p("Declarativos", { bold: true, size: 8, color: WHITE })], COL_DEC, { bg: COLOR_PRIMARY }),
            tc([p("Procedimentales", { bold: true, size: 8, color: WHITE })], COL_PRO, { bg: COLOR_PRIMARY }),
            tc([p("Actitudinales", { bold: true, size: 8, color: WHITE })], COL_ACT, { bg: COLOR_PRIMARY }),
          ],
        }),
        ...filasIndicadores,
      ],
      TW,
      [COL_IND, COL_DEC, COL_PRO, COL_ACT]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // PÁGINAS 4+ — Semanas con header "Estrategias desde el DUA"
  // ═══════════════════════════════════════════════════════════════

  const destrezaDesc = plan.destreza?.descripcion || "";
  const indicador = plan.indicadorEvaluacion || plan.destreza?.indicadoresEvaluacion?.[0] || "";
  const objetivo = plan.objetivoAprendizaje || "";
  const critEval = plan.destreza?.criteriosEvaluacion?.[0] || "";

  const semanas = plan.semanas || [];
  const numSemanas = plan.estructuraDidactica?.fases?.length || 8;

  const COL_IZQ = Math.floor(TW * 0.45);
  const COL_REC = Math.floor(TW * 0.25);
  const COL_TECH = TW - COL_IZQ - COL_REC;

  // Header de la tabla (una sola vez)
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Estrategias metodológicas desde el DUA", { bold: true, size: 8, color: WHITE })], COL_IZQ, { bg: COLOR_PRIMARY }),
            tc([p("Recursos (se podrán emplear de acuerdo con la disponibilidad o adaptabilidad y conformidad del estudiante que realice el equipo docente)", { bold: true, size: 7, color: WHITE })], COL_REC, { bg: COLOR_PRIMARY }),
            tc([p("Técnicas e instrumentos de evaluación", { bold: true, size: 8, color: WHITE })], COL_TECH, { bg: COLOR_PRIMARY }),
          ],
        }),
      ],
      TW,
      [COL_IZQ, COL_REC, COL_TECH]
    )
  );

  for (let semana = 1; semana <= numSemanas; semana++) {
    const semData = semanas.find((s) => s.numero === semana);
    children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

    // ── Contenido aplicado por semana ──
    const inicio = semData?.inicio
      || (semana === 1
        ? `Situación de aprendizaje: ${objetivo || destrezaDesc}\nDestreza: ${destrezaDesc}\nIndicador: ${indicador || "—"}`
        : `Repaso de la semana anterior y profundización en: ${destrezaDesc}`);

    const desarrollo = semData?.desarrollo
      || `Actividades prácticas orientadas a la comprensión de: ${destrezaDesc}. Los estudiantes desarrollarán ejercicios aplicando ${indicador ? "el indicador: " + indicador.substring(0, 150) : "las destrezas trabajadas"}.`;

    const cierre = semData?.cierre
      || (semana === numSemanas
        ? `Evaluación de la unidad: ${critEval || destrezaDesc}. Retroalimentación grupal y socialización de aprendizajes.`
        : `Reflexión sobre lo aprendido. Socialización de trabajos realizados y revisión de: ${indicador ? indicador.substring(0, 100) : "la destreza"}.`);

    // Columna izquierda: contenido aplicado
    const izqContent = [
      p(`Semana ${semana}`, { bold: true, size: 9 }),
      p(inicio, { size: 7 }),
      p(desarrollo, { size: 7 }),
      p(cierre, { size: 7 }),
    ];

    // Columna central: recursos
    const recursosSem = plan.recursos || "Ficha de trabajo, cuaderno, lápiz";
    const recContent = recursosSem.split(",").map((r: string) => p(`• ${r.trim()}`, { size: 7 }));

    // Columna derecha: técnicas e instrumentos
    const techContent = [
      p(`Técnica: ${semData?.tecnica || plan.tecnicaEvaluacion || "Observación directa"}`, { size: 7 }),
      p(`Instrumento: ${semData?.instrumento || plan.instrumentoEvaluacion || "Lista de cotejo"}`, { size: 7 }),
    ];

    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc(izqContent, COL_IZQ),
              tc(recContent, COL_REC),
              tc(techContent, COL_TECH),
            ],
          }),
        ],
        TW,
        [COL_IZQ, COL_REC, COL_TECH]
      )
    );
  }

  // ── Construir documento ──
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 16 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PW, height: 11906 },
            margin: { top: MAR, bottom: MAR, left: MAR, right: MAR },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
