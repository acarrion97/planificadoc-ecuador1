## 1. Extensión de tipos y helpers del catálogo

- [ ] 1.1 Extender `FiguraProfesional` (en `data/bachillerato-tecnico.ts` / `data/types-bt.ts`) con `codigo?: string`, `estado: "activa" | "deprecada"`, `reemplazadaPor?: string` y `normativaVigente?: string`
- [ ] 1.2 Añadir helper `obtenerFigurasActivas()` (o filtro por `estado`) que excluya figuras `deprecada`
- [ ] 1.3 Asegurar que `obtenerFiguraPorId()` resuelve también figuras deprecadas (planes históricos reproducibles)
- [ ] 1.4 Verificar que `obtenerFigurasPorFamilia()` / `obtenerFamiliasPorArea()` siguen correctos con los nuevos campos y exportar tipos/helpers en `data/index.ts`

## 2. Actualización del catálogo a 00051-A

- [ ] 2.1 Renombrar `gestion-financiera`: "Gestión Financiera" → "Gestión financiera y contable"
- [ ] 2.2 Renombrar las figuras de la familia Artes: `artes-plasticas` → "Artes plásticas y gestión cultural", `artes-escenicas` → "Artes escénicas y gestión cultural", `musica` → "Música y gestión cultural"
- [ ] 2.3 Mover `climatizacion` de la familia `construccion` a `industrial`
- [ ] 2.4 Mover `instalaciones-electricas` a la familia `industrial` y renombrarla a "Instalaciones eléctricas y automatización"
- [ ] 2.5 Marcar `construcciones-metalicas` como `deprecada`, con `normativaVigente` y `reemplazadaPor: "mecanica-industrial"` (sin eliminar el registro ni sus módulos)
- [ ] 2.6 Crear la figura `mecanica-industrial` ("Mecánica industrial") en la familia `industrial`, `estado: "activa"`, con su `codigo` oficial
- [ ] 2.7 Corregir el bug de la familia `artes`: `area: "deportes_salud"` → `"artistica"`
- [ ] 2.8 Asignar `codigo` oficial (DS-xx / AR-xx / TC-xx-xx) a las figuras afectadas por la reforma

## 3. Decisión de módulos de `mecanica-industrial`

- [ ] 3.1 Inspeccionar los módulos CM.1.1/CM.2.1/CM.3.1 de `construcciones-metalicas` y compararlos contra el perfil oficial de "Mecánica industrial"
- [ ] 3.2 Aplicar la decisión de currículo y registrarla: reutilizar los módulos CM.* por referencia compartida si representan el currículo de Mecánica industrial, o redactar módulos propios si difieren — sin copia silenciosa
- [ ] 3.3 Verificar que los módulos CM.* permanecen asociados a `construcciones-metalicas` (reproducción de planes históricos)

## 4. Ajuste de consumidores

- [ ] 4.1 `app/conecta-nivela-crea/index.tsx`: el selector de figuras usa figuras activas (no muestra `construcciones-metalicas`)
- [ ] 4.2 `app/ver-cnc/[id].tsx`: la resolución de `figuraProfesionalId` sigue usando el catálogo completo (incluye deprecadas)
- [ ] 4.3 `app/bachillerato-tecnico.tsx`: verificar la navegación tras la corrección del área de `artes` y decidir si la vista de catálogo muestra figuras deprecadas en modo solo lectura

## 5. Pruebas de regresión

- [ ] 5.1 Un plan guardado con `figuraProfesionalId: "construcciones-metalicas"` sigue resolviéndose y se reproduce
- [ ] 5.2 Un plan nuevo no ofrece `construcciones-metalicas` en el selector y sí ofrece "Mecánica industrial"
- [ ] 5.3 El catálogo mantiene 3 áreas, 11 familias y 34 figuras vigentes (suma verificada)
- [ ] 5.4 Conteo de figuras activas vs deprecadas coherente (33 activas + 1 deprecada, o el balance que resulte de la suma total)
- [ ] 5.5 `pnpm check` no incrementa los errores TS preexistentes del repo
- [ ] 5.6 Los tests existentes relevantes (`pnpm test __tests__/...`) siguen pasando