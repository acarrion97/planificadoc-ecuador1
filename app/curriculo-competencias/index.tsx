import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type TipoFilter = "all" | "egb_bgu" | "inicial_preparatoria";

const TIPO_LABELS: Record<string, string> = {
  egb_bgu: "EGB / BGU",
  inicial_preparatoria: "Inicial / Preparatoria",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  generated: "Generado",
  paid: "Pagado",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#D97706",
  generated: "#16A34A",
  paid: "#1B5E9E",
};

export default function CurriculoCompetenciasScreen() {
  const colors = useColors();
  const router = useRouter();
  const [filtro, setFiltro] = useState<TipoFilter>("all");

  const {
    data: planificaciones,
    isLoading,
    refetch,
  } = trpc.curriculoCompetencias.list.useQuery({
    sessionId: "default",
    tipo: filtro === "all" ? undefined : filtro,
  });

  const deleteMutation = trpc.curriculoCompetencias.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleDelete = (id: number, label: string) => {
    if (Platform.OS === "web") {
      if (confirm(`¿Eliminar la planificación "${label}"?`)) {
        deleteMutation.mutate({ id });
      }
    } else {
      Alert.alert("Eliminar planificación", `¿Deseas eliminar "${label}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteMutation.mutate({ id }),
        },
      ]);
    }
  };

  const handleOpen = (id: number) => {
    router.push(`/curriculo-competencias/ver/${id}` as any);
  };

  const getLabel = (item: any) => {
    if (item.tipo === "egb_bgu") {
      return `${item.asignatura || "Sin asignatura"} — ${item.grado || "?"}° ${item.paralelo || ""}`.trim();
    }
    return `${item.grado || "Inicial"}`;
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">
            Currículo por Competencias
          </Text>
          <Text className="text-sm text-muted mt-1">
            Planificaciones por competencias — Plan Piloto
          </Text>
        </View>

        {/* ── Botón crear ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <Pressable
            onPress={() => router.push("/curriculo-competencias/nuevo" as any)}
            style={({ pressed }) => [
              styles.createBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.createBtnText}>+ Nueva Planificación</Text>
          </Pressable>
        </View>

        {/* ── Filtros ── */}
        <View style={styles.filterRow}>
          {([
            { key: "all", label: "Todas" },
            { key: "egb_bgu", label: "EGB/BGU" },
            { key: "inicial_preparatoria", label: "Inicial" },
          ] as const).map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFiltro(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filtro === f.key ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: filtro === f.key ? "#fff" : colors.foreground,
                  fontWeight: filtro === f.key ? "600" : "400",
                  fontSize: 13,
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Lista ── */}
        {isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !planificaciones || planificaciones.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📚</Text>
            <Text style={{ color: colors.muted, fontSize: 15 }}>
              No hay planificaciones todavía
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>
              Crea una nueva para comenzar
            </Text>
          </View>
        ) : (
          planificaciones.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleOpen(item.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    {getLabel(item)}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                    {TIPO_LABELS[item.tipo] || item.tipo}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLORS[item.status] + "20" },
                  ]}
                >
                  <Text
                    style={{
                      color: STATUS_COLORS[item.status],
                      fontSize: 11,
                      fontWeight: "600",
                    }}
                  >
                    {STATUS_LABELS[item.status] || item.status}
                  </Text>
                </View>
              </View>

              {item.dcdCodigo && (
                <Text style={[styles.cardDetail, { color: colors.muted }]}>
                  DCD: {item.dcdCodigo}
                </Text>
              )}

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => handleOpen(item.id)}
                  style={[styles.actionBtn, { backgroundColor: colors.primary + "15" }]}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>
                    Abrir
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    handleDelete(item.id, getLabel(item))
                  }
                  style={[styles.actionBtn, { backgroundColor: "#DC262615" }]}
                >
                  <Text style={{ color: "#DC2626", fontSize: 12, fontWeight: "500" }}>
                    Eliminar
                  </Text>
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
  createBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cardDetail: {
    fontSize: 12,
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
