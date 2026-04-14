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
} from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useExportPdf } from "@/hooks/use-export-pdf";

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

function getSugerenciaTecnicas(): string {
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

  const temasSugeridos = useMemo(
    () => (destreza ? obtenerTemasSugeridos(destreza) : []),
    [destreza]
  );

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
  const [tecnicas, setTecnicas] = useState(getSugerenciaTecnicas());
  const [observaciones, setObservaciones] = useState("");
  const [duaRepresentacion, setDuaRepresentacion] = useState("");
  const [duaAccionExpresion, setDuaAccionExpresion] = useState("");
  const [duaImplicacion, setDuaImplicacion] = useState("");

  if (!destreza) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <MaterialIcons name="error-outline" size={56} color={colors.error} />
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

  const handleSeleccionarTema = (tema: TemaSugerido) => {
    setTemaSeleccionado(tema);
    setObjetivoAprendizaje(tema.objetivoClase);
    // Auto-llenar DUA con estrategias del área
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
      `ANTICIPACION (${estructura.anticipacion.duracion})`,
      ...estructura.anticipacion.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
      "",
      `DESARROLLO (${estructura.desarrollo.duracion})`,
      ...estructura.desarrollo.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
      "",
      `CIERRE (${estructura.cierre.duracion})`,
      ...estructura.cierre.actividades.map((a: string, i: number) => `${i + 1}. ${a}`),
    ].join("\n");

    setActividades(actividadesTexto);
    setRecursos(tema.recursos.join(", "));
    setEvaluacion(tema.evaluacionFormativa);
    setPaso("formulario");
  };

  const handleSinTema = () => {
    setTemaSeleccionado(null);
    const sugerenciasGenericas: Record<string, string> = {
      M: "ANTICIPACION (10 minutos)\n1. Activar conocimientos previos mediante preguntas generadoras.\n2. Presentar una situacion problema del contexto cotidiano.\n\nDESARROLLO (25 minutos)\n1. Presentar el tema con material concreto y manipulativo.\n2. Realizar practica guiada con ejercicios paso a paso.\n3. Asignar trabajo en parejas para resolver ejercicios.\n4. Proponer practica individual con ejercicios de aplicacion.\n\nCIERRE (10 minutos)\n1. Socializar resultados y corregir colectivamente.\n2. Formular preguntas de retroalimentacion sobre lo aprendido.\n3. Asignar tarea de refuerzo.",
      LL: "ANTICIPACION (10 minutos)\n1. Explorar conocimientos previos a traves de lluvia de ideas.\n2. Presentar el proposito de la clase.\n\nDESARROLLO (25 minutos)\n1. Realizar lectura compartida del texto seleccionado.\n2. Guiar el analisis del contenido y estructura textual.\n3. Asignar produccion escrita individual o en parejas.\n4. Organizar revision entre pares y correccion colaborativa.\n\nCIERRE (10 minutos)\n1. Compartir las producciones escritas.\n2. Formular preguntas de retroalimentacion sobre el aprendizaje.\n3. Asignar tarea de extension.",
      CN: "ANTICIPACION (10 minutos)\n1. Realizar observacion directa o indirecta del fenomeno natural.\n2. Solicitar la formulacion de hipotesis.\n\nDESARROLLO (25 minutos)\n1. Guiar la experimentacion con materiales del entorno.\n2. Explicar los conceptos cientificos con ejemplos.\n3. Solicitar el registro de observaciones y datos en cuaderno de campo.\n4. Asignar trabajo en grupos para analizar resultados.\n\nCIERRE (10 minutos)\n1. Socializar conclusiones de cada grupo.\n2. Formular preguntas de retroalimentacion.\n3. Asignar tarea de investigacion.",
      CS: "ANTICIPACION (10 minutos)\n1. Contextualizar historicamente mediante relatos o imagenes.\n2. Explorar conocimientos previos sobre el tema.\n\nDESARROLLO (25 minutos)\n1. Guiar la lectura comprensiva de fuentes primarias y secundarias.\n2. Organizar debate dirigido sobre el tema estudiado.\n3. Solicitar la elaboracion de organizadores graficos.\n4. Asignar trabajo en grupos para profundizar el analisis.\n\nCIERRE (10 minutos)\n1. Presentar conclusiones de cada grupo.\n2. Formular preguntas de retroalimentacion.\n3. Reflexionar sobre la importancia del tema en la actualidad.",
      EF: "ANTICIPACION (10 minutos)\n1. Dirigir calentamiento general y especifico.\n2. Explicar el objetivo de la clase.\n\nDESARROLLO (25 minutos)\n1. Demostrar la actividad paso a paso.\n2. Organizar practica guiada en grupos pequenos.\n3. Supervisar la ejecucion autonoma de la actividad.\n4. Corregir posturas y tecnicas.\n\nCIERRE (10 minutos)\n1. Dirigir vuelta a la calma con estiramientos.\n2. Formular preguntas de retroalimentacion sobre lo aprendido.\n3. Recordar la importancia de la hidratacion.",
      ECA: "ANTICIPACION (10 minutos)\n1. Presentar obras artisticas relacionadas con el tema.\n2. Explorar conocimientos previos y sensibilizar.\n\nDESARROLLO (25 minutos)\n1. Explicar la tecnica artistica a trabajar.\n2. Permitir la exploracion libre de materiales.\n3. Guiar la creacion artistica individual o colectiva.\n4. Acompanar el proceso creativo individualmente.\n\nCIERRE (10 minutos)\n1. Organizar la presentacion y exposicion de trabajos.\n2. Formular preguntas de retroalimentacion.\n3. Promover la autoevaluacion del proceso creativo.",
    };
    const recursosGenericos: Record<string, string> = {
      M: "Texto del estudiante, cuaderno de trabajo, material concreto, pizarra, marcadores, calculadora.",
      LL: "Texto del estudiante, cuaderno de trabajo, diccionario, biblioteca del aula, papelotes, marcadores.",
      CN: "Texto del estudiante, cuaderno de trabajo, materiales del entorno, laminas didacticas, TIC.",
      CS: "Texto del estudiante, cuaderno de trabajo, mapas, atlas, material audiovisual, fuentes historicas.",
      EF: "Espacio abierto o cancha, balones, conos, aros, cuerdas, silbato, cronometro.",
      ECA: "Materiales artisticos, papel, cartulina, materiales reciclados, instrumentos musicales.",
    };
    setActividades(sugerenciasGenericas[destreza.area] || sugerenciasGenericas.M);
    setRecursos(recursosGenericos[destreza.area] || recursosGenericos.M);
    // Auto-llenar DUA
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
      dua: {
        representacion: duaRepresentacion.trim(),
        accionExpresion: duaAccionExpresion.trim(),
        implicacion: duaImplicacion.trim(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addPlanificacion(plan);

    // Navegar a la pantalla de ver plan para que pueda exportar PDF
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
              <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                Atras
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
                Elige un tema para tu clase
              </Text>
            </View>
            <Text className="text-sm text-muted mt-2 leading-5">
              Selecciona uno de los temas sugeridos para generar automaticamente la estructura completa de tu clase de 45 minutos, o continua sin tema para personalizar manualmente.
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
              />
            ))}
          </View>

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
              <MaterialIcons name="edit" size={20} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 15, fontWeight: "600", marginLeft: 8 }}>
                Continuar sin tema (personalizar manualmente)
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
              <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
                Cambiar tema
              </Text>
            </Pressable>

            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text className="text-xl font-bold text-foreground ml-3">
                Planificacion Microcurricular
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
                <MaterialIcons name="auto-awesome" size={18} color={areaInfo.color} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ color: areaInfo.color, fontSize: 13, fontWeight: "600" }}>
                    Tema seleccionado
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

          <SectionTitle title="Datos Informativos" icon="info" colors={colors} />

          <FormField
            label="Institucion Educativa"
            value={institucion}
            onChangeText={setInstitucion}
            placeholder="Nombre de la institucion"
            colors={colors}
          />
          <FormField
            label="Docente *"
            value={docente}
            onChangeText={setDocente}
            placeholder="Nombre del docente"
            colors={colors}
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                label="Grado / Curso"
                value={grado}
                onChangeText={setGrado}
                placeholder="Ej: 5to EGB"
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Fecha"
                value={fecha}
                onChangeText={setFecha}
                placeholder="DD/MM/AAAA"
                colors={colors}
              />
            </View>
          </View>
          <FormField
            label="Numero de Periodos"
            value={periodos}
            onChangeText={setPeriodos}
            placeholder="1"
            keyboardType="numeric"
            colors={colors}
          />

          <SectionTitle title="Objetivo de Aprendizaje" icon="flag" colors={colors} />
          <FormField
            label="Objetivo"
            value={objetivoAprendizaje}
            onChangeText={setObjetivoAprendizaje}
            placeholder="Objetivo de aprendizaje"
            multiline
            colors={colors}
          />

          {temaSeleccionado && (
            <>
              <SectionTitle title="Estructura de la Clase (45 min)" icon="school" colors={colors} />
              <EstructuraClaseView
                tema={temaSeleccionado}
                colors={colors}
                areaColor={areaInfo.color}
              />
            </>
          )}

          <SectionTitle title="Actividades de Aprendizaje" icon="assignment" colors={colors} />
          <FormField
            label="Actividades (editable)"
            value={actividades}
            onChangeText={setActividades}
            placeholder="Describe las actividades..."
            multiline
            colors={colors}
          />

          <SectionTitle title="Recursos Didacticos" icon="inventory" colors={colors} />
          <FormField
            label="Recursos"
            value={recursos}
            onChangeText={setRecursos}
            placeholder="Lista de recursos..."
            multiline
            colors={colors}
          />

          <SectionTitle title="Evaluacion" icon="assessment" colors={colors} />
          <FormField
            label="Indicadores de Evaluacion"
            value={evaluacion}
            onChangeText={setEvaluacion}
            placeholder="Indicadores..."
            multiline
            colors={colors}
          />
          <FormField
            label="Tecnicas e Instrumentos"
            value={tecnicas}
            onChangeText={setTecnicas}
            placeholder="Tecnicas e instrumentos de evaluacion..."
            multiline
            colors={colors}
          />

          {/* ===== SECCIÓN DUA ===== */}
          <SectionTitle title="Diseño Universal para el Aprendizaje (DUA)" icon="accessibility" colors={colors} />
          <View className="px-5 mt-1 mb-1">
            <View style={[styles.duaBanner, { backgroundColor: "#7C3AED" + "10", borderColor: "#7C3AED" + "30" }]}>
              <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600", textAlign: "center" }}>
                Adaptaciones curriculares basadas en los 3 principios del DUA
              </Text>
            </View>
          </View>

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#2563EB" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#2563EB" }}>
                Principio 1: Múltiples formas de Representación
              </Text>
              <Text style={{ fontSize: 10, color: "#2563EB", opacity: 0.7 }}>
                El QUÉ del aprendizaje
              </Text>
            </View>
          </View>
          <FormField
            label="Estrategias de Representación"
            value={duaRepresentacion}
            onChangeText={setDuaRepresentacion}
            placeholder="Cómo presentará la información de múltiples formas..."
            multiline
            colors={colors}
          />

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#16A34A" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#16A34A" }}>
                Principio 2: Múltiples formas de Acción y Expresión
              </Text>
              <Text style={{ fontSize: 10, color: "#16A34A", opacity: 0.7 }}>
                El CÓMO del aprendizaje
              </Text>
            </View>
          </View>
          <FormField
            label="Estrategias de Acción y Expresión"
            value={duaAccionExpresion}
            onChangeText={setDuaAccionExpresion}
            placeholder="Cómo los estudiantes demostrarán lo aprendido..."
            multiline
            colors={colors}
          />

          <View className="px-5 mt-2">
            <View style={[styles.duaPrincipioHeader, { backgroundColor: "#D97706" + "12" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#D97706" }}>
                Principio 3: Múltiples formas de Implicación
              </Text>
              <Text style={{ fontSize: 10, color: "#D97706", opacity: 0.7 }}>
                El POR QUÉ del aprendizaje
              </Text>
            </View>
          </View>
          <FormField
            label="Estrategias de Implicación"
            value={duaImplicacion}
            onChangeText={setDuaImplicacion}
            placeholder="Cómo motivar e involucrar a todos los estudiantes..."
            multiline
            colors={colors}
          />

          <SectionTitle title="Observaciones" icon="note" colors={colors} />
          <FormField
            label="Observaciones"
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Observaciones adicionales (opcional)"
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
              <MaterialIcons name="save" size={22} color="#fff" />
              <Text style={styles.saveBtnText}>Guardar Planificacion</Text>
            </Pressable>
            <Text className="text-xs text-muted text-center mt-3">
              Al guardar podras exportar la planificacion como PDF con formato oficial del Ministerio de Educacion
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
}: {
  tema: TemaSugerido;
  colors: any;
  areaColor: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
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
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={26}
              color={colors.muted}
              style={{ marginLeft: 8 }}
            />
          </View>
        </Pressable>

        {isExpanded && (
          <View style={styles.temaPreview}>
            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <MaterialIcons name="flag" size={16} color={areaColor} />
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  Objetivo de la clase
                </Text>
              </View>
              <Text className="text-sm text-foreground leading-5 mt-1">
                {tema.objetivoClase}
              </Text>
            </View>

            {/* Duracion total */}
            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <MaterialIcons name="schedule" size={16} color={areaColor} />
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  Duracion total: 45 minutos
                </Text>
              </View>
            </View>

            {/* 3 Fases */}
            <FasePreview
              icon="lightbulb"
              label="Anticipacion"
              fase={tema.estructura.anticipacion}
              color="#F59E0B"
              colors={colors}
            />
            <FasePreview
              icon="build"
              label="Desarrollo"
              fase={tema.estructura.desarrollo}
              color="#2563EB"
              colors={colors}
            />
            <FasePreview
              icon="check-circle"
              label="Cierre"
              fase={tema.estructura.cierre}
              color="#16A34A"
              colors={colors}
            />

            <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
              <View style={styles.previewSectionHeader}>
                <MaterialIcons name="inventory" size={16} color={areaColor} />
                <Text style={[styles.previewSectionTitle, { color: areaColor }]}>
                  Recursos
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
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.selectBtnText}>Usar este tema</Text>
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
  icon,
  label,
  fase,
  color,
  colors,
}: {
  icon: string;
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
}: {
  tema: TemaSugerido;
  colors: any;
  areaColor: string;
}) {
  const fases = [
    { key: "anticipacion" as const, label: "Anticipacion", color: "#F59E0B", icon: "lightbulb" },
    { key: "desarrollo" as const, label: "Desarrollo", color: "#2563EB", icon: "build" },
    { key: "cierre" as const, label: "Cierre", color: "#16A34A", icon: "check-circle" },
  ];

  return (
    <View className="px-5 mt-2">
      {/* Duracion total badge */}
      <View style={[styles.totalDurationBadge, { backgroundColor: areaColor + "10", borderColor: areaColor + "30" }]}>
        <MaterialIcons name="schedule" size={16} color={areaColor} />
        <Text style={{ color: areaColor, fontSize: 13, fontWeight: "700", marginLeft: 6 }}>
          Duracion total: 45 minutos
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
              <MaterialIcons name={fase.icon as any} size={18} color={fase.color} />
              <Text style={[styles.faseCardTitle, { color: fase.color }]}>
                {fase.label}
              </Text>
              <View style={[styles.durationBadge, { backgroundColor: fase.color + "18" }]}>
                <MaterialIcons name="schedule" size={12} color={fase.color} />
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
  icon,
  colors,
}: {
  title: string;
  icon: string;
  colors: any;
}) {
  return (
    <View style={styles.sectionTitle}>
      <MaterialIcons name={icon as any} size={20} color={colors.primary} />
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
});
