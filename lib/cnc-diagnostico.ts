/**
 * Mapeo compartido entre la Evaluación Diagnóstica y el plan "Conecta, Nivela
 * y Crea" (CNC). Única implementación para importar las brechas por DCD al
 * diagnóstico académico de la Semana 1, usada tanto por el detalle de la
 * evaluación (botón "→ CNC") como por el paso "Diagnóstico" del wizard CNC,
 * para evitar que existan dos comportamientos divergentes.
 */
import type { BrechaCurso } from "@/data/types-evaluacion";
import type { DiagnosticoAcademicoCNC } from "@/data/types-cnc";

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
