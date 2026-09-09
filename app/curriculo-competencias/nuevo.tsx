import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function NuevoTipoScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <ScreenContainer className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-foreground">
          Nueva Planificación
        </Text>
        <Text className="text-sm text-muted mt-1">
          Selecciona el tipo de planificación
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 14 }}>
        {/* ── EGB / BGU ── */}
        <Pressable
          onPress={() => router.push("/curriculo-competencias/egb-bgu" as any)}
          style={({ pressed }) => [
            styles.typeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.typeIcon}>📘</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, { color: colors.foreground }]}>
              EGB / BGU
            </Text>
            <Text style={[styles.typeDesc, { color: colors.muted }]}>
              Educación General Básica y Bachillerato General Unificado.
              Planificación microcurricular con DCD, indicadores y estrategias
              metodológicas.
            </Text>
          </View>
          <Text style={[styles.typeArrow, { color: colors.muted }]}>›</Text>
        </Pressable>

        {/* ── Inicial / Preparatoria ── */}
        <Pressable
          onPress={() => router.push("/curriculo-competencias/inicial" as any)}
          style={({ pressed }) => [
            styles.typeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.typeIcon}>🧸</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, { color: colors.foreground }]}>
              Inicial / Preparatoria
            </Text>
            <Text style={[styles.typeDesc, { color: colors.muted }]}>
              Educación Inicial y Preparatoria. Planificación por ámbitos de
              desarrollo con clases y actividades.
            </Text>
          </View>
          <Text style={[styles.typeArrow, { color: colors.muted }]}>›</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  typeIcon: {
    fontSize: 32,
  },
  typeTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  typeDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  typeArrow: {
    fontSize: 24,
    fontWeight: "300",
  },
});
