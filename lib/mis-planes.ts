/**
 * Modelo puro de "Mis planes" (fase 4, cambio `ux-navigation-and-creation-hub`).
 *
 * Reúne, sin dependencias de React ni de almacenamiento:
 *  - el tipado unificado de los planes de TODOS los tipos (`PlanResumen`);
 *  - los constructores por tipo (tipo, identificación, fecha de actualización,
 *    estado existente y rutas de Continuar/Editar);
 *  - los filtros derivados del estado existente (design D5) y
 *  - la duplicación local (`duplicarRegistro`).
 *
 * La agregación de datos (contextos + tRPC) vive en `hooks/use-mis-planes.ts`;
 * esta módulo es la parte testeable (`__tests__/mis-planes-filtros.test.ts`,
 * tarea 4.10).
 */
import { AREAS_INFO, type Area } from "@/data";
import { obtenerFiguraPorId } from "@/data/bachillerato-tecnico";
import {
  FAMILIA_LABELS,
  type FamiliaExportacionCurriculoCompetencias,
} from "@/lib/curriculo-competencias-familia";
import type { PcaFormData, Planificacion, PlanificacionSemanal } from "@/data/types";
import type { PlanConectaNivelaCrea } from "@/data/types-cnc";
import type { EvaluacionDiagnostica } from "@/data/types-evaluacion";
import type { PlanUnidadTrabajoBT } from "@/data/types-bt";

// ─── Tipos ────────────────────────────────────────────────────────────────

/** Tipos de plan existentes que participan del listado unificado. */
export type TipoPlan =
  | "diario"
  | "semanal"
  | "pca"
  | "pct"
  | "cnc"
  | "bt"
  | "cxc"
  | "proyecto"
  | "evaluacion";

/** Filtros del spec `mis-planes-gestion` (design D5). */
export type FiltroPlanes = "todos" | "recientes" | "progreso" | "completados";

export type CategoriaEstado = "progreso" | "completado";

export interface EstadoPlanes {
  /** Etiqueta mostrada al usuario (Borrador, Generado, Pagada…). */
  label: string;
  categoria: CategoriaEstado;
}

export interface PlanResumen {
  /** Identidad única en la lista: `${tipo}:${id}`. */
  key: string;
  /** Identificador crudo en su almacenamiento (string local, number servidor). */
  id: string | number;
  tipo: TipoPlan;
  /** Chip de tipo mostrado en la tarjeta. */
  tipoLabel: string;
  titulo: string;
  detalle: string;
  /** ISO de la última actualización del plan (o de creación si no expone otra). */
  actualizadoEn: string;
  /** Estado existente; `null` en los tipos sin estado propio (design D5). */
  estado: EstadoPlanes | null;
  /** Ruta de Continuar: detalle o formulario del plan. */
  rutaContinuar: string;
  /** Ruta de reanudación distinta de Continuar; `null` si el flujo no admite editar. */
  rutaEditar: string | null;
  /** Código DCD: habilita los íconos de competencias del plan diario (como en los informes). */
  dcdCodigo?: string | null;
  /** Código de área: muestra el emoji de la materia (el mismo que usa Explorar). */
  areaCodigo?: Area | null;
}

/** Etiquetas cortas de chip por tipo. */
export const TIPO_LABELS: Record<TipoPlan, string> = {
  diario: "Plan diario",
  semanal: "Plan semanal",
  pca: "PCA",
  pct: "PCT",
  cnc: "CNC",
  bt: "BT",
  cxc: "Currículo",
  proyecto: "Proyecto",
  evaluacion: "Evaluación",
};

/** `true` si el tipo posee estado propio y por tanto admite En progreso/Completados. */
export const TIPOS_CON_ESTADO: TipoPlan[] = ["pca", "pct", "cnc", "cxc", "proyecto", "evaluacion"];

// ─── Estado existente → categoría de filtro (design D5) ───────────────────

const EN_PROGRESO = new Set(["draft", "borrador"]);
const COMPLETADO = new Set([
  "generated",
  "generado",
  "paid",
  "publicada",
  "aplicada",
  "analizada",
]);

const LABELS_ESTADO: Record<string, string> = {
  draft: "Borrador",
  borrador: "Borrador",
  generated: "Generado",
  generado: "Generado",
  paid: "Pagada",
  publicada: "Publicada",
  aplicada: "Aplicada",
  analizada: "Analizada",
};

/**
 * Traduce el estado existente de un plan a su categoría de filtro.
 * Un estado fuera de las dos categorías (o ausente) se trata como
 * "sin estado": nunca se inventan estados (non-goal, riesgo R6).
 */
export function estadoDe(estado: string | null | undefined): EstadoPlanes | null {
  if (!estado) return null;
  const label = LABELS_ESTADO[estado] ?? estado;
  if (EN_PROGRESO.has(estado)) return { label, categoria: "progreso" };
  if (COMPLETADO.has(estado)) return { label, categoria: "completado" };
  return null;
}

// ─── Fechas ───────────────────────────────────────────────────────────────

/**
 * Normaliza marcas de tiempo heterogéneas (ISO, `"YYYY-MM-DD HH:mm:ss"` de
 * MySQL, `Date` de drizzle) a ISO con `T`, para que el orden descendente sea
 * correcto entre fuentes distintas.
 */
export function normalizarFecha(valor: string | Date | null | undefined): string {
  if (valor === null || valor === undefined || valor === "") return "";
  const texto = valor instanceof Date ? valor.toISOString() : String(valor).trim();
  if (!texto) return "";
  return texto.includes("T") ? texto : texto.replace(" ", "T");
}

/** Fecha visible `dd/mm/aaaa` (sin locale, determinista para tests). */
export function formatoFecha(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ─── Constructores por tipo ───────────────────────────────────────────────

/** Plan diario — sin estado propio (design D5). */
export function resumenDiario(p: Planificacion): PlanResumen {
  const area = AREAS_INFO[p.destreza?.area]?.name;
  return {
    key: `diario:${p.id}`,
    id: p.id,
    tipo: "diario",
    tipoLabel: TIPO_LABELS.diario,
    titulo: p.asignatura || area || "Planificación diaria",
    detalle: [p.destreza?.codigo, p.grado, p.docente].filter(Boolean).join(" · "),
    actualizadoEn: normalizarFecha(p.updatedAt || p.createdAt || p.fecha),
    estado: null,
    dcdCodigo: p.destreza?.codigo ?? null,
    areaCodigo: p.destreza?.area ?? null,
    rutaContinuar: `/ver-plan/${p.id}`,
    rutaEditar: null, // el formulario se abre desde una destreza, sin reanudación por id
  };
}

/** Planificación semanal — sin estado propio (design D5). */
export function resumenSemanal(s: PlanificacionSemanal): PlanResumen {
  return {
    key: `semanal:${s.id}`,
    id: s.id,
    tipo: "semanal",
    tipoLabel: TIPO_LABELS.semanal,
    titulo: `Semana del ${s.semanaInicio} al ${s.semanaFin}`,
    detalle: [s.grado, s.paralelo, s.docente || "Sin docente"].filter(Boolean).join(" · "),
    actualizadoEn: normalizarFecha(s.updatedAt || s.createdAt),
    estado: null,
    rutaContinuar: `/ver-semana/${s.id}`,
    rutaEditar: null,
  };
}

/** Fila proyectada por `pca.listMisPcas` (anual y trimestral viven juntas). */
export interface DocPcaListado {
  id: number;
  status: string;
  formData: unknown;
  createdAt: string | Date;
}

/**
 * PCA anual o PCT trimestral (`pca_documents`). El listado del servidor solo
 * expone `createdAt`, de modo que la fecha de actualización disponible es la
 * de creación (design D10).
 */
export function resumenPca(doc: DocPcaListado, variante: "anual" | "trimestral"): PlanResumen {
  const fd = (doc.formData ?? {}) as Partial<PcaFormData> & { trimestre?: string };
  const grado = fd.grado || "—";
  const area = fd.area ? AREAS_INFO[fd.area]?.name ?? fd.area : null;
  const esTrimestral = variante === "trimestral";
  const tipo: TipoPlan = esTrimestral ? "pct" : "pca";

  return {
    key: `${tipo}:${doc.id}`,
    id: doc.id,
    tipo,
    tipoLabel: TIPO_LABELS[tipo],
    titulo: esTrimestral ? `Plan Trimestral · ${grado}` : `Plan Anual · ${grado}`,
    detalle: [area, fd.docente, fd.trimestre].filter(Boolean).join(" · "),
    actualizadoEn: normalizarFecha(doc.createdAt),
    estado: estadoDe(doc.status),
    areaCodigo: fd.area ?? null,
    rutaContinuar: esTrimestral
      ? `/pca-trimestral-preview/${doc.id}`
      : `/pca-preview/${doc.id}`,
    rutaEditar: null, // los previews son de solo lectura
  };
}

/** Conecta, Nivela y Crea. */
export function resumenCnc(p: PlanConectaNivelaCrea): PlanResumen {
  return {
    key: `cnc:${p.id}`,
    id: p.id,
    tipo: "cnc",
    tipoLabel: TIPO_LABELS.cnc,
    titulo: [p.grado, p.paralelo].filter(Boolean).join(" · ") || "Plan CNC",
    detalle: [
      p.modalidad === "bt" ? "Bachillerato Técnico" : "General",
      p.anioLectivo,
      p.docente,
    ]
      .filter(Boolean)
      .join(" · "),
    actualizadoEn: normalizarFecha(p.updatedAt || p.createdAt),
    estado: estadoDe(p.status),
    rutaContinuar: `/ver-cnc/${p.id}`,
    rutaEditar: null, // el flujo es de una sola pasada: sin reanudación por id
  };
}

/**
 * Bachillerato Técnico — `PlanUnidadTrabajoBT` no tiene `status`, así que
 * participa solo en Todos/Recientes (design D5/D10).
 *
 * Brecha documentada: BT no tiene pantalla de detalle, por lo que "Continuar"
 * abre el formulario de su figura (`/planificar-bt/[figuraId]`). Un detalle
 * propio queda para el cambio del catálogo BT.
 */
export function resumenBt(p: PlanUnidadTrabajoBT): PlanResumen {
  const figura = obtenerFiguraPorId(p.figuraProfesionalId);
  return {
    key: `bt:${p.id}`,
    id: p.id,
    tipo: "bt",
    tipoLabel: TIPO_LABELS.bt,
    titulo: p.unidadTrabajo?.nombre || "Unidad de Trabajo",
    detalle: [figura?.nombre || p.figuraProfesionalId, p.nombreModuloFormativo]
      .filter(Boolean)
      .join(" · "),
    actualizadoEn: normalizarFecha(p.updatedAt || p.createdAt),
    estado: null,
    rutaContinuar: `/planificar-bt/${p.figuraProfesionalId}`,
    rutaEditar: null,
  };
}

/** Fila proyectada por `curriculoCompetencias.list`. */
export interface FilaCxcListado {
  id: number;
  status: string;
  createdAt: string | Date;
  familia: FamiliaExportacionCurriculoCompetencias;
  grado?: string | null;
  gradosResumen?: string | null;
  docente?: string | null;
  asignaturaNombre?: string | null;
}

/**
 * Ruta de reanudación de CxC: mismo criterio que el botón "Editar" de
 * `app/curriculo-competencias/ver/[id].tsx` (familia → su formulario con `id`).
 */
export function rutaEdicionCxc(
  familia: FamiliaExportacionCurriculoCompetencias,
  id: string | number
): string {
  switch (familia) {
    case "egb_bgu_dcd":
      return `/curriculo-competencias/egb-bgu?id=${id}`;
    case "curriculo_integrado_inicial":
      return `/curriculo-competencias/inicial?id=${id}`;
    case "curriculo_integrado_single":
    case "curriculo_integrado_multigrado":
      return `/curriculo-competencias/egb-bgu-integrado?id=${id}`;
  }
}

/** Currículo por Competencias — el único tipo con ruta de Editar propia. */
export function resumenCxc(fila: FilaCxcListado): PlanResumen {
  return {
    key: `cxc:${fila.id}`,
    id: fila.id,
    tipo: "cxc",
    tipoLabel: TIPO_LABELS.cxc,
    titulo: fila.asignaturaNombre || FAMILIA_LABELS[fila.familia] || "Currículo por Competencias",
    detalle: [fila.gradosResumen || fila.grado, fila.docente].filter(Boolean).join(" · "),
    actualizadoEn: normalizarFecha(fila.createdAt),
    estado: estadoDe(fila.status),
    rutaContinuar: `/curriculo-competencias/ver/${fila.id}`,
    rutaEditar: rutaEdicionCxc(fila.familia, fila.id),
  };
}

/** Fila proyectada por `proyectoInterdisciplinar.list`. */
export interface FilaProyectoListado {
  id: number;
  titulo?: string | null;
  baseCurricular?: string | null;
  nivelPrincipal?: string | null;
  subnivelPrincipal?: string | null;
  estado?: string | null;
  updatedAt: string | Date;
}

/** Proyecto Interdisciplinar: Continuar abre el wizard reanudable, así que
 * no se muestra un Editar duplicado con la misma ruta. */
export function resumenProyecto(f: FilaProyectoListado): PlanResumen {
  return {
    key: `proyecto:${f.id}`,
    id: f.id,
    tipo: "proyecto",
    tipoLabel: TIPO_LABELS.proyecto,
    titulo: f.titulo || "(sin título)",
    detalle: [f.baseCurricular, f.nivelPrincipal || f.subnivelPrincipal]
      .filter(Boolean)
      .join(" · "),
    actualizadoEn: normalizarFecha(f.updatedAt),
    estado: estadoDe(f.estado ?? null),
    rutaContinuar: `/proyecto-interdisciplinar/wizard?id=${f.id}`,
    rutaEditar: null,
  };
}

/** Evaluación diagnóstica. */
export function resumenEvaluacion(e: EvaluacionDiagnostica): PlanResumen {
  return {
    key: `evaluacion:${e.id}`,
    id: e.id,
    tipo: "evaluacion",
    tipoLabel: TIPO_LABELS.evaluacion,
    titulo: e.nombre || "Evaluación sin nombre",
    detalle: [e.grado, e.paralelo, e.anioLectivo].filter(Boolean).join(" · "),
    actualizadoEn: normalizarFecha(e.updatedAt || e.createdAt || e.fecha),
    estado: estadoDe(e.status),
    areaCodigo: e.area,
    rutaContinuar: `/ver-evaluacion/${e.id}`,
    rutaEditar: null,
  };
}

// ─── Orden y filtros ──────────────────────────────────────────────────────

/** Ventana de "Recientes": 30 días hacia atrás (design D10). */
export const VENTANA_RECIENTES_DIAS = 30;

/** Orden por fecha de actualización, del más reciente al más antiguo. */
export function ordenarPlanes<T extends PlanResumen>(planes: T[]): T[] {
  return [...planes].sort((a, b) => {
    if (a.actualizadoEn === b.actualizadoEn) return 0;
    return a.actualizadoEn < b.actualizadoEn ? 1 : -1;
  });
}

/**
 * Filtros del spec `mis-planes-gestion`:
 *  - `todos`: todos los tipos, ordenados por actualización;
 *  - `recientes`: actualizados en los últimos `VENTANA_RECIENTES_DIAS`;
 *  - `progreso`/`completados`: solo tipos con estado propio en esa categoría
 *    (los tipos sin estado nunca aparecen — riesgo R6).
 */
export function filtrarPlanes<T extends PlanResumen>(
  planes: T[],
  filtro: FiltroPlanes,
  ahora: Date = new Date()
): T[] {
  const ordenados = ordenarPlanes(planes);

  switch (filtro) {
    case "todos":
      return ordenados;
    case "recientes": {
      const corte = ahora.getTime() - VENTANA_RECIENTES_DIAS * 24 * 60 * 60 * 1000;
      return ordenados.filter((p) => {
        const t = Date.parse(p.actualizadoEn);
        return !Number.isNaN(t) && t >= corte;
      });
    }
    case "progreso":
      return ordenados.filter((p) => p.estado?.categoria === "progreso");
    case "completados":
      return ordenados.filter((p) => p.estado?.categoria === "completado");
  }
}

// ─── Duplicación local ────────────────────────────────────────────────────

/** id nuevo al estilo de los registros locales (timestamp + aleatorio). */
export function nuevoIdLocal(prefijo = ""): string {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return prefijo ? `${prefijo}-${id}` : id;
}

/**
 * Copia local de un plan: identificador y marcas de tiempo nuevos, contenido
 * idéntico. El objeto original no se toca (spec `mis-planes-gestion`:
 * "la duplicación deja el original intacto").
 *
 * Para los tipos en servidor la copia la hace el backend
 * (`pca.duplicate`, `curriculoCompetencias.duplicate`,
 * `proyectoInterdisciplinar.duplicate`) — design D10.
 */
export function duplicarRegistro<
  T extends { id: string; createdAt: string; updatedAt: string },
>(registro: T, ahora: string = new Date().toISOString()): T {
  return {
    ...registro,
    id: nuevoIdLocal(),
    createdAt: ahora,
    updatedAt: ahora,
  };
}
