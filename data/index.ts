import { destrezasMatematica } from "./destrezas-matematica";
import { destrezasLengua } from "./destrezas-lengua";
import { destrezasCienciasNaturales } from "./destrezas-cn";
import { destrezasEstudiosSociales } from "./destrezas-cs";
import { destrezasEducacionFisica } from "./destrezas-ef";
import { destrezasECA } from "./destrezas-eca";
import { destrezasBiologia } from "./destrezas-biologia";
import { destrezasQuimica } from "./destrezas-quimica";
import { destrezasFisica } from "./destrezas-fisica";
import { destrezasHistoria } from "./destrezas-historia";
import { destrezasFilosofia } from "./destrezas-filosofia";
import { destrezasIngles } from "./destrezas-ingles";
import { destrezasEmprendimiento } from "./destrezas-emprendimiento";
import { destrezasEducacionCiudadania as _rawEC } from "./destrezas-educacion-ciudadania";
import { destrezasCAI } from "./destrezas-kai";
export { NOMBRES_BLOQUES_CAI, CRITERIOS_CAI, OBJETIVO_NIVEL_CAI } from "./destrezas-kai";
import { Area, Destreza, Subnivel, AREAS_INFO, SUBNIVEL_NAMES, AMBITOS_PREPARATORIA } from "./types";

const destrezasEducacionCiudadania: Destreza[] = _rawEC.map((d) => ({
  ...d,
  bloque: d.bloque ?? (parseInt(d.codigo.split(".")[3], 10) || 1),
})) as Destreza[];

export * from "./types";
export { obtenerTemasSugeridos } from "./temas-sugeridos";
export { obtenerEstrategiasDUA, obtenerEstrategiasGeneralesDUA, generarTextoDUA, DUA_PRINCIPIOS, DUA_PRINCIPIOS_EN } from "./dua-estrategias";
export type { DUAPlanificacion } from "./dua-estrategias";
export { INSERCIONES_CURRICULARES, obtenerInsercion, obtenerNombreInsercion, obtenerInsercionesPorAsignatura } from "./inserciones-curriculares";
export type { InsercionCurricular } from "./inserciones-curriculares";
export { COMPETENCIAS, METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION, ESTILOS_APRENDIZAJE } from "./secciones-planificacion";
export type { Competencia, MetodologiaActiva, TecnicaEvaluacion, EstiloAprendizaje } from "./secciones-planificacion";
export { NIVELES_MARZANO, MAPEO_ERCA_MARZANO, obtenerVerbosParaEtapa, generarTextoVerbosParaPrompt } from "./taxonomia-marzano";
export type { NivelMarzano, MapeoERCAMarzano } from "./taxonomia-marzano";
export { HABILIDADES_SOCIOEMOCIONALES } from "./habilidades-socioemocionales";
export type { HabilidadSocioemocional } from "./habilidades-socioemocionales";
export * from "./types-evaluacion";
export {
  AREAS_BT,
  FAMILIAS_PROFESIONALES,
  FIGURAS_PROFESIONALES,
  obtenerFamiliasPorArea,
  obtenerFigurasPorFamilia,
  obtenerFigurasActivas,
  obtenerFiguraPorId,
  obtenerModulosPorAnio,
  obtenerTodosLosModulos,
} from './bachillerato-tecnico';
export type { ModuloFormativo, FiguraProfesional, FamiliaProfesional } from './bachillerato-tecnico';

export const TODAS_LAS_DESTREZAS: Destreza[] = [
  ...destrezasMatematica,
  ...destrezasLengua,
  ...destrezasCienciasNaturales,
  ...destrezasEstudiosSociales,
  ...destrezasEducacionFisica,
  ...destrezasECA,
  ...destrezasBiologia,
  ...destrezasQuimica,
  ...destrezasFisica,
  ...destrezasHistoria,
  ...destrezasFilosofia,
  ...destrezasIngles,
  ...destrezasEmprendimiento,
  ...destrezasEducacionCiudadania,
  ...destrezasCAI,
];

export function buscarPorCodigo(codigo: string): Destreza | undefined {
  const codigoNormalizado = codigo.trim().toUpperCase();
  return TODAS_LAS_DESTREZAS.find(
    (d) => d.codigo.toUpperCase() === codigoNormalizado
  );
}

export function buscarDestrezas(query: string): Destreza[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return TODAS_LAS_DESTREZAS.filter(
    (d) =>
      d.codigo.toUpperCase().includes(q) ||
      d.descripcion.toUpperCase().includes(q)
  );
}

export function filtrarPorArea(area: Area): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter((d) => d.area === area);
}

export function filtrarPorAreaYSubnivel(
  area: Area,
  subnivel: Subnivel
): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel
  );
}

export function filtrarPorAreaSubnivelBloque(
  area: Area,
  subnivel: Subnivel,
  bloque: number
): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel && d.bloque === bloque
  );
}

export function obtenerSubnivelesDeArea(area: Area): Subnivel[] {
  const subniveles = new Set<Subnivel>();
  TODAS_LAS_DESTREZAS.filter((d) => d.area === area).forEach((d) =>
    subniveles.add(d.subnivel)
  );
  return Array.from(subniveles).sort();
}

export function obtenerBloquesDeAreaSubnivel(
  area: Area,
  subnivel: Subnivel
): number[] {
  const bloques = new Set<number>();
  TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel
  ).forEach((d) => bloques.add(d.bloque));
  return Array.from(bloques).sort();
}

export function contarDestrezasPorArea(): Record<Area, number> {
  const counts = {} as Record<Area, number>;
  for (const area of Object.keys(AREAS_INFO) as Area[]) {
    counts[area] = TODAS_LAS_DESTREZAS.filter((d) => d.area === area).length;
  }
  return counts;
}

export function obtenerNombreBloque(area: Area, bloque: number): string {
  return AREAS_INFO[area]?.bloques[bloque] ?? `Bloque ${bloque}`;
}

/**
 * Nombre del bloque de una destreza, consciente de Preparatoria: para
 * `subnivel: 1` el campo `bloque` es un ámbito de desarrollo y aprendizaje
 * (ver AMBITOS_PREPARATORIA), no el bloque regular que la misma área usa en
 * subniveles 2-5 — `obtenerNombreBloque` resolvería el nombre equivocado.
 * Ver openspec/changes/preparatoria-area-integradora/design.md D7.
 */
export function obtenerNombreBloqueDestreza(destreza: Destreza): string {
  if (destreza.subnivel === 1) {
    return AMBITOS_PREPARATORIA[destreza.bloque] ?? `Ámbito ${destreza.bloque}`;
  }
  return obtenerNombreBloque(destreza.area, destreza.bloque);
}

export function obtenerNombreSubnivel(subnivel: Subnivel): string {
  return SUBNIVEL_NAMES[subnivel] ?? `Subnivel ${subnivel}`;
}

// ============================================================
// DESAGREGACIÓN / GRADACIÓN DE DCD POR GRADO
// ============================================================

/**
 * Grados que aplican a la desagregación según el subnivel de la DCD.
 * Devuelve `null` para Preparatoria (subnivel 1) e Inicial (-1, 0): constan
 * de un solo grado y no se desagregan.
 */
export function gradosDeSubnivel(subnivel: Subnivel): number[] | null {
  switch (subnivel) {
    case 2:
      return [2, 3, 4];
    case 3:
      return [5, 6, 7];
    case 4:
      return [8, 9, 10];
    case 5:
      return [1, 2, 3];
    default:
      return null;
  }
}

/**
 * Resuelve la DCD oficial por código y su indicador de evaluación principal
 * (el primero de `indicadoresEvaluacion`). Devuelve `null` si la DCD no existe
 * en el catálogo o no tiene indicador (no se puede desagregar).
 */
export function resolverDcdConIndicador(
  codigo: string
): { dcd: Destreza; indicador: string } | null {
  const dcd = buscarPorCodigo(codigo);
  if (!dcd) return null;
  const indicador = dcd.indicadoresEvaluacion?.[0];
  if (!indicador) return null;
  return { dcd, indicador };
}
