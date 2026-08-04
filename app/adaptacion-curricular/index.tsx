import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shareAsync } from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import {
  TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO,
  type CurricularAdaptation, type CurricularAdaptationForm,
  type AdaptacionAiResult, type AdaptacionCurricular, type TipoNEE, type GradoAdaptacion,
} from "@/data/types";
import { TODAS_LAS_DESTREZAS } from "@/data";
import { generarWordAdaptacion } from "@/lib/adaptacion-word-generator";
import { usePlanificaciones } from "@/lib/planificaciones-context";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "@planificadoc_adaptaciones";

const TIPOS_NEE_LIST = Object.entries(TIPOS_NEE_INFO).map(([id, info]) => ({
  id: id as TipoNEE,
  ...info,
}));

const ESTILOS_APRENDIZAJE = ["Visual", "Auditivo", "Lecto-escritor", "Kinestesico", "Multimodal"];

const STEP_LABELS = ["Identificacion", "Grado", "Perfil", "Generar", "Resultado"];

const GRADOS_POR_SUBNIVEL: Record<number, string[]> = {
  0: ["Grupo 1 (3 años)", "Grupo 2 (4 años)"],
  1: ["1.° Grado EGB"],
  2: ["2.° EGB", "3.° EGB", "4.° EGB"],
  3: ["5.° EGB", "6.° EGB", "7.° EGB"],
  4: ["8.° EGB", "9.° EGB", "10.° EGB"],
  5: ["1.° BGU", "2.° BGU", "3.° BGU"],
};

// ─── Form vacío ───────────────────────────────────────────────────────────────

const FORM_EMPTY: CurricularAdaptationForm = {
  institucion: "", docente: "", anioLectivo: "2025-2026",
  area: "", subnivel: 3, grado: "", paralelo: "",
  periodoPedagogico: "", trimestre: "",
  codigoEstudiante: "", codigoDestreza: "", descripcionDestreza: "",
  gradoAdaptacion: 1, tipoNEE: "tdah",
  estiloAprendizaje: "Visual",
  fortalezas: "", desafios: "", apoyosDisponibles: "",
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

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

function Label({ text, colors }: { text: string; colors: any }) {
  return <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 4 }}>{text}</Text>;
}

function Field({
  label, value, onChangeText, colors, multiline = false, placeholder = "",
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  colors: any; multiline?: boolean; placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label text={label} colors={colors} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, {
          borderColor: colors.border, color: colors.text,
          backgroundColor: colors.surface,
          minHeight: multiline ? 72 : 40,
          textAlignVertical: multiline ? "top" : "center",
        }]}
      />
    </View>
  );
}

function ChipGroup<T extends string>({
  options, selected, onSelect, colors, getLabel,
}: {
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
  colors: any;
  getLabel?: (v: T) => string;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onSelect(opt)}
          style={{
            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
            backgroundColor: selected === opt ? colors.primary : colors.surface,
            borderWidth: 1, borderColor: selected === opt ? colors.primary : colors.border,
          }}
        >
          <Text style={{ fontSize: 12, color: selected === opt ? "#fff" : colors.text }}>
            {getLabel ? getLabel(opt) : opt}
          </Text>
        </Pressable>
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

function DestrezaBuscador({
  value, onSelect, colors,
}: {
  value: string; onSelect: (codigo: string, desc: string) => void; colors: any;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<typeof TODAS_LAS_DESTREZAS>([]);

  function search(text: string) {
    setQuery(text);
    if (text.length < 3) { setResults([]); return; }
    const q = text.toLowerCase();
    setResults(
      TODAS_LAS_DESTREZAS.filter(
        (d) => d.codigo.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q)
      ).slice(0, 6)
    );
  }

  return (
    <View style={{ marginBottom: 12 }}>
      <Label text="Buscar destreza (codigo o descripcion)" colors={colors} />
      <TextInput
        value={query}
        onChangeText={search}
        placeholder="Ej: M.3.1.5 o fracciones..."
        placeholderTextColor={colors.muted}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
      />
      {results.map((d) => (
        <Pressable
          key={d.codigo}
          onPress={() => {
            onSelect(d.codigo, d.descripcion);
            setQuery(`${d.codigo} — ${d.descripcion.slice(0, 60)}`);
            setResults([]);
          }}
          style={{
            padding: 10, borderWidth: 1, borderColor: colors.border,
            borderRadius: 8, marginTop: 4, backgroundColor: colors.surface,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>{d.codigo}</Text>
          <Text style={{ fontSize: 11, color: colors.text }} numberOfLines={2}>{d.descripcion}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function AdaptacionCurricularScreen() {
  const colors = useColors();
  const router = useRouter();
  const { semanaId } = useLocalSearchParams<{ semanaId?: string }>();
  const scrollRef = useRef<ScrollView>(null);

  const { getSemana, updateSemana } = usePlanificaciones();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CurricularAdaptationForm>(() => {
    if (semanaId) {
      const s = getSemana(semanaId);
      if (s) {
        return {
          ...FORM_EMPTY,
          institucion: s.institucion || "",
          docente: s.docente || "",
          grado: s.grado || "",
          paralelo: s.paralelo || "",
          trimestre: s.trimestre || "",
          periodoPedagogico: s.periodoPedagogico || "",
        };
      }
    }
    return FORM_EMPTY;
  });
  const [aiResult, setAiResult] = useState<AdaptacionAiResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [vinculada, setVinculada] = useState(false);

  const generateMutation = trpc.adaptaciones.generate.useMutation();

  function setField<K extends keyof CurricularAdaptationForm>(key: K, val: CurricularAdaptationForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function scrollTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function nextStep() { setStep((s) => s + 1); scrollTop(); }
  function prevStep() { setStep((s) => s - 1); scrollTop(); }

  function validateStep(): string | null {
    if (step === 0) {
      if (!form.grado) return "Selecciona el grado o curso.";
      if (!form.descripcionDestreza || form.descripcionDestreza.length < 10)
        return "Describe la destreza con al menos 10 caracteres.";
    }
    if (step === 2) {
      if (!form.fortalezas || form.fortalezas.length < 10)
        return "Describe las fortalezas del estudiante.";
      if (!form.desafios || form.desafios.length < 10)
        return "Describe los desafios del estudiante.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) { Alert.alert("Dato requerido", err); return; }
    nextStep();
  }

  async function handleGenerate() {
    let sessionId = await AsyncStorage.getItem("@planificadoc_device_id");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      await AsyncStorage.setItem("@planificadoc_device_id", sessionId);
    }

    try {
      const res = await generateMutation.mutateAsync({ form, sessionId });
      setAiResult(res.aiResult);
      const id = await saveLocally(res.aiResult, sessionId);
      if (semanaId) {
        await linkToSemana(res.aiResult, id);
      }
      nextStep();
    } catch (err: any) {
      Alert.alert("Error al generar", err?.message ?? "Intenta de nuevo.");
    }
  }

  async function linkToSemana(result: AdaptacionAiResult, adaptacionId: string) {
    if (!semanaId) return;
    const semana = getSemana(semanaId);
    if (!semana) return;

    const neeInfo = TIPOS_NEE_INFO[form.tipoNEE];
    const nueva: AdaptacionCurricular = {
      id: adaptacionId,
      codigoEstudiante: form.codigoEstudiante || "E-001",
      incluirEnExportacion: true,
      codigoDestreza: form.codigoDestreza,
      descripcionDestreza: form.descripcionDestreza,
      gradoAdaptacion: form.gradoAdaptacion,
      categoriaNecesidad: neeInfo?.nombre ?? form.tipoNEE,
      tipoNecesidad: form.tipoNEE,
      descripcionNecesidad: result.perfilNEE?.descripcion,
      destrezaAdaptada: result.destrezaAdaptada ?? undefined,
      criterioAdaptado: result.criterioAdaptado ?? undefined,
      indicadoresAdaptados: result.indicadoresAdaptados ?? [],
      adaptacionesAcceso: result.adaptacionesAcceso ?? [],
      adaptacionesProceso: result.adaptacionesProceso ?? [],
      adaptacionesResultado: result.adaptacionesResultado ?? [],
      metodologiasSugeridas: result.metodologiasSugeridas ?? [],
      recursosEspecificos: result.recursosEspecificos ?? [],
      seguimiento: result.seguimiento ?? undefined,
      observaciones: result.observaciones ?? undefined,
      createdAt: new Date().toISOString(),
    };

    const adaptaciones = [...(semana.adaptacionesCurriculares || []), nueva];
    await updateSemana({ ...semana, adaptacionesCurriculares: adaptaciones });
    setVinculada(true);
  }

  async function saveLocally(result: AdaptacionAiResult, sessionId: string): Promise<string> {
    const id = savedId ?? (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    setSavedId(id);

    const record: CurricularAdaptation = {
      id,
      sessionId,
      form,
      aiResult: result,
      version: 1,
      status: "generated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const all: CurricularAdaptation[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((a) => a.id === id);
    if (idx >= 0) all[idx] = record; else all.unshift(record);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return id;
  }

  async function handleExportWord() {
    if (!aiResult) return;
    setExporting(true);
    try {
      const adaptation: CurricularAdaptation = {
        id: savedId ?? "temp",
        sessionId: "local",
        form,
        aiResult,
        version: 1,
        status: "generated",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const blob = await generarWordAdaptacion(adaptation);
      const filename = `adaptacion_${form.codigoEstudiante || "E001"}_grado${form.gradoAdaptacion}.docx`;

      if (Platform.OS === "web") {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const uri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
        await shareAsync(uri, {
          UTI: ".docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          dialogTitle: `Adaptacion Curricular — ${form.codigoEstudiante || "E001"}`,
        });
      }
    } catch (err: any) {
      Alert.alert("Error al exportar", err?.message ?? "No se pudo generar el documento.");
    } finally {
      setExporting(false);
    }
  }

  const gradoInfo = GRADO_ADAPTACION_INFO[form.gradoAdaptacion];

  return (
    <ScreenContainer>
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Pressable
            onPress={() => semanaId ? router.replace({ pathname: "/ver-semana/[id]", params: { id: semanaId } }) : router.back()}
            style={{ marginRight: 12 }}
          >
            <Text style={{ fontSize: 22, color: colors.primary }}>←</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>Adaptacion Curricular</Text>
            {semanaId && (
              <Text style={{ fontSize: 11, color: colors.muted }}>Vinculando a planificación semanal</Text>
            )}
          </View>
        </View>

        <StepBar current={step} total={5} colors={colors} />

        {/* ── PASO 0: Identificacion ── */}
        {step === 0 && (
          <View>
            <SectionHeading text="Contexto pedagogico" colors={colors} />
            <Field label="Institucion educativa" value={form.institucion} onChangeText={(v) => setField("institucion", v)} colors={colors} />
            <Field label="Docente" value={form.docente} onChangeText={(v) => setField("docente", v)} colors={colors} />
            <Field label="Año lectivo" value={form.anioLectivo} onChangeText={(v) => setField("anioLectivo", v)} colors={colors} />

            <View style={{ marginBottom: 12 }}>
              <Label text="Grado / Curso" colors={colors} />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {Object.values(GRADOS_POR_SUBNIVEL).flat().map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setField("grado", g)}
                    style={{
                      paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
                      backgroundColor: form.grado === g ? colors.primary : colors.surface,
                      borderWidth: 1, borderColor: form.grado === g ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: form.grado === g ? "#fff" : colors.text }}>{g}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Field label="Paralelo" value={form.paralelo} onChangeText={(v) => setField("paralelo", v)} colors={colors} placeholder="Ej: A" />
            <Field label="Periodo pedagogico" value={form.periodoPedagogico} onChangeText={(v) => setField("periodoPedagogico", v)} colors={colors} />
            <Field label="Trimestre" value={form.trimestre} onChangeText={(v) => setField("trimestre", v)} colors={colors} placeholder="Ej: 1.° trimestre" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Codigo del estudiante (anonimo)" colors={colors} />
            <View style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 }}>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                🔒 No se requiere el nombre real. Usa un codigo interno (Ej: E-05, EST-2024-03). Este documento es confidencial y de uso pedagogico exclusivo.
              </Text>
            </View>
            <Field label="Codigo del estudiante" value={form.codigoEstudiante} onChangeText={(v) => setField("codigoEstudiante", v)} colors={colors} placeholder="Ej: E-05" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Destreza a adaptar" colors={colors} />
            <DestrezaBuscador
              value={form.codigoDestreza}
              onSelect={(codigo, desc) => {
                setField("codigoDestreza", codigo);
                setField("descripcionDestreza", desc);
              }}
              colors={colors}
            />
            <Field
              label="Descripcion de la destreza (editable)"
              value={form.descripcionDestreza}
              onChangeText={(v) => setField("descripcionDestreza", v)}
              colors={colors}
              multiline
              placeholder="Escribe o pega aqui la destreza completa..."
            />
            {form.codigoDestreza ? (
              <Text style={{ fontSize: 10, color: colors.primary, marginTop: -8, marginBottom: 12 }}>
                Codigo: {form.codigoDestreza}
              </Text>
            ) : null}
          </View>
        )}

        {/* ── PASO 1: Grado de adaptacion ── */}
        {step === 1 && (
          <View>
            <SectionHeading text="Selecciona el grado de adaptacion curricular" colors={colors} />
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 16 }}>
              El grado determina que elementos del curriculo se modifican.
            </Text>

            {([1, 2, 3] as GradoAdaptacion[]).map((g) => {
              const info = GRADO_ADAPTACION_INFO[g];
              const bgColor = g === 1 ? "#DCFCE7" : g === 2 ? "#FED7AA" : "#FEE2E2";
              const borderColor = g === 1 ? "#16A34A" : g === 2 ? "#D97706" : "#DC2626";
              const isSelected = form.gradoAdaptacion === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setField("gradoAdaptacion", g)}
                  style={{
                    borderWidth: 2, borderColor: isSelected ? borderColor : colors.border,
                    borderRadius: 12, padding: 14, marginBottom: 12,
                    backgroundColor: isSelected ? bgColor : colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "700", color: borderColor, marginBottom: 4 }}>
                    {info.nombre}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>{info.descripcion}</Text>
                  {isSelected && (
                    <Text style={{ fontSize: 10, color: borderColor, fontWeight: "600", marginTop: 6 }}>
                      ✓ Seleccionado
                    </Text>
                  )}
                </Pressable>
              );
            })}

            <View style={{
              backgroundColor: colors.surface, borderRadius: 10, padding: 12,
              borderWidth: 1, borderColor: colors.border, marginTop: 4,
            }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.text, marginBottom: 6 }}>
                ¿Que genera la IA segun el grado?
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 3 }}>• Grado 1: Adaptaciones de acceso unicamente</Text>
              <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 3 }}>• Grado 2: Acceso + proceso + destreza simplificada</Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>• Grado 3: Acceso + proceso + resultado + destreza, criterio e indicadores modificados</Text>
            </View>
          </View>
        )}

        {/* ── PASO 2: Perfil pedagogico ── */}
        {step === 2 && (
          <View>
            <SectionHeading text="Tipo de NEE" colors={colors} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {TIPOS_NEE_LIST.map((nee) => (
                <Pressable
                  key={nee.id}
                  onPress={() => setField("tipoNEE", nee.id)}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 4,
                    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
                    backgroundColor: form.tipoNEE === nee.id ? colors.primary : colors.surface,
                    borderWidth: 1, borderColor: form.tipoNEE === nee.id ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{nee.emoji}</Text>
                  <Text style={{ fontSize: 11, color: form.tipoNEE === nee.id ? "#fff" : colors.text }}>
                    {nee.nombre}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
            <SectionHeading text="Estilo de aprendizaje predominante" colors={colors} />
            <ChipGroup
              options={ESTILOS_APRENDIZAJE}
              selected={form.estiloAprendizaje}
              onSelect={(v) => setField("estiloAprendizaje", v)}
              colors={colors}
            />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
            <SectionHeading text="Perfil pedagogico" colors={colors} />
            <View style={{
              backgroundColor: "#DCFCE7", borderRadius: 10, padding: 10,
              borderWidth: 1, borderColor: "#16A34A", marginBottom: 12,
            }}>
              <Text style={{ fontSize: 11, color: "#15803D", fontWeight: "600" }}>💡 Tip</Text>
              <Text style={{ fontSize: 11, color: "#15803D" }}>
                Describe en terminos pedagogicos: que sabe hacer bien el estudiante, en que necesita mas apoyo, y con que recursos cuenta en el aula.
              </Text>
            </View>
            <Field
              label="Fortalezas del estudiante *"
              value={form.fortalezas}
              onChangeText={(v) => setField("fortalezas", v)}
              colors={colors}
              multiline
              placeholder="Ej: Comprende bien explicaciones visuales, muestra interes en actividades practicas..."
            />
            <Field
              label="Desafios del estudiante *"
              value={form.desafios}
              onChangeText={(v) => setField("desafios", v)}
              colors={colors}
              multiline
              placeholder="Ej: Dificultad para mantener atencion por mas de 10 minutos, le cuesta seguir instrucciones largas..."
            />
            <Field
              label="Apoyos disponibles en el aula"
              value={form.apoyosDisponibles}
              onChangeText={(v) => setField("apoyosDisponibles", v)}
              colors={colors}
              multiline
              placeholder="Ej: Docente de apoyo 2 horas semanales, tableta disponible, apoyo del DECE..."
            />
          </View>
        )}

        {/* ── PASO 3: Generar ── */}
        {step === 3 && (
          <View>
            <SectionHeading text="Resumen de la adaptacion" colors={colors} />

            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
              <SummaryRow label="Destreza" value={`[${form.codigoDestreza}] ${form.descripcionDestreza.slice(0, 80)}${form.descripcionDestreza.length > 80 ? "..." : ""}`} colors={colors} />
              <SummaryRow label="Grado/Curso" value={form.grado} colors={colors} />
              <SummaryRow label="Grado de adaptacion" value={gradoInfo.nombre} colors={colors} />
              <SummaryRow label="Tipo de NEE" value={`${TIPOS_NEE_INFO[form.tipoNEE]?.emoji ?? ""} ${TIPOS_NEE_INFO[form.tipoNEE]?.nombre ?? form.tipoNEE}`} colors={colors} />
              <SummaryRow label="Estilo aprendizaje" value={form.estiloAprendizaje} colors={colors} />
              <SummaryRow label="Codigo estudiante" value={form.codigoEstudiante || "E-001"} colors={colors} />
            </View>

            <View style={{ backgroundColor: "#DBEAFE", borderRadius: 10, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: "#2563EB" }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#1D4ED8", marginBottom: 4 }}>
                🤖 ¿Que generara la IA?
              </Text>
              <Text style={{ fontSize: 11, color: "#1E3A8A" }}>
                {form.gradoAdaptacion === 1 && "• Perfil pedagogico\n• Adaptaciones de acceso (metodologia, recursos, organizacion)\n• Metodologias sugeridas y recursos especificos\n• Plan de seguimiento"}
                {form.gradoAdaptacion === 2 && "• Perfil pedagogico\n• Destreza levemente adaptada + criterio e indicadores simplificados\n• Adaptaciones de acceso y de proceso\n• Metodologias, recursos y plan de seguimiento"}
                {form.gradoAdaptacion === 3 && "• Perfil pedagogico\n• Destreza significativamente adaptada + criterio e indicadores modificados\n• Adaptaciones de acceso, proceso y resultado\n• Metodologias, recursos y plan de seguimiento"}
              </Text>
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              style={{
                backgroundColor: colors.primary, borderRadius: 12,
                paddingVertical: 16, alignItems: "center",
              }}
            >
              {generateMutation.isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Generando adaptacion...</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  ✨ Generar Adaptacion Curricular
                </Text>
              )}
            </Pressable>

            {generateMutation.isPending && (
              <Text style={{ fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 8 }}>
                Esto puede tomar entre 15 y 30 segundos...
              </Text>
            )}
          </View>
        )}

        {/* ── PASO 4: Resultado ── */}
        {step === 4 && aiResult && (
          <>
            {vinculada && semanaId && (
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#16A34A", marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 18 }}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#15803D" }}>Vinculada a la planificación semanal</Text>
                  <Text style={{ fontSize: 11, color: "#166534" }}>Aparecerá en el tab "ADAPT." al volver.</Text>
                </View>
              </View>
            )}
            <ResultadoEditable
              aiResult={aiResult}
              form={form}
              colors={colors}
              onExport={handleExportWord}
              exporting={exporting}
            />
          </>
        )}

        {/* Botones de navegacion */}
        {step < 4 && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20, marginBottom: 8 }}>
            {step > 0 && step !== 3 && (
              <Pressable
                onPress={prevStep}
                style={{
                  flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center",
                  borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>← Anterior</Text>
              </Pressable>
            )}
            {step < 3 && (
              <Pressable
                onPress={handleNext}
                style={{ flex: 2, borderRadius: 10, paddingVertical: 12, alignItems: "center", backgroundColor: colors.primary }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Siguiente →</Text>
              </Pressable>
            )}
            {step === 3 && (
              <Pressable
                onPress={prevStep}
                style={{
                  flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center",
                  borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>← Volver</Text>
              </Pressable>
            )}
          </View>
        )}

        {step === 4 && (
          <View style={{ marginTop: 20, gap: 12 }}>
            {semanaId && (
              <Pressable
                onPress={() => router.replace({ pathname: "/ver-semana/[id]", params: { id: semanaId! } })}
                style={{ backgroundColor: "#4A1942", borderRadius: 10, paddingVertical: 13, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>← Volver a la planificación</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => { setStep(0); setAiResult(null); setForm(FORM_EMPTY); setSavedId(null); setVinculada(false); }}
              style={{ alignItems: "center" }}
            >
              <Text style={{ fontSize: 12, color: colors.primary, textDecorationLine: "underline" }}>
                + Nueva adaptacion
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────

function SummaryRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted, width: 130 }}>{label}:</Text>
      <Text style={{ fontSize: 11, color: colors.text, flex: 1 }} numberOfLines={3}>{value || "—"}</Text>
    </View>
  );
}

// ─── Resultado editable ───────────────────────────────────────────────────────

function ResultadoEditable({
  aiResult, form, colors, onExport, exporting,
}: {
  aiResult: AdaptacionAiResult;
  form: CurricularAdaptationForm;
  colors: any;
  onExport: () => void;
  exporting: boolean;
}) {
  const neeInfo = TIPOS_NEE_INFO[form.tipoNEE as TipoNEE];
  const gradoInfo = GRADO_ADAPTACION_INFO[form.gradoAdaptacion];
  const gradoColor = form.gradoAdaptacion === 1 ? "#16A34A" : form.gradoAdaptacion === 2 ? "#D97706" : "#DC2626";

  return (
    <View>
      <View style={{
        backgroundColor: "#DCFCE7", borderRadius: 12, padding: 14,
        borderWidth: 1, borderColor: "#16A34A", marginBottom: 16,
      }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#15803D" }}>
          ✅ Adaptacion generada exitosamente
        </Text>
        <Text style={{ fontSize: 11, color: "#166534", marginTop: 4 }}>
          {neeInfo?.emoji ?? ""} {neeInfo?.nombre ?? form.tipoNEE} • {gradoInfo.nombre}
        </Text>
      </View>

      <Pressable
        onPress={onExport}
        disabled={exporting}
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "center",
          gap: 8, backgroundColor: "#1E3A8A", borderRadius: 12,
          paddingVertical: 14, marginBottom: 20,
        }}
      >
        {exporting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={{ fontSize: 20 }}>📄</Text>
        )}
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
          {exporting ? "Generando Word..." : "Exportar como Word (.docx)"}
        </Text>
      </Pressable>

      {/* Perfil NEE */}
      <ResultSection title="Perfil pedagogico del estudiante" emoji="👤" color={colors.primary}>
        <Text style={{ fontSize: 12, color: colors.text, marginBottom: 8 }}>{aiResult.perfilNEE.descripcion}</Text>
        <BulletGroup title="Fortalezas" items={aiResult.perfilNEE.fortalezas} color="#16A34A" colors={colors} />
        <BulletGroup title="Desafios" items={aiResult.perfilNEE.desafios} color="#D97706" colors={colors} />
        <BulletGroup title="Apoyos" items={aiResult.perfilNEE.apoyos} color={colors.primary} colors={colors} />
      </ResultSection>

      {/* Destreza */}
      <ResultSection title="Destreza con Criterio de Desempeno" emoji="📚" color={colors.primary}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, fontWeight: "700", color: colors.muted }}>ORIGINAL</Text>
          <Text style={{ fontSize: 12, color: colors.text }}>[{form.codigoDestreza}] {aiResult.destrezaOriginal.descripcion}</Text>
        </View>
        {aiResult.destrezaAdaptada ? (
          <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: gradoColor, marginBottom: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: gradoColor }}>ADAPTADA (Grado {form.gradoAdaptacion})</Text>
            <Text style={{ fontSize: 12, color: colors.text }}>{aiResult.destrezaAdaptada}</Text>
          </View>
        ) : null}
        {aiResult.criterioAdaptado ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: colors.muted, marginBottom: 4 }}>CRITERIO ADAPTADO</Text>
            <Text style={{ fontSize: 12, color: colors.text }}>{aiResult.criterioAdaptado}</Text>
          </View>
        ) : null}
        {aiResult.indicadoresAdaptados?.length ? (
          <BulletGroup title="Indicadores adaptados" items={aiResult.indicadoresAdaptados} color={gradoColor} colors={colors} />
        ) : null}
      </ResultSection>

      {/* Adaptaciones de acceso */}
      <ResultSection title="Adaptaciones de Acceso" emoji="🔓" color="#1A3A5C">
        {aiResult.adaptacionesAcceso.map((a, i) => (
          <AdaptacionCard key={i} item={a} colors={colors} />
        ))}
      </ResultSection>

      {/* Adaptaciones de proceso */}
      {aiResult.adaptacionesProceso?.length ? (
        <ResultSection title="Adaptaciones de Proceso" emoji="⚙️" color="#B45309">
          {aiResult.adaptacionesProceso.map((a, i) => (
            <AdaptacionCard key={i} item={a} colors={colors} />
          ))}
        </ResultSection>
      ) : null}

      {/* Adaptaciones de resultado */}
      {aiResult.adaptacionesResultado?.length ? (
        <ResultSection title="Adaptaciones de Resultado / Evaluacion" emoji="📊" color="#B91C1C">
          {aiResult.adaptacionesResultado.map((a, i) => (
            <AdaptacionCard key={i} item={a} colors={colors} />
          ))}
        </ResultSection>
      ) : null}

      {/* Metodologias */}
      <ResultSection title="Metodologias activas sugeridas" emoji="🎯" color={colors.primary}>
        <BulletGroup title="" items={aiResult.metodologiasSugeridas} color={colors.primary} colors={colors} />
      </ResultSection>

      {/* Recursos */}
      <ResultSection title="Recursos especificos de apoyo" emoji="🛠️" color={colors.primary}>
        <BulletGroup title="" items={aiResult.recursosEspecificos} color={colors.primary} colors={colors} />
      </ResultSection>

      {/* Seguimiento */}
      <ResultSection title="Plan de seguimiento" emoji="📅" color={colors.primary}>
        <Text style={{ fontSize: 12, color: colors.text }}>{aiResult.seguimiento}</Text>
      </ResultSection>

      {aiResult.observaciones ? (
        <ResultSection title="Observaciones" emoji="📝" color={colors.primary}>
          <Text style={{ fontSize: 12, color: colors.text }}>{aiResult.observaciones}</Text>
        </ResultSection>
      ) : null}
    </View>
  );
}

function ResultSection({
  title, emoji, color, children,
}: { title: string; emoji: string; color: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16, borderWidth: 1, borderColor: color + "40", borderRadius: 12, overflow: "hidden" }}>
      <View style={{ backgroundColor: color + "18", paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: color + "30" }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color }}>
          {emoji} {title}
        </Text>
      </View>
      <View style={{ padding: 12 }}>{children}</View>
    </View>
  );
}

function BulletGroup({ title, items, color, colors }: { title: string; items: string[]; color: string; colors: any }) {
  if (!items?.length) return null;
  return (
    <View style={{ marginBottom: 8 }}>
      {title ? <Text style={{ fontSize: 10, fontWeight: "700", color, marginBottom: 4 }}>{title.toUpperCase()}</Text> : null}
      {items.map((item, i) => (
        <Text key={i} style={{ fontSize: 12, color: colors.text, marginBottom: 2 }}>• {item}</Text>
      ))}
    </View>
  );
}

function AdaptacionCard({ item, colors }: { item: { categoria: string; descripcion: string; estrategias: string[] }; colors: any }) {
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary, marginBottom: 2 }}>{item.categoria}</Text>
      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>{item.descripcion}</Text>
      {item.estrategias.map((e, i) => (
        <Text key={i} style={{ fontSize: 11, color: colors.text, marginBottom: 2 }}>• {e}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 13,
  },
});
