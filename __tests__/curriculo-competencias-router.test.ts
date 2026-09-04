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
        limit: vi.fn(() => {
          return Array.from(store.values());
        }),
        orderBy: vi.fn(() => ({
          limit: vi.fn(() => Array.from(store.values())),
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

// ============================================================
// HELPERS
// ============================================================

function egbBguInput(overrides: Record<string, any> = {}) {
  return {
    sessionId: "session-test-001",
    fecha: "2026-09-01",
    institucion: "Unidad Educativa San Martín",
    docente: "María González",
    grado: "3ro",
    asignatura: "Matemática",
    nivel: "EGB" as const,
    paralelo: "A",
    trimestre: "Primer Trimestre",
    dcd: { codigo: "M.2.1.1", descripcion: "Representar conjuntos" },
    competencias: ["C", "M"],
    objetivoAprendizaje: "Representar conjuntos numéricos",
    recursos: "Cuaderno, lápiz",
    ...overrides,
  };
}

function inicialInput(overrides: Record<string, any> = {}) {
  return {
    sessionId: "session-test-002",
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
        destrezas: ["Destreza 1"],
        clases: [
          {
            numero: 1,
            tema: "Presentación",
            objetivoEspecifico: "Conocer compañeros",
            metodologia: "Juego libre",
            inicio: [{ texto: "Saludo", competencia: "C" }],
            desarrollo: [{ texto: "Juego grupal", competencia: "M" }],
            cierre: [{ texto: "Reflexión", competencia: "CD" }],
            metodoEvaluacion: ["Observación directa"],
          },
        ],
      },
    ],
    firmas: {
      elaborado: "Ana Pérez",
      revisado: "Carlos López",
      coordinador: "María García",
      aprobado: "Director",
    },
    ...overrides,
  };
}

// ============================================================
// TESTS
// ============================================================

describe("curriculo-competencias-router", () => {
  beforeEach(() => {
    autoIncrementId = 1;
    store.clear();
    vi.clearAllMocks();
  });

  // ── CREATE EGB/BGU ──────────────────────────────────────────────

  describe("createEGBBGU", () => {
    it("crea planificación EGB/BGU con modelo canónico", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());

      expect(plan.id).toMatch(/^plan-cc-/);
      expect(plan.status).toBe("draft");
      expect(plan.nivel).toBe("EGB");
      expect(plan.competenciasAsociadas).toEqual(["C", "M"]);
      expect(plan.estructuraDidactica).toBeDefined();
    });

    it("normaliza competencias correctamente", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({ competencias: ["c", "M"] })
      );
      expect(plan.competenciasAsociadas).toEqual(["C", "M"]);
    });

    it("preserva SourceTraceability", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({
          sourceDocument: "FORMATO TEST.docx",
          sourceSection: "Sección 1",
        })
      );
      expect(plan.source).toBeDefined();
      expect(plan.source!.source_document).toBe("FORMATO TEST.docx");
    });
  });

  // ── CREATE INICIAL ──────────────────────────────────────────────

  describe("createInicial", () => {
    it("crea planificación Inicial con ámbitos", () => {
      const plan = normalizarPlanificacionInicial(inicialInput());

      expect(plan.id).toMatch(/^plan-ini-/);
      expect(plan.status).toBe("draft");
      expect(plan.ambitos).toHaveLength(1);
      expect(plan.ambitos[0].ambito).toBe("Desarrollo Socioemocional");
    });

    it("normaliza clases dentro de ámbitos", () => {
      const plan = normalizarPlanificacionInicial(inicialInput());
      const clase = plan.ambitos[0].clases[0];
      expect(clase.numero).toBe(1);
      expect(clase.tema).toBe("Presentación");
      expect(clase.inicio).toHaveLength(1);
      expect(clase.desarrollo).toHaveLength(1);
      expect(clase.cierre).toHaveLength(1);
    });

    it("preserva firmas", () => {
      const plan = normalizarPlanificacionInicial(inicialInput());
      expect(plan.firmas).toBeDefined();
      expect(plan.firmas!.elaborado).toBe("Ana Pérez");
      expect(plan.firmas!.revisado).toBe("Carlos López");
    });
  });

  // ── SERIALIZACIÓN JSON ──────────────────────────────────────────

  describe("serialización para BD", () => {
    it("formData contiene el modelo canónico completo", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      const serialized = JSON.stringify(plan);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.id).toBe(plan.id);
      expect(deserialized.competenciasAsociadas).toEqual(
        plan.competenciasAsociadas
      );
      expect(deserialized.estructuraDidactica).toEqual(
        plan.estructuraDidactica
      );
    });

    it("sourceTraceability se serializa correctamente", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({ sourceDocument: "TEST.docx" })
      );
      expect(plan.source).toBeDefined();
      const serialized = JSON.stringify(plan.source);
      const deserialized = JSON.parse(serialized);
      expect(deserialized.source_document).toBe("TEST.docx");
    });

    it("competencias se serializa como array de strings", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({ competencias: ["C", "M", "CD"] })
      );
      const serialized = JSON.stringify(plan.competenciasAsociadas);
      const deserialized = JSON.parse(serialized);
      expect(deserialized).toEqual(["C", "M", "CD"]);
    });
  });

  // ── MODELO CANÓNICO — ESTRUCTURA DIDÁCTICA ─────────────────────

  describe("estructura didáctica", () => {
    it("ERCA por defecto para EGB/BGU", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.estructuraDidactica.estrategiaId).toBe("erca");
    });

    it("fases se normalizan correctamente", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({
          fases: [
            {
              titulo: "INICIO",
              duracionMinutos: 10,
              actividades: [{ texto: "Actividad 1", competencia: "C" }],
            },
            {
              titulo: "DESARROLLO",
              duracionMinutos: 25,
              actividades: [{ texto: "Actividad 2", competencia: "M" }],
            },
          ],
        })
      );
      expect(plan.estructuraDidactica.fases).toHaveLength(2);
      expect(plan.estructuraDidactica.fases[0].titulo).toBe("INICIO");
      expect(plan.estructuraDidactica.fases[0].duracionMinutos).toBe(10);
    });
  });

  // ── MODELO CANÓNICO — PROYECTO INTERDISCIPLINAR ────────────────

  describe("proyecto interdisciplinar", () => {
    it("se normaliza cuando se provee", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({
          usaInterdisciplina: true,
          proyectoInterdisciplinar: {
            nombre: "Proyecto Agua",
            objetivoAprendizaje: "Comprender el ciclo del agua",
            dcds: [{ codigo: "C.1.1.1" }],
            actividadesEvaluacion: "Exposición oral",
          },
        })
      );
      expect(plan.usaInterdisciplina).toBe(true);
      expect(plan.proyectoInterdisciplinar).toBeDefined();
      expect(plan.proyectoInterdisciplinar!.nombre).toBe("Proyecto Agua");
    });

    it("es undefined cuando no se provee", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.usaInterdisciplina).toBe(false);
      expect(plan.proyectoInterdisciplinar).toBeUndefined();
    });
  });

  // ── MODELO CANÓNICO — ADAPTACIONES NEE ─────────────────────────

  describe("adaptaciones NEE", () => {
    it("se normalizan correctamente", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({
          adaptacionesNEE: [
            {
              grado: 2,
              necesidadEducativa: "TEA",
              adaptacionDCD: "Apoyos visuales",
              adaptacionEstrategias: "Trabajo en parejas",
              adaptacionRecursos: "Textos simplificados",
              adaptacionEvaluacion: "Evaluación oral",
            },
          ],
        })
      );
      expect(plan.adaptacionesNEE).toHaveLength(1);
      expect(plan.adaptacionesNEE![0].grado).toBe(2);
      expect(plan.adaptacionesNEE![0].necesidadEducativa).toBe("TEA");
    });
  });

  // ── AISLAMIENTO EGB/BGU vs INICIAL ─────────────────────────────

  describe("aislamiento de dominios", () => {
    it("EGB/BGU tiene asignatura, nivel, trimestre", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.asignatura).toBe("Matemática");
      expect(plan.nivel).toBe("EGB");
      expect(plan.trimestre).toBe("Primer Trimestre");
      expect((plan as any).ambitos).toBeUndefined(); // no tiene ámbitos
    });

    it("Inicial tiene ámbitos, no tiene asignatura", () => {
      const plan = normalizarPlanificacionInicial(inicialInput());
      expect(plan.ambitos).toHaveLength(1);
      expect((plan as any).asignatura).toBeUndefined(); // no tiene asignatura
      expect((plan as any).nivel).toBeUndefined(); // no tiene nivel
    });
  });

  // ── TRAZABILIDAD ────────────────────────────────────────────────

  describe("SourceTraceability", () => {
    it("se preserva en EGB/BGU", () => {
      const plan = normalizarPlanificacionEGBBGU(
        egbBguInput({
          sourceDocument: "FORMATO EGB.docx",
          sourceSection: "Sección 2",
          sourceVersion: "2.0",
        })
      );
      expect(plan.source).toBeDefined();
      expect(plan.source!.source_document).toBe("FORMATO EGB.docx");
      expect(plan.source!.source_section).toBe("Sección 2");
      expect(plan.source!.source_version).toBe("2.0");
      expect(plan.source!.normalized_at).toBeTruthy();
    });

    it("se preserva en Inicial", () => {
      const plan = normalizarPlanificacionInicial(
        inicialInput({
          sourceDocument: "FORMATO INICIAL.docx",
          sourceSection: "Ámbitos",
        })
      );
      expect(plan.source).toBeDefined();
      expect(plan.source!.source_document).toBe("FORMATO INICIAL.docx");
    });

    it("es undefined cuando no se provee sourceDocument", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.source).toBeUndefined();
    });
  });

  // ── CAMPOS OPCIONALES/AUSENTES ──────────────────────────────────

  describe("campos opcionales", () => {
    it("campos ausentes se convierten en strings vacíos o undefined", () => {
      const plan = normalizarPlanificacionEGBBGU({});
      expect(plan.fecha).toBe("");
      expect(plan.institucion).toBe("");
      expect(plan.docente).toBe("");
      expect(plan.asignatura).toBe("");
      expect(plan.recursos).toBe("");
    });

    it("adaptaciones NEE es undefined cuando no se provee", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.adaptacionesNEE).toBeUndefined();
    });

    it("actividadesAcompaniamiento es undefined cuando no se provee", () => {
      const plan = normalizarPlanificacionEGBBGU(egbBguInput());
      expect(plan.actividadesAcompaniamiento).toBeUndefined();
    });
  });
});
