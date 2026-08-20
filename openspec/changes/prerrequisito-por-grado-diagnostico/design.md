## Context

La resolución del "subnivel prerrequisito" vive hoy en `lib/curriculo-prerrequisitos.ts`
(`resolverPrerequisito(area, subnivel)`): resta `subnivel - 1` y aplica sobre ese
resultado las reglas especiales de Preparatoria (CAI@1) y de áreas madre de
Bachillerato (CN.F → CN). Ver proposal.md - Why para la motivación completa.

Los tres puntos de entrada que consumen el prerrequisito son:

1. **Evaluación Diagnóstica manual** (`app/evaluacion-diagnostica/index.tsx:216-218`):
   `useMemo` con `resolverPrerequisito(area, subnivel)`, más el toggles
   `incluirPrerrequisito` / `incluirActual`.
2. **Preselección desde wizard CNC** (`app/evaluacion-diagnostica/index.tsx:257`):
   `resolverPrerequisito(v, subnivel)` para admitir DCD de arrastre.
3. **Buscador de destrezas del plan CNC** (`app/conecta-nivela-crea/index.tsx:235`):
   `resolverPrerequisito(area, subnivelCurso)` dentro de `DestrezaBuscadorCNC`,
   que recibe `subnivelCurso` (derivado del grado) pero **no** el grado en sí.

Constraint relevante: el bug original nace de `subnivel - 1`, que solo acierta en
el primer grado de cada subnivel (2.°, 5.°, 8.°, 1.° BGU) y se equivoca en los
siguientes (3.°/4.° EGB, 6.°/7.° EGB, 9.°/10.° EGB, 2.°/3.° BGU), porque estos
comparten subnivel con su grado anterior.

## Goals / Non-Goals

**Goals:**
- Un único punto de verdad: los tres flujos consumen `resolverPrerequisitoPorGrado(area, grado)`
  y ninguno reimplementa `subnivel - 1` localmente.
- Mantener las reglas especiales (CAI de Preparatoria, área madre de Bachillerato)
  aplicando sobre el subnivel del grado anterior, no sobre `subnivel - 1`.

**Non-Goals:**
- No toca el comportamiento de la modalidad BT (diagnóstico técnico por módulos,
  fuera de alcance — spec "Alcance de la modalidad técnica").
- No cambia el modelo de diagnóstico académico (LL/M) ni el wizard de CNC en sí.
- No cambia el render del plan exportado (Word/PDF) en este change.

## Decisions

### D1. Nueva firma `resolverPrerequisitoPorGrado(area, grado)`
`lib/curriculo-prerrequisitos.ts` gana un resolver que toma el **grado en texto**
(igual que los demás flujos) y devuelve `PrerequisitoCurricular | null`:

1. `subnivelCurso = subnivelDesdeGrado(grado)` (reutiliza `lib/evaluacion-utils.ts`).
2. `subnivelAnt = subnivelDelGradoAnterior(grado)` (nueva utilidad pura, ver D2).
3. Si `subnivelAnt` es `null` (1.° EGB/Inicial, sin grado anterior en alcance) → `null`.
4. Si `subnivelAnt === subnivelCurso` → `null` (invariante: nunca devolver el par del curso).
5. Si `subnivelAnt === SUBNIVEL_PREPARATORIA (1)` → `{ area: CAI, subnivel: 1 }`
   (currículo integrado, aplica sobre el subnivel del grado anterior).
6. Si no, candidato `{ areaMadre(area) ?? area, subnivel: subnivelAnt }`, validado con
   `existeAreaSubnivel` (esto hace que EG@1.°BGU → null sin excepción escrita a mano).

Alternativa descartada: cambiar in-place `resolverPrerequisito` para aceptar grado
también. Se descarta porque `subnivel` sigue siendo útil en contextos que solo
conocen el subnivel (sin grado), y las reglas de resolución difieren
estructuralmente (resta vs. subnivel del grado anterior). Dos firmas explícitas
evitan ambigüedad de tipos.

### D2. `subnivelDelGradoAnterior(grado)` en `lib/evaluacion-utils.ts`
Utilidad pura que devuelve el subnivel del **grado anterior**, sin restar uno al
subnivel actual. Implementación: reutilizar `subnivelDesdeGrado` sobre el texto del
grado anterior derivado del número (si el grado tiene número, `n - 1`; si es
"1.° EGB" → `null`; BGU/BT: "1.° BGU" → subnivel del 10.° EGB = 4; "2.°/3.° BGU" → 5;
"1.° EGB" / Inicial → `null`). Cubierta por tests (D4).

Alternativa descartada: calcular el grado anterior con un `n - 1` y mapear con
`subnivelDesdeGrado`; es exactamente lo que hace esta función, por eso se encapsula
para que el único lugar que conoce la resta por grado sea `evaluacion-utils.ts`
(mismo patrón que `esBachilleratoTecnico`).

### D3. Un único punto de verdad en la UI
Los tres flujos migran a `resolverPrerequisitoPorGrado(area, grado)`:

- `app/evaluacion-diagnostica/index.tsx:216-218` → `useMemo` con `grado` en deps.
- `app/evaluacion-diagnostica/index.tsx:257` (`preseleccionarDcdsDeWizard`) → mismo resolver.
- `app/conecta-nivela-crea/index.tsx:235` (`DestrezaBuscadorCNC`) → el componente
  recibe `grado: string` (prop nueva) y deriva el prerrequisito con el resolver por
  grado, en vez de recibir `subnivelCurso` y restar.

El invariante de la spec ("nunca devolver el par del curso") se garantiza en D1 paso 4;
la UI no necesita comprobarlo porque `null` significa "usa el subnivel del curso".

Racional: este es justo el tipo de duplicación que causó el bug original — si cada
flujo derivara el prerrequisito por su cuenta, el fix de un flujo no alcanzaría.
Centralizar en un resolver hace que la corrección se propague a los tres.

Alternativa descartada: pasar `grado` a `DestrezaBuscadorCNC` manteniendo también
`subnivelCurso`. Se descarta por duplicidad de fuentes de verdad (dos inputs que
pueden divergir).

### D4. Red de seguridad antes de tocar UI
Los tests del resolver (`__tests__/curriculo-prerrequisitos.test.ts`) se escriben
**antes** de modificar los componentes. Cobertura mínima:

- Misma área, subniveles distintos: 2.° EGB → CAI@1, 5.° EGB → LL@2, 8.° EGB → LL@3,
  1.° BGU → LL@4.
- Área madre: 1.° BGU CN.F → CN@4.
- Mismo subnivel (invariante → null): 3.°/4.° EGB, 6.°/7.° EGB, 9.°/10.° EGB, 2.°/3.° BGU.
- Sin predecesor: EG@1.° BGU → null; 1.° EGB / Inicial → null.
- Regresión del resolver antiguo: `resolverPrerequisito(area, subnivel)` conserva su
  comportamiento actual (se mantiene para consumidores que solo conocen subnivel).

## Risks / Trade-offs

- [Cambio de comportamiento visible] Hoy 3.° EGB muestra prerrequisito subnivel 1 (CAI);
  con el fix muestra `null` → subnivel del curso. Es el comportamiento deseado, pero un
  docente con un diagnóstico guardado podría ver cambios. → Se documenta en el mensaje
  de la UI (spec "Mensajes diferenciados") y el change se lanza como corrección, no como
  feature opcional.
- [Dos resolvers conviviendo] Mantener `resolverPrerequisito` (subnivel) y añadir
  `resolverPrerequisitoPorGrado` puede confundir sobre cuál usar. → Comentario en el
  header del archivo y en cada llamada; los tests del resolver antiguo evitan que se
  rompa en silencio.
- [Grados sin número parseable] Si `subnivelDesdeGrado` devuelve `null` (grado no
  normalizable), el resolver por grado cae a `null` (solo subnivel del curso). → Misma
  política actual ("se informa, no se sustituye").

## Migration Plan

1. Añadir `subnivelDelGradoAnterior` en `lib/evaluacion-utils.ts` (nueva utilidad pura).
2. Añadir `resolverPrerequisitoPorGrado` en `lib/curriculo-prerrequisitos.ts`,
   reutilizando `subnivelDelGradoAnterior` y `existeAreaSubnivel`. No se toca el
   resolver antiguo.
3. Escribir/ajustar tests del resolver (red de seguridad).
4. Migrar `app/evaluacion-diagnostica/index.tsx` (manual + preselección wizard).
5. Migrar `app/conecta-nivela-crea/index.tsx` (prop `grado` en `DestrezaBuscadorCNC`).
6. `pnpm check` + tests; verificación manual de los casos límite (3.°, 6.°, 9.° EGB,
   2.° BGU).

Rollback: revert del change (los dos resolvers conviven; el antiguo queda intacto, no
hay migración de datos).

## Open Questions

Ninguna pendiente. El orden de resolución (reglas especiales sobre el subnivel del
grado anterior, no sobre `subnivel - 1`) y el invariante del par del curso quedan
fijados en la spec.