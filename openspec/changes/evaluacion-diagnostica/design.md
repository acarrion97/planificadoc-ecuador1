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

### D10. Subnivel prerrequisito resuelto por mapa explícito, no por resta

Un diagnóstico mide lo que el estudiante *debería traer*, por lo que las DCD relevantes suelen ser de un subnivel anterior al del curso. La primera versión filtraba el selector por el subnivel derivado del grado (`filtrarPorAreaYSubnivel(area, subnivel)`), lo que hacía imposible seleccionar prerrequisitos justo en los saltos de subnivel — que es donde el diagnóstico más importa.

La regla no puede ser `subnivel - 1`, porque el catálogo no ofrece todas las áreas en todos los subniveles (verificado sobre `data/destrezas-*.ts`):

| área | -1 | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|
| INI | ✓ | ✓ | | | | | |
| CAI | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| LL, M, CN, CS | | | | ✓ | ✓ | ✓ | (CN y CS se cortan en 4) |
| ECA, EF, EFL | | | | ✓ | ✓ | ✓ | ✓ |
| CN.B, CN.F, CN.Q | | | | | | | ✓ |
| CS.H, CS.F, CS.EC | | | | | | | ✓ |
| EG | | | | | | | ✓ |

Se define entonces un resolvedor `(área, subnivel) → (área, subnivel) | null`:

1. **Áreas de Bachillerato derivadas** — el código de área ya codifica la jerarquía con un punto: `CN.F@5 → CN@4`, `CN.Q@5 → CN@4`, `CN.B@5 → CN@4`, `CS.H@5 → CS@4`, `CS.F@5 → CS@4`, `CS.EC@5 → CS@4`. Se resuelve tomando el prefijo anterior al punto.
2. **Preparatoria es currículo integrado** — el subnivel 1 solo ofrece `CAI`, por lo que *cualquier* área de Básica Elemental toma `CAI@1` como prerrequisito: `LL@2 → CAI@1`, `M@2 → CAI@1`, `CN@2 → CAI@1`, etc.
3. **Caso general** — misma área, subnivel anterior: `LL@4 → LL@3`.
4. **Sin prerrequisito definido** — `EG@5` no tiene predecesor en el catálogo, y los subniveles de Inicial/Preparatoria quedan fuera del alcance del módulo. El resolvedor devuelve `null` y la UI lo informa; **no** se sustituye por un área "parecida".

Decisiones asociadas:

- **El prerrequisito es el default, no una restricción.** El subnivel del curso siempre queda seleccionable. Forzar el anterior sería una regresión para los grados que comparten subnivel: 5.° y 6.° EGB son ambos Básica Media, y el catálogo ecuatoriano define destrezas por subnivel (la institución las dosifica por grado), de modo que los prerrequisitos de 6.° ya viven en el subnivel del curso.
- **Un único resolvedor para los dos caminos de entrada.** Tanto el selector manual como la preselección de DCD que llega desde el wizard CNC usan la misma función. Con dos reglas distintas, las DCD de arrastre que vienen de un plan CNC se descartarían en silencio (comportamiento previo en `app/evaluacion-diagnostica/index.tsx`).
- **Sin campo nuevo en la evaluación.** `DcdEvaluada` guarda `codigo`, y el subnivel se deriva con `buscarPorCodigo`. `EvaluacionDiagnostica.subnivel` conserva su significado actual (el subnivel del curso) y las evaluaciones ya guardadas en AsyncStorage siguen siendo válidas sin migración.
- **Ubicación**: `lib/curriculo-prerrequisitos.ts`, archivo nuevo propiedad del módulo, para no tocar `data/index.ts` (ver D9). Si otro módulo lo necesita más adelante, se promueve.

Alternativa descartada: permitir que el docente elija cualquier subnivel sin default. Es más flexible pero pierde la guía pedagógica, que es justamente el aporte del módulo.

### D11. Brechas clasificadas por origen curricular

Con DCD de varios subniveles en una misma evaluación, una lista plana de brechas no permite distinguir un rezago de arrastre de una dificultad del nivel actual — y son decisiones pedagógicas distintas. La clasificación se deriva del subnivel de la DCD en el catálogo comparado con el subnivel del curso, sin campo declarado por el docente. Alimenta el análisis en pantalla y los reportes, y hace explícita la trazabilidad hacia la fase *Nivela* de CNC.

Derivar en lugar de persistir tiene un borde: `DcdEvaluada` desnormaliza `descripcion` e `indicadores` (precisamente porque un código podría dejar de resolver ante un catálogo actualizado), pero el subnivel es puramente derivado. Si `buscarPorCodigo` no resuelve, el resultado individual y el % de logro siguen siendo correctos —no dependen del subnivel— y solo se pierde la clasificación por origen. En ese caso la DCD se presenta con **origen no determinado**, en lugar de caer por defecto en "nivel actual": es coherente con el criterio del módulo de informar antes que inventar (mismo trato que `EG@5` sin prerrequisito en D10) y evita desnormalizar el subnivel, que contradiría la decisión de no crecer el modelo persistido.

## Risks / Trade-offs

- [Límite de línea base TS: `pnpm check` ya reporta 49 errores preexistentes] → El módulo debe añadir 0 errores; código nuevo con tipos explícitos; verificar con `pnpm check` antes de terminar.
- [Tamaño de AsyncStorage al crecer evaluaciones + banco de preguntas] → Evaluaciones y banco en keys separadas; backup best-effort para liberar presión; aceptable para el volumen de un docente.
- [IA puede sugerir preguntas de calidad variable] → Solo propone (nunca incorpora sin revisión), validación Zod estricta y grounding en indicadores reales.
- [Umbrales por defecto pueden no reflejar criterios institucionales] → Configurables por evaluación; documentar los valores por defecto en la UI.
- [Integración CNC limitada a LL/M por el modelo actual] → Si el docente evalúa otras áreas, la exportación a CNC queda inhabilitada con explicación clara (el plan CNC solo diagnostica Lengua/Matemática).
- [El mapa de prerrequisitos (D10) se desactualiza si cambia la cobertura del catálogo] → El mapa se deriva de reglas (prefijo de área, Preparatoria integrada) y no de una tabla caso por caso; se cubre con tests que verifican que todo par (área, subnivel) presente en el catálogo resuelve a un par existente o a `null` explícito.
- [El catálogo no registra de qué versión del currículo proviene cada DCD] → Los códigos DCD son estables entre el Currículo 2016 y los priorizados posteriores (el priorizado es un subconjunto), por lo que la trazabilidad por código se mantiene. Pero el módulo no puede advertir que una DCD no estuvo priorizada en el año que la cohorte cursó ese grado, y podría reportar como brecha algo que nunca se enseñó. Queda fuera del alcance de este change; requiere procedencia por archivo en `data/destrezas-*.ts`.

## Migration Plan

1. `drizzle/schema.ts`: añadir tabla `evaluacionesDiagnosticas` + migración (`pnpm db:push`). La app funciona sin la tabla (best-effort), por lo que no hay ventana de falla.
2. Desarrollo por capas: tipos → utilidades (con tests) → contexto local → router IA → UI → exportación → integración CNC.
3. Rollback: basta retirar la entrada en `planes.tsx` y el router; los datos locales de otros módulos no se ven afectados (keys AsyncStorage independientes).

## Open Questions

- Valor exacto de los umbrales por defecto (dominado/refuerzo): se propone 70/40 pero es configurable por evaluación; no bloquea el diseño.