import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import { getDb } from "./db";
import { connectaNivelaCrea } from "../drizzle/schema";
import { obtenerFiguraPorId } from "../data/bachillerato-tecnico";
import { obtenerUnidadesCompetenciaDeModulo } from "../data/bachillerato-tecnico-uc";
import type { ConectaNivelaCreaAiResult } from "../data/types-cnc";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const DiagnosticoAcademicoSchema = z.object({
  destrezaCodigo: z.string(),
  destrezaDescripcion: z.string(),
  area: z.enum(["LL", "M"]),
  observaciones: z.string(),
  nivelDetectado: z.enum(["logrado", "en_proceso", "iniciado"]),
});

const DiagnosticoSocioemocionalSchema = z.object({
  habilidadId: z.string(),
  observaciones: z.string(),
});

const Semana1Schema = z.object({
  actividadesAdaptacion: z.array(z.string()),
  diagnosticoAcademico: z.array(DiagnosticoAcademicoSchema),
  diagnosticoSocioemocional: z.array(DiagnosticoSocioemocionalSchema),
  coordinacionDece: z.string(),
  tecnicasReflexion: z.array(z.string()),
});

const Semana1BTSchema = z.object({
  reconocimientoEspacios: z.array(z.string()),
  diagnosticoTecnico: z.array(z.object({
    criterioId: z.string(),
    criterioTexto: z.string(),
    observaciones: z.string(),
    nivelDetectado: z.enum(["logrado", "en_proceso", "iniciado"]),
  })),
});

const ParejaConivelacionSchema = z.object({
  id: z.string(),
  estudianteApoyoNombre: z.string(),
  estudianteApoyadoNombre: z.string(),
  destrezaFocoCodigo: z.string(),
  destrezaFocoDescripcion: z.string(),
  notas: z.string().optional(),
});

const ActividadNivelacionSchema = z.object({
  destrezaCodigo: z.string(),
  destrezaDescripcion: z.string(),
  area: z.enum(["LL", "M"]),
  descripcionActividad: z.string(),
  semana: z.union([z.literal(2), z.literal(3)]),
});

const Semana2y3Schema = z.object({
  actividadesNivelacion: z.array(ActividadNivelacionSchema),
  parejasConivelacion: z.array(ParejaConivelacionSchema),
});

const Semana2y3BTSchema = z.object({
  actividadesNivelacionTecnica: z.array(z.object({
    criterioId: z.string(),
    criterioTexto: z.string(),
    descripcionActividad: z.string(),
    semana: z.union([z.literal(2), z.literal(3)]),
    articulacionMatematica: z.string().optional(),
  })),
});

const Semana4y5Schema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  areasIntegradas: z.array(z.string()),
  notasDocente: z.string().optional(),
  productoFinal: z.string().optional(),
  actividadesSemana4: z.array(z.string()).optional(),
  actividadesSemana5: z.array(z.string()).optional(),
});

const Semana4y5BTSchema = z.object({
  tipoProducto: z.enum([
    "maqueta", "software_basico", "plan_negocio", "mantenimiento_equipo",
    "servicio_programa", "evento_presentacion", "material_protocolo", "otro",
  ]),
  descripcion: z.string(),
  actividadesSemana4: z.array(z.string()).optional(),
  actividadesSemana5: z.array(z.string()).optional(),
});

const FormSchema = z.object({
  institucion: z.string(),
  docente: z.string(),
  anioLectivo: z.string(),
  grado: z.string(),
  paralelo: z.string(),
  subnivel: z.string(),
  modalidad: z.enum(["general", "bt"]),
  figuraProfesionalId: z.string().optional(),
  moduloId: z.string().optional(),
  semana1: Semana1Schema,
  semana1BT: Semana1BTSchema.optional(),
  semana2y3: Semana2y3Schema,
  semana2y3BT: Semana2y3BTSchema.optional(),
  semana4y5: Semana4y5Schema,
  semana4y5BT: Semana4y5BTSchema.optional(),
});

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: z.infer<typeof FormSchema>): string {
  const esBT = input.modalidad === "bt";

  let contextoBT = "";
  if (esBT && input.figuraProfesionalId && input.moduloId) {
    const figura = obtenerFiguraPorId(input.figuraProfesionalId);
    const modulo = figura?.modulos.find((m) => m.codigo === input.moduloId);
    const ucs = obtenerUnidadesCompetenciaDeModulo(input.moduloId);
    const criteriosReales: string[] = [];
    modulo?.resultadosAprendizaje?.forEach((ra) => {
      criteriosReales.push(ra.texto);
      ra.criteriosEvaluacion.forEach((ce) => criteriosReales.push(`  ${ce.texto}`));
    });
    ucs.forEach((uc) => {
      criteriosReales.push(uc.texto);
      uc.elementosCompetencia?.forEach((ec) => {
        criteriosReales.push(`  ${ec.texto}`);
        ec.criteriosDesempeno.forEach((cd) => criteriosReales.push(`    ${cd.texto}`));
      });
    });

    contextoBT = `
──────────────────────────────────────────────────────────────────
MODALIDAD BACHILLERATO TÉCNICO — Figura Profesional: "${figura?.nombre ?? input.figuraProfesionalId}"
Módulo: "${modulo?.nombre ?? input.moduloId}" — ${modulo?.descripcion ?? ""}

CRITERIOS TÉCNICOS REALES DEL MÓDULO (usa ÚNICAMENTE estos, no inventes otros):
${criteriosReales.length ? criteriosReales.join("\n") : "(sin catálogo técnico transcrito para este módulo — no fabriques criterios; limita el diagnóstico técnico a lo que el docente haya escrito manualmente)"}

REGLAS BT:
- Semana 1: además de la adaptación general, incluye reconocimiento de espacios técnicos (talleres/laboratorios/granjas) y diagnóstico de prerrequisitos técnicos reales tomados EXCLUSIVAMENTE de los criterios listados arriba.
- Semanas 2-3: la nivelación debe reforzar destrezas procedimentales/técnicas del módulo (no solo teoría), articulando cada actividad técnica con el refuerzo de Matemática cuando sea pertinente.
- Semanas 4-5: en vez de un proyecto interdisciplinario genérico, sugiere un "productoAcreditableSugerido" técnico-práctico coherente con la Figura Profesional — nunca un ensayo o cartel genérico. Si la figura es industrial/técnica (construcción, mecánica, electrónica, agropecuaria, TI, etc.), usa maqueta / software básico / plan de negocio inicial / mantenimiento de equipo. Si la figura es de servicio, cuidado o cultura (p. ej. Atención a la Primera Infancia, Asistencia y Cuidado a Grupos Prioritarios, Seguridad Ciudadana, Gestión Cultural, Hostelería, Gestión Turística, Actividad Física y Deporte), usa servicio_programa, evento_presentacion o material_protocolo — nunca fuerces una maqueta o un mantenimiento de equipo donde no corresponde.
──────────────────────────────────────────────────────────────────
`;
  }

  const destrezasAcademicas = input.semana1.diagnosticoAcademico
    .map((d) => `- [${d.area}] ${d.destrezaCodigo}: "${d.destrezaDescripcion}" (nivel detectado: ${d.nivelDetectado}) — obs: ${d.observaciones || "(sin observaciones)"}`)
    .join("\n") || "(sin destrezas diagnosticadas aún)";

  const habilidadesSocioemocionales = input.semana1.diagnosticoSocioemocional
    .map((h) => `- ${h.habilidadId}: ${h.observaciones || "(sin observaciones)"}`)
    .join("\n") || "(sin habilidades socioemocionales seleccionadas)";

  const destrezasNivelacion = input.semana2y3.actividadesNivelacion
    .map((a) => `- [${a.area}] ${a.destrezaCodigo}: "${a.destrezaDescripcion}" (semana ${a.semana})`)
    .join("\n") || "(sin destrezas de nivelación seleccionadas aún)";

  const parejas = input.semana2y3.parejasConivelacion
    .map((p) => `- ${p.estudianteApoyoNombre} apoya a ${p.estudianteApoyadoNombre} en "${p.destrezaFocoDescripcion}" (${p.destrezaFocoCodigo})`)
    .join("\n") || "(sin parejas de conivelación registradas aún)";

  return `Eres un experto en el programa "Conecta, Nivela y Crea" del Ministerio de Educación del Ecuador (Lineamientos Pedagógicos, arranque del año escolar — 5 semanas en 3 fases), aplicable a todos los niveles y ofertas del sistema educativo nacional, incluido Bachillerato Técnico.

CONTEXTO DEL DOCUMENTO:
- Institución: ${input.institucion || "(sin especificar)"}
- Docente: ${input.docente || "(sin especificar)"}
- Grado/Curso: ${input.grado} paralelo ${input.paralelo || ""}
- Subnivel: ${input.subnivel}
- Año lectivo: ${input.anioLectivo || ""}
- Modalidad: ${esBT ? "Bachillerato Técnico" : "General (EGB/BGU)"}
${contextoBT}
SEMANA 1 — CONECTA (adaptación + diagnóstico dual académico y socioemocional, coordinado con DECE):
Actividades de adaptación ya definidas por el docente: ${input.semana1.actividadesAdaptacion.join(" | ") || "(ninguna aún)"}
Nota de coordinación DECE: ${input.semana1.coordinacionDece || "(sin nota)"}
Técnicas de reflexión: ${input.semana1.tecnicasReflexion.join(" | ") || "(ninguna aún)"}

Diagnóstico académico (destrezas reales de Lengua/Matemática seleccionadas por el docente — NO inventes códigos ni destrezas nuevas):
${destrezasAcademicas}

Diagnóstico socioemocional (habilidades reales del catálogo MinEduc seleccionadas por el docente):
${habilidadesSocioemocionales}

SEMANAS 2-3 — NIVELA (refuerzo focalizado, secuencia diagnóstico → nivelación → solo después avance curricular):
Destrezas de nivelación seleccionadas (usa ÚNICAMENTE estas, no inventes otras):
${destrezasNivelacion}

Parejas de "conivelación" (tutoría entre pares — estudiante más consolidado apoya a un compañero):
${parejas}

SEMANAS 4-5 — CREA (proyecto interdisciplinario que constituye FORMALMENTE una evaluación cualitativa y formativa oficial, no una actividad de cierre opcional):
Título propuesto por el docente: ${input.semana4y5.titulo || "(el docente no propuso título — sugiere uno)"}
Descripción/notas del docente: ${input.semana4y5.descripcion || "(sin notas)"}
Áreas a integrar sugeridas por el docente: ${input.semana4y5.areasIntegradas.join(", ") || "(ninguna — sugiere áreas coherentes con el diagnóstico)"}
Producto final propuesto por el docente: ${input.semana4y5.productoFinal || "(vacío — sugiere un producto final concreto)"}
Actividades de la Semana 4 propuestas por el docente: ${input.semana4y5.actividadesSemana4?.filter(Boolean).length ? input.semana4y5.actividadesSemana4!.join("; ") : "(vacío — sugiere 3-5 actividades de planificación/organización/elaboración)"}
Actividades de la Semana 5 propuestas por el docente: ${input.semana4y5.actividadesSemana5?.filter(Boolean).length ? input.semana4y5.actividadesSemana5!.join("; ") : "(vacío — sugiere 3-5 actividades de finalización/socialización/reflexión)"}

INSTRUCCIONES IMPORTANTES:
- NO inventes destrezas, códigos curriculares ni criterios técnicos que no estén listados arriba — usa únicamente los proporcionados por el docente${esBT ? " o el catálogo técnico del módulo" : ""}.
- El proyecto/producto de Semanas 4-5 debe derivarse coherentemente del diagnóstico de Semana 1 y reforzar exactamente las destrezas allí listadas.
- "productoFinal" del proyecto y "actividadesSemana4"/"actividadesSemana5": derívalos de las DCD diagnosticadas en Semana 1, las destrezas a reforzar, las áreas integradas y el contexto. Si el docente ya escribió un campo (productoFinal, actividadesSemana4 o actividadesSemana5), devuélvelo EXACTAMENTE como está; solo sugiere contenido cuando el campo está vacío.
- Para cada actividad de nivelación sugerida, incluye "estrategiaConivelacion": una sugerencia concreta de cómo aprovechar tutoría entre pares para esa destreza específica.
- El campo "esEvaluacionFormativaOficial" del proyecto SIEMPRE debe ser true — es un requisito formal del MinEduc, no una opción.
- "cronogramaSemanal": un resumen narrativo de 4-6 oraciones que recorra las 5 semanas, mencionando explícitamente que el proyecto de Semanas 4-5 constituye una evaluación cualitativa formativa oficial.
- "recursosSemana1Sugeridos": 3-5 recursos didácticos concretos (materiales, textos, fichas, recursos digitales) apropiados para las actividades de adaptación y el diagnóstico de la Semana 1.
- "actividadesEvaluativasNivelacionSugeridas": 2-3 actividades evaluativas concretas (técnica + instrumento, ej. "Observación directa con lista de cotejo") para dar seguimiento al progreso durante las Semanas 2-3.
- Lenguaje pedagógico, concreto y aplicable en el aula ecuatoriana.

Responde ÚNICAMENTE con JSON válido siguiendo EXACTAMENTE este esquema:
{
  "actividadesAdaptacionSugeridas": ["string", "string", "string"],
  "tecnicaDiagnosticoSugerida": ["string", "string"],
  "actividadesNivelacionSugeridas": [
    { "destrezaCodigo": "string", "destrezaDescripcion": "string", "area": "LL o M", "descripcionActividad": "string", "semana": 2, "estrategiaConivelacion": "string" }
  ],
  "proyectoSugerido": {
    "titulo": "string",
    "descripcion": "string (3-4 oraciones)",
    "areasIntegradas": ["string", "string"],
    "productoFinal": "string (1 oración concreta del producto final del proyecto)",
    "actividadesSemana4": ["string (3-5 actividades: planificación, organización de equipos, investigación, elaboración, revisión)"],
    "actividadesSemana5": ["string (3-5 actividades: finalización, socialización, presentación, reflexión)"],
    "destrezasReforzadas": ["string (códigos del diagnóstico)"],
    "evidenciasCognitivas": ["string", "string", "string"],
    "evidenciasActitudinales": ["string", "string", "string"],
    "esEvaluacionFormativaOficial": true
  },
  "cronogramaSemanal": "string",
  "recursosSemana1Sugeridos": ["string", "string", "string"],
  "actividadesEvaluativasNivelacionSugeridas": ["string", "string"]${esBT ? `,
  "diagnosticoTecnicoSugerido": [
    { "criterioId": "string (id real del catálogo)", "criterioTexto": "string (texto real del catálogo)", "observaciones": "string", "nivelDetectado": "iniciado" }
  ],
  "actividadesNivelacionTecnicaSugeridas": [
    { "criterioId": "string", "criterioTexto": "string", "descripcionActividad": "string", "semana": 2, "articulacionMatematica": "string" }
  ],
  "productoAcreditableSugerido": { "tipo": "maqueta|software_basico|plan_negocio|mantenimiento_equipo|servicio_programa|evento_presentacion|material_protocolo|otro (elige el que corresponda a la Figura Profesional, ver REGLAS BT)", "descripcion": "string", "actividadesSemana4": ["string (3-5 actividades de elaboración del producto)"], "actividadesSemana5": ["string (3-5 actividades de presentación/evaluación del producto)"] }` : ""}
}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const cncRouter = router({

  /** Genera el plan "Conecta, Nivela y Crea" con IA y lo guarda en BD (best-effort) */
  generate: publicProcedure
    .input(z.object({
      form: FormSchema,
      sessionId: z.string().min(1),
      existingId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = buildPrompt(input.form);

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 8000,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let aiResult: ConectaNivelaCreaAiResult;
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
            institucion: input.form.institucion || null,
            docente: input.form.docente || null,
            anioLectivo: input.form.anioLectivo || null,
            grado: input.form.grado || null,
            paralelo: input.form.paralelo || null,
            subnivel: input.form.subnivel || null,
            modalidad: input.form.modalidad,
            figuraProfesionalId: input.form.figuraProfesionalId || null,
            moduloId: input.form.moduloId || null,
            form: JSON.stringify(input.form),
            aiResult: JSON.stringify(aiResult),
            status: "generated" as const,
          };

          if (input.existingId) {
            await db.update(connectaNivelaCrea)
              .set(row)
              .where(eq(connectaNivelaCrea.id, input.existingId));
            return { id: input.existingId, aiResult };
          } else {
            const res = await db.insert(connectaNivelaCrea).values(row);
            return { id: (res as any).insertId as number, aiResult };
          }
        }
      } catch (err) {
        console.warn("[cnc] DB save failed (non-critical):", err);
      }

      return { id: null, aiResult };
    }),

  /** Sugiere técnicas de reflexión directa y la nota de coordinación DECE a partir del diagnóstico ya ingresado */
  sugerirReflexionDece: publicProcedure
    .input(z.object({
      diagnosticoAcademico: z.array(DiagnosticoAcademicoSchema),
      diagnosticoSocioemocional: z.array(DiagnosticoSocioemocionalSchema),
    }))
    .mutation(async ({ input }) => {
      const academico = input.diagnosticoAcademico
        .map((d) => `- [${d.area}] ${d.destrezaCodigo}: "${d.destrezaDescripcion}" (${d.nivelDetectado})`)
        .join("\n") || "(sin diagnóstico académico aún)";
      const socioemocional = input.diagnosticoSocioemocional
        .map((h) => `- ${h.habilidadId}`)
        .join("\n") || "(sin habilidades socioemocionales seleccionadas aún)";

      const prompt = `Eres un experto en el programa "Conecta, Nivela y Crea" del MinEduc Ecuador (Semana 1 — diagnóstico dual académico y socioemocional, coordinado con el equipo DECE).

Diagnóstico académico registrado:
${academico}

Habilidades socioemocionales seleccionadas:
${socioemocional}

Genera:
- "tecnicasReflexion": 3-4 técnicas de reflexión directa concretas y aplicables en el aula (ej. preguntas abiertas para indagar saberes previos), coherentes con las destrezas y habilidades listadas arriba.
- "coordinacionDece": 1-2 oraciones de nota de coordinación con el equipo DECE, coherente con las habilidades socioemocionales seleccionadas (o un texto genérico de invitación a coordinar si no hay habilidades seleccionadas).

Responde ÚNICAMENTE con JSON: { "tecnicasReflexion": ["string", "string", "string"], "coordinacionDece": "string" }`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 1200,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }
      try {
        return JSON.parse(rawContent) as { tecnicasReflexion: string[]; coordinacionDece: string };
      } catch {
        return JSON.parse(repairJson(rawContent)) as { tecnicasReflexion: string[]; coordinacionDece: string };
      }
    }),

  /** Sugiere la lógica de emparejamiento de conivelación (qué destreza trabajar en cada pareja) — el docente completa los nombres reales */
  sugerirConivelacion: publicProcedure
    .input(z.object({
      actividadesNivelacion: z.array(ActividadNivelacionSchema),
    }))
    .mutation(async ({ input }) => {
      if (!input.actividadesNivelacion.length) {
        return { parejasSugeridas: [] as { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      }

      const destrezas = input.actividadesNivelacion
        .map((a) => `- [${a.area}] ${a.destrezaCodigo}: "${a.destrezaDescripcion}"`)
        .join("\n");

      const prompt = `Eres un experto en "conivelación" (tutoría entre pares) del programa "Conecta, Nivela y Crea" del MinEduc Ecuador.

Destrezas de nivelación seleccionadas por el docente (usa ÚNICAMENTE estas, no inventes otras):
${destrezas}

Para CADA destreza, sugiere una pareja de conivelación: no inventes nombres de estudiantes (el docente los completará), solo sugiere el enfoque de la tutoría entre pares para esa destreza específica.

Responde ÚNICAMENTE con JSON: { "parejasSugeridas": [ { "destrezaFocoCodigo": "string", "destrezaFocoDescripcion": "string", "sugerenciaEnfoque": "string (1 oración concreta de cómo el estudiante más consolidado puede apoyar al compañero en esta destreza)" } ] }`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 1500,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }
      try {
        return JSON.parse(rawContent) as { parejasSugeridas: { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      } catch {
        return JSON.parse(repairJson(rawContent)) as { parejasSugeridas: { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      }
    }),

  /** Lista los planes guardados de una sesión */
  list: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        return db
          .select({
            id: connectaNivelaCrea.id,
            institucion: connectaNivelaCrea.institucion,
            grado: connectaNivelaCrea.grado,
            modalidad: connectaNivelaCrea.modalidad,
            status: connectaNivelaCrea.status,
            createdAt: connectaNivelaCrea.createdAt,
          })
          .from(connectaNivelaCrea)
          .where(eq(connectaNivelaCrea.sessionId, input.sessionId))
          .orderBy(desc(connectaNivelaCrea.createdAt))
          .limit(50);
      } catch {
        return [];
      }
    }),
});
