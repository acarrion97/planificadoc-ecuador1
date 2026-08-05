/**
 * Genera el documento Word (.docx) para Adaptaciones Curriculares.
 * Formato oficial MinEduc Ecuador — A4 portrait.
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, HeadingLevel, PageOrientation,
} from "docx";
import type { CurricularAdaptation, AdaptacionAiResult, AdaptacionPedagogicaSugerida, AdaptacionDiaPlan } from "../data/types";
import { TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO } from "../data/types";

// ─── Paleta ──────────────────────────────────────────────────────────────────
const BG_TITLE   = "003366";
const BG_HEAD    = "1A3A5C";
const BG_SEC     = "DDEFF1";
const BG_WARN    = "FEF3C7";
const BG_GREEN   = "DCFCE7";
const BG_ORANGE  = "FED7AA";
const BG_RED     = "FEE2E2";
const WHITE      = "FFFFFF";
const DARK       = "1E293B";

const BORDER_DEF = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

const BORDER_NONE = {
  top:    { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shade(color: string) {
  return { fill: color, color, type: ShadingType.CLEAR };
}

function cell(
  children: Paragraph[],
  opts: { bg?: string; colspan?: number; vAlign?: typeof VerticalAlign[keyof typeof VerticalAlign] } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    verticalAlign: opts.vAlign ?? VerticalAlign.TOP,
    shading: opts.bg ? shade(opts.bg) : undefined,
    borders: BORDER_DEF,
    children,
  });
}

function simpleCell(
  text: string,
  opts: {
    bold?: boolean; size?: number; color?: string; bg?: string;
    align?: typeof AlignmentType[keyof typeof AlignmentType];
    colspan?: number; italic?: boolean;
    spacing?: { before?: number; after?: number };
  } = {}
): TableCell {
  return cell(
    [new Paragraph({
      alignment: opts.align ?? AlignmentType.LEFT,
      spacing: opts.spacing,
      children: [new TextRun({
        text,
        bold: opts.bold ?? false,
        italics: opts.italic ?? false,
        size: (opts.size ?? 11) * 2,
        color: opts.color ?? DARK,
      })],
    })],
    { bg: opts.bg, colspan: opts.colspan }
  );
}

function heading(text: string, bg: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          simpleCell(text, {
            bold: true,
            size: 12,
            color: WHITE,
            bg,
            align: AlignmentType.CENTER,
            spacing: { before: 80, after: 160 },
          }),
        ],
      }),
    ],
  });
}

function spacer(): Paragraph {
  return new Paragraph({ text: "", spacing: { after: 160 } });
}

function labelValueRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      simpleCell(label, { bold: true, size: 11, bg: "F1F5F9" }),
      simpleCell(value || "—", { size: 11 }),
    ],
  });
}

/** Tabla de adaptaciones con 3 columnas: Categoría | Descripción | Estrategias */
function adaptacionTable(
  items: AdaptacionPedagogicaSugerida[],
  bgHeader: string
): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      simpleCell("CATEGORÍA", { bold: true, size: 11, color: WHITE, bg: bgHeader }),
      simpleCell("DESCRIPCIÓN", { bold: true, size: 11, color: WHITE, bg: bgHeader }),
      simpleCell("ESTRATEGIAS", { bold: true, size: 11, color: WHITE, bg: bgHeader }),
    ],
  });

  const dataRows = items.map(
    (item) =>
      new TableRow({
        children: [
          simpleCell(item.categoria, { bold: true, size: 11, bg: "F8FAFC" }),
          simpleCell(item.descripcion, { size: 11 }),
          cell(
            item.estrategias.map(
              (e) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", size: 22, color: DARK }),
                    new TextRun({ text: e, size: 22, color: DARK }),
                  ],
                  spacing: { after: 40 },
                })
            ),
            {}
          ),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2500, 4000, 4500],
    rows: [headerRow, ...dataRows],
  });
}

/** Lista de bullets en una tabla de 1 columna */
function bulletList(items: string[], bg?: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell(
            items.map(
              (item) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", size: 22, color: DARK }),
                    new TextRun({ text: item, size: 22, color: DARK }),
                  ],
                  spacing: { after: 40 },
                })
            ),
            { bg }
          ),
        ],
      }),
    ],
  });
}

function textBlock(text: string, bg?: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell(
            [new Paragraph({
              children: [new TextRun({ text, size: 22, color: DARK })],
            })],
            { bg }
          ),
        ],
      }),
    ],
  });
}

/** Celda con lista de bullets para tablas de 2 columnas */
function bulletCell(items: string[], bg?: string): TableCell {
  return cell(
    items.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({ text: "• ", size: 22, color: DARK }),
            new TextRun({ text: item, size: 22, color: DARK }),
          ],
          spacing: { after: 40 },
        })
    ),
    { bg }
  );
}

// Numeración romana para headings dinámicos
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII"];

const DIA_BG_COLORS = ["1A3A5C", "0F766E", "7C3AED", "B45309", "0369A1"];

/** Genera la tabla de adaptaciones para un día concreto */
function perDiaTable(dia: AdaptacionDiaPlan, index: number): (Table | Paragraph)[] {
  const bgColor = DIA_BG_COLORS[index % DIA_BG_COLORS.length];
  const result: (Table | Paragraph)[] = [];

  result.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            simpleCell(dia.dia.toUpperCase(), {
              bold: true, size: 12, color: WHITE, bg: bgColor,
              align: AlignmentType.LEFT,
              spacing: { before: 60, after: 120 },
            }),
          ],
        }),
      ],
    })
  );

  const rows: TableRow[] = [
    new TableRow({ children: [
      simpleCell("Adaptación de acceso:", { bold: true, size: 11, bg: "EDE9FE", color: "4A1942" }),
      simpleCell(dia.adaptacionAcceso || "—", { size: 11 }),
    ]}),
    new TableRow({ children: [
      simpleCell("Estrategia metodológica:", { bold: true, size: 11, bg: "F5F3FF", color: "4A1942" }),
      simpleCell(dia.adaptacionMetodologica || "—", { size: 11 }),
    ]}),
    new TableRow({ children: [
      simpleCell("Recursos adaptados:", { bold: true, size: 11, bg: "F5F3FF", color: "4A1942" }),
      dia.recursosAdaptados?.length
        ? bulletCell(dia.recursosAdaptados)
        : simpleCell("—", { size: 11 }),
    ]}),
    new TableRow({ children: [
      simpleCell("Evaluación del día:", { bold: true, size: 11, bg: "F5F3FF", color: "4A1942" }),
      simpleCell(dia.evaluacionAdaptada || "—", { size: 11 }),
    ]}),
  ];

  result.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3000, 8000],
    rows,
  }));

  result.push(new Paragraph({ text: "", spacing: { after: 80 } }));
  return result;
}

// ─── Exportación principal ────────────────────────────────────────────────────

export async function generarWordAdaptacion(
  adaptacion: CurricularAdaptation
): Promise<Blob> {
  const { form } = adaptacion;
  const ai = adaptacion.aiResult as AdaptacionAiResult;
  const neeInfo = TIPOS_NEE_INFO[form.tipoNEE as keyof typeof TIPOS_NEE_INFO];
  const gradoInfo = GRADO_ADAPTACION_INFO[form.gradoAdaptacion];
  const gradoBg = form.gradoAdaptacion === 1 ? BG_GREEN : form.gradoAdaptacion === 2 ? BG_ORANGE : BG_RED;

  const sections: (Table | Paragraph)[] = [];
  const hasPorDia = Array.isArray(ai?.adaptacionesPorDia) && ai.adaptacionesPorDia.length > 0;
  let sn = 4; // cuatro secciones fijas (I–IV) ya añadidas al documento

  // ── Título principal ──────────────────────────────────────────────────────
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            simpleCell(
              "ADAPTACIÓN CURRICULAR",
              { bold: true, size: 14, color: WHITE, bg: BG_TITLE, align: AlignmentType.CENTER }
            ),
          ],
        }),
        new TableRow({
          children: [
            simpleCell(
              "Ministerio de Educación del Ecuador — Modelo de Educación Inclusiva",
              { size: 11, color: WHITE, bg: BG_HEAD, align: AlignmentType.CENTER, italic: true }
            ),
          ],
        }),
      ],
    })
  );
  sections.push(spacer());

  // ── Datos generales ───────────────────────────────────────────────────────
  sections.push(heading("I. DATOS GENERALES DEL CONTEXTO PEDAGÓGICO", BG_HEAD));
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [3500, 4000, 3500, 4000],
      rows: [
        new TableRow({ children: [
          simpleCell("Institución educativa:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.institucion || "—", { size: 11, colspan: 3 }),
        ]}),
        new TableRow({ children: [
          simpleCell("Docente:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.docente || "—", { size: 11 }),
          simpleCell("Año lectivo:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.anioLectivo || "—", { size: 11 }),
        ]}),
        new TableRow({ children: [
          simpleCell("Área / Asignatura:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.area || "—", { size: 11 }),
          simpleCell("Grado / Curso:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.grado || "—", { size: 11 }),
        ]}),
        new TableRow({ children: [
          simpleCell("Paralelo:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.paralelo || "—", { size: 11 }),
          simpleCell("Período pedagógico:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.periodoPedagogico || "—", { size: 11 }),
        ]}),
        new TableRow({ children: [
          simpleCell("Trimestre:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.trimestre || "—", { size: 11 }),
          simpleCell("Código estudiante:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.codigoEstudiante || "E-001", { size: 11 }),
        ]}),
      ],
    })
  );
  sections.push(spacer());

  // ── Tipo de NEE y grado ───────────────────────────────────────────────────
  sections.push(heading("II. TIPO DE NEE Y GRADO DE ADAPTACIÓN", BG_HEAD));
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          simpleCell("Tipo de NEE:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(`${neeInfo?.emoji ?? ""} ${neeInfo?.nombre ?? form.tipoNEE}`, { size: 11 }),
        ]}),
        new TableRow({ children: [
          simpleCell("Grado de adaptación:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(gradoInfo.nombre, { bold: true, size: 11, bg: gradoBg }),
        ]}),
        new TableRow({ children: [
          simpleCell("Alcance:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(gradoInfo.descripcion, { size: 11, italic: true }),
        ]}),
        new TableRow({ children: [
          simpleCell("Estilo de aprendizaje:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(form.estiloAprendizaje || "—", { size: 11 }),
        ]}),
      ],
    })
  );
  sections.push(spacer());

  // ── Perfil pedagógico ─────────────────────────────────────────────────────
  if (ai?.perfilNEE) {
    sections.push(heading("III. PERFIL PEDAGÓGICO DEL ESTUDIANTE", BG_HEAD));
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            simpleCell("Descripción:", { bold: true, size: 11, bg: "F1F5F9" }),
            simpleCell(ai.perfilNEE.descripcion, { size: 11 }),
          ]}),
          new TableRow({ children: [
            simpleCell("Fortalezas pedagógicas:", { bold: true, size: 11, bg: "F1F5F9" }),
            cell([
              ...ai.perfilNEE.fortalezas.map(f =>
                new Paragraph({ children: [new TextRun({ text: `• ${f}`, size: 22, color: DARK })], spacing: { after: 40 } })
              ),
            ], { bg: BG_GREEN }),
          ]}),
          new TableRow({ children: [
            simpleCell("Desafíos pedagógicos:", { bold: true, size: 11, bg: "F1F5F9" }),
            cell([
              ...ai.perfilNEE.desafios.map(d =>
                new Paragraph({ children: [new TextRun({ text: `• ${d}`, size: 22, color: DARK })], spacing: { after: 40 } })
              ),
            ], { bg: BG_WARN }),
          ]}),
          new TableRow({ children: [
            simpleCell("Apoyos disponibles:", { bold: true, size: 11, bg: "F1F5F9" }),
            cell([
              ...ai.perfilNEE.apoyos.map(a =>
                new Paragraph({ children: [new TextRun({ text: `• ${a}`, size: 22, color: DARK })], spacing: { after: 40 } })
              ),
            ], {}),
          ]}),
        ],
      })
    );
    sections.push(spacer());
  }

  // ── Destreza original ─────────────────────────────────────────────────────
  sections.push(heading("IV. DESTREZA CON CRITERIO DE DESEMPEÑO (DCD)", BG_HEAD));
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          simpleCell("Destreza ORIGINAL:", { bold: true, size: 11, bg: "F1F5F9" }),
          simpleCell(`[${form.codigoDestreza}] ${form.descripcionDestreza}`, { size: 11, italic: true }),
        ]}),
        ...(ai?.destrezaAdaptada ? [
          new TableRow({ children: [
            simpleCell("Destreza ADAPTADA:", { bold: true, size: 11, bg: form.gradoAdaptacion === 3 ? BG_RED : BG_ORANGE }),
            simpleCell(ai.destrezaAdaptada, { bold: true, size: 11 }),
          ]}),
        ] : []),
        ...(ai?.criterioAdaptado ? [
          new TableRow({ children: [
            simpleCell("Criterio de evaluación adaptado:", { bold: true, size: 11, bg: "F1F5F9" }),
            simpleCell(ai.criterioAdaptado, { size: 11 }),
          ]}),
        ] : []),
      ],
    })
  );

  if (ai?.indicadoresAdaptados?.length) {
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            simpleCell("Indicadores de evaluación adaptados:", { bold: true, size: 11, bg: "F1F5F9" }),
            cell(
              ai.indicadoresAdaptados.map(ind =>
                new Paragraph({ children: [new TextRun({ text: `• ${ind}`, size: 22, color: DARK })], spacing: { after: 40 } })
              ),
              {}
            ),
          ]}),
        ],
      })
    );
  }
  sections.push(spacer());

  // ── V: Adaptaciones por día (solo cuando hay planificación semanal vinculada) ──
  if (hasPorDia) {
    sections.push(heading(`${ROMAN[++sn]}. ADAPTACIONES CURRICULARES POR DÍA`, "0F766E"));
    sections.push(new Paragraph({ text: "", spacing: { after: 80 } }));
    ai.adaptacionesPorDia!.forEach((dia, i) => {
      perDiaTable(dia, i).forEach((el) => sections.push(el));
    });
    sections.push(spacer());
  } else {
    // ── V–VIII: Secciones genéricas (solo cuando NO hay planificación semanal) ─
    if (ai?.adaptacionesAcceso?.length) {
      sections.push(heading(`${ROMAN[++sn]}. ADAPTACIONES DE ACCESO (Grado 1, 2 y 3)`, BG_HEAD));
      sections.push(adaptacionTable(ai.adaptacionesAcceso, "1A3A5C"));
      sections.push(spacer());
    }
    if (ai?.adaptacionesProceso?.length) {
      sections.push(heading(`${ROMAN[++sn]}. ADAPTACIONES DE PROCESO (Grado 2 y 3)`, "B45309"));
      sections.push(adaptacionTable(ai.adaptacionesProceso, "B45309"));
      sections.push(spacer());
    }
    if (ai?.adaptacionesResultado?.length) {
      sections.push(heading(`${ROMAN[++sn]}. ADAPTACIONES DE RESULTADO (Grado 3)`, "B91C1C"));
      sections.push(adaptacionTable(ai.adaptacionesResultado, "B91C1C"));
      sections.push(spacer());
    }
    if (ai?.metodologiasSugeridas?.length) {
      sections.push(heading(`${ROMAN[++sn]}. METODOLOGÍAS ACTIVAS SUGERIDAS`, BG_HEAD));
      sections.push(bulletList(ai.metodologiasSugeridas));
      sections.push(spacer());
    }
  }

  // ── ERCA ────────────────────────────────────────────────────────────────────
  if (ai?.adaptacionesERCA) {
    sections.push(heading(`${ROMAN[++sn]}. ADAPTACIONES POR FASE ERCA`, "0F766E"));
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [2800, 8200],
        rows: [
          new TableRow({
            children: [
              cell(
                [new Paragraph({
                  children: [
                    new TextRun({ text: "Experiencia", bold: true, size: 22, color: DARK }),
                    new TextRun({ text: "(Activación de saberes previos)", italics: true, size: 20, color: DARK, break: 1 }),
                  ],
                })],
                { bg: "ECFDF5" }
              ),
              bulletCell(ai.adaptacionesERCA.experiencia),
            ],
          }),
          new TableRow({
            children: [
              cell(
                [new Paragraph({
                  children: [
                    new TextRun({ text: "Reflexión", bold: true, size: 22, color: DARK }),
                    new TextRun({ text: "(Análisis crítico)", italics: true, size: 20, color: DARK, break: 1 }),
                  ],
                })],
                { bg: "EFF6FF" }
              ),
              bulletCell(ai.adaptacionesERCA.reflexion),
            ],
          }),
          new TableRow({
            children: [
              cell(
                [new Paragraph({
                  children: [
                    new TextRun({ text: "Conceptualización", bold: true, size: 22, color: DARK }),
                    new TextRun({ text: "(Construcción del concepto)", italics: true, size: 20, color: DARK, break: 1 }),
                  ],
                })],
                { bg: "FEF9C3" }
              ),
              bulletCell(ai.adaptacionesERCA.conceptualizacion),
            ],
          }),
          new TableRow({
            children: [
              cell(
                [new Paragraph({
                  children: [
                    new TextRun({ text: "Aplicación", bold: true, size: 22, color: DARK }),
                    new TextRun({ text: "(Transferencia y práctica)", italics: true, size: 20, color: DARK, break: 1 }),
                  ],
                })],
                { bg: "FFF1F2" }
              ),
              bulletCell(ai.adaptacionesERCA.aplicacion),
            ],
          }),
        ],
      })
    );
    sections.push(spacer());
  }

  // ── Evaluación adaptada ───────────────────────────────────────────────────
  if (ai?.evaluacionAdaptada) {
    sections.push(heading(`${ROMAN[++sn]}. EVALUACIÓN ADAPTADA`, "0F766E"));
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [3000, 8000],
        rows: [
          new TableRow({
            children: [
              simpleCell("Criterios de evaluación:", { bold: true, size: 11, bg: "F1F5F9" }),
              bulletCell(ai.evaluacionAdaptada.criterios),
            ],
          }),
          new TableRow({
            children: [
              simpleCell("Instrumentos:", { bold: true, size: 11, bg: "F1F5F9" }),
              bulletCell(ai.evaluacionAdaptada.instrumentos),
            ],
          }),
        ],
      })
    );
    sections.push(spacer());
  }

  // ── Recursos específicos (solo cuando NO hay adaptaciones por día) ─────────
  if (ai?.recursosEspecificos?.length && !hasPorDia) {
    sections.push(heading(`${ROMAN[++sn]}. RECURSOS ESPECÍFICOS DE APOYO`, BG_HEAD));
    sections.push(bulletList(ai.recursosEspecificos));
    sections.push(spacer());
  }

  // ── Seguimiento ───────────────────────────────────────────────────────────
  if (ai?.seguimiento) {
    sections.push(heading(`${ROMAN[++sn]}. PLAN DE SEGUIMIENTO Y MONITOREO`, BG_HEAD));
    sections.push(textBlock(ai.seguimiento, "F8FAFC"));
    sections.push(spacer());
  }

  // ── Observaciones ─────────────────────────────────────────────────────────
  if (ai?.observaciones) {
    sections.push(heading(`${ROMAN[++sn]}. OBSERVACIONES`, BG_HEAD));
    sections.push(textBlock(ai.observaciones, "F8FAFC"));
    sections.push(spacer());
  }

  // ── Rúbrica de evaluación adaptada ───────────────────────────────────────
  if (ai?.rubrica?.length) {
    sections.push(heading(`${ROMAN[++sn]}. RÚBRICA DE EVALUACIÓN ADAPTADA`, "7C3AED"));
    const rubricaHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        simpleCell("CRITERIO", { bold: true, size: 11, color: WHITE, bg: "7C3AED", align: AlignmentType.CENTER }),
        simpleCell("Siempre Alcanza (4)", { bold: true, size: 11, color: WHITE, bg: "7C3AED", align: AlignmentType.CENTER }),
        simpleCell("Alcanza (3)", { bold: true, size: 11, color: WHITE, bg: "7C3AED", align: AlignmentType.CENTER }),
        simpleCell("Próximo a Alcanzar (2)", { bold: true, size: 11, color: WHITE, bg: "7C3AED", align: AlignmentType.CENTER }),
        simpleCell("No Alcanza (1)", { bold: true, size: 11, color: WHITE, bg: "7C3AED", align: AlignmentType.CENTER }),
      ],
    });
    const rubricaDataRows = ai.rubrica.map((item) =>
      new TableRow({
        children: [
          simpleCell(item.criterio, { bold: true, size: 11, bg: "F5F3FF" }),
          simpleCell(item.excelente, { size: 11 }),
          simpleCell(item.satisfactorio, { size: 11 }),
          simpleCell(item.enProceso, { size: 11 }),
          simpleCell(item.necesitaApoyo, { size: 11 }),
        ],
      })
    );
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [2500, 2300, 2300, 2300, 1600],
        rows: [rubricaHeaderRow, ...rubricaDataRows],
      })
    );
    sections.push(spacer());
  }

  // ── Firmas ────────────────────────────────────────────────────────────────
  sections.push(heading(`${ROMAN[++sn]}. FIRMAS DE RESPONSABILIDAD`, BG_HEAD));
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          simpleCell("ELABORADO POR:", { bold: true, size: 11, bg: "F1F5F9", align: AlignmentType.CENTER }),
          simpleCell("REVISADO POR:", { bold: true, size: 11, bg: "F1F5F9", align: AlignmentType.CENTER }),
          simpleCell("APROBADO POR:", { bold: true, size: 11, bg: "F1F5F9", align: AlignmentType.CENTER }),
        ]}),
        new TableRow({ children: [
          cell([
            new Paragraph({ text: "", spacing: { after: 800 } }),
            new Paragraph({ children: [new TextRun({ text: form.docente || "___________________", size: 22, color: DARK })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "Docente de aula", size: 16, color: "64748B", italics: true })], alignment: AlignmentType.CENTER }),
          ], {}),
          cell([
            new Paragraph({ text: "", spacing: { after: 800 } }),
            new Paragraph({ children: [new TextRun({ text: "___________________", size: 22, color: DARK })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "DECE / Vicerrector/a", size: 16, color: "64748B", italics: true })], alignment: AlignmentType.CENTER }),
          ], {}),
          cell([
            new Paragraph({ text: "", spacing: { after: 800 } }),
            new Paragraph({ children: [new TextRun({ text: "___________________", size: 22, color: DARK })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "Rector/a / Director/a", size: 16, color: "64748B", italics: true })], alignment: AlignmentType.CENTER }),
          ], {}),
        ]}),
      ],
    })
  );

  // ── Pie de página ─────────────────────────────────────────────────────────
  sections.push(spacer());
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Documento generado con Planificadoc • Este documento es confidencial y de uso pedagógico exclusivo",
          size: 14, color: "94A3B8", italics: true,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children: sections,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}
