/**
 * Genera el documento Word (.docx) para Planificación Currículo Integrado
 * por Competencias — EGB / BGU (Elemental, Media, Superior, Bachillerato).
 *
 * A diferencia del generador de Inicial (multigrado: 3-4/4-5 años en la
 * misma planificación), aquí cada planificación es de UN solo grado/curso,
 * como corresponde a una clase regular de EGB o BGU.
 *
 * Estructura (mismo formato oficial MINEDUC que Inicial, adaptado a un
 * solo grado):
 *   1. Encabezado (Unidad Educativa / Año lectivo)
 *   2. Título: Planificación microcurricular
 *   3. Datos Informativos (Docente, Asignatura, Grado/Curso, Paralelo, Trimestre, No. semanas)
 *   4. Situación de aprendizaje
 *   5. Conexión interdisciplinar (competencias con código CE)
 *   6. Competencias específicas + código CE
 *   7. Indicadores de evaluación (4 col: Indicadores | Declarativos | Procedimentales | Actitudinales)
 *   8. Tabla DUA semanal (3 col: Semana | Estrategias DUA | Técnicas e instrumentos)
 *   9. Nota al pie
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type {
  PlanificacionInicialCurriculo,
  AmbitoDesarrollo,
  PlanificacionCurriculoIntegradoMultigrado,
  GrupoGrado,
} from "../data/types-curriculo-competencias";
import {
  buscarCompetenciaEspecificaEGBBGU,
  buscarConexionesInterdisciplinariasMesocurriculo,
  MATERIAS_EGB_BGU,
} from "../data/competencias-especificas-egb-bgu";

/** Ordinal (en palabra) → número, para reformatear "OCTAVO GRADO" como "8.º EGB". */
const ORDINAL_A_NUMERO: Record<string, number> = {
  PRIMER: 1, PRIMERO: 1,
  SEGUNDO: 2,
  TERCER: 3, TERCERO: 3,
  CUARTO: 4,
  QUINTO: 5,
  SEXTO: 6,
  SÉPTIMO: 7, SEPTIMO: 7,
  OCTAVO: 8,
  NOVENO: 9,
  DÉCIMO: 10, DECIMO: 10,
};

/** "OCTAVO GRADO" → "8.º EGB"; "TERCER CURSO" → "3.º BGU"; si no se reconoce, se devuelve tal cual. */
function formatGradoCurso(grado: string): string {
  const primeraPalabra = grado.trim().split(/\s+/)[0]?.toUpperCase();
  const numero = primeraPalabra ? ORDINAL_A_NUMERO[primeraPalabra] : undefined;
  if (!numero) return grado;
  if (/GRADO$/i.test(grado)) return `${numero}.º EGB`;
  if (/CURSO$/i.test(grado)) return `${numero}.º BGU`;
  return grado;
}

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

/** Extrae los códigos CE de un ámbito (soporta varios códigos en la descripción). */
function extraerCodigosCE(ambito: { competenciaCodigo?: string; competenciaDescripcion?: string }): string[] {
  const desc = ambito.competenciaDescripcion || "";
  const matches = desc.match(/CE\.[A-Z]+(?:\.[A-Z]+)?\.\d+\.\d+/g);
  return matches || (ambito.competenciaCodigo ? [ambito.competenciaCodigo] : []);
}

/** Encuentra la materia del catálogo nuevo a la que pertenece un código CE. */
function materiaDelCodigo(codigo: string): (typeof MATERIAS_EGB_BGU)[number] | undefined {
  return MATERIAS_EGB_BGU.find((m) => m.competencias.some((c) => c.codigo === codigo));
}

/** Nombre de la materia (para mostrar en "Asignatura") a partir del código CE de cualquiera de los ámbitos. */
function nombreMateria(ambitos: AmbitoDesarrollo[]): string {
  for (const a of ambitos) {
    const materia = materiaDelCodigo(a.competenciaCodigo || "");
    if (materia) return materia.nombre;
  }
  return "Currículo integrado";
}

/** Trunca sin cortar palabras a la mitad. */
function truncateWords(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut).trim();
}

// ── Generador principal ──
export async function generarCurriculoCompetenciasWordEGBBGUIntegrado(
  plan: PlanificacionInicialCurriculo
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const ambitos = plan.ambitos || [];

  // ═══════════════════════════════════════════════════════════════
  // 1. ENCABEZADO
  // ═══════════════════════════════════════════════════════════════
  // Anchos en DXA enteros: docx.js usa columnWidths tal cual para el
  // tblGrid, y con layout FIXED un valor fraccionario (TW * 0.6 sin
  // redondear) o un grid que no coincide con las celdas reales de cada
  // fila rompe el ancho de la tabla en Word (queda angosta / "a media
  // página"). Se calcula la última columna por resta para que la suma
  // sea exactamente TW.
  const COL_INST = Math.floor(TW * 0.6);
  const COL_ANIO = TW - COL_INST;
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "Unidad Educativa", { bold: true, size: 9 })], COL_INST, { bg: COLOR_HEADER }),
            tc([p(`Año lectivo: ${plan.duracion || plan.periodoPedagogico || "—"}`, { size: 9 })], COL_ANIO, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [COL_INST, COL_ANIO]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 2. TÍTULO
  // ═══════════════════════════════════════════════════════════════
  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Planificación microcurricular", { bold: true, size: 12, align: "center" })], TW, { bg: COLOR_HEADER })] })],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 3. DATOS INFORMATIVOS
  // ═══════════════════════════════════════════════════════════════
  const numSemanas = plan.noSemanasClase || plan.ambitos?.[0]?.clases?.length || 8;
  const asignatura = nombreMateria(ambitos);
  const gradoCurso = plan.grado ? formatGradoCurso(plan.grado) : "—";

  // Cada fila con una cantidad distinta de celdas va en su propia tabla:
  // docx.js usa `columnWidths` literalmente como el tblGrid de TODA la
  // tabla, así que mezclar filas de 1/2/3 celdas bajo un único
  // `columnWidths: [TW]` deja un grid de 1 columna que no coincide con
  // las filas de 2-3 celdas y rompe el ancho en Word.
  const COL_ASIG = Math.floor(TW * 0.4);
  const COL_GRADOCURSO = Math.floor(TW * 0.4);
  const COL_PARALELO = TW - COL_ASIG - COL_GRADOCURSO;
  const COL_TRIM = Math.floor(TW * 0.5);
  const COL_SEM = TW - COL_TRIM;

  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Datos informativos:", { bold: true, size: 8 })], TW)] })],
      TW,
      [TW]
    ),
    makeTable(
      [new TableRow({ children: [tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW)] })],
      TW,
      [TW]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Asignatura: ${asignatura}`, { size: 8 })], COL_ASIG),
            tc([p(`Grado/Curso: ${gradoCurso}`, { size: 8 })], COL_GRADOCURSO),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], COL_PARALELO),
          ],
        }),
      ],
      TW,
      [COL_ASIG, COL_GRADOCURSO, COL_PARALELO]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], COL_TRIM),
            tc([p(`No. de semanas: ${numSemanas}`, { size: 8 })], COL_SEM),
          ],
        }),
      ],
      TW,
      [COL_TRIM, COL_SEM]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 4. SITUACIÓN DE APRENDIZAJE
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Situación de aprendizaje")], TW, [TW]));

  const tituloSA = plan.situacionAprendizaje?.titulo || plan.objetivoGeneral || "—";
  const descSA = plan.situacionAprendizaje?.descripcion || ambitos.map((a) => a.destrezas?.join(", ")).filter(Boolean).join("; ") || "—";

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

  // Se buscan Competencias Específicas de OTRAS materias del MESOCURRICULUM,
  // del mismo subnivel, cuyo texto coincida temáticamente (por palabras
  // clave) con la competencia que se está planificando. Debe usar el mismo
  // catálogo (MESOCURRICULUM) que el resto del documento — no el catálogo de
  // Destrezas del Currículo 2016, cuyos códigos "CE" son Criterios de
  // Evaluación de un marco distinto y no existen en este catálogo.
  const conexionesVistas = new Set<string>();
  const filasConexionInterdisciplinar: TableRow[] = [];
  for (const a of ambitos) {
    const codigo = a.competenciaCodigo || "";
    const materia = materiaDelCodigo(codigo);
    if (!materia) continue;
    const conexiones = buscarConexionesInterdisciplinariasMesocurriculo(
      materia.id,
      codigo,
      a.competenciaDescripcion,
      []
    );
    for (const conn of conexiones) {
      const key = `${conn.area}:${conn.ceCode}`;
      if (conexionesVistas.has(key)) continue;
      conexionesVistas.add(key);
      filasConexionInterdisciplinar.push(
        new TableRow({
          children: [tc([p(`• ${conn.area}: ${conn.descripcion} (${conn.ceCode})`, { size: 8 })], TW)],
        })
      );
    }
  }
  if (filasConexionInterdisciplinar.length === 0) {
    filasConexionInterdisciplinar.push(
      new TableRow({ children: [tc([p("—", { size: 8 })], TW)] })
    );
  }

  children.push(
    makeTable(
      [
        new TableRow({ children: [tc([p("Asignaturas:", { bold: true, size: 8 })], TW)] }),
        ...filasConexionInterdisciplinar,
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 6. COMPETENCIAS ESPECÍFICAS
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Competencias específicas")], TW, [TW]));

  const todosCE = ambitos.map((a) => {
    const ce = extraerCodigosCE(a);
    return ce.length > 0 ? ce.join(", ") : (a.competenciaCodigo || "—");
  }).filter((c) => c !== "—").join(", ");

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(todosCE || "—", { size: 8 })], TW),
          ],
        }),
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 7. INDICADORES DE EVALUACIÓN (4 columnas)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_IND = Math.floor(TW * 0.4);
  const COL_DEC = Math.floor(TW * 0.22);
  const COL_PRO = Math.floor(TW * 0.2);
  const COL_ACT = TW - COL_IND - COL_DEC - COL_PRO;

  const filasIndicadores: TableRow[] = [];

  for (const ambito of ambitos) {
    const ce = buscarCompetenciaEspecificaEGBBGU(ambito.competenciaCodigo || "");
    const gradoData = ce?.porGrado.find((g) => g.grado === plan.grado);

    let indicadorTexts: string[] = [];
    let saberesDeclarativos: string[] = [];
    let saberesProcedimentales: string[] = [];
    let saberesActitudinales: string[] = [];

    if (gradoData) {
      indicadorTexts = gradoData.indicadores.map((ind) => ind.texto);
      saberesDeclarativos = gradoData.saberes.declarativos;
      saberesProcedimentales = gradoData.saberes.procedimentales;
      saberesActitudinales = gradoData.saberes.actitudinales;
    } else {
      const destrezas = ambito.destrezas || [];
      const clases = ambito.clases || [];
      indicadorTexts = destrezas.length > 0 ? destrezas : clases.map((c) => c.objetivoEspecifico || c.tema);
    }

    if (indicadorTexts.length === 0) {
      indicadorTexts = [ambito.competenciaDescripcion || "—"];
    }

    for (let j = 0; j < indicadorTexts.length; j++) {
      const indicador = indicadorTexts[j] || "—";
      const idx = j + 1;
      // Los saberes oficiales usan el prefijo "<ÁREA>.<subnivel>" (sin "CE.");
      // se deriva del código de competencia solo como respaldo cuando el
      // catálogo no trae saberes para este índice.
      const ceCode = (ambito.competenciaCodigo || "CE").replace(/^CE\./, "");

      const declarativos = saberesDeclarativos[j] || `${ceCode}.d.${idx}. Conocer y comprender ${truncateWords(indicador, 120).toLowerCase()}`;
      const procedimentales = saberesProcedimentales[j] || `${ceCode}.p.${idx}. Aplicar estrategias para ${truncateWords(indicador, 120).toLowerCase()}`;
      const actitudinales = saberesActitudinales[j] || `${ceCode}.a.${idx}. Valorar la importancia de ${truncateWords(indicador, 120).toLowerCase()}`;

      filasIndicadores.push(
        new TableRow({
          children: [
            tc([p(indicador, { size: 7 })], COL_IND),
            tc([p(declarativos, { size: 7 })], COL_DEC),
            tc([p(procedimentales, { size: 7 })], COL_PRO),
            tc([p(actitudinales, { size: 7 })], COL_ACT),
          ],
        })
      );
    }
  }

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
            tc([p("Indicadores de evaluación", { bold: true, size: 8, color: WHITE })], COL_IND, { bg: COLOR_PRIMARY, rs: 2 }),
            tc([p("Saberes", { bold: true, size: 8, color: WHITE, align: "center" })], COL_DEC + COL_PRO + COL_ACT, { bg: COLOR_PRIMARY, cs: 3 }),
          ],
        }),
        new TableRow({
          tableHeader: true,
          children: [
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
  // 8. TABLA DUA SEMANAL
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_DUA = Math.floor(TW * 0.55);
  const COL_REC = Math.floor(TW * 0.22);
  const COL_TECH = TW - COL_DUA - COL_REC;

  children.push(
    makeTable(
      [
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Estrategias metodológicas desde el DUA", { bold: true, size: 8, color: WHITE })], COL_DUA, { bg: COLOR_PRIMARY }),
            tc([p("Recursos (según disponibilidad institucional)", { bold: true, size: 7, color: WHITE })], COL_REC, { bg: COLOR_PRIMARY }),
            tc([p("Técnicas e instrumentos de evaluación", { bold: true, size: 8, color: WHITE })], COL_TECH, { bg: COLOR_PRIMARY }),
          ],
        }),
      ],
      TW,
      [COL_DUA, COL_REC, COL_TECH]
    )
  );

  const numSemanasCalc = plan.noSemanasClase || 8;

  for (let semana = 1; semana <= numSemanasCalc; semana++) {
    for (const ambito of ambitos) {
      const clase = ambito.clases?.find((c) => c.numero === semana) || ambito.clases?.[semana - 1];
      const ce = buscarCompetenciaEspecificaEGBBGU(ambito.competenciaCodigo || "");
      const gradoData = ce?.porGrado.find((g) => g.grado === plan.grado);

      const duaContent: Paragraph[] = [p(`Semana ${semana}`, { bold: true, size: 8 })];
      if (clase && (clase.inicio?.length || clase.desarrollo?.length || clase.cierre?.length)) {
        duaContent.push(p(`Clase ${clase.numero}: ${clase.tema}`, { bold: true, size: 8 }));
        duaContent.push(p(`Sugerencias para el inicio:`, { bold: true, size: 7 }));
        duaContent.push(p(clase.inicio?.map((a) => `• ${a.texto}`).join("\n") || "• Inicio de la actividad", { size: 7 }));
        duaContent.push(p(`Sugerencias para el desarrollo:`, { bold: true, size: 7 }));
        duaContent.push(p(clase.desarrollo?.map((a) => `• ${a.texto}`).join("\n") || "• Desarrollo de la actividad", { size: 7 }));
        duaContent.push(p(`Sugerencias para el cierre:`, { bold: true, size: 7 }));
        duaContent.push(p(clase.cierre?.map((a) => `• ${a.texto}`).join("\n") || "• Cierre de la actividad", { size: 7 }));
      } else if (gradoData || ce) {
        const descCorta = truncateWords(ce!.descripcion, 100);
        // Se rota entre los indicadores disponibles (en vez de repetir el
        // último) para que semanas sucesivas no queden idénticas cuando hay
        // más semanas que indicadores.
        const inds = gradoData?.indicadores || [];
        const indSample = inds.length > 0 ? inds[(semana - 1) % inds.length].texto : descCorta;
        const indCorta = truncateWords(indSample, 90);

        duaContent.push(p(`Actividad: ${descCorta}`, { bold: true, size: 8 }));
        duaContent.push(p(`Sugerencias para el inicio:`, { bold: true, size: 7 }));
        duaContent.push(p(`• Presentar la actividad mediante una dinámica relacionada con: ${indCorta}`, { size: 7 }));
        duaContent.push(p(`• Activar conocimientos previos con una pregunta o situación cotidiana`, { size: 7 }));
        duaContent.push(p(`Sugerencias para el desarrollo:`, { bold: true, size: 7 }));
        duaContent.push(p(`• Desarrollar la actividad principal mediante trabajo guiado e independiente`, { size: 7 }));
        duaContent.push(p(`• Aplicar una actividad práctica orientada a: ${indCorta}`, { size: 7 }));
        duaContent.push(p(`Sugerencias para el cierre:`, { bold: true, size: 7 }));
        duaContent.push(p(`• Reflexionar sobre lo aprendido mediante una puesta en común`, { size: 7 }));
        duaContent.push(p(`• Realizar una actividad de cierre que refuerce el aprendizaje`, { size: 7 }));
      } else {
        duaContent.push(p("• Inicio: Presentar la actividad y activar conocimientos previos", { size: 7 }));
        duaContent.push(p("• Desarrollo: Trabajo guiado e independiente", { size: 7 }));
        duaContent.push(p("• Cierre: Reflexión grupal y cierre de la actividad", { size: 7 }));
      }

      const recContent: Paragraph[] = [];
      if (clase?.metodologia) {
        recContent.push(p(`• ${clase.metodologia}`, { size: 7 }));
      } else {
        recContent.push(p("• Material didáctico impreso o digital", { size: 7 }));
        recContent.push(p("• Recursos del aula", { size: 7 }));
      }

      const techContent: Paragraph[] = [];
      if (clase?.metodoEvaluacion?.length) {
        techContent.push(p(`Técnica: ${clase.metodoEvaluacion[0] || "Observación"}`, { size: 7 }));
        techContent.push(p(`Instrumento: ${clase.metodoEvaluacion[1] || "Lista de cotejo"}`, { size: 7 }));
      } else {
        techContent.push(p("Técnica: Observación directa", { size: 7 }));
        techContent.push(p("Instrumento: Lista de cotejo", { size: 7 }));
      }

      // Separador para que Word no fusione tablas semanales consecutivas en
      // una sola tabla continua (rompería el repeat de tableHeader si en el
      // futuro se agrega una fila de encabezado propia por semana).
      children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
      children.push(
        makeTable(
          [
            new TableRow({
              children: [
                tc(duaContent, COL_DUA),
                tc(recContent, COL_REC),
                tc(techContent, COL_TECH),
              ],
            }),
          ],
          TW,
          [COL_DUA, COL_REC, COL_TECH]
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

// ═══════════════════════════════════════════════════════════════
// GENERADOR MULTIGRADO (2..N grados del mismo subnivel, una sola CE)
// ═══════════════════════════════════════════════════════════════
//
// Sigue el mismo formato oficial que generarCurriculoCompetenciasWordEGBBGUIntegrado
// pero cruzado por grado: la tabla de indicadores/saberes tiene una fila por
// grado (en vez de una fila por ámbito de un único grado), y cada semana es
// su propia tabla con una fila por grado. Patrón validado contra los
// ejemplos reales "CNC-MG-Ecuaciones-matemáticas.docx" y
// "CNC-MG-Mis-nuevos-amigos.docx" del pilotaje (ver design.md del change
// curriculo-integrado-egb-bgu-multigrado).

/** Área y subnivel (catálogo 2016) de la CE de una planificación multigrado, para buscar conexiones interdisciplinarias reales. */
function areaYSubnivelMultigrado(
  plan: PlanificacionCurriculoIntegradoMultigrado
): { area: Area; subnivel: Subnivel } | undefined {
  const materia = MATERIAS_EGB_BGU.find((m) => m.id === plan.asignatura);
  const area = materia ? AREA_POR_MATERIA[materia.id] : undefined;
  // Use first CE to determine area/subnivel
  const firstCe = Array.isArray(plan.competenciasEspecifica)
    ? plan.competenciasEspecifica[0]
    : undefined;
  const m = (firstCe?.codigo || "").match(/^CE\.[A-Z]+(?:\.[A-Z]+)?\.(\d+)\.\d+/);
  const subnivel = m ? (Number(m[1]) as Subnivel) : undefined;
  if (!area || !subnivel) return undefined;
  return { area, subnivel };
}

export async function generarDocxMultigrado(
  plan: PlanificacionCurriculoIntegradoMultigrado
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const grados: GrupoGrado[] = plan.grados || [];
  const materia = MATERIAS_EGB_BGU.find((m) => m.id === plan.asignatura);
  const asignatura = materia?.nombre || "Currículo integrado";
  const gradosTexto = grados.map((g) => formatGradoCurso(g.grado)).join(", ") || "—";
  const numSemanas = plan.semanas?.length || plan.noSemanasClase || 8;

  // ═══════════════════════════════════════════════════════════════
  // 1. ENCABEZADO
  // ═══════════════════════════════════════════════════════════════
  const COL_INST = Math.floor(TW * 0.6);
  const COL_ANIO = TW - COL_INST;
  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(plan.institucion || "Unidad Educativa", { bold: true, size: 9 })], COL_INST, { bg: COLOR_HEADER }),
            tc([p("Año lectivo: 2026-2027", { size: 9 })], COL_ANIO, { bg: COLOR_HEADER }),
          ],
        }),
      ],
      TW,
      [COL_INST, COL_ANIO]
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
              [p("Planificación microcurricular por competencias · multigrado", { bold: true, size: 12, align: "center" })],
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
  const COL_ASIG = Math.floor(TW * 0.34);
  const COL_GRADOS = Math.floor(TW * 0.4);
  const COL_PARALELO = TW - COL_ASIG - COL_GRADOS;
  const COL_TRIM = Math.floor(TW * 0.5);
  const COL_SEM = TW - COL_TRIM;

  children.push(
    makeTable(
      [new TableRow({ children: [tc([p("Datos informativos:", { bold: true, size: 8 })], TW)] })],
      TW,
      [TW]
    ),
    makeTable(
      [new TableRow({ children: [tc([p(`Docente: ${plan.docente || "—"}`, { size: 8 })], TW)] })],
      TW,
      [TW]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Asignatura: ${asignatura}`, { size: 8 })], COL_ASIG),
            tc([p(`Grados: ${gradosTexto}`, { size: 8 })], COL_GRADOS),
            tc([p(`Paralelo: ${plan.paralelo || "—"}`, { size: 8 })], COL_PARALELO),
          ],
        }),
      ],
      TW,
      [COL_ASIG, COL_GRADOS, COL_PARALELO]
    ),
    makeTable(
      [
        new TableRow({
          children: [
            tc([p(`Trimestre: ${plan.trimestre || "—"}`, { size: 8 })], COL_TRIM),
            tc([p(`No. de semanas: ${numSemanas}`, { size: 8 })], COL_SEM),
          ],
        }),
      ],
      TW,
      [COL_TRIM, COL_SEM]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 4. SITUACIÓN DE APRENDIZAJE
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Situación de aprendizaje")], TW, [TW]));

  children.push(
    makeTable(
      [
        new TableRow({
          children: [
            tc(
              [
                p("Título:", { bold: true, size: 8 }),
                p(plan.situacionAprendizaje?.titulo || "—", { size: 8 }),
                p("Descripción:", { bold: true, size: 8 }),
                p(plan.situacionAprendizaje?.descripcion || "—", { size: 8 }),
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
  // 5. CONEXIÓN INTERDISCIPLINAR
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Conexión interdisciplinar")], TW, [TW]));

  const filasConexionInterdisciplinar: TableRow[] = [];
  const ctx = areaYSubnivelMultigrado(plan);
  const cesArray = plan.competenciasEspecifica || [];
  const primeraCeDesc = cesArray[0]?.descripcion || "";
  if (ctx) {
    const conexiones = buscarConexionesInterdisciplinarias(
      ctx.area,
      ctx.subnivel,
      primeraCeDesc,
      []
    );
    for (const conn of conexiones) {
      filasConexionInterdisciplinar.push(
        new TableRow({
          children: [tc([p(`• ${conn.area}: ${conn.descripcion} (${conn.ceCode})`, { size: 8 })], TW)],
        })
      );
    }
  }
  if (filasConexionInterdisciplinar.length === 0) {
    filasConexionInterdisciplinar.push(new TableRow({ children: [tc([p("—", { size: 8 })], TW)] }));
  }

  children.push(
    makeTable(
      [
        new TableRow({ children: [tc([p("Asignaturas:", { bold: true, size: 8 })], TW)] }),
        ...filasConexionInterdisciplinar,
      ],
      TW,
      [TW]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 6. COMPETENCIAS ESPECÍFICAS (una o más, compartidas por todos los grados)
  // ═══════════════════════════════════════════════════════════════
  children.push(makeTable([sectionRow("Competencias específicas")], TW, [TW]));

  const filasCE: TableRow[] = cesArray.map((ce) =>
    new TableRow({
      children: [
        tc(
          [
            p(
              `${ce.codigo || "—"}${ce.descripcion ? ". " + ce.descripcion : ""}`,
              { size: 8 }
            ),
          ],
          TW
        ),
      ],
    })
  );

  if (filasCE.length === 0) {
    filasCE.push(new TableRow({ children: [tc([p("—", { size: 8 })], TW)] }));
  }

  children.push(makeTable(filasCE, TW, [TW]));

  // ═══════════════════════════════════════════════════════════════
  // 7. INDICADORES DE EVALUACIÓN, UNA FILA POR GRADO (5 columnas)
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_GRADO_IND = Math.floor(TW * 0.14);
  const COL_IND = Math.floor(TW * 0.32);
  const COL_DEC = Math.floor(TW * 0.2);
  const COL_PRO = Math.floor(TW * 0.18);
  const COL_ACT = TW - COL_GRADO_IND - COL_IND - COL_DEC - COL_PRO;

  const filasIndicadores: TableRow[] = grados.map(
    (g) =>
      new TableRow({
        children: [
          tc([p(formatGradoCurso(g.grado), { size: 7, bold: true })], COL_GRADO_IND),
          tc([p(g.bloqueCurricular.indicadores.join("\n") || "—", { size: 7 })], COL_IND),
          tc([p(g.bloqueCurricular.declarativos.join("\n") || "—", { size: 7 })], COL_DEC),
          tc([p(g.bloqueCurricular.procedimentales.join("\n") || "—", { size: 7 })], COL_PRO),
          tc([p(g.bloqueCurricular.actitudinales.join("\n") || "—", { size: 7 })], COL_ACT),
        ],
      })
  );

  if (filasIndicadores.length === 0) {
    filasIndicadores.push(
      new TableRow({
        children: [
          tc([p("—", { size: 7 })], COL_GRADO_IND),
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
            tc([p("Grado", { bold: true, size: 8, color: WHITE })], COL_GRADO_IND, { bg: COLOR_PRIMARY, rs: 2 }),
            tc([p("Indicadores de evaluación", { bold: true, size: 8, color: WHITE })], COL_IND, { bg: COLOR_PRIMARY, rs: 2 }),
            tc([p("Saberes", { bold: true, size: 8, color: WHITE, align: "center" })], COL_DEC + COL_PRO + COL_ACT, { bg: COLOR_PRIMARY, cs: 3 }),
          ],
        }),
        new TableRow({
          tableHeader: true,
          children: [
            tc([p("Declarativos", { bold: true, size: 8, color: WHITE })], COL_DEC, { bg: COLOR_PRIMARY }),
            tc([p("Procedimentales", { bold: true, size: 8, color: WHITE })], COL_PRO, { bg: COLOR_PRIMARY }),
            tc([p("Actitudinales", { bold: true, size: 8, color: WHITE })], COL_ACT, { bg: COLOR_PRIMARY }),
          ],
        }),
        ...filasIndicadores,
      ],
      TW,
      [COL_GRADO_IND, COL_IND, COL_DEC, COL_PRO, COL_ACT]
    )
  );

  // ═══════════════════════════════════════════════════════════════
  // 8. TABLA DUA SEMANAL, UNA TABLA POR SEMANA CON UNA FILA POR GRADO
  // ═══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  const COL_GRADO_SEM = Math.floor(TW * 0.14);
  const COL_DUA = Math.floor(TW * 0.46);
  const COL_REC = Math.floor(TW * 0.2);
  const COL_TECH = TW - COL_GRADO_SEM - COL_DUA - COL_REC;

  const semanas = plan.semanas?.length
    ? plan.semanas
    : Array.from({ length: numSemanas }, (_, i) => ({ numero: i + 1, tema: "", actividades: [] }));

  for (const semana of semanas) {
    const encabezado = `Semana ${semana.numero}${semana.tema ? ` · ${semana.tema}` : ""} · Grado`;

    const filasSemana: TableRow[] = grados.map((g) => {
      const actividad = semana.actividades?.find((a) => a.gradoId === g.id);

      const duaContent: Paragraph[] = [
        p("Sugerencias para el inicio:", { bold: true, size: 7 }),
        p(actividad?.estrategiasDUA.inicio || "—", { size: 7 }),
        p("Sugerencias para el desarrollo:", { bold: true, size: 7 }),
        p(actividad?.estrategiasDUA.desarrollo || "—", { size: 7 }),
        p("Sugerencias para el cierre:", { bold: true, size: 7 }),
        p(actividad?.estrategiasDUA.cierre || "—", { size: 7 }),
      ];
      const recContent: Paragraph[] = [p(actividad?.recursos || "—", { size: 7 })];
      const techContent: Paragraph[] = [
        p(`Técnica: ${actividad?.tecnica || "—"}`, { size: 7 }),
        p(`Instrumento: ${actividad?.instrumento || "—"}`, { size: 7 }),
      ];

      return new TableRow({
        children: [
          tc([p(formatGradoCurso(g.grado), { size: 7, bold: true })], COL_GRADO_SEM),
          tc(duaContent, COL_DUA),
          tc(recContent, COL_REC),
          tc(techContent, COL_TECH),
        ],
      });
    });

    // Un párrafo (aunque vacío) entre tablas consecutivas es obligatorio:
    // sin él, Word fusiona las tablas de "w:tbl" adyacentes en una sola al
    // renderizar, y repite el primer encabezado de fila (tableHeader) en
    // cada salto de página dentro de esa tabla fusionada — así, la semana 2
    // en adelante mostraría el encabezado de la Semana 1 tras un corte de
    // página, aunque el contenido de las filas ya sea el correcto.
    children.push(new Paragraph({ spacing: { after: 40 }, children: [] }));
    children.push(
      makeTable(
        [
          new TableRow({
            tableHeader: true,
            children: [
              tc([p(encabezado, { bold: true, size: 8, color: WHITE })], COL_GRADO_SEM, { bg: COLOR_PRIMARY }),
              tc([p("Estrategias metodológicas desde el DUA", { bold: true, size: 8, color: WHITE })], COL_DUA, { bg: COLOR_PRIMARY }),
              tc([p("Recursos (según disponibilidad institucional)", { bold: true, size: 7, color: WHITE })], COL_REC, { bg: COLOR_PRIMARY }),
              tc([p("Técnicas e instrumentos de evaluación", { bold: true, size: 8, color: WHITE })], COL_TECH, { bg: COLOR_PRIMARY }),
            ],
          }),
          ...filasSemana,
        ],
        TW,
        [COL_GRADO_SEM, COL_DUA, COL_REC, COL_TECH]
      )
    );
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
            tc(
              [
                p(
                  "Esta herramienta pedagógica genera propuestas de planificación basadas en los instrumentos técnicos y formatos socializados en la fase de pilotaje. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito.",
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
