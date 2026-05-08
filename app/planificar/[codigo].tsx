import { useState, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import {
  buscarPorCodigo,
  AREAS_INFO,
  SUBNIVEL_NAMES,
  SUBNIVEL_GRADOS,
  obtenerNombreBloque,
  Planificacion,
  DUAActividad,
  generarTextoDUA,
  obtenerInsercionesPorAsignatura,
  obtenerNombreInsercion,
  COMPETENCIAS,
  METODOLOGIAS_ACTIVAS,
  TECNICAS_EVALUACION,
  ESTILOS_APRENDIZAJE,
  HABILIDADES_SOCIOEMOCIONALES,
} from "@/data";
import { useExportPdf } from "@/hooks/use-export-pdf";
import { useAccess } from "@/lib/access-control";
import { trpc } from "@/lib/trpc";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getTodayDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

type PasoFlujo = "configuracion" | "generando" | "formulario";

export default function PlanificarScreen() {
  const colors = useColors();
  const router = useRouter();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const { addPlanificacion } = usePlanificaciones();
  const { exportarPDF, isExporting } = useExportPdf();

  const destreza = buscarPorCodigo(codigo || "");
  const { hasAccess } = useAccess();

  // ===== PASO 1: Configuración =====
  const [paso, setPaso] = useState<PasoFlujo>("configuracion");
  const [temaDocente, setTemaDocente] = useState("");
  const [temasAlternativos, setTemasAlternativos] = useState<{ titulo: string; descripcion: string }[]>([]);
  const [generandoTemas, setGenerandoTemas] = useState(false);
  const [errorTemas, setErrorTemas] = useState<string | null>(null);

  // Toggles
  const [usaEjesTransversales, setUsaEjesTransversales] = useState(false);
  const [usaCompetencias, setUsaCompetencias] = useState(false);

  // Selecciones
  const [insercionesCurriculares, setInsercionesCurriculares] = useState<string[]>([]);
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([]);
  const [metodologiasSeleccionadas, setMetodologiasSeleccionadas] = useState<string[]>([]);
  const [tecnicasSeleccionadas, setTecnicasSeleccionadas] = useState<string[]>([]);
  const [estilosSeleccionados, setEstilosSeleccionados] = useState<string[]>([]);
  const [habilidadesSocioemocionales, setHabilidadesSocioemocionales] = useState<string[]>([]);

  // Nuevos campos formato oficial 2026-2027
  const [periodoPedagogico, setPeriodoPedagogico] = useState("");
  const [trimestre, setTrimestre] = useState("Primero");
  const [nivel, setNivel] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [paralelo, setParalelo] = useState("");

  // Estilos de aprendizaje con porcentajes
  const [pctVisual, setPctVisual] = useState("25");
  const [pctAuditivo, setPctAuditivo] = useState("25");
  const [pctLectorEscritor, setPctLectorEscritor] = useState("25");
  const [pctKinestesico, setPctKinestesico] = useState("25");

  // ===== PASO 2: Resultado generado =====
  const [generandoPlan, setGenerandoPlan] = useState(false);
  const [errorPlan, setErrorPlan] = useState<string | null>(null);

  // Formulario
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState(destreza ? SUBNIVEL_GRADOS[destreza.subnivel] : "");
  const [fecha, setFecha] = useState(getTodayDate());
  const [periodos, setPeriodos] = useState("1");
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState(destreza?.objetivos[0] || "");
  const [actividades, setActividades] = useState("");
  const [recursos, setRecursos] = useState("");
  const [evaluacion, setEvaluacion] = useState(destreza?.indicadoresEvaluacion[0] || "");
  const [tecnicas, setTecnicas] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [duaRepresentacion, setDuaRepresentacion] = useState("");
  const [duaAccionExpresion, setDuaAccionExpresion] = useState("");
  const [duaImplicacion, setDuaImplicacion] = useState("");

  // Estructura ERCA generada con DUA por actividad
  const [estructuraGenerada, setEstructuraGenerada] = useState<any>(null);
  const [temaFinal, setTemaFinal] = useState("");

  // Inserciones filtradas
  const insercionesDisponibles = useMemo(
    () => (destreza ? obtenerInsercionesPorAsignatura(destreza.area, destreza.subnivel) : []),
    [destreza]
  );

  // Bloques curriculares del área
  const bloquesCurriculares = useMemo(() => {
    if (!destreza) return [];
    const areaInfo = AREAS_INFO[destreza.area];
    if (!areaInfo?.bloques) return [];
    return Object.entries(areaInfo.bloques).map(([key, name]) => ({
      id: key,
      nombre: name,
    }));
  }, [destreza]);

  // Nivel automático según subnivel
  useMemo(() => {
    if (destreza) {
      const subnivelName = SUBNIVEL_NAMES[destreza.subnivel];
      if (destreza.subnivel <= 4) {
        setNivel("Educaci\u00f3n General B\u00e1sica");
      } else {
        setNivel("Bachillerato General Unificado");
      }
    }
  }, [destreza]);

  // tRPC mutations
  const generateAiMutation = trpc.topics.generateAi.useMutation();
  const generatePlanMutation = trpc.topics.generatePlan.useMutation();

  if (!destreza) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <Text style={{ fontSize: 56 }}>{"\u26A0\uFE0F"}</Text>
          <Text className="text-lg font-semibold text-foreground mt-4">
            Destreza no encontrada
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtnFull,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const areaInfo = AREAS_INFO[destreza.area];
  const isEFL = destreza.area === "EFL";

  // ===== Generar 2 temas alternativos con IA =====
  const handleSugerirTemas = async () => {
    if (!temaDocente.trim()) {
      if (Platform.OS === "web") {
        alert(isEFL ? "Please enter your topic first" : "Por favor escribe tu tema primero");
      } else {
        Alert.alert("", isEFL ? "Please enter your topic first" : "Por favor escribe tu tema primero");
      }
      return;
    }
    setGenerandoTemas(true);
    setErrorTemas(null);
    try {
      const result = await generateAiMutation.mutateAsync({
        codigoDestreza: destreza.codigo,
        descripcionDestreza: destreza.descripcion,
        area: destreza.area,
        bloque: obtenerNombreBloque(destreza.area, destreza.bloque),
        subnivel: destreza.subnivel,
        temaDocente: temaDocente.trim(),
        temasExistentes: [temaDocente.trim()],
      });
      if (result.success && result.temas.length > 0) {
        setTemasAlternativos(result.temas.map((t: any) => ({ titulo: t.titulo, descripcion: t.descripcionBreve })));
      } else {
        setErrorTemas(result.error || (isEFL ? "Could not generate suggestions" : "No se pudieron generar sugerencias"));
      }
    } catch (e: any) {
      setErrorTemas(isEFL ? "Connection error" : "Error de conexi\u00f3n");
    }
    setGenerandoTemas(false);
  };

  // ===== Generar planificación completa =====
  const handleGenerarPlanificacion = async (temaElegido?: string) => {
    const tema = temaElegido || temaDocente.trim();
    if (!tema) {
      if (Platform.OS === "web") {
        alert(isEFL ? "Please enter a topic" : "Por favor escribe un tema");
      } else {
        Alert.alert("", isEFL ? "Please enter a topic" : "Por favor escribe un tema");
      }
      return;
    }

    setTemaFinal(tema);
    setPaso("generando");
    setGenerandoPlan(true);
    setErrorPlan(null);

    // Preparar nombres de ejes y competencias para el prompt
    const ejesNombres = usaEjesTransversales && insercionesCurriculares.length > 0
      ? insercionesCurriculares.map(id => obtenerNombreInsercion(id, isEFL))
      : undefined;

    const competenciasNombres = usaCompetencias && competenciasSeleccionadas.length > 0
      ? competenciasSeleccionadas.map(id => {
          const comp = COMPETENCIAS.find(c => c.id === id);
          return comp ? (isEFL ? comp.nameEN : comp.nombre) : id;
        })
      : undefined;

    try {
      const result = await generatePlanMutation.mutateAsync({
        codigoDestreza: destreza.codigo,
        descripcionDestreza: destreza.descripcion,
        area: destreza.area,
        bloque: obtenerNombreBloque(destreza.area, destreza.bloque),
        subnivel: destreza.subnivel,
        tema,
        ejesTransversales: ejesNombres,
        competencias: competenciasNombres,
      });

      if (result.success && result.plan) {
        const plan = result.plan;
        setObjetivoAprendizaje(plan.objetivoClase || destreza.objetivos[0] || "");
        setEstructuraGenerada(plan.estructura);
        setRecursos((plan.recursos || []).join(", "));
        setEvaluacion(plan.evaluacionFormativa || destreza.indicadoresEvaluacion[0] || "");

        // Construir texto de actividades
        const fases = ["experiencia", "reflexion", "conceptualizacion", "aplicacion"] as const;
        const labels = isEFL
          ? { experiencia: "EXPERIENCE", reflexion: "REFLECTION", conceptualizacion: "CONCEPTUALIZATION", aplicacion: "APPLICATION" }
          : { experiencia: "EXPERIENCIA", reflexion: "REFLEXI\u00d3N", conceptualizacion: "CONCEPTUALIZACI\u00d3N", aplicacion: "APLICACI\u00d3N" };

        const actTexto = fases.map(f => {
          const data = plan.estructura[f];
          const header = `${labels[f]} (${data?.duracion || "10 minutos"})`;
          const acts = (data?.actividades || []).map((a: string, i: number) => `${i + 1}. ${a}`).join("\n");
          return `${header}\n${acts}`;
        }).join("\n\n");

        setActividades(actTexto);

        // DUA general text
        const textoDUA = generarTextoDUA(destreza.area);
        const partes = textoDUA.split("\n\n");
        if (partes.length >= 3) {
          setDuaRepresentacion(partes[0]);
          setDuaAccionExpresion(partes[1]);
          setDuaImplicacion(partes[2]);
        }

        // T\u00e9cnicas sugeridas
        setTecnicas(isEFL
          ? "Technique: Direct observation\nInstrument: Checklist / Assessment rubric"
          : "T\u00e9cnica: Observaci\u00f3n directa\nInstrumento: Lista de cotejo / R\u00fabrica de evaluaci\u00f3n");

        setPaso("formulario");
      } else {
        setErrorPlan(result.error || (isEFL ? "Error generating plan" : "Error al generar planificaci\u00f3n"));
        setPaso("configuracion");
      }
    } catch (e: any) {
      setErrorPlan(isEFL ? "Connection error" : "Error de conexi\u00f3n. Intenta de nuevo.");
      setPaso("configuracion");
    }
    setGenerandoPlan(false);
  };

  // ===== Guardar =====
  const handleSave = async () => {
    if (!docente.trim()) {
      if (Platform.OS === "web") {
        alert(isEFL ? "Please enter teacher name" : "Por favor ingresa el nombre del docente");
      } else {
        Alert.alert("", isEFL ? "Please enter teacher name" : "Por favor ingresa el nombre del docente");
      }
      return;
    }

    const plan: Planificacion = {
      id: generateId(),
      fecha,
      institucion: institucion.trim(),
      docente: docente.trim(),
      grado: grado.trim(),
      asignatura: areaInfo.name,
      periodos: periodos.trim(),
      periodoPedagogico: periodoPedagogico.trim() || undefined,
      trimestre: trimestre || undefined,
      nivel: nivel.trim() || undefined,
      fechaInicio: fechaInicio.trim() || undefined,
      fechaFin: fechaFin.trim() || undefined,
      paralelo: paralelo.trim() || undefined,
      bloquesCurriculares: bloquesCurriculares.map(b => b.nombre),
      habilidadesSocioemocionales: habilidadesSocioemocionales.length > 0 ? habilidadesSocioemocionales : undefined,
      estilosAprendizajePorcentaje: {
        visual: parseInt(pctVisual) || 25,
        auditivo: parseInt(pctAuditivo) || 25,
        lectorEscritor: parseInt(pctLectorEscritor) || 25,
        kinestesico: parseInt(pctKinestesico) || 25,
      },
      destreza,
      objetivoAprendizaje: objetivoAprendizaje.trim(),
      temaSeleccionado: temaFinal ? {
        id: generateId(),
        titulo: temaFinal,
        descripcionBreve: "",
        objetivoClase: objetivoAprendizaje.trim(),
        estructura: estructuraGenerada || {
          experiencia: { titulo: "Experiencia", duracion: "10 minutos", actividades: [] },
          reflexion: { titulo: "Reflexi\u00f3n", duracion: "10 minutos", actividades: [] },
          conceptualizacion: { titulo: "Conceptualizaci\u00f3n", duracion: "15 minutos", actividades: [] },
          aplicacion: { titulo: "Aplicaci\u00f3n", duracion: "10 minutos", actividades: [] },
        },
        recursos: recursos.split(",").map(r => r.trim()).filter(Boolean),
        evaluacionFormativa: evaluacion.trim(),
      } : undefined,
      actividades: actividades.trim(),
      recursos: recursos.trim(),
      evaluacion: evaluacion.trim(),
      tecnicasInstrumentos: tecnicas.trim(),
      observaciones: observaciones.trim(),
      usaEjesTransversales,
      insercionesCurriculares: insercionesCurriculares.length > 0 ? insercionesCurriculares : undefined,
      usaCompetencias,
      competencias: competenciasSeleccionadas.length > 0 ? competenciasSeleccionadas : undefined,
      metodologiasActivas: metodologiasSeleccionadas.length > 0 ? metodologiasSeleccionadas : undefined,
      tecnicasEvaluacionSeleccionadas: tecnicasSeleccionadas.length > 0 ? tecnicasSeleccionadas : undefined,
      estilosAprendizaje: estilosSeleccionados.length > 0 ? estilosSeleccionados : undefined,
      dua: {
        representacion: duaRepresentacion.trim(),
        accionExpresion: duaAccionExpresion.trim(),
        implicacion: duaImplicacion.trim(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addPlanificacion(plan);
    router.replace(`/ver-plan/${plan.id}` as any);
  };

  // ==========================================
  // PASO: Generando (loading)
  // ==========================================
  if (paso === "generando") {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-lg font-semibold text-foreground mt-6 text-center">
            {isEFL ? "Generating your lesson plan..." : "Generando tu planificaci\u00f3n..."}
          </Text>
          <Text className="text-sm text-muted mt-2 text-center">
            {isEFL ? "Using Marzano's Taxonomy and UDL principles" : "Usando Taxonom\u00eda de Marzano y principios DUA"}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // ==========================================
  // PASO 1: Configuración (tema + toggles + datos oficiales)
  // ==========================================
  if (paso === "configuracion") {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                {isEFL ? "Back" : "Atr\u00e1s"}
              </Text>
            </Pressable>
          </View>

          {/* Destreza info */}
          <View className="px-5 mt-3">
            <View style={[styles.destrezaInfo, { backgroundColor: areaInfo.color + "10", borderColor: areaInfo.color + "30" }]}>
              <View style={styles.destrezaInfoHeader}>
                <Text style={[styles.destrezaCode, { color: areaInfo.color }]}>{destreza.codigo}</Text>
                <Text style={{ color: areaInfo.color, fontSize: 12, fontWeight: "500" }}>{areaInfo.name}</Text>
              </View>
              <Text className="text-sm text-foreground mt-2 leading-5">{destreza.descripcion}</Text>
            </View>
          </View>

          {/* T\u00edtulo del paso */}
          <View className="px-5 mt-5">
            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <Text className="text-xl font-bold text-foreground ml-3">
                {isEFL ? "Configure your lesson plan" : "Configura tu planificaci\u00f3n"}
              </Text>
            </View>
          </View>

          {/* ===== DATOS INFORMATIVOS OFICIALES ===== */}
          <SectionTitle title={isEFL ? "General Information" : "1. Datos Informativos"} emoji={"\u2139\uFE0F"} colors={colors} />

          <FormField label={isEFL ? "Educational Institution" : "Instituci\u00f3n Educativa"} value={institucion} onChangeText={setInstitucion} placeholder={isEFL ? "Institution name" : "Unidad Educativa Fiscal..."} colors={colors} />
          <FormField label={isEFL ? "Teacher *" : "Nombre Docente *"} value={docente} onChangeText={setDocente} placeholder={isEFL ? "Teacher's name" : "Lic. ..."} colors={colors} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "Grade / Level" : "Grado/Curso"} value={grado} onChangeText={setGrado} placeholder={isEFL ? "e.g.: 10th" : "Ej: 10mo"} colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "Level" : "Nivel"} value={nivel} onChangeText={setNivel} placeholder="EGB / BGU" colors={colors} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "Sublevel" : "Subnivel"} value={SUBNIVEL_NAMES[destreza.subnivel]} onChangeText={() => {}} placeholder="" colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "Section" : "Paralelo"} value={paralelo} onChangeText={setParalelo} placeholder={isEFL ? "e.g.: A" : 'Ej: "A"'} colors={colors} />
            </View>
          </View>

          <FormField label={isEFL ? "Pedagogical Period" : "Per\u00edodo Pedag\u00f3gico"} value={periodoPedagogico} onChangeText={setPeriodoPedagogico} placeholder={isEFL ? "e.g.: Civic Education" : "Ej: C\u00edvica y Acompa\u00f1amiento Integral en el Aula"} colors={colors} />

          {/* Trimestre selector */}
          <View className="px-5 mt-3">
            <Text className="text-sm font-medium text-muted mb-2">{isEFL ? "Quarter" : "Trimestre"}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["Primero", "Segundo", "Tercero"].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTrimestre(t)}
                  style={({ pressed }) => [{
                    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" as const,
                    borderWidth: 1.5,
                    borderColor: trimestre === t ? colors.primary : colors.border,
                    backgroundColor: trimestre === t ? colors.primary + "15" : colors.surface,
                    opacity: pressed ? 0.7 : 1,
                  }]}
                >
                  <Text style={{ fontSize: 13, fontWeight: trimestre === t ? "700" : "500", color: trimestre === t ? colors.primary : colors.foreground }}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "Start Date" : "Fecha Inicio"} value={fechaInicio} onChangeText={setFechaInicio} placeholder="DD/MM/AAAA" colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <FormField label={isEFL ? "End Date" : "Fecha Fin"} value={fechaFin} onChangeText={setFechaFin} placeholder="DD/MM/AAAA" colors={colors} />
            </View>
          </View>

          <FormField label={isEFL ? "Number of Periods" : "N\u00famero de Per\u00edodos"} value={periodos} onChangeText={setPeriodos} placeholder="1" keyboardType="numeric" colors={colors} />

          {/* Bloques Curriculares (solo lectura) */}
          {bloquesCurriculares.length > 0 && (
            <View className="px-5 mt-3">
              <Text className="text-sm font-medium text-muted mb-2">{isEFL ? "Curricular Blocks" : "Bloques Curriculares"}</Text>
              <View style={[styles.bloquesContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {bloquesCurriculares.map((b, idx) => (
                  <View key={b.id} style={styles.bloqueRow}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: areaInfo.color, width: 80 }}>
                      Bloque {idx + 1}:
                    </Text>
                    <Text className="text-sm text-foreground flex-1">{b.nombre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ===== 2. PRINCIPIOS DUA ===== */}
          <SectionTitle title={isEFL ? "2. UDL Principles" : "2. Principios DUA"} emoji={"\u267F"} colors={colors} />
          <View className="px-5 mt-1">
            <View style={[styles.duaPrincipiosBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.duaPrincipioRow}>
                <Text className="text-xs text-foreground flex-1">
                  I. Proporcionar m\u00faltiples formas de representaci\u00f3n: \u00bfqu\u00e9?
                </Text>
                <View style={[styles.duaSquareLarge, { backgroundColor: "#EC4899" }]} />
              </View>
              <View style={styles.duaPrincipioRow}>
                <Text className="text-xs text-foreground flex-1">
                  II. Proporcionar m\u00faltiples formas de acci\u00f3n y expresi\u00f3n: \u00bfC\u00f3mo?
                </Text>
                <View style={[styles.duaSquareLarge, { backgroundColor: "#1E3A5F" }]} />
              </View>
              <View style={styles.duaPrincipioRow}>
                <Text className="text-xs text-foreground flex-1">
                  III. Proporcionar m\u00faltiples formas de implicaci\u00f3n o participaci\u00f3n: \u00bfPor qu\u00e9?
                </Text>
                <View style={[styles.duaSquareLarge, { backgroundColor: "#22C55E" }]} />
              </View>
            </View>
          </View>

          {/* ===== 3. ESTILOS DE APRENDIZAJE ===== */}
          <SectionTitle title={isEFL ? "3. Learning Styles" : "3. Estilos de Aprendizaje"} emoji={"\uD83E\uDDE0"} colors={colors} />
          <View className="px-5 mt-1">
            <Text className="text-xs text-muted mb-2">
              {isEFL ? "Enter the percentage distribution for your class:" : "Ingresa la distribuci\u00f3n porcentual de tu grado/curso:"}
            </Text>
            <View style={[styles.estilosGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.estiloRow}>
                <Text className="text-xs text-foreground" style={{ width: 120 }}>{"\uD83D\uDC41\uFE0F"} VISUAL:</Text>
                <TextInput
                  value={pctVisual}
                  onChangeText={setPctVisual}
                  keyboardType="numeric"
                  style={[styles.pctInput, { borderColor: colors.border, color: colors.foreground }]}
                />
                <Text className="text-xs text-muted">%</Text>
              </View>
              <View style={styles.estiloRow}>
                <Text className="text-xs text-foreground" style={{ width: 120 }}>{"\uD83D\uDC42"} AUDITIVO:</Text>
                <TextInput
                  value={pctAuditivo}
                  onChangeText={setPctAuditivo}
                  keyboardType="numeric"
                  style={[styles.pctInput, { borderColor: colors.border, color: colors.foreground }]}
                />
                <Text className="text-xs text-muted">%</Text>
              </View>
              <View style={styles.estiloRow}>
                <Text className="text-xs text-foreground" style={{ width: 120 }}>{"\uD83D\uDCDA"} LECTOR-ESCRITOR:</Text>
                <TextInput
                  value={pctLectorEscritor}
                  onChangeText={setPctLectorEscritor}
                  keyboardType="numeric"
                  style={[styles.pctInput, { borderColor: colors.border, color: colors.foreground }]}
                />
                <Text className="text-xs text-muted">%</Text>
              </View>
              <View style={styles.estiloRow}>
                <Text className="text-xs text-foreground" style={{ width: 120 }}>{"\uD83C\uDFC3"} KINEST\u00c9SICO:</Text>
                <TextInput
                  value={pctKinestesico}
                  onChangeText={setPctKinestesico}
                  keyboardType="numeric"
                  style={[styles.pctInput, { borderColor: colors.border, color: colors.foreground }]}
                />
                <Text className="text-xs text-muted">%</Text>
              </View>
            </View>
          </View>

          {/* ===== 4. HABILIDADES SOCIOEMOCIONALES ===== */}
          <SectionTitle title={isEFL ? "4. Socioemotional Skills" : "4. Habilidades Socioemocionales"} emoji={"\uD83D\uDC9A"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-2">
              {isEFL ? "Select the associated socioemotional skills:" : "Selecciona las habilidades socioemocionales asociadas:"}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {HABILIDADES_SOCIOEMOCIONALES.map((hab) => {
                const isSelected = habilidadesSocioemocionales.includes(hab.id);
                return (
                  <Pressable
                    key={hab.id}
                    onPress={() => {
                      if (isSelected) {
                        setHabilidadesSocioemocionales(habilidadesSocioemocionales.filter(id => id !== hab.id));
                      } else {
                        setHabilidadesSocioemocionales([...habilidadesSocioemocionales, hab.id]);
                      }
                    }}
                    style={({ pressed }) => [{
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                      borderWidth: 1.5, borderColor: isSelected ? "#16A34A" : colors.border,
                      backgroundColor: isSelected ? "#16A34A15" : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: isSelected ? "700" : "500", color: isSelected ? "#16A34A" : colors.foreground }}>
                      {hab.emoji} {isEFL ? hab.nameEN : hab.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== TEMA DEL DOCENTE ===== */}
          <SectionTitle title={isEFL ? "Your Topic" : "5. Tu Tema de Clase"} emoji={"\uD83D\uDCDD"} colors={colors} />
          <View className="px-5 mt-2">
            <Text className="text-xs text-muted mb-2">
              {isEFL ? "Write the topic you want to teach:" : "Escribe el tema que deseas ense\u00f1ar:"}
            </Text>
            <TextInput
              value={temaDocente}
              onChangeText={setTemaDocente}
              placeholder={isEFL ? "e.g.: Photosynthesis in tropical plants" : "Ej: La fotos\u00edntesis en las plantas tropicales"}
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              returnKeyType="done"
            />

            {/* Bot\u00f3n sugerir 2 temas con IA */}
            {hasAccess && (
              <Pressable
                onPress={handleSugerirTemas}
                disabled={generandoTemas}
                style={({ pressed }) => [
                  styles.aiButton,
                  {
                    backgroundColor: generandoTemas ? colors.surface : "#7C3AED",
                    opacity: pressed && !generandoTemas ? 0.85 : 1,
                    marginTop: 12,
                  },
                ]}
              >
                {generandoTemas ? (
                  <>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600", marginLeft: 10 }}>
                      {isEFL ? "Generating suggestions..." : "Generando sugerencias..."}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 16 }}>{"\u2728"}</Text>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700", marginLeft: 8 }}>
                      {isEFL ? "Suggest 2 alternatives with AI" : "Sugerir 2 alternativas con IA"}
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {errorTemas && (
              <Text style={{ color: colors.error, fontSize: 12, marginTop: 6 }}>{errorTemas}</Text>
            )}

            {/* Temas alternativos sugeridos */}
            {temasAlternativos.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text className="text-xs text-muted mb-2">
                  {isEFL ? "AI Alternatives (tap to use):" : "Alternativas de IA (toca para usar):"}
                </Text>
                {temasAlternativos.map((t, i) => (
                  <Pressable
                    key={i}
                    onPress={() => setTemaDocente(t.titulo)}
                    style={({ pressed }) => [
                      styles.temaAlternativo,
                      { borderColor: colors.border, backgroundColor: pressed ? colors.primary + "10" : colors.surface },
                    ]}
                  >
                    <Text className="text-sm font-semibold text-foreground">{t.titulo}</Text>
                    {t.descripcion ? <Text className="text-xs text-muted mt-1">{t.descripcion}</Text> : null}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* ===== TOGGLE: EJES TRANSVERSALES ===== */}
          <SectionTitle title={isEFL ? "Cross-cutting Themes" : "6. Ejes Transversales (Inserciones Curriculares)"} emoji={"\uD83C\uDF10"} colors={colors} />
          <View className="px-5 mt-1">
            <View style={styles.toggleRow}>
              <Text className="text-sm text-foreground flex-1">
                {isEFL ? "Work with cross-cutting themes?" : "\u00bfTrabajar con ejes transversales?"}
              </Text>
              <Switch
                value={usaEjesTransversales}
                onValueChange={setUsaEjesTransversales}
                trackColor={{ false: colors.border, true: colors.primary + "60" }}
                thumbColor={usaEjesTransversales ? colors.primary : "#f4f3f4"}
              />
            </View>

            {usaEjesTransversales && insercionesDisponibles.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text className="text-xs text-muted mb-2">
                  {isEFL ? "Select which ones:" : "Selecciona cu\u00e1les:"}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {insercionesDisponibles.map((ins) => {
                    const isSelected = insercionesCurriculares.includes(ins.id);
                    return (
                      <Pressable
                        key={ins.id}
                        onPress={() => {
                          if (isSelected) {
                            setInsercionesCurriculares(insercionesCurriculares.filter(id => id !== ins.id));
                          } else {
                            setInsercionesCurriculares([...insercionesCurriculares, ins.id]);
                          }
                        }}
                        style={({ pressed }) => [{
                          paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                          borderWidth: 1.5, borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected ? colors.primary + "15" : colors.surface,
                          opacity: pressed ? 0.7 : 1,
                        }]}
                      >
                        <Text style={{ fontSize: 12, fontWeight: isSelected ? "700" : "500", color: isSelected ? colors.primary : colors.foreground }}>
                          {ins.emoji} {isEFL ? ins.nameEN : ins.nombreCorto}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
            {usaEjesTransversales && insercionesDisponibles.length === 0 && (
              <Text className="text-xs text-muted mt-2">
                {isEFL ? "No specific insertions for this subject/level" : "No hay inserciones espec\u00edficas para esta asignatura/subnivel"}
              </Text>
            )}
          </View>

          {/* ===== TOGGLE: COMPETENCIAS ===== */}
          <SectionTitle title={isEFL ? "7. Competencies" : "7. Competencias"} emoji={"\uD83C\uDFAF"} colors={colors} />
          <View className="px-5 mt-1">
            <View style={styles.toggleRow}>
              <Text className="text-sm text-foreground flex-1">
                {isEFL ? "Work with competencies?" : "\u00bfTrabajar con competencias?"}
              </Text>
              <Switch
                value={usaCompetencias}
                onValueChange={setUsaCompetencias}
                trackColor={{ false: colors.border, true: colors.primary + "60" }}
                thumbColor={usaCompetencias ? colors.primary : "#f4f3f4"}
              />
            </View>

            {usaCompetencias && (
              <View style={{ marginTop: 10 }}>
                <Text className="text-xs text-muted mb-2">
                  {isEFL ? "Select which ones:" : "Selecciona cu\u00e1les:"}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {COMPETENCIAS.map((comp) => {
                    const isSelected = competenciasSeleccionadas.includes(comp.id);
                    return (
                      <Pressable
                        key={comp.id}
                        onPress={() => {
                          if (isSelected) {
                            setCompetenciasSeleccionadas(competenciasSeleccionadas.filter(id => id !== comp.id));
                          } else {
                            setCompetenciasSeleccionadas([...competenciasSeleccionadas, comp.id]);
                          }
                        }}
                        style={({ pressed }) => [{
                          paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                          borderWidth: 1.5, borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected ? colors.primary + "15" : colors.surface,
                          opacity: pressed ? 0.7 : 1,
                        }]}
                      >
                        <Text style={{ fontSize: 12, fontWeight: isSelected ? "700" : "500", color: isSelected ? colors.primary : colors.foreground }}>
                          {comp.emoji} {isEFL ? comp.nameEN : comp.nombre}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* ===== METODOLOG\u00cdAS ACTIVAS ===== */}
          <SectionTitle title={isEFL ? "Active Methodologies" : "Metodolog\u00edas Activas"} emoji={"\uD83D\uDCA1"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-2">
              {isEFL ? "Select the active methodologies:" : "Selecciona las metodolog\u00edas activas:"}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {METODOLOGIAS_ACTIVAS.map((met) => {
                const isSelected = metodologiasSeleccionadas.includes(met.id);
                return (
                  <Pressable
                    key={met.id}
                    onPress={() => {
                      if (isSelected) {
                        setMetodologiasSeleccionadas(metodologiasSeleccionadas.filter(id => id !== met.id));
                      } else {
                        setMetodologiasSeleccionadas([...metodologiasSeleccionadas, met.id]);
                      }
                    }}
                    style={({ pressed }) => [{
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                      borderWidth: 1.5, borderColor: isSelected ? "#7C3AED" : colors.border,
                      backgroundColor: isSelected ? "#7C3AED15" : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: isSelected ? "700" : "500", color: isSelected ? "#7C3AED" : colors.foreground }}>
                      {isEFL ? met.nameEN : met.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== T\u00c9CNICAS DE EVALUACI\u00d3N ===== */}
          <SectionTitle title={isEFL ? "Assessment Techniques" : "T\u00e9cnicas de Evaluaci\u00f3n"} emoji={"\uD83D\uDCCB"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-2">
              {isEFL ? "Select assessment techniques:" : "Selecciona t\u00e9cnicas de evaluaci\u00f3n:"}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TECNICAS_EVALUACION.map((tec) => {
                const isSelected = tecnicasSeleccionadas.includes(tec.id);
                return (
                  <Pressable
                    key={tec.id}
                    onPress={() => {
                      if (isSelected) {
                        setTecnicasSeleccionadas(tecnicasSeleccionadas.filter(id => id !== tec.id));
                      } else {
                        setTecnicasSeleccionadas([...tecnicasSeleccionadas, tec.id]);
                      }
                    }}
                    style={({ pressed }) => [{
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                      borderWidth: 1.5, borderColor: isSelected ? "#16A34A" : colors.border,
                      backgroundColor: isSelected ? "#16A34A15" : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: isSelected ? "700" : "500", color: isSelected ? "#16A34A" : colors.foreground }}>
                      {isEFL ? tec.nameEN : tec.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Error de generaci\u00f3n */}
          {errorPlan && (
            <View className="px-5 mt-3">
              <Text style={{ color: colors.error, fontSize: 13, textAlign: "center" }}>{errorPlan}</Text>
            </View>
          )}

          {/* ===== BOT\u00d3N GENERAR PLANIFICACI\u00d3N ===== */}
          <View className="px-5 mt-6 mb-10">
            <Pressable
              onPress={() => handleGenerarPlanificacion()}
              style={({ pressed }) => [
                styles.generateBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{"\uD83D\uDE80"}</Text>
              <Text style={styles.generateBtnText}>
                {isEFL ? "Generate Lesson Plan" : "Generar Planificaci\u00f3n"}
              </Text>
            </Pressable>
            <Text className="text-xs text-muted text-center mt-3">
              {isEFL ? "AI will generate activities with Marzano verbs and UDL indicators" : "La IA generar\u00e1 actividades con verbos de Marzano e indicadores DUA"}
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ==========================================
  // PASO 2: Formulario de planificaci\u00f3n (resultado)
  // ==========================================
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => setPaso("configuracion")}
              style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                {isEFL ? "Back to configuration" : "Volver a configuraci\u00f3n"}
              </Text>
            </Pressable>

            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text className="text-xl font-bold text-foreground ml-3">
                {isEFL ? "Microcurricular Lesson Plan" : "Planificaci\u00f3n Microcurricular"}
              </Text>
            </View>
          </View>

          {/* Tema badge */}
          {temaFinal && (
            <View className="px-5 mt-3">
              <View style={[styles.temaBadge, { backgroundColor: areaInfo.color + "12", borderColor: areaInfo.color + "35" }]}>
                <Text style={{ fontSize: 18 }}>{"\u2728"}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ color: areaInfo.color, fontSize: 13, fontWeight: "600" }}>
                    {isEFL ? "Topic" : "Tema"}
                  </Text>
                  <Text className="text-sm font-bold text-foreground mt-1">{temaFinal}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Destreza compact */}
          <View className="px-5 mt-3">
            <View style={[styles.destrezaCompact, { backgroundColor: areaInfo.color + "08", borderColor: areaInfo.color + "20" }]}>
              <Text style={{ color: areaInfo.color, fontSize: 15, fontWeight: "800" }}>{destreza.codigo}</Text>
              <Text className="text-xs text-muted mt-1" numberOfLines={2}>{destreza.descripcion}</Text>
            </View>
          </View>

          <SectionTitle title={isEFL ? "Learning Objective" : "Objetivo de Aprendizaje"} emoji={"\uD83C\uDFAF"} colors={colors} />
          <FormField label={isEFL ? "Objective" : "Objetivo"} value={objetivoAprendizaje} onChangeText={setObjetivoAprendizaje} placeholder={isEFL ? "Learning objective" : "Objetivo de aprendizaje"} multiline colors={colors} />

          {/* Estructura ERCA con DUA squares */}
          {estructuraGenerada && (
            <>
              <SectionTitle title={isEFL ? "ERCA Structure (45 min)" : "Estructura ERCA (45 min)"} emoji={"\uD83C\uDFEB"} colors={colors} />
              <EstructuraERCAConDUA estructura={estructuraGenerada} colors={colors} areaColor={areaInfo.color} isEFL={isEFL} />
            </>
          )}

          <SectionTitle title={isEFL ? "Learning Activities" : "Actividades de Aprendizaje"} emoji={"\uD83D\uDCCB"} colors={colors} />
          <FormField label={isEFL ? "Activities (editable)" : "Actividades (editable)"} value={actividades} onChangeText={setActividades} placeholder={isEFL ? "Describe the activities..." : "Describe las actividades..."} multiline colors={colors} />

          <SectionTitle title={isEFL ? "Teaching Resources" : "Recursos Did\u00e1cticos"} emoji={"\uD83D\uDCE6"} colors={colors} />
          <FormField label={isEFL ? "Resources" : "Recursos"} value={recursos} onChangeText={setRecursos} placeholder={isEFL ? "List of resources..." : "Lista de recursos..."} multiline colors={colors} />

          <SectionTitle title={isEFL ? "Assessment" : "Evaluaci\u00f3n"} emoji={"\uD83D\uDCCA"} colors={colors} />
          <FormField label={isEFL ? "Assessment Indicators" : "Indicadores de Evaluaci\u00f3n"} value={evaluacion} onChangeText={setEvaluacion} placeholder={isEFL ? "Indicators..." : "Indicadores..."} multiline colors={colors} />
          <FormField label={isEFL ? "Techniques and Instruments" : "T\u00e9cnicas e Instrumentos"} value={tecnicas} onChangeText={setTecnicas} placeholder={isEFL ? "Assessment techniques..." : "T\u00e9cnicas de evaluaci\u00f3n..."} multiline colors={colors} />

          {/* DUA General */}
          <SectionTitle title={isEFL ? "Universal Design for Learning (UDL)" : "Dise\u00f1o Universal para el Aprendizaje (DUA)"} emoji={"\u267F"} colors={colors} />
          <View className="px-5 mt-1 mb-1">
            <View style={[styles.duaBanner, { backgroundColor: "#7C3AED10", borderColor: "#7C3AED30" }]}>
              <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600", textAlign: "center" }}>
                {isEFL ? "Curricular adaptations based on the 3 UDL principles" : "Adaptaciones curriculares basadas en los 3 principios del DUA"}
              </Text>
            </View>
          </View>
          <FormField label={isEFL ? "Representation" : "Representaci\u00f3n"} value={duaRepresentacion} onChangeText={setDuaRepresentacion} placeholder={isEFL ? "How to present information..." : "C\u00f3mo presentar la informaci\u00f3n..."} multiline colors={colors} />
          <FormField label={isEFL ? "Action and Expression" : "Acci\u00f3n y Expresi\u00f3n"} value={duaAccionExpresion} onChangeText={setDuaAccionExpresion} placeholder={isEFL ? "How students demonstrate..." : "C\u00f3mo demostrar\u00e1n lo aprendido..."} multiline colors={colors} />
          <FormField label={isEFL ? "Engagement" : "Implicaci\u00f3n"} value={duaImplicacion} onChangeText={setDuaImplicacion} placeholder={isEFL ? "How to motivate..." : "C\u00f3mo motivar..."} multiline colors={colors} />

          <SectionTitle title={isEFL ? "Observations" : "Observaciones"} emoji={"\uD83D\uDCCC"} colors={colors} />
          <FormField label={isEFL ? "Observations" : "Observaciones"} value={observaciones} onChangeText={setObservaciones} placeholder={isEFL ? "Additional observations (optional)" : "Observaciones adicionales (opcional)"} multiline colors={colors} />

          {/* Guardar */}
          <View className="px-5 mt-6 mb-10">
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            >
              <Text style={{ fontSize: 20 }}>{"\uD83D\uDCBE"}</Text>
              <Text style={styles.saveBtnText}>{isEFL ? "Save Lesson Plan" : "Guardar Planificaci\u00f3n"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ==========================================
// COMPONENTE: Estructura ERCA con DUA squares
// ==========================================
function EstructuraERCAConDUA({
  estructura,
  colors,
  areaColor,
  isEFL = false,
}: {
  estructura: any;
  colors: any;
  areaColor: string;
  isEFL?: boolean;
}) {
  const fases = [
    { key: "experiencia" as const, label: isEFL ? "Experience" : "Experiencia", color: "#2980B9", emoji: "\uD83D\uDCA1" },
    { key: "reflexion" as const, label: isEFL ? "Reflection" : "Reflexi\u00f3n", color: "#8E44AD", emoji: "\uD83E\uDD14" },
    { key: "conceptualizacion" as const, label: isEFL ? "Conceptualization" : "Conceptualizaci\u00f3n", color: "#27AE60", emoji: "\uD83D\uDCDA" },
    { key: "aplicacion" as const, label: isEFL ? "Application" : "Aplicaci\u00f3n", color: "#E67E22", emoji: "\u2705" },
  ];

  return (
    <View className="px-5 mt-2">
      {/* Leyenda DUA */}
      <View style={[styles.duaLegend, { borderColor: colors.border }]}>
        <Text className="text-xs font-semibold text-foreground mb-1">
          {isEFL ? "UDL Indicators:" : "Indicadores DUA:"}
        </Text>
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={[styles.duaSquare, { backgroundColor: "#EC4899" }]} />
            <Text className="text-xs text-muted">{isEFL ? "Representation" : "Representaci\u00f3n"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={[styles.duaSquare, { backgroundColor: "#1E3A5F" }]} />
            <Text className="text-xs text-muted">{isEFL ? "Action & Expression" : "Acci\u00f3n y Expresi\u00f3n"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={[styles.duaSquare, { backgroundColor: "#22C55E" }]} />
            <Text className="text-xs text-muted">{isEFL ? "Engagement" : "Implicaci\u00f3n"}</Text>
          </View>
        </View>
      </View>

      {/* Duraci\u00f3n total */}
      <View style={[styles.totalDurationBadge, { backgroundColor: areaColor + "10", borderColor: areaColor + "30" }]}>
        <Text style={{ fontSize: 14 }}>{"\u23F0"}</Text>
        <Text style={{ color: areaColor, fontSize: 13, fontWeight: "700", marginLeft: 6 }}>
          {isEFL ? "Total duration: 45 minutes" : "Duraci\u00f3n total: 45 minutos"}
        </Text>
      </View>

      {fases.map((fase) => {
        const data = estructura[fase.key];
        if (!data) return null;
        const actividades: string[] = data.actividades || [];
        const duaActividades: DUAActividad[] = data.duaActividades || [];

        return (
          <View key={fase.key} style={[styles.faseCard, { borderLeftColor: fase.color, backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.faseCardHeader}>
              <Text style={{ fontSize: 16 }}>{fase.emoji}</Text>
              <Text style={[styles.faseCardTitle, { color: fase.color }]}>{fase.label}</Text>
              <View style={[styles.durationBadge, { backgroundColor: fase.color + "18" }]}>
                <Text style={{ fontSize: 11 }}>{"\u23F0"}</Text>
                <Text style={{ color: fase.color, fontSize: 11, fontWeight: "600", marginLeft: 3 }}>{data.duracion}</Text>
              </View>
            </View>
            {actividades.map((act: string, idx: number) => {
              const dua = duaActividades[idx] || { implicacion: false, representacion: false, accionExpresion: false };
              return (
                <View key={idx} style={styles.faseActRow}>
                  <View style={[styles.faseActNum, { backgroundColor: fase.color + "15" }]}>
                    <Text style={{ color: fase.color, fontSize: 11, fontWeight: "700" }}>{idx + 1}</Text>
                  </View>
                  <Text className="text-sm text-foreground flex-1 leading-5" style={{ marginLeft: 8 }}>{act}</Text>
                  {/* DUA Squares */}
                  <View style={styles.duaSquaresRow}>
                    <View style={[styles.duaSquareSmall, { backgroundColor: dua.representacion ? "#EC4899" : "#EC489930" }]} />
                    <View style={[styles.duaSquareSmall, { backgroundColor: dua.accionExpresion ? "#1E3A5F" : "#1E3A5F30" }]} />
                    <View style={[styles.duaSquareSmall, { backgroundColor: dua.implicacion ? "#22C55E" : "#22C55E30" }]} />
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ==========================================
// COMPONENTES DE FORMULARIO
// ==========================================
function SectionTitle({ title, emoji, colors }: { title: string; emoji: string; colors: any }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text className="text-lg font-semibold text-foreground" style={{ marginLeft: 8 }}>{title}</Text>
    </View>
  );
}

function FormField({
  label, value, onChangeText, placeholder, multiline, keyboardType, colors,
}: {
  label: string; value: string; onChangeText: (text: string) => void; placeholder: string;
  multiline?: boolean; keyboardType?: "default" | "numeric"; colors: any;
}) {
  return (
    <View className="px-5 mt-3">
      <Text className="text-sm font-medium text-muted mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType || "default"}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground, minHeight: multiline ? 100 : 48 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  backButton: { flexDirection: "row", alignItems: "center" },
  destrezaInfo: { borderRadius: 14, padding: 16, borderWidth: 1 },
  destrezaInfoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  destrezaCode: { fontSize: 20, fontWeight: "800" },
  destrezaCompact: { borderRadius: 12, padding: 12, borderWidth: 1 },
  stepIndicator: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  stepBadge: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  stepBadgeText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  temaBadge: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 14, borderWidth: 1 },
  totalDurationBadge: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 10, borderWidth: 1, marginBottom: 4 },
  faseCard: { borderRadius: 12, borderWidth: 1, borderLeftWidth: 4, padding: 14, marginTop: 10 },
  faseCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  faseCardTitle: { fontSize: 14, fontWeight: "700", marginLeft: 8, flex: 1 },
  durationBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  faseActRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 6 },
  faseActNum: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  sectionTitle: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 24, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, lineHeight: 22 },
  row: { flexDirection: "row", gap: 0 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 16, gap: 10 },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  generateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 16, gap: 10 },
  generateBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backBtnFull: { marginTop: 20, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  duaBanner: { borderRadius: 10, padding: 10, borderWidth: 1, alignItems: "center" as const },
  aiButton: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20 },
  toggleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  temaAlternativo: { borderRadius: 12, padding: 12, borderWidth: 1, marginTop: 8 },
  duaLegend: { borderRadius: 10, padding: 10, borderWidth: 1, marginBottom: 8 },
  duaSquare: { width: 14, height: 14, borderRadius: 2 },
  duaSquaresRow: { flexDirection: "row", gap: 3, marginLeft: 6, marginTop: 2 },
  duaSquareSmall: { width: 12, height: 12, borderRadius: 2 },
  duaSquareLarge: { width: 18, height: 18, borderRadius: 3 },
  duaPrincipiosBox: { borderRadius: 12, padding: 14, borderWidth: 1 },
  duaPrincipioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: 10 },
  bloquesContainer: { borderRadius: 12, padding: 12, borderWidth: 1 },
  bloqueRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 4 },
  estilosGrid: { borderRadius: 12, padding: 14, borderWidth: 1 },
  estiloRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: 8 },
  pctInput: { width: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, fontSize: 14, textAlign: "center" as const },
});
