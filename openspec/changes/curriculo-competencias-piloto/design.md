## Context

El Currículo Priorizado por Competencias es el marco vigente del Ministerio de Educación del Ecuador para la EGB y el BGU. Este módulo piloto busca crear un sistema de planificación微curricular por competencias dentro de Planificadoc, manteniendo el sistema actual intacto e introduciendo una capa de normalización que aísla el modelo interno de los cambios en la fuente curricular.

Estado actual relevante (verificado en código):

- Aplicación Expo (React Native + web), tRPC + Express + MySQL/Drizzle, persistencia local vía AsyncStorage.
- Currículo = catálogo estático en `data/destrezas-*.ts` (`Destreza {codigo, area, subnivel, bloque, descripcion, criteriosEvaluacion[], indicadoresEvaluacion[]}`) con helpers en `data/index.ts`.
- Patrón de módulo aislado (CNC): `data/types-cnc.ts` → `lib/planificaciones-cnc-context.tsx` → `server/cnc-router.ts` → `app/conecta-nivela-crea/index.tsx` → `lib/cnc-word-generator.ts`.
- IA vía `invokeLLM`/`repairJson` (server/_core/llm.ts, OpenAI-compatible, JSON).
- Export: PDF = HTML → `expo-print`; Word = librería `docx`; ambos en cliente (`hooks/use-export-pdf.ts`).
- Competencias transversales actualmente definidas en `data/secciones-planificacion.ts` como 4 opciones (C, M, CD, CS) para selección en formularios, pero sin integración formal en el formato de exportación ni en la estructura del plan微curricular.

## Goals / Non-Goals

**Goals:**
- Módulo Currículo por Competencias autocontenido e independiente (no toca persistencia ni flujos existentes).
- Capa de normalización con contrato explícito entre fuente y modelo canónico.
- Trazabilidad de cada elemento normalizado hacia su fuente.
- Formato microcurricular EGB/BGU con estructura interna de 5 secciones.
- Formato Inicial/Preparatoria independiente con dominio propio.
- Competencias transversales como catálogo configurable con código fijo.
- Estrategias metodológicas seleccionables (ERCA como default, no como oficial).
- Exportación diferenciada por familia.
- Invariantes de dominio verificables mediante tests.
- Criterios de aceptación del piloto.

**Non-Goals:**
- Modificar el sistema actual de planificación微curricular (ERCA + DCD por áreas).
- Migrar datos existentes al nuevo módulo.
- Implementar todos los niveles educativos en el piloto (se cubre EGB, BGU, Inicial y Preparatoria).
- Crear un ERP relacional completo (el módulo es local-first como los demás).
- Implementar autenticación de estudiantes ni aplicación digital.
- Declarar ERCA como "estrategia oficial MINEDUC" sin fuente que lo establezca.

## Decisions

### D1. Aislamiento completo del módulo

Todos los archivos del módulo son nuevos. No se modifican archivos de los flujos existentes salvo:
- `server/routers.ts` (registrar nuevo router)
- `app/(tabs)/planes.tsx` (agregar entrada de sección)

Se replica la independencia de archivos que establece CNC.

### D2. Capa de Normalización — Contrato Explícito

```
FUENTE OFICIAL (PDFs, documentos, XLSX)
      │
      ▼
Extractor (lee estructura física)
      │
      ▼
Normalizador (lib/curriculo-competencias-normalizer.ts)
      │
      ├── Elimina variaciones puramente documentales
      ├── Conserva texto fuente cuando es necesario
      ├── Genera IDs/códigos internos estables
      ├── Asigna campos obligatorios
      ├── Establece relaciones (competencia → destreza → indicador)
      └. Agrega metadatos de trazabilidad
      │
      ▼
MODELO CANÓNICO (data/types-curriculo-competencias.ts)
      │
      ├── IDs estables (no dependen de la fuente)
      ├── Campos obligatorios garantizados
      ├── Relaciones tipadas
      ├── Trazabilidad: source_document, source_section,
      │   source_reference, source_version, normalized_at
      │
      ▼
Validación (Zod schemas)
      │
      ▼
Persistencia (AsyncStorage + backup)
```

**Regla fundamental:** El dominio nunca debe depender directamente de la estructura física de un DOCX, PDF, XLSX u otra fuente.

### D3. Tres conceptos diferenciados

| Concepto | Definición | Ubicación |
|----------|-----------|-----------|
| **Fuente oficial** | Lo que aparece en el documento curricular utilizado como fuente | Externo (PDFs, DOCX, XLSX) |
| **Modelo canónico** | Representación normalizada interna por Planificadoc | `data/types-curriculo-competencias.ts` |
| **Configuración institucional** | Lo que el usuario/institución puede modificar, activar, desactivar o personalizar | `data/competencias-transversales.ts`, `data/ambitos-desarrollo-inicial.ts` |

```
FUENTE OFICIAL
      │
      ▼
NORMALIZACIÓN
      │
      ▼
MODELO CANÓNICO
      │
      ▼
CONFIGURACIÓN
      │
      ▼
PLANIFICACIÓN
```

### D4. Persistencia: AsyncStorage + backup best-effort + trazabilidad

Reducer + AsyncStorage (`lib/curriculo-competencias-context.tsx`, key `@planificadoc_curriculo_competencias`), y opcionalmente una tabla `curriculoCompetenciasPlanificaciones` en Drizzle.

**Metadatos de trazabilidad** (almacenados como estructura de metadatos, no necesariamente como columnas separadas):

```typescript
interface SourceTraceability {
  source_document: string;    // "FORMATO PLANIFICACION MICROCURRICULAR EGB Y BG.docx"
  source_section?: string;    // "Sección 2: Aprendizaje Disciplinar"
  source_reference?: string;  // Referencia específica dentro de la fuente
  source_version?: string;    // Versión del documento fuente
  normalized_at: string;      // Timestamp de normalización
}
```

### D5. Reutilización del catálogo de DCD existente

El módulo reutiliza `data/destrezas-*.ts` y los helpers de `data/index.ts` (`buscarPorCodigo`, `filtrarPorAreaYSubnivel`, `AREAS_INFO`). No se crea un catálogo duplicado.

### D6. Competencias transversales — Código fijo, configuración flexible

**Regla:** El código interno identifica una competencia dentro del catálogo y no debe reutilizarse para representar otra competencia.

```typescript
interface CompetenciaInfo {
  id: string;              // identificador técnico (interno, estable)
  code: CompetenciaTransversal;  // código fijo: "C", "M", "CD", "CS"
  name: string;            // nombre editable (configuración institucional)
  description: string;     // descripción editable
  emoji: string;
  color: string;
  active: boolean;         // estado (activar/desactivar)
  source?: SourceTraceability;  // procedencia documental
}
```

**Códigos del piloto:** C, M, CD, CS.
**No se asumen nombres oficiales** hasta contrastar con fuente específica. Los nombres son editables desde configuración.

### D7. Estrategias metodológicas — Comportamiento, no solo catálogo

```typescript
interface EstrategiaMetodologica {
  id: string;
  name: string;
  description: string;
  phases: FaseEstrategia[];
  configurable: boolean;    // si el usuario puede ajustar tiempos/orden
  source?: SourceTraceability;
}

interface FaseEstrategia {
  id: string;
  name: string;
  defaultDuration: number;  // minutos
  order: number;
}
```

Una planificación tiene `strategy = "ERCA"` o `strategy = "inicio_desarrollo_cierre"`. La estrategia no modifica la estructura curricular.

**Estrategias del piloto:**

| ID | Nombre | Fases | Uso |
|----|--------|-------|-----|
| `erca` | ERCA | Experiencia → Reflexión → Conceptualización → Aplicación | EGB/BGU (default) |
| `idc` | INICIO/DESARROLLO/CIERRE | INICIO → DESARROLLO → CIERRE | Inicial/Preparatoria |

**No se declara ERCA como "estrategia oficial MINEDUC"** sin fuente que lo establezca. ERCA es la estrategia por defecto para el piloto.

### D8. Formato microcurricular EGB/BGU — Estructura interna

El formato interno del módulo consta de 5 secciones:

1. **Datos Informativos**: institución, docente, grado, fecha, asignatura, unidad didáctica, título, semanas, objetivos.
2. **Aprendizaje Disciplinar**: DCD + Indicador + Estrategia Metodológica + Recursos + Evaluación. Cada actividad etiquetada con competencia.
3. **Aprendizaje Interdisciplinar** (opcional): nombre del proyecto, objetivo, DCDs integradas, estrategias, evaluación.
4. **NEE**: grado, necesidad, adaptaciones en DCD/estrategias/recursos/evaluación.
5. **Acompañamiento Integral**: horas de tutoría, actividades con competencia.

**Separación importante:** Esta es la estructura *interna* del sistema. La estructura *oficial* del MINEDUC se mapea a través de la capa de normalización (D2). Si el formato oficial tiene más/menos secciones o campos, se ajusta el mapeador sin cambiar el modelo de datos.

### D9. NEE — Representación configurable

```typescript
type GradoNEE = 1 | 2 | 3;  // Valor inicial del piloto
```

**No se asume que 1/2/3 sea una clasificación universal/oficial.** La definición exacta de cada grado se configura en la capa de normalización. Cuando se disponga de la normativa vigente, se ajustan los valores y descripciones.

Cada grado implica adaptaciones en: DCD, Estrategias, Recursos y Evaluación.

### D10. Inicial/Preparatoria — Dominio independiente

**Restricción explícita:** Inicial/Preparatoria no debe reutilizar automáticamente el modelo de asignaturas de EGB/BGU.

```typescript
// Dominio separado en tipos
interface EGBBguPlan {
  type: "egb_bgu";
  asignaturas: string[];      // áreas tradicionales
  // ...
}

interface InicialPreparatoriaPlan {
  type: "inicial_preparatoria";
  ambitos: AmbitoDesarrollo[]; // ámbitos de desarrollo
  // ...
}
```

La diferencia se refleja en el dominio, no solamente en la interfaz.

**Ámbitos de desarrollo** (catálogo configurable en `data/ambitos-desarrollo-inicial.ts`):
- Valores iniciales del piloto (7 ámbitos).
- **No se declara la lista como oficial** hasta validar con fuente.
- Catálogo editable: agregar/quitar ámbitos sin cambiar la estructura.

### D11. Exportación — Contrato de salida diferenciado

```typescript
interface ExportStrategy {
  id: string;
  name: string;
  family: "egb_bgu" | "inicial_preparatoria";
  generate: (plan: PlanificacionCurriculoCompetencias | PlanificacionInicialCurriculo) => Promise<Blob>;
}
```

**Regla:** Cada familia utiliza su generador correspondiente. No un generador monolítico con condicionales.

| Familia | Generador Word | Generador PDF |
|---------|---------------|---------------|
| EGB/BGU | `curriculo-competencias-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |
| Inicial/Preparatoria | `curriculo-competencias-inicial-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |

No se modifica `lib/plan-word-generator.ts` ni ningún otro generador existente.

### D12. Niveles educativos cubiertos en el piloto

| Nivel | Subniveles | Formato |
|-------|-----------|---------|
| Inicial | 1 (3-4 años), 2 (4-5 años) | Experiencias de aprendizaje |
| Preparatoria | 1 (1.° EGB) | Experiencias de aprendizaje |
| EGB Elemental | 2 (2.°-4.° EGB) | Microcurricular |
| EGB Media | 3 (5.°-7.° EGB) | Microcurricular |
| EGB Superior | 4 (8.°-10.° EGB) | Microcurricular |
| BGU | 5 (1.°-3.° BGU) | Microcurricular |

### D13. Áreas por subnivel

| Subnivel | Áreas |
|----------|-------|
| Inicial | Ámbitos de desarrollo (no áreas tradicionales) |
| Preparatoria | Currículo integrado por ámbitos |
| Elemental | LL, M, CN, CS, ECA, EF, EFL |
| Media | LL, M, CN, CS, ECA, EF, EFL |
| Superior | LL, M, CN, CS, ECA, EF, EFL |
| BGU | LL, M, CN.B, CN.Q, CN.F, CS.H, CS.F, CS.EC, ECA, EF, EFL, EG |

### D14. Generación IA con prompts adaptados

Los prompts generan:
- Estructura didáctica completa (según estrategia seleccionada)
- Indicadores de evaluación desagregados
- Etiquetado de cada actividad con la competencia que potencia
- Recursos didácticos específicos
- Técnica + Instrumento de evaluación

Los prompts se basan en los prompts actuales de `server/topics-router.ts` pero adaptados al nuevo formato y con la estrategia metodológica como parámetro.

## Invariantes de Dominio

| ID | Invariante | Verificable mediante |
|----|-----------|---------------------|
| INV-01 | Un elemento curricular no puede pertenecer simultáneamente a dos estructuras incompatibles. | Test de integridad |
| INV-02 | Un código de competencia no puede identificar dos competencias activas. | Test de unicidad |
| INV-03 | Una estrategia metodológica no puede modificar la estructura curricular. | Test de separación |
| INV-04 | Inicial/Preparatoria no puede depender de una asignatura EGB/BGU. | Test de dominio |
| INV-05 | La normalización no debe alterar silenciosamente el significado del contenido fuente. | Test de trazabilidad |
| INV-06 | La exportación no debe modificar los datos del dominio. | Test de pureza |
| INV-07 | Todo elemento normalizado debe tener trazabilidad hacia su fuente. | Test de metadatos |
| INV-08 | El sistema actual no puede ser afectado por el piloto. | Test de regresión |

## Risks / Trade-offs

- [Límite de línea base TS: `pnpm check` ya reporta 49 errores preexistentes] → El módulo debe añadir 0 errores; código nuevo con tipos explícitos; verificar con `pnpm check` antes de terminar.
- [Las competencias transversales pueden no ser las oficiales] → Catálogo configurable; nombres editables sin cambiar tipos ni lógica.
- [El formato oficial puede diferir del propuesto] → Capa de normalización aísla el modelo canónico; solo se ajusta el mapeador.
- [La estrategia ERCA puede no ser la requerida] → Estrategia seleccionable; el sistema soporta múltiples estrategias.
- [Los ámbitos de Inicial/Preparatoria pueden estar incompletos] → Catálogo configurable; se agregan ámbitos sin cambiar la estructura.
- [La clasificación de NEE puede no ser la oficial] → Representación configurable; se ajustan valores desde la capa de normalización.
- [Tamaño de AsyncStorage al crecer planificaciones] → Patrón ya establecido por otros módulos; backup best-effort para liberar presión.

## Migration Plan

1. `drizzle/schema.ts`: añadir tabla `curriculoCompetenciasPlanificaciones` + migración (`pnpm db:push`). La app funciona sin la tabla (best-effort).
2. Desarrollo por capas: tipos → normalizador → competencias → estrategias → contexto local → router IA → UI → exportación.
3. Rollback: basta retirar la entrada en `planes.tsx` y el router; los datos locales de otros módulos no se ven afectados (keys AsyncStorage independientes).
