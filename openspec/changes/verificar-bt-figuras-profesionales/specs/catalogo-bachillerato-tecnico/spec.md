## ADDED Requirements

### Requirement: Módulos formativos oficiales por figura
Para cada figura profesional con PDF oficial de "Módulos formativos", el sistema SHALL ofrecer exactamente los módulos de ese documento (genéricos, de especialización y práctico experimental), con su nombre, categoría, nivel, duración en periodos pedagógicos y objetivo del módulo tal como figuran en la fuente.

#### Scenario: Módulos de Desarrollo de Software
- **WHEN** un docente abre la figura `desarrollo-software` para planificar
- **THEN** el selector de módulos muestra los módulos del PDF "Módulos formativos de la FIP Desarrollo de Software", entre ellos "Fundamentos de las Tecnologías de la Información y la Comunicación" (genérico, 1ro y 2do, 200 periodos)

#### Scenario: Objetivo general de la figura
- **WHEN** un docente consulta una figura con PDF oficial
- **THEN** el objetivo general mostrado coincide con el apartado "1. Objetivo general" del PDF

### Requirement: Resultados de aprendizaje y criterios de evaluación transcritos
Cada módulo marcado como completo SHALL tener al menos un Resultado de Aprendizaje (RA), y cada RA al menos un Criterio de Evaluación (CE). Los RA y CE conservan la numeración y el texto de la fuente oficial.

#### Scenario: RA con sus CE
- **WHEN** un docente selecciona un módulo completo para una unidad de trabajo
- **THEN** puede elegir entre los RA del módulo, y cada RA muestra sus CE con la numeración oficial (p. ej. "RA 1" con "CE1.1", "CE1.2")

#### Scenario: Integridad del catálogo
- **WHEN** se valida el catálogo BT
- **THEN** ningún módulo con estado completo carece de RA, ningún RA carece de CE y ningún identificador de RA/CE se repite dentro de su módulo

### Requirement: Unidad de competencia asociada al módulo
El sistema SHALL asociar a cada módulo oficial la Unidad de Competencia (UC) declarada en su PDF, con su texto oficial.

#### Scenario: UC visible en el módulo
- **WHEN** un docente consulta un módulo oficial
- **THEN** el sistema muestra la UC asociada (p. ej. "UC1: Aplicar fundamentos de tecnologías de la información…")

### Requirement: Sin contenido curricular sin fuente
El sistema NO SHALL presentar como oficial contenido curricular de BT que no esté respaldado por un documento del MINEDUC. Una figura o módulo sin fuente SHALL mostrarse como pendiente de catálogo.

#### Scenario: Figura sin PDF de módulos
- **WHEN** un docente abre una figura cuyo PDF oficial de módulos no está disponible (p. ej. `gestion-deportiva`)
- **THEN** sus módulos aparecen como pendientes de catálogo y el sistema no ofrece RA/CE inventados

### Requirement: Resolución de módulos históricos en planes guardados
Los códigos de módulo que existían antes de la verificación SHALL seguir resolviéndose para los planes guardados (BT y Conecta Nivela Crea), con su nombre histórico. No SHALL ofrecerse para planes nuevos.

#### Scenario: Plan guardado con módulo reemplazado
- **WHEN** un docente abre un plan guardado que referencia el módulo `DS.1.1`
- **THEN** el plan se muestra y se exporta con el nombre histórico del módulo, sin errores

#### Scenario: Módulo histórico no seleccionable
- **WHEN** un docente crea un plan nuevo para `desarrollo-software`
- **THEN** el selector de módulos ofrece solo los módulos oficiales, no `DS.1.1`
