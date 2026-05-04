import { describe, it, expect } from "vitest";
import {
  INSERCIONES_CURRICULARES,
  obtenerInsercion,
  obtenerNombreInsercion,
} from "../data/inserciones-curriculares";
import { generarHTMLPlanificacion } from "../lib/pdf-generator";
import { Planificacion } from "../data/types";

describe("Inserciones Curriculares - Data Module", () => {
  it("should have 7 inserciones curriculares", () => {
    expect(INSERCIONES_CURRICULARES).toHaveLength(7);
  });

  it("each insercion should have all required fields", () => {
    for (const ins of INSERCIONES_CURRICULARES) {
      expect(ins.id).toBeTruthy();
      expect(ins.nombre).toBeTruthy();
      expect(ins.nombreCorto).toBeTruthy();
      expect(ins.descripcion).toBeTruthy();
      expect(ins.emoji).toBeTruthy();
      expect(ins.nameEN).toBeTruthy();
      expect(ins.descriptionEN).toBeTruthy();
    }
  });

  it("obtenerInsercion should find by id", () => {
    const ins = obtenerInsercion("civica-etica");
    expect(ins).toBeDefined();
    expect(ins!.nombre).toBe("Educación Cívica, Ética e Integridad");
  });

  it("obtenerInsercion should return undefined for invalid id", () => {
    const ins = obtenerInsercion("invalid-id");
    expect(ins).toBeUndefined();
  });

  it("obtenerNombreInsercion should return Spanish name by default", () => {
    const nombre = obtenerNombreInsercion("socioemocional");
    expect(nombre).toBe("Educación Socioemocional");
  });

  it("obtenerNombreInsercion should return English name for EFL", () => {
    const nombre = obtenerNombreInsercion("socioemocional", true);
    expect(nombre).toBe("Social-Emotional Education");
  });
});

describe("Inserciones Curriculares - PDF Integration", () => {
  const mockPlan: Planificacion = {
    id: "test-123",
    fecha: "01/05/2026",
    institucion: "UE Test",
    docente: "Prof. Test",
    grado: "8vo EGB",
    asignatura: "Matemática",
    periodos: "2",
    destreza: {
      codigo: "M.4.1.1",
      area: "M",
      subnivel: 4,
      bloque: 1,
      secuencial: 1,
      descripcion: "Test destreza",
      objetivos: ["Obj 1"],
      criteriosEvaluacion: ["CE 1"],
      indicadoresEvaluacion: ["IE 1"],
    },
    objetivoAprendizaje: "Objetivo test",
    actividades: "Actividades test",
    recursos: "Recursos test",
    evaluacion: "Evaluación test",
    tecnicasInstrumentos: "Técnicas test",
    observaciones: "Obs test",
    insercionCurricular: "desarrollo-sostenible",
    dua: {
      representacion: "Rep test",
      accionExpresion: "Acc test",
      implicacion: "Imp test",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("PDF should include inserción curricular section with selected insertion", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("Inserción Curricular");
    expect(html).toContain("Educación para el Desarrollo Sostenible");
    expect(html).toContain("Protección del medio ambiente");
  });

  it("PDF should show 'No especificada' when no insertion is selected", () => {
    const planSinInsercion = { ...mockPlan, insercionCurricular: undefined };
    const html = generarHTMLPlanificacion(planSinInsercion);
    expect(html).toContain("No especificada");
  });

  it("PDF for EFL should show English insertion name", () => {
    const planEFL: Planificacion = {
      ...mockPlan,
      asignatura: "Inglés",
      destreza: { ...mockPlan.destreza, area: "EFL", codigo: "EFL.4.1.1" },
      insercionCurricular: "financiera",
    };
    const html = generarHTMLPlanificacion(planEFL);
    expect(html).toContain("Curricular Insertion");
    expect(html).toContain("Financial Education");
  });
});
