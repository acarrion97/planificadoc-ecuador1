## MODIFIED Requirements

### Requirement: Jerarquía de catálogo área → familia → figura
El sistema SHALL mantener el catálogo de Bachillerato Técnico organizado en áreas, familias profesionales y figuras profesionales, donde cada figura pertenece a una única familia y cada familia a una única área. Cada figura profesional SHALL estar asociada a uno o más módulos formativos del catálogo curricular vigente (Acuerdo 00065-A).

#### Scenario: Navegación completa
- **WHEN** un docente navega el catálogo BT
- **THEN** puede recorrer las áreas, familias y figuras vigentes

#### Scenario: Figura con módulos
- **WHEN** un docente selecciona una figura profesional
- **THEN** el sistema muestra los módulos formativos asociados a esa figura

#### Scenario: Consistencia de conteos
- **WHEN** el catálogo se carga
- **THEN** la suma de figuras por familia equivale al total de figuras vigentes y las familias por área son consistentes

### Requirement: Módulos de figuras deprecadas
El sistema SHALL conservar los módulos formativos de una figura deprecada para que los planes históricos sean reproducibles; la reutilización de esos módulos en la figura de reemplazo SHALL ser una decisión explícita de currículo, no una copia automática. Los módulos deprecados SHALL mantener sus contenidos, RA y CE históricos intactos.

#### Scenario: Plan histórico reproducible
- **WHEN** un plan guardado referencia una figura deprecada y sus módulos
- **THEN** los módulos históricos permanecen asociados a la figura deprecada para reproducir el plan

#### Scenario: Módulos no migrados automáticamente
- **WHEN** se crea una nueva figura que reemplaza a una deprecada
- **THEN** los módulos de la figura deprecada NO se copian automáticamente a la nueva figura
