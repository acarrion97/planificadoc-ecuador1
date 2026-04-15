import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO, obtenerNombreBloque, SUBNIVEL_NAMES, TemaSugerido } from "@/data";
import { useExportPdf } from "@/hooks/use-export-pdf";

export default function VerPlanScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlanificacion } = usePlanificaciones();
  const { exportarPDF, isExporting } = useExportPdf();

  const plan = getPlanificacion(id || "");

  if (!plan) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <Text style={{ fontSize: 56 }}>{"\u26A0\uFE0F"}</Text>
          <Text className="text-lg font-semibold text-foreground mt-4">
            Planificaci{"ó"}n no encontrada
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
            <Text style={{ fontSize: 18 }}>{"\u2190"}</Text>
            <Text style={{ color: colors.primary, fontSize: 16, marginLeft: 6 }}>
              Atr{"á"}s
            </Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground mt-3">
            Planificaci{"ó"}n Microcurricular
          </Text>
        </View>

        {/* Botón Exportar PDF */}
        <View className="px-5 mt-3">
          <Pressable
            onPress={() => exportarPDF(plan)}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportButton,
              { backgroundColor: "#003366", opacity: pressed ? 0.8 : isExporting ? 0.6 : 1 },
            ]}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 18 }}>{"\uD83D\uDCC4"}</Text>
            )}
            <Text style={styles.exportButtonText}>
              {isExporting ? "Generando PDF..." : "Exportar PDF"}
            </Text>
          </Pressable>
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
              <Text style={{ fontSize: 18 }}>{"\u2728"}</Text>
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
        <SectionCard title="Datos Informativos" emoji={"\u2139\uFE0F"} colors={colors}>
          <DataRow label="Institución" value={plan.institucion || "\u2014"} colors={colors} />
          <DataRow label="Docente" value={plan.docente} colors={colors} />
          <DataRow label="Grado / Curso" value={plan.grado} colors={colors} />
          <DataRow label="Asignatura" value={plan.asignatura} colors={colors} />
          <DataRow label="Fecha" value={plan.fecha} colors={colors} />
          <DataRow label="Períodos" value={plan.periodos} colors={colors} />
        </SectionCard>

        {/* Destreza */}
        <SectionCard title="Destreza con Criterio de Desempeño" emoji={"\u2B50"} colors={colors}>
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
        <SectionCard title="Objetivo de Aprendizaje" emoji={"\uD83C\uDFAF"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.objetivoAprendizaje}
          </Text>
        </SectionCard>

        {/* Estructura de la Clase - 3 fases */}
        {tema && (
          <View className="px-5 mt-4">
            <View style={styles.sectionHeader}>
              <Text style={{ fontSize: 16 }}>{"\uD83C\uDFEB"}</Text>
              <Text
                className="text-base font-semibold text-foreground"
                style={{ marginLeft: 8 }}
              >
                Estructura de la Clase (45 min)
              </Text>
            </View>

            <FaseCardView
              label="Anticipación"
              fase={tema.estructura.anticipacion}
              color="#F59E0B"
              emoji={"\uD83D\uDCA1"}
              colors={colors}
            />
            <FaseCardView
              label="Desarrollo"
              fase={tema.estructura.desarrollo}
              color="#2563EB"
              emoji={"\uD83D\uDD27"}
              colors={colors}
            />
            <FaseCardView
              label="Cierre"
              fase={tema.estructura.cierre}
              color="#16A34A"
              emoji={"\u2705"}
              colors={colors}
            />
          </View>
        )}

        {/* Actividades */}
        <SectionCard title="Actividades de Aprendizaje" emoji={"\uD83D\uDCCB"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.actividades}
          </Text>
        </SectionCard>

        {/* Recursos */}
        <SectionCard title="Recursos Didácticos" emoji={"\uD83D\uDCE6"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.recursos}
          </Text>
        </SectionCard>

        {/* Evaluacion */}
        <SectionCard title="Indicadores de Evaluación" emoji={"\uD83D\uDCCA"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.evaluacion}
          </Text>
        </SectionCard>

        {/* Tecnicas */}
        <SectionCard title="Técnicas e Instrumentos" emoji={"\u2611\uFE0F"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.tecnicasInstrumentos}
          </Text>
        </SectionCard>

        {/* DUA */}
        {plan.dua && (plan.dua.representacion || plan.dua.accionExpresion || plan.dua.implicacion) ? (
          <SectionCard title="Diseño Universal para el Aprendizaje (DUA)" emoji={"\u267F"} colors={colors}>
            {plan.dua.representacion ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#2563EB", marginBottom: 4 }}>
                  Principio 1: M{"ú"}ltiples formas de Representaci{"ó"}n
                </Text>
                <Text className="text-sm text-foreground leading-5">{plan.dua.representacion}</Text>
              </View>
            ) : null}
            {plan.dua.accionExpresion ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#16A34A", marginBottom: 4 }}>
                  Principio 2: M{"ú"}ltiples formas de Acci{"ó"}n y Expresi{"ó"}n
                </Text>
                <Text className="text-sm text-foreground leading-5">{plan.dua.accionExpresion}</Text>
              </View>
            ) : null}
            {plan.dua.implicacion ? (
              <View style={{ marginBottom: 0 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#D97706", marginBottom: 4 }}>
                  Principio 3: M{"ú"}ltiples formas de Implicaci{"ó"}n
                </Text>
                <Text className="text-sm text-foreground leading-5">{plan.dua.implicacion}</Text>
              </View>
            ) : null}
          </SectionCard>
        ) : null}

        {/* Observaciones */}
        {plan.observaciones ? (
          <SectionCard title="Observaciones" emoji={"\uD83D\uDCCC"} colors={colors}>
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
// COMPONENTE: Tarjeta de fase
// ==========================================
function FaseCardView({
  label,
  fase,
  color,
  emoji,
  colors,
}: {
  label: string;
  fase: { titulo: string; duracion: string; actividades: string[] };
  color: string;
  emoji: string;
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
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
        <Text style={[styles.faseCardTitle, { color }]}>
          {label}
        </Text>
        <View style={[styles.durationBadge, { backgroundColor: color + "18" }]}>
          <Text style={{ fontSize: 11 }}>{"\u23F0"}</Text>
          <Text style={{ color, fontSize: 11, fontWeight: "600", marginLeft: 3 }}>
            {fase.duracion}
          </Text>
        </View>
      </View>
      {fase.actividades.map((act: string, idx: number) => (
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
  emoji,
  colors,
  children,
}: {
  title: string;
  emoji: string;
  colors: any;
  children: React.ReactNode;
}) {
  return (
    <View className="px-5 mt-4">
      <View style={styles.sectionHeader}>
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
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
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
