import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

const BASE_LABELS: Record<string, string> = {
  destrezas: "Destrezas",
  competencias: "Competencias (CNC)",
};

const ESTADO_LABELS: Record<string, string> = {
  borrador: "Borrador",
  generado: "Generado",
};

const ESTADO_COLORS: Record<string, string> = {
  borrador: "#D97706",
  generado: "#16A34A",
};

/** Mismo patrón que app/planificacion-anual/index.tsx: id de dispositivo persistido en AsyncStorage. */
async function getSessionId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

export default function ProyectoInterdisciplinarListScreen() {
  const colors = useColors();
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getSessionId().then(setSessionId);
  }, []);

  const listQuery = trpc.proyectoInterdisciplinar.list.useQuery(
    { sessionId },
    { enabled: !!sessionId && !busqueda.trim() }
  );
  const searchQuery = trpc.proyectoInterdisciplinar.search.useQuery(
    { sessionId, query: busqueda.trim() },
    { enabled: !!sessionId && !!busqueda.trim() }
  );

  const activa = busqueda.trim() ? searchQuery : listQuery;
  const proyectos = activa.data;

  const deleteMutation = trpc.proyectoInterdisciplinar.delete.useMutation({
    onSuccess: () => {
      listQuery.refetch();
      searchQuery.refetch();
    },
  });

  const duplicateMutation = trpc.proyectoInterdisciplinar.duplicate.useMutation({
    onSuccess: (data) => {
      listQuery.refetch();
      if (data?.id) {
        router.push(`/proyecto-interdisciplinar/wizard?id=${data.id}` as any);
      }
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo duplicar el proyecto.");
    },
  });

  const handleDelete = (id: number, titulo: string) => {
    const label = titulo || "(sin título)";
    if (Platform.OS === "web") {
      if (confirm(`¿Eliminar el proyecto "${label}"?`)) {
        deleteMutation.mutate({ id });
      }
    } else {
      Alert.alert("Eliminar proyecto", `¿Deseas eliminar "${label}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteMutation.mutate({ id }) },
      ]);
    }
  };

  const handleDuplicate = (id: number) => {
    if (!sessionId) return;
    duplicateMutation.mutate({ id, sessionId });
  };

  const handleOpen = (id: number) => {
    router.push(`/proyecto-interdisciplinar/wizard?id=${id}` as any);
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Proyecto Interdisciplinar</Text>
          <Text className="text-sm text-muted mt-1">
            Proyectos que integran varias áreas alrededor de un producto final común.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <Pressable
            onPress={() => router.push("/proyecto-interdisciplinar/nuevo" as any)}
            style={({ pressed }) => [
              styles.createBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.createBtnText}>+ Nuevo Proyecto Interdisciplinar</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar por título, área o código curricular..."
            placeholderTextColor={colors.muted + "80"}
            style={[
              styles.searchInput,
              { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground },
            ]}
          />
        </View>

        {activa.isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !proyectos || proyectos.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🧩</Text>
            <Text style={{ color: colors.muted, fontSize: 15 }}>
              {busqueda.trim() ? "Sin resultados para esa búsqueda" : "No hay proyectos todavía"}
            </Text>
            {!busqueda.trim() && (
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>
                Crea uno nuevo para comenzar
              </Text>
            )}
          </View>
        ) : (
          proyectos.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleOpen(item.id)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    {item.titulo || "(sin título)"}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                    {BASE_LABELS[item.baseCurricular] || item.baseCurricular}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: (ESTADO_COLORS[item.estado] || colors.muted) + "20" },
                  ]}
                >
                  <Text
                    style={{
                      color: ESTADO_COLORS[item.estado] || colors.muted,
                      fontSize: 11,
                      fontWeight: "600",
                    }}
                  >
                    {ESTADO_LABELS[item.estado] || item.estado}
                  </Text>
                </View>
              </View>

              {!!item.institucion && (
                <Text style={[styles.cardDetail, { color: colors.muted }]}>{item.institucion}</Text>
              )}

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => handleOpen(item.id)}
                  style={[styles.actionBtn, { backgroundColor: colors.primary + "15" }]}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>Abrir</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDuplicate(item.id)}
                  disabled={duplicateMutation.isPending}
                  style={[styles.actionBtn, { backgroundColor: colors.muted + "15" }]}
                >
                  <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "500" }}>Duplicar</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item.id, item.titulo)}
                  style={[styles.actionBtn, { backgroundColor: "#DC262615" }]}
                >
                  <Text style={{ color: "#DC2626", fontSize: 12, fontWeight: "500" }}>Eliminar</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  createBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  card: { marginHorizontal: 20, marginBottom: 10, borderRadius: 12, borderWidth: 1, padding: 14 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  cardDetail: { fontSize: 12, marginTop: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  cardActions: { flexDirection: "row", marginTop: 10, gap: 8 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
});
