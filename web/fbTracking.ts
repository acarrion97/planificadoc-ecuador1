// web/fbTracking.ts
// Helpers para el frontend (Expo Web / React Native Web).
// En app nativa (iOS/Android) no hay cookies de navegador — estas funciones
// devuelven null y no rompen nada (los pagos desde anuncios llegan por web).

export function getFbCookies(): { fbp: string | null; fbc: string | null } {
  if (typeof document === "undefined") return { fbp: null, fbc: null };

  const readCookie = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(name + "="))
      ?.split("=")
      .slice(1)
      .join("=") ?? null;

  let fbc = readCookie("_fbc");

  // Si no existe _fbc pero la URL trae ?fbclid=..., la construimos
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp: readCookie("_fbp"), fbc };
}

export function newEventId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c?.randomUUID) return c.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
