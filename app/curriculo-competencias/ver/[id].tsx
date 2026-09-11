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
  const isValidId = !isNaN(planId) && planId > 0;

  const { data: plan, isLoading, error } = trpc.curriculoCompetencias.getById.useQuery(
    { id: planId },
    { enabled: isValidId }
  );

  const utils = trpc.useContext();

  const deleteMutation = trpc.curriculoCompetencias.delete.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      Alert.alert("Eliminada", "Planificación eliminada correctamente");
      router.back();
    },
    onError: (err) => {
      Alert.alert("Error", "No se pudo eliminar la planificación. Intenta de nuevo.");
    },
  });

  const exportWordMutation = trpc.curriculoCompetencias.exportWord.useMutation({
    onSuccess: (data) => {
      try {
        const binary = atob(data.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        Alert.alert("Error", "No se pudo descargar el archivo Word.");
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo generar el documento Word. Intenta de nuevo.");
    },
  });

  const exportPdfMutation = trpc.curriculoCompetencias.exportPdf.useMutation({
    onSuccess: (data) => {
      try {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(data.html);
          win.document.close();
          setTimeout(() => win.print(), 300);
        } else {
          Alert.alert("Aviso", "Se abrió una nueva ventana con el PDF. Si no lo ves, revisa el bloqueador de pop-ups.");
        }
      } catch {
        Alert.alert("Error", "No se pudo abrir el PDF. Intenta de nuevo.");
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo generar el PDF. Intenta de nuevo.");
    },
  });

  const handleDelete = () => {
    const confirmDelete = () => deleteMutation.mutate({ id: planId });

    if (Platform.OS === "web") {
      if (confirm("¿Eliminar esta planificación? Esta acción no se puede deshacer.")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Eliminar planificación",
        "¿Deseas eliminar esta planificación? Esta acción no se puede deshacer.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: confirmDelete },
        ]
      );
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

  // ── Estado: ID inválido ──
  if (!isValidId) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            ID de planificación inválido
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, textAlign: "center" }}>
            El enlace no contiene un identificador válido.
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // ── Estado: Cargando ──
  if (isLoading) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 12 }}>
            Cargando planificación…
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // ── Estado: Error al cargar ──
  if (error) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>❌</Text>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            Error al cargar la planificación
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, textAlign: "center" }}>
            {error.message || "Ocurrió un error inesperado."}
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
            <Pressable
              onPress={() => utils.curriculoCompetencias.getById.invalidate()}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Reintentar</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Estado: No encontrada ──
  if (!plan) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
            Planificación no encontrada
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, textAlign: "center" }}>
            No existe una planificación con el ID {planId}.
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>Volver al listado</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const formData = plan.formData as any;
  const source = plan.sourceTraceability as any;
  const isExporting = exportWordMutation.isPending || exportPdfMutation.isPending;

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
              <InfoRow label="Área" value={formData?.asignatura || formData?.areaCode} colors={colors} />
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
            disabled={isExporting || deleteMutation.isPending}
            style={[styles.navBtn, { backgroundColor: colors.primary, opacity: isExporting || deleteMutation.isPending ? 0.5 : 1 }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => exportWordMutation.mutate({ id: planId })}
            disabled={isExporting || deleteMutation.isPending}
            style={[styles.navBtn, { backgroundColor: "#2563EB", opacity: isExporting || deleteMutation.isPending ? 0.5 : 1 }]}
          >
            {exportWordMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}>Generando…</Text>
              </View>
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600" }}>Word</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => exportPdfMutation.mutate({ id: planId })}
            disabled={isExporting || deleteMutation.isPending}
            style={[styles.navBtn, { backgroundColor: "#DC2626", opacity: isExporting || deleteMutation.isPending ? 0.5 : 1 }]}
          >
            {exportPdfMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}>Preparando…</Text>
              </View>
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600" }}>PDF</Text>
            )}
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={isExporting || deleteMutation.isPending}
            style={[styles.navBtn, { backgroundColor: "#6B7280", opacity: isExporting || deleteMutation.isPending ? 0.5 : 1 }]}
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
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
