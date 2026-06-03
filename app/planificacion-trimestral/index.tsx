import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAccess } from "@/lib/access-control";
import {
  TODAS_LAS_DESTREZAS,
  AREAS_INFO,
  filtrarPorAreaYSubnivel,
  Area,
  Subnivel,
} from "@/data";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "@/data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "@/data/pca-ejes-transversales";
import { DcdMultiSelector, DcdSeleccionada } from "@/components/DcdMultiSelector";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateUnitId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

async function getSessionId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const TRIMESTRES = [
  { value: "Primer Trimestre",   label: "Primer Trimestre"   },
  { value: "Segundo Trimestre",  label: "Segundo Trimestre"  },
  { value: "Tercer Trimestre",   label: "Tercer Trimestre"   },
] as const;

type TrimestreValue = typeof TRIMESTRES[number]["value"];

const AREAS_LIST: { code: Area; nombre: string }[] = [
  { code: "M",     nombre: "Matemática" },
  { code: "LL",    nombre: "Lengua y Literatura" },
  { code: "CN",    nombre: "Ciencias Naturales" },
  { code: "CS",    nombre: "Estudios Sociales" },
  { code: "EF",    nombre: "Educación Física" },
  { code: "ECA",   nombre: "Educación Cultural y Artística" },
  { code: "EFL",   nombre: "Lengua Extranjera (Inglés)" },
  { code: "CN.B",  nombre: "Biología" },
  { code: "CN.Q",  nombre: "Química" },
  { code: "CN.F",  nombre: "Física" },
  { code: "CS.H",  nombre: "Historia" },
  { code: "CS.F",  nombre: "Filosofía" },
  { code: "EG",    nombre: "Emprendimiento y Gestión" },
];

const SUBNIVELES: { value: Subnivel; label: string }[] = [
  { value: 2, label: "Básica Elemental (2.° - 4.°)" },
  { value: 3, label: "Básica Media (5.° - 7.°)" },
  { value: 4, label: "Básica Superior (8.° - 10.°)" },
  { value: 5, label: "Bachillerato General Unificado" },
];

const GRADOS_POR_SUBNIVEL: Record<number, string[]> = {
  2: ["2.° EGB", "3.° EGB", "4.° EGB"],
  3: ["5.° EGB", "6.° EGB", "7.° EGB"],
  4: ["8.° EGB", "9.° EGB", "10.° EGB"],
  5: ["1.° BGU", "2.° BGU", "3.° BGU"],
};

interface Unidad {
  id: string;
  numero: number;
  dcdsSeleccionadas: DcdSeleccionada[];
  duracionSemanas: number;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionTitle({ numero, titulo, colors }: { numero: string; titulo: string; colors: any }) {
  return (
    <View style={[styles.sectionHeader, { backgroundColor: "#003366" }]}>
      <Text style={styles.sectionNum}>{numero}</Text>
      <Text style={styles.sectionTitle}>{titulo}</Text>
    </View>
  );
}

function FieldLabel({ label, colors, tipo = "A" }: { label: string; colors: any; tipo?: "A" | "B" }) {
  if (tipo === "B") {
    return (
      <View style={{ marginBottom: 4 }}>
        <Text style={[styles.labelB, { color: "#3B6D11" }]}>✨ {label}</Text>
        <Text style={[styles.hintB, { color: "#5A8A1F" }]}>La IA genera esto automáticamente</Text>
      </View>
    );
  }
  return <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>;
}

function ChipSelector({
  items,
  selected,
  onToggle,
  colors,
}: {
  items: { id: string; nombre: string; emoji?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  colors: any;
}) {
  return (
    <View style={styles.chipsRow}>
      {items.map(item => {
        const active = selected.includes(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? "#003366" : colors.surface,
                borderColor: active ? "#003366" : colors.border,
              },
            ]}
          >
            <Text style={{ fontSize: 12, color: active ? "#fff" : colors.foreground }}>
              {item.emoji ? `${item.emoji} ` : ""}{item.nombre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SelectPicker({
  options,
  value,
  onSelect,
  placeholder,
  colors,
}: {
  options: { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
  placeholder: string;
  colors: any;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <View>
      <Pressable
        onPress={() => setOpen(!open)}
        style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        <Text style={{ color: selected ? colors.foreground : colors.muted, fontSize: 14 }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: colors.muted }}>▾</Text>
      </Pressable>
      {open && (
        <View style={[styles.pickerDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {options.map(o => (
            <Pressable
              key={o.value}
              onPress={() => { onSelect(o.value); setOpen(false); }}
              style={[styles.pickerOption, { borderBottomColor: colors.border }]}
            >
              <Text style={{ color: o.value === value ? "#003366" : colors.foreground, fontSize: 14 }}>
                {o.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function PlanificacionTrimestralScreen() {
  const colors = useColors();
  const router = useRouter();
  const generatePcaTrimestral = trpc.pcaTrimestral.generatePcaTrimestral.useMutation();
  const { subscribedEmail } = useAccess();

  // ── Sección 1: Datos informativos ──
  const [trimestre, setTrimestre] = useState<TrimestreValue | "">("");
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente]         = useState("");
  const [area, setArea]               = useState<Area | "">("");
  const [subnivel, setSubnivel]       = useState<Subnivel | 0>(0);
  const [grado, setGrado]             = useState("");
  const [anioLectivo, setAnioLectivo] = useState("2026-2027");
  const [paralelo, setParalelo]       = useState("");

  // ── Sección 2: Tiempo ──
  const [cargaHoraria, setCargaHoraria] = useState("5");
  const [semanasTotal, setSemanasTotal] = useState("13");   // ~1 trimestre
  const [semanasEval, setSemanasEval]   = useState("2");
  const totalSemanas  = Math.max(0, parseInt(semanasTotal || "0") - parseInt(semanasEval || "0"));
  const totalPeriodos = totalSemanas * parseInt(cargaHoraria || "0");

  // ── Sección 4: Ejes transversales ──
  const [usaEjes, setUsaEjes]                     = useState(false);
  const [ejesSeleccionados, setEjesSeleccionados] = useState<string[]>([]);

  // ── Sección 5: Unidades ──
  const [unidades, setUnidades] = useState<Unidad[]>([
    { id: generateUnitId(), numero: 1, dcdsSeleccionadas: [], duracionSemanas: 4 },
  ]);

  // ── Sección 6: Metodologías y evaluación ──
  const [metodologias, setMetodologias] = useState<string[]>([]);
  const [tecnicas, setTecnicas]         = useState<string[]>([]);

  // ── Modelo pedagógico ──
  const [modeloPedagogico, setModeloPedagogico] = useState<"ERCA" | "ACC">("ERCA");

  // ── Sección 7: Firmas ──
  const [firmaElab,      setFirmaElab]      = useState("");
  const [firmaElabFecha, setFirmaElabFecha] = useState("");
  const [firmaRev,       setFirmaRev]       = useState("");
  const [firmaRevFecha,  setFirmaRevFecha]  = useState("");
  const [firmaApro,      setFirmaApro]      = useState("");
  const [firmaAproFecha, setFirmaAproFecha] = useState("");

  // ── Destrezas disponibles ──
  const destrezasDisponibles = useMemo(() => {
    if (!area || !subnivel) return [];
    return filtrarPorAreaYSubnivel(area as Area, subnivel as Subnivel);
  }, [area, subnivel]);

  const gradosDisponibles = useMemo(() => {
    if (!subnivel) return [];
    return (GRADOS_POR_SUBNIVEL[subnivel] || []).map(g => ({ value: g, label: g }));
  }, [subnivel]);

  const toggleChip = useCallback((id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }, []);

  // ── Gestión de unidades ──
  const addUnidad = useCallback(() => {
    setUnidades(prev => [
      ...prev,
      { id: generateUnitId(), numero: prev.length + 1, dcdsSeleccionadas: [], duracionSemanas: 3 },
    ]);
  }, []);

  const removeUnidad = useCallback((id: string) => {
    setUnidades(prev => {
      const next = prev.filter(u => u.id !== id);
      return next.map((u, i) => ({ ...u, numero: i + 1 }));
    });
  }, []);

  const updateUnidad = useCallback((id: string, patch: Partial<Unidad>) => {
    setUnidades(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
  }, []);

  const handleAreaChange = useCallback((newArea: string) => {
    const anySelected = unidades.some(u => u.dcdsSeleccionadas.length > 0);
    if (anySelected) {
      const msg = "Cambiar el área borrará las destrezas seleccionadas. ¿Continuar?";
      if (Platform.OS === "web") {
        if (!confirm(msg)) return;
      } else {
        Alert.alert("Cambiar área", msg, [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, cambiar", style: "destructive",
            onPress: () => {
              setArea(newArea as Area);
              setSubnivel(0);
              setGrado("");
              setUnidades(prev => prev.map(u => ({ ...u, dcdsSeleccionadas: [] })));
            },
          },
        ]);
        return;
      }
      setUnidades(prev => prev.map(u => ({ ...u, dcdsSeleccionadas: [] })));
    }
    setArea(newArea as Area);
    setSubnivel(0);
    setGrado("");
  }, [unidades]);

  const handleSubnivelChange = useCallback((v: string) => {
    const anySelected = unidades.some(u => u.dcdsSeleccionadas.length > 0);
    const newSub = parseInt(v) as Subnivel;
    if (anySelected) {
      const msg = "Cambiar el subnivel borrará las destrezas. ¿Continuar?";
      if (Platform.OS === "web") {
        if (!confirm(msg)) return;
      } else {
        Alert.alert("Cambiar subnivel", msg, [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, cambiar",
            onPress: () => {
              setSubnivel(newSub);
              setGrado("");
              setUnidades(prev => prev.map(u => ({ ...u, dcdsSeleccionadas: [] })));
            },
          },
        ]);
        return;
      }
      setUnidades(prev => prev.map(u => ({ ...u, dcdsSeleccionadas: [] })));
    }
    setSubnivel(newSub);
    setGrado("");
  }, [unidades]);

  // ── Validación y envío ──
  const handleGenerar = useCallback(async () => {
    if (!trimestre)           return Alert.alert("Falta información", "Selecciona el trimestre.");
    if (!institucion.trim())  return Alert.alert("Falta información", "Ingresa el nombre de la institución.");
    if (!docente.trim())      return Alert.alert("Falta información", "Ingresa el nombre del docente.");
    if (!area)                return Alert.alert("Falta información", "Selecciona el área.");
    if (!subnivel)            return Alert.alert("Falta información", "Selecciona el subnivel.");
    if (!grado)               return Alert.alert("Falta información", "Selecciona el grado.");
    if (unidades.length === 0) return Alert.alert("Falta información", "Agrega al menos una unidad.");

    try {
      const sessionId = await getSessionId();

      const formData = {
        tipo: "trimestral" as const,
        trimestre: trimestre as TrimestreValue,
        institucion: institucion.trim(),
        docente: docente.trim(),
        area: area as Area,
        subnivel: subnivel as Subnivel,
        grado,
        anioLectivo: anioLectivo.trim(),
        paralelo: paralelo.trim(),
        cargaHorariaSemanal: parseInt(cargaHoraria) || 5,
        semanasTotal: parseInt(semanasTotal) || 13,
        semanasEvaluacion: parseInt(semanasEval) || 2,
        usaEjesTransversales: usaEjes,
        ejesTransversales: ejesSeleccionados,
        unidades: unidades.map(u => ({
          id: u.id,
          numero: u.numero,
          dcdsSeleccionadas: u.dcdsSeleccionadas,
          duracionSemanas: u.duracionSemanas,
        })),
        modeloPedagogico: modeloPedagogico,
        metodologiasActivas: metodologias,
        tecnicasEvaluacion: tecnicas,
        firmaElaboradoPor: firmaElab.trim(),
        firmaElaboradoFecha: firmaElabFecha.trim(),
        firmaRevisadoPor: firmaRev.trim(),
        firmaRevisadoFecha: firmaRevFecha.trim(),
        firmaAprobadoPor: firmaApro.trim(),
        firmaAprobadoFecha: firmaAproFecha.trim(),
      };

      const result = await generatePcaTrimestral.mutateAsync({
        sessionId,
        email: subscribedEmail ?? undefined,
        formData,
      });

      if (result.success && result.pcaId) {
        router.push(`/pca-trimestral-preview/${result.pcaId}` as any);
      } else {
        Alert.alert("Error", result.error || "No se pudo generar la PCT. Intenta de nuevo.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error de conexión. Verifica tu internet.");
    }
  }, [
    trimestre, institucion, docente, area, subnivel, grado, anioLectivo, paralelo,
    cargaHoraria, semanasTotal, semanasEval, usaEjes, ejesSeleccionados,
    unidades, modeloPedagogico, metodologias, tecnicas,
    firmaElab, firmaElabFecha, firmaRev, firmaRevFecha, firmaApro, firmaAproFecha,
  ]);

  const isGenerating = generatePcaTrimestral.isPending;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Planificación Curricular Trimestral
            </Text>
            <Text style={[styles.headerSub, { color: colors.muted }]}>Formato oficial MinEduc Ecuador</Text>
          </View>
        </View>

        {/* Leyenda */}
        <View style={[styles.leyenda, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.leyendaRow}>
            <View style={[styles.dot, { backgroundColor: "#7C3AED" }]} />
            <Text style={[styles.leyendaText, { color: colors.foreground }]}>El docente completa</Text>
          </View>
          <View style={styles.leyendaRow}>
            <View style={[styles.dotDashed, { borderColor: "#97C459" }]} />
            <Text style={[styles.leyendaText, { color: colors.foreground }]}>La IA genera automáticamente</Text>
          </View>
        </View>

        {/* ── SECCIÓN 1: Datos informativos ── */}
        <SectionTitle numero="1" titulo="Datos informativos" colors={colors} />
        <View style={styles.section}>

          <FieldLabel label="Trimestre" colors={colors} />
          <SelectPicker
            options={TRIMESTRES.map(t => ({ value: t.value, label: t.label }))}
            value={trimestre}
            onSelect={v => setTrimestre(v as TrimestreValue)}
            placeholder="Seleccionar trimestre..."
            colors={colors}
          />

          <View style={{ height: 10 }} />
          <FieldLabel label="Institución educativa" colors={colors} />
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={institucion} onChangeText={setInstitucion}
            placeholder="Nombre de la institución" placeholderTextColor={colors.muted}
          />

          <FieldLabel label="Nombre del docente(s)" colors={colors} />
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={docente} onChangeText={setDocente}
            placeholder="Nombre completo del docente" placeholderTextColor={colors.muted}
          />

          <FieldLabel label="Área / Asignatura" colors={colors} />
          <SelectPicker
            options={AREAS_LIST.map(a => ({ value: a.code, label: a.nombre }))}
            value={area}
            onSelect={handleAreaChange}
            placeholder="Seleccionar área..."
            colors={colors}
          />

          <View style={{ height: 10 }} />
          <FieldLabel label="Subnivel" colors={colors} />
          <SelectPicker
            options={SUBNIVELES.map(s => ({ value: String(s.value), label: s.label }))}
            value={subnivel ? String(subnivel) : ""}
            onSelect={handleSubnivelChange}
            placeholder="Seleccionar subnivel..."
            colors={colors}
          />

          {subnivel > 0 && (
            <>
              <View style={{ height: 10 }} />
              <FieldLabel label="Grado / Curso" colors={colors} />
              <SelectPicker
                options={gradosDisponibles}
                value={grado}
                onSelect={setGrado}
                placeholder="Seleccionar grado..."
                colors={colors}
              />
            </>
          )}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Año lectivo" colors={colors} />
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={anioLectivo} onChangeText={setAnioLectivo}
                placeholder="2026-2027" placeholderTextColor={colors.muted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Paralelo" colors={colors} />
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={paralelo} onChangeText={setParalelo}
                placeholder="A, B, C..." placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          {/* Objetivos generados por IA */}
          <View style={{ height: 12 }} />
          <FieldLabel label="Objetivos del trimestre" colors={colors} tipo="B" />
          <View style={[styles.iaField, { borderColor: "#97C459" }]}>
            <Text style={[styles.iaPlaceholder, { color: "#5A8A1F" }]}>
              Se generarán al presionar "Generar vista previa"
            </Text>
          </View>
        </View>

        {/* ── SECCIÓN 2: Tiempo ── */}
        <SectionTitle numero="2" titulo="Distribución del tiempo" colors={colors} />
        <View style={styles.section}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Carga horaria semanal" colors={colors} />
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={cargaHoraria} onChangeText={setCargaHoraria}
                keyboardType="number-pad" placeholder="5" placeholderTextColor={colors.muted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Semanas del trimestre" colors={colors} />
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={semanasTotal} onChangeText={setSemanasTotal}
                keyboardType="number-pad" placeholder="13" placeholderTextColor={colors.muted}
              />
            </View>
          </View>
          <FieldLabel label="Semanas evaluación e imprevistos" colors={colors} />
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={semanasEval} onChangeText={setSemanasEval}
            keyboardType="number-pad" placeholder="2" placeholderTextColor={colors.muted}
          />
          <View style={[styles.totalesBox, { backgroundColor: "#EAF3DE", borderColor: "#97C459" }]}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total semanas de clase:</Text>
              <Text style={styles.totalValue}>{totalSemanas}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total períodos:</Text>
              <Text style={styles.totalValue}>{totalPeriodos}</Text>
            </View>
          </View>
        </View>

        {/* ── SECCIÓN 3: Ejes transversales ── */}
        <SectionTitle numero="3" titulo="Ejes transversales" colors={colors} />
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: colors.foreground }]}>
              ¿Trabajar con ejes transversales?
            </Text>
            <Switch value={usaEjes} onValueChange={setUsaEjes} trackColor={{ true: "#003366" }} />
          </View>
          {usaEjes && (
            <ChipSelector
              items={EJES_TRANSVERSALES_PCA.map(e => ({ id: e.id, nombre: e.nombre, emoji: e.emoji }))}
              selected={ejesSeleccionados}
              onToggle={id => toggleChip(id, ejesSeleccionados, setEjesSeleccionados)}
              colors={colors}
            />
          )}
        </View>

        {/* ── SECCIÓN 4: Unidades ── */}
        <SectionTitle numero="4" titulo="Unidades del trimestre" colors={colors} />
        <View style={styles.section}>
          {unidades.map((unidad) => (
            <View
              key={unidad.id}
              style={[styles.unidadCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <View style={styles.unidadHeader}>
                <Text style={[styles.unidadNum, { color: "#003366" }]}>Unidad {unidad.numero}</Text>
                {unidades.length > 1 && (
                  <Pressable onPress={() => removeUnidad(unidad.id)}>
                    <Text style={{ color: "#DC2626", fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                )}
              </View>

              <FieldLabel label="Título de la unidad" colors={colors} tipo="B" />
              <View style={[styles.iaField, { borderColor: "#97C459" }]}>
                <Text style={[styles.iaPlaceholder, { color: "#5A8A1F" }]}>La IA lo genera</Text>
              </View>
              <View style={{ height: 6 }} />
              <FieldLabel label="Objetivos específicos" colors={colors} tipo="B" />
              <View style={[styles.iaField, { borderColor: "#97C459" }]}>
                <Text style={[styles.iaPlaceholder, { color: "#5A8A1F" }]}>La IA los genera</Text>
              </View>
              <View style={{ height: 6 }} />
              <FieldLabel label="Contenidos / Orientaciones / Evaluación" colors={colors} tipo="B" />
              <View style={[styles.iaField, { borderColor: "#97C459" }]}>
                <Text style={[styles.iaPlaceholder, { color: "#5A8A1F" }]}>La IA los genera</Text>
              </View>

              <View style={{ height: 10 }} />
              <FieldLabel label="Destrezas con Criterios de Desempeño (DCD)" colors={colors} />
              {destrezasDisponibles.length === 0 ? (
                <Text style={[styles.hint, { color: colors.muted }]}>
                  Selecciona Área + Subnivel + Grado en la Sección 1 para ver las DCD disponibles.
                </Text>
              ) : (
                <DcdMultiSelector
                  destrezas={destrezasDisponibles}
                  value={unidad.dcdsSeleccionadas}
                  onChange={sel => updateUnidad(unidad.id, { dcdsSeleccionadas: sel })}
                />
              )}

              <View style={{ height: 10 }} />
              <FieldLabel label="Duración (semanas)" colors={colors} />
              <TextInput
                style={[styles.inputSmall, { color: colors.foreground, borderColor: colors.border }]}
                value={String(unidad.duracionSemanas)}
                onChangeText={v => updateUnidad(unidad.id, { duracionSemanas: parseInt(v) || 1 })}
                keyboardType="number-pad"
                placeholder="3"
                placeholderTextColor={colors.muted}
              />
            </View>
          ))}

          <Pressable
            onPress={addUnidad}
            style={[styles.addUnitBtn, { borderColor: "#003366" }]}
          >
            <Text style={{ color: "#003366", fontWeight: "700" }}>+ Agregar unidad</Text>
          </Pressable>
        </View>

        {/* ── SECCIÓN 5: Metodologías y evaluación ── */}
        <SectionTitle numero="5" titulo="Metodologías y evaluación" colors={colors} />
        <View style={styles.section}>
          <FieldLabel label="Modelo pedagógico" colors={colors} />
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
            {(["ERCA", "ACC"] as const).map(modelo => (
              <Pressable
                key={modelo}
                onPress={() => setModeloPedagogico(modelo)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center",
                  borderWidth: 2,
                  borderColor: modeloPedagogico === modelo ? "#003366" : colors.border,
                  backgroundColor: modeloPedagogico === modelo ? "#003366" : colors.surface,
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 15, color: modeloPedagogico === modelo ? "#fff" : colors.foreground }}>
                  {modelo}
                </Text>
                <Text style={{ fontSize: 10, color: modeloPedagogico === modelo ? "#CCDEFF" : colors.muted, marginTop: 2, textAlign: "center" }}>
                  {modelo === "ERCA"
                    ? "Experiencia · Reflexión
Conceptualización · Aplicación"
                    : "Anticipación · Construcción
Consolidación"}
                </Text>
              </Pressable>
            ))}
          </View>

                    <FieldLabel label="Metodologías activas" colors={colors} />
          <ChipSelector
            items={METODOLOGIAS_ACTIVAS.map(m => ({ id: m.id, nombre: m.nombre }))}
            selected={metodologias}
            onToggle={id => toggleChip(id, metodologias, setMetodologias)}
            colors={colors}
          />

          <View style={{ height: 12 }} />
          <FieldLabel label="Técnicas e instrumentos de evaluación" colors={colors} />
          <ChipSelector
            items={TECNICAS_EVALUACION.map(t => ({ id: t.id, nombre: t.nombre }))}
            selected={tecnicas}
            onToggle={id => toggleChip(id, tecnicas, setTecnicas)}
            colors={colors}
          />
        </View>

        {/* ── SECCIÓN 6: Bibliografía ── */}
        <SectionTitle numero="6" titulo="Bibliografía" colors={colors} />
        <View style={styles.section}>
          <View style={[styles.bibliografiaInfo, { backgroundColor: "#EAF3DE", borderColor: "#97C459" }]}>
            <Text style={{ fontSize: 13, color: "#3B6D11", fontWeight: "600", marginBottom: 4 }}>
              📖 Bibliografía — completada por el docente
            </Text>
            <Text style={{ fontSize: 12, color: "#5A8A1F", lineHeight: 18 }}>
              El documento Word y PDF incluirán líneas en blanco para que el docente complete las referencias bibliográficas (normas APA) directamente en el archivo descargado.
            </Text>
          </View>
        </View>

        {/* ── SECCIÓN 7: Firmas ── */}
        <SectionTitle numero="7" titulo="Firmas de aprobación" colors={colors} />
        <View style={styles.section}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              { label: "Elaborado por", val: firmaElab, setVal: setFirmaElab, fecha: firmaElabFecha, setFecha: setFirmaElabFecha },
              { label: "Revisado por",  val: firmaRev,  setVal: setFirmaRev,  fecha: firmaRevFecha,  setFecha: setFirmaRevFecha  },
              { label: "Aprobado por",  val: firmaApro, setVal: setFirmaApro, fecha: firmaAproFecha, setFecha: setFirmaAproFecha },
            ].map(f => (
              <View key={f.label} style={{ flex: 1 }}>
                <Text style={[styles.labelSmall, { color: colors.muted }]}>{f.label}</Text>
                <TextInput
                  style={[styles.inputSmall, { color: colors.foreground, borderColor: colors.border }]}
                  value={f.val} onChangeText={f.setVal}
                  placeholder="Nombre" placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.inputSmall, { color: colors.foreground, borderColor: colors.border }]}
                  value={f.fecha} onChangeText={f.setFecha}
                  placeholder="DD/MM/AAAA" placeholderTextColor={colors.muted}
                />
              </View>
            ))}
          </View>
        </View>

        {/* ── Botón Generar ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <Pressable
            onPress={handleGenerar}
            disabled={isGenerating}
            style={({ pressed }) => [
              styles.btnGenerar,
              { opacity: pressed || isGenerating ? 0.8 : 1 },
            ]}
          >
            {isGenerating ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.btnGenerarText}>Generando tu PCT...</Text>
              </View>
            ) : (
              <Text style={styles.btnGenerarText}>🚀 Generar vista previa de mi PCT</Text>
            )}
          </Pressable>
          {isGenerating && (
            <Text style={[styles.generatingHint, { color: colors.muted }]}>
              Alineando al currículo MinEduc... esto puede tomar hasta 30 segundos
            </Text>
          )}
          <Text style={[styles.freeHint, { color: colors.muted }]}>
            ✨ La generación es gratuita. Solo pagas si decides descargar el documento completo ($9.99).
          </Text>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  headerBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, marginTop: 1 },
  leyenda: { margin: 16, borderRadius: 10, padding: 12, borderWidth: 1, flexDirection: "row", gap: 20, flexWrap: "wrap" },
  leyendaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotDashed: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderStyle: "dashed" },
  leyendaText: { fontSize: 12, fontWeight: "500" },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, marginTop: 8, gap: 10 },
  sectionNum: { color: "#fff", fontWeight: "900", fontSize: 14, width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 22 },
  sectionTitle: { color: "#fff", fontWeight: "700", fontSize: 14 },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 5, marginTop: 6 },
  labelSmall: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  labelB: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  hintB: { fontSize: 11, fontStyle: "italic", marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 4 },
  inputSmall: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, marginBottom: 4 },
  iaField: { borderWidth: 0.5, borderStyle: "dashed", borderRadius: 8, padding: 12, backgroundColor: "#EAF3DE", minHeight: 38, justifyContent: "center" },
  iaPlaceholder: { fontSize: 12, fontStyle: "italic" },
  picker: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pickerDropdown: { borderWidth: 1, borderRadius: 10, marginTop: 4, overflow: "hidden", zIndex: 100 },
  pickerOption: { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  toggleLabel: { fontSize: 14, fontWeight: "600", flex: 1 },
  totalesBox: { borderWidth: 1, borderRadius: 10, padding: 14, marginTop: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  totalLabel: { fontSize: 13, color: "#3B6D11", fontWeight: "600" },
  totalValue: { fontSize: 16, color: "#003366", fontWeight: "800" },
  unidadCard: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14 },
  unidadHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  unidadNum: { fontSize: 15, fontWeight: "800" },
  addUnitBtn: { borderWidth: 1.5, borderStyle: "dashed", borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  hint: { fontSize: 12, fontStyle: "italic", marginVertical: 8 },
  bibliografiaInfo: { borderWidth: 1, borderRadius: 10, padding: 14 },
  btnGenerar: { backgroundColor: "#003366", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnGenerarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  generatingHint: { textAlign: "center", fontSize: 12, marginTop: 8, fontStyle: "italic" },
  freeHint: { textAlign: "center", fontSize: 12, marginTop: 10, marginBottom: 4 },
});
