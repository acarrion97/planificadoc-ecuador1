## Context

- `Semana1CNC` (`data/types-cnc.ts:38-46`) solo tiene `actividadesAdaptacion: string[]`, diagnóstico académico/socioemocional, `coordinacionDece` y `tecnicasReflexion` — no hay campo de metodología declarada ni de DUA.
- El prompt de Semana 1 (`buildPrompt` en `server/cnc-router.ts:186-195`) le pasa a la IA `Grado/Curso: ${input.grado}` y `Subnivel: ${input.subnivel}` como strings crudos, sin traducirlos a expectativas curriculares. El esquema de salida (`:242-243`) solo pide `actividadesAdaptacionSugeridas` y `tecnicaDiagnosticoSugerida`, dos arrays planos.
- El patrón DUA ya existe y funciona en producción: `data/dua-estrategias.ts` (3 principios CAST) + `server/topics-router.ts:286-300` (instrucción a la IA de devolver `{I, R, A}` por actividad) + `:420-438` (normalización server-side que fuerza los 3 principios a estar cubiertos si la IA los omite). `data/types.ts:105` (`DUAActividad`) es el tipo que consumen `lib/plan-word-generator.ts` y `lib/semanal-word-generator.ts` para pintar los cuadrados de color.
- La integración interdisciplinaria de Semanas 4-5 tiene **dos puntos de generación independientes** que hoy comparten el mismo defecto (`areasIntegradas` sin instrucción de fusión):
  - `buildPrompt` dentro de `generate` (`server/cnc-router.ts:210-214`, esquema en `:248-260`) — genera el plan completo.
  - `sugerirProyecto` (`server/cnc-router.ts:447-506`) — endpoint dedicado a regenerar solo la fase Crea, con su propio prompt y esquema (`:474-500`).
- Verificado contra fuentes oficiales (ver proposal.md): no hay un método único obligatorio del MinEduc para esta transición: el docente tiene autonomía metodológica. Sí hay respaldo fuerte para exigir metodología declarada, calibración por subnivel, DUA obligatorio, y fusión interdisciplinaria real (ABP).

Ver proposal.md para la motivación y specs/cnc-semana1-metodologia-dua/spec.md para los requisitos de comportamiento.

## Goals / Non-Goals

**Goals:**
- Semana 1 declara metodología explícita, sin imponer una única.
- El diagnóstico/instrumento de Semana 1 se calibra por subnivel real (Elemental/Media/Superior/Bachillerato) o por Figura Profesional/módulo (BT) — nunca por una heurística de edad para BT.
- DUA obligatorio en las actividades e instrumentos de Semana 1, reutilizando el patrón `{I,R,A}` + normalización ya probado.
- Apoyos visuales/pictogramas como sugerencia contextual (parte de la estrategia DUA "Representación"), no como campo obligatorio separado.
- Los dos puntos de generación de Semanas 4-5 (`generate` y `sugerirProyecto`) exigen fusión real de áreas cuando `areasIntegradas.length > 1`.
- Compatibilidad total con planes CNC ya persistidos.

**Non-Goals:**
- No se define un catálogo cerrado de "hitos por grado" dentro de un subnivel (p. ej. "2do=decodificación, 3ro=comprensión") — no está codificado oficialmente por grado individual, solo por subnivel completo; queda como criterio de la IA/docente, no como regla dura del sistema.
- No se agrega DUA a Semanas 2-3 o 4-5 en este change — el pedido de la sesión de exploración se acotó a Semana 1 (más la corrección de integración de áreas en Crea, que es un defecto distinto y ya confirmado).
- No se toca `data/dua-estrategias.ts` ni el patrón de `topics-router.ts` — se reutilizan tal cual.
- No hay migración de datos ni cambios de persistencia (la tabla CNC guarda JSON opaco).

## Decisions

**D1 — Nuevo campo `metodologiaDeclarada` en `Semana1CNC`, no un enum cerrado.**
Se agrega `metodologiaDeclarada: string` (texto libre que la IA redacta y el docente puede editar), no un `enum` de metodologías predefinidas.
- *Alternativa considerada*: `enum` cerrado (`"juego" | "colaborativo" | "abp" | ...`). Descartada: las fuentes oficiales confirman autonomía docente para elegir/combinar enfoques; un enum forzaría una taxonomía que MinEduc no impone y limitaría la expresión pedagógica real del docente.
- El prompt SÍ ancla la sugerencia de la IA a ejemplos reales por subnivel — `estrategiasMetodologicasPorSubnivel()` en `lib/curriculo-prerrequisitos.ts`, verificado texto-por-texto contra los **Lineamientos Pedagógicos Costa-Galápagos 2026-2027** (la misma fuente primaria de la sección 2.1 "Conecta, nivela y crea" que motiva este change), secciones 2.3-2.8 (pág. 16-19): p. ej. subnivel Elemental → "círculo de lectura", "teatro de cuentos" (pág. 17-18, verificado verbatim). Son ejemplos que la fuente ofrece como sugerencia, no una lista cerrada — la IA puede proponer otra coherente con el nivel.

**D2 — DUA en Semana 1 sigue el patrón `{I,R,A}` por ítem, igual que `topics-router.ts`.**
Cada actividad de `actividadesAdaptacionSugeridas` (y el instrumento sugerido) llevan un `dua: {I: bool, R: bool, A: bool}` paralelo, normalizado server-side en `cnc-router.ts` con la misma lógica de `topics-router.ts:420-438` (si algún principio no está cubierto tras la respuesta de la IA, se fuerza en el último ítem).
- *Alternativa considerada*: pedir un campo de texto libre "cómo aplica DUA" por actividad. Descartada: pierde la garantía de cobertura de los 3 principios y el patrón visual (cuadrados de color) que ya usan otros generadores; reinventar el formato rompe la consistencia entre módulos.

**D3 — Calibración curricular: subnivel + destrezas/indicadores REALES ya diagnosticados, nunca un switch por grado.**
La calibración NO es un mapeo simplista `grado → instrumento` (p. ej. "3ro → X"). Se compone de dos capas, ambas ya disponibles hoy:
1. Una función pura (junto a `resolverPrerrequisito` en `lib/curriculo-prerrequisitos.ts`, o un helper nuevo en el mismo archivo) que, dado `subnivel` + `modalidad`, devuelve el TIPO de instrumento apropiado para ese subnivel — p. ej. subnivel 2 (Elemental): observación/lectura de imágenes/identificación de elementos explícitos (Tabla 3, Caja de herramientas de evaluación diagnóstica, MinEduc). El subnivel es la unidad curricular real (2º/3º/4º EGB comparten subnivel Elemental) — no el número de grado.
2. La instrucción del prompt combina ese tipo de instrumento con las destrezas/indicadores REALES que ya vienen en `input.semana1.diagnosticoAcademico` (código, descripción, indicador vía `buscarPorCodigo` — mismo dato que ya arma `destrezasAcademicas` en `cnc-router.ts:160-162`): "usa el tipo de instrumento apropiado al subnivel, aplicado a estas destrezas/indicadores específicos — no inventes otras". Así el instrumento queda anclado al DCD/indicador real diagnosticado, no solo a una etiqueta de subnivel.
Para BT: se usa el `contextoBT` que YA existe (Figura Profesional/módulo/criterios reales), sin heurística de edad ni de grado de EGB — esta calibración por subnivel NO se aplica cuando `modalidad === "bt"`.
- *Alternativa considerada*: mapeo directo grado→instrumento (`if (grado.includes("3"))...`). Descartada explícitamente: no refleja la unidad curricular real (subnivel), no se ancla a destrezas/indicadores reales, y es exactamente el tipo de heurística simplista que el MinEduc no respalda.
- *Alternativa considerada*: pasarle a la IA el prompt completo del currículo priorizado por subnivel. Descartada: demasiado texto/costo de tokens por request; un resumen curado de "qué tipo de instrumento es apropiado por subnivel" combinado con las destrezas reales ya diagnosticadas es suficiente y más barato, siguiendo el mismo espíritu que `curriculo-prerrequisitos.ts` (reglas curadas, no el catálogo completo).

**D4 — Fusión interdisciplinaria: instrucción explícita en AMBOS puntos de generación.**
Se agrega el mismo párrafo de instrucción ("cuando `areasIntegradas` tenga más de un elemento, diseña una experiencia/producto común que fusione las destrezas de esas áreas en las mismas actividades, no listas paralelas por área") tanto en `buildPrompt` (`cnc-router.ts:210-214` y `:225-238` instrucciones importantes) como en `sugerirProyecto` (`:474-490`). Ambos ya comparten estructura de prompt casi idéntica para esta sección, así que el texto de instrucción es literalmente el mismo string reutilizado.
- *Alternativa considerada*: unificar `generate` y `sugerirProyecto` en una sola función de construcción de prompt para Crea, para no duplicar. Fuera de alcance de este change (refactor mayor, riesgo de romper el endpoint dedicado que ya está en producción) — se deja como mejora futura opcional, no bloqueante.

**D5 — Apoyos visuales/pictogramas: parte del texto de DUA "Representación", no un campo nuevo.**
No se agrega un campo `apoyosVisuales` separado. La instrucción del prompt le pide a la IA que, cuando declare cobertura del principio "Representación" (`R: true`) para una actividad relacionada con lectoescritura, describa en el texto de la actividad el apoyo visual concreto (pictograma, imagen, organizador) si aplica.
- *Alternativa considerada*: campo estructurado `pictogramas: string[]`. Descartada: no hay respaldo oficial para tratar pictogramas como obligación separada (ver proposal.md, punto 4) — encaja mejor como contenido del principio DUA existente que como una nueva dimensión de datos.

## Risks / Trade-offs

- **La IA ignora la instrucción de fusión y sigue generando listas paralelas por área** → Mitigación: ejemplo concreto en el prompt (un `productoFinal`/actividad que mencione ambas áreas explícitamente) + instrucción en INSTRUCCIONES IMPORTANTES, mismo mecanismo que ya usa el prompt para otras reglas (p. ej. "no inventes destrezas").
- **Normalización DUA de Semana 1 diverge de la de `topics-router.ts` con el tiempo** → Mitigación: extraer la lógica de normalización a un helper compartido si diverge visiblemente en review; no bloqueante para este change (empezar con la misma lógica copiada, como ya se hizo con otros patrones en CNC — ver comentario de aislamiento intencional en `data/types-cnc.ts:16-19`).
- **`sugerirProyecto` y `generate` quedan desincronizados si solo se actualiza uno** → Mitigación: tests que cubran ambos endpoints con `areasIntegradas.length > 1` y verifiquen que el prompt resultante incluye la instrucción de fusión.
- **Calibración curricular incompleta para subniveles no cubiertos por la Caja de herramientas 2020** → Mitigación: el helper de calibración cae a una instrucción genérica de "prioriza instrumentos apropiados a la edad/nivel" cuando no hay regla curada específica, en vez de fallar o inventar.

## Migration Plan

Cambio aditivo de tipos con defaults (`metodologiaDeclarada: ""`, `duaActividades` opcional). Sin migración de datos: planes CNC persistidos antes del cambio no tienen estos campos y los generadores/vista de resultado los tratan como ausentes (`?? ""` / `?? []`), igual que el patrón ya usado en `cnc-producto-final-crea`. Rollback: revertir el cambio completo; no hay rutas de persistencia alteradas.

## Open Questions

- ¿La calibración curricular por subnivel debe vivir como datos curados en un archivo nuevo (`data/cnc-calibracion-curricular.ts`) o como un bloque de texto directamente en el prompt de `cnc-router.ts`? Se asume archivo de datos nuevo (más fácil de mantener/citar la fuente MinEduc por subnivel); si en la implementación resulta demasiado poco contenido para justificar un archivo aparte, se puede colapsar a una constante en el propio router sin cambiar la spec.
