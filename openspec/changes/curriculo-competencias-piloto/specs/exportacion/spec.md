# Spec: Exportación Word/PDF

## Resumen

Generación de documentos Word y PDF con contrato de salida diferenciado por familia. Cada familia utiliza su generador correspondiente.

## Contrato de salida

```typescript
interface ExportStrategy {
  id: string;
  name: string;
  family: "egb_bgu" | "inicial_preparatoria";
  generate: (plan: any) => Promise<Blob>;
}
```

**Regla:** No un generador monolítico con condicionales. Dos generadores separados.

## Generadores

| Familia | Generador Word | Generador PDF |
|---------|---------------|---------------|
| EGB/BGU | `curriculo-competencias-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |
| Inicial/Preparatoria | `curriculo-competencias-inicial-word-generator.ts` | `curriculo-competencias-pdf-generator.ts` |

## EGB/BGU — Formato Word

**A4 Landscape**, 5 secciones:
1. Encabezado (SELLO | INSTITUCIÓN | AÑO)
2. Título (fondo rosa)
3. Datos Informativos
4. Aprendizaje Disciplinar (matriz 5 columnas con badges competencias, fases ERCA con colores)
5. Aprendizaje Interdisciplinar (si aplica)
6. NEE (si aplica)
7. Acompañamiento Integral
8. Firmas

## Inicial/Preparatoria — Formato Word

**A4 Landscape**, estructura por ámbitos:
1. Título
2. Datos Informativos
3. Matriz por Ámbitos
4. Por cada clase: INICIO/DESARROLLO/CIERRE + DUA
5. NEE, Bibliografía, Observaciones, Firmas (4)

## Badges de competencias

- C: fondo azul (#3498DB), texto blanco
- M: fondo rojo (#E74C3C), texto blanco
- CD: fondo púrpura (#9B59B6), texto blanco
- CS: fondo verde (#27AE60), texto blanco

## No se modifican

- `lib/plan-word-generator.ts`
- `lib/pdf-generator.ts`
- Ningún otro generador existente

## Invariantes

- INV-06: La exportación no debe modificar los datos del dominio.
- AC-08: Cada familia utiliza su generador correspondiente.

## Archivos

- `lib/curriculo-competencias-word-generator.ts`
- `lib/curriculo-competencias-inicial-word-generator.ts`
- `lib/curriculo-competencias-pdf-generator.ts`
