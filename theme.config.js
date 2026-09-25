/**
 * Paleta canónica por modo (única fuente: theme.config.js → SchemeColors →
 * CSS vars --color-* + Tailwind + useColors).
 *
 * - LIGHT: sin cambios (grises slate, cuerpo #F8FAFC).
 * - DARK: escala en TONOS AZULES (hsl ≈ 214°) pedida en Vercel, armonizada con
 *   la marca #003366. Cuerpo #0A2E5C (azul marino, un punto más claro que
 *   #1E293B); tarjetas (surface) un escalón encima y los inputs —que usan el
 *   token `background`— quedan hundidos dentro de la tarjeta para que se vean
 *   siempre.
 *
 * Ver docs/brand.md §3.1 y design.md "Paleta de Colores".
 */
/** @type {const} */
const themeColors = {
  primary: { light: '#1B5E9E', dark: '#4DA3E8' },
  // Color de marca PlanificaDoc (#003366). Se reserva como FONDO (botones,
  // chips, panel paywall, ítem activo): blanco encima contrasta en ambos modos.
  brand: { light: '#003366', dark: '#003366' },
  // Marca como TEXTO/ICONO. En dark, #003366 sobre #0A2E5C/#123C72 es
  // ilegible, así que se aclara el mismo azul de marca (#7DB9EA: ≈6.4:1 sobre
  // el cuerpo y ≈5.2:1 sobre surface). En light es idéntico a `brand`.
  brandFg: { light: '#003366', dark: '#7DB9EA' },
  background: { light: '#F8FAFC', dark: '#0A2E5C' },
  surface: { light: '#FFFFFF', dark: '#123C72' },
  foreground: { light: '#0F172A', dark: '#EBF1FA' },
  muted: { light: '#64748B', dark: '#93AED2' },
  border: { light: '#E2E8F0', dark: '#174E97' },
  success: { light: '#16A34A', dark: '#4ADE80' },
  warning: { light: '#D97706', dark: '#FBBF24' },
  error: { light: '#DC2626', dark: '#F87171' },
};

module.exports = { themeColors };
