## Context

Ver proposal.md - Why para la motivación. Estado actual relevante (verificado en código):

- Aplicación Expo (React Native + web), tRPC + Express + MySQL/Drizzle, persistencia local vía AsyncStorage.
- Sin modelo de estudiantes/cursos en BD: los estudiantes solo existen como códigos anónimos (`codigoEstudiante`) en adaptaciones curriculares (decisión privacy-first).
- Currículo = catálogo estático en `data/destrezas-*.ts` (`Destreza {codigo, area, subnivel, bloque, descripcion, criteriosEvaluacion[], indicadoresEvaluacion[]}`) con helpers en `data/index.ts` (`filtrarPorAreaYSubnivel`, `buscarDestrezas`).
- Patrón de módulo aislado (CNC): `data/types-cnc.ts` → `lib/planificaciones-cnc-context.tsx` → `server/cnc-router.ts` → `app/conecta-nivela-crea/index.tsx` (form 5 pasos) → `lib/cnc-word-generator.ts`. Cada módulo es independiente para no romper flujos en producción.
- IA vía `invokeLLM`/`repairJson` (server/_core/llm.ts, OpenAI-compatible, JSON). Backup en BD siempre best-effort (`getDb()` puede devolver null y no es crítico).
- Export: PDF = HTML → `expo-print`; Word = librería `docx`; ambos en cliente (`hooks/use-export-pdf.ts`).

## Goals / Non-Goals

**Goals:**
- Módulo Evaluación Diagnóstica autocontenido e independiente (no toca persistencia ni flujos EGB/BGU, BT o CNC).
- Resultados por DCD calculados localmente con umbrales configurables; brechas y recomendaciones deterministas.
- IA limitada a sugerir preguntas grounded en indicadores del catálogo.
- Exportación de 5 reportes a PDF/Word e integración con CNC.

**Non-Goals:**
- Modelo relacional completo (estudiantes/cursos/tablas 8+ del prompt original): contradice la arquitectura local-first. Se descartó explícitamente (ver Decisions).
- Autenticación de estudiantes ni aplicación digital tipo quiz en esta iteración.
- Recomendaciones generadas por IA: se eligen reglas locales deterministas (más predecibles, sin inventar contenido).

## Decisions

### D1. Persistencia: AsyncStorage como fuente de verdad + backup best-effort (no ERP relacional)
Se replica el patrón CNC: reducer + AsyncStorage (`lib/evaluaciones-context.tsx`, key `@planificadoc_evaluaciones`), y opcionalmente una única tabla `evaluacionesDiagnosticas` en Drizzle con `sessionId`, `form JSON`, `aiResult JSON`, `status`, igual que `connectaNivelaCrea`.
- Alternativa descartada: las 8 tablas relacionales del prompt original (`diagnostic_assessments`, `diagnostic_questions`...). Requerirían un modelo institucional que la app decidió no tener; el valor está en el instrumento local, no en el ERP.
- Justificación: coherencia con el resto del producto y con el modelo privacy-first; cero riesgo para flujos existentes.

### D2. Modelo de estudiantes: códigos anónimos en roster local
`estudiantes: { id, codigo, nombre?, incluirEnReportes }`. `codigo` obligatorio y único dentro de la evaluación; `nombre` opcional (se usa en reportes solo si se ingresó). Previene duplicados por validación de roster + flag `intentoPermitido` por estudiante.

### D3. Trazabilidad curricular sin inventar contenido
Las preguntas se vinculan a una DCD por `codigo` (resoluble en el catálogo vía `buscarPorCodigo`) y a un `indicadorId` por índice dentro de `indicadoresEvaluacion`. La matriz deriva DCD/Indicador directamente del catálogo; no hay catálogo duplicado en el módulo.

### D4. Umbrales configurables por evaluación
`umbrales: { dominadoMin, refuerzoMax }` almacenado en la evaluación, con valores por defecto (70/40, a confirmar). Clasificación: logro ≥ `dominadoMin` → 🟢; logro < `refuerzoMax` → 🔴; resto → 🟡. Funciones puras en `lib/evaluacion-utils.ts`, sin valores mágicos en componentes. Sin responder cuenta como incorrecta.

### D5. Recomendaciones por regla local (sin IA)
Función determinista en `lib/evaluacion-utils.ts`: por cada DCD en 🟡/🔴 genera una recomendación anclada a esa destreza e indicadores, priorizada por severidad (🔴 antes que 🟡, y por % de brecha del curso). Reutiliza los textos reales de la DCD; no genera contenido nuevo.
- Alternativa descartada: recomendaciones por IA. Menos predecibles, costo y riesgo de inventar currículo.

### D6. IA solo para sugerir preguntas, con grounding en el catálogo
`server/evaluacion-router.ts` expone `sugerirPreguntas` con input Zod (`{ dcds: [{codigo, descripcion, indicadores[]}] }`). El prompt incluye exclusivamente los indicadores/criterios reales de las DCD seleccionadas y prohíbe inventar contenido. La respuesta se valida con Zod (tipos + opciones + respuesta correcta) y se repara con `repairJson` ante JSON truncado. El docente revisa/edita/descarta antes de incorporar.

### D7. Exportación de reportes (patrón existente)
`lib/evaluacion-pdf-generator.ts` (HTML → expo-print) y `lib/evaluacion-word-generator.ts` (docx). Cinco reportes: individual, general del curso, por DCD, brechas y matriz. En web se abre la impresión; en móvil se comparte, igual que `use-export-pdf.ts`. Se reutiliza `ExportModal`/patrón de botones de exportación de otros módulos.

### D8. Integración con CNC
Botón "Exportar a Conecta, Nivela y Crea": mapeo 🟢→`logrado`, 🟡→`en_proceso`, 🔴→`iniciado`. Crea (o actualiza con confirmación) el `diagnosticoAcademico` de Semana 1 de un plan CNC (`data/types-cnc.ts`), solo para DCD de área LL/M (el modelo CNC solo admite LL/M). No modifica planes sin confirmación.

### D9. Aislamiento del módulo
Todos los archivos del módulo son nuevos y no se modifican los archivos de los flujos existentes salvo: `server/routers.ts` (registrar router) y `app/(tabs)/planes.tsx` (entrada). Replica la independencia de archivos que ya establece CNC.

## Risks / Trade-offs

- [Límite de línea base TS: `pnpm check` ya reporta 49 errores preexistentes] → El módulo debe añadir 0 errores; código nuevo con tipos explícitos; verificar con `pnpm check` antes de terminar.
- [Tamaño de AsyncStorage al crecer evaluaciones + banco de preguntas] → Evaluaciones y banco en keys separadas; backup best-effort para liberar presión; aceptable para el volumen de un docente.
- [IA puede sugerir preguntas de calidad variable] → Solo propone (nunca incorpora sin revisión), validación Zod estricta y grounding en indicadores reales.
- [Umbrales por defecto pueden no reflejar criterios institucionales] → Configurables por evaluación; documentar los valores por defecto en la UI.
- [Integración CNC limitada a LL/M por el modelo actual] → Si el docente evalúa otras áreas, la exportación a CNC queda inhabilitada con explicación clara (el plan CNC solo diagnostica Lengua/Matemática).

## Migration Plan

1. `drizzle/schema.ts`: añadir tabla `evaluacionesDiagnosticas` + migración (`pnpm db:push`). La app funciona sin la tabla (best-effort), por lo que no hay ventana de falla.
2. Desarrollo por capas: tipos → utilidades (con tests) → contexto local → router IA → UI → exportación → integración CNC.
3. Rollback: basta retirar la entrada en `planes.tsx` y el router; los datos locales de otros módulos no se ven afectados (keys AsyncStorage independientes).

## Open Questions

- Valor exacto de los umbrales por defecto (dominado/refuerzo): se propone 70/40 pero es configurable por evaluación; no bloquea el diseño.