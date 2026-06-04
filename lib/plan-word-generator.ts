/**
 * Genera el documento Word (.docx) para Planificación Diaria (Microcurricular)
 * Formato oficial MinEduc Ecuador 2026-2027 — A4 portrait
 *
 * LAYOUT: 6 columnas base (cada una ~1744 twips)
 *   - Etiqueta : colspan 1 (~1744)
 *   - Valor    : colspan 2 (~3488)
 *   - 2 pares por fila = 1+2+1+2 = 6 ✓
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { Planificacion } from "../data/types";
import { AREAS_INFO } from "../data/types";

// ── Colores ───────────────────────────────────────────────────────────────────
const BG_HEADER  = "003366";
const BG_SECTION = "DDEFF1";
const BG_SUBHEAD = "EAF4F6";
const WHITE      = "FFFFFF";
const BLACK      = "000000";

// ── Dimensiones A4 portrait ───────────────────────────────────────────────────
// 11906 × 16838 twips. Márgenes 720 cada lado.
// Ancho útil: 11906 - 1440 = 10466 twips → 6 columnas de 1744+1744+...
const TW   = 10466;               // total table width
const C1   = 1500;                // etiqueta angosta
const C2   = 2233;                // valor (colspan:2 → C2+C2=4466)
const COLS = [C1, C2, C2, C1, C2, C2]; // sum = 10464 ≈ TW, 6 base cols

const B = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function tc(
  text: string,
  cs: number,
  opts: { bold?: boolean; size?: number; color?: string; bg?: string; align?: string } = {}
): TableCell {
  return new TableCell({
    columnSpan: cs,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: B,
    children: [
      new Paragraph({
        alignment: (opts.align as any) || AlignmentType.LEFT,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text,
            bold: opts.bold ?? false,
            size: (opts.size ?? 9) * 2,
            color: opts.color ?? BLACK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function tcMulti(paragraphs: Paragraph[], cs: number, opts: { bg?: string } = {}): TableCell {
  return new TableCell({
    columnSpan: cs,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: B,
    children: paragraphs.length > 0 ? paragraphs : [new Paragraph({ children: [new TextRun({ text: "—" })] })],
  });
}

function sectionRow(label: string): TableRow {
  return new TableRow({
    children: [tc(label, 6, { bold: true, size: 9, bg: BG_SECTION, color: "1A3A5C" })],
  });
}

// Fila con 2 pares etiqueta-valor (6 cols: 1+2+1+2)
function dataRow(l1: string, v1: string, l2: string, v2: string): TableRow {
  return new TableRow({
    children: [
      tc(l1, 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(v1, 2, { size: 8 }),
      tc(l2, 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(v2, 2, { size: 8 }),
    ],
  });
}

export async function generarWordPlanificacion(plan: Planificacion): Promise<Blob> {
  const isEFL = plan.destreza?.area === "EFL";
  const areaInfo = AREAS_INFO[plan.destreza?.area as keyof typeof AREAS_INFO];
  const areaName = areaInfo?.name || plan.asignatura || "—";

  const t = (es: string, en: string) => isEFL ? en : es;

  const fases = [
    { key: "experiencia",       label: t("EXPERIENCIA", "EXPERIENCE"),             color: "FF6B35", bg: "FFF3EE" },
    { key: "reflexion",         label: t("REFLEXIÓN", "REFLECTION"),               color: "8B5CF6", bg: "F5F0FF" },
    { key: "conceptualizacion", label: t("CONCEPTUALIZACIÓN", "CONCEPTUALIZATION"),color: "0D9488", bg: "F0FDFA" },
    { key: "aplicacion",        label: t("APLICACIÓN", "APPLICATION"),             color: "2563EB", bg: "EFF6FF" },
  ] as const;

  const rows: TableRow[] = [];

  // ── CABECERA (colspan 6) ──────────────────────────────────────────────────
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: 6,
        shading: { fill: BG_HEADER, color: BG_HEADER, type: ShadingType.CLEAR },
        borders: B,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [new TextRun({ text: t("PLANIFICACIÓN MICROCURRICULAR", "MICROCURRICULAR LESSON PLAN"), bold: true, size: 22, color: WHITE, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [new TextRun({ text: t("Formato Oficial MinEduc 2026-2027", "Official MinEduc Format 2026-2027"), size: 14, color: "A8C4E0", font: "Arial" })],
          }),
        ],
      }),
    ],
  }));

  // ── 1. DATOS INFORMATIVOS ────────────────────────────────────────────────
  rows.push(sectionRow(t("1. DATOS INFORMATIVOS", "1. GENERAL INFORMATION")));
  rows.push(dataRow(t("Institución:", "Institution:"), plan.institucion || "—", t("Docente:", "Teacher:"), plan.docente || "—"));
  rows.push(dataRow(t("Área / Asignatura:", "Area / Subject:"), areaName, t("Grado / Curso:", "Grade:"), plan.grado || "—"));
  rows.push(dataRow(t("Trimestre:", "Term:"), plan.trimestre || "—", t("Período pedagógico:", "Period:"), String(plan.periodos || "—")));
  rows.push(dataRow(t("Semana:", "Week:"), plan.semana || "—", t("Fecha:", "Date:"), plan.fecha || "—"));
  rows.push(dataRow(t("Unidad didáctica:", "Didactic Unit:"), plan.unidadDidactica || "—", t("Paralelo:", "Section:"), plan.paralelo || "—"));

  // ── 2. DESTREZA (1 + 5 = 6) ──────────────────────────────────────────────
  rows.push(sectionRow(t("2. DESTREZA CON CRITERIOS DE DESEMPEÑO", "2. SKILL WITH PERFORMANCE CRITERIA")));
  rows.push(new TableRow({
    children: [
      tc(plan.destreza?.codigo || "—", 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(plan.destreza?.descripcion || "—", 5, { size: 8 }),
    ],
  }));

  // ── 3. OBJETIVOS (6) ─────────────────────────────────────────────────────
  rows.push(sectionRow(t("3. OBJETIVOS", "3. OBJECTIVES")));
  const objetivos = Array.isArray(plan.destreza?.objetivos)
    ? plan.destreza.objetivos.join("\n")
    : (plan.destreza?.objetivos || "—");
  rows.push(new TableRow({ children: [tc(objetivos, 6, { size: 8 })] }));

  // ── 4. INSERCIONES CURRICULARES ───────────────────────────────────────────
  rows.push(sectionRow(t("4. INSERCIONES CURRICULARES", "4. CURRICULAR INSERTIONS")));
  const insercionesTexto = Array.isArray(plan.insercionesCurriculares) && plan.insercionesCurriculares.length > 0
    ? plan.insercionesCurriculares.join(", ") : "—";
  const metodologiasTexto = Array.isArray(plan.metodologiasActivas) && plan.metodologiasActivas.length > 0
    ? plan.metodologiasActivas.join(", ") : "—";
  const tecnicasTexto = Array.isArray((plan as any).tecnicasEvaluacion) && (plan as any).tecnicasEvaluacion.length > 0
    ? (plan as any).tecnicasEvaluacion.join(", ") : "—";

  rows.push(new TableRow({
    children: [
      tc(t("Ejes transversales:", "Cross-cutting themes:"), 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(insercionesTexto, 5, { size: 8 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      tc(t("Metodologías activas:", "Active methodologies:"), 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(metodologiasTexto, 2, { size: 8 }),
      tc(t("Técnicas de evaluación:", "Assessment techniques:"), 1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc(tecnicasTexto, 2, { size: 8 }),
    ],
  }));

  // ── 5. PROCESO DIDÁCTICO (ERCA) ───────────────────────────────────────────
  rows.push(sectionRow(t("5. PROCESO DIDÁCTICO — METODOLOGÍA ERCA", "5. DIDACTIC PROCESS — ERCA METHODOLOGY")));
  // Cabecera: FASE(1) + ACTIVIDADES(3) + DUA(1) + RECURSOS(1) = 6
  rows.push(new TableRow({
    children: [
      tc(t("FASE", "PHASE"),                                    1, { bold: true, size: 8, bg: BG_SECTION, align: AlignmentType.CENTER }),
      tc(t("ACTIVIDADES DE APRENDIZAJE", "LEARNING ACTIVITIES"),3, { bold: true, size: 8, bg: BG_SECTION }),
      tc("DUA",                                                  1, { bold: true, size: 8, bg: BG_SECTION, align: AlignmentType.CENTER }),
      tc(t("RECURSOS", "RESOURCES"),                             1, { bold: true, size: 8, bg: BG_SECTION }),
    ],
  }));

  for (const fase of fases) {
    const faseData = (plan as any).estructura?.[fase.key];
    if (!faseData) continue;

    const actividades: string[] = faseData.actividades || [];
    const dua: any[] = faseData.duaActividades || [];

    const actividadesTexto = actividades.map((a: string, i: number) => `${i + 1}. ${a}`).join("\n") || "—";
    const duaTexto = dua.map((d: any, i: number) => {
      const tags: string[] = [];
      if (d.implicacion)    tags.push("I");
      if (d.representacion) tags.push("R");
      if (d.accionExpresion) tags.push("A");
      return `${i + 1}. ${tags.join(" ")}`;
    }).join("\n") || "—";

    rows.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 1,
          borders: B,
          shading: { fill: fase.bg, color: fase.bg, type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 },
              children: [
                new TextRun({ text: fase.label, bold: true, size: 16, color: fase.color, font: "Arial" }),
                new TextRun({ text: `\n${faseData.duracion || ""}`, size: 14, color: "666666", font: "Arial" }),
              ],
            }),
          ],
        }),
        tc(actividadesTexto, 3, { size: 8 }),
        tc(duaTexto,          1, { size: 8, align: AlignmentType.CENTER }),
        tc(((plan as any).recursos || []).join("\n") || "—", 1, { size: 8 }),
      ],
    }));
  }

  // ── 6. EVALUACIÓN FORMATIVA (1+2+1+2=6) ──────────────────────────────────
  rows.push(sectionRow(t("6. EVALUACIÓN FORMATIVA", "6. FORMATIVE ASSESSMENT")));
  rows.push(new TableRow({
    children: [
      tc(t("Técnica:", "Technique:"),       1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc((plan as any).tecnicaEvaluacion || (plan as any).evaluacionFormativa || "—", 2, { size: 8 }),
      tc(t("Instrumento:", "Instrument:"),  1, { bold: true, size: 8, bg: BG_SUBHEAD }),
      tc((plan as any).instrumentoEvaluacion || "—", 2, { size: 8 }),
    ],
  }));

  // ── 7. FIRMAS (2+2+2=6) ───────────────────────────────────────────────────
  rows.push(sectionRow(t("7. FIRMAS", "7. SIGNATURES")));
  const firmaRoles = [
    { rol: t("ELABORADO POR", "PREPARED BY"),  nombre: plan.docente || "—" },
    { rol: t("REVISADO POR",  "REVIEWED BY"),  nombre: "—" },
    { rol: t("APROBADO POR",  "APPROVED BY"),  nombre: "—" },
  ];
  rows.push(new TableRow({
    children: firmaRoles.map(f =>
      new TableCell({
        columnSpan: 2,
        borders: B,
        children: [
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: f.rol,    bold: true, size: 14, font: "Arial" })] }),
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: f.nombre, size: 14, font: "Arial" })] }),
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, font: "Arial", color: "888888" })] }),
        ],
      })
    ),
  }));

  // ── TABLA Y DOCUMENTO ─────────────────────────────────────────────────────
  const table = new Table({
    layout: TableLayoutType.FIXED,
    width: { size: TW, type: WidthType.DXA },
    columnWidths: COLS,
    rows,
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 720, bottom: 720, left: 720, right: 720 },
        },
      },
      children: [table],
    }],
  });

  return Packer.toBlob(doc);
}
