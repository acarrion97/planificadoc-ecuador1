import { View, Text, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO } from "@/data";
import type { DUAActividad, AdaptacionCurricular, AdaptacionPedagogicaSugerida } from "@/data/types";
import { TIPOS_NEE_INFO, GRADO_ADAPTACION_INFO } from "@/data/types";
import { useState } from "react";
import { ExportModal } from "@/components/ExportModal";

const DUA_ROSADO = "#EC4899";
const DUA_AZUL   = "#1E3A5F";
const DUA_VERDE  = "#22C55E";

const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
type DiaSemanaKey = typeof DIAS_SEMANA[number];
type TabActivo = DiaSemanaKey | "adaptaciones";
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
  const primerDiaConContenido = DIAS_SEMANA.find(d =>
    semana.dias[d]?.activo && semana.dias[d].horas.some(h => h.temaSeleccionado)
  ) ?? "lunes";
  const [tabActivo, setTabActivo] = useState<TabActivo>(primerDiaConContenido);

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

  const diasActivos = DIAS_SEMANA.filter(d =>
    semana.dias[d]?.activo && semana.dias[d].horas.some(h => h.temaSeleccionado)
  );
  const adaptacionesVisibles = (semana.adaptacionesCurriculares || []).filter(a => a.incluirEnExportacion);
  const tieneAdaptaciones = adaptacionesVisibles.length > 0;

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
          {tieneAdaptaciones && (
            <Pressable onPress={() => setTabActivo("adaptaciones")}
              style={[styles.tab, { borderBottomColor: tabActivo === "adaptaciones" ? "#7B2D8B" : "transparent" }]}>
              <Text style={{ fontSize: 14 }}>♿</Text>
              <Text style={[styles.tabLabel, { color: tabActivo === "adaptaciones" ? "#7B2D8B" : colors.muted }]}>ADAPT.</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Contenido adaptaciones */}
        {tabActivo === "adaptaciones" && (
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={[stylesAdap2.adaptHeader, { backgroundColor: "#4A1942" }]}>
              <Text style={stylesAdap2.adaptHeaderTitle}>♿ ADAPTACIONES CURRICULARES</Text>
              <Text style={stylesAdap2.adaptHeaderSub}>{adaptacionesVisibles.length} estudiante{adaptacionesVisibles.length !== 1 ? "s" : ""} con NEE</Text>
            </View>
            {adaptacionesVisibles.map((adap, idx) => (
              <AdaptacionCard key={adap.id || idx} adap={adap} colors={colors} />
            ))}
          </ScrollView>
        )}

        {/* Contenido días */}
        {tabActivo !== "adaptaciones" && (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {!(semana.dias[tabActivo as DiaSemanaKey]?.horas || []).some(h => h.temaSeleccionado) && (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ fontSize: 36, marginBottom: 12 }}>📋</Text>
              <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center" }}>
                No hay planificación generada para este día
              </Text>
            </View>
          )}
          {(semana.dias[tabActivo as DiaSemanaKey]?.horas || []).map((hora, i) => {
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
        )}
      </View>
    </ScreenContainer>
  );
}

// ─── Componente de tarjeta de adaptación ───────────────────────────────────

function AdaptacionCard({ adap, colors }: { adap: AdaptacionCurricular; colors: ReturnType<typeof useColors> }) {
  const neeInfo = TIPOS_NEE_INFO[adap.tipoNecesidad];
  const gradoInfo = GRADO_ADAPTACION_INFO[adap.gradoAdaptacion];

  return (
    <View style={[stylesAdap.card, { borderColor: "#7B2D8B33", backgroundColor: colors.surface }]}>
      {/* Cabecera estudiante */}
      <View style={[stylesAdap.cardHead, { backgroundColor: "#4A1942" }]}>
        <Text style={stylesAdap.cardCode}>
          {neeInfo?.emoji ?? "♿"} {adap.codigoEstudiante}
          {adap.nombreEstudiante ? ` · ${adap.nombreEstudiante}` : ""}
        </Text>
        <View style={[stylesAdap.gradoBadge, { backgroundColor: gradoInfo?.color ?? "#7B2D8B" }]}>
          <Text style={stylesAdap.gradoBadgeText}>Grado {adap.gradoAdaptacion}</Text>
        </View>
      </View>

      {/* NEE + categoría */}
      <View style={[stylesAdap.row, { borderBottomColor: colors.border }]}>
        <InfoChip label="Tipo NEE" value={neeInfo?.nombre ?? adap.tipoNecesidad} />
        <InfoChip label="Categoría" value={adap.categoriaNecesidad} />
      </View>

      {/* Descripción pedagógica */}
      {adap.descripcionNecesidad ? (
        <View style={[stylesAdap.section, { borderBottomColor: colors.border }]}>
          <Text style={[stylesAdap.sectionLabel, { color: "#7B2D8B" }]}>📋 Necesidad pedagógica</Text>
          <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{adap.descripcionNecesidad}</Text>
        </View>
      ) : null}

      {/* Destreza */}
      {adap.codigoDestreza ? (
        <View style={[stylesAdap.section, { borderBottomColor: colors.border }]}>
          <Text style={[stylesAdap.sectionLabel, { color: "#003366" }]}>🎯 Destreza</Text>
          <Text style={[stylesAdap.sectionCode, { color: "#003366" }]}>{adap.codigoDestreza}</Text>
          {adap.descripcionDestreza ? <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{adap.descripcionDestreza}</Text> : null}
          {adap.destrezaAdaptada ? (
            <View style={stylesAdap.adaptedBox}>
              <Text style={stylesAdap.adaptedLabel}>Destreza adaptada:</Text>
              <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{adap.destrezaAdaptada}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Adaptaciones de acceso */}
      {adap.adaptacionesAcceso?.length > 0 && (
        <AdapList label="🔓 Adaptaciones de Acceso" items={adap.adaptacionesAcceso} color="#1A56DB" colors={colors} />
      )}

      {/* Adaptaciones de proceso — grado 2 y 3 */}
      {adap.adaptacionesProceso?.length > 0 && (
        <AdapList label="⚙️ Adaptaciones de Proceso" items={adap.adaptacionesProceso} color="#D97706" colors={colors} />
      )}

      {/* Adaptaciones de resultado — grado 3 */}
      {adap.adaptacionesResultado?.length > 0 && (
        <AdapList label="📊 Adaptaciones de Resultado" items={adap.adaptacionesResultado} color="#059669" colors={colors} />
      )}

      {/* Recursos específicos */}
      {adap.recursosEspecificos?.length > 0 && (
        <View style={[stylesAdap.section, { borderBottomColor: colors.border }]}>
          <Text style={[stylesAdap.sectionLabel, { color: "#7B2D8B" }]}>📦 Recursos específicos</Text>
          {adap.recursosEspecificos.map((r, i) => (
            <Text key={i} style={[stylesAdap.bullet, { color: colors.foreground }]}>• {r}</Text>
          ))}
        </View>
      )}

      {/* Metodologías sugeridas */}
      {adap.metodologiasSugeridas?.length > 0 && (
        <View style={[stylesAdap.section, { borderBottomColor: colors.border }]}>
          <Text style={[stylesAdap.sectionLabel, { color: "#7B2D8B" }]}>🧠 Metodologías sugeridas</Text>
          {adap.metodologiasSugeridas.map((m, i) => (
            <Text key={i} style={[stylesAdap.bullet, { color: colors.foreground }]}>• {m}</Text>
          ))}
        </View>
      )}

      {/* Seguimiento / observaciones */}
      {(adap.seguimiento || adap.observaciones) ? (
        <View style={stylesAdap.section}>
          {adap.seguimiento ? (
            <>
              <Text style={[stylesAdap.sectionLabel, { color: "#7B2D8B" }]}>🔍 Seguimiento</Text>
              <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{adap.seguimiento}</Text>
            </>
          ) : null}
          {adap.observaciones ? (
            <>
              <Text style={[stylesAdap.sectionLabel, { color: "#7B2D8B", marginTop: 6 }]}>💬 Observaciones</Text>
              <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{adap.observaciones}</Text>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={stylesAdap.chip}>
      <Text style={stylesAdap.chipLabel}>{label}</Text>
      <Text style={stylesAdap.chipValue}>{value}</Text>
    </View>
  );
}

function AdapList({ label, items, color, colors }: {
  label: string;
  items: AdaptacionPedagogicaSugerida[];
  color: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[stylesAdap.section, { borderBottomColor: colors.border, borderLeftWidth: 3, borderLeftColor: color, paddingLeft: 10 }]}>
      <Text style={[stylesAdap.sectionLabel, { color }]}>{label}</Text>
      {items.map((item, i) => (
        <View key={i} style={stylesAdap.adapItem}>
          <Text style={[stylesAdap.adapItemType, { color }]}>{item.categoria}</Text>
          <Text style={[stylesAdap.sectionText, { color: colors.foreground }]}>{item.descripcion}</Text>
          {item.estrategias?.map((e, j) => (
            <Text key={j} style={[stylesAdap.bullet, { color: colors.muted }]}>↳ {e}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const stylesAdap = StyleSheet.create({
  card: { margin: 16, marginBottom: 0, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },
  cardCode: { color: "#fff", fontSize: 14, fontWeight: "700", flex: 1 },
  gradoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradoBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, padding: 10, borderBottomWidth: 1, flexWrap: "wrap" },
  chip: { backgroundColor: "#F9F5FF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, minWidth: 100 },
  chipLabel: { fontSize: 10, fontWeight: "700", color: "#7B2D8B", marginBottom: 1 },
  chipValue: { fontSize: 12, color: "#4A1942" },
  section: { padding: 12, borderBottomWidth: 1 },
  sectionLabel: { fontSize: 11, fontWeight: "700", marginBottom: 4 },
  sectionCode: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  sectionText: { fontSize: 12, lineHeight: 17 },
  adaptedBox: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: "#7B2D8B22" },
  adaptedLabel: { fontSize: 10, fontWeight: "700", color: "#7B2D8B", marginBottom: 2 },
  bullet: { fontSize: 12, lineHeight: 18, marginLeft: 4 },
  adapItem: { marginTop: 4 },
  adapItemType: { fontSize: 10, fontWeight: "700", marginBottom: 1 },
});

const stylesAdap2 = StyleSheet.create({
  adaptHeader: { margin: 16, marginBottom: 8, padding: 14, borderRadius: 12 },
  adaptHeaderTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  adaptHeaderSub: { color: "#E9D5FF", fontSize: 12, marginTop: 2 },
});

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
