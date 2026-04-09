import { useState } from "react";
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
} from "react-native";
import { Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAccess } from "@/lib/access-control";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Número de WhatsApp del vendedor (cambiar por el tuyo)
// Formato internacional sin + ni espacios: 593XXXXXXXXX
const WHATSAPP_NUMBER = "593978833533";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero adquirir PlanificaDoc ($5). ¿Cómo puedo realizar el pago?"
);

export default function PaywallScreen() {
  const colors = useColors();
  const { unlockWithCode } = useAccess();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnlock = async () => {
    if (code.trim().length === 0) {
      setError("Ingresa tu código de acceso");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await unlockWithCode(code);
      if (result) {
        setSuccess(true);
        // The _layout.tsx will automatically redirect when hasAccess becomes true
      } else {
        setError("Código inválido. Verifica e intenta de nuevo.");
      }
    } catch {
      setError("Error al verificar el código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
    Linking.openURL(url).catch(() => {
      // Fallback for web
      if (Platform.OS === "web") {
        window.open(url, "_blank");
      }
    });
  };

  if (success) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success + "20" }]}>
            <MaterialIcons name="check-circle" size={64} color={colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            Acceso Activado
          </Text>
          <Text style={[styles.successSubtitle, { color: colors.muted }]}>
            Tu código ha sido verificado correctamente.{"\n"}Bienvenido/a a PlanificaDoc.
          </Text>
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginTop: 20 }}
          />
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
        <View style={[styles.valueCard, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
          <Text style={[styles.valueTitle, { color: colors.primary }]}>
            Planifica tu semana en 5 minutos
          </Text>
          <View style={styles.featureList}>
            <FeatureRow emoji="🔍" text="83 destrezas del currículo ecuatoriano" color={colors.foreground} />
            <FeatureRow emoji="✨" text="Temas sugeridos con estructura de clase ERCA" color={colors.foreground} />
            <FeatureRow emoji="📄" text="Exporta a PDF con formato oficial del MinEduc" color={colors.foreground} />
            <FeatureRow emoji="💾" text="Guarda y gestiona tus planificaciones." color={colors.foreground} />
            <FeatureRow emoji="🔄" text="Actualizaciones y nuevas destrezas incluidas." color={colors.foreground} />
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={[styles.priceLabel, { color: colors.muted }]}>
            Acceso completo — pago único
          </Text>
          <Text style={[styles.priceAmount, { color: colors.foreground }]}>
            $5<Text style={[styles.priceCurrency, { color: colors.muted }]}>.00</Text>
          </Text>
          <Text style={[styles.priceNote, { color: colors.success }]}>
            Menos que un almuerzo. Ahorra horas cada semana.
          </Text>
        </View>

        {/* WhatsApp CTA */}
        <Pressable
          onPress={handleWhatsApp}
          style={({ pressed }) => [
            styles.whatsappButton,
            { backgroundColor: "#25D366", opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <MaterialIcons name="chat" size={22} color="#FFFFFF" />
          <Text style={styles.whatsappButtonText}>
            Comprar por WhatsApp
          </Text>
        </Pressable>

        <Text style={[styles.whatsappHint, { color: colors.muted }]}>
          Escríbenos, te damos los datos de transferencia{"\n"}y recibes tu código de acceso al instante.
        </Text>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.muted }]}>
            ¿Ya tienes tu código?
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Code input */}
        <View style={styles.codeSection}>
          <View
            style={[
              styles.codeInputContainer,
              {
                backgroundColor: colors.surface,
                borderColor: error ? colors.error : colors.border,
              },
            ]}
          >
            <MaterialIcons name="vpn-key" size={20} color={colors.muted} />
            <TextInput
              style={[styles.codeInput, { color: colors.foreground }]}
              placeholder="Ingresa tu código de acceso"
              placeholderTextColor={colors.muted}
              value={code}
              onChangeText={(text) => {
                setCode(text.toUpperCase());
                setError("");
              }}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={handleUnlock}
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={16} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleUnlock}
            disabled={loading}
            style={({ pressed }) => [
              styles.unlockButton,
              {
                backgroundColor: colors.primary,
                opacity: loading ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="lock-open" size={20} color="#FFFFFF" />
                <Text style={styles.unlockButtonText}>Activar Acceso</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Hecho en Ecuador, para docentes ecuatorianos
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
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
  },
  valueCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -2,
    marginTop: 4,
  },
  priceCurrency: {
    fontSize: 24,
    fontWeight: "600",
  },
  priceNote: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    marginBottom: 8,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  whatsappHint: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  codeSection: {
    marginBottom: 32,
  },
  codeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    height: 52,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "500",
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    marginTop: 14,
  },
  unlockButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
  },
  footerText: {
    fontSize: 12,
  },
});
