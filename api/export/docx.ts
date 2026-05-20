import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, BorderStyle, AlignmentType, ShadingType,
  HeadingLevel, VerticalAlign, PageOrientation, convertInchesToTwip,
} from "docx";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const FASES_ES = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;
const FASES_EN = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;

function labelFase(key: string, isEFL: boolean) {
  const map: Record<string, [string, string]> = {
    experiencia:      ["EXPERIENCIA",      "EXPERIENCE"],
    reflexion:        ["REFLEXIÓN",        "REFLECTION"],
    conceptualizacion:["CONCEPTUALIZACIÓN","CONCEPTUALIZATION"],
    aplicacion:       ["APLICACIÓN",       "APPLICATION"],
  };
  return isEFL ? map[key]?.[1] : map[key]?.[0];
}

function cell(text: string, opts: {
  bold?: boolean; shade?: string; colspan?: number; width?: number;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  size?: number;
} = {}) {
  return new TableCell({
    columnSpan: opts.colspan,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: "003366" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "003366" },
      left:   { style: BorderStyle.SINGLE, size: 4, color: "003366" },
      right:  { style: BorderStyle.SINGLE, size: 4, color: "003366" },
    },
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: opts.bold ?? false,
            size: (opts.size ?? 9) * 2,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function headerCell(text: string, colspan?: number) {
  return cell(text, { bold: true, shade: "003366", colspan, align: AlignmentType.CENTER, size: 8 });
}

/** Builds the Word document from a Planificacion plain object */
function buildDocx(plan: any): Buffer {
  const isEFL = plan?.destreza?.area === "EFL";
  const est = plan?.temaSeleccionado?.estructura;

  // ── Header rows ──────────────────────────────────────────────────
  const headerRows = [
    new TableRow({
      children: [
        headerCell(isEFL ? "MICROCURRICULAR LESSON PLAN 2026-2027" : "PLANIFICACIÓN MICROCURRICULAR 2026-2027", 4),
      ],
    }),
    new TableRow({
      children: [
        cell(isEFL ? `INSTITUTION: ${plan.institucion || ""}` : `INSTITUCIÓN: ${plan.institucion || ""}`, { bold: true, width: 50 }),
        cell(isEFL ? `TEACHER: ${plan.docente || ""}` : `DOCENTE: ${plan.docente || ""}`, { bold: true, width: 50, colspan: 3 }),
      ],
    }),
    new TableRow({
      children: [
        cell(isEFL ? `SUBJECT: ${plan.asignatura || ""}` : `ASIGNATURA: ${plan.asignatura || ""}`, { width: 25 }),
        cell(isEFL ? `GRADE: ${plan.grado || ""}` : `GRADO: ${plan.grado || ""}`, { width: 25 }),
        cell(isEFL ? `PERIODS: ${plan.periodos || ""}` : `PERÍODOS: ${plan.periodos || ""}`, { width: 25 }),
        cell(isEFL ? `TRIMESTER: ${plan.trimestre || ""}` : `TRIMESTRE: ${plan.trimestre || ""}`, { width: 25 }),
      ],
    }),
    new TableRow({
      children: [
        cell(isEFL ? `SKILL CODE: ${plan.destreza?.codigo || ""}` : `DESTREZA: ${plan.destreza?.codigo || ""}`, { bold: true }),
        cell(plan.destreza?.descripcion || "", { colspan: 3 }),
      ],
    }),
    new TableRow({
      children: [
        headerCell(isEFL ? "LEARNING OBJECTIVE" : "OBJETIVO DE APRENDIZAJE", 4),
      ],
    }),
    new TableRow({
      children: [
        cell(plan.temaSeleccionado?.objetivoClase || plan.objetivoAprendizaje || "", { colspan: 4 }),
      ],
    }),
  ];

  // ── ERCA rows ────────────────────────────────────────────────────
  const ercaRows: TableRow[] = [];

  if (est) {
    // Column header
    ercaRows.push(new TableRow({
      children: [
        headerCell(isEFL ? "PHASE" : "FASE"),
        headerCell(isEFL ? "DURATION" : "DURACIÓN"),
        headerCell(isEFL ? "ACTIVITIES (Marzano Verbs)" : "ACTIVIDADES (Verbos Marzano)"),
        headerCell("DUA"),
      ],
    }));

    for (const key of FASES_ES) {
      const fase = est[key];
      if (!fase) continue;
      const actividades: string[] = fase.actividades || [];
      const duaArr: any[] = fase.duaActividades || [];

      actividades.forEach((act: string, i: number) => {
        const dua = duaArr[i] || {};
        const duaText = [
          dua.representacion ? (isEFL ? "R" : "R") : "",
          dua.accionExpresion ? (isEFL ? "A" : "A") : "",
          dua.implicacion    ? (isEFL ? "I" : "I") : "",
        ].filter(Boolean).join(" ");

        ercaRows.push(new TableRow({
          children: [
            i === 0 ? cell(labelFase(key, isEFL) || key, { bold: true, shade: "E8F0FE" }) : new TableCell({
              children: [new Paragraph({ children: [] })],
              shading: { fill: "E8F0FE", type: ShadingType.CLEAR, color: "auto" },
              borders: {
                top:    { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: "cccccc" },
                left:   { style: BorderStyle.SINGLE, size: 4, color: "003366" },
                right:  { style: BorderStyle.SINGLE, size: 4, color: "003366" },
              },
            }),
            i === 0 ? cell(fase.duracion || "", { align: AlignmentType.CENTER }) : new TableCell({
              children: [new Paragraph({ children: [] })],
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: "cccccc" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "003366" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "003366" },
              },
            }),
            cell(`${i + 1}. ${act}`),
            cell(duaText, { align: AlignmentType.CENTER, bold: true }),
          ],
        }));
      });
    }
  }

  // ── Footer rows ──────────────────────────────────────────────────
  const footerRows = [
    new TableRow({
      children: [
        headerCell(isEFL ? "RESOURCES" : "RECURSOS", 4),
      ],
    }),
    new TableRow({
      children: [
        cell((plan.temaSeleccionado?.recursos || []).join(" · ") || plan.recursos || "", { colspan: 4 }),
      ],
    }),
    new TableRow({
      children: [
        headerCell(isEFL ? "ASSESSMENT" : "EVALUACIÓN FORMATIVA", 4),
      ],
    }),
    new TableRow({
      children: [
        cell(plan.temaSeleccionado?.evaluacionFormativa || plan.evaluacion || "", { colspan: 4 }),
      ],
    }),
  ];

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [...headerRows, ...ercaRows, ...footerRows],
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
            width: convertInchesToTwip(11.69),
            height: convertInchesToTwip(8.27),
          },
          margin: {
            top: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.5),
          },
        },
      },
      children: [table],
    }],
  });

  return Buffer.from(Packer.toBuffer(doc) as any);
}

/** Fills a user-uploaded .docx template using docxtemplater */
async function fillTemplate(templateBase64: string, plan: any): Promise<Buffer> {
  const isEFL = plan?.destreza?.area === "EFL";
  const est = plan?.temaSeleccionado?.estructura ?? {};

  const buildActividades = (key: string) => {
    const fase = est[key] || {};
    return (fase.actividades || [])
      .map((a: string, i: number) => `${i + 1}. ${a}`)
      .join("\n");
  };

  const tags: Record<string, string> = {
    institucion:     plan.institucion || "",
    docente:         plan.docente || "",
    asignatura:      plan.asignatura || "",
    grado:           plan.grado || "",
    periodos:        plan.periodos || "",
    trimestre:       plan.trimestre || "",
    fecha:           plan.fecha || "",
    destreza_codigo: plan.destreza?.codigo || "",
    destreza_desc:   plan.destreza?.descripcion || "",
    objetivo:        plan.temaSeleccionado?.objetivoClase || plan.objetivoAprendizaje || "",
    tema:            plan.temaSeleccionado?.titulo || "",
    experiencia:     buildActividades("experiencia"),
    reflexion:       buildActividades("reflexion"),
    conceptualizacion: buildActividades("conceptualizacion"),
    aplicacion:      buildActividades("aplicacion"),
    recursos:        (plan.temaSeleccionado?.recursos || []).join(", ") || plan.recursos || "",
    evaluacion:      plan.temaSeleccionado?.evaluacionFormativa || plan.evaluacion || "",
    observaciones:   plan.observaciones || "",
  };

  const buf = Buffer.from(templateBase64, "base64");
  const zip = new PizZip(buf);
  const tpl = new Docxtemplater(zip, { linebreaks: true });
  tpl.setData(tags);
  tpl.render();
  return tpl.getZip().generate({ type: "nodebuffer" }) as Buffer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, templateBase64 } = req.body || {};
  if (!plan) return res.status(400).json({ error: "plan requerido" });

  try {
    let buffer: Buffer;

    if (templateBase64) {
      buffer = await fillTemplate(templateBase64, plan);
    } else {
      buffer = await buildDocx(plan);
    }

    const filename = `Planificacion_${plan.destreza?.codigo || "doc"}_${Date.now()}.docx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.status(200).send(buffer);
  } catch (err: any) {
    console.error("[export/docx] error:", err);
    res.status(500).json({ error: "Error al generar el documento Word: " + err.message });
  }
}
