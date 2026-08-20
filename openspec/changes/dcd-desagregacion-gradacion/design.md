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

**Non-Goals:**
- Consumir la desagregación en PCA/PCT/semanal (trabajo posterior).
- Convertir `DcdMultiSelector` en el dueño de la pedagogía de gradación (se agrega un panel hermano).
- Mezclar desagregación con adaptación curricular (`curricular_adaptations` / `DcdAdaptada` se mantienen separados).

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

### 7. UI: panel hermano `DcdDesagregacionPanel`, selector sigue tonto
`DcdMultiSelector` recibe un prop opcional `gradoContexto`; cuando está presente y hay desagregación para la DCD+grado, muestra la versión graduada como la DCD efectiva. La generación y edición viven en `DcdDesagregacionPanel` (a un lado del selector): elige DCD → resuelve `{codigoDCD, grado}` → si existe fila la muestra, si no ofrece "Desagregar por grados" → IA → revisa/edita → guarda.
- **Por qué**: respeta la decisión del usuario de no sobrecargar el selector y de no pedir el grado si el contexto ya lo conoce.

### 8. Tipos en `data/types.ts`
`DcdDesagregacion` (fila persistida), `EstadoDesagregacion = "generado" | "editado" | "aprobado"`, `GradosDesagregacion` y `gradosDeSubnivel(subnivel): number[] | null`. No se reutiliza `GradoAdaptacion` ni `DcdAdaptada`.

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