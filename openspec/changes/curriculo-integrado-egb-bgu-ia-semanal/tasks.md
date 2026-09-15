## 1. Schema y prompt de generación

- [ ] 1.1 Definir el schema Zod de entrada (competencias seleccionadas con código/nivel/grado, situación de aprendizaje, temas del trimestre, número de semanas) y de salida (`{ ambitos: [{ competenciaCodigo, semanas: [{ numero, tema, objetivoEspecifico, inicio: string[], desarrollo: string[], cierre: string[], recursos: string[], tecnica: string, instrumento: string }] }] }`)
- [ ] 1.2 Escribir la función de prompt (ej. `server/curriculo-competencias-ia-semanal.ts`), citando literalmente los indicadores y saberes reales de `buscarCompetenciaEspecificaEGBBGU` para el grado exacto — no resúmenes ni paráfrasis del catálogo
- [ ] 1.3 Incluir en el prompt las reglas explícitas: no inventar códigos de indicador/saber fuera del catálogo citado; no fabricar URLs específicas (usar descripciones genéricas de recursos en su lugar); distribuir el contenido progresivamente entre semanas (no repetir la misma actividad)

## 2. Mutación tRPC

- [ ] 2.1 Agregar `generarSemanasIA` a `server/curriculo-competencias-router.ts`: arma el prompt desde el input, llama `invokeLLM` con `response_format` (schema de salida de 1.1) y `repairJson` como red de seguridad
- [ ] 2.2 Manejar y propagar errores de `invokeLLM` con mensajes claros (reutilizar los mensajes ya definidos en `server/_core/llm.ts`, no inventar nuevos)
- [ ] 2.3 Prueba manual de la mutación en aislamiento (sin UI) con al menos 2 competencias de materias distintas (ej. Lengua y Ciencias Naturales) para validar que el schema de salida se cumple

## 3. Integración en el formulario

- [ ] 3.1 Agregar botón "Generar semanas con IA" en el paso de Datos o Generar de `app/curriculo-competencias/egb-bgu-integrado.tsx`, habilitado solo cuando ya hay competencias seleccionadas y datos mínimos (situación de aprendizaje o temas)
- [ ] 3.2 Estado de carga mientras la mutación está pendiente (reutilizar el patrón `isPending`/spinner ya usado en el formulario)
- [ ] 3.3 Al recibir la respuesta, mapear cada `ambitos[].semanas[]` a `clases[]` del ámbito correspondiente (mismo shape que `ClaseInicialCurriculo`) antes de construir el payload de guardado
- [ ] 3.4 Manejo de error: mostrar alerta clara si falla la generación, sin perder los datos ya ingresados en el formulario (no resetear el estado del formulario)

## 4. Verificación

- [ ] 4.1 Generar un plan de prueba end-to-end (competencia real → generar semanas → guardar → exportar Word) y verificar visualmente el .docx resultante con el pipeline del skill `verificar-docx-visual` (convertir a PDF/PNG e inspeccionar), confirmando que el contenido generado aparece en la rama rica del generador (no en el fallback genérico)
- [ ] 4.2 Revisar el contenido generado contra las reglas de 1.3 (sin códigos inventados, sin URLs específicas fabricadas) en al menos 2-3 planes de prueba de materias distintas
- [ ] 4.3 Ajustar el prompt según los resultados de 4.1/4.2 si la calidad no se acerca razonablemente al ejemplo oficial de referencia
- [ ] 4.4 Confirmar que `tsc --noEmit` y la suite de tests de `curriculo-competencias` no tienen regresiones nuevas respecto al baseline conocido (103 passed / 6 failed preexistentes)
