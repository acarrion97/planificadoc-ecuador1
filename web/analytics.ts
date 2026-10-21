// web/analytics.ts
// Eventos de Google Analytics 4 para el frontend (Expo Web / React Native Web).
// El tag `gtag` se carga en app/+html.tsx. En iOS/Android, o si el navegador
// bloquea Analytics, esta función no hace nada y nunca lanza errores.
//
// No enviar datos personales (correo, nombre, cédula, teléfono) en los parámetros.

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === "function") gtag("event", name, params);
  } catch {
    // Analytics nunca debe romper la app.
  }
}
