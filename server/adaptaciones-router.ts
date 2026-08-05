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
): string {
  const grado = input.gradoAdaptacion as GradoAdaptacion;
  const neeInfo = NEE_STRATEGIES[input.tipoNEE as keyof typeof NEE_STRATEGIES];
  const areaNombre = AREA_NAMES[input.area] ?? input.area;
  const subnivel = SUBNIVEL_NAMES[input.subnivel] ?? `Subnivel ${input.subnivel}`;

  const incluirProceso = grado >= 2;
  const incluirResultado = grado >= 3;

  const gradoDesc = {
    1: "GRADO 1 — NO SIGNIFICATIVA: solo adaptaciones de acceso (metodología, recursos, organización del aula). La destreza, el criterio y los indicadores NO se modifican.",
    2: "GRADO 2 — MODERADA: adaptaciones de acceso + proceso. La destreza se simplifica levemente manteniendo el objetivo esencial. Incluye versión levemente adaptada de la destreza, criterio y 3 indicadores simplificados.",
    3: "GRADO 3 — SIGNIFICATIVA: adaptaciones de acceso + proceso + resultado. La destreza se modifica sustancialmente. Incluye destreza adaptada, criterio de evaluación adaptado y 3–5 indicadores de logro adaptados.",
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
PLANIFICACIÓN SEMANAL CONTEXTUAL (REFERENCIA OBLIGATORIA):
La adaptación debe referirse ESPECÍFICAMENTE a las actividades ya planificadas esta semana.
NO generes sugerencias genéricas — todo debe derivarse de lo que realmente se trabajará en el aula.

${semanaContext.dias.map((d) => {
  const act = d.actividades;
  const experiencia = act.experiencia.slice(0, 2).join(" | ") || "(sin actividades)";
  const reflexion = act.reflexion.slice(0, 2).join(" | ") || "(sin actividades)";
  const conceptualizacion = act.conceptualizacion.slice(0, 2).join(" | ") || "(sin actividades)";
  const aplicacion = act.aplicacion.slice(0, 2).join(" | ") || "(sin actividades)";
  const recursos = d.recursos.slice(0, 4).join(", ") || "(sin recursos específicos)";
  return `${d.dia.toUpperCase()} — Tema: "${d.tema}"
  Experiencia (activación concreta): ${experiencia}
  Reflexión (análisis/discusión): ${reflexion}
  Conceptualización (construcción conceptual): ${conceptualizacion}
  Aplicación (transferencia/creación): ${aplicacion}
  Recursos utilizados: ${recursos}`;
}).join("\n\n")}

GENERA "adaptacionesPorDia" con exactamente ${semanaContext.dias.length} entradas (una por cada día listado arriba).
Cada adaptación DEBE mencionar las actividades y recursos concretos del día correspondiente.
──────────────────────────────────────────────────────────────────
` : ""}
INSTRUCCIONES IMPORTANTES:
- NO uses lenguaje médico ni diagnósticos clínicos. Usa lenguaje pedagógico y educativo.
- Las fortalezas, desafíos y apoyos deben describirse en términos de aprendizaje y participación.
- Las estrategias deben ser concretas, aplicables en el aula ecuatoriana con recursos accesibles.
- Si el grado es 1: los campos destrezaAdaptada, criterioAdaptado, indicadoresAdaptados, adaptacionesProceso y adaptacionesResultado deben ser null o arrays vacíos.
- Si el grado es 2: incluir destrezaAdaptada, criterioAdaptado, indicadoresAdaptados y adaptacionesProceso (NO adaptacionesResultado).
- Si el grado es 3: incluir todos los campos.
- Generar exactamente 3 adaptaciones de acceso, ${incluirProceso ? "3 de proceso" : ""}${incluirResultado ? " y 3 de resultado" : ""}.
- Cada adaptación tiene: categoria (string), descripcion (1 oración), estrategias (array de 2–3 strings concretos y específicos).
- metodologiasSugeridas: 4 metodologías activas aplicables a la destreza y al tipo de NEE.
- recursosEspecificos: 5 materiales CONCRETOS Y ESPECÍFICOS (ej: bloques lógicos, regletas Cuisenaire, pictogramas, tarjetas visuales, organizadores gráficos, fichas de trabajo adaptadas, material reciclado, aplicaciones digitales específicas, tabletas, etc.) apropiados para la destreza y el tipo de NEE.
- seguimiento: párrafo de 2–3 oraciones sobre cómo hacer seguimiento de la adaptación.
- observaciones: 1–2 oraciones finales.
- adaptacionesERCA: Para cada fase del modelo ERCA, escribe 2 sugerencias concretas de cómo adaptar la actividad para el estudiante con NEE, considerando su estilo de aprendizaje y la destreza trabajada. Las sugerencias deben ser directamente aplicables en el aula.
- evaluacionAdaptada: Genera 3 criterios de evaluación pedagógica adaptados al nivel del estudiante y 3 instrumentos de evaluación concretos y accesibles (ej: lista de cotejo, rúbrica simplificada, portafolio, observación directa con registro, prueba oral, etc.).
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
  ${grado >= 2 ? `"destrezaAdaptada": "string",
  "criterioAdaptado": "string",
  "indicadoresAdaptados": ["string", "string", "string"],` : `"destrezaAdaptada": null,
  "criterioAdaptado": null,
  "indicadoresAdaptados": [],`}
  "adaptacionesAcceso": [
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] }
  ],
  ${incluirProceso ? `"adaptacionesProceso": [
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] }
  ],` : `"adaptacionesProceso": [],`}
  ${incluirResultado ? `"adaptacionesResultado": [
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] },
    { "categoria": "string", "descripcion": "string", "estrategias": ["string", "string"] }
  ],` : `"adaptacionesResultado": [],`}
  "metodologiasSugeridas": ["string", "string", "string", "string"],
  "recursosEspecificos": ["string", "string", "string", "string", "string"],
  "seguimiento": "string",
  "observaciones": "string",
  "adaptacionesERCA": {
    "experiencia": ["string (sugerencia concreta para Experiencia/activación)", "string"],
    "reflexion": ["string (sugerencia concreta para Reflexión/análisis)", "string"],
    "conceptualizacion": ["string (sugerencia concreta para Conceptualización)", "string"],
    "aplicacion": ["string (sugerencia concreta para Aplicación/transferencia)", "string"]
  },
  "evaluacionAdaptada": {
    "criterios": ["string (criterio de evaluación adaptado 1)", "string", "string"],
    "instrumentos": ["string (instrumento concreto 1)", "string", "string"]
  },
  "rubrica": [
    {
      "criterio": "string (nombre del criterio de evaluación)",
      "excelente": "string (descripción nivel 4 — Siempre Alcanza)",
      "satisfactorio": "string (descripción nivel 3 — Alcanza)",
      "enProceso": "string (descripción nivel 2 — Próximo a Alcanzar)",
      "necesitaApoyo": "string (descripción nivel 1 — No Alcanza)"
    },
    {
      "criterio": "string",
      "excelente": "string",
      "satisfactorio": "string",
      "enProceso": "string",
      "necesitaApoyo": "string"
    },
    {
      "criterio": "string",
      "excelente": "string",
      "satisfactorio": "string",
      "enProceso": "string",
      "necesitaApoyo": "string"
    }
  ]${semanaContext?.dias?.length ? `,
  "adaptacionesPorDia": [
    ${semanaContext.dias.map((d) => `{
      "dia": "${d.dia}",
      "adaptacionAcceso": "string (cómo adaptar el acceso a las actividades del ${d.dia}: materiales, espacio, tiempo, apoyos — referencia las actividades concretas de ese día)",
      "adaptacionMetodologica": "string (estrategia pedagógica específica para las actividades del ${d.dia} considerando el perfil NEE — menciona las fases ERCA del día)",
      "recursosAdaptados": ["string (recurso adaptado específico 1 para el ${d.dia})", "string (recurso adaptado específico 2)"],
      "evaluacionAdaptada": "string (cómo evaluar el logro del ${d.dia} según la actividad de aplicación planificada)"
    }`).join(",\n    ")}
  ]` : ""}
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
    }))
    .mutation(async ({ input }) => {
      const prompt = buildPrompt(input.form, input.semanaContext);

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
