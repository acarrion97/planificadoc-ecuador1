import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO, obtenerNombreBloque, SUBNIVEL_NAMES, TemaSugerido } from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function VerPlanScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlanificacion } = usePlanificaciones();

  const plan = getPlanificacion(id || "");

  if (!plan) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <MaterialIcons name="error-outline" size={56} color={colors.error} />
          <Text className="text-lg font-semibold text-foreground mt-4">
            Planificación no encontrada
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtnFull,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Volver
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const areaInfo = AREAS_INFO[plan.destreza.area];
  const tema = plan.temaSeleccionado;

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View className="px-5 pt-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
              Atrás
            </Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground mt-3">
            Planificación Microcurricular
          </Text>
        </View>

        {/* Destreza badge */}
        <View className="px-5 mt-4">
          <View
            style={[
              styles.destrezaBanner,
              { backgroundColor: areaInfo?.color + "10", borderColor: areaInfo?.color + "30" },
            ]}
          >
            <Text style={[styles.destrezaCode, { color: areaInfo?.color }]}>
              {plan.destreza.codigo}
            </Text>
            <Text style={{ color: areaInfo?.color, fontSize: 14, fontWeight: "600" }}>
              {areaInfo?.name}
            </Text>
          </View>
        </View>

        {/* Tema seleccionado */}
        {tema && (
          <View className="px-5 mt-3">
            <View
              style={[
                styles.temaBadge,
                { backgroundColor: areaInfo?.color + "12", borderColor: areaInfo?.color + "35" },
              ]}
            >
              <MaterialIcons name="auto-awesome" size={18} color={areaInfo?.color} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: areaInfo?.color, fontSize: 12, fontWeight: "600" }}>
                  Tema de la clase
                </Text>
                <Text className="text-base font-bold text-foreground mt-1">
                  {tema.titulo}
                </Text>
                <Text className="text-sm text-muted mt-1">
                  {tema.descripcionBreve}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Datos informativos */}
        <SectionCard title="Datos Informativos" icon="info" colors={colors}>
          <DataRow label="Institución" value={plan.institucion || "—"} colors={colors} />
          <DataRow label="Docente" value={plan.docente} colors={colors} />
          <DataRow label="Grado / Curso" value={plan.grado} colors={colors} />
          <DataRow label="Asignatura" value={plan.asignatura} colors={colors} />
          <DataRow label="Fecha" value={plan.fecha} colors={colors} />
          <DataRow label="Períodos" value={plan.periodos} colors={colors} />
        </SectionCard>

        {/* Destreza */}
        <SectionCard title="Destreza con Criterio de Desempeño" icon="star" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            <Text style={{ fontWeight: "700" }}>{plan.destreza.codigo}: </Text>
            {plan.destreza.descripcion}
          </Text>
          <View style={[styles.metaRow, { marginTop: 10 }]}>
            <Text className="text-xs text-muted">
              Subnivel: {SUBNIVEL_NAMES[plan.destreza.subnivel]} | Bloque: {obtenerNombreBloque(plan.destreza.area, plan.destreza.bloque)}
            </Text>
          </View>
        </SectionCard>

        {/* Objetivo */}
        <SectionCard title="Objetivo de Aprendizaje" icon="flag" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.objetivoAprendizaje}
          </Text>
        </SectionCard>

        {/* Estructura de la Clase ERCA */}
        {tema && (
          <View className="px-5 mt-4">
            <View style={styles.sectionHeader}>
              <MaterialIcons name="school" size={18} color={colors.primary} />
              <Text
                className="text-base font-semibold text-foreground"
                style={{ marginLeft: 8 }}
              >
                Estructura de la Clase (ERCA)
              </Text>
            </View>

            <FaseCardView
              label="Anticipación"
              fase={tema.estructura.anticipacion}
              color="#F59E0B"
              icon="lightbulb"
              colors={colors}
            />
            <FaseCardView
              label="Construcción del Conocimiento"
              fase={tema.estructura.construccion}
              color="#2563EB"
              icon="build"
              colors={colors}
            />
            <FaseCardView
              label="Consolidación"
              fase={tema.estructura.consolidacion}
              color="#16A34A"
              icon="check-circle"
              colors={colors}
            />
            <FaseCardView
              label="Retroalimentación"
              fase={tema.estructura.retroalimentacion}
              color="#7C3AED"
              icon="refresh"
              colors={colors}
            />
          </View>
        )}

        {/* Actividades */}
        <SectionCard title="Actividades de Aprendizaje" icon="assignment" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.actividades}
          </Text>
        </SectionCard>

        {/* Recursos */}
        <SectionCard title="Recursos Didácticos" icon="inventory" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.recursos}
          </Text>
        </SectionCard>

        {/* Evaluación */}
        <SectionCard title="Indicadores de Evaluación" icon="assessment" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.evaluacion}
          </Text>
        </SectionCard>

        {/* Técnicas */}
        <SectionCard title="Técnicas e Instrumentos" icon="checklist" colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.tecnicasInstrumentos}
          </Text>
        </SectionCard>

        {/* Observaciones */}
        {plan.observaciones ? (
          <SectionCard title="Observaciones" icon="note" colors={colors}>
            <Text className="text-sm text-foreground leading-5">
              {plan.observaciones}
            </Text>
          </SectionCard>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ==========================================
// COMPONENTE: Tarjeta de fase ERCA
// ==========================================
function FaseCardView({
  label,
  fase,
  color,
  icon,
  colors,
}: {
  label: string;
  fase: { titulo: string; duracion: string; actividades: string[] };
  color: string;
  icon: string;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.faseCard,
        { borderLeftColor: color, backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.faseCardHeader}>
        <MaterialIcons name={icon as any} size={18} color={color} />
        <Text style={[styles.faseCardTitle, { color }]}>
          {label}
        </Text>
        <View style={[styles.durationBadge, { backgroundColor: color + "18" }]}>
          <MaterialIcons name="schedule" size={12} color={color} />
          <Text style={{ color, fontSize: 11, fontWeight: "600", marginLeft: 3 }}>
            {fase.duracion}
          </Text>
        </View>
      </View>
      {fase.actividades.map((act, idx) => (
        <View key={idx} style={styles.faseActRow}>
          <View style={[styles.faseActNum, { backgroundColor: color + "15" }]}>
            <Text style={{ color, fontSize: 11, fontWeight: "700" }}>
              {idx + 1}
            </Text>
          </View>
          <Text className="text-sm text-foreground flex-1 leading-5" style={{ marginLeft: 8 }}>
            {act}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SectionCard({
  title,
  icon,
  colors,
  children,
}: {
  title: string;
  icon: string;
  colors: any;
  children: React.ReactNode;
}) {
  return (
    <View className="px-5 mt-4">
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon as any} size={18} color={colors.primary} />
        <Text
          className="text-base font-semibold text-foreground"
          style={{ marginLeft: 8 }}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.sectionBody,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function DataRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.dataRow}>
      <Text className="text-sm text-muted" style={{ width: 110 }}>
        {label}:
      </Text>
      <Text className="text-sm font-medium text-foreground flex-1">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  destrezaBanner: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  destrezaCode: {
    fontSize: 22,
    fontWeight: "800",
  },
  temaBadge: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionBody: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Fase cards
  faseCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    marginTop: 10,
  },
  faseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  faseCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  faseActRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  faseActNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnFull: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
});
