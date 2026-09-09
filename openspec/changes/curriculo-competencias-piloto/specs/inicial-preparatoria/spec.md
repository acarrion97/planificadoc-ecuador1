# Spec: Inicial/Preparatoria

## Resumen

Planificación por experiencias de aprendizaje para Educación Inicial y Preparatoria. Dominio completamente independiente del formato EGB/BGU.

## Dominio propio

```typescript
interface InicialPreparatoriaPlan {
  type: "inicial_preparatoria";
  ambitos: AmbitoDesarrollo[];
  // ...
}
```

**No reutiliza** el modelo de asignaturas de EGB/BGU. La diferencia está en el dominio, no solamente en la interfaz.

## Diferencias clave con EGB/BGU

| Aspecto | EGB/BGU | Inicial/Preparatoria |
|---------|---------|---------------------|
| Dominio | `EGBBguPlan` | `InicialPreparatoriaPlan` |
| Eje principal | DCD + Indicadores | Ámbitos de desarrollo |
| Estrategia | ERCA (default) | INICIO/DESARROLLO/CIERRE |
| Organización | Por áreas tradicionales | Por ámbitos |
| Momentos | 4 fases (E-R-C-A) | 3 momentos (I-D-C) |
| Firmas | 3 | 4 (+ Coordinador) |
| Generador | `curriculo-competencias-word-generator.ts` | `curriculo-competencias-inicial-word-generator.ts` |

## Estructura del formato

### Datos Informativos
- Institución, Docente, Grado, Duración, Objetivo General

### Matriz por Ámbitos
- Nombre del ámbito, Competencia/habilidad, Competencias transversales, Destrezas

### Por cada clase
- Número, tema, objetivo, metodología
- INICIO/DESARROLLO/CIERRE con actividades + competencia + DUA
- Método de evaluación

### Secciones adicionales
- Adaptaciones NEE, Bibliografía, Observaciones, Firmas (4)

## Ámbitos de Desarrollo

Catálogo configurable en `data/ambitos-desarrollo-inicial.ts`.

**Valores iniciales del piloto** (no declarados como oficiales):
1. Identidad y Autonomía
2. Convivencia
3. Relaciones Lógico-Matemáticas
4. Comprensión y Expresión del Lenguaje
5. Expresión Artística
6. Expresión Corporal
7. Comprensión del Mundo Real y Simbólico

## Invariantes

- INV-04: Inicial/Preparatoria no puede depender de una asignatura EGB/BGU.

## Archivos

- `data/types-curriculo-competencias.ts` (tipos separados)
- `data/ambitos-desarrollo-inicial.ts` (catálogo configurable)
- `app/curriculo-competencias/inicial/index.tsx`
- `lib/curriculo-competencias-inicial-word-generator.ts`
