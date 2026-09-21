/**
 * Familia de una planificación guardada en `curriculo_competencias_planificaciones`.
 *
 * La columna `tipo` solo distingue "egb_bgu" de "inicial_preparatoria", pero
 * este segundo bucket también guarda Currículo Integrado EGB/BGU (single-grado
 * y multigrado). Este módulo es puro (sin dependencias de servidor) para poder
 * usarse tanto en el router como en las pantallas.
 */

/** Familias de exportación/visualización posibles para una fila guardada. */
export type FamiliaExportacionCurriculoCompetencias =
  | "egb_bgu_dcd"
  | "curriculo_integrado_inicial"
  | "curriculo_integrado_single"
  | "curriculo_integrado_multigrado";

/** Rótulo mostrado al usuario para cada familia. */
export const FAMILIA_LABELS: Record<FamiliaExportacionCurriculoCompetencias, string> = {
  egb_bgu_dcd: "EGB / BGU",
  curriculo_integrado_single: "EGB / BGU · Currículo integrado",
  curriculo_integrado_multigrado: "EGB / BGU · Currículo integrado multigrado",
  curriculo_integrado_inicial: "Inicial / Preparatoria",
};

/** `true` si la familia pertenece a EGB/BGU (y no a Inicial). */
export function esFamiliaEGBBGU(familia: FamiliaExportacionCurriculoCompetencias): boolean {
  return familia !== "curriculo_integrado_inicial";
}

/**
 * Decide qué generador de exportación corresponde a una fila guardada.
 *
 * Para planificaciones nuevas, `formData.modalidad` es el discriminador
 * explícito (design.md D2): `"multigrado"` ⇒ multigrado; cualquier otro
 * valor o su ausencia cae a la heurística preexistente basada en el
 * prefijo del código de competencia del primer ámbito (`CE.CI.*` ⇒ Inicial),
 * que sigue aplicando sin cambios a los registros guardados antes de este
 * cambio (nunca tuvieron `modalidad`).
 */
export function determinarFamiliaExportacion(row: {
  tipo: string;
  formData: any;
}): FamiliaExportacionCurriculoCompetencias {
  if (row.tipo !== "inicial_preparatoria") return "egb_bgu_dcd";

  if (row.formData?.modalidad === "multigrado") {
    return "curriculo_integrado_multigrado";
  }

  const primerCodigo: string | undefined = row.formData?.ambitos?.[0]?.competenciaCodigo;
  const esInicial = !primerCodigo || primerCodigo.startsWith("CE.CI.");
  return esInicial ? "curriculo_integrado_inicial" : "curriculo_integrado_single";
}
