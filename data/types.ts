export type Area =
  | "M"
  | "LL"
  | "CN"
  | "CS"
  | "EF"
  | "ECA";

export type Subnivel = 1 | 2 | 3 | 4 | 5;

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
 * Fase de una clase con título, duración y actividades.
 */
export interface FaseClase {
  titulo: string;
  duracion: string;
  actividades: string[];
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

export interface Planificacion {
  id: string;
  fecha: string;
  institucion: string;
  docente: string;
  grado: string;
  asignatura: string;
  periodos: string;
  destreza: Destreza;
  objetivoAprendizaje: string;
  temaSeleccionado?: TemaSugerido;
  actividades: string;
  recursos: string;
  evaluacion: string;
  tecnicasInstrumentos: string;
  observaciones: string;
  dua?: {
    representacion: string;
    accionExpresion: string;
    implicacion: string;
  };
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

export const AREAS_INFO: Record<Area, AreaInfo> = {
  M: {
    code: "M",
    name: "Matemática",
    color: "#2563EB",
    icon: "calculate",
    emoji: "\uD83D\uDD22", // 🔢
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
    emoji: "\uD83D\uDCD6", // 📖
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
    emoji: "\uD83E\uDDEA", // 🧪
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
    emoji: "\uD83C\uDF0D", // 🌍
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
    emoji: "\u26BD", // ⚽
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
    emoji: "\uD83C\uDFA8", // 🎨
    bloques: {
      1: "El yo: la identidad",
      2: "El encuentro con otros: la alteridad",
      3: "El entorno: espacio, tiempo y objetos",
    },
  },
};
