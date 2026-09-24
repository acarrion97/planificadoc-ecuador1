/**
 * Generador Word (.docx) para Evaluaciones Diagnósticas.
 * Sigue el patrón de lib/cnc-word-generator.ts (docx + Packer.toBlob),
 * con helpers de estilo duplicados (aislamiento del módulo).
 */
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, ImageRun, WidthType, ShadingType, AlignmentType, BorderStyle,
} from "docx";
import type { EvaluacionDiagnostica, BrechaCurso, PreguntaDiagnostica } from "../data/types-evaluacion";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data";
import {
  ESTATUS_EVALUACION_INFO,
  ESTADO_APRENDIZAJE_INFO,
  TIPO_PREGUNTA_INFO,
  ORIGEN_CURRICULAR_INFO,
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

/** Subnivel de origen de una brecha en texto corto para reportes (design.md D11) */
function origenTexto(b: BrechaCurso): string {
  if (b.subnivelOrigen === null) return ORIGEN_CURRICULAR_INFO.no_determinado.nombre;
  const nombreSubnivel = SUBNIVEL_NAMES[b.subnivelOrigen] ?? `Subnivel ${b.subnivelOrigen}`;
  return b.origen === "arrastre" ? `${nombreSubnivel} (arrastre)` : nombreSubnivel;
}

const LETRAS = ["a.", "b.", "c.", "d.", "e.", "f."];
const IMG_MAX_ANCHO = 150;
const IMG_MAX_ALTO = 110;

interface ImagenWord { data: string; width: number; height: number }

/**
 * Prepara la imagen de una opción para ImageRun. docx 8 no admite SVG (las
 * opciones visuales de la IA), así que en el navegador toda imagen se
 * rasteriza a PNG en un canvas, lo que además da su proporción real. Fuera
 * del navegador solo se aceptan JPEG/PNG en una caja 4:3 fija.
 */
async function imagenParaWord(uri: string): Promise<ImagenWord | null> {
  if (typeof document !== "undefined" && typeof Image !== "undefined") {
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = uri;
    });
    if (!img) return null;
    // Un SVG sin width/height puede reportar 0: se usa el viewBox típico 4:3.
    const w0 = img.naturalWidth || 120;
    const h0 = img.naturalHeight || 90;
    const escala = Math.min(IMG_MAX_ANCHO / w0, IMG_MAX_ALTO / h0);
    const width = Math.round(w0 * escala);
    const height = Math.round(h0 * escala);
    const canvas = document.createElement("canvas");
    // 2x para que no se vea pixelado al imprimir.
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL("image/png"), width, height };
  }
  if (/^data:image\/(jpeg|png);base64,/.test(uri)) {
    return { data: uri, width: 140, height: 105 };
  }
  return null;
}

/** Sección con el instrumento: preguntas, opciones (con imagen) y clave. */
async function seccionPreguntas(preguntas: PreguntaDiagnostica[]): Promise<Paragraph[]> {
  const out: Paragraph[] = [sectionTitle(`Preguntas de la evaluación (${preguntas.length})`)];
  for (const [idx, p] of preguntas.entries()) {
    out.push(new Paragraph({
      spacing: { before: 160, after: 60 },
      keepNext: true,
      children: [
        new TextRun({ text: `${idx + 1}. `, bold: true, size: 20 }),
        new TextRun({ text: p.enunciado, size: 20 }),
        new TextRun({ text: `  (${p.puntaje} pt · ${p.dcdCodigo} · ${TIPO_PREGUNTA_INFO[p.tipo].nombre})`, color: "6b7280", size: 16 }),
      ],
    }));

    for (const [i, o] of (p.opciones ?? []).entries()) {
      const imagen = o.imagen ? await imagenParaWord(o.imagen) : null;
      const runs: (TextRun | ImageRun)[] = [new TextRun({ text: `${LETRAS[i] ?? "•"} `, size: 20 })];
      if (imagen) {
        runs.push(new ImageRun({ data: imagen.data, transformation: { width: imagen.width, height: imagen.height } }));
        if (o.texto) runs.push(new TextRun({ text: "  ", size: 20 }));
      } else if (o.imagen && !o.texto) {
        runs.push(new TextRun({ text: "[imagen]", italics: true, color: "6b7280", size: 20 }));
      }
      if (o.texto) runs.push(new TextRun({ text: o.texto, size: 20 }));
      if (o.esCorrecta) runs.push(new TextRun({ text: "  ✔ correcta", bold: true, color: "16A34A", size: 18 }));
      out.push(new Paragraph({ indent: { left: 360 }, spacing: { after: 60 }, children: runs }));
    }

    if (p.respuestaCorrecta && (p.tipo === "respuesta_corta" || p.tipo === "ejercicio")) {
      out.push(new Paragraph({
        indent: { left: 360 },
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "Respuesta esperada: ", bold: true, color: "16A34A", size: 18 }),
          new TextRun({ text: p.respuestaCorrecta, size: 18 }),
        ],
      }));
    }
  }
  return out;
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

  // Igual que la prueba imprimible: todas las preguntas de la evaluación.
  const preguntasEv = ev.preguntas;
  if (preguntasEv.length) {
    children.push(...(await seccionPreguntas(preguntasEv)));
  }

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
      cell("Origen", { bold: true, fill: BG_COLHEAD, color: "FFFFFF" }),
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
        cell(origenTexto(b), { size: 16 }),
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
    const origenPorCodigo = new Map(brechas.map((b) => [b.dcdCodigo, origenTexto(b)]));
    children.push(sectionTitle("Recomendaciones pedagógicas"));
    for (const r of recomendaciones) {
      const color = ESTADO_APRENDIZAJE_INFO[r.nivel].color;
      const origen = origenPorCodigo.get(r.dcdCodigo);
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `${r.dcdCodigo} — ${r.dcdDescripcion}`, bold: true, color, size: 20 }),
            ...(origen ? [new TextRun({ text: `  ·  ${origen}`, color: "6b7280", size: 16 })] : []),
          ],
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