import { useState, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import {
  obtenerFiguraPorId,
  obtenerTodosLosModulos,
  COMPETENCIAS,
  METODOLOGIAS_ACTIVAS,
  TECNICAS_EVALUACION,
  ESTILOS_APRENDIZAJE,
  obtenerInsercionesPorAsignatura,
} from "@/data";
import type { ModuloFormativo } from "@/data";

export default function PlanificarBTScreen() {
  const { figuraId } = useLocalSearchParams<{ figuraId: string }>();
  const colors = useColors();
  const router = useRouter();
  const { addPlanificacion } = usePlanificaciones();

  const figura = useMemo(() => obtenerFiguraPorId(figuraId), [figuraId]);
  const modulos = useMemo(() => obtenerTodosLosModulos(figuraId), [figuraId]);

  // Form state
  const [selectedModulo, setSelectedModulo] = useState<ModuloFormativo | null>(null);
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState("1ro BT");
  const [periodos, setPeriodos] = useState("6");
  const [semana, setSemana] = useState("");
  const [tema, setTema] = useState("");

  // Secciones de chips
  const [selectedInserciones, setSelectedInserciones] = useState<string[]>([]);
  const [selectedCompetencias, setSelectedCompetencias] = useState<string[]>([]);
  const [selectedMetodologias, setSelectedMetodologias] = useState<string[]>([]);
  const [selectedTecnicas, setSelectedTecnicas] = useState<string[]>([]);
  const [selectedEstilos, setSelectedEstilos] = useState<string[]>([]);

  // ERCA
  const [experiencia, setExperiencia] = useState("");
  const [reflexion, setReflexion] = useState("");
  const [conceptualizacion, setConceptualizacion] = useState("");
  const [aplicacion, setAplicacion] = useState("");
  const [recursos, setRecursos] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Inserciones filtradas (para BT usamos las generales)
  const insercionesDisponibles = useMemo(() => {
    return obtenerInsercionesPorAsignatura("EG", 5);
  }, []);

  const toggleChip = (
    list: string[],
    setList: (v: string[]) => void,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((v2) => v2 !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSave = () => {
    if (!selectedModulo) {
      if (Platform.OS === "web") alert("Selecciona un m\u00f3dulo formativo");
      else Alert.alert("Error", "Selecciona un m\u00f3dulo formativo");
      return;
    }
    if (!tema.trim()) {
      if (Platform.OS === "web") alert("Ingresa el tema de la clase");
      else Alert.alert("Error", "Ingresa el tema de la clase");
      return;
    }

    const plan = {
      id: Date.now().toString(),
      fecha: new Date().toLocaleDateString("es-EC"),
      docente,
      asignatura: `BT - ${figura?.nombre ?? ""}`,
      grado,
      periodos: parseInt(periodos) || 6,
      semana,
      destreza: {
        codigo: selectedModulo.codigo,
        descripcion: selectedModulo.descripcion,
        area: "EG" as any,
        subnivel: 5 as any,
        bloque: 1,
        objetivos: [figura?.objetivoGeneral ?? ""],
        criteriosEvaluacion: [`CE.BT. Criterio de evaluaci\u00f3n del m\u00f3dulo ${selectedModulo.nombre}`],
        indicadoresEvaluacion: [`I.BT. Indicador de evaluaci\u00f3n del m\u00f3dulo ${selectedModulo.nombre}`],
      },
      tema,
      insercionesCurriculares: selectedInserciones,
      competencias: selectedCompetencias,
      metodologiasActivas: selectedMetodologias,
      tecnicasEvaluacion: selectedTecnicas,
      estilosAprendizaje: selectedEstilos,
      erca: {
        experiencia,
        reflexion,
        conceptualizacion,
        aplicacion,
      },
      recursos,
      evaluacion,
      observaciones,
      dua: { principios: [], estrategias: "" },
    };

    addPlanificacion(plan as any);
    if (Platform.OS === "web") {
      alert("Planificaci\u00f3n guardada exitosamente");
    } else {
      Alert.alert("Guardado", "Planificaci\u00f3n guardada exitosamente");
    }
    router.back();
  };

  if (!figura) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-muted">Figura profesional no encontrada</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginBottom: 8 }]}
          >
            <Text style={{ fontSize: 16, color: colors.primary }}>
              {"\u2039"} Volver
            </Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">
            Planificar: {figura.nombre}
          </Text>
          <Text className="text-sm text-muted mt-1" numberOfLines={2}>
            {figura.objetivoGeneral}
          </Text>
        </View>

        {/* Datos Informativos */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            1. DATOS INFORMATIVOS
          </Text>
          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.muted }]}>Docente</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={docente}
                onChangeText={setDocente}
                placeholder="Nombre del docente"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.muted }]}>Curso</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={grado}
                onChangeText={setGrado}
                placeholder="1ro BT"
                placeholderTextColor={colors.muted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.label, { color: colors.muted }]}>Semana</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={semana}
                onChangeText={setSemana}
                placeholder="Semana 1"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.muted }]}>Per{"\u00ed"}odos</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={periodos}
                onChangeText={setPeriodos}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
        </View>

        {/* Módulo Formativo */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            2. M{"\u00d3"}DULO FORMATIVO
          </Text>
          <Text style={[styles.label, { color: colors.muted }]}>
            Selecciona el m{"\u00f3"}dulo a planificar:
          </Text>
          <View style={styles.modulosContainer}>
            {modulos.map((modulo) => (
              <Pressable
                key={modulo.codigo}
                onPress={() => setSelectedModulo(modulo)}
                style={({ pressed }) => [
                  styles.moduloChip,
                  {
                    backgroundColor:
                      selectedModulo?.codigo === modulo.codigo
                        ? colors.primary
                        : colors.surface,
                    borderColor:
                      selectedModulo?.codigo === modulo.codigo
                        ? colors.primary
                        : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color:
                      selectedModulo?.codigo === modulo.codigo
                        ? "#fff"
                        : colors.foreground,
                  }}
                >
                  {modulo.nombre}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color:
                      selectedModulo?.codigo === modulo.codigo
                        ? "#ffffffcc"
                        : colors.muted,
                    marginTop: 2,
                  }}
                >
                  A{"\u00f1"}o {modulo.anio}
                </Text>
              </Pressable>
            ))}
          </View>
          {selectedModulo && (
            <View style={[styles.moduloDetail, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.muted }]}>Descripci{"\u00f3"}n:</Text>
              <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20 }}>
                {selectedModulo.descripcion}
              </Text>
            </View>
          )}
        </View>

        {/* Tema */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            3. TEMA DE CLASE
          </Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={tema}
            onChangeText={setTema}
            placeholder="Tema de la clase"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Inserciones Curriculares */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            4. INSERCIONES CURRICULARES
          </Text>
          <View style={styles.chipsContainer}>
            {insercionesDisponibles.map((ins) => (
              <Pressable
                key={ins.id}
                onPress={() => toggleChip(selectedInserciones, setSelectedInserciones, ins.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selectedInserciones.includes(ins.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: selectedInserciones.includes(ins.id)
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedInserciones.includes(ins.id) ? "#fff" : colors.foreground,
                  }}
                >
                  {ins.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Competencias */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            5. COMPETENCIAS
          </Text>
          <View style={styles.chipsContainer}>
            {COMPETENCIAS.map((comp) => (
              <Pressable
                key={comp.id}
                onPress={() => toggleChip(selectedCompetencias, setSelectedCompetencias, comp.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selectedCompetencias.includes(comp.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: selectedCompetencias.includes(comp.id)
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedCompetencias.includes(comp.id) ? "#fff" : colors.foreground,
                  }}
                >
                  {comp.nombreCorto} - {comp.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Metodologías Activas */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            6. METODOLOG{"\u00cd"}AS ACTIVAS
          </Text>
          <View style={styles.chipsContainer}>
            {METODOLOGIAS_ACTIVAS.map((met) => (
              <Pressable
                key={met.id}
                onPress={() => toggleChip(selectedMetodologias, setSelectedMetodologias, met.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selectedMetodologias.includes(met.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: selectedMetodologias.includes(met.id)
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedMetodologias.includes(met.id) ? "#fff" : colors.foreground,
                  }}
                >
                  {met.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Técnicas de Evaluación */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            7. T{"\u00c9"}CNICAS E INSTRUMENTOS DE EVALUACI{"\u00d3"}N
          </Text>
          <View style={styles.chipsContainer}>
            {TECNICAS_EVALUACION.map((tec) => (
              <Pressable
                key={tec.id}
                onPress={() => toggleChip(selectedTecnicas, setSelectedTecnicas, tec.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selectedTecnicas.includes(tec.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: selectedTecnicas.includes(tec.id)
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedTecnicas.includes(tec.id) ? "#fff" : colors.foreground,
                  }}
                >
                  {tec.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Estilos de Aprendizaje */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            8. ESTILOS DE APRENDIZAJE
          </Text>
          <View style={styles.chipsContainer}>
            {ESTILOS_APRENDIZAJE.map((est) => (
              <Pressable
                key={est.id}
                onPress={() => toggleChip(selectedEstilos, setSelectedEstilos, est.id)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selectedEstilos.includes(est.id)
                      ? colors.primary
                      : colors.surface,
                    borderColor: selectedEstilos.includes(est.id)
                      ? colors.primary
                      : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedEstilos.includes(est.id) ? "#fff" : colors.foreground,
                  }}
                >
                  {est.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ERCA */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            9. ESTRATEGIAS METODOL{"\u00d3"}GICAS (ERCA)
          </Text>

          <Text style={[styles.label, { color: colors.muted }]}>Experiencia (Inicio)</Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={experiencia}
            onChangeText={setExperiencia}
            placeholder="Actividades de experiencia concreta..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.label, { color: colors.muted, marginTop: 12 }]}>Reflexi{"\u00f3"}n</Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={reflexion}
            onChangeText={setReflexion}
            placeholder="Actividades de reflexi\u00f3n..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.label, { color: colors.muted, marginTop: 12 }]}>Conceptualizaci{"\u00f3"}n</Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={conceptualizacion}
            onChangeText={setConceptualizacion}
            placeholder="Actividades de conceptualizaci\u00f3n..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.label, { color: colors.muted, marginTop: 12 }]}>Aplicaci{"\u00f3"}n</Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={aplicacion}
            onChangeText={setAplicacion}
            placeholder="Actividades de aplicaci\u00f3n..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Recursos */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            10. RECURSOS
          </Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={recursos}
            onChangeText={setRecursos}
            placeholder="Materiales y recursos did\u00e1cticos..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Evaluación */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            11. ACTIVIDADES EVALUATIVAS
          </Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={evaluacion}
            onChangeText={setEvaluacion}
            placeholder="Actividades de evaluaci\u00f3n..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Observaciones */}
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            12. OBSERVACIONES
          </Text>
          <TextInput
            style={[styles.textArea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Observaciones adicionales..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save button */}
        <View className="px-5 mt-4 mb-10">
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={styles.saveButtonText}>Guardar Planificaci{"\u00f3"}n</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },
  modulosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  moduloChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  moduloDetail: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
