/**
 * Catálogo de Estrategias Metodológicas — Plan Piloto
 *
 * Las estrategias definen CÓMO se organiza la actividad didáctica,
 * no QUÉ se enseña. La estrategia no modifica la estructura curricular.
 *
 * Estado: Valores iniciales del piloto. ERCA se usa como default
 * para EGB/BGU pero NO se declara como "estrategia oficial MINEDUC".
 */

import { SourceTraceability } from "./types-curriculo-competencias";

// ============================================================
// TIPOS
// ============================================================

/** Familia educativa a la que aplica la estrategia */
export type EstrategiaFamily = "egb_bgu" | "inicial_preparatoria" | "general";

/** Fase de una estrategia metodológica */
export interface FaseEstrategia {
  id: string;
  name: string;
  defaultDuration: number; // minutos
  order: number;
}

/** Estrategia metodológica completa */
export interface EstrategiaMetodologica {
  id: string;
  name: string;
  description: string;
  phases: FaseEstrategia[];
  /** Si el usuario puede ajustar tiempos/orden */
  configurable: boolean;
  /** Familia educativa a la que aplica */
  family: EstrategiaFamily;
  /** Procedencia documental */
  source?: SourceTraceability;
}

// ============================================================
// CATÁLOGO — VALORES DEL PILOTO
// ============================================================

/**
 * Estrategias metodológicas del piloto.
 *
 * ERCA se usa como default para EGB/BGU, pero no se declara como
 * "estrategia oficial MINEDUC" sin fuente que lo establezca.
 */
export const ESTRATEGIAS_MODOLOGICAS: EstrategiaMetodologica[] = [
  {
    id: "erca",
    name: "ERCA",
    description:
      "Estrategia didáctica de 45 minutos: Experiencia (10 min) → Reflexión (10 min) → Conceptualización (15 min) → Aplicación (10 min).",
    phases: [
      { id: "experiencia", name: "Experiencia", defaultDuration: 10, order: 1 },
      {
        id: "reflexion",
        name: "Reflexión",
        defaultDuration: 10,
        order: 2,
      },
      {
        id: "conceptualizacion",
        name: "Conceptualización",
        defaultDuration: 15,
        order: 3,
      },
      {
        id: "aplicacion",
        name: "Aplicación",
        defaultDuration: 10,
        order: 4,
      },
    ],
    configurable: false,
    family: "egb_bgu",
  },
  {
    id: "idc",
    name: "INICIO / DESARROLLO / CIERRE",
    description:
      "Estrategia de 3 momentos para experiencias de aprendizaje en Educación Inicial y Preparatoria.",
    phases: [
      { id: "inicio", name: "INICIO", defaultDuration: 0, order: 1 },
      { id: "desarrollo", name: "DESARROLLO", defaultDuration: 0, order: 2 },
      { id: "cierre", name: "CIERRE", defaultDuration: 0, order: 3 },
    ],
    configurable: true,
    family: "inicial_preparatoria",
  },
];

// ============================================================
// HELPERS
// ============================================================

/** Devuelve las estrategias para una familia educativa */
export function estrategiasPorFamilia(
  family: EstrategiaFamily
): EstrategiaMetodologica[] {
  return ESTRATEGIAS_MODOLOGICAS.filter(
    (e) => e.family === family || e.family === "general"
  );
}

/** Busca una estrategia por ID */
export function buscarEstrategiaPorId(
  id: string
): EstrategiaMetodologica | undefined {
  return ESTRATEGIAS_MODOLOGICAS.find((e) => e.id === id);
}

/** Devuelve la estrategia default para una familia */
export function estrategiaDefault(
  family: EstrategiaFamily
): EstrategiaMetodologica | undefined {
  if (family === "egb_bgu") return buscarEstrategiaPorId("erca");
  if (family === "inicial_preparatoria") return buscarEstrategiaPorId("idc");
  return undefined;
}
