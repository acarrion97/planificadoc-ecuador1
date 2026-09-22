## Context

Ver `proposal.md` (Why) para la motivación. Solo el contexto técnico necesario:

- El layout actual es `app/_layout.tsx` → `<Stack>` con `<Stack.Screen name="(tabs)" />`, y `app/(tabs)/_layout.tsx` renderiza `<Tabs>` con 4 pestañas cuyos iconos son **emoji** que ignoran la prop `color`, así que el tint activo/inactivo nunca se ve.
- `unstable_settings = { anchor: "(tabs)" }`, `Redirect href="/(tabs)"` y 3 `router.push/replace("/(tabs)/…")` dependen del **nombre del grupo de rutas** (`app/_layout.tsx:33,64,73`, `app/(tabs)/index.tsx:46`, `app/ver-evaluacion/[id].tsx:198,470`, `app/evaluacion-diagnostica/index.tsx:612`).
- `ScreenContainer` documenta que el safe-area inferior lo absorbe la tab bar (`components/screen-container.tsx:11-13`) — al quitarla hay que cubrirlo explícitamente.
- `app/(tabs)/cuenta.tsx` no contiene hoy ningún enlace de comunidad ni ayuda.
- Sin dependencias nuevas disponibles ni necesarias: `useWindowDimensions` (React Native) resuelve el responsive; `@expo/vector-icons` ya está en `package.json`.
- `docs/brand.md` documenta la identidad: navy `#003366`, dorado `#e0a41e`, tokens del tema en `theme.config.js`.

## Goals / Non-Goals

**Goals:**
- Una sola arquitectura de navegación que sirva escritorio (sidebar), tablet (sidebar colapsado) y móvil (header + drawer).
- Responsabilidades separadas: navegación = ir a una sección; `/crear` = elegir qué documento; Inicio = continuar/crear/buscar; Mis planes = gestionar.
- Que agregar un módulo de creación futuro no obligue a tocar Inicio ni Mis planes.
- Coherencia cromática de navegación con `docs/brand.md`.

**Non-Goals:**
- Reescribir wizards o formularios internos.
- Cambiar rutas existentes ni el modelo de datos.
- Reorganizar **Explorar** por niveles (Inicial / Preparatoria / EGB / BGU / BT): queda fuera de este cambio. Preparatoria está hoy excluida deliberadamente del recorrido genérico por área porque se organiza por **ámbito**, no por bloque (decisión D7 de `openspec/changes/preparatoria-area-integradora/design.md`) y BT tiene catálogo propio. Requiere un cambio aparte que reconcilie esa decisión.
- Rediseñar la lógica curricular o los generadores de documentos.

## Decisions

### D1 — Se conserva el nombre del grupo de rutas `(tabs)`
**Decisión:** no renombrar `app/(tabs)`; se reemplaza el contenido de `app/(tabs)/_layout.tsx` (de `<Tabs>` a `<Slot/>`), y el componente de navegación (`components/app-navigation.tsx`) se monta en el **layout raíz** envolviendo el `<Stack/>`.
**Por qué en la raíz y no en el grupo:** el escenario "Navegación desde cualquier pantalla" del spec exige que la navegación siga disponible en pantallas profundas (detalle de destreza, wizards), que son hermanas de `(tabs)` en el Stack; si viviera dentro del grupo no se vería desde ahí.
**Alternativas:** renombrar a `(app)` → obligaría a tocar `anchor`, `Redirect` y 4 `push/replace` con riesgo de romper navegación profunda sin beneficio de usuario.
**Resultado:** cero cambios de URL y cero cambios en enlaces existentes.

### D2 — Sidebar por ancho de viewport, no por plataforma
**Decisión:** usar `useWindowDimensions().width` con breakpoints: **≥ 1024px** sidebar expandido (240px), **768–1023px** colapsado (64px), **< 768px** header con `☰` + drawer.
**Alternativas:** `Platform.OS` (mobile vs web) → incorrecto: un navegador angosto y una tablet se servirían mal; el patrón responsive sirve los tres casos con la misma lógica.
El estado expandido/colapsado se mantiene en memoria de la sesión (no hay persistencia de preferencias de UI en el producto hoy).

### D3 — `/crear` es un catálogo agrupado (3A vs 3B: gana 3B)
**Decisión:** una pantalla única con todas las categorías, un solo salto, sin asistente previo.
**Alternativa descartada (3A):** selector guiado en 2 pasos — añade un salto y no aporta decisiones: el usuario ya sabe qué quiere; el agrupamiento da la taxonomía sin intermediario.
El catálogo se declara en **una única lista tipada** (`{categoria, modulo, ruta, icono, requiereContexto}`) que alimenta la pantalla; Inicio y Mis planes no la consumen.

### D4 — Módulos contextuales resueltos por params, no por estado global
**Decisión:** `Adaptación curricular` necesita `semanaId`/`planId` (`app/adaptacion-curricular/index.tsx:277`). El catálogo decide su habilitación según el **origen de navegación**: llegando desde `ver-semana`/`ver-plan` se precarga y habilita; desde el sidebar se muestra con la razón y no navega.
**Alternativa descartada:** nuevo store de "contexto de creación" → añade estado global para un solo caso, contra los non-goals.
`Evaluación diagnóstica` sí es autónoma (`app/evaluacion-diagnostica/index.tsx` tiene formulario propio y trata `from=cnc` como precarga opcional).

### D5 — Filtros de Mis planes derivados de `status` existente, sin migración
| Tipo | Estado existente | Filtros aplicables |
|---|---|---|
| PCA | `PcaDocument.status: draft/generated/paid` | Todos, Recientes, En progreso, Completados |
| CxC | `estado: draft/generated/paid` | idem |
| CNC | `status: borrador/generado` | idem |
| Proyecto interdisciplinar | `estado: borrador/generado` | idem |
| Adaptación | `status: draft/generated` | idem |
| Evaluación diagnóstica | `EstatusEvaluacion` (borrador/publicada/aplicada/analizada) | idem |
| Plan diario | **sin estado** (`types.ts:193`) | Todos, Recientes |
| Plan semanal | **sin estado** (`types.ts:417`) | Todos, Recientes |

Mapeo: *En progreso* = `draft`/`borrador`; *Completados* = `generated`/`generado`/`paid`/`publicada`/`aplicada`/`analizada`.
**Alternativa descartada:** agregar `status` a los dos tipos sin estado → viola el non-goal de no tocar el modelo de datos; además su "estado" se puede inferir del contenido, no aporta.

### D6 — Cromática de navegación: token `brand`, `primary` intacto
**Decisión:** agregar `brand: { light: '#003366', dark: '#003366' }` en `theme.config.js` (blanco sobre navy contrasta en ambos modos) y usarlo en sidebar, drawer, CTA "＋ Nueva planificación" y tarjetas de `/crear`. `surface`/`border`/`muted` dan los grises.
**Alternativa descartada:** cambiar `primary` de `#1B5E9E` a `#003366` → `colors.primary` se usa en pantallas existentes (botones, back buttons) y convertiría el cambio en un recolor global fuera de alcance. La unificación total de los dos azules queda como deuda registrada en `docs/brand.md`.
Los colores de `AREAS_INFO` quedan reservados a badges de datos.

### D7 — Iconografía real en la navegación
**Decisión:** iconos de `@expo/vector-icons` (MaterialCommunityIcons) en sidebar/drawer, en lugar de los emoji actuales que ignoran `color` y anulan el estado activo. Los emoji se conservan dentro de las tarjetas de contenido, donde no dependen del tint.

### D8 — `ScreenContainer` hereda el safe-area inferior
**Decisión:** el layout de navegación pasa a manejar `edges={["top","left","right","bottom"]}` para las secciones (ya no hay tab bar que absorba el bottom), manteniendo el comportamiento actual de `ScreenContainer` para las pantallas apiladas tipo card.
**Riesgo asociado:** ver Risk R2.

### D9 — Estrategia de verificación
`pnpm check` y `pnpm lint` contra la línea base conocida (56 errores preexistentes, 0 nuevos) + `pnpm test`. Tests nuevos de vitest para: agrupación y cobertura de los 12 módulos en el catálogo, ítems del sidebar, y volcado de filtros de Mis planes por tipo (D5). La verificación visual en navegador corre a cargo del usuario en Vercel, como en cambios anteriores.

## Risks / Trade-offs

- **[R1] Pérdida de memoria muscular]** — los usuarios acostumbrados a la tab bar pierden su atajo. → Mitigación: el drawer móvil se abre desde el header siempre visible, el CTA de crear está en Inicio y todas las rutas profundas siguen accesibles; se elimina la tab bar en la última fase del plan, después de que sidebar y drawer estén probados.
- **[R2] Safe-area inferior]** — `ScreenContainer` asume tab bar para el bottom (`components/screen-container.tsx:11-13`); sin ella, contenido puede quedar bajo la barra del sistema o con un hueco. → Mitigación: D8 + revisión en dispositivo/emulador iOS y Android.
- **[R3) El grupo `(tabs)` deja de contener "tabs"]** — nombre engañoso para futuros lectores. → Aceptado a cambio de D1 (cero rompimientos); se documenta en el propio `_layout.tsx`.
- **[R4) Contenido angosto con sidebar]** — las pantallas usan `px-5` fijo; en escritorio el área de trabajo se estira. → Mitigación: limitar el ancho máximo del contenido dentro del layout del sidebar; no se toca cada formulario.
- **[R5) Un solo archivo de layout concentra el riesgo]** — si la navegación rompe, rompe toda la app. → Mitigación: el componente se añade envolviendo el `<Stack/>` en el layout raíz, en una fase independiente del rediseño de Inicio; rollback por rama.
- **[R6) Filtros "por estado" pueden sorprender]** — un plan diario nunca aparece en "Completados". → Mitigación: es comportamiento deliberado (D5) y queda escrito en el spec; alternativa sería inventar estados, fuera de alcance.

**Migración:** 5 fases incrementales sobre la rama `feature/ux-navigation-and-creation-hub`, cada una dejando la app navegable: (1) layout + sidebar/drawer con las secciones actuales, (2) `/crear` con los 12 módulos, (3) Inicio por intención, (4) Mis planes solo gestión, (5) retiro de la tab bar + pulido cromático. **Rollback:** cada fase es un commit revertible; la tab bar solo desaparece en la fase 5, de modo que revertir esa fase restaura la navegación previa sin tocar las demás.

## Open Questions

- **Uso del dorado `#e0a41e` en la UI** (marcar módulos Premium en `/crear` o el estado "generado ✓"): decisión de marca que no cambia la estructura ni los requisitos; puede tomarse en una iteración posterior.
