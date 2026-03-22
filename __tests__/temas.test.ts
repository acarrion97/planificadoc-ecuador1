import { describe, it, expect } from "vitest";
import { obtenerTemasSugeridos } from "../data/temas-sugeridos";
import { TODAS_LAS_DESTREZAS } from "../data";
import { Destreza, TemaSugerido, EstructuraClase } from "../data/types";

describe("Temas Sugeridos", () => {
  it("debe retornar temas para destrezas de Matemática Básica Elemental (M.2.1.x)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(2);
  });

  it("debe retornar temas para destrezas de Matemática Básica Media (M.3.1.x)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.3.1.1");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(2);
  });

  it("cada tema debe tener la estructura completa ERCA", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    const temas = obtenerTemasSugeridos(destreza!);

    for (const tema of temas) {
      // Campos básicos
      expect(tema.id).toBeTruthy();
      expect(tema.titulo).toBeTruthy();
      expect(tema.descripcionBreve).toBeTruthy();
      expect(tema.objetivoClase).toBeTruthy();
      expect(tema.recursos.length).toBeGreaterThan(0);
      expect(tema.evaluacionFormativa).toBeTruthy();

      // Estructura ERCA
      const { estructura } = tema;
      expect(estructura).toBeDefined();

      // Anticipación
      expect(estructura.anticipacion).toBeDefined();
      expect(estructura.anticipacion.titulo).toBeTruthy();
      expect(estructura.anticipacion.duracion).toBeTruthy();
      expect(estructura.anticipacion.actividades.length).toBeGreaterThan(0);

      // Construcción
      expect(estructura.construccion).toBeDefined();
      expect(estructura.construccion.titulo).toBeTruthy();
      expect(estructura.construccion.duracion).toBeTruthy();
      expect(estructura.construccion.actividades.length).toBeGreaterThan(0);

      // Consolidación
      expect(estructura.consolidacion).toBeDefined();
      expect(estructura.consolidacion.titulo).toBeTruthy();
      expect(estructura.consolidacion.duracion).toBeTruthy();
      expect(estructura.consolidacion.actividades.length).toBeGreaterThan(0);

      // Retroalimentación
      expect(estructura.retroalimentacion).toBeDefined();
      expect(estructura.retroalimentacion.titulo).toBeTruthy();
      expect(estructura.retroalimentacion.duracion).toBeTruthy();
      expect(estructura.retroalimentacion.actividades.length).toBeGreaterThan(0);
    }
  });

  it("cada tema debe tener un ID único", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.3.1.1");
    const temas = obtenerTemasSugeridos(destreza!);
    const ids = temas.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("debe generar temas genéricos para destrezas sin temas específicos", () => {
    // Buscar una destreza que probablemente no tenga match exacto
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.4.2.1");
    if (destreza) {
      const temas = obtenerTemasSugeridos(destreza);
      expect(temas.length).toBeGreaterThanOrEqual(1);
      // Los temas genéricos también deben tener estructura ERCA
      for (const tema of temas) {
        expect(tema.estructura.anticipacion.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.construccion.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.consolidacion.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.retroalimentacion.actividades.length).toBeGreaterThan(0);
      }
    }
  });

  it("debe retornar temas para destrezas de Lengua y Literatura", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.area === "LL");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(1);
  });

  it("debe retornar temas para destrezas de Ciencias Naturales", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.area === "CN");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(1);
  });

  it("debe retornar temas para destrezas de Estudios Sociales", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.area === "CS");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(1);
  });

  it("debe retornar temas para destrezas de Educación Física", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.area === "EF");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(1);
  });

  it("debe retornar temas para destrezas de ECA", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.area === "ECA");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(1);
  });

  it("todas las destrezas deben tener al menos un tema sugerido", () => {
    for (const destreza of TODAS_LAS_DESTREZAS) {
      const temas = obtenerTemasSugeridos(destreza);
      expect(temas.length).toBeGreaterThanOrEqual(1);
    }
  });
});
