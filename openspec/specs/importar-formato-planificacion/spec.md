## Purpose

Permite a un docente subir un documento Word o PDF con un formato oficial de planificación MinEduc (en blanco o parcialmente llenado), reconocer su estructura, completar sus campos con datos de la planificación existente y con IA, y descargar el documento final en el mismo formato.

## ADDED Requirements

### Requirement: Carga de documento a importar
El sistema SHALL permitir al docente subir un archivo con extensión `.doc`, `.docx` o `.pdf` desde una pantalla dedicada de "Importar formato".

#### Scenario: Subida exitosa de un docx válido
- **WHEN** el docente selecciona un archivo `.docx` menor al límite de tamaño permitido y confirma la subida
- **THEN** el sistema acepta el archivo, lo almacena temporalmente y muestra el estado "Analizando documento"

#### Scenario: Archivo con extensión no soportada
- **WHEN** el docente intenta subir un archivo con una extensión distinta de `.doc`, `.docx` o `.pdf`
- **THEN** el sistema rechaza la subida antes de procesarla y muestra un mensaje indicando los formatos aceptados

#### Scenario: Archivo que excede el tamaño máximo
- **WHEN** el docente intenta subir un archivo que excede el límite de tamaño configurado
- **THEN** el sistema rechaza la subida y muestra un mensaje indicando el límite permitido

### Requirement: Reconocimiento del tipo y estructura del formato
El sistema SHALL analizar el documento subido para identificar a cuál de los tipos de planificación soportados (PCA, PCA trimestral, adaptación curricular, plan semanal, plan inicial, CNC, evaluación diagnóstica, BT) corresponde, y SHALL extraer sus secciones y campos reconocibles (encabezados, tablas, celdas).

#### Scenario: Documento coincide con un formato soportado
- **WHEN** el documento subido contiene las secciones y estructura de tabla características de uno de los formatos soportados
- **THEN** el sistema identifica el tipo de planificación correspondiente y extrae los campos y valores presentes (incluidos los ya llenados a mano)

#### Scenario: Documento no coincide con ningún formato soportado
- **WHEN** el documento subido no contiene una estructura reconocible como ninguno de los formatos soportados
- **THEN** el sistema informa al docente que no pudo reconocer el formato y no intenta generar un resultado

#### Scenario: Documento dañado o no se puede leer
- **WHEN** el archivo subido está corrupto o no puede abrirse/parsearse
- **THEN** el sistema muestra un error claro indicando que el archivo no pudo procesarse, sin exponer detalles técnicos internos

### Requirement: Completado de campos con IA a partir de la planificación existente
Dado un documento importado y reconocido, el sistema SHALL completar los campos vacíos o incompletos usando los datos de la planificación correspondiente ya almacenada por el docente para ese período/asignatura, y SHALL usar IA para generar contenido razonable cuando no exista una planificación fuente con ese dato.

#### Scenario: Existe una planificación previa del docente para ese tipo/período
- **WHEN** el sistema reconoce el formato y encuentra una planificación guardada del mismo docente que corresponde al mismo tipo, área/asignatura y período
- **THEN** completa los campos vacíos del documento importado con los datos de esa planificación, preservando los valores que el documento ya traía llenados a mano

#### Scenario: No existe planificación previa para completar un campo
- **WHEN** un campo del documento importado está vacío y no hay dato disponible en ninguna planificación guardada del docente
- **THEN** el sistema genera con IA un valor sugerido para ese campo, siguiendo el mismo criterio pedagógico usado en la generación normal de planificaciones

#### Scenario: La IA devuelve datos que no cumplen el esquema esperado
- **WHEN** la respuesta de la IA para completar los campos no valida contra el esquema esperado del tipo de planificación
- **THEN** el sistema reintenta o repara la respuesta, y si no logra obtener datos válidos, informa el error al docente sin generar un documento incompleto o corrupto

### Requirement: Generación del documento final en el formato importado
El sistema SHALL generar un documento Word descargable que preserve el formato/plantilla del documento importado (mismas secciones, tablas y orden), con los campos completados.

#### Scenario: Generación exitosa tras completar los campos
- **WHEN** todos los campos requeridos del tipo de planificación reconocido quedaron completos (por dato existente o por IA)
- **THEN** el sistema genera un archivo `.docx` final y lo pone disponible para que el docente lo descargue

### Requirement: Documentos de prueba para validar el flujo de importación
El sistema SHALL contar con documentos de prueba generables que reproduzcan el formato oficial de cada tipo de planificación soportado, incluyendo marca de agua con el logo institucional y datos de la institución en el pie de página, para verificar el flujo de importación de extremo a extremo sin depender de archivos reales de docentes.

#### Scenario: Generar documento de prueba con datos institucionales
- **WHEN** se solicita un documento de prueba para un tipo de planificación soportado con datos ficticios de una institución (nombre, logo, período)
- **THEN** el sistema produce un archivo en el formato oficial correspondiente con la marca de agua del logo y los datos de la institución en el pie de página, listo para usarse como entrada del flujo de importación