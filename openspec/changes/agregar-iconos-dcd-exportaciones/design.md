## Context

Los generadores de documentos viven en `lib/*.ts` y producen Word (biblioteca `docx`, runs/ImageRun) o HTML imprimible para PDF (string con `<img>`). La Planificación Semanal ya tiene dos helpers locales que incrustan los íconos DCD:

- `iconosDcdRuns(codigo)` en `lib/semanal-word-generator.ts` (Word, ImageRun base64 a 16px).
- `iconosDestrezaHTML(codigo)` en `lib/pdf-generator.ts` (HTML `<img>` base64 a 14px).

Ambos usan `obtenerIconosDestreza(codigo)` (`src/data/iconosPorDestreza.ts`) contra `iconosPorDestreza.json` y `ICONOS_DCD_BASE64` (`lib/iconos-base64.ts`). El resto de generadores no incrusta estos íconos.

## Goals / Non-Goals

**Goals:**
- Que Microcurricular (Word/PDF), PCA (Word/PDF), PCA Trimestral (Word/PDF) y Adaptación (Word) incrusten los mismos íconos DCD junto a los códigos de destreza, con el mismo tamaño que usa la semanal (16px Word, 14px HTML).
- Evitar duplicación: extraer helpers compartidos y reutilizarlos en todos los generadores.

**Non-Goals:**
- Planificación Inicial (sus códigos `INI.*` no están en el mapeo).
- Ampliar el mapeo `iconosPorDestreza.json`.
- Cambiar el tamaño, estilo o posición de los íconos en la Planificación Semanal.
- Añadir selección manual de íconos en los formularios.

## Decisions

### 1. Extraer helpers compartidos en un módulo único
Crear un módulo compartido (p. ej. `lib/dcd-iconos.ts`) que exporte:
- `iconosDcdRuns(codigo, size)` → `(TextRun | ImageRun)[]` para Word.
- `iconosDestrezaHTML(codigo, size)` → string HTML de `<img>` para PDF.

`semanal-word-generator.ts` y `pdf-generator.ts` pasan a importar desde ahí (sin cambio de comportamiento visible).

**Alternativa considerada:** mantener la lógica local en cada generador. Se descarta por duplicación y riesgo de divergencia de tamaños/estilos.

### 2. Tamaños consistentes con la semanal
- Word: `ImageRun` a 16px (mismo valor `ICONO_DCD_SIZE`).
- HTML/PDF: `<img>` a 14px con `border-radius:50%` (mismo estilo que la semanal).

**Alternativa considerada:** distintos tamaños por documento. Se descarta: la coherencia visual entre documentos es el objetivo.

### 3. Puntos de inserción por generador
- **Microcurricular Word** (`plan-word-generator.ts`): junto al párrafo de `plan.destreza.codigo` (bloque destreza de la tabla principal).
- **Microcurricular PDF** (`pdf-generator.ts`): junto al `<strong>${plan.destreza.codigo}</strong>` en la celda de destrezas. Los badges de texto de `competencias` se mantienen (representan la selección manual del formulario, distinta de los íconos derivados del DCD).
- **PCA Word** (`pca-word-generator.ts`) y **PCA Trimestral Word** (`pca-trimestral-word-generator.ts`): añadir los runs de íconos al párrafo de cada DCD (`d.codigo`) en la columna Destrezas.
- **PCA PDF** (`pca-pdf-generator.ts`) y **PCA Trimestral PDF** (`pca-trimestral-pdf-generator.ts`): añadir los `<img>` junto a cada `<b>${d.codigo}</b>` de la columna Destrezas.
- **Adaptación Word** (`adaptacion-word-generator.ts`): añadir los runs de íconos junto al código de la destreza original (`form.codigoDestreza`).

**Alternativa considerada:** colocar los íconos en otra columna/sección. Se descarta: la referencia del documento oficial (semanal) los ubica junto al código de destreza.

## Risks / Trade-offs

- [Archivos HTML/Word más grandes por base64 incrustado] → Mitigación: los íconos ya se incrustan en la semanal; el incremento es el mismo por ícono y aceptable.
- [Desbordamiento de celdas estrechas (columna Destrezas del PCA)] → Mitigación: íconos a 14px/16px junto al código, sin afectar el texto; verificar en pruebas con unidades de muchas DCD.
- [Regresión visual en la semanal al extraer los helpers] → Mitigación: reutilizar los mismos valores de tamaño/estilo y cubrir con pruebas existentes (`__tests__/pdf-generator.test.ts`).