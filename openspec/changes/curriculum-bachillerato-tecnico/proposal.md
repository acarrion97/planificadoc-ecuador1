## Why

El sistema actual de planificación trata BT como si fuera un área normal del CNC (área + subnivel), lo que produce resultados absurdos como `BT → PREP`. El Bachillerato Técnico tiene una estructura curricular completamente diferente: Familia Profesional → Figura Profesional → Módulos Formativos → Resultados de Aprendizaje → Criterios de Evaluación, con contenidos conceptuales/procedimentales/actitudinales que se distribuyen entre 1.º, 2.º y 3.º BGU y sus trimestres.

El Acuerdo Ministerial 00065-A reorganiza las 10 familias profesionales y establece una carga horaria de 21 horas técnicas / 19 horas tronco común desde primero de bachillerato. Necesitamos un modelo propio que respete esta estructura sin intentar encajarla en el resolvedor de subniveles.

## What Changes

- **Nuevo módulo de currículo BT**: Tipos, schema Drizzle y datos para: Área Técnica → Familia Profesional → Figura Profesional → Módulo Formativo → Contenidos (atómicos por tipo) → Resultados de Aprendizaje → Criterios de Evaluación
- **Separación currículo vs planificación**: El catálogo curricular oficial se mantiene intacto; la distribución por año/trimestre es una capa posterior
- **Contenidos atómicos**: Cada contenido es un registro individual con tipo (conceptual/procedimental/actitudinal) y orden, no un bloque de texto único
- **Distribución por año**: Tabla `ModuloPorAnio` que asigna módulos a 1.º/2.º/3.º BGU con carga horaria, sin asumir relación 1:1
- **Schema Drizzle**: Nuevas tablas en `drizzle/schema.ts` + migración SQL
- **Tipos TypeScript**: Derivados del schema Drizzle para mantener consistencia

## Capabilities

### New Capabilities
- `curriculum-bt/estructura`: Modelo de datos para el catálogo curricular BT (áreas, familias, figuras, módulos, contenidos, RA, CE) y su distribución por año BGU
- `curriculum-bt/planificacion`: Capa de planificación anual/trimestral que divide contenidos y RA del catálogo oficial entre trimestres

### Modified Capabilities
- `catalogo-bachillerato-tecnico`: El spec existente necesita actualizarse para referenciar el nuevo modelo de módulos formativos y su relación con figuras profesionales

## Impact

- **Archivos nuevos**: `server/curriculum-bt/` (tipos, handlers), tablas en `drizzle/schema.ts`, migración SQL
- **Archivos modificados**: `server/importar-formato/huellas.ts` (agregar huella BT si aplica), `server/importar-formato/handlers/bt.ts` (nuevo handler)
- **Dependencias**: Ninguna nueva
- **Base de datos**: 7-8 tablas nuevas (áreas, familias, figuras, módulos, contenidos, RA, CE, módulo_por_anio)
- **Datos semilla**: 10 familias y ~34 figuras del Acuerdo 00065-A (a cargar desde documentos oficiales)
