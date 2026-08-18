# CNC Producto Final Crea

## Purpose

Hace que la fase Crea (Semanas 4-5) del programa "Conecta, Nivela y Crea" declare un producto final explícito y actividades reales por semana, sugeridas por IA (fundamentadas en el diagnóstico de Semana 1) y editables por el docente, en modalidad General y Bachillerato Técnico, y que los documentos Word/PDF reflejen ese contenido en vez de etiquetas genéricas.

## Requirements

### Requirement: Crea phase declares an explicit product final (General)
The Crea phase (Semanas 4-5) of a General (EGB/BGU) plan SHALL declare an explicit product final for the interdisciplinary project. The product final SHALL be suggested by the IA when empty and SHALL be editable by the teacher.

#### Scenario: IA suggests a product final
- **WHEN** a teacher generates a plan without writing a product final
- **THEN** the generated plan includes a concrete product final (e.g., "Decálogo ilustrado de convivencia y seguridad integral") derived from the project title, integrated areas and diagnosed DCD

#### Scenario: Teacher edits the product final
- **WHEN** the teacher edits the product final of a plan
- **THEN** the edited text is kept and appears in the result view and in the generated documents

### Requirement: Weekly project activities (General)
The General project SHALL define two distinct lists of activities, one for Semana 4 and one for Semana 5. The IA SHALL propose both lists when empty, and the teacher SHALL be able to edit each list. The activities SHALL be derived from the diagnosed DCD of Semana 1, the reinforced DCD, the integrated areas, the product final and the project context.

#### Scenario: IA proposes weekly activities
- **WHEN** a teacher generates a plan without writing project activities
- **THEN** the plan includes a Semana 4 list (e.g., planificación, organización de equipos, investigación, elaboración, revisión) and a Semana 5 list (e.g., finalización, socialización, presentación, reflexión)

#### Scenario: Teacher edits weekly activities
- **WHEN** the teacher edits the Semana 4 or Semana 5 activity list
- **THEN** the edited activities are kept and appear in the result view and documents

### Requirement: BT product keeps its nature with weekly activities
For a Bachillerato Técnico plan, the acreditable product SHALL keep its type and description and SHALL also define distinct Semana 4 and Semana 5 activity lists, suggested by the IA when empty and editable by the teacher.

#### Scenario: BT weekly activities proposed and edited
- **WHEN** a teacher generates a BT plan and later edits the product's weekly activities
- **THEN** the plan includes Semana 4 and Semana 5 activity lists for the product, editable and reflected in the result view and documents

### Requirement: AI suggestions are grounded in the diagnosis
The IA SHALL derive the product final and the weekly activities from the DCD diagnosed in Semana 1, the DCD to be reinforced, the integrated areas, the product and the teacher-provided context. The IA SHALL NOT invent DCD codes, curricular criteria or technical criteria outside the provided catalogs.

#### Scenario: Suggestions tied to diagnosis
- **WHEN** the IA proposes the product final and weekly activities
- **THEN** each proposed activity and the product final are consistent with the diagnosed DCD of Semana 1 and the reinforced DCD

### Requirement: No overwrite of manual Crea content
When applying IA suggestions for the Crea phase, the system SHALL only fill the fields the teacher left empty. Any Crea field with teacher-provided content SHALL remain unchanged.

#### Scenario: Manual content preserved
- **WHEN** a teacher has written the product final and Semana 4 activities but left Semana 5 activities empty
- **THEN** the teacher's product final and Semana 4 activities remain exactly as written, and only the Semana 5 activities are filled from the IA suggestion

### Requirement: Generated documents include the Crea content
The Word and PDF documents SHALL include the product final and the Semana 4/5 activity lists from the plan. The hardcoded generic texts "Diseño y desarrollo del proyecto interdisciplinario" and "Presentación y socialización del proyecto interdisciplinario" SHALL be replaced by the real activity lists, or fall back to them only when the plan has no activities (e.g., plans created before this change).

#### Scenario: Document reflects real activities
- **WHEN** a teacher exports a generated plan to Word or PDF
- **THEN** the Semanas 4-5 section shows the product final and the actual Semana 4 and Semana 5 activities instead of the generic texts

#### Scenario: Fallback for legacy plans
- **WHEN** a plan created before this change (without stored activities) is exported
- **THEN** the document still renders the Semanas 4-5 section using the legacy generic texts, without errors

### Requirement: Result view shows the Crea content
After generation, the result view SHALL show the product final and the Semana 4/5 activity lists for both General and BT plans.

#### Scenario: Result shows product and activities
- **WHEN** a teacher generates a plan and views the result
- **THEN** the Crea section of the result shows the product final and the Semana 4 and Semana 5 activity lists
