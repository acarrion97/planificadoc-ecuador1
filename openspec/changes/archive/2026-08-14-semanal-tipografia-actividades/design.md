## Context

Ver proposal.md - Why. Los dos generadores de la planificación semanal usan unidades distintas:

- **Word** (`lib/semanal-word-generator.ts`): `docx` usa half-points (`size: 18` = 9pt). Las actividades ERCA se renderizan en `actividadPara` (línea ~176).
- **PDF** (`lib/pdf-generator.ts`, `generarHTMLSemanal`): HTML a `font-size: 9px`; al imprimir en A4, 1px ≈ 0.75pt → 9px ≈ 6.75pt. Las actividades se renderizan en el `<li>` del bloque ERCA (línea ~1060).

La tabla es `fixed` (Word `TableLayoutType.FIXED`, HTML `table-layout:fixed`), así que el texto envuelve: subir la fuente nunca desborda horizontalmente, solo crece la fila verticalmente.

## Goals / Non-Goals

**Goals:**
- Actividades ERCA legibles en ambos documentos (≥ ~8.5pt en papel).
- Misma sensación de lectura entre PDF y Word.
- Crecimiento de páginas acotado (~+1 página por semana en cada formato).

**Non-Goals:**
- No cambiar cabeceras de fase, colores, cuadritos DUA, leyenda, títulos ni columnas.
- No rebalancear anchos de columna (`COL` en Word, widths en HTML).
- No modificar la estructura de datos, el prompt de la IA ni el número de actividades por fase.
- No tocar los demás generadores (PCA, trimestral, inicial, adaptaciones).

## Decisions

**D1 — Word: actividades a 10pt.** En `actividadPara` (semanal-word-generator.ts:176) el `TextRun` de la actividad pasa de `size: 18` a `size: 20` (=10pt). Se mantiene el `text` con el `num.` y los cuadritos DUA a `size: 14` (7pt). *Alternativa descartada*: subir también las cabeceras de fase — añade jerarquía pero crece el documento innecesariamente para este objetivo.

**D2 — PDF: actividades a ~8.5pt efectivos.** En `generarHTMLSemanal`, el `<li>` de actividades (pdf-generator.ts:1060) pasa de `font-size: 9px` a `font-size: 12px` (~9pt en papel). Al revisar impresión, si aún se percibe pequeña se ajusta a `13px` (~9.75pt); no bajar de `11px` (~8.25pt). *Alternativa descartada*: llevarlas a 13.33px (=10pt exactos) — sube ~60% de altura por hora y duplica el salto del Word, alargando el PDF ~3 páginas.

**D3 — Textos afines ERCA.** En Word, el objetivo de clase (semanal-word-generator.ts:902-904) y el `faseHeaderPara` se mantienen en `size: 18` (9pt) para conservar jerarquía respecto a las actividades (10pt). En PDF, el objetivo de clase y cabeceras de fase se mantienen a `9px`. El cuerpo de otras columnas (DCD, indicadores, recursos, evaluación) permanece igual.

## Risks / Trade-offs

- **Crecimiento vertical del PDF** → D2 limita el tamaño a ~8.5-9pt (crecimiento +20-25%), evitando pasar de ~5 a ~8 páginas.
- **Desalineación tipográfica entre formatos** → aunque PDF a 12px≈9pt no es exactamente 10pt del Word, la diferencia perceptiva es mínima; se documenta en tasks.md el valor exacto usado para mantener ambos coherentes.
- **Verificación empírica**: la estimación de líneas/páginas depende del texto real generado por la IA (18 actividades/hora, ~60-70 chars c/u). Mitigación: al implementar, generar una semana de prueba y revisar el conteo de páginas antes de cerrar.

## Migration Plan

- Deploy único: se regeneran PDF y Word con los nuevos tamaños al momento de exportar (generadores puros, sin estado ni migración de datos).
- Rollback: revertir las dos líneas de tamaño en los generadores; no afecta datos guardados.
- Validación: `pnpm check` (sin aumentar los 49 errores TS preexistentes) y `pnpm test` sobre generadores (28/28 esperados).

## Open Questions

Ninguna bloqueante. El valor exacto de `px` en PDF (11 vs 12 vs 13) se confirma visualmente durante la implementación sin cambiar el enfoque.
