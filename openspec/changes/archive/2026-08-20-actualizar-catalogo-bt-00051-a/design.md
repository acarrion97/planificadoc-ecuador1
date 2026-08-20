## Context

Ver proposal.md — Why. El catálogo BT vive en `data/bachillerato-tecnico.ts` como módulo TS estático (34 figuras, fiel a 00065-A) y los planes se persisten como documentos JSON autocontenidos en AsyncStorage que referencian `figuraProfesionalId` como string. No hay base relacional detrás; Drizzle solo respalda CNC/evaluaciones. Por eso los IDs de figura son identidad estable de la aplicación y no pueden reasignarse sin migrar datos.

## Goals / Non-Goals

**Goals:**
- Adoptar la normativa vigente (00051-A) sin romper ningún plan guardado.
- Introducir identidad normativa (`codigo`) como atributo, no como ID.
- Mantener figuras deprecadas resolubles e historialmente reproducibles.
- Diferenciar explícitamente "figura seleccionable para planes nuevos" de "figura histórica".

**Non-Goals:**
- Migrar datos de planes guardados (no se reescribe AsyncStorage).
- Modelar oferta institucional, matrícula, estudiantes ni docentes.
- Refactorizar el almacenamiento a base de datos relacional.

## Decisions

### 1. Nueva figura + deprecación + equivalencia (Opción B), no renombrado en sitio
`construcciones-metalicas` se marca `deprecada` y se crea `mecanica-industrial` con equivalencia `construcciones-metalicas → mecanica-industrial`.

- **Por qué**: el ID `construcciones-metalicas` dejaría de ser semánticamente correcto si se renombrara a "Mecánica industrial"; los planes guardados seguirían resolviendo vía la figura deprecada sin necesidad de reescribir AsyncStorage; y permite que una figura histórica conserve su currículo sin contaminar la nueva.
- **Alternativa (Opción A, descartada)**: renombrar en sitio manteniendo el ID — más barato, pero deja un ID que miente y no permite conservar dos currículos (histórico vs nuevo).

### 2. Identidad dual: `id` estable + `codigo` oficial + metadatos normativos
Se extiende el tipo de figura (en `data/bachillerato-tecnico.ts` / `data/types-bt.ts`) con:
`codigo?: string` (oficial, p.ej. "TC-05-08"), `estado: "activa" | "deprecada"`, `reemplazadaPor?: string`, `normativaVigente?: string` (p.ej. "MINEDEC-MINEDEC-2025-00051-A").

- **Por qué**: separa identidad interna de identidad normativa; permite futuras reformas sin tocar IDs. El `id` se usa en `figuraProfesionalId` de los planes; el `codigo` solo para trazabilidad/exhibición.
- **Alternativa**: adoptar códigos oficiales como IDs — descartada porque rompería planes guardados.

### 3. Resolución por ID única que incluye deprecadas + filtro para selectores
`obtenerFiguraPorId(figuraId)` sigue devolviendo figuras deprecadas (los planes históricos resuelven). Se añade un filtro de "activas" para los selectores de planes nuevos (`obtenerFigurasActivas()` / filtrar por `estado`). Los consumidores que hoy recorren `FIGURAS_PROFESIONALES` para seleccionar (`app/conecta-nivela-crea/index.tsx`) cambian al conjunto activo; los que resuelven por ID (`app/ver-cnc/[id].tsx`) conservan la resolución completa.

### 4. Renombres y movimientos con IDs estables
Las figuras que solo cambian de denominación (`gestion-financiera`, `artes-plasticas`, `artes-escenicas`, `musica`) y las que solo cambian de familia (`climatizacion`, `instalaciones-electricas`) se editan en sitio: se actualiza `nombre` y/o `familia` sin tocar el ID.

### 5. Tratamiento de `modulos[]` de `construcciones-metalicas`
Los 3 módulos históricos (CM.1.1, CM.2.1, CM.3.1) **permanecen** en la figura deprecada para reproducir planes antiguos. Para `mecanica-industrial` la decisión es de currículo, no de copia automática: si el perfil oficial de Mecánica industrial coincide con esos módulos, se reutilizan por referencia de objeto compartido (el catálogo es estático en memoria; compartir el array es seguro); si difiere, se redactan módulos propios. La inspección del perfil oficial se ejecuta en apply y su resultado se registra en la tarea correspondiente.

### 6. Corrección del área de la familia `artes`
Se cambia `area: "deportes_salud"` → `"artistica"` en la entrada de `FAMILIAS_PROFESIONALES` de `artes`. No es un cambio normativo: es un bug del código (en 00065-A y 00051-A las Artes pertenecen al área Artística).

## Risks / Trade-offs

- [Renombres visuales alteran lo que muestran planes históricos] → la resolución devuelve la figura con su denominación vigente; los planes históricos se reproducen con la información que tenga el catálogo. Los módulos históricos se conservan para no perder currículo.
- [`mecanica-industrial` sin módulos → plan nuevo con figura sin catálogo] → la tarea de inspección del perfil define si se reutilizan CM.* o se redactan; hasta entonces la figura puede quedar con `estadoCatalogo: "pendiente"`, igual que otras figuras del catálogo.
- [Bug del área `artes` afecta a usuarios que ya la navegaban en "Deportes y salud"] → es la corrección intencionada; el área correcta es Artística.
- [Equivalencia mal aplicada si un plan deprecado apunta a módulos que no existen] → los módulos CM.* se conservan en la figura deprecada, por lo que la reproducción no se rompe.

## Migration Plan

1. Editar el catálogo estático (renames, movimientos, deprecación, nueva figura, bug de `artes`).
2. Extender tipos y helpers (resolución + filtro activas).
3. Ajustar consumidores (selector de planes nuevos usa activas; resolución de planes usa el total).
4. Prueba de regresión: plan guardado con `figuraProfesionalId: "construcciones-metalicas"` sigue resolviéndose; un plan nuevo no ofrece esa figura y sí "Mecánica industrial".
5. Sin migración de datos (AsyncStorage intacto). Rollback = revertir el cambio de código; los planes guardados no se ven afectados por revertir el catálogo.

## Open Questions

- Perfil oficial de módulos de "Mecánica industrial" (fuente MINEDUC a localizar en apply) para decidir reutilización de CM.* vs redacción propia.
- Si los consumidores de `app/bachillerato-tecnico.tsx` requieren mostrar figuras deprecadas en alguna vista (p.ej. catálogo de solo lectura) además de ocultarlas en selección — se resuelve durante apply sin cambiar el contrato.