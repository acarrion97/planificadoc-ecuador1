# Spec: Persistencia

## Resumen

Almacenamiento local-first de planificaciones del módulo Currículo por Competencias, con backup best-effort en la nube y trazabilidad de origen.

## Estrategia

1. **Fuente de verdad**: AsyncStorage en el dispositivo
2. **Backup**: tabla en MySQL vía Drizzle (best-effort, no crítico)

## Keys de AsyncStorage

- `@planificadoc_curriculo_competencias` → planificaciones微curriculares + unidades + planes iniciales

## Tabla en BD

```sql
curriculo_competencias_planificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sessionId VARCHAR(64) NOT NULL,
  form JSON,           -- datos del formulario
  aiResult JSON,       -- resultado de IA
  status VARCHAR(32),  -- draft/generated/paid
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
)
```

## Metadatos de trazabilidad

Cada planificación persistida conserva trazabilidad de origen:

```typescript
interface SourceTraceability {
  source_document: string;
  source_section?: string;
  source_reference?: string;
  source_version?: string;
  normalized_at: string;
}
```

##Reducer Actions

- `SET_ALL` → cargar todas las planificaciones
- `ADD` → agregar nueva planificación
- `UPDATE` → actualizar planificación existente
- `DELETE` → eliminar planificación

## Tipos de datos persistidos

1. **PlanificacionCurriculoCompetencias** → planificación微curricular EGB/BGU
2. **UnidadCurriculoCompetencias** → configuración mesocurricular
3. **PlanificacionInicialCurriculo** → planificación Inicial/Preparatoria

## Invariantes

- INV-06: La exportación no debe modificar los datos del dominio.
- INV-07: Todo elemento normalizado debe tener trazabilidad hacia su fuente.

## Archivos

- `lib/curriculo-competencias-context.tsx` (context + reducer)
- `drizzle/schema.ts` (tabla nueva)
- `drizzle/migrations/` (migración)
