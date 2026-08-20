## Why

El catálogo curricular guarda cada DCD con criterio de desempeño por **subnivel** (2do–4to, 5to–7mo, 8vo–10mo, BGU), pero la normativa MINEDUC exige que los docentes **desagreguen/gradúen** cada DCD y su indicador de evaluación para cada grado del subnivel, dejando la versión completa en el último grado. Hoy el selector de destrezas (`DcdMultiSelector`) muestra la DCD oficial sin versión por grado, lo que obliga al docente a hacer esa gradación manualmente y rompe la compatibilidad con la matriz oficial de desagregación que usan las planificaciones (PCA/PCT/semanal).

## What Changes

- **Nuevo recurso curricular "desagregación por grados"**: dado un par DCD + indicador de evaluación del catálogo oficial, la IA genera, por cada grado del subnivel, la DCD graduada y el indicador graduado. El último grado del subnivel conserva la DCD e indicador **completos** (texto oficial).
- **La DCD/indicador oficial nunca se modifican**: la desagregación es una *derivación editable* que referencia al original; no sustituye el catálogo.
- **Generación con IA restringida pedagógicamente**: la IA recibe la DCD original, el grado destino, el grado máximo del subnivel, el proceso cognitivo esperado (basado en Marzano) y restricciones de contenido; no puede introducir conocimientos que no estén contenidos en la DCD original.
- **Persistencia y edición docente**: flujo "Desagregar por grados" → la IA propone → el docente revisa/edita → se guarda. Cada fila guarda origen (`original_dcd`, `grado`, `dcd_graduada`, `indicador_original`, `indicador_graduado`) y un `estado` (`generado | editado | aprobado`).
- **Reutilización**: si ya existe una desagregación para la DCD+grado, se muestra la guardada; solo se genera si no existe.
- **Selección automática según el grado del contexto**: si la planificación ya conoce el grado (p. ej. 6.º EGB), el sistema resuelve la versión de 6.º sin pedirlo manualmente al docente.
- **Separación conceptual**: se introduce el concepto de *desagregación/gradación* como recurso distinto de la *adaptación curricular* (no se reutiliza `DcdAdaptada`).
- **Alcance inicial acotado**: se construye el recurso curricular. Consumir la desagregación en PCA/PCT/semanal queda como trabajo posterior fuera de este cambio.

## Capabilities

### New Capabilities

- `dcd-desagregacion-gradacion`: recurso curricular de desagregación/gradación de DCD e indicadores de evaluación por grado, con generación por IA restringida, edición docente, persistencia, reutilización y resolución automática por grado de contexto.

### Modified Capabilities

- Ninguna: no cambia el comportamiento de capacidades existentes; se agrega una nueva capacidad.

## Impact

- **Catálogo** (`data/`): no se modifica; la desagregación referencia `Destreza` por `codigo`. Se agregan tipos nuevos para DCD/indicador graduados.
- **Generación IA** (`server/_core/llm.ts`): se usa `invokeLLM` con esquema JSON estricto (`outputSchema`) para la propuesta de desagregación.
- **Persistencia**: nueva tabla (drizzle) para las filas de desagregación por grado.
- **UI** (`components/DcdMultiSelector.tsx`): se integra la resolución por grado y la acción "Desagregar por grados" sin cargar al componente de lógica pedagógica.
- **Reutilización de conocimiento**: se apoya en `taxonomia-marzano.ts` para el proceso cognitivo esperado por grado.
- **Exclusiones**: la planificación semanal, PCA y PCT solo consumirán la desagregación después de este cambio, no dentro de él.