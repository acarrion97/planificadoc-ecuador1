import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { AREAS_INFO } from "@/data";
import { generarHTMLPca } from "@/lib/pca-pdf-generator";
import { generarWordPca } from "@/lib/pca-word-generator";

const PCA_PRICE = "$14.99";
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_TRIES = 100; // 5 minutos

/** Llama al endpoint admin para marcar la PCA como pagada sin cobrar */
async function adminUnlockPca(pcaId: number, adminKey: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const baseUrl = Platform.OS === "web" ? "" : "https://planificadoc.app";
    const res = await fetch(`${baseUrl}/api/admin/unlock-pca?key=${encodeURIComponent(adminKey)}&action=unlock-pca`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pcaId }),
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function getSessionId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

function generateClientTxId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

// ─── Sub-componentes ────────────────────────────────────────────────────────

function SectionLabel({ text, colors }: { text: string; colors: any }) {
  return (
    <View style={[s.secLabel, { backgroundColor: "#003366" }]}>
      <Text style={s.secLabelText}>{text}</Text>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={[s.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[s.infoLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[s.infoValue, { color: colors.foreground }]}>{value || "—"}</Text>
    </View>
  );
}

function UnidadCard({
  unidad,
  aiUnidad,
  numero,
  blurred,
  colors,
  onRegenerar,
  isPaid,
}: {
  unidad: any;
  aiUnidad: any;
  numero: number;
  blurred?: boolean;
  colors: any;
  onRegenerar?: () => void;
  isPaid: boolean;
}) {
  const dcds = unidad?.dcdsSeleccionadas || [];

  return (
    <View style={[s.unidadCard, { borderColor: colors.border }, blurred && s.blurred]}>
      <View style={[s.unidadHeader, { backgroundColor: "#EAF3DE" }]}>
        <Text style={s.unidadNum}>Unidad {numero}</Text>
        {isPaid && onRegenerar && (
          <Pressable onPress={onRegenerar} style={s.regenBtn}>
            <Text style={s.regenText}>🔄 Regenerar</Text>
          </Pressable>
        )}
      </View>

      {aiUnidad?.titulo && (
        <Text style={[s.unidadTitulo, { color: "#003366" }]}>{aiUnidad.titulo}</Text>
      )}

      {dcds.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>DCD seleccionadas</Text>
          {dcds.map((d: any) => (
            <Text key={d.codigo} style={[s.dcdItem, { color: colors.foreground }]}>
              • {d.codigo}: {d.enunciado}
            </Text>
          ))}
        </View>
      )}

      {aiUnidad?.objetivosEspecificos && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Objetivos específicos</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiUnidad.objetivosEspecificos}</Text>
        </View>
      )}

      {aiUnidad?.contenidos && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Contenidos</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiUnidad.contenidos}</Text>
        </View>
      )}

      {aiUnidad?.orientacionesMetodologicas && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Orientaciones metodológicas</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiUnidad.orientacionesMetodologicas}</Text>
        </View>
      )}

      {aiUnidad?.evaluacion && (
        <View style={{ marginBottom: 8 }}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Criterios de evaluación</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiUnidad.evaluacion}</Text>
        </View>
      )}

      <Text style={[s.duracion, { color: colors.muted }]}>
        Duración: {aiUnidad?.duracionSemanas || unidad?.duracionSemanas || "—"} semana(s)
      </Text>
    </View>
  );
}

function PayOverlay({ doc, formData, aiResult, pcaId, onPaid, colors }: {
  doc: any;
  formData: any;
  aiResult: any;
  pcaId: number;
  onPaid: () => void;
  colors: any;
}) {
  const [email, setEmail] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [openingPayment, setOpeningPayment] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triesRef = useRef(0);
  const getStatus = trpc.pca.getStatus.useQuery({ id: pcaId }, { enabled: false, refetchInterval: false });

  const areaName = formData?.area ? (AREAS_INFO[formData.area as keyof typeof AREAS_INFO]?.name || formData.area) : "";
  const numUnidades = aiResult?.unidades?.length || 0;

  const startPolling = useCallback(() => {
    triesRef.current = 0;
    pollingRef.current = setInterval(async () => {
      triesRef.current++;
      try {
        const result = await getStatus.refetch();
        if (result.data?.status === "paid") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          onPaid();
        }
      } catch {}
      if (triesRef.current >= POLL_MAX_TRIES) {
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, POLL_INTERVAL_MS);
  }, [getStatus, onPaid]);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const handlePagar = useCallback(async () => {
    if (!email.includes("@")) return Alert.alert("Email requerido", "Ingresa tu dirección de email.");
    if (!documentId.trim()) return Alert.alert("Cédula requerida", "Ingresa tu número de cédula.");
    if (!phoneNumber.trim()) return Alert.alert("Teléfono requerido", "Ingresa tu número de teléfono.");
    if (!cardHolder.trim()) return Alert.alert("Titular requerido", "Ingresa el nombre del titular de la tarjeta.");

    setOpeningPayment(true);
    const params = new URLSearchParams({
      type: "pca",
      pcaId: String(pcaId),
      email: email.trim().toLowerCase(),
      documentId: documentId.trim(),
      phoneNumber: phoneNumber.trim(),
      cardHolder: cardHolder.trim(),
    });
    const url = `https://planificadoc.app/api/payment/page?${params.toString()}`;

    if (Platform.OS === "web") {
      const win = window.open(url, "_blank", "width=520,height=700");
      startPolling();
    } else {
      // En móvil: usar expo-web-browser o Linking
      const { Linking } = require("react-native");
      await Linking.openURL(url);
      startPolling();
    }
    setOpeningPayment(false);
  }, [email, documentId, phoneNumber, cardHolder, pcaId, startPolling]);

  return (
    <View style={s.overlayWrap}>
      {/* Blur gradiente visual */}
      <View style={s.blurGradient} pointerEvents="none" />

      {/* Card de pago */}
      <View style={[s.payCard, { backgroundColor: colors.surface, borderColor: "#003366" }]}>
        <Text style={s.payEmoji}>✨</Text>
        <Text style={[s.payTitle, { color: "#003366" }]}>Tu PCA está lista</Text>
        <Text style={[s.paySub, { color: colors.muted }]}>
          {numUnidades} unidad{numUnidades !== 1 ? "es" : ""} generada{numUnidades !== 1 ? "s" : ""} para{"\n"}
          {areaName} · {formData?.grado} · {formData?.anioLectivo}
        </Text>
        <Text style={[s.payDesc, { color: colors.foreground }]}>
          Desbloquea el documento completo y descárgalo en PDF o Word
        </Text>

        {/* Campos de pago */}
        <View style={{ width: "100%", marginTop: 12, gap: 8 }}>
          <TextInput
            style={[s.payInput, { borderColor: colors.border, color: colors.foreground }]}
            value={email} onChangeText={setEmail}
            placeholder="Tu email" placeholderTextColor={colors.muted}
            keyboardType="email-address" autoCapitalize="none"
          />
          <TextInput
            style={[s.payInput, { borderColor: colors.border, color: colors.foreground }]}
            value={cardHolder} onChangeText={setCardHolder}
            placeholder="Nombre del titular" placeholderTextColor={colors.muted}
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[s.payInput, { flex: 1, borderColor: colors.border, color: colors.foreground }]}
              value={documentId} onChangeText={setDocumentId}
              placeholder="Cédula" placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
            <TextInput
              style={[s.payInput, { flex: 1, borderColor: colors.border, color: colors.foreground }]}
              value={phoneNumber} onChangeText={setPhoneNumber}
              placeholder="Teléfono" placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Pressable
          onPress={handlePagar}
          disabled={openingPayment}
          style={({ pressed }) => [s.payBtn, { opacity: pressed || openingPayment ? 0.8 : 1 }]}
        >
          {openingPayment
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.payBtnText}>🔒 Obtener PCA completa — {PCA_PRICE}</Text>
          }
        </Pressable>

        <Text style={[s.payNote, { color: colors.muted }]}>
          🔒 Transacción segura con Payphone Ecuador{"\n"}
          Visa, Mastercard y PayPhone Wallet
        </Text>

        {pollingRef.current && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <ActivityIndicator size="small" color="#003366" />
            <Text style={{ color: colors.muted, fontSize: 12 }}>Esperando confirmación del pago...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Pantalla principal ─────────────────────────────────────────────────────

export default function PcaPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const pcaId = parseInt(id || "0");

  const [paid, setPaid] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const [showAdminUnlock, setShowAdminUnlock] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminUnlocking, setAdminUnlocking] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const regenerarMutation = trpc.pca.regenerarSeccion.useMutation();

  const { data, isLoading, error, refetch } = trpc.pca.getPca.useQuery(
    { id: pcaId },
    { enabled: !!pcaId, retry: 2 }
  );

  const doc = data?.doc;
  const formData = doc?.formData as any;
  const aiResult = doc?.aiResult as any;
  const status = doc?.status;

  // Marcar como pagado cuando status cambia
  useEffect(() => {
    if (status === "paid") setPaid(true);
  }, [status]);

  const handlePaid = useCallback(() => {
    setPaid(true);
    refetch();
  }, [refetch]);

  const handleAdminUnlock = useCallback(async () => {
    if (!adminKey.trim()) return setAdminMsg("Ingresa la clave admin.");
    setAdminUnlocking(true);
    setAdminMsg("");
    const result = await adminUnlockPca(pcaId, adminKey.trim());
    setAdminUnlocking(false);
    if (result.success) {
      setAdminMsg("✅ Desbloqueado");
      setTimeout(() => {
        setPaid(true);
        refetch();
        setShowAdminUnlock(false);
      }, 800);
    } else {
      setAdminMsg(`❌ ${result.error || "Clave incorrecta"}`);
    }
  }, [adminKey, pcaId, refetch]);

  // Regenerar sección
  const handleRegenerar = useCallback(async (seccion: string, unidadNumero?: number) => {
    try {
      const result = await regenerarMutation.mutateAsync({
        pcaId,
        seccion: seccion as any,
        unidadNumero,
      });
      if (result.success) refetch();
      else Alert.alert("Error", result.error || "No se pudo regenerar");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }, [pcaId, regenerarMutation, refetch]);

  // Exportar PDF
  const handleExportPdf = useCallback(async () => {
    if (!doc) return;
    setExportingPdf(true);
    try {
      const html = generarHTMLPca(formData, aiResult);
      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        win?.document.write(html);
        win?.document.close();
        win?.print();
      } else {
        const ExpoPrint = await import("expo-print");
        const ExpoSharing = await import("expo-sharing");
        const { uri } = await ExpoPrint.printToFileAsync({ html });
        await ExpoSharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "Guardar PCA" });
      }
    } catch (err: any) {
      Alert.alert("Error", "No se pudo exportar el PDF.");
    } finally {
      setExportingPdf(false);
    }
  }, [doc, formData, aiResult]);

  // Exportar Word
  const handleExportWord = useCallback(async () => {
    if (!doc) return;
    setExportingWord(true);
    try {
      await generarWordPca(formData, aiResult);
    } catch (err: any) {
      Alert.alert("Error", "No se pudo exportar el archivo Word.");
      console.error(err);
    } finally {
      setExportingWord(false);
    }
  }, [doc, formData, aiResult]);

  if (isLoading || !doc) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ color: colors.muted }}>Cargando tu PCA...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !formData || !aiResult) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 48 }}>⚠️</Text>
          <Text style={[{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginTop: 12 }]}>
            No se pudo cargar la PCA
          </Text>
          <Pressable onPress={() => router.back()} style={s.backBtnFull}>
            <Text style={{ color: "#fff" }}>← Volver al formulario</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const areaName = AREAS_INFO[formData.area as keyof typeof AREAS_INFO]?.name || formData.area;
  const totalSemanas = (formData.semanasTrabajoTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos = totalSemanas * (formData.cargaHorariaSemanal || 0);
  const unidades: any[] = formData.unidades || [];
  const aiUnidades: any[] = aiResult.unidades || [];

  // Primera unidad siempre visible, segunda a medias, resto bloqueadas
  const SHOW_FULL = paid ? unidades.length : 1;
  const SHOW_PARTIAL = paid ? 0 : 1;
  const SHOW_LOCKED = paid ? 0 : Math.max(0, unidades.length - 2);

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Vista previa — PCA</Text>
          <Text style={[s.headerSub, { color: colors.muted }]}>{areaName} · {formData.grado}</Text>
        </View>
        {paid && (
          <View style={s.pagadoBadge}>
            <Text style={s.pagadoText}>✓ DESBLOQUEADO</Text>
          </View>
        )}
      </View>

      {/* Botones de descarga (solo si pagado) */}
      {paid && (
        <View style={[s.downloadBar, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={handleExportPdf}
            disabled={exportingPdf}
            style={({ pressed }) => [s.dlBtn, s.dlBtnPdf, { opacity: pressed || exportingPdf ? 0.7 : 1 }]}
          >
            {exportingPdf
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.dlBtnText}>⬇️ Descargar PDF</Text>
            }
          </Pressable>
          <Pressable
            onPress={handleExportWord}
            disabled={exportingWord}
            style={({ pressed }) => [s.dlBtn, s.dlBtnWord, { opacity: pressed || exportingWord ? 0.7 : 1 }]}
          >
            {exportingWord
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.dlBtnText}>⬇️ Descargar Word</Text>
            }
          </Pressable>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* ── Sección 1 + 2: Datos informativos + tiempo ── */}
        <SectionLabel text="1. Datos Informativos" colors={colors} />
        <View style={[s.card, { borderColor: colors.border }]}>
          <InfoRow label="Institución" value={formData.institucion} colors={colors} />
          <InfoRow label="Docente(s)" value={formData.docente} colors={colors} />
          <InfoRow label="Área / Asignatura" value={areaName} colors={colors} />
          <InfoRow label="Grado / Curso" value={formData.grado} colors={colors} />
          <InfoRow label="Año lectivo" value={formData.anioLectivo} colors={colors} />
          <InfoRow label="Paralelo" value={formData.paralelo} colors={colors} />
        </View>

        <SectionLabel text="2. Distribución del tiempo" colors={colors} />
        <View style={[s.card, { borderColor: colors.border }]}>
          <InfoRow label="Carga horaria semanal" value={`${formData.cargaHorariaSemanal} períodos`} colors={colors} />
          <InfoRow label="Semanas de trabajo" value={String(formData.semanasTrabajoTotal)} colors={colors} />
          <InfoRow label="Semanas evaluación" value={String(formData.semanasEvaluacion)} colors={colors} />
          <InfoRow label="Total semanas de clase" value={String(totalSemanas)} colors={colors} />
          <InfoRow label="Total períodos" value={String(totalPeriodos)} colors={colors} />
        </View>

        {/* ── Sección 3: Objetivos (IA) ── */}
        <SectionLabel text="3. Objetivos Generales" colors={colors} />
        <View style={[s.card, { borderColor: colors.border }]}>
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Objetivos del área</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiResult.objetivosArea || "—"}</Text>
          {paid && (
            <Pressable onPress={() => handleRegenerar("objetivos_area")} style={s.inlineRegen}>
              <Text style={s.regenText}>🔄 Regenerar</Text>
            </Pressable>
          )}
          <View style={[s.divider, { borderColor: colors.border }]} />
          <Text style={[s.fieldLabel, { color: colors.muted }]}>Objetivos del grado / curso</Text>
          <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiResult.objetivosGrado || "—"}</Text>
          {paid && (
            <Pressable onPress={() => handleRegenerar("objetivos_grado")} style={s.inlineRegen}>
              <Text style={s.regenText}>🔄 Regenerar</Text>
            </Pressable>
          )}
        </View>

        {/* ── Sección 4: Ejes transversales ── */}
        {formData.usaEjesTransversales && formData.ejesTransversales?.length > 0 && (
          <>
            <SectionLabel text="4. Ejes Transversales" colors={colors} />
            <View style={[s.card, { borderColor: colors.border }]}>
              {formData.ejesTransversales.map((eje: string) => (
                <Text key={eje} style={[s.ejeItem, { color: colors.foreground }]}>• {eje}</Text>
              ))}
            </View>
          </>
        )}

        {/* ── Sección 5: Unidades ── */}
        <SectionLabel text="5. Unidades de Planificación" colors={colors} />
        <View style={{ paddingHorizontal: 16 }}>
          {/* Unidades completamente visibles */}
          {unidades.slice(0, SHOW_FULL).map((u, idx) => {
            const aiU = aiUnidades.find((a: any) => a.numero === u.numero);
            return (
              <UnidadCard
                key={u.id}
                unidad={u}
                aiUnidad={aiU}
                numero={u.numero}
                colors={colors}
                isPaid={paid}
                onRegenerar={paid ? () => handleRegenerar("unidad", u.numero) : undefined}
              />
            );
          })}

          {/* Unidad parcial (segunda unidad, mitad visible) */}
          {!paid && unidades.length > 1 && (
            <View style={{ overflow: "hidden", maxHeight: 200 }}>
              <UnidadCard
                unidad={unidades[1]}
                aiUnidad={aiUnidades.find((a: any) => a.numero === unidades[1].numero)}
                numero={unidades[1].numero}
                colors={colors}
                isPaid={false}
              />
            </View>
          )}

          {/* Overlay de pago — se muestra si no está pagado */}
          {!paid && (
            <PayOverlay
              doc={doc}
              formData={formData}
              aiResult={aiResult}
              pcaId={pcaId}
              onPaid={handlePaid}
              colors={colors}
            />
          )}

          {/* Unidades restantes (solo si pagado) */}
          {paid && unidades.slice(SHOW_FULL).map((u) => {
            const aiU = aiUnidades.find((a: any) => a.numero === u.numero);
            return (
              <UnidadCard
                key={u.id}
                unidad={u}
                aiUnidad={aiU}
                numero={u.numero}
                colors={colors}
                isPaid={true}
                onRegenerar={() => handleRegenerar("unidad", u.numero)}
              />
            );
          })}
        </View>

        {/* ── Secciones bloqueadas (solo si pagado) ── */}
        {paid && (
          <>
            <SectionLabel text="6. Metodologías y Evaluación" colors={colors} />
            <View style={[s.card, { borderColor: colors.border }]}>
              {formData.metodologiasActivas?.length > 0 && (
                <>
                  <Text style={[s.fieldLabel, { color: colors.muted }]}>Metodologías activas</Text>
                  <Text style={[s.fieldValue, { color: colors.foreground }]}>
                    {formData.metodologiasActivas.join(" · ")}
                  </Text>
                </>
              )}
              {formData.tecnicasEvaluacion?.length > 0 && (
                <>
                  <Text style={[s.fieldLabel, { color: colors.muted, marginTop: 8 }]}>Técnicas de evaluación</Text>
                  <Text style={[s.fieldValue, { color: colors.foreground }]}>
                    {formData.tecnicasEvaluacion.join(" · ")}
                  </Text>
                </>
              )}
            </View>

            <SectionLabel text="7. Bibliografía" colors={colors} />
            <View style={[s.card, { borderColor: colors.border }]}>
              {formData.bibliografiaDocente && (
                <>
                  <Text style={[s.fieldLabel, { color: colors.muted }]}>Bibliografía del docente</Text>
                  <Text style={[s.fieldValue, { color: colors.foreground }]}>{formData.bibliografiaDocente}</Text>
                  <View style={[s.divider, { borderColor: colors.border }]} />
                </>
              )}
              <Text style={[s.fieldLabel, { color: colors.muted }]}>Bibliografía sugerida (IA)</Text>
              <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiResult.bibliografiaSugerida || "—"}</Text>
              <Pressable onPress={() => handleRegenerar("bibliografia")} style={s.inlineRegen}>
                <Text style={s.regenText}>🔄 Regenerar</Text>
              </Pressable>
            </View>

            <SectionLabel text="8. Observaciones" colors={colors} />
            <View style={[s.card, { borderColor: colors.border }]}>
              <Text style={[s.fieldValue, { color: colors.foreground }]}>{aiResult.observaciones || "—"}</Text>
              <Pressable onPress={() => handleRegenerar("observaciones")} style={s.inlineRegen}>
                <Text style={s.regenText}>🔄 Regenerar</Text>
              </Pressable>
            </View>

            <SectionLabel text="9. Firmas de aprobación" colors={colors} />
            <View style={[s.card, { borderColor: colors.border }]}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[
                  { label: "Elaborado por", nombre: formData.firmaElaboradoPor, fecha: formData.firmaElaboradoFecha },
                  { label: "Revisado por", nombre: formData.firmaRevisadoPor, fecha: formData.firmaRevisadoFecha },
                  { label: "Aprobado por", nombre: formData.firmaAprobadoPor, fecha: formData.firmaAprobadoFecha },
                ].map(f => (
                  <View key={f.label} style={{ flex: 1, alignItems: "center" }}>
                    <View style={[s.firmaLine, { borderTopColor: colors.border }]} />
                    <Text style={[s.firmaLabel, { color: colors.muted }]}>{f.label}</Text>
                    {f.nombre && <Text style={[{ color: colors.foreground, fontSize: 12, fontWeight: "600" }]}>{f.nombre}</Text>}
                    {f.fecha && <Text style={[{ color: colors.muted, fontSize: 11 }]}>{f.fecha}</Text>}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {/* ── Botón admin (oculto salvo que se active) ── */}
      {!paid && (
        <View style={{ alignItems: "center", paddingBottom: 12, paddingTop: 4 }}>
          {!showAdminUnlock ? (
            <Pressable onPress={() => setShowAdminUnlock(true)} style={{ padding: 8 }}>
              <Text style={{ color: colors.muted, fontSize: 10, opacity: 0.4 }}>🔑 admin</Text>
            </Pressable>
          ) : (
            <View style={[s.adminPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={[s.adminTitle, { color: colors.foreground }]}>🔑 Admin: desbloquear PCA #{pcaId}</Text>
              <TextInput
                style={[s.payInput, { borderColor: colors.border, color: colors.foreground, marginTop: 8 }]}
                value={adminKey}
                onChangeText={setAdminKey}
                placeholder="Clave admin"
                placeholderTextColor={colors.muted}
                secureTextEntry
                autoCapitalize="none"
              />
              {adminMsg ? <Text style={{ color: adminMsg.startsWith("✅") ? "#059669" : "#DC2626", fontSize: 12, marginTop: 4 }}>{adminMsg}</Text> : null}
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Pressable
                  onPress={handleAdminUnlock}
                  disabled={adminUnlocking}
                  style={[s.dlBtn, { backgroundColor: "#003366", flex: 1, opacity: adminUnlocking ? 0.7 : 1 }]}
                >
                  {adminUnlocking
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.dlBtnText}>Desbloquear gratis</Text>
                  }
                </Pressable>
                <Pressable onPress={() => setShowAdminUnlock(false)} style={[s.dlBtn, { backgroundColor: colors.muted, paddingHorizontal: 16 }]}>
                  <Text style={s.dlBtnText}>✕</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitle: { fontSize: 17, fontWeight: "800" },
  headerSub: { fontSize: 12 },
  pagadoBadge: {
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pagadoText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  downloadBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dlBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  dlBtnPdf: { backgroundColor: "#DC2626" },
  dlBtnWord: { backgroundColor: "#2563EB" },
  dlBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  secLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  secLabelText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  card: {
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: { fontSize: 12, fontWeight: "600" },
  infoValue: { fontSize: 12, flex: 1, textAlign: "right" },
  fieldLabel: { fontSize: 11, fontWeight: "700", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 },
  fieldValue: { fontSize: 13, lineHeight: 20 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, marginVertical: 10 },
  dcdItem: { fontSize: 12, lineHeight: 18, marginBottom: 2 },
  ejeItem: { fontSize: 13, marginBottom: 4 },
  duracion: { fontSize: 11, marginTop: 6, textAlign: "right" },
  unidadCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  blurred: { opacity: 0.15 },
  unidadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  unidadNum: { fontSize: 14, fontWeight: "800" },
  regenBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EAF3DE",
    borderRadius: 6,
  },
  regenText: { color: "#3B6D11", fontSize: 12, fontWeight: "600" },
  inlineRegen: {
    alignSelf: "flex-end",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EAF3DE",
    borderRadius: 6,
  },
  unidadTitulo: { fontSize: 15, fontWeight: "800", marginBottom: 10 },
  // Overlay de pago
  overlayWrap: { alignItems: "center", marginVertical: 8 },
  blurGradient: {
    height: 60,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    marginBottom: -30,
    zIndex: 5,
  },
  payCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 16,
    zIndex: 10,
    width: "100%",
    maxWidth: 440,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  payEmoji: { fontSize: 36, marginBottom: 8 },
  payTitle: { fontSize: 20, fontWeight: "900", marginBottom: 6 },
  paySub: { fontSize: 13, textAlign: "center", marginBottom: 8, lineHeight: 20 },
  payDesc: { fontSize: 14, textAlign: "center", marginBottom: 4 },
  payInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    width: "100%",
  },
  payBtn: {
    backgroundColor: "#003366",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  payBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  payNote: { fontSize: 11, textAlign: "center", marginTop: 10, lineHeight: 16 },
  // Firma
  firmaLine: { width: "80%", borderTopWidth: 1, marginBottom: 6 },
  firmaLabel: { fontSize: 11, textAlign: "center" },
  // Admin unlock
  adminPanel: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    width: "90%",
    maxWidth: 360,
  },
  adminTitle: { fontSize: 13, fontWeight: "700" },
  // Volver
  backBtnFull: {
    backgroundColor: "#003366",
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
});
