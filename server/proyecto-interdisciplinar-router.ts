import { z } from "zod";
import { and, desc, eq, like, or } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { proyectosInterdisciplinares } from "../drizzle/schema";
import {
  normalizarProyectoInterdisciplinar,
  validarProyectoParaGenerar,
  type ProyectoInterdisciplinarRaw,
} from "../lib/proyecto-interdisciplinar-normalizer";
import type { ProyectoInterdisciplinarPlan } from "../data/types-proyecto-interdisciplinar";

// ============================================================
// ZOD SCHEMAS DE ENTRADA
// ============================================================

const AreaProyectoInput = z.object({
  id: z.string().optional(),
  areaId: z.string().min(1),
  nombreArea: z.string().optional(),
  nivel: z.string().min(1),
  subnivel: z.string().optional(),
  grado: z.string().min(1),
});

const ElementoCurricularInput = z.object({
  areaProyectoId: z.string().min(1),
  codigo: z.string().min(1),
});

const ActividadProyectoInput = z.object({
  id: z.string().optional(),
  fase: z.enum(["planificacion", "gestion", "evaluacion"]),
  actividad: z.string().optional(),
  recursos: z.string().optional(),
  evidencia: z.string().optional(),
  evaluacion: z.string().optional(),
  instrumentoEvaluacion: z.string().optional(),
  criteriosVinculados: z.array(z.string()).optional(),
});

/** Datos para crear/actualizar un Proyecto Interdisciplinar (borrador permisivo — ver design.md D3). */
const ProyectoInterdisciplinarInput = z.object({
  sessionId: z.string().min(1),
  baseCurricular: z.enum(["destrezas", "competencias"]),
  titulo: z.string().optional(),
  contexto: z.string().optional(),
  preguntaGuia: z.string().optional(),
  objetivoGeneral: z.string().optional(),
  objetivosEspecificos: z.array(z.string()).optional(),
  productoFinal: z.string().optional(),
  duracion: z.string().optional(),
  metodologia: z.string().optional(),
  areas: z.array(AreaProyectoInput).default([]),
  elementosCurriculares: z.array(ElementoCurricularInput).default([]),
  actividades: z.array(ActividadProyectoInput).default([]),
  evaluacionGeneral: z.string().optional(),
  institucion: z.string().optional(),
  docentesParticipantes: z.array(z.string()).optional(),
  adaptaciones: z.string().optional(),
  observaciones: z.string().optional(),
});

// ============================================================
// HELPERS
// ============================================================

function ensureDb(
  db: Awaited<ReturnType<typeof getDb>>
): asserts db is NonNullable<Awaited<ReturnType<typeof getDb>>> {
  if (!db) throw new Error("Base de datos no disponible");
}

/**
 * El driver mysql2 de drizzle resuelve un INSERT como la tupla cruda
 * [ResultSetHeader, FieldPacket[]] (no como el ResultSetHeader directo),
 * así que `insertId` vive en res[0], no en res (mismo patrón que
 * curriculo-competencias-router.ts).
 */
function extractInsertId(res: unknown): number | undefined {
  const header = Array.isArray(res) ? res[0] : res;
  const id = (header as any)?.insertId;
  return typeof id === "number" ? id : undefined;
}

function nivelPrincipalDe(plan: ProyectoInterdisciplinarPlan): {
  nivelPrincipal: string | null;
  subnivelPrincipal: string | null;
} {
  const primera = plan.areas[0];
  return {
    nivelPrincipal: primera?.nivel || null,
    subnivelPrincipal: primera?.subnivel || null,
  };
}

async function ensureProyectoInterdisciplinarTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`proyectos_interdisciplinares\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`session_id\` varchar(64) NOT NULL,
        \`base_curricular\` enum('destrezas','competencias') NOT NULL,
        \`titulo\` varchar(256) NOT NULL,
        \`nivel_principal\` varchar(32),
        \`subnivel_principal\` varchar(32),
        \`institucion\` varchar(128),
        \`estado\` enum('borrador','generado') NOT NULL DEFAULT 'borrador',
        \`form_data\` text NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureProyectoInterdisciplinarTable warning:", err?.message);
    }
  }
}

function aFila(plan: ProyectoInterdisciplinarPlan) {
  const { nivelPrincipal, subnivelPrincipal } = nivelPrincipalDe(plan);
  return {
    sessionId: plan.sessionId,
    baseCurricular: plan.baseCurricular,
    titulo: plan.titulo || "(sin título)",
    nivelPrincipal,
    subnivelPrincipal,
    institucion: plan.institucion || null,
    estado: plan.estado,
    formData: JSON.stringify(plan),
  };
}

// ============================================================
// ROUTER
// ============================================================

export const proyectoInterdisciplinarRouter = router({
  // ── CREATE ──────────────────────────────────────────────────────
  create: publicProcedure
    .input(ProyectoInterdisciplinarInput)
    .mutation(async ({ input }) => {
      await ensureProyectoInterdisciplinarTable();
      const db = await getDb();
      ensureDb(db);

      const plan = normalizarProyectoInterdisciplinar(
        input as ProyectoInterdisciplinarRaw
      );

      const res = await db
        .insert(proyectosInterdisciplinares)
        .values(aFila(plan));

      return { id: extractInsertId(res), plan };
    }),

  // ── UPDATE ──────────────────────────────────────────────────────
  update: publicProcedure
    .input(ProyectoInterdisciplinarInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      await ensureProyectoInterdisciplinarTable();
      const db = await getDb();
      ensureDb(db);

      const rows = await db
        .select({ estado: proyectosInterdisciplinares.estado })
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new Error("Proyecto no encontrado");

      const plan = normalizarProyectoInterdisciplinar({
        ...(input as ProyectoInterdisciplinarRaw),
        // El estado (borrador/generado) se cambia solo vía updateStatus,
        // nunca implícitamente al editar campos.
        estado: rows[0].estado,
      });

      await db
        .update(proyectosInterdisciplinares)
        .set(aFila(plan))
        .where(eq(proyectosInterdisciplinares.id, input.id));

      return { success: true, plan };
    }),

  // ── UPDATE STATUS (borrador ↔ generado) ──────────────────────────
  updateStatus: publicProcedure
    .input(z.object({ id: z.number(), estado: z.enum(["borrador", "generado"]) }))
    .mutation(async ({ input }) => {
      await ensureProyectoInterdisciplinarTable();
      const db = await getDb();
      ensureDb(db);

      const rows = await db
        .select()
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new Error("Proyecto no encontrado");

      const plan: ProyectoInterdisciplinarPlan = JSON.parse(rows[0].formData);

      if (input.estado === "generado") {
        validarProyectoParaGenerar(plan);
      }
      plan.estado = input.estado;
      plan.updatedAt = new Date().toISOString();

      await db
        .update(proyectosInterdisciplinares)
        .set({ estado: input.estado, formData: JSON.stringify(plan) })
        .where(eq(proyectosInterdisciplinares.id, input.id));

      return { success: true };
    }),

  // ── DUPLICATE ─────────────────────────────────────────────────────
  duplicate: publicProcedure
    .input(z.object({ id: z.number(), sessionId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await ensureProyectoInterdisciplinarTable();
      const db = await getDb();
      ensureDb(db);

      const rows = await db
        .select()
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new Error("Proyecto no encontrado");

      const original: ProyectoInterdisciplinarPlan = JSON.parse(rows[0].formData);
      const timestamp = new Date().toISOString();
      const copia: ProyectoInterdisciplinarPlan = {
        ...original,
        id: `proyecto-interdisciplinar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        sessionId: input.sessionId,
        titulo: original.titulo ? `${original.titulo} (copia)` : "(sin título) (copia)",
        estado: "borrador",
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const res = await db
        .insert(proyectosInterdisciplinares)
        .values(aFila(copia));

      return { id: extractInsertId(res), plan: copia };
    }),

  // ── DELETE ────────────────────────────────────────────────────────
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await ensureProyectoInterdisciplinarTable();
      const db = await getDb();
      ensureDb(db);

      await db
        .delete(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id));

      return { success: true };
    }),

  // ── GET BY ID ────────────────────────────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const rows = await db
        .select()
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) return null;

      const row = rows[0];
      return { ...row, formData: JSON.parse(row.formData) as ProyectoInterdisciplinarPlan };
    }),

  // ── EXPORT WORD ─────────────────────────────────────────────────
  exportWord: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureDb(db);

      const rows = await db
        .select()
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new Error("Proyecto no encontrado");

      const row = rows[0];
      const plan: ProyectoInterdisciplinarPlan = JSON.parse(row.formData);

      const { generarProyectoInterdisciplinarWord } = await import(
        "../lib/proyecto-interdisciplinar-word-generator"
      );
      const blob = await generarProyectoInterdisciplinarWord(plan);
      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        base64,
        filename: `proyecto-interdisciplinar-${row.id}.docx`,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }),

  // ── EXPORT PDF ──────────────────────────────────────────────────
  exportPdf: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      ensureDb(db);

      const rows = await db
        .select()
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new Error("Proyecto no encontrado");

      const row = rows[0];
      const plan: ProyectoInterdisciplinarPlan = JSON.parse(row.formData);

      const { generarProyectoInterdisciplinarPdf } = await import(
        "../lib/proyecto-interdisciplinar-pdf-generator"
      );
      const html = generarProyectoInterdisciplinarPdf(plan);

      return {
        html,
        filename: `proyecto-interdisciplinar-${row.id}.pdf`,
      };
    }),

  // ── LIST (por sessionId, propio del docente) ────────────────────
  list: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select({
          id: proyectosInterdisciplinares.id,
          titulo: proyectosInterdisciplinares.titulo,
          baseCurricular: proyectosInterdisciplinares.baseCurricular,
          nivelPrincipal: proyectosInterdisciplinares.nivelPrincipal,
          subnivelPrincipal: proyectosInterdisciplinares.subnivelPrincipal,
          institucion: proyectosInterdisciplinares.institucion,
          estado: proyectosInterdisciplinares.estado,
          updatedAt: proyectosInterdisciplinares.updatedAt,
        })
        .from(proyectosInterdisciplinares)
        .where(eq(proyectosInterdisciplinares.sessionId, input.sessionId))
        .orderBy(desc(proyectosInterdisciplinares.updatedAt))
        .limit(50);

      return rows;
    }),

  // ── SEARCH (por título o código curricular dentro del formData) ──
  search: publicProcedure
    .input(z.object({ sessionId: z.string().min(1), query: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const patron = `%${input.query}%`;
      const rows = await db
        .select({
          id: proyectosInterdisciplinares.id,
          titulo: proyectosInterdisciplinares.titulo,
          baseCurricular: proyectosInterdisciplinares.baseCurricular,
          nivelPrincipal: proyectosInterdisciplinares.nivelPrincipal,
          subnivelPrincipal: proyectosInterdisciplinares.subnivelPrincipal,
          institucion: proyectosInterdisciplinares.institucion,
          estado: proyectosInterdisciplinares.estado,
          updatedAt: proyectosInterdisciplinares.updatedAt,
        })
        .from(proyectosInterdisciplinares)
        .where(
          and(
            eq(proyectosInterdisciplinares.sessionId, input.sessionId),
            or(
              like(proyectosInterdisciplinares.titulo, patron),
              like(proyectosInterdisciplinares.formData, patron)
            )
          )
        )
        .orderBy(desc(proyectosInterdisciplinares.updatedAt))
        .limit(50);

      return rows;
    }),

  // ── SUGERENCIA IA (solo texto — nunca códigos curriculares) ──────
  sugerirProyecto: publicProcedure
    .input(
      z.object({
        baseCurricular: z.enum(["destrezas", "competencias"]),
        areas: z.array(
          z.object({
            nombreArea: z.string(),
            nivel: z.string().optional(),
            grado: z.string().optional(),
          })
        ),
        elementosCurriculares: z.array(
          z.object({ codigo: z.string(), descripcion: z.string().optional() })
        ),
        campos: z
          .array(
            z.enum([
              "titulo",
              "preguntaGuia",
              "objetivoGeneral",
              "productoFinal",
              "actividadesSugeridas",
              "recursos",
              "instrumentoEvaluacion",
            ])
          )
          .min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM, repairJson } = await import("./_core/llm");

      const areasTexto = input.areas
        .map((a) => `- ${a.nombreArea}${a.nivel ? ` (${a.nivel}${a.grado ? `, ${a.grado}` : ""})` : ""}`)
        .join("\n");
      const elementosTexto = input.elementosCurriculares
        .map((e) => `- ${e.codigo}${e.descripcion ? `: ${e.descripcion}` : ""}`)
        .join("\n");
      const camposSolicitud = input.campos.join(", ");

      const prompt = `Eres un experto en proyectos interdisciplinares del Ministerio de Educación del Ecuador (instructivo de Proyecto Interdisciplinar, EGB Superior/BGU).

CONTEXTO DEL PROYECTO:
- Base curricular: ${input.baseCurricular === "destrezas" ? "destrezas con criterios de desempeño" : "competencias específicas (Currículo Nacional por Competencias)"}
- Áreas participantes:
${areasTexto || "(ninguna seleccionada todavía)"}
- Elementos curriculares ya seleccionados por el docente (NO los modifiques ni inventes otros):
${elementosTexto || "(ninguno seleccionado todavía)"}

SOLICITUD:
Genera sugerencias de texto para: ${camposSolicitud}.

REGLAS:
- NO inventes códigos curriculares, destrezas ni competencias específicas; usa solo las ya listadas como contexto.
- El proyecto debe integrar realmente las áreas listadas, no una sola.
- Para "titulo": máximo 10 palabras, concreto y motivador.
- Para "preguntaGuia": una pregunta abierta que oriente la indagación del proyecto.
- Para "objetivoGeneral": 1 oración, verbo en infinitivo.
- Para "productoFinal": describe un producto tangible y evaluable.
- Para "actividadesSugeridas": 2-3 actividades breves, una por línea.
- Para "recursos": recursos didácticos disponibles en contexto ecuatoriano.
- Para "instrumentoEvaluacion": instrumento coherente con rúbrica o portafolio.
- Sé conciso.

Responde ÚNICAMENTE con JSON válido:
{
  "titulo": "string",
  "preguntaGuia": "string",
  "objetivoGeneral": "string",
  "productoFinal": "string",
  "actividadesSugeridas": "string",
  "recursos": "string",
  "instrumentoEvaluacion": "string"
}`;

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en planificación de proyectos interdisciplinares del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
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

      // Solo se devuelven los campos de texto pedidos — nunca códigos
      // curriculares nuevos (los códigos siempre vienen del catálogo,
      // seleccionados por el docente, nunca de la IA).
      const resultado: Record<string, string> = {};
      for (const campo of input.campos) {
        if (parsed[campo] && typeof parsed[campo] === "string") {
          resultado[campo] = parsed[campo];
        }
      }
      return resultado;
    }),

  // ── SUGERENCIA IA: instrumentos de evaluación por actividad ──────
  // Propone, para cada actividad, un instrumento concreto (lista de cotejo,
  // rúbrica, escala, etc.) alineado a las destrezas con criterios de
  // desempeño (o competencias específicas) elegidas por el docente. Nunca
  // devuelve códigos nuevos: los criterios vinculados se filtran contra los
  // códigos recibidos.
  sugerirInstrumentosEvaluacion: publicProcedure
    .input(
      z.object({
        baseCurricular: z.enum(["destrezas", "competencias"]),
        titulo: z.string().optional(),
        productoFinal: z.string().optional(),
        elementosCurriculares: z.array(
          z.object({
            codigo: z.string(),
            nombreArea: z.string().optional(),
            descripcion: z.string().optional(),
          })
        ),
        actividades: z
          .array(
            z.object({
              id: z.string(),
              fase: z.enum(["planificacion", "gestion", "evaluacion"]),
              actividad: z.string(),
              evidencia: z.string().optional(),
              evaluacion: z.string().optional(),
            })
          )
          .min(1)
          .max(12),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM, repairJson } = await import("./_core/llm");

      const esDestrezas = input.baseCurricular === "destrezas";
      const elementosTexto = input.elementosCurriculares
        .map(
          (e) =>
            `- ${e.codigo}${e.nombreArea ? ` [${e.nombreArea}]` : ""}${e.descripcion ? `: ${e.descripcion}` : ""}`
        )
        .join("\n");
      const actividadesTexto = input.actividades
        .map(
          (a) =>
            `- id "${a.id}" (fase ${a.fase}): ${a.actividad}${a.evidencia ? ` | Evidencia: ${a.evidencia}` : ""}${
              a.evaluacion ? ` | Cómo se evalúa: ${a.evaluacion}` : ""
            }`
        )
        .join("\n");

      const prompt = `Eres un experto en evaluación educativa del Ministerio de Educación del Ecuador (instructivo de Proyecto Interdisciplinar).

CONTEXTO DEL PROYECTO:
- Título: ${input.titulo || "(sin título)"}
- Producto final: ${input.productoFinal || "(sin definir)"}
- Base curricular: ${esDestrezas ? "destrezas con criterios de desempeño" : "competencias específicas (Currículo Nacional por Competencias)"}
- Elementos curriculares seleccionados por el docente (NO los modifiques ni inventes otros):
${elementosTexto || "(ninguno)"}

ACTIVIDADES A EVALUAR:
${actividadesTexto}

SOLICITUD:
Para CADA actividad, sugiere UN instrumento de evaluación concreto y coherente con la evidencia que produce la actividad y con ${
        esDestrezas ? "el criterio de desempeño de las destrezas" : "los indicadores de las competencias"
      } listadas.

REGLAS:
- Elige el tipo de instrumento más adecuado a la evidencia: lista de cotejo, rúbrica (analítica u holística), escala de valoración, guía de observación, registro anecdótico, portafolio, prueba escrita, autoevaluación o coevaluación. Varía el tipo cuando tenga sentido; no repitas la rúbrica en todas.
- "instrumento": el tipo de instrumento más 2-3 criterios o indicadores concretos a valorar (máximo 30 palabras). Ej.: "Lista de cotejo: registra fuentes, organiza datos en tabla, presenta conclusiones con evidencia".
- "criteriosVinculados": códigos EXACTOS tomados solo de la lista de elementos curriculares de arriba que esa actividad permite evaluar (1 a 3). No inventes códigos.
- Usa el "id" de cada actividad tal cual.

Responde ÚNICAMENTE con JSON válido:
{
  "instrumentos": [
    { "id": "string", "instrumento": "string", "criteriosVinculados": ["string"] }
  ]
}`;

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en evaluación de aprendizajes del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 400 + input.actividades.length * 220,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      const idsValidos = new Set(input.actividades.map((a) => a.id));
      const codigosValidos = new Set(input.elementosCurriculares.map((e) => e.codigo));
      const instrumentos = Array.isArray(parsed?.instrumentos)
        ? parsed.instrumentos
            .filter(
              (i: any) =>
                i && typeof i.id === "string" && idsValidos.has(i.id) && typeof i.instrumento === "string" && i.instrumento.trim()
            )
            .map((i: any) => ({
              id: i.id as string,
              instrumento: (i.instrumento as string).trim(),
              criteriosVinculados: Array.isArray(i.criteriosVinculados)
                ? (i.criteriosVinculados as unknown[]).filter(
                    (c): c is string => typeof c === "string" && codigosValidos.has(c)
                  )
                : [],
            }))
        : [];

      if (instrumentos.length === 0) {
        throw new Error("La IA no devolvió instrumentos válidos. Intenta de nuevo.");
      }
      return { instrumentos };
    }),

  // ── GENERACIÓN COMPLETA CON IA (formulario corto → proyecto completo) ──
  // Recibe lo mínimo que el docente ya llenó (título, contexto, pregunta
  // guía, producto final — cualquiera puede venir vacío) y los elementos
  // curriculares que ya seleccionó (nunca los inventa la IA). Devuelve el
  // proyecto completo: los campos de texto vacíos rellenados, más
  // actividades por fase y evaluación general generadas desde cero.
  generarProyectoCompleto: publicProcedure
    .input(
      z.object({
        baseCurricular: z.enum(["destrezas", "competencias"]),
        titulo: z.string().optional(),
        contexto: z.string().optional(),
        preguntaGuia: z.string().optional(),
        productoFinal: z.string().optional(),
        elementosCurriculares: z
          .array(
            z.object({
              codigo: z.string(),
              area: z.string(),
              nombreArea: z.string(),
              descripcion: z.string().optional(),
            })
          )
          .min(2, "Se requieren al menos 2 elementos curriculares de áreas distintas."),
      })
    )
    .mutation(async ({ input }) => {
      const { invokeLLM, repairJson } = await import("./_core/llm");

      const elementosTexto = input.elementosCurriculares
        .map((e) => `- [${e.nombreArea}] ${e.codigo}${e.descripcion ? `: ${e.descripcion}` : ""}`)
        .join("\n");

      const prompt = `Eres un experto en proyectos interdisciplinares del Ministerio de Educación del Ecuador (instructivo de Proyecto Interdisciplinar, 3 fases: Planificación, Gestión del proyecto, Evaluación del proyecto).

CONTEXTO DEL PROYECTO:
- Base curricular: ${input.baseCurricular === "destrezas" ? "destrezas con criterios de desempeño" : "competencias específicas (Currículo Nacional por Competencias)"}
- Elementos curriculares ya seleccionados por el docente (NO los modifiques, no inventes otros, no inventes códigos):
${elementosTexto}
- Título del proyecto ${input.titulo ? `(ya definido por el docente, respétalo tal cual): ${input.titulo}` : "(el docente no lo definió — proponlo tú)"}
- Contexto/situación ${input.contexto ? `(ya definido, respétalo tal cual): ${input.contexto}` : "(el docente no lo definió — proponlo tú)"}
- Pregunta guía ${input.preguntaGuia ? `(ya definida, respétala tal cual): ${input.preguntaGuia}` : "(el docente no la definió — proponla tú)"}
- Producto final ${input.productoFinal ? `(ya definido, respétalo tal cual): ${input.productoFinal}` : "(el docente no lo definió — proponlo tú)"}

SOLICITUD:
Genera el proyecto interdisciplinar completo, integrando REALMENTE todas las áreas listadas arriba (no solo una).

REGLAS:
- NO inventes códigos curriculares, destrezas ni competencias específicas; usa solo las ya listadas como contexto.
- Si un campo ya viene definido arriba, cópialo tal cual en tu respuesta sin cambiarlo.
- "objetivoGeneral": 1 oración, verbo en infinitivo, integrando las áreas.
- "actividades": exactamente 2 actividades por cada fase ("planificacion", "gestion", "evaluacion"), cada una con: actividad (qué hacen los estudiantes), recursos, evidencia (qué queda), evaluacion (cómo se evalúa esa actividad puntual) e instrumentoEvaluacion (el instrumento concreto: lista de cotejo, rúbrica, escala de valoración, guía de observación, portafolio, etc., más 2-3 criterios a valorar, máximo 25 palabras; elige el tipo según la evidencia y no uses rúbrica en todas). Actividades concretas y breves, coherentes con las áreas y el producto final.
- "evaluacionGeneral": 1-2 oraciones describiendo cómo se evalúa el proyecto en conjunto (rúbrica y/o portafolio, sugerido por el instructivo oficial).
- Sé conciso en todos los campos de texto.

Responde ÚNICAMENTE con JSON válido con esta forma exacta:
{
  "titulo": "string",
  "contexto": "string",
  "preguntaGuia": "string",
  "objetivoGeneral": "string",
  "productoFinal": "string",
  "actividades": [
    { "fase": "planificacion", "actividad": "string", "recursos": "string", "evidencia": "string", "evaluacion": "string", "instrumentoEvaluacion": "string" }
  ],
  "evaluacionGeneral": "string"
}`;

      const raw = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en planificación de proyectos interdisciplinares del sistema educativo ecuatoriano. Responde siempre con JSON válido.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 2200,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
        }
      }

      const fasesValidas = new Set(["planificacion", "gestion", "evaluacion"]);
      const actividades = Array.isArray(parsed.actividades)
        ? parsed.actividades
            .filter((a: any) => a && fasesValidas.has(a.fase))
            .map((a: any) => ({
              fase: a.fase as "planificacion" | "gestion" | "evaluacion",
              actividad: typeof a.actividad === "string" ? a.actividad : "",
              recursos: typeof a.recursos === "string" ? a.recursos : "",
              evidencia: typeof a.evidencia === "string" ? a.evidencia : "",
              evaluacion: typeof a.evaluacion === "string" ? a.evaluacion : "",
              instrumentoEvaluacion:
                typeof a.instrumentoEvaluacion === "string" && a.instrumentoEvaluacion.trim()
                  ? a.instrumentoEvaluacion.trim()
                  : undefined,
            }))
        : [];

      return {
        titulo: typeof parsed.titulo === "string" ? parsed.titulo : undefined,
        contexto: typeof parsed.contexto === "string" ? parsed.contexto : undefined,
        preguntaGuia: typeof parsed.preguntaGuia === "string" ? parsed.preguntaGuia : undefined,
        objetivoGeneral: typeof parsed.objetivoGeneral === "string" ? parsed.objetivoGeneral : "",
        productoFinal: typeof parsed.productoFinal === "string" ? parsed.productoFinal : undefined,
        actividades,
        evaluacionGeneral: typeof parsed.evaluacionGeneral === "string" ? parsed.evaluacionGeneral : "",
      };
    }),
});
