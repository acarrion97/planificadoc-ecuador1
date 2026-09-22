/**
 * Sección de planes "Conecta, Nivela y Crea" para app/(tabs)/planes.tsx.
 * Extraída a su propio componente para que la pantalla compartida solo
 * necesite una línea adicional (<PlanesCNCSection />) — aislamiento del
 * módulo CNC respecto a los flujos EGB/BGU y BT existentes.
 */
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";

export function PlanesCNCSection() {
  const colors = useColors();
  const router = useRouter();
  const { planesCNC, deletePlanCNC } = usePlanificacionesCNC();

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("¿Eliminar este plan Conecta, Nivela y Crea?")) deletePlanCNC(id);
    } else {
      Alert.alert("Eliminar plan", "¿Deseas eliminar este plan Conecta, Nivela y Crea?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deletePlanCNC(id) },
      ]);
    }
  };

  return (
    <View>
      <View style={{ paddingHorizontal: 20, marginBottom: 8, marginTop: 8 }}>
        <Pressable
          onPress={() => router.push("/conecta-nivela-crea" as any)}
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: colors.surface,
              borderColor: "#0F766E",
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 22 }}>🌱</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.btnTitle, { color: colors.foreground }]}>
              Planificar Conecta, Nivela y Crea
            </Text>
            <Text style={[styles.btnSub, { color: colors.muted }]}>
              Arranque del año escolar · 5 semanas · IA + Word/PDF
            </Text>
          </View>
          <Text style={{ color: "#0F766E", fontSize: 18 }}>›</Text>
        </Pressable>
      </View>

      {planesCNC.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            PLANES CONECTA, NIVELA Y CREA ({planesCNC.length})
          </Text>
          {planesCNC.map((plan) => (
            <View
              key={plan.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.header}>
                <View style={styles.iconWrap}>
                  <Text style={{ fontSize: 20 }}>🌱</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
                    {plan.grado || "Sin grado"} {plan.paralelo || ""}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }} numberOfLines={1}>
                    {plan.modalidad === "bt" ? "Bachillerato Técnico" : "General (EGB/BGU)"} · {plan.anioLectivo}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                    {plan.docente || "Sin docente"} · {plan.status === "generado" ? "Generado" : "Borrador"}
                  </Text>
                </View>
                <Pressable onPress={() => router.push(`/ver-cnc/${plan.id}` as any)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, marginRight: 8 })}>
                  <Text style={{ fontSize: 12, color: colors.text, fontWeight: "600" }}>Ver</Text>
                </Pressable>
                <Pressable onPress={() => handleDelete(plan.id)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    // Sin relleno de color: color solo en el borde (fondo = colors.surface).
    borderWidth: 1.5,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  btnTitle: { fontSize: 15, fontWeight: "700" },
  btnSub: { fontSize: 12, marginTop: 1 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  card: { marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#0F766E10", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700" },
});
