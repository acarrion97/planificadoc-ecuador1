/**
 * Capa de Normalización — Proyecto Interdisciplinar
 *
 * Transforma el payload del wizard en el modelo canónico definido en
 * `data/types-proyecto-interdisciplinar.ts`.
 *
 * REGLA FUNDAMENTAL (design.md, Decisión 2): los elementos curriculares se
 * guardan SIEMPRE por referencia (código + trazabilidad), nunca copiando
 * descripción/criterios/indicadores — se resuelven en lectura contra el
 * catálogo estático (`buscarPorCodigo` para destrezas,
 * `buscarCompetenciaEspecificaEGBBGU` para competencias).
 *
 * REGLA DE CONSISTENCIA (design.md, Decisión 4): un proyecto tiene una única
 * `baseCurricular`; todo código que no resuelva en el catálogo correspondiente
 * a esa base se rechaza aquí (defensa en profundidad — el wizard ya debería
 * impedirlo en el cliente).
 */

import type {
  BaseCurricular,
  CurriculumVersion,
  AreaProyectoInterdisciplinar,
  ElementoCurricularReferenciado,
  FaseProyecto,
  ActividadProyectoInterdisciplinar,
  ProyectoInterdisciplinarPlan,
} from "../data/types-proyecto-interdisciplinar";
import { buscarPorCodigo } from "../data/index";
import { buscarCompetenciaEspecificaEGBBGU } from "../data/competencias-especificas-egb-bgu";

// ============================================================
// TIPOS DE ENTRADA (payload crudo del wizard)
// ============================================================

export interface AreaProyectoRaw {
  id?: string;
  areaId: string;
  nombreArea?: string;
  nivel: string;
  subnivel?: string;
  grado: string;
}

export interface ElementoCurricularRaw {
  areaProyectoId: string;
  codigo: string;
}

export interface ActividadProyectoRaw {
  id?: string;
  fase: FaseProyecto;
  actividad: string;
  recursos?: string;
  evidencia?: string;
  evaluacion?: string;
  instrumentoEvaluacion?: string;
  criteriosVinculados?: string[];
}

export interface ProyectoInterdisciplinarRaw {
  sessionId: string;
  baseCurricular: BaseCurricular;
  // Un borrador puede guardarse sin estos campos aún completos — la
  // completitud se exige solo en validarProyectoParaGenerar.
  titulo?: string;
  contexto?: string;
  preguntaGuia?: string;
  objetivoGeneral?: string;
  objetivosEspecificos?: string[];
  productoFinal?: string;
  duracion?: string;
  metodologia?: string;
  areas: AreaProyectoRaw[];
  elementosCurriculares: ElementoCurricularRaw[];
  actividades: ActividadProyectoRaw[];
  evaluacionGeneral?: string;
  institucion?: string;
  docentesParticipantes?: string[];
  adaptaciones?: string;
  observaciones?: string;
  estado?: "borrador" | "generado";
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

function curriculumVersionDe(baseCurricular: BaseCurricular): CurriculumVersion {
  return baseCurricular === "destrezas" ? "destrezas-2016" : "cnc-2024";
}

// ============================================================
// NORMALIZACIÓN DE ÁREAS
// ============================================================

/**
 * No exige mínimos de completitud (título, áreas, actividades, etc.): un
 * borrador puede guardarse a medio llenar mientras el docente avanza por el
 * wizard. Esa validación de completitud vive solo en `validarProyectoParaGenerar`,
 * exigida al pasar a "generado" o al exportar — no al guardar un borrador.
 */
function normalizarAreas(raw: AreaProyectoRaw[]): AreaProyectoInterdisciplinar[] {
  return raw.map((a, index) => ({
    id: a.id ?? generarId(`area-${index + 1}`),
    areaId: a.areaId.trim(),
    nombreArea: limpiarTexto(a.nombreArea) || a.areaId.trim(),
    nivel: limpiarTexto(a.nivel),
    subnivel: a.subnivel ? limpiarTexto(a.subnivel) : undefined,
    grado: limpiarTexto(a.grado),
  }));
}

// ============================================================
// NORMALIZACIÓN DE ARTICULACIÓN CURRICULAR
// ============================================================

/**
 * Resuelve un código contra el catálogo correspondiente a `baseCurricular`.
 * Lanza si el código no existe en ese catálogo — es la validación que impide
 * mezclar destrezas y competencias específicas dentro de un mismo proyecto
 * (Requirement: Bloquear mezcla de bases curriculares).
 */
function resolverElementoCurricular(
  raw: ElementoCurricularRaw,
  baseCurricular: BaseCurricular,
  area: AreaProyectoInterdisciplinar
): ElementoCurricularReferenciado {
  const codigo = raw.codigo.trim().toUpperCase();

  if (baseCurricular === "destrezas") {
    if (!buscarPorCodigo(codigo)) {
      throw new Error(
        `El código "${codigo}" no corresponde a ninguna destreza del catálogo (currículo de destrezas). Este proyecto usa base curricular "destrezas".`
      );
    }
  } else {
    if (!buscarCompetenciaEspecificaEGBBGU(codigo)) {
      throw new Error(
        `El código "${codigo}" no corresponde a ninguna competencia específica del catálogo (Currículo Nacional por Competencias). Este proyecto usa base curricular "competencias".`
      );
    }
  }

  return {
    areaProyectoId: area.id,
    codigo,
    curriculumVersion: curriculumVersionDe(baseCurricular),
    area: area.areaId,
    nivel: area.nivel,
    subnivel: area.subnivel,
    grado: area.grado,
  };
}

function normalizarElementosCurriculares(
  raw: ElementoCurricularRaw[],
  baseCurricular: BaseCurricular,
  areas: AreaProyectoInterdisciplinar[]
): ElementoCurricularReferenciado[] {
  const areaPorId = new Map(areas.map((a) => [a.id, a]));

  // La referencia a un área inexistente y el código que no resuelve en el
  // catálogo de la base curricular elegida SIEMPRE se rechazan (payload
  // corrupto/manipulado, no una completitud pendiente de wizard). El mínimo
  // "al menos un elemento por área" es completitud y se valida solo en
  // `validarProyectoParaGenerar`.
  return raw.map((e) => {
    const area = areaPorId.get(e.areaProyectoId);
    if (!area) {
      throw new Error(
        `El elemento curricular "${e.codigo}" referencia un área ("${e.areaProyectoId}") que no existe en este proyecto.`
      );
    }
    return resolverElementoCurricular(e, baseCurricular, area);
  });
}

// ============================================================
// NORMALIZACIÓN DE ACTIVIDADES
// ============================================================

function normalizarActividades(
  raw: ActividadProyectoRaw[],
  codigosValidos: Set<string>
): ActividadProyectoInterdisciplinar[] {
  return raw.map((act, index) => ({
    id: act.id ?? generarId("actividad-pi"),
    fase: act.fase,
    actividad: limpiarTexto(act.actividad),
    recursos: limpiarTexto(act.recursos),
    evidencia: limpiarTexto(act.evidencia),
    evaluacion: limpiarTexto(act.evaluacion),
    instrumentoEvaluacion: act.instrumentoEvaluacion
      ? limpiarTexto(act.instrumentoEvaluacion)
      : undefined,
    // Solo se conservan vínculos a códigos realmente presentes en la
    // articulación curricular del proyecto (nunca códigos sueltos/inventados).
    criteriosVinculados: (act.criteriosVinculados ?? []).filter((c) =>
      codigosValidos.has(c)
    ),
    orderIndex: index,
  }));
}

// ============================================================
// NORMALIZACIÓN DEL PLAN COMPLETO
// ============================================================

export function normalizarProyectoInterdisciplinar(
  raw: ProyectoInterdisciplinarRaw,
  id?: string
): ProyectoInterdisciplinarPlan {
  const areas = normalizarAreas(raw.areas);
  const elementosCurriculares = normalizarElementosCurriculares(
    raw.elementosCurriculares,
    raw.baseCurricular,
    areas
  );
  const codigosValidos = new Set(elementosCurriculares.map((e) => e.codigo));
  const actividades = normalizarActividades(raw.actividades, codigosValidos);

  const timestamp = now();

  return {
    id: id ?? generarId("proyecto-interdisciplinar"),
    sessionId: raw.sessionId,
    baseCurricular: raw.baseCurricular,

    titulo: limpiarTexto(raw.titulo),
    contexto: raw.contexto ? limpiarTexto(raw.contexto) : undefined,
    preguntaGuia: raw.preguntaGuia ? limpiarTexto(raw.preguntaGuia) : undefined,
    objetivoGeneral: limpiarTexto(raw.objetivoGeneral),
    objetivosEspecificos: raw.objetivosEspecificos
      ?.map((o) => limpiarTexto(o))
      .filter(Boolean),
    productoFinal: limpiarTexto(raw.productoFinal),
    duracion: limpiarTexto(raw.duracion),
    metodologia: raw.metodologia ? limpiarTexto(raw.metodologia) : undefined,

    areas,
    elementosCurriculares,
    actividades,

    evaluacionGeneral: raw.evaluacionGeneral
      ? limpiarTexto(raw.evaluacionGeneral)
      : undefined,

    institucion: raw.institucion ? limpiarTexto(raw.institucion) : undefined,
    docentesParticipantes: raw.docentesParticipantes
      ?.map((d) => limpiarTexto(d))
      .filter(Boolean),

    adaptaciones: raw.adaptaciones ? limpiarTexto(raw.adaptaciones) : undefined,
    observaciones: raw.observaciones ? limpiarTexto(raw.observaciones) : undefined,

    estado: raw.estado ?? "borrador",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Validación mínima antes de marcar un proyecto como "generado" o exportarlo
 * (spec: Validación mínima antes de guardar como generado). Se aplica sobre
 * el plan ya normalizado, no sobre el payload crudo.
 */
export function validarProyectoParaGenerar(plan: ProyectoInterdisciplinarPlan): void {
  const faltantes: string[] = [];

  if (!plan.titulo) faltantes.push("título");
  if (plan.areas.length === 0) faltantes.push("al menos un área participante");
  for (const area of plan.areas) {
    const tieneElemento = plan.elementosCurriculares.some(
      (e) => e.areaProyectoId === area.id
    );
    if (!tieneElemento) {
      faltantes.push(`al menos un elemento curricular en "${area.nombreArea}"`);
    }
  }
  if (!plan.duracion) faltantes.push("duración");
  if (!plan.productoFinal) faltantes.push("producto final");
  if (plan.actividades.length === 0) faltantes.push("al menos una actividad");
  if (!plan.institucion) faltantes.push("información institucional");

  if (faltantes.length > 0) {
    throw new Error(
      `No se puede generar el proyecto: falta ${faltantes.join(", ")}.`
    );
  }
}
