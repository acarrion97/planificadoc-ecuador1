/**
 * Taxonomía de Marzano - Verbos organizados por nivel cognitivo
 * y mapeados a las etapas ERCA del ciclo de aprendizaje.
 *
 * 6 Niveles de procesamiento (de menor a mayor complejidad):
 * 1. Recuperación: Reconocer, recordar, ejecutar
 * 2. Comprensión: Integrar, simbolizar, representar
 * 3. Análisis: Comparar, clasificar, analizar errores, generalizar, especificar
 * 4. Utilización del conocimiento: Investigar, experimentar, resolver, tomar decisiones
 * 5. Metacognición: Evaluar, reflexionar, monitorear, planificar
 * 6. Autorregulación: Examinar, motivar, regular, establecer metas
 *
 * Mapeo a ERCA:
 * - Experiencia → Recuperación + Comprensión (activar conocimientos previos)
 * - Reflexión → Análisis + Metacognición (cuestionar y analizar)
 * - Conceptualización → Comprensión + Análisis (construir conocimiento formal)
 * - Aplicación → Utilización del conocimiento + Metacognición (transferir y aplicar)
 */

export interface NivelMarzano {
  id: string;
  nombre: string;
  nombreEN: string;
  descripcion: string;
  verbos: string[];
  verbosEN: string[];
}

export const NIVELES_MARZANO: NivelMarzano[] = [
  {
    id: "recuperacion",
    nombre: "Recuperación",
    nombreEN: "Retrieval",
    descripcion: "Reconocer y recordar información básica",
    verbos: [
      "Reconocer", "Recordar", "Identificar", "Nombrar", "Listar",
      "Describir", "Localizar", "Ejecutar", "Seleccionar", "Reproducir",
    ],
    verbosEN: [
      "Recognize", "Recall", "Identify", "Name", "List",
      "Describe", "Locate", "Execute", "Select", "Reproduce",
    ],
  },
  {
    id: "comprension",
    nombre: "Comprensión",
    nombreEN: "Comprehension",
    descripcion: "Integrar y representar el conocimiento",
    verbos: [
      "Integrar", "Representar", "Explicar", "Resumir", "Interpretar",
      "Parafrasear", "Simbolizar", "Traducir", "Ilustrar", "Predecir",
    ],
    verbosEN: [
      "Integrate", "Represent", "Explain", "Summarize", "Interpret",
      "Paraphrase", "Symbolize", "Translate", "Illustrate", "Predict",
    ],
  },
  {
    id: "analisis",
    nombre: "Análisis",
    nombreEN: "Analysis",
    descripcion: "Comparar, clasificar y analizar información",
    verbos: [
      "Comparar", "Clasificar", "Analizar", "Diferenciar", "Categorizar",
      "Generalizar", "Especificar", "Deducir", "Contrastar", "Organizar",
    ],
    verbosEN: [
      "Compare", "Classify", "Analyze", "Differentiate", "Categorize",
      "Generalize", "Specify", "Deduce", "Contrast", "Organize",
    ],
  },
  {
    id: "utilizacion",
    nombre: "Utilización del conocimiento",
    nombreEN: "Knowledge Utilization",
    descripcion: "Aplicar el conocimiento en situaciones nuevas",
    verbos: [
      "Investigar", "Experimentar", "Resolver", "Aplicar", "Diseñar",
      "Construir", "Producir", "Crear", "Proponer", "Demostrar",
    ],
    verbosEN: [
      "Investigate", "Experiment", "Solve", "Apply", "Design",
      "Construct", "Produce", "Create", "Propose", "Demonstrate",
    ],
  },
  {
    id: "metacognicion",
    nombre: "Metacognición",
    nombreEN: "Metacognition",
    descripcion: "Evaluar y reflexionar sobre el propio aprendizaje",
    verbos: [
      "Evaluar", "Reflexionar", "Monitorear", "Planificar", "Verificar",
      "Autoevaluar", "Justificar", "Argumentar", "Valorar", "Revisar",
    ],
    verbosEN: [
      "Evaluate", "Reflect", "Monitor", "Plan", "Verify",
      "Self-assess", "Justify", "Argue", "Appraise", "Review",
    ],
  },
  {
    id: "autorregulacion",
    nombre: "Autorregulación",
    nombreEN: "Self-regulation",
    descripcion: "Regular la motivación y el comportamiento propio",
    verbos: [
      "Examinar", "Motivar", "Regular", "Establecer metas", "Adaptar",
      "Persistir", "Comprometerse", "Autodirigir", "Gestionar", "Priorizar",
    ],
    verbosEN: [
      "Examine", "Motivate", "Regulate", "Set goals", "Adapt",
      "Persist", "Commit", "Self-direct", "Manage", "Prioritize",
    ],
  },
];

/**
 * Mapeo de etapas ERCA a niveles de Marzano recomendados.
 * Cada etapa usa verbos de los niveles indicados.
 */
export interface MapeoERCAMarzano {
  etapa: string;
  etapaEN: string;
  nivelesRecomendados: string[];
  descripcionUso: string;
  descripcionUsoEN: string;
}

export const MAPEO_ERCA_MARZANO: MapeoERCAMarzano[] = [
  {
    etapa: "Experiencia",
    etapaEN: "Experience",
    nivelesRecomendados: ["recuperacion", "comprension"],
    descripcionUso: "Activar conocimientos previos, reconocer, identificar, describir experiencias",
    descripcionUsoEN: "Activate prior knowledge, recognize, identify, describe experiences",
  },
  {
    etapa: "Reflexión",
    etapaEN: "Reflection",
    nivelesRecomendados: ["analisis", "metacognicion"],
    descripcionUso: "Comparar, analizar, reflexionar, evaluar la experiencia vivida",
    descripcionUsoEN: "Compare, analyze, reflect, evaluate the lived experience",
  },
  {
    etapa: "Conceptualización",
    etapaEN: "Conceptualization",
    nivelesRecomendados: ["comprension", "analisis"],
    descripcionUso: "Explicar, integrar, clasificar, organizar el conocimiento formal",
    descripcionUsoEN: "Explain, integrate, classify, organize formal knowledge",
  },
  {
    etapa: "Aplicación",
    etapaEN: "Application",
    nivelesRecomendados: ["utilizacion", "metacognicion"],
    descripcionUso: "Resolver, aplicar, diseñar, evaluar la transferencia del aprendizaje",
    descripcionUsoEN: "Solve, apply, design, evaluate learning transfer",
  },
];

/**
 * Obtiene los verbos recomendados para una etapa ERCA específica.
 */
export function obtenerVerbosParaEtapa(etapa: "experiencia" | "reflexion" | "conceptualizacion" | "aplicacion", isEFL = false): string[] {
  const mapeo = MAPEO_ERCA_MARZANO.find(
    (m) => m.etapa.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === etapa
  );
  if (!mapeo) return [];

  const verbos: string[] = [];
  for (const nivelId of mapeo.nivelesRecomendados) {
    const nivel = NIVELES_MARZANO.find((n) => n.id === nivelId);
    if (nivel) {
      verbos.push(...(isEFL ? nivel.verbosEN : nivel.verbos));
    }
  }
  return verbos;
}

/**
 * Genera texto descriptivo de los verbos de Marzano para incluir en prompts de IA.
 */
export function generarTextoVerbosParaPrompt(isEFL = false): string {
  if (isEFL) {
    return `MANDATORY - Use Marzano's Taxonomy verbs for each ERCA stage:
- EXPERIENCE: Use RETRIEVAL and COMPREHENSION verbs → ${obtenerVerbosParaEtapa("experiencia", true).slice(0, 8).join(", ")}
- REFLECTION: Use ANALYSIS and METACOGNITION verbs → ${obtenerVerbosParaEtapa("reflexion", true).slice(0, 8).join(", ")}
- CONCEPTUALIZATION: Use COMPREHENSION and ANALYSIS verbs → ${obtenerVerbosParaEtapa("conceptualizacion", true).slice(0, 8).join(", ")}
- APPLICATION: Use KNOWLEDGE UTILIZATION and METACOGNITION verbs → ${obtenerVerbosParaEtapa("aplicacion", true).slice(0, 8).join(", ")}

Each activity MUST start with one of these verbs. NEVER use generic infinitives like "Do", "Make", "Work".`;
  }

  return `OBLIGATORIO - Usar verbos de la Taxonomía de Marzano para cada etapa ERCA:
- EXPERIENCIA: Usar verbos de RECUPERACIÓN y COMPRENSIÓN → ${obtenerVerbosParaEtapa("experiencia").slice(0, 8).join(", ")}
- REFLEXIÓN: Usar verbos de ANÁLISIS y METACOGNICIÓN → ${obtenerVerbosParaEtapa("reflexion").slice(0, 8).join(", ")}
- CONCEPTUALIZACIÓN: Usar verbos de COMPRENSIÓN y ANÁLISIS → ${obtenerVerbosParaEtapa("conceptualizacion").slice(0, 8).join(", ")}
- APLICACIÓN: Usar verbos de UTILIZACIÓN DEL CONOCIMIENTO y METACOGNICIÓN → ${obtenerVerbosParaEtapa("aplicacion").slice(0, 8).join(", ")}

Cada actividad DEBE iniciar con uno de estos verbos. NUNCA usar infinitivos genéricos como "Realizar", "Hacer", "Trabajar".`;
}
