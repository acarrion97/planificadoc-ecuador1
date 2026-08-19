import { describe, it, expect } from "vitest";
import { iconosDcdRuns, iconosDestrezaHTML } from "../lib/dcd-iconos";
import { generarHTMLPlanificacion, generarHTMLSemanal } from "../lib/pdf-generator";
import { generarHTMLPca } from "../lib/pca-pdf-generator";
import { Planificacion, PlanificacionSemanal } from "../data/types";

describe("iconosDestrezaHTML", () => {
  it("devuelve <img> base64 para un código DCD con íconos", () => {
    const html = iconosDestrezaHTML("M.3.1.1");
    expect(html).toContain("<img");
    expect(html).toContain("data:image/png;base64");
    expect(html).toContain("width:14px;height:14px");
  });

  it("devuelve string vacío para un código sin íconos asociados", () => {
    expect(iconosDestrezaHTML("INI.3.1.1")).toBe("");
  });

  it("devuelve string vacío para código nulo/indefinido", () => {
    expect(iconosDestrezaHTML(null)).toBe("");
    expect(iconosDestrezaHTML(undefined)).toBe("");
  });
});

describe("iconosDcdRuns", () => {
  it("devuelve runs (imagen) para un código DCD con íconos", () => {
    const runs = iconosDcdRuns("M.3.1.1");
    expect(runs.length).toBeGreaterThan(0);
  });

  it("devuelve array vacío para un código sin íconos", () => {
    expect(iconosDcdRuns("INI.3.1.1")).toEqual([]);
    expect(iconosDcdRuns(null)).toEqual([]);
  });
});

const mockPlan: Planificacion = {
  id: "test-plan-iconos-1",
  fecha: "03/04/2026",
  institucion: "Unidad Educativa Fiscal Test",
  docente: "Lic. María García",
  grado: "5to grado EGB",
  asignatura: "Matemática",
  periodos: "1",
  destreza: {
    codigo: "M.3.1.1",
    area: "M",
    subnivel: 3,
    bloque: 1,
    secuencial: 1,
    descripcion: "Generar sucesiones con sumas y restas.",
    objetivos: ["O.M.3.1."],
    criteriosEvaluacion: ["CE.M.3.1."],
    indicadoresEvaluacion: ["I.M.3.1.1."],
  },
  objetivoAprendizaje: "Representar y comparar fracciones.",
  actividades: "Actividades de la clase...",
  recursos: "Texto, cuaderno",
  evaluacion: "Lista de cotejo",
  tecnicasInstrumentos: "Observación directa",
  observaciones: "Ninguna",
  createdAt: "2026-04-03T12:00:00.000Z",
  updatedAt: "2026-04-03T12:00:00.000Z",
};

describe("generarHTMLPlanificacion — íconos DCD", () => {
  it("incrusta los íconos de la destreza junto al código", () => {
    const html = generarHTMLPlanificacion(mockPlan);
    expect(html).toContain("M.3.1.1");
    expect(html).toContain("<img");
    expect(html).toContain("data:image/png;base64");
  });
});

describe("generarHTMLPca — íconos DCD", () => {
  it("incrusta los íconos junto a cada DCD de la columna Destrezas", () => {
    const formData = {
      area: "M",
      subnivel: 3,
      semanasTrabajoTotal: 40,
      semanasEvaluacion: 2,
      cargaHorariaSemanal: 6,
      unidades: [
        {
          numero: 1,
          dcdsSeleccionadas: [{ codigo: "M.3.1.1", enunciado: "Generar sucesiones con sumas y restas." }],
        },
      ],
    };
    const html = generarHTMLPca(formData, {});
    expect(html).toContain("M.3.1.1");
    expect(html).toContain("<img");
    expect(html).toContain("data:image/png;base64");
  });

  it("no incrusta íconos cuando el DCD no tiene íconos asociados", () => {
    const formData = {
      area: "M",
      subnivel: 3,
      unidades: [
        {
          numero: 1,
          dcdsSeleccionadas: [{ codigo: "INI.3.1.1", enunciado: "Hábitos de higiene." }],
        },
      ],
    };
    const html = generarHTMLPca(formData, {});
    expect(html).toContain("INI.3.1.1");
    expect(html).not.toContain("<img");
  });
});

describe("generarHTMLSemanal — íconos DCD (regresión tras refactor)", () => {
  const diaVacio = () => ({ activo: false, cantidadHoras: 1 as const, horas: [] });

  const semanaMock: PlanificacionSemanal = {
    id: "sem-iconos-1",
    fecha: "06/04/2026",
    semanaInicio: "06/04/2026",
    semanaFin: "10/04/2026",
    institucion: "Unidad Educativa Fiscal Test",
    docente: "Lic. María García",
    grado: "5to grado EGB",
    nivel: "EGB",
    paralelo: "A",
    periodoPedagogico: "2026-2027",
    trimestre: "1",
    periodos: "1",
    numeroUnidad: "1",
    tituloUnidad: "Fracciones",
    objetivosUnidad: "Objetivo",
    duaRepresentacion: "",
    duaAccionExpresion: "",
    duaImplicacion: "",
    pctVisual: "",
    pctAuditivo: "",
    pctLectorEscritor: "",
    pctKinestesico: "",
    dias: {
      lunes: {
        activo: true,
        cantidadHoras: 1,
        horas: [
          {
            id: "h1",
            codigoDestreza: "M.3.1.1",
            destreza: mockPlan.destreza as any,
            tema: "Fracciones",
            temasAlternativos: [],
            temaSeleccionado: {
              id: "t1",
              titulo: "Fracciones",
              descripcionBreve: "",
              objetivoClase: "Objetivo",
              estructura: {},
              recursos: [],
              evaluacionFormativa: "",
            } as any,
            habilidadesSocioemocionales: [],
            usaEjesTransversales: false,
            insercionesCurriculares: [],
            usaCompetencias: false,
            competencias: [],
            metodologiasActivas: [],
            tecnicasEvaluacion: [],
          },
        ],
      },
      martes: diaVacio(),
      miercoles: diaVacio(),
      jueves: diaVacio(),
      viernes: diaVacio(),
    },
    createdAt: "2026-04-06T00:00:00.000Z",
    updatedAt: "2026-04-06T00:00:00.000Z",
  };

  it("sigue incrustando los íconos junto a cada DCD tras el refactor", () => {
    const html = generarHTMLSemanal(semanaMock);
    expect(html).toContain("M.3.1.1");
    expect(html).toContain("<img");
    expect(html).toContain("data:image/png;base64");
  });
});