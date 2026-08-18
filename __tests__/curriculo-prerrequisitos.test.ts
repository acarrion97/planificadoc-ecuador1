import { describe, it, expect } from "vitest";
import {
  resolverPrerrequisito,
  existeAreaSubnivel,
} from "../lib/curriculo-prerrequisitos";
import { TODAS_LAS_DESTREZAS } from "../data";
import type { Area, Subnivel } from "../data/types";

describe("resolverPrerrequisito — áreas derivadas de Bachillerato", () => {
  // El código de área codifica la jerarquía: CN.F baja a CN, CS.EC baja a CS.
  const casos: Array<[Area, Area]> = [
    ["CN.F", "CN"], // Física → Ciencias Naturales
    ["CN.Q", "CN"], // Química → Ciencias Naturales
    ["CN.B", "CN"], // Biología → Ciencias Naturales
    ["CS.H", "CS"], // Historia → Estudios Sociales
    ["CS.F", "CS"], // Filosofía → Estudios Sociales
    ["CS.EC", "CS"], // Educación para la Ciudadanía → Estudios Sociales
  ];

  it.each(casos)("%s@5 resuelve a %s@4", (area, esperada) => {
    expect(resolverPrerrequisito(area, 5)).toEqual({
      area: esperada,
      subnivel: 4,
    });
  });
});

describe("resolverPrerrequisito — Preparatoria es currículo integrado", () => {
  // El subnivel 1 solo ofrece CAI, así que cualquier área de Básica Elemental
  // arrastra de ahí. No es una regla específica de Lengua.
  const areasElemental: Area[] = ["LL", "M", "CN", "CS", "ECA", "EF", "EFL"];

  it.each(areasElemental)("%s@2 resuelve a CAI@1", (area) => {
    expect(resolverPrerrequisito(area, 2)).toEqual({ area: "CAI", subnivel: 1 });
  });

  it("CAI@2 también resuelve a CAI@1", () => {
    expect(resolverPrerrequisito("CAI", 2)).toEqual({
      area: "CAI",
      subnivel: 1,
    });
  });
});

describe("resolverPrerrequisito — caso general", () => {
  it("mantiene el área y baja un subnivel", () => {
    expect(resolverPrerrequisito("LL", 4)).toEqual({ area: "LL", subnivel: 3 });
    expect(resolverPrerrequisito("M", 3)).toEqual({ area: "M", subnivel: 2 });
    expect(resolverPrerrequisito("LL", 5)).toEqual({ area: "LL", subnivel: 4 });
  });

  it("8.° EGB (Básica Superior) arrastra de Básica Media", () => {
    expect(resolverPrerrequisito("M", 4)).toEqual({ area: "M", subnivel: 3 });
  });
});

describe("resolverPrerrequisito — sin prerrequisito definido", () => {
  it("EG@5 devuelve null: Emprendimiento no existe en Básica Superior", () => {
    expect(resolverPrerrequisito("EG", 5)).toBeNull();
  });

  it("no inventa un área sustituta para EG", () => {
    // Si alguna vez devolviera algo, sería una equivalencia inventada.
    const resultado = resolverPrerrequisito("EG", 5);
    expect(resultado).not.toEqual({ area: "M", subnivel: 4 });
    expect(resultado).not.toEqual({ area: "CS", subnivel: 4 });
  });

  it("Preparatoria e Inicial quedan fuera del alcance", () => {
    expect(resolverPrerrequisito("CAI", 1)).toBeNull();
    expect(resolverPrerrequisito("CAI", 0)).toBeNull();
    expect(resolverPrerrequisito("INI", 0)).toBeNull();
    expect(resolverPrerrequisito("INI", -1)).toBeNull();
  });
});

describe("resolverPrerrequisito — contrato contra la cobertura real del catálogo", () => {
  /** Todos los pares (área, subnivel) que el catálogo realmente ofrece. */
  const paresDelCatalogo: Array<[Area, Subnivel]> = (() => {
    const vistos = new Set<string>();
    const pares: Array<[Area, Subnivel]> = [];
    for (const d of TODAS_LAS_DESTREZAS) {
      const clave = `${d.area}|${d.subnivel}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      pares.push([d.area, d.subnivel]);
    }
    return pares;
  })();

  it("el catálogo tiene pares suficientes para que el barrido sea significativo", () => {
    expect(paresDelCatalogo.length).toBeGreaterThan(20);
  });

  it("todo par del catálogo resuelve a un par existente o a null explícito", () => {
    const invalidos: string[] = [];

    for (const [area, subnivel] of paresDelCatalogo) {
      const resultado = resolverPrerrequisito(area, subnivel);
      if (resultado === null) continue; // ausencia informada, no inventada
      if (!existeAreaSubnivel(resultado.area, resultado.subnivel)) {
        invalidos.push(
          `${area}@${subnivel} → ${resultado.area}@${resultado.subnivel} (sin destrezas en el catálogo)`
        );
      }
    }

    expect(invalidos).toEqual([]);
  });

  it("nunca devuelve el mismo par que recibe", () => {
    for (const [area, subnivel] of paresDelCatalogo) {
      const resultado = resolverPrerrequisito(area, subnivel);
      if (!resultado) continue;
      expect(`${resultado.area}@${resultado.subnivel}`).not.toBe(
        `${area}@${subnivel}`
      );
    }
  });
});

describe("existeAreaSubnivel", () => {
  it("refleja la cobertura real del catálogo", () => {
    expect(existeAreaSubnivel("LL", 2)).toBe(true);
    expect(existeAreaSubnivel("CAI", 1)).toBe(true);
    expect(existeAreaSubnivel("CN.F", 5)).toBe(true);
    // Huecos reales: las áreas de Bachillerato no bajan, y LL no llega a Preparatoria.
    expect(existeAreaSubnivel("CN.F", 4)).toBe(false);
    expect(existeAreaSubnivel("EG", 4)).toBe(false);
    expect(existeAreaSubnivel("LL", 1)).toBe(false);
  });
});
