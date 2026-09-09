/**
 * Vista de un plan "Conecta, Nivela y Crea" guardado (persistido en
 * lib/planificaciones-cnc-context.tsx). Permite revisar el plan completo,
 * exportarlo a Word/PDF e imprimir la prueba diagnóstica.
 */
import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Platform } from "react-native";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { shareAsync } from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";
import { generarWordPlanCNC } from "@/lib/cnc-word-generator";
import { HABILIDADES_SOCIOEMOCIONALES } from "@/data/habilidades-socioemocionales";
import { FIGURAS_PROFESIONALES } from "@/data/bachillerato-tecnico";
import type { PlanConectaNivelaCrea } from "@/data/types-cnc";

const TIPOS_PRODUCTO_BT: Record<string, string> = {
  maqueta: "Maqueta",
  software_basico: "Software básico",
  plan_negocio: "Plan de negocio",
  mantenimiento_equipo: "Mantenimiento de equipo",
  servicio_programa: "Servicio o programa",
  evento_presentacion: "Evento o presentación",
  material_protocolo: "Material o protocolo",
  otro: "Otro",
};

const NIVEL_LABEL: Record<string, string> = {
  logrado: "Logrado",
  en_proceso: "En proceso",
  iniciado: "Iniciado",
};

function Seccion({ title, emoji, color, children }: { title: string; emoji: string; color: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16, borderWidth: 1.5, borderColor: color + "35", borderRadius: 14, overflow: "hidden" }}>
      <View style={{ backgroundColor: color, paddingHorizontal: 14, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFFFFF", flex: 1 }}>{title}</Text>
      </View>
      <View style={{ padding: 14 }}>{children}</View>
    </View>
  );
}

function LineaItem({ texto, sub }: { texto: string; sub?: string }) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 12, color: colors.text }}>• {texto}</Text>
      {!!sub && <Text style={{ fontSize: 11, color: colors.muted, marginLeft: 10 }}>{sub}</Text>}
    </View>
  );
}

export default function VerCncScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlanCNC } = usePlanificacionesCNC();
  const [exporting, setExporting] = useState<"word" | "pdf" | null>(null);

  const plan = getPlanCNC(id || "");

  async function exportar(formato: "word" | "pdf") {
    if (!plan) return;
    setExporting(formato);
    try {
      if (formato === "word") {
        const blob = await generarWordPlanCNC(plan);
        const filename = `conecta_nivela_crea_${plan.grado.replace(/\W+/g, "_") || "plan"}.docx`;
        if (Platform.OS === "web") {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = filename;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          const uri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
          await shareAsync(uri, {
            UTI: ".docx",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            dialogTitle: "Conecta, Nivela y Crea",
          });
        }
      } else {
        const { generarHTMLPlanCNC } = await import("@/lib/pdf-generator");
        const html = generarHTMLPlanCNC(plan);
        if (Platform.OS === "web") {
          const w = window.open("", "_blank");
          if (w) { w.document.write(html); w.document.close(); w.print(); }
        } else {
          const { printToFileAsync } = await import("expo-print");
          const { uri } = await printToFileAsync({ html });
          await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf", dialogTitle: "Conecta, Nivela y Crea" });
        }
      }
    } catch (err: any) {
      Alert.alert("Error al exportar", err?.message ?? "No se pudo generar el documento.");
    } finally {
      setExporting(null);
    }
  }

  if (!plan) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 48 }}>⚠️</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 12, textAlign: "center" }}>
            Plan Conecta, Nivela y Crea no encontrado
          </Text>
          <Pressable onPress={() => router.back()} style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 28, marginTop: 16 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const esBT = plan.modalidad === "bt";
  const figura = esBT ? FIGURAS_PROFESIONALES.find((f) => f.id === plan.figuraProfesionalId) : undefined;
  const modulo = esBT ? figura?.modulos.find((m) => m.codigo === plan.moduloId) : undefined;
  const actividadSemana = (sem: 2 | 3) => plan.semana2y3.actividadesNivelacion.filter((a) => a.semana === sem);

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontSize: 18, color: colors.primary }}>←</Text>
          <Text style={{ fontSize: 15, color: colors.primary, marginLeft: 6, fontWeight: "600" }}>Atrás</Text>
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>🌱 Conecta, Nivela y Crea</Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
          {plan.grado || "Sin grado"} {plan.paralelo ? `· ${plan.paralelo}` : ""} · {esBT ? "Bachillerato Técnico" : "General (EGB/BGU)"} · {plan.anioLectivo}
        </Text>
        {esBT && (
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
            {figura?.nombre ?? "Figura profesional"} {modulo ? `· ${modulo.nombre}` : ""}
          </Text>
        )}
        {plan.docente ? <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>Docente: {plan.docente}</Text> : null}

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14, marginBottom: 20 }}>
          <Pressable onPress={() => exportar("word")} disabled={!!exporting} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#1E3A8A", borderRadius: 12, paddingVertical: 14 }}>
            {exporting === "word" ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 16 }}>📄</Text>}
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Word</Text>
          </Pressable>
          <Pressable onPress={() => exportar("pdf")} disabled={!!exporting} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#B91C1C", borderRadius: 12, paddingVertical: 14 }}>
            {exporting === "pdf" ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 16 }}>📕</Text>}
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>PDF</Text>
          </Pressable>
        </View>

        {plan.aiResult?.cronogramaSemanal ? (
          <Seccion title="Cronograma de las 5 semanas" emoji="🗓️" color={colors.primary}>
            <Text style={{ fontSize: 12, color: colors.text }}>{plan.aiResult.cronogramaSemanal}</Text>
          </Seccion>
        ) : null}

        <Seccion title="Semana 1 — Conecta" emoji="🤝" color={colors.primary}>
          {plan.semana1.actividadesAdaptacion.filter(Boolean).length > 0 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginBottom: 4 }}>Actividades de adaptación</Text>
              {plan.semana1.actividadesAdaptacion.filter(Boolean).map((a, i) => (
                <LineaItem key={`ad-${i}`} texto={a} />
              ))}
            </>
          )}
          {plan.semana1.diagnosticoAcademico.length > 0 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Diagnóstico académico</Text>
              {(["LL", "M"] as const).map((area) => {
                const items = plan.semana1.diagnosticoAcademico.filter((d) => d.area === area);
                if (!items.length) return null;
                return items.map((d, i) => (
                  <LineaItem
                    key={`diag-${area}-${i}`}
                    texto={`[${area}] ${d.destrezaCodigo} — ${d.destrezaDescripcion}`}
                    sub={`Nivel: ${NIVEL_LABEL[d.nivelDetectado] ?? d.nivelDetectado}${d.observaciones ? ` · ${d.observaciones}` : ""}`}
                  />
                ));
              })}
            </>
          )}
          {plan.semana1.diagnosticoSocioemocional.length > 0 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Diagnóstico socioemocional</Text>
              {plan.semana1.diagnosticoSocioemocional.map((h) => {
                const info = HABILIDADES_SOCIOEMOCIONALES.find((x) => x.id === h.habilidadId);
                return (
                  <LineaItem
                    key={h.habilidadId}
                    texto={info ? `${info.emoji} ${info.nombre}` : h.habilidadId}
                    sub={h.observaciones || undefined}
                  />
                );
              })}
            </>
          )}
          {plan.semana1.coordinacionDece ? <LineaItem texto={plan.semana1.coordinacionDece} /> : null}
          {plan.semana1.tecnicasReflexion.filter(Boolean).length > 0 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Técnicas de reflexión</Text>
              {plan.semana1.tecnicasReflexion.filter(Boolean).map((t, i) => (
                <LineaItem key={`tec-${i}`} texto={t} />
              ))}
            </>
          )}
          {esBT && (
            <>
              {plan.semana1BT?.reconocimientoEspacios?.filter(Boolean).length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Reconocimiento de espacios técnicos</Text>
                  {plan.semana1BT.reconocimientoEspacios.filter(Boolean).map((r, i) => (
                    <LineaItem key={`esp-${i}`} texto={r} />
                  ))}
                </>
              ) : null}
              {plan.semana1BT?.diagnosticoTecnico?.length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Diagnóstico técnico</Text>
                  {plan.semana1BT.diagnosticoTecnico.map((d, i) => (
                    <LineaItem key={`dt-${i}`} texto={d.criterioTexto} sub={`Nivel: ${NIVEL_LABEL[d.nivelDetectado] ?? d.nivelDetectado}`} />
                  ))}
                </>
              ) : null}
            </>
          )}
        </Seccion>

        <Seccion title="Semanas 2-3 — Nivela" emoji="📈" color="#B45309">
          {([2, 3] as const).map((sem) => {
            const items = actividadSemana(sem);
            if (!items.length) return null;
            return (
              <View key={sem} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginBottom: 4 }}>
                  Semana {sem} — {sem === 2 ? "base" : "consolidación"}
                </Text>
                {items.map((a, i) => (
                  <LineaItem
                    key={`sem${sem}-${i}`}
                    texto={`[${a.area}] ${a.destrezaCodigo} — ${a.destrezaDescripcion}`}
                    sub={a.descripcionActividad || undefined}
                  />
                ))}
              </View>
            );
          })}
          {plan.semana2y3.parejasConivelacion.length > 0 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 4, marginBottom: 4 }}>Parejas de conivelación</Text>
              {plan.semana2y3.parejasConivelacion.map((pc) => (
                <LineaItem
                  key={pc.id}
                  texto={`${pc.estudianteApoyoNombre || "?"} apoya a ${pc.estudianteApoyadoNombre || "?"}${pc.destrezaFocoDescripcion ? ` — ${pc.destrezaFocoDescripcion}` : ""}`}
                  sub={pc.notas}
                />
              ))}
            </>
          )}
          {esBT && plan.semana2y3BT?.actividadesNivelacionTecnica?.length ? (
            <>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 4, marginBottom: 4 }}>Nivelación técnica</Text>
              {plan.semana2y3BT.actividadesNivelacionTecnica.map((a, i) => (
                <LineaItem
                  key={`nt-${i}`}
                  texto={`${a.criterioTexto} (semana ${a.semana})`}
                  sub={a.descripcionActividad || undefined}
                />
              ))}
            </>
          ) : null}
        </Seccion>

        <Seccion title={esBT ? "Semanas 4-5 — Producto acreditable" : "Semanas 4-5 — Proyecto interdisciplinario"} emoji="🎯" color="#DC2626">
          {esBT ? (
            <>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
                {TIPOS_PRODUCTO_BT[plan.semana4y5BT?.productoAcreditable.tipo ?? "otro"] ?? "Producto acreditable"}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{plan.semana4y5BT?.productoAcreditable.descripcion}</Text>
              {plan.semana4y5BT?.productoAcreditable.actividadesSemana4?.filter(Boolean).length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Semana 4 — Elaboración</Text>
                  {plan.semana4y5BT.productoAcreditable.actividadesSemana4.filter(Boolean).map((a, i) => (
                    <LineaItem key={`s4bt-${i}`} texto={a} />
                  ))}
                </>
              ) : null}
              {plan.semana4y5BT?.productoAcreditable.actividadesSemana5?.filter(Boolean).length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Semana 5 — Presentación</Text>
                  {plan.semana4y5BT.productoAcreditable.actividadesSemana5.filter(Boolean).map((a, i) => (
                    <LineaItem key={`s5bt-${i}`} texto={a} />
                  ))}
                </>
              ) : null}
            </>
          ) : (
            <>
              {plan.semana4y5.proyecto.titulo ? <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{plan.semana4y5.proyecto.titulo}</Text> : null}
              {plan.semana4y5.proyecto.descripcion ? <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{plan.semana4y5.proyecto.descripcion}</Text> : null}
              {plan.semana4y5.proyecto.productoFinal ? (
                <View style={{ marginTop: 8, backgroundColor: "#FFF7ED", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#FDBA74" }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#9A3412" }}>📦 Producto final</Text>
                  <Text style={{ fontSize: 12, color: "#431407", marginTop: 2 }}>{plan.semana4y5.proyecto.productoFinal}</Text>
                </View>
              ) : null}
              {plan.semana4y5.proyecto.areasIntegradas.filter(Boolean).length ? (
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>
                  Áreas integradas: {plan.semana4y5.proyecto.areasIntegradas.filter(Boolean).join(", ")}
                </Text>
              ) : null}
              {plan.semana4y5.proyecto.actividadesSemana4?.filter(Boolean).length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Semana 4 — Planificación y elaboración</Text>
                  {plan.semana4y5.proyecto.actividadesSemana4.filter(Boolean).map((a, i) => (
                    <LineaItem key={`s4-${i}`} texto={a} />
                  ))}
                </>
              ) : null}
              {plan.semana4y5.proyecto.actividadesSemana5?.filter(Boolean).length ? (
                <>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted, marginTop: 8, marginBottom: 4 }}>Semana 5 — Socialización y reflexión</Text>
                  {plan.semana4y5.proyecto.actividadesSemana5.filter(Boolean).map((a, i) => (
                    <LineaItem key={`s5-${i}`} texto={a} />
                  ))}
                </>
              ) : null}
              {plan.semana4y5.proyecto.destrezasReforzadas?.filter(Boolean).length ? (
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>
                  Destrezas reforzadas: {plan.semana4y5.proyecto.destrezasReforzadas.filter(Boolean).join(", ")}
                </Text>
              ) : null}
            </>
          )}
        </Seccion>
      </ScrollView>
    </ScreenContainer>
  );
}