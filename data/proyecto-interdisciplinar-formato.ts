/**
 * Constantes del FORMATO OFICIAL "Proyecto Interdisciplinar para la
 * Evaluación Sumativa" (MinEduc Ecuador) — el documento de referencia que
 * replica `lib/proyecto-interdisciplinar-word-generator.ts` y
 * `lib/proyecto-interdisciplinar-pdf-generator.ts`.
 *
 * Fuente: formato oficial del proyecto interdisciplinar (5 fases, tabla
 * Fase/Pregunta orientadora/Resultado, rúbrica disciplinar 4–3–2–1 sobre 20
 * puntos y rúbrica interdisciplinar sobre 24 puntos, con calificación final
 * = promedio entre la nota disciplinar y la del producto interdisciplinar).
 */
import type { FaseProyecto, CriterioRubrica, RubricaProyecto } from "./types-proyecto-interdisciplinar";

// ============================================================
// FASES OFICIALES (5)
// ============================================================

export interface FaseOficial {
  key: FaseProyecto;
  /** Etiqueta completa de la fila, tal como aparece en el formato oficial. */
  label: string;
  /** Nombre corto para tablas compactas / UI. */
  corto: string;
  preguntaOrientadora: string;
  resultado: string;
}

export const FASES_OFICIALES: FaseOficial[] = [
  {
    key: "planificacion",
    label: "1. Planificación",
    corto: "Planificación",
    preguntaOrientadora: "¿Qué vamos a investigar y para qué?",
    resultado: "Propósito, desafío y preguntas",
  },
  {
    key: "organizacion",
    label: "2. Organización, investigación (asignación de roles)",
    corto: "Organización e investigación",
    preguntaOrientadora: "¿Cómo vamos a hacerlo?",
    resultado: "Plan de trabajo",
  },
  {
    key: "ejecucion",
    label: "3. Ejecución e integración de saberes para la creación del producto",
    corto: "Ejecución e integración de saberes",
    preguntaOrientadora: "¿Cómo resolvemos el desafío?",
    resultado: "Producto + evidencias",
  },
  {
    key: "socializacion",
    label: "4. Socialización, presentación y difusión",
    corto: "Socialización y difusión",
    preguntaOrientadora: "¿Qué descubrimos y cómo lo comunicamos?",
    resultado: "Presentación del producto",
  },
  {
    key: "evaluacion",
    label: "5. Evaluación, reflexión y metacognición",
    corto: "Evaluación y metacognición",
    preguntaOrientadora: "¿Qué aprendimos y qué podemos mejorar?",
    resultado: "Metacognición y compromisos",
  },
];

/** Orden canónico de las 5 fases oficiales. */
export const FASES_KEYS: FaseProyecto[] = FASES_OFICIALES.map((f) => f.key);

const FASES_SET = new Set<string>(FASES_KEYS);

/**
 * Normaliza una fase guardada (proyectos antiguos usaban 3 fases:
 * planificacion/gestion/evaluacion) a la fase oficial correspondiente.
 * "gestion" → "organizacion" (era la fase de organización e investigación).
 */
export function normalizarFase(fase: string): FaseProyecto {
  if (FASES_SET.has(fase)) return fase as FaseProyecto;
  if (fase === "gestion") return "organizacion";
  return "planificacion";
}

export function esFaseValida(fase: string): boolean {
  return FASES_SET.has(fase) || fase === "gestion";
}

/** Datos de una fase oficial por su clave (o undefined si no existe). */
export function faseOficial(key: FaseProyecto): FaseOficial | undefined {
  return FASES_OFICIALES.find((f) => f.key === key);
}

// ============================================================
// RÚBRICAS POR DEFECTO (FORMATO OFICIAL)
// ============================================================

/**
 * Rúbrica disciplinar de ejemplo del formato oficial (5 criterios de
 * "recopilar/organizar/representar/interpretar/usar datos"), generalizada
 * para que sirva a cualquier asignatura. Es una plantilla editable: el
 * docente puede ajustarla o reemplazarla por la de su asignatura.
 */
export function rubricaDisciplinarPorDefecto(titulo = "Disciplina"): RubricaProyecto {
  return {
    titulo,
    criterios: [
      {
        criterio: "Recopila y registra la información",
        nivel4: "Registra de manera completa y ordenada la información obtenida, sin alterarla.",
        nivel3: "Registra correctamente la mayoría de la información obtenida.",
        nivel2: "Registra la información de manera parcial o presenta algunas inconsistencias.",
        nivel1: "Requiere acompañamiento para registrar la información obtenida.",
      },
      {
        criterio: "Organiza la información",
        nivel4: "Organiza correctamente todos los datos en una tabla u organizador y facilita su lectura y comparación.",
        nivel3: "Organiza correctamente la mayoría de los datos.",
        nivel2: "Organiza parcialmente los datos y presenta errores que dificultan su lectura.",
        nivel1: "Requiere apoyo para organizar los datos.",
      },
      {
        criterio: "Representa gráficamente la información",
        nivel4: "Representa correctamente los datos y utiliza de manera adecuada título, categorías y valores.",
        nivel3: "Representa los datos de forma comprensible con pocos errores.",
        nivel2: "La representación contiene varios errores o elementos incompletos.",
        nivel1: "Requiere acompañamiento para construir la representación gráfica.",
      },
      {
        criterio: "Interpreta los resultados",
        nivel4: "Compara los datos e identifica correctamente dos o más hallazgos relevantes.",
        nivel3: "Identifica al menos un hallazgo correcto a partir de los datos.",
        nivel2: "Realiza interpretaciones parciales o poco relacionadas con los datos.",
        nivel1: "Presenta conclusiones que no se sustentan todavía en los datos obtenidos.",
      },
      {
        criterio: "Utiliza los resultados para responder al desafío",
        nivel4: "Utiliza los resultados para justificar claramente una acción o recomendación coherente con el desafío.",
        nivel3: "Propone una acción o recomendación relacionada con los resultados obtenidos.",
        nivel2: "Propone una acción, pero establece una relación poco clara con los datos.",
        nivel1: "Requiere apoyo para relacionar los resultados con una propuesta.",
      },
    ],
  };
}

/**
 * Rúbrica interdisciplinar del formato oficial (6 criterios globales
 * comunes a todas las asignaturas — es común para el producto final, no
 * una por área).
 */
export function rubricaInterdisciplinarPorDefecto(): RubricaProyecto {
  return {
    titulo: "Producto final interdisciplinar",
    criterios: [
      {
        criterio: "Integración de aprendizajes",
        nivel4: "El producto integra de manera clara y coherente aprendizajes de varias asignaturas para comprender la problemática.",
        nivel3: "El producto relaciona aprendizajes de varias asignaturas de manera adecuada.",
        nivel2: "Se observan aportes de distintas asignaturas, pero aparecen poco relacionados entre sí.",
        nivel1: "Los aportes aparecen aislados y todavía no evidencian integración.",
      },
      {
        criterio: "Respuesta al desafío",
        nivel4: "Las propuestas responden claramente al desafío y están sustentadas en los datos e información investigados.",
        nivel3: "Las propuestas responden al desafío y se relacionan con los principales hallazgos.",
        nivel2: "Las propuestas responden parcialmente al desafío o presentan poca relación con la investigación.",
        nivel1: "Las propuestas no responden claramente al desafío planteado.",
      },
      {
        criterio: "Uso de evidencias",
        nivel4: "Utiliza datos, textos, observaciones y otras evidencias del proyecto para explicar y justificar sus conclusiones.",
        nivel3: "Utiliza evidencias pertinentes para sustentar la mayoría de sus conclusiones.",
        nivel2: "Utiliza algunas evidencias, pero no siempre las relaciona con sus conclusiones.",
        nivel1: "Presenta conclusiones sin utilizar suficientemente las evidencias recogidas.",
      },
      {
        criterio: "Comunicación del producto",
        nivel4: "Comunica los hallazgos y propuestas de manera clara, organizada y comprensible, utilizando adecuadamente recursos escritos, gráficos, visuales u orales.",
        nivel3: "Comunica de manera clara los principales hallazgos y propuestas.",
        nivel2: "La comunicación presenta dificultades de organización o claridad.",
        nivel1: "Requiere acompañamiento para comunicar los principales hallazgos del proyecto.",
      },
      {
        criterio: "Creatividad y pertinencia de las propuestas",
        nivel4: "Presenta acciones creativas, realistas y posibles de aplicar en la vida cotidiana de los estudiantes.",
        nivel3: "Presenta acciones pertinentes y posibles de aplicar.",
        nivel2: "Presenta acciones generales o poco contextualizadas.",
        nivel1: "Las acciones propuestas son poco viables o no guardan relación suficiente con la problemática.",
      },
      {
        criterio: "Trabajo colaborativo",
        nivel4: "Todos los integrantes participan, asumen responsabilidades, escuchan y contribuyen al producto común.",
        nivel3: "La mayoría participa y cumple las responsabilidades acordadas.",
        nivel2: "La participación y distribución de responsabilidades es desigual.",
        nivel1: "El equipo requiere acompañamiento constante para organizarse y trabajar conjuntamente.",
      },
    ],
  };
}

/** Puntaje máximo de una rúbrica: 4 puntos por criterio. */
export function puntajeMaximoRubrica(rubrica: RubricaProyecto): number {
  return rubrica.criterios.length * 4;
}

/** Criterios vacíos para empezar una rúbrica desde cero. */
export function criterioRubricaVacio(): CriterioRubrica {
  return { criterio: "", nivel4: "", nivel3: "", nivel2: "", nivel1: "" };
}
