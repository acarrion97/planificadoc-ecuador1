## Purpose

Modelo de datos para el catálogo curricular oficial del Bachillerato Técnico: áreas técnicas, familias profesionales, figuras profesionales, módulos formativos, contenidos atómicos, resultados de aprendizaje y criterios de evaluación conforme al Acuerdo Ministerial 00065-A.

## ADDED Requirements

### Requirement: Jerarquía curricular BT
El sistema SHALL mantener la jerarquía: Área Técnica → Familia Profesional → Figura Profesional → Módulo Formativo, donde cada nivel es una entidad persistente con relación padre-hijo.

#### Scenario: Navegación completa
- **WHEN** un docente navega el catálogo curricular BT
- **THEN** puede recorrer áreas, familias, figuras y módulos en jerarquía

#### Scenario: Figura con múltiples módulos
- **WHEN** se consulta la figura "Actividad Física, Deporte y Recreación"
- **THEN** el sistema muestra todos sus módulos formativos asociados

### Requirement: Módulos con distribución por año BGU
El sistema SHALL permitir que un módulo formativo esté asociado a uno o más años de BGU (1.º, 2.º, 3.º) mediante una relación explícita con carga horaria por año, sin asumir relación 1:1.

#### Scenario: Módulo transversal
- **WHEN** un módulo formativo está asignado a 1.º y 2.º BGU
- **THEN** el sistema muestra el módulo en ambos años con su carga horaria respectiva

#### Scenario: Módulo exclusivo de tercer año
- **WHEN** un módulo está asignado únicamente a 3.º BGU
- **THEN** el sistema solo lo muestra en la vista de tercer año

### Requirement: Contenidos atómicos por tipo
El sistema SHALL almacenar contenidos como registros individuales con tipo (conceptual, procedimental, actitudinal), descripción y orden, permitiendo seleccionar y secuenciar contenidos concretos sin partir bloques de texto.

#### Scenario: Creación de contenido conceptual
- **WHEN** se registra un contenido de tipo "conceptual" para un módulo
- **THEN** el sistema almacena la descripción, el tipo y el orden de secuenciación

#### Scenario: Listado por tipo
- **WHEN** se consultan los contenidos de un módulo filtrados por tipo "procedimental"
- **THEN** el sistema devuelve únicamente los contenidos procedimentales ordenados

### Requirement: Resultados de aprendizaje (RA) con criterios de evaluación (CE)
El sistema SHALL modelar resultados de aprendizaje como entidades independientes dentro de un módulo, cada uno con código, descripción y uno o más criterios de evaluación asociados.

#### Scenario: RA con múltiples CE
- **WHEN** se consulta el RA "RA-1" de un módulo
- **THEN** el sistema muestra su descripción completa y todos sus CE asociados (CE-1.1, CE-1.2, etc.)

#### Scenario: RA sin CE
- **WHEN** un RA no tiene criterios de evaluación registrados
- **THEN** el sistema muestra el RA con lista vacía de CE

### Requirement: Carga horaria por año
El sistema SHALL registrar la carga horaria semanal de formación técnica para cada año BGU: 10 períodos en 1.º, 10 en 2.º y 25 en 3.º, conforme al Art. 34 del Reglamento General a la LOEI.

#### Scenario: Carga horaria configurada
- **WHEN** se consulta la distribución de un módulo en 1.º BGU
- **THEN** el sistema muestra la carga horaria semanal asignada a ese módulo para ese año

### Requirement: Datos semilla del Acuerdo 00065-A
El sistema SHALL incluir datos semilla de las 10 familias profesionales y sus figuras vigentes según el Acuerdo 00065-A, cargados desde los documentos oficiales del Ministerio.

#### Scenario: Familias cargadas
- **WHEN** se consulta el catálogo BT después de la migración inicial
- **THEN** el sistema muestra las 10 familias profesionales vigentes

#### Scenario: Figuras vigentes
- **WHEN** se navega la familia "Deportes y Salud"
- **THEN** el sistema muestra las figuras vigentes: "Actividad Física, Deporte y Recreación" y "Gestión Deportiva y Cultural"
