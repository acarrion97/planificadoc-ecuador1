## Why

Las aulas multigrado (varios grados de EGB/BGU compartiendo un mismo espacio y docente, comunes en zonas rurales de Sierra y Amazonía) siguen el mismo Currículo Nacional por Competencias, pero hoy `egb-bgu-integrado` solo permite planificar **un** grado a la vez. El docente de un aula multigrado no tiene forma de generar una única planificación que combine sus grados con el patrón que el propio equipo de pilotaje ya usa (título "· multigrado", tabla de saberes y tablas semanales cruzadas por grado, verificado contra dos ejemplos reales del MINEDUC y contra la plantilla oficial en blanco). Sin esto, el docente debe fabricar planificaciones separadas por grado que no reflejan cómo enseña realmente ni el formato socializado.

## What Changes

- Se agrega un modo **"Planificación multigrado"** dentro del wizard existente `egb-bgu-integrado` (junto al modo actual, que pasa a llamarse implícitamente "single-grade"). No se crea un wizard nuevo.
- El paso "Competencias" del modo multigrado exige: elegir subnivel → elegir 2..N grados de ese mismo subnivel → elegir una Competencia Específica (CE) disponible para **todos** los grados seleccionados. Si la CE no cubre algún grado seleccionado, el sistema bloquea la selección y explica la incompatibilidad (no se permite combinar grados de distinto subnivel ni "inventar" una CE común en esta primera versión).
- Por cada grado seleccionado, el sistema resuelve automáticamente desde el catálogo existente (`porGrado` en `data/competencias-especificas-egb-bgu.ts`) un **bloque curricular** (indicadores + saberes declarativos/procedimentales/actitudinales) y guarda una copia editable en la planificación — el catálogo permanece como fuente de verdad; una edición docente o un cambio futuro del catálogo no corrompe planificaciones ya guardadas.
- El docente puede editar/curar el bloque curricular resuelto de cada grado antes de generar (no hay selección manual de "destrezas sueltas": el catálogo ya entrega los saberes agrupados por CE+grado, y así se mantiene la coherencia con la matriz oficial).
- Se generan semanas con un tema común por semana y una actividad diferenciada por grado (estrategias DUA de inicio/desarrollo/cierre, recursos, técnica e instrumento), replicando el patrón verificado en los dos ejemplos multigrado reales (Matemática EGB Superior y Currículo Integrado de Inicial/Preparatoria).
- Se extiende la exportación a Word y PDF para renderizar el patrón multigrado (encabezado con "Grados:" en plural y "· multigrado", tabla de saberes cruzada por grado, tablas semanales cruzadas por grado), sin modificar la salida del modo single-grade.
- El modo single-grade actual (wizard, datos, generación, exportación) queda intacto — este cambio es puramente aditivo.

## Capabilities

### New Capabilities
- `curriculo-integrado-multigrado`: modalidad de planificación multigrado para Currículo Integrado EGB/BGU — selección de subnivel/grados/CE con validación de compatibilidad, resolución automática del bloque curricular por grado desde el catálogo existente, curación docente, generación de semanas diferenciadas por grado, persistencia, y exportación a Word/PDF siguiendo el patrón multigrado validado.

### Modified Capabilities
_(ninguna — no hay capabilities archivadas bajo `openspec/specs/` para Currículo Integrado todavía; ver Impact para la coordinación con el change en curso relacionado)._

## Impact

- **Wizard**: `app/curriculo-competencias/egb-bgu-integrado.tsx` — nuevo selector de modalidad y flujo de selección múltiple de grados en el paso "Competencias".
- **Tipos**: `data/types-curriculo-competencias.ts` — nuevos tipos (`modalidad`, `GrupoGrado`, `SemanaMultigrado`/`ActividadPorGrado`) aditivos a los existentes.
- **Normalización**: `lib/curriculo-competencias-normalizer.ts` — nueva función de normalización para el payload multigrado.
- **Backend**: `server/curriculo-competencias-router.ts` — validación de subnivel homogéneo y de cobertura de la CE en todos los grados; persistencia del nuevo shape (columna `formData` JSON existente, sin migración de esquema).
- **Generadores**: `lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts` y `lib/curriculo-competencias-pdf-generator.ts` — nueva rama de renderizado para el patrón multigrado.
- **Catálogo**: `data/competencias-especificas-egb-bgu.ts` — solo lectura (`gradosDeNivel`, `porGrado`); no requiere cambios, ya fue verificado contra las matrices MESOCURRICULUM oficiales.
- **Coordinación**: el change en curso `curriculo-integrado-egb-bgu-ia-semanal` (generación semanal por IA para single-grade) debe tenerse en cuenta al diseñar la generación de semanas multigrado, para no divergir en el enfoque de la IA entre ambos modos.
- **Sin impacto** en el modo single-grade existente ni en Inicial/Preparatoria (fuera de alcance, ver design.md).
