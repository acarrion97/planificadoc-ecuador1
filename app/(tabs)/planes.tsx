import { useState, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewProps,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useMisPlanes, type PlanGestion } from "@/hooks/use-mis-planes";
import {
  filtrarPlanes,
  formatoFecha,
  type FiltroPlanes,
  type TipoPlan,
} from "@/lib/mis-planes";
import { AREAS_INFO } from "@/data";
import { obtenerIconosDestreza } from "@/src/data/iconosPorDestreza";
import { ICONOS_DCD_BASE64 } from "@/lib/iconos-base64";

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

/** Icono de respaldo por tipo, cuando no hay DCD ni área que mostrar. */
const ICONO_TIPO: Record<TipoPlan, string> = {
  diario: "book-open-page-variant",
  semanal: "calendar-week-outline",
  pca: "calendar-month-outline",
  pct: "calendar-month-outline",
  cnc: "target",
  bt: "hammer-wrench",
  cxc: "school-outline",
  proyecto: "lightbulb-on-outline",
  evaluacion: "clipboard-check-outline",
};

export default function PlanesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planes, cargando } = useMisPlanes();
  const [filtro, setFiltro] = useState<FiltroPlanes>("todos");

  // Grid de tarjetas: ancho real medido con onLayout (sidebar ya descontado);
  // hasta el primer layout se estima con el ancho de la ventana.
  const { width: windowWidth } = useWindowDimensions();
  const [anchoGrilla, setAnchoGrilla] = useState(0);
  const anchoContenido = anchoGrilla || windowWidth - 40;
  const columnas = anchoContenido >= 940 ? 3 : anchoContenido >= 580 ? 2 : 1;
  const anchoUtil = Math.max(anchoContenido - 40, 0); // padding horizontal 20 + 20
  const anchoTarjeta =
    columnas === 1
      ? ("100%" as const)
      : Math.floor((anchoUtil - 12 * (columnas - 1)) / columnas);

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
    <ScreenContainer
      className="flex-1"
      onLayout={(e) => setAnchoGrilla(e.nativeEvent.layout.width)}
    >
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
          <View style={styles.gridPlanes}>
            {visibles.map((plan, index) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                index={index}
                columnas={columnas}
                ancho={anchoTarjeta}
                onEliminar={confirmarEliminar}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

/** Tarjeta de gestión de un plan: identificación, estado, fecha y acciones. */
function PlanCard({
  plan,
  index,
  columnas,
  ancho,
  onEliminar,
}: {
  plan: PlanGestion;
  index: number;
  columnas: number;
  ancho: number | "100%";
  onEliminar: (plan: PlanGestion) => void;
}) {
  const colors = useColors();
  const router = useRouter();

  const esProgreso = plan.estado?.categoria === "progreso";
  const colorEstado = esProgreso ? colors.warning : colors.success;
  const fecha = formatoFecha(plan.actualizadoEn);
  const ultimaDeFila = columnas === 1 || (index + 1) % columnas === 0;

  return (
    <View
      style={[
        styles.card,
        {
          width: ancho,
          marginRight: ultimaDeFila ? 0 : 12,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Iconos (DCD del plan diario / emoji de materia) · tipo · estado · fecha */}
      <View style={styles.cardTop}>
        <IconosPlan plan={plan} />
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

      {/* Acciones de gestión: icono + tooltip al pasar el mouse (web) */}
      <View style={styles.acciones}>
        <BotonAccion
          icono="delete-outline"
          etiqueta="Eliminar: borrar este plan"
          color={colors.error}
          onPress={() => onEliminar(plan)}
        />
        <BotonAccion
          icono="content-copy"
          etiqueta="Duplicar: crear una copia de este plan"
          color={colors.foreground}
          onPress={() => void plan.duplicar()}
        />
        {/* Editar solo donde el flujo admite reanudación (spec) */}
        {plan.rutaEditar ? (
          <BotonAccion
            icono="pencil-outline"
            etiqueta="Editar: reanudar el formulario"
            color={colors.foreground}
            onPress={() => router.push(plan.rutaEditar as any)}
          />
        ) : null}

        <View style={{ flex: 1 }} />

        <BotonAccion
          icono="play"
          etiqueta="Continuar: abrir el plan donde lo dejaste"
          color="#FFFFFF"
          principal
          onPress={() => router.push(plan.rutaContinuar as any)}
        />
      </View>
    </View>
  );
}

/**
 * Iconos de la tarjeta:
 *  - plan diario → íconos de competencias/inserciones DCD, los mismos que
 *    incrustan los informes de planificación (`iconosDcdRuns`);
 *  - materias → el emoji de `AREAS_INFO`, idéntico al de Explorar;
 *  - respaldo → icono del tipo de plan.
 */
function IconosPlan({ plan }: { plan: PlanGestion }) {
  const colors = useColors();

  if (plan.tipo === "diario" && plan.dcdCodigo) {
    const uris = obtenerIconosDestreza(plan.dcdCodigo)
      .map((nombre) => ICONOS_DCD_BASE64[nombre])
      .filter((src): src is string => Boolean(src));
    if (uris.length > 0) {
      return (
        <View style={{ flexDirection: "row", gap: 4 }}>
          {uris.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.iconoDcd} />
          ))}
        </View>
      );
    }
  }

  const info = plan.areaCodigo ? AREAS_INFO[plan.areaCodigo] : undefined;
  if (info) {
    return <Text style={styles.iconoArea}>{info.emoji}</Text>;
  }

  return (
    <MaterialCommunityIcons
      name={ICONO_TIPO[plan.tipo] as ComponentProps<typeof MaterialCommunityIcons>["name"]}
      size={20}
      color={colors.muted}
    />
  );
}

/**
 * Botón de acción con icono y tooltip que explica su función al pasar el
 * mouse (web). En nativo no hay hover: el `accessibilityLabel` cubre el rol.
 */
function BotonAccion({
  icono,
  etiqueta,
  color,
  principal = false,
  onPress,
}: {
  icono: ComponentProps<typeof MaterialCommunityIcons>["name"];
  etiqueta: string;
  color: string;
  principal?: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const [hover, setHover] = useState(false);

  // react-native-web reenvía onMouseEnter/onMouseLeave al DOM (en nativo se
  // ignoran), pero los tipos de react-native no los exponen: hence la aserción.
  const hoverWeb = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  } as unknown as ViewProps;

  return (
    <View style={styles.botonWrap} {...hoverWeb}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={etiqueta}
        style={({ pressed }) => [
          styles.botonIcono,
          principal
            ? { backgroundColor: colors.brand, borderColor: colors.brand }
            : { borderColor: colors.border, backgroundColor: colors.background },
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <MaterialCommunityIcons name={icono} size={18} color={color} />
      </Pressable>
      {hover ? (
        <View style={styles.tooltip} pointerEvents="none">
          <View style={[styles.tooltipCaja, { backgroundColor: colors.foreground }]}>
            <Text style={[styles.tooltipTexto, { color: colors.background }]}>{etiqueta}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  filtrosRow: { paddingHorizontal: 20, paddingVertical: 6, gap: 8 },
  filtro: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  gridPlanes: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20 },
  card: { marginTop: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  iconoDcd: { width: 20, height: 20, borderRadius: 10 },
  iconoArea: { fontSize: 20, lineHeight: 24 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  chipTexto: { fontSize: 11, fontWeight: "700" },
  fecha: { fontSize: 11, marginLeft: "auto" },
  titulo: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  acciones: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  botonWrap: { position: "relative" },
  botonIcono: {
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    position: "absolute",
    bottom: 40,
    left: -24,
    right: -24,
    alignItems: "center",
    zIndex: 20,
  },
  tooltipCaja: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tooltipTexto: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  vacio: { alignItems: "center", paddingHorizontal: 32, paddingVertical: 40 },
  vacioTitulo: { fontSize: 17, fontWeight: "700", marginTop: 10 },
  vacioTexto: { fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 19 },
  btnCrear: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnCrearTexto: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
