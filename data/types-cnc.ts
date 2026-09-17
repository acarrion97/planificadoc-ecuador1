/**
 * Tipos del módulo "Conecta, Nivela y Crea" (CNC) — programa oficial MinEduc
 * de arranque del año escolar (5 semanas, 3 fases), aplicable a TODOS los
 * niveles y ofertas del sistema (Lineamientos Pedagógicos Costa-Galápagos
 * 2026-2027), incluido Bachillerato Técnico (modalidad "bt").
 *
 * Semana 1 "Conecta": adaptación + diagnóstico dual (académico + socioemocional,
 * coordinado con DECE), con metodología declarada (calibrada por subnivel vía
 * `lib/curriculo-prerrequisitos.ts`) y principios DUA por actividad. Semanas
 * 2-3 "Nivela": refuerzo de Lengua/Matemática con "co-nivelación" (tutoría
 * entre pares). Semanas 4-5 "Crea": proyecto interdisciplinario que cuenta
 * formalmente como evaluación cualitativa formativa oficial.
 *
 * En modalidad "bt" se agregan campos técnicos (prerrequisitos de la Figura
 * Profesional, nivelación procedimental, producto acreditable) anclados al
 * catálogo real de data/bachillerato-tecnico.ts / data/bachillerato-tecnico-uc.ts
 * (solo lectura — este archivo, junto con lib/planificaciones-cnc-context.tsx y
 * server/cnc-router.ts, es intencionalmente independiente del contexto/router/
 * persistencia de EGB-BGU (data/types.ts) y de BT (data/types-bt.ts) para no
 * arriesgar ninguno de los flujos existentes; se importa únicamente el tipo
 * `DUAActividad` de data/types.ts, sin ningún acoplamiento de runtime).
 */

import type { DUAActividad } from "./types";

// ─── Semana 1 — Conecta ──────────────────────────────────────────────────────

export interface DiagnosticoAcademicoCNC {
  destrezaCodigo: string;
  destrezaDescripcion: string;
  area: "LL" | "M";
  observaciones: string;
  nivelDetectado: "logrado" | "en_proceso" | "iniciado";
}

export interface DiagnosticoSocioemocionalCNC {
  /** id de HABILIDADES_SOCIOEMOCIONALES (data/habilidades-socioemocionales.ts) */
  habilidadId: string;
  observaciones: string;
}

export interface Semana1CNC {
  /**
   * Estrategia/metodología pedagógica declarada para la semana (p. ej. "círculo
   * de lectura", "juego-trabajo"), coherente con el subnivel y el propósito —
   * ver `estrategiasMetodologicasPorSubnivel()` en lib/curriculo-prerrequisitos.ts
   * para los ejemplos oficiales que orientan (no limitan) esta declaración.
   */
  metodologiaDeclarada: string;
  actividadesAdaptacion: string[];
  /** Indicadores DUA por cada actividad de adaptación (mismo índice que actividadesAdaptacion[]) */
  duaActividadesAdaptacion?: DUAActividad[];
  diagnosticoAcademico: DiagnosticoAcademicoCNC[];
  diagnosticoSocioemocional: DiagnosticoSocioemocionalCNC[];
  /** Nota libre de coordinación con el equipo DECE — sin sobre-modelar */
  coordinacionDece: string;
  /** Técnicas de reflexión directa, ej. "¿qué nos falta por aprender?" */
  tecnicasReflexion: string[];
}

/** Solo aplica si modalidad === "bt" */
export interface DiagnosticoTecnicoBT {
  /** CD/CE/RA real del módulo elegido — nunca inventado */
  criterioId: string;
  criterioTexto: string;
  observaciones: string;
  nivelDetectado: "logrado" | "en_proceso" | "iniciado";
}

export interface Semana1CNCExtraBT {
  /** Talleres, laboratorios, granjas reconocidos en la Semana 1 */
  reconocimientoEspacios: string[];
  diagnosticoTecnico: DiagnosticoTecnicoBT[];
}

// ─── Semanas 2-3 — Nivela ────────────────────────────────────────────────────

/** Pareja de "co-nivelación" — tutoría entre pares, estrategia nombrada explícitamente en el documento oficial (Lineamientos Costa-Galápagos 2026-2027). El nombre del tipo (`ParejaConivelacion`) se mantiene sin guion por compatibilidad con datos ya persistidos. */
export interface ParejaConivelacion {
  id: string;
  estudianteApoyoNombre: string;
  estudianteApoyadoNombre: string;
  destrezaFocoCodigo: string;
  destrezaFocoDescripcion: string;
  notas?: string;
}

export interface ActividadNivelacionCNC {
  destrezaCodigo: string;
  destrezaDescripcion: string;
  area: "LL" | "M";
  descripcionActividad: string;
  semana: 2 | 3;
}

export interface Semana2y3CNC {
  actividadesNivelacion: ActividadNivelacionCNC[];
  parejasConivelacion: ParejaConivelacion[];
}

/** Solo aplica si modalidad === "bt" */
export interface ActividadNivelacionTecnicaBT {
  criterioId: string;
  criterioTexto: string;
  descripcionActividad: string;
  semana: 2 | 3;
  /** Cómo se articula esta nivelación técnica con el refuerzo de Matemática */
  articulacionMatematica?: string;
}

export interface Semana2y3CNCExtraBT {
  actividadesNivelacionTecnica: ActividadNivelacionTecnicaBT[];
}

// ─── Semanas 4-5 — Crea ──────────────────────────────────────────────────────

/**
 * Escala de desempeño estándar del sistema de evaluación ecuatoriano (1-10),
 * usada para diseñar la rúbrica del proyecto interdisciplinar. Verificado en
 * "Sugerencias para el diseño de un proyecto interdisciplinar" (Dirección
 * Nacional de Estándares Educativos, paquete oficial 2026-2027,
 * educacion.gob.ec) — Tabla 1, ejemplo de rúbrica de Básica Superior.
 */
export type NivelDesempenoRubrica = "avanzado" | "intermedio" | "basico" | "en_desarrollo";

export const NIVELES_DESEMPENO_RUBRICA: Record<NivelDesempenoRubrica, { nombre: string; rango: string }> = {
  avanzado: { nombre: "Avanzado", rango: "10-9" },
  intermedio: { nombre: "Intermedio", rango: "8-7" },
  basico: { nombre: "Básico", rango: "6-5" },
  en_desarrollo: { nombre: "En Desarrollo", rango: "4-1" },
};

export interface ProyectoInterdisciplinarioCNC {
  titulo: string;
  descripcion: string;
  /** CN, CS, ECA, etc. */
  areasIntegradas: string[];
  /**
   * Objetivo de aprendizaje rector del proyecto (Paso 1 del instructivo
   * oficial: "Seleccionar el objetivo de aprendizaje que atenderá el
   * proyecto interdisciplinar").
   */
  objetivoAprendizaje: string;
  /** Producto final explícito del proyecto (sugerido por IA si vacío, editable) */
  productoFinal: string;
  /**
   * Producto intermedio: primer entregable, al término de la Semana 4 —
   * distinto del producto final de Semana 5 (Anexo 2 del instructivo oficial).
   */
  productoIntermedio: string;
  /** Objetivo semanal — logros a alcanzar al término de la Semana 4 */
  objetivoSemana4: string;
  /** Objetivo semanal — logros a alcanzar al término de la Semana 5 */
  objetivoSemana5: string;
  /** Actividades concretas de la Semana 4 (planificación, elaboración, revisión...) */
  actividadesSemana4: string[];
  /** Actividades concretas de la Semana 5 (finalización, socialización, reflexión...) */
  actividadesSemana5: string[];
  /**
   * Códigos del diagnóstico de Semana 1 que este proyecto refuerza —
   * seleccionados por el docente; la IA los sugiere si se dejan vacíos. Base
   * para derivar la rúbrica (indicadores reales del catálogo por destreza).
   */
  destrezasReforzadas: string[];
  evidenciasCognitivas: string[];
  evidenciasActitudinales: string[];
  /**
   * Compromisos surgidos de la puesta en común y reflexión grupal al cierre
   * del proyecto (Anexo 2 del instructivo oficial).
   */
  compromisos: string;
  /** Preguntas de autoevaluación/metacognición para el estudiantado */
  autoevaluacion: string[];
  /**
   * Flag fija, no editable por el docente — el proyecto interdisciplinario
   * es formalmente una evaluación cualitativa formativa oficial (Lineamientos
   * Pedagógicos Costa-Galápagos 2026-2027, Sección 2.1, pág. 15: "La
   * evaluación del proyecto interdisciplinar será cualitativa y se
   * considerará como una de las evaluaciones formativas del año lectivo en
   * curso"). No confundir con la evaluación sumativa trimestral del piloto
   * de Currículo por Competencias de Sierra-Amazonía Zona 6, que es un
   * programa distinto.
   */
  esEvaluacionFormativaOficial: true;
}

export interface Semana4y5CNC {
  proyecto: ProyectoInterdisciplinarioCNC;
}

/**
 * Solo aplica si modalidad === "bt" — reemplaza el proyecto genérico por un
 * producto técnico-práctico. Las figuras profesionales de BT no son todas
 * industriales (Atención a la Primera Infancia, Gestión Cultural, Hostelería,
 * Seguridad Ciudadana, Actividad Física y Deporte, etc. son de servicio o
 * cuidado), por eso el tipo incluye categorías más allá de las técnicas.
 */
export interface ProductoAcreditableBT {
  tipo:
    | "maqueta"
    | "software_basico"
    | "plan_negocio"
    | "mantenimiento_equipo"
    | "servicio_programa"
    | "evento_presentacion"
    | "material_protocolo"
    | "otro";
  descripcion: string;
  /** Actividades concretas de elaboración del producto (Semana 4) */
  actividadesSemana4: string[];
  /** Actividades concretas de presentación del producto (Semana 5) */
  actividadesSemana5: string[];
}

export interface Semana4y5CNCExtraBT {
  productoAcreditable: ProductoAcreditableBT;
}

// ─── Resultado de IA ─────────────────────────────────────────────────────────

export interface ConectaNivelaCreaAiResult {
  /** Estrategia/metodología sugerida para Semana 1 — ver Semana1CNC.metodologiaDeclarada */
  metodologiaDeclaradaSugerida?: string;
  actividadesAdaptacionSugeridas: string[];
  /** Indicadores DUA por cada actividad sugerida (mismo índice que actividadesAdaptacionSugeridas[]) */
  duaActividadesAdaptacionSugeridas?: DUAActividad[];
  tecnicaDiagnosticoSugerida: string[];
  /** Indicadores DUA por cada técnica/instrumento sugerido (mismo índice que tecnicaDiagnosticoSugerida[]) */
  duaTecnicaDiagnosticoSugerida?: DUAActividad[];
  actividadesNivelacionSugeridas: (ActividadNivelacionCNC & { estrategiaConivelacion?: string })[];
  proyectoSugerido: ProyectoInterdisciplinarioCNC;
  /** Resumen narrativo de las 5 semanas, para el encabezado del documento */
  cronogramaSemanal: string;
  /** Recursos didácticos sugeridos para la Semana 1 (columna RECURSOS del documento) */
  recursosSemana1Sugeridos: string[];
  /** Recursos/materiales sugeridos para el proyecto o producto acreditable de las Semanas 4-5 (columna RECURSOS) */
  recursosProyectoSugeridos?: string[];
  /** Actividades evaluativas sugeridas para las Semanas 2-3 (columna ACTIVIDADES EVALUATIVAS) */
  actividadesEvaluativasNivelacionSugeridas: string[];
  // presentes solo si modalidad === "bt"
  diagnosticoTecnicoSugerido?: DiagnosticoTecnicoBT[];
  actividadesNivelacionTecnicaSugeridas?: ActividadNivelacionTecnicaBT[];
  productoAcreditableSugerido?: ProductoAcreditableBT;
}

// ─── Documento raíz ──────────────────────────────────────────────────────────

export interface PlanConectaNivelaCrea {
  id: string;
  institucion: string;
  docente: string;
  anioLectivo: string;
  grado: string;
  paralelo: string;
  subnivel: string;
  fechaInicio: string;

  modalidad: "general" | "bt";
  /** Solo si modalidad === "bt" — ids del catálogo estático de data/bachillerato-tecnico.ts */
  figuraProfesionalId?: string;
  moduloId?: string;

  semana1: Semana1CNC;
  semana1BT?: Semana1CNCExtraBT;
  semana2y3: Semana2y3CNC;
  semana2y3BT?: Semana2y3CNCExtraBT;
  semana4y5: Semana4y5CNC;
  semana4y5BT?: Semana4y5CNCExtraBT;

  aiResult?: ConectaNivelaCreaAiResult;
  status: "borrador" | "generado";
  createdAt: string;
  updatedAt: string;
}
