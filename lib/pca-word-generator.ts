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
  HeightRule,
  TableLayoutType,
  Footer,
} from "docx";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "../data/pca-ejes-transversales";
import { iconosDcdRuns } from "./dcd-iconos";

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
const COLOR_PRIMARY = "155E75";     // azul petróleo
const COLOR_PRIMARY_DARK = "0F3D4C";
const COLOR_SECTION = "DCEFF2";      // fondo suave para cabeceras
const COLOR_HEADER = "EAF6F7";
const COLOR_BORDER = "A9C3C8";
const COLOR_MUTED = "5F6B6D";
const COLOR_WHITE = "FFFFFF";
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
const SZ18 = 36; // 18pt — título principal
const SZ11 = 22; // 11pt — institución / encabezados destacados
const SZ9  = 18; // 9pt  — texto normal
const SZ8  = 16; // 8pt  — texto compacto
const SZ7  = 14; // 7pt  — texto pequeño
const SZ6  = 12; // 6pt  — texto mínimo

// Ancho de contenido en A4 landscape (twips): página 16838 - márgenes 540*2
const CONTENT_W = 15758;

// División en 3 tercios iguales (twips) — usada por la franja tricolor y por
// la tabla de firmas.
const THIRDS_W = [5253, 5253, 5252] as const;

// Anchos de columna del grid de 7 columnas, en DXA (twips) — deben sumar
// CONTENT_W. Con layout: FIXED, Word respeta el tblGrid literalmente, así
// que el ancho de tabla y columnWidths deben usar las mismas unidades (DXA).
// N°   Título  ObjEsp  Destrezas  Orientaciones  Indicador  Duración
//  5%    15%     18%      18%         22%           17%       5%
const COL_W = [788, 2364, 2836, 2836, 3467, 2679, 788] as const;
// Total = 15758 (= CONTENT_W)

// Alto mínimo uniforme de las filas de unidades (twips) — evita que filas con
// poco contenido se vean desproporcionadamente más bajas que las demás.
const UNIDAD_ROW_MIN_HEIGHT = 1500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function run(text: string, bold = false, size = SZ9, color = "000000"): TextRun {
  return new TextRun({ text: text ?? "—", bold, size, font: FONT, color });
}

function emptyPara(): Paragraph {
  return new Paragraph({ children: [run("", false, SZ7)] });
}

function labeledPara(label: string, value: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 35, after: 10 },
      children: [run(label, true, SZ9, COLOR_PRIMARY_DARK)],
    }),
    new Paragraph({
      spacing: { before: 0, after: 35 },
      children: [run(value || "—", false, SZ9)],
    }),
  ];
}

function inlinePara(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 45, after: 45 },
    children: [run(label, true, SZ9, COLOR_PRIMARY_DARK), run(" " + (value || "—"), false, SZ9)],
  });
}

function textPara(
  text: string,
  bold = false,
  size = SZ9,
  align: AlignmentType = AlignmentType.LEFT,
  color = "000000"
): Paragraph {
  return new Paragraph({
    alignment: align,
    spacing: { before: 45, after: 45 },
    children: [run(text || "—", bold, size, color)],
  });
}

// Bordes de celda estándar
const BORDER_THIN = { style: BorderStyle.SINGLE, size: 5, color: COLOR_BORDER };
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
      ? { size: cfg.width, type: WidthType.DXA }
      : undefined,
    shading: cfg.bg ? { fill: cfg.bg, color: cfg.bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: cfg.vAlign ?? VerticalAlign.TOP,
    borders: cfg.borders ?? stdBorders,
    margins: { top: 70, bottom: 70, left: 90, right: 90 },
  });
}

/** Fila de cabecera de sección — ocupa las 7 columnas */
function sectionHeaderRow(label: string): TableRow {
  return new TableRow({
    height: { value: 420, rule: HeightRule.ATLEAST },
    children: [
      makeCell({
        paragraphs: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 35, after: 35 },
            children: [run(label, true, SZ8, COLOR_PRIMARY_DARK)],
          }),
        ],
        span: 7,
        width: CONTENT_W,
        bg: COLOR_SECTION,
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
          textPara("LOGO", true, SZ9, AlignmentType.CENTER, COLOR_PRIMARY_DARK),
          textPara("INSTITUCIONAL", false, SZ6, AlignmentType.CENTER, COLOR_MUTED),
        ],
        span: 2,
        width: COL_W[0] + COL_W[1],
        bg: COLOR_HEADER,
        vAlign: VerticalAlign.CENTER,
      }),
      // Nombre institución (cols 3-5, span=3)
      makeCell({
        paragraphs: [
          textPara(formData.institucion || "—", true, SZ11, AlignmentType.CENTER, COLOR_PRIMARY_DARK),
        ],
        span: 3,
        width: COL_W[2] + COL_W[3] + COL_W[4],
        bg: COLOR_HEADER,
        vAlign: VerticalAlign.CENTER,
      }),
      // Año lectivo (cols 6-7, span=2)
      makeCell({
        paragraphs: [
          textPara("AÑO LECTIVO", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK),
          textPara(formData.anioLectivo || "—", true, SZ9, AlignmentType.CENTER, COLOR_PRIMARY_DARK),
        ],
        span: 2,
        width: COL_W[5] + COL_W[6],
        bg: COLOR_HEADER,
        vAlign: VerticalAlign.CENTER,
      }),
    ],
  });

  // ── Fila 1: Título principal ──
  const headerRow1 = new TableRow({
    children: [
      makeCell({
        paragraphs: [textPara("PLAN CURRICULAR ANUAL", true, SZ18, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 7,
        width: CONTENT_W,
        bg: COLOR_SECTION,
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
        width: CONTENT_W,
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
        paragraphs: [textPara("Carga horaria semanal", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 2,
        width: COL_W[0] + COL_W[1],
        bg: COLOR_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("No. Semanas de trabajo", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 1,
        width: COL_W[2],
        bg: COLOR_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Evaluación del aprendizaje e imprevistos", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 2,
        width: COL_W[3] + COL_W[4],
        bg: COLOR_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Total de semanas de clase", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 1,
        width: COL_W[5],
        bg: COLOR_SECTION,
        vAlign: VerticalAlign.CENTER,
      }),
      makeCell({
        paragraphs: [textPara("Total de periodos", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
        span: 1,
        width: COL_W[6],
        bg: COLOR_SECTION,
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
            spacing: { before: 35, after: 10 },
            children: [run("Ejes transversales: ", true, SZ7), run(ejesTexto, false, SZ7)],
          }),
          new Paragraph({
            spacing: { before: 35, after: 10 },
            children: [run("Metodologías activas: ", true, SZ7), run(metodoTexto, false, SZ7)],
          }),
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [run("Técnicas de evaluación: ", true, SZ7), run(tecnicaTexto, false, SZ7)],
          }),
        ],
        span: 7,
        width: CONTENT_W,
      }),
    ],
  });

  // ── Sección 5: UNIDADES DE PLANIFICACIÓN ──
  const unidadesHeader = sectionHeaderRow("5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN");

  const unidadesColHeader = new TableRow({
    children: [
      makeCell({ paragraphs: [textPara("N.°", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],        width: COL_W[0], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Título de la unidad de planificación", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)], width: COL_W[1], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Objetivos específicos de la unidad de planificación", true, SZ6, AlignmentType.CENTER)], width: COL_W[2], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Destrezas", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)], width: COL_W[3], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Orientaciones metodológicas", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)], width: COL_W[4], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Indicador de evaluación", true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)], width: COL_W[5], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
      makeCell({ paragraphs: [textPara("Duración en semanas", true, SZ6, AlignmentType.CENTER)], width: COL_W[6], bg: COLOR_SECTION, vAlign: VerticalAlign.CENTER }),
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
            children: [run(d.codigo, true, SZ7, COLOR_PRIMARY_DARK), run(": " + d.enunciado, false, SZ8), ...iconosDcdRuns(d.codigo)],
          })
        )
      : [textPara("—", false, SZ7)];

    return new TableRow({
      height: { value: UNIDAD_ROW_MIN_HEIGHT, rule: HeightRule.ATLEAST },
      children: [
        makeCell({
          paragraphs: [textPara(String(unidad.numero), true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)],
          width: COL_W[0],
          vAlign: VerticalAlign.CENTER,
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.titulo) || `Unidad ${unidad.numero}`, true, SZ9, AlignmentType.LEFT, COLOR_PRIMARY_DARK)],
          width: COL_W[1],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.objetivosEspecificos) || "—", false, SZ9)],
          width: COL_W[2],
        }),
        makeCell({
          paragraphs: dcdParrafos,
          width: COL_W[3],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.orientacionesMetodologicas) || "—", false, SZ9)],
          width: COL_W[4],
        }),
        makeCell({
          paragraphs: [textPara(toStr(aiU.evaluacion) || "—", false, SZ9)],
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
        bg: COLOR_SECTION,
      }),
      makeCell({
        paragraphs: [textPara("7. OBSERVACIONES", true, SZ7)],
        span: 2,
        width: COL_W[5] + COL_W[6],
        bg: COLOR_SECTION,
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
    width: { size: CONTENT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [...COL_W],
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
  //  TABLA DE FIRMAS (tabla separada, ancho completo — DXA para A4 landscape)
  // ══════════════════════════════════════════════════════════════════════════
  // 3 columnas — deben sumar CONTENT_W (igual que mainTable, layout FIXED)

  function sigCell(paragraphs: Paragraph[], colIdx: number): TableCell {
    return new TableCell({
      children: paragraphs,
      width: { size: THIRDS_W[colIdx], type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      borders: stdBorders,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
    });
  }

  const firmas = [
    { rol: "ELABORADO", cargo: "DOCENTE:", nombre: formData.firmaElaboradoPor || formData.docente || "", fecha: formData.firmaElaboradoFecha || "" },
    { rol: "REVISADO",  cargo: "VICERRECTOR:", nombre: formData.firmaRevisadoPor || "",  fecha: formData.firmaRevisadoFecha  || "" },
    { rol: "APROBADO",  cargo: "DIRECTOR:",    nombre: formData.firmaAprobadoPor  || "",  fecha: formData.firmaAprobadoFecha  || "" },
  ];

  const firmasTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [...THIRDS_W],
    rows: [
      // Fila: ELABORADO | REVISADO | APROBADO
      new TableRow({
        children: firmas.map((f, i) =>
          sigCell([textPara(f.rol, true, SZ8, AlignmentType.CENTER, COLOR_PRIMARY_DARK)], i)
        ),
      }),
      // Fila: cargo
      new TableRow({
        children: firmas.map((f, i) =>
          sigCell([textPara(f.cargo, true, SZ8, AlignmentType.LEFT, COLOR_PRIMARY_DARK)], i)
        ),
      }),
      // Fila: nombre
      new TableRow({
        children: firmas.map((f, i) =>
          sigCell([textPara(f.nombre || "_________________________", false, SZ8)], i)
        ),
      }),
      // Fila: firma
      new TableRow({
        children: firmas.map((_, i) =>
          sigCell([textPara("Firma: _________________________", false, SZ8)], i)
        ),
      }),
      // Fila: fecha
      new TableRow({
        children: firmas.map((f, i) =>
          sigCell([textPara("Fecha: " + (f.fecha || "___________"), false, SZ8)], i)
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
          run: { font: FONT, size: SZ9 },
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
              top: 540,    // 0.375 inch
              right: 540,
              bottom: 540,
              left: 540,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 0 },
                children: [
                  run(
                    `PCA • ${formData.anioLectivo || "2026-2027"} • ${areaName}`,
                    false,
                    SZ6,
                    COLOR_MUTED
                  ),
                ],
              }),
            ],
          }),
        },
        children: [
          mainTable,
          new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "", size: SZ6 })] }),
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