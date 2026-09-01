import { invokeLLM, repairJson } from "../_core/llm";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../../data/types";
import type { Area, Subnivel } from "../../data/types";
import { PcaAiResultSchema, PCA_AI_RESULT_JSON_SCHEMA, PcaAiResult } from "./schemas";
import { PcaCamposExtraidos } from "./types";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();
}

/** Intenta mapear un nombre de área en texto libre (ej. "Matemática") al código usado en la app (ej. "M"). */
export function inferirCodigoArea(textoArea: string | undefined): Area {
  if (!textoArea) return "M";
  const normalizado = normalizar(textoArea);

  // Aliases comunes de siglas a código canónico
  const ALIASES: Record<string, Area> = {
    MAT: "M",
    MATEMATICAS: "M",
    MATEMÁTICA: "M",
    LL: "LL",
    LENGUA: "LL",
    LENGUA_Y_LITERATURA: "LL",
    CN: "CN",
    CIENCIAS: "CN",
    CIENCIAS_NATURALES: "CN",
    CS: "CS",
    ESTUDIOS_SOCIALES: "CS",
    SOCIALES: "CS",
    EF: "EF",
    EDUCACION_FISICA: "EF",
    ECA: "ECA",
    EDUCACION_CULTURAL_Y_ARTISTICA: "ECA",
    EFL: "EFL",
    INGLES: "EFL",
    ENGLISH: "EFL",
    "CN.B": "CN.B",
    BIOLOGIA: "CN.B",
    BIOLOGÍA: "CN.B",
    "CN.Q": "CN.Q",
    QUIMICA: "CN.Q",
    QUÍMICA: "CN.Q",
    "CN.F": "CN.F",
    FISICA: "CN.F",
    FÍSICA: "CN.F",
    "CS.H": "CS.H",
    HISTORIA: "CS.H",
    "CS.F": "CS.F",
    FILOSOFIA: "CS.F",
    FILOSOFÍA: "CS.F",
    "CS.EC": "CS.EC",
    EDUCACION_PARA_LA_CIUDADANIA: "CS.EC",
    KAI: "CAI",
    CAI: "CAI",
    EG: "EG",
    EMPRENDIMIENTO: "EG",
  };

  // Buscar alias por normalización
  for (const [alias, codigo] of Object.entries(ALIASES)) {
    if (normalizar(alias) === normalizado) return codigo;
  }

  // Buscar en AREAS_INFO por nombre exacto o parcial
  const entrada = (Object.entries(AREAS_INFO) as Array<[Area, { name: string }]>).find(
    ([, info]) => normalizar(info.name) === normalizado || normalizado.includes(normalizar(info.name))
  );
  return entrada?.[0] ?? "M";
}

/** Heurística best-effort: infiere el subnivel a partir del texto libre de "grado/curso". */
export function inferirSubnivel(textoGrado: string | undefined): Subnivel {
  const t = normalizar(textoGrado ?? "");
  if (/BACHILLERATO|BGU|1RO BGU|2DO BGU|3RO BGU/.test(t)) return 5;
  if (/8VO|9NO|10MO|OCTAVO|NOVENO|DECIMO/.test(t)) return 4;
  if (/5TO|6TO|7MO|QUINTO|SEXTO|SEPTIMO/.test(t)) return 3;
  if (/2DO|3RO|4TO|SEGUNDO|TERCERO|CUARTO/.test(t)) return 2;
  if (/1ER|1RO|PRIMERO|PREPARATORIA/.test(t)) return 1;
  return 3; // fallback neutral: Básica Media
}

export type PlanificacionExistente = {
  formData: any;
  aiResult: any;
} | null;

function buildPrompt(campos: PcaCamposExtraidos, existente: PlanificacionExistente): string {
  const areaCodigo = inferirCodigoArea(campos.area);
  const areaNombre = AREAS_INFO[areaCodigo]?.name || campos.area || areaCodigo;
  const subnivel = inferirSubnivel(campos.grado);
  const subnivelNombre = SUBNIVEL_NAMES[subnivel] || `Subnivel ${subnivel}`;

  const unidadesFuente = campos.unidades.length > 0 ? campos.unidades : existente?.formData?.unidades ?? [];

  const unidadesTexto = unidadesFuente
    .map((u: any, idx: number) => {
      const numero = u.numero ?? idx + 1;
      const camposConocidos = [
        u.titulo && `Título ya definido en el documento: "${u.titulo}" (consérvalo tal cual)`,
        u.objetivosEspecificos && `Objetivos específicos ya definidos: "${u.objetivosEspecificos}"`,
        u.contenidos && `Contenidos ya definidos: "${u.contenidos}"`,
        u.orientacionesMetodologicas && `Orientaciones ya definidas: "${u.orientacionesMetodologicas}"`,
        u.evaluacion && `Evaluación ya definida: "${u.evaluacion}"`,
      ].filter(Boolean);
      return `Unidad ${numero} (duración: ${u.duracionSemanas ?? "no especificada"} semanas):\n${
        camposConocidos.length > 0 ? camposConocidos.join("\n") : "Sin campos previos — genera todo el contenido."
      }`;
    })
    .join("\n\n");

  return `Eres un experto en currículo educativo ecuatoriano. Un docente subió un documento de Planificación Curricular Anual (PCA) parcialmente llenado a mano, siguiendo el formato oficial del Ministerio de Educación del Ecuador. Tu tarea es completar los campos que falten, PRESERVANDO exactamente los valores que el documento ya traía (no los reescribas ni resumas) y generando contenido pedagógico razonable solo donde no había nada.

DATOS DEL DOCUMENTO IMPORTADO:
- Institución: ${campos.institucion || "no especificada"}
- Docente(s): ${campos.docente || "no especificado"}
- Área/Asignatura: ${areaNombre}
- Subnivel (inferido): ${subnivelNombre}
- Grado/Curso: ${campos.grado || "no especificado"}
- Año lectivo: ${campos.anioLectivo || "no especificado"}
${campos.objetivosArea ? `- Objetivos del área ya definidos: "${campos.objetivosArea}" (consérvalos tal cual)` : "- Objetivos del área: no definidos, genéralos"}
${campos.objetivosGrado ? `- Objetivos del grado ya definidos: "${campos.objetivosGrado}" (consérvalos tal cual)` : "- Objetivos del grado: no definidos, genéralos"}
${campos.bibliografia ? `- Bibliografía ya definida: "${campos.bibliografia}" (consérvala e incorpórala)` : "- Bibliografía: no definida, sugiere referencias APA 7.ª edición, fuentes 2025-2026, libros y artículos científicos de editoriales/revistas indexadas"}
${campos.observaciones ? `- Observaciones ya definidas: "${campos.observaciones}" (consérvalas tal cual)` : "- Observaciones: no definidas, genéralas"}

UNIDADES DE PLANIFICACIÓN DETECTADAS EN EL DOCUMENTO:
${unidadesTexto || "No se detectaron unidades — genera al menos una unidad razonable para el período."}

GENERA ÚNICAMENTE JSON con esta estructura exacta, sin texto adicional, sin bloques markdown:
{
  "objetivosArea": "...",
  "objetivosGrado": "...",
  "unidades": [
    { "numero": 1, "titulo": "...", "objetivosEspecificos": "...", "contenidos": "...", "orientacionesMetodologicas": "...", "evaluacion": "...", "duracionSemanas": 4 }
  ],
  "bibliografiaSugerida": "...",
  "observaciones": "..."
}

REGLAS OBLIGATORIAS:
- Si un campo ya tenía valor en el documento importado, tu JSON debe conservar ESE MISMO texto para ese campo (no lo cambies, no lo resumas, no lo reformules).
- Alinea todo el contenido generado al currículo priorizado vigente del Ministerio de Educación del Ecuador para ${areaNombre} en ${subnivelNombre}.
- Responde SOLO con el JSON, sin nada más.`;
}

export type ResultadoCompletadoPca = {
  aiResult: PcaAiResult;
  areaCodigo: Area;
  subnivel: Subnivel;
};

/**
 * Completa los campos faltantes de una PCA importada llamando a la IA, con
 * la salida validada contra `PcaAiResultSchema` (a diferencia del flujo
 * normal de generación, ver design.md Decisión 5). Reintenta una vez con
 * `repairJson` si el primer parseo falla; si la segunda validación también
 * falla, propaga el error para que el router lo reporte al docente (spec.md,
 * Requirement: Completado de campos con IA → Scenario: La IA devuelve datos
 * que no cumplen el esquema esperado).
 */
export async function completarPcaConIA(
  campos: PcaCamposExtraidos,
  existente: PlanificacionExistente
): Promise<ResultadoCompletadoPca> {
  const prompt = buildPrompt(campos, existente);

  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente pedagógico especializado en el currículo educativo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional ni bloques markdown.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_schema", json_schema: PCA_AI_RESULT_JSON_SCHEMA },
    max_tokens: 8192,
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("La IA no devolvió contenido para completar la planificación.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    try {
      parsed = JSON.parse(repairJson(content));
    } catch {
      throw new Error("La IA devolvió una respuesta incompleta. Intenta de nuevo.");
    }
  }

  const validado = PcaAiResultSchema.safeParse(parsed);
  if (!validado.success) {
    throw new Error("La IA devolvió datos que no cumplen el formato esperado. Intenta de nuevo.");
  }

  return {
    aiResult: validado.data,
    areaCodigo: inferirCodigoArea(campos.area),
    subnivel: inferirSubnivel(campos.grado),
  };
}
