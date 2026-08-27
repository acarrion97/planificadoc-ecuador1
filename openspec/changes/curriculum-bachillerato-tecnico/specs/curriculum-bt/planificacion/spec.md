## Purpose

Capa de planificación anual y trimestral para Bachillerato Técnico: permite al docente distribuir los contenidos y resultados de aprendizaje del catálogo curricular oficial entre los tres trimestres del año lectivo, respetando la secuenciación pedagógica sin modificar el documento oficial.

## ADDED Requirements

### Requirement: Planificación BT por figura y año lectivo
El sistema SHALL permitir crear una planificación BT asociada a una figura profesional, año BGU (1.º, 2.º, 3.º) y año lectivo, conteniendo la distribución de módulos, contenidos y RA entre los tres trimestres.

#### Scenario: Creación de planificación
- **WHEN** un docente crea una planificación BT para "Actividad Física, Deporte y Recreación" en 1.º BGU, año lectivo 2026
- **THEN** el sistema crea un registro de planificación con los módulos disponibles para ese año

#### Scenario: Planificación duplicada
- **WHEN** un docente intenta crear una planificación para la misma figura, año BGU y año lectivo
- **THEN** el sistema rechaza la creación o advierte que ya existe una planificación

### Requirement: Distribución de contenidos entre trimestres
El sistema SHALL permitir asignar contenidos del catálogo curricular a trimestres específicos (T1, T2, T3) dentro de una planificación, sin duplicar el contenido ni perder la referencia al catálogo oficial.

#### Scenario: Asignación a T1
- **WHEN** un docente asigna un contenido conceptual a T1 en la planificación
- **THEN** el sistema registra la asignación y el contenido aparece en T1

#### Scenario: Contenido no duplicado
- **WHEN** un contenido ya está asignado a T1
- **THEN** el sistema no permite asignarlo nuevamente a T2 sin antes desasignarlo de T1

#### Scenario: Referencia al catálogo
- **WHEN** se consulta un contenido asignado a T1
- **THEN** el sistema muestra la referencia al módulo y RA del catálogo oficial

### Requirement: Secuenciación de RA por trimestre
El sistema SHALL permitir distribuir los resultados de aprendizaje de un módulo entre los tres trimestres, respetando la progresión pedagógica y sin inventar nuevos RA.

#### Scenario: RA dividido pedagógicamente
- **WHEN** un docente distribuye el RA-1 entre T1 y T2
- **THEN** el sistema registra que parte del RA-1 corresponde a T1 y parte a T2, manteniendo la referencia al RA oficial

#### Scenario: RA completo en un trimestre
- **WHEN** un docente asigna un RA completo a T3
- **THEN** el sistema registra que todo el RA-1 corresponde a T3

### Requirement: Carga horaria por trimestre
El sistema SHALL calcular y mostrar la carga horaria total de formación técnica por trimestre, sumando las horas de los módulos asignados a cada trimestre.

#### Scenario: Cálculo automático
- **WHEN** se asignan módulos con 10 horas/semana a T1 y módulos con 15 horas/semana a T2
- **THEN** el sistema muestra 10 horas/semana para T1 y 15 horas/semana para T2

#### Scenario: Validación contra carga máxima
- **WHEN** la suma de horas de T1 excede las 21 horas pedagógicas semanales
- **THEN** el sistema muestra una advertencia de carga horaria excesiva

### Requirement: Planificación como capa separada del catálogo
El sistema SHALL mantener el catálogo curricular oficial intacto; la planificación es una capa derivada que referencia el catálogo sin modificarlo.

#### Scenario: Catálogo inmutable
- **WHEN** se modifica una planificación BT
- **THEN** los datos del catálogo curricular (módulos, RA, CE) no se ven afectados

#### Scenario: Planificación reproducible
- **WHEN** se consulta una planificación guardada
- **THEN** el sistema resuelve las referencias al catálogo y muestra los datos oficiales vigentes
