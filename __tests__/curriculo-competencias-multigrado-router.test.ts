import { describe, it, expect } from "vitest";
import {
  normalizarPlanificacionMultigrado,
  validarSubnivelHomogeneo,
  type PlanificacionMultigradoRaw,
} from "../lib/curriculo-competencias-normalizer";
import {
  validarPlanificacionMultigrado,
  determinarFamiliaExportacion,
} from "../server/curriculo-competencias-router";
import { resolverBloquePorGrado } from "../data/competencias-especificas-egb-bgu";

const MATERIA_ID = "matematica";
const CE_CODIGO = "CE.M.4.1";
const GRADOS_SUPERIOR = ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"];
// Ids esperados tras slugificarGrado() (quita diacríticos: "DÉCIMO" -> "decimo").
const GRADO_IDS = ["octavo-grado", "noveno-grado", "decimo-grado"];

function multigradoInputValido(
  overrides: Partial<PlanificacionMultigradoRaw> = {}
): PlanificacionMultigradoRaw {
  const bloques = resolverBloquePorGrado(MATERIA_ID, CE_CODIGO, GRADOS_SUPERIOR);
  return {
    institucion: "Unidad Educativa Rural El Progreso",
    docente: "Angie Carrión",
    paralelo: "A",
    asignatura: MATERIA_ID,
    trimestre: "Primero",
    noSemanasClase: 8,
    nivel: "SUPERIOR",
    grados: GRADOS_SUPERIOR.map((grado) => ({
      grado,
      nivel: "SUPERIOR",
      bloqueCurricular: bloques[grado],
    })),
    competenciaEspecifica: {
      codigo: CE_CODIGO,
      descripcion: "Aplicar relaciones de orden, operaciones numéricas...",
    },
    situacionAprendizaje: {
      titulo: "Ecuaciones matemáticas",
      descripcion: "Descripción de la situación de aprendizaje",
    },
    semanas: [
      {
        numero: 1,
        tema: "Conjuntos numéricos y orden",
        actividades: GRADO_IDS.map((gradoId) => ({
          gradoId,
          estrategiasDUA: { inicio: "Inicio", desarrollo: "Desarrollo", cierre: "Cierre" },
          recursos: "Ficha de trabajo",
          tecnica: "Observación",
          instrumento: "Lista de cotejo",
        })),
      },
    ],
    ...overrides,
  };
}

describe("normalizarPlanificacionMultigrado", () => {
  it("normaliza grados con id estable derivado del nombre del grado", () => {
    const plan = normalizarPlanificacionMultigrado(multigradoInputValido());

    expect(plan.modalidad).toBe("multigrado");
    expect(plan.grados).toHaveLength(3);
    expect(plan.grados[0].id).toBe("octavo-grado");
    expect(plan.grados[0].bloqueCurricular.declarativos.length).toBeGreaterThan(0);
  });

  it("respeta un id de grado provisto explícitamente en vez de derivarlo", () => {
    const raw = multigradoInputValido();
    raw.grados![0].id = "8vo-egb-custom";
    const plan = normalizarPlanificacionMultigrado(raw);
    expect(plan.grados[0].id).toBe("8vo-egb-custom");
  });

  it("filtra actividades semanales cuyo gradoId no corresponde a ningún grado seleccionado", () => {
    const raw = multigradoInputValido();
    raw.semanas![0].actividades!.push({
      gradoId: "grado-inexistente",
      estrategiasDUA: { inicio: "x", desarrollo: "x", cierre: "x" },
      recursos: "x",
      tecnica: "x",
      instrumento: "x",
    });
    const plan = normalizarPlanificacionMultigrado(raw);
    expect(plan.semanas[0].actividades).toHaveLength(3); // no 4
  });

  it("NO descarta las actividades cuando el payload del wizard usa el nombre crudo del grado como id y como gradoId (regresión)", () => {
    // Reproduce exactamente lo que envía app/curriculo-competencias/egb-bgu-integrado.tsx:
    // grados[].id = nombre de grado sin slugificar, y actividades[].gradoId = ese mismo valor.
    // Antes de la corrección, el wizard omitía `id` y el servidor lo derivaba
    // slugificado ("octavo-grado"), mientras que gradoId seguía siendo el
    // nombre crudo ("OCTAVO GRADO") — el filtro de normalizarPlanificacionMultigrado
    // descartaba entonces TODAS las actividades semanales silenciosamente.
    const raw = multigradoInputValido();
    raw.grados = raw.grados!.map((g) => ({ ...g, id: g.grado }));
    raw.semanas = [
      {
        numero: 1,
        tema: "Conjuntos numéricos y orden",
        actividades: GRADOS_SUPERIOR.map((grado) => ({
          gradoId: grado,
          estrategiasDUA: { inicio: "Inicio", desarrollo: "Desarrollo", cierre: "Cierre" },
          recursos: "Ficha de trabajo",
          tecnica: "Observación",
          instrumento: "Lista de cotejo",
        })),
      },
    ];

    const plan = normalizarPlanificacionMultigrado(raw);

    expect(plan.grados.map((g) => g.id)).toEqual(GRADOS_SUPERIOR);
    expect(plan.semanas[0].actividades).toHaveLength(3);
    expect(plan.semanas[0].actividades.map((a) => a.gradoId).sort()).toEqual(
      [...GRADOS_SUPERIOR].sort()
    );
  });
});

describe("validarSubnivelHomogeneo", () => {
  it("es válido cuando todos los grados comparten subnivel", () => {
    expect(
      validarSubnivelHomogeneo([{ nivel: "SUPERIOR" }, { nivel: "SUPERIOR" }])
    ).toEqual({ valido: true, nivelesEncontrados: ["SUPERIOR"] });
  });

  it("no es válido cuando los grados mezclan subniveles", () => {
    const resultado = validarSubnivelHomogeneo([
      { nivel: "MEDIA" },
      { nivel: "SUPERIOR" },
    ]);
    expect(resultado.valido).toBe(false);
    expect(resultado.nivelesEncontrados).toEqual(["MEDIA", "SUPERIOR"]);
  });
});

describe("validarPlanificacionMultigrado (revalidación de servidor)", () => {
  it("no lanza con una combinación válida (CE.M.4.1, SUPERIOR, 3 grados)", () => {
    const input = multigradoInputValido();
    expect(() =>
      validarPlanificacionMultigrado({
        grados: input.grados!,
        asignatura: input.asignatura,
        competenciaEspecifica: input.competenciaEspecifica,
      })
    ).not.toThrow();
  });

  it("rechaza una combinación de grados en subniveles distintos", () => {
    const input = multigradoInputValido();
    input.grados![1].nivel = "MEDIA"; // mezcla SUPERIOR con MEDIA
    expect(() =>
      validarPlanificacionMultigrado({
        grados: input.grados!,
        asignatura: input.asignatura,
        competenciaEspecifica: input.competenciaEspecifica,
      })
    ).toThrow(/subniveles distintos/);
  });

  it("rechaza una CE que no cubre uno de los grados seleccionados", () => {
    const input = multigradoInputValido();
    input.grados!.push({ grado: "SEXTO GRADO", nivel: "SUPERIOR" });
    expect(() =>
      validarPlanificacionMultigrado({
        grados: input.grados!,
        asignatura: input.asignatura,
        competenciaEspecifica: input.competenciaEspecifica,
      })
    ).toThrow(/no cubre/);
  });
});

describe("determinarFamiliaExportacion", () => {
  it("identifica una planificación multigrado por su campo modalidad explícito", () => {
    expect(
      determinarFamiliaExportacion({
        tipo: "inicial_preparatoria",
        formData: { modalidad: "multigrado", grados: [] },
      })
    ).toBe("curriculo_integrado_multigrado");
  });

  it("un registro previo sin modalidad sigue exportando como Inicial (heurística CE.CI.*)", () => {
    expect(
      determinarFamiliaExportacion({
        tipo: "inicial_preparatoria",
        formData: { ambitos: [{ competenciaCodigo: "CE.CI.0.1" }] },
      })
    ).toBe("curriculo_integrado_inicial");
  });

  it("un registro previo sin modalidad sigue exportando como Integrado single-grade (heurística por prefijo)", () => {
    expect(
      determinarFamiliaExportacion({
        tipo: "inicial_preparatoria",
        formData: { ambitos: [{ competenciaCodigo: "CE.M.4.1" }] },
      })
    ).toBe("curriculo_integrado_single");
  });

  it("un registro egb_bgu (DCD) sigue exportando por esa familia, sin importar formData", () => {
    expect(
      determinarFamiliaExportacion({ tipo: "egb_bgu", formData: { modalidad: "multigrado" } })
    ).toBe("egb_bgu_dcd");
  });
});
