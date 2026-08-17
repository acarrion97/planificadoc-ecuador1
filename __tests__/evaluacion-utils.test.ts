import { describe, it, expect } from "vitest";
import {
  UMBRALES_DEFECTO,
  clasificarAprendizaje,
  calcularResultadoEstudiante,
  calcularBrechasCurso,
  generarRecomendaciones,
} from "../lib/evaluacion-utils";
import type {
  EvaluacionDiagnostica,
  PreguntaDiagnostica,
} from "../data/types-evaluacion";

function pregunta(overrides: Partial<PreguntaDiagnostica> & { id: string; dcdCodigo: string }): PreguntaDiagnostica {
  return {
    enunciado: "Pregunta",
    tipo: "opcion_multiple",
    dificultad: "basica",
    puntaje: 1,
    indicador: "I.1",
    opciones: [
      { id: "a", texto: "Opción A", esCorrecta: true },
      { id: "b", texto: "Opción B", esCorrecta: false },
    ],
    activa: true,
    ...overrides,
  };
}

function evaluacionBasica(overrides: Partial<EvaluacionDiagnostica> = {}): EvaluacionDiagnostica {
  return {
    id: "ev-1",
    nombre: "Diagnóstico inicial",
    anioLectivo: "2026-2027",
    area: "M",
    subnivel: 2,
    grado: "3ro",
    paralelo: "A",
    asignatura: "Matemática",
    fecha: "2026-09-01",
    duracionMinutos: 30,
    instrucciones: "",
    puntajeTotal: 4,
    dcdsEvaluadas: [
      { codigo: "M.2.1.1", descripcion: "Representar conjuntos", indicadores: ["I.M.2.1.1."] },
      { codigo: "M.2.1.2", descripcion: "Reproducir patrones", indicadores: ["I.M.2.1.2."] },
    ],
    preguntas: [
      pregunta({ id: "p1", dcdCodigo: "M.2.1.1" }),
      pregunta({ id: "p2", dcdCodigo: "M.2.1.1" }),
      pregunta({ id: "p3", dcdCodigo: "M.2.1.2" }),
      pregunta({ id: "p4", dcdCodigo: "M.2.1.2" }),
    ],
    estudiantes: [
      { id: "s1", codigo: "E01", incluirEnReportes: true },
      { id: "s2", codigo: "E02", incluirEnReportes: true },
    ],
    resultados: [],
    umbrales: { ...UMBRALES_DEFECTO },
    status: "aplicada",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
    ...overrides,
  };
}

describe("clasificarAprendizaje", () => {
  it("clasifica con umbrales por defecto (70/40)", () => {
    expect(clasificarAprendizaje(80, UMBRALES_DEFECTO)).toBe("dominado");
    expect(clasificarAprendizaje(70, UMBRALES_DEFECTO)).toBe("dominado");
    expect(clasificarAprendizaje(55, UMBRALES_DEFECTO)).toBe("en_proceso");
    expect(clasificarAprendizaje(40, UMBRALES_DEFECTO)).toBe("en_proceso");
    expect(clasificarAprendizaje(39, UMBRALES_DEFECTO)).toBe("requiere_refuerzo");
    expect(clasificarAprendizaje(0, UMBRALES_DEFECTO)).toBe("requiere_refuerzo");
  });

  it("clasifica con umbrales personalizados", () => {
    const umbrales = { dominadoMin: 80, refuerzoMax: 50 };
    expect(clasificarAprendizaje(75, umbrales)).toBe("en_proceso");
    expect(clasificarAprendizaje(80, umbrales)).toBe("dominado");
    expect(clasificarAprendizaje(49, umbrales)).toBe("requiere_refuerzo");
  });
});

describe("calcularResultadoEstudiante", () => {
  it("calcula puntaje, porcentaje y conteos de un estudiante", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [
        { preguntaId: "p1", respuesta: "a", correcta: true },
        { preguntaId: "p2", respuesta: "b", correcta: false },
      ],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.puntaje).toBe(1);
    expect(r.puntajeMaximo).toBe(4);
    expect(r.porcentaje).toBe(25);
    expect(r.correctas).toBe(1);
    expect(r.incorrectas).toBe(1);
    expect(r.sinResponder).toBe(2);
  });

  it("calcula tiempo empleado desde inicio/fin", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      inicio: "2026-09-01T10:00:00Z",
      fin: "2026-09-01T10:05:30Z",
      respuestas: [],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.tiempoEmpleado).toBe(330);
  });

  it("desglosa por DCD con % de logro (sin responder cuenta como incorrecta)", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [{ preguntaId: "p1", respuesta: "a", correcta: true }],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    const dcd1 = r.porDcd.find((d) => d.dcdCodigo === "M.2.1.1")!;
    const dcd2 = r.porDcd.find((d) => d.dcdCodigo === "M.2.1.2")!;
    expect(dcd1.porcentajeLogro).toBe(50); // 1 de 2
    expect(dcd1.estado).toBe("en_proceso");
    expect(dcd1.correctas).toBe(1);
    expect(dcd1.incorrectas).toBe(0);
    expect(dcd1.sinResponder).toBe(1);
    expect(dcd2.porcentajeLogro).toBe(0); // sin responder
    expect(dcd2.estado).toBe("requiere_refuerzo");
  });

  it("DCD sin preguntas respondidas → 🔴 0% de logro", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.porcentaje).toBe(0);
    for (const d of r.porDcd) {
      expect(d.porcentajeLogro).toBe(0);
      expect(d.estado).toBe("requiere_refuerzo");
    }
  });
});

describe("calcularBrechasCurso", () => {
  it("agrega resultados de múltiples estudiantes por DCD", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "a", correcta: true },
            { preguntaId: "p2", respuesta: "a", correcta: true },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
        {
          estudianteId: "s2",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "b", correcta: false },
            { preguntaId: "p2", respuesta: "b", correcta: false },
            { preguntaId: "p3", respuesta: "b", correcta: false },
            { preguntaId: "p4", respuesta: "b", correcta: false },
          ],
        },
      ],
    });
    const brechas = calcularBrechasCurso(ev);
    const dcd1 = brechas.find((b) => b.dcdCodigo === "M.2.1.1")!;
    expect(dcd1.totalEstudiantes).toBe(2);
    expect(dcd1.dominado).toBe(1);
    expect(dcd1.requiereRefuerzo).toBe(1);
    expect(dcd1.porcentajeDominio).toBe(50);
    expect(dcd1.porcentajeDificultad).toBe(50);
    expect(brechas).toHaveLength(2);
  });
});

describe("generarRecomendaciones", () => {
  it("genera recomendación anclada para DCD en refuerzo, priorizada", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "b", correcta: false },
            { preguntaId: "p2", respuesta: "b", correcta: false },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
      ],
    });
    const recs = generarRecomendaciones(ev);
    expect(recs.length).toBeGreaterThan(0);
    const rec1 = recs[0];
    expect(rec1.dcdCodigo).toBe("M.2.1.1");
    expect(rec1.texto).toContain("Representar conjuntos");
    expect(rec1.prioridad).toBe(1);
  });

  it("sin brechas → sin recomendaciones", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "a", correcta: true },
            { preguntaId: "p2", respuesta: "a", correcta: true },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
      ],
    });
    expect(generarRecomendaciones(ev)).toEqual([]);
  });

  it("sin estudiantes evaluados → sin recomendaciones", () => {
    expect(generarRecomendaciones(evaluacionBasica())).toEqual([]);
  });
});