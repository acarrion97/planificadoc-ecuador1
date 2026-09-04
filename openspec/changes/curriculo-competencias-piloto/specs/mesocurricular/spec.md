# Spec: Mesocurricular

## Resumen

Configuración de unidades de planificación por competencias para EGB y BGU.

## Estructura

Una unidad mesocurricular contiene:

1. **Contexto**: institución, docente, área, subnivel, grado, año lectivo, paralelo
2. **Selección curricular**: DCDs seleccionadas del catálogo existente
3. **Competencias clave**: competencias transversales asociadas a la unidad (C, M, CD, CS)
4. **Temporalización**: número de unidad, duración en semanas
5. **Resultado IA**: título, objetivos específicos, contenidos, orientaciones metodológicas, evaluación

## Flujo

1. El docente selecciona área y subnivel
2. El docente selecciona las DCDs a trabajar en la unidad
3. El docente selecciona las competencias transversales
4. El docente indica duración en semanas
5. La IA genera título, objetivos, contenidos, orientaciones y evaluación
6. El docente revisa y edita
7. Se guarda localmente (AsyncStorage)

## Datos de entrada (tRPC)

```typescript
{
  sessionId: string;
  area: Area;
  subnivel: Subnivel;
  grado: string;
  dcdsSeleccionadas: DcdSeleccionada[];
  competenciasClave: CompetenciaTransversal[];
}
```

## Datos de salida (IA)

```typescript
{
  titulo: string;
  objetivosEspecificos: string;
  contenidos: string;
  orientacionesMetodologicas: string;
  evaluacion: string;
}
```

## Pendiente de validación

- [ ] Estructura exacta del mesocurricular oficial
- [ ] Campos requeridos vs opcionales
- [ ] Relación con el PCA existente
