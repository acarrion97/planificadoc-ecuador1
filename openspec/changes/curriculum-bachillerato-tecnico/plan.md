# Plan: Extracción y Seed del Currículo BT desde PDFs Oficiales

## Contexto

El seed actual (`data/bt-seed.ts`) solo tiene áreas, familias y figuras (34 registros). Falta el contenido curricular real: módulos, RA, CE, contenidos C/P/A, y distribución por año. Los documentos oficiales del MinEduc están descargados en `C:\Users\Lukas\Documents\figuras profecionales\` (103 archivos). Los archivos `.txt` ya extraídos están en `docs/bt-modulos-formativos/txt/`. Este plan extraerá el currículo completo de las31 figuras que tienen documentos de módulos formativos.

## Objetivo

Crear un sistema de extracción que:
1. Lea los archivos `.txt` ya existentes
2. Parsee la estructura del currículo (módulos, RA, CE, contenidos C/P/A)
3. Valide la integridad de los datos extraídos
4. Genere el seed curricular completo en un archivo TypeScript
5. Actualice el schema con campos faltantes

## Resultado Esperado

- Script `scripts/extract-bt-curriculum.ts` que parsea .txt → JSON
- Archivo `data/bt-curriculum-seed.ts` con todos los módulos, RA, CE, contenidos
- Migración `0012_bt_curriculum_extensions.sql` con nuevos campos
- Seed function actualizada en `api/_lib/seed-bt.ts`

---

## Fase 1: Schema Extension (Migración 0012)

### Archivos a modificar
- `drizzle/schema.ts` → agregar campos a `btModulosFormativos`
- Crear `drizzle/0012_bt_curriculum_extensions.sql`
- `api/_lib/migrate.ts` → importar nueva migración

### Campos a agregar a `bt_modulos_formativos`

```sql
ALTER TABLE bt_modulos_formativos
  ADD COLUMN objetivoModulo TEXT,
  ADD COLUMN nivel VARCHAR(64),
  ADD COLUMN duracionTotalPeriodos INT,
  ADD COLUMN perfilDocente TEXT,
  ADD COLUMN orientacionesMetodologicas TEXT;
```

### Drizzle schema (línea ~520)

```ts
// En btModulosFormativos:
objetivoModulo: text("objetivoModulo"),
nivel: varchar("nivel", { length: 64 }),
duracionTotalPeriodos: int("duracionTotalPeriodos"),
perfilDocente: text("perfilDocente"),
orientacionesMetodologicas: text("orientacionesMetodologicas"),
```

---

## Fase 2: Script de Extracción

### Archivo nuevo: `scripts/extract-bt-curriculum.ts`

**Entrada:** Archivos `.txt` en `docs/bt-modulos-formativos/txt/`
**Salida:** `data/bt-curriculum-seed.ts` (array de objetos tipados)

### Estructura del parser

```
1. LOAD: Leer todos los .txt de la carpeta
2. SPLIT: Dividir por encabezados de módulo (MÓDULO Genérico/Especialización Nro. N)
3. EXTRACT: Para cada bloque de módulo:
   a. Header: nombre, nivel, duración
   b. UC: Unidad de competencia
   c. Objetivo del módulo
   d. RA: Resultados de aprendizaje (RA1, RA2, ...)
   e. CE: Criterios de evaluación (CE1.1, CE1.2, ...)
   f. Contenidos: Separar en C/P/A usando heurística de verbos
4. PLAN: Extraer tabla de distribución por año (malla curricular)
5. VALIDAR: Verificar integridad (RA/CE count, duración = sum(año) * 40)
6. OUTPUT: Generar .ts con tipos
```

### Patrones regex principales

| Elemento | Patrón |
|---|---|
| Módulo header | `M[ÓO]DULO\s+(?:Gen[ée]rico\|de Especializaci[oó]n)\s+Nro\.?\s*(\d+)` |
| Nombre | `Nombre del m[oó]dulo[:\s]+(.+?)$` |
| Nivel | `Nivel[:\s]+(.+?)$` |
| Duración | `Duraci[oó]n[:\s]+(\d+)\s*periodos pedag[oó]gicos` |
| UC | `UC\s*(\d+)\s*:\s*([\s\S]+?)(?=Objetivo)` |
| Objetivo | `Objetivo del m[oó]dulo[:\s]*([\s\S]+?)(?=Resultados)` |
| RA | `RA[\.\s]?(\d+)[:\.\s]+([\s\S]+?)(?=RA[\.\s]?\d\|CE\d\|Contenidos)` |
| CE | `CE(\d+)\.(\d+)[:\.\s]+([\s\S]+?)(?=CE\d\|RA\d\|Contenidos)` |
| Contenidos header | `Contenidos\s*\n\s*Conceptuales\s+Procedimentales\s+Actitudinales` |

### Heurística para Contenidos C/P/A

```ts
function classifyContenido(item: string): "conceptual" | "procedimental" | "actitudinal" {
  const procVerbs = /^(Analizar|Aplicar|Elaborar|Identificar|Clasificar|Comparar|Determinar|Relacionar|Interpretar|Evalu|Seleccionar|Organizar|Diseñar|Formular|Registrar|Observar|Verificar|Implementar|Ejecutar|Proponer|Construir|Preparar|Configurar|Emplear|Utilizar|Operar|Medir|Calcular|Demostrar|Presentar|Exponer|Argumentar|Comprobar|Contrastar|Reportar|Sistematizar|Categorizar|Diagnosticar|Supervisar|Coordinar|Planificar)/i;
  const actVerbs = /^(Valorar|Respetar|Mostrar|Asumir|Comprometerse|Fomentar|Demostrar\s+(?:interés|responsabilidad|empatía|paciencia|organización|disposición|orgullo|sentido)|Mantener|Manifestar|Adoptar|Promover|Reconocer|Cuestionar|Practicar|Aprender|Participar|Colaborar|Sugerir|Crear|Cuidar|Actuar|Habilitar|Sensibilizar)/i;

  if (procVerbs.test(item)) return "procedimental";
  if (actVerbs.test(item)) return "actitudinal";
  return "conceptual";
}
```

### Tipos de salida

```ts
interface ModuloCurricular {
  codigo: string;           // ej: "API.1.1"
  nombre: string;
  tipo: "generico" | "especializacion" | "practico_experimental";
  nivel: string;            // ej: "1ro y 2do"
  duracionTotalPeriodos: number;
  unidadCompetencia: string;
  objetivoModulo: string;
  perfilDocente: string;
  orientacionesMetodologicas: string;
  cargaHoraria: { anio1?: number; anio2?: number; anio3?: number; };
  resultadosAprendizaje: ResultadoAprendizaje[];
  contenidos: Contenido[];
}

interface ResultadoAprendizaje {
  codigo: string;
  descripcion: string;
  criteriosEvaluacion: CriterioEvaluacion[];
}

interface CriterioEvaluacion {
  codigo: string;
  descripcion: string;
}

interface Contenido {
  tipo: "conceptual" | "procedimental" | "actitudinal";
  descripcion: string;
  orden: number;
}
```

---

## Fase 3: Generación del Seed

### Archivo nuevo: `data/bt-curriculum-seed.ts`

Estructura del archivo:
```ts
export const btCurriculumSeed: BtCurriculumData = {
  modulos: [
    {
      figuraCodigo: "API",
      modulos: [
        {
          codigo: "API.1.1",
          nombre: "Atención Integral Comunitaria",
          tipo: "generico",
          nivel: "1ro y 2do",
          duracionTotalPeriodos: 160,
          unidadCompetencia: "...",
          objetivoModulo: "...",
          cargaHoraria: { anio1: 2, anio2: 2 },
          resultadosAprendizaje: [...],
          contenidos: [...]
        },
        // ... más módulos
      ]
    },
    // ... más figuras
  ]
};
```

### Cobertura esperada

| Métrica | Cantidad estimada |
|---|---|
| Figuras con módulos | 31 |
| Total módulos | ~290 |
| Total RA | ~900 |
| Total CE | ~3000 |
| Total contenidos | ~2500 |

---

## Fase 4: Seed Function Update

### Archivo a modificar: `api/_lib/seed-bt.ts`

Agregar función `seedBtCurriculum()`:
1. Importar `btCurriculumSeed` desde `data/bt-curriculum-seed.ts`
2. Para cada figura, insertar módulos en `bt_modulos_formativos`
3. Para cada módulo, insertar RA en `bt_resultados_aprendizaje`
4. Para cada RA, insertar CE en `bt_criterios_evaluacion`
5. Para cada módulo, insertar contenidos en `bt_contenidos`
6. Para cada módulo, insertar distribución en `bt_modulo_por_anio`
7. Todo idempotente (upsert por código)

### `api/_lib/migrate.ts` update

```ts
import { seedBtCurriculum } from './seed-bt';
// En runMigrations():
await seedBtCurriculum(); // Después de seedBtCatalogo
```

---

## Fase 5: Validación

### Checks de integridad

1. **RA/CE count**: Cada módulo debe tener al menos1 RA y2 CE por RA
2. **Duración**: `duracionTotalPeriodos` = `sum(cargaHoraria[year]) * 40`
3. **Contenidos**: Al menos3 contenidos por módulo (1 por tipo)
4. **Código único**: No hay módulos duplicados por figura
5. **Año válido**: cargaHoraria solo en años que el módulo cursa (nivel)

### Tests

Agregar casos en `__tests__/bt-curriculum.test.ts`:
- Test de extracción de módulo individual
- Test de clasificación C/P/A
- Test de integridad curricular
- Test de seed completo

---

## Fase 6: Commits

1. `feat: add curriculum extension fields to bt_modulos_formativos`
2. `feat: add BT curriculum PDF extractor script`
3. `feat: add BT curriculum seed data (31 figures)`
4. `feat: update seed function with curriculum data`

---

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|---|---|
| Archivos .txt incompletos o corruptos | Validar que cada .txt tenga al menos1 módulo con RA/CE |
| Contenidos C/P/A mal clasificados | Marcar con `confianzaClasificacion: number` y permitir revisión manual |
| Módulo Práctico Experimental tiene estructura diferente | Tratar como caso especial, extraer solo RA/CE sin Contenidos |
| Algunas figuras no tienen doc de módulos | Skip con warning, no fallar el proceso completo |
| Encoding de caracteres especiales (tildes, ñ) | Usar UTF-8 en lectura de .txt |

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---|---|
| `drizzle/schema.ts` | Modificar: agregar5 campos a btModulosFormativos |
| `drizzle/0012_bt_curriculum_extensions.sql` | Crear |
| `api/_lib/migrate.ts` | Modificar: importar migración0012 |
| `scripts/extract-bt-curriculum.ts` | Crear |
| `data/bt-curriculum-seed.ts` | Crear (generado por script) |
| `api/_lib/seed-bt.ts` | Modificar: agregar seedBtCurriculum() |
| `__tests__/bt-curriculum.test.ts` | Modificar: agregar tests de extracción |
