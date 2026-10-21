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

/**
 * Fases oficiales del formato "Proyecto Interdisciplinar para la Evaluación
 * Sumativa" (5 fases). Los proyectos antiguos usaban 3 fases
 * (planificacion/gestion/evaluacion); "gestion" se migra a "organizacion"
 * en `normalizarFase` (data/proyecto-interdisciplinar-formato.ts).
 */
export type FaseProyecto = "planificacion" | "organizacion" | "ejecucion" | "socializacion" | "evaluacion";

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
// SECCIÓN POR ASIGNATURA (FORMATO OFICIAL)
// ============================================================

/**
 * Plan de una asignatura dentro del proyecto: actividades y recursos por
 * fase (el formato oficial dedica una sección por asignatura — EFL, ECA,
 * EF, EESS, LL — con tabla FASE | ACTIVIDADES | RECURSOS).
 */
export interface FaseAreaInterdisciplinar {
  fase: FaseProyecto;
  /** Etiqueta de semana, opcional (ej. "Semana 1"). */
  semana?: string;
  /** Pregunta orientadora propia de la asignatura para esa fase, opcional. */
  preguntaOrientadora?: string;
  actividades: string[];
  recursos: string[];
}

/** Detalle de una asignatura participante (una fila por área del proyecto). */
export interface DetalleAreaInterdisciplinar {
  /** Referencia a AreaProyectoInterdisciplinar.id. */
  areaProyectoId: string;
  fases: FaseAreaInterdisciplinar[];
}

// ============================================================
// PLANIFICACIÓN DÍA A DÍA (FORMATO OFICIAL)
// ============================================================

/**
 * Actividad del cronograma día a día (el formato oficial lo usa en Lengua y
 * Literatura: Resultado/evidencia general | Día y fecha | Actividad diaria
 * paso a paso | Producto diario específico).
 */
export interface ActividadDiaAPorDia {
  fase: FaseProyecto;
  /** Día del cronograma (ej. "Día 1"). */
  dia: string;
  /** Día de la semana o fecha (ej. "Lunes"). */
  fecha: string;
  /** Actividad diaria paso a paso. */
  actividad: string;
  /** Producto específico de ese día. */
  productoDiario: string;
  /** Referencia opcional al área (por defecto se asigne a Lengua y Literatura). */
  areaProyectoId?: string;
}

// ============================================================
// INSTRUMENTOS DE EVALUACIÓN (FORMATO OFICIAL)
// ============================================================

/** Criterio de rúbrica analítica con los 4 niveles del formato oficial. */
export interface CriterioRubrica {
  criterio: string;
  /** 4 – Logro destacado. */
  nivel4: string;
  /** 3 – Logro esperado. */
  nivel3: string;
  /** 2 – En proceso. */
  nivel2: string;
  /** 1 – Requiere apoyo. */
  nivel1: string;
}

/**
 * Rúbrica del formato oficial: disciplinar (por asignatura) o
 * interdisciplinar (común para el producto final). El puntaje máximo es
 * 4 puntos por criterio; la calificación se expresa sobre 10.
 */
export interface RubricaProyecto {
  /** Asignatura o eje evaluado (ej. "Matemática" / "Producto final interdisciplinar"). */
  titulo: string;
  criterios: CriterioRubrica[];
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

  // ── DATOS INFORMATIVOS DEL FORMATO OFICIAL ──
  /** Ej. "2026–2027". */
  anioLectivo?: string;
  /** Ej. "1", "2", "3". */
  trimestre?: string;
  /** Paralelo del curso (ej. "A"); se muestra junto al grado en "Grado/Curso y paralelo". */
  paralelo?: string;

  // ── ÁREAS Y ARTICULACIÓN CURRICULAR ──
  areas: AreaProyectoInterdisciplinar[];
  elementosCurriculares: ElementoCurricularReferenciado[];

  // ── ACTIVIDADES POR FASE ──
  actividades: ActividadProyectoInterdisciplinar[];

  // ── SECCIÓN POR ASIGNATURA (FORMATO OFICIAL) ──
  /** Plan propio de cada asignatura (actividades/recursos por fase). Opcional. */
  detalleAreas?: DetalleAreaInterdisciplinar[];

  // ── PLANIFICACIÓN DÍA A DÍA (FORMATO OFICIAL) ──
  /** Cronograma día a día (formato de Lengua y Literatura). Opcional. */
  diaPorDia?: ActividadDiaAPorDia[];

  // ── INSTRUMENTOS DE EVALUACIÓN (FORMATO OFICIAL) ──
  /** Rúbrica analítica disciplinar (4–3–2–1, sobre 20 puntos). Opcional. */
  rubricaDisciplinar?: RubricaProyecto;
  /** Rúbrica interdisciplinar común del producto final (sobre 24 puntos). Opcional. */
  rubricaInterdisciplinar?: RubricaProyecto;

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
