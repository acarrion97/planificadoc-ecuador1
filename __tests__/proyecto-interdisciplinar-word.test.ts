import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { generarProyectoInterdisciplinarWord } from "../lib/proyecto-interdisciplinar-word-generator";

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

  it("muestra el instrumento de evaluación de la actividad", async () => {
    const xml = await documentXml(planBase("destrezas"));
    expect(xml).toContain("Lista de cotejo: fuentes y conclusiones");
  });

  it("las filas de planificación no se parten entre páginas", async () => {
    const xml = await documentXml(planBase("destrezas"));
    expect(xml).toContain("<w:cantSplit");
  });
});
