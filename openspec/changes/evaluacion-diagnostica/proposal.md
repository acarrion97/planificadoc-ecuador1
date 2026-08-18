## Why

El docente ecuatoriano necesita identificar los conocimientos previos, fortalezas y brechas de aprendizaje de sus estudiantes antes de iniciar un proceso de enseñanza, pero el Planificadoc solo permite planificar y no diagnosticar. La evaluación diagnóstica actual se reduce a un juicio subjetivo sin trazabilidad curricular ni insumo estructurado para la planificación (incluida la estrategia "Conecta, Nivela y Crea"). Este cambio agrega un módulo de Evaluación Diagnóstica que convierte los resultados (por DCD/indicador) en un insumo pedagógico accionable.

## What Changes

- Nuevo módulo **Evaluación Diagnóstica** accesible desde la pestaña "Planes", con persistencia local (AsyncStorage) y backup best-effort en la nube, siguiendo el patrón del módulo CNC.
- Creación de evaluaciones con contexto curricular: año lectivo, área, subnivel, grado, paralelo, asignatura, fecha, duración, instrucciones y puntaje total.
- Selección de DCD a diagnosticar usando el catálogo estático existente (`data/destrezas-*.ts`), que ya expone `criteriosEvaluacion` e `indicadoresEvaluacion` por destreza (sin inventar currículo).
- Selección del **subnivel prerrequisito**: como un diagnóstico mide aprendizajes previos, el módulo ofrece por defecto las DCD del subnivel prerrequisito del curso y mantiene disponibles las del subnivel actual. El prerrequisito se resuelve con un mapa curricular explícito (área, subnivel) → (área, subnivel) —no con una resta— porque el catálogo no ofrece todas las áreas en todos los subniveles; cuando no existe predecesor, se informa en lugar de inventar equivalencias.
- Banco de preguntas reutilizable entre evaluaciones, con 4 tipos iniciales (selección múltiple, verdadero/falso, respuesta corta, ejercicio/problema) y diseño extensible a más tipos. Preguntas vinculadas a DCD e indicador.
- Sugerencia de preguntas por IA, fundamentada únicamente en los indicadores/criterios reales del catálogo.
- Matriz de evaluación (DCD | Indicador | #Preguntas | Puntaje | Dificultad) editable antes de publicar.
- Aplicación por estudiante mediante **códigos anónimos** (nombre opcional, privacy-first, coherente con adaptaciones curriculares); evita doble registro accidental salvo nuevo intento autorizado.
- Cálculo local de resultados individuales y por aprendizaje: por cada DCD, % de logro, preguntas correctas/incorrectas/sin responder y estado 🟢 Dominado / 🟡 En proceso / 🔴 Requiere refuerzo, con **umbrales configurables** (no hardcodeados).
- Detección de brechas del curso (agregado por DCD) y **recomendaciones por regla local determinista** (sin IA) ancladas a las DCD evaluadas.
- Brechas clasificadas por **origen curricular** (arrastre vs. nivel actual), derivado del subnivel de cada DCD, visible en el análisis y en los reportes.
- Exportación a PDF y Word de 5 reportes: individual, general del curso, por DCD, de brechas y matriz de resultados.
- Dashboard de resultados: total evaluados, promedio, % de dominio, aprendizajes por estado, distribución y brechas principales.
- Integración con **Conecta, Nivela y Crea**: botón que convierte los resultados (DCD + `nivelDetectado`) en el diagnóstico de Semana 1 de un plan CNC, sin modificar planificaciones existentes sin confirmación del docente.

## Capabilities

### New Capabilities

- `evaluacion-diagnostica`: Crear y aplicar evaluaciones diagnósticas vinculadas al currículo ecuatoriano, registrar resultados por estudiante (códigos anónimos), calcular logro por DCD con umbrales configurables, detectar brechas, generar recomendaciones y exportar reportes PDF/Word.

### Modified Capabilities

- Ninguna: no existen specs previas y no cambian requisitos de comportamiento existentes fuera del nuevo módulo.

## Impact

- **Tipos nuevos**: `data/types-evaluacion.ts` (EvaluacionDiagnostica, PreguntaDiagnostica, ResultadoEstudiante, BrechasCurso, Umbrales, etc.) + re-exports en `data/index.ts`.
- **Persistencia local**: `lib/evaluaciones-context.tsx` (reducer + AsyncStorage, patrón `planificaciones-cnc-context`).
- **Backend tRPC**: `server/evaluacion-router.ts` (sugerir preguntas por IA usando `invokeLLM`/`repairJson`), registrado en `server/routers.ts`. Backup best-effort en nueva tabla `evaluacionesDiagnosticas` (JSON, patrón `connectaNivelaCrea`) + migración Drizzle.
- **Frontend**: `app/evaluacion-diagnostica/index.tsx` (form multi-paso, patrón CNC), `app/ver-evaluacion/[id].tsx` (resultados/dashboard/brechas/reportes), entrada en `app/(tabs)/planes.tsx` vía `components/PlanesEvaluacionSection.tsx`.
- **Exportación**: `lib/evaluacion-pdf-generator.ts` (HTML → expo-print) y `lib/evaluacion-word-generator.ts` (docx), siguiendo el patrón de `lib/cnc-word-generator.ts`.
- **Cálculos**: `lib/evaluacion-utils.ts` (resultados por DCD, umbrales configurables, brechas, recomendaciones por regla, clasificación de brechas por origen curricular).
- **Prerrequisitos curriculares**: `lib/curriculo-prerrequisitos.ts` (resolvedor `(área, subnivel) → (área, subnivel) | null`), usado tanto por el selector manual como por la preselección de DCD que llega desde el wizard CNC. Archivo nuevo propiedad del módulo; no modifica `data/index.ts` ni el catálogo.
- **Tests**: `__tests__/evaluacion-*.test.ts` (cálculos, umbrales, resultados por DCD, integración CNC).
- **Compatibilidad**: el módulo es independiente de los flujos EGB/BGU, BT y CNC existentes; no modifica su persistencia ni sus rutas.