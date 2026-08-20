## Purpose

Catálogo de figuras profesionales del Bachillerato Técnico conforme a la normativa MINEDUC vigente (Acuerdo 00065-A, sustituido por el 00051-A): jerarquía área → familia → figura, denominaciones y familias vigentes, y resolución segura de figuras históricas para no romper planes guardados.

## ADDED Requirements

### Requirement: Jerarquía de catálogo área → familia → figura
El sistema SHALL mantener el catálogo de Bachillerato Técnico organizado en 3 áreas, 11 familias profesionales y 34 figuras profesionales, donde cada figura pertenece a una única familia y cada familia a una única área.

#### Scenario: Navegación completa
- **WHEN** un docente navega el catálogo BT
- **THEN** puede recorrer las 3 áreas (deportes y salud, artística, técnica), sus 11 familias y las 34 figuras vigentes

#### Scenario: Consistencia de conteos
- **WHEN** el catálogo se carga
- **THEN** la suma de figuras por familia equivale a 34 y las familias por área equivalen a 11

### Requirement: Denominaciones vigentes según 00051-A
El sistema SHALL presentar las denominaciones vigentes del Acuerdo 00051-A para las figuras afectadas por la reforma: "Gestión financiera y contable", "Artes plásticas y gestión cultural", "Artes escénicas y gestión cultural", "Música y gestión cultural", "Instalaciones eléctricas y automatización" y "Mecánica industrial".

#### Scenario: Renombres aplicados
- **WHEN** un docente consulta la figura `gestion-financiera`
- **THEN** el sistema muestra "Gestión financiera y contable"

#### Scenario: Renombres de la familia Artes
- **WHEN** un docente consulta la figura `musica`
- **THEN** el sistema muestra "Música y gestión cultural"

### Requirement: Familia asignada según 00051-A
El sistema SHALL asignar a cada figura la familia vigente del Acuerdo 00051-A: `climatizacion`, `instalaciones-electricas` y `mecanica-industrial` pertenecen a la familia Industrial, y la familia Construcción sostenible SHALL contener únicamente la figura `obra-civil`.

#### Scenario: Climatización e Instalaciones eléctricas en Industrial
- **WHEN** un docente selecciona la familia Industrial
- **THEN** el sistema muestra, entre otras, "Climatización", "Instalaciones eléctricas y automatización" y "Mecánica industrial"

#### Scenario: Construcción sostenible reducida
- **WHEN** un docente selecciona la familia Construcción sostenible
- **THEN** el sistema muestra únicamente "Construcción de obra civil"

### Requirement: Figuras deprecadas no seleccionables en planes nuevos
El sistema SHALL marcar `construcciones-metalicas` como deprecada; la figura SHALL permanecer en el catálogo histórico pero NO SHALL ser seleccionable para planes nuevos.

#### Scenario: Bloqueo de selección
- **WHEN** un docente crea un plan nuevo y abre el selector de figuras
- **THEN** la figura `construcciones-metalicas` no aparece como opción seleccionable

### Requirement: Nueva figura Mecánica industrial
El sistema SHALL ofrecer `mecanica-industrial` ("Mecánica industrial") en la familia Industrial como figura activa y seleccionable para planes nuevos.

#### Scenario: Selección disponible
- **WHEN** un docente crea un plan nuevo y abre el selector de figuras en la familia Industrial
- **THEN** puede seleccionar "Mecánica industrial"

### Requirement: Resolución de figuras históricas en planes guardados
El sistema SHALL resolver planes guardados cuyo `figuraProfesionalId` corresponda a una figura deprecada, mostrando la información histórica de esa figura para mantener el plan reproducible.

#### Scenario: Plan histórico deprecado
- **WHEN** un plan guardado referencia `construcciones-metalicas`
- **THEN** el sistema resuelve la figura y muestra su denominación histórica "Estructuras y Construcciones Metálicas", sin romper el plan

#### Scenario: Equivalencia de reemplazo
- **WHEN** el sistema resuelve la figura `construcciones-metalicas`
- **THEN** la equivalencia de reemplazo apunta a `mecanica-industrial`

### Requirement: Familia Artes en área Artística
La familia `artes` SHALL pertenecer al área Artística.

#### Scenario: Corrección de área
- **WHEN** un docente navega el área Artística
- **THEN** el sistema muestra la familia Artes con sus figuras "Artes plásticas y gestión cultural", "Artes escénicas y gestión cultural" y "Música y gestión cultural"

### Requirement: Módulos de figuras deprecadas
El sistema SHALL conservar los módulos formativos de una figura deprecada para que los planes históricos sean reproducibles; la reutilización de esos módulos en la figura de reemplazo SHALL ser una decisión explícita de currículo, no una copia automática.

#### Scenario: Plan histórico reproducible
- **WHEN** un plan guardado referencia `construcciones-metalicas` y sus módulos
- **THEN** los módulos históricos (CM.1.1, CM.2.1, CM.3.1) permanecen asociados a la figura deprecada para reproducir el plan