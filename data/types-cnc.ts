/**
 * Tipos del módulo "Conecta, Nivela y Crea" (CNC) — programa oficial MinEduc
 * de arranque del año escolar (5 semanas, 3 fases), aplicable a TODOS los
 * niveles y ofertas del sistema (Lineamientos Pedagógicos Costa-Galápagos
 * 2026-2027), incluido Bachillerato Técnico (modalidad "bt").
 *
 * Semana 1 "Conecta": adaptación + diagnóstico dual (académico + socioemocional,
 * coordinado con DECE). Semanas 2-3 "Nivela": refuerzo de Lengua/Matemática con
 * "conivelación" (tutoría entre pares). Semanas 4-5 "Crea": proyecto
 * interdisciplinario que se aplica al finalizar el trimestre y corresponde a la
 * evaluación sumativa.
 *
 * En modalidad "bt" se agregan campos técnicos (prerrequisitos de la Figura
 * Profesional, nivelación procedimental, producto acreditable) anclados al
 * catálogo real de data/bachillerato-tecnico.ts / data/bachillerato-tecnico-uc.ts
 * (solo lectura — este archivo, junto con lib/planificaciones-cnc-context.tsx y
 * server/cnc-router.ts, es intencionalmente independiente del contexto/router/
 * persistencia de EGB-BGU (data/types.ts) y de BT (data/types-bt.ts) para no
 * arriesgar ninguno de los flujos existentes).
 */

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
  actividadesAdaptacion: string[];
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

/** Pareja de "conivelación" — tutoría entre pares, estrategia nombrada explícitamente */
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

export interface ProyectoInterdisciplinarioCNC {
  titulo: string;
  descripcion: string;
  /** CN, CS, ECA, etc. */
  areasIntegradas: string[];
  /** Producto final explícito del proyecto (sugerido por IA si vacío, editable) */
  productoFinal: string;
  /** Actividades concretas de la Semana 4 (planificación, elaboración, revisión...) */
  actividadesSemana4: string[];
  /** Actividades concretas de la Semana 5 (finalización, socialización, reflexión...) */
  actividadesSemana5: string[];
  /** códigos del diagnóstico de Semana 1 que este proyecto refuerza */
  destrezasReforzadas: string[];
  evidenciasCognitivas: string[];
  evidenciasActitudinales: string[];
  /** Flag fija — el proyecto interdisciplinario corresponde a la evaluación sumativa del trimestre (lineamientos MinEduc 2026-2027) */
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
  actividadesAdaptacionSugeridas: string[];
  tecnicaDiagnosticoSugerida: string[];
  actividadesNivelacionSugeridas: (ActividadNivelacionCNC & { estrategiaConivelacion?: string })[];
  proyectoSugerido: ProyectoInterdisciplinarioCNC;
  /** Resumen narrativo de las 5 semanas, para el encabezado del documento */
  cronogramaSemanal: string;
  /** Recursos didácticos sugeridos para la Semana 1 (columna RECURSOS del documento) */
  recursosSemana1Sugeridos: string[];
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
