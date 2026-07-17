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

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function PaywallScreen() {
  const colors = useColors();
  const { loginWithPassword, registerAccount, unlockWithCode, unlockWithSubscription } = useAccess();

  const [authTab, setAuthTab]           = useState<AuthTab>("login");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual");

  // Login
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError]       = useState("");
  const [loginLoading, setLoginLoading]   = useState(false);

  // Register
  const [regNombre, setRegNombre]     = useState("");
  const [regEmail, setRegEmail]       = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm]   = useState("");
  const [regError, setRegError]       = useState("");
  const [regLoading, setRegLoading]   = useState(false);

  // Payment step
  const [needsPayment, setNeedsPayment]   = useState(false);
  const [payEmail, setPayEmail]           = useState("");
  const [payCardHolder, setPayCardHolder] = useState("");
  const [payDocumentId, setPayDocumentId] = useState("");
  const [payPhone, setPayPhone]           = useState("");
  const [payError, setPayError]           = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Code
  const [code, setCode]           = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleLogin = useCallback(async () => {
    if (!loginEmail.trim()) { setLoginError("Ingresa tu correo"); return; }
    if (!loginPassword) { setLoginError("Ingresa tu contraseña"); return; }
    setLoginError(""); setLoginLoading(true);
    try {
      const result = await loginWithPassword(loginEmail, loginPassword);
      if (result.success) {
        if (result.hasSubscription) setSuccess(true);
        else { setPayEmail(loginEmail.trim().toLowerCase()); setNeedsPayment(true); }
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
        if (result.hasSubscription) setSuccess(true);
        else { setPayEmail(regEmail.trim().toLowerCase()); setNeedsPayment(true); }
      } else if (result.exists) {
        setAuthTab("login");
        setLoginEmail(regEmail.trim().toLowerCase());
        setLoginError("Ya tienes una cuenta con ese correo. Ingresa tu contraseña.");
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

    let phone = payPhone.replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) phone = "+593" + phone.substring(1);
    else if (phone.startsWith("593")) phone = "+" + phone;
    else phone = "+593" + phone;

    // Leer cookies Meta (_fbp / _fbc) antes de abrir la ventana de pago
    let fbp: string | null = null;
    let fbc: string | null = null;
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const getCookie = (name: string) => {
        const match = document.cookie.split("; ").find((r) => r.startsWith(name + "="));
        return match ? match.split("=").slice(1).join("=") : null;
      };
      fbp = getCookie("_fbp");
      fbc = getCookie("_fbc");
      if (!fbc && typeof window !== "undefined") {
        const fbclid = new URLSearchParams(window.location.search).get("fbclid");
        if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
      }
    }

    let url = `https://planificadoc.app/api/payment/page?email=${encodeURIComponent(payEmail)}&plan=${selectedPlan}&documentId=${encodeURIComponent(payDocumentId)}&phoneNumber=${encodeURIComponent(phone)}&cardHolder=${encodeURIComponent(payCardHolder.trim())}`;
    if (fbp) url += `&fbp=${encodeURIComponent(fbp)}`;
    if (fbc) url += `&fbc=${encodeURIComponent(fbc)}`;

    try {
      if (Platform.OS === "web") window.open(url, "_blank");
      else await Linking.openURL(url);
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

  // ── Pantalla de éxito ────────────────────────────────────────────────────────
  if (success) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={s.centerFill}>
          <View style={[s.successCircle, { backgroundColor: "#05966915" }]}>
            <Text style={{ fontSize: 60 }}>✅</Text>
          </View>
          <Text style={[s.h1, { color: colors.foreground, marginTop: 24 }]}>¡Acceso Activado!</Text>
          <Text style={[s.subtitle, { color: colors.muted, marginTop: 10 }]}>
            Tu suscripción ha sido verificada.{"\n"}Bienvenido/a a PlanificaDoc.
          </Text>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 28 }} />
          <Text style={[s.small, { color: colors.muted, marginTop: 8 }]}>Cargando la aplicación...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // ── Paso 2: Elegir plan y pagar ──────────────────────────────────────────────
  if (needsPayment) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Header compacto */}
          <View style={s.payHeader}>
            <Text style={{ fontSize: 32 }}>📚</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.payHeaderTitle, { color: colors.foreground }]}>Elige tu plan</Text>
              <Text style={[s.payHeaderSub, { color: colors.muted }]}>{payEmail}</Text>
            </View>
          </View>

          {/* Tarjetas de plan — lado a lado */}
          <View style={s.planRow}>

            {/* MENSUAL */}
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              style={({ pressed }) => [s.planCard, { opacity: pressed ? 0.93 : 1 }]}
            >
              <View style={s.planBadgeBlue}>
                <Text style={s.planBadgeText}>⭐ MÁS POPULAR</Text>
              </View>
              <Text style={s.planCardLabel}>MENSUAL</Text>
              <View style={s.planPriceRow}>
                <Text style={s.planDollar}>$</Text>
                <Text style={s.planBig}>6</Text>
                <Text style={s.planCents}>.99</Text>
              </View>
              <Text style={s.planSubLabel}>por mes · cancela cuando quieras</Text>

              <View style={s.featuresList}>
                {[
                  "Planes diarios ilimitados",
                  "Plan semanal (5 días)",
                  "Educación Inicial completa",
                  "IA con Marzano + DUA",
                  "Exportar Word y PDF",
                  "Soporte prioritario",
                ].map(f => (
                  <View key={f} style={s.featureItem}>
                    <Text style={s.featureCheck}>✓</Text>
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              <View style={s.extraNote}>
                <Text style={s.extraNoteTitle}>📌 Disponible como pago adicional:</Text>
                <Text style={s.extraNoteText}>· Planificación Trimestral (PCT) — pago por documento{"\n"}· Plan Curricular Anual (PCA) — pago por documento</Text>
              </View>

              <View style={[s.planSelectBtn, selectedPlan === "monthly" ? s.planSelectBtnActive : s.planSelectBtnInactive]}>
                <Text style={[s.planSelectBtnText, selectedPlan === "monthly" ? { color: "#2563eb" } : { color: "#fff" }]}>
                  {selectedPlan === "monthly" ? "✓ Seleccionado" : "Suscribirme ahora"}
                </Text>
              </View>
              <Text style={s.planSelectNote}>✓ Acceso inmediato tras el pago</Text>
            </Pressable>

            {/* ANUAL */}
            <Pressable
              onPress={() => setSelectedPlan("annual")}
              style={({ pressed }) => [s.planCard, s.planCardDark, { opacity: pressed ? 0.93 : 1 }]}
            >
              <View style={s.planBadgeGold}>
                <Text style={s.planBadgeText}>✅ TODO INCLUIDO</Text>
              </View>
              <Text style={[s.planCardLabel, { color: "#e2e8f0" }]}>ANUAL</Text>
              <View style={s.planPriceRow}>
                <Text style={[s.planDollar, { color: "#fbbf24" }]}>$</Text>
                <Text style={[s.planBig, { color: "#fbbf24" }]}>4</Text>
                <Text style={[s.planCents, { color: "#fbbf24" }]}>.89</Text>
              </View>
              <Text style={[s.planSubLabel, { color: "#94a3b8" }]}>por mes · facturado anualmente ($58.71)</Text>

              <View style={s.featuresList}>
                {[
                  "TODO del plan mensual",
                  "PCT incluido sin costo extra",
                  "PCA incluido sin costo extra",
                  "Ahorra $25.17 al año vs mensual",
                  "12 meses continuos asegurados",
                  "Soporte VIP",
                ].map(f => (
                  <View key={f} style={s.featureItem}>
                    <Text style={[s.featureCheck, { color: "#fbbf24" }]}>✓</Text>
                    <Text style={[s.featureText, { color: "#e2e8f0" }]}>{f}</Text>
                  </View>
                ))}
              </View>

              <View style={[s.planSelectBtn, selectedPlan === "annual" ? s.planSelectBtnGold : s.planSelectBtnGoldOutline]}>
                <Text style={[s.planSelectBtnText, { color: selectedPlan === "annual" ? "#1e293b" : "#fbbf24" }]}>
                  {selectedPlan === "annual" ? "✓ Seleccionado" : "Obtener plan anual"}
                </Text>
              </View>
              <Text style={[s.planSelectNote, { color: "#94a3b8" }]}>✨ La opción más completa y económica</Text>
            </Pressable>

          </View>

          {/* Formulario de tarjeta */}
          <View style={[s.cardForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[s.cardFormTitle, { color: colors.foreground }]}>💳 Datos de pago</Text>
            <Text style={[s.cardFormSub, { color: colors.muted }]}>
              Tu tarjeta se guardará para renovación automática
            </Text>

            <FieldLabel label="Nombre del titular" colors={colors} />
            <FieldInput emoji="👤" placeholder="Como aparece en la tarjeta" value={payCardHolder}
              onChangeText={t => { setPayCardHolder(t); setPayError(""); }} autoCapitalize="words" colors={colors} />

            <FieldLabel label="Cédula de identidad" colors={colors} mt />
            <FieldInput emoji="🪪" placeholder="0912345678" value={payDocumentId}
              onChangeText={t => { setPayDocumentId(t.replace(/\D/g, "")); setPayError(""); }}
              keyboardType="number-pad" maxLength={13} colors={colors} />

            <FieldLabel label="Número de celular" colors={colors} mt />
            <FieldInput emoji="📱" placeholder="0987654321" value={payPhone}
              onChangeText={t => { setPayPhone(t.replace(/\D/g, "")); setPayError(""); }}
              keyboardType="phone-pad" maxLength={13} colors={colors} />

            {payError ? <ErrorRow text={payError} /> : null}
          </View>

          {/* Botón pagar */}
          <Pressable
            onPress={handlePayWithPayPhone}
            style={({ pressed }) => [
              s.payBtn,
              { backgroundColor: selectedPlan === "annual" ? "#059669" : "#2563eb", opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={{ fontSize: 22 }}>💳</Text>
            <View>
              <Text style={s.payBtnText}>
                Pagar {selectedPlan === "annual" ? "$58.71" : "$6.99"}
              </Text>
              <Text style={s.payBtnSub}>
                {selectedPlan === "annual" ? "Plan Anual · Visa / Mastercard" : "Plan Mensual · Visa / Mastercard"}
              </Text>
            </View>
          </Pressable>

          {/* ¿Ya pagaste? */}
          <View style={s.alreadyPaidRow}>
            <View style={[s.divLine, { backgroundColor: colors.border }]} />
            <Text style={[s.divLabel, { color: colors.muted }]}>¿Ya pagaste?</Text>
            <View style={[s.divLine, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            onPress={handleCheckPayment} disabled={checkingPayment}
            style={({ pressed }) => [s.verifyBtn, { borderColor: colors.primary, backgroundColor: colors.surface, opacity: checkingPayment ? 0.6 : pressed ? 0.9 : 1 }]}
          >
            {checkingPayment
              ? <ActivityIndicator size="small" color={colors.primary} />
              : <><Text style={{ fontSize: 18 }}>🔓</Text><Text style={[s.verifyBtnText, { color: colors.primary }]}>Verificar mi pago</Text></>
            }
          </Pressable>

          <Text style={[s.secNote, { color: colors.muted }]}>🔒 Pagos seguros · PayPhone · Renovación automática cancelable</Text>

          <HelpSection onWhatsApp={handleWhatsApp} colors={colors} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ── Pantalla principal (auth) ────────────────────────────────────────────────
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={s.hero}>
          <Image source={require("@/assets/images/icon.png")} style={s.logo} resizeMode="contain" />
          <Text style={[s.h1, { color: colors.foreground }]}>PlanificaDoc</Text>
          <Text style={[s.subtitle, { color: colors.muted }]}>
            Planificación curricular con IA para docentes del Ecuador
          </Text>
        </View>

        {/* Value props */}
        <View style={[s.valueBox, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
          <Text style={[s.valueTitle, { color: colors.primary }]}>¿Qué obtienes?</Text>
          {[
            { e: "🔍", t: "1,652+ destrezas EGB y BGU del currículo nacional" },
            { e: "✨", t: "Generación de planes semanales con IA (ERCA y ACC)" },
            { e: "📋", t: "PCA y PCT con exportación Word y PDF formato MinEduc" },
            { e: "♿", t: "Diseño Universal para el Aprendizaje integrado" },
            { e: "🔄", t: "Acceso a todas las actualizaciones futuras" },
          ].map(({ e, t }) => (
            <View key={t} style={s.valueRow}>
              <Text style={{ fontSize: 18 }}>{e}</Text>
              <Text style={[s.valueText, { color: colors.foreground }]}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Plan preview pills */}
        <View style={s.previewPills}>
          <View style={[s.pill, { backgroundColor: "#05966918", borderColor: "#05966940" }]}>
            <Text style={[s.pillText, { color: "#059669" }]}>⭐ Anual — $4.89/mes</Text>
          </View>
          <View style={[s.pill, { backgroundColor: "#2563eb12", borderColor: "#2563eb30" }]}>
            <Text style={[s.pillText, { color: "#2563eb" }]}>Mensual — $6.99/mes</Text>
          </View>
        </View>

        {/* Auth tabs */}
        <View style={[s.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(["login", "register", "code"] as AuthTab[]).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setAuthTab(tab)}
              style={({ pressed }) => [
                s.tab,
                authTab === tab && { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[s.tabText, { color: authTab === tab ? "#FFF" : colors.muted }]}>
                {tab === "login" ? "🔑 Ingresar" : tab === "register" ? "✏️ Registrarse" : "🎫 Código"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* LOGIN */}
        {authTab === "login" && (
          <View style={s.formBox}>
            <Text style={[s.formHint, { color: colors.muted }]}>Ingresa con tu cuenta de PlanificaDoc</Text>
            <FieldLabel label="Correo electrónico" colors={colors} />
            <FieldInput emoji="📧" placeholder="docente@ejemplo.com" value={loginEmail}
              onChangeText={t => { setLoginEmail(t); setLoginError(""); }}
              keyboardType="email-address" autoCapitalize="none" hasError={!!loginError} colors={colors} />
            <FieldLabel label="Contraseña" colors={colors} mt />
            <FieldInput emoji="🔒" placeholder="Tu contraseña" value={loginPassword}
              onChangeText={t => { setLoginPassword(t); setLoginError(""); }}
              secureTextEntry autoCapitalize="none" hasError={!!loginError} colors={colors} />
            {loginError ? <ErrorRow text={loginError} /> : null}
            <Pressable
              onPress={handleLogin} disabled={loginLoading}
              style={({ pressed }) => [s.authBtn, { backgroundColor: colors.primary, opacity: loginLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {loginLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>🔑</Text><Text style={s.authBtnText}>Iniciar Sesión</Text></>
              }
            </Pressable>
            <Pressable onPress={() => setAuthTab("register")} style={s.switchLink}>
              <Text style={[s.switchLinkText, { color: colors.primary }]}>¿No tienes cuenta? Regístrate aquí →</Text>
            </Pressable>
          </View>
        )}

        {/* REGISTER */}
        {authTab === "register" && (
          <View style={s.formBox}>
            <Text style={[s.formHint, { color: colors.muted }]}>Crea tu cuenta — luego elige tu plan</Text>
            <FieldLabel label="Nombre completo" colors={colors} />
            <FieldInput emoji="👤" placeholder="Ej: María González" value={regNombre}
              onChangeText={t => { setRegNombre(t); setRegError(""); }} autoCapitalize="words" colors={colors} />
            <FieldLabel label="Correo electrónico" colors={colors} mt />
            <FieldInput emoji="📧" placeholder="docente@ejemplo.com" value={regEmail}
              onChangeText={t => { setRegEmail(t); setRegError(""); }}
              keyboardType="email-address" autoCapitalize="none" colors={colors} />
            <FieldLabel label="Contraseña" colors={colors} mt />
            <FieldInput emoji="🔒" placeholder="Mínimo 6 caracteres" value={regPassword}
              onChangeText={t => { setRegPassword(t); setRegError(""); }}
              secureTextEntry autoCapitalize="none" colors={colors} />
            <FieldLabel label="Confirmar contraseña" colors={colors} mt />
            <FieldInput emoji="🔒" placeholder="Repite tu contraseña" value={regConfirm}
              onChangeText={t => { setRegConfirm(t); setRegError(""); }}
              secureTextEntry autoCapitalize="none" hasError={!!regError} colors={colors} />
            {regError ? <ErrorRow text={regError} /> : null}
            <Pressable
              onPress={handleRegister} disabled={regLoading}
              style={({ pressed }) => [s.authBtn, { backgroundColor: "#059669", opacity: regLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {regLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>✅</Text><Text style={s.authBtnText}>Crear Cuenta</Text></>
              }
            </Pressable>
            <Pressable onPress={() => setAuthTab("login")} style={s.switchLink}>
              <Text style={[s.switchLinkText, { color: colors.primary }]}>¿Ya tienes cuenta? Inicia sesión →</Text>
            </Pressable>
          </View>
        )}

        {/* CODE */}
        {authTab === "code" && (
          <View style={s.formBox}>
            <Text style={[s.formHint, { color: colors.muted }]}>Si recibiste un código de acceso de tu institución</Text>
            <FieldLabel label="Código de acceso" colors={colors} />
            <FieldInput emoji="🎫" placeholder="Ej: DOCENTE001" value={code}
              onChangeText={t => { setCode(t.toUpperCase()); setCodeError(""); }}
              autoCapitalize="characters" hasError={!!codeError} colors={colors} />
            {codeError ? <ErrorRow text={codeError} /> : null}
            <Pressable
              onPress={handleUnlockCode} disabled={codeLoading}
              style={({ pressed }) => [s.authBtn, { backgroundColor: colors.primary, opacity: codeLoading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {codeLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <><Text style={{ fontSize: 18 }}>🔓</Text><Text style={s.authBtnText}>Activar Acceso</Text></>
              }
            </Pressable>
          </View>
        )}

        <HelpSection onWhatsApp={handleWhatsApp} colors={colors} />

        <View style={s.footer}>
          <Text style={[s.footerText, { color: colors.muted }]}>🇪🇨 Hecho en Ecuador, para docentes ecuatorianos</Text>
          <Text style={[s.footerText, { color: colors.muted }]}>🔒 Pagos seguros procesados por PayPhone</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ── Sub-componentes ────────────────────────────────────────────────────────────

function FieldLabel({ label, colors, mt }: { label: string; colors: any; mt?: boolean }) {
  return <Text style={[s.inputLabel, { color: colors.foreground, marginTop: mt ? 14 : 0 }]}>{label}</Text>;
}

function FieldInput({ emoji, placeholder, value, onChangeText, keyboardType, autoCapitalize, autoCorrect, secureTextEntry, maxLength, hasError, colors }: any) {
  return (
    <View style={[s.inputRow, { backgroundColor: colors.background ?? "#fff", borderColor: hasError ? "#DC2626" : colors.border }]}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <TextInput
        style={[s.inputText, { color: colors.foreground }]}
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
    <View style={s.errorRow}>
      <Text style={{ fontSize: 14 }}>⚠️</Text>
      <Text style={s.errorText}>{text}</Text>
    </View>
  );
}

function HelpSection({ onWhatsApp, colors }: { onWhatsApp: () => void; colors: any }) {
  return (
    <View style={s.helpRow}>
      <Pressable onPress={onWhatsApp} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flexDirection: "row", alignItems: "center", gap: 8 }]}>
        <Text style={{ fontSize: 16 }}>💬</Text>
        <Text style={[s.helpText, { color: colors.primary }]}>¿Necesitas ayuda? WhatsApp</Text>
      </Pressable>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll:        { paddingHorizontal: 20, paddingBottom: 48 },
  centerFill:    { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },

  // Hero / auth screen
  hero:          { alignItems: "center", marginTop: 24, marginBottom: 22 },
  logo:          { width: 76, height: 76, borderRadius: 20, marginBottom: 14 },
  h1:            { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, textAlign: "center" },
  subtitle:      { fontSize: 14, textAlign: "center", marginTop: 6, lineHeight: 20 },

  valueBox:      { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 18 },
  valueTitle:    { fontSize: 15, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  valueRow:      { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  valueText:     { fontSize: 13, flex: 1, lineHeight: 18 },

  previewPills:  { flexDirection: "row", gap: 10, marginBottom: 18 },
  pill:          { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 8, alignItems: "center" },
  pillText:      { fontSize: 12, fontWeight: "700" },

  tabs:          { flexDirection: "row", borderRadius: 14, borderWidth: 1, padding: 3, marginBottom: 18 },
  tab:           { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center" },
  tabText:       { fontSize: 12, fontWeight: "600" },

  formBox:       { marginBottom: 18 },
  formHint:      { fontSize: 13, textAlign: "center", marginBottom: 16, lineHeight: 18 },
  inputLabel:    { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputRow:      { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50, gap: 10, marginBottom: 4 },
  inputText:     { flex: 1, fontSize: 15, height: 50 },
  errorRow:      { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, paddingHorizontal: 2 },
  errorText:     { fontSize: 12, fontWeight: "500", flex: 1, color: "#DC2626" },
  authBtn:       { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 15, borderRadius: 14, gap: 10, marginTop: 14 },
  authBtnText:   { color: "#FFF", fontSize: 16, fontWeight: "700" },
  switchLink:    { alignItems: "center", marginTop: 14, paddingVertical: 4 },
  switchLinkText:{ fontSize: 13, fontWeight: "600" },

  helpRow:       { alignItems: "center", marginBottom: 20 },
  helpText:      { fontSize: 13, fontWeight: "600" },
  footer:        { alignItems: "center", gap: 4, paddingBottom: 10 },
  footerText:    { fontSize: 11 },
  small:         { fontSize: 13 },

  // Payment step
  payHeader:     { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 20, marginBottom: 20 },
  payHeaderTitle:{ fontSize: 20, fontWeight: "800" },
  payHeaderSub:  { fontSize: 12, marginTop: 2 },

  planRow:            { flexDirection: "row", gap: 10, marginBottom: 18 },
  planCard:           { flex: 1, borderRadius: 18, padding: 14, backgroundColor: "#1e40af", overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 6 },
  planCardDark:       { backgroundColor: "#0f172a" },
  planBadgeBlue:      { backgroundColor: "#f59e0b", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, alignSelf: "flex-start", marginBottom: 10 },
  planBadgeGold:      { backgroundColor: "#f59e0b", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, alignSelf: "flex-start", marginBottom: 10 },
  planBadgeText:      { color: "#1e293b", fontSize: 9, fontWeight: "800", letterSpacing: 0.3 },
  planCardLabel:      { color: "#bfdbfe", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginBottom: 4 },
  planPriceRow:       { flexDirection: "row", alignItems: "flex-start", marginBottom: 2 },
  planDollar:         { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 6 },
  planBig:            { color: "#fff", fontSize: 48, fontWeight: "900", lineHeight: 52, letterSpacing: -2 },
  planCents:          { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 8 },
  planSubLabel:       { color: "#bfdbfe", fontSize: 10, marginBottom: 14, lineHeight: 14 },
  featuresList:       { gap: 7, marginBottom: 14 },
  featureItem:        { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  featureCheck:       { color: "#6ee7b7", fontSize: 12, fontWeight: "800", marginTop: 1 },
  featureText:        { color: "#e0f2fe", fontSize: 11, flex: 1, lineHeight: 15 },
  extraNote:          { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 12 },
  extraNoteTitle:     { color: "#fca5a5", fontSize: 10, fontWeight: "700", marginBottom: 4 },
  extraNoteText:      { color: "#fecaca", fontSize: 10, lineHeight: 15 },
  planSelectBtn:      { borderRadius: 10, paddingVertical: 10, alignItems: "center", marginBottom: 6 },
  planSelectBtnActive:{ backgroundColor: "#fff" },
  planSelectBtnInactive:{ backgroundColor: "#2563eb", borderWidth: 1.5, borderColor: "#fff" },
  planSelectBtnGold:  { backgroundColor: "#fbbf24" },
  planSelectBtnGoldOutline: { borderWidth: 1.5, borderColor: "#fbbf24", backgroundColor: "transparent" },
  planSelectBtnText:  { fontSize: 12, fontWeight: "800" },
  planSelectNote:     { color: "#bfdbfe", fontSize: 10, textAlign: "center" },

  cardForm:      { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 18 },
  cardFormTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardFormSub:   { fontSize: 12, marginBottom: 14 },

  payBtn:        { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  payBtnText:    { color: "#FFF", fontSize: 18, fontWeight: "800" },
  payBtnSub:     { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },

  alreadyPaidRow:{ flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 10 },
  divLine:       { flex: 1, height: 1 },
  divLabel:      { fontSize: 13, fontWeight: "500" },
  verifyBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 14, borderWidth: 2, gap: 8, marginBottom: 14 },
  verifyBtnText: { fontSize: 15, fontWeight: "700" },
  secNote:       { fontSize: 11, textAlign: "center", marginBottom: 20 },

  successCircle: { width: 110, height: 110, borderRadius: 55, justifyContent: "center", alignItems: "center" },
});
