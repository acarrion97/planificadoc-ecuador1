/**
 * Generador Word (.docx) para Evaluaciones Diagnósticas.
 * Sigue el patrón de lib/cnc-word-generator.ts (docx + Packer.toBlob),
 * con helpers de estilo duplicados (aislamiento del módulo).
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, ShadingType, AlignmentType, BorderStyle,
} from "docx";
import type { EvaluacionDiagnostica } from "../data/types-evaluacion";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data";
import {
  ESTATUS_EVALUACION_INFO,
  ESTADO_APRENDIZAJE_INFO,
  EstadoAprendizaje,
} from "../data/types-evaluacion";
import {
  calcularBrechasCurso,
  generarRecomendaciones,
  clasificarAprendizaje,
  calcularResultadoEstudiante,
} from "./evaluacion-utils";

const BG_TITLE = "003366";
const BG_COLHEAD = "1A3A5C";
const BG_SECTION = "DDEFF1";
const BORDER = "cbd5e1";

function cell(text: string, opts: { bold?: boolean; fill?: string; color?: string; align?: string; size?: number } = {}): TableCell {
  const fill = opts.fill ? { shading: { type: ShadingType.CLEAR, fill: opts.fill } } : {};
  const alignment = opts.align === "center" ? AlignmentType.CENTER : opts.align === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT;
  return new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    ...fill,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment,
        children: [
          new TextRun({ text, bold: opts.bold ?? false, color: opts.color ?? "111827", size: (opts.size ?? 18) * 2 }),
        ],
      }),
    ],
  });
}

function row(cells: TableCell[], isHeader = false): TableRow {
  return new TableRow({ children: cells, tableHeader: isHeader });
}

function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: BG_TITLE, size: 24 })],
  });
}

/** Resultados por estudiante con cálculos derivados (no persistidos) */
function resultadosCalculados(ev: EvaluacionDiagnostica) {
  return ev.estudiantes
    .filter((est) => ev.resultados.some((r) => r.estudianteId === est.id && r.respuestas.length > 0))
    .map((est) => {
      const r = ev.resultados.find((x) => x.estudianteId === est.id)!;
      const calc = calcularResultadoEstudiante(ev, r);
      return { codigo: est.codigo, nombre: est.nombre, puntaje: calc.puntaje, porcentaje: calc.porcentaje };
    });
}

/** Nivel dominante de una brecha: estado con más estudiantes (empate → más severo) */
function nivelDominante(b: { dominado: number; enProceso: number; requiereRefuerzo: number }): EstadoAprendizaje {
  const max = Math.max(b.dominado, b.enProceso, b.requiereRefuerzo);
  if (b.requiereRefuerzo === max) return "requiere_refuerzo";
  if (b.enProceso === max) return "en_proceso";
  return "dominado";
}

export async function generarWordEvaluacion(ev: EvaluacionDiagnostica): Promise<Blob> {
  const brechas = calcularBrechasCurso(ev);
  const recomendaciones = generarRecomendaciones(ev);
  const conResultados = resultadosCalculados(ev);
  const estatus = ESTATUS_EVALUACION_INFO[ev.status];
  const area = AREAS_INFO[ev.area];

  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: BG_TITLE },
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: `📋 ${ev.nombre}`, bold: true, color: "FFFFFF", size: 32 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `${area?.name ?? ev.area} · ${SUBNIVEL_NAMES[ev.subnivel] ?? "Subnivel"} · ${ev.grado}${ev.paralelo ? ` · Paralelo ${ev.paralelo}` : ""}${ev.asignatura ? ` · ${ev.asignatura}` : ""} · ${ev.anioLectivo}`, color: "6b7280", size: 20 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `Puntaje total: ${ev.puntajeTotal} · Duración: ${ev.duracionMinutos} min · Estado: ${estatus.nombre}`, color: "6b7280", size: 20 }),
      ],
    })
  );

  if (conResultados.length) {
    children.push(sectionTitle(`Resultados por estudiante (${conResultados.length})`));
    const header = row([
      cell("Estudiante", { bold: true, fill: BG_COLHEAD, color: "FFFFFF" }),
      cell("Puntaje", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("%", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("Clasificación", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
    ], true);
    const filas = conResultados.map((r) => {
      const c = ESTADO_APRENDIZAJE_INFO[clasificarAprendizaje(r.porcentaje, ev.umbrales)];
      return row([
        cell(r.codigo + (r.nombre ? ` — ${r.nombre}` : "")),
        cell(String(r.puntaje), { align: "center" }),
        cell(`${r.porcentaje}%`, { align: "center" }),
        cell(c.nombre, { bold: true, color: c.color, align: "center" }),
      ]);
    });
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, bottom: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, left: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, right: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, insideHorizontal: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, insideVertical: { style: BorderStyle.SINGLE, color: BORDER, size: 1 } },
      rows: [header, ...filas],
    }));
  }

  if (brechas.length) {
    children.push(sectionTitle("Resultados por aprendizaje (DCD)"));
    const headerAprendizaje = row([
      cell("DCD", { bold: true, fill: BG_COLHEAD, color: "FFFFFF" }),
      cell("Descripción", { bold: true, fill: BG_COLHEAD, color: "FFFFFF" }),
      cell("Dominado", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("En proceso", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("Refuerzo", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("% dominio", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
      cell("Nivel dominante", { bold: true, fill: BG_COLHEAD, color: "FFFFFF", align: "center" }),
    ], true);
    const filasAprendizaje = brechas.map((b) => {
      const info = ESTADO_APRENDIZAJE_INFO[nivelDominante(b)];
      return row([
        cell(b.dcdCodigo, { bold: true }),
        cell(b.descripcion),
        cell(String(b.dominado), { align: "center" }),
        cell(String(b.enProceso), { align: "center" }),
        cell(String(b.requiereRefuerzo), { align: "center" }),
        cell(`${b.porcentajeDominio}%`, { align: "center" }),
        cell(info.nombre, { bold: true, color: info.color, align: "center" }),
      ]);
    });
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, bottom: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, left: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, right: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, insideHorizontal: { style: BorderStyle.SINGLE, color: BORDER, size: 1 }, insideVertical: { style: BorderStyle.SINGLE, color: BORDER, size: 1 } },
      rows: [headerAprendizaje, ...filasAprendizaje],
    }));
  }

  if (recomendaciones.length) {
    children.push(sectionTitle("Recomendaciones pedagógicas"));
    for (const r of recomendaciones) {
      const color = ESTADO_APRENDIZAJE_INFO[r.nivel].color;
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${r.dcdCodigo} — ${r.dcdDescripcion}`, bold: true, color, size: 20 })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 240 },
          children: [new TextRun({ text: r.texto, size: 20 })],
        })
      );
    }
  }

  children.push(
    new Paragraph({
      spacing: { before: 400 },
      children: [new TextRun({ text: "Documento generado con Planificadoc • Uso pedagógico exclusivo", color: "9ca3af", size: 16 })],
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}