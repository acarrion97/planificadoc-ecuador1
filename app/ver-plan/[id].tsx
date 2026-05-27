import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { AREAS_INFO, obtenerNombreBloque, SUBNIVEL_NAMES, INSERCIONES_CURRICULARES, COMPETENCIAS, METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION, ESTILOS_APRENDIZAJE } from "@/data";
import { HABILIDADES_SOCIOEMOCIONALES } from "@/data/habilidades-socioemocionales";
import { useExportPdf } from "@/hooks/use-export-pdf";
import type { FaseClase, DUAActividad } from "@/data/types";

export default function VerPlanScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlanificacion } = usePlanificaciones();
  const { exportarPDF, exportarWord, isExporting } = useExportPdf();

  const plan = getPlanificacion(id || "");

  if (!plan) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <Text style={{ fontSize: 56 }}>{"\u26A0\uFE0F"}</Text>
          <Text className="text-lg font-semibold text-foreground mt-4">
            Planificaci{"\u00f3"}n no encontrada
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
  const isEFL = plan.destreza.area === "EFL";

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
              {isEFL ? "Back" : "Atr\u00e1s"}
            </Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground mt-3">
            {isEFL
              ? "Microcurricular Lesson Plan"
              : "Planificaci\u00f3n Microcurricular de Clase"}
          </Text>
          <Text className="text-xs text-muted mt-1">2026 - 2027</Text>
        </View>

        {/* Botones Exportar */}
        <View className="px-5 mt-3" style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => exportarPDF(plan)}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportButton,
              { flex: 1, backgroundColor: "#003366", opacity: pressed ? 0.8 : isExporting ? 0.6 : 1 },
            ]}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 16 }}>{"\uD83D\uDCC4"}</Text>
            )}
            <Text style={styles.exportButtonText}>
              {isExporting ? (isEFL ? "Generating..." : "Generando...") : (isEFL ? "Export PDF" : "PDF")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => exportarWord(plan)}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportButton,
              { flex: 1, backgroundColor: "#1A56DB", opacity: pressed ? 0.8 : isExporting ? 0.6 : 1 },
            ]}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 16 }}>{"\uD83D\uDCDD"}</Text>
            )}
            <Text style={styles.exportButtonText}>
              {isEFL ? "Word" : "Word"}
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
                  {isEFL ? "Class Topic" : "Tema de la clase"}
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

        {/* SECCI\u00d3N 1: Datos informativos */}
        <SectionCard title={isEFL ? "1. General Information" : "1. Datos Informativos"} emoji={"\u2139\uFE0F"} colors={colors}>
          <DataRow label={isEFL ? "Institution" : "Instituci\u00f3n"} value={plan.institucion || "\u2014"} colors={colors} />
          <DataRow label={isEFL ? "Teacher" : "Docente"} value={plan.docente} colors={colors} />
          <DataRow label={isEFL ? "Grade / Level" : "Grado / Curso"} value={plan.grado} colors={colors} />
          <DataRow label={isEFL ? "Subject" : "Asignatura"} value={plan.asignatura || areaInfo?.name} colors={colors} />
          <DataRow label={isEFL ? "Sublevel" : "Subnivel"} value={SUBNIVEL_NAMES[plan.destreza.subnivel]} colors={colors} />
          {plan.periodoPedagogico && (
            <DataRow label={isEFL ? "Pedagogical Period" : "Per\u00edodo Pedag\u00f3gico"} value={plan.periodoPedagogico} colors={colors} />
          )}
          {plan.trimestre && (
            <DataRow label={isEFL ? "Quarter" : "Trimestre"} value={plan.trimestre} colors={colors} />
          )}
          {plan.paralelo && (
            <DataRow label={isEFL ? "Section" : "Paralelo"} value={plan.paralelo} colors={colors} />
          )}
          {plan.fechaInicio && (
            <DataRow label={isEFL ? "Start Date" : "Fecha Inicio"} value={plan.fechaInicio} colors={colors} />
          )}
          {plan.fechaFin && (
            <DataRow label={isEFL ? "End Date" : "Fecha Fin"} value={plan.fechaFin} colors={colors} />
          )}
        </SectionCard>

        {/* SECCI\u00d3N 2: Principios DUA */}
        <SectionCard title={isEFL ? "2. UDL Principles" : "2. Principios DUA"} emoji={"\u267F"} colors={colors}>
          <View style={styles.duaPrincipioRow}>
            <View style={[styles.duaSquare, { backgroundColor: "#EC4899" }]} />
            <Text className="text-xs text-foreground flex-1 ml-2">
              {isEFL ? "I. Multiple means of representation: What?" : "I. M\u00faltiples formas de representaci\u00f3n: \u00bfqu\u00e9?"}
            </Text>
          </View>
          <View style={styles.duaPrincipioRow}>
            <View style={[styles.duaSquare, { backgroundColor: "#1E3A5F" }]} />
            <Text className="text-xs text-foreground flex-1 ml-2">
              {isEFL ? "II. Multiple means of action and expression: How?" : "II. M\u00faltiples formas de acci\u00f3n y expresi\u00f3n: \u00bfC\u00f3mo?"}
            </Text>
          </View>
          <View style={styles.duaPrincipioRow}>
            <View style={[styles.duaSquare, { backgroundColor: "#22C55E" }]} />
            <Text className="text-xs text-foreground flex-1 ml-2">
              {isEFL ? "III. Multiple means of engagement: Why?" : "III. M\u00faltiples formas de implicaci\u00f3n o participaci\u00f3n: \u00bfPor qu\u00e9?"}
            </Text>
          </View>
        </SectionCard>

        {/* SECCI\u00d3N 3: Estilos de Aprendizaje con porcentajes */}
        {plan.estilosAprendizajePorcentaje && (
          <SectionCard title={isEFL ? "3. Learning Styles" : "3. Estilos de Aprendizaje"} emoji={"\uD83E\uDDE0"} colors={colors}>
            <View style={styles.estiloRow}>
              <Text style={styles.estiloLabel}>VISUAL</Text>
              <View style={[styles.estiloBar, { flex: plan.estilosAprendizajePorcentaje.visual }]}>
                <View style={[styles.estiloBarFill, { backgroundColor: "#3B82F6" }]} />
              </View>
              <Text style={styles.estiloPct}>{plan.estilosAprendizajePorcentaje.visual}%</Text>
            </View>
            <View style={styles.estiloRow}>
              <Text style={styles.estiloLabel}>AUDITIVO</Text>
              <View style={[styles.estiloBar, { flex: plan.estilosAprendizajePorcentaje.auditivo }]}>
                <View style={[styles.estiloBarFill, { backgroundColor: "#8B5CF6" }]} />
              </View>
              <Text style={styles.estiloPct}>{plan.estilosAprendizajePorcentaje.auditivo}%</Text>
            </View>
            <View style={styles.estiloRow}>
              <Text style={styles.estiloLabel}>LECTOR-ESCRITOR</Text>
              <View style={[styles.estiloBar, { flex: plan.estilosAprendizajePorcentaje.lectorEscritor }]}>
                <View style={[styles.estiloBarFill, { backgroundColor: "#F59E0B" }]} />
              </View>
              <Text style={styles.estiloPct}>{plan.estilosAprendizajePorcentaje.lectorEscritor}%</Text>
            </View>
            <View style={styles.estiloRow}>
              <Text style={styles.estiloLabel}>KINEST\u00c9SICO</Text>
              <View style={[styles.estiloBar, { flex: plan.estilosAprendizajePorcentaje.kinestesico }]}>
                <View style={[styles.estiloBarFill, { backgroundColor: "#10B981" }]} />
              </View>
              <Text style={styles.estiloPct}>{plan.estilosAprendizajePorcentaje.kinestesico}%</Text>
            </View>
          </SectionCard>
        )}

        {/* SECCI\u00d3N 4: Habilidades Socioemocionales */}
        {plan.habilidadesSocioemocionales && plan.habilidadesSocioemocionales.length > 0 && (
          <SectionCard title={isEFL ? "4. Socioemotional Skills" : "4. Habilidades Socioemocionales"} emoji={"\u2764\uFE0F"} colors={colors}>
            {plan.habilidadesSocioemocionales.map((habId: string) => {
              const hab = HABILIDADES_SOCIOEMOCIONALES.find(h => h.id === habId);
              if (!hab) return null;
              return (
                <View key={hab.id} style={styles.habRow}>
                  <Text style={{ fontSize: 14 }}>{hab.emoji}</Text>
                  <Text className="text-sm text-foreground ml-2 flex-1">
                    {isEFL ? hab.nameEN : hab.nombre}
                  </Text>
                </View>
              );
            })}
          </SectionCard>
        )}

        {/* SECCI\u00d3N 5: Objetivos */}
        <SectionCard title={isEFL ? "5. Objectives" : "5. Objetivos"} emoji={"\uD83C\uDFAF"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {plan.objetivoAprendizaje || (plan.destreza.objetivos.length > 0 ? plan.destreza.objetivos[0] : (isEFL ? "Not specified" : "No especificado"))}
          </Text>
        </SectionCard>

        {/* SECCI\u00d3N 6: Criterios de Evaluaci\u00f3n */}
        {plan.destreza.criteriosEvaluacion.length > 0 && (
          <SectionCard title={isEFL ? "6. Assessment Criteria" : "6. Criterios de Evaluaci\u00f3n"} emoji={"\uD83D\uDCCB"} colors={colors}>
            {plan.destreza.criteriosEvaluacion.map((crit: string, idx: number) => (
              <Text key={idx} className="text-xs text-foreground leading-4 mb-1">
                {"\u2022"} {crit}
              </Text>
            ))}
          </SectionCard>
        )}

        {/* Destreza con Criterio de Desempe\u00f1o + Competencias como badges */}
        <SectionCard title={isEFL ? "Performance Criteria Skill" : "Destreza con Criterio de Desempe\u00f1o"} emoji={"\u2B50"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            <Text style={{ fontWeight: "700" }}>{plan.destreza.codigo}: </Text>
            {plan.destreza.descripcion}
          </Text>
          {plan.usaCompetencias && plan.competencias && plan.competencias.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 }}>
              {plan.competencias.map((compId: string) => {
                const badgeMap: Record<string, { label: string; color: string }> = {
                  matematicas: { label: "CM", color: "#7C3AED" },
                  comunicacionales: { label: "C", color: "#059669" },
                  digitales: { label: "CD", color: "#2563EB" },
                  socioemocionales: { label: "CS", color: "#DC2626" },
                };
                const badge = badgeMap[compId];
                if (!badge) return null;
                return (
                  <View key={compId} style={{ backgroundColor: badge.color, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{badge.label}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </SectionCard>

        {/* Estructura de la Clase - 4 fases ERCA con DUA */}
        {tema && (
          <View className="px-5 mt-4">
            <View style={styles.sectionHeader}>
              <Text style={{ fontSize: 16 }}>{"\uD83C\uDFEB"}</Text>
              <Text
                className="text-base font-semibold text-foreground"
                style={{ marginLeft: 8 }}
              >
                {isEFL ? "Methodological Strategies - ERCA" : "Estrategias Metodol\u00f3gicas - ERCA"}
              </Text>
            </View>

            {/* DUA Legend */}
            <View style={[styles.duaLegend, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.duaLegendItem}>
                <View style={[styles.duaLegendSq, { backgroundColor: "#EC4899" }]} />
                <Text style={styles.duaLegendText}>{isEFL ? "Representation" : "Representaci\u00f3n"}</Text>
              </View>
              <View style={styles.duaLegendItem}>
                <View style={[styles.duaLegendSq, { backgroundColor: "#1E3A5F" }]} />
                <Text style={styles.duaLegendText}>{isEFL ? "Action & Expression" : "Acci\u00f3n y Expresi\u00f3n"}</Text>
              </View>
              <View style={styles.duaLegendItem}>
                <View style={[styles.duaLegendSq, { backgroundColor: "#22C55E" }]} />
                <Text style={styles.duaLegendText}>{isEFL ? "Engagement" : "Implicaci\u00f3n"}</Text>
              </View>
            </View>

            <FaseCardView
              label={isEFL ? "Experience" : "Experiencia"}
              fase={tema.estructura.experiencia}
              color="#2980B9"
              emoji={"\uD83D\uDCA1"}
              colors={colors}
            />
            <FaseCardView
              label={isEFL ? "Reflection" : "Reflexi\u00f3n"}
              fase={tema.estructura.reflexion}
              color="#8E44AD"
              emoji={"\uD83E\uDD14"}
              colors={colors}
            />
            <FaseCardView
              label={isEFL ? "Conceptualization" : "Conceptualizaci\u00f3n"}
              fase={tema.estructura.conceptualizacion}
              color="#27AE60"
              emoji={"\uD83D\uDCDA"}
              colors={colors}
            />
            <FaseCardView
              label={isEFL ? "Application" : "Aplicaci\u00f3n"}
              fase={tema.estructura.aplicacion}
              color="#E67E22"
              emoji={"\u2705"}
              colors={colors}
            />
          </View>
        )}

        {/* Actividades Evaluativas */}
        <SectionCard title={isEFL ? "Assessment Activities" : "Actividades Evaluativas"} emoji={"\uD83D\uDCCA"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {tema?.evaluacionFormativa || plan.evaluacion || (isEFL ? "Not specified" : "No especificada")}
          </Text>
          {plan.tecnicasInstrumentos && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground, marginBottom: 2 }}>
                {isEFL ? "Techniques and Instruments:" : "T\u00e9cnicas e Instrumentos:"}
              </Text>
              <Text className="text-sm text-muted leading-5">
                {plan.tecnicasInstrumentos}
              </Text>
            </View>
          )}
        </SectionCard>

        {/* Recursos */}
        <SectionCard title={isEFL ? "Resources" : "Recursos"} emoji={"\uD83D\uDCE6"} colors={colors}>
          <Text className="text-sm text-foreground leading-5">
            {tema?.recursos ? tema.recursos.join(", ") : plan.recursos || (isEFL ? "Not specified" : "No especificados")}
          </Text>
        </SectionCard>

        {/* Inserciones Curriculares / Ejes Transversales */}
        {(plan.insercionesCurriculares && plan.insercionesCurriculares.length > 0) || plan.insercionCurricular ? (
          <SectionCard title={isEFL ? "Curricular Insertions" : "Inserciones Curriculares (Ejes Transversales)"} emoji={"\uD83C\uDF10"} colors={colors}>
            {(plan.insercionesCurriculares || (plan.insercionCurricular ? [plan.insercionCurricular] : [])).map((insId: string) => {
              const ins = INSERCIONES_CURRICULARES.find(i => i.id === insId);
              if (!ins) return null;
              return (
                <Text key={ins.id} style={{ fontSize: 13, color: colors.foreground, marginBottom: 4 }}>
                  {"\u2022"} {isEFL ? ins.nameEN : ins.nombreCorto}
                </Text>
              );
            })}
          </SectionCard>
        ) : null}



        {/* Metodolog\u00edas Activas */}
        {plan.metodologiasActivas && plan.metodologiasActivas.length > 0 ? (
          <SectionCard title={isEFL ? "Active Methodologies" : "Metodolog\u00edas Activas"} emoji={"\uD83D\uDCA1"} colors={colors}>
            {plan.metodologiasActivas.map((metId: string) => {
              const met = METODOLOGIAS_ACTIVAS.find(m => m.id === metId);
              if (!met) return null;
              return (
                <Text key={met.id} style={{ fontSize: 13, color: colors.foreground, marginBottom: 4 }}>
                  {"\u2022"} {isEFL ? met.nameEN : met.nombre}
                </Text>
              );
            })}
          </SectionCard>
        ) : null}

        {/* DUA Detallado */}
        {plan.dua && (plan.dua.representacion || plan.dua.accionExpresion || plan.dua.implicacion) ? (
          <SectionCard title={isEFL ? "Universal Design for Learning (UDL)" : "Dise\u00f1o Universal para el Aprendizaje (DUA)"} emoji={"\u267F"} colors={colors}>
            {plan.dua.representacion ? (
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <View style={[styles.duaSquare, { backgroundColor: "#EC4899" }]} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#EC4899", marginLeft: 6 }}>
                    {isEFL ? "Principle 1: Representation" : "Principio 1: Representaci\u00f3n"}
                  </Text>
                </View>
                <Text className="text-sm text-foreground leading-5">{plan.dua.representacion}</Text>
              </View>
            ) : null}
            {plan.dua.accionExpresion ? (
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <View style={[styles.duaSquare, { backgroundColor: "#1E3A5F" }]} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#1E3A5F", marginLeft: 6 }}>
                    {isEFL ? "Principle 2: Action & Expression" : "Principio 2: Acci\u00f3n y Expresi\u00f3n"}
                  </Text>
                </View>
                <Text className="text-sm text-foreground leading-5">{plan.dua.accionExpresion}</Text>
              </View>
            ) : null}
            {plan.dua.implicacion ? (
              <View style={{ marginBottom: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <View style={[styles.duaSquare, { backgroundColor: "#22C55E" }]} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#22C55E", marginLeft: 6 }}>
                    {isEFL ? "Principle 3: Engagement" : "Principio 3: Implicaci\u00f3n"}
                  </Text>
                </View>
                <Text className="text-sm text-foreground leading-5">{plan.dua.implicacion}</Text>
              </View>
            ) : null}
          </SectionCard>
        ) : null}

        {/* Observaciones */}
        {plan.observaciones ? (
          <SectionCard title={isEFL ? "Observations" : "Observaciones"} emoji={"\uD83D\uDCCC"} colors={colors}>
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
// COMPONENTE: Tarjeta de fase con DUA squares
// ==========================================
function FaseCardView({
  label,
  fase,
  color,
  emoji,
  colors,
}: {
  label: string;
  fase: FaseClase;
  color: string;
  emoji: string;
  colors: any;
}) {
  const duaActividades = fase.duaActividades || [];

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
      {fase.actividades.map((act: string, idx: number) => {
        const dua: DUAActividad = duaActividades[idx] || { representacion: false, accionExpresion: false, implicacion: false };
        // Limpiar texto: remover indicadores DUA que la IA pudo haber incluido en el texto
        const cleanAct = act
          .replace(/\s*\(\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\)\s*/gi, "")
          .replace(/\s*\[\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\]\s*/gi, "")
          .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
          .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
          .trim();
        return (
          <View key={idx} style={styles.faseActRow}>
            <View style={[styles.faseActNum, { backgroundColor: color + "15" }]}>
              <Text style={{ color, fontSize: 11, fontWeight: "700" }}>
                {idx + 1}
              </Text>
            </View>
            <Text className="text-sm text-foreground flex-1 leading-5" style={{ marginLeft: 8 }}>
              {cleanAct}
            </Text>
            {/* DUA squares */}
            <View style={styles.duaSquaresRow}>
              <View style={[styles.duaMiniSq, { backgroundColor: dua.representacion ? "#EC4899" : "#EC489930" }]} />
              <View style={[styles.duaMiniSq, { backgroundColor: dua.accionExpresion ? "#1E3A5F" : "#1E3A5F30" }]} />
              <View style={[styles.duaMiniSq, { backgroundColor: dua.implicacion ? "#22C55E" : "#22C55E30" }]} />
            </View>
          </View>
        );
      })}
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
      <Text className="text-sm text-muted" style={{ width: 130 }}>
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
  // DUA styles
  duaPrincipioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  duaSquare: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  duaSquaresRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 6,
  },
  duaMiniSq: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  duaLegend: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    flexWrap: "wrap",
  },
  duaLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  duaLegendSq: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  duaLegendText: {
    fontSize: 11,
    color: "#666",
  },
  // Estilos de aprendizaje
  estiloRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  estiloLabel: {
    fontSize: 10,
    fontWeight: "700",
    width: 100,
    color: "#333",
  },
  estiloBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  estiloBarFill: {
    flex: 1,
    borderRadius: 6,
  },
  estiloPct: {
    fontSize: 12,
    fontWeight: "700",
    width: 36,
    textAlign: "right",
    color: "#333",
  },
  habRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
