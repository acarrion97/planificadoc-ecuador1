import { describe, expect, it } from "vitest";
import {
  buscarCompetenciaEspecificaEGBBGU,
  competenciasDeGrado,
  gradosDeNivel,
  nivelesDeMateria,
  obtenerMateria,
  resolverBloquePorGrado,
} from "../data/competencias-especificas-egb-bgu";

const MATERIA_ID = "educacion-fisica";

describe("catálogo de competencias específicas de Educación Física", () => {
  it("está integrado con los niveles disponibles en los PDF suministrados", () => {
    expect(obtenerMateria(MATERIA_ID)?.nombre).toBe("Educación Física");
    expect(nivelesDeMateria(MATERIA_ID)).toEqual([
      "PREPARATORIA",
      "MEDIA",
      "SUPERIOR",
      "BACHILLERATO",
    ]);
    expect(gradosDeNivel(MATERIA_ID, "PREPARATORIA")).toEqual(["PRIMER GRADO"]);
    expect(gradosDeNivel(MATERIA_ID, "MEDIA")).toEqual([
      "QUINTO GRADO",
      "SEXTO GRADO",
      "SÉPTIMO GRADO",
    ]);
  });

  it("incluye códigos únicos y normalizados por subnivel", () => {
    const competencias = obtenerMateria(MATERIA_ID)!.competencias;
    const codigos = competencias.map((competencia) => competencia.codigo);

    expect(codigos).toHaveLength(23);
    expect(new Set(codigos).size).toBe(codigos.length);
    expect(codigos).toEqual(
      expect.arrayContaining([
        "CE.EF.1.1",
        "CE.EF.3.5",
        "CE.EF.4.4",
        "CE.EF.4.6",
        "CE.EF.5.7",
      ]),
    );
    expect(buscarCompetenciaEspecificaEGBBGU("CE.EF.4.6")?.codigo).toBe(
      "CE.EF.4.6",
    );
  });

  it("resuelve indicadores y cobertura por grado para la competencia seleccionada", () => {
    const competencia = competenciasDeGrado(
      MATERIA_ID,
      "SUPERIOR",
      "OCTAVO GRADO",
    ).find((item) => item.codigo === "CE.EF.4.6");
    const bloque = resolverBloquePorGrado(MATERIA_ID, "CE.EF.4.6", [
      "OCTAVO GRADO",
    ]);
    const bloquePreparatoria = resolverBloquePorGrado(MATERIA_ID, "CE.EF.1.1", [
      "PRIMER GRADO",
    ]);

    expect(competencia?.descripcion).toContain("prácticas expresivo");
    expect(bloque["OCTAVO GRADO"].indicadores[0]).toContain("I.EF.4.6.1");
    expect(bloquePreparatoria["PRIMER GRADO"].declarativos[0]).toContain(
      "EF.1.1.d.1",
    );
    expect(gradosDeNivel(MATERIA_ID, "BACHILLERATO")).toEqual([
      "PRIMER CURSO",
      "SEGUNDO CURSO",
      "TERCER CURSO",
    ]);
  });
});
