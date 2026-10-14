// Las URLs de las páginas de pago llevan datos personales en el query string
// (email, cédula, teléfono, titular de la tarjeta, token de la tarjeta).
// Antes de guardar una URL o enviarla a terceros (Meta CAPI, Google Analytics)
// hay que quedarse solo con origin + pathname.

export function stripQuery(url: unknown): string | null {
  if (typeof url !== "string" || !url) return null;
  try {
    const u = new URL(url);
    return u.origin + u.pathname;
  } catch {
    return null;
  }
}
