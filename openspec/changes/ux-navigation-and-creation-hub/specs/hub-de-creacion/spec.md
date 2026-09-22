## Purpose

Unificar los 12 flujos de creación de planificaciones en un único punto de entrada (`/crear`) que los presente agrupados por categoría y con un lenguaje visual de marca, de modo que los módulos sean descubribles, escalables y coherentes con la identidad de PlanificaDoc.

## ADDED Requirements

### Requirement: Punto único de entrada a la creación
El sistema SHALL exponer la ruta `/crear` como entrada única y principal a todos los flujos de creación, accesible desde la navegación ("Crear") y desde el CTA del Inicio.

#### Scenario: Acceso desde el sidebar
- **WHEN** el usuario pulsa "Crear" en la navegación
- **THEN** se abre el catálogo de creación

#### Scenario: Acceso desde el Inicio
- **WHEN** el usuario pulsa el botón "＋ Nueva planificación" del Inicio
- **THEN** se abre el mismo catálogo de creación

### Requirement: Catálogo agrupado por categoría
El catálogo SHALL agrupar los módulos en categorías: **Plan de aula** (plan diario, plan semanal), **Plan de área** (PCA Anual, PCT Trimestral), **Programaciones** (Conecta Nivela y Crea, Proyecto Interdisciplinar, Bachillerato Técnico), **Currículo** (Currículo por Competencias), **Niveles educativos** (Inicial, Preparatoria) y **Contextuales** (Adaptación curricular, Evaluación diagnóstica).

#### Scenario: Visualización completa del catálogo
- **WHEN** el usuario abre `/crear`
- **THEN** ve todas las categorías con sus módulos, sin necesidad de navegación adicional entre niveles

#### Scenario: Módulo nuevo en una categoría
- **WHEN** se agrega un nuevo módulo de creación a una categoría
- **THEN** aparece en `/crear` sin que el Inicio ni Mis planes requieran cambios

### Requirement: Módulos contextuales informan su requisito
El sistema SHALL mostrar los módulos que requieren contexto previo (Adaptación curricular) como no disponibles, con la razón visible, cuando no existe el contexto necesario; y SHALL habilitarlos cuando el usuario llega con ese contexto.

#### Scenario: Adaptación sin contexto
- **WHEN** el usuario abre `/crear` sin haber seleccionado una planificación semanal o plan de origen
- **THEN** "Adaptación curricular" aparece indicando que requiere un contexto previo y no inicia el flujo

#### Scenario: Adaptación con contexto
- **WHEN** el usuario llega desde el detalle de una planificación semanal o de un plan
- **THEN** el módulo está habilitado y arranca con ese contexto precargado

#### Scenario: Diagnóstico independiente
- **WHEN** el usuario elige "Evaluación diagnóstica" desde el catálogo sin origen
- **THEN** el flujo se inicia de forma autónoma, con los campos de contexto por completar

### Requirement: Lenguaje cromático único en el catálogo
Todas las tarjetas del catálogo SHALL usar el mismo lenguaje visual: azul de marca `#003366`, blanco y gris. Los colores curriculares no se usarán para distinguir módulos.

#### Scenario: Coherencia cromática
- **WHEN** se renderiza `/crear`
- **THEN** no hay tarjetas en colores de módulo (cian, violeta, turquesa, verde azulado) y todas comparten la paleta de marca

### Requirement: La selección conserva el comportamiento de los wizards existentes
Al elegir un módulo, el sistema SHALL navegar al flujo existente sin exigirle parámetros que ya no soporta y sin alterar su comportamiento interno.

#### Scenario: Llegada al wizard
- **WHEN** el usuario elige "PCA Anual" en el catálogo
- **THEN** se abre el formulario de PCA existente en su estado inicial, tal como funcionaba desde sus entradas anteriores

#### Scenario: Entradas previas siguen funcionando
- **WHEN** un usuario llega por enlaces o flujos antiguos (por ejemplo la búsqueda de destreza hacia el plan diario)
- **THEN** ese flujo continúa operando igual que antes
