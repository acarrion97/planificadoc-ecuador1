/**
 * Códigos curriculares oficiales que el catálogo trae al inicio de cada
 * objetivo e indicador (O.CN.B.5.2, OG.ECA.8, I.CN.B.5.1.1 …).
 *
 * Los documentos de planificación (plan diario, semanal, PCA anual y PCT
 * trimestral, en Word y en PDF) imprimen el código en negrita arriba del texto,
 * del mismo modo en que ya se imprime el código de la DCD.
 *
 * Cuando el texto lo redactó la IA —y por eso no trae código oficial— NO se
 * inventa ninguno: se agrega una sola línea de referencia con el código de la
 * DCD de la que deriva el texto.
 */

/** Un objetivo/indicador ya separado en su código oficial y su texto. */
export interface BloqueTexto {
  /** Código oficial del catálogo si el texto lo traía (p.ej. "I.CN.B.5.1.1"). */
  codigo?: string;
  /** Texto del objetivo/indicador, sin su código. */
  texto: string;
}

/** Resultado de preparar uno o más textos para su impresión. */
export interface BloquesTexto {
  /** "DCD: M.4.1.1 · M.4.1.2" — solo cuando algún texto vino sin código oficial. */
  referencia: string;
  bloques: BloqueTexto[];
}

/**
 * Código curricular al inicio de la cadena: un prefijo en mayúsculas (O, OG, I,
 * IE, CE, D, P, A) seguido de al menos dos segmentos con punto y del texto.
 * Ejemplos que coinciden: "O.CN.B.5.2. Desarrollar…", "OG.ECA.8. Explorar…",
 * "I.CN.B.5.1.1. Explica…", "I.LL.2.1.1 Aplica…".
 */
const RE_CODIGO =
  /^((?:OG|O{1,2}|I|IE|CE|D|P|A)(?:\.[A-Z0-9]{1,8}){1,6})(?:\.\s+|\s+)([\s\S]+)$/;

/** Separa el código curricular oficial del texto de un objetivo/indicador. */
export function separarCodigo(texto: string | null | undefined): BloqueTexto {
  const t = (texto ?? "").trim();
  const m = RE_CODIGO.exec(t);
  if (!m) return { texto: t };
  return { codigo: m[1], texto: m[2].trim() };
}

/** true si la cadena trae un código curricular oficial al inicio. */
export function tieneCodigo(texto: string | null | undefined): boolean {
  return separarCodigo(texto).codigo !== undefined;
}

/** "DCD: M.4.1.1 · M.4.1.2" — códigos únicos, en el orden dado. */
export function referenciaDcd(
  codigos: string | Array<string | null | undefined> | null | undefined
): string {
  const lista = Array.isArray(codigos) ? codigos : [codigos];
  const unicos = [
    ...new Set(
      lista.filter((c): c is string => typeof c === "string" && c.trim() !== "")
    ),
  ];
  return unicos.length > 0 ? `DCD: ${unicos.join(" · ")}` : "";
}

/** Marcas de vacío: no son contenido, no llevan código ni referencia. */
const VACIOS = new Set([
  "", "—", "___",
  "No especificado", "No especificada", "No especificados", "No especificadas",
  "Not specified",
]);

/**
 * Convierte uno o varios textos en bloques listos para imprimir (código en
 * negrita arriba, texto debajo). Si algún texto no trae código oficial, agrega
 * la referencia a la(s) DCD(s) indicada(s).
 */
export function prepararBloques(
  textos: string | string[] | null | undefined,
  codigosDcd?: string | Array<string | null | undefined> | null
): BloquesTexto {
  const base: string[] = (
    Array.isArray(textos) ? textos : typeof textos === "string" ? [textos] : []
  ).flatMap((t) => String(t ?? "").split("\n"));

  const bloques = base
    .map((t) => separarCodigo(t))
    .filter((b) => b.codigo !== undefined || !VACIOS.has(b.texto));

  const sinCodigo = bloques.some((b) => b.codigo === undefined);

  return {
    referencia: bloques.length > 0 && sinCodigo ? referenciaDcd(codigosDcd) : "",
    bloques,
  };
}

/** Renderiza los bloques como HTML: código en negrita arriba, texto debajo. */
export function bloquesAHtml(
  bloques: BloquesTexto,
  esc: (s: string) => string = (s) => s
): string {
  const partes: string[] = [];
  if (bloques.referencia) {
    partes.push(
      `<div style="font-size:7px;font-weight:700;color:#555;margin-bottom:2px;">${esc(
        bloques.referencia
      )}</div>`
    );
  }
  for (const b of bloques.bloques) {
    if (b.codigo) {
      partes.push(
        `<div style="font-weight:700;">${esc(b.codigo)}</div>`
      );
    }
    partes.push(`<div>${esc(b.texto)}</div>`);
  }
  return partes.join("");
}
