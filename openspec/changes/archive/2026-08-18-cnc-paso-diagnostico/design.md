## Context

- El wizard CNC (`app/conecta-nivela-crea/index.tsx`) maneja el plan en estado efímero (`STEP_LABELS` en la línea 25; pasos 0 Identificación, 1 Semana 1, 2 Semanas 2-3, 3 Semanas 4-5, 4 Resultado) y lo persiste solo al generar vía `addPlanCNC` (`lib/planificaciones-cnc-context.tsx`, AsyncStorage).
- El mapeo brechas por DCD → `DiagnosticoAcademicoCNC[]` vive **inline** en `app/ver-evaluacion/[id].tsx:349-386` (`nivelDominanteEstado`, `nivelCNC`, `exportarACNCConfirmado`), incluyendo la observación de procedencia "% de dominio · N estudiante(s) en refuerzo".
- Las brechas se calculan en `lib/evaluacion-utils.ts` (por DCD, umbrales configurables). Las evaluaciones viven en `lib/evaluaciones-context.tsx` (AsyncStorage).
- `PlanesEvaluacionSection.tsx` hoy hace dos cosas: el botón azul de creación y la lista `EVALUACIONES DIAGNÓSTICAS`.
- `PlanConectaNivelaCrea` es un documento autocontenido sin vínculos externos.

Ver proposal.md para la motivación y specs para los requisitos de comportamiento.

## Goals / Non-Goals

**Goals:**
- Única implementación del mapeo brechas → diagnóstico de Semana 1, compartida entre el wizard y el detalle de evaluación (evitar que existan dos comportamientos divergentes para "→ CNC desde Evaluación" y "Vincular desde CNC").
- El diagnóstico como paso nativo del wizard con fricción mínima (seleccionar → previsualizar → confirmar → Semana 1 prellenada).
- Cero cambios de persistencia en `PlanConectaNivelaCrea`.
- El módulo de Evaluación Diagnóstica (creación/aplicación/resultados) permanece funcionalmente intacto.

**Non-Goals:**
- Persistir la referencia a la evaluación de origen en el plan (sin `evaluacionDiagnosticaId`).
- Integración de áreas distintas de LL/M al diagnóstico académico de Semana 1.
- Cambios a los flujos de creación/aplicación de la evaluación.
- Alcance del change `cnc-producto-final-crea` (fase Crea).

## Decisions

**D1 — Módulo compartido de mapeo brechas → CNC.**
Extraer `nivelDominanteEstado`, `nivelCNC` y el constructor de `DiagnosticoAcademicoCNC[]` (con su observación de procedencia) a un módulo reutilizable (`lib/cnc-diagnostico.ts`) y refactorizar `app/ver-evaluacion/[id].tsx` para consumirlo.
- *Alternativa considerada*: duplicar el mapeo dentro del wizard. Descartada: es exactamente el riesgo que este change quiere eliminar (dos comportamientos para la misma operación).
- *Alternativa considerada*: vivirlo en `lib/evaluacion-utils.ts`. Válida; se elige `lib/cnc-diagnostico.ts` para no mezclar la responsabilidad de cálculo de la evaluación con la traducción hacia CNC.

**D2 — Vinculación solo de sesión (no persistida).**
La evaluación vinculada se guarda en `useState` del wizard (p.ej. `evaluacionVinculadaId`) para habilitar el re-vincular. No se agrega `evaluacionDiagnosticaId` a `PlanConectaNivelaCrea`.
- *Racional*: el plan es un documento autocontenido en AsyncStorage; un id de evaluación sería un enlace débil sin FK, sin consumidor en la UI y con riesgo de referencia colgante si se borra la evaluación. Los datos importados ya persisten íntegros en `semana1.diagnosticoAcademico` (código, descripción, área, observación con % de dominio).
- *Alternativa considerada*: persistir el id para "re-importar actualizaciones". Descartada por ahora; se reabre solo si aparece una necesidad real (requisito explícito, no por conveniencia).

**D3 — Reorden del wizard e índice de pasos.**
`STEP_LABELS` pasa a `["Identificacion", "Diagnóstico", "Semana 1", "Semanas 2-3", "Semanas 4-5", "Resultado"]`. El paso "Diagnóstico" se inserta en índice 1; los pasos 1→2, 2→3, 3→4 y 4→5. Se reindexan `validateStep`/`handleGenerate` y el botón "← Volver a Generar".
- *Alternativa considerada*: colocar el paso al final. Descartada: pedagógicamente el diagnóstico precede a Conecta y el propio flujo lo exige (spec: posicionado entre Identificación y Semana 1).

**D4 — Semana 1 como destino y regla de no sobrescritura.**
La importación escribe en `plan.semana1.diagnosticoAcademico` (estructura ya existente, sin campos nuevos). Antes de importar: si ya existen entradas académicas LL/M, se pide confirmación (patrón `confirm`/`Alert` del repo). Confirmar **reemplaza** el conjunto LL/M completo (lo socioemocional y demás campos de Semana 1 quedan intactos); cancelar **no cambia nada**.
- *Alternativa considerada*: fusionar por código de destreza. Descartada: contradice la regla "no sobrescribir silenciosamente" (no se puede saber qué es manual vs. importado) y complica el mapeo.

**D5 — Selección con previsualización y validación.**
El selector lista evaluaciones LL/M (spec) mostrando por cada una: nombre, grado/paralelo, área, aplicados y resumen 🟢/🟡/🔴 (brechas vía `lib/evaluacion-utils.ts`). Una evaluación sin estudiantes evaluados no es vinculable (hint "debe ser aplicada primero"). La vinculación no exige igualdad de grado entre evaluación y plan: se muestra el grado de la evaluación para que el docente decida (coherente con la independencia del módulo).

**D6 — Plana superficie de "Mis Planes".**
`PlanesEvaluacionSection` pierde el botón de creación y conserva solo la lista. La creación queda accesible desde el paso Diagnóstico ("+ Crear evaluación" → `/evaluacion-diagnostica` → `router.back()` para re-vincular) y desde el detail (`→ CNC` se mantiene).

## Risks / Trade-offs

- **Refactor del mapeo toca `app/ver-evaluacion/[id].tsx` (regresión en una feature funcionando)** → Mitigación: mantener firmas equivalentes; tests unitarios del mapeo compartido; smoke test manual del "→ CNC" tras el cambio.
- **Reorden de pasos del wizard puede romper índices en `validateStep`/`handleGenerate`** → Mitigación: reindexación explícita y verificación visual del indicador de pasos.
- **El paso Diagnóstico es opcional (se puede avanzar sin vincular)** → Mitigación: CTA claro, pero sin bloquear — el ingreso manual en Semana 1 sigue siendo válido (spec: "Advancing without linking").
- **Una evaluación vinculada puede borrarse luego** → Sin impacto: la vinculación no persiste; el diagnóstico ya importado queda intacto en el plan.

## Open Questions

- ¿El selector del paso Diagnóstico debe filtrar también por grado/paralelo para evitar importar DCD de un grado distinto al plan? Se asume hoy que **no** (el docente decide, viendo el grado mostrado); si en el smoke test se percibe riesgo de uso incorrecto, se decide un filtro por grado sin tocar el resto del diseño.