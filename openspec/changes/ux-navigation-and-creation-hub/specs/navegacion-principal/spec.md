## Purpose

Define la navegación única de PlanificaDoc: una estructura lateral persistente en escritorio y con drawer en móvil que agrupa las funciones por intención (Inicio, Crear, Explorar, Mis planes / Mi cuenta, Ayuda) en lugar de exponer los 12 módulos de creación, y que mantiene visible la identidad de marca en todo momento.

## ADDED Requirements

### Requirement: Sidebar persistente en escritorio
El sistema SHALL mostrar una navegación lateral izquierda persistente cuando el ancho de viewport corresponda a escritorio o tablet, conteniendo dos zonas funcionales: **principal** (Inicio, Crear, Explorar, Mis planes) y **gestión** (Mi cuenta, Ayuda).

#### Scenario: Escritorio con sidebar visible
- **WHEN** la app se renderiza en un viewport de escritorio (ancho ≥ el ancho mínimo del sidebar)
- **THEN** el sidebar izquierdo se muestra junto al contenido, con las cuatro entradas de la zona principal y las dos de la zona de gestión

#### Scenario: Los módulos de creación no aparecen en el sidebar
- **WHEN** el sidebar está renderizado
- **THEN** ninguno de los módulos individuales (PCA, PCT, semanal, CNC, Proyecto interdisciplinar, BT, Inicial, Preparatoria, Currículo por Competencias, plan diario, adaptación, diagnóstico) aparece como ítem del sidebar

### Requirement: Sidebar colapsable
El sistema SHALL permitir colapsar el sidebar a una variante de ancho reducido (~64px) que conserve solo los iconos, y SHALL conservar el estado elegido durante la sesión.

#### Scenario: Colapso y expansión
- **WHEN** el usuario activa el control de colapso
- **THEN** el sidebar muestra solo iconos y el área de trabajo gana el ancho liberado, pudiendo expandirse de vuelta con la misma acción

### Requirement: Acción Crear destacada
El sistema SHALL presentar "Crear" como la acción principal de la navegación, con tratamiento visual diferenciado del resto de ítems, y SHALL llevar a la pantalla de creación (`/crear`).

#### Scenario: Selección de Crear
- **WHEN** el usuario pulsa "Crear" en el sidebar
- **THEN** se navega al hub de creación y "Crear" queda marcado como sección activa

### Requirement: Navegación en móvil mediante header y drawer
En viewports móviles el sistema SHALL **no** mostrar la barra de pestañas inferior actual, y SHALL mostrar un encabezado con botón de menú (`☰`) que abre un cajón lateral con los mismos ítems y zonas que el sidebar.

#### Scenario: Apertura del drawer
- **WHEN** el usuario pulsa `☰` en el encabezado móvil
- **THEN** se abre un cajón lateral con la zona principal y la zona de gestión

#### Scenario: Cierre tras navegar
- **WHEN** el usuario selecciona un ítem dentro del drawer
- **THEN** el drawer se cierra y se muestra la sección elegida

### Requirement: Presencia de marca en la navegación
La navegación SHALL mostrar el nombre de marca "PlanificaDoc Ecuador" en su zona inferior y SHALL usar el azul de marca `#003366` para el ítem activo o enfocado; los colores curriculares no se usan en la navegación.

#### Scenario: Ítem activo
- **WHEN** el usuario está en una sección de la zona principal
- **THEN** ese ítem se resalta con el azul de marca y los demás se muestran en gris neutro

### Requirement: Sección de Ayuda disponible
El sistema SHALL exponer una ruta de Ayuda accesible desde la navegación. El ítem de Ayuda SHALL existir tanto en el sidebar como en el drawer móvil.

#### Scenario: Acceso a Ayuda
- **WHEN** el usuario pulsa "Ayuda" desde cualquier sección
- **THEN** se abre la pantalla de Ayuda sin perder el contexto de navegación

### Requirement: Cobertura de secciones
Toda pantalla principal (Inicio, Explorar, Mis planes, Mi cuenta, Ayuda, hub de creación) SHALL ser alcanzable desde la navegación en ambas plataformas, y la navegación SHALL reflejar la sección actual.

#### Scenario: Navegación desde cualquier pantalla
- **WHEN** el usuario está en una pantalla profunda (por ejemplo el detalle de una destreza o un formulario)
- **THEN** la navegación sigue disponible y marca la sección de origen
