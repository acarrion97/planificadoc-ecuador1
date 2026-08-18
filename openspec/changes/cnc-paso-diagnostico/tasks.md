## 1. Módulo compartido de mapeo (lib)

- [ ] 1.1 Crear `lib/cnc-diagnostico.ts` con `nivelDominanteEstado`, `nivelCNC` y un constructor `diagnosticoAcademicoDesdeBrechas(brechas, area)` que devuelva `DiagnosticoAcademicoCNC[]` incluyendo la observación de procedencia ("Evaluación diagnóstica: X% de dominio · N estudiante(s) en refuerzo.")
- [ ] 1.2 Refactorizar `app/ver-evaluacion/[id].tsx` (líneas 349-402) para consumir el módulo compartido y eliminar las funciones inline, sin cambiar el comportamiento del "→ CNC"
- [ ] 1.3 Tests unitarios de `lib/cnc-diagnostico.ts`: mapeo dominado→logrado, en_proceso→en_proceso, requiere_refuerzo→iniciado; observación con % de dominio y conteo; área LL y M

## 2. Paso Diagnóstico en el wizard CNC

- [ ] 2.1 Reordenar `STEP_LABELS` a ["Identificacion", "Diagnóstico", "Semana 1", "Semanas 2-3", "Semanas 4-5", "Resultado"] y reindexar `validateStep`, `handleGenerate` y el botón "← Volver a Generar"
- [ ] 2.2 Agregar estado de sesión `evaluacionVinculadaId` y UI del paso: selector de evaluaciones LL/M mostrando nombre, grado/paralelo, área, aplicados y resumen 🟢/🟡/🔴 (brechas vía `lib/evaluacion-utils.ts`)
- [ ] 2.3 Previsualización de la evaluación seleccionada y acción "Vincular a Semana 1"; evaluaciones sin estudiantes evaluados no vinculables con hint ("debe ser aplicada primero")
- [ ] 2.4 Regla de no sobrescritura: si `plan.semana1.diagnosticoAcademico` ya tiene entradas LL/M, confirmar antes de reemplazar (patrón confirm/Alert); confirmar reemplaza solo el conjunto LL/M; cancelar no cambia nada
- [ ] 2.5 "Crear evaluación" desde el paso abre `/evaluacion-diagnostica`; al volver (`router.back()`) permite vincular la nueva; cambiar de evaluación vinculada reconfirma si aplica la regla 2.4
- [ ] 2.6 Mostrar en Semana 1 la procedencia del vínculo (evaluación vinculada) cuando el docente regresa al paso Diagnóstico

## 3. Superficie de Mis Planes

- [ ] 3.1 Quitar el botón "Crear Evaluación Diagnóstica" de `PlanesEvaluacionSection` conservando la lista `EVALUACIONES DIAGNÓSTICAS` (ver detalle/documentos)

## 4. Verificación

- [ ] 4.1 `pnpm check` sin nuevos errores TS sobre el baseline (49)
- [ ] 4.2 Tests de `lib/cnc-diagnostico` en verde + suite relacionada sin regresiones
- [ ] 4.3 Smoke test manual en preview: crear plan → paso Diagnóstico (vincular LL, vincular M, confirmación con diagnóstico manual previo, evaluación sin evaluados, crear nueva y re-vincular) → Semana 1 prellenada → generar → verificar "→ CNC" desde detalle sin regresión