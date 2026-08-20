## 1. Tipos y motor de gradación

- [x] 1.1 Agregar en `data/types.ts` los tipos `EstadoDesagregacion` (`generado | editado | aprobado`), `DcdDesagregacion` (fila persistida: `codigoDCD`, `subnivel`, `grado`, `gradoMaximo`, `descripcionDCD`, `indicadorOriginal`, `dcdGraduada`, `indicadorGraduado`, `procesoCognitivo`, `estado`, `version`) y `DcdDesagregacionInput`
- [x] 1.2 Agregar en `data/index.ts` la función pura `gradosDeSubnivel(subnivel): number[] | null` que devuelve `[2,3,4]`, `[5,6,7]`, `[8,9,10]`, `[1,2,3]` (BGU) y `null` para Preparatoria (subnivel 1)
- [x] 1.3 Agregar helper que, dado `codigoDCD`, resuelve la DCD oficial (`buscarPorCodigo`) y el indicador principal (primero de `indicadoresEvaluacion`), devolviendo `{ dcd, indicador }` o `null` si no hay indicador

## 2. Persistencia (drizzle)

- [x] 2.1 Agregar tabla `dcd_desagregaciones` en `drizzle/schema.ts` siguiendo el patrón de `curricular_adaptations` (id, sessionId, codigoDCD, subnivel, grado, gradoMaximo, descripcionDCD, indicadorOriginal, dcdGraduada, indicadorGraduado, procesoCognitivo, estado enum, version, aiResult text, createdAt, updatedAt) con `UNIQUE (sessionId, codigoDCD, grado)`
- [x] 2.2 Exportar tipos `DcdDesagregacionRow` / `InsertDcdDesagregacion`
- [x] 2.3 Generar y aplicar la migración drizzle de la tabla nueva

## 3. Generación con IA

- [x] 3.1 Construir el `outputSchema` JSON estricto de la respuesta de desagregación (array de filas por grado intermedio: `{ grado, dcdGraduada, indicadorGraduado, procesoCognitivo }`)
- [x] 3.2 Construir el prompt de generación: DCD original, indicador original, grados del subnivel, grado destino, proceso cognitivo esperado (verbos de `taxonomia-marzano.ts`) y restricción explícita de no introducir conocimiento fuera de la DCD original
- [x] 3.3 Implementar en el servidor la llamada `invokeLLM` con `response_format` JSON estricto y `repairJson` como respaldo
- [x] 3.4 Post-proceso: llenar el último grado con la copia exacta del texto oficial (sin pasar por la IA) y validar que los grados intermedios no excedan la longitud del original ni introduzcan términos ausentes (advertencia no bloqueante)

## 4. Router y endpoints

- [x] 4.1 Crear `server/dcd-desagregacion-router.ts` con `GET /api/dcd-desagregaciones?codigo=&grado=` que resuelve la fila existente (reutilización)
- [x] 4.2 Agregar `POST /api/dcd-desagregaciones/generar` que recibe `{ codigoDCD, sessionId }`, genera el ladder completo (una sola llamada IA), persiste todas las filas y devuelve el resultado
- [x] 4.3 Agregar `PATCH /api/dcd-desagregaciones/:id` para edición docente (persiste cambios y pasa `estado` a `editado`)
- [x] 4.4 Agregar `POST /api/dcd-desagregaciones/:id/aprobar` (marca `estado=aprobado`)
- [x] 4.5 Registrar el router en `server/routers.ts` y validar por `sessionId` con el mismo esquema de `adaptaciones-router`

## 5. UI: panel de desagregación

- [ ] 5.1 Crear `DcdDesagregacionPanel` (panel hermano del selector): dado `codigoDCD` y `gradoContexto`, resuelve la fila existente o muestra la acción "Desagregar por grado"
- [ ] 5.2 Mostrar el ladder completo de la IA por grado en formato de matriz (columnas por grado) para revisión, con la versión del grado de contexto preseleccionada
- [ ] 5.3 Permitir editar `dcdGraduada` e `indicadorGraduado` por fila y guardar (`PATCH`)
- [ ] 5.4 Agregar acción "aprobar" por fila que persiste `estado=aprobado`
- [ ] 5.5 Cuando ya existe una fila para la DCD+grado, mostrar la guardada sin invocar a la IA (reutilización)
- [ ] 5.6 Agregar la acción "Usar esta versión" que devuelve la versión graduada elegida al selector
- [ ] 5.7 Cuando el contexto no conoce el grado, permitir elegir el grado destino antes de generar (el ladder siempre se genera completo)

## 6. Integración en el selector

- [ ] 6.1 Ampliar el tipo de selección devuelto por `DcdMultiSelector` con `origen: "oficial" | "desagregada"` y `grado?: number` (default `oficial`, compatible con selecciones existentes)
- [ ] 6.2 Agregar prop opcional `gradoContexto` a `DcdMultiSelector` y mostrar, tras seleccionar una DCD, las dos rutas "Desagregar por grado" y "Seleccionar DCD oficial", sin cambiar el comportamiento actual cuando la prop no se pasa
- [ ] 6.3 Etiquetar el botón según contexto ("Desagregar para N.º EGB") cuando `gradoContexto` está presente; la generación produce igualmente el ladder completo
- [ ] 6.4 Asegurar que el flujo CNC no activa la desagregación: el selector se usa sin la prop de planificación y conserva el comportamiento actual (DCD oficial, sin botón ni resolución por grado)
- [ ] 6.5 Verificar que la DCD oficial del catálogo permanece intacta en todos los flujos (no se modifica `data/destrezas-*.ts` ni la `descripcion` guardada)
- [ ] 6.6 Asegurar que la desagregación no colisiona con `curricular_adaptations` / `DcdAdaptada` (modelos separados)

## 7. Verificación

- [ ] 7.1 Escribir pruebas de `gradosDeSubnivel` y de la resolución de indicador principal (incluida Preparatoria → `null`)
- [ ] 7.2 Escribir pruebas de reutilización: DCD+grado existente no regenera; DCD+grado faltante ofrece generar
- [ ] 7.3 Escribir pruebas del post-proceso: último grado idéntico al oficial y rechazo/advertencia de contenido fuera de la DCD original
- [ ] 7.4 Ejecutar lint/typecheck del proyecto y confirmar que la app funciona sin la tabla (best-effort: el selector vuelve al comportamiento actual si la nube falla)
- [ ] 7.5 Prueba funcional end-to-end: seleccionar CN.2.1.1 en 3.º EGB → "Desagregar" → generar ladder → elegir versión de 3.º → guardar → crear planificación y verificar que PCA/PCT/semanal/plan de unidad muestran la DCD graduada; otra planificación que elige la DCD oficial continúa mostrando el texto oficial

## 8. Consumo en PCA/PCT/semanal

- [ ] 8.1 Verificar que `pca-word-generator.ts` y `pca-trimestral-word-generator.ts` renderizan `dcdsSeleccionadas` como `codigo: enunciado` (sin cambios si ya es así) y confirmar que una selección `origen: "desagregada"` guarda el texto graduado como `enunciado`
- [ ] 8.2 Agregar `descripcionEfectiva` (descripción efectiva de la DCD) a `HoraSemanal` en `data/types.ts`, poblada desde la selección, con valor `null`/vacío como default
- [ ] 8.3 Actualizar `semanal-word-generator.ts` para preferir `descripcionEfectiva` y hacer fallback a `destreza?.descripcion`
- [ ] 8.4 Agregar el mismo campo de descripción efectiva al plan de unidad y actualizar `plan-word-generator.ts` con el mismo fallback
- [ ] 8.5 Asegurar que el flujo CNC conserva el objeto `Destreza` oficial sin campo efectivo (no consume versiones graduadas)
- [ ] 8.6 Escribir pruebas de consumo: un plan con selección `origen: "desagregada"` refleja el texto graduado en el documento, y un plan con selección oficial o sin desagregación refleja la `descripcion` oficial