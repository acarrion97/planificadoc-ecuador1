import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";

/**
 * Router tRPC para generación IA de la Unidad de Trabajo de Bachillerato Técnico (BT).
 *
 * BT usa un currículo por competencias laborales (Acuerdo MINEDUC-2024-00065-A),
 * SIN ERCA, DUA ni Marzano — es un modo pedagógico completamente separado del
 * resto de routers (topics/pca/adaptaciones), que siguen siendo EGB/BGU.
 *
 * Regla de coherencia curricular: los Procedimientos, sus criterios y su
 * secuencia de fases DEBEN derivarse exclusivamente de los Criterios de
 * Evaluación/Desempeño oficiales recibidos como input — la IA nunca inventa
 * competencias fuera de la Unidad de Competencia / Resultado de Aprendizaje dado.
 */

const CriterioInput = z.object({ id: z.string(), texto: z.string() });

export const btRouter = router({
  generateUnidadTrabajo: publicProcedure
    .input(
      z.object({
        figuraNombre: z.string().min(1),
        moduloNombre: z.string().min(1),
        moduloObjetivo: z.string().min(5),
        nivel: z.string().optional(),
        unidadCompetenciaTexto: z.string().optional(),
        resultadoAprendizajeTexto: z.string().optional(),
        criteriosEvaluacion: z.array(CriterioInput).min(1),
        nombreUnidadTrabajo: z.string().min(1),
        tiempoEstimadoPeriodos: z.number().int().min(1),
        numProcedimientos: z.number().int().min(1).max(6).default(3),
      })
    )
    .mutation(async ({ input }) => {
      const {
        figuraNombre,
        moduloNombre,
        moduloObjetivo,
        nivel,
        unidadCompetenciaTexto,
        resultadoAprendizajeTexto,
        criteriosEvaluacion,
        nombreUnidadTrabajo,
        tiempoEstimadoPeriodos,
        numProcedimientos,
      } = input;

      const criteriosTexto = criteriosEvaluacion
        .map((c) => `- (${c.id}) ${c.texto}`)
        .join("\n");
      const idsPermitidos = criteriosEvaluacion.map((c) => c.id).join(", ");

      const prompt = `Eres un experto en el currículo de Bachillerato Técnico del Ecuador \
(Acuerdo Ministerial MINEDUC-2024-00065-A). Respondes ÚNICAMENTE con JSON válido.

DATOS DE LA UNIDAD DE TRABAJO
- Figura profesional : ${figuraNombre}
- Módulo formativo    : ${moduloNombre}
- Objetivo del módulo : ${moduloObjetivo}
- Nivel               : ${nivel || "no especificado"}
${unidadCompetenciaTexto ? `- Unidad de Competencia: ${unidadCompetenciaTexto}\n` : ""}\
${resultadoAprendizajeTexto ? `- Resultado de Aprendizaje: ${resultadoAprendizajeTexto}\n` : ""}\
- Nombre de la Unidad de Trabajo: ${nombreUnidadTrabajo}
- Tiempo estimado: ${tiempoEstimadoPeriodos} periodos pedagógicos
- Número de procedimientos a generar: ${numProcedimientos}

COHERENCIA CURRICULAR (obligatorio)
Los Procedimientos, sus criterios y su secuencia de fases DEBEN derivarse EXCLUSIVAMENTE \
de los siguientes Criterios de Evaluación/Desempeño oficiales. NUNCA inventes competencias, \
criterios ni contenidos fuera de esta lista:
${criteriosTexto}

INSTRUCCIONES
1. Genera ${numProcedimientos} Procedimientos (actividades formativas prácticas). Cada uno debe tener:
   - "nombre": título breve del procedimiento.
   - "objetivo": una oración clara, verbo en infinitivo, alcanzable en el tiempo asignado.
   - "tiempo": ej. "2 periodos".
   - "fases": 2 a 5 fases de la actividad, CADA UNA con "nombre" libre (ej. "Fase 1: Presentación del reto", \
"Fase 2: Desarrollo", "Fase 3: Cierre y evaluación" — NO uses la taxonomía ERCA, aquí las fases son libres \
inspiradas en metodologías activas como ABP) y "descripcion" de 2 a 4 oraciones.
   - "recursos": lista de materiales/recursos necesarios.
   - "evaluacion": { "tecnica": string, "instrumento": string } (ej. "Observación directa" / "Lista de cotejo").
   - "criterioEvaluacionIds": arreglo de ids tomados EXCLUSIVAMENTE de esta lista permitida: [${idsPermitidos}] \
— los que este procedimiento evalúa/desarrolla.
2. Genera "contenidos": { "conceptuales": string[], "procedimentales": string[], "actitudinales": string[] } \
para la Unidad de Trabajo completa, coherentes con los criterios dados.
3. Genera "estrategiasMetodologicas": 1 a 3 objetos { "nombre": string, "descripcion"?: string } \
(ej. "Aprendizaje Basado en Proyectos (ABP)").
4. No hay restricción bilingüe (BT no tiene modalidad en inglés). No uses ERCA, DUA ni Marzano.
5. Español correcto con tildes y ñ. Sin emojis.

Responde ÚNICAMENTE con este JSON:
{
  "procedimientos": [
    {
      "nombre": "string", "objetivo": "string", "tiempo": "string",
      "fases": [{ "nombre": "string", "descripcion": "string" }],
      "recursos": ["string"],
      "evaluacion": { "tecnica": "string", "instrumento": "string" },
      "criterioEvaluacionIds": ["string"]
    }
  ],
  "contenidos": { "conceptuales": ["string"], "procedimentales": ["string"], "actitudinales": ["string"] },
  "estrategiasMetodologicas": [{ "nombre": "string", "descripcion": "string" }]
}`;

      const result = await invokeLLM({
        messages: [{ role: "user", content: prompt }],
        responseFormat: { type: "json_object" },
        maxTokens: 3000,
      });

      const raw = result.choices?.[0]?.message?.content;
      if (!raw || typeof raw !== "string") {
        throw new Error("La IA no devolvió contenido válido. Intenta de nuevo.");
      }

      type FaseIA = { nombre: string; descripcion: string };
      type ProcedimientoIA = {
        nombre: string;
        objetivo: string;
        tiempo: string;
        fases: FaseIA[];
        recursos: string[];
        evaluacion: { tecnica: string; instrumento: string };
        criterioEvaluacionIds: string[];
      };
      type ParsedResult = {
        procedimientos: ProcedimientoIA[];
        contenidos: { conceptuales: string[]; procedimentales: string[]; actitudinales: string[] };
        estrategiasMetodologicas: { nombre: string; descripcion?: string }[];
      };

      let parsed: ParsedResult;
      try {
        parsed = JSON.parse(raw);
      } catch {
        try {
          parsed = JSON.parse(repairJson(raw));
        } catch {
          throw new Error("Error al procesar la respuesta de la IA. Intenta de nuevo.");
        }
      }

      if (!Array.isArray(parsed.procedimientos) || !parsed.contenidos) {
        throw new Error("La respuesta de la IA está incompleta. Intenta de nuevo.");
      }

      const idsPermitidosSet = new Set(criteriosEvaluacion.map((c) => c.id));

      const procedimientos = parsed.procedimientos
        .filter((p) => p?.nombre)
        .map((p, i) => {
          const id = `PROC-${Date.now()}-${i}`;
          const criteriosValidos = (p.criterioEvaluacionIds || []).filter((cid) => idsPermitidosSet.has(cid));
          return {
            id,
            nombre: p.nombre,
            objetivo: p.objetivo || "",
            tiempo: p.tiempo || "",
            fases: Array.isArray(p.fases) ? p.fases.filter((f) => f?.nombre) : [],
            recursos: Array.isArray(p.recursos) ? p.recursos : [],
            evaluacion: {
              id: `INST-${Date.now()}-${i}`,
              tecnica: p.evaluacion?.tecnica || "",
              instrumento: p.evaluacion?.instrumento || "",
            },
            criterioEvaluacionIds: criteriosValidos,
          };
        });

      const procedimientoCriterioEvaluacion = procedimientos.flatMap((p) =>
        p.criterioEvaluacionIds.map((criterioEvaluacionId) => ({
          procedimientoId: p.id,
          criterioEvaluacionId,
        }))
      );

      return {
        procedimientos: procedimientos.map(({ criterioEvaluacionIds, ...p }) => p),
        procedimientoCriterioEvaluacion,
        contenidos: {
          conceptuales: parsed.contenidos.conceptuales || [],
          procedimentales: parsed.contenidos.procedimentales || [],
          actitudinales: parsed.contenidos.actitudinales || [],
        },
        estrategiasMetodologicas: Array.isArray(parsed.estrategiasMetodologicas)
          ? parsed.estrategiasMetodologicas.filter((e) => e?.nombre)
          : [],
      };
    }),
});
