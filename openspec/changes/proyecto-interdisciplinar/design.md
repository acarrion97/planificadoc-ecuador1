## Context

Ver proposal.md - Why para la motivación. Constraints relevantes del repo (confirmadas por exploración de código, no supuestas):

- Stack: Expo/React Native Web + expo-router (`app/`), tRPC (`server/*-router.ts` montados en `server/routers.ts`), Drizzle sobre MySQL (`drizzle/schema.ts`, sin `relations()` reales — cero foreign keys declaradas en todo el schema).
- El patrón de persistencia establecido para módulos de planificación (`curriculoCompetenciasPlanificaciones`, `pcaDocuments`, `connectaNivelaCrea`, `evaluacionesDiagnosticas`) es **híbrido**: columnas indexadas para list/búsqueda + una columna `formData`/`form` de texto JSON como fuente de verdad del dominio completo. Ninguna tabla del repo usa relaciones físicas multi-tabla con FKs para estructuras anidadas repetibles (arrays de sub-entidades siempre viven dentro del JSON).
- El catálogo curricular (destrezas 2016 y competencias específicas CNC) vive exclusivamente en archivos estáticos `data/*.ts`, resuelto por función (`buscarPorCodigo`), nunca por join en BD.
- No hay tabla de instituciones ni multi-tenencia real: la partición de datos es por `sessionId` (email o deviceId), e "institución" es texto libre.
- Cada generador Word/PDF (`lib/*-word-generator.ts`, `lib/*-pdf-generator.ts`) es autocontenido; no existe una capa de helpers compartida entre generadores.
- `server/_core/llm.ts` expone `invokeLLM`/`repairJson`, ya usados con un patrón anti-alucinación probado (nunca pedir códigos curriculares a la IA).

## Goals / Non-Goals

**Goals:**
- Dar a Proyecto Interdisciplinar un ciclo de vida propio e independiente (crear/listar/editar/duplicar/eliminar/exportar) sin acoplarse al `ProyectoInterdisciplinar` embebido de Currículo por Competencias.
- Mantener consistencia con los patrones ya probados del repo (persistencia híbrida, capas router→normalizer→generador, IA acotada a texto) para minimizar riesgo y curva de aprendizaje.
- Permitir articulación curricular multi-área con selección libre de nivel/subnivel/grado/área, referenciando el catálogo estático sin duplicarlo.
- Dejar trazable en las specs qué campos son oficiales (instructivo 2021-2022), derivados o propuestos, dado el acceso limitado (403) a la fuente primaria.

**Non-Goals:**
- No se introduce una tabla de instituciones ni un catálogo curricular relacional — sigue el patrón existente (texto libre + `data/*.ts` estático).
- No se restringe la primera versión a las combinaciones fijas de áreas de EGB Superior/BGU del instructivo oficial (decisión ya validada con el usuario: selección libre).
- No se modifica el `ProyectoInterdisciplinar` embebido ni ningún archivo de Currículo por Competencias.
- No se introduce una capa `repositories/` separada del router (ver Decisión 3).
- No se implementa colaboración en tiempo real entre los docentes participantes de un proyecto (queda como observación de texto libre, no como feature).

## Decisions

### 1. Modelo de datos: tabla única híbrida, no normalización física multi-tabla

El pedido original sugiere 4 tablas (proyecto, áreas, elementos curriculares, actividades). Se decide **no** crear 4 tablas físicas y en su lugar seguir el patrón ya establecido por `curriculoCompetenciasPlanificaciones`: una tabla `proyectosInterdisciplinares` con columnas indexadas + columna `formData` JSON que contiene las 3 sub-entidades (`areas[]`, cada una con sus `elementosCurriculares[]`, y `actividades[]`) como estructuras tipadas anidadas.

- **Por qué**: ninguna tabla del repo usa relaciones físicas multi-tabla para arrays repetibles; introducir la primera sería un patrón arquitectónico nuevo sin precedente, con mayor superficie de migración (4 tablas + índices + integridad referencial manual, ya que no hay `relations()` en Drizzle en este repo) para un beneficio (queries relacionales) que ningún módulo actual necesita — el listado/búsqueda ya funciona sobre columnas indexadas del nivel superior.
- **Alternativa considerada**: 4 tablas físicas con FKs (`.references()`), como en el modelo conceptual del pedido. Se descarta para la v1 por el salto de complejidad y porque el resto del sistema no tiene precedente de joins entre tablas de planificación — se puede reconsiderar en una fase futura si aparece una necesidad real de consultar/filtrar por elemento curricular a través de proyectos (ver Open Questions).
- **Columnas indexadas propuestas** en `proyectosInterdisciplinares`: `id`, `sessionId`, `titulo`, `baseCurricular` (`"destrezas" | "competencias"`), `nivelPrincipal`/`subnivelPrincipal` (del área con nivel más bajo, solo para filtros de lista), `estado` (`"borrador" | "generado"`), `institucion`, `createdAt`, `updatedAt`, más `formData: text` con el objeto completo (`ProyectoInterdisciplinarPlan` — ver `data/types-proyecto-interdisciplinar.ts`).
- Igual que en `curriculoCompetenciasPlanificaciones`, la tabla se crea con `ensureProyectoInterdisciplinarTable()` (CREATE TABLE IF NOT EXISTS) siguiendo el patrón ya usado, en vez de depender solo de una migración Drizzle — consistencia con el módulo más reciente y evita mezclar dos convenciones de creación de tabla en el mismo router.

### 2. Trazabilidad curricular por referencia, nunca por copia

Cada elemento curricular seleccionado (`ElementoCurricularReferenciado`) guarda solo: `codigo`, `curriculumVersion` (`"destrezas-2016" | "cnc-2024"`), `area`, `nivel`, `subnivel`, `grado`, y opcionalmente `sourceDocument` — nunca la descripción completa, criterios ni indicadores. La descripción/criterios/indicadores se resuelven **en tiempo de lectura** (wizard, revisión, generación de documento) llamando a `buscarPorCodigo`/`buscarCompetenciaPorCodigo` del catálogo estático existente.

- **Por qué**: evita duplicar información curricular ya presente en `data/*.ts` (mandato explícito del pedido original) y evita que una planificación guardada quede desactualizada si el catálogo cambia de forma incompatible — igual razonamiento ya aplicado en `curriculo-integrado-egb-bgu-multigrado/proposal.md` para su bloque curricular resuelto por grado.
- **Trade-off**: si un código se elimina del catálogo en el futuro, un proyecto antiguo mostraría un elemento "huérfano". Mitigación: el normalizador debe manejar `buscarPorCodigo` devolviendo `undefined` sin romper el render, mostrando el código crudo con una marca de "elemento no encontrado en el catálogo actual".

### 3. Capas de backend: sin `repositories/` separado, router + normalizer + generador

Se sigue el patrón plano ya usado por `curriculo-competencias-router.ts` (todo el CRUD y las validaciones Zod viven en el router; la normalización de payload vive en un archivo `*-normalizer.ts` separado; la generación de documentos vive en `lib/*-word-generator.ts`/`*-pdf-generator.ts`). No se introduce una carpeta `repositories/`, `controllers/` ni `services/` nueva.

- **Por qué**: el repo no tiene ese patrón de capas en ningún módulo existente; introducirlo solo para este módulo generaría inconsistencia sin beneficio claro (no hay lógica de acceso a datos compleja que amerite un repository — es una tabla con Drizzle directo). La única separación real que sí vale la pena y que el repo ya usa es router (I/O + validación) vs. normalizer (transformación de payload) vs. generador (documento) — se mantiene.
- **Alternativa considerada**: separar `server/proyecto-interdisciplinar-service.ts` de un router más delgado, similar a `dcd-desagregacion-service.ts` (única excepción existente en el repo). Se descarta para v1 por tamaño del módulo; puede revisarse si el router crece más allá de lo manejable (referencia: `curriculo-competencias-router.ts` tiene 831 líneas y no se ha separado en servicio).

### 4. Base curricular dual configurable

El campo `baseCurricular` en el proyecto determina qué catálogo se usa para resolver elementos curriculares (`data/destrezas-*.ts` vía `Destreza`/`buscarPorCodigo`, o `data/competencias-especificas-*.ts` vía `competenciasDeGrado`/función equivalente de búsqueda por código). El wizard bloquea mezclar códigos de ambas bases dentro de un mismo proyecto (igual regla que ya aplica `curriculo-integrado-egb-bgu-multigrado` para no mezclar subniveles distintos).

- **Por qué**: es el único patrón que ya coexiste sin fricción en el repo (`egb-bgu.tsx` vs `egb-bgu-integrado.tsx`), y evita inventar una base curricular "unificada" que ninguna fuente oficial define hoy (el instructivo real de Proyecto Interdisciplinar está en destrezas; el CNC no tiene plantilla propia todavía — ver proposal.md, Fuentes).

### 5. IA acotada a texto, patrón anti-alucinación replicado

Nueva mutation `sugerirProyecto` en el router nuevo, modelada exactamente sobre `sugerirSituacionAprendizaje` (`curriculo-competencias-router.ts:746-829`): recibe las áreas y elementos curriculares **ya seleccionados** por el docente (resueltos del catálogo, solo lectura para el prompt), devuelve únicamente los campos de texto pedidos por `input.campos` (título, preguntaGuia, objetivoGeneral, productoFinal, actividades sugeridas, recursos, instrumentos), con instrucción explícita en el prompt de no inventar códigos curriculares, y post-filtrado de la respuesta a las claves pedidas.

- **Por qué**: patrón ya probado en producción en este mismo repo; reinventar uno nuevo sin necesidad violaría la consistencia y añadiría riesgo de alucinación no mitigado.

### 6. Generación documental

Nuevo `lib/proyecto-interdisciplinar-word-generator.ts`, copiando la estructura de tablas/encabezados/colores de `curriculo-competencias-egb-bgu-integrado-word-generator.ts` (el más reciente) pero con secciones propias: datos informativos, áreas participantes (una sub-tabla por área con sus elementos curriculares), actividades agrupadas por fase (Planificación/Gestión/Evaluación), evaluación (rúbrica/portafolio), firmas de docentes participantes. Para PDF, se sigue el patrón HTML existente (`lib/pdf-generator.ts` u otro generador HTML dedicado si la estructura no encaja en el genérico), sin introducir una librería de PDF nueva.

- **Por qué**: no existe una capa de helpers compartida entre generadores en el repo (confirmado por exploración) — replicar el patrón más reciente es más consistente que crear una abstracción nueva que nada más usaría este módulo.

## Risks / Trade-offs

- **[Riesgo] Incertidumbre curricular**: la estructura de 3 fases y la cadencia de proyectos vienen de snippets de buscador, no del PDF primario (bloqueado con 403). → **Mitigación**: las specs marcan explícitamente qué es oficial/derivado/propuesto; el campo de fase (`"planificacion" | "gestion" | "evaluacion"`) es editable/extensible sin migración si el usuario verifica una estructura distinta tras revisar el documento original.
- **[Riesgo] `formData` JSON como fuente de verdad** dificulta queries agregadas (ej. "todos los proyectos que usan el código M.4.2.1"). → **Mitigación**: no es un requisito actual de ningún módulo del repo; si aparece, se puede añadir una tabla ligera de índice secundario (`proyectoInterdisciplinarCodigos: {proyectoId, codigo}`) sin tocar el modelo de dominio.
- **[Riesgo] Divergencia del formato libre vs. el instructivo oficial** (que solo cubre EGB Superior/BGU con áreas fijas) — un proyecto libre en Inicial/Preparatoria con currículo de destrezas no tendría respaldo oficial directo. → **Mitigación**: ya es una decisión consciente y validada con el usuario; se documenta en proposal.md y se marca en la UI que el formato de exportación sigue el patrón oficial "cuando aplica" (EGB Superior/BGU) y un formato genérico coherente en el resto de casos.
- **[Riesgo] Elemento curricular "huérfano"** si el catálogo estático cambia. → Mitigación ya descrita en Decisión 2.
- **[Trade-off] No separar servicio del router** simplifica v1 pero puede requerir refactor si el módulo crece (ver Decisión 3, alternativa descartada pero revisable).

## Migration Plan

- Migración Drizzle nueva y aditiva (`drizzle/00XX_proyecto_interdisciplinar.sql` vía `drizzle-kit generate`) que solo crea la tabla `proyectos_interdisciplinares` — no altera ninguna tabla existente, sin pasos de backfill.
- Rollback: `DROP TABLE proyectos_interdisciplinares` es seguro en cualquier momento antes de uso en producción (tabla nueva, sin FKs entrantes de otras tablas).
- Despliegue puramente aditivo: nueva ruta en `server/routers.ts`, nuevas rutas `app/proyecto-interdisciplinar/*`, sin flags de feature ni cambios de comportamiento en módulos existentes.

## Open Questions

- ¿La cadencia real de proyectos por año lectivo (p. ej. "8 científicos + 8 humanísticos" vs. "2+2 por parcial", ambas variantes aparecieron en fuentes secundarias) debe reflejarse como una validación o solo como texto informativo en el wizard? No cambia el modelo de datos ni las specs — se puede resolver con la verificación manual del instructivo que se le pidió al usuario, antes o durante la implementación de la Fase 6 (Actividades por fase).
- ¿Debe el listado de proyectos (`app/proyecto-interdisciplinar/index.tsx`) usar el `sessionId` real del dispositivo/usuario desde el inicio, o replicar el `sessionId: "default"` hardcodeado que hoy tiene `app/curriculo-competencias/index.tsx:47`? Se recomienda usar el `sessionId` real (no replicar lo que parece un bug/pendiente en el módulo existente) — a confirmar en tasks.md al implementar el listado.
