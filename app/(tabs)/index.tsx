import { useState, useMemo } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import {
  AREAS_INFO,
  TODAS_LAS_DESTREZAS,
  buscarDestrezas,
  Area,
} from "@/data";

const AREAS_LIST = Object.values(AREAS_INFO);

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planificaciones } = usePlanificaciones();
  const [query, setQuery] = useState("");

  const resultados = useMemo(() => {
    if (query.trim().length < 2) return [];
    return buscarDestrezas(query).slice(0, 20);
  }, [query]);

  const recientes = planificaciones.slice(0, 5);

  return (
    <ScreenContainer className="flex-1">
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="px-5 pt-4 pb-2">
              <Text className="text-3xl font-bold text-foreground">
                PlanificaDoc
              </Text>
              <Text className="text-base text-muted mt-1">
                Planificación curricular para docentes de Ecuador
              </Text>
            </View>

            {/* Search */}
            <View className="px-5 mt-4">
              <View
                className="flex-row items-center bg-surface rounded-xl px-4 border border-border"
                style={styles.searchContainer}
              >
                <Text style={{ fontSize: 18 }}>🔍</Text>
                <TextInput
                  className="flex-1 ml-3 text-base text-foreground"
                  placeholder="Código de destreza (ej: M.3.1.1)"
                  placeholderTextColor={colors.muted}
                  value={query}
                  onChangeText={setQuery}
                  autoCapitalize="characters"
                  returnKeyType="search"
                  style={styles.searchInput}
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery("")} style={{ padding: 4 }}>
                    <Text style={{ fontSize: 16 }}>✕</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Stats */}
            <View className="px-5 mt-3">
              <Text className="text-sm text-muted">
                {TODAS_LAS_DESTREZAS.length} destrezas disponibles
              </Text>
            </View>

            {/* Areas grid - only show when not searching */}
            {resultados.length === 0 && (
              <>
                <View className="px-5 mt-6 mb-3">
                  <Text className="text-lg font-semibold text-foreground">
                    Áreas Curriculares
                  </Text>
                </View>
                <View className="px-5">
                  <View style={styles.areasGrid}>
                    {AREAS_LIST.map((area) => (
                      <Pressable
                        key={area.code}
                        onPress={() =>
                          router.push(
                            `/(tabs)/explorar?area=${area.code}` as any
                          )
                        }
                        style={({ pressed }) => [
                          styles.areaCard,
                          {
                            backgroundColor: area.color + "15",
                            borderColor: area.color + "30",
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 28 }}>{area.emoji}</Text>
                        <Text
                          style={[styles.areaCardText, { color: area.color }]}
                          numberOfLines={2}
                        >
                          {area.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Recent plans */}
                {recientes.length > 0 && (
                  <>
                    <View className="px-5 mt-6 mb-3">
                      <Text className="text-lg font-semibold text-foreground">
                        Planificaciones Recientes
                      </Text>
                    </View>
                    {recientes.map((plan) => (
                      <Pressable
                        key={plan.id}
                        onPress={() =>
                          router.push(`/ver-plan/${plan.id}` as any)
                        }
                        style={({ pressed }) => [
                          styles.recentCard,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <View style={styles.recentCardContent}>
                          <View
                            style={[
                              styles.recentBadge,
                              {
                                backgroundColor:
                                  AREAS_INFO[plan.destreza.area]?.color + "20",
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: AREAS_INFO[plan.destreza.area]?.color,
                                fontSize: 12,
                                fontWeight: "600",
                              }}
                            >
                              {plan.destreza.codigo}
                            </Text>
                          </View>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text
                              className="text-sm font-medium text-foreground"
                              numberOfLines={1}
                            >
                              {plan.asignatura} — {plan.grado}
                            </Text>
                            <Text
                              className="text-xs text-muted mt-1"
                              numberOfLines={1}
                            >
                              {plan.fecha}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16, color: colors.muted }}>›</Text>
                        </View>
                      </Pressable>
                    ))}
                  </>
                )}
              </>
            )}

            {/* Search results header */}
            {resultados.length > 0 && (
              <View className="px-5 mt-4 mb-2">
                <Text className="text-sm font-medium text-muted">
                  {resultados.length} resultado(s) encontrado(s)
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/destreza/${item.codigo}` as any)}
            style={({ pressed }) => [
              styles.resultCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.resultCardHeader}>
              <View
                style={[
                  styles.codeBadge,
                  { backgroundColor: AREAS_INFO[item.area]?.color + "20" },
                ]}
              >
                <Text
                  style={{
                    color: AREAS_INFO[item.area]?.color,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  {item.codigo}
                </Text>
              </View>
              <Text
                style={{
                  color: AREAS_INFO[item.area]?.color,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {AREAS_INFO[item.area]?.name}
              </Text>
            </View>
            <Text
              className="text-sm text-foreground mt-2 leading-5"
              numberOfLines={3}
            >
              {item.descripcion}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          query.trim().length >= 2 ? (
            <View className="items-center py-10 px-5">
              <Text style={{ fontSize: 48 }}>🔎</Text>
              <Text className="text-base text-muted mt-3 text-center">
                No se encontraron destrezas para "{query}"
              </Text>
              <Text className="text-sm text-muted mt-1 text-center">
                Intenta con otro código o término
              </Text>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    height: 52,
  },
  searchInput: {
    height: 52,
    fontSize: 16,
  },
  areasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  areaCard: {
    width: "47%",
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 8,
  },
  areaCardText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  resultCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recentCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  recentCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
