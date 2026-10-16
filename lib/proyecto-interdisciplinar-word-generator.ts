/**
 * Genera el documento Word (.docx) para un Proyecto Interdisciplinar.
 *
 * Replica el FORMATO OFICIAL "Proyecto Interdisciplinar para la Evaluación
 * Sumativa" del MinEduc (formato de referencia adjunto por el usuario):
 *   1. Encabezado (Institución / Base curricular)
 *   2. Título del documento
 *   3. Datos informativos (institución educativa, año lectivo, grado/curso y
 *      paralelo, docentes, duración, trimestre, asignaturas)
 *   4. Proyecto interdisciplinar (título)
 *   5. Objetivo del proyecto
 *   6. Descripción del proyecto
 *   7. Desafío / 8. Producto
 *   9. Planificación del proyecto interdisciplinar (asignatura, competencia/
 *      destreza, indicadores de evaluación y saberes declarativos/
 *      procedimentales/actitudinales)
 *  10. Fases del proyecto (Fase | Pregunta orientadora | Resultado |
 *      Actividades) — las 5 fases oficiales
 *  11. Sección por asignatura (FASE | SEMANA | ACTIVIDADES | RECURSOS),
 *      una tabla por cada área que tenga detalle registrado
 *  12. Planificación día a día (Fase | Resultado/evidencia | Día y fecha |
 *      Actividad diaria paso a paso | Producto diario específico)
 *  13. Instrumentos de evaluación: rúbrica disciplinar (4–3–2–1, /20) y
 *      rúbrica interdisciplinar (4–3–2–1, /24) con sus fórmulas y la regla
 *      del promedio final
 *  14. Evaluación general
 *  15. Recomendaciones para el docente
 *  16. Firmas de docentes participantes
 *
 * Los proyectos antiguos con 3 fases (planificacion/gestion/evaluacion) se
 * migran a las 5 fases oficiales vía `normalizarFase`.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type {
  AreaProyectoInterdisciplinar,
  ProyectoInterdisciplinarPlan,
  BaseCurricular,
  RubricaProyecto,
} from "../data/types-proyecto-interdisciplinar";
import { FASES_OFICIALES, normalizarFase, puntajeMaximoRubrica } from "../data/proyecto-interdisciplinar-formato";
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

/** Fila de encabezado de tabla (texto blanco sobre color primario). */
function headerCell(text: string, width: number, cs = 1): TableCell {
  return tc([p(text, { bold: true, size: 8, color: WHITE })], width, { bg: COLOR_PRIMARY, cs });
}

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

/** Tabla de rúbrica analítica (Criterio | 4 | 3 | 2 | 1) + línea de puntaje. */
function tablaRubrica(
  rubrica: RubricaProyecto,
  etiqueta: string,
  nombreCalificacion: "disciplinar" | "interdisciplinar"
): (Table | Paragraph)[] {
  const COL_CRIT = Math.floor(TW * 0.16);
  const COL_NIV = Math.floor(TW * 0.21);
  const COL_ULT = TW - COL_CRIT - 3 * COL_NIV;
  const anchos = [COL_CRIT, COL_NIV, COL_NIV, COL_NIV, COL_ULT];

  const filasRubrica: TableRow[] = rubrica.criterios.map(
    (c) =>
      new TableRow({
        cantSplit: true,
        children: [
          tc([p(c.criterio || "—", { bold: true, size: 7 })], COL_CRIT),
          tc([p(c.nivel4 || "—", { size: 7 })], COL_NIV),
          tc([p(c.nivel3 || "—", { size: 7 })], COL_NIV),
          tc([p(c.nivel2 || "—", { size: 7 })], COL_NIV),
          tc([p(c.nivel1 || "—", { size: 7 })], COL_ULT),
        ],
      })
  );

  const maximo = puntajeMaximoRubrica(rubrica);

  return [
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            headerCell(etiqueta, COL_CRIT),
            headerCell("4 – Logro destacado", COL_NIV),
            headerCell("3 – Logro esperado", COL_NIV),
            headerCell("2 – En proceso", COL_NIV),
            headerCell("1 – Requiere apoyo", COL_ULT),
          ],
        }),
        ...filasRubrica,
      ],
      TW,
      anchos
    ),
    new Paragraph({ spacing: { after: 60 }, children: [] }),
    p(`Puntaje máximo: ${maximo} puntos (4 puntos por criterio).`, { bold: true, size: 8 }),
    p(`Calificación ${nombreCalificacion} = (puntaje obtenido ÷ ${maximo}) × 10`, { size: 8 }),
  ];
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
  const gradoBase = primeraArea
    ? `${primeraArea.grado}${primeraArea.subnivel ? ` (${primeraArea.subnivel})` : ` (${primeraArea.nivel})`}`
    : "";
  const cursoLabel = plan.paralelo ? `${gradoBase} — Paralelo ${plan.paralelo}` : gradoBase;

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
        datoRow("Año lectivo:", plan.anioLectivo),
        datoRow("Grado/Curso y paralelo:", cursoLabel),
        datoRow("Docentes:", plan.docentesParticipantes?.join(", ")),
        datoRow("Duración:", plan.duracion),
        datoRow("Trimestre:", plan.trimestre),
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
  // 6. DESCRIPCIÓN DEL PROYECTO / 7. DESAFÍO / 8. PRODUCTO
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

  children.push(makeTable([sectionRow("Desafío")], TW, [TW]));
  children.push(
    makeTable([new TableRow({ children: [tc([p(plan.preguntaGuia || "—", { size: 8 })], TW)] })], TW, [TW])
  );

  children.push(makeTable([sectionRow("Producto")], TW, [TW]));
  children.push(
    makeTable([new TableRow({ children: [tc([p(plan.productoFinal || "—", { size: 8 })], TW)] })], TW, [TW])
  );

  // ═══════════════════════════════════════════════════════════════
  // 9. PLANIFICACIÓN DEL PROYECTO INTERDISCIPLINAR
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Planificación del proyecto interdisciplinar")], TW, [TW]));

  const elementoLabel = plan.baseCurricular === "destrezas" ? "Destreza con criterio de desempeño" : "Competencia específica";
  // Las destrezas con criterios de desempeño no traen saberes desagregados:
  // en ese caso se omiten las tres columnas de saberes en lugar de dejarlas
  // llenas de "—".
  const conSaberes = plan.baseCurricular !== "destrezas";
  const COL_ASIG = Math.floor(TW * (conSaberes ? 0.12 : 0.14));
  const COL_CE = Math.floor(TW * (conSaberes ? 0.22 : 0.36));
  const COL_IND = conSaberes ? Math.floor(TW * 0.22) : TW - COL_ASIG - COL_CE;
  const COL_DECL = Math.floor(TW * 0.147);
  const COL_PROC = Math.floor(TW * 0.147);
  const COL_ACT = TW - COL_ASIG - COL_CE - COL_IND - COL_DECL - COL_PROC;
  const COLS_PLANIF = conSaberes
    ? [COL_ASIG, COL_CE, COL_IND, COL_DECL, COL_PROC, COL_ACT]
    : [COL_ASIG, COL_CE, COL_IND];
  const NCOLS_PLANIF = COLS_PLANIF.length;

  const filasPlanificacion: TableRow[] = [];
  if (plan.areas.length === 0) {
    filasPlanificacion.push(
      new TableRow({ cantSplit: true, children: [tc([p("Sin áreas registradas.", { size: 8 })], TW, { cs: NCOLS_PLANIF })] })
    );
  }
  for (const area of plan.areas) {
    const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);
    if (elementosDeArea.length === 0) {
      filasPlanificacion.push(
        new TableRow({
          cantSplit: true,
          children: [
            tc([p(area.nombreArea, { bold: true, size: 7 })], COL_ASIG),
            tc([p("Sin elementos curriculares seleccionados.", { size: 7 })], TW - COL_ASIG, { cs: NCOLS_PLANIF - 1 }),
          ],
        })
      );
      continue;
    }
    for (const e of elementosDeArea) {
      const info = saberesDeElemento(plan.baseCurricular, e.codigo, area);
      filasPlanificacion.push(
        new TableRow({
          // Una fila (asignatura + destreza + indicadores) no se parte entre páginas.
          cantSplit: true,
          children: [
            tc([p(area.nombreArea, { bold: true, size: 7 })], COL_ASIG),
            tc([p(`${e.codigo}. ${descripcionDeElemento(plan.baseCurricular, e.codigo)}`, { size: 7 })], COL_CE),
            tc(listaParrafos(info.indicadores), COL_IND),
            ...(conSaberes
              ? [
                  tc(listaParrafos(info.declarativos), COL_DECL),
                  tc(listaParrafos(info.procedimentales), COL_PROC),
                  tc(listaParrafos(info.actitudinales), COL_ACT),
                ]
              : []),
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
            headerCell("Asignatura", COL_ASIG),
            headerCell(elementoLabel, COL_CE),
            headerCell("Indicadores de evaluación", COL_IND),
            ...(conSaberes
              ? [
                  headerCell("Saberes declarativos", COL_DECL),
                  headerCell("Saberes procedimentales", COL_PROC),
                  headerCell("Saberes actitudinales", COL_ACT),
                ]
              : []),
          ],
        }),
        ...filasPlanificacion,
      ],
      TW,
      COLS_PLANIF
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 10. FASES DEL PROYECTO (5 FASES OFICIALES)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Fases del proyecto interdisciplinar")], TW, [TW]));

  const COL_FASE = Math.floor(TW * 0.2);
  const COL_PREG = Math.floor(TW * 0.18);
  const COL_RES = Math.floor(TW * 0.14);
  const COL_ACT_FASE = TW - COL_FASE - COL_PREG - COL_RES;

  const filasFases: TableRow[] = FASES_OFICIALES.map((f) => {
    const actividadesDeFase = plan.actividades.filter((a) => normalizarFase(a.fase) === f.key);
    const parrafosActividades: Paragraph[] =
      actividadesDeFase.length > 0
        ? actividadesDeFase.flatMap((a) => [
            p(a.actividad || "—", { size: 7 }),
            ...(a.evidencia ? [p(`Evidencia: ${a.evidencia}`, { size: 7 })] : []),
            ...(a.evaluacion ? [p(`Evaluación: ${a.evaluacion}`, { size: 7 })] : []),
            ...(a.instrumentoEvaluacion ? [p(`Instrumento: ${a.instrumentoEvaluacion}`, { size: 7 })] : []),
          ])
        : [p("—", { size: 7 })];

    return new TableRow({
      cantSplit: true,
      children: [
        tc([p(f.label, { bold: true, size: 7 })], COL_FASE),
        tc([p(f.preguntaOrientadora, { size: 7 })], COL_PREG),
        tc([p(f.resultado, { size: 7 })], COL_RES),
        tc(parrafosActividades, COL_ACT_FASE),
      ],
    });
  });

  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            headerCell("Fase", COL_FASE),
            headerCell("Pregunta orientadora", COL_PREG),
            headerCell("Resultado", COL_RES),
            headerCell("Actividades del proyecto", COL_ACT_FASE),
          ],
        }),
        ...filasFases,
      ],
      TW,
      [COL_FASE, COL_PREG, COL_RES, COL_ACT_FASE]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 11. SECCIÓN POR ASIGNATURA (FASE | SEMANA | ACTIVIDADES | RECURSOS)
  // ═══════════════════════════════════════════════════════════════
  const detallePorArea = (plan.detalleAreas ?? [])
    .map((d) => ({ detalle: d, area: plan.areas.find((a) => a.id === d.areaProyectoId) }))
    .filter((x): x is { detalle: NonNullable<typeof x.detalle>; area: AreaProyectoInterdisciplinar } => !!x.area);

  if (detallePorArea.length > 0) {
    children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
    children.push(makeTable([sectionRow("Planificación por asignatura")], TW, [TW]));

    const COL_FASE_ASIG = Math.floor(TW * 0.18);
    const COL_SEMANA = Math.floor(TW * 0.1);
    const COL_ACTIV_ASIG = Math.floor(TW * 0.47);
    const COL_REC_ASIG = TW - COL_FASE_ASIG - COL_SEMANA - COL_ACTIV_ASIG;

    for (const { detalle, area } of detallePorArea) {
      children.push(new Paragraph({ spacing: { after: 30 }, children: [] }));
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc(
                  [
                    p(
                      `${area.nombreArea.toUpperCase()}: PROYECTO INTERDISCIPLINARIO — ${plan.titulo || ""}`,
                      { bold: true, size: 8 }
                    ),
                  ],
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

      const filasDetalle: TableRow[] = [];
      for (const f of FASES_OFICIALES) {
        const bloque = detalle.fases.find((b) => normalizarFase(b.fase) === f.key);
        if (!bloque) continue;
        filasDetalle.push(
          new TableRow({
            cantSplit: true,
            children: [
              tc([p(f.corto, { bold: true, size: 7 })], COL_FASE_ASIG),
              tc([p(bloque.semana || "—", { size: 7 })], COL_SEMANA),
              tc(listaParrafos(bloque.actividades, 7), COL_ACTIV_ASIG),
              tc(listaParrafos(bloque.recursos, 7), COL_REC_ASIG),
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
                headerCell("Fase", COL_FASE_ASIG),
                headerCell("Semana", COL_SEMANA),
                headerCell("Actividades", COL_ACTIV_ASIG),
                headerCell("Recursos", COL_REC_ASIG),
              ],
            }),
            ...filasDetalle,
          ],
          TW,
          [COL_FASE_ASIG, COL_SEMANA, COL_ACTIV_ASIG, COL_REC_ASIG]
        )
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 12. PLANIFICACIÓN DÍA A DÍA
  // ═══════════════════════════════════════════════════════════════
  if (plan.diaPorDia?.length) {
    children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
    children.push(makeTable([sectionRow("Planificación día a día")], TW, [TW]));

    const COL_FASE_DIA = Math.floor(TW * 0.12);
    const COL_DIA = Math.floor(TW * 0.08);
    const COL_FECHA = Math.floor(TW * 0.08);
    const COL_ACTIV_DIA = Math.floor(TW * 0.42);
    const COL_PROD_DIA = TW - COL_FASE_DIA - COL_DIA - COL_FECHA - COL_ACTIV_DIA;

    const filasDia = plan.diaPorDia.map((d) => {
      const fase = FASES_OFICIALES.find((f) => f.key === normalizarFase(d.fase));
      const area = d.areaProyectoId ? plan.areas.find((a) => a.id === d.areaProyectoId) : undefined;
      return new TableRow({
        cantSplit: true,
        children: [
          tc([p(fase?.corto || "—", { size: 7 }), ...(area ? [p(area.nombreArea, { size: 7 })] : [])], COL_FASE_DIA),
          tc([p(d.dia || "—", { size: 7 })], COL_DIA),
          tc([p(d.fecha || "—", { size: 7 })], COL_FECHA),
          tc([p(d.actividad || "—", { size: 7 })], COL_ACTIV_DIA),
          tc([p(d.productoDiario || "—", { size: 7 })], COL_PROD_DIA),
        ],
      });
    });

    children.push(
      makeTable(
        [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell("Fase", COL_FASE_DIA),
              headerCell("Día", COL_DIA),
              headerCell("Fecha", COL_FECHA),
              headerCell("Actividad diaria paso a paso", COL_ACTIV_DIA),
              headerCell("Producto diario específico", COL_PROD_DIA),
            ],
          }),
          ...filasDia,
        ],
        TW,
        [COL_FASE_DIA, COL_DIA, COL_FECHA, COL_ACTIV_DIA, COL_PROD_DIA]
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 13. INSTRUMENTOS DE EVALUACIÓN (RÚBRICAS OFICIALES)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 40, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Instrumentos de evaluación")], TW, [TW]));

  if (plan.rubricaDisciplinar?.criterios.length) {
    children.push(new Paragraph({ spacing: { after: 30 }, children: [] }));
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc(
                [
                  p(`Instrumento de evaluación disciplinar — ${plan.rubricaDisciplinar.titulo || "Disciplina"}`, {
                    bold: true,
                    size: 9,
                  }),
                  p(
                    `Proyecto: ${plan.titulo || "—"} · Grado/Curso: ${gradoBase || "—"} · Técnica: análisis del desempeño · Instrumento: rúbrica analítica`,
                    { size: 7 }
                  ),
                ],
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
    children.push(...tablaRubrica(plan.rubricaDisciplinar, "Criterio disciplinar", "disciplinar"));
  }

  if (plan.rubricaInterdisciplinar?.criterios.length) {
    children.push(new Paragraph({ spacing: { after: 30, before: 80 }, children: [] }));
    children.push(
      makeTable(
        [
          new TableRow({
            children: [
              tc(
                [
                  p("Instrumento de evaluación interdisciplinar — Producto final", { bold: true, size: 9 }),
                  p(
                    `Producto final: ${plan.productoFinal || "—"} · Técnica: análisis del producto y presentación · Instrumento: rúbrica interdisciplinar · Aplicación: conjunta por el equipo docente`,
                    { size: 7 }
                  ),
                ],
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
    children.push(...tablaRubrica(plan.rubricaInterdisciplinar, "Criterio interdisciplinar", "interdisciplinar"));
    children.push(
      p(
        "La rúbrica interdisciplinar es común para el producto final; cada asignatura combina su calificación disciplinar con la calificación común del producto interdisciplinar.",
        { size: 8 }
      )
    );
    children.push(
      p("Nota final del proyecto en cada asignatura = (calificación disciplinar + calificación interdisciplinar) ÷ 2", {
        bold: true,
        size: 8,
      })
    );
  }

  if (!plan.rubricaDisciplinar?.criterios.length && !plan.rubricaInterdisciplinar?.criterios.length) {
    children.push(
      makeTable(
        [new TableRow({ children: [tc([p("Sin instrumentos de evaluación registrados.", { size: 8 })], TW)] })],
        TW,
        [TW]
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 14. EVALUACIÓN GENERAL
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80, before: 80 }, children: [] }));
  children.push(makeTable([sectionRow("Evaluación general")], TW, [TW]));
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p(plan.evaluacionGeneral || "—", { size: 8 })], TW)] })],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 15. RECOMENDACIONES PARA EL DOCENTE
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
  // 16. FIRMAS
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
