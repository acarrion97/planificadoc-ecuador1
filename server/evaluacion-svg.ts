/**
 * Opciones visuales generadas por IA: el modelo devuelve un SVG autocontenido
 * como texto y aquí se valida y convierte a data URI para guardarlo en
 * OpcionPregunta.imagen (el mismo campo que usan las imágenes que sube el
 * docente).
 *
 * El SVG termina en <img src> (PDF) y en expo-image, donde no se ejecuta
 * script, pero igual se descarta todo lo activo o externo: es contenido de un
 * LLM que acaba en documentos que se comparten.
 */

const MAX_SVG_CHARS = 8000;

const PROHIBIDO = [
  /<script/i,
  /<foreignObject/i,
  /<iframe/i,
  /<image/i,
  /<use/i,
  /<style/i,
  /\son[a-z]+\s*=/i,
  /javascript:/i,
  /(?:xlink:)?href\s*=/i,
  /url\s*\(/i,
  /<!ENTITY/i,
  /<!DOCTYPE/i,
];

/** Devuelve el SVG como data URI o null si no es seguro/válido. */
export function svgADataUri(svg: string | undefined): string | null {
  if (!svg) return null;
  let s = svg.trim();
  if (s.length === 0 || s.length > MAX_SVG_CHARS) return null;
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>\s*$/i.test(s)) return null;
  if (PROHIBIDO.some((re) => re.test(s))) return null;
  // Sin xmlns el navegador no renderiza el SVG dentro de <img>.
  if (!/xmlns\s*=/.test(s)) s = s.replace(/^<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  return `data:image/svg+xml;base64,${Buffer.from(s, "utf8").toString("base64")}`;
}
