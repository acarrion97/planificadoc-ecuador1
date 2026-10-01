import { describe, it, expect } from "vitest";
import { buscarEnManual } from "../server/asistente-manual";

describe("asistente virtual: búsqueda en el manual", () => {
  const top = (q: string) => buscarEnManual(q, 3).map((r) => `${r.chunk.capTitulo} ${r.chunk.seccion ?? ""}`).join("|");

  it("encuentra la sección correcta para dudas frecuentes", () => {
    expect(top("cómo contacto a soporte técnico")).toMatch(/soporte/i);
    expect(top("qué es el plan piloto Conecta y nivela")).toMatch(/conecta/i);
    expect(top("cómo creo una adaptación curricular")).toMatch(/adaptaci/i);
  });

  it("sin términos útiles no devuelve resultados", () => {
    expect(buscarEnManual("de la el", 3)).toEqual([]);
  });
});
