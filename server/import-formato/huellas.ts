import { TipoPlanificacion, TIPOS_PLANIFICACION } from "./types";

/**
 * Catálogo declarativo de "huellas": encabezados de sección esperados por
 * tipo de planificación, en el orden en que aparecen en el formato oficial
 * MinEduc. Se usa para reconocer a qué tipo corresponde un documento subido
 * (ver design.md, Decisión 4) comparando el texto extraído contra cada lista.
 *
 * Se define aquí (no dentro de cada generador) para que sea una única fuente
 * de verdad reutilizable tanto por el matcher de importación como, a futuro,
 * por los generadores mismos si conviene.
 *
 * Verificada contra un formato oficial real (PCA 2016-2017, ver el .doc de
 * ejemplo usado al proponer este change). Los demás tipos quedan con huella
 * vacía hasta implementarse (ver TIPOS_IMPLEMENTADOS en ./types) — una huella
 * vacía nunca supera el umbral de coincidencia, así que el matcher los
 * reporta como "no reconocido" en vez de fallar.
 */
export const HUELLAS: Record<TipoPlanificacion, string[]> = {
  pca: [
    "DATOS INFORMATIVOS",
    "TIEMPO",
    "OBJETIVOS GENERALES",
    "EJES TRANSVERSALES",
    "DESARROLLO DE UNIDADES DE PLANIFICACIÓN",
    "BIBLIOGRAFÍA",
    "OBSERVACIONES",
  ],
  pca_trimestral: [],
  adaptacion_curricular: [],
  plan_semanal: [],
  plan_inicial: [],
  cnc: [],
  evaluacion_diagnostica: [],
  bt: [],
};

/** Umbral mínimo de score (proporción de encabezados encontrados) para aceptar un tipo. */
export const UMBRAL_RECONOCIMIENTO = 0.6;

/** Tipos cuya huella tiene al menos un encabezado — los únicos que el matcher puede llegar a reconocer. */
export function tiposConHuella(): TipoPlanificacion[] {
  return TIPOS_PLANIFICACION.filter((t) => HUELLAS[t].length > 0);
}
