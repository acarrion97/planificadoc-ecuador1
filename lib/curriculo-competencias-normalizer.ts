/**
 * Capa de Normalización — Currículo por Competencias (Plan Piloto)
 *
 * Transforma datos de entrada (extraídos de fuentes curriculares) en el
 * modelo canónico definido en types-curriculo-competencias.ts.
 *
 * REGLA FUNDAMENTAL:
 * El dominio NUNCA debe depender directamente de la estructura física
 * de un DOCX, PDF, XLSX u otra fuente.
 *
 * Responsabilidades:
 * - Eliminar variaciones puramente documentales
 * - Conservar texto fuente cuando sea necesario
 * - Generar IDs/códigos internos estables
 * - Asignar campos obligatorios
 * - Establecer relaciones (competencia → destreza → indicador)
 * - Agregar metadatos de trazabilidad (SourceTraceability)
 */

import type {
  SourceTraceability,
  DcdSeleccionada,
  IndicadorSeleccionado,
  ActividadDidactica,
  FaseEstrategiaPlan,
  EstructuraDidactica,
  AdaptacionNEE,
  PlanificacionCurriculoCompetencias,
  PlanificacionInicialCurriculo,
  AmbitoDesarrollo,
  ClaseInicialCurriculo,
  ActividadInicial,
} from "../data/types-curriculo-competencias";
import type { CompetenciaTransversalCode } from "../data/competencias-transversales";
import type { Area, Subnivel, DUAActividad } from "../data/types";
import { buscarPorCodigo } from "../data/index";
import {
  buscarCompetenciaPorCodigo,
  codigosCompetenciasActivas,
} from "../data/competencias-transversales";
import { buscarEstrategiaPorId } from "../data/estrategias-metodologicas";

// ============================================================
// TIPOS DE ENTRADA (datos crudos de las fuentes)
// ============================================================

/** DCD cruda extraída de una fuente curricular */
export interface DcdRaw {
  codigo: string;
  descripcion?: string;
  competencias?: string[];
}

/** Indicador crudo extraído de una fuente curricular */
export interface IndicadorRaw {
  codigo: string;
  texto: string;
  competencia?: string;
}

/** Actividad cruda de una estrategia didáctica */
export interface ActividadRaw {
  texto: string;
  competencia?: string;
  dua?: Partial<DUAActividad>;
}

/** Fase cruda de una estrategia metodológica */
export interface FaseRaw {
  titulo: string;
  duracionMinutos?: number;
  actividades: ActividadRaw[];
}

/** Entrada para normalizar una planificación EGB/BGU */
export interface PlanificacionEGBBGURaw {
  fecha?: string;
  institucion?: string;
  docente?: string;
  grado?: string;
  asignatura?: string;
  areaCode?: string;
  periodoPedagogico?: string;
  trimestre?: string;
  nivel?: "EGB" | "BGU";
  paralelo?: string;
  dcd?: DcdRaw;
  indicadorEvaluacion?: string;
  competencias?: string[];
  objetivoAprendizaje?: string;
  estrategiaId?: string;
  fases?: FaseRaw[];
  recursos?: string;
  tecnicaEvaluacion?: string;
  instrumentoEvaluacion?: string;
  actividadesEvaluacion?: string;
  usaInterdisciplina?: boolean;
  proyectoInterdisciplinar?: {
    nombre?: string;
    objetivoAprendizaje?: string;
    dcds?: DcdRaw[];
    indicadores?: IndicadorRaw[];
    fases?: FaseRaw[];
    actividadesEvaluacion?: string;
  };
  adaptacionesNEE?: Array<{
    grado?: number;
    necesidadEducativa?: string;
    adaptacionDCD?: string;
    adaptacionEstrategias?: string;
    adaptacionRecursos?: string;
    adaptacionEvaluacion?: string;
  }>;
  horasAcompaniamiento?: number;
  actividadesAcompaniamiento?: Array<{
    actividad?: string;
    competencia?: string;
  }>;
  sourceDocument?: string;
  sourceSection?: string;
  sourceVersion?: string;
}

/** Entrada para normalizar una planificación Inicial/Preparatoria */
export interface PlanificacionInicialRaw {
  grado?: string;
  institucion?: string;
  docente?: string;
  duracion?: string;
  objetivoGeneral?: string;
  ambitos?: Array<{
    ambito?: string;
    competenciaCodigo?: string;
    competenciaDescripcion?: string;
    competencias?: string[];
    destrezas?: string[];
    clases?: Array<{
      numero?: number;
      tema?: string;
      objetivoEspecifico?: string;
      metodologia?: string;
      inicio?: ActividadRaw[];
      desarrollo?: ActividadRaw[];
      cierre?: ActividadRaw[];
      metodoEvaluacion?: string[];
    }>;
  }>;
  adaptacionesNEE?: Array<{
    grado?: number;
    necesidadEducativa?: string;
    adaptacionDCD?: string;
    adaptacionEstrategias?: string;
    adaptacionRecursos?: string;
    adaptacionEvaluacion?: string;
  }>;
  bibliografia?: string;
  observaciones?: string;
  firmas?: {
    elaborado?: string;
    revisado?: string;
    coordinador?: string;
    aprobado?: string;
  };
  sourceDocument?: string;
  sourceSection?: string;
  sourceVersion?: string;
}

// ============================================================
// UTILIDADES
// ============================================================

function now(): string {
  return new Date().toISOString();
}

function generarId(prefijo: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefijo}-${timestamp}-${random}`;
}

/** Limpia espacios al inicio/final y colapsa espacios múltiples internos */
function limpiarTexto(texto: string | undefined): string {
  if (!texto) return "";
  return texto.trim().replace(/\s+/g, " ");
}

function crearTraceability(
  sourceDocument?: string,
  sourceSection?: string,
  sourceReference?: string,
  sourceVersion?: string
): SourceTraceability | undefined {
  if (!sourceDocument) return undefined;
  return {
    source_document: sourceDocument,
    source_section: sourceSection,
    source_reference: sourceReference,
    source_version: sourceVersion,
    normalized_at: now(),
  };
}

// ============================================================
// NORMALIZACIÓN DE COMPETENCIAS
// ============================================================

function esCompetenciaValida(
  raw: string | undefined
): CompetenciaTransversalCode | undefined {
  if (!raw) return undefined;
  const code = raw.trim().toUpperCase() as CompetenciaTransversalCode;
  const competencia = buscarCompetenciaPorCodigo(code);
  if (competencia && competencia.active) return code;
  return undefined;
}

function normalizarCompetencia(
  raw: string | undefined
): CompetenciaTransversalCode {
  return esCompetenciaValida(raw) ?? "C";
}

function normalizarCompetencias(
  raw: string[] | undefined
): CompetenciaTransversalCode[] {
  if (!raw || raw.length === 0) return codigosCompetenciasActivas();
  return [...new Set(raw.map((r) => normalizarCompetencia(r)))];
}

// ============================================================
// NORMALIZACIÓN DE DCD
// ============================================================

export function normalizarDcd(
  raw: DcdRaw,
  source?: SourceTraceability
): DcdSeleccionada {
  const codigo = raw.codigo.trim().toUpperCase();
  const dcdExistente = buscarPorCodigo(codigo);

  return {
    codigo,
    descripcion:
      limpiarTexto(raw.descripcion) || dcdExistente?.descripcion || "",
    competencias: normalizarCompetenciaMultiple(raw.competencias),
    source,
  };
}

function normalizarCompetenciaMultiple(
  raw: string[] | undefined
): CompetenciaTransversalCode[] {
  if (!raw || raw.length === 0) return [];
  return [...new Set(raw.map((r) => normalizarCompetencia(r)))];
}

// ============================================================
// NORMALIZACIÓN DE INDICADOR
// ============================================================

export function normalizarIndicador(
  raw: IndicadorRaw,
  source?: SourceTraceability
): IndicadorSeleccionado {
  return {
    codigo: raw.codigo.trim(),
    texto: limpiarTexto(raw.texto),
    competencia: normalizarCompetencia(raw.competencia),
    source,
  };
}

// ============================================================
// NORMALIZACIÓN DE ACTIVIDAD DIDÁCTICA
// ============================================================

export function normalizarActividad(
  raw: ActividadRaw,
  competenciaDefault: CompetenciaTransversalCode = "C"
): ActividadDidactica {
  return {
    texto: limpiarTexto(raw.texto),
    competencia: esCompetenciaValida(raw.competencia) ?? competenciaDefault,
    dua: {
      implicacion: raw.dua?.implicacion ?? false,
      representacion: raw.dua?.representacion ?? false,
      accionExpresion: raw.dua?.accionExpresion ?? false,
    },
  };
}

// ============================================================
// NORMALIZACIÓN DE FASE ESTRATÉGICA
// ============================================================

export function normalizarFase(
  raw: FaseRaw,
  competenciaDefault: CompetenciaTransversalCode = "C"
): FaseEstrategiaPlan {
  return {
    titulo: limpiarTexto(raw.titulo),
    duracionMinutos: raw.duracionMinutos ?? 0,
    actividades: raw.actividades.map((a) =>
      normalizarActividad(a, competenciaDefault)
    ),
  };
}

// ============================================================
// NORMALIZACIÓN DE ESTRUCTURA DIDÁCTICA
// ============================================================

export function normalizarEstructuraDidactica(
  estrategiaId: string,
  fasesRaw: FaseRaw[],
  competenciaDefault?: CompetenciaTransversalCode
): EstructuraDidactica {
  const estrategia = buscarEstrategiaPorId(estrategiaId);
  const competencia = competenciaDefault ?? "C";

  return {
    estrategiaId: estrategia?.id || estrategiaId,
    fases: fasesRaw.map((f) => normalizarFase(f, competencia)),
  };
}

// ============================================================
// NORMALIZACIÓN DE ADAPTACIONES NEE
// ============================================================

export function normalizarAdaptacionNEE(
  raw: {
    grado?: number;
    necesidadEducativa?: string;
    adaptacionDCD?: string;
    adaptacionEstrategias?: string;
    adaptacionRecursos?: string;
    adaptacionEvaluacion?: string;
  },
  source?: SourceTraceability
): AdaptacionNEE {
  return {
    grado: raw.grado ?? 1,
    necesidadEducativa: limpiarTexto(raw.necesidadEducativa),
    adaptacionDCD: limpiarTexto(raw.adaptacionDCD),
    adaptacionEstrategias: limpiarTexto(raw.adaptacionEstrategias),
    adaptacionRecursos: limpiarTexto(raw.adaptacionRecursos),
    adaptacionEvaluacion: limpiarTexto(raw.adaptacionEvaluacion),
    source,
  };
}

// ============================================================
// NORMALIZACIÓN DE PLANIFICACIÓN EGB/BGU
// ============================================================

export function normalizarPlanificacionEGBBGU(
  raw: PlanificacionEGBBGURaw,
  id?: string
): PlanificacionCurriculoCompetencias {
  const source = crearTraceability(
    raw.sourceDocument,
    raw.sourceSection,
    undefined,
    raw.sourceVersion
  );

  const competenciasDefault = normalizarCompetencias(raw.competencias);
  const competenciaPrincipal =
    competenciasDefault[0] as CompetenciaTransversalCode | undefined;

  // Resolver DCD
  const dcdRaw = raw.dcd ?? { codigo: "" };
  const dcd = normalizarDcd(dcdRaw, source);

  // Resolver destreza del catálogo existente
  const destreza = buscarPorCodigo(dcd.codigo);

  // Normalizar estructura didáctica
  const estrategiaId = raw.estrategiaId ?? "erca";
  const fasesRaw = raw.fases ?? [];
  const estructuraDidactica = normalizarEstructuraDidactica(
    estrategiaId,
    fasesRaw,
    competenciaPrincipal
  );

  return {
    id: id ?? generarId("plan-cc"),
    sessionId: "",
    fecha: limpiarTexto(raw.fecha),
    institucion: limpiarTexto(raw.institucion),
    docente: limpiarTexto(raw.docente),
    grado: limpiarTexto(raw.grado),
    asignatura: limpiarTexto(raw.asignatura),
    areaCode: raw.areaCode || undefined,
    periodoPedagogico: limpiarTexto(raw.periodoPedagogico),
    trimestre: limpiarTexto(raw.trimestre),
    nivel: raw.nivel ?? "EGB",
    paralelo: limpiarTexto(raw.paralelo),
    destreza: destreza ?? {
      codigo: dcd.codigo,
      area: "M" as Area,
      subnivel: 2 as Subnivel,
      bloque: 1,
      secuencial: 1,
      descripcion: dcd.descripcion,
      objetivos: [],
      criteriosEvaluacion: [],
      indicadoresEvaluacion: [],
    },
    indicadorEvaluacion: limpiarTexto(raw.indicadorEvaluacion),
    competenciasAsociadas: competenciasDefault,
    objetivoAprendizaje: limpiarTexto(raw.objetivoAprendizaje),
    estructuraDidactica,
    recursos: limpiarTexto(raw.recursos),
    tecnicaEvaluacion: limpiarTexto(raw.tecnicaEvaluacion),
    instrumentoEvaluacion: limpiarTexto(raw.instrumentoEvaluacion),
    actividadesEvaluacion: limpiarTexto(raw.actividadesEvaluacion),
    usaInterdisciplina: raw.usaInterdisciplina ?? false,
    proyectoInterdisciplinar: raw.proyectoInterdisciplinar
      ? {
          nombre: limpiarTexto(raw.proyectoInterdisciplinar.nombre),
          objetivoAprendizaje: limpiarTexto(
            raw.proyectoInterdisciplinar.objetivoAprendizaje
          ),
          dcdsIntegradas: (raw.proyectoInterdisciplinar.dcds ?? []).map((d) =>
            normalizarDcd(d, source)
          ),
          indicadores: (raw.proyectoInterdisciplinar.indicadores ?? []).map(
            (i) => normalizarIndicador(i, source)
          ),
          estrategia: normalizarEstructuraDidactica(
            estrategiaId,
            raw.proyectoInterdisciplinar.fases ?? [],
            competenciaPrincipal
          ),
          actividadesEvaluacion: limpiarTexto(
            raw.proyectoInterdisciplinar.actividadesEvaluacion
          ),
          source,
        }
      : undefined,
    adaptacionesNEE: raw.adaptacionesNEE?.map((a) =>
      normalizarAdaptacionNEE(a, source)
    ),
    horasAcompaniamiento: raw.horasAcompaniamiento,
    actividadesAcompaniamiento: raw.actividadesAcompaniamiento?.map((a) => ({
      actividad: limpiarTexto(a.actividad),
      competencia: normalizarCompetencia(a.competencia),
    })),
    source,
    createdAt: now(),
    updatedAt: now(),
    status: "draft",
  };
}

// ============================================================
// NORMALIZACIÓN DE PLANIFICACIÓN INICIAL / PREPARATORIA
// ============================================================

export function normalizarPlanificacionInicial(
  raw: PlanificacionInicialRaw,
  id?: string
): PlanificacionInicialCurriculo {
  const source = crearTraceability(
    raw.sourceDocument,
    raw.sourceSection,
    undefined,
    raw.sourceVersion
  );

  const ambitos: AmbitoDesarrollo[] = (raw.ambitos ?? []).map((a) => {
    const clases: ClaseInicialCurriculo[] = (a.clases ?? []).map((c) => {
      const normalizarActividadesInicial = (
        items: ActividadRaw[] | undefined
      ): ActividadInicial[] =>
        (items ?? []).map((act) => ({
          texto: limpiarTexto(act.texto),
          competencia: normalizarCompetencia(act.competencia),
          dua: {
            implicacion: act.dua?.implicacion ?? false,
            representacion: act.dua?.representacion ?? false,
            accionExpresion: act.dua?.accionExpresion ?? false,
          },
        }));

      return {
        numero: c.numero ?? 1,
        tema: limpiarTexto(c.tema),
        objetivoEspecifico: limpiarTexto(c.objetivoEspecifico),
        metodologia: limpiarTexto(c.metodologia),
        inicio: normalizarActividadesInicial(c.inicio),
        desarrollo: normalizarActividadesInicial(c.desarrollo),
        cierre: normalizarActividadesInicial(c.cierre),
        metodoEvaluacion: (c.metodoEvaluacion ?? []).map((m) => m.trim()),
      };
    });

    return {
      ambito: limpiarTexto(a.ambito),
      competenciaCodigo: limpiarTexto(a.competenciaCodigo),
      competenciaDescripcion: limpiarTexto(a.competenciaDescripcion),
      competenciasTransversales: normalizarCompetencias(a.competencias),
      destrezas: (a.destrezas ?? []).map((d) => d.trim()),
      clases,
      source,
    };
  });

  return {
    id: id ?? generarId("plan-ini"),
    sessionId: "",
    grado: limpiarTexto(raw.grado),
    institucion: limpiarTexto(raw.institucion),
    docente: limpiarTexto(raw.docente),
    duracion: limpiarTexto(raw.duracion),
    objetivoGeneral: limpiarTexto(raw.objetivoGeneral),
    ambitos,
    adaptacionesNEE: raw.adaptacionesNEE?.map((a) =>
      normalizarAdaptacionNEE(a, source)
    ),
    bibliografia: raw.bibliografia?.trim() || undefined,
    observaciones: raw.observaciones?.trim() || undefined,
    firmas: raw.firmas
      ? {
          elaborado: limpiarTexto(raw.firmas.elaborado),
          revisado: limpiarTexto(raw.firmas.revisado),
          coordinador: limpiarTexto(raw.firmas.coordinador),
          aprobado: limpiarTexto(raw.firmas.aprobado),
        }
      : undefined,
    source,
    createdAt: now(),
    updatedAt: now(),
    status: "draft",
  };
}
