## Purpose

Convertir "Mis planes" en una pantalla exclusivamente de gestión del trabajo existente: listar, filtrar y operar sobre los planes guardados, sin botones ni rutas de creación.

## ADDED Requirements

### Requirement: Mis planes no ofrece creación
"Mis planes" SHALL **no** contener botones ni accesos a flujos de creación; toda creación se realiza desde el hub `/crear`.

#### Scenario: Ausencia de botones de creación
- **WHEN** el usuario abre "Mis planes"
- **THEN** no encuentra accesos a PCA, PCT, semanal, Currículo por Competencias, Proyecto Interdisciplinar, CNC, BT, Inicial, Preparatoria ni diagnóstico

#### Scenario: Crear desde cualquier punto
- **WHEN** el usuario quiere crear un plan estando en "Mis planes"
- **THEN** usa el ítem "Crear" de la navegación y llega al catálogo

### Requirement: Listado unificado de planes de todos los tipos
"Mis planes" SHALL listar los planes de todos los tipos existentes (plan diario, semanal, PCA, PCT, CNC, Bachillerato Técnico, Currículo por Competencias, Proyecto Interdisciplinar, evaluaciones diagnósticas) con su tipo, identificación y fecha de actualización.

#### Scenario: Presencia de cada tipo
- **WHEN** el usuario tiene planes de tipos distintos guardados
- **THEN** todos aparecen en la lista, identificable cada uno por su tipo

#### Scenario: Lista vacía
- **WHEN** el usuario no tiene ningún plan
- **THEN** ve un estado vacío que lo invita a crear desde el hub

### Requirement: Filtros derivados del estado existente
"Mis planes" SHALL ofrecer los filtros **Todos** y **Recientes** para cualquier tipo de plan, y **En progreso** y **Completados** únicamente para los tipos que poseen estado propio; los tipos sin estado (plan diario y planificación semanal) NO se representarán con estados que no poseen.

#### Scenario: Tipo con estado (PCA, CNC, Proyecto, Currículo, Evaluación)
- **WHEN** el usuario aplica "En progreso" o "Completados"
- **THEN** la lista muestra solo los planes cuyo estado existente corresponde a esa categoría

#### Scenario: Tipo sin estado (plan diario, semanal)
- **WHEN** el usuario aplica "En progreso" o "Completados"
- **THEN** los planes diarios y semanales no aparecen en esos filtros, y siguen apareciendo en "Todos" y "Recientes"

### Requirement: Acciones de gestión por plan
Para cada plan la sistema SHALL ofrecer **Continuar** (abrir para ver o seguir editando), **Eliminar** con confirmación y **Duplicar**; **Editar** SHALL estar disponible solo para los tipos cuyo flujo admite reanudación.

#### Scenario: Continuar un plan
- **WHEN** el usuario pulsa Continuar en un plan
- **THEN** llega al detalle o formulario de ese plan conservando su información

#### Scenario: Eliminar con confirmación
- **WHEN** el usuario pulsa Eliminar
- **THEN** se pide confirmación y, de aceptarse, el plan desaparece de la lista

#### Scenario: Editar solo donde aplica
- **WHEN** un tipo de plan no admite reanudación
- **THEN** no se muestra la acción Editar para ese plan

### Requirement: Duplicar crea una copia independiente
El sistema SHALL permitir duplicar un plan: la copia SHALL recibir un identificador nuevo, conservar el contenido del original, aparecer en la lista y dejar el original intacto.

#### Scenario: Duplicación exitosa
- **WHEN** el usuario duplica un plan
- **THEN** aparece una copia nueva en la lista, el original sigue existiendo sin cambios y ambos son editables de forma independiente

#### Scenario: La copia no comparte identidad con el original
- **WHEN** se eliminan la copia o el original
- **THEN** el otro permanece en la lista
