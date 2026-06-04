import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  PageOrientation,
} from "docx";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "../data/pca-ejes-transversales";

// ─── Utilidad ─────────────────────────────────────────────────────────────────
function toStr(val: any): string {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.map(toStr).join("; ");
  if (typeof val === "object") return Object.values(val).map(toStr).join(" | ");
  return String(val);
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const BG_SECTION = "DDEFF1"; // celeste MinEduc
const FONT = "Arial";

const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map((m) => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map((t) => [t.id, t.nombre])
);
const EJE_LABEL: Record<string, string> = Object.fromEntries(
  EJES_TRANSVERSALES_PCA.map((e) => [e.id, e.nombre])
);

const SZ16 = 32; // 16pt
const SZ9  = 18; // 9pt
const SZ7  = 14; // 7pt
const SZ6  = 12; // 6pt

// 7 columnas en DXA (A4 landscape 16838 − 1440 márgenes = 15398 dxa usables)
// N°: angosta | Título | ObjEsp | Destrezas | Orientaciones | Indicador | Duración
const COL_W = [310, 2050, 2480, 2480, 3600, 2728, 750] as const;
const COL_TOTAL = COL_W.reduce((a, b) => a + b, 0); // 14398 dxa

// ─── Helpers ──────────────────────────────────────────────────────────────────

function run(text: string, bold = false, size = SZ7, color = "000000"): TextRun {
  return new TextRun({ text: text ?? "—", bold, size, font: FONT, color });
}

function emptyPara(): Paragraph {
  return new Paragraph({ children: [run("", false, SZ7)] });
}

function labeledPara(label: string, value: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 20, after: 0 }, children: [run(label, true, SZ7)] }),
    new Paragraph({ spacing: { before: 0, after: 20 }, children: [run(value || "—", false, SZ7)] }),
  ];
}

function inlinePara(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    children: [run(label, true, SZ7), run(" " + (value || "—"), false, SZ7)],
  });
}

function textPara(text: string, bold = false, size = SZ7, align: AlignmentType = AlignmentType.LEFT): Paragraph {
  return new Paragraph({
    alignment: align,
    spacing: { before: 30, after: 30 },
    children: [run(text || "—", bold, size)],
  });
}

const BORDER_THIN = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const stdBorders = {
  top: BORDER_THIN, bottom: BORDER_THIN, left: BORDER_THIN, right: BORDER_THIN,
};

type CellConfig = {
  paragraphs: Paragraph[];
  span?: number;
  width?: number;
  bg?: string;
  vAlign?: VerticalAlign;
  borders?: typeof stdBorders;
};

function makeCell(cfg: CellConfig): TableCell {
  return new TableCell({
    children: cfg.paragraphs,
    columnSpan: cfg.span,
    width: cfg.width !== undefined
      ? { size: cfg.width, type: WidthType.DXA }
      : undefined,
    shading: cfg.bg ? { fill: cfg.bg, color: cfg.bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: cfg.vAlign ?? VerticalAlign.TOP,
    borders: cfg.borders ?? stdBorders,
  });
}

// Colores por fase
const FASE_COLORS: Record<string, string> = {
  experiencia:      "C0504D", // rojo/salmón
  reflexion:        "4472C4", // azul
  conceptualizacion:"70AD47", // verde
  aplicacion:       "ED7D31", // naranja
  anticipacion:     "C0504D", // rojo/salmón
  construccion:     "4472C4", // azul
  consolidacion:    "70AD47", // verde
};

const FASE_LABELS: Record<string, string> = {
  experiencia:      "EXPERIENCIA",
  reflexion:        "REFLEXIÓN",
  conceptualizacion:"CONCEPTUALIZACIÓN",
  aplicacion:       "APLICACIÓN",
  anticipacion:     "ANTICIPACIÓN",
  construccion:     "CONSTRUCCIÓN DEL CONOCIMIENTO",
  consolidacion:    "CONSOLIDACIÓN",
};

/**
 * Renderiza orientacionesMetodologicas como array de DCDs con fases ERCA/ACC.
 * Cada DCD tiene cabecera gris y sus fases con cabecera de color + actividades.
 */
function orientacionesParagraphs(raw: any, modelo: "ERCA" | "ACC" = "ERCA"): Paragraph[] {
  const orden = modelo === "ACC"
    ? ["anticipacion", "construccion", "consolidacion"]
    : ["experiencia", "reflexion", "conceptualizacion", "aplicacion"];

  const paras: Paragraph[] = [];

  // Normalizar: acepta array de DCDs o fallback a objeto/string
  const items: any[] = Array.isArray(raw)
    ? raw
    : (typeof raw === "object" && raw !== null ? [{ dcd: "", fases: raw }] : [{ dcd: "", fases: { [orden[0]]: [String(raw || "")] } }]);

  for (const item of items) {
    const fases: Record<string, string[]> = item.fases || item;
    const dcdCodigo: string = item.dcd || "";

    // Cabecera de DCD
    if (dcdCodigo) {
      paras.push(new Paragraph({
        spacing: { before: 60, after: 0 },
        shading: { fill: "595959", color: "595959", type: ShadingType.CLEAR },
        children: [run(`DCD: ${dcdCodigo}`, true, SZ6, "FFFFFF")],
      }));
    }

    for (const fase of orden) {
      const actividades: string[] = Array.isArray(fases[fase]) ? fases[fase] : [];
      const color = FASE_COLORS[fase] || "003366";
      const label = FASE_LABELS[fase] || fase.toUpperCase();

      paras.push(new Paragraph({
        spacing: { before: 30, after: 0 },
        children: [run(label, true, SZ6, "000000")],
      }));

      actividades.forEach((act, i) => {
        paras.push(new Paragraph({
          spacing: { before: 0, after: 0 },
          indent: { left: 80 },
          children: [run(`${i + 1}. ${act}`, false, SZ6)],
        }));
      });
    }
  }

  return paras.length > 0 ? paras : [textPara("—", false, SZ7)];
}

function sectionHeaderRow(label: string): TableRow {
  return new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara(label, true, SZ7)],
        span: 7,
        width: COL_TOTAL,
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });
}

// ─── Función principal ────────────────────────────────────────────────────────

export async function generarWordPcaTrimestral(formData: any, aiResult: any): Promise<Blob> {
  const areaInfo      = AREAS_INFO[formData.area as keyof typeof AREAS_INFO];
  const areaName      = areaInfo?.name || formData.area;
  const subnivelName  = SUBNIVEL_NAMES[formData.subnivel as keyof typeof SUBNIVEL_NAMES] || `Subnivel ${formData.subnivel}`;
  const semanasClase  = (formData.semanasTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos = semanasClase * (formData.cargaHorariaSemanal || 0);

  const ejesTexto    = formData.usaEjesTransversales && formData.ejesTransversales?.length > 0
    ? formData.ejesTransversales.map((e: string) => EJE_LABEL[e] || e).join(", ")
    : "No aplica";
  const metodoTexto  = (formData.metodologiasActivas || []).map((m: string) => METODOLOGIA_LABEL[m] || m).join(", ") || "—";
  const tecnicaTexto = (formData.tecnicasEvaluacion  || []).map((t: string) => TECNICA_LABEL[t] || t).join(", ") || "—";
  const modeloTexto  = formData.modeloPedagogico === "ACC"
    ? "ACC (Anticipación – Construcción – Consolidación)"
    : "ERCA (Experiencia – Reflexión – Conceptualización – Aplicación)";

  const unidades: any[]   = formData.unidades  || [];
  const aiUnidades: any[] = aiResult?.unidades || [];
  const trimestre: string = formData.trimestre  || "—";

  // ══════════════════════════════════════════════════════════════════════════
  //  TABLA PRINCIPAL
  // ══════════════════════════════════════════════════════════════════════════

  // ── Fila 0: Encabezado institucional ──
  const headerRow0 = new TableRow({
    children: [
      makeCell({
        paragraphs: [
          textPara("LOGO", true, SZ7, AlignmentType.CENTER),
          textPara("INSTITUCIONAL", false, SZ6, AlignmentType.CENTER),
        ],
        span: 2,
        width: COL_W[0] + COL_W[1],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara(formData.institucion || "—", true, SZ9, AlignmentType.CENTER)],
        span: 3,
        width: COL_W[2] + COL_W[3] + COL_W[4],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [
          textPara("AÑO LECTIVO", true, SZ7, AlignmentType.CENTER),
          textPara(formData.anioLectivo || "—", true, SZ7, AlignmentType.CENTER),
        ],
        span: 2,
        width: COL_W[5] + COL_W[6],
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  // ── Fila 1: Título principal ──
  const headerRow1 = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara("PLAN CURRICULAR TRIMESTRAL", true, SZ16, AlignmentType.CENTER)],
        span: 7,
        width: COL_TOTAL,
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  // ── Sección 1: DATOS INFORMATIVOS ──
  const datosHeader = sectionHeaderRow("1. DATOS INFORMATIVOS");

  const datosArea = new TableRow({
    children: [
      makeCell({
        paragraphs: [inlinePara("Área:", areaName)],
        span: 4,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3],
      }),
      makeCell({
        paragraphs: [inlinePara("Asignatura:", areaName)],
        span: 3,
        width: COL_W[4] + COL_W[5] + COL_W[6],
      }),
    ],
  });

  const datosDocente = new TableRow({
    children: [
      makeCell({
        paragraphs: [inlinePara("Docente(s):", formData.docente || "—")],
        span: 7,
        width: COL_TOTAL,
      }),
    ],
  });

  const datosCurso = new TableRow({
    children: [
      makeCell({
        paragraphs: [inlinePara("Grado/Curso:", `${formData.grado || "—"} — Paralelo: ${formData.paralelo || "—"}`)],
        span: 4,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3],
      }),
      makeCell({
        paragraphs: [inlinePara("Nivel Educativo:", subnivelName)],
        span: 3,
        width: COL_W[4] + COL_W[5] + COL_W[6],
      }),
    ],
  });

  // ── Fila de Trimestre (exclusiva de la PCT) ──
  const datosTrimestre = new TableRow({
    children: [
      makeCell({
        paragraphs: [inlinePara("Trimestre:", trimestre)],
        span: 7,
        width: COL_TOTAL,
      }),
    ],
  });

  // ── Sección 2: TIEMPO — tabla interna con 5 columnas iguales ──
  const tiempoHeader = sectionHeaderRow("2. TIEMPO");

  // 5 columnas iguales dentro de una celda que abarca las 7 columnas
  const TIEMPO_COL = Math.round(COL_TOTAL / 5); // ~2880 dxa c/u
  const tiempoLabels_headers = ["Carga horaria semanal", "No. Semanas de trabajo", "Evaluación e imprevistos", "Total semanas de clase", "Total períodos"];
  const tiempoLabels_values  = [
    String(formData.cargaHorariaSemanal || "—"),
    String(formData.semanasTotal || "—"),
    String(formData.semanasEvaluacion || "—"),
    String(semanasClase),
    String(totalPeriodos),
  ];

  const tiempoInnerTable = new Table({
    width: { size: COL_TOTAL, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: tiempoLabels_headers.map((h) =>
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: h, bold: true, size: SZ7, font: FONT })] })],
            width: { size: TIEMPO_COL, type: WidthType.DXA },
            shading: { fill: BG_SECTION, color: BG_SECTION, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            borders: stdBorders,
          })
        ),
      }),
      new TableRow({
        children: tiempoLabels_values.map((v) =>
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: v, size: SZ7, font: FONT })] })],
            width: { size: TIEMPO_COL, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            borders: stdBorders,
          })
        ),
      }),
    ],
  });

  const tiempoRow = new TableRow({
    children: [
      new TableCell({
        children: [tiempoInnerTable],
        columnSpan: 7,
        width: { size: COL_TOTAL, type: WidthType.DXA },
        borders: stdBorders,
      }),
    ],
  });

  // ── Sección 3: OBJETIVOS DEL TRIMESTRE ──
  const objetivosHeader = sectionHeaderRow("3. OBJETIVOS DEL TRIMESTRE");

  const objetivosData = new TableRow({
    children: [
      makeCell({
        paragraphs: labeledPara(`Objetivos del ${trimestre}:`, toStr(aiResult?.objetivosTrimestre) || "—"),
        span: 7,
        width: COL_TOTAL,
      }),
    ],
  });

  // ── Sección 4: INSERCIONES CURRICULARES ──
  const insercionesHeader = sectionHeaderRow("4. INSERCIONES CURRICULARES");

  const insercionesData = new TableRow({
    children: [
      makeCell({
        paragraphs: [
          new Paragraph({
            spacing: { before: 20, after: 0 },
            children: [run("Modelo pedagógico: ", true, SZ7), run(modeloTexto, false, SZ7)],
          }),
          new Paragraph({
            spacing: { before: 20, after: 0 },
            children: [run("Ejes transversales: ", true, SZ7), run(ejesTexto, false, SZ7)],
          }),
          new Paragraph({
            spacing: { before: 20, after: 0 },
            children: [run("Metodologías activas: ", true, SZ7), run(metodoTexto, false, SZ7)],
          }),
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [run("Técnicas de evaluación: ", true, SZ7), run(tecnicaTexto, false, SZ7)],
          }),
        ],
        span: 7,
        width: COL_TOTAL,
      }),
    ],
  });

  // ── Sección 5: UNIDADES DE PLANIFICACIÓN ──
  const unidadesHeader = sectionHeaderRow("5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN");

  const unidadesColHeader = new TableRow({
    children: [
      makeCell({ paragraphs: [textPara("N.°", true, SZ7, AlignmentType.CENTER)], width: COL_W[0], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Título de la unidad", true, SZ7, AlignmentType.CENTER)], width: COL_W[1], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Objetivos específicos", true, SZ6, AlignmentType.CENTER)], width: COL_W[2], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Destrezas", true, SZ7, AlignmentType.CENTER)], width: COL_W[3], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Orientaciones metodológicas", true, SZ7, AlignmentType.CENTER)], width: COL_W[4], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Indicador de evaluación", true, SZ7, AlignmentType.CENTER)], width: COL_W[5], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Duración (semanas)", true, SZ6, AlignmentType.CENTER)], width: COL_W[6], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
    ],
  });

  const unidadesRows: TableRow[] = unidades.map((unidad: any, idx: number) => {
    const aiU = aiUnidades.find((a: any) => a.numero === unidad.numero) || aiUnidades[idx] || {};
    const dcdParrafos = (unidad.dcdsSeleccionadas || []).length > 0
      ? (unidad.dcdsSeleccionadas as any[]).map((d: any) =>
          new Paragraph({
            spacing: { before: 10, after: 10 },
            children: [run(d.codigo, true, SZ6), run(": " + d.enunciado, false, SZ6)],
          })
        )
      : [textPara("—", false, SZ7)];

    return new TableRow({
      children: [
        makeCell({ paragraphs: [textPara(String(unidad.numero), true, SZ7, AlignmentType.CENTER)], width: COL_W[0], vAlign: VerticalAlign.CENTER }),
        makeCell({ paragraphs: [textPara(toStr(aiU.titulo) || `Unidad ${unidad.numero}`, true, SZ7)], width: COL_W[1] }),
        makeCell({ paragraphs: [textPara(toStr(aiU.objetivosEspecificos) || "—", false, SZ7)], width: COL_W[2] }),
        makeCell({ paragraphs: dcdParrafos, width: COL_W[3] }),
        makeCell({ paragraphs: orientacionesParagraphs(aiU.orientacionesMetodologicas, formData.modeloPedagogico || "ERCA"), width: COL_W[4] }),
        makeCell({ paragraphs: [textPara(toStr(aiU.evaluacion) || "—", false, SZ7)], width: COL_W[5] }),
        makeCell({ paragraphs: [textPara(String(aiU.duracionSemanas || unidad.duracionSemanas || "—"), false, SZ7, AlignmentType.CENTER)], width: COL_W[6], vAlign: VerticalAlign.CENTER }),
      ],
    });
  });

  // ── Sección 6 + 7: BIBLIOGRAFÍA (en blanco) + OBSERVACIONES ──
  const biblioObsHeader = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara("6. BIBLIOGRAFÍA / WEBGRAFÍA (Utilizar normas APA)", true, SZ7)],
        span: 5,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3] + COL_W[4],
        bg: BG_SECTION,
      }),
      makeCell({
        paragraphs: [textPara("7. OBSERVACIONES", true, SZ7)],
        span: 2,
        width: COL_W[5] + COL_W[6],
        bg: BG_SECTION,
      }),
    ],
  });

  // Bibliografía: 5 líneas en blanco para que el docente complete
  const biblioObsData = new TableRow({
    children: [
      makeCell({
        paragraphs: [emptyPara(), emptyPara(), emptyPara(), emptyPara(), emptyPara()],
        span: 5,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3] + COL_W[4],
      }),
      makeCell({
        paragraphs: [emptyPara(), emptyPara(), emptyPara()],
        span: 2,
        width: COL_W[5] + COL_W[6],
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  TABLA DE FIRMAS (tabla anidada en fila de tabla principal = ancho completo)
  // ══════════════════════════════════════════════════════════════════════════
  const firmas = [
    { rol: "ELABORADO", cargo: "DOCENTE:",     nombre: formData.firmaElaboradoPor || formData.docente || "", fecha: formData.firmaElaboradoFecha || "" },
    { rol: "REVISADO",  cargo: "VICERRECTOR:", nombre: formData.firmaRevisadoPor  || "", fecha: formData.firmaRevisadoFecha  || "" },
    { rol: "APROBADO",  cargo: "DIRECTOR:",    nombre: formData.firmaAprobadoPor  || "", fecha: formData.firmaAprobadoFecha  || "" },
  ];

  function sigCell(paragraphs: Paragraph[]): TableCell {
    return new TableCell({
      children: paragraphs,
      width: { size: 5280, type: WidthType.DXA }, // 15840/3
      verticalAlign: VerticalAlign.CENTER,
      borders: stdBorders,
    });
  }

  const firmasInnerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: firmas.map((f) => sigCell([textPara(f.rol, true, SZ7, AlignmentType.CENTER)])) }),
      new TableRow({ children: firmas.map((f) => sigCell([textPara(f.cargo, true, SZ7)])) }),
      new TableRow({ children: firmas.map((f) => sigCell([textPara(f.nombre || "_________________________", false, SZ7)])) }),
      new TableRow({ children: firmas.map(() => sigCell([textPara("Firma: _________________________", false, SZ7)])) }),
      new TableRow({ children: firmas.map((f) => sigCell([textPara("Fecha: " + (f.fecha || "___________"), false, SZ7)])) }),
    ],
  });

  const firmasRow = makeCell({
    paragraphs: [firmasInnerTable as unknown as Paragraph],
    span: 7,
    width: COL_TOTAL,
  });

  // ── TABLA PRINCIPAL ──
  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      headerRow0,
      headerRow1,
      datosHeader,
      datosArea,
      datosDocente,
      datosCurso,
      datosTrimestre,
      tiempoHeader,
      tiempoRow,
      objetivosHeader,
      objetivosData,
      insercionesHeader,
      insercionesData,
      unidadesHeader,
      unidadesColHeader,
      ...unidadesRows,
      biblioObsHeader,
      biblioObsData,
      new TableRow({ children: [firmasRow] }),
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  DOCUMENTO
  // ══════════════════════════════════════════════════════════════════════════
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: SZ7 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 11906, height: 16838,
            },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          mainTable,
        ],
      },
    ],
  });

  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return await Packer.toBlob(doc);
  }

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
