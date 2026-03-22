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
} from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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

function getSugerenciaActividades(area: string, bloque: number): string {
  const sugerencias: Record<string, string> = {
    M: "1. Activación de conocimientos previos mediante preguntas generadoras.\n2. Presentación del tema con material concreto y manipulativo.\n3. Trabajo en parejas para resolver ejercicios guiados.\n4. Práctica individual con ejercicios de aplicación.\n5. Socialización de resultados y retroalimentación grupal.",
    LL: "1. Exploración de conocimientos previos a través de lluvia de ideas.\n2. Lectura compartida del texto seleccionado.\n3. Análisis guiado del contenido y estructura textual.\n4. Producción escrita individual o en parejas.\n5. Revisión entre pares y corrección colaborativa.",
    CN: "1. Observación directa o indirecta del fenómeno natural.\n2. Formulación de hipótesis por parte de los estudiantes.\n3. Experimentación guiada con materiales del entorno.\n4. Registro de observaciones y datos en cuaderno de campo.\n5. Socialización de conclusiones y elaboración de informe.",
    CS: "1. Contextualización histórica mediante relatos o imágenes.\n2. Lectura comprensiva de fuentes primarias y secundarias.\n3. Debate dirigido sobre el tema estudiado.\n4. Elaboración de organizadores gráficos (líneas de tiempo, mapas conceptuales).\n5. Reflexión grupal sobre la importancia del tema en la actualidad.",
    EF: "1. Calentamiento general y específico.\n2. Demostración de la actividad o juego por parte del docente.\n3. Práctica guiada en grupos pequeños.\n4. Ejecución autónoma de la actividad.\n5. Vuelta a la calma y reflexión sobre lo aprendido.",
    ECA: "1. Apreciación de obras artísticas relacionadas con el tema.\n2. Exploración libre de materiales y técnicas.\n3. Creación artística individual o colectiva.\n4. Presentación y exposición de trabajos.\n5. Reflexión y autoevaluación del proceso creativo.",
  };
  return sugerencias[area] || sugerencias.M;
}

function getSugerenciaRecursos(area: string): string {
  const recursos: Record<string, string> = {
    M: "Texto del estudiante, cuaderno de trabajo, material concreto (bloques base 10, regletas, fichas), pizarra, marcadores, calculadora, regla, compás.",
    LL: "Texto del estudiante, cuaderno de trabajo, diccionario, biblioteca del aula, papelotes, marcadores, fichas de lectura, material impreso.",
    CN: "Texto del estudiante, cuaderno de trabajo, materiales del entorno, láminas didácticas, microscopio (si aplica), materiales de laboratorio, TIC.",
    CS: "Texto del estudiante, cuaderno de trabajo, mapas, atlas, globo terráqueo, líneas de tiempo, material audiovisual, fuentes históricas.",
    EF: "Espacio abierto o cancha, balones, conos, aros, cuerdas, silbato, cronómetro, colchonetas.",
    ECA: "Materiales artísticos (pinturas, pinceles, tijeras, goma), papel, cartulina, materiales reciclados, instrumentos musicales, reproductor de audio.",
  };
  return recursos[area] || recursos.M;
}

function getSugerenciaTecnicas(): string {
  return "Técnica: Observación directa\nInstrumento: Lista de cotejo / Rúbrica de evaluación\n\nTécnica: Prueba escrita\nInstrumento: Cuestionario de preguntas abiertas y cerradas\n\nTécnica: Portafolio\nInstrumento: Registro de evidencias de aprendizaje";
}

export default function PlanificarScreen() {
  const colors = useColors();
  const router = useRouter();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const { addPlanificacion } = usePlanificaciones();

  const destreza = buscarPorCodigo(codigo || "");

  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState(
    destreza ? SUBNIVEL_GRADOS[destreza.subnivel] : ""
  );
  const [fecha, setFecha] = useState(getTodayDate());
  const [periodos, setPeriodos] = useState("2");
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState(
    destreza?.objetivos[0] || ""
  );
  const [actividades, setActividades] = useState(
    destreza ? getSugerenciaActividades(destreza.area, destreza.bloque) : ""
  );
  const [recursos, setRecursos] = useState(
    destreza ? getSugerenciaRecursos(destreza.area) : ""
  );
  const [evaluacion, setEvaluacion] = useState(
    destreza?.indicadoresEvaluacion[0] || ""
  );
  const [tecnicas, setTecnicas] = useState(getSugerenciaTecnicas());
  const [observaciones, setObservaciones] = useState("");

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
      actividades: actividades.trim(),
      recursos: recursos.trim(),
      evaluacion: evaluacion.trim(),
      tecnicasInstrumentos: tecnicas.trim(),
      observaciones: observaciones.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addPlanificacion(plan);

    if (Platform.OS === "web") {
      alert("Planificación guardada correctamente");
    } else {
      Alert.alert("Guardado", "Planificación guardada correctamente");
    }
    router.back();
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
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
                Atrás
              </Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground mt-3">
              Planificación Microcurricular
            </Text>
          </View>

          {/* Destreza info (read-only) */}
          <View className="px-5 mt-4">
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

          {/* Section: Datos Informativos */}
          <SectionTitle title="Datos Informativos" icon="info" colors={colors} />

          <FormField
            label="Institución Educativa"
            value={institucion}
            onChangeText={setInstitucion}
            placeholder="Nombre de la institución"
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
            label="Número de Períodos"
            value={periodos}
            onChangeText={setPeriodos}
            placeholder="2"
            keyboardType="numeric"
            colors={colors}
          />

          {/* Section: Objetivo de Aprendizaje */}
          <SectionTitle title="Objetivo de Aprendizaje" icon="flag" colors={colors} />
          <FormField
            label="Objetivo"
            value={objetivoAprendizaje}
            onChangeText={setObjetivoAprendizaje}
            placeholder="Objetivo de aprendizaje"
            multiline
            colors={colors}
          />

          {/* Section: Actividades */}
          <SectionTitle title="Actividades de Aprendizaje" icon="assignment" colors={colors} />
          <FormField
            label="Actividades"
            value={actividades}
            onChangeText={setActividades}
            placeholder="Describe las actividades..."
            multiline
            colors={colors}
          />

          {/* Section: Recursos */}
          <SectionTitle title="Recursos Didácticos" icon="inventory" colors={colors} />
          <FormField
            label="Recursos"
            value={recursos}
            onChangeText={setRecursos}
            placeholder="Lista de recursos..."
            multiline
            colors={colors}
          />

          {/* Section: Evaluación */}
          <SectionTitle title="Evaluación" icon="assessment" colors={colors} />
          <FormField
            label="Indicadores de Evaluación"
            value={evaluacion}
            onChangeText={setEvaluacion}
            placeholder="Indicadores..."
            multiline
            colors={colors}
          />
          <FormField
            label="Técnicas e Instrumentos"
            value={tecnicas}
            onChangeText={setTecnicas}
            placeholder="Técnicas e instrumentos de evaluación..."
            multiline
            colors={colors}
          />

          {/* Section: Observaciones */}
          <SectionTitle title="Observaciones" icon="note" colors={colors} />
          <FormField
            label="Observaciones"
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Observaciones adicionales (opcional)"
            multiline
            colors={colors}
          />

          {/* Save button */}
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
              <Text style={styles.saveBtnText}>Guardar Planificación</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

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
});
