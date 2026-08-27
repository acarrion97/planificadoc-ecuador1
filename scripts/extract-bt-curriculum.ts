/**
 * Extractor de Currículo BT desde archivos .txt
 * Lee los archivos extraídos de PDFs oficiales del MinEduc
 * y genera un seed data estructurado.
 *
 * Uso: npx tsx scripts/extract-bt-curriculum.ts
 */
import * as fs from "fs";
import * as path from "path";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface CriterioEvaluacion {
  codigo: string;
  descripcion: string;
}

interface ResultadoAprendizaje {
  codigo: string;
  descripcion: string;
  criterios: CriterioEvaluacion[];
}

interface Contenido {
  tipo: "conceptual" | "procedimental" | "actitudinal";
  descripcion: string;
  orden: number;
}

interface ModuloCurricular {
  codigo: string;
  nombre: string;
  tipo: "generico" | "especializacion" | "practico_experimental";
  nivel: string;
  duracionTotalPeriodos: number;
  unidadCompetencia: string;
  objetivoModulo: string;
  perfilDocente: string;
  orientacionesMetodologicas: string;
  cargaHoraria: { anio1?: number; anio2?: number; anio3?: number };
  resultadosAprendizaje: ResultadoAprendizaje[];
  contenidos: Contenido[];
}

interface FiguraCurricular {
  figuraCodigo: string;
  figuraNombre: string;
  objetivoGeneral: string;
  modulos: ModuloCurricular[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Constantes
// ═══════════════════════════════════════════════════════════════════════════

const TXT_DIR = path.resolve(__dirname, "../docs/bt-modulos-formativos/txt");
const OUTPUT_FILE = path.resolve(__dirname, "../data/bt-curriculum-seed.ts");

// Mapeo de códigos de archivo a códigos de figura
const FILE_TO_FIGURE: Record<string, string> = {
  api: "API",
  afdr: "AFDR",
  apl: "APL",
  aesc: "AESC",
  cd: "CD",
  cli: "CLI",
  cma: "CMA",
  cpa: "CPA",
  dg: "DG",
  dm: "DM",
  ds: "DS",
  ecli: "ECLI",
  elec: "ELEC",
  ema: "EMA",
  fm: "FM",
  gads: "GADS",
  gal: "GAL",
  gdc: "GDC",
  gfc: "GFC",
  gp: "GP",
  gt: "GT",
  hac: "HAC",
  iea: "IEA",
  me: "ME",
  mi: "MI",
  mrh: "MRH",
  mus: "MUS",
  oc: "OC",
  pas: "PAS",
  pdc: "PDC",
  rt: "RT",
  sc: "SC",
  si: "SI",
  sop: "SOP",
};

// ═══════════════════════════════════════════════════════════════════════════
// Helpers de parsing
// ═══════════════════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]+/g, " ")
    .trim();
}

function extractSection(
  text: string,
  startPattern: RegExp,
  endPattern: RegExp | null
): string {
  const startMatch = text.match(startPattern);
  if (!startMatch) return "";
  const startIdx = startMatch.index! + startMatch[0].length;

  if (endPattern) {
    const remaining = text.slice(startIdx);
    const endMatch = remaining.match(endPattern);
    if (endMatch) {
      return text.slice(startIdx, startIdx + endMatch.index!).trim();
    }
  }
  return text.slice(startIdx).trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de Plan de Estudios (malla)
// ═══════════════════════════════════════════════════════════════════════════

interface MallaRow {
  nombre: string;
  anio1?: number;
  anio2?: number;
  anio3?: number;
}

function parsePlanDeEstudios(text: string): MallaRow[] {
  const rows: MallaRow[] = [];

  // Buscar la sección del plan de estudios
  const planSection = extractSection(
    text,
    /2\.\s*Plan de estudios/i,
    /3\.\s*M[óo]dulos/i
  );
  if (!planSection) return rows;

  // El plan tiene una tabla con columnas: nombre | 1ro | 2do | 3ro
  // Las líneas tienen formato: "Nombre del módulo              2         2"
  // Pero también hay categorías como "Módulos Genéricos de la Familia Profesional"
  // que se mezclan con los nombres de módulos
  
  const lines = planSection.split("\n");
  
  for (const line of lines) {
    // Buscar líneas que terminen con números (cargas horarias)
    // Formato: "...texto...    N    N    N" donde N son números
    const match = line.match(/^(.+?)\s{2,}(\d+)\s{2,}(\d+)\s{2,}(\d+)\s*$/);
    if (match) {
      const nombre = match[1].trim();
      // Saltar líneas de totales y encabezados
      if (nombre.match(/^(total|tipos de|módulos|genéricos|especialización|práctico|período)/i)) continue;
      if (!nombre || nombre.length < 3) continue;

      rows.push({
        nombre,
        anio1: parseInt(match[2]),
        anio2: parseInt(match[3]),
        anio3: parseInt(match[4]),
      });
    }
    
    // También buscar líneas con solo2 números al final
    const match2 = line.match(/^(.+?)\s{2,}(\d+)\s{2,}(\d+)\s*$/);
    if (match2 && !match) {
      const nombre = match2[1].trim();
      if (nombre.match(/^(total|tipos de|módulos|genéricos|especialización|práctico|período)/i)) continue;
      if (!nombre || nombre.length < 3) continue;

      rows.push({
        nombre,
        anio1: parseInt(match2[2]),
        anio2: parseInt(match2[3]),
      });
    }
    
    // Buscar líneas con solo1 número al final (módulos de un solo año)
    const match1 = line.match(/^(.+?)\s{2,}(\d+)\s*$/);
    if (match1 && !match && !match2) {
      const nombre = match1[1].trim();
      if (nombre.match(/^(total|tipos de|módulos|genéricos|especialización|práctico|período)/i)) continue;
      if (!nombre || nombre.length < 3) continue;

      rows.push({
        nombre,
        anio3: parseInt(match1[2]),
      });
    }
  }

  return rows;
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de Módulos
// ═══════════════════════════════════════════════════════════════════════════

function parseModulos(
  text: string,
  malla: MallaRow[],
  figureCode: string
): ModuloCurricular[] {
  const modulos: ModuloCurricular[] = [];

  // Dividir por encabezados de módulo
  const moduloHeaders =
    /M[ÓO]DULO\s+(?:Gen[ée]rico|de Especializaci[oó]n|Pr[aá]ctico Experimental)\s+Nro\.?\s*\d+/gi;
  const splits = text.split(moduloHeaders);

  // El primer elemento es el texto antes del primer módulo (plan de estudios, etc.)
  // Los módulos están en posiciones impares (1, 3, 5, ...)
  const headerMatches = [...text.matchAll(moduloHeaders)];

  for (let i = 0; i < headerMatches.length; i++) {
    const header = headerMatches[i][0];
    const moduloText = splits[i + 1] || "";

    // Determinar tipo de módulo
    let tipo: "generico" | "especializacion" | "practico_experimental" =
      "especializacion";
    if (header.match(/gen[ée]rico/i)) tipo = "generico";
    else if (header.match(/pr[aá]ctico experimental/i))
      tipo = "practico_experimental";

    // Extraer campos del módulo
    const nombre = extractField(moduloText, /Nombre del m[oó]dulo[:\s]+(.+?)$/m);
    const nivel = extractField(moduloText, /Nivel[:\s]+(.+?)$/m);
    const duracionStr = extractField(
      moduloText,
      /Duraci[oó]n[:\s]+(\d+)\s*periodos pedag[oó]gicos/i
    );
    const uc = extractField(
      moduloText,
      /Unidad\s+de\s+competencia\s+asociada:\s*UC\s*\d+:\s*([\s\S]+?)(?=Objetivo)/i
    );
    const objetivo = extractField(
      moduloText,
      /Objetivo del m[oó]dulo[:\s]*([\s\S]+?)(?=Resultados de A)/i
    );
    const perfilDocente = extractSection(
      moduloText,
      /Perfil del o la docente/i,
      /Orientaciones Metodol[oó]gicas/i
    );
    const orientaciones = extractSection(
      moduloText,
      /Orientaciones Metodol[oó]gicas/i,
      /Materiales y recursos/i
    );

    if (!nombre) continue;

    // Generar código del módulo
    const moduloNum = i + 1;
    const codigo = `${figureCode}.${tipo === "generico" ? "1" : tipo === "especializacion" ? "2" : "3"}.${moduloNum}`;

    // Buscar carga horaria en la malla
    const mallaRow = malla.find(
      (r) =>
        r.nombre.toLowerCase().includes(nombre.toLowerCase().slice(0, 10)) ||
        nombre.toLowerCase().includes(r.nombre.toLowerCase().slice(0, 10))
    );

    // Calcular carga horaria desde duración y nivel si no hay malla
    let cargaHoraria: { anio1?: number; anio2?: number; anio3?: number } = {};
    if (mallaRow) {
      cargaHoraria = {
        anio1: mallaRow.anio1,
        anio2: mallaRow.anio2,
        anio3: mallaRow.anio3,
      };
    } else if (nivel && duracionStr) {
      // Calcular desde duración total y nivel
      const duracion = parseInt(duracionStr);
      const semanasPorAnio = 40;
      
      // Determinar en qué años está el módulo
      const anos: number[] = [];
      if (nivel.match(/1ro/i)) anos.push(1);
      if (nivel.match(/2do/i)) anos.push(2);
      if (nivel.match(/3ro/i)) anos.push(3);
      
      if (anos.length > 0) {
        const periodosPorSemana = Math.round(duracion / (anos.length * semanasPorAnio));
        for (const anio of anos) {
          if (anio === 1) cargaHoraria.anio1 = periodosPorSemana;
          else if (anio === 2) cargaHoraria.anio2 = periodosPorSemana;
          else if (anio === 3) cargaHoraria.anio3 = periodosPorSemana;
        }
      }
    }

    // Extraer RA y CE
    const resultadosAprendizaje = parseRA(moduloText);

    // Extraer Contenidos
    const contenidos = parseContenidos(moduloText);

    modulos.push({
      codigo,
      nombre,
      tipo,
      nivel: nivel || "",
      duracionTotalPeriodos: duracionStr ? parseInt(duracionStr) : 0,
      unidadCompetencia: cleanText(uc),
      objetivoModulo: cleanText(objetivo),
      perfilDocente: cleanText(perfilDocente),
      orientacionesMetodologicas: cleanText(orientaciones),
      cargaHoraria,
      resultadosAprendizaje,
      contenidos,
    });
  }

  return modulos;
}

function extractField(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[•\-]\s*/g, "")
    .trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de RA/CE
// ═══════════════════════════════════════════════════════════════════════════

function parseRA(text: string): ResultadoAprendizaje[] {
  const resultados: ResultadoAprendizaje[] = [];

  // Encontrar la sección de RA/CE
  const raSection = extractSection(
    text,
    /Resultados de Aprendizaje.*?y Criterios de Evaluaci[oó]n/i,
    /Contenidos/i
  );
  if (!raSection) return resultados;

  // Dividir por RA
  const raBlocks = raSection.split(/(?=RA[\.\s]?\d+[:\.\s])/i);

  for (const block of raBlocks) {
    if (!block.trim()) continue;

    // Extraer código y descripción del RA
    const raMatch = block.match(
      /RA[\.\s]?(\d+)[:\.\s]+([\s\S]+?)(?=CE\d|$)/i
    );
    if (!raMatch) continue;

    const raCodigo = `RA${raMatch[1]}`;
    const raDescripcion = raMatch[2].trim().replace(/\s+/g, " ");

    // Extraer CE
    const criterios: CriterioEvaluacion[] = [];
    const ceMatches = [...block.matchAll(/CE(\d+)\.(\d+)[:\.\s]+([\s\S]+?)(?=CE\d|RA\d|$)/gi)];

    for (const ceMatch of ceMatches) {
      criterios.push({
        codigo: `CE${ceMatch[1]}.${ceMatch[2]}`,
        descripcion: ceMatch[3].trim().replace(/\s+/g, " "),
      });
    }

    resultados.push({
      codigo: raCodigo,
      descripcion: raDescripcion,
      criterios,
    });
  }

  return resultados;
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de Contenidos (C/P/A)
// ═══════════════════════════════════════════════════════════════════════════

function parseContenidos(text: string): Contenido[] {
  const contenidos: Contenido[] = [];

  // Encontrar la sección de contenidos
  const contSection = extractSection(
    text,
    /Contenidos\s*\n\s*Conceptuales\s+Procedimentales\s+Actitudinales/i,
    /Perfil del o la docente/i
  );
  if (!contSection) return contenidos;

  // El texto tiene3 columnas interleavadas
  // Estrategia: separar por bullets() y clasificar cada segmento
  const lines = contSection.split("\n");
  
  // Recoger todo el texto de contenidos en un solo string
  let fullText = "";
  for (const line of lines) {
    if (line.match(/^(Conceptuales|Procedimentales|Actitudinales|Contenidos)/)) continue;
    fullText += " " + line;
  }

  // Separar por el carácter bullet( o •)
  const segments = fullText.split(/[•]/).map(s => s.trim()).filter(s => s.length > 5);

  // Clasificar cada segmento
  let orden = 0;
  for (const segment of segments) {
    const clean = segment.replace(/\s+/g, " ").trim();
    if (clean.length < 10) continue;
    
    const tipo = classifyContenido(clean);
    contenidos.push({
      tipo,
      descripcion: clean,
      orden: orden++,
    });
  }

  return contenidos;
}

function classifyContenido(
  item: string
): "conceptual" | "procedimental" | "actitudinal" {
  const lower = item.toLowerCase();

  // Verbos procedimentales (acciones, aplicación, análisis)
  const procVerbs =
    /^(analizar|aplicar|elaborar|identificar|clasificar|comparar|determinar|relacionar|interpretar|evaluar|seleccionar|organizar|diseñar|formular|registrar|observar|verificar|implementar|ejecutar|proponer|construir|preparar|configurar|emplear|utilizar|operar|medir|calcular|demostrar|presentar|exponer|argumentar|comprobar|contrastar|reportar|sistematizar|categorizar|diagnosticar|supervisar|coordinar|planificar|examinar|establecer|fundamentar|acondicionar|resolver|derivar|optimizar|sustentar|emitar|realizar|dirigir|promover|gestionar|conocer|reconocer|distinguir|describir|explicar|definir|enumerar|corresponder|asociar|estructurar|complementar|integrar)/i;

  // Verbos actitudinales (valores, actitudes, compromiso)
  const actVerbs =
    /^(valorar|respetar|mostrar|asumir|comprometerse|fomentar|mantener|manifestar|adoptar|promover|cuestionar|practicar|aprender|participar|colaborar|sugerir|crear|cuidar|actuar|habilitar|sensibilizar|demostrar\s+(interés|responsabilidad|empatía|paciencia|organización|disposición|orgullo|sentido)|promover\s+el|fomentar\s+el|mostrar\s+(compromiso|interés|responsabilidad|empatía|respeto|organización|disposición|serenidad|orden)|asumir\s+(responsabilidad|del)|responsabilizarse|mantener\s+(actitud|orden)|manifestar\s+(compromiso|interés)|valorar\s+la|respetar\s+(la|los|las|el)|comprometerse\s+con)/i;

  // Primero verificar actitudinales (son más específicos)
  if (actVerbs.test(lower)) return "actitudinal";
  if (procVerbs.test(lower)) return "procedimental";

  return "conceptual";
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de Objetivo General
// ═══════════════════════════════════════════════════════════════════════════

function parseObjetivoGeneral(text: string): string {
  const match = text.match(
    /1\.\s*Objetivo general\s*\n([\s\S]+?)(?=\n\s*2\.\s*Plan)/i
  );
  return match ? match[1].trim().replace(/\s+/g, " ") : "";
}

// ═══════════════════════════════════════════════════════════════════════════
// Parser de Nombre de Figura
// ═══════════════════════════════════════════════════════════════════════════

function parseFigureName(text: string): string {
  const match = text.match(
    /M[ÓO]DULOS FORMATIVOS DE LA FIGURA PROFESIONAL\s+"([^"]+)"/i
  );
  return match ? match[1].trim() : "";
}

// ═══════════════════════════════════════════════════════════════════════════
// Función principal
// ═══════════════════════════════════════════════════════════════════════════

function extractFigure(filePath: string, figureCode: string): FiguraCurricular | null {
  try {
    const rawText = fs.readFileSync(filePath, "utf-8");
    const text = normalizeText(rawText);

    const figuraNombre = parseFigureName(text);
    const objetivoGeneral = parseObjetivoGeneral(text);
    const malla = parsePlanDeEstudios(text);
    const modulos = parseModulos(text, malla, figureCode);

    if (modulos.length === 0) {
      console.warn(`  ⚠ No se encontraron módulos en ${figureCode}`);
      return null;
    }

    return {
      figuraCodigo: figureCode,
      figuraNombre,
      objetivoGeneral,
      modulos,
    };
  } catch (err: any) {
    console.error(`  ✗ Error procesando ${figureCode}: ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Generación de output
// ═══════════════════════════════════════════════════════════════════════════

function generateSeedFile(figures: FiguraCurricular[]): string {
  let output = `/**
 * Datos curriculares del Bachillerato Técnico
 * Generado automáticamente por scripts/extract-bt-curriculum.ts
 * Fuente: Documentos oficiales del Ministerio de Educación del Ecuador
 *
 * NO EDITAR MANUALMENTE - Regenerar con: npx tsx scripts/extract-bt-curriculum.ts
 */

export interface ContenidoSeed {
  tipo: "conceptual" | "procedimental" | "actitudinal";
  descripcion: string;
  orden: number;
}

export interface CriterioEvaluacionSeed {
  codigo: string;
  descripcion: string;
}

export interface ResultadoAprendizajeSeed {
  codigo: string;
  descripcion: string;
  criterios: CriterioEvaluacionSeed[];
}

export interface ModuloCurricularSeed {
  codigo: string;
  nombre: string;
  tipo: "generico" | "especializacion" | "practico_experimental";
  nivel: string;
  duracionTotalPeriodos: number;
  unidadCompetencia: string;
  objetivoModulo: string;
  perfilDocente: string;
  orientacionesMetodologicas: string;
  cargaHoraria: { anio1?: number; anio2?: number; anio3?: number };
  resultadosAprendizaje: ResultadoAprendizajeSeed[];
  contenidos: ContenidoSeed[];
}

export interface FiguraCurricularSeed {
  figuraCodigo: string;
  figuraNombre: string;
  objetivoGeneral: string;
  modulos: ModuloCurricularSeed[];
}

export const BT_CURRICULUM_SEED: FiguraCurricularSeed[] = [
`;

  for (const fig of figures) {
    output += `  {\n`;
    output += `    figuraCodigo: ${JSON.stringify(fig.figuraCodigo)},\n`;
    output += `    figuraNombre: ${JSON.stringify(fig.figuraNombre)},\n`;
    output += `    objetivoGeneral: ${JSON.stringify(fig.objetivoGeneral)},\n`;
    output += `    modulos: [\n`;

    for (const mod of fig.modulos) {
      output += `      {\n`;
      output += `        codigo: ${JSON.stringify(mod.codigo)},\n`;
      output += `        nombre: ${JSON.stringify(mod.nombre)},\n`;
      output += `        tipo: ${JSON.stringify(mod.tipo)},\n`;
      output += `        nivel: ${JSON.stringify(mod.nivel)},\n`;
      output += `        duracionTotalPeriodos: ${mod.duracionTotalPeriodos},\n`;
      output += `        unidadCompetencia: ${JSON.stringify(mod.unidadCompetencia)},\n`;
      output += `        objetivoModulo: ${JSON.stringify(mod.objetivoModulo)},\n`;
      output += `        perfilDocente: ${JSON.stringify(mod.perfilDocente)},\n`;
      output += `        orientacionesMetodologicas: ${JSON.stringify(mod.orientacionesMetodologicas)},\n`;
      output += `        cargaHoraria: ${JSON.stringify(mod.cargaHoraria)},\n`;

      // RA
      output += `        resultadosAprendizaje: [\n`;
      for (const ra of mod.resultadosAprendizaje) {
        output += `          {\n`;
        output += `            codigo: ${JSON.stringify(ra.codigo)},\n`;
        output += `            descripcion: ${JSON.stringify(ra.descripcion)},\n`;
        output += `            criterios: [\n`;
        for (const ce of ra.criterios) {
          output += `              { codigo: ${JSON.stringify(ce.codigo)}, descripcion: ${JSON.stringify(ce.descripcion)} },\n`;
        }
        output += `            ],\n`;
        output += `          },\n`;
      }
      output += `        ],\n`;

      // Contenidos
      output += `        contenidos: [\n`;
      for (const cont of mod.contenidos) {
        output += `          { tipo: ${JSON.stringify(cont.tipo)}, descripcion: ${JSON.stringify(cont.descripcion)}, orden: ${cont.orden} },\n`;
      }
      output += `        ],\n`;

      output += `      },\n`;
    }

    output += `    ],\n`;
    output += `  },\n`;
  }

  output += `];
`;
  return output;
}

// ═══════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log("=== Extractor de Currículo BT ===\n");
  console.log(`Directorio: ${TXT_DIR}\n`);

  const files = fs.readdirSync(TXT_DIR).filter((f) => f.endsWith(".txt"));
  console.log(`Archivos encontrados: ${files.length}\n`);

  const figures: FiguraCurricular[] = [];
  const stats = {
    totalModulos: 0,
    totalRA: 0,
    totalCE: 0,
    totalContenidos: 0,
  };

  for (const file of files) {
    const code = file.replace(".txt", "");
    const figureCode = FILE_TO_FIGURE[code] || code.toUpperCase();
    const filePath = path.join(TXT_DIR, file);

    console.log(`Procesando ${figureCode} (${file})...`);
    const fig = extractFigure(filePath, figureCode);

    if (fig) {
      figures.push(fig);
      stats.totalModulos += fig.modulos.length;
      for (const mod of fig.modulos) {
        stats.totalRA += mod.resultadosAprendizaje.length;
        for (const ra of mod.resultadosAprendizaje) {
          stats.totalCE += ra.criterios.length;
        }
        stats.totalContenidos += mod.contenidos.length;
      }
      console.log(
        `  ✓ ${fig.modulos.length} módulos, ${fig.modulos.reduce((s, m) => s + m.resultadosAprendizaje.length, 0)} RA`
      );
    }
  }

  console.log("\n=== Estadísticas ===");
  console.log(`Figuras: ${figures.length}`);
  console.log(`Módulos: ${stats.totalModulos}`);
  console.log(`RA: ${stats.totalRA}`);
  console.log(`CE: ${stats.totalCE}`);
  console.log(`Contenidos: ${stats.totalContenidos}`);

  // Generar archivo de seed
  const output = generateSeedFile(figures);
  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`\n✓ Seed generado en: ${OUTPUT_FILE}`);

  // Resumen por figura
  console.log("\n=== Resumen por Figura ===");
  for (const fig of figures) {
    const modCount = fig.modulos.length;
    const raCount = fig.modulos.reduce(
      (s, m) => s + m.resultadosAprendizaje.length,
      0
    );
    console.log(
      `  ${fig.figuraCodigo.padEnd(6)} ${fig.figuraNombre.slice(0, 50).padEnd(50)} ${modCount} mód, ${raCount} RA`
    );
  }
}

main();
