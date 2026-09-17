/**
 * Genera HTML para exportación PDF de un Proyecto Interdisciplinar.
 * El HTML se imprime con window.print() en web (mismo patrón que
 * curriculo-competencias-pdf-generator.ts) — no es un PDF binario directo.
 *
 * Mismas secciones y mismo contenido que
 * `proyecto-interdisciplinar-word-generator.ts` (tasks.md 10.3: el PDF debe
 * ser equivalente en contenido al Word), en HTML en vez de tablas `docx`.
 */
import type { ProyectoInterdisciplinarPlan, BaseCurricular, FaseProyecto } from "../data/types-proyecto-interdisciplinar";
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function generarProyectoInterdisciplinarPdf(plan: ProyectoInterdisciplinarPlan): string {
  const baseLabel =
    plan.baseCurricular === "destrezas"
      ? "Destrezas con criterios de desempeño"
      : "Competencias específicas (Currículo Nacional por Competencias)";

  // ── Áreas y articulación curricular ──
  const areasHtml = plan.areas.length
    ? plan.areas
        .map((area) => {
          const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);
          const filas = elementosDeArea.length
            ? elementosDeArea
                .map(
                  (e) => `
        <tr>
          <td style="width:18%;"><strong>${escapeHtml(e.codigo)}</strong></td>
          <td>${escapeHtml(descripcionDeElemento(plan.baseCurricular, e.codigo))}</td>
        </tr>`
                )
                .join("")
            : `<tr><td>—</td><td>Sin elementos curriculares seleccionados.</td></tr>`;

          return `
    <tr>
      <td colspan="2" style="background:${COLOR_PRIMARY};color:white;font-weight:bold;">
        ${escapeHtml(area.nombreArea)} — ${escapeHtml(area.nivel)}${area.subnivel ? ` (${escapeHtml(area.subnivel)})` : ""} · ${escapeHtml(area.grado)}
      </td>
    </tr>
    ${filas}`;
        })
        .join("<tr><td colspan=\"2\" style=\"border:none;height:6px;\"></td></tr>")
    : `<tr><td colspan="2">Sin áreas registradas.</td></tr>`;

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
      <td class="header-row" colspan="2">${escapeHtml(plan.institucion || "Unidad Educativa")}</td>
      <td class="header-row" style="text-align:right;" colspan="3">Base curricular: ${baseLabel}</td>
    </tr>
    <tr>
      <td colspan="5" style="text-align:center;font-weight:bold;font-size:13px;background:${COLOR_HEADER};">
        Proyecto Interdisciplinar
      </td>
    </tr>

    <!-- Datos informativos -->
    ${sectionHeader("DATOS INFORMATIVOS")}
    <tr>
      <td colspan="3"><strong>Título del proyecto:</strong> ${escapeHtml(plan.titulo || "—")}</td>
      <td colspan="2"><strong>Duración:</strong> ${escapeHtml(plan.duracion || "—")}</td>
    </tr>
    <tr>
      <td colspan="5"><strong>Docentes participantes:</strong> ${escapeHtml(plan.docentesParticipantes?.join(", ") || "—")}</td>
    </tr>

    <!-- Información general -->
    ${sectionHeader("INFORMACIÓN GENERAL")}
    <tr>
      <td colspan="5">
        <strong>Contexto / situación:</strong> ${escapeHtml(plan.contexto || "—")}<br>
        <strong>Pregunta guía:</strong> ${escapeHtml(plan.preguntaGuia || "—")}<br>
        <strong>Objetivo general:</strong> ${escapeHtml(plan.objetivoGeneral || "—")}<br>
        ${plan.objetivosEspecificos?.length ? `<strong>Objetivos específicos:</strong><br>${plan.objetivosEspecificos.map((o) => `• ${escapeHtml(o)}`).join("<br>")}<br>` : ""}
        <strong>Producto final:</strong> ${escapeHtml(plan.productoFinal || "—")}<br>
        <strong>Metodología:</strong> ${escapeHtml(plan.metodologia || "—")}
        ${plan.adaptaciones ? `<br><strong>Adaptaciones / inclusión:</strong> ${escapeHtml(plan.adaptaciones)}` : ""}
        ${plan.observaciones ? `<br><strong>Observaciones:</strong> ${escapeHtml(plan.observaciones)}` : ""}
      </td>
    </tr>

    <!-- Áreas y articulación curricular -->
    ${sectionHeader("ÁREAS PARTICIPANTES Y ARTICULACIÓN CURRICULAR")}
    ${areasHtml}

    <!-- Actividades por fase -->
    ${sectionHeader("ACTIVIDADES POR FASE")}
    ${actividadesHtml || `<tr><td colspan="5">Sin actividades registradas.</td></tr>`}

    <!-- Evaluación general -->
    ${sectionHeader("EVALUACIÓN GENERAL")}
    <tr><td colspan="5">${escapeHtml(plan.evaluacionGeneral || "—")}</td></tr>

    <!-- Firmas -->
    ${sectionHeader("FIRMAS")}
    <tr class="firma-row">
      ${firmasHtml}
    </tr>

    <tr>
      <td colspan="5" class="disclaimer">
        Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad
        del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa
        y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del
        Ministerio de Educación.
      </td>
    </tr>
  </table>
</body>
</html>`;
}
