/**
 * Tipos del Bachillerato Técnico (BT) — modo pedagógico paralelo al EGB/BGU.
 *
 * BT usa un currículo por competencias laborales (Acuerdo MINEDUC-2024-00065-A),
 * SIN ERCA, DUA ni Marzano: Módulos → Unidad de Competencia (UC) → Elemento de
 * Competencia (EC) → Criterio de Desempeño (CD), y en la planificación real:
 * Unidad de Trabajo → Procedimientos → Resultado de Aprendizaje (RA) → Criterio
 * de Evaluación (CE). Ver plan de implementación para el detalle de por qué
 * ambos vocabularios (UC/EC/CD y RA/CE) conviven.
 *
 * Este archivo, junto con lib/planificaciones-bt-context.tsx y server/bt-router.ts,
 * es intencionalmente independiente del sistema EGB/BGU (data/types.ts) para no
 * arriesgar el flujo existente.
 */

// ─── Catálogo (mayormente estático o ingresado por el usuario) ─────────────

export interface CriterioDesempeno {
  id: string; // ej. "CD2.1"
  texto: string;
}

export interface ElementoCompetencia {
  id: string; // ej. "EC2"
  texto: string;
  criteriosDesempeno: CriterioDesempeno[];
}

export interface CriterioEvaluacion {
  id: string; // ej. "CE1.1"
  texto: string;
}

export interface ResultadoAprendizaje {
  id: string; // ej. "RA.1"
  texto: string;
  criteriosEvaluacion: CriterioEvaluacion[];
  /** Trazabilidad opcional hacia el EC que este RA operacionaliza, si se conoce */
  elementoCompetenciaId?: string;
}

export interface UnidadCompetencia {
  id: string; // ej. "UC1"
  texto: string;
  /** Catálogo de especialización (perfil-profesional-afdr.pdf) */
  elementosCompetencia?: ElementoCompetencia[];
  condicionesEjecucion?: {
    espaciosInstalaciones?: string;
    insumosRecursos?: string;
    informacionUtilizada?: string;
  };
}

/** N:M — "Asocia" en el diagrama: una UC puede vincularse a varios módulos y viceversa */
export interface ModuloUnidadCompetencia {
  moduloId: string;
  unidadCompetenciaId: string;
}

export interface ContenidosBT {
  conceptuales: string[];
  procedimentales: string[];
  actitudinales: string[];
}

/** Campos adicionales de Bachillerato Técnico sobre ModuloFormativo (ver data/bachillerato-tecnico.ts) */
export interface ModuloFormativoBTExtras {
  categoria?: "generico" | "especializacion" | "practico";
  nivel?: string; // texto libre, ej. "1ro, 2do"
  duracionPeriodos?: Partial<Record<1 | 2 | 3, number | null>>; // periodos pedagógicos por año
  objetivoModulo?: string;
  objetivoPorAnio?: Partial<Record<1 | 2 | 3, string>>;
  /** "Modulos contiene N ResultadoAprendizaje" (1:N directo) — catálogo genérico (curriculo-fip-afdr.pdf) */
  resultadosAprendizaje?: ResultadoAprendizaje[];
  contenidos?: ContenidosBT;
  perfilDocente?: string;
  orientacionesMetodologicas?: string[];
  estadoCatalogo?: "completo" | "pendiente";
}

// ─── Planificación (lo que produce el docente) ──────────────────────────────

export interface FaseProcedimiento {
  nombre: string; // libre, ej. "Fase 1: Presentación del reto"
  descripcion: string;
}

export interface InstrumentoEvaluacionBT {
  id: string;
  tecnica: string; // ej. "Observación directa"
  instrumento: string; // ej. "Lista de cotejo"
}

export interface Procedimiento {
  id: string;
  nombre: string;
  objetivo: string;
  tiempo: string; // ej. "2 periodos"
  fases: FaseProcedimiento[];
  recursos: string[];
  evaluacion: InstrumentoEvaluacionBT;
}

/** N:M — un procedimiento puede evaluarse con varios CE/CD y un criterio aplicarse a varios procedimientos */
export interface ProcedimientoCriterioEvaluacion {
  procedimientoId: string;
  criterioEvaluacionId: string;
  peso?: number;
}

export interface EstrategiaMetodologicaBT {
  nombre: string; // ej. "Aprendizaje Basado en Proyectos (ABP)"
  descripcion?: string;
}

export interface UnidadDeTrabajo {
  id: string;
  numero: number;
  nombre: string;
  tiempoEstimadoPeriodos: number;
  contenidos: ContenidosBT;
  estrategiasMetodologicas: EstrategiaMetodologicaBT[];
  procedimientos: Procedimiento[];
  referenciasBibliograficas?: string[];
}

/** N:M — "Tiene" (etiquetado N/M explícito en el diagrama): una UT puede atender varios RA/EC */
export interface UnidadTrabajoResultadoAprendizaje {
  unidadTrabajoId: string;
  resultadoAprendizajeId: string;
}

/** N:M — "Asocia": una UT puede integrar varias UC directamente */
export interface UnidadTrabajoUnidadCompetencia {
  unidadTrabajoId: string;
  unidadCompetenciaId: string;
}

/** N:M — un instrumento (ej. "Rúbrica") se reutiliza entre unidades de trabajo */
export interface UnidadTrabajoInstrumentoEvaluacion {
  unidadTrabajoId: string;
  instrumentoEvaluacionId: string;
}

export interface FirmanteBT {
  nombre: string;
  cargo: string; // "Docente" | "Coordinador de Área" | "Vicerrector/a" | ...
}

/**
 * Documento raíz de un plan BT — análogo a PlanificacionSemanal.
 * Embebe las filas de detalle N:M relevantes a ESTE plan (cada plan es
 * autocontenido, consistente con el resto de la app que persiste JSON en
 * AsyncStorage, no relacional).
 */
export interface PlanUnidadTrabajoBT {
  id: string;
  figuraProfesionalId: string;
  moduloId: string;

  institucion: string;
  docente: string;
  curso: string;
  paralelo: string;
  anioLectivo: string;

  nombreModuloFormativo: string;
  objetivoModuloFormativo: string;
  horasPedagogicas: string;

  unidadTrabajo: UnidadDeTrabajo;
  unidadTrabajoUnidadCompetencia: UnidadTrabajoUnidadCompetencia[];
  unidadTrabajoResultadoAprendizaje: UnidadTrabajoResultadoAprendizaje[];
  unidadTrabajoInstrumentoEvaluacion: UnidadTrabajoInstrumentoEvaluacion[];
  procedimientoCriterioEvaluacion: ProcedimientoCriterioEvaluacion[];

  /** Reutiliza el tipo existente de data/types.ts sin modificarlo (aislamiento) */
  adaptacionesCurriculares?: import("./types").AdaptacionCurricular[];
  bibliografiaWebgrafia?: string[];

  elaboradoPor?: FirmanteBT;
  revisadoPor?: FirmanteBT;
  aprobadoPor?: FirmanteBT;

  createdAt: string;
  updatedAt: string;
}

// ─── Catálogo ingresado por el usuario (superpuesto al catálogo semilla) ────

export interface CatalogoUsuarioBT {
  modulos: Record<string, ModuloFormativoBTExtras>; // clave: `${figuraId}::${moduloCodigo}`
  unidadesCompetencia: UnidadCompetencia[];
  moduloUnidadCompetencia: ModuloUnidadCompetencia[];
}
