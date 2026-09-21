## 1. Tipos y modelo de datos (D1)

- [x] 1.1 Agregar en `data/types-curriculo-competencias.ts` las interfaces `BloqueCurricularGrado`, `GrupoGrado`, `ActividadPorGrado`, `SemanaMultigrado` y `PlanificacionCurriculoIntegradoMultigrado`, tal como se definen en design.md D1.
- [x] 1.2 Agregar `PlanificacionCurriculoIntegradoMultigrado` a la unión `PlanificacionModulo`.
- [x] 1.3 Confirmar que no se modificó ningún tipo existente usado por Inicial (`PlanificacionInicialCurriculo`, `AmbitoDesarrollo`, `ClaseInicialCurriculo`).

## 2. Resolución y validación sobre el catálogo (D3, D4)

- [x] 2.1 Agregar `resolverBloquePorGrado(materiaId, ceCodigo, grados)` en `data/competencias-especificas-egb-bgu.ts` (función pura, solo lectura de `porGrado`), que devuelve un `BloqueCurricularGrado` por grado solicitado.
- [x] 2.2 Agregar `ceDisponibleParaGrados(materiaId, ceCodigo, grados)` en el mismo archivo, que devuelve `{ valido, gradosNoCubiertos }`.
- [x] 2.3 Escribir pruebas unitarias de `resolverBloquePorGrado` y `ceDisponibleParaGrados` cubriendo: grados todos cubiertos, un grado no cubierto, subnivel inexistente, y una CE real de Matemática (`CE.M.4.1`, subnivel SUPERIOR, grados 8.º/9.º/10.º) para anclar el caso validado contra la matriz MESOCURRICULUM.

## 3. Backend: discriminador, validación y persistencia (D2, D4)

- [x] 3.1 En `server/curriculo-competencias-router.ts`, aceptar y persistir `modalidad: "unigrado" | "multigrado"` dentro de `formData` al crear/actualizar una planificación de Currículo Integrado EGB/BGU. (Nota de alcance: se agregaron `createMultigrado`/`updateMultigrado`, que persisten `modalidad: "multigrado"`. No se tocó `createInicial`/`updateInicial` — compartidos con Inicial, fuera de alcance por D1 — así que el single-grade existente sigue sin `modalidad` explícita y sigue resolviéndose por la heurística preexistente, tal como prevé D2.)
- [x] 3.2 Revalidar en el servidor, antes de guardar una planificación `modalidad: "multigrado"`, que todos los grados pertenecen al mismo subnivel y que la CE elegida cubre todos los grados seleccionados (usando `ceDisponibleParaGrados`); rechazar el guardado con un mensaje claro si falla.
- [x] 3.3 Actualizar `exportWord`/`exportPdf` para leer `formData.modalidad` primero, y solo usar la heurística de prefijo de código existente cuando el campo esté ausente (registros previos a este cambio). (Nota: el branch `curriculo_integrado_multigrado` lanza un error explícito "todavía no implementada" hasta que existan los generadores de las tareas 6.1/7.1 — no hay wizard aún que pueda crear un registro real que llegue a ese branch.)
- [x] 3.4 Escribir pruebas de router cubriendo: guardar multigrado válido, rechazo por subnivel mixto, rechazo por CE que no cubre un grado, y que un registro previo sin `modalidad` sigue exportando con el comportamiento anterior.

## 4. Wizard: modalidad y paso Competencias (D5)

- [x] 4.1 Agregar el selector "Un solo grado" / "Multigrado" en el paso "Contexto" de `app/curriculo-competencias/egb-bgu-integrado.tsx`.
- [x] 4.2 Implementar, para modalidad multigrado, la UI del paso "Competencias": selector de subnivel (`nivelesDeMateria`), checklist de grados (`gradosDeNivel`) con mínimo 2 marcados, y selector de CE filtrado a las que `ceDisponibleParaGrados` marca como válidas para los grados marcados. (Nota: el selector de subnivel se reutiliza del "Nivel" ya existente en el paso Contexto — compartido con el modo single-grade — en vez de duplicarlo dentro de Competencias; el checklist de grados y el selector de CE sí son nuevos y viven en el paso Competencias.)
- [x] 4.3 Mostrar el mensaje de incompatibilidad (grados no cubiertos) cuando el docente intenta elegir una CE que no cubre todos los grados seleccionados.
- [x] 4.4 Al confirmar grados + CE, llamar a `resolverBloquePorGrado` y mostrar, por grado, un bloque editable de indicadores/declarativos/procedimentales/actitudinales.

## 5. Wizard: datos y semanas multigrado (D6 — solo edición manual)

- [x] 5.1 Adaptar el paso "Datos" para capturar los campos de contexto compartidos (institución, docente, paralelo, trimestre, no. de semanas, situación de aprendizaje, conexión interdisciplinar) una sola vez para todos los grados. (Nota: `conexionInterdisciplinar` no tiene un campo de UI dedicado — tampoco lo tiene el modo single-grade existente en este mismo wizard hoy; queda como campo del modelo sin capturar, igual que ya estaba.)
- [x] 5.2 Implementar la edición manual de `SemanaMultigrado`: por cada semana, un tema común y un formulario de actividad (`ActividadPorGrado`) por cada grado seleccionado.
- [x] 5.3 Verificar que editar la actividad de un grado en una semana no afecta las actividades de los demás grados en esa misma semana (Requirement correspondiente del spec).
- [x] 5.4 Persistir el estado del wizard multigrado en el mismo flujo de guardado (`createMultigrado`/`updateMultigrado` de la tarea 3.1) sin afectar el guardado de planificaciones single-grade. (Incluye guardia: el botón final se deshabilita hasta que haya 2+ grados y una CE válida, y la carga para edición reconoce `formData.modalidad === "multigrado"` para no tratar un registro multigrado como single-grade.)

## 6. Exportación Word (D7)

- [x] 6.1 Agregar `generarDocxMultigrado(plan)` en `lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts`, reutilizando los helpers de tabla/estilo ya existentes en el archivo.
- [x] 6.2 Renderizar el encabezado con "Grados:" en plural y el sufijo "· multigrado" en el título, igual que en los dos ejemplos validados.
- [x] 6.3 Renderizar la tabla de indicadores/saberes con una fila por grado.
- [x] 6.4 Renderizar cada semana como una tabla con una fila de actividad por grado.
- [x] 6.5 Ejecutar el skill `verificar-docx-visual` sobre este generador antes de dar la tarea por terminada, comparando contra el patrón de los ejemplos oficiales ya validados en la exploración. (Encontró y corrigió un bug real: tablas de semanas consecutivas sin párrafo separador se fusionaban en Word, repitiendo el encabezado de la Semana 1 sobre el contenido de semanas siguientes tras un salto de página — ver nota de riesgo abajo.)

## 7. Exportación PDF (D7)

- [x] 7.1 Agregar la rama equivalente para multigrado en `lib/curriculo-competencias-pdf-generator.ts`, replicando la estructura de la exportación Word.
- [x] 7.2 Confirmar visualmente (o con snapshot) que el PDF sigue el mismo patrón multigrado que el Word.

## 8. Edición de planificaciones existentes (D8)

- [x] 8.1 En `app/curriculo-competencias/ver/[id].tsx`, enrutar "Editar" según `formData.modalidad`: `"multigrado"` va a `egb-bgu-integrado` en modo multigrado con los datos precargados; ausente o `"unigrado"` conserva el comportamiento actual sin cambios.
- [x] 8.2 Verificar que abrir para editar una planificación multigrado precarga grados, CE y el contenido de cada grado/semana tal como fueron guardados. (Verificado por revisión manual campo por campo contra `PlanificacionCurriculoIntegradoMultigrado` — el efecto de carga usa `formData: any`, así que `tsc` no protege los nombres de campo aquí — más los tests de round-trip del normalizador ya existentes; no se hizo una prueba de componente en navegador real por la limitación de bundling de Metro ya reportada.)

## 9. Pruebas de extremo a extremo

- [x] 9.1 Extender `__tests__/curriculo-competencias-normalizer.test.ts` (o agregar un archivo dedicado) con casos de normalización del payload multigrado. (Se cumplió con el archivo dedicado `__tests__/curriculo-competencias-multigrado-router.test.ts` creado en la tarea 3.4, que ya cubre normalización, validación y el discriminador de exportación.)
- [x] 9.2 Extender `__tests__/curriculo-competencias-e2e.test.ts` con un flujo completo: crear planificación multigrado de 3 grados → guardar → exportar Word → exportar PDF. (6 tests nuevos: normalización, persistencia con `modalidad` explícito, export Word con verificación de contenido real del .docx, export PDF vía el dispatcher unificado, aislamiento de shape frente a Inicial/EGB-BGU, y un flujo de punta a punta que además confirma que un registro single-grade insertado en la misma sesión no se ve afectado.)
- [x] 9.3 Confirmar que los tests existentes de single-grade e Inicial siguen pasando sin modificaciones (no-regresión). (218/224 tests de curriculo-competencias en verde; las 6 fallas restantes son exactamente las mismas fallas preexistentes confirmadas contra la línea base con `git stash` en la tarea 3 — un problema de extracción de texto de .docx del entorno, no causado por este change.)

## 10. Cierre

- [x] 10.1 Actualizar `docs/curriculo-competencias/README.md` con una sección breve sobre la modalidad multigrado y su alcance (mismo subnivel, sin IA en esta versión). (Se agregó como sección nueva con nota explícita de que el resto del README describe el piloto original y no el wizard Currículo Integrado en general — eso es una brecha preexistente fuera de alcance de este change.)
- [x] 10.2 Revisar que ningún archivo de Inicial (`lib/curriculo-competencias-inicial-word-generator.ts`, `app/curriculo-competencias/inicial.tsx`) fue modificado por este change. (Confirmado: `git diff` vacío para ambos archivos.)
