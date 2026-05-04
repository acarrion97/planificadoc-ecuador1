/**
 * Inserciones Curriculares - Ejes Transversales
 * Fuente: Ministerio de Educación del Ecuador (2025-2026)
 * https://educacion.gob.ec/inserciones-curriculares/
 *
 * Las inserciones curriculares son competencias de base (destrezas con criterio
 * de desempeño) que se añaden al currículo priorizado con énfasis en competencias,
 * respondiendo a las necesidades del contexto actual.
 */

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
    nombre: "Educación para la Seguridad Vial",
    nombreCorto: "Seguridad Vial",
    descripcion:
      "Prevención de accidentes de tránsito, uso racional del vehículo, normas de tránsito, movilidad segura y responsable.",
    emoji: "🚦",
    nameEN: "Road Safety Education",
    descriptionEN:
      "Traffic accident prevention, rational vehicle use, traffic regulations, safe and responsible mobility.",
  },
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
    id: "interculturalidad",
    nombre: "Interculturalidad",
    nombreCorto: "Interculturalidad",
    descripcion:
      "Respeto a la diversidad cultural, diálogo intercultural, valoración de pueblos y nacionalidades del Ecuador.",
    emoji: "🌍",
    nameEN: "Interculturality",
    descriptionEN:
      "Respect for cultural diversity, intercultural dialogue, appreciation of Ecuador's peoples and nationalities.",
  },
  {
    id: "salud-bienestar",
    nombre: "Educación para la Salud y Bienestar",
    nombreCorto: "Salud y Bienestar",
    descripcion:
      "Hábitos saludables, alimentación nutritiva, actividad física, prevención de enfermedades y salud mental.",
    emoji: "🏥",
    nameEN: "Health and Wellness Education",
    descriptionEN:
      "Healthy habits, nutritious eating, physical activity, disease prevention, and mental health.",
  },
];

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
