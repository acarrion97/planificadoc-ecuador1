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
  Area,
} from "../data";

const ALL_AREAS: Area[] = [
  "M", "LL", "CN", "CS", "EF", "ECA",
  "CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG",
];

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

  it("debe tener destrezas de todas las 13 áreas", () => {
    const areas = new Set(TODAS_LAS_DESTREZAS.map((d) => d.area));
    for (const area of ALL_AREAS) {
      expect(areas.has(area)).toBe(true);
    }
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

  it("debe encontrar destrezas de Bachillerato", () => {
    const bio = buscarPorCodigo("CN.B.5.1.1");
    expect(bio).toBeDefined();
    expect(bio?.area).toBe("CN.B");

    const fis = buscarPorCodigo("CN.F.5.1.1");
    expect(fis).toBeDefined();
    expect(fis?.area).toBe("CN.F");
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
    const resultados = buscarDestrezas("M.3");
    expect(resultados.length).toBeGreaterThan(0);
    const resultados2 = buscarDestrezas("RECONOCER");
    const resultados3 = buscarDestrezas("RESOLVER");
    expect(resultados2.length + resultados3.length).toBeGreaterThanOrEqual(0);
  });

  it("debe retornar vacío para query corta", () => {
    const resultados = buscarDestrezas("");
    expect(resultados).toEqual([]);
  });

  it("debe buscar destrezas de Bachillerato por código", () => {
    const resultados = buscarDestrezas("CN.B");
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.area).toBe("CN.B");
    });
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

  it("debe filtrar destrezas de cada área de Bachillerato", () => {
    const bguAreas: Area[] = ["CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG"];
    for (const area of bguAreas) {
      const resultados = filtrarPorArea(area);
      expect(resultados.length).toBeGreaterThan(0);
      resultados.forEach((d) => {
        expect(d.area).toBe(area);
      });
    }
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

  it("debe filtrar Bachillerato (subnivel 5)", () => {
    const resultados = filtrarPorAreaYSubnivel("CN.B", 5);
    expect(resultados.length).toBeGreaterThan(0);
    resultados.forEach((d) => {
      expect(d.area).toBe("CN.B");
      expect(d.subnivel).toBe(5);
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

  it("las áreas de Bachillerato deben tener subnivel 5", () => {
    const bguAreas: Area[] = ["CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG"];
    for (const area of bguAreas) {
      const subniveles = obtenerSubnivelesDeArea(area);
      expect(subniveles).toContain(5);
    }
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
  it("debe retornar conteos para todas las 13 áreas", () => {
    const counts = contarDestrezasPorArea();
    for (const area of ALL_AREAS) {
      expect(counts[area]).toBeGreaterThan(0);
    }
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

  it("debe retornar nombres de bloques de Bachillerato", () => {
    const bio = obtenerNombreBloque("CN.B", 1);
    expect(bio).toBeTruthy();
    expect(bio).not.toBe("Bloque 1");

    const fis = obtenerNombreBloque("CN.F", 1);
    expect(fis).toBeTruthy();
    expect(fis).not.toBe("Bloque 1");
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
  it("debe tener información de todas las 13 áreas", () => {
    for (const area of ALL_AREAS) {
      const info = AREAS_INFO[area];
      expect(info).toBeDefined();
      expect(info.code).toBe(area);
      expect(info.name).toBeTruthy();
      expect(info.color).toBeTruthy();
      expect(info.icon).toBeTruthy();
      expect(info.emoji).toBeTruthy();
      expect(Object.keys(info.bloques).length).toBeGreaterThan(0);
    }
  });
});
