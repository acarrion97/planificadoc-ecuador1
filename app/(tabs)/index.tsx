import { useState, useMemo } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Linking,
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
  filtrarPorArea,
  Area,
} from "@/data";

const EGB_AREAS: Area[] = ["M", "LL", "CN", "CS", "EF", "ECA"];
const BGU_AREAS: Area[] = ["CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG"];

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

  const renderAreaCard = (areaCode: Area) => {
    const area = AREAS_INFO[areaCode];
    const count = filtrarPorArea(areaCode).length;
    return (
      <Pressable
        key={area.code}
        onPress={() =>
          router.push(`/(tabs)/explorar?area=${area.code}` as any)
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
        <Text style={[styles.areaCountText, { color: area.color + "90" }]}>
          {count} destrezas
        </Text>
      </Pressable>
    );
  };

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
                Planificaci{"ó"}n curricular para docentes de Ecuador
              </Text>
            </View>

            {/* Search */}
            <View className="px-5 mt-4">
              <View
                className="flex-row items-center bg-surface rounded-xl px-4 border border-border"
                style={styles.searchContainer}
              >
                <Text style={{ fontSize: 18 }}>{"🔍"}</Text>
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
                    <Text style={{ fontSize: 16 }}>{"✕"}</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Stats */}
            <View className="px-5 mt-3">
              <Text className="text-sm text-muted">
                {TODAS_LAS_DESTREZAS.length} destrezas disponibles {"\u00b7"} 13 asignaturas
              </Text>
            </View>

            {/* WhatsApp Group Banner */}
            <View className="px-5 mt-4">
              <Pressable
                onPress={() => Linking.openURL("https://chat.whatsapp.com/Kx4DtAkSVW4A1SM5xQUIyj?mode=gi_t")}
                style={({ pressed }) => [
                  styles.whatsappBanner,
                  { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <View style={styles.whatsappBannerContent}>
                  <Text style={{ fontSize: 28 }}>{"\uD83D\uDCAC"}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.whatsappBannerTitle}>
                      Ingresar a grupo exclusivo de WhatsApp
                    </Text>
                    <Text style={styles.whatsappBannerSubtitle}>
                      Donde muchos m{"\u00e1"}s docentes est{"\u00e1"}n planificando inteligentemente
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: "#fff" }}>{"\u203A"}</Text>
                </View>
              </Pressable>
            </View>

            {/* Areas grid - only show when not searching */}
            {resultados.length === 0 && (
              <>
                {/* Inicial Section */}
                <View className="px-5 mt-4">
                  <Pressable
                    onPress={() => router.push("/planificar-inicial" as any)}
                    style={({ pressed }) => ({
                      backgroundColor: "#0EA5E9",
                      borderRadius: 14,
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 32 }}>🧒</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                        Nueva Planificación Inicial
                      </Text>
                      <Text style={{ color: "#e0f2fe", fontSize: 12, marginTop: 2 }}>
                        140 destrezas · 7 ámbitos · Actividades con IA
                      </Text>
                    </View>
                    <Text style={{ color: "#fff", fontSize: 20 }}>›</Text>
                  </Pressable>
                </View>

                {/* EGB Section */}
                <View className="px-5 mt-6 mb-3">
                  <Text className="text-lg font-semibold text-foreground">
                    Educaci{"ó"}n General B{"á"}sica
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Preparatoria {"·"} Elemental {"·"} Media {"·"} Superior
                  </Text>
                </View>
                <View className="px-5">
                  <View style={styles.areasGrid}>
                    {EGB_AREAS.map(renderAreaCard)}
                  </View>
                </View>

                {/* BGU Section */}
                <View className="px-5 mt-6 mb-3">
                  <Text className="text-lg font-semibold text-foreground">
                    Bachillerato General Unificado
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    1ro {"\u00b7"} 2do {"\u00b7"} 3ro BGU
                  </Text>
                </View>
                <View className="px-5">
                  <View style={styles.areasGrid}>
                    {BGU_AREAS.map(renderAreaCard)}
                  </View>
                </View>

                {/* Planificación Curricular Section */}
                <View className="px-5 mt-6 mb-3">
                  <Text className="text-lg font-semibold text-foreground">
                    Planificaci{"ó"}n Curricular
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Documentos oficiales MinEduc generados con IA
                  </Text>
                </View>
                <View className="px-5">
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Pressable
                      onPress={() => router.push("/planificacion-anual" as any)}
                      style={({ pressed }) => [
                        styles.pcaCard,
                        { backgroundColor: "#003366" + "15", borderColor: "#003366" + "30", opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Text style={{ fontSize: 24 }}>{"📋"}</Text>
                      <Text style={[styles.pcaCardTitle, { color: "#003366" }]}>PCA Anual</Text>
                      <Text style={[styles.pcaCardSub, { color: "#00336690" }]}>Plan Curricular Anual</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push("/planificacion-trimestral" as any)}
                      style={({ pressed }) => [
                        styles.pcaCard,
                        { backgroundColor: "#0E7490" + "15", borderColor: "#0E7490" + "30", opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Text style={{ fontSize: 24 }}>{"🗓️"}</Text>
                      <Text style={[styles.pcaCardTitle, { color: "#0E7490" }]}>PCT Trimestral</Text>
                      <Text style={[styles.pcaCardSub, { color: "#0E749090" }]}>Plan por trimestre</Text>
                    </Pressable>
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
                              {plan.asignatura} {"—"} {plan.grado}
                            </Text>
                            <Text
                              className="text-xs text-muted mt-1"
                              numberOfLines={1}
                            >
                              {plan.fecha}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16, color: colors.muted }}>{"›"}</Text>
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
              <Text style={{ fontSize: 48 }}>{"🔎"}</Text>
              <Text className="text-base text-muted mt-3 text-center">
                No se encontraron destrezas para "{query}"
              </Text>
              <Text className="text-sm text-muted mt-1 text-center">
                Intenta con otro c{"ó"}digo o t{"é"}rmino
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
    gap: 6,
  },
  areaCardText: {
    fontSize: 14,
    fontWeight: "600",
  },
  areaCountText: {
    fontSize: 11,
    fontWeight: "500",
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
  whatsappBanner: {
    backgroundColor: "#25D366",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  whatsappBannerContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  whatsappBannerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700" as const,
    lineHeight: 18,
  },
  whatsappBannerSubtitle: {
    color: "#ffffffcc",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  pcaCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    alignItems: 'flex-start' as const,
    gap: 4,
  },
  pcaCardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  pcaCardSub: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
});
