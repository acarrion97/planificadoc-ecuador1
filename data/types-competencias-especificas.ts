/**
 * Tipos compartidos del catálogo de Competencias Específicas — Currículo
 * Integrado (Preparatoria a Bachillerato). Un mismo shape para todas las
 * áreas (Lengua, Matemática, CCNN, CCSS, Inglés, ECA, Emprendimiento),
 * ya que la matriz oficial del MESOCURRICULUM usa la misma estructura de
 * columnas para todas: Competencia específica | Saberes declarativos |
 * Saberes procedimentales | Saberes actitudinales | Indicadores de
 * evaluación, repetida por cada grado dentro de un subnivel/nivel.
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
