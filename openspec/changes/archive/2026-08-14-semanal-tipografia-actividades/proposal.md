## Why

Las actividades ERCA de la planificación semanal se imprimen diminutas. El generador PDF (HTML) usa `font-size: 9px`, que al imprimir equivale a ~6.75pt, mientras que el generador Word usa 9pt: el mismo número "9" produce tamaños físicos distintos (25% más pequeño en PDF). Los docentes reportan que el bloque ERCA es difícil de leer al entregar el documento.

## What Changes

- **Word (.docx)** — `lib/semanal-word-generator.ts`: subir las actividades ERCA de 9pt a **10pt** (`size: 20` en half-points), manteniendo cabeceras de fase y demás elementos sin cambios.
- **PDF (HTML)** — `lib/pdf-generator.ts` (`generarHTMLSemanal`): subir las actividades ERCA de `9px` (~6.75pt) a **~8.5pt efectivos** (≈ `11-12px`), para igualar la sensación de lectura del Word sin duplicar el número de páginas.
- No se modifican columnas, anchos de tabla, colores, cabeceras de fase, cuadritos DUA ni la estructura de datos. La tabla `fixed` envuelve el texto, por lo que no hay desbordes horizontales; solo crece la altura vertical.

## Capabilities

Cambio puramente tipográfico en dos generadores de documentos; no altera comportamiento funcional ni requisitos. Sin specs previas en el repo, se opta por `skip_specs: true`.

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna.

## Impact

- `lib/semanal-word-generator.ts` — tamaño de `TextRun` en `actividadPara` (y textos ERCA en columnas afines si se decide consistencia total).
- `lib/pdf-generator.ts` — `font-size` de actividades ERCA dentro de `generarHTMLSemanal`.
- Crecimiento estimado de páginas: Word ≈ +15% de altura por hora (~1 página adicional por semana); PDF ≈ +20-25% (~1 página adicional por semana). Ver `design.md`.
- Sin cambios en API, base de datos, prompts de IA ni tipos de datos.
