## Why

PlanificaDoc ya permite planificar por asignatura (PCA, PCT, semanal, Currículo por Competencias) pero no tiene un instrumento propio para el **Proyecto Interdisciplinar**: el mecanismo con el que el MinEduc pide a EGB Superior y BGU integrar varias áreas alrededor de un producto común (instructivo "Proyecto Interdisciplinar" 2021-2022, reeditado hasta 2025-2026, con 3 fases: Planificación, Gestión, Evaluación). Hoy el sistema solo modela un campo `ProyectoInterdisciplinar` **opcional dentro de una planificación de una sola asignatura** (`data/types-curriculo-competencias.ts:132-141`, usado por `egb-bgu-integrado.tsx`), que no permite un ciclo de vida propio (crear/listar/duplicar/exportar) ni una articulación curricular real entre varias áreas con niveles/grados potencialmente distintos. Sin esto, un docente que coordina un proyecto con colegas de otras áreas debe fabricar el documento a mano fuera de PlanificaDoc.

## What Changes

- Se crea un **módulo nuevo e independiente** "Proyecto Interdisciplinar": tabla propia en Drizzle, router tRPC propio, wizard propio (`app/proyecto-interdisciplinar/*`) — no se toca ni se extiende el `ProyectoInterdisciplinar` embebido existente en Currículo por Competencias.
- El docente elige, al crear el proyecto, la **base curricular**: destrezas con criterios de desempeño (currículo de destrezas, con instructivo oficial verificado) o competencias específicas (Currículo Nacional por Competencias, en piloto Zona 6, sin plantilla oficial de proyecto interdisciplinar publicada todavía) — mismo patrón dual que ya coexiste en el resto del sistema (`egb-bgu.tsx` vs `egb-bgu-integrado.tsx`).
- Selección **libre** de Nivel → Subnivel → Grado → Área, permitiendo múltiples áreas por proyecto y niveles/grados distintos por área (divergencia consciente del instructivo oficial, que solo cubre combinaciones fijas de EGB Superior/BGU — ver design.md).
- Cada elemento curricular seleccionado se guarda **por referencia** (código + metadatos de trazabilidad) al catálogo estático existente (`data/destrezas-*.ts` / `data/competencias-especificas-*.ts`), nunca copiado; se resuelve en lectura con las funciones de búsqueda ya existentes (`buscarPorCodigo`).
- Wizard de 6 pasos: Información general → Áreas participantes → Articulación curricular → Actividades por fase (Planificación/Gestión/Evaluación, alineadas al instructivo oficial) → Evaluación (rúbrica/portafolio) → Revisión y vista previa.
- Asistencia de IA opcional (reutilizando `server/_core/llm.ts` y el patrón anti-alucinación ya probado en `sugerirSituacionAprendizaje`) para sugerir título, pregunta guía, objetivos, actividades, producto final, recursos e instrumentos — nunca códigos curriculares.
- Exportación a Word y PDF reutilizando `docx` y el patrón HTML→PDF existentes, con un generador nuevo dedicado (sin infraestructura de generación paralela).
- CRUD completo: crear, obtener, actualizar, eliminar, duplicar, listar y buscar proyectos.

## Capabilities

### New Capabilities
- `proyecto-interdisciplinar`: módulo de planificación de proyectos interdisciplinares multi-área — selección libre de nivel/subnivel/grado/área con soporte dual destrezas/competencias, articulación curricular por referencia al catálogo estático, actividades organizadas por las 3 fases oficiales (Planificación/Gestión/Evaluación), evaluación con rúbrica/portafolio, asistencia de IA acotada al texto (nunca códigos curriculares), CRUD completo (crear/obtener/actualizar/eliminar/duplicar/listar/buscar) y exportación a Word/PDF.

### Modified Capabilities
_(ninguna — el `ProyectoInterdisciplinar` embebido en Currículo por Competencias no se modifica; no hay capabilities archivadas bajo `openspec/specs/` para ese módulo todavía)._

## Impact

- **Modelo de datos**: una nueva tabla `proyectosInterdisciplinares` en `drizzle/schema.ts` (columnas indexadas para listar/buscar + columna `formData` JSON como fuente de verdad, mismo patrón híbrido que `curriculoCompetenciasPlanificaciones`), con las entidades "áreas participantes", "elementos curriculares referenciados" y "actividades por fase" modeladas como estructuras anidadas tipadas dentro de ese JSON, no como tablas físicas separadas — ver design.md para la justificación. No se modifica ninguna tabla existente.
- **Tipos**: nuevo archivo `data/types-proyecto-interdisciplinar.ts`, reutilizando como building blocks tipos existentes de `data/types-curriculo-competencias.ts` (p. ej. formas equivalentes a `DcdSeleccionada`/`IndicadorSeleccionado`) sin importar ni modificar ese módulo.
- **Backend**: `server/proyecto-interdisciplinar-router.ts` nuevo, montado en `server/routers.ts`; lógica de normalización en `lib/proyecto-interdisciplinar-normalizer.ts` nuevo.
- **Generadores**: `lib/proyecto-interdisciplinar-word-generator.ts` nuevo; extensión de `lib/pdf-generator.ts` o generador HTML dedicado siguiendo el mismo patrón que los módulos existentes.
- **Frontend**: rutas nuevas `app/proyecto-interdisciplinar/*` (lista, wizard de 6 pasos, vista de detalle/exportación), reutilizando `ScreenContainer`, `useColors()` y NativeWind — sin librería de formularios nueva.
- **IA**: nuevas mutations en el router nuevo que reutilizan `invokeLLM`/`repairJson` de `server/_core/llm.ts` (sin cambios a ese archivo).
- **Sin impacto** en `curriculo-competencias-router.ts`, `egb-bgu-integrado.tsx`, el `ProyectoInterdisciplinar` embebido, ni en los changes en curso `curriculo-integrado-egb-bgu-multigrado` / `curriculo-integrado-egb-bgu-ia-semanal` (no comparten wizard ni tabla — ver design.md para la nota de coexistencia).

## Fuentes y nivel de certeza curricular

La investigación de fuentes oficiales del MinEduc para este proposal se hizo con acceso **bloqueado (403)** a `educacion.gob.ec` desde este entorno; los hallazgos provienen de snippets de buscador y réplicas de terceros (Studocu, Slideshare, blogs especializados), no de lectura directa de los PDF primarios. Se confirmó con razonable confianza:
- Existe un instructivo oficial real de "Proyecto Interdisciplinar" (2021-2022, reeditado hasta 2025-2026) con estructura de 3 fases, aplicable solo a EGB Superior/BGU, anclado al currículo de destrezas (hoy "vigente").
- El Currículo Nacional por Competencias (CNC) está en piloto (Zona 6, desde 2024-2025) y no tiene plantilla oficial de proyecto interdisciplinar publicada.
- "Pregunta guía/generadora" no está confirmada como campo oficial de este instructivo específico (aparece en un recurso distinto, ABP para Ferias Escolares).

**Se recomienda que el usuario verifique manualmente** (descarga directa o IP ecuatoriana) el instructivo antes de tratar la estructura de 3 fases y la cadencia de proyectos como definitiva al 100%. design.md detalla qué campos son oficiales, cuáles derivados y cuáles propuestos.
