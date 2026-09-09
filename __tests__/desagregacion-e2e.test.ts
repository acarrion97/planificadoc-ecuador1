import { describe, it, expect, vi, beforeEach } from "vitest";
import JSZip from "jszip";

import { buscarPorCodigo } from "../data";
import { generarHTMLPlanificacion, generarHTMLSemanal } from "../lib/pdf-generator";
import { generarWordPca } from "../lib/pca-word-generator";
import { generarWordPcaTrimestral } from "../lib/pca-trimestral-word-generator";
import type { Planificacion, PlanificacionSemanal, HoraSemanal } from "../data/types";

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({ choices: [{ message: { content: "" } }] })),
  repairJson: (s: string) => s,
}));

import { invokeLLM } from "../server/_core/llm";
import { generarDesagregacionDCD } from "../server/dcd-desagregacion-service";

const destreza = buscarPorCodigo("CN.2.1.1")!;
const OFICIAL = destreza.descripcion;
const GRADUADA_3RO =
  "Observar las etapas del ciclo vital del ser humano e identificar sus cambios de acuerdo a la edad (versión graduada 3.º)";

async function textoDocx(blob: Blob): Promise<string> {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const xml = await zip.file("word/document.xml")!.async("string");
  return xml.replace(/<w:tab\/>/g, " ").replace(/<[^>]+>/g, "");
}

function formDataPca(seleccionDesagregada: unknown, seleccionOficial: unknown) {
  return {
    institucion: "Unidad Educativa Test",
    docente: "Docente Test",
    area: "Ciencias Naturales",
    subnivel: 2,
    grado: "3.º EGB",
    anioLectivo: "2025-2026",
    paralelo: "A",
    cargaHorariaSemanal: 5,
    semanasTrabajoTotal: 40,
    semanasTotal: 40,
    semanasEvaluacion: 8,
    usaEjesTransversales: false,
    ejesTransversales: [],
    metodologiasActivas: ["indagacion"],
    tecnicasEvaluacion: ["observacion"],
    modeloPedagogico: "Constructivista",
    trimestre: "Primero",
    unidades: [
      { id: 1, numero: 1, dcdsSeleccionadas: [seleccionDesagregada], duracionSemanas: 6 },
      { id: 2, numero: 2, dcdsSeleccionadas: [seleccionOficial], duracionSemanas: 6 },
    ],
    bibliografiaDocente: "",
    firmaElaboradoPor: "",
    firmaElaboradoFecha: "",
    firmaRevisadoPor: "",
    firmaRevisadoFecha: "",
    firmaAprobadoPor: "",
    firmaAprobadoFecha: "",
  };
}

function basePlan(descripcionEfectiva?: string): Planificacion {
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
    ...(descripcionEfectiva ? { descripcionEfectiva } : {}),
  };
}

function baseSemana(descripcionEfectiva?: string): PlanificacionSemanal {
  const hora: HoraSemanal = {
    id: "h1",
    codigoDestreza: destreza.codigo,
    destreza,
    ...(descripcionEfectiva ? { descripcionEfectiva } : {}),
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
      lunes: { activo: true, cantidadHoras: 1 as const, horas: [hora] },
      martes: diaInactivo,
      miercoles: diaInactivo,
      jueves: diaInactivo,
      viernes: diaInactivo,
    },
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  };
}

describe("E2E: seleccionar CN.2.1.1 en 3.º EGB → desagregar → elegir versión → consumir", () => {
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
                },
                {
                  grado: 3,
                  dcdGraduada: GRADUADA_3RO,
                  indicadorGraduado: "I.CN.2.1.1. (versión graduada)",
                },
              ],
            }),
          },
        },
      ],
    });
  });

  it("flujo completo: generar ladder, elegir la versión de 3.º y materializarla en los cuatro documentos", async () => {
    // 1) Desagregar CN.2.1.1 → ladder completo
    const { filas } = await generarDesagregacionDCD("CN.2.1.1");
    expect(filas.map((f) => f.grado)).toEqual([2, 3, 4]);

    // 2) Elegir la versión de 3.º EGB (la del grado de contexto)
    const versionTres = filas.find((f) => f.grado === 3)!;
    const seleccionDesagregada = {
      codigo: "CN.2.1.1",
      enunciado: versionTres.dcdGraduada,
      origen: "desagregada" as const,
      grado: 3,
    };

    // 3) Otra planificación elige la DCD oficial
    const seleccionOficial = { codigo: "CN.2.1.1", enunciado: OFICIAL };

    // 4) PCA: la unidad con versión desagregada muestra la graduada; la oficial muestra la oficial
    const pca = await textoDocx(await generarWordPca(formDataPca(seleccionDesagregada, seleccionOficial), { unidades: [] }));
    expect(pca).toContain(`CN.2.1.1: ${GRADUADA_3RO}`);
    expect(pca).toContain(`CN.2.1.1: ${OFICIAL}`);

    // 5) PCT trimestral: mismo comportamiento
    const pct = await textoDocx(await generarWordPcaTrimestral(formDataPca(seleccionDesagregada, seleccionOficial), { unidades: [] }));
    expect(pct).toContain(`CN.2.1.1: ${GRADUADA_3RO}`);
    expect(pct).toContain(`CN.2.1.1: ${OFICIAL}`);

    // 6) Semanal: hora con la versión materializada vs hora con DCD oficial
    const semanalGraduada = generarHTMLSemanal(baseSemana(GRADUADA_3RO));
    expect(semanalGraduada).toContain(GRADUADA_3RO);
    expect(semanalGraduada).not.toContain(OFICIAL);
    const semanalOficial = generarHTMLSemanal(baseSemana());
    expect(semanalOficial).toContain(OFICIAL);
    expect(semanalOficial).not.toContain(GRADUADA_3RO);

    // 7) Plan de unidad: mismo criterio
    const planGraduada = generarHTMLPlanificacion(basePlan(GRADUADA_3RO));
    expect(planGraduada).toContain(GRADUADA_3RO);
    expect(planGraduada).not.toContain(OFICIAL);
    const planOficial = generarHTMLPlanificacion(basePlan());
    expect(planOficial).toContain(OFICIAL);
    expect(planOficial).not.toContain(GRADUADA_3RO);

    // 8) El último grado del ladder es exactamente el texto oficial (sin IA)
    const ultimo = filas.find((f) => f.grado === 4)!;
    expect(ultimo.dcdGraduada).toBe(destreza.descripcion);
  });

  it("la selección oficial no lleva grado y no desencadena materialización graduada", () => {
    const seleccionOficial = { codigo: "CN.2.1.1", enunciado: OFICIAL };
    expect((seleccionOficial as any).grado).toBeUndefined();
    const html = generarHTMLPlanificacion(basePlan());
    expect(html).toContain(OFICIAL);
    expect(html).not.toContain(GRADUADA_3RO);
  });
});