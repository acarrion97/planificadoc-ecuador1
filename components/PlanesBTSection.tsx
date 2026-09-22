/**
 * Sección de planes de Bachillerato Técnico para app/(tabs)/planes.tsx.
 * Extraída a su propio componente para que la pantalla compartida solo
 * necesite una línea adicional (<PlanesBTSection />) — aislamiento del
 * sistema BT respecto al flujo EGB/BGU existente.
 */
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { usePlanificacionesBT } from "@/lib/planificaciones-bt-context";
import { obtenerFiguraPorId } from "@/data/bachillerato-tecnico";
import { CreateCard } from "@/components/create-card";

/**
 * Tarjeta de creación de BT. Vive fuera de la sección para poder renderizarse
 * dentro de la retícula de creación de Mis planes (`<CreateGrid>`), junto con
 * las otras 6 entradas.
 */
export function PlanesBTCreateCard() {
  const router = useRouter();
  return (
    <CreateCard
      icono="🛠️"
      titulo="Planificar Bachillerato Técnico"
      subtitulo="Unidad de Trabajo por competencias · IA + Word"
      color="#4A1942"
      onPress={() => router.push("/bachillerato-tecnico" as any)}
    />
  );
}

export function PlanesBTSection() {
  const colors = useColors();
  const { planesBT, deletePlanBT } = usePlanificacionesBT();

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("¿Eliminar esta planificación de Bachillerato Técnico?")) deletePlanBT(id);
    } else {
      Alert.alert("Eliminar plan BT", "¿Deseas eliminar esta planificación?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deletePlanBT(id) },
      ]);
    }
  };

  return (
    <View>
      {planesBT.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            PLANES DE BACHILLERATO TÉCNICO ({planesBT.length})
          </Text>
          {planesBT.map((plan) => {
            const figura = obtenerFiguraPorId(plan.figuraProfesionalId);
            return (
              <View
                key={plan.id}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.header}>
                  <View style={styles.iconWrap}>
                    <Text style={{ fontSize: 20 }}>🛠️</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
                      {plan.unidadTrabajo.nombre || "Unidad de Trabajo"}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }} numberOfLines={1}>
                      {figura?.nombre || plan.figuraProfesionalId} · {plan.nombreModuloFormativo}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                      {plan.docente || "Sin docente"} · {plan.curso || "—"}
                    </Text>
                  </View>
                  <Pressable onPress={() => handleDelete(plan.id)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
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
  iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#4A194210", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontWeight: "700" },
});
