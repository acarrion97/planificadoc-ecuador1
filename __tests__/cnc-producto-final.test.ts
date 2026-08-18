import { describe, it, expect } from "vitest";
import { generarHTMLPlanCNC } from "../lib/pdf-generator";
import { generarWordPlanCNC } from "../lib/cnc-word-generator";
import type { PlanConectaNivelaCrea } from "../data/types-cnc";

function planGeneral(overrides?: Partial<PlanConectaNivelaCrea>): PlanConectaNivelaCrea {
  return {
    id: "p1",
    institucion: "Escuela Test",
    docente: "Docente Test",
    anioLectivo: "2026-2027",
    grado: "7mo EGB",
    paralelo: "A",
    subnivel: "Media",
    fechaInicio: "2026-09-01",
    modalidad: "general",
    semana1: {
      actividadesAdaptacion: [],
      diagnosticoAcademico: [],
      diagnosticoSocioemocional: [],
      coordinacionDece: "",
      tecnicasReflexion: [],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: {
      proyecto: {
        titulo: "Decálogo ilustrado de convivencia y seguridad integral",
        descripcion: "Los estudiantes elaboran un decálogo sobre convivencia.",
        areasIntegradas: ["CN", "CS"],
        productoFinal: "Decálogo ilustrado de convivencia y seguridad integral",
        actividadesSemana4: ["Planificación del proyecto", "Organización de equipos de trabajo"],
        actividadesSemana5: ["Socialización del decálogo", "Reflexión sobre el aprendizaje"],
        destrezasReforzadas: [],
        evidenciasCognitivas: [],
        evidenciasActitudinales: [],
        esEvaluacionFormativaOficial: true,
      },
    },
    status: "generado",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function planBT(overrides?: Partial<PlanConectaNivelaCrea>): PlanConectaNivelaCrea {
  const plan = planGeneral();
  return {
    ...plan,
    modalidad: "bt",
    figuraProfesionalId: "fp1",
    moduloId: "mod1",
    semana1BT: { reconocimientoEspacios: [], diagnosticoTecnico: [] },
    semana2y3BT: { actividadesNivelacionTecnica: [] },
    semana4y5BT: {
      productoAcreditable: {
        tipo: "maqueta",
        descripcion: "Maqueta del sistema de riego",
        actividadesSemana4: ["Selección de materiales", "Elaboración de la maqueta"],
        actividadesSemana5: ["Presentación de la maqueta", "Evaluación formativa"],
      },
    },
    ...overrides,
  };
}

const FALLBACK_GENERAL_S4 = "Diseño y desarrollo del proyecto interdisciplinario";
const FALLBACK_GENERAL_S5 = "Presentación y socialización del proyecto interdisciplinario";
const FALLBACK_BT_S4 = "Diseño y elaboración del producto acreditable";
const FALLBACK_BT_S5 = "Presentación del producto acreditable";

describe("generarHTMLPlanCNC — Crea phase (General)", () => {
  it("incluye el producto final y las actividades reales de Semanas 4 y 5", () => {
    const html = generarHTMLPlanCNC(planGeneral());
    expect(html).toContain("Producto final:");
    expect(html).toContain("Decálogo ilustrado de convivencia y seguridad integral");
    expect(html).toContain("Planificación del proyecto");
    expect(html).toContain("Socialización del decálogo");
    expect(html).not.toContain(FALLBACK_GENERAL_S4);
    expect(html).not.toContain(FALLBACK_GENERAL_S5);
  });

  it("mantiene las actividades del docente si ya estaban escritas", () => {
    const html = generarHTMLPlanCNC(planGeneral());
    expect(html).toContain("Organización de equipos de trabajo");
    expect(html).toContain("Reflexión sobre el aprendizaje");
  });

  it("usa los textos legados como fallback en planes sin actividades (creados antes del cambio)", () => {
    const legacy = planGeneral();
    legacy.semana4y5.proyecto.productoFinal = "";
    legacy.semana4y5.proyecto.actividadesSemana4 = [];
    legacy.semana4y5.proyecto.actividadesSemana5 = [];
    const html = generarHTMLPlanCNC(legacy);
    expect(html).toContain(FALLBACK_GENERAL_S4);
    expect(html).toContain(FALLBACK_GENERAL_S5);
  });
});

describe("generarHTMLPlanCNC — Crea phase (BT)", () => {
  it("incluye las actividades reales del producto acreditable", () => {
    const html = generarHTMLPlanCNC(planBT());
    expect(html).toContain("Selección de materiales");
    expect(html).toContain("Elaboración de la maqueta");
    expect(html).toContain("Presentación de la maqueta");
    expect(html).not.toContain(FALLBACK_BT_S4);
    expect(html).not.toContain(FALLBACK_BT_S5);
  });

  it("usa los textos legados como fallback en planes BT sin actividades", () => {
    const legacy = planBT();
    legacy.semana4y5BT!.productoAcreditable.actividadesSemana4 = [];
    legacy.semana4y5BT!.productoAcreditable.actividadesSemana5 = [];
    const html = generarHTMLPlanCNC(legacy);
    expect(html).toContain(FALLBACK_BT_S4);
    expect(html).toContain(FALLBACK_BT_S5);
  });
});

describe("generarWordPlanCNC — Crea phase", () => {
  it("genera un documento con contenido real (General) y otro con fallback legado", async () => {
    const con = await generarWordPlanCNC(planGeneral());
    expect(con.size).toBeGreaterThan(0);

    const legacy = planGeneral();
    legacy.semana4y5.proyecto.productoFinal = "";
    legacy.semana4y5.proyecto.actividadesSemana4 = [];
    legacy.semana4y5.proyecto.actividadesSemana5 = [];
    const sinActividades = await generarWordPlanCNC(legacy);
    expect(sinActividades.size).toBeGreaterThan(0);
  });

  it("genera un documento BT con actividades del producto acreditable", async () => {
    const blob = await generarWordPlanCNC(planBT());
    expect(blob.size).toBeGreaterThan(0);
  });
});
