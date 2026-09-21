/**
 * Genera HTML para exportación PDF de un Proyecto Interdisciplinar.
 * El HTML se imprime con window.print() en web (mismo patrón que
 * curriculo-competencias-pdf-generator.ts) — no es un PDF binario directo.
 *
 * Mismas secciones y mismo contenido que
 * `proyecto-interdisciplinar-word-generator.ts` (tasks.md 10.3: el PDF debe
 * ser equivalente en contenido al Word): formato oficial del instructivo
 * "Proyecto Interdisciplinar para la Evaluación Sumativa" del MinEduc.
 */
import type { AreaProyectoInterdisciplinar, ProyectoInterdisciplinarPlan, BaseCurricular, FaseProyecto } from "../data/types-proyecto-interdisciplinar";
import { buscarPorCodigo } from "../data/index";
import { buscarCompetenciaEspecificaEGBBGU } from "../data/competencias-especificas-egb-bgu";

// ── Colores (mismos que el generador Word del módulo) ──
// A diferencia de `docx` (que espera hex sin "#" en sus campos de color),
// el CSS de este generador SÍ necesita el prefijo — sin él, el navegador
// ignora el valor y el color queda transparente/heredado (texto invisible
// en fondos con color de texto blanco, como se vio al verificar visualmente).
const COLOR_PRIMARY = "#0F766E";
const COLOR_SECTION = "#CCFBF1";
const COLOR_HEADER = "#F0FDFA";

const FASES_LABEL: Record<FaseProyecto, string> = {
  planificacion: "Planificación",
  gestion: "Gestión del proyecto",
  evaluacion: "Evaluación del proyecto",
};

function sectionHeader(label: string): string {
  return `
    <tr>
      <td colspan="10" style="background:${COLOR_SECTION};padding:8px 12px;font-weight:bold;color:${COLOR_PRIMARY};font-size:13px;border:1px solid #ccc;">
        ${label}
      </td>
    </tr>`;
}

/** Resuelve la descripción de un código contra el catálogo VIGENTE (nunca se copia al guardar). */
function descripcionDeElemento(baseCurricular: BaseCurricular, codigo: string): string {
  if (baseCurricular === "destrezas") {
    return buscarPorCodigo(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
  }
  return buscarCompetenciaEspecificaEGBBGU(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
}

interface SaberesDeElemento {
  indicadores: string[];
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

/**
 * Indicadores de evaluación y saberes declarativos/procedimentales/actitudinales
 * de un elemento curricular para el nivel/grado del área. Solo el catálogo de
 * competencias específicas (CNC) trae saberes desagregados por grado; para
 * destrezas solo hay indicadores de evaluación.
 */
function saberesDeElemento(
  baseCurricular: BaseCurricular,
  codigo: string,
  area: AreaProyectoInterdisciplinar
): SaberesDeElemento {
  if (baseCurricular === "destrezas") {
    return {
      indicadores: buscarPorCodigo(codigo)?.indicadoresEvaluacion ?? [],
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    };
  }
  const ce = buscarCompetenciaEspecificaEGBBGU(codigo);
  const porGrado = ce?.porGrado.find((g) => g.nivel === area.nivel && g.grado === area.grado);
  return {
    indicadores: porGrado?.indicadores.map((i) => i.texto) ?? [],
    declarativos: porGrado?.saberes.declarativos ?? [],
    procedimentales: porGrado?.saberes.procedimentales ?? [],
    actitudinales: porGrado?.saberes.actitudinales ?? [],
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function listaHtml(items: string[]): string {
  return items.length ? items.map((i) => escapeHtml(i)).join("<br>") : "—";
}

export function generarProyectoInterdisciplinarPdf(plan: ProyectoInterdisciplinarPlan): string {
  const baseLabel =
    plan.baseCurricular === "destrezas"
      ? "Destrezas con criterios de desempeño"
      : "Competencias específicas (Currículo Nacional por Competencias)";

  const elementoLabel = plan.baseCurricular === "destrezas" ? "Destreza con criterio de desempeño" : "Competencia específica";
  const asignaturas = Array.from(new Set(plan.areas.map((a) => a.nombreArea))).join(", ");
  const primeraArea = plan.areas[0];
  const cursoLabel = primeraArea
    ? `${primeraArea.grado}${primeraArea.subnivel ? ` (${primeraArea.subnivel})` : ` (${primeraArea.nivel})`}`
    : "";

  // ── Planificación del proyecto interdisciplinar ──
  const planificacionHtml = plan.areas.length
    ? plan.areas
        .map((area) => {
          const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);
          if (elementosDeArea.length === 0) {
            return `
        <tr>
          <td><strong>${escapeHtml(area.nombreArea)}</strong></td>
          <td colspan="5">Sin elementos curriculares seleccionados.</td>
        </tr>`;
          }
          return elementosDeArea
            .map((e) => {
              const info = saberesDeElemento(plan.baseCurricular, e.codigo, area);
              return `
        <tr>
          <td><strong>${escapeHtml(area.nombreArea)}</strong></td>
          <td>${escapeHtml(`${e.codigo}. ${descripcionDeElemento(plan.baseCurricular, e.codigo)}`)}</td>
          <td>${listaHtml(info.indicadores)}</td>
          <td>${listaHtml(info.declarativos)}</td>
          <td>${listaHtml(info.procedimentales)}</td>
          <td>${listaHtml(info.actitudinales)}</td>
        </tr>`;
            })
            .join("");
        })
        .join("")
    : `<tr><td colspan="6">Sin áreas registradas.</td></tr>`;

  // ── Actividades por fase ──
  const fases: FaseProyecto[] = ["planificacion", "gestion", "evaluacion"];
  const actividadesHtml = fases
    .map((fase) => {
      const actividadesDeFase = plan.actividades.filter((a) => a.fase === fase);
      if (actividadesDeFase.length === 0) return "";
      const filas = actividadesDeFase
        .map(
          (a) => `
        <tr>
          <td>${escapeHtml(a.actividad || "—")}</td>
          <td>${escapeHtml(a.recursos || "—")}</td>
          <td>${escapeHtml(a.evidencia || "—")}</td>
          <td>${escapeHtml(a.evaluacion || "—")}</td>
          <td>${escapeHtml(a.instrumentoEvaluacion || "—")}</td>
        </tr>`
        )
        .join("");
      return `
    <tr class="header-row">
      <td colspan="5" style="background:${COLOR_PRIMARY};color:white;">${FASES_LABEL[fase]}</td>
    </tr>
    <tr class="header-row">
      <td>Actividad</td><td>Recursos</td><td>Evidencia</td><td>Evaluación</td><td>Instrumento</td>
    </tr>
    ${filas}`;
    })
    .join("");

  // ── Firmas ──
  const docentes = plan.docentesParticipantes?.length ? plan.docentesParticipantes : ["Docente responsable"];
  const firmasHtml = docentes
    .map((d) => `<td><div class="firma-line"></div><br>${escapeHtml(d)}</td>`)
    .join("");

  // ── Recomendaciones para el docente ──
  const recomendacionesHtml = `
    ${plan.adaptaciones ? `<strong>Adaptaciones / inclusión:</strong> ${escapeHtml(plan.adaptaciones)}<br>` : ""}
    ${plan.observaciones ? `<strong>Observaciones:</strong> ${escapeHtml(plan.observaciones)}<br>` : ""}
    <span class="disclaimer">Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad
    del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa
    y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del
    Ministerio de Educación.</span>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Proyecto Interdisciplinar — ${escapeHtml(plan.institucion || plan.titulo || "PlanificaDoc")}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#1A1A1A; padding:8px; }
    table { border-collapse:collapse; width:100%; margin-bottom:8px; }
    td, th { border:1px solid #ccc; padding:5px 8px; vertical-align:top; font-size:10px; }
    .header-row { background:${COLOR_HEADER}; font-weight:bold; }
    .section-label { background:${COLOR_SECTION}; color:${COLOR_PRIMARY}; font-weight:bold; font-size:12px; padding:6px 10px; }
    .firma-row td { text-align:center; padding-top:30px; border:none; }
    .firma-line { border-top:1px solid #333; width:150px; margin:0 auto; }
    .disclaimer { font-size:8px; color:#555; }
  </style>
</head>
<body>
  <table>
    <!-- Encabezado -->
    <tr>
      <td class="header-row" colspan="3">${escapeHtml(plan.institucion || "Unidad Educativa")}</td>
      <td class="header-row" style="text-align:right;" colspan="3">Base curricular: ${baseLabel}</td>
    </tr>
    <tr>
      <td colspan="6" style="text-align:center;font-weight:bold;font-size:13px;background:${COLOR_HEADER};">
        PROYECTO INTERDISCIPLINAR PARA LA EVALUACIÓN SUMATIVA
      </td>
    </tr>

    <!-- Datos informativos -->
    ${sectionHeader("DATOS INFORMATIVOS")}
    <tr>
      <td><strong>Institución educativa:</strong></td><td colspan="2">${escapeHtml(plan.institucion || "—")}</td>
      <td><strong>Docentes:</strong></td><td colspan="2">${escapeHtml(plan.docentesParticipantes?.join(", ") || "—")}</td>
    </tr>
    <tr>
      <td><strong>Curso:</strong></td><td colspan="2">${escapeHtml(cursoLabel || "—")}</td>
      <td><strong>Duración:</strong></td><td colspan="2">${escapeHtml(plan.duracion || "—")}</td>
    </tr>
    <tr>
      <td><strong>Asignaturas:</strong></td><td colspan="5">${escapeHtml(asignaturas || "—")}</td>
    </tr>

    <!-- Proyecto interdisciplinar -->
    <tr>
      <td colspan="6" style="background:${COLOR_HEADER};font-weight:bold;">
        Proyecto interdisciplinar: ${escapeHtml(plan.titulo || "—")}
      </td>
    </tr>

    <!-- Objetivo del proyecto -->
    ${sectionHeader("OBJETIVO DEL PROYECTO")}
    <tr><td colspan="6">${escapeHtml(plan.objetivoGeneral || "—")}</td></tr>

    <!-- Descripción del proyecto -->
    ${sectionHeader("DESCRIPCIÓN DEL PROYECTO")}
    <tr>
      <td colspan="6">
        ${escapeHtml(plan.contexto || "—")}<br>
        <strong>Desafío:</strong> ${escapeHtml(plan.preguntaGuia || "—")}<br>
        <strong>Producto:</strong> ${escapeHtml(plan.productoFinal || "—")}<br>
        ${plan.objetivosEspecificos?.length ? `<strong>Objetivos específicos:</strong><br>${plan.objetivosEspecificos.map((o) => `• ${escapeHtml(o)}`).join("<br>")}<br>` : ""}
        ${plan.metodologia ? `<strong>Metodología:</strong> ${escapeHtml(plan.metodologia)}` : ""}
      </td>
    </tr>

    <!-- Planificación del proyecto interdisciplinar -->
    ${sectionHeader("PLANIFICACIÓN DEL PROYECTO INTERDISCIPLINAR")}
    <tr class="header-row">
      <td>Asignatura</td><td>${elementoLabel}</td><td>Indicadores de evaluación</td>
      <td>Saberes declarativos</td><td>Saberes procedimentales</td><td>Saberes actitudinales</td>
    </tr>
    ${planificacionHtml}

    <!-- Actividades sugeridas y evidencias de evaluación -->
    ${sectionHeader("ACTIVIDADES SUGERIDAS Y EVIDENCIAS DE EVALUACIÓN")}
    ${actividadesHtml || `<tr><td colspan="5">Sin actividades registradas.</td></tr>`}

    <!-- Evaluación general -->
    ${sectionHeader("EVALUACIÓN GENERAL")}
    <tr><td colspan="5">${escapeHtml(plan.evaluacionGeneral || "—")}</td></tr>

    <!-- Recomendaciones para el docente -->
    ${sectionHeader("RECOMENDACIONES PARA EL DOCENTE")}
    <tr><td colspan="6">${recomendacionesHtml}</td></tr>

    <!-- Firmas -->
    ${sectionHeader("FIRMAS")}
    <tr class="firma-row">
      ${firmasHtml}
    </tr>
  </table>
</body>
</html>`;
}
