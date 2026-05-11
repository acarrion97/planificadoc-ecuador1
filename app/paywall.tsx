import { useState, useCallback } from "react";
import {
  Text, View, TextInput, ScrollView, StyleSheet,
  Linking, Platform, ActivityIndicator, Image, Alert, Pressable,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAccess } from "@/lib/access-control";

const WHATSAPP_NUMBER = "593978833533";
type PlanType = "monthly" | "annual";
type AuthTab = "login" | "register" | "code";

export default function PaywallScreen() {
  const colors = useColors();
  const {
    loginWithPassword, registerAccount,
    unlockWithCode, unlockWithSubscription,
  } = useAccess();

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual");

  // ── Login state ───────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Register state ────────────────────────────────────────────────────────
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // ── After-auth: show payment form ─────────────────────────────────────────
  const [needsPayment, setNeedsPayment] = useState(false);
  const [payEmail, setPayEmail] = useState(""); // locked to account email
  const [payCardHolder, setPayCardHolder] = useState("");
  const [payDocumentId, setPayDocumentId] = useState("");
  const [payPhone, setPayPhone] = useState("");
  const [payError, setPayError] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);

  // ── Code (legacy) state ───────────────────────────────────────────────────
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  // ── Success ───────────────────────────────────────────────────────────────
  const [success, setSuccess] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = useCallback(async () => {
    if (!loginEmail.trim()) { setLoginError("Ingresa tu correo"); return; }
    if (!loginPassword) { setLoginError("Ingresa tu contraseña"); return; }
    setLoginError(""); setLoginLoading(true);
    try {
      const result = await loginWithPassword(loginEmail, loginPassword);
      if (result.success) {
        if (result.hasSubscription) {
          setSuccess(true);
        } else {
          // Account OK but no subscription → show payment
          setPayEmail(loginEmail.trim().toLowerCase());
          setNeedsPayment(true);
        }
      } else if (result.notFound) {
        setLoginError("No encontramos una cuenta con ese correo. ¿Quieres crear una?");
      } else {
        setLoginError(result.error || "Correo o contraseña incorrectos");
      }
    } finally { setLoginLoading(false); }
  }, [loginEmail, loginPassword, loginWithPassword]);

  const handleRegister = useCallback(async () => {
    if (!regNombre.trim()) { setRegError("Ingresa tu nombre completo"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) { setRegError("Correo inválido"); return; }
    if (regPassword.length < 6) { setRegError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (regPassword !== regConfirm) { setRegError("Las contraseñas no coinciden"); return; }
    setRegError(""); setRegLoading(true);
    try {
      const result = await registerAccount(regEmail, regPassword, regNombre);
      if (result.success) {
        if (result.hasSubscription) {
          setSuccess(true);
        } else {
          setPayEmail(regEmail.trim().toLowerCase());
          setNeedsPayment(true);
        }
      } else if (result.exists) {
        setRegError("Ya tienes una cuenta con ese correo. Inicia sesión.");
        setAuthTab("login");
        setLoginEmail(regEmail);
      } else {
        setRegError(result.error || "Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally { setRegLoading(false); }
  }, [regNombre, regEmail, regPassword, regConfirm, registerAccount]);

  const handlePayWithPayPhone = useCallback(async () => {
    if (!payCardHolder.trim()) { setPayError("Ingresa el nombre del titular"); return; }
    if (!payDocumentId || payDocumentId.length < 8) { setPayError("Ingresa tu cédula (mínimo 8 dígitos)"); return; }
    if (!payPhone || payPhone.length < 9) { setPayError("Ingresa tu número de celular"); return; }
    setPayError("");

    let formattedPhone = payPhone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) formattedPhone = "+593" + formattedPhone.substring(1);
    else if (formattedPhone.startsWith("593")) formattedPhone = "+" + formattedPhone;
    else formattedPhone = "+593" + formattedPhone;

    const paymentUrl = `https://planificadoc.app/api/payment/page?email=${encodeURIComponent(payEmail)}&plan=${selectedPlan}&documentId=${encodeURIComponent(payDocumentId)}&phoneNumber=${encodeURIComponent(formattedPhone)}&cardHolder=${encodeURIComponent(payCardHolder.trim())}`;

    try {
      if (Platform.OS === "web") window.open(paymentUrl, "_blank");
      else await Linking.openURL(paymentUrl);
    } catch {
      if (Platform.OS !== "web") Alert.alert("Error", "No se pudo abrir el navegador.");
    }
  }, [payEmail, payCardHolder, payDocumentId, payPhone, selectedPlan]);

  const handleCheckPayment = useCallback(async () => {
    setPayError(""); setCheckingPayment(true);
    try {
      const ok = await unlockWithSubscription(payEmail);
      if (ok) setSuccess(true);
      else setPayError("Pago aún no confirmado. Si acabas de pagar, espera unos segundos e intenta de nuevo.");
    } finally { setCheckingPayment(false); }
  }, [payEmail, unlockWithSubscription]);

  const handleUnlockCode = useCallback(async () => {
    if (!code.trim()) { setCodeError("Ingresa tu código"); return; }
    setCodeError(""); setCodeLoading(true);
    try {
      const result = await unlockWithCode(code);
      if (result.success) setSuccess(true);
      else if (result.blocked) setCodeError(result.message || "Código bloqueado por exceso de dispositivos.");
      else setCodeError("Código inválido. Verifica e intenta de nuevo.");
    } finally { setCodeLoading(false); }
  }, [code, unlockWithCode]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hola, necesito ayuda con mi suscripción de PlanificaDoc.");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    Linking.openURL(url).catch(() => { if (Platform.OS === "web") window.open(url, "_blank"); });
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#05966920" }]}>
            <Text style={{ fontSize: 56 }}>✅</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Acceso Activado</Text>
          <Text style={[styles.successSubtitle, { color: colors.muted }]}>
            Tu suscripción ha sido verificada.{"\n"}Bienvenido/a a PlanificaDoc.
          </Text>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
          <Text style={[styles.redirectText, { color: colors.muted }]}>Cargando la aplicación...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // ── Payment form (after login/register without subscription) ──────────────
  if (needsPayment) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerSection}>
            <Image source={require("@/assets/images/icon.png")} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appTitle, { color: colors.foreground }]}>Elige tu plan</Text>
            <Text style={[styles.appSubtitle, { color: colors.muted }]}>
              Cuenta: {payEmail}
            </Text>
          </View>

          {/* Plan selector */}
          <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} colors={colors} />

          {/* Payment fields */}
          <View style={styles.formSection}>
            <FieldLabel label="Nombre del titular de la tarjeta" colors={colors} />
            <FieldInput emoji="👤" placeholder="Tu nombre completo" value={payCardHolder} onChangeText={t => { setPayCardHolder(t); setPayError(""); }} autoCapitalize="words" colors={colors} />
            <FieldLabel label="Cédula de identidad" colors={colors} mt />
            <FieldInput emoji="🪪" placeholder="0912345678" value={payDocumentId} onChangeText={t => { setPayDocumentId(t.replace(/\D/g, "")); setPayError(""); }} keyboardType="number-pad" maxLength={13} colors={colors} />
            <FieldLabel label="Número de celular" colors={colors} mt />
            <FieldInput emoji="📱" placeholder="0987654321" value={payPhone} onChangeText={t => { setPayPhone(t.replace(/\D/g, "")); setPayError(""); }} keyboardType="phone-pad" maxLength={13} colors={colors} />

            {payError ? <ErrorRow text={payError} /> : null}

            <Pressable
              onPress={handlePayWithPayPhone}
              style={({ pressed }) => [styles.payButton, { backgroundColor: selectedPlan === "annual" ? "#059669" : "#1e3a5f", opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={{ fontSize: 20 }}>💳</Text>
              <Text style={styles.payButtonText}>
                Pagar {selectedPlan === "annual" ? "$58.71 (Anual)" : "$6.99 (Mensual)"}
              </Text>
            </Pressable>
            <Text style={[styles.paymentMethods, { color: colors.muted }]}>Visa, Mastercard y PayPhone Wallet</Text>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.muted }]}>¿Ya pagaste?</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Pressable
              onPress={handleCheckPayment} disabled={checkingPayment}
              style={({ pressed }) => [styles.verifyButton, { backgroundColor: colors.surface, borderColor: colors.primary, opacity: checkingPayment ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {checkingPayment
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <><Text style={{ fontSize: 18 }}>🔓</Text><Text style={[styles.verifyButtonText, { color: colors.primary }]}>Verificar pago</Text></>
              }
            </Pressable>
          </View>

          <HelpSection onWhatsApp={handleWhatsApp} colors={colors} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ── Main paywall ──────────────────────────────────────────────────────────
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.headerSection}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.appTitle, { color: colors.foreground }]}>PlanificaDoc</Text>
          <Text style={[styles.appSubtitle, { color: colors.muted }]}>
            Planificación curricular para docentes de Ecuador
          </Text>
        </View>

        {/* Value proposition */}
        <View style={[styles.valueCard, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
          <Text style={[styles.valueTitle, { color: colors.primary }]}>Planifica tu semana en 5 minutos</Text>
          <View style={styles.featureList}>
            <FeatureRow emoji="🔍" text="1,652+ destrezas del currículo ecuatoriano (EGB + BGU)" color={colors.foreground} />
            <FeatureRow emoji="✨" text="Temas sugeridos con estructura de clase ERCA" color={colors.foreground} />
            <FeatureRow emoji="📄" text="Exporta a PDF con formato oficial del MinEduc" color={colors.foreground} />
            <FeatureRow emoji="💾" text="Guarda y gestiona tus planificaciones" color={colors.foreground} />
            <FeatureRow emoji="♿" text="Diseño Universal para el Aprendizaje (DUA)" color={colors.foreground} />
            <FeatureRow emoji="🔄" text="Actualizaciones y nuevas destrezas incluidas" color={colors.foreground} />
          </View>
        </View>

        {/* Auth Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(["login", "register", "code"] as AuthTab[]).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setAuthTab(tab)}
              style={({ pressed }) => [
                styles.tab,
                authTab === tab && { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.tabText, { color: authTab === tab ? "#FFFFFF" : colors.muted }]}>
                {tab === "login" ? "🔑 Ingresar" : tab === "register" ? "✏️ Registrarse" : "🎫 Código"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── LOGIN TAB ── */}
        {authTab === "login" && (
          <View style={styles.formSection}>
            <Text style={[styles.formHint, { color: colors.muted }]}>
              Ingresa con tu cuenta de PlanificaDoc
            </Text>
            <FieldLabel label="Correo electrónico" colors={colors} />
            <FieldInput
              emoji="📧" placeholder="docente@ejemplo.com" value={loginEmail}
              onChangeText={t => { setLoginEmail(t); setLoginError(""); }}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              hasError={!!loginError} colors={colors}
            />
            <FieldLabel label="Contraseña" colors={colors} mt />
            <FieldInput
              emoji="🔒" placeholder="Tu contraseña" value={loginPassword}
              onChangeText={t => { setLoginPassword(t); setLoginError(""); }}
              secureTextEntry autoCapitalize="none"
              hasError={!!loginError} colors={colors}
            />
            {loginError ? <ErrorRow text={loginError} /> : null}
            <Pressable
              onPress={handleLogin} disabled={loginLoading}
              style={({ pressed }) => [styles.payButton, { backgroundColor: colors.primary, opacity: loginLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {loginLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>🔑</Text><Text style={styles.payButtonText}>Iniciar Sesión</Text></>
              }
            </Pressable>
            <Pressable onPress={() => setAuthTab("register")} style={styles.switchLink}>
              <Text style={[styles.switchLinkText, { color: colors.primary }]}>
                ¿No tienes cuenta? Regístrate aquí
              </Text>
            </Pressable>
          </View>
        )}

        {/* ── REGISTER TAB ── */}
        {authTab === "register" && (
          <View style={styles.formSection}>
            <Text style={[styles.formHint, { color: colors.muted }]}>
              Crea tu cuenta gratis — luego elige tu plan
            </Text>
            <FieldLabel label="Nombre completo" colors={colors} />
            <FieldInput
              emoji="👤" placeholder="Ej: María González" value={regNombre}
              onChangeText={t => { setRegNombre(t); setRegError(""); }}
              autoCapitalize="words" colors={colors}
            />
            <FieldLabel label="Correo electrónico" colors={colors} mt />
            <FieldInput
              emoji="📧" placeholder="docente@ejemplo.com" value={regEmail}
              onChangeText={t => { setRegEmail(t); setRegError(""); }}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              colors={colors}
            />
            <FieldLabel label="Contraseña" colors={colors} mt />
            <FieldInput
              emoji="🔒" placeholder="Mínimo 6 caracteres" value={regPassword}
              onChangeText={t => { setRegPassword(t); setRegError(""); }}
              secureTextEntry autoCapitalize="none" colors={colors}
            />
            <FieldLabel label="Confirmar contraseña" colors={colors} mt />
            <FieldInput
              emoji="🔒" placeholder="Repite tu contraseña" value={regConfirm}
              onChangeText={t => { setRegConfirm(t); setRegError(""); }}
              secureTextEntry autoCapitalize="none"
              hasError={!!regError} colors={colors}
            />
            {regError ? <ErrorRow text={regError} /> : null}
            <Pressable
              onPress={handleRegister} disabled={regLoading}
              style={({ pressed }) => [styles.payButton, { backgroundColor: "#059669", opacity: regLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {regLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>✅</Text><Text style={styles.payButtonText}>Crear Cuenta</Text></>
              }
            </Pressable>
            <Pressable onPress={() => setAuthTab("login")} style={styles.switchLink}>
              <Text style={[styles.switchLinkText, { color: colors.primary }]}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </Pressable>
          </View>
        )}

        {/* ── CODE TAB (legacy) ── */}
        {authTab === "code" && (
          <View style={styles.formSection}>
            <Text style={[styles.formHint, { color: colors.muted }]}>
              Si recibiste un código de acceso de tu institución
            </Text>
            <FieldLabel label="Código de acceso" colors={colors} />
            <FieldInput
              emoji="🎫" placeholder="Ej: DOCENTE001" value={code}
              onChangeText={t => { setCode(t.toUpperCase()); setCodeError(""); }}
              autoCapitalize="characters"
              hasError={!!codeError} colors={colors}
            />
            {codeError ? <ErrorRow text={codeError} /> : null}
            <Pressable
              onPress={handleUnlockCode} disabled={codeLoading}
              style={({ pressed }) => [styles.payButton, { backgroundColor: colors.primary, opacity: codeLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {codeLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>🔓</Text><Text style={styles.payButtonText}>Activar Acceso</Text></>
              }
            </Pressable>
          </View>
        )}

        <HelpSection onWhatsApp={handleWhatsApp} colors={colors} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>Hecho en Ecuador, para docentes ecuatorianos</Text>
          <Text style={[styles.footerNote, { color: colors.muted }]}>🔒 Pagos seguros procesados por PayPhone</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlanSelector({ selectedPlan, onSelect, colors }: { selectedPlan: PlanType; onSelect: (p: PlanType) => void; colors: any }) {
  return (
    <View style={styles.planSelectorSection}>
      <Text style={[styles.planSelectorTitle, { color: colors.foreground }]}>Elige tu plan</Text>
      <Pressable onPress={() => onSelect("annual")} style={({ pressed }) => [styles.planCard, { borderColor: selectedPlan === "annual" ? "#059669" : colors.border, borderWidth: selectedPlan === "annual" ? 2.5 : 1.5, backgroundColor: selectedPlan === "annual" ? "#05966908" : colors.surface, opacity: pressed ? 0.9 : 1 }]}>
        <View style={styles.bestValueBadge}><Text style={styles.bestValueText}>Mejor precio</Text></View>
        <View style={styles.planCardContent}>
          <View style={styles.planCardLeft}>
            <View style={styles.planRadio}>{selectedPlan === "annual" && <View style={[styles.planRadioInner, { backgroundColor: "#059669" }]} />}</View>
            <View><Text style={[styles.planName, { color: colors.foreground }]}>Anual</Text><Text style={[styles.planDuration, { color: colors.muted }]}>12 meses de acceso</Text></View>
          </View>
          <View style={styles.planCardRight}>
            <Text style={[styles.planPrice, { color: "#059669" }]}>$4.89</Text>
            <Text style={[styles.planPeriod, { color: colors.muted }]}>/mes</Text>
            <Text style={[styles.planTotal, { color: colors.muted }]}>$58.71 total</Text>
          </View>
        </View>
        <View style={[styles.savingsBanner, { backgroundColor: "#05966915" }]}><Text style={[styles.savingsText, { color: "#059669" }]}>⭐ Ahorras 30% vs. plan mensual</Text></View>
      </Pressable>
      <Pressable onPress={() => onSelect("monthly")} style={({ pressed }) => [styles.planCard, { borderColor: selectedPlan === "monthly" ? "#1e3a5f" : colors.border, borderWidth: selectedPlan === "monthly" ? 2.5 : 1.5, backgroundColor: selectedPlan === "monthly" ? "#1e3a5f08" : colors.surface, opacity: pressed ? 0.9 : 1 }]}>
        <View style={styles.planCardContent}>
          <View style={styles.planCardLeft}>
            <View style={styles.planRadio}>{selectedPlan === "monthly" && <View style={[styles.planRadioInner, { backgroundColor: "#1e3a5f" }]} />}</View>
            <View><Text style={[styles.planName, { color: colors.foreground }]}>Mensual</Text><Text style={[styles.planDuration, { color: colors.muted }]}>1 mes de acceso</Text></View>
          </View>
          <View style={styles.planCardRight}>
            <Text style={[styles.planPrice, { color: "#1e3a5f" }]}>$6.99</Text>
            <Text style={[styles.planPeriod, { color: colors.muted }]}>/mes</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function FieldLabel({ label, colors, mt }: { label: string; colors: any; mt?: boolean }) {
  return <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: mt ? 12 : 0 }]}>{label}</Text>;
}

function FieldInput({ emoji, placeholder, value, onChangeText, keyboardType, autoCapitalize, autoCorrect, secureTextEntry, maxLength, hasError, colors }: any) {
  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: hasError ? colors.error : colors.border }]}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <TextInput
        style={[styles.textInput, { color: colors.foreground }]}
        placeholder={placeholder} placeholderTextColor={colors.muted}
        value={value} onChangeText={onChangeText}
        keyboardType={keyboardType} autoCapitalize={autoCapitalize ?? "none"}
        autoCorrect={autoCorrect ?? false} secureTextEntry={secureTextEntry}
        maxLength={maxLength} returnKeyType="next"
      />
    </View>
  );
}

function ErrorRow({ text }: { text: string }) {
  return (
    <View style={styles.errorRow}>
      <Text style={{ fontSize: 14 }}>⚠️</Text>
      <Text style={styles.errorText}>{text}</Text>
    </View>
  );
}

function HelpSection({ onWhatsApp, colors }: { onWhatsApp: () => void; colors: any }) {
  return (
    <View style={styles.helpSection}>
      <Pressable onPress={onWhatsApp} style={({ pressed }) => [styles.whatsappLink, { opacity: pressed ? 0.7 : 1 }]}>
        <Text style={{ fontSize: 16 }}>💬</Text>
        <Text style={[styles.whatsappLinkText, { color: colors.primary }]}>¿Necesitas ayuda? Escríbenos por WhatsApp</Text>
      </Pressable>
    </View>
  );
}

function FeatureRow({ emoji, text, color }: { emoji: string; text: string; color: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={[styles.featureText, { color }]}>{text}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  headerSection: { alignItems: "center", marginTop: 20, marginBottom: 20 },
  logo: { width: 72, height: 72, borderRadius: 18, marginBottom: 12 },
  appTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  appSubtitle: { fontSize: 14, marginTop: 4, textAlign: "center" },
  valueCard: { borderRadius: 16, padding: 18, borderWidth: 1, marginBottom: 20 },
  valueTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14, textAlign: "center" },
  featureList: { gap: 10 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontSize: 13, flex: 1, lineHeight: 18 },
  // Plan
  planSelectorSection: { marginBottom: 20 },
  planSelectorTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 14 },
  planCard: { borderRadius: 14, padding: 16, marginBottom: 10, position: "relative", overflow: "hidden" },
  bestValueBadge: { position: "absolute", top: 0, right: 0, backgroundColor: "#059669", paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 10 },
  bestValueText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  planCardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  planRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#CBD5E1", justifyContent: "center", alignItems: "center" },
  planRadioInner: { width: 12, height: 12, borderRadius: 6 },
  planCardRight: { alignItems: "flex-end" },
  planName: { fontSize: 16, fontWeight: "700" },
  planDuration: { fontSize: 12, marginTop: 2 },
  planPrice: { fontSize: 24, fontWeight: "800", letterSpacing: -1 },
  planPeriod: { fontSize: 12, marginTop: -2 },
  planTotal: { fontSize: 11, marginTop: 2 },
  savingsBanner: { marginTop: 10, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignItems: "center" },
  savingsText: { fontSize: 12, fontWeight: "700" },
  // Tabs
  tabContainer: { flexDirection: "row", borderRadius: 12, borderWidth: 1, padding: 3, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabText: { fontSize: 12, fontWeight: "600" },
  // Form
  formSection: { marginBottom: 20 },
  formHint: { fontSize: 13, textAlign: "center", marginBottom: 16, lineHeight: 18 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 10, marginBottom: 4 },
  textInput: { flex: 1, fontSize: 15, height: 50 },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 4, paddingHorizontal: 4 },
  errorText: { fontSize: 12, fontWeight: "500", flex: 1, color: "#DC2626" },
  payButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 15, borderRadius: 14, gap: 10, marginTop: 14 },
  payButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  paymentMethods: { fontSize: 12, textAlign: "center", marginTop: 8 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18, gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontWeight: "500" },
  verifyButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 14, borderWidth: 2, gap: 8 },
  verifyButtonText: { fontSize: 15, fontWeight: "700" },
  switchLink: { alignItems: "center", marginTop: 14, paddingVertical: 4 },
  switchLinkText: { fontSize: 14, fontWeight: "600" },
  // Help
  helpSection: { alignItems: "center", marginBottom: 20 },
  whatsappLink: { flexDirection: "row", alignItems: "center", gap: 8 },
  whatsappLinkText: { fontSize: 14, fontWeight: "600" },
  // Success
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  successIcon: { width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: "800" },
  successSubtitle: { fontSize: 15, textAlign: "center", marginTop: 8, lineHeight: 22 },
  redirectText: { fontSize: 13, marginTop: 8 },
  // Footer
  footer: { alignItems: "center", paddingBottom: 20, gap: 4 },
  footerText: { fontSize: 12 },
  footerNote: { fontSize: 11 },
});
