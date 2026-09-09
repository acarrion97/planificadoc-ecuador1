import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: JSON.stringify({
      metodologiaDeclaradaSugerida: "Círculo de lectura",
      actividadesAdaptacionSugeridas: ["Actividad 1", "Actividad 2"],
      duaActividadesAdaptacionSugeridas: [{ I: true, R: false, A: false }, { I: false, R: false, A: false }],
      tecnicaDiagnosticoSugerida: ["Lista de cotejo"],
      duaTecnicaDiagnosticoSugerida: [{ I: false, R: false, A: false }],
      actividadesNivelacionSugeridas: [],
      proyectoSugerido: {
        titulo: "Proyecto de prueba",
        descripcion: "Descripción de prueba",
        areasIntegradas: ["LL", "M"],
        productoFinal: "Producto de prueba",
        actividadesSemana4: ["Actividad S4"],
        actividadesSemana5: ["Actividad S5"],
        destrezasReforzadas: [],
        evidenciasCognitivas: [],
        evidenciasActitudinales: [],
        esEvaluacionFormativaOficial: true,
      },
      cronogramaSemanal: "Resumen de prueba",
      recursosSemana1Sugeridos: [],
      actividadesEvaluativasNivelacionSugeridas: [],
    }) } }],
  })),
  repairJson: (s: string) => s,
}));

vi.mock("../server/db", () => ({
  getDb: vi.fn(async () => null),
}));

import { invokeLLM } from "../server/_core/llm";
import { cncRouter } from "../server/cnc-router";

function ultimoPromptEnviado(): string {
  const llamadas = (invokeLLM as any).mock.calls;
  const ultima = llamadas[llamadas.length - 1][0];
  return ultima.messages[1].content as string;
}

function formBase(overrides: Partial<Record<string, any>> = {}) {
  return {
    institucion: "Escuela de prueba",
    docente: "Docente de prueba",
    anioLectivo: "2026-2027",
    grado: "3.° EGB",
    paralelo: "A",
    subnivel: "Básica Elemental",
    modalidad: "general" as const,
    semana1: {
      metodologiaDeclarada: "",
      actividadesAdaptacion: [],
      diagnosticoAcademico: [{ destrezaCodigo: "LL.2.1.1", destrezaDescripcion: "Destreza de prueba", area: "LL" as const, observaciones: "", nivelDetectado: "en_proceso" as const }],
      diagnosticoSocioemocional: [],
      coordinacionDece: "",
      tecnicasReflexion: [],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL", "M"] },
    ...overrides,
  };
}

describe("cncRouter.generate — calibración curricular en Semana 1", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Básica Elemental (3.° EGB) recibe las estrategias oficiales del subnivel en el prompt", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("círculo de lectura");
    expect(prompt).toContain("teatro de cuentos");
    expect(prompt).toContain("Lineamientos Pedagógicos");
  });

  it("Semana 1 recibe las estrategias del subnivel dentro de su propia sección del prompt", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    const inicioSemana1 = prompt.indexOf("SEMANA 1");
    const inicioSemana23 = prompt.indexOf("SEMANAS 2-3");
    expect(inicioSemana1).toBeGreaterThan(-1);
    expect(inicioSemana23).toBeGreaterThan(inicioSemana1);
    expect(prompt.slice(inicioSemana1, inicioSemana23)).toContain("círculo de lectura");
  });

  it("un subnivel distinto (8.° EGB, Básica Superior) NO recibe las estrategias de Elemental", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "8.° EGB" }), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    expect(prompt).not.toContain("círculo de lectura");
    expect(prompt).not.toContain("teatro de cuentos");
  });

  it("Bachillerato Técnico NO recibe la calibración por subnivel (usa contextoBT en su lugar)", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({
      form: formBase({ grado: "1ro BT", modalidad: "bt" as const }),
      sessionId: "s1",
    });
    const prompt = ultimoPromptEnviado();
    expect(prompt).not.toContain("CALIBRACIÓN CURRICULAR PARA ESTE SUBNIVEL");
  });

  it("un grado no reconocible (subnivelDesdeGrado -> null) NO rompe el prompt: omite la calibración sin inventar ni crashear", async () => {
    const caller = cncRouter.createCaller({} as any);
    await expect(
      caller.generate({ form: formBase({ grado: "curso sin formato reconocible" }), sessionId: "s1" })
    ).resolves.toBeDefined();
    const prompt = ultimoPromptEnviado();
    expect(prompt).not.toContain("CALIBRACIÓN CURRICULAR PARA ESTE SUBNIVEL");
    // Salida segura: la sección de Semana 1 sigue presente y bien formada aunque no haya calibración.
    expect(prompt).toContain("SEMANA 1 — CONECTA");
  });

  it("un valor legacy en el campo de texto libre input.subnivel NO afecta la calibración (se deriva siempre de grado, nunca de ese campo)", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({
      form: formBase({ grado: "3.° EGB", subnivel: "texto-legado-inconsistente-de-otra-version" }),
      sessionId: "s1",
    });
    const prompt = ultimoPromptEnviado();
    // La calibración de Elemental se aplica igual, pese al campo subnivel corrupto/desactualizado.
    expect(prompt).toContain("círculo de lectura");
  });

  it("la metodología (estrategia) y la calibración del instrumento aparecen como bloques DISTINTOS, uno no reemplaza al otro", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("Estrategias metodológicas respaldadas por los Lineamientos Pedagógicos 2026-2027");
    expect(prompt).toContain("Calibración del instrumento/evidencia diagnóstica para este subnivel");
    // Ambos deben coexistir: ninguno sustituye al otro.
    expect(prompt.indexOf("Estrategias metodológicas")).toBeLessThan(prompt.indexOf("Calibración del instrumento"));
  });

  it("DUA sigue presente: el prompt exige indicadores DUA por actividad e instrumento", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("DUA (Diseño Universal para el Aprendizaje)");
    expect(prompt).toMatch(/GARANTIZA que.*3 principios/);
  });

  it("la respuesta normaliza el DUA para garantizar los 3 principios cubiertos, incluso si la IA los omite", async () => {
    const caller = cncRouter.createCaller({} as any);
    const res = await caller.generate({ form: formBase({ grado: "3.° EGB" }), sessionId: "s1" });
    const dua = res.aiResult.duaActividadesAdaptacionSugeridas!;
    expect(dua.some((d) => d.implicacion)).toBe(true);
    expect(dua.some((d) => d.representacion)).toBe(true);
    expect(dua.some((d) => d.accionExpresion)).toBe(true);
  });
});

describe("Fusión interdisciplinaria LL + Matemática — mismo comportamiento en generate() y sugerirProyecto()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("generate(): con 2 áreas integradas, el prompt exige articulación auténtica (no pistas paralelas)", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({
      form: formBase({ semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL", "M"] } }),
      sessionId: "s1",
    });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("articulación auténtica entre las áreas");
    expect(prompt).toContain("no un área con la otra apenas mencionada");
  });

  it("generate(): no exige que CADA actividad evalúe ambas áreas a la vez", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({ form: formBase(), sessionId: "s1" });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("NO significa que cada actividad individual");
  });

  it("sugerirProyecto(): conserva la MISMA instrucción de fusión que generate()", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.sugerirProyecto({
      modalidad: "general",
      grado: "3.° EGB",
      diagnosticoAcademico: [],
      actividadesNivelacion: [],
      semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL", "M"] },
    });
    const prompt = ultimoPromptEnviado();
    expect(prompt).toContain("articulación auténtica entre las áreas");
    expect(prompt).toContain("NO significa que cada actividad individual");
  });

  it("sugerirProyecto() en modalidad BT no incluye la instrucción de fusión de áreas (usa productoAcreditable, no areasIntegradas)", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.sugerirProyecto({
      modalidad: "bt",
      grado: "1ro BT",
      diagnosticoAcademico: [],
      actividadesNivelacion: [],
    });
    const prompt = ultimoPromptEnviado();
    expect(prompt).not.toContain("articulación auténtica entre las áreas");
  });

  it("una sola área integrada: el prompt igual construye normalmente (la regla de fusión no rompe el caso de un área)", async () => {
    const caller = cncRouter.createCaller({} as any);
    await expect(
      caller.generate({
        form: formBase({ semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL"] } }),
        sessionId: "s1",
      })
    ).resolves.toBeDefined();
  });

  it("la instrucción de fusión es genérica para N áreas, no está limitada semánticamente a exactamente LL+M", async () => {
    const caller = cncRouter.createCaller({} as any);
    await caller.generate({
      form: formBase({ semana4y5: { titulo: "", descripcion: "", areasIntegradas: ["LL", "M", "CN"] } }),
      sessionId: "s1",
    });
    const prompt = ultimoPromptEnviado();
    // La instrucción sigue apareciendo igual con 3 áreas (LL+M es solo el ejemplo entre paréntesis del texto,
    // la condición real es areasIntegradas.length > 1, no === 2).
    expect(prompt).toContain("articulación auténtica entre las áreas");
    expect(prompt).toContain("CN");
  });
});
