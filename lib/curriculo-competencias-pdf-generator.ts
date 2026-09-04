/**
 * Genera HTML para exportación PDF de Currículo por Competencias
 * Soporta ambas familias: EGB/BGU e Inicial/Preparatoria
 *
 * El HTML se imprime con window.print() en web o expo-print en móvil.
 */
import type {
  PlanificacionCurriculoCompetencias,
  PlanificacionInicialCurriculo,
} from "../data/types-curriculo-competencias";

// ── Colores ──
const COLOR_PRIMARY = "155E75";
const COLOR_SECTION = "DCEFF2";
const COLOR_HEADER = "EAF6F7";

const COMP_COLORS: Record<string, string> = {
  C: "#3498DB",
  M: "#E74C3C",
  CD: "#9B59B6",
  CS: "#27AE60",
};

const ERCA_COLORS: Record<string, string> = {
  INICIO: "#2980B9",
  DESARROLLO: "#27AE60",
  CIERRE: "#E67E22",
  Experiencia: "#2980B9",
  Reflexión: "#8E44AD",
  Conceptualización: "#27AE60",
  Aplicación: "#E67E22",
};

// ── Helpers HTML ──
function badgeCompetencia(code: string): string {
  const color = COMP_COLORS[code] || "#888888";
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;color:white;font-weight:bold;font-size:11px;background:${color};margin:1px 2px;">${code}</span>`;
}

function sectionHeader(label: string): string {
  return `
    <tr>
      <td colspan="10" style="background:${COLOR_SECTION};padding:8px 12px;font-weight:bold;color:${COLOR_PRIMARY};font-size:13px;border:1px solid #ccc;">
        ${label}
      </td>
    </tr>`;
}

// ── Generador EGB/BGU ──
export function generarCurriculoCompetenciasPdfEGBBGU(
  plan: PlanificacionCurriculoCompetencias
): string {
  const fases = plan.estructuraDidactica?.fases || [];
  const badges = plan.competenciasAsociadas.map(badgeCompetencia).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Planificación Currículo por Competencias — ${plan.institucion}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#1A1A1A; padding:8px; }
    table { border-collapse:collapse; width:100%; margin-bottom:8px; }
    td, th { border:1px solid #ccc; padding:5px 8px; vertical-align:top; font-size:10px; }
    .header-row { background:${COLOR_HEADER}; font-weight:bold; }
    .section-label { background:${COLOR_SECTION}; color:${COLOR_PRIMARY}; font-weight:bold; font-size:12px; padding:6px 10px; }
    .phase-box { color:white; text-align:center; padding:6px; font-weight:bold; border-radius:4px; }
    .activity-item { margin:2px 0; font-size:9px; }
    .firma-row td { text-align:center; padding-top:30px; border:none; }
    .firma-line { border-top:1px solid #333; width:150px; margin:0 auto; }
  </style>
</head>
<body>
  <table>
    <!-- Encabezado -->
    <tr>
      <td class="header-row" colspan="2">${plan.institucion || "INSTITUCIÓN"}</td>
      <td class="header-row" style="text-align:right;" colspan="2">Año Lectivo: ${plan.periodoPedagogico || "—"}</td>
    </tr>

    <!-- Datos informativos -->
    ${sectionHeader("DATOS INFORMATIVOS")}
    <tr>
      <td><strong>Docente:</strong> ${plan.docente || "—"}</td>
      <td><strong>Asignatura:</strong> ${plan.asignatura || "—"}</td>
      <td><strong>Grado:</strong> ${plan.grado || "—"}</td>
      <td><strong>Paralelo:</strong> ${plan.paralelo || "—"}</td>
      <td><strong>Nivel:</strong> ${plan.nivel || "—"}</td>
    </tr>
    <tr>
      <td><strong>Trimestre:</strong> ${plan.trimestre || "—"}</td>
      <td><strong>Fecha:</strong> ${plan.fecha || "—"}</td>
      <td colspan="3"><strong>Período:</strong> ${plan.periodoPedagogico || "—"}</td>
    </tr>

    <!-- DCD y Competencias -->
    ${sectionHeader("APRENDIZAJE DISCIPLINAR — DCD Y COMPETENCIAS")}
    <tr>
      <td colspan="2"><strong>DCD:</strong> ${plan.destreza?.codigo || plan.indicadorEvaluacion || "—"}</td>
      <td colspan="2"><strong>Competencias:</strong> ${badges}</td>
      <td colspan="2"><strong>Descripción:</strong> ${plan.destreza?.descripcion || "—"}</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Indicador:</strong> ${plan.indicadorEvaluacion || "—"}</td>
      <td colspan="3"><strong>Objetivo:</strong> ${plan.objetivoAprendizaje || "—"}</td>
    </tr>

    <!-- Estrategia didáctica -->
    ${sectionHeader("ESTRATEGIA DIDÁCTICA")}
    <tr>
      ${fases.map((fase) => {
        const bgColor = ERCA_COLORS[fase.titulo] || COLOR_PRIMARY;
        return `
        <td class="phase-box" style="background:${bgColor};">
          ${fase.titulo}<br><small>${fase.duracionMinutos} min</small>
        </td>`;
      }).join("")}
    </tr>
    <tr>
      ${fases.map((fase) => `
        <td>
          ${fase.actividades.map((act) => `
            <div class="activity-item">• ${act.texto} ${badgeCompetencia(act.competencia)}</div>
          `).join("")}
        </td>
      `).join("")}
    </tr>

    <!-- Evaluación -->
    ${sectionHeader("EVALUACIÓN")}
    <tr>
      <td><strong>Técnica:</strong> ${plan.tecnicaEvaluacion || "—"}</td>
      <td><strong>Instrumento:</strong> ${plan.instrumentoEvaluacion || "—"}</td>
      <td colspan="2"><strong>Actividades:</strong> ${plan.actividadesEvaluacion || "—"}</td>
    </tr>

    ${plan.recursos ? `
    <!-- Recursos -->
    ${sectionHeader("RECURSOS")}
    <tr><td colspan="6">${plan.recursos}</td></tr>
    ` : ""}

    <!-- Firmas -->
    <tr class="firma-row">
      <td><div class="firma-line"></div><br>Docente</td>
      <td><div class="firma-line"></div><br>Coordinador</td>
      <td><div class="firma-line"></div><br>Director</td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Generador Inicial/Preparatoria ──
export function generarCurriculoCompetenciasPdfInicial(
  plan: PlanificacionInicialCurriculo
): string {
  let ambitosHtml = "";

  for (const ambito of plan.ambitos) {
    const badges = ambito.competenciasTransversales.map(badgeCompetencia).join("");
    let clasesHtml = "";

    for (const clase of ambito.clases) {
      clasesHtml += `
      <tr>
        <td colspan="4" style="background:#f0f0f0;font-weight:bold;">
          Clase ${clase.numero}: ${clase.tema}
        </td>
      </tr>
      <tr>
        <td style="background:#2980B9;color:white;font-weight:bold;text-align:center;">INICIO</td>
        <td style="background:#27AE60;color:white;font-weight:bold;text-align:center;">DESARROLLO</td>
        <td style="background:#E67E22;color:white;font-weight:bold;text-align:center;">CIERRE</td>
        <td><strong>Evaluación:</strong> ${clase.metodoEvaluacion.join(" · ")}</td>
      </tr>
      <tr>
        <td>
          ${clase.inicio.map((a) => `<div class="activity-item">• ${a.texto} ${badgeCompetencia(a.competencia)}</div>`).join("")}
        </td>
        <td>
          ${clase.desarrollo.map((a) => `<div class="activity-item">• ${a.texto} ${badgeCompetencia(a.competencia)}</div>`).join("")}
        </td>
        <td>
          ${clase.cierre.map((a) => `<div class="activity-item">• ${a.texto} ${badgeCompetencia(a.competencia)}</div>`).join("")}
        </td>
        <td><strong>Metodología:</strong> ${clase.metodologia || "—"}</td>
      </tr>`;
    }

    ambitosHtml += `
    ${sectionHeader(`ÁMBITO: ${ambito.ambito.toUpperCase()}`)}
    <tr>
      <td colspan="2"><strong>Competencia:</strong> ${ambito.competenciaCodigo} — ${ambito.competenciaDescripcion}</td>
      <td colspan="2"><strong>Transversales:</strong> ${badges}</td>
    </tr>
    ${ambito.destrezas.length > 0 ? `
    <tr><td colspan="4"><strong>Destrezas:</strong> ${ambito.destrezas.map((d) => `• ${d}`).join(" | ")}</td></tr>
    ` : ""}
    ${clasesHtml}`;
  }

  let neeHtml = "";
  if (plan.adaptacionesNEE && plan.adaptacionesNEE.length > 0) {
    neeHtml = `
    ${sectionHeader("NECESIDADES EDUCATIVAS ESPECIALES")}
    ${plan.adaptacionesNEE.map((nee) => `
    <tr>
      <td><strong>Grado ${nee.grado}:</strong> ${nee.necesidadEducativa}</td>
      <td><strong>DCD:</strong> ${nee.adaptacionDCD}</td>
      <td><strong>Estrategias:</strong> ${nee.adaptacionEstrategias}</td>
      <td><strong>Recursos:</strong> ${nee.adaptacionRecursos}</td>
    </tr>
    `).join("")}`;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Planificación Inicial/Preparatoria — ${plan.institucion}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#1A1A1A; padding:8px; }
    table { border-collapse:collapse; width:100%; margin-bottom:8px; }
    td, th { border:1px solid #ccc; padding:5px 8px; vertical-align:top; font-size:10px; }
    .header-row { background:${COLOR_HEADER}; font-weight:bold; }
    .section-label { background:${COLOR_SECTION}; color:${COLOR_PRIMARY}; font-weight:bold; font-size:12px; padding:6px 10px; }
    .activity-item { margin:2px 0; font-size:9px; }
    .firma-row td { text-align:center; padding-top:30px; border:none; }
    .firma-line { border-top:1px solid #333; width:120px; margin:0 auto; }
  </style>
</head>
<body>
  <table>
    <!-- Título -->
    <tr>
      <td class="header-row" colspan="2">${plan.institucion || "INSTITUCIÓN"}</td>
      <td class="header-row" style="text-align:right;" colspan="2">Grado: ${plan.grado || "—"}</td>
    </tr>
    <tr>
      <td><strong>Docente:</strong> ${plan.docente || "—"}</td>
      <td><strong>Duración:</strong> ${plan.duracion || "—"}</td>
      <td colspan="2"><strong>Estado:</strong> ${plan.status || "—"}</td>
    </tr>

    <!-- Objetivo General -->
    ${sectionHeader("OBJETIVO GENERAL")}
    <tr><td colspan="4">${plan.objetivoGeneral || "—"}</td></tr>

    <!-- Ámbitos -->
    ${ambitosHtml}

    <!-- NEE -->
    ${neeHtml}

    <!-- Bibliografía -->
    ${plan.bibliografia ? `
    ${sectionHeader("BIBLIOGRAFÍA")}
    <tr><td colspan="4">${plan.bibliografia}</td></tr>
    ` : ""}

    <!-- Observaciones -->
    ${plan.observaciones ? `
    ${sectionHeader("OBSERVACIONES")}
    <tr><td colspan="4">${plan.observaciones}</td></tr>
    ` : ""}

    <!-- Firmas (4) -->
    <tr class="firma-row">
      <td><div class="firma-line"></div><br>${plan.firmas?.elaborado || "Elaborado"}</td>
      <td><div class="firma-line"></div><br>${plan.firmas?.revisado || "Revisado"}</td>
      <td><div class="firma-line"></div><br>${plan.firmas?.coordinador || "Coordinador"}</td>
      <td><div class="firma-line"></div><br>${plan.firmas?.aprobado || "Aprobado"}</td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Generador unificado ──
export function generarCurriculoCompetenciasPdf(
  plan: PlanificacionCurriculoCompetencias | PlanificacionInicialCurriculo
): string {
  if ("ambitos" in plan) {
    return generarCurriculoCompetenciasPdfInicial(plan);
  }
  return generarCurriculoCompetenciasPdfEGBBGU(plan);
}
