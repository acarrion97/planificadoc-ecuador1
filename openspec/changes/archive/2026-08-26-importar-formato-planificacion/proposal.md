## Why

Hoy el docente solo puede generar sus documentos de planificación (PCA, PCA trimestral, adaptación curricular, etc.) llenando los formularios de la app desde cero. Muchos docentes ya tienen el formato oficial del MinEduc en Word o PDF (en blanco o parcialmente llenado a mano) y quieren reutilizarlo: subir ese archivo, que la app reconozca su estructura y complete los campos con los datos de la planificación ya generada/almacenada (o con contenido generado por IA cuando falte información), y descargar de vuelta un Word en el mismo formato. Esto evita retrabajo y reduce la fricción de adopción para docentes que ya trabajan con la plantilla oficial.

## What Changes

- Nueva pantalla de "Importar formato": el docente selecciona/sube un archivo `.doc`/`.docx` o `.pdf` desde el dispositivo.
- Nuevo endpoint de carga que acepta el archivo y lo persiste temporalmente (reutilizando el patrón de `server/storage.ts` ya usado para audio).
- Nuevo servicio de análisis de documento: extrae texto/estructura del archivo subido (tablas y encabezados de sección) y lo mapea a un tipo de planificación soportado (PCA, PCA trimestral, adaptación curricular, plan semanal, plan inicial, CNC, evaluación diagnóstica, BT) y a sus campos conocidos.
- Nuevo paso de IA que, dado el documento analizado y la planificación fuente (existente en la app para ese docente/período), completa los campos vacíos o inconsistentes del documento importado, devolviendo un JSON validado contra un esquema zod por tipo de planificación (a diferencia del flujo actual de generación, que no valida la salida de la IA).
- El documento final se genera reutilizando los generadores Word existentes (`lib/*-word-generator.ts`) con los datos combinados (importados + IA), preservando el formato de salida ya validado visualmente por el skill `verificar-docx-visual`.
- Manejo explícito de error cuando el archivo subido no corresponde a ningún formato reconocido o está dañado/no se puede parsear.
- Fuera de alcance de este change: edición interactiva campo por campo del documento importado antes de generar el resultado (se completa automáticamente); OCR de documentos escaneados como imagen.

## Capabilities

### New Capabilities
- `importar-formato-planificacion`: permite subir un documento Word/PDF con un formato oficial de planificación, analizarlo, completar sus campos con IA a partir de la planificación existente, y generar el Word final en el mismo formato.

### Modified Capabilities
(ninguna — no se modifica el comportamiento de las capacidades de generación existentes, solo se agrega una nueva vía de entrada que las reutiliza)

## Impact

- **Nuevo código**: pantalla(s) en `app/` (Expo Router) para la subida; router tRPC nuevo (p. ej. `server/importar-formato-router.ts`); servicio de parsing de docx/pdf en `lib/` o `server/_core/`; nuevas dependencias de parsing (docx: lectura, no solo escritura; PDF: extracción de texto).
- **Dependencias nuevas**: librería(s) para leer `.docx` (el paquete `docx` actual solo escribe) y para extraer texto de PDF — deben agregarse a `package.json`.
- **Reutiliza**: `server/storage.ts` (patrón de subida ya usado para audio), `server/_core/llm.ts` (`invokeLLM`), los generadores en `lib/*-word-generator.ts`.
- **Datos**: puede requerir una tabla/columna nueva en `drizzle/schema.ts` para registrar el archivo importado y su resultado de análisis (o reutilizar las tablas de cada tipo de planificación, ver `design.md`).
- **Pruebas**: se generarán documentos de prueba con datos ficticios de instituciones (incluyendo marca de agua de logo institucional y datos de la institución en el pie de página) para validar el flujo de importación end-to-end sobre varios tipos de planificación.
