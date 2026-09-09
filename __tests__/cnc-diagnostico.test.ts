import { describe, it, expect } from "vitest";
import {
  nivelDominanteEstado,
  nivelCNC,
  diagnosticoAcademicoDesdeBrechas,
  rubricaProyectoDesdeDestrezas,
} from "../lib/cnc-diagnostico";
import type { BrechaCurso } from "../data/types-evaluacion";
import { buscarPorCodigo } from "../data";

function brecha(overrides: Partial<BrechaCurso> & { dcdCodigo: string }): BrechaCurso {
  return {
    descripcion: `Descripción de ${overrides.dcdCodigo}`,
    // Origen curricular es irrelevante para lo que prueba este archivo
    // (mapeo de brechas → diagnóstico CNC); se fija en un valor neutro y
    // consistente entre sí (no_determinado ⇒ subnivelOrigen null).
    origen: "no_determinado",
    subnivelOrigen: null,
    totalEstudiantes: 10,
    dominado: 0,
    enProceso: 0,
    requiereRefuerzo: 0,
    porcentajeDominio: 0,
    porcentajeDificultad: 100,
    prioridad: 1,
    ...overrides,
  };
}

describe("nivelDominanteEstado", () => {
  it("dominado cuando dominado es el máximo", () => {
    expect(nivelDominanteEstado({ dominado: 5, enProceso: 3, requiereRefuerzo: 2 })).toBe("dominado");
  });

  it("en_proceso cuando enProceso es el máximo", () => {
    expect(nivelDominanteEstado({ dominado: 2, enProceso: 5, requiereRefuerzo: 3 })).toBe("en_proceso");
  });

  it("requiere_refuerzo cuando requiereRefuerzo es el máximo (empate roto hacia refuerzo)", () => {
    expect(nivelDominanteEstado({ dominado: 2, enProceso: 2, requiereRefuerzo: 2 })).toBe("requiere_refuerzo");
  });
});

describe("nivelCNC", () => {
  it("mapea dominado → logrado", () => {
    expect(nivelCNC({ dominado: 5, enProceso: 3, requiereRefuerzo: 2 })).toBe("logrado");
  });

  it("mapea en_proceso → en_proceso", () => {
    expect(nivelCNC({ dominado: 2, enProceso: 5, requiereRefuerzo: 3 })).toBe("en_proceso");
  });

  it("mapea requiere_refuerzo → iniciado", () => {
    expect(nivelCNC({ dominado: 3, enProceso: 3, requiereRefuerzo: 4 })).toBe("iniciado");
  });
});

describe("diagnosticoAcademicoDesdeBrechas", () => {
  it("genera una entrada por brecha con código, descripción y área", () => {
    const resultado = diagnosticoAcademicoDesdeBrechas(
      [
        brecha({ dcdCodigo: "M.2.1.1", dominado: 5, enProceso: 3, requiereRefuerzo: 2, porcentajeDominio: 50 }),
        brecha({ dcdCodigo: "M.2.1.2", dominado: 2, enProceso: 3, requiereRefuerzo: 5, porcentajeDominio: 20 }),
      ],
      "M"
    );

    expect(resultado).toHaveLength(2);
    expect(resultado[0].destrezaCodigo).toBe("M.2.1.1");
    expect(resultado[0].area).toBe("M");
    expect(resultado[0].nivelDetectado).toBe("logrado");
    expect(resultado[1].nivelDetectado).toBe("iniciado");
  });

  it("incluye la observación de procedencia con % de dominio y conteo de refuerzo", () => {
    const [entrada] = diagnosticoAcademicoDesdeBrechas(
      [brecha({ dcdCodigo: "LL.3.1.1", dominado: 2, enProceso: 2, requiereRefuerzo: 6, porcentajeDominio: 20 })],
      "LL"
    );
    expect(entrada.observaciones).toContain("20% de dominio");
    expect(entrada.observaciones).toContain("6 estudiante(s) en refuerzo");
  });

  it("respeta el área indicada (LL y M)", () => {
    const ll = diagnosticoAcademicoDesdeBrechas([brecha({ dcdCodigo: "LL.3.1.1" })], "LL");
    const m = diagnosticoAcademicoDesdeBrechas([brecha({ dcdCodigo: "M.3.1.1" })], "M");
    expect(ll[0].area).toBe("LL");
    expect(m[0].area).toBe("M");
  });
});

describe("rubricaProyectoDesdeDestrezas", () => {
  it("deriva la fila con los indicadores reales del catálogo para un código válido", () => {
    const esperado = buscarPorCodigo("LL.4.1.1");
    expect(esperado).toBeDefined();

    const filas = rubricaProyectoDesdeDestrezas(["LL.4.1.1"]);
    expect(filas).toHaveLength(1);
    expect(filas[0]).toEqual({
      destrezaCodigo: "LL.4.1.1",
      destrezaDescripcion: esperado!.descripcion,
      area: "LL",
      indicadores: esperado!.indicadoresEvaluacion,
    });
  });

  it("no genera fila para un código que no resuelve en el catálogo (no inventa datos)", () => {
    expect(rubricaProyectoDesdeDestrezas(["XX.9.9.9"])).toEqual([]);
  });

  it("mezcla códigos válidos e inválidos: solo los válidos generan fila", () => {
    const filas = rubricaProyectoDesdeDestrezas(["LL.4.1.1", "XX.9.9.9", "M.4.1.1"]);
    expect(filas.map((f) => f.destrezaCodigo)).toEqual(["LL.4.1.1", "M.4.1.1"]);
  });

  it("descarta códigos duplicados", () => {
    const filas = rubricaProyectoDesdeDestrezas(["LL.4.1.1", "LL.4.1.1"]);
    expect(filas).toHaveLength(1);
  });

  it("lista vacía si no se pasan códigos", () => {
    expect(rubricaProyectoDesdeDestrezas([])).toEqual([]);
  });
});
