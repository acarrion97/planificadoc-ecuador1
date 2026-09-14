/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia Inicial/Preparatoria — A4 LANDSCAPE — Formato MULTIGRADO
 *
 * Estructura (según formato oficial MINEDUC):
 * PÁGINA 1:
 *   1. Encabezado (Unidad Educativa / Año lectivo)
 *   2. Título: Planificación microcurricular por competencias - multigrado
 *   3. Datos Informativos (Docente, Asignatura, Grados, Paralelo, Trimestre, No. semanas)
 *   4. Situación de aprendizaje (Título + Descripción en una celda)
 *   5. Conexión interdisciplinar (Ámbitos con códigos CE)
 *   6. Competencias específicas + código CE
 *   7. Indicadores de evaluación (5 col: Grado | Indicadores | Declarativos | Procedimentales | Actitudinales)
 * PÁGINAS 2+:
 *   8. Tabla DUA semanal multigrado (4 col: Semana·Grado | Estrategias DUA | Recursos | Técnicas)
 *   9. Nota al pie
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionInicialCurriculo } from "../data/types-curriculo-competencias";

// ── Colores ──
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";
const WHITE = "FFFFFF";
const BLACK = "1A1A1A";

// ── Dimensiones A4 landscape ──
const PW = 16838;
const MAR = 560;
const TW = PW - 2 * MAR;

// ── Bordes ──
const B = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

// ── Helpers ──
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

/** Crea un párrafo con etiqueta de color para fases */
function coloredLabel(label: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 40 },
    children: [
      new TextRun({
        text: label,
        bold: true,
        size: 14,
        color: WHITE,
        font: "Arial",
        shading: { fill: color, type: ShadingType.CLEAR },
      }),
    ],
  });
}

/** Mapea el índice del ámbito a su grado correspondiente */
function gradoLabel(idx: number): string {
  const labels = ["Inicial 3-4 años", "Inicial 4-5 años", "5-6 años"];
  return labels[idx] || `Grado ${idx + 1}`;
}

/** Extrae los códigos CE de un ámbito */
function extraerCodigosCE(ambito: { competenciaCodigo?: string; competenciaDescripcion?: string }): string[] {
  const desc = ambito.competenciaDescripcion || "";
  const matches = desc.match(/CE\.[A-Z]+\.\d+[\.\d]*/g);
  return matches || (ambito.competenciaCodigo ? [ambito.competenciaCodigo] : []);
}

// ── Generador principal ──
export async function generarCurriculoCompetenciasWordInicial(
  plan: PlanificacionInicialCurriculo
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const ambitos = plan.ambitos || [];

  // ═══════════════════════════════════════════════════════════════
  // 1. ENCABEZADO
  // ═══════════════════════════════════════════════════════════════
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Unidad Educativa", { bold: true, size: 9 })], TW * 0.6, { bg: COLOR_HEADER }),
            tc([p(`Año lectivo: ${plan.periodoPedagogico || "—"}`, { size: 9 })], TW * 0.4, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [TW * 0.6, TW * 0.4]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 2. TÍTULO
  // ═══════════════════════════════════════════════════════════════
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Planificación microcurricular por competencias - multigrado", { bold: true, size: 12, align: "center" })], TW)] })],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 3. DATOS INFORMATIVOS
  // ═══════════════════════════════════════════════════════════════
  const grados = ambitos.map((_, i) => gradoLabel(i)).join(", ");
  const numSemanas = plan.noSemanasClase || plan.ambitos?.[0]?.clases?.length || 8;

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Datos informativos:", { bold: true, size: 8 })], TW),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`Asignatura: Currículo integrado`, { size: 8 })], TW * 0.4),
            tc([p(`Grados: ${grados || "—"}`, { size: 8 })], TW * 0.4),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.2),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], TW * 0.5),
            tc([p(`No. de semanas: ${numSemanas}`, { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 4. SITUACIÓN DE APRENDIZAJE
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Situación de aprendizaje")], TW, [TW]));

  const tituloSA = plan.situacionAprendizaje?.titulo || plan.objetivoGeneral || "—";
  const descSA = plan.situacionAprendizaje?.descripcion || plan.ambitos?.map(a => a.destrezas?.join(", ")).filter(Boolean).join("; ") || "—";

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([
              p("Título:", { bold: true, size: 8 }),
              p(tituloSA, { size: 8 }),
              p("Descripción:", { bold: true, size: 8 }),
              p(descSA, { size: 8 }),
            ], TW),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 5. CONEXIÓN INTERDISCIPLINAR
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Conexión interdisciplinar")], TW, [TW]));

  // Ámbitos con códigos CE entre paréntesis
  const ambitosLinea = ambitos.map((a) => {
    const ce = extraerCodigosCE(a);
    const ceText = ce.length > 0 ? ` (${ce.join(", ")})` : "";
    return `${a.ambito}${ceText}`;
  }).join("  ");

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(ambitosLinea || "—", { size: 8 })], TW),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 6. COMPETENCIAS ESPECÍFICAS
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Competencias específicas")], TW, [TW]));

  // Línea de códigos CE por cada年龄段
  const ceLines = ambitos.map((a, i) => {
    const ce = extraerCodigosCE(a);
    const ceText = ce.length > 0 ? ce.join(" · ") : (a.competenciaCodigo || "—");
    return `${gradoLabel(i)}: ${ceText}`;
  });

  for (const line of ceLines) {
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc([p(line, { size: 8 })], TW),
            ],
          }),
        ],
        TW,
        [TW]
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. INDICADORES DE EVALUACIÓN (5 columnas)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_GRA = Math.floor(TW * 0.12);
  const COL_IND = Math.floor(TW * 0.28);
  const COL_DEC = Math.floor(TW * 0.22);
  const COL_PRO = Math.floor(TW * 0.20);
  const COL_ACT = TW - COL_GRA - COL_IND - COL_DEC - COL_PRO;

  const filasIndicadores: TableRow[] = [];

  for (let i = 0; i < ambitos.length; i++) {
    const ambito = ambitos[i];
    const grado = gradoLabel(i);

    // Una fila por cada clase/destreza del ámbito
    const destrezas = ambito.destrezas || [];
    const clases = ambito.clases || [];

    if (destrezas.length === 0 && clases.length === 0) {
      filasIndicadores.push(
        new TableRow({
          children: [
            tc([p(grado, { size: 7 })], COL_GRA),
            tc([p("—", { size: 7 })], COL_IND),
            tc([p("—", { size: 7 })], COL_DEC),
            tc([p("—", { size: 7 })], COL_PRO),
            tc([p("—", { size: 7 })], COL_ACT),
          ],
        })
      );
      continue;
    }

    // Usar destrezas como indicadores, o generar desde clases
    const indicadores = destrezas.length > 0 ? destrezas : clases.map(c => c.objetivoEspecifico || c.tema);

    for (let j = 0; j < indicadores.length; j++) {
      const indicador = indicadores[j] || "—";
      const idx = j + 1;

      // Generar saberes contextuales
      const declarativos = `${ambito.competenciaCodigo || "CI"}.d.${idx}. ${indicador.substring(0, 120)}`;
      const procedimentales = `${ambito.competenciaCodigo || "CI"}.p.${idx}. Aplicar estrategias para ${indicador.substring(0, 100).toLowerCase()}`;
      const actitudinales = `${ambito.competenciaCodigo || "CI"}.a.${idx}. Valorar la importancia de ${indicador.substring(0, 100).toLowerCase()}`;

      filasIndicadores.push(
        new TableRow({
          children: [
            tc(j === 0 ? [p(grado, { size: 7 })] : [p("", { size: 7 })], COL_GRA),
            tc([p(indicador, { size: 7 })], COL_IND),
            tc([p(declarativos, { size: 7 })], COL_DEC),
            tc([p(procedimentales, { size: 7 })], COL_PRO),
            tc([p(actitudinales, { size: 7 })], COL_ACT),
          ],
        })
      );
    }
  }

  // Si no hay indicadores, crear fila vacía
  if (filasIndicadores.length === 0) {
    filasIndicadores.push(
      new TableRow({
        children: [
          tc([p("—", { size: 7 })], COL_GRA),
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
            tc([p("Grado", { bold: true, size: 8, color: WHITE })], COL_GRA, { bg: COLOR_PRIMARY }),
            tc([p("Indicadores de evaluación", { bold: true, size: 8, color: WHITE })], COL_IND, { bg: COLOR_PRIMARY }),
            tc([p("Declarativos", { bold: true, size: 8, color: WHITE })], COL_DEC, { bg: COLOR_PRIMARY }),
            tc([p("Procedimentales", { bold: true, size: 8, color: WHITE })], COL_PRO, { bg: COLOR_PRIMARY }),
            tc([p("Actitudinales", { bold: true, size: 8, color: WHITE })], COL_ACT, { bg: COLOR_PRIMARY }),
          ],
        }),
        ...filasIndicadores,
      ],
      TW,
      [COL_GRA, COL_IND, COL_DEC, COL_PRO, COL_ACT]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 8. TABLA DUA SEMANAL MULTIGRADO
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_SEMGRA = Math.floor(TW * 0.12);
  const COL_DUA = Math.floor(TW * 0.43);
  const COL_REC = Math.floor(TW * 0.23);
  const COL_TECH = TW - COL_SEMGRA - COL_DUA - COL_REC;

  // Header de la tabla DUA
  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Semana · Grado", { bold: true, size: 8, color: WHITE })], COL_SEMGRA, { bg: COLOR_PRIMARY }),
            tc([p("Estrategias metodológicas desde el DUA", { bold: true, size: 8, color: WHITE })], COL_DUA, { bg: COLOR_PRIMARY }),
            tc([p("Recursos (Se podrán emplear de acuerdo con la disponibilidad o adaptabilidad y conforme la selección que realice el equipo docente)", { bold: true, size: 7, color: WHITE })], COL_REC, { bg: COLOR_PRIMARY }),
            tc([p("Técnicas e instrumentos de evaluación", { bold: true, size: 8, color: WHITE })], COL_TECH, { bg: COLOR_PRIMARY }),
          ],
        }),
      ],
      TW,
      [COL_SEMGRA, COL_DUA, COL_REC, COL_TECH]
    )
  );

  // Generar filas por semana y grado
  const numSemanasCalc = plan.noSemanasClase || 8;

  for (let semana = 1; semana <= numSemanasCalc; semana++) {
    // Para cada ámbito/grado, generar una fila
    for (let i = 0; i < ambitos.length; i++) {
      const ambito = ambitos[i];
      const grado = gradoLabel(i);
      const clase = ambito.clases?.find(c => c.numero === semana) || ambito.clases?.[semana - 1];

      const semLabel = semana === 1 || i > 0
        ? (i === 0 ? `Semana ${semana} · Grado` : "")
        : `Semana ${semana} · Grado`;

      // Contenido DUA
      const duaContent: Paragraph[] = [];
      if (clase) {
        duaContent.push(p(`Clase ${clase.numero}: ${clase.tema}`, { bold: true, size: 8 }));
        duaContent.push(p(`Sugerencias para el inicio:`, { bold: true, size: 7 }));
        const inicioTexts = clase.inicio?.map(a => `• ${a.texto}`).join("\n") || "• Inicio de la actividad";
        duaContent.push(p(inicioTexts, { size: 7 }));

        duaContent.push(p(`Sugerencias para el desarrollo:`, { bold: true, size: 7 }));
        const desTexts = clase.desarrollo?.map(a => `• ${a.texto}`).join("\n") || "• Desarrollo de la actividad";
        duaContent.push(p(desTexts, { size: 7 }));

        duaContent.push(p(`Sugerencias para el cierre:`, { bold: true, size: 7 }));
        const cierreTexts = clase.cierre?.map(a => `• ${a.texto}`).join("\n") || "• Cierre de la actividad";
        duaContent.push(p(cierreTexts, { size: 7 }));
      } else {
        duaContent.push(p("—", { size: 7 }));
      }

      // Recursos
      const recContent: Paragraph[] = [];
      if (clase?.metodologia) {
        recContent.push(p(`• ${clase.metodologia}`, { size: 7 }));
      } else {
        recContent.push(p("—", { size: 7 }));
      }

      // Técnicas e instrumentos
      const techContent: Paragraph[] = [];
      if (clase?.metodoEvaluacion?.length) {
        techContent.push(p(`Técnica: ${clase.metodoEvaluacion[0] || "Observación"}`, { size: 7 }));
        techContent.push(p(`Instrumento: ${clase.metodoEvaluacion[1] || "Lista de cotejo"}`, { size: 7 }));
      } else {
        techContent.push(p("Técnica: Observación", { size: 7 }));
        techContent.push(p("Instrumento: Lista de cotejo", { size: 7 }));
      }

      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc([p(`${grado}`, { size: 7 })], COL_SEMGRA),
                tc(duaContent, COL_DUA),
                tc(recContent, COL_REC),
                tc(techContent, COL_TECH),
              ],
            }),
          ],
          TW,
          [COL_SEMGRA, COL_DUA, COL_REC, COL_TECH]
        )
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. NOTA AL PIE
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Esta herramienta pedagógica genera propuestas de planificación basadas en los instrumentos técnicos y formatos socializados en la fase de pilotaje. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito.", { size: 7 })], TW),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

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
