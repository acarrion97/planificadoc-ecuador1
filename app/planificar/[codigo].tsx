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
  obtenerTemasSugeridos,
  TemaSugerido,
  Planificacion,
  generarTextoDUA,
  DUA_PRINCIPIOS,
  DUA_PRINCIPIOS_EN,
  obtenerInsercionesPorAsignatura,
  obtenerNombreInsercion,
  COMPETENCIAS,
  METODOLOGIAS_ACTIVAS,
  TECNICAS_EVALUACION,
  ESTILOS_APRENDIZAJE,
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

function getSugerenciaTecnicas(isEFL = false): string {
  if (isEFL) {
    return "Technique: Direct observation\nInstrument: Checklist / Assessment rubric\n\nTechnique: Written test\nInstrument: Questionnaire with open and closed questions\n\nTechnique: Portfolio\nInstrument: Learning evidence record";
  }
  return "Tecnica: Observacion directa\nInstrumento: Lista de cotejo / Rubrica de evaluacion\n\nTecnica: Prueba escrita\nInstrumento: Cuestionario de preguntas abiertas y cerradas\n\nTecnica: Portafolio\nInstrumento: Registro de evidencias de aprendizaje";
}

type PasoFlujo = "seleccion-tema" | "formulario";

export default function PlanificarScreen() {
  const colors = useColors();
  const router = useRouter();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const { addPlanificacion } = usePlanificaciones();
  const { exportarPDF, isExporting } = useExportPdf();

  const destreza = buscarPorCodigo(codigo || "");
  const { hasAccess } = useAccess();

  const temasSugeridos = useMemo(
    () => (destreza ? obtenerTemasSugeridos(destreza) : []),
    [destreza]
  );

  const [temasIA, setTemasIA] = useState<TemaSugerido[]>([]);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);

  const generateAiMutation = trpc.topics.generateAi.useMutation({
    onSuccess: (data) => {
      if (data.success && data.temas.length > 0) {
        setTemasIA((prev) => [...prev, ...data.temas]);
        setErrorIA(null);
      } else {
        setErrorIA(data.error || "No se pudieron generar temas");
      }
      setGenerandoIA(false);
    },
    onError: (error) => {
      setErrorIA("Error de conexión. Intenta de nuevo.");
      setGenerandoIA(false);
    },
  });

  const handleGenerarTemasIA = () => {
    if (!destreza || generandoIA) return;
    setGenerandoIA(true);
    setErrorIA(null);
    const todosLosTemas = [...temasSugeridos, ...temasIA];
    generateAiMutation.mutate({
      codigoDestreza: destreza.codigo,
      descripcionDestreza: destreza.descripcion,
      area: destreza.area,
      bloque: obtenerNombreBloque(destreza.area, destreza.bloque),
      subnivel: destreza.subnivel,
      temasExistentes: todosLosTemas.map((t) => t.titulo),
    });
  };

  const [paso, setPaso] = useState<PasoFlujo>("seleccion-tema");
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaSugerido | null>(null);
  const [temaExpandido, setTemaExpandido] = useState<string | null>(null);

  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState(
    destreza ? SUBNIVEL_GRADOS[destreza.subnivel] : ""
  );
  const [fecha, setFecha] = useState(getTodayDate());
  const [periodos, setPeriodos] = useState("1");
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState(
    destreza?.objetivos[0] || ""
  );
  const [actividades, setActividades] = useState("");
  const [recursos, setRecursos] = useState("");
  const [evaluacion, setEvaluacion] = useState(
    destreza?.indicadoresEvaluacion[0] || ""
  );
  const [tecnicas, setTecnicas] = useState(getSugerenciaTecnicas(destreza?.area === "EFL"));
  const [observaciones, setObservaciones] = useState("");
  const [insercionesCurriculares, setInsercionesCurriculares] = useState<string[]>([]);
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([]);
  const [metodologiasSeleccionadas, setMetodologiasSeleccionadas] = useState<string[]>([]);
  const [tecnicasSeleccionadas, setTecnicasSeleccionadas] = useState<string[]>([]);
  const [estilosSeleccionados, setEstilosSeleccionados] = useState<string[]>([]);
  const [duaRepresentacion, setDuaRepresentacion] = useState("");
  const [duaAccionExpresion, setDuaAccionExpresion] = useState("");
  const [duaImplicacion, setDuaImplicacion] = useState("");

  // Inserciones filtradas por asignatura y subnivel
  const insercionesDisponibles = useMemo(
    () => (destreza ? obtenerInsercionesPorAsignatura(destreza.area, destreza.subnivel) : []),
    [destreza]
  );

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
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Volver
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const areaInfo = AREAS_INFO[destreza.area];
  const isEFL = destreza.area === "EFL";

  const handleSeleccionarTema = (tema: TemaSugerido) => {
    setTemaSeleccionado(tema);
    setObjetivoAprendizaje(tema.objetivoClase);
    if (destreza) {
      const textoDUA = generarTextoDUA(destreza.area);
      const partes = textoDUA.split("\n\n");
      if (partes.length >= 3) {
        setDuaRepresentacion(partes[0]);
        setDuaAccionExpresion(partes[1]);
        setDuaImplicacion(partes[2]);
      }
    }

    const { estructura } = tema;
    const actividadesTexto = [
      `${isEFL ? "EXPERIENCE" : "EXPERIENCIA"} (${estructura.experiencia.duracion})`,
      ...estructura.experiencia.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
      "",
      `${isEFL ? "REFLECTION" : "REFLEXION"} (${estructura.reflexion.duracion})`,
      ...estructura.reflexion.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
      "",
      `${isEFL ? "CONCEPTUALIZATION" : "CONCEPTUALIZACION"} (${estructura.conceptualizacion.duracion})`,
      ...estructura.conceptualizacion.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
      "",
      `${isEFL ? "APPLICATION" : "APLICACION"} (${estructura.aplicacion.duracion})`,
      ...estructura.aplicacion.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
    ].join("\n");

    setActividades(actividadesTexto);
    setRecursos(tema.recursos.join(", "));
    setEvaluacion(tema.evaluacionFormativa);
    setPaso("formulario");
  };

  const handleSinTema = () => {
    setTemaSeleccionado(null);
    const sugerenciasGenericas: Record<string, string> = {
      M: "EXPERIENCIA (10 minutos)\n1. Activar conocimientos previos mediante preguntas generadoras.\n2. Presentar una situación problema del contexto cotidiano.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas de análisis sobre la experiencia.\n2. Solicitar que comparen sus respuestas con las de otros compañeros.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Presentar el tema con material concreto y manipulativo.\n2. Realizar práctica guiada con ejercicios paso a paso.\n3. Formalizar los conceptos en el cuaderno.\n\nAPLICACIÓN (10 minutos)\n1. Asignar trabajo en parejas para resolver ejercicios.\n2. Socializar resultados y corregir colectivamente.\n3. Asignar tarea de refuerzo.",
      LL: "EXPERIENCIA (10 minutos)\n1. Explorar conocimientos previos a través de lluvia de ideas.\n2. Presentar el propósito comunicativo de la clase.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas de análisis sobre el texto presentado.\n2. Solicitar que identifiquen las ideas principales.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Realizar lectura compartida del texto seleccionado.\n2. Guiar el análisis del contenido y estructura textual.\n3. Formalizar las reglas o conceptos lingüísticos.\n\nAPLICACIÓN (10 minutos)\n1. Asignar producción escrita individual o en parejas.\n2. Organizar revisión entre pares y corrección colaborativa.\n3. Asignar tarea de extensión.",
      CN: "EXPERIENCIA (10 minutos)\n1. Realizar observación directa o indirecta del fenómeno natural.\n2. Solicitar la formulación de hipótesis.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas de análisis sobre lo observado.\n2. Solicitar que comparen sus hipótesis con los resultados.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Guiar la experimentación con materiales del entorno.\n2. Explicar los conceptos científicos con ejemplos.\n3. Solicitar el registro de observaciones en cuaderno de campo.\n\nAPLICACIÓN (10 minutos)\n1. Asignar trabajo en grupos para analizar resultados.\n2. Socializar conclusiones de cada grupo.\n3. Asignar tarea de investigación.",
      CS: "EXPERIENCIA (10 minutos)\n1. Contextualizar históricamente mediante relatos o imágenes.\n2. Explorar conocimientos previos sobre el tema.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas de análisis: ¿Por qué ocurrieron estos hechos?\n2. Solicitar que identifiquen causas y consecuencias.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Guiar la lectura comprensiva de fuentes primarias y secundarias.\n2. Organizar debate dirigido sobre el tema estudiado.\n3. Solicitar la elaboración de organizadores gráficos.\n\nAPLICACIÓN (10 minutos)\n1. Asignar trabajo en grupos para profundizar el análisis.\n2. Presentar conclusiones de cada grupo.\n3. Reflexionar sobre la importancia del tema en la actualidad.",
      EF: "EXPERIENCIA (10 minutos)\n1. Dirigir calentamiento general y específico.\n2. Explicar el objetivo de la clase.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas sobre las dificultades encontradas.\n2. Solicitar que identifiquen qué músculos están trabajando.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Demostrar la actividad paso a paso.\n2. Organizar práctica guiada en grupos pequeños.\n3. Supervisar la ejecución y corregir posturas.\n\nAPLICACIÓN (10 minutos)\n1. Organizar juego o actividad competitiva aplicando lo aprendido.\n2. Dirigir vuelta a la calma con estiramientos.\n3. Recordar la importancia de la hidratación.",
      ECA: "EXPERIENCIA (10 minutos)\n1. Presentar obras artísticas relacionadas con el tema.\n2. Explorar conocimientos previos y sensibilizar.\n\nREFLEXIÓN (10 minutos)\n1. Formular preguntas sobre las emociones generadas.\n2. Solicitar que identifiquen elementos artísticos.\n\nCONCEPTUALIZACIÓN (15 minutos)\n1. Explicar la técnica artística a trabajar.\n2. Permitir la exploración libre de materiales.\n3. Guiar la creación artística individual o colectiva.\n\nAPLICACIÓN (10 minutos)\n1. Organizar la presentación y exposición de trabajos.\n2. Formular preguntas de retroalimentación.\n3. Promover la autoevaluación del proceso creativo.",
      EFL: "EXPERIENCE (10 minutes)\n1. Activate prior knowledge through warm-up questions.\n2. Present a communicative situation related to the topic.\n\nREFLECTION (10 minutes)\n1. Ask analysis questions about the experience.\n2. Have students compare their answers with classmates.\n\nCONCEPTUALIZATION (15 minutes)\n1. Present vocabulary and structures with visual support.\n2. Model the target language through examples.\n3. Practice guided exercises with the class.\n\nAPPLICATION (10 minutes)\n1. Assign pair or group communicative activities.\n2. Share results and provide feedback.\n3. Assign reinforcement homework.",
    };
    const recursosGenericos: Record<string, string> = {
      M: "Texto del estudiante, cuaderno de trabajo, material concreto, pizarra, marcadores, calculadora.",
      LL: "Texto del estudiante, cuaderno de trabajo, diccionario, biblioteca del aula, papelotes, marcadores.",
      CN: "Texto del estudiante, cuaderno de trabajo, materiales del entorno, láminas didácticas, TIC.",
      CS: "Texto del estudiante, cuaderno de trabajo, mapas, atlas, material audiovisual, fuentes históricas.",
      EF: "Espacio abierto o cancha, balones, conos, aros, cuerdas, silbato, cronómetro.",
      ECA: "Materiales artísticos, papel, cartulina, materiales reciclados, instrumentos musicales.",
      EFL: "Student's textbook, workbook, flashcards, audio player, whiteboard, markers, visual aids, digital resources.",
    };
    setActividades(sugerenciasGenericas[destreza.area] || sugerenciasGenericas.M);
    setRecursos(recursosGenericos[destreza.area] || recursosGenericos.M);
    if (destreza) {
      const textoDUA = generarTextoDUA(destreza.area);
      const partes = textoDUA.split("\n\n");
      if (partes.length >= 3) {
        setDuaRepresentacion(partes[0]);
        setDuaAccionExpresion(partes[1]);
        setDuaImplicacion(partes[2]);
      }
    }
    setPaso("formulario");
  };

  const handleSave = async () => {
    if (!docente.trim()) {
      if (Platform.OS === "web") {
        alert("Por favor ingresa el nombre del docente");
      } else {
        Alert.alert("Campo requerido", "Por favor ingresa el nombre del docente");
      }
      return;
    }

    const plan = {
      id: generateId(),
      fecha,
      institucion: institucion.trim(),
      docente: docente.trim(),
      grado: grado.trim(),
      asignatura: areaInfo.name,
      periodos: periodos.trim(),
      destreza,
      objetivoAprendizaje: objetivoAprendizaje.trim(),
      temaSeleccionado: temaSeleccionado || undefined,
      actividades: actividades.trim(),
      recursos: recursos.trim(),
      evaluacion: evaluacion.trim(),
      tecnicasInstrumentos: tecnicas.trim(),
      observaciones: observaciones.trim(),
      insercionesCurriculares: insercionesCurriculares.length > 0 ? insercionesCurriculares : undefined,
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
  // PASO 1: Seleccion de tema
  // ==========================================
  if (paso === "seleccion-tema") {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                Atr{"á"}s
              </Text>
            </Pressable>
          </View>

          <View className="px-5 mt-3">
            <View
              style={[
                styles.destrezaInfo,
                { backgroundColor: areaInfo.color + "10", borderColor: areaInfo.color + "30" },
              ]}
            >
              <View style={styles.destrezaInfoHeader}>
                <Text style={[styles.destrezaCode, { color: areaInfo.color }]}>
                  {destreza.codigo}
                </Text>
                <Text style={{ color: areaInfo.color, fontSize: 12, fontWeight: "500" }}>
                  {areaInfo.name}
                </Text>
              </View>
              <Text className="text-sm text-foreground mt-2 leading-5">
                {destreza.descripcion}
              </Text>
            </View>
          </View>

          <View className="px-5 mt-5">
            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <Text className="text-xl font-bold text-foreground ml-3">
                {isEFL ? "Choose a topic for your class" : "Elige un tema para tu clase"}
              </Text>
            </View>
            <Text className="text-sm text-muted mt-2 leading-5">
              {isEFL ? "Select one of the suggested topics to automatically generate the complete structure of your 45-minute class, or continue without a topic to customize manually." : "Selecciona uno de los temas sugeridos para generar automaticamente la estructura completa de tu clase de 45 minutos, o continua sin tema para personalizar manualmente."}
            </Text>
          </View>

          <View className="mt-4">
            {temasSugeridos.map((tema) => (
              <TemaCard
                key={tema.id}
                tema={tema}
                colors={colors}
                areaColor={areaInfo.color}
                isExpanded={temaExpandido === tema.id}
                onToggleExpand={() =>
                  setTemaExpandido(temaExpandido === tema.id ? null : tema.id)
                }
                onSelect={() => handleSeleccionarTema(tema)}
                isEFL={isEFL}
              />
            ))}

            {/* Temas generados por IA */}
            {temasIA.length > 0 && (
              <View className="px-5 mt-5 mb-2">
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ fontSize: 16 }}>{"\u2728"}</Text>
                  <Text className="text-base font-bold text-foreground" style={{ marginLeft: 6 }}>
                    {isEFL ? "AI-generated topics" : "Temas generados con IA"}
                  </Text>
                </View>
              </View>
            )}
            {temasIA.map((tema) => (
              <TemaCard
                key={tema.id}
                tema={tema}
                colors={colors}
                areaColor={areaInfo.color}
                isExpanded={temaExpandido === tema.id}
                onToggleExpand={() =>
                  setTemaExpandido(temaExpandido === tema.id ? null : tema.id)
                }
                onSelect={() => handleSeleccionarTema(tema)}
                isEFL={isEFL}
              />
            ))}
          </View>

          {/* Botón Generar temas con IA - solo para usuarios con acceso */}
          {hasAccess && (
            <View className="px-5 mt-3">
              <Pressable
                onPress={handleGenerarTemasIA}
                disabled={generandoIA}
                style={({ pressed }) => [
                  styles.aiButton,
                  {
                    backgroundColor: generandoIA ? colors.surface : "#7C3AED",
                    opacity: pressed && !generandoIA ? 0.85 : 1,
                    transform: [{ scale: pressed && !generandoIA ? 0.97 : 1 }],
                  },
                ]}
              >
                {generandoIA ? (
                  <>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={{ color: colors.muted, fontSize: 15, fontWeight: "600", marginLeft: 10 }}>
                      {isEFL ? "Generating topics with AI..." : "Generando temas con IA..."}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 18 }}>{"\u2728"}</Text>
                    <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700", marginLeft: 8 }}>
                      {isEFL ? "Generate more topics with AI" : "Generar más temas con IA"}
                    </Text>
                  </>
                )}
              </Pressable>
              {errorIA && (
                <Text style={{ color: colors.error, fontSize: 13, marginTop: 6, textAlign: "center" }}>
                  {errorIA}
                </Text>
              )}
            </View>
          )}

          {/* Botón para usuarios sin acceso - mostrar que es premium */}
          {!hasAccess && (
            <View className="px-5 mt-3">
              <View
                style={[
                  styles.aiButton,
                  { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{"\uD83D\uDD12"}</Text>
                <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600", marginLeft: 8 }}>
                  {isEFL ? "Generate topics with AI (Premium Plan)" : "Genera temas con IA (Plan Premium)"}
                </Text>
              </View>
            </View>
          )}

          <View className="px-5 mt-4 mb-10">
            <Pressable
              onPress={handleSinTema}
              style={({ pressed }) => [
                styles.skipBtn,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed ? colors.surface : "transparent",
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\u270F\uFE0F"}</Text>
              <Text style={{ color: colors.muted, fontSize: 15, fontWeight: "600", marginLeft: 8 }}>
                {isEFL ? "Continue without topic (customize manually)" : "Continuar sin tema (personalizar manualmente)"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ==========================================
  // PASO 2: Formulario de planificacion
  // ==========================================
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-4">
            <Pressable
              onPress={() => setPaso("seleccion-tema")}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                {isEFL ? "Change topic" : "Cambiar tema"}
              </Text>
            </Pressable>

            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text className="text-xl font-bold text-foreground ml-3">
                {isEFL ? "Microcurricular Lesson Plan" : `Planificaci${"\u00f3"}n Microcurricular`}
              </Text>
            </View>
          </View>

          {temaSeleccionado && (
            <View className="px-5 mt-3">
              <View
                style={[
                  styles.temaBadge,
                  { backgroundColor: areaInfo.color + "12", borderColor: areaInfo.color + "35" },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{"\u2728"}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ color: areaInfo.color, fontSize: 13, fontWeight: "600" }}>
                    {isEFL ? "Selected topic" : "Tema seleccionado"}
                  </Text>
                  <Text className="text-sm font-bold text-foreground mt-1">
                    {temaSeleccionado.titulo}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className="px-5 mt-3">
            <View
              style={[
                styles.destrezaCompact,
                { backgroundColor: areaInfo.color + "08", borderColor: areaInfo.color + "20" },
              ]}
            >
              <Text style={[{ color: areaInfo.color, fontSize: 15, fontWeight: "800" }]}>
                {destreza.codigo}
              </Text>
              <Text className="text-xs text-muted mt-1" numberOfLines={2}>
                {destreza.descripcion}
              </Text>
            </View>
          </View>

          <SectionTitle title={isEFL ? "General Information" : "Datos Informativos"} emoji={"\u2139\uFE0F"} colors={colors} />

          <FormField
            label={isEFL ? "Educational Institution" : "Institución Educativa"}
            value={institucion}
            onChangeText={setInstitucion}
            placeholder={isEFL ? "Institution name" : "Nombre de la institución"}
            colors={colors}
          />
          <FormField
            label={isEFL ? "Teacher *" : "Docente *"}
            value={docente}
            onChangeText={setDocente}
            placeholder={isEFL ? "Teacher's name" : "Nombre del docente"}
            colors={colors}
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                label={isEFL ? "Grade / Level" : "Grado / Curso"}
                value={grado}
                onChangeText={setGrado}
                placeholder={isEFL ? "e.g.: 5th EGB" : "Ej: 5to EGB"}
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label={isEFL ? "Date" : "Fecha"}
                value={fecha}
                onChangeText={setFecha}
                placeholder="DD/MM/AAAA"
                colors={colors}
              />
            </View>
          </View>
          <FormField
            label={isEFL ? "Number of Periods" : "Número de Períodos"}
            value={periodos}
            onChangeText={setPeriodos}
            placeholder="1"
            keyboardType="numeric"
            colors={colors}
          />

          <SectionTitle title={isEFL ? "Learning Objective" : "Objetivo de Aprendizaje"} emoji={"\uD83C\uDFAF"} colors={colors} />
          <FormField
            label={isEFL ? "Objective" : "Objetivo"}
            value={objetivoAprendizaje}
            onChangeText={setObjetivoAprendizaje}
            placeholder={isEFL ? "Learning objective" : "Objetivo de aprendizaje"}
            multiline
            colors={colors}
          />

          {temaSeleccionado && (
            <>
              <SectionTitle title={isEFL ? "Class Structure (45 min)" : "Estructura de la Clase (45 min)"} emoji={"\uD83C\uDFEB"} colors={colors} />
              <EstructuraClaseView
                tema={temaSeleccionado}
                colors={colors}
                areaColor={areaInfo.color}
                isEFL={isEFL}
              />
            </>
          )}

          <SectionTitle title={isEFL ? "Learning Activities" : "Actividades de Aprendizaje"} emoji={"\uD83D\uDCCB"} colors={colors} />
          <FormField
            label={isEFL ? "Activities (editable)" : "Actividades (editable)"}
            value={actividades}
            onChangeText={setActividades}
            placeholder={isEFL ? "Describe the activities..." : "Describe las actividades..."}
            multiline
            colors={colors}
          />

          <SectionTitle title={isEFL ? "Teaching Resources" : "Recursos Didácticos"} emoji={"\uD83D\uDCE6"} colors={colors} />
          <FormField
            label={isEFL ? "Resources" : "Recursos"}
            value={recursos}
            onChangeText={setRecursos}
            placeholder={isEFL ? "List of resources..." : "Lista de recursos..."}
            multiline
            colors={colors}
          />

          <SectionTitle title={isEFL ? "Assessment" : "Evaluación"} emoji={"\uD83D\uDCCA"} colors={colors} />
          <FormField
            label={isEFL ? "Assessment Indicators" : "Indicadores de Evaluación"}
            value={evaluacion}
            onChangeText={setEvaluacion}
            placeholder={isEFL ? "Indicators..." : "Indicadores..."}
            multiline
            colors={colors}
          />
          <FormField
            label={isEFL ? "Techniques and Instruments" : "Técnicas e Instrumentos"}
            value={tecnicas}
            onChangeText={setTecnicas}
            placeholder={isEFL ? "Assessment techniques and instruments..." : "Técnicas e instrumentos de evaluación..."}
            multiline
            colors={colors}
          />

          {/* ===== INSERCIONES CURRICULARES ===== */}
          <SectionTitle title={isEFL ? "Curricular Insertions (Cross-cutting Themes)" : "Inserciones Curriculares (Ejes Transversales)"} emoji={"\uD83C\uDF10"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-3">
              {isEFL ? "Select the cross-cutting themes addressed in this lesson:" : "Selecciona los ejes transversales que se abordan en esta clase:"}
            </Text>
            {insercionesDisponibles.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary + '15' : colors.surface,
                        opacity: pressed ? 0.7 : 1,
                      }]}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? colors.primary : colors.foreground,
                      }}>
                        {ins.emoji} {isEFL ? ins.nameEN : ins.nombreCorto}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Text className="text-xs text-muted">
                {isEFL ? "No specific insertions for this subject/level" : "No hay inserciones espec\u00edficas para esta asignatura/subnivel"}
              </Text>
            )}
          </View>

          {/* ===== COMPETENCIAS ===== */}
          <SectionTitle title={isEFL ? "Competencies" : "Competencias"} emoji={"\uD83C\uDFAF"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-3">
              {isEFL ? "Select the competencies developed in this lesson:" : "Selecciona las competencias que se desarrollan en esta clase:"}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary + '15' : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? colors.primary : colors.foreground,
                    }}>
                      {comp.emoji} {isEFL ? comp.nameEN : comp.nombreCorto + " - " + comp.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== METODOLOGÍAS ACTIVAS ===== */}
          <SectionTitle title={isEFL ? "Active Methodologies" : "Metodolog\u00edas Activas"} emoji={"\uD83D\uDCA1"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-3">
              {isEFL ? "Select the active methodologies used:" : "Selecciona las metodolog\u00edas activas que utilizar\u00e1s:"}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: isSelected ? "#7C3AED" : colors.border,
                      backgroundColor: isSelected ? "#7C3AED" + '15' : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? "#7C3AED" : colors.foreground,
                    }}>
                      {isEFL ? met.nameEN : met.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== TÉCNICAS E INSTRUMENTOS DE EVALUACIÓN ===== */}
          <SectionTitle title={isEFL ? "Assessment Techniques & Instruments" : "T\u00e9cnicas e Instrumentos de Evaluaci\u00f3n"} emoji={"\uD83D\uDCCB"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-3">
              {isEFL ? "Select the assessment techniques you will use:" : "Selecciona las t\u00e9cnicas e instrumentos que utilizar\u00e1s:"}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: isSelected ? "#16A34A" : colors.border,
                      backgroundColor: isSelected ? "#16A34A" + '15' : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? "#16A34A" : colors.foreground,
                    }}>
                      {isEFL ? tec.nameEN : tec.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== ESTILOS DE APRENDIZAJE ===== */}
          <SectionTitle title={isEFL ? "Learning Styles" : "Estilos de Aprendizaje"} emoji={"\uD83E\uDDE0"} colors={colors} />
          <View className="px-5 mt-1 mb-2">
            <Text className="text-xs text-muted mb-3">
              {isEFL ? "Select the learning styles addressed:" : "Selecciona los estilos de aprendizaje que se abordan:"}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ESTILOS_APRENDIZAJE.map((est) => {
                const isSelected = estilosSeleccionados.includes(est.id);
                return (
                  <Pressable
                    key={est.id}
                    onPress={() => {
                      if (isSelected) {
                        setEstilosSeleccionados(estilosSeleccionados.filter(id => id !== est.id));
                      } else {
                        setEstilosSeleccionados([...estilosSeleccionados, est.id]);
                      }
                    }}
                    style={({ pressed }) => [{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: isSelected ? "#D97706" : colors.border,
                      backgroundColor: isSelected ? "#D97706" + '15' : colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    }]}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? "#D97706" : colors.foreground,
                    }}>
                      {est.emoji} {isEFL ? est.nameEN : est.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ===== SECCIÓN DUA ===== */}
          <SectionTitle title={isEFL ? "Universal Design for Learning (UDL)" : "Diseño Universal para el Aprendizaje (DUA)"} emoji={"\u267F"} colors={colors} />
          <View className="px-5 mt-1 mb-1">
            <View style={[styles.duaBanner, { backgroundColor: "#7C3AED" + "10", borderColor: "#7C3AED" + "30" }]}>
              <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600", textAlign: "center" }}>
                {isEFL ? "Curricular adaptations based on the 3 UDL principles" : "Adaptaciones curriculares basadas en los 3 principios del DUA"}
              </Text>
            </View>
          </View>

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#2563EB" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#2563EB" }}>
                {isEFL ? "Principle 1: Multiple Means of Representation" : `Principio 1: M${"\u00fa"}ltiples formas de Representaci${"\u00f3"}n`}
              </Text>
              <Text style={{ fontSize: 10, color: "#2563EB", opacity: 0.7 }}>
                {isEFL ? "The WHAT of learning" : `El QU${"\u00c9"} del aprendizaje`}
              </Text>
            </View>
          </View>
          <FormField
            label={isEFL ? "Representation Strategies" : "Estrategias de Representación"}
            value={duaRepresentacion}
            onChangeText={setDuaRepresentacion}
            placeholder={isEFL ? "How will you present information in multiple ways..." : "Cómo presentará la información de múltiples formas..."}
            multiline
            colors={colors}
          />

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#16A34A" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#16A34A" }}>
                {isEFL ? "Principle 2: Multiple Means of Action and Expression" : `Principio 2: M${"\u00fa"}ltiples formas de Acci${"\u00f3"}n y Expresi${"\u00f3"}n`}
              </Text>
              <Text style={{ fontSize: 10, color: "#16A34A", opacity: 0.7 }}>
                {isEFL ? "The HOW of learning" : `El C${"\u00d3"}MO del aprendizaje`}
              </Text>
            </View>
          </View>
          <FormField
            label={isEFL ? "Action and Expression Strategies" : "Estrategias de Acción y Expresión"}
            value={duaAccionExpresion}
            onChangeText={setDuaAccionExpresion}
            placeholder={isEFL ? "How will students demonstrate what they learned..." : "Cómo los estudiantes demostrarán lo aprendido..."}
            multiline
            colors={colors}
          />

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#D97706" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#D97706" }}>
                {isEFL ? "Principle 3: Multiple Means of Engagement" : `Principio 3: M${"\u00fa"}ltiples formas de Implicaci${"\u00f3"}n`}
              </Text>
              <Text style={{ fontSize: 10, color: "#D97706", opacity: 0.7 }}>
                {isEFL ? "The WHY of learning" : `El POR QU${"\u00c9"} del aprendizaje`}
              </Text>
            </View>
          </View>
          <FormField
            label={isEFL ? "Engagement Strategies" : "Estrategias de Implicación"}
            value={duaImplicacion}
            onChangeText={setDuaImplicacion}
            placeholder={isEFL ? "How to motivate and engage all students..." : "Cómo motivar e involucrar a todos los estudiantes..."}
            multiline
            colors={colors}
          />

          <SectionTitle title={isEFL ? "Observations" : "Observaciones"} emoji={"\uD83D\uDCCC"} colors={colors} />
          <FormField
            label={isEFL ? "Observations" : "Observaciones"}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder={isEFL ? "Additional observations (optional)" : "Observaciones adicionales (opcional)"}
            multiline
            colors={colors}
          />

          <View className="px-5 mt-6 mb-10">
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{"\uD83D\uDCBE"}</Text>
              <Text style={styles.saveBtnText}>{isEFL ? "Save Lesson Plan" : `Guardar Planificaci${"\u00f3"}n`}</Text>
            </Pressable>
            <Text className="text-xs text-muted text-center mt-3">
              {isEFL ? "Once saved, you can export the lesson plan as a PDF with the official Ministry of Education format" : `Al guardar podr${"\u00e1"}s exportar la planificaci${"\u00f3"}n como PDF con formato oficial del Ministerio de Educaci${"\u00f3"}n`}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ==========================================
// COMPONENTE: Tarjeta de tema sugerido
// ==========================================
function TemaCard({
  tema,
  colors,
  areaColor,
  isExpanded,
  onToggleExpand,
  onSelect,
  isEFL = false,
}: {
  tema: TemaSugerido;
  colors: any;
  areaColor: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  isEFL?: boolean;
}) {
  return (
    <View className="px-5 mt-3">
      <View
        style={[
          styles.temaCard,
          {
            backgroundColor: colors.surface,
            borderColor: isExpanded ? areaColor + "50" : colors.border,
            borderWidth: isExpanded ? 2 : 1,
          },
        ]}
      >
        <Pressable
          onPress={onToggleExpand}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.temaCardHeader}>
            <View style={{ flex: 1 }}>
              <Text className="text-base font-bold text-foreground">
                {tema.titulo}
              </Text>
              <Text className="text-sm text-muted mt-1 leading-5">
                {tema.descripcionBreve}
              </Text>
            </View>
            <Text style={{ fontSize: 18, marginLeft: 8, color: colors.muted }}>
              {isExpanded ? "\u25B2" : "\u25BC"}
            </Text>
          </View>
        </Pressable>

        {isExpanded && (
          <View style={styles.temaPreview}>
            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <Text style={{ fontSize: 14 }}>{"\uD83C\uDFAF"}</Text>
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  {isEFL ? "Class Objective" : "Objetivo de la clase"}
                </Text>
              </View>
              <Text className="text-sm text-foreground leading-5 mt-1">
                {tema.objetivoClase}
              </Text>
            </View>

            {/* Duracion total */}
            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <Text style={{ fontSize: 14 }}>{"\u23F0"}</Text>
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  {isEFL ? "Total duration: 45 minutes" : `Duraci${"\u00f3"}n total: 45 minutos`}
                </Text>
              </View>
            </View>

            {/* 4 Fases ERCA */}
            <FasePreview
              label={isEFL ? "Experience" : "Experiencia"}
              fase={tema.estructura.experiencia}
              color="#2980B9"
              colors={colors}
            />
            <FasePreview
              label={isEFL ? "Reflection" : "Reflexi\u00f3n"}
              fase={tema.estructura.reflexion}
              color="#8E44AD"
              colors={colors}
            />
            <FasePreview
              label={isEFL ? "Conceptualization" : "Conceptualizaci\u00f3n"}
              fase={tema.estructura.conceptualizacion}
              color="#27AE60"
              colors={colors}
            />
            <FasePreview
              label={isEFL ? "Application" : "Aplicaci\u00f3n"}
              fase={tema.estructura.aplicacion}
              color="#E67E22"
              colors={colors}
            />

            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <Text style={{ fontSize: 14 }}>{"\uD83D\uDCE6"}</Text>
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  {isEFL ? "Resources" : "Recursos"}
                </Text>
              </View>
              <Text className="text-sm text-muted mt-1">
                {tema.recursos.join(" - ")}
              </Text>
            </View>

            <Pressable
              onPress={onSelect}
              style={({ pressed }) => [
                styles.selectBtn,
                {
                  backgroundColor: areaColor,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\u2714\uFE0F"}</Text>
              <Text style={styles.selectBtnText}>{isEFL ? "Use this topic" : "Usar este tema"}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// ==========================================
// COMPONENTE: Previsualizacion de fase
// ==========================================
function FasePreview({
  label,
  fase,
  color,
  colors,
}: {
  label: string;
  fase: { titulo: string; duracion: string; actividades: string[] };
  color: string;
  colors: any;
}) {
  return (
    <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
      <View style={styles.previewSectionHeader}>
        <View style={[styles.faseDot, { backgroundColor: color }]} />
        <Text style={[styles.previewSectionTitle, { color }]}>
          {label}
        </Text>
        <Text style={[styles.faseDuration, { color: colors.muted }]}>
          {fase.duracion}
        </Text>
      </View>
      {fase.actividades.map((act: string, idx: number) => (
        <View key={idx} style={styles.actividadRow}>
          <Text style={[styles.actividadBullet, { color }]}>{"\u2022"}</Text>
          <Text className="text-xs text-foreground flex-1 leading-4" style={{ marginLeft: 6 }}>
            {act}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ==========================================
// COMPONENTE: Vista de estructura de clase en formulario
// ==========================================
function EstructuraClaseView({
  tema,
  colors,
  areaColor,
  isEFL = false,
}: {
  tema: TemaSugerido;
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
      {/* Duracion total badge */}
      <View style={[styles.totalDurationBadge, { backgroundColor: areaColor + "10", borderColor: areaColor + "30" }]}>
        <Text style={{ fontSize: 14 }}>{"\u23F0"}</Text>
        <Text style={{ color: areaColor, fontSize: 13, fontWeight: "700", marginLeft: 6 }}>
          {isEFL ? "Total duration: 45 minutes" : `Duraci${"\u00f3"}n total: 45 minutos`}
        </Text>
      </View>

      {fases.map((fase) => {
        const data = tema.estructura[fase.key];
        return (
          <View
            key={fase.key}
            style={[
              styles.faseCard,
              { borderLeftColor: fase.color, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.faseCardHeader}>
              <Text style={{ fontSize: 16 }}>{fase.emoji}</Text>
              <Text style={[styles.faseCardTitle, { color: fase.color }]}>
                {fase.label}
              </Text>
              <View style={[styles.durationBadge, { backgroundColor: fase.color + "18" }]}>
                <Text style={{ fontSize: 11 }}>{"\u23F0"}</Text>
                <Text style={{ color: fase.color, fontSize: 11, fontWeight: "600", marginLeft: 3 }}>
                  {data.duracion}
                </Text>
              </View>
            </View>
            {data.actividades.map((act: string, idx: number) => (
              <View key={idx} style={styles.faseActRow}>
                <View style={[styles.faseActNum, { backgroundColor: fase.color + "15" }]}>
                  <Text style={{ color: fase.color, fontSize: 11, fontWeight: "700" }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text className="text-sm text-foreground flex-1 leading-5" style={{ marginLeft: 8 }}>
                  {act}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

// ==========================================
// COMPONENTES DE FORMULARIO
// ==========================================
function SectionTitle({
  title,
  emoji,
  colors,
}: {
  title: string;
  emoji: string;
  colors: any;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text
        className="text-lg font-semibold text-foreground"
        style={{ marginLeft: 8 }}
      >
        {title}
      </Text>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
  colors: any;
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
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            minHeight: multiline ? 100 : 48,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  destrezaInfo: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  destrezaInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  destrezaCode: {
    fontSize: 20,
    fontWeight: "800",
  },
  destrezaCompact: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  temaCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  temaCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  temaPreview: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  previewSection: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  previewSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  faseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  faseDuration: {
    fontSize: 11,
    marginLeft: "auto",
  },
  actividadRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
    paddingLeft: 16,
  },
  actividadBullet: {
    fontSize: 14,
    lineHeight: 16,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  temaBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  totalDurationBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  faseCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    marginTop: 10,
  },
  faseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  faseCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  faseActRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  faseActNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    gap: 0,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backBtnFull: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  duaBanner: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center" as const,
  },
  duaPrincipioHeader: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 2,
  },
  aiButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});
