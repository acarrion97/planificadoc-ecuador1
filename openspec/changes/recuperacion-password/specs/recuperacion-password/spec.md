## Purpose

Permitir que un docente recupere el acceso a su cuenta de PlanificaDoc restableciendo su contraseña con un código de un solo uso enviado a su correo, sin depender de soporte manual.

## ADDED Requirements

### Requirement: Enlace de recuperación en la pantalla de login
La tarjeta de login SHALL mostrar un enlace "¿Olvidaste tu contraseña?" debajo del campo de contraseña que abre el paso de solicitud de código.

#### Scenario: Enlace visible en el login
- **WHEN** se muestra la pestaña "Ingresar" de la tarjeta de acceso
- **THEN** el enlace "¿Olvidaste tu contraseña?" aparece debajo del campo de contraseña

#### Scenario: El enlace abre el paso 1 con el correo precargado
- **WHEN** el docente presiona el enlace con un correo ya escrito en el login
- **THEN** se abre la pantalla de recuperación con ese correo precargado y sin errores previos

### Requirement: Solicitud de código por correo
El sistema SHALL aceptar `POST /api/auth/forgot-password` con un correo y enviar un código de 6 dígitos al correo de la cuenta, respondiendo siempre de forma idéntica exista o no la cuenta.

#### Scenario: Cuenta existente recibe un código
- **WHEN** llega una solicitud con el correo de una cuenta registrada y no hay código enviado en el último minuto
- **THEN** se responde 200 con mensaje genérico, se envía un correo con un código de 6 dígitos, y solo se almacena su hash con caducidad de 10 minutos (el código anterior queda invalidado)

#### Scenario: Correo inexistente no revela la inexistencia
- **WHEN** llega una solicitud con un correo sin cuenta registrada
- **THEN** se responde 200 con exactamente el mismo cuerpo que para una cuenta existente y no se envía ningún correo

#### Scenario: Reenvío limitado a uno por minuto
- **WHEN** llega una segunda solicitud para la misma cuenta dentro de los 60 segundos
- **THEN** se responde 200 con el mismo cuerpo genérico pero no se envía ni se emite un código nuevo

#### Scenario: Entradas inválidas
- **WHEN** falta el correo, el correo no tiene formato válido o el método no es POST
- **THEN** se responde 400 (o 405 para método incorrecto) sin enviar correos

### Requirement: Restablecimiento con código verificado
El sistema SHALL aceptar `POST /api/auth/reset-password` con correo, código y contraseña nueva; solo cambia la contraseña cuando el código es correcto, vigente y con intentos restantes, y consume el código al aplicarse.

#### Scenario: Código correcto restablece la contraseña
- **WHEN** el código es el correcto, tiene menos de 10 minutos y menos de 5 intentos fallidos
- **THEN** se actualiza la contraseña de la cuenta, el código se elimina (un solo uso) y se responde 200

#### Scenario: Código incorrecto acumula intentos
- **WHEN** el código no coincide
- **THEN** se responde 400, se incrementa el contador de intentos y el mensaje indica los intentos restantes

#### Scenario: Bloqueo tras 5 intentos fallidos
- **WHEN** la cuenta ya registró 5 intentos fallidos con el código vigente
- **THEN** se responde 400 indicando demasiados intentos y el código se descarta

#### Scenario: Código expirado
- **WHEN** el código supera los 10 minutos
- **THEN** se responde 400 indicando caducidad y el código se elimina

#### Scenario: Código ya usado o inexistente
- **WHEN** no queda ningún código vigente para el correo (porque ya se usó o nunca se pidió)
- **THEN** se responde 400 pidiendo solicitar uno nuevo

#### Scenario: Datos de entrada inválidos
- **WHEN** el código no tiene 6 dígitos, la contraseña tiene menos de 6 caracteres o faltan campos
- **THEN** se responde 400 sin consumir el código

### Requirement: Flujo de dos pasos en la tarjeta de login
La recuperación SHALL ocurrir en dos pasos dentro de la tarjeta de acceso: primero solicitar el código y luego introducirlo con la contraseña nueva, devolviendo al login al terminar.

#### Scenario: Éxito redirige al login con confirmación
- **WHEN** el restablecimiento responde éxito
- **THEN** la UI vuelve a la pestaña "Ingresar" con el correo precargado, la contraseña vacía y un mensaje de confirmación de la contraseña actualizada

#### Scenario: El paso 2 informa dónde está el código
- **WHEN** se solicita el código con éxito
- **THEN** el paso 2 muestra un mensaje indicando a qué correo se envió y ofrece reenviar con una cuenta regresiva de 60 segundos

#### Scenario: Reenviar respeta la ventana de espera
- **WHEN** la cuenta regresiva de reenvío está activa
- **THEN** el botón de reenvío está deshabilitado y muestra los segundos restantes

#### Scenario: Error del servidor en el paso 2
- **WHEN** el restablecimiento falla (código inválido, expirado o error de red)
- **THEN** se muestra el mensaje de error y el docente permanece en el paso 2 para corregir o reenviar

#### Scenario: Validación local antes de enviar
- **WHEN** el código no tiene 6 dígitos, la contraseña es corta o las dos contraseñas no coinciden
- **THEN** se muestra un error local y no se realiza la petición

### Requirement: Correo con el código
El sistema SHALL enviar un correo con la plantilla de PlanificaDoc que muestre el código de forma destacada y sus condiciones de uso.

#### Scenario: Contenido del correo
- **WHEN** se emite el código
- **THEN** el correo viene de "PlanificaDoc Ecuador", muestra el código de 6 dígitos, indica que es válido 10 minutos y de un solo uso, y aconseja ignorarlo si no fue solicitado y revisar spam

### Requirement: El código nunca se expone ni se guarda en claro
El sistema MUST guardar únicamente el hash del código, incluirlo solo en el correo, y limitar su uso a 5 intentos y 10 minutos.

#### Scenario: Almacenamiento protegido
- **WHEN** se almacena un código en la base de datos
- **THEN** la fila contiene un hash (HMAC-SHA256), nunca los 6 dígitos en texto plano

#### Scenario: La API no devuelve el código
- **WHEN** se responde `forgot-password`
- **THEN** la respuesta no incluye el código en ninguna circunstancia
