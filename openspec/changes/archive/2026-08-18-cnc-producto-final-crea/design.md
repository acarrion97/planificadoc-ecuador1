## Context

- `ProyectoInterdisciplinarioCNC` (`data/types-cnc.ts:104-115`) hoy no tiene producto final ni actividades; `ProductoAcreditableBT` (`:122-125`) tampoco tiene actividades. La fase Crea se documenta con textos fijos.
- El esquema JSON que la IA debe devolver (`buildPrompt` en `server/cnc-router.ts:204-230`) no incluye esos campos para `proyectoSugerido` ni `productoAcreditableSugerido`.
- La fábrica `planCNCVacio()` está **duplicada** (`app/ver-evaluacion/[id].tsx:45` y el wizard en `app/conecta-nivela-crea/index.tsx`).
- Los generadores **hardcodean** la fase Crea: `lib/pdf-generator.ts:1588-1607` y `lib/cnc-word-generator.ts:387-412` ("Diseño y desarrollo del proyecto interdisciplinario", "Presentación y socialización del proyecto interdisciplinario", "Presentación del producto acreditable").
- `handleGenerate` del wizard ya aplica `aiResult` a los campos vacíos (regla "no sobreescribir") — misma regla se extiende a los campos nuevos.

Ver proposal.md para la motivación y specs para los requisitos de comportamiento.

## Goals / Non-Goals

**Goals:**
- Producto final explícito y actividades reales por semana en la fase Crea, en General y BT.
- Una sola vía de sugerencia IA (el `generate` existente) que proponga los campos nuevos solo si están vacíos.
- Los documentos Word/PDF reflejan el contenido real con fallback para planes legados.
- Compatibilidad total: planes persistidos antes del cambio no se rompen.

**Non-Goals:**
- Unificar General y BT en una abstracción común (espejo, no fusión — naturaleza acreditable técnica ≠ evidencia interdisciplinaria).
- Nuevos endpoints o cambios de persistencia (la tabla CNC guarda JSON opaco; `aiResult` y el plan ya se persisten).
- Integración con la Evaluación Diagnóstica (change `cnc-paso-diagnostico`).
- Inventar currículo: la IA sigue anclada a los catálogos proporcionados.

## Decisions

**D1 — Forma del modelo (espejo, no fusión).**
Extender `ProyectoInterdisciplinarioCNC` con `productoFinal: string`, `actividadesSemana4: string[]`, `actividadesSemana5: string[]`; extender `ProductoAcreditableBT` con `actividadesSemana4: string[]`, `actividadesSemana5: string[]`.
- *Alternativa considerada*: un `ProductoCNC` común para ambas modalidades. Descartada: el producto BT es acreditable/técnico (tipo + descripción) y el de General es una evidencia interdisciplinaria; fusionarlos diluye ambos y añade riesgo de romper el flujo BT existente.

**D2 — Fábricas y planes legados.**
Actualizar ambas copias de `planCNCVacio()` para inicializar los campos nuevos (`productoFinal: ""`, actividades `[]`). Como los tipos TS no validan el runtime, los generadores y la vista de resultado **guardan** contra campos ausentes (planes persistidos antes del cambio): `(p.actividadesSemana4 ?? [])`.
- *Alternativa considerada*: migración/script de datos. Innecesaria: campos aditivos con defaults; el plan ya persiste completo en AsyncStorage y el backup es best-effort.

**D3 — Prompt y esquema IA.**
En `buildPrompt` (`server/cnc-router.ts`): agregar al esquema de `proyectoSugerido` los campos `productoFinal` (string de 1 oración concreta) y `actividadesSemana4`/`actividadesSemana5` (3-5 actividades cada una), y a `productoAcreditableSugerido` las actividades por semana. Instruir explícitamente: derivar producto y actividades de las DCD diagnosticadas/reforzadas, áreas integradas y contexto; NO inventar códigos ni criterios fuera de catálogo; si el docente ya escribió el campo, devolverlo tal cual (reflejo de la regla "no sobreescribir").
- *Alternativa considerada*: segundo endpoint IA dedicado. Descartada: añade latencia, costo y divergencia; el `generate` ya recibe todo el contexto del plan.

**D4 — Regla de merge en el wizard.**
En `handleGenerate`, tras obtener `aiResult`, aplicar los campos nuevos con la regla existente: solo si el campo del plan está vacío. Si la IA omite un campo nuevo (respuesta incompleta), se deja vacío y el docente puede completarlo — sin bloqueo.

**D5 — Generadores Word/PDF.**
- General: añadir fila/línea "Producto final:" y reemplazar las celdas hardcodeadas de SEMANA 4/5 por `actividadesSemana4`/`actividadesSemana5` (guardadas con fallback a los textos legados si la lista está vacía o ausente).
- BT: reemplazar la celda hardcodeada de presentación por las listas reales, mismo fallback.
- El fallback es el texto actual ("Diseño y desarrollo…", "Presentación y socialización…", "Presentación del producto acreditable") para que documentos de planes legados no cambien.

**D6 — Vista de resultado.**
En el paso Resultado del wizard (sección Crea, `app/conecta-nivela-crea/index.tsx` ~líneas 903+), renderizar producto final y las listas S4/S5 (General y BT), con el mismo guard de campos ausentes.

## Risks / Trade-offs

- **La IA puede omitir campos nuevos** → Mitigación: prompt con esquema estricto + `repairJson` existente; si faltan, se tratan como vacíos y el docente completa (spec permite).
- **Regresión en generadores (feature en producción)** → Mitigación: fallback a los textos legados + tests unitarios de ambos generadores con y sin campos nuevos.
- **Doble fábrica `planCNCVacio()`** → Mitigación: actualizar ambas y revisar en el PR que no diverjan; (mejora opcional, no en alcance: centralizarla).
- **Planes legados con datos incompletos** → Mitigación: guards `?? []`/`?? ""` en generadores y vista de resultado.

## Migration Plan

Cambio aditivo de tipos con defaults; sin migración de datos. Los planes existentes se renderizan con fallback. Rollback: revertir el cambio completo; el código previo ignora los campos nuevos (no hay rutas de persistencia alteradas).

## Open Questions

- ¿Actividades agrupadas por fase (planificación/desarrollo/socialización) o lista plana? Se asume lista plana (la IA da forma al contenido); si el feedback del docente pide fases explícitas, es un ajuste de render sin cambiar tipos.
- ¿El producto final debería aparecer como celda propia en la tabla del documento o solo como línea resumen? Se asume línea resumen (junto a título/áreas/descripción); si la revisión visual lo pide, se eleva a celda.