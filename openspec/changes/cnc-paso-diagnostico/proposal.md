## Why

La Evaluación Diagnóstica es el insumo formal del diagnóstico académico de la Semana 1 del programa "Conecta, Nivela y Crea" (CNC), pero hoy vive como un módulo paralelo: se crea desde un **botón secundario** en "Mis Planes" y su integración al CNC se hace a mano desde el detalle de cada evaluación (botón "→ CNC"), saltando entre pantallas. El wizard del CNC no conoce la evaluación diagnóstica y el docente no tiene una vía formal para que el diagnóstico sea parte del proceso. Este cambio integra la evaluación diagnóstica como un **paso propio del wizard CNC**, elimina el botón secundario y deja la lista de evaluaciones únicamente para consulta, detalle y documentos.

## What Changes

- **Nuevo paso "Diagnóstico"** en el wizard CNC, entre Identificación y Semana 1. El wizard pasa a: `0 Identificación → 1 Diagnóstico → 2 Conecta → 3 Nivela → 4 Crea → 5 Resultado`.
- **Selector de evaluaciones LL/M existentes** (únicamente Lengua y Literatura y Matemática — las áreas que la integración CNC consume). No se muestran evaluaciones de otras áreas ni se eliminan del sistema.
- **Resumen previo a vincular**: al seleccionar una evaluación se muestra área, aplicados y conteo de brechas (🟢/🟡/🔴) antes de confirmar.
- **Vincular** importa las brechas por DCD a `Semana 1 — Conecta`, **reutilizando el mapeo existente** `nivelCNC()` de `app/ver-evaluacion/[id].tsx` → `DiagnosticoAcademicoCNC[]` (dominado→`logrado`, en proceso→`en_proceso`, refuerzo→`iniciado`). Sin segunda implementación del algoritmo.
- **Confirmación antes de reemplazar** diagnóstico académico manual existente en Semana 1 — nunca sobrescribir silenciosamente ("¿Ya existe un diagnóstico académico registrado en Semana 1. ¿Deseas reemplazarlo…?").
- **"+ Crear evaluación"** desde el paso abre el módulo de creación (`/evaluacion-diagnostica`); al volver, permite re-vincular.
- **`PlanesEvaluacionSection` pierde el botón "Crear Evaluación Diagnóstica"**; la lista `EVALUACIONES DIAGNÓSTICAS` se mantiene para ver detalle y documentos (PDF/Word/🖨️ imprimir).
- Se **mantiene el botón "→ CNC"** desde el detalle de la evaluación (jump directo, sin conflicto con el paso del wizard).
- **Referencia a la evaluación de origen**: la vinculación (id de la evaluación vinculada) se conserva **solo en la sesión del wizard** para el re-vincular. **No se persiste** `evaluacionDiagnosticaId` en `PlanConectaNivelaCrea` (ver design.md: enlace débil sin consumidor, riesgo de referencia colgante).

## Capabilities

### New Capabilities

- `cnc-paso-diagnostico`: paso formal de diagnóstico en el wizard "Conecta, Nivela y Crea" que vincula evaluaciones diagnósticas LL/M existentes (con resumen de brechas y confirmación, sin sobrescribir contenido manual) o crea nuevas desde el propio flujo, e importa sus brechas por DCD a la Semana 1 reutilizando el mapeo `nivelCNC()` existente.

### Modified Capabilities

- Ninguna: no existen specs previas de CNC ni de Evaluación Diagnóstica en `openspec/specs/`; el cambio es aditivo sobre los módulos existentes.

## Impact

- **`app/conecta-nivela-crea/index.tsx`**: nuevo paso 1 "Diagnóstico" (selector LL/M, resumen de brechas, confirmación, + Crear, re-vincular); reorden de `STEP_LABELS`; estado de sesión con evaluación vinculada; importación a `plan.semana1.diagnosticoAcademico`.
- **`lib` compartido**: extraer a un módulo reutilizable (`lib/evaluacion-utils.ts` o nuevo `lib/cnc-diagnostico.ts`) el mapeo brechas → `DiagnosticoAcademicoCNC[]` hoy embebido en `app/ver-evaluacion/[id].tsx:349-386`, para que wizard y detalle compartan una única implementación.
- **`app/ver-evaluacion/[id].tsx`**: consumir el mapeo compartido (sin cambio de comportamiento; se mantiene el botón "→ CNC").
- **`components/PlanesEvaluacionSection.tsx`**: eliminar el botón de creación, conservar la lista `EVALUACIONES DIAGNÓSTICAS`.
- **`app/(tabs)/planes.tsx`**: sin cambio estructural; el componente de sección se ajusta internamente.
- **`lib/evaluaciones-context.tsx`**: sin cambios (el paso solo lee evaluaciones existentes).
- **`data/types-cnc.ts`**: sin campos nuevos (la vinculación es de sesión, no persistida).
- **Tests**: `__tests__/cnc-*.test.ts` (mapeo compartido brechas → `DiagnosticoAcademicoCNC[]`; regla de no sobrescritura en la confirmación).