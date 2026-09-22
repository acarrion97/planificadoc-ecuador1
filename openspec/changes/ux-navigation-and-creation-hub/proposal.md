## Why

PlanificaDoc tiene 12 flujos de creación repartidos en 4 archivos de entrada distintos (`app/(tabs)/index.tsx`, `app/(tabs)/planes.tsx`, `components/PlanesBTSection.tsx`, `components/PlanesCNCSection.tsx`), con 6 colores de navegación compitiendo entre sí y con módulos inaccesibles desde cualquier punto que no sea su pantalla concreta (BT está además apagado en Home con `false &&`). Home duplica contenido de Explorar (grids EGB/BGU) y Mezcla catálogo con creación; Mis Planes mezcla creación con listado. Cada nuevo módulo obliga a añadir otra tarjeta en otro sitio. Se necesita una arquitectura de navegación única, con responsabilidades separadas, que escale y que deje ver la marca (navy + dorado) en lugar de colores de módulo.

## What Changes

- **Nuevo sidebar izquierdo persistente en escritorio** con 5 zonas funcionales (Inicio, Crear, Explorar, Mis planes / Mi cuenta, Ayuda), expandible a 64px y colapsable.
- **En móvil, header con `☰` + drawer lateral** que reemplaza la tab bar inferior actual (`app/(tabs)/_layout.tsx`) — **BREAKING** para usuarios acostumbrados a la tab bar.
- **Nueva ruta `/crear`** como único punto de entrada de creación: catálogo agrupado (3B) por categoría — Plan de aula, Plan de área, Programaciones, Currículo, Niveles educativos, Contextuales — con lenguaje visual único navy/blanco/gris.
- **Home reorientado a intención**: saludo + buscador de DCD + bloque "Continuar" + CTA `＋ Nueva planificación`. Se **eliminan** del Home los grids de áreas (pasan a ser exclusivos de Explorar), las tarjetas de módulo (Inicial, Preparatoria, PCA, PCT, BT) y el banner de WhatsApp (pasa a Mi cuenta).
- **Mis Planes deja de crear**: quitan los 6 botones de creación; queda solo gestión (listar, filtrar, continuar, editar, duplicar, eliminar).
- **Unificación cromática de navegación**: todos los botones/tarjetas de navegación pasan a `#003366` (azul de marca) + blanco/gris; los colores curriculares (`AREAS_INFO`) se reservan para badges de datos.
- **Nueva ruta `/ayuda`** (no existe hoy) para el ítem del sidebar.
- **Duplicar planificación** como acción nueva en Mis Planes (no existe hoy; sin cambio de esquema: copia del registro).

## Capabilities

### New Capabilities
- `navegacion-principal`: sidebar persistente en escritorio, drawer en móvil, header móvil, ítems y agrupación en zonas, estado colapsado/expandido, ítem de Ayuda y presencia de marca.
- `hub-de-creacion`: ruta `/crear`, catálogo agrupado por categoría, lenguaje cromático único, habilitación contextual de los módulos que requieren contexto previo (adaptación, diagnóstico).
- `inicio-por-intencion`: composición del Home por bloques de intención (buscar, continuar, crear) y elementos que se retiran de él.
- `mis-planes-gestion`: Mis Planes como pantalla de solo gestión, con filtros derivados de estado y acciones disponibles por tipo de documento.

### Modified Capabilities

<!-- Ninguna: los 4 specs existentes (catalogo-bachillerato-tecnico, cnc-paso-diagnostico,
     cnc-producto-final-crea, dcd-desagregacion-gradacion) no cambian de requisitos.
     Los wizards, rutas y modelos de datos existentes se conservan. -->

## Impact

- **Archivos principales**: `app/_layout.tsx`, `app/(tabs)/_layout.tsx` (se reemplaza por layout con sidebar), `app/(tabs)/index.tsx`, `app/(tabs)/explorar.tsx`, `app/(tabs)/planes.tsx`, `app/(tabs)/cuenta.tsx`, `components/Planes*Section.tsx`.
- **Nuevos**: componente sidebar (+ drawer móvil), ruta `app/crear/index.tsx`, ruta `app/ayuda/index.tsx`.
- **Rutas existentes intactas**: renombrar el grupo de rutas `(tabs)` no altera URLs (los grupos son privados en expo-router); ningún wizard se reescribe.
- **Modelo de datos sin cambios**: los filtros de Mis Planes se derivan de `status`/`estado` ya existentes (`PcaDocument.status`, `PlanCNC.status`, `ProyectoInterdisciplinar.estado`, `CurricularAdaptation.status`, `EstatusEvaluacion`) y de `createdAt`/`updatedAt` cuando el tipo no tiene estado (plan diario y semanal).
- **Plataformas**: afecta web/escritorio (sidebar) y móvil (drawer). `vercel.json` y `expo-router` sin cambios de configuración.
- **Tests**: `__tests__/` existentes no cubren navegación; se agregan pruebas de composición del catálogo `/crear` y del volcado de items del sidebar.
- **Fuera de alcance**: reescritura de wizards, cambios de rutas, modelo de datos, formularios internos y lógica curricular.
