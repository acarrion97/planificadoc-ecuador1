import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  PageOrientation,
  convertInchesToTwip,
  TableLayoutType,
} from "docx";
import { PcaFormData, PcaAiResult, AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";

/* ── Helpers ───────────────────────────────────────────────────── */

function hex(color: string): string {
  return color.replace("#", "");
}

function colorCell(text: string, bg: string, textColor = "FFFFFF"): TableCell {
  return new TableCell({
    shading: { fill: hex(bg), type: ShadingType.SOLID },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: textColor, size: 20 })],
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
  });
}

function labelCell(label: string, width = 2000): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "F3F4F6", type: ShadingType.SOLID },
    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18 })] })],
    verticalAlign: VerticalAlign.CENTER,
  });
}

function valueCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: text || "—", size: 18 })] })],
    verticalAlign: VerticalAlign.CENTER,
  });
}

function sectionHeader(title: string, areaColor: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: hex(areaColor), type: ShadingType.SOLID },
            children: [
              new Paragraph({
                children: [new TextRun({ text: title, bold: true, color: "FFFFFF", size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function bodyTable(content: string, areaColor?: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: content.split("\n").map(
              line => new Paragraph({ children: [new TextRun({ text: line || " ", size: 18 })] })
            ),
          }),
        ],
      }),
    ],
  });
}

function spacer(): Paragraph {
  return new Paragraph({ children: [new TextRun({ text: "" })] });
}

/* ── Main export ──────────────────────────────────────────────── */

export async function generarWordPca(
  formData: PcaFormData,
  aiResult: PcaAiResult
): Promise<Blob> {
  const areaInfo = AREAS_INFO[formData.area];
  const areaColor = areaInfo?.color || "#1E3A5F";
  const subnivelName = SUBNIVEL_NAMES[formData.subnivel];
  const semanasClase = formData.semanasTrabajoTotal - formData.semanasEvaluacion;
  const aiUnidades = aiResult.unidades || [];

  /* ── 1. Encabezado ── */
  const encabezadoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: hex(areaColor), type: ShadingType.SOLID },
            columnSpan: 4,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "PLANIFICACIÓN CURRICULAR ANUAL", bold: true, color: "FFFFFF", size: 28 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Año Lectivo ${formData.anioLectivo} — Sistema Educativo Ecuatoriano`, color: "FFFFFF", size: 18 }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Institución:"),
          valueCell(formData.institucion),
          labelCell("Docente:"),
          valueCell(formData.docente),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Área:"),
          valueCell(areaInfo?.name || formData.area),
          labelCell("Subnivel:"),
          valueCell(subnivelName),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Grado/Curso:"),
          valueCell(formData.grado),
          labelCell("Paralelo:"),
          valueCell(formData.paralelo || "—"),
        ],
      }),
    ],
  });

  /* ── 2. Tiempo ── */
  const tiempoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          colorCell("Carga Horaria Semanal\n" + formData.cargaHorariaSemanal + "h", areaColor),
          colorCell("Semanas Totales\n" + formData.semanasTrabajoTotal, areaColor),
          colorCell("Semanas Evaluación\n" + formData.semanasEvaluacion, areaColor),
          colorCell("Semanas de Clase\n" + semanasClase, areaColor),
          colorCell("Total Horas Anuales\n" + (semanasClase * formData.cargaHorariaSemanal) + "h", areaColor),
        ],
      }),
    ],
  });

  /* ── 3. Objetivos ── */
  const objetivosAreaSection = [
    sectionHeader("OBJETIVOS DEL ÁREA DE " + (areaInfo?.name || formData.area).toUpperCase(), areaColor),
    bodyTable(aiResult.objetivosArea || "—"),
  ];

  const objetivosGradoSection = [
    sectionHeader("OBJETIVOS DEL GRADO / CURSO — " + formData.grado, areaColor),
    bodyTable(aiResult.objetivosGrado || "—"),
  ];

  /* ── 4. Ejes transversales ── */
  const ejesSection: (Table | Paragraph)[] = [];
  if (formData.usaEjesTransversales && formData.ejesTransversales.length > 0) {
    ejesSection.push(
      sectionHeader("EJES TRANSVERSALES INSTITUCIONALES", "#374151"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: formData.ejesTransversales.join(" · "), size: 18 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  /* ── 5. Metodologías y técnicas ── */
  const metodSection: (Table | Paragraph)[] = [];
  if (formData.metodologiasActivas.length > 0 || formData.tecnicasEvaluacion.length > 0) {
    metodSection.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: "F3F4F6", type: ShadingType.SOLID },
                children: [new Paragraph({ children: [new TextRun({ text: "METODOLOGÍAS ACTIVAS", bold: true, size: 18 })] })],
              }),
              new TableCell({
                shading: { fill: "F3F4F6", type: ShadingType.SOLID },
                children: [new Paragraph({ children: [new TextRun({ text: "TÉCNICAS DE EVALUACIÓN", bold: true, size: 18 })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: formData.metodologiasActivas.join(" · ") || "—", size: 18 }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: formData.tecnicasEvaluacion.join(" · ") || "—", size: 18 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  /* ── 6. Unidades ── */
  const unidadesElements: (Table | Paragraph)[] = [];

  unidadesElements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: "UNIDADES DIDÁCTICAS ANUALES", bold: true, size: 24, color: hex(areaColor) })],
    })
  );

  for (const unidad of formData.unidades) {
    const aiUnidad = aiUnidades.find(u => u.numero === unidad.numero) || aiUnidades[unidad.numero - 1] || {};
    const titulo = aiUnidad.titulo || unidad.titulo || `Unidad ${unidad.numero}`;

    unidadesElements.push(spacer());

    // Header row
    const unidadRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: hex(areaColor), type: ShadingType.SOLID },
            columnSpan: 2,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `UNIDAD ${unidad.numero}: ${titulo.toUpperCase()}`, bold: true, color: "FFFFFF", size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Duración:", 1800),
          valueCell(`${aiUnidad.duracionSemanas || unidad.duracionSemanas || "—"} semana(s)`),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Objetivos Específicos:", 1800),
          valueCell(aiUnidad.objetivosEspecificos || unidad.objetivosEspecificos || "—"),
        ],
      }),
    ];

    // DCDs
    if (unidad.dcdsSeleccionadas.length > 0) {
      unidadRows.push(
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "F8F9FA", type: ShadingType.SOLID },
              children: [new Paragraph({ children: [new TextRun({ text: "DCDs:", bold: true, size: 18 })] })],
              verticalAlign: VerticalAlign.TOP,
            }),
            new TableCell({
              children: unidad.dcdsSeleccionadas.map(dcd =>
                new Paragraph({
                  children: [
                    new TextRun({ text: dcd.codigo + ": ", bold: true, color: hex(areaColor), size: 18 }),
                    new TextRun({ text: dcd.enunciado, size: 18 }),
                  ],
                })
              ),
            }),
          ],
        })
      );
    }

    unidadRows.push(
      new TableRow({
        children: [
          labelCell("Contenidos / Saberes:", 1800),
          valueCell(aiUnidad.contenidos || unidad.contenidos || "—"),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Orientaciones Metodológicas:", 1800),
          valueCell(aiUnidad.orientacionesMetodologicas || unidad.orientacionesMetodologicas || "—"),
        ],
      }),
      new TableRow({
        children: [
          labelCell("Evaluación:", 1800),
          valueCell(aiUnidad.evaluacion || unidad.evaluacion || "—"),
        ],
      })
    );

    unidadesElements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: unidadRows,
      })
    );
  }

  /* ── 7. Bibliografía ── */
  const biblioSection: (Table | Paragraph)[] = [
    sectionHeader("BIBLIOGRAFÍA Y RECURSOS", areaColor),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            labelCell("Para el Docente:", 2000),
            valueCell(formData.bibliografiaDocente || "—"),
          ],
        }),
        ...(aiResult.bibliografiaSugerida ? [
          new TableRow({
            children: [
              labelCell("Bibliografía Sugerida (IA):", 2000),
              valueCell(aiResult.bibliografiaSugerida),
            ],
          }),
        ] : []),
      ],
    }),
  ];

  /* ── 8. Observaciones ── */
  const obsSection: (Table | Paragraph)[] = [];
  if (aiResult.observaciones) {
    obsSection.push(
      sectionHeader("OBSERVACIONES Y RECOMENDACIONES", "#374151"),
      bodyTable(aiResult.observaciones)
    );
  }

  /* ── 9. DUA ── */
  const duaSection: Table[] = [
    sectionHeader("DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)", "#374151"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            colorCell("REPRESENTACIÓN\nMúltiples medios de presentación: imágenes, audio, video, texto.", "#EC4899"),
            colorCell("ACCIÓN Y EXPRESIÓN\nAlternativas para demostrar aprendizaje: oral, escrito, digital, kinestésico.", "#1E3A5F"),
            colorCell("IMPLICACIÓN / MOTIVACIÓN\nFomentar interés, persistencia y autorregulación del aprendizaje.", "#22C55E"),
          ],
        }),
      ],
    }),
  ];

  /* ── 10. Firmas ── */
  const firmasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          colorCell("ELABORADO POR", "#374151", "FFFFFF"),
          colorCell("REVISADO POR", "#374151", "FFFFFF"),
          colorCell("APROBADO POR", "#374151", "FFFFFF"),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaElaboradoPor || formData.docente || "—", size: 18 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaElaboradoFecha || "", size: 16, color: "888888" })] }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaRevisadoPor || "—", size: 18 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaRevisadoFecha || "", size: 16, color: "888888" })] }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaAprobadoPor || "—", size: 18 })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formData.firmaAprobadoFecha || "", size: 16, color: "888888" })] }),
            ],
          }),
        ],
      }),
    ],
  });

  /* ── Ensamblar documento ── */
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.PORTRAIT },
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          encabezadoTable,
          spacer(),
          tiempoTable,
          spacer(),
          ...objetivosAreaSection,
          spacer(),
          ...objetivosGradoSection,
          spacer(),
          ...(ejesSection.length > 0 ? [...ejesSection, spacer()] : []),
          ...(metodSection.length > 0 ? [...metodSection, spacer()] : []),
          ...unidadesElements,
          spacer(),
          ...biblioSection,
          spacer(),
          ...(obsSection.length > 0 ? [...obsSection, spacer()] : []),
          ...duaSection,
          spacer(),
          firmasTable,
          spacer(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Generado con PlanificaDoc Ecuador · ${new Date().toLocaleDateString("es-EC")} · Ministerio de Educación — Currículo Priorizado 2023-2024`,
                size: 14,
                color: "AAAAAA",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  // Convert Node.js Buffer to ArrayBuffer for cross-platform Blob compatibility
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
