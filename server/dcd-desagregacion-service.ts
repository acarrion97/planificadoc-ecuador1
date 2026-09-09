import {
  DcdDesagregacion,
  DcdDesagregacionInput,
  NIVELES_MARZANO,
  gradosDeSubnivel,
  resolverDcdConIndicador,
} from "../data/index";
import { invokeLLM, repairJson } from "./_core/llm";

/**
 * Motor de desagregación/gradación de DCD e indicadores de evaluación por grado.
 *
 * Genera el ladder completo de un subnivel: los grados intermedios se derivan
 * por IA (restringida al contenido de la DCD original) y el último grado se
 * copia EXACTO del catálogo sin pasar por la IA. El catálogo nunca se modifica:
 * la desagregación es una derivación editable.
 */

/** Niveles de Marzano usados para graduar la complejidad (de menor a mayor). */
const NIVELES_GRADACION = NIVELES_MARZANO.slice(0, 4);

export interface DesagregacionGenerada {
  filas: DcdDesagregacion[];
  advertencias: string[];
}

/**
 * Proceso cognitivo esperado para la posición de un grado intermedio dentro
 * del ladder. En un subnivel de 3 grados: primer grado → Recuperación,
 * grado medio → Comprensión. El último grado no se genera (texto completo).
 */
export function procesoCognitivoParaPosicion(posicion: number, totalGrados: number): string {
  const intermedios = Math.max(totalGrados - 1, 1);
  const niveles = NIVELES_GRADACION.slice(0, intermedios);
  const nivel = niveles[Math.min(posicion, niveles.length - 1)];
  return `${nivel.nombre}: ${nivel.descripcion}. Verbos sugeridos: ${nivel.verbos
    .slice(0, 6)
    .join(", ")}`;
}

/** 3.2 Prompt con restricciones pedagógicas: no introducir contenido ajeno a la DCD original. */
export function construirPromptDesagregacion(
  inputs: DcdDesagregacionInput[],
  gradosDelSubnivel: number[]
): string {
  const referente = inputs[0];
  const lineas = inputs
    .map(
      (i) =>
        `- Grado ${i.grado}:\n` +
        `  proceso cognitivo esperado: ${i.procesoCognitivo}\n` +
        `  DCD graduada: [redacta aquí la versión graduada]\n` +
        `  indicador graduado: [redacta aquí el indicador graduado]`
    )
    .join("\n");

  return [
    "Eres un asistente pedagógico experto en el currículo del Ministerio de Educación del Ecuador.",
    "Debes DESAGREGAR (graduar) una DCD con criterio de desempeño para los grados de un subnivel.",
    "",
    `DCD oficial: ${referente.descripcionDCD}`,
    `Indicador de evaluación oficial: ${referente.indicadorOriginal}`,
    `Grados del subnivel: ${gradosDelSubnivel.join(", ")}`,
    "",
    "La desagregación consiste en tomar la MISMA destreza y ajustar su complejidad para cada grado:",
    "- En el primer grado la DCD se redacta de forma más simple y acotada.",
    "- En los grados intermedios se conserva el mismo contenido, aumentando progresivamente la complejidad.",
    "- El ÚLTIMO grado del subnivel NO se genera: conserva la DCD completa (texto oficial exacto).",
    "",
    "Genera únicamente las versiones graduadas de los grados intermedios, respetando el proceso cognitivo indicado para cada grado.",
    "",
    "RESTRICCIÓN OBLIGATORIA: NO introduzcas conocimientos, conceptos, verbos ni contenidos que no estén contenidos en la DCD original. La versión graduada debe usar exclusivamente el contenido de la DCD y del indicador oficiales.",
    "",
    "Grados a generar:",
    lineas,
    "",
    "Responde ÚNICAMENTE con JSON válido, sin texto adicional, con el formato:",
    '{"grados":[{"grado":<n>,"dcdGraduada":"<texto>","indicadorGraduado":"<texto>","procesoCognitivo":"<texto>"}]}',
  ].join("\n");
}

/**
 * Palabras funcionales del español que no cuentan como contenido nuevo
 * al validar que la versión graduada no introduzca términos ajenos.
 */
const PALABRAS_FUNCIONALES = new Set([
  "para", "con", "del", "los", "las", "entre", "sobre", "hacia", "desde",
  "durante", "mediante", "según", "acuerdo", "este", "esta", "estos", "estas",
  "aquellos", "aquellas", "cuales", "cual", "donde", "cuando", "como", "también",
  "tanto", "forma", "parte", "manera", "frente", "nuevos", "nuevas", "segunda",
  "tercera", "primer", "primera", "grado", "grados", "misma", "mismo", "cada",
  "otro", "otra", "otros", "otras", "solo", "misma", "mismo", "proceso", "mediante",
]);

/**
 * 3.4 Valida que una versión graduada se mantenga dentro del contenido de la
 * DCD original. Advertencia NO bloqueante (la edición docente es el control final).
 */
export function validarContenidoGraduado(
  original: string,
  graduada: string,
  grado: number
): string[] {
  const advertencias: string[] = [];

  const tokenizar = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúüñ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const tokensOriginal = new Set(tokenizar(original));

  const nuevos = Array.from(
    new Set(
      tokenizar(graduada).filter(
        (p) => p.length >= 5 && !tokensOriginal.has(p) && !PALABRAS_FUNCIONALES.has(p)
      )
    )
  );

  if (nuevos.length > 0) {
    advertencias.push(
      `Grado ${grado}: posibles términos nuevos no presentes en la DCD original: ${nuevos
        .slice(0, 5)
        .join(", ")}`
    );
  }

  if (graduada.length > original.length * 1.5) {
    advertencias.push(
      `Grado ${grado}: la versión graduada excede la longitud de la DCD original.`
    );
  }

  return advertencias;
}

/**
 * 3.3 + 3.4 Genera el ladder completo de desagregación para una DCD.
 * - Resuelve la DCD oficial y su indicador principal.
 * - Genera por IA solo los grados intermedios (una sola llamada con JSON estricto).
 * - El último grado se copia EXACTO del catálogo (sin IA).
 * - Valida contenido de los grados intermedios (advertencias no bloqueantes).
 */
export async function generarDesagregacionDCD(codigoDCD: string): Promise<DesagregacionGenerada> {
  const resuelto = resolverDcdConIndicador(codigoDCD);
  if (!resuelto) {
    throw new Error(
      "La DCD no existe en el catálogo o no tiene indicador de evaluación para desagregar."
    );
  }
  const { dcd, indicador } = resuelto;
  const grados = gradosDeSubnivel(dcd.subnivel);
  if (!grados) {
    throw new Error(`El subnivel ${dcd.subnivel} no admite desagregación (Preparatoria o Inicial).`);
  }

  const gradoMaximo = grados[grados.length - 1];
  const gradosIntermedios = grados.slice(0, -1);
  const advertencias: string[] = [];

  const inputs: DcdDesagregacionInput[] = gradosIntermedios.map((grado, i) => ({
    codigoDCD,
    subnivel: dcd.subnivel,
    grado,
    gradoMaximo,
    descripcionDCD: dcd.descripcion,
    indicadorOriginal: indicador,
    procesoCognitivo: procesoCognitivoParaPosicion(i, grados.length),
  }));

  type GradoIntermedioIA = {
    grado: number;
    dcdGraduada: string;
    indicadorGraduado: string;
    procesoCognitivo?: string;
  };

  let gradosIA: GradoIntermedioIA[] = [];

  if (inputs.length > 0) {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente pedagógico especializado en el currículo ecuatoriano. Respondes ÚNICAMENTE con JSON válido, sin texto adicional.",
        },
        { role: "user", content: construirPromptDesagregacion(inputs, grados) },
      ],
      responseFormat: { type: "json_object" },
    });

    const content = result.choices[0]?.message?.content;
    const raw = typeof content === "string" ? content : "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        parsed = JSON.parse(repairJson(raw));
      } catch {
        throw new Error("La IA devolvió una respuesta incompleta. Por favor intenta de nuevo.");
      }
    }

    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as any).grados)) {
      throw new Error("La respuesta de la IA no tiene el formato esperado.");
    }
    gradosIA = ((parsed as any).grados as GradoIntermedioIA[]).filter(
      (g) => g && typeof g.grado === "number"
    );
  }

  const filas: DcdDesagregacion[] = grados.map((grado) => {
    if (grado === gradoMaximo) {
      return {
        codigoDCD,
        subnivel: dcd.subnivel,
        grado,
        gradoMaximo,
        descripcionDCD: dcd.descripcion,
        indicadorOriginal: indicador,
        dcdGraduada: dcd.descripcion,
        indicadorGraduado: indicador,
        estado: "generado" as const,
        version: 1,
      };
    }

    const prop = gradosIA.find((g) => g.grado === grado);
    const dcdGraduada = (prop?.dcdGraduada ?? "").trim();
    const indicadorGraduado = (prop?.indicadorGraduado ?? "").trim();

    if (!dcdGraduada || !indicadorGraduado) {
      throw new Error(`La IA no devolvió una versión para el grado ${grado}.`);
    }

    advertencias.push(...validarContenidoGraduado(dcd.descripcion, dcdGraduada, grado));

    return {
      codigoDCD,
      subnivel: dcd.subnivel,
      grado,
      gradoMaximo,
      descripcionDCD: dcd.descripcion,
      indicadorOriginal: indicador,
      dcdGraduada,
      indicadorGraduado,
      procesoCognitivo:
        prop?.procesoCognitivo || inputs.find((i) => i.grado === grado)?.procesoCognitivo,
      estado: "generado" as const,
      version: 1,
    };
  });

  return { filas, advertencias };
}