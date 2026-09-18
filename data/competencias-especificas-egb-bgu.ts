/**
 * Índice combinado del catálogo de Competencias Específicas — Currículo
 * Integrado para EGB y BGU (Elemental, Media, Superior, Bachillerato).
 *
 * Junta los 7 catálogos por materia (cada uno extraído directamente de su
 * xlsx del MESOCURRICULUM) en una sola lista consultable por código, y
 * expone la agrupación por materia que usa el formulario para el selector
 * de Materia → Nivel → Grado → Competencias.
 */

import type { CompetenciaEspecificaCompleta } from "./types-competencias-especificas";
import type { BloqueCurricularGrado } from "./types-curriculo-competencias";
import { COMPETENCIAS_LENGUA } from "./competencias-especificas-lengua";
import { COMPETENCIAS_MATEMATICA } from "./competencias-especificas-matematica";
import { COMPETENCIAS_CIENCIAS_NATURALES } from "./competencias-especificas-ciencias-naturales";
import { COMPETENCIAS_CIENCIAS_SOCIALES } from "./competencias-especificas-ciencias-sociales";
import { COMPETENCIAS_INGLES } from "./competencias-especificas-ingles";
import { COMPETENCIAS_ECA } from "./competencias-especificas-eca";
import { COMPETENCIAS_EMPRENDIMIENTO } from "./competencias-especificas-emprendimiento";

export interface MateriaCurriculoIntegrado {
  id: string;
  nombre: string;
  competencias: CompetenciaEspecificaCompleta[];
}

export const MATERIAS_EGB_BGU: MateriaCurriculoIntegrado[] = [
  { id: "lengua", nombre: "Lengua y Literatura", competencias: COMPETENCIAS_LENGUA },
  { id: "matematica", nombre: "Matemática", competencias: COMPETENCIAS_MATEMATICA },
  { id: "ciencias-naturales", nombre: "Ciencias Naturales", competencias: COMPETENCIAS_CIENCIAS_NATURALES },
  { id: "ciencias-sociales", nombre: "Ciencias Sociales", competencias: COMPETENCIAS_CIENCIAS_SOCIALES },
  { id: "ingles", nombre: "Inglés", competencias: COMPETENCIAS_INGLES },
  { id: "eca", nombre: "Educación Cultural y Artística", competencias: COMPETENCIAS_ECA },
  { id: "emprendimiento", nombre: "Emprendimiento y Gestión", competencias: COMPETENCIAS_EMPRENDIMIENTO },
];

export function obtenerMateria(id: string): MateriaCurriculoIntegrado | undefined {
  return MATERIAS_EGB_BGU.find((m) => m.id === id);
}

/** Niveles (hojas de la matriz) disponibles para una materia, en un orden pedagógico razonable. */
const ORDEN_NIVELES = [
  "ELEMENTAL", "MEDIA", "SUPERIOR", "BACHILLERATO",
  "BIOLOGÍA", "QUÍMICA", "FÍSICA",
  "HISTORIA Y GEOGRAFÍA", "CIUDADANÍA", "FILOSOFÍA",
];

export function nivelesDeMateria(materiaId: string): string[] {
  const materia = obtenerMateria(materiaId);
  if (!materia) return [];
  const niveles = new Set<string>();
  for (const c of materia.competencias) {
    for (const g of c.porGrado) niveles.add(g.nivel);
  }
  return Array.from(niveles).sort(
    (a, b) => ORDEN_NIVELES.indexOf(a) - ORDEN_NIVELES.indexOf(b)
  );
}

/** Grados disponibles para una materia+nivel, en el orden en que aparecen en la matriz oficial. */
export function gradosDeNivel(materiaId: string, nivel: string): string[] {
  const materia = obtenerMateria(materiaId);
  if (!materia) return [];
  const grados: string[] = [];
  for (const c of materia.competencias) {
    for (const g of c.porGrado) {
      if (g.nivel === nivel && !grados.includes(g.grado)) grados.push(g.grado);
    }
  }
  return grados;
}

/** Competencias de una materia que tienen desagregación para el nivel+grado indicados. */
export function competenciasDeGrado(
  materiaId: string,
  nivel: string,
  grado: string
): CompetenciaEspecificaCompleta[] {
  const materia = obtenerMateria(materiaId);
  if (!materia) return [];
  return materia.competencias.filter((c) =>
    c.porGrado.some((g) => g.nivel === nivel && g.grado === grado)
  );
}

/** Busca una competencia específica por código en todas las materias EGB/BGU. */
export function buscarCompetenciaEspecificaEGBBGU(
  codigo: string
): CompetenciaEspecificaCompleta | undefined {
  for (const materia of MATERIAS_EGB_BGU) {
    const found = materia.competencias.find((c) => c.codigo === codigo);
    if (found) return found;
  }
  return undefined;
}

/** Busca una competencia específica por código dentro de una materia concreta. */
function buscarCEEnMateria(
  materiaId: string,
  ceCodigo: string
): CompetenciaEspecificaCompleta | undefined {
  const materia = obtenerMateria(materiaId);
  return materia?.competencias.find((c) => c.codigo === ceCodigo);
}

/**
 * Valida si una Competencia Específica está disponible (tiene desagregación
 * en `porGrado`) para TODOS los grados indicados. Se usa para bloquear, en
 * planificación multigrado, la selección de una CE que no cubra alguno de
 * los grados combinados.
 */
export function ceDisponibleParaGrados(
  materiaId: string,
  ceCodigo: string,
  grados: string[]
): { valido: boolean; gradosNoCubiertos: string[] } {
  const ce = buscarCEEnMateria(materiaId, ceCodigo);
  if (!ce) return { valido: false, gradosNoCubiertos: [...grados] };
  const gradosCubiertos = new Set(ce.porGrado.map((g) => g.grado));
  const gradosNoCubiertos = grados.filter((g) => !gradosCubiertos.has(g));
  return { valido: gradosNoCubiertos.length === 0, gradosNoCubiertos };
}

/**
 * Resuelve, para cada grado indicado, el bloque curricular (indicadores +
 * saberes declarativos/procedimentales/actitudinales) que el catálogo tiene
 * para esa Competencia Específica y ese grado. Devuelve una copia de los
 * datos del catálogo (no una referencia viva): quien la reciba puede editarla
 * sin afectar el catálogo, y el catálogo puede cambiar después sin afectar
 * una copia ya guardada.
 *
 * Un grado que la CE no cubre (ver `ceDisponibleParaGrados`) simplemente no
 * aparece en el resultado; se espera que el llamador valide la cobertura
 * antes de resolver.
 */
export function resolverBloquePorGrado(
  materiaId: string,
  ceCodigo: string,
  grados: string[]
): Record<string, BloqueCurricularGrado> {
  const ce = buscarCEEnMateria(materiaId, ceCodigo);
  const resultado: Record<string, BloqueCurricularGrado> = {};
  if (!ce) return resultado;

  for (const grado of grados) {
    const entry = ce.porGrado.find((g) => g.grado === grado);
    if (!entry) continue;
    resultado[grado] = {
      indicadores: entry.indicadores.map((i) => `${i.codigo}. ${i.texto}`),
      declarativos: [...entry.saberes.declarativos],
      procedimentales: [...entry.saberes.procedimentales],
      actitudinales: [...entry.saberes.actitudinales],
    };
  }

  return resultado;
}

/**
 * Igual que `resolverBloquePorGrado`, pero para VARIAS Competencias
 * Específicas a la vez: para cada grado, fusiona (concatena, sin duplicados
 * exactos) los indicadores y saberes de todas las CE que cubran ese grado,
 * en vez de quedarse solo con la primera. Se usa en planificación
 * multigrado, donde el docente puede elegir más de una CE para un mismo
 * grupo de grados y el documento final debe desarrollar el contenido de
 * todas — no solo mencionarlas y desarrollar una.
 *
 * Una CE que no cubre un grado dado simplemente no aporta nada a ese grado
 * (igual que en `resolverBloquePorGrado`); se espera que el llamador valide
 * la cobertura de cada CE con `ceDisponibleParaGrados` antes de fusionar.
 */
export function fusionarBloquesPorGrado(
  materiaId: string,
  ceCodigos: string[],
  grados: string[]
): Record<string, BloqueCurricularGrado> {
  const resultado: Record<string, BloqueCurricularGrado> = {};

  for (const grado of grados) {
    const indicadores: string[] = [];
    const declarativos: string[] = [];
    const procedimentales: string[] = [];
    const actitudinales: string[] = [];

    for (const ceCodigo of ceCodigos) {
      const bloque = resolverBloquePorGrado(materiaId, ceCodigo, [grado])[grado];
      if (!bloque) continue;
      indicadores.push(...bloque.indicadores);
      declarativos.push(...bloque.declarativos);
      procedimentales.push(...bloque.procedimentales);
      actitudinales.push(...bloque.actitudinales);
    }

    resultado[grado] = {
      indicadores: Array.from(new Set(indicadores)),
      declarativos: Array.from(new Set(declarativos)),
      procedimentales: Array.from(new Set(procedimentales)),
      actitudinales: Array.from(new Set(actitudinales)),
    };
  }

  return resultado;
}
