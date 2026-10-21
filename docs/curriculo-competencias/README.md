# Currículo por Competencias — Plan Piloto

Módulo de planificación microcurricular alineado con el **Currículo Priorizado por Competencias** del Ministerio de Educación del Ecuador.

> **Estado**: Piloto funcional (Fase 12). 178 tests, 0 errores TS nuevos.
> **Branch**: `preview/curriculo-competencias`

---

## Qué hace

Permite a docentes y coordinadores crear, editar, visualizar y exportar planificaciones microcurriculares que integran competencias transversales (C, M, CD, CS) en el diseño curricular.

## Familias soportadas

| Familia | Niveles | Estructura | Generador Word | Generador PDF |
|---------|---------|------------|----------------|---------------|
| **EGB / BGU** | 1ro–10mo | DCD + Competencias + Estrategia didáctica (ERCA/IDC) + Evaluación | `curriculo-competencias-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |
| **Inicial / Preparatoria** | Inicial 1–4 años, Preparatoria | Ámbitos de desarrollo + Clases por ámbito + NEES + Firmas (4) | `curriculo-competencias-inicial-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |

## Flujo funcional

```
1. Seleccionar tipo (EGB/BGU o Inicial/Preparatoria)
2. Completar formulario paso a paso
   - EGB/BGU: Datos → DCD → Estrategia → Evaluación
   - Inicial: Datos → Ámbitos → Clases
3. Guardar (persiste en BD)
4. Visualizar detalle
5. Exportar Word (.docx) o PDF (HTML para impresión)
```

## Estructura de pantallas

| Ruta | Pantalla | Descripción |
|------|----------|-------------|
| `/curriculo-competencias` | Listado | Lista con filtros por tipo y estado |
| `/curriculo-competencias/nuevo` | Selector | Elige EGB/BGU o Inicial/Preparatoria |
| `/curriculo-competencias/egb-bgu` | Formulario | Formulario de 4 pasos (create + edit) |
| `/curriculo-competencias/inicial` | Formulario | Formulario por ámbitos (create + edit) |
| `/curriculo-competencias/ver/[id]` | Detalle | Vista completa + Editar + Eliminar + Exportar |

## Competencias transversales

| Código | Nombre | Color |
|--------|--------|-------|
| **C** | Comunicación | `#3498DB` (azul) |
| **M** | Matemática | `#E74C3C` (rojo) |
| **CD** | Conocimiento del Medio | `#9B59B6` (morado) |
| **CS** | Creatividad Social | `#27AE60` (verde) |

Los códigos son **inmutables**. Los nombres, descripciones y colores son editables en `data/competencias-transversales.ts`.

## Estrategias metodológicas

- **ERCA** (Experiencia → Reflexión → Conceptualización → Aplicación) — default EGB/BGU
- **IDC** (Indagación → Discusión → Construcción) — alternativa EGB/BGU
- Las estrategias definen CÓMO se organiza la actividad, no QUÉ se enseña.

## Ámbitos de desarrollo (Inicial/Preparatoria)

7 ámbitos: Socioemocional, Cognitivo-Lingüístico, Comunicativo Expresivo, Motor, Moral Espiritual, Estético-Creativo, Salud Bienestar.

## Modalidad multigrado (Currículo Integrado EGB/BGU)

> Nota: esta sección documenta únicamente la modalidad multigrado. El resto de
> este README describe el estado del plan piloto original (DCD + Inicial) y
> no refleja todavía el wizard "Currículo Integrado" (`egb-bgu-integrado.tsx`,
> basado en competencias específicas CE.\* del catálogo MESOCURRICULUM) del
> que multigrado es un modo — ver `openspec/changes/curriculo-integrado-egb-bgu-multigrado/`
> para el diseño completo.

Dentro del wizard `app/curriculo-competencias/egb-bgu-integrado.tsx`, el docente puede elegir entre "Un solo grado" (comportamiento existente) o "Multigrado": combinar **2 o más grados del mismo subnivel** (ej. 8.º, 9.º y 10.º EGB) en una sola planificación, para aulas multigrado reales.

**Alcance de esta primera versión:**
- Solo grados del **mismo subnivel** — combinar subniveles distintos (ej. 6.º con 7.º) no está soportado; el sistema bloquea la selección y explica qué grado(s) quedan sin cobertura si la Competencia Específica elegida no aplica a todos.
- El bloque curricular (indicadores + saberes declarativos/procedimentales/actitudinales) se **resuelve automáticamente** del catálogo por CE+grado, y queda como copia editable — no afecta al catálogo ni se ve afectado por cambios posteriores a él.
- Las semanas (tema común + actividad por grado) se completan **manualmente**; la generación asistida por IA para esta modalidad todavía no existe (queda para un change posterior, una vez aterrice la generación semanal por IA de single-grade).
- Exportación a Word y PDF disponible, siguiendo el mismo patrón validado contra ejemplos reales del pilotaje MINEDUC (encabezado con grados en plural, tabla de saberes e indicadores con una fila por grado, semanas cruzadas por grado).

**Piezas clave:**
- `data/types-curriculo-competencias.ts` — tipos `GrupoGrado`, `BloqueCurricularGrado`, `SemanaMultigrado`, `ActividadPorGrado`, `PlanificacionCurriculoIntegradoMultigrado`
- `data/competencias-especificas-egb-bgu.ts` — `resolverBloquePorGrado`, `ceDisponibleParaGrados`
- `server/curriculo-competencias-router.ts` — mutations `createMultigrado`/`updateMultigrado`, discriminador `determinarFamiliaExportacion` (lee `formData.modalidad` antes de caer a la heurística de prefijo de código usada por los registros anteriores a esta funcionalidad)
- `lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts` → `generarDocxMultigrado`
- `lib/curriculo-competencias-pdf-generator.ts` → `generarCurriculoCompetenciasPdfMultigrado`

## Normalización

El flujo de datos es:

```
Input raw (UI) → normalizer → Modelo canónico → tRPC → BD
                                          ↓
                                    Generadores (Word/PDF)
```

- `lib/curriculo-competencias-normalizer.ts` convierte raw → canónico
- Cada elemento normalizado conserva `SourceTraceability`
- El normalizer es permisivo: campos faltantes se completan con defaults

## Persistencia

Tabla `curriculo_competencias_planificaciones`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | PK autoincrement | ID numérico |
| `sessionId` | string | Sesión del usuario |
| `tipo` | `egb_bgu` \| `inicial_preparatoria` | Familia |
| `status` | `draft` \| `generated` \| `paid` | Estado |
| `formData` | JSON | Modelo canónico completo |
| `grado`, `institucion`, `docente`, etc. | string | Campos indexables |

## Exportación

### Word (.docx)
- Genera ZIP con `word/document.xml` (formato Office Open XML)
- A4 landscape, fuentes Arial, tablas con bordes
- EGB/BGU: 6 secciones (datos, DCD, competencias, estrategia, evaluación, firmas)
- Inicial: datos + ámbitos con clases + NEES + 4 firmas

### PDF
- Genera HTML con `@page { size: A4 landscape }` y `print-color-adjust: exact`
- Se abre en nueva ventana del navegador para imprimir/guardar como PDF
- Mismas secciones que Word, estilo visual con colores por competencia

## Comandos de verificación

```bash
# TypeScript check
pnpm check

# Todos los tests del módulo
pnpm test __tests__/curriculo-competencias

# Tests individuales
pnpm test __tests__/curriculo-competencias-normalizer
pnpm test __tests__/curriculo-competencias-router
pnpm test __tests__/curriculo-competencias-word-export
pnpm test __tests__/curriculo-competencias-pdf-export
pnpm test __tests__/curriculo-competencias-e2e
pnpm test __tests__/curriculo-competencias-integration
```

## Cobertura de tests

| Archivo | Tests | Qué cubre |
|---------|-------|-----------|
| `normalizer.test.ts` | 32 | Normalización raw → canónico, competencias, trazabilidad |
| `router.test.ts` | 22 | CRUD, serialización JSON, edge cases |
| `word-export.test.ts` | 32 | ZIP válido, contenido, regresión, edge cases |
| `pdf-export.test.ts` | 33 | HTML válido, estructura, aislamiento cross-family |
| `e2e.test.ts` | 20 | Flujo completo normalizar → persistir → exportar |
| `integration.test.ts` | 39 | Contrato endpoints, aislamiento, hardening, sanitización |
| **Total** | **178** | |

## Archivos clave

```
data/
  types-curriculo-competencias.ts    # Modelo canónico + SourceTraceability
  competencias-transversales.ts      # Catálogo C/M/CD/CS (configurable)
  estrategias-metodologicas.ts       # Catálogo ERCA/IDC
  ambitos-desarrollo-inicial.ts      # 7 ámbitos Inicial/Preparatoria

lib/
  curriculo-competencias-normalizer.ts          # Raw → canónico
  curriculo-competencias-word-generator.ts      # Word EGB/BGU
  curriculo-competencias-inicial-word-generator.ts  # Word Inicial
  curriculo-competencias-pdf-generator.ts       # PDF ambas familias

server/
  curriculo-competencias-router.ts   # tRPC CRUD + export endpoints

app/curriculo-competencias/
  index.tsx          # Listado
  nuevo.tsx          # Selector de tipo
  egb-bgu.tsx        # Formulario EGB/BGU
  inicial.tsx        # Formulario Inicial/Preparatoria
  ver/[id].tsx       # Detalle + edición + exportación
```
