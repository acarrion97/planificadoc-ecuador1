## 1. Extensión de tipos y helpers del catálogo

- [x] 1.1 Extender `FiguraProfesional` (en `data/bachillerato-tecnico.ts` / `data/types-bt.ts`) con `codigo?: string`, `estado: "activa" | "deprecada"`, `reemplazadaPor?: string` y `normativaVigente?: string`
- [x] 1.2 Añadir helper `obtenerFigurasActivas()` (o filtro por `estado`) que excluya figuras `deprecada`
- [x] 1.3 Asegurar que `obtenerFiguraPorId()` resuelve también figuras deprecadas (planes históricos reproducibles)
- [x] 1.4 Verificar que `obtenerFigurasPorFamilia()` / `obtenerFamiliasPorArea()` siguen correctos con los nuevos campos y exportar tipos/helpers en `data/index.ts`

## 2. Actualización del catálogo a 00051-A

- [x] 2.1 Renombrar `gestion-financiera`: "Gestión Financiera" → "Gestión financiera y contable"
- [x] 2.2 Renombrar las figuras de la familia Artes: `artes-plasticas` → "Artes plásticas y gestión cultural", `artes-escenicas` → "Artes escénicas y gestión cultural", `musica` → "Música y gestión cultural"
- [x] 2.3 Mover `climatizacion` de la familia `construccion` a `industrial`
- [x] 2.4 Mover `instalaciones-electricas` a la familia `industrial` y renombrarla a "Instalaciones eléctricas y automatización"
- [x] 2.5 Marcar `construcciones-metalicas` como `deprecada`, con `normativaVigente` y `reemplazadaPor: "mecanica-industrial"` (sin eliminar el registro ni sus módulos)
- [x] 2.6 Crear la figura `mecanica-industrial` ("Mecánica industrial") en la familia `industrial`, `estado: "activa"`, con su `codigo` oficial
- [x] 2.7 Corregir el bug de la familia `artes`: `area: "deportes_salud"` → `"artistica"`
- [x] 2.8 Asignar `codigo` oficial (DS-xx / AR-xx / TC-xx-xx) a las figuras afectadas por la reforma

## 3. Decisión de módulos de `mecanica-industrial`

- [x] 3.1 Inspeccionar los módulos CM.1.1/CM.2.1/CM.3.1 de `construcciones-metalicas` y compararlos contra el perfil oficial de "Mecánica industrial"
- [x] 3.2 Aplicar la decisión de currículo y registrarla: reutilizar los módulos CM.* por referencia compartida si representan el currículo de Mecánica industrial, o redactar módulos propios si difieren — sin copia silenciosa
- [x] 3.3 Verificar que los módulos CM.* permanecen asociados a `construcciones-metalicas` (reproducción de planes históricos)

## 4. Ajuste de consumidores

- [x] 4.1 `app/conecta-nivela-crea/index.tsx`: el selector de figuras usa figuras activas (no muestra `construcciones-metalicas`)
- [x] 4.2 `app/ver-cnc/[id].tsx`: la resolución de `figuraProfesionalId` sigue usando el catálogo completo (incluye deprecadas)
- [x] 4.3 `app/bachillerato-tecnico.tsx`: verificar la navegación tras la corrección del área de `artes` y decidir si la vista de catálogo muestra figuras deprecadas en modo solo lectura

## 5. Pruebas de regresión

- [x] 5.1 Un plan guardado con `figuraProfesionalId: "construcciones-metalicas"` sigue resolviéndose y se reproduce
- [x] 5.2 Un plan nuevo no ofrece `construcciones-metalicas` en el selector y sí ofrece "Mecánica industrial"
- [x] 5.3 El catálogo mantiene 3 áreas, 11 familias y 34 figuras vigentes (suma verificada)
- [x] 5.4 Conteo de figuras activas vs deprecadas coherente (resultado real: 34 activas + 1 deprecada; la deprecada queda fuera de la lista de figuras de su familia y solo es resoluble por ID)
- [x] 5.5 `pnpm check` no incrementa los errores TS preexistentes del repo
- [x] 5.6 Los tests existentes relevantes (`pnpm test __tests__/...`) siguen pasando