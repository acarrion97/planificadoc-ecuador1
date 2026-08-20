/**
 * Detalle de una Evaluación Diagnóstica:
 *  - Aplicación: roster con códigos anónimos, registro de respuestas con
 *    inicio/fin y bloqueo de duplicados (nuevo intento autorizado).
 *  - Resultados individuales y por aprendizaje (umbrales configurables).
 *  - Dashboard, brechas y recomendaciones.
 *  - Exportación PDF / Word y exportación a un plan Conecta-Nivela-Crea.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { shareAsync } from "expo-sharing";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { AREAS_INFO, SUBNIVEL_NAMES } from "@/data";
import {
  ESTATUS_EVALUACION_INFO,
  ESTADO_APRENDIZAJE_INFO,
  TIPO_PREGUNTA_INFO,
  EstudianteEvaluacion,
  EvaluacionDiagnostica,
  RespuestaPregunta,
  ResultadoEstudiante,
} from "@/data/types-evaluacion";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import {
  calcularResultadoEstudiante,
  calcularBrechasCurso,
  generarRecomendaciones,
  estudiantesEvaluados,
  agruparBrechasPorOrigen,
} from "@/lib/evaluacion-utils";
import { ORIGEN_CURRICULAR_INFO } from "@/data/types-evaluacion";
import { obtenerNombreSubnivel } from "@/data";
import type { BrechaCurso } from "@/data/types-evaluacion";
import { generarHTMLEvaluacion, generarHTMLPruebaImprimible } from "@/lib/evaluacion-pdf-generator";
import { generarWordEvaluacion } from "@/lib/evaluacion-word-generator";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";
import type { PlanConectaNivelaCrea } from "@/data/types-cnc";
import { diagnosticoAcademicoDesdeBrechas, nivelDominanteEstado } from "@/lib/cnc-diagnostico";
import { trpc } from "@/lib/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";

function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Fila de una brecha por DCD. Muestra el subnivel de origen para que una
 * brecha de arrastre sea distinguible de una del nivel actual incluso fuera
 * de su grupo (p. ej. cuando la lista va sin agrupar).
 */
function FilaBrecha({
  brecha: b,
  colors,
}: {
  brecha: BrechaCurso;
  colors: ReturnType<typeof useColors>;
}) {
  const nivel = nivelDominanteEstado(b);
  const info = ESTADO_APRENDIZAJE_INFO[nivel];
  const subnivelTexto =
    b.subnivelOrigen !== null ? obtenerNombreSubnivel(b.subnivelOrigen) : "Nivel no determinado";
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{b.dcdCodigo}</Text>
        <Text style={{ fontSize: 11, color: colors.muted, flex: 1 }}>{b.descripcion}</Text>
        <Text style={{ fontSize: 11, fontWeight: "700", color: info.color }}>{info.nombre}</Text>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.background, overflow: "hidden", marginTop: 6 }}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View style={{ width: `${b.porcentajeDominio}%`, backgroundColor: "#16A34A" }} />
          <View style={{ width: `${Math.max(0, b.porcentajeDificultad)}%`, backgroundColor: "#D97706" }} />
        </View>
      </View>
      <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
        {subnivelTexto} · Prioridad {b.prioridad} · 🟢 {b.dominado} · 🟡 {b.enProceso} · 🔴 {b.requiereRefuerzo} · {b.porcentajeDominio}% dominio
      </Text>
    </View>
  );
}

function planCNCVacio(): PlanConectaNivelaCrea {
  return {
    id: nuevoId(),
    institucion: "", docente: "", anioLectivo: "2026-2027",
    grado: "", paralelo: "", subnivel: "", fechaInicio: "",
    modalidad: "general",
    semana1: {
      actividadesAdaptacion: [], diagnosticoAcademico: [], diagnosticoSocioemocional: [],
      coordinacionDece: "", tecnicasReflexion: [],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: {
      proyecto: {
        titulo: "", descripcion: "", areasIntegradas: [], objetivoAprendizaje: "",
        productoFinal: "", productoIntermedio: "", objetivoSemana4: "", objetivoSemana5: "",
        actividadesSemana4: [], actividadesSemana5: [], destrezasReforzadas: [],
        evidenciasCognitivas: [], evidenciasActitudinales: [], compromisos: "", autoevaluacion: [],
        esEvaluacionFormativaOficial: true,
      },
    },
    status: "borrador",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface DraftRespuesta { respuesta: string; correcta: boolean; }

export default function VerEvaluacionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { evaluaciones, updateEvaluacion } = useEvaluaciones();
  const { addPlanCNC } = usePlanificacionesCNC();
  const backupMutation = trpc.evaluacion.guardarBackup.useMutation();

  const [ev, setEv] = useState<EvaluacionDiagnostica | null>(null);
  const evRef = useRef<EvaluacionDiagnostica | null>(null);

  useEffect(() => {
    const found = evaluaciones.find((e) => e.id === id) ?? null;
    if (found) { evRef.current = found; setEv(found); }
  }, [id, evaluaciones]);

  function mutate(fn: (e: EvaluacionDiagnostica) => EvaluacionDiagnostica) {
    if (!evRef.current) return;
    const next = fn({ ...evRef.current });
    evRef.current = next;
    setEv(next);
    updateEvaluacion(next);
  }

  // ── Registro de respuestas ──
  const [registrandoId, setRegistrandoId] = useState<string | null>(null);
  const [bloqueadoId, setBloqueadoId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, DraftRespuesta>>({});
  const [draftInicio, setDraftInicio] = useState<string>("");

  // ── Roster ──
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [rosterError, setRosterError] = useState<string | null>(null);

  // ── Umbrales ──
  const [umbralDominado, setUmbralDominado] = useState("70");
  const [umbralRefuerzo, setUmbralRefuerzo] = useState("40");
  const [exportando, setExportando] = useState<"word" | "pdf" | "cnc" | null>(null);
  const [imprimiendoPrueba, setImprimiendoPrueba] = useState(false);
  const [pruebaConClave, setPruebaConClave] = useState(false);
  const [mostrarMaterias, setMostrarMaterias] = useState(false);
  const [imprimiendoPruebaDeId, setImprimiendoPruebaDeId] = useState<string | null>(null);

  useEffect(() => {
    if (ev) { setUmbralDominado(String(ev.umbrales.dominadoMin)); setUmbralRefuerzo(String(ev.umbrales.refuerzoMax)); }
  }, [ev?.id]);

  const promedios = useMemo(() => {
    if (!ev) return null;
    const conR = ev.resultados.filter((r) => r.respuestas.length > 0);
    if (!conR.length) return null;
    const prom = conR.reduce((s, r) => s + calcularResultadoEstudiante(ev, r).porcentaje, 0) / conR.length;
    let d = 0, p = 0, rf = 0;
    for (const r of conR) {
      const c = calcularResultadoEstudiante(ev, r).porcentaje;
      if (c >= ev.umbrales.dominadoMin) d++;
      else if (c < ev.umbrales.refuerzoMax) rf++;
      else p++;
    }
    return { promedio: Math.round(prom), dominado: d, enProceso: p, refuerzo: rf, total: conR.length };
  }, [ev]);

  // Evaluaciones de Lengua y Matemática agrupadas para imprimir pruebas desde
  // el selector de materias (mismo panel que el wizard CNC).
  const evaluacionesPorArea = useMemo(
    () =>
      (["LL", "M"] as const)
        .map((area) => ({
          area,
          nombre: AREAS_INFO[area]?.name ?? area,
          emoji: AREAS_INFO[area]?.emoji ?? "📘",
          items: evaluaciones.filter((e) => e.area === area),
        }))
        .filter((g) => g.items.length > 0),
    [evaluaciones]
  );

  if (!ev) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ padding: 24, alignItems: "center", gap: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>Evaluación no encontrada.</Text>
          <Pressable onPress={() => router.replace("/(tabs)/planes" as any)} style={[styles.btn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Volver a planes</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const estatus = ESTATUS_EVALUACION_INFO[ev.status];
  const evaluados = estudiantesEvaluados(ev);
  const brechas = calcularBrechasCurso(ev);
  const gruposBrechas = agruparBrechasPorOrigen(brechas);
  const recomendaciones = generarRecomendaciones(ev);

  function resultadoDe(est: EstudianteEvaluacion): ResultadoEstudiante | undefined {
    return evRef.current?.resultados.find((r) => r.estudianteId === est.id);
  }

  function openRegistro(est: EstudianteEvaluacion) {
    const res = resultadoDe(est);
    if (res && res.respuestas.length > 0 && !res.intentoPermitido) {
      setBloqueadoId(est.id);
      setRegistrandoId(null);
      return;
    }
    const base: Record<string, DraftRespuesta> = {};
    if (res) {
      for (const r of res.respuestas) base[r.preguntaId] = { respuesta: r.respuesta, correcta: r.correcta };
    }
    setDrafts(base);
    setDraftInicio(res?.inicio ?? new Date().toISOString());
    setBloqueadoId(null);
    setRegistrandoId(est.id);
  }

  function cerrarRegistro() {
    setRegistrandoId(null); setBloqueadoId(null); setDrafts({}); setDraftInicio("");
  }

  function permitirNuevoIntento(est: EstudianteEvaluacion) {
    mutate((e) => ({
      ...e,
      resultados: e.resultados.map((r) =>
        r.estudianteId === est.id ? { ...r, intentoPermitido: true } : r
      ),
    }));
    setBloqueadoId(null);
    openRegistro(est);
  }

  function marcarOpcion(preguntaId: string, opcionId: string, esCorrecta: boolean) {
    setDrafts((prev) => ({ ...prev, [preguntaId]: { respuesta: opcionId, correcta: esCorrecta } }));
  }

  function marcarTexto(preguntaId: string, texto: string, correcta?: boolean) {
    setDrafts((prev) => {
      const prevD = prev[preguntaId] ?? { respuesta: "", correcta: false };
      return {
        ...prev,
        [preguntaId]: { respuesta: texto, correcta: correcta ?? prevD.correcta },
      };
    });
  }

  function guardarRespuestas(est: EstudianteEvaluacion) {
    const e = evRef.current;
    if (!e) return;
    const respuestas: RespuestaPregunta[] = [];
    for (const p of e.preguntas) {
      const d = drafts[p.id];
      if (d && d.respuesta.trim() !== "") {
        respuestas.push({ preguntaId: p.id, respuesta: d.respuesta, correcta: d.correcta });
      }
    }
    const prev = resultadoDe(est);
    const now = new Date().toISOString();
    const nuevoResultado: ResultadoEstudiante = {
      estudianteId: est.id,
      respuestas,
      inicio: draftInicio || now,
      fin: now,
      intentoPermitido: prev ? true : false,
    };
    mutate((e) => ({
      ...e,
      status: e.status === "publicada" ? "aplicada" : e.status,
      resultados: [...e.resultados.filter((r) => r.estudianteId !== est.id), nuevoResultado],
    }));
    cerrarRegistro();
  }

  function agregarEstudiante() {
    setRosterError(null);
    const e = evRef.current;
    if (!e) return;
    const codigo = nuevoCodigo.trim();
    if (!codigo) { setRosterError("El código anónimo es obligatorio."); return; }
    if (e.estudiantes.some((x) => x.codigo.toLowerCase() === codigo.toLowerCase())) {
      setRosterError("Ese código ya está registrado."); return;
    }
    const est: EstudianteEvaluacion = {
      id: nuevoId(), codigo,
      nombre: nuevoNombre.trim() || undefined,
      incluirEnReportes: true,
    };
    mutate((e) => ({ ...e, estudiantes: [...e.estudiantes, est] }));
    setNuevoCodigo(""); setNuevoNombre("");
  }

  function eliminarEstudiante(est: EstudianteEvaluacion) {
    mutate((e) => ({
      ...e,
      estudiantes: e.estudiantes.filter((x) => x.id !== est.id),
      resultados: e.resultados.filter((r) => r.estudianteId !== est.id),
    }));
  }

  function aplicarUmbrales() {
    const d = Number(umbralDominado), r = Number(umbralRefuerzo);
    if (!d || d <= 0 || !r || r <= 0 || r >= d) {
      Alert.alert("Umbrales inválidos", "Dominado ≥ debe ser mayor que Refuerzo <.");
      return;
    }
    mutate((e) => ({ ...e, umbrales: { dominadoMin: d, refuerzoMax: r }, status: "analizada" }));
  }

  function cambiarEstatus(nuevo: "publicada" | "analizada") {
    mutate((e) => ({ ...e, status: nuevo }));
  }

  async function sessionId(): Promise<string> {
    let sid = await AsyncStorage.getItem("@planificadoc_device_id");
    if (!sid) {
      sid = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      await AsyncStorage.setItem("@planificadoc_device_id", sid);
    }
    return sid;
  }

  async function backup() {
    const e = evRef.current;
    if (!e) return;
    try {
      const sid = await sessionId();
      await backupMutation.mutateAsync({ sessionId: sid, status: e.status, form: JSON.stringify(e) });
    } catch (e) { console.warn("[evaluacion] backup failed (non-critical):", e); }
  }

  async function handleExport(formato: "word" | "pdf") {
    const e = evRef.current;
    if (!e) return;
    setExportando(formato);
    try {
      if (formato === "word") {
        const blob = await generarWordEvaluacion(e);
        const filename = `evaluacion_diagnostica_${e.grado.replace(/\W+/g, "_") || "evaluacion"}.docx`;
        if (Platform.OS === "web") {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = filename;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          const uri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
          await shareAsync(uri, {
            UTI: ".docx",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            dialogTitle: "Evaluación Diagnóstica",
          });
        }
      } else {
        const html = generarHTMLEvaluacion(e);
        if (Platform.OS === "web") {
          const w = window.open("", "_blank");
          if (w) { w.document.write(html); w.document.close(); w.print(); }
        } else {
          const { printToFileAsync } = await import("expo-print");
          const { uri } = await printToFileAsync({ html });
          await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf", dialogTitle: "Evaluación Diagnóstica" });
        }
      }
      await backup();
    } catch (err: any) {
      Alert.alert("Error al exportar", err?.message ?? "No se pudo generar el documento.");
    } finally {
      setExportando(null);
    }
  }

  async function imprimirHTMLPrueba(ev: EvaluacionDiagnostica) {
    const html = generarHTMLPruebaImprimible(ev, { conClave: pruebaConClave });
    if (Platform.OS === "web") {
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
    } else {
      const { printToFileAsync } = await import("expo-print");
      const { uri } = await printToFileAsync({ html });
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf", dialogTitle: "Prueba Diagnóstica" });
    }
  }

  async function imprimirPrueba() {
    const e = evRef.current;
    if (!e) return;
    setImprimiendoPrueba(true);
    try {
      await imprimirHTMLPrueba(e);
    } catch (err: any) {
      Alert.alert("Error al imprimir", err?.message ?? "No se pudo generar la prueba.");
    } finally {
      setImprimiendoPrueba(false);
    }
  }

  async function imprimirPruebaDe(ev: EvaluacionDiagnostica) {
    setImprimiendoPruebaDeId(ev.id);
    try {
      await imprimirHTMLPrueba(ev);
    } catch (err: any) {
      Alert.alert("Error al imprimir", err?.message ?? "No se pudo generar la prueba.");
    } finally {
      setImprimiendoPruebaDeId(null);
    }
  }

  // ── Exportación a Conecta-Nivela-Crea ──
  const cncDisponible = (ev.area === "LL" || ev.area === "M") && evaluados.length > 0;

  async function exportarACNC() {
    if (!cncDisponible) return;
    const confirmar = () => exportarACNCConfirmado();
    if (Platform.OS === "web") {
      if (confirm("Crear un plan Conecta-Nivela-Crea con el diagnóstico académico de esta evaluación? Las DCD diagnosticadas se copiarán a la Semana 1 (áreas LL/M).")) confirmar();
    } else {
      Alert.alert("Exportar a CNC", "Crear un plan Conecta-Nivela-Crea con el diagnóstico de esta evaluación?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Crear plan", onPress: confirmar },
      ]);
    }
  }

  async function exportarACNCConfirmado() {
    const e = evRef.current;
    if (!e) return;
    setExportando("cnc");
    try {
      const diagnostico = diagnosticoAcademicoDesdeBrechas(brechas, e.area as "LL" | "M");
      const plan = planCNCVacio();
      plan.grado = e.grado;
      plan.paralelo = e.paralelo;
      plan.subnivel = SUBNIVEL_NAMES[e.subnivel] ?? "";
      plan.fechaInicio = e.fecha;
      plan.anioLectivo = e.anioLectivo;
      plan.semana1 = { ...plan.semana1, diagnosticoAcademico: diagnostico };
      await addPlanCNC(plan);
      await backup();
      router.replace("/conecta-nivela-crea" as any);
    } catch (err: any) {
      Alert.alert("Error al exportar a CNC", err?.message ?? "No se pudo crear el plan.");
    } finally {
      setExportando(null);
    }
  }

  const registrando = ev.estudiantes.find((s) => s.id === registrandoId) ?? null;
  const bloqueado = ev.estudiantes.find((s) => s.id === bloqueadoId) ?? null;

  return (
    <ScreenContainer className="flex-1">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Pressable onPress={() => router.replace("/(tabs)/planes" as any)} style={{ padding: 4 }}>
          <Text style={{ fontSize: 22, color: colors.text }}>‹</Text>
        </Pressable>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: colors.foreground }} numberOfLines={1}>
          {ev.nombre}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: "700", color: estatus.color }}>{estatus.nombre}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}>
        {/* Contexto */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ fontSize: 13, color: colors.text, fontWeight: "600" }}>
            {AREAS_INFO[ev.area]?.emoji ?? ""} {AREAS_INFO[ev.area]?.name ?? ev.area} · {SUBNIVEL_NAMES[ev.subnivel]} · {ev.grado} {ev.paralelo ? `· ${ev.paralelo}` : ""}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
            {ev.asignatura || "Sin asignatura"} · {ev.anioLectivo} · Puntaje total {ev.puntajeTotal} · {ev.duracionMinutos} min
          </Text>
          {ev.instrucciones ? <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>{ev.instrucciones}</Text> : null}
        </View>

        {/* Acciones */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {ev.status === "borrador" && (
            <Pressable onPress={() => cambiarEstatus("publicada")} style={[styles.chipBtn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Publicar</Text>
            </Pressable>
          )}
          {ev.status === "aplicada" && evaluados.length > 0 && (
            <Pressable onPress={() => cambiarEstatus("analizada")} style={[styles.chipBtn, { backgroundColor: "#16A34A" }]}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>✓ Marcar analizada</Text>
            </Pressable>
          )}
          <Pressable onPress={() => imprimirPrueba()} disabled={imprimiendoPrueba}
            style={[styles.chipBtn, { backgroundColor: "#1D4ED8", opacity: imprimiendoPrueba ? 0.5 : 1 }]}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{imprimiendoPrueba ? "..." : "🖨️ Imprimir prueba"}</Text>
          </Pressable>
          <Pressable onPress={() => setMostrarMaterias((v) => !v)}
            style={[styles.chipBtn, { backgroundColor: mostrarMaterias ? "#1D4ED8" : colors.surface, borderWidth: 1, borderColor: "#1D4ED8" }]}>
            <Text style={{ color: mostrarMaterias ? "#fff" : "#1D4ED8", fontSize: 12, fontWeight: "700" }}>
              {mostrarMaterias ? "Ocultar materias" : "🖨️ Pruebas Lengua/Matemática"}
            </Text>
          </Pressable>
          <Pressable onPress={() => setPruebaConClave((v) => !v)}
            style={[styles.chipBtn, { backgroundColor: pruebaConClave ? colors.primary : colors.surface, borderWidth: 1, borderColor: pruebaConClave ? colors.primary : colors.border }]}>
            <Text style={{ color: pruebaConClave ? "#fff" : colors.text, fontSize: 12, fontWeight: "600" }}>
              {pruebaConClave ? "✔ Clave de respuestas" : "Clave de respuestas"}
            </Text>
          </Pressable>
          <Pressable onPress={() => handleExport("pdf")} disabled={exportando !== null}
            style={[styles.chipBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, opacity: exportando === "pdf" ? 0.5 : 1 }]}>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>{exportando === "pdf" ? "..." : "PDF"}</Text>
          </Pressable>
          <Pressable onPress={() => handleExport("word")} disabled={exportando !== null}
            style={[styles.chipBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, opacity: exportando === "word" ? 0.5 : 1 }]}>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>{exportando === "word" ? "..." : "Word"}</Text>
          </Pressable>
          <Pressable onPress={exportarACNC} disabled={!cncDisponible || exportando !== null}
            style={[styles.chipBtn, { backgroundColor: "#0F766E", opacity: cncDisponible ? (exportando === "cnc" ? 0.5 : 1) : 0.4 }]}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{exportando === "cnc" ? "..." : "→ CNC"}</Text>
          </Pressable>
        </View>
        {!cncDisponible && (ev.area !== "LL" && ev.area !== "M" ? (
          <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>La exportación a CNC solo aplica a evaluaciones de Lengua y Literatura o Matemática.</Text>
        ) : evaluados.length === 0 ? (
          <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>Registra respuestas para poder exportar el diagnóstico a un plan CNC.</Text>
        ) : null)}

        {/* Selector de pruebas por materia (Lengua y Matemática) */}
        {mostrarMaterias && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, flex: 1, marginBottom: 0 }]}>
                Pruebas para imprimir (Lengua y Matemática)
              </Text>
              <Pressable onPress={() => setPruebaConClave((v) => !v)}
                style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: pruebaConClave ? colors.primary : colors.background, borderWidth: 1, borderColor: pruebaConClave ? colors.primary : colors.border }}>
                <Text style={{ fontSize: 11, color: pruebaConClave ? "#fff" : colors.text, fontWeight: "600" }}>
                  {pruebaConClave ? "✔ Clave de respuestas" : "Clave de respuestas"}
                </Text>
              </Pressable>
            </View>

            {evaluacionesPorArea.length === 0 ? (
              <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", paddingVertical: 12 }}>
                No hay evaluaciones de Lengua y Literatura o Matemática. Crea una desde el wizard CNC.
              </Text>
            ) : (
              evaluacionesPorArea.map((grupo) => (
                <View key={grupo.area} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Text style={{ fontSize: 14 }}>{grupo.emoji}</Text>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{grupo.nombre}</Text>
                    <Text style={{ fontSize: 11, color: colors.muted }}>({grupo.items.length})</Text>
                  </View>
                  {grupo.items.map((item) => {
                    const aplicadosItem = estudiantesEvaluados(item).length;
                    return (
                      <View key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, marginBottom: 6 }}>
                        <Pressable onPress={() => router.replace(`/ver-evaluacion/${item.id}` as any)} style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }} numberOfLines={1}>{item.nombre}</Text>
                          <Text style={{ fontSize: 10, color: colors.muted }}>{item.grado} {item.paralelo ? `· ${item.paralelo}` : ""} · {aplicadosItem} aplicado(s)</Text>
                        </Pressable>
                        <Pressable onPress={() => router.replace(`/ver-evaluacion/${item.id}` as any)}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                          <Text style={{ fontSize: 11, color: colors.text, fontWeight: "600" }}>Ver</Text>
                        </Pressable>
                        <Pressable onPress={() => imprimirPruebaDe(item)} disabled={imprimiendoPruebaDeId === item.id}
                          style={{ padding: 8, borderRadius: 8, backgroundColor: "#1D4ED8", opacity: imprimiendoPruebaDeId === item.id ? 0.5 : 1 }}>
                          <Text style={{ fontSize: 14, color: "#fff" }}>{imprimiendoPruebaDeId === item.id ? "..." : "🖨️"}</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))
            )}
          </View>
        )}

        {/* Dashboard */}
        {promedios && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Resumen del curso</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              {[
                { label: "Evaluados", value: promedios.total, color: colors.text },
                { label: "Promedio", value: `${promedios.promedio}%`, color: colors.primary },
                { label: "🟢", value: promedios.dominado, color: ESTADO_APRENDIZAJE_INFO.dominado.color },
                { label: "🟡", value: promedios.enProceso, color: ESTADO_APRENDIZAJE_INFO.en_proceso.color },
                { label: "🔴", value: promedios.refuerzo, color: ESTADO_APRENDIZAJE_INFO.requiere_refuerzo.color },
              ].map((x) => (
                <View key={x.label} style={{ flex: 1, alignItems: "center", padding: 8, borderRadius: 10, backgroundColor: colors.background }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: x.color }}>{x.value}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>{x.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Umbrales */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Umbrales de clasificación</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: colors.muted }}>Dominado ≥ (%)</Text>
              <TextInput value={umbralDominado} onChangeText={setUmbralDominado} keyboardType="numeric"
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: colors.muted }}>Refuerzo &lt; (%)</Text>
              <TextInput value={umbralRefuerzo} onChangeText={setUmbralRefuerzo} keyboardType="numeric"
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]} />
            </View>
          </View>
          <Pressable onPress={aplicarUmbrales} style={[styles.smallBtn, { backgroundColor: colors.primary, alignSelf: "flex-start", marginTop: 8 }]}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Recalcular con estos umbrales</Text>
          </Pressable>
          <Text style={{ fontSize: 10, color: colors.muted, marginTop: 6 }}>Al recalcular la evaluación pasa a estado "Analizada".</Text>
        </View>

        {/* Roster + registro */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Estudiantes ({ev.estudiantes.length})</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput value={nuevoCodigo} onChangeText={setNuevoCodigo} placeholder="Código anónimo*"
              placeholderTextColor={colors.muted} style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]} />
            <TextInput value={nuevoNombre} onChangeText={setNuevoNombre} placeholder="Nombre (opcional)"
              placeholderTextColor={colors.muted} style={[styles.input, { flex: 1.4, borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]} />
          </View>
          {rosterError && <Text style={{ color: "#DC2626", fontSize: 11, marginTop: 4 }}>{rosterError}</Text>}
          <Pressable onPress={agregarEstudiante} style={[styles.smallBtn, { backgroundColor: colors.primary, alignSelf: "flex-start", marginTop: 8 }]}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>＋ Agregar estudiante</Text>
          </Pressable>

          {ev.estudiantes.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {ev.estudiantes.map((est) => {
                const res = resultadoDe(est);
                const calc = res ? calcularResultadoEstudiante(ev, res) : null;
                const aplicado = res && res.respuestas.length > 0;
                return (
                  <View key={est.id} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, marginBottom: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ flex: 1, fontSize: 13, fontWeight: "700", color: colors.foreground }}>{est.codigo}</Text>
                      {aplicado && calc ? (
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {calc.puntaje}/{calc.puntajeMaximo} ({calc.porcentaje}%)
                        </Text>
                      ) : (
                        <Text style={{ fontSize: 12, color: colors.muted }}>Sin evaluar</Text>
                      )}
                      <Pressable onPress={() => eliminarEstudiante(est)} style={{ padding: 4 }}>
                        <Text style={{ fontSize: 14 }}>🗑️</Text>
                      </Pressable>
                    </View>
                    {est.nombre ? <Text style={{ fontSize: 11, color: colors.muted }}>{est.nombre}</Text> : null}
                    {!aplicado && (
                      <Pressable onPress={() => openRegistro(est)} style={[styles.smallBtn, { backgroundColor: colors.primary, marginTop: 8, alignSelf: "flex-start" }]}>
                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Registrar respuestas</Text>
                      </Pressable>
                    )}
                    {aplicado && res && !res.intentoPermitido && (
                      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>Evaluado el {res.fin ? new Date(res.fin).toLocaleString() : ""}. Para repetir, autoriza un nuevo intento.</Text>
                    )}
                    {aplicado && res && (
                      <Pressable onPress={() => openRegistro(est)} style={[styles.smallBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: 8, alignSelf: "flex-start" }]}>
                        <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>{res.intentoPermitido ? "Editar / nuevo intento" : "Permitir nuevo intento"}</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Bloqueo por duplicado */}
        {bloqueado && !registrando && (
          <View style={[styles.card, { backgroundColor: "#DC262610", borderColor: "#DC2626" }]}>
            <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "700" }}>Registro duplicado detectado</Text>
            <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
              El estudiante {bloqueado.codigo} ya tiene respuestas registradas. Confirma si deseas registrar un nuevo intento.
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <Pressable onPress={() => setBloqueadoId(null)} style={[styles.smallBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={() => permitirNuevoIntento(bloqueado)} style={[styles.smallBtn, { backgroundColor: "#DC2626" }]}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Autorizar nuevo intento</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Formulario de respuestas */}
        {registrando && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: "700", color: colors.foreground }}>Registrar respuestas — {registrando.codigo}</Text>
              <Pressable onPress={cerrarRegistro} style={{ padding: 4 }}>
                <Text style={{ fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>
            <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>Las preguntas de opción se corrigen automáticamente; texto libre y ejercicios los marca el docente.</Text>

            {ev.preguntas.map((p, idx) => {
              const d = drafts[p.id];
              const activa = (d && d.respuesta.trim() !== "") || false;
              return (
                <View key={p.id} style={{ marginBottom: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                    <Text style={{ fontSize: 12, color: colors.muted, width: 22 }}>{idx + 1}.</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, color: colors.text }}>{p.enunciado}</Text>
                      <Text style={{ fontSize: 10, color: colors.muted, marginTop: 2 }}>
                        {TIPO_PREGUNTA_INFO[p.tipo].nombre} · {p.dcdCodigo} · {p.puntaje} pt
                      </Text>
                    </View>
                  </View>

                  {(p.tipo === "opcion_multiple" || p.tipo === "v_f") && (
                    <View style={{ marginTop: 8, gap: 6 }}>
                      {p.opciones?.map((op) => {
                        const sel = d?.respuesta === op.id;
                        return (
                          <Pressable key={op.id} onPress={() => marcarOpcion(p.id, op.id, op.esCorrecta)}
                            style={[styles.optionRow, { borderColor: sel ? colors.primary : colors.border, backgroundColor: sel ? `${colors.primary}18` : colors.surface }]}>
                            <Text style={{ fontSize: 14 }}>{sel ? "🔵" : "⚪"}</Text>
                            <Text style={{ flex: 1, fontSize: 13, color: colors.text }}>{op.texto}</Text>
                            {sel && (op.esCorrecta ? <Text style={{ fontSize: 14 }}>✔️</Text> : <Text style={{ fontSize: 14 }}>❌</Text>)}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  {(p.tipo === "respuesta_corta" || p.tipo === "ejercicio") && (
                    <View style={{ marginTop: 8 }}>
                      <TextInput
                        value={d?.respuesta ?? ""}
                        onChangeText={(t) => marcarTexto(p.id, t)}
                        placeholder="Respuesta del estudiante"
                        placeholderTextColor={colors.muted}
                        multiline
                        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, minHeight: 60, textAlignVertical: "top" }]}
                      />
                      <Pressable
                        onPress={() => marcarTexto(p.id, d?.respuesta ?? "", !(d?.correcta ?? false))}
                        style={[styles.smallBtn, { backgroundColor: d?.correcta ? "#16A34A" : colors.surface, borderWidth: 1, borderColor: d?.correcta ? "#16A34A" : colors.border, marginTop: 6, alignSelf: "flex-start" }]}>
                        <Text style={{ color: d?.correcta ? "#fff" : colors.text, fontSize: 12, fontWeight: "700" }}>
                          {d?.correcta ? "✓ Correcta" : "Marcar como correcta"}
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {activa && (
                    <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={{ fontSize: 11, color: d?.correcta ? "#16A34A" : "#DC2626", fontWeight: "700" }}>
                        {d?.correcta ? "Correcta" : "Incorrecta / sin corregir"}
                      </Text>
                      {p.retroalimentacion ? (
                        <Text style={{ fontSize: 10, color: colors.muted, flex: 1 }} numberOfLines={1}>💡 {p.retroalimentacion}</Text>
                      ) : null}
                    </View>
                  )}
                </View>
              );
            })}

            <Pressable onPress={() => guardarRespuestas(registrando)} style={[styles.btn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>Guardar respuestas y finalizar</Text>
            </Pressable>
          </View>
        )}

        {/* Resultados por aprendizaje, agrupados por origen curricular */}
        {brechas.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Resultados por aprendizaje</Text>
            {gruposBrechas.agrupar ? (
              <>
                {/* El arrastre va primero: es la brecha más urgente y la que
                    justifica nivelar antes de avanzar con el nivel actual. */}
                {(["arrastre", "nivel_actual", "no_determinado"] as const).map((origen) => {
                  const lista =
                    origen === "arrastre"
                      ? gruposBrechas.arrastre
                      : origen === "nivel_actual"
                      ? gruposBrechas.nivelActual
                      : gruposBrechas.noDeterminado;
                  if (lista.length === 0) return null;
                  return (
                    <View key={origen} style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 12, fontWeight: "800", color: colors.foreground, marginBottom: 2 }}>
                        {ORIGEN_CURRICULAR_INFO[origen].nombre}
                      </Text>
                      <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 8 }}>
                        {ORIGEN_CURRICULAR_INFO[origen].descripcion}
                      </Text>
                      {lista.map((b) => (
                        <FilaBrecha key={b.dcdCodigo} brecha={b} colors={colors} />
                      ))}
                    </View>
                  );
                })}
              </>
            ) : (
              brechas.map((b) => <FilaBrecha key={b.dcdCodigo} brecha={b} colors={colors} />)
            )}
          </View>
        )}

        {/* Recomendaciones */}
        {recomendaciones.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recomendaciones pedagógicas</Text>
            {recomendaciones.map((r) => (
              <View key={r.dcdCodigo} style={{ marginBottom: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: ESTADO_APRENDIZAJE_INFO[r.nivel].color }}>
                  {r.dcdCodigo} — {r.dcdDescripcion}
                </Text>
                <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{r.texto}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, minHeight: 40 },
  smallBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" },
  chipBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" },
  btn: { borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 8, borderWidth: 1 },
});