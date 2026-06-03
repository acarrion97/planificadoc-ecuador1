export type Area =
  | "M"
  | "LL"
  | "CN"
  | "CS"
  | "EF"
  | "ECA"
  | "CN.B"
  | "CN.Q"
  | "CN.F"
  | "CS.H"
  | "CS.F"
  | "EFL"
  | "EG"
  | "INI";

export type Subnivel = -1 | 0 | 1 | 2 | 3 | 4 | 5;

export interface AreaInfo {
  code: Area;
  name: string;
  color: string;
  icon: string;
  emoji: string;
  bloques: Record<number, string>;
}

export interface Destreza {
  codigo: string;
  area: Area;
  subnivel: Subnivel;
  bloque: number;
  secuencial: number;
  descripcion: string;
  objetivos: string[];
  criteriosEvaluacion: string[];
  indicadoresEvaluacion: string[];
}

/**
 * Indicadores DUA por actividad: 3 principios representados como cuadrados de colores.
 * - implicacion (verde): Múltiples formas de Implicación
 * - representacion (rosa/rojo): Múltiples formas de Representación
 * - accionExpresion (azul): Múltiples formas de Acción y Expresión
 */
export interface DUAActividad {
  implicacion: boolean;
  representacion: boolean;
  accionExpresion: boolean;
}

/**
 * Fase de una clase con título, duración y actividades.
 * Cada actividad puede tener indicadores DUA asociados.
 */
export interface FaseClase {
  titulo: string;
  duracion: string;
  actividades: string[];
  /** Indicadores DUA por cada actividad (mismo índice que actividades[]) */
  duaActividades?: DUAActividad[];
}

/**
 * Estructura de una clase de 45 minutos distribuida en 4 fases ERCA:
 * - Experiencia (10 min): Activación de conocimientos previos y vivencias
 * - Reflexión (10 min): Análisis y cuestionamiento de la experiencia
 * - Conceptualización (15 min): Construcción formal del conocimiento
 * - Aplicación (10 min): Transferencia y práctica del aprendizaje
 */
export interface EstructuraClase {
  experiencia: FaseClase;
  reflexion: FaseClase;
  conceptualizacion: FaseClase;
  aplicacion: FaseClase;
}

/**
 * Tema sugerido para una destreza, con estructura de clase pre-generada
 */
export interface TemaSugerido {
  id: string;
  titulo: string;
  descripcionBreve: string;
  objetivoClase: string;
  estructura: EstructuraClase;
  recursos: string[];
  evaluacionFormativa: string;
}

/**
 * Porcentajes de estilos de aprendizaje del grupo (suman 100%)
 */
export interface EstilosAprendizajePorcentaje {
  visual: number;
  auditivo: number;
  lectorEscritor: number;
  kinestesico: number;
}

export interface Planificacion {
  id: string;
  fecha: string;
  institucion: string;
  docente: string;
  grado: string;
  asignatura: string;
  periodos: string;
  semana?: string;
  unidadDidactica?: string;
  /** Formato oficial 2026-2027 */
  periodoPedagogico?: string;
  trimestre?: string;
  nivel?: string;
  fechaInicio?: string;
  fechaFin?: string;
  paralelo?: string;
  bloquesCurriculares?: string[];
  /** Habilidades socioemocionales asociadas */
  habilidadesSocioemocionales?: string[];
  /** Porcentajes de estilos de aprendizaje del grupo */
  estilosAprendizajePorcentaje?: EstilosAprendizajePorcentaje;
  destreza: Destreza;
  objetivoAprendizaje: string;
  temaSeleccionado?: TemaSugerido;
  actividades: string;
  recursos: string;
  evaluacion: string;
  tecnicasInstrumentos: string;
  observaciones: string;
  /** Si el docente eligió trabajar con ejes transversales */
  usaEjesTransversales?: boolean;
  /** IDs de inserciones curriculares seleccionadas */
  insercionesCurriculares?: string[];
  /** Legacy: single insercion field (backward compat) */
  insercionCurricular?: string;
  /** Si el docente eligió trabajar con competencias */
  usaCompetencias?: boolean;
  /** IDs de competencias seleccionadas */
  competencias?: string[];
  /** IDs de metodologías activas seleccionadas */
  metodologiasActivas?: string[];
  /** IDs de técnicas e instrumentos de evaluación seleccionadas */
  tecnicasEvaluacionSeleccionadas?: string[];
  /** IDs de estilos de aprendizaje seleccionados */
  estilosAprendizaje?: string[];
  dua?: {
    representacion: string;
    accionExpresion: string;
    implicacion: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PLANIFICACIÓN CURRICULAR ANUAL (PCA)
// ============================================================

/** Eje transversal seleccionable en la PCA */
export interface EjeTransversalPCA {
  id: string;
  nombre: string;
  descripcion: string;
}

/** DCD seleccionada para una unidad: código + enunciado completo */
export interface DcdSeleccionada {
  codigo: string;
  enunciado: string;
}

/** Una unidad de planificación dentro de la PCA */
export interface PcaUnidad {
  id: string;
  /** Número de unidad (1, 2, 3...) */
  numero: number;
  /** DCD seleccionadas por el docente para esta unidad */
  dcdsSeleccionadas: DcdSeleccionada[];
  /** Duración en semanas — el docente la define */
  duracionSemanas: number;
  // ──── Campos generados por la IA ────
  titulo?: string;
  objetivosEspecificos?: string;
  contenidos?: string;
  orientacionesMetodologicas?: string;
  evaluacion?: string;
}

/** Datos del formulario PCA que el docente completa (Tipo A) */
export interface PcaFormData {
  institucion: string;
  docente: string;
  area: Area;
  subnivel: Subnivel;
  grado: string;
  anioLectivo: string;
  paralelo: string;
  // Sección Tiempo
  cargaHorariaSemanal: number;
  semanasTrabajoTotal: number;
  semanasEvaluacion: number;
  // Sección Ejes Transversales
  usaEjesTransversales: boolean;
  ejesTransversales: string[];
  // Sección Unidades
  unidades: PcaUnidad[];
  // Sección Metodologías y Evaluación
  metodologiasActivas: string[];
  tecnicasEvaluacion: string[];
  // Sección Bibliografía
  bibliografiaDocente: string;
  // Sección Firmas
  firmaElaboradoPor: string;
  firmaElaboradoFecha: string;
  firmaRevisadoPor: string;
  firmaRevisadoFecha: string;
  firmaAprobadoPor: string;
  firmaAprobadoFecha: string;
}

/** Resultado completo generado por la IA para la PCA */
export interface PcaAiResult {
  objetivosArea: string;
  objetivosGrado: string;
  unidades: Array<{
    numero: number;
    titulo: string;
    objetivosEspecificos: string;
    contenidos: string;
    orientacionesMetodologicas: string;
    evaluacion: string;
    duracionSemanas: number;
  }>;
  bibliografiaSugerida: string;
  observaciones: string;
}

/** Documento PCA completo tal como se guarda en la BD */
export interface PcaDocument {
  id: number;
  sessionId: string;
  status: "draft" | "generated" | "paid";
  formData: PcaFormData;
  aiResult: PcaAiResult | null;
  clientTransactionId: string | null;
  payphoneTransactionId: number | null;
  authorizationCode: string | null;
  amountPaid: number | null;
  createdAt: string;
  updatedAt: string;
}

export const SUBNIVEL_NAMES: Record<Subnivel, string> = {
  1: "Preparatoria",
  2: "Básica Elemental",
  3: "Básica Media",
  4: "Básica Superior",
  5: "Bachillerato",
};

export const SUBNIVEL_GRADOS: Record<Subnivel, string> = {
  1: "1er grado EGB",
  2: "2do - 4to grado EGB",
  3: "5to - 7mo grado EGB",
  4: "8vo - 10mo grado EGB",
  5: "1ro - 3ro BGU",
};

// ============================================================
// PLANIFICACIÓN SEMANAL
// ============================================================

/** Una hora de clase dentro de un día de la semana */
export interface HoraSemanal {
  id: string;
  codigoDestreza: string;
  destreza: Destreza | null;
  tema: string;
  temasAlternativos: TemaSugerido[];
  temaSeleccionado: TemaSugerido | null;
  // Configuración didáctica por hora (antes estaban en ConfiguracionDia)
  habilidadesSocioemocionales: string[];
  usaEjesTransversales: boolean;
  insercionesCurriculares: string[];
  usaCompetencias: boolean;
  competencias: string[];
  metodologiasActivas: string[];
  tecnicasEvaluacion: string[];
}

/** Configuración completa de un día de la semana */
export interface ConfiguracionDia {
  activo: boolean;
  cantidadHoras: 1 | 2 | 3;
  horas: HoraSemanal[];
}

/** Planificación semanal completa (5 días) */
export interface PlanificacionSemanal {
  id: string;
  fecha: string;
  semanaInicio: string;
  semanaFin: string;
  institucion: string;
  docente: string;
  grado: string;
  nivel: string;
  paralelo: string;
  periodoPedagogico: string;
  trimestre: string;
  periodos: string;
  numeroUnidad: string;
  tituloUnidad: string;
  objetivosUnidad: string;
  duaRepresentacion: string;
  duaAccionExpresion: string;
  duaImplicacion: string;
  pctVisual: string;
  pctAuditivo: string;
  pctLectorEscritor: string;
  pctKinestesico: string;
  dias: {
    lunes: ConfiguracionDia;
    martes: ConfiguracionDia;
    miercoles: ConfiguracionDia;
    jueves: ConfiguracionDia;
    viernes: ConfiguracionDia;
  };
  createdAt: string;
  updatedAt: string;
}

export const AREAS_INFO: Record<Area, AreaInfo> = {
  M: {
    code: "M",
    name: "Matemática",
    color: "#2563EB",
    icon: "calculate",
    emoji: "\uD83D\uDD22",
    bloques: {
      1: "Álgebra y funciones",
      2: "Geometría y medida",
      3: "Estadística y probabilidad",
    },
  },
  LL: {
    code: "LL",
    name: "Lengua y Literatura",
    color: "#DC2626",
    icon: "menu-book",
    emoji: "\uD83D\uDCD6",
    bloques: {
      1: "Lengua y cultura",
      2: "Comunicación oral",
      3: "Lectura",
      4: "Escritura",
      5: "Literatura",
    },
  },
  CN: {
    code: "CN",
    name: "Ciencias Naturales",
    color: "#16A34A",
    icon: "science",
    emoji: "\uD83E\uDDEA",
    bloques: {
      1: "Los seres vivos y su ambiente",
      2: "Cuerpo humano y salud",
      3: "Materia y energía",
      4: "La Tierra y el Universo",
      5: "Ciencia en acción",
    },
  },
  CS: {
    code: "CS",
    name: "Estudios Sociales",
    color: "#D97706",
    icon: "public",
    emoji: "\uD83C\uDF0D",
    bloques: {
      1: "Historia e identidad",
      2: "Los seres humanos en el espacio",
      3: "La convivencia",
    },
  },
  EF: {
    code: "EF",
    name: "Educación Física",
    color: "#7C3AED",
    icon: "sports-soccer",
    emoji: "\u26BD",
    bloques: {
      1: "Prácticas lúdicas: los juegos y el jugar",
      2: "Prácticas gimnásticas",
      3: "Prácticas corporales expresivo-comunicativas",
      4: "Prácticas deportivas",
      5: "Construcción de la identidad corporal",
      6: "Relaciones entre prácticas corporales y salud",
    },
  },
  ECA: {
    code: "ECA",
    name: "Educación Cultural y Artística",
    color: "#EC4899",
    icon: "palette",
    emoji: "\uD83C\uDFA8",
    bloques: {
      1: "El yo: la identidad",
      2: "El encuentro con otros: la alteridad",
      3: "El entorno: espacio, tiempo y objetos",
    },
  },
  "CN.B": {
    code: "CN.B",
    name: "Biología",
    color: "#059669",
    icon: "biotech",
    emoji: "\uD83E\uDDA0",
    bloques: {
      1: "Origen y evolución de la vida",
      2: "Biología celular",
      3: "Biología animal y vegetal",
      4: "Cuerpo humano y salud",
      5: "Biología en acción",
    },
  },
  "CN.Q": {
    code: "CN.Q",
    name: "Química",
    color: "#7C3AED",
    icon: "science",
    emoji: "\u2697\uFE0F",
    bloques: {
      1: "Materia y sus transformaciones",
      2: "Estructura atómica y tabla periódica",
      3: "Reacciones químicas y estequiometría",
      4: "Química orgánica",
      5: "Química en acción",
    },
  },
  "CN.F": {
    code: "CN.F",
    name: "Física",
    color: "#0284C7",
    icon: "bolt",
    emoji: "\u269B\uFE0F",
    bloques: {
      1: "Movimiento y fuerza",
      2: "Energía, trabajo y potencia",
      3: "Ondas y sonido",
      4: "Óptica y luz",
      5: "Electricidad y magnetismo",
      6: "Física moderna y nuclear",
    },
  },
  "CS.H": {
    code: "CS.H",
    name: "Historia",
    color: "#B45309",
    icon: "history-edu",
    emoji: "\uD83C\uDFDB\uFE0F",
    bloques: {
      1: "Cultura y orígenes de la humanidad",
      2: "Civilizaciones antiguas y medievales",
      3: "América Latina y el mundo moderno",
      4: "Economía, sociedad y política contemporánea",
    },
  },
  "CS.F": {
    code: "CS.F",
    name: "Filosofía",
    color: "#6D28D9",
    icon: "psychology",
    emoji: "\uD83E\uDDD0",
    bloques: {
      1: "El origen del pensamiento filosófico y su método",
      2: "La argumentación y la construcción del discurso lógico",
      3: "Filosofía occidental y latinoamericana",
      4: "El individuo y la comunidad: lo ético, lo estético y lo hedónico",
    },
  },
  EFL: {
    code: "EFL",
    name: "Inglés",
    color: "#0369A1",
    icon: "translate",
    emoji: "\uD83C\uDF10",
    bloques: {
      1: "Communication and cultural awareness",
      2: "Oral communication",
      3: "Reading",
      4: "Writing",
      5: "Language through the arts",
    },
  },
  EG: {
    code: "EG",
    name: "Emprendimiento y Gestión",
    color: "#CA8A04",
    icon: "business-center",
    emoji: "\uD83D\uDCBC",
    bloques: {
      1: "Contabilidad y administración",
      2: "Legislación laboral y tributaria",
      3: "Economía y finanzas",
      4: "Emprendimiento e innovación",
      5: "Plan de negocios",
    },
  },
  INI: {
    code: "INI",
    name: "Educación Inicial",
    color: "#0EA5E9",
    icon: "child-care",
    emoji: "🧒",
    bloques: {
      1: "Identidad y Autonomía",
      2: "Convivencia",
      3: "Relaciones con el medio natural y cultural",
      4: "Relaciones lógico-matemáticas",
      5: "Comprensión y Expresión del Lenguaje",
      6: "Expresión Artística",
      7: "Expresión corporal y motricidad",
    },
  },
};
