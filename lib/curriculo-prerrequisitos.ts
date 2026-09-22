import { TODAS_LAS_DESTREZAS } from "../data";
import type { Area, Subnivel } from "../data/types";
import {
  esBachilleratoTecnico,
  subnivelDelGradoAnterior,
  subnivelDesdeGrado,
} from "./evaluacion-utils";

/**
 * Resolución del "subnivel prerrequisito" para el módulo de Evaluación
 * Diagnóstica (ver design.md D10).
 *
 * Una evaluación diagnóstica mide lo que el estudiante *debería traer*, por lo
 * que las DCD relevantes suelen pertenecer a un subnivel anterior al del curso.
 * El prerrequisito NO puede calcularse como `subnivel - 1`, porque el catálogo
 * ecuatoriano no ofrece todas las áreas en todos los subniveles:
 *
 *   - Las áreas de Bachillerato (CN.F, CN.Q, CN.B, CS.H, CS.F, CS.EC) solo
 *     existen en subnivel 5; su prerrequisito es el área "madre" en subnivel 4
 *     (Física → Ciencias Naturales, Ciudadanía → Estudios Sociales).
 *   - Preparatoria (subnivel 1) no tiene áreas separadas: es currículo
 *     integrado (CAI). Cualquier área de Básica Elemental arrastra de CAI@1.
 *   - Emprendimiento y Gestión (EG) solo existe en Bachillerato y no tiene
 *     predecesor en el catálogo.
 *
 * Criterio del módulo ante ausencia de resolución: se informa, no se sustituye.
 * Por eso esta función devuelve `null` en vez de proponer un área "parecida".
 */

export interface PrerrequisitoCurricular {
  area: Area;
  subnivel: Subnivel;
}

/** Subnivel del currículo integrado de Preparatoria */
const SUBNIVEL_PREPARATORIA: Subnivel = 1;
const AREA_PREPARATORIA: Area = "CAI";

/**
 * Pares (área, subnivel) con al menos una destreza en el catálogo.
 * Se construye una sola vez; el resolvedor se llama en render.
 */
const PARES_CON_DESTREZAS: ReadonlySet<string> = (() => {
  const set = new Set<string>();
  for (const d of TODAS_LAS_DESTREZAS) {
    set.add(`${d.area}|${d.subnivel}`);
  }
  return set;
})();

/** Indica si el catálogo tiene destrezas para ese par (área, subnivel). */
export function existeAreaSubnivel(area: Area, subnivel: Subnivel): boolean {
  return PARES_CON_DESTREZAS.has(`${area}|${subnivel}`);
}

/**
 * Área "madre" de un área derivada de Bachillerato: la jerarquía ya está
 * codificada en el propio código de área con un punto (CN.F → CN, CS.EC → CS).
 * Devuelve null si el área no es derivada.
 */
function areaMadre(area: Area): Area | null {
  const punto = area.lastIndexOf(".");
  if (punto <= 0) return null;
  return area.slice(0, punto) as Area;
}

/**
 * Resuelve el subnivel prerrequisito de un curso.
 *
 * Devuelve `null` cuando no existe un prerrequisito definido en el catálogo:
 * la UI debe informarlo y ofrecer solo el subnivel del curso, sin proponer
 * áreas sustitutas.
 */
export function resolverPrerrequisito(
  area: Area,
  subnivel: Subnivel
): PrerrequisitoCurricular | null {
  // Inicial y Preparatoria no tienen un nivel previo dentro del alcance del
  // módulo: no hay diagnóstico de arrastre que ofrecer.
  if (subnivel <= SUBNIVEL_PREPARATORIA) return null;

  const candidato = candidatoPrerrequisito(area, subnivel);
  if (!candidato) return null;

  // El candidato solo es válido si el catálogo realmente lo cubre. Esta
  // comprobación es la que hace que EG@5 devuelva null sin necesidad de una
  // excepción escrita a mano: EG no existe en subnivel 4.
  return existeAreaSubnivel(candidato.area, candidato.subnivel)
    ? candidato
    : null;
}

function candidatoPrerrequisito(
  area: Area,
  subnivel: Subnivel
): PrerrequisitoCurricular | null {
  // Básica Elemental arrastra del currículo integrado de Preparatoria,
  // cualquiera sea el área: el subnivel 1 no ofrece áreas separadas.
  if (subnivel === 2) {
    return { area: AREA_PREPARATORIA, subnivel: SUBNIVEL_PREPARATORIA };
  }

  const anterior = (subnivel - 1) as Subnivel;

  // Áreas derivadas de Bachillerato: bajan al área madre.
  const madre = areaMadre(area);
  if (madre) return { area: madre, subnivel: anterior };

  return { area, subnivel: anterior };
}

/**
 * Resuelve el subnivel prerrequisito de un curso a partir del **grado** (no del
 * subnivel), para que el diagnóstico mida lo que el estudiante cursó el año
 * anterior (ej: 6.° EGB diagnostica destrezas de 5.° EGB, no `subnivel - 1`).
 *
 * Solo devuelve un par distinto del subnivel actual del curso (invariante): si
 * el grado anterior comparte subnivel con el curso, devuelve `null` y el
 * diagnóstico se apoya en las destrezas del subnivel del curso. Devuelve `null`
 * también cuando no existe un grado anterior dentro del alcance o cuando el área
 * no tiene predecesor en el catálogo (se informa, no se sustituye).
 */
export function resolverPrerrequisitoPorGrado(
  area: Area,
  grado: string
): PrerrequisitoCurricular | null {
  // La modalidad BT se diagnostica por módulos técnicos (fuera del alcance de
  // esta resolución): se conserva el comportamiento de resolverPrerrequisito.
  if (esBachilleratoTecnico(grado)) {
    return resolverPrerrequisito(area, 5);
  }

  const subnivelCurso = subnivelDesdeGrado(grado);
  if (subnivelCurso === null) return null;
  // Inicial y Preparatoria no tienen un nivel previo dentro del alcance.
  if (subnivelCurso <= SUBNIVEL_PREPARATORIA) return null;

  const subnivelAnterior = subnivelDelGradoAnterior(grado);
  if (subnivelAnterior === null) return null;

  // Invariante: nunca devolver el mismo par que el subnivel del curso. Cuando el
  // grado anterior comparte subnivel, el diagnóstico usa el subnivel del curso.
  if (subnivelAnterior === subnivelCurso) return null;

  const candidato = candidatoPrerrequisitoPorSubnivel(area, subnivelAnterior);
  if (!candidato) return null;

  return existeAreaSubnivel(candidato.area, candidato.subnivel)
    ? candidato
    : null;
}

/**
 * Resuelve el área a usar en un subnivel objetivo ya calculado (el del grado
 * anterior). A diferencia de `candidatoPrerrequisito` (que recibe el subnivel
 * del curso y baja uno), aquí el subnivel es el destino final: Preparatoria se
 * detecta cuando el objetivo es el subnivel 1, y las áreas derivadas bajan a su
 * madre en ese mismo subnivel.
 */
function candidatoPrerrequisitoPorSubnivel(
  area: Area,
  subnivelObjetivo: Subnivel
): PrerrequisitoCurricular | null {
  // Preparatoria es currículo integrado: cualquier área arrastra de CAI.
  if (subnivelObjetivo === SUBNIVEL_PREPARATORIA) {
    return { area: AREA_PREPARATORIA, subnivel: SUBNIVEL_PREPARATORIA };
  }

  // Áreas derivadas de Bachillerato: bajan al área madre en el mismo subnivel.
  const madre = areaMadre(area);
  if (madre) return { area: madre, subnivel: subnivelObjetivo };

  return { area, subnivel: subnivelObjetivo };
}

/**
 * Calibración de técnicas/instrumentos de evaluación diagnóstica por subnivel
 * curricular real (no por grado individual: 2°, 3° y 4° EGB comparten
 * subnivel Elemental y la misma calibración).
 *
 * Fuente: "Caja de herramientas para evaluación diagnóstica" (Ministerio de
 * Educación del Ecuador, DINCU/DNEE, 2020) — Tabla 3 (lectura por subnivel,
 * pág. 16), Tabla 4 (escritura por subnivel, pág. 18), Tablas 5-7
 * (matemática por subnivel, págs. 23-25), y sección "Proceso de evaluación
 * en Educación Inicial y Preparatoria" (pág. 29-31, fichas de
 * entrevista/anecdotario/lista de cotejo para los subniveles más tempranos).
 *
 * Deliberadamente NO cubre Bachillerato Técnico: ese caso se calibra por
 * Figura Profesional/módulo real (ver `contextoBT` en `server/cnc-router.ts`),
 * nunca por esta tabla ni por una heurística de edad/grado de EGB.
 */
export interface CalibracionInstrumentoCNC {
  subnivel: Subnivel;
  /** Técnicas sugeridas por el MinEduc para este subnivel (observación, entrevista, prueba escrita...) */
  tecnicas: string[];
  /** Instrumentos sugeridos (lista de cotejo, rúbrica, escala, cuestionario...) */
  instrumentos: string[];
  /** Cuándo/cómo aplican apoyos visuales (pictogramas, imágenes) en este subnivel — null si la fuente no los distingue para ese nivel */
  apoyoVisual: string | null;
  fuente: string;
}

const FUENTE_CAJA_HERRAMIENTAS = "Caja de herramientas para evaluación diagnóstica (MinEduc, DINCU/DNEE, 2020)";

const CALIBRACION_INSTRUMENTO_POR_SUBNIVEL: Partial<Record<Subnivel, CalibracionInstrumentoCNC>> = {
  [-1]: {
    subnivel: -1,
    tecnicas: ["observación directa", "entrevista a la familia (ficha de entrevista)"],
    instrumentos: ["anecdotario", "lista de cotejo"],
    apoyoVisual: "instrumentos eminentemente observacionales/orales, no escritos — cualquier apoyo es visual/manipulativo por defecto",
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, sección "Proceso de evaluación en Educación Inicial y Preparatoria" (pág. 29-31)`,
  },
  1: {
    subnivel: 1,
    tecnicas: ["observación directa", "entrevista a la familia (ficha de entrevista)"],
    instrumentos: ["anecdotario", "lista de cotejo"],
    apoyoVisual: "instrumentos eminentemente observacionales/orales, no escritos — cualquier apoyo es visual/manipulativo por defecto",
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, sección "Proceso de evaluación en Educación Inicial y Preparatoria" (pág. 29-31)`,
  },
  2: {
    subnivel: 2,
    tecnicas: [
      "observación (p. ej. dramatizaciones)",
      "entrevistas (p. ej. parafraseo)",
      "prueba escrita breve: lectura de imágenes",
      "identificación de elementos explícitos (personajes, escenarios, acciones, objetos)",
      "prueba de expresión corta (p. ej. escribir una tarjeta de invitación, un mensaje corto)",
    ],
    instrumentos: ["lista de cotejo", "registro anecdótico", "escalas numéricas/gráficas/descriptivas", "rúbrica", "cuestionarios"],
    apoyoVisual: "en Matemática, la formación de conceptos se evalúa \"utilizando pictogramas y gráficos\" (Tabla 5) — usar apoyo visual/pictográfico cuando la destreza lo permita, no solo texto",
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, Tabla 3 (lectura, pág. 16), Tabla 4 (escritura, pág. 18), Tabla 5 (matemática, pág. 23)`,
  },
  3: {
    subnivel: 3,
    tecnicas: [
      "observación durante lectura exegética/comentada",
      "entrevistas sobre el tema de una lectura",
      "prueba escrita: análisis de paratextos, la palabra clave, preguntas intercaladas",
      "escritura de textos breves con propósito (carta, receta, cuento, fábula, poema)",
    ],
    instrumentos: ["cuestionarios", "lista de cotejo", "registro anecdótico", "escalas", "rúbrica", "gamificación"],
    apoyoVisual: null,
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, Tabla 3 (lectura, pág. 16), Tabla 4 (escritura, pág. 18), Tabla 6 (matemática, pág. 24)`,
  },
  4: {
    subnivel: 4,
    tecnicas: [
      "observación, entrevista",
      "prueba escrita: subrayado, notas al margen, resúmenes, esquemas, mapas conceptuales",
      "escritura de resumen/noticia/crónica/carta al editor",
    ],
    instrumentos: ["cuestionarios", "lista de cotejo", "registro anecdótico", "escalas", "rúbrica", "gamificación"],
    apoyoVisual: null,
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, Tabla 3 (lectura, pág. 16), Tabla 4 (escritura, pág. 18), Tabla 7 (matemática, pág. 25)`,
  },
  5: {
    subnivel: 5,
    tecnicas: [
      "observación, entrevista",
      "prueba escrita: subrayado, notas al margen, resúmenes, esquemas, mapas conceptuales",
      "reescritura de textos literarios, ensayo, informe, artículo de opinión",
    ],
    instrumentos: ["cuestionarios", "lista de cotejo", "registro anecdótico", "escalas", "rúbrica", "gamificación"],
    apoyoVisual: null,
    fuente: `${FUENTE_CAJA_HERRAMIENTAS}, Tabla 3 (lectura, pág. 16), Tabla 4 (escritura, pág. 18), Tabla 7 (matemática, pág. 25)`,
  },
};

/**
 * Devuelve la calibración curricular de técnicas/instrumentos apropiados para
 * el subnivel dado, o `null` si el subnivel no está cubierto por la fuente
 * (p. ej. subnivel 0, sin uso conocido en el catálogo).
 *
 * NO aplica a Bachillerato Técnico: ese caso usa `contextoBT` en
 * `server/cnc-router.ts` (Figura Profesional/módulo real), nunca esta tabla.
 */
export function calibracionInstrumentoPorSubnivel(
  subnivel: Subnivel
): CalibracionInstrumentoCNC | null {
  return CALIBRACION_INSTRUMENTO_POR_SUBNIVEL[subnivel] ?? null;
}

/**
 * Arma el bloque de texto a inyectar en el prompt de IA con la calibración
 * curricular de un subnivel, listo para pegar antes de pedirle a la IA que
 * proponga actividades/instrumento de diagnóstico. Devuelve `null` si el
 * subnivel no tiene calibración conocida (el prompt debe omitir la sección).
 */
export function textoCalibracionInstrumento(subnivel: Subnivel): string | null {
  const c = calibracionInstrumentoPorSubnivel(subnivel);
  if (!c) return null;
  return [
    `Técnicas apropiadas para este subnivel: ${c.tecnicas.join("; ")}.`,
    `Instrumentos apropiados: ${c.instrumentos.join(", ")}.`,
    c.apoyoVisual ? `Apoyo visual: ${c.apoyoVisual}.` : null,
    `(Fuente: ${c.fuente})`,
  ].filter(Boolean).join("\n");
}

/**
 * Estrategias metodológicas lúdicas sugeridas por subnivel para la Semana 1
 * "Conecta" de CNC, de modo que la metodología declarada no sea genérica sino
 * anclada a ejemplos reales del documento oficial vigente.
 *
 * Fuente: Lineamientos Pedagógicos Costa-Galápagos 2026-2027 (Ministerio de
 * Educación, Deporte y Cultura), sección 2 "Orientaciones pedagógicas y
 * curriculares" — 2.3 Educación Inicial (pág. 16), 2.4 Preparatoria (pág. 17),
 * 2.5 Elemental (pág. 17-18), 2.6 Media (pág. 18), 2.7 Superior (pág. 19),
 * 2.8 Bachillerato (pág. 19). Es la MISMA fuente primaria que documenta la
 * estrategia "Conecta, nivela y crea" (sección 2.1, pág. 12-15) que este
 * módulo implementa — no una fuente distinta.
 *
 * Estas son EJEMPLOS que la fuente ofrece como sugerencia ("se proponen
 * algunas estrategias"), no una lista cerrada: el docente conserva autonomía
 * para declarar otra metodología coherente con el nivel y el propósito.
 */
export interface EstrategiasMetodologicasCNC {
  subnivel: Subnivel;
  ejemplos: string[];
  fuente: string;
}

const FUENTE_LINEAMIENTOS_2026_2027 = "Lineamientos Pedagógicos Costa-Galápagos 2026-2027 (MinEduc)";

const ESTRATEGIAS_METODOLOGICAS_POR_SUBNIVEL: Partial<Record<Subnivel, EstrategiasMetodologicasCNC>> = {
  [-1]: {
    subnivel: -1,
    ejemplos: ["metodología de juego-trabajo", "experiencias de aprendizaje significativas y contextualizadas", "estrategias de juego, lectura, naturaleza y arte"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.3 "Educación Inicial" (pág. 16)`,
  },
  1: {
    subnivel: 1,
    ejemplos: ["juegos de roles y dramatizaciones", "cuentos y lectura interactiva", "juegos de construcción", "actividades artísticas", "canciones y rimas", "juegos al aire libre", "exploración y experimentación"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.4 "Preparatoria" (pág. 17)`,
  },
  2: {
    subnivel: 2,
    ejemplos: ["círculo de lectura", "teatro de cuentos", "caza de palabras", "club de libros", "lectura en pareja", "biblioteca de aula"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.5 "Educación Básica, subnivel Elemental" (pág. 17-18)`,
  },
  3: {
    subnivel: 3,
    ejemplos: ["juegos matemáticos (bingo, rompecabezas)", "proyectos de medición", "matemáticas en la cocina", "creación de blogs", "juegos educativos en línea", "teatro de lectores", "club de lectura"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.6 "Educación Básica, subnivel Media" (pág. 18)`,
  },
  4: {
    subnivel: 4,
    ejemplos: ["juegos de estrategia (ajedrez, damas, cartas)", "juegos de roles", "teatro de lectores", "actividades de cooperación", "club de lectura"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.7 "Educación Básica, subnivel Superior" (pág. 19)`,
  },
  5: {
    subnivel: 5,
    ejemplos: ["enfoque dinámico e interdisciplinario centrado en competencias clave (comunicación efectiva, pensamiento lógico-matemático, herramientas digitales, habilidades socioemocionales)"],
    fuente: `${FUENTE_LINEAMIENTOS_2026_2027}, sección 2.8 "Bachillerato" (pág. 19)`,
  },
};

/**
 * Devuelve ejemplos de estrategias metodológicas sugeridas por el MinEduc
 * para el subnivel dado, o `null` si no está cubierto. NO aplica a
 * Bachillerato Técnico (usa `contextoBT`, no esta tabla).
 */
export function estrategiasMetodologicasPorSubnivel(
  subnivel: Subnivel
): EstrategiasMetodologicasCNC | null {
  return ESTRATEGIAS_METODOLOGICAS_POR_SUBNIVEL[subnivel] ?? null;
}

// ─── Herramientas oficiales de evaluación diagnóstica (2026) ─────────────────

/**
 * Las CUATRO herramientas que el MinEduc sugiere para el diseño de la
 * evaluación diagnóstica, con sus reglas de diseño.
 *
 * Fuente: "Herramientas sugeridas para la evaluación diagnóstica" (Ministerio
 * de Educación, Deporte y Cultura del Ecuador, 2026) — secciones 1 a 4.
 *
 * Complementa (no reemplaza) la calibración por subnivel de la "Caja de
 * herramientas" 2020 de más arriba: aquella dice QUÉ técnica/instrumento es
 * apropiado para cada subnivel; ésta dice CÓMO debe diseñarse el instrumento
 * para que sea diagnóstico y no una prueba de memorización.
 *
 * A diferencia de la calibración por subnivel, este bloque aplica a TODOS los
 * niveles y ofertas, incluido Bachillerato Técnico.
 */
export interface HerramientaDiagnosticaOficial {
  nombre: string;
  /** Para qué sirve, según la fuente */
  proposito: string;
  /** Reglas de diseño que la fuente exige para esta herramienta */
  reglas: string[];
}

export const FUENTE_HERRAMIENTAS_DIAGNOSTICAS =
  "Herramientas sugeridas para la evaluación diagnóstica (MinEduc, 2026)";

/**
 * Etapas del sistema cognitivo de la taxonomía de Marzano que la fuente exige
 * considerar al plantear preguntas de diagnóstico abiertas (sección 1).
 */
export const ETAPAS_MARZANO_DIAGNOSTICO = [
  "recuperación del conocimiento",
  "comprensión",
  "análisis",
  "utilización del conocimiento (aplicación)",
  "metacognición",
] as const;

/**
 * Escala de valoración CUALITATIVA de la rúbrica de evaluación diagnóstica.
 *
 * Fuente: "Herramientas sugeridas para la evaluación diagnóstica" (MinEduc,
 * 2026), sección 2 "Rúbricas cualitativas" —
 * rúbrica de ejemplo de cuarto grado.
 *
 * NO confundir con `NIVELES_DESEMPENO_RUBRICA` (data/types-cnc.ts), que es la
 * escala 10-1 de la rúbrica del proyecto interdisciplinar de las Semanas 4-5.
 * La evaluación diagnóstica es cualitativa por definición ("valoración de
 * manera cualitativa del estado de desarrollo de los aprendizajes"), por lo
 * que no lleva rangos numéricos.
 */
export const ESCALA_VALORACION_DIAGNOSTICA = [
  "Inicial",
  "En desarrollo",
  "Alcanzado",
  "Destacado",
] as const;

export const HERRAMIENTAS_DIAGNOSTICAS_OFICIALES: HerramientaDiagnosticaOficial[] = [
  {
    nombre: "Preguntas de diagnóstico abiertas",
    proposito:
      "identificar los conocimientos y habilidades con los que ya cuenta el estudiantado sobre una temática",
    reglas: [
      `recorre las etapas del sistema cognitivo de la taxonomía de Marzano: ${ETAPAS_MARZANO_DIAGNOSTICO.join(", ")}`,
      "el error frecuente que debe evitarse es quedarse SOLO en recuperación del conocimiento o memorización (preguntas literales del tipo \"¿qué es X?\")",
      "trasciende la memorización SIN usar lenguaje complejo para el estudiantado",
      "cada pregunta parte de una situación concreta e imaginable antes de pedir la respuesta",
      "incluye siempre al menos una pregunta de metacognición, en todos los subniveles y niveles",
    ],
  },
  {
    nombre: "Rúbrica cualitativa",
    proposito:
      "valorar el progreso frente a aprendizajes previos que son prerrequisito para avanzar",
    reglas: [
      "es una matriz de criterios (indicadores de evaluación reales) por niveles de logro",
      `escala de valoración cualitativa: ${ESCALA_VALORACION_DIAGNOSTICA.join(" / ")} (sin rangos numéricos: el diagnóstico es cualitativo)`,
      "cada celda describe conductas observables, no adjetivos sueltos",
      "se aplica DESPUÉS de una actividad lúdico-pedagógica que active el aprendizaje previo (p. ej. estaciones rotativas), durante la cual el o la docente observa y hace preguntas exploratorias",
      "puede aplicarse de forma grupal o individual",
    ],
  },
  {
    nombre: "Lista de cotejo",
    proposito:
      "verificar si el estudiantado ha interiorizado una o varias temáticas y habilidades ya aprendidas",
    reglas: [
      "formato de tres columnas: Indicadores de evaluación | Sí | No | Observaciones",
      "los criterios son indicadores de evaluación REALES de las destrezas vinculadas con los objetivos de aprendizaje del nuevo año escolar",
      "se aplica luego de un insumo detonante (video educativo, historia, cuento, conversatorio) sobre la temática a evaluar",
      "sirve tanto para valoración individual como grupal",
    ],
  },
  {
    nombre: "Prueba objetiva",
    proposito: "recoger evidencia uniforme de conocimientos previos en un tiempo determinado",
    reglas: [
      "debe cumplir cuatro características: objetividad (criterios de corrección claros y uniformes), validez (evalúa los aprendizajes previstos), confiabilidad (resultados consistentes) e intencionalidad (responde a un propósito evaluativo definido)",
      "cada ítem parte de un PLANTEAMIENTO o situación previa (texto, imagen o caso) que el estudiantado lee y analiza antes de responder",
      "agrupa ítems de distinto formato: formato simple (selección simple), ordenamiento, completamiento y emparejamiento",
      "prioriza la recuperación del conocimiento y su comprensión (los niveles superiores se exploran mejor con preguntas abiertas)",
      "el o la docente DEBE retroalimentar los resultados para promover la metacognición, en el aula o de forma descriptiva en la misma prueba",
    ],
  },
];

/**
 * Énfasis cognitivo que la fuente ejemplifica para cada subnivel/nivel
 * (sección 1, ejemplo "Ley de la conservación de la energía"). Solo se
 * registran los subniveles que la fuente nombra explícitamente: para los
 * demás no se inventa un énfasis, se aplica únicamente la regla general
 * (trascender la memorización + metacognición en todos los niveles).
 */
const ENFASIS_MARZANO_POR_SUBNIVEL: Partial<Record<Subnivel, string>> = {
  2: "recuperación del conocimiento y comprensión",
  4: "análisis (comparar y contrastar)",
  5: "utilización del conocimiento (aplicación a un problema real)",
};

/** Énfasis cognitivo ejemplificado por la fuente para ese subnivel, o `null`. */
export function enfasisMarzanoPorSubnivel(subnivel: Subnivel): string | null {
  return ENFASIS_MARZANO_POR_SUBNIVEL[subnivel] ?? null;
}

/**
 * Bloque de texto con las cuatro herramientas oficiales y sus reglas de
 * diseño, listo para inyectar en un prompt de IA. A diferencia de
 * `textoCalibracionInstrumento`, NO depende del subnivel y nunca devuelve
 * `null`: la fuente aplica a todos los niveles y ofertas.
 *
 * `subnivel` es opcional y solo agrega el énfasis cognitivo que la fuente
 * ejemplifica para ese subnivel, si lo nombra.
 */
export function textoHerramientasDiagnosticasOficiales(subnivel?: Subnivel | null): string {
  const enfasis = subnivel != null ? enfasisMarzanoPorSubnivel(subnivel) : null;
  return [
    "HERRAMIENTAS OFICIALES PARA LA EVALUACIÓN DIAGNÓSTICA (aplican a todos los niveles y ofertas):",
    "La evaluación diagnóstica valora de manera CUALITATIVA el estado de desarrollo de los aprendizajes al inicio del proceso, previo al abordaje curricular del curso. Debe usar herramientas no tradicionales que superen la mera recuperación de conocimientos por memorización.",
    ...HERRAMIENTAS_DIAGNOSTICAS_OFICIALES.map(
      (h) => `- ${h.nombre} — ${h.proposito}:\n${h.reglas.map((r) => `    · ${r}`).join("\n")}`
    ),
    enfasis
      ? `Énfasis cognitivo ejemplificado por la fuente para este subnivel: ${enfasis}. La metacognición se pregunta en TODOS los subniveles y niveles.`
      : "La fuente no ejemplifica un énfasis cognitivo para este subnivel: aplica la regla general (trascender la memorización y preguntar siempre metacognición).",
    `(Fuente: ${FUENTE_HERRAMIENTAS_DIAGNOSTICAS})`,
  ].join("\n");
}
