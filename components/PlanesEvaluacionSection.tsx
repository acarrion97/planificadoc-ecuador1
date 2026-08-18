/**
 * Sección de "Evaluación Diagnóstica" para app/(tabs)/planes.tsx.
 * Extraída a su propio componente para que la pantalla compartida solo
 * necesite una línea adicional (<PlanesEvaluacionSection />) — aislamiento
 * del módulo respecto a los flujos EGB/BGU, BT y CNC existentes.
 */
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import { ESTATUS_EVALUACION_INFO } from "@/data/types-evaluacion";

export function PlanesEvaluacionSection() {
  const colors = useColors();
  const router = useRouter();
  const { evaluaciones, deleteEvaluacion } = useEvaluaciones();

  const handleDelete = (id: string, nombre: string) => {
    if (Platform.OS === "web") {
      if (confirm(`¿Eliminar la evaluación "${nombre}"?`)) deleteEvaluacion(id);
    } else {
      Alert.alert("Eliminar evaluación", `¿Deseas eliminar la evaluación "${nombre}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteEvaluacion(id) },
      ]);
    }
  };

  return (
    <View>
      {evaluaciones.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            EVALUACIONES DIAGNÓSTICAS ({evaluaciones.length})
          </Text>
          {evaluaciones.map((ev) => {
            const estatus = ESTATUS_EVALUACION_INFO[ev.status];
            return (
              <Pressable
                key={ev.id}
                onPress={() => router.push(`/ver-evaluacion/${ev.id}` as any)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <View style={styles.header}>
                  <View style={styles.iconWrap}>
                    <Text style={{ fontSize: 20 }}>📋</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
                      {ev.nombre || "Sin nombre"}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }} numberOfLines={1}>
                      {ev.grado} {ev.paralelo ? `· ${ev.paralelo}` : ""} · {ev.anioLectivo}
                    </Text>
                    <Text style={{ fontSize: 11, marginTop: 2, color: estatus.color }}>
                      {estatus.nombre} · {ev.preguntas.length} preguntas · {ev.estudiantes.length} estudiantes
                    </Text>
                  </View>
                  <Pressable onPress={() => handleDelete(ev.id, ev.nombre)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  card: { marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#1D4ED810", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700" },
});