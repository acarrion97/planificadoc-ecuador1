# AGENTS.md — Currículo por Competencias

Contrato técnico para agentes que modifiquen el módulo `curriculo-competencias`.

---

## Arquitectura y responsabilidades por archivo

### Dominio (`data/`)

| Archivo | Responsabilidad | Mutabilidad |
|---------|----------------|-------------|
| `types-curriculo-competencias.ts` | Modelo canónico, `SourceTraceability`, tipos EGB/BGU e Inicial | **No modificar sin revisar impacto en persistencia y tests** |
| `competencias-transversales.ts` | Catálogo C/M/CD/CS. Códigos inmutables, nombres editables | Códigos: **INMUTABLES**. Nombres/descripciones/colores: editables |
| `estrategias-metodologicas.ts` | Catálogo ERCA/IDC | Agregar nuevas estrategias: seguro. Modificar fases: revisar tests |
| `ambitos-desarrollo-inicial.ts` | 7 ámbitos Inicial/Preparatoria | Agregar/editar ámbitos: seguro |

### Normalización (`lib/`)

| Archivo | Responsabilidad |
|---------|----------------|
| `curriculo-competencias-normalizer.ts` | `normalizarPlanificacionEGBBGU()` y `normalizarPlanificacionInicial()` — convierten input raw a modelo canónico |

### Generadores (`lib/`)

| Archivo | Familia | Output |
|---------|---------|--------|
| `curriculo-competencias-word-generator.ts` | EGB/BGU | Blob (ZIP .docx) |
| `curriculo-competencias-inicial-word-generator.ts` | Inicial/Preparatoria | Blob (ZIP .docx) |
| `curriculo-competencias-pdf-generator.ts` | Ambas | HTML string |

### Persistencia (`server/`)

| Archivo | Responsabilidad |
|---------|----------------|
| `curriculo-competencias-router.ts` | CRUD + export endpoints (tRPC) |
| `drizzle/schema.ts` (tabla `curriculo_competencias_planificaciones`) | Esquema MySQL |

### UI (`app/curriculo-competencias/`)

| Archivo | Pantalla |
|---------|----------|
| `index.tsx` | Listado con filtros |
| `nuevo.tsx` | Selector de tipo |
| `egb-bgu.tsx` | Formulario EGB/BGU (4 pasos) |
| `inicial.tsx` | Formulario Inicial/Preparatoria (por ámbitos) |
| `ver/[id].tsx` | Detalle + edit + delete + export |

---

## Modelo canónico

### EGB/BGU (`PlanificacionCurriculoCompetencias`)

```typescript
{
  id: string;              // "plan-cc-<uuid>"
  sessionId: string;
  status: "draft" | "generated" | "paid";
  tipo: "egb_bgu";
  institucion: string;
  docente: string;
  nivel: "EGB" | "BGU";
  grado: string;
  paralelo: string;
  asignatura: string;
  trimestre: string;
  competenciasAsociadas: CompetenciaTransversalCode[];  // ["C","M","CD","CS"]
  destreza: DcdSeleccionada;    // { codigo, descripcion, competencias }
  indicadorEvaluacion: string;
  objetivoAprendizaje: string;
  estructuraDidactica: {
    estrategiaId: string;       // "erca" | "idc"
    fases: FaseDidactica[];
  };
  recursos: string;
  tecnicaEvaluacion: string;
  instrumentoEvaluacion: string;
  actividadesEvaluacion: string;
  source: SourceTraceability;
}
```

### Inicial/Preparatoria (`PlanificacionInicialCurriculo`)

```typescript
{
  id: string;              // "plan-ini-<uuid>"
  sessionId: string;
  status: "draft" | "generated" | "paid";
  tipo: "inicial_preparatoria";
  grado: string;
  institucion: string;
  docente: string;
  duracion: string;
  objetivoGeneral: string;
  ambitos: AmbitoDesarrollo[];   // Array de ámbitos con clases
  adaptacionesNEE: AdaptacionNEE[];
  firmas: { elaborado, revisado, coordinador, aprobado };
  source: SourceTraceability;
}
```

---

## Separación de concerns: raw → normalizer → persistence → generators

```
UI (raw input)
  ↓
normalizarPlanificacionEGBBGU(raw) / normalizarPlanificacionInicial(raw)
  ↓
Modelo canónico (con SourceTraceability)
  ↓
tRPC endpoint → Drizzle → MySQL (formData = JSON del canónico)
  ↓
exportWord / exportPdf → lee formData → genera output
```

**Reglas de flujo:**
1. La UI **nunca** persiste raw directamente; siempre pasa por el normalizer.
2. Los generadores **nunca** reciben raw; siempre el modelo canónico desde BD.
3. El normalizer es permisivo: campos faltantes se completan con defaults.
4. `SourceTraceability` se preserva en todo el flujo.

---

## Reglas EGB/BGU vs Inicial/Preparatoria

| Regla | Detalle |
|-------|---------|
| **No mezclar generadores** | EGB/BGU usa `word-generator.ts`. Inicial usa `inicial-word-generator.ts`. Nunca cruzar. |
| **No mezclar modelos** | EGB/BGU tiene `destreza`, `estructuraDidactica`, `competenciasAsociadas`. Inicial tiene `ambitos`, `clases`, `firmas`. |
| **Estrategias solo EGB/BGU** | Las estrategias ERCA/IDC aplican solo a EGB/BGU. Inicial no tiene estrategia didáctica. |
| **Inicial siempre tiene firmas** | 4 firmas: elaborado, revisado, coordinator, aprobado. |
| **Ámbitos solo Inicial** | Los 7 ámbitos de desarrollo son exclusivos de Inicial/Preparatoria. |
| **Competencias son compartidas** | C/M/CD/CS se usan en ambas familias. |

---

## Cómo extender competencias

1. Editar `data/competencias-transversales.ts`.
2. Los códigos existentes (`C`, `M`, `CD`, `CS`) son **inmutables**.
3. Para agregar una nueva competencia: agregar entrada al array `COMPETENCIAS_TRANSVERSALES`.
4. Actualizar `codigosCompetenciasActivas()` si es necesario.
5. Los tests de normalización y exportación validan que los códigos se preservan.

**No hacer:**
- Reasignar un código existente a otra competencia.
- Eliminar un código sin migrar datos existentes.

---

## Cómo modificar los generadores

### Word
- Modificar `lib/curriculo-competencias-word-generator.ts` (EGB/BGU) o `lib/curriculo-competencias-inicial-word-generator.ts` (Inicial).
- El generador recibe el modelo canónico completo.
- Output: `Blob` con ZIP que contiene `word/document.xml`.
- Después de modificar, ejecutar `pnpm test __tests__/curriculo-competencias-word-export` y el test de verificación visual si aplica.

### PDF
- Modificar `lib/curriculo-competencias-pdf-generator.ts`.
- Ambas familias usan el mismo archivo.
- Output: `string` (HTML completo con `<!DOCTYPE html>`).
- Funciones exportadas: `generarCurriculoCompetenciasPdfEGBBGU()` y `generarCurriculoCompetenciasPdfInicial()`.
- Después de modificar, ejecutar `pnpm test __tests__/curriculo-competencias-pdf-export`.

**No hacer:**
- Agregar `<script>` al HTML del PDF (se imprime en navegador).
- Usar la función incorrecta para la familia (EGB-BGU vs Inicial).

---

## Endpoints tRPC

```typescript
curriculoCompetencias: {
  // CRUD
  createEGBBGU:    mutation(input: PlanificacionEGBBGUInput) → { id, success }
  createInicial:   mutation(input: PlanificacionInicialInput) → { id, success }
  getById:         query(input: { id }) → PlanificacionRow
  list:            query(input: { sessionId?, status?, tipo? }) → PlanificacionRow[]
  updateEGBBGU:    mutation(input: PlanificacionEGBBGUInput & { id }) → { success }
  updateInicial:   mutation(input: PlanificacionInicialInput & { id }) → { success }
  updateStatus:    mutation(input: { id, status }) → { success }
  delete:          mutation(input: { id }) → { success }

  // Exportación
  exportWord:      mutation(input: { id }) → { base64, filename, mimeType }
  exportPdf:       mutation(input: { id }) → { html, filename }
}
```

**Notas:**
- `exportWord` usa dynamic import del generador según `row.tipo`.
- `exportPdf` usa dynamic import de `curriculo-competencias-pdf-generator`.
- `createEGBBGU` y `createInicial` son endpoints separados (no genéricos).

---

## Convenciones de testing

### Estructura de tests

```
__tests__/
  curriculo-competencias-normalizer.test.ts    # 32 tests — unidad
  curriculo-competencias-router.test.ts        # 22 tests — integración router
  curriculo-competencias-word-export.test.ts   # 32 tests — exportación Word
  curriculo-competencias-pdf-export.test.ts    # 33 tests — exportación PDF
  curriculo-competencias-e2e.test.ts           # 20 tests — flujo completo
  curriculo-competencias-integration.test.ts   # 39 tests — contrato + hardening
```

### Patrones de mock

- Mock de DB: `vi.mock("../server/db", ...)` con `mockDb` que simula insert/select/update/delete.
- Store en memoria: `Map<number, any>` con auto-increment.
- Los tests de exportación usan `JSZip` para validar ZIP y extraer `word/document.xml`.

### Reglas de testing

1. **Después de modificar un generador**: ejecutar el test correspondiente + `pnpm test __tests__/curriculo-competencias`.
2. **Después de modificar el normalizer**: ejecutar `pnpm test __tests__/curriculo-competencias-normalizer`.
3. **Antes de commit**: `pnpm check` + `pnpm test __tests__/curriculo-competencias`.
4. **Tests de aislamiento**: verificar que EGB/BGU e Inicial nunca se mezclan.
5. **Tests de contrato**: verificar estructura exacta de respuesta de endpoints.

---

## Invariantes que no deben romperse

| ID | Invariante | Verificado por |
|----|-----------|----------------|
| **INV-01** | Cada planificación tiene un ID único (`plan-cc-*` o `plan-ini-*`) | normalizer, e2e, integration |
| **INV-02** | `competenciasAsociadas` contiene solo códigos válidos (C, M, CD, CS) | normalizer, word-export |
| **INV-03** | `SourceTraceability` está presente en todo modelo canónico | normalizer |
| **INV-04** | EGB/BGU e Inicial nunca comparten generador | integration (aislamiento) |
| **INV-05** | Word export produce ZIP válido con `word/document.xml` | word-export, e2e |
| **INV-06** | PDF export produce HTML con `<!DOCTYPE html>` y `@page` | pdf-export, e2e |
| **INV-07** | Persistir y recuperar preserva todos los campos del modelo | e2e, integration |
| **INV-08** | El normalizer es permisivo: campos faltantes → defaults | normalizer |

---

## Obligatorio antes de cada commit

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"

# 1. Type check (ignorar errores preexistentes en otros módulos)
pnpm check

# 2. Tests del módulo (deben ser 178/178)
pnpm test __tests__/curriculo-competencias

# 3. Si se modificó un generador de Word, verificar visualmente
# (usar skill verificar-docx-visual si está disponible)
```

---

## Qué NO hacer

```
NO mezclar los generadores de EGB/BGU e Inicial/Preparatoria.
NO saltarse el normalizer para persistir estructuras raw.
NO modificar el modelo canónico para resolver necesidades exclusivas
  de un generador sin revisar el impacto en persistencia y tests.
NO agregar <script> al HTML del PDF (se imprime en navegador).
NO modificar los códigos de competencia (C, M, CD, CS) — son inmutables.
NO asumir que ERCA es la "estrategia oficial MINEDUC" — es una opción configurable.
NO exponer errores internos al cliente en UI (usar mensajes genéricos).
NO crear endpoints tRPC genéricos para ambas familias — usar separados.
```
