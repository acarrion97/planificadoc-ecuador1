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
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { COMPETENCIAS_INICIAL, type CompetenciaInicialCompleta as CompetenciaInicial } from "@/data/competencias-especificas-inicial";

type PasoFlujo = "contexto" | "competencias" | "datos" | "generar";

const PASOS: { key: PasoFlujo; label: string }[] = [
  { key: "contexto", label: "Contexto curricular" },
  { key: "competencias", label: "Competencias específicas" },
  { key: "datos", label: "Datos administrativos" },
  { key: "generar", label: "Generar" },
];

const GRADOS = [
  "Inicial 3-4 años",
  "Inicial 4-5 años",
];
const TRIMESTRES = ["Primer trimestre", "Segundo trimestre", "Tercer trimestre"];
const PARALELOS = ["A", "B", "C", "D", "E"];

export default function InicialFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const [paso, setPaso] = useState<PasoFlujo>("contexto");
  const [cargando, setCargando] = useState(isEdit);

  // ── Step 1: Contexto ──
  const [grado, setGrado] = useState("Inicial 3-4 años");

  // ── Step 2: Competencias ──
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<CompetenciaInicial[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // ── Step 3: Datos ──
  const [trimestre, setTrimestre] = useState("Primer trimestre");
  const [paralelo, setParalelo] = useState("A");
  const [noSemanas, setNoSemanas] = useState("8");
  const [titulo, setTitulo] = useState("");
  const [situacionAprendizaje, setSituacionAprendizaje] = useState("");
  const [temasTrimestre, setTemasTrimestre] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [hayNEE, setHayNEE] = useState(false);
  const [compartir, setCompartir] = useState(false);

  // ── Cargar datos existentes (modo edición) ──
  const { data: planExistente } = trpc.curriculoCompetencias.getById.useQuery(
    { id: Number(id) },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (planExistente?.formData) {
      const fd = planExistente.formData as any;
      setGrado(fd.grado || "Inicial 3-4 años");
      setInstitucion(fd.institucion || "");
      setDocente(fd.docente || "");
      setTrimestre(fd.trimestre || "Primer trimestre");
      setParalelo(fd.paralelo || "A");
      setNoSemanas(fd.noSemanasClase?.toString() || "8");
      setTitulo(fd.situacionAprendizaje?.titulo || "");
      setSituacionAprendizaje(fd.situacionAprendizaje?.descripcion || "");
      if (fd.ambitos?.length > 0) {
        const codes = fd.ambitos.map((a: any) => a.competenciaCodigo).filter(Boolean);
        const selected = COMPETENCIAS_INICIAL.filter(c => codes.includes(c.codigo));
        setCompetenciasSeleccionadas(selected);
      }
      setCargando(false);
    }
  }, [planExistente]);

  // ── Mutations ──
  const utils = trpc.useContext();
  const createMutation = trpc.curriculoCompetencias.createInicial.useMutation({
    onSuccess: (data) => {
      utils.curriculoCompetencias.list.invalidate();
      const nuevoId = (data as any)?.id;
      if (nuevoId) {
        router.push(`/curriculo-competencias/ver/${nuevoId}` as any);
      } else {
        router.back();
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear la planificación.");
    },
  });

  const updateMutation = trpc.curriculoCompetencias.updateInicial.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      router.push(`/curriculo-competencias/ver/${id}` as any);
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar la planificación.");
    },
  });

  // ── Competencias filtering ──
  const competenciasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return COMPETENCIAS_INICIAL;
    const q = busqueda.trim().toLowerCase();
    return COMPETENCIAS_INICIAL.filter(
      c => c.codigo.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q)
    );
  }, [busqueda]);

  const selectedCodes = useMemo(() => new Set(competenciasSeleccionadas.map(c => c.codigo)), [competenciasSeleccionadas]);

  const toggleCompetencia = (comp: CompetenciaInicial) => {
    if (selectedCodes.has(comp.codigo)) {
      setCompetenciasSeleccionadas(prev => prev.filter(c => c.codigo !== comp.codigo));
    } else {
      setCompetenciasSeleccionadas(prev => [...prev, comp]);
    }
  };

  const removeCompetencia = (codigo: string) => {
    setCompetenciasSeleccionadas(prev => prev.filter(c => c.codigo !== codigo));
  };

  // ── Navigation ──
  const canAdvance = () => {
    if (paso === "contexto") return true;
    if (paso === "competencias") return competenciasSeleccionadas.length > 0;
    return true;
  };

  const advancePaso = () => {
    const idx = PASOS.findIndex(p => p.key === paso);
    if (idx < PASOS.length - 1) setPaso(PASOS[idx + 1].key);
  };

  const retreatPaso = () => {
    const idx = PASOS.findIndex(p => p.key === paso);
    if (idx > 0) setPaso(PASOS[idx - 1].key);
  };

  // ── Save ──
  const handleSave = () => {
    const temas = temasTrimestre.split("\n").map(t => t.trim()).filter(Boolean);
    const ambitosPayload = competenciasSeleccionadas.map(comp => ({
      ambito: comp.descripcion.split(",")[0].substring(0, 50),
      competenciaCodigo: comp.codigo,
      competenciaDescripcion: comp.descripcion,
      competencias: comp.competenciasClave.slice(0, 2),
      destrezas: [comp.descripcion],
      clases: temas.map((tema, i) => ({
        numero: i + 1,
        tema,
        objetivoEspecifico: comp.descripcion,
        metodologia: "",
        inicio: [],
        desarrollo: [],
        cierre: [],
        metodoEvaluacion: [],
      })),
    }));

    // Si no hay temas, crear una clase vacía para que la IA genere
    if (ambitosPayload.length > 0 && ambitosPayload[0].clases.length === 0) {
      ambitosPayload[0].clases = [{
        numero: 1,
        tema: titulo || "Situación de aprendizaje",
        objetivoEspecifico: competenciasSeleccionadas[0]?.descripcion || "",
        metodologia: "",
        inicio: [],
        desarrollo: [],
        cierre: [],
        metodoEvaluacion: [],
      }];
    }

    const payload = {
      sessionId: "default",
      grado,
      institucion,
      docente,
      duracion: "2026-2027",
      trimestre,
      paralelo,
      noSemanasClase: parseInt(noSemanas) || 8,
      objetivoGeneral: situacionAprendizaje,
      situacionAprendizaje: {
        titulo,
        descripcion: situacionAprendizaje,
      },
      ambitos: ambitosPayload,
    };

    if (isEdit) {
      updateMutation.mutate({ ...payload, id: Number(id) });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ── Render helpers ──
  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );

  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View style={styles.selectRow}>
        {options.map(opt => (
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
            <Text style={{ color: value === opt ? "#fff" : colors.foreground, fontSize: 13 }}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
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
        numberOfLines={opts.multiline ? 4 : 1}
        keyboardType={opts.keyboard || "default"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: opts.multiline ? "top" : "center",
            minHeight: opts.multiline ? 80 : 44,
          },
        ]}
      />
    </View>
  );

  // ── Step 1: Contexto curricular ──
  const renderContexto = () => (
    <View>
      {renderSectionHeader("Contexto curricular", "🎓")}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Currículo por Competencias</Text>
        <View style={[styles.selectRow, { backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }]}>
          <Text style={{ color: colors.foreground, fontSize: 15 }}>Educación Inicial (3-5 años)</Text>
        </View>
      </View>

      {renderSelect("Grados del aula", grado, GRADOS, setGrado)}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Currículo integrado</Text>
        <View style={[styles.selectRow, { backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }]}>
          <Text style={{ color: colors.foreground, fontSize: 15 }}>CI — Currículo integrado</Text>
        </View>
      </View>

      <Text style={[styles.helperText, { color: colors.muted, fontStyle: "italic" }]}>
        Elige un grado o ambos. Cada grado será una columna en la planificación multigrado.
      </Text>
    </View>
  );

  // ── Step 2: Competencias específicas ──
  const renderCompetencias = () => (
    <View>
      <View style={[styles.sectionHeader, { justifyContent: "space-between" }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.sectionIcon}>🧩</Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Competencias específicas</Text>
        </View>
        <Text style={[styles.sectionCounter, { color: colors.primary }]}>
          {competenciasSeleccionadas.length} seleccionadas
        </Text>
      </View>

      <Text style={[styles.helperText, { color: colors.muted }]}>
        Elige al menos una competencia del subnivel Inicial. Los indicadores y saberes se resuelven por grado al generar.
      </Text>

      {/* Search */}
      <TextInput
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar por código o texto..."
        placeholderTextColor={colors.muted + "80"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            marginBottom: 12,
          },
        ]}
      />

      {/* Selected chips */}
      {competenciasSeleccionadas.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>
            Competencias elegidas
          </Text>
          <View style={styles.chipsWrap}>
            {competenciasSeleccionadas.map(comp => (
              <View key={comp.codigo} style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}>
                <Text style={[styles.chipCode, { color: "#4C1D95" }]}>
                  Inicial · {comp.codigo}
                </Text>
                <Text style={[styles.chipDesc, { color: "#6D28D9" }]} numberOfLines={1}>
                  {comp.descripcion.length > 35 ? comp.descripcion.substring(0, 35) + "..." : comp.descripcion}
                </Text>
                <Pressable onPress={() => removeCompetencia(comp.codigo)} hitSlop={6} style={styles.chipX}>
                  <Text style={{ color: "#7C3AED", fontSize: 15, fontWeight: "700" }}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Available list */}
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>Agregar competencias</Text>
      <View style={[styles.listaContainer, { borderColor: colors.border }]}>
        {competenciasFiltradas.map(comp => (
          <Pressable
            key={comp.codigo}
            onPress={() => toggleCompetencia(comp)}
            style={[
              styles.listaItem,
              { borderBottomColor: colors.border, backgroundColor: selectedCodes.has(comp.codigo) ? colors.primary + "10" : "transparent" },
            ]}
          >
            <View style={[styles.checkbox, { borderColor: selectedCodes.has(comp.codigo) ? colors.primary : colors.border, backgroundColor: selectedCodes.has(comp.codigo) ? colors.primary : "transparent" }]}>
              {selectedCodes.has(comp.codigo) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.listaCodigo, { color: colors.primary }]}>{comp.codigo}</Text>
              <Text style={[styles.listaDesc, { color: colors.foreground }]} numberOfLines={2}>
                {comp.descripcion}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                {comp.competenciasClave.map(ck => (
                  <View key={ck} style={[styles.ckBadge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                    <Text style={[styles.ckBadgeText, { color: colors.primary }]}>{ck}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // ── Step 3: Datos ──
  const renderDatos = () => (
    <View>
      {renderSectionHeader("Datos administrativos", "📋")}

      {renderField("Institución", institucion, setInstitucion, {
        placeholder: "Nombre de la unidad educativa",
      })}

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {renderSelect("Trimestre", trimestre, TRIMESTRES, setTrimestre)}
        </View>
        <View style={{ flex: 1 }}>
          {renderSelect("Paralelo", paralelo, PARALELOS, setParalelo)}
        </View>
      </View>

      {renderField("N.° de semanas", noSemanas, setNoSemanas, { keyboard: "numeric" })}

      {renderField("Título", titulo, setTitulo, {
        placeholder: "Ej: Mis nuevos amigos, Explorando la naturaleza",
      })}

      {renderField("Situación de aprendizaje", situacionAprendizaje, setSituacionAprendizaje, {
        placeholder: "Opcional. Si lo dejás vacío, la IA redacta la descripción del trimestre.",
        multiline: true,
      })}

      {renderField("Temas del trimestre", temasTrimestre, setTemasTrimestre, {
        placeholder: "Opcional. Escribí un tema por línea.\nEj: Mis emociones\nMi familia",
        multiline: true,
      })}

      {renderField("Docente", docente, setDocente, {
        placeholder: "Nombre del docente",
      })}

      {/* NEE toggle */}
      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>¿Hay estudiantes con NEE en este paralelo?</Text>
        </View>
        <Switch
          value={hayNEE}
          onValueChange={setHayNEE}
          trackColor={{ false: colors.border, true: colors.primary + "60" }}
          thumbColor={hayNEE ? colors.primary : colors.muted}
        />
      </View>

      {/* Compartir toggle */}
      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>¿Compartir con la comunidad?</Text>
          <Text style={[styles.toggleSub, { color: colors.muted }]}>Otros docentes podrán ver y clonar tu planificación.</Text>
        </View>
        <Switch
          value={compartir}
          onValueChange={setCompartir}
          trackColor={{ false: colors.border, true: colors.primary + "60" }}
          thumbColor={compartir ? colors.primary : colors.muted}
        />
      </View>
    </View>
  );

  // ── Step 4: Generar ──
  const renderGenerar = () => (
    <View>
      {renderSectionHeader("Generar planificación", "✨")}

      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Resumen</Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Grado:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{grado}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Trimestre:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{trimestre}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Paralelo:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{paralelo}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Semanas:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{noSemanas}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Competencias:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {competenciasSeleccionadas.map(c => c.codigo).join(", ")}
          </Text>
        </View>

        {titulo ? (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Título:</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{titulo}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.disclaimer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.disclaimerText, { color: colors.muted }]}>
          Esta herramienta pedagógica genera propuestas de planificación basadas en los lineamientos técnicos y formatos socializados en la fase de piloto. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito.
        </Text>
      </View>
    </View>
  );

  const renderPasoActual = () => {
    switch (paso) {
      case "contexto": return renderContexto();
      case "competencias": return renderCompetencias();
      case "datos": return renderDatos();
      case "generar": return renderGenerar();
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
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted">
            {isEdit ? "Editar Planificación" : "MÓDULO EXPERIMENTAL · FASE PILOTO (ZONA 6)"}
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {isEdit ? "Editar microcurricular por competencias · multigrado" : "Nueva microcurricular por competencias · multigrado"}
          </Text>
          <Text className="text-sm text-muted mt-1">
            Elige competencias del subnivel Inicial; la IA arma las semanas de cada grado.
          </Text>
        </View>

        {/* Progress links */}
        <View style={styles.progressLinks}>
          {PASOS.map((p, i) => {
            const currentIdx = PASOS.findIndex(x => x.key === paso);
            const isActive = p.key === paso;
            const isDone = i < currentIdx;
            return (
              <Pressable
                key={p.key}
                onPress={() => { if (i <= currentIdx) setPaso(p.key); }}
                style={styles.progressLink}
              >
                <Text style={{
                  fontSize: 13,
                  color: isActive ? colors.primary : isDone ? colors.success : colors.muted,
                  fontWeight: isActive ? "700" : "400",
                  textDecorationLine: isDone ? "line-through" : "none",
                }}>
                  {i + 1}. {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20 }}>{renderPasoActual()}</View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          {paso !== "contexto" ? (
            <Pressable
              onPress={retreatPaso}
              style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Anterior</Text>
            </Pressable>
          ) : <View />}

          {paso !== "generar" ? (
            <Pressable
              onPress={advancePaso}
              disabled={!canAdvance()}
              style={[styles.navBtn, { backgroundColor: canAdvance() ? colors.primary : colors.muted + "40" }]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Siguiente</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              style={[styles.navBtn, { backgroundColor: isPending ? colors.muted + "40" : colors.primary }]}
            >
              {isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Guardando…</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  ✨ {isEdit ? "Guardar Cambios" : "Generar planificación"}
                </Text>
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
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  sectionCounter: { fontSize: 13, fontWeight: "600" },
  helperText: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  row: { flexDirection: "row", gap: 12 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, gap: 6 },
  chipCode: { fontSize: 12, fontWeight: "700" },
  chipDesc: { fontSize: 11, maxWidth: 180 },
  chipX: { paddingLeft: 4 },
  listaContainer: { borderWidth: 1, borderRadius: 10, maxHeight: 300 },
  listaItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderBottomWidth: 1, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  listaCodigo: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  listaDesc: { fontSize: 12, lineHeight: 17 },
  ckBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  ckBadgeText: { fontSize: 10, fontWeight: "600" },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  toggleLabel: { fontSize: 14, fontWeight: "600" },
  toggleSub: { fontSize: 12, marginTop: 2 },
  summaryCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  summaryRow: { flexDirection: "row", marginBottom: 6, gap: 8 },
  summaryLabel: { fontSize: 13, fontWeight: "600", width: 100 },
  summaryValue: { fontSize: 13, flex: 1 },
  disclaimer: { borderRadius: 10, borderWidth: 1, padding: 14, borderStyle: "dashed" },
  disclaimerText: { fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  progressLinks: { flexDirection: "row", paddingHorizontal: 20, gap: 16, marginBottom: 16, marginTop: 4 },
  progressLink: {},
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12 },
  bottomBarInner: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
});
