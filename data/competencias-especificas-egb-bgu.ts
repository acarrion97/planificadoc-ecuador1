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
