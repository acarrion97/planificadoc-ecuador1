/**
 * Tipos canónicos del módulo Currículo por Competencias — Plan Piloto
 *
 * Este archivo define el modelo canónico interno de Planificadoc.
 * El dominio NUNCA debe depender directamente de la estructura física
 * de un DOCX, PDF, XLSX u otra fuente.
 *
 * Trazabilidad: cada elemento normalizado conserva SourceTraceability.
 */

import { Area, Subnivel, Destreza, DUAActividad } from "./types";
import { CompetenciaTransversalCode } from "./competencias-transversales";

// ============================================================
// TRAZABILIDAD DE ORIGEN
// ============================================================

/** Metadatos de trazabilidad de un elemento normalizado hacia su fuente */
export interface SourceTraceability {
  /** Documento fuente (ej: "FORMATO PLANIFICACION MICROCURRICULAR EGB Y BG.docx") */
  source_document: string;
  /** Sección dentro del documento fuente */
  source_section?: string;
  /** Referencia específica dentro de la fuente */
  source_reference?: string;
  /** Versión del documento fuente */
  source_version?: string;
  /** Timestamp de normalización */
  normalized_at: string;
}

// ============================================================
// MODELO CANÓNICO — MESOCURRICULAR (Unidad)
// ============================================================

/** DCD seleccionada para una unidad de planificación */
export interface DcdSeleccionada {
  /** Código de la DCD (resoluble en el catálogo existente) */
  codigo: string;
  /** Descripción de la DCD */
  descripcion: string;
  /** Competencias transversales asociadas a esta DCD */
  competencias: CompetenciaTransversalCode[];
  /** Trazabilidad de origen */
  source?: SourceTraceability;
}

/** Indicador de evaluación seleccionado */
export interface IndicadorSeleccionado {
  /** Código del indicador */
  codigo: string;
  /** Texto del indicador */
  texto: string;
  /** Competencia transversal asociada */
  competencia: CompetenciaTransversalCode;
  /** Trazabilidad de origen */
  source?: SourceTraceability;
}

/** Resultado de la generación IA para una unidad */
export interface UnidadAiResult {
  titulo: string;
  objetivosEspecificos: string;
  contenidos: string;
  orientacionesMetodologicas: string;
  evaluacion: string;
}

/** Unidad de planificación mesocurricular por competencias */
export interface UnidadCurriculoCompetencias {
  id: string;
  sessionId: string;
  institucion: string;
  docente: string;
  area: Area;
  subnivel: Subnivel;
  grado: string;
  anioLectivo: string;
  paralelo: string;
  numeroUnidad: number;
  tituloUnidad: string;
  objetivosUnidad: string;
  competenciasClave: CompetenciaTransversalCode[];
  dcdsSeleccionadas: DcdSeleccionada[];
  indicadoresSeleccionados: IndicadorSeleccionado[];
  duracionSemanas: number;
  estado: "draft" | "generated" | "paid";
  aiResult?: UnidadAiResult;
  /** Trazabilidad de la fuente curricular utilizada */
  source?: SourceTraceability;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// ============================================================
// MODELO CANÓNICO — ESTRUCTURA DIDÁCTICA
// ============================================================

/** Actividad didáctica con competencia asociada */
export interface ActividadDidactica {
  /** Texto de la actividad (verbos en infinitivo, sin sujeto conjugado) */
  texto: string;
  /** Competencia transversal que potencia esta actividad */
  competencia: CompetenciaTransversalCode;
  /** Indicadores DUA por actividad */
  dua: DUAActividad;
}

/** Fase de una estrategia metodológica */
export interface FaseEstrategiaPlan {
  /** Nombre de la fase */
  titulo: string;
  /** Duración en minutos */
  duracionMinutos: number;
  /** Actividades de la fase */
  actividades: ActividadDidactica[];
}

/** Estructura didáctica completa (depende de la estrategia seleccionada) */
export interface EstructuraDidactica {
  /** ID de la estrategia metodológica utilizada */
  estrategiaId: string;
  /** Fases de la estrategia */
  fases: FaseEstrategiaPlan[];
}

// ============================================================
// MODELO CANÓNICO — MICROCURRICULAR EGB/BGU
// ============================================================

/** Sección 3: Aprendizaje Interdisciplinar (opcional) */
export interface ProyectoInterdisciplinar {
  nombre: string;
  objetivoAprendizaje: string;
  dcdsIntegradas: DcdSeleccionada[];
  indicadores: IndicadorSeleccionado[];
  estrategia: EstructuraDidactica;
  actividadesEvaluacion: string;
  source?: SourceTraceability;
}

/** Adaptación NEE para un estudiante */
export interface AdaptacionNEE {
  /** Grado de NEE (configurable, no asumir clasificación oficial) */
  grado: number;
  /** Descripción de la necesidad educativa */
  necesidadEducativa: string;
  /** Adaptación en la DCD */
  adaptacionDCD: string;
  /** Adaptación en las estrategias */
  adaptacionEstrategias: string;
  /** Adaptación en los recursos */
  adaptacionRecursos: string;
  /** Adaptación en la evaluación */
  adaptacionEvaluacion: string;
  source?: SourceTraceability;
}

/** Actividad de acompañamiento integral */
export interface ActividadAcompaniamiento {
  actividad: string;
  competencia: CompetenciaTransversalCode;
}

/** Planificación微curricular EGB/BGU */
export interface PlanificacionCurriculoCompetencias {
  id: string;
  sessionId: string;
  unidadId?: string;

  // ── DATOS INFORMATIVOS ──
  fecha: string;
  institucion: string;
  docente: string;
  grado: string;
  asignatura: string;
  areaCode?: string;
  periodoPedagogico: string;
  trimestre: string;
  nivel: "EGB" | "BGU";
  paralelo: string;
  noSemanas?: number;

  // ── SITUACIÓN DE APRENDIZAJE ──
  situacionAprendizaje?: {
    titulo: string;
    descripcion: string;
  };

  // ── CONEXIÓN INTERDISCIPLINAR ──
  conexionInterdisciplinar?: {
    asignaturas: string[];
  };

  // ── APRENDIZAJE DISCIPLINAR ──
  destreza: Destreza;
  indicadorEvaluacion: string;
  competenciasAsociadas: CompetenciaTransversalCode[];
  objetivoAprendizaje: string;
  estructuraDidactica: EstructuraDidactica;
  recursos: string;
  tecnicaEvaluacion: string;
  instrumentoEvaluacion: string;
  actividadesEvaluacion: string;

  // ── SABERES ──
  saberes?: {
    declarativos: string;
    procedimentales: string;
    actitudinales: string;
  };

  // ── SEMANAS (para formato oficial) ──
  semanas?: Array<{
    numero: number;
    inicio: string;
    desarrollo: string;
    cierre: string;
    tecnica: string;
    instrumento: string;
  }>;

  // ── APRENDIZAJE INTERDISCIPLINAR (opcional) ──
  usaInterdisciplina?: boolean;
  proyectoInterdisciplinar?: ProyectoInterdisciplinar;

  // ── NEE ──
  adaptacionesNEE?: AdaptacionNEE[];

  // ── ACOMPAÑAMIENTO INTEGRAL ──
  horasAcompaniamiento?: number;
  actividadesAcompaniamiento?: ActividadAcompaniamiento[];

  // ── METADATOS ──
  source?: SourceTraceability;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// ============================================================
// MODELO CANÓNICO — INICIAL / PREPARATORIA
// ============================================================

/** Actividad para Inicial/Preparatoria con competencia asociada */
export interface ActividadInicial {
  texto: string;
  competencia: CompetenciaTransversalCode;
  dua: DUAActividad;
}

/** Clase dentro de un ámbito de desarrollo */
export interface ClaseInicialCurriculo {
  numero: number;
  tema: string;
  objetivoEspecifico: string;
  metodologia: string;
  inicio: ActividadInicial[];
  desarrollo: ActividadInicial[];
  cierre: ActividadInicial[];
  metodoEvaluacion: string[];
}

/** Ámbito de desarrollo con sus clases */
export interface AmbitoDesarrollo {
  ambito: string;
  competenciaCodigo: string;
  competenciaDescripcion: string;
  competenciasTransversales: CompetenciaTransversalCode[];
  destrezas: string[];
  clases: ClaseInicialCurriculo[];
  source?: SourceTraceability;
}

/** Firmas para Inicial/Preparatoria (4 firmantes) */
export interface FirmasInicial {
  elaborado: string;
  revisado: string;
  coordinador: string;
  aprobado: string;
}

/** Planificación Inicial/Preparatoria (dominio independiente de EGB/BGU) */
export interface PlanificacionInicialCurriculo {
  id: string;
  sessionId: string;
  grado: string;
  institucion: string;
  docente: string;
  duracion: string;
  trimestre?: string;
  nivel?: string;
  paralelo?: string;
  periodoPedagogico?: string;
  noSemanasClase?: number;
  numeroNinos?: number;
  objetivoGeneral: string;
  ambitos: AmbitoDesarrollo[];
  adaptacionesNEE?: AdaptacionNEE[];
  bibliografia?: string;
  observaciones?: string;
  firmas?: FirmasInicial;

  // ── SITUACIÓN DE APRENDIZAJE ──
  situacionAprendizaje?: {
    titulo: string;
    descripcion: string;
  };

  // ── CONEXIONES CURRICULARES ──
  conexionesCurriculares?: {
    ambitosDesarrollo: string[];
    competenciasEspecifica: string;
    indicadoresEvaluacion: string[];
  };

  // ── SABERES ──
  saberes?: {
    declarativos: string;
    procedimentales: string;
    actitudinales: string;
  };

  source?: SourceTraceability;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// ============================================================
// UNION TYPES — PARA PERSISTENCIA Y EXPORTACIÓN
// ============================================================

/** Tipo unión de todas las planificaciones del módulo */
export type PlanificacionModulo =
  | PlanificacionCurriculoCompetencias
  | PlanificacionInicialCurriculo;

/** Tipo unión de configuraciones de unidades */
export type UnidadModulo = UnidadCurriculoCompetencias;

// ============================================================
// EXPORT STRATEGY (contrato de salida)
// ============================================================

/** Estrategia de exportación por familia */
export interface ExportStrategy {
  id: string;
  name: string;
  family: "egb_bgu" | "inicial_preparatoria";
  generate: (plan: PlanificacionModulo) => Promise<Blob>;
}
