## Why

La fase **Semanas 4-5 — Crea** del módulo "Conecta, Nivela y Crea" planifica a medias: en modalidad General el proyecto interdisciplinario **no declara un producto final explícito** (mientras que BT sí tiene `ProductoAcreditableBT`), y las actividades del proyecto son **cadenas de texto fijas** ("Diseño y desarrollo del proyecto interdisciplinario" / "Presentación y socialización del proyecto interdisciplinario") insertadas literalmente en los generadores Word/PDF. El sistema no está planificando realmente el CREA; imprime dos etiquetas genéricas. El resultado es un documento con poca coherencia pedagógica para un requisito formal del MinEduc.

## What Changes

- **Nuevo campo `productoFinal`** en `ProyectoInterdisciplinarioCNC` (modalidad General): la IA lo **sugiere**, el docente puede **editarlo**, y se mantiene la regla existente *"la IA solo completa campos vacíos; nunca reemplaza contenido escrito manualmente"*.
- **Actividades reales del proyecto**: nuevos campos `actividadesSemana4` y `actividadesSemana5` en **ambas** modalidades (`ProyectoInterdisciplinarioCNC` para General, `ProductoAcreditableBT` para BT), con propuesta de fases (planificación, organización de equipos, investigación, elaboración, revisión, finalización, socialización, presentación, reflexión).
- **La IA propone** `productoFinal` y las actividades S4/S5 fundamentadas en: DCD diagnosticadas en Semana 1, DCD reforzadas, áreas integradas, producto final y contexto del proyecto. Solo llena campos vacíos.
- **UI paso 3 (Crea)**: campos editables para `productoFinal` (General) y para `actividadesSemana4`/`actividadesSemana5` (General y BT), coherentes con la regla "no sobreescribir" al aplicar las sugerencias de IA.
- **Vista de resultado y generadores**: el paso Resultado muestra los campos nuevos y los generadores **PDF (`lib/pdf-generator.ts`) y Word (`lib/cnc-word-generator.ts`)** reemplazan las cadenas fijas por las listas reales de actividades y documentan el producto final.
- **Tests** del nuevo comportamiento (tipos, aplicación de sugerencias sin sobrescritura, render en generadores).

## Capabilities

### New Capabilities

- `cnc-producto-final-crea`: Planificación explícita de la fase Crea del programa "Conecta, Nivela y Crea" — producto final declarado y actividades de las Semanas 4-5 sugeridas por IA y editables por el docente, en modalidad General y Bachillerato Técnico, reflejadas en los documentos Word/PDF.

### Modified Capabilities

- Ninguna: no existen specs previas de CNC y el cambio es aditivo sobre el flujo existente.

## Impact

- **Tipos**: `data/types-cnc.ts` — `ProyectoInterdisciplinarioCNC` (+`productoFinal`, `actividadesSemana4`, `actividadesSemana5`), `ProductoAcreditableBT` (+`actividadesSemana4`, `actividadesSemana5`), y la estructura `ConectaNivelaCreaAiResult` no cambia su contrato raíz (los campos nuevos llegan dentro de `proyectoSugerido`/`productoAcreditableSugerido`).
- **Backend tRPC**: `server/cnc-router.ts` — `buildPrompt` (esquema JSON que la IA debe devolver para `proyectoSugerido` y `productoAcreditableSugerido`) e instrucciones de sistema para proponer producto/actividades derivados del diagnóstico. Sin cambios de ruta ni de persistencia (JSON opaco ya guardado).
- **Frontend**: `app/conecta-nivela-crea/index.tsx` — paso 3 (Crea) con los campos nuevos; `handleGenerate` aplica las sugerencias respetando "no sobreescribir"; paso Resultado renderiza producto final y actividades S4/S5.
- **Generadores**: `lib/pdf-generator.ts` (tabla Semanas 4-5) y `lib/cnc-word-generator.ts` (sección proyecto/producto) — celdas con datos reales en vez de literales.
- **Tests**: `__tests__/cnc-*.test.ts` (esquema de tipos, merge de sugerencias sin sobrescritura, salida de generadores).
- **Compatibilidad**: cambio aditivo; planes CNC existentes persistidos (JSON) siguen siendo válidos al ser los campos nuevos opcionales o rellenados con valores por defecto en la UI.