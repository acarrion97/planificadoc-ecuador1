## Context

Currículo Integrado EGB/BGU (`app/curriculo-competencias/egb-bgu-integrado.tsx`) hoy persiste y exporta usando `PlanificacionInicialCurriculo` (`data/types-curriculo-competencias.ts`) — el mismo shape que usa Inicial/Preparatoria, con `grado: string` (un solo grado) y `ambitos: AmbitoDesarrollo[]` (una CE por ámbito, con `destrezas` en texto libre y `clases` = semanas de ese único grado). El backend (`server/curriculo-competencias-router.ts`) guarda todo bajo `tipo: 'inicial_preparatoria'` y, al exportar, decide entre el generador de Inicial y el de Integrado EGB/BGU con una heurística basada en el prefijo del código de la primera competencia (`CE.CI.*` ⇒ Inicial). Ver proposal.md - Why para la motivación del cambio.

El catálogo `data/competencias-especificas-egb-bgu.ts` ya expone, sin cambios necesarios, `porGrado: GradoCompetenciaEspecifica[]` por cada CE — verificado contra las matrices MESOCURRICULUM oficiales — con exactamente los datos que la modalidad multigrado necesita por grado (indicadores + saberes declarativos/procedimentales/actitudinales).

## Goals / Non-Goals

**Goals:**
- Definir un modelo de datos nuevo y aditivo para la modalidad multigrado, sin tocar `PlanificacionInicialCurriculo`, `AmbitoDesarrollo` ni `ClaseInicialCurriculo` (usados también por Inicial, fuera de alcance).
- Reemplazar, para los registros nuevos, la heurística de detección por prefijo de código con un discriminador explícito y persistido.
- Definir cómo se resuelve el bloque curricular por grado a partir del catálogo existente y cómo se mantiene editable e independiente del catálogo.
- Definir el flujo del paso "Competencias" del wizard para la modalidad multigrado (selección de subnivel, grados y CE con validación de cobertura).
- Definir cómo se exporta el patrón multigrado en Word y PDF reutilizando la infraestructura de exportación existente.

**Non-Goals:**
- No se rediseña el modelo de Inicial/Preparatoria ni su generador (`lib/curriculo-competencias-inicial-word-generator.ts`); su "multigrado" por índice de ámbito queda como está.
- No se soporta combinar grados de distinto subnivel (modo heterogéneo) en esta versión.
- No se corrige el bug preexistente de `ver/[id].tsx` que enruta la edición de un Currículo Integrado single-grade hacia el wizard de Inicial — solo se garantiza el enrutamiento correcto para los registros **nuevos** en modalidad multigrado.
- No se introduce una nueva columna de base de datos; se reutiliza la columna `formData` (JSON) existente.

## Decisions

### D1. Tipos nuevos y separados, no una extensión de `PlanificacionInicialCurriculo`
Se agregan interfaces nuevas en `data/types-curriculo-competencias.ts`, aditivas al archivo existente:

```ts
export interface BloqueCurricularGrado {
  indicadores: string[];
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

export interface GrupoGrado {
  id: string;              // slug estable (ej. "8vo-egb"), usado para enlazar semanas
  nivel: string;            // subnivel: "SUPERIOR", "MEDIA", etc.
  grado: string;             // "8.º EGB"
  bloqueCurricular: BloqueCurricularGrado;   // copia editable, resuelta del catálogo
}

export interface ActividadPorGrado {
  gradoId: string;           // referencia a GrupoGrado.id
  estrategiasDUA: { inicio: string; desarrollo: string; cierre: string };
  recursos: string;
  tecnica: string;
  instrumento: string;
}

export interface SemanaMultigrado {
  numero: number;
  tema: string;
  actividades: ActividadPorGrado[];
}

export interface PlanificacionCurriculoIntegradoMultigrado {
  id: string;
  sessionId: string;
  modalidad: "multigrado";

  // contexto compartido (igual forma que el single-grade existente)
  institucion: string;
  docente: string;
  paralelo?: string;
  asignatura: string;         // materiaId del catálogo (ej. "matematica")
  trimestre?: string;
  noSemanasClase?: number;

  nivel: string;               // subnivel compartido por todos los grados
  grados: GrupoGrado[];        // 2..N

  competenciaEspecifica: { codigo: string; descripcion: string };

  situacionAprendizaje?: { titulo: string; descripcion: string };
  conexionInterdisciplinar?: { asignaturas: string[] };

  semanas: SemanaMultigrado[];

  source?: SourceTraceability;
  createdAt: string;
  updatedAt: string;
  status: string;
}
```

`PlanificacionModulo` gana este nuevo miembro de la unión. **Alternativa considerada**: extender `AmbitoDesarrollo`/`ClaseInicialCurriculo` con un eje de grado opcional. Se descarta porque esos tipos son compartidos con Inicial (fuera de alcance) y overloadearlos con un eje adicional que solo aplica a un caso de uso degrada su legibilidad y arriesga romper Inicial por accidente.

### D2. Discriminador explícito, no heurística por prefijo de código
El sistema hoy adivina Inicial vs. Integrado mirando si el primer código de competencia empieza con `CE.CI.`. Para esta modalidad no se extiende esa heurística: se persiste `modalidad: "unigrado" | "multigrado"` directamente en `formData`, y `exportWord`/`exportPdf` en `server/curriculo-competencias-router.ts` lo leen primero; solo caen a la heurística existente cuando `modalidad` está ausente (registros anteriores a este cambio). Esto no requiere migración: es un campo nuevo y opcional dentro de la columna JSON existente.

**Alternativa considerada**: seguir extendiendo la heurística de prefijo (ej. "si `grados.length > 1` es multigrado"). Se descarta porque ya es información que el propio formulario conoce con certeza al guardar; adivinarla de nuevo en el momento de exportar solo reintroduce el mismo patrón fragil que el código ya documenta como no ideal.

### D3. Resolución del bloque curricular: función pura sobre el catálogo existente
Se agrega una función de solo lectura (sin modificar el catálogo) que, dado un `materiaId`, un `nivel` (subnivel) y un código de CE, calcula el `BloqueCurricularGrado` para cada grado solicitado, filtrando `porGrado` por esos grados:

```ts
function resolverBloquePorGrado(
  materiaId: string,
  ceCodigo: string,
  grados: string[]
): Record<string, BloqueCurricularGrado> // keyed por grado
```

El resultado se copia dentro de `GrupoGrado.bloqueCurricular` al confirmar la selección — de ahí en adelante esa copia es la fuente de verdad de la planificación (ver Requirement: "Copia editable e independiente del catálogo" en el spec). Un cambio posterior al catálogo no viaja a planificaciones ya guardadas porque no hay referencia viva, solo el valor copiado.

### D4. Validación de cobertura de grados: reutilizable en cliente y servidor
Se agrega `ceDisponibleParaGrados(materiaId, ceCodigo, grados): { valido: boolean; gradosNoCubiertos: string[] }`, construida sobre `porGrado` (mismo archivo del catálogo). El wizard la usa para deshabilitar/explicar CEs incompatibles apenas el docente marca los grados; el router la vuelve a ejecutar antes de guardar, como defensa en profundidad (un payload manipulado no debe poder persistir una combinación inválida).

### D5. Wizard: modalidad como bifurcación dentro del paso existente, no un wizard nuevo
En el paso "Contexto" de `egb-bgu-integrado.tsx` se agrega un selector "Un solo grado" / "Multigrado" (persistido en el estado local del wizard, no en el backend hasta guardar). Cuando es "Multigrado", el paso "Competencias" cambia su UI:

```
Paso Competencias (modalidad multigrado)
├── Selector de subnivel (nivelesDeMateria(materiaId))
├── Checklist de grados (gradosDeNivel(materiaId, nivel)) — mínimo 2 marcados
├── Selector de CE, filtrado a solo las CE donde ceDisponibleParaGrados(...).valido === true
│    para los grados ya marcados
└── Al confirmar: se resuelve resolverBloquePorGrado(...) y se muestra, por grado,
     un bloque editable (indicadores/declarativos/procedimentales/actitudinales)
```

Los pasos "Datos" y "Generar" se reutilizan con las adaptaciones mínimas para iterar sobre `grados`/`semanas` en vez de los campos singulares — sin crear un archivo de wizard nuevo, conforme a la decisión ya tomada en la fase de exploración.

### D6. Generación de semanas: solo edición manual en este change
`SemanaMultigrado.actividades` se llena por edición manual del docente (un `ActividadPorGrado` por grado, igual forma que el single-grade). La generación asistida por IA queda **fuera de alcance de este change**: se retoma en un change posterior, una vez que `curriculo-integrado-egb-bgu-ia-semanal` (en curso) aterrice y se pueda extender su esquema de respuesta con el eje de grado sin acoplar dos changes en paralelo. Esta modalidad multigrado es completamente utilizable sin IA (el spec no la exige, solo pide generación con revisión docente).

### D7. Exportación: nueva rama de renderizado, mismo archivo
Se agrega una función `generarDocxMultigrado(plan: PlanificacionCurriculoIntegradoMultigrado)` en `lib/curriculo-competencias-egb-bgu-integrado-word-generator.ts` (sibling de la función single-grade existente en el mismo archivo, no un archivo nuevo, para mantener juntas las dos variantes del mismo formato oficial) y su equivalente en `lib/curriculo-competencias-pdf-generator.ts`. `exportWord`/`exportPdf` en el router despachan a esta rama cuando `formData.modalidad === "multigrado"`. Ambas ramas comparten los helpers de bajo nivel (tablas, estilos) que ya existen en esos archivos.

### D8. Edición: enrutamiento correcto por construcción para registros nuevos
`ver/[id].tsx` pasa a inspeccionar `formData.modalidad` antes de decidir a dónde enviar "Editar": `"multigrado"` ⇒ `egb-bgu-integrado?modo=multigrado&id=...`; ausente o `"unigrado"` ⇒ comportamiento actual (sin cambios, incluyendo su bug conocido, fuera de alcance).

## Risks / Trade-offs

- **[Riesgo] Alcance "mismo subnivel" excluye combinaciones reales de aulas multigrado (ej. 6.º+7.º cruzando subniveles)** → Mitigación: el spec bloquea explícitamente esa combinación con un mensaje claro en vez de fallar silenciosamente o inventar una CE común; el modelo (`GrupoGrado[]` independiente por grado) ya deja espacio para un "modo heterogéneo" futuro sin romper este.
- **[Riesgo] Reutilizar el bucket `tipo: 'inicial_preparatoria'` para una tercera forma de dato (además de Inicial y single-grade Integrado) aumenta la ambigüedad del campo `tipo` a largo plazo** → Mitigación: el nuevo campo explícito `modalidad` evita que esa ambigüedad se resuelva con más heurísticas; una futura limpieza podría introducir un valor de `tipo` propio sin bloquear este cambio.
- **[Riesgo] Sin generación por IA, cargar 8 semanas × N grados a mano es tedioso para el docente** → Mitigación: aceptado para este change (decisión explícita de alcance); la generación por IA para multigrado se planea como change posterior una vez aterrice `curriculo-integrado-egb-bgu-ia-semanal`.
- **[Riesgo] Un docente arma una combinación de grados sin ninguna CE compatible** → Mitigación: el spec exige que el sistema explique qué grado(s) quedan sin cobertura en vez de solo deshabilitar la opción sin explicación.
