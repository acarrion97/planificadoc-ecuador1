import { describe, it, expect, vi, beforeEach } from "vitest";

const filaFake = {
  id: 1,
  sessionId: "sesion-1",
  codigoDCD: "CN.2.1.1",
  subnivel: 2,
  grado: 3,
  gradoMaximo: 4,
  descripcionDCD: "DCD oficial",
  indicadorOriginal: "indicador oficial",
  dcdGraduada: "Versión graduada para 3.º EGB",
  indicadorGraduado: "indicador graduado",
  procesoCognitivo: "Comprensión",
  estado: "generado",
  version: 1,
  aiResult: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("../server/db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "../server/db";
import { dcdDesagregacionesRouter } from "../server/dcd-desagregacion-router";

function fakeDbConFilas(filas: unknown[] | (() => Promise<unknown[]>)) {
  const resolveFilas = typeof filas === "function" ? filas : () => Promise.resolve(filas);
  return {
    execute: async () => {},
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => resolveFilas(),
          orderBy: () => resolveFilas(),
        }),
      }),
    }),
  };
}

describe("Router desagregaciones: reutilización", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("DCD+grado existente devuelve la fila guardada (no regenera)", async () => {
    (getDb as any).mockResolvedValue(fakeDbConFilas([filaFake]));
    const caller = dcdDesagregacionesRouter.createCaller({} as any);
    const filas = await caller.get({ sessionId: "s1", codigoDCD: "CN.2.1.1", grado: 3 });
    expect(filas.length).toBe(1);
    expect(filas[0].dcdGraduada).toBe("Versión graduada para 3.º EGB");
  });

  it("DCD+grado faltante devuelve [] (el panel ofrece generar)", async () => {
    (getDb as any).mockResolvedValue(null);
    const caller = dcdDesagregacionesRouter.createCaller({} as any);
    const filas = await caller.get({ sessionId: "s1", codigoDCD: "CN.2.1.1", grado: 3 });
    expect(filas).toEqual([]);
  });

  it("get sin grado devuelve el ladder completo para el subnivel", async () => {
    (getDb as any).mockResolvedValue(fakeDbConFilas([filaFake]));
    const caller = dcdDesagregacionesRouter.createCaller({} as any);
    const filas = await caller.get({ sessionId: "s1", codigoDCD: "CN.2.1.1" });
    expect(filas.length).toBeGreaterThan(0);
  });

  it("validación: sessionId requerido", async () => {
    (getDb as any).mockResolvedValue(null);
    const caller = dcdDesagregacionesRouter.createCaller({} as any);
    await expect(caller.get({ codigoDCD: "CN.2.1.1" } as any)).rejects.toThrow();
  });
});