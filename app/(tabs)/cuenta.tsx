import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAccess } from "@/lib/access-control";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { getApiBaseUrl } from "@/constants/oauth";

interface SubscriptionDetails {
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  daysRemaining: number;
}

interface CardInfo {
  cardBrand: string | null;
  lastDigits: string | null;
  cardHolder: string | null;
}

export default function CuentaScreen() {
  const { hasAccess, accessMethod, subscribedEmail, subscriptionEndDate, resetAccess } = useAccess();
  const { planificaciones } = usePlanificaciones();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!subscribedEmail) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/api/subscription/details?email=${encodeURIComponent(subscribedEmail)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.hasSubscription) {
        setDetails(data.subscription);
        setCardInfo(data.cardInfo || null);
      }
    } catch (e) {
      console.warn("Error fetching subscription details:", e);
    }
  }, [subscribedEmail]);

  useEffect(() => {
    if (subscribedEmail) {
      setLoading(true);
      fetchDetails().finally(() => setLoading(false));
    }
  }, [subscribedEmail, fetchDetails]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  }, [fetchDetails]);

  const handleCancelRecurring = useCallback(async () => {
    if (!subscribedEmail) return;

    const doCancel = async () => {
      setCancelling(true);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/subscription/cancel-recurring`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: subscribedEmail }),
        });
        const data = await res.json();
        if (data.success) {
          if (Platform.OS === "web") {
            alert(data.message);
          } else {
            Alert.alert("Listo", data.message);
          }
          await fetchDetails();
        } else {
          const errMsg = data.error || "No se pudo cancelar";
          if (Platform.OS === "web") {
            alert(errMsg);
          } else {
            Alert.alert("Error", errMsg);
          }
        }
      } catch {
        const msg = "Error de conexión. Intenta de nuevo.";
        if (Platform.OS === "web") {
          alert(msg);
        } else {
          Alert.alert("Error", msg);
        }
      } finally {
        setCancelling(false);
      }
    };

    if (Platform.OS === "web") {
      if (confirm("¿Estás seguro de cancelar la renovación automática? Tu suscripción seguirá activa hasta la fecha de vencimiento.")) {
        doCancel();
      }
    } else {
      Alert.alert(
        "Cancelar renovación",
        "¿Estás seguro de cancelar la renovación automática? Tu suscripción seguirá activa hasta la fecha de vencimiento.",
        [
          { text: "No", style: "cancel" },
          { text: "Sí, cancelar", style: "destructive", onPress: doCancel },
        ]
      );
    }
  }, [subscribedEmail, fetchDetails]);

  const handleLogout = useCallback(async () => {
    const doLogout = async () => {
      await resetAccess();
    };

    if (Platform.OS === "web") {
      if (confirm("¿Cerrar sesión? Deberás ingresar tu código o email nuevamente.")) {
        doLogout();
      }
    } else {
      Alert.alert(
        "Cerrar sesión",
        "¿Cerrar sesión? Deberás ingresar tu código o email nuevamente.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cerrar sesión", style: "destructive", onPress: doLogout },
        ]
      );
    }
  }, [resetAccess]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getPlanLabel = (plan: string) => {
    if (plan === "monthly") return "Mensual";
    if (plan === "annual") return "Anual";
    return plan;
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "#22C55E";
    if (status === "past_due") return "#F59E0B";
    if (status === "expired") return "#EF4444";
    return "#687076";
  };

  const getStatusLabel = (status: string) => {
    if (status === "active") return "Activa";
    if (status === "past_due") return "Pago pendiente";
    if (status === "expired") return "Expirada";
    if (status === "cancelled") return "Cancelada";
    return status;
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Mi Cuenta</Text>
          <Text className="text-sm text-muted mt-1">
            Gestiona tu suscripción y datos
          </Text>
        </View>

        {/* Access Status Card */}
        <View className="bg-surface rounded-2xl p-5 border border-border mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground">
              Estado de Acceso
            </Text>
            <View
              style={{
                backgroundColor: hasAccess ? "#DCFCE7" : "#FEE2E2",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: hasAccess ? "#166534" : "#991B1B",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {hasAccess ? "Activo" : "Inactivo"}
              </Text>
            </View>
          </View>

          {accessMethod === "subscription" && subscribedEmail && (
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Método:</Text>
                <Text className="text-sm text-foreground font-medium">Suscripción</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Email:</Text>
                <Text className="text-sm text-foreground font-medium">{subscribedEmail}</Text>
              </View>
              {subscriptionEndDate && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Vence:</Text>
                  <Text className="text-sm text-foreground font-medium">
                    {formatDate(subscriptionEndDate)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {accessMethod === "code" && (
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Método:</Text>
                <Text className="text-sm text-foreground font-medium">Código de acceso</Text>
              </View>
            </View>
          )}

          {!hasAccess && (
            <Text className="text-sm text-muted">
              No tienes una suscripción activa.
            </Text>
          )}
        </View>

        {/* Subscription Details Card */}
        {loading ? (
          <View className="bg-surface rounded-2xl p-5 border border-border mb-4 items-center">
            <ActivityIndicator size="small" />
            <Text className="text-sm text-muted mt-2">Cargando detalles...</Text>
          </View>
        ) : details ? (
          <View className="bg-surface rounded-2xl p-5 border border-border mb-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Detalles de Suscripción
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Plan:</Text>
                <View
                  style={{
                    backgroundColor: "#EFF6FF",
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#1D4ED8", fontSize: 13, fontWeight: "600" }}>
                    {getPlanLabel(details.plan)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Estado:</Text>
                <View
                  style={{
                    backgroundColor: getStatusColor(details.status) + "20",
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: getStatusColor(details.status), fontSize: 13, fontWeight: "600" }}>
                    {getStatusLabel(details.status)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Inicio:</Text>
                <Text className="text-sm text-foreground font-medium">
                  {formatDate(details.startDate)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Vencimiento:</Text>
                <Text className="text-sm text-foreground font-medium">
                  {formatDate(details.endDate)}
                </Text>
              </View>

              {details.daysRemaining > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Días restantes:</Text>
                  <Text className="text-sm text-foreground font-bold">
                    {details.daysRemaining} días
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Renovación automática:</Text>
                <Text
                  className="text-sm font-medium"
                  style={{ color: details.isRecurring ? "#22C55E" : "#687076" }}
                >
                  {details.isRecurring ? "Activada" : "Desactivada"}
                </Text>
              </View>
            </View>

            {/* Card info */}
            {cardInfo && cardInfo.lastDigits && (
              <View className="mt-4 pt-4 border-t border-border">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Método de pago
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">💳</Text>
                  <Text className="text-sm text-foreground">
                    {cardInfo.cardBrand || "Tarjeta"} ****{cardInfo.lastDigits}
                  </Text>
                </View>
                {cardInfo.cardHolder && (
                  <Text className="text-xs text-muted mt-1">
                    Titular: {cardInfo.cardHolder}
                  </Text>
                )}
              </View>
            )}

            {/* Cancel recurring button */}
            {details.isRecurring && (
              <TouchableOpacity
                onPress={handleCancelRecurring}
                disabled={cancelling}
                className="mt-4 border border-error rounded-xl py-3 items-center"
                style={{ opacity: cancelling ? 0.5 : 1 }}
              >
                {cancelling ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Text style={{ color: "#EF4444", fontWeight: "600", fontSize: 14 }}>
                    Cancelar renovación automática
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Usage Stats */}
        <View className="bg-surface rounded-2xl p-5 border border-border mb-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Mi Actividad
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-muted">Planificaciones generadas:</Text>
            <View
              style={{
                backgroundColor: "#F0F9FF",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#0369A1", fontSize: 16, fontWeight: "700" }}>
                {planificaciones.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-surface rounded-2xl p-4 border border-border items-center"
        >
          <Text style={{ color: "#EF4444", fontWeight: "600", fontSize: 15 }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
