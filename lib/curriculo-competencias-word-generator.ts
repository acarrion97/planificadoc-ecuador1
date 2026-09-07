/**
 * Genera el documento Word (.docx) para Planificación Currículo por Competencias
 * Familia EGB/BGU — A4 LANDSCAPE
 *
 * Estructura (según formato oficial MINEDUC):
 * 1. Encabezado (Unidad Educativa / Año lectivo)
 * 2. Título: Planificación microcurricular
 * 3. Datos Informativos
 * 4. Situación de aprendizaje (Título + Descripción)
 * 5. Conexión interdisciplinar (Asignaturas)
 * 6. Competencias específicas + Indicadores de evaluación (Saberes)
 * 7. Estrategias metodológicas desde el DUA + Recursos
 * 8. Técnicas e instrumentos de evaluación
 * 9. Semanas 1-8 (inicio/desarrollo/cierre + Técnica + Instrumento)
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionCurriculoCompetencias } from "../data/types-curriculo-competencias";
import type { CompetenciaTransversalCode } from "../data/competencias-transversales";

// ── Colores ──────────────────────────────────────────────────────
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";
const COLOR_BORDER = "A9C3C8";
const WHITE = "FFFFFF";
const BLACK = "1A1A1A";

// Colores competencias
const COMP_COLORS: Record<string, { bg: string; fg: string }> = {
  C: { bg: "3498DB", fg: "FFFFFF" },
  M: { bg: "E74C3C", fg: "FFFFFF" },
  CD: { bg: "9B59B6", fg: "FFFFFF" },
  CS: { bg: "27AE60", fg: "FFFFFF" },
};

// Colores ERCA
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
const TW = PW - 2 * MAR; // 15718

// ── Bordes ──
const B = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "666666" },
};

const B_NONE = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
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

function makeTable(rows: TableRow[], totalW: number, colWidths: number[]): Table {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [
      tc([p(label, { bold: true, size: 9, color: COLOR_PRIMARY })], TW, {
        cs: 4,
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

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 2. Título ──
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Planificación microcurricular", { bold: true, size: 12, align: "center" })], TW)] })],
      TW,
      [TW]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 3. Datos Informativos ──
  children.push(makeTable([sectionRow("DATOS INFORMATIVOS")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW * 0.35),
            tc([p(`Asignatura: ${plan.asignatura || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Grado/Curso: ${plan.grado || "—"}`, { size: 8 })], TW * 0.15),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], TW * 0.1),
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], TW * 0.15),
          ],
        }),
        new TableRow({
          children: [
            tc([p(`No. de semanas: ${plan.estructuraDidactica?.fases?.length || 8}`, { size: 8 })], TW * 0.5),
            tc([p(`Nivel: ${plan.nivel || "—"}`, { size: 8 })], TW * 0.25),
            tc([p(`Fecha: ${plan.fecha || "—"}`, { size: 8 })], TW * 0.25),
          ],
        }),
      ],
      TW,
      [TW * 0.35, TW * 0.25, TW * 0.15, TW * 0.1, TW * 0.15]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 4. Situación de aprendizaje ──
  children.push(makeTable([sectionRow("SITUACIÓN DE APRENDIZAJE")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Título:", { bold: true, size: 8 }), p(plan.objetivoAprendizaje || "—", { size: 8 })], TW * 0.3),
            tc([p("Descripción:", { bold: true, size: 8 }), p(plan.destreza?.descripcion || "—", { size: 8 })], TW * 0.7),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.7]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 5. Conexión interdisciplinar ──
  children.push(makeTable([sectionRow("CONEXIÓN INTERDISCIPLINAR")], TW, [TW]));
  const asignaturasConexion = plan.conexionInterdisciplinar?.asignaturas?.length
    ? plan.conexionInterdisciplinar.asignaturas.join(", ")
    : plan.asignatura || "—";
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Lingüística:", { bold: true, size: 7 }), p("Interpretación de problemas matemáticos y redacción de soluciones argumentadas", { size: 7 })], TW * 0.33),
            tc([p("Educación para la Ciudadanía:", { bold: true, size: 7 }), p("Análisis crítico de la validez de modelos y decisiones", { size: 7 })], TW * 0.33),
            tc([p("Emprendimiento y Gestión:", { bold: true, size: 7 }), p("Aplicación de modelos matemáticos para optimizar recursos", { size: 7 })], TW * 0.34),
          ],
        }),
      ],
      TW,
      [TW * 0.33, TW * 0.33, TW * 0.34]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 6. Competencias específicas + Indicadores ──
  children.push(makeTable([sectionRow("COMPETENCIAS ESPECÍFICAS E INDICADORES DE EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p("Competencias:", { bold: true, size: 8 }),
                new Paragraph({
                  spacing: { after: 0, before: 40 },
                  children: plan.competenciasAsociadas.map((c) => competencyBadge(c)),
                }),
                // Mostrar códigos DCD completos si existen
                ...((plan as any).dcdsSeleccionadas?.length
                  ? (plan as any).dcdsSeleccionadas.map((dcd: any) =>
                      p(`• ${dcd.codigo}: ${dcd.descripcion || ""}`, { size: 7 })
                    )
                  : []),
              ],
              TW * 0.3
            ),
            tc([p("Indicador:", { bold: true, size: 8 }), p(plan.indicadorEvaluacion || "—", { size: 8 })], TW * 0.7),
          ],
        }),
      ],
      TW,
      [TW * 0.3, TW * 0.7]
    )
  );

  // Saberes
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Saberes:", { bold: true, size: 8 })], TW * 0.2),
            tc([p("Declarativos:", { bold: true, size: 8 }), p(plan.saberes?.declarativos || plan.destreza?.descripcion || "—", { size: 7 })], TW * 0.27),
            tc([p("Procedimentales:", { bold: true, size: 8 }), p(plan.saberes?.procedimentales || plan.actividadesEvaluacion || "—", { size: 7 })], TW * 0.27),
            tc([p("Actitudinales:", { bold: true, size: 8 }), p(plan.saberes?.actitudinales || "—", { size: 7 })], TW * 0.26),
          ],
        }),
      ],
      TW,
      [TW * 0.2, TW * 0.27, TW * 0.27, TW * 0.26]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 7. Estrategias metodológicas desde el DUA + Recursos ──
  children.push(makeTable([sectionRow("ESTRATEGIAS METODOLÓGICAS DESDE EL DUA Y RECURSOS")], TW, [TW]));
  
  // Leyenda DUA
  children.push(
    makeTable(
      [new TableRow({
        children: [
          tc([
            p("Leyenda DUA: ", { bold: true, size: 7 }),
            new Paragraph({
              spacing: { after: 0 },
              children: [
                new TextRun({ text: "▪ ", color: "EC4899", size: 14, font: "Arial" }),
                new TextRun({ text: "Representación  ", size: 14, font: "Arial" }),
                new TextRun({ text: "▪ ", color: "1E3A5F", size: 14, font: "Arial" }),
                new TextRun({ text: "Acción y Expresión  ", size: 14, font: "Arial" }),
                new TextRun({ text: "▪ ", color: "22C55E", size: 14, font: "Arial" }),
                new TextRun({ text: "Implicación", size: 14, font: "Arial" }),
              ],
            }),
          ], TW),
        ],
      })],
      TW,
      [TW]
    )
  );

  const fases = plan.estructuraDidactica?.fases || [];
  if (fases.length > 0) {
    const colW = Math.floor(TW / fases.length);
    const colWidths = fases.map((_, i) => (i === fases.length - 1 ? TW - colW * (fases.length - 1) : colW));
    children.push(
      makeTable(
        [
          new TableRow({
            children: fases.map((fase) =>
              tc(
                [
                  p(fase.titulo, { bold: true, size: 9, color: WHITE }),
                  p(`${fase.duracionMinutos} min`, { size: 7, color: WHITE }),
                ],
                colW,
                { bg: ERCA_COLORS[fase.titulo] || COLOR_PRIMARY }
              )
            ),
          }),
          new TableRow({
            children: fases.map((fase) =>
              tc(
                fase.actividades.map((act) => p(`• ${act.texto}`, { size: 7 })),
                colW
              )
            ),
          }),
        ],
        TW,
        colWidths
      )
    );
  }

  // Recursos
  if (plan.recursos) {
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p("Recursos:", { bold: true, size: 8 }), p(plan.recursos, { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
  }

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 8. Técnicas e instrumentos de evaluación ──
  children.push(makeTable([sectionRow("TÉCNICAS E INSTRUMENTOS DE EVALUACIÓN")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p("Técnica:", { bold: true, size: 8 }), p(plan.tecnicaEvaluacion || "—", { size: 8 })], TW * 0.5),
            tc([p("Instrumento:", { bold: true, size: 8 }), p(plan.instrumentoEvaluacion || "—", { size: 8 })], TW * 0.5),
          ],
        }),
      ],
      TW,
      [TW * 0.5, TW * 0.5]
    )
  );

  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 9. Semanas 1-8 — Formato oficial MINEDUC (6 columnas) ──
  children.push(makeTable([sectionRow("DESARROLLO DE LA EXPERIENCIA DE APRENDIZAJE")], TW, [TW]));
  
  // Cabeceras de columna
  const COL_SEMANA = Math.floor(TW * 0.08);
  const COL_DESTREZAS = Math.floor(TW * 0.18);
  const COL_INDICADORES = Math.floor(TW * 0.16);
  const COL_ESTRATEGIAS = Math.floor(TW * 0.30);
  const COL_RECURSOS = Math.floor(TW * 0.12);
  const COL_EVALUACION = TW - COL_SEMANA - COL_DESTREZAS - COL_INDICADORES - COL_ESTRATEGIAS - COL_RECURSOS;

  children.push(
    makeTable(
      [new TableRow({
        tableHeader: true,
        children: [
          tc([p("SEMANA", { bold: true, size: 7, color: WHITE })], COL_SEMANA, { bg: "1A3A5C" }),
          tc([p("DESTREZAS CON CRITERIOS DE DESEMPEÑO", { bold: true, size: 7, color: WHITE })], COL_DESTREZAS, { bg: "1A3A5C" }),
          tc([p("INDICADORES DE EVALUACIÓN", { bold: true, size: 7, color: WHITE })], COL_INDICADORES, { bg: "1A3A5C" }),
          tc([p("ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE", { bold: true, size: 7, color: WHITE })], COL_ESTRATEGIAS, { bg: "1A3A5C" }),
          tc([p("RECURSOS", { bold: true, size: 7, color: WHITE })], COL_RECURSOS, { bg: "1A3A5C" }),
          tc([p("ACTIVIDADES EVALUATIVAS", { bold: true, size: 7, color: WHITE })], COL_EVALUACION, { bg: "1A3A5C" }),
        ],
      })],
      TW,
      [COL_SEMANA, COL_DESTREZAS, COL_INDICADORES, COL_ESTRATEGIAS, COL_RECURSOS, COL_EVALUACION]
    )
  );

  // Generar 8 semanas con contenido
  const semanas = plan.semanas || [];
  for (let semana = 1; semana <= 8; semana++) {
    const semData = semanas.find(s => s.numero === semana);
    
    // Contenido de la columna SEMANA
    const semanaContent = [
      p(`Semana ${semana}`, { bold: true, size: 8 }),
      p("Sugerencias para el inicio:", { bold: true, size: 7, color: "2980B9" }),
      p(semData?.inicio || "—", { size: 7 }),
      p("Sugerencias para el desarrollo:", { bold: true, size: 7, color: "27AE60" }),
      p(semData?.desarrollo || "—", { size: 7 }),
      p("Sugerencias para el cierre:", { bold: true, size: 7, color: "E67E22" }),
      p(semData?.cierre || "—", { size: 7 }),
    ];

    // Contenido de la columna DESTREZAS (soporta datos por semana o global)
    const destrezaSemana = (semData as any)?.destreza;
    const destrezasContent = [
      p(destrezaSemana?.codigo || plan.destreza?.codigo || "—", { bold: true, size: 8 }),
      p(destrezaSemana?.descripcion || plan.destreza?.descripcion || "—", { size: 7 }),
    ];

    // Contenido de la columna INDICADORES (soporta datos por semana o global)
    const indicadorSemana = (semData as any)?.indicador || plan.indicadorEvaluacion;
    const indicadoresSemana = (semData as any)?.indicadores || plan.destreza?.indicadoresEvaluacion;
    const indicadoresContent = indicadoresSemana?.length
      ? indicadoresSemana.map((ind: string) => p(`• ${ind}`, { size: 7 }))
      : [p(indicadorSemana || "—", { size: 7 })];

    // Contenido de la columna ESTRATEGIAS (con fases ERCA)
    const estrategiasContent: Paragraph[] = [];
    const fases = plan.estructuraDidactica?.fases || [];
    if (fases.length > 0) {
      for (const fase of fases) {
        estrategiasContent.push(p(fase.titulo, { bold: true, size: 7, color: ERCA_COLORS[fase.titulo] || "000000" }));
        for (const act of fase.actividades) {
          estrategiasContent.push(p(`• ${act.texto}`, { size: 7 }));
        }
      }
    } else {
      estrategiasContent.push(p("—", { size: 7 }));
    }

    // Contenido de la columna RECURSOS (soporta datos por semana o global)
    const recursosSemana = (semData as any)?.recursos || plan.recursos;
    const recursosContent = recursosSemana
      ? recursosSemana.split(",").map((r: string) => p(`• ${r.trim()}`, { size: 7 }))
      : [p("—", { size: 7 })];

    // Contenido de la columna EVALUACIÓN (soporta datos por semana o global)
    const evaluacionContent = [
      p("Técnica:", { bold: true, size: 7 }),
      p(semData?.tecnica || plan.tecnicaEvaluacion || "—", { size: 7 }),
      p("Instrumento:", { bold: true, size: 7 }),
      p(semData?.instrumento || plan.instrumentoEvaluacion || "—", { size: 7 }),
    ];

    // Fila de la semana
    children.push(
      makeTable(
        [new TableRow({
          children: [
            tc(semanaContent, COL_SEMANA, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
            tc(destrezasContent, COL_DESTREZAS, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
            tc(indicadoresContent, COL_INDICADORES, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
            tc(estrategiasContent, COL_ESTRATEGIAS, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
            tc(recursosContent, COL_RECURSOS, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
            tc(evaluacionContent, COL_EVALUACION, { bg: semana % 2 === 0 ? "F8F9FA" : "FFFFFF" }),
          ],
        })],
        TW,
        [COL_SEMANA, COL_DESTREZAS, COL_INDICADORES, COL_ESTRATEGIAS, COL_RECURSOS, COL_EVALUACION]
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
