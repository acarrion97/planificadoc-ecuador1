/**
 * Catálogo configurable de Ámbitos de Desarrollo — Inicial / Preparatoria
 * Plan Piloto
 *
 * Los ámbitos de desarrollo organizan el currículo de Inicial y Preparatoria.
 * Son independientes de las áreas tradicionales de EGB/BGU.
 *
 * Estado: Valores iniciales del piloto. La lista exacta de ámbitos
 * oficiales está pendiente de validación con fuente del MINEDUC.
 */

import { SourceTraceability } from "./types-curriculo-competencias";
import { CompetenciaTransversalCode } from "./competencias-transversales";

// ============================================================
// TIPOS
// ============================================================

export interface AmbitoDesarrolloInfo {
  id: string;
  nombre: string;
  descripcion: string;
  /** Competencias transversales típicamente asociadas */
  competenciasTipicas: CompetenciaTransversalCode[];
  /** Emoji representativo */
  emoji: string;
  /** Estado */
  active: boolean;
  source?: SourceTraceability;
}

// ============================================================
// CATÁLOGO — VALORES DEL PILOTO
// ============================================================

/**
 * Ámbitos de desarrollo para Inicial/Preparatoria.
 *
 * La lista es provisional y se actualiza cuando se disponga
 * de la fuente oficial del MINEDUC.
 */
export const AMBITOS_DESARROLLO_INICIAL: AmbitoDesarrolloInfo[] = [
  {
    id: "identidad-autonomia",
    nombre: "Identidad y Autonomía",
    descripcion:
      "Desarrollo de la identidad personal, autoconocimiento y autonomía en las actividades cotidianas.",
    competenciasTipicas: ["CS", "C"],
    emoji: "🧑",
    active: true,
  },
  {
    id: "convivencia",
    nombre: "Convivencia",
    descripcion:
      "Habilidades para la interacción social, resolución de conflictos y trabajo colaborativo.",
    competenciasTipicas: ["CS", "C"],
    emoji: "🤝",
    active: true,
  },
  {
    id: "relaciones-logico-matematicas",
    nombre: "Relaciones Lógico-Matemáticas",
    descripcion:
      "Comprensión de conceptos matemáticos básicos, patrones, secuencias y resolución de problemas.",
    competenciasTipicas: ["M", "CD"],
    emoji: "🔢",
    active: true,
  },
  {
    id: "comprension-expresion-lenguaje",
    nombre: "Comprensión y Expresión del Lenguaje",
    descripcion:
      "Desarrollo de habilidades comunicativas orales y escritas, comprensión lectora y expresión.",
    competenciasTipicas: ["C", "CD"],
    emoji: "💬",
    active: true,
  },
  {
    id: "expresion-artistica",
    nombre: "Expresión Artística",
    descripcion:
      "Exploración y creación artística a través de diversas manifestaciones culturales y artísticas.",
    competenciasTipicas: ["C", "CS"],
    emoji: "🎨",
    active: true,
  },
  {
    id: "expresion-corporal",
    nombre: "Expresión Corporal",
    descripcion:
      "Desarrollo de habilidades motrices, expresión corporal y conciencia del cuerpo en movimiento.",
    competenciasTipicas: ["CS"],
    emoji: "🤸",
    active: true,
  },
  {
    id: "comprension-mundo-real-simbolico",
    nombre: "Comprensión del Mundo Real y Simbólico",
    descripcion:
      "Exploración del entorno natural y social, comprensión de símbolos y representaciones.",
    competenciasTipicas: ["M", "C", "CD"],
    emoji: "🌍",
    active: true,
  },
];

// ============================================================
// HELPERS
// ============================================================

/** Devuelve los ámbitos activos */
export function obtenerAmbitosActivos(): AmbitoDesarrolloInfo[] {
  return AMBITOS_DESARROLLO_INICIAL.filter((a) => a.active);
}

/** Busca un ámbito por ID */
export function buscarAmbitoPorId(
  id: string
): AmbitoDesarrolloInfo | undefined {
  return AMBITOS_DESARROLLO_INICIAL.find((a) => a.id === id);
}
