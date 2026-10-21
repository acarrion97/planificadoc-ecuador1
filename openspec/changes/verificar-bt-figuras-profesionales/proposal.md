## Why

El catálogo de Bachillerato Técnico (`data/bachillerato-tecnico.ts`) está al día en denominaciones y familias (00051-A), pero no en contenido. De las 34 figuras, solo Climatización tiene sus módulos oficiales con Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE). Actividad Física tiene 3 módulos completos y 5 pendientes. Las otras 32 figuras tienen de 3 a 6 módulos genéricos (p. ej. "DS.1.1 …") escritos sin respaldo documental. Ya están en `C:\Users\Lukas\OneDrive\Documentos\planificadoc\figuras profecionales` los PDF oficiales del MINEDUC ("Módulos formativos de la figura profesional") de 31 figuras. Con ellos se puede verificar y corregir el catálogo, para que las planificaciones BT y de Conecta Nivela Crea usen el currículo real y no contenido inventado.

## What Changes

- **Verificar cada figura contra su PDF oficial**: objetivo general, lista de módulos (genéricos, de especialización y práctico experimental), nivel/años, duración en periodos, objetivo del módulo, UC asociada y sus RA y CE.
- **Reemplazar los módulos genéricos sin respaldo por los módulos oficiales** en las figuras que tienen PDF, y marcarlos `estadoCatalogo: "completo"` con sus `resultadosAprendizaje`.
- **Compatibilidad con planes guardados**: los códigos de módulo que ya existen (p. ej. `DS.1.1`) y que usan los planes BT y de Conecta Nivela Crea (`moduloCodigo`/`moduloId`) se siguen resolviendo como módulos históricos. No se ofrecen para planes nuevos. No es **BREAKING** para los planes guardados.
- **Unidades de competencia**: la UC asociada que declara cada módulo en su PDF se transcribe a `data/bachillerato-tecnico-uc.ts` con su vínculo módulo↔UC. Los EC/CD solo se transcriben donde ya existen (AFDR).
- **Figuras sin PDF de módulos** (`actividad-fisica` en sus módulos pendientes, `gestion-deportiva`, `climatizacion` como referencia y `construcciones-metalicas`, que está deprecada): se dejan como están. Se documentan con `estadoCatalogo: "pendiente"` y se listan en un informe de brechas. No se inventa contenido.
- **Informe de verificación** por figura (coincide / corregido / sin fuente), como artefacto del cambio, para que un humano revise lo transcrito.
- **Prueba automatizada de integridad del catálogo**: IDs únicos, que todo módulo "completo" tenga al menos un RA con CE, y que los códigos históricos se sigan resolviendo.
- Fuera de alcance: cambios de UI en el flujo de planificación BT, generación con IA, EC/CD de los perfiles profesionales (PDF "Perfil profesional"/"Análisis funcional") y la oferta institucional.

## Capabilities

### New Capabilities
<!-- Ninguna: el contenido de módulos pertenece a la capacidad de catálogo BT existente. -->

### Modified Capabilities
- `catalogo-bachillerato-tecnico`: agrega requisitos de fidelidad del contenido curricular: módulos oficiales con RA/CE transcritos de los PDF del MINEDUC, nada de contenido sin fuente, y resolución de los códigos de módulo históricos de planes guardados.

## Impact

- `data/bachillerato-tecnico.ts`: módulos de ~31 figuras (objetivo general, módulos, RA/CE, duración, nivel), y mapa de módulos históricos.
- `data/bachillerato-tecnico-uc.ts`: UC asociadas por módulo y relaciones módulo↔UC.
- `data/types-bt.ts`: posible campo de módulo histórico/no seleccionable (p. ej. `estadoCatalogo: "historico"`).
- Consumidores que resuelven módulos por código: `app/planificar-bt/[figuraId].tsx`, `lib/planificaciones-bt-context.tsx`, `app/conecta-nivela-crea/index.tsx`, `app/ver-cnc/[id].tsx`, `server/cnc-router.ts`, `lib/cnc-word-generator.ts`, `lib/pdf-generator.ts`.
- Pruebas nuevas en `__tests__/` para la integridad del catálogo.
- Sin cambios de base de datos, de API ni de dependencias. `pymupdf` solo se usa en local, como herramienta de extracción, y no es dependencia del proyecto.
