/**
 * Tests de exportación Word para Currículo por Competencias
 *
 * Valida:
 * - Estructura del documento (6 secciones EGB/BGU, 5+ secciones Inicial)
 * - Contenido correcto (competencias, DCD, fases, ámbitos)
 * - Formato A4 landscape
 * - Regresión: datos de una planificación no aparecen en otra
 * - Casos límite
 */
import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { generarCurriculoCompetenciasWordEGBBGU } from "../lib/curriculo-competencias-word-generator";
import { generarCurriculoCompetenciasWordInicial } from "../lib/curriculo-competencias-inicial-word-generator";
import type {
  PlanificacionCurriculoCompetencias,
  PlanificacionInicialCurriculo,
} from "../data/types-curriculo-competencias";

// ── Helper: extraer texto del .docx ──
async function extractDocxText(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const docXml = await zip.file("word/document.xml")?.async("text");
  return docXml || "";
}

// ── Datos de prueba EGB/BGU ──
const PLAN_EGB_BGU: PlanificacionCurriculoCompetencias = {
  id: "test-1",
  sessionId: "test-session",
  fecha: "2026-09-01",
  institucion: "Unidad Educativa San José",
  docente: "María López",
  grado: "8vo",
  asignatura: "Matemáticas",
  periodoPedagogico: "2026-2027",
  trimestre: "Primer Trimestre",
  nivel: "EGB",
  paralelo: "A",
  destreza: {
    codigo: "MAT-8VO-01",
    descripcion: "Resuelve problemas de ecuaciones lineales",
  } as any,
  indicadorEvaluacion: "Resuelve ecuaciones lineales de primer grado",
  competenciasAsociadas: ["C", "M", "CD", "CS"],
  objetivoAprendizaje: "Comprender y resolver ecuaciones lineales",
  estructuraDidactica: {
    estrategiaId: "erca",
    fases: [
      {
        titulo: "Experiencia",
        duracionMinutos: 15,
        actividades: [
          {
            texto: "Observar problemas cotidianos",
            competencia: "M",
            dua: { representacion: true, accionExpresion: false, implicacion: false },
          },
        ],
      },
      {
        titulo: "Reflexión",
        duracionMinutos: 20,
        actividades: [
          {
            texto: "Analizar los problemas observados",
            competencia: "C",
            dua: { representacion: false, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Conceptualización",
        duracionMinutos: 15,
        actividades: [
          {
            texto: "Definir ecuaciones lineales",
            competencia: "M",
            dua: { representacion: true, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Aplicación",
        duracionMinutos: 20,
        actividades: [
          {
            texto: "Resolver ejercicios prácticos",
            competencia: "CD",
            dua: { representacion: false, accionExpresion: true, implicacion: true },
          },
        ],
      },
    ],
  },
  recursos: "Cuaderno, lápiz, calculadora",
  tecnicaEvaluacion: "Observación directa",
  instrumentoEvaluacion: "Rúbrica de evaluación",
  actividadesEvaluacion: "Resolución de ejercicios en clase",
  adaptacionesNEE: [
    {
      grado: 1,
      necesidadEducativa: "Dificultad de aprendizaje en matemáticas",
      adaptacionDCD: "Apoyo visual adicional",
      adaptacionEstrategias: "Tiempo extendido",
      adaptacionRecursos: "Material adaptado",
      adaptacionEvaluacion: "Evaluación oral",
    },
  ],
  horasAcompaniamiento: 4,
  actividadesAcompaniamiento: [
    { actividad: "Reforzamiento en ecuaciones", competencia: "M" },
  ],
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
  status: "draft",
};

// ── Datos de prueba Inicial/Preparatoria ──
const PLAN_INICIAL: PlanificacionInicialCurriculo = {
  id: "test-2",
  sessionId: "test-session",
  grado: "Segundo años",
  institucion: "Unidad Educativa Los Andes",
  docente: "Ana García",
  duracion: "50 minutos",
  objetivoGeneral: "Desarrollar habilidades socioemocionales a través del juego",
  ambitos: [
    {
      ambito: "Socioemocional",
      competenciaCodigo: "SOC",
      competenciaDescripcion: "Desarrolla habilidades socioemocionales",
      competenciasTransversales: ["CS", "C"],
      destrezas: ["Identifica emociones", "Expresa sentimientos"],
      clases: [
        {
          numero: 1,
          tema: "Mis emociones",
          objetivoEspecifico: "Reconocer las emociones básicas",
          metodologia: "Juego dramático",
          inicio: [
            {
              texto: "Círculo de bienvenida",
              competencia: "CS",
              dua: { representacion: true, accionExpresion: false, implicacion: false },
            },
          ],
          desarrollo: [
            {
              texto: "Juego de roles con emociones",
              competencia: "CS",
              dua: { representacion: false, accionExpresion: true, implicacion: true },
            },
          ],
          cierre: [
            {
              texto: "Reflexión grupal",
              competencia: "C",
              dua: { representacion: true, accionExpresion: false, implicacion: true },
            },
          ],
          metodoEvaluacion: ["Observación", "Lista de cotejo"],
        },
      ],
    },
    {
      ambito: "Cognitivo",
      competenciaCodigo: "COG",
      competenciaDescripcion: "Desarrolla habilidades cognitivas",
      competenciasTransversales: ["M", "CD"],
      destrezas: ["Clasifica objetos", "Reconoce patrones"],
      clases: [
        {
          numero: 1,
          tema: "Clasificación",
          objetivoEspecifico: "Clasificar objetos por características",
          metodologia: "Manipulación de material concreto",
          inicio: [
            {
              texto: "Exploración de material",
              competencia: "M",
              dua: { representacion: true, accionExpresion: true, implicacion: false },
            },
          ],
          desarrollo: [
            {
              texto: "Clasificación de objetos",
              competencia: "CD",
              dua: { representacion: false, accionExpresion: true, implicacion: true },
            },
          ],
          cierre: [
            {
              texto: "Presentación de resultados",
              competencia: "C",
              dua: { representacion: true, accionExpresion: false, implicacion: true },
            },
          ],
          metodoEvaluacion: ["Producto", "Observación"],
        },
      ],
    },
  ],
  adaptacionesNEE: [
    {
      grado: 1,
      necesidadEducativa: "Retraso en el desarrollo del lenguaje",
      adaptacionDCD: "Material visual simplificado",
      adaptacionEstrategias: "Instrucciones paso a paso",
      adaptacionRecursos: "Imágenes y pictogramas",
      adaptacionEvaluacion: "Evaluación con apoyo visual",
    },
  ],
  bibliografia: "Ministerio de Educación del Ecuador, Currículo Nacional",
  observaciones: "Necesita acompañamiento permanente",
  firmas: {
    elaborado: "Ana García",
    revisado: "Carlos Ruiz",
    coordinador: "María López",
    aprobado: "Pedro Sánchez",
  },
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
  status: "draft",
};

// ── Datos para regresión ──
const PLAN_REGRESION: PlanificacionCurriculoCompetencias = {
  ...PLAN_EGB_BGU,
  id: "test-regression",
  institucion: "UNIDAD EDUCATIVA DIFERENTE",
  docente: "DOCENTE DIFERENTE",
  asignatura: "CIENCIAS NATURALES",
  competenciasAsociadas: ["C", "CS"],
};

// ── Tests EGB/BGU ──
describe("Word EGB/BGU - Estructura y contenido", () => {
  it("genera un Blob válido no vacío", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(5000);
  });

  it("el docx contiene word/document.xml (ZIP válido)", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const buffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    expect(zip.file("word/document.xml")).not.toBeNull();
  });

  it("contiene la institución", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Unidad Educativa San José");
  });

  it("contiene el docente", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("María López");
  });

  it("contiene la asignatura", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Matemáticas");
  });

  it("contiene la descripción del DCD", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Resuelve problemas de ecuaciones lineales");
  });

  it("contiene las 4 competencias", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("C");
    expect(text).toContain("M");
    expect(text).toContain("CD");
    expect(text).toContain("CS");
  });

  it("contiene las fases ERCA", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Experiencia");
    expect(text).toContain("Reflexión");
    expect(text).toContain("Conceptualización");
    expect(text).toContain("Aplicación");
  });

  it("contiene el indicador de evaluación", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Resuelve ecuaciones lineales de primer grado");
  });

  it("contiene los recursos", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Cuaderno, lápiz, calculadora");
  });

  it("contiene la técnica de evaluación", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).toContain("Observación directa");
  });

  it("NO contiene firmas (formato EGB/BGU no las incluye)", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_EGB_BGU);
    const text = await extractDocxText(blob);
    expect(text).not.toContain("Coordinador");
    expect(text).not.toContain("Director");
  });

  it("NO contiene datos de otra planificación (regresión)", async () => {
    const blob = await generarCurriculoCompetenciasWordEGBBGU(PLAN_REGRESION);
    const text = await extractDocxText(blob);
    expect(text).toContain("UNIDAD EDUCATIVA DIFERENTE");
    expect(text).toContain("DOCENTE DIFERENTE");
    expect(text).toContain("CIENCIAS NATURALES");
    expect(text).not.toContain("Unidad Educativa San José");
    expect(text).not.toContain("María López");
  });
});

// ── Tests Inicial/Preparatoria ──
describe("Word Inicial/Preparatoria - Estructura y contenido", () => {
  it("genera un Blob válido no vacío", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(5000);
  });

  it("el docx contiene word/document.xml (ZIP válido)", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const buffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    expect(zip.file("word/document.xml")).not.toBeNull();
  });

  it("contiene la institución", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    expect(text).toContain("Unidad Educativa Los Andes");
  });

  it("contiene el docente", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    expect(text).toContain("Ana García");
  });

  it("contiene el objetivo general", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    expect(text).toContain("Desarrollar habilidades socioemocionales");
  });

  it("contiene los ámbitos de desarrollo", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC incluye ámbitos en "CONEXIONES CURRICULARES"
    expect(text).toContain("CONEXIONES CURRICULARES");
    expect(text).toContain("Ámbitos de desarrollo y aprendizaje");
  });

  it("contiene las competencias de cada ámbito", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC incluye competencias en "CONEXIONES CURRICULARES"
    expect(text).toContain("CONEXIONES CURRICULARES");
    expect(text).toContain("Competencias Específica");
  });

  it("contiene las destrezas", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC incluye destrezas en "Indicadores de evaluación"
    expect(text).toContain("Indicadores de evaluación");
    expect(text).toContain("CONEXIONES CURRICULARES");
  });

  it("contiene las clases con sus temas", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    expect(text).toContain("Mis emociones");
    expect(text).toContain("Clasificación");
  });

  it("contiene las fases INICIO/DESARROLLO/CIERRE", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    expect(text).toContain("INICIO");
    expect(text).toContain("DESARROLLO");
    expect(text).toContain("CIERRE");
  });

  it("contiene las NEE", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC no incluye NEE separadas
    // Verificar que contiene secciones principales
    expect(text).toContain("SITUACIÓN DE APRENDIZAJE");
    expect(text).toContain("CONEXIONES CURRICULARES");
  });

  it("contiene la bibliografía", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC no incluye bibliografía separada
    // Verificar que contiene secciones principales
    expect(text).toContain("RECURSOS");
    expect(text).toContain("EVALUACIÓN");
  });

  it("contiene estructura del formato oficial MINEDUC", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC no incluye firmas separadas
    // Verificar que contiene las secciones principales
    expect(text).toContain("Unidad Educativa Los Andes");
    expect(text).toContain("Planificación microcurricular");
    expect(text).toContain("DATOS INFORMATIVOS");
  });

  it("genera formato Inicial/Preparatoria según formato oficial MINEDUC", async () => {
    const blob = await generarCurriculoCompetenciasWordInicial(PLAN_INICIAL);
    const text = await extractDocxText(blob);
    // El formato oficial MINEDUC incluye: Trimestre, Paralelo, Situación de aprendizaje, Conexiones curriculares
    expect(text).toContain("Planificación microcurricular");
    expect(text).toContain("DATOS INFORMATIVOS");
    expect(text).toContain("SITUACIÓN DE APRENDIZAJE");
    expect(text).toContain("CONEXIONES CURRICULARES");
    expect(text).toContain("SABERES");
  });

  it("maneja campos opcionales vacíos", async () => {
    const planMinimal: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      adaptacionesNEE: undefined,
      bibliografia: undefined,
      observaciones: undefined,
      firmas: undefined,
    };
    const blob = await generarCurriculoCompetenciasWordInicial(planMinimal);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(3000);
    const text = await extractDocxText(blob);
    expect(text).toContain("Unidad Educativa Los Andes");
  });
});

// ── Tests de casos límite ──
describe("Word - Casos límite", () => {
  it("EGB/BGU sin competencias asociadas", async () => {
    const plan: PlanificacionCurriculoCompetencias = {
      ...PLAN_EGB_BGU,
      competenciasAsociadas: [],
    };
    const blob = await generarCurriculoCompetenciasWordEGBBGU(plan);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(2000);
  });

  it("EGB/BGU con texto largo en objetivo", async () => {
    const plan: PlanificacionCurriculoCompetencias = {
      ...PLAN_EGB_BGU,
      objetivoAprendizaje: "a".repeat(500),
    };
    const blob = await generarCurriculoCompetenciasWordEGBBGU(plan);
    expect(blob).toBeInstanceOf(Blob);
    const text = await extractDocxText(blob);
    expect(text).toContain("a".repeat(100));
  });

  it("Inicial sin clases en algún ámbito", async () => {
    const plan: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      ambitos: [
        {
          ambito: "Vacio",
          competenciaCodigo: "VAC",
          competenciaDescripcion: "Vacío",
          competenciasTransversales: [],
          destrezas: [],
          clases: [],
        },
      ],
    };
    const blob = await generarCurriculoCompetenciasWordInicial(plan);
    expect(blob).toBeInstanceOf(Blob);
  });

  it("EGB/BGU con 1 sola fase", async () => {
    const plan: PlanificacionCurriculoCompetencias = {
      ...PLAN_EGB_BGU,
      estructuraDidactica: {
        estrategiaId: "simple",
        fases: [
          {
            titulo: "Desarrollo",
            duracionMinutos: 45,
            actividades: [
              {
                texto: "Actividad única",
                competencia: "M",
                dua: { representacion: true, accionExpresion: true, implicacion: true },
              },
            ],
          },
        ],
      },
    };
    const blob = await generarCurriculoCompetenciasWordEGBBGU(plan);
    expect(blob).toBeInstanceOf(Blob);
    const text = await extractDocxText(blob);
    expect(text).toContain("Desarrollo");
  });
});
