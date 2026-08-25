import { HUELLAS, UMBRAL_RECONOCIMIENTO, tiposConHuella } from "./huellas";
import { DocumentoParseado, ResultadoReconocimiento } from "./types";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes (marcas diacríticas combinantes tras NFD)
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function textoCompleto(doc: DocumentoParseado): string {
  const celdas = doc.tablas.flat().flat();
  return normalizar([doc.textoPlano, ...celdas].join(" \n "));
}

/**
 * Compara el documento parseado contra la huella de cada tipo soportado y
 * devuelve el de mayor score si supera UMBRAL_RECONOCIMIENTO, o
 * "no_reconocido" en caso contrario (ver spec.md, Requirement: Reconocimiento
 * del tipo y estructura del formato).
 */
export function reconocerTipo(doc: DocumentoParseado): ResultadoReconocimiento {
  const texto = textoCompleto(doc);
  let mejor: ResultadoReconocimiento = { tipo: "no_reconocido", score: 0 };

  for (const tipo of tiposConHuella()) {
    const huella = HUELLAS[tipo];
    const encontrados = huella.filter((encabezado) => texto.includes(normalizar(encabezado)));
    const score = encontrados.length / huella.length;
    if (score > mejor.score) {
      mejor = { tipo, score };
    }
  }

  if (mejor.score < UMBRAL_RECONOCIMIENTO) {
    return { tipo: "no_reconocido", score: mejor.score };
  }
  return mejor;
}
