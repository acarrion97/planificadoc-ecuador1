import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAccess } from "@/lib/access-control";
import { getApiBaseUrl } from "@/constants/oauth";

const WHATSAPP_NUMBER = "593978833533";

type PlanType = "monthly" | "annual";

export default function PaywallScreen() {
  const colors = useColors();
  const {
    unlockWithCode,
    unlockWithSubscription,
    checkSubscriptionStatus,
  } = useAccess();

  // Tab state: "subscribe" or "code"
  const [activeTab, setActiveTab] = useState<"subscribe" | "code">("subscribe");

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual");

  // Subscription state
  const [email, setEmail] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Code state (legacy)
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  // Success state
  const [success, setSuccess] = useState(false);

  const validateEmail = (e: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e.trim());
  };

  const handlePayWithPayPhone = useCallback(async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCardHolder = cardHolder.trim();
    const trimmedDocumentId = documentId.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedEmail) {
      setEmailError("Ingresa tu correo electrónico");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setEmailError("Ingresa un correo válido");
      return;
    }
    if (!trimmedCardHolder) {
      setEmailError("Ingresa el nombre del titular de la tarjeta");
      return;
    }
    if (!trimmedDocumentId || trimmedDocumentId.length < 8) {
      setEmailError("Ingresa tu número de cédula (mínimo 8 dígitos)");
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 9) {
      setEmailError("Ingresa tu número de celular");
      return;
    }
    setEmailError("");

    // Format phone to 593 prefix if needed
    let formattedPhone = trimmedPhone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "593" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("593")) {
      formattedPhone = "593" + formattedPhone;
    }

    // Always use planificadoc.app for payment page so PayPhone domain validation passes
    const PAYMENT_BASE_URL = "https://planificadoc.app";
    const paymentUrl = `${PAYMENT_BASE_URL}/api/payment/page?email=${encodeURIComponent(trimmedEmail)}&plan=${selectedPlan}&documentId=${encodeURIComponent(trimmedDocumentId)}&phoneNumber=${encodeURIComponent(formattedPhone)}&cardHolder=${encodeURIComponent(trimmedCardHolder)}`;

    try {
      if (Platform.OS === "web") {
        window.open(paymentUrl, "_blank");
      } else {
        await Linking.openURL(paymentUrl);
      }
    } catch {
      if (Platform.OS !== "web") {
        Alert.alert("Error", "No se pudo abrir el navegador para el pago.");
      }
    }
  }, [email, selectedPlan, cardHolder, documentId, phoneNumber]);

  const handleCheckPayment = useCallback(async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError("Ingresa tu correo para verificar");
      return;
    }
    setEmailError("");
    setCheckingPayment(true);

    try {
      const result = await unlockWithSubscription(trimmedEmail);
      if (result) {
        setSuccess(true);
      } else {
        setEmailError("No se encontró una suscripción activa para este correo. Si acabas de pagar, espera unos segundos e intenta de nuevo.");
      }
    } catch {
      setEmailError("Error al verificar. Intenta de nuevo.");
    } finally {
      setCheckingPayment(false);
    }
  }, [email, unlockWithSubscription]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hola, necesito ayuda con mi suscripción de PlanificaDoc."
    );
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    Linking.openURL(url).catch(() => {
      if (Platform.OS === "web") {
        window.open(url, "_blank");
      }
    });
  };

  const handleUnlockCode = async () => {
    if (code.trim().length === 0) {
      setCodeError("Ingresa tu código de acceso");
      return;
    }
    setCodeError("");
    setCodeLoading(true);
    try {
      const result = await unlockWithCode(code);
      if (result) {
        setSuccess(true);
      } else {
        setCodeError("Código inválido. Verifica e intenta de nuevo.");
      }
    } catch {
      setCodeError("Error al verificar el código.");
    } finally {
      setCodeLoading(false);
    }
  };

  if (success) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success + "20" }]}>
            <Text style={{ fontSize: 56 }}>{"\u2705"}</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            Acceso Activado
          </Text>
          <Text style={[styles.successSubtitle, { color: colors.muted }]}>
            Tu suscripción ha sido verificada.{"\n"}Bienvenido/a a PlanificaDoc.
          </Text>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
          <Text style={[styles.redirectText, { color: colors.muted }]}>
            Cargando la aplicación...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo & Header */}
        <View style={styles.headerSection}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appTitle, { color: colors.foreground }]}>
            PlanificaDoc
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.muted }]}>
            Planificación curricular para docentes de Ecuador
          </Text>
        </View>

        {/* Value proposition */}
        <View
          style={[
            styles.valueCard,
            { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" },
          ]}
        >
          <Text style={[styles.valueTitle, { color: colors.primary }]}>
            Planifica tu semana en 5 minutos
          </Text>
          <View style={styles.featureList}>
            <FeatureRow emoji={"\uD83D\uDD0D"} text="1,652+ destrezas del currículo ecuatoriano (EGB + BGU)" color={colors.foreground} />
            <FeatureRow emoji={"\u2728"} text="Temas sugeridos con estructura de clase ERCA" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDCC4"} text="Exporta a PDF con formato oficial del MinEduc" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDCBE"} text="Guarda y gestiona tus planificaciones" color={colors.foreground} />
            <FeatureRow emoji={"\u267F"} text="Diseño Universal para el Aprendizaje (DUA)" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDD04"} text="Actualizaciones y nuevas destrezas incluidas" color={colors.foreground} />
          </View>
        </View>

        {/* Plan Selector */}
        <View style={styles.planSelectorSection}>
          <Text style={[styles.planSelectorTitle, { color: colors.foreground }]}>
            Elige tu plan
          </Text>

          {/* Annual Plan Card */}
          <Pressable
            onPress={() => setSelectedPlan("annual")}
            style={({ pressed }) => [
              styles.planCard,
              {
                borderColor: selectedPlan === "annual" ? "#059669" : colors.border,
                borderWidth: selectedPlan === "annual" ? 2.5 : 1.5,
                backgroundColor: selectedPlan === "annual" ? "#05966908" : colors.surface,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            {/* Best value badge */}
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>Mejor precio</Text>
            </View>
            <View style={styles.planCardContent}>
              <View style={styles.planCardLeft}>
                <View style={styles.planRadio}>
                  {selectedPlan === "annual" ? (
                    <View style={[styles.planRadioInner, { backgroundColor: "#059669" }]} />
                  ) : null}
                </View>
                <View>
                  <Text style={[styles.planName, { color: colors.foreground }]}>
                    Anual
                  </Text>
                  <Text style={[styles.planDuration, { color: colors.muted }]}>
                    12 meses de acceso
                  </Text>
                </View>
              </View>
              <View style={styles.planCardRight}>
                <Text style={[styles.planPrice, { color: "#059669" }]}>
                  $4.89
                </Text>
                <Text style={[styles.planPeriod, { color: colors.muted }]}>
                  /mes
                </Text>
                <Text style={[styles.planTotal, { color: colors.muted }]}>
                  $58.71 total
                </Text>
              </View>
            </View>
            <View style={[styles.savingsBanner, { backgroundColor: "#05966915" }]}>
              <Text style={[styles.savingsText, { color: "#059669" }]}>
                {"\u2B50"} Ahorras 30% vs. plan mensual
              </Text>
            </View>
          </Pressable>

          {/* Monthly Plan Card */}
          <Pressable
            onPress={() => setSelectedPlan("monthly")}
            style={({ pressed }) => [
              styles.planCard,
              {
                borderColor: selectedPlan === "monthly" ? "#1e3a5f" : colors.border,
                borderWidth: selectedPlan === "monthly" ? 2.5 : 1.5,
                backgroundColor: selectedPlan === "monthly" ? "#1e3a5f08" : colors.surface,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View style={styles.planCardContent}>
              <View style={styles.planCardLeft}>
                <View style={styles.planRadio}>
                  {selectedPlan === "monthly" ? (
                    <View style={[styles.planRadioInner, { backgroundColor: "#1e3a5f" }]} />
                  ) : null}
                </View>
                <View>
                  <Text style={[styles.planName, { color: colors.foreground }]}>
                    Mensual
                  </Text>
                  <Text style={[styles.planDuration, { color: colors.muted }]}>
                    1 mes de acceso
                  </Text>
                </View>
              </View>
              <View style={styles.planCardRight}>
                <Text style={[styles.planPrice, { color: "#1e3a5f" }]}>
                  $6.99
                </Text>
                <Text style={[styles.planPeriod, { color: colors.muted }]}>
                  /mes
                </Text>
              </View>
            </View>
          </Pressable>

          <Text style={[styles.noAutoRenewal, { color: colors.muted }]}>
            {"\uD83D\uDD04"} Renovación automática. Puedes cancelar en cualquier momento.
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable
            onPress={() => setActiveTab("subscribe")}
            style={({ pressed }) => [
              styles.tab,
              activeTab === "subscribe" && { backgroundColor: colors.primary },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "subscribe" ? "#FFFFFF" : colors.muted },
              ]}
            >
              {"\uD83D\uDCB3"} Suscribirse
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("code")}
            style={({ pressed }) => [
              styles.tab,
              activeTab === "code" && { backgroundColor: colors.primary },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "code" ? "#FFFFFF" : colors.muted },
              ]}
            >
              {"\uD83D\uDD11"} Tengo código
            </Text>
          </Pressable>
        </View>

        {/* Subscribe Tab */}
        {activeTab === "subscribe" && (
          <View style={styles.formSection}>
            {/* Card Holder Name */}
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              Nombre del titular de la tarjeta
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\uD83D\uDC64"}</Text>
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                placeholder="Nombre completo"
                placeholderTextColor={colors.muted}
                value={cardHolder}
                onChangeText={(text) => {
                  setCardHolder(text);
                  setEmailError("");
                }}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Document ID (Cédula) */}
            <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>
              Cédula de identidad
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\uD83C\uDDF2"}</Text>
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                placeholder="0912345678"
                placeholderTextColor={colors.muted}
                value={documentId}
                onChangeText={(text) => {
                  setDocumentId(text.replace(/\D/g, ""));
                  setEmailError("");
                }}
                keyboardType="number-pad"
                maxLength={13}
                returnKeyType="next"
              />
            </View>

            {/* Phone Number */}
            <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>
              Número de celular
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\uD83D\uDCF1"}</Text>
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                placeholder="0987654321"
                placeholderTextColor={colors.muted}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/\D/g, ""));
                  setEmailError("");
                }}
                keyboardType="phone-pad"
                maxLength={13}
                returnKeyType="next"
              />
            </View>

            {/* Email Input */}
            <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>
              Tu correo electrónico
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: emailError ? colors.error : colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\uD83D\uDCE7"}</Text>
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                placeholder="docente@ejemplo.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>

            {emailError ? (
              <View style={styles.errorRow}>
                <Text style={{ fontSize: 14 }}>{"\u26A0\uFE0F"}</Text>
                <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text>
              </View>
            ) : null}

            {/* Pay Button */}
            <Pressable
              onPress={handlePayWithPayPhone}
              style={({ pressed }) => [
                styles.payButton,
                {
                  backgroundColor: selectedPlan === "annual" ? "#059669" : "#1e3a5f",
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{"\uD83D\uDCB3"}</Text>
              <Text style={styles.payButtonText}>
                Pagar {selectedPlan === "annual" ? "$58.71 (Anual)" : "$6.99 (Mensual)"}
              </Text>
            </Pressable>

            <Text style={[styles.paymentMethods, { color: colors.muted }]}>
              Visa, Mastercard y PayPhone Wallet
            </Text>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.muted }]}>
                ¿Ya pagaste?
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Verify Payment Button */}
            <Pressable
              onPress={handleCheckPayment}
              disabled={checkingPayment}
              style={({ pressed }) => [
                styles.verifyButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  opacity: checkingPayment ? 0.6 : pressed ? 0.9 : 1,
                },
              ]}
            >
              {checkingPayment ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Text style={{ fontSize: 18 }}>{"\uD83D\uDD13"}</Text>
                  <Text style={[styles.verifyButtonText, { color: colors.primary }]}>
                    Acceder
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Code Tab (Legacy) */}
        {activeTab === "code" && (
          <View style={styles.formSection}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              Código de acceso
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: codeError ? colors.error : colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{"\uD83D\uDD11"}</Text>
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                placeholder="Ingresa tu código"
                placeholderTextColor={colors.muted}
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  setCodeError("");
                }}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleUnlockCode}
              />
            </View>

            {codeError ? (
              <View style={styles.errorRow}>
                <Text style={{ fontSize: 14 }}>{"\u26A0\uFE0F"}</Text>
                <Text style={[styles.errorText, { color: colors.error }]}>{codeError}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleUnlockCode}
              disabled={codeLoading}
              style={({ pressed }) => [
                styles.payButton,
                {
                  backgroundColor: colors.primary,
                  opacity: codeLoading ? 0.6 : pressed ? 0.9 : 1,
                },
              ]}
            >
              {codeLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={{ fontSize: 18 }}>{"\uD83D\uDD13"}</Text>
                  <Text style={styles.payButtonText}>Activar Acceso</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Pressable
            onPress={handleWhatsApp}
            style={({ pressed }) => [
              styles.whatsappLink,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={{ fontSize: 16 }}>{"\uD83D\uDCAC"}</Text>
            <Text style={[styles.whatsappLinkText, { color: colors.primary }]}>
              ¿Necesitas ayuda? Escríbenos por WhatsApp
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Hecho en Ecuador, para docentes ecuatorianos
          </Text>
          <Text style={[styles.footerNote, { color: colors.muted }]}>
            {"\uD83D\uDD12"} Pagos seguros procesados por PayPhone
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function FeatureRow({
  emoji,
  text,
  color,
}: {
  emoji: string;
  text: string;
  color: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={[styles.featureText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  valueCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Plan Selector
  planSelectorSection: {
    marginBottom: 20,
  },
  planSelectorTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  planCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  bestValueBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  bestValueText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  planCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planCardRight: {
    alignItems: "flex-end",
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
  },
  planDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -1,
  },
  planPeriod: {
    fontSize: 12,
    marginTop: -2,
  },
  planTotal: {
    fontSize: 11,
    marginTop: 2,
  },
  savingsBanner: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "700",
  },
  noAutoRenewal: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 4,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Form
  formSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    height: 50,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    gap: 10,
    marginTop: 14,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  paymentMethods: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  helpSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  whatsappLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  whatsappLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  successSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  redirectText: {
    fontSize: 13,
    marginTop: 8,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  footerNote: {
    fontSize: 11,
  },
});
