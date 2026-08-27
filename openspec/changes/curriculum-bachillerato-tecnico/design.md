## Context

El sistema actual tiene un resolvedor de áreas/subniveles que funciona para PCA/PCT pero no para BT. El Bachillerato Técnico tiene una estructura jerárquica diferente (área → familia → figura → módulo → RA → CE) y una distribución por año (1.º/2.º/3.º BGU) que no encaja en el modelo actual.

El catálogo curricular BT ya fue definido en el spec `catalogo-bachillerato-tecnico` (áreas, familias, figuras). Este diseño agrega la capa de módulos formativos, contenidos, RA, CE y su distribución por año.

## Goals / Non-Goals

**Goals:**
- Modelo de datos relacional para el catálogo curricular BT completo
- Separación clara entre catálogo oficial y planificación docente
- Contenidos atómicos (conceptual/procedimental/actitudinal) que pueden distribuirse entre años y trimestres
- Distribución flexible de módulos por año BGU (un módulo puede estar en múltiples años)
- Datos semilla de las 10 familias y figuras del Acuerdo 00065-A

**Non-Goals:**
- Implementar la UI de planificación BT (fase posterior)
- Generar documentos Word/PDF de planificación BT (fase posterior)
- Importar formatos oficiales BT (fase posterior)
- Migrar datos existentes de PCA/PCT al nuevo modelo

## Decisions

### Decision 1: Contenidos como registros individuales (no bloques de texto)

**Elección**: Tabla `ContenidoModulo` con `tipo`, `descripcion`, `orden`.

**Alternativa considerada**: Campos `conceptual`, `procedimental`, `actitudinal` como text en la tabla `ModuloFormativo`.

**Razón**: Los contenidos deben poder distribuirse selectivamente entre trimestres. Con bloques de texto, no se puede seleccionar un contenido conceptual sin traer todo el bloque. Con registros atómicos, se puede asignar "contenido conceptual #3 del módulo X" a T2 sin afectar los demás.

### Decision 2: Distribución por año en tabla separada

**Elección**: Tabla `ModuloPorAnio` con `moduloId`, `anioBGU`, `cargaHoraria`.

**Alternativa considerada**: Campo `anios: (1|2|3)[]` y `cargaHorariaPorAnio: Record<number, number>` en `ModuloFormativo`.

**Razón**: En un modelo relacional, una relación many-to-many con atributos (carga horaria) merece su propia tabla. Esto permite consultas eficientes ("¿qué módulos hay en 1.º BGU?") sin deserializar JSON, y valida integridad referencial.

### Decision 3: Planificación como capa separada

**Elección**: Tablas `PlanificacionBT`, `DistribucionTrimestre` que referencian el catálogo sin modificarlo.

**Alternativa considerada**: Guardar distribución directamente en los módulos del catálogo.

**Razón**: El catálogo curricular es oficial y no debe cambiar según la planificación de cada docente. Un mismo módulo puede distribuirse de diferente manera en distintas instituciones o años lectivos. Separar permite múltiples planificaciones sobre el mismo catálogo.

### Decision 4: Datos semilla desde documentos oficiales

**Elección**: Script de seed que carga familias y figuras desde los PDFs del Acuerdo 00065-A.

**Alternativa considerada**: Hardcodear los datos en el schema de Drizzle.

**Razón**: Los datos oficiales pueden cambiar (nuevos acuerdos ministeriales). Un script de seed es más mantenible que datos embebidos en el código. Permite actualizar sin modificar el schema.

### Decision 5: Tipos TypeScript derivados del schema Drizzle

**Elección**: Usar `typeof tabla.$inferSelect` e `typeof tabla.$inferInsert` para generar tipos.

**Alternativa considerada**: Definir tipos TypeScript manualmente paralelos al schema.

**Razón**: Evita desalineación entre base de datos y dominio. Cuando se agrega una columna al schema, el tipo se actualiza automáticamente.

## Risks / Trade-offs

**[Riesgo] Datos semilla incompletos** → Los documentos oficiales del Ministerio son PDFs largos y no siempre consistentes. Mitigación: cargar solo familias y figuras confirmadas; los módulos se cargarán figura por figura en iteraciones posteriores.

**[Riesgo] Complejidad del modelo** → 8+ tablas nuevas pueden complicar las consultas. Mitigación: crear vistas o funciones de ayuda en Drizzle para las consultas más comunes.

**[Riesgo] Rendimiento de consultas jerárquicas** → Las consultas que recorren área → familia → figura → módulo pueden ser lentas con muchos datos. Mitigación: el catálogo BT tiene ~34 figuras y ~100 módulos, un volumen manejable sin optimizaciones especiales.

**[Trade-off] Atomicidad vs simplicidad** → Los contenidos atómicos son más flexibles pero requieren más registros y consultas. Aceptado porque la distribución selectiva entre trimestres es un requisito core.

## Migration Plan

1. Crear tablas nuevas (áreas, familias, figuras, módulos, contenidos, RA, CE, módulo_por_anio)
2. Ejecutar script de seed con datos del Acuerdo 00065-A
3. Verificar integridad referencial
4. No hay tablas existentes que migrar (modelo nuevo, sin dependencias)

## Open Questions

- ¿Los módulos formativos deben tener un código oficial (ej: "AFDR.1.1") o solo nombre?
- ¿La carga horaria por módulo en cada año es fija o configurable por institución?
- ¿Necesitamos un campo "estado" en las figuras (activa/deprecada/histórica) además del booleano actual?
