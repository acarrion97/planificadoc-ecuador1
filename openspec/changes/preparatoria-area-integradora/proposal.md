## Why

Preparatoria (subnivel 1, 1.° grado EGB) se trata hoy en la UI como un nivel más de EGB basado en asignaturas (M, LL, CN, CS, EF, ECA...), pero ninguna de esas áreas tiene destrezas cargadas para subnivel 1 — el docente ve chips vacíos. El MINEDUC organiza Preparatoria mediante un currículo integrador de 7 ámbitos de desarrollo y aprendizaje, en continuidad directa con Educación Inicial (que ya se modela así en este proyecto bajo el área `INI`), no mediante la estructura de asignaturas que rige desde 2.° EGB en adelante. Hay que corregir el modelo antes de que se sigan agregando datos sobre la estructura equivocada.

## What Changes

- **Corrección de arquitectura (post-verificación de fuente primaria):** el currículo priorizado 2025 muestra que las destrezas de los 7 ámbitos usan los códigos oficiales de las áreas ya existentes (`M`, `CN`, `CS`, `LL`, `EFL`, `EF`, `ECA`) con `subnivel: 1` y `bloque` = número de ámbito (1-7) — no un área nueva. Preparatoria se modela como una **vista integradora** que agrupa destrezas de esas áreas por ámbito, sin introducir `area: "PREP"` ni ningún área nueva. Ver `design.md` (D1, D3) para el detalle verificado.
- Se agregan destrezas `subnivel: 1` a los archivos de datos existentes (`data/destrezas-matematica.ts`, `data/destrezas-cn.ts`, `data/destrezas-cs.ts`, `data/destrezas-lengua.ts`, `data/destrezas-ingles.ts`, `data/destrezas-eca.ts`, `data/destrezas-ef.ts`), transcritas de las secciones 8.1-8.7 (pp.20-38) del currículo priorizado, conservando código, área y bloque oficiales.
- Se define `AMBITOS_PREPARATORIA` (los 7 nombres de ámbito) como estructura de presentación independiente de `AREAS_INFO`, ya que un ámbito agrupa destrezas de varias áreas a la vez.
- Se crea una pantalla dedicada `app/planificar-preparatoria/index.tsx`, replicando el patrón de ámbitos de `app/planificar-inicial/index.tsx` (selector de ámbito, tarjetas repetibles) — pero filtrando `subnivel === 1 && bloque === ámbito` a través de **todas** las áreas, con `subnivel` fijo en `1` (sin reutilizar la inferencia frágil `grado.includes("1")` de Inicial).
- Se agrega una card "Planificación Preparatoria" en la pantalla de inicio, junto a la de Inicial.
- **BREAKING (UX)**: Preparatoria (subnivel 1) deja de ser seleccionable en `app/planificar-semanal/index.tsx` — sale del selector de subnivel, igual que Inicial nunca estuvo ahí. Cualquier plan de Preparatoria en curso hecho desde esa pantalla genérica deja de tener continuidad ahí.
- Preparatoria deja de mencionarse en el subtítulo de la sección EGB de `app/(tabs)/explorar.tsx`.
- `app/planificacion-anual/index.tsx` deja de asociar Preparatoria únicamente con `area === "CAI"`; cualquiera de las 7 áreas que ahora tiene destrezas de subnivel 1 debe poder ofrecerlo como opción.
- `CAI` e `INI` permanecen intactas — sin cambios de datos ni de comportamiento.
- Explícitamente fuera de alcance: los currículos específicos **completos** de Educación Física (capítulo 10) y Educación Cultural y Artística (capítulo 9) para subnivel 1, más allá de las destrezas que el propio currículo integrador ya cita dentro de los ámbitos 6 y 7 (`ECA.1.6.x`, `EFL.1.6.x`, `EF.1.7.x`, que sí están en alcance). Se audita en un cambio separado (ver D4 en `design.md`).

## Capabilities

### New Capabilities
- `planificacion-preparatoria`: vista y flujo de planificación integradores para Preparatoria (1.° EGB), que agrupan por los 7 ámbitos oficiales de desarrollo y aprendizaje las destrezas ya existentes de `M`, `CN`, `CS`, `LL`, `EFL`, `EF` y `ECA` en `subnivel: 1`, sin crear un área curricular nueva — inspirado en el patrón ya probado de Educación Inicial.

### Modified Capabilities
(ninguna — no existe spec previo que documente el comportamiento de `planificar-semanal`, `explorar` o `planificacion-anual` que se esté modificando; los ajustes ahí son de implementación para dejar de exponer Preparatoria donde no corresponde, no un cambio de requisitos ya documentados)

## Impact

- `data/types.ts` — sin cambios en el tipo `Area` (no se agrega `PREP`); se agrega `AMBITOS_PREPARATORIA` como estructura de presentación aparte de `AREAS_INFO`.
- `data/destrezas-matematica.ts`, `data/destrezas-cn.ts`, `data/destrezas-cs.ts`, `data/destrezas-lengua.ts`, `data/destrezas-ingles.ts`, `data/destrezas-eca.ts`, `data/destrezas-ef.ts` — nuevas entradas `subnivel: 1` transcritas de la fuente oficial, cada una en su archivo existente.
- `data/index.ts` — no se necesitan funciones de filtrado nuevas (`filtrarPorAreaSubnivelBloque` ya cubre filtrar una área; la vista de Preparatoria filtra sobre `TODAS_LAS_DESTREZAS` directamente por `subnivel === 1 && bloque === ámbito`, sin restringir área).
- `app/planificar-preparatoria/index.tsx` — nuevo.
- `app/(tabs)/index.tsx` — nueva card de navegación.
- `app/(tabs)/explorar.tsx` — subtítulo EGB sin "Preparatoria".
- `app/planificar-semanal/index.tsx` — subnivel 1 fuera del selector.
- `app/planificacion-anual/index.tsx` — Preparatoria servida a través de cualquiera de las 7 áreas con datos de subnivel 1, no vía `SUBNIVELES_CAI`/`CAI`.
- Sin cambios en `data/destrezas-kai.ts`, `lib/curriculo-prerrequisitos.ts`, `lib/evaluacion-utils.ts`, `app/evaluacion-diagnostica/index.tsx`.
- Fuera de alcance de este `Impact`: la población completa de los currículos específicos de EF/ECA (capítulos 10 y 9) más allá de lo que los ámbitos 6/7 ya citan.
