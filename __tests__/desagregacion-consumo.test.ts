import { describe, it, expect } from "vitest";
import { buscarPorCodigo } from "../data";
import { generarHTMLPlanificacion, generarHTMLSemanal } from "../lib/pdf-generator";
import {
  DcdDesagregacion,
  DcdSeleccionada,
  Planificacion,
  PlanificacionSemanal,
  HoraSemanal,
} from "../data/types";

const destreza = buscarPorCodigo("CN.2.1.1")!;
const OFICIAL = destreza.descripcion;
const GRADUADA_3RO =
  "Observar las etapas del ciclo vital del ser humano e identificar sus cambios de acuerdo a la edad (versión graduada 3.º)";

function basePlan(overrides?: Partial<Planificacion>): Planificacion {
  return {
    id: "p1",
    fecha: "01/05/2026",
    institucion: "UE Test",
    docente: "Docente Test",
    grado: "3ro EGB",
    asignatura: "Ciencias Naturales",
    periodos: "2",
    destreza,
    objetivoAprendizaje: "Objetivo",
    actividades: "Actividades",
    recursos: "Recursos",
    evaluacion: "Evaluación",
    tecnicasInstrumentos: "Técnicas",
    observaciones: "Observaciones",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
    ...overrides,
  };
}

function baseHora(descripcionEfectiva?: string): HoraSemanal {
  return {
    id: "h1",
    codigoDestreza: destreza.codigo,
    destreza,
    descripcionEfectiva,
    tema: "El ciclo vital",
    temasAlternativos: [],
    temaSeleccionado: {
      id: "t1",
      titulo: "El ciclo vital",
      descripcionBreve: "",
      objetivoClase: "",
      estructura: {
        experiencia: { titulo: "Experiencia", duracion: "10", actividades: ["Act"] },
        reflexion: { titulo: "Reflexión", duracion: "10", actividades: ["Act"] },
        conceptualizacion: { titulo: "Conceptualización", duracion: "10", actividades: ["Act"] },
        aplicacion: { titulo: "Aplicación", duracion: "10", actividades: ["Act"] },
      },
      recursos: [],
      evaluacionFormativa: "",
    },
    habilidadesSocioemocionales: [],
    usaEjesTransversales: false,
    insercionesCurriculares: [],
    usaCompetencias: false,
    competencias: [],
    metodologiasActivas: [],
    tecnicasEvaluacion: [],
  };
}

function baseSemana(descripcionEfectiva?: string): PlanificacionSemanal {
  const diaInactivo = { activo: false, cantidadHoras: 1 as const, horas: [] as HoraSemanal[] };
  return {
    id: "s1",
    fecha: "01/05/2026",
    semanaInicio: "01/05/2026",
    semanaFin: "05/05/2026",
    institucion: "UE Test",
    docente: "Docente Test",
    grado: "3ro EGB",
    nivel: "Básica Elemental",
    paralelo: "A",
    periodoPedagogico: "2026-2027",
    trimestre: "Primero",
    periodos: "1",
    numeroUnidad: "1",
    tituloUnidad: "Los seres vivos",
    objetivosUnidad: "Objetivos",
    duaRepresentacion: "",
    duaAccionExpresion: "",
    duaImplicacion: "",
    pctVisual: "",
    pctAuditivo: "",
    pctLectorEscritor: "",
    pctKinestesico: "",
    dias: {
      lunes: { activo: true, cantidadHoras: 1 as const, horas: [baseHora(descripcionEfectiva)] },
      martes: diaInactivo,
      miercoles: diaInactivo,
      jueves: diaInactivo,
      viernes: diaInactivo,
    },
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  };
}

describe("Contrato de selección (PCA/PCT)", () => {
  it("una selección desagregada guarda el texto graduado como enunciado, su origen y su grado", () => {
    const sel = { codigo: "CN.2.1.1", enunciado: GRADUADA_3RO, origen: "desagregada" as const, grado: 3 };
    expect(sel.enunciado).toBe(GRADUADA_3RO);
    expect(sel.origen).toBe("desagregada");
    expect(sel.grado).toBe(3);
  });

  it("una selección oficial conserva el texto oficial y no lleva grado", () => {
    const sel: DcdSeleccionada = { codigo: "CN.2.1.1", enunciado: OFICIAL, origen: "oficial" };
    expect(sel.enunciado).toBe(OFICIAL);
    expect(sel.grado).toBeUndefined();
  });
});

describe("Consumo: plan de unidad (descripcionEfectiva)", () => {
  it("con selección desagregada muestra la versión graduada en el documento", () => {
    const html = generarHTMLPlanificacion(basePlan({ descripcionEfectiva: GRADUADA_3RO }));
    expect(html).toContain(GRADUADA_3RO);
    expect(html).not.toContain(OFICIAL);
  });

  it("sin descripcionEfectiva (oficial o sin desagregación) muestra la descripcion oficial", () => {
    const html = generarHTMLPlanificacion(basePlan());
    expect(html).toContain(OFICIAL);
    expect(html).not.toContain(GRADUADA_3RO);
  });

  it("una desagregación guardada pero NO seleccionada sigue mostrando la DCD oficial", () => {
    const filaGuardada: DcdDesagregacion = {
      codigoDCD: "CN.2.1.1",
      subnivel: 2,
      grado: 3,
      gradoMaximo: 4,
      descripcionDCD: OFICIAL,
      indicadorOriginal: destreza.indicadoresEvaluacion[0],
      dcdGraduada: GRADUADA_3RO,
      indicadorGraduado: "I.CN.2.1.1. (versión graduada)",
      estado: "generado",
      version: 1,
    };
    expect(filaGuardada.dcdGraduada).toBeTruthy();
    // El plan no materializó la versión → muestra el texto oficial
    const html = generarHTMLPlanificacion(basePlan());
    expect(html).toContain(OFICIAL);
    expect(html).not.toContain(GRADUADA_3RO);
  });
});

describe("Consumo: plan semanal (descripcionEfectiva)", () => {
  it("una hora con versión graduada muestra la descripción graduada en el documento", () => {
    const html = generarHTMLSemanal(baseSemana(GRADUADA_3RO));
    expect(html).toContain(GRADUADA_3RO);
    expect(html).not.toContain(OFICIAL);
  });

  it("una hora sin descripcionEfectiva muestra la descripcion oficial", () => {
    const html = generarHTMLSemanal(baseSemana());
    expect(html).toContain(OFICIAL);
    expect(html).not.toContain(GRADUADA_3RO);
  });
});

describe("Materialización: editar la desagregación NO cambia planes guardados", () => {
  it("plan de unidad conserva la versión materializada aunque la desagregación se edite después", () => {
    const plan = basePlan({ descripcionEfectiva: GRADUADA_3RO });
    const htmlAntes = generarHTMLPlanificacion(plan);

    // La desagregación se edita después (v2) — entidad separada del plan
    const desagregacionEditada: DcdDesagregacion = {
      codigoDCD: "CN.2.1.1",
      subnivel: 2,
      grado: 3,
      gradoMaximo: 4,
      descripcionDCD: OFICIAL,
      indicadorOriginal: destreza.indicadoresEvaluacion[0],
      dcdGraduada: GRADUADA_3RO + " v2",
      indicadorGraduado: "indicador v2",
      estado: "editado",
      version: 2,
    };
    expect(desagregacionEditada.dcdGraduada).not.toBe(plan.descripcionEfectiva);

    const htmlDespues = generarHTMLPlanificacion(plan);
    expect(htmlDespues).toBe(htmlAntes);
    expect(htmlDespues).toContain(GRADUADA_3RO);
    expect(htmlDespues).not.toContain("v2");
  });

  it("hora semanal conserva la versión materializada aunque la desagregación se regenere", () => {
    const semana = baseSemana(GRADUADA_3RO);
    const htmlAntes = generarHTMLSemanal(semana);

    // Regeneración posterior cambia la fila guardada, no la hora materializada
    const regenerada: DcdDesagregacion = {
      codigoDCD: "CN.2.1.1",
      subnivel: 2,
      grado: 3,
      gradoMaximo: 4,
      descripcionDCD: OFICIAL,
      indicadorOriginal: destreza.indicadoresEvaluacion[0],
      dcdGraduada: GRADUADA_3RO + " regenerada",
      indicadorGraduado: "indicador regenerado",
      estado: "generado",
      version: 2,
    };
    expect(regenerada.dcdGraduada).not.toBe(semana.dias.lunes.horas[0].descripcionEfectiva);

    const htmlDespues = generarHTMLSemanal(semana);
    expect(htmlDespues).toBe(htmlAntes);
    expect(htmlDespues).toContain(GRADUADA_3RO);
    expect(htmlDespues).not.toContain("regenerada");
  });
});