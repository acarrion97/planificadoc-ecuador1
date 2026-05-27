/**
 * Genera el documento Word (.docx) para Planificación Semanal (5 días)
 * Formato oficial MinEduc Ecuador — A4 landscape
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, ShadingType, AlignmentType,
  VerticalAlign, TableLayoutType,
} from "docx";
import type { PlanificacionSemanal, ConfiguracionDia } from "../data/types";

const BG_HEADER  = "003366";
const BG_SECTION = "DDEFF1";
const BG_SUBHEAD = "EAF4F6";
const WHITE      = "FFFFFF";
const BLACK      = "000000";

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaSemanaKey = typeof DIAS[number];
const DIA_LABEL: Record<DiaSemanaKey, string> = {
  lunes: "LUNES", martes: "MARTES", miercoles: "MIÉRCOLES", jueves: "JUEVES", viernes: "VIERNES",
};
const DIA_COLOR: Record<DiaSemanaKey, string> = {
  lunes: "1E3A8A", martes: "166534", miercoles: "854D0E", jueves: "9A3412", viernes: "6B21A8",
};
const DIA_BG: Record<DiaSemanaKey, string> = {
  lunes: "EFF6FF", martes: "F0FDF4", miercoles: "FEFCE8", jueves: "FFF7ED", viernes: "FAF5FF",
};

const BORDER_DEF = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
};

function cell(
  text: string,
  opts: { bold?: boolean; size?: number; color?: string; bg?: string; align?: AlignmentType; colspan?: number; italic?: boolean } = {}
): TableCell {
  return new TableCell({
    columnSpan: opts.colspan,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.bg ? { fill: opts.bg, color: opts.bg, type: ShadingType.CLEAR } : undefined,
    borders: BORDER_DEF,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text || "—",
            bold: opts.bold ?? false,
            italics: opts.italic ?? false,
            size: (opts.size || 8) * 2,
            color: opts.color || BLACK,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function sectionRow(label: string, colspan = 8): TableRow {
  return new TableRow({
    children: [cell(label, { bold: true, size: 9, bg: BG_SECTION, colspan, color: "1A3A5C" })],
  });
}

export async function generarWordSemanal(semana: PlanificacionSemanal): Promise<Blob> {
  const rows: TableRow[] = [];

  // ── CABECERA ──────────────────────────────────────────────────────────────
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: 8,
        shading: { fill: BG_HEADER, color: BG_HEADER, type: ShadingType.CLEAR },
        borders: BORDER_DEF,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "PLANIFICACIÓN SEMANAL", bold: true, size: 24, color: WHITE, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Semana: ${semana.semanaInicio} — ${semana.semanaFin}`, size: 16, color: "A8C4E0", font: "Arial" })],
          }),
        ],
      }),
    ],
  }));

  // ── DATOS INFORMATIVOS ────────────────────────────────────────────────────
  rows.push(sectionRow("DATOS INFORMATIVOS"));
  rows.push(new TableRow({
    children: [
      cell("Institución:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.institucion || "—", { size: 8, colspan: 3 }),
      cell("Docente:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.docente || "—", { size: 8, colspan: 3 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      cell("Grado / Curso:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(`${semana.grado || "—"} — ${semana.paralelo || "—"}`, { size: 8 }),
      cell("Nivel:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.nivel || "—", { size: 8 }),
      cell("Trimestre:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.trimestre || "—", { size: 8 }),
      cell("Períodos:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.periodos || "—", { size: 8 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      cell("Unidad N.°:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.numeroUnidad || "—", { size: 8 }),
      cell("Título de la unidad:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.tituloUnidad || "—", { size: 8, colspan: 5 }),
    ],
  }));
  rows.push(new TableRow({
    children: [
      cell("Objetivos de la unidad:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell(semana.objetivosUnidad || "—", { size: 8, colspan: 7 }),
    ],
  }));

  // ── DUA ───────────────────────────────────────────────────────────────────
  rows.push(sectionRow("PRINCIPIOS DUA (Diseño Universal para el Aprendizaje)"));
  rows.push(new TableRow({
    children: [
      cell("Implicación (verde):", { bold: true, size: 8, bg: BG_SUBHEAD, color: "166534" }),
      cell(semana.duaImplicacion || "—", { size: 8 }),
      cell("Representación (rosa):", { bold: true, size: 8, bg: BG_SUBHEAD, color: "9D174D" }),
      cell(semana.duaRepresentacion || "—", { size: 8 }),
      cell("Acción / Expresión (azul):", { bold: true, size: 8, bg: BG_SUBHEAD, color: "1E3A8A" }),
      cell(semana.duaAccionExpresion || "—", { size: 8, colspan: 3 }),
    ],
  }));

  // ── PLANIFICACIÓN POR DÍA ─────────────────────────────────────────────────
  rows.push(sectionRow("DESARROLLO SEMANAL POR DÍA"));

  // Cabecera de columnas
  rows.push(new TableRow({
    children: [
      cell("DÍA", { bold: true, size: 8, bg: BG_SECTION, align: AlignmentType.CENTER }),
      cell("DESTREZA (DCD)", { bold: true, size: 8, bg: BG_SECTION }),
      cell("TEMA", { bold: true, size: 8, bg: BG_SECTION }),
      cell("OBJETIVO", { bold: true, size: 8, bg: BG_SECTION }),
      cell("EXPERIENCIA", { bold: true, size: 8, bg: BG_SECTION, color: "C2410C" }),
      cell("REFLEXIÓN", { bold: true, size: 8, bg: BG_SECTION, color: "7C3AED" }),
      cell("CONCEPTUALIZACIÓN", { bold: true, size: 8, bg: BG_SECTION, color: "0D9488" }),
      cell("APLICACIÓN", { bold: true, size: 8, bg: BG_SECTION, color: "1D4ED8" }),
    ],
  }));

  const diasActivos = DIAS.filter(d => semana.dias[d]?.activo);

  for (const dia of diasActivos) {
    const diaConfig: ConfiguracionDia = semana.dias[dia];
    if (!diaConfig?.activo) continue;

    const horas = diaConfig.horas || [];

    for (let hi = 0; hi < horas.length; hi++) {
      const hora = horas[hi];
      const plan = (hora as any).planGenerado;

      const dcdTexto = hora.codigoDestreza
        ? `${hora.codigoDestreza}\n${hora.descripcionDestreza || ""}`
        : "—";

      const exp = plan?.estructura?.experiencia?.actividades?.map((a: string, i: number) => `${i+1}. ${a}`).join("\n") || "—";
      const ref = plan?.estructura?.reflexion?.actividades?.map((a: string, i: number) => `${i+1}. ${a}`).join("\n") || "—";
      const con = plan?.estructura?.conceptualizacion?.actividades?.map((a: string, i: number) => `${i+1}. ${a}`).join("\n") || "—";
      const apl = plan?.estructura?.aplicacion?.actividades?.map((a: string, i: number) => `${i+1}. ${a}`).join("\n") || "—";

      rows.push(new TableRow({
        children: [
          // Día — solo en la primera hora del día
          new TableCell({
            rowSpan: hi === 0 ? horas.length : undefined,
            borders: BORDER_DEF,
            shading: { fill: hi === 0 ? DIA_BG[dia] : WHITE, color: hi === 0 ? DIA_BG[dia] : WHITE, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: hi === 0 ? [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: DIA_LABEL[dia], bold: true, size: 18, color: DIA_COLOR[dia], font: "Arial" }),
                  new TextRun({ text: `\nHora ${hi + 1}`, size: 14, color: "888888", font: "Arial" }),
                ],
              }),
            ] : [new Paragraph({ children: [] })],
          }),
          cell(dcdTexto, { size: 7 }),
          cell(hora.tema || "—", { size: 7 }),
          cell(plan?.objetivoClase || "—", { size: 7 }),
          cell(exp, { size: 7 }),
          cell(ref, { size: 7 }),
          cell(con, { size: 7 }),
          cell(apl, { size: 7 }),
        ],
      }));
    }
  }

  // ── EVALUACIÓN / RECURSOS ─────────────────────────────────────────────────
  rows.push(sectionRow("EVALUACIÓN Y RECURSOS"));

  // Recopilar recursos y técnicas de todas las horas
  const todasTecnicas = new Set<string>();
  const todosRecursos = new Set<string>();

  for (const dia of diasActivos) {
    for (const hora of (semana.dias[dia]?.horas || [])) {
      (hora.tecnicasEvaluacion || []).forEach((t: string) => todasTecnicas.add(t));
      const plan = (hora as any).planGenerado;
      (plan?.recursos || []).forEach((r: string) => todosRecursos.add(r));
    }
  }

  rows.push(new TableRow({
    children: [
      cell("Técnicas de evaluación:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell([...todasTecnicas].join(", ") || "—", { size: 8, colspan: 3 }),
      cell("Recursos didácticos:", { bold: true, size: 8, bg: BG_SUBHEAD }),
      cell([...todosRecursos].join(", ") || "—", { size: 8, colspan: 3 }),
    ],
  }));

  // ── FIRMAS ────────────────────────────────────────────────────────────────
  rows.push(sectionRow("FIRMAS"));
  rows.push(new TableRow({
    children: [
      new TableCell({
        columnSpan: 2, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "ELABORADO POR (DOCENTE)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: semana.docente || "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
      new TableCell({
        columnSpan: 3, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "REVISADO POR (VICERRECTOR)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
      new TableCell({
        columnSpan: 3, borders: BORDER_DEF,
        children: [
          new Paragraph({ children: [new TextRun({ text: "APROBADO POR (DIRECTOR)", bold: true, size: 16, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "—", size: 14, font: "Arial" })] }),
          new Paragraph({ children: [new TextRun({ text: "\n\nFirma: ___________________________", size: 14, color: "888888", font: "Arial" })] }),
        ],
      }),
    ],
  }));

  const table = new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 16838, height: 11906 }, // A4 landscape
          margin: { top: 560, bottom: 560, left: 560, right: 560 },
        },
      },
      children: [table],
    }],
  });

  return Packer.toBlob(doc);
}
