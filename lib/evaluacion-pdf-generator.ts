/**
 * Generador de PDF (HTML imprimible) para Evaluaciones Diagnósticas.
 * Sigue el patrón de lib/pca-pdf-generator.ts: HTML con estilos en línea
 * que luego se imprime (window.print en web / expo-print en móvil).
 */
import type { EvaluacionDiagnostica } from "../data/types-evaluacion";
import { AREAS_INFO, SUBNIVEL_NAMES } from "../data";
import {
  ESTATUS_EVALUACION_INFO,
  TIPO_PREGUNTA_INFO,
  DIFICULTAD_INFO,
  ESTADO_APRENDIZAJE_INFO,
  EstadoAprendizaje,
} from "../data/types-evaluacion";
import {
  calcularBrechasCurso,
  generarRecomendaciones,
  clasificarAprendizaje,
  calcularResultadoEstudiante,
} from "../lib/evaluacion-utils";

const PALETA = {
  titulo: "#003366",
  encabezado: "#1A3A5C",
  seccion: "#DDEFF1",
  borde: "#cbd5e1",
  texto: "#111827",
  muted: "#6b7280",
  verde: "#16A34A",
  amarillo: "#D97706",
  rojo: "#DC2626",
};

function esc(t: string): string {
  return String(t ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Nivel dominante de una brecha: estado con más estudiantes (empate → más severo) */
function nivelDominante(b: { dominado: number; enProceso: number; requiereRefuerzo: number }): EstadoAprendizaje {
  const max = Math.max(b.dominado, b.enProceso, b.requiereRefuerzo);
  if (b.requiereRefuerzo === max) return "requiere_refuerzo";
  if (b.enProceso === max) return "en_proceso";
  return "dominado";
}

/** Resultados por estudiante con los cálculos derivados (no persistidos) */
function resultadosCalculados(ev: EvaluacionDiagnostica) {
  return ev.estudiantes
    .filter((est) => ev.resultados.some((r) => r.estudianteId === est.id && r.respuestas.length > 0))
    .map((est) => {
      const r = ev.resultados.find((x) => x.estudianteId === est.id)!;
      const calc = calcularResultadoEstudiante(ev, r);
      return { codigo: est.codigo, nombre: est.nombre, puntaje: calc.puntaje, porcentaje: calc.porcentaje };
    });
}

export function generarHTMLEvaluacion(ev: EvaluacionDiagnostica): string {
  const brechas = calcularBrechasCurso(ev);
  const recomendaciones = generarRecomendaciones(ev);
  const estatus = ESTATUS_EVALUACION_INFO[ev.status];
  const conResultados = resultadosCalculados(ev);

  const contexto = `
    <div style="font-size:11px;color:${PALETA.muted};margin-top:4px;">
      ${AREAS_INFO[ev.area]?.emoji ?? ""} ${AREAS_INFO[ev.area]?.name ?? ev.area} ·
      ${SUBNIVEL_NAMES[ev.subnivel] ?? "Subnivel"} · ${esc(ev.grado)}${ev.paralelo ? ` · Paralelo ${esc(ev.paralelo)}` : ""}
      ${ev.asignatura ? ` · ${esc(ev.asignatura)}` : ""} · ${esc(ev.anioLectivo)}
      <br/>Puntaje total: ${ev.puntajeTotal} · Duración: ${ev.duracionMinutos} min ·
      Estado: ${estatus.nombre} · Generado: ${new Date().toLocaleString()}
    </div>`;

  const preguntas = ev.preguntas
    .map((p) => {
      const detalle = p.opciones?.length
        ? `<div style="font-size:10px;color:${PALETA.muted};margin-top:2px;">${p.opciones
            .map((o) => `${o.esCorrecta ? "✔" : "•"} ${esc(o.texto)}`)
            .join(" · ")}</div>`
        : p.respuestaCorrecta
          ? `<div style="font-size:10px;color:${PALETA.muted};margin-top:2px;">R.: ${esc(p.respuestaCorrecta)}</div>`
          : "";
      return `<div style="margin-bottom:8px;">
        <div style="font-size:11px;"><b>${esc(p.enunciado)}</b></div>
        <div style="font-size:10px;color:${PALETA.muted};">${TIPO_PREGUNTA_INFO[p.tipo].nombre} ·
          ${DIFICULTAD_INFO[p.dificultad].nombre} · ${p.puntaje} pts · ${esc(p.dcdCodigo)}</div>
        ${detalle}
      </div>`;
    })
    .join("");

  const filasAprendizaje = brechas
    .map((b) => {
      const nivel = nivelDominante(b);
      const info = ESTADO_APRENDIZAJE_INFO[nivel];
      const detalle = `${b.dominado} 🟢 · ${b.enProceso} 🟡 · ${b.requiereRefuerzo} 🔴`;
      return `<tr>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:11px;font-weight:700;">${esc(b.dcdCodigo)}</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:10px;">${esc(b.descripcion)}</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:10px;color:${info.color};font-weight:700;">${info.nombre}</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:10px;">${detalle}</td>
      </tr>`;
    })
    .join("");

  const recs = recomendaciones
    .map((r) => {
      const color = ESTADO_APRENDIZAJE_INFO[r.nivel].color;
      return `<div style="margin-bottom:8px;font-size:11px;">
        <b style="color:${color};">${esc(r.dcdCodigo)}</b>
        <div style="color:${PALETA.texto};margin-top:2px;">${esc(r.texto)}</div>
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Evaluación Diagnóstica</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:${PALETA.texto};margin:32px;">
  <div style="background:${PALETA.titulo};color:#fff;padding:14px 18px;border-radius:6px;">
    <div style="font-size:16px;font-weight:700;">📋 ${esc(ev.nombre)}</div>
    ${contexto}
  </div>

  <h3 style="color:${PALETA.titulo};margin-top:20px;margin-bottom:4px;border-bottom:2px solid ${PALETA.seccion};padding-bottom:4px;">Banco de preguntas (${ev.preguntas.length})</h3>
  ${preguntas}

  ${resultadosTabla(ev, conResultados)}
  ${aprendizajeTabla(ev, filasAprendizaje)}
  ${recomendaciones.length ? `<h3 style="color:${PALETA.titulo};margin-top:20px;border-bottom:2px solid ${PALETA.seccion};padding-bottom:4px;">Recomendaciones pedagógicas</h3>${recs}` : ""}

  <div style="margin-top:28px;font-size:9px;color:${PALETA.muted};border-top:1px solid ${PALETA.borde};padding-top:6px;">
    Documento generado con Planificadoc • Uso pedagógico exclusivo
  </div>
</body></html>`;
}

function tablaResultados(
  conResultados: { codigo: string; nombre?: string; puntaje: number; porcentaje: number }[],
  umbrales: { dominadoMin: number; refuerzoMax: number }
): string {
  if (!conResultados.length) return "";
  const filas = conResultados
    .map((r) => {
      const c = ESTADO_APRENDIZAJE_INFO[clasificarAprendizaje(r.porcentaje, umbrales)];
      return `<tr>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:11px;">${esc(r.codigo)}${r.nombre ? ` — ${esc(r.nombre)}` : ""}</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:11px;text-align:center;">${r.puntaje}</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:11px;text-align:center;">${r.porcentaje}%</td>
        <td style="padding:6px;border:1px solid ${PALETA.borde};font-size:11px;text-align:center;color:${c.color};font-weight:700;">${c.nombre}</td>
      </tr>`;
    })
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-top:8px;">
    <thead><tr>
      <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Estudiante</th>
      <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Puntaje</th>
      <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">%</th>
      <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Clasificación</th>
    </tr></thead><tbody>${filas}</tbody></table>`;
}

function resultadosTabla(
  ev: EvaluacionDiagnostica,
  conResultados: { codigo: string; nombre?: string; puntaje: number; porcentaje: number }[]
): string {
  if (!conResultados.length) return "";
  const evaluados = conResultados.length;
  const prom = (conResultados.reduce((s, r) => s + r.porcentaje, 0) / evaluados).toFixed(1);
  let nLogrado = 0, nEnProceso = 0, nRefuerzo = 0;
  for (const r of conResultados) {
    const c = clasificarAprendizaje(r.porcentaje, ev.umbrales);
    if (c === "dominado") nLogrado++;
    else if (c === "en_proceso") nEnProceso++;
    else nRefuerzo++;
  }
  return `<h3 style="color:${PALETA.titulo};margin-top:20px;border-bottom:2px solid ${PALETA.seccion};padding-bottom:4px;">
    Resultados (${evaluados} estudiantes) — Promedio ${prom}% ·
    <span style="color:${PALETA.verde};">${nLogrado} dominado</span> ·
    <span style="color:${PALETA.amarillo};">${nEnProceso} en proceso</span> ·
    <span style="color:${PALETA.rojo};">${nRefuerzo} refuerzo</span></h3>
    ${tablaResultados(conResultados, ev.umbrales)}`;
}

function aprendizajeTabla(ev: EvaluacionDiagnostica, filas: string): string {
  if (!ev.resultados.some((r) => r.respuestas.length > 0)) return "";
  return `<h3 style="color:${PALETA.titulo};margin-top:20px;border-bottom:2px solid ${PALETA.seccion};padding-bottom:4px;">Resultados por aprendizaje (DCD)</h3>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      <thead><tr>
        <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">DCD</th>
        <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Descripción</th>
        <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Nivel dominante del curso</th>
        <th style="padding:6px;border:1px solid ${PALETA.borde};background:${PALETA.encabezado};color:#fff;font-size:11px;">Distribución</th>
      </tr></thead><tbody>${filas}</tbody></table>`;
}

const LETRAS = ["a.", "b.", "c.", "d.", "e.", "f."];

/**
 * Genera el documento de la PRUEBA DIAGNÓSTICA lista para imprimir y entregar
 * a los estudiantes: encabezado institucional, campos del estudiante,
 * instrucciones, preguntas con espacio para responder y (opcional) clave de
 * respuestas para el docente. No incluye resultados ni brechas.
 */
export function generarHTMLPruebaImprimible(
  ev: EvaluacionDiagnostica,
  opts: { conClave?: boolean } = {}
): string {
  const conClave = opts.conClave ?? false;
  const area = AREAS_INFO[ev.area];

  const preguntas = ev.preguntas
    .map((p, idx) => {
      const cuerpo =
        p.tipo === "opcion_multiple" || p.tipo === "v_f"
          ? `<div class="opts ${p.tipo === "v_f" ? "vf" : ""}">${(p.opciones ?? [])
              .map((o, i) => {
                const marcaClave = conClave && o.esCorrecta ? " <span class='clave'>✔</span>" : "";
                return `<div class="op"><span class="circ"></span> ${LETRAS[i] ?? ""} ${esc(o.texto)}${marcaClave}</div>`;
              })
              .join("")}</div>`
          : p.tipo === "respuesta_corta"
            ? `<div class="lines"><div class="l"></div><div class="l"></div><div class="l"></div></div>`
            : `<div class="box"></div>`;

      const claveAbierta =
        conClave && (p.tipo === "respuesta_corta" || p.tipo === "ejercicio") && p.respuestaCorrecta
          ? `<div class="clave" style="margin-top:4px;font-size:11px;">R.: ${esc(p.respuestaCorrecta)}</div>`
          : "";

      return `<div class="q">
        <div class="enc"><span class="num">${idx + 1}.</span> ${esc(p.enunciado)}
          <span class="puntaje">(${p.puntaje} pt)</span></div>
        ${cuerpo}
        ${claveAbierta}
      </div>`;
    })
    .join("");

  const fechaHoy = ev.fecha
    ? esc(ev.fecha)
    : new Date().toLocaleDateString();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Prueba Diagnóstica</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Arial, sans-serif; color: #111827; margin: 0; }
  .header { text-align: center; border-bottom: 2px solid #003366; padding-bottom: 8px; margin-bottom: 12px; }
  .header .t1 { font-size: 20px; font-weight: 700; color: #003366; text-transform: uppercase; }
  .header .t2 { font-size: 14px; margin-top: 2px; font-weight: 600; }
  .header .t3 { font-size: 11px; color: #4b5563; margin-top: 2px; }
  .estudiante { display: flex; gap: 18px; font-size: 12px; margin-bottom: 10px; }
  .estudiante div { flex: 1; border-bottom: 1px solid #000; padding-bottom: 2px; }
  .instr { border: 1px solid #9ca3af; background: #f4f7fa; padding: 8px 10px; font-size: 12px; margin-bottom: 14px; }
  .q { margin-bottom: 16px; page-break-inside: avoid; }
  .q .enc { font-size: 13px; font-weight: 700; }
  .q .num { font-weight: 700; }
  .puntaje { float: right; font-size: 10px; color: #6b7280; font-weight: 400; }
  .opts { margin-top: 6px; padding-left: 16px; }
  .opts .op { font-size: 12.5px; margin-bottom: 5px; }
  .op .circ { display: inline-block; width: 12px; height: 12px; border: 1px solid #111; border-radius: 50%; margin-right: 7px; vertical-align: -1px; }
  .lines { margin-top: 6px; }
  .lines .l { border-bottom: 1px solid #c7c7c7; height: 26px; }
  .box { margin-top: 6px; border: 1px solid #9ca3af; min-height: 96px; padding: 6px; }
  .vf .op { display: inline-block; margin-right: 22px; }
  .clave { color: #16a34a; font-weight: 700; }
  .footer { margin-top: 18px; font-size: 10px; color: #9ca3af; border-top: 1px solid #d1d5db; padding-top: 6px; }
</style>
</head>
<body>
  <div class="header">
    <div class="t1">Evaluación Diagnóstica</div>
    <div class="t2">${esc(ev.nombre)}</div>
    <div class="t3">${area?.emoji ?? ""} ${esc(area?.name ?? ev.area)} · ${esc(SUBNIVEL_NAMES[ev.subnivel] ?? "Subnivel")} · ${esc(ev.grado)}${ev.paralelo ? ` · Paralelo ${esc(ev.paralelo)}` : ""}${ev.asignatura ? ` · ${esc(ev.asignatura)}` : ""} · ${esc(ev.anioLectivo)}</div>
    <div class="t3">Puntaje total: ${ev.puntajeTotal} · Duración: ${ev.duracionMinutos} minutos · Fecha: ${fechaHoy}</div>
  </div>

  <div class="estudiante">
    <div>Nombre del estudiante:</div>
    <div>Curso / Paralelo:</div>
    <div>Fecha:</div>
  </div>

  <div class="instr"><b>Instrucciones:</b> ${esc(ev.instrucciones || "Lee con atención cada pregunta antes de responder. Marca con una ✗ o escribe la respuesta en el espacio indicado. No uses lápiz en la sección de opciones.")}</div>

  ${preguntas}

  <div class="footer">Documento generado con Planificadoc · ${conClave ? "Clave de respuestas incluida (solo docente)" : "Uso pedagógico exclusivo"}</div>
</body></html>`;
}