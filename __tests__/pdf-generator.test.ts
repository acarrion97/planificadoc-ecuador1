import { describe, it, expect } from "vitest";
import { generarHTMLPlanificacion } from "../lib/pdf-generator";
import { Planificacion, Destreza, TemaSugerido } from "../data/types";

const mockDestreza: Destreza = {
  codigo: "M.3.1.1",
  area: "M",
  subnivel: 3,
  bloque: 1,
  secuencial: 1,
  descripcion: "Generar sucesiones con sumas y restas.",
  objetivos: ["O.M.3.1. Utilizar el sistema de coordenadas para representar situaciones significativas."],
  criteriosEvaluacion: ["CE.M.3.1. Emplea de forma razonada la tecnología."],
  indicadoresEvaluacion: ["I.M.3.1.1. Aplica estrategias de cálculo."],
};

const mockTema: TemaSugerido = {
  id: "test-tema-1",
  titulo: "Fracciones en la cocina ecuatoriana",
  descripcionBreve: "Aprender fracciones usando recetas de comida típica.",
  objetivoClase: "Representar y comparar fracciones.",
  estructura: {
    experiencia: {
      titulo: "Experiencia",
      duracion: "10 minutos",
      actividades: [
        "Mostrar imágenes de platos típicos ecuatorianos.",
        "Preguntar: ¿Cómo repartirían este plato entre 4 personas?",
      ],
    },
    reflexion: {
      titulo: "Reflexión",
      duracion: "10 minutos",
      actividades: [
        "Formular preguntas de análisis sobre la experiencia.",
        "Solicitar que comparen sus respuestas.",
      ],
    },
    conceptualizacion: {
      titulo: "Conceptualización",
      duracion: "15 minutos",
      actividades: [
        "Definir FRACCIÓN como una parte de un todo.",
        "Demostrar con material concreto.",
        "Resolver ejercicios guiados.",
      ],
    },
    aplicacion: {
      titulo: "Aplicación",
      duracion: "10 minutos",
      actividades: [
        "Socializar resultados.",
        "Formular preguntas de retroalimentación.",
        "Asignar tarea para casa.",
      ],
    },
  },
  recursos: ["Texto del estudiante", "Material concreto", "Pizarra"],
  evaluacionFormativa: "Lista de cotejo: Identifica fracciones / Compara fracciones.",
};

const mockPlan: Planificacion = {
  id: "test-plan-1",
  fecha: "03/04/2026",
  institucion: "Unidad Educativa Fiscal Test",
  docente: "Lic. María García",
  grado: "5to grado EGB",
  asignatura: "Matemática",
  periodos: "1",
  destreza: mockDestreza,
  objetivoAprendizaje: "Representar y comparar fracciones.",
  temaSeleccionado: mockTema,
  actividades: "Actividades de la clase...",
  recursos: "Texto, cuaderno, material concreto",
  evaluacion: "Lista de cotejo",
  tecnicasInstrumentos: "Observación directa, lista de cotejo",
  observaciones: "Ninguna observación adicional.",
  createdAt: "2026-04-03T12:00:00.000Z",
  updatedAt: "2026-04-03T12:00:00.000Z",
};

describe("generarHTMLPlanificacion", () => {
  it("debe generar HTML válido con DOCTYPE", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("debe incluir el encabezado del Ministerio de Educación", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Unidad Educativa Fiscal Test");
    expect(html).toContain("2026 - 2027");
  });

  it("debe incluir el título de planificación microcurricular", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("PLANIFICACIÓN MICROCURRICULAR PARA");
    expect(html).toContain("POR TRIMESTRE");
  });

  it("debe incluir los datos informativos del docente", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Unidad Educativa Fiscal Test");
    expect(html).toContain("Lic. María García");
    expect(html).toContain("5to grado EGB");
    expect(html).toContain("Matemática");
  });

  it("debe incluir el código y descripción de la destreza", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("M.3.1.1");
    expect(html).toContain("Generar sucesiones con sumas y restas.");
  });

  it("debe incluir las 4 fases ERCA de la estructura de clase cuando hay tema", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("EXPERIENCIA");
    expect(html).toContain("REFLEXIÓN");
    expect(html).toContain("CONCEPTUALIZACIÓN");
    expect(html).toContain("APLICACIÓN");
    expect(html).toContain("10 minutos");
    expect(html).toContain("15 minutos");
  });

  it("debe incluir las actividades del tema seleccionado", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Mostrar imágenes de platos típicos ecuatorianos.");
    expect(html).toContain("Definir FRACCIÓN como una parte de un todo.");
    expect(html).toContain("Formular preguntas de retroalimentación.");
  });

  it("debe incluir el tema seleccionado", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Fracciones en la cocina ecuatoriana");
    expect(html).toContain("Representar y comparar fracciones.");
  });

  it("debe incluir los recursos", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Texto del estudiante");
    expect(html).toContain("Material concreto");
    expect(html).toContain("Pizarra");
  });

  it("debe incluir la evaluación formativa", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Lista de cotejo: Identifica fracciones / Compara fracciones.");
  });

  it("debe incluir las firmas", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Docente");
    expect(html).toContain("Director/a de Área");
  });

  it("debe incluir el pie de página con PlanificaDoc", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("PlanificaDoc Ecuador");
    expect(html).toContain("Generado con PlanificaDoc");
  });

  it("debe incluir los indicadores de evaluación", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("I.M.3.1.1. Aplica estrategias de cálculo.");
  });

  it("debe funcionar sin tema seleccionado", () => {
    const planSinTema: Planificacion = {
      ...mockPlan,
      temaSeleccionado: undefined,
    };
    const html = generarHTMLPlanificacion(planSinTema);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("M.3.1.1");
    expect(html).not.toContain("EXPERIENCIA");
  });

  it("debe incluir observaciones cuando existen", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Ninguna observación adicional.");
  });

  it("debe incluir el subnivel correcto", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Básica Media");
  });

  it("debe incluir el bloque curricular", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Álgebra y funciones");
  });

  it("debe incluir estilos CSS para impresión A4", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("@page");
    expect(html).toContain("A4");
  });

  it("debe incluir la tabla principal con 4 columnas", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("DESTREZAS CON CRITERIOS DE DESEMPEÑO");
    expect(html).toContain("INDICADORES DE EVALUACIÓN");
    expect(html).toContain("ESTRATEGIAS METODOLÓGICAS");
    expect(html).toContain("EVALUACIÓN");
  });
});
