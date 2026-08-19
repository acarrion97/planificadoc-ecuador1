## 1. Helpers compartidos

- [x] 1.1 Crear `lib/dcd-iconos.ts` con `iconosDcdRuns(codigo, size?)` (Word ImageRun, default 16) e `iconosDestrezaHTML(codigo, size?)` (HTML `<img>`, default 14), reutilizando `obtenerIconosDestreza` y `ICONOS_DCD_BASE64`.
- [x] 1.2 Refactorizar `lib/semanal-word-generator.ts`: quitar el helper local `iconosDcdRuns` e importarlo desde `lib/dcd-iconos.ts` (sin cambiar tamaño/comportamiento).
- [x] 1.3 Refactorizar `lib/pdf-generator.ts`: quitar el helper local `iconosDestrezaHTML` e importarlo desde `lib/dcd-iconos.ts` (sin cambiar tamaño/comportamiento).

## 2. Planificación Microcurricular

- [x] 2.1 `lib/plan-word-generator.ts`: añadir `iconosDcdRuns(plan.destreza.codigo)` en la celda de destrezas (junto al código, antes o después de la descripción, consistente con la semanal).
- [x] 2.2 `lib/pdf-generator.ts`: añadir `iconosDestrezaHTML(plan.destreza.codigo)` junto a `<strong>${plan.destreza.codigo}</strong>` en la celda de destrezas (mantener los badges de `competencias`).

## 3. PCA

- [x] 3.1 `lib/pca-word-generator.ts`: añadir `iconosDcdRuns(d.codigo)` al párrafo de cada DCD en la columna Destrezas.
- [x] 3.2 `lib/pca-pdf-generator.ts`: añadir `iconosDestrezaHTML(d.codigo)` junto a cada `<b>${d.codigo}</b>` en la columna Destrezas.

## 4. PCA Trimestral

- [x] 4.1 `lib/pca-trimestral-word-generator.ts`: añadir `iconosDcdRuns(d.codigo)` al párrafo de cada DCD en la columna Destrezas.
- [x] 4.2 `lib/pca-trimestral-pdf-generator.ts`: añadir `iconosDestrezaHTML(d.codigo)` junto a cada `<b>${d.codigo}</b>` en la columna Destrezas.

## 5. Adaptación Curricular

- [x] 5.1 `lib/adaptacion-word-generator.ts`: añadir `iconosDcdRuns(form.codigoDestreza)` junto al código de la destreza original.

## 6. Verificación

- [x] 6.1 Ejecutar typecheck y lint (sin errores nuevos).
- [x] 6.2 Ejecutar la suite de pruebas (al menos `__tests__/pdf-generator.test.ts`) y añadir/ajustar pruebas para verificar la presencia de íconos en los generadores tocados.
- [ ] 6.3 Verificación manual: exportar Microcurricular (Word/PDF), PCA (Word/PDF), PCA Trimestral (Word/PDF) y Adaptación (Word) y confirmar los íconos junto a los códigos DCD y que la semanal no cambió.