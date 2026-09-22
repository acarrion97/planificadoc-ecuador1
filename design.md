# PlanificaDoc Ecuador — Diseño de Interfaz

## Concepto General

Aplicación móvil para docentes ecuatorianos que permite generar planificaciones microcurriculares de forma rápida ingresando el código de la destreza con criterio de desempeño (DCD) del PCA. La app contiene una base de datos local completa de destrezas del currículo nacional ecuatoriano.

## Paleta de Colores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| primary | #1B5E9E | #4DA3E8 | Azul institucional (similar al Ministerio de Educación) |
| brand | #003366 | #003366 | Marca y navegación: ítem activo del sidebar/drawer, hub `/crear` |
| background | #F8FAFC | #0F172A | Fondo principal |
| surface | #FFFFFF | #1E293B | Tarjetas y superficies elevadas |
| foreground | #0F172A | #F1F5F9 | Texto principal |
| muted | #64748B | #94A3B8 | Texto secundario |
| border | #E2E8F0 | #334155 | Bordes y divisores |
| success | #16A34A | #4ADE80 | Estados exitosos |
| warning | #D97706 | #FBBF24 | Advertencias |
| error | #DC2626 | #F87171 | Errores |

## Lista de Pantallas

### 1. Pantalla de Inicio (Home)
Pantalla principal con campo de búsqueda prominente para ingresar el código de destreza. Muestra accesos rápidos a planificaciones recientes guardadas y un resumen de las áreas disponibles.

### 2. Pantalla de Búsqueda / Resultados
Muestra los resultados al buscar un código de destreza. Permite filtrar por área, subnivel y bloque curricular. Lista las destrezas encontradas en tarjetas informativas.

### 3. Pantalla de Detalle de Destreza
Muestra toda la información de una destreza seleccionada: código, descripción completa, área, subnivel, bloque curricular, objetivos relacionados, criterios de evaluación e indicadores.

### 4. Pantalla de Planificación (Generador)
Formulario para generar la planificación microcurricular. Campos pre-llenados con la información de la destreza. El docente completa: datos institucionales, número de periodos, fecha, actividades, recursos y evaluación.

### 5. Pantalla de Mis Planificaciones
Lista de planificaciones guardadas localmente. Permite ver, editar o eliminar planificaciones anteriores.

## Contenido y Funcionalidad por Pantalla

### Home
- Campo de búsqueda grande con placeholder "Ingrese código de destreza (ej: M.2.1.1)"
- Tarjetas de acceso rápido por área: Matemática, Lengua y Literatura, Ciencias Naturales, Estudios Sociales, Educación Física, Educación Cultural y Artística
- Sección "Planificaciones recientes" con las últimas 5 planificaciones guardadas
- Indicador del total de destrezas disponibles en la base de datos

### Búsqueda / Resultados
- Barra de búsqueda fija en la parte superior
- Filtros por: Área, Subnivel, Bloque
- Lista de resultados con tarjetas que muestran: código, descripción resumida, área (con color distintivo)
- Estado vacío con ilustración cuando no hay resultados

### Detalle de Destreza
- Encabezado con código grande y badge del área
- Descripción completa de la destreza
- Sección de información: Área, Subnivel, Bloque curricular
- Objetivos del subnivel relacionados
- Criterios de evaluación asociados
- Indicadores de evaluación
- Botón principal "Generar Planificación"

### Generador de Planificación
- Formulario con secciones colapsables:
  - Datos Informativos (institución, docente, grado, fecha, periodos)
  - Destreza seleccionada (pre-llenada, solo lectura)
  - Objetivos de aprendizaje (pre-llenados desde la destreza)
  - Actividades de aprendizaje (campo editable con sugerencias)
  - Recursos didácticos (campo editable con sugerencias)
  - Indicadores de evaluación (pre-llenados)
  - Técnicas e instrumentos de evaluación
- Botón "Guardar Planificación"

### Mis Planificaciones
- Lista de planificaciones guardadas con fecha, área y destreza
- Swipe para eliminar
- Tap para ver/editar
- Filtro por área

## Flujos de Usuario Principales

### Flujo 1: Búsqueda por código
1. Usuario abre la app → ve la pantalla Home
2. Ingresa código de destreza (ej: "M.3.1.1") en el campo de búsqueda
3. Se muestran los resultados coincidentes
4. Toca una destreza → ve el Detalle
5. Toca "Generar Planificación" → abre el Generador
6. Completa los campos editables → Guarda

### Flujo 2: Navegación por área
1. Usuario toca una tarjeta de área en Home (ej: "Matemática")
2. Ve todas las destrezas de esa área organizadas por subnivel
3. Selecciona una destreza → Detalle → Generar Planificación

### Flujo 3: Revisar planificaciones
1. Usuario entra en **Mis planes** desde la navegación lateral (sidebar; `☰` + drawer en móvil)
2. Ve el listado unificado con los filtros (Todos, Recientes, En progreso, Completados)
3. Continúa, edita, duplica o elimina la planificación elegida

## Navegación

**Sidebar / drawer** — ya no existe tab bar (cambio `ux-navigation-and-creation-hub`):

| Breakpoint | Presentación |
|---|---|
| ≥1024 px | Sidebar expandido (240 px), colapso manual persistente durante la sesión |
| 768–1023 px | Sidebar colapsado (64 px), solo iconos |
| <768 px | Header con `☰` + drawer lateral (280 px) |

Zonas de la navegación:

- **Principal:** **Inicio**, **Crear** (destacado), **Explorar**, **Mis planes**
- **Gestión:** Mi cuenta, Ayuda
- **Pie:** ítem de marca "PlanificaDoc Ecuador"

Paleta de navegación: fondo `surface`, texto e iconos `muted`, ítem activo en
`brand` (`#003366`) con texto blanco; ítems inactivos en gris neutro. El área
de trabajo se limita a **1080 px** de ancho máximo y se centra junto al sidebar
(riesgo R4).

> **Divergencia:** este documento describía antes una tab bar inferior con 3
> pestañas (Inicio, Explorar, Mis Planes). Desde el cambio
> `ux-navigation-and-creation-hub` la navegación es lateral y la creación se
> centraliza en `/crear`; no queda ninguna pestaña inferior.
