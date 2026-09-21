/**
 * Tipos canónicos del módulo "Proyecto Interdisciplinar" (independiente del
 * ProyectoInterdisciplinar embebido en Currículo por Competencias).
 *
 * Decisiones de diseño (ver openspec/changes/proyecto-interdisciplinar/design.md):
 * - Base curricular dual configurable por proyecto (destrezas o competencias),
 *   sin mezclar ambas dentro del mismo proyecto.
 * - Selección libre de nivel/subnivel/grado/área por área participante.
 * - Los elementos curriculares se guardan SIEMPRE por referencia (código +
 *   trazabilidad), nunca copiando descripción/criterios/indicadores — se
 *   resuelven en lectura contra el catálogo estático existente
 *   (`buscarPorCodigo` para destrezas, `buscarCompetenciaEspecificaEGBBGU`
 *   para competencias).
 */

import { SourceTraceability } from "./types-curriculo-competencias";

// ============================================================
// BASE CURRICULAR
// ============================================================

/** Currículo sobre el que se articula el proyecto: destrezas (vigente) o competencias (CNC, piloto). */
export type BaseCurricular = "destrezas" | "competencias";

/** Versión curricular de origen de un elemento referenciado — para trazabilidad, no para lógica de negocio. */
export type CurriculumVersion = "destrezas-2016" | "cnc-2024";

// ============================================================
// ÁREAS PARTICIPANTES
// ============================================================

/**
 * Área participante del proyecto, con su propio nivel/subnivel/grado
 * (selección libre — puede diferir entre áreas del mismo proyecto).
 */
export interface AreaProyectoInterdisciplinar {
  /** Slug estable dentro del proyecto (ej. "area-1"), usado para enlazar elementos curriculares. */
  id: string;
  /** Código de área (catálogo destrezas, ej. "M") o materiaId (catálogo competencias, ej. "matematica"), según baseCurricular. */
  areaId: string;
  /** Nombre legible del área, para mostrar sin resolver el catálogo. */
  nombreArea: string;
  /** Nivel educativo o nivel de la matriz (ej. "EGB Superior" / "SUPERIOR"). */
  nivel: string;
  /** Subnivel legible (solo relevante para destrezas). */
  subnivel?: string;
  /** Grado o curso concreto. */
  grado: string;
}

// ============================================================
// ARTICULACIÓN CURRICULAR
// ============================================================

/**
 * Elemento curricular (destreza o competencia específica) asociado a un
 * área del proyecto, guardado por referencia al catálogo estático.
 */
export interface ElementoCurricularReferenciado {
  /** Referencia a AreaProyectoInterdisciplinar.id. */
  areaProyectoId: string;
  /** Código oficial del catálogo (destreza o competencia específica). */
  codigo: string;
  curriculumVersion: CurriculumVersion;
  area: string;
  nivel: string;
  subnivel?: string;
  grado: string;
  /** Trazabilidad de origen (documento fuente), cuando esté disponible. */
  source?: SourceTraceability;
}

// ============================================================
// ACTIVIDADES POR FASE
// ============================================================

/** Fases oficiales del instructivo de Proyecto Interdisciplinar. */
export type FaseProyecto = "planificacion" | "gestion" | "evaluacion";

/**
 * Actividad del proyecto, agrupada por fase. `criteriosVinculados` referencia
 * códigos ya presentes en `elementosCurriculares` (Requirement: Evaluación del proyecto).
 */
export interface ActividadProyectoInterdisciplinar {
  id: string;
  fase: FaseProyecto;
  actividad: string;
  recursos: string;
  evidencia: string;
  evaluacion: string;
  instrumentoEvaluacion?: string;
  /** Códigos de ElementoCurricularReferenciado.codigo vinculados como criterio/indicador de esta actividad. */
  criteriosVinculados?: string[];
  orderIndex: number;
}

// ============================================================
// PLAN COMPLETO
// ============================================================

/** Planificación completa de un Proyecto Interdisciplinar. */
export interface ProyectoInterdisciplinarPlan {
  id: string;
  sessionId: string;
  baseCurricular: BaseCurricular;

  // ── INFORMACIÓN GENERAL ──
  titulo: string;
  contexto?: string;
  /** Propuesto para UX, no confirmado como campo oficial del instructivo — ver proposal.md. */
  preguntaGuia?: string;
  objetivoGeneral: string;
  objetivosEspecificos?: string[];
  productoFinal: string;
  duracion: string;
  metodologia?: string;

  // ── ÁREAS Y ARTICULACIÓN CURRICULAR ──
  areas: AreaProyectoInterdisciplinar[];
  elementosCurriculares: ElementoCurricularReferenciado[];

  // ── ACTIVIDADES POR FASE ──
  actividades: ActividadProyectoInterdisciplinar[];

  // ── EVALUACIÓN GENERAL ──
  /** Método general de evaluación (el instructivo sugiere rúbrica y/o portafolio). */
  evaluacionGeneral?: string;

  // ── INFORMACIÓN INSTITUCIONAL Y RESPONSABLES ──
  institucion?: string;
  docentesParticipantes?: string[];

  // ── ADAPTACIONES / INCLUSIÓN (opcional) ──
  adaptaciones?: string;

  observaciones?: string;

  // ── METADATOS ──
  estado: "borrador" | "generado";
  createdAt: string;
  updatedAt: string;
}
