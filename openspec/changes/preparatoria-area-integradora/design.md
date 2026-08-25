## Context

Verificación directa del código y de la fuente primaria (no de resúmenes de terceros) mostró los hechos que definen este diseño:

1. **`INI` inspira el patrón de UI, pero no el modelo de datos.** `data/types.ts` define `AREAS_INFO["INI"]` con 7 `bloques` (Identidad y Autonomía, Convivencia, Relaciones con el medio natural y cultural, Relaciones lógico-matemáticas, Comprensión y Expresión del Lenguaje, Expresión Artística, Expresión corporal y motricidad), y `app/planificar-inicial/index.tsx` ya tiene selector de ámbito, tarjetas repetibles y filtrado por bloque+subnivel. Ese patrón de **pantalla** (selector de ámbito, tarjetas) sí se replica para Preparatoria. El patrón de **datos** (un área propia con sus 7 bloques) no se replica — ver punto 5.
2. **`CAI` (`area: "CAI"`, "Cívica — Acomp. Integral") es una asignatura transversal independiente**, presente en los chips de todos los subniveles (`app/planificar-semanal/index.tsx:551-552`), con 16 destrezas propias en subnivel 1 sobre honestidad/convivencia/símbolos patrios. No tiene relación estructural con los 7 ámbitos de Preparatoria.
3. **La malla horaria oficial de Preparatoria tiene 4 componentes**: Currículo Integrador (25h, los 7 ámbitos), Educación Cultural y Artística (3h), Educación Física (5h) y Proyectos Escolares (2h).
4. **El índice del currículo priorizado 2025** (verificado con `pdftotext -layout` sobre el PDF oficial) confirma capítulo 8 "Mapas curriculares para el subnivel de Preparatoria" con las secciones 8.1-8.7 (pp.20-38, un capítulo por ámbito), y como capítulos propios y separados: capítulo 9 "Currículo de Educación Cultural y Artística" (p.40), capítulo 10 "Currículo de Educación Física" (p.43) y capítulo 11 "Período pedagógico de Cívica y Acompañamiento Integral en el Aula" (p.46).
5. **Hallazgo que corrigió la decisión original D1** (encontrado transcribiendo el ámbito 1 durante la implementación, verificado en los 7 ámbitos): las tablas de destrezas de cada ámbito **no usan un código nuevo tipo `PREP.1.x.x`** — usan los códigos oficiales de las áreas que ya existen en este proyecto, con `subnivel: 1` y `bloque` = número de ámbito:

   | Ámbito | Código real en el PDF | `area` existente | `bloque` |
   |---|---|---|---|
   | 1. Identidad y Autonomía | `CN.1.1.x`, `CS.1.1.x`, `EFL.1.1.x` | `CN`, `CS`, `EFL` | 1 |
   | 2. Convivencia | `CS.1.2.x`, `EFL.1.2.x` | `CS`, `EFL` | 2 |
   | 3. Descubrimiento... medio natural y cultural | `CN.1.3.x`, `CS.1.3.x`, `EFL.1.3.x` | `CN`, `CS`, `EFL` | 3 |
   | 4. Relaciones lógico-matemáticas | `M.1.4.x`, `EFL.1.4.x` | `M`, `EFL` | 4 |
   | 5. Comprensión y expresión oral y escrita | `LL.1.5.x`, `EFL.1.5.x` | `LL`, `EFL` | 5 |
   | 6. Comprensión y expresión artística | `ECA.1.6.x`, `EFL.1.6.x` | `ECA`, `EFL` | 6 |
   | 7. Expresión corporal | `EF.1.7.x`, `EFL.1.7.x` | `EF`, `EFL` | 7 |

   `EFL` (Inglés) aparece en los 7 ámbitos — es la única área presente en todos ellos.

   Además, varias destrezas de los ámbitos 6 y 7 anotan explícitamente su código en el currículo específico correspondiente (p. ej. una destreza del ámbito 6 cita *"(En Educación Cultural y Artística ECA.1.1.4.)"*) — el currículo integrador **reutiliza y renumera** (a `bloque` 6/7) una destreza que en el currículo específico de ECA/EF vive con otro código y otro bloque. Es articulación documentada, no una casualidad de nombres.

Ver `proposal.md` para la motivación completa.

## Goals / Non-Goals

**Goals:**
- Modelar Preparatoria como una **vista integradora** sobre las áreas curriculares existentes (`M`, `CN`, `CS`, `LL`, `EFL`, `EF`, `ECA`) para `subnivel: 1`, sin crear un área nueva en el modelo de datos.
- Preservar el código, área y bloque oficiales de cada destreza tal como los define el currículo priorizado — la vista de ámbitos agrupa, no reclasifica ni renombra.
- Dar a Preparatoria una pantalla de planificación dedicada que agrupe por ámbito (1-7) en vez de por asignatura, reutilizando **solo el patrón visual** de `planificar-inicial` (selector de ámbito, tarjetas) — no su backend ni su exportación (ver D8).
- Sacar a Preparatoria de los flujos genéricos de EGB (`planificar-semanal`, subtítulo de `explorar`, atajo `area === "CAI"` de PCA) donde hoy produce resultados vacíos o mal categorizados.
- Dejar clara la frontera entre las destrezas del currículo integrador (en alcance) y el resto de los currículos específicos completos de EF/ECA (fuera de alcance).

**Non-Goals:**
- No se crea `area: "PREP"` ni ningún área nueva en el tipo `Area`.
- No se modifican los `bloques` existentes de `AREAS_INFO["M"|"CN"|"CS"|"LL"|"EFL"|"EF"|"ECA"]` usados por subniveles 2-5 — la semántica de "ámbito" para subnivel 1 vive aparte, en `AMBITOS_PREPARATORIA` (ver D3, D6).
- No se pueblan en este cambio los currículos específicos **completos** de EF (capítulo 10) ni ECA (capítulo 9) más allá de las destrezas que el propio currículo integrador ya cita dentro de los ámbitos 6 y 7 (ver D4).
- No se audita ni se modifica el comportamiento de `CAI`.
- No se extrae un componente `AmbitoCard` compartido entre `planificar-inicial` y `planificar-preparatoria` — se duplica el patrón de forma controlada (ver Riesgos).
- No se crea `server/preparatoria-router.ts`, ni un generador Word propio (`plan-preparatoria-word-generator.ts`), ni un archivo de tipos exclusivo (`types-preparatoria.ts`) — ver D8.

## Decisions

**D1 — No se crea área nueva; Preparatoria es una vista integradora sobre áreas existentes.**
La decisión original de este documento era crear `area: "PREP"` con 7 bloques. Se descarta: verificado contra el texto real del currículo priorizado (extracción propia vía `pdftotext`, no un resumen de terceros), las destrezas de los 7 ámbitos usan los códigos oficiales de `M`, `CN`, `CS`, `LL`, `EFL`, `EF` y `ECA` — todos ya son valores válidos de `Area` en este proyecto. Crear `PREP` habría significado inventar códigos que no existen en la fuente, exactamente lo que este cambio se propuso evitar desde el inicio. La corrección: las destrezas se agregan a los archivos de datos existentes de cada asignatura, y Preparatoria se modela como una vista de agrupación por ámbito sobre esas áreas.
*Alternativas descartadas:* `area: "CAI"` con 7 bloques (plan original — CAI no tiene relación estructural con los ámbitos); `area: "PREP"` nueva (esta misma decisión, descartada tras verificar los códigos oficiales reales).

**D2 — El `subnivel` de la pantalla de Preparatoria es una constante, no un valor inferido.**
Preparatoria tiene un solo grado (subnivel `1`). La pantalla nueva fija `subnivel = 1` directamente, sin reutilizar la inferencia `grado.includes("1")` de `planificar-inicial` (que además rompería: "1.° EGB" también contiene `"1"`).

**D3 — `AMBITOS_PREPARATORIA` es una estructura de presentación independiente de `AREAS_INFO`.**
Como una misma pantalla agrupa destrezas de hasta 7 áreas distintas por número de ámbito, y ese número no pertenece a ninguna área en particular, `AMBITOS_PREPARATORIA: Record<number, string>` se define aparte (no dentro de `AREAS_INFO[algunaArea].bloques`), con los 7 nombres verificados en las secciones 8.1-8.7:
```
1: "Identidad y Autonomía"
2: "Convivencia"
3: "Descubrimiento y comprensión del medio natural y cultural"
4: "Relaciones lógico-matemáticas"
5: "Comprensión y expresión oral y escrita"
6: "Comprensión y expresión artística"
7: "Expresión corporal"
```

**D4 — Frontera de alcance entre el mapa integrador (en alcance) y los currículos específicos de EF/ECA (fuera de alcance).**
Confirmado en la fuente (ver Context, punto 5): el currículo integrador cita explícitamente, dentro de las tablas de los ámbitos 6 y 7, destrezas cuyo código pertenece a `ECA`/`EFL`/`EF`. Frontera de este cambio:
- **En alcance:** todas las destrezas que las tablas de los 7 ámbitos (secciones 8.1-8.7) listan explícitamente, transcritas con su área, subnivel y bloque tal como aparecen ahí — incluidas las de código `ECA.1.6.x`, `EFL.1.6.x` y `EF.1.7.x`.
- **Fuera de alcance:** el resto de los mapas curriculares específicos y completos de Educación Cultural y Artística (capítulo 9, con su propia numeración de bloques) y Educación Física (capítulo 10, con su propia numeración de bloques) para subnivel 1 — currículos con más contenido del que el integrador cita. Candidato natural para un change hermano posterior.

**D5 — `objetivos` en las destrezas de Preparatoria representa lo que el mapa curricular del ámbito declara para esa área, no una correspondencia individual inferida por destreza.**
Verificado en la fuente: cada página de ámbito (secciones 8.1-8.7) trae una sola sección "Objetivos" por página, que aplica a esa área dentro de ese ámbito — no hay una tabla que vincule cada destreza con un objetivo específico (a diferencia de los archivos de subniveles 2-5, donde `objetivos` sí es una correspondencia 1-a-1 con la destreza). Regla adoptada: `objetivos` de una destreza de Preparatoria contiene únicamente los objetivos de su misma área impresos en la página del ámbito donde esa destreza está publicada; si esa área no tiene ningún objetivo impreso en esa página (p. ej. `CN` en el ámbito 1, o `EFL` en cualquier ámbito — no se imprime ningún `O.EFL.1.x` en todo el capítulo 8), `objetivos: []`. Un mismo conjunto de objetivos puede repetirse entre varias destrezas de un mismo ámbito y área — eso refleja la estructura de la fuente, no una duplicación por error ni una inferencia nueva. No se debe "corregir" esto después intentando repartir los objetivos destreza por destreza sin una fuente que lo respalde explícitamente.

**D6 — PCA debe permitir subnivel 1 para cualquier área que ahora tenga destrezas ahí, sin caso especial ligado a CAI.**
Con este cambio, `M`, `CN`, `CS`, `LL`, `EFL`, `EF` y `ECA` pasan a tener destrezas reales en `subnivel: 1` (antes solo `CAI` las tenía, de ahí el atajo `area === "CAI" ? SUBNIVELES_CAI : SUBNIVELES` en `app/planificacion-anual/index.tsx:484`). Ese atajo deja de ser correcto. La implementación concreta (extender `SUBNIVELES`, usar `obtenerSubnivelesDeArea(area)` que ya existe en `data/index.ts:108`, u otro mecanismo) se decide en la tarea correspondiente de `tasks.md`, revisando primero qué hace hoy ese picker.

**D7 — `bloque` significa cosas distintas según el subnivel dentro de la misma área; nunca deben resolverse con la misma función.**
Verificado: `AREAS_INFO["CN"].bloques[1]` ya es `"Los seres vivos y su ambiente"` (para subniveles 2+), mientras que `CN` bloque 1 en subnivel 1 corresponde al ámbito "Identidad y Autonomía" — dos espacios de nombres distintos que comparten número por coincidencia. Colisiones similares existen en `CS` (bloque 1 = "Historia e identidad" vs. ámbito 1; bloque 2 = "Los seres humanos en el espacio" vs. ámbito 2 "Convivencia"; bloque 3 = "La convivencia" vs. ámbito 3) y ausencias lisas en `M`/`LL` (no tienen bloque 4/5 definidos hoy, caerían al fallback genérico `Bloque N`). `obtenerNombreBloque(area, bloque)` (`data/index.ts:135`) resuelve vía `AREAS_INFO[area].bloques[bloque]`, así que llamarla con una destreza de `subnivel: 1` devolvería el nombre equivocado o el genérico. Ninguna pantalla ni función debe usar `obtenerNombreBloque` ni `AREAS_INFO[area].bloques` para nombrar el bloque de una destreza cuando `subnivel === 1` — debe usar `AMBITOS_PREPARATORIA[bloque]` en su lugar. `tasks.md` incluye una tarea de verificación explícita para esto.

**D8 — La pantalla de Preparatoria reutiliza el backend y la exportación genéricos de EGB (`topics.generateWeekPlan`/`generateAi`, `lib/semanal-word-generator.ts`), no el vertical específico de Inicial.**
`app/planificar-inicial/index.tsx` no es solo un patrón de selector de ámbitos — trae consigo un procedimiento tRPC propio (`server/inicial-router.ts`, `inicial.generateClase`, con estructura INICIO/DESARROLLO/CIERRE y etiquetas DUA por actividad), una plantilla Word propia (`lib/plan-inicial-word-generator.ts`) y tipos propios (`data/types-inicial.ts`). Replicar todo eso para Preparatoria sería construir tres subsistemas nuevos sin evidencia de que la estructura pedagógica de Inicial (pensada para 3-5 años) sea la correcta para 1.° EGB. Decisión: Preparatoria sigue siendo EGB — reutiliza la infraestructura genérica ya usada por `planificar-semanal` (`trpc.topics.generateWeekPlan`, `trpc.topics.generateAi`, `lib/semanal-word-generator.ts`). Lo único que cambia respecto al flujo genérico es la **entrada curricular**: en vez de elegir una asignatura y ver sus destrezas, el docente elige un ámbito y la pantalla reúne las destrezas oficiales de todas las áreas asociadas a ese ámbito (ver D1, D3) — sin alterar `area`, código ni datos de origen de ninguna destreza. El resto del flujo (generación, edición, exportación) es exactamente el que ya usa `planificar-semanal`.
Esta decisión no cierra la puerta a una plantilla o metodología documental propia de Preparatoria en el futuro — solo evita construirla ahora sin un requisito pedagógico o normativo explícito que la exija. Si ese requisito aparece, amerita su propio change y su propia decisión de diseño, no una extensión de este.
*Alternativa descartada:* replicar el vertical completo de Inicial (router + plantilla Word + tipos propios) — descartada por alcance desproporcionado y falta de evidencia de que la estructura pedagógica de Inicial aplique a Preparatoria.

## Risks / Trade-offs

- **[Riesgo] Colisión de significado del campo `bloque` entre subnivel 1 (ámbito) y subniveles 2-5 (bloque temático regular) dentro de la misma área.** → Mitigación: D7; tarea explícita de verificación en `tasks.md` para que ningún camino de código use `obtenerNombreBloque`/`AREAS_INFO[area].bloques` con destrezas de subnivel 1.
- **[Riesgo] La vista agrupa destrezas de varias áreas por ámbito; un bug de filtrado podría mezclar destrezas con el bloque correcto pero del área equivocada, o perder alguna.** → Mitigación: la pantalla filtra explícitamente `subnivel === 1 && bloque === ámbitoSeleccionado` sobre `TODAS_LAS_DESTREZAS` sin asumir qué área corresponde a qué ámbito; la tarea de regresión verifica que cada ámbito devuelve exactamente las áreas listadas en la tabla de Context (punto 5).
- **[Riesgo] Duplicar el patrón de `AmbitoCard` entre `planificar-inicial` y `planificar-preparatoria` genera drift de UI a futuro.** → Mitigación: aceptado como trade-off deliberado (Non-Goals); la extracción a componente compartido queda como mejora futura explícita.
- **[Riesgo] Quitar Preparatoria de `planificar-semanal` es una regresión visible para cualquier plan ya creado desde esa pantalla genérica.** → Mitigación: cambio de UX deliberado (marcado **BREAKING** en proposal.md); no hay migración de datos porque no había destrezas reales de subnivel 1 en esas áreas antes de este cambio.
- **[Riesgo] Transcribir mal un código, bloque o área al copiar desde el PDF mezclaría datos de Preparatoria con los de subniveles 2-5 de la misma área.** → Mitigación: tarea de verificación explícita en `tasks.md` que confirma código, área, subnivel y bloque de cada destreza transcrita contra la tabla de Context antes de dar la tarea por completa.
- **[Riesgo confirmado] La fuente imprime el código `M.1.4.23` y `M.1.4.41` dos veces cada uno, para destrezas distintas** (probable error de imprenta del PDF). Rompía la unicidad de código de la que depende `buscarPorCodigo` y los enlaces profundos (`/destreza/[codigo]`), detectado por `__tests__/data.test.ts` ("los códigos deben ser únicos"). → Mitigación: el segundo código de cada par se desambigua con sufijo `b` (`M.1.4.23b`, `M.1.4.41b`) — el texto de la destreza no se altera, solo la clave técnica; documentado en `data/destrezas-matematica.ts`.

## Migration Plan

1. Definir `AMBITOS_PREPARATORIA` (estructura de presentación) — aditivo, no toca `AREAS_INFO`.
2. Agregar destrezas `subnivel: 1` a los archivos de datos existentes de cada área — aditivo, no modifica destrezas de otros subniveles.
3. Pantalla nueva (`app/planificar-preparatoria/index.tsx`) — aditiva, sin rutas existentes afectadas.
4. Navegación (`app/(tabs)/index.tsx` card nueva) — aditiva.
5. Remociones (`planificar-semanal` subnivel 1, subtítulo de `explorar`, atajo `area === "CAI"` de PCA) — al final, una vez que la pantalla dedicada ya existe y es navegable.
6. Rollback: cada paso es independiente y revertible por archivo; no hay migración de datos persistidos.

## Open Questions

- Ubicación exacta de `AMBITOS_PREPARATORIA` (`data/types.ts` vs. archivo dedicado) — no bloqueante, se decide en la tarea correspondiente.
- Mecanismo exacto para extender subnivel 1 en el picker de PCA (D5) — se resuelve en `tasks.md` al revisar el código real de `planificacion-anual`.
