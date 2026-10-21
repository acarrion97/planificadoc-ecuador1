/**
 * Plan piloto Currículo por Competencias (Sierra-Amazonía, Zona 6) — "Conecta
 * y nivela" de 3 semanas: sin Semanas 4-5 ni proyecto, con nota final de
 * abordaje curricular. Sin el interruptor, la salida sigue siendo la de 5 semanas.
 */
import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { generarHTMLPlanCNC } from "../lib/pdf-generator";
import { generarWordPlanCNC } from "../lib/cnc-word-generator";
import {
  pasosAplicablesCNC,
  TITULO_PLAN_PILOTO_CNC,
  NOTA_ABORDAJE_CURRICULAR_PILOTO,
  type PlanConectaNivelaCrea,
} from "../data/types-cnc";

function plan(overrides?: Partial<PlanConectaNivelaCrea>): PlanConectaNivelaCrea {
  return {
    id: "p1",
    institucion: "Escuela Test",
    docente: "Docente Test",
    anioLectivo: "2026-2027",
    grado: "7.° EGB",
    paralelo: "A",
    subnivel: "Media",
    fechaInicio: "2026-09-01",
    modalidad: "general",
    semana1: {
      metodologiaDeclarada: "Juego-trabajo",
      actividadesAdaptacion: ["Dinámica de bienvenida"],
      diagnosticoAcademico: [],
      diagnosticoSocioemocional: [],
      coordinacionDece: "",
      tecnicasReflexion: ["¿Qué me falta por aprender?"],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: {
      proyecto: {
        titulo: "Proyecto que no debe aparecer en el piloto",
        descripcion: "", areasIntegradas: [], objetivoAprendizaje: "",
        productoFinal: "", productoIntermedio: "", objetivoSemana4: "", objetivoSemana5: "",
        actividadesSemana4: [], actividadesSemana5: [], destrezasReforzadas: [],
        evidenciasCognitivas: [], evidenciasActitudinales: [],
        compromisos: "", autoevaluacion: [],
        esEvaluacionFormativaOficial: true,
      },
    },
    status: "generado",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

async function textoDocx(blob: Blob): Promise<string> {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  return (await zip.file("word/document.xml")!.async("string")).replace(/<[^>]+>/g, "");
}

describe("pasosAplicablesCNC", () => {
  it("omite el paso Semanas 4-5 (índice 3) solo en el plan piloto", () => {
    expect(pasosAplicablesCNC(false)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(pasosAplicablesCNC(undefined)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(pasosAplicablesCNC(true)).toEqual([0, 1, 2, 4, 5]);
  });
});

describe("generarHTMLPlanCNC — plan piloto", () => {
  it("usa el título del piloto, omite Semanas 4-5 y cierra con el abordaje curricular", () => {
    const html = generarHTMLPlanCNC(plan({ planPiloto: true }));
    expect(html).toContain(TITULO_PLAN_PILOTO_CNC.toUpperCase());
    expect(html).toContain("3 semanas");
    expect(html).toContain(NOTA_ABORDAJE_CURRICULAR_PILOTO);
    expect(html).not.toContain("SEMANAS 4-5");
    expect(html).not.toContain("Proyecto que no debe aparecer en el piloto");
  });

  it("sin el campo (planes guardados antes) mantiene las 5 semanas", () => {
    const html = generarHTMLPlanCNC(plan());
    expect(html).toContain("CONECTA, NIVELA Y CREA");
    expect(html).toContain("SEMANAS 4-5 — CREA");
    expect(html).not.toContain(NOTA_ABORDAJE_CURRICULAR_PILOTO);
  });
});

describe("generarWordPlanCNC — plan piloto", () => {
  it("genera el .docx sin Semanas 4-5 y con la nota de abordaje curricular", async () => {
    const texto = await textoDocx(await generarWordPlanCNC(plan({ planPiloto: true })));
    expect(texto).toContain(TITULO_PLAN_PILOTO_CNC.toUpperCase());
    expect(texto).toContain(NOTA_ABORDAJE_CURRICULAR_PILOTO);
    expect(texto).not.toContain("SEMANAS 4-5");
    expect(texto).not.toContain("Proyecto que no debe aparecer en el piloto");
  });

  it("sin piloto conserva la sección de Semanas 4-5", async () => {
    const texto = await textoDocx(await generarWordPlanCNC(plan({ planPiloto: false })));
    expect(texto).toContain("SEMANAS 4-5 — CREA");
    expect(texto).not.toContain(NOTA_ABORDAJE_CURRICULAR_PILOTO);
  });
});
