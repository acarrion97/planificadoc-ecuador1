## Why

La pantalla de Currículo Integrado EGB/BGU (`app/curriculo-competencias/egb-bgu-integrado.tsx`) genera las semanas del trimestre con una plantilla determinística: el mismo bloque de texto genérico ("Presentar la actividad mediante una dinámica...", "Desarrollar la actividad principal mediante trabajo guiado...") repetido para cada semana, solo rotando el indicador citado. Al comparar contra un ejemplo oficial (`CNC-Descubriendo-la-unidad-de-la-vida-la-célula-como-base-de-los.docx`) la diferencia de calidad es grande: el ejemplo tiene 8 semanas con actividades distintas, específicas y progresivas (videos, fichas, enlaces a recursos.educacion.gob.ec). El generador de Word ya sabe renderizar ese nivel de detalle cuando existe (rama `clase.inicio/desarrollo/cierre` en `lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts`); lo que falta es producir ese contenido antes de guardar el plan.

## What Changes

- Nueva mutación tRPC (`curriculoCompetencias.generarSemanasIA`) que arma un prompt con datos curriculares reales (competencia, indicadores y saberes del grado exacto, situación de aprendizaje, temas del trimestre) y llama `invokeLLM` para producir un array de semanas (tema, objetivo, actividades de inicio/desarrollo/cierre, recursos, técnica e instrumento de evaluación), validado con un schema Zod.
- Botón "Generar semanas con IA" en el formulario de Currículo Integrado EGB/BGU que llama la mutación antes de guardar, muestra un estado de carga, y llena `clases[]` de cada ámbito seleccionado con el resultado.
- El prompt debe instruir explícitamente a no inventar destrezas/códigos que no vengan del catálogo, y a no fabricar URLs/enlaces salvo que sean genéricos y seguros (para no presentar recursos falsos como oficiales).
- Una sola llamada a la IA por plan (no una por semana), para acotar costo y latencia (~10-30s estimados).

## Capabilities

### New Capabilities
- `curriculo-integrado-generacion-semanal-ia`: generación por IA del contenido semanal (DUA) de una planificación de Currículo Integrado EGB/BGU, a partir de datos curriculares reales del catálogo, antes de guardar el plan.

### Modified Capabilities
(ninguna — no se modifica el shape de `PlanificacionInicialCurriculo` ni los generadores de Word/PDF existentes; el cambio es previo al guardado, llenando `clases[]` con datos reales en vez de vacíos)

## Impact

- `server/curriculo-competencias-router.ts`: nueva mutación `generarSemanasIA`.
- Nuevo archivo de prompt/schema (ej. `server/curriculo-competencias-ia-semanal.ts` o similar) que arma el prompt y valida la respuesta.
- `app/curriculo-competencias/egb-bgu-integrado.tsx`: nuevo botón/paso y estado de carga; llena `clases[]` antes de llamar `createInicial`/`updateInicial` (sin cambios en esas mutaciones).
- Costo/latencia: una llamada a `invokeLLM` (gpt-4o vía el gateway interno) por plan generado.
- No afecta planes ya guardados ni la pantalla de Inicial/Preparatoria.
