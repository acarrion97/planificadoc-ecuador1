import { View, Text, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO } from "@/data";
import type { DUAActividad } from "@/data/types";
import { useState } from "react";
import { ExportModal } from "@/components/ExportModal";

const DUA_ROSADO = "#EC4899";
const DUA_AZUL   = "#1E3A5F";
const DUA_VERDE  = "#22C55E";

const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaSemanaKey = typeof DIAS_SEMANA[number];
const DIA_LABEL: Record<DiaSemanaKey, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles", jueves: "Jueves", viernes: "Viernes",
};
const DIA_EMOJI: Record<DiaSemanaKey, string> = {
  lunes: "🟦", martes: "🟩", miercoles: "🟨", jueves: "🟧", viernes: "🟥",
};

export default function VerSemanaScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSemana, deleteSemana } = usePlanificaciones();
  const [tabActivo, setTabActivo] = useState<DiaSemanaKey>("lunes");

  const semana = getSemana(id || "");

  if (!semana) {
    return (
      <ScreenContainer edges={["top","bottom","left","right"]} className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
          <Text style={{ fontSize: 56 }}>⚠️</Text>
          <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 16 }}>Semana no encontrada</Text>
          <Pressable onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtnFull, { backgroundColor: "#003366", opacity: pressed ? 0.8 : 1 }]}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const diasActivos = DIAS_SEMANA.filter(d => semana.dias[d]?.activo);

  const handleEliminar = () => {
    const confirm = () => {
      deleteSemana(semana.id);
      router.back();
    };
    if (Platform.OS === "web") {
      if (window.confirm("¿Eliminar esta planificación semanal?")) confirm();
    } else {
      Alert.alert("Eliminar semana", "¿Deseas eliminar esta planificación semanal?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: confirm },
      ]);
    }
  };

  return (
    <ScreenContainer edges={["top","bottom","left","right"]} className="flex-1">
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Text style={{ color: colors.primary, fontSize: 15 }}>{"←"}</Text>
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Planificación Semanal</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {semana.semanaInicio} — {semana.semanaFin} · {semana.docente}
            </Text>
          </View>
          <Pressable onPress={handleEliminar} style={{ padding: 8 }}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </Pressable>
        </View>

        {/* Botón exportar PDF */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ExportModal semana={semana} triggerLabel="Exportar PDF" />
        </View>

        {/* Info general */}
        <View style={[styles.infoBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>📍 {semana.institucion || "—"}</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>🎓 {semana.grado} {semana.paralelo ? `· ${semana.paralelo}` : ""}</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>📅 {semana.trimestre} trimestre</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
          {diasActivos.map(d => (
            <Pressable key={d} onPress={() => setTabActivo(d)}
              style={[styles.tab, { borderBottomColor: tabActivo === d ? "#003366" : "transparent" }]}>
              <Text style={{ fontSize: 14 }}>{DIA_EMOJI[d]}</Text>
              <Text style={[styles.tabLabel, { color: tabActivo === d ? "#003366" : colors.muted }]}>{DIA_LABEL[d]}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Contenido */}
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {(semana.dias[tabActivo]?.horas || []).map((hora, i) => {
            if (!hora.temaSeleccionado) return null;
            const plan = hora.temaSeleccionado;
            const areaInfo = hora.destreza ? AREAS_INFO[hora.destreza.area] : null;
            return (
              <View key={i} style={[styles.horaPlanCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                {/* Header hora */}
                <View style={[styles.horaPlanHeader, { backgroundColor: (areaInfo?.color || "#003366") + "12" }]}>
                  <Text style={[styles.horaPlanTitle, { color: areaInfo?.color || "#003366" }]}>
                    Hora {i + 1} — {hora.codigoDestreza}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{plan.titulo}</Text>
                </View>

                {/* Objetivo */}
                {plan.objetivoClase && (
                  <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#003366", marginBottom: 3 }}>🎯 OBJETIVO</Text>
                    <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 18 }}>{plan.objetivoClase}</Text>
                  </View>
                )}

                {/* ERCA */}
                {plan.estructura && (
                  <View style={{ padding: 12 }}>
                    {[
                      { key: "experiencia", label: "EXPERIENCIA", emoji: "💡", color: "#2980B9" },
                      { key: "reflexion", label: "REFLEXIÓN", emoji: "🤔", color: "#8E44AD" },
                      { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", emoji: "📚", color: "#27AE60" },
                      { key: "aplicacion", label: "APLICACIÓN", emoji: "✅", color: "#E67E22" },
                    ].map(({ key, label, emoji, color }) => {
                      const fase = (plan.estructura as any)[key];
                      if (!fase) return null;
                      return (
                        <View key={key} style={[styles.faseSection, { borderLeftColor: color }]}>
                          <View style={styles.faseHeaderRow}>
                            <Text style={{ fontSize: 14 }}>{emoji}</Text>
                            <Text style={[styles.faseName, { color }]}>{label}</Text>
                            <Text style={{ fontSize: 12, color: colors.muted }}>{fase.duracion}</Text>
                          </View>
                          {(fase.actividades || []).map((act: string, idx: number) => {
                            const dua: DUAActividad = fase.duaActividades?.[idx] || { representacion: false, accionExpresion: false, implicacion: false };
                            return (
                              <View key={idx} style={styles.actRow}>
                                <View style={[styles.actNum, { backgroundColor: color + "18" }]}>
                                  <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{idx + 1}</Text>
                                </View>
                                <Text style={{ flex: 1, fontSize: 12, color: colors.foreground, lineHeight: 17, marginLeft: 8 }}>{act}</Text>
                                <View style={styles.duaSquaresRow}>
                                  <View style={[styles.duaMini, { backgroundColor: dua.representacion ? DUA_ROSADO : DUA_ROSADO + "35" }]} />
                                  <View style={[styles.duaMini, { backgroundColor: dua.accionExpresion ? DUA_AZUL : DUA_AZUL + "35" }]} />
                                  <View style={[styles.duaMini, { backgroundColor: dua.implicacion ? DUA_VERDE : DUA_VERDE + "35" }]} />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Recursos */}
                {plan.recursos?.length > 0 && (
                  <View style={[styles.planFooterSection, { borderTopColor: colors.border }]}>
                    <Text style={styles.planFooterLabel}>📦 Recursos</Text>
                    <Text style={{ fontSize: 12, color: colors.foreground }}>{plan.recursos.join(" · ")}</Text>
                  </View>
                )}

                {/* Evaluación */}
                {plan.evaluacionFormativa && (
                  <View style={[styles.planFooterSection, { borderTopColor: colors.border }]}>
                    <Text style={styles.planFooterLabel}>📊 Evaluación formativa</Text>
                    <Text style={{ fontSize: 12, color: colors.foreground }}>{plan.evaluacionFormativa}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backBtnFull: { marginTop: 20, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  infoBar: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1 },
  tabsRow: { borderBottomWidth: 1 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2 },
  tabLabel: { fontSize: 13, fontWeight: "600", marginTop: 2 },
  horaPlanCard: { margin: 16, marginBottom: 0, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  horaPlanHeader: { padding: 12 },
  horaPlanTitle: { fontSize: 14, fontWeight: "700" },
  faseSection: { borderLeftWidth: 3, paddingLeft: 10, marginBottom: 12 },
  faseHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  faseName: { fontSize: 12, fontWeight: "700", flex: 1 },
  actRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  actNum: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  duaSquaresRow: { flexDirection: "row", gap: 3, marginLeft: 6 },
  duaMini: { width: 11, height: 11, borderRadius: 2 },
  planFooterSection: { padding: 12, borderTopWidth: 1 },
  planFooterLabel: { fontSize: 11, fontWeight: "700", color: "#003366", marginBottom: 3 },
});
