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
import type { DiagnosticoAcademicoCNC } from "@/data/types-cnc";
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
