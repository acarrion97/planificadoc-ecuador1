/**
 * Cobertura de la corrección de la evaluación diagnóstica de "Conecta, Nivela
 * y Crea" contra "Herramientas sugeridas para la evaluación diagnóstica"
 * (MinEduc, 2026): las cuatro herramientas oficiales, la taxonomía de Marzano,
 * la escala cualitativa de la rúbrica diagnóstica, y la separación entre el
 * INSTRUMENTO de diagnóstico y las preguntas de reflexión del cierre.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: JSON.stringify({
      metodologiaDeclaradaSugerida: "Círculo de lectura",
      actividadesAdaptacionSugeridas: ["Actividad 1"],
      duaActividadesAdaptacionSugeridas: [{ I: true, R: true, A: true }],
      tecnicaDiagnosticoSugerida: ["Lista de cotejo tras el conversatorio inicial"],
      duaTecnicaDiagnosticoSugerida: [{ I: false, R: true, A: true }],
      actividadesNivelacionSugeridas: [],
      proyectoSugerido: {
        titulo: "P", descripcion: "D", areasIntegradas: ["LL"],
        productoFinal: "PF", actividadesSemana4: [], actividadesSemana5: [],
        destrezasReforzadas: [], evidenciasCognitivas: [], evidenciasActitudinales: [],
        esEvaluacionFormativaOficial: true,
      },
      cronogramaSemanal: "C",
      recursosSemana1Sugeridos: [],
      actividadesEvaluativasNivelacionSugeridas: [],
      preguntas: [{
        enunciado: "e", tipo: "opcion_multiple", dificultad: "basica", puntaje: 1,
        dcdCodigo: "LL.2.1.1", opciones: [{ texto: "a", esCorrecta: true }],
      }],
    }) } }],
  })),
  repairJson: (s: string) => s,
}));

vi.mock("../server/db", () => ({ getDb: vi.fn(async () => null) }));

import { invokeLLM } from "../server/_core/llm";
import { cncRouter } from "../server/cnc-router";
import { evaluacionRouter } from "../server/evaluacion-router";
import { semana1ConSugerenciasIA } from "../lib/cnc-diagnostico";
import {
  ESCALA_VALORACION_DIAGNOSTICA,
  ETAPAS_MARZANO_DIAGNOSTICO,
  HERRAMIENTAS_DIAGNOSTICAS_OFICIALES,
  enfasisMarzanoPorSubnivel,
  textoHerramientasDiagnosticasOficiales,
} from "../lib/curriculo-prerrequisitos";
import type { ConectaNivelaCreaAiResult, Semana1CNC } from "../data/types-cnc";

function ultimoPrompt(): string {
  const llamadas = (invokeLLM as any).mock.calls;
  return llamadas[llamadas.length - 1][0].messages[1].content as string;
}

function formBase(overrides: Record<string, any> = {}) {
  return {
    institucion: "E", docente: "D", anioLectivo: "2026-2027",
    grado: "3.° EGB", paralelo: "A", subnivel: "Básica Elemental",
    modalidad: "general" as const,
    semana1: {
      metodologiaDeclarada: "",
      actividadesAdaptacion: [],
      instrumentosDiagnostico: [],
      diagnosticoAcademico: [{
        destrezaCodigo: "LL.2.1.1", destrezaDescripcion: "Destreza de prueba",
        area: "LL" as const, observaciones: "", nivelDetectado: "en_proceso" as const,
      }],
      diagnosticoSocioemocional: [],
      coordinacionDece: "",
      tecnicasReflexion: [],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL"] },
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

describe("Catálogo de herramientas oficiales (MinEduc 2026)", () => {
  it("registra exactamente las cuatro herramientas que nombra la fuente", () => {
    expect(HERRAMIENTAS_DIAGNOSTICAS_OFICIALES.map((h) => h.nombre)).toEqual([
      "Preguntas de diagnóstico abiertas",
      "Rúbrica cualitativa",
      "Lista de cotejo",
      "Prueba objetiva",
    ]);
  });

  it("la escala de la rúbrica diagnóstica es cualitativa, sin rangos numéricos", () => {
    expect(ESCALA_VALORACION_DIAGNOSTICA).toEqual([
      "Inicial", "En desarrollo", "Alcanzado", "Destacado",
    ]);
    for (const nivel of ESCALA_VALORACION_DIAGNOSTICA) {
      expect(nivel).not.toMatch(/\d/);
    }
  });

  it("recoge las cinco etapas del sistema cognitivo de Marzano", () => {
    expect(ETAPAS_MARZANO_DIAGNOSTICO).toHaveLength(5);
    expect(ETAPAS_MARZANO_DIAGNOSTICO).toContain("metacognición");
  });

  it("solo calibra el énfasis cognitivo de los subniveles que la fuente ejemplifica", () => {
    expect(enfasisMarzanoPorSubnivel(2)).toContain("comprensión");   // Elemental
    expect(enfasisMarzanoPorSubnivel(4)).toContain("análisis");      // Superior
    expect(enfasisMarzanoPorSubnivel(5)).toContain("aplicación");    // Bachillerato
    // Media no aparece en el ejemplo de la fuente: se informa, no se inventa.
    expect(enfasisMarzanoPorSubnivel(3)).toBeNull();
  });

  it("el bloque de texto nunca es null y advierte del error de la memorización", () => {
    const texto = textoHerramientasDiagnosticasOficiales(3);
    expect(texto).toContain("Prueba objetiva");
    expect(texto).toContain("memorización");
    expect(texto).toContain("CUALITATIVA");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("cncRouter.generate — Semana 1 recibe el marco diagnóstico oficial", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inyecta las cuatro herramientas oficiales dentro de la sección de Semana 1", async () => {
    await cncRouter.createCaller({} as any).generate({ form: formBase(), sessionId: "s" });
    const prompt = ultimoPrompt();
    const semana1 = prompt.slice(prompt.indexOf("SEMANA 1"), prompt.indexOf("SEMANAS 2-3"));
    for (const h of HERRAMIENTAS_DIAGNOSTICAS_OFICIALES) {
      expect(semana1).toContain(h.nombre);
    }
  });

  it("exige la escala cualitativa para la rúbrica diagnóstica y prohíbe la numérica de Semanas 4-5", async () => {
    await cncRouter.createCaller({} as any).generate({ form: formBase(), sessionId: "s" });
    const prompt = ultimoPrompt();
    expect(prompt).toContain("Inicial / En desarrollo / Alcanzado / Destacado");
    expect(prompt).toMatch(/escala numérica 10-1 pertenece solo a la rúbrica del proyecto/);
  });

  it("prohíbe explícitamente quedarse en la memorización", async () => {
    await cncRouter.createCaller({} as any).generate({ form: formBase(), sessionId: "s" });
    expect(ultimoPrompt()).toMatch(/NO pueden limitarse a la recuperación del conocimiento ni a la memorización/);
  });

  it("calibra el énfasis de Marzano por subnivel: Elemental ≠ Superior", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s" });
    expect(ultimoPrompt()).toContain("recuperación del conocimiento y comprensión");
    await caller.generate({ form: formBase({ grado: "8.° EGB" }), sessionId: "s" });
    expect(ultimoPrompt()).toContain("análisis (comparar y contrastar)");
  });

  it("Bachillerato Técnico también recibe las herramientas oficiales, pese a no tener calibración por subnivel", async () => {
    await cncRouter.createCaller({} as any).generate({
      form: formBase({ grado: "1ro BT", modalidad: "bt" as const }),
      sessionId: "s",
    });
    const prompt = ultimoPrompt();
    expect(prompt).not.toContain("CALIBRACIÓN CURRICULAR PARA ESTE SUBNIVEL");
    expect(prompt).toContain("HERRAMIENTAS OFICIALES PARA LA EVALUACIÓN DIAGNÓSTICA");
    expect(prompt).toContain("Lista de cotejo");
  });

  it("un plan legado sin el campo instrumentosDiagnostico no rompe el prompt", async () => {
    const { instrumentosDiagnostico, ...semana1Legado } = formBase().semana1 as any;
    await expect(
      cncRouter.createCaller({} as any).generate({
        form: formBase({ semana1: semana1Legado }),
        sessionId: "s",
      })
    ).resolves.toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("sugerirReflexionDece — reflexión es metacognición, no el instrumento", () => {
  beforeEach(() => vi.clearAllMocks());

  it("pide preguntas de metacognición dirigidas al estudiantado y las separa del instrumento", async () => {
    await cncRouter.createCaller({} as any).sugerirReflexionDece({
      diagnosticoAcademico: [], diagnosticoSocioemocional: [],
    });
    const prompt = ultimoPrompt();
    expect(prompt).toContain("METACOGNICIÓN");
    expect(prompt).toContain("AL ESTUDIANTADO");
    expect(prompt).toMatch(/NO son el instrumento de diagnóstico/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("semana1ConSugerenciasIA — el instrumento no puede caer en las preguntas de reflexión", () => {
  const ai = {
    metodologiaDeclaradaSugerida: "Círculo de lectura",
    actividadesAdaptacionSugeridas: ["Act IA"],
    duaActividadesAdaptacionSugeridas: [{ implicacion: true, representacion: false, accionExpresion: false }],
    tecnicaDiagnosticoSugerida: ["Lista de cotejo tras el conversatorio"],
    duaTecnicaDiagnosticoSugerida: [{ implicacion: false, representacion: true, accionExpresion: true }],
  } as unknown as ConectaNivelaCreaAiResult;

  const vacia: Semana1CNC = {
    metodologiaDeclarada: "",
    actividadesAdaptacion: [],
    instrumentosDiagnostico: [],
    diagnosticoAcademico: [],
    diagnosticoSocioemocional: [],
    coordinacionDece: "",
    tecnicasReflexion: [],
  };

  it("la técnica sugerida aterriza en instrumentosDiagnostico, NUNCA en tecnicasReflexion (regresión)", () => {
    const r = semana1ConSugerenciasIA(vacia, ai);
    expect(r.instrumentosDiagnostico).toEqual(["Lista de cotejo tras el conversatorio"]);
    expect(r.tecnicasReflexion).toEqual([]);
  });

  it("conserva el DUA del instrumento en lugar de descartarlo", () => {
    const r = semana1ConSugerenciasIA(vacia, ai);
    expect(r.duaInstrumentosDiagnostico).toEqual([
      { implicacion: false, representacion: true, accionExpresion: true },
    ]);
  });

  it("no pisa el instrumento que el docente ya escribió, ni le pega un DUA de índices ajenos", () => {
    const r = semana1ConSugerenciasIA(
      { ...vacia, instrumentosDiagnostico: ["Rúbrica cualitativa propia", "Prueba objetiva propia"] },
      ai
    );
    expect(r.instrumentosDiagnostico).toEqual(["Rúbrica cualitativa propia", "Prueba objetiva propia"]);
    expect(r.duaInstrumentosDiagnostico).toBeUndefined();
  });

  it("no toca las preguntas de reflexión que el docente o el DECE ya cargaron", () => {
    const r = semana1ConSugerenciasIA(
      { ...vacia, tecnicasReflexion: ["¿Qué nos falta por aprender?"] },
      ai
    );
    expect(r.tecnicasReflexion).toEqual(["¿Qué nos falta por aprender?"]);
    expect(r.instrumentosDiagnostico).toEqual(["Lista de cotejo tras el conversatorio"]);
  });

  it("respeta la metodología y las actividades propias del docente (comportamiento previo intacto)", () => {
    const r = semana1ConSugerenciasIA(
      { ...vacia, metodologiaDeclarada: "Juego-trabajo", actividadesAdaptacion: ["Mi actividad"] },
      ai
    );
    expect(r.metodologiaDeclarada).toBe("Juego-trabajo");
    expect(r.actividadesAdaptacion).toEqual(["Mi actividad"]);
    expect(r.duaActividadesAdaptacion).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("evaluacionRouter.sugerirPreguntas — la prueba diagnóstica según la fuente", () => {
  beforeEach(() => vi.clearAllMocks());

  const dcds = [{
    codigo: "LL.2.1.1", descripcion: "Destreza de prueba",
    indicadores: ["Indicador real"], criterios: [],
  }];

  it("exige planteamiento (situación previa) en todo ítem", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    expect(ultimoPrompt()).toContain("PLANTEAMIENTO OBLIGATORIO");
  });

  it("nombra los cuatro formatos de ítem de la prueba objetiva", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    const prompt = ultimoPrompt();
    for (const formato of ["formato simple", "ordenamiento", "completamiento", "emparejamiento"]) {
      expect(prompt).toContain(formato);
    }
  });

  it("exige las cuatro características de la prueba objetiva", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    const prompt = ultimoPrompt();
    for (const c of ["objetividad", "validez", "confiabilidad", "intencionalidad"]) {
      expect(prompt).toContain(c);
    }
  });

  it("prohíbe los ítems puramente memorísticos del tipo \"¿Qué es X?\"", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    expect(ultimoPrompt()).toMatch(/ERROR MÁS FRECUENTE/);
  });

  it("pide una pregunta objetiva y una abierta por destreza, no dos del mismo tipo", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    expect(ultimoPrompt()).toContain("Nunca las dos del mismo tipo");
  });

  it("calibra el énfasis de Marzano con el subnivel recibido", async () => {
    const caller = evaluacionRouter.createCaller({} as any);
    await caller.sugerirPreguntas({ dcds, subnivel: 5 });
    expect(ultimoPrompt()).toContain("aplicación");
    await caller.sugerirPreguntas({ dcds, subnivel: 4 });
    expect(ultimoPrompt()).toContain("análisis (comparar y contrastar)");
  });

  it("sin subnivel cae en la regla general, sin inventar un énfasis", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    expect(ultimoPrompt()).toContain("La fuente oficial no ejemplifica un énfasis cognitivo");
  });

  it("exige retroalimentación descriptiva que promueva la metacognición", async () => {
    await evaluacionRouter.createCaller({} as any).sugerirPreguntas({ dcds });
    expect(ultimoPrompt()).toMatch(/retroalimentación descriptiva dirigida al estudiantado/);
  });
});
