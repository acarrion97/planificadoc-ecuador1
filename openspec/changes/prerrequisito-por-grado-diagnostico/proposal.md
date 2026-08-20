## Why

La evaluación diagnóstica debe medir lo que el estudiante debería traer del **grado anterior** (p. ej. 2.° EGB → destrezas de 1.° EGB), para que la retroalimentación de arrastre sea correcta. El resolvedor actual de prerrequisitos (`lib/curriculo-prerrequisitos.ts`) opera por **subnivel** (`subnivel - 1`), lo que solo acierta en el primer grado de cada subnivel: en 3.°, 4.°, 6.°, 7.°, 9.°, 10.° EGB y 2.°, 3.° BGU sugiere un subnivel completo más abajo que el del grado previo real. En 6.° EGB, por ejemplo, el grado anterior (5.°) pertenece al mismo subnivel curricular que el curso, pero hoy se ofrecen DCD de Básica Elemental (LL.2/M.2) en vez de las de Básica Media (LL.3/M.3).

## What Changes

- **Resolver de prerrequisito por grado**: nueva firma `resolverPrerrequisitoPorGrado(area, grado)` que deriva el subnivel a diagnosticar como el subnivel del **grado anterior** (`subnivelDesdeGrado(grado - 1)`), en lugar de `subnivel - 1`. Se conserva la resolución de áreas derivadas de Bachillerato (CN.F → CN, etc.), el caso Preparatoria (currículo integrado CAI) y el criterio "informar, no inventar" (`null` explícito sin área sustituta).
- **Subnivel anterior == subnivel del curso → sin nivel prerrequisito distinto**: cuando el grado anterior comparte subnivel con el curso (p. ej. 3.° EGB, 6.° EGB, 9.° EGB, 2.° BGU), el resolvedor devuelve `null` (no existe un nivel previo *distinto*); el diagnóstico se hace sobre las destrezas del subnivel del curso, que es donde viven los prerrequisitos del grado anterior.
- **UI de Evaluación Diagnóstica** (`app/evaluacion-diagnostica/index.tsx`): usa el resolvedor por grado para el grupo prerrequisito por defecto, ajusta el mensaje del caso "mismo subnivel" (antes decía "sin prerrequisito definido") y mantiene la preselección de DCD provenientes del wizard CNC con la misma regla.
- **Picker CNC** (`app/conecta-nivela-crea/index.tsx`, `DestrezaBuscadorCNC`): recibe el grado (no solo `subnivelCurso`) y sugiere las destrezas del nivel prerrequisito por grado, con el mismo criterio en Semana 1 y Semanas 2-3.
- **Actualización de tests**: `__tests__/curriculo-prerrequisitos.test.ts` pasa a validar la nueva regla por grado (tabla completa de grados EGB/BGU) y el invariante "nunca devuelve el mismo par".

## Capabilities

### New Capabilities
- `prerrequisito-grado-anterior`: resolución del subnivel a diagnosticar como el subnivel del grado anterior, incluyendo áreas derivadas de Bachillerato, Preparatoria como currículo integrado y los casos sin prerrequisito distinto (mismo subnivel o área sin predecesor), con la misma regla en todos los caminos de entrada (selección manual y preselección desde CNC).

### Modified Capabilities
- Ninguna: la spec existente `cnc-paso-diagnostico` cubre el paso de *vincular evaluaciones* del wizard (linking), cuyo comportamiento no cambia. El picker de destrezas de Semana 1 / Semanas 2-3 y el flujo de Evaluación Diagnóstica no están cubiertos por ninguna spec en `openspec/specs/`, por lo que todo el comportamiento nuevo vive en la capability `prerrequisito-grado-anterior`.

## Impact

- `lib/curriculo-prerrequisitos.ts`: nueva función `resolverPrerrequisitoPorGrado` (+ `subnivelDelGradoAnterior`); la firma `resolverPrerrequisito(area, subnivel)` se conserva mientras existan llamadas que solo tienen subnivel, o se reemplaza en todos los llamadores.
- `app/evaluacion-diagnostica/index.tsx`: grupo prerrequisito por defecto, mensajes y preselección desde wizard CNC (~líneas 216-288).
- `app/conecta-nivela-crea/index.tsx`: prop `grado` en `DestrezaBuscadorCNC` y llamadas del picker (~líneas 200-317, 235, 1049-1050).
- `__tests__/curriculo-prerrequisitos.test.ts`: reescritura de casos para la regla por grado.
- `lib/evaluacion-utils.ts`: helper `subnivelDelGradoAnterior(grado)` (parseo de grado numérico, BGU y BT), reutilizando `subnivelDesdeGrado`.
- Sin cambios en el catálogo de destrezas (`data/destrezas-*.ts`) ni en persistencia (`AsyncStorage` / Drizzle).