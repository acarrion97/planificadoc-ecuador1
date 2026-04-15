import { describe, it, expect } from "vitest";
import { obtenerTemasSugeridos } from "../data/temas-sugeridos";
import type { Destreza } from "../data/types";

// Helper to create a mock destreza
function mockDestreza(overrides: Partial<Destreza>): Destreza {
  return {
    codigo: "M.2.1.1.",
    area: "M" as any,
    subnivel: 2,
    bloque: 1,
    descripcion: "Representar gráficamente conjuntos y subconjuntos.",
    objetivos: ["O.M.2.1. Explicar y construir patrones de figuras y numéricos."],
    indicadoresEvaluacion: ["I.M.2.1.1. Completa secuencias numéricas ascendentes o descendentes."],
    criteriosEvaluacion: ["CE.M.2.1. Descubre regularidades matemáticas del entorno inmediato."],
    secuencial: 1,
    ...overrides,
  };
}

describe("obtenerTemasSugeridos", () => {
  it("debe retornar exactamente 3 temas", () => {
    const destreza = mockDestreza({});
    const temas = obtenerTemasSugeridos(destreza);
    expect(temas).toHaveLength(3);
  });

  it("cada tema debe tener la estructura completa requerida", () => {
    const destreza = mockDestreza({});
    const temas = obtenerTemasSugeridos(destreza);

    for (const tema of temas) {
      expect(tema.id).toBeDefined();
      expect(tema.titulo).toBeDefined();
      expect(typeof tema.titulo).toBe("string");
      expect(tema.titulo.length).toBeGreaterThan(0);
      expect(tema.descripcionBreve).toBeDefined();
      expect(tema.objetivoClase).toBeDefined();
      expect(tema.estructura).toBeDefined();
      expect(tema.estructura.anticipacion).toBeDefined();
      expect(tema.estructura.anticipacion.actividades.length).toBeGreaterThanOrEqual(2);
      expect(tema.estructura.desarrollo).toBeDefined();
      expect(tema.estructura.desarrollo.actividades.length).toBeGreaterThanOrEqual(2);
      expect(tema.estructura.cierre).toBeDefined();
      expect(tema.estructura.cierre.actividades.length).toBeGreaterThanOrEqual(2);
      expect(tema.recursos).toBeDefined();
      expect(tema.recursos.length).toBeGreaterThanOrEqual(1);
      expect(tema.evaluacionFormativa).toBeDefined();
    }
  });

  it("debe generar temas DIFERENTES para destrezas del mismo subnivel", () => {
    const destreza1 = mockDestreza({
      codigo: "M.2.1.1.",
      descripcion: "Representar gráficamente conjuntos y subconjuntos, discriminando las propiedades o atributos de los elementos.",
    });
    const destreza2 = mockDestreza({
      codigo: "M.2.1.2.",
      descripcion: "Describir y reproducir patrones de objetos y figuras basándose en sus atributos.",
    });
    const destreza3 = mockDestreza({
      codigo: "M.2.1.3.",
      descripcion: "Describir y reproducir patrones numéricos basados en sumas y restas, contando hacia adelante y hacia atrás.",
    });

    const temas1 = obtenerTemasSugeridos(destreza1);
    const temas2 = obtenerTemasSugeridos(destreza2);
    const temas3 = obtenerTemasSugeridos(destreza3);

    // Los títulos de los temas deben ser diferentes entre destrezas
    const titulos1 = temas1.map((t) => t.titulo);
    const titulos2 = temas2.map((t) => t.titulo);
    const titulos3 = temas3.map((t) => t.titulo);

    // No debe haber intersección entre los títulos de diferentes destrezas
    const overlap12 = titulos1.filter((t) => titulos2.includes(t));
    const overlap13 = titulos1.filter((t) => titulos3.includes(t));
    const overlap23 = titulos2.filter((t) => titulos3.includes(t));

    expect(overlap12).toHaveLength(0);
    expect(overlap13).toHaveLength(0);
    expect(overlap23).toHaveLength(0);
  });

  it("debe generar temas diferentes para áreas distintas", () => {
    const destrezaM = mockDestreza({
      codigo: "M.2.1.1.",
      area: "M" as any,
      descripcion: "Representar gráficamente conjuntos.",
    });
    const destrezaLL = mockDestreza({
      codigo: "LL.2.3.1.",
      area: "LL" as any,
      descripcion: "Construir los significados de un texto a partir del establecimiento de relaciones.",
    });

    const temasM = obtenerTemasSugeridos(destrezaM);
    const temasLL = obtenerTemasSugeridos(destrezaLL);

    const titulosM = temasM.map((t) => t.titulo);
    const titulosLL = temasLL.map((t) => t.titulo);

    const overlap = titulosM.filter((t) => titulosLL.includes(t));
    expect(overlap).toHaveLength(0);
  });

  it("los 3 temas de una misma destreza deben ser diferentes entre sí", () => {
    const destreza = mockDestreza({});
    const temas = obtenerTemasSugeridos(destreza);

    const titulos = temas.map((t) => t.titulo);
    const uniqueTitulos = new Set(titulos);
    expect(uniqueTitulos.size).toBe(3);
  });

  it("debe ser determinístico - misma destreza siempre genera mismos temas", () => {
    const destreza = mockDestreza({});
    const temas1 = obtenerTemasSugeridos(destreza);
    const temas2 = obtenerTemasSugeridos(destreza);

    expect(temas1.map((t) => t.titulo)).toEqual(temas2.map((t) => t.titulo));
  });
});
