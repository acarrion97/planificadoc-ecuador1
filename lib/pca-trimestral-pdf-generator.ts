import { AREAS_INFO, SUBNIVEL_NAMES, TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO, type AdaptacionCurricular, type TipoNEE, type GradoAdaptacion } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { iconosDestrezaHTML } from "./dcd-iconos";

// ─── Mapas legibles ───────────────────────────────────────────────────────────
const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map(m => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map(t => [t.id, t.nombre])
);

function toStr(val: any): string {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.map(toStr).join("; ");
  if (typeof val === "object") return Object.values(val).map(toStr).join(" | ");
  return String(val);
}

const FASE_COLORS_HTML: Record<string, string> = {
  experiencia:      "#C0504D",
  reflexion:        "#4472C4",
  conceptualizacion:"#70AD47",
  aplicacion:       "#ED7D31",
  anticipacion:     "#C0504D",
  construccion:     "#4472C4",
  consolidacion:    "#70AD47",
};
const FASE_LABELS_HTML: Record<string, string> = {
  experiencia:      "EXPERIENCIA",
  reflexion:        "REFLEXIÓN",
  conceptualizacion:"CONCEPTUALIZACIÓN",
  aplicacion:       "APLICACIÓN",
  anticipacion:     "ANTICIPACIÓN",
  construccion:     "CONSTRUCCIÓN DEL CONOCIMIENTO",
  consolidacion:    "CONSOLIDACIÓN",
};

function evaluacionHTML(raw: any): string {
  const text = toStr(raw);
  if (!text) return "—";
  const partes = text
    .split(/\.\s+/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0)
    .map((s: string) => (s.endsWith(".") ? s : s + "."));
  if (partes.length <= 1) return text || "—";
  return partes.map((p: string) => `<p style="margin:0 0 4px 0;">${p}</p>`).join("");
}

function orientacionesHTML(raw: any, modelo: "ERCA" | "ACC" = "ERCA"): string {
  const orden = modelo === "ACC"
    ? ["anticipacion", "construccion", "consolidacion"]
    : ["experiencia", "reflexion", "conceptualizacion", "aplicacion"];

  const items: any[] = Array.isArray(raw)
    ? raw
    : (typeof raw === "object" && raw !== null ? [{ dcd: "", fases: raw }] : [{ dcd: "", fases: { [orden[0]]: [String(raw || "")] } }]);

  return items.map(item => {
    const fases: Record<string, string[]> = item.fases || item;
    const dcdCodigo: string = item.dcd || "";
    const dcdHeader = dcdCodigo
      ? `<div style="background:#595959;color:#fff;font-weight:700;font-size:6.5px;padding:2px 4px;margin-top:5px;">DCD: ${dcdCodigo}</div>`
      : "";
    const fasesHTML = orden.map(fase => {
      const actividades: string[] = Array.isArray(fases[fase]) ? fases[fase] : [];
      const color = FASE_COLORS_HTML[fase] || "#003366";
      const label = FASE_LABELS_HTML[fase] || fase.toUpperCase();
      const acts = actividades.map((a, i) =>
        `<div style="font-size:6px;line-height:1.4;padding-left:5px;">${i+1}. ${a}</div>`
      ).join("");
      return `<div style="color:#000;font-weight:700;font-size:6.5px;padding:2px 4px;margin-top:2px;">${label}</div>${acts}`;
    }).join("");
    return dcdHeader + fasesHTML;
  }).join("");
}

function esc(val: any): string {
  if (val == null) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Genera el bloque HTML de Adaptaciones Curriculares para la PCT.
 */
function generarHTMLAdaptacionesPCT(adaptaciones: AdaptacionCurricular[]): string {
  const activas = adaptaciones.filter(a => a.incluirEnExportacion !== false);
  if (activas.length === 0) return "";

  const ERCA_PDF_CFG = [
    { key: "experiencia",       label: "EXPERIENCIA",       dark: "#2980B9", light: "#EBF5FB" },
    { key: "reflexion",         label: "REFLEXIÓN",         dark: "#8E44AD", light: "#F5EEF8" },
    { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", dark: "#27AE60", light: "#EAFAF1" },
    { key: "aplicacion",        label: "APLICACIÓN",        dark: "#E67E22", light: "#FEF9E7" },
  ] as const;

  const filasHTML = activas.map(adap => {
    const tipoNombre = TIPOS_NEE_INFO[adap.tipoNecesidad as TipoNEE]?.nombre ?? adap.tipoNecesidad;
    const gradoInfo = GRADO_ADAPTACION_INFO[adap.gradoAdaptacion as GradoAdaptacion];
    const codigoLabel = adap.nombreEstudiante
      ? `${esc(adap.nombreEstudiante)} (${esc(adap.codigoEstudiante)})`
      : `Código: ${esc(adap.codigoEstudiante)}`;

    // Contenido según ERCA o genérico
    let derechaHTML = "";

    if (adap.adaptacionesPorDia?.length) {
      // ── ERCA por unidad/trimestre ──
      derechaHTML += `<div style="font-size:9px;font-weight:bold;color:#000;margin:4px 0 2px;">ADAPTACIONES POR UNIDAD</div>`;

      adap.adaptacionesPorDia.forEach((dp) => {
        let ercaHTML = "";
        for (const { key, label, dark, light } of ERCA_PDF_CFG) {
          const val = (dp.adaptacionERCA as any)?.[key];
          if (!val) continue;
          ercaHTML += `<div style="background:${dark};color:white;font-size:8px;font-weight:bold;padding:2px 5px;margin-top:3px;">${label}</div>
            <div style="background:${light};font-size:8px;padding:2px 5px;margin-bottom:2px;color:#111;">${esc(val)}</div>`;
        }

        const recursosHTML = dp.recursosAdaptados?.length
          ? dp.recursosAdaptados.map(r => `<div style="font-size:8px;margin-bottom:2px;">• ${esc(r)}</div>`).join("")
          : `<div style="font-size:8px;color:#888;">—</div>`;

        derechaHTML += `
          <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
            <tr><td colspan="3" style="font-size:8px;font-weight:bold;padding:3px 6px;border:1px solid #888;background:#f0f0f0;">${esc(dp.dia?.toUpperCase() || "UNIDAD")}</td></tr>
            ${dp.objetivo ? `<tr><td colspan="3" style="font-size:8px;padding:2px 6px;border:1px solid #888;"><strong>Objetivo:</strong> <em>${esc(dp.objetivo)}</em></td></tr>` : ""}
            ${dp.objetivoAdaptado ? `<tr><td colspan="3" style="font-size:8px;padding:2px 6px;border:1px solid #888;background:#F9F5FF;"><strong>Obj. adaptado:</strong> ${esc(dp.objetivoAdaptado)}</td></tr>` : ""}
            <tr><td colspan="3" style="background:#1A3A5C;color:white;font-size:8px;font-weight:bold;padding:2px 6px;">ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE</td></tr>
            <tr><td colspan="3" style="background:#1A3A5C;color:#CCCCCC;font-size:7px;font-style:italic;padding:1px 6px;">Estrategias metodológicas diversificadas con base al DUA</td></tr>
            <tr>
              <td style="background:#374151;color:white;font-size:8px;font-weight:bold;text-align:center;padding:2px 4px;border:1px solid #888;">ESTRATEGIAS ERCA ADAPTADAS</td>
              <td style="background:#374151;color:white;font-size:8px;font-weight:bold;text-align:center;padding:2px 4px;border:1px solid #888;">RECURSOS ADAPTADOS</td>
              <td style="background:#374151;color:white;font-size:8px;font-weight:bold;text-align:center;padding:2px 4px;border:1px solid #888;">EVALUACIÓN ADAPTADA</td>
            </tr>
            <tr>
              <td style="vertical-align:top;padding:4px 5px;border:1px solid #888;width:46%;">${ercaHTML}
                <div style="font-size:7px;margin-top:3px;color:#666;">
                  <span style="color:#EC4899;">■</span> Representación&nbsp;&nbsp;
                  <span style="color:#1E3A5F;">■</span> Acción/Expresión&nbsp;&nbsp;
                  <span style="color:#22C55E;">■</span> Implicación
                </div>
              </td>
              <td style="vertical-align:top;padding:4px 5px;border:1px solid #888;width:27%;">${recursosHTML}</td>
              <td style="vertical-align:top;padding:4px 5px;border:1px solid #888;width:27%;"><div style="font-size:8px;color:#111;">${esc(dp.evaluacionAdaptada || "—")}</div></td>
            </tr>
          </table>`;
      });
    } else {
      // ── Secciones genéricas ──
      if (adap.adaptacionesAcceso?.length) {
        derechaHTML += `<div style="margin-bottom:6px;">
          <div style="background:#003366;color:white;font-size:8px;font-weight:bold;padding:2px 5px;">ADAPTACIONES DE ACCESO</div>
          <div style="padding:4px 5px;background:#EBF5FB;">
            ${adap.adaptacionesAcceso.map(a => `<div style="font-size:8px;margin-bottom:2px;">• ${esc(a.descripcion)}</div>`).join("")}
          </div>
        </div>`;
      }
      if (adap.adaptacionesProceso?.length) {
        derechaHTML += `<div style="margin-bottom:6px;">
          <div style="background:#8E44AD;color:white;font-size:8px;font-weight:bold;padding:2px 5px;">ADAPTACIONES DE PROCESO</div>
          <div style="padding:4px 5px;background:#F5EEF8;">
            ${adap.adaptacionesProceso.map(a => `<div style="font-size:8px;margin-bottom:2px;">• ${esc(a.descripcion)}</div>`).join("")}
          </div>
        </div>`;
      }
      if (adap.gradoAdaptacion >= 3 && adap.adaptacionesResultado?.length) {
        derechaHTML += `<div style="margin-bottom:6px;">
          <div style="background:#E67E22;color:white;font-size:8px;font-weight:bold;padding:2px 5px;">ADAPTACIONES DE RESULTADO</div>
          <div style="padding:4px 5px;background:#FEF9E7;">
            ${adap.adaptacionesResultado.map(a => `<div style="font-size:8px;margin-bottom:2px;">• ${esc(a.descripcion)}</div>`).join("")}
          </div>
        </div>`;
      }
    }

    if (adap.metodologiasSugeridas?.length) {
      derechaHTML += `<div style="margin-top:6px;"><div style="font-size:8px;font-weight:bold;color:#003366;">METODOLOGÍAS SUGERIDAS:</div>${adap.metodologiasSugeridas.map(m => `<div style="font-size:8px;">• ${esc(m)}</div>`).join("")}</div>`;
    }
    if (adap.recursosEspecificos?.length) {
      derechaHTML += `<div style="margin-top:4px;"><div style="font-size:8px;font-weight:bold;color:#003366;">RECURSOS ESPECÍFICOS:</div>${adap.recursosEspecificos.map(r => `<div style="font-size:8px;">• ${esc(r)}</div>`).join("")}</div>`;
    }

    return `
      <tr>
        <td colspan="2" style="background:#E8D5F5;font-weight:700;font-size:9px;padding:6px;border:1px solid #AAA;">${codigoLabel}<br><span style="font-size:8px;">${esc(tipoNombre)} — ${esc(gradoInfo?.nombre)}</span></td>
        <td colspan="5" style="vertical-align:top;padding:6px;border:1px solid #AAA;">${derechaHTML}</td>
      </tr>`;
  }).join("");

  return `
    <div style="page-break-before:always;margin-top:10px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td colspan="2" style="background:#4A1942;color:white;font-size:10px;font-weight:700;padding:6px 8px;">ADAPTACIONES CURRICULARES — ${activas.length} estudiante${activas.length !== 1 ? "s" : ""}</td>
          <td colspan="5" style="background:#4A1942;color:white;font-size:10px;font-weight:700;padding:6px 8px;">ADAPTACIONES PEDAGÓGICAS</td>
        </tr>
        ${filasHTML}
      </table>
    </div>`;
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
 *   8. Adaptaciones Curriculares
 * + Tabla de Firmas
 */
export function generarHTMLPcaTrimestral(formData: any, aiResult: any): string {
  const areaInfo      = AREAS_INFO[formData.area as keyof typeof AREAS_INFO];
  const areaName      = areaInfo?.name || formData.area;
  const subnivelName  = SUBNIVEL_NAMES[formData.subnivel as keyof typeof SUBNIVEL_NAMES] || `Subnivel ${formData.subnivel}`;
  const semanasClase  = (formData.semanasTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos = semanasClase * (formData.cargaHorariaSemanal || 0);
  const trimestre     = formData.trimestre || "—";

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
          `<div style="margin-bottom:3px;"><b style="color:#1a6b3a;">${d.codigo}</b> ${d.enunciado}${iconosDestrezaHTML(d.codigo)}</div>`
        ).join("")
      : "<em style='color:#999;'>—</em>";

    return `
    <tr>
      <td style="${TD}text-align:center;font-weight:700;font-size:9px;">${unidad.numero}</td>
      <td style="${TD}font-weight:700;font-size:8px;">${ai.titulo || `Unidad ${unidad.numero}`}</td>
      <td style="${TD}font-size:8px;line-height:1.5;">${toStr(ai.objetivosEspecificos) || "—"}</td>
      <td style="${TD}font-size:7.5px;line-height:1.5;">${dcdHTML}</td>
      <td style="${TD}padding:2px;">${orientacionesHTML(ai.orientacionesMetodologicas, formData.modeloPedagogico || "ERCA")}</td>
      <td style="${TD}font-size:8px;line-height:1.5;">${evaluacionHTML(ai.evaluacion)}</td>
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
      <b>Modelo pedagógico:</b> ${formData.modeloPedagogico === "ACC" ? "ACC (Anticipación – Construcción – Consolidación)" : "ERCA (Experiencia – Reflexión – Conceptualización – Aplicación)"}<br>
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
    <td colspan="5" style="${TD}font-size:7px;height:60px;">&nbsp;</td>
    <td colspan="2" style="${TD}font-size:7px;height:60px;">&nbsp;</td>
  </tr>
</table>

<!-- 8. ADAPTACIONES CURRICULARES -->
${generarHTMLAdaptacionesPCT(formData.adaptacionesCurriculares || [])}

<!-- Tabla de firmas -->
<table style="margin-top:8px;">
  <tr>${firmasHTML}</tr>
</table>
</body>
</html>`;
}
