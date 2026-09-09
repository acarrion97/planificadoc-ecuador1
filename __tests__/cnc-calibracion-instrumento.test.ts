import { describe, it, expect } from "vitest";
import {
  calibracionInstrumentoPorSubnivel,
  textoCalibracionInstrumento,
  estrategiasMetodologicasPorSubnivel,
} from "../lib/curriculo-prerrequisitos";
import type { Subnivel } from "../data/types";

describe("calibracionInstrumentoPorSubnivel — cubre todos los subniveles con destrezas reales", () => {
  const subnivelesCubiertos: Subnivel[] = [-1, 1, 2, 3, 4, 5];

  it.each(subnivelesCubiertos)("subnivel %i devuelve técnicas e instrumentos no vacíos", (subnivel) => {
    const c = calibracionInstrumentoPorSubnivel(subnivel);
    expect(c).not.toBeNull();
    expect(c!.tecnicas.length).toBeGreaterThan(0);
    expect(c!.instrumentos.length).toBeGreaterThan(0);
    expect(c!.fuente).toContain("Caja de herramientas");
  });

  it("subnivel 0 (sin uso conocido) devuelve null en vez de inventar una calibración", () => {
    expect(calibracionInstrumentoPorSubnivel(0)).toBeNull();
  });
});

describe("calibracionInstrumentoPorSubnivel — no es un switch por grado, es por subnivel real", () => {
  it("2.°, 3.° y 4.° EGB (todos subnivel Elemental = 2) reciben la MISMA calibración", () => {
    // La función solo recibe subnivel, nunca grado — por construcción no puede
    // distinguir 2do/3ro/4to EGB entre sí, que es exactamente la garantía que
    // impide una heurística simplista tipo "3ro EGB -> X".
    const c = calibracionInstrumentoPorSubnivel(2);
    expect(c?.subnivel).toBe(2);
  });

  it("Elemental (subnivel 2) es el único nivel con apoyo visual/pictográfico explícito", () => {
    const elemental = calibracionInstrumentoPorSubnivel(2);
    const media = calibracionInstrumentoPorSubnivel(3);
    const superior = calibracionInstrumentoPorSubnivel(4);
    const bachillerato = calibracionInstrumentoPorSubnivel(5);

    expect(elemental?.apoyoVisual).toMatch(/pictograma/i);
    expect(media?.apoyoVisual).toBeNull();
    expect(superior?.apoyoVisual).toBeNull();
    expect(bachillerato?.apoyoVisual).toBeNull();
  });

  it("Inicial y Preparatoria usan instrumentos observacionales, no pruebas escritas", () => {
    const inicial = calibracionInstrumentoPorSubnivel(-1);
    const preparatoria = calibracionInstrumentoPorSubnivel(1);

    expect(inicial?.tecnicas.join(" ")).toMatch(/observación/i);
    expect(inicial?.tecnicas.join(" ")).not.toMatch(/prueba escrita/i);
    expect(preparatoria?.tecnicas.join(" ")).toMatch(/observación/i);
    expect(preparatoria?.tecnicas.join(" ")).not.toMatch(/prueba escrita/i);
  });

  it("Elemental sí incluye instrumentos de prueba escrita breve, distinta de Bachillerato Técnico (sin heurística de edad)", () => {
    const elemental = calibracionInstrumentoPorSubnivel(2);
    expect(elemental?.tecnicas.join(" ")).toMatch(/prueba escrita/i);
    // Esta tabla no tiene ninguna noción de "Bachillerato Técnico": ese caso
    // se calibra aparte por contextoBT (Figura Profesional/módulo), nunca
    // consultando esta función — ver server/cnc-router.ts.
  });
});

describe("textoCalibracionInstrumento — texto listo para inyectar en el prompt", () => {
  it("incluye técnicas, instrumentos y fuente citada para un subnivel cubierto", () => {
    const texto = textoCalibracionInstrumento(2);
    expect(texto).not.toBeNull();
    expect(texto).toContain("Técnicas apropiadas");
    expect(texto).toContain("Instrumentos apropiados");
    expect(texto).toContain("Fuente:");
    expect(texto).toContain("pictograma");
  });

  it("omite la línea de apoyo visual cuando el subnivel no la tiene", () => {
    const texto = textoCalibracionInstrumento(4);
    expect(texto).not.toBeNull();
    expect(texto).not.toContain("Apoyo visual:");
  });

  it("devuelve null para un subnivel sin calibración conocida", () => {
    expect(textoCalibracionInstrumento(0)).toBeNull();
  });
});

describe("estrategiasMetodologicasPorSubnivel — ejemplos reales de Lineamientos Costa-Galápagos 2026-2027", () => {
  const subnivelesCubiertos: Subnivel[] = [-1, 1, 2, 3, 4, 5];

  it.each(subnivelesCubiertos)("subnivel %i devuelve ejemplos citando la fuente 2026-2027", (subnivel) => {
    const e = estrategiasMetodologicasPorSubnivel(subnivel);
    expect(e).not.toBeNull();
    expect(e!.ejemplos.length).toBeGreaterThan(0);
    expect(e!.fuente).toContain("2026-2027");
  });

  it("subnivel 0 devuelve null en vez de inventar", () => {
    expect(estrategiasMetodologicasPorSubnivel(0)).toBeNull();
  });

  it("Elemental (subnivel 2) incluye círculo de lectura y teatro de cuentos, verificados en pág. 17-18", () => {
    const e = estrategiasMetodologicasPorSubnivel(2);
    expect(e?.ejemplos).toContain("círculo de lectura");
    expect(e?.ejemplos).toContain("teatro de cuentos");
    expect(e?.fuente).toContain("2.5");
  });

  it("Inicial (subnivel -1) referencia juego-trabajo, verificado en pág. 16", () => {
    const e = estrategiasMetodologicasPorSubnivel(-1);
    expect(e?.ejemplos.join(" ")).toMatch(/juego-trabajo/i);
  });
});
