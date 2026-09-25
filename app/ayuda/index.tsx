import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Pantalla de Ayuda `/ayuda` (spec `navegacion-principal`, task 1.9–1.11).
 *
 * FAQ 100% estática: sin CMS, sin base de datos de artículos, sin tickets, sin
 * chat y sin búsqueda semántica; el buscador solo filtra por texto los títulos
 * y respuestas de esta página. El contenido explica CÓMO USAR PlanificaDoc
 * (rutas reales de la app) y no contiene normativa ni criterios curriculares.
 */

interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
  /** Destino real de la app al que apunta la respuesta. */
  enlace?: { etiqueta: string; href: string };
}

const FAQ: FaqItem[] = [
  {
    id: "crear",
    pregunta: "¿Cómo creo una planificación?",
    respuesta:
      "Pulsa “Crear” en la navegación o el botón “＋ Nueva planificación” del Inicio. Se abre el catálogo /crear, agrupado por Plan de aula, Plan de área, Programaciones, Currículo, Niveles educativos y Contextuales; elige el módulo y su flujo se abre en su estado inicial.",
    enlace: { etiqueta: "Ir al catálogo Crear", href: "/crear" },
  },
  {
    id: "pca-pct",
    pregunta: "¿Cuál es la diferencia entre el PCA y el PCT?",
    respuesta:
      "El PCA Anual (Planificación Curricular Anual) organiza el área para todo el año pedagógico; el PCT Trimestral (Planificación Curricular Trimestral) concentra un trimestre. En PlanificaDoc: Crear → Plan de área → PCA Anual o PCT Trimestral. Ambos flujos abren el formulario existente y se exportan a Word igual que antes.",
    enlace: { etiqueta: "Ver Plan de área en Crear", href: "/crear" },
  },
  {
    id: "continuar",
    pregunta: "¿Cómo continúo una planificación que empecé?",
    respuesta:
      "Desde el Inicio verás el bloque “Continuar” con tus planes recientes; al tocar uno se abre justo donde lo dejaste. También puedes hacerlo desde Mis planes con la acción “Continuar” de cada fila.",
    enlace: { etiqueta: "Abrir Mis planes", href: "/planes" },
  },
  {
    id: "mis-planes",
    pregunta: "¿Dónde están mis planes guardados?",
    respuesta:
      "En Mis planes: el listado unificado de todos tus documentos (diario, semanal, PCA, PCT, CNC, Proyecto, BT, Currículo por Competencias, entre otros), con filtros Todos, Recientes, En progreso y Completados, y acciones de editar, duplicar y eliminar. Crear ya no vive aquí: esa sección es solo para gestionar.",
    enlace: { etiqueta: "Ir a Mis planes", href: "/planes" },
  },
  {
    id: "desde-destreza",
    pregunta: "¿Cómo planifico desde una destreza?",
    respuesta:
      "Busca la destreza en el buscador de Inicio o navega por área y subnivel en Explorar. Al abrir el detalle de la destreza verás el botón “Generar plan de esta destreza” (plan diario). El plan diario necesita una destreza elegida, por eso su entrada en el catálogo te lleva al buscador.",
    enlace: { etiqueta: "Explorar áreas", href: "/explorar" },
  },
  {
    id: "adaptacion",
    pregunta: "¿Qué necesito para crear una Adaptación curricular?",
    respuesta:
      "Una planificación o una semana de origen: la adaptación parte de un documento existente al que se le ajustan objetivos, metodología y evaluación. Por eso el módulo aparece deshabilitado en el catálogo sin contexto y se habilita cuando llegas desde el detalle de un plan o de una semana; ahí se carga con ese contexto precargado.",
    enlace: { etiqueta: "Ver el módulo en Crear", href: "/crear" },
  },
  {
    id: "diagnostico",
    pregunta: "¿Qué hace la Evaluación diagnóstica y cómo la inicio?",
    respuesta:
      "Sirve para conocer el punto de partida del estudiante al iniciar un periodo. Se inicia de forma autónoma desde Crear → Contextuales → Evaluación diagnóstica, con los campos de contexto por completar; también puede llegar con datos precargados cuando proviene de Conecta Nivela y Crea.",
    enlace: { etiqueta: "Ir a Evaluación diagnóstica", href: "/evaluacion-diagnostica" },
  },
  {
    id: "exportar",
    pregunta: "¿Cómo exporto mis documentos?",
    respuesta:
      "Cada flujo ofrece su botón de exportación (por ejemplo “Exportar a Word”) y los planes semanales incluyen además “Descargar Word” y “Descargar PDF” desde su pantalla de vista previa. La exportación conserva el formato de la plantilla oficial correspondiente.",
    enlace: { etiqueta: "Ver Mis planes", href: "/planes" },
  },
  {
    id: "premium",
    pregunta: "¿Qué funciones requieren una suscripción Premium?",
    respuesta:
      "El acceso completo a la creación, la exportación de documentos y las funciones avanzadas dependen de tu suscripción. En Mi cuenta puedes revisar tu plan, su fecha de vencimiento y gestionar la renovación o la cancelación; si tienes dudas, contáctanos.",
    enlace: { etiqueta: "Abrir Mi cuenta", href: "/cuenta" },
  },
];

const SOPORTE_EMAIL = "soporte@planificadoc.app";
/** Mismo enlace que el banner de WhatsApp existente (se retira a Mi cuenta en la fase 3). */
const WHATSAPP_URL = "https://chat.whatsapp.com/Kx4DtAkSVW4A1SM5xQUIyj?mode=gi_t";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function AyudaScreen() {
  const colors = useColors();
  const router = useRouter();
  const [consulta, setConsulta] = useState("");
  const [abierto, setAbierto] = useState<string | null>("crear");

  const resultados = useMemo(() => {
    const q = normalizar(consulta.trim());
    if (!q) return FAQ;
    return FAQ.filter(
      (item) =>
        normalizar(item.pregunta).includes(q) || normalizar(item.respuesta).includes(q)
    );
  }, [consulta]);

  const ir = (href: string) => router.push(href as any);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 48, alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "100%", maxWidth: 760, gap: 20 }}>
          {/* Encabezado */}
          <View style={{ gap: 6 }}>
            <Text
              style={{ color: colors.foreground, fontSize: 24, fontWeight: "800" }}
              accessibilityRole="header"
            >
              Ayuda
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
              Preguntas frecuentes sobre cómo usar PlanificaDoc. Si no encuentras
              tu respuesta, contáctanos.
            </Text>
          </View>

          {/* Buscador de texto */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
            }}
          >
            <MaterialCommunityIcons name="magnify" size={20} color={colors.muted} />
            <TextInput
              value={consulta}
              onChangeText={setConsulta}
              placeholder="Buscar en las preguntas frecuentes"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Buscar en la ayuda"
              style={{
                flex: 1,
                paddingVertical: 12,
                color: colors.foreground,
                fontSize: 15,
              }}
            />
            {consulta.length > 0 && (
              <Pressable
                onPress={() => setConsulta("")}
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                hitSlop={8}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>

          {/* FAQ */}
          <View style={{ gap: 10 }}>
            <Text style={{ color: colors.brandFg, fontSize: 15, fontWeight: "800" }}>
              Preguntas frecuentes
            </Text>

            {resultados.length === 0 && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 16,
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons name="file-search-outline" size={26} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center" }}>
                  Sin resultados para “{consulta}”. Prueba con otra palabra o
                  contacta con soporte.
                </Text>
              </View>
            )}

            {resultados.map((item) => {
              const abierto_ = abierto === item.id;
              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: abierto_ ? colors.brandFg : colors.border,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <Pressable
                    onPress={() => setAbierto(abierto_ ? null : item.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: abierto_ }}
                    accessibilityLabel={item.pregunta}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      padding: 14,
                      backgroundColor: pressed ? colors.muted + "1A" : "transparent",
                    })}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color: colors.foreground,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {item.pregunta}
                    </Text>
                    <MaterialCommunityIcons
                      name={abierto_ ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>

                  {abierto_ && (
                    <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 10 }}>
                      <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 21 }}>
                        {item.respuesta}
                      </Text>
                      {item.enlace && (
                        <Pressable
                          onPress={() => ir(item.enlace!.href)}
                          accessibilityRole="link"
                          accessibilityLabel={item.enlace.etiqueta}
                          hitSlop={6}
                          style={({ pressed }) => ({
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            alignSelf: "flex-start",
                            opacity: pressed ? 0.6 : 1,
                          })}
                        >
                          <Text
                            style={{
                              color: colors.brandFg,
                              fontSize: 14,
                              fontWeight: "700",
                              textDecorationLine: "underline",
                            }}
                          >
                            {item.enlace.etiqueta}
                          </Text>
                          <MaterialCommunityIcons name="arrow-right" size={14} color={colors.brandFg} />
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Enlaces rápidos */}
          <View style={{ gap: 10 }}>
            <Text style={{ color: colors.brandFg, fontSize: 15, fontWeight: "800" }}>
              Accesos directos
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {[
                { etiqueta: "Crear planificación", href: "/crear", icono: "plus-circle-outline" as const },
                { etiqueta: "Explorar destrezas", href: "/explorar", icono: "book-open-variant" as const },
                { etiqueta: "Mis planes", href: "/planes", icono: "clipboard-text-outline" as const },
                { etiqueta: "Mi cuenta", href: "/cuenta", icono: "account-circle-outline" as const },
              ].map((item) => (
                <Pressable
                  key={item.href}
                  onPress={() => ir(item.href)}
                  accessibilityRole="link"
                  accessibilityLabel={item.etiqueta}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <MaterialCommunityIcons name={item.icono} size={16} color={colors.brandFg} />
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>
                    {item.etiqueta}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Soporte */}
          <View
            style={{
              backgroundColor: colors.brandFg + "0F",
              borderWidth: 1,
              borderColor: colors.brandFg + "33",
              borderRadius: 14,
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={{ color: colors.brandFg, fontSize: 15, fontWeight: "800" }}>
              ¿No resolviste tu caso?
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
              Escríbenos y te respondemos lo antes posible.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              <Pressable
                onPress={() => Linking.openURL(`mailto:${SOPORTE_EMAIL}`)}
                accessibilityRole="button"
                accessibilityLabel={`Contactar soporte por correo ${SOPORTE_EMAIL}`}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: colors.brand,
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <MaterialCommunityIcons name="email-outline" size={18} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>
                  Contactar soporte
                </Text>
              </Pressable>

              <Pressable
                onPress={() => Linking.openURL(WHATSAPP_URL)}
                accessibilityRole="link"
                accessibilityLabel="Abrir grupo de WhatsApp"
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <MaterialCommunityIcons name="whatsapp" size={18} color={colors.brandFg} />
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>
                  Grupo de WhatsApp
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => Linking.openURL(`mailto:${SOPORTE_EMAIL}`)}
              accessibilityRole="link"
              accessibilityLabel={`Enviar correo a ${SOPORTE_EMAIL}`}
              hitSlop={6}
              style={({ pressed }) => ({ alignSelf: "flex-start", opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ color: colors.muted, fontSize: 13 }}>{SOPORTE_EMAIL}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
