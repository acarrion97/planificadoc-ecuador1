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
import { obtenerAmbitosActivos } from "@/data/ambitos-desarrollo-inicial";
import { codigosCompetenciasActivas } from "@/data/competencias-transversales";

type PasoFlujo = "datos" | "ambitos" | "estrategia" | "evaluacion";

const PASOS: { key: PasoFlujo; label: string }[] = [
  { key: "datos", label: "Datos" },
  { key: "ambitos", label: "Ámbitos" },
  { key: "estrategia", label: "Estrategia" },
  { key: "evaluacion", label: "Evaluación" },
];

const AMBITOS = obtenerAmbitosActivos();
const COMPETENCIAS = codigosCompetenciasActivas();

interface ClaseForm {
  numero: number;
  tema: string;
  objetivoEspecifico: string;
  metodologia: string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  metodoEvaluacion: string;
}

interface AmbitoForm {
  ambitoId: string;
  competenciaCodigo: string;
  competenciaDescripcion: string;
  competencias: string[];
  destrezas: string[];
  clases: ClaseForm[];
}

const CLASE_VACIA: ClaseForm = {
  numero: 1,
  tema: "",
  objetivoEspecifico: "",
  metodologia: "",
  inicio: "",
  desarrollo: "",
  cierre: "",
  metodoEvaluacion: "",
};

const AMBITO_VACIO: AmbitoForm = {
  ambitoId: "",
  competenciaCodigo: "",
  competenciaDescripcion: "",
  competencias: ["C"],
  destrezas: [""],
  clases: [{ ...CLASE_VACIA }],
};

export default function InicialFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const [paso, setPaso] = useState<PasoFlujo>("datos");

  // ── Estado del formulario ──
  const [grado, setGrado] = useState("Inicial 4 años");
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [duracion, setDuracion] = useState("2026-2027");
  const [objetivoGeneral, setObjetivoGeneral] = useState("");
  const [ambitos, setAmbitos] = useState<AmbitoForm[]>([{ ...AMBITO_VACIO }]);
  const [metodoEvaluacionGeneral, setMetodoEvaluacionGeneral] = useState("");

  // ── Mutations ──
  const utils = trpc.useContext();
  const createMutation = trpc.curriculoCompetencias.createInicial.useMutation({
    onSuccess: () => {
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

  // ── Helpers de ámbito ──

  const updateAmbito = (index: number, patch: Partial<AmbitoForm>) => {
    setAmbitos((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a))
    );
  };

  const addAmbito = () => {
    setAmbitos((prev) => [...prev, { ...AMBITO_VACIO }]);
  };

  const removeAmbito = (index: number) => {
    if (ambitos.length <= 1) return;
    setAmbitos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Helpers de clase dentro de un ámbito ──

  const updateClase = (
    ambitoIndex: number,
    claseIndex: number,
    patch: Partial<ClaseForm>
  ) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex
          ? {
              ...a,
              clases: a.clases.map((c, ci) =>
                ci === claseIndex ? { ...c, ...patch } : c
              ),
            }
          : a
      )
    );
  };

  const addClase = (ambitoIndex: number) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex
          ? {
              ...a,
              clases: [
                ...a.clases,
                { ...CLASE_VACIA, numero: a.clases.length + 1 },
              ],
            }
          : a
      )
    );
  };

  const removeClase = (ambitoIndex: number, claseIndex: number) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex
          ? { ...a, clases: a.clases.filter((_, ci) => ci !== claseIndex) }
          : a
      )
    );
  };

  // ── Helpers de destreza ──

  const addDestreza = (ambitoIndex: number) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex ? { ...a, destrezas: [...a.destrezas, ""] } : a
      )
    );
  };

  const updateDestreza = (
    ambitoIndex: number,
    destrezaIndex: number,
    value: string
  ) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex
          ? {
              ...a,
              destrezas: a.destrezas.map((d, di) =>
                di === destrezaIndex ? value : d
              ),
            }
          : a
      )
    );
  };

  const toggleCompetenciaAmbito = (ambitoIndex: number, code: string) => {
    setAmbitos((prev) =>
      prev.map((a, ai) =>
        ai === ambitoIndex
          ? {
              ...a,
              competencias: a.competencias.includes(code)
                ? a.competencias.filter((c) => c !== code)
                : [...a.competencias, code],
            }
          : a
      )
    );
  };

  // ── Envío ──

  const handleSave = () => {
    const ambitosPayload = ambitos
      .filter((a) => a.ambitoId)
      .map((a) => {
        const ambitoInfo = AMBITOS.find((am) => am.id === a.ambitoId);
        return {
          ambito: ambitoInfo?.nombre || a.ambitoId,
          competenciaCodigo: a.competenciaCodigo,
          competenciaDescripcion: a.competenciaDescripcion,
          competencias: a.competencias,
          destrezas: a.destrezas.filter((d) => d.trim()),
          clases: a.clases
            .filter((c) => c.tema.trim())
            .map((c) => ({
              numero: c.numero,
              tema: c.tema,
              objetivoEspecifico: c.objetivoEspecifico,
              metodologia: c.metodologia,
              inicio: c.inicio
                ? [{ texto: c.inicio, competencia: a.competencias[0] || "C" }]
                : [],
              desarrollo: c.desarrollo
                ? [
                    {
                      texto: c.desarrollo,
                      competencia: a.competencias[0] || "C",
                    },
                  ]
                : [],
              cierre: c.cierre
                ? [{ texto: c.cierre, competencia: a.competencias[0] || "C" }]
                : [],
              metodoEvaluacion: c.metodoEvaluacion
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean),
            })),
        };
      });

    createMutation.mutate({
      sessionId: "default",
      grado,
      institucion,
      docente,
      duracion,
      objetivoGeneral,
      ambitos: ambitosPayload,
    });
  };

  const canAdvance = () => {
    if (paso === "datos") return !!institucion && !!docente;
    if (paso === "ambitos") return ambitos.some((a) => a.ambitoId);
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
    opts: {
      placeholder?: string;
      multiline?: boolean;
      keyboard?: "default" | "numeric";
    } = {}
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

  // ── Paso: Datos informativos ──
  const renderDatos = () => (
    <View>
      {renderSectionHeader("Datos Informativos", "📋")}
      {renderField("Grado / Nivel", grado, setGrado, {
        placeholder: "Ej: Inicial 4 años",
      })}
      {renderField("Institución", institucion, setInstitucion, {
        placeholder: "Ej: Unidad Educativa Los Andes",
      })}
      {renderField("Docente", docente, setDocente, {
        placeholder: "Nombre del docente",
      })}
      {renderField("Duración / Año Lectivo", duracion, setDuracion, {
        placeholder: "Ej: 2026-2027",
      })}
      {renderField("Objetivo General", objetivoGeneral, setObjetivoGeneral, {
        placeholder: "Objetivo general de la planificación",
        multiline: true,
      })}
    </View>
  );

  // ── Paso: Ámbitos y destrezas ──
  const renderAmbitos = () => (
    <View>
      {renderSectionHeader("Ámbitos de Desarrollo", "🎯")}

      {ambitos.map((ambito, ai) => {
        const ambitoInfo = AMBITOS.find((am) => am.id === ambito.ambitoId);
        return (
          <View
            key={ai}
            style={[
              styles.ambitoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Selector de ámbito */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Ámbito {ai + 1}
              </Text>
              <View style={styles.selectRow}>
                {AMBITOS.map((am) => (
                  <Pressable
                    key={am.id}
                    onPress={() =>
                      updateAmbito(ai, {
                        ambitoId: am.id,
                        competenciaCodigo: am.competenciasTipicas[0] || "C",
                        competenciaDescripcion: am.descripcion,
                      })
                    }
                    style={[
                      styles.selectChip,
                      {
                        backgroundColor:
                          ambito.ambitoId === am.id
                            ? colors.primary
                            : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          ambito.ambitoId === am.id ? "#fff" : colors.foreground,
                        fontSize: 12,
                        fontWeight:
                          ambito.ambitoId === am.id ? "600" : "400",
                      }}
                    >
                      {am.emoji} {am.nombre}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Destrezas */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Destrezas
              </Text>
              {ambito.destrezas.map((destreza, di) => (
                <TextInput
                  key={di}
                  value={destreza}
                  onChangeText={(v) => updateDestreza(ai, di, v)}
                  placeholder={`Destreza ${di + 1}`}
                  placeholderTextColor={colors.muted + "80"}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                      marginBottom: 6,
                    },
                  ]}
                />
              ))}
              <Pressable
                onPress={() => addDestreza(ai)}
                style={[styles.addBtn, { borderColor: colors.primary }]}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>
                  + Agregar destreza
                </Text>
              </Pressable>
            </View>

            {/* Competencias transversales */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Competencias Transversales
              </Text>
              <View style={styles.selectRow}>
                {COMPETENCIAS.map((code) => (
                  <Pressable
                    key={code}
                    onPress={() => toggleCompetenciaAmbito(ai, code)}
                    style={[
                      styles.selectChip,
                      {
                        backgroundColor: ambito.competencias.includes(code)
                          ? colors.primary
                          : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: ambito.competencias.includes(code)
                          ? "#fff"
                          : colors.foreground,
                        fontSize: 12,
                      }}
                    >
                      {code}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Clases dentro del ámbito */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Clases
              </Text>
              {ambito.clases.map((clase, ci) => (
                <View
                  key={ci}
                  style={[
                    styles.claseCard,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.claseHeader}>
                    <Text
                      style={[styles.claseNumber, { color: colors.primary }]}
                    >
                      Clase {clase.numero}
                    </Text>
                    {ambito.clases.length > 1 && (
                      <Pressable onPress={() => removeClase(ai, ci)}>
                        <Text style={{ color: "#DC2626", fontSize: 12 }}>
                          Eliminar
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <TextInput
                    value={clase.tema}
                    onChangeText={(v) => updateClase(ai, ci, { tema: v })}
                    placeholder="Tema de la clase"
                    placeholderTextColor={colors.muted + "80"}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.foreground,
                        marginBottom: 6,
                      },
                    ]}
                  />
                  <TextInput
                    value={clase.objetivoEspecifico}
                    onChangeText={(v) =>
                      updateClase(ai, ci, { objetivoEspecifico: v })
                    }
                    placeholder="Objetivo específico"
                    placeholderTextColor={colors.muted + "80"}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.foreground,
                        marginBottom: 6,
                      },
                    ]}
                  />
                  <TextInput
                    value={clase.metodologia}
                    onChangeText={(v) => updateClase(ai, ci, { metodologia: v })}
                    placeholder="Metodología"
                    placeholderTextColor={colors.muted + "80"}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.foreground,
                        marginBottom: 6,
                      },
                    ]}
                  />
                </View>
              ))}
              <Pressable
                onPress={() => addClase(ai)}
                style={[styles.addBtn, { borderColor: colors.primary }]}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>
                  + Agregar clase
                </Text>
              </Pressable>
            </View>

            {/* Eliminar ámbito */}
            {ambitos.length > 1 && (
              <Pressable
                onPress={() => removeAmbito(ai)}
                style={styles.removeAmbitoBtn}
              >
                <Text style={{ color: "#DC2626", fontSize: 13 }}>
                  Eliminar ámbito
                </Text>
              </Pressable>
            )}
          </View>
        );
      })}

      <Pressable
        onPress={addAmbito}
        style={[
          styles.addAmbitoBtn,
          { backgroundColor: colors.primary + "10", borderColor: colors.primary },
        ]}
      >
        <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 15 }}>
          + Agregar ámbito
        </Text>
      </Pressable>
    </View>
  );

  // ── Paso: Estrategia didáctica ──
  const renderEstrategia = () => (
    <View>
      {renderSectionHeader("Estrategia Didáctica", "📐")}

      {ambitos
        .filter((a) => a.ambitoId)
        .map((ambito, ai) => {
          const ambitoInfo = AMBITOS.find((am) => am.id === ambito.ambitoId);
          return (
            <View
              key={ai}
              style={[
                styles.ambitoCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.ambitoCardTitle,
                  { color: colors.foreground },
                ]}
              >
                {ambitoInfo?.emoji} {ambitoInfo?.nombre || ambito.ambitoId}
              </Text>

              {ambito.clases
                .filter((c) => c.tema.trim())
                .map((clase, ci) => (
                  <View key={ci} style={{ marginBottom: 12 }}>
                    <Text
                      style={[
                        styles.claseLabel,
                        { color: colors.muted },
                      ]}
                    >
                      Clase {clase.numero}: {clase.tema}
                    </Text>
                    {renderField(
                      "Inicio",
                      clase.inicio,
                      (v) =>
                        updateClase(
                          ambitos.indexOf(ambito),
                          ci,
                          { inicio: v }
                        ),
                      { placeholder: "Actividad de inicio", multiline: true }
                    )}
                    {renderField(
                      "Desarrollo",
                      clase.desarrollo,
                      (v) =>
                        updateClase(
                          ambitos.indexOf(ambito),
                          ci,
                          { desarrollo: v }
                        ),
                      { placeholder: "Actividad de desarrollo", multiline: true }
                    )}
                    {renderField(
                      "Cierre",
                      clase.cierre,
                      (v) =>
                        updateClase(
                          ambitos.indexOf(ambito),
                          ci,
                          { cierre: v }
                        ),
                      { placeholder: "Actividad de cierre", multiline: true }
                    )}
                  </View>
                ))}
            </View>
          );
        })}
    </View>
  );

  // ── Paso: Evaluación ──
  const renderEvaluacion = () => (
    <View>
      {renderSectionHeader("Evaluación", "✅")}

      {renderField(
        "Método de Evaluación General",
        metodoEvaluacionGeneral,
        setMetodoEvaluacionGeneral,
        {
          placeholder: "Ej: Observación directa, portafolio",
          multiline: true,
        }
      )}

      {ambitos
        .filter((a) => a.ambitoId)
        .map((ambito, ai) => {
          const ambitoInfo = AMBITOS.find((am) => am.id === ambito.ambitoId);
          return (
            <View
              key={ai}
              style={[
                styles.ambitoCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[styles.ambitoCardTitle, { color: colors.foreground }]}
              >
                {ambitoInfo?.emoji} {ambitoInfo?.nombre || ambito.ambitoId}
              </Text>

              {ambito.clases
                .filter((c) => c.tema.trim())
                .map((clase, ci) => (
                  <View key={ci} style={{ marginBottom: 8 }}>
                    <Text style={[styles.claseLabel, { color: colors.muted }]}>
                      Clase {clase.numero}: {clase.tema}
                    </Text>
                    <TextInput
                      value={clase.metodoEvaluacion}
                      onChangeText={(v) =>
                        updateClase(
                          ambitos.indexOf(ambito),
                          ci,
                          { metodoEvaluacion: v }
                        )
                      }
                      placeholder="Evidencias (separadas por coma)"
                      placeholderTextColor={colors.muted + "80"}
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.foreground,
                        },
                      ]}
                    />
                  </View>
                ))}
            </View>
          );
        })}
    </View>
  );

  const renderPasoActual = () => {
    switch (paso) {
      case "datos":
        return renderDatos();
      case "ambitos":
        return renderAmbitos();
      case "estrategia":
        return renderEstrategia();
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
            Planificación Inicial / Preparatoria
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
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
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
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.bottomBarInner}>
          {paso !== "datos" ? (
            <Pressable
              onPress={retreatPaso}
              style={[
                styles.navBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                Anterior
              </Text>
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
                  backgroundColor: canAdvance()
                    ? colors.primary
                    : colors.muted + "40",
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
    paddingHorizontal: 12,
    paddingVertical: 7,
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
  ambitoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  ambitoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  claseCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  claseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  claseNumber: {
    fontSize: 13,
    fontWeight: "700",
  },
  claseLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  addBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 6,
  },
  addAmbitoBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  removeAmbitoBtn: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 8,
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
