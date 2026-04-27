import { describe, it, expect } from "vitest";
import { obtenerTemasSugeridos } from "../data/temas-sugeridos";
import { TODAS_LAS_DESTREZAS } from "../data";
import { Destreza, TemaSugerido, EstructuraClase } from "../data/types";

describe("Temas Sugeridos", () => {
  it("debe retornar temas para destrezas de Matematica Basica Elemental (M.2.1.x)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(2);
  });

  it("debe retornar temas para destrezas de Matematica Basica Media (M.3.1.x)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.3.1.1");
    expect(destreza).toBeDefined();
    const temas = obtenerTemasSugeridos(destreza!);
    expect(temas.length).toBeGreaterThanOrEqual(2);
  });

  it("cada tema debe tener la estructura completa de 3 fases (anticipacion, desarrollo, cierre)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    const temas = obtenerTemasSugeridos(destreza!);

    for (const tema of temas) {
      // Campos basicos
      expect(tema.id).toBeTruthy();
      expect(tema.titulo).toBeTruthy();
      expect(tema.descripcionBreve).toBeTruthy();
      expect(tema.objetivoClase).toBeTruthy();
      expect(tema.recursos.length).toBeGreaterThan(0);
      expect(tema.evaluacionFormativa).toBeTruthy();

      // Estructura de 4 fases ERCA
      const { estructura } = tema;
      expect(estructura).toBeDefined();

      // Experiencia (10 min)
      expect(estructura.experiencia).toBeDefined();
      expect(estructura.experiencia.titulo).toBeTruthy();
      expect(estructura.experiencia.duracion).toBeTruthy();
      expect(estructura.experiencia.actividades.length).toBeGreaterThan(0);

      // Reflexion (10 min)
      expect(estructura.reflexion).toBeDefined();
      expect(estructura.reflexion.titulo).toBeTruthy();
      expect(estructura.reflexion.duracion).toBeTruthy();
      expect(estructura.reflexion.actividades.length).toBeGreaterThan(0);

      // Conceptualizacion (15 min)
      expect(estructura.conceptualizacion).toBeDefined();
      expect(estructura.conceptualizacion.titulo).toBeTruthy();
      expect(estructura.conceptualizacion.duracion).toBeTruthy();
      expect(estructura.conceptualizacion.actividades.length).toBeGreaterThan(0);

      // Aplicacion (10 min)
      expect(estructura.aplicacion).toBeDefined();
      expect(estructura.aplicacion.titulo).toBeTruthy();
      expect(estructura.aplicacion.duracion).toBeTruthy();
      expect(estructura.aplicacion.actividades.length).toBeGreaterThan(0);
    }
  });

  it("la duracion total debe ser 45 minutos (10 + 10 + 15 + 10)", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    const temas = obtenerTemasSugeridos(destreza!);

    for (const tema of temas) {
      expect(tema.estructura.experiencia.duracion).toBe("10 minutos");
      expect(tema.estructura.reflexion.duracion).toBe("10 minutos");
      expect(tema.estructura.conceptualizacion.duracion).toBe("15 minutos");
      expect(tema.estructura.aplicacion.duracion).toBe("10 minutos");
    }
  });

  it("cada tema debe tener un ID unico", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.3.1.1");
    const temas = obtenerTemasSugeridos(destreza!);
    const ids = temas.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("debe generar temas genericos para destrezas sin temas especificos", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.4.2.1");
    if (destreza) {
      const temas = obtenerTemasSugeridos(destreza);
      expect(temas.length).toBeGreaterThanOrEqual(1);
      for (const tema of temas) {
        expect(tema.estructura.experiencia.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.reflexion.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.conceptualizacion.actividades.length).toBeGreaterThan(0);
        expect(tema.estructura.aplicacion.actividades.length).toBeGreaterThan(0);
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

  it("debe retornar temas para destrezas de Educacion Fisica", () => {
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

  it("las actividades deben usar verbos en infinitivo", () => {
    const destreza = TODAS_LAS_DESTREZAS.find((d) => d.codigo === "M.2.1.1");
    const temas = obtenerTemasSugeridos(destreza!);

    for (const tema of temas) {
      // Verificar que las actividades comienzan con verbo en infinitivo (terminan en ar, er, ir)
      const todasActividades = [
        ...tema.estructura.experiencia.actividades,
        ...tema.estructura.reflexion.actividades,
        ...tema.estructura.conceptualizacion.actividades,
        ...tema.estructura.aplicacion.actividades,
      ];
      for (const act of todasActividades) {
        // La primera palabra debe ser un verbo en infinitivo
        const primeraPalabra = act.split(" ")[0].toLowerCase();
        const esInfinitivo = primeraPalabra.endsWith("ar") || primeraPalabra.endsWith("er") || primeraPalabra.endsWith("ir");
        expect(esInfinitivo).toBe(true);
      }
    }
  });
});
