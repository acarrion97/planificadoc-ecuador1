import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import type { BaseCurricular } from "@/data/types-proyecto-interdisciplinar";

export default function NuevoProyectoInterdisciplinarScreen() {
  const colors = useColors();
  const router = useRouter();

  const elegir = (baseCurricular: BaseCurricular) => {
    router.push(`/proyecto-interdisciplinar/wizard?baseCurricular=${baseCurricular}` as any);
  };

  return (
    <ScreenContainer className="flex-1">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-foreground">
          Nuevo Proyecto Interdisciplinar
        </Text>
        <Text className="text-sm text-muted mt-1">
          Elige la base curricular del proyecto. No se puede cambiar después
          ni mezclar ambas dentro del mismo proyecto.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 14 }}>
        {/* ── Destrezas con criterios de desempeño ── */}
        <Pressable
          onPress={() => elegir("destrezas")}
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
              Destrezas con criterios de desempeño
            </Text>
            <Text style={[styles.typeDesc, { color: colors.muted }]}>
              Currículo de destrezas (Currículo Priorizado, vigente). Sigue el
              instructivo oficial de Proyecto Interdisciplinar (EGB
              Superior/BGU).
            </Text>
          </View>
          <Text style={[styles.typeArrow, { color: colors.muted }]}>›</Text>
        </Pressable>

        {/* ── Competencias específicas (CNC) ── */}
        <Pressable
          onPress={() => elegir("competencias")}
          style={({ pressed }) => [
            styles.typeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.typeIcon}>🧩</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, { color: colors.foreground }]}>
              Competencias específicas (CNC)
            </Text>
            <Text style={[styles.typeDesc, { color: colors.muted }]}>
              Currículo Nacional por Competencias (piloto Zona 6). Aún no hay
              un formato oficial publicado de Proyecto Interdisciplinar para
              este currículo.
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
