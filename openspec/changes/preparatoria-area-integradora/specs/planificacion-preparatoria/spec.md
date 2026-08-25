## Purpose

Ofrecer un flujo de planificación curricular propio para Preparatoria (1.° EGB), que presente las destrezas oficiales de subnivel 1 agrupadas en los 7 ámbitos oficiales de desarrollo y aprendizaje del MINEDUC en vez de por asignatura, sin reclasificar el área ni el código oficial de ninguna destreza.

## ADDED Requirements

### Requirement: Preparatoria se organiza por ámbitos, agregando destrezas de varias áreas
El sistema SHALL presentar el currículo de Preparatoria (subnivel 1) organizado en 7 ámbitos de desarrollo y aprendizaje seleccionables de forma independiente, cada uno mostrando las destrezas de subnivel 1 (de cualquier área curricular) cuyo bloque coincida con ese ámbito.

#### Scenario: Docente selecciona un ámbito de Preparatoria
- **WHEN** un docente elige uno de los 7 ámbitos en la pantalla de planificación de Preparatoria
- **THEN** el sistema muestra únicamente destrezas de subnivel 1 cuyo bloque coincide con ese ámbito, sin importar a qué área curricular pertenezcan

#### Scenario: Un ámbito reúne destrezas de más de un área
- **WHEN** un docente elige un ámbito cuyas destrezas oficiales pertenecen a más de un área curricular (por ejemplo, el ámbito 1 incluye destrezas de Ciencias Naturales, Estudios Sociales e Inglés)
- **THEN** el sistema muestra las destrezas de todas esas áreas juntas, sin omitir ninguna por pertenecer a un área distinta de las demás

#### Scenario: Ámbito sin selección no muestra destrezas de otros ámbitos
- **WHEN** un docente aún no ha seleccionado ningún ámbito
- **THEN** el sistema no mezcla destrezas de distintos ámbitos en un mismo bloque de planificación

### Requirement: La vista de ámbitos no altera el área ni el código oficial de las destrezas
El sistema SHALL preservar, para cada destreza mostrada en la vista de ámbitos de Preparatoria, el área curricular y el código oficial exactos con los que esa destreza existe en su área de origen. Agrupar por ámbito es una presentación adicional, no una reclasificación.

#### Scenario: Código y área visibles de una destreza dentro de un ámbito
- **WHEN** un docente ve una destreza dentro de un ámbito de Preparatoria (por ejemplo, una destreza de Matemática dentro del ámbito "Relaciones lógico-matemáticas")
- **THEN** el código y el área mostrados corresponden exactamente a los que esa destreza tiene en `data/destrezas-matematica.ts` (o el archivo de su área), sin reemplazarlos por un código o área inventados

### Requirement: Preparatoria no se ofrece en la planificación semanal basada en asignaturas
El sistema SHALL excluir a Preparatoria (subnivel 1) del selector de subnivel de la planificación semanal de EGB.

#### Scenario: Selector de subnivel en planificación semanal
- **WHEN** un docente abre la pantalla de planificación semanal de EGB
- **THEN** el selector de subnivel no incluye Preparatoria como opción

### Requirement: Preparatoria no aparece bajo la sección de EGB en Explorar
El sistema SHALL excluir toda referencia a Preparatoria de la sección de Educación General Básica en la pantalla de Explorar.

#### Scenario: Sección EGB en Explorar
- **WHEN** un docente abre la pantalla de Explorar
- **THEN** el subtítulo y contenido de la sección de EGB no mencionan Preparatoria

### Requirement: Acceso dedicado a Preparatoria desde la pantalla de inicio
El sistema SHALL ofrecer, desde la pantalla de inicio, un punto de entrada explícito hacia la planificación de Preparatoria, independiente de la entrada de EGB.

#### Scenario: Navegación desde inicio
- **WHEN** un docente abre la pantalla de inicio
- **THEN** ve una opción de navegación hacia "Planificación Preparatoria", ubicada junto a la de Educación Inicial

### Requirement: La planificación anual permite planificar Preparatoria sin asociarla con CAI
El sistema SHALL permitir planificar Preparatoria (subnivel 1), dentro de la planificación curricular anual (PCA), para cualquier área curricular que tenga destrezas de subnivel 1, sin asociarla exclusivamente con el área de Cívica — Acompañamiento Integral (CAI).

#### Scenario: Selección de Preparatoria en PCA para un área con destrezas de subnivel 1
- **WHEN** un docente selecciona una asignatura con destrezas de subnivel 1 (por ejemplo, Matemática) y luego Preparatoria como subnivel dentro de la planificación anual
- **THEN** el sistema permite continuar la planificación con esas destrezas, sin requerir que el área seleccionada sea CAI

### Requirement: Educación Inicial y CAI no cambian de comportamiento
El sistema SHALL mantener sin cambios el comportamiento existente de la planificación de Educación Inicial y del área CAI en todos los subniveles donde ya está disponible.

#### Scenario: Planificación de Educación Inicial
- **WHEN** un docente planifica para Educación Inicial (subniveles -1 o 0)
- **THEN** el flujo, los ámbitos y las destrezas disponibles son idénticos a los existentes antes de este cambio

#### Scenario: Uso de CAI en cualquier subnivel
- **WHEN** un docente selecciona el área CAI en cualquier subnivel donde ya estaba disponible (1 a 5)
- **THEN** las destrezas y bloques mostrados son idénticos a los existentes antes de este cambio

### Requirement: Los bloques de subnivel 1 no se confunden con los bloques regulares de la misma área
El sistema SHALL resolver el nombre de un bloque de una destreza de subnivel 1 usando los nombres de ámbito de Preparatoria, y no los nombres de bloque que la misma área usa en subniveles 2 a 5, aun cuando el número de bloque coincida.

#### Scenario: Nombre de bloque mostrado para una destreza de subnivel 1
- **WHEN** el sistema muestra el nombre del bloque de una destreza con `subnivel: 1`
- **THEN** el nombre mostrado es el del ámbito de Preparatoria correspondiente a ese número de bloque, no el nombre de bloque regular que esa misma área usa en subniveles 2 a 5

### Requirement: La vista integradora no sustituye al currículo específico completo de Educación Física ni de Educación Cultural y Artística
El sistema SHALL limitar las destrezas de Educación Física y Educación Cultural y Artística mostradas dentro de los ámbitos de Preparatoria a las que el currículo integrador cita explícitamente en esos ámbitos, y SHALL NOT presentarlas como el conjunto completo de los currículos específicos de esas asignaturas para subnivel 1.

#### Scenario: Selección de Educación Física o Educación Cultural y Artística como asignatura independiente en subnivel 1
- **WHEN** un docente selecciona Educación Física o Educación Cultural y Artística como asignatura (fuera de la vista de ámbitos de Preparatoria) para subnivel 1
- **THEN** el sistema no presenta las destrezas citadas en los ámbitos 6/7 del currículo integrador como si fueran el currículo específico completo de esa asignatura
