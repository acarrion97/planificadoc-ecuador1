import React, { useState, useMemo, useRef } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { usePlanificacionesBT, type ModuloBTCombinado } from "@/lib/planificaciones-bt-context";
import { obtenerFiguraPorId, obtenerTodosLosModulos } from "@/data/bachillerato-tecnico";
import type {
  PlanUnidadTrabajoBT, UnidadCompetencia, ResultadoAprendizaje,
  Procedimiento, FaseProcedimiento, ContenidosBT, EstrategiaMetodologicaBT,
  ProcedimientoCriterioEvaluacion, UnidadTrabajoUnidadCompetencia, UnidadTrabajoResultadoAprendizaje,
} from "@/data/types-bt";
import { generarWordPlanBT } from "@/lib/bt-word-generator";
import { generarHTMLPlanBT } from "@/lib/pdf-generator";

const STEP_LABELS = ["Módulo", "Catálogo", "Competencia", "Unidad", "Generar", "Resultado"];

// ─── Sub-componentes (mismo patrón visual que adaptacion-curricular) ───────

function StepBar({ current, total, colors }: { current: number; total: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, flexDirection: "column", alignItems: "center", gap: 2 }}>
          <View style={{
            height: 4, width: "100%", borderRadius: 2,
            backgroundColor: i <= current ? colors.primary : colors.border,
          }} />
          <Text style={{ fontSize: 9, color: i === current ? colors.primary : colors.muted }}>
            {STEP_LABELS[i]}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SectionHeading({ text, colors }: { text: string; colors: any }) {
  return (
    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary, marginBottom: 8, marginTop: 4 }}>
      {text}
    </Text>
  );
}

function Field({
  label, value, onChangeText, colors, multiline = false, placeholder = "", keyboardType,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  colors: any; multiline?: boolean; placeholder?: string; keyboardType?: "numeric";
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 4 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        style={[styles.input, {
          borderColor: colors.border, color: colors.text, backgroundColor: colors.surface,
          minHeight: multiline ? 72 : 40, textAlignVertical: multiline ? "top" : "center",
        }]}
      />
    </View>
  );
}

// ─── Estado de la Unidad de Trabajo en construcción ────────────────────────

interface UTState {
  nombre: string;
  tiempoEstimadoPeriodos: string;
  procedimientos: Procedimiento[];
  contenidos: ContenidosBT;
  estrategiasMetodologicas: EstrategiaMetodologicaBT[];
}

const UT_EMPTY: UTState = {
  nombre: "", tiempoEstimadoPeriodos: "",
  procedimientos: [],
  contenidos: { conceptuales: [], procedimentales: [], actitudinales: [] },
  estrategiasMetodologicas: [],
};

export default function PlanificarBTScreen() {
  const { figuraId } = useLocalSearchParams<{ figuraId: string }>();
  const colors = useColors();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const { addPlanBT, guardarCatalogoUsuarioBT, obtenerCatalogoModulo, moduloTieneCatalogoCompleto } = usePlanificacionesBT();

  const figura = useMemo(() => obtenerFiguraPorId(figuraId), [figuraId]);
  const modulosEstaticos = useMemo(() => obtenerTodosLosModulos(figuraId), [figuraId]);

  const [step, setStep] = useState(0);
  const [selectedModuloCodigo, setSelectedModuloCodigo] = useState<string | null>(null);
  const moduloCombinado: ModuloBTCombinado | undefined = selectedModuloCodigo
    ? obtenerCatalogoModulo(figuraId, selectedModuloCodigo)
    : undefined;
  const catalogoCompleto = selectedModuloCodigo ? moduloTieneCatalogoCompleto(figuraId, selectedModuloCodigo) : false;

  // Paso "Completar catálogo" — mini-formulario cuando el módulo no tiene UC/RA
  const [catObjetivoModulo, setCatObjetivoModulo] = useState("");
  const [catUCTexto, setCatUCTexto] = useState("");
  const [catRATexto, setCatRATexto] = useState("");
  const [catCETexto, setCatCETexto] = useState(""); // una por línea

  // Selección de UC/RA para esta Unidad de Trabajo
  const [ucSeleccionadas, setUcSeleccionadas] = useState<string[]>([]);
  const [raSeleccionados, setRaSeleccionados] = useState<string[]>([]);

  // Datos institucionales / Unidad de Trabajo
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [curso, setCurso] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [anioLectivo, setAnioLectivo] = useState("2025-2026");
  const [ut, setUt] = useState<UTState>(UT_EMPTY);

  const [generateError, setGenerateError] = useState<string | null>(null);
  const [savedPlan, setSavedPlan] = useState<PlanUnidadTrabajoBT | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [procedimientoCriterioEvaluacion, setProcedimientoCriterioEvaluacion] = useState<ProcedimientoCriterioEvaluacion[]>([]);

  const generateMutation = trpc.bt.generateUnidadTrabajo.useMutation();

  function scrollTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function goTo(s: number) { setStep(s); scrollTop(); }

  // Criterios de evaluación/desempeño disponibles para la selección actual (UC + RA elegidos)
  const criteriosDisponibles = useMemo(() => {
    if (!moduloCombinado) return [] as { id: string; texto: string }[];
    const items: { id: string; texto: string }[] = [];
    for (const ra of moduloCombinado.resultadosAprendizaje || []) {
      if (raSeleccionados.includes(ra.id)) items.push(...ra.criteriosEvaluacion);
    }
    for (const uc of moduloCombinado.unidadesCompetencia) {
      if (!ucSeleccionadas.includes(uc.id)) continue;
      for (const ec of uc.elementosCompetencia || []) {
        items.push(...ec.criteriosDesempeno);
      }
    }
    return items;
  }, [moduloCombinado, raSeleccionados, ucSeleccionadas]);

  function toggleSeleccion(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function handleGuardarCatalogo() {
    if (!selectedModuloCodigo) return;
    if (!catUCTexto.trim() || !catRATexto.trim() || !catCETexto.trim()) {
      Alert.alert("Faltan datos", "Ingresa al menos el texto de la Unidad de Competencia, un Resultado de Aprendizaje y sus Criterios de Evaluación.");
      return;
    }
    const nuevaUC: UnidadCompetencia = {
      id: `USR-UC-${Date.now()}`,
      texto: catUCTexto.trim(),
    };
    const nuevoRA: ResultadoAprendizaje = {
      id: `USR-RA-${Date.now()}`,
      texto: catRATexto.trim(),
      criteriosEvaluacion: catCETexto
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((texto, i) => ({ id: `USR-CE-${Date.now()}-${i}`, texto })),
    };
    await guardarCatalogoUsuarioBT(
      figuraId,
      selectedModuloCodigo,
      { objetivoModulo: catObjetivoModulo.trim() || undefined, resultadosAprendizaje: [nuevoRA] },
      nuevaUC
    );
    goTo(2);
  }

  async function handleGenerate() {
    if (!moduloCombinado || criteriosDisponibles.length === 0) {
      setGenerateError("Selecciona al menos una Unidad de Competencia o Resultado de Aprendizaje con criterios.");
      return;
    }
    setGenerateError(null);
    try {
      const ucTexto = moduloCombinado.unidadesCompetencia
        .filter((u) => ucSeleccionadas.includes(u.id))
        .map((u) => u.texto)
        .join(" | ");
      const raTexto = (moduloCombinado.resultadosAprendizaje || [])
        .filter((r) => raSeleccionados.includes(r.id))
        .map((r) => r.texto)
        .join(" | ");

      const res = await generateMutation.mutateAsync({
        figuraNombre: figura?.nombre || "",
        moduloNombre: moduloCombinado.nombre,
        moduloObjetivo: moduloCombinado.objetivoModulo || moduloCombinado.descripcion,
        nivel: moduloCombinado.nivel,
        unidadCompetenciaTexto: ucTexto || undefined,
        resultadoAprendizajeTexto: raTexto || undefined,
        criteriosEvaluacion: criteriosDisponibles,
        nombreUnidadTrabajo: ut.nombre || moduloCombinado.nombre,
        tiempoEstimadoPeriodos: parseInt(ut.tiempoEstimadoPeriodos, 10) || 10,
        numProcedimientos: 3,
      });

      setUt((prev) => ({
        ...prev,
        procedimientos: res.procedimientos,
        contenidos: res.contenidos,
        estrategiasMetodologicas: res.estrategiasMetodologicas,
      }));
      setProcedimientoCriterioEvaluacion(res.procedimientoCriterioEvaluacion);
      goTo(5);
    } catch (err: any) {
      setGenerateError(err?.data?.message || err?.message || "Error de conexión. Intenta de nuevo.");
    }
  }

  function buildPlan(): PlanUnidadTrabajoBT {
    const now = new Date().toISOString();
    const utUC: UnidadTrabajoUnidadCompetencia[] = ucSeleccionadas.map((unidadCompetenciaId) => ({
      unidadTrabajoId: "UT-1", unidadCompetenciaId,
    }));
    const utRA: UnidadTrabajoResultadoAprendizaje[] = raSeleccionados.map((resultadoAprendizajeId) => ({
      unidadTrabajoId: "UT-1", resultadoAprendizajeId,
    }));
    return {
      id: savedPlan?.id ?? (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
      figuraProfesionalId: figuraId,
      moduloId: selectedModuloCodigo || "",
      institucion, docente, curso, paralelo, anioLectivo,
      nombreModuloFormativo: moduloCombinado?.nombre || "",
      objetivoModuloFormativo: moduloCombinado?.objetivoModulo || moduloCombinado?.descripcion || "",
      horasPedagogicas: ut.tiempoEstimadoPeriodos,
      unidadTrabajo: {
        id: "UT-1", numero: 1, nombre: ut.nombre,
        tiempoEstimadoPeriodos: parseInt(ut.tiempoEstimadoPeriodos, 10) || 0,
        contenidos: ut.contenidos,
        estrategiasMetodologicas: ut.estrategiasMetodologicas,
        procedimientos: ut.procedimientos,
      },
      unidadTrabajoUnidadCompetencia: utUC,
      unidadTrabajoResultadoAprendizaje: utRA,
      unidadTrabajoInstrumentoEvaluacion: [],
      procedimientoCriterioEvaluacion,
      createdAt: savedPlan?.createdAt ?? now,
      updatedAt: now,
    };
  }

  async function handleGuardar() {
    const plan = buildPlan();
    await addPlanBT(plan);
    setSavedPlan(plan);
    if (Platform.OS === "web") alert("Planificación BT guardada");
    else Alert.alert("Guardado", "Planificación BT guardada");
  }

  async function handleExportWord() {
    setExporting(true);
    try {
      const plan = savedPlan ?? buildPlan();
      const blob = await generarWordPlanBT(plan);
      const filename = `plan_unidad_trabajo_${plan.moduloId || "BT"}.docx`;
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
          dialogTitle: "Plan de Unidad de Trabajo BT",
        });
      }
    } catch (err: any) {
      Alert.alert("Error al exportar", err?.message ?? "No se pudo generar el documento.");
    } finally {
      setExporting(false);
    }
  }

  async function handleExportPDF() {
    setExportingPdf(true);
    try {
      const plan = savedPlan ?? buildPlan();
      const html = generarHTMLPlanBT(plan);
      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          setTimeout(() => win.print(), 500);
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: "Plan de Unidad de Trabajo BT",
        });
      }
    } catch (err: any) {
      Alert.alert("Error al exportar", err?.message ?? "No se pudo generar el PDF.");
    } finally {
      setExportingPdf(false);
    }
  }

  if (!figura) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: colors.muted }}>Figura profesional no encontrada</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 22, color: colors.primary }}>←</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>Planificar: {figura.nombre}</Text>
            <Text style={{ fontSize: 11, color: colors.muted }} numberOfLines={1}>Bachillerato Técnico</Text>
          </View>
        </View>

        <StepBar current={step} total={6} colors={colors} />

        {/* ── PASO 0: Módulo ── */}
        {step === 0 && (
          <View>
            <SectionHeading text="Selecciona el módulo formativo" colors={colors} />
            {modulosEstaticos.map((m) => {
              const sel = selectedModuloCodigo === m.codigo;
              return (
                <Pressable
                  key={m.codigo}
                  onPress={() => setSelectedModuloCodigo(m.codigo)}
                  style={{
                    borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 10,
                    borderColor: sel ? colors.primary : colors.border,
                    backgroundColor: sel ? colors.primary + "15" : colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "700", color: sel ? colors.primary : colors.text }}>{m.nombre}</Text>
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{m.categoria || "módulo"} · Año {m.anio}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── PASO 1: Catálogo (condicional) ── */}
        {step === 1 && (
          catalogoCompleto ? (
            <View>
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#16A34A" }}>
                <Text style={{ fontSize: 12, color: "#15803D" }}>✅ Este módulo ya tiene catálogo (Unidad de Competencia / Resultados de Aprendizaje). Puedes continuar.</Text>
              </View>
            </View>
          ) : (
            <View>
              <SectionHeading text="Completa el catálogo de este módulo" colors={colors} />
              <View style={{ backgroundColor: "#FEF3C7", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#F59E0B", marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: "#92400E" }}>
                  Aún no hay catálogo oficial cargado para este módulo. Ingresa (o pega desde el currículo oficial de tu figura)
                  la Unidad de Competencia, un Resultado de Aprendizaje y sus Criterios de Evaluación. Esto se guarda en tu
                  dispositivo y no vuelve a pedirse para este módulo.
                </Text>
              </View>
              <Field label="Objetivo del módulo (opcional)" value={catObjetivoModulo} onChangeText={setCatObjetivoModulo} colors={colors} multiline />
              <Field label="Unidad de Competencia" value={catUCTexto} onChangeText={setCatUCTexto} colors={colors} multiline placeholder="Ej: UC1: Aplicar..." />
              <Field label="Resultado de Aprendizaje" value={catRATexto} onChangeText={setCatRATexto} colors={colors} multiline placeholder="Ej: RA.1. Analizar..." />
              <Field label="Criterios de Evaluación (uno por línea)" value={catCETexto} onChangeText={setCatCETexto} colors={colors} multiline placeholder={"CE1.1: ...\nCE1.2: ..."} />
              <Pressable
                onPress={handleGuardarCatalogo}
                style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 4 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Guardar catálogo y continuar</Text>
              </Pressable>
            </View>
          )
        )}

        {/* ── PASO 2: Competencia (selección UC/RA) ── */}
        {step === 2 && moduloCombinado && (
          <View>
            <SectionHeading text="Unidad(es) de Competencia" colors={colors} />
            {moduloCombinado.unidadesCompetencia.length === 0 && (
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>Este módulo no tiene UC/EC/CD, solo Resultados de Aprendizaje (ver abajo).</Text>
            )}
            {moduloCombinado.unidadesCompetencia.map((uc) => {
              const sel = ucSeleccionadas.includes(uc.id);
              return (
                <Pressable
                  key={uc.id}
                  onPress={() => toggleSeleccion(ucSeleccionadas, setUcSeleccionadas, uc.id)}
                  style={{
                    borderWidth: 1.5, borderRadius: 10, padding: 10, marginBottom: 8,
                    borderColor: sel ? colors.primary : colors.border,
                    backgroundColor: sel ? colors.primary + "15" : colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.text }}>{uc.texto}</Text>
                  {(uc.elementosCompetencia || []).map((ec) => (
                    <Text key={ec.id} style={{ fontSize: 11, color: colors.muted, marginTop: 4, marginLeft: 8 }}>• {ec.texto}</Text>
                  ))}
                </Pressable>
              );
            })}

            <SectionHeading text="Resultado(s) de Aprendizaje" colors={colors} />
            {(moduloCombinado.resultadosAprendizaje || []).length === 0 && (
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>Este módulo no tiene RA/CE propios.</Text>
            )}
            {(moduloCombinado.resultadosAprendizaje || []).map((ra) => {
              const sel = raSeleccionados.includes(ra.id);
              return (
                <Pressable
                  key={ra.id}
                  onPress={() => toggleSeleccion(raSeleccionados, setRaSeleccionados, ra.id)}
                  style={{
                    borderWidth: 1.5, borderRadius: 10, padding: 10, marginBottom: 8,
                    borderColor: sel ? colors.primary : colors.border,
                    backgroundColor: sel ? colors.primary + "15" : colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.text }}>{ra.texto}</Text>
                </Pressable>
              );
            })}

            {criteriosDisponibles.length === 0 && (
              <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#F59E0B", marginTop: 4 }}>
                <Text style={{ fontSize: 11, color: "#92400E" }}>⚠️ Selecciona al menos una UC o RA para continuar.</Text>
              </View>
            )}
          </View>
        )}

        {/* ── PASO 3: Unidad de Trabajo ── */}
        {step === 3 && (
          <View>
            <SectionHeading text="Datos institucionales" colors={colors} />
            <Field label="Institución educativa" value={institucion} onChangeText={setInstitucion} colors={colors} />
            <Field label="Docente" value={docente} onChangeText={setDocente} colors={colors} />
            <Field label="Curso" value={curso} onChangeText={setCurso} colors={colors} placeholder="Ej: 1ro de Bachillerato" />
            <Field label="Paralelo" value={paralelo} onChangeText={setParalelo} colors={colors} placeholder="Ej: A" />
            <Field label="Año lectivo" value={anioLectivo} onChangeText={setAnioLectivo} colors={colors} />

            <SectionHeading text="Unidad de Trabajo" colors={colors} />
            <Field label="Nombre de la Unidad de Trabajo" value={ut.nombre} onChangeText={(v) => setUt((s) => ({ ...s, nombre: v }))} colors={colors} />
            <Field label="Tiempo estimado (periodos pedagógicos)" value={ut.tiempoEstimadoPeriodos} onChangeText={(v) => setUt((s) => ({ ...s, tiempoEstimadoPeriodos: v }))} colors={colors} keyboardType="numeric" />
          </View>
        )}

        {/* ── PASO 4: Generar ── */}
        {step === 4 && (
          <View>
            <SectionHeading text="Resumen" colors={colors} />
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
              <Text style={{ fontSize: 11, color: colors.muted }}>Módulo: <Text style={{ color: colors.text }}>{moduloCombinado?.nombre}</Text></Text>
              <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>Unidad de Trabajo: <Text style={{ color: colors.text }}>{ut.nombre || "—"}</Text></Text>
              <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>Criterios seleccionados: <Text style={{ color: colors.text }}>{criteriosDisponibles.length}</Text></Text>
            </View>

            <View style={{ backgroundColor: "#DBEAFE", borderRadius: 10, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: "#2563EB" }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#1D4ED8", marginBottom: 4 }}>🤖 La IA generará</Text>
              <Text style={{ fontSize: 11, color: "#1E3A8A" }}>
                Procedimientos con fases, recursos y criterios — anclados exclusivamente a los criterios de evaluación/desempeño
                seleccionados — más los contenidos y estrategias metodológicas de la Unidad de Trabajo.
              </Text>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center" }}
            >
              {generateMutation.isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Generando...</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>✨ Generar Unidad de Trabajo</Text>
              )}
            </Pressable>
            {generateMutation.isPending && (
              <Text style={{ fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 8 }}>Esto puede tomar entre 15 y 30 segundos...</Text>
            )}
            {generateError && (
              <View style={{ backgroundColor: "#FEE2E2", borderRadius: 10, padding: 14, marginTop: 14, borderWidth: 1, borderColor: "#FCA5A5" }}>
                <Text style={{ fontSize: 12, color: "#991B1B" }}>{generateError}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── PASO 5: Resultado ── */}
        {step === 5 && (
          <View>
            {ut.procedimientos.length === 0 ? (
              <Text style={{ fontSize: 12, color: colors.muted }}>No hay resultado aún. Vuelve al paso anterior.</Text>
            ) : (
              <>
                <View style={{ backgroundColor: "#DCFCE7", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#16A34A", marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#15803D" }}>✅ Unidad de Trabajo generada</Text>
                </View>

                {ut.procedimientos.map((p, i) => (
                  <View key={p.id} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: colors.surface }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>{i + 1}. {p.nombre}</Text>
                    <Text style={{ fontSize: 11, color: colors.text, marginTop: 4 }}>{p.objetivo}</Text>
                    <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>Tiempo: {p.tiempo}</Text>
                    {p.fases.map((f: FaseProcedimiento, fi) => (
                      <Text key={fi} style={{ fontSize: 11, color: colors.text, marginTop: 4 }}>• {f.nombre}: {f.descripcion}</Text>
                    ))}
                    {p.recursos.length > 0 && (
                      <Text style={{ fontSize: 10, color: colors.muted, marginTop: 6 }}>Recursos: {p.recursos.join(", ")}</Text>
                    )}
                    <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
                      Evaluación: {p.evaluacion.tecnica} — {p.evaluacion.instrumento}
                    </Text>
                  </View>
                ))}

                <SectionHeading text="Contenidos" colors={colors} />
                {(["conceptuales", "procedimentales", "actitudinales"] as const).map((k) => (
                  ut.contenidos[k].length > 0 && (
                    <View key={k} style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: colors.muted }}>{k.toUpperCase()}</Text>
                      {ut.contenidos[k].map((c, i) => <Text key={i} style={{ fontSize: 11, color: colors.text }}>• {c}</Text>)}
                    </View>
                  )
                ))}

                {ut.estrategiasMetodologicas.length > 0 && (
                  <>
                    <SectionHeading text="Estrategias metodológicas" colors={colors} />
                    {ut.estrategiasMetodologicas.map((e, i) => (
                      <Text key={i} style={{ fontSize: 11, color: colors.text, marginBottom: 4 }}>• {e.nombre}{e.descripcion ? `: ${e.descripcion}` : ""}</Text>
                    ))}
                  </>
                )}

                <Pressable
                  onPress={handleGuardar}
                  style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 16 }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{savedPlan ? "✓ Guardado — actualizar" : "Guardar planificación"}</Text>
                </Pressable>

                <Pressable
                  onPress={handleExportWord}
                  disabled={exporting}
                  style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                    backgroundColor: "#1E3A8A", borderRadius: 12, paddingVertical: 14, marginTop: 12,
                  }}
                >
                  {exporting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 18 }}>📄</Text>}
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{exporting ? "Generando Word..." : "Exportar como Word (.docx)"}</Text>
                </Pressable>

                <Pressable
                  onPress={handleExportPDF}
                  disabled={exportingPdf}
                  style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                    backgroundColor: "#7C2D12", borderRadius: 12, paddingVertical: 14, marginTop: 12,
                  }}
                >
                  {exportingPdf ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 18 }}>🖨️</Text>}
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{exportingPdf ? "Generando PDF..." : "Exportar como PDF"}</Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* Navegación */}
        {step < 5 && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20, marginBottom: 8 }}>
            {step > 0 && (
              <Pressable
                onPress={() => goTo(step - 1)}
                style={{ flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>← Anterior</Text>
              </Pressable>
            )}
            {step !== 4 && !(step === 1 && !catalogoCompleto) && (
              <Pressable
                onPress={() => {
                  if (step === 0 && !selectedModuloCodigo) {
                    Alert.alert("Selecciona un módulo", "Elige un módulo formativo para continuar.");
                    return;
                  }
                  if (step === 2 && criteriosDisponibles.length === 0) {
                    Alert.alert("Selecciona competencia", "Elige al menos una Unidad de Competencia o Resultado de Aprendizaje.");
                    return;
                  }
                  if (step === 3 && !ut.nombre.trim()) {
                    Alert.alert("Falta el nombre", "Ingresa el nombre de la Unidad de Trabajo.");
                    return;
                  }
                  goTo(step + 1);
                }}
                style={{ flex: 2, borderRadius: 10, paddingVertical: 12, alignItems: "center", backgroundColor: colors.primary }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Siguiente →</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
});
