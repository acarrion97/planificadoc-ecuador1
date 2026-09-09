## 1. Tipos y catálogo de competencias

- [ ] 1.1 Crear `data/competencias-transversales.ts` con el catálogo configurable. Código fijo (C, M, CD, CS), nombre/descripción/editable, campo `active`, campo `source` (SourceTraceability).
- [ ] 1.2 Crear `data/types-curriculo-competencias.ts` con: `SourceTraceability`, `DcdSeleccionada`, `IndicadorSeleccionado`, `UnidadAiResult`, `UnidadCurriculoCompetencias`, `EstrategiaMetodologica`, `FaseEstrategia`, `ActividadERCA`, `FaseERCA`, `EstructuraClaseERCA`, `ProyectoInterdisciplinar`, `AdaptacionNEE`, `GradoNEE`, `ActividadAcompaniamiento`, `PlanificacionCurriculoCompetencias`, `EGBBguPlan`, `InicialPreparatoriaPlan`, `AmbitoDesarrollo`, `ClaseInicialCurriculo`, `ActividadInicial`, `FirmasInicial`, `PlanificacionInicialCurriculo`.
- [ ] 1.3 Crear `data/estrategias-metodologicas.ts` con: estrategia ERCA (4 fases, default para EGB/BGU) e INICIO/DESARROLLO/CIERRE (3 momentos, default para Inicial/Preparatoria). Cada estrategia con `id`, `name`, `description`, `phases`, `configurable`, `family`, `source`.
- [ ] 1.4 Crear `data/ambitos-desarrollo-inicial.ts` con el catálogo configurable de ámbitos de desarrollo para Inicial/Preparatoria.
- [ ] 1.5 Añadir re-exports en `data/index.ts` para los tipos y helpers del módulo.

## 2. Capa de normalización + trazabilidad

- [ ] 2.1 Crear `lib/curriculo-competencias-normalizer.ts` con: `mapearEstructuraOficial()`, `mapearCompetencias()`, `mapearAmbitos()`, `mapearNEE()`. Cada función agrega `SourceTraceability` al resultado.
- [ ] 2.2 Documentar en el archivo qué partes son "valores del piloto" y qué partes son "pendientes de validación con fuente oficial".
- [ ] 2.3 Verificar que el normalizador no acopla el dominio a la estructura física de la fuente (INV-05).

## 3. Persistencia local + trazabilidad

- [ ] 3.1 Crear `lib/curriculo-competencias-context.tsx` (reducer + AsyncStorage, key `@planificadoc_curriculo_competencias`). Los datos persistidos incluyen metadatos de `SourceTraceability`.
- [ ] 3.2 Proveer el contexto en el árbol de la app junto a los providers existentes.

## 4. Backend tRPC + backup best-effort

- [ ] 4.1 Crear `server/curriculo-competencias-router.ts` con: `generarUnidad`, `generarPlanClase`, `generarClaseInicial`. La estrategia metodológica es parámetro de entrada.
- [ ] 4.2 Registrar `curriculoCompetenciasRouter` en `server/routers.ts`.
- [ ] 4.3 Añadir tabla `curriculoCompetenciasPlanificaciones` en `drizzle/schema.ts` + migración Drizzle.
- [ ] 4.4 Guardado best-effort: la app funciona si `getDb()` falla.

## 5. Componentes UI base

- [ ] 5.1 `CompetenciaBadge.tsx`: badge visual con color/emoji, respeta `active`.
- [ ] 5.2 `SelectorCompetencias.tsx`: multi-select, solo muestra competencias activas.
- [ ] 5.3 `IndicadorDesagregado.tsx`: campo de indicador con badge de competencia.
- [ ] 5.4 `FaseERCAEditor.tsx`: editor de fase didáctica con actividades + competencia por actividad.
- [ ] 5.5 `DatosInformativosForm.tsx`: formulario de datos informativos.
- [ ] 5.6 `MatrizCompetenciasForm.tsx`: matriz DCD + Indicador + Selector competencias.
- [ ] 5.7 `AprendizajeInterdisciplinarForm.tsx`: toggle + proyecto + DCDs + estrategias + evaluación.
- [ ] 5.8 `AdaptacionesNEEForm.tsx`: NEE con grados configurables.
- [ ] 5.9 `AcompanamientoIntegralForm.tsx`: horas + actividades con competencia.

## 6. UI: rutas y formularios

- [ ] 6.1 `app/curriculo-competencias/_layout.tsx`: layout del módulo.
- [ ] 6.2 `app/curriculo-competencias/index.tsx`: home del módulo.
- [ ] 6.3 `app/curriculo-competencias/mesocurricular/index.tsx`: configuración de unidad.
- [ ] 6.4 `app/curriculo-competencias/microcurricular/[id].tsx`: planificación EGB/BGU (5 secciones).
- [ ] 6.5 `app/curriculo-competencias/inicial/index.tsx`: planificación Inicial/Preparatoria (ámbitos + IDC).
- [ ] 6.6 `app/curriculo-competencias/ver-plan/[id].tsx`: vista de plan guardado.
- [ ] 6.7 `components/PlanesCurriculoCompetenciasSection.tsx`: entrada en `app/(tabs)/planes.tsx`.

## 7. Generación IA

- [ ] 7.1 Prompt `generarUnidad`: recibe DCDs + competencias → genera título, objetivos, contenidos, orientaciones, evaluación.
- [ ] 7.2 Prompt `generarPlanClase`: recibe DCD + competencias + indicador + estrategia → genera estructura según estrategia (ERCA o IDC) con actividades etiquetadas por competencia.
- [ ] 7.3 Prompt `generarClaseInicial`: recibe grado + ámbito + competencia + destrezas → genera INICIO/DESARROLLO/CIERRE.
- [ ] 7.4 Validación Zod + `repairJson` ante JSON truncado.

## 8. Exportación Word/PDF

- [ ] 8.1 `lib/curriculo-competencias-word-generator.ts` (EGB/BGU): A4 Landscape, 5 secciones, badges competencias, fases con colores.
- [ ] 8.2 `lib/curriculo-competencias-inicial-word-generator.ts` (Inicial/Preparatoria): matriz por ámbitos, IDC.
- [ ] 8.3 `lib/curriculo-competencias-pdf-generator.ts`: HTML → expo-print para ambas familias.
- [ ] 8.4 Conectar exportación en vista de resultados.

## 9. Tests de invariantes

- [ ] 9.1 Test INV-01: un elemento curricular no pertenece a dos estructuras incompatibles.
- [ ] 9.2 Test INV-02: un código de competencia no identifica dos competencias activas.
- [ ] 9.3 Test INV-03: una estrategia metodológica no modifica la estructura curricular.
- [ ] 9.4 Test INV-04: Inicial/Preparatoria no depende de una asignatura EGB/BGU.
- [ ] 9.5 Test INV-05: la normalización no altera silenciosamente el significado del contenido fuente.
- [ ] 9.6 Test INV-06: la exportación no modifica los datos del dominio.
- [ ] 9.7 Test INV-07: todo elemento normalizado tiene trazabilidad hacia su fuente.
- [ ] 9.8 Test INV-08: el sistema actual no es afectado por el piloto.

## 10. Verificación

- [ ] 10.1 `pnpm check`: 0 errores TS nuevos sobre la línea base (49 preexistentes).
- [ ] 10.2 `pnpm test`: todos los tests pasan (existentes + nuevos).
- [ ] 10.3 Smoke test manual: AC-01 a AC-10 (ver proposal.md).
