## Why

Hoy un docente que olvida su contraseña queda sin acceso: la única vía es contactar soporte para que un admin cambie la contraseña a mano (`POST /api/admin/reset-password`). No existe un flujo de auto-recuperación en la pantalla de login, lo que genera dependencia de soporte y abandono de cuentas pagas.

## What Changes

- Nuevo enlace **"¿Olvidaste tu contraseña?"** bajo el campo de contraseña del login (tarjeta de acceso de `/paywall`).
- **Paso 1 — envío de código**: pantalla donde el docente ingresa su correo y recibe por email un código de 6 dígitos (ZeptoMail, plantilla propia). La respuesta es idéntica exista o no la cuenta (sin enumeración de usuarios) y hay rate limit de 1 reenvío por minuto.
- **Paso 2 — restablecer**: pantalla con código + contraseña nueva (con confirmación y ojo de visibilidad). El código caduca a los 10 minutos, admite 5 intentos y es de **un solo uso** (se consume al aplicarse). Al éxito se redirige al login con el correo precargado y un banner de confirmación.
- Nuevas acciones de API: `POST /api/auth/forgot-password` y `POST /api/auth/reset-password`.
- Nueva tabla `password_reset_codes` (se crea en runtime con `CREATE TABLE IF NOT EXISTS`), donde solo se guarda el HMAC-SHA256 del código.
- Nueva plantilla de correo "Código para restablecer tu contraseña".
- Sin cambios de lógica en login/registro ni en el resto del flujo del paywall (pago y éxito intactos).

## Capabilities

### New Capabilities
- `recuperacion-password`: recuperación de contraseña por código de un solo uso enviado al correo — API, reglas de validez del código, envío de email, y el flujo de dos pasos en la tarjeta de login.

### Modified Capabilities
<!-- ninguna: no existen specs previos de autenticación cuyos requisitos cambien -->

## Impact

- **Código**: `api/auth/[action].ts` (acciones nuevas), `server/email.ts` (plantilla), `drizzle/schema.ts` (tabla `password_reset_codes`), `lib/access-control.tsx` (`requestPasswordReset`, `resetPasswordWithCode`), `app/paywall.tsx` (enlace, pantallas forgot/reset, banner), `__tests__/auth-password-reset.test.ts` (9 tests).
- **API**: dos endpoints nuevos bajo `/api/auth/*`; CORS/autenticación igual que login/register.
- **BD**: tabla nueva creada automáticamente en la primera solicitud (sin migración manual).
- **Dependencias**: `ZEPTO_TOKEN` (ya configurado para los correos transaccionales existentes) y `JWT_SECRET` (ya usado para firmar tokens).
- **Implementación ya landed**: commit `3d8073f` en `feature/ux-navigation-and-creation-hub` (9/9 tests nuevos, `tsc` en línea base 53, eslint sin errores). Este cambio documenta esa implementación.
