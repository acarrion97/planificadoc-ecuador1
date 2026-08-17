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