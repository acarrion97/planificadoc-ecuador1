/**
 * Tests de exportación PDF (HTML) para Currículo por Competencias
 *
 * Valida:
 * - HTML generado correctamente
 * - @page A4 landscape
 * - print-color-adjust: exact
 * - Secciones y tablas esperadas
 * - Contenido correcto según familia
 * - Ausencia de contenido de la otra familia
 */
import { describe, it, expect } from "vitest";
import {
  generarCurriculoCompetenciasPdfEGBBGU,
  generarCurriculoCompetenciasPdfInicial,
  generarCurriculoCompetenciasPdf,
} from "../lib/curriculo-competencias-pdf-generator";
import type {
  PlanificacionCurriculoCompetencias,
  PlanificacionInicialCurriculo,
} from "../data/types-curriculo-competencias";

// ── Datos de prueba EGB/BGU ──
const PLAN_EGB_BGU: PlanificacionCurriculoCompetencias = {
  id: "test-pdf-1",
  sessionId: "test-session",
  fecha: "2026-09-01",
  institucion: "Unidad Educativa Sol Naciente",
  docente: "Pedro Martínez",
  grado: "7mo",
  asignatura: "Lengua y Literatura",
  periodoPedagogico: "2026-2027",
  trimestre: "Segundo Trimestre",
  nivel: "BGU",
  paralelo: "B",
  destreza: {
    codigo: "LEN-7MO-01",
    descripcion: "Analiza textos literarios",
  } as any,
  indicadorEvaluacion: "Identifica elementos literarios en textos narrativos",
  competenciasAsociadas: ["C", "M"],
  objetivoAprendizaje: "Comprender y analizar textos literarios",
  estructuraDidactica: {
    estrategiaId: "erca",
    fases: [
      {
        titulo: "Experiencia",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Lectura de un cuento",
            competencia: "C",
            dua: { representacion: true, accionExpresion: false, implicacion: false },
          },
        ],
      },
      {
        titulo: "Reflexión",
        duracionMinutos: 15,
        actividades: [
          {
            texto: "Discusión grupal",
            competencia: "CS",
            dua: { representacion: false, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Conceptualización",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Definición de elementos literarios",
            competencia: "C",
            dua: { representacion: true, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Aplicación",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Análisis de un segundo texto",
            competencia: "C",
            dua: { representacion: false, accionExpresion: true, implicacion: true },
          },
        ],
      },
    ],
  },
  recursos: "Libro de textos, cuaderno",
  tecnicaEvaluacion: "Análisis de productos",
  instrumentoEvaluacion: "Rúbrica de análisis literario",
  actividadesEvaluacion: "Análisis de texto narrativo",
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
  status: "draft",
};

// ── Datos de prueba Inicial/Preparatoria ──
const PLAN_INICIAL: PlanificacionInicialCurriculo = {
  id: "test-pdf-2",
  sessionId: "test-session",
  grado: "Primer años",
  institucion: "Unidad Educativa Estrellita",
  docente: "Laura Sánchez",
  duracion: "40 minutos",
  objetivoGeneral: "Desarrollar habilidades motoras gruesas",
  ambitos: [
    {
      ambito: "Motriz",
      competenciaCodigo: "MOT",
      competenciaDescripcion: "Desarrolla habilidades motoras",
      competenciasTransversales: ["CS", "M"],
      destrezas: ["Corre", "Salta", "Gatea"],
      clases: [
        {
          numero: 1,
          tema: "Juegos de movimiento",
          objetivoEspecifico: "Desarrollar coordinación motora",
          metodologia: "Juegos libres dirigidos",
          inicio: [
            {
              texto: "Calentamiento con música",
              competencia: "CS",
              dua: { representacion: true, accionExpresion: false, implicacion: false },
            },
          ],
          desarrollo: [
            {
              texto: "Circuitos de运动",
              competencia: "M",
              dua: { representacion: false, accionExpresion: true, implicacion: true },
            },
          ],
          cierre: [
            {
              texto: "Relajación",
              competencia: "CS",
              dua: { representacion: true, accionExpresion: false, implicacion: true },
            },
          ],
          metodoEvaluacion: ["Observación"],
        },
      ],
    },
  ],
  bibliografia: "Guía de actividades físicas para niños",
  observaciones: "Espacio adecuado para movimiento",
  firmas: {
    elaborado: "Laura Sánchez",
    revisado: "María Torres",
    coordinador: "Pedro López",
    aprobado: "Ana Ruiz",
  },
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
  status: "draft",
};

// ── Tests PDF EGB/BGU ──
describe("PDF EGB/BGU - HTML generado", () => {
  it("genera HTML válido", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(1000);
  });

  it("contieneDOCTYPE html", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="es">');
  });

  it("contiene @page A4 landscape", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("@page");
    expect(html).toContain("A4 landscape");
  });

  it("contiene print-color-adjust: exact", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("print-color-adjust");
    expect(html).toContain("exact");
  });

  it("contiene la institución", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("Unidad Educativa Sol Naciente");
  });

  it("contiene el docente", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("Pedro Martínez");
  });

  it("contiene el DCD", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("LEN-7MO-01");
  });

  it("contiene las competencias", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("C");
    expect(html).toContain("M");
  });

  it("contiene las fases ERCA", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("Experiencia");
    expect(html).toContain("Reflexión");
    expect(html).toContain("Conceptualización");
    expect(html).toContain("Aplicación");
  });

  it("contiene las secciones esperadas", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("DATOS INFORMATIVOS");
    expect(html).toContain("APRENDIZAJE DISCIPLINAR");
    expect(html).toContain("ESTRATEGIA DIDÁCTICA");
    expect(html).toContain("EVALUACIÓN");
  });

  it("contiene tablas HTML", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("<table");
    expect(html).toContain("</table>");
    expect(html).toContain("<td");
  });

  it("contiene las firmas", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).toContain("Docente");
    expect(html).toContain("Coordinador");
    expect(html).toContain("Director");
  });

  it("NO contiene elementos de Inicial/Preparatoria", () => {
    const html = generarCurriculoCompetenciasPdfEGBBGU(PLAN_EGB_BGU);
    expect(html).not.toContain("ÁMBITO:");
    expect(html).not.toContain("INICIO");
    expect(html).not.toContain("DESARROLLO");
    expect(html).not.toContain("CIERRE");
    expect(html).not.toContain("Elaborado");
  });
});

// ── Tests PDF Inicial/Preparatoria ──
describe("PDF Inicial/Preparatoria - HTML generado", () => {
  it("genera HTML válido", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(1000);
  });

  it("contieneDOCTYPE html", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("<!DOCTYPE html>");
  });

  it("contiene @page A4 landscape", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("@page");
    expect(html).toContain("A4 landscape");
  });

  it("contiene la institución", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Unidad Educativa Estrellita");
  });

  it("contiene el docente", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Laura Sánchez");
  });

  it("contiene el objetivo general", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Desarrollar habilidades motoras gruesas");
  });

  it("contiene los ámbitos", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("ÁMBITO:");
    expect(html).toContain("MOTRIZ");
  });

  it("contiene las competencias del ámbito", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("MOT");
  });

  it("contiene las destrezas", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Corre");
    expect(html).toContain("Salta");
    expect(html).toContain("Gatea");
  });

  it("contiene las fases INICIO/DESARROLLO/CIERRE", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("INICIO");
    expect(html).toContain("DESARROLLO");
    expect(html).toContain("CIERRE");
  });

  it("contiene la bibliografía", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Guía de actividades físicas para niños");
  });

  it("contiene las 4 firmas", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).toContain("Laura Sánchez");
    expect(html).toContain("María Torres");
    expect(html).toContain("Pedro López");
    expect(html).toContain("Ana Ruiz");
  });

  it("NO contiene elementos de EGB/BGU", () => {
    const html = generarCurriculoCompetenciasPdfInicial(PLAN_INICIAL);
    expect(html).not.toContain("Trimestre");
    expect(html).not.toContain("Paralelo");
    expect(html).not.toContain("Experiencia");
    expect(html).not.toContain("Conceptualización");
    expect(html).not.toContain("Nivel:");
  });
});

// ── Tests de función unificada ──
describe("PDF - Función unificada generarCurriculoCompetenciasPdf", () => {
  it("detecta EGB/BGU y genera formato correcto", () => {
    const html = generarCurriculoCompetenciasPdf(PLAN_EGB_BGU);
    expect(html).toContain("DATOS INFORMATIVOS");
    expect(html).toContain("ESTRATEGIA DIDÁCTICA");
  });

  it("detecta Inicial/Preparatoria y genera formato correcto", () => {
    const html = generarCurriculoCompetenciasPdf(PLAN_INICIAL);
    expect(html).toContain("OBJETIVO GENERAL");
    expect(html).toContain("ÁMBITO:");
  });
});

// ── Tests de casos límite PDF ──
describe("PDF - Casos límite", () => {
  it("EGB/BGU sin competencias", () => {
    const plan: PlanificacionCurriculoCompetencias = {
      ...PLAN_EGB_BGU,
      competenciasAsociadas: [],
    };
    const html = generarCurriculoCompetenciasPdfEGBBGU(plan);
    expect(html).toContain("Unidad Educativa Sol Naciente");
    expect(html.length).toBeGreaterThan(500);
  });

  it("Inicial sin adaptaciones NEE", () => {
    const plan: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      adaptacionesNEE: undefined,
    };
    const html = generarCurriculoCompetenciasPdfInicial(plan);
    expect(html).toContain("Unidad Educativa Estrellita");
    expect(html).not.toContain("NECESIDADES EDUCATIVAS ESPECIALES");
  });

  it("Inicial sin bibliografía", () => {
    const plan: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      bibliografia: undefined,
    };
    const html = generarCurriculoCompetenciasPdfInicial(plan);
    expect(html).not.toContain("BIBLIOGRAFÍA");
  });

  it("Inicial sin observaciones", () => {
    const plan: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      observaciones: undefined,
    };
    const html = generarCurriculoCompetenciasPdfInicial(plan);
    expect(html).not.toContain("OBSERVACIONES");
  });

  it("Inicial sin firmas", () => {
    const plan: PlanificacionInicialCurriculo = {
      ...PLAN_INICIAL,
      firmas: undefined,
    };
    const html = generarCurriculoCompetenciasPdfInicial(plan);
    expect(html).toContain("Elaborado");
    expect(html).toContain("Revisado");
  });
});
