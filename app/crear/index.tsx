import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CATALOGO_MODULOS, CATEGORIAS, type Modulo } from "@/lib/crear-catalog";

/**
 * Hub de creación `/crear` (spec `hub-de-creacion`).
 *
 * Punto único de entrada a los 12 flujos de creación, agrupados en las 6
 * categorías del spec y con lenguaje cromático de marca (azul `#003366`,
 * blanco y gris): los colores curriculares no se usan para distinguir
 * módulos. Los wizards internos no se tocan: cada tarjeta solo navega a su
 * ruta existente en estado inicial.
 *
 * "Adaptación curricular" requiere contexto previo (design D4): se muestra
 * deshabilitada con la razón visible si no se llegó desde una planificación o
 * semana, y se habilita con el contexto precargado si la ruta se alcanza con
 * `semanaId` o `planId` (p. ej. desde el detalle de una semana).
 */
export default function CrearScreen() {
  const colors = useColors();
  const router = useRouter();
  const { semanaId, planId } = useLocalSearchParams<{ semanaId?: string; planId?: string }>();

  // Contexto de origen (design D4): llega desde ver-semana o ver-plan con el
  // id en params; sin él, "Adaptación curricular" no inicia el flujo.
  const hayContexto = Boolean(semanaId || planId);
  const origen = semanaId ? "una planificación semanal" : planId ? "un plan" : null;

  const abrir = (modulo: Modulo) => {
    if (modulo.requiereContexto) {
      if (semanaId) {
        router.push(`/adaptacion-curricular?semanaId=${encodeURIComponent(String(semanaId))}` as any);
      } else if (planId) {
        router.push(`/adaptacion-curricular?planId=${encodeURIComponent(String(planId))}` as any);
      }
      return; // sin contexto no inicia el flujo
    }
    router.push(modulo.ruta as any);
  };

  const habilitado = (modulo: Modulo) => !modulo.requiereContexto || hayContexto;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={{ gap: 6 }}>
          <Text
            style={{ color: colors.foreground, fontSize: 24, fontWeight: "800" }}
            accessibilityRole="header"
          >
            Nueva planificación
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
            Elige el tipo de documento que quieres construir. Cada módulo abre su
            flujo existente tal como siempre ha funcionado.
          </Text>
        </View>

        {/* Llegada desde una planificación concreta: el módulo contextual se habilita */}
        {hayContexto && (
          <View
            accessibilityRole="alert"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: colors.brandFg + "0F",
              borderWidth: 1,
              borderColor: colors.brandFg + "40",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <MaterialCommunityIcons name="check-decagram" size={20} color={colors.brandFg} />
            <Text style={{ flex: 1, color: colors.foreground, fontSize: 13, lineHeight: 19 }}>
              Has llegado desde {origen}.{" "}
              <Text style={{ fontWeight: "700" }}>Adaptación curricular</Text> está
              disponible con ese contexto precargado.
            </Text>
          </View>
        )}

        {CATEGORIAS.map((categoria) => {
          const modulos = CATALOGO_MODULOS.filter((m) => m.categoria === categoria.id);
          if (modulos.length === 0) return null;

          return (
            <View key={categoria.id} style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{ width: 4, height: 16, borderRadius: 2, backgroundColor: colors.brandFg }}
                />
                <Text
                  style={{ color: colors.brandFg, fontSize: 15, fontWeight: "800" }}
                  accessibilityRole="header"
                >
                  {categoria.label}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {modulos.length} {modulos.length === 1 ? "módulo" : "módulos"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                {modulos.map((modulo) => {
                  const disponible = habilitado(modulo);
                  const focoMarca = modulo.requiereContexto;

                  return (
                    <Pressable
                      key={modulo.id}
                      onPress={() => disponible && abrir(modulo)}
                      disabled={!disponible}
                      accessibilityRole="button"
                      accessibilityLabel={modulo.modulo}
                      accessibilityState={{ disabled: !disponible }}
                      style={({ pressed }) => ({
                        // Ancho mínimo para que en móvil aparezca una columna y en
                        // escritorio se acomoden en varias filas.
                        minWidth: 260,
                        maxWidth: 360,
                        flex: 1,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: focoMarca && !disponible ? colors.border : colors.border,
                        borderRadius: 14,
                        padding: 14,
                        gap: 8,
                        // Relieve: misma sombra que las tarjetas de Mis planes.
                        shadowColor: "#0F172A",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.12,
                        shadowRadius: 10,
                        elevation: 3,
                        opacity: !disponible ? 0.7 : pressed ? 0.85 : 1,
                        transform: [{ scale: pressed && disponible ? 0.995 : 1 }],
                      })}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: colors.brandFg + "14",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name={modulo.icono}
                            size={20}
                            color={colors.brandFg}
                          />
                        </View>
                        <Text
                          style={{
                            flex: 1,
                            color: colors.foreground,
                            fontSize: 15,
                            fontWeight: "700",
                          }}
                          numberOfLines={2}
                        >
                          {modulo.modulo}
                        </Text>
                        {disponible && (
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={colors.muted}
                          />
                        )}
                      </View>

                      <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>
                        {modulo.resumen}
                      </Text>

                      {disponible && modulo.requiereContexto && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            alignSelf: "flex-start",
                            backgroundColor: colors.brandFg + "14",
                            borderRadius: 999,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={14}
                            color={colors.brandFg}
                          />
                          <Text style={{ color: colors.brandFg, fontSize: 12, fontWeight: "700" }}>
                            Contexto precargado
                          </Text>
                        </View>
                      )}

                      {!disponible && (
                        <View style={{ gap: 6 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                              backgroundColor: colors.muted + "26",
                              borderRadius: 8,
                              paddingHorizontal: 8,
                              paddingVertical: 6,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="information-outline"
                              size={14}
                              color={colors.muted}
                            />
                            <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }}>
                              Requiere una planificación semanal o un plan de origen
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => router.push("/ayuda" as any)}
                            accessibilityRole="link"
                            accessibilityLabel="Ver ayuda"
                            hitSlop={6}
                            style={({ pressed }) => ({ alignSelf: "flex-start", opacity: pressed ? 0.6 : 1 })}
                          >
                            <Text
                              style={{
                                color: colors.brandFg,
                                fontSize: 13,
                                fontWeight: "700",
                                textDecorationLine: "underline",
                              }}
                            >
                              Ver ayuda
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}
