## Why

El catálogo curricular guarda cada DCD con criterio de desempeño por **subnivel** (2do–4to, 5to–7mo, 8vo–10mo, BGU), pero la normativa MINEDUC exige que los docentes **desagreguen/gradúen** cada DCD y su indicador de evaluación para cada grado del subnivel, dejando la versión completa en el último grado. Hoy el selector de destrezas (`DcdMultiSelector`) muestra la DCD oficial sin versión por grado, lo que obliga al docente a hacer esa gradación manualmente y rompe la compatibilidad con la matriz oficial de desagregación que usan las planificaciones (PCA/PCT/semanal).

## What Changes

- **Nuevo recurso curricular "desagregación por grados"**: dado un par DCD + indicador de evaluación del catálogo oficial, la IA genera, por cada grado del subnivel, la DCD graduada y el indicador graduado. El último grado del subnivel conserva la DCD e indicador **completos** (texto oficial).
- **La DCD/indicador oficial nunca se modifican**: la desagregación es una *derivación editable* que referencia al original; no sustituye el catálogo.
- **Generación con IA restringida pedagógicamente**: la IA recibe la DCD original, el grado destino, el grado máximo del subnivel, el proceso cognitivo esperado (basado en Marzano) y restricciones de contenido; no puede introducir conocimientos que no estén contenidos en la DCD original.
- **Persistencia y edición docente**: flujo "Desagregar por grados" → la IA propone → el docente revisa/edita → se guarda. Cada fila guarda origen (`original_dcd`, `grado`, `dcd_graduada`, `indicador_original`, `indicador_graduado`) y un `estado` (`generado | editado | aprobado`).
- **Reutilización**: si ya existe una desagregación para la DCD+grado, se muestra la guardada; solo se genera si no existe.
- **Desagregación opcional y contextual a la selección, solo en planificaciones**: la acción "Desagregar por grado" aparece en `DcdMultiSelector` (flujos de planificación) después de seleccionar una DCD y antes de confirmar la selección. El docente puede continuar con la DCD oficial sin generar ni guardar ninguna desagregación. Al solicitarla, se genera el ladder completo del subnivel y el docente elige la versión de su grado. La acción SHALL NOT aparecer en el flujo CNC.
- **La selección distingue el origen**: la DCD seleccionada queda como `{ codigo, enunciado, origen: "oficial" }` o, si se usó una versión graduada, `{ codigo, enunciado, origen: "desagregada", grado }`.
- **Separación conceptual**: se introduce el concepto de *desagregación/gradación* como recurso distinto de la *adaptación curricular* (no se reutiliza `DcdAdaptada`).
- **Consumo en PCA/PCT/semanal**: las planificaciones y sus documentos Word/PDF usan la versión graduada de la DCD cuando la selección es `origen: "desagregada"`, y la DCD oficial en cualquier otro caso (fallback). En PCA/PCT la selección ya se guarda como `{codigo, enunciado}`; en semanal y plan de unidad se añade la descripción efectiva con fallback al texto oficial.

## Capabilities

### New Capabilities

- `dcd-desagregacion-gradacion`: recurso curricular de desagregación/gradación de DCD e indicadores de evaluación por grado, con generación por IA restringida, edición docente, persistencia, reutilización y resolución automática por grado de contexto.

### Modified Capabilities

- Ninguna: no cambia el comportamiento de capacidades existentes; se agrega una nueva capacidad.

## Impact

- **Catálogo** (`data/`): no se modifica; la desagregación referencia `Destreza` por `codigo`. Se agregan tipos nuevos para DCD/indicador graduados.
- **Generación IA** (`server/_core/llm.ts`): se usa `invokeLLM` con esquema JSON estricto (`outputSchema`) para la propuesta de desagregación.
- **Persistencia**: nueva tabla (drizzle) para las filas de desagregación por grado.
- **UI** (`components/DcdMultiSelector.tsx`): se integra la resolución por grado y la acción "Desagregar por grados" sin cargar al componente de lógica pedagógica, solo en los flujos de planificación.
- **Consumidores** (`lib/pca-word-generator.ts`, `lib/pca-trimestral-word-generator.ts`, `lib/semanal-word-generator.ts`, `lib/plan-word-generator.ts`): usan la descripción efectiva de la DCD (graduada si la selección es desagregada; oficial como fallback).
- **Reutilización de conocimiento**: se apoya en `taxonomia-marzano.ts` para el proceso cognitivo esperado por grado.
- **Exclusiones**: el flujo CNC no ofrece desagregación y no consume versiones graduadas.