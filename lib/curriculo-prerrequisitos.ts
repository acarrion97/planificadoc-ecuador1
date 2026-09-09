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
