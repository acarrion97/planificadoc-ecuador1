import { useState, useMemo } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import { AREAS_INFO, TODAS_LAS_DESTREZAS, buscarDestrezas } from "@/data";

/**
 * Inicio por intención (spec `inicio-por-intencion`).
 *
 * Orden: identidad de marca + claim → buscador de DCD → bloque **Continuar**
 * (solo si hay planes) → CTA "＋ Nueva planificación" → `/crear`.
 *
 * Sin cuadrículas de áreas ni tarjetas de módulo: ese catálogo vive en
 * Explorar y en `/crear`. El buscador conserva exactamente su comportamiento
 * actual (resultados por código con acceso al detalle de la destreza).
 */

interface ContinuarItem {
  key: string;
  tipo: string;
  titulo: string;
  subtitulo: string;
  /** Marca de tiempo para ordenar los recientes de mayor a menor. */
  ts: number;
  ruta: string;
}

const parseTs = (valor?: string): number => {
  if (!valor) return 0;
  const t = Date.parse(valor);
  return Number.isNaN(t) ? 0 : t;
};

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { planificaciones, semanas } = usePlanificaciones();
  const { planesCNC } = usePlanificacionesCNC();
  const { evaluaciones } = useEvaluaciones();
  const [query, setQuery] = useState("");

  const resultados = useMemo(() => {
    if (query.trim().length < 2) return [];
    return buscarDestrezas(query).slice(0, 20);
  }, [query]);

  // Bloque Continuar: lo más reciente de cada tipo que tiene detalle propio.
  // Los tipos sin pantalla de detalle (p. ej. Bachillerato Técnico) no entran.
  const recientes = useMemo<ContinuarItem[]>(() => {
    const items: ContinuarItem[] = [
      ...planificaciones.map((p) => ({
        key: `diario-${p.id}`,
        tipo: "Plan diario",
        titulo: `${p.asignatura} — ${p.grado}`,
        subtitulo: `${p.destreza.codigo} · ${p.fecha}`,
        ts: parseTs(p.fecha),
        ruta: `/ver-plan/${p.id}`,
      })),
      ...semanas.map((s) => ({
        key: `semanal-${s.id}`,
        tipo: "Plan semanal",
        titulo: `Semana del ${s.semanaInicio} al ${s.semanaFin}`,
        subtitulo: `${s.grado} · ${s.docente || "Sin docente"}`,
        ts: parseTs(s.updatedAt || s.createdAt || s.fecha),
        ruta: `/ver-semana/${s.id}`,
      })),
      ...planesCNC.map((c) => ({
        key: `cnc-${c.id}`,
        tipo: "Conecta, Nivela y Crea",
        titulo: `${c.grado || "Sin grado"}${c.paralelo ? ` ${c.paralelo}` : ""}`,
        subtitulo: `${c.docente || "Sin docente"} · ${c.anioLectivo}`,
        ts: parseTs(c.updatedAt || c.createdAt),
        ruta: `/ver-cnc/${c.id}`,
      })),
      ...evaluaciones.map((e) => ({
        key: `eval-${e.id}`,
        tipo: "Evaluación diagnóstica",
        titulo: e.nombre || "Sin nombre",
        subtitulo: `${e.grado} ${e.paralelo ? `· ${e.paralelo} ` : ""}· ${e.fecha}`,
        ts: parseTs(e.updatedAt || e.createdAt || e.fecha),
        ruta: `/ver-evaluacion/${e.id}`,
      })),
    ];
    return items.sort((a, b) => b.ts - a.ts).slice(0, 5);
  }, [planificaciones, semanas, planesCNC, evaluaciones]);

  return (
    <ScreenContainer className="flex-1">
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            {/* ── Identidad de marca ── */}
            <View className="px-5 pt-4 pb-2">
              <Text
                className="text-3xl font-bold"
                style={{ color: colors.brandFg }}
                accessibilityRole="header"
              >
                PlanificaDoc
              </Text>
              <Text className="text-base text-muted mt-1">
                Planificación curricular para docentes de Ecuador
              </Text>
            </View>

            {/* ── Buscador de códigos de destreza ── */}
            <View className="px-5 mt-4">
              <View
                className="flex-row items-center bg-surface rounded-xl px-4 border border-border"
                style={styles.searchContainer}
              >
                <Text style={{ fontSize: 18 }}>{"🔍"}</Text>
                <TextInput
                  className="flex-1 ml-3 text-base text-foreground"
                  placeholder="Código de destreza (ej: M.3.1.1)"
                  placeholderTextColor={colors.muted}
                  value={query}
                  onChangeText={setQuery}
                  autoCapitalize="characters"
                  returnKeyType="search"
                  style={styles.searchInput}
                />
                {query.length > 0 && (
                  <Pressable
                    onPress={() => setQuery("")}
                    style={{ padding: 4 }}
                    accessibilityLabel="Limpiar búsqueda"
                  >
                    <Text style={{ fontSize: 16 }}>{"✕"}</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View className="px-5 mt-3">
              <Text className="text-sm text-muted">
                {TODAS_LAS_DESTREZAS.length} destrezas disponibles {"\u00b7"} 14 asignaturas
              </Text>
            </View>

            {/* ── Vista por intención (solo sin resultados de búsqueda) ── */}
            {resultados.length === 0 && (
              <>
                {/* Continuar: oculto si no hay planes, sin dejar huecos */}
                {recientes.length > 0 && (
                  <View className="mt-5">
                    <View className="px-5 mb-3">
                      <Text
                        className="text-lg font-semibold text-foreground"
                        accessibilityRole="header"
                      >
                        Continuar
                      </Text>
                    </View>
                    {recientes.map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => router.push(item.ruta as any)}
                        accessibilityRole="button"
                        accessibilityLabel={`Continuar: ${item.titulo}`}
                        style={({ pressed }) => [
                          styles.continuarCard,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={[styles.tipoChip, { backgroundColor: colors.brandFg + "14" }]}>
                            <Text style={[styles.tipoChipText, { color: colors.brandFg }]}>
                              {item.tipo}
                            </Text>
                          </View>
                          <Text
                            className="text-sm font-medium text-foreground mt-2"
                            numberOfLines={1}
                          >
                            {item.titulo}
                          </Text>
                          <Text className="text-xs text-muted mt-1" numberOfLines={1}>
                            {item.subtitulo}
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={22}
                          color={colors.muted}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* ── CTA de creación → hub /crear ── */}
                <View className="px-5 mt-5">
                  <Pressable
                    onPress={() => router.push("/crear" as any)}
                    accessibilityRole="button"
                    accessibilityLabel="Nueva planificación"
                    style={({ pressed }) => [
                      styles.cta,
                      { backgroundColor: colors.brand, opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <MaterialCommunityIcons name="plus-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.ctaText}>Nueva planificación</Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* ── Cabecera de resultados de búsqueda ── */}
            {resultados.length > 0 && (
              <View className="px-5 mt-4 mb-2">
                <Text className="text-sm font-medium text-muted">
                  {resultados.length} resultado(s) encontrado(s)
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/destreza/${item.codigo}` as any)}
            style={({ pressed }) => [
              styles.resultCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.resultCardHeader}>
              <View
                style={[
                  styles.codeBadge,
                  { backgroundColor: AREAS_INFO[item.area]?.color + "20" },
                ]}
              >
                <Text
                  style={{
                    color: AREAS_INFO[item.area]?.color,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  {item.codigo}
                </Text>
              </View>
              {/* El color de área solo vive en el badge de datos (5.2). */}
              <Text
                style={{
                  color: colors.muted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {AREAS_INFO[item.area]?.name}
              </Text>
            </View>
            <Text
              className="text-sm text-foreground mt-2 leading-5"
              numberOfLines={3}
            >
              {item.descripcion}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          query.trim().length >= 2 ? (
            <View className="items-center py-10 px-5">
              <Text style={{ fontSize: 48 }}>{"🔎"}</Text>
              <Text className="text-base text-muted mt-3 text-center">
                No se encontraron destrezas para "{query}"
              </Text>
              <Text className="text-sm text-muted mt-1 text-center">
                Intenta con otro c{"ó"}digo o t{"é"}rmino
              </Text>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    height: 52,
  },
  searchInput: {
    height: 52,
    fontSize: 16,
  },
  continuarCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipoChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tipoChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cta: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  resultCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
