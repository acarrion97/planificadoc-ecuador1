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
/** Convierte cualquier valor a string seguro (la IA puede devolver objetos) */
function toStr(val: any): string {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.map(toStr).join("; ");
  if (typeof val === "object") return Object.values(val).map(toStr).join(" | ");
  return String(val);
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const BG_SECTION = "DDEFF1"; // celeste MinEduc (cabeceras de sección)
const FONT = "Arial";

// Mapas ID → nombre legible
const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map((m) => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map((t) => [t.id, t.nombre])
);
const EJE_LABEL: Record<string, string> = Object.fromEntries(
  EJES_TRANSVERSALES_PCA.map((e) => [e.id, e.nombre])
);

// Tamaños en half-points (docx): 1pt = 2 unidades
const SZ16 = 32; // 16pt — título principal
const SZ9  = 18; // 9pt  — subtítulos / año lectivo
const SZ7  = 14; // 7pt  — texto normal
const SZ6  = 12; // 6pt  — texto pequeño (firmas, notas)

// Anchos de columna del grid de 7 columnas (en unidades pct = 50ths de %)
// N°   Título  ObjEsp  Destrezas  Orientaciones  Indicador  Duración
//  5%    15%     18%      18%         22%           17%       5%
const COL_W = [250, 750, 900, 900, 1100, 850, 250] as const;
// Total = 5000 (100%)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function run(text: string, bold = false, size = SZ7, color = "000000"): TextRun {
  return new TextRun({ text: text ?? "—", bold, size, font: FONT, color });
}

function emptyPara(): Paragraph {
  return new Paragraph({ children: [run("", false, SZ7)] });
}

function labeledPara(label: string, value: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 20, after: 0 },
      children: [run(label, true, SZ7)],
    }),
    new Paragraph({
      spacing: { before: 0, after: 20 },
      children: [run(value || "—", false, SZ7)],
    }),
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

// Bordes de celda estándar
const BORDER_THIN = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const stdBorders = {
  top: BORDER_THIN, bottom: BORDER_THIN, left: BORDER_THIN, right: BORDER_THIN,
};
const noBorders = {
  top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE,
};

type CellConfig = {
  paragraphs: Paragraph[];
  span?: number;
  width?: number; // pct units
  bg?: string;
  vAlign?: VerticalAlign;
  borders?: typeof stdBorders;
};

function makeCell(cfg: CellConfig): TableCell {
  return new TableCell({
    children: cfg.paragraphs,
    columnSpan: cfg.span,
    width: cfg.width !== undefined
      ? { size: cfg.width, type: WidthType.PERCENTAGE }
      : undefined,
    shading: cfg.bg ? { fill: cfg.bg, color: cfg.bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: cfg.vAlign ?? VerticalAlign.TOP,
    borders: cfg.borders ?? stdBorders,
  });
}

/** Fila de cabecera de sección — ocupa las 7 columnas */
function sectionHeaderRow(label: string): TableRow {
  return new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara(label, true, SZ7)],
        span: 7,
        width: 5000,
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });
}

// ─── Función principal ────────────────────────────────────────────────────────

export async function generarWordPca(formData: any, aiResult: any): Promise<Blob> {
  const areaInfo   = AREAS_INFO[formData.area as keyof typeof AREAS_INFO];
  const areaName   = areaInfo?.name || formData.area;
  const subnivelName = SUBNIVEL_NAMES[formData.subnivel as keyof typeof SUBNIVEL_NAMES] || `Subnivel ${formData.subnivel}`;

  const semanasClase   = (formData.semanasTrabajoTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos  = semanasClase * (formData.cargaHorariaSemanal || 0);

  const ejesTexto = formData.usaEjesTransversales && formData.ejesTransversales?.length > 0
    ? formData.ejesTransversales.map((e: string) => EJE_LABEL[e] || e).join(", ")
    : "No aplica";
  const metodoTexto = (formData.metodologiasActivas || []).map((m: string) => METODOLOGIA_LABEL[m] || m).join(", ") || "—";
  const tecnicaTexto = (formData.tecnicasEvaluacion || []).map((t: string) => TECNICA_LABEL[t] || t).join(", ") || "—";

  const unidades: any[] = formData.unidades || [];
  const aiUnidades: any[] = aiResult?.unidades || [];

  // ══════════════════════════════════════════════════════════════════════════
  //  TABLA PRINCIPAL
  // ══════════════════════════════════════════════════════════════════════════

  // ── Fila 0: Encabezado institucional (Logo | Institución + Título | Año) ──
  const headerRow0 = new TableRow({
    children: [
      // Logo/Institución (cols 1-2, span=2)
      makeCell({
        paragraphs: [
          textPara("LOGO", true, SZ7, AlignmentType.CENTER),
          textPara("INSTITUCIONAL", false, SZ6, AlignmentType.CENTER),
        ],
        span: 2,
        width: COL_W[0] + COL_W[1],
        vAlign: VerticalAlign.CENTER,
      }),
      // Nombre institución (cols 3-5, span=3)
      makeCell({
        paragraphs: [
          textPara(formData.institucion || "—", true, SZ9, AlignmentType.CENTER),
        ],
        span: 3,
        width: COL_W[2] + COL_W[3] + COL_W[4],
        vAlign: VerticalAlign.CENTER,
      }),
      // Año lectivo (cols 6-7, span=2)
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
        paragraphs: [textPara("PLAN CURRICULAR ANUAL", true, SZ16, AlignmentType.CENTER)],
        span: 7,
        width: 5000,
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
        width: 5000,
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

  // ── Sección 2: TIEMPO ──
  const tiempoHeader = sectionHeaderRow("2. TIEMPO");

  const tiempoLabels = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara("Carga horaria semanal", true, SZ7, AlignmentType.CENTER)],
        span: 2,
        width: COL_W[0] + COL_W[1],
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("No. Semanas de trabajo", true, SZ7, AlignmentType.CENTER)],
        span: 1,
        width: COL_W[2],
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Evaluación del aprendizaje e imprevistos", true, SZ7, AlignmentType.CENTER)],
        span: 2,
        width: COL_W[3] + COL_W[4],
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Total de semanas de clase", true, SZ7, AlignmentType.CENTER)],
        span: 1,
        width: COL_W[5],
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Total de periodos", true, SZ7, AlignmentType.CENTER)],
        span: 1,
        width: COL_W[6],
        bg: BG_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  const tiempoData = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara(String(formData.cargaHorariaSemanal || "—"), false, SZ7, AlignmentType.CENTER)],
        span: 2,
        width: COL_W[0] + COL_W[1],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara(String(formData.semanasTrabajoTotal || "—"), false, SZ7, AlignmentType.CENTER)],
        width: COL_W[2],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara(String(formData.semanasEvaluacion || "—"), false, SZ7, AlignmentType.CENTER)],
        span: 2,
        width: COL_W[3] + COL_W[4],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara(String(semanasClase), false, SZ7, AlignmentType.CENTER)],
        width: COL_W[5],
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara(String(totalPeriodos), false, SZ7, AlignmentType.CENTER)],
        width: COL_W[6],
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  // ── Sección 3: OBJETIVOS GENERALES ──
  const objetivosHeader = sectionHeaderRow("3. OBJETIVOS GENERALES");

  const objetivosData = new TableRow({
    children: [
      makeCell({
        paragraphs: labeledPara("Objetivos del área:", toStr(aiResult?.objetivosArea) || "—"),
        span: 4,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3],
      }),
      makeCell({
        paragraphs: labeledPara("Objetivos del grado / curso:", toStr(aiResult?.objetivosGrado) || "—"),
        span: 3,
        width: COL_W[4] + COL_W[5] + COL_W[6],
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
        width: 5000,
      }),
    ],
  });

  // ── Sección 5: UNIDADES DE PLANIFICACIÓN ──
  const unidadesHeader = sectionHeaderRow("5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN");

  const unidadesColHeader = new TableRow({
    children: [
      makeCell({ paragraphs: [textPara("N.°", true, SZ7, AlignmentType.CENTER)],        width: COL_W[0], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Título de la unidad de planificación", true, SZ7, AlignmentType.CENTER)], width: COL_W[1], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Objetivos específicos de la unidad de planificación", true, SZ6, AlignmentType.CENTER)], width: COL_W[2], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Destrezas", true, SZ7, AlignmentType.CENTER)], width: COL_W[3], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Orientaciones metodológicas", true, SZ7, AlignmentType.CENTER)], width: COL_W[4], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Indicador de evaluación", true, SZ7, AlignmentType.CENTER)], width: COL_W[5], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Duración en semanas", true, SZ6, AlignmentType.CENTER)], width: COL_W[6], bg: BG_SECTION, vAlign: VerticalAlign.CENTER }),
    ],
  });

  // Filas de unidades — DINÁMICAS según cuántas unidades haya
  const unidadesRows: TableRow[] = unidades.map((unidad: any, idx: number) => {
    const aiU = aiUnidades.find((a: any) => a.numero === unidad.numero) || aiUnidades[idx] || {};
    const dcdsTexto = (unidad.dcdsSeleccionadas || [])
      .map((d: any) => `${d.codigo}: ${d.enunciado}`)
      .join("\n");

    // Cada DCD como párrafo separado
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
        makeCell({
          paragraphs: [textPara(String(unidad.numero), true, SZ7, AlignmentType.CENTER)],
          width: COL_W[0],
          vAlign: VerticalAlign.CENTER,
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.titulo) || `Unidad ${unidad.numero}`, true, SZ7)],
          width: COL_W[1],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.objetivosEspecificos) || "—", false, SZ7)],
          width: COL_W[2],
        }),
        makeCell({
          paragraphs: dcdParrafos,
          width: COL_W[3],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.orientacionesMetodologicas) || "—", false, SZ7)],
          width: COL_W[4],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.evaluacion) || "—", false, SZ7)],
          width: COL_W[5],
        }),
        makeCell({
          paragraphs: [textPara(String(aiU.duracionSemanas || unidad.duracionSemanas || "—"), false, SZ7, AlignmentType.CENTER)],
          width: COL_W[6],
          vAlign: VerticalAlign.CENTER,
        }),
      ],
    });
  });

  // ── Sección 6+7: BIBLIOGRAFÍA y OBSERVACIONES ──
  const biblioHeader = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara("6. BIBLIOGRAFÍA / WEBGRAFÍA (Utilizar normas APA VI edición)", true, SZ7)],
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

  const biblioData = new TableRow({
    children: [
      makeCell({
        paragraphs: [
          ...(formData.bibliografiaDocente
            ? [textPara(formData.bibliografiaDocente, false, SZ7)]
            : []),
          textPara(toStr(aiResult?.bibliografiaSugerida) || "—", false, SZ7),
        ],
        span: 5,
        width: COL_W[0] + COL_W[1] + COL_W[2] + COL_W[3] + COL_W[4],
      }),
      makeCell({
        paragraphs: [textPara(toStr(aiResult?.observaciones) || "—", false, SZ7)],
        span: 2,
        width: COL_W[5] + COL_W[6],
      }),
    ],
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
      tiempoHeader,
      tiempoLabels,
      tiempoData,
      objetivosHeader,
      objetivosData,
      insercionesHeader,
      insercionesData,
      unidadesHeader,
      unidadesColHeader,
      ...unidadesRows,
      biblioHeader,
      biblioData,
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  TABLA DE FIRMAS (tabla separada, ancho completo — porcentaje para A4 landscape)
  // ══════════════════════════════════════════════════════════════════════════
  // 3 columnas iguales: 33.33% cada una (en unidades pct = 50ths de %)
  const SIG_COL_PCT = 1667; // 1667/5000 ≈ 33.33%

  function sigCell(paragraphs: Paragraph[]): TableCell {
    return new TableCell({
      children: paragraphs,
      width: { size: SIG_COL_PCT, type: WidthType.PERCENTAGE },
      verticalAlign: VerticalAlign.CENTER,
      borders: stdBorders,
    });
  }

  const firmas = [
    { rol: "ELABORADO", cargo: "DOCENTE:", nombre: formData.firmaElaboradoPor || formData.docente || "", fecha: formData.firmaElaboradoFecha || "" },
    { rol: "REVISADO",  cargo: "VICERRECTOR:", nombre: formData.firmaRevisadoPor || "",  fecha: formData.firmaRevisadoFecha  || "" },
    { rol: "APROBADO",  cargo: "DIRECTOR:",    nombre: formData.firmaAprobadoPor  || "",  fecha: formData.firmaAprobadoFecha  || "" },
  ];

  const firmasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Fila: ELABORADO | REVISADO | APROBADO
      new TableRow({
        children: firmas.map((f) =>
          sigCell([textPara(f.rol, true, SZ7, AlignmentType.CENTER)])
        ),
      }),
      // Fila: cargo
      new TableRow({
        children: firmas.map((f) =>
          sigCell([textPara(f.cargo, true, SZ7)])
        ),
      }),
      // Fila: nombre
      new TableRow({
        children: firmas.map((f) =>
          sigCell([textPara(f.nombre || "_________________________", false, SZ7)])
        ),
      }),
      // Fila: firma
      new TableRow({
        children: firmas.map(() =>
          sigCell([textPara("Firma: _________________________", false, SZ7)])
        ),
      }),
      // Fila: fecha
      new TableRow({
        children: firmas.map((f) =>
          sigCell([textPara("Fecha: " + (f.fecha || "___________"), false, SZ7)])
        ),
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  DOCUMENTO
  // ══════════════════════════════════════════════════════════════════════════
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SZ7 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 11906,  // A4 landscape (docx lib inverts w/h)
              height: 16838, // A4 landscape height in twips
            },
            margin: {
              top: 720,    // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          mainTable,
          new Paragraph({ children: [new TextRun({ text: "", size: SZ7 })] }),
          firmasTable,
        ],
      },
    ],
  });

  // En browser: Packer.toBlob(); en Node (móvil): Packer.toBuffer()
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
