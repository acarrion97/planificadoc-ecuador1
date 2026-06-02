// Script de ejemplo — genera ejemplo-pct.docx en la raíz del proyecto
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign, PageOrientation,
} from "docx";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "ejemplo-pct-v2.docx");

// ── Datos de ejemplo ──────────────────────────────────────────────────────────
const formData = {
  institucion: "Unidad Educativa \"Simón Bolívar\"",
  anioLectivo: "2025–2026",
  docente: "Lcda. María Pérez Andrade",
  area: "M",
  grado: "3.° EGB",
  paralelo: "A",
  subnivel: 2,
  trimestre: "Primer Trimestre",
  cargaHorariaSemanal: 5,
  semanasTotal: 13,
  semanasEvaluacion: 2,
  modeloPedagogico: "ERCA",
  usaEjesTransversales: true,
  ejesTransversales: ["Interculturalidad y plurinacionalidad", "Educación para la democracia"],
  metodologiasActivas: ["Aprendizaje Basado en Problemas (ABP)", "Aprendizaje Cooperativo"],
  tecnicasEvaluacion: ["Observación directa", "Prueba escrita", "Portafolio de evidencias"],
  firmaElaboradoPor: "Lcda. María Pérez Andrade",
  firmaElaboradoFecha: "15/09/2025",
  firmaRevisadoPor: "",
  firmaRevisadoFecha: "",
  firmaAprobadoPor: "",
  firmaAprobadoFecha: "",
};

const aiResult = {
  objetivosTrimestre: "Desarrollar el pensamiento numérico mediante la comprensión y aplicación de los números naturales hasta 9.999, fortaleciendo las operaciones de adición y sustracción con reagrupación en situaciones problemáticas cotidianas. Introducir los conceptos básicos de geometría plana y medición de longitudes, fomentando el razonamiento lógico-matemático y la comunicación matemática con precisión.",
  unidades: [
    {
      numero: 1,
      titulo: "Los números hasta 9.999 y operaciones básicas",
      objetivosEspecificos: "Reconocer, leer y escribir números naturales hasta 9.999 en forma simbólica y gráfica. Aplicar adición y sustracción con reagrupación en problemas del entorno.",
      contenidos: "Números naturales hasta 9.999: lectura, escritura y representación. Valor posicional: unidades, decenas, centenas y millares. Adición y sustracción con reagrupación. Resolución de problemas aritméticos contextualizados.",
      orientacionesMetodologicas: "E — Se activan saberes previos sobre conteo y agrupaciones mediante situaciones cotidianas (precios, distancias). R — Los estudiantes analizan el valor posicional y discuten diferencias entre unidades de distinto orden. C — Se construye el concepto de sistema decimal con bloques multibase y ábacos. A — Se resuelven problemas contextualizados de compra-venta con números de 4 cifras en parejas.",
      evaluacion: "Resuelve adiciones y sustracciones con reagrupación hasta 9.999 en contextos reales con al menos 80% de corrección. Representa correctamente números en forma simbólica y gráfica.",
      duracionSemanas: 4,
    },
    {
      numero: 2,
      titulo: "Figuras y cuerpos geométricos en el entorno",
      objetivosEspecificos: "Identificar y clasificar figuras geométricas planas (triángulo, cuadrado, rectángulo, círculo). Reconocer cuerpos geométricos en objetos del entorno.",
      contenidos: "Polígonos: triángulo, cuadriláteros y círculo — propiedades básicas. Cuerpos geométricos: cubo, esfera, cilindro, pirámide — características. Clasificación y comparación de figuras planas y cuerpos geométricos.",
      orientacionesMetodologicas: "E — Se exploran objetos del aula y la naturaleza para identificar formas geométricas presentes en la vida real. R — Los estudiantes comparan figuras planas y cuerpos, argumentando semejanzas y diferencias. C — Se sistematizan las propiedades de polígonos y cuerpos con organizadores gráficos. A — Se construyen maquetas con material reciclado representando figuras y cuerpos estudiados.",
      evaluacion: "Clasifica correctamente figuras y cuerpos geométricos según sus características, argumentando sus criterios con vocabulario matemático adecuado.",
      duracionSemanas: 4,
    },
    {
      numero: 3,
      titulo: "Medición de longitudes y lectura del tiempo",
      objetivosEspecificos: "Estimar y medir longitudes con unidades convencionales (cm, m). Leer y registrar la hora en relojes analógicos y digitales.",
      contenidos: "Unidades de longitud del SI: centímetro y metro. Estimación y medición de objetos reales. Lectura de la hora: horas exactas, medias horas y cuartos. Resolución de situaciones de medición y tiempo en contextos escolares.",
      orientacionesMetodologicas: "E — Se miden objetos del aula con pasos y palmos para reflexionar sobre la necesidad de unidades estándar. R — Se discute por qué las unidades no estándar generan resultados distintos entre compañeros. C — Se formalizan el centímetro y metro mediante demostración y ejercicios dirigidos con reglas. A — Se resuelven situaciones de medición y lectura de horarios en el contexto escolar.",
      evaluacion: "Mide longitudes con precisión usando cm y m, y lee la hora correctamente en situaciones cotidianas con al menos 75% de acierto.",
      duracionSemanas: 3,
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const BG_HEADER = "DDEFF1";
const BORDER = { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA" };
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function shading(hex) {
  return { type: ShadingType.SOLID, color: hex, fill: hex };
}

function run(text, bold = false, size = 15) {
  return new TextRun({ text, bold, size, font: "Arial" });
}

function para(children, align = AlignmentType.LEFT, spaceBefore = 0, spaceAfter = 0) {
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter }, children });
}

function cell(paragraphs, { span = 1, width = null, bg = null, vAlign = VerticalAlign.TOP } = {}) {
  return new TableCell({
    columnSpan: span,
    verticalAlign: vAlign,
    shading: bg ? shading(bg) : undefined,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    borders: CELL_BORDERS,
    children: paragraphs,
  });
}

/**
 * Tabla interna horizontal ERCA / ACC
 */
function orientacionesTable(texto, modelo = "ERCA") {
  const fases = modelo === "ACC"
    ? [{ sigla: "A", nombre: "Anticipación" }, { sigla: "C", nombre: "Construcción" }, { sigla: "Co", nombre: "Consolidación" }]
    : [{ sigla: "E", nombre: "Experiencia" }, { sigla: "R", nombre: "Reflexión" }, { sigla: "C", nombre: "Conceptualización" }, { sigla: "A", nombre: "Aplicación" }];

  const raw = String(texto || "");
  const partes = new Array(fases.length).fill("—");

  if (modelo === "ACC") {
    const mA  = raw.match(/A\s*[—–-]\s*(.*?)(?=\s*C\s*[—–-]|$)/s);
    const mC  = raw.match(/(?<![Cc]o)\bC\s*[—–-]\s*(.*?)(?=\s*Co\s*[—–-]|$)/s);
    const mCo = raw.match(/Co\s*[—–-]\s*(.*?)$/s);
    if (mA)  partes[0] = mA[1].trim();
    if (mC)  partes[1] = mC[1].trim();
    if (mCo) partes[2] = mCo[1].trim();
  } else {
    const mE = raw.match(/E\s*[—–-]\s*(.*?)(?=\s*R\s*[—–-]|$)/s);
    const mR = raw.match(/R\s*[—–-]\s*(.*?)(?=\s*C\s*[—–-]|$)/s);
    const mC = raw.match(/C\s*[—–-]\s*(.*?)(?=\s*A\s*[—–-]|$)/s);
    const mA = raw.match(/A\s*[—–-]\s*(.*?)$/s);
    if (mE) partes[0] = mE[1].trim();
    if (mR) partes[1] = mR[1].trim();
    if (mC) partes[2] = mC[1].trim();
    if (mA) partes[3] = mA[1].trim();
    if (partes.every(p => p === "—")) partes[0] = raw;
  }

  const BG_FASE = "003366";
  const SZ6 = 12;
  const SZ7 = 14;
  const pct = modelo === "ACC" ? 33 : 25;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: fases.map((f) => new TableCell({
          width: { size: pct, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: BG_FASE, fill: BG_FASE },
          borders: CELL_BORDERS,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 0 }, children: [new TextRun({ text: f.sigla, bold: true, size: SZ7, font: "Arial", color: "FFFFFF" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 20 }, children: [new TextRun({ text: f.nombre, size: SZ6, font: "Arial", color: "DDEFF1" })] }),
          ],
        })),
      }),
      new TableRow({
        children: fases.map((_, i) => new TableCell({
          width: { size: pct, type: WidthType.PERCENTAGE },
          borders: CELL_BORDERS,
          verticalAlign: VerticalAlign.TOP,
          children: [new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: partes[i], size: SZ6, font: "Arial" })] })],
        })),
      }),
    ],
  });
}

function headerRow(text, span = 7) {
  return new TableRow({
    children: [cell([para([run(text, true, 15)], AlignmentType.LEFT)], { span, bg: BG_HEADER })],
  });
}

function thRow(labels) {
  return new TableRow({
    children: labels.map(({ text, span = 1, width = null }) =>
      cell([para([run(text, true, 14)], AlignmentType.CENTER)], { span, width, bg: BG_HEADER, vAlign: VerticalAlign.CENTER })
    ),
  });
}

// ── Datos calculados ──────────────────────────────────────────────────────────
const semanasClase = formData.semanasTotal - formData.semanasEvaluacion;
const totalPeriodos = semanasClase * formData.cargaHorariaSemanal;
const modeloTexto = formData.modeloPedagogico === "ACC"
  ? "ACC (Anticipación – Construcción – Consolidación)"
  : "ERCA (Experiencia – Reflexión – Conceptualización – Aplicación)";

// Ancho total ~15840 dxa (A4 landscape con márgenes ~720 dxa c/lado)
// 7 columnas: 3%·13%·17%·18%·24%·21%·4%
const TW = 15840;
const COLS = [Math.round(TW*0.03), Math.round(TW*0.13), Math.round(TW*0.17),
              Math.round(TW*0.18), Math.round(TW*0.24), Math.round(TW*0.17), Math.round(TW*0.08)];

// ── Filas de unidades ─────────────────────────────────────────────────────────
const unidadesRows = aiResult.unidades.map(u => {
  const formUnit = { dcdsSeleccionadas: [] }; // no DCDs en el ejemplo (texto libre)
  const dcdsParas = u.numero === 1
    ? [
        para([new TextRun({ text: "M.2.1.15 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Leer, escribir y representar números naturales hasta 9.999.", false, 14)], AlignmentType.LEFT, 0, 40),
        para([new TextRun({ text: "M.2.1.16 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Calcular adiciones y sustracciones con reagrupación.", false, 14)]),
      ]
    : u.numero === 2
    ? [
        para([new TextRun({ text: "M.2.3.1 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Identificar, describir y clasificar polígonos.", false, 14)], AlignmentType.LEFT, 0, 40),
        para([new TextRun({ text: "M.2.3.4 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Reconocer características de cuerpos geométricos.", false, 14)]),
      ]
    : [
        para([new TextRun({ text: "M.2.4.1 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Estimar y medir longitudes con unidades del SI.", false, 14)], AlignmentType.LEFT, 0, 40),
        para([new TextRun({ text: "M.2.4.5 ", bold: true, color: "1a6b3a", size: 14, font: "Arial" }), run("Leer la hora en relojes analógicos y digitales.", false, 14)]),
      ];

  return new TableRow({
    children: [
      cell([para([run(String(u.numero), true, 15)], AlignmentType.CENTER)], { width: COLS[0] }),
      cell([para([run(u.titulo, true, 14)])], { width: COLS[1] }),
      cell([para([run(u.objetivosEspecificos, false, 14)])], { width: COLS[2] }),
      cell(dcdsParas, { width: COLS[3] }),
      new TableCell({
        width: { size: COLS[4], type: WidthType.DXA },
        borders: CELL_BORDERS,
        verticalAlign: VerticalAlign.TOP,
        children: [orientacionesTable(u.orientacionesMetodologicas, formData.modeloPedagogico)],
      }),
      cell([para([run(u.evaluacion, false, 14)])], { width: COLS[5] }),
      cell([para([run(String(u.duracionSemanas), false, 14)], AlignmentType.CENTER)], { width: COLS[6] }),
    ],
  });
});

// ── Tabla firmas ──────────────────────────────────────────────────────────────
const firmas = [
  { rol: "ELABORADO", cargo: "DOCENTE:", nombre: formData.firmaElaboradoPor, fecha: formData.firmaElaboradoFecha },
  { rol: "REVISADO",  cargo: "VICERRECTOR:", nombre: "", fecha: "" },
  { rol: "APROBADO",  cargo: "DIRECTOR:", nombre: "", fecha: "" },
];
const firmasRow = new TableRow({
  children: firmas.map(f => cell([
    para([run(f.rol, true, 14)], AlignmentType.CENTER),
    para([run(f.cargo, false, 13)], AlignmentType.CENTER, 40),
    para([run(f.nombre || "_________________________", false, 13)], AlignmentType.CENTER, 20),
    para([run("Firma: _________________________", false, 13)], AlignmentType.CENTER, 60),
    para([run(`Fecha: ${f.fecha || "___________"}`, false, 13)], AlignmentType.CENTER, 20),
  ], { span: 1 })),
});

// ── Documento ─────────────────────────────────────────────────────────────────
const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { orientation: PageOrientation.LANDSCAPE, width: 11906, height: 16838 },
        margin: { top: 720, bottom: 720, left: 720, right: 720 },
        // landscape requiere width > height y orientation explícito
      },
    },
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          // Encabezado institucional
          new TableRow({ children: [
            cell([para([run("LOGO", true, 13)], AlignmentType.CENTER), para([run("INSTITUCIONAL", false, 12)], AlignmentType.CENTER)], { span: 2 }),
            cell([para([run(formData.institucion, true, 17)], AlignmentType.CENTER)], { span: 3 }),
            cell([para([run("AÑO LECTIVO", true, 13)], AlignmentType.CENTER), para([run(formData.anioLectivo, true, 13)], AlignmentType.CENTER)], { span: 2 }),
          ]}),
          // Título
          new TableRow({ children: [
            cell([para([run("PLAN CURRICULAR TRIMESTRAL", true, 26)], AlignmentType.CENTER, 120, 120)], { span: 7 }),
          ]}),

          // 1. Datos informativos
          headerRow("1. DATOS INFORMATIVOS"),
          new TableRow({ children: [
            cell([para([run("Área: ", true, 14), run("Matemática", false, 14)])], { span: 4 }),
            cell([para([run("Asignatura: ", true, 14), run("Matemática", false, 14)])], { span: 3 }),
          ]}),
          new TableRow({ children: [
            cell([para([run("Docente(s): ", true, 14), run(formData.docente, false, 14)])], { span: 7 }),
          ]}),
          new TableRow({ children: [
            cell([para([run("Grado/Curso: ", true, 14), run(`${formData.grado}  —  Paralelo: ${formData.paralelo}`, false, 14)])], { span: 4 }),
            cell([para([run("Nivel Educativo: ", true, 14), run("Básica Elemental (2.° - 4.°)", false, 14)])], { span: 3 }),
          ]}),
          new TableRow({ children: [
            cell([para([run("Trimestre: ", true, 15), new TextRun({ text: formData.trimestre, bold: true, size: 15, color: "003366", font: "Arial" })])], { span: 7 }),
          ]}),

          // 2. Tiempo
          headerRow("2. TIEMPO"),
          thRow([
            { text: "Carga horaria semanal", span: 2 },
            { text: "N.° Semanas de trabajo" },
            { text: "Evaluación e imprevistos", span: 2 },
            { text: "Total sem. de clase" },
            { text: "Total períodos" },
          ]),
          new TableRow({ children: [
            cell([para([run(String(formData.cargaHorariaSemanal), false, 15)], AlignmentType.CENTER)], { span: 2 }),
            cell([para([run(String(formData.semanasTotal), false, 15)], AlignmentType.CENTER)]),
            cell([para([run(String(formData.semanasEvaluacion), false, 15)], AlignmentType.CENTER)], { span: 2 }),
            cell([para([run(String(semanasClase), false, 15)], AlignmentType.CENTER)]),
            cell([para([run(String(totalPeriodos), false, 15)], AlignmentType.CENTER)]),
          ]}),

          // 3. Objetivos
          headerRow("3. OBJETIVOS DEL TRIMESTRE"),
          new TableRow({ children: [
            cell([
              para([run(`Objetivos del ${formData.trimestre}: `, true, 15), run(aiResult.objetivosTrimestre, false, 14)], AlignmentType.LEFT, 40, 40),
            ], { span: 7 }),
          ]}),

          // 4. Inserciones
          headerRow("4. INSERCIONES CURRICULARES"),
          new TableRow({ children: [
            cell([
              para([run("Modelo pedagógico: ", true, 14), run(modeloTexto, false, 14)], AlignmentType.LEFT, 20, 20),
              para([run("Ejes transversales: ", true, 14), run(formData.ejesTransversales.join(", "), false, 14)], AlignmentType.LEFT, 20, 20),
              para([run("Metodologías activas: ", true, 14), run(formData.metodologiasActivas.join(", "), false, 14)], AlignmentType.LEFT, 20, 20),
              para([run("Técnicas de evaluación: ", true, 14), run(formData.tecnicasEvaluacion.join(", "), false, 14)], AlignmentType.LEFT, 20, 40),
            ], { span: 7 }),
          ]}),

          // 5. Unidades
          headerRow("5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN"),
          thRow([
            { text: "N.°", width: COLS[0] },
            { text: "Título de la unidad", width: COLS[1] },
            { text: "Objetivos específicos", width: COLS[2] },
            { text: "Destrezas (DCD)", width: COLS[3] },
            { text: "Orientaciones metodológicas", width: COLS[4] },
            { text: "Indicador de evaluación", width: COLS[5] },
            { text: "Dur. (sem.)", width: COLS[6] },
          ]),
          ...unidadesRows,

          // 6+7: Bibliografía | Observaciones
          new TableRow({ children: [
            cell([para([run("6. BIBLIOGRAFÍA / WEBGRAFÍA (Normas APA)", true, 14)])], { span: 5, bg: BG_HEADER }),
            cell([para([run("7. OBSERVACIONES", true, 14)])], { span: 2, bg: BG_HEADER }),
          ]}),
          new TableRow({ children: [
            cell([
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
            ], { span: 5 }),
            cell([
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
              para([run("_______________________________________________", false, 14)], AlignmentType.LEFT, 80),
            ], { span: 2 }),
          ]}),
        ],
      }),

      // Firmas
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [firmasRow],
      }),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT, buffer);
console.log("✅ Generado:", OUT);
