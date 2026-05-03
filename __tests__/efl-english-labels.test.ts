import { describe, it, expect } from "vitest";
import { obtenerTemasSugeridos } from "../data/temas-sugeridos";
import { generarTextoDUA, DUA_PRINCIPIOS_EN } from "../data/dua-estrategias";
import { generarHTMLPlanificacion } from "../lib/pdf-generator";
import type { Planificacion } from "../data/types";

describe("EFL English Labels", () => {
  const eflDestreza = {
    codigo: "EFL.3.1.1",
    area: "EFL" as const,
    subnivel: 3 as const,
    bloque: 1,
    secuencial: 1,
    descripcion: "Test EFL skill",
    objetivos: ["Test"],
    criteriosEvaluacion: ["Test"],
    indicadoresEvaluacion: ["Test"],
  };

  const mathDestreza = {
    codigo: "M.2.1.1",
    area: "M" as const,
    subnivel: 2 as const,
    bloque: 1,
    secuencial: 1,
    descripcion: "Test Math skill",
    objetivos: ["Test"],
    criteriosEvaluacion: ["Test"],
    indicadoresEvaluacion: ["Test"],
  };

  describe("temas-sugeridos", () => {
    it("should return English ERCA phase labels for EFL", () => {
      const temas = obtenerTemasSugeridos(eflDestreza);
      expect(temas.length).toBeGreaterThan(0);

      const tema = temas[0];
      expect(tema.estructura.experiencia.titulo).toBe("Experience");
      expect(tema.estructura.reflexion.titulo).toBe("Reflection");
      expect(tema.estructura.conceptualizacion.titulo).toBe("Conceptualization");
      expect(tema.estructura.aplicacion.titulo).toBe("Application");
    });

    it("should return English durations for EFL", () => {
      const temas = obtenerTemasSugeridos(eflDestreza);
      const tema = temas[0];
      expect(tema.estructura.experiencia.duracion).toContain("minutes");
      expect(tema.estructura.reflexion.duracion).toContain("minutes");
      expect(tema.estructura.conceptualizacion.duracion).toContain("minutes");
      expect(tema.estructura.aplicacion.duracion).toContain("minutes");
    });

    it("should return Spanish ERCA phase labels for non-EFL", () => {
      const temas = obtenerTemasSugeridos(mathDestreza);
      expect(temas.length).toBeGreaterThan(0);

      const tema = temas[0];
      expect(tema.estructura.experiencia.titulo).toBe("Experiencia");
      expect(tema.estructura.reflexion.titulo).toBe("Reflexi\u00f3n");
      expect(tema.estructura.conceptualizacion.titulo).toBe("Conceptualizaci\u00f3n");
      expect(tema.estructura.aplicacion.titulo).toBe("Aplicaci\u00f3n");
    });

    it("should return Spanish durations for non-EFL", () => {
      const temas = obtenerTemasSugeridos(mathDestreza);
      const tema = temas[0];
      expect(tema.estructura.experiencia.duracion).toContain("minutos");
    });
  });

  describe("dua-estrategias", () => {
    it("should return English DUA text for EFL", () => {
      const duaText = generarTextoDUA("EFL");
      expect(duaText).toContain("PRINCIPLE 1");
      expect(duaText).toContain("PRINCIPLE 2");
      expect(duaText).toContain("PRINCIPLE 3");
      expect(duaText).toContain("REPRESENTATION");
      expect(duaText).toContain("ACTION AND EXPRESSION");
      expect(duaText).toContain("ENGAGEMENT");
    });

    it("should return Spanish DUA text for non-EFL", () => {
      const duaText = generarTextoDUA("M");
      expect(duaText).toContain("PRINCIPIO 1");
      expect(duaText).toContain("PRINCIPIO 2");
      expect(duaText).toContain("PRINCIPIO 3");
    });

    it("should export English DUA principles", () => {
      expect(DUA_PRINCIPIOS_EN).toBeDefined();
      expect(DUA_PRINCIPIOS_EN.representacion.nombre).toContain("Representation");
      expect(DUA_PRINCIPIOS_EN.accionExpresion.nombre).toContain("Action");
      expect(DUA_PRINCIPIOS_EN.implicacion.nombre).toContain("Engagement");
    });
  });

  describe("pdf-generator", () => {
    const mockEFLPlan: Planificacion = {
      id: "test-efl",
      destreza: {
        codigo: "EFL.3.1.1",
        descripcion: "Test EFL skill description",
        area: "EFL",
        subnivel: 3,
        bloque: 1,
        secuencial: 1,
        objetivos: ["Test objective"],
        criteriosEvaluacion: ["Test criteria"],
        indicadoresEvaluacion: ["Test indicator"],
      },
      docente: "Test Teacher",
      grado: "8th Grade",
      asignatura: "English as a Foreign Language",
      fecha: "2026-05-03",
      periodos: "1",
      institucion: "Test School",
      objetivoAprendizaje: "Test learning objective",
      actividades: "Test activities",
      recursos: "Test resources",
      evaluacion: "Test evaluation",
      tecnicasInstrumentos: "Direct observation, rubric",
      observaciones: "Test observations",
      dua: {
        representacion: "Test representation",
        accionExpresion: "Test action",
        implicacion: "Test engagement",
      },
      temaSeleccionado: {
        id: "test-tema",
        titulo: "Test Topic",
        descripcionBreve: "Brief description",
        objetivoClase: "Class objective",
        estructura: {
          experiencia: {
            titulo: "Experience",
            duracion: "10 minutes",
            actividades: ["Activity 1", "Activity 2"],
          },
          reflexion: {
            titulo: "Reflection",
            duracion: "10 minutes",
            actividades: ["Activity 1", "Activity 2"],
          },
          conceptualizacion: {
            titulo: "Conceptualization",
            duracion: "15 minutes",
            actividades: ["Activity 1", "Activity 2"],
          },
          aplicacion: {
            titulo: "Application",
            duracion: "10 minutes",
            actividades: ["Activity 1", "Activity 2"],
          },
        },
        recursos: ["Textbook", "Flashcards"],
        evaluacionFormativa: "Direct observation",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it("should generate PDF HTML with English labels for EFL", () => {
      const html = generarHTMLPlanificacion(mockEFLPlan);

      // Title
      expect(html).toContain("Microcurricular Lesson Plan");

      // Section headers
      expect(html).toContain("1. General Information");
      expect(html).toContain("2. Learning Objectives");
      expect(html).toContain("3. Lesson Planning");
      expect(html).toContain("4. Resources");
      expect(html).toContain("5. Universal Design for Learning (UDL)");
      expect(html).toContain("6. Observations");

      // Field labels
      expect(html).toContain("Institution:");
      expect(html).toContain("Teacher:");
      expect(html).toContain("Subject:");
      expect(html).toContain("Grade/Level:");
      expect(html).toContain("Date:");
      expect(html).toContain("Periods:");

      // ERCA phases
      expect(html).toContain("EXPERIENCE");
      expect(html).toContain("REFLECTION");
      expect(html).toContain("CONCEPTUALIZATION");
      expect(html).toContain("APPLICATION");

      // Table headers
      expect(html).toContain("Performance Criteria Skills");
      expect(html).toContain("Assessment Indicators");
      expect(html).toContain("Active Methodological Strategies");

      // DUA
      expect(html).toContain("Principle 1: Multiple Means of Representation");
      expect(html).toContain("Principle 2: Multiple Means of Action and Expression");
      expect(html).toContain("Principle 3: Multiple Means of Engagement");

      // Signatures
      expect(html).toContain("Area Director");
    });

    it("should NOT contain Spanish section labels in EFL PDF", () => {
      const html = generarHTMLPlanificacion(mockEFLPlan);

      expect(html).not.toContain("1. Datos Informativos");
      expect(html).not.toContain("2. Objetivos de Aprendizaje");
      expect(html).not.toContain("3. Planificación de la Clase");
      expect(html).not.toContain("5. Diseño Universal para el Aprendizaje");
    });
  });
});
