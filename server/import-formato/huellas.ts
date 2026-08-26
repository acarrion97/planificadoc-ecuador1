import { TipoPlanificacion, TIPOS_PLANIFICACION, Huella } from "./types";

/**
 * Catálogo declarativo de huellas: encabezados de sección esperados por
 * tipo de planificación, con peso y exclusividad para evitar falsos
 * positivos entre tipos similares.
 *
 * Estructura por tipo:
 * - obligatorias: si alguna falta, el tipo no puede ser el correcto
 * - opcionales: suman score pero su ausencia no descarta
 * - exclusivas: palabras que, si aparecen en este tipo, penalizan a otros
 * - penalizadoras: palabras que, si aparecen, reducen el score de este tipo
 *
 * IMPORTANTE: Las huellas deben salir de formatos reales/oficiales que el
 * sistema pretende importar. No inventar encabezados.
 */
export const HUELLAS: Record<TipoPlanificacion, Huella> = {
  // ─── PCA Anual ──────────────────────────────────────────────────────
  // Verificada contra PCA 2016-2017 oficial real
  pca: {
    obligatorias: [
      "DATOS INFORMATIVOS",
      "OBJETIVOS GENERALES",
      "DESARROLLO DE UNIDADES DE PLANIFICACIÓN",
    ],
    opcionales: [
      "TIEMPO",
      "EJES TRANSVERSALES",
      "BIBLIOGRAFÍA",
      "OBSERVACIONES",
    ],
    exclusivas: [],
    penalizadoras: ["TRIMESTRE", "PLANIFICACIÓN MICROCURRICULAR SEMANAL"],
  },

  // ─── PCA Trimestral ─────────────────────────────────────────────────
  pca_trimestral: {
    obligatorias: [
      "PLAN CURRICULAR TRIMESTRAL",
      "DATOS INFORMATIVOS",
    ],
    opcionales: [
      "OBJETIVOS DEL TRIMESTRE",
      "DESARROLLO DE UNIDADES DE PLANIFICACIÓN",
      "INSERCIONES CURRICULARES",
      "DESTREZAS CON CRITERIOS DE DESEMPEÑO",
    ],
    exclusivas: ["TRIMESTRE", "PLAN CURRICULAR TRIMESTRAL"],
    penalizadoras: ["PLANIFICACIÓN MICROCURRICULAR SEMANAL"],
  },

  // ─── Adaptación Curricular ──────────────────────────────────────────
  adaptacion_curricular: {
    obligatorias: [
      "ADAPTACIÓN CURRICULAR",
      "DATOS GENERALES DEL CONTEXTO PEDAGÓGICO",
    ],
    opcionales: [
      "TIPO DE NEE",
      "GRADO DE ADAPTACIÓN",
      "DESTREZA CON CRITERIO DE DESEMPEÑO",
      "ADAPTACIONES CURRICULARES",
    ],
    exclusivas: ["NEE", "ADAPTACIÓN CURRICULAR", "EDUCACIÓN INCLUSIVA"],
    penalizadoras: [],
  },

  // ─── Planificación Semanal ──────────────────────────────────────────
  plan_semanal: {
    obligatorias: [
      "PLANIFICACIÓN MICROCURRICULAR SEMANAL",
      "DESARROLLO SEMANAL POR DÍA",
    ],
    opcionales: [
      "DESTREZAS CON CRITERIOS DE DESEMPEÑO",
      "INDICADORES DE EVALUACIÓN",
      "ESTRATEGIAS METODOLÓGICAS ACTIVAS",
      "LUNES",
      "VIERNES",
    ],
    exclusivas: ["PLANIFICACIÓN MICROCURRICULAR SEMANAL", "DESARROLLO SEMANAL POR DÍA"],
    penalizadoras: ["PLAN CURRICULAR TRIMESTRAL"],
  },

  // ─── Planificación Inicial ──────────────────────────────────────────
  plan_inicial: {
    obligatorias: [
      "PLANIFICACIÓN SEMANAL POR EXPERIENCIA DE APRENDIZAJE",
      "ÁMBITOS DE DESARROLLO Y APRENDIZAJE",
    ],
    opcionales: [
      "COMPETENCIA",
      "DESTREZA CON CRITERIO DE DESEMPEÑO",
      "PROCESO METODOLÓGICO",
      "INICIO",
      "DESARROLLO",
      "CIERRE",
    ],
    exclusivas: ["PLANIFICACIÓN SEMANAL POR EXPERIENCIA DE APRENDIZAJE", "ÁMBITOS DE DESARROLLO"],
    penalizadoras: [],
  },

  // ─── CNC ─────────────────────────────────────────────────────────────
  cnc: {
    obligatorias: [
      "CONECTA, NIVELA Y CREA",
      "DATOS INFORMATIVOS",
    ],
    opcionales: [
      "SEMANA 1",
      "SEMANAS 2-3",
      "SEMANAS 4-5",
      "NIVELA",
      "CONECTA",
      "CREA",
    ],
    exclusivas: ["CONECTA, NIVELA Y CREA", "ARRANQUE DEL AÑO ESCOLAR"],
    penalizadoras: [],
  },

  // ─── Evaluación Diagnóstica ─────────────────────────────────────────
  evaluacion_diagnostica: {
    obligatorias: [
      "RESULTADOS POR ESTUDIANTE",
      "RESULTADOS POR APRENDIZAJE",
    ],
    opcionales: [
      "RECOMENDACIONES PEDAGÓGICAS",
      "PUNTAJE TOTAL",
      "CLASIFICACIÓN",
      "DOMINADO",
      "EN PROCESO",
      "REFUERZO",
    ],
    exclusivas: ["EVALUACIÓN DIAGNÓSTICA", "RESULTADOS POR APRENDIZAJE"],
    penalizadoras: [],
  },

  // ─── BT (Bachillerato Técnico) ──────────────────────────────────────
  bt: {
    obligatorias: [
      "PLAN DE UNIDAD DE TRABAJO",
      "DATOS DE REFERENCIA",
    ],
    opcionales: [
      "DESARROLLO DE LA UNIDAD DE TRABAJO",
      "FIGURA PROFESIONAL",
      "MÓDULO FORMATIVO",
      "HORAS PEDAGÓGICAS",
      "ADAPTACIONES CURRICULARES",
    ],
    exclusivas: ["PLAN DE UNIDAD DE TRABAJO", "BACHILLERATO TÉCNICO"],
    penalizadoras: [],
  },
};

/** Umbral mínimo de score (proporción de encabezados encontrados) para aceptar un tipo. */
export const UMBRAL_RECONOCIMIENTO = 0.6;

/** Umbral de diferencia mínima entre el primer y segundo candidato para considerar ambigüedad. */
export const UMBRAL_AMBIGUEDAD = 0.1;

/** Tipos cuya huella tiene al menos un encabezado obligatorio — los únicos que el matcher puede llegar a reconocer. */
export function tiposConHuella(): TipoPlanificacion[] {
  return TIPOS_PLANIFICACION.filter(
    (t) => HUELLAS[t].obligatorias.length > 0 || HUELLAS[t].opcionales.length > 0
  );
}
