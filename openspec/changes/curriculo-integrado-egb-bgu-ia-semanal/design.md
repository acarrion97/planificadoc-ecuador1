## Context

`app/curriculo-competencias/egb-bgu-integrado.tsx` guarda cada ámbito con `clases[]` vacío (o con un único tema tomado literalmente de "Temas del trimestre"). El generador de Word (`lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts`) ya tiene dos rutas: si `clase.inicio/desarrollo/cierre` vienen llenos usa ese contenido tal cual; si no, cae a una plantilla fija que solo rota el indicador citado (ver `else if (gradoData || ce)` en la función principal). Esta propuesta llena la primera ruta con contenido real generado por IA, sin tocar el generador de Word ni el shape de `PlanificacionInicialCurriculo`/`ClaseInicialCurriculo` (ya soporta `numero, tema, objetivoEspecifico, metodologia, inicio[], desarrollo[], cierre[], metodoEvaluacion[]`).

El patrón de `invokeLLM` + `repairJson` (`server/_core/llm.ts`) ya está probado en 9 routers, incluido `cnc-router.ts`, que muestra el estilo de prompt (contexto curricular real + reglas explícitas + reintentos) a seguir aquí. Ver proposal.md - Why para la motivación (comparación contra el ejemplo oficial CNC-Descubriendo-la-unidad-de-la-vida...).

## Goals / Non-Goals

**Goals:**
- Generar contenido semanal específico y variado (no repetido) para un plan de Currículo Integrado EGB/BGU, usando `invokeLLM`.
- Una sola llamada por plan completo.
- El docente revisa y decide guardar; la generación no guarda nada por sí sola.

**Non-Goals:**
- No se rediseña el generador de Word ni el modelo de datos de la planificación.
- No se generan recursos con URLs verificadas contra un catálogo externo real (solo se evita fabricar URLs específicas).
- No se aplica a la pantalla de Inicial/Preparatoria (queda fuera de este cambio; el mismo patrón podría reutilizarse después si se decide).
- No se reintenta automáticamente la IA en el cliente; el reintento en la llamada HTTP ya lo maneja `invokeLLM` (429/5xx).

## Decisions

**Una mutación tRPC dedicada (`generarSemanasIA`) en vez de generar dentro de `createInicial`/`updateInicial`.**
Mantiene el guardado determinístico y rápido como hoy; la generación por IA es un paso explícito y opcional que el docente dispara y puede revisar/reintentar antes de guardar, sin acoplar el guardado a la disponibilidad del servicio de IA. Alternativa descartada: generar automáticamente al guardar — se rechaza porque agrega latencia obligatoria (~10-30s) a toda creación de plan y complica el manejo de errores (¿qué se guarda si la IA falla?).

**Un array de semanas por competencia seleccionada, no un array global.**
Cuando el docente elige más de una competencia específica (ámbitos múltiples), cada ámbito necesita su propio contenido semanal coherente con SUS indicadores/saberes. El prompt recibe todas las competencias seleccionadas y su catálogo, y la respuesta se estructura como `{ ambitos: [{ competenciaCodigo, semanas: [...] }] }` para poder mapear el resultado de vuelta a cada ámbito sin ambigüedad.

**Schema de salida forzado con `response_format` (JSON schema vía Zod), no parseo de texto libre.**
Mismo patrón ya usado por `cnc-router.ts` y otros; evita parseo frágil y permite usar `repairJson` como red de seguridad si la respuesta se corta.

**El prompt cita el catálogo real (indicadores/saberes del grado exacto) y prohíbe explícitamente inventar códigos o URLs específicas.**
Mitiga el riesgo de alucinación señalado en la comparación contra el ejemplo oficial (el ejemplo cita enlaces reales de `recursos.educacion.gob.ec`; sin esta restricción la IA podría inventar enlaces con la misma apariencia de autoridad).

## Risks / Trade-offs

- **Latencia (~10-30s) y costo por generación** → Mitigación: acción explícita del docente (no automática al guardar), con estado de carga claro; una sola llamada por plan, no por semana.
- **Calidad variable en la primera versión del prompt** → Mitigación: se documenta como esperado en tasks.md un paso de prueba manual con 2-3 competencias de materias distintas y ajuste iterativo del prompt antes de considerar el cambio terminado.
- **La IA podría igual inventar contenido plausible pero incorrecto** (p. ej. datos científicos erróneos) → Mitigación: el docente revisa antes de guardar (no hay guardado automático); el pie de página ya existente ("es responsabilidad del docente validar...") sigue aplicando.
- **Respuesta JSON truncada por límite de tokens en trimestres largos (10+ semanas)** → Mitigación: usar `repairJson` (ya disponible) y fijar `maxTokens` generosamente; si persiste, considerar en una iteración futura dividir la generación en 2 llamadas (no en el alcance de este cambio).

## Open Questions

- Copy exacto del botón/paso en el formulario (ej. "Generar semanas con IA" vs "Sugerir contenido semanal") — decidir al implementar, no cambia el contrato.
- Si conviene permitir editar el resultado generado antes de guardar (probable que sí, pero el formulario actual no tiene edición de `clases[]` en el paso 3/4) — evaluar al implementar; no bloquea el diseño de la mutación.
