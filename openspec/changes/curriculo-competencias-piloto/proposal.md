## Why

El Ministerio de Educación del Ecuador ha establecido el **Currículo Priorizado por Competencias** como marco vigente para la Educación General Básica y el Bachillerato General Unificado. Este modelo reestructura la planificación微curricular alrededor de competencias transversales y formaliza la integración de aprendizaje disciplinar, interdisciplinar, adaptaciones NEE y acompañamiento integral.

Planificadoc actualmente ofrece planificación微curricular basada en el ciclo ERCA + DCD, pero no dispone de:
- Un formato que reproduzca la estructura del MINEDUC por competencias
- Selector de competencias transversales asociadas a cada DCD
- Sección de aprendizaje interdisciplinar integrada
- Sección de horas de acompañamiento integral
- Un módulo para Inicial/Preparatoria con experiencias de aprendizaje por ámbitos

Este cambio crea un **módulo piloto** completamente nuevo (`curriculo-competencias`) que coexistirá con el sistema actual sin modificarlo, permitiendo validar el enfoque antes de una eventual migración.

## Alcance / No Alcance

| Dentro del piloto | Fuera del piloto |
|-------------------|------------------|
| Nuevo módulo de currículo por competencias | Modificar módulos actuales |
| Catálogo configurable de competencias | Reemplazar el currículo existente |
| Normalización de fuentes curriculares | Convertir automáticamente cualquier currículo |
| Formato EGB/BGU (5 secciones internas) | Alterar el formato PCA existente |
| Formato Inicial/Preparatoria (independiente) | Forzar Inicial dentro de EGB |
| Estrategias metodológicas seleccionables | Declarar ERCA como estructura oficial MINEDUC |
| Exportación diferenciada por familia | Modificar generadores existentes |
| Trazabilidad de elementos hacia su fuente | Asumir nombres oficiales sin validación |
| Invariantes de dominio verificables | Permitir acoplamiento con formatos físicos |

## What Changes

```
PLANIFICADOC
     │
     ├───────────────────┴───────────────────┐
     │                                       │
SISTEMA ACTUAL                        PLAN PILOTO
(intacto)                                  │
                                    Normalización
                                           │
                                    Modelo canónico
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                   Competencias      Microcurricular     Inicial/
                   configurables       EGB/BGU          Preparatoria
                        │                  │                  │
                        └──────────────────┼──────────────────┘
                                           │
                                    Planificación
                                           │
                                     Exportación
                                    ┌──────┴──────┐
                                    │             │
                                 EGB/BGU       Inicial
```

- Nuevo módulo **Currículo por Competencias** accesible como ruta independiente (`/curriculo-competencias/`), con persistencia local (AsyncStorage) y exportación Word/PDF, siguiendo el patrón de módulos aislados (CNC, Evaluación Diagnóstica).
- **Capa de Normalización**: separa la fuente curricular del modelo canónico. Si cambia el formato oficial, no se rehace el modelo de competencias ni el wizard.
- **Trazabilidad**: cada elemento normalizado conserva metadatos de origen (`source_document`, `source_section`, `source_reference`, `source_version`, `normalized_at`).
- **Competencias Transversales**: catálogo configurable con código fijo (identificador técnico estable), nombre editable, estado activo/inactivo y procedencia documentada.
- **Configuración Mesocurricular**: formulario para definir unidades de planificación.
- **Planificación Microcurricular EGB/BGU**: estructura interna de 5 secciones. La estructura oficial del MINEDUC se mapea a través de la capa de normalización.
- **Planificación Inicial/Preparatoria**: formato independiente con dominio propio (`InicialPreparatoriaPlan`), no reutiliza el modelo de asignaturas de EGB/BGU.
- **Estrategias metodológicas seleccionables**: ERCA, INICIO/DESARROLLO/CIERRE u otras. La estrategia no modifica la estructura curricular.
- **Exportación diferenciada**: dos estrategias de exportación por familia (`ExportStrategy`), no un generador monolítico con condicionales.
- **Invariantes de dominio**: reglas verificables mediante tests que blindan la arquitectura.

## Capabilities

### New Capabilities

- `curriculo-competencias`: Módulo piloto de planificación微curricular por competencias, con capa de normalización, trazabilidad, configuración mesocurricular, formatos para EGB/BGU e Inicial/Preparatoria, competencias transversales configurables, estrategias metodológicas seleccionables, aprendizaje interdisciplinar, NEE, acompañamiento integral, generación IA y exportación Word/PDF.

### Modified Capabilities

- Ninguna: no cambian requisitos de comportamiento existentes. El sistema actual permanece intacto.

## Impact

- **Tipos nuevos**: `data/types-curriculo-competencias.ts` + `data/competencias-transversales.ts` + `data/estrategias-metodologicas.ts` + `data/ambitos-desarrollo-inicial.ts`.
- **Capa de normalización**: `lib/curriculo-competencias-normalizer.ts` (mapeo fuente → modelo canónico con trazabilidad).
- **Persistencia local**: `lib/curriculo-competencias-context.tsx` (reducer + AsyncStorage, key `@planificadoc_curriculo_competencias`).
- **Backend tRPC**: `server/curriculo-competencias-router.ts`, registrado en `server/routers.ts`. Backup best-effort en nueva tabla `curriculoCompetenciasPlanificaciones` + migración Drizzle.
- **Frontend**: `app/curriculo-competencias/` (rutas independientes).
- **Componentes UI**: `components/curriculo-competencias/` (~9 componentes).
- **Exportación**: `lib/curriculo-competencias-word-generator.ts` (EGB/BGU) + `lib/curriculo-competencias-inicial-word-generator.ts` (Inicial) + `lib/curriculo-competencias-pdf-generator.ts`.
- **Tests**: `__tests__/curriculo-competencias-*.test.ts` (invariantes, normalización, dominio).
- **Compatibilidad**: el módulo es independiente de los flujos existentes; no modifica su persistencia ni sus rutas.

## Criterios de Aceptación del Piloto

| ID | Criterio |
|----|----------|
| AC-01 | El sistema actual (planificación, PCA, CNC, BT, evaluación diagnóstica) continúa funcionando sin modificaciones. |
| AC-02 | El piloto puede habilitarse/deshabilitarse independientemente (ruta separada, contexto separado). |
| AC-03 | Una fuente curricular puede convertirse al modelo canónico a través de la capa de normalización. |
| AC-04 | Las competencias funcionan como catálogo configurable (códigos fijos, nombres editables, activar/desactivar). |
| AC-05 | ERCA funciona como estrategia seleccionable; otra estrategia puede coexistir sin modificar la estructura curricular. |
| AC-06 | Inicial/Preparatoria puede planificarse mediante su estructura propia (ámbitos, no asignaturas). |
| AC-07 | EGB/BGU puede planificarse mediante su estructura correspondiente (5 secciones). |
| AC-08 | Cada familia (EGB/BGU e Inicial/Preparatoria) utiliza su generador de exportación correspondiente. |
| AC-09 | Los elementos normalizados pueden rastrearse hasta su fuente (trazabilidad). |
| AC-10 | El sistema existente mantiene sus pruebas y comportamiento actual (`pnpm test` + `pnpm check`). |
