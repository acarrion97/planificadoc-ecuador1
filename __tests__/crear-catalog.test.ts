/**
 * Catálogo del hub de creación `/crear` (tareas 2.7 y 2.8).
 *
 * 2.7 — los 12 módulos aparecen en `/crear` agrupados en su categoría.
 * 2.8 — cada módulo apunta a una ruta real y estática: los flujos arrancan en
 *       su estado inicial y no exigen parámetros nuevos (ningún segmento `[id]`).
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { CATALOGO_MODULOS, CATEGORIAS, TOTAL_MODULOS } from "../lib/crear-catalog";

/** Resuelve la ruta del catálogo a su pantalla dentro de `app/`. */
function archivoDeRuta(ruta: string): string | null {
  if (ruta === "/") return path.join("app", "(tabs)", "index.tsx");
  const relativa = path.join("app", ruta.replace(/^\//, ""));
  if (fs.existsSync(`${relativa}.tsx`)) return `${relativa}.tsx`;
  if (fs.existsSync(path.join(relativa, "index.tsx"))) return path.join(relativa, "index.tsx");
  return null;
}

describe("catálogo de /crear (2.7)", () => {
  it("define los 12 módulos del catálogo", () => {
    expect(TOTAL_MODULOS).toBe(12);
    expect(CATALOGO_MODULOS).toHaveLength(12);
  });

  it("agrupa los 12 módulos en las 6 categorías del spec", () => {
    expect(CATEGORIAS.map((c) => c.id)).toEqual([
      "aula",
      "area",
      "programaciones",
      "curriculo",
      "niveles",
      "contextuales",
    ]);
    // Cada categoría del spec tiene al menos un módulo.
    for (const categoria of CATEGORIAS) {
      const ids = CATALOGO_MODULOS.filter((m) => m.categoria === categoria.id).map((m) => m.id);
      expect(ids.length, `categoría vacía: ${categoria.id}`).toBeGreaterThan(0);
    }
  });

  it("coloca cada módulo en la categoría que le corresponde", () => {
    const agrupado = Object.fromEntries(
      CATEGORIAS.map((c) => [c.id, CATALOGO_MODULOS.filter((m) => m.categoria === c.id).map((m) => m.id)]),
    );

    expect(agrupado.aula).toEqual(["diario", "semanal"]);
    expect(agrupado.area).toEqual(["pca", "pct"]);
    expect(agrupado.programaciones).toEqual(["cnc", "proyecto", "bt"]);
    expect(agrupado.curriculo).toEqual(["cxc"]);
    expect(agrupado.niveles).toEqual(["inicial", "preparatoria"]);
    expect(agrupado.contextuales).toEqual(["adaptacion", "diagnostico"]);

    // Sin duplicados ni módulos huérfanos.
    const ids = CATALOGO_MODULOS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const categoriasValidas = new Set(CATEGORIAS.map((c) => c.id));
    expect(ids.every((_, i) => categoriasValidas.has(CATALOGO_MODULOS[i].categoria))).toBe(true);
  });
});

describe("rutas del catálogo (2.8)", () => {
  it("apunta a pantallas que existen en app/", () => {
    for (const modulo of CATALOGO_MODULOS) {
      const archivo = archivoDeRuta(modulo.ruta);
      expect(archivo, `ruta sin pantalla: ${modulo.ruta}`).not.toBeNull();
      expect(archivo && fs.existsSync(archivo)).toBe(true);
    }
  });

  it("usa rutas estáticas (sin segmentos dinámicos ni query obligatoria)", () => {
    for (const modulo of CATALOGO_MODULOS) {
      expect(modulo.ruta.startsWith("/")).toBe(true);
      expect(modulo.ruta).not.toContain("["); // ningún módulo exige params
      expect(modulo.ruta).not.toContain("?");
    }
  });

  it("solo «Adaptación curricular» requiere contexto de origen", () => {
    const conContexto = CATALOGO_MODULOS.filter((m) => m.requiereContexto);
    expect(conContexto.map((m) => m.id)).toEqual(["adaptacion"]);
  });
});
