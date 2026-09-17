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
  normalizarPlanificacionMultigrado,
  validarSubnivelHomogeneo,
} from "../lib/curriculo-competencias-normalizer";
import { ceDisponibleParaGrados } from "../data/competencias-especificas-egb-bgu";

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
  nivel: z.string().optional(),
  institucion: z.string().optional(),
  docente: z.string().optional(),
  duracion: z.string().optional(),
  trimestre: z.string().optional(),
  paralelo: z.string().optional(),
  periodoPedagogico: z.string().optional(),
  noSemanasClase: z.number().optional(),
  objetivoGeneral: z.string().optional(),
  situacionAprendizaje: z
    .object({
      titulo: z.string().optional(),
      descripcion: z.string().optional(),
    })
    .optional(),
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

/** Datos para crear/actualizar una planificación multigrado de Currículo Integrado EGB/BGU */
const PlanificacionMultigradoInput = z.object({
  sessionId: z.string().min(1),
  id: z.string().optional(),
  institucion: z.string().optional(),
  docente: z.string().optional(),
  paralelo: z.string().optional(),
  asignatura: z.string().optional(),
  trimestre: z.string().optional(),
  noSemanasClase: z.number().optional(),
  nivel: z.string().optional(),
  grados: z
    .array(
      z.object({
        id: z.string().optional(),
        nivel: z.string().optional(),
        grado: z.string().optional(),
        bloqueCurricular: z
          .object({
            indicadores: z.array(z.string()).optional(),
            declarativos: z.array(z.string()).optional(),
            procedimentales: z.array(z.string()).optional(),
            actitudinales: z.array(z.string()).optional(),
          })
          .optional(),
      })
    )
    .min(2, "La modalidad multigrado requiere 2 o más grados"),
  competenciaEspecifica: z
    .union([
      z.object({
        codigo: z.string().optional(),
        descripcion: z.string().optional(),
      }),
      z.array(z.object({
        codigo: z.string().optional(),
        descripcion: z.string().optional(),
      })),
    ])
    .optional(),
  situacionAprendizaje: z
    .object({
      titulo: z.string().optional(),
      descripcion: z.string().optional(),
    })
    .optional(),
  conexionInterdisciplinar: z
    .object({
      asignaturas: z.array(z.string()).optional(),
    })
    .optional(),
  semanas: z
    .array(
      z.object({
        numero: z.number().optional(),
        tema: z.string().optional(),
        actividades: z
          .array(
            z.object({
              gradoId: z.string().optional(),
              estrategiasDUA: z
                .object({
                  inicio: z.string().optional(),
                  desarrollo: z.string().optional(),
                  cierre: z.string().optional(),
                })
                .optional(),
              recursos: z.string().optional(),
              tecnica: z.string().optional(),
              instrumento: z.string().optional(),
            })
          )
          .optional(),
      })
    )
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

/**
 * El driver mysql2 de drizzle resuelve un INSERT como la tupla cruda
 * [ResultSetHeader, FieldPacket[]] (no como el ResultSetHeader directo),
 * así que `insertId` vive en res[0], no en res. Leerlo directo de `res`
 * devuelve undefined y el cliente termina navegando a un id inexistente.
 */
function extractInsertId(res: unknown): number | undefined {
  const header = Array.isArray(res) ? res[0] : res;
  const id = (header as any)?.insertId;
  return typeof id === "number" ? id : undefined;
}

/**
 * Revalida en el servidor lo que el wizard ya debería haber impedido en el
 * cliente: todos los grados pertenecen al mismo subnivel, y la CE elegida
 * cubre todos los grados seleccionados. Defensa en profundidad — un payload
 * manipulado no debe poder persistir una combinación inválida (design.md D4).
 */
export function validarPlanificacionMultigrado(input: {
  grados: Array<{ nivel?: string; grado?: string }>;
  asignatura?: string;
  competenciaEspecifica?: { codigo?: string; descripcion?: string } | Array<{ codigo?: string; descripcion?: string }>;
}): void {
  const grados = input.grados.map((g) => ({ nivel: (g.nivel ?? "").trim() }));
  const subnivel = validarSubnivelHomogeneo(grados);
  if (!subnivel.valido) {
    throw new Error(
      `Los grados seleccionados pertenecen a subniveles distintos (${subnivel.nivelesEncontrados.join(", ")}); la modalidad multigrado requiere que todos compartan el mismo subnivel.`
    );
  }

  // Support both single and array CE format
  const ces = Array.isArray(input.competenciaEspecifica)
    ? input.competenciaEspecifica
    : input.competenciaEspecifica ? [input.competenciaEspecifica] : [];

  if (!input.asignatura || ces.length === 0) {
    throw new Error("Falta la asignatura o las Competencias Específicas de la planificación multigrado.");
  }

  const nombresGrados = input.grados.map((g) => (g.grado ?? "").trim()).filter(Boolean);
  for (const ce of ces) {
    const ceCodigo = ce.codigo?.trim();
    if (!ceCodigo) continue;
    const cobertura = ceDisponibleParaGrados(input.asignatura, ceCodigo, nombresGrados);
    if (!cobertura.valido) {
      throw new Error(
        `La Competencia Específica ${ceCodigo} no cubre el/los grado(s): ${cobertura.gradosNoCubiertos.join(", ")}.`
      );
    }
  }
}

/** Familias de exportación posibles para una fila de `curriculo_competencias_planificaciones`. */
export type FamiliaExportacionCurriculoCompetencias =
  | "egb_bgu_dcd"
  | "curriculo_integrado_inicial"
  | "curriculo_integrado_single"
  | "curriculo_integrado_multigrado";

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

async function ensureCurriculoCompetenciasTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`curriculo_competencias_planificaciones\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`session_id\` varchar(64) NOT NULL,
        \`tipo\` enum('egb_bgu','inicial_preparatoria') NOT NULL,
        \`grado\` varchar(32),
        \`institucion\` varchar(128),
        \`docente\` varchar(128),
        \`paralelo\` varchar(16),
        \`asignatura\` varchar(64),
        \`nivel\` enum('EGB','BGU'),
        \`periodo_pedagogico\` varchar(64),
        \`trimestre\` varchar(32),
        \`dcd_codigo\` varchar(32),
        \`competencias\` text,
        \`status\` enum('draft','generated','paid') NOT NULL DEFAULT 'draft',
        \`form_data\` text NOT NULL,
        \`ai_result\` text,
        \`source_traceability\` text,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureCurriculoCompetenciasTable warning:", err?.message);
    }
  }
}

// ============================================================
// ROUTER
// ============================================================

export const curriculoCompetenciasRouter = router({
  // ── CREATE EGB/BGU ──────────────────────────────────────────────
  createEGBBGU: publicProcedure
    .input(PlanificacionEGBBGUInput)
    .mutation(async ({ input }) => {
      await ensureCurriculoCompetenciasTable();
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
        id: extractInsertId(res),
        plan,
      };
    }),

  // ── CREATE INICIAL / PREPARATORIA ────────────────────────────────
  createInicial: publicProcedure
    .input(PlanificacionInicialInput)
    .mutation(async ({ input }) => {
      await ensureCurriculoCompetenciasTable();
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionInicial(input, input.id);

      const row = {
        sessionId: input.sessionId,
        tipo: "inicial_preparatoria" as const,
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        asignatura: null,
        // La columna `nivel` es un enum ["EGB","BGU"] pensado para el tipo
        // egb_bgu; los niveles de Currículo Integrado ("ELEMENTAL", etc.)
        // no encajan ahí, así que se dejan solo en formData.
        nivel: null,
        periodoPedagogico: plan.periodoPedagogico || null,
        trimestre: plan.trimestre || null,
        dcdCodigo: null,
        competencias: null,
        // No hay un paso separado de "guardar borrador": el botón del
        // formulario dice "Generar planificación" y ya arma el documento
        // completo, así que el plan queda "generated" desde que se crea
        // (nada en el cliente llama updateStatus, por lo que "draft" se
        // quedaba fijo para siempre).
        status: "generated" as const,
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      const res = await db
        .insert(curriculoCompetenciasPlanificaciones)
        .values(row);

      return {
        id: extractInsertId(res),
        plan,
      };
    }),

  // ── CREATE MULTIGRADO (CURRÍCULO INTEGRADO EGB/BGU) ──────────────
  createMultigrado: publicProcedure
    .input(PlanificacionMultigradoInput)
    .mutation(async ({ input }) => {
      validarPlanificacionMultigrado(input);

      await ensureCurriculoCompetenciasTable();
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionMultigrado(input, input.id);

      const row = {
        sessionId: input.sessionId,
        // Se reutiliza el mismo bucket que Inicial/Integrado single-grade;
        // `formData.modalidad` es el discriminador explícito que evita
        // extender la heurística de prefijo de código (design.md D2).
        tipo: "inicial_preparatoria" as const,
        // La columna `grado` (varchar corto) no alcanza para listar 2..N
        // grados combinados; la lista real vive en formData.grados.
        grado: null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        asignatura: plan.asignatura || null,
        nivel: null,
        periodoPedagogico: null,
        trimestre: plan.trimestre || null,
        dcdCodigo: null,
        competencias: plan.competenciasEspecifica?.length
          ? JSON.stringify(plan.competenciasEspecifica.map((c) => c.codigo).filter(Boolean))
          : null,
        status: "generated" as const,
        formData: JSON.stringify(plan),
        sourceTraceability: plan.source
          ? JSON.stringify(plan.source)
          : null,
      };

      const res = await db
        .insert(curriculoCompetenciasPlanificaciones)
        .values(row);

      return {
        id: extractInsertId(res),
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
      await ensureCurriculoCompetenciasTable();
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
      await ensureCurriculoCompetenciasTable();
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionInicial(input);

      const row = {
        grado: plan.grado || null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        periodoPedagogico: plan.periodoPedagogico || null,
        trimestre: plan.trimestre || null,
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

  // ── UPDATE MULTIGRADO (CURRÍCULO INTEGRADO EGB/BGU) ──────────────
  updateMultigrado: publicProcedure
    .input(PlanificacionMultigradoInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      validarPlanificacionMultigrado(input);

      await ensureCurriculoCompetenciasTable();
      const db = await getDb();
      ensureTable(db);

      const plan = normalizarPlanificacionMultigrado(input);

      const row = {
        grado: null,
        institucion: plan.institucion || null,
        docente: plan.docente || null,
        paralelo: plan.paralelo || null,
        asignatura: plan.asignatura || null,
        nivel: null,
        trimestre: plan.trimestre || null,
        competencias: plan.competenciasEspecifica?.length
          ? JSON.stringify(plan.competenciasEspecifica.map((c) => c.codigo).filter(Boolean))
          : null,
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
      await ensureCurriculoCompetenciasTable();
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
      await ensureCurriculoCompetenciasTable();
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
      await ensureCurriculoCompetenciasTable();
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

      const familia = determinarFamiliaExportacion({ tipo: row.tipo, formData: data });

      let blob: Blob;
      switch (familia) {
        case "curriculo_integrado_inicial": {
          const { generarCurriculoCompetenciasWordInicial } = await import(
            "../lib/curriculo-competencias-inicial-word-generator"
          );
          blob = await generarCurriculoCompetenciasWordInicial(data);
          break;
        }
        case "curriculo_integrado_single": {
          const { generarCurriculoCompetenciasWordEGBBGUIntegrado } = await import(
            "../lib/curriculo-competencias-egb-bgu-integrado-word-generator"
          );
          blob = await generarCurriculoCompetenciasWordEGBBGUIntegrado(data);
          break;
        }
        case "curriculo_integrado_multigrado": {
          const { generarDocxMultigrado } = await import(
            "../lib/curriculo-competencias-egb-bgu-integrado-word-generator"
          );
          blob = await generarDocxMultigrado(data);
          break;
        }
        case "egb_bgu_dcd":
        default: {
          const { generarCurriculoCompetenciasWordEGBBGU } = await import(
            "../lib/curriculo-competencias-word-generator"
          );
          blob = await generarCurriculoCompetenciasWordEGBBGU(data);
        }
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
      await ensureCurriculoCompetenciasTable();
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

      // A diferencia de exportWord, este generador unificado ya distingue
      // internamente por `modalidad`/`ambitos` (ver
      // lib/curriculo-competencias-pdf-generator.ts) — no hace falta repetir
      // aquí la lógica de determinarFamiliaExportacion.
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

  // ── SUGERENCIA IA: título/descripción de la situación de aprendizaje ──
  // (Currículo Integrado — usa competencias específicas CE.*, no DCD)
  sugerirSituacionAprendizaje: publicProcedure
    .input(
      z.object({
        materia: z.string().optional(),
        nivel: z.string().optional(),
        grado: z.string().optional(),
        competencias: z
          .array(z.object({ codigo: z.string(), descripcion: z.string() }))
          .min(1),
        temasTrimestre: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM, repairJson } = await import("./_core/llm");

      const competenciasTexto = input.competencias
        .map((c) => `- ${c.codigo}: ${c.descripcion}`)
        .join("\n");

      const prompt = `Eres un experto en el Currículo Integrado por Competencias del Ministerio de Educación del Ecuador.

CONTEXTO:
- Materia: ${input.materia || "No especificada"}
- Nivel: ${input.nivel || "No especificado"}
- Grado/Curso: ${input.grado || "No especificado"}
- Competencias específicas seleccionadas para el trimestre:
${competenciasTexto}
${input.temasTrimestre ? `- Temas del trimestre ya definidos por el docente: ${input.temasTrimestre}` : ""}

SOLICITUD:
Sugiere un título y una descripción breve para la "situación de aprendizaje" (el hilo conductor del trimestre) que integre las competencias listadas.

REGLAS:
- El título debe ser corto (máximo 10 palabras), concreto y motivador para estudiantes del grado indicado — no repitas literalmente el texto de una competencia.
- La descripción debe tener 1-2 oraciones, explicando qué van a explorar o producir los estudiantes y por qué conecta con las competencias.
- No inventes competencias, códigos ni destrezas fuera de las listadas.
- Si ya hay temas del trimestre definidos por el docente, el título y la descripción deben ser coherentes con ellos.

Responde ÚNICAMENTE con JSON válido:
{
  "titulo": "string",
  "descripcion": "string"
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
        maxTokens: 400,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: { titulo?: string; descripcion?: string };
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      if (!parsed.titulo || typeof parsed.titulo !== "string") {
        throw new Error("La IA no devolvió un título válido. Intenta de nuevo.");
      }

      return {
        titulo: parsed.titulo,
        descripcion: typeof parsed.descripcion === "string" ? parsed.descripcion : "",
      };
    }),
});
