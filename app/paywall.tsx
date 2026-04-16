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

export default function PaywallScreen() {
  const colors = useColors();
  const {
    unlockWithCode,
    unlockWithSubscription,
    checkSubscriptionStatus,
  } = useAccess();

  // Tab state: "subscribe" or "code"
  const [activeTab, setActiveTab] = useState<"subscribe" | "code">("subscribe");

  // Subscription state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pricing, setPricing] = useState<{
    amount: number;
    label: string;
    isPromo: boolean;
    promoMonthsRemaining?: number;
  } | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Code state (legacy)
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  // Success state
  const [success, setSuccess] = useState(false);

  // Load default pricing on mount
  useEffect(() => {
    fetchPricing("");
  }, []);

  const fetchPricing = async (emailVal: string) => {
    try {
      setLoadingPricing(true);
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/payment/pricing?email=${encodeURIComponent(emailVal)}`;
      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      setPricing(data);
    } catch {
      setPricing({
        amount: 499,
        label: "$4.99/mes (precio introductorio)",
        isPromo: true,
        promoMonthsRemaining: 3,
      });
    } finally {
      setLoadingPricing(false);
    }
  };

  const validateEmail = (e: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e.trim());
  };

  const handlePayWithPayPhone = useCallback(async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError("Ingresa tu correo electronico");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setEmailError("Ingresa un correo valido");
      return;
    }
    setEmailError("");

    // Always use planificadoc.app for payment page so PayPhone domain validation passes
    const PAYMENT_BASE_URL = "https://planificadoc.app";
    const paymentUrl = `${PAYMENT_BASE_URL}/api/payment/page?email=${encodeURIComponent(trimmedEmail)}`;

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
  }, [email]);

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
        setEmailError("No se encontro una suscripcion activa para este correo. Si acabas de pagar, espera unos segundos e intenta de nuevo.");
      }
    } catch {
      setEmailError("Error al verificar. Intenta de nuevo.");
    } finally {
      setCheckingPayment(false);
    }
  }, [email, unlockWithSubscription]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hola, necesito ayuda con mi suscripcion de PlanificaDoc."
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
      setCodeError("Ingresa tu codigo de acceso");
      return;
    }
    setCodeError("");
    setCodeLoading(true);
    try {
      const result = await unlockWithCode(code);
      if (result) {
        setSuccess(true);
      } else {
        setCodeError("Codigo invalido. Verifica e intenta de nuevo.");
      }
    } catch {
      setCodeError("Error al verificar el codigo.");
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
            Tu suscripcion ha sido verificada.{"\n"}Bienvenido/a a PlanificaDoc.
          </Text>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
          <Text style={[styles.redirectText, { color: colors.muted }]}>
            Cargando la aplicacion...
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
            Planificacion curricular para docentes de Ecuador
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
            <FeatureRow emoji={"\uD83D\uDD0D"} text="1,253+ destrezas del curriculo ecuatoriano" color={colors.foreground} />
            <FeatureRow emoji={"\u2728"} text="Temas sugeridos con estructura de clase ERCA" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDCC4"} text="Exporta a PDF con formato oficial del MinEduc" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDCBE"} text="Guarda y gestiona tus planificaciones" color={colors.foreground} />
            <FeatureRow emoji={"\u267F"} text="Diseno Universal para el Aprendizaje (DUA)" color={colors.foreground} />
            <FeatureRow emoji={"\uD83D\uDD04"} text="Actualizaciones y nuevas destrezas incluidas" color={colors.foreground} />
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.priceSection}>
          {pricing?.isPromo ? (
            <>
              <View style={[styles.promoBadge, { backgroundColor: colors.success + "15" }]}>
                <Text style={[styles.promoBadgeText, { color: colors.success }]}>
                  {"\u2B50"} Precio introductorio
                </Text>
              </View>
              <Text style={[styles.priceAmount, { color: colors.foreground }]}>
                $4<Text style={[styles.priceCents, { color: colors.muted }]}>.99</Text>
                <Text style={[styles.pricePeriod, { color: colors.muted }]}>/mes</Text>
              </Text>
              <Text style={[styles.priceNote, { color: colors.muted }]}>
                Primeros {pricing.promoMonthsRemaining || 3} meses. Luego $6.99/mes
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.priceAmount, { color: colors.foreground }]}>
                $6<Text style={[styles.priceCents, { color: colors.muted }]}>.99</Text>
                <Text style={[styles.pricePeriod, { color: colors.muted }]}>/mes</Text>
              </Text>
            </>
          )}
          <Text style={[styles.priceCompare, { color: colors.success }]}>
            Menos que un almuerzo. Ahorra horas cada semana.
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
              {"\uD83D\uDD11"} Tengo codigo
            </Text>
          </Pressable>
        </View>

        {/* Subscribe Tab */}
        {activeTab === "subscribe" && (
          <View style={styles.formSection}>
            {/* Email Input */}
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              Tu correo electronico
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
                  // Fetch pricing when email changes
                  if (validateEmail(text)) {
                    fetchPricing(text.trim());
                  }
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
                { backgroundColor: "#1e3a5f", opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{"\uD83D\uDCB3"}</Text>
              <Text style={styles.payButtonText}>
                Pagar con Tarjeta
              </Text>
            </Pressable>

            <Text style={[styles.paymentMethods, { color: colors.muted }]}>
              Visa, Mastercard y PayPhone Wallet
            </Text>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.muted }]}>
                Ya pagaste?
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
              Codigo de acceso
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
                placeholder="Ingresa tu codigo"
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
              Necesitas ayuda? Escribenos por WhatsApp
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
  priceSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  promoBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  promoBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  priceAmount: {
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -2,
  },
  priceCents: {
    fontSize: 22,
    fontWeight: "600",
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceNote: {
    fontSize: 13,
    marginTop: 2,
  },
  priceCompare: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
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
