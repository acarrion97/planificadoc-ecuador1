import { Text, View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

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

export default function VerPlanificacionScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const planId = Number(id);

  const { data: plan, isLoading } = trpc.curriculoCompetencias.getById.useQuery(
    { id: planId },
    { enabled: !isNaN(planId) }
  );

  const utils = trpc.useContext();

  const deleteMutation = trpc.curriculoCompetencias.delete.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      router.back();
    },
  });

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (confirm("¿Eliminar esta planificación?")) {
        deleteMutation.mutate({ id: planId });
      }
    } else {
      Alert.alert("Eliminar planificación", "¿Deseas eliminar esta planificación?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteMutation.mutate({ id: planId }) },
      ]);
    }
  };

  const handleEdit = () => {
    if (!plan) return;
    if (plan.tipo === "egb_bgu") {
      router.push(`/curriculo-competencias/egb-bgu?id=${planId}` as any);
    } else {
      router.push(`/curriculo-competencias/inicial?id=${planId}` as any);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!plan) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>❌</Text>
          <Text style={{ color: colors.muted, fontSize: 15 }}>Planificación no encontrada</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const formData = plan.formData as any;
  const source = plan.sourceTraceability as any;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-2">
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text className="text-2xl font-bold text-foreground">
                {plan.tipo === "egb_bgu"
                  ? `${formData?.asignatura || "Sin asignatura"} — ${formData?.grado || "?"}`
                  : formData?.grado || "Inicial / Preparatoria"}
              </Text>
              <Text className="text-sm text-muted mt-1">
                {TIPO_LABELS[plan.tipo] || plan.tipo}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[plan.status] + "20" }]}>
              <Text style={{ color: STATUS_COLORS[plan.status], fontSize: 12, fontWeight: "600" }}>
                {STATUS_LABELS[plan.status] || plan.status}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Datos informativos ── */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📋 Datos Informativos</Text>
          <InfoRow label="Institución" value={formData?.institucion} colors={colors} />
          <InfoRow label="Docente" value={formData?.docente} colors={colors} />
          <InfoRow label="Grado" value={formData?.grado} colors={colors} />
          {plan.tipo === "egb_bgu" && (
            <>
              <InfoRow label="Asignatura" value={formData?.asignatura} colors={colors} />
              <InfoRow label="Nivel" value={formData?.nivel} colors={colors} />
              <InfoRow label="Paralelo" value={formData?.paralelo} colors={colors} />
              <InfoRow label="Trimestre" value={formData?.trimestre} colors={colors} />
            </>
          )}
          {plan.tipo === "inicial_preparatoria" && (
            <InfoRow label="Duración" value={formData?.duracion} colors={colors} />
          )}
          <InfoRow label="Período" value={formData?.periodoPedagogico || formData?.duracion} colors={colors} />
        </View>

        {/* ── EGB/BGU: DCD y competencias ── */}
        {plan.tipo === "egb_bgu" && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎯 DCD y Competencias</Text>
            <InfoRow label="DCD" value={formData?.destreza?.codigo || plan.dcdCodigo} colors={colors} />
            <InfoRow label="Descripción" value={formData?.destreza?.descripcion} colors={colors} />
            <InfoRow label="Competencias" value={(formData?.competenciasAsociadas || []).join(", ")} colors={colors} />
            <InfoRow label="Indicador" value={formData?.indicadorEvaluacion} colors={colors} />
            <InfoRow label="Objetivo" value={formData?.objetivoAprendizaje} colors={colors} />
          </View>
        )}

        {/* ── Inicial: Ámbitos ── */}
        {plan.tipo === "inicial_preparatoria" && formData?.ambitos && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎯 Ámbitos de Desarrollo</Text>
            {formData.ambitos.map((ambito: any, i: number) => (
              <View key={i} style={[styles.subSection, { borderTopColor: colors.border }]}>
                <Text style={[styles.subSectionTitle, { color: colors.primary }]}>
                  {ambito.ambito}
                </Text>
                <InfoRow label="Competencias" value={(ambito.competenciasTransversales || []).join(", ")} colors={colors} />
                <InfoRow label="Destrezas" value={(ambito.destrezas || []).join(", ")} colors={colors} />
                {ambito.clases?.map((clase: any, ci: number) => (
                  <View key={ci} style={[styles.claseRow, { backgroundColor: colors.background }]}>
                    <Text style={[styles.claseLabel, { color: colors.foreground }]}>
                      Clase {clase.numero}: {clase.tema}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                      {clase.metodologia}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Estrategia didáctica ── */}
        {plan.tipo === "egb_bgu" && formData?.estructuraDidactica && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📐 Estrategia Didáctica</Text>
            <InfoRow label="Estrategia" value={formData.estructuraDidactica.estrategiaId} colors={colors} />
            {formData.estructuraDidactica.fases?.map((fase: any, i: number) => (
              <View key={i} style={[styles.faseRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.faseTitle, { color: colors.foreground }]}>
                  {fase.titulo} ({fase.duracionMinutos} min)
                </Text>
                {fase.actividades?.map((act: any, ai: number) => (
                  <Text key={ai} style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                    • {act.texto}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Evaluación ── */}
        {plan.tipo === "egb_bgu" && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>✅ Evaluación</Text>
            <InfoRow label="Técnica" value={formData?.tecnicaEvaluacion} colors={colors} />
            <InfoRow label="Instrumento" value={formData?.instrumentoEvaluacion} colors={colors} />
            <InfoRow label="Actividades" value={formData?.actividadesEvaluacion} colors={colors} />
          </View>
        )}

        {/* ── Trazabilidad ── */}
        {source && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🔍 Trazabilidad</Text>
            <InfoRow label="Documento fuente" value={source.source_document} colors={colors} />
            <InfoRow label="Sección" value={source.source_section} colors={colors} />
            <InfoRow label="Versión" value={source.source_version} colors={colors} />
            <InfoRow label="Normalizado" value={source.normalized_at} colors={colors} />
          </View>
        )}
      </ScrollView>

      {/* ── Botones de acción ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          <Pressable
            onPress={handleEdit}
            style={[styles.navBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Editar</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            style={[styles.navBtn, { backgroundColor: "#DC2626" }]}
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600" }}>Eliminar</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

function InfoRow({
  label,
  value,
  colors,
}: {
  label: string;
  value?: string | number | null;
  colors: ReturnType<typeof useColors>;
}) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  subSection: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1.5,
    textAlign: "right",
  },
  claseRow: {
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  claseLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  faseRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
  },
  faseTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  bottomBarInner: {
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
