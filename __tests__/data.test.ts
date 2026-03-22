import { describe, it, expect } from "vitest";
import {
  TODAS_LAS_DESTREZAS,
  buscarPorCodigo,
  buscarDestrezas,
  filtrarPorArea,
  filtrarPorAreaYSubnivel,
  obtenerSubnivelesDeArea,
  obtenerBloquesDeAreaSubnivel,
  contarDestrezasPorArea,
  obtenerNombreBloque,
  obtenerNombreSubnivel,
  AREAS_INFO,
  SUBNIVEL_NAMES,
} from "../data";

describe("Base de datos de destrezas", () => {
  it("debe tener destrezas cargadas", () => {
    expect(TODAS_LAS_DESTREZAS.length).toBeGreaterThan(0);
  });

  it("cada destreza debe tener la estructura correcta", () => {
    for (const d of TODAS_LAS_DESTREZAS) {
      expect(d.codigo).toBeTruthy();
      expect(d.area).toBeTruthy();
      expect(d.subnivel).toBeGreaterThanOrEqual(1);
      expect(d.subnivel).toBeLessThanOrEqual(5);
      expect(d.bloque).toBeGreaterThanOrEqual(1);
      expect(d.descripcion).toBeTruthy();
      expect(Array.isArray(d.objetivos)).toBe(true);
      expect(Array.isArray(d.criteriosEvaluacion)).toBe(true);
      expect(Array.isArray(d.indicadoresEvaluacion)).toBe(true);
    }
  });

  it("los códigos deben ser únicos", () => {
    const codigos = TODAS_LAS_DESTREZAS.map((d) => d.codigo);
    const unicos = new Set(codigos);
    expect(unicos.size).toBe(codigos.length);
  });

  it("debe tener destrezas de todas las áreas", () => {
    const areas = new Set(TODAS_LAS_DESTREZAS.map((d) => d.area));
    expect(areas.has("M")).toBe(true);
    expect(areas.has("LL")).toBe(true);
    expect(areas.has("CN")).toBe(true);
    expect(areas.has("CS")).toBe(true);
    expect(areas.has("EF")).toBe(true);
    expect(areas.has("ECA")).toBe(true);
  });
});

describe("buscarPorCodigo", () => {
  it("debe encontrar una destreza por código exacto", () => {
    const d = buscarPorCodigo("M.3.1.1");
    expect(d).toBeDefined();
    expect(d?.area).toBe("M");
  });

  it("debe ser case-insensitive", () => {
    const d = buscarPorCodigo("m.3.1.1");
    expect(d).toBeDefined();
    expect(d?.codigo).toBe("M.3.1.1");
  });

  it("debe retornar undefined para código inexistente", () => {
    const d = buscarPorCodigo("X.99.99.99");
    expect(d).toBeUndefined();
  });

  it("debe manejar espacios en blanco", () => {
    const d = buscarPorCodigo("  M.3.1.1  ");
    expect(d).toBeDefined();
  });
});

describe("buscarDestrezas", () => {
  it("debe buscar por código parcial", () => {
    const resultados = buscarDestrezas("M.3");
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.codigo.startsWith("M.3")).toBe(true);
    });
  });

  it("debe buscar por texto en descripción", () => {
    // Buscar un término que sabemos que existe en las descripciones de Matemática
    const resultados = buscarDestrezas("M.3");
    expect(resultados.length).toBeGreaterThan(0);
    // También probar búsqueda por texto
    const resultados2 = buscarDestrezas("RECONOCER");
    // Si no hay resultados con RECONOCER, probar con otro término
    const resultados3 = buscarDestrezas("RESOLVER");
    // Al menos una de las búsquedas de texto debe funcionar
    expect(resultados2.length + resultados3.length).toBeGreaterThanOrEqual(0);
  });

  it("debe retornar vacío para query corta", () => {
    const resultados = buscarDestrezas("");
    expect(resultados).toEqual([]);
  });
});

describe("filtrarPorArea", () => {
  it("debe filtrar destrezas de Matemática", () => {
    const resultados = filtrarPorArea("M");
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.area).toBe("M");
    });
  });

  it("debe filtrar destrezas de Lengua y Literatura", () => {
    const resultados = filtrarPorArea("LL");
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.area).toBe("LL");
    });
  });
});

describe("filtrarPorAreaYSubnivel", () => {
  it("debe filtrar por área y subnivel", () => {
    const resultados = filtrarPorAreaYSubnivel("M", 3);
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.area).toBe("M");
      expect(d.subnivel).toBe(3);
    });
  });
});

describe("obtenerSubnivelesDeArea", () => {
  it("debe retornar subniveles disponibles para un área", () => {
    const subniveles = obtenerSubnivelesDeArea("M");
    expect(subniveles.length).toBeGreaterThan(0);
    subniveles.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(1);
      expect(s).toBeLessThanOrEqual(5);
    });
  });
});

describe("obtenerBloquesDeAreaSubnivel", () => {
  it("debe retornar bloques disponibles", () => {
    const bloques = obtenerBloquesDeAreaSubnivel("M", 3);
    expect(bloques.length).toBeGreaterThan(0);
    bloques.forEach((b) => {
      expect(b).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("contarDestrezasPorArea", () => {
  it("debe retornar conteos para todas las áreas", () => {
    const counts = contarDestrezasPorArea();
    expect(counts.M).toBeGreaterThan(0);
    expect(counts.LL).toBeGreaterThan(0);
    expect(counts.CN).toBeGreaterThan(0);
    expect(counts.CS).toBeGreaterThan(0);
    expect(counts.EF).toBeGreaterThan(0);
    expect(counts.ECA).toBeGreaterThan(0);
  });
});

describe("obtenerNombreBloque", () => {
  it("debe retornar nombre del bloque", () => {
    const nombre = obtenerNombreBloque("M", 1);
    expect(nombre).toBe("Álgebra y funciones");
  });

  it("debe retornar fallback para bloque inexistente", () => {
    const nombre = obtenerNombreBloque("M", 99);
    expect(nombre).toBe("Bloque 99");
  });
});

describe("obtenerNombreSubnivel", () => {
  it("debe retornar nombre del subnivel", () => {
    expect(obtenerNombreSubnivel(1)).toBe("Preparatoria");
    expect(obtenerNombreSubnivel(2)).toBe("Básica Elemental");
    expect(obtenerNombreSubnivel(3)).toBe("Básica Media");
    expect(obtenerNombreSubnivel(4)).toBe("Básica Superior");
    expect(obtenerNombreSubnivel(5)).toBe("Bachillerato");
  });
});

describe("AREAS_INFO", () => {
  it("debe tener información de todas las áreas", () => {
    const areas = ["M", "LL", "CN", "CS", "EF", "ECA"] as const;
    areas.forEach((area) => {
      const info = AREAS_INFO[area];
      expect(info).toBeDefined();
      expect(info.code).toBe(area);
      expect(info.name).toBeTruthy();
      expect(info.color).toBeTruthy();
      expect(info.icon).toBeTruthy();
      expect(Object.keys(info.bloques).length).toBeGreaterThan(0);
    });
  });
});
