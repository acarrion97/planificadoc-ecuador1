/**
 * Tipos compartidos del catálogo de Competencias Específicas — Currículo
 * Integrado (Preparatoria a Bachillerato). Un mismo shape para todas las
 * áreas (Lengua, Matemática, CCNN, CCSS, Inglés, Educación Física, ECA y
 * Emprendimiento), normalizando distintas fuentes a la misma estructura:
 * competencia específica, saberes declarativos/procedimentales/actitudinales e
 * indicadores de evaluación, desagregados por grado cuando la fuente lo permite.
 */

export interface IndicadorCompetenciaEspecifica {
  codigo: string;
  texto: string;
}

export interface SaberesCompetenciaEspecifica {
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

/** Una competencia específica desagregada para un grado concreto. */
export interface GradoCompetenciaEspecifica {
  /** Nivel/hoja de origen en la matriz oficial (ej. "ELEMENTAL", "BACHILLERATO", "BIOLOGÍA"). */
  nivel: string;
  /** Grado u curso concreto (ej. "SEGUNDO GRADO", "PRIMER CURSO"). */
  grado: string;
  indicadores: IndicadorCompetenciaEspecifica[];
  saberes: SaberesCompetenciaEspecifica;
}

export interface CompetenciaEspecificaCompleta {
  /** Código oficial CE.<ÁREA>.<subnivel>.<secuencial> (ej. "CE.LL.2.1"). */
  codigo: string;
  descripcion: string;
  competenciasClave: string[];
  /** Desagregación por cada grado en el que aparece esta competencia. */
  porGrado: GradoCompetenciaEspecifica[];
}
