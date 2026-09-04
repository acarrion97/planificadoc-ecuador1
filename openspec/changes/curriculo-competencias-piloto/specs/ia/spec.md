# Spec: Generación IA

## Resumen

Motor de generación de contenido pedagógico por inteligencia artificial para el módulo Currículo por Competencias.

## Endpoints

### 1. generarUnidad (Mesocurricular)

**Input:**
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

**Output:**
```typescript
{
  titulo: string;
  objetivosEspecificos: string;
  contenidos: string;
  orientacionesMetodologicas: string;
  evaluacion: string;
}
```

**Prompt Guidelines:**
- Incluir descripciones completas de las DCD seleccionadas
- Incluir las competencias transversales como eje orientador
- Generar contenido alineado con el subnivel y área
- Usar lenguaje pedagógico formal
- Responder con JSON válido

### 2. generarPlanClase (Microcurricular EGB/BGU)

**Input:**
```typescript
{
  sessionId: string;
  codigoDestreza: string;
  descripcionDestreza: string;
  area: string;
  subnivel: number;
  tema: string;
  competencias: CompetenciaTransversal[];
  indicadorEvaluacion: string;
}
```

**Output:**
```typescript
{
  estructuraERCA: EstructuraClaseERCA;
  recursos: string;
  evaluacion: string;
}
```

**Prompt Guidelines:**
- Generar 4 fases ERCA con tiempos: E(10) + R(10) + C(15) + A(10) = 45 min
- Cada actividad debe empezar con verbo Marzano en infinitivo
- Etiquetar cada actividad con la competencia que potencia
- Prohibir: sujeto conjugado, voz pasiva, acciones del docente
- Incluir indicadores DUA por actividad
- Generar recursos específicos y realistas
- Generar técnica + instrumento de evaluación alineados

### 3. generarClaseInicial (Inicial/Preparatoria)

**Input:**
```typescript
{
  sessionId: string;
  grado: string;
  ambito: string;
  competencia: string;
  destrezas: string[];
}
```

**Output:**
```typescript
{
  inicio: ActividadInicial[];
  desarrollo: ActividadInicial[];
  cierre: ActividadInicial[];
  metodoEvaluacion: string[];
}
```

**Prompt Guidelines:**
- Generar momentos INICIO/DESARROLLO/CIERRE (no ERCA)
- Actividades lúdicas y experienciales apropiadas para la edad
- Etiquetar cada actividad con la competencia que potencia
- Incluir indicadores DUA por actividad
- Generar métodos de evaluación observacionales

## Validación

- Todas las respuestas se validan con Zod
- JSON truncado se repara con `repairJson`
- El docente revisa, edita o descarta antes de usar

## Archivos

- `server/curriculo-competencias-router.ts` (endpoints)
- `server/_core/llm.ts` (invokeLLM, repairJson — existente)
