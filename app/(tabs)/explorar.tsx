import { useState, useMemo } from "react";
import { Text, View, FlatList, SectionList, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  AREAS_INFO,
  Area,
  AreaInfo,
  Subnivel,
  SUBNIVEL_NAMES,
  filtrarPorArea,
  filtrarPorAreaYSubnivel,
  obtenerSubnivelesDeArea,
  obtenerBloquesDeAreaSubnivel,
  obtenerNombreBloque,
} from "@/data";

const EGB_AREAS: Area[] = ["M", "LL", "CN", "CS", "EF", "ECA"];
const BGU_AREAS: Area[] = ["CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG"];

const SECTIONS = [
  {
    title: "Educaci\u00f3n General B\u00e1sica",
    subtitle: "Preparatoria \u00b7 Elemental \u00b7 Media \u00b7 Superior",
    data: EGB_AREAS.map((code) => AREAS_INFO[code]),
  },
  {
    title: "Bachillerato General Unificado",
    subtitle: "1ro \u00b7 2do \u00b7 3ro BGU",
    data: BGU_AREAS.map((code) => AREAS_INFO[code]),
  },
];

export default function ExplorarScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ area?: string }>();

  const [selectedArea, setSelectedArea] = useState<Area | null>(
    (params.area as Area) || null
  );
  const [selectedSubnivel, setSelectedSubnivel] = useState<Subnivel | null>(null);

  const subniveles = useMemo(
    () => (selectedArea ? obtenerSubnivelesDeArea(selectedArea) : []),
    [selectedArea]
  );

  const destrezas = useMemo(() => {
    if (!selectedArea) return [];
    if (selectedSubnivel) return filtrarPorAreaYSubnivel(selectedArea, selectedSubnivel);
    return filtrarPorArea(selectedArea);
  }, [selectedArea, selectedSubnivel]);

  const bloques = useMemo(() => {
    if (!selectedArea || !selectedSubnivel) return [];
    return obtenerBloquesDeAreaSubnivel(selectedArea, selectedSubnivel);
  }, [selectedArea, selectedSubnivel]);

  const areaInfo = selectedArea ? AREAS_INFO[selectedArea] : null;

  const handleBack = () => {
    if (selectedSubnivel) {
      setSelectedSubnivel(null);
    } else if (selectedArea) {
      setSelectedArea(null);
    }
  };

  // Area selection view with sections
  if (!selectedArea) {
    return (
      <ScreenContainer className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Explorar</Text>
          <Text className="text-base text-muted mt-1">
            Navega por {"\u00e1"}reas y subniveles
          </Text>
        </View>
        <SectionList
          sections={SECTIONS}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text className="text-lg font-semibold text-foreground">
                {section.title}
              </Text>
              <Text className="text-xs text-muted mt-1">
                {section.subtitle}
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const count = filtrarPorArea(item.code).length;
            return (
              <Pressable
                onPress={() => setSelectedArea(item.code)}
                style={({ pressed }) => [
                  styles.areaRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.areaIcon,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text className="text-base font-semibold text-foreground">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    {count} destrezas
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.muted }}>{"\u203A"}</Text>
              </Pressable>
            );
          }}
        />
      </ScreenContainer>
    );
  }

  // Subnivel selection view
  if (!selectedSubnivel) {
    return (
      <ScreenContainer className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
            <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
              {"\u00c1"}reas
            </Text>
          </Pressable>
          <Text
            className="text-2xl font-bold mt-3"
            style={{ color: areaInfo?.color }}
          >
            {areaInfo?.name}
          </Text>
          <Text className="text-base text-muted mt-1">
            Selecciona un subnivel
          </Text>
        </View>
        <FlatList
          data={subniveles}
          keyExtractor={(item) => String(item)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const count = filtrarPorAreaYSubnivel(selectedArea, item).length;
            return (
              <Pressable
                onPress={() => setSelectedSubnivel(item)}
                style={({ pressed }) => [
                  styles.subnivelRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.subnivelBadge,
                    { backgroundColor: areaInfo?.color + "15" },
                  ]}
                >
                  <Text
                    style={{
                      color: areaInfo?.color,
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text className="text-base font-semibold text-foreground">
                    {SUBNIVEL_NAMES[item]}
                  </Text>
                  <Text className="text-sm text-muted">{count} destrezas</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.muted }}>{"\u203A"}</Text>
              </Pressable>
            );
          }}
        />
      </ScreenContainer>
    );
  }

  // Destrezas list view
  return (
    <ScreenContainer className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
          <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
            {areaInfo?.name}
          </Text>
        </Pressable>
        <Text className="text-xl font-bold text-foreground mt-3">
          {SUBNIVEL_NAMES[selectedSubnivel]}
        </Text>
        <Text className="text-sm text-muted mt-1">
          {destrezas.length} destrezas
        </Text>
      </View>
      <FlatList
        data={destrezas}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/destreza/${item.codigo}` as any)}
            style={({ pressed }) => [
              styles.destrezaCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.destrezaHeader}>
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
                  {item.codigo}
                </Text>
              </View>
              <Text className="text-xs text-muted">
                Bloque {item.bloque}: {obtenerNombreBloque(item.area, item.bloque)}
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
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  areaRow: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  areaIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  subnivelRow: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  subnivelBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  destrezaCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  destrezaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
