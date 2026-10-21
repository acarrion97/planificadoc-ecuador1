## Purpose

Permitir que un docente de un aula multigrado (2 o más grados de EGB/BGU compartiendo un mismo espacio y trimestre) genere, desde Currículo Integrado EGB/BGU, una única planificación microcurricular por competencias que combine esos grados, en vez de tener que fabricar planificaciones separadas por grado.

## ADDED Requirements

### Requirement: Elegir modalidad de planificación
El sistema SHALL permitir al docente elegir, al iniciar una planificación de Currículo Integrado EGB/BGU, entre modalidad de un solo grado (comportamiento existente, sin cambios) y modalidad multigrado.

#### Scenario: Docente elige modalidad multigrado
- **WHEN** el docente inicia una nueva planificación de Currículo Integrado EGB/BGU y selecciona "Planificación multigrado"
- **THEN** el sistema lo dirige a un flujo de selección de subnivel y de 2 o más grados, en vez del flujo de un solo grado

#### Scenario: Docente elige modalidad de un solo grado
- **WHEN** el docente inicia una nueva planificación de Currículo Integrado EGB/BGU y no selecciona la modalidad multigrado
- **THEN** el sistema se comporta exactamente igual que antes de este cambio, sin pedir selección de múltiples grados

### Requirement: Selección de grados del mismo subnivel
En modalidad multigrado, el sistema SHALL exigir que el docente seleccione un subnivel y, dentro de ese subnivel, al menos 2 grados sobre los que se combinará la planificación.

#### Scenario: Selección válida de grados
- **WHEN** el docente selecciona un subnivel y marca 2 o más grados que pertenecen a ese subnivel
- **THEN** el sistema acepta la selección y continúa al paso de elegir la Competencia Específica

#### Scenario: Selección con un solo grado
- **WHEN** el docente en modalidad multigrado intenta continuar habiendo marcado un único grado
- **THEN** el sistema impide continuar e indica que la modalidad multigrado requiere 2 o más grados

### Requirement: Validación de Competencia Específica común
El sistema SHALL exigir que la Competencia Específica (CE) elegida para la planificación multigrado esté disponible, en el catálogo curricular, para todos los grados seleccionados. El sistema SHALL NOT permitir generar la planificación con una CE que no cubra alguno de los grados seleccionados.

#### Scenario: CE disponible para todos los grados seleccionados
- **WHEN** el docente selecciona una CE que el catálogo asocia a cada uno de los grados marcados
- **THEN** el sistema acepta la CE y resuelve el bloque curricular de cada grado

#### Scenario: CE que no cubre todos los grados seleccionados
- **WHEN** el docente selecciona una CE que el catálogo no asocia a uno o más de los grados marcados
- **THEN** el sistema bloquea la selección y explica cuál(es) grado(s) no están cubiertos por esa CE, sin permitir avanzar con esa combinación

### Requirement: Resolución automática del bloque curricular por grado
Una vez elegidos los grados y la CE, el sistema SHALL resolver automáticamente, para cada grado seleccionado, su bloque curricular (indicadores de evaluación y saberes declarativos, procedimentales y actitudinales) a partir del catálogo curricular existente, sin requerir que el docente arme esa información desde cero.

#### Scenario: Resolución automática al confirmar grados y CE
- **WHEN** el docente confirma los grados seleccionados y la CE común
- **THEN** el sistema muestra, para cada grado, sus indicadores y saberes (declarativos, procedimentales, actitudinales) tal como constan en el catálogo para esa combinación de CE y grado

### Requirement: Copia editable e independiente del catálogo
El sistema SHALL guardar en la planificación una copia del bloque curricular resuelto por grado, editable por el docente, de forma que una modificación posterior del catálogo curricular no altere planificaciones ya guardadas, y una edición del docente no modifique el catálogo.

#### Scenario: El docente edita el bloque curricular de un grado
- **WHEN** el docente modifica el texto de un indicador o saber resuelto para un grado antes de guardar
- **THEN** la planificación guardada refleja el texto editado por el docente, y el catálogo curricular permanece sin cambios

#### Scenario: El catálogo cambia después de guardar una planificación
- **WHEN** el catálogo curricular de una materia se actualiza después de que una planificación multigrado fue guardada
- **THEN** la planificación ya guardada conserva el bloque curricular tal como fue resuelto y/o editado en el momento de guardarla, sin verse afectada por el cambio posterior del catálogo

### Requirement: Generación de semanas diferenciadas por grado
El sistema SHALL generar, para cada semana del trimestre, un tema común y una actividad diferenciada por cada grado seleccionado (estrategias metodológicas desde el DUA de inicio/desarrollo/cierre, recursos, técnica e instrumento de evaluación), permitiendo al docente revisar y ajustar el contenido de cada grado antes de guardar.

#### Scenario: Generación de una semana con actividades por grado
- **WHEN** el sistema genera el contenido de una semana para una planificación multigrado de 3 grados
- **THEN** el resultado incluye un tema común para la semana y, para cada uno de los 3 grados, su propia actividad de inicio/desarrollo/cierre, recursos y técnica/instrumento de evaluación

#### Scenario: El docente ajusta la actividad de un grado en una semana
- **WHEN** el docente edita la actividad generada para uno de los grados en una semana específica
- **THEN** el sistema conserva sin cambios las actividades de los demás grados en esa misma semana

### Requirement: Exportación de la planificación multigrado
El sistema SHALL exportar una planificación multigrado a Word y a PDF usando el patrón multigrado (encabezado con los grados combinados y la modalidad indicada, tabla de indicadores/saberes cruzada por grado, y tablas semanales cruzadas por grado), sin alterar el formato de exportación de las planificaciones de un solo grado.

#### Scenario: Exportar a Word una planificación multigrado
- **WHEN** el docente exporta a Word una planificación guardada en modalidad multigrado
- **THEN** el documento generado muestra los grados combinados en el encabezado, la tabla de indicadores/saberes con una fila por grado, y cada semana con una fila de actividad por grado

#### Scenario: Exportar a PDF una planificación multigrado
- **WHEN** el docente exporta a PDF una planificación guardada en modalidad multigrado
- **THEN** el documento generado sigue el mismo patrón multigrado que la exportación a Word

#### Scenario: Exportar una planificación de un solo grado
- **WHEN** el docente exporta a Word o PDF una planificación guardada en modalidad de un solo grado
- **THEN** el documento generado es idéntico en formato al que el sistema producía antes de este cambio

### Requirement: Edición posterior de una planificación multigrado
El sistema SHALL reabrir una planificación guardada en modalidad multigrado en el flujo de edición multigrado, con los grados, la CE y los bloques curriculares previamente guardados precargados.

#### Scenario: Editar una planificación multigrado existente
- **WHEN** el docente abre para editar una planificación previamente guardada en modalidad multigrado
- **THEN** el sistema carga el flujo multigrado con los grados, la CE y el contenido de cada grado y semana tal como fueron guardados, permitiendo modificarlos
