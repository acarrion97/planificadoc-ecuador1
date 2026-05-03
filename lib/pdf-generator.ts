import { Planificacion, AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";

/**
 * Genera el HTML con formato oficial del Ministerio de Educación de Ecuador
 * para exportar como PDF la planificación microcurricular.
 */
export function generarHTMLPlanificacion(plan: Planificacion): string {
  const areaInfo = AREAS_INFO[plan.destreza.area];
  const subnivelName = SUBNIVEL_NAMES[plan.destreza.subnivel];
  const isEFL = plan.destreza.area === "EFL";
  const bloqueName = areaInfo.bloques[plan.destreza.bloque] || (isEFL ? `Block ${plan.destreza.bloque}` : `Bloque ${plan.destreza.bloque}`);
  const fechaFormateada = new Date(plan.createdAt).toLocaleDateString(isEFL ? "en-US" : "es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Construir las actividades con estructura ERCA si hay tema seleccionado
  let actividadesHTML = "";
  if (plan.temaSeleccionado?.estructura) {
    const est = plan.temaSeleccionado.estructura;
    actividadesHTML = `
      <div class="fase">
        <div class="fase-header experiencia">${isEFL ? "EXPERIENCE" : "EXPERIENCIA"} (${est.experiencia.duracion})</div>
        <ul>${est.experiencia.actividades.map((a: string) => `<li>${a}</li>`).join("")}</ul>
      </div>
      <div class="fase">
        <div class="fase-header reflexion">${isEFL ? "REFLECTION" : "REFLEXIÓN"} (${est.reflexion.duracion})</div>
        <ul>${est.reflexion.actividades.map((a: string) => `<li>${a}</li>`).join("")}</ul>
      </div>
      <div class="fase">
        <div class="fase-header conceptualizacion">${isEFL ? "CONCEPTUALIZATION" : "CONCEPTUALIZACIÓN"} (${est.conceptualizacion.duracion})</div>
        <ul>${est.conceptualizacion.actividades.map((a: string) => `<li>${a}</li>`).join("")}</ul>
      </div>
      <div class="fase">
        <div class="fase-header aplicacion">${isEFL ? "APPLICATION" : "APLICACIÓN"} (${est.aplicacion.duracion})</div>
        <ul>${est.aplicacion.actividades.map((a: string) => `<li>${a}</li>`).join("")}</ul>
      </div>
    `;
  } else {
    actividadesHTML = `<p>${plan.actividades || (isEFL ? "Not specified" : "No especificadas")}</p>`;
  }

  // Recursos
  const recursosTexto = plan.temaSeleccionado?.recursos
    ? plan.temaSeleccionado.recursos.join(", ")
    : plan.recursos || (isEFL ? "Not specified" : "No especificados");

  // Evaluación
  const evaluacionTexto = plan.temaSeleccionado?.evaluacionFormativa
    ? plan.temaSeleccionado.evaluacionFormativa
    : plan.evaluacion || (isEFL ? "Not specified" : "No especificada");

  // Indicadores de evaluación
  const indicadoresHTML = plan.destreza.indicadoresEvaluacion
    .map((ind) => `<li>${ind}</li>`)
    .join("");

  // Criterios de evaluación
  const criteriosHTML = plan.destreza.criteriosEvaluacion
    .map((crit) => `<li>${crit}</li>`)
    .join("");

  // Objetivos
  const objetivosHTML = plan.destreza.objetivos
    .map((obj) => `<li>${obj}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEFL ? "Microcurricular Lesson Plan" : "Planificación Microcurricular"} - ${plan.destreza.codigo}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 12mm 15mm 12mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10px;
      color: #1a1a1a;
      line-height: 1.4;
      background: #fff;
    }

    /* ===== ENCABEZADO OFICIAL ===== */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #003366;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .escudo {
      width: 50px;
      height: 50px;
    }

    .header-text {
      text-align: left;
    }

    .header-text .republica {
      font-size: 9px;
      font-weight: bold;
      color: #003366;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-text .ministerio {
      font-size: 14px;
      font-weight: bold;
      color: #003366;
    }

    .header-right {
      text-align: right;
    }

    .header-right .gobierno {
      font-size: 9px;
      color: #003366;
      font-weight: bold;
    }

    /* ===== TÍTULO ===== */
    .titulo-principal {
      background: #003366;
      color: white;
      text-align: center;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    /* ===== SECCIÓN DATOS INFORMATIVOS ===== */
    .seccion-titulo {
      background: #1a5276;
      color: white;
      padding: 4px 8px;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0;
    }

    /* ===== TABLAS ===== */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }

    table td, table th {
      border: 1px solid #666;
      padding: 4px 6px;
      font-size: 9px;
      vertical-align: top;
    }

    table th {
      background: #d6e4f0;
      color: #003366;
      font-weight: bold;
      text-align: center;
      font-size: 8.5px;
      text-transform: uppercase;
      padding: 5px 4px;
    }

    .label {
      background: #eaf2f8;
      font-weight: bold;
      color: #1a3c5e;
      width: 18%;
      font-size: 8.5px;
    }

    .value {
      font-size: 9px;
      color: #1a1a1a;
    }

    /* ===== TABLA PRINCIPAL ===== */
    .tabla-principal th {
      background: #003366;
      color: white;
      font-size: 8px;
      padding: 6px 4px;
      text-transform: uppercase;
    }

    .tabla-principal td {
      font-size: 9px;
      padding: 6px;
    }

    .col-destreza { width: 25%; }
    .col-indicadores { width: 20%; }
    .col-estrategias { width: 35%; }
    .col-evaluacion { width: 20%; }

    /* ===== FASES DE LA CLASE ===== */
    .fase {
      margin-bottom: 6px;
    }

    .fase-header {
      font-weight: bold;
      font-size: 8.5px;
      padding: 3px 6px;
      margin-bottom: 2px;
      border-radius: 2px;
      color: white;
    }

    .fase-header.experiencia {
      background: #2980b9;
    }

    .fase-header.reflexion {
      background: #8e44ad;
    }

    .fase-header.conceptualizacion {
      background: #27ae60;
    }

    .fase-header.aplicacion {
      background: #e67e22;
    }

    ul {
      padding-left: 14px;
      margin: 2px 0;
    }

    li {
      font-size: 8.5px;
      margin-bottom: 2px;
      line-height: 1.35;
    }

    /* ===== SECCIÓN RECURSOS ===== */
    .recursos-box {
      border: 1px solid #666;
      padding: 6px 8px;
      margin-bottom: 8px;
      font-size: 9px;
    }

    .recursos-label {
      font-weight: bold;
      color: #1a3c5e;
      font-size: 8.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    /* ===== FIRMAS ===== */
    .firmas {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 10px;
    }

    .firma-box {
      text-align: center;
      width: 40%;
    }

    .firma-linea {
      border-top: 1px solid #333;
      padding-top: 4px;
      font-size: 8.5px;
      font-weight: bold;
      color: #333;
    }

    .firma-cargo {
      font-size: 8px;
      color: #666;
      margin-top: 2px;
    }

    /* ===== PIE DE PÁGINA ===== */
    .footer {
      margin-top: 15px;
      border-top: 2px solid #003366;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-text {
      font-size: 7px;
      color: #666;
      line-height: 1.3;
    }

    .footer-logo {
      text-align: right;
      font-size: 8px;
      color: #003366;
      font-weight: bold;
    }

    .app-badge {
      display: inline-block;
      background: #003366;
      color: white;
      font-size: 7px;
      padding: 2px 6px;
      border-radius: 2px;
      margin-top: 3px;
    }

    /* ===== TEMA SELECCIONADO ===== */
    .tema-titulo {
      background: #eaf2f8;
      border-left: 4px solid #003366;
      padding: 4px 8px;
      font-weight: bold;
      font-size: 9.5px;
      color: #003366;
      margin-bottom: 6px;
    }

    .objetivo-clase {
      font-style: italic;
      font-size: 9px;
      color: #333;
      margin-bottom: 6px;
      padding: 3px 8px;
      background: #f9f9f9;
      border-left: 3px solid #2980b9;
    }

    /* ===== OBSERVACIONES ===== */
    .observaciones {
      border: 1px solid #666;
      padding: 6px 8px;
      margin-bottom: 8px;
      min-height: 30px;
      font-size: 9px;
    }

    /* ===== DUA ===== */
    .dua-container {
      border: 1px solid #666;
      margin-bottom: 8px;
    }

    .dua-principio {
      padding: 5px 8px;
      border-bottom: 1px solid #ddd;
    }

    .dua-principio:last-child {
      border-bottom: none;
    }

    .dua-principio-titulo {
      font-weight: bold;
      font-size: 8.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
      padding: 2px 4px;
      border-radius: 2px;
      color: white;
      display: inline-block;
    }

    .dua-p1 { background: #2563EB; }
    .dua-p2 { background: #16A34A; }
    .dua-p3 { background: #D97706; }

    .dua-subtitulo {
      font-size: 7.5px;
      color: #666;
      font-style: italic;
      margin-bottom: 3px;
    }

    .dua-texto {
      font-size: 9px;
      line-height: 1.4;
      white-space: pre-line;
    }
  </style>
</head>
<body>

  <!-- ENCABEZADO OFICIAL -->
  <div class="header">
    <div class="header-left">
      <div>
        <svg class="escudo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#003366" stroke="#c8a415" stroke-width="3"/>
          <text x="50" y="35" text-anchor="middle" fill="white" font-size="10" font-weight="bold">REPÚBLICA</text>
          <text x="50" y="48" text-anchor="middle" fill="white" font-size="10" font-weight="bold">DEL</text>
          <text x="50" y="61" text-anchor="middle" fill="white" font-size="10" font-weight="bold">ECUADOR</text>
          <text x="50" y="80" text-anchor="middle" fill="#c8a415" font-size="8">★ ★ ★</text>
        </svg>
      </div>
      <div class="header-text">
        <div class="republica">República del Ecuador</div>
        <div class="ministerio">Ministerio de Educación</div>
      </div>
    </div>
    <div class="header-right">
      <div class="gobierno">Gobierno del Encuentro</div>
    </div>
  </div>

  <!-- TÍTULO PRINCIPAL -->
  <div class="titulo-principal">
    ${isEFL ? "Microcurricular Lesson Plan" : "Planificación Microcurricular de Clase"}
  </div>

  <!-- SECCIÓN 1: DATOS INFORMATIVOS -->
  <div class="seccion-titulo">${isEFL ? "1. General Information" : "1. Datos Informativos"}</div>
  <table>
    <tr>
      <td class="label">${isEFL ? "Institution:" : "Institución:"}</td>
      <td class="value">${plan.institucion || "___________________________"}</td>
      <td class="label">${isEFL ? "Teacher:" : "Nombre Docente:"}</td>
      <td class="value">${plan.docente || "___________________________"}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Area:" : "Área:"}</td>
      <td class="value">${areaInfo.name}</td>
      <td class="label">${isEFL ? "Subject:" : "Asignatura:"}</td>
      <td class="value">${plan.asignatura || areaInfo.name}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Grade/Level:" : "Grado/Curso:"}</td>
      <td class="value">${plan.grado || "___________________________"}</td>
      <td class="label">${isEFL ? "Sublevel:" : "Subnivel:"}</td>
      <td class="value">${subnivelName}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Date:" : "Fecha:"}</td>
      <td class="value">${fechaFormateada}</td>
      <td class="label">${isEFL ? "Periods:" : "Períodos:"}</td>
      <td class="value">${plan.periodos || "1"} (45 ${isEFL ? "minutes" : "minutos"})</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Curricular Block:" : "Bloque Curricular:"}</td>
      <td class="value" colspan="3">${bloqueName}</td>
    </tr>
  </table>

  <!-- SECCIÓN 2: OBJETIVOS DE APRENDIZAJE -->
  <div class="seccion-titulo">${isEFL ? "2. Learning Objectives" : "2. Objetivos de Aprendizaje"}</div>
  <table>
    <tr>
      <td class="value">
        ${plan.objetivoAprendizaje || (plan.destreza.objetivos.length > 0 ? plan.destreza.objetivos[0] : (isEFL ? "Not specified" : "No especificado"))}
      </td>
    </tr>
  </table>

  <!-- SECCIÓN 3: PLANIFICACIÓN -->
  <div class="seccion-titulo">${isEFL ? "3. Lesson Planning" : "3. Planificación de la Clase"}</div>

  ${plan.temaSeleccionado ? `
    <div class="tema-titulo">${isEFL ? "Topic" : "Tema"}: ${plan.temaSeleccionado.titulo}</div>
    <div class="objetivo-clase">${isEFL ? "Class objective" : "Objetivo de la clase"}: ${plan.temaSeleccionado.objetivoClase}</div>
  ` : ""}

  <table class="tabla-principal">
    <thead>
      <tr>
        <th class="col-destreza">${isEFL ? "Performance Criteria Skills" : "Destrezas con Criterios de Desempeño"}</th>
        <th class="col-indicadores">${isEFL ? "Assessment Indicators" : "Indicadores de Evaluación"}</th>
        <th class="col-estrategias">${isEFL ? "Active Methodological Strategies for Teaching and Learning" : "Estrategias Metodológicas Activas para la Enseñanza y Aprendizaje"}</th>
        <th class="col-evaluacion">${isEFL ? "Assessment Activities" : "Actividades Evaluativas"}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>${plan.destreza.codigo}</strong><br/>
          ${plan.destreza.descripcion}
          ${criteriosHTML ? `<br/><br/><strong style="font-size:8px;">${isEFL ? "Assessment criteria:" : "Criterios de evaluación:"}</strong><ul>${criteriosHTML}</ul>` : ""}
        </td>
        <td>
          ${indicadoresHTML ? `<ul>${indicadoresHTML}</ul>` : (isEFL ? "Not specified" : "No especificados")}
        </td>
        <td>
          ${actividadesHTML}
        </td>
        <td>
          <strong style="font-size:8px;">${isEFL ? "Formative assessment:" : "Evaluación formativa:"}</strong><br/>
          ${evaluacionTexto}
          <br/><br/>
          <strong style="font-size:8px;">${isEFL ? "Techniques and instruments:" : "Técnicas e instrumentos:"}</strong><br/>
          ${plan.tecnicasInstrumentos || (isEFL ? "Direct observation, checklist, rubric" : "Observación directa, lista de cotejo, rúbrica")}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECCIÓN 4: RECURSOS -->
  <div class="seccion-titulo">${isEFL ? "4. Resources" : "4. Recursos"}</div>
  <div class="recursos-box">
    ${recursosTexto}
  </div>

  <!-- SECCIÓN 5: DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA) -->
  <div class="seccion-titulo">${isEFL ? "5. Universal Design for Learning (UDL)" : "5. Diseño Universal para el Aprendizaje (DUA)"}</div>
  <div class="dua-container">
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p1">${isEFL ? "Principle 1: Multiple Means of Representation" : "Principio 1: Múltiples formas de Representación"}</span>
      <div class="dua-subtitulo">${isEFL ? "The WHAT of learning" : "El QUÉ del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.representacion || (isEFL ? "Present information through visual, auditory, and hands-on resources to address diverse learning styles." : "Presentar la información mediante recursos visuales, auditivos y manipulativos para atender diversos estilos de aprendizaje.")}</div>
    </div>
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p2">${isEFL ? "Principle 2: Multiple Means of Action and Expression" : "Principio 2: Múltiples formas de Acción y Expresión"}</span>
      <div class="dua-subtitulo">${isEFL ? "The HOW of learning" : "El CÓMO del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.accionExpresion || (isEFL ? "Allow students to demonstrate learning through oral, written, graphic, or practical means according to their strengths." : "Permitir que los estudiantes demuestren lo aprendido de forma oral, escrita, gráfica o práctica según sus fortalezas.")}</div>
    </div>
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p3">${isEFL ? "Principle 3: Multiple Means of Engagement" : "Principio 3: Múltiples formas de Implicación"}</span>
      <div class="dua-subtitulo">${isEFL ? "The WHY of learning" : "El POR QUÉ del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.implicacion || (isEFL ? "Motivate students through meaningful activities, collaborative work, and connection to their context." : "Motivar a los estudiantes mediante actividades significativas, trabajo colaborativo y conexión con su contexto.")}</div>
    </div>
  </div>

  <!-- SECCIÓN 6: OBSERVACIONES -->
  <div class="seccion-titulo">${isEFL ? "6. Observations" : "6. Observaciones"}</div>
  <div class="observaciones">
    ${plan.observaciones || (isEFL ? "No additional observations." : "Sin observaciones adicionales.")}
  </div>

  <!-- FIRMAS -->
  <div class="firmas">
    <div class="firma-box">
      <div class="firma-linea">${plan.docente || "________________________"}</div>
      <div class="firma-cargo">${isEFL ? "Teacher" : "Docente"}</div>
    </div>
    <div class="firma-box">
      <div class="firma-linea">________________________</div>
      <div class="firma-cargo">${isEFL ? "Area Director" : "Director/a de Área"}</div>
    </div>
  </div>

  <!-- PIE DE PÁGINA -->
  <div class="footer">
    <div class="footer-text">
      ${isEFL ? "Format based on the guidelines of the Ministry of Education of Ecuador.<br/>National Curriculum 2016 - General Basic Education and Unified General Baccalaureate." : "Formato basado en los lineamientos del Ministerio de Educación del Ecuador.<br/>Currículo Nacional 2016 - Educación General Básica y Bachillerato General Unificado."}
    </div>
    <div class="footer-logo">
      PlanificaDoc Ecuador
      <div class="app-badge">Generado con PlanificaDoc</div>
    </div>
  </div>

</body>
</html>`;
}
