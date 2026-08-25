## Context

Ver `proposal.md` - Why/What Changes para la motivación. Constraints relevantes ya relevadas en el repo:

- El paquete `docx` instalado (`^8.5.0`) solo **escribe** `.docx`; no hay ninguna librería de lectura de `.docx`/`.doc`/`.pdf` en `package.json` hoy.
- No existe mecanismo de subida de archivos genérico; el patrón más cercano es `server/storage.ts` (`storagePut`/`storageGet`, multipart hacia `v1/storage/upload`), usado hoy solo para audio.
- La IA se invoca vía `server/_core/llm.ts` (`invokeLLM`, gateway propio estilo OpenAI chat/completions, con `repairJson()` para JSON truncado). Los routers actuales (`pca-router.ts`, etc.) no validan la salida de la IA contra un esquema zod, solo el input.
- Cada tipo de planificación persiste su data como JSON en columnas `text()` de `drizzle/schema.ts` (p. ej. `pcaDocuments.formData`/`aiResult`); PCA trimestral/plan/semanal/plan inicial no tienen tabla y viven solo en `AsyncStorage` del cliente.
- Los generadores Word (`lib/*-word-generator.ts`) ya reciben `formData`/`aiResult` tipados como `any` y construyen la tabla completa desde cero con `docx` — no rellenan una plantilla existente, generan el documento entero.
- El entorno de despliegue es Vercel/servidor Node (no confirmado LibreOffice ni Word disponibles en producción); la conversión de `.doc` a `.docx` que se usó en este mismo change para leer el archivo de ejemplo dependió de Word instalado localmente vía COM (`New-Object -ComObject Word.Application`), lo cual **no está disponible en producción**.

## Goals / Non-Goals

**Goals:**
- Definir cómo se sube, analiza y completa un documento importado, y cómo se reutiliza el pipeline de generación existente para producir el resultado final.
- Elegir librerías de parsing de `.docx`/`.pdf` que funcionen en el runtime de producción (Node en servidor, sin dependencias de Word/LibreOffice/COM).
- Definir el esquema de validación zod para la salida de la IA en este flujo, y cómo se persiste el documento importado y su resultado.

**Non-Goals:**
- Editor visual campo-por-campo antes de generar el resultado (el proposal ya lo excluye).
- OCR de documentos escaneados como imagen (excluido en el proposal).
- Soporte productivo de `.doc` legacy (formato binario pre-2007) si ninguna librería pura-JS lo lee de forma confiable — ver Decisión sobre `.doc`.

## Decisions

### 1. Parsing de `.docx`: extraer XML de tablas directamente, no HTML intermedio
Un `.docx` es un zip con `word/document.xml`. Para reconocer el formato oficial (que está construido como tablas anidadas, como se vio al inspeccionar el PCA 2016-2017 de ejemplo: fila → celdas → texto), es más confiable leer `word/document.xml` con un parser XML y recorrer `w:tbl`/`w:tr`/`w:tc`/`w:t` directamente (usando una librería como `jszip` + `fast-xml-parser`, o `docx4js`) que convertir primero a HTML con `mammoth` (que aplana tablas a HTML genérico y puede perder la correspondencia fila/columna necesaria para mapear celdas a campos específicos).
- Alternativa considerada: `mammoth` — buena para extraer texto plano/HTML de párrafos, pero pierde precisión en el mapeo celda→campo que este flujo necesita. Se puede usar como fallback para extraer texto libre de secciones no tabulares (ej. observaciones).

### 2. Parsing de `.doc` legacy: soporte best-effort vía `word-extractor`, degradado si falla
El formato `.doc` binario (OLE2/Compound File) no tiene una librería pura-JS que lo lea con la fidelidad de tablas que sí tiene `.docx`. Se usará `word-extractor` (pura JS, sin dependencias nativas) para extraer texto plano de `.doc`. Como no preserva la estructura de tabla, el reconocimiento de campos sobre `.doc` se hará por coincidencia de encabezados de sección conocidos (regex/heurística sobre el texto plano), con menor precisión que `.docx`. Si el archivo `.doc` no puede parsearse, el sistema informa el error definido en la spec ("Documento dañado o no se puede leer") en vez de intentar una conversión que dependa de Word/LibreOffice (no disponibles en producción).
- Alternativa descartada: convertir `.doc`→`.docx` server-side con LibreOffice (`soffice --headless --convert-to docx`) — requeriría instalar LibreOffice en el entorno de despliegue (Vercel serverless no lo soporta de forma sencilla); queda como posible mejora futura si se migra a un runtime con más control del entorno.

### 3. Parsing de `.pdf`: extracción de texto con `pdf-parse` + heurística de secciones
Igual que `.doc`, un PDF generado a partir de una tabla no expone estructura de tabla nativa. Se usará `pdf-parse` (pura JS) para extraer el texto por página, y la misma heurística de reconocimiento de encabezados de sección que para `.doc`. La precisión de campo-a-campo será menor que con `.docx`; esto se documenta como limitación conocida (ver Riesgos).

### 4. Reconocimiento de tipo de formato: catálogo de "huellas" por tipo de planificación
Cada tipo soportado (PCA, PCA trimestral, adaptación curricular, plan semanal, plan inicial, CNC, evaluación diagnóstica, BT) tendrá una "huella" declarativa: lista de encabezados de sección esperados en orden (ej. para PCA: "1. DATOS INFORMATIVOS", "2. TIEMPO", "3. OBJETIVOS GENERALES", "4. EJES TRANSVERSALES", "DESARROLLO DE UNIDADES DE PLANIFICACIÓN", "6. BIBLIOGRAFÍA", "7. OBSERVACIONES"). El documento subido se compara contra cada huella por score de coincidencia; se elige la de mayor score si supera un umbral mínimo, si no se reporta "formato no reconocido". Este catálogo se define junto a (no dentro de) cada generador existente, para mantener una única fuente de verdad de las secciones de cada formato.

### 5. Completado con IA: reutiliza `invokeLLM`, pero valida salida con zod por tipo
Se define un esquema zod de salida por tipo de planificación (los mismos campos que hoy consume cada `lib/*-word-generator.ts`, pero tipados en vez de `any`). El flujo de importación llama a `invokeLLM` con `response_format: json_schema` (ya soportado por `llm.ts`) pasando ese esquema, y valida la respuesta con `.parse()`; si falla, se reintenta una vez con `repairJson()` y si vuelve a fallar se reporta el error de la spec ("La IA devuelve datos que no cumplen el esquema esperado") en vez de generar un documento con datos parciales/corruptos. Este endurecimiento de validación no se aplica retroactivamente a los routers de generación existentes (fuera de alcance de este change), pero deja el esquema reutilizable para hacerlo en un change futuro.

### 6. Persistencia: nueva tabla `importedFormatDocuments`
Se agrega una tabla en `drizzle/schema.ts` para registrar cada importación: referencia de storage del archivo original, tipo de planificación detectado, campos extraídos (JSON), resultado de IA (JSON), estado (`subido` | `analizando` | `completado` | `error`), y el `docenteId`/`userId` dueño. No se reutilizan las tablas existentes por tipo (`pcaDocuments`, etc.) para el registro de la importación en sí, porque su esquema asume que el documento fue generado por el flujo normal (formData de formulario), no importado; una vez completado, si el tipo detectado es PCA y corresponde a una planificación existente, se actualiza esa fila existente en `pcaDocuments` con los campos completados (mismo criterio para los demás tipos con tabla propia).

### 7. Reutilización de generadores existentes para la salida final
El documento final se produce llamando al generador Word correspondiente (`generarWordPca`, etc.) con los datos combinados, no reconstruyendo la plantilla desde el DOM del archivo importado. Esto garantiza que la salida ya validada visualmente (skill `verificar-docx-visual`) se mantenga consistente, a costa de que cualquier formato o maquetación personalizada que el docente haya hecho a mano sobre su propio archivo no se preserva — solo se preservan los *datos*, no el layout del archivo subido.

## Risks / Trade-offs

- **[Riesgo] Precisión de mapeo campo→valor en `.doc`/`.pdf` es menor que en `.docx`** (no hay estructura de tabla nativa) → Mitigación: comunicar en la UI que `.docx` da mejores resultados; degradar con claridad (mostrar qué campos no se pudieron extraer con confianza) en vez de adivinar silenciosamente.
- **[Riesgo] Nuevas dependencias de parsing aumentan el bundle/servidor** → Mitigación: mantenerlas solo en el paquete de servidor (`server/`), no en el bundle de Expo/cliente.
- **[Riesgo] Layout/formato personalizado del docente en su archivo subido se pierde al regenerar con el generador estándar** → Mitigación: esto es una decisión de diseño explícita (ver Decisión 7), comunicada al docente antes de confirmar la importación.
- **[Riesgo] Sin acceso a LibreOffice/Word en producción, `.doc` legacy queda con soporte degradado** → Mitigación: aceptado como limitación conocida para este change; ver Decisión 2.

## Open Questions

- ¿La librería final para tablas en `.docx` será `fast-xml-parser` a mano sobre `word/document.xml`, o una librería de más alto nivel como `docx4js`? Se decide en la fase de implementación evaluando cuál preserva mejor la agrupación fila/celda sin agregar dependencias nativas.
