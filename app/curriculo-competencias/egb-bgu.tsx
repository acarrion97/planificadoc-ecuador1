import { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { codigosCompetenciasActivas } from "@/data/competencias-transversales";
import { AREAS_INFO, type Area, type Destreza, type Subnivel } from "@/data/types";
import { TODAS_LAS_DESTREZAS, buscarDestrezas, filtrarPorAreaYSubnivel } from "@/data";

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

/** Áreas disponibles para EGB */
const AREAS_EGB: Area[] = ["M", "LL", "CN", "CS", "EF", "ECA"];
/** Áreas disponibles para BGU */
const AREAS_BGU: Area[] = ["M", "LL", "CN", "CS", "EF", "ECA", "CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "CS.EC", "EG", "EFL", "CAI"];

/** Grado texto → número */
function gradoANumero(grado: string): number {
  const map: Record<string, number> = {
    "1ro": 1, "2do": 2, "3ro": 3, "4to": 4, "5to": 5,
    "6to": 6, "7mo": 7, "8vo": 8, "9no": 9, "10mo": 10,
  };
  return map[grado] || 1;
}

/** Grado → subnivel */
function subnivelDelGrado(grado: string): Subnivel {
  const n = gradoANumero(grado);
  if (n <= 1) return 1;
  if (n <= 4) return 2;
  if (n <= 7) return 3;
  if (n <= 10) return 4;
  return 5;
}

// ============================================================
// COMPONENTE: Buscador de DCD (Modal)
// ============================================================

function DcdBuscador({
  area,
  grado,
  onSelect,
  colors,
  currentCodigo,
}: {
  area: Area | null;
  grado: string;
  onSelect: (destreza: Destreza) => void;
  colors: any;
  currentCodigo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Destreza[]>([]);

  const subnivel = area ? subnivelDelGrado(grado) : null;

  const pool = useMemo(() => {
    if (!area) return [];
    return subnivel ? filtrarPorAreaYSubnivel(area, subnivel) : TODAS_LAS_DESTREZAS.filter((d) => d.area === area);
  }, [area, subnivel]);

  function search(text: string) {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    const q = text.toLowerCase();
    setResults(
      pool.filter(
        (d) => d.codigo.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q)
      ).slice(0, 10)
    );
  }

  function seleccionar(d: Destreza) {
    onSelect(d);
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  function cerrar() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  const nombreArea = area ? AREAS_INFO[area]?.name || area : "todas";
  const tienePool = pool.length > 0;

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>DCD (Destreza con Criterio de Desempeño)</Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [{
          borderWidth: 1, borderRadius: 10, padding: 12,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          opacity: pressed ? 0.7 : 1,
          borderColor: colors.border, backgroundColor: colors.surface,
        }]}
      >
        <Text style={{ color: currentCodigo ? colors.foreground : colors.muted, fontSize: 14, flex: 1 }}>
          {currentCodigo ? `✓ ${currentCodigo}` : `🔍 Buscar DCD de ${nombreArea}...`}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={cerrar}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}
          onPress={cerrar}
        >
          <Pressable
            style={{ width: "90%", maxWidth: 520, backgroundColor: colors.background, borderRadius: 14, padding: 16, maxHeight: "80%" }}
            onPress={() => {}}
          >
            <Text style={{ fontWeight: "700", fontSize: 14, color: colors.foreground, marginBottom: 10 }}>
              Buscar DCD — {nombreArea}
            </Text>
            <TextInput
              autoFocus
              value={query}
              onChangeText={search}
              placeholder="Código o descripción (mín. 2 caracteres)..."
              placeholderTextColor={colors.muted}
              style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, marginBottom: 8 }]}
            />

            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 400 }}>
              {!query && tienePool && (
                <>
                  <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>
                    {pool.length} destrezas de {nombreArea} para {grado} (subnivel {subnivel})
                  </Text>
                  {pool.slice(0, 8).map((d) => (
                    <Pressable
                      key={d.codigo}
                      onPress={() => seleccionar(d)}
                      style={({ pressed }) => [styles.dropdownItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Text style={{ minWidth: 70, color: colors.primary, fontWeight: "700", fontSize: 12 }}>{d.codigo}</Text>
                      <Text style={{ color: colors.foreground, fontSize: 12, flex: 1, marginLeft: 8 }} numberOfLines={2}>
                        {d.descripcion}
                      </Text>
                    </Pressable>
                  ))}
                  {pool.length > 8 && (
                    <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center", paddingVertical: 6 }}>
                      Usa el buscador para ver las {pool.length} destrezas
                    </Text>
                  )}
                </>
              )}

              {!query && !tienePool && area && (
                <Text style={{ fontSize: 11, color: colors.muted, padding: 8, fontStyle: "italic" }}>
                  No hay destrezas de {nombreArea} para este subnivel. Prueba con otra área.
                </Text>
              )}

              {query && results.map((d) => (
                <Pressable
                  key={d.codigo}
                  onPress={() => seleccionar(d)}
                  style={({ pressed }) => [styles.dropdownItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text style={{ minWidth: 70, color: colors.primary, fontWeight: "700", fontSize: 12 }}>{d.codigo}</Text>
                  <Text style={{ color: colors.foreground, fontSize: 12, flex: 1, marginLeft: 8 }} numberOfLines={2}>
                    {d.descripcion}
                  </Text>
                </Pressable>
              ))}

              {query && results.length === 0 && (
                <Text style={{ fontSize: 11, color: colors.muted, padding: 8, textAlign: "center" }}>
                  Sin resultados para "{query}"
                </Text>
              )}
            </ScrollView>

            <Pressable onPress={cerrar} style={{ marginTop: 12, alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ color: colors.primary, fontWeight: "600" }}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function EGBBGUFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const [paso, setPaso] = useState<PasoFlujo>("datos");
  const [cargando, setCargando] = useState(isEdit);

  // ── Estado del formulario ──
  const [nivel, setNivel] = useState<"EGB" | "BGU">("EGB");
  const [grado, setGrado] = useState("3ro");
  const [paralelo, setParalelo] = useState("A");
  const [areaCode, setAreaCode] = useState<Area | null>(null);
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

  // ── Cargar datos existentes (modo edición) ──
  const { data: planExistente } = trpc.curriculoCompetencias.getById.useQuery(
    { id: Number(id) },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (planExistente?.formData) {
      const fd = planExistente.formData as any;
      setNivel(fd.nivel || "EGB");
      setGrado(fd.grado || "3ro");
      setParalelo(fd.paralelo || "A");
      setAreaCode(fd.areaCode || null);
      setInstitucion(fd.institucion || "");
      setDocente(fd.docente || "");
      setPeriodoPedagogico(fd.periodoPedagogico || "");
      setTrimestre(fd.trimestre || "Primer Trimestre");
      setFecha(fd.fecha || "");
      setDcdCodigo(fd.destreza?.codigo || planExistente.dcdCodigo || "");
      setDcdDescripcion(fd.destreza?.descripcion || "");
      setCompetencias(fd.competenciasAsociadas || ["C"]);
      setIndicadorEvaluacion(fd.indicadorEvaluacion || "");
      setObjetivoAprendizaje(fd.objetivoAprendizaje || "");
      setEstrategiaId(fd.estructuraDidactica?.estrategiaId || "erca");
      setRecursos(fd.recursos || "");
      setTecnicaEvaluacion(fd.tecnicaEvaluacion || "");
      setInstrumentoEvaluacion(fd.instrumentoEvaluacion || "");
      setActividadesEvaluacion(fd.actividadesEvaluacion || "");
      setCargando(false);
    }
  }, [planExistente]);

  // ── Mutations ──
  const utils = trpc.useContext();

  const createMutation = trpc.curriculoCompetencias.createEGBBGU.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      Alert.alert("Éxito", "Planificación creada correctamente");
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear la planificación. Verifica los datos e intenta de nuevo.");
    },
  });

  const updateMutation = trpc.curriculoCompetencias.updateEGBBGU.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      Alert.alert("Éxito", "Planificación actualizada correctamente");
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar la planificación. Verifica los datos e intenta de nuevo.");
    },
  });

  // ── Selección de DCD ──
  function handleDcdSelect(destreza: Destreza) {
    setDcdCodigo(destreza.codigo);
    setDcdDescripcion(destreza.descripcion);
    // Auto-sugerir indicador de evaluación si existe
    if (destreza.indicadoresEvaluacion?.length > 0 && !indicadorEvaluacion) {
      setIndicadorEvaluacion(destreza.indicadoresEvaluacion[0]);
    }
    // Auto-sugerir objetivo si existe
    if (destreza.objetivos?.length > 0 && !objetivoAprendizaje) {
      setObjetivoAprendizaje(destreza.objetivos[0]);
    }
  }

  // ── Selección de área ──
  function handleAreaSelect(code: Area) {
    if (areaCode === code) {
      setAreaCode(null);
    } else {
      setAreaCode(code);
      // Limpiar DCD al cambiar de área
      setDcdCodigo("");
      setDcdDescripcion("");
    }
  }

  // ── Asignatura legible ──
  const asignatura = areaCode ? AREAS_INFO[areaCode]?.name || areaCode : "";

  const toggleCompetencia = (code: string) => {
    setCompetencias((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    const payload = {
      sessionId: "default",
      id: isEdit ? Number(id) : undefined,
      nivel,
      grado,
      paralelo,
      areaCode: areaCode || undefined,
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
    };

    if (isEdit) {
      updateMutation.mutate({ ...payload, id: Number(id) } as any);
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const canAdvance = () => {
    if (paso === "datos") return !!areaCode && !!institucion;
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
    opts: { placeholder?: string; multiline?: boolean; keyboard?: "default" | "numeric"; disabled?: boolean } = {}
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
        editable={opts.disabled !== true}
        style={[
          styles.textInput,
          {
            backgroundColor: opts.disabled ? colors.muted + "10" : colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: opts.multiline ? "top" : "center",
            minHeight: opts.multiline ? 70 : 44,
            opacity: opts.disabled ? 0.6 : 1,
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

  // ── Render: Datos paso 1 ──
  const renderDatos = () => (
    <View>
      {renderSectionHeader("Datos Informativos", "📋")}
      {renderSelectRow("Nivel", NIVELES, nivel, setNivel as (v: string) => void)}
      {renderSelectRow("Grado", GRADOS, grado, setGrado)}
      {renderSelectRow("Paralelo", PARALELOS, paralelo, setParalelo)}

      {/* Selector de Área como chips */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Área / Asignatura</Text>
        <View style={styles.selectRow}>
          {(nivel === "BGU" ? AREAS_BGU : AREAS_EGB).map((code) => {
            const info = AREAS_INFO[code];
            if (!info) return null;
            const active = areaCode === code;
            return (
              <Pressable
                key={code}
                onPress={() => handleAreaSelect(code)}
                style={[
                  styles.selectChip,
                  {
                    backgroundColor: active ? info.color : colors.surface,
                    borderColor: active ? info.color : colors.border,
                  },
                ]}
              >
                <Text style={{
                  color: active ? "#fff" : colors.foreground,
                  fontSize: 12,
                  fontWeight: active ? "600" : "400",
                }}>
                  {info.emoji} {info.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {renderField("Institución", institucion, setInstitucion, { placeholder: "Ej: Unidad Educativa San Martín" })}
      {renderField("Docente", docente, setDocente, { placeholder: "Nombre del docente" })}
      {renderField("Período Pedagógico", periodoPedagogico, setPeriodoPedagogico, { placeholder: "Ej: 2026-2027" })}
      {renderSelectRow("Trimestre", TRIMESTRES, trimestre, setTrimestre)}
      {renderField("Fecha", fecha, setFecha, { placeholder: "YYYY-MM-DD" })}
    </View>
  );

  // ── Render: DCD paso 2 ──
  const renderDCD = () => (
    <View>
      {renderSectionHeader("DCD y Competencias", "🎯")}

      {/* Buscador de DCD */}
      <DcdBuscador
        area={areaCode}
        grado={grado}
        onSelect={handleDcdSelect}
        colors={colors}
        currentCodigo={dcdCodigo}
      />

      {/* Descripción autocompletada — editable */}
      {renderField("Descripción DCD", dcdDescripcion, setDcdDescripcion, {
        placeholder: "Se autocompleta al seleccionar DCD",
        multiline: true,
      })}

      {/* Indicador de evaluación — autocompletado si disponible */}
      {renderField("Indicador de Evaluación", indicadorEvaluacion, setIndicadorEvaluacion, {
        placeholder: "Se autocompleta si la DCD tiene indicador",
        multiline: true,
      })}

      {renderField("Objetivo de Aprendizaje", objetivoAprendizaje, setObjetivoAprendizaje, { placeholder: "Objetivo", multiline: true })}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Competencias Transversales</Text>
        <View style={styles.selectRow}>
          {COMPETENCIAS.map((code) => (
            <Pressable
              key={code}
              onPress={() => toggleCompetencia(code)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: competencias.includes(code) ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ color: competencias.includes(code) ? "#fff" : colors.foreground, fontSize: 13, fontWeight: competencias.includes(code) ? "600" : "400" }}>
                {code}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEstructura = () => (
    <View>
      {renderSectionHeader("Estrategia Didáctica", "📐")}
      {renderSelectRow("Estrategia", ["erca", "directa", "proyectos"], estrategiaId, setEstrategiaId)}
      {renderField("Recursos", recursos, setRecursos, { placeholder: "Ej: Cuaderno, lápiz, pizarra", multiline: true })}
      <View style={[styles.infoBox, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
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

  const renderEvaluacion = () => (
    <View>
      {renderSectionHeader("Evaluación", "✅")}
      {renderField("Técnica de Evaluación", tecnicaEvaluacion, setTecnicaEvaluacion, { placeholder: "Ej: Observación directa" })}
      {renderField("Instrumento de Evaluación", instrumentoEvaluacion, setInstrumentoEvaluacion, { placeholder: "Ej: Rúbrica, lista de cotejo" })}
      {renderField("Actividades de Evaluación", actividadesEvaluacion, setActividadesEvaluacion, { placeholder: "Describa las actividades de evaluación", multiline: true })}
    </View>
  );

  const renderPasoActual = () => {
    switch (paso) {
      case "datos": return renderDatos();
      case "dcd": return renderDCD();
      case "estructura": return renderEstructura();
      case "evaluacion": return renderEvaluacion();
    }
  };

  if (cargando) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 8 }}>Cargando planificación...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">
            {isEdit ? "Editar Planificación" : "Planificación EGB / BGU"}
          </Text>
        </View>

        <View style={styles.progressRow}>
          {PASOS.map((p, i) => (
            <View key={p.key} style={{ flex: 1, alignItems: "center" }}>
              <View style={[styles.progressDot, { backgroundColor: p.key === paso ? colors.primary : PASOS.findIndex((x) => x.key === paso) > i ? colors.success : colors.border }]}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: 10, color: p.key === paso ? colors.primary : colors.muted, marginTop: 4, fontWeight: p.key === paso ? "600" : "400" }}>
                {p.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20 }}>{renderPasoActual()}</View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          {paso !== "datos" ? (
            <Pressable onPress={retreatPaso} style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Anterior</Text>
            </Pressable>
          ) : (
            <View />
          )}
          {paso !== "evaluacion" ? (
            <Pressable onPress={advancePaso} disabled={!canAdvance()} style={[styles.navBtn, { backgroundColor: canAdvance() ? colors.primary : colors.muted + "40" }]}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Siguiente</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleSave} disabled={isPending} style={[styles.navBtn, { backgroundColor: isPending ? colors.muted + "40" : colors.success }]}>
              {isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Guardando…</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700" }}>{isEdit ? "Guardar Cambios" : "Guardar"}</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 8 },
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  progressRow: { flexDirection: "row", paddingHorizontal: 30, marginBottom: 20 },
  progressDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoBox: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 12 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12 },
  bottomBarInner: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  dropdownItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
});
