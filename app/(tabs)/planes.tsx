import { Text, View, FlatList, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO } from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function PlanesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planificaciones, deletePlanificacion } = usePlanificaciones();

  const handleDelete = (id: string, codigo: string) => {
    if (Platform.OS === "web") {
      if (confirm(`¿Eliminar la planificación de ${codigo}?`)) {
        deletePlanificacion(id);
      }
    } else {
      Alert.alert(
        "Eliminar planificación",
        `¿Deseas eliminar la planificación de ${codigo}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => deletePlanificacion(id),
          },
        ]
      );
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-foreground">Mis Planes</Text>
        <Text className="text-base text-muted mt-1">
          {planificaciones.length} planificación(es) guardada(s)
        </Text>
      </View>
      <FlatList
        data={planificaciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const areaInfo = AREAS_INFO[item.destreza.area];
          return (
            <Pressable
              onPress={() => router.push(`/ver-plan/${item.id}` as any)}
              style={({ pressed }) => [
                styles.planCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={styles.planHeader}>
                <View
                  style={[
                    styles.codeBadge,
                    { backgroundColor: areaInfo?.color + "20" },
                  ]}
                >
                  <Text
                    style={{
                      color: areaInfo?.color,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {item.destreza.codigo}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleDelete(item.id, item.destreza.codigo)
                  }
                  style={({ pressed }) => [
                    styles.deleteBtn,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                >
                  <MaterialIcons name="delete-outline" size={20} color={colors.error} />
                </Pressable>
              </View>
              <Text
                className="text-base font-semibold text-foreground mt-2"
                numberOfLines={1}
              >
                {areaInfo?.name}
              </Text>
              <Text className="text-sm text-muted mt-1" numberOfLines={1}>
                {item.grado} — {item.docente || "Sin docente"}
              </Text>
              <View style={styles.planFooter}>
                <View style={styles.planMeta}>
                  <MaterialIcons name="event" size={14} color={colors.muted} />
                  <Text className="text-xs text-muted ml-1">{item.fecha}</Text>
                </View>
                <View style={styles.planMeta}>
                  <MaterialIcons name="schedule" size={14} color={colors.muted} />
                  <Text className="text-xs text-muted ml-1">
                    {item.periodos} período(s)
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-16 px-5">
            <MaterialIcons name="description" size={56} color={colors.muted} />
            <Text className="text-lg font-semibold text-muted mt-4">
              Sin planificaciones
            </Text>
            <Text className="text-sm text-muted mt-2 text-center">
              Busca una destreza y genera tu primera planificación microcurricular
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  planCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  planFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 16,
  },
  planMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
});
