/**
 * Script para enriquecer data/bachillerato-tecnico.ts con datos del seed curricular.
 * Genera el archivo completo con los datos mergeados.
 *
 * Uso: npx tsx scripts/merge-curriculum-to-static.ts
 */
import * as fs from "fs";
import * as path from "path";
import { BT_CURRICULUM_SEED } from "../data/bt-curriculum-seed";
import type {
  ModuloCurricularSeed,
  ResultadoAprendizajeSeed,
} from "../data/bt-curriculum-seed";

// ═══════════════════════════════════════════════════════════════════════════
// Mapeo de códigos seed → static
// ═══════════════════════════════════════════════════════════════════════════

const SEED_TO_STATIC_PREFIX: Record<string, string> = {
  CLI: "CL", AFDR: "AF", CMA: "CM", GFC: "GF", MRH: "RH",
  CPA: "PA", ECLI: "AP", ELEC: "GA", EMA: "EI", ME: "EA",
  MI: "MC", PAS: "CA", PDC: "PC", IEA: "IE", SOP: "SIN",
  HAC: "HC", GDC: "GD", API: "PI", AESC: "AE", MUS: "MU",
  GADS: "GAL", GAL: "GAL", GP: "GP", APL: "APL", DM: "DM",
  DG: "DG", FM: "FM", OC: "OC", CD: "CD", DS: "DS",
  RT: "RT", SI: "SI", SC: "SC", GT: "GT",
};

// ═══════════════════════════════════════════════════════════════════════════
// Tipos para el archivo estático
// ═══════════════════════════════════════════════════════════════════════════

interface ModuloEstatico {
  codigo: string;
  nombre: string;
  descripcion: string;
  anio: number;
  categoria?: string;
  nivel?: string;
  duracionPeriodos?: Record<number, number | null>;
  objetivoModulo?: string;
  perfilDocente?: string;
  orientacionesMetodologicas?: string[];
  contenidos?: {
    conceptuales: string[];
    procedimentales: string[];
    actitudinales: string[];
  };
  resultadosAprendizaje?: Array<{
    id: string;
    texto: string;
    criteriosEvaluacion: Array<{ id: string; texto: string }>;
  }>;
  estadoCatalogo?: string;
}

interface FiguraEstatica {
  id: string;
  nombre: string;
  familia: string;
  area: string;
  codigo?: string;
  normativaVigente?: string;
  objetivoGeneral: string;
  modulos: ModuloEstatico[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Conversión de formatos
// ═══════════════════════════════════════════════════════════════════════════

function convertSeedModulo(
  seed: ModuloCurricularSeed,
  prefix: string
): Partial<ModuloEstatico> {
  const extras: Partial<ModuloEstatico> = {};

  // Categoría
  extras.categoria =
    seed.tipo === "generico"
      ? "generico"
      : seed.tipo === "especializacion"
        ? "especializacion"
        : "practico";

  // Estado
  extras.estadoCatalogo = "completo";

  // Nivel
  if (seed.nivel) extras.nivel = seed.nivel;

  // Duración por año
  if (seed.cargaHoraria.anio1 || seed.cargaHoraria.anio2 || seed.cargaHoraria.anio3) {
    extras.duracionPeriodos = {};
    if (seed.cargaHoraria.anio1) extras.duracionPeriodos[1] = seed.cargaHoraria.anio1;
    if (seed.cargaHoraria.anio2) extras.duracionPeriodos[2] = seed.cargaHoraria.anio2;
    if (seed.cargaHoraria.anio3) extras.duracionPeriodos[3] = seed.cargaHoraria.anio3;
  }

  // Objetivo
  if (seed.objetivoModulo) extras.objetivoModulo = seed.objetivoModulo;

  // Perfil docente
  if (seed.perfilDocente) extras.perfilDocente = seed.perfilDocente;

  // Orientaciones (convertir string a string[])
  if (seed.orientacionesMetodologicas) {
    extras.orientacionesMetodologicas = seed.orientacionesMetodologicas
      .split(/[,;]\s*/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }

  // Contenidos
  if (seed.contenidos.length > 0) {
    extras.contenidos = {
      conceptuales: seed.contenidos
        .filter((c) => c.tipo === "conceptual")
        .map((c) => c.descripcion),
      procedimentales: seed.contenidos
        .filter((c) => c.tipo === "procedimental")
        .map((c) => c.descripcion),
      actitudinales: seed.contenidos
        .filter((c) => c.tipo === "actitudinal")
        .map((c) => c.descripcion),
    };
  }

  // RA/CE
  if (seed.resultadosAprendizaje.length > 0) {
    extras.resultadosAprendizaje = seed.resultadosAprendizaje.map((ra) => ({
      id: `${prefix}-RA.${ra.codigo.replace("RA", "")}`,
      texto: `${ra.codigo}: ${ra.descripcion}`,
      criteriosEvaluacion: ra.criterios.map((ce) => ({
        id: `${prefix}-CE${ce.codigo.replace("CE", "")}`,
        texto: `${ce.codigo}: ${ce.descripcion}`,
      })),
    }));
  }

  return extras;
}

// ═══════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log("=== Merge Curriculum → Static (v3) ===\n");

  // Indexar módulos seed por código estático
  const seedByCode = new Map<string, { seed: ModuloCurricularSeed; prefix: string }>();
  for (const fig of BT_CURRICULUM_SEED) {
    const staticPrefix = SEED_TO_STATIC_PREFIX[fig.figuraCodigo] || fig.figuraCodigo;
    for (const mod of fig.modulos) {
      const staticCode = mod.codigo.replace(fig.figuraCodigo, staticPrefix);
      seedByCode.set(staticCode, { seed: mod, prefix: fig.figuraCodigo });
    }
  }
  console.log(`Seed modules indexed: ${seedByCode.size}`);

  // Leer el archivo estático como módulo
  const staticPath = path.resolve(__dirname, "../data/bachillerato-tecnico.ts");
  const content = fs.readFileSync(staticPath, "utf-8");

  // Extraer el array FIGURAS_PROFESIONALES usando regex
  const arrayMatch = content.match(
    /export const FIGURAS_PROFESIONALES: FiguraProfesional\[\] = \[([\s\S]*?)\n\];/
  );
  if (!arrayMatch) {
    console.error("No se pudo encontrar FIGURAS_PROFESIONALES");
    return;
  }

  // Parsear cada figura manualmente
  const figuras: FiguraEstatica[] = [];
  const figPattern = /\{[^{}]*id:\s*"([^"]+)"[^{}]*\}/g;
  let figMatch;

  // Encontrar cada objeto de figura
  const figurasBlock = arrayMatch[1];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < figurasBlock.length; i++) {
    if (figurasBlock[i] === "{" && depth === 0) {
      start = i;
      depth = 1;
    } else if (figurasBlock[i] === "{") {
      depth++;
    } else if (figurasBlock[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const figStr = figurasBlock.slice(start, i + 1);
        // Extraer id
        const idMatch = figStr.match(/id:\s*"([^"]+)"/);
        if (idMatch) {
          // Extraer módulos
          const modulosMatch = figStr.match(/modulos:\s*\[([\s\S]*?)\]/);
          const modulos: ModuloEstatico[] = [];

          if (modulosMatch) {
            // Parsear módulos
            let modDepth = 0;
            let modStart = -1;
            const modulosBlock = modulosMatch[1];

            for (let j = 0; j < modulosBlock.length; j++) {
              if (modulosBlock[j] === "{" && modDepth === 0) {
                modStart = j;
                modDepth = 1;
              } else if (modulosBlock[j] === "{") {
                modDepth++;
              } else if (modulosBlock[j] === "}") {
                modDepth--;
                if (modDepth === 0 && modStart !== -1) {
                  const modStr = modulosBlock.slice(modStart, j + 1);
                  const codigoMatch = modStr.match(/codigo:\s*"([^"]+)"/);
                  const nombreMatch = modStr.match(/nombre:\s*"([^"]+)"/);
                  const descMatch = modStr.match(/descripcion:\s*"([^"]+)"/);
                  const anioMatch = modStr.match(/anio:\s*(\d+)/);

                  if (codigoMatch && nombreMatch) {
                    modulos.push({
                      codigo: codigoMatch[1],
                      nombre: nombreMatch[1],
                      descripcion: descMatch ? descMatch[1] : "",
                      anio: anioMatch ? parseInt(anioMatch[1]) : 1,
                    });
                  }
                  modStart = -1;
                }
              }
            }
          }

          figuras.push({
            id: idMatch[1],
            nombre: "",
            familia: "",
            area: "",
            objetivoGeneral: "",
            modulos,
          });
        }
        start = -1;
      }
    }
  }

  console.log(`Figuras parseadas: ${figuras.length}`);
  console.log(`Total módulos: ${figuras.reduce((s, f) => s + f.modulos.length, 0)}`);

  // Enriquecer módulos con datos del seed
  let enriched = 0;
  for (const fig of figuras) {
    for (const modulo of fig.modulos) {
      const seedData = seedByCode.get(modulo.codigo);
      if (!seedData) continue;
      if (modulo.resultadosAprendizaje) continue; // Ya tiene RA

      const extras = convertSeedModulo(seedData.seed, seedData.prefix);
      Object.assign(modulo, extras);
      enriched++;
    }
  }
  console.log(`Enriched: ${enriched}`);

  // Reescribir el archivo con los datos enriquecidos
  // Reemplazar solo el array FIGURAS_PROFESIONALES
  const newFigurasBlock = generateFigurasArray(figuras);
  const newContent = content.replace(
    /export const FIGURAS_PROFESIONALES: FiguraProfesional\[\] = \[[\s\S]*?\n\];/,
    `export const FIGURAS_PROFESIONALES: FiguraProfesional[] = [\n${newFigurasBlock}\n];`
  );

  fs.writeFileSync(staticPath, newContent, "utf-8");
  console.log(`\n✓ File updated: ${staticPath}`);

  // Verificar
  const hasRA = (newContent.match(/resultadosAprendizaje/g) || []).length;
  const hasCompleto = (newContent.match(/estadoCatalogo:\s*"completo"/g) || []).length;
  const hasPendiente = (newContent.match(/estadoCatalogo:\s*"pendiente"/g) || []).length;
  console.log(`\n=== Verification ===`);
  console.log(`Modules with RA: ${hasRA}`);
  console.log(`Modules completo: ${hasCompleto}`);
  console.log(`Modules pendiente: ${hasPendiente}`);
}

function generateFigurasArray(figuras: FiguraEstatica[]): string {
  return figuras
    .map((fig) => {
      const lines: string[] = [];
      lines.push(`  {`);
      lines.push(`    id: ${JSON.stringify(fig.id)},`);
      lines.push(`    nombre: ${JSON.stringify(fig.nombre)},`);
      lines.push(`    familia: ${JSON.stringify(fig.familia)},`);
      lines.push(`    area: ${JSON.stringify(fig.area)},`);
      if (fig.codigo) lines.push(`    codigo: ${JSON.stringify(fig.codigo)},`);
      if (fig.normativaVigente)
        lines.push(`    normativaVigente: ${JSON.stringify(fig.normativaVigente)},`);
      lines.push(`    objetivoGeneral: ${JSON.stringify(fig.objetivoGeneral)},`);
      lines.push(`    modulos: [`);
      for (const mod of fig.modulos) {
        lines.push(`      ${generateModuloLine(mod)}`);
      }
      lines.push(`    ],`);
      lines.push(`  },`);
      return lines.join("\n");
    })
    .join("\n");
}

function generateModuloLine(mod: ModuloEstatico): string {
  const parts: string[] = [];
  parts.push(`{ codigo: ${JSON.stringify(mod.codigo)}`);
  parts.push(`nombre: ${JSON.stringify(mod.nombre)}`);
  parts.push(`descripcion: ${JSON.stringify(mod.descripcion)}`);
  parts.push(`anio: ${mod.anio}`);

  if (mod.categoria) parts.push(`categoria: ${JSON.stringify(mod.categoria)}`);
  if (mod.estadoCatalogo)
    parts.push(`estadoCatalogo: ${JSON.stringify(mod.estadoCatalogo)}`);
  if (mod.nivel) parts.push(`nivel: ${JSON.stringify(mod.nivel)}`);
  if (mod.duracionPeriodos) {
    const entries = Object.entries(mod.duracionPeriodos)
      .map(([k, v]) => `${k}: ${v === null ? "null" : v}`)
      .join(", ");
    parts.push(`duracionPeriodos: { ${entries} }`);
  }
  if (mod.objetivoModulo)
    parts.push(`objetivoModulo: ${JSON.stringify(mod.objetivoModulo)}`);
  if (mod.perfilDocente)
    parts.push(`perfilDocente: ${JSON.stringify(mod.perfilDocente)}`);
  if (mod.orientacionesMetodologicas)
    parts.push(
      `orientacionesMetodologicas: ${JSON.stringify(mod.orientacionesMetodologicas)}`
    );
  if (mod.contenidos) {
    parts.push(`contenidos: { conceptuales: ${JSON.stringify(mod.contenidos.conceptuales)}, procedimentales: ${JSON.stringify(mod.contenidos.procedimentales)}, actitudinales: ${JSON.stringify(mod.contenidos.actitudinales)} }`);
  }
  if (mod.resultadosAprendizaje) {
    const raStr = mod.resultadosAprendizaje
      .map((ra) => {
        const ceStr = ra.criteriosEvaluacion
          .map(
            (ce) =>
              `{ id: ${JSON.stringify(ce.id)}, texto: ${JSON.stringify(ce.texto)} }`
          )
          .join(", ");
        return `{ id: ${JSON.stringify(ra.id)}, texto: ${JSON.stringify(ra.texto)}, criteriosEvaluacion: [${ceStr}] }`;
      })
      .join(", ");
    parts.push(`resultadosAprendizaje: [${raStr}]`);
  }

  return `${parts.join(", ")} }`;
}

main();
