## Purpose

Define cómo los documentos exportados (Word/PDF) de las planificaciones microcurricular, PCA, PCA trimestral y adaptación curricular incrustan los íconos DCD (competencias e inserciones curriculares) junto a las destrezas, de forma consistente con la Planificación Semanal.

## ADDED Requirements

### Requirement: Exportación incrusta íconos DCD junto a las destrezas

Todos los documentos exportados en Word y PDF de las planificaciones Microcurricular, PCA y PCA trimestral SHALL incrustar los íconos DCD (competencias e inserciones curriculares) asociados a cada código de destreza, junto al código, de forma consistente con la Planificación Semanal. El documento Word de Adaptación Curricular SHALL incrustar los mismos íconos junto al código de la destreza original.

#### Scenario: Microcurricular Word y PDF muestran los íconos de la destreza
- **WHEN** se exporta una Planificación Microcurricular a Word o PDF y el código de la destreza (`plan.destreza.codigo`) tiene íconos asociados en el mapeo DCD
- **THEN** el documento muestra los íconos de competencias/inserciones correspondientes junto al código en la columna "DESTREZAS CON CRITERIOS DE DESEMPEÑO"

#### Scenario: PCA Word y PDF muestran los íconos de cada DCD
- **WHEN** se exporta un PCA (o PCA Trimestral) a Word o PDF y una unidad tiene destrezas con códigos DCD asociados a íconos
- **THEN** cada código DCD en la columna "Destrezas" muestra sus íconos de competencias/inserciones junto al código

#### Scenario: Adaptación curricular Word muestra los íconos de la destreza
- **WHEN** se exporta una Adaptación Curricular a Word y el código de la destreza original tiene íconos asociados
- **THEN** el documento muestra los íconos de competencias/inserciones junto al código de la destreza original

#### Scenario: Destreza sin íconos asociados no altera el documento
- **WHEN** el código de destreza no tiene íconos asociados en el mapeo DCD
- **THEN** el documento se genera sin íconos y sin cambios en el resto del contenido

### Requirement: Los íconos se derivan del código DCD oficial

La selección de íconos SHALL basarse únicamente en el código de destreza (DCD) mediante el mapeo existente `iconosPorDestreza.json`, el mismo mecanismo que usa la Planificación Semanal. No se SHALL solicitar selección manual de íconos al exportar.

#### Scenario: Coherencia con la Planificación Semanal
- **WHEN** un mismo código de destreza se exporta en Planificación Semanal, Microcurricular, PCA o Adaptación
- **THEN** los documentos muestran el mismo conjunto de íconos de competencias/inserciones para ese código

#### Scenario: Planificación Inicial no incluye íconos
- **WHEN** se exporta una Planificación Inicial
- **THEN** no se incrustan íconos DCD, ya que sus códigos no existen en el mapeo `iconosPorDestreza.json`