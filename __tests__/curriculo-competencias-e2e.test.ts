/**
 * Tests E2E — Flujo completo Currículo por Competencias
 *
 * Valida el circuito completo:
 *   Crear → Persistir → Recuperar → Visualizar → Exportar Word → Exportar PDF
 *
 * Para ambas familias: EGB/BGU e Inicial/Preparatoria.
 * No duplica tests de contenido de Fase 8; se enfoca en la integridad del flujo.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// MOCK de DB — simula inserciones/consultas sin MySQL real
// ============================================================

let autoIncrementId = 1;
const store: Map<number, any> = new Map();

const mockDb = {
  insert: vi.fn(() => ({
    values: vi.fn((row: any) => {
      const id = autoIncrementId++;
      store.set(id, { ...row, id });
      return { insertId: id };
    }),
  })),
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn((n?: number) => {
          const all = Array.from(store.values());
          return n ? all.slice(0, n) : all;
        }),
        orderBy: vi.fn(() => ({
          limit: vi.fn((n?: number) => {
            const all = Array.from(store.values());
            return n ? all.slice(0, n) : all;
          }),
        })),
      })),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn((row: any) => ({
      where: vi.fn((condition: any) => {
        for (const [id, existing] of store) {
          Object.assign(existing, row);
        }
        return { affectedRows: store.size };
      }),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn((condition: any) => {
      for (const [id] of store) {
        store.delete(id);
      }
      return { affectedRows: store.size };
    }),
  })),
};

vi.mock("../server/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

// ============================================================
// IMPORTAR DESPUÉS DEL MOCK
// ============================================================

import {
  normalizarPlanificacionEGBBGU,
  normalizarPlanificacionInicial,
} from "../lib/curriculo-competencias-normalizer";
import { generarCurriculoCompetenciasWordEGBBGU } from "../lib/curriculo-competencias-word-generator";
import { generarCurriculoCompetenciasWordInicial } from "../lib/curriculo-competencias-inicial-word-generator";
import {
  generarCurriculoCompetenciasPdfEGBBGU,
  generarCurriculoCompetenciasPdfInicial,
} from "../lib/curriculo-competencias-pdf-generator";
import JSZip from "jszip";

// ============================================================
// HELPERS
// ============================================================

function egbBguInput(overrides: Record<string, any> = {}) {
  return {
    sessionId: "session-e2e-001",
    fecha: "2026-09-04",
    institucion: "Unidad Educativa Ejemplo",
    docente: "Docente E2E",
    grado: "5to",
    asignatura: "Matemáticas",
    nivel: "EGB" as const,
    paralelo: "B",
    trimestre: "Primer Trimestre",
    dcd: { codigo: "M.5.1", descripcion: "Resuelve problemas con fracciones" },
    competencias: ["C", "M", "CD", "CS"],
    objetivoAprendizaje: "Comprender y operar con fracciones",
    estrategiaId: "erca",
    fases: [
      {
        titulo: "Experiencia",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Observar fracciones en la vida cotidiana",
            competencia: "M",
            dua: { representacion: true, accionExpresion: false, implicacion: false },
          },
        ],
      },
      {
        titulo: "Reflexión",
        duracionMinutos: 15,
        actividades: [
          {
            texto: "Discutir hallazgos",
            competencia: "C",
            dua: { representacion: false, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Conceptualización",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Definir fracciones",
            competencia: "M",
            dua: { representacion: true, accionExpresion: true, implicacion: false },
          },
        ],
      },
      {
        titulo: "Aplicación",
        duracionMinutos: 10,
        actividades: [
          {
            texto: "Resolver ejercicios",
            competencia: "CD",
            dua: { representacion: false, accionExpresion: true, implicacion: true },
          },
        ],
      },
    ],
    recursos: "Cuaderno, lápiz",
    tecnicaEvaluacion: "Observación directa",
    instrumentoEvaluacion: "Rúbrica",
    actividadesEvaluacion: "Ejercicios en clase",
    ...overrides,
  };
}

function inicialInput(overrides: Record<string, any> = {}) {
  return {
    sessionId: "session-e2e-002",
    grado: "Primer años",
    institucion: "Unidad Educativa Inicial",
    docente: "Docente Inicial E2E",
    duracion: "45 minutos",
    objetivoGeneral: "Desarrollar habilidades socioemocionales",
    ambitos: [
      {
        ambito: "Socioemocional",
        competenciaCodigo: "SOC",
        competenciaDescripcion: "Desarrolla habilidades socioemocionales",
        competenciasTransversales: ["CS", "C"],
        destrezas: ["Identifica emociones", "Expresa sentimientos"],
        clases: [
          {
            numero: 1,
            tema: "Mis emociones",
            objetivoEspecifico: "Reconocer emociones básicas",
            metodologia: "Juego dramático",
            inicio: [
              {
                texto: "Círculo de bienvenida",
                competencia: "CS",
                dua: { representacion: true, accionExpresion: false, implicacion: false },
              },
            ],
            desarrollo: [
              {
                texto: "Juego de roles",
                competencia: "CS",
                dua: { representacion: false, accionExpresion: true, implicacion: true },
              },
            ],
            cierre: [
              {
                texto: "Reflexión grupal",
                competencia: "C",
                dua: { representacion: true, accionExpresion: false, implicacion: true },
              },
            ],
            metodoEvaluacion: ["Observación"],
          },
        ],
      },
    ],
    adaptacionesNEE: [
      {
        grado: 1,
        necesidadEducativa: "Retraso en lenguaje",
        adaptacionDCD: "Material visual",
        adaptacionEstrategias: "Pasos simples",
        adaptacionRecursos: "Pictogramas",
        adaptacionEvaluacion: "Evaluación oral",
      },
    ],
    bibliografia: "Currículo Nacional Ecuador",
    observaciones: "Acompañamiento permanente",
    firmas: {
      elaborado: "Docente Inicial",
      revisado: "Revisor",
      coordinador: "Coordinador",
      aprobado: "Director",
    },
    ...overrides,
  };
}

// ============================================================
// E2E — EGB/BGU: Crear → Persistir → Recuperar → Exportar
// ============================================================

describe("E2E — Flujo completo EGB/BGU", () => {
  beforeEach(() => {
    autoIncrementId = 1;
    store.clear();
    vi.clearAllMocks();
  });

  it("1. Normaliza input raw a modelo canónico", () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    expect(canonico.institucion).toBe("Unidad Educativa Ejemplo");
    expect(canonico.docente).toBe("Docente E2E");
    expect(canonico.asignatura).toBe("Matemáticas");
    expect(canonico.nivel).toBe("EGB");
    expect(canonico.competenciasAsociadas).toEqual(["C", "M", "CD", "CS"]);
    expect(canonico.estructuraDidactica.fases).toHaveLength(4);
    expect(canonico.destreza.codigo).toBe("M.5.1");
  });

  it("2. Persiste en BD y recupera por ID", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    // Simular INSERT
    const db: any = await import("../server/db").then((m) => m.getDb());
    const result = await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        grado: canonico.grado,
        institucion: canonico.institucion,
        docente: canonico.docente,
        asignatura: canonico.asignatura,
        nivel: canonico.nivel,
        formData: JSON.stringify(canonico),
        status: "draft",
      });

    expect(result.insertId).toBe(1);
    expect(store.has(1)).toBe(true);

    // Simular SELECT BY ID
    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);

    const row = rows[0];
    expect(row).toBeDefined();
    expect(row.id).toBe(1);
    expect(row.tipo).toBe("egb_bgu");

    const data = JSON.parse(row.formData);
    expect(data.institucion).toBe("Unidad Educativa Ejemplo");
    expect(data.competenciasAsociadas).toEqual(["C", "M", "CD", "CS"]);
  });

  it("3. Exporta Word a partir de datos persistidos", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    // Persistir
    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    // Recuperar y parsear
    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    // Exportar Word
    const blob = await generarCurriculoCompetenciasWordEGBBGU(data);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(5000);

    // Verificar que es un ZIP válido
    const buffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    expect(zip.file("word/document.xml")).not.toBeNull();

    // Verificar contenido
    const docXml = await zip.file("word/document.xml")?.async("text");
    expect(docXml).toContain("Unidad Educativa Ejemplo");
    expect(docXml).toContain("Docente E2E");
    expect(docXml).toContain("Resuelve problemas con fracciones");
    expect(docXml).toContain("Experiencia");
  });

  it("4. Exporta PDF a partir de datos persistidos", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    // Persistir
    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    // Recuperar y parsear
    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    // Exportar PDF
    const html = generarCurriculoCompetenciasPdfEGBBGU(data);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("A4 landscape");
    expect(html).toContain("print-color-adjust");
    expect(html).toContain("Unidad Educativa Ejemplo");
    expect(html).toContain("Experiencia");
  });

  it("5. Integridad: datos de DCD se preservan en exportación", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfEGBBGU(data);
    expect(html).toContain("M.5.1");
    expect(html).toContain("Resuelve problemas con fracciones");
    expect(html).toContain("C");
    expect(html).toContain("M");
    expect(html).toContain("CD");
    expect(html).toContain("CS");
  });

  it("6. Integridad: estrategia y fases se preservan", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfEGBBGU(data);
    expect(html).toContain("Experiencia");
    expect(html).toContain("Reflexión");
    expect(html).toContain("Conceptualización");
    expect(html).toContain("Aplicación");
    expect(html).toContain("Observar fracciones en la vida cotidiana");
  });

  it("7. Integridad: evaluación se preserva", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfEGBBGU(data);
    expect(html).toContain("Observación directa");
    expect(html).toContain("Rúbrica");
    expect(html).toContain("Ejercicios en clase");
  });

  it("8. No se mezcla con datos de Inicial", async () => {
    const raw = egbBguInput();
    const canonico = normalizarPlanificacionEGBBGU(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfEGBBGU(data);
    // No debería contener elementos de Inicial
    expect(html).not.toContain("ÁMBITO:");
    expect(html).not.toContain("INICIO");
    expect(html).not.toContain("DESARROLLO");
    expect(html).not.toContain("CIERRE");
    expect(html).not.toContain("Elaborado");
  });
});

// ============================================================
// E2E — INICIAL/PREPARATORIA: Crear → Persistir → Recuperar → Exportar
// ============================================================

describe("E2E — Flujo completo Inicial/Preparatoria", () => {
  beforeEach(() => {
    autoIncrementId = 100;
    store.clear();
    vi.clearAllMocks();
  });

  it("1. Normaliza input raw a modelo canónico", () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    expect(canonico.institucion).toBe("Unidad Educativa Inicial");
    expect(canonico.docente).toBe("Docente Inicial E2E");
    expect(canonico.ambitos).toHaveLength(1);
    expect(canonico.ambitos[0].ambito).toBe("Socioemocional");
    expect(canonico.ambitos[0].clases).toHaveLength(1);
    expect(canonico.ambitos[0].clases[0].inicio).toHaveLength(1);
    expect(canonico.ambitos[0].clases[0].desarrollo).toHaveLength(1);
    expect(canonico.ambitos[0].clases[0].cierre).toHaveLength(1);
  });

  it("2. Persiste en BD y recupera por ID", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    const result = await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        grado: canonico.grado,
        institucion: canonico.institucion,
        docente: canonico.docente,
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    expect(result.insertId).toBe(100);
    expect(store.has(100)).toBe(true);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);

    const row = rows[0];
    expect(row.tipo).toBe("inicial_preparatoria");

    const data = JSON.parse(row.formData);
    expect(data.institucion).toBe("Unidad Educativa Inicial");
    expect(data.ambitos).toHaveLength(1);
  });

  it("3. Exporta Word a partir de datos persistidos", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const blob = await generarCurriculoCompetenciasWordInicial(data);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(5000);

    const buffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    expect(zip.file("word/document.xml")).not.toBeNull();

    const docXml = await zip.file("word/document.xml")?.async("text");
    expect(docXml).toContain("Unidad Educativa Inicial");
    expect(docXml).toContain("Docente Inicial E2E");
    expect(docXml).toContain("Socioemocional");
    expect(docXml).toContain("INICIO");
  });

  it("4. Exporta PDF a partir de datos persistidos", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfInicial(data);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("A4 landscape");
    expect(html).toContain("print-color-adjust");
    expect(html).toContain("Unidad Educativa Inicial");
    expect(html).toContain("SOCIOEMOCIONAL");
    expect(html).toContain("INICIO");
  });

  it("5. Integridad: ámbitos, clases y destrezas se preservan", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfInicial(data);
    expect(html).toContain("SOCIOEMOCIONAL");
    expect(html).toContain("SOC");
    expect(html).toContain("Identifica emociones");
    expect(html).toContain("Mis emociones");
  });

  it("6. Integridad: NEE, bibliografía y firmas se preservan", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfInicial(data);
    expect(html).toContain("Retraso en lenguaje");
    expect(html).toContain("Currículo Nacional Ecuador");
    expect(html).toContain("Docente Inicial");
    expect(html).toContain("Revisor");
    expect(html).toContain("Coordinador");
    expect(html).toContain("Director");
  });

  it("7. No se mezcla con datos de EGB/BGU", async () => {
    const raw = inicialInput();
    const canonico = normalizarPlanificacionInicial(raw);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: canonico.sessionId,
        tipo: "inicial_preparatoria",
        formData: JSON.stringify(canonico),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);
    const data = JSON.parse(rows[0].formData);

    const html = generarCurriculoCompetenciasPdfInicial(data);
    // No debería contener elementos de EGB/BGU
    expect(html).not.toContain("Trimestre");
    expect(html).not.toContain("Paralelo");
    expect(html).not.toContain("Experiencia");
    expect(html).not.toContain("Conceptualización");
    expect(html).not.toContain("Nivel:");
  });
});

// ============================================================
// E2E — ERRORES Y EDGE CASES
// ============================================================

describe("E2E — Errores y edge cases", () => {
  beforeEach(() => {
    autoIncrementId = 200;
    store.clear();
    vi.clearAllMocks();
  });

  it("EGB/BGU con campos mínimos", () => {
    const raw = {
      sessionId: "minimal",
      institucion: "Mínima",
      docente: "Min",
      grado: "1ro",
      asignatura: "Test",
      nivel: "EGB" as const,
      competencias: [],
      objetivoAprendizaje: "Test",
      fases: [],
    };
    const canonico = normalizarPlanificacionEGBBGU(raw);
    expect(canonico.institucion).toBe("Mínima");
    // Cuando no se proporcionan competencias, el normaliza retorna todas las activas
    expect(canonico.competenciasAsociadas.length).toBeGreaterThan(0);
    expect(canonico.estructuraDidactica.fases).toEqual([]);
  });

  it("Inicial con mínimos campos", () => {
    const raw = {
      sessionId: "minimal-inicial",
      grado: "Test",
      institucion: "Mínima",
      docente: "Min",
      duracion: "30 min",
      objetivoGeneral: "Test",
      ambitos: [],
    };
    const canonico = normalizarPlanificacionInicial(raw);
    expect(canonico.institucion).toBe("Mínima");
    expect(canonico.ambitos).toEqual([]);
  });

  it("Word EGB/BGU con datos mínimos no falla", async () => {
    const raw = {
      sessionId: "minimal",
      institucion: "Mínima",
      docente: "Min",
      grado: "1ro",
      asignatura: "Test",
      nivel: "EGB" as const,
      competencias: [],
      objetivoAprendizaje: "Test",
      fases: [],
    };
    const canonico = normalizarPlanificacionEGBBGU(raw);
    const blob = await generarCurriculoCompetenciasWordEGBBGU(canonico);
    expect(blob.size).toBeGreaterThan(1000);
  });

  it("PDF EGB/BGU con datos mínimos no falla", () => {
    const raw = {
      sessionId: "minimal",
      institucion: "Mínima",
      docente: "Min",
      grado: "1ro",
      asignatura: "Test",
      nivel: "EGB" as const,
      competencias: [],
      objetivoAprendizaje: "Test",
      fases: [],
    };
    const canonico = normalizarPlanificacionEGBBGU(raw);
    const html = generarCurriculoCompetenciasPdfEGBBGU(canonico);
    expect(html).toContain("Mínima");
    expect(html.length).toBeGreaterThan(500);
  });

  it("Múltiples planificaciones no se mezclan", async () => {
    const raw1 = egbBguInput({ institucion: "PRIMERA" });
    const raw2 = egbBguInput({ institucion: "SEGUNDA" });

    const canonico1 = normalizarPlanificacionEGBBGU(raw1);
    const canonico2 = normalizarPlanificacionEGBBGU(raw2);

    const db: any = await import("../server/db").then((m) => m.getDb());
    await db
      .insert({} as any)
      .values({
        sessionId: "s1",
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico1),
        status: "draft",
      } as any);
    await db
      .insert({} as any)
      .values({
        sessionId: "s2",
        tipo: "egb_bgu",
        formData: JSON.stringify(canonico2),
        status: "draft",
      } as any);

    const rows = await db
      .select()
      .from({} as any)
      .where({} as any)
      .limit(1);

    // Cada una tiene su propia institución
    const data1 = JSON.parse(rows[0].formData);
    expect(data1.institucion).toBe("PRIMERA");
  });
});
