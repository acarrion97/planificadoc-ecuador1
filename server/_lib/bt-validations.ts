/**
 * Validaciones de integridad curricular para Bachillerato Técnico.
 * Protegen reglas pedagógico-curriculares, no solo integridad referencial.
 */

import { eq, and } from "drizzle-orm";
import {
  btModuloPorAnio,
  btDistribucionTrimestre,
  btContenidos,
  btModulosFormativos,
} from "../../drizzle/schema";
import { getDb } from "../db";

// ═══════════════════════════════════════════════════════════════════════════
// 6.1 Contenido no duplicado en un trimestre
// ═══════════════════════════════════════════════════════════════════════════

export type ValidationError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

/**
 * Valida que un contenido no esté duplicado en el mismo trimestre de una planificación.
 * Regla: planificación + contenido + trimestre debe ser único.
 *
 * NOTA: El mismo contenido SÍ puede aparecer en trimestres distintos.
 */
export async function validarContenidoNoDuplicado(
  planificacionId: number,
  contenidoId: number,
  trimestre: 1 | 2 | 3,
  excludeId?: number
): Promise<ValidationError | null> {
  const db = await getDb();
  if (!db) return null;

  const conditions = [
    eq(btDistribucionTrimestre.planificacionId, planificacionId),
    eq(btDistribucionTrimestre.contenidoId, contenidoId),
    eq(btDistribucionTrimestre.trimestre, trimestre),
  ];

  if (excludeId) {
    // Excluir el registro actual al actualizar
    const { not } = await import("drizzle-orm");
    conditions.push(not(eq(btDistribucionTrimestre.id, excludeId)));
  }

  const [existing] = await db
    .select({ id: btDistribucionTrimestre.id })
    .from(btDistribucionTrimestre)
    .where(and(...conditions))
    .limit(1);

  if (existing) {
    return {
      code: "CONTENIDO_DUPLICADO_TRIMESTRE",
      message: `El contenido ya está asignado al trimestre ${trimestre} en esta planificación.`,
      details: {
        planificacionId,
        contenidoId,
        trimestre,
        distribucionExistenteId: existing.id,
      },
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// 6.2 Distribución compatible con el año
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valida que el contenido pertenezca a un módulo asignado al año BGU de la planificación.
 *
 * Flujo:
 *   Planificación → anioBGU
 *   Contenido → módulo
 *   btModuloPorAnio → verificar que módulo esté en ese año
 */
export async function validarContenidoCompatibleAnio(
  planificacionId: number,
  contenidoId: number,
  anioBGU: 1 | 2 | 3
): Promise<ValidationError | null> {
  const db = await getDb();
  if (!db) return null;

  // 1. Obtener el contenido y su módulo
  const [contenido] = await db
    .select({ moduloId: btContenidos.moduloId })
    .from(btContenidos)
    .where(eq(btContenidos.id, contenidoId))
    .limit(1);

  if (!contenido) {
    return {
      code: "CONTENIDO_NO_ENCONTRADO",
      message: `El contenido con ID ${contenidoId} no existe.`,
      details: { contenidoId },
    };
  }

  // 2. Verificar que el módulo esté asignado al año BGU
  const [modPorAnio] = await db
    .select({ id: btModuloPorAnio.id })
    .from(btModuloPorAnio)
    .where(
      and(
        eq(btModuloPorAnio.moduloId, contenido.moduloId),
        eq(btModuloPorAnio.anioBGU, anioBGU)
      )
    )
    .limit(1);

  if (!modPorAnio) {
    return {
      code: "MODULO_NO_ASIGNADO_ANIO",
      message: `El módulo del contenido no está asignado al ${anioBGU}.º BGU en el catálogo oficial.`,
      details: {
        contenidoId,
        moduloId: contenido.moduloId,
        anioBGU,
      },
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// 6.3 Integridad de carga horaria
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resultado de la validación de carga horaria.
 */
export type ResultadoCargaHoraria = {
  valido: boolean;
  cargaHorariaOficial: number;
  distribucionActual: {
    moduloId: number;
    moduloNombre: string;
    cargaHorariaOficial: number;
    contenidosAsignados: number;
    distribucionTrimestres: Record<number, number>;
  }[];
  errores: ValidationError[];
};

/**
 * Valida que la distribución trimestral no exceda la carga horaria oficial.
 *
 * Regla:
 *   Carga anual del módulo (btModuloPorAnio.cargaHoraria)
 *   ≥
 *   Suma de contenidos asignados (representando carga pedagógica)
 *
 * NOTA: La carga horaria viene de btModuloPorAnio, NO de contar filas.
 */
export async function validarCargaHoraria(
  planificacionId: number,
  anioBGU: 1 | 2 | 3
): Promise<ResultadoCargaHoraria> {
  const db = await getDb();
  if (!db) {
    return {
      valido: false,
      cargaHorariaOficial: 0,
      distribucionActual: [],
      errores: [{ code: "DB_NO_DISPONIBLE", message: "Base de datos no disponible" }],
    };
  }

  const errores: ValidationError[] = [];
  const distribucionActual: ResultadoCargaHoraria["distribucionActual"] = [];

  // 1. Obtener todas las distribuciones de la planificación
  const distribuciones = await db
    .select()
    .from(btDistribucionTrimestre)
    .where(eq(btDistribucionTrimestre.planificacionId, planificacionId));

  // 2. Obtener módulos únicos involucrados
  const moduloIds = new Set<number>();
  for (const d of distribuciones) {
    if (d.contenidoId) {
      const [contenido] = await db
        .select({ moduloId: btContenidos.moduloId })
        .from(btContenidos)
        .where(eq(btContenidos.id, d.contenidoId))
        .limit(1);
      if (contenido) moduloIds.add(contenido.moduloId);
    }
  }

  // 3. Para cada módulo, validar carga horaria
  let cargaHorariaTotalOficial = 0;

  for (const moduloId of moduloIds) {
    // Obtener carga horaria oficial del módulo para este año
    const [modPorAnio] = await db
      .select()
      .from(btModuloPorAnio)
      .where(
        and(
          eq(btModuloPorAnio.moduloId, moduloId),
          eq(btModuloPorAnio.anioBGU, anioBGU)
        )
      )
      .limit(1);

    if (!modPorAnio) {
      errores.push({
        code: "MODULO_SIN_CARGA_HORARIA",
        message: `El módulo ${moduloId} no tiene carga horaria definida para el ${anioBGU}.º BGU.`,
        details: { moduloId, anioBGU },
      });
      continue;
    }

    // Contar contenidos asignados por trimestre
    const distribucionesModulo = distribuciones.filter((d: any) => {
      // Necesitamos verificar si el contenido pertenece a este módulo
      return d.contenidoId !== null;
    });

    const porTrimestre: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

    for (const d of distribucionesModulo) {
      if (!d.contenidoId) continue;

      const [contenido] = await db
        .select({ moduloId: btContenidos.moduloId })
        .from(btContenidos)
        .where(eq(btContenidos.id, d.contenidoId))
        .limit(1);

      if (contenido?.moduloId === moduloId) {
        porTrimestre[d.trimestre] = (porTrimestre[d.trimestre] || 0) + 1;
      }
    }

    // Obtener nombre del módulo
    const [modulo] = await db
      .select()
      .from(btModulosFormativos)
      .where(eq(btModulosFormativos.id, moduloId))
      .limit(1);

    const contenidosAsignados = Object.values(porTrimestre).reduce((a, b) => a + b, 0);

    distribucionActual.push({
      moduloId,
      moduloNombre: modulo?.nombre || `Módulo ${moduloId}`,
      cargaHorariaOficial: modPorAnio.cargaHorariaSemanal,
      contenidosAsignados,
      distribucionTrimestres: porTrimestre,
    });

    cargaHorariaTotalOficial += modPorAnio.cargaHorariaSemanal;

    // Validar que no se exceda la carga horaria
    // La validación es: contenidos asignados no deben exceder un umbral razonable
    // (por ejemplo, 1 contenido por hora pedagógica semanal como máximo)
    const maxContenidosEsperados = modPorAnio.cargaHorariaSemanal * 3; // ~3 contenidos por hora por trimestre
    if (contenidosAsignados > maxContenidosEsperados) {
      errores.push({
        code: "CARGA_HORARIA_EXCEDIDA",
        message: `El módulo ${modulo?.nombre || moduloId} excede la carga horaria esperada. Asignados ${contenidosAsignados} contenidos, máximo esperado ${maxContenidosEsperados}.`,
        details: {
          moduloId,
          cargaHorariaSemanal: modPorAnio.cargaHorariaSemanal,
          contenidosAsignados,
          maxContenidosEsperados,
        },
      });
    }
  }

  return {
    valido: errores.length === 0,
    cargaHorariaOficial: cargaHorariaTotalOficial,
    distribucionActual,
    errores,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6.4 Validación integral de distribución
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validación integral antes de agregar/modificar una distribución trimestral.
 * Ejecuta todas las validaciones en orden y retorna el primer error encontrado.
 */
export async function validarDistribucionTrimestre(params: {
  planificacionId: number;
  contenidoId: number;
  trimestre: 1 | 2 | 3;
  anioBGU: 1 | 2 | 3;
  excludeId?: number;
}): Promise<ValidationError | null> {
  // 1. Validar que el contenido no esté duplicado en el mismo trimestre
  const err1 = await validarContenidoNoDuplicado(
    params.planificacionId,
    params.contenidoId,
    params.trimestre,
    params.excludeId
  );
  if (err1) return err1;

  // 2. Validar que el contenido sea compatible con el año
  const err2 = await validarContenidoCompatibleAnio(
    params.planificacionId,
    params.contenidoId,
    params.anioBGU
  );
  if (err2) return err2;

  // 3. Validar carga horaria
  const resultadoCarga = await validarCargaHoraria(
    params.planificacionId,
    params.anioBGU
  );
  if (!resultadoCarga.valido && resultadoCarga.errores.length > 0) {
    return resultadoCarga.errores[0];
  }

  return null;
}
