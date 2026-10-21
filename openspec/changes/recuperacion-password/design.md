## Context

La autenticación por correo/contraseña vive en `api/auth/[action].ts` (scrypt + JWT HMAC firmado) y la UI en la tarjeta de acceso de `app/paywall.tsx` (pestañas Ingresar/Registrarse/Código, layout split ≥900px). Los correos transaccionales ya salen por ZeptoMail con plantillas envueltas en `server/email.ts` (`ZEPTO_TOKEN` configurado). El patrón de DDL del repo es runtime (`ALTER TABLE … IF NOT EXISTS` en cada login). Ver proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- Auto-recuperación completa sin intervención de soporte, en dos pasos dentro de la tarjeta de login.
- Proteger cuentas: códigos de un solo uso, caducos, con intentos limitados y sin filtrar qué correos existen.
- Cero migraciones manuales y cero cambios en login/registro/pago.

**Non-Goals:**
- Revocar sesiones/JWT vigentes al cambiar la contraseña (el token de30 días sigue siendo válido; ver Riesgos).
- Recuperación por teléfono/SMS, preguntas de seguridad o MFA.
- Interfaz de admin para resetear contraseñas (ya existe `POST /api/admin/reset-password`).
- Rate limit por IP (ver Open Questions).

## Decisions

- **D1 — Dos pasos dentro de la tarjeta de login, no una ruta nueva.** Se reutiliza el layout split (panel de marca + tarjeta) y las pestañas marcan "Ingresar" como activa durante la recuperación. *Alternativa:* `app/recuperar.tsx` — duplicaría el layout de marca y añadiría navegación extra sin aportar nada.
- **D2 — Tabla nueva `password_reset_codes`, creada con `CREATE TABLE IF NOT EXISTS` en la primera solicitud.** *Alternativas:* (a) columnas en `docente_accounts` con `ALTER TABLE … ADD COLUMN IF NOT EXISTS` — solo funciona en MariaDB, en MySQL ese statement falla (el ALTER del login ya va en try/catch por eso) y arriesga la tabla de login; (b) `drizzle-kit push` — exige ejecutar migraciones contra la BD de producción en el deploy. La tabla nueva es portable y aísla el feature.
- **D3 — HMAC-SHA256 del código con `JWT_SECRET` en la BD, comparación con `timingSafeEqual`.** *Alternativa:* texto plano — un volcado de BD expondría códigos vivos. El secreto ya existe para firmar tokens, no hay configuración nueva.
- **D4 — Respuesta genérica idéntica con y sin cuenta + rate limit silencioso.** El segundo envío dentro de 60s se omite sin cambiar la respuesta, porque un 429 explícito solo para cuentas existentes filtraría la existencia. *Alternativa:* 429 visible — más claro para el usuario pero con side-channel de enumeración. La UX se compensa con un cooldown de 60s en la UI.
- **D5 — Un solo código activo por correo (delete + insert al emitir) y borrado al usarse.** Simplifica "un solo uso" y evita ambigüedad entre códigos. *Alternativa:* historial de códigos — aporta auditoría que hoy no se pide.
- **D6 — La caducidad se controla por `expiresAt` (10 min) y el bloqueo por `attempts` (máx. 5) en la fila del código**, con descarte del código al caducar/bloquearse para forzar un reenvío limpio.
- **D7 — Envío por el canal ZeptoMail existente con plantilla propia** (`sendPasswordResetCodeEmail`), desde `noreply@planificadoc.app`. *Alternativa:* proveedor nuevo — innecesario.
- **D8 — El backend resuelve todo el criterio de seguridad; la UI solo valida formato** (6 dígitos, ≥6 caracteres, coincidencia) antes de llamar a la API, para fallos locales sin round-trip.

## Risks / Trade-offs

- **[Email no entregado (spam, ZEPTO caído)]** → la respuesta siempre es genérica y hay botón de reenviar con cooldown; el fallo de envío se loguea server-side. Coste: el usuario puede esperar un correo que no llega.
- **[Side-channel de enumeración por tiempo de respuesta]** → la consulta de existencia y el envío solo ocurren para cuentas reales, así que la respuesta puede ser más lenta para cuentas existentes. Mitigación parcial: cuerpo idéntico y sin errores diferenciados; se acepta por complejidad de medir/establecer.
- **[Fuerza bruta del código de6 dígitos]** → 5 intentos × 1 minuto por cuenta dentro de10 minutos de vida = máximo 50 combinaciones por código sobre 1,000,000.
- **[Permisos DDL en la BD]** → si `CREATE TABLE` falla, `forgot-password` responde 500 con el error en logs (mismo patrón de riesgo que el ALTER del login).
- **[Sesiones antiguas siguen válidas tras el reset]** → el JWT no se revoca; un atacante con una sesión ya abierta la conserva. Fuera de alcance por diseño (D8/Non-Goals); mitigación futura candidata: check de `passwordChangedAt` al validar sesión.
- **[Códigos en logs de correo/monitorización]** → solo se loguea el resultado del envío, no el código.

## Migration Plan

1. Push a `feature/ux-navigation-and-creation-hub` → deploy de Vercel (ya hecho: `3d8073f`).
2. La tabla se crea sola en la primera `forgot-password`; no hay pasos de BD.
3. Verificación manual en preview: login → ¿Olvidaste tu contraseña? → correo → código → contraseña nueva → login con la nueva.
4. Rollback: revertir el commit; la tabla huérfana es inofensiva y puede eliminarse aparte.

## Open Questions

- ¿Mostrar el correo parcialmente (`d•••@correo.com`) en el mensaje del paso 2? Diferible: no cambia requisitos, solo la redacción del mensaje informativo.
- ¿Rate limit adicional por IP (más allá del 1/min por correo)? Compatibile con el spec actual; requiere decisión de infraestructura (almacenar por IP o confiar en el WAF de Vercel).
