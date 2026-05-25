import { PcaFormData, PcaAiResult, AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "../data/pca-ejes-transversales";

// Mapas ID → nombre legible (construidos una sola vez)
const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map(m => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map(t => [t.id, t.nombre])
);
const EJE_LABEL: Record<string, string> = Object.fromEntries(
  EJES_TRANSVERSALES_PCA.map(e => [e.id, e.nombre])
);

/**
 * Genera el HTML con formato oficial del Ministerio de Educación de Ecuador
 * Planificación Curricular Anual (PCA) — Currículo 2023-2024
 */
export function generarHTMLPca(formData: PcaFormData, aiResult: PcaAiResult): string {
  const areaInfo = AREAS_INFO[formData.area];
  const subnivelName = SUBNIVEL_NAMES[formData.subnivel];
  const areaColor = areaInfo?.color || "#1E3A5F";
  const areaColorLight = areaColor + "15";

  const semanasClase = formData.semanasTrabajoTotal - formData.semanasEvaluacion;

  // ===== Encabezado institucional =====
  const encabezadoHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr>
        <td rowspan="3" style="width:100px;text-align:center;padding:10px;border:1px solid #333;vertical-align:middle;">
          <div style="font-size:36px;">🏫</div>
          <div style="font-size:8px;color:#666;margin-top:4px;">INSTITUCIÓN</div>
        </td>
        <td colspan="3" style="text-align:center;padding:12px 8px;border:1px solid #333;background:${areaColor};color:white;">
          <div style="font-size:16px;font-weight:900;letter-spacing:1px;">PLANIFICACIÓN CURRICULAR ANUAL</div>
          <div style="font-size:10px;margin-top:2px;opacity:0.9;">Año Lectivo ${formData.anioLectivo} — Sistema Educativo Ecuatoriano</div>
        </td>
        <td rowspan="3" style="width:100px;text-align:center;padding:10px;border:1px solid #333;vertical-align:middle;">
          <div style="font-size:36px;">📅</div>
          <div style="font-size:8px;color:#666;margin-top:4px;">PERÍODO LECTIVO</div>
          <div style="font-size:9px;font-weight:700;color:${areaColor};">${formData.anioLectivo}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Institución:</b> ${formData.institucion || "—"}</td>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Docente:</b> ${formData.docente || "—"}</td>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Área:</b> <span style="color:${areaColor};font-weight:700;">${areaInfo?.name || formData.area}</span></td>
      </tr>
      <tr>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Subnivel:</b> ${subnivelName}</td>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Grado/Curso:</b> ${formData.grado}</td>
        <td style="padding:6px 10px;border:1px solid #333;font-size:10px;"><b>Paralelo:</b> ${formData.paralelo || "—"}</td>
      </tr>
    </table>`;

  // ===== Datos de tiempo =====
  const tiempoHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr style="background:${areaColorLight};">
        <td style="padding:7px 10px;border:1px solid #333;font-size:10px;text-align:center;"><b>Carga Horaria Semanal</b><br><span style="font-size:14px;color:${areaColor};font-weight:700;">${formData.cargaHorariaSemanal}h</span></td>
        <td style="padding:7px 10px;border:1px solid #333;font-size:10px;text-align:center;"><b>Semanas Totales</b><br><span style="font-size:14px;color:${areaColor};font-weight:700;">${formData.semanasTrabajoTotal}</span></td>
        <td style="padding:7px 10px;border:1px solid #333;font-size:10px;text-align:center;"><b>Semanas de Evaluación</b><br><span style="font-size:14px;color:${areaColor};font-weight:700;">${formData.semanasEvaluacion}</span></td>
        <td style="padding:7px 10px;border:1px solid #333;font-size:10px;text-align:center;"><b>Semanas de Clase</b><br><span style="font-size:14px;color:${areaColor};font-weight:700;">${semanasClase}</span></td>
        <td style="padding:7px 10px;border:1px solid #333;font-size:10px;text-align:center;"><b>Total Horas Anuales</b><br><span style="font-size:14px;color:${areaColor};font-weight:700;">${semanasClase * formData.cargaHorariaSemanal}h</span></td>
      </tr>
    </table>`;

  // ===== Objetivos del área =====
  const objetivosAreaHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr style="background:${areaColor};">
        <td style="padding:8px 12px;color:white;font-size:11px;font-weight:700;letter-spacing:0.5px;">
          🎯 OBJETIVOS DEL ÁREA DE ${(areaInfo?.name || formData.area).toUpperCase()}
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border:1px solid #ddd;font-size:10px;line-height:1.7;white-space:pre-wrap;">${aiResult.objetivosArea || "—"}</td>
      </tr>
    </table>`;

  // ===== Objetivos del grado =====
  const objetivosGradoHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr style="background:${areaColor};">
        <td style="padding:8px 12px;color:white;font-size:11px;font-weight:700;letter-spacing:0.5px;">
          🏆 OBJETIVOS DEL GRADO / CURSO — ${formData.grado}
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border:1px solid #ddd;font-size:10px;line-height:1.7;white-space:pre-wrap;">${aiResult.objetivosGrado || "—"}</td>
      </tr>
    </table>`;

  // ===== Ejes transversales =====
  const ejesHTML = formData.usaEjesTransversales && formData.ejesTransversales.length > 0
    ? `<table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
        <tr style="background:#F3F4F6;">
          <td style="padding:8px 12px;font-size:11px;font-weight:700;border:1px solid #ddd;color:#374151;">
            🌐 EJES TRANSVERSALES INSTITUCIONALES
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #ddd;font-size:10px;">
            ${formData.ejesTransversales.map(e => `<span style="display:inline-block;background:#E0F2FE;color:#0369A1;border-radius:12px;padding:3px 10px;margin:2px;font-size:9px;font-weight:600;">${EJE_LABEL[e] || e}</span>`).join("")}
          </td>
        </tr>
      </table>` : "";

  // ===== Metodologías y técnicas =====
  const metodologiasHTML = (formData.metodologiasActivas.length > 0 || formData.tecnicasEvaluacion.length > 0)
    ? `<table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
        <tr style="background:#F3F4F6;">
          <td style="padding:8px 12px;font-size:11px;font-weight:700;border:1px solid #ddd;color:#374151;">⚙️ METODOLOGÍAS ACTIVAS</td>
          <td style="padding:8px 12px;font-size:11px;font-weight:700;border:1px solid #ddd;color:#374151;">📊 TÉCNICAS DE EVALUACIÓN</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #ddd;font-size:10px;">
            ${formData.metodologiasActivas.length > 0
              ? formData.metodologiasActivas.map(m => `<span style="display:inline-block;background:#EDE9FE;color:#6D28D9;border-radius:10px;padding:3px 9px;margin:2px;font-size:9px;font-weight:600;">${METODOLOGIA_LABEL[m] || m}</span>`).join("")
              : "—"}
          </td>
          <td style="padding:10px 12px;border:1px solid #ddd;font-size:10px;">
            ${formData.tecnicasEvaluacion.length > 0
              ? formData.tecnicasEvaluacion.map(t => `<span style="display:inline-block;background:#D1FAE5;color:#065F46;border-radius:10px;padding:3px 9px;margin:2px;font-size:9px;font-weight:600;">${TECNICA_LABEL[t] || t}</span>`).join("")
              : "—"}
          </td>
        </tr>
      </table>` : "";

  // ===== Tabla de unidades didácticas =====
  const aiUnidades = aiResult.unidades || [];

  const unidadesHTML = formData.unidades.map((unidad, idx) => {
    const aiUnidad = aiUnidades.find(u => u.numero === unidad.numero) || aiUnidades[idx] || {};
    const dcdRows = unidad.dcdsSeleccionadas.map(dcd =>
      `<tr>
        <td style="padding:4px 8px;border:1px solid #e2e8f0;font-size:9px;font-weight:700;color:${areaColor};white-space:nowrap;">${dcd.codigo}</td>
        <td style="padding:4px 8px;border:1px solid #e2e8f0;font-size:9px;line-height:1.5;">${dcd.enunciado}</td>
      </tr>`
    ).join("");

    return `
    <div style="margin-bottom:16px;page-break-inside:avoid;">
      <table style="width:100%;border-collapse:collapse;" border="1" cellspacing="0">
        <tr style="background:${areaColor};">
          <td colspan="2" style="padding:9px 12px;color:white;font-size:12px;font-weight:700;">
            📖 UNIDAD ${unidad.numero}: ${(aiUnidad.titulo || unidad.titulo || `Unidad ${unidad.numero}`).toUpperCase()}
          </td>
        </tr>
        <tr style="background:${areaColorLight};">
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;width:140px;">Duración</td>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;">${aiUnidad.duracionSemanas || unidad.duracionSemanas || "—"} semana(s)</td>
        </tr>
        <tr>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;vertical-align:top;">Objetivos Específicos</td>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;line-height:1.6;white-space:pre-wrap;">${aiUnidad.objetivosEspecificos || unidad.objetivosEspecificos || "—"}</td>
        </tr>
        <tr>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;vertical-align:top;">Destrezas con Criterio de Desempeño (DCD)</td>
          <td style="padding:0;border:1px solid #ddd;">
            ${unidad.dcdsSeleccionadas.length > 0
              ? `<table style="width:100%;border-collapse:collapse;">${dcdRows}</table>`
              : '<span style="padding:6px 10px;font-size:9px;color:#888;display:block;">No hay DCDs seleccionadas para esta unidad.</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;vertical-align:top;">Contenidos / Saberes</td>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;line-height:1.6;white-space:pre-wrap;">${aiUnidad.contenidos || unidad.contenidos || "—"}</td>
        </tr>
        <tr>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;vertical-align:top;">Orientaciones Metodológicas</td>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;line-height:1.6;white-space:pre-wrap;">${aiUnidad.orientacionesMetodologicas || unidad.orientacionesMetodologicas || "—"}</td>
        </tr>
        <tr>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;font-weight:600;vertical-align:top;">Evaluación</td>
          <td style="padding:5px 10px;border:1px solid #ddd;font-size:9px;line-height:1.6;white-space:pre-wrap;">${aiUnidad.evaluacion || unidad.evaluacion || "—"}</td>
        </tr>
      </table>
    </div>`;
  }).join("");

  // ===== Bibliografía =====
  const bibliografiaHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr style="background:${areaColor};">
        <td colspan="2" style="padding:8px 12px;color:white;font-size:11px;font-weight:700;letter-spacing:0.5px;">
          📚 BIBLIOGRAFÍA Y RECURSOS
        </td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-size:9px;font-weight:700;border:1px solid #ddd;width:140px;vertical-align:top;">Para el Docente</td>
        <td style="padding:8px 12px;font-size:9px;line-height:1.7;border:1px solid #ddd;white-space:pre-wrap;">${formData.bibliografiaDocente || aiResult.bibliografiaSugerida || "—"}</td>
      </tr>
      ${aiResult.bibliografiaSugerida && formData.bibliografiaDocente ? `
      <tr>
        <td style="padding:8px 12px;font-size:9px;font-weight:700;border:1px solid #ddd;vertical-align:top;">Bibliografía Sugerida (IA)</td>
        <td style="padding:8px 12px;font-size:9px;line-height:1.7;border:1px solid #ddd;white-space:pre-wrap;">${aiResult.bibliografiaSugerida}</td>
      </tr>` : ""}
    </table>`;

  // ===== Observaciones =====
  const observacionesHTML = aiResult.observaciones
    ? `<table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
        <tr style="background:#F9FAFB;">
          <td style="padding:8px 12px;font-size:11px;font-weight:700;border:1px solid #ddd;color:#374151;">
            💡 OBSERVACIONES Y RECOMENDACIONES
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-size:9px;line-height:1.7;border:1px solid #ddd;white-space:pre-wrap;">${aiResult.observaciones}</td>
        </tr>
      </table>` : "";

  // ===== DUA =====
  const duaHTML = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;" border="1" cellspacing="0">
      <tr style="background:#F3F4F6;">
        <td colspan="3" style="padding:8px 12px;font-size:11px;font-weight:700;border:1px solid #ddd;color:#374151;text-align:center;">
          ♿ DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)
        </td>
      </tr>
      <tr>
        <td style="padding:8px 10px;border:1px solid #ddd;text-align:center;width:33%;">
          <div style="background:#EC4899;color:white;border-radius:8px;padding:6px;font-size:9px;font-weight:700;">REPRESENTACIÓN</div>
          <div style="font-size:8px;color:#555;margin-top:6px;line-height:1.4;">Múltiples medios de presentación de la información. Usa imágenes, audio, video y texto.</div>
        </td>
        <td style="padding:8px 10px;border:1px solid #ddd;text-align:center;width:33%;">
          <div style="background:#1E3A5F;color:white;border-radius:8px;padding:6px;font-size:9px;font-weight:700;">ACCIÓN Y EXPRESIÓN</div>
          <div style="font-size:8px;color:#555;margin-top:6px;line-height:1.4;">Alternativas para demostrar el aprendizaje: oral, escrito, digital, kinestésico.</div>
        </td>
        <td style="padding:8px 10px;border:1px solid #ddd;text-align:center;width:33%;">
          <div style="background:#22C55E;color:white;border-radius:8px;padding:6px;font-size:9px;font-weight:700;">IMPLICACIÓN / MOTIVACIÓN</div>
          <div style="font-size:8px;color:#555;margin-top:6px;line-height:1.4;">Fomentar el interés, la persistencia y la autorregulación del aprendizaje.</div>
        </td>
      </tr>
    </table>`;

  // ===== Firmas =====
  const firmasHTML = `
    <table style="width:100%;border-collapse:collapse;margin-top:24px;" border="1" cellspacing="0">
      <tr style="background:#F3F4F6;">
        <td style="padding:8px 12px;font-size:10px;font-weight:700;border:1px solid #ddd;text-align:center;">ELABORADO POR</td>
        <td style="padding:8px 12px;font-size:10px;font-weight:700;border:1px solid #ddd;text-align:center;">REVISADO POR</td>
        <td style="padding:8px 12px;font-size:10px;font-weight:700;border:1px solid #ddd;text-align:center;">APROBADO POR</td>
      </tr>
      <tr>
        <td style="padding:40px 12px 8px;border:1px solid #ddd;text-align:center;font-size:9px;">
          <div style="border-top:1px solid #333;padding-top:6px;">${formData.firmaElaboradoPor || formData.docente || "—"}</div>
          <div style="color:#888;margin-top:2px;">${formData.firmaElaboradoFecha || ""}</div>
        </td>
        <td style="padding:40px 12px 8px;border:1px solid #ddd;text-align:center;font-size:9px;">
          <div style="border-top:1px solid #333;padding-top:6px;">${formData.firmaRevisadoPor || "—"}</div>
          <div style="color:#888;margin-top:2px;">${formData.firmaRevisadoFecha || ""}</div>
        </td>
        <td style="padding:40px 12px 8px;border:1px solid #ddd;text-align:center;font-size:9px;">
          <div style="border-top:1px solid #333;padding-top:6px;">${formData.firmaAprobadoPor || "—"}</div>
          <div style="color:#888;margin-top:2px;">${formData.firmaAprobadoFecha || ""}</div>
        </td>
      </tr>
    </table>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PCA — ${areaInfo?.name || formData.area} — ${formData.grado} — ${formData.anioLectivo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 10px;
      color: #1a1a1a;
      background: white;
      padding: 20px;
    }
    @media print {
      body { padding: 10mm; }
      @page { size: A4; margin: 10mm; }
    }
    h2 { font-size: 13px; color: ${areaColor}; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${areaColor}; padding-bottom: 4px; }
    table { page-break-inside: avoid; }
  </style>
</head>
<body>
  ${encabezadoHTML}
  <div style="height:8px;"></div>
  ${tiempoHTML}
  <div style="height:8px;"></div>
  ${objetivosAreaHTML}
  <div style="height:8px;"></div>
  ${objetivosGradoHTML}
  <div style="height:8px;"></div>
  ${ejesHTML ? ejesHTML + '<div style="height:8px;"></div>' : ""}
  ${metodologiasHTML ? metodologiasHTML + '<div style="height:8px;"></div>' : ""}

  <h2>📖 Unidades Didácticas Anuales</h2>
  ${unidadesHTML}

  ${bibliografiaHTML}
  <div style="height:8px;"></div>
  ${observacionesHTML ? observacionesHTML + '<div style="height:8px;"></div>' : ""}
  ${duaHTML}
  ${firmasHTML}

  <div style="text-align:center;margin-top:20px;font-size:8px;color:#aaa;">
    Generado con PlanificaDoc Ecuador · ${new Date().toLocaleDateString("es-EC")} ·
    Ministerio de Educación — Currículo Priorizado 2023-2024
  </div>
</body>
</html>`;
}
