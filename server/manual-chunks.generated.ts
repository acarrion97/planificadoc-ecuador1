// Archivo generado por scripts/manual-chunks.mjs — no editar a mano.
export interface ManualChunk {
  capId: string;
  capTitulo: string;
  seccion: string | null;
  seccionId: string | null;
  texto: string;
}

export const MANUAL_CHUNKS: ManualChunk[] = [
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.1. Propósito",
  "seccionId": "1-1-proposito",
  "texto": "El presente manual describe el funcionamiento de **PlanificaDoc Ecuador**, plataforma web de planificación curricular asistida por inteligencia artificial (IA), y orienta al personal docente en el uso de cada uno de sus módulos: desde el acceso al sistema hasta la generación, gestión y exportación de los documentos de planificación."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.2. Alcance",
  "seccionId": "1-2-alcance",
  "texto": "El manual abarca la versión 1.0 de la aplicación web y comprende los siguientes componentes:\n\n- Acceso al sistema: inicio de sesión, registro, ingreso con código, recuperación de contraseña y suscripción.\n- Navegación general: Inicio, Explorar, Crear, Mis planes, Mi cuenta y Ayuda.\n- Módulos de planificación: plan diario, plan semanal, PCA anual, PCT trimestral, Conecta Nivela y Crea, evaluación diagnóstica, proyecto interdisciplinar, Bachillerato Técnico, currículo por competencias, Educación Inicial, Preparatoria y adaptación curricular.\n- Exportación de documentos, solución de problemas, glosario y canales de soporte.\n\nNo forman parte de este documento las funciones de administración interna de la plataforma ni los procesos de facturación del proveedor de pagos."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.3. Público objetivo",
  "seccionId": "1-3-publico-objetivo",
  "texto": "Este manual está dirigido a docentes de Educación Inicial, Preparatoria, Educación General Básica (EGB), Bachillerato General Unificado (BGU) y Bachillerato Técnico (BT) del Sistema Nacional de Educación del Ecuador, así como a directivos y coordinadores pedagógicos que revisan las planificaciones. Para su uso se requiere únicamente manejo básico de un navegador web y de un procesador de textos."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.4. Descripción general del sistema",
  "seccionId": "1-4-descripcion-general-del-sistema",
  "texto": "PlanificaDoc es una aplicación web orientada a reducir el tiempo que el docente dedica a la elaboración de documentos de planificación, sin sustituir su criterio pedagógico. El sistema integra el banco de destrezas con criterios de desempeño del Currículo Priorizado del MINEDUC, los formatos oficiales de planificación y un asistente de inteligencia artificial que propone contenidos coherentes con los datos que el docente ingresa.\n\nEl flujo de trabajo general es el mismo en todos los módulos:\n\n- **Contextualización:** el docente registra los datos informativos (institución, año lectivo, grado o curso, paralelo, área o asignatura, docente) que se reutilizan en el documento final.\n- **Selección curricular:** se eligen los elementos del currículo que se trabajarán (destrezas con criterios de desempeño, criterios de evaluación, competencias o resultados de aprendizaje), tomados directamente del currículo oficial cargado en el sistema.\n- **Generación asistida:** la IA elabora una propuesta de objetivos, actividades, recursos, estrategias de evaluación y medidas de inclusión, respetando la estructura del formato oficial correspondiente.\n- **Revisión y ajuste:** el docente revisa, edita o regenera cada apartado antes de guardarlo.\n- **Gestión y exportación:** el documento queda almacenado en **Mis planes** y puede descargarse en Word o PDF para su firma y presentación ante la autoridad institucional."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.4. Descripción general del sistema",
  "seccionId": "1-4-descripcion-general-del-sistema",
  "texto": "De esta manera, PlanificaDoc apoya los tres niveles de concreción curricular: la planificación mesocurricular (PCA y PCT), la planificación microcurricular (planes diarios, semanales, de Inicial y de Preparatoria) y los instrumentos complementarios establecidos para el año lectivo 2026-2027 (Conecta Nivela y Crea, evaluación diagnóstica, proyectos interdisciplinarios, currículo por competencias y adaptaciones curriculares).\n\n> **Importante:** PlanificaDoc es una herramienta de apoyo. La responsabilidad sobre la pertinencia, veracidad y adecuación de los documentos al contexto institucional y a las necesidades de los estudiantes corresponde al docente y a las instancias de revisión de la institución educativa."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.5. Normativa y documentos de referencia",
  "seccionId": "1-5-normativa-y-documentos-de-referencia",
  "texto": "La estructura y redacción de este manual siguen las recomendaciones de la norma internacional para información de usuario; los contenidos pedagógicos que genera el sistema se basan en la normativa del Ministerio de Educación (MINEDUC) detallada a continuación."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.5. Normativa y documentos de referencia",
  "seccionId": "1-5-normativa-y-documentos-de-referencia",
  "texto": "| **Documento** | **Aplicación en este manual / en el sistema** |\n| --- | --- |\n| ISO/IEC/IEEE 26514:2022 — Ingeniería de sistemas y software: diseño y desarrollo de información para usuarios | Estructura del manual, redacción de procedimientos en pasos numerados, convenciones tipográficas, avisos y glosario. |\n| MINEDUC — Lineamientos de inicio de año lectivo 2026-2027, régimen Sierra-Amazonía | Programa Conecta Nivela y Crea, evaluación diagnóstica y currículo por competencias (plan piloto). |\n| MINEDUC — Currículo Priorizado (Preparatoria, Elemental, Media, Superior y Bachillerato) | Banco de destrezas con criterios de desempeño (DCD) utilizado por el buscador y por los módulos de planificación. |\n| MINEDUC — Currículo Nacional de Primera Infancia y Currículo Priorizado de Educación Inicial | Planificación de Educación Inicial y currículo por competencias para Inicial y Preparatoria. |\n| MINEDUC — Adaptaciones curriculares para la oferta educativa de jóvenes y adultos con escolaridad inconclusa (EGB y Bachillerato) | Referencia para docentes de ofertas extraordinarias. El módulo de adaptación curricular para estudiantes con necesidades educativas específicas (NEE) aplica los principios del Diseño Universal para el Aprendizaje (DUA) previstos en los formatos oficiales de planificación. |\n| MINEDUC — Caracterización de las familias y figuras profesionales del Bachillerato Técnico | Módulo de Bachillerato Técnico: figuras profesionales, módulos formativos y resultados de aprendizaje. |\n| MINEDUC — Formatos oficiales de planificación microcurricular (EGB y BGU; Inicial y Preparatoria) | Estructura de los documentos Word y PDF que exporta el sistema. |"
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.6. Convenciones del documento",
  "seccionId": "1-6-convenciones-del-documento",
  "texto": "Para facilitar la lectura se emplean las siguientes convenciones:\n\n| **Convención** | **Significado** | **Ejemplo** |\n| --- | --- | --- |\n| **Negrita** | Botones, opciones de menú, pestañas y nombres de campos de la interfaz. | Haga clic en **Generar** **planificación**. |\n| “Comillas” | Textos o mensajes que el sistema muestra en pantalla. | “Contraseña actualizada”. |\n| Ruta con «›» | Secuencia de navegación entre opciones. | **Crear › Plan de área › PCA Anual** |\n| Pasos numerados | Procedimientos que deben seguirse en el orden indicado. | 1. Ingrese su correo… |\n| Figura N | Captura de pantalla de referencia, numerada en orden de aparición. | Figura 12. Resultado del plan diario. |\n\nAdemás, el manual utiliza los siguientes recuadros de aviso:\n\n> **Nota:** información complementaria que ayuda a comprender el funcionamiento de una opción.\n\n> **Consejo:** recomendación práctica para trabajar de forma más rápida o con mejores resultados.\n\n> **Importante:** condición que debe cumplirse para evitar errores o pérdida de información."
 },
 {
  "capId": "1-introduccion",
  "capTitulo": "1. Introducción",
  "seccion": "1.7. Códigos de color de la interfaz",
  "seccionId": "1-7-codigos-de-color-de-la-interfaz",
  "texto": "PlanificaDoc emplea una paleta de colores institucional que se mantiene en todas las pantallas. Reconocer su significado facilita la interpretación de los estados y acciones del sistema:\n\n|  |  |\n| --- | --- |\n| **Azul de marca** `#003366` | Opción activa del menú lateral, botones principales (por ejemplo **Nueva** **planificación**) y títulos. |\n| **Azul primario** `#1B5E9E` | Enlaces, botones de acción secundarios, íconos y códigos de destreza. |\n| **Verde** `#16A34A` | Estados correctos o activos (por ejemplo, “Activo” en Mi cuenta) y confirmaciones. |\n\n|  |  |\n| --- | --- |\n| **Ámbar** `#D97706` | Advertencias y datos que requieren revisión antes de continuar. |\n| **Rojo** `#DC2626` | Errores de validación y acciones destructivas como **Eliminar** o **Cerrar** **sesión**. |\n| **Gris** `#64748B` | Textos secundarios, descripciones y opciones no disponibles (deshabilitadas). |\n\n> **Nota:** la aplicación dispone de tema Claro, Oscuro y Sistema (véase la sección Mi cuenta). En el tema oscuro el fondo cambia a azul marino y los colores se aclaran para conservar el contraste; su significado no cambia."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": null,
  "seccionId": null,
  "texto": "Este capítulo describe lo que usted necesita para trabajar con PlanificaDoc y los procedimientos para crear su cuenta, ingresar, recuperar la contraseña, activar el acceso mediante una suscripción o un código institucional y cerrar la sesión. Todas estas operaciones se realizan desde la pantalla de acceso, que es lo primero que muestra la aplicación cuando no existe una sesión activa en el dispositivo."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.1. Requisitos previos",
  "seccionId": "2-1-requisitos-previos",
  "texto": "PlanificaDoc es una aplicación web: no requiere instalación y se utiliza desde el navegador. La generación de contenidos con inteligencia artificial (IA) y el almacenamiento de las planificaciones se realizan en línea, por lo que la calidad de la conexión influye directamente en el tiempo de respuesta. Verifique que su equipo cumpla los siguientes requisitos antes de comenzar:\n\n| **Elemento** | **Requisito** |\n| --- | --- |\n| Dispositivo | Computadora, tableta o teléfono inteligente. Se recomienda una computadora para los módulos con formularios extensos (PCA, PCT, CNC), porque en pantallas anchas la aplicación muestra el menú lateral permanente y aprovecha mejor el espacio de trabajo. |\n| Navegador | Versión actualizada de Google Chrome, Microsoft Edge, Mozilla Firefox o Safari. Mantenga habilitadas las ventanas emergentes para PlanificaDoc: el pago con PayPhone se abre en una pestaña nueva. |\n| Conexión | Acceso a internet estable; la generación con IA se realiza en línea y puede tardar varios segundos en documentos extensos. |\n| Cuenta | Correo electrónico válido y contraseña de al menos 6 caracteres, o un código de acceso entregado por su institución. |\n| Suscripción | Plan mensual o anual activo, o código de acceso vigente. |\n| Software complementario | Microsoft Word 2016 o superior (o LibreOffice Writer) para editar los documentos exportados, y un lector de PDF para revisarlos o imprimirlos. |\n\n> **Consejo:** utilice siempre el mismo correo electrónico para registrarse, suscribirse y recuperar la contraseña. El sistema asocia la suscripción al correo con el que usted inició el pago."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.2. Pantalla de acceso",
  "seccionId": "2-2-pantalla-de-acceso",
  "texto": "Al abrir PlanificaDoc se presenta la pantalla de acceso. En pantallas anchas (computadora) se organiza en dos columnas: en el panel izquierdo se muestran el nombre y el lema de la plataforma, el recuadro **¿Qué obtienes?** con los beneficios principales (catálogo de destrezas del currículo nacional, generación de planes con IA, PCA y PCT con exportación a Word y PDF, Diseño Universal para el Aprendizaje integrado y acceso a las actualizaciones) y un resumen de los precios de los planes anual y mensual. En el panel derecho se encuentra la tarjeta de acceso con tres pestañas: **Ingresar**, **Registrarse** y **Código**. En el teléfono, los beneficios y los precios se muestran debajo de la tarjeta de acceso.\n\nAl pie de la tarjeta está el enlace **¿Necesitas ayuda? WhatsApp**, que abre una conversación con el equipo de soporte con un mensaje ya redactado sobre la suscripción.\n\n*Figura 1. Pantalla de acceso con las pestañas Ingresar, Registrarse y Código.*\n\n| **Pestaña** | **Cuándo utilizarla** |\n| --- | --- |\n| **Ingresar** | Usted ya tiene una cuenta creada con correo y contraseña. Desde esta pestaña también se inicia la recuperación de la contraseña. |\n| **Registrarse** | Es la primera vez que usa PlanificaDoc y desea crear una cuenta propia para luego elegir un plan de suscripción. |\n| **Código** | Su institución educativa o el equipo de PlanificaDoc le entregó un código de acceso; no necesita correo ni contraseña. |"
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.3. Iniciar sesión",
  "seccionId": "2-3-iniciar-sesion",
  "texto": "Utilice este procedimiento cada vez que necesite ingresar desde un dispositivo nuevo o después de haber cerrado la sesión.\n\n1. Seleccione la pestaña **Ingresar**.\n2. Escriba su **Correo electrónico** y su **Contraseña**. Puede pulsar el ícono del ojo, a la derecha del campo, para mostrar u ocultar la contraseña y comprobar que la escribió correctamente.\n3. Haga clic en **Iniciar Sesión**. Mientras el sistema verifica los datos, el botón muestra un indicador de carga.\n4. Si su cuenta tiene una suscripción activa, se muestra el mensaje “¡Acceso Activado!” y se carga la pantalla de Inicio. Si la cuenta existe pero aún no tiene suscripción, el sistema lo lleva a la pantalla **Elige tu plan** (véase la sección Suscripción y activación del acceso).\n\nEl sistema valida los datos antes de enviarlos y muestra el motivo del problema debajo de los campos:\n\n| **Mensaje en pantalla** | **Causa y acción recomendada** |\n| --- | --- |\n| “Ingresa tu correo” / “Ingresa tu contraseña” | Uno de los campos está vacío. Complételo y vuelva a intentarlo. |\n| “No encontramos una cuenta con ese correo. ¿Quieres crear una?” | El correo no está registrado. Revise que esté bien escrito o regístrese en la pestaña **Registrarse**. |\n| “Correo o contraseña incorrectos” | La contraseña no coincide. Vuelva a escribirla o utilice **¿Olvidaste tu contraseña?** |\n\n> **Importante:** si aún no dispone de una cuenta, regístrese primero (véase la sección siguiente). Si el sistema responde “No encontramos una cuenta con ese correo”, verifique que el correo esté bien escrito."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.4. Registrarse",
  "seccionId": "2-4-registrarse",
  "texto": "El registro crea su cuenta personal en PlanificaDoc. La cuenta es el contenedor de todas sus planificaciones y de su suscripción, por lo que se recomienda que cada docente tenga la suya.\n\n1. Seleccione la pestaña **Registrarse** o haga clic en el enlace **¿No tienes cuenta? Regístrate aquí**.\n2. Complete el campo **Nombre completo** (nombres y apellidos), el **Correo electrónico** y una **Contraseña** de al menos 6 caracteres.\n3. Repita la contraseña en el campo **Confirmar contraseña**.\n4. Haga clic en **Crear Cuenta**. Si los datos son válidos, el sistema crea la cuenta y lo dirige a la pantalla **Elige tu plan** para activar la suscripción.\n\n*Figura 2. Formulario de registro de un nuevo usuario.*"
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.4.1. Descripción de los campos",
  "seccionId": "2-4-1-descripcion-de-los-campos",
  "texto": "| **Campo** | **Descripción** | **Validación del sistema** |\n| --- | --- | --- |\n| **Nombre completo** | Nombres y apellidos del docente (por ejemplo, María González). | Obligatorio. Mensaje: “Ingresa tu nombre completo”. |\n| **Correo electrónico** | Correo al que se asociarán la cuenta, la suscripción y los códigos de recuperación. | Obligatorio y con formato válido. Mensaje: “Correo inválido”. |\n| **Contraseña** | Clave personal de acceso. | Mínimo 6 caracteres. Mensaje: “La contraseña debe tener al menos 6 caracteres”. |\n| **Confirmar contraseña** | Repetición de la contraseña para evitar errores de digitación. | Debe coincidir con la anterior. Mensaje: “Las contraseñas no coinciden”. |\n\n> **Nota:** si el correo ya se encuentra registrado, el sistema cambia a la pestaña Ingresar, deja escrito el correo y muestra el mensaje “Ya tienes una cuenta con ese correo. Ingresa tu contraseña.”"
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.5. Ingresar con código de acceso",
  "seccionId": "2-5-ingresar-con-codigo-de-acceso",
  "texto": "Las instituciones o usuarios que disponen de un código de acceso pueden ingresar sin correo ni contraseña. Esta modalidad está pensada para convenios institucionales en los que la unidad educativa distribuye un código a sus docentes.\n\n1. Seleccione la pestaña **Código**.\n2. Escriba en el campo **Código de acceso** el código entregado por su institución (por ejemplo, DOCENTE001). El sistema convierte automáticamente las letras a mayúsculas.\n3. Haga clic en **Activar Acceso**. Si el código es válido, se muestra “¡Acceso Activado!” y se carga la aplicación. En **Mi cuenta** el método de acceso se mostrará como “Código de acceso”.\n\n*Figura 3. Pestaña Código con el campo Código de acceso y el botón Activar Acceso.*\n\nSi el campo está vacío, el sistema muestra “Ingresa tu código”; si el código no existe o está mal escrito, muestra “Código inválido. Verifica e intenta de nuevo.”\n\n> **Importante:** cada código admite un número limitado de dispositivos. Si se supera, el sistema muestra “Código bloqueado por exceso de dispositivos”; en ese caso comuníquese con soporte. No comparta su código con otras personas."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.6. Recuperar la contraseña",
  "seccionId": "2-6-recuperar-la-contrasena",
  "texto": "Si olvidó su contraseña, puede definir una nueva mediante un código de un solo uso que el sistema envía a su correo. El procedimiento se realiza en dos pantallas, ambas bajo la pestaña **Ingresar**.\n\n1. En la pestaña **Ingresar**, haga clic en **¿Olvidaste tu contraseña?** Si ya había escrito su correo, este aparece precargado.\n2. Escriba el correo electrónico asociado a su cuenta y haga clic en **Enviar código**.\n\n*Figura 4. Solicitud de recuperación de contraseña.*\n\nEl sistema confirma el envío con el mensaje “Si existe una cuenta con [su correo], recibirás un código de 6 dígitos. Revisa tu correo y la carpeta de spam.” Por seguridad, el mensaje es el mismo aunque el correo no esté registrado.\n\n1. Revise su bandeja de entrada (y la carpeta de correo no deseado) y copie el código de 6 dígitos recibido.\n2. En la pantalla **Restablecer contraseña**, escriba el código en el campo **Código de 6 dígitos**, la contraseña en **Nueva contraseña** (mínimo 6 caracteres) y repítala en **Confirmar nueva** **contraseña**.\n3. Haga clic en **Restablecer contraseña**. El sistema vuelve a la pestaña **Ingresar** con su correo precargado y muestra el mensaje “Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.”\n\n*Figura 5. Pantalla para restablecer la contraseña con el código de 6 dígitos.*\n\n4. Inicie sesión con la nueva contraseña.\n\n*Figura 6. Inicio de sesión con la contraseña restablecida.*\n\n> **Consejo:** si el código no llega, utilice el enlace ¿No recibiste el código? Reenviar. Para evitar envíos repetidos, el enlace se habilita nuevamente después de 60 segundos; mientras tanto muestra la cuenta regresiva. Si el código tiene menos o más de 6 dígitos, el sistema muestra “El código debe tener 6 dígitos”."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.7. Suscripción y activación del acceso",
  "seccionId": "2-7-suscripcion-y-activacion-del-acceso",
  "texto": "Para utilizar la plataforma se requiere una suscripción activa. La pantalla **Elige tu plan** aparece automáticamente después de registrarse o de iniciar sesión con una cuenta que aún no tiene suscripción; en la parte superior muestra el correo al que se asociará el pago. Los planes disponibles son los siguientes:\n\n| **Plan** | **Precio** | **Incluye** |\n| --- | --- | --- |\n| Mensual | USD 6,99 por mes; puede cancelarse en cualquier momento. | Planes diarios ilimitados, plan semanal (5 días), Educación Inicial completa, IA con enfoque Marzano y DUA, exportación a Word y PDF, soporte prioritario. El PCA y el PCT se adquieren como pago adicional por documento. |\n| Anual | USD 4,89 por mes, facturado anualmente (USD 58,71). | Todo lo del plan mensual, más PCA y PCT incluidos sin costo adicional, 12 meses continuos asegurados y soporte VIP. Ahorro de USD 25,17 al año frente al plan mensual. |\n\n> **Nota:** los precios corresponden a los vigentes a la fecha de elaboración de este manual y pueden variar.\n\nAl elegir el plan, considere el tipo de documentos que elaborará durante el año lectivo. Si prevé elaborar la Planificación Curricular Anual (PCA) y las planificaciones trimestrales (PCT) de sus asignaturas, el plan anual las incluye sin costo adicional. De forma predeterminada, la pantalla muestra seleccionado el plan anual.\n\nPara suscribirse:"
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.7. Suscripción y activación del acceso",
  "seccionId": "2-7-suscripcion-y-activacion-del-acceso",
  "texto": "1. En la pantalla **Elige tu plan**, haga clic en **Suscribirme ahora** (plan mensual) o en **Obtener plan** **anual**. El plan elegido se marca como “Seleccionado”.\n2. En **Datos de pago**, complete el **Nombre del titular**, la **Cédula de identidad** y el **Número de** **celular**.\n3. Haga clic en el botón **Pagar**, que muestra el valor a cancelar (por ejemplo, “Pagar $58.71” para el plan anual). El botón es verde para el plan anual y azul para el mensual.\n\n*Figura 7. Pantalla Elige tu plan con los planes mensual y anual y el formulario Datos de pago.*"
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.7.1. Descripción de los campos de pago",
  "seccionId": "2-7-1-descripcion-de-los-campos-de-pago",
  "texto": "| **Campo** | **Descripción** | **Validación del sistema** |\n| --- | --- | --- |\n| **Nombre del titular** | Nombre tal como aparece en la tarjeta con la que se realizará el pago. | Obligatorio. Mensaje: “Ingresa el nombre del titular”. |\n| **Cédula de identidad** | Número de identificación del titular (por ejemplo, 0912345678). Solo admite dígitos. | Mínimo 8 dígitos, máximo 13. Mensaje: “Ingresa tu cédula (mínimo 8 dígitos)”. |\n| **Número de celular** | Número de teléfono móvil del titular (por ejemplo, 0987654321). El sistema le agrega automáticamente el prefijo de Ecuador (+593). | Mínimo 9 dígitos. Mensaje: “Ingresa tu número de celular”. |\n\n1. Se abre, en una pestaña nueva, la ventana de pago seguro de **PayPhone** con el resumen de la suscripción. Elija el método de pago (tarjeta Visa o Mastercard, o PayPhone Wallet), ingrese los datos de la tarjeta y haga clic en **Pagar**.\n2. Regrese a PlanificaDoc. Al confirmarse el pago se muestra el mensaje “¡Acceso Activado!” y se carga la aplicación. Si el acceso no se activa automáticamente, haga clic en **Verificar mi pago**, bajo el separador “¿Ya pagaste?”.\n\n*Figura 8. Ventana de pago seguro de PayPhone con el resumen de la suscripción.*\n\n> **Nota:** la suscripción es recurrente: la tarjeta se guarda para la renovación automática al finalizar cada periodo. Puede cancelar la renovación en cualquier momento desde Mi cuenta. Solo se aceptan las tarjetas indicadas en el selector de PayPhone; si aparece “Tarjeta no soportada”, utilice otra tarjeta o PayPhone Wallet.\n\n> **Importante:** si acaba de pagar y el sistema indica “Pago aún no confirmado”, espere unos segundos y vuelva a intentarlo. No repita el pago. Si el problema persiste, utilice el enlace de ayuda por WhatsApp que aparece al final de la pantalla."
 },
 {
  "capId": "2-requisitos-y-acceso-al-sistema",
  "capTitulo": "2. Requisitos y acceso al sistema",
  "seccion": "2.8. Cerrar sesión",
  "seccionId": "2-8-cerrar-sesion",
  "texto": "Cierre la sesión cuando utilice un equipo compartido (por ejemplo, la sala de docentes o un laboratorio de la institución), para que otras personas no puedan ver ni modificar sus planificaciones.\n\n1. Ingrese a **Mi cuenta** desde el menú lateral.\n2. Haga clic en **Cerrar sesión** (texto en rojo, al final de la pantalla).\n3. Confirme la acción en el mensaje “¿Cerrar sesión? Deberás ingresar tu código o email nuevamente.” Para volver a ingresar necesitará su correo y contraseña, o su código."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": null,
  "seccionId": null,
  "texto": "Este capítulo presenta la organización de la aplicación: el menú de navegación y las seis secciones principales. La interfaz está diseñada por intención de uso: **Inicio** y **Explorar** sirven para consultar el currículo, **Crear** para elaborar documentos nuevos, **Mis planes** para gestionar lo ya elaborado, y **Mi** **cuenta** y **Ayuda** para la configuración y el soporte."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.1. Menú de navegación",
  "seccionId": "3-1-menu-de-navegacion",
  "texto": "El menú da acceso a las secciones principales desde cualquier pantalla, incluso desde el detalle de una destreza o desde el interior de un formulario. Su presentación depende del ancho de la pantalla:\n\n- **Computadora y tableta:** el menú lateral permanece visible a la izquierda. La opción activa se resalta en azul de marca y la opción **Crear** se destaca con un color propio, por ser la acción principal. El botón **‹** junto al nombre PlanificaDoc contrae el menú a una franja de íconos para ampliar el área de trabajo; el mismo control permite expandirlo de nuevo.\n- **Teléfono:** el menú se oculta en un encabezado con el botón de menú (tres líneas horizontales). Al pulsarlo se despliega un panel lateral con las mismas opciones, que se cierra al elegir una sección.\n\nLas opciones se agrupan en una zona principal (Inicio, Crear, Explorar y Mis planes) y una zona de gestión (Mi cuenta y Ayuda):\n\n| **Opción** | **Función** |\n| --- | --- |\n| **Inicio** | Buscador de destrezas por código o texto, acceso a las planificaciones recientes (bloque **Continuar**) y botón **Nueva planificación**. |\n| **Crear** | Catálogo de todos los tipos de planificación, organizados en seis categorías. |\n| **Explorar** | Navegación del currículo por nivel, área o ámbito, subnivel y bloque curricular. |\n| **Mis planes** | Listado de todas las planificaciones guardadas, con filtros y acciones de gestión. |\n| **Mi cuenta** | Estado del acceso, detalles de la suscripción, actividad, tema de la aplicación, comunidad de WhatsApp y cierre de sesión. |\n| **Ayuda** | Preguntas frecuentes con buscador, accesos directos y canales de soporte. |"
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.2. Inicio",
  "seccionId": "3-2-inicio",
  "texto": "Inicio es la pantalla que se muestra al ingresar. Está pensada para que usted llegue en pocos pasos a la destreza que desea planificar o retome un documento que dejó pendiente. Presenta tres elementos:\n\n- **Buscador de destrezas:** permite localizar cualquier destreza con criterio de desempeño (DCD) por su código (por ejemplo, M.3.1.1) o por una palabra de su enunciado. Debajo se indica el total de destrezas y el número de asignaturas disponibles.\n- **Continuar:** muestra hasta cinco planificaciones recientes (planes diarios, planes semanales, planes Conecta, Nivela y Crea y evaluaciones diagnósticas), ordenadas de la más reciente a la más antigua. Cada tarjeta indica el tipo de documento, el título y un dato de referencia (por ejemplo, el código de la destreza y la fecha). Al seleccionar una, se abre en el punto donde se dejó. El bloque no aparece si todavía no tiene planificaciones.\n- **Nueva planificación:** abre el catálogo **Crear**.\n\n*Figura 9. Pantalla de Inicio con el buscador de destrezas y el botón Nueva planificación.*"
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.2.1. Cómo se lee el código de una destreza",
  "seccionId": "3-2-1-como-se-lee-el-codigo-de-una-destreza",
  "texto": "En el currículo ecuatoriano cada elemento curricular tiene un código que indica a qué área, subnivel y bloque pertenece. En el Currículo Priorizado, el código de una destreza con criterio de desempeño se compone de cuatro partes separadas por puntos. Por ejemplo, en M.2.1.1:\n\n| **Parte** | **Significado** | **Ejemplo M.2.1.1** |\n| --- | --- | --- |\n| Área | Sigla del área o asignatura: M (Matemática), LL (Lengua y Literatura), CN (Ciencias Naturales), CS (Estudios Sociales), EF (Educación Física), ECA (Educación Cultural y Artística), EFL (Inglés), entre otras. | M = Matemática |\n| Subnivel | Número del subnivel o nivel: 1 Preparatoria, 2 Básica Elemental, 3 Básica Media, 4 Básica Superior, 5 Bachillerato. | 2 = Básica Elemental |\n| Bloque curricular | Número del bloque curricular al que pertenece la destreza dentro del área y subnivel. | 1 = bloque 1 |\n| Número de destreza | Número secuencial de la destreza dentro del bloque. | 1 = primera destreza |\n\nLa misma lógica se aplica a los demás elementos: el objetivo del subnivel se codifica con el prefijo O (O.M.2.1), el criterio de evaluación con CE (CE.M.2.1) y el indicador de evaluación con I (I.M.2.1.1). El documento Generalidades del currículo por competencias (EGB y BG) mantiene esta numeración de subniveles (0 Inicial, 1 Preparatoria, 2 Elemental, 3 Media, 4 Superior, 5 Bachillerato) y la aplica también a las competencias específicas y a los saberes; los Lineamientos de inicio de año lectivo 2026- 2027 señalan que comprender esta codificación es necesaria para planificar, enseñar y evaluar en el marco del nuevo currículo."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.2.2. Buscar una destreza",
  "seccionId": "3-2-2-buscar-una-destreza",
  "texto": "1. En el buscador de Inicio, escriba total o parcialmente el código (por ejemplo, M.3) o una palabra del enunciado (por ejemplo, fracciones). La búsqueda comienza a partir del segundo carácter.\n2. Revise la lista de resultados. El sistema muestra hasta 20 coincidencias con el código (resaltado con el color del área), el nombre del área y el enunciado de la destreza, y encima indica cuántos resultados encontró.\n3. Seleccione la destreza para ver su detalle y generar una planificación diaria (véase la sección Plan diario).\n\n*Figura 10. Resultados de la búsqueda de destrezas por código.*\n\nSi no hay coincidencias, el sistema muestra “No se encontraron destrezas para” seguido del texto buscado. Para borrar la búsqueda y volver a la vista inicial, pulse la **X** del extremo derecho del buscador."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.2.3. Detalle de la destreza",
  "seccionId": "3-2-3-detalle-de-la-destreza",
  "texto": "Al seleccionar una destreza, desde Inicio o desde Explorar, se abre su ficha de detalle. Esta pantalla reúne los elementos curriculares oficiales asociados a la destreza, de modo que usted pueda revisarlos antes de planificar:\n\n| **Elemento** | **Contenido** |\n| --- | --- |\n| Código y área | Código de la destreza y nombre del área, con el color que la identifica. |\n| Enunciado | Texto completo de la destreza con criterio de desempeño. |\n| **Subnivel** | Nombre del subnivel y grados que abarca (por ejemplo, Básica Media, de 5.° a 7.° grado de EGB). |\n| **Bloque Curricular** o **Ámbito de** **desarrollo** | Número y nombre del bloque. En Educación Inicial y Preparatoria se muestra el ámbito de desarrollo y aprendizaje, porque esos currículos se organizan por ámbitos y no por bloques. |\n| **Objetivos del Subnivel** | Objetivos del área para el subnivel con los que se relaciona la destreza. |\n| **Criterios de Evaluación** | Criterios de evaluación oficiales vinculados a la destreza. |\n| **Indicadores de Evaluación** | Indicadores de evaluación que describen el logro de aprendizaje esperado. |\n\nSegún el Currículo Priorizado, las destrezas con criterios de desempeño integran habilidades, contenidos y procedimientos de distinta complejidad, mientras que los indicadores de evaluación describen los logros que el estudiantado debe alcanzar en cada subnivel. Por ello, conviene revisar los criterios e indicadores antes de generar el plan: son la referencia para las actividades de evaluación que propondrá la IA."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.2.3. Detalle de la destreza",
  "seccionId": "3-2-3-detalle-de-la-destreza",
  "texto": "Al final de la ficha, el botón **Generar Planificación** abre el formulario del plan diario para esa destreza. En las destrezas de Educación Inicial, el botón abre el módulo de planificación de Inicial. Si el código no existe, el sistema muestra “Destreza no encontrada” y el botón **Volver**."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.3. Explorar",
  "seccionId": "3-3-explorar",
  "texto": "La sección Explorar permite recorrer el currículo sin conocer el código de la destreza. Es útil para revisar la secuencia de un área, ubicar las destrezas de un bloque curricular o preparar una planificación de largo plazo. Las tarjetas se agrupan en cuatro secciones que corresponden a los niveles y subniveles del Sistema Nacional de Educación, y cada tarjeta indica cuántas destrezas contiene.\n\n| **Sección** | **Organización** | **Qué contiene** |\n| --- | --- | --- |\n| Educación Inicial | Por grado (3 a 5 años) | Dos tarjetas: Inicial 1 (3 a 4 años) e Inicial 2 (4 a 5 años). Cada una abre directamente el listado de destrezas del grado, organizadas por ámbito de desarrollo. |\n| Preparatoria | Por ámbito (1.° de EGB) | Siete tarjetas, una por ámbito del currículo integrador: Identidad y Autonomía; Convivencia; Descubrimiento y comprensión del medio natural y cultural; Relaciones lógico-matemáticas; Comprensión y expresión oral y escrita; Comprensión y expresión artística; y Expresión corporal. |\n| Educación General Básica | Por área y subnivel | Matemática, Lengua y Literatura, Ciencias Naturales, Estudios Sociales, Educación Física, Educación Cultural y Artística e Inglés, con los subniveles Básica Elemental (2.° a 4.°), Básica Media (5.° a 7.°) y Básica Superior (8.° a 10.°). |\n| Bachillerato General Unificado | Por asignatura (1.° a 3.° BGU) | Las asignaturas comunes (Matemática, Lengua y Literatura, Educación Física, Educación Cultural y Artística, Inglés) y las propias del bachillerato, como Biología, Química, Física, Historia, Filosofía, Educación para la Ciudadanía y Emprendimiento y Gestión. |"
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.3. Explorar",
  "seccionId": "3-3-explorar",
  "texto": "La organización por ámbitos en Inicial y Preparatoria responde a los currículos oficiales de esos niveles: el Currículo Priorizado de Preparatoria y el de Educación Inicial se estructuran en ejes y ámbitos de desarrollo y aprendizaje, mientras que la Educación General Básica y el Bachillerato se organizan por áreas, subniveles y bloques curriculares.\n\n1. Haga clic en **Explorar** en el menú lateral.\n2. Seleccione la tarjeta de su interés dentro de la sección del nivel correspondiente (por ejemplo, **Matemática** en Educación General Básica).\n3. Si el área abarca varios subniveles, elija el subnivel en la pantalla **Selecciona un subnivel** (por ejemplo, **Básica Media**). En Bachillerato, Inicial y Preparatoria este paso se omite, porque la tarjeta ya corresponde a un único subnivel, grado o ámbito.\n4. Revise el listado de destrezas. Cada tarjeta muestra el código, el bloque curricular (o el ámbito) con su nombre y el enunciado.\n5. Elija la destreza que desea planificar para abrir su detalle.\n\n*Figura 11. Sección Explorar con las áreas agrupadas por nivel educativo.*\n\n*Figura 12. Selección de la destreza dentro del área.*\n\n> **Consejo:** para volver al nivel anterior utilice el enlace con la flecha ← de la parte superior (por ejemplo, ← Áreas o ← Matemática). En Preparatoria, el listado de un ámbito reúne destrezas de varias áreas; el área de cada una se indica en su tarjeta."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.4. Crear",
  "seccionId": "3-4-crear",
  "texto": "Crear es el punto único de entrada para elaborar cualquier planificación. Se accede desde el menú lateral o desde el botón **Nueva planificación** de Inicio. La pantalla, titulada **Nueva planificación**, muestra los módulos agrupados en seis categorías; junto al nombre de cada categoría se indica cuántos módulos contiene. Al seleccionar un módulo se abre su formulario en estado inicial.\n\nLas categorías siguen los niveles de concreción de la planificación curricular: el plan de área (PCA y PCT) organiza el trabajo del año o del trimestre, el plan de aula (diario y semanal) concreta las experiencias de aprendizaje, y las programaciones y los módulos contextuales responden a necesidades específicas. Los Lineamientos de inicio de año lectivo 2026-2027 destacan la planificación curricular trimestral y los proyectos interdisciplinarios como parte de la práctica docente del nuevo currículo por competencias.\n\n*Figura 13. Catálogo Crear con los módulos agrupados por categoría.*"
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.4. Crear",
  "seccionId": "3-4-crear",
  "texto": "| **Categoría** | **Módulo** | **Descripción** |\n| --- | --- | --- |\n| Plan de aula | Plan diario | Planificación diaria de un área a partir de una destreza. |\n|  | Plan semanal | Organiza los días de la semana y exporta a Word. |\n| Plan de área | PCA Anual | Planificación curricular anual del área. |\n|  | PCT Trimestral | Planificación curricular por trimestre. |\n| Programaciones | Conecta Nivela y Crea | Plan de nivelación para estudiantes con brechas de aprendizaje. |\n|  | Proyecto Interdisciplinar | Proyecto integrador con guía paso a paso. |\n|  | Bachillerato Técnico | Planificación por perfil de egreso y figuras profesionales. |\n| Currículo | Currículo por Competencias | Currículo por grado o para EGB/BGU. |\n| Niveles educativos | Inicial | Planificación para Educación Inicial. |\n|  | Preparatoria | Planificación para Educación Preparatoria. |\n| Contextuales | Adaptación curricular | Adapta una planificación existente a necesidades específicas. |\n|  | Evaluación diagnóstica | Diagnóstico inicial por grado o asignatura. |\n\n> **Nota:** el módulo Adaptación curricular aparece deshabilitado en el catálogo, con la leyenda “Requiere una planificación semanal o un plan de origen” y el enlace Ver ayuda, porque la adaptación parte de un documento existente. Se habilita al acceder desde el detalle de un plan diario o semanal, o desde una planificación de Currículo por Competencias marcada con estudiantes con NEE; en ese caso, la pantalla Crear muestra un aviso que indica desde qué documento llegó y que el módulo está disponible con ese contexto precargado. Del mismo modo, Plan diario conduce al buscador de Inicio, ya que parte de una destreza."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.5. Mis planes",
  "seccionId": "3-5-mis-planes",
  "texto": "Mis planes reúne todas las planificaciones guardadas, independientemente de su tipo: planes diarios y semanales, PCA, PCT, Conecta, Nivela y Crea, Bachillerato Técnico, Currículo por Competencias, proyectos interdisciplinarios y evaluaciones. Bajo el título se indica el número total de documentos. Esta sección es exclusivamente de gestión: para elaborar un documento nuevo utilice **Crear**.\n\nCada tarjeta muestra:\n\n- **Ícono:** en los planes diarios, los íconos de las competencias o inserciones curriculares asociadas a la destreza, los mismos que utiliza el Currículo Priorizado en sus mapas curriculares; en los demás documentos, el ícono del área o del tipo de plan.\n- **Tipo de documento:** Plan diario, Plan semanal, PCA, PCT, CNC, BT, Currículo, Proyecto o Evaluación.\n- **Estado:** en los tipos que lo registran, se muestra en ámbar cuando el documento está en progreso (por ejemplo, “Borrador”) y en verde cuando está completado (por ejemplo, “Generado”).\n- **Fecha de la última actualización**, con el prefijo “Act.”.\n- **Título y dato de referencia**, como el grado, la asignatura o el nombre del docente."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.5.1. Filtros",
  "seccionId": "3-5-1-filtros",
  "texto": "| **Filtro** | **Qué muestra** |\n| --- | --- |\n| **Todos** | Todos los documentos, ordenados del actualizado más recientemente al más antiguo. |\n| **Recientes** | Los documentos actualizados en los últimos 30 días. |\n| **En progreso** | Los documentos cuyo estado indica que no se han terminado, como los borradores. |\n| **Completados** | Los documentos cuyo estado indica que están terminados, como los generados. |\n\nLos filtros **En progreso** y **Completados** solo incluyen los tipos de documento que registran un estado (PCA, PCT, Conecta, Nivela y Crea, Currículo por Competencias, proyectos y evaluaciones); los planes diarios, semanales y de Bachillerato Técnico se consultan en **Todos** o **Recientes**. Si ningún documento coincide con el filtro elegido, se muestra un mensaje que lo indica."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.5.2. Acciones",
  "seccionId": "3-5-2-acciones",
  "texto": "| **Acción** | **Función** |\n| --- | --- |\n| **Continuar** | Botón principal de la tarjeta. Abre el plan donde lo dejó: su vista de detalle o su formulario. |\n| **Editar** | Reanuda el formulario del plan para modificar sus datos. Solo aparece en los tipos de documento que admiten reanudación. |\n| **Duplicar** | Crea una copia del plan con la fecha actual, que aparece como un documento independiente en el listado. |\n| **Eliminar** | Borra el plan después de una confirmación. |\n\nEn la computadora, al pasar el puntero sobre cada ícono de acción se muestra una breve descripción de su función.\n\n*Figura 14. Sección Mis planes con el listado de planificaciones y sus acciones.*\n\n> **Importante:** la eliminación de una planificación no puede deshacerse; el sistema lo advierte con el mensaje “¿Eliminar «[título]»? Esta acción no se puede deshacer.” Si necesita una variante de un plan (por ejemplo, para otro paralelo), utilice Duplicar en lugar de editar el original.\n\n> **Nota:** si todavía no tiene documentos, la sección muestra “Aún no tienes planes” y el botón Nueva planificación, que lo lleva al catálogo Crear."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.6. Mi cuenta",
  "seccionId": "3-6-mi-cuenta",
  "texto": "En Mi cuenta se consulta la información del usuario y de la suscripción, y se configuran las preferencias de la aplicación. La pantalla se organiza en los siguientes bloques:\n\n- **Estado de Acceso:** indica si el acceso está “Activo” (en verde) o “Inactivo” (en rojo) y el método utilizado. Con suscripción, muestra el método “Suscripción”, el correo asociado y la fecha de vencimiento; con código, muestra el método “Código de acceso”.\n- **Detalles de Suscripción:** plan contratado (Mensual o Anual), estado de la suscripción (Activa, Pago pendiente, Expirada o Cancelada), fecha de inicio, fecha de vencimiento, días restantes y si la **Renovación automática** está activada o desactivada. Si hay una tarjeta registrada, se muestra la marca con los últimos cuatro dígitos y el titular, en el apartado **Método de pago**.\n- **Mi Actividad:** contador de planificaciones generadas.\n- **Apariencia:** permite elegir el tema de la aplicación entre **Claro**, **Oscuro** o **Sistema** (se adapta a la configuración del dispositivo). El cambio se aplica de inmediato.\n- **Grupo exclusivo de WhatsApp:** acceso a la comunidad de docentes y al equipo de soporte.\n- **Cerrar sesión.**"
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.6.1. Cancelar la renovación automática",
  "seccionId": "3-6-1-cancelar-la-renovacion-automatica",
  "texto": "1. En **Mi cuenta**, ubique el bloque **Detalles de Suscripción**.\n2. Haga clic en **Cancelar renovación automática**. El botón solo aparece cuando la renovación está activada.\n3. Confirme la acción. El sistema advierte que su suscripción seguirá activa hasta la fecha de vencimiento; a partir de entonces no se realizará un nuevo cobro.\n\n*Figura 15. Sección Mi cuenta: estado de acceso, actividad, apariencia (Claro, Oscuro, Sistema), grupo de WhatsApp y cierre*\n\nde sesión.\n\n*Figura 16. Sección Mis planes con el tema oscuro activado.*\n\n> **Consejo:** el tema Oscuro reduce el brillo de la pantalla en jornadas largas de planificación nocturna. La opción Sistema sigue automáticamente la configuración de claro u oscuro de su dispositivo."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.7. Ayuda",
  "seccionId": "3-7-ayuda",
  "texto": "La sección Ayuda reúne, en una sola pantalla, las respuestas a las dudas más frecuentes sobre el uso de PlanificaDoc. En la parte superior hay un buscador (**Buscar en las preguntas frecuentes**) que filtra las preguntas por cualquier palabra de la pregunta o de la respuesta. Al pulsar una pregunta se despliega su respuesta y, cuando corresponde, un enlace directo a la sección del sistema de la que trata.\n\n*Figura 17. Preguntas frecuentes en la sección Ayuda.*\n\nLas preguntas frecuentes disponibles abordan los siguientes temas:\n\n| **Pregunta** | **Enlace directo** |\n| --- | --- |\n| ¿Cómo creo una planificación? | Ir al catálogo Crear |\n| ¿Cuál es la diferencia entre el PCA y el PCT? | Ver Plan de área en Crear |\n| ¿Cómo continúo una planificación que empecé? | Abrir Mis planes |\n| ¿Dónde están mis planes guardados? | Ir a Mis planes |\n| ¿Cómo planifico desde una destreza? | Explorar áreas |\n| ¿Qué necesito para crear una Adaptación curricular? | Ver el módulo en Crear |\n| ¿Qué hace la Evaluación diagnóstica y cómo la inicio? | Ir a Evaluación diagnóstica |\n| ¿Cómo exporto mis documentos? | Ver Mis planes |\n| ¿Qué funciones requieren una suscripción Premium? | Abrir Mi cuenta |\n\nSi la búsqueda no encuentra coincidencias, se muestra el mensaje “Sin resultados para” seguido del texto buscado, con la sugerencia de probar otra palabra o contactar con soporte.\n\nAl final de la pantalla se encuentran los accesos directos a la plataforma (**Crear planificación**, **Explorar** **destrezas**, **Mis planes** y **Mi cuenta**) y el apartado **¿No resolviste tu caso?** con los canales de soporte técnico: el botón **Contactar soporte**, que abre un correo dirigido a soporte@planificadoc.app, y el botón **Grupo de WhatsApp**, que abre la comunidad de docentes."
 },
 {
  "capId": "3-descripcion-general-de-la-interfaz",
  "capTitulo": "3. Descripción general de la interfaz",
  "seccion": "3.7. Ayuda",
  "seccionId": "3-7-ayuda",
  "texto": "*Figura 18. Accesos directos y canales de soporte en la sección Ayuda.*\n\n> **Consejo:** al escribir a soporte, indique el correo de su cuenta, el módulo en el que trabajaba y el mensaje que mostró el sistema. Esto agiliza la atención de su caso."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": null,
  "seccionId": null,
  "texto": "Este capítulo reúne los conceptos del sistema educativo ecuatoriano que PlanificaDoc utiliza en sus formularios y documentos. No reemplaza a la normativa oficial: resume, con fines de orientación, lo que establecen los documentos del Ministerio de Educación, Deporte y Cultura (MINEDEC, antes MINEDUC) citados en cada apartado. Se recomienda leerlo antes de elaborar su primera planificación, especialmente si usted participa en el Programa Piloto del Currículo Nacional por Competencias."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.1. Sistema Nacional de Educación: niveles y subniveles",
  "seccionId": "4-1-sistema-nacional-de-educacion-niveles-y-subniveles",
  "texto": "El Reglamento General a la Ley Orgánica de Educación Intercultural (2023), citado en el Currículo Priorizado, establece que la educación formal para estudiantes en edad escolar se imparte en tres niveles: **Inicial**, **Básica** (Educación General Básica, EGB) y **Bachillerato**. La EGB se organiza a su vez en subniveles, y el Bachillerato General ofrece las opciones en Ciencias y Técnico, según los Lineamientos pedagógicos para el inicio del año lectivo 2026-2027.\n\nLa tabla siguiente resume la organización por grados y las edades referenciales. Las edades de Preparatoria, Elemental y Media provienen de los Lineamientos 2026-2027; las de Inicial, de los currículos de ese nivel. La última columna indica el número con que el Currículo Nacional por Competencias codifica cada nivel o subnivel (véase el apartado sobre codificación).\n\n| **Nivel** | **Subnivel** | **Grado o curso** | **Edad** **referencial** | **Código** |\n| --- | --- | --- | --- | --- |\n| Educación Inicial | Inicial 1 | Primer año de Inicial | 3 a 4 años | 0 |\n| Educación Inicial | Inicial 2 | Segundo año de Inicial | 4 a 5 años | 0 |\n| Educación General Básica | Preparatoria | 1.º de EGB | 5 a 6 años | 1 |\n| Educación General Básica | Básica Elemental | 2.º, 3.º y 4.º de EGB | 6 a 8 años | 2 |\n| Educación General Básica | Básica Media | 5.º, 6.º y 7.º de EGB | 9 a 11 años | 3 |\n| Educación General Básica | Básica Superior | 8.º, 9.º y 10.º de EGB | 12 a 14 años | 4 |\n| Bachillerato | Bachillerato General Unificado (BGU), opción Ciencias | 1.º, 2.º y 3.º de Bachillerato | 15 a 17 años | 5 |\n| Bachillerato | Bachillerato Técnico (BT) | 1.º, 2.º y 3.º de Bachillerato | 15 a 17 años | 5 |"
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.1. Sistema Nacional de Educación: niveles y subniveles",
  "seccionId": "4-1-sistema-nacional-de-educacion-niveles-y-subniveles",
  "texto": "> En PlanificaDoc el subnivel se elige en los formularios con los nombres Inicial 1, Inicial 2, Preparatoria, Básica Elemental, Básica Media, Básica Superior y Bachillerato. Las edades de Básica Superior y Bachillerato son referenciales: corresponden a la trayectoria regular sin rezago.\n\nAdemás de estas ofertas ordinarias, los Lineamientos 2026-2027 mencionan el Bachillerato Técnico Productivo (un año adicional y optativo de 1.200 horas, posterior al título de bachiller), el Bachillerato Complementario en Artes (impartido en conservatorios) y la Educación Multigrado, en la que un mismo docente atiende simultáneamente a estudiantes de varios grados. Existe también la oferta para personas jóvenes, adultas y adultas mayores con escolaridad inconclusa, que cuenta con adaptaciones curriculares propias."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.1.1. El Bachillerato Técnico",
  "seccionId": "4-1-1-el-bachillerato-tecnico",
  "texto": "Según el Reglamento General a la LOEI, citado en el Acuerdo MINEDUC-MINEDUC-2025-00031-A, la formación del Bachillerato Técnico se fundamenta en competencias y se estructura sobre la base de módulos formativos de figuras profesionales, asignaturas del tronco común y menciones. Las figuras profesionales se agrupan en familias profesionales definidas según las vocaciones productivas de cada territorio; por ejemplo, la familia Tecnologías agrupa las figuras de Soporte Informático, Seguridad Informática, Redes y Telecomunicaciones, Ciencia de Datos y Desarrollo de Software.\n\nCada figura se describe mediante unidades de competencia, desglosadas en elementos de competencia y criterios de desempeño, y cada unidad se relaciona con un módulo formativo. La formación se completa con el módulo de Formación en Centros de Trabajo (FCT), que según los Lineamientos 2026-2027 tiene una duración de 160 horas reloj en una entidad receptora. El módulo **Bachillerato Técnico** de PlanificaDoc solicita justamente la figura profesional, el módulo formativo, su objetivo y, de manera opcional, la unidad de competencia y el resultado de aprendizaje."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.2. Niveles de concreción curricular",
  "seccionId": "4-2-niveles-de-concrecion-curricular",
  "texto": "El currículo nacional se lleva al aula en tres niveles sucesivos de concreción. Cada nivel toma como referencia al anterior y lo ajusta a un contexto más específico: del país a la institución, y de la institución al grupo de estudiantes. Este principio se apoya en la autonomía y flexibilidad pedagógica que el Currículo Priorizado reconoce a las instituciones educativas para concretar y adaptar el currículo a las necesidades de sus estudiantes y a su contexto social y cultural.\n\n- **Primer nivel (macrocurrículo):** es el currículo nacional obligatorio que emite la Autoridad Educativa Nacional. Hoy coexisten el Currículo Priorizado con énfasis en competencias comunicacionales, matemáticas, digitales y socioemocionales (Acuerdo MINEDUC-MINEDUC- 2023-00008-A) y el Currículo Nacional por Competencias que se aplica en el Programa Piloto 2026-2027.\n- **Segundo nivel (mesocurrículo):** corresponde a la institución educativa. Comprende el Proyecto Curricular Institucional (PCI), que concreta el currículo nacional según la realidad de la institución, y la Planificación Curricular Anual (PCA), que cada área o asignatura elabora para organizar el año lectivo.\n- **Tercer nivel (microcurrículo):** es la planificación que el docente elabora para su grupo: planificación de unidad o trimestral, semanal y diaria o de clase, junto con las adaptaciones curriculares individuales. En el Programa Piloto se denomina **planificación microcurricular** y su formato oficial se organiza por trimestre y semanas.\n\nLa tabla siguiente muestra a qué nivel de concreción pertenece cada documento que genera PlanificaDoc."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.2. Niveles de concreción curricular",
  "seccionId": "4-2-niveles-de-concrecion-curricular",
  "texto": "| **Nivel de** **concreción** | **Responsable** | **Documento oficial** | **Módulo de PlanificaDoc** |\n| --- | --- | --- | --- |\n| Macro | MINEDEC | Currículo Priorizado; Currículo Nacional por Competencias | No se elabora en la app; sus destrezas, competencias e indicadores alimentan los buscadores y catálogos |\n| Meso | Institución educativa (Junta Académica, áreas) | Proyecto Curricular Institucional (PCI) | No disponible como módulo; la PCA se elabora tomando el PCI como referencia |\n| Meso | Área o asignatura | Planificación Curricular Anual (PCA) | **Crear › Plan de área › PCA Anual** |\n| Meso y micro | Área o docente | Planificación Curricular Trimestral (PCT) | **Crear › Plan de área › PCT** **Trimestral** |\n| Micro | Docente | Planificación microcurricular del Programa Piloto | **Crear › Currículo › Currículo por** **Competencias** |\n| Micro | Docente | Planificación semanal y diaria o de clase | **Crear › Plan de aula › Plan** **semanal** y **Plan diario**; **Crear ›** **Niveles educativos › Inicial** y **Preparatoria** |\n| Micro | Docente | Proyectos interdisciplinarios; nivelación de inicio de año | **Crear › Programaciones › Proyecto** **Interdisciplinar** y **Conecta Nivela y** **Crea** |\n| Micro | Docente, con apoyo del DECE | Adaptación curricular individual; evaluación diagnóstica | **Crear › Contextuales › Adaptación** **curricular** y **Evaluación diagnóstica** |\n\n> Mantenga la coherencia vertical entre niveles: las destrezas o competencias de su plan diario deben provenir de la unidad de la PCA o de la PCT vigente, y estas, a su vez, del currículo nacional. Esto facilita la revisión por parte de la autoridad institucional."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.3. El Currículo Priorizado y la destreza con criterio de desempeño",
  "seccionId": "4-3-el-curriculo-priorizado-y-la-destreza-con-criterio-de-desempeno",
  "texto": "En 2021 el Ministerio expidió, mediante la Resolución MINEDUC-SFE-2021-00008-R, el Currículo Priorizado con énfasis en competencias comunicacionales, matemáticas, digitales y socioemocionales, elaborado a partir del currículo nacional de 2016. En 2023, mediante el Acuerdo MINEDUC-MINEDUC- 2023-00008-A, se lo declaró aplicable a las instituciones de todos los sostenimientos y modalidades, como una propuesta que puede contextualizarse en el marco de la autonomía responsable. Es el currículo que utilizan los módulos de plan diario, semanal, PCA y PCT de PlanificaDoc.\n\nEl Currículo Priorizado organiza los aprendizajes de cada área y subnivel en tres elementos relacionados, presentados en columnas en sus mapas curriculares:\n\n- **Criterio de evaluación:** enunciado amplio que expresa el tipo y grado de aprendizaje que se espera alcanzar; agrupa varias destrezas. Se identifica con el prefijo CE, por ejemplo CE.M.2.1.\n- **Destreza con criterio de desempeño (DCD):** según el Currículo Priorizado, se estructura por habilidades, contenidos de aprendizaje y procedimientos de diferente nivel de complejidad, para que el estudiante aplique lo aprendido en su vida cotidiana. Es la unidad con la que se planifica la clase.\n- **Indicador de evaluación:** descriptor del logro de aprendizaje que el estudiante debe alcanzar; se identifica con el prefijo I. Entre paréntesis suele indicar los valores del perfil de salida con los que se relaciona, por ejemplo (S.2.) o (I.1.)."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.3.1. Estructura del código de una destreza",
  "seccionId": "4-3-1-estructura-del-codigo-de-una-destreza",
  "texto": "Cada DCD tiene un código único que permite ubicarla en el currículo. Tome como ejemplo la destreza M.2.1.1 del Currículo Priorizado de Básica Elemental, “Representar gráficamente conjuntos y subconjuntos, discriminando las propiedades o atributos de los objetos”:\n\n| **Parte del código** | **Valor en el** **ejemplo** | **Significado** |\n| --- | --- | --- |\n| Área | M | Matemática. Otras siglas: LL (Lengua y Literatura), CN (Ciencias Naturales), CS (Ciencias Sociales), EF (Educación Física), ECA (Educación Cultural y Artística), EFL (Inglés) |\n| Subnivel | 2 | Básica Elemental (3 corresponde a Media, 4 a Superior y 5 a Bachillerato) |\n| Bloque curricular | 1 | Primer bloque del área en ese subnivel |\n| Número de destreza | 1 | Posición de la destreza dentro del bloque |\n\nEl criterio de evaluación y los indicadores asociados siguen la misma lógica: CE.M.2.1 es el primer criterio de evaluación de Matemática en Elemental, e I.M.2.1.1 es el primer indicador de ese criterio. Así, la destreza M.2.1.1 se evalúa con el criterio CE.M.2.1 y se verifica con indicadores como I.M.2.1.1, “Discrimina propiedades de los objetos y obtiene subconjuntos de un conjunto universo”.\n\n> La sigla CE no significa lo mismo en los dos currículos vigentes. En el Currículo Priorizado, CE identifica un criterio de evaluación; en el Currículo Nacional por Competencias, identifica una competencia específica. Verifique siempre con qué currículo está trabajando."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.3.2. Inserciones curriculares y ejes transversales",
  "seccionId": "4-3-2-inserciones-curriculares-y-ejes-transversales",
  "texto": "El Currículo Priorizado incorpora inserciones curriculares, es decir, destrezas y contenidos que se abordan de manera transversal en las áreas: Educación Socioemocional, Educación Financiera, Educación para el Desarrollo Sostenible, Educación para la Seguridad Vial y la Movilidad Sostenible, y Educación Cívica, Ética e Integridad, esta última con un espacio propio en la hora de Cívica y Acompañamiento Integral en el aula (códigos CAI). En el documento del plan diario, PlanificaDoc presenta estos temas en la sección **Inserciones Curriculares (Ejes Transversales)**."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.4. Modelos pedagógicos ERCA y ACC",
  "seccionId": "4-4-modelos-pedagogicos-erca-y-acc",
  "texto": "Las actividades de una clase se organizan en momentos o fases que siguen una secuencia didáctica. PlanificaDoc trabaja con dos modelos de amplio uso en la planificación docente ecuatoriana. Los documentos oficiales incluidos como referencia para este manual no los definen de forma expresa, por lo que a continuación se ofrece una descripción general.\n\n| **Modelo** | **Fase** | **Propósito de la fase** |\n| --- | --- | --- |\n| ERCA | Experiencia | Activar los saberes previos a partir de una vivencia, situación concreta o pregunta cercana al estudiante |\n| ERCA | Reflexión | Analizar críticamente la experiencia: comparar, preguntar, relacionar |\n| ERCA | Conceptualización | Construir y formalizar el nuevo concepto, procedimiento o regla |\n| ERCA | Aplicación | Transferir lo aprendido a nuevas situaciones y practicarlo |\n| ACC | Anticipación | Motivar y explorar lo que el estudiante ya sabe o intuye sobre el tema |\n| ACC | Construcción del conocimiento | Desarrollar el nuevo aprendizaje mediante actividades guiadas |\n| ACC | Consolidación | Afianzar, aplicar y evaluar lo aprendido |\n\nEn PlanificaDoc, el plan diario organiza las estrategias metodológicas en las cuatro fases ERCA, y el módulo de adaptación curricular adapta cada una de esas fases al perfil del estudiante. En la PCT, el campo **Modelo pedagógico** permite elegir entre **ERCA** y **ACC**; al seleccionar Preparatoria o Inicial, la app propone ACC y, para los demás subniveles, ERCA, aunque el docente puede cambiar la opción. El Currículo Nacional por Competencias, por su parte, organiza la planificación microcurricular en sugerencias para el inicio, el desarrollo y el cierre de cada semana."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.5.1. Diseño Universal para el Aprendizaje (DUA)",
  "seccionId": "4-5-1-diseno-universal-para-el-aprendizaje-dua",
  "texto": "El DUA es un enfoque de planificación que busca que las clases sean accesibles para todos los estudiantes desde su diseño, en lugar de ajustarlas después. Los formatos oficiales de planificación microcurricular del Programa Piloto incluyen una columna expresa de “Estrategias metodológicas desde el DUA” (EGB y Bachillerato) y de “Experiencias de aprendizaje y estrategias metodológicas desde el DUA” (Inicial y Preparatoria). El Currículo Priorizado, por su parte, pide contemplar la atención a la diversidad y diseñar estrategias inclusivas desde las primeras etapas del proceso educativo.\n\nEl DUA se apoya en tres principios, que PlanificaDoc marca con una casilla junto a cada actividad del plan diario:\n\n- **Representación:** ofrecer la información de varias formas (visual, auditiva, manipulativa).\n- **Acción y expresión:** permitir que el estudiante demuestre lo aprendido por distintos medios.\n- **Implicación:** despertar el interés y sostener la motivación y el esfuerzo."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.5.2. Adaptaciones curriculares",
  "seccionId": "4-5-2-adaptaciones-curriculares",
  "texto": "Cuando el DUA no basta para responder a las necesidades de un estudiante, se realiza una adaptación curricular individual. Esta se dirige a estudiantes con necesidades educativas específicas (NEE), asociadas o no a una discapacidad, y se trabaja en coordinación con el Departamento de Consejería Estudiantil (DECE). En la práctica institucional, la adaptación se registra en el Documento Individual de Adaptación Curricular (DIAC).\n\nPlanificaDoc clasifica las adaptaciones en tres grados, según cuánto se modifica el currículo:\n\n| **Grado** | **Denominación en la app** | **Qué se modifica** |\n| --- | --- | --- |\n| Grado 1 | No significativa | Solo elementos de acceso: metodología, recursos y organización del aula. La destreza y el criterio de evaluación se mantienen |\n| Grado 2 | Moderada | Acceso y proceso: actividades, tiempos y agrupamientos. La destreza se simplifica levemente, pero conserva su objetivo central |\n| Grado 3 | Significativa | Acceso, proceso y resultado: se modifican sustancialmente la destreza, el criterio de evaluación y los indicadores de logro |\n\nLa guía oficial de adaptaciones curriculares incluida en las referencias de este manual corresponde a otro uso del término: adapta el currículo de Básica Superior y Bachillerato para la educación de personas jóvenes, adultas y adultas mayores con escolaridad inconclusa, priorizando destrezas y distribuyéndolas por grado con total flexibilidad para el docente. No debe confundirse con la adaptación curricular individual por NEE que genera PlanificaDoc.\n\n> La adaptación curricular que genera PlanificaDoc es una propuesta de trabajo. La decisión sobre el grado de adaptación y su aplicación corresponde al docente, a la autoridad institucional y al DECE, con base en la evaluación psicopedagógica del estudiante."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "2026-2027",
  "seccionId": "2026-2027",
  "texto": "El Acuerdo MINEDUC-MINEDUC-2024-00060-A establece la Estrategia Nacional para el Fortalecimiento y la Renovación Curricular, uno de cuyos momentos es el pilotaje del currículo por competencias. En el año lectivo 2026-2027, el Programa Piloto se aplica en las instituciones educativas fiscales interculturales de la Zona 6 del régimen Sierra-Amazonía. Según la presentación oficial del programa, participan 15 distritos, 770 instituciones, cerca de 10.000 docentes y más de 171.000 estudiantes, y su objetivo es evaluar y ajustar el currículo antes de su implementación nacional."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.6.1. Competencia y competencias clave",
  "seccionId": "4-6-1-competencia-y-competencias-clave",
  "texto": "Las Generalidades del Currículo Nacional por Competencias definen la competencia como la integración de conocimientos, habilidades y actitudes para actuar de forma ética, reflexiva y eficaz en contextos diversos. El currículo se organiza en torno a siete competencias clave, que se desarrollan de manera progresiva desde Inicial hasta el Bachillerato y se concretan en los perfiles de salida de cada nivel y subnivel:\n\n| **Sigla** | **Competencia clave** | **Idea central** |\n| --- | --- | --- |\n| CC | Comunicativa | Comprender y producir todo tipo de textos |\n| CMCT | Matemática y en Ciencia y Tecnología | Pensamiento lógico, razonamiento matemático y método científico |\n| CCICC | Ciudadana, Identidad y Conciencia Cultural | Comprender el entorno social y reconocer la propia identidad en la diversidad |\n| CD | Digital | Usar las tecnologías de forma ética, crítica, segura y creativa |\n| CSE | Socioemocional | Gestionar emociones, convivir, adaptarse y construir un proyecto de vida |\n| CECA | Expresiones Culturales y Artísticas | Valorar la diversidad cultural, la creatividad y el arte |\n| CIT | Innovación y Transformación | Generar ideas nuevas y liderar cambios |\n\n> La presentación del Programa Piloto usa la sigla CS para la competencia socioemocional, mientras que el documento de Generalidades para EGB y Bachillerato usa CSE. Ambas designan la misma competencia."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.6.2. Elementos del currículo",
  "seccionId": "4-6-2-elementos-del-curriculo",
  "texto": "Según las Generalidades, el currículo de cada asignatura presenta una introducción, la contribución de la asignatura a las competencias clave, los bloques curriculares y una matriz de competencias específicas con los siguientes elementos:\n\n- **Competencia específica:** desempeño observable que integra conocimientos, habilidades, actitudes y valores, y que concreta las competencias clave para cada área y nivel o subnivel.\n- **Indicadores de evaluación:** enunciados precisos, observables y verificables del nivel de desempeño esperado; orientan la evaluación formativa y sumativa.\n- **Saberes:** base de la competencia, clasificados en declarativos (conceptos, hechos y nociones), procedimentales (acciones, habilidades y procedimientos) y actitudinales (actitudes, valores y disposiciones éticas).\n- **Orientaciones metodológicas:** pautas para crear experiencias de aprendizaje significativas y establecer conexiones interdisciplinarias.\n\nEn Inicial y Preparatoria, el currículo es integrado (sigla CI) y se organiza por ámbitos de desarrollo y aprendizaje en lugar de asignaturas. La planificación microcurricular oficial de estos subniveles se concreta en experiencias de aprendizaje; la de EGB y Bachillerato parte de una situación de aprendizaje, con título y descripción, y registra las conexiones interdisciplinares."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.6.3. Codificación de los elementos",
  "seccionId": "4-6-3-codificacion-de-los-elementos",
  "texto": "| **Elemento** | **Ejemplo** | **Lectura del código** |\n| --- | --- | --- |\n| Competencia específica | CE.LL.2.1 | Competencia específica, Lengua y Literatura, subnivel Elemental (2), competencia n.º 1 |\n| Competencia específica (Inicial) | CE.CI.0.1 | Competencia específica, Currículo Integrado, nivel Inicial (0), competencia n.º 1 |\n| Saber | M.4.1.d.1 | Matemática, subnivel Superior (4), bloque 1, saber declarativo (d), saber n.º 1. Las letras p y a indican saberes procedimentales y actitudinales |\n| Indicador de evaluación | I.CS.F.5.3.1 | Indicador, área Ciencias Sociales, asignatura Filosofía, Bachillerato (5), competencia específica n.º 3, indicador n.º 1 |\n\nEl módulo **Currículo por Competencias** de PlanificaDoc utiliza estos elementos para elaborar la planificación microcurricular del piloto, y la PCT y el Proyecto Interdisciplinar responden a la organización trimestral y a los proyectos interdisciplinarios que la Guía Docente del Programa Piloto incluye entre sus orientaciones."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.7. Año lectivo 2026-2027, régimen Sierra-Amazonía",
  "seccionId": "4-7-ano-lectivo-2026-2027-regimen-sierra-amazonia",
  "texto": "Según los Lineamientos pedagógicos para el inicio del año lectivo 2026-2027, en las instituciones fiscales de modalidad presencial, semipresencial y a distancia el año lectivo se desarrolla en **tres** **periodos académicos (trimestres)** que garantizan los 200 días laborables del régimen escolar y el periodo de vacaciones ininterrumpidas del equipo docente. El Servicio de Atención Familiar para la Primera Infancia (SAFPI) se ajusta al mismo calendario, también con 200 días laborables."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.7.1. Inicio del año: “Conecta y nivela”",
  "seccionId": "4-7-1-inicio-del-ano-conecta-y-nivela",
  "texto": "Las tres primeras semanas del año escolar en las instituciones del Programa Piloto se dedican a la estrategia que los Lineamientos denominan “Conecta y nivela: 3 semanas para arrancar con éxito el año escolar”, centrada en las asignaturas fundacionales de Lengua y Literatura y Matemática:\n\n- **Semana 1:** actividades lúdicas de adaptación, socialización de normas de convivencia y evaluación diagnóstica de los aprendizajes y del estado socioemocional, con apoyo del DECE en lo posible. El diagnóstico parte del informe de resultados del año anterior y de las conclusiones de las Juntas de Curso.\n- **Semanas 2 y 3:** nivelación de los aprendizajes según los resultados del diagnóstico; se recomienda la estrategia de co-nivelación, en la que los estudiantes con aprendizajes más afianzados apoyan a sus compañeros.\n- **Después de la semana 3:** abordaje curricular progresivo del currículo por competencias.\n\nEn PlanificaDoc, esta etapa se planifica con el módulo **Conecta Nivela y Crea**, que puede enlazarse con **Evaluación diagnóstica**."
 },
 {
  "capId": "4-conceptos-curriculares-basicos",
  "capTitulo": "4. Conceptos curriculares básicos",
  "seccion": "4.7.2. Hitos del Programa Piloto",
  "seccionId": "4-7-2-hitos-del-programa-piloto",
  "texto": "| **Hito** | **Periodo** | **Fuente** |\n| --- | --- | --- |\n| Fase 1: preparación y formación inicial | Julio a agosto de 2026 | Presentación del Programa Piloto |\n| Formación inicial de autoridades y docentes | Entre el 13 y el 28 de agosto de 2026 | Presentación del Programa Piloto |\n| Fase 2: implementación, seguimiento y acompañamiento | Agosto de 2026 a junio de 2027 | Presentación del Programa Piloto |\n| Observación de clases y mesas técnicas semanales | 19 de octubre de 2026 a 16 de abril de 2027 | Presentación del Programa Piloto |\n| Encuestas de percepción y seguimiento | Noviembre de 2026, febrero o marzo de 2027 y mayo de 2027 | Presentación del Programa Piloto |\n| Fase 3: cierre, evaluación y ajustes al currículo | Julio de 2027 | Presentación del Programa Piloto |\n| Evaluación sumativa | Al cierre de cada trimestre | Presentación del Programa Piloto; Guía Docente |\n\n> Las fechas exactas de inicio de clases y de cada trimestre constan en el cronograma escolar oficial del régimen Sierra-Amazonía 2026-2027 publicado junto con los Lineamientos. Consulte ese cronograma y el calendario de su institución antes de fijar las fechas de su PCA o PCT."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": null,
  "seccionId": null,
  "texto": "Todos los módulos siguen un patrón común: (1) completar los datos informativos, (2) seleccionar los elementos curriculares, (3) generar la propuesta con IA, (4) revisar y editar el resultado y (5) guardar y exportar el documento.\n\n> **Importante:** el contenido generado con inteligencia artificial es una propuesta de apoyo. El docente es responsable de revisarlo, ajustarlo a su contexto institucional y validarlo antes de presentarlo."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1. Plan diario",
  "seccionId": "5-1-plan-diario",
  "texto": "El plan diario es la planificación microcurricular de una clase de 45 minutos. Parte de una destreza con criterio de desempeño (DCD) del Currículo Priorizado y genera objetivo, actividades en el ciclo ERCA, recursos, evaluación y estrategias del Diseño Universal para el Aprendizaje (DUA). Puede iniciarse desde el buscador de Inicio, desde **Explorar** o desde **Crear › Plan de aula › Plan diario**."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.1. Fundamento normativo",
  "seccionId": "5-1-1-fundamento-normativo",
  "texto": "Según el Currículo Priorizado, las DCD articulan habilidades, contenidos y procedimientos, y los indicadores de evaluación describen los logros esperados en cada subnivel. Cada DCD se vincula a un criterio (CE.) y a sus indicadores (I.); por ejemplo, LL.2.1.1 se evalúa con CE.LL.2.1 e I.LL.2.1.1. El formato oficial de planificación microcurricular para EGB y BG incluye datos informativos, indicadores de evaluación, estrategias metodológicas desde el DUA, recursos y técnicas e instrumentos de evaluación; el plan diario cubre estos elementos para una clase.\n\n1. Localice la destreza por su código (por ejemplo, M.2.1.5) o navegue por área en **Explorar** y ábrala.\n2. Revise la ficha: código, descripción, **Subnivel**, **Bloque Curricular**, **Objetivos del Subnivel**, **Criterios de Evaluación** e **Indicadores de Evaluación**. Haga clic en **Generar Planificación**.\n3. Complete los datos informativos del formulario **Configura tu planificación**.\n\n*Figura 19. Formulario del plan diario con la destreza seleccionada.*\n\n*Figura 20. Datos informativos del plan diario.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.1. Fundamento normativo",
  "seccionId": "5-1-1-fundamento-normativo",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **Institución Educativa**, **Paralelo**, **Nivel** | Datos del encabezado. | Ej: “A”; EGB / BGU |\n| **Nombre Docente** * | Único dato obligatorio para guardar. | Si falta: “Por favor ingresa el nombre del docente” |\n| **Grado/Curso** y **Subnivel** | El grado se precarga y es editable; el subnivel se toma de la destreza. | Ej: 10mo |\n| **Período Pedagógico**, **Trimestre** | Período, si aplica; trimestre Primero, Segundo o Tercero. | Opcionales |\n| **Fecha Inicio**, **Fecha Fin**, **Número de Períodos** | Duración de la clase. | DD/MM/AAAA; por defecto 1 período |\n| **3. Estilos de Aprendizaje** | Porcentaje del grupo por estilo: visual, auditivo, lector-escritor y kinestésico. | 25 % cada uno por defecto |\n| **4. Habilidades** **Socioemocionales** | Selección múltiple. | Empatía, Autorregulación… |\n| **5. Tu Tema de Clase** | Tema que desea enseñar. Obligatorio para generar. | Texto libre |\n| **Técnicas de Evaluación** | Selección múltiple. | Rúbrica, Lista de Cotejo, Observación… |\n\n1. Escriba el tema de la clase. Si desea otras opciones, haga clic en **Sugerir 2 alternativas con IA** y toque la que prefiera para usarla. El botón requiere que antes haya escrito un tema.\n\n*Figura 21. Sugerencia de temas de clase generada con IA.*\n\n2. Haga clic en **Generar Planificación**. Mientras la IA elabora el plan se muestra “Generando tu planificación...”. Si hay un error, vuelve al formulario con sus datos intactos.\n\n*Figura 22. Pantalla de espera durante la generación con IA.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.2. Qué genera la IA",
  "seccionId": "5-1-2-que-genera-la-ia",
  "texto": "- Un objetivo de clase y la estructura **ERCA**: **Experiencia** (10 min, 4 actividades), **Reflexión** (10 min, 4), **Conceptualización** (15 min, 5) y **Aplicación** (10 min, 5).\n- Actividades iniciadas con un verbo de la Taxonomía de Marzano en infinitivo, acorde con cada fase.\n- Los principios DUA que atiende cada actividad, garantizando los tres en cada fase, además de recursos y una evaluación formativa.\n\nAl finalizar, el sistema presenta la pantalla **Planificación Microcurricular**. Puede editar **Objetivo**, **Actividades (editable)**, **Recursos**, **Indicadores de Evaluación**, **Técnicas e Instrumentos**, los campos DUA y **Observaciones**; para cambiar la configuración, haga clic en **Volver a configuración**:\n\n*Figura 23. Resultado del plan diario (1 de 4).*\n\n*Figura 24. Resultado del plan diario (2 de 4).*\n\n*Figura 25. Resultado del plan diario (3 de 4).*\n\n*Figura 26. Resultado del plan diario (4 de 4).*\n\n***El DUA en el plan diario***\n\nEl DUA diseña la clase desde el inicio para que todo el grupo pueda aprender. Cada actividad ERCA lleva cuadros de color con los principios que atiende: **representación** (el qué, rosado), **acción y** **expresión** (el cómo, azul) e **implicación** (el porqué, verde). La sección **Diseño Universal para el** **Aprendizaje (DUA)** agrega estrategias generales del área para cada principio, que conviene ajustar a su grupo.\n\nDesde esta pantalla puede guardar con **Guardar Planificación** o guardar y abrir el asistente con **Guardar y crear Adaptación Curricular**:\n\n*Figura 27. Opción para guardar y crear la adaptación curricular.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.2. Qué genera la IA",
  "seccionId": "5-1-2-que-genera-la-ia",
  "texto": "Al guardar (o con **← Volver a la planificación** desde una adaptación) se muestra la planificación microcurricular completa, con datos informativos, principios DUA, estilos, habilidades, objetivos, criterios de evaluación, destreza, estrategias ERCA, actividades evaluativas, recursos, DUA y observaciones:\n\n*Figura 28. Planificación microcurricular: datos informativos.*\n\n*Figura 29. Planificación microcurricular: objetivos y destrezas.*\n\n*Figura 30. Planificación microcurricular: actividades de aprendizaje.*\n\n*Figura 31. Planificación microcurricular: evaluación.*\n\nLos botones **PDF** y **Word** exportan el documento. Al final, la sección de adaptaciones curriculares ofrece **+ Agregar** o **Crear adaptación curricular**:\n\n*Figura 32. Planificación microcurricular: opciones de guardado y exportación.*\n\n> **Consejo:** antes de exportar, verifique que objetivo, actividades y evaluación sean coherentes con el indicador oficial de la destreza. La IA propone; la decisión pedagógica es del docente."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.3. Adaptación curricular del plan diario",
  "seccionId": "5-1-3-adaptacion-curricular-del-plan-diario",
  "texto": "La adaptación ajusta una planificación a las necesidades educativas específicas (NEE) de un estudiante, asociadas o no a discapacidad. El asistente tiene cinco pasos (**Identificacion**, **Grado**, **Perfil**, **Generar**, **Resultado**) y la IA parte de las actividades ERCA, el objetivo y los recursos de la clase vinculada. El Reglamento General a la LOEI, citado en el Currículo Priorizado, dispone que el currículo se adapte a las necesidades y realidades del estudiantado; los Lineamientos 2026-2027 piden que la evaluación diagnóstica considere el estado socioemocional con apoyo del DECE, un buen insumo para el perfil del estudiante.\n\nLos datos de la planificación de origen se cargan automáticamente y aparecen marcados con “✓\n\nplanificación”. Solo son editables **Año lectivo**, **Codigo del estudiante** y **Descripcion de la destreza** **(editable)**, que debe tener al menos 10 caracteres.\n\n*Figura 33. Datos precargados de la adaptación curricular.*\n\n1. Seleccione el grado de adaptación curricular.\n\n| **Grado** | **Qué se modifica** | **Qué genera la IA** |\n| --- | --- | --- |\n| **Grado 1 — No** **Significativa** | Acceso: metodología, recursos y organización; no cambian destreza ni criterios. | Adaptaciones de acceso |\n| **Grado 2 — Moderada** | Acceso y proceso: actividades, tiempos y agrupamientos; destreza levemente simplificada. | Acceso, proceso, destreza, criterio e indicadores simplificados |\n| **Grado 3 — Significativa** | Acceso, proceso y resultado: destreza, criterio e indicadores modificados sustancialmente. | Todo lo anterior más adaptaciones de resultado |\n\n*Figura 34. Selección del grado de adaptación curricular.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.3. Adaptación curricular del plan diario",
  "seccionId": "5-1-3-adaptacion-curricular-del-plan-diario",
  "texto": "1. Complete el formulario de la situación de NEE del estudiante: **Tipo de NEE** (discapacidad visual, auditiva, motriz o intelectual, TEA, TDAH, dislexia, discalculia, trastorno del lenguaje, altas capacidades, dificultades socioemocionales u otra), **Estilo de aprendizaje predominante**, **Fortalezas del estudiante** * y **Desafios del estudiante** * (obligatorios, mínimo 10 caracteres) y **Apoyos disponibles en el aula**.\n\n*Figura 35. Formulario de la situación de NEE del estudiante.*\n\n2. Revise el resumen de la adaptación y el recuadro “¿Que generara la IA?”. Para corregir, haga clic en **← Volver**.\n\n*Figura 36. Resumen previo a la generación de la adaptación.*\n\n3. Haga clic en ✨ **Generar Adaptacion Curricular**. El botón indica “Generando adaptacion...”; el proceso toma entre 15 y 30 segundos.\n\n*Figura 37. Botón Generar en proceso.*\n\nUna vez generada, se muestran en modo de lectura el perfil pedagógico, la destreza original y la adaptada (grados 2 y 3), las adaptaciones de acceso, proceso y resultado según el grado, metodologías activas, recursos, plan de seguimiento, adaptaciones por fase ERCA, evaluación adaptada y una rúbrica con cuatro niveles (Siempre Alcanza, Alcanza, Próximo a Alcanzar y No Alcanza). La adaptación queda vinculada al plan y puede descargarse con **Exportar como Word (.docx)**:\n\n*Figura 38. Resultado de la adaptación curricular (1 de 4).*\n\n*Figura 39. Resultado de la adaptación curricular (2 de 4).*\n\n*Figura 40. Resultado de la adaptación curricular (3 de 4).*\n\n*Figura 41. Resultado de la adaptación curricular (4 de 4).*\n\nAl terminar, puede volver con **← Volver a la planificación** o crear otra con **+ Nueva adaptacion**:\n\n*Figura 42. Opciones para volver a la planificación o crear una nueva adaptación.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.1.3. Adaptación curricular del plan diario",
  "seccionId": "5-1-3-adaptacion-curricular-del-plan-diario",
  "texto": "> **Consejo:** por confidencialidad, identifique al estudiante solo con un código interno o sus iniciales, y describa su perfil con lenguaje pedagógico, no clínico."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.2. Plan semanal",
  "seccionId": "5-2-plan-semanal",
  "texto": "El plan semanal reúne las clases de lunes a viernes de una asignatura; cada día admite de 1 a 3 horas y cada hora tiene su propia DCD, tema y plan ERCA. Ruta: **Crear › Plan de aula › Plan semanal**. El formulario consta de dos secciones: datos informativos y configuración por día y hora.\n\n*Figura 43. Formulario del plan semanal: datos informativos y configuración por horas.*\n\n1. Complete los datos informativos: **Institución Educativa**, **Nombre Docente** * (obligatorio), **Subnivel**, **Asignatura**, **Grado**, **Paralelo**, **Trimestre**, **Semana inicio** y **Semana fin** (se precargan con la semana en curso) y los datos de la unidad. En Cívica y Acompañamiento Integral en el Aula se elige además el **Bloque curricular**, que completa la unidad y el criterio del bloque.\n2. En cada día, active el interruptor, elija el **Número de horas** y, en cada hora, haga clic en **Seleccionar DCD...** para buscar la destreza por código o descripción dentro del área y subnivel elegidos. Luego escriba el **Tema de la hora** y marque habilidades socioemocionales, metodologías activas y técnicas de evaluación.\n\n*Figura 44. Configuración de un día con el código de la destreza.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.2.1. Desagregación por grado",
  "seccionId": "5-2-1-desagregacion-por-grado",
  "texto": "Las DCD se formulan por subnivel, que abarca varios grados. Desagregar gradúa la complejidad de la destreza para su grado sin cambiar su contenido, algo útil también en aulas multigrado, que según los Lineamientos 2026-2027 atienden a estudiantes de distintos grados en un mismo espacio.\n\n1. Para desagregar la destreza, haga clic en **Desagregar para N.º EGB** (o BGU). El botón aparece si la destreza tiene indicador y su subnivel se divide en grados. En el panel, haga clic en ⚡ **Desagregar por grado**.\n\n*Figura 45. Opción Desagregar por grado.*\n\n2. Revise las sugerencias: la IA propone una DCD y un indicador graduados por grado según niveles de Marzano; el último grado conserva el texto oficial. Puede usarlas, editarlas con ✏️ **Editar** o aprobarlas con ✓ **Aprobar**, y luego hacer clic en **Usar versión de N° en esta planificación**.\n\n*Figura 46. Sugerencias de desagregación de la destreza.*\n\n*Figura 47. Desagregación aplicada a la destreza.*\n\n> **Importante:** la desagregación es opcional y no altera el catálogo oficial. La versión graduada aparece en los documentos exportados; para descartarla, haga clic en ↩ Volver a DCD oficial.\n\n3. Opcionalmente, haga clic en **Sugerir alternativas con IA** (con al menos tres caracteres de tema) y elija una propuesta. Para repetir la configuración, haga clic en **Copiar configuración al** **siguiente día**.\n\n*Figura 48. Sugerencias de temas de clase y opción para copiar el día.*\n\n4. Al completar la semana, haga clic en **Generar Planificación Semanal**. Se requiere al menos un día activo con destreza y tema.\n\n*Figura 49. Botón Generar planificación del plan semanal.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.2.1. Desagregación por grado",
  "seccionId": "5-2-1-desagregacion-por-grado",
  "texto": "La IA genera en paralelo cada hora (15 a 40 segundos). El resultado se organiza en pestañas por día, con objetivo, fases ERCA con indicadores DUA, recursos y evaluación formativa derivada de los indicadores oficiales de la destreza. **Regenerar esta hora** rehace una sola hora y **← Editar** vuelve a la configuración:\n\n*Figura 50. Pantalla de espera de la generación semanal.*\n\n*Figura 51. Resultado del plan semanal (1 de 2).*\n\n*Figura 52. Resultado del plan semanal (2 de 2).*\n\nPara guardar la planificación con una adaptación curricular, abra la pestaña **ADAPT.** (ícono de adaptaciones curriculares) y elija **Guardar y agregar adaptación** o **Solo guardar (sin adaptaciones)**; en este último caso podrá agregarla más tarde desde la vista de la semana:\n\n*Figura 53. Opción para guardar con adaptación curricular.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.2.2. Adaptaciones curriculares del plan semanal",
  "seccionId": "5-2-2-adaptaciones-curriculares-del-plan-semanal",
  "texto": "Sigue el mismo asistente del plan diario con un paso adicional, **Dias**, y la destreza se elige porque la semana puede tener varias.\n\n1. Seleccione la destreza que desea adaptar e ingrese el código o las iniciales del estudiante en **Codigo del estudiante**.\n2. Elija los días en los que se aplicará la adaptación; solo aparecen los días activos de la semana y debe marcar al menos uno. La IA genera adaptaciones ERCA para cada día elegido.\n3. Continúe con los mismos pasos descritos en la adaptación curricular del plan diario.\n\n*Figura 54. Selección de la destreza y del estudiante para la adaptación semanal.*\n\n*Figura 55. Selección de los días en que se aplica la adaptación.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.3. PCA Anual",
  "seccionId": "5-3-pca-anual",
  "texto": "Ruta: **Crear › Plan de área › PCA Anual**. La Planificación Curricular Anual organiza el área para todo el año lectivo y sigue el Anexo 1 del Instructivo de PCA y Microplanificación 2021 del MINEDUC. Según los Lineamientos de inicio de año lectivo 2026-2027, el año se desarrolla en tres periodos académicos que suman 200 días laborables; la PCA reparte ese tiempo en unidades construidas con las Destrezas con Criterios de Desempeño (DCD) del Currículo Priorizado.\n\n1. Complete **1. Datos informativos**.\n\n*Figura 56. Formulario de datos informativos del PCA.*\n\n| **Campo** | **Descripción** | **Observación** |\n| --- | --- | --- |\n| Institución educativa | Nombre de la institución | Obligatorio |\n| Nombre del docente(s) | Responsable de la PCA | Obligatorio |\n| Área / Asignatura | Área del currículo | Obligatorio |\n| Subnivel | Opciones según el área | Obligatorio |\n| Grado / Curso | Aparece al elegir el subnivel | Obligatorio |\n| Año lectivo / Paralelo | Datos del encabezado | 2026-2027 por defecto |\n\n> Si cambia el área o el subnivel con destrezas ya elegidas, el sistema pide confirmación porque las borrará de todas las unidades.\n\nLos objetivos del área y del grado no se escriben: la IA los redacta según el currículo oficial del subnivel.\n\n1. Revise **2. Distribución del tiempo**. Con la **Carga horaria semanal** (5), las **Semanas de trabajo** (40) y las **Semanas evaluación e imprevistos** (8), el sistema calcula el **Total semanas de clase** (trabajo − evaluación) y el **Total períodos** (semanas de clase × carga horaria). Puede modificar cualquier valor.\n\n*Figura 57. Distribución del tiempo del PCA.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.3. PCA Anual",
  "seccionId": "5-3-pca-anual",
  "texto": "2. En **5. Unidades de planificación**, busque por código o palabra clave, marque las DCD de cada unidad e indique la **Duración (semanas)**. Use **+ Agregar unidad** para añadir más.\n\n*Figura 58. Unidades de planificación y selección de destrezas con criterios de desempeño.*\n\n> Procure que la suma de las duraciones coincida con el total de semanas de clase; el sistema no lo comprueba.\n\n3. Seleccione las metodologías activas y las técnicas de evaluación; opcionalmente, escriba su bibliografía (APA) y las **Firmas de aprobación**. Luego haga clic en **Generar vista previa de mi** **PCA** (hasta 30 segundos).\n\n*Figura 59. Botón Generar vista previa de mi PCA.*\n\nLa IA genera objetivos, título, objetivos específicos, contenidos, orientaciones metodológicas y criterios de evaluación de cada unidad, además de bibliografía sugerida y observaciones con orientaciones DUA:\n\n*Figura 60. Resultado del PCA (1 de 4).*\n\n*Figura 61. Resultado del PCA (2 de 4).*\n\n*Figura 62. Resultado del PCA (3 de 4).*\n\n*Figura 63. Resultado del PCA (4 de 4).*\n\nAl desbloquear el documento se habilitan **Regenerar** en cada sección y **Descargar PDF** o **Descargar** **Word**. El Word, en A4 horizontal, incluye la tabla de unidades con los íconos de competencias e inserciones curriculares junto a cada DCD, y las firmas del docente, vicerrector y director:\n\n*Figura 64. Botones de descarga del PCA.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.4. PCT Trimestral",
  "seccionId": "5-4-pct-trimestral",
  "texto": "Ruta: **Crear › Plan de área › PCT Trimestral**. La Planificación Curricular Trimestral concreta un solo trimestre. Es una adaptación institucional del PCA: el MINEDUC no la define como anexo propio, pero los Lineamientos 2026-2027 organizan el año en tres periodos.\n\n1. Complete los datos informativos y elija el **Trimestre** (obligatorio). En Educación Física puede indicar un **Deporte o disciplina (opcional)**.\n\n*Figura 65. Formulario del PCT.*\n\n2. Revise la distribución del tiempo, que se calcula como en el PCA (13 semanas del trimestre y 2 de evaluación por defecto).\n\n*Figura 66. Distribución del tiempo del PCT.*\n\n3. En cada unidad seleccione las DCD. Para título y objetivos elija **Escribir yo** o **Generar con IA** y haga clic en **Generar título y objetivos**; los demás campos los genera la IA.\n\n*Figura 67. Selección de destrezas con criterios de desempeño y campos con IA.*\n\n> Si el tema propuesto no concuerda con las destrezas, el sistema muestra “Tema no compatible” y sugiere otro.\n\n4. Elija el modelo pedagógico (**ERCA**: Experiencia, Reflexión, Conceptualización, Aplicación; o **ACC**: Anticipación, Construcción, Consolidación), las metodologías activas y las técnicas e instrumentos de evaluación.\n\n*Figura 68. Modelo pedagógico, metodologías activas y evaluación.*\n\n5. Haga clic en **Generar vista previa de mi PCT**.\n\n*Figura 69. Botón Generar vista previa de mi PCT.*\n\nLa IA redacta dos actividades por fase para cada DCD, graduadas según la taxonomía de Marzano, y de 3 a 5 indicadores por unidad. Tras desbloquear, puede descargar en PDF o Word; la bibliografía y las observaciones se completan en el archivo:\n\n*Figura 70. Resultado del PCT (1 de 3).*\n\n*Figura 71. Resultado del PCT (2 de 3).*\n\n*Figura 72. Resultado del PCT (3 de 3).*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "Ruta: **Crear › Programaciones › Conecta Nivela y Crea**. Este módulo planifica el arranque del año escolar en tres fases: **Conecta** (semana 1: adaptación y diagnóstico), **Nivela** (semanas 2 y 3: nivelación) y **Crea** (semanas 4 y 5: proyecto interdisciplinario).\n\n***Fundamento normativo***\n\nSegún los Lineamientos pedagógicos para el inicio del año lectivo 2026-2027 (Sierra-Amazonía), el inicio del año se centra en las asignaturas fundacionales, Lengua y Literatura y Matemática. En la semana 1 se realizan actividades de adaptación y una evaluación diagnóstica que incluye el estado socioemocional, con apoyo del DECE e instrumentos no tradicionales. En las semanas 2 y 3 se nivela a partir de esos resultados y se recomienda la co-nivelación: el estudiante con destrezas más consolidadas acompaña a un compañero, en un aprendizaje bidireccional.\n\n***Modo Plan piloto (Conecta y nivela en 3 semanas)***\n\nEn el paso **Identificacion** se encuentra el interruptor **Plan piloto Currículo por Competencias (Sierra-** **Amazonía, Zona 6)**, apagado por defecto. Con el interruptor apagado, el módulo trabaja las cinco semanas descritas (Conecta, Nivela y Crea). Si su institución participa en el Programa Piloto del Currículo Nacional por Competencias, actívelo: el sistema aplica la estrategia “Conecta y nivela: 3 semanas para arrancar con éxito el año escolar” de los Lineamientos Sierra-Amazonía 2026-2027."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "| **Aspecto** | **Modo general (interruptor apagado)** | **Modo Plan piloto (interruptor encendido)** |\n| --- | --- | --- |\n| Duración | 5 semanas: Conecta, Nivela y Crea. | 3 semanas: Conecta y nivela. |\n| Semana 1 | Adaptación y diagnóstico académico y socioemocional. | Adaptación lúdica (integración, normas de convivencia, expectativas y bienvenida) y diagnóstico basado en el informe de resultados del año anterior y en las conclusiones de las Juntas de Curso, con instrumentos no tradicionales y preguntas de reflexión. |\n| Semanas 2 y 3 | Nivelación de Lengua y Literatura y Matemática con co-nivelación. | Nivelación de las asignaturas fundacionales con co-nivelación, usando textos del año anterior, folletos u hojas de trabajo. |\n| Semanas 4 y 5 | Proyecto interdisciplinario (o producto acreditable en BT). | No se planifican: el paso **Semanas 4-5** se omite. |\n| Cierre | Rúbrica del proyecto como evaluación formativa. | Fila de **Abordaje curricular**: desde la semana 4 inicia el abordaje del currículo por competencias según los resultados del diagnóstico. |\n| Documento | Conecta, Nivela y Crea. | Conecta y nivela — Programa Piloto Currículo Nacional por Competencias (Zona 6). |\n\n> Con el modo piloto activo, el subtítulo de la pantalla cambia a “Programa piloto — 3 semanas (Conecta y nivela)”, el botón de generación se muestra al final del paso Semanas 2-3 con el nombre Generar Plan Conecta y Nivela, y en Mis planes el plan se identifica como “Plan piloto (3 semanas)”."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "El asistente tiene seis pasos: **Identificacion**, **Semana 1**, **Semanas 2-3**, **Semanas 4-5**, **Diagnóstico** y **Resultado**. Para avanzar, el sistema exige un grado (y, en Bachillerato Técnico, figura profesional y módulo), al menos una destreza en el diagnóstico académico y al menos una destreza de nivelación.\n\n1. Complete los datos informativos y haga clic en **Siguiente →**.\n\n*Figura 73. Paso Identificacion: contexto pedagógico y modalidad.*\n\n| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **Institución educativa** y **Docente** | Datos que se imprimen en el documento. | Unidad Educativa Saberes |\n| **Año lectivo** | Viene precargado y puede editarse. | 2026-2027 |\n| **Grado / Curso** | Obligatorio. Determina las destrezas prerrequisito que se sugieren. | 8.° EGB; en BT: 1.° BT a 3.° BT |\n| **Modalidad** | **General (EGB/BGU)** o **Bachillerato Técnico**. Al cambiarla se borra el grado. | BT habilita **Figura Profesional** y **Módulo** |\n| **Plan piloto Currículo por** **Competencias** | Interruptor que aplica “Conecta y nivela” en 3 semanas según los lineamientos del Programa Piloto Zona 6. | Apagado por defecto (5 semanas) |\n\nSi elige **Bachillerato Técnico**, seleccione la **Figura Profesional** y el **Módulo**; los resultados de aprendizaje del módulo se usarán en el diagnóstico y la nivelación técnica. Si el módulo no tiene catálogo técnico, el sistema lo advierte y la IA no inventará criterios.\n\n*Figura 74. Selección de Bachillerato Técnico, figura profesional y módulo.*\n\n***Semana 1***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "1. Complete **Metodología declarada**, **Actividades de adaptación** y **Técnica + instrumento** (uno por línea).\n2. En **Diagnóstico académico**, abra **Agregar destreza de Lengua y Literatura**, seleccione las destrezas y haga clic en **Listo**.\n3. Repita con **Agregar destreza de Matemática**.\n4. En **Diagnóstico socioemocional**, marque las habilidades a observar y haga clic en **Sugerir con IA** **(técnicas + nota DECE)**; la nota DECE y las preguntas de reflexión propuestas son editables.\n\n*Figura 75. Semana 1: metodología, actividades de adaptación y técnica e instrumento de diagnóstico.*\n\nLa pantalla recuerda las herramientas oficiales de diagnóstico: preguntas abiertas, rúbrica cualitativa, lista de cotejo y prueba objetiva; la valoración diagnóstica es cualitativa. Si deja vacías la metodología, las actividades o la técnica, la IA las propone al generar el plan. El buscador muestra primero las destrezas del **nivel prerrequisito**, lo que el estudiante debería traer del subnivel anterior; escriba tres caracteres o más para buscar otras.\n\n*Figura 76. Selección de destrezas de Lengua y Literatura del nivel prerrequisito.*\n\n*Figura 77. Selección de destrezas de Matemática del nivel prerrequisito.*\n\n*Figura 78. Diagnóstico socioemocional, nota DECE y preguntas de reflexión.*\n\n> Sugerir con IA (técnicas + nota DECE) reemplaza lo que haya escrito en Nota de coordinación con DECE y en Preguntas de reflexión del cierre.\n\n***Semanas 2 y 3***\n\n1. Elija **Semana 2 — base** o **Semana 3 — consolidación** y seleccione las destrezas de Lengua y Literatura y de Matemática para cada semana. Puede quitar una destreza con la ✕.\n\n*Figura 79. Paso Semanas 2-3: selección de la semana y buscadores de destrezas.*\n\n*Figura 80. Destrezas de Lengua y Literatura para la nivelación.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "*Figura 81. Destrezas de Matemática para la nivelación.*\n\nPriorice las destrezas con mayores dificultades en el diagnóstico. Si una semana queda vacía, la IA la completa al generar el plan.\n\nEn Bachillerato Técnico se trabajan, además, los aspectos técnicos: en la semana 1, **Reconocimiento** **de espacios técnicos** (talleres, laboratorios, granjas) y los **Criterios técnicos del módulo**, que se agregan al diagnóstico con un toque; en las semanas 2 y 3, la sección **Nivelación técnica**.\n\n*Figura 82. Reconocimiento de espacios técnicos y criterios del módulo en Bachillerato Técnico.*\n\n1. Haga clic en **Sugerir parejas con IA (por destreza)** y registre, en cada tarjeta, el **Estudiante que** **apoya** y el **Estudiante apoyado**. Use **+ Agregar pareja de co-nivelación** para parejas adicionales.\n\n*Figura 83. Sugerencias de la IA para las parejas de co-nivelación.*\n\n*Figura 84. Registro de los estudiantes emparejados por destreza.*\n\n> La IA propone una pareja por destreza con el enfoque de la tutoría, pero no inventa nombres. Forme las parejas según el diagnóstico.\n\n***Semanas 4 y 5: proyecto***\n\nLa pantalla advierte que el proyecto “constituye formalmente una evaluación cualitativa y formativa oficial”. La semana 4 se dedica a planificar y elaborar un producto intermedio, y la semana 5 a socializar el producto final y reflexionar.\n\n1. Complete el proyecto según el cronograma de su régimen y zona. Puede redactarlo o usar **Sugerir proyecto con IA**, que solo rellena los campos vacíos.\n2. En **Destrezas a reforzar**, marque las destrezas del diagnóstico de la semana 1 que trabajará el proyecto.\n\n*Figura 85. Semanas 4-5: sugerencia de la IA, título, descripción y áreas a integrar.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "*Figura 86. Destrezas a reforzar, productos, objetivos y actividades de las semanas 4 y 5.*\n\n| **Campo** | **Descripción** |\n| --- | --- |\n| **Título**, **Descripción / notas** y **Objetivo de** **aprendizaje** | Identidad y propósito del proyecto. Si quedan vacíos, la IA los sugiere. |\n| **Áreas a integrar** | Una por línea, por ejemplo: CN, CS, ECA. |\n| **Producto intermedio** y **Producto final** | Entregables de las semanas 4 y 5. |\n| **Objetivo** y **Actividades** de cada semana | Metas y actividades, una por línea. |\n| **Compromisos** y **Preguntas de** **autoevaluación** | Cierre reflexivo y metacognición. |\n\nLa **Rúbrica del proyecto (vista previa)** se deriva de las destrezas a reforzar, con sus indicadores reales del catálogo, y usa la escala Avanzado (10-9), Intermedio (8-7), Básico (6-5) y En Desarrollo (4-1) al calificar.\n\n*Figura 87. Compromisos, autoevaluación y rúbrica del proyecto derivada de las destrezas.*\n\nEn Bachillerato Técnico, el proyecto se sustituye por un **producto acreditable**: elija su tipo (por ejemplo, maqueta, software básico o plan de negocio) y describa sus actividades. En la nivelación técnica, para cada resultado de aprendizaje indique la semana, la actividad y la **Articulación con** **Matemática**.\n\n*Figura 88. Nivelación técnica por resultados de aprendizaje del módulo en Bachillerato Técnico.*\n\n1. Haga clic en **Generar Plan Conecta, Nivela y Crea**. El plan se guarda y el asistente pasa al paso **Diagnóstico**.\n\n*Figura 89. Vista previa de la rúbrica y botón Generar Plan Conecta, Nivela y Crea.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.5. Conecta Nivela y Crea",
  "seccionId": "5-5-conecta-nivela-y-crea",
  "texto": "La IA elabora el cronograma y completa solo los campos vacíos, incluidos los indicadores DUA de las actividades de la semana 1; nunca sobrescribe lo que usted escribió. En **Diagnóstico** puede crear una evaluación o vincular una ya aplicada con **Vincular a Semana 1**. Al finalizar se muestra el resumen, desde el cual puede descargar la planificación en **Word** o **PDF**, abrir **Ver plan guardado** e imprimir la prueba diagnóstica:\n\n*Figura 90. Resultado: exportación, plan guardado, cronograma y adaptación sugerida.*\n\n*Figura 91. Resumen del plan: diagnóstico socioemocional, reflexión y fase Nivela.*\n\n*Figura 92. Resumen del plan: parejas de co-nivelación y proyecto interdisciplinario.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.6. Evaluación diagnóstica",
  "seccionId": "5-6-evaluacion-diagnostica",
  "texto": "La evaluación diagnóstica permite conocer el punto de partida del estudiantado. El documento Herramientas sugeridas para la evaluación diagnóstica (MINEDUC, 2026) la define como una valoración cualitativa previa al abordaje curricular, que sirve para detectar a tiempo necesidades de refuerzo pedagógico, y recomienda evitar los ítems de simple memorización. Puede crearse de dos maneras:\n\n- Desde **Conecta Nivela y Crea**, con los datos y destrezas precargados y el área limitada a Lengua y Literatura o Matemática (se recomienda una prueba por área).\n- De forma independiente, desde **Crear › Contextuales › Evaluación diagnóstica**, completando el año lectivo, el grado y el paralelo.\n\nEn el paso **Contexto** complete el nombre de la evaluación (puede usar **Generar nombre con IA**), el área, la fecha, la duración, las instrucciones y el puntaje total, además de los umbrales **Dominado ≥** **(%)** (por defecto, 70) y **Refuerzo < (%)** (por defecto, 40). Luego haga clic en **Continuar ›**.\n\n*Figura 93. Paso Contexto de la Evaluación diagnóstica iniciada desde Crear.*\n\n| **Nivel de logro** | **Regla de cálculo** | **Valores por defecto** |\n| --- | --- | --- |\n| Dominado | Logro mayor o igual que **Dominado ≥ (%)** | 70 % o más |\n| En proceso | Logro entre ambos umbrales | De 40 % a menos de 70 % |\n| Requiere refuerzo | Logro menor que **Refuerzo < (%)** | Menos de 40 % |\n\nEl logro se calcula por estudiante y destreza como el porcentaje de preguntas acertadas; las no respondidas cuentan como incorrectas. En el curso, cada destreza toma el nivel de la mayoría de los estudiantes.\n\nEl proceso consta de cinco pasos: **Contexto**, **DCD**, **Preguntas**, **Matriz** y **Revisar**.\n\n1. En el paso **Diagnóstico** de Conecta Nivela y Crea, haga clic en **Crear evaluación diagnóstica**."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.6. Evaluación diagnóstica",
  "seccionId": "5-6-evaluacion-diagnostica",
  "texto": "*Figura 94. Botón Crear evaluación diagnóstica en el paso Diagnóstico.*\n\n2. Elija la asignatura y defina los parámetros de la prueba: duración e instrucciones para los estudiantes. Haga clic en **Continuar ›**.\n\n*Figura 95. Paso Contexto con el área limitada a Lengua y Literatura y Matemática.*\n\n3. Revise las destrezas preseleccionadas desde el plan. Si necesita más, agréguelas y haga clic en **Continuar ›**.\n\nPor defecto se ofrece el nivel **Prerrequisito (arrastre)**, y puede añadir el **Nivel actual del curso**.\n\n*Figura 96. Selección de las destrezas (DCD) a diagnosticar.*\n\n1. Haga clic en **Sugerir preguntas con IA** o en **+ Crear pregunta manualmente**.\n\n*Figura 97. Paso Preguntas con las opciones de IA y de creación manual.*\n\nLa IA propone dos preguntas por destreza, basadas en sus indicadores: una objetiva (selección múltiple o verdadero/falso) y otra abierta, calibrada con la taxonomía de Marzano, cada una con retroalimentación. Algunas opciones pueden ser visuales. Las preguntas manuales requieren enunciado y destreza asociada, y se guardan en su banco de preguntas.\n\n1. Marque las preguntas que desea usar y haga clic en **Incorporar seleccionadas**.\n\n*Figura 98. Sugerencias de la IA marcadas para incorporar.*\n\n2. Revise la distribución de preguntas por destreza. Puede moverlas entre destrezas y ajustar los puntajes.\n\nLa matriz compara la suma de puntajes con el puntaje total, en verde si coinciden y en rojo si no.\n\n*Figura 99. Matriz de distribución de preguntas y puntajes por destreza.*\n\n1. Revise el resumen y haga clic en **Guardar**.\n\n*Figura 100. Resumen de la evaluación diagnóstica antes de guardar.*\n\n> Desde Crear, el paso final ofrece Guardar borrador y Publicar evaluación; para publicar, la suma de puntajes debe coincidir con el puntaje total."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.6. Evaluación diagnóstica",
  "seccionId": "5-6-evaluacion-diagnostica",
  "texto": "Las pruebas guardadas se visualizan en la siguiente pantalla; mientras no estén aplicadas muestran “Debe ser aplicada primero para vincular sus resultados”:\n\n*Figura 101. Pruebas diagnósticas guardadas en el paso Diagnóstico.*\n\nAl hacer clic en **Imprimir prueba** se despliega el listado de pruebas para visualizarlas (**Ver**) o imprimirlas con el icono de impresora; active **Clave de respuestas** si desea la versión con las respuestas correctas. Desde el detalle de la evaluación puede exportarla en **Word**, que incluye las preguntas con sus opciones visuales, registrar las respuestas de los estudiantes, ver las recomendaciones y enviar el diagnóstico a un plan con **→ CNC**.\n\n*Figura 102. Listado de pruebas para visualizar o imprimir.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7. Proyecto Interdisciplinar",
  "seccionId": "5-7-proyecto-interdisciplinar",
  "texto": "Ruta: **Crear › Programaciones › Proyecto Interdisciplinar**.\n\nEl módulo Proyecto Interdisciplinar permite planificar un proyecto que integra dos o más áreas o asignaturas alrededor de un producto final común. En lugar de planificar cada asignatura por separado, el docente (o el equipo de docentes) elige los elementos curriculares de cada área que el proyecto va a movilizar, y la aplicación organiza las actividades del proyecto en tres fases: **Planificación**, **Gestión** y **Evaluación**."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.1. Fundamento normativo",
  "seccionId": "5-7-1-fundamento-normativo",
  "texto": "Según los Lineamientos pedagógicos de inicio de año lectivo Sierra-Amazonía 2026-2027, en el Bachillerato en Ciencias la integración de los aprendizajes se logra articulando las áreas del conocimiento mediante proyectos interdisciplinarios que permiten comprender y resolver situaciones complejas; el mismo documento señala que la Guía Docente del Programa Piloto incluye orientaciones sobre proyectos interdisciplinarios. Las Generalidades del Currículo Nacional por Competencias (EGB y BG) destacan, además, el aprendizaje interdisciplinar y las conexiones interdisciplinarias como un rasgo del nuevo currículo, y la presentación oficial sobre el currículo por competencias incluye los proyectos interdisciplinarios entre sus recursos educativos, junto a metodologías activas como el aprendizaje basado en proyectos.\n\nLa aplicación ofrece dos bases curriculares, que se eligen al crear el proyecto y no pueden mezclarse dentro del mismo proyecto:\n\n| **Base curricular** | **Cuándo usarla** | **Observación** |\n| --- | --- | --- |\n| Destrezas con criterios de desempeño | Instituciones que trabajan con el currículo de destrezas (Currículo Priorizado vigente). | La aplicación indica que sigue el instructivo oficial de Proyecto Interdisciplinar (EGB Superior/BGU). |\n| Competencias específicas (CNC) | Instituciones del Programa Piloto del Currículo Nacional por Competencias (Zona 6). | La propia aplicación advierte que aún no hay un formato oficial publicado de Proyecto Interdisciplinar para este currículo. |"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.2. Pantalla de proyectos",
  "seccionId": "5-7-2-pantalla-de-proyectos",
  "texto": "Al ingresar al módulo se muestra el listado de sus proyectos interdisciplinarios. Cada tarjeta presenta el título, la base curricular (**Destrezas** o **Competencias (CNC)**), la institución y el estado (**Borrador** o **Generado**). Desde cada tarjeta puede usar **Abrir**, **Duplicar** o **Eliminar**. El cuadro de búsqueda permite filtrar por título, área o código curricular.\n\n1. Haga clic en **Nuevo Proyecto Interdisciplinar**.\n\n*Figura 103. Botón Nuevo Proyecto Interdisciplinar.*\n\n2. En la pantalla **Nuevo Proyecto Interdisciplinar**, elija la base curricular del proyecto: **Destrezas** **con criterios de desempeño** o **Competencias específicas (CNC)**.\n\n*Figura 104. Selección de la base curricular del proyecto interdisciplinario.*\n\n> La base curricular no se puede cambiar después de creado el proyecto, ni se pueden combinar destrezas y competencias específicas en un mismo proyecto. Si se equivocó de base, cree un proyecto nuevo."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.3. Proyecto por destrezas con criterios de desempeño",
  "seccionId": "5-7-3-proyecto-por-destrezas-con-criterios-de-desempeno",
  "texto": "El formulario se organiza en secciones: **Contexto curricular**, **Proyecto**, **Información institucional** y **Competencias de varias asignaturas**. Solo unos pocos campos son obligatorios; los demás son opcionales porque la IA los completa si se dejan vacíos.\n\n1. En **Contexto curricular**, elija el **Subnivel** (Básica Elemental, Básica Media, Básica Superior o Bachillerato) y el **Grado**.\n2. En la sección **Proyecto**, complete los datos del proyecto según la tabla siguiente.\n\n*Figura 105. Datos del proyecto por destrezas (1 de 2).*\n\n*Figura 106. Datos del proyecto por destrezas (2 de 2).*\n\n***Descripción de los campos del proyecto***\n\n| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| Subnivel / Grado | Contexto curricular del proyecto. Determina qué destrezas aparecen en el catálogo. | Básica Superior, 9.º. Si lo cambia después de elegir destrezas, se quitan las que no pertenecen al nuevo grado. |\n| Nombre del proyecto | Título del proyecto. Incluye el botón **Sugerir con IA**. | “Guardianes del patrimonio natural y cultural”. |\n| Descripción preliminar | Descripción breve de la situación o contexto del proyecto. | Opcional; si la deja vacía, la IA la redacta. |\n| Desafío / pregunta guía | Pregunta abierta que orienta la indagación de los estudiantes. | Opcional. La aplicación aclara que es un campo propuesto para facilitar el trabajo, no confirmado como campo oficial del instructivo. |\n| Producto preferido | Producto final tangible y evaluable en el que confluyen las áreas. | Opcional. Ej.: stand, dossier, podcast. |\n| Duración | Tiempo previsto para el proyecto. | Obligatorio para generar. Ej.: 4 semanas, 1 trimestre. |"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.3. Proyecto por destrezas con criterios de desempeño",
  "seccionId": "5-7-3-proyecto-por-destrezas-con-criterios-de-desempeno",
  "texto": "1. En **Información institucional**, escriba el nombre de la **Institución** (obligatorio) y los **Docentes** **participantes**, un nombre por línea.\n\n*Figura 107. Información institucional del proyecto.*\n\n2. En **Competencias de varias asignaturas**, busque las destrezas por código, área o texto en el cuadro de búsqueda y marque la casilla de cada una que desee incluir. Las destrezas seleccionadas aparecen como etiquetas en la parte superior; para quitar una, haga clic en la **×** de su etiqueta.\n3. Verifique el contador bajo el título de la sección, que indica cuántos elementos y cuántas áreas distintas ha seleccionado.\n4. Haga clic en **Generar planificación**.\n\n*Figura 108. Selección de destrezas de varias asignaturas.*\n\n***Validaciones del sistema***\n\n- Debe elegir al menos dos elementos curriculares de al menos dos áreas distintas; de lo contrario aparece el aviso “Faltan competencias”.\n- La **Duración** y la **Institución** son obligatorias; si faltan, aparece el aviso “Faltan datos”.\n- Si cambia el subnivel o el grado después de elegir destrezas, el sistema quita las que no correspondan y muestra el aviso “Elementos quitados”.\n- Puede usar **Guardar borrador** (barra inferior) en cualquier momento para guardar lo avanzado sin generar.\n\nDurante la generación el botón muestra “Generando…”. La IA respeta los campos que usted ya escribió (título, descripción, pregunta guía y producto) y completa los que dejó vacíos; no modifica ni inventa códigos curriculares, solo usa las destrezas que usted seleccionó. Al terminar aparece el mensaje “Proyecto generado” y el proyecto queda en estado **Generado**.\n\nEl sistema genera el proyecto con los siguientes elementos:"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.3. Proyecto por destrezas con criterios de desempeño",
  "seccionId": "5-7-3-proyecto-por-destrezas-con-criterios-de-desempeno",
  "texto": "- **Objetivo general**: una oración en infinitivo que integra las áreas elegidas.\n- **Actividades por fase**: dos actividades en cada fase (**Planificación**, **Gestión** y **Evaluación**), cada una con la actividad, los **Recursos**, la **Evidencia** que produce y su **Evaluación**.\n- **Instrumento de evaluación** por actividad (lista de cotejo, rúbrica, escala de valoración, guía de observación, portafolio, etc.) con dos o tres criterios a valorar.\n- **Evaluación general** del proyecto, orientada a rúbrica y/o portafolio.\n\n*Figura 109. Resultado del proyecto por destrezas (1 de 2).*\n\n*Figura 110. Resultado del proyecto por destrezas (2 de 2).*\n\nTodos los campos del resultado son editables. En cada actividad puede modificar el **Instrumento de** **evaluación** y marcar o desmarcar, en **Criterios / indicadores vinculados**, los códigos de las destrezas que esa actividad evalúa:\n\n*Figura 111. Edición de criterios e indicadores vinculados a cada actividad.*\n\n1. Para completar los instrumentos que falten, haga clic en **Sugerir instrumentos de evaluación** **con IA**; la IA solo completa las actividades que aún no tienen instrumento.\n2. Para reemplazar el instrumento de una actividad concreta, haga clic en **Sugerir con IA** junto al campo **Instrumento de evaluación** de esa actividad.\n\n*Figura 112. Edición de instrumentos de evaluación.*\n\n> La IA varía el tipo de instrumento según la evidencia de cada actividad. Revise que el instrumento permita observar realmente lo que declara la destreza y ajuste los criterios a la realidad de su grupo.\n\nFinalmente, exporte el proyecto:\n\n1. Haga clic en **Exportar a Word** o en **Exportar a PDF**. En la versión web, el PDF se abre en una ventana nueva; si no la ve, revise el bloqueador de ventanas emergentes del navegador."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.3. Proyecto por destrezas con criterios de desempeño",
  "seccionId": "5-7-3-proyecto-por-destrezas-con-criterios-de-desempeno",
  "texto": "*Figura 113. Exportación del proyecto.*\n\n> Las propuestas de la IA se basan en los lineamientos técnicos oficiales, pero es responsabilidad del docente validarlas y ajustarlas conforme a las disposiciones de su institución educativa y de su distrito, tal como indica el aviso que aparece junto al botón de generación."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.4. Proyecto por competencias específicas",
  "seccionId": "5-7-4-proyecto-por-competencias-especificas",
  "texto": "Este tipo de proyecto integra varias áreas alrededor de un producto final común, pero toma como base las competencias específicas del Currículo Nacional por Competencias (CNC). Según las Generalidades del Currículo Nacional por Competencias, la competencia específica es un desempeño observable que integra conocimientos, habilidades, actitudes y valores, y concreta las siete competencias clave del Sistema Nacional de Educación para cada área y subnivel. El formulario y el resultado son los mismos que en el proyecto por destrezas; solo cambia el contexto curricular y el catálogo de elementos.\n\n1. En **Contexto curricular**, elija el **Nivel** (ELEMENTAL, MEDIA, SUPERIOR o BACHILLERATO) y el **Grado**.\n2. Seleccione al menos dos competencias específicas de áreas distintas en el catálogo; la IA elabora el resto.\n\n*Figura 114. Selección del nivel y elementos curriculares.*\n\n*Figura 115. Competencias específicas de áreas distintas.*\n\nLas competencias se identifican con su código oficial. Según las Generalidades del CNC, un código como CE.LL.2.1 indica: CE (competencia específica), el área (LL, Lengua y Literatura), el número del subnivel (2, Elemental) y el número de la competencia. Use este código para buscar rápidamente en el catálogo.\n\n1. Complete los datos del proyecto (nombre, descripción preliminar, pregunta guía, producto preferido y **Duración**) y los datos institucionales (**Institución** y **Docentes participantes**).\n\n*Figura 116. Datos institucionales del proyecto por competencias.*\n\n2. Revise las competencias seleccionadas y haga clic en **Generar planificación**.\n\n*Figura 117. Selección de competencias.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.7.4. Proyecto por competencias específicas",
  "seccionId": "5-7-4-proyecto-por-competencias-especificas",
  "texto": "Se aplican las mismas validaciones que en el proyecto por destrezas: al menos dos elementos de dos áreas distintas, y la duración y la institución completas. El sistema presenta el resultado con el objetivo general, las actividades de las tres fases, sus instrumentos de evaluación y la evaluación general, todos editables:\n\n*Figura 118. Resultado del proyecto por competencias (1 de 4).*\n\n*Figura 119. Resultado del proyecto por competencias (2 de 4).*\n\n*Figura 120. Resultado del proyecto por competencias (3 de 4).*\n\n*Figura 121. Resultado del proyecto por competencias (4 de 4).*\n\n> Elija competencias que realmente converjan en un mismo producto y formule la pregunta guía a partir de una situación real del entorno de los estudiantes; la integración debe ser genuina y no una suma de actividades aisladas por área.\n\nFinalmente, exporte el proyecto:\n\n1. Haga clic en **Exportar a Word** o en **Exportar a PDF**.\n\n*Figura 122. Exportación del proyecto por competencias.*\n\n> Como aún no existe un formato oficial de Proyecto Interdisciplinar para el Currículo Nacional por Competencias, verifique con la autoridad o la comisión pedagógica de su institución el formato que debe presentar."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.8. Bachillerato Técnico",
  "seccionId": "5-8-bachillerato-tecnico",
  "texto": "Ruta: **Crear › Programaciones › Bachillerato Técnico**. Permite elaborar la planificación de una unidad de trabajo dentro de un módulo formativo de una figura profesional del Bachillerato Técnico."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.8.1. Fundamento normativo",
  "seccionId": "5-8-1-fundamento-normativo",
  "texto": "El Bachillerato Técnico organiza su oferta en áreas, familias profesionales y figuras profesionales. El Acuerdo Ministerial Nro. MINEDUC-MINEDUC-2025-00031-A, que regula el Bachillerato Técnico para personas jóvenes, adultas y adultas mayores con escolaridad inconclusa, distribuye las figuras en tres áreas (Técnica, Deportes y salud, Artística) y define el período pedagógico como la unidad mínima de tiempo de enseñanza. El mismo acuerdo establece el módulo de Formación en Centros de Trabajo (FCT) para la formación práctica del estudiantado. La aplicación usa estas mismas tres áreas para organizar su catálogo.\n\nCada figura profesional se estructura en módulos formativos. Según la caracterización oficial de las familias profesionales, cada módulo se vincula con una unidad de competencia (UC), que se desagrega en elementos de competencia (EC) y estos en criterios de desempeño (CD). Algunos módulos se expresan, en cambio, mediante resultados de aprendizaje (RA) con sus criterios de evaluación (CE). La planificación que genera la aplicación se ancla exclusivamente en esos criterios.\n\n1. En la pantalla **Bachillerato Técnico**, haga clic en la pestaña del área de la figura profesional: **Técnica**, **Deportes y Salud** o **Artística**.\n\n*Figura 123. Selección del área técnica.*\n\n2. Haga clic en la familia profesional para desplegarla y luego haga clic en la tarjeta de la figura profesional.\n\n*Figura 124. Selección de la figura profesional.*\n\nSe abre el asistente de planificación de la figura, con una barra de progreso de cinco pasos: **Módulo**, **Competencia**, **Unidad**, **Generar** y **Resultado**. Use **Siguiente →** y **← Anterior** para moverse entre pasos."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.8.1. Fundamento normativo",
  "seccionId": "5-8-1-fundamento-normativo",
  "texto": "1. En **Selecciona el módulo formativo**, haga clic en el módulo que desea planificar. Bajo el nombre de cada módulo se indica su categoría y el año en que se cursa.\n\n*Figura 125. Selección del módulo formativo.*\n\n2. En **Unidad(es) de Competencia**, marque una o varias unidades de competencia; debajo de cada una se listan sus elementos de competencia.\n3. En **Resultado(s) de Aprendizaje**, marque los resultados de aprendizaje que correspondan, si el módulo los tiene.\n4. Haga clic en **Siguiente →**.\n\n*Figura 126. Unidad de competencia y resultados de aprendizaje.*\n\n> Si un módulo no tiene unidades de competencia, la aplicación lo indica y solo muestra resultados de aprendizaje, y viceversa. Debe seleccionar al menos una unidad de competencia o un resultado de aprendizaje para continuar; los criterios de esos elementos son los que usará la IA.\n\n5. Complete los datos institucionales y de la unidad de trabajo según la tabla siguiente y haga clic en **Siguiente →**.\n\n*Figura 127. Datos institucionales y de la unidad de trabajo.*\n\n***Descripción de los campos***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.8.1. Fundamento normativo",
  "seccionId": "5-8-1-fundamento-normativo",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| Institución educativa | Nombre de la unidad educativa. | Aparece en el encabezado del documento. |\n| Docente | Nombre del docente responsable del módulo. |  |\n| Curso | Curso del Bachillerato Técnico. | Ej.: 1ro de Bachillerato. |\n| Paralelo | Paralelo del curso. | Ej.: A. |\n| Año lectivo | Periodo lectivo de la planificación. | Viene precargado; corríjalo si no corresponde a su año lectivo. |\n| Nombre de la Unidad de Trabajo | Título de la unidad que va a planificar. | Obligatorio: sin él no se puede avanzar. |\n| Tiempo estimado (periodos pedagógicos) | Número de períodos pedagógicos previstos para la unidad. | Valor numérico. Si lo deja vacío, la generación usa 10 períodos. |\n\n1. En el paso **Generar**, revise el **Resumen**: módulo, unidad de trabajo y número de criterios seleccionados.\n2. Haga clic en **Generar Unidad de Trabajo**. La generación puede tardar entre 15 y 30 segundos.\n\n*Figura 128. Generación de la planificación de Bachillerato Técnico.*\n\nLa IA genera tres procedimientos, cada uno con nombre, objetivo, tiempo, fases de la actividad (de dos a cinco), recursos, y técnica e instrumento de evaluación; además, los **Contenidos** (conceptuales, procedimentales y actitudinales) y las **Estrategias metodológicas** de la unidad. Los procedimientos se derivan exclusivamente de los criterios de desempeño o de evaluación seleccionados, y cada uno queda vinculado a esos criterios.\n\nEl sistema presenta el resultado bajo el mensaje “Unidad de Trabajo generada”:\n\n*Figura 129. Resultado de la planificación de Bachillerato Técnico.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.8.1. Fundamento normativo",
  "seccionId": "5-8-1-fundamento-normativo",
  "texto": "En esta pantalla el resultado se muestra para revisión y no tiene campos de edición. Si necesita otro enfoque, vuelva con **← Anterior**, ajuste la selección o los datos y genere de nuevo; los ajustes finos puede hacerlos en el documento Word exportado.\n\n1. Haga clic en **Guardar planificación**. Aparece el mensaje “Planificación BT guardada” y el botón cambia a ✓ **Guardado — actualizar**, que puede usar para guardar de nuevo si hace cambios.\n2. Haga clic en **Exportar como Word (.docx)** o en **Exportar como PDF**.\n\n*Figura 130. Guardado y exportación de la planificación técnica.*\n\n***Recomendaciones pedagógicas***\n\n- Seleccione solo las unidades de competencia o resultados de aprendizaje que realmente trabajará en la unidad; cuantos más criterios elija, más amplia será la unidad de trabajo.\n- Ajuste el tiempo estimado a la carga horaria real del módulo en su institución.\n- Según los Lineamientos 2026-2027, en el Bachillerato Técnico predomina el aprender haciendo mediante talleres, laboratorios, simulaciones y experiencias en contextos reales; verifique que los procedimientos generados puedan ejecutarse con los recursos de su taller o laboratorio."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9. Currículo por Competencias",
  "seccionId": "5-9-curriculo-por-competencias",
  "texto": "Ruta: **Crear › Currículo › Currículo por Competencias**. Responde al Programa Piloto del Currículo Nacional por Competencias del régimen Sierra-Amazonía. La pantalla del módulo se identifica como “Planificaciones por competencias — Plan Piloto” y lista las planificaciones creadas, con filtros por tipo."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.1. Fundamento normativo",
  "seccionId": "5-9-1-fundamento-normativo",
  "texto": "Según los Lineamientos pedagógicos de inicio de año lectivo Sierra-Amazonía 2026-2027, las instituciones educativas fiscales interculturales de la Zona 6 forman parte del Programa Piloto para la implementación del Currículo Nacional por Competencias. Las Generalidades del currículo por competencias (para EGB y BG, y para Inicial y Preparatoria) explican su estructura:\n\n- **Competencias clave**: siete competencias del Sistema Nacional de Educación (comunicativa; matemática y en ciencia y tecnología; ciudadana, identidad y conciencia cultural; digital; socioemocional; de expresiones culturales y artísticas; y de innovación y transformación).\n- **Competencias específicas**: concretan las competencias clave en aprendizajes esperados para cada área o currículo integrado y cada subnivel.\n- **Indicadores de evaluación**: enunciados observables y verificables del nivel de desempeño esperado en cada competencia específica.\n- **Saberes**: declarativos, procedimentales y actitudinales, que sustentan el desarrollo de la competencia.\n- **Orientaciones metodológicas** y **conexiones interdisciplinarias**, que orientan la planificación de experiencias y situaciones de aprendizaje.\n1. Haga clic en **Nueva Planificación**.\n\n*Figura 131. Botón Nueva Planificación.*\n\n2. En la pantalla **Nueva Planificación**, elija el tipo de planificación: **Inicial / Preparatoria** o **Currículo Integrado (EGB / BGU)**.\n\n*Figura 132. Selección del tipo de planificación.*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.2. Inicial y Preparatoria",
  "seccionId": "5-9-2-inicial-y-preparatoria",
  "texto": "Este flujo corresponde a la planificación de Educación Inicial con el currículo integrado por ámbitos de desarrollo y aprendizaje. La pantalla se identifica como “Módulo experimental · Fase piloto (Zona 6)” y genera una planificación microcurricular multigrado. Según los Lineamientos 2026-2027, en Inicial se usa el Currículo Nacional por Competencias con la metodología juego-trabajo, y la planificación se concreta en experiencias de aprendizaje significativas y contextualizadas.\n\nEl asistente tiene cuatro pasos: **Contexto curricular**, **Competencias específicas**, **Datos administrativos** y **Generar**.\n\n1. En **Contexto curricular**, seleccione en **Grados del aula** uno o ambos grados: **Inicial 3-4 años** e **Inicial 4-5 años**. Cada grado seleccionado será una columna de la planificación multigrado.\n\n*Figura 133. Selección del grado de Inicial.*\n\n2. En **Competencias específicas**, busque por código o texto y haga clic en cada competencia para agregarla. Debe elegir al menos una para poder avanzar.\n\n*Figura 134. Selección de competencias.*\n\nLas competencias de este currículo usan el código CI (Currículo Integrado), por ejemplo CE.CI.1.1. Según las Generalidades del currículo por competencias de Inicial y Preparatoria, en los saberes el código indica también el subnivel, el ámbito de desarrollo y aprendizaje, y el tipo de saber. Los indicadores y saberes de cada competencia se resuelven por grado al generar la planificación.\n\n1. En **Datos administrativos**, complete los datos institucionales y los de la situación de aprendizaje según la tabla siguiente.\n\n*Figura 135. Datos institucionales.*\n\n*Figura 136. Datos de la situación de aprendizaje.*\n\n***Descripción de los campos***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.2. Inicial y Preparatoria",
  "seccionId": "5-9-2-inicial-y-preparatoria",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| Institución | Nombre de la unidad educativa. |  |\n| Trimestre | Trimestre que se planifica. | Primer, Segundo o Tercer trimestre. |\n| Paralelo | Paralelo del aula. | A, B, C, D o E. |\n| N.° de semanas | Semanas de clase que cubre la planificación. | Valor numérico. |\n| Título | Nombre de la situación o experiencia de aprendizaje. | Ej.: Mis nuevos amigos; Explorando la naturaleza. |\n| Situación de aprendizaje | Descripción de la situación que da sentido a las actividades. | Opcional. |\n| Temas del trimestre | Un tema por línea; cada tema se convierte en una clase. | Opcional. Ej.: Mis emociones; Mi familia. |\n| Docente | Nombre del docente. |  |\n\nEn esta pantalla también se encuentran dos interruptores, disponibles igualmente en el currículo integrado de EGB y BGU:"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.2. Inicial y Preparatoria",
  "seccionId": "5-9-2-inicial-y-preparatoria",
  "texto": "- **¿Hay estudiantes con NEE en este paralelo?**: al guardar la planificación con esta opción activa, el sistema pregunta si desea crear una adaptación curricular individual para cada estudiante con necesidades educativas específicas y abre el módulo **Adaptación curricular** con los datos de esta planificación precargados (institución, docente, grado, paralelo, trimestre y la competencia o destreza de referencia), todos editables. En la vista del plan guardado aparece además el botón **Crear adaptación curricular (NEE)**.\n- **¿Compartir con la comunidad?**: publica la planificación en la pestaña **Comunidad** para que otros docentes puedan consultarla y duplicarla. Otros docentes podrán ver y duplicar esta planificación sin sus datos personales ni los de su institución.\n1. Haga clic en **Siguiente**.\n2. En **Generar**, revise el **Resumen** (grado, trimestre, paralelo, semanas, competencias y título).\n3. Haga clic en **Generar planificación**.\n\n*Figura 137. Resumen previo a la generación.*\n\nLa planificación queda guardada y se abre su vista de detalle. Desde allí puede **Editar**, exportar en **Word** o **PDF**, o **Eliminar** la planificación. El documento Word de Inicial se genera en formato multigrado, en hoja A4 horizontal, con los indicadores y saberes de cada competencia resueltos por grado:\n\n*Figura 138. Resultado del currículo por competencias de Inicial.*\n\n*Figura 139. Opciones de exportación.*\n\n> Si deja vacíos los temas del trimestre, el sistema crea una sola clase a partir del título. Escriba los temas si desea que la planificación tenga una clase por tema."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.3. Currículo integrado: EGB y BGU",
  "seccionId": "5-9-3-curriculo-integrado-egb-y-bgu",
  "texto": "Este flujo corresponde a la planificación de Educación General Básica (Elemental, Media y Superior) y Bachillerato con el Currículo Integrado por Competencias, por asignatura: Lengua y Literatura, Matemática, Ciencias Naturales, Ciencias Sociales, Inglés, Educación Cultural y Artística, y Emprendimiento y Gestión. Preparatoria no aparece aquí porque su currículo integrado se organiza por ámbitos y no por asignatura.\n\nEl asistente tiene cuatro pasos: **Contexto**, **Competencias**, **Datos** y **Generar**.\n\n1. En **Contexto curricular**, elija la **Planificación**: **Un solo grado** o **Multigrado**.\n2. Elija la **Materia**, el **Nivel** y, si planifica un solo grado, el **Grado / Curso**.\n\n*Figura 140. Datos del currículo integrado EGB/BGU.*\n\n> La modalidad Multigrado combina dos o más grados del mismo subnivel en una sola planificación, para aulas multigrado. En ese caso los grados se eligen en el paso siguiente.\n\n3. En **Competencias específicas**, busque por código o texto y agregue las competencias específicas que trabajará. En modalidad multigrado, elija dos o más grados y al menos una competencia específica que cubra a todos.\n\n*Figura 141. Selección de competencias específicas.*\n\nEn modalidad multigrado, el sistema muestra para cada grado el bloque curricular resuelto automáticamente desde el catálogo oficial (**Indicadores de evaluación**, **Saberes declarativos**, **Saberes** **procedimentales** y **Saberes actitudinales**, un ítem por línea). Puede editarlo antes de generar.\n\n1. En **Datos administrativos**, complete los datos informativos y la situación de aprendizaje según la tabla siguiente.\n\n*Figura 142. Datos informativos y situación de aprendizaje.*\n\n***Descripción de los campos***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.3. Currículo integrado: EGB y BGU",
  "seccionId": "5-9-3-curriculo-integrado-egb-y-bgu",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| Institución | Nombre de la unidad educativa. |  |\n| Docente | Nombre del docente. |  |\n| Trimestre | Trimestre que se planifica. | Primer, Segundo o Tercer trimestre. |\n| Paralelo | Paralelo del curso. | A, B, C, D o E. |\n| N.° de semanas | Semanas de clase que cubre la planificación. | Valor numérico. |\n| Título | Título de la situación de aprendizaje. Incluye el botón **Sugerir con IA**, que se activa cuando hay competencias seleccionadas. | Ej.: Pensamiento crítico, voz ética y creación. |\n| Descripción | Descripción de la situación de aprendizaje. | Opcional; si la deja vacía, se redacta a partir de las competencias o de la sugerencia de la IA. |\n| Temas del trimestre | Un tema por línea. | Opcional. |\n\n1. Haga clic en **Siguiente** y revise el **Resumen** (materia, nivel o subnivel, grado o grados, trimestre, paralelo, semanas, competencias y título).\n2. En modalidad multigrado, haga clic en **Generar con IA** para crear el contenido semanal: un tema común por semana y una actividad diferenciada por grado, con inicio, desarrollo, cierre, recursos, técnica e instrumento, todos editables. Si ya existe contenido, el botón se llama **Regenerar con IA**.\n3. Haga clic en **Generar planificación**.\n\n*Figura 143. Resumen del currículo integrado.*\n\nFinalmente, en la vista de detalle de la planificación, exporte en **Word** o **PDF**:\n\n*Figura 144. Exportación del currículo por competencias.*\n\n***Recomendaciones pedagógicas***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.3. Currículo integrado: EGB y BGU",
  "seccionId": "5-9-3-curriculo-integrado-egb-y-bgu",
  "texto": "- Parta de una situación de aprendizaje real y cercana al contexto de los estudiantes, como plantean las Generalidades del currículo por competencias.\n- Revise que los indicadores de evaluación de cada grado sean coherentes con las actividades planificadas y con los instrumentos de evaluación.\n- En aulas multigrado, aproveche el tema común de cada semana para el trabajo colaborativo entre grados y diferencie las actividades según el nivel de cada grupo."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.9.4. Biblioteca comunitaria (Comunidad)",
  "seccionId": "5-9-4-biblioteca-comunitaria-comunidad",
  "texto": "La pestaña **Comunidad** de **Currículo por Competencias** reúne las planificaciones que otros docentes decidieron compartir. Su propósito es facilitar el intercambio de buenas prácticas entre docentes del Programa Piloto y ofrecer un punto de partida para planificar.\n\n1. En **Currículo por Competencias**, seleccione la pestaña **Comunidad**. Las planificaciones se muestran de la más reciente a la más antigua, en tarjetas con el título, el nivel, el grado, las competencias y la fecha. Use **Ver más** para cargar planificaciones anteriores.\n2. Haga clic en una tarjeta para abrir la planificación en modo de solo lectura.\n3. Si desea utilizarla, haga clic en **Duplicar como mío**. El sistema crea una copia propia, no compartida y sin datos del autor, y la abre en el formulario de edición para que la adapte a su grupo.\n\n> **Importante:** antes de compartir, revise que la situación de aprendizaje y las actividades no incluyan nombres de estudiantes u otros datos personales. El sistema elimina automáticamente el nombre del docente, la institución, el paralelo, los firmantes, las observaciones y los datos de estudiantes, pero no puede detectar nombres escritos dentro de textos libres.\n\n> En Mis planificaciones, las planificaciones que usted compartió se identifican con la etiqueta “Compartida”. Para dejar de compartir una planificación, edítela, desactive ¿Compartir con la comunidad? y guarde los cambios."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10. Educación Inicial",
  "seccionId": "5-10-educacion-inicial",
  "texto": "Ruta: **Crear › Niveles educativos › Inicial**.\n\nEl módulo **Planificación Inicial** elabora la planificación semanal por experiencia de aprendizaje para niñas y niños de 3 a 5 años. El documento Word que produce sigue la estructura del Anexo 2 del Instructivo de planificación curricular 2021 del MINEDUC (planificación semanal por experiencia de aprendizaje): datos informativos, objetivo general, una fila por ámbito de desarrollo y aprendizaje con su destreza y proceso metodológico, adaptaciones curriculares, bibliografía, observaciones y firmas."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.1. Fundamento normativo y pedagógico",
  "seccionId": "5-10-1-fundamento-normativo-y-pedagogico",
  "texto": "El Currículo Priorizado de Educación Inicial organiza los aprendizajes en tres ejes de desarrollo y aprendizaje (desarrollo personal y social, descubrimiento del medio natural y cultural, y expresión y comunicación), de los que se derivan los ámbitos; en cada ámbito se proponen destrezas diferenciadas para el grupo de 3 a 4 años y para el de 4 a 5 años. El mismo documento advierte que el logro de las destrezas es continuo y progresivo, depende del ritmo de cada niña y niño y no debe valorarse con criterios de rigidez.\n\nEn cuanto a la metodología, el currículo señala el juego como la estrategia principal del nivel y describe dos formas de organizar el trabajo: el juego-trabajo en rincones y las experiencias de aprendizaje, entendidas como vivencias y actividades desafiantes, diseñadas intencionalmente por el docente a partir del interés de los niños, que producen gozo y asombro. Toda experiencia de aprendizaje se desarrolla en tres momentos (inicio, desarrollo y cierre), que son los mismos que la aplicación utiliza para estructurar cada clase. El Currículo Nacional de Primera Infancia articula esta etapa (3 a 5 años) con la educación de 0 a 3 años y con el subnivel Preparatoria (5 a 6 años).\n\nLa evaluación en Inicial es cualitativa, permanente y formativa: no aprueba ni reprueba, sino que identifica potencialidades y aspectos por fortalecer. Según el Currículo Priorizado de Educación Inicial, la técnica central es la observación, apoyada en instrumentos como la ficha de observación, el registro anecdótico, la lista de cotejo y el portafolio."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.2. Estructura del formulario",
  "seccionId": "5-10-2-estructura-del-formulario",
  "texto": "La pantalla se organiza en cuatro bloques que se completan de arriba hacia abajo: **Datos de la semana**, **Ámbitos de la semana**, **Firmantes** y el botón de exportación. Cada ámbito se presenta como una tarjeta que se puede contraer o expandir tocando su cabecera, y dentro de cada ámbito se agregan una o varias clases.\n\n1. Seleccione el **Grado**: **Inicial 1 (3 a 4 años)** o **Inicial 2 (4 a 5 años)**. De forma predeterminada está seleccionado Inicial 2.\n2. Escriba la **Institución**, el **Docente** y la **Semana (rango de fechas)**.\n3. Si lo requiere, registre **Observaciones** (feriados, eventos) y revise la **Bibliografía** propuesta.\n4. En la tarjeta del ámbito, elija el **Ámbito de desarrollo** y, a continuación, la **Competencia /** **Destreza** en la lista desplazable.\n5. En la sección **Clases de este ámbito**, escriba el **Tema de la clase** y elija la **Metodología**.\n6. Para planificar más clases del mismo ámbito, haga clic en **+ Agregar clase**; para trabajar otro ámbito en la semana, haga clic en **+ Agregar ámbito**.\n\n*Figura 145. Formulario de planificación de Educación Inicial con los datos de la semana y la tarjeta del ámbito.*\n\n***Descripción de los campos: datos de la semana***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.2. Estructura del formulario",
  "seccionId": "5-10-2-estructura-del-formulario",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **Grado** | Grupo de edad para el que se planifica. Determina qué destrezas se muestran (códigos INI.3 para 3 a 4 años e INI.4 para 4 a 5 años) y el objetivo general que se imprime en el Word. | Inicial 2 (4 a 5 años) |\n| **Institución** | Nombre de la institución educativa. Si se deja vacío, el Word muestra un guion. | Unidad Educativa… |\n| **Docente** | Nombre de la o el docente. Es el único dato obligatorio para exportar. | Lcda. Nombre Apellido |\n| **Semana (rango de** **fechas)** | Periodo que cubre la planificación. Se imprime en la celda DURACIÓN/FECHA. | del 19 al 23 de mayo del 2025 |\n| **Observaciones** | Texto libre que se imprime en la fila OBSERVACIONES del documento. | Feriado el viernes; casa abierta |\n| **Bibliografía** | Viene precargada con la referencia al Currículo Priorizado de Educación Inicial del MINEDUC; puede editarse o ampliarse. | Agregue cuentos o recursos utilizados |\n\n> El objetivo general no se escribe en el formulario: la aplicación lo asigna automáticamente según el grado seleccionado y lo imprime en la fila OBJETIVO GENERAL del Word, donde usted puede ajustarlo después de exportar.\n\n***Descripción de los campos: ámbito y clase***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.2. Estructura del formulario",
  "seccionId": "5-10-2-estructura-del-formulario",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **Ámbito de desarrollo** | Uno de los siete ámbitos disponibles: Identidad y Autonomía, Convivencia, Relaciones con el medio natural y cultural, Relaciones lógico-matemáticas, Comprensión y Expresión del Lenguaje, Expresión Artística, y Expresión corporal y motricidad. Al cambiar de ámbito se borra la destreza elegida. | 4. Relaciones lógico- matemáticas |\n| **Competencia /** **Destreza** | Tarjetas con el código y la descripción de las destrezas del ámbito, filtradas por el grado. La destreza seleccionada se muestra resaltada debajo de la lista. | INI.4.1.1 Practicar con autonomía hábitos de higiene personal… |\n| **Tema de la clase** | Tema generador de la clase; es obligatorio para generar con IA. | Color rojo; Conductas positivas |\n| **Metodología** | Una de cuatro opciones: Juego-trabajo (predeterminada), Juego libre, Rincones de aprendizaje o Experiencia directa. Se imprime en el proceso metodológico. | Juego-trabajo |\n| **Método de evaluación** | Selección múltiple entre Observación, Fichas anecdóticas, Fichas de cotejo y Portfolio. Las tres primeras vienen marcadas. En el Word aparece como “Método de observación”. | Observación y Portfolio |\n\n> Si una destreza no aparece, verifique primero el grado: las destrezas de 3 a 4 años solo se muestran con Inicial 1 y las de 4 a 5 años con Inicial 2. Si el ámbito no tiene destrezas registradas para ese grado, la pantalla muestra “No hay destrezas registradas para este ámbito.”"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.3. Generación de la clase con IA",
  "seccionId": "5-10-3-generacion-de-la-clase-con-ia",
  "texto": "1. Escriba el tema y haga clic en **Generar con IA**.\n2. Espere mientras el botón muestra “Generando con IA...”.\n3. Revise el objetivo específico y las actividades propuestas para los momentos **INICIO**, **DESARROLLO** y **CIERRE**.\n4. Si el resultado no se ajusta a su grupo, modifique el tema o la metodología y haga clic en **Regenerar con IA**.\n\nAntes de llamar a la IA, el sistema verifica dos condiciones y, si no se cumplen, muestra un aviso: sin tema aparece “Escribe el tema de la clase primero.” y sin destreza aparece “Selecciona una competencia/destreza en el ámbito.”. La IA recibe el grado, el ámbito, la destreza, el tema, la metodología y el número de clase, y devuelve:\n\n- Un **objetivo específico** redactado en una sola oración con verbo en infinitivo, alineado con la destreza y el tema.\n- Entre cuatro y cinco actividades de **INICIO** (saludo, rutinas de la jornada como clima, fecha y asistencia, canción o motivación y activación del tema).\n- Entre seis y nueve actividades de **DESARROLLO**, basadas en el juego, el movimiento, la canción y el material manipulativo, contextualizadas a la realidad ecuatoriana.\n- Entre tres y cuatro actividades de **CIERRE** (ficha o cuadernillo, retroalimentación, felicitación y despedida).\n- Para cada actividad, los indicadores DUA que le corresponden, representados con cuadros de color: rosa para Representación, azul oscuro para Acción y Expresión y verde para Implicación.\n\n*Figura 146. Resultado de la planificación de Inicial: objetivo específico y leyenda DUA (1 de 2).*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.3. Generación de la clase con IA",
  "seccionId": "5-10-3-generacion-de-la-clase-con-ia",
  "texto": "Cuando la clase ya fue generada aparece el aviso “Generado con IA — puedes editar antes de exportar”. Todo el contenido es editable: puede corregir el objetivo específico, reescribir cualquier actividad, eliminarla con la ✕ o añadir otra con **+ Actividad** en el momento correspondiente. Las\n\nactividades que usted agrega no llevan marcas DUA.\n\n*Figura 147. Resultado de la planificación de Inicial: actividades de inicio, desarrollo y cierre con marcas DUA (2 de 2).*\n\n> La IA propone; la responsabilidad pedagógica es del docente. Verifique que las actividades respeten el ritmo de su grupo, tengan pertinencia cultural y contextual y garanticen la participación de todas las niñas y los niños, tal como exige el Currículo Priorizado de Educación Inicial para una experiencia de aprendizaje."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.4. Firmantes y generación del documento Word",
  "seccionId": "5-10-4-firmantes-y-generacion-del-documento-word",
  "texto": "1. Complete los datos de los firmantes en la sección **Firmantes**: **Elaborado por (nombre docente)**, **Revisado por (nombre)** con su **Cargo**, **Coordinadora/o (nombre)** y **Aprobado por (nombre)** con su **Cargo**.\n2. Haga clic en **Generar Word (.docx)**.\n3. En la versión web, el archivo se descarga automáticamente; en el dispositivo móvil, elija en el diálogo de compartir dónde guardarlo o a quién enviarlo.\n\n*Figura 148. Sección Firmantes y botón Generar Word (.docx).*\n\nLos cargos de revisión y aprobación vienen precargados como DECE y Vicerrector/a, respectivamente, y pueden cambiarse según la organización de su institución. Si no escribe el nombre del docente en **Docente**, la exportación se detiene con el aviso “Ingresa el nombre del docente antes de exportar.”. El archivo se nombra con el patrón PlanInicial-I1 o PlanInicial-I2 seguido de un número de identificación.\n\n***Contenido del documento Word***"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.4. Firmantes y generación del documento Word",
  "seccionId": "5-10-4-firmantes-y-generacion-del-documento-word",
  "texto": "| **Sección del documento** | **Contenido** |\n| --- | --- |\n| Encabezado | Título “PLANIFICACIÓN SEMANAL POR EXPERIENCIA DE APRENDIZAJE”, en hoja A4 horizontal. |\n| Datos informativos | Nombre de la institución, nombre del docente, grado/curso, duración/fecha y objetivo general. |\n| Cuerpo | Columnas ÁMBITOS DE DESARROLLO Y APRENDIZAJE, COMPETENCIA / HABILIDAD, DESTREZA CON CRITERIO DE DESEMPEÑO y PROCESO METODOLÓGICO. Cada clase ocupa una fila con su número y tema, objetivo, metodología, actividades de inicio, desarrollo y cierre con marcas DUA y método de observación. |\n| Adaptaciones curriculares | Tabla con DESCRIPCIÓN DE NEE, COMPETENCIA, DESTREZA y PROCESO METODOLÓGICO. Este módulo la entrega con filas en blanco para completarla a mano. |\n| Cierre | Bibliografía/webgrafía, observaciones y cuatro casillas de firma: elaborado, revisado (DECE y coordinación) y aprobado. |\n\n> El módulo de Inicial no guarda la planificación en Mis planes: los datos permanecen en pantalla solo mientras no la abandone. Genere el Word antes de salir y conserve el archivo.\n\n> El formato oficial de planificación microcurricular 2026-2027 para Inicial y Preparatoria incorpora elementos del currículo por competencias (situación de aprendizaje, competencias específicas, indicadores de evaluación y saberes declarativos, procedimentales y actitudinales). Si su institución exige ese formato, utilice el Word generado como base y complete esos apartados."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.10.5. Recomendaciones pedagógicas",
  "seccionId": "5-10-5-recomendaciones-pedagogicas",
  "texto": "- Parta de un tema generador que surja del interés de los niños o de una situación significativa (una visita, un hallazgo en el patio, un acontecimiento familiar), como recomienda el Currículo Priorizado de Educación Inicial.\n- Si la experiencia se extiende varios días, agregue una clase por día en el mismo ámbito y retome el propósito en cada momento de inicio.\n- Elija Juego-trabajo o Rincones de aprendizaje cuando organice el aula por rincones; recuerde sus momentos de planificación, desarrollo, orden y socialización.\n- Registre la observación de forma sistemática durante la semana (ficha de observación, registro anecdótico o lista de cotejo) y guarde evidencias en el portafolio para el informe cualitativo."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11. Preparatoria",
  "seccionId": "5-11-preparatoria",
  "texto": "Ruta: **Crear › Niveles educativos › Preparatoria**.\n\nEl módulo **Planificación Preparatoria** elabora la planificación semanal del primer grado de Educación General Básica (1.° EGB), subnivel Preparatoria, para niñas y niños de 5 a 6 años. A diferencia de los demás grados de EGB, Preparatoria no se organiza por asignaturas sino por los siete ámbitos del currículo integrador; por ello, en lugar de elegir un área, usted elige un ámbito y dentro de él las destrezas con criterios de desempeño (DCD) de las distintas áreas que lo componen. Este módulo usa el mismo motor de generación y la misma exportación que la planificación semanal de EGB."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.1. Fundamento normativo y pedagógico",
  "seccionId": "5-11-1-fundamento-normativo-y-pedagogico",
  "texto": "El Currículo Priorizado para el subnivel Preparatoria mantiene una estructura por ejes y ámbitos de desarrollo y aprendizaje. Los tres ejes (desarrollo personal y social, descubrimiento del medio natural y cultural, y expresión y comunicación) se despliegan en siete ámbitos: Identidad y autonomía; Convivencia; Descubrimiento y comprensión del medio natural y cultural; Relaciones lógico- matemáticas; Comprensión y expresión oral y escrita; Comprensión y expresión artística; y Expresión corporal. El documento aclara que esta división es solo organizativa y que el aprendizaje no debe segmentarse; además, establece la actividad lúdica como estrategia principal del subnivel y sugiere planificar las destrezas a partir de experiencias de aprendizaje.\n\nCada destreza del subnivel tiene asociados criterios e indicadores de evaluación. La aplicación los envía a la IA para que la evaluación propuesta se derive exclusivamente de la destreza seleccionada."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.2. Datos informativos",
  "seccionId": "5-11-2-datos-informativos",
  "texto": "1. Complete el formulario de planificación, empezando por la sección **1. Datos Informativos**.\n2. Escriba la **Institución Educativa** y el **Nombre Docente**.\n3. Seleccione el **Ámbito de desarrollo y aprendizaje**. Al hacerlo, la aplicación completa **N.º Unidad** con el número del ámbito y **Título de unidad de planificación** con su nombre; ambos campos pueden modificarse.\n4. Seleccione el **Paralelo** y el **Trimestre**, y revise las fechas de **Semana inicio** y **Semana fin**.\n5. Escriba los **Objetivos específicos de la unidad de planificación**.\n\n*Figura 149. Formulario de Preparatoria: sección Datos Informativos (1 de 5).*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.2. Datos informativos",
  "seccionId": "5-11-2-datos-informativos",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **Institución Educativa** | Nombre de la institución. | Escuela Fiscal… |\n| **Nombre Docente** * | Campo obligatorio; sin él no se puede generar la planificación. | Nombre completo |\n| **Ámbito de desarrollo y** **aprendizaje** | Uno de los siete ámbitos. Filtra las DCD disponibles en todas las horas de la semana. Debajo se indica que el grado es 1.° EGB (subnivel único, sin desagregación por grado). | 4. Relaciones lógico- matemáticas |\n| **Paralelo** | Botones A a E. Un segundo clic sobre el mismo paralelo lo deselecciona. | B |\n| **Trimestre** | Primero, Segundo o Tercero. De forma predeterminada, Primero. | Segundo |\n| **Semana inicio** / **Semana fin** | Fechas en formato DD/MM/AAAA. Vienen precargadas con el lunes y el viernes de la semana en curso. | 08/09/2026 – 12/09/2026 |\n| **N.º Unidad** y **Título de** **unidad de planificación** | Se completan al elegir el ámbito y pueden editarse. | 4 – Relaciones lógico- matemáticas |\n| **Objetivos específicos** **de la unidad de** **planificación** | Texto libre de varias líneas. | Redáctelos en función de las destrezas de la semana |"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.3. Configuración por día y por hora",
  "seccionId": "5-11-3-configuracion-por-dia-y-por-hora",
  "texto": "En la sección **2. Configuración por Día** aparece un bloque para cada día, de lunes a viernes. Cada bloque tiene un interruptor para activarlo o desactivarlo; los días desactivados muestran “Día desactivado — no se generará planificación”. Para cada día activo, elija el **Número de horas** (1, 2 o 3) y complete los datos de cada hora.\n\n*Figura 150. Formulario de Preparatoria: configuración del día y número de horas (2 de 5).*\n\n1. Haga clic en el selector **Seleccionar DCD del ámbito...** y elija la destreza en la ventana **Seleccionar DCD**. Puede buscar por código o descripción.\n2. Escriba el **Tema de la hora**.\n3. Opcionalmente, haga clic en **Sugerir alternativas con IA** y elija una propuesta en **Elige una** **alternativa:**.\n4. Marque las **Habilidades Socioemocionales**, las **Metodologías Activas** y las **Técnicas de** **Evaluación** que desea registrar.\n5. Si la configuración se repite, haga clic en **Copiar configuración al siguiente día**.\n\n*Figura 151. Formulario de Preparatoria: selección de la DCD del ámbito (3 de 5).*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.3. Configuración por día y por hora",
  "seccionId": "5-11-3-configuracion-por-dia-y-por-hora",
  "texto": "| **Campo** | **Descripción** | **Ejemplo u observación** |\n| --- | --- | --- |\n| **DCD (Destreza con** **Criterio de Desempeño)** | Abre una ventana con las destrezas del subnivel que pertenecen al ámbito elegido, de cualquier área (Ciencias Naturales, Estudios Sociales, Lengua, Matemática, Inglés, Educación Física o Educación Cultural y Artística). Cada destreza muestra su código y el área. Si aún no eligió ámbito, aparece “Selecciona un ámbito arriba para ver sus destrezas oficiales.” | Busque escribiendo parte del código o de la descripción |\n| **Deporte específico** **(opcional)** | Solo aparece cuando la destreza pertenece a Educación Física. Orienta las actividades hacia un deporte. | Atletismo |\n| **Tema de la hora** | Tema concreto de la clase; es obligatorio para que la hora se incluya en la generación. | Contamos semillas del huerto |\n| **Sugerir alternativas con** **IA** | Se habilita cuando hay destreza y un tema de más de dos caracteres. Propone temas alternativos; al elegir uno, reemplaza el tema escrito. Puede tardar entre 15 y 30 segundos. | Opcional |\n| **Habilidades** **Socioemocionales** | Selección múltiple. Si la destreza tiene habilidades asociadas, se muestran solo esas y quedan marcadas al elegirla. | Autoconocimiento |\n| **Metodologías Activas** | Selección múltiple entre diez metodologías, entre ellas Aprendizaje Basado en el Juego, Aprendizaje Basado en la Experiencia y Aprendizaje por Descubrimiento. Se envían a la IA. | Aprendizaje Basado en el Juego |\n| **Técnicas de Evaluación** | Selección múltiple (Observación, Lista de Cotejo, Rúbrica, Exposición, entre otras). Quedan registradas en la planificación. | Observación |\n\n*Figura 152. Formulario de Preparatoria: tema, sugerencias de la IA y habilidades socioemocionales (4 de 5).*"
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.3. Configuración por día y por hora",
  "seccionId": "5-11-3-configuracion-por-dia-y-por-hora",
  "texto": "*Figura 153. Formulario de Preparatoria: metodologías activas, técnicas de evaluación y copia al siguiente día (5 de 5).*\n\n> La opción Copiar configuración al siguiente día copia al día siguiente la destreza, el tema y todas las selecciones de cada hora. Úsela cuando una misma experiencia de aprendizaje se prolonga varios días y luego ajuste solo el tema."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.4. Generación de la planificación",
  "seccionId": "5-11-4-generacion-de-la-planificacion",
  "texto": "1. Haga clic en **Generar Planificación Semanal**.\n\n*Figura 154. Botón Generar Planificación Semanal de Preparatoria.*\n\nAntes de enviar la solicitud, el sistema valida los datos. Si falta el nombre del docente, aparece “Por favor ingresa el nombre del docente”. Solo se incluyen los días activos y, dentro de ellos, las horas que tienen destreza y tema; si ninguna hora cumple esa condición, aparece “Activa al menos un día con destreza y tema”.\n\nSe muestra la pantalla de espera y, a continuación, el resumen:\n\n*Figura 155. Pantalla de espera “Generando planificación semanal...”.*\n\nLa IA trabaja en paralelo para cada hora de clase; el proceso suele tomar entre 15 y 40 segundos. Si ocurre un error general, la aplicación regresa al formulario y muestra el mensaje en una franja roja en la parte superior, sin perder los datos ingresados."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.5. Revisión del resumen",
  "seccionId": "5-11-5-revision-del-resumen",
  "texto": "El resumen presenta una pestaña por cada día generado. Cada hora aparece como una tarjeta con el código de la destreza, el tema, el **OBJETIVO DE APRENDIZAJE** y la clase de 45 minutos estructurada en las cuatro fases del ciclo de aprendizaje ERCA:\n\n| **Fase** | **Duración** | **Propósito y número de actividades** |\n| --- | --- | --- |\n| EXPERIENCIA | 10 minutos | Recuperar saberes previos y vivencias relacionadas con el tema; 4 actividades. |\n| REFLEXIÓN | 10 minutos | Analizar la experiencia mediante preguntas guiadas; 4 actividades. |\n| CONCEPTUALIZACIÓN | 15 minutos | Construir y organizar el nuevo aprendizaje; 5 actividades. |\n| APLICACIÓN | 10 minutos | Usar lo aprendido en situaciones concretas; 5 actividades. |\n\nCada actividad comienza con un verbo en infinitivo y lleva tres cuadros DUA (Representación, Acción/Expresión e Implicación); los que aplican se muestran con color intenso. Debajo de las fases, la tarjeta presenta los **Recursos** y la **Evaluación formativa**, con la técnica, el instrumento, la evidencia observable y el criterio de logro, derivados de los indicadores oficiales de la destreza.\n\n1. Revise el resumen de cada día en su pestaña.\n2. Si una hora no le satisface, haga clic en **Regenerar esta hora**; si una hora falló, haga clic en **Reintentar**.\n3. Para cambiar datos del formulario, haga clic en **← Editar**.\n4. Cuando el resultado sea adecuado, haga clic en **Guardar**.\n\n*Figura 156. Resumen de la planificación de Preparatoria con las fases ERCA y el botón Guardar.*\n\n> En el resumen el contenido se muestra en modo de lectura. Para modificar una hora, regénerela o vuelva con ← Editar; los ajustes de redacción pueden hacerse en el Word exportado."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.5. Revisión del resumen",
  "seccionId": "5-11-5-revision-del-resumen",
  "texto": "> Aunque la estructura ERCA es común a toda la EGB, el Currículo Priorizado de Preparatoria establece la actividad lúdica como estrategia principal. Al revisar el resumen, compruebe que las actividades sean de juego, manipulación y movimiento, y adecuadas a niñas y niños de 5 a 6 años."
 },
 {
  "capId": "5-modulos-de-planificacion",
  "capTitulo": "5. Módulos de planificación",
  "seccion": "5.11.6. Exportación",
  "seccionId": "5-11-6-exportacion",
  "texto": "Al hacer clic en **Guardar**, la planificación se almacena en **Mis planes** y se abre la vista **Planificación** **Semanal**, con el rango de fechas y el docente en la cabecera, una pestaña por día y la pestaña **ADAPT.** para las adaptaciones curriculares.\n\n1. Haga clic en **Exportar PDF**.\n2. En la ventana **Exportar planificación semanal**, elija **Exportar como PDF** o **Exportar como Word**.\n\n*Figura 157. Botón Exportar PDF en la vista de la planificación guardada.*\n\n*Figura 158. Ventana Exportar planificación semanal con las opciones PDF y Word.*\n\n| **Opción** | **Resultado** |\n| --- | --- |\n| **Exportar como PDF** | Documento con el formato de planificación semanal del Ministerio de Educación. En el dispositivo móvil se abre el diálogo para compartir el archivo. |\n| **Exportar como Word** | Archivo .docx editable en Microsoft Word, útil para completar o ajustar la redacción antes de entregarlo. |\n\n> Revise y firme el documento exportado según los procesos de su institución. Si su institución exige el formato de planificación microcurricular 2026-2027 para Inicial y Preparatoria, complete en el Word los apartados que ese formato añade (situación de aprendizaje, competencias específicas, indicadores de evaluación y saberes)."
 },
 {
  "capId": "6-exportacion-de-documentos",
  "capTitulo": "6. Exportación de documentos",
  "seccion": null,
  "seccionId": null,
  "texto": "Todos los módulos permiten descargar el documento generado. Los archivos exportados conservan la estructura del formato oficial que corresponde a cada tipo de planificación (datos informativos, elementos curriculares, desarrollo metodológico, evaluación, adaptaciones y firmas), de modo que puedan presentarse ante la autoridad institucional sin necesidad de volver a transcribirlos."
 },
 {
  "capId": "6-exportacion-de-documentos",
  "capTitulo": "6. Exportación de documentos",
  "seccion": "6.1. Formatos disponibles",
  "seccionId": "6-1-formatos-disponibles",
  "texto": "| **Formato** | **Características** | **Uso recomendado** |\n| --- | --- | --- |\n| Word (.docx) | Documento editable con tablas, encabezados y espacios para firmas. | Ajustar redacciones, completar datos institucionales, insertar logotipos y firmar antes de entregar. |\n| PDF (.pdf) | Documento de solo lectura con el diseño fijo. | Imprimir o enviar la versión final a la autoridad institucional o al vicerrectorado. |"
 },
 {
  "capId": "6-exportacion-de-documentos",
  "capTitulo": "6. Exportación de documentos",
  "seccion": "6.2. Procedimiento general de exportación",
  "seccionId": "6-2-procedimiento-general-de-exportacion",
  "texto": "1. Abra la planificación desde el resultado de su generación o desde **Mis planes**.\n2. Haga clic en el botón de exportación del módulo (por ejemplo **Exportar**, **Descargar Word** o **Descargar PDF**).\n3. Si el módulo lo solicita, complete los datos de los firmantes (docente, coordinador o director de área y vicerrector o director).\n4. Espere a que el navegador descargue el archivo. Por defecto se guarda en la carpeta **Descargas** del equipo.\n5. Abra el archivo y revise su contenido antes de imprimirlo o enviarlo."
 },
 {
  "capId": "6-exportacion-de-documentos",
  "capTitulo": "6. Exportación de documentos",
  "seccion": "6.3. Recomendaciones",
  "seccionId": "6-3-recomendaciones",
  "texto": "- Verifique los datos institucionales, las fechas, el número de periodos y los nombres de los firmantes.\n- Revise que las destrezas, criterios e indicadores correspondan al grado y subnivel del grupo de estudiantes.\n- Si edita el documento en Word, conserve la estructura de las tablas para no alterar el formato oficial.\n- Guarde una copia digital de cada planificación entregada; puede volver a exportarla en cualquier momento desde **Mis planes**.\n- En dispositivos móviles, el archivo se abre con la aplicación predeterminada para documentos; se recomienda revisar la versión final en una computadora."
 },
 {
  "capId": "7-solucion-de-problemas",
  "capTitulo": "7. Solución de problemas",
  "seccion": null,
  "seccionId": null,
  "texto": "| **Mensaje o situación** | **Causa probable** | **Solución** |\n| --- | --- | --- |\n| “Correo o contraseña incorrectos” | Datos de acceso mal escritos. | Verifique el correo y la contraseña o use la recuperación de contraseña. |\n| “No encontramos una cuenta con ese correo” | El correo no está registrado. | Regístrese en la pestaña **Registrarse**. |\n| “La contraseña debe tener al menos 6 caracteres” | Contraseña demasiado corta. | Use una contraseña de 6 caracteres o más. |\n| “Las contraseñas no coinciden” | La confirmación es distinta a la contraseña. | Escriba la misma contraseña en ambos campos. |\n| “El código debe tener 6 dígitos” | Código de recuperación incompleto. | Copie el código completo del correo recibido. |\n| “Código inválido” | Código de acceso mal escrito o inexistente. | Verifique el código; si persiste, contacte a soporte. |\n| “Código bloqueado por exceso de dispositivos” | El código superó el número de dispositivos permitidos. | Contacte a soporte para su revisión. |\n| “Pago aún no confirmado” | El proveedor aún no confirma la transacción. | Espere unos segundos y vuelva a intentar. No repita el pago. |\n| La generación con IA tarda o no finaliza | Conexión inestable o alta demanda del servicio. | Verifique su conexión, espere y vuelva a generar. No cierre la pestaña durante la generación. |\n| No encuentro una destreza | Código incompleto o de otro subnivel. | Busque por el inicio del código (por ejemplo, M.3.1) o navegue desde **Explorar**. |\n| Adaptación curricular deshabilitada | No existe una planificación de origen. | Abra un plan diario o semanal, o una planificación de Currículo por Competencias con NEE, y cree la adaptación desde su detalle. |\n| El archivo no se descarga | El navegador bloquea las descargas o ventanas emergentes. | Permita las descargas para el sitio e intente de nuevo. |"
 },
 {
  "capId": "8-glosario",
  "capTitulo": "8. Glosario",
  "seccion": null,
  "seccionId": null,
  "texto": "Este glosario reúne las siglas y los términos técnicos que aparecen en el manual, en los formularios de PlanificaDoc y en los documentos oficiales del Ministerio de Educación, Deporte y Cultura en que se fundamenta la aplicación. Los términos se presentan en orden alfabético."
 },
 {
  "capId": "8-glosario",
  "capTitulo": "8. Glosario",
  "seccion": null,
  "seccionId": null,
  "texto": "| **Término** | **Definición** |\n| --- | --- |\n| ACC | Modelo pedagógico de tres fases: Anticipación, Construcción del conocimiento y Consolidación. En la PCT, PlanificaDoc lo propone por defecto para Inicial y Preparatoria. |\n| Adaptación curricular | Ajuste de la planificación para responder a las necesidades de un estudiante. PlanificaDoc la clasifica en grado 1 (no significativa, solo acceso), grado 2 (moderada: acceso y proceso) y grado 3 (significativa: acceso, proceso y resultado). |\n| Ámbito de desarrollo y aprendizaje | Espacio curricular de Inicial y Preparatoria, derivado de los ejes de desarrollo, que organiza los objetivos y las destrezas del nivel; por ejemplo, Identidad y autonomía o Relaciones lógico-matemáticas. |\n| Año lectivo | Periodo escolar anual. En el régimen Sierra-Amazonía 2026-2027 se organiza en tres trimestres que suman 200 días laborables. |\n| BGU | Bachillerato General Unificado: nivel de tres años posterior a la EGB, con un tronco común de asignaturas; ofrece las opciones en Ciencias y Técnico. |\n| Bloque curricular | Agrupación de aprendizajes básicos de un área para un nivel o subnivel; en los códigos corresponde al tercer elemento (por ejemplo, el 1 de M.2.1.1). |\n| BT | Bachillerato Técnico: opción del Bachillerato que articula el tronco común con módulos formativos de una figura profesional, orientada a la inserción laboral, el emprendimiento y los estudios superiores. |\n| CE | Sigla con dos usos: en el Currículo Priorizado identifica un criterio de evaluación (CE.M.2.1); en el Currículo Nacional por Competencias, una competencia específica (CE.LL.2.1). |\n| CI | Currículo Integrado: currículo por competencias de Inicial y Preparatoria, organizado por ámbitos de desarrollo y aprendizaje en lugar de asignaturas. |\n| CNC | En PlanificaDoc, Conecta Nivela y Crea: módulo para planificar las semanas de adaptación, diagnóstico y nivelación del inicio del año lectivo (“Conecta y nivela” en los Lineamientos 2026-2027). |\n| Co-nivelación | Estrategia recomendada por los Lineamientos 2026-2027 en la que estudiantes con aprendizajes más afianzados apoyan a sus compañeros durante la nivelación. |\n| Competencia | Integración de conocimientos, habilidades y actitudes para actuar de manera ética, reflexiva y eficaz en contextos diversos. |\n| Competencia específica | Desempeño observable que concreta las competencias clave en cada área y nivel o subnivel, y que integra conocimientos, habilidades, actitudes y valores. |\n| Competencias clave | Las siete competencias del Sistema Nacional de Educación: Comunicativa, Matemática y en Ciencia y Tecnología, Ciudadana, Digital, Socioemocional, Expresiones Culturales y Artísticas, e Innovación y Transformación. |\n| Criterio de evaluación | En el Currículo Priorizado, enunciado que expresa el tipo y grado de aprendizaje esperado y que agrupa varias destrezas; se codifica con el prefijo CE. |\n| Currículo Nacional por Competencias | Nuevo currículo organizado en competencias clave, competencias específicas, saberes e indicadores; se pilota en 2026-2027 en la Zona 6 del régimen Sierra- Amazonía. |\n| Currículo Priorizado | Currículo con énfasis en competencias comunicacionales, matemáticas, digitales y socioemocionales, expedido por el Acuerdo MINEDUC-MINEDUC- 2023-00008-A; organiza los aprendizajes en destrezas con criterios de desempeño. |\n| DCD | Destreza con criterio de desempeño: aprendizaje que integra habilidades, contenidos y procedimientos de diferente complejidad; se identifica con un código como M.2.1.1. |\n| DECE | Departamento de Consejería Estudiantil: instancia institucional que acompaña el bienestar socioemocional del estudiantado y apoya el diagnóstico y las adaptaciones curriculares. |\n| DIAC | Documento Individual de Adaptación Curricular: registro institucional de las adaptaciones aplicadas a un estudiante con NEE. |\n| DUA | Diseño Universal para el Aprendizaje: enfoque que planifica la clase para que sea accesible a todos, mediante múltiples formas de representación, de acción y expresión, y de implicación. |\n| EGB | Educación General Básica: nivel obligatorio de diez grados, organizado en los subniveles Preparatoria, Elemental, Media y Superior. |\n| Eje de desarrollo y aprendizaje | En Educación Inicial, campo general del desarrollo: personal y social; descubrimiento del medio natural y cultural; y expresión y comunicación. |\n| Eje transversal | Tema formativo que atraviesa todas las áreas. En PlanificaDoc corresponde a las inserciones curriculares: educación socioemocional, financiera, para el desarrollo sostenible, vial y cívica. |\n| ERCA | Modelo pedagógico de cuatro fases: Experiencia, Reflexión, Conceptualización y Aplicación. Organiza las estrategias del plan diario y es la opción por defecto en la PCT desde Básica Elemental. |\n| Evaluación diagnóstica | Valoración inicial de los aprendizajes y del estado socioemocional del estudiante, que orienta la nivelación y la planificación. |\n| Experiencia de aprendizaje | En Educación Inicial, conjunto de vivencias y actividades desafiantes diseñadas intencionalmente por el docente para desarrollar las destrezas de los ámbitos de aprendizaje. |\n| Familia profesional | Conjunto de figuras profesionales del BT que comparten conocimientos y competencias; por ejemplo, la familia Tecnologías incluye Soporte Informático y Desarrollo de Software. |\n| FCT | Formación en Centros de Trabajo: módulo de prácticas del Bachillerato Técnico que se realiza en una entidad receptora; los Lineamientos 2026-2027 fijan 160 horas reloj. |\n| Figura profesional | Perfil ocupacional que el estudiante de BT cursa; las figuras se agrupan en familias profesionales según las vocaciones productivas del territorio. |\n| I.CE | Indicador de evaluación asociado a un criterio o a una competencia específica; su código antepone la letra I (por ejemplo, I.M.2.1.1 o I.CS.F.5.3.1). |\n| IA | Inteligencia artificial: tecnología que PlanificaDoc utiliza para proponer contenidos de planificación, que el docente revisa y edita. |\n| Indicador de evaluación | Enunciado preciso, observable y verificable del desempeño esperado; orienta la evaluación formativa y sumativa. |\n| MINEDUC / MINEDEC | Ministerio de Educación del Ecuador, denominado en los documentos de 2026 Ministerio de Educación, Deporte y Cultura (MINEDEC). |\n| Módulo formativo | Unidad de formación técnica del BT vinculada a una unidad de competencia de la figura profesional; en PlanificaDoc se indica con su nombre y objetivo. |\n| NEE | Necesidades educativas específicas: requerimientos de apoyo de un estudiante, asociados o no a una discapacidad (por ejemplo, TDAH, dislexia, TEA o altas capacidades). |\n| Nivelación | Proceso de las semanas 2 y 3 del año lectivo que busca reducir las brechas de aprendizaje detectadas en el diagnóstico antes del abordaje curricular. |\n| Niveles de concreción curricular | Etapas en que se lleva el currículo al aula: macro (currículo nacional), meso (PCI y PCA) y micro (planificación de aula). |\n| PCA | Planificación Curricular Anual: documento de nivel meso que organiza en unidades el trabajo de un área o asignatura durante el año lectivo. |\n| PCI | Proyecto Curricular Institucional: documento de nivel meso en el que la institución concreta el currículo nacional según su realidad; sirve de referencia para la PCA. |\n| PCT | Planificación Curricular Trimestral: desagrega la planificación del área para un trimestre, con unidades, destrezas, modelo pedagógico y evaluación. |\n| Perfil de salida | Descripción de los desempeños que se espera que el estudiante alcance al concluir un nivel o subnivel. |\n| Planificación microcurricular | Planificación de aula elaborada por el docente. En el Programa Piloto su formato oficial se organiza por trimestre y semanas, con sugerencias de inicio, desarrollo y cierre. |\n| Programa Piloto | Implementación experimental del Currículo Nacional por Competencias en 2026-2027 en instituciones fiscales interculturales de la Zona 6, para evaluarlo y ajustarlo. |\n| Régimen Sierra- Amazonía | Calendario escolar que rige en las provincias de la Sierra y la Amazonía, con un año lectivo distinto al del régimen Costa-Galápagos. |\n| Resultado de aprendizaje | En el BT, logro concreto que el estudiante debe demostrar al cursar un módulo formativo; PlanificaDoc lo admite como dato opcional. |\n| Saberes | Base de la competencia específica: declarativos (conceptos, hechos y nociones), procedimentales (acciones y procedimientos) y actitudinales (actitudes y valores). |\n| SAFPI | Servicio de Atención Familiar para la Primera Infancia: modalidad de Inicial con sesiones pedagógicas asistidas en las que participan las familias. |\n| Situación de aprendizaje | Contexto o problema, con título y descripción, que articula la planificación microcurricular por competencias de EGB y Bachillerato y da sentido a las actividades. |\n| Subnivel | División de un nivel educativo: Inicial 1 e Inicial 2; Preparatoria, Básica Elemental, Media y Superior en la EGB. |\n| Trimestre | Cada uno de los tres periodos académicos en que se divide el año lectivo. |\n| Unidad de competencia | Conjunto de funciones de una figura profesional del BT, desglosado en elementos de competencia y criterios de desempeño; se relaciona con un módulo formativo. |"
 },
 {
  "capId": "9-soporte-tecnico",
  "capTitulo": "9. Soporte técnico",
  "seccion": null,
  "seccionId": null,
  "texto": "Si necesita asistencia, utilice cualquiera de los siguientes canales:\n\n| **Canal** | **Acceso** |\n| --- | --- |\n| Preguntas frecuentes | Sección **Ayuda** del menú lateral. |\n| Grupo exclusivo de WhatsApp | **Mi cuenta › Ingresar a grupo exclusivo de WhatsApp**, o **¿Necesitas** **ayuda? WhatsApp** en la pantalla de acceso. |\n| Correo electrónico | soporte@planificadoc.app |\n\nAl reportar un inconveniente, indique el módulo utilizado, los pasos realizados, el mensaje mostrado y, de ser posible, adjunte una captura de pantalla."
 }
];
