import mysql from "mysql2/promise";
import { BT_AREAS, BT_FAMILIAS, BT_FIGURAS } from "../../data/bt-seed";
import { BT_CURRICULUM_SEED } from "../../data/bt-curriculum-seed";
import type {
  FiguraCurricularSeed,
  ModuloCurricularSeed,
} from "../../data/bt-curriculum-seed";

/**
 * Seed idempotente del catálogo de Bachillerato Técnico.
 * Basado en códigos estables, no en IDs autoincrementales.
 * Ejecutar múltiples veces no duplica registros.
 *
 * Fuente: Acuerdo Ministerial MINEDUC-2024-00065-A
 * Registro Oficial No. 645 del 17 de septiembre del 2024
 */
export async function seedBtCatalogo(
  conn: mysql.Connection
): Promise<{ areas: number; familias: number; figuras: number }> {
  let areas = 0;
  let familias = 0;
  let figuras = 0;

  // 1. Áreas técnicas
  for (const area of BT_AREAS) {
    const [existing] = await conn.query(
      `SELECT id FROM bt_areas_tecnicas WHERE nombre = ? LIMIT 1`,
      [area.nombre]
    );
    if ((existing as any[]).length === 0) {
      await conn.query(
        `INSERT INTO bt_areas_tecnicas (nombre, descripcion) VALUES (?, ?)`,
        [area.nombre, area.descripcion]
      );
      areas++;
    }
  }

  // 2. Familias profesionales
  for (const familia of BT_FAMILIAS) {
    const [existing] = await conn.query(
      `SELECT id FROM bt_familias_profesionales WHERE codigo = ? LIMIT 1`,
      [familia.codigo]
    );
    if ((existing as any[]).length === 0) {
      // Obtener areaId por nombre
      const [areaRows] = await conn.query(
        `SELECT id FROM bt_areas_tecnicas WHERE nombre = ? LIMIT 1`,
        [familia.areaNombre]
      );
      const areaId = (areaRows as any[])[0]?.id;
      if (!areaId) {
        console.error(`[seed-bt] Área no encontrada: ${familia.areaNombre}`);
        continue;
      }
      await conn.query(
        `INSERT INTO bt_familias_profesionales (areaId, nombre, codigo, descripcion) VALUES (?, ?, ?, ?)`,
        [areaId, familia.nombre, familia.codigo, familia.descripcion]
      );
      familias++;
    }
  }

  // 3. Figuras profesionales
  for (const figura of BT_FIGURAS) {
    const [existing] = await conn.query(
      `SELECT id FROM bt_figuras_profesionales WHERE codigo = ? LIMIT 1`,
      [figura.codigo]
    );
    if ((existing as any[]).length === 0) {
      // Obtener familiaId por código
      const [familiaRows] = await conn.query(
        `SELECT id FROM bt_familias_profesionales WHERE codigo = ? LIMIT 1`,
        [figura.familiaCodigo]
      );
      const familiaId = (familiaRows as any[])[0]?.id;
      if (!familiaId) {
        console.error(`[seed-bt] Familia no encontrada: ${figura.familiaCodigo}`);
        continue;
      }
      await conn.query(
        `INSERT INTO bt_figuras_profesionales (familiaId, nombre, codigo, perfilProfesional) VALUES (?, ?, ?, ?)`,
        [familiaId, figura.nombre, figura.codigo, figura.perfilProfesional]
      );
      figuras++;
    }
  }

  console.log(`[seed-bt] Áreas: ${areas}, Familias: ${familias}, Figuras: ${figuras}`);
  return { areas, familias, figuras };
}

/**
 * Seed idempotente del currículo de Bachillerato Técnico.
 * Inserta módulos, RA, CE, contenidos y distribución por año.
 * Basado en documentos oficiales del MinEduc.
 */
export async function seedBtCurriculum(
  conn: mysql.Connection
): Promise<{
  modulos: number;
  resultados: number;
  criterios: number;
  contenidos: number;
  distribuciones: number;
}> {
  let modulos = 0;
  let resultados = 0;
  let criterios = 0;
  let contenidos = 0;
  let distribuciones = 0;

  for (const fig of BT_CURRICULUM_SEED) {
    // Obtener figuraId por código
    const [figuraRows] = await conn.query(
      `SELECT id FROM bt_figuras_profesionales WHERE codigo = ? LIMIT 1`,
      [fig.figuraCodigo]
    );
    const figuraId = (figuraRows as any[])[0]?.id;
    if (!figuraId) {
      console.warn(`[seed-bt-curriculum] Figura no encontrada: ${fig.figuraCodigo}`);
      continue;
    }

    for (const mod of fig.modulos) {
      // Verificar si el módulo ya existe
      const [existingMod] = await conn.query(
        `SELECT id FROM bt_modulos_formativos WHERE figuraId = ? AND codigo = ? LIMIT 1`,
        [figuraId, mod.codigo]
      );

      let moduloId: number;
      if ((existingMod as any[]).length > 0) {
        moduloId = (existingMod as any[])[0].id;
        // Actualizar campos del módulo
        await conn.query(
          `UPDATE bt_modulos_formativos SET
            nivel = ?,
            duracionTotalPeriodos = ?,
            unidadCompetencia = ?,
            objetivoModulo = ?,
            perfilDocente = ?,
            orientacionesMetodologicas = ?
          WHERE id = ?`,
          [
            mod.nivel,
            mod.duracionTotalPeriodos,
            mod.unidadCompetencia,
            mod.objetivoModulo,
            mod.perfilDocente,
            mod.orientacionesMetodologicas,
            moduloId,
          ]
        );
      } else {
        // Insertar nuevo módulo
        const [result] = await conn.query(
          `INSERT INTO bt_modulos_formativos
            (figuraId, nombre, codigo, tipo, nivel, duracionTotalPeriodos,
             unidadCompetencia, objetivoModulo, perfilDocente, orientacionesMetodologicas)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            figuraId,
            mod.nombre,
            mod.codigo,
            mod.tipo,
            mod.nivel,
            mod.duracionTotalPeriodos,
            mod.unidadCompetencia,
            mod.objetivoModulo,
            mod.perfilDocente,
            mod.orientacionesMetodologicas,
          ]
        );
        moduloId = (result as any).insertId;
        modulos++;
      }

      // 2. Resultados de Aprendizaje
      for (const ra of mod.resultadosAprendizaje) {
        const [existingRA] = await conn.query(
          `SELECT id FROM bt_resultados_aprendizaje WHERE moduloId = ? AND codigo = ? LIMIT 1`,
          [moduloId, ra.codigo]
        );

        let raId: number;
        if ((existingRA as any[]).length > 0) {
          raId = (existingRA as any[])[0].id;
          // Actualizar descripción
          await conn.query(
            `UPDATE bt_resultados_aprendizaje SET descripcion = ? WHERE id = ?`,
            [ra.descripcion, raId]
          );
        } else {
          const [result] = await conn.query(
            `INSERT INTO bt_resultados_aprendizaje (moduloId, codigo, descripcion)
             VALUES (?, ?, ?)`,
            [moduloId, ra.codigo, ra.descripcion]
          );
          raId = (result as any).insertId;
          resultados++;
        }

        // 3. Criterios de Evaluación
        for (const ce of ra.criterios) {
          const [existingCE] = await conn.query(
            `SELECT id FROM bt_criterios_evaluacion WHERE raId = ? AND codigo = ? LIMIT 1`,
            [raId, ce.codigo]
          );

          if ((existingCE as any[]).length === 0) {
            await conn.query(
              `INSERT INTO bt_criterios_evaluacion (raId, codigo, descripcion)
               VALUES (?, ?, ?)`,
              [raId, ce.codigo, ce.descripcion]
            );
            criterios++;
          }
        }
      }

      // 4. Contenidos
      // Primero eliminar contenidos existentes para este módulo
      await conn.query(`DELETE FROM bt_contenidos WHERE moduloId = ?`, [moduloId]);

      for (const cont of mod.contenidos) {
        await conn.query(
          `INSERT INTO bt_contenidos (moduloId, tipo, descripcion, orden)
           VALUES (?, ?, ?, ?)`,
          [moduloId, cont.tipo, cont.descripcion, cont.orden]
        );
        contenidos++;
      }

      // 5. Distribución por año (bt_modulo_por_anio)
      // Eliminar distribución existente
      await conn.query(`DELETE FROM bt_modulo_por_anio WHERE moduloId = ?`, [moduloId]);

      if (mod.cargaHoraria.anio1) {
        await conn.query(
          `INSERT INTO bt_modulo_por_anio (moduloId, anioBGU, cargaHorariaSemanal)
           VALUES (?, 1, ?)`,
          [moduloId, mod.cargaHoraria.anio1]
        );
        distribuciones++;
      }
      if (mod.cargaHoraria.anio2) {
        await conn.query(
          `INSERT INTO bt_modulo_por_anio (moduloId, anioBGU, cargaHorariaSemanal)
           VALUES (?, 2, ?)`,
          [moduloId, mod.cargaHoraria.anio2]
        );
        distribuciones++;
      }
      if (mod.cargaHoraria.anio3) {
        await conn.query(
          `INSERT INTO bt_modulo_por_anio (moduloId, anioBGU, cargaHorariaSemanal)
           VALUES (?, 3, ?)`,
          [moduloId, mod.cargaHoraria.anio3]
        );
        distribuciones++;
      }
    }
  }

  console.log(
    `[seed-bt-curriculum] Módulos: ${modulos}, RA: ${resultados}, CE: ${criterios}, ` +
    `Contenidos: ${contenidos}, Distribuciones: ${distribuciones}`
  );
  return { modulos, resultados, criterios, contenidos, distribuciones };
}
