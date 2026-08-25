## 1. Estructura de ámbitos (presentación, no área nueva)

- [x] 1.1 Definir `AMBITOS_PREPARATORIA: Record<number, string>` en `data/types.ts` (o archivo dedicado) con los 7 nombres verificados contra las secciones 8.1-8.7 del currículo priorizado 2025 (ver `design.md` D3) — **no** agregar `"PREP"` al tipo `Area` ni a `AREAS_INFO`
- [x] 1.2 Confirmar que ningún `AREAS_INFO[area].bloques` existente (`M`, `CN`, `CS`, `LL`, `EFL`, `EF`, `ECA`) se modifica para acomodar los nombres de ámbito (ver `design.md` D6)

## 2. Datos: destrezas de subnivel 1 en las áreas existentes

Transcribir desde las secciones 8.1-8.7 (pp.20-38) del currículo priorizado 2025 (fuente ya extraída), respetando exactamente código, área, bloque y descripción de cada destreza — no inventar ni completar destrezas que no estén en la fuente. Regla de `objetivos`: ver `design.md` D5 — solo los objetivos de la misma área impresos en la página de ese ámbito; `[]` si no hay ninguno impreso ahí (no inferir correspondencia 1-a-1).

- [x] 2.1 Agregar a `data/destrezas-cn.ts` las destrezas `CN.1.1.x` (ámbito 1, bloque 1) y `CN.1.3.x` (ámbito 3, bloque 3), con `subnivel: 1`
- [x] 2.2 Agregar a `data/destrezas-cs.ts` las destrezas `CS.1.1.x` (bloque 1), `CS.1.2.x` (bloque 2) y `CS.1.3.x` (bloque 3), con `subnivel: 1`
- [x] 2.3 Agregar a `data/destrezas-matematica.ts` las destrezas `M.1.4.x` (bloque 4), con `subnivel: 1`
- [x] 2.4 Agregar a `data/destrezas-lengua.ts` las destrezas `LL.1.5.x` (bloque 5), con `subnivel: 1`
- [x] 2.5 Agregar a `data/destrezas-ingles.ts` las destrezas `EFL.1.1.x` (bloque 1), `EFL.1.2.x` (bloque 2), `EFL.1.3.x` (bloque 3), `EFL.1.4.x` (bloque 4), `EFL.1.5.x` (bloque 5), `EFL.1.6.x` (bloque 6) y `EFL.1.7.x` (bloque 7) — EFL aparece en los 7 ámbitos, no solo en 1 y 6, con `subnivel: 1`
- [x] 2.6 Agregar a `data/destrezas-eca.ts` las destrezas `ECA.1.6.x` citadas en el ámbito 6, con `subnivel: 1`, `bloque: 6` — solo las que el currículo integrador cita explícitamente ahí (no el mapa completo del capítulo 9, fuera de alcance por D4)
- [x] 2.7 Agregar a `data/destrezas-ef.ts` las destrezas `EF.1.7.x` citadas en el ámbito 7, con `subnivel: 1`, `bloque: 7` — solo las que el currículo integrador cita explícitamente ahí (no el mapa completo del capítulo 10, fuera de alcance por D4)
- [x] 2.8 Verificar, para cada destreza transcrita en 2.1-2.7: el código coincide exactamente con el de la fuente, el área es la correcta según la tabla de `design.md` (Context, punto 5), el `subnivel` es `1`, y el `bloque` es el número de ámbito correspondiente — ninguna destreza recibe un código inventado tipo `PREP.*`. `pnpm check` confirma que los 7 archivos compilan sin errores nuevos (los ~50 errores preexistentes del proyecto no cambian con o sin este cambio, verificado con `git stash`).
- [x] 2.9 Confirmar que `filtrarPorAreaSubnivelBloque(area, 1, bloque)` (ya existente en `data/index.ts`) devuelve las destrezas esperadas para cada combinación área+bloque de la tabla — no se necesita una función de filtrado nueva por área

## 3. Pantalla de planificación de Preparatoria

Reutiliza el backend y la exportación genéricos de EGB (`trpc.topics.generateWeekPlan`, `trpc.topics.generateAi`, `lib/semanal-word-generator.ts`) — NO el vertical específico de Inicial (`server/inicial-router.ts`, `lib/plan-inicial-word-generator.ts`, `data/types-inicial.ts`). Ver `design.md` D8. Del patrón de `planificar-inicial` se reutiliza únicamente el patrón visual (selector de ámbito, tarjetas), no su backend.

- [x] 3.1 Leer `app/planificar-semanal/index.tsx` completo para identificar exactamente qué estado, mutaciones y componentes reutilizar tal cual (institución/docente/grado, `generateWeekPlan`/`generateAi`, llamada a `semanal-word-generator.ts`) antes de escribir la pantalla nueva — confirmado además que `planificar-semanal` no exporta el Word directamente: guarda vía `usePlanificaciones().addSemana` y navega a `/ver-semana/[id]`, que sí exporta. Reutilizar ese mismo flujo de guardado reutiliza la exportación gratis, sin escribir código de exportación nuevo.
- [x] 3.2 Crear `app/planificar-preparatoria/index.tsx` reutilizando esos mismos hooks/mutaciones de `planificar-semanal`, con la UI de selección de ámbitos inspirada visualmente en `app/planificar-inicial/index.tsx` (selector de ámbito, tarjetas repetibles)
- [x] 3.3 Fijar `subnivel = 1` como constante — no reutilizar la inferencia `grado.includes("1")` de `planificar-inicial`
- [x] 3.4 Usar `AMBITOS_PREPARATORIA` (no `AREAS_INFO[algunaArea].bloques`) como fuente de nombres de ámbito en el selector
- [x] 3.5 Implementar el filtrado de destrezas por ámbito sobre `TODAS_LAS_DESTREZAS` directamente (`subnivel === 1 && bloque === ambitoSeleccionado`), sin restringir por una sola `area` — un ámbito puede reunir destrezas de varias áreas a la vez
- [x] 3.6 Al armar el input para `generateWeekPlan`/`generateAi` y para el guardado (`buildSemana`), conservar `area` y `codigo` originales de cada destreza seleccionada (no reclasificar bajo un área ficticia tipo `"PREP"`) — confirma el requisito de integridad de `specs/planificacion-preparatoria/spec.md`
- [x] 3.7 Registrar la ruta nueva en `app/_layout.tsx` (`<Stack.Screen name="planificar-preparatoria/index" .../>`, junto a `planificar-inicial`)

## 4. Navegación e inicio

- [x] 4.1 Agregar en `app/(tabs)/index.tsx` una card "Planificación Preparatoria" que navegue a `/planificar-preparatoria`, ubicada junto a la card de Inicial
- [x] 4.2 Quitar "Preparatoria" del subtítulo de la sección EGB en `app/(tabs)/index.tsx` (línea con "Preparatoria · Elemental · Media · Superior")
- [x] 4.3 Quitar "Preparatoria" del subtítulo de la sección EGB en `app/(tabs)/explorar.tsx`

## 5. Remoción de Preparatoria de la planificación semanal genérica

- [x] 5.1 Quitar subnivel 1 del selector de subnivel en `app/planificar-semanal/index.tsx`
- [x] 5.2 Revisar si la lógica de chips de grado (`subnivel === 1 ? ["1er EGB"] : ...`, única ocurrencia de `subnivel === 1` en el proyecto antes de este cambio) puede simplificarse una vez que subnivel 1 ya no llega a ese selector — simplificada, la rama `subnivel === 1` era código muerto
- [x] 5.3 Confirmar que las áreas EGB (M, LL, CN, CS, EF, ECA, EFL) siguen funcionando sin cambios para subniveles 2-5 — las nuevas destrezas de subnivel 1 no deben aparecer mezcladas ahí. `pnpm check` no reporta errores nuevos en el archivo tras el cambio (mismos errores preexistentes que antes)

## 6. Planificación anual (PCA)

- [x] 6.1 Revisar el código real de `app/planificacion-anual/index.tsx` (selector de área, `SUBNIVELES`/`SUBNIVELES_CAI`, línea con `area === "CAI" ? SUBNIVELES_CAI : SUBNIVELES`) para decidir el mecanismo concreto de la tarea 6.2 (ver `design.md` D5, Open Questions) — mecanismo elegido: lista estática nueva `SUBNIVELES_CON_PREPARATORIA`, aplicada solo a `AREAS_CON_PREPARATORIA` (M, LL, CN, CS, EF, ECA, EFL), no a las áreas exclusivas de BGU
- [x] 6.2 Ajustar el picker de subnivel para que Preparatoria (subnivel 1) aparezca como opción cuando el área seleccionada sea cualquiera de `M`, `CN`, `CS`, `LL`, `EFL`, `EF`, `ECA` (no solo `CAI`)
- [x] 6.3 Confirmar que seleccionar CAI en PCA para cualquier subnivel (1 a 5) sigue funcionando exactamente igual que antes — `SUBNIVELES_CAI` no se tocó; `pnpm check` no reporta errores nuevos en el archivo

## 7. Verificación y regresión

- [x] 7.1 Confirmar que seleccionar CAI en cualquier subnivel (1 a 5) produce exactamente el mismo resultado que antes de este cambio — `data/destrezas-kai.ts` no aparece en el diff del cambio (confirmado con `git diff --name-only`); `SUBNIVELES_CAI` en `planificacion-anual` no se modificó
- [x] 7.2 Confirmar que la planificación de Educación Inicial (subniveles -1 y 0) no cambió de comportamiento — `app/planificar-inicial/index.tsx`, `data/destrezas-inicial.ts` y `data/types-inicial.ts` no aparecen en el diff del cambio
- [x] 7.3 Confirmar que Preparatoria ya no es alcanzable desde `planificar-semanal` ni desde el listado de Explorar bajo EGB — subnivel 1 fuera del selector de `planificar-semanal`; subtítulo de `explorar.tsx` sin "Preparatoria"
- [x] 7.4 Confirmar que ninguna pantalla o función usa `obtenerNombreBloque`/`AREAS_INFO[area].bloques` para nombrar el bloque de una destreza de subnivel 1 (ver `design.md` D7) — deben usar `AMBITOS_PREPARATORIA`. Hallazgo real durante la verificación: `app/(tabs)/explorar.tsx` permitía navegar por subnivel dentro de cualquier área (incluida ahora Preparatoria) y resolvía el nombre del bloque de forma genérica — corregido excluyendo subnivel 1 de ese recorrido (tiene su propia pantalla). `app/destreza/[codigo].tsx` y `app/planificar/[codigo].tsx` sí podían mostrar una destreza de Preparatoria (por búsqueda/deep link) con el nombre de bloque equivocado — corregido creando `obtenerNombreBloqueDestreza(destreza)` en `data/index.ts` (subnivel-aware) y usándolo en ambos. `app/ver-plan/[id].tsx` importa `obtenerNombreBloque` pero nunca lo invoca — sin riesgo, sin cambios. `lib/semanal-word-generator.ts` y `app/ver-semana/[id].tsx` no usan `obtenerNombreBloque` en absoluto — la exportación ya recibe el nombre de ámbito resuelto explícitamente desde `planificar-preparatoria`.
- [x] 7.5 Confirmar que seleccionar Educación Física o Educación Cultural y Artística como asignatura independiente en subnivel 1 (fuera de la vista de ámbitos) solo muestra las destrezas transcritas en 2.6/2.7, sin presentarlas como el currículo específico completo — no aplica: subnivel 1 ya no es alcanzable ni en `planificar-semanal` ni en el recorrido por área de `explorar.tsx` (7.3, 7.4), así que EF/ECA de Preparatoria solo se ven dentro de `planificar-preparatoria`, agrupadas por ámbito 6/7 junto con las demás áreas de ese ámbito — nunca presentadas como si fueran el currículo específico completo
- [x] 7.6 Ejecutar la suite de tests existente (`__tests__/data.test.ts` y relacionados) y actualizar solo lo que quede roto por las destrezas nuevas de subnivel 1, sin tocar expectativas de CAI o Inicial. Resultado: 3 fallos reales causados por este cambio, corregidos —
  (1) "los códigos deben ser únicos": la fuente repetía `M.1.4.23` y `M.1.4.41` para destrezas distintas; desambiguado con sufijo `b` (ver `design.md` Riesgos), sin alterar el texto de ninguna destreza.
  (2) `existeAreaSubnivel` "refleja la cobertura real del catálogo" en `__tests__/curriculo-prerrequisitos.test.ts`: la aserción `existeAreaSubnivel("LL", 1) === false` quedó desactualizada (LL ahora sí tiene destrezas en subnivel 1); actualizada a `true` y ampliada con M/CN/CS/EF/ECA/EFL en subnivel 1.
  Un fallo preexistente y no relacionado (`data.test.ts` "cada destreza debe tener la estructura correcta", por los subniveles -1/0 de Inicial) se confirmó con `git stash` que ya fallaba antes de este cambio — no se toca, fuera de alcance. Los fallos de `payphone-*` son de entorno (variables de entorno / red), no relacionados.
