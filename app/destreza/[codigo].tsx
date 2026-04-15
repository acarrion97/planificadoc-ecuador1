import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  buscarPorCodigo,
  AREAS_INFO,
  SUBNIVEL_NAMES,
  SUBNIVEL_GRADOS,
  obtenerNombreBloque,
} from "@/data";

export default function DetalleDestrezaScreen() {
  const colors = useColors();
  const router = useRouter();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();

  const destreza = buscarPorCodigo(codigo || "");

  if (!destreza) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <Text style={{ fontSize: 56 }}>{"\u26A0\uFE0F"}</Text>
          <Text className="text-lg font-semibold text-foreground mt-4">
            Destreza no encontrada
          </Text>
          <Text className="text-sm text-muted mt-2 text-center">
            El c{"ó"}digo "{codigo}" no existe en la base de datos
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Volver
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const areaInfo = AREAS_INFO[destreza.area];

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View className="px-5 pt-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
            <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
              Atr{"á"}s
            </Text>
          </Pressable>
        </View>

        {/* Code & Area badge */}
        <View className="px-5 mt-4">
          <View style={styles.codeRow}>
            <Text
              style={[styles.codeText, { color: areaInfo.color }]}
            >
              {destreza.codigo}
            </Text>
            <View
              style={[
                styles.areaBadge,
                { backgroundColor: areaInfo.color + "20" },
              ]}
            >
              <Text style={{ fontSize: 16 }}>{areaInfo.emoji}</Text>
              <Text
                style={{
                  color: areaInfo.color,
                  fontSize: 13,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                {areaInfo.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-5 mt-4">
          <Text className="text-base text-foreground leading-6">
            {destreza.descripcion}
          </Text>
        </View>

        {/* Info cards */}
        <View className="px-5 mt-5">
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <InfoRow
              emoji={"\uD83C\uDFEB"}
              label="Subnivel"
              value={SUBNIVEL_NAMES[destreza.subnivel]}
              sublabel={SUBNIVEL_GRADOS[destreza.subnivel]}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              emoji={"\uD83D\uDCE6"}
              label="Bloque Curricular"
              value={`Bloque ${destreza.bloque}`}
              sublabel={obtenerNombreBloque(destreza.area, destreza.bloque)}
              colors={colors}
            />
          </View>
        </View>

        {/* Objectives */}
        {destreza.objetivos.length > 0 && (
          <View className="px-5 mt-5">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Objetivos del Subnivel
            </Text>
            {destreza.objetivos.map((obj, i) => (
              <View
                key={i}
                style={[
                  styles.objectiveCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{"\uD83C\uDFAF"}</Text>
                <Text className="text-sm text-foreground ml-3 flex-1 leading-5">
                  {obj}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Evaluation criteria */}
        {destreza.criteriosEvaluacion.length > 0 && (
          <View className="px-5 mt-5">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Criterios de Evaluaci{"ó"}n
            </Text>
            {destreza.criteriosEvaluacion.map((ce, i) => (
              <View
                key={i}
                style={[
                  styles.objectiveCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{"\u2611\uFE0F"}</Text>
                <Text className="text-sm text-foreground ml-3 flex-1 leading-5">
                  {ce}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Evaluation indicators */}
        {destreza.indicadoresEvaluacion.length > 0 && (
          <View className="px-5 mt-5">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Indicadores de Evaluaci{"ó"}n
            </Text>
            {destreza.indicadoresEvaluacion.map((ie, i) => (
              <View
                key={i}
                style={[
                  styles.objectiveCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 16 }}>{"\uD83D\uDCCA"}</Text>
                <Text className="text-sm text-foreground ml-3 flex-1 leading-5">
                  {ie}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Generate button */}
        <View className="px-5 mt-8 mb-10">
          <Pressable
            onPress={() => router.push(`/planificar/${destreza.codigo}` as any)}
            style={({ pressed }) => [
              styles.generateBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>{"\uD83D\uDCDD"}</Text>
            <Text style={styles.generateBtnText}>Generar Planificaci{"ó"}n</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoRow({
  emoji,
  label,
  value,
  sublabel,
  colors,
}: {
  emoji: string;
  label: string;
  value: string;
  sublabel?: string;
  colors: any;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text className="text-xs text-muted">{label}</Text>
        <Text className="text-base font-semibold text-foreground">{value}</Text>
        {sublabel && (
          <Text className="text-sm text-muted">{sublabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  codeText: {
    fontSize: 28,
    fontWeight: "800",
  },
  areaBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  objectiveCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
});
