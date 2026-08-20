## Purpose

Recurso curricular de desagregación/gradación: para cada DCD con criterio de desempeño del catálogo oficial y su indicador de evaluación, genera y persiste versiones graduadas por grado del subnivel — de menor a mayor complejidad — dejando la versión completa (texto oficial) en el último grado, sin modificar nunca el catálogo.

## ADDED Requirements

### Requirement: Resolución de grados por subnivel
El sistema SHALL resolver los grados que aplican a la desagregación según el subnivel de la DCD: subnivel 2 → 2.º, 3.º, 4.º; subnivel 3 → 5.º, 6.º, 7.º; subnivel 4 → 8.º, 9.º, 10.º; subnivel 5 → 1.º, 2.º, 3.º BGU. El subnivel 1 (Preparatoria) SHALL NOT ofrecer desagregación porque consta de un solo grado.

#### Scenario: Grados de Básica Elemental
- **WHEN** el sistema resuelve la desagregación de una DCD de subnivel 2
- **THEN** los grados destino son 2.º, 3.º y 4.º

#### Scenario: Grados de Básica Media
- **WHEN** el sistema resuelve la desagregación de una DCD de subnivel 3
- **THEN** los grados destino son 5.º, 6.º y 7.º

#### Scenario: Grados de Básica Superior
- **WHEN** el sistema resuelve la desagregación de una DCD de subnivel 4
- **THEN** los grados destino son 8.º, 9.º y 10.º

#### Scenario: Grados de Bachillerato
- **WHEN** el sistema resuelve la desagregación de una DCD de subnivel 5
- **THEN** los grados destino son 1.º, 2.º y 3.º BGU, y cada grado obtiene su versión graduada siempre que el catálogo contenga la DCD y su indicador en ese subnivel

#### Scenario: Preparatoria sin desagregación
- **WHEN** una DCD pertenece al subnivel 1 (Preparatoria)
- **THEN** el sistema no ofrece desagregación por grados e informa que el subnivel tiene un solo grado

### Requirement: Gradación paralela de DCD e indicador
El sistema SHALL desagregar la DCD con criterio de desempeño y su indicador de evaluación en paralelo, generando para cada grado una versión graduada de ambos. El último grado del subnivel SHALL conservar la DCD y el indicador completos, idénticos al texto oficial del catálogo.

#### Scenario: Elemental de menor a mayor complejidad
- **WHEN** se desagrega CN.2.1.1 ("Observar las etapas del ciclo vital del ser humano y registrar gráficamente los cambios de acuerdo a la edad") para subnivel 2
- **THEN** 2.º recibe una DCD graduada simplificada (p. ej. "Identificar las etapas del ciclo vital del ser humano"), 3.º una versión intermedia, y 4.º recibe la DCD completa con el texto oficial exacto

#### Scenario: Indicador graduado en paralelo
- **WHEN** se desagrega una DCD con indicador I.CN.2.1.1
- **THEN** cada grado recibe también un indicador graduado, y el último grado recibe el indicador completo con el texto oficial exacto

### Requirement: La DCD oficial nunca se modifica
La desagregación SHALL ser una derivación que referencia a la DCD e indicador oficiales por código, y SHALL NOT modificar, sustituir ni eliminar las entradas del catálogo curricular.

#### Scenario: El catálogo permanece intacto
- **WHEN** el docente genera una desagregación para CN.2.1.1
- **THEN** la entrada CN.2.1.1 del catálogo conserva exactamente su `descripcion` e `indicadoresEvaluacion` originales

### Requirement: Generación con IA restringida pedagógicamente
La generación por IA SHALL recibir como insumos la DCD original, el indicador original, el grado destino, el grado máximo del subnivel, el proceso cognitivo esperado para el grado y las restricciones de contenido. La IA SHALL NOT introducir conocimientos, conceptos ni contenidos que no estén contenidos en la DCD original. Para el último grado, la salida SHALL ser idéntica al texto oficial.

#### Scenario: Restricción de contenido
- **WHEN** se solicita la versión graduada de 2.º para la DCD sobre el ciclo vital del ser humano
- **THEN** la propuesta se limita a los contenidos de la DCD original y no introduce temas ajenos (p. ej. cambios hormonales de la pubertad)

#### Scenario: Último grado idéntico al oficial
- **WHEN** se genera la versión del último grado del subnivel
- **THEN** la DCD graduada y el indicador graduado coinciden carácter por carácter con el texto oficial del catálogo

### Requirement: Persistencia con estado y edición docente
El sistema SHALL persistir cada fila de desagregación con la DCD original (código y texto), el grado destino, la DCD graduada, el indicador original, el indicador graduado y un estado (`generado | editado | aprobado`). El docente SHALL poder editar la DCD graduada y el indicador graduado; al editar, el estado SHALL pasar a `editado`, y el docente SHALL poder marcarla como `aprobado`.

#### Scenario: Edición del docente
- **WHEN** el docente corrige la DCD graduada de 3.º
- **THEN** el texto corregido se persiste, el estado pasa a `editado`, y las planificaciones posteriores usan la versión corregida

#### Scenario: Aprobación
- **WHEN** el docente marca una fila desagregada como aprobada
- **THEN** el estado queda en `aprobado` y el sistema la considera definitiva para su reutilización

### Requirement: Reutilización de la desagregación generada
El sistema SHALL NOT regenerar una desagregación existente. Dado un par DCD + grado, si existe una fila persistida, el sistema SHALL mostrarla tal cual; solo si no existe SHALL ofrecer generarla.

#### Scenario: Reutilizar versión guardada
- **WHEN** el docente solicita la versión de 6.º de una DCD que ya fue desagregada
- **THEN** el sistema muestra la fila guardada sin volver a invocar a la IA

#### Scenario: Generar solo si falta
- **WHEN** el docente solicita la versión de 7.º de una DCD sin desagregación previa
- **THEN** el sistema ofrece generar la desagregación para 7.º

### Requirement: Resolución automática según el grado de contexto
El sistema SHALL resolver el grado de la desagregación a partir del contexto de la planificación cuando este ya lo conozca, sin pedir al docente que seleccione el grado manualmente. Si no existe desagregación para ese grado, el sistema SHALL ofrecer generarla para el grado resuelto.

#### Scenario: Contexto de 6.º EGB
- **WHEN** el docente crea una planificación de 6.º EGB y selecciona una DCD de subnivel 3
- **THEN** el sistema resuelve automáticamente que se necesita la versión de 6.º y la muestra si existe o ofrece generarla sin preguntar el grado

### Requirement: Recurso distinto de la adaptación curricular
La desagregación/gradación SHALL ser un recurso curricular independiente de la adaptación curricular. El sistema SHALL NOT etiquetar las versiones graduadas como `DcdAdaptada` ni mezclarlas con los datos de adaptaciones curriculares por grado.

#### Scenario: Modelos separados
- **WHEN** el sistema guarda una desagregación de una DCD y una adaptación curricular de la misma DCD
- **THEN** ambos recursos coexisten como entidades separadas, sin sobrescribirse entre sí