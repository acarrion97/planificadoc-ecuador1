# Spec: Microcurricular EGB/BGU

## Resumen

Planificación微curricular de clase para EGB y BGU. Estructura interna de 5 secciones; la estructura oficial del MINEDUC se mapea a través de la capa de normalización.

## Estructura interna (5 secciones)

### 1. Datos Informativos
- Institución, Docente, Grado/Curso, Fecha, Asignatura/s
- Unidad Didáctica, Título de la Unidad, N° de Semanas
- Objetivos de Aprendizaje

### 2. Aprendizaje Disciplinar
- Objetivos de Aprendizaje
- Matriz: DCD + Badge Competencia | Indicador + Badge | Estrategia + DUA | Recursos | Evaluación
- Estrategia metodológica seleccionable (ERCA por defecto)

### 3. Aprendizaje Interdisciplinar (opcional)
- Nombre del Proyecto, Objetivo, DCDs Integradas, Estrategias, Evaluación

### 4. NEE
- Grado de NEE (configurable), Necesidad, Adaptaciones

### 5. Acompañamiento Integral
- Horas de tutoría, Actividades con competencia

### Firmas
- Elaborado por / Revisado por / Aprobado por

## Dominio

```typescript
interface EGBBguPlan {
  type: "egb_bgu";
  asignaturas: string[];
  // ...
}
```

Initial/Preparatoria NO reutiliza este modelo.

## Invariantes

- INV-01: Un elemento curricular no puede pertenecer simultáneamente a dos estructuras incompatibles.
- INV-04: Inicial/Preparatoria no puede depender de una asignatura EGB/BGU.

## Archivos

- `data/types-curriculo-competencias.ts`
- `app/curriculo-competencias/microcurricular/[id].tsx`
- `lib/curriculo-competencias-word-generator.ts`
- `lib/curriculo-competencias-pdf-generator.ts`
- `lib/curriculo-competencias-normalizer.ts`
