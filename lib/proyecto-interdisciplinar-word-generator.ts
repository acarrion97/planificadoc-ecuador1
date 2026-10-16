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


/** Fila de encabezado de tabla (texto blanco sobre color primario). */
function headerCell(text: string, width: number, cs = 1): TableCell {
  return tc([p(text, { bold: true, size: 8, color: WHITE })], width, { bg: COLOR_PRIMARY, cs });
}

/**
 * Título de sección NUMERADO como texto (no como fila de tabla): el formato
 * oficial solo usa tablas en las matrices (planificación curricular, fases,
 * secciones por asignatura, día a día y rúbricas); el resto va numerado en
 * texto corrido.
 */
function sectionTitle(numero: string, titulo: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    shading: { fill: COLOR_SECTION, type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: `${numero}. ${titulo}`, bold: true, size: 10, color: COLOR_PRIMARY, font: "Arial" }),
    ],
  });
}

/** Línea de texto con etiqueta en negrita y su valor (patrón del formato oficial). */
function lineaDato(label: string, valor: string | undefined, indent = 360): Paragraph {
  return new Paragraph({
    indent: { left: indent },
    spacing: { after: 40, before: 20 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 8, color: BLACK, font: "Arial" }),
      new TextRun({ text: valor?.trim() || "—", size: 8, color: BLACK, font: "Arial" }),
    ],
  });
}

/** Párrafo de texto corrido indentado (continuación de una sección numerada). */
function textoIndentado(texto: string, opts: { bold?: boolean; indent?: number } = {}): Paragraph {
  return new Paragraph({
    indent: { left: opts.indent ?? 360 },
    spacing: { after: 40, before: 20 },
    children: [
      new TextRun({ text: texto, bold: opts.bold ?? false, size: 8, color: BLACK, font: "Arial" }),
    ],
  });
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
  // TÍTULO (texto centrado — el formato oficial NO usa tabla aquí)
  // ═══════════════════════════════════════════════════════════════
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
      children: [
        new TextRun({
          text: "PROYECTO INTERDISCIPLINAR PARA LA EVALUACIÓN SUMATIVA",
          bold: true,
          size: 14,
          font: "Arial",
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `Base curricular: ${baseLabel}`, size: 7, color: "555555", font: "Arial" }),
      ],
    })
  );

  // Numeración dinámica de secciones: el formato oficial numera en texto y
  // solo usa tablas en las matrices (planificación curricular, fases,
  // secciones por asignatura, día a día y rúbricas).
  let numSeccion = 0;
  const nuevaSeccion = (titulo: string): number => {
    numSeccion += 1;
    children.push(sectionTitle(String(numSeccion), titulo));
    return numSeccion;
  };

  // ═══════════════════════════════════════════════════════════════
  // 1. DATOS INFORMATIVOS (texto numerado)
  // ═══════════════════════════════════════════════════════════════
  const asignaturas = Array.from(new Set(plan.areas.map((a) => a.nombreArea))).join(", ");
  const primeraArea = plan.areas[0];
  const gradoBase = primeraArea
    ? `${primeraArea.grado}${primeraArea.subnivel ? ` (${primeraArea.subnivel})` : ` (${primeraArea.nivel})`}`
    : "";
  const cursoLabel = plan.paralelo ? `${gradoBase} — Paralelo ${plan.paralelo}` : gradoBase;

  nuevaSeccion("Datos informativos");
  children.push(lineaDato("Institución educativa", plan.institucion));
  children.push(lineaDato("Año lectivo", plan.anioLectivo));
  children.push(lineaDato("Grado/Curso y paralelo", cursoLabel));
  children.push(lineaDato("Docentes", plan.docentesParticipantes?.join(", ")));
  children.push(lineaDato("Duración", plan.duracion));
  children.push(lineaDato("Trimestre", plan.trimestre));
  children.push(lineaDato("Asignaturas", asignaturas));

  // ═══════════════════════════════════════════════════════════════
  // 2. PROYECTO INTERDISCIPLINAR
  //    2.1 Objetivo / 2.2 Descripción / 2.3 Desafío / 2.4 Producto
  //    (texto numerado, como en el formato oficial)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion(`Proyecto interdisciplinar: “${plan.titulo || "—"}”`);
  children.push(lineaDato("2.1. Objetivo del proyecto", plan.objetivoGeneral));
  children.push(lineaDato("2.2. Descripción del proyecto", plan.contexto));
  if (plan.objetivosEspecificos?.length) {
    children.push(textoIndentado("Objetivos específicos:", { bold: true }));
    for (const o of plan.objetivosEspecificos) children.push(textoIndentado(`• ${o}`));
  }
  if (plan.metodologia) children.push(lineaDato("Metodología", plan.metodologia));
  children.push(lineaDato("2.3. Desafío", plan.preguntaGuia));
  children.push(lineaDato("2.4. Producto", plan.productoFinal));

  // ═══════════════════════════════════════════════════════════════
  // 3. PLANIFICACIÓN DEL PROYECTO INTERDISCIPLINAR (tabla)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion("Planificación del proyecto interdisciplinar");

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
  // FASES DEL PROYECTO (5 FASES OFICIALES — tabla)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion("Fases del proyecto interdisciplinar");

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
    nuevaSeccion("Planificación por asignatura");

    const COL_FASE_ASIG = Math.floor(TW * 0.18);
    const COL_SEMANA = Math.floor(TW * 0.1);
    const COL_ACTIV_ASIG = Math.floor(TW * 0.47);
    const COL_REC_ASIG = TW - COL_FASE_ASIG - COL_SEMANA - COL_ACTIV_ASIG;

    for (const { detalle, area } of detallePorArea) {
      children.push(new Paragraph({ spacing: { after: 30 }, children: [] }));
      children.push(
        textoIndentado(
          `${area.nombreArea.toUpperCase()}: PROYECTO INTERDISCIPLINARIO — ${plan.titulo || ""}`,
          { bold: true, indent: 0 }
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
    nuevaSeccion("Planificación día a día");

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
  const numInstrumentos = nuevaSeccion("Instrumentos de evaluación");

  if (plan.rubricaDisciplinar?.criterios.length) {
    children.push(new Paragraph({ spacing: { after: 30 }, children: [] }));
    children.push(
      textoIndentado(`${numInstrumentos}.1 Instrumento de evaluación disciplinar — ${plan.rubricaDisciplinar.titulo || "Disciplina"}`, {
        bold: true,
        indent: 0,
      })
    );
    children.push(
      textoIndentado(
        `Proyecto: ${plan.titulo || "—"} · Grado/Curso: ${gradoBase || "—"} · Técnica: análisis del desempeño · Instrumento: rúbrica analítica`
      )
    );
    children.push(...tablaRubrica(plan.rubricaDisciplinar, "Criterio disciplinar", "disciplinar"));
  }

  if (plan.rubricaInterdisciplinar?.criterios.length) {
    children.push(new Paragraph({ spacing: { after: 30, before: 80 }, children: [] }));
    children.push(
      textoIndentado(`${numInstrumentos}.2 Instrumento de evaluación interdisciplinar — Producto final`, {
        bold: true,
        indent: 0,
      })
    );
    children.push(
      textoIndentado(
        `Producto final: ${plan.productoFinal || "—"} · Técnica: análisis del producto y presentación · Instrumento: rúbrica interdisciplinar · Aplicación: conjunta por el equipo docente`
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
    children.push(textoIndentado("Sin instrumentos de evaluación registrados."));
  }

  // ═══════════════════════════════════════════════════════════════
  // EVALUACIÓN GENERAL (texto)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion("Evaluación general");
  children.push(textoIndentado(plan.evaluacionGeneral || "—"));

  // ═══════════════════════════════════════════════════════════════
  // RECOMENDACIONES PARA EL DOCENTE (texto)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion("Recomendaciones para el docente");

  if (plan.adaptaciones) {
    children.push(lineaDato("Adaptaciones / inclusión", plan.adaptaciones));
  }
  if (plan.observaciones) {
    children.push(lineaDato("Observaciones", plan.observaciones));
  }
  children.push(
    textoIndentado(
      "Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del Ministerio de Educación."
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // FIRMAS (tabla — solo las firmas mantienen tabla en esta sección)
  // ═══════════════════════════════════════════════════════════════
  nuevaSeccion("Firmas");

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
