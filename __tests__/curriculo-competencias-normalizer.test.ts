import { describe, it, expect } from "vitest";
import {
  normalizarDcd,
  normalizarIndicador,
  normalizarActividad,
  normalizarFase,
  normalizarEstructuraDidactica,
  normalizarAdaptacionNEE,
  normalizarPlanificacionEGBBGU,
  normalizarPlanificacionInicial,
} from "../lib/curriculo-competencias-normalizer";
import type {
  DcdRaw,
  IndicadorRaw,
  ActividadRaw,
  FaseRaw,
  PlanificacionEGBBGURaw,
  PlanificacionInicialRaw,
} from "../lib/curriculo-competencias-normalizer";

// ============================================================
// HELPERS
// ============================================================

function makeSource() {
  return {
    source_document: "FORMATO TEST.docx",
    source_section: "Sección 1",
    source_reference: "ref-1",
    source_version: "1.0",
    normalized_at: expect.any(String),
  };
}

function actividadRaw(overrides: Partial<ActividadRaw> = {}): ActividadRaw {
  return {
    texto: "Resolver ejercicios de resta",
    competencia: "C",
    dua: { implicacion: true, representacion: false, accionExpresion: true },
    ...overrides,
  };
}

function faseRaw(overrides: Partial<FaseRaw> = {}): FaseRaw {
  return {
    titulo: "INICIO",
    duracionMinutos: 10,
    actividades: [actividadRaw()],
    ...overrides,
  };
}

// ============================================================
// NORMALIZACIÓN DCD
// ============================================================

describe("normalizarDcd", () => {
  it("produce DCD canónica con código normalizado", () => {
    const result = normalizarDcd(
      { codigo: "m.2.1.1", descripcion: "Representar conjuntos" },
      makeSource() as any
    );
    expect(result.codigo).toBe("M.2.1.1");
    expect(result.descripcion).toBe("Representar conjuntos");
    expect(result.competencias).toEqual([]);
    expect(result.source).toBeDefined();
  });

  it("preserva competencias asociadas", () => {
    const result = normalizarDcd({
      codigo: "L.3.2.1",
      competencias: ["C", "m"],
    });
    expect(result.competencias).toEqual(["C", "M"]);
  });

  it("usa descripción del catálogo si no se proporciona", () => {
    const result = normalizarDcd({ codigo: "M.2.1.1" });
    expect(result.descripcion).toBeTruthy();
  });

  it("sin SourceTraceability si no se provee sourceDocument", () => {
    const result = normalizarDcd({ codigo: "C.1.1.1" });
    expect(result.source).toBeUndefined();
  });
});

// ============================================================
// NORMALIZACIÓN INDICADOR
// ============================================================

describe("normalizarIndicador", () => {
  it("produce IndicadorSeleccionado válido", () => {
    const result = normalizarIndicador(
      {
        codigo: "I.M.2.1.1",
        texto: "Identifica conjuntos",
        competencia: "C",
      },
      makeSource() as any
    );
    expect(result.codigo).toBe("I.M.2.1.1");
    expect(result.texto).toBe("Identifica conjuntos");
    expect(result.competencia).toBe("C");
    expect(result.source).toBeDefined();
  });

  it("normaliza competencia a C si no se reconoce", () => {
    const result = normalizarIndicador({
      codigo: "I.X.1",
      texto: "Test",
      competencia: "XYZ",
    });
    expect(result.competencia).toBe("C");
  });

  it("produces competencia C por defecto si no se proporciona", () => {
    const result = normalizarIndicador({
      codigo: "I.X.1",
      texto: "Test",
    });
    expect(result.competencia).toBe("C");
  });
});

// ============================================================
// NORMALIZACIÓN ACTIVIDAD DIDÁCTICA
// ============================================================

describe("normalizarActividad", () => {
  it("produce ActividadDidactica con texto y competencia", () => {
    const result = normalizarActividad(
      actividadRaw({ texto: "Leer un cuento" })
    );
    expect(result.texto).toBe("Leer un cuento");
    expect(result.competencia).toBe("C");
    expect(result.dua).toEqual({
      implicacion: true,
      representacion: false,
      accionExpresion: true,
    });
  });

  it("usa DUA por defecto si no se provee", () => {
    const result = normalizarActividad(actividadRaw({ dua: undefined }));
    expect(result.dua).toEqual({
      implicacion: false,
      representacion: false,
      accionExpresion: false,
    });
  });

  it("normaliza competencia inválida a la default", () => {
    const result = normalizarActividad(
      actividadRaw({ competencia: "INVALID" }),
      "M"
    );
    expect(result.competencia).toBe("M");
  });
});

// ============================================================
// NORMALIZACIÓN FASE ESTRATÉGICA
// ============================================================

describe("normalizarFase", () => {
  it("produce FaseEstrategiaPlan con actividades normalizadas", () => {
    const result = normalizarFase(
      faseRaw({
        titulo: "DESARROLLO",
        duracionMinutos: 25,
        actividades: [
          actividadRaw({ texto: "Actividad 1" }),
          actividadRaw({ texto: "Actividad 2" }),
        ],
      })
    );
    expect(result.titulo).toBe("DESARROLLO");
    expect(result.duracionMinutos).toBe(25);
    expect(result.actividades).toHaveLength(2);
    expect(result.actividades[0].texto).toBe("Actividad 1");
  });

  it("asigna duración 0 si no se provee", () => {
    const result = normalizarFase(faseRaw({ duracionMinutos: undefined }));
    expect(result.duracionMinutos).toBe(0);
  });
});

// ============================================================
// NORMALIZACIÓN ESTRUCTURA DIDÁCTICA
// ============================================================

describe("normalizarEstructuraDidactica", () => {
  it("produce EstructuraDidactica con estrategia válida", () => {
    const result = normalizarEstructuraDidactica("erca", [
      faseRaw({ titulo: "INICIO" }),
      faseRaw({ titulo: "DESARROLLO" }),
      faseRaw({ titulo: "CIERRE" }),
    ]);
    expect(result.estrategiaId).toBe("erca");
    expect(result.fases).toHaveLength(3);
    expect(result.fases[0].titulo).toBe("INICIO");
  });

  it("preserva estrategiaId aunque no exista en catálogo", () => {
    const result = normalizarEstructuraDidactica("estrategia- custom", []);
    expect(result.estrategiaId).toBe("estrategia- custom");
  });
});

// ============================================================
// NORMALIZACIÓN ADAPTACIONES NEE
// ============================================================

describe("normalizarAdaptacionNEE", () => {
  it("produce AdaptacionNEE con campos por defecto", () => {
    const result = normalizarAdaptacionNEE({});
    expect(result.grado).toBe(1);
    expect(result.necesidadEducativa).toBe("");
    expect(result.adaptacionDCD).toBe("");
  });

  it("preserva campos proporcionados", () => {
    const result = normalizarAdaptacionNEE({
      grado: 3,
      necesidadEducativa: "Dislexia",
      adaptacionDCD: "Simplificar enunciados",
      adaptacionEstrategias: "Trabajo en parejas",
      adaptacionRecursos: "Textos con letras grandes",
      adaptacionEvaluacion: "Evaluación oral",
    });
    expect(result.grado).toBe(3);
    expect(result.necesidadEducativa).toBe("Dislexia");
    expect(result.source).toBeUndefined();
  });
});

// ============================================================
// NORMALIZACIÓN PLANIFICACIÓN EGB/BGU
// ============================================================

describe("normalizarPlanificacionEGBBGU", () => {
  it("produce planificación válida con entrada mínima", () => {
    const result = normalizarPlanificacionEGBBGU({});
    expect(result.id).toMatch(/^plan-cc-/);
    expect(result.status).toBe("draft");
    expect(result.nivel).toBe("EGB");
    expect(result.estructuraDidactica).toBeDefined();
    expect(result.estructuraDidactica.fases).toEqual([]);
  });

  it("normaliza campos de entrada correctamente", () => {
    const result = normalizarPlanificacionEGBBGU({
      fecha: "2026-09-01",
      institucion: "Unidad Educativa San Martín",
      docente: "María González",
      grado: "3ro",
      asignatura: "Matemática",
      trimestre: "Primer Trimestre",
      nivel: "BGU",
      paralelo: "A",
      dcd: { codigo: "m.2.1.1", descripcion: "Representar conjuntos" },
      competencias: ["C", "m"],
      recursos: "Cuaderno, lápiz",
    });
    expect(result.fecha).toBe("2026-09-01");
    expect(result.institucion).toBe("Unidad Educativa San Martín");
    expect(result.nivel).toBe("BGU");
    expect(result.competenciasAsociadas).toEqual(["C", "M"]);
    expect(result.destreza.codigo).toBe("M.2.1.1");
  });

  it("preserva SourceTraceability cuando se provee sourceDocument", () => {
    const result = normalizarPlanificacionEGBBGU({
      sourceDocument: "FORMATO TEST.docx",
      sourceSection: "Sección 1",
      sourceVersion: "1.0",
      dcd: { codigo: "M.2.1.1" },
    });
    expect(result.source).toBeDefined();
    expect(result.source!.source_document).toBe("FORMATO TEST.docx");
    expect(result.source!.source_section).toBe("Sección 1");
  });

  it("no tiene SourceTraceability si no se provee sourceDocument", () => {
    const result = normalizarPlanificacionEGBBGU({});
    expect(result.source).toBeUndefined();
  });

  it("normaliza competencias inválidas a C", () => {
    const result = normalizarPlanificacionEGBBGU({
      competencias: ["XYZ", "INVALID"],
    });
    expect(result.competenciasAsociadas).toEqual(["C"]);
  });

  it("usa ERCA por defecto como estrategia", () => {
    const result = normalizarPlanificacionEGBBGU({});
    expect(result.estructuraDidactica.estrategiaId).toBe("erca");
  });

  it("normaliza proyecto interdisciplinar cuando se provee", () => {
    const result = normalizarPlanificacionEGBBGU({
      usaInterdisciplina: true,
      proyectoInterdisciplinar: {
        nombre: "Proyecto Agua",
        objetivoAprendizaje: "Comprender el ciclo del agua",
        dcds: [{ codigo: "C.1.1.1" }],
        actividadesEvaluacion: "Exposición oral",
      },
    });
    expect(result.usaInterdisciplina).toBe(true);
    expect(result.proyectoInterdisciplinar).toBeDefined();
    expect(result.proyectoInterdisciplinar!.nombre).toBe("Proyecto Agua");
    expect(result.proyectoInterdisciplinar!.dcdsIntegradas).toHaveLength(1);
  });

  it("normaliza adaptaciones NEE", () => {
    const result = normalizarPlanificacionEGBBGU({
      adaptacionesNEE: [
        {
          grado: 2,
          necesidadEducativa: "TEA",
          adaptacionDCD: "Apoyos visuales",
        },
      ],
    });
    expect(result.adaptacionesNEE).toHaveLength(1);
    expect(result.adaptacionesNEE![0].grado).toBe(2);
    expect(result.adaptacionesNEE![0].necesidadEducativa).toBe("TEA");
  });

  it("normaliza actividades de acompañamiento", () => {
    const result = normalizarPlanificacionEGBBGU({
      horasAcompaniamiento: 5,
      actividadesAcompaniamiento: [
        { actividad: "Refuerzo lectura", competencia: "C" },
        { actividad: "Juegos matemáticos", competencia: "M" },
      ],
    });
    expect(result.horasAcompaniamiento).toBe(5);
    expect(result.actividadesAcompaniamiento).toHaveLength(2);
    expect(result.actividadesAcompaniamiento![0].competencia).toBe("C");
  });
});

// ============================================================
// NORMALIZACIÓN PLANIFICACIÓN INICIAL / PREPARATORIA
// ============================================================

describe("normalizarPlanificacionInicial", () => {
  it("produce planificación válida con entrada mínima", () => {
    const result = normalizarPlanificacionInicial({});
    expect(result.id).toMatch(/^plan-ini-/);
    expect(result.status).toBe("draft");
    expect(result.ambitos).toEqual([]);
  });

  it("normaliza ámbitos con clases correctamente", () => {
    const result = normalizarPlanificacionInicial({
      grado: "Inicial 4 años",
      institucion: "Unidad Educativa Los Andes",
      docente: "Ana Pérez",
      duracion: "2026-2027",
      objetivoGeneral: "Desarrollar habilidades motoras",
      ambitos: [
        {
          ambito: "Desarrollo Socioemocional",
          competenciaCodigo: "CS",
          competenciaDescripcion: "Comunicación Social",
          competencias: ["C"],
          destrezas: ["Destreza 1", "Destreza 2"],
          clases: [
            {
              numero: 1,
              tema: "Presentación",
              objetivoEspecifico: "Conocer a los compañeros",
              metodologia: "Juego libre",
              inicio: [{ texto: "Saludo", competencia: "C" }],
              desarrollo: [{ texto: "Juego grupal", competencia: "M" }],
              cierre: [{ texto: "Reflexión", competencia: "CD" }],
              metodoEvaluacion: ["Observación directa"],
            },
          ],
        },
      ],
    });
    expect(result.ambitos).toHaveLength(1);
    expect(result.ambitos[0].ambito).toBe("Desarrollo Socioemocional");
    expect(result.ambitos[0].competenciaCodigo).toBe("CS");
    expect(result.ambitos[0].clases).toHaveLength(1);
    expect(result.ambitos[0].clases[0].inicio).toHaveLength(1);
    expect(result.ambitos[0].clases[0].inicio[0].texto).toBe("Saludo");
    expect(result.ambitos[0].clases[0].desarrollo[0].competencia).toBe("M");
    expect(result.ambitos[0].clases[0].cierre[0].competencia).toBe("CD");
  });

  it("preserva firmas cuando se proveen", () => {
    const result = normalizarPlanificacionInicial({
      firmas: {
        elaborado: "Ana Pérez",
        revisado: "Carlos López",
        coordinador: "María García",
        aprobado: "Director",
      },
    });
    expect(result.firmas).toBeDefined();
    expect(result.firmas!.elaborado).toBe("Ana Pérez");
    expect(result.firmas!.revisado).toBe("Carlos López");
  });

  it("no tiene firmas si no se proveen", () => {
    const result = normalizarPlanificacionInicial({});
    expect(result.firmas).toBeUndefined();
  });

  it("normaliza adaptaciones NEE", () => {
    const result = normalizarPlanificacionInicial({
      adaptacionesNEE: [
        {
          grado: 1,
          necesidadEducativa: "Retraso madurativo",
          adaptacionDCD: "Actividades simplificadas",
        },
      ],
    });
    expect(result.adaptacionesNEE).toHaveLength(1);
    expect(result.adaptacionesNEE![0].necesidadEducativa).toBe(
      "Retraso madurativo"
    );
  });

  it("preserva SourceTraceability", () => {
    const result = normalizarPlanificacionInicial({
      sourceDocument: "FORMATO INICIAL.docx",
      sourceSection: "Ámbitos",
    });
    expect(result.source).toBeDefined();
    expect(result.source!.source_document).toBe("FORMATO INICIAL.docx");
  });

  it("normaliza textos con espacios extra", () => {
    const result = normalizarPlanificacionInicial({
      institucion: "  Unidad Educativa  Los Andes  ",
      docente: "  Ana  Pérez  ",
    });
    expect(result.institucion).toBe("Unidad Educativa Los Andes");
    expect(result.docente).toBe("Ana Pérez");
  });
});
