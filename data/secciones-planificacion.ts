/**
 * Secciones de la Planificación Microcurricular Semanal
 * Fuente: Formato real de docentes ecuatorianos (2025-2026)
 *
 * Incluye:
 * - Competencias (4 opciones)
 * - Metodologías Activas (10 opciones)
 * - Técnicas e Instrumentos de Evaluación (15 opciones)
 * - Estilos de Aprendizaje (4 opciones)
 */

// ============================================================
// COMPETENCIAS
// ============================================================

export interface Competencia {
  id: string;
  nombre: string;
  nombreCorto: string;
  emoji: string;
  nameEN: string;
}

export const COMPETENCIAS: Competencia[] = [
  {
    id: "matematica",
    nombre: "Competencias Matemáticas",
    nombreCorto: "CM",
    emoji: "🔢",
    nameEN: "Mathematical Competencies",
  },
  {
    id: "comunicacional",
    nombre: "Competencias Comunicacionales",
    nombreCorto: "C",
    emoji: "💬",
    nameEN: "Communication Competencies",
  },
  {
    id: "digital",
    nombre: "Competencias Digitales",
    nombreCorto: "CD",
    emoji: "💻",
    nameEN: "Digital Competencies",
  },
  {
    id: "socioemocional",
    nombre: "Competencias Socioemocionales",
    nombreCorto: "CS",
    emoji: "💚",
    nameEN: "Social-Emotional Competencies",
  },
];

// ============================================================
// METODOLOGÍAS ACTIVAS
// ============================================================

export interface MetodologiaActiva {
  id: string;
  nombre: string;
  nameEN: string;
}

export const METODOLOGIAS_ACTIVAS: MetodologiaActiva[] = [
  {
    id: "contextualizado",
    nombre: "Aprendizaje Contextualizado",
    nameEN: "Contextualized Learning",
  },
  {
    id: "reflexivo",
    nombre: "Aprendizaje Reflexivo",
    nameEN: "Reflective Learning",
  },
  {
    id: "descubrimiento",
    nombre: "Aprendizaje por Descubrimiento",
    nameEN: "Discovery Learning",
  },
  {
    id: "juego",
    nombre: "Aprendizaje Basado en el Juego",
    nameEN: "Game-Based Learning",
  },
  {
    id: "experiencia",
    nombre: "Aprendizaje Basado en la Experiencia",
    nameEN: "Experience-Based Learning",
  },
  {
    id: "cooperativo",
    nombre: "Aprendizaje Cooperativo",
    nameEN: "Cooperative Learning",
  },
  {
    id: "colaborativo",
    nombre: "Aprendizaje Colaborativo",
    nameEN: "Collaborative Learning",
  },
  {
    id: "proyectos",
    nombre: "Aprendizaje Basado en Proyectos",
    nameEN: "Project-Based Learning",
  },
  {
    id: "indagacion",
    nombre: "Aprendizaje Basado en la Indagación",
    nameEN: "Inquiry-Based Learning",
  },
  {
    id: "situado",
    nombre: "Aprendizaje Situado",
    nameEN: "Situated Learning",
  },
];

// ============================================================
// TÉCNICAS E INSTRUMENTOS DE EVALUACIÓN
// ============================================================

export interface TecnicaEvaluacion {
  id: string;
  nombre: string;
  nameEN: string;
}

export const TECNICAS_EVALUACION: TecnicaEvaluacion[] = [
  {
    id: "cuestionario",
    nombre: "Cuestionario",
    nameEN: "Questionnaire",
  },
  {
    id: "rubrica",
    nombre: "Rúbrica",
    nameEN: "Rubric",
  },
  {
    id: "entrevista",
    nombre: "Entrevista",
    nameEN: "Interview",
  },
  {
    id: "encuesta",
    nombre: "Encuesta",
    nameEN: "Survey",
  },
  {
    id: "lista-cotejo",
    nombre: "Lista de Cotejo",
    nameEN: "Checklist",
  },
  {
    id: "lista-control",
    nombre: "Lista de Control",
    nameEN: "Control List",
  },
  {
    id: "grupo-focal",
    nombre: "Grupo Focal",
    nameEN: "Focus Group",
  },
  {
    id: "observacion",
    nombre: "Observación",
    nameEN: "Observation",
  },
  {
    id: "debate",
    nombre: "Debate",
    nameEN: "Debate",
  },
  {
    id: "mesa-redonda",
    nombre: "Mesa Redonda",
    nameEN: "Round Table",
  },
  {
    id: "foro",
    nombre: "Foro",
    nameEN: "Forum",
  },
  {
    id: "exposicion",
    nombre: "Exposición",
    nameEN: "Presentation",
  },
  {
    id: "actividad-experiencial",
    nombre: "Actividad Experiencial",
    nameEN: "Experiential Activity",
  },
  {
    id: "resolucion-problemas",
    nombre: "Resolución de Situaciones Problemáticas",
    nameEN: "Problem-Solving Activities",
  },
  {
    id: "cuaderno-campo",
    nombre: "Cuaderno de Campo",
    nameEN: "Field Notebook",
  },
];

// ============================================================
// ESTILOS DE APRENDIZAJE
// ============================================================

export interface EstiloAprendizaje {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  nameEN: string;
  descriptionEN: string;
}

export const ESTILOS_APRENDIZAJE: EstiloAprendizaje[] = [
  {
    id: "visual",
    nombre: "Visual",
    descripcion: "Diagramas, gráficas, colores, textos, esquemas, etc.",
    emoji: "👁️",
    nameEN: "Visual",
    descriptionEN: "Diagrams, graphics, colors, texts, schemes, etc.",
  },
  {
    id: "auditivo",
    nombre: "Auditivo",
    descripcion: "Debates, discusiones, seminarios, música, narraciones, etc.",
    emoji: "👂",
    nameEN: "Auditory",
    descriptionEN: "Debates, discussions, seminars, music, narrations, etc.",
  },
  {
    id: "lector-escritor",
    nombre: "Lector-Escritor",
    descripcion: "Libros, textos, lecturas, toma de notas, ensayos, resúmenes, etc.",
    emoji: "📖",
    nameEN: "Read/Write",
    descriptionEN: "Books, texts, readings, note-taking, essays, summaries, etc.",
  },
  {
    id: "kinestesico",
    nombre: "Kinestésico",
    descripcion: "Demostraciones, actividades físicas, juegos de roles, etc.",
    emoji: "🤸",
    nameEN: "Kinesthetic",
    descriptionEN: "Demonstrations, physical activities, role-playing, etc.",
  },
];
