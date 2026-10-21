import { describe, expect, it } from "vitest";
import {
  bloquesAHtml,
  prepararBloques,
  referenciaDcd,
  separarCodigo,
  tieneCodigo,
} from "../lib/codigos-curriculares";

describe("Códigos curriculares oficiales", () => {
  describe("separarCodigo", () => {
    it("separa el código de un objetivo del catálogo", () => {
      expect(separarCodigo("O.CN.B.5.2. Desarrolla destrezas motoras básicas.")).toEqual({
        codigo: "O.CN.B.5.2",
        texto: "Desarrolla destrezas motoras básicas.",
      });
    });

    it("separa el código de un indicador de evaluación", () => {
      expect(separarCodigo("I.CN.B.5.1.1. Explica el movimiento rectilíneo uniforme.")).toEqual({
        codigo: "I.CN.B.5.1.1",
        texto: "Explica el movimiento rectilíneo uniforme.",
      });
    });

    it("admite objetivo general (OG) y separación sin punto final", () => {
      expect(separarCodigo("OG.ECA.8. Explora el entorno natural.").codigo).toBe("OG.ECA.8");
      expect(separarCodigo("I.LL.2.1.1 Aplica estrategias de lectura.").codigo).toBe("I.LL.2.1.1");
    });

    it("devuelve solo el texto cuando no hay código", () => {
      expect(separarCodigo("Explica las fases del método científico.")).toEqual({
        texto: "Explica las fases del método científico.",
      });
    });

    it("tolera entradas nulas, indefinidas y vacías", () => {
      expect(separarCodigo(undefined)).toEqual({ texto: "" });
      expect(separarCodigo(null)).toEqual({ texto: "" });
      expect(separarCodigo("")).toEqual({ texto: "" });
    });

    it("no trata un texto que empieza con minúscula o sin puntos como código", () => {
      expect(separarCodigo("Orienta la práctica de la destreza motriz.").codigo).toBeUndefined();
      expect(separarCodigo("M.3.1.1. Generar sucesiones con sumas y restas.").codigo).toBeUndefined();
    });
  });

  describe("tieneCodigo", () => {
    it("detecta presencia/ausencia de código", () => {
      expect(tieneCodigo("I.M.3.1.1. Aplica estrategias de cálculo.")).toBe(true);
      expect(tieneCodigo("Aplica estrategias de cálculo.")).toBe(false);
      expect(tieneCodigo(undefined)).toBe(false);
    });
  });

  describe("referenciaDcd", () => {
    it("une códigos únicos con el prefijo DCD", () => {
      expect(referenciaDcd(["M.4.1.1", "M.4.1.1", "M.4.1.2"])).toBe("DCD: M.4.1.1 · M.4.1.2");
    });

    it("acepta un string único y descarta vacíos", () => {
      expect(referenciaDcd("M.4.1.1")).toBe("DCD: M.4.1.1");
      expect(referenciaDcd(["", null, undefined])).toBe("");
      expect(referenciaDcd(undefined)).toBe("");
    });
  });

  describe("prepararBloques", () => {
    it("separa código y texto sin generar referencia DCD", () => {
      const r = prepararBloques(["I.M.3.1.1. Aplica estrategias de cálculo."], "M.3.1.1");
      expect(r.referencia).toBe("");
      expect(r.bloques).toEqual([
        { codigo: "I.M.3.1.1", texto: "Aplica estrategias de cálculo." },
      ]);
    });

    it("agrega la referencia DCD cuando el texto lo redactó la IA", () => {
      const r = prepararBloques(["Aplica estrategias de cálculo."], "M.3.1.1");
      expect(r.referencia).toBe("DCD: M.3.1.1");
      expect(r.bloques).toEqual([{ texto: "Aplica estrategias de cálculo." }]);
    });

    it("agrega la referencia una sola vez para varios textos sin código", () => {
      const r = prepararBloques(["Texto uno.", "I.M.3.1.1. Texto dos."], "M.3.1.1");
      expect(r.referencia).toBe("DCD: M.3.1.1");
      expect(r.bloques).toHaveLength(2);
    });

    it("ignora marcadores de vacío (no generan código ni referencia)", () => {
      for (const vacio of ["—", "___", "No especificado", "Not specified", ""]) {
        const r = prepararBloques([vacio], "M.3.1.1");
        expect(r.bloques).toEqual([]);
        expect(r.referencia).toBe("");
      }
    });

    it("dividir por saltos de línea permite varios indicadores", () => {
      const r = prepararBloques(
        ["I.M.3.1.1. Uno.\nI.M.3.1.2. Dos."],
        "M.3.1.1"
      );
      expect(r.bloques.map((b) => b.codigo)).toEqual(["I.M.3.1.1", "I.M.3.1.2"]);
    });
  });

  describe("bloquesAHtml", () => {
    it("imprime el código en negrita arriba del texto", () => {
      const html = bloquesAHtml(prepararBloques(["I.M.3.1.1. Aplica estrategias."], "M.3.1.1"));
      expect(html).toContain('<div style="font-weight:700;">I.M.3.1.1</div>');
      expect(html).toContain("<div>Aplica estrategias.</div>");
      expect(html.indexOf("I.M.3.1.1")).toBeLessThan(html.indexOf("Aplica estrategias."));
    });

    it("imprime la referencia DCD en su propia línea, antes del texto", () => {
      const html = bloquesAHtml(prepararBloques(["Texto redactado por IA."], "M.4.1.1"));
      expect(html).toContain("DCD: M.4.1.1");
      expect(html.indexOf("DCD:")).toBeLessThan(html.indexOf("Texto redactado por IA."));
      expect(html).not.toContain("font-weight:700;\">DCD");
    });

    it("escapa HTML cuando se pasa la función de escape", () => {
      const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const html = bloquesAHtml(
        prepararBloques(["<b>texto</b>"], "M.3.1.1"),
        esc
      );
      expect(html).toContain("&lt;b&gt;texto&lt;/b&gt;");
      expect(html).not.toContain("<b>texto</b>");
    });
  });
});
