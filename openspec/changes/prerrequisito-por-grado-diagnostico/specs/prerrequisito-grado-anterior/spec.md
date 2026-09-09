## Purpose

Resuelve el nivel educativo que una evaluación diagnóstica debe medir como el
**grado anterior al curso** (ej: 2.° EGB diagnostica destrezas de 1.° EGB), de
modo que la retroalimentación se ajuste al currículo que el estudiante ya cursó.

## ADDED Requirements

### Requirement: Resolución del prerrequisito por grado anterior
El sistema SHALL resolver el subnivel prerrequisito de una evaluación
diagnóstica a partir del **grado del año lectivo anterior** (grado − 1), y
NO a partir de `subnivel − 1` del grado actual. El subnivel del grado anterior
es la única fuente de verdad para las reglas especiales.

#### Scenario: Grado anterior en subnivel distinto
- **WHEN** se solicita el prerrequisito de 2.° EGB (subnivel 2) en Lengua y Literatura
- **THEN** el resolver devuelve `{ CAI, Preparatoria }` porque el grado anterior (1.° EGB) es Preparatoria, de currículo integrado
- **AND** el nivel actual (subnivel 2) sigue disponible para seleccionar

#### Scenario: Grado anterior en subnivel distinto en Básica Media
- **WHEN** se solicita el prerrequisito de 5.° EGB (subnivel 3) en Matemática
- **THEN** el resolver devuelve `{ Matemática, subnivel 2 }` porque el grado anterior (4.° EGB) pertenece a Básica Elemental

#### Scenario: Grado anterior en subnivel distinto en Básica Superior
- **WHEN** se solicita el prerrequisito de 8.° EGB (subnivel 4) en Lengua y Literatura
- **THEN** el resolver devuelve `{ Lengua y Literatura, subnivel 3 }` porque el grado anterior (7.° EGB) pertenece a Básica Media

#### Scenario: Grado anterior en subnivel distinto en Bachillerato
- **WHEN** se solicita el prerrequisito de 1.° BGU (subnivel 5) en Lengua y Literatura
- **THEN** el resolver devuelve `{ Lengua y Literatura, subnivel 4 }` porque el grado anterior (10.° EGB) pertenece a Básica Superior

### Requirement: Invariante de no devolver el par del curso
El resolver SHALL NOT devolver el mismo par `(área, subnivel)` que el subnivel
actual del curso. Cuando el grado anterior pertenece al mismo subnivel que el
curso, el resolver SHALL devolver `null` y el diagnóstico se apoya en las
destrezas del subnivel del curso.

#### Scenario: Grado anterior dentro del mismo subnivel
- **WHEN** se solicita el prerrequisito de 6.° EGB (subnivel 3) en Matemática
- **THEN** el resolver devuelve `null` porque el grado anterior (5.° EGB) también pertenece al subnivel 3
- **AND** el diagnóstico ofrece las destrezas del subnivel del curso (3) como nivel actual

#### Scenario: Grado anterior dentro del mismo subnivel en Bachillerato
- **WHEN** se solicita el prerrequisito de 2.° BGU (subnivel 5) en Lengua y Literatura
- **THEN** el resolver devuelve `null` porque el grado anterior (1.° BGU) también pertenece al subnivel 5
- **AND** el diagnóstico ofrece las destrezas del subnivel del curso (5)

### Requirement: Orden de resolución de Preparatoria y áreas derivadas
Las reglas especiales (currículo integrado de Preparatoria `CAI` y el mapeo de
áreas derivadas de Bachillerato a su área madre, ej: `CN.F → CN`) SHALL
aplicarse **después** de calcular el subnivel del grado anterior, y sobre ese
subnivel resuelto. El subnivel del grado anterior es el que decide qué regla
especial corresponde, no el subnivel del curso.

#### Scenario: Preparatoria se decide por el subnivel del grado anterior
- **WHEN** se solicita el prerrequisito de 2.° EGB en cualquier área de Básica Elemental
- **THEN** el subnivel del grado anterior es Preparatoria (1.° EGB)
- **AND** el resolver devuelve `{ CAI, Preparatoria }` para cualquiera de esas áreas, porque Preparatoria es currículo integrado

#### Scenario: Área madre se decide por el subnivel del grado anterior
- **WHEN** se solicita el prerrequisito de Física (`CN.F`) en 1.° BGU
- **THEN** el subnivel del grado anterior es Básica Superior (10.° EGB, subnivel 4)
- **AND** el resolver devuelve `{ Ciencias Naturales, subnivel 4 }` (área madre) en ese subnivel

### Requirement: Retorno nulo por ausencia de predecesor
Cuando el área solicitada no tiene predecesor en el catálogo para el subnivel
del grado anterior, el resolver SHALL devolver `null` y la UI SHALL informarlo
sin sustituir el área por una parecida.

#### Scenario: Área sin predecesor en el subnivel del grado anterior
- **WHEN** se solicita el prerrequisito de Emprendimiento y Gestión (`EG`) en 1.° BGU
- **THEN** el resolver devuelve `null` porque `EG` no tiene destrezas en el subnivel 4
- **AND** la UI informa que el área no tiene nivel prerrequisito y ofrece solo el subnivel del curso

#### Scenario: Grado sin grado anterior dentro del alcance
- **WHEN** se solicita el prerrequisito de 1.° EGB (Preparatoria) o de Inicial
- **THEN** el resolver devuelve `null` porque no existe un grado anterior dentro del alcance del módulo

### Requirement: Único punto de verdad del prerrequisito
Todos los puntos de entrada que calculan el nivel prerrequisito del diagnóstico
(selección manual en Evaluación Diagnóstica, preselección desde el wizard CNC,
y el buscador de destrezas de Semana 1 y Semanas 2-3) SHALL consumir el mismo
resolver por grado anterior. Ninguno SHALL reimplementar localmente la regla
`subnivel − 1`.

#### Scenario: Los tres flujos coinciden en el mismo resultado
- **WHEN** el mismo curso (ej: 6.° EGB) llega a la selección de destrezas en Evaluación Diagnóstica, en el wizard CNC y en el buscador de Semanas 2-3
- **THEN** los tres flujos muestran el mismo resultado del prerrequisito (`null` → subnivel del curso) porque consumen el mismo resolver

### Requirement: Mensajes diferenciados según la causa de ausencia
Cuando el resolver devuelve `null`, la UI SHALL distinguir la causa: (a) el
grado anterior pertenece al mismo subnivel del curso — se explica que el
diagnóstico usa el subnivel actual; (b) el área no tiene predecesor en el
catálogo — se informa que el área no tiene nivel prerrequisito.

#### Scenario: Mensaje para grado anterior en el mismo subnivel
- **WHEN** el resolver devuelve `null` porque el grado anterior comparte subnivel con el curso
- **THEN** la UI muestra un mensaje que explica que se diagnostican las destrezas del subnivel actual del curso

#### Scenario: Mensaje para área sin predecesor
- **WHEN** el resolver devuelve `null` porque el área no tiene predecesor en el catálogo
- **THEN** la UI muestra un mensaje que informa que el área no tiene un nivel prerrequisito definido

### Requirement: Alcance de la modalidad técnica
El diagnóstico curricular técnico por módulos formativos (modalidad BT) queda
fuera del alcance de esta resolución. El comportamiento para BT no SHALL
cambiar con esta capability.

#### Scenario: BT conserva su comportamiento
- **WHEN** el curso es de modalidad BT
- **THEN** el resolver mantiene el comportamiento previo (sin diagnóstico curricular por destrezas)
- **AND** no se aplica la resolución por grado anterior sobre destrezas