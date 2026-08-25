## 1. Dependencias y esquema de datos

- [ ] 1.1 Evaluar y agregar dependencias de parsing server-side: lectura de `.docx` (parser XML de tablas, p. ej. `fast-xml-parser` + `jszip`, o `docx4js`), `.doc` (`word-extractor`) y `.pdf` (`pdf-parse`)
- [ ] 1.2 Agregar tabla `importedFormatDocuments` a `drizzle/schema.ts` (referencia de storage, tipo detectado, campos extraídos JSON, resultado de IA JSON, estado, `userId`) y generar/aplicar la migración
- [ ] 1.3 Definir esquemas zod de salida por tipo de planificación (PCA, PCA trimestral, adaptación curricular, plan semanal, plan inicial, CNC, evaluación diagnóstica, BT), alineados a los campos que ya consume cada `lib/*-word-generator.ts`

## 2. Carga del archivo

- [ ] 2.1 Reutilizar/extender el patrón de `server/storage.ts` para aceptar `.doc`/`.docx`/`.pdf`, validando extensión y tamaño máximo antes de subir
- [ ] 2.2 Nuevo router tRPC `server/importar-formato-router.ts` con mutation de subida que persiste el archivo y crea el registro `importedFormatDocuments` en estado `subido`
- [ ] 2.3 Nueva pantalla "Importar formato" en `app/` (Expo Router) con selector de archivo (`expo-document-picker` u equivalente), estados de progreso (subiendo/analizando/completado/error) y manejo de los mensajes de error definidos en la spec

## 3. Reconocimiento de formato y extracción de campos

- [ ] 3.1 Definir el catálogo declarativo de "huellas" (encabezados de sección esperados por tipo de planificación), junto a los generadores existentes
- [ ] 3.2 Implementar el parser de `.docx` que recorre `word/document.xml` (tablas/filas/celdas) y produce texto+estructura
- [ ] 3.3 Implementar el parser de `.doc` (texto plano vía `word-extractor`) y de `.pdf` (texto por página vía `pdf-parse`)
- [ ] 3.4 Implementar el matcher que compara la estructura extraída contra el catálogo de huellas y determina el tipo de planificación (o "no reconocido") con un umbral de confianza
- [ ] 3.5 Mapear la estructura reconocida a los campos del esquema zod del tipo detectado, marcando qué campos vinieron ya llenados en el documento importado

## 4. Completado con IA

- [ ] 4.1 Implementar la búsqueda de una planificación existente del mismo docente que corresponda al tipo/área/asignatura/período detectado
- [ ] 4.2 Construir el prompt de completado (campos vacíos + datos de la planificación fuente encontrada) y llamar a `invokeLLM` con `response_format: json_schema` usando el esquema zod del tipo
- [ ] 4.3 Validar la respuesta de la IA con `.parse()`; en caso de fallo, reintentar con `repairJson()` y, si persiste, marcar el registro en estado `error` con mensaje para el docente
- [ ] 4.4 Persistir el resultado combinado (datos importados + completado por IA) en el registro `importedFormatDocuments` en estado `completado`

## 5. Generación del documento final

- [ ] 5.1 Invocar el generador Word correspondiente al tipo detectado (`generarWordPca`, etc.) con los datos combinados y exponer la descarga al docente
- [ ] 5.2 Si el tipo detectado corresponde a una tabla existente (`pcaDocuments`, `curricularAdaptations`, etc.), actualizar esa fila con los campos completados en lugar de dejarlos solo en `importedFormatDocuments`
- [ ] 5.3 Ejecutar el skill `verificar-docx-visual` sobre la salida generada por este flujo para confirmar que coincide visualmente con el anexo oficial correspondiente

## 6. Documentos de prueba y verificación end-to-end

- [ ] 6.1 Construir un generador de documentos de prueba por tipo de planificación con datos institucionales ficticios (nombre, logo como marca de agua, datos de la institución en pie de página)
- [ ] 6.2 Probar el flujo de importación completo (subida → reconocimiento → completado IA → descarga) con documentos de prueba para al menos PCA, PCA trimestral y adaptación curricular
- [ ] 6.3 Probar los casos de error de la spec: extensión no soportada, archivo que excede el tamaño máximo, documento no reconocido, documento corrupto, salida de IA inválida
- [ ] 6.4 Validar el caso de `.doc` legacy con extracción degradada (solo texto, sin estructura de tabla) y confirmar que el mensaje de precisión reducida se comunica correctamente
