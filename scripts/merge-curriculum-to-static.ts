/**
 * Enriquecer data/bachillerato-tecnico.ts con RA/CE del seed curricular.
 * Enfoque: inserción precisa línea por línea.
 */
import * as fs from "fs";
import * as path from "path";
import { BT_CURRICULUM_SEED } from "../data/bt-curriculum-seed";
import type { ModuloCurricularSeed, ResultadoAprendizajeSeed } from "../data/bt-curriculum-seed";

const SEED_TO_STATIC: Record<string, string> = {
  CLI: "CL", AFDR: "AF", CMA: "CM", GFC: "GF", MRH: "RH",
  CPA: "PA", ECLI: "AP", ELEC: "GA", EMA: "EI", ME: "EA",
  MI: "MC", PAS: "CA", PDC: "PC", IEA: "IE", SOP: "SIN",
  HAC: "HC", GDC: "GD", API: "PI", AESC: "AE", MUS: "MU",
  GADS: "GAL", GAL: "GAL", GP: "GP", APL: "APL", DM: "DM",
  DG: "DG", FM: "FM", OC: "OC", CD: "CD", DS: "DS",
  RT: "RT", SI: "SI", SC: "SC", GT: "GT",
};

function main() {
  console.log("=== Merge v4 ===\n");

  // Indexar seed
  const seedMap = new Map<string, { seed: ModuloCurricularSeed; prefix: string }>();
  for (const fig of BT_CURRICULUM_SEED) {
    const sp = SEED_TO_STATIC[fig.figuraCodigo] || fig.figuraCodigo;
    for (const mod of fig.modulos) {
      seedMap.set(mod.codigo.replace(fig.figuraCodigo, sp), { seed: mod, prefix: fig.figuraCodigo });
    }
  }
  console.log(`Seed: ${seedMap.size} modules`);

  const filePath = path.resolve(__dirname, "../data/bachillerato-tecnico.ts");
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  const out: string[] = [];
  let enriched = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar línea con código de módulo
    const m = line.match(/codigo:\s*"([A-Z0-9]+\.\d+\.\d+)"/);
    if (!m) { out.push(line); continue; }

    const code = m[1];
    const data = seedMap.get(code);
    if (!data) { out.push(line); continue; }

    // Verificar si ya tiene RA o estadoCatalogo
    let hasExisting = false;
    for (let j = i + 1; j < Math.min(i + 60, lines.length); j++) {
      if (lines[j].includes("resultadosAprendizaje") || lines[j].includes("estadoCatalogo")) {
        hasExisting = true;
        break;
      }
      if (lines[j].match(/codigo:\s*"[A-Z0-9]+\.\d+\.\d+"/)) break;
    }
    if (hasExisting) { out.push(line); continue; }

    // Insertar línea actual
    out.push(line);

    // Determinar si el módulo es de una sola línea o múltiples
    // Si la línea tiene `{` y `}` es de una sola línea
    const hasOpenBrace = line.includes("{");
    const hasCloseBrace = line.includes("}");
    
    if (hasOpenBrace && hasCloseBrace) {
      // Módulo de una sola línea: insertar extras antes del `}`
      // Ejemplo: { codigo: "GAL.1.1", nombre: "...", anio: 1 },
      // Necesitamos: { codigo: "GAL.1.1", nombre: "...", anio: 1, <extras> },
      // Reemplazar la línea actual
      out.pop(); // Quitar la línea original
      
      // Encontrar la posición del último `}` antes de la coma
      const lastBrace = line.lastIndexOf("}");
      const before = line.slice(0, lastBrace);
      const after = line.slice(lastBrace);
      
      // Generar extras como string compacto
      const extrasCompact = genExtrasCompact(data.seed, data.prefix);
      out.push(before + extrasCompact + after);
    } else {
      // Módulo multi-línea: buscar el cierre
      let depth = hasOpenBrace ? 1 : 0;
      let endLine = i;
      for (let j = i + 1; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }
        if (depth === 0) { endLine = j; break; }
      }
      
      // Copiar hasta la línea de cierre
      for (let j = i + 1; j < endLine; j++) out.push(lines[j]);
      
      // Insertar extras antes de la línea de cierre
      const extras = genExtras(data.seed, data.prefix);
      for (const ex of extras) out.push(ex);
      
      // Copiar la línea de cierre
      if (endLine > i) out.push(lines[endLine]);
      
      i = endLine;
    }

    enriched++;
  }

  fs.writeFileSync(filePath, out.join("\n"), "utf-8");
  console.log(`Enriched: ${enriched}`);

  const content = out.join("\n");
  const raCount = (content.match(/resultadosAprendizaje/g) || []).length;
  const compCount = (content.match(/estadoCatalogo:\s*"completo"/g) || []).length;
  const pendCount = (content.match(/estadoCatalogo:\s*"pendiente"/g) || []).length;
  console.log(`RA: ${raCount}, completo: ${compCount}, pendiente: ${pendCount}`);
}

function genExtras(mod: ModuloCurricularSeed, prefix: string): string[] {
  const L: string[] = [];
  const cat = mod.tipo === "generico" ? "generico" : mod.tipo === "especializacion" ? "especializacion" : "practico";
  L.push(`        categoria: "${cat}",`);
  L.push(`        estadoCatalogo: "completo",`);
  if (mod.nivel) L.push(`        nivel: ${JSON.stringify(mod.nivel)},`);
  if (mod.cargaHoraria.anio1 || mod.cargaHoraria.anio2 || mod.cargaHoraria.anio3) {
    const p: string[] = [];
    if (mod.cargaHoraria.anio1) p.push(`1: ${mod.cargaHoraria.anio1}`);
    if (mod.cargaHoraria.anio2) p.push(`2: ${mod.cargaHoraria.anio2}`);
    if (mod.cargaHoraria.anio3) p.push(`3: ${mod.cargaHoraria.anio3}`);
    L.push(`        duracionPeriodos: { ${p.join(", ")} },`);
  }
  if (mod.objetivoModulo) L.push(`        objetivoModulo: ${JSON.stringify(mod.objetivoModulo)},`);
  if (mod.perfilDocente) L.push(`        perfilDocente: ${JSON.stringify(mod.perfilDocente)},`);
  if (mod.orientacionesMetodologicas) {
    const items = mod.orientacionesMetodologicas.split(/[,;]\s*/).map(s => s.trim()).filter(s => s.length > 5);
    L.push(`        orientacionesMetodologicas: ${JSON.stringify(items)},`);
  }
  if (mod.contenidos.length > 0) {
    const c = mod.contenidos.filter(x => x.tipo === "conceptual").map(x => x.descripcion);
    const p = mod.contenidos.filter(x => x.tipo === "procedimental").map(x => x.descripcion);
    const a = mod.contenidos.filter(x => x.tipo === "actitudinal").map(x => x.descripcion);
    L.push(`        contenidos: { conceptuales: ${JSON.stringify(c)}, procedimentales: ${JSON.stringify(p)}, actitudinales: ${JSON.stringify(a)} },`);
  }
  if (mod.resultadosAprendizaje.length > 0) {
    L.push(`        resultadosAprendizaje: [`);
    for (const ra of mod.resultadosAprendizaje) {
      const raId = `${prefix}-RA.${ra.codigo.replace("RA", "")}`;
      const ceStr = ra.criterios.map(ce => {
        const ceId = `${prefix}-CE${ce.codigo.replace("CE", "")}`;
        return `{ id: "${ceId}", texto: ${JSON.stringify(`${ce.codigo}: ${ce.descripcion}`)} }`;
      }).join(", ");
      L.push(`          { id: "${raId}", texto: ${JSON.stringify(`${ra.codigo}: ${ra.descripcion}`)}, criteriosEvaluacion: [${ceStr}] },`);
    }
    L.push(`        ],`);
  }
  return L;
}

function genExtrasCompact(mod: ModuloCurricularSeed, prefix: string): string {
  const parts: string[] = [];
  const cat = mod.tipo === "generico" ? "generico" : mod.tipo === "especializacion" ? "especializacion" : "practico";
  parts.push(`categoria: "${cat}"`);
  parts.push(`estadoCatalogo: "completo"`);
  if (mod.nivel) parts.push(`nivel: ${JSON.stringify(mod.nivel)}`);
  if (mod.objetivoModulo) parts.push(`objetivoModulo: ${JSON.stringify(mod.objetivoModulo)}`);
  if (mod.resultadosAprendizaje.length > 0) {
    const raArr = mod.resultadosAprendizaje.map(ra => {
      const raId = `${prefix}-RA.${ra.codigo.replace("RA", "")}`;
      const ceArr = ra.criterios.map(ce => {
        const ceId = `${prefix}-CE${ce.codigo.replace("CE", "")}`;
        return `{id:"${ceId}",texto:${JSON.stringify(`${ce.codigo}: ${ce.descripcion}`)}}`;
      });
      return `{id:"${raId}",texto:${JSON.stringify(`${ra.codigo}: ${ra.descripcion}`)},criteriosEvaluacion:[${ceArr.join(",")}]}`;
    });
    parts.push(`resultadosAprendizaje:[${raArr.join(",")}]`);
  }
  return ", " + parts.join(", ");
}

main();
