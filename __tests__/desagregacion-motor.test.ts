import { describe, it, expect, vi, beforeEach } from "vitest";

import { gradosDeSubnivel, resolverDcdConIndicador, buscarPorCodigo } from "../data";

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({ choices: [{ message: { content: "" } }] })),
  repairJson: (s: string) => s,
}));

import { invokeLLM } from "../server/_core/llm";
import {
  generarDesagregacionDCD,
  procesoCognitivoParaPosicion,
  validarContenidoGraduado,
} from "../server/dcd-desagregacion-service";

const DCD_CN_2_1_1 =
  "Observar las etapas del ciclo vital del ser humano y registrar gráficamente los cambios de acuerdo a la edad";

describe("gradosDeSubnivel", () => {
  it("subnivel 2 (Elemental) → [2,3,4]", () => {
    expect(gradosDeSubnivel(2)).toEqual([2, 3, 4]);
  });
  it("subnivel 3 (Media) → [5,6,7]", () => {
    expect(gradosDeSubnivel(3)).toEqual([5, 6, 7]);
  });
  it("subnivel 4 (Superior) → [8,9,10]", () => {
    expect(gradosDeSubnivel(4)).toEqual([8, 9, 10]);
  });
  it("subnivel 5 (BGU) → [1,2,3]", () => {
    expect(gradosDeSubnivel(5)).toEqual([1, 2, 3]);
  });
  it("Preparatoria (subnivel 1) → null (sin gradación)", () => {
    expect(gradosDeSubnivel(1)).toBeNull();
  });
  it("Inicial (0 / -1) → null", () => {
    expect(gradosDeSubnivel(0)).toBeNull();
    expect(gradosDeSubnivel(-1)).toBeNull();
  });
});

describe("resolverDcdConIndicador", () => {
  it("resuelve DCD existente + indicador principal (primero del array)", () => {
    const r = resolverDcdConIndicador("CN.2.1.1");
    expect(r).not.toBeNull();
    expect(r!.dcd.codigo).toBe("CN.2.1.1");
    expect(r!.indicador).toBe(r!.dcd.indicadoresEvaluacion[0]);
  });
  it("código inexistente → null", () => {
    expect(resolverDcdConIndicador("X.9.9.9")).toBeNull();
  });
  it("destreza sin indicador de evaluación (Inicial) → null", () => {
    expect(resolverDcdConIndicador("INI.4.1.1")).toBeNull();
  });
  it("Preparatoria resuelve indicador pero no admite gradación (gradosDeSubnivel null)", () => {
    const r = resolverDcdConIndicador("CAI.1.1.1");
    expect(r).not.toBeNull();
    expect(gradosDeSubnivel(r!.dcd.subnivel)).toBeNull();
  });
});

describe("procesoCognitivoParaPosicion", () => {
  it("primer grado del ladder → Recuperación", () => {
    expect(procesoCognitivoParaPosicion(0, 3)).toContain("Recuperación");
  });
  it("grado medio → Comprensión", () => {
    expect(procesoCognitivoParaPosicion(1, 3)).toContain("Comprensión");
  });
});

describe("validarContenidoGraduado", () => {
  it("versión fiel (solo palabras de la DCD original) no genera advertencias", () => {
    const graduada =
      "Observar las etapas del ciclo vital del ser humano y registrar los cambios de acuerdo a la edad";
    expect(validarContenidoGraduado(DCD_CN_2_1_1, graduada, 3)).toEqual([]);
  });
  it("términos ajenos a la DCD original generan advertencia con los términos", () => {
    const graduada =
      "Observar las etapas del ciclo vital del ser humano y analizar los cambios hormonales";
    const adv = validarContenidoGraduado(DCD_CN_2_1_1, graduada, 3);
    expect(adv.length).toBeGreaterThan(0);
    expect(adv.join(" ")).toContain("hormonales");
  });
  it("longitud excesiva genera advertencia de longitud", () => {
    const larga = `${DCD_CN_2_1_1} y además observar y registrar cada uno de los procesos relacionados con las etapas del ciclo vital completo del ser humano`;
    const adv = validarContenidoGraduado(DCD_CN_2_1_1, larga, 3);
    expect(adv.join(" ")).toContain("longitud");
  });
});

describe("generarDesagregacionDCD (post-proceso, IA simulada)", () => {
  const destreza = buscarPorCodigo("CN.2.1.1")!;

  beforeEach(() => {
    (invokeLLM as any).mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              grados: [
                {
                  grado: 2,
                  dcdGraduada: "Identificar las etapas del ciclo vital del ser humano",
                  indicadorGraduado: "indicador 2",
                  procesoCognitivo: "Recuperación",
                },
                {
                  grado: 3,
                  dcdGraduada:
                    "Observar las etapas del ciclo vital del ser humano y registrar los cambios",
                  indicadorGraduado: "indicador 3",
                  procesoCognitivo: "Comprensión",
                },
              ],
            }),
          },
        },
      ],
    });
  });

  it("genera el ladder completo con el último grado idéntico al oficial (sin IA)", async () => {
    const { filas } = await generarDesagregacionDCD("CN.2.1.1");
    expect(filas.map((f) => f.grado)).toEqual([2, 3, 4]);
    const ultima = filas.find((f) => f.grado === 4)!;
    expect(ultima.dcdGraduada).toBe(destreza.descripcion);
    expect(ultima.indicadorGraduado).toBe(destreza.indicadoresEvaluacion[0]);
    expect(ultima.estado).toBe("generado");
    expect(ultima.version).toBe(1);
  });

  it("grados intermedios usan la versión graduada de la IA con su proceso cognitivo", async () => {
    const { filas } = await generarDesagregacionDCD("CN.2.1.1");
    const g2 = filas.find((f) => f.grado === 2)!;
    expect(g2.dcdGraduada).toBe("Identificar las etapas del ciclo vital del ser humano");
    expect(g2.indicadorGraduado).toBe("indicador 2");
    expect(g2.procesoCognitivo).toContain("Recuperación");
  });

  it("advertencia cuando la IA introduce términos ajenos a la DCD original", async () => {
    (invokeLLM as any).mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              grados: [
                {
                  grado: 2,
                  dcdGraduada: "Observar las etapas del ciclo vital y analizar los cambios hormonales",
                  indicadorGraduado: "indicador 2",
                },
                {
                  grado: 3,
                  dcdGraduada: "Observar las etapas del ciclo vital del ser humano",
                  indicadorGraduado: "indicador 3",
                },
              ],
            }),
          },
        },
      ],
    });
    const { advertencias } = await generarDesagregacionDCD("CN.2.1.1");
    expect(advertencias.length).toBeGreaterThan(0);
    expect(advertencias.join(" ")).toContain("hormonales");
  });

  it("rechaza desagregar DCD de Preparatoria/Inicial (sin gradación)", async () => {
    await expect(generarDesagregacionDCD("CAI.1.1.1")).rejects.toThrow(
      "no admite desagregación"
    );
  });

  it("rechaza DCD inexistente o sin indicador", async () => {
    await expect(generarDesagregacionDCD("X.9.9.9")).rejects.toThrow("no existe");
    await expect(generarDesagregacionDCD("INI.4.1.1")).rejects.toThrow("no tiene indicador");
  });
});