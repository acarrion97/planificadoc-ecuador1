/**
 * Inserciones Curriculares - Ejes Transversales
 * Fuente: Acuerdo MINEDUC-MINEDUC-2024-00060-A
 * Ministerio de Educación del Ecuador (2025-2026)
 *
 * Solo 5 inserciones oficiales:
 * 1. Educación para el Desarrollo Sostenible
 * 2. Educación Financiera
 * 3. Educación Socioemocional
 * 4. Educación para la Seguridad Vial y Movilidad Sostenible
 * 5. Educación Cívica, Ética e Integridad
 */

import { Area, Subnivel } from "./types";

export interface InsercionCurricular {
  id: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  emoji: string;
  /** English name for EFL subject */
  nameEN: string;
  /** English description for EFL subject */
  descriptionEN: string;
}

export const INSERCIONES_CURRICULARES: InsercionCurricular[] = [
  {
    id: "desarrollo-sostenible",
    nombre: "Educación para el Desarrollo Sostenible",
    nombreCorto: "Desarrollo Sostenible",
    descripcion:
      "Protección del medio ambiente, energía asequible y no contaminante, consumo responsable, cambio climático y biodiversidad.",
    emoji: "🌱",
    nameEN: "Education for Sustainable Development",
    descriptionEN:
      "Environmental protection, affordable and clean energy, responsible consumption, climate change, and biodiversity.",
  },
  {
    id: "financiera",
    nombre: "Educación Financiera",
    nombreCorto: "Educación Financiera",
    descripcion:
      "Finanzas personales, ahorro, presupuesto, emprendimiento, trabajo decente y crecimiento económico responsable.",
    emoji: "💰",
    nameEN: "Financial Education",
    descriptionEN:
      "Personal finance, savings, budgeting, entrepreneurship, decent work, and responsible economic growth.",
  },
  {
    id: "socioemocional",
    nombre: "Educación Socioemocional",
    nombreCorto: "Socioemocional",
    descripcion:
      "Desarrollo de competencias socioemocionales: autoconocimiento, autorregulación, empatía, habilidades sociales y toma de decisiones responsable.",
    emoji: "💚",
    nameEN: "Social-Emotional Education",
    descriptionEN:
      "Development of social-emotional competencies: self-awareness, self-regulation, empathy, social skills, and responsible decision-making.",
  },
  {
    id: "seguridad-vial",
    nombre: "Educación para la Seguridad Vial y Movilidad Sostenible",
    nombreCorto: "Seguridad Vial",
    descripcion:
      "Prevención de accidentes de tránsito, normas de tránsito, movilidad segura y responsable, uso racional del vehículo.",
    emoji: "🚦",
    nameEN: "Road Safety and Sustainable Mobility Education",
    descriptionEN:
      "Traffic accident prevention, traffic regulations, safe and responsible mobility, rational vehicle use.",
  },
  {
    id: "civica-etica",
    nombre: "Educación Cívica, Ética e Integridad",
    nombreCorto: "Cívica y Ética",
    descripcion:
      "Formación en valores éticos y morales, participación democrática, lucha contra la corrupción, derechos y deberes ciudadanos.",
    emoji: "⚖️",
    nameEN: "Civic, Ethics and Integrity Education",
    descriptionEN:
      "Formation in ethical and moral values, democratic participation, anti-corruption, citizen rights and duties.",
  },
];

/**
 * Mapeo de inserciones por asignatura y subnivel.
 * Fuente: Documento oficial "Ejes Transversales" del MinEduc.
 * Clave: "area-subnivel" → lista de IDs de inserciones que aplican.
 */
const INSERCIONES_POR_ASIGNATURA: Record<string, string[]> = {
  // === SUBNIVEL ELEMENTAL (2) ===
  "M-2": ["financiera", "socioemocional", "seguridad-vial"],
  "LL-2": ["seguridad-vial", "civica-etica"],
  "CN-2": ["desarrollo-sostenible", "socioemocional", "seguridad-vial"],
  "CS-2": ["desarrollo-sostenible", "financiera", "seguridad-vial", "civica-etica"],
  "EF-2": ["seguridad-vial", "civica-etica"],
  "ECA-2": ["socioemocional", "seguridad-vial", "civica-etica"],
  "EFL-2": ["seguridad-vial", "civica-etica"],

  // === SUBNIVEL MEDIA (3) ===
  "M-3": ["financiera", "socioemocional", "seguridad-vial"],
  "LL-3": ["financiera", "socioemocional", "seguridad-vial", "civica-etica"],
  "CN-3": ["socioemocional", "seguridad-vial", "civica-etica"],
  "CS-3": ["desarrollo-sostenible", "financiera", "seguridad-vial", "civica-etica"],
  "EF-3": [],
  "ECA-3": ["seguridad-vial", "civica-etica"],
  "EFL-3": ["seguridad-vial", "civica-etica"],

  // === SUBNIVEL SUPERIOR (4) ===
  "M-4": ["desarrollo-sostenible", "financiera", "socioemocional"],
  "LL-4": ["seguridad-vial", "civica-etica"],
  "CN-4": ["desarrollo-sostenible", "socioemocional", "seguridad-vial", "civica-etica"],
  "CS-4": ["desarrollo-sostenible", "financiera", "socioemocional", "seguridad-vial", "civica-etica"],
  "EF-4": [],
  "ECA-4": ["socioemocional", "seguridad-vial", "civica-etica"],
  "EFL-4": ["civica-etica"],

  // === BACHILLERATO (5) ===
  "M-5": ["desarrollo-sostenible", "financiera", "socioemocional"],
  "LL-5": ["financiera", "seguridad-vial", "civica-etica"],
  "CN.B-5": ["desarrollo-sostenible", "financiera", "socioemocional", "seguridad-vial", "civica-etica"],
  "CN.Q-5": ["socioemocional"],
  "CN.F-5": ["socioemocional"],
  "CS.H-5": ["desarrollo-sostenible", "civica-etica"],
  "CS.F-5": ["desarrollo-sostenible", "seguridad-vial", "civica-etica"],
  "EFL-5": ["financiera", "civica-etica"],
  "EG-5": ["financiera", "socioemocional", "civica-etica"],
  "EF-5": ["seguridad-vial", "civica-etica"],
  "ECA-5": ["socioemocional"],
};

/**
 * Obtener las inserciones curriculares que aplican a una asignatura y subnivel específicos.
 * Si no hay mapeo específico, retorna todas las inserciones.
 */
export function obtenerInsercionesPorAsignatura(
  area: Area,
  subnivel: Subnivel
): InsercionCurricular[] {
  const key = `${area}-${subnivel}`;
  const ids = INSERCIONES_POR_ASIGNATURA[key];

  if (!ids || ids.length === 0) {
    // Si no hay mapeo, no mostrar inserciones (no todas aplican a todas las asignaturas)
    return [];
  }

  return INSERCIONES_CURRICULARES.filter((i) => ids.includes(i.id));
}

/**
 * Obtener una inserción curricular por su ID
 */
export function obtenerInsercion(id: string): InsercionCurricular | undefined {
  return INSERCIONES_CURRICULARES.find((i) => i.id === id);
}

/**
 * Obtener el nombre de la inserción (en inglés si es EFL)
 */
export function obtenerNombreInsercion(id: string, isEFL = false): string {
  const insercion = obtenerInsercion(id);
  if (!insercion) return id;
  return isEFL ? insercion.nameEN : insercion.nombre;
}
