import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

import { extensionDe, parseDocumento } from "../server/import-formato/parse";
import { reconocerTipo } from "../server/import-formato/matcher";
import { mapearCamposPca } from "../server/import-formato/mapear-pca";
import { ArchivoNoProcesableError } from "../server/import-formato/types";
import { PcaAiResultSchema } from "../server/import-formato/schemas";
import { construirDocPruebaPca } from "../scripts/generar-doc-prueba-pca";

const FIXTURE_DOC_OFICIAL = join(__dirname, "fixtures", "pca-oficial-2016-2017.doc");

describe("importar-formato: extensionDe", () => {
  it("acepta .doc, .docx y .pdf (insensible a mayúsculas)", () => {
    expect(extensionDe("plan.DOCX")).toBe("docx");
    expect(extensionDe("plan.doc")).toBe("doc");
    expect(extensionDe("plan.pdf")).toBe("pdf");
  });

  it("rechaza extensiones no soportadas", () => {
    expect(extensionDe("plan.txt")).toBeNull();
    expect(extensionDe("plan")).toBeNull();
  });
});

describe("importar-formato: parseDocumento — archivos dañados", () => {
  it("lanza ArchivoNoProcesableError con un .docx corrupto", async () => {
    await expect(parseDocumento(Buffer.from("no soy un docx"), "docx")).rejects.toBeInstanceOf(
      ArchivoNoProcesableError
    );
  });

  it("lanza ArchivoNoProcesableError con un .pdf corrupto", async () => {
    await expect(parseDocumento(Buffer.from("no soy un pdf"), "pdf")).rejects.toBeInstanceOf(
      ArchivoNoProcesableError
    );
  });

  it("lanza ArchivoNoProcesableError con un .doc corrupto", async () => {
    await expect(parseDocumento(Buffer.from("no soy un doc"), "doc")).rejects.toBeInstanceOf(
      ArchivoNoProcesableError
    );
  });
});

describe("importar-formato: reconocimiento — documento no reconocido", () => {
  it("reporta no_reconocido para un .docx sin las secciones del formato oficial", async () => {
    const docx = await import("docx");
    const doc = new docx.Document({
      sections: [{ children: [new docx.Paragraph({ children: [new docx.TextRun("Un documento cualquiera, sin relación con ningún formato MinEduc.")] })] }],
    });
    const buffer = await docx.Packer.toBuffer(doc);
    const parsed = await parseDocumento(Buffer.from(buffer), "docx");
    const reco = reconocerTipo(parsed);
    expect(reco.estado).toBe("no_reconocido");
  });
});

describe("importar-formato: reconocimiento — formato oficial real (.doc)", () => {
  it("reconoce el PCA 2016-2017 oficial del MinEduc (blanco) como tipo pca", async () => {
    const buffer = readFileSync(FIXTURE_DOC_OFICIAL);
    const parsed = await parseDocumento(buffer, "doc");
    const reco = reconocerTipo(parsed);
    expect(reco.estado).toBe("reconocido");
    if (reco.estado === "reconocido") {
      expect(reco.tipo).toBe("pca");
      expect(reco.score).toBeGreaterThanOrEqual(0.6);
    }
  });
});

describe("importar-formato: pipeline completo sobre un documento de prueba generado", () => {
  it("reconoce y extrae los campos de un PCA parcialmente llenado, dejando lo no llenado como undefined", async () => {
    const buffer = await construirDocPruebaPca({
      institucion: 'Unidad Educativa "Simón Bolívar"',
      anioLectivo: "2025-2026",
      area: "Matemática",
      docente: "Lcda. María Fernanda Torres",
      grado: "8vo EGB",
      nivelEducativo: "Básica Superior",
      cargaHorariaSemanal: 5,
      semanasTrabajoTotal: 40,
      semanasEvaluacion: 8,
      unidades: [{ numero: 1, duracionSemanas: 6 }, { numero: 2, duracionSemanas: 6 }],
      direccionInstitucion: "Av. Amazonas N34-451, Quito",
      telefonoInstitucion: "02-2345678",
      colorMarcaAgua: "7C3AED",
    });

    const parsed = await parseDocumento(buffer, "docx");
    const reco = reconocerTipo(parsed);
    expect(reco).toEqual({ estado: "reconocido", tipo: "pca", score: 1 });

    const campos = mapearCamposPca(parsed);
    expect(campos.institucion).toBe('Unidad Educativa "Simón Bolívar"');
    expect(campos.docente).toBe("Lcda. María Fernanda Torres");
    expect(campos.area).toBe("Matemática");
    expect(campos.grado).toBe("8vo EGB");
    expect(campos.anioLectivo).toBe("2025-2026");
    expect(campos.cargaHorariaSemanal).toBe(5);
    expect(campos.semanasTrabajoTotal).toBe(40);
    expect(campos.semanasEvaluacion).toBe(8);
    expect(campos.unidades).toEqual([
      { numero: 1, titulo: undefined, objetivosEspecificos: undefined, contenidos: undefined, orientacionesMetodologicas: undefined, evaluacion: undefined, duracionSemanas: 6 },
      { numero: 2, titulo: undefined, objetivosEspecificos: undefined, contenidos: undefined, orientacionesMetodologicas: undefined, evaluacion: undefined, duracionSemanas: 6 },
    ]);

    // Deliberadamente vacíos en el documento de prueba — quedan para que la IA los complete.
    expect(campos.objetivosArea).toBeUndefined();
    expect(campos.objetivosGrado).toBeUndefined();
    expect(campos.bibliografia).toBeUndefined();
    expect(campos.observaciones).toBeUndefined();
  });
});

describe("importar-formato: PcaAiResultSchema", () => {
  const valido = {
    objetivosArea: "Desarrollar el pensamiento lógico...",
    objetivosGrado: "Aplicar operaciones con números racionales...",
    unidades: [
      {
        numero: 1,
        titulo: "Números racionales",
        objetivosEspecificos: "...",
        contenidos: "...",
        orientacionesMetodologicas: "...",
        evaluacion: "...",
        duracionSemanas: 6,
      },
    ],
    bibliografiaSugerida: "Ministerio de Educación del Ecuador. (2023)...",
    observaciones: "...",
  };

  it("acepta una respuesta de IA con la forma esperada", () => {
    expect(PcaAiResultSchema.safeParse(valido).success).toBe(true);
  });

  it("rechaza una respuesta de IA con un campo requerido faltante", () => {
    const { objetivosArea, ...incompleto } = valido;
    expect(PcaAiResultSchema.safeParse(incompleto).success).toBe(false);
  });

  it("rechaza una respuesta de IA con un tipo de dato incorrecto", () => {
    const invalido = { ...valido, unidades: [{ ...valido.unidades[0], duracionSemanas: "seis" }] };
    expect(PcaAiResultSchema.safeParse(invalido).success).toBe(false);
  });
});
