import { describe, it, expect } from "vitest";
import {
  ceDisponibleParaGrados,
  resolverBloquePorGrado,
  fusionarBloquesPorGrado,
  completarBloquesFaltantes,
  gradosDeNivel,
  nivelesDeMateria,
} from "../data/competencias-especificas-egb-bgu";

const MATERIA_ID = "matematica";
const CE_CODIGO = "CE.M.4.1";
const GRADOS_SUPERIOR = ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"];

describe("ceDisponibleParaGrados", () => {
  it("es válida cuando la CE cubre todos los grados solicitados (CE.M.4.1, SUPERIOR)", () => {
    const resultado = ceDisponibleParaGrados(MATERIA_ID, CE_CODIGO, GRADOS_SUPERIOR);
    expect(resultado.valido).toBe(true);
    expect(resultado.gradosNoCubiertos).toEqual([]);
  });

  it("reporta el/los grado(s) no cubiertos cuando uno no pertenece a la CE", () => {
    const resultado = ceDisponibleParaGrados(MATERIA_ID, CE_CODIGO, [
      "OCTAVO GRADO",
      "SEXTO GRADO",
    ]);
    expect(resultado.valido).toBe(false);
    expect(resultado.gradosNoCubiertos).toEqual(["SEXTO GRADO"]);
  });

  it("no es válida cuando la materia no existe", () => {
    const resultado = ceDisponibleParaGrados("materia-inexistente", CE_CODIGO, GRADOS_SUPERIOR);
    expect(resultado.valido).toBe(false);
    expect(resultado.gradosNoCubiertos).toEqual(GRADOS_SUPERIOR);
  });

  it("no es válida cuando la CE no existe en la materia", () => {
    const resultado = ceDisponibleParaGrados(MATERIA_ID, "CE.M.9.99", GRADOS_SUPERIOR);
    expect(resultado.valido).toBe(false);
    expect(resultado.gradosNoCubiertos).toEqual(GRADOS_SUPERIOR);
  });
});

describe("resolverBloquePorGrado", () => {
  it("resuelve indicadores y saberes reales para los 3 grados de CE.M.4.1 (SUPERIOR)", () => {
    const bloques = resolverBloquePorGrado(MATERIA_ID, CE_CODIGO, GRADOS_SUPERIOR);

    expect(Object.keys(bloques).sort()).toEqual([...GRADOS_SUPERIOR].sort());

    const octavo = bloques["OCTAVO GRADO"];
    expect(octavo.indicadores.length).toBeGreaterThan(0);
    expect(octavo.indicadores[0]).toContain("I.M.4.1.1");
    expect(octavo.declarativos).toContain(
      "M.4.1.d.1. Conjunto de números enteros (ℤ) y relaciones de orden."
    );
    expect(octavo.procedimentales.length).toBeGreaterThan(0);
    expect(octavo.actitudinales.length).toBeGreaterThan(0);

    const noveno = bloques["NOVENO GRADO"];
    const decimo = bloques["DÉCIMO GRADO"];
    // Cada grado tiene su propio bloque de saberes (progresión real del MESOCURRICULUM,
    // no el mismo contenido repetido para los 3 grados).
    expect(noveno.declarativos).not.toEqual(octavo.declarativos);
    expect(decimo.declarativos).not.toEqual(noveno.declarativos);
  });

  it("omite del resultado un grado que la CE no cubre", () => {
    const bloques = resolverBloquePorGrado(MATERIA_ID, CE_CODIGO, [
      "OCTAVO GRADO",
      "SEXTO GRADO",
    ]);
    expect(Object.keys(bloques)).toEqual(["OCTAVO GRADO"]);
  });

  it("devuelve un objeto vacío cuando el subnivel/CE no existe", () => {
    expect(resolverBloquePorGrado(MATERIA_ID, "CE.M.9.99", GRADOS_SUPERIOR)).toEqual({});
    expect(resolverBloquePorGrado("materia-inexistente", CE_CODIGO, GRADOS_SUPERIOR)).toEqual({});
  });
});

describe("fusionarBloquesPorGrado", () => {
  // Caso real reportado: Ciencias Naturales, CE.CN.4.1 (la célula) y
  // CE.CN.4.5 (salud) cubren los mismos 3 grados de SUPERIOR con contenido
  // propio y no superpuesto — el documento final debe desarrollar ambas,
  // no solo la primera.
  const MATERIA_CN = "ciencias-naturales";
  const CE_CELULA = "CE.CN.4.1";
  const CE_SALUD = "CE.CN.4.5";
  const GRADOS_CN = ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"];

  it("incluye, para cada grado, los indicadores y saberes de TODAS las CE seleccionadas (no solo la primera)", () => {
    const soloCelula = resolverBloquePorGrado(MATERIA_CN, CE_CELULA, GRADOS_CN);
    const soloSalud = resolverBloquePorGrado(MATERIA_CN, CE_SALUD, GRADOS_CN);
    const fusionado = fusionarBloquesPorGrado(MATERIA_CN, [CE_CELULA, CE_SALUD], GRADOS_CN);

    for (const grado of GRADOS_CN) {
      for (const indicador of soloCelula[grado].indicadores) {
        expect(fusionado[grado].indicadores).toContain(indicador);
      }
      for (const indicador of soloSalud[grado].indicadores) {
        expect(fusionado[grado].indicadores).toContain(indicador);
      }
      for (const declarativo of [...soloCelula[grado].declarativos, ...soloSalud[grado].declarativos]) {
        expect(fusionado[grado].declarativos).toContain(declarativo);
      }
    }

    // Regresión explícita del bug: con el `break` original, la segunda CE
    // (CE.CN.4.5) quedaba totalmente descartada de octavo grado.
    expect(fusionado["OCTAVO GRADO"].indicadores).toContain(
      "I.CN.4.5.1. Analiza la estructura y funciones del cuerpo humano (tejidos, órganos, aparatos y sistemas), relacionándolas con las funciones vitales de nutrición, relación y reproducción, para comprender su importancia en el mantenimiento de la salud"
    );
  });

  it("no duplica entradas exactamente iguales cuando la misma CE aparece más de una vez", () => {
    const soloCelula = resolverBloquePorGrado(MATERIA_CN, CE_CELULA, GRADOS_CN);
    const fusionado = fusionarBloquesPorGrado(MATERIA_CN, [CE_CELULA, CE_CELULA], GRADOS_CN);
    for (const grado of GRADOS_CN) {
      expect(fusionado[grado].indicadores).toEqual(soloCelula[grado].indicadores);
    }
  });

  it("una CE que no cubre un grado no aporta contenido para ese grado, sin romper la fusión de las demás", () => {
    const fusionado = fusionarBloquesPorGrado(MATERIA_ID, [CE_CODIGO], [
      "OCTAVO GRADO",
      "SEXTO GRADO",
    ]);
    expect(fusionado["OCTAVO GRADO"].indicadores.length).toBeGreaterThan(0);
    expect(fusionado["SEXTO GRADO"]).toEqual({
      indicadores: [],
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    });
  });
});

describe("completarBloquesFaltantes", () => {
  const CE_CODIGO = "CE.M.4.1";
  const GRADOS_SUPERIOR = ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"];

  it("resuelve un grado agregado después que las CE ya seleccionadas siguen cubriendo (bug de bloquesPorGrado no sincronizado)", () => {
    // Docente elige 2 grados y una CE que los cubre.
    const bloquesIniciales = fusionarBloquesPorGrado(MATERIA_ID, [CE_CODIGO], [
      "OCTAVO GRADO",
      "NOVENO GRADO",
    ]);

    // Luego agrega DÉCIMO GRADO, que la misma CE también cubre válidamente
    // (no invalida la CE, así que el efecto de depuración no dispara).
    const resultado = completarBloquesFaltantes(
      MATERIA_ID,
      [CE_CODIGO],
      GRADOS_SUPERIOR,
      bloquesIniciales
    );

    expect(Object.keys(resultado).sort()).toEqual([...GRADOS_SUPERIOR].sort());
    expect(resultado["DÉCIMO GRADO"].indicadores.length).toBeGreaterThan(0);
    expect(resultado["DÉCIMO GRADO"]).toEqual(
      resolverBloquePorGrado(MATERIA_ID, CE_CODIGO, GRADOS_SUPERIOR)["DÉCIMO GRADO"]
    );
  });

  it("no toca (ni resetea) los grados que ya tenían un bloque, incluida una edición manual del docente", () => {
    const bloquesConEdicionManual = {
      "OCTAVO GRADO": {
        indicadores: ["EDITADO A MANO"],
        declarativos: [],
        procedimentales: [],
        actitudinales: [],
      },
    };

    const resultado = completarBloquesFaltantes(
      MATERIA_ID,
      [CE_CODIGO],
      ["OCTAVO GRADO", "NOVENO GRADO"],
      bloquesConEdicionManual
    );

    // El grado ya presente (editado a mano) no se pisa.
    expect(resultado["OCTAVO GRADO"]).toEqual(bloquesConEdicionManual["OCTAVO GRADO"]);
    // El grado nuevo sí se rellena.
    expect(resultado["NOVENO GRADO"].indicadores.length).toBeGreaterThan(0);
  });

  it("devuelve la misma referencia cuando no falta ningún grado (no dispara renders extra)", () => {
    const bloques = fusionarBloquesPorGrado(MATERIA_ID, [CE_CODIGO], ["OCTAVO GRADO"]);
    const resultado = completarBloquesFaltantes(MATERIA_ID, [CE_CODIGO], ["OCTAVO GRADO"], bloques);
    expect(resultado).toBe(bloques);
  });
});

describe("contexto del catálogo usado por la selección multigrado", () => {
  it("gradosDeNivel(matematica, SUPERIOR) incluye los 3 grados usados en las pruebas anteriores", () => {
    expect(gradosDeNivel(MATERIA_ID, "SUPERIOR")).toEqual(
      expect.arrayContaining(GRADOS_SUPERIOR)
    );
  });

  it("nivelesDeMateria(matematica) incluye SUPERIOR", () => {
    expect(nivelesDeMateria(MATERIA_ID)).toContain("SUPERIOR");
  });
});
