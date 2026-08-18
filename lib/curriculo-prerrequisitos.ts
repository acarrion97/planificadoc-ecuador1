import { TODAS_LAS_DESTREZAS } from "@/data";
import type { Area, Subnivel } from "@/data/types";

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
