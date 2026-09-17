/**
 * Genera el documento Word (.docx) para un Proyecto Interdisciplinar.
 *
 * Sigue el mismo patrón de tablas/colores que
 * `curriculo-competencias-egb-bgu-integrado-word-generator.ts` (el más
 * reciente del repo), con secciones propias del módulo (design.md, Decisión 6):
 *   1. Encabezado (Institución / Base curricular)
 *   2. Título del documento
 *   3. Datos informativos (proyecto, duración, docentes participantes)
 *   4. Información general (contexto, pregunta guía, objetivo, producto final, metodología)
 *   5. Áreas participantes y articulación curricular (una tabla por área)
 *   6. Actividades por fase (Planificación / Gestión / Evaluación)
 *   7. Evaluación general
 *   8. Firmas de docentes participantes
 *   9. Nota al pie
 *
 * Cada elemento curricular se resuelve contra el catálogo estático VIGENTE
 * al momento de exportar (nunca se copia la descripción al registro
 * guardado — design.md, Decisión 2), así que un cambio de catálogo se
 * refleja en la próxima exportación.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { ProyectoInterdisciplinarPlan, BaseCurricular, FaseProyecto } from "../data/types-proyecto-interdisciplinar";
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
            tc([p("Proyecto Interdisciplinar", { bold: true, size: 12, align: "center" })], TW, { bg: COLOR_HEADER }),
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
  const COL_TIT = Math.floor(TW * 0.6);
  const COL_DUR = TW - COL_TIT;

  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Datos informativos:", { bold: true, size: 8 })], TW)] })],
      TW,
      [TW]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Título del proyecto: ${plan.titulo || "—"}`, { size: 8 })], COL_TIT),
            tc([p(`Duración: ${plan.duracion || "—"}`, { size: 8 })], COL_DUR),
          ],
        }),
      ],
      TW,
      [COL_TIT, COL_DUR]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [p(`Docentes participantes: ${plan.docentesParticipantes?.join(", ") || "—"}`, { size: 8 })],
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
  // 4. INFORMACIÓN GENERAL
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Información general")], TW, [TW]));

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p("Contexto / situación:", { bold: true, size: 8 }),
                p(plan.contexto || "—", { size: 8 }),
                p("Pregunta guía:", { bold: true, size: 8 }),
                p(plan.preguntaGuia || "—", { size: 8 }),
                p("Objetivo general:", { bold: true, size: 8 }),
                p(plan.objetivoGeneral || "—", { size: 8 }),
                ...(plan.objetivosEspecificos?.length
                  ? [
                      p("Objetivos específicos:", { bold: true, size: 8 }),
                      ...plan.objetivosEspecificos.map((o) => p(`• ${o}`, { size: 8 })),
                    ]
                  : []),
                p("Producto final:", { bold: true, size: 8 }),
                p(plan.productoFinal || "—", { size: 8 }),
                p("Metodología:", { bold: true, size: 8 }),
                p(plan.metodologia || "—", { size: 8 }),
                ...(plan.adaptaciones
                  ? [p("Adaptaciones / inclusión:", { bold: true, size: 8 }), p(plan.adaptaciones, { size: 8 })]
                  : []),
                ...(plan.observaciones
                  ? [p("Observaciones:", { bold: true, size: 8 }), p(plan.observaciones, { size: 8 })]
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
  // 5. ÁREAS PARTICIPANTES Y ARTICULACIÓN CURRICULAR
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Áreas participantes y articulación curricular")], TW, [TW]));

  const COL_COD = Math.floor(TW * 0.18);
  const COL_DESC = TW - COL_COD;

  if (plan.areas.length === 0) {
    children.push(
      makeTable([new TableRow({ children: [tc([p("Sin áreas registradas.", { size: 8 })], TW)] })], TW, [TW])
    );
  }

  for (const area of plan.areas) {
    children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
    const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);

    const filas: TableRow[] =
      elementosDeArea.length > 0
        ? elementosDeArea.map(
            (e) =>
              new TableRow({
                children: [
                  tc([p(e.codigo, { size: 7, bold: true })], COL_COD),
                  tc([p(descripcionDeElemento(plan.baseCurricular, e.codigo), { size: 7 })], COL_DESC),
                ],
              })
          )
        : [
            new TableRow({
              children: [tc([p("—", { size: 7 })], COL_COD), tc([p("Sin elementos curriculares seleccionados.", { size: 7 })], COL_DESC)],
            }),
          ];

    children.push(
      makeTable(
        [
          new TableRow({
            tableHeader: true,
            children: [
              tc(
                [
                  p(
                    `${area.nombreArea} — ${area.nivel}${area.subnivel ? ` (${area.subnivel})` : ""} · ${area.grado}`,
                    { bold: true, size: 8, color: WHITE }
                  ),
                ],
                TW,
                { bg: COLOR_PRIMARY, cs: 2 }
              ),
            ],
          }),
          ...filas,
        ],
        TW,
        [COL_COD, COL_DESC]
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. ACTIVIDADES POR FASE
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Actividades por fase")], TW, [TW]));

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
  // 7. EVALUACIÓN GENERAL
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
  // 8. FIRMAS
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

  // ═══════════════════════════════════════════════════════════════
  // 9. NOTA AL PIE
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80, before: 120 }, children: [] }));
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p(
                  "Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del Ministerio de Educación.",
                  { size: 7 }
                ),
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
