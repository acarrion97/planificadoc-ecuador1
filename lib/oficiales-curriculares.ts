/**
 * Textos OFICIALES del catálogo MinEduc para las DCD seleccionadas.
 *
 * Los documentos de planificación deben mostrar los objetivos (O.*, OG.*) y los
 * indicadores de evaluación (I.*, IE.*) que establece el Ministerio de Educación,
 * no texto redactado por la IA. Este módulo resuelve, a partir de los códigos de
 * las DCD elegidas por el docente, qué dice exactamente el catálogo:
 *
 *   - `objetivosOficiales()`     → destreza.objetivos
 *   - `indicadoresOficiales()`   → destreza.indicadoresEvaluacion
 *
 * Se usan tanto en el servidor (para pisar la respuesta de la IA) como en el
 * cliente (para sembrar los formularios). Cuando el catálogo no trae texto para
 * esas DCD se devuelve una lista vacía y el llamador conserva lo que tenía.
 */

import { buscarPorCodigo } from "../data";
import { separarCodigo } from "./codigos-curriculares";

/** Una DCD tal como la manejan los formularios: código suelto o { codigo }. */
export type DcdLike =
  | string
  | { codigo?: string | null | undefined }
  | null
  | undefined;

/**
 * Extrae los códigos de DCD de cualquier lista heterogénea
 * (`["M.4.1.1"]`, `[{ codigo: "M.4.1.1" }]` o mezcla), sin vacíos ni repetidos.
 */
export function codigosDeDcds(dcds: DcdLike[] | null | undefined): string[] {
  const vistos = new Set<string>();
  for (const d of dcds ?? []) {
    const codigo =
      typeof d === "string" ? d : d && typeof d === "object" ? d.codigo : "";
    const limpio = (codigo ?? "").trim();
    if (limpio) vistos.add(limpio);
  }
  return [...vistos];
}

/**
 * Deduplica preservando el orden: una clave por código curricular (si el texto
 * lo trae) o, si no, por el propio texto. Así `O.CN.B.5.2`, repetido en las
 * tres DCD de una unidad, aparece una sola vez.
 */
function sinRepetidos(textos: string[]): string[] {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const bruto of textos) {
    const t = (bruto ?? "").trim();
    if (!t) continue;
    const { codigo } = separarCodigo(t);
    const clave = codigo != null ? `#${codigo}` : ` ${t}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push(t);
  }
  return salida;
}

/** Objetivos oficiales (O.*, OG.*) de las DCD indicadas, sin duplicados. */
export function objetivosOficiales(dcds: DcdLike[] | null | undefined): string[] {
  return sinRepetidos(
    codigosDeDcds(dcds).flatMap(
      (codigo) => buscarPorCodigo(codigo)?.objetivos ?? []
    )
  );
}

/**
 * Indicadores de evaluación oficiales (I.*, IE.*) de las DCD indicadas,
 * sin duplicados.
 */
export function indicadoresOficiales(
  dcds: DcdLike[] | null | undefined
): string[] {
  return sinRepetidos(
    codigosDeDcds(dcds).flatMap(
      (codigo) => buscarPorCodigo(codigo)?.indicadoresEvaluacion ?? []
    )
  );
}

/** Objetivos oficiales unidos en un solo string ("" si el catálogo no trae ninguno). */
export function objetivosOficialesTexto(
  dcds: DcdLike[] | null | undefined,
  separador = "\n"
): string {
  return objetivosOficiales(dcds).join(separador);
}

/** Indicadores oficiales unidos en un solo string ("" si el catálogo no trae ninguno). */
export function indicadoresOficialesTexto(
  dcds: DcdLike[] | null | undefined,
  separador = "\n"
): string {
  return indicadoresOficiales(dcds).join(separador);
}

/**
 * Devuelve el texto oficial cuando existe y, si no, el que trae `respaldo`
 * (típicamente lo redactado por la IA). Así el catálogo siempre tiene prioridad
 * sin dejar campos vacíos en DCDs que aún no tienen objetivo/indicador cargado.
 */
export function conOficial(
  oficial: string[],
  respaldo: string | null | undefined
): string {
  if (oficial.length > 0) return oficial.join("\n");
  return (respaldo ?? "").trim();
}
