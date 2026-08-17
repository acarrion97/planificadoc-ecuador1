## 1. Tipos y catálogo

- [x] 1.1 Crear `data/types-evaluacion.ts` con: `TipoPreguntaDiagnostica` (opcion_multiple | v_f | respuesta_corta | ejercicio), `DificultadPregunta`, `OpcionPregunta`, `PreguntaDiagnostica`, `DcdEvaluada` (codigo, descripcion, indicadores), `UmbralesEvaluacion` (dominadoMin, refuerzoMax), `EstadoAprendizaje` (dominado | en_proceso | requiere_refuerzo), `ResultadoPorDcd`, `ResultadoEstudiante`, `BrechaCurso`, `Recomendacion`, `EstudianteEvaluacion` (codigo, nombre?, incluirEnReportes), `EvaluacionDiagnostica` (contexto + dcds + preguntas + estudiantes + resultados + umbrales + status: borrador|publicada|aplicada|analizada).
- [x] 1.2 Añadir re-exports en `data/index.ts` para los tipos y helpers del módulo.
- [x] 1.3 Verificar que `buscarPorCodigo`/`filtrarPorAreaYSubnivel`/`AREAS_INFO` cubren la selección de DCD por contexto (sin cambios de catálogo).

## 2. Utilidades de cálculo (núcleo, con tests)

- [x] 2.1 Crear `lib/evaluacion-utils.ts` con: cálculo de resultado individual (puntaje, %, correctas/incorrectas/sin responder, tiempo), resultado por DCD (% logro = correctas / total de esa DCD, sin responder cuenta como incorrecta), clasificación por umbrales configurables (🟢 Dominado / 🟡 En proceso / 🔴 Requiere refuerzo), agregación de brechas del curso y recomendaciones por regla local priorizadas por severidad.
- [x] 2.2 Umbrales por defecto constantes (dominadoMin 70, refuerzoMax 40) usados al crear evaluación; sin valores mágicos en componentes.
- [x] 2.3 Escribir `__tests__/evaluacion-utils.test.ts`: cálculo individual, clasificación por umbrales (por defecto y personalizados), DCD sin respuestas → 🔴 0%, brechas de curso, recomendaciones (DCD en 🔴 genera recomendación anclada; sin brechas → sin recomendaciones).

## 3. Persistencia local

- [x] 3.1 Crear `lib/evaluaciones-context.tsx` (reducer + AsyncStorage, key `@planificadoc_evaluaciones`, patrón `planificaciones-cnc-context`): cargar/guardar evaluaciones y banco de preguntas (`@planificadoc_banco_preguntas`), CRUD de evaluaciones y preguntas.
- [x] 3.2 Proveer el contexto en el árbol de la app junto a los providers existentes.

## 4. Backend tRPC + backup best-effort

- [x] 4.1 Crear `server/evaluacion-router.ts` con `sugerirPreguntas` (Zod input: dcds con codigo/descripcion/indicadores; prompt grounded en indicadores reales, prohibición de inventar contenido; validación Zod de la respuesta + `repairJson`; devuelve preguntas sugeridas sin incorporar).
- [x] 4.2 Registrar `evaluacionRouter` en `server/routers.ts`.
- [x] 4.3 Añadir tabla `evaluacionesDiagnosticas` en `drizzle/schema.ts` (sessionId, form JSON, aiResult JSON, status, timestamps — patrón `connectaNivelaCrea`) + migración Drizzle (`pnpm db:push`). Nota: sin `DATABASE_URL` local, se generó `drizzle/0007_evaluaciones_diagnosticas.sql` (patrón 0006, no journaled) y la tabla se asegura en runtime vía `ensureEvaluacionTable()`.
- [x] 4.4 Guardado best-effort en `sugerirPreguntas`/finalización de evaluación: la app funciona si `getDb()` falla o la tabla no existe.

## 5. UI: creación y aplicación

- [x] 5.1 Crear `app/evaluacion-diagnostica/index.tsx` con form multi-paso (patrón CNC): contexto → selección de DCD (reutilizar `DcdMultiSelector` o equivalente) → banco de preguntas (manual + "Sugerir con IA" con revisión/edición/descarte) → matriz (DCD | Indicador | #Preguntas | Puntaje | Dificultad, distribución editable, validación vs puntaje total) → revisar/publicar.
- [x] 5.2 Aplicación: roster de estudiantes (código anónimo obligatorio, nombre opcional, `incluirEnReportes`), registro de respuestas por estudiante con inicio/fin/tiempo, validación anti-duplicado (evaluación finalizada bloquea re-registro salvo `intentoPermitido`).
- [x] 5.3 Entrada del módulo: `components/PlanesEvaluacionSection.tsx` (lista de evaluaciones con estado, patrón `PlanesCNCSection`) y botón "Crear Evaluación Diagnóstica" en `app/(tabs)/planes.tsx`.

## 6. Resultados, dashboard y brechas

- [x] 6.1 Crear `app/ver-evaluacion/[id].tsx`: resultados individuales (puntaje, %, correctas/incorrectas/sin responder, tiempo) y por aprendizaje (por DCD: % logro, conteos, estado 🟢/🟡/🔴 con umbrales editables por evaluación).
- [x] 6.2 Dashboard: total evaluados, promedio, % de dominio, aprendizajes por estado, distribución de resultados y brechas principales.
- [x] 6.3 Recomendaciones por regla local visibles junto a las brechas.

## 7. Exportación PDF/Word

- [x] 7.1 Crear `lib/evaluacion-pdf-generator.ts` (HTML → expo-print) con los 5 reportes: individual, general del curso, por DCD, brechas (con recomendaciones) y matriz.
- [x] 7.2 Crear `lib/evaluacion-word-generator.ts` (docx) con los mismos 5 reportes.
- [x] 7.3 Conectar exportación en la vista de resultados (web → impresión / móvil → compartir, patrón `use-export-pdf`); nombres reales si `nombre` fue ingresado, códigos anónimos en caso contrario.

## 8. Integración Conecta, Nivela y Crea

- [x] 8.1 Botón "Exportar a Conecta, Nivela y Crea": mapeo 🟢→logrado, 🟡→en_proceso, 🔴→iniciado; crea/actualiza el `diagnosticoAcademico` de Semana 1 de un plan CNC (solo DCD área LL/M; inhabilitado con explicación si se evalúan otras áreas); requiere confirmación y no toca planes sin autorización.

## 9. Verificación final

- [x] 9.1 `pnpm check`: 0 errores TS nuevos sobre la línea base (49 preexistentes).
- [x] 9.2 Ejecutar `__tests__/evaluacion-utils.test.ts` y la suite completa (`pnpm test`).
- [ ] 9.3 Smoke test manual: crear → publicar → aplicar → ver resultados → exportar reportes → exportar a CNC.