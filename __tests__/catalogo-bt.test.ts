import { describe, it, expect } from "vitest";
import {
  AREAS_BT,
  FAMILIAS_PROFESIONALES,
  FIGURAS_PROFESIONALES,
  obtenerFigurasActivas,
  obtenerFiguraPorId,
  obtenerFigurasPorFamilia,
} from "../data";

describe("Catálogo de Bachillerato Técnico (00051-A)", () => {
  it("mantiene 3 áreas, 11 familias y 34 figuras vigentes", () => {
    expect(AREAS_BT.length).toBe(3);
    expect(FAMILIAS_PROFESIONALES.length).toBe(11);
    const totalFiguras = FAMILIAS_PROFESIONALES.reduce(
      (acc, f) => acc + f.figuras.length,
      0
    );
    expect(totalFiguras).toBe(34);
    expect(obtenerFigurasActivas().length).toBe(34);
  });

  it("tiene 34 figuras activas y 1 histórica deprecada", () => {
    const activas = obtenerFigurasActivas();
    const deprecadas = FIGURAS_PROFESIONALES.filter(
      (f) => f.estado === "deprecada"
    );
    expect(activas.length).toBe(34);
    expect(deprecadas.length).toBe(1);
    expect(deprecadas[0].id).toBe("construcciones-metalicas");
  });

  it("resuelve la figura histórica deprecada para reproducir planes guardados", () => {
    const figura = obtenerFiguraPorId("construcciones-metalicas");
    expect(figura).toBeDefined();
    expect(figura?.estado).toBe("deprecada");
    expect(figura?.nombre).toBe("Estructuras y Construcciones Metálicas");
    expect(figura?.reemplazadaPor).toBe("mecanica-industrial");
    const codigosModulos = figura?.modulos.map((m) => m.codigo) ?? [];
    expect(codigosModulos).toEqual(["CM.1.1", "CM.2.1", "CM.3.1"]);
  });

  it("ofrece la nueva figura Mecánica industrial como activa en la familia Industrial", () => {
    const figura = obtenerFiguraPorId("mecanica-industrial");
    expect(figura).toBeDefined();
    expect(figura?.nombre).toBe("Mecánica industrial");
    expect(figura?.familia).toBe("industrial");
    expect(figura?.estado).toBe("activa");
    expect(figura?.codigo).toBe("TC-05-08");
  });

  it("el selector de planes nuevos excluye deprecadas e incluye Mecánica industrial", () => {
    const activas = obtenerFigurasActivas();
    expect(activas.some((f) => f.id === "construcciones-metalicas")).toBe(false);
    expect(activas.some((f) => f.id === "mecanica-industrial")).toBe(true);
  });

  it("aplica los renombres y movimientos de familia de 00051-A", () => {
    const gestion = obtenerFiguraPorId("gestion-financiera");
    expect(gestion?.nombre).toBe("Gestión financiera y contable");
    expect(gestion?.codigo).toBe("TC-01-01");

    const instalaciones = obtenerFiguraPorId("instalaciones-electricas");
    expect(instalaciones?.nombre).toBe("Instalaciones eléctricas y automatización");
    expect(instalaciones?.familia).toBe("industrial");
    expect(instalaciones?.codigo).toBe("TC-05-09");

    const climatizacion = obtenerFiguraPorId("climatizacion");
    expect(climatizacion?.familia).toBe("industrial");
    expect(climatizacion?.codigo).toBe("TC-05-10");

    const musica = obtenerFiguraPorId("musica");
    expect(musica?.nombre).toBe("Música y gestión cultural");
    expect(musica?.codigo).toBe("AR-01-03");
  });

  it("asigna la familia Construcción sostenible solo a obra civil (activas)", () => {
    const activasConstruccion = obtenerFigurasPorFamilia("construccion").filter(
      (f) => f.estado !== "deprecada"
    );
    expect(activasConstruccion.map((f) => f.id)).toEqual(["obra-civil"]);
  });

  it("las figuras movidas por 00051-A son miembros de la familia Industrial", () => {
    const industrial = obtenerFigurasPorFamilia("industrial").map((f) => f.id);
    expect(industrial).toContain("mecanica-industrial");
    expect(industrial).toContain("instalaciones-electricas");
    expect(industrial).toContain("climatizacion");
  });

  it("corrige el área de la familia Artes a Artística", () => {
    const artes = FAMILIAS_PROFESIONALES.find((f) => f.id === "artes");
    expect(artes?.area).toBe("artistica");
  });

  it("conserva los módulos históricos de la figura deprecada (reproducción)", () => {
    const deprecada = obtenerFiguraPorId("construcciones-metalicas");
    const nueva = obtenerFiguraPorId("mecanica-industrial");
    expect(deprecada?.modulos).toHaveLength(3);
    expect(nueva?.modulos).toHaveLength(3);
    expect(nueva?.modulos.map((m) => m.codigo)).toEqual([
      "CM.1.1",
      "CM.2.1",
      "CM.3.1",
    ]);
  });
});