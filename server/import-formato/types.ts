/**
 * Tipos de planificación soportados por el flujo de importación.
 *
 * Cada tipo tiene un handler que implementa: mapear → completar → guardar → destino.
 */
export const TIPOS_PLANIFICACION = [
  "pca",
  "pca_trimestral",
  "adaptacion_curricular",
  "plan_semanal",
  "plan_inicial",
  "cnc",
  "evaluacion_diagnostica",
  "bt",
] as const;

export type TipoPlanificacion = (typeof TIPOS_PLANIFICACION)[number];

/** Tipos con handler de importación completamente implementado. */
export const TIPOS_IMPLEMENTADOS: TipoPlanificacion[] = ["pca"];

export type ExtensionSoportada = "doc" | "docx" | "pdf";

/** Una celda de tabla reconocida en el documento (fila → columnas → texto). */
export type FilaTabla = string[];

/**
 * Resultado neutral de parsear un archivo subido, antes de saber a qué tipo
 * de planificación corresponde. `tablas` solo se llena para `.docx` (única
 * extensión donde preservamos fila/celda); `.doc`/`.pdf` solo aportan texto
 * plano en `textoPlano`.
 */
export type DocumentoParseado = {
  extension: ExtensionSoportada;
  textoPlano: string;
  tablas: FilaTabla[][];
};

// ─── Huellas ────────────────────────────────────────────────────────────────

/**
 * Huella de un tipo de planificación: encabezados esperados con peso y
 * exclusividad para evitar falsos positivos entre tipos similares.
 *
 * - `obligatorias`: si alguna falta, el tipo no puede ser el correcto.
 * - `opcionales`: suman score pero su ausencia no descarta.
 * - `exclusivas`: si están presentes, otros tipos con las mismas
 *   palabras clave deberían tener penalización.
 * - `penalizadoras`: palabras que, si aparecen, reducen el score de este tipo
 *   (ej. "TRIMESTRE" penaliza PCA anual).
 */
export type Huella = {
  obligatorias: string[];
  opcionales: string[];
  exclusivas: string[];
  penalizadoras: string[];
};

// ─── Reconocimiento ─────────────────────────────────────────────────────────

export type ResultadoReconocimiento =
  | {
      estado: "reconocido";
      tipo: TipoPlanificacion;
      score: number;
    }
  | {
      estado: "ambiguo";
      candidatos: Array<{ tipo: TipoPlanificacion; score: number }>;
    }
  | {
      estado: "no_reconocido";
    };

// ─── Campos extraídos (genérico) ────────────────────────────────────────────

/**
 * Campos extraídos por un mapeador específico del tipo.
 * Cada tipo define su propia forma concreta que extiende esta base.
 */
export type CamposExtraidosBase = {
  institucion?: string;
  docente?: string;
  area?: string;
  grado?: string;
  paralelo?: string;
  anioLectivo?: string;
};

// ─── Resultado de guardado ──────────────────────────────────────────────────

export type ResultadoGuardado = {
  resourceId: number;
  destination: string;
};

// ─── ImportHandler (contrato por tipo) ──────────────────────────────────────

/**
 * Contrato que cada tipo de planificación debe implementar para ser importado.
 *
 * El orquestador (`importer.ts`) llama en orden:
 *   1. `mapear` — extrae campos del documento parseado
 *   2. `completar` — usa IA para llenar campos vacíos
 *   3. `guardar` — persiste en la tabla/DB del tipo y devuelve destino
 *
 * El parámetro `originalBuffer` es opcional y contiene el buffer original
 * del archivo subido. Se usa para crear plantillas de exportación.
 */
export type ImportHandler<Campos = CamposExtraidosBase, ResultadoIA = unknown> = {
  /** Extrae campos del documento parseado (tablas + texto plano). */
  mapear: (documento: DocumentoParseado) => Campos;

  /** Completa campos vacíos con IA y/o planificación existente. */
  completar: (
    campos: Campos,
    sessionId: string
  ) => Promise<ResultadoIA>;

  /** Guarda el resultado y devuelve la ruta de navegación. */
  guardar: (
    campos: Campos,
    resultadoIA: ResultadoIA,
    sessionId: string,
    originalBuffer?: Buffer
  ) => Promise<ResultadoGuardado>;
};

// ─── Resultado de importación (polimórfico) ─────────────────────────────────

export type ResultadoImportacion =
  | {
      success: true;
      importId: number;
      tipo: TipoPlanificacion;
      resourceId: number;
      destination: string;
    }
  | {
      success: false;
      importId: number | null;
      error: string;
      candidatos?: Array<{ tipo: TipoPlanificacion; score: number }>;
    };

// ─── Errores ────────────────────────────────────────────────────────────────

export class ArchivoNoProcesableError extends Error {
  constructor(message = "El archivo no pudo procesarse.") {
    super(message);
    this.name = "ArchivoNoProcesableError";
  }
}

// ─── Plantillas de exportación ──────────────────────────────────────────────

/**
 * Estructura física del documento original analizado.
 * Para DOCX: tabla → fila → celda con rowSpan/colSpan.
 * El archivo original es la fuente de verdad visual; esto es el mapa navegable.
 */
export type PlantillaEstructura = {
  version: 1;
  tipo: "docx" | "pdf";

  paginas?: {
    orientation?: "portrait" | "landscape";
    width?: number;
    height?: number;
    margins?: { top: number; right: number; bottom: number; left: number };
  };

  tablas: Array<{
    index: number;
    filas: number;
    columnas: number;
    rows: Array<{
      index: number;
      cells: Array<{
        index: number;
        rowSpan: number;
        colSpan: number;
        textoOriginal: string;
        width?: number;
      }>;
    }>;
  }>;
};

/** Tipo de ubicación física de un campo en el documento. */
export type DocxCellLocation = {
  tipo: "docx-cell";
  tabla: number;
  fila: number;
  columna: number;
};

export type PdfRegionLocation = {
  tipo: "pdf-region";
  pagina: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  align?: "left" | "center" | "right";
};

export type FieldLocation = DocxCellLocation | PdfRegionLocation;

/**
 * Binding: relación entre un campo canónico de la planificación
 * y su ubicación física en el documento original.
 */
export type FieldBinding = {
  id: string;
  campo: string;
  tipo: "text" | "number" | "date" | "list" | "richtext";
  ubicacion: FieldLocation;
  transformacion?: string;
  obligatorio?: boolean;
};

/**
 * Región repetible: filas de una tabla que se repiten por cada elemento
 * del array de datos (ej. unidades de PCA, días de plan semanal).
 */
export type RepeatRegion = {
  id: string;
  nombre: string;
  origenDatos: string;
  ubicacion: {
    tipo: "docx-table";
    tabla: number;
    filaInicio: number;
    filaPlantilla: number;
  };
  columnas: Array<{
    campo: string;
    columna: number;
    celdaFisica: number;
  }>;
};

/**
 * Contenedor de todos los bindings de una plantilla.
 */
export type PlantillaBindings = {
  campos: FieldBinding[];
  regionesRepetibles: RepeatRegion[];
};

/**
 * Configuración de exportación de una plantilla.
 */
export type PlantillaConfiguracion = {
  /** Nombre del archivo de salida */
  nombreArchivo?: string;
  /** Orientación de página (override) */
  orientation?: "portrait" | "landscape";
  /** Si true, agregar numeración de páginas */
  numerarPaginas?: boolean;
  /** Si true, agregar marca de agua */
  marcaDeAgua?: string;
};

/**
 * Resultado de analizar un DOCX y crear la plantilla.
 */
export type PlantillaAnalisis = {
  estructura: PlantillaEstructura;
  bindings: PlantillaBindings;
  configuracion: PlantillaConfiguracion;
};

// ─── Legacy (PCA) ───────────────────────────────────────────────────────────
// Mantener temporalmente hasta migrar PCA al nuevo contrato.

export type PcaCamposExtraidos = CamposExtraidosBase & {
  cargaHorariaSemanal?: number;
  semanasTrabajoTotal?: number;
  semanasEvaluacion?: number;
  objetivosArea?: string;
  objetivosGrado?: string;
  bibliografia?: string;
  observaciones?: string;
  unidades: Array<{
    numero: number;
    titulo?: string;
    objetivosEspecificos?: string;
    contenidos?: string;
    orientacionesMetodologicas?: string;
    evaluacion?: string;
    duracionSemanas?: number;
  }>;
};
