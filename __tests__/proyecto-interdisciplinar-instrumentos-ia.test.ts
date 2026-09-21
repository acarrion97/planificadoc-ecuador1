import { describe, it, expect, vi } from "vitest";

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [
      {
        message: {
          content: JSON.stringify({
            instrumentos: [
              { id: "a1", instrumento: "Lista de cotejo: fuentes, tabla de datos, conclusiones", criteriosVinculados: ["LL.3.1.1", "INVENTADO.9.9"] },
              { id: "a2", instrumento: "  Rúbrica analítica: claridad, evidencia, trabajo en equipo  ", criteriosVinculados: [] },
              { id: "no-existe", instrumento: "Debe ignorarse", criteriosVinculados: [] },
              { id: "a3", instrumento: "   ", criteriosVinculados: [] },
            ],
          }),
        },
      },
    ],
  })),
  repairJson: (s: string) => s,
}));

vi.mock("../server/db", () => ({ getDb: vi.fn(async () => null) }));

import { invokeLLM } from "../server/_core/llm";
import { proyectoInterdisciplinarRouter } from "../server/proyecto-interdisciplinar-router";

const caller = () => proyectoInterdisciplinarRouter.createCaller({} as any);

const input = {
  baseCurricular: "destrezas" as const,
  titulo: "Cuidemos el agua",
  productoFinal: "Cartilla informativa",
  elementosCurriculares: [
    { codigo: "LL.3.1.1", nombreArea: "Lengua", descripcion: "Escuchar y comprender textos" },
    { codigo: "CN.3.1.1", nombreArea: "Ciencias Naturales" },
  ],
  actividades: [
    { id: "a1", fase: "planificacion" as const, actividad: "Investigar fuentes sobre el agua" },
    { id: "a2", fase: "gestion" as const, actividad: "Elaborar la cartilla", evidencia: "Borrador" },
    { id: "a3", fase: "evaluacion" as const, actividad: "Presentar la cartilla" },
  ],
};

describe("proyectoInterdisciplinar.sugerirInstrumentosEvaluacion", () => {
  it("devuelve solo instrumentos válidos por id y filtra códigos inventados", async () => {
    const r = await caller().sugerirInstrumentosEvaluacion(input);

    expect(r.instrumentos.map((i) => i.id)).toEqual(["a1", "a2"]);
    expect(r.instrumentos[0].criteriosVinculados).toEqual(["LL.3.1.1"]);
    expect(r.instrumentos[1].instrumento).toBe("Rúbrica analítica: claridad, evidencia, trabajo en equipo");
  });

  it("incluye actividades y destrezas en el prompt", async () => {
    await caller().sugerirInstrumentosEvaluacion(input);
    const llamadas = (invokeLLM as any).mock.calls;
    const prompt = llamadas[llamadas.length - 1][0].messages[1].content as string;

    expect(prompt).toContain("destrezas con criterios de desempeño");
    expect(prompt).toContain("LL.3.1.1");
    expect(prompt).toContain('id "a2"');
    expect(prompt).toContain("Elaborar la cartilla");
  });

  it("rechaza una lista de actividades vacía", async () => {
    await expect(caller().sugerirInstrumentosEvaluacion({ ...input, actividades: [] })).rejects.toThrow();
  });
});
