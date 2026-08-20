## 1. Tipos y motor de gradación

- [ ] 1.1 Agregar en `data/types.ts` los tipos `EstadoDesagregacion` (`generado | editado | aprobado`), `DcdDesagregacion` (fila persistida: `codigoDCD`, `subnivel`, `grado`, `gradoMaximo`, `descripcionDCD`, `indicadorOriginal`, `dcdGraduada`, `indicadorGraduado`, `procesoCognitivo`, `estado`, `version`) y `DcdDesagregacionInput`
- [ ] 1.2 Agregar en `data/index.ts` la función pura `gradosDeSubnivel(subnivel): number[] | null` que devuelve `[2,3,4]`, `[5,6,7]`, `[8,9,10]`, `[1,2,3]` (BGU) y `null` para Preparatoria (subnivel 1)
- [ ] 1.3 Agregar helper que, dado `codigoDCD`, resuelve la DCD oficial (`buscarPorCodigo`) y el indicador principal (primero de `indicadoresEvaluacion`), devolviendo `{ dcd, indicador }` o `null` si no hay indicador

## 2. Persistencia (drizzle)

- [ ] 2.1 Agregar tabla `dcd_desagregaciones` en `drizzle/schema.ts` siguiendo el patrón de `curricular_adaptations` (id, sessionId, codigoDCD, subnivel, grado, gradoMaximo, descripcionDCD, indicadorOriginal, dcdGraduada, indicadorGraduado, procesoCognitivo, estado enum, version, aiResult text, createdAt, updatedAt) con `UNIQUE (sessionId, codigoDCD, grado)`
- [ ] 2.2 Exportar tipos `DcdDesagregacionRow` / `InsertDcdDesagregacion`
- [ ] 2.3 Generar y aplicar la migración drizzle de la tabla nueva

## 3. Generación con IA

- [ ] 3.1 Construir el `outputSchema` JSON estricto de la respuesta de desagregación (array de filas por grado intermedio: `{ grado, dcdGraduada, indicadorGraduado, procesoCognitivo }`)
- [ ] 3.2 Construir el prompt de generación: DCD original, indicador original, grados del subnivel, grado destino, proceso cognitivo esperado (verbos de `taxonomia-marzano.ts`) y restricción explícita de no introducir conocimiento fuera de la DCD original
- [ ] 3.3 Implementar en el servidor la llamada `invokeLLM` con `response_format` JSON estricto y `repairJson` como respaldo
- [ ] 3.4 Post-proceso: llenar el último grado con la copia exacta del texto oficial (sin pasar por la IA) y validar que los grados intermedios no excedan la longitud del original ni introduzcan términos ausentes (advertencia no bloqueante)

## 4. Router y endpoints

- [ ] 4.1 Crear `server/dcd-desagregacion-router.ts` con `GET /api/dcd-desagregaciones?codigo=&grado=` que resuelve la fila existente (reutilización)
- [ ] 4.2 Agregar `POST /api/dcd-desagregaciones/generar` que recibe `{ codigoDCD, sessionId }`, genera el ladder completo (una sola llamada IA), persiste todas las filas y devuelve el resultado
- [ ] 4.3 Agregar `PATCH /api/dcd-desagregaciones/:id` para edición docente (persiste cambios y pasa `estado` a `editado`)
- [ ] 4.4 Agregar `POST /api/dcd-desagregaciones/:id/aprobar` (marca `estado=aprobado`)
- [ ] 4.5 Registrar el router en `server/routers.ts` y validar por `sessionId` con el mismo esquema de `adaptaciones-router`

## 5. UI: panel de desagregación

- [ ] 5.1 Crear `DcdDesagregacionPanel` (panel hermano del selector): dado `codigoDCD` y `gradoContexto`, resuelve la fila existente o muestra la acción "Desagregar por grados"
- [ ] 5.2 Mostrar la propuesta de la IA por grado en formato de matriz (columnas por grado) para revisión
- [ ] 5.3 Permitir editar `dcdGraduada` e `indicadorGraduado` por fila y guardar (`PATCH`)
- [ ] 5.4 Agregar acción "aprobar" por fila que persiste `estado=aprobado`
- [ ] 5.5 Cuando ya existe una fila para la DCD+grado, mostrar la guardada sin invocar a la IA (reutilización)
- [ ] 5.6 Cuando el contexto no conoce el grado, permitir elegir el grado destino antes de generar

## 6. Integración en el selector

- [ ] 6.1 Agregar prop opcional `gradoContexto` a `DcdMultiSelector` sin cambiar su comportamiento actual cuando no se pasa
- [ ] 6.2 Cuando `gradoContexto` está presente y existe desagregación para la DCD seleccionada + grado, usar la versión graduada como la DCD efectiva (sin pedir el grado manualmente)
- [ ] 6.3 Verificar que la DCD oficial del catálogo permanece intacta en todos los flujos (no se modifica `data/destrezas-*.ts` ni la `descripcion` guardada)
- [ ] 6.4 Asegurar que la desagregación no colisiona con `curricular_adaptations` / `DcdAdaptada` (modelos separados)

## 7. Verificación

- [ ] 7.1 Escribir pruebas de `gradosDeSubnivel` y de la resolución de indicador principal (incluida Preparatoria → `null`)
- [ ] 7.2 Escribir pruebas de reutilización: DCD+grado existente no regenera; DCD+grado faltante ofrece generar
- [ ] 7.3 Escribir pruebas del post-proceso: último grado idéntico al oficial y rechazo/advertencia de contenido fuera de la DCD original
- [ ] 7.4 Ejecutar lint/typecheck del proyecto y confirmar que la app funciona sin la tabla (best-effort: el selector vuelve al comportamiento actual si la nube falla)