## Purpose

Permite al docente crear y aplicar evaluaciones diagnósticas vinculadas al currículo ecuatoriano (DCD e indicadores reales del catálogo), registrar resultados por estudiante mediante códigos anónimos, calcular el logro por aprendizaje con umbrales configurables, detectar brechas del curso, generar recomendaciones y exportar reportes PDF/Word, como insumo para la planificación docente.

## ADDED Requirements

### Requirement: Creación de evaluación diagnóstica con contexto curricular
El sistema SHALL permitir crear una evaluación diagnóstica con: nombre, año lectivo, área, subnivel, grado, paralelo, asignatura, fecha, duración, instrucciones y puntaje total. La evaluación inicia en estado "borrador".

#### Scenario: Crear evaluación desde cero
- **WHEN** el docente completa el contexto curricular y guarda
- **THEN** el sistema crea la evaluación en estado "borrador" y la persiste localmente

#### Scenario: Validación de contexto obligatorio
- **WHEN** el docente intenta guardar sin área, subnivel o grado
- **THEN** el sistema muestra un error y no crea la evaluación

### Requirement: Selección de DCD con trazabilidad curricular
El sistema SHALL permitir seleccionar las destrezas (DCD) a diagnosticar usando únicamente el catálogo estático existente, mostrando para cada una sus criterios e indicadores de evaluación reales. Cada pregunta del banco SHALL quedar vinculada a una DCD y opcionalmente a un indicador.

#### Scenario: Seleccionar DCD del catálogo
- **WHEN** el docente busca una destreza entre las ofrecidas y la agrega
- **THEN** el sistema la agrega con su descripción, criterios e indicadores sin inventar contenido curricular

#### Scenario: Pregunta sin trazabilidad
- **WHEN** el docente intenta guardar una pregunta sin DCD asociada
- **THEN** el sistema rechaza la pregunta y solicita asociarla a una DCD

### Requirement: Selección del subnivel a diagnosticar
Una evaluación diagnóstica mide aprendizajes previos, por lo que el sistema SHALL permitir al docente elegir de qué subnivel provienen las DCD a diagnosticar, sin restringirlo al subnivel del curso. El sistema SHALL ofrecer por defecto el **subnivel prerrequisito** (ver "Mapa de subniveles prerrequisito") y SHALL mantener el subnivel del curso disponible para selección. Cada DCD ofrecida o seleccionada SHALL mostrar a qué subnivel pertenece.

#### Scenario: Curso en salto de subnivel
- **WHEN** el docente crea una evaluación para 8.° EGB (Básica Superior)
- **THEN** el sistema ofrece por defecto las DCD de Básica Media y mantiene disponibles las de Básica Superior

#### Scenario: Grado que comparte subnivel con el anterior
- **WHEN** el docente crea una evaluación para 6.° EGB, cuyo grado previo (5.°) pertenece al mismo subnivel curricular
- **THEN** el sistema permite seleccionar las DCD del subnivel del curso, de modo que los prerrequisitos del grado anterior siguen siendo seleccionables

#### Scenario: DCD de subniveles distintos en una misma evaluación
- **WHEN** el docente selecciona DCD del subnivel prerrequisito y del subnivel del curso
- **THEN** el sistema acepta ambas en la misma evaluación y conserva el subnivel de origen de cada una

### Requirement: Mapa de subniveles prerrequisito
El sistema SHALL resolver el subnivel prerrequisito mediante un mapa curricular explícito de (área, subnivel) a (área, subnivel), y no mediante una resta aritmética sobre el subnivel, porque el catálogo no ofrece todas las áreas en todos los subniveles. Cuando no exista un prerrequisito definido, el sistema SHALL informarlo y NO SHALL sustituirlo por un área equivalente inventada. La resolución SHALL ser idéntica en todos los caminos de entrada al módulo.

#### Scenario: Área de Bachillerato sin continuidad hacia abajo
- **WHEN** el docente crea una evaluación de Física de 1.° BGU, área que solo existe en Bachillerato
- **THEN** el sistema ofrece como prerrequisito las DCD de Ciencias Naturales de Básica Superior

#### Scenario: Preparatoria como currículo integrado
- **WHEN** el docente crea una evaluación de un área de Básica Elemental, cuyo subnivel previo (Preparatoria) no ofrece áreas separadas
- **THEN** el sistema ofrece como prerrequisito las DCD del Currículo Integrador de Preparatoria

#### Scenario: Área sin prerrequisito definido
- **WHEN** el docente crea una evaluación de Emprendimiento y Gestión, área sin predecesor en el catálogo
- **THEN** el sistema informa que no existe un prerrequisito definido, ofrece únicamente el subnivel del curso y no propone un área sustituta

#### Scenario: Misma resolución desde el plan CNC
- **WHEN** el docente llega al módulo desde un plan Conecta, Nivela y Crea que referencia DCD de un subnivel distinto al del curso
- **THEN** el sistema preselecciona esas DCD aplicando el mismo mapa de prerrequisitos que la selección manual, sin descartarlas en silencio

### Requirement: Banco de preguntas reutilizable
El sistema SHALL mantener un banco de preguntas local reutilizable entre evaluaciones. Cada pregunta tiene: enunciado, tipo, nivel de dificultad, puntaje, DCD, indicador opcional, opciones (para selección múltiple), respuesta correcta, retroalimentación y estado activa/inactiva. Los tipos iniciales SHALL ser selección múltiple, verdadero/falso, respuesta corta y ejercicio/problema, con diseño extensible a más tipos.

#### Scenario: Crear pregunta con selección múltiple
- **WHEN** el docente crea una pregunta de selección múltiple con opciones y una respuesta correcta
- **THEN** el sistema la agrega al banco con estado "activa" y la hace disponible para futuras evaluaciones

#### Scenario: Reutilizar pregunta en otra evaluación
- **WHEN** el docente agrega a una evaluación una pregunta existente del banco
- **THEN** el sistema la vincula sin duplicarla y sin alterar el banco

#### Scenario: Pregunta de verdadero/falso sin respuesta correcta
- **WHEN** el docente guarda una pregunta verdadero/falso sin marcar la opción correcta
- **THEN** el sistema rechaza el guardado

### Requirement: Sugerencia de preguntas por IA fundamentada en el catálogo
El sistema SHALL ofrecer generación de preguntas por IA para una o más DCD, usando como única fuente de contenido los indicadores y criterios reales del catálogo. El sistema SHALL mostrar las preguntas sugeridas para que el docente las revise, edite o descarte antes de incorporarlas.

#### Scenario: Sugerir preguntas para una DCD
- **WHEN** el docente solicita sugerencias para una DCD seleccionada
- **THEN** el sistema devuelve preguntas derivadas de los indicadores/criterios de esa DCD, ninguna lista para incorporar hasta la revisión del docente

#### Scenario: Respuesta de IA inválida
- **WHEN** el servicio de IA no devuelve un formato válido
- **THEN** el sistema muestra un error comprensible y no incorpora preguntas al banco

### Requirement: Matriz de evaluación
El sistema SHALL mostrar una matriz con columnas DCD, Indicador, número de preguntas, puntaje y dificultad, permitiendo al docente distribuir las preguntas entre los aprendizajes antes de publicar. La suma de puntajes de las preguntas SHALL poder validarse contra el puntaje total de la evaluación.

#### Scenario: Ver matriz y ajustar distribución
- **WHEN** el docente revisa la matriz antes de publicar
- **THEN** el sistema muestra por cada DCD el conteo de preguntas, puntaje y dificultad, y permite mover preguntas entre DCD

### Requirement: Aplicación por estudiante con códigos anónimos
El sistema SHALL permitir registrar estudiantes mediante códigos anónimos (el nombre es opcional) y registrar sus respuestas. El sistema SHALL impedir registrar dos veces la misma evaluación para el mismo estudiante, salvo que el docente autorice un nuevo intento.

#### Scenario: Registrar respuestas de un estudiante
- **WHEN** el docente selecciona un estudiante del roster y registra sus respuestas
- **THEN** el sistema guarda las respuestas, la hora de inicio/fin y el tiempo utilizado, y marca la evaluación del estudiante como finalizada

#### Scenario: Duplicado accidental
- **WHEN** el docente intenta registrar respuestas de un estudiante cuya evaluación ya está finalizada sin autorizar un nuevo intento
- **THEN** el sistema rechaza el registro y lo notifica

### Requirement: Resultado individual del estudiante
El sistema SHALL calcular para cada estudiante: puntaje obtenido, porcentaje, preguntas correctas, incorrectas y sin responder, y tiempo empleado.

#### Scenario: Ver resultado de un estudiante
- **WHEN** el docente abre el resultado de un estudiante con respuestas registradas
- **THEN** el sistema muestra puntaje, porcentaje, conteo de correctas/incorrectas/sin responder y tiempo

### Requirement: Resultado por aprendizaje (DCD) con umbrales configurables
El sistema SHALL calcular por cada DCD evaluada el porcentaje de logro y clasificarlo en 🟢 Dominado, 🟡 En proceso o 🔴 Requiere refuerzo. Los umbrales de clasificación SHALL ser configurables por evaluación y no estar codificados en el código. El porcentaje de logro de una DCD SHALL considerar preguntas correctas sobre el total de preguntas de esa DCD (sin responder cuenta como incorrecta).

#### Scenario: Clasificación por umbrales por defecto
- **WHEN** una DCD alcanza 70% o más de logro con los umbrales por defecto
- **THEN** el sistema la clasifica como 🟢 Dominado

#### Scenario: Umbrales personalizados
- **WHEN** el docente cambia los umbrales de la evaluación (por ejemplo dominado ≥ 80, refuerzo < 50)
- **THEN** el sistema recalcula las clasificaciones de todas las DCD con los nuevos umbrales

#### Scenario: Sin preguntas respondidas
- **WHEN** una DCD no tiene respuestas registradas
- **THEN** el sistema la muestra como 🔴 Requiere refuerzo con 0% de logro

### Requirement: Detección de brechas del curso
El sistema SHALL agregar los resultados de todos los estudiantes por DCD y mostrar las brechas principales: porcentaje del curso que domina cada DCD y porcentaje que presenta dificultades, ordenadas por prioridad de intervención.

#### Scenario: Brechas del curso
- **WHEN** hay resultados registrados para múltiples estudiantes
- **THEN** el sistema muestra por cada DCD cuántos estudiantes la dominan, están en proceso o requieren refuerzo, con porcentajes del curso

### Requirement: Brechas clasificadas por origen curricular
El sistema SHALL clasificar cada brecha según el subnivel de origen de su DCD, distinguiendo las brechas de **arrastre** (DCD de un subnivel prerrequisito) de las del **nivel actual** (DCD del subnivel del curso), y SHALL mostrar esa clasificación tanto en el análisis de resultados como en los reportes. La clasificación SHALL derivarse del subnivel de la DCD en el catálogo, sin requerir que el docente la declare. Cuando el código de una DCD no pueda resolverse en el catálogo, el sistema SHALL presentarla con su origen no determinado y NO SHALL asignarle un origen por defecto.

#### Scenario: Brechas de arrastre y de nivel actual
- **WHEN** la evaluación incluye DCD del subnivel prerrequisito y del subnivel del curso, y ambas presentan brechas
- **THEN** el sistema las presenta agrupadas por origen, indicando cuáles corresponden a aprendizajes de arrastre y cuáles al nivel actual

#### Scenario: Evaluación de un solo subnivel
- **WHEN** todas las DCD evaluadas pertenecen al mismo subnivel
- **THEN** el sistema muestra las brechas sin dividirlas en grupos, evitando una agrupación vacía

#### Scenario: Origen visible en los reportes
- **WHEN** el docente exporta el informe de brechas
- **THEN** cada DCD aparece con su subnivel de origen, de modo que una brecha de arrastre sea distinguible de una del nivel actual

#### Scenario: DCD cuyo código ya no existe en el catálogo
- **WHEN** una evaluación guardada contiene una DCD cuyo código no se resuelve en el catálogo vigente
- **THEN** el sistema conserva su descripción e indicadores registrados, calcula su porcentaje de logro con normalidad y la presenta con origen no determinado, sin ubicarla en arrastre ni en nivel actual

### Requirement: Recomendaciones pedagógicas por regla local
El sistema SHALL generar recomendaciones de forma determinista (sin IA) a partir de las brechas: para cada DCD en estado En proceso o Requiere refuerzo, una recomendación anclada a esa destreza y a sus indicadores. Las recomendaciones SHALL priorizarse según la severidad de la brecha.

#### Scenario: Recomendación para DCD en refuerzo
- **WHEN** una DCD está clasificada como 🔴 Requiere refuerzo
- **THEN** el sistema genera una recomendación que menciona esa DCD y sugiere reforzarla antes de abordar aprendizajes dependientes

#### Scenario: Sin brechas
- **WHEN** todas las DCD están clasificadas como 🟢 Dominado
- **THEN** el sistema indica que no se requieren intervenciones y no genera recomendaciones de refuerzo

### Requirement: Dashboard de resultados
El sistema SHALL mostrar un resumen de la evaluación: total de estudiantes evaluados, promedio general, porcentaje de dominio, aprendizajes dominados/en proceso/requieren refuerzo, distribución de resultados y brechas principales.

#### Scenario: Ver dashboard
- **WHEN** el docente abre los resultados de una evaluación con estudiantes registrados
- **THEN** el sistema muestra las métricas resumidas calculadas a partir de los resultados

### Requirement: Reportes PDF y Word
El sistema SHALL permitir exportar cinco reportes: informe individual del estudiante, informe general del curso, informe por DCD, informe de brechas de aprendizaje y matriz de resultados, en PDF y Word. Los reportes SHALL usar los nombres reales cuando el docente los haya ingresado y códigos anónimos en caso contrario.

#### Scenario: Exportar informe individual a PDF
- **WHEN** el docente exporta el informe individual de un estudiante a PDF
- **THEN** el sistema genera el documento con sus resultados, % de logro por DCD y estados

#### Scenario: Exportar informe de brechas a Word
- **WHEN** el docente exporta el informe de brechas a Word
- **THEN** el sistema genera un documento con las brechas por DCD y las recomendaciones asociadas

### Requirement: Integración con Conecta, Nivela y Crea
El sistema SHALL permitir exportar los resultados de la evaluación como diagnóstico de Semana 1 de un plan CNC: para cada DCD evaluada, su código, descripción y nivel detectado (logrado/en_proceso/iniciado) derivado de la clasificación 🟢/🟡/🔴. La exportación SHALL requerir confirmación del docente y no modificar planes existentes sin autorización.

#### Scenario: Exportar resultados a un plan CNC
- **WHEN** el docente confirma exportar los resultados a CNC
- **THEN** el sistema crea o actualiza el diagnóstico de Semana 1 del plan CNC con las DCD y sus niveles detectados

#### Scenario: Cancelar exportación
- **WHEN** el docente cancela la exportación a CNC
- **THEN** el sistema no modifica ningún plan existente

### Requirement: Persistencia local con backup best-effort
El sistema SHALL persistir las evaluaciones localmente en el dispositivo como fuente de verdad. El sistema SHALL intentar, de forma no crítica, respaldar la evaluación y su resultado de IA en la nube; si el respaldo falla, la evaluación permanece disponible localmente.

#### Scenario: Funcionamiento sin respaldo en la nube
- **WHEN** el respaldo en la nube falla o no está disponible
- **THEN** la evaluación y sus resultados se conservan en el dispositivo y el flujo continúa sin interrupción