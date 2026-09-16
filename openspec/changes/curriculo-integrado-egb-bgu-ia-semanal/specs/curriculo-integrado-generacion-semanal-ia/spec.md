## Purpose

Generar por IA el contenido semanal (DUA: inicio/desarrollo/cierre, recursos, técnica e instrumento de evaluación) de una planificación de Currículo Integrado EGB/BGU, a partir de datos curriculares reales del catálogo, en vez de una plantilla genérica repetida.

## ADDED Requirements

### Requirement: Generación de semanas por IA a partir de datos curriculares reales
El sistema SHALL ofrecer una acción explícita, invocada por el docente antes de guardar una planificación de Currículo Integrado EGB/BGU, que genere el contenido de cada semana del trimestre usando exclusivamente la(s) competencia(s) específica(s) seleccionada(s), sus indicadores y saberes reales para el grado/nivel elegido, la situación de aprendizaje y los temas del trimestre que el docente haya escrito.

#### Scenario: Generar semanas con datos completos
- **WHEN** el docente completó el paso de competencias y datos (situación de aprendizaje, temas, número de semanas) y presiona "Generar semanas con IA"
- **THEN** el sistema produce una propuesta de contenido para cada semana (tema, objetivo específico, actividades de inicio/desarrollo/cierre, recursos sugeridos, técnica e instrumento de evaluación) y la deja lista para revisión antes de guardar

#### Scenario: Generar semanas sin temas del trimestre
- **WHEN** el docente no escribió temas del trimestre
- **THEN** el sistema genera igualmente una propuesta razonable de temas y actividades derivada de los indicadores y saberes de la(s) competencia(s) seleccionada(s), sin dejar semanas vacías

### Requirement: No inventar destrezas, códigos o enlaces no verificados
El contenido generado por IA SHALL restringirse a los indicadores, saberes y códigos que existen en el catálogo de la competencia seleccionada, y SHALL NOT presentar URLs o enlaces a recursos externos como oficiales salvo que sean genéricos y no verificables como falsos (p. ej. "video educativo sobre el tema" en vez de un enlace específico inventado).

#### Scenario: La IA no propone un código de indicador inexistente
- **WHEN** se genera el contenido semanal para una competencia específica
- **THEN** ningún código de indicador o saber citado en el resultado corresponde a un código fuera del catálogo de esa competencia para el grado seleccionado

#### Scenario: La IA no fabrica un enlace específico
- **WHEN** el resultado generado sugiere un recurso digital
- **THEN** el recurso se describe de forma genérica (tipo de material, tema) en vez de citar una URL específica no verificada como existente

### Requirement: Una sola llamada de generación por planificación
El sistema SHALL generar el contenido de todas las semanas de una planificación en una sola solicitud de IA, no una solicitud por semana, para acotar el costo y el tiempo de espera.

#### Scenario: Plan de 8 semanas
- **WHEN** el docente genera semanas para un trimestre de 8 semanas
- **THEN** el sistema realiza una única solicitud de generación que devuelve el contenido de las 8 semanas

### Requirement: Estado de carga y manejo de error visible
Mientras se genera el contenido, el sistema SHALL mostrar al docente que la generación está en curso, y SHALL informar con un mensaje claro si la generación falla, sin perder los datos ya ingresados en el formulario.

#### Scenario: Generación en curso
- **WHEN** el docente presiona "Generar semanas con IA"
- **THEN** el sistema muestra un indicador de carga hasta recibir el resultado o un error

#### Scenario: Falla la generación
- **WHEN** la solicitud de generación falla (error de red, tiempo agotado, o respuesta inválida)
- **THEN** el sistema muestra un mensaje de error al docente y conserva los datos ya ingresados en el formulario, permitiendo reintentar
