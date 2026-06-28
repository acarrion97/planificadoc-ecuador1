/**
 * Tipos exclusivos para Planificación Semanal de Educación Inicial
 * (Inicial 1: 3-4 años | Inicial 2: 4-5 años)
 * Formato: Planificación Semanal por Experiencia de Aprendizaje
 */

/** Indicadores DUA para una actividad individual */
export interface DUAActividad {
  representacion: boolean;
  accionExpresion: boolean;
  implicacion: boolean;
}

/** Una clase individual dentro de la semana para un ámbito */
export interface ClaseInicial {
  numero: number;
  tema: string;
  objetivoEspecifico: string;
  metodologia: string;  // "Juego-trabajo", "Juego libre", etc.
  inicio: string[];
  desarrollo: string[];
  cierre: string[];
  metodoEvaluacion: string[];
  /** Indicadores DUA por actividad (mismo índice que inicio[], desarrollo[], cierre[]) */
  duaInicio?: DUAActividad[];
  duaDesarrollo?: DUAActividad[];
  duaCierre?: DUAActividad[];
}

/** Un ámbito de desarrollo trabajado durante la semana */
export interface AmbitoInicial {
  /** Nombre del ámbito: "Comprensión del Mundo Real y Simbólico" */
  ambito: string;
  /** Código oficial INI (ej: "INI.4.C.M.R.S.2") o código simplificado (INI.4.4.1) */
  competenciaCodigo: string;
  /** Descripción completa de la competencia/habilidad */
  competenciaDescripcion: string;
  /** Una o más destrezas con criterio de desempeño trabajadas */
  destrezas: string[];
  /** Ejes transversales aplicados */
  ejesTransversales?: string[];
  /** Clases de la semana para este ámbito */
  clases: ClaseInicial[];
}

/** Adaptación curricular para NEE */
export interface AdaptacionNEE {
  descripcionNEE: string;
  competencia: string;
  destreza: string;
  proceso: string;
}

/** Firmante de la planificación */
export interface FirmanteInicial {
  nombre: string;
  cargo: string;
}

/** Planificación Semanal de Educación Inicial completa */
export interface PlanificacionInicialSemanal {
  id: string;
  /** "Inicial 1 (3 a 4 años)" | "Inicial 2 (4 a 5 años)" */
  grado: string;
  institucion: string;
  docente: string;
  /** Rango de la semana: "del 19 al 23 de mayo del 2025" */
  duracion: string;
  /** Objetivo general del nivel */
  objetivoGeneral: string;
  /** Ámbitos de desarrollo trabajados en la semana */
  ambitos: AmbitoInicial[];
  /** Número de grado para adaptaciones curriculares: "2", "3", etc. */
  gradoAdaptacion?: string;
  adaptacionesNEE?: AdaptacionNEE[];
  bibliografia?: string;
  observaciones?: string;
  elaboradoPor?: FirmanteInicial;
  revisadoPor?: FirmanteInicial;
  coordinadorPor?: FirmanteInicial;
  aprobadoPor?: FirmanteInicial;
  createdAt: string;
  updatedAt: string;
}
