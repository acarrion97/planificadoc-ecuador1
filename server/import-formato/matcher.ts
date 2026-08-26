import { HUELLAS, UMBRAL_RECONOCIMIENTO, UMBRAL_AMBIGUEDAD, tiposConHuella } from "./huellas";
import { DocumentoParseado, ResultadoReconocimiento, TipoPlanificacion } from "./types";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function textoCompleto(doc: DocumentoParseado): string {
  const celdas = doc.tablas.flat().flat();
  return normalizar([doc.textoPlano, ...celdas].join(" \n "));
}

/**
 * Calcula el score de un tipo contra el documento.
 *
 * Fórmula:
 * - obligatorias: si alguna falta, score = 0 (descarta inmediatamente)
 * - opcionales: proporción de encontradas
 * - penalizadoras: cada encontrada reduce 0.15 del score
 * - el score final es: proporcionOpcionales - penalizacion
 */
function calcularScore(
  texto: string,
  tipo: TipoPlanificacion
): { score: number; obligatoriasFaltantes: string[] } {
  const huella = HUELLAS[tipo];

  // Verificar obligatorias
  const obligatoriasFaltantes = huella.obligatorias.filter(
    (h) => !texto.includes(normalizar(h))
  );

  if (obligatoriasFaltantes.length > 0) {
    return { score: 0, obligatoriasFaltantes };
  }

  // Calcular proporción de opcionales encontradas
  const opcionalesEncontradas = huella.opcionales.filter(
    (h) => texto.includes(normalizar(h))
  ).length;

  const proporcionOpcionales =
    huella.opcionales.length > 0
      ? opcionalesEncontradas / huella.opcionales.length
      : 1; // Si no hay opcionales, score base es 1

  // Calcular penalización
  const penalizacionesEncontradas = huella.penalizadoras.filter(
    (h) => texto.includes(normalizar(h))
  ).length;

  const penalizacion = penalizacionesEncontradas * 0.15;

  const score = Math.max(0, proporcionOpcionales - penalizacion);

  return { score, obligatoriasFaltantes: [] };
}

/**
 * Compara el documento parseado contra la huella de cada tipo soportado y
 * devuelve:
 *
 * - "reconocido" si hay un candidato claro que supera UMBRAL_RECONOCIMIENTO
 * - "ambiguo" si hay múltiples candidatos con scores similares
 * - "no_reconocido" si ningún candidato supera el umbral
 */
export function reconocerTipo(doc: DocumentoParseado): ResultadoReconocimiento {
  const texto = textoCompleto(doc);

  const candidatos: Array<{ tipo: TipoPlanificacion; score: number }> = [];

  for (const tipo of tiposConHuella()) {
    const { score } = calcularScore(texto, tipo);
    if (score > 0) {
      candidatos.push({ tipo, score });
    }
  }

  // Ordenar por score descendente
  candidatos.sort((a, b) => b.score - a.score);

  console.log("[matcher] Candidatos:", candidatos);

  // No hay candidatos que superen el umbral
  if (candidatos.length === 0 || candidatos[0].score < UMBRAL_RECONOCIMIENTO) {
    return { estado: "no_reconocido" };
  }

  // Verificar ambigüedad: si el primero y el segundo están muy cerca
  if (candidatos.length >= 2) {
    const diferencia = candidatos[0].score - candidatos[1].score;
    if (diferencia < UMBRAL_AMBIGUEDAD) {
      return {
        estado: "ambiguo",
        candidatos: candidatos.filter((c) => c.score >= UMBRAL_RECONOCIMIENTO),
      };
    }
  }

  // Hay un ganador claro
  return {
    estado: "reconocido",
    tipo: candidatos[0].tipo,
    score: candidatos[0].score,
  };
}
