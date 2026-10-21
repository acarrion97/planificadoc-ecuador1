## Purpose

Permitir a un docente planificar, guardar, reutilizar y exportar un Proyecto Interdisciplinar que integra varias áreas curriculares alrededor de un producto final común, con articulación curricular trazable al catálogo oficial y sin duplicar información curricular ya existente en el sistema.

## ADDED Requirements

### Requirement: Creación de proyecto con base curricular explícita
El sistema SHALL exigir que el docente elija, al crear un Proyecto Interdisciplinar, una base curricular única para todo el proyecto: destrezas con criterios de desempeño (currículo de destrezas) o competencias específicas (Currículo Nacional por Competencias). El sistema SHALL impedir mezclar códigos de ambas bases dentro del mismo proyecto.

#### Scenario: Elegir base curricular al crear
- **WHEN** el docente inicia un nuevo Proyecto Interdisciplinar
- **THEN** el sistema exige seleccionar "destrezas" o "competencias" antes de continuar al paso de áreas

#### Scenario: Bloquear mezcla de bases curriculares
- **WHEN** el docente intenta asociar un elemento curricular cuya base no coincide con la base curricular elegida para el proyecto
- **THEN** el sistema rechaza la asociación y explica la incompatibilidad

### Requirement: Selección libre de nivel, subnivel, grado y área
El sistema SHALL permitir asociar al proyecto una o más áreas, cada una con su propio nivel educativo, subnivel y grado/curso, sin restringir las combinaciones a un conjunto fijo.

#### Scenario: Agregar múltiples áreas con niveles distintos
- **WHEN** el docente agrega el área "Matemática" en EGB Superior y el área "Ciencias Naturales" en BGU al mismo proyecto
- **THEN** el sistema acepta ambas áreas como participantes del proyecto, cada una con su nivel/subnivel/grado propio

#### Scenario: Eliminar un área participante
- **WHEN** el docente elimina un área ya agregada
- **THEN** el sistema quita el área y todos los elementos curriculares y actividades que dependían exclusivamente de ella

### Requirement: Articulación curricular por referencia, no por copia
Para cada área participante, el sistema SHALL permitir seleccionar uno o más elementos curriculares (destrezas o competencias específicas, según la base del proyecto) del catálogo existente, guardando únicamente el código y sus metadatos de trazabilidad (versión curricular, área, nivel, subnivel, grado), nunca una copia de la descripción, criterios o indicadores.

#### Scenario: Seleccionar un elemento curricular existente
- **WHEN** el docente busca y selecciona un código curricular del catálogo para un área del proyecto
- **THEN** el sistema guarda el código y su trazabilidad, y muestra descripción/criterios/indicadores resueltos en vivo desde el catálogo, sin copiarlos al registro guardado

#### Scenario: Elemento curricular no encontrado en el catálogo actual
- **WHEN** el sistema intenta resolver un código curricular guardado que ya no existe en el catálogo estático
- **THEN** el sistema muestra el código crudo con una indicación de "no encontrado en el catálogo actual", sin fallar la carga del proyecto

#### Scenario: Requerir al menos un elemento curricular por área
- **WHEN** el docente intenta avanzar de la articulación curricular sin haber seleccionado ningún elemento para un área participante
- **THEN** el sistema bloquea el avance e indica qué área necesita al menos un elemento curricular

### Requirement: Actividades organizadas por fase
El sistema SHALL permitir registrar actividades del proyecto agrupadas en tres fases: Planificación, Gestión y Evaluación. Cada actividad SHALL incluir descripción, recursos, evidencia esperada y forma de evaluación.

#### Scenario: Registrar actividad en una fase
- **WHEN** el docente agrega una actividad a la fase "Gestión"
- **THEN** el sistema la guarda asociada a esa fase, con su recurso, evidencia y evaluación, y en el orden en que fue agregada

#### Scenario: Requerir al menos una actividad
- **WHEN** el docente intenta avanzar sin haber registrado ninguna actividad
- **THEN** el sistema bloquea el avance e indica que se requiere al menos una actividad

### Requirement: Evaluación del proyecto
El sistema SHALL permitir relacionar cada actividad con una evidencia, un criterio o indicador curricular (de los ya seleccionados en la articulación curricular del área correspondiente) y un instrumento de evaluación.

#### Scenario: Vincular evidencia a un criterio ya seleccionado
- **WHEN** el docente relaciona la evidencia de una actividad con un criterio de evaluación de un elemento curricular ya asociado al proyecto
- **THEN** el sistema guarda la relación y la refleja en la vista de revisión y en el documento exportado

### Requirement: Vista de revisión previa
El sistema SHALL mostrar una vista de revisión con toda la información del proyecto (información general, áreas, articulación curricular, actividades por fase, evaluación) antes de permitir guardar como generado o exportar.

#### Scenario: Revisar antes de exportar
- **WHEN** el docente completa los pasos previos y llega al paso de revisión
- **THEN** el sistema presenta un resumen completo del proyecto, sin permitir exportar si faltan campos obligatorios pendientes

### Requirement: Asistencia de IA acotada a contenido textual
El sistema MAY ofrecer sugerencias generadas por IA para título, pregunta guía, objetivo general, producto final, actividades, recursos e instrumentos de evaluación, únicamente a partir de las áreas y elementos curriculares que el docente ya seleccionó. El sistema SHALL impedir que la IA determine o modifique códigos curriculares.

#### Scenario: Sugerir título con IA
- **WHEN** el docente solicita una sugerencia de título con IA tras seleccionar áreas y elementos curriculares
- **THEN** el sistema genera una sugerencia de texto basada solo en las áreas/elementos ya seleccionados, sin introducir códigos curriculares nuevos

#### Scenario: La IA no puede inventar códigos curriculares
- **WHEN** una respuesta de IA contiene un valor que parece un código curricular no seleccionado por el docente
- **THEN** el sistema no lo persiste como elemento curricular del proyecto (los códigos curriculares solo se agregan por selección explícita del catálogo)

### Requirement: Ciclo de vida completo del proyecto
El sistema SHALL permitir crear, obtener, actualizar, eliminar, duplicar, listar y buscar Proyectos Interdisciplinares, particionados por la misma identidad de sesión (email o dispositivo) que usa el resto de módulos de planificación.

#### Scenario: Duplicar un proyecto existente
- **WHEN** el docente duplica un proyecto guardado
- **THEN** el sistema crea una copia independiente editable, con nuevo identificador, sin afectar el proyecto original

#### Scenario: Listar solo los proyectos propios
- **WHEN** el docente abre el listado de Proyectos Interdisciplinares
- **THEN** el sistema muestra únicamente los proyectos asociados a su sessionId (email o deviceId), ordenados por fecha de actualización descendente

#### Scenario: Eliminar un proyecto
- **WHEN** el docente elimina un proyecto guardado
- **THEN** el sistema lo borra de forma permanente y deja de aparecer en el listado

### Requirement: Exportación a Word y PDF
El sistema SHALL permitir exportar un Proyecto Interdisciplinar completo a formato Word (.docx) y PDF, incluyendo información institucional, áreas participantes con su articulación curricular, actividades por fase, evaluación y espacio de firmas de los docentes participantes.

#### Scenario: Exportar a Word
- **WHEN** el docente solicita exportar un proyecto guardado a Word
- **THEN** el sistema genera un archivo .docx con todas las secciones del proyecto, resolviendo cada elemento curricular referenciado contra el catálogo vigente al momento de exportar

#### Scenario: Exportar a PDF
- **WHEN** el docente solicita exportar un proyecto guardado a PDF
- **THEN** el sistema genera un archivo PDF equivalente en contenido al documento Word

### Requirement: Validación mínima antes de guardar como generado
El sistema SHALL exigir, antes de marcar un proyecto como "generado" (no borrador) o exportarlo, que tenga: título, al menos un área participante, al menos un elemento curricular por área participante, duración válida, producto final definido, al menos una actividad, e información institucional básica.

#### Scenario: Bloquear generación incompleta
- **WHEN** el docente intenta marcar como generado o exportar un proyecto al que le falta un campo obligatorio
- **THEN** el sistema bloquea la acción y señala qué campo(s) faltan
