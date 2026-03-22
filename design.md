# PlanificaDoc Ecuador — Diseño de Interfaz

## Concepto General

Aplicación móvil para docentes ecuatorianos que permite generar planificaciones microcurriculares de forma rápida ingresando el código de la destreza con criterio de desempeño (DCD) del PCA. La app contiene una base de datos local completa de destrezas del currículo nacional ecuatoriano.

## Paleta de Colores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| primary | #1B5E9E | #4DA3E8 | Azul institucional (similar al Ministerio de Educación) |
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
1. Usuario va a la pestaña "Mis Planificaciones"
2. Ve la lista de planificaciones guardadas
3. Toca una para ver/editar los detalles

## Navegación

Tab Bar con 3 pestañas:
1. **Inicio** (icono: casa) — Pantalla Home con búsqueda
2. **Explorar** (icono: brújula/libro) — Explorar destrezas por área/subnivel
3. **Mis Planes** (icono: documento) — Planificaciones guardadas
