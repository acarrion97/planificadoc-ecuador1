# Spec: Estrategias Metodológicas

## Resumen

Catálogo de estrategias metodológicas seleccionables. La estrategia define la estructura de las actividades de enseñanza-aprendizaje sin modificar la estructura curricular.

## Modelo de datos

```typescript
interface EstrategiaMetodologica {
  id: string;
  name: string;
  description: string;
  phases: FaseEstrategia[];
  configurable: boolean;    // si el usuario puede ajustar tiempos/orden
  family: "egb_bgu" | "inicial_preparatoria" | "general";
  source?: SourceTraceability;
}

interface FaseEstrategia {
  id: string;
  name: string;
  defaultDuration: number;  // minutos
  order: number;
}
```

## Estrategias del piloto

| ID | Nombre | Fases | Familia | Default |
|----|--------|-------|---------|---------|
| `erca` | ERCA | Experiencia (10) → Reflexión (10) → Conceptualización (15) → Aplicación (10) | egb_bgu | Sí |
| `idc` | INICIO/DESARROLLO/CIERRE | INICIO → DESARROLLO → CIERRE | inicial_preparatoria | Sí |

## Regla

> Una estrategia metodológica no puede modificar la estructura curricular.

La estrategia define **cómo** se organiza la actividad didáctica, no **qué** se enseña. La estructura curricular (DCD, indicadores, competencias) se mantiene independiente.

## Uso en planificación

```typescript
interface PlanificacionCurriculoCompetencias {
  // ...
  strategy: string;  // ID de la estrategia seleccionada
  // ...
}
```

## Configuración

Las estrategias se definen en `data/estrategias-metodologicas.ts` como catálogo configurable. Se pueden agregar nuevas estrategias sin cambiar la estructura del sistema.

## Invariantes

- INV-03: Una estrategia metodológica no puede modificar la estructura curricular.

## Archivo

`data/estrategias-metodologicas.ts`
