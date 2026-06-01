import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "../data/pca-ejes-transversales";

// ─── Mapas legibles ───────────────────────────────────────────────────────────
const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map(m => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map(t => [t.id, t.nombre])
);
const EJE_LABEL: Record<string, string> = Object.fromEntries(
  EJES_TRANSVERSALES_PCA.map(e => [e.id, e.nombre])
);

function toStr(val: any): string {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.map(toStr).join("; ");
  if (typeof val === "object") return Object.values(val).map(toStr).join(" | ");
  return String(val);
}

/**
 * Genera el HTML del Plan Curricular Trimestral (PCT) para impresión / PDF.
 * Formato A4 landscape, Arial, cabeceras celeste MinEduc.
 * Secciones:
 *   1. Datos Informativos (incluye Trimestre)
 *   2. Tiempo
 *   3. Objetivos del Trimestre  (IA)
 *   4. Inserciones Curriculares
 *   5. Desarrollo de Unidades   (IA)
 *   6. Bibliografía             (en blanco — docente completa)
 *   7. Observaciones            (IA)
 * + Tabla de Firmas
 */
export function generarHTMLPcaTrimestral(formData: any, aiResult: any): string {
  const areaInfo      = AREAS_INFO[formData.area as keyof typeof AREAS_INFO];
  const areaName      = areaInfo?.name || formData.area;
  const subnivelName  = SUBNIVEL_NAMES[formData.subnivel as keyof typeof SUBNIVEL_NAMES] || `Subnivel ${formData.subnivel}`;
  const semanasClase  = (formData.semanasTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos = semanasClase * (formData.cargaHorariaSemanal || 0);
  const trimestre     = formData.trimestre || "—";

  const ejesTexto    = formData.usaEjesTransversales && formData.ejesTransversales?.length > 0
    ? formData.ejesTransversales.map((e: string) => EJE_LABEL[e] || e).join(", ")
    : "No aplica";
  const metodoTexto  = (formData.metodologiasActivas || []).map((m: string) => METODOLOGIA_LABEL[m] || m).join(", ") || "—";
  const tecnicaTexto = (formData.tecnicasEvaluacion  || []).map((t: string) => TECNICA_LABEL[t] || t).join(", ") || "—";

  const aiUnidades: any[] = aiResult?.unidades || [];

  // ── Estilos inline ──
  const BORDER = "border:1px solid #AAAAAA;";
  const TD  = `padding:5px 6px;${BORDER}vertical-align:top;`;
  const TH  = `padding:6px 5px;${BORDER}background:#DDEFF1;font-weight:700;font-size:8px;text-align:center;vertical-align:middle;`;
  const SEC = `padding:5px 8px;${BORDER}background:#DDEFF1;font-weight:700;font-size:8.5px;`;

  // 7 columnas: N° | Título | ObjEsp | Destrezas | Orientaciones | Indicador | Duración
  const COL_PCT = ["3%", "13%", "17%", "18%", "24%", "21%", "4%"];

  const unidadesFilas = (formData.unidades || []).map((unidad: any, idx: number) => {
    const ai = aiUnidades.find((a: any) => a.numero === unidad.numero) || aiUnidades[idx] || {};
    const dcdHTML = (unidad.dcdsSeleccionadas || []).length > 0
      ? (unidad.dcdsSeleccionadas as any[]).map((d: any) =>
          `<div style="margin-bottom:3px;"><b style="color:#1a6b3a;">${d.codigo}</b> ${d.enunciado}</div>`
        ).join("")
      : "<em style='color:#999;'>—</em>";

    return `
    <tr>
      <td style="${TD}text-align:center;font-weight:700;font-size:9px;">${unidad.numero}</td>
      <td style="${TD}font-weight:700;font-size:8px;">${ai.titulo || `Unidad ${unidad.numero}`}</td>
      <td style="${TD}font-size:8px;line-height:1.5;">${toStr(ai.objetivosEspecificos) || "—"}</td>
      <td style="${TD}font-size:7.5px;line-height:1.5;">${dcdHTML}</td>
      <td style="${TD}font-size:8px;line-height:1.5;">${toStr(ai.orientacionesMetodologicas) || "—"}</td>
      <td style="${TD}font-size:8px;line-height:1.5;">${toStr(ai.evaluacion) || "—"}</td>
      <td style="${TD}text-align:center;font-size:8px;">${ai.duracionSemanas || unidad.duracionSemanas || "—"}</td>
    </tr>`;
  }).join("");

  const firmas = [
    { rol: "ELABORADO", cargo: "DOCENTE:",     nombre: formData.firmaElaboradoPor || formData.docente || "", fecha: formData.firmaElaboradoFecha || "" },
    { rol: "REVISADO",  cargo: "VICERRECTOR:", nombre: formData.firmaRevisadoPor  || "", fecha: formData.firmaRevisadoFecha  || "" },
    { rol: "APROBADO",  cargo: "DIRECTOR:",    nombre: formData.firmaAprobadoPor  || "", fecha: formData.firmaAprobadoFecha  || "" },
  ];

  const firmasHTML = firmas.map(f => `
    <td style="width:33.3%;${BORDER}padding:6px 8px;text-align:center;vertical-align:top;">
      <div style="font-weight:700;font-size:7.5px;">${f.rol}</div>
      <div style="font-size:7px;margin-top:3px;">${f.cargo}</div>
      <div style="font-size:7px;margin-top:3px;">${f.nombre || "_________________________"}</div>
      <div style="font-size:7px;margin-top:8px;">Firma: _________________________</div>
      <div style="font-size:7px;margin-top:3px;">Fecha: ${f.fecha || "___________"}</div>
    </td>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Plan Curricular Trimestral — ${areaName} — ${formData.grado} — ${trimestre}</title>
  <style>
    @page { size: A4 landscape; margin: 0.5cm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 7.5px; color: #000; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<table>
  <!-- Fila 0: Encabezado institucional -->
  <tr>
    <td colspan="2" style="${TD}text-align:center;width:18%;">
      <div style="font-weight:700;font-size:7px;">LOGO</div>
      <div style="font-size:6px;">INSTITUCIONAL</div>
    </td>
    <td colspan="3" style="${TD}text-align:center;font-weight:700;font-size:9px;">${formData.institucion || "—"}</td>
    <td colspan="2" style="${TD}text-align:center;">
      <div style="font-weight:700;font-size:7px;">AÑO LECTIVO</div>
      <div style="font-weight:700;font-size:7px;">${formData.anioLectivo || "—"}</div>
    </td>
  </tr>
  <!-- Título principal -->
  <tr>
    <td colspan="7" style="${TD}text-align:center;font-weight:900;font-size:14px;padding:10px;">
      PLAN CURRICULAR TRIMESTRAL
    </td>
  </tr>

  <!-- 1. DATOS INFORMATIVOS -->
  <tr><td colspan="7" style="${SEC}">1. DATOS INFORMATIVOS</td></tr>
  <tr>
    <td colspan="4" style="${TD}font-size:7.5px;width:${COL_PCT[0]}"><b>Área:</b> ${areaName}</td>
    <td colspan="3" style="${TD}font-size:7.5px;"><b>Asignatura:</b> ${areaName}</td>
  </tr>
  <tr>
    <td colspan="7" style="${TD}font-size:7.5px;"><b>Docente(s):</b> ${formData.docente || "—"}</td>
  </tr>
  <tr>
    <td colspan="4" style="${TD}font-size:7.5px;"><b>Grado/Curso:</b> ${formData.grado || "—"} &nbsp;—&nbsp; <b>Paralelo:</b> ${formData.paralelo || "—"}</td>
    <td colspan="3" style="${TD}font-size:7.5px;"><b>Nivel Educativo:</b> ${subnivelName}</td>
  </tr>
  <tr>
    <td colspan="7" style="${TD}font-size:7.5px;font-weight:700;color:#003366;"><b>Trimestre:</b> ${trimestre}</td>
  </tr>

  <!-- 2. TIEMPO -->
  <tr><td colspan="7" style="${SEC}">2. TIEMPO</td></tr>
  <tr>
    <td colspan="2" style="${TH}">Carga horaria semanal</td>
    <td style="${TH}">No. Semanas de trabajo</td>
    <td colspan="2" style="${TH}">Evaluación e imprevistos</td>
    <td style="${TH}">Total semanas de clase</td>
    <td style="${TH}">Total períodos</td>
  </tr>
  <tr>
    <td colspan="2" style="${TD}text-align:center;">${formData.cargaHorariaSemanal || "—"}</td>
    <td style="${TD}text-align:center;">${formData.semanasTotal || "—"}</td>
    <td colspan="2" style="${TD}text-align:center;">${formData.semanasEvaluacion || "—"}</td>
    <td style="${TD}text-align:center;">${semanasClase}</td>
    <td style="${TD}text-align:center;">${totalPeriodos}</td>
  </tr>

  <!-- 3. OBJETIVOS DEL TRIMESTRE -->
  <tr><td colspan="7" style="${SEC}">3. OBJETIVOS DEL TRIMESTRE</td></tr>
  <tr>
    <td colspan="7" style="${TD}font-size:7.5px;line-height:1.6;">
      <b>Objetivos del ${trimestre}:</b><br>${toStr(aiResult?.objetivosTrimestre) || "—"}
    </td>
  </tr>

  <!-- 4. INSERCIONES CURRICULARES -->
  <tr><td colspan="7" style="${SEC}">4. INSERCIONES CURRICULARES</td></tr>
  <tr>
    <td colspan="7" style="${TD}font-size:7.5px;line-height:1.8;">
      <b>Ejes transversales:</b> ${ejesTexto}<br>
      <b>Metodologías activas:</b> ${metodoTexto}<br>
      <b>Técnicas de evaluación:</b> ${tecnicaTexto}
    </td>
  </tr>

  <!-- 5. UNIDADES DE PLANIFICACIÓN -->
  <tr><td colspan="7" style="${SEC}">5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN</td></tr>
  <tr>
    <td style="${TH};width:${COL_PCT[0]}">N.°</td>
    <td style="${TH};width:${COL_PCT[1]}">Título de la unidad</td>
    <td style="${TH};width:${COL_PCT[2]}">Objetivos específicos</td>
    <td style="${TH};width:${COL_PCT[3]}">Destrezas</td>
    <td style="${TH};width:${COL_PCT[4]}">Orientaciones metodológicas</td>
    <td style="${TH};width:${COL_PCT[5]}">Indicador de evaluación</td>
    <td style="${TH};width:${COL_PCT[6]}">Duración (sem.)</td>
  </tr>
  ${unidadesFilas}

  <!-- 6 + 7: BIBLIOGRAFÍA | OBSERVACIONES -->
  <tr>
    <td colspan="5" style="${SEC}">6. BIBLIOGRAFÍA / WEBGRAFÍA (Normas APA)</td>
    <td colspan="2" style="${SEC}">7. OBSERVACIONES</td>
  </tr>
  <tr>
    <td colspan="5" style="${TD}font-size:7px;line-height:2.2;color:#666;">
      _______________________________________<br>
      _______________________________________<br>
      _______________________________________<br>
      _______________________________________<br>
      _______________________________________
    </td>
    <td colspan="2" style="${TD}font-size:7.5px;line-height:1.5;">${toStr(aiResult?.observaciones) || "—"}</td>
  </tr>
</table>

<!-- Tabla de firmas -->
<table style="margin-top:8px;">
  <tr>${firmasHTML}</tr>
</table>
</body>
</html>`;
}
