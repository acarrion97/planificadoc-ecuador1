/**
 * Genera el documento Word (.docx) para un Proyecto Interdisciplinar.
 *
 * Sigue el formato oficial del instructivo "Proyecto Interdisciplinar para
 * la Evaluación Sumativa" del MinEduc:
 *   1. Encabezado (Institución / Base curricular)
 *   2. Título del documento
 *   3. Datos informativos (institución, docentes, curso, duración, asignaturas)
 *   4. Proyecto interdisciplinar (título)
 *   5. Objetivo del proyecto
 *   6. Descripción del proyecto (contexto, desafío, producto)
 *   7. Planificación del proyecto interdisciplinar (una fila por elemento
 *      curricular: asignatura, competencia/destreza, indicadores de
 *      evaluación y saberes declarativos/procedimentales/actitudinales)
 *   8. Actividades sugeridas y evidencias de evaluación (por fase)
 *   9. Evaluación general
 *  10. Recomendaciones para el docente
 *  11. Firmas de docentes participantes
 *
 * Cada elemento curricular se resuelve contra el catálogo estático VIGENTE
 * al momento de exportar (nunca se copia la descripción al registro
 * guardado — design.md, Decisión 2), así que un cambio de catálogo se
 * refleja en la próxima exportación. Los saberes declarativos/procedimentales/
 * actitudinales y los indicadores de evaluación solo existen en el catálogo
 * de competencias específicas (CNC); para proyectos en destrezas esas
 * columnas muestran "—" salvo los indicadores, que sí están disponibles.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { AreaProyectoInterdisciplinar, ProyectoInterdisciplinarPlan, BaseCurricular, FaseProyecto } from "../data/types-proyecto-interdisciplinar";
import { buscarPorCodigo } from "../data/index";
import { buscarCompetenciaEspecificaEGBBGU } from "../data/competencias-especificas-egb-bgu";

// ── Colores ──
const COLOR_PRIMARY = "0F766E";
const COLOR_SECTION = "CCFBF1";
const COLOR_HEADER = "F0FDFA";
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

/** Una celda de lista: un párrafo por ítem, o "—" si la lista está vacía. */
function listaParrafos(items: string[], size = 7): Paragraph[] {
  return items.length > 0 ? items.map((t) => p(t, { size })) : [p("—", { size })];
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

const FASES_LABEL: Record<FaseProyecto, string> = {
  planificacion: "Planificación",
  gestion: "Gestión del proyecto",
  evaluacion: "Evaluación del proyecto",
};

/** Resuelve la descripción de un código contra el catálogo VIGENTE (nunca se copia al guardar). */
function descripcionDeElemento(baseCurricular: BaseCurricular, codigo: string): string {
  if (baseCurricular === "destrezas") {
    return buscarPorCodigo(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
  }
  return buscarCompetenciaEspecificaEGBBGU(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
}

interface SaberesDeElemento {
  indicadores: string[];
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

/**
 * Indicadores de evaluación y saberes declarativos/procedimentales/actitudinales
 * de un elemento curricular para el nivel/grado del área. Solo el catálogo de
 * competencias específicas (CNC) trae saberes desagregados por grado; para
 * destrezas solo hay indicadores de evaluación.
 */
function saberesDeElemento(
  baseCurricular: BaseCurricular,
  codigo: string,
  area: AreaProyectoInterdisciplinar
): SaberesDeElemento {
  if (baseCurricular === "destrezas") {
    return {
      indicadores: buscarPorCodigo(codigo)?.indicadoresEvaluacion ?? [],
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    };
  }
  const ce = buscarCompetenciaEspecificaEGBBGU(codigo);
  const porGrado = ce?.porGrado.find((g) => g.nivel === area.nivel && g.grado === area.grado);
  return {
    indicadores: porGrado?.indicadores.map((i) => i.texto) ?? [],
    declarativos: porGrado?.saberes.declarativos ?? [],
    procedimentales: porGrado?.saberes.procedimentales ?? [],
    actitudinales: porGrado?.saberes.actitudinales ?? [],
  };
}

// ── Generador principal ──
export async function generarProyectoInterdisciplinarWord(
  plan: ProyectoInterdisciplinarPlan
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  const baseLabel =
    plan.baseCurricular === "destrezas"
      ? "Destrezas con criterios de desempeño"
      : "Competencias específicas (Currículo Nacional por Competencias)";

  // ═══════════════════════════════════════════════════════════════
  // 1. ENCABEZADO
  // ═══════════════════════════════════════════════════════════════
  const COL_INST = Math.floor(TW * 0.6);
  const COL_BASE = TW - COL_INST;
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "Unidad Educativa", { bold: true, size: 9 })], COL_INST, { bg: COLOR_HEADER }),
            tc([p(`Base curricular: ${baseLabel}`, { size: 8 })], COL_BASE, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [COL_INST, COL_BASE]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 2. TÍTULO
  // ═══════════════════════════════════════════════════════════════
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [p("PROYECTO INTERDISCIPLINAR PARA LA EVALUACIÓN SUMATIVA", { bold: true, size: 12, align: "center" })],
              TW,
              { bg: COLOR_HEADER }
            ),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 3. DATOS INFORMATIVOS
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Datos informativos")], TW, [TW]));

  const COL_LABEL = Math.floor(TW * 0.22);
  const COL_VALUE = TW - COL_LABEL;
  const asignaturas = Array.from(new Set(plan.areas.map((a) => a.nombreArea))).join(", ");
  const primeraArea = plan.areas[0];
  const cursoLabel = primeraArea
    ? `${primeraArea.grado}${primeraArea.subnivel ? ` (${primeraArea.subnivel})` : ` (${primeraArea.nivel})`}`
    : "";

  function datoRow(label: string, value: string | undefined): TableRow {
    return new TableRow({
      children: [
        tc([p(label, { bold: true, size: 8 })], COL_LABEL, { bg: COLOR_HEADER }),
        tc([p(value?.trim() || "—", { size: 8 })], COL_VALUE),
      ],
    });
  }

  children.push(
    makeTable(
      [
        datoRow("Institución educativa:", plan.institucion),
        datoRow("Docentes:", plan.docentesParticipantes?.join(", ")),
        datoRow("Curso:", cursoLabel),
        datoRow("Duración:", plan.duracion),
        datoRow("Asignaturas:", asignaturas),
      ],
      TW,
      [COL_LABEL, COL_VALUE]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 4. PROYECTO INTERDISCIPLINAR (TÍTULO)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [tc([p(`Proyecto interdisciplinar: ${plan.titulo || "—"}`, { bold: true, size: 10 })], TW, { bg: COLOR_HEADER })],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 5. OBJETIVO DEL PROYECTO
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Objetivo del proyecto")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p(plan.objetivoGeneral || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 6. DESCRIPCIÓN DEL PROYECTO
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Descripción del proyecto")], TW, [TW]));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p(plan.contexto || "—", { size: 8 }),
                p("Desafío:", { bold: true, size: 8 }),
                p(plan.preguntaGuia || "—", { size: 8 }),
                p("Producto:", { bold: true, size: 8 }),
                p(plan.productoFinal || "—", { size: 8 }),
                ...(plan.objetivosEspecificos?.length
                  ? [
                      p("Objetivos específicos:", { bold: true, size: 8 }),
                      ...plan.objetivosEspecificos.map((o) => p(`• ${o}`, { size: 8 })),
                    ]
                  : []),
                ...(plan.metodologia
                  ? [p("Metodología:", { bold: true, size: 8 }), p(plan.metodologia, { size: 8 })]
                  : []),
              ],
              TW
            ),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 7. PLANIFICACIÓN DEL PROYECTO INTERDISCIPLINAR
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Planificación del proyecto interdisciplinar")], TW, [TW]));

  const elementoLabel = plan.baseCurricular === "destrezas" ? "Destreza con criterio de desempeño" : "Competencia específica";
  const COL_ASIG = Math.floor(TW * 0.12);
  const COL_CE = Math.floor(TW * 0.22);
  const COL_IND = Math.floor(TW * 0.22);
  const COL_DECL = Math.floor(TW * 0.147);
  const COL_PROC = Math.floor(TW * 0.147);
  const COL_ACT = TW - COL_ASIG - COL_CE - COL_IND - COL_DECL - COL_PROC;
  const COLS_PLANIF = [COL_ASIG, COL_CE, COL_IND, COL_DECL, COL_PROC, COL_ACT];

  const filasPlanificacion: TableRow[] = [];
  if (plan.areas.length === 0) {
    filasPlanificacion.push(
      new TableRow({ children: [tc([p("Sin áreas registradas.", { size: 8 })], TW, { cs: 6 })] })
    );
  }
  for (const area of plan.areas) {
    const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);
    if (elementosDeArea.length === 0) {
      filasPlanificacion.push(
        new TableRow({
          children: [
            tc([p(area.nombreArea, { bold: true, size: 7 })], COL_ASIG),
            tc([p("Sin elementos curriculares seleccionados.", { size: 7 })], TW - COL_ASIG, { cs: 5 }),
          ],
        })
      );
      continue;
    }
    for (const e of elementosDeArea) {
      const info = saberesDeElemento(plan.baseCurricular, e.codigo, area);
      filasPlanificacion.push(
        new TableRow({
          children: [
            tc([p(area.nombreArea, { bold: true, size: 7 })], COL_ASIG),
            tc([p(`${e.codigo}. ${descripcionDeElemento(plan.baseCurricular, e.codigo)}`, { size: 7 })], COL_CE),
            tc(listaParrafos(info.indicadores), COL_IND),
            tc(listaParrafos(info.declarativos), COL_DECL),
            tc(listaParrafos(info.procedimentales), COL_PROC),
            tc(listaParrafos(info.actitudinales), COL_ACT),
          ],
        })
      );
    }
  }

  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Asignatura", { bold: true, size: 8, color: WHITE })], COL_ASIG, { bg: COLOR_PRIMARY }),
            tc([p(elementoLabel, { bold: true, size: 8, color: WHITE })], COL_CE, { bg: COLOR_PRIMARY }),
            tc([p("Indicadores de evaluación", { bold: true, size: 8, color: WHITE })], COL_IND, { bg: COLOR_PRIMARY }),
            tc([p("Saberes declarativos", { bold: true, size: 8, color: WHITE })], COL_DECL, { bg: COLOR_PRIMARY }),
            tc([p("Saberes procedimentales", { bold: true, size: 8, color: WHITE })], COL_PROC, { bg: COLOR_PRIMARY }),
            tc([p("Saberes actitudinales", { bold: true, size: 8, color: WHITE })], COL_ACT, { bg: COLOR_PRIMARY }),
          ],
        }),
        ...filasPlanificacion,
      ],
      TW,
      COLS_PLANIF
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 8. ACTIVIDADES SUGERIDAS Y EVIDENCIAS DE EVALUACIÓN
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Actividades sugeridas y evidencias de evaluación")], TW, [TW]));

  const COL_ACTIV = Math.floor(TW * 0.34);
  const COL_REC = Math.floor(TW * 0.2);
  const COL_EVID = Math.floor(TW * 0.2);
  const COL_EVAL = Math.floor(TW * 0.16);
  const COL_INSTR = TW - COL_ACTIV - COL_REC - COL_EVID - COL_EVAL;

  const fases: FaseProyecto[] = ["planificacion", "gestion", "evaluacion"];

  for (const fase of fases) {
    const actividadesDeFase = plan.actividades.filter((a) => a.fase === fase);
    if (actividadesDeFase.length === 0) continue;

    children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));

    const filas = actividadesDeFase.map(
      (a) =>
        new TableRow({
          children: [
            tc([p(a.actividad || "—", { size: 7 })], COL_ACTIV),
            tc([p(a.recursos || "—", { size: 7 })], COL_REC),
            tc([p(a.evidencia || "—", { size: 7 })], COL_EVID),
            tc([p(a.evaluacion || "—", { size: 7 })], COL_EVAL),
            tc([p(a.instrumentoEvaluacion || "—", { size: 7 })], COL_INSTR),
          ],
        })
    );

    children.push(
      makeTable(
        [
          new TableRow({
            tableHeader: true,
            children: [
              tc([p(FASES_LABEL[fase], { bold: true, size: 8, color: WHITE })], COL_ACTIV, { bg: COLOR_PRIMARY }),
              tc([p("Recursos", { bold: true, size: 8, color: WHITE })], COL_REC, { bg: COLOR_PRIMARY }),
              tc([p("Evidencia", { bold: true, size: 8, color: WHITE })], COL_EVID, { bg: COLOR_PRIMARY }),
              tc([p("Evaluación", { bold: true, size: 8, color: WHITE })], COL_EVAL, { bg: COLOR_PRIMARY }),
              tc([p("Instrumento", { bold: true, size: 8, color: WHITE })], COL_INSTR, { bg: COLOR_PRIMARY }),
            ],
          }),
          ...filas,
        ],
        TW,
        [COL_ACTIV, COL_REC, COL_EVID, COL_EVAL, COL_INSTR]
      )
    );
  }

  if (plan.actividades.length === 0) {
    children.push(
      makeTable([new TableRow({ children: [tc([p("Sin actividades registradas.", { size: 8 })], TW)] })], TW, [TW])
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. EVALUACIÓN GENERAL
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Evaluación general")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p(plan.evaluacionGeneral || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 10. RECOMENDACIONES PARA EL DOCENTE
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80, before: 120 }, children: [] }));
  children.push(makeTable([sectionRow("Recomendaciones para el docente")], TW, [TW]));

  const recomendaciones: Paragraph[] = [];
  if (plan.adaptaciones) {
    recomendaciones.push(p("Adaptaciones / inclusión:", { bold: true, size: 8 }));
    recomendaciones.push(p(plan.adaptaciones, { size: 8 }));
  }
  if (plan.observaciones) {
    recomendaciones.push(p("Observaciones:", { bold: true, size: 8 }));
    recomendaciones.push(p(plan.observaciones, { size: 8 }));
  }
  recomendaciones.push(
    p(
      "Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del Ministerio de Educación.",
      { size: 7 }
    )
  );
  children.push(makeTable([new TableRow({ children: [tc(recomendaciones, TW)] })], TW, [TW]));

  // ═══════════════════════════════════════════════════════════════
  // 11. FIRMAS
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  children.push(makeTable([sectionRow("Firmas")], TW, [TW]));

  const docentes = plan.docentesParticipantes?.length ? plan.docentesParticipantes : ["Docente responsable"];
  const COL_FIRMA = Math.floor(TW / docentes.length);
  const anchos = docentes.map((_, i) => (i === docentes.length - 1 ? TW - COL_FIRMA * (docentes.length - 1) : COL_FIRMA));

  children.push(new Paragraph({ spacing: { before: 300, after: 40 }, children: [] }));
  children.push(
    makeTable(
      [
        new TableRow({
          children: docentes.map((d, i) =>
            tc([p("_______________________", { size: 8, align: "center" }), p(d, { size: 8, align: "center" })], anchos[i])
          ),
        }),
      ],
      TW,
      anchos
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
