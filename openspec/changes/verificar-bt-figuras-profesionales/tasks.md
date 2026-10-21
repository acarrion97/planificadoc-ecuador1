## 1. Preparación y convenciones

- [x] 1.1 Revisar el esquema de códigos e IDs de `climatizacion` en `data/bachillerato-tecnico.ts` y fijar la convención de códigos de módulo nuevos y de IDs de RA/CE (design, decisión 2 y 4)
- [x] 1.2 Agregar `"historico"` al union `estadoCatalogo` en `data/types-bt.ts`
- [x] 1.3 Auditar los consumidores que listan o resuelven módulos (`app/planificar-bt/[figuraId].tsx`, `lib/planificaciones-bt-context.tsx`, `app/conecta-nivela-crea/index.tsx`, `app/ver-cnc/[id].tsx`, `server/cnc-router.ts`, `lib/cnc-word-generator.ts`, `lib/pdf-generator.ts`) y anotar cuáles deben filtrar módulos históricos y cuáles deben seguir resolviéndolos

## 2. Extracción desde los PDF oficiales

- [x] 2.1 Escribir el script de extracción (pymupdf, fuera de `package.json`) que, a partir de un PDF "Módulos formativos", produzca un JSON con el objetivo general y, por módulo: categoría, nombre, nivel, duración, UC asociada, objetivo del módulo y RA/CE
- [x] 2.2 Validar el script con `desarrollo-software` y `musica` (dos formatos de PDF distintos) comparando a mano los conteos de módulos, RA y CE
- [x] 2.3 Ejecutar la extracción para las 31 figuras de la tabla del design y revisar los JSON con conteos anómalos (módulo sin RA, RA sin CE, textos cortados)

## 3. Actualización del catálogo

- [x] 3.1 Marcar como `estadoCatalogo: "historico"` los módulos actuales de las 31 figuras con fuente, sin cambiar sus códigos
- [x] 3.2 Generar e insertar los módulos oficiales (familia Tecnologías: ciencia-datos, desarrollo-software, redes-telecomunicaciones, seguridad-informatica, soporte-informatico)
- [x] 3.3 Generar e insertar los módulos oficiales de las familias Administrativa, Agropecuaria, Ambiente y Construcción
- [x] 3.4 Generar e insertar los módulos oficiales de la familia Industrial (instalaciones-electricas, electromecanica-industrial, electromecanica-automotriz, electronica, fabricacion-madera, mecatronica, procesamiento-alimentos, produccion-calzado, mecanica-industrial)
- [x] 3.5 Generar e insertar los módulos oficiales de Turismo, Salud y Servicio, Artes y Diseño
- [x] 3.6 Actualizar `objetivoGeneral` de cada figura con el texto del PDF
- [x] 3.7 Transcribir las UC asociadas y los vínculos módulo↔UC en `data/bachillerato-tecnico-uc.ts`
- [x] 3.8 Marcar como pendientes, sin inventar contenido, los módulos de `gestion-deportiva` (sin fuente); mantener tal cual `climatizacion`, `actividad-fisica` y `construcciones-metalicas`
- [x] 3.9 Si `data/bachillerato-tecnico.ts` pasa de ~5 000 líneas, dividir los módulos por familia en `data/bt/*.ts` conservando las exportaciones actuales
  (resuelto con un único archivo generado `data/bt/modulos-oficiales.generated.ts`; `bachillerato-tecnico.ts` conserva sus exportaciones)

## 4. Consumidores

- [x] 4.1 Filtrar los módulos `historico` en los selectores de planes nuevos (planificar-bt y Conecta Nivela Crea)
- [x] 4.2 Verificar que la resolución por código (vista, Word, PDF) encuentre los módulos históricos y los muestre con su nombre

## 5. Verificación

- [x] 5.1 Pruebas en `__tests__/`: integridad del catálogo (IDs únicos, módulo completo con RA, RA con CE), módulos oficiales esperados para `desarrollo-software`, resolución de `DS.1.1` como histórico y su ausencia del selector
- [x] 5.2 Escribir `verificacion.md` con el informe por figura (PDF, conteos, diferencias, incidencias) para revisión humana
- [x] 5.3 Ejecutar `tsc --noEmit` y la suite de pruebas; revisar a mano 3 figuras al azar contra su PDF
- [x] 5.4 Ejecutar la skill `verificar-docx-visual` si se toca algún generador Word/PDF (no aplica: no se modificó ningún generador)
