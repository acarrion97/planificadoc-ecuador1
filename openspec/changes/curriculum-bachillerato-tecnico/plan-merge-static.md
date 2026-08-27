# Plan: Enriquecer datos estáticos BT con currículo extraído

## Contexto

El frontend de planificación BT (`app/planificar-bt/[figuraId].tsx`) carga datos de módulos desde archivos estáticos (`data/bachillerato-tecnico.ts` y `data/bachillerato-tecnico-uc.ts`). La mayoría de módulos de especialización NO tienen RA/CE, mostrando "Este módulo no tiene RA/CE propios".

El seed curricular (`data/bt-curriculum-seed.ts`) tiene los datos completos de RA/CE/contenidos para todas las figuras, pero el frontend nunca lo consulta.

**Solución:** Copiar los datos de RA/CE/contenidos del seed al archivo estático, enriqueciendo los módulos que actualmente están vacíos.

## Proceso

### Paso 1: Crear script de merge

**Archivo nuevo:** `scripts/merge-curriculum-to-static.ts`

El script:
1. Importa `BT_CURRICULUM_SEED` desde `data/bt-curriculum-seed.ts`
2. Importa `FIGURAS_PROFESIONALES` desde `data/bachillerato-tecnico.ts`
3. Mapea códigos de seed a códigos de static (ver tabla abaixo)
4. Para cada módulo en el seed que coincida con un módulo estático:
   - Agrega `resultadosAprendizaje` en formato `ResultadoAprendizaje[]`
   - Agrega `categoria`, `nivel`, `objetivoModulo`, `perfilDocente`
   - Agrega `orientacionesMetodologicas` (convertir string a string[])
   - Agrega `contenidos` (convertir `ContenidoSeed[]` a `ContenidosBT`)
   - Agrega `duracionPeriodos` desde `cargaHoraria`
   - Marca `estadoCatalogo: "completo"`
5. Genera el archivo `data/bachillerato-tecnico.ts` actualizado

### Paso 2: Tabla de mapeo de códigos

| Seed code | Static code | Static figura id |
|---|---|---|
| CLI | CL | climatizacion |
| AFDR | AF | actividad-fisica |
| CMA | CM | construcciones-metalicas |
| GFC | GF | gestion-financiera |
| MRH | RH | recursos-hidrobiologicos |
| CPA | PA | produccion-agropecuaria |
| ECLI | AP | areas-protegidas |
| ELEC | GA | gestion-ambiental |
| EMA | EI | electromecanica-industrial |
| ME | EA | electromecanica-automotriz |
| MI | MC | mecatronica |
| PAS | CA | procesamiento-alimentos |
| PDC | PC | produccion-calzado |
| IEA | IE | instalaciones-electricas |
| SOP | SIN | soporte-informatico |
| HAC | HC | hosteleria-culinario |
| GDC | GD | gestion-deportiva |
| API | PI | primera-infancia |
| AESC | AE | artes-escenicas |
| MUS | MU | musica |
| GADS | GAL | gestion-administrativa* |
| Los demás mantienen código | — | — |

*GADS es gestion-administrativa y financiera (combinada en static)

### Paso 3: Conversión de formatos

#### RA/CE: Seed → Static

```typescript
// Seed format:
{ codigo: "RA1", descripcion: "...", criterios: [{ codigo: "CE1.1", descripcion: "..." }] }

// Static format:
{ id: "AFDR-RA.1", texto: "RA1: ...", criteriosEvaluacion: [{ id: "AFDR-CE1.1", texto: "CE1.1: ..." }] }
```

#### Contenidos: Seed → Static

```typescript
// Seed format:
contenidos: [{ tipo: "conceptual", descripcion: "...", orden: 0 }]

// Static format:
contenidos: {
  conceptuales: ["..."],
  procedimentales: ["..."],
  actitudinales: ["..."]
}
```

#### Carga horaria: Seed → Static

```typescript
// Seed format:
cargaHoraria: { anio1: 2, anio2: 2 }

// Static format:
duracionPeriodos: { 1: 2, 2: 2 }
```

### Paso 4: Ejecutar y validar

1. Ejecutar: `npx tsx scripts/merge-curriculum-to-static.ts`
2. Verificar que los módulos tengan RA/CE
3. Verificar que el frontend muestre los datos

## Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `scripts/merge-curriculum-to-static.ts` | Crear (script de merge) |
| `data/bachillerato-tecnico.ts` | Modificar (enriquecer con RA/CE) |

## Validación

1. Ejecutar `npx vitest run __tests__/bt-curriculum.test.ts` → debe seguir pasando
2. Buscar `estadoCatalogo: "completo"` en el archivo actualizado → debe aparecer en más módulos
3. Verificar que los módulos de `climatizacion` y `actividad-fisica` siguen intactos
