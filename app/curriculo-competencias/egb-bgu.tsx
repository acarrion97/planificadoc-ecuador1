import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { codigosCompetenciasActivas } from "@/data/competencias-transversales";

type PasoFlujo = "datos" | "dcd" | "estructura" | "evaluacion";

const PASOS: { key: PasoFlujo; label: string }[] = [
  { key: "datos", label: "Datos" },
  { key: "dcd", label: "DCD" },
  { key: "estructura", label: "Estrategia" },
  { key: "evaluacion", label: "Evaluación" },
];

const COMPETENCIAS = codigosCompetenciasActivas();

const NIVELES = ["EGB", "BGU"] as const;
const GRADOS = ["1ro", "2do", "3ro", "4to", "5to", "6to", "7mo", "8vo", "9no", "10mo"];
const PARALELOS = ["A", "B", "C", "D", "E"];
const TRIMESTRES = ["Primer Trimestre", "Segundo Trimestre", "Tercer Trimestre"];

export default function EGBBGUFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const [paso, setPaso] = useState<PasoFlujo>("datos");

  // ── Estado del formulario ──
  const [nivel, setNivel] = useState<"EGB" | "BGU">("EGB");
  const [grado, setGrado] = useState("3ro");
  const [paralelo, setParalelo] = useState("A");
  const [asignatura, setAsignatura] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [periodoPedagogico, setPeriodoPedagogico] = useState("");
  const [trimestre, setTrimestre] = useState("Primer Trimestre");
  const [fecha, setFecha] = useState("");

  // DCD
  const [dcdCodigo, setDcdCodigo] = useState("");
  const [dcdDescripcion, setDcdDescripcion] = useState("");
  const [competencias, setCompetencias] = useState<string[]>(["C"]);
  const [indicadorEvaluacion, setIndicadorEvaluacion] = useState("");
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState("");

  // Estrategia
  const [estrategiaId, setEstrategiaId] = useState("erca");
  const [recursos, setRecursos] = useState("");

  // Evaluación
  const [tecnicaEvaluacion, setTecnicaEvaluacion] = useState("");
  const [instrumentoEvaluacion, setInstrumentoEvaluacion] = useState("");
  const [actividadesEvaluacion, setActividadesEvaluacion] = useState("");

  // ── Mutations ──
  const utils = trpc.useContext();
  const createMutation = trpc.curriculoCompetencias.createEGBBGU.useMutation({
    onSuccess: (result) => {
      if (Platform.OS === "web") {
        alert("Planificación creada correctamente");
      } else {
        Alert.alert("Éxito", "Planificación creada correctamente");
      }
      utils.curriculoCompetencias.list.invalidate();
      router.back();
    },
    onError: (error) => {
      if (Platform.OS === "web") {
        alert(`Error: ${error.message}`);
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });

  const toggleCompetencia = (code: string) => {
    setCompetencias((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    createMutation.mutate({
      sessionId: "default",
      nivel,
      grado,
      paralelo,
      asignatura,
      institucion,
      docente,
      periodoPedagogico,
      trimestre,
      fecha,
      dcd: dcdCodigo ? { codigo: dcdCodigo, descripcion: dcdDescripcion } : undefined,
      competencias,
      indicadorEvaluacion,
      objetivoAprendizaje,
      estrategiaId,
      recursos,
      tecnicaEvaluacion,
      instrumentoEvaluacion,
      actividadesEvaluacion,
    });
  };

  const canAdvance = () => {
    if (paso === "datos") return !!asignatura && !!institucion;
    if (paso === "dcd") return !!dcdCodigo;
    return true;
  };

  const advancePaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx < PASOS.length - 1) setPaso(PASOS[idx + 1].key);
  };

  const retreatPaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx > 0) setPaso(PASOS[idx - 1].key);
  };

  // ── Render helpers ──

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        {title}
      </Text>
    </View>
  );

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { placeholder?: string; multiline?: boolean; keyboard?: "default" | "numeric" } = {}
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={opts.placeholder || label}
        placeholderTextColor={colors.muted + "80"}
        multiline={opts.multiline}
        numberOfLines={opts.multiline ? 3 : 1}
        keyboardType={opts.keyboard || "default"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: opts.multiline ? "top" : "center",
            minHeight: opts.multiline ? 70 : 44,
          },
        ]}
      />
    </View>
  );

  const renderSelectRow = (
    label: string,
    options: readonly string[],
    value: string,
    onChange: (v: string) => void
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View style={styles.selectRow}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.selectChip,
              {
                backgroundColor: value === opt ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: value === opt ? "#fff" : colors.foreground,
                fontSize: 13,
                fontWeight: value === opt ? "600" : "400",
              }}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // ── Paso: Datos informativos ──
  const renderDatos = () => (
    <View>
      {renderSectionHeader("Datos Informativos", "📋")}
      {renderSelectRow("Nivel", NIVELES, nivel, setNivel as (v: string) => void)}
      {renderSelectRow("Grado", GRADOS, grado, setGrado)}
      {renderSelectRow("Paralelo", PARALELOS, paralelo, setParalelo)}
      {renderField("Asignatura", asignatura, setAsignatura, {
        placeholder: "Ej: Matemática",
      })}
      {renderField("Institución", institucion, setInstitucion, {
        placeholder: "Ej: Unidad Educativa San Martín",
      })}
      {renderField("Docente", docente, setDocente, {
        placeholder: "Nombre del docente",
      })}
      {renderField("Período Pedagógico", periodoPedagogico, setPeriodoPedagogico, {
        placeholder: "Ej: 2026-2027",
      })}
      {renderSelectRow("Trimestre", TRIMESTRES, trimestre, setTrimestre)}
      {renderField("Fecha", fecha, setFecha, { placeholder: "YYYY-MM-DD" })}
    </View>
  );

  // ── Paso: DCD y competencias ──
  const renderDCD = () => (
    <View>
      {renderSectionHeader("DCD y Competencias", "🎯")}
      {renderField("Código DCD", dcdCodigo, setDcdCodigo, {
        placeholder: "Ej: M.2.1.1",
      })}
      {renderField("Descripción DCD", dcdDescripcion, setDcdDescripcion, {
        placeholder: "Descripción de la DCD",
        multiline: true,
      })}
      {renderField("Indicador de Evaluación", indicadorEvaluacion, setIndicadorEvaluacion, {
        placeholder: "Indicador",
        multiline: true,
      })}
      {renderField("Objetivo de Aprendizaje", objetivoAprendizaje, setObjetivoAprendizaje, {
        placeholder: "Objetivo",
        multiline: true,
      })}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>
          Competencias Transversales
        </Text>
        <View style={styles.selectRow}>
          {COMPETENCIAS.map((code) => (
            <Pressable
              key={code}
              onPress={() => toggleCompetencia(code)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: competencias.includes(code)
                    ? colors.primary
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: competencias.includes(code) ? "#fff" : colors.foreground,
                  fontSize: 13,
                  fontWeight: competencias.includes(code) ? "600" : "400",
                }}
              >
                {code}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  // ── Paso: Estrategia didáctica ──
  const renderEstructura = () => (
    <View>
      {renderSectionHeader("Estrategia Didáctica", "📐")}
      {renderSelectRow("Estrategia", ["erca", "directa", "proyectos"], estrategiaId, setEstrategiaId)}
      {renderField("Recursos", recursos, setRecursos, {
        placeholder: "Ej: Cuaderno, lápiz, pizarra",
        multiline: true,
      })}
      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" },
        ]}
      >
        <Text style={{ color: colors.primary, fontSize: 13 }}>
          {estrategiaId === "erca"
            ? "ERCA: Experiencia → Reflexión → Conceptualización → Aplicación. Las fases se generarán automáticamente."
            : estrategiaId === "directa"
              ? "Estrategia directa: Inicio → Desarrollo → Cierre."
              : "Estrategia por proyectos: Integración de conocimientos."}
        </Text>
      </View>
    </View>
  );

  // ── Paso: Evaluación ──
  const renderEvaluacion = () => (
    <View>
      {renderSectionHeader("Evaluación", "✅")}
      {renderField("Técnica de Evaluación", tecnicaEvaluacion, setTecnicaEvaluacion, {
        placeholder: "Ej: Observación directa",
      })}
      {renderField("Instrumento de Evaluación", instrumentoEvaluacion, setInstrumentoEvaluacion, {
        placeholder: "Ej: Rúbrica, lista de cotejo",
      })}
      {renderField("Actividades de Evaluación", actividadesEvaluacion, setActividadesEvaluacion, {
        placeholder: "Describa las actividades de evaluación",
        multiline: true,
      })}
    </View>
  );

  const renderPasoActual = () => {
    switch (paso) {
      case "datos":
        return renderDatos();
      case "dcd":
        return renderDCD();
      case "estructura":
        return renderEstructura();
      case "evaluacion":
        return renderEvaluacion();
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">
            Planificación EGB / BGU
          </Text>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressRow}>
          {PASOS.map((p, i) => (
            <View key={p.key} style={{ flex: 1, alignItems: "center" }}>
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      p.key === paso
                        ? colors.primary
                        : PASOS.findIndex((x) => x.key === paso) > i
                          ? colors.success
                          : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: p.key === paso ? colors.primary : colors.muted,
                  marginTop: 4,
                  fontWeight: p.key === paso ? "600" : "400",
                }}
              >
                {p.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Contenido del paso ── */}
        <View style={{ paddingHorizontal: 20 }}>{renderPasoActual()}</View>
      </ScrollView>

      {/* ── Botones de navegación ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          {paso !== "datos" ? (
            <Pressable
              onPress={retreatPaso}
              style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Anterior</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {paso !== "evaluacion" ? (
            <Pressable
              onPress={advancePaso}
              disabled={!canAdvance()}
              style={[
                styles.navBtn,
                {
                  backgroundColor: canAdvance() ? colors.primary : colors.muted + "40",
                },
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Siguiente</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSave}
              disabled={createMutation.isPending}
              style={[styles.navBtn, { backgroundColor: colors.success }]}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700" }}>Guardar</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  selectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  progressRow: {
    flexDirection: "row",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  bottomBarInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
