## Context

- El catálogo curricular (`data/destrezas-*.ts`) indexa cada DCD por `subnivel` (`1..5`), no por grado. `SUBNIVEL_GRADOS` mapea subnivel → rango (`2 → 2do-4to`, `3 → 5to-7mo`, `4 → 8vo-10mo`, `5 → 1ro-3ro BGU`). `Destreza` expone `descripcion`, `criteriosEvaluacion` e `indicadoresEvaluacion` (array) y `buscarPorCodigo(codigo)` resuelve una DCD por código.
- `DcdMultiSelector` guarda solo `{codigo, enunciado}`; no tiene noción de grado ni de desagregación.
- La generación por IA vive en `server/_core/llm.ts`: `invokeLLM` (gpt-4o, retries, `response_format` JSON estricto con `outputSchema`). Patrón de uso en `topics-router.ts` (system prompt pedagógico + JSON + `repairJson`).
- Persistencia best-effort por sesión sigue el patrón de `curricular_adaptations` (`drizzle/schema.ts:264`): `sessionId` como clave de dueño, campos de contexto, `aiResult` en JSON, `version`, `status`.
- Existe `taxonomia-marzano.ts` con verbos por nivel cognitivo, reutilizable para graduar la complejidad.

Ver proposal.md — Why para la motivación y specs para el contrato de comportamiento.

## Goals / Non-Goals

**Goals:**
- Modelo de datos para la desagregación de una DCD + su indicador por grado, independiente del catálogo oficial.
- Generación por IA con esquema JSON estricto y restricciones pedagógicas (no introducir conocimiento fuera de la DCD original).
- El último grado del subnivel se copia exacto del catálogo, sin pasar por la IA.
- Resolución automática del grado por contexto; reutilización de filas ya guardadas; edición docente con `estado`.
- Integración ligera en `DcdMultiSelector` (resolver versión por grado) sin cargar al componente de lógica pedagógica.
- Consumo de la descripción efectiva (graduada u oficial) en PCA, PCT, semanal y plan de unidad.

**Non-Goals:**
- Ofrecer desagregación en el flujo CNC (se mantiene intacto, sin botón ni resolución por grado).
- Convertir `DcdMultiSelector` en el dueño de la pedagogía de gradación (se agrega un panel hermano).
- Mezclar desagregación con adaptación curricular (`curricular_adaptations` / `DcdAdaptada` se mantienen separados).
- Rediseñar los generadores Word/PDF: solo consumen la descripción efectiva ya poblada en el plan.

## Decisions

### 1. Nueva tabla `dcd_desagregaciones` (patrón `curricular_adaptations`)
Una fila por (sessionId, codigoDCD, grado). Columnas: `sessionId`, `codigoDCD`, `descripcionDCD` (snapshot oficial), `subnivel`, `grado` (p. ej. `"2"`, `"5"`, `"8"`), `gradoMaximo`, `indicadorOriginal`, `dcdGraduada`, `indicadorGraduado`, `procesoCognitivo`, `estado` (`generado | editado | aprobado`), `version`, `aiResult` (JSON crudo de la IA), timestamps. `UNIQUE (sessionId, codigoDCD, grado)` habilita la reutilización.
- **Por qué**: replica el patrón probado de `curricular_adaptations` (respaldo best-effort, app funcional si la nube falla) y da reutilización por sesión.
- **Alternativa descartada**: regenerar en cada apertura (el usuario la descartó: variaciones entre generaciones). Guardar la DCD completa en el plan (repetiría datos y rompería la reutilización).

### 2. El indicador como campo propio, no array
`indicadoresEvaluacion` es un array en el catálogo, pero la matriz oficial desagrega un indicador específico por DCD. La fila guarda `indicadorOriginal` (texto del indicador asociado a esa DCD, normalmente el primero/único) y `indicadorGraduado`.
- **Por qué**: la gradación en paralelo del spec exige un par 1:1 DCD↔indicador.
- **Riesgo**: si una DCD tiene varios indicadores, se elige el principal. Se muestra en UI cuál se desagrega.

### 3. Motor de gradación: copia exacta en el último grado, IA solo en los intermedios
`gradosDeSubnivel(subnivel)` (función pura en `data/index.ts`) devuelve `[2,3,4] | [5,6,7] | [8,9,10] | [1,2,3]` (BGU) o `null` para Preparatoria. La versión del último grado NO invoca la IA: se copia `descripcion` e `indicadorOriginal` del catálogo, garantizando coincidencia carácter por carácter con el spec. Solo los grados intermedios pasan por `invokeLLM`.
- **Por qué**: el spec exige el último grado idéntico al oficial; no se confía en el modelo para eso, se garantiza en código.

### 4. Una sola llamada por desagregación (todas las filas), no una por grado
`POST /desagregar` recibe `{ codigoDCD, sessionId }` y produce el array completo de grados en una sola invocación con `outputSchema` estricto (JSON de filas). El servidor llena el último grado con el texto oficial y persiste todo el ladder. El botón "Desagregar por grados" genera la propuesta completa (fiel a la matriz oficial de columnas por grado), y el docente revisa/edita cada fila antes de guardar.
- **Por qué**: UX coherente con la matriz oficial y menor latencia/costos que N llamadas.
- **Alternativa descartada**: una llamada por grado (más control granular pero más lento y con más drift entre grados).

### 5. Prompt con restricciones pedagógicas, apoyado en Marzano
El prompt recibe: DCD original, indicador original, lista de grados del subnivel, grado destino, proceso cognitivo esperado (verbos de `taxonomia-marzano.ts`), y la restricción explícita de NO introducir conocimientos fuera de la DCD original. El `system prompt` prohíbe contenido nuevo; un post-proceso valida que la propuesta no exceda la longitud del original ni introduzca términos ausentes (advertencia, no bloqueo duro, porque la edición docente es el control final).
- **Por qué**: controla el riesgo de alucinación pedagógica que describió el usuario (p. ej. "analizar cambios hormonales" en 2.º) sin sacrificar flexibilidad.

### 6. Nuevo router `server/dcd-desagregacion-router.ts`
Endpoints: `GET /api/dcd-desagregaciones?codigo=&grado=` (resolver existente), `POST /api/dcd-desagregaciones/generar` (llamada IA + persistencia), `PATCH /api/dcd-desagregaciones/:id` (edición docente → `estado=editado`), `POST /api/dcd-desagregaciones/:id/aprobar`. Autenticación por `sessionId` (mismo esquema que adaptaciones).
- **Por qué**: separa la lógica pedagógica del servidor de la UI; `DcdMultiSelector` queda tonto.

### 7. UI: botón opcional en el selector (solo planificación), panel hermano `DcdDesagregacionPanel`
`DcdMultiSelector` sigue responsable de seleccionar, mostrar la opción de desagregar y devolver la selección; no genera ni edita. Al seleccionar una DCD muestra dos rutas: "Desagregar por grado" y "Seleccionar DCD oficial". La generación, revisión, edición, guardado y elección de versión viven en `DcdDesagregacionPanel` (panel hermano): resuelve `{codigoDCD, grado}` → si existe fila la muestra, si no genera el ladder completo → revisa/edita → guarda → "Usar esta versión".
- **Grado por contexto**: prop `gradoContexto` en el selector; si la planificación conoce el grado, el botón se etiqueta "Desagregar para N.º EGB" y la versión de ese grado queda preseleccionada en el ladder, pero la generación siempre produce el ladder completo.
- **Selector tonto**: el panel devuelve la versión elegida y el selector solo persiste la selección con su origen.
- **CNC excluido**: la acción de desagregar se activa solo cuando el selector se usa en un flujo de planificación (via prop/flag). En los flujos CNC el selector conserva exactamente el comportamiento actual, sin botón ni resolución por grado.
- **Por qué**: respeta las decisiones del usuario de no sobrecargar el selector, no pedir el grado si el contexto lo conoce, y mantener CNC intacto.

### 8. La selección distingue el origen en el modelo de datos
`DcdSeleccionada` (el tipo devuelto por `DcdMultiSelector`) se amplía con `origen: "oficial" | "desagregada"` y `grado?: number`. Sin desagregación: `{ codigo, enunciado, origen: "oficial" }`. Con versión graduada: `{ codigo, enunciado: <texto graduado>, origen: "desagregada", grado }`.
- **Por qué**: una planificación puede usar la DCD oficial aunque exista desagregación, y los consumidores posteriores (PCA/PCT/semanal) deben saber qué versión se usó.
- **Compatibilidad**: `origen` es opcional con default `"oficial"`, de modo que las selecciones existentes (p. ej. CNC) no cambian.

### 9. Tipos en `data/types.ts`
`DcdDesagregacion` (fila persistida), `EstadoDesagregacion = "generado" | "editado" | "aprobado"`, `GradosDesagregacion` y `gradosDeSubnivel(subnivel): number[] | null`. No se reutiliza `GradoAdaptacion` ni `DcdAdaptada`.

### 10. Consumo en los generadores: descripción efectiva con fallback
El consumo no rehace los generadores; solo les entrega la descripción efectiva ya poblada en el plan:
- **PCA/PCT** (`pca-word-generator.ts`, `pca-trimestral-word-generator.ts`): renderizan `dcdsSeleccionadas` como `codigo: enunciado`. Como `DcdSeleccionada` ya guarda el texto, al confirmar una versión graduada el selector guarda ese texto como `enunciado`; los generadores no cambian.
- **Semanal y plan de unidad** (`semanal-word-generator.ts:852`, `plan-word-generator.ts:693`): renderizan `destreza?.descripcion` del objeto oficial. Se añade `descripcionEfectiva` (o `enunciado`) a `HoraSemanal` y al plan de unidad, poblada desde la selección; el generador la prefiere y hace fallback a `destreza?.descripcion`.
- **CNC excluido**: conserva el objeto `Destreza` oficial sin campo efectivo.
- **Por qué**: los consumidores que ya guardan texto (PCA/PCT) no requieren cambios, y los que guardan el objeto oficial solo ganan un campo con fallback, minimizando el riesgo en los generadores Word/PDF.

#### Regla de fallback explícita
```ts
const descripcionEfectiva = destreza.descripcionEfectiva ?? destreza.descripcion;
```

| Situación                                   | Resultado    |
| ------------------------------------------- | ------------ |
| DCD oficial                                 | DCD oficial  |
| DCD desagregada                             | DCD graduada |
| No existe desagregación                     | DCD oficial  |
| Desagregación guardada pero no seleccionada | DCD oficial  |
| Selección graduada                          | DCD graduada |

#### `descripcionEfectiva` no es fuente de verdad
`descripcionEfectiva` SHALL tratarse como el **resultado materializado para el contexto de planificación**, no como una segunda fuente de verdad permanente. La fuente de verdad SHALL ser la triada: DCD oficial + selección curricular + desagregación guardada. Al editar la desagregación, las planificaciones existentes siguen mostrando la versión materializada que el docente confirmó; regenerar o corregir no reescribe retroactivamente los planes ya guardados.

## Risks / Trade-offs

- [La IA introduce contenido ajeno a la DCD] → Prompt con restricción + último grado copiado en código + edición docente + estado `aprobado` como control final.
- [El catálogo de BGU puede no tener DCD/indicador gradables para todas las áreas] → Se valida existencia (`buscarPorCodigo` + indicador) antes de ofrecer generación; si no hay indicador, se desagrega solo la DCD y se informa.
- [Varias DCDs del mismo subnivel generadas en lotes pueden derivar en filas parciales si la IA falla] → Transacción por fila, `aiResult` crudo guardado, regeneración selectiva por grado faltante; `repairJson` como respaldo.
- [Definición de "indicador principal" ambigua cuando el array tiene varios] → Se elige el primero y la UI muestra cuál se desagrega; se deja como decisión menor de implementación.

## Migration Plan

- Nueva migración drizzle para `dcd_desagregaciones` (tabla nueva, sin afectar existentes). No hay migración de datos.
- Rollback: drop de la tabla; la app sigue funcionando sin desagregación (selector vuelve al comportamiento actual).

## Open Questions

- Ninguna que bloquee specs/approach/tareas: la cobertura real de BGU en el catálogo y la elección del indicador principal se resuelven al implementar sin cambiar el contrato de comportamiento.