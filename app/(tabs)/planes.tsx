import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useMisPlanes, type PlanGestion } from "@/hooks/use-mis-planes";
import { filtrarPlanes, formatoFecha, type FiltroPlanes } from "@/lib/mis-planes";

/**
 * Mis planes — solo gestión (fase 4, spec `mis-planes-gestion`).
 *
 * Sin creación: los 6 botones de creación y las secciones de módulos se
 * retiraron; la creación vive en `/crear`. Esta pantalla lista TODOS los
 * tipos de plan en una sola lista (design D10) con sus filtros derivados
 * del estado existente (D5) y las acciones Continuar, Editar (solo donde
 * hay reanudación), Duplicar y Eliminar.
 */

const FILTROS: { id: FiltroPlanes; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "recientes", label: "Recientes" },
  { id: "progreso", label: "En progreso" },
  { id: "completados", label: "Completados" },
];

export default function PlanesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planes, cargando } = useMisPlanes();
  const [filtro, setFiltro] = useState<FiltroPlanes>("todos");

  const visibles = filtrarPlanes(planes, filtro);

  const confirmarEliminar = (plan: PlanGestion) => {
    const texto = `¿Eliminar «${plan.titulo}»? Esta acción no se puede deshacer.`;
    if (Platform.OS === "web") {
      if (confirm(texto)) void plan.eliminar();
    } else {
      Alert.alert("Eliminar plan", texto, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => void plan.eliminar() },
      ]);
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Mis Planes</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
            {planes.length === 1 ? "1 documento" : `${planes.length} documentos`}
          </Text>
        </View>

        {/* ── Filtros (design D5) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosRow}
        >
          {FILTROS.map((f) => {
            const activo = filtro === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFiltro(f.id)}
                style={({ pressed }) => [
                  styles.filtro,
                  {
                    backgroundColor: activo ? colors.brand : colors.surface,
                    borderColor: activo ? colors.brand : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: activo ? "#FFFFFF" : colors.foreground,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Contenido ── */}
        {cargando && planes.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 48 }} />
        ) : planes.length === 0 ? (
          /* Estado vacío: invita a crear desde el hub (tarea 4.9) */
          <View style={styles.vacio}>
            <Text style={{ fontSize: 44 }}>📄</Text>
            <Text style={[styles.vacioTitulo, { color: colors.foreground }]}>
              Aún no tienes planes
            </Text>
            <Text style={[styles.vacioTexto, { color: colors.muted }]}>
              Crea tu primera planificación desde el catálogo: plan diario, semanal, PCA, CNC,
              evaluaciones y más.
            </Text>
            <Pressable
              onPress={() => router.push("/crear" as any)}
              style={({ pressed }) => [
                styles.btnCrear,
                { backgroundColor: colors.brand, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.btnCrearTexto}>＋ Nueva planificación</Text>
            </Pressable>
          </View>
        ) : visibles.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text style={[styles.vacioTexto, { color: colors.muted, marginTop: 8 }]}>
              Ningún plan coincide con «{FILTROS.find((f) => f.id === filtro)?.label}».
            </Text>
          </View>
        ) : (
          visibles.map((plan) => (
            <PlanCard key={plan.key} plan={plan} onEliminar={confirmarEliminar} />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

/** Tarjeta de gestión de un plan: identificación, estado, fecha y acciones. */
function PlanCard({
  plan,
  onEliminar,
}: {
  plan: PlanGestion;
  onEliminar: (plan: PlanGestion) => void;
}) {
  const colors = useColors();
  const router = useRouter();

  const esProgreso = plan.estado?.categoria === "progreso";
  const colorEstado = esProgreso ? colors.warning : colors.success;
  const fecha = formatoFecha(plan.actualizadoEn);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Identificación: tipo · estado · fecha de actualización */}
      <View style={styles.cardTop}>
        <View
          style={[styles.chip, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <Text style={[styles.chipTexto, { color: colors.foreground }]}>{plan.tipoLabel}</Text>
        </View>
        {plan.estado && (
          <View
            style={[
              styles.chip,
              {
                backgroundColor: colorEstado + "1A",
                borderColor: colorEstado + "55",
              },
            ]}
          >
            <Text style={[styles.chipTexto, { color: colorEstado }]}>{plan.estado.label}</Text>
          </View>
        )}
        <Text style={[styles.fecha, { color: colors.muted }]}>
          {fecha ? `Act. ${fecha}` : ""}
        </Text>
      </View>

      <Text style={[styles.titulo, { color: colors.foreground }]} numberOfLines={1}>
        {plan.titulo}
      </Text>
      {plan.detalle ? (
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
          {plan.detalle}
        </Text>
      ) : null}

      {/* Acciones de gestión */}
      <View style={styles.acciones}>
        <Pressable
          onPress={() => onEliminar(plan)}
          style={({ pressed }) => [
            styles.btnAccion,
            {
              borderColor: colors.border,
              backgroundColor: colors.background,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.btnAccionTexto, { color: colors.error }]}>Eliminar</Text>
        </Pressable>

        <Pressable
          onPress={() => void plan.duplicar()}
          style={({ pressed }) => [
            styles.btnAccion,
            {
              borderColor: colors.border,
              backgroundColor: colors.background,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.btnAccionTexto, { color: colors.foreground }]}>Duplicar</Text>
        </Pressable>

        {/* Editar solo donde el flujo admite reanudación (spec) */}
        {plan.rutaEditar ? (
          <Pressable
            onPress={() => router.push(plan.rutaEditar as any)}
            style={({ pressed }) => [
              styles.btnAccion,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.btnAccionTexto, { color: colors.foreground }]}>Editar</Text>
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => router.push(plan.rutaContinuar as any)}
          style={({ pressed }) => [
            styles.btnContinuar,
            { backgroundColor: colors.brand, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.btnAccionTexto, { color: "#FFFFFF" }]}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtrosRow: { paddingHorizontal: 20, paddingVertical: 6, gap: 8 },
  filtro: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  card: { marginHorizontal: 20, marginTop: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  chipTexto: { fontSize: 11, fontWeight: "700" },
  fecha: { fontSize: 11, marginLeft: "auto" },
  titulo: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  acciones: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  btnAccion: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  btnAccionTexto: { fontSize: 13, fontWeight: "600" },
  btnContinuar: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  vacio: { alignItems: "center", paddingHorizontal: 32, paddingVertical: 40 },
  vacioTitulo: { fontSize: 17, fontWeight: "700", marginTop: 10 },
  vacioTexto: { fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 19 },
  btnCrear: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnCrearTexto: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
