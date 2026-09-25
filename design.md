# PlanificaDoc Ecuador — Diseño de Interfaz

## Concepto General

Aplicación móvil para docentes ecuatorianos que permite generar planificaciones microcurriculares de forma rápida ingresando el código de la destreza con criterio de desempeño (DCD) del PCA. La app contiene una base de datos local completa de destrezas del currículo nacional ecuatoriano.

## Paleta de Colores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| primary | #1B5E9E | #4DA3E8 | Azul institucional (similar al Ministerio de Educación) |
| brand | #003366 | #003366 | Marca como **fondo**: ítem activo del sidebar/drawer, botones y chips (texto blanco encima) |
| brandFg | #003366 | #7DB9EA | Marca como **texto/icono/tinte**: títulos, links, chips y acentos (en dark se aclara para contraste ≥5:1) |
| background | #F8FAFC | #0A2E5C | Fondo principal (dark: azul marino) |
| surface | #FFFFFF | #123C72 | Tarjetas y superficies elevadas |
| foreground | #0F172A | #EBF1FA | Texto principal |
| muted | #64748B | #93AED2 | Texto secundario |
| border | #E2E8F0 | #174E97 | Bordes y divisores |
| success | #16A34A | #4ADE80 | Estados exitosos |
| warning | #D97706 | #FBBF24 | Advertencias |
| error | #DC2626 | #F87171 | Errores |

## Lista de Pantallas

### 1. Pantalla de Inicio (Home)
Pantalla por intención: identidad de marca y claim, buscador de destreza (DCD), bloque **Continuar** con lo más reciente de cada tipo con detalle propio y CTA **＋ Nueva planificación** que abre el hub `/crear`. Sin grids de áreas ni tarjetas de módulo (cambio `ux-navigation-and-creation-hub`).

### 2. Pantalla de Búsqueda / Resultados
Muestra los resultados al buscar un código de destreza. Permite filtrar por área, subnivel y bloque curricular. Lista las destrezas encontradas en tarjetas informativas.

### 3. Pantalla de Detalle de Destreza
Muestra toda la información de una destreza seleccionada: código, descripción completa, área, subnivel, bloque curricular, objetivos relacionados, criterios de evaluación e indicadores.

### 4. Pantalla de Planificación (Generador)
Formulario para generar la planificación microcurricular. Campos pre-llenados con la información de la destreza. El docente completa: datos institucionales, número de periodos, fecha, actividades, recursos y evaluación.

### 5. Pantalla de Mis planes
Listado unificado de los 9 tipos de plan (locales y de servidor) con filtros y acciones de gestión. La creación ya no vive aquí: va en `/crear`.

### 6. Pantalla Explorar
Grid de secciones y tarjetas — Educación Inicial (grados), Preparatoria (ámbitos integradores), EGB y BGU (áreas) — con el conteo de destrezas de cada tarjeta y navegación hasta el detalle.

### 7. Hub de creación (`/crear`)
Punto único de entrada a la creación: catálogo de 12 módulos en 6 categorías que abren los flujos existentes (el plan diario entra por el buscador de Inicio, porque nace de una destreza).

## Contenido y Funcionalidad por Pantalla

### Home
- Identidad de marca y claim en la parte superior
- Campo de búsqueda grande con placeholder "Ingrese código de destreza (ej: M.2.1.1)"
- Bloque **Continuar**: lo más reciente de cada tipo que tiene detalle propio
- CTA **＋ Nueva planificación** → hub `/crear`
- Los grids de áreas y las secciones de módulos viven ahora en **Explorar** y `/crear`, no en Home

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

### Mis planes
- Grid de tarjetas (1/2/3 columnas, mismos breakpoints que Explorar) con icono por plan: iconos DCD en planes diarios, emoji de materia en materias, icono del tipo como respaldo
- Chip de tipo, chip de estado (donde existe), fecha de actualización, título y detalle
- Filtros: Todos, Recientes (30 días), En progreso, Completados
- Acciones por tarjeta: Eliminar, Duplicar, Editar (solo donde hay reanudación) y Continuar — iconos con tooltip al pasar el mouse en web

## Flujos de Usuario Principales

### Flujo 1: Búsqueda por código
1. Usuario abre la app → ve la pantalla Home
2. Ingresa código de destreza (ej: "M.3.1.1") en el campo de búsqueda
3. Se muestran los resultados coincidentes
4. Toca una destreza → ve el Detalle
5. Toca "Generar Planificación" → abre el Generador
6. Completa los campos editables → Guarda

### Flujo 2: Exploración por nivel y área
1. Usuario abre **Explorar** desde la navegación lateral
2. Elige una sección: Educación Inicial (grados), Preparatoria (ámbitos), EGB (áreas) o BGU (áreas)
3. Navega por subniveles o ámbitos hasta el listado de destrezas
4. Selecciona una destreza → Detalle → Generar Planificación

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
