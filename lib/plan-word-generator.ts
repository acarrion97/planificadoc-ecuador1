/**
 * Genera el documento Word (.docx) para Planificación Diaria (Microcurricular)
 * Formato oficial MinEduc Ecuador 2026-2027 — A4 portrait
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  HeadingLevel, VerticalAlign, TableLayoutType,
} from "docx";
import type { Planificacion } from "../data/types";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";

const BG_HEADER  = "003366"; // azul MinEduc
const BG_SECTION = "DDEFF1"; // celeste sección
const BG_SUBHEAD = "EAF4F6"; // celeste más claro
const WHITE      = "FFFFFF";
const BLACK      = "000000";

const BORDER_DEF = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

function cell(
  text: string,
  opts: {
    bold?: boolean; size?: number; color?: string; bg?: string;
    align?: AlignmentType; colspan?: number; italic?: boolean;
    vAlign?: VerticalAlign;
  } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    verticalAlign: opts.vAlign || VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: BORDER_DEF,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: opts.bold ?? false,
            italics: opts.italic ?? false,
            size: (opts.size || 9) * 2,
            color: opts.color || BLACK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function sectionRow(label: string, colspan = 6): TableRow {
  return new TableRow({
    children: [cell(label, { bold: true, size: 9, bg: BG_SECTION, colspan, color: "1A3A5C" })],
  });
}

function labelValue(label: string, value: string, labelWidth = 2000, valueWidth = 5500): TableCell[] {
  return [
    cell(label, { bold: true, size: 8, bg: BG_SUBHEAD }),
    cell(value, { size: 8 }),
  ];
}

export async function generarWordPlanificacion(plan: Planificacion): Promise<Blob> {
  const isEFL = plan.destreza?.area === "EFL";
  const areaInfo = AREAS_INFO[plan.destreza?.area as keyof typeof AREAS_INFO];
  const areaName = areaInfo?.name || plan.asignatura || "—";

  const t = (es: string, en: string) => isEFL ? en : es;

  const fases = [
    { key: "experiencia",      label: t("EXPERIENCIA", "EXPERIENCE"),          color: "FF6B35", bg: "FFF3EE" },
    { key: "reflexion",        label: t("REFLEXIÓN", "REFLECTION"),             color: "8B5CF6", bg: "F5F0FF" },
    { key: "conceptualizacion",label: t("CONCEPTUALIZACIÓN", "CONCEPTUALIZATION"), color: "0D9488", bg: "F0FDFA" },
    { key: "aplicacion",       label: t("APLICACIÓN", "APPLICATION"),           color: "2563EB", bg: "EFF6FF" },
  ] as const;

  const DUA_LABELS = {
    implicacion:    { label: "I", color: "22C55E", title: t("Implicación", "Engagement") },
    representacion: { label: "R", color: "EC4899", title: t("Representación", "Representation") },
    accionExpresion:{ label: "A", color: "1E3A5F", title: t("Acción/Expresión", "Action & Expression") },
  };

  const rows: TableRow[] = [];

  // ── CABECERA ──────────────────────────────────────────────────────────────
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          shading: { fill: BG_HEADER, color: BG_HEADER, type: ShadingType.CLEAR },
          borders: BORDER_DEF,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: t("PLANIFICACIÓN MICROCURRICULAR", "MICROCURRICULAR LESSON PLAN"), bold: true, size: 22, color: WHITE, font: "Arial" })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: t("Formato Oficial MinEduc 2026-2027", "Official MinEduc Format 2026-2027"), size: 14, color: "A8C4E0", font: "Arial" })],
            }),
          ],
        }),
      ],
    })
  );

  // ── 1. DATOS INFORMATIVOS ────────────────────────────────────────────────
  rows.push(sectionRow(t("1. DATOS INFORMATIVOS", "1. GENERAL INFORMATION")));

  const datosRows: [string, string, string, string][] = [
    [t("Institución:", "Institution:"), plan.institucion || "—", t("Docente:", "Teacher:"), plan.docente || "—"],
    [t("Área / Asignatura:", "Area / Subject:"), areaName, t("Grado / Curso:", "Grade:"), plan.grado || "—"],
    [t("Trimestre:", "Term:"), plan.trimestre || "—", t("Período pedagógico:", "Period:"), plan.periodos || "—"],
    [t("Semana:", "Week:"), plan.semana || "—", t("Fecha:", "Date:"), plan.fecha || "—"],
    [t("Unidad didáctica:", "Didactic Unit:"), plan.unidadDidactica || "—", t("Paralelo:", "Section:"), plan.paralelo || "—"],
  ];

  for (const [l1, v1, l2, v2] of datosRows) {
    rows.push(new TableRow({
      children: [
        cell(l1, { bold: true, size: 8, bg: BG_SUBHEAD }),
        cell(v1, { size: 8 }),
        cell(l2, { bold: true, size: 8, bg: BG_SUBHEAD }),
        cell(v2, { size: 8 }),
      ],
    }));
  }

  // ── 2. DESTREZA ───────────────────────────────────────────────────────────
  rows.push(sectionRow(t("2. DESTREZA CON CRITERIOS DE DESEMPEÑO", "2. SKILL WITH PERFORMANCE CRITERIA")));
  rows.push(new TableRow({
    children: [
      cell(plan.destreza?.codigo || "—", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(plan.destreza?.descripcion || plan.destreza?.enunciado || "—", { size: 8, colspan: 3 }),
    ],
  }));

  // ── 3. OBJETIVOS ──────────────────────────────────────────────────────────
  rows.push(sectionRow(t("3. OBJETIVOS", "3. OBJECTIVES")));
  const objetivos = Array.isArray(plan.destreza?.objetivos) ? plan.destreza.objetivos.join("\n") : (plan.destreza?.objetivos || "—");
  rows.push(new TableRow({
    children: [cell(objetivos, { size: 8, colspan: 4 })],
  }));

  // ── 4. EJES / COMPETENCIAS / METODOLOGÍA ─────────────────────────────────
  rows.push(sectionRow(t("4. INSERCIONES CURRICULARES", "4. CURRICULAR INSERTIONS")));
  const insercionesTexto = Array.isArray(plan.insercionesCurriculares) && plan.insercionesCurriculares.length > 0
    ? plan.insercionesCurriculares.join(", ")
    : "—";
  const metodologiasTexto = Array.isArray(plan.metodologiasActivas) && plan.metodologiasActivas.length > 0
    ? plan.metodologiasActivas.join(", ")
    : "—";
  const tecnicasTexto = Array.isArray(plan.tecnicasEvaluacion) && plan.tecnicasEvaluacion.length > 0
    ? plan.tecnicasEvaluacion.join(", ")
    : "—";

  rows.push(new TableRow({
    children: [
      cell(t("Ejes transversales:", "Cross-cutting themes:"), { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(insercionesTexto, { size: 8, colspan: 3 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      cell(t("Metodologías activas:", "Active methodologies:"), { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(metodologiasTexto, { size: 8 }),
      cell(t("Técnicas de evaluación:", "Assessment techniques:"), { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(tecnicasTexto, { size: 8 }),
    ],
  }));

  // ── 5. PROCESO DIDÁCTICO (ERCA) ───────────────────────────────────────────
  rows.push(sectionRow(t("5. PROCESO DIDÁCTICO — METODOLOGÍA ERCA", "5. DIDACTIC PROCESS — ERCA METHODOLOGY")));

  // Cabecera de columnas
  rows.push(new TableRow({
    children: [
      cell(t("FASE", "PHASE"), { bold: true, size: 8, bg: BG_SECTION, align: AlignmentType.CENTER }),
      cell(t("ACTIVIDADES DE APRENDIZAJE", "LEARNING ACTIVITIES"), { bold: true, size: 8, bg: BG_SECTION }),
      cell("DUA", { bold: true, size: 8, bg: BG_SECTION, align: AlignmentType.CENTER }),
      cell(t("RECURSOS", "RESOURCES"), { bold: true, size: 8, bg: BG_SECTION }),
    ],
  }));

  for (const fase of fases) {
    const faseData = plan.estructura?.[fase.key];
    if (!faseData) continue;

    const actividades = faseData.actividades || [];
    const dua = faseData.duaActividades || [];

    const actividadesTexto = actividades
      .map((a: string, i: number) => `${i + 1}. ${a}`)
      .join("\n");

    const duaTexto = dua.map((d: any, i: number) => {
      const tags = [];
      if (d.implicacion) tags.push("I");
      if (d.representacion) tags.push("R");
      if (d.accionExpresion) tags.push("A");
      return `${i + 1}. ${tags.join(" ")}`;
    }).join("\n") || "—";

    rows.push(new TableRow({
      children: [
        new TableCell({
          borders: BORDER_DEF,
          shading: { fill: fase.bg, color: fase.bg, type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: fase.label, bold: true, size: 16, color: fase.color, font: "Arial" }),
                new TextRun({ text: `\n${faseData.duracion || ""}`, size: 14, color: "666666", font: "Arial" }),
              ],
            }),
          ],
        }),
        cell(actividadesTexto, { size: 8 }),
        cell(duaTexto, { size: 8, align: AlignmentType.CENTER }),
        cell((plan.recursos || []).join("\n") || "—", { size: 8 }),
      ],
    }));
  }

  // ── 6. EVALUACIÓN ─────────────────────────────────────────────────────────
  rows.push(sectionRow(t("6. EVALUACIÓN FORMATIVA", "6. FORMATIVE ASSESSMENT")));
  rows.push(new TableRow({
    children: [
      cell(t("Técnica:", "Technique:"), { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(plan.tecnicaEvaluacion || plan.evaluacionFormativa || "—", { size: 8 }),
      cell(t("Instrumento:", "Instrument:"), { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(plan.instrumentoEvaluacion || "—", { size: 8 }),
    ],
  }));

  // ── 7. FIRMAS ─────────────────────────────────────────────────────────────
  rows.push(sectionRow(t("7. FIRMAS", "7. SIGNATURES")));
  const firmaRoles = [
    { rol: t("ELABORADO POR", "PREPARED BY"), nombre: plan.docente || "—" },
    { rol: t("REVISADO POR", "REVIEWED BY"), nombre: "—" },
    { rol: t("APROBADO POR", "APPROVED BY"), nombre: "—" },
  ];
  rows.push(new TableRow({
    children: firmaRoles.map(f =>
      new TableCell({
        borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: f.rol, bold: true, size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: f.nombre, size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, font: "Arial", color: "888888" })] }),
        ],
      })
    ),
  }));

  const table = new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });

  const doc = new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
      children: [table],
    }],
  });

  return Packer.toBlob(doc);
}
