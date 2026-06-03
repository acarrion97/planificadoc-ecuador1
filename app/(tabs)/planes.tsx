import { Text, View, StyleSheet, Alert, Platform, ScrollView } from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO } from "@/data";

export default function PlanesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planificaciones, deletePlanificacion, semanas, deleteSemana } = usePlanificaciones();

  const handleDelete = (id: string, codigo: string) => {
    if (Platform.OS === "web") {
      if (confirm(`¿Eliminar la planificación de ${codigo}?`)) deletePlanificacion(id);
    } else {
      Alert.alert("Eliminar planificación", `¿Deseas eliminar la planificación de ${codigo}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deletePlanificacion(id) },
      ]);
    }
  };

  const handleDeleteSemana = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("¿Eliminar esta planificación semanal?")) deleteSemana(id);
    } else {
      Alert.alert("Eliminar semana", "¿Deseas eliminar esta planificación semanal?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteSemana(id) },
      ]);
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Mis Planes</Text>
        </View>

        {/* ── Botón PCA ── */}
        <View style={styles.pcaEntry}>
          <Pressable
            onPress={() => router.push("/planificacion-anual" as any)}
            style={({ pressed }) => [styles.pcaBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.pcaBtnIcon}>📋</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.pcaBtnTitle}>Crear Planificación Anual (PCA)</Text>
              <Text style={styles.pcaBtnSub}>Currículo Priorizado · IA + PDF + Word</Text>
            </View>
            <Text style={styles.pcaBtnArrow}>›</Text>
          </Pressable>
        </View>

        {/* ── Botón PCT Trimestral ── */}
        <View style={styles.pcaEntry}>
          <Pressable
            onPress={() => router.push("/planificacion-trimestral" as any)}
            style={({ pressed }) => [styles.pcaBtn, { opacity: pressed ? 0.85 : 1, backgroundColor: "#0E7490" }]}
          >
            <Text style={styles.pcaBtnIcon}>🗓️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.pcaBtnTitle}>Crear Plan Trimestral (PCT)</Text>
              <Text style={styles.pcaBtnSub}>Plan Curricular por Trimestre · IA + PDF + Word</Text>
            </View>
            <Text style={styles.pcaBtnArrow}>›</Text>
          </Pressable>
        </View>

        {/* ── Botón planificación semanal ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Pressable
            onPress={() => router.push("/planificar-semanal" as any)}
            style={({ pressed }) => [styles.btnSemanal, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={{ fontSize: 22 }}>📅</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.btnSemanalTitle}>Nueva Planificación Semanal</Text>
              <Text style={styles.btnSemanalSub}>Genera 5 días de clase en una sola vez</Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 18 }}>›</Text>
          </Pressable>
        </View>

        {/* ── Semanas guardadas ── */}
        {semanas.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              SEMANAS GUARDADAS ({semanas.length})
            </Text>
            {semanas.map(semana => (
              <Pressable key={semana.id}
                onPress={() => router.push(`/ver-semana/${semana.id}` as any)}
                style={({ pressed }) => [styles.semanaCard, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={styles.semanaHeader}>
                  <View style={styles.semanaIconWrap}>
                    <Text style={{ fontSize: 20 }}>📅</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.semanaTitle, { color: colors.foreground }]}>
                      Semana del {semana.semanaInicio} al {semana.semanaFin}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {semana.docente || "Sin docente"} · {semana.grado}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                      {Object.values(semana.dias).filter(d => d.activo).length} día(s) activo(s)
                    </Text>
                  </View>
                  <Pressable onPress={() => handleDeleteSemana(semana.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ── Planificaciones individuales ── */}
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>
          PLANIFICACIONES DIARIAS ({planificaciones.length})
        </Text>
        {planificaciones.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 32, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 48 }}>📄</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>Sin planificaciones diarias</Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4, textAlign: "center" }}>
              Busca una destreza y genera tu primera planificación
            </Text>
          </View>
        ) : (
          planificaciones.map(item => {
            const areaInfo = AREAS_INFO[item.destreza.area];
            return (
              <Pressable key={item.id}
                onPress={() => router.push(`/ver-plan/${item.id}` as any)}
                style={({ pressed }) => [styles.planCard, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={styles.planHeader}>
                  <View style={[styles.codeBadge, { backgroundColor: areaInfo?.color + "20" }]}>
                    <Text style={{ color: areaInfo?.color, fontWeight: "700", fontSize: 13 }}>{item.destreza.codigo}</Text>
                  </View>
                  <Pressable onPress={() => handleDelete(item.id, item.destreza.codigo)}
                    style={({ pressed }) => [{ padding: 4, opacity: pressed ? 0.5 : 1 }]}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </Pressable>
                </View>
                <Text className="text-base font-semibold text-foreground mt-2" numberOfLines={1}>{areaInfo?.name}</Text>
                <Text className="text-sm text-muted mt-1" numberOfLines={1}>{item.grado} — {item.docente || "Sin docente"}</Text>
                <View style={styles.planFooter}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>📅 {item.fecha}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>⏰ {item.periodos} período(s)</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pcaEntry: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pcaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  pcaBtnIcon: {
    fontSize: 28,
  },
  pcaBtnTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  pcaBtnSub: {
    color: "#93C5FD",
    fontSize: 12,
    marginTop: 2,
  },
  pcaBtnArrow: {
    color: "#93C5FD",
    fontSize: 24,
    fontWeight: "300",
  },
  btnSemanal: { backgroundColor: "#003366", flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 16 },
  btnSemanalTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  btnSemanalSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 1 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  semanaCard: { marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  semanaHeader: { flexDirection: "row", alignItems: "center" },
  semanaIconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#003366" + "10", alignItems: "center", justifyContent: "center" },
  semanaTitle: { fontSize: 14, fontWeight: "700" },
  planCard: { marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 16, borderWidth: 1 },
  planHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  codeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  planFooter: { flexDirection: "row", gap: 16, marginTop: 10 },
  emptyText: { fontSize: 16, fontWeight: "600", marginTop: 10 },
});
