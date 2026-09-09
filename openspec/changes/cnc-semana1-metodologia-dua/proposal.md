## Why

CNC implementa oficialmente la estrategia **"Conecta, nivela y crea: 5 semanas para arrancar con éxito el año escolar"** (Lineamientos Pedagógicos Costa-Galápagos 2026-2027, MinEduc, sección 2.1, págs. 12-15 — la misma fuente que ya cita `data/types-cnc.ts:2-5`). Esa fuente primaria describe explícitamente: Semana 1 = actividades de adaptación + evaluación diagnóstica (académica en LL/M + socioemocional); Semanas 2-3 = nivelación **y diseño** del proyecto interdisciplinar sobre la base de esos resultados; Semanas 4-5 = **aplicación** de ese proyecto, con evaluación cualitativa formativa. El documento es explícito en que LL y M son las "asignaturas fundacionales" de estas cinco semanas, fortalecidas interdisciplinariamente con otras áreas del plan de estudios.

Hoy la Semana 1 del módulo CNC genera actividades de adaptación y diagnóstico sin ningún marco metodológico declarado, sin calibrar el instrumento de evaluación al grado/subnivel real del estudiante, y sin DUA — a diferencia del resto de la app, donde DUA ya es un principio de primera clase (`data/dua-estrategias.ts`, usado en `topics-router.ts`, `plan-word-generator.ts`, `semanal-word-generator.ts`). Y el proyecto interdisciplinario de Semanas 4-5 ("Crea") — que la propia estrategia oficial exige diseñar desde la Semana 2-3 sobre la base del diagnóstico — solo recibe una lista de nombres de área (`areasIntegradas: ["LL", "M"]`) sin instrucción de fusionarlas en una experiencia común, por lo que la IA tiende a producir dos pistas paralelas (una por área) en vez de la articulación auténtica que pide el documento oficial.

Verificado además contra fuentes complementarias del MinEduc (Lineamientos Curriculares NAP Elemental y Media 2025, Currículo Priorizado Elemental, Caja de herramientas para evaluación diagnóstica, Mapa de la Inclusión en el Currículo Educativo Nacional, ¡3...2...1...Volvemos al Aula! 2025-2026): el equipo docente tiene autonomía profesional para elegir la estrategia metodológica (no hay un método único obligatorio tipo ERCA/fonológico/global para esta transición), pero sí hay respaldo oficial fuerte para exigir que (a) exista una estrategia declarada y coherente con el nivel, (b) el instrumento de evaluación se calibre por subnivel curricular real (el propio MinEduc distingue instrumentos por subnivel — p. ej. "lectura de imágenes" para Elemental vs. paratextos/subrayado para Superior/Bachillerato), (c) DUA se aplique como principio obligatorio (no opcional), y (d) el proyecto/experiencia interdisciplinaria de Crea tenga articulación auténtica entre las áreas, no listas paralelas.

Alcance deliberado: este change trata la implementación de Semana 1 (y el diseño/aplicación del proyecto de Crea que arranca desde ahí) como la ejecución concreta de la estrategia oficial "Conecta, nivela y crea" — no como una regla abstracta de "CNC siempre debe ser interdisciplinario". Semanas 2-3 y 4-5 conservan el resto de sus reglas ya existentes (co-nivelación, `esEvaluacionFormativaOficial`, etc.) sin cambios fuera de la instrucción de fusión de áreas.

## What Changes

- El prompt de Semana 1 (Conecta) exige que la IA declare una estrategia/metodología pedagógica explícita y coherente con la actividad (sin imponer un método único) — reemplaza la generación de actividades sueltas sin marco.
- El prompt traduce grado/subnivel a expectativas curriculares reales antes de pedir el diagnóstico e instrumento de evaluación, en vez de pasarle a la IA solo el string crudo del grado. La calibración es dependiente del contexto (Elemental/Media/Superior por grado+subnivel+destreza; Bachillerato por curso+área; Bachillerato Técnico por figura profesional/módulo — **no** por una heurística de edad, que no aplica a BT).
- DUA (`data/dua-estrategias.ts`) se incorpora como principio obligatorio en las actividades e instrumentos de Semana 1, siguiendo el mismo patrón ya usado en `topics-router.ts` (la IA declara qué principios DUA cubre cada actividad/instrumento; el servidor normaliza para garantizar cobertura de los 3 principios).
- Los apoyos visuales (incluidos pictogramas) se piden como recurso **contextual** cuando la destreza o el perfil del estudiante lo requiera para reducir barreras de acceso — no como obligación uniforme en todo instrumento.
- El prompt de Semanas 4-5 (Crea) reemplaza la instrucción actual de "áreas a integrar" por una instrucción explícita de fusión: cuando se indiquen varias áreas, la IA debe diseñar una experiencia/producto común donde las destrezas de las áreas se articulen alrededor de la misma situación — no actividades independientes por área salvo que se solicite expresamente.
- Sin cambios de datos persistidos ni de esquema: es una mejora del prompt y de las instrucciones de generación IA, no de `data/types-cnc.ts`.

## Capabilities

### New Capabilities

- `cnc-semana1-metodologia-dua`: Calibración curricular, metodología declarada, DUA obligatorio y apoyos visuales contextuales en la Semana 1 (Conecta) de CNC, y fusión interdisciplinaria real en el proyecto de Semanas 4-5 (Crea) cuando se soliciten áreas integradas.

### Modified Capabilities

- Ninguna: no existen specs previas de CNC que cubran metodología/DUA/calibración de Semana 1 — es una capability nueva, aditiva sobre el flujo existente de `cnc-paso-diagnostico` y `cnc-producto-final-crea`.

## Impact

- **Backend tRPC**: `server/cnc-router.ts` — `buildPrompt` (sección SEMANA 1, sección SEMANAS 4-5, instrucciones importantes) y el esquema JSON que la IA debe devolver (nuevos campos: metodología declarada, DUA por actividad/instrumento).
- **Tipos**: `data/types-cnc.ts` — `Semana1CNC` (+`metodologiaDeclarada` o campo equivalente, +DUA por actividad), `ConectaNivelaCreaAiResult` (+DUA en las sugerencias de Semana 1).
- **Generadores**: `lib/cnc-word-generator.ts` y `lib/pdf-generator.ts` (sección CNC) — reflejar la metodología declarada y los indicadores DUA en el documento generado, siguiendo el mismo patrón visual (cuadrados de color) que ya usan `plan-word-generator.ts`/`semanal-word-generator.ts` para DUA.
- **Frontend**: `app/conecta-nivela-crea/index.tsx` — paso 1 (Conecta) con campo de metodología y visualización DUA; aplicar sugerencias respetando "no sobreescribir contenido manual".
- **Compatibilidad**: cambio aditivo; planes CNC existentes persistidos (JSON) siguen siendo válidos ya que los campos nuevos son opcionales o se completan con valores por defecto en la UI.
