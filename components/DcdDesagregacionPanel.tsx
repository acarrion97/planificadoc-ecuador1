import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTRPCClient } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { DcdDesagregacion, EstadoDesagregacion } from "@/data/types";
import type { DcdDesagregacionRow } from "@/drizzle/schema";

/**
 * Fila de desagregación devuelta por el backend (incluye el `id` de BD).
 */
type FilaDesagregacion = DcdDesagregacionRow;

const ESTADO_LABEL: Record<EstadoDesagregacion, string> = {
  generado: "Generada por IA",
  editado: "Editada por docente",
  aprobado: "Aprobada",
};

const ESTADO_COLOR: Record<EstadoDesagregacion, string> = {
  generado: "#2563EB",
  editado: "#D97706",
  aprobado: "#16A34A",
};

interface Props {
  codigoDCD: string;
  /** Grado actual de la planificación — su versión queda preseleccionada */
  gradoContexto: number;
  visible: boolean;
  onClose: () => void;
  /**
   * Opcional: se invoca al aplicar la versión de un grado a la planificación
   * (se cablea en el flujo de selección).
   */
  onSeleccionar?: (fila: DcdDesagregacion) => void;
}

export function DcdDesagregacionPanel({
  codigoDCD,
  gradoContexto,
  visible,
  onClose,
  onSeleccionar,
}: Props) {
  const colors = useColors();
  const [client] = useState(() => createTRPCClient());

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [filas, setFilas] = useState<FilaDesagregacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [advertencias, setAdvertencias] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<{
    dcdGraduada: string;
    indicadorGraduado: string;
  } | null>(null);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);
  const [aprobandoId, setAprobandoId] = useState<number | null>(null);

  /** Resuelve el sessionId del dispositivo (mismo esquema que adaptaciones). */
  const resolveSessionId = useCallback(async (): Promise<string> => {
    let sid = await AsyncStorage.getItem("@planificadoc_device_id");
    if (!sid) {
      sid = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      await AsyncStorage.setItem("@planificadoc_device_id", sid);
    }
    return sid;
  }, []);

  /** 5.1 Resuelve la fila existente (reutilización) al abrir el panel. */
  useEffect(() => {
    if (!visible || !codigoDCD) return;
    let activo = true;
    setFilas([]);
    setAdvertencias([]);
    setError(null);
    setEditandoId(null);
    setBorrador(null);
    setSeleccionadoId(null);

    (async () => {
      const sid = await resolveSessionId();
      if (!activo) return;
      setSessionId(sid);
      try {
        setCargando(true);
        const rows = await client.dcdDesagregaciones.get.query({
          sessionId: sid,
          codigoDCD,
        });
        if (!activo) return;
        setFilas(rows);
        const pre = rows.find((r) => r.grado === gradoContexto) ?? rows[rows.length - 1];
        if (pre) setSeleccionadoId(pre.id);
      } catch {
        if (activo) setError("No se pudo consultar la desagregación guardada.");
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, [visible, codigoDCD, gradoContexto, resolveSessionId]);

  /** Genera el ladder completo por IA y lo persiste. */
  const handleGenerar = useCallback(async () => {
    if (!sessionId) return;
    setGenerando(true);
    setError(null);
    setAdvertencias([]);
    try {
      const res = await client.dcdDesagregaciones.generar.mutate({
        sessionId,
        codigoDCD,
      });
      setAdvertencias(res.advertencias);
      // Refetch para obtener las filas con sus `id` de BD
      let rows = await client.dcdDesagregaciones.get.query({ sessionId, codigoDCD });
      if (!rows.length) {
        // BD no disponible (patrón no-crítico del backend): usar filas en memoria
        rows = res.filas.map((f, i) => ({ ...f, id: -(i + 1) })) as typeof rows;
      }
      setFilas(rows);
      const pre = rows.find((r) => r.grado === gradoContexto) ?? rows[rows.length - 1];
      if (pre) setSeleccionadoId(pre.id);
    } catch (e: any) {
      setError(e?.message || "La IA no pudo desagregar esta DCD.");
    } finally {
      setGenerando(false);
    }
  }, [sessionId, codigoDCD, gradoContexto]);

  /** Inicia la edición docente de una fila. */
  const iniciarEdicion = useCallback((fila: FilaDesagregacion) => {
    setEditandoId(fila.id);
    setBorrador({ dcdGraduada: fila.dcdGraduada, indicadorGraduado: fila.indicadorGraduado });
  }, []);

  /** 5.3 Guarda la edición (PATCH) y pasa estado a "editado". */
  const handleGuardar = useCallback(
    async (fila: FilaDesagregacion) => {
      if (!sessionId || !borrador) return;
      setGuardandoId(fila.id);
      setError(null);
      try {
        await client.dcdDesagregaciones.editar.mutate({
          id: fila.id,
          sessionId,
          dcdGraduada: borrador.dcdGraduada,
          indicadorGraduado: borrador.indicadorGraduado,
        });
        setFilas((fs) =>
          fs.map((f) =>
            f.id === fila.id
              ? { ...f, ...borrador, estado: "editado" as EstadoDesagregacion }
              : f
          )
        );
        setEditandoId(null);
        setBorrador(null);
      } catch {
        setError("No se pudo guardar la edición.");
      } finally {
        setGuardandoId(null);
      }
    },
    [sessionId, borrador]
  );

  /** Aprueba una fila (estado = aprobado). */
  const handleAprobar = useCallback(
    async (fila: FilaDesagregacion) => {
      if (!sessionId) return;
      setAprobandoId(fila.id);
      setError(null);
      try {
        await client.dcdDesagregaciones.aprobar.mutate({
          id: fila.id,
          sessionId,
        });
        setFilas((fs) =>
          fs.map((f) =>
            f.id === fila.id ? { ...f, estado: "aprobado" as EstadoDesagregacion } : f
          )
        );
      } catch {
        setError("No se pudo aprobar la fila.");
      } finally {
        setAprobandoId(null);
      }
    },
    [sessionId]
  );

  const filaSeleccionada = filas.find((f) => f.id === seleccionadoId) ?? null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.backdropInner} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  Desagregación por grado
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  {codigoDCD} · Destreza con Criterio de Desempeño
                </Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={[styles.closeX, { color: colors.muted }]}>✕</Text>
              </Pressable>
            </View>

            <Text style={[styles.aviso, { color: colors.muted }]}>
              Opcional. El texto oficial de la DCD siempre está disponible; aquí puedes usar o
              editar una versión graduada para el grado de tu planificación.
            </Text>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              {error ? (
                <Text style={[styles.errorText, { color: "#DC2626" }]}>{error}</Text>
              ) : null}

              {cargando ? (
                <View style={styles.centerBox}>
                  <ActivityIndicator size="small" color="#7C3AED" />
                  <Text style={[styles.centerText, { color: colors.muted }]}>Consultando…</Text>
                </View>
              ) : filas.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyIcon}>⚡</Text>
                  <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                    Desagregar esta DCD por grado
                  </Text>
                  <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                    La IA genera la misma destreza ajustada a la complejidad de cada grado del
                    subnivel. El último grado conserva el texto oficial completo.
                  </Text>
                  <Pressable
                    onPress={handleGenerar}
                    disabled={generando}
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { backgroundColor: "#7C3AED", opacity: pressed || generando ? 0.8 : 1 },
                    ]}
                  >
                    {generando ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.primaryBtnText}>⚡ Desagregar por grado</Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                <>
                  {/* Matriz por grado (5.2) */}
                  <ScrollView horizontal nestedScrollEnabled>
                    <View style={styles.matrix}>
                      <View style={styles.matrixRow}>
                        <View style={styles.labelCell}>
                          <Text style={[styles.labelCellText, { color: colors.muted }]}>Grado</Text>
                        </View>
                        {filas.map((f) => (
                          <View key={f.grado} style={styles.gradeHeaderCell}>
                            <Text style={[styles.gradeHeader, { color: "#7C3AED" }]}>
                              {f.grado}°
                            </Text>
                            {f.grado === f.gradoMaximo ? (
                              <Text style={[styles.gradoTag, { color: "#16A34A" }]}>oficial</Text>
                            ) : (
                              <Text
                                style={[styles.procesoText, { color: colors.muted }]}
                                numberOfLines={2}
                              >
                                {f.procesoCognitivo?.split(":")[0] || "proceso cognitivo"}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>

                      <View style={styles.matrixRow}>
                        <View style={styles.labelCell}>
                          <Text style={[styles.labelCellText, { color: colors.muted }]}>
                            DCD graduada
                          </Text>
                        </View>
                        {filas.map((f) => (
                          <View
                            key={f.id}
                            style={[
                              styles.cell,
                              f.id === seleccionadoId && styles.cellSelected,
                            ]}
                          >
                            <Pressable
                              onPress={() => setSeleccionadoId(f.id)}
                              style={styles.cellPress}
                            >
                              {editandoId === f.id && borrador ? (
                                <TextInput
                                  style={[styles.cellInput, { borderColor: colors.border, color: colors.foreground }]}
                                  value={borrador.dcdGraduada}
                                  onChangeText={(t) => setBorrador({ ...borrador, dcdGraduada: t })}
                                  multiline
                                />
                              ) : (
                                <Text style={[styles.cellText, { color: colors.foreground }]}>
                                  {f.dcdGraduada}
                                </Text>
                              )}
                            </Pressable>
                          </View>
                        ))}
                      </View>

                      <View style={styles.matrixRow}>
                        <View style={styles.labelCell}>
                          <Text style={[styles.labelCellText, { color: colors.muted }]}>
                            Indicador graduado
                          </Text>
                        </View>
                        {filas.map((f) => (
                          <View
                            key={f.id}
                            style={[
                              styles.cell,
                              f.id === seleccionadoId && styles.cellSelected,
                            ]}
                          >
                            {editandoId === f.id && borrador ? (
                              <TextInput
                                style={[styles.cellInput, { borderColor: colors.border, color: colors.foreground }]}
                                value={borrador.indicadorGraduado}
                                onChangeText={(t) => setBorrador({ ...borrador, indicadorGraduado: t })}
                                multiline
                              />
                            ) : (
                              <Text style={[styles.cellText, { color: colors.foreground }]}>
                                {f.indicadorGraduado}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  </ScrollView>

                  {/* Estado + acciones por fila */}
                  <View style={styles.filasEstados}>
                    {filas.map((f) => (
                      <View
                        key={f.id}
                        style={[
                          styles.filaEstado,
                          { borderColor: colors.border, backgroundColor: colors.surface },
                          f.id === seleccionadoId && { borderColor: "#7C3AED" },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={styles.filaEstadoHeader}>
                            <Text style={[styles.filaGrado, { color: colors.foreground }]}>
                              Grado {f.grado}
                            </Text>
                            {f.grado === gradoContexto ? (
                              <Text style={styles.tuGradoTag}>tu grado</Text>
                            ) : null}
                            <View
                              style={[
                                styles.estadoBadge,
                                { backgroundColor: ESTADO_COLOR[f.estado] + "1A" },
                              ]}
                            >
                              <Text style={[styles.estadoText, { color: ESTADO_COLOR[f.estado] }]}>
                                {ESTADO_LABEL[f.estado]}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.procesoDesc, { color: colors.muted }]} numberOfLines={2}>
                            {f.procesoCognitivo || "Versión completa (texto oficial)"}
                          </Text>
                        </View>

                        <View style={styles.acciones}>
                          {editandoId === f.id ? (
                            <>
                              <Pressable
                                onPress={() => handleGuardar(f)}
                                disabled={guardandoId === f.id}
                                style={[styles.actionBtn, { backgroundColor: "#16A34A" }]}
                              >
                                {guardandoId === f.id ? (
                                  <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                  <Text style={styles.actionText}>Guardar</Text>
                                )}
                              </Pressable>
                              <Pressable
                                onPress={() => {
                                  setEditandoId(null);
                                  setBorrador(null);
                                }}
                                style={[styles.actionBtn, { backgroundColor: colors.border }]}
                              >
                                <Text style={[styles.actionText, { color: colors.foreground }]}>
                                  Cancelar
                                </Text>
                              </Pressable>
                            </>
                          ) : (
                            <>
                              <Pressable
                                onPress={() => iniciarEdicion(f)}
                                style={[styles.actionBtn, { backgroundColor: "#1A56DB" }]}
                              >
                                <Text style={styles.actionText}>✏️ Editar</Text>
                              </Pressable>
                              {f.estado !== "aprobado" && (
                                <Pressable
                                  onPress={() => handleAprobar(f)}
                                  disabled={aprobandoId === f.id}
                                  style={[styles.actionBtn, { backgroundColor: "#16A34A" }]}
                                >
                                  {aprobandoId === f.id ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                  ) : (
                                    <Text style={styles.actionText}>✓ Aprobar</Text>
                                  )}
                                </Pressable>
                              )}
                            </>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Advertencias de validación (no bloqueantes) */}
                  {advertencias.length > 0 && (
                    <View style={styles.warnBox}>
                      <Text style={styles.warnTitle}>Revisar antes de usar:</Text>
                      {advertencias.map((w, i) => (
                        <Text key={i} style={styles.warnItem}>
                          • {w}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {filaSeleccionada && onSeleccionar ? (
                <Pressable
                  onPress={() => onSeleccionar(filaSeleccionada as DcdDesagregacion)}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: "#7C3AED", opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={styles.primaryBtnText}>
                    Usar versión de {filaSeleccionada.grado}° en esta planificación
                  </Text>
                </Pressable>
              ) : filaSeleccionada ? (
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: "#003366", opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={styles.primaryBtnText}>Listo</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.cancelBtn,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.cancelText, { color: colors.muted }]}>Cerrar</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdropInner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: "92%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeX: {
    fontSize: 18,
    fontWeight: "700",
    padding: 4,
  },
  aviso: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  centerBox: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  centerText: {
    fontSize: 13,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "stretch",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  cancelBtn: {
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  matrix: {
    marginBottom: 12,
  },
  matrixRow: {
    flexDirection: "row",
  },
  labelCell: {
    width: 108,
    paddingVertical: 8,
    justifyContent: "center",
  },
  labelCellText: {
    fontSize: 11,
    fontWeight: "700",
  },
  gradeHeaderCell: {
    width: 230,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  gradeHeader: {
    fontSize: 15,
    fontWeight: "800",
  },
  gradoTag: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  procesoText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  cell: {
    width: 230,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    marginRight: 8,
  },
  cellSelected: {
    borderColor: "#7C3AED",
    borderWidth: 2,
  },
  cellPress: {
    flex: 1,
  },
  cellText: {
    fontSize: 12,
    lineHeight: 17,
  },
  cellInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    minHeight: 60,
  },
  filasEstados: {
    gap: 8,
    marginTop: 4,
  },
  filaEstado: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  filaEstadoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  filaGrado: {
    fontSize: 13,
    fontWeight: "800",
  },
  tuGradoTag: {
    fontSize: 9,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#7C3AED",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: "hidden",
  },
  estadoBadge: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  estadoText: {
    fontSize: 9,
    fontWeight: "700",
  },
  procesoDesc: {
    fontSize: 11,
  },
  acciones: {
    flexDirection: "row",
    gap: 6,
    flexShrink: 0,
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 68,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  warnBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  warnTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400E",
    marginBottom: 4,
  },
  warnItem: {
    fontSize: 12,
    lineHeight: 16,
    color: "#92400E",
  },
  footer: {
    marginTop: 12,
  },
});
