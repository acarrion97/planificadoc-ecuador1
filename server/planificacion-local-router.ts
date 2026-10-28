import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { planificacionesLocales } from "../drizzle/schema";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";

const tipoSchema = z.enum(["diario", "semanal", "bt", "cnc", "evaluacion"]);
const registroSchema = z.object({
  sessionId: z.string().min(1).max(320),
  tipo: tipoSchema,
  itemId: z.string().min(1).max(128),
  form: z.string().min(1).max(2_000_000),
});

export const planificacionLocalRouter = router({
  guardar: publicProcedure.input(registroSchema).mutation(async ({ input }) => {
    try {
      const db = await getDb();
      if (!db) return { id: null };

      const parsed: unknown = JSON.parse(input.form);
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("id" in parsed) ||
        parsed.id !== input.itemId
      ) {
        throw new Error("El id del formulario no coincide con itemId");
      }

      const [row] = await db
        .insert(planificacionesLocales)
        .values({
          sessionId: input.sessionId,
          tipo: input.tipo,
          itemId: input.itemId,
          form: input.form,
        })
        .onConflictDoUpdate({
          target: [
            planificacionesLocales.sessionId,
            planificacionesLocales.tipo,
            planificacionesLocales.itemId,
          ],
          set: {
            form: input.form,
            updatedAt: new Date(),
          },
        })
        .returning({ id: planificacionesLocales.id });

      return { id: row?.id ?? null };
    } catch (error) {
      console.warn("[planificacion-local] backup failed (non-critical):", error);
      return { id: null };
    }
  }),

  listar: publicProcedure
    .input(z.object({ sessionId: z.string().min(1).max(320), tipo: tipoSchema.optional() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const where = input.tipo
          ? and(
              eq(planificacionesLocales.sessionId, input.sessionId),
              eq(planificacionesLocales.tipo, input.tipo),
            )
          : eq(planificacionesLocales.sessionId, input.sessionId);
        return await db
          .select({
            tipo: planificacionesLocales.tipo,
            itemId: planificacionesLocales.itemId,
            form: planificacionesLocales.form,
            updatedAt: planificacionesLocales.updatedAt,
          })
          .from(planificacionesLocales)
          .where(where)
          .orderBy(desc(planificacionesLocales.updatedAt));
      } catch (error) {
        console.warn("[planificacion-local] restore list failed (non-critical):", error);
        return [];
      }
    }),

  eliminar: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1).max(320),
        tipo: tipoSchema,
        itemId: z.string().min(1).max(128),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };

        await db
          .delete(planificacionesLocales)
          .where(
            and(
              eq(planificacionesLocales.sessionId, input.sessionId),
              eq(planificacionesLocales.tipo, input.tipo),
              eq(planificacionesLocales.itemId, input.itemId),
            ),
          );
        return { success: true };
      } catch (error) {
        console.warn("[planificacion-local] backup delete failed (non-critical):", error);
        return { success: false };
      }
    }),
});
