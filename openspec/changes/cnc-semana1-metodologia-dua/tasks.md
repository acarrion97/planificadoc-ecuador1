## 1. Datos de calibración curricular

- [x] 1.1 Curar, por subnivel (Inicial/Preparatoria/Elemental/Media/Superior/Bachillerato), un resumen breve de instrumentos/técnicas de evaluación diagnóstica apropiados, verificado directamente contra la "Caja de herramientas para evaluación diagnóstica" (MinEduc, 2020): Tabla 3 (lectura, pág. 16), Tabla 4 (escritura, pág. 18), Tablas 5-7 (matemática, págs. 23-25), sección Inicial/Preparatoria (pág. 29-31). Confirmado con fuente primaria (no inferido): "pictogramas y gráficos" solo aparece explícitamente en Tabla 5 (Elemental/Matemática); Media/Superior/Bachillerato no mencionan pictogramas.
- [x] 1.1b Curar ejemplos de ESTRATEGIA metodológica (no instrumento) por subnivel, verificados verbatim contra los Lineamientos Pedagógicos Costa-Galápagos 2026-2027 §2.3-2.8 (pág. 16-19) — la misma fuente que documenta "Conecta, nivela y crea". Confirmado textualmente: Elemental → "círculo de lectura" y "teatro de cuentos" (pág. 17-18); Inicial → "metodología de juego-trabajo" (pág. 16).
- [x] 1.2 Implementado como funciones en `lib/curriculo-prerrequisitos.ts` (junto a `resolverPrerrequisito`, mismo archivo de reglas curriculares curadas): `calibracionInstrumentoPorSubnivel(subnivel)` y `textoCalibracionInstrumento(subnivel)`.
- [x] 1.3 Confirmado: la tabla se indexa únicamente por `Subnivel`, no por grado ni por modalidad BT — no hay entrada ni rama para BT, que sigue anclado exclusivamente a `contextoBT` (Figura Profesional/módulo) en `server/cnc-router.ts`, sin heurística de edad.

## 2. Tipos (`data/types-cnc.ts`)

- [x] 2.1 Agregado `metodologiaDeclarada: string` a `Semana1CNC` (obligatorio, default `""` en ambas fábricas).
- [x] 2.2 Agregado `duaActividadesAdaptacion?: DUAActividad[]` a `Semana1CNC`, importando el tipo de `data/types.ts` (solo el tipo — sin acoplamiento de runtime, respetando el aislamiento de CNC documentado en el header del archivo).
- [x] 2.3 Extendido `ConectaNivelaCreaAiResult`: `metodologiaDeclaradaSugerida?: string`, `duaActividadesAdaptacionSugeridas?: DUAActividad[]`, `duaTecnicaDiagnosticoSugerida?: DUAActividad[]` (índice paralelo a `tecnicaDiagnosticoSugerida`, ya que el instrumento también requiere DUA por el Requirement de spec.md).
- [x] 2.4 Actualizadas ambas fábricas `planCNCVacio()` (`app/ver-evaluacion/[id].tsx` y `app/conecta-nivela-crea/index.tsx`) con `metodologiaDeclarada: ""`.

## 3. Backend — prompt de Semana 1 (`server/cnc-router.ts`)

- [x] 3.1 En `buildPrompt`: `subnivelCurso = esBT ? null : subnivelDesdeGrado(input.grado)` (deriva el subnivel del GRADO real vía la función ya confiable del resto del repo, no del campo `input.subnivel` de texto libre) → `calibracionSemana1` con ambos bloques (estrategias + instrumento), inyectado justo después del encabezado "SEMANA 1 — CONECTA".
- [x] 3.2 Agregado `metodologiaDeclarada` al `Semana1Schema` (Zod) y a la sección del prompt; instrucción explícita de que los ejemplos de la calibración son orientativos, no una receta obligatoria, y que la IA puede proponer otra estrategia coherente.
- [x] 3.3 Instrucción DUA agregada (texto en español, adaptada del patrón de `topics-router.ts:286-300`): `{I,R,A}` por actividad de adaptación Y por instrumento sugerido, en arrays paralelos `dua`.
- [x] 3.4 Los apoyos visuales/pictogramas quedaron explícitamente enmarcados como parte del principio DUA "Representación" dentro de la instrucción — no hay campo obligatorio separado.
- [x] 3.5 Esquema JSON actualizado con `metodologiaDeclaradaSugerida`, `duaActividadesAdaptacionSugeridas`, `duaTecnicaDiagnosticoSugerida`.
- [x] 3.6 Normalización implementada como `normalizarDua(raw, count)` (función compartida, reutilizada para ambos arrays DUA de Semana 1) que fuerza cobertura de los 3 principios en el último ítem si la IA los omite — mismo mecanismo que `topics-router.ts`. Aplicada en `generate` al parsear la respuesta de la IA.
- Además se agregó una instrucción explícita de diferenciación (estrategia ≠ actividad ≠ instrumento ≠ DUA) pedida por el revisor para que la IA no confunda "usar pictogramas" con una metodología.

## 4. Backend — fusión interdisciplinaria de Crea

- [x] 4.1 Agregada `INSTRUCCION_FUSION_AREAS` como constante compartida en `buildPrompt` ("INSTRUCCIONES IMPORTANTES"): articulación auténtica en título/descripción/producto cuando `areasIntegradas.length > 1`, aclarando explícitamente que NO exige que cada actividad individual evalúe ambas áreas.
- [x] 4.2 La MISMA constante `INSTRUCCION_FUSION_AREAS` se inyecta también en `sugerirProyecto` (guardada tras `esBT ? "" : ...`, ya que BT no usa `areasIntegradas`) — un solo string fuente para ambos endpoints, imposible que diverjan por edición independiente.

## 5. Generadores de documentos

- [x] 5.1 `lib/cnc-word-generator.ts`: `metodologiaDeclarada` se renderiza como fila visible ("Metodología declarada:") justo debajo del encabezado de sección "SEMANA 1 — CONECTA" y antes de la tabla de detalle (no como campo técnico aislado). Los indicadores DUA por actividad de `actividadesAdaptacion` se renderizan como cuadrados de color (`▪`) al final de cada línea, con la misma paleta que `lib/plan-word-generator.ts` (Representación `#EC4899`, Acción y Expresión `#1E3A5F`, Implicación `#22C55E`), más una fila de leyenda ("Leyenda DUA: ...") cuando hay datos DUA.
- [x] 5.2 `lib/pdf-generator.ts` (`generarHTMLPlanCNC`): mismo tratamiento que 5.1 para la salida HTML/PDF — fila de metodología declarada y cuadrados DUA inline (llenos si aplica, atenuados si no) por actividad, con leyenda, siguiendo la convención visual ya usada en otras secciones del mismo archivo (líneas ~1040-1057).
- [x] 5.3 Verificado con la skill `verificar-docx-visual`: se generó un .docx de prueba (Básica Elemental, 3 actividades con combinaciones distintas de DUA) → convertido a PDF vía Word COM → rasterizado a PNG vía WinRT. Resultado: 2 páginas (sin regresión de layout tipo `columnWidths`), fila de metodología visible y legible bajo el encabezado de Semana 1, cuadrados DUA de color distinguibles junto a cada actividad, leyenda legible. Resto del documento (Semanas 2-3, 4-5) sin cambios visuales. Artefactos de prueba borrados tras la verificación.

## 6. Frontend (`app/conecta-nivela-crea/index.tsx`)

- [x] 6.1 Paso 1 (Conecta): campo editable de `metodologiaDeclarada`, con un texto de ayuda fijo (no editable) que explica que la sugerencia de IA se calibra según los Lineamientos Pedagógicos vigentes para el subnivel, y que editar el texto reemplaza la sugerencia por la decisión propia del docente sin implicar que esa base curricular deja de existir. Si `aiResult.metodologiaDeclaradaSugerida` difiere del valor actual, se muestra aparte (no se pierde) con un botón "toca para usarla".
- [x] 6.2 Paso 1: indicadores DUA por actividad de `actividadesAdaptacion`, reutilizando la misma paleta/patrón visual de cuadrados de color que `app/ver-plan/[id].tsx` (`FaseCardView`/`duaMiniSq`) vía los componentes nuevos `DuaSquares`/`DuaLeyenda`.
- [x] 6.3 `handleGenerate`: `metodologiaDeclarada` se completa con `metodologiaDeclaradaSugerida` solo si el campo estaba vacío; `duaActividadesAdaptacion` se adopta junto con `actividadesAdaptacionSugeridas` únicamente cuando el docente no había escrito sus propias actividades (mismo condicional — los índices de DUA solo corresponden a la lista de la IA).
- [x] 6.4 Paso Resultado: la sección "Semana 1 — Adaptación sugerida" ahora muestra `aiResult.metodologiaDeclaradaSugerida` y los cuadrados DUA (`aiResult.duaActividadesAdaptacionSugeridas`) junto a cada actividad, con la misma leyenda.

## 7. Tests

- [x] 7.1 y 7.2 `__tests__/cnc-semana1-metodologia-dua.test.ts` (12 tests, pasan) usando el patrón `router.createCaller()` + mock de `invokeLLM`/`getDb` (mismo patrón que `desagregacion-router.test.ts`):
  - Elemental (3.° EGB) recibe las estrategias oficiales del subnivel en el prompt, dentro de la sección de Semana 1.
  - 8.° EGB (Básica Superior) NO recibe las estrategias de Elemental (calibración correctamente scoped por subnivel — este test **encontró y corrigió un bug real**: la instrucción genérica de diferenciación usaba "círculo de lectura" como ejemplo hardcodeado, filtrándose a TODOS los subniveles independientemente de la calibración).
  - BT no recibe la calibración por subnivel.
  - La estrategia metodológica y la calibración del instrumento aparecen como bloques distintos y ambos presentes (uno no reemplaza al otro — arquitectura pedida explícitamente por el revisor).
  - DUA sigue presente en las instrucciones del prompt.
  - La normalización de la respuesta garantiza los 3 principios DUA cubiertos aunque la IA los omita.
  - `generate()` y `sugerirProyecto()` conservan exactamente la misma instrucción de fusión de áreas (incluida una prueba de que BT no la recibe, y que un área sola no rompe nada).
- [x] 7.3 `__tests__/cnc-calibracion-instrumento.test.ts` (23 tests, pasan): cobertura de los 6 subniveles tanto para instrumentos (`calibracionInstrumentoPorSubnivel`) como para estrategias metodológicas (`estrategiasMetodologicasPorSubnivel`); subnivel 0 devuelve `null` en ambos (no inventa); Elemental es el único subnivel con apoyo pictográfico explícito; Inicial/Preparatoria son observacionales (no prueba escrita); Elemental incluye literalmente "círculo de lectura"/"teatro de cuentos" citando Lineamientos 2026-2027 §2.5.
- [x] 7.4 Test de compatibilidad (`__tests__/cnc-producto-final.test.ts`, nuevo describe "Compatibilidad con planes persistidos..."): un plan al que se le eliminan literalmente las claves `metodologiaDeclarada` y `duaActividadesAdaptacion` (simulando JSON persistido de antes de este cambio, no solo valores vacíos) se renderiza sin errores tanto en `generarWordPlanCNC` como en `generarHTMLPlanCNC`, cayendo a "—" para la metodología ausente.

## 8. Verificación final

- [x] 8.1 Confirmado por dos vías (no se llegó a ejecutar un clic real en la UI del navegador dentro de esta sesión): (a) a nivel de backend, los tests de `cnc-semana1-metodologia-dua.test.ts` ejercitan exactamente un caso de 3.° EGB con `areasIntegradas: ["LL","M"]` a través de `cncRouter.generate()` y confirman que el prompt lleva la calibración de Elemental y la instrucción de fusión auténtica; (b) a nivel de documento, se generó y se inspeccionó visualmente (vía el pipeline Word→PDF→PNG del skill `verificar-docx-visual`) un plan de prueba de 3.° EGB con LL+M cuyo proyecto de Crea articula ambas áreas en un solo producto ("Feria del mercado simulado con narración oral y cálculo de compras", no listas separadas), con la metodología declarada visible y los indicadores DUA legibles junto a cada actividad de Semana 1.
- [x] 8.2 Mismo pipeline de verificación visual aplicado a un plan de prueba en modalidad BT (1ro BT, Figura Profesional + módulo): el documento generado ancla la metodología y el diagnóstico exclusivamente a "Reconocimiento de espacios técnicos"/"Diagnóstico técnico (criterios reales del módulo)" y al producto acreditable, sin ningún campo ni heurística de edad/grado — consistente con el test "Bachillerato Técnico NO recibe la calibración por subnivel" de `cnc-semana1-metodologia-dua.test.ts`.
