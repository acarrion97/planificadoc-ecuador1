import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// MOCK de DB — listado "Comunidad" sin MySQL real
// ============================================================

let filas: any[] = [];
const llamadas = { limit: 0, offset: 0 };

const mockDb = {
  execute: vi.fn(() => Promise.resolve()),
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        orderBy: vi.fn(() => ({
          limit: vi.fn((n: number) => {
            llamadas.limit = n;
            return {
              offset: vi.fn((o: number) => {
                llamadas.offset = o;
                return Promise.resolve(filas.slice(o, o + n));
              }),
            };
          }),
        })),
        limit: vi.fn(() => Promise.resolve(filas.slice(0, 1))),
      })),
    })),
  })),
};

vi.mock("../server/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

import {
  anonimizarFormData,
  resumenPlanComunidad,
  rutaEdicionCurriculoCompetencias,
  contextoAdaptacionDesdeCurriculo,
} from "../lib/curriculo-competencias-comunidad";
import { curriculoCompetenciasRouter } from "../server/curriculo-competencias-router";

const planInicial = {
  id: "p1",
  sessionId: "sesion-secreta",
  grado: "Inicial 3-4 años",
  institucion: "Unidad Educativa San Martín",
  docente: "María González",
  paralelo: "B",
  trimestre: "Primer trimestre",
  observaciones: "Juanito necesita apoyo",
  numeroNinos: 24,
  situacionAprendizaje: { titulo: "Mis emociones", descripcion: "Exploramos emociones" },
  ambitos: [
    {
      ambito: "Identidad",
      competenciaCodigo: "CE.CI.1",
      competenciaDescripcion: "Reconoce sus emociones",
      clases: [{ numero: 1, tema: "Alegría" }],
    },
  ],
  adaptacionesNEE: [{ grado: 2, necesidadEducativa: "TDAH de Pedro" }],
  firmas: { elaborado: "María", revisado: "Luis", coordinador: "Ana", aprobado: "Rosa" },
};

describe("anonimizarFormData", () => {
  it("vacía docente, institución, paralelo, sessionId y firmantes", () => {
    const a = anonimizarFormData(planInicial) as any;
    expect(a.docente).toBe("");
    expect(a.institucion).toBe("");
    expect(a.paralelo).toBe("");
    expect(a.sessionId).toBe("");
    expect(a.firmas).toEqual({ elaborado: "", revisado: "", coordinador: "", aprobado: "" });
  });

  it("elimina datos de estudiantes y notas libres", () => {
    const a = anonimizarFormData(planInicial) as any;
    expect(a.adaptacionesNEE).toBeUndefined();
    expect(a.observaciones).toBeUndefined();
    expect(a.numeroNinos).toBeUndefined();
  });

  it("conserva el contenido pedagógico y no muta el original", () => {
    const a = anonimizarFormData(planInicial) as any;
    expect(a.situacionAprendizaje.titulo).toBe("Mis emociones");
    expect(a.ambitos[0].competenciaCodigo).toBe("CE.CI.1");
    expect(a.ambitos[0].clases[0].tema).toBe("Alegría");
    expect(planInicial.docente).toBe("María González");
    expect(planInicial.firmas.elaborado).toBe("María");
  });

  it("limpia claves identificadoras anidadas", () => {
    const a = anonimizarFormData({ extra: { docente: "X", rector: "Y", tema: "ok" } }) as any;
    expect(a.extra).toEqual({ docente: "", rector: "", tema: "ok" });
  });

  it("ningún nombre sobrevive en el JSON serializado", () => {
    const json = JSON.stringify(anonimizarFormData(planInicial));
    for (const dato of ["María", "San Martín", "Juanito", "Pedro", "sesion-secreta", "Rosa"]) {
      expect(json).not.toContain(dato);
    }
  });
});

describe("resumenPlanComunidad / rutas / contexto NEE", () => {
  it("arma la tarjeta con grado, competencias y título", () => {
    const r = resumenPlanComunidad({ id: 7, tipo: "inicial_preparatoria", createdAt: null, formData: planInicial });
    expect(r.familia).toBe("curriculo_integrado_inicial");
    expect(r.grado).toBe("Inicial 3-4 años");
    expect(r.competencias).toEqual(["CE.CI.1"]);
    expect(r.titulo).toBe("Mis emociones");
  });

  it("elige el formulario de edición según la familia", () => {
    expect(rutaEdicionCurriculoCompetencias("egb_bgu", {}, 1)).toBe("/curriculo-competencias/egb-bgu?id=1");
    expect(rutaEdicionCurriculoCompetencias("inicial_preparatoria", planInicial, 2)).toBe(
      "/curriculo-competencias/inicial?id=2"
    );
    expect(rutaEdicionCurriculoCompetencias("inicial_preparatoria", { modalidad: "multigrado" }, 3)).toBe(
      "/curriculo-competencias/egb-bgu-integrado?id=3"
    );
  });

  it("precarga la adaptación curricular con grado y primera competencia", () => {
    const ctx = contextoAdaptacionDesdeCurriculo(planInicial);
    expect(ctx.grado).toBe("Inicial 3-4 años");
    expect(ctx.codigoDestreza).toBe("CE.CI.1");
    expect(ctx.descripcionDestreza).toBe("Reconoce sus emociones");
    expect(ctx.docente).toBe("María González");
  });
});

describe("router: listCompartidas / getCompartidaById", () => {
  beforeEach(() => {
    filas = [1, 2, 3].map((id) => ({
      id,
      tipo: "inicial_preparatoria",
      asignatura: null,
      createdAt: new Date(2026, 8, id),
      formData: JSON.stringify(planInicial),
    }));
  });

  it("devuelve tarjetas anonimizadas sin sessionId ni formData, con paginación", async () => {
    const caller = curriculoCompetenciasRouter.createCaller({} as any);
    const res = await caller.listCompartidas({ limit: 2, offset: 0 });
    expect(llamadas.limit).toBe(3); // una fila extra para saber si hay más
    expect(res.items).toHaveLength(2);
    expect(res.hayMas).toBe(true);
    const json = JSON.stringify(res);
    expect(json).not.toContain("María");
    expect(json).not.toContain("sesion-secreta");
    expect(res.items[0]).not.toHaveProperty("formData");
    expect(res.items[0]).not.toHaveProperty("sessionId");
  });

  it("getCompartidaById entrega el formData anonimizado", async () => {
    const caller = curriculoCompetenciasRouter.createCaller({} as any);
    const plan = await caller.getCompartidaById({ id: 1 });
    expect(plan).not.toBeNull();
    expect((plan!.formData as any).docente).toBe("");
    expect((plan!.formData as any).ambitos[0].competenciaCodigo).toBe("CE.CI.1");
    expect(JSON.stringify(plan)).not.toContain("San Martín");
  });
});
