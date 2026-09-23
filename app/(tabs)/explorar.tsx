import { useState, useMemo } from "react";
import { Text, View, FlatList, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  AREAS_INFO,
  Area,
  Subnivel,
  SUBNIVEL_NAMES,
  TODAS_LAS_DESTREZAS,
  AMBITOS_PREPARATORIA,
  filtrarPorArea,
  filtrarPorAreaYSubnivel,
  obtenerSubnivelesDeArea,
  obtenerBloquesDeAreaSubnivel,
  obtenerNombreBloqueDestreza,
} from "@/data";

const EGB_AREAS: Area[] = ["M", "LL", "CN", "CS", "EF", "ECA"];
const BGU_AREAS: Area[] = ["CN.B", "CN.Q", "CN.F", "CS.H", "CS.F", "EFL", "EG"];

/** Emojis de los 7 ámbitos de Preparatoria (orden de AMBITOS_PREPARATORIA). */
const EMOJI_AMBITOS_PREP = ["🧑", "🤝", "🌍", "🔢", "💬", "🎨", "🤸"];
/** Cromática propia de los ítems de ámbitos (no son áreas curriculares). */
const COLOR_AMBITO_PREP = "#8B5CF6";

/** Grados de Educación Inicial (subniveles -1 y 0) como tarjetas del grid. */
const INI_GRADOS: { subnivel: Subnivel; name: string }[] = [
  { subnivel: -1, name: "Inicial 1 (3 a 4 años)" },
  { subnivel: 0, name: "Inicial 2 (4 a 5 años)" },
];

/** Ítem mínimo del grid: áreas y ámbitos comparten la forma de la tarjeta. */
type ItemSeccion = {
  /** Clave única de la tarjeta. */
  code: string;
  name: string;
  emoji: string;
  color: string;
  /** Área destino del flujo por subniveles. */
  area?: Area;
  /** Solo en Inicial: salta directo al listado de ese grado. */
  subnivel?: Subnivel;
  /** Solo en Preparatoria: número de ámbito del currículo integrado. */
  ambito?: number;
};

type SeccionExplorar = {
  title: string;
  subtitle: string;
  data: ItemSeccion[];
};

function itemArea(code: Area): ItemSeccion {
  const info = AREAS_INFO[code];
  return { code, area: code, name: info.name, emoji: info.emoji, color: info.color };
}

const SECTIONS: SeccionExplorar[] = [
  {
    title: "Educación Inicial",
    subtitle: "3 a 5 años · currículo por ámbitos",
    data: INI_GRADOS.map((g) => ({
      code: `INI.${g.subnivel}`,
      area: "INI",
      subnivel: g.subnivel,
      name: g.name,
      emoji: AREAS_INFO.INI.emoji,
      color: AREAS_INFO.INI.color,
    })),
  },
  {
    title: "Preparatoria",
    subtitle: "1.° EGB · currículo integrador por ámbitos",
    data: Object.entries(AMBITOS_PREPARATORIA).map(([n, nombre]) => ({
      code: `PRE.${n}`,
      name: nombre,
      emoji: EMOJI_AMBITOS_PREP[Number(n) - 1] ?? "📘",
      color: COLOR_AMBITO_PREP,
      ambito: Number(n),
    })),
  },
  {
    title: "Educaci\u00f3n General B\u00e1sica",
    subtitle: "Elemental \u00b7 Media \u00b7 Superior",
    data: EGB_AREAS.map((code) => itemArea(code)),
  },
  {
    title: "Bachillerato General Unificado",
    subtitle: "1ro \u00b7 2do \u00b7 3ro BGU",
    data: BGU_AREAS.map((code) => itemArea(code)),
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
  // Ámbito de Preparatoria elegido (fuera del flujo por área/subnivel).
  const [ambitoPrep, setAmbitoPrep] = useState<number | null>(null);

  // Grid de áreas: medimos el ancho real del contenido (onLayout, ya contado
  // el sidebar); hasta el primer layout se estima con el ancho de la ventana.
  const { width: windowWidth } = useWindowDimensions();
  const [anchoGrilla, setAnchoGrilla] = useState(0);
  const anchoContenido = anchoGrilla || windowWidth - 40;
  const columnas = anchoContenido >= 940 ? 3 : anchoContenido >= 580 ? 2 : 1;
  const anchoUtil = Math.max(anchoContenido - 40, 0); // padding horizontal 20 + 20
  const anchoTarjeta =
    columnas === 1
      ? ("100%" as const)
      : Math.floor((anchoUtil - 12 * (columnas - 1)) / columnas);

  // Inicial y Preparatoria se muestran en su propia sección del grid (grados
  // y ámbitos), fuera del recorrido genérico por área: sus destrezas se
  // organizan por ámbito de desarrollo (AREAS_INFO.INI.bloques /
  // AMBITOS_PREPARATORIA), no por bloque de la asignatura — resolver el nombre
  // con obtenerNombreBloque(area, bloque) devolvería el bloque regular, no el
  // ámbito (D7 de openspec/changes/preparatoria-area-integradora). Este filtro
  // mantiene subnivel 1 fuera del vuelco por área mientras se recorre por
  // ámbitos.
  const subniveles = useMemo(
    () => (selectedArea ? obtenerSubnivelesDeArea(selectedArea).filter(s => s !== 1) : []),
    [selectedArea]
  );

  const destrezas = useMemo(() => {
    if (!selectedArea) return [];
    if (selectedSubnivel) return filtrarPorAreaYSubnivel(selectedArea, selectedSubnivel);
    return filtrarPorArea(selectedArea).filter(d => d.subnivel !== 1);
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

  // Vista de ámbito de Preparatoria: destrezas de varias áreas agrupadas por
  // el ámbito elegido (subnivel 1, `bloque` = número de ámbito).
  if (ambitoPrep !== null) {
    const nombreAmbito = AMBITOS_PREPARATORIA[ambitoPrep] ?? `Ámbito ${ambitoPrep}`;
    const destrezasAmbito = TODAS_LAS_DESTREZAS.filter(
      (d) => d.subnivel === 1 && d.bloque === ambitoPrep
    );
    return (
      <ScreenContainer key={`ambito-${ambitoPrep}`} className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Pressable
            onPress={() => setAmbitoPrep(null)}
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
          <Text className="text-2xl font-bold mt-3">Ámbito {ambitoPrep}</Text>
          <Text className="text-base text-muted mt-1">{nombreAmbito}</Text>
          <Text className="text-sm text-muted mt-1">
            Preparatoria · {destrezasAmbito.length} destrezas
          </Text>
        </View>
        <FlatList
          data={destrezasAmbito}
          keyExtractor={(item) => item.codigo}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
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
                    { backgroundColor: AREAS_INFO[item.area].color + "20" },
                  ]}
                >
                  <Text
                    style={{
                      color: AREAS_INFO[item.area].color,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {item.codigo}
                  </Text>
                </View>
                <Text className="text-xs text-muted">
                  {AREAS_INFO[item.area].emoji} {AREAS_INFO[item.area].name}
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

  // Area selection view with sections
  if (!selectedArea) {
    return (
      <ScreenContainer key="areas" className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Explorar</Text>
          <Text className="text-base text-muted mt-1">
            Navega por {"\u00e1"}reas y subniveles
          </Text>
        </View>
        <View
          style={{ flex: 1 }}
          onLayout={(e) => setAnchoGrilla(e.nativeEvent.layout.width)}
        >
          <ScrollView contentContainerStyle={styles.listContent}>
            {SECTIONS.map((section) => (
              <View key={section.title}>
                <View style={styles.sectionHeader}>
                  <Text className="text-lg font-semibold text-foreground">
                    {section.title}
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    {section.subtitle}
                  </Text>
                </View>
                <View style={styles.gridAreas}>
                  {section.data.map((item, index) => {
                    // Conteo coherente con lo que la tarjeta efectivamente abre.
                    const count =
                      item.ambito !== undefined
                        ? TODAS_LAS_DESTREZAS.filter(
                            (d) => d.subnivel === 1 && d.bloque === item.ambito
                          ).length
                        : item.subnivel !== undefined && item.area
                          ? filtrarPorAreaYSubnivel(item.area, item.subnivel).length
                          : item.area
                            ? filtrarPorArea(item.area).filter(
                                (d) => d.subnivel !== 1
                              ).length
                            : 0;
                    const ultimaDeFila =
                      columnas === 1 || (index + 1) % columnas === 0;
                    return (
                      <Pressable
                        key={item.code}
                        onPress={() => {
                          if (item.ambito !== undefined) {
                            setAmbitoPrep(item.ambito);
                            return;
                          }
                          if (item.area) setSelectedArea(item.area);
                          if (item.subnivel !== undefined)
                            setSelectedSubnivel(item.subnivel);
                        }}
                        style={({ pressed }) => [
                          styles.areaRow,
                          {
                            width: anchoTarjeta,
                            marginRight: ultimaDeFila ? 0 : 12,
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
                        <Text style={{ fontSize: 18, color: colors.muted }}>
                          {"\u203A"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  // Subnivel selection view
  if (!selectedSubnivel) {
    return (
      <ScreenContainer key={`subniveles-${selectedArea}`} className="flex-1">
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
        {/* ScrollView avoids FlatList virtualization removeChild conflict on height transitions */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {subniveles.map((item) => {
            const count = filtrarPorAreaYSubnivel(selectedArea, item).length;
            return (
              <Pressable
                key={String(item)}
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
          })}
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Destrezas list view
  return (
    <ScreenContainer key={`destrezas-${selectedArea}-${selectedSubnivel}`} className="flex-1">
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
        removeClippedSubviews={false}
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
                {item.subnivel === 1 || item.area === "INI"
                  ? `Ámbito ${item.bloque}`
                  : `Bloque ${item.bloque}`}
                {": "}
                {obtenerNombreBloqueDestreza(item)}
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
  gridAreas: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  areaRow: {
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
