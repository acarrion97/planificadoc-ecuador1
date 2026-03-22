import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO, obtenerNombreBloque, SUBNIVEL_NAMES } from "@/data";
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
  backBtnFull: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
});
