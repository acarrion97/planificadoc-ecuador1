## Purpose

Calibra curricularmente la Semana 1 ("Conecta") del wizard CNC, exige una metodología pedagógica declarada, aplica DUA como principio obligatorio, y exige fusión interdisciplinaria real (no listas paralelas por área) en el proyecto de Semanas 4-5 ("Crea") cuando se soliciten áreas integradas.

## ADDED Requirements

### Requirement: Semana 1 declares an explicit methodology
When generating suggestions for Semana 1 (Conecta), the AI SHALL declare an explicit pedagogical strategy/methodology coherent with the activities proposed (e.g. aprendizaje basado en juegos, aprendizaje colaborativo, aprendizaje basado en proyectos), instead of returning isolated activities with no stated methodological frame. The system SHALL NOT force a single fixed methodology (e.g. it SHALL NOT hardcode "ERCA" or "método fonológico" as mandatory) — the teacher retains professional autonomy to edit or replace the AI's suggestion.

#### Scenario: Generating Semana 1 for the first time
- **WHEN** a teacher requests AI suggestions for Semana 1 with no prior manual content
- **THEN** the response includes a declared methodology field describing the pedagogical approach behind the suggested adaptation activities

#### Scenario: Teacher already wrote a methodology
- **WHEN** the teacher has already filled the methodology field manually
- **THEN** the AI does not overwrite it — the existing rule "la IA solo completa campos vacíos" applies to this field too

### Requirement: Semana 1 diagnostic and instrument are calibrated to the real curricular level
The system SHALL translate the plan's grado/subnivel/modalidad into concrete curricular expectations before asking the AI to propose diagnostic activities or evaluation instruments for Semana 1, instead of passing the raw grade string with no interpretation. The calibration rule SHALL be context-dependent:
- Básica Elemental/Media/Superior and Bachillerato General: calibrate by grado + subnivel + the destrezas (DCD) already diagnosed.
- Bachillerato Técnico (`modalidad === "bt"`): calibrate by curso + Figura Profesional/módulo real, not by an age heuristic (BT students are not children, and CNC's BT extras already anchor to the module's real criteria).

#### Scenario: Suggesting an instrument for Básica Elemental
- **WHEN** a teacher requests AI suggestions for a plan whose grado resolves to Básica Elemental (subnivel 2)
- **THEN** the suggested diagnostic technique/instrument is appropriate for that subnivel (e.g. observación, lectura de imágenes, identificación de elementos explícitos) rather than a generic text-heavy instrument used for older students

#### Scenario: Suggesting an instrument for Bachillerato Técnico
- **WHEN** a teacher requests AI suggestions for a plan with `modalidad === "bt"`
- **THEN** the calibration is driven by the Figura Profesional/módulo context already built by `contextoBT`, not by any age-based rule

### Requirement: DUA is a mandatory principle in Semana 1 activities and instruments
For each Semana 1 adaptation activity and for the suggested evaluation instrument(s), the AI SHALL indicate which DUA principles (Representación, Acción y Expresión, Implicación) they cover, following the same `{I, R, A}`-per-item pattern already used in `server/topics-router.ts`. The system SHALL normalize the AI's response so that, across the set of Semana 1 activities, all 3 DUA principles end up covered at least once — DUA SHALL NOT be treated as an optional or best-effort addition.

#### Scenario: AI omits a DUA principle
- **WHEN** the AI's raw response for Semana 1 activities does not cover one of the 3 DUA principles across any activity
- **THEN** the system forces that missing principle onto at least one activity (same normalization strategy already implemented for class-plan generation) before returning the result

#### Scenario: Rendering DUA in the generated document
- **WHEN** a CNC plan with Semana 1 DUA data is exported to Word or PDF
- **THEN** the document shows the DUA indicators per activity using the same visual convention (colored squares per principle) already used by `plan-word-generator.ts` and `semanal-word-generator.ts`

### Requirement: Visual supports are suggested contextually, not imposed uniformly
The AI MAY suggest visual supports (pictogramas, imágenes, organizadores gráficos, ejemplos) for Semana 1 activities or instruments when the destreza being diagnosed or the student profile indicates they would reduce access barriers (DUA principle of Representación). The system SHALL NOT require every Semana 1 instrument to include pictograms unconditionally.

#### Scenario: Literacy-related destreza in Básica Elemental
- **WHEN** the diagnosed destreza relates to lectura/lectoescritura for a plan in Básica Elemental
- **THEN** the AI's suggested instrument may reference visual/pictographic supports as part of its DUA "Representación" strategy

#### Scenario: Destreza with no visual-support need
- **WHEN** the diagnosed destreza does not benefit from visual supports (e.g. an oral production destreza where the barrier is not representational)
- **THEN** the AI is not required to insert pictograms and may propose a different DUA "Representación" strategy instead

### Requirement: Semanas 4-5 project has authentic cross-area articulation, not parallel tracks
When `areasIntegradas` lists more than one area, the AI SHALL design the project so that, taken as a whole, the `titulo`/`descripcion`/`objetivoAprendizaje`/`productoFinal` articulate a single shared experience, product, problem, or context that draws on destrezas from every listed area — not a project whose title/description/product reads as one area's task with the other area merely appended. This does NOT require every individual activity in `actividadesSemana4`/`actividadesSemana5` to exercise all listed areas at once; a plan may still contain area-specific activities as long as they visibly feed into the same shared product/objective. The AI SHALL only produce fully area-siloed tracks (separate title/product per area) if the teacher explicitly requests independent tracks per area. This requirement applies identically whether the project is generated as part of the full plan (`generate`) or via the dedicated Crea-only regeneration endpoint (`sugerirProyecto`).

#### Scenario: Two areas integrated (LL + M)
- **WHEN** `areasIntegradas` is `["LL", "M"]` and the teacher has not requested independent tracks
- **THEN** the suggested `productoFinal` and `objetivoAprendizaje` describe a single product/goal that meaningfully involves both areas, and at least some activities in `actividadesSemana4`/`actividadesSemana5` combine destrezas from both areas rather than every activity being exclusively one area or the other

#### Scenario: Regenerating only the Crea step
- **WHEN** a teacher uses the dedicated "sugerir proyecto" action to regenerate just Semanas 4-5 with `areasIntegradas.length > 1`
- **THEN** the same cross-area articulation requirement applies as when the project is generated from the full plan

#### Scenario: Single area
- **WHEN** `areasIntegradas` lists only one area
- **THEN** this requirement does not apply — the project is designed around that single area as before
