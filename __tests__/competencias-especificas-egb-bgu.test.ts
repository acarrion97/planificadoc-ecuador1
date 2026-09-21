import { describe, it, expect } from "vitest";
import {
  ceDisponibleParaGrados,
  resolverBloquePorGrado,
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
