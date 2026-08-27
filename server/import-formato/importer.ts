import {
  DocumentoParseado,
  ImportHandler,
  ResultadoImportacion,
  ResultadoGuardado,
  TipoPlanificacion,
  TIPOS_IMPLEMENTADOS,
} from "./types";

/**
 * Registro de handlers por tipo de planificación.
 *
 * Cada handler implementa el contrato completo:
 *   mapear → completar → guardar → destino
 *
 * El orquestador (`importar`) usa este mapa para despachar
 * sin necesidad de un switch gigante en el router.
 */
const IMPORT_HANDLERS: Partial<Record<TipoPlanificacion, ImportHandler>> = {};

/**
 * Registra un handler para un tipo de planificación.
 *
 * Llamar al inicio de la aplicación o en el módulo del handler:
 *
 *   import { registrarHandler } from "./importer";
 *   import { pcaHandler } from "./handlers/pca";
 *   registrarHandler("pca", pcaHandler);
 */
export function registrarHandler<Campos, ResultadoIA>(
  tipo: TipoPlanificacion,
  handler: ImportHandler<Campos, ResultadoIA>
): void {
  IMPORT_HANDLERS[tipo] = handler as unknown as ImportHandler;
}

/**
 * Obtiene el handler registrado para un tipo.
 */
export function obtenerHandler(
  tipo: TipoPlanificacion
): ImportHandler | null {
  return IMPORT_HANDLERS[tipo] ?? null;
}

/**
 * Verifica si un tipo tiene handler implementado.
 */
export function tipoImplementado(tipo: TipoPlanificacion): boolean {
  return tipo in IMPORT_HANDLERS;
}

/**
 * Orquestador principal del flujo de importación.
 *
 * Flujo:
 *   1. Validar que el tipo tenga handler
 *   2. Ejecutar handler.mapear(documento)
 *   3. Ejecutar handler.completar(campos, sessionId)
 *   4. Ejecutar handler.guardar(campos, resultadoIA, sessionId, originalBuffer)
 *   5. Devolver ResultadoImportacion con destination
 *
 * Si cualquier paso falla, captura el error y devuelve
 * ResultadoImportacion con success: false.
 */
export async function importar(
  documento: DocumentoParseado,
  tipo: TipoPlanificacion,
  sessionId: string,
  importId: number,
  originalBuffer?: Buffer
): Promise<ResultadoImportacion> {
  const handler = IMPORT_HANDLERS[tipo];

  if (!handler) {
    return {
      success: false,
      importId,
      error: `El tipo "${tipo}" no tiene implementación de importación disponible.`,
    };
  }

  try {
    console.log(`[importer] Mapeando tipo: ${tipo}`);
    const campos = handler.mapear(documento);

    console.log(`[importer] Completando con IA para tipo: ${tipo}`);
    const resultadoIA = await handler.completar(campos, sessionId);

    console.log(`[importer] Guardando resultado para tipo: ${tipo}`);
    const resultadoGuardado: ResultadoGuardado = await handler.guardar(
      campos,
      resultadoIA,
      sessionId,
      originalBuffer
    );

    return {
      success: true,
      importId,
      tipo,
      resourceId: resultadoGuardado.resourceId,
      destination: resultadoGuardado.destination,
    };
  } catch (err: any) {
    console.error(`[importer] Error en importación tipo ${tipo}:`, err);

    return {
      success: false,
      importId,
      error:
        err?.message ||
        "No se pudo completar la importación. Intenta de nuevo.",
    };
  }
}
