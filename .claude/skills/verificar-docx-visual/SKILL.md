---
name: verificar-docx-visual
description: OBLIGATORIO ejecutar después de CUALQUIER cambio a un archivo lib/*-word-generator.ts o lib/*-pdf-generator.ts (pca-word-generator, pca-trimestral-word-generator, adaptacion-word-generator, plan-word-generator, plan-inicial-word-generator, semanal-word-generator, pdf-generator) — antes de dar el cambio por terminado. Genera un .docx real con datos de prueba y lo convierte en imágenes PNG para inspeccionarlo visualmente con el tool Read, sin depender de LibreOffice/poppler (no instalados en este entorno Windows), y compara el resultado contra el anexo oficial del MinEduc que le corresponde a ese documento. Trigger con "verifica el docx", "genera un documento de prueba", "compara con el formato oficial", "revisa visualmente el Word", o automáticamente al editar cualquiera de esos archivos.
---

# Verificar visualmente la salida de un generador .docx

Este repo genera documentos Word (`docx` npm package) para PCA, PCT, adaptaciones curriculares, planes semanales, etc. Compilar con `tsc --noEmit` solo detecta errores de tipos — **no** detecta tablas rotas, columnas mal proporcionadas, texto desbordado, ni desviaciones del formato oficial. Para eso hay que renderizar el documento real y compararlo contra la fuente oficial correspondiente.

**Regla del repo**: cada vez que se modifique cualquiera de los generadores listados abajo (estilo, colores, anchos, estructura de tabla, o cualquier otro cambio visual/estructural), correr el pipeline de este skill antes de considerar el trabajo terminado. No basta con que compile.

Este entorno Windows no tiene `pdftoppm`/`poppler` ni `libreoffice`, pero sí tiene Microsoft Word y las WinRT APIs de Windows 10+, que alcanzan para todo el pipeline sin instalar nada.

## Qué generador corresponde a qué fuente oficial

El Ministerio de Educación de Ecuador no tiene un único formato — cada generador de este repo debe verificarse contra su propio anexo. Todos menos uno derivan del mismo instructivo:

| Generador | Documento | Fuente oficial | Estado de verificación |
|---|---|---|---|
| `pca-word-generator.ts` | PCA (Plan Curricular Anual) | [Instructivo de PCA y Microplanificación 2021](https://educacion.gob.ec/wp-content/uploads/downloads/2021/05/Instructivo-de-PCA-y-Microplanificacion-2021.pdf), **Anexo 1** (pág. 9-12) | ✅ Verificado 2026-08-19. Vigente — sin versión 2025/2026 que lo reemplace (confirmado contra `educacion.gob.ec/planificacion-curricular/` y el documento más reciente subido por el MinEduc, abril 2026, que es solo administrativo/logístico). |
| `pca-trimestral-word-generator.ts` | PCT (adaptación institucional del PCA por trimestre) | Mismo instructivo como base — el MinEduc **no define** "trimestral" como anexo propio, es práctica de cada institución | ✅ Layout corregido 2026-08-19 (mismo bug de `columnWidths` que el PCA). Sin anexo oficial que comparar 1:1 — verificar que no se desvíe de la lógica general del Anexo 1. |
| `plan-inicial-word-generator.ts` | Planificación semanal por Experiencia de Aprendizaje (Educación Inicial) | Instructivo 2021, **Anexo N.º 2** (pág. 13-15) | ⬜ No verificado todavía |
| `plan-word-generator.ts` | Planificación microcurricular de clase | Instructivo 2021, **Anexo N.º 4** — Unidad Didáctica o de Parcial (pág. 18-19) | ⬜ No verificado todavía |
| `semanal-word-generator.ts` | Planificación microcurricular semanal (fases ERCA/ACC) | Instructivo 2021, **Anexo N.º 4** (misma referencia que arriba) | ⬜ No verificado todavía |
| `adaptacion-word-generator.ts` | Adaptación curricular (NEE, grados acceso/proceso/resultado) | **Normativa distinta** — NO es el instructivo de PCA. Corresponde a la normativa de educación inclusiva / NEE del MinEduc (DECE) | ⬜ Fuente oficial sin identificar todavía — buscarla antes de verificar |

Antes de verificar un generador que aparece como "no verificado", repetir la búsqueda de fuente oficial (WebSearch/WebFetch en `educacion.gob.ec`) para ese anexo específico, actualizar esta tabla con el hallazgo y la fecha, y luego seguir el pipeline de abajo.

## 1. Generar el .docx con datos de prueba

Escribir un script `scripts/test-<nombre>.ts` que importe la función `generarWord...` directamente (sin pasar por la app) y escriba el buffer a disco. Ejemplo mínimo:

```ts
import fs from "fs";
import path from "path";
import { generarWordPca } from "../lib/pca-word-generator";

const formData = { /* ...datos de ejemplo realistas... */ };
const aiResult = { /* ...datos de ejemplo realistas... */ };

async function main() {
  const blob: any = await generarWordPca(formData, aiResult);
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(path.resolve(__dirname, "../PCA-prueba.docx"), buffer);
  console.log("Generado");
}
main().catch((err) => { console.error(err); process.exit(1); });
```

Ejecutar con `npx tsx scripts/test-<nombre>.ts`, luego **borrar el script** (es desechable, no commitear) con `rm scripts/test-<nombre>.ts`. Revisar los campos que consume el generador con `grep -n "formData\.\|aiResult\??\." lib/<generador>.ts` si no se conocen de antemano.

Al terminar la verificación, borrar también el `.docx` de prueba del working tree (`git status` debe quedar limpio de archivos sueltos).

## 2. .docx → .pdf con Word (COM)

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("<ruta absoluta al .docx>", $false, $true)
$doc.SaveAs([ref]"<ruta absoluta al .pdf>", [ref]17)  # 17 = wdFormatPDF
$doc.Close()
$word.Quit()
```

## 3. .pdf → .png con la WinRT PDF API

No hay rasterizador de PDF nativo en PowerShell 5.1; usamos `Windows.Data.Pdf.PdfDocument` (WinRT, disponible en Win10+) vía el shim `AsTask`/`AsyncAction`. Reutilizar este bloque completo (los `Await`/`AwaitAction` son boilerplate necesario porque WinRT no es awaitable directamente en PowerShell):

```powershell
$refDir = "<carpeta de salida, p.ej. el scratchpad de la sesión>"
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime] | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
$asTaskAction  = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' })[0]

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
function AwaitAction($WinRtTask) {
    $netTask = $asTaskAction.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
}

$pdfPath = Join-Path $refDir "archivo.pdf"
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
$pdfDoc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
Write-Output "Pages: $($pdfDoc.PageCount)"

for ($i = 0; $i -lt $pdfDoc.PageCount; $i++) {
    $page = $pdfDoc.GetPage([uint32]$i)
    $outFile = Join-Path $refDir ("page{0}.png" -f ($i+1))
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    $renderOptions = New-Object Windows.Data.Pdf.PdfPageRenderOptions
    $renderOptions.DestinationWidth  = [uint32]($page.Size.Width  * 2)
    $renderOptions.DestinationHeight = [uint32]($page.Size.Height * 2)
    AwaitAction ($page.RenderToStreamAsync($stream, $renderOptions))
    $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream.GetInputStreamAt(0))
    $fileStream = [System.IO.File]::Create($outFile)
    $netStream.CopyTo($fileStream)
    $fileStream.Close()
    $page.Dispose()
}
```

`* 2` en `DestinationWidth/Height` da ~150dpi, suficiente para leer texto en la revisión. Bajar a `* 1.5` para documentos de muchas páginas y ahorrar tiempo.

## 4. Ver el resultado y comparar contra el formato oficial

Usar el tool `Read` sobre cada `pageN.png` generado. El número de páginas ya es la primera señal: un documento A4 horizontal con contenido normal de prueba debería caber en 1-2 páginas — si salen 6-9 páginas, casi seguro es una tabla con `layout: FIXED` mal configurada (ver más abajo).

Después de confirmar que el layout no está roto, comparar contra el anexo oficial correspondiente (tabla de arriba):
- Si el anexo ya se descargó en una sesión anterior, reutilizar esa referencia si sigue accesible.
- Si no, descargarlo con WebFetch y renderizarlo a PNG con el mismo pipeline WinRT (pasos 2-3, saltando la conversión Word→PDF porque ya es PDF) para poder mirarlo lado a lado con el resultado generado.
- Revisar: secciones presentes, nombres de columnas, y que no se hayan agregado/quitado campos que el MinEduc no pide (o que si se agregan, sea una decisión consciente del usuario, no un efecto secundario del cambio).

Guardar los PNG/PDF de trabajo en el scratchpad de la sesión, no en el repo.

## Bug recurrente a vigilar: `layout: FIXED` sin `columnWidths`

Al verificar así se encontró (y se repitió en dos generadores distintos) este patrón roto:

```ts
new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.FIXED,   // ⚠️ sin columnWidths
  rows: [...],
})
```

La librería `docx` (ver `node_modules/docx/build/index.umd.js`, clase `Table`) si no recibe `columnWidths` lo rellena con `Array(nCols).fill(100)` (100 twips por columna, ignorando los anchos por celda). Con `layout: FIXED`, Word respeta ese `tblGrid` literalmente → columnas casi nulas, texto envuelto letra por letra, documento desparramado en muchas páginas.

**Fix**: usar unidades DXA consistentes en toda la tabla — `width` de la tabla en DXA (no PERCENTAGE) igual a la suma de las columnas, y pasar `columnWidths: [...COL_W]` explícito. Ver el fix aplicado en `lib/pca-word-generator.ts` y `lib/pca-trimestral-word-generator.ts` (commit `f444c98`) como referencia. Al tocar cualquier otro generador (`plan-word-generator.ts`, `plan-inicial-word-generator.ts`, `semanal-word-generator.ts`, `adaptacion-word-generator.ts`), buscar `layout: TableLayoutType.FIXED` sin `columnWidths` cerca y aplicar el mismo patrón si aparece.
