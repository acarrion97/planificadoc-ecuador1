/**
 * Mapeo compartido entre la Evaluación Diagnóstica y el plan "Conecta, Nivela
 * y Crea" (CNC). Única implementación para importar las brechas por DCD al
 * diagnóstico académico de la Semana 1, usada tanto por el detalle de la
 * evaluación (botón "→ CNC") como por el paso "Diagnóstico" del wizard CNC,
 * para evitar que existan dos comportamientos divergentes. También reúne la
 * derivación de la rúbrica del proyecto interdisciplinar (Semanas 4-5),
 * usada tanto por la vista previa del wizard como por el export Word, por la
 * misma razón: una sola fuente de verdad.
 */
import type { BrechaCurso } from "@/data/types-evaluacion";
import type {
  ConectaNivelaCreaAiResult,
  DiagnosticoAcademicoCNC,
  Semana1CNC,
} from "@/data/types-cnc";
import { buscarPorCodigo } from "@/data";

/** Estado dominante del curso para una DCD (por conteo de estudiantes) */
export function nivelDominanteEstado(d: {
  dominado: number;
  enProceso: number;
  requiereRefuerzo: number;
}): "dominado" | "en_proceso" | "requiere_refuerzo" {
  const max = Math.max(d.dominado, d.enProceso, d.requiereRefuerzo);
  if (d.requiereRefuerzo === max) return "requiere_refuerzo";
  if (d.enProceso === max) return "en_proceso";
  return "dominado";
}

/** Traduce el estado dominante al nivel del diagnóstico académico del CNC */
export function nivelCNC(d: {
  dominado: number;
  enProceso: number;
  requiereRefuerzo: number;
}): "logrado" | "en_proceso" | "iniciado" {
  const estado = nivelDominanteEstado(d);
  if (estado === "dominado") return "logrado";
  if (estado === "en_proceso") return "en_proceso";
  return "iniciado";
}

/**
 * Construye el diagnóstico académico de la Semana 1 (CNC) a partir de las
 * brechas por DCD de una evaluación diagnóstica de Lengua o Matemática,
 * incluyendo la observación de procedencia con % de dominio y estudiantes en
 * refuerzo.
 */
export function diagnosticoAcademicoDesdeBrechas(
  brechas: BrechaCurso[],
  area: "LL" | "M"
): DiagnosticoAcademicoCNC[] {
  return brechas.map((b) => ({
    destrezaCodigo: b.dcdCodigo,
    destrezaDescripcion: b.descripcion,
    area,
    observaciones: `Evaluación diagnóstica: ${b.porcentajeDominio}% de dominio · ${b.requiereRefuerzo} estudiante(s) en refuerzo.`,
    nivelDetectado: nivelCNC(b),
  }));
}

/** Una fila de la rúbrica del proyecto interdisciplinar: una DCD reforzada con sus indicadores reales del catálogo */
export interface FilaRubricaProyecto {
  destrezaCodigo: string;
  destrezaDescripcion: string;
  area: string;
  /** Indicadores de evaluación reales del catálogo (data/destrezas-*.ts); vacío si la destreza no tiene ninguno registrado */
  indicadores: string[];
}

/**
 * Deriva las filas de la rúbrica del proyecto interdisciplinar a partir de
 * los códigos de destrezas que el proyecto refuerza (Paso 4 del instructivo
 * oficial: "Incluir en la rúbrica los indicadores de evaluación relacionados
 * con las destrezas... que participaron en el proyecto"). Solo deriva, no
 * inventa contenido: un código que no resuelve en el catálogo simplemente no
 * genera fila, sin sustituir con datos aproximados.
 */
export function rubricaProyectoDesdeDestrezas(codigos: string[]): FilaRubricaProyecto[] {
  const vistos = new Set<string>();
  const filas: FilaRubricaProyecto[] = [];
  for (const codigo of codigos) {
    if (vistos.has(codigo)) continue;
    const d = buscarPorCodigo(codigo);
    if (!d) continue;
    vistos.add(codigo);
    filas.push({
      destrezaCodigo: d.codigo,
      destrezaDescripcion: d.descripcion,
      area: d.area,
      indicadores: d.indicadoresEvaluacion,
    });
  }
  return filas;
}

/**
 * Aplica las sugerencias de IA a la Semana 1 sin pisar nada que el docente ya
 * haya escrito. Vive aquí, y no dentro del wizard, porque es la regla que
 * decide en qué campo del plan aterriza cada sugerencia — y ahí estuvo el
 * error que esta función existe para impedir que vuelva:
 * `tecnicaDiagnosticoSugerida` (la TÉCNICA + INSTRUMENTO con que se recoge la
 * evidencia diagnóstica) se escribía en `tecnicasReflexion` (las preguntas de
 * metacognición del cierre). Eso dejaba el plan sin instrumento declarado,
 * rotulaba el instrumento como "técnica de reflexión" en el Word y el PDF, y
 * descartaba por completo su DUA.
 *
 * Los arrays DUA van indexados en paralelo a su lista, así que solo se adoptan
 * junto con la lista sugerida por la IA: si el docente escribió la suya, los
 * índices ya no corresponderían.
 */
export function semana1ConSugerenciasIA(
  semana1: Semana1CNC,
  ai: ConectaNivelaCreaAiResult
): Semana1CNC {
  const tieneActividadesPropias = semana1.actividadesAdaptacion.filter(Boolean).length > 0;
  const tieneInstrumentosPropios =
    (semana1.instrumentosDiagnostico ?? []).filter(Boolean).length > 0;

  return {
    ...semana1,
    metodologiaDeclarada: semana1.metodologiaDeclarada.trim()
      ? semana1.metodologiaDeclarada
      : (ai.metodologiaDeclaradaSugerida || ""),
    actividadesAdaptacion: tieneActividadesPropias
      ? semana1.actividadesAdaptacion
      : (ai.actividadesAdaptacionSugeridas ?? []),
    duaActividadesAdaptacion: tieneActividadesPropias
      ? semana1.duaActividadesAdaptacion
      : ai.duaActividadesAdaptacionSugeridas,
    instrumentosDiagnostico: tieneInstrumentosPropios
      ? semana1.instrumentosDiagnostico
      : (ai.tecnicaDiagnosticoSugerida ?? []),
    duaInstrumentosDiagnostico: tieneInstrumentosPropios
      ? semana1.duaInstrumentosDiagnostico
      : ai.duaTecnicaDiagnosticoSugerida,
    // Las preguntas de reflexión del cierre son del docente (o del endpoint
    // sugerirReflexionDece): `generate()` nunca las toca.
    tecnicasReflexion: semana1.tecnicasReflexion,
  };
}
