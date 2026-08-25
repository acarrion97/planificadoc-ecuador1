/**
 * Tipos de planificación soportados por el flujo de importación (ver
 * openspec/changes/importar-formato-planificacion/proposal.md). Solo "pca"
 * tiene huella, parser de campos y completado con IA implementados en esta
 * primera etapa (ver design.md, Open Questions y tasks.md) — los demás están
 * declarados para que el catálogo y el matcher ya los reconozcan como
 * "formato no soportado aún" en vez de "no reconocido en absoluto", y para no
 * tener que rediseñar el registro cuando se agreguen.
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

/** Tipos con pipeline de reconocimiento + IA completamente implementado. */
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

export class ArchivoNoProcesableError extends Error {
  constructor(message = "El archivo no pudo procesarse.") {
    super(message);
    this.name = "ArchivoNoProcesableError";
  }
}

export type ResultadoReconocimiento = {
  tipo: TipoPlanificacion | "no_reconocido";
  score: number;
};

/** Campos de PCA que el matcher puede haber extraído del documento importado. */
export type PcaCamposExtraidos = {
  institucion?: string;
  docente?: string;
  area?: string;
  grado?: string;
  paralelo?: string;
  anioLectivo?: string;
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
