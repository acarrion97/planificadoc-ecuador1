/**
 * Destrezas sugeridas por asignatura para el eje transversal de
 * Educación Cívica, Ética e Integridad.
 *
 * Fuente: Ministerio de Educación del Ecuador — Inserción Curricular:
 * Educación Cívica, Ética e Integridad (Primera Edición, 2024),
 * sección 6.3 "Matriz de Destrezas/DCD".
 *
 * Clave: "AREA-SUBNIVEL" → códigos de DCD de esa asignatura que
 * abordan explícitamente las temáticas cívicas, éticas e de integridad.
 */

import type { Area } from "./types";

const CIVICA_ETICA_DESTREZAS: Record<string, string[]> = {

  // ── SUBNIVEL ELEMENTAL (2) ─────────────────────────────────────────
  "CS-2": [
    "CS.2.1.9",  "CS.2.1.10", "CS.2.1.11",
    "CS.2.2.7",  "CS.2.2.14",
    "CS.2.3.3",  "CS.2.3.4",  "CS.2.3.7",  "CS.2.3.12",
  ],
  "EF-2":  ["EF.2.1.5",  "EF.2.3.4",  "EF.2.5.6"],
  "EFL-2": ["EFL.2.1.2", "EFL.2.1.4"],
  "ECA-2": ["ECA.2.2.2", "ECA.2.2.10", "ECA.2.3.9"],
  "LL-2":  ["LL.2.1.3"],

  // ── SUBNIVEL MEDIA (3) ────────────────────────────────────────────
  "CS-3": [
    "CS.3.1.6",  "CS.3.1.51", "CS.3.1.63",
    "CS.3.2.11", "CS.3.2.12", "CS.3.2.15", "CS.3.2.17",
    "CS.3.3.2",  "CS.3.3.11", "CS.3.3.12", "CS.3.3.14",
  ],
  "CN-3":  ["CN.3.5.1", "CN.3.5.2"],
  "ECA-3": ["ECA.3.3.10"],
  "EF-3":  ["EF.3.1.3", "EF.3.3.5"],
  "EFL-3": ["EFL.3.1.1"],
  "LL-3": [
    "LL.3.1.1", "LL.3.1.2", "LL.3.1.3",
    "LL.3.2.1", "LL.3.2.2", "LL.3.2.4", "LL.3.2.5",
    "LL.3.5.5",
  ],

  // ── SUBNIVEL SUPERIOR (4) ─────────────────────────────────────────
  "CS-4": [
    "CS.4.2.26", "CS.4.2.27",
    "CS.4.3.1",  "CS.4.3.2",  "CS.4.3.3",  "CS.4.3.4",  "CS.4.3.5",
    "CS.4.3.9",  "CS.4.3.10", "CS.4.3.12", "CS.4.3.13",
    "CS.4.3.16", "CS.4.3.17", "CS.4.3.18", "CS.4.3.19",
    "CS.4.3.20", "CS.4.3.23",
    "CS.4.4.2",
  ],
  "ECA-4": ["ECA.4.3.5",  "ECA.4.3.14", "ECA.4.3.15"],
  "EF-4":  ["EF.4.1.1",  "EF.4.3.2",  "EF.4.3.4",  "EF.4.4.7",  "EF.4.5.2"],
  "EFL-4": ["EFL.4.1.1", "EFL.4.5.1"],
  "LL-4":  ["LL.4.1.1",  "LL.4.1.2",  "LL.4.2.1",  "LL.4.2.4"],

  // ── BACHILLERATO (5) ──────────────────────────────────────────────
  "CS.EC-5": [
    "CS.EC.5.1.6",  "CS.EC.5.1.9",  "CS.EC.5.1.12",
    "CS.EC.5.2.5",  "CS.EC.5.2.6",
    "CS.EC.5.3.2",  "CS.EC.5.3.7",
  ],
  "CS.H-5": [
    "CS.H.5.1.3",  "CS.H.5.1.6",  "CS.H.5.1.7",
    "CS.H.5.1.14", "CS.H.5.1.15",
  ],
  "CS.F-5": [
    "CS.F.5.1.7",
    "CS.F.5.3.10",
    "CS.F.5.4.2",  "CS.F.5.4.4",  "CS.F.5.4.8",  "CS.F.5.4.11",
  ],
  "CN.B-5": [
    "CN.B.5.1.21", "CN.B.5.1.22",
    "CN.B.5.4.3",  "CN.B.5.4.13",
  ],
  "ECA-5": ["ECA.5.1.1", "ECA.5.3.4"],
  "EF-5":  ["EF.5.3.1",  "EF.5.3.2",  "EF.5.3.3",  "EF.5.4.8",  "EF.5.5.1"],
  "EFL-5": ["EFL.5.1.1", "EFL.5.1.2", "EFL.5.1.3", "EFL.5.1.6"],
  "EG-5":  ["EG.5.4.3"],
  "LL-5": [
    "LL.5.1.1", "LL.5.1.2", "LL.5.1.3", "LL.5.1.4",
    "LL.5.2.1", "LL.5.2.4",
    "LL.5.3.1", "LL.5.3.3",
    "LL.5.4.3",
  ],
};

/**
 * Devuelve los códigos de DCD de una asignatura que se relacionan
 * con el eje de Educación Cívica, Ética e Integridad.
 *
 * @param area   - Código de área del sistema (ej. "LL", "EF", "CS.H")
 * @param subnivel - Subnivel educativo (2=Elemental, 3=Media, 4=Superior, 5=BGU)
 * @returns Lista de códigos DCD; arreglo vacío si no hay mapeo.
 */
export function obtenerDestrezasCivicaEtica(
  area: Area | string,
  subnivel: number
): string[] {
  return CIVICA_ETICA_DESTREZAS[`${area}-${subnivel}`] ?? [];
}
