import type { Area, Subnivel } from "./types";

/**
 * Tipos del módulo "Evaluación Diagnóstica" — instrumento pedagógico del
 * docente para identificar conocimientos previos, fortalezas y brechas de
 * aprendizaje por DCD antes de iniciar un proceso de enseñanza.
 *
 * Módulo intencionalmente independiente de data/types.ts (EGB/BGU),
 * data/types-bt.ts (Bachillerato Técnico) y data/types-cnc.ts (Conecta,
 * Nivela y Crea), siguiendo el aislamiento que ya establece CNC para no
 * arriesgar ningún flujo existente en producción.
 *
 * Privacy-first: los estudiantes se registran con CÓDIGO ANÓNIMO obligatorio;
 * el nombre es opcional y solo se usa en reportes si el docente lo ingresó.
 */

export type TipoPreguntaDiagnostica =
  | "opcion_multiple"
  | "v_f"
  | "respuesta_corta"
  | "ejercicio";

export type DificultadPregunta = "basica" | "media" | "avanzada";

export interface OpcionPregunta {
  id: string;
  texto: string;
  esCorrecta: boolean;
}

export interface PreguntaDiagnostica {
  id: string;
  enunciado: string;
  tipo: TipoPreguntaDiagnostica;
  dificultad: DificultadPregunta;
  puntaje: number;
  /** Código real de la DCD del catálogo (data/destrezas-*.ts) */
  dcdCodigo: string;
  /** Indicador de evaluación real del catálogo al que apunta la pregunta (texto) */
  indicador?: string;
  /** Solo opcion_multiple y v_f: opciones con una correcta */
  opciones?: OpcionPregunta[];
  /** Respuesta correcta esperada para respuesta_corta y ejercicio (referencia) */
  respuestaCorrecta?: string;
  retroalimentacion?: string;
  activa: boolean;
}

/** DCD seleccionada para diagnosticar, con indicadores reales del catálogo */
export interface DcdEvaluada {
  codigo: string;
  descripcion: string;
  indicadores: string[];
}

export interface UmbralesEvaluacion {
  /** % de logro desde el cual la DCD se considera 🟢 Dominado */
  dominadoMin: number;
  /** % de logro por debajo del cual la DCD se considera 🔴 Requiere refuerzo */
  refuerzoMax: number;
}

export type EstadoAprendizaje = "dominado" | "en_proceso" | "requiere_refuerzo";

export type EstatusEvaluacion = "borrador" | "publicada" | "aplicada" | "analizada";

/** Estudiante del roster: código anónimo obligatorio, nombre opcional */
export interface EstudianteEvaluacion {
  id: string;
  codigo: string;
  nombre?: string;
  incluirEnReportes: boolean;
}

/** Respuesta registrada de un estudiante a una pregunta */
export interface RespuestaPregunta {
  preguntaId: string;
  /** id de la opción (opcion_multiple/v_f) o texto libre (respuesta_corta/ejercicio) */
  respuesta: string;
  /** Correcta: automática para opciones; el docente la marca para texto libre */
  correcta: boolean;
}

/** Registro de aplicación de un estudiante a la evaluación */
export interface ResultadoEstudiante {
  estudianteId: string;
  respuestas: RespuestaPregunta[];
  inicio?: string;
  fin?: string;
  /** Si el docente autorizó un nuevo intento (el duplicado accidental se bloquea) */
  intentoPermitido: boolean;
}

/** Resultado calculado por DCD para un estudiante */
export interface ResultadoPorDcd {
  dcdCodigo: string;
  totalPreguntas: number;
  correctas: number;
  incorrectas: number;
  sinResponder: number;
  porcentajeLogro: number;
  estado: EstadoAprendizaje;
}

/** Resultado individual calculado (derivado, no se persiste) */
export interface ResultadoCalculadoEstudiante {
  estudianteId: string;
  puntaje: number;
  puntajeMaximo: number;
  porcentaje: number;
  correctas: number;
  incorrectas: number;
  sinResponder: number;
  tiempoEmpleado: number;
  porDcd: ResultadoPorDcd[];
}

/** Brecha agregada del curso para una DCD */
export interface BrechaCurso {
  dcdCodigo: string;
  descripcion: string;
  totalEstudiantes: number;
  dominado: number;
  enProceso: number;
  requiereRefuerzo: number;
  porcentajeDominio: number;
  porcentajeDificultad: number;
  /** 1..n ordenada por prioridad de intervención */
  prioridad: number;
}

/** Recomendación pedagógica por regla local, anclada a una DCD */
export interface Recomendacion {
  dcdCodigo: string;
  dcdDescripcion: string;
  nivel: EstadoAprendizaje;
  texto: string;
  prioridad: number;
}

/** Evaluación diagnóstica completa (documento local + backup best-effort) */
export interface EvaluacionDiagnostica {
  id: string;
  // Contexto curricular
  nombre: string;
  anioLectivo: string;
  area: Area;
  subnivel: Subnivel;
  grado: string;
  paralelo: string;
  asignatura: string;
  fecha: string;
  duracionMinutos: number;
  instrucciones: string;
  puntajeTotal: number;
  // Aprendizajes a diagnosticar
  dcdsEvaluadas: DcdEvaluada[];
  // Banco de preguntas de la evaluación
  preguntas: PreguntaDiagnostica[];
  // Roster
  estudiantes: EstudianteEvaluacion[];
  // Resultados aplicados
  resultados: ResultadoEstudiante[];
  // Umbrales configurables (no hardcodeados)
  umbrales: UmbralesEvaluacion;
  status: EstatusEvaluacion;
  createdAt: string;
  updatedAt: string;
}

export const ESTADO_APRENDIZAJE_INFO: Record<
  EstadoAprendizaje,
  { nombre: string; emoji: string; color: string }
> = {
  dominado: { nombre: "Dominado", emoji: "🟢", color: "#16A34A" },
  en_proceso: { nombre: "En proceso", emoji: "🟡", color: "#D97706" },
  requiere_refuerzo: { nombre: "Requiere refuerzo", emoji: "🔴", color: "#DC2626" },
};

export const ESTATUS_EVALUACION_INFO: Record<
  EstatusEvaluacion,
  { nombre: string; color: string }
> = {
  borrador: { nombre: "Borrador", color: "#6B7280" },
  publicada: { nombre: "Publicada", color: "#2563EB" },
  aplicada: { nombre: "Aplicada", color: "#D97706" },
  analizada: { nombre: "Analizada", color: "#16A34A" },
};

export const TIPO_PREGUNTA_INFO: Record<
  TipoPreguntaDiagnostica,
  { nombre: string; emoji: string }
> = {
  opcion_multiple: { nombre: "Selección múltiple", emoji: "☑️" },
  v_f: { nombre: "Verdadero / Falso", emoji: "🔘" },
  respuesta_corta: { nombre: "Respuesta corta", emoji: "✍️" },
  ejercicio: { nombre: "Ejercicio / Problema", emoji: "🧮" },
};

export const DIFICULTAD_INFO: Record<
  DificultadPregunta,
  { nombre: string; color: string }
> = {
  basica: { nombre: "Básica", color: "#16A34A" },
  media: { nombre: "Media", color: "#D97706" },
  avanzada: { nombre: "Avanzada", color: "#DC2626" },
};