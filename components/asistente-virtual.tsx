/**
 * Asistente virtual "Doc": burbuja flotante en la esquina inferior derecha que
 * responde dudas de uso buscando en el manual de usuario y redactando la
 * respuesta con IA (`trpc.asistente.preguntar`).
 *
 * Para no estorbar mientras se planifica tiene tres estados:
 *  - cerrado: solo la mascota pequeña (con un × para ocultarla),
 *  - abierto: panel de chat compacto,
 *  - oculto: una pestaña diminuta en el borde para volver a mostrarlo
 *    (se recuerda entre sesiones).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";

const STORAGE_KEY = "asistente-virtual:oculto";
const MASCOTA = require("@/assets/images/asistente.png");

interface Fuente {
  capId: string;
  capTitulo: string;
  seccion: string | null;
  seccionId: string | null;
}
interface Mensaje {
  rol: "usuario" | "asistente";
  texto: string;
  fuentes?: Fuente[];
  error?: boolean;
}

const SALUDO: Mensaje = {
  rol: "asistente",
  texto: "¡Hola! Soy Doc, tu asistente. Pregúntame lo que necesites sobre cómo usar PlanificaDoc y lo busco en el manual.",
};
const SUGERENCIAS = ["¿Cómo creo un plan diario?", "¿Cómo descargo mi planificación en Word?", "¿Cómo contacto a soporte?"];

export function AsistenteVirtual() {
  const colors = useColors();
  const router = useRouter();
  const segments = useSegments();
  const { width, height } = useWindowDimensions();
  const preguntar = trpc.asistente.preguntar.useMutation();

  const [estado, setEstado] = useState<"cerrado" | "abierto" | "oculto">("cerrado");
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO]);
  const [texto, setTexto] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => v === "1" && setEstado("oculto"))
      .catch(() => {});
  }, []);

  const cambiar = useCallback((e: "cerrado" | "abierto" | "oculto") => {
    setEstado(e);
    if (e !== "abierto") AsyncStorage.setItem(STORAGE_KEY, e === "oculto" ? "1" : "0").catch(() => {});
  }, []);

  const enviar = useCallback(
    async (pregunta: string) => {
      const q = pregunta.trim();
      if (!q || preguntar.isPending) return;
      const historial = mensajes
        .filter((m) => !m.error && m !== SALUDO)
        .slice(-6)
        .map((m) => ({ rol: m.rol, texto: m.texto }));
      setMensajes((p) => [...p, { rol: "usuario", texto: q }]);
      setTexto("");
      try {
        const r = await preguntar.mutateAsync({ pregunta: q, historial });
        setMensajes((p) => [...p, { rol: "asistente", texto: r.respuesta, fuentes: r.fuentes }]);
      } catch {
        setMensajes((p) => [
          ...p,
          { rol: "asistente", texto: "No pude responder en este momento. Intenta de nuevo en unos segundos.", error: true },
        ]);
      }
    },
    [mensajes, preguntar],
  );

  const verEnManual = (f: Fuente) => {
    cambiar("cerrado");
    router.push({ pathname: "/ayuda/manual", params: { c: f.capId, s: f.seccionId ?? "" } } as any);
  };

  // Autodesplazamiento al último mensaje.
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [mensajes, preguntar.isPending, estado]);

  // Sin asistente en la pantalla de acceso/pago ni en el retorno de OAuth.
  if (segments[0] === "paywall" || segments[0] === "oauth") return null;

  const margen = 12;
  const panelAncho = Math.min(380, width - margen * 2);
  const panelAlto = Math.min(540, height * 0.72);

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 60 }}>
      {estado === "oculto" && (
        <Pressable
          onPress={() => cambiar("cerrado")}
          accessibilityRole="button"
          accessibilityLabel="Mostrar el asistente virtual"
          style={({ pressed }) => ({
            position: "absolute",
            right: 0,
            bottom: 96,
            width: 26,
            height: 44,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            backgroundColor: colors.brand,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 0.85,
          })}
        >
          <MaterialCommunityIcons name="chevron-left" size={20} color="#FFFFFF" />
        </Pressable>
      )}

      {estado === "cerrado" && (
        <View style={{ position: "absolute", right: margen, bottom: margen + 4 }}>
          <Pressable
            onPress={() => cambiar("abierto")}
            accessibilityRole="button"
            accessibilityLabel="Abrir el asistente virtual"
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 0.92,
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
            })}
          >
            <Image source={MASCOTA} style={{ width: 46, height: 46 }} resizeMode="contain" />
          </Pressable>
          <Pressable
            onPress={() => cambiar("oculto")}
            accessibilityRole="button"
            accessibilityLabel="Ocultar el asistente virtual"
            hitSlop={8}
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="close" size={13} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {estado === "abierto" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          pointerEvents="box-none"
          style={{ position: "absolute", right: margen, bottom: margen, width: panelAncho }}
        >
          <View
            style={{
              height: panelAlto,
              backgroundColor: colors.background,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.22,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}
          >
            {/* Encabezado */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Image source={MASCOTA} style={{ width: 36, height: 36 }} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800" }}>Doc · Asistente</Text>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Respuestas basadas en el manual</Text>
              </View>
              <Pressable
                onPress={() => cambiar("cerrado")}
                accessibilityRole="button"
                accessibilityLabel="Minimizar el asistente"
                hitSlop={8}
                style={({ pressed }) => ({ padding: 4, opacity: pressed ? 0.6 : 1 })}
              >
                <MaterialCommunityIcons name="window-minimize" size={20} color={colors.muted} />
              </Pressable>
            </View>

            {/* Conversación */}
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 12, gap: 10 }}
              keyboardShouldPersistTaps="handled"
            >
              {mensajes.map((m, i) => (
                <View key={i} style={{ alignSelf: m.rol === "usuario" ? "flex-end" : "flex-start", maxWidth: "88%", gap: 6 }}>
                  <View
                    style={{
                      backgroundColor: m.rol === "usuario" ? colors.brand : colors.surface,
                      borderWidth: m.rol === "usuario" ? 0 : 1,
                      borderColor: colors.border,
                      borderRadius: 14,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                    }}
                  >
                    <Text
                      selectable
                      style={{
                        color: m.rol === "usuario" ? "#FFFFFF" : m.error ? colors.error : colors.foreground,
                        fontSize: 14,
                        lineHeight: 20,
                      }}
                    >
                      {m.texto.replace(/\*\*/g, "")}
                    </Text>
                  </View>
                  {m.fuentes && m.fuentes.length > 0 && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ color: colors.muted, fontSize: 11 }}>Ver en el manual:</Text>
                      {m.fuentes.map((f, j) => (
                        <Pressable
                          key={j}
                          onPress={() => verEnManual(f)}
                          accessibilityRole="link"
                          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 4, opacity: pressed ? 0.6 : 1 })}
                        >
                          <MaterialCommunityIcons name="book-open-page-variant" size={14} color={colors.brandFg} />
                          <Text style={{ flexShrink: 1, color: colors.brandFg, fontSize: 12, fontWeight: "600" }} numberOfLines={2}>
                            {f.seccion ?? f.capTitulo}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {mensajes.length === 1 && !preguntar.isPending && (
                <View style={{ gap: 6 }}>
                  {SUGERENCIAS.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => enviar(s)}
                      accessibilityRole="button"
                      style={({ pressed }) => ({
                        alignSelf: "flex-start",
                        borderWidth: 1,
                        borderColor: colors.brandFg,
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        opacity: pressed ? 0.6 : 1,
                      })}
                    >
                      <Text style={{ color: colors.brandFg, fontSize: 13 }}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {preguntar.isPending && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator size="small" color={colors.brandFg} />
                  <Text style={{ color: colors.muted, fontSize: 13 }}>Buscando en el manual…</Text>
                </View>
              )}
            </ScrollView>

            {/* Entrada */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 8,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <TextInput
                value={texto}
                onChangeText={setTexto}
                onSubmitEditing={() => enviar(texto)}
                placeholder="Escribe tu pregunta…"
                placeholderTextColor={colors.muted}
                maxLength={500}
                returnKeyType="send"
                accessibilityLabel="Pregunta para el asistente"
                style={{
                  flex: 1,
                  color: colors.foreground,
                  fontSize: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 18,
                  backgroundColor: colors.background,
                }}
              />
              <Pressable
                onPress={() => enviar(texto)}
                disabled={!texto.trim() || preguntar.isPending}
                accessibilityRole="button"
                accessibilityLabel="Enviar pregunta"
                style={({ pressed }) => ({
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: colors.brand,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: !texto.trim() || preguntar.isPending ? 0.45 : pressed ? 0.8 : 1,
                })}
              >
                <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
