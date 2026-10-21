import { Text, View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { FAMILIA_LABELS } from "@/lib/curriculo-competencias-familia";

/** Mismo sessionId que usa `app/curriculo-competencias/index.tsx` para "Mis planificaciones". */
const SESSION_ID = "default";

/**
 * Vista de solo lectura de una planificación compartida en la comunidad.
 * El servidor ya la entrega anonimizada (sin docente, institución, paralelo,
 * firmantes ni datos de estudiantes). "Duplicar como mío" crea una copia
 * propia (no compartida) y la abre en su formulario de edición.
 */
export default function VerPlanComunidadScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const planId = Number(id);
  const isValidId = !isNaN(planId) && planId > 0;

  const { data: plan, isLoading, error } = trpc.curriculoCompetencias.getCompartidaById.useQuery(
    { id: planId },
    { enabled: isValidId }
  );

  const utils = trpc.useContext();
  const duplicarMutation = trpc.curriculoCompetencias.duplicarCompartida.useMutation({
    onSuccess: (res) => {
      utils.curriculoCompetencias.list.invalidate();
      if (res.rutaEdicion) {
        router.replace(res.rutaEdicion as any);
      } else {
        Alert.alert("Listo", "La copia se guardó en tus planificaciones.");
        router.replace("/curriculo-competencias" as any);
      }
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo duplicar la planificación.");
    },
  });

  if (!isValidId || isLoading || error || !plan) {
    return (
      <ScreenContainer className="flex-1">
        <View style={styles.centro}>
          {isLoading && isValidId ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
                {error ? "Error al cargar la planificación" : "Esta planificación ya no está compartida"}
              </Text>
              <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Volver a la comunidad</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScreenContainer>
    );
  }

  const fd = plan.formData as any;
  const competencias: Array<{ codigo: string; descripcion?: string }> = Array.isArray(fd?.competenciasEspecifica)
    ? fd.competenciasEspecifica
    : Array.isArray(fd?.ambitos)
      ? fd.ambitos.map((a: any) => ({ codigo: a?.competenciaCodigo, descripcion: a?.competenciaDescripcion }))
      : fd?.destreza?.codigo
        ? [{ codigo: fd.destreza.codigo, descripcion: fd.destreza.descripcion }]
        : [];

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">
            {plan.titulo || [plan.asignaturaNombre, plan.grado].filter(Boolean).join(" — ") || "Planificación"}
          </Text>
          <Text className="text-sm text-muted mt-1">
            🌐 Comunidad · {FAMILIA_LABELS[plan.familia]}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📋 Datos generales</Text>
          <InfoRow label={Array.isArray(fd?.grados) ? "Grados" : "Grado"} value={plan.grado} colors={colors} />
          <InfoRow label="Asignatura" value={plan.asignaturaNombre} colors={colors} />
          <InfoRow label="Nivel" value={fd?.nivel} colors={colors} />
          <InfoRow label="Trimestre" value={fd?.trimestre} colors={colors} />
          <InfoRow label="Semanas" value={fd?.noSemanasClase} colors={colors} />
          {plan.createdAt && (
            <InfoRow label="Publicada" value={new Date(plan.createdAt).toLocaleDateString("es-EC")} colors={colors} />
          )}
        </View>

        {competencias.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🎯 Competencias</Text>
            {competencias.map((c, i) => (
              <View key={`${c.codigo}-${i}`} style={{ marginBottom: 8 }}>
                <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 13 }}>{c.codigo}</Text>
                {!!c.descripcion && <Text style={{ color: colors.foreground, fontSize: 13 }}>{c.descripcion}</Text>}
              </View>
            ))}
          </View>
        )}

        {(fd?.situacionAprendizaje?.titulo || fd?.situacionAprendizaje?.descripcion) && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>💡 Situación de aprendizaje</Text>
            {!!fd.situacionAprendizaje.titulo && (
              <Text style={{ color: colors.foreground, fontWeight: "600", fontSize: 14 }}>{fd.situacionAprendizaje.titulo}</Text>
            )}
            {!!fd.situacionAprendizaje.descripcion && (
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{fd.situacionAprendizaje.descripcion}</Text>
            )}
          </View>
        )}

        {Array.isArray(fd?.ambitos) && fd.ambitos.some((a: any) => a?.clases?.length) && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🗂️ Temas</Text>
            {fd.ambitos.flatMap((a: any) => a?.clases ?? []).map((clase: any, i: number) => (
              <Text key={i} style={{ color: colors.foreground, fontSize: 13, marginBottom: 4 }}>
                • {clase?.tema || `Clase ${clase?.numero ?? i + 1}`}
              </Text>
            ))}
          </View>
        )}

        {Array.isArray(fd?.semanas) && fd.semanas.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🗓️ Semanas</Text>
            {fd.semanas.map((s: any, i: number) => (
              <Text key={i} style={{ color: colors.foreground, fontSize: 13, marginBottom: 4 }}>
                Semana {s?.numero ?? i + 1}: {s?.tema || "—"}
              </Text>
            ))}
          </View>
        )}

        {plan.tipo === "egb_bgu" && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>✅ Objetivo y evaluación</Text>
            <InfoRow label="Objetivo" value={fd?.objetivoAprendizaje} colors={colors} />
            <InfoRow label="Indicador" value={fd?.indicadorEvaluacion} colors={colors} />
            <InfoRow label="Técnica" value={fd?.tecnicaEvaluacion} colors={colors} />
            <InfoRow label="Instrumento" value={fd?.instrumentoEvaluacion} colors={colors} />
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={() => duplicarMutation.mutate({ id: planId, sessionId: SESSION_ID })}
          disabled={duplicarMutation.isPending}
          style={[styles.btn, { backgroundColor: colors.primary, opacity: duplicarMutation.isPending ? 0.6 : 1 }]}
        >
          {duplicarMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>Duplicar como mío</Text>
          )}
        </Pressable>
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
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
