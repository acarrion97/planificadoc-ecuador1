> Implementado en el commit `3d8073f` (rama `feature/ux-navigation-and-creation-hub`). Esta lista documenta lo entregado; queda pendiente solo la verificación manual end-to-end en Vercel.

## 1. Backend — API y datos

- [x] 1.1 Agregar la tabla `password_reset_codes` a `drizzle/schema.ts` (email, codeHash, attempts, expiresAt, sentAt)
- [x] 1.2 Acción `forgot-password` en `api/auth/[action].ts`: validación de correo, rate limit silencioso de 60s, código de 6 dígitos guardado como HMAC-SHA256 con TTL de 10 min, un solo código activo (delete + insert)
- [x] 1.3 Acción `reset-password`: vigencia, bloqueo a los 5 intentos, comparación con `timingSafeEqual`, cambio de contraseña con scrypt y consumo del código
- [x] 1.4 Creación en runtime de la tabla (`CREATE TABLE IF NOT EXISTS`) en la primera solicitud

## 2. Correo

- [x] 2.1 Plantilla `sendPasswordResetCodeEmail` en `server/email.ts` (código destacado, validez 10 min, un solo uso, ignorar si no fue solicitado, revisar spam)

## 3. Cliente — contexto de acceso

- [x] 3.1 `requestPasswordReset(email)` en `lib/access-control.tsx` contra `/api/auth/forgot-password`
- [x] 3.2 `resetPasswordWithCode(email, code, password)` con `attemptsLeft` en la respuesta de error

## 4. UI — tarjeta de login (`app/paywall.tsx`)

- [x] 4.1 Enlace "¿Olvidaste tu contraseña?" bajo el campo de contraseña (precarga el correo en el paso 1)
- [x] 4.2 Paso 1 (forgot): correo, botón "Enviar código" con loading y "← Volver a iniciar sesión"
- [x] 4.3 Paso 2 (reset): código de 6 dígitos, contraseña nueva + confirmación con ojo de visibilidad, reenvío con cooldown de 60s
- [x] 4.4 Al éxito: volver a la pestaña "Ingresar" con el correo precargado y banner verde de confirmación (InfoRow)
- [x] 4.5 La pestaña "Ingresar" queda activa durante forgot/reset; errores del servidor se muestran en el paso 2

## 5. Verificación

- [x] 5.1 `__tests__/auth-password-reset.test.ts`: 9 tests (envío, no-enumeración, rate limit, un solo uso con login real, intentos y bloqueo, expiración, validaciones)
- [x] 5.2 `tsc --noEmit` en línea base (53) y `eslint` sin errores en los archivos tocados
- [ ] 5.3 Verificación manual end-to-end en Vercel con un correo real: login → ¿Olvidaste tu contraseña? → correo → código → contraseña nueva → login con la contraseña nueva
