import { describe, expect, it } from "vitest";
import { TODAS_LAS_DESTREZAS } from "../data";
import type { Destreza } from "../data/types";
import {
  codigosDeDcds,
  conOficial,
  indicadoresOficiales,
  indicadoresOficialesTexto,
  objetivosOficiales,
  objetivosOficialesTexto,
} from "../lib/oficiales-curriculares";

/** Una destreza real del catálogo, con objetivos e indicadores cargados. */
const destrezaEjemplo: Destreza =
  TODAS_LAS_DESTREZAS.find(
    (d) => d.objetivos.length > 0 && d.indicadoresEvaluacion.length > 0
  ) ?? TODAS_LAS_DESTREZAS[0];

/** Dos destrezas distintas que comparten al menos un objetivo oficial. */
const parConObjetivoComun: Destreza[] = (() => {
  const porObjetivo = new Map<string, Destreza[]>();
  for (const d of TODAS_LAS_DESTREZAS) {
    const clave = d.objetivos[0];
    if (!clave) continue;
    const lista = porObjetivo.get(clave) ?? [];
    lista.push(d);
    porObjetivo.set(clave, lista);
  }
  for (const lista of porObjetivo.values()) {
    if (lista.length >= 2) return lista;
  }
  return [];
})();

describe("Textos oficiales del catálogo MinEduc", () => {
  describe("codigosDeDcds", () => {
    it("acepta códigos sueltos y objetos { codigo }, sin repetir ni vacíos", () => {
      expect(
        codigosDeDcds([
          "M.2.1.1",
          { codigo: "M.3.1.1" },
          "M.2.1.1",
          "   ",
          { codigo: null },
          null,
          undefined,
          "",
        ])
      ).toEqual(["M.2.1.1", "M.3.1.1"]);
    });

    it("devuelve una lista vacía cuando no hay DCDs", () => {
      expect(codigosDeDcds([])).toEqual([]);
      expect(codigosDeDcds(null)).toEqual([]);
      expect(codigosDeDcds(undefined)).toEqual([]);
    });
  });

  describe("objetivosOficiales", () => {
    it("devuelve los objetivos del catálogo para la DCD indicada", () => {
      expect(objetivosOficiales([destrezaEjemplo.codigo])).toEqual(
        destrezaEjemplo.objetivos
      );
    });

    it("acepta las DCD como objetos { codigo } (formato de los formularios)", () => {
      expect(
        objetivosOficiales([{ codigo: destrezaEjemplo.codigo }])
      ).toEqual(destrezaEjemplo.objetivos);
    });

    it("no repite un objetivo que comparten varias DCD", () => {
      if (parConObjetivoComun.length < 2) return;
      const compartido = parConObjetivoComun[0].objetivos[0];
      const objetivos = objetivosOficiales([
        parConObjetivoComun[0].codigo,
        parConObjetivoComun[1].codigo,
      ]);
      expect(objetivos).toContain(compartido);
      expect(objetivos.filter((o) => o === compartido)).toHaveLength(1);
    });

    it("devuelve [] para un código que no está en el catálogo", () => {
      expect(objetivosOficiales(["NO.EXISTE"])).toEqual([]);
      expect(objetivosOficiales([])).toEqual([]);
      expect(objetivosOficiales(null)).toEqual([]);
    });
  });

  describe("indicadoresOficiales", () => {
    it("devuelve los indicadores de evaluación del catálogo", () => {
      expect(indicadoresOficiales([destrezaEjemplo.codigo])).toEqual(
        destrezaEjemplo.indicadoresEvaluacion
      );
    });

    it("devuelve [] cuando la DCD no existe", () => {
      expect(indicadoresOficiales(["NO.EXISTE"])).toEqual([]);
    });
  });

  describe("objetivosOficialesTexto / indicadoresOficialesTexto", () => {
    it("une los textos con salto de línea", () => {
      expect(
        objetivosOficialesTexto([destrezaEjemplo.codigo])
      ).toBe(destrezaEjemplo.objetivos.join("\n"));
      expect(
        indicadoresOficialesTexto([destrezaEjemplo.codigo])
      ).toBe(destrezaEjemplo.indicadoresEvaluacion.join("\n"));
    });

    it("devuelve cadena vacía cuando el catálogo no trae nada", () => {
      expect(objetivosOficialesTexto(["NO.EXISTE"])).toBe("");
      expect(indicadoresOficialesTexto([])).toBe("");
    });
  });

  describe("conOficial", () => {
    it("prefiere el texto oficial sobre el redactado por la IA", () => {
      expect(conOficial(["O.M.1.1. Objetivo oficial."], "Texto de la IA")).toBe(
        "O.M.1.1. Objetivo oficial."
      );
    });

    it("usa el respaldo cuando el catálogo no trae texto", () => {
      expect(conOficial([], "Texto de la IA")).toBe("Texto de la IA");
      expect(conOficial([], "  ")).toBe("");
      expect(conOficial([], undefined)).toBe("");
    });
  });
});
