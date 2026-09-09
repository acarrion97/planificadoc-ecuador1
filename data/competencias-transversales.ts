/**
 * Catálogo configurable de Competencias Transversales
 * Currículo Priorizado por Competencias — Plan Piloto
 *
 * Regla: El código interno (code) identifica una competencia dentro del
 * catálogo y no debe reutilizarse para representar otra competencia.
 *
 * Los nombres, descripciones y colores son editables desde este archivo.
 * Los códigos (C, M, CD, CS) son inmutables.
 *
 * Estado: Valores iniciales del piloto. No se asumen nombres oficiales
 * hasta contrastar con fuente específica del MINEDUC.
 */

import { SourceTraceability } from "./types-curriculo-competencias";

// ============================================================
// TIPOS
// ============================================================

/** Código fijo de competencia transversal. Inmutable. */
export type CompetenciaTransversalCode = "C" | "M" | "CD" | "CS";

export interface CompetenciaTransversalInfo {
  /** Identificador técnico interno (estable, no reutilizable) */
  id: string;
  /** Código fijo de la competencia. Inmutable. */
  code: CompetenciaTransversalCode;
  /** Nombre editable (configuración institucional) */
  name: string;
  /** Descripción editable */
  description: string;
  /** Emoji representativo */
  emoji: string;
  /** Color de fondo para badges (hex) */
  color: string;
  /** Estado: activa/inactiva */
  active: boolean;
  /** Procedencia documental */
  source?: SourceTraceability;
}

// ============================================================
// CATÁLOGO — VALORES DEL PILOTO
// ============================================================

/**
 * Competencias transversales del piloto.
 *
 * Los nombres son provisionales y se actualizan cuando se disponga
 * de la fuente oficial del MINEDUC.
 */
export const COMPETENCIAS_TRANSVERSALES: CompetenciaTransversalInfo[] = [
  {
    id: "competencia-comunicacional",
    code: "C",
    name: "Competencias Comunicacionales",
    description:
      "Competencia para interpretar y expresar ideas de manera efectiva en diversos contextos y formatos.",
    emoji: "💬",
    color: "#3498DB",
    active: true,
  },
  {
    id: "competencia-matematica",
    code: "M",
    name: "Competencias Matemáticas",
    description:
      "Competencia para interpretar y comunicar información cuantitativa, modelos y procedimientos matemáticos.",
    emoji: "🔢",
    color: "#E74C3C",
    active: true,
  },
  {
    id: "competencia-digital",
    code: "CD",
    name: "Competencias Digitales",
    description:
      "Competencia para utilizar tecnologías digitales de manera segura, crítica y creativa.",
    emoji: "💻",
    color: "#9B59B6",
    active: true,
  },
  {
    id: "competencia-socioemocional",
    code: "CS",
    name: "Competencias Socioemocionales",
    description:
      "Competencia para gestionar emociones, establecer relaciones saludables y tomar decisiones responsables.",
    emoji: "💚",
    color: "#27AE60",
    active: true,
  },
];

// ============================================================
// HELPERS
// ============================================================

/** Devuelve las competencias activas */
export function obtenerCompetenciasActivas(): CompetenciaTransversalInfo[] {
  return COMPETENCIAS_TRANSVERSALES.filter((c) => c.active);
}

/** Busca una competencia por código */
export function buscarCompetenciaPorCodigo(
  code: CompetenciaTransversalCode
): CompetenciaTransversalInfo | undefined {
  return COMPETENCIAS_TRANSVERSALES.find((c) => c.code === code);
}

/** Busca una competencia por ID */
export function buscarCompetenciaPorId(
  id: string
): CompetenciaTransversalInfo | undefined {
  return COMPETENCIAS_TRANSVERSALES.find((c) => c.id === id);
}

/** Devuelve solo los códigos de las competencias activas */
export function codigosCompetenciasActivas(): CompetenciaTransversalCode[] {
  return COMPETENCIAS_TRANSVERSALES.filter((c) => c.active).map((c) => c.code);
}
