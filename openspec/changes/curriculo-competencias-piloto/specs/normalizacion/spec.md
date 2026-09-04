# Spec: Capa de Normalización

## Resumen

Componente arquitectónico que separa la fuente curricular (documentos oficiales del MINEDUC) del modelo canónico interno. Establece un contrato explícito entre lo que viene de la fuente y lo que el dominio consume.

## Contrato: Fuente → Modelo Canónico

```
FUENTE OFICIAL (PDFs, DOCX, XLSX)
      │
      ▼
Extractor (lee estructura física del documento)
      │
      ▼
Normalizador (lib/curriculo-competencias-normalizer.ts)
      │
      ├── Elimina variaciones puramente documentales
      ├── Conserva texto fuente cuando es necesario
      ├── Genera IDs/códigos internos estables
      ├── Asigna campos obligatorios
      ├── Establece relaciones (competencia → destreza → indicador)
      └── Agrega metadatos de trazabilidad
      │
      ▼
MODELO CANÓNICO (data/types-curriculo-competencias.ts)
      │
      ├── IDs estables (no dependen de la fuente)
      ├── Campos obligatorios garantizados
      ├── Relaciones tipadas
      └── Trazabilidad completa
      │
      ▼
Validación (Zod schemas)
      │
      ▼
Persistencia (AsyncStorage + backup)
```

## Regla fundamental

> **El dominio nunca debe depender directamente de la estructura física de un DOCX, PDF, XLSX u otra fuente.**

## Funciones del normalizador

```typescript
// lib/curriculo-competencias-normalizer.ts

function mapearEstructuraOficial(doc: FuenteCurricular): ModeloCanónico
function mapearCompetencias(raw: any[]): CompetenciaInfo[]
function mapearAmbitos(raw: any[]): AmbitoDesarrollo[]
function mapearNEE(raw: any[]): GradoNEEConfig[]
```

## Trazabilidad de origen

Cada elemento normalizado conserva:

```typescript
interface SourceTraceability {
  source_document: string;    // "FORMATO PLANIFICACION MICROCURRICULAR EGB Y BG.docx"
  source_section?: string;    // "Sección 2: Aprendizaje Disciplinar"
  source_reference?: string;  // Referencia específica dentro de la fuente
  source_version?: string;    // Versión del documento fuente
  normalized_at: string;      // Timestamp de normalización
}
```

## Tres conceptos diferenciados

| Concepto | Definición | Ubicación |
|----------|-----------|-----------|
| **Fuente oficial** | Lo que aparece en el documento curricular | Externo |
| **Modelo canónico** | Representación normalizada interna | `data/types-curriculo-competencias.ts` |
| **Configuración institucional** | Lo que el usuario puede modificar | `data/competencias-transversales.ts`, etc. |

## Invariantes

- INV-05: La normalización no debe alterar silenciosamente el significado del contenido fuente.
- INV-07: Todo elemento normalizado debe tener trazabilidad hacia su fuente.

## Beneficio

Cuando el MINEDUC actualice el formato:
1. Se ajusta `lib/curriculo-competencias-normalizer.ts`
2. Se mantienen intactos: tipos, competencias, wizard, IA, exportación

## Archivo

`lib/curriculo-competencias-normalizer.ts`
