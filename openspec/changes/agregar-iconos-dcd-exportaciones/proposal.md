## Why

La Planificación Semanal ya incrusta los íconos DCD (competencias e inserciones curriculares) junto a cada código de destreza en sus exportaciones Word y PDF. El resto de documentos oficiales (Microcurricular, PCA, PCA Trimestral y Adaptación) no los muestran, lo que genera documentos inconsistentes y obliga al docente a identificar a mano qué competencias/inserciones aplican a cada destreza.

## What Changes

- **Planificación Microcurricular (Word + PDF):** incrustar los íconos DCD junto al código de destreza (`plan.destreza.codigo`) en la columna "DESTREZAS CON CRITERIOS DE DESEMPEÑO".
- **PCA (Word + PDF):** incrustar los íconos DCD junto a cada código DCD de la columna "Destrezas" de cada unidad.
- **PCA Trimestral (Word + PDF):** incrustar los íconos DCD junto a cada código DCD de la columna "Destrezas" de cada unidad.
- **Adaptación Curricular (Word):** incrustar los íconos DCD junto al código de la destreza original.
- **Extraer helpers compartidos** para generar los runs/imágenes de íconos DCD (reutilizando la lógica actual de la semanal) en vez de duplicarla en cada generador.
- **No aplica a Planificación Inicial:** sus códigos (`INI.*`) no existen en el mapeo `iconosPorDestreza.json`, por lo que no mostraría íconos.

## Capabilities

### New Capabilities
- `exportaciones-planificaciones`: comportamiento de los documentos exportados (Word/PDF) de las planificaciones — incluye la incrustación de íconos DCD (competencias/inserciones) junto a las destrezas.

### Modified Capabilities
<!-- Ninguna spec existente. -->

## Impact

- `lib/plan-word-generator.ts` (Word microcurricular)
- `lib/pdf-generator.ts` (PDF microcurricular)
- `lib/pca-word-generator.ts` (Word PCA)
- `lib/pca-pdf-generator.ts` (PDF PCA)
- `lib/pca-trimestral-word-generator.ts` (Word PCA trimestral)
- `lib/pca-trimestral-pdf-generator.ts` (PDF PCA trimestral)
- `lib/adaptacion-word-generator.ts` (Word adaptación)
- `lib/semanal-word-generator.ts` (refactor: mover `iconosDcdRuns` a helper compartido)
- `lib/iconos-base64.ts` o nuevo módulo compartido para los helpers de íconos
- Sin cambios de API, dependencias ni base de datos.