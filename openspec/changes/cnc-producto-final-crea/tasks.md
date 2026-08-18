## 1. Tipos y defaults

- [ ] 1.1 Extender `ProyectoInterdisciplinarioCNC` en `data/types-cnc.ts` con `productoFinal: string`, `actividadesSemana4: string[]`, `actividadesSemana5: string[]`
- [ ] 1.2 Extender `ProductoAcreditableBT` con `actividadesSemana4: string[]`, `actividadesSemana5: string[]`
- [ ] 1.3 Actualizar ambas fábricas `planCNCVacio()` (`app/ver-evaluacion/[id].tsx` y `app/conecta-nivela-crea/index.tsx`) con los defaults de los campos nuevos

## 2. Sugerencia de IA

- [ ] 2.1 Extender el esquema JSON de `buildPrompt` (`server/cnc-router.ts`) para `proyectoSugerido`: `productoFinal`, `actividadesSemana4`, `actividadesSemana5` (3-5 items cada una)
- [ ] 2.2 Extender el esquema de `productoAcreditableSugerido` con `actividadesSemana4`, `actividadesSemana5`
- [ ] 2.3 Añadir instrucciones al prompt: derivar producto/actividades de las DCD diagnosticadas y reforzadas, áreas integradas y contexto; no inventar códigos/criterios fuera de catálogo; si el docente ya escribió un campo, devolverlo tal cual

## 3. Wizard — UI y merge

- [ ] 3.1 Paso 3 (Crea) General: campo editable "Producto final" y listas editables "Actividades Semana 4" / "Actividades Semana 5" (una por línea) en `plan.semana4y5.proyecto`
- [ ] 3.2 Paso 3 (Crea) BT: listas editables de actividades S4/S5 para `plan.semana4y5BT.productoAcreditable`
- [ ] 3.3 `handleGenerate`: aplicar los campos nuevos del `aiResult` solo si el campo del plan está vacío (regla existente de no sobreescribir)
- [ ] 3.4 Paso Resultado: renderizar producto final y actividades S4/S5 (General y BT) con guard de campos ausentes (`?? []` / `?? ""`)

## 4. Generadores Word/PDF

- [ ] 4.1 `lib/pdf-generator.ts` (General): línea "Producto final:" + celdas SEMANA 4/5 con `actividadesSemana4/5` reales y fallback a los textos legados si vacíos
- [ ] 4.2 `lib/pdf-generator.ts` (BT): celdas SEMANA 4/5 con las actividades reales y fallback
- [ ] 4.3 `lib/cnc-word-generator.ts` (General y BT): mismo cambio que 4.1/4.2 en `rows.push(...)` del bloque Crea (líneas ~387-412)

## 5. Verificación

- [ ] 5.1 `pnpm check` sin nuevos errores TS sobre el baseline (49)
- [ ] 5.2 Tests: merge de campos nuevos (solo vacíos), salida de generadores con y sin campos nuevos (fallback legado), tipos de General y BT
- [ ] 5.3 Smoke test manual en preview: generar plan General y BT, verificar producto final + actividades en resultado y en exportación Word/PDF; abrir un plan legado y exportar sin errores