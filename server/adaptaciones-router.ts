import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import { getDb } from "./db";
import { curricularAdaptations } from "../drizzle/schema";
import { NEE_STRATEGIES } from "../data/nee-strategies";
import type { AdaptacionAiResult, GradoAdaptacion } from "../data/types";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

/** Contexto de la planificación semanal vinculada — actividades ERCA reales por día */
const SemanaContextDiaSchema = z.object({
  dia: z.string(),
  tema: z.string(),
  objetivo: z.string().optional(),
  actividades: z.object({
    experiencia: z.array(z.string()),
    reflexion: z.array(z.string()),
    conceptualizacion: z.array(z.string()),
    aplicacion: z.array(z.string()),
  }),
  recursos: z.array(z.string()),
});
const SemanaContextSchema = z.object({
  dias: z.array(SemanaContextDiaSchema),
});

/** Contexto de la planificación diaria vinculada — actividades ERCA reales de la clase */
const PlanContextSchema = z.object({
  tema: z.string(),
  objetivo: z.string().optional(),
  actividades: z.object({
    experiencia: z.array(z.string()),
    reflexion: z.array(z.string()),
    conceptualizacion: z.array(z.string()),
    aplicacion: z.array(z.string()),
  }),
  recursos: z.array(z.string()),
});

/** Contexto del PCT/PCA — unidades de la sección 5 */
const PctContextSchema = z.object({
  unidades: z.array(z.object({
    numero: z.number(),
    titulo: z.string(),
    objetivosEspecificos: z.string(),
    destrezas: z.array(z.string()),
    orientacionesMetodologicas: z.array(z.string()),
  })),
});

const FormSchema = z.object({
  institucion: z.string(),
  docente: z.string(),
  anioLectivo: z.string(),
  area: z.string(),
  subnivel: z.number(),
  grado: z.string(),
  paralelo: z.string(),
  periodoPedagogico: z.string(),
  trimestre: z.string(),
  codigoEstudiante: z.string(),
  codigoDestreza: z.string(),
  descripcionDestreza: z.string().min(10),
  gradoAdaptacion: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tipoNEE: z.string(),
  estiloAprendizaje: z.string(),
  fortalezas: z.string(),
  desafios: z.string(),
  apoyosDisponibles: z.string(),
});

// ─── Prompt builder ───────────────────────────────────────────────────────────

const AREA_NAMES: Record<string, string> = {
  M: "Matemática", LL: "Lengua y Literatura", CN: "Ciencias Naturales",
  CS: "Estudios Sociales", EF: "Educación Física", ECA: "Educación Cultural y Artística",
  EFL: "Lengua Extranjera (Inglés)", "CN.B": "Biología", "CN.Q": "Química",
  "CN.F": "Física", "CS.H": "Historia", "CS.F": "Filosofía",
  "CS.EC": "Educación para la Ciudadanía", CAI: "Cívica — Acompañamiento Integral",
  EG: "Emprendimiento y Gestión",
};

const SUBNIVEL_NAMES: Record<number, string> = {
  0: "Educación Inicial", 1: "Preparatoria (1.° EGB)",
  2: "Básica Elemental (2.°–4.°)", 3: "Básica Media (5.°–7.°)",
  4: "Básica Superior (8.°–10.°)", 5: "Bachillerato General Unificado",
};

function buildPrompt(
  input: z.infer<typeof FormSchema>,
  semanaContext?: z.infer<typeof SemanaContextSchema>,
  planContext?: z.infer<typeof PlanContextSchema>,
  pctContext?: z.infer<typeof PctContextSchema>,
): string {
  const grado = input.gradoAdaptacion as GradoAdaptacion;
  const neeInfo = NEE_STRATEGIES[input.tipoNEE as keyof typeof NEE_STRATEGIES];
  const areaNombre = AREA_NAMES[input.area] ?? input.area;
  const subnivel = SUBNIVEL_NAMES[input.subnivel] ?? `Subnivel ${input.subnivel}`;

  const incluirProceso = grado >= 2;
  const incluirResultado = grado >= 3;

  const gradoDesc = {
    1: "GRADO 1 — DE ACCESO: solo adaptaciones de acceso al currículo (organización, apoyos, accesibilidad). La destreza, el criterio y los indicadores NO se modifican.",
    2: "GRADO 2 — NO SIGNIFICATIVA: adaptaciones de acceso + metodología/actividades + instrumentos de evaluación. La destreza se simplifica levemente manteniendo el objetivo esencial.",
    3: "GRADO 3 — SIGNIFICATIVA: adaptaciones de acceso + metodología + contenido/objetivo. La destreza se modifica sustancialmente. REQUIERE evaluación psicopedagráfica que justifique desfase curricular >2 años. Solo asignar si hay desfase documentado.",
  }[grado];

  const estrategiasNEE = neeInfo
    ? `
ESTRATEGIAS PEDAGÓGICAS SUGERIDAS PARA ESTE TIPO DE NEE:
- Acceso: ${neeInfo.estrategiasAcceso.slice(0, 3).join(" | ")}
${incluirProceso ? `- Proceso: ${neeInfo.estrategiasProceso.slice(0, 3).join(" | ")}` : ""}
${incluirResultado ? `- Resultado: ${neeInfo.estrategiasResultado.slice(0, 3).join(" | ")}` : ""}
- Recursos: ${neeInfo.recursosEspecificos.slice(0, 3).join(" | ")}`
    : "";

  return `Eres un experto en educación inclusiva y adaptaciones curriculares para el sistema educativo ecuatoriano (MinEduc).

CONTEXTO DEL DOCUMENTO:
- Institución: ${input.institucion || "(sin especificar)"}
- Docente: ${input.docente || "(sin especificar)"}
- Área: ${areaNombre}
- Subnivel/Grado: ${subnivel} — ${input.grado}
- Año lectivo: ${input.anioLectivo || ""}
- Código anónimo del estudiante: ${input.codigoEstudiante || "E-001"}

DESTREZA A ADAPTAR:
Código: ${input.codigoDestreza}
Descripción original: "${input.descripcionDestreza}"

TIPO DE NEE: ${neeInfo?.nombre ?? input.tipoNEE}
Estilo de aprendizaje predominante: ${input.estiloAprendizaje}
Fortalezas pedagógicas del estudiante: ${input.fortalezas}
Desafíos pedagógicos: ${input.desafios}
Apoyos disponibles: ${input.apoyosDisponibles}
${estrategiasNEE}

TIPO DE ADAPTACIÓN SOLICITADA:
${gradoDesc}

${semanaContext?.dias?.length ? `
──────────────────────────────────────────────────────────────────
ESTRATEGIAS METODOLÓGICAS ACTIVAS POR DÍA (REFERENCIA OBLIGATORIA):
Las adaptaciones curriculares DEBEN derivarse de las actividades ERCA realmente planificadas.
Cada fase ERCA es una Estrategia Metodológica Activa — adapta CADA FASE para el perfil NEE.

${semanaContext.dias.map((d) => {
  const act = d.actividades;
  const experiencia = act.experiencia.slice(0, 2).join(" | ") || "(sin actividades)";
  const reflexion = act.reflexion.slice(0, 2).join(" | ") || "(sin actividades)";
  const conceptualizacion = act.conceptualizacion.slice(0, 2).join(" | ") || "(sin actividades)";
  const aplicacion = act.aplicacion.slice(0, 2).join(" | ") || "(sin actividades)";
  const recursos = d.recursos.slice(0, 4).join(", ") || "(sin recursos específicos)";
  return `${d.dia.toUpperCase()} — Tema: "${d.tema}"${d.objetivo ? `\n  Objetivo: "${d.objetivo}"` : ""}
  → Experiencia planificada: ${experiencia}
  → Reflexión planificada: ${reflexion}
  → Conceptualización planificada: ${conceptualizacion}
  → Aplicación planificada: ${aplicacion}
  → Recursos del día: ${recursos}`;
}).join("\n\n")}

REGLA: Para cada día genera "adaptacionERCA" con adaptación ESPECÍFICA de cada fase.
Ejemplo: si la Experiencia usa bloques lógicos → "adaptacionERCA.experiencia" debe decir cómo usar esos bloques adaptados al NEE.
──────────────────────────────────────────────────────────────────
` : ""}
${planContext ? `
──────────────────────────────────────────────────────────────────
PLANIFICACIÓN DIARIA VINCULADA (REFERENCIA OBLIGATORIA):
Las adaptaciones curriculares DEBEN derivarse de las actividades ERCA realmente planificadas en la clase.
Cada fase ERCA es una Estrategia Metodológica Activa — adapta CADA FASE para el perfil NEE.

CLASE — Tema: "${planContext.tema}"${planContext.objetivo ? `\n  Objetivo: "${planContext.objetivo}"` : ""}
  → Experiencia planificada: ${planContext.actividades.experiencia.slice(0, 2).join(" | ") || "(sin actividades)"}
  → Reflexión planificada: ${planContext.actividades.reflexion.slice(0, 2).join(" | ") || "(sin actividades)"}
  → Conceptualización planificada: ${planContext.actividades.conceptualizacion.slice(0, 2).join(" | ") || "(sin actividades)"}
  → Aplicación planificada: ${planContext.actividades.aplicacion.slice(0, 2).join(" | ") || "(sin actividades)"}
  → Recursos de la clase: ${planContext.recursos.slice(0, 4).join(", ") || "(sin recursos específicos)"}

REGLA: Genera "adaptacionesPorDia" con UNA sola entrada (dia: "Clase") con "adaptacionERCA" ESPECÍFICA de cada fase.
Ejemplo: si la Experiencia usa bloques lógicos → "adaptacionERCA.experiencia" debe decir cómo usar esos bloques adaptados al NEE.
──────────────────────────────────────────────────────────────────
` : ""}
${pctContext?.unidades?.length ? `
──────────────────────────────────────────────────────────────────
UNIDADES DEL PCT/PCA (REFERENCIA OBLIGATORIA):
Las adaptaciones curriculares DEBEN derivarse de las unidades reales del plan curricular.
Para cada unidad, adapta las actividades ERCA y el contenido al perfil NEE del estudiante.

${pctContext.unidades.map((u) => `UNIDAD ${u.numero} — "${u.titulo}"
  Objetivos: ${u.objetivosEspecificos}
  Destrezas: ${u.destrezas.join(", ")}
  Orientaciones: ${u.orientacionesMetodologicas.slice(0, 2).join(" | ")}`).join("\n\n")}

REGLA: Para cada unidad genera una entrada en "adaptacionesPorDia" con dia: "Unidad N — Título".
Adapta las 4 fases ERCA y, si el grado es 2 o 3, incluye destrezaAdaptada y criterioAdaptado para esa unidad.
──────────────────────────────────────────────────────────────────
` : ""}
INSTRUCCIONES IMPORTANTES:
- NO uses lenguaje médico ni diagnósticos clínicos. Usa lenguaje pedagógico y educativo.
- Las fortalezas, desafíos y apoyos deben describirse en términos de aprendizaje y participación.
- Las estrategias deben ser concretas, aplicables en el aula ecuatoriana con recursos accesibles.
- Si el grado es 1: dentro de cada entrada de adaptacionesPorDia, destrezaAdaptada y criterioAdaptado deben ser null.
- Si el grado es 2: incluir destrezaAdaptada y criterioAdaptado por unidad/día.
- Si el grado es 3: incluir todos los campos. IMPORTANTE: Solo asignar Grado 3 si hay desfase curricular significativo sustentado en evaluación psicopedagográfica. TDAH sin comorbilidad cognitiva generalmente se resuelve con Grado 1 y 2.
- Generar entradas en adaptacionesPorDia: ${semanaContext?.dias?.length ? `una por cada día seleccionado` : pctContext?.unidades?.length ? `una por cada unidad del PCT` : "una entrada para la clase"}.
- Cada entrada de adaptacionesPorDia debe tener adaptacionERCA con las 4 fases, integrando de forma natural (sin etiquetas) las condiciones de acceso, ajustes metodológicos y recursos.
- ${grado >= 2 ? "Incluir destrezaAdaptada y criterioAdaptado por unidad/día." : "No incluir destrezaAdaptada ni criterioAdaptado."}
- evaluacionAdaptada: criterio de evaluación adaptado para esa unidad/día.
- indicadoresAdaptados: array de indicadores adaptados.
- seguimiento: párrafo de 2–3 oraciones sobre cómo hacer seguimiento de la adaptación.
- observaciones: 1–2 oraciones finales.
- rubrica: Genera exactamente 3 criterios de rúbrica de evaluación con 4 niveles de desempeño adaptados al perfil NEE del estudiante. Los niveles son: excelente (Siempre Alcanza — nivel 4), satisfactorio (Alcanza — nivel 3), enProceso (Próximo a Alcanzar — nivel 2), necesitaApoyo (No Alcanza — nivel 1). Usa lenguaje pedagógico concreto y accesible.

Responde ÚNICAMENTE con JSON válido siguiendo EXACTAMENTE este esquema:
{
  "perfilNEE": {
    "tipo": "string (nombre educativo del tipo de NEE)",
    "descripcion": "string (descripción pedagógica del perfil, máx 3 oraciones, sin lenguaje médico)",
    "fortalezas": ["string", "string", "string"],
    "desafios": ["string", "string", "string"],
    "apoyos": ["string", "string"]
  },
  "destrezaOriginal": {
    "codigo": "${input.codigoDestreza}",
    "descripcion": "${input.descripcionDestreza}"
  },
  "seguimiento": "string (2–3 oraciones sobre seguimiento de la adaptación)",
  "observaciones": "string (1–2 oraciones finales)",
  "rubrica": [
    {
      "criterio": "string (nombre del criterio de evaluación)",
      "excelente": "string (descripción nivel 4 — Siempre Alcanza)",
      "satisfactorio": "string (descripción nivel 3 — Alcanza)",
      "enProceso": "string (descripción nivel 2 — Próximo a Alcanzar)",
      "necesitaApoyo": "string (descripción nivel 1 — No Alcanza)"
    },
    { "criterio": "string", "excelente": "string", "satisfactorio": "string", "enProceso": "string", "necesitaApoyo": "string" },
    { "criterio": "string", "excelente": "string", "satisfactorio": "string", "enProceso": "string", "necesitaApoyo": "string" }
  ],
  "notaDIAC": "string (1 oración: 'Los datos completos del estudiante constan en el DIAC oficial de la institución, elaborado con apoyo de la UDAI/DECE.')",
  "adaptacionesPorDia": [
    ${semanaContext?.dias?.length ? semanaContext.dias.map((d: any) => `{
      "dia": "${d.dia}",
      "objetivo": "${d.objetivo ?? "(objetivo del día)"}",
      "objetivoAdaptado": "string (reformulación alcanzable y medible)",
      "adaptacionERCA": {
        "experiencia": "string (adaptar Experiencia del ${d.dia} — integrar condiciones de acceso y recursos de forma natural)",
        "reflexion": "string (adaptar Reflexión del ${d.dia})",
        "conceptualizacion": "string (adaptar Conceptualización del ${d.dia})",
        "aplicacion": "string (adaptar Aplicación del ${d.dia})"
      },
      "evaluacionAdaptada": "string (criterio de evaluación adaptado para ${d.dia})",
      "indicadoresAdaptados": ["string (indicador adaptado 1)", "string", "string"]${grado >= 2 ? `,
      "destrezaAdaptada": "string (destreza adaptada para ${d.dia})",
      "criterioAdaptado": "string (criterio adaptado para ${d.dia})` : ""}
    }`).join(",\n    ") : pctContext?.unidades?.length ? pctContext.unidades.map((u: any) => `{
      "dia": "Unidad ${u.numero} — ${u.titulo}",
      "objetivo": "${u.objetivosEspecificos}",
      "objetivoAdaptado": "string (reformulación alcanzable y medible)",
      "adaptacionERCA": {
        "experiencia": "string (adaptar Experiencia de la unidad ${u.numero} — integrar condiciones de acceso y recursos de forma natural)",
        "reflexion": "string (adaptar Reflexión de la unidad ${u.numero})",
        "conceptualizacion": "string (adaptar Conceptualización de la unidad ${u.numero})",
        "aplicacion": "string (adaptar Aplicación de la unidad ${u.numero})"
      },
      "evaluacionAdaptada": "string (criterio de evaluación adaptado para la unidad ${u.numero})",
      "indicadoresAdaptados": ["string (indicador adaptado 1)", "string", "string"]${grado >= 2 ? `,
      "destrezaAdaptada": "string (destreza adaptada para la unidad ${u.numero})",
      "criterioAdaptado": "string (criterio adaptado para la unidad ${u.numero})` : ""}
    }`).join(",\n    ") : `{
      "dia": "Clase",
      "objetivo": "${planContext?.objetivo ?? "(objetivo de la clase)"}",
      "objetivoAdaptado": "string (reformulación alcanzable y medible)",
      "adaptacionERCA": {
        "experiencia": "string (adaptar Experiencia — integrar condiciones de acceso y recursos de forma natural)",
        "reflexion": "string (adaptar Reflexión)",
        "conceptualizacion": "string (adaptar Conceptualización)",
        "aplicacion": "string (adaptar Aplicación)"
      },
      "evaluacionAdaptada": "string (criterio de evaluación adaptado para la clase)",
      "indicadoresAdaptados": ["string (indicador adaptado 1)", "string", "string"]${grado >= 2 ? `,
      "destrezaAdaptada": "string (destreza adaptada para la clase)",
      "criterioAdaptado": "string (criterio adaptado para la clase)` : ""}
    }`}
  ]
}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const adaptacionesRouter = router({

  /** Genera la adaptación curricular con IA y la guarda en BD */
  generate: publicProcedure
    .input(z.object({
      form: FormSchema,
      sessionId: z.string().min(1),
      existingId: z.number().optional(),
      /** Contexto de la planificación semanal vinculada (actividades ERCA reales por día) */
      semanaContext: SemanaContextSchema.optional(),
      /** Contexto de la planificación diaria vinculada (actividades ERCA reales de la clase) */
      planContext: PlanContextSchema.optional(),
      /** Contexto del PCT/PCA — unidades de la sección 5 */
      pctContext: PctContextSchema.optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = buildPrompt(input.form, input.semanaContext, input.planContext, input.pctContext);

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en educación inclusiva ecuatoriana. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 8000,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let aiResult: AdaptacionAiResult;
      try {
        aiResult = JSON.parse(rawContent);
      } catch {
        try {
          aiResult = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvio una respuesta incompleta. Intenta de nuevo.");
        }
      }

      // Intentar guardar en BD (no crítico si falla)
      try {
        const db = await getDb();
        if (db) {
          const row = {
            sessionId: input.sessionId,
            codigoEstudiante: input.form.codigoEstudiante || null,
            institucion: input.form.institucion || null,
            docente: input.form.docente || null,
            anioLectivo: input.form.anioLectivo || null,
            area: input.form.area,
            subnivel: input.form.subnivel,
            grado: input.form.grado,
            paralelo: input.form.paralelo || null,
            periodoPedagogico: input.form.periodoPedagogico || null,
            trimestre: input.form.trimestre || null,
            codigoDestreza: input.form.codigoDestreza || null,
            descripcionDestreza: input.form.descripcionDestreza || null,
            gradoAdaptacion: String(input.form.gradoAdaptacion) as "1" | "2" | "3",
            tipoNEE: input.form.tipoNEE,
            estiloAprendizaje: input.form.estiloAprendizaje || null,
            fortalezas: input.form.fortalezas || null,
            desafios: input.form.desafios || null,
            apoyosDisponibles: input.form.apoyosDisponibles || null,
            aiResult: JSON.stringify(aiResult),
            status: "generated" as const,
          };

          if (input.existingId) {
            await db.update(curricularAdaptations)
              .set(row)
              .where(eq(curricularAdaptations.id, input.existingId));
            return { id: input.existingId, aiResult };
          } else {
            const res = await db.insert(curricularAdaptations).values(row);
            return { id: (res as any).insertId as number, aiResult };
          }
        }
      } catch (err) {
        console.warn("[adaptaciones] DB save failed (non-critical):", err);
      }

      return { id: null, aiResult };
    }),

  /** Regenera una sección específica del resultado */
  regenerateSection: publicProcedure
    .input(z.object({
      form: FormSchema,
      sessionId: z.string(),
      seccion: z.enum([
        "perfilNEE",
        "destrezaAdaptada",
        "adaptacionesAcceso",
        "adaptacionesProceso",
        "adaptacionesResultado",
        "metodologias",
        "seguimiento",
      ]),
      currentResult: z.string(),
    }))
    .mutation(async ({ input }) => {
      const sectionPrompts: Record<string, string> = {
        perfilNEE: "Regenera únicamente el bloque 'perfilNEE' con descripciones más específicas y pedagógicas.",
        destrezaAdaptada: "Regenera 'destrezaAdaptada', 'criterioAdaptado' e 'indicadoresAdaptados' con mayor precisión al nivel del estudiante.",
        adaptacionesAcceso: "Regenera el bloque 'adaptacionesAcceso' con 3 estrategias de acceso más concretas y aplicables.",
        adaptacionesProceso: "Regenera el bloque 'adaptacionesProceso' con 3 estrategias de proceso más específicas.",
        adaptacionesResultado: "Regenera el bloque 'adaptacionesResultado' con 3 estrategias de evaluación más flexibles.",
        metodologias: "Regenera 'metodologiasSugeridas' y 'recursosEspecificos' con alternativas más innovadoras.",
        seguimiento: "Regenera 'seguimiento' y 'observaciones' con orientaciones más precisas.",
      };

      const prompt = `${buildPrompt(input.form)}

RESULTADO ACTUAL (regenera solo la sección indicada):
${input.currentResult}

INSTRUCCIÓN: ${sectionPrompts[input.seccion]}
Devuelve el JSON COMPLETO actualizado, solo con esa sección modificada.`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en educación inclusiva ecuatoriana. Responde con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 2048,
        responseFormat: { type: "json_object" },
      });

      const rawContent2 = raw.choices?.[0]?.message?.content;
      if (!rawContent2 || typeof rawContent2 !== "string") {
        throw new Error("Sin respuesta de la IA.");
      }
      try {
        return { aiResult: JSON.parse(rawContent2) as AdaptacionAiResult };
      } catch {
        return { aiResult: JSON.parse(repairJson(rawContent2)) as AdaptacionAiResult };
      }
    }),

  /** Lista las adaptaciones guardadas de una sesión */
  list: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        return db
          .select({
            id: curricularAdaptations.id,
            codigoEstudiante: curricularAdaptations.codigoEstudiante,
            area: curricularAdaptations.area,
            grado: curricularAdaptations.grado,
            tipoNEE: curricularAdaptations.tipoNEE,
            gradoAdaptacion: curricularAdaptations.gradoAdaptacion,
            status: curricularAdaptations.status,
            createdAt: curricularAdaptations.createdAt,
          })
          .from(curricularAdaptations)
          .where(eq(curricularAdaptations.sessionId, input.sessionId))
          .orderBy(desc(curricularAdaptations.createdAt))
          .limit(50);
      } catch {
        return [];
      }
    }),
});
