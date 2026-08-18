## Purpose

Integra la Evaluación Diagnóstica como paso formal del wizard "Conecta, Nivela y Crea": el docente vincula evaluaciones LL/M existentes (o crea nuevas) e importa sus brechas por DCD al diagnóstico académico de la Semana 1, sin sobrescribir contenido manual y manteniendo la lista de evaluaciones solo para consulta y documentos.

## ADDED Requirements

### Requirement: Wizard includes a formal Diagnostic step
The CNC wizard SHALL include a "Diagnóstico" step positioned as the last data-entry step, right before the Resultado step. The wizard SHALL present its steps in the order Identificación, Semana 1 (Conecta), Semanas 2-3 (Nivela), Semanas 4-5 (Crea), Diagnóstico, Resultado, so that the destrezas chosen in the previous weeks are already available when creating or linking the diagnostic evaluation.

#### Scenario: Navigating the wizard
- **WHEN** a teacher opens the CNC planifier
- **THEN** the step indicator shows six steps with "Diagnóstico" as the fifth step, after Semanas 4-5 and before Resultado

#### Scenario: Advancing without linking
- **WHEN** a teacher reaches the Diagnóstico step and does not link any evaluation
- **THEN** the teacher can still advance, and Semana 1 remains editable for manual entry of the academic diagnosis

### Requirement: Selector shows only CNC-applicable evaluations
The Diagnóstico step SHALL offer only evaluations whose area is Lengua y Literatura or Matemática for linking. Evaluations of other areas SHALL NOT appear in the selector, and SHALL remain available in Mis Planes.

#### Scenario: Filtering the selector
- **WHEN** a teacher opens the Diagnóstico step while evaluations of LL, M and CN exist
- **THEN** only the LL and M evaluations appear in the link selector

### Requirement: Evaluation preview before linking
Before linking, the Diagnóstico step SHALL show for the selected evaluation its area, the number of evaluated students, and the breakdown of brechas per DCD (dominadas, en proceso, requieren refuerzo). The teacher SHALL confirm the link explicitly.

#### Scenario: Preview and confirm
- **WHEN** a teacher selects an evaluation in the Diagnóstico step
- **THEN** the system shows its area, applied student count and the 🟢/🟡/🔴 brecha counts together with a "Vincular a Semana 1" action

### Requirement: Linking imports brechas into Semana 1
Linking SHALL import one academic diagnostic entry per brecha DCD into the plan's Semana 1 academic diagnosis. Each entry SHALL carry the area (LL or M), the destreza code and description, an observación recording provenance (% de dominio and students in refuerzo), and `nivelDetectado` mapped from the dominant state: dominado → `logrado`, en proceso → `en_proceso`, requiere refuerzo → `iniciado`.

#### Scenario: Importing an evaluated evaluation
- **WHEN** a teacher links an LL evaluation with 2 DCD dominadas, 1 en proceso and 1 requiere refuerzo
- **THEN** Semana 1 contains four academic diagnostic entries with their codes and `nivelDetectado` values logrado, logrado, en_proceso and iniciado respectively

#### Scenario: Non-evaluated evaluation
- **WHEN** a teacher selects an evaluation with no evaluated students
- **THEN** the system does not offer linking and shows a hint that the evaluation must be applied before it can be linked

### Requirement: No silent overwrite of manual diagnosis
If the plan's Semana 1 already contains an academic diagnosis (LL/M), linking an evaluation SHALL require explicit confirmation before replacing it. If the teacher cancels, the existing diagnosis SHALL remain unchanged.

#### Scenario: Replacing with confirmation
- **WHEN** a teacher links an evaluation while Semana 1 already has academic diagnosis entries
- **THEN** the system asks for confirmation stating that the existing diagnosis will be replaced with the selected evaluation's brechas

#### Scenario: Cancel keeps content
- **WHEN** the teacher cancels the confirmation
- **THEN** the Semana 1 academic diagnosis remains exactly as before

### Requirement: Create evaluation from the step
The Diagnóstico step SHALL offer a way to create a new diagnostic evaluation from within the CNC flow. After creating it and returning to the wizard, the teacher SHALL be able to link it like any existing evaluation.

#### Scenario: Create and link
- **WHEN** a teacher chooses to create a new evaluation from the Diagnóstico step and returns to the wizard
- **THEN** the new evaluation appears in the selector and can be linked with the same confirmation rules

### Requirement: Session memory of the linked evaluation
The wizard SHALL remember the evaluation linked during the current session so the teacher can see and change the link. Changing the link to a different evaluation SHALL apply the confirmation rule for existing diagnosis again.

#### Scenario: Re-linking
- **WHEN** a teacher links evaluation A and later changes the link to evaluation B
- **THEN** the system shows the current linked evaluation and applies the confirmation rule before replacing A's imported entries

### Requirement: Mis Planes keeps only the evaluation list
In "Mis Planes", the Evaluación Diagnóstica creation button SHALL be removed. The list of existing evaluations SHALL remain accessible for viewing details, results and documents.

#### Scenario: List remains without create button
- **WHEN** a teacher opens Mis Planes
- **THEN** no "Crear Evaluación Diagnóstica" button is shown, and the EVALUACIONES DIAGNÓSTICAS list remains with entries that open the evaluation detail view

### Requirement: Evaluation detail keeps CNC export
The evaluation detail view SHALL keep its "→ CNC" action that creates a CNC plan from the evaluation's brechas.

#### Scenario: Export from detail
- **WHEN** a teacher opens the detail of an evaluated LL/M evaluation
- **THEN** the "→ CNC" action is available and creates a plan whose Semana 1 imports the evaluation's brechas