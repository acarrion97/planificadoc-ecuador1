# Spec: Competencias Transversales

## Resumen

Catálogo configurable de competencias transversales con código fijo, configuración flexible y trazabilidad de origen.

## Modelo de datos

```typescript
interface CompetenciaInfo {
  id: string;                    // identificador técnico (interno, estable)
  code: CompetenciaTransversal;  // código fijo: "C", "M", "CD", "CS"
  name: string;                  // nombre editable (configuración institucional)
  description: string;           // descripción editable
  emoji: string;
  color: string;
  active: boolean;               // estado (activar/desactivar)
  source?: SourceTraceability;   // procedencia documental
}

type CompetenciaTransversal = "C" | "M" | "CD" | "CS";
```

## Regla de código fijo

> El código interno identifica una competencia dentro del catálogo y no debe reutilizarse para representar otra competencia.

Los códigos C, M, CD, CS son **inmutables**. Los nombres, descripciones, colores y emojis son **editables** desde configuración institucional.

## Códigos del piloto

| Código | Nombre (configurable) | Emoji | Color | Activo |
|--------|----------------------|-------|-------|--------|
| C | [Por definir oficialmente] | 💬 | #3498DB | true |
| M | [Por definir oficialmente] | 🔢 | #E74C3C | true |
| CD | [Por definir oficialmente] | 💻 | #9B59B6 | true |
| CS | [Por definir oficialmente] | 💚 | #27AE60 | true |

**No se asumen nombres oficiales** hasta contrastar con fuente específica del MINEDUC.

## Uso en el sistema

- Cada actividad didáctica se etiqueta con la competencia que potencia.
- Cada DCD puede asociarse a una o más competencias.
- Los badges de competencias aparecen en: formularios, exportaciones Word/PDF.
- Solo competencias `active: true` se muestran en selects.

## Invariantes

- INV-02: Un código de competencia no puede identificar dos competencias activas.
- INV-07: Todo elemento normalizado debe tener trazabilidad hacia su fuente.

## Archivo

`data/competencias-transversales.ts`
