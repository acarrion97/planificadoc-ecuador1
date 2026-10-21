/**
 * Inicio por intención (fase 3, spec `inicio-por-intencion`, tareas 3.5 y 3.8).
 *
 * Verifica sobre el código fuente del Home que:
 *  - no quedan cuadrículas de áreas, tarjetas de módulo ni el bloque muerto de BT;
 *  - el banner de WhatsApp se fue a Mi cuenta;
 *  - siguen el buscador de destrezas, el bloque "Continuar" y el CTA a /crear.
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const home = fs.readFileSync(path.join("app", "(tabs)", "index.tsx"), "utf8");
const cuenta = fs.readFileSync(path.join("app", "(tabs)", "cuenta.tsx"), "utf8");

describe("Inicio por intención", () => {
  it("no renderiza cuadrículas de áreas ni tarjetas de módulo (3.2)", () => {
    const prohibidos = [
      "EGB_AREAS", // cuadrícula de áreas EGB
      "BGU_AREAS", // cuadrícula de áreas BGU
      "renderAreaCard",
      "areasGrid",
      "filtrarPorArea",
      "/planificar-inicial", // tarjeta de módulo Inicial
      "/planificar-preparatoria", // tarjeta de módulo Preparatoria
      "/planificacion-anual", // tarjeta PCA
      "/planificacion-trimestral", // tarjeta PCT
      "/bachillerato-tecnico",
      "false &&", // bloque muerto de Bachillerato Técnico
      "pcaCard",
      "Educación General Básica", // encabezado de catálogo EGB
      "Bachillerato General Unificado", // encabezado de catálogo BGU
      "Documentos oficiales MinEduc", // encabezado de Planificación Curricular
    ];
    for (const marcador of prohibidos) {
      expect(home, `el Home aún contiene: ${marcador}`).not.toContain(marcador);
    }
  });

  it("retira el banner de WhatsApp del Inicio y lo deja en Mi cuenta (3.6)", () => {
    expect(home).not.toContain("chat.whatsapp.com");
    expect(cuenta).toContain("chat.whatsapp.com");
  });

  it("mantiene el buscador de destrezas con su detalle (3.7)", () => {
    expect(home).toContain("buscarDestrezas");
    expect(home).toContain("query.trim().length < 2");
    expect(home).toContain("/destreza/");
  });

  it("presenta marca, bloque Continuar y CTA a /crear (3.1, 3.3, 3.5)", () => {
    expect(home).toContain("PlanificaDoc");
    expect(home).toContain("Continuar");
    expect(home).toContain('router.push("/crear" as any)');
    // El bloque Continuar solo se renderiza cuando hay planes (3.4).
    expect(home).toContain("{recientes.length > 0 && (");
  });

  it("Continuar cubre los tipos que tienen pantalla de detalle", () => {
    expect(home).toContain("/ver-plan/");
    expect(home).toContain("/ver-semana/");
    expect(home).toContain("/ver-cnc/");
    expect(home).toContain("/ver-evaluacion/");
  });
});
