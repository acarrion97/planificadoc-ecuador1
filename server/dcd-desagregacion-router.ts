import { z } from "zod";
import { and, eq, asc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { dcdDesagregaciones } from "../drizzle/schema";
import { generarDesagregacionDCD } from "./dcd-desagregacion-service";

/**
 * Router de desagregación/gradación de DCD por grado.
 * La fuente de verdad es la selección en la planificación; la tabla
 * `dcd_desagregaciones` es un respaldo por (sessionId, codigoDCD, grado).
 * Toda operación se valida por `sessionId` (mismo esquema que adaptaciones-router).
 */

async function ensureDcdDesagregacionesTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`dcd_desagregaciones\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sessionId\` varchar(320) NOT NULL,
        \`codigoDCD\` varchar(64) NOT NULL,
        \`subnivel\` int NOT NULL,
        \`grado\` int NOT NULL,
        \`gradoMaximo\` int NOT NULL,
        \`descripcionDCD\` text NOT NULL,
        \`indicadorOriginal\` text NOT NULL,
        \`dcdGraduada\` text NOT NULL,
        \`indicadorGraduado\` text NOT NULL,
        \`procesoCognitivo\` varchar(128),
        \`estado\` enum('generado','editado','aprobado') NOT NULL DEFAULT 'generado',
        \`version\` int NOT NULL DEFAULT 1,
        \`aiResult\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_dcd_session_grado\` (\`sessionId\`, \`codigoDCD\`, \`grado\`),
        INDEX \`idx_dcd_session\` (\`sessionId\`),
        INDEX \`idx_dcd_codigo\` (\`codigoDCD\`),
        INDEX \`idx_dcd_created\` (\`createdAt\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureDcdDesagregacionesTable warning:", err?.message);
    }
  }
}

export const dcdDesagregacionesRouter = router({
  /** 4.1 Resuelve el ladder existente (reutilización). Con `grado` devuelve solo esa fila. */
  get: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        codigoDCD: z.string().min(1),
        grado: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        await ensureDcdDesagregacionesTable();

        if (input.grado != null) {
          return await db
            .select()
            .from(dcdDesagregaciones)
            .where(
              and(
                eq(dcdDesagregaciones.sessionId, input.sessionId),
                eq(dcdDesagregaciones.codigoDCD, input.codigoDCD),
                eq(dcdDesagregaciones.grado, input.grado)
              )
            )
            .limit(1);
        }

        return await db
          .select()
          .from(dcdDesagregaciones)
          .where(
            and(
              eq(dcdDesagregaciones.sessionId, input.sessionId),
              eq(dcdDesagregaciones.codigoDCD, input.codigoDCD)
            )
          )
          .orderBy(asc(dcdDesagregaciones.grado));
      } catch (err) {
        console.warn("[dcd-desagregaciones] get failed:", err);
        return [];
      }
    }),

  /** 4.2 Genera el ladder completo con IA (una sola llamada) y lo persiste. */
  generar: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        codigoDCD: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { filas, advertencias } = await generarDesagregacionDCD(input.codigoDCD);

      try {
        const db = await getDb();
        if (db) {
          await ensureDcdDesagregacionesTable();
          await db
            .delete(dcdDesagregaciones)
            .where(
              and(
                eq(dcdDesagregaciones.sessionId, input.sessionId),
                eq(dcdDesagregaciones.codigoDCD, input.codigoDCD)
              )
            );
          await db.insert(dcdDesagregaciones).values(
            filas.map((f) => ({
              sessionId: input.sessionId,
              codigoDCD: f.codigoDCD,
              subnivel: f.subnivel,
              grado: f.grado,
              gradoMaximo: f.gradoMaximo,
              descripcionDCD: f.descripcionDCD,
              indicadorOriginal: f.indicadorOriginal,
              dcdGraduada: f.dcdGraduada,
              indicadorGraduado: f.indicadorGraduado,
              procesoCognitivo: f.procesoCognitivo ?? null,
              estado: f.estado,
              version: f.version,
            }))
          );
        }
      } catch (err) {
        console.warn("[dcd-desagregaciones] DB save failed (non-critical):", err);
      }

      return { filas, advertencias };
    }),

  /** 4.3 Edición docente: persiste cambios y pasa `estado` a "editado". */
  editar: publicProcedure
    .input(
      z.object({
        id: z.number(),
        sessionId: z.string().min(1),
        dcdGraduada: z.string().min(1),
        indicadorGraduado: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await ensureDcdDesagregacionesTable();
        await db
          .update(dcdDesagregaciones)
          .set({
            dcdGraduada: input.dcdGraduada,
            indicadorGraduado: input.indicadorGraduado,
            estado: "editado",
          })
          .where(
            and(
              eq(dcdDesagregaciones.id, input.id),
              eq(dcdDesagregaciones.sessionId, input.sessionId)
            )
          );
        return { success: true };
      } catch (err) {
        console.warn("[dcd-desagregaciones] editar failed:", err);
        throw new Error("No se pudo guardar la edición.");
      }
    }),

  /** 4.4 Aprueba la fila desagregada (`estado = aprobado`). */
  aprobar: publicProcedure
    .input(
      z.object({
        id: z.number(),
        sessionId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await ensureDcdDesagregacionesTable();
        await db
          .update(dcdDesagregaciones)
          .set({ estado: "aprobado" })
          .where(
            and(
              eq(dcdDesagregaciones.id, input.id),
              eq(dcdDesagregaciones.sessionId, input.sessionId)
            )
          );
        return { success: true };
      } catch (err) {
        console.warn("[dcd-desagregaciones] aprobar failed:", err);
        throw new Error("No se pudo aprobar la fila.");
      }
    }),
});