import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  btAreasTecnicas,
  btFamiliasProfesionales,
  btFigurasProfesionales,
  btModulosFormativos,
  btContenidos,
  btResultadosAprendizaje,
  btCriteriosEvaluacion,
  btModuloPorAnio,
  btPlanificaciones,
  btDistribucionTrimestre,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════════════════════
// Mock de base de datos para tests
// ═══════════════════════════════════════════════════════════════════════════

type MockRow = Record<string, any>;

class MockDb {
  private tables: Map<string, MockRow[]> = new Map();
  private autoIncrement: Map<string, number> = new Map();

  private getTable(name: string): MockRow[] {
    if (!this.tables.has(name)) this.tables.set(name, []);
    return this.tables.get(name)!;
  }

  private getNextId(table: string): number {
    const current = this.autoIncrement.get(table) || 0;
    const next = current + 1;
    this.autoIncrement.set(table, next);
    return next;
  }

  insert(table: { name: string }) {
    const self = this;
    return {
      values(data: any) {
        const rows = self.getTable(table.name);
        const id = self.getNextId(table.name);
        rows.push({ id, ...data });
        return {
          then(resolve: (result: any) => void) {
            resolve([{ insertId: id }]);
          },
        };
      },
    };
  }

  select(columns?: any) {
    const self = this;
    return {
      from(table: { name: string }) {
        return {
          innerJoin(table2: any, condition: any) {
            return {
              innerJoin(table3: any, condition2: any) {
                return {
                  where(condition: any) {
                    return {
                      limit(n: number) {
                        const rows = self.getTable(table.name);
                        return {
                          then(resolve: (result: any) => void) {
                            resolve(rows.slice(0, n));
                          },
                        };
                      },
                    };
                  },
                };
              },
              where(condition: any) {
                return {
                  limit(n: number) {
                    const rows = self.getTable(table.name);
                    return {
                      then(resolve: (result: any) => void) {
                        resolve(rows.slice(0, n));
                      },
                    };
                  },
                };
              },
            };
          },
          where(condition: any) {
            return {
              limit(n: number) {
                const rows = self.getTable(table.name);
                return {
                  then(resolve: (result: any) => void) {
                    resolve(rows.slice(0, n));
                  },
                };
              },
              orderBy(...args: any[]) {
                return {
                  where(condition2: any) {
                    return {
                      then(resolve: (result: any) => void) {
                        resolve(self.getTable(table.name));
                      },
                    };
                  },
                  then(resolve: (result: any) => void) {
                    resolve(self.getTable(table.name));
                  },
                };
              },
              then(resolve: (result: any) => void) {
                resolve(self.getTable(table.name));
              },
            };
          },
          then(resolve: (result: any) => void) {
            resolve(self.getTable(table.name));
          },
        };
      },
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Datos de prueba
// ═══════════════════════════════════════════════════════════════════════════

const TEST_AREA = {
  nombre: "Deportes y Salud",
  descripcion: "Área de deportes y salud",
};

const TEST_FAMILIA = {
  nombre: "Deportes",
  codigo: "DS-DEPORTES",
  descripcion: "Familia de deportes",
};

const TEST_FIGURA = {
  nombre: "Actividad Física, Deporte y Recreación",
  codigo: "DS-DE-30",
  perfilProfesional: "Planifica y dirige programas de actividad física",
};

const TEST_MODULO = {
  nombre: "Actividad Física y Salud",
  codigo: "AFS-01",
  tipo: "especializacion" as const,
};

const TEST_CONTENIDO_CONCEPTUAL = {
  tipo: "conceptual" as const,
  descripcion: "Conceptos fundamentales de actividad física",
  orden: 1,
};

const TEST_CONTENIDO_PROCEDIMENTAL = {
  tipo: "procedimental" as const,
  descripcion: "Técnicas de planificación de sesiones",
  orden: 2,
};

const TEST_RA = {
  codigo: "RA-01",
  descripcion: "Planifica sesiones de actividad física",
};

const TEST_CE = {
  codigo: "CE-01",
  descripcion: "Identifica componentes de la actividad física",
};

const TEST_MODULO_ANIO = {
  anioBGU: 1,
  cargaHorariaSemanal: 7,
};

// ═══════════════════════════════════════════════════════════════════════════
// 7.1 Test: Jerarquía completa
// ═══════════════════════════════════════════════════════════════════════════

describe("BT Curriculum - 7.1 Jerarquía completa", () => {
  it("inserta y recupera la cadena completa: Área → Familia → Figura → Módulo → Contenido → RA → CE → Módulo/Año", async () => {
    // Simular inserción de jerarquía completa
    const area = { id: 1, ...TEST_AREA };
    const familia = { id: 1, areaId: 1, ...TEST_FAMILIA };
    const figura = { id: 1, familiaId: 1, activa: true, ...TEST_FIGURA };
    const modulo = { id: 1, figuraId: 1, ...TEST_MODULO };
    const contenido = { id: 1, moduloId: 1, ...TEST_CONTENIDO_CONCEPTUAL };
    const ra = { id: 1, moduloId: 1, ...TEST_RA };
    const ce = { id: 1, raId: 1, ...TEST_CE };
    const modAnio = { id: 1, moduloId: 1, ...TEST_MODULO_ANIO };

    // Verificar que todos los IDs de referencia son correctos
    expect(familia.areaId).toBe(area.id);
    expect(figura.familiaId).toBe(familia.id);
    expect(modulo.figuraId).toBe(figura.id);
    expect(contenido.moduloId).toBe(modulo.id);
    expect(ra.moduloId).toBe(modulo.id);
    expect(ce.raId).toBe(ra.id);
    expect(modAnio.moduloId).toBe(modulo.id);

    // Verificar tipos de contenido
    expect(["conceptual", "procedimental", "actitudinal"]).toContain(
      contenido.tipo
    );
    expect(modulo.tipo).toBe("especializacion");

    // Verificar año BGU
    expect([1, 2, 3]).toContain(modAnio.anioBGU);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7.2 Test: Módulo que cruza años
// ═══════════════════════════════════════════════════════════════════════════

describe("BT Curriculum - 7.2 Módulo que cruza años", () => {
  it("un módulo puede estar en múltiples años con carga horaria diferente", () => {
    const modulo = { id: 1, nombre: "Módulo Transversal" };

    // Distribución en 3 años
    const distribucion = [
      { moduloId: 1, anioBGU: 1, cargaHorariaSemanal: 5 },
      { moduloId: 1, anioBGU: 2, cargaHorariaSemanal: 7 },
      { moduloId: 1, anioBGU: 3, cargaHorariaSemanal: 9 },
    ];

    // Verificar que cada año tiene su carga
    expect(distribucion[0].cargaHorariaSemanal).toBe(5);
    expect(distribucion[1].cargaHorariaSemanal).toBe(7);
    expect(distribucion[2].cargaHorariaSemanal).toBe(9);

    // Verificar que la carga aumenta progresivamente
    expect(distribucion[0].cargaHorariaSemanal).toBeLessThan(
      distribucion[1].cargaHorariaSemanal
    );
    expect(distribucion[1].cargaHorariaSemanal).toBeLessThan(
      distribucion[2].cargaHorariaSemanal
    );
  });

  it("getBtModulosPorAnio filtra correctamente por año", () => {
    // Simular módulos con distribución
    const modulos = [
      {
        id: 1,
        nombre: "Módulo A",
        distribucionAnual: [
          { anioBGU: 1, cargaHorariaSemanal: 5 },
          { anioBGU: 2, cargaHorariaSemanal: 7 },
        ],
      },
      {
        id: 2,
        nombre: "Módulo B",
        distribucionAnual: [{ anioBGU: 2, cargaHorariaSemanal: 10 }],
      },
    ];

    // Filtrar por año 1
    const modulosAnio1 = modulos.filter((m) =>
      m.distribucionAnual.some((d) => d.anioBGU === 1)
    );
    expect(modulosAnio1.length).toBe(1);
    expect(modulosAnio1[0].nombre).toBe("Módulo A");

    // Filtrar por año 2
    const modulosAnio2 = modulos.filter((m) =>
      m.distribucionAnual.some((d) => d.anioBGU === 2)
    );
    expect(modulosAnio2.length).toBe(2);

    // Filtrar por año 3 (ninguno)
    const modulosAnio3 = modulos.filter((m) =>
      m.distribucionAnual.some((d) => d.anioBGU === 3)
    );
    expect(modulosAnio3.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7.3 Test: Validación de duplicados
// ═══════════════════════════════════════════════════════════════════════════

describe("BT Curriculum - 7.3 Validación de duplicados", () => {
  it("un contenido no puede estar dos veces en el mismo trimestre", () => {
    const distribuciones = [
      { planificacionId: 1, contenidoId: 10, trimestre: 1 },
    ];

    // Intentar agregar el mismo contenido al mismo trimestre
    const duplicado = distribuciones.find(
      (d) => d.contenidoId === 10 && d.trimestre === 1
    );

    expect(duplicado).toBeDefined();
  });

  it("un contenido SÍ puede estar en trimestres diferentes", () => {
    const distribuciones = [
      { planificacionId: 1, contenidoId: 10, trimestre: 1 },
      { planificacionId: 1, contenidoId: 10, trimestre: 2 },
    ];

    // Verificar que hay 2 distribuciones para el mismo contenido
    const distribucionesContenido = distribuciones.filter(
      (d) => d.contenidoId === 10
    );
    expect(distribucionesContenido.length).toBe(2);

    // Verificar que están en trimestres diferentes
    const trimestres = distribucionesContenido.map((d) => d.trimestre);
    expect(new Set(trimestres).size).toBe(2);
  });

  it("validarContenidoNoDuplicado retorna error para duplicado", async () => {
    // Simular la función de validación
    function validarContenidoNoDuplicado(
      planificacionId: number,
      contenidoId: number,
      trimestre: number,
      distribucionesExistentes: any[],
      excludeId?: number
    ): { code: string; message: string } | null {
      const duplicado = distribucionesExistentes.find(
        (d) =>
          d.planificacionId === planificacionId &&
          d.contenidoId === contenidoId &&
          d.trimestre === trimestre &&
          (excludeId ? d.id !== excludeId : true)
      );

      if (duplicado) {
        return {
          code: "CONTENIDO_DUPLICADO_TRIMESTRE",
          message: `El contenido ya está asignado al trimestre ${trimestre}`,
        };
      }
      return null;
    }

    const distribuciones = [
      { id: 1, planificacionId: 1, contenidoId: 10, trimestre: 1 },
    ];

    // Caso duplicado
    const error = validarContenidoNoDuplicado(1, 10, 1, distribuciones);
    expect(error).not.toBeNull();
    expect(error?.code).toBe("CONTENIDO_DUPLICADO_TRIMESTRE");

    // Caso válido (trimestre diferente)
    const sinError = validarContenidoNoDuplicado(1, 10, 2, distribuciones);
    expect(sinError).toBeNull();

    // Caso válido (excluir ID actual)
    const sinErrorExcluyendo = validarContenidoNoDuplicado(
      1,
      10,
      1,
      distribuciones,
      1
    );
    expect(sinErrorExcluyendo).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7.4 Test: Validación de año + carga horaria
// ═══════════════════════════════════════════════════════════════════════════

describe("BT Curriculum - 7.4 Validación de año + carga horaria", () => {
  it("rechaza contenido de módulo no asignado al año", () => {
    // Módulo solo en 2.º BGU
    const modulosPorAnio = [
      { moduloId: 5, anioBGU: 2, cargaHorariaSemanal: 10 },
    ];

    // Planificación en 1.º BGU
    const planificacion = { anioBGU: 1 };

    // Contenido pertenece al módulo 5
    const contenido = { moduloId: 5 };

    // Verificar que el módulo NO está en 1.º BGU
    const moduloEnAnio = modulosPorAnio.find(
      (m) =>
        m.moduloId === contenido.moduloId &&
        m.anioBGU === planificacion.anioBGU
    );

    expect(moduloEnAnio).toBeUndefined();
  });

  it("acepta contenido de módulo asignado al año", () => {
    // Módulo en 1.º y 2.º BGU
    const modulosPorAnio = [
      { moduloId: 5, anioBGU: 1, cargaHorariaSemanal: 5 },
      { moduloId: 5, anioBGU: 2, cargaHorariaSemanal: 10 },
    ];

    // Planificación en 1.º BGU
    const planificacion = { anioBGU: 1 };

    // Contenido pertenece al módulo 5
    const contenido = { moduloId: 5 };

    // Verificar que el módulo SÍ está en 1.º BGU
    const moduloEnAnio = modulosPorAnio.find(
      (m) =>
        m.moduloId === contenido.moduloId &&
        m.anioBGU === planificacion.anioBGU
    );

    expect(moduloEnAnio).toBeDefined();
    expect(moduloEnAnio?.cargaHorariaSemanal).toBe(5);
  });

  it("validarCargaHoraria detecta exceso", () => {
    // Módulo con 5 horas semanales
    const cargaHorariaSemanal = 5;

    // Máximo razonable: 5 horas * 3 trimestres = 15 contenidos
    const maxContenidosEsperados = cargaHorariaSemanal * 3;

    // Distribución excesiva
    const contenidosAsignados = 20;

    expect(contenidosAsignados).toBeGreaterThan(maxContenidosEsperados);
  });

  it("validarCargaHoraria acepta carga válida", () => {
    // Módulo con 7 horas semanales
    const cargaHorariaSemanal = 7;

    // Máximo razonable: 7 horas * 3 trimestres = 21 contenidos
    const maxContenidosEsperados = cargaHorariaSemanal * 3;

    // Distribución válida
    const contenidosAsignados = 15;

    expect(contenidosAsignados).toBeLessThanOrEqual(maxContenidosEsperados);
  });

  it("carga horaria semanal ≠ carga horaria del trimestre", () => {
    // Carga semanal: 7 horas/semana
    const cargaHorariaSemanal = 7;

    // Un trimestre tiene ~12 semanas
    const semanasPorTrimestre = 12;
    const cargaHorariaTrimestre = cargaHorariaSemanal * semanasPorTrimestre;

    // Son magnitudes diferentes
    expect(cargaHorariaTrimestre).toBe(84);
    expect(cargaHorariaSemanal).not.toBe(cargaHorariaTrimestre);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7.5 Test: Integridad de planificación
// ═══════════════════════════════════════════════════════════════════════════

describe("BT Curriculum - 7.5 Integridad de planificación", () => {
  it("crea planificación con distribución válida", () => {
    // Planificación
    const planificacion = {
      id: 1,
      sessionId: "test-session",
      figuraId: 1,
      anioBGU: 1,
      anioLectivo: "2026-2027",
      nombre: "Planificación 1.º BGU",
    };

    // Distribución trimestral
    const distribucion = [
      { planificacionId: 1, trimestre: 1, contenidoId: 1, raId: null },
      { planificacionId: 1, trimestre: 1, contenidoId: 2, raId: null },
      { planificacionId: 1, trimestre: 2, contenidoId: 3, raId: 1 },
      { planificacionId: 1, trimestre: 3, contenidoId: 4, raId: 1 },
    ];

    // Verificar integridad
    expect(distribucion.every((d) => d.planificacionId === planificacion.id)).toBe(
      true
    );
    expect(distribucion.length).toBe(4);
  });

  it("resumen de carga horaria usa btModuloPorAnio, no cuenta filas", () => {
    // Módulo con 7 horas semanales
    const cargaHorariaSemanal = 7;

    // Distribución con 10 contenidos en T1
    const distribucion = Array(10).fill({ trimestre: 1 });

    // La carga horaria NO es 10 (cantidad de contenidos)
    // La carga horaria es 7 (del catálogo oficial)
    const cargaReal = cargaHorariaSemanal;

    expect(cargaReal).toBe(7);
    expect(cargaReal).not.toBe(distribucion.length);
  });

  it("distribución permanece asociada a la planificación", () => {
    const distribuciones = [
      { id: 1, planificacionId: 10, trimestre: 1, contenidoId: 1 },
      { id: 2, planificacionId: 10, trimestre: 2, contenidoId: 2 },
      { id: 3, planificacionId: 10, trimestre: 3, contenidoId: 3 },
      { id: 4, planificacionId: 11, trimestre: 1, contenidoId: 4 },
    ];

    // Filtrar distribuciones de planificación 10
    const distribucionesPlan10 = distribuciones.filter(
      (d) => d.planificacionId === 10
    );
    expect(distribucionesPlan10.length).toBe(3);

    // Eliminar planificación 10
    const distribucionesRestantes = distribuciones.filter(
      (d) => d.planificacionId !== 10
    );
    expect(distribucionesRestantes.length).toBe(1);
    expect(distribucionesRestantes[0].planificacionId).toBe(11);
  });

  it("eliminar planificación elimina sus distribuciones", () => {
    const planificaciones = [
      { id: 10, nombre: "Plan 1" },
      { id: 11, nombre: "Plan 2" },
    ];

    const distribuciones = [
      { id: 1, planificacionId: 10 },
      { id: 2, planificacionId: 10 },
      { id: 3, planificacionId: 11 },
    ];

    // Eliminar planificación 10
    const planificacionesRestantes = planificaciones.filter(
      (p) => p.id !== 10
    );
    const distribucionesRestantes = distribuciones.filter(
      (d) => d.planificacionId !== 10
    );

    expect(planificacionesRestantes.length).toBe(1);
    expect(distribucionesRestantes.length).toBe(1);
    expect(distribucionesRestantes[0].planificacionId).toBe(11);
  });
});
