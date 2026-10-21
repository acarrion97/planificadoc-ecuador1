# 1. Introducción

## 1.1. Propósito

El presente manual describe el funcionamiento de **PlanificaDoc Ecuador**, plataforma web de planificación curricular asistida por inteligencia artificial (IA), y orienta al personal docente en el uso de cada uno de sus módulos: desde el acceso al sistema hasta la generación, gestión y exportación de los documentos de planificación.

## 1.2. Alcance

El manual abarca la versión 1.0 de la aplicación web y comprende los siguientes componentes:

- Acceso al sistema: inicio de sesión, registro, ingreso con código, recuperación de contraseña y suscripción.
- Navegación general: Inicio, Explorar, Crear, Mis planes, Mi cuenta y Ayuda.
- Módulos de planificación: plan diario, plan semanal, PCA anual, PCT trimestral, Conecta Nivela y Crea, evaluación diagnóstica, proyecto interdisciplinar, Bachillerato Técnico, currículo por competencias, Educación Inicial, Preparatoria y adaptación curricular.
- Exportación de documentos, solución de problemas, glosario y canales de soporte.

No forman parte de este documento las funciones de administración interna de la plataforma ni los procesos de facturación del proveedor de pagos.

## 1.3. Público objetivo

Este manual está dirigido a docentes de Educación Inicial, Preparatoria, Educación General Básica (EGB), Bachillerato General Unificado (BGU) y Bachillerato Técnico (BT) del Sistema Nacional de Educación del Ecuador, así como a directivos y coordinadores pedagógicos que revisan las planificaciones. Para su uso se requiere únicamente manejo básico de un navegador web y de un procesador de textos.

## 1.4. Descripción general del sistema

PlanificaDoc es una aplicación web orientada a reducir el tiempo que el docente dedica a la elaboración de documentos de planificación, sin sustituir su criterio pedagógico. El sistema integra el banco de destrezas con criterios de desempeño del Currículo Priorizado del MINEDUC, los formatos oficiales de planificación y un asistente de inteligencia artificial que propone contenidos coherentes con los datos que el docente ingresa.

El flujo de trabajo general es el mismo en todos los módulos:

- **Contextualización:** el docente registra los datos informativos (institución, año lectivo, grado o curso, paralelo, área o asignatura, docente) que se reutilizan en el documento final.
- **Selección curricular:** se eligen los elementos del currículo que se trabajarán (destrezas con criterios de desempeño, criterios de evaluación, competencias o resultados de aprendizaje), tomados directamente del currículo oficial cargado en el sistema.
- **Generación asistida:** la IA elabora una propuesta de objetivos, actividades, recursos, estrategias de evaluación y medidas de inclusión, respetando la estructura del formato oficial correspondiente.
- **Revisión y ajuste:** el docente revisa, edita o regenera cada apartado antes de guardarlo.
- **Gestión y exportación:** el documento queda almacenado en **Mis planes** y puede descargarse en Word o PDF para su firma y presentación ante la autoridad institucional.

De esta manera, PlanificaDoc apoya los tres niveles de concreción curricular: la planificación mesocurricular (PCA y PCT), la planificación microcurricular (planes diarios, semanales, de Inicial y de Preparatoria) y los instrumentos complementarios establecidos para el año lectivo 2026-2027 (Conecta Nivela y Crea, evaluación diagnóstica, proyectos interdisciplinarios, currículo por competencias y adaptaciones curriculares).

> **Importante:** PlanificaDoc es una herramienta de apoyo. La responsabilidad sobre la pertinencia, veracidad y adecuación de los documentos al contexto institucional y a las necesidades de los estudiantes corresponde al docente y a las instancias de revisión de la institución educativa.

## 1.5. Normativa y documentos de referencia

La estructura y redacción de este manual siguen las recomendaciones de la norma internacional para información de usuario; los contenidos pedagógicos que genera el sistema se basan en la normativa del Ministerio de Educación (MINEDUC) detallada a continuación.

| **Documento** | **Aplicación en este manual / en el sistema** |
| --- | --- |
| ISO/IEC/IEEE 26514:2022 — Ingeniería de sistemas y software: diseño y desarrollo de información para usuarios | Estructura del manual, redacción de procedimientos en pasos numerados, convenciones tipográficas, avisos y glosario. |
| MINEDUC — Lineamientos de inicio de año lectivo 2026-2027, régimen Sierra-Amazonía | Programa Conecta Nivela y Crea, evaluación diagnóstica y currículo por competencias (plan piloto). |
| MINEDUC — Currículo Priorizado (Preparatoria, Elemental, Media, Superior y Bachillerato) | Banco de destrezas con criterios de desempeño (DCD) utilizado por el buscador y por los módulos de planificación. |
| MINEDUC — Currículo Nacional de Primera Infancia y Currículo Priorizado de Educación Inicial | Planificación de Educación Inicial y currículo por competencias para Inicial y Preparatoria. |
| MINEDUC — Adaptaciones curriculares para la oferta educativa de jóvenes y adultos con escolaridad inconclusa (EGB y Bachillerato) | Referencia para docentes de ofertas extraordinarias. El módulo de adaptación curricular para estudiantes con necesidades educativas específicas (NEE) aplica los principios del Diseño Universal para el Aprendizaje (DUA) previstos en los formatos oficiales de planificación. |
| MINEDUC — Caracterización de las familias y figuras profesionales del Bachillerato Técnico | Módulo de Bachillerato Técnico: figuras profesionales, módulos formativos y resultados de aprendizaje. |
| MINEDUC — Formatos oficiales de planificación microcurricular (EGB y BGU; Inicial y Preparatoria) | Estructura de los documentos Word y PDF que exporta el sistema. |

## 1.6. Convenciones del documento

Para facilitar la lectura se emplean las siguientes convenciones:

| **Convención** | **Significado** | **Ejemplo** |
| --- | --- | --- |
| **Negrita** | Botones, opciones de menú, pestañas y nombres de campos de la interfaz. | Haga clic en **Generar** **planificación**. |
| “Comillas” | Textos o mensajes que el sistema muestra en pantalla. | “Contraseña actualizada”. |
| Ruta con «›» | Secuencia de navegación entre opciones. | **Crear › Plan de área › PCA Anual** |
| Pasos numerados | Procedimientos que deben seguirse en el orden indicado. | 1. Ingrese su correo… |
| Figura N | Captura de pantalla de referencia, numerada en orden de aparición. | Figura 12. Resultado del plan diario. |

Además, el manual utiliza los siguientes recuadros de aviso:

> **Nota:** información complementaria que ayuda a comprender el funcionamiento de una opción.

> **Consejo:** recomendación práctica para trabajar de forma más rápida o con mejores resultados.

> **Importante:** condición que debe cumplirse para evitar errores o pérdida de información.

## 1.7. Códigos de color de la interfaz

PlanificaDoc emplea una paleta de colores institucional que se mantiene en todas las pantallas. Reconocer su significado facilita la interpretación de los estados y acciones del sistema:

|  |  |
| --- | --- |
| **Azul de marca** `#003366` | Opción activa del menú lateral, botones principales (por ejemplo **Nueva** **planificación**) y títulos. |
| **Azul primario** `#1B5E9E` | Enlaces, botones de acción secundarios, íconos y códigos de destreza. |
| **Verde** `#16A34A` | Estados correctos o activos (por ejemplo, “Activo” en Mi cuenta) y confirmaciones. |

|  |  |
| --- | --- |
| **Ámbar** `#D97706` | Advertencias y datos que requieren revisión antes de continuar. |
| **Rojo** `#DC2626` | Errores de validación y acciones destructivas como **Eliminar** o **Cerrar** **sesión**. |
| **Gris** `#64748B` | Textos secundarios, descripciones y opciones no disponibles (deshabilitadas). |

> **Nota:** la aplicación dispone de tema Claro, Oscuro y Sistema (véase la sección Mi cuenta). En el tema oscuro el fondo cambia a azul marino y los colores se aclaran para conservar el contraste; su significado no cambia.

