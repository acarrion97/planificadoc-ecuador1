import { describe, it, expect } from "vitest";
import {
  FIGURAS_PROFESIONALES,
  obtenerFiguraPorId,
  obtenerModulosSeleccionables,
  tieneCatalogoCompleto,
} from "../data/bachillerato-tecnico";
import { obtenerUnidadesCompetenciaDeModulo, UNIDADES_COMPETENCIA_BT } from "../data/bachillerato-tecnico-uc";
import { MODULOS_OFICIALES_BT } from "../data/bt/modulos-oficiales.generated";

describe("Catálogo BT — módulos oficiales (PDF MINEDUC)", () => {
  it("cubre las 31 figuras con PDF de módulos formativos", () => {
    expect(Object.keys(MODULOS_OFICIALES_BT)).toHaveLength(31);
    for (const id of Object.keys(MODULOS_OFICIALES_BT)) {
      expect(obtenerFiguraPorId(id), id).toBeDefined();
    }
  });

  it("integridad: todo módulo completo tiene RA, todo RA tiene CE y no hay ids repetidos en el módulo", () => {
    for (const figura of FIGURAS_PROFESIONALES) {
      for (const m of figura.modulos) {
        if (m.estadoCatalogo !== "completo" || !m.resultadosAprendizaje) continue;
        const contexto = `${figura.id}/${m.codigo}`;
        expect(m.resultadosAprendizaje.length, contexto).toBeGreaterThan(0);
        const ids = new Set<string>();
        for (const ra of m.resultadosAprendizaje) {
          expect(ra.criteriosEvaluacion.length, `${contexto}/${ra.id}`).toBeGreaterThan(0);
          for (const id of [ra.id, ...ra.criteriosEvaluacion.map((c) => c.id)]) {
            expect(ids.has(id), `${contexto}: id repetido ${id}`).toBe(false);
            ids.add(id);
          }
        }
      }
    }
  });

  it("los códigos de módulo son únicos en todo el catálogo (las UC se vinculan por código)", () => {
    const vistos = new Map<string, string>();
    for (const figura of FIGURAS_PROFESIONALES) {
      if (figura.estado === "deprecada") continue; // comparte módulos con mecanica-industrial
      for (const m of figura.modulos) {
        const previo = vistos.get(m.codigo);
        expect(previo === undefined || previo === figura.id, `${m.codigo} en ${previo} y ${figura.id}`).toBe(true);
        vistos.set(m.codigo, figura.id);
      }
    }
  });

  it("Desarrollo de Software ofrece los módulos oficiales del PDF", () => {
    const modulos = obtenerModulosSeleccionables("desarrollo-software");
    const nombres = modulos.map((m) => m.nombre);
    expect(nombres).toEqual([
      "Fundamentos de las Tecnologías de la Información y la Comunicación",
      "Pensamiento Computacional y Resolución de Problemas",
      "Ética, Legislación y Ciudadanía Digital",
      "Programación Estructurada",
      "Programación Orientada a Objetos",
      "Base de Datos",
      "Aplicaciones de Escritorio",
      "Aplicaciones Web y Móviles",
      "Práctico Experimental",
    ]);
    const tic = modulos[0];
    expect(tic.categoria).toBe("generico");
    expect(tic.nivel).toBe("1ro, 2do");
    expect(tic.duracionTotalPeriodos).toBe(200);
    expect(tic.resultadosAprendizaje?.[0].texto).toMatch(/^RA 1: Analizar la evolución de las tecnologías/);
    expect(tic.resultadosAprendizaje?.[0].criteriosEvaluacion[0].texto).toMatch(/^CE1\.1: Distingue la evolución de las TIC/);
    expect(modulos.every(tieneCatalogoCompleto)).toBe(true);
  });

  it("cada módulo oficial muestra su UC asociada", () => {
    const [tic] = obtenerModulosSeleccionables("desarrollo-software");
    const ucs = obtenerUnidadesCompetenciaDeModulo(tic.codigo);
    expect(ucs).toHaveLength(1);
    expect(ucs[0].texto).toMatch(/^UC1: Aplicar fundamentos de tecnologías de la información/);
    const ids = UNIDADES_COMPETENCIA_BT.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("el objetivo general de la figura es el del PDF", () => {
    expect(obtenerFiguraPorId("desarrollo-software")?.objetivoGeneral).toMatch(
      /^Desarrollar soluciones informáticas mediante el análisis, diseño, codificación/
    );
  });

  it("un plan guardado con un módulo reemplazado (DS.1.1) se sigue resolviendo, pero no se ofrece", () => {
    const figura = obtenerFiguraPorId("desarrollo-software");
    const historico = figura?.modulos.find((m) => m.codigo === "DS.1.1");
    expect(historico).toBeDefined();
    expect(historico?.estadoCatalogo).toBe("historico");
    expect(historico?.nombre).toBeTruthy();
    expect(obtenerModulosSeleccionables("desarrollo-software").some((m) => m.codigo === "DS.1.1")).toBe(false);
  });

  it("figuras sin PDF de módulos: no se inventa contenido", () => {
    const gd = obtenerModulosSeleccionables("gestion-deportiva");
    expect(gd.length).toBeGreaterThan(0);
    expect(gd.every((m) => m.estadoCatalogo === "pendiente" && !m.resultadosAprendizaje)).toBe(true);
    // Climatización conserva su transcripción previa, sin módulos históricos añadidos.
    expect(obtenerFiguraPorId("climatizacion")?.modulos.some((m) => m.estadoCatalogo === "historico")).toBe(false);
  });
});
