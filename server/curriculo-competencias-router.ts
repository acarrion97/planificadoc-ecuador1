import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { curriculoCompetenciasPlanificaciones } from "../drizzle/schema";
import type {
  PlanificacionCurriculoCompetencias,
  PlanificacionInicialCurriculo,
} from "../data/types-curriculo-competencias";
import {
  normalizarPlanificacionEGBBGU,
  normalizarPlanificacionInicial,
} from "../lib/curriculo-competencias-normalizer";

// ============================================================
// ZOD SCHEMAS DE ENTRADA
// ============================================================

/** Datos para crear/actualizar una planificación EGB/BGU */
const PlanificacionEGBBGUInput = z.object({
  sessionId: z.string().min(1),
  id: z.string().optional(), // si se provee, es update
  fecha: z.string().optional(),
  institucion: z.string().optional(),
  docente: z.string().optional(),
  grado: z.string().optional(),
  asignatura: z.string().optional(),
  periodoPedagogico: z.string().optional(),
  trimestre: z.string().optional(),
  nivel: z.enum(["EGB", "BGU"]).optional(),
  paralelo: z.string().optional(),
  dcd: z
    .object({
      codigo: z.string(),
      descripcion: z.string().optional(),
      competencias: z.array(z.string()).optional(),
    })
    .optional(),
  indicadorEvaluacion: z.string().optional(),
  competencias: z.array(z.string()).optional(),
  objetivoAprendizaje: z.string().optional(),
  estrategiaId: z.string().optional(),
  fases: z
    .array(
      z.object({
        titulo: z.string(),
        duracionMinutos: z.number().optional(),
        actividades: z.array(
          z.object({
            texto: z.string(),
            competencia: z.string().optional(),
            dua: z
              .object({
                implicacion: z.boolean().optional(),
                representacion: z.boolean().optional(),
                accionExpresion: z.boolean().optional(),
              })
              .optional(),
          })
        ),
      })
    )
    .optional(),
  recursos: z.string().optional(),
  tecnicaEvaluacion: z.string().optional(),
  instrumentoEvaluacion: z.string().optional(),
  actividadesEvaluacion: z.string().optional(),
  usaInterdisciplina: z.boolean().optional(),
  proyectoInterdisciplinar: z
    .object({
      nombre: z.string().optional(),
      objetivoAprendizaje: z.string().optional(),
      dcds: z
        .array(
          z.object({
            codigo: z.string(),
            descripcion: z.string().optional(),
            competencias: z.array(z.string()).optional(),
          })
        )
        .optional(),
      indicadores: z
        .array(
          z.object({
            codigo: z.string(),
            texto: z.string(),
            competencia: z.string().optional(),
          })
        )
        .optional(),
      fases: z.array(z.any()).optional(),
      actividadesEvaluacion: z.string().optional(),
    })
    .optional(),
  adaptacionesNEE: z
    .array(
      z.object({
        grado: z.number().optional(),
        necesidadEducativa: z.string().optional(),
        adaptacionDCD: z.string().optional(),
        adaptacionEstrategias: z.string().optional(),
        adaptacionRecursos: z.string().optional(),
        adaptacionEvaluacion: z.string().optional(),
      })
    )
    .optional(),
  horasAcompaniamiento: z.number().optional(),
  actividadesAcompaniamiento: z
    .array(
      z.object({
        actividad: z.string().optional(),
        competencia: z.string().optional(),
      })
    )
    .optional(),
  sourceDocument: z.string().optional(),
  sourceSection: z.string().optional(),
  sourceVersion: z.string().optional(),
});

/** Datos para crear/actualizar una planificación Inicial/Preparatoria */
const PlanificacionInicialInput = z.object({
  sessionId: z.string().min(1),
  id: z.string().optional(),
  grado: z.string().optional(),
  institucion: z.string().optional(),
  docente: z.string().optional(),
  duracion: z.string().optional(),
  objetivoGeneral: z.string().optional(),
  ambitos: z
    .array(
      z.object({
        ambito: z.string().optional(),
        competenciaCodigo: z.string().optional(),
        competenciaDescripcion: z.string().optional(),
        competencias: z.array(z.string()).optional(),
        destrezas: z.array(z.string()).optional(),
        clases: z
          .array(
            z.object({
              numero: z.number().optional(),
              tema: z.string().optional(),
              objetivoEspecifico: z.string().optional(),
              metodologia: z.string().optional(),
              inicio: z
                .array(
                  z.object({
                    texto: z.string(),
                    competencia: z.string().optional(),
                    dua: z
                      .object({
                        implicacion: z.boolean().optional(),
                        representacion: z.boolean().optional(),
                        accionExpresion: z.boolean().optional(),
                      })
                      .optional(),
                  })
                )
                .optional(),
              desarrollo: z
                .array(
                  z.object({
                    texto: z.string(),
                    competencia: z.string().optional(),
                    dua: z
                      .object({
                        implicacion: z.boolean().optional(),
                        representacion: z.boolean().optional(),
                        accionExpresion: z.boolean().optional(),
                      })
                      .optional(),
                  })
                )
                .optional(),
              cierre: z
                .array(
                  z.object({
                    texto: z.string(),
                    competencia: z.string().optional(),
                    dua: z
                      .object({
                        implicacion: z.boolean().optional(),
                        representacion: z.boolean().optional(),
                        accionExpresion: z.boolean().optional(),
                      })
                      .optional(),
                  })
                )
                .optional(),
              metodoEvaluacion: z.array(z.string()).optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  adaptacionesNEE: z
    .array(
      z.object({
        grado: z.number().optional(),
        necesidadEducativa: z.string().optional(),
        adaptacionDCD: z.string().optional(),
        adaptacionEstrategias: z.string().optional(),
        adaptacionRecursos: z.string().optional(),
        adaptacionEvaluacion: z.string().optional(),
      })
    )
    .optional(),
  bibliografia: z.string().optional(),
  observaciones: z.string().optional(),
  firmas: z
    .object({
      elaborado: z.string().optional(),
      revisado: z.string().optional(),
      coordinador: z.string().optional(),
      aprobado: z.string().optional(),
    })
    .optional(),
  sourceDocument: z.string().optional(),
  sourceSection: z.string().optional(),
  sourceVersion: z.string().optional(),
});

// ============================================================
// HELPERS
// ============================================================

function ensureTable(db: Awaited<ReturnType<typeof getDb>>): asserts db is NonNullable<Awaited<ReturnType<typeof getDb>>> {
  if (!db) throw new Error("Base de datos no disponible");
}

// ============================================================
// ROUTER
// ============================================================

export const curriculoCompetenciasRouter = router({
  // ── CREATE EGB/BGU ──────────────────────────────────────────────
  createEGBBGU: publicProcedure
    .input(PlanificacionEGBBGUInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionEGBBGU(input, input.id);

      const row = {
        sessionId: input.sessionId,
        tipo: "egb_bgu" as const,
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        asignatura: plan.asignatura || null,
        nivel: plan.nivel || null,
        periodoPedagogico: plan.periodoPedagogico || null,
        trimestre: plan.trimestre || null,
        dcdCodigo: plan.destreza?.codigo || null,
        competencias: JSON.stringify(plan.competenciasAsociadas),
        status: "draft" as const,
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      const res = await db
        .insert(curriculoCompetenciasPlanificaciones)
        .values(row);

      return {
        id: (res as any).insertId as number,
        plan,
      };
    }),

  // ── CREATE INICIAL / PREPARATORIA ────────────────────────────────
  createInicial: publicProcedure
    .input(PlanificacionInicialInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionInicial(input, input.id);

      const row = {
        sessionId: input.sessionId,
        tipo: "inicial_preparatoria" as const,
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: null,
        asignatura: null,
        nivel: null,
        periodoPedagogico: null,
        trimestre: null,
        dcdCodigo: null,
        competencias: null,
        status: "draft" as const,
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      const res = await db
        .insert(curriculoCompetenciasPlanificaciones)
        .values(row);

      return {
        id: (res as any).insertId as number,
        plan,
      };
    }),

  // ── GET BY ID ────────────────────────────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const rows = await db
        .select()
        .from(curriculoCompetenciasPlanificaciones)
        .where(eq(curriculoCompetenciasPlanificaciones.id, input.id))
        .limit(1);

      if (rows.length === 0) return null;

      const row = rows[0];
      return {
        ...row,
        formData: JSON.parse(row.formData as string),
        competencias: row.competencias
          ? JSON.parse(row.competencias as string)
          : null,
        sourceTraceability: row.sourceTraceability
          ? JSON.parse(row.sourceTraceability as string)
          : null,
      };
    }),

  // ── LIST ─────────────────────────────────────────────────────────
  list: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        tipo: z.enum(["egb_bgu", "inicial_preparatoria"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [
        eq(curriculoCompetenciasPlanificaciones.sessionId, input.sessionId),
      ];

      if (input.tipo) {
        conditions.push(
          eq(curriculoCompetenciasPlanificaciones.tipo, input.tipo)
        );
      }

      const rows = await db
        .select({
          id: curriculoCompetenciasPlanificaciones.id,
          tipo: curriculoCompetenciasPlanificaciones.tipo,
          grado: curriculoCompetenciasPlanificaciones.grado,
          institucion: curriculoCompetenciasPlanificaciones.institucion,
          docente: curriculoCompetenciasPlanificaciones.docente,
          asignatura: curriculoCompetenciasPlanificaciones.asignatura,
          nivel: curriculoCompetenciasPlanificaciones.nivel,
          paralelo: curriculoCompetenciasPlanificaciones.paralelo,
          dcdCodigo: curriculoCompetenciasPlanificaciones.dcdCodigo,
          status: curriculoCompetenciasPlanificaciones.status,
          createdAt: curriculoCompetenciasPlanificaciones.createdAt,
        })
        .from(curriculoCompetenciasPlanificaciones)
        .where(and(...conditions))
        .orderBy(desc(curriculoCompetenciasPlanificaciones.createdAt))
        .limit(50);

      return rows;
    }),

  // ── UPDATE EGB/BGU ──────────────────────────────────────────────
  updateEGBBGU: publicProcedure
    .input(PlanificacionEGBBGUInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionEGBBGU(input);

      const row = {
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        asignatura: plan.asignatura || null,
        nivel: plan.nivel || null,
        periodoPedagogico: plan.periodoPedagogico || null,
        trimestre: plan.trimestre || null,
        dcdCodigo: plan.destreza?.codigo || null,
        competencias: JSON.stringify(plan.competenciasAsociadas),
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      await db
        .update(curriculoCompetenciasPlanificaciones)
        .set(row)
        .where(
          eq(curriculoCompetenciasPlanificaciones.id, input.id)
        );

      return { success: true };
    }),

  // ── UPDATE INICIAL / PREPARATORIA ────────────────────────────────
  updateInicial: publicProcedure
    .input(PlanificacionInicialInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionInicial(input);

      const row = {
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      await db
        .update(curriculoCompetenciasPlanificaciones)
        .set(row)
        .where(
          eq(curriculoCompetenciasPlanificaciones.id, input.id)
        );

      return { success: true };
    }),

  // ── UPDATE STATUS ────────────────────────────────────────────────
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "generated", "paid"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      await db
        .update(curriculoCompetenciasPlanificaciones)
        .set({ status: input.status })
        .where(
          eq(curriculoCompetenciasPlanificaciones.id, input.id)
        );

      return { success: true };
    }),

  // ── DELETE ───────────────────────────────────────────────────────
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      await db
        .delete(curriculoCompetenciasPlanificaciones)
        .where(
          eq(curriculoCompetenciasPlanificaciones.id, input.id)
        );

      return { success: true };
    }),

  // ── EXPORT WORD ─────────────────────────────────────────────────
  exportWord: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const rows = await db
        .select()
        .from(curriculoCompetenciasPlanificaciones)
        .where(eq(curriculoCompetenciasPlanificaciones.id, input.id))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("Planificación no encontrada");
      }

      const row = rows[0];
      const data = JSON.parse(row.formData as string);

      let blob: Blob;
      if (row.tipo === "inicial_preparatoria") {
        const { generarCurriculoCompetenciasWordInicial } = await import(
          "../lib/curriculo-competencias-inicial-word-generator"
        );
        blob = await generarCurriculoCompetenciasWordInicial(data);
      } else {
        const { generarCurriculoCompetenciasWordEGBBGU } = await import(
          "../lib/curriculo-competencias-word-generator"
        );
        blob = await generarCurriculoCompetenciasWordEGBBGU(data);
      }

      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        base64,
        filename: `planificacion-curriculo-competencias-${row.id}.docx`,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }),

  // ── EXPORT PDF ──────────────────────────────────────────────────
  exportPdf: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureTable(db);

      const rows = await db
        .select()
        .from(curriculoCompetenciasPlanificaciones)
        .where(eq(curriculoCompetenciasPlanificaciones.id, input.id))
        .limit(1);

      if (rows.length === 0) {
        throw new Error("Planificación no encontrada");
      }

      const row = rows[0];
      const data = JSON.parse(row.formData as string);

      const { generarCurriculoCompetenciasPdf } = await import(
        "../lib/curriculo-competencias-pdf-generator"
      );

      const html = generarCurriculoCompetenciasPdf(data);

      return {
        html,
        filename: `planificacion-curriculo-competencias-${row.id}.pdf`,
      };
    }),

  // ── SUGERENCIA IA ────────────────────────────────────────────
  sugerirPlanificacion: publicProcedure
    .input(
      z.object({
        areaCode: z.string().optional(),
        dcdCodigo: z.string().optional(),
        dcdDescripcion: z.string().optional(),
        grado: z.string().optional(),
        nivel: z.enum(["EGB", "BGU"]).optional(),
        estrategiaId: z.string().optional(),
        campos: z.array(z.enum(["objetivoAprendizaje", "indicadorEvaluacion", "actividadesEvaluacion", "tecnicaEvaluacion", "instrumentoEvaluacion", "recursos"])).min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM, repairJson } = await import("./_core/llm");

      const camposSolicitud = input.campos.join(", ");

      const prompt = `Eres un experto en el Currículo Priorizado por Competencias del Ministerio de Educación del Ecuador.

CONTEXTO DE LA PLANIFICACIÓN:
- Área: ${input.areaCode || "No especificada"}
- Grado: ${input.grado || "No especificado"}
- Nivel: ${input.nivel || "EGB"}
- DCD: ${input.dcdCodigo || "No seleccionada"} — ${input.dcdDescripcion || ""}
- Estrategia: ${input.estrategiaId || "ERCA"}

SOLICITUD:
Genera sugerencias para los siguientes campos: ${camposSolicitud}.

REGLAS:
- Las sugerencias deben ser coherentes con el área, grado y DCD indicados.
- Usa terminología del Currículo Nacional Ecuador.
- Para objetivoAprendizaje: inicia con verbo en infinitivo, relacionado con la DCD.
- Para indicadorEvaluacion: describe observable medible del aprendizaje.
- Para actividadesEvaluacion: describe actividad concreta de evaluación.
- Para tecnicaEvaluacion: técnica apropiada para el área y grado.
- Para instrumentoEvaluacion: instrumento compatible con la técnica.
- Para recursos: recursos didácticos disponibles en contexto ecuatoriano.
- NO inventes destrezas ni códigos curriculares.
- Sé conciso: máximo 2-3 oraciones por campo.

Responde ÚNICAMENTE con JSON válido:
{
  "objetivoAprendizaje": "string",
  "indicadorEvaluacion": "string",
  "actividadesEvaluacion": "string",
  "tecnicaEvaluacion": "string",
  "instrumentoEvaluacion": "string",
  "recursos": "string"
}`;

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en planificación microcurricular del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 800,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: Record<string, string>;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      // Solo devolver los campos solicitados
      const resultado: Record<string, string> = {};
      for (const campo of input.campos) {
        if (parsed[campo] && typeof parsed[campo] === "string") {
          resultado[campo] = parsed[campo];
        }
      }

      return resultado;
    }),
});
