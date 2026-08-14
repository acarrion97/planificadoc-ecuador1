## 1. Word: actividades ERCA a 10pt

- [ ] 1.1 En `lib/semanal-word-generator.ts`, en `actividadPara` (~línea 176), cambiar el `TextRun` de la actividad de `size: 18` a `size: 20` (10pt), manteniendo el `num.` y los cuadritos DUA a `size: 14`.
- [ ] 1.2 Verificar que el `faseHeaderPara` y el objetivo de clase sigan en `size: 18` (9pt) para conservar jerarquía respecto a las actividades.

## 2. PDF: actividades ERCA a ~8.5-9pt efectivos

- [ ] 2.1 En `lib/pdf-generator.ts`, dentro de `generarHTMLSemanal` (~línea 1060), cambiar el `<li>` de actividades de `font-size: 9px` a `font-size: 12px` (~9pt en papel).
- [ ] 2.2 Revisar impresión de una semana de prueba; si la actividad aún se percibe pequeña, ajustar a `13px`; no bajar de `11px`. Dejar el valor final documentado en un comentario breve del generador.

## 3. Verificación

- [ ] 3.1 Ejecutar `pnpm check` y confirmar que los errores TS no aumentan (49 preexistentes).
- [ ] 3.2 Ejecutar `pnpm test` sobre los generadores de planificación semanal y confirmar 28/28 (o sin regresiones).
- [ ] 3.3 Generar una semana de prueba y confirmar crecimiento de páginas acotado (≈ +1 página) en ambos formatos.
