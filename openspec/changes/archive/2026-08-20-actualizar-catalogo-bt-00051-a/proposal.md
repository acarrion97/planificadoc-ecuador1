## Why

El catálogo de Bachillerato Técnico embebido en `data/bachillerato-tecnico.ts` es fiel al Acuerdo MINEDUC-MINEDUC-2024-00065-A, pero ese acuerdo fue **sustituido** por el Acuerdo MINEDEC-MINEDEC-2025-00051-A (Art. 2 "Sustitúyase el artículo 4"), vigente desde el año lectivo 2025-2026. El catálogo actual ya no corresponde a la normativa vigente: ofrece figuras que hoy tienen otra denominación, otra familia o un nombre distinto, y omite la figura "Mecánica industrial".

## What Changes

- **Actualizar el catálogo BT de `00065-A` a `00051-A`** manteniendo los IDs internos existentes para no romper `PlanUnidadTrabajoBT`, AsyncStorage ni los planes guardados que referencian `figuraProfesionalId`.
- **Renombrar figuras que solo cambian de denominación** (ID estable):
  - `gestion-financiera`: "Gestión Financiera" → "Gestión financiera y contable"
  - `artes-plasticas`: "Gestión Cultural y Artes Plásticas" → "Artes plásticas y gestión cultural"
  - `artes-escenicas`: "Gestión Cultural y Artes Escénicas" → "Artes escénicas y gestión cultural"
  - `musica`: "Gestión Cultural y Música" → "Música y gestión cultural"
- **Mover de familia** (mismos IDs):
  - `climatizacion`: Construcción sostenible → Industrial
  - `instalaciones-electricas`: Construcción sostenible → Industrial, y renombrar a "Instalaciones eléctricas y automatización"
- **Deprecar y sustituir por equivalencia**:
  - `construcciones-metalicas` ("Estructuras y Construcciones Metálicas") pasa a **DEPRECADA**; no se elimina físicamente.
  - Nueva figura `mecanica-industrial` ("Mecánica industrial") en Industrial, con equivalencia `construcciones-metalicas → mecanica-industrial`.
- **Corregir bug de código** de la familia `artes`: `area: "deportes_salud"` → `"artistica"`.
- **Extender el tipo de catálogo** con campos normativos: `codigo` (oficial), `estado` (`activa`/`deprecada`), `reemplazadaPor`, `normativaVigente`.
- **Filtras en selección**: las figuras DEPRECADAS no deben poder seleccionarse en planes nuevos, pero un plan guardado con `figuraProfesionalId` deprecado debe seguir resolviéndose (render histórico).
- **Tratamiento explícito de `modulos[]`**: inspeccionar los 3 módulos de `construcciones-metalicas` (CM.1.1/CM.2.1/CM.3.1) y decidir —sin copia silenciosa— si se reutilizan bajo `mecanica-industrial` (currículo equivalente) o quedan como catálogo histórico para reproducir planes antiguos.
- **Fuera de alcance:** NO se introducen `OFERTA_INSTITUCIONAL`, `MATRICULA`, `ESTUDIANTE`, `PROFESOR` ni ningún modelo institucional. Este change es exclusivamente de catálogo.

## Capabilities

### New Capabilities
- `catalogo-bachillerato-tecnico`: comportamiento del catálogo de figuras profesionales del Bachillerato Técnico — jerarquía área/familia/figura, vigencia normativa (00065-A → 00051-A), resolución de figuras históricas/deprecadas y filtrado de selección para planes nuevos.

### Modified Capabilities
<!-- No existe spec previa del catálogo BT en openspec/specs/. -->

## Impact

- `data/bachillerato-tecnico.ts`: renames, movimientos de familia, nueva figura, deprecación, extensión de tipos e helpers de resolución.
- `data/types-bt.ts`: campos normativos (`codigo`, `estado`, `reemplazadaPor`, `normativaVigente`) y filtrado por estado.
- `data/index.ts`: exports de nuevos tipos/helpers si aplica.
- `app/bachillerato-tecnico.tsx`: navegación de área → familia → figura (afectada por el bug de `artes` y por figuras deprecadas).
- `app/conecta-nivela-crea/index.tsx`: selector de figura profesional — debe ocultar DEPRECADAS y ofrecer `mecanica-industrial`.
- `app/ver-cnc/[id].tsx`: resolución de `figuraProfesionalId` histórico (debe seguir funcionando con IDs deprecados).
- Sin cambios de API, dependencias ni base de datos (Drizzle).