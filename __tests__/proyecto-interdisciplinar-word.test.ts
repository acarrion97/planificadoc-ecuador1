import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { generarProyectoInterdisciplinarWord } from "../lib/proyecto-interdisciplinar-word-generator";
import {
  rubricaDisciplinarPorDefecto,
  rubricaInterdisciplinarPorDefecto,
} from "../data/proyecto-interdisciplinar-formato";
import { MATERIAS_EGB_BGU } from "../data/competencias-especificas-egb-bgu";

function planBase(baseCurricular: "destrezas" | "competencias"): any {
  return {
    id: "x",
    sessionId: "s",
    baseCurricular,
    titulo: "Descubriendo números",
    objetivoGeneral: "Analizar.",
    productoFinal: "Presentación",
    duracion: "4 semanas",
    institucion: "Escuela",
    docentesParticipantes: [],
    areas: [
      { id: "M", areaId: "M", nombreArea: "Matemática", nivel: "EGB Media", subnivel: "EGB Media", grado: "7.° EGB" },
      { id: "LL", areaId: "LL", nombreArea: "Lengua y Literatura", nivel: "EGB Media", subnivel: "EGB Media", grado: "7.° EGB" },
    ],
    elementosCurriculares: [
      { areaProyectoId: "M", codigo: "M.3.1.1", curriculumVersion: "destrezas-2016", area: "M", nivel: "EGB Media", grado: "7.° EGB" },
      { areaProyectoId: "LL", codigo: "LL.3.3.13", curriculumVersion: "destrezas-2016", area: "LL", nivel: "EGB Media", grado: "7.° EGB" },
    ],
    actividades: [
      {
        id: "a1",
        fase: "planificacion",
        actividad: "Investigar",
        recursos: "Internet",
        evidencia: "Listado",
        evaluacion: "Revisión",
        instrumentoEvaluacion: "Lista de cotejo: fuentes y conclusiones",
        orderIndex: 0,
      },
    ],
    evaluacionGeneral: "Rúbrica.",
    createdAt: "",
    updatedAt: "",
    status: "generado",
  };
}

async function documentXml(plan: any): Promise<string> {
  const blob = await generarProyectoInterdisciplinarWord(plan);
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  return (await zip.file("word/document.xml")!.async("text")) as string;
}

describe("Word de Proyecto Interdisciplinar", () => {
  it("con destrezas no dibuja las columnas de saberes (siempre vacías)", async () => {
    const xml = await documentXml(planBase("destrezas"));

    expect(xml).toContain("Destreza con criterio de desempeño");
    expect(xml).toContain("Indicadores de evaluación");
    expect(xml).not.toContain("Saberes declarativos");
    expect(xml).not.toContain("Saberes procedimentales");
    expect(xml).not.toContain("Saberes actitudinales");
  });

  it("con competencias sí incluye las columnas de saberes", async () => {
    const xml = await documentXml(planBase("competencias"));

    expect(xml).toContain("Competencia específica");
    expect(xml).toContain("Saberes declarativos");
    expect(xml).toContain("Saberes actitudinales");
  });

  it("en competencias, cada indicador de evaluación lleva su código (formato oficial)", async () => {
    const materia = MATERIAS_EGB_BGU.find((m) => m.id === "matematica")!;
    const ce = materia.competencias.find((c) => c.porGrado.some((g) => g.indicadores.length > 0))!;
    const bloque = ce.porGrado.find((g) => g.indicadores.some((i) => i.codigo))!;
    const indicador = bloque.indicadores.find((i) => i.codigo)!;

    const plan = planBase("competencias");
    plan.areas = [
      { id: "M", areaId: "M", nombreArea: "Matemática", nivel: bloque.nivel, subnivel: bloque.nivel, grado: bloque.grado },
    ];
    plan.elementosCurriculares = [
      { areaProyectoId: "M", codigo: ce.codigo, curriculumVersion: "cnc", area: "M", nivel: bloque.nivel, grado: bloque.grado },
    ];

    const xml = await documentXml(plan);
    // P. ej. "I.M.2.5.2." — el código debe anteceder al texto del indicador.
    expect(xml).toContain(`${indicador.codigo}.`);
  });

  it("muestra el instrumento de evaluación de la actividad", async () => {
    const xml = await documentXml(planBase("destrezas"));
    expect(xml).toContain("Lista de cotejo: fuentes y conclusiones");
  });

  it("las filas de planificación no se parten entre páginas", async () => {
    const xml = await documentXml(planBase("destrezas"));
    expect(xml).toContain("<w:cantSplit");
  });

  it("replica las 5 fases oficiales con su pregunta orientadora y resultado", async () => {
    const xml = await documentXml(planBase("destrezas"));

    expect(xml).toContain("1. Planificación");
    expect(xml).toContain("2. Organización, investigación (asignación de roles)");
    expect(xml).toContain("3. Ejecución e integración de saberes para la creación del producto");
    expect(xml).toContain("4. Socialización, presentación y difusión");
    expect(xml).toContain("5. Evaluación, reflexión y metacognición");
    expect(xml).toContain("¿Qué vamos a investigar y para qué?");
    expect(xml).toContain("Propósito, desafío y preguntas");
    expect(xml).toContain("Metacognición y compromisos");
  });

  it("migra la fase legacy gestion a la fase oficial de organización", async () => {
    const plan = planBase("destrezas");
    plan.actividades.push({
      id: "a2",
      fase: "gestion",
      actividad: "Formar equipos con roles",
      recursos: "Papelógrafo",
      evidencia: "Plan de trabajo",
      evaluacion: "Observación",
      orderIndex: 1,
    });

    const xml = await documentXml(plan);
    expect(xml).toContain("Formar equipos con roles");
  });

  it("incluye los datos informativos del formato oficial (año lectivo, trimestre, paralelo)", async () => {
    const plan = planBase("destrezas");
    plan.anioLectivo = "2026–2027";
    plan.trimestre = "1";
    plan.paralelo = "B";

    const xml = await documentXml(plan);
    expect(xml).toContain("Año lectivo");
    expect(xml).toContain("2026–2027");
    expect(xml).toContain("Trimestre");
    expect(xml).toContain("Grado/Curso y paralelo");
    expect(xml).toContain("Paralelo B");
  });

  it("renderiza la sección por asignatura con actividades y recursos por fase", async () => {
    const plan = planBase("destrezas");
    plan.detalleAreas = [
      {
        areaProyectoId: "LL",
        fases: [
          {
            fase: "planificacion",
            semana: "Semana 1",
            actividades: ["Diseñar preguntas de la entrevista"],
            recursos: ["Tarjetas visuales"],
          },
        ],
      },
    ];

    const xml = await documentXml(plan);
    expect(xml).toContain("PROYECTO INTERDISCIPLINARIO");
    expect(xml).toContain("LENGUA Y LITERATURA");
    expect(xml).toContain("Diseñar preguntas de la entrevista");
    expect(xml).toContain("Tarjetas visuales");
    expect(xml).toContain("Semana 1");
  });

  it("renderiza el planificación día a día", async () => {
    const plan = planBase("destrezas");
    plan.diaPorDia = [
      {
        fase: "planificacion",
        dia: "Día 1",
        fecha: "Lunes",
        actividad: "El termómetro de nuestra atención",
        productoDiario: "Lista grupal de compromisos",
      },
    ];

    const xml = await documentXml(plan);
    expect(xml).toContain("Planificación día a día");
    expect(xml).toContain("Día 1");
    expect(xml).toContain("Lunes");
    expect(xml).toContain("El termómetro de nuestra atención");
    expect(xml).toContain("Lista grupal de compromisos");
  });

  it("renderiza las rúbricas disciplinar e interdisciplinar con su fórmula de calificación", async () => {
    const plan = planBase("destrezas");
    plan.rubricaDisciplinar = rubricaDisciplinarPorDefecto("Matemática");
    plan.rubricaInterdisciplinar = rubricaInterdisciplinarPorDefecto();

    const xml = await documentXml(plan);
    // Rúbrica disciplinar: 5 criterios → 20 puntos.
    expect(xml).toContain("Instrumento de evaluación disciplinar");
    expect(xml).toContain("Criterio disciplinar");
    expect(xml).toContain("Puntaje máximo: 20 puntos (4 puntos por criterio).");
    expect(xml).toContain("Calificación disciplinar = (puntaje obtenido ÷ 20) × 10");
    // Rúbrica interdisciplinar: 6 criterios → 24 puntos.
    expect(xml).toContain("Instrumento de evaluación interdisciplinar");
    expect(xml).toContain("Integración de aprendizajes");
    expect(xml).toContain("Puntaje máximo: 24 puntos (4 puntos por criterio).");
    expect(xml).toContain("Calificación interdisciplinar = (puntaje obtenido ÷ 24) × 10");
    // Regla del promedio final.
    expect(xml).toContain("Nota final del proyecto en cada asignatura = (calificación disciplinar + calificación interdisciplinar) ÷ 2");
    // Niveles del formato oficial.
    expect(xml).toContain("4 – Logro destacado");
    expect(xml).toContain("1 – Requiere apoyo");
  });
});
