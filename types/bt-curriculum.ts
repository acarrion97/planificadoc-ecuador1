/**
 * Tipos TypeScript para el catálogo curricular de Bachillerato Técnico.
 * Derivados directamente de Drizzle schema + tipos de dominio compuestos.
 *
 * Fuente: Acuerdo Ministerial MINEDUC-2024-00065-A
 */

import {
  btAreasTecnicas,
  btFamiliasProfesionales,
  btFigurasProfesionales,
  btModulosFormativos,
  btContenidos,
  btResultadosAprendizaje,
  btCriteriosEvaluacion,
  btModuloPorAnio,
  btPlanificaciones,
  btDistribucionTrimestre,
} from "../drizzle/schema";

// ═══════════════════════════════════════════════════════════════════════════
// 4.1 Tipos derivados de Drizzle (inferSelect / inferInsert)
// ═══════════════════════════════════════════════════════════════════════════

export type BtAreaTecnica = typeof btAreasTecnicas.$inferSelect;
export type NewBtAreaTecnica = typeof btAreasTecnicas.$inferInsert;

export type BtFamiliaProfesional = typeof btFamiliasProfesionales.$inferSelect;
export type NewBtFamiliaProfesional = typeof btFamiliasProfesionales.$inferInsert;

export type BtFiguraProfesional = typeof btFigurasProfesionales.$inferSelect;
export type NewBtFiguraProfesional = typeof btFigurasProfesionales.$inferInsert;

export type BtModuloFormativo = typeof btModulosFormativos.$inferSelect;
export type NewBtModuloFormativo = typeof btModulosFormativos.$inferInsert;

export type BtContenido = typeof btContenidos.$inferSelect;
export type NewBtContenido = typeof btContenidos.$inferInsert;

export type BtResultadoAprendizaje = typeof btResultadosAprendizaje.$inferSelect;
export type NewBtResultadoAprendizaje = typeof btResultadosAprendizaje.$inferInsert;

export type BtCriterioEvaluacion = typeof btCriteriosEvaluacion.$inferSelect;
export type NewBtCriterioEvaluacion = typeof btCriteriosEvaluacion.$inferInsert;

export type BtModuloPorAnio = typeof btModuloPorAnio.$inferSelect;
export type NewBtModuloPorAnio = typeof btModuloPorAnio.$inferInsert;

export type BtPlanificacion = typeof btPlanificaciones.$inferSelect;
export type NewBtPlanificacion = typeof btPlanificaciones.$inferInsert;

export type BtDistribucionTrimestre = typeof btDistribucionTrimestre.$inferSelect;
export type NewBtDistribucionTrimestre = typeof btDistribucionTrimestre.$inferInsert;

// ═══════════════════════════════════════════════════════════════════════════
// 4.2 Tipos de dominio compuestos (jerarquía curricular BT)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Año de Bachillerato Técnico.
 */
export type AnioBGU = 1 | 2 | 3;

/**
 * Tipo de contenido formativo.
 */
export type TipoContenidoBT = "conceptual" | "procedimental" | "actitudinal";

/**
 * Tipo de módulo formativo.
 */
export type TipoModuloBT = "generico" | "especializacion";

/**
 * Trimestre del año lectivo.
 */
export type Trimestre = 1 | 2 | 3;

/**
 * Tipo de currículo en el sistema.
 * Permite distinguir entre el currículo general (subniveles/DCD) y BT.
 */
export type TipoCurriculo = "general" | "bachillerato_tecnico";

/**
 * Jerarquía completa del catálogo BT: Área → Familia → Figura.
 */
export type BtJerarquiaCompleta = {
  area: BtAreaTecnica;
  familia: BtFamiliaProfesional;
  figura: BtFiguraProfesional;
};

/**
 * Figura profesional con sus módulos y distribución por año.
 */
export type BtFiguraConModulos = BtFiguraProfesional & {
  modulos: (BtModuloFormativo & {
    distribucionAnual: BtModuloPorAnio[];
  })[];
};

/**
 * Módulo formativo con todo su currículo: contenidos, RA y CE.
 */
export type BtModuloCompleto = BtModuloFormativo & {
  contenidos: BtContenido[];
  resultadosAprendizaje: (BtResultadoAprendizaje & {
    criteriosEvaluacion: BtCriterioEvaluacion[];
  })[];
  distribucionAnual: BtModuloPorAnio[];
};

/**
 * Figura profesional con currículo completo.
 */
export type BtFiguraCompleta = BtFiguraProfesional & {
  familia: BtFamiliaProfesional & {
    area: BtAreaTecnica;
  };
  modulos: BtModuloCompleto[];
};

/**
 * Planificación BT completa con distribución trimestral.
 */
export type BtPlanificacionCompleta = BtPlanificacion & {
  figura: BtFiguraCompleta;
  distribucion: (BtDistribucionTrimestre & {
    contenido?: BtContenido;
    ra?: BtResultadoAprendizaje;
  })[];
};

/**
 * Carga horaria de un módulo en un año específico.
 */
export type BtCargaHoraria = {
  moduloId: number;
  moduloNombre: string;
  moduloCodigo: string | null;
  anioBGU: AnioBGU;
  cargaHorariaSemanal: number;
};

/**
 * Resumen de carga horaria por trimestre.
 */
export type BtResumenTrimestre = {
  trimestre: Trimestre;
  cargaHorariaTotal: number;
  modulos: string[];
};

/**
 * Estadísticas del catálogo BT.
 */
export type BtEstadisticasCatalogo = {
  totalAreas: number;
  totalFamilias: number;
  totalFiguras: number;
  figurasVigentes: number;
  figurasDeprecadas: number;
};

// ═══════════════════════════════════════════════════════════════════════════
// 4.3 Tipos de respuesta para API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Respuesta de listado de figuras profesionales.
 */
export type BtFiguraListItem = {
  id: number;
  nombre: string;
  codigo: string;
  perfilProfesional: string | null;
  activa: boolean;
  familia: {
    id: number;
    nombre: string;
    codigo: string;
  };
  area: {
    id: number;
    nombre: string;
  };
};

/**
 * Respuesta de detalle de figura con módulos.
 */
export type BtFiguraDetalle = BtFiguraCompleta;

/**
 * Respuesta de planificación BT.
 */
export type BtPlanificacionDetalle = BtPlanificacionCompleta;

/**
 * Filtros para búsqueda de figuras profesionales.
 */
export type BtFiltrosFigura = {
  areaId?: number;
  familiaId?: number;
  activa?: boolean;
  buscar?: string;
};

/**
 * Filtros para búsqueda de módulos.
 */
export type BtFiltrosModulo = {
  figuraId?: number;
  anioBGU?: AnioBGU;
  tipo?: TipoModuloBT;
  buscar?: string;
};
