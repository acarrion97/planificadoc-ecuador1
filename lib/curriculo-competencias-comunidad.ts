/**
 * Biblioteca comunitaria y enlace NEE de Currículo por Competencias.
 *
 * Módulo puro (sin dependencias de servidor ni de React Native) para poder
 * usarse en el router, en las pantallas y en los tests:
 *  - anonimización de una planificación compartida (sin docente, institución,
 *    paralelo, firmantes ni datos de estudiantes);
 *  - resumen de tarjeta para el listado "Comunidad";
 *  - ruta del formulario de edición según la familia del plan;
 *  - contexto que se precarga en Adaptación curricular (origen
 *    "curriculo-competencias").
 */

import {
  determinarFamiliaExportacion,
  type FamiliaExportacionCurriculoCompetencias,
} from "./curriculo-competencias-familia";
import { obtenerMateria } from "../data/competencias-especificas-egb-bgu";

/** Texto de ayuda que acompaña al switch "¿Compartir con la comunidad?". */
export const AYUDA_COMPARTIR_COMUNIDAD =
  "Otros docentes podrán ver y duplicar esta planificación sin tus datos personales ni los de tu institución.";

/**
 * Claves que identifican a una persona o institución. Se vacían en cualquier
 * nivel del JSON (no solo en la raíz): los firmantes de Inicial viven en
 * `firmas.*`, y versiones futuras del formData podrían anidar más datos.
 */
const CLAVES_IDENTIFICADORAS = new Set([
  "docente",
  "institucion",
  "paralelo",
  "sessionId",
  "userId",
  "email",
  "correo",
  // Firmantes (Inicial/Preparatoria)
  "elaborado",
  "revisado",
  "coordinador",
  "aprobado",
  // Autoridades y personas
  "rector",
  "vicerrector",
  "director",
  "nombreDocente",
  "nombreEstudiante",
  "estudiante",
  "codigoEstudiante",
]);

/**
 * Claves que se eliminan por completo: describen a estudiantes concretos o
 * notas libres del docente (que suelen incluir nombres).
 */
const CLAVES_ELIMINADAS = new Set([
  "adaptacionesNEE",
  "estudiantes",
  "observaciones",
  "numeroNinos",
  "hayNEE",
  "compartida",
]);

function limpiar(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(limpiar);
  if (!valor || typeof valor !== "object") return valor;
  const out: Record<string, unknown> = {};
  for (const [clave, v] of Object.entries(valor as Record<string, unknown>)) {
    if (CLAVES_ELIMINADAS.has(clave)) continue;
    if (CLAVES_IDENTIFICADORAS.has(clave)) {
      // Se conserva la clave (los generadores esperan el campo) pero vacía.
      out[clave] = typeof v === "string" || v == null ? "" : limpiar(v);
      continue;
    }
    out[clave] = limpiar(v);
  }
  return out;
}

/**
 * Devuelve una copia del formData sin datos personales ni institucionales.
 * No muta el objeto original.
 */
export function anonimizarFormData<T = any>(formData: T): T {
  if (!formData || typeof formData !== "object") return formData;
  const limpio = limpiar(formData) as any;
  // `firmas` puede traer strings sueltos con nombres: se vacía completo.
  if (limpio.firmas && typeof limpio.firmas === "object") {
    limpio.firmas = { elaborado: "", revisado: "", coordinador: "", aprobado: "" };
  }
  return limpio as T;
}

/** Tarjeta de una planificación compartida (sin datos del autor). */
export interface ResumenPlanComunidad {
  id: number;
  familia: FamiliaExportacionCurriculoCompetencias;
  /** Grado o lista de grados (multigrado) */
  grado: string;
  asignaturaNombre: string | null;
  /** Códigos de competencias específicas / DCD */
  competencias: string[];
  /** Título de la situación de aprendizaje (o descripción de la destreza) */
  titulo: string;
  createdAt: Date | string | null;
}

/** Códigos de competencia de un plan, según su familia. */
export function competenciasDelPlan(formData: any): string[] {
  if (!formData || typeof formData !== "object") return [];
  if (Array.isArray(formData.competenciasEspecifica)) {
    return formData.competenciasEspecifica.map((c: any) => c?.codigo).filter(Boolean);
  }
  if (Array.isArray(formData.ambitos)) {
    return formData.ambitos.map((a: any) => a?.competenciaCodigo).filter(Boolean);
  }
  if (formData.destreza?.codigo) return [formData.destreza.codigo];
  return [];
}

/** Grado (o grados, en multigrado) legible de un plan. */
export function gradoDelPlan(formData: any): string {
  if (!formData || typeof formData !== "object") return "";
  if (Array.isArray(formData.grados)) {
    return formData.grados.map((g: any) => g?.grado).filter(Boolean).join(", ");
  }
  return typeof formData.grado === "string" ? formData.grado : "";
}

/** Construye la tarjeta del listado "Comunidad" a partir de una fila guardada. */
export function resumenPlanComunidad(row: {
  id: number;
  tipo: string;
  asignatura?: string | null;
  createdAt?: Date | string | null;
  formData: any;
}): ResumenPlanComunidad {
  const fd = row.formData ?? {};
  const familia = determinarFamiliaExportacion({ tipo: row.tipo, formData: fd });
  const asignaturaId: string | undefined = row.asignatura || fd.asignatura || undefined;
  const asignaturaNombre = asignaturaId
    ? obtenerMateria(asignaturaId)?.nombre ?? asignaturaId
    : null;
  const titulo: string =
    fd.situacionAprendizaje?.titulo ||
    fd.destreza?.descripcion ||
    fd.objetivoAprendizaje ||
    "";
  return {
    id: row.id,
    familia,
    grado: gradoDelPlan(fd),
    asignaturaNombre,
    competencias: competenciasDelPlan(fd),
    titulo,
    createdAt: row.createdAt ?? null,
  };
}

/**
 * Ruta del formulario de edición de un plan. Misma lógica que "Editar" en
 * ver/[id].tsx: `tipo` egb_bgu ⇒ egb-bgu; multigrado o códigos no CE.CI.* ⇒
 * egb-bgu-integrado; el resto ⇒ inicial.
 */
export function rutaEdicionCurriculoCompetencias(tipo: string, formData: any, id: number): string {
  if (tipo === "egb_bgu") return `/curriculo-competencias/egb-bgu?id=${id}`;
  const familia = determinarFamiliaExportacion({ tipo, formData });
  if (familia === "curriculo_integrado_inicial") return `/curriculo-competencias/inicial?id=${id}`;
  return `/curriculo-competencias/egb-bgu-integrado?id=${id}`;
}

/** Campos de Adaptación curricular que se precargan desde un plan de Currículo por competencias. */
export interface ContextoAdaptacionCurriculo {
  institucion: string;
  docente: string;
  grado: string;
  paralelo: string;
  trimestre: string;
  periodoPedagogico: string;
  codigoDestreza: string;
  descripcionDestreza: string;
}

/**
 * Traduce un plan de Currículo por competencias al contexto de Adaptación
 * curricular. La "destreza a adaptar" es la primera competencia específica
 * (o la DCD en EGB/BGU); en multigrado el grado queda como la lista de
 * grados para que el docente elija el del estudiante.
 */
export function contextoAdaptacionDesdeCurriculo(formData: any): ContextoAdaptacionCurriculo {
  const fd = formData && typeof formData === "object" ? formData : {};
  let codigo = "";
  let descripcion = "";
  if (fd.destreza?.codigo) {
    codigo = fd.destreza.codigo;
    descripcion = fd.destreza.descripcion || "";
  } else if (Array.isArray(fd.competenciasEspecifica) && fd.competenciasEspecifica.length > 0) {
    codigo = fd.competenciasEspecifica[0]?.codigo || "";
    descripcion = fd.competenciasEspecifica[0]?.descripcion || "";
  } else if (Array.isArray(fd.ambitos) && fd.ambitos.length > 0) {
    codigo = fd.ambitos[0]?.competenciaCodigo || "";
    descripcion = fd.ambitos[0]?.competenciaDescripcion || "";
  }
  return {
    institucion: fd.institucion || "",
    docente: fd.docente || "",
    grado: gradoDelPlan(fd),
    paralelo: fd.paralelo || "",
    trimestre: fd.trimestre || "",
    periodoPedagogico: fd.periodoPedagogico || "",
    codigoDestreza: codigo,
    descripcionDestreza: descripcion,
  };
}
