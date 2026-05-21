import { useState, useCallback } from "react";
import {
  Text, View, ScrollView, TextInput, StyleSheet, Alert, Platform,
  ActivityIndicator, Switch, Pressable, FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import {
  buscarDestrezas, AREAS_INFO, SUBNIVEL_NAMES, SUBNIVEL_GRADOS,
  obtenerInsercionesPorAsignatura, COMPETENCIAS, METODOLOGIAS_ACTIVAS,
  TECNICAS_EVALUACION, HABILIDADES_SOCIOEMOCIONALES, obtenerNombreBloque,
} from "@/data";
import type { Destreza, ConfiguracionDia, HoraSemanal, PlanificacionSemanal, TemaSugerido, DUAActividad } from "@/data/types";
import { trpc } from "@/lib/trpc";

// ─── Colores DUA fijos ───────────────────────────────────────
const DUA_ROSADO = "#EC4899";
const DUA_AZUL   = "#1E3A5F";
const DUA_VERDE  = "#22C55E";

const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaSemanaKey = typeof DIAS_SEMANA[number];
const DIA_LABEL: Record<DiaSemanaKey, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes",
};
const DIA_EMOJI: Record<DiaSemanaKey, string> = {
  lunes: "🟦", martes: "🟩", miercoles: "🟨", jueves: "🟧", viernes: "🟥",
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getTodayDate() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function getLunesDeEstaSemana(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function getViernesDeEstaSemana(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -2 : 5 - day;
  d.setDate(d.getDate() + diff);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function makeHora(): HoraSemanal {
  return {
    id: generateId(),
    codigoDestreza: "",
    destreza: null,
    tema: "",
    temasAlternativos: [],
    temaSeleccionado: null,
    habilidadesSocioemocionales: [],
    usaEjesTransversales: false,
    insercionesCurriculares: [],
    usaCompetencias: false,
    competencias: [],
    metodologiasActivas: [],
    tecnicasEvaluacion: [],
  };
}

function makeDia(activo = true): ConfiguracionDia {
  return { activo, cantidadHoras: 1, horas: [makeHora()] };
}

type Paso = "configuracion" | "generando" | "resultado";

type DiasState = Record<DiaSemanaKey, ConfiguracionDia>;

// ─── Componente principal ────────────────────────────────────
export default function PlanificarSemanalScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addSemana } = usePlanificaciones();

  // ── Paso de flujo ──
  const [paso, setPaso] = useState<Paso>("configuracion");

  // ── Datos generales ──
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState("");
  const [nivel, setNivel] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [periodoPedagogico, setPeriodoPedagogico] = useState("");
  const [trimestre, setTrimestre] = useState("Primero");
  const [semanaInicio, setSemanaInicio] = useState(getLunesDeEstaSemana());
  const [semanaFin, setSemanaFin] = useState(getViernesDeEstaSemana());

  // ── Configuración por día ──
  const [dias, setDias] = useState<DiasState>({
    lunes: makeDia(true),
    martes: makeDia(true),
    miercoles: makeDia(true),
    jueves: makeDia(true),
    viernes: makeDia(true),
  });

  // ── Resultado generado ──
  const [diasConPlanes, setDiasConPlanes] = useState<Record<string, { horaIndex: number; plan: any }[]>>({});
  const [tabActivo, setTabActivo] = useState<DiaSemanaKey>("lunes");
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  // ── tRPC ──
  const generateWeekMutation = trpc.topics.generateWeekPlan.useMutation();
  const generateAiMutation = trpc.topics.generateAi.useMutation();

  // ─── Helpers para editar días/horas ───────────────────────

  const updateDia = useCallback((dia: DiaSemanaKey, update: Partial<ConfiguracionDia>) => {
    setDias(prev => ({ ...prev, [dia]: { ...prev[dia], ...update } }));
  }, []);

  const updateHora = useCallback((dia: DiaSemanaKey, horaId: string, update: Partial<HoraSemanal>) => {
    setDias(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        horas: prev[dia].horas.map(h => h.id === horaId ? { ...h, ...update } : h),
      },
    }));
  }, []);

  const setCantidadHoras = useCallback((dia: DiaSemanaKey, cantidad: 1 | 2 | 3) => {
    setDias(prev => {
      const current = prev[dia];
      let horas = [...current.horas];
      while (horas.length < cantidad) horas.push(makeHora());
      horas = horas.slice(0, cantidad);
      return { ...prev, [dia]: { ...current, cantidadHoras: cantidad, horas } };
    });
  }, []);

  const copiarAlSiguienteDia = useCallback((dia: DiaSemanaKey) => {
    const idx = DIAS_SEMANA.indexOf(dia);
    if (idx === DIAS_SEMANA.length - 1) return;
    const siguiente = DIAS_SEMANA[idx + 1];
    const origen = dias[dia];
    setDias(prev => ({
      ...prev,
      [siguiente]: {
        ...origen,
        horas: origen.horas.map(h => ({
          ...makeHora(),
          codigoDestreza: h.codigoDestreza,
          destreza: h.destreza,
          tema: h.tema,
          habilidadesSocioemocionales: [...h.habilidadesSocioemocionales],
          usaEjesTransversales: h.usaEjesTransversales,
          insercionesCurriculares: [...h.insercionesCurriculares],
          usaCompetencias: h.usaCompetencias,
          competencias: [...h.competencias],
          metodologiasActivas: [...h.metodologiasActivas],
          tecnicasEvaluacion: [...h.tecnicasEvaluacion],
        })),
      },
    }));
  }, [dias]);

  const toggleChipHora = useCallback((
    dia: DiaSemanaKey,
    horaId: string,
    field: "habilidadesSocioemocionales" | "insercionesCurriculares" | "competencias" | "metodologiasActivas" | "tecnicasEvaluacion",
    id: string
  ) => {
    setDias(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        horas: prev[dia].horas.map(h => {
          if (h.id !== horaId) return h;
          const current = h[field] as string[];
          return { ...h, [field]: current.includes(id) ? current.filter(x => x !== id) : [...current, id] };
        }),
      },
    }));
  }, []);

  const toggleBoolHora = useCallback((
    dia: DiaSemanaKey,
    horaId: string,
    field: "usaEjesTransversales" | "usaCompetencias"
  ) => {
    setDias(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        horas: prev[dia].horas.map(h =>
          h.id === horaId ? { ...h, [field]: !h[field] } : h
        ),
      },
    }));
  }, []);

  // ─── Sugerir temas para una hora ─────────────────────────

  const sugerirTemas = useCallback(async (dia: DiaSemanaKey, horaId: string) => {
    const hora = dias[dia].horas.find(h => h.id === horaId);
    if (!hora?.destreza || !hora.tema.trim()) return;
    try {
      const result = await generateAiMutation.mutateAsync({
        codigoDestreza: hora.destreza.codigo,
        descripcionDestreza: hora.destreza.descripcion,
        area: hora.destreza.area,
        bloque: obtenerNombreBloque(hora.destreza.area, hora.destreza.bloque),
        subnivel: hora.destreza.subnivel,
        temaDocente: hora.tema.trim(),
        temasExistentes: [hora.tema.trim()],
      });
      if (result.success && result.temas.length > 0) {
        updateHora(dia, horaId, { temasAlternativos: result.temas as TemaSugerido[] });
      }
    } catch (err: any) {
      console.error("Error sugerirTemas:", err);
    }
  }, [dias, generateAiMutation, updateHora]);

  // ─── Generación semanal ───────────────────────────────────

  const handleGenerarSemana = async () => {
    if (!docente.trim()) {
      const msg = "Por favor ingresa el nombre del docente";
      Platform.OS === "web" ? alert(msg) : Alert.alert("", msg);
      return;
    }

    const inputDias: any[] = [];
    for (const dia of DIAS_SEMANA) {
      const config = dias[dia];
      if (!config.activo) continue;
      const horasValidas = config.horas.filter(h => h.destreza && h.tema.trim());
      if (horasValidas.length === 0) continue;
      inputDias.push({
        dia,
        horas: horasValidas.map((h, i) => ({
          horaIndex: i,
          codigoDestreza: h.destreza!.codigo,
          descripcionDestreza: h.destreza!.descripcion,
          area: h.destreza!.area,
          bloque: obtenerNombreBloque(h.destreza!.area, h.destreza!.bloque),
          subnivel: h.destreza!.subnivel,
          tema: h.temaSeleccionado?.titulo || h.tema,
          ejesTransversales: h.usaEjesTransversales ? h.insercionesCurriculares : [],
          competencias: h.usaCompetencias ? h.competencias : [],
          metodologias: h.metodologiasActivas,
        })),
      });
    }

    if (inputDias.length === 0) {
      const msg = "Activa al menos un día con destreza y tema";
      Platform.OS === "web" ? alert(msg) : Alert.alert("", msg);
      return;
    }

    setPaso("generando");
    setErrorGeneral(null);

    try {
      const result = await generateWeekMutation.mutateAsync({ dias: inputDias });
      if (result.success) {
        setDiasConPlanes(result.diasConPlanes as any);
        // Activar primer día activo
        const primerDiaActivo = DIAS_SEMANA.find(d => dias[d].activo && result.diasConPlanes[d]);
        if (primerDiaActivo) setTabActivo(primerDiaActivo);
        setPaso("resultado");
      } else {
        setErrorGeneral((result as any).error || "Error al generar");
        setPaso("configuracion");
      }
    } catch (err: any) {
      setErrorGeneral(err.message || "Error inesperado");
      setPaso("configuracion");
    }
  };

  const regenerarHora = async (dia: DiaSemanaKey, horaIndex: number) => {
    const config = dias[dia];
    const hora = config.horas[horaIndex];
    if (!hora?.destreza) return;
    try {
      const result = await generateWeekMutation.mutateAsync({
        dias: [{
          dia,
          horas: [{
            horaIndex,
            codigoDestreza: hora.destreza.codigo,
            descripcionDestreza: hora.destreza.descripcion,
            area: hora.destreza.area,
            bloque: obtenerNombreBloque(hora.destreza.area, hora.destreza.bloque),
            subnivel: hora.destreza.subnivel,
            tema: hora.temaSeleccionado?.titulo || hora.tema,
            ejesTransversales: hora.usaEjesTransversales ? hora.insercionesCurriculares : [],
            competencias: hora.usaCompetencias ? hora.competencias : [],
            metodologias: hora.metodologiasActivas,
          }],
        }],
      });
      if (result.success && result.diasConPlanes[dia]) {
        setDiasConPlanes(prev => ({
          ...prev,
          [dia]: (prev[dia] || []).map(h =>
            h.horaIndex === horaIndex
              ? { ...h, plan: result.diasConPlanes[dia][0]?.plan }
              : h
          ),
        }));
      }
    } catch (err: any) {
      console.error("Error regenerarHora:", err);
    }
  };

  const handleGuardar = async () => {
    const now = new Date().toISOString();
    const semana: PlanificacionSemanal = {
      id: generateId(),
      fecha: getTodayDate(),
      semanaInicio,
      semanaFin,
      institucion,
      docente,
      grado,
      nivel,
      paralelo,
      periodoPedagogico,
      trimestre,
      periodos: "1",
      duaRepresentacion: "",
      duaAccionExpresion: "",
      duaImplicacion: "",
      pctVisual: "",
      pctAuditivo: "",
      pctLectorEscritor: "",
      pctKinestesico: "",
      dias: {
        lunes: {
          ...dias.lunes,
          horas: dias.lunes.horas.map((h, i) => ({
            ...h,
            temaSeleccionado: diasConPlanes.lunes?.[i] ? {
              id: h.temaSeleccionado?.id || generateId(),
              titulo: h.temaSeleccionado?.titulo || h.tema,
              descripcionBreve: "",
              objetivoClase: diasConPlanes.lunes[i]?.plan?.objetivoClase || "",
              estructura: diasConPlanes.lunes[i]?.plan?.estructura,
              recursos: diasConPlanes.lunes[i]?.plan?.recursos || [],
              evaluacionFormativa: diasConPlanes.lunes[i]?.plan?.evaluacionFormativa || "",
            } : h.temaSeleccionado,
          })),
        },
        martes: {
          ...dias.martes,
          horas: dias.martes.horas.map((h, i) => ({
            ...h,
            temaSeleccionado: diasConPlanes.martes?.[i] ? {
              id: h.temaSeleccionado?.id || generateId(),
              titulo: h.temaSeleccionado?.titulo || h.tema,
              descripcionBreve: "",
              objetivoClase: diasConPlanes.martes[i]?.plan?.objetivoClase || "",
              estructura: diasConPlanes.martes[i]?.plan?.estructura,
              recursos: diasConPlanes.martes[i]?.plan?.recursos || [],
              evaluacionFormativa: diasConPlanes.martes[i]?.plan?.evaluacionFormativa || "",
            } : h.temaSeleccionado,
          })),
        },
        miercoles: {
          ...dias.miercoles,
          horas: dias.miercoles.horas.map((h, i) => ({
            ...h,
            temaSeleccionado: diasConPlanes.miercoles?.[i] ? {
              id: h.temaSeleccionado?.id || generateId(),
              titulo: h.temaSeleccionado?.titulo || h.tema,
              descripcionBreve: "",
              objetivoClase: diasConPlanes.miercoles[i]?.plan?.objetivoClase || "",
              estructura: diasConPlanes.miercoles[i]?.plan?.estructura,
              recursos: diasConPlanes.miercoles[i]?.plan?.recursos || [],
              evaluacionFormativa: diasConPlanes.miercoles[i]?.plan?.evaluacionFormativa || "",
            } : h.temaSeleccionado,
          })),
        },
        jueves: {
          ...dias.jueves,
          horas: dias.jueves.horas.map((h, i) => ({
            ...h,
            temaSeleccionado: diasConPlanes.jueves?.[i] ? {
              id: h.temaSeleccionado?.id || generateId(),
              titulo: h.temaSeleccionado?.titulo || h.tema,
              descripcionBreve: "",
              objetivoClase: diasConPlanes.jueves[i]?.plan?.objetivoClase || "",
              estructura: diasConPlanes.jueves[i]?.plan?.estructura,
              recursos: diasConPlanes.jueves[i]?.plan?.recursos || [],
              evaluacionFormativa: diasConPlanes.jueves[i]?.plan?.evaluacionFormativa || "",
            } : h.temaSeleccionado,
          })),
        },
        viernes: {
          ...dias.viernes,
          horas: dias.viernes.horas.map((h, i) => ({
            ...h,
            temaSeleccionado: diasConPlanes.viernes?.[i] ? {
              id: h.temaSeleccionado?.id || generateId(),
              titulo: h.temaSeleccionado?.titulo || h.tema,
              descripcionBreve: "",
              objetivoClase: diasConPlanes.viernes[i]?.plan?.objetivoClase || "",
              estructura: diasConPlanes.viernes[i]?.plan?.estructura,
              recursos: diasConPlanes.viernes[i]?.plan?.recursos || [],
              evaluacionFormativa: diasConPlanes.viernes[i]?.plan?.evaluacionFormativa || "",
            } : h.temaSeleccionado,
          })),
        },
      },
      createdAt: now,
      updatedAt: now,
    };
    await addSemana(semana);
    router.replace(`/ver-semana/${semana.id}` as any);
  };

  // ─── RENDER ───────────────────────────────────────────────

  if (paso === "generando") {
    return (
      <ScreenContainer edges={["top","bottom","left","right"]} className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 24, textAlign: "center" }}>
            Generando planificación semanal...
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted, marginTop: 8, textAlign: "center" }}>
            La IA está trabajando en paralelo para cada hora de clase.{"\n"}Esto puede tomar entre 15 y 40 segundos.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (paso === "resultado") {
    return <ResultadoView
      colors={colors}
      dias={dias}
      diasConPlanes={diasConPlanes}
      tabActivo={tabActivo}
      setTabActivo={setTabActivo}
      onRegenerarHora={regenerarHora}
      onGuardar={handleGuardar}
      onVolver={() => setPaso("configuracion")}
      isGuardando={false}
    />;
  }

  // ── PASO CONFIGURACIÓN ──────────────────────────────────
  return (
    <ScreenContainer edges={["top","bottom","left","right"]} className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}>
            <Text style={{ fontSize: 18 }}>{"←"}</Text>
            <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>Atrás</Text>
          </Pressable>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>Planificación Semanal</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>2026 - 2027 · 5 días de clase</Text>
        </View>

        {errorGeneral && (
          <View style={styles.errorBanner}>
            <Text style={{ color: "#DC2626", fontSize: 13 }}>{"⚠️"} {errorGeneral}</Text>
          </View>
        )}

        {/* ── SECCIÓN 1: Datos informativos ── */}
        <SectionHeader title="1. Datos Informativos" emoji="ℹ️" colors={colors} />
        <View style={[styles.sectionBody, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: 20 }]}>
          <FieldLabel label="Institución Educativa" colors={colors} />
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={institucion} onChangeText={setInstitucion} placeholder="Nombre de la institución"
            placeholderTextColor={colors.muted} />

          <FieldLabel label="Nombre Docente *" colors={colors} />
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={docente} onChangeText={setDocente} placeholder="Nombre completo"
            placeholderTextColor={colors.muted} />

          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Grado/Curso" colors={colors} />
              <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={grado} onChangeText={setGrado} placeholder="Ej: 8vo EGB"
                placeholderTextColor={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Paralelo" colors={colors} />
              <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={paralelo} onChangeText={setParalelo} placeholder="A, B, C..."
                placeholderTextColor={colors.muted} />
            </View>
          </View>

          <FieldLabel label="Período Pedagógico" colors={colors} />
          <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            value={periodoPedagogico} onChangeText={setPeriodoPedagogico} placeholder="Ej: Cívica y ética"
            placeholderTextColor={colors.muted} />

          <FieldLabel label="Trimestre" colors={colors} />
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["Primero", "Segundo", "Tercero"].map(t => (
              <Pressable key={t} onPress={() => setTrimestre(t)}
                style={[styles.trimestreBtn, { borderColor: trimestre === t ? "#003366" : colors.border, backgroundColor: trimestre === t ? "#003366" : colors.surface }]}>
                <Text style={{ color: trimestre === t ? "#fff" : colors.foreground, fontSize: 12, fontWeight: "600" }}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Semana inicio" colors={colors} />
              <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={semanaInicio} onChangeText={setSemanaInicio} placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Semana fin" colors={colors} />
              <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={semanaFin} onChangeText={setSemanaFin} placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.muted} />
            </View>
          </View>
        </View>

        {/* ── SECCIÓN 2: Configuración por día ── */}
        <SectionHeader title="2. Configuración por Día" emoji="📅" colors={colors} />
        {DIAS_SEMANA.map((dia, diaIdx) => (
          <DiaConfigBlock
            key={dia}
            dia={dia}
            config={dias[dia]}
            colors={colors}
            isLast={diaIdx === DIAS_SEMANA.length - 1}
            onToggleActivo={() => updateDia(dia, { activo: !dias[dia].activo })}
            onSetCantidadHoras={(n) => setCantidadHoras(dia, n)}
            onUpdateHora={(horaId, update) => updateHora(dia, horaId, update)}
            onSugerirTemas={(horaId) => sugerirTemas(dia, horaId)}
            onToggleChipHora={(horaId, field, id) => toggleChipHora(dia, horaId, field, id)}
            onToggleBoolHora={(horaId, field) => toggleBoolHora(dia, horaId, field)}
            onCopiarAlSiguiente={() => copiarAlSiguienteDia(dia)}
          />
        ))}

        {/* ── Botón generar ── */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Pressable
            onPress={handleGenerarSemana}
            style={({ pressed }) => [styles.btnGenerar, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={{ fontSize: 20 }}>🚀</Text>
            <Text style={styles.btnGenerarText}>Generar Planificación Semanal</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Subcomponente: bloque de configuración de un día ────────

function DiaConfigBlock({
  dia, config, colors, isLast,
  onToggleActivo, onSetCantidadHoras, onUpdateHora, onSugerirTemas,
  onToggleChipHora, onToggleBoolHora, onCopiarAlSiguiente,
}: {
  dia: DiaSemanaKey;
  config: ConfiguracionDia;
  colors: any;
  isLast: boolean;
  onToggleActivo: () => void;
  onSetCantidadHoras: (n: 1 | 2 | 3) => void;
  onUpdateHora: (horaId: string, update: Partial<HoraSemanal>) => void;
  onSugerirTemas: (horaId: string) => void;
  onToggleChipHora: (horaId: string, field: "habilidadesSocioemocionales" | "insercionesCurriculares" | "competencias" | "metodologiasActivas" | "tecnicasEvaluacion", id: string) => void;
  onToggleBoolHora: (horaId: string, field: "usaEjesTransversales" | "usaCompetencias") => void;
  onCopiarAlSiguiente: () => void;
}) {
  const [expandido, setExpandido] = useState(true);

  return (
    <View style={[styles.diaBlock, { borderColor: colors.border, marginHorizontal: 20 }]}>
      {/* Header del día */}
      <Pressable onPress={() => setExpandido(e => !e)} style={styles.diaHeader}>
        <Text style={{ fontSize: 18 }}>{DIA_EMOJI[dia]}</Text>
        <Text style={[styles.diaTitulo, { color: colors.foreground }]}>{DIA_LABEL[dia]}</Text>
        <Switch value={config.activo} onValueChange={onToggleActivo}
          trackColor={{ false: "#ccc", true: "#003366" }} thumbColor="#fff" />
        <Text style={{ color: colors.muted, marginLeft: 8 }}>{expandido ? "▲" : "▼"}</Text>
      </Pressable>

      {expandido && config.activo && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
          {/* Número de horas */}
          <Text style={[styles.fieldLabel, { color: colors.muted, marginBottom: 6 }]}>Número de horas:</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
            {([1, 2, 3] as const).map(n => (
              <Pressable key={n} onPress={() => onSetCantidadHoras(n)}
                style={[styles.horaBtn, { borderColor: config.cantidadHoras === n ? "#003366" : colors.border, backgroundColor: config.cantidadHoras === n ? "#003366" : colors.surface }]}>
                <Text style={{ color: config.cantidadHoras === n ? "#fff" : colors.foreground, fontWeight: "700" }}>{n}</Text>
              </Pressable>
            ))}
          </View>

          {/* Horas */}
          {config.horas.map((hora, horaIdx) => (
            <HoraBlock key={hora.id} hora={hora} horaIdx={horaIdx} colors={colors}
              onUpdate={(update) => onUpdateHora(hora.id, update)}
              onSugerirTemas={() => onSugerirTemas(hora.id)}
              onToggleChip={(field, id) => onToggleChipHora(hora.id, field, id)}
              onToggleBool={(field) => onToggleBoolHora(hora.id, field)} />
          ))}

          {/* Copiar al siguiente */}
          {!isLast && (
            <Pressable onPress={onCopiarAlSiguiente}
              style={({ pressed }) => [styles.btnCopiar, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
              <Text style={{ fontSize: 14 }}>📋</Text>
              <Text style={{ color: colors.foreground, fontSize: 13, marginLeft: 6 }}>Copiar configuración al siguiente día</Text>
            </Pressable>
          )}
        </View>
      )}

      {expandido && !config.activo && (
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>Día desactivado — no se generará planificación</Text>
        </View>
      )}
    </View>
  );
}

// ─── Subcomponente: una hora dentro de un día ────────────────

function HoraBlock({
  hora, horaIdx, colors, onUpdate, onSugerirTemas, onToggleChip, onToggleBool,
}: {
  hora: HoraSemanal;
  horaIdx: number;
  colors: any;
  onUpdate: (update: Partial<HoraSemanal>) => void;
  onSugerirTemas: () => void;
  onToggleChip: (field: "habilidadesSocioemocionales" | "insercionesCurriculares" | "competencias" | "metodologiasActivas" | "tecnicasEvaluacion", id: string) => void;
  onToggleBool: (field: "usaEjesTransversales" | "usaCompetencias") => void;
}) {
  const [busqueda, setBusqueda] = useState(hora.codigoDestreza);
  const [resultados, setResultados] = useState<Destreza[]>([]);
  const [buscando, setBuscando] = useState(false);

  const handleBuscarDestreza = (q: string) => {
    setBusqueda(q);
    if (q.length < 2) { setResultados([]); return; }
    const found = buscarDestrezas(q).slice(0, 8);
    setResultados(found);
    setBuscando(found.length > 0);
  };

  const handleSeleccionarDestreza = (d: Destreza) => {
    setBusqueda(d.codigo);
    setResultados([]);
    setBuscando(false);
    onUpdate({ codigoDestreza: d.codigo, destreza: d });
  };

  const areaInfo = hora.destreza ? AREAS_INFO[hora.destreza.area] : null;

  return (
    <View style={[styles.horaBlock, { borderColor: colors.border }]}>
      <Text style={[styles.horaTitulo, { color: colors.foreground }]}>— Hora {horaIdx + 1} —</Text>

      {/* Búsqueda de destreza */}
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>DCD (Destreza con Criterio de Desempeño)</Text>
      <TextInput
        style={[styles.input, { color: colors.foreground, borderColor: hora.destreza ? "#22C55E" : colors.border }]}
        value={busqueda}
        onChangeText={handleBuscarDestreza}
        placeholder="Busca por código o descripción... ej: M.4.1.1"
        placeholderTextColor={colors.muted}
      />
      {buscando && resultados.length > 0 && (
        <View style={[styles.dropdownList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {resultados.map(d => {
            const ai = AREAS_INFO[d.area];
            return (
              <Pressable key={d.codigo} onPress={() => handleSeleccionarDestreza(d)}
                style={({ pressed }) => [styles.dropdownItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
                <Text style={{ color: ai?.color || colors.primary, fontWeight: "700", fontSize: 12 }}>{d.codigo}</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, flex: 1, marginLeft: 8 }} numberOfLines={2}>{d.descripcion}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      {hora.destreza && (
        <View style={[styles.destrezaSelected, { backgroundColor: (areaInfo?.color || "#003366") + "12", borderColor: (areaInfo?.color || "#003366") + "40" }]}>
          <Text style={{ color: areaInfo?.color, fontWeight: "700", fontSize: 13 }}>{hora.destreza.codigo}</Text>
          <Text style={{ color: colors.foreground, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{hora.destreza.descripcion}</Text>
        </View>
      )}

      {/* Tema */}
      <Text style={[styles.fieldLabel, { color: colors.muted, marginTop: 10 }]}>Tema de la hora</Text>
      <TextInput
        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
        value={hora.tema}
        onChangeText={(t) => onUpdate({ tema: t })}
        placeholder="Escribe el tema de esta hora..."
        placeholderTextColor={colors.muted}
      />

      {/* Botón sugerir */}
      {hora.destreza && hora.tema.trim().length > 2 && (
        <Pressable onPress={onSugerirTemas}
          style={({ pressed }) => [styles.btnSugerir, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={{ fontSize: 14 }}>✨</Text>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600", marginLeft: 6 }}>Sugerir alternativas con IA</Text>
        </Pressable>
      )}

      {/* Alternativas sugeridas */}
      {hora.temasAlternativos.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Elige una alternativa:</Text>
          {hora.temasAlternativos.map((tema: any) => (
            <Pressable key={tema.id} onPress={() => onUpdate({ temaSeleccionado: tema, tema: tema.titulo })}
              style={({ pressed }) => [
                styles.altCard,
                {
                  backgroundColor: hora.temaSeleccionado?.id === tema.id ? "#003366" + "15" : colors.surface,
                  borderColor: hora.temaSeleccionado?.id === tema.id ? "#003366" : colors.border,
                  opacity: pressed ? 0.8 : 1,
                }
              ]}>
              <Text style={{ fontWeight: "700", fontSize: 13, color: colors.foreground }}>{tema.titulo}</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{tema.descripcionBreve}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Habilidades Socioemocionales */}
      <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>Habilidades Socioemocionales</Text>
      <View style={styles.chipsWrap}>
        {HABILIDADES_SOCIOEMOCIONALES.map(h => (
          <ChipBtn key={h.id} label={`${h.emoji} ${h.nombre}`}
            selected={hora.habilidadesSocioemocionales.includes(h.id)}
            onPress={() => onToggleChip("habilidadesSocioemocionales", h.id)} colors={colors} />
        ))}
      </View>

      {/* Ejes Transversales */}
      <View style={styles.toggleRow}>
        <Text style={[styles.subSectionTitle, { color: colors.foreground, flex: 1 }]}>Ejes Transversales</Text>
        <Switch value={hora.usaEjesTransversales} onValueChange={() => onToggleBool("usaEjesTransversales")}
          trackColor={{ false: "#ccc", true: "#7C3AED" }} thumbColor="#fff" />
      </View>
      {hora.usaEjesTransversales && (
        <View style={styles.chipsWrap}>
          {["financiera","socioemocional","seguridad_vial","interculturalidad","participacion","gestion_riesgos","educacion_sexual"].map(id => {
            const labels: Record<string,string> = {
              financiera:"Educación Financiera", socioemocional:"Socioemocional",
              seguridad_vial:"Seguridad Vial", interculturalidad:"Interculturalidad",
              participacion:"Participación ciudadana", gestion_riesgos:"Gestión de riesgos",
              educacion_sexual:"Educación sexual",
            };
            return (
              <ChipBtn key={id} label={labels[id] || id}
                selected={hora.insercionesCurriculares.includes(id)}
                onPress={() => onToggleChip("insercionesCurriculares", id)} colors={colors} />
            );
          })}
        </View>
      )}

      {/* Competencias */}
      <View style={styles.toggleRow}>
        <Text style={[styles.subSectionTitle, { color: colors.foreground, flex: 1 }]}>Competencias</Text>
        <Switch value={hora.usaCompetencias} onValueChange={() => onToggleBool("usaCompetencias")}
          trackColor={{ false: "#ccc", true: "#7C3AED" }} thumbColor="#fff" />
      </View>
      {hora.usaCompetencias && (
        <View style={styles.chipsWrap}>
          {COMPETENCIAS.map(c => (
            <ChipBtn key={c.id} label={c.nombre}
              selected={hora.competencias.includes(c.id)}
              onPress={() => onToggleChip("competencias", c.id)} colors={colors} />
          ))}
        </View>
      )}

      {/* Metodologías Activas */}
      <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>Metodologías Activas</Text>
      <View style={styles.chipsWrap}>
        {METODOLOGIAS_ACTIVAS.map(m => (
          <ChipBtn key={m.id} label={m.nombre}
            selected={hora.metodologiasActivas.includes(m.id)}
            onPress={() => onToggleChip("metodologiasActivas", m.id)} colors={colors} />
        ))}
      </View>

      {/* Técnicas de Evaluación */}
      <Text style={[styles.subSectionTitle, { color: colors.foreground }]}>Técnicas de Evaluación</Text>
      <View style={styles.chipsWrap}>
        {TECNICAS_EVALUACION.map(t => (
          <ChipBtn key={t.id} label={t.nombre}
            selected={hora.tecnicasEvaluacion.includes(t.id)}
            onPress={() => onToggleChip("tecnicasEvaluacion", t.id)} colors={colors} />
        ))}
      </View>
    </View>
  );
}

// ─── Vista de resultado ──────────────────────────────────────

function ResultadoView({
  colors, dias, diasConPlanes, tabActivo, setTabActivo,
  onRegenerarHora, onGuardar, onVolver, isGuardando,
}: {
  colors: any;
  dias: DiasState;
  diasConPlanes: Record<string, { horaIndex: number; plan: any }[]>;
  tabActivo: DiaSemanaKey;
  setTabActivo: (d: DiaSemanaKey) => void;
  onRegenerarHora: (dia: DiaSemanaKey, horaIndex: number) => void;
  onGuardar: () => void;
  onVolver: () => void;
  isGuardando: boolean;
}) {
  const diasActivos = DIAS_SEMANA.filter(d => dias[d].activo && diasConPlanes[d]);

  return (
    <ScreenContainer edges={["top","bottom","left","right"]} className="flex-1">
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.resultHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onVolver} style={{ padding: 8 }}>
            <Text style={{ color: colors.primary, fontSize: 15 }}>{"← Editar"}</Text>
          </Pressable>
          <Text style={[styles.resultTitle, { color: colors.foreground }]}>Planificación Semanal</Text>
          <Pressable onPress={onGuardar}
            style={({ pressed }) => [styles.btnGuardar, { opacity: pressed || isGuardando ? 0.7 : 1 }]}>
            {isGuardando
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>💾 Guardar</Text>}
          </Pressable>
        </View>

        {/* Tabs por día */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
          {diasActivos.map(d => (
            <Pressable key={d} onPress={() => setTabActivo(d)}
              style={[styles.tab, { borderBottomColor: tabActivo === d ? "#003366" : "transparent" }]}>
              <Text style={{ fontSize: 14 }}>{DIA_EMOJI[d]}</Text>
              <Text style={[styles.tabLabel, { color: tabActivo === d ? "#003366" : colors.muted }]}>
                {DIA_LABEL[d]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Contenido del día activo */}
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {(diasConPlanes[tabActivo] || []).sort((a, b) => a.horaIndex - b.horaIndex).map(({ horaIndex, plan }) => {
            const hora = dias[tabActivo]?.horas[horaIndex];
            if (!plan) return null;
            return (
              <HoraPlanCard
                key={horaIndex}
                horaIndex={horaIndex}
                hora={hora}
                plan={plan}
                colors={colors}
                onRegenerar={() => onRegenerarHora(tabActivo, horaIndex)}
              />
            );
          })}
          {(!diasConPlanes[tabActivo] || diasConPlanes[tabActivo].length === 0) && (
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text style={{ color: colors.muted }}>No hay planificación para este día</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

// ─── Card de una hora planificada ────────────────────────────

function HoraPlanCard({ horaIndex, hora, plan, colors, onRegenerar }: {
  horaIndex: number;
  hora: HoraSemanal | undefined;
  plan: any;
  colors: any;
  onRegenerar: () => void;
}) {
  const areaInfo = hora?.destreza ? AREAS_INFO[hora.destreza.area] : null;

  return (
    <View style={[styles.horaPlanCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {/* Header de la hora */}
      <View style={[styles.horaPlanHeader, { backgroundColor: areaInfo?.color ? areaInfo.color + "12" : "#003366" + "10" }]}>
        <Text style={[styles.horaPlanTitle, { color: areaInfo?.color || "#003366" }]}>
          Hora {horaIndex + 1} — {hora?.destreza?.codigo || ""}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12 }} numberOfLines={1}>
          {hora?.temaSeleccionado?.titulo || hora?.tema || ""}
        </Text>
      </View>

      {/* Objetivo */}
      {plan.objetivoClase && (
        <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#003366", marginBottom: 3 }}>🎯 OBJETIVO DE APRENDIZAJE</Text>
          <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 18 }}>{plan.objetivoClase}</Text>
        </View>
      )}

      {/* ERCA */}
      {plan.estructura && (
        <View style={{ padding: 12 }}>
          {[
            { key: "experiencia", label: "EXPERIENCIA", emoji: "💡", color: "#2980B9" },
            { key: "reflexion", label: "REFLEXIÓN", emoji: "🤔", color: "#8E44AD" },
            { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", emoji: "📚", color: "#27AE60" },
            { key: "aplicacion", label: "APLICACIÓN", emoji: "✅", color: "#E67E22" },
          ].map(({ key, label, emoji, color }) => {
            const fase = plan.estructura[key];
            if (!fase) return null;
            return (
              <View key={key} style={[styles.faseSection, { borderLeftColor: color }]}>
                <View style={styles.faseHeaderRow}>
                  <Text style={{ fontSize: 14 }}>{emoji}</Text>
                  <Text style={[styles.faseName, { color }]}>{label}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{fase.duracion}</Text>
                </View>
                {(fase.actividades || []).map((act: string, i: number) => {
                  const dua: DUAActividad = fase.duaActividades?.[i] || { representacion: false, accionExpresion: false, implicacion: false };
                  return (
                    <View key={i} style={styles.actRow}>
                      <View style={[styles.actNum, { backgroundColor: color + "18" }]}>
                        <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{i + 1}</Text>
                      </View>
                      <Text style={{ flex: 1, fontSize: 12, color: colors.foreground, lineHeight: 17, marginLeft: 8 }}>{act}</Text>
                      <View style={styles.duaSquaresRow}>
                        <View style={[styles.duaMini, { backgroundColor: dua.representacion ? DUA_ROSADO : DUA_ROSADO + "35" }]} />
                        <View style={[styles.duaMini, { backgroundColor: dua.accionExpresion ? DUA_AZUL : DUA_AZUL + "35" }]} />
                        <View style={[styles.duaMini, { backgroundColor: dua.implicacion ? DUA_VERDE : DUA_VERDE + "35" }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}

      {/* Recursos */}
      {plan.recursos?.length > 0 && (
        <View style={[styles.planFooterSection, { borderTopColor: colors.border }]}>
          <Text style={styles.planFooterLabel}>📦 Recursos</Text>
          <Text style={{ fontSize: 12, color: colors.foreground }}>{plan.recursos.join(" · ")}</Text>
        </View>
      )}

      {/* Evaluación */}
      {plan.evaluacionFormativa && (
        <View style={[styles.planFooterSection, { borderTopColor: colors.border }]}>
          <Text style={styles.planFooterLabel}>📊 Evaluación formativa</Text>
          <Text style={{ fontSize: 12, color: colors.foreground }}>{plan.evaluacionFormativa}</Text>
        </View>
      )}

      {/* DUA Legend */}
      <View style={[styles.duaLegend, { borderTopColor: colors.border }]}>
        <View style={styles.duaLegendItem}><View style={[styles.duaMini, { backgroundColor: DUA_ROSADO }]} /><Text style={styles.duaLegendTxt}>Representación</Text></View>
        <View style={styles.duaLegendItem}><View style={[styles.duaMini, { backgroundColor: DUA_AZUL }]} /><Text style={styles.duaLegendTxt}>Acción/Expresión</Text></View>
        <View style={styles.duaLegendItem}><View style={[styles.duaMini, { backgroundColor: DUA_VERDE }]} /><Text style={styles.duaLegendTxt}>Implicación</Text></View>
      </View>

      {/* Regenerar */}
      <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
        <Pressable onPress={onRegenerar}
          style={({ pressed }) => [styles.btnRegenerar, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
          <Text style={{ fontSize: 13 }}>🔄</Text>
          <Text style={{ fontSize: 12, color: colors.foreground, marginLeft: 6 }}>Regenerar esta hora</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Helpers UI ───────────────────────────────────────────────

function SectionHeader({ title, emoji, colors }: { title: string; emoji: string; colors: any }) {
  return (
    <View style={[styles.sectionHeaderRow, { marginHorizontal: 20 }]}>
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
      <Text style={[styles.sectionHeaderText, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function FieldLabel({ label, colors }: { label: string; colors: any }) {
  return <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>;
}

function ChipBtn({ label, selected, onPress, colors }: {
  label: string; selected: boolean; onPress: () => void; colors: any;
}) {
  return (
    <Pressable onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? "#003366" : colors.surface, borderColor: selected ? "#003366" : colors.border }]}>
      <Text style={{ color: selected ? "#fff" : colors.foreground, fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

// ─── Estilos ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center" },
  pageTitle: { fontSize: 22, fontWeight: "800", marginTop: 8 },
  errorBanner: { margin: 20, padding: 12, backgroundColor: "#FEE2E2", borderRadius: 8 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 8 },
  sectionHeaderText: { fontSize: 15, fontWeight: "700", marginLeft: 8 },
  sectionBody: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 4 },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 4 },
  inputSm: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, marginTop: 4 },
  trimestreBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: "center" },
  estiloRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 },
  estiloLabel: { fontSize: 12, fontWeight: "600", width: 100 },
  estiloBarBg: { flex: 1, height: 10, borderRadius: 5, overflow: "hidden" },
  estiloBarFill: { height: "100%", borderRadius: 5 },
  pctInput: { width: 44, borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4, fontSize: 13, textAlign: "center" },
  diaBlock: { borderWidth: 1, borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  diaHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 8 },
  diaTitulo: { fontSize: 16, fontWeight: "700", flex: 1 },
  horaBtn: { width: 44, height: 36, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  horaBlock: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  horaTitulo: { fontSize: 13, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  dropdownList: { borderWidth: 1, borderRadius: 8, marginBottom: 4, maxHeight: 220 },
  dropdownItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
  destrezaSelected: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 6 },
  btnSugerir: { backgroundColor: "#7C3AED", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 8, marginTop: 8 },
  altCard: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 6 },
  subSectionTitle: { fontSize: 13, fontWeight: "700", marginTop: 14, marginBottom: 6 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  toggleRow: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 6 },
  btnCopiar: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 14 },
  btnGenerar: { backgroundColor: "#003366", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 12, gap: 10 },
  btnGenerarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  // Resultado
  resultHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  resultTitle: { flex: 1, fontSize: 16, fontWeight: "700", textAlign: "center" },
  btnGuardar: { backgroundColor: "#003366", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  tabsRow: { borderBottomWidth: 1 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2 },
  tabLabel: { fontSize: 13, fontWeight: "600", marginTop: 2 },
  horaPlanCard: { margin: 16, marginBottom: 0, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  horaPlanHeader: { padding: 12 },
  horaPlanTitle: { fontSize: 14, fontWeight: "700" },
  faseSection: { borderLeftWidth: 3, paddingLeft: 10, marginBottom: 12 },
  faseHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  faseName: { fontSize: 12, fontWeight: "700", flex: 1 },
  actRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  actNum: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  duaSquaresRow: { flexDirection: "row", gap: 3, marginLeft: 6 },
  duaMini: { width: 11, height: 11, borderRadius: 2 },
  planFooterSection: { padding: 12, borderTopWidth: 1 },
  planFooterLabel: { fontSize: 11, fontWeight: "700", color: "#003366", marginBottom: 3 },
  duaLegend: { flexDirection: "row", padding: 10, borderTopWidth: 1, gap: 12, flexWrap: "wrap" },
  duaLegendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  duaLegendTxt: { fontSize: 10, color: "#666" },
  btnRegenerar: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 8, padding: 8 },
});
