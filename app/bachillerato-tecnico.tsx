import { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  AREAS_BT,
  FAMILIAS_PROFESIONALES,
  obtenerFigurasPorFamilia,
} from "@/data";
import type { FiguraProfesional } from "@/data";

export default function BachilleratoTecnicoScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState<string>("tecnica");
  const [expandedFamilia, setExpandedFamilia] = useState<string | null>(null);

  const familiasFiltradas = FAMILIAS_PROFESIONALES.filter(
    (f) => f.area === selectedArea
  );

  const handleFiguraPress = (figura: FiguraProfesional) => {
    router.push(`/planificar-bt/${figura.id}` as any);
  };

  return (
    <ScreenContainer className="flex-1">
      <FlatList
        data={familiasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
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
              <Text className="text-2xl font-bold text-foreground">
                Bachillerato T{"\u00e9"}cnico
              </Text>
              <Text className="text-sm text-muted mt-1">
                Selecciona una figura profesional para planificar
              </Text>
            </View>

            {/* Area tabs */}
            <View style={styles.tabsContainer}>
              {AREAS_BT.map((area) => (
                <Pressable
                  key={area.id}
                  onPress={() => {
                    setSelectedArea(area.id);
                    setExpandedFamilia(null);
                  }}
                  style={({ pressed }) => [
                    styles.tab,
                    {
                      backgroundColor:
                        selectedArea === area.id
                          ? colors.primary
                          : colors.surface,
                      borderColor:
                        selectedArea === area.id
                          ? colors.primary
                          : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color:
                          selectedArea === area.id
                            ? "#fff"
                            : colors.foreground,
                      },
                    ]}
                  >
                    {area.nombre}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        renderItem={({ item: familia }) => {
          const figuras = obtenerFigurasPorFamilia(familia.id);
          const isExpanded = expandedFamilia === familia.id;

          return (
            <View style={[styles.familiaContainer, { borderColor: colors.border }]}>
              <Pressable
                onPress={() =>
                  setExpandedFamilia(isExpanded ? null : familia.id)
                }
                style={({ pressed }) => [
                  styles.familiaHeader,
                  {
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.familiaTitle, { color: colors.foreground }]}>
                    {familia.nombre}
                  </Text>
                  <Text style={[styles.familiaCount, { color: colors.muted }]}>
                    {figuras.length} figura{figuras.length !== 1 ? "s" : ""} profesional{figuras.length !== 1 ? "es" : ""}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.muted }}>
                  {isExpanded ? "\u25B2" : "\u25BC"}
                </Text>
              </Pressable>

              {isExpanded && (
                <View style={styles.figurasContainer}>
                  {figuras.map((figura) => (
                    <Pressable
                      key={figura.id}
                      onPress={() => handleFiguraPress(figura)}
                      style={({ pressed }) => [
                        styles.figuraCard,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.figuraTitle, { color: colors.foreground }]}>
                          {figura.nombre}
                        </Text>
                        <Text
                          style={[styles.figuraDesc, { color: colors.muted }]}
                          numberOfLines={2}
                        >
                          {figura.objetivoGeneral}
                        </Text>
                        <Text style={[styles.figuraModulos, { color: colors.primary }]}>
                          {figura.modulos.length} m{"\u00f3"}dulos formativos
                        </Text>
                      </View>
                      <Text style={{ fontSize: 18, color: colors.muted }}>
                        {"\u203A"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  familiaContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  familiaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  familiaTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  familiaCount: {
    fontSize: 12,
    marginTop: 2,
  },
  figurasContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  figuraCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  figuraTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  figuraDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  figuraModulos: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 6,
  },
});
