import mysql from "mysql2/promise";
import { BT_AREAS, BT_FAMILIAS, BT_FIGURAS } from "../../data/bt-seed";

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
