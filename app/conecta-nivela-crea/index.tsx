import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Alert, ActivityIndicator, Platform, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shareAsync } from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { TODAS_LAS_DESTREZAS, obtenerNombreSubnivel } from "@/data";
import type { Subnivel } from "@/data/types";
import { HABILIDADES_SOCIOEMOCIONALES } from "@/data/habilidades-socioemocionales";
import { FIGURAS_PROFESIONALES, type FiguraProfesional, type ModuloFormativo } from "@/data/bachillerato-tecnico";
import type {
  PlanConectaNivelaCrea, ConectaNivelaCreaAiResult,
  DiagnosticoAcademicoCNC, DiagnosticoSocioemocionalCNC,
  ParejaConivelacion, ActividadNivelacionCNC,
} from "@/data/types-cnc";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import { calcularBrechasCurso, estudiantesEvaluados, subnivelDesdeGrado } from "@/lib/evaluacion-utils";
import { resolverPrerrequisito } from "@/lib/curriculo-prerrequisitos";
import { diagnosticoAcademicoDesdeBrechas, nivelDominanteEstado } from "@/lib/cnc-diagnostico";
import { generarWordPlanCNC } from "@/lib/cnc-word-generator";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STEP_LABELS = ["Identificacion", "Semana 1", "Semanas 2-3", "Semanas 4-5", "Diagnóstico", "Resultado"];

const GRADOS_TODOS = [
  "1.° Grado EGB", "2.° EGB", "3.° EGB", "4.° EGB", "5.° EGB", "6.° EGB", "7.° EGB",
  "8.° EGB", "9.° EGB", "10.° EGB", "1.° BGU", "2.° BGU", "3.° BGU",
];

// Bachillerato Técnico tiene sus propios 3 años (no EGB/BGU); coincide con el
// campo "anio" de ModuloFormativo y con el reconocimiento de BT en
// lib/evaluacion-utils.ts (esBachilleratoTecnico), al que este grado viaja
// cuando el docente crea una evaluación diagnóstica desde este wizard.
const GRADOS_BT = ["1.° BT", "2.° BT", "3.° BT"];

// Las figuras profesionales de BT no son todas industriales: Atención a la
// Primera Infancia, Gestión Cultural, Hostelería, Seguridad Ciudadana,
// Actividad Física y Deporte, etc. son de servicio o cuidado. Las últimas 3
// categorías (antes de "Otro") cubren esos casos sin forzar una maqueta o un
// mantenimiento de equipo donde no corresponde.
const TIPOS_PRODUCTO_BT: {
  id: "maqueta" | "software_basico" | "plan_negocio" | "mantenimiento_equipo" | "servicio_programa" | "evento_presentacion" | "material_protocolo" | "otro";
  label: string;
}[] = [
  { id: "maqueta", label: "Maqueta" },
  { id: "software_basico", label: "Software básico" },
  { id: "plan_negocio", label: "Plan de negocio" },
  { id: "mantenimiento_equipo", label: "Mantenimiento de equipo" },
  { id: "servicio_programa", label: "Servicio o programa" },
  { id: "evento_presentacion", label: "Evento o presentación" },
  { id: "material_protocolo", label: "Material o protocolo" },
  { id: "otro", label: "Otro" },
];

function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function planVacio(): PlanConectaNivelaCrea {
  return {
    id: nuevoId(),
    institucion: "", docente: "", anioLectivo: "2026-2027",
    grado: "", paralelo: "", subnivel: "", fechaInicio: "",
    modalidad: "general",
    semana1: {
      actividadesAdaptacion: [], diagnosticoAcademico: [], diagnosticoSocioemocional: [],
      coordinacionDece: "", tecnicasReflexion: [],
    },
    semana2y3: { actividadesNivelacion: [], parejasConivelacion: [] },
    semana4y5: {
      proyecto: {
        titulo: "", descripcion: "", areasIntegradas: [], productoFinal: "",
        actividadesSemana4: [], actividadesSemana5: [], destrezasReforzadas: [],
        evidenciasCognitivas: [], evidenciasActitudinales: [], esEvaluacionFormativaOficial: true,
      },
    },
    status: "borrador",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Sub-componentes (duplicados del patrón de adaptacion-curricular, no compartidos) ──

function StepBar({ current, total, colors }: { current: number; total: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, flexDirection: "column", alignItems: "center", gap: 2 }}>
          <View style={{
            height: 4, width: "100%", borderRadius: 2,
            backgroundColor: i <= current ? colors.primary : colors.border,
          }} />
          <Text style={{ fontSize: 9, color: i === current ? colors.primary : colors.muted }}>
            {STEP_LABELS[i]}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Label({ text, colors }: { text: string; colors: any }) {
  return <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 4 }}>{text}</Text>;
}

function Field({
  label, value, onChangeText, colors, multiline = false, placeholder = "",
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  colors: any; multiline?: boolean; placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label text={label} colors={colors} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, {
          borderColor: colors.border, color: colors.text, backgroundColor: colors.surface,
          minHeight: multiline ? 72 : 40,
          textAlignVertical: multiline ? "top" : "center",
        }]}
      />
    </View>
  );
}

function ChipGroup<T extends string>({
  options, selected, onSelect, colors, getLabel,
}: {
  options: T[]; selected: T; onSelect: (v: T) => void; colors: any; getLabel?: (v: T) => string;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onSelect(opt)}
          style={{
            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
            backgroundColor: selected === opt ? colors.primary : colors.surface,
            borderWidth: 1, borderColor: selected === opt ? colors.primary : colors.border,
          }}
        >
          <Text style={{ fontSize: 12, color: selected === opt ? "#fff" : colors.text }}>
            {getLabel ? getLabel(opt) : opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function MultiChip({ options, selected, onToggle, colors, getLabel }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; colors: any; getLabel?: (v: string) => string;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {options.map((opt) => {
        const sel = selected.includes(opt);
        return (
          <Pressable
            key={opt}
            onPress={() => onToggle(opt)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              backgroundColor: sel ? colors.primary : colors.surface,
              borderWidth: 1, borderColor: sel ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 12, color: sel ? "#fff" : colors.text }}>
              {getLabel ? getLabel(opt) : opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionHeading({ text, colors }: { text: string; colors: any }) {
  return (
    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary, marginBottom: 8, marginTop: 4 }}>
      {text}
    </Text>
  );
}

function DestrezaBuscadorCNC({
  area, subnivelCurso, onSelect, colors,
}: {
  area: "LL" | "M";
  /** Subnivel del curso (derivado del grado); null si no se pudo inferir */
  subnivelCurso: Subnivel | null;
  onSelect: (codigo: string, desc: string) => void;
  colors: any;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof TODAS_LAS_DESTREZAS>([]);

  function search(text: string) {
    setQuery(text);
    if (text.length < 3) { setResults([]); return; }
    const q = text.toLowerCase();
    setResults(
      TODAS_LAS_DESTREZAS.filter(
        (d) => d.area === area && (d.codigo.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q))
      ).slice(0, 6)
    );
  }

  function cerrar() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  // La Semana 1 diagnostica lo que el estudiante debería traer del nivel
  // anterior — mismo criterio de "subnivel prerrequisito" que Evaluación
  // Diagnóstica (design.md D10 de ese módulo, lib/curriculo-prerrequisitos.ts).
  // Sin esto, el prerrequisito solo aparecía si el docente ya sabía el código
  // exacto para escribirlo: la búsqueda no tenía ningún filtro de subnivel.
  const prerreq = subnivelCurso !== null ? resolverPrerrequisito(area, subnivelCurso) : null;
  // El modelo de diagnóstico académico de CNC solo admite LL/M (no CAI), así
  // que si el prerrequisito real es Preparatoria (currículo integrado) no hay
  // nada que sugerir aquí — se informa en vez de mostrar destrezas de otra área.
  const sugeridasTodas =
    prerreq && prerreq.area === area
      ? TODAS_LAS_DESTREZAS.filter((d) => d.area === prerreq.area && d.subnivel === prerreq.subnivel)
      : [];
  const sugeridas = sugeridasTodas.slice(0, 30);
  const nombreArea = area === "LL" ? "Lengua y Literatura" : "Matemática";

  return (
    <View style={{ marginBottom: 12 }}>
      <Label text={`Destreza de ${nombreArea}`} colors={colors} />

      {/* Botón compacto que abre el picker — mismo patrón que planificar-semanal */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [{
          borderWidth: 1, borderRadius: 8, padding: 10,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          opacity: pressed ? 0.7 : 1,
          borderColor: colors.border, backgroundColor: colors.surface,
        }]}
      >
        <Text style={{ color: colors.muted, fontSize: 13 }}>🔍 Agregar destreza de {nombreArea}...</Text>
        <Text style={{ color: colors.muted, fontSize: 16, marginLeft: 8 }}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={cerrar}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}
          onPress={cerrar}
        >
          <Pressable
            style={{ width: "90%", maxWidth: 520, backgroundColor: colors.background, borderRadius: 14, padding: 16, maxHeight: "80%" }}
            onPress={() => {}}
          >
            <Text style={{ fontWeight: "700", fontSize: 14, color: colors.foreground, marginBottom: 10 }}>
              Agregar destreza de {nombreArea}
            </Text>
            <TextInput
              autoFocus
              value={query}
              onChangeText={search}
              placeholder="Código o descripción..."
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, marginBottom: 8 }]}
            />

            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 360 }}>
              {!query && sugeridas.length > 0 && (
                <>
                  <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>
                    Del nivel prerrequisito ({obtenerNombreSubnivel(prerreq!.subnivel)}) — lo que el estudiante debería traer
                  </Text>
                  {sugeridas.map((d) => (
                    <Pressable
                      key={d.codigo}
                      onPress={() => onSelect(d.codigo, d.descripcion)}
                      style={({ pressed }) => [styles.dropdownItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Text style={{ minWidth: 62, color: colors.primary, fontWeight: "700", fontSize: 12 }}>{d.codigo}</Text>
                      <Text style={{ color: colors.foreground, fontSize: 12, flex: 1, marginLeft: 8 }} numberOfLines={2}>
                        {d.descripcion}
                      </Text>
                    </Pressable>
                  ))}
                  {sugeridasTodas.length > sugeridas.length && (
                    <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center", paddingVertical: 6 }}>
                      Usa el buscador para ver el resto ({sugeridasTodas.length} destrezas en total)
                    </Text>
                  )}
                </>
              )}

              {!query && !sugeridas.length && subnivelCurso !== null && (
                <Text style={{ fontSize: 11, color: colors.muted, padding: 8, fontStyle: "italic" }}>
                  {prerreq
                    ? `El nivel prerrequisito (${obtenerNombreSubnivel(prerreq.subnivel)}) no tiene destrezas de ${nombreArea} — ese subnivel usa currículo integrado. Usa el buscador si necesitas otra destreza.`
                    : "Este grado no tiene un nivel prerrequisito definido. Usa el buscador para encontrar destrezas."}
                </Text>
              )}

              {query && results.map((d) => (
                <Pressable
                  key={d.codigo}
                  onPress={() => { onSelect(d.codigo, d.descripcion); setQuery(""); setResults([]); }}
                  style={({ pressed }) => [styles.dropdownItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text style={{ minWidth: 62, color: colors.primary, fontWeight: "700", fontSize: 12 }}>{d.codigo}</Text>
                  <Text style={{ color: colors.foreground, fontSize: 12, flex: 1, marginLeft: 8 }} numberOfLines={2}>
                    {d.descripcion}
                  </Text>
                </Pressable>
              ))}
              {query && query.length >= 3 && results.length === 0 && (
                <Text style={{ color: colors.muted, textAlign: "center", padding: 20, fontStyle: "italic" }}>Sin resultados</Text>
              )}
              {query && query.length > 0 && query.length < 3 && (
                <Text style={{ color: colors.muted, textAlign: "center", padding: 20, fontStyle: "italic" }}>Escribe para buscar...</Text>
              )}
            </ScrollView>

            <Pressable
              onPress={cerrar}
              style={{ marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: colors.border, alignItems: "center" }}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Listo</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function ConectaNivelaCreaScreen() {
  const colors = useColors();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { addPlanCNC } = usePlanificacionesCNC();
  const { evaluaciones } = useEvaluaciones();

  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<PlanConectaNivelaCrea>(planVacio);
  const [aiResult, setAiResult] = useState<ConectaNivelaCreaAiResult | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"word" | "pdf" | null>(null);
  const [saved, setSaved] = useState(false);
  const [evaluacionVinculadaId, setEvaluacionVinculadaId] = useState<string | null>(null);

  const generateMutation = trpc.cnc.generate.useMutation();
  const sugerirReflexionMutation = trpc.cnc.sugerirReflexionDece.useMutation();
  const sugerirConivelacionMutation = trpc.cnc.sugerirConivelacion.useMutation();

  const esBT = plan.modalidad === "bt";
  const subnivelCurso = subnivelDesdeGrado(plan.grado);
  const figuraSeleccionada: FiguraProfesional | undefined = FIGURAS_PROFESIONALES.find((f) => f.id === plan.figuraProfesionalId);
  const moduloSeleccionado: ModuloFormativo | undefined = figuraSeleccionada?.modulos.find((m) => m.codigo === plan.moduloId);

  // Evaluaciones aplicables a CNC: solo Lengua y Matemática, con aplicados y brechas
  const evaluacionesCNC = useMemo(
    () =>
      evaluaciones
        .filter((e) => e.area === "LL" || e.area === "M")
        .map((ev) => ({
          ev,
          aplicados: estudiantesEvaluados(ev).length,
          brechas: calcularBrechasCurso(ev),
        })),
    [evaluaciones]
  );

  const evaluacionesIdsRef = useRef<string[]>([]);
  const pendingAutoLinkRef = useRef(false);

  useEffect(() => {
    const ids = evaluaciones.map((e) => e.id);
    if (pendingAutoLinkRef.current) {
      const nueva = evaluaciones.find((e) => !evaluacionesIdsRef.current.includes(e.id));
      if (nueva) {
        pendingAutoLinkRef.current = false;
        if (nueva.area === "LL" || nueva.area === "M") vincularEvaluacion(nueva.id);
      }
    }
    evaluacionesIdsRef.current = ids;
  }, [evaluaciones]);

  function vincularEvaluacion(evId: string) {
    const entry = evaluacionesCNC.find((x) => x.ev.id === evId);
    if (!entry || entry.aplicados === 0) {
      Alert.alert("Evaluación sin aplicar", "Debe ser aplicada primero para poder vincular sus resultados.");
      return;
    }
    const importar = () => {
      const diagnostico = diagnosticoAcademicoDesdeBrechas(entry.brechas, entry.ev.area as "LL" | "M");
      setPlan((p) => ({ ...p, semana1: { ...p.semana1, diagnosticoAcademico: diagnostico } }));
      setEvaluacionVinculadaId(evId);
    };
    if (plan.semana1.diagnosticoAcademico.length > 0) {
      const msg = "Ya existe un diagnóstico académico registrado en Semana 1. ¿Deseas reemplazarlo con las brechas de la evaluación seleccionada?";
      if (Platform.OS === "web") {
        if (confirm(msg)) importar();
      } else {
        Alert.alert("Reemplazar diagnóstico", msg, [
          { text: "Cancelar", style: "cancel" },
          { text: "Reemplazar", onPress: importar },
        ]);
      }
    } else {
      importar();
    }
  }

  function scrollTop() { scrollRef.current?.scrollTo({ y: 0, animated: true }); }
  function nextStep() { setStep((s) => s + 1); scrollTop(); }
  function prevStep() { setStep((s) => s - 1); scrollTop(); }

  function validateStep(): string | null {
    if (step === 0) {
      if (!plan.grado) return "Selecciona el grado o curso.";
      if (esBT && (!plan.figuraProfesionalId || !plan.moduloId)) return "Selecciona Figura Profesional y Módulo.";
    }
    if (step === 1) {
      if (!plan.semana1.diagnosticoAcademico.length) return "Agrega al menos una destreza al diagnóstico académico.";
    }
    if (step === 2) {
      if (!plan.semana2y3.actividadesNivelacion.length) return "Agrega al menos una destreza de nivelación.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    nextStep();
  }

  async function handleGenerate() {
    setGenerateError(null);
    let sessionId = await AsyncStorage.getItem("@planificadoc_device_id");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      await AsyncStorage.setItem("@planificadoc_device_id", sessionId);
    }

    try {
      const res = await generateMutation.mutateAsync({
        form: {
          institucion: plan.institucion, docente: plan.docente, anioLectivo: plan.anioLectivo,
          grado: plan.grado, paralelo: plan.paralelo, subnivel: plan.subnivel,
          modalidad: plan.modalidad, figuraProfesionalId: plan.figuraProfesionalId, moduloId: plan.moduloId,
          semana1: plan.semana1, semana1BT: plan.semana1BT,
          semana2y3: plan.semana2y3, semana2y3BT: plan.semana2y3BT,
          semana4y5: {
            titulo: plan.semana4y5.proyecto.titulo,
            descripcion: plan.semana4y5.proyecto.descripcion,
            areasIntegradas: plan.semana4y5.proyecto.areasIntegradas,
            notasDocente: undefined,
            productoFinal: plan.semana4y5.proyecto.productoFinal,
            actividadesSemana4: plan.semana4y5.proyecto.actividadesSemana4,
            actividadesSemana5: plan.semana4y5.proyecto.actividadesSemana5,
          },
          semana4y5BT: plan.semana4y5BT
            ? {
                tipoProducto: plan.semana4y5BT.productoAcreditable.tipo,
                descripcion: plan.semana4y5BT.productoAcreditable.descripcion,
                actividadesSemana4: plan.semana4y5BT.productoAcreditable.actividadesSemana4,
                actividadesSemana5: plan.semana4y5BT.productoAcreditable.actividadesSemana5,
              }
            : undefined,
        },
        sessionId,
      });
      if (!res?.aiResult) {
        setGenerateError("La IA no devolvió resultados. Intenta de nuevo.");
        return;
      }
      setAiResult(res.aiResult);

      // Completa con sugerencias de la IA solo los campos que el docente dejó vacíos —
      // lo que el docente ya escribió nunca se sobreescribe.
      const actividadesAdaptacion = plan.semana1.actividadesAdaptacion.filter(Boolean).length
        ? plan.semana1.actividadesAdaptacion
        : res.aiResult.actividadesAdaptacionSugeridas;
      const tecnicasReflexion = plan.semana1.tecnicasReflexion.filter(Boolean).length
        ? plan.semana1.tecnicasReflexion
        : res.aiResult.tecnicaDiagnosticoSugerida;

      const actividadesNivelacion = plan.semana2y3.actividadesNivelacion.length
        ? plan.semana2y3.actividadesNivelacion.map((a) => {
            if (a.descripcionActividad) return a;
            const sugerida = res.aiResult.actividadesNivelacionSugeridas.find((s) => s.destrezaCodigo === a.destrezaCodigo);
            return sugerida ? { ...a, descripcionActividad: sugerida.descripcionActividad } : a;
          })
        : res.aiResult.actividadesNivelacionSugeridas.map((s) => ({
            destrezaCodigo: s.destrezaCodigo, destrezaDescripcion: s.destrezaDescripcion,
            area: s.area, descripcionActividad: s.descripcionActividad, semana: s.semana,
          }));

      const semana1BTCompletado = plan.semana1BT ? {
        reconocimientoEspacios: plan.semana1BT.reconocimientoEspacios.filter(Boolean).length
          ? plan.semana1BT.reconocimientoEspacios : [],
        diagnosticoTecnico: plan.semana1BT.diagnosticoTecnico.length
          ? plan.semana1BT.diagnosticoTecnico
          : (res.aiResult.diagnosticoTecnicoSugerido ?? []),
      } : plan.semana1BT;

      const semana2y3BTCompletado = plan.semana2y3BT ? {
        actividadesNivelacionTecnica: plan.semana2y3BT.actividadesNivelacionTecnica.length
          ? plan.semana2y3BT.actividadesNivelacionTecnica
          : (res.aiResult.actividadesNivelacionTecnicaSugeridas ?? []),
      } : plan.semana2y3BT;

      const actualizado: PlanConectaNivelaCrea = {
        ...plan,
        semana1: { ...plan.semana1, actividadesAdaptacion, tecnicasReflexion },
        semana1BT: semana1BTCompletado,
        semana2y3: { ...plan.semana2y3, actividadesNivelacion },
        semana2y3BT: semana2y3BTCompletado,
        semana4y5: {
          proyecto: {
            ...res.aiResult.proyectoSugerido,
            titulo: plan.semana4y5.proyecto.titulo || res.aiResult.proyectoSugerido.titulo,
            descripcion: plan.semana4y5.proyecto.descripcion || res.aiResult.proyectoSugerido.descripcion,
            areasIntegradas: plan.semana4y5.proyecto.areasIntegradas.length
              ? plan.semana4y5.proyecto.areasIntegradas
              : (res.aiResult.proyectoSugerido.areasIntegradas ?? []),
            productoFinal: plan.semana4y5.proyecto.productoFinal || res.aiResult.proyectoSugerido.productoFinal || "",
            actividadesSemana4: plan.semana4y5.proyecto.actividadesSemana4.length
              ? plan.semana4y5.proyecto.actividadesSemana4
              : (res.aiResult.proyectoSugerido.actividadesSemana4 ?? []),
            actividadesSemana5: plan.semana4y5.proyecto.actividadesSemana5.length
              ? plan.semana4y5.proyecto.actividadesSemana5
              : (res.aiResult.proyectoSugerido.actividadesSemana5 ?? []),
          },
        },
        semana4y5BT: res.aiResult.productoAcreditableSugerido
          ? {
              productoAcreditable: {
                ...res.aiResult.productoAcreditableSugerido,
                tipo: plan.semana4y5BT?.productoAcreditable.tipo || res.aiResult.productoAcreditableSugerido.tipo,
                descripcion: plan.semana4y5BT?.productoAcreditable.descripcion || res.aiResult.productoAcreditableSugerido.descripcion,
                actividadesSemana4: plan.semana4y5BT?.productoAcreditable.actividadesSemana4?.length
                  ? plan.semana4y5BT.productoAcreditable.actividadesSemana4
                  : (res.aiResult.productoAcreditableSugerido.actividadesSemana4 ?? []),
                actividadesSemana5: plan.semana4y5BT?.productoAcreditable.actividadesSemana5?.length
                  ? plan.semana4y5BT.productoAcreditable.actividadesSemana5
                  : (res.aiResult.productoAcreditableSugerido.actividadesSemana5 ?? []),
              },
            }
          : plan.semana4y5BT,
        aiResult: res.aiResult,
        status: "generado",
        updatedAt: new Date().toISOString(),
      };
      setPlan(actualizado);
      await addPlanCNC(actualizado);
      setSaved(true);
      nextStep();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Error de conexión. Intenta de nuevo.";
      setGenerateError(msg);
    }
  }

  async function handleExport(formato: "word" | "pdf") {
    if (!aiResult) return;
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

  function addDiagnosticoAcademico(codigo: string, desc: string, area: "LL" | "M") {
    const nuevo: DiagnosticoAcademicoCNC = { destrezaCodigo: codigo, destrezaDescripcion: desc, area, observaciones: "", nivelDetectado: "en_proceso" };
    setPlan((p) => ({ ...p, semana1: { ...p.semana1, diagnosticoAcademico: [...p.semana1.diagnosticoAcademico, nuevo] } }));
  }

  function toggleHabilidadSocioemocional(habilidadId: string) {
    setPlan((p) => {
      const existe = p.semana1.diagnosticoSocioemocional.some((h) => h.habilidadId === habilidadId);
      const lista: DiagnosticoSocioemocionalCNC[] = existe
        ? p.semana1.diagnosticoSocioemocional.filter((h) => h.habilidadId !== habilidadId)
        : [...p.semana1.diagnosticoSocioemocional, { habilidadId, observaciones: "" }];
      return { ...p, semana1: { ...p.semana1, diagnosticoSocioemocional: lista } };
    });
  }

  function addActividadNivelacion(codigo: string, desc: string, area: "LL" | "M", semana: 2 | 3) {
    const nueva: ActividadNivelacionCNC = { destrezaCodigo: codigo, destrezaDescripcion: desc, area, descripcionActividad: "", semana };
    setPlan((p) => ({ ...p, semana2y3: { ...p.semana2y3, actividadesNivelacion: [...p.semana2y3.actividadesNivelacion, nueva] } }));
  }

  function addPareja() {
    const nueva: ParejaConivelacion = { id: nuevoId(), estudianteApoyoNombre: "", estudianteApoyadoNombre: "", destrezaFocoCodigo: "", destrezaFocoDescripcion: "" };
    setPlan((p) => ({ ...p, semana2y3: { ...p.semana2y3, parejasConivelacion: [...p.semana2y3.parejasConivelacion, nueva] } }));
  }

  async function handleSugerirReflexionDece() {
    try {
      const res = await sugerirReflexionMutation.mutateAsync({
        diagnosticoAcademico: plan.semana1.diagnosticoAcademico,
        diagnosticoSocioemocional: plan.semana1.diagnosticoSocioemocional,
      });
      setPlan((p) => ({
        ...p,
        semana1: {
          ...p.semana1,
          tecnicasReflexion: res.tecnicasReflexion,
          coordinacionDece: res.coordinacionDece,
        },
      }));
    } catch (err: any) {
      Alert.alert("Error al sugerir", err?.data?.message || err?.message || "No se pudo generar la sugerencia.");
    }
  }

  async function handleSugerirConivelacion() {
    if (!plan.semana2y3.actividadesNivelacion.length) {
      Alert.alert("Agrega destrezas primero", "Selecciona al menos una destreza de nivelación para sugerir parejas de conivelación.");
      return;
    }
    try {
      const res = await sugerirConivelacionMutation.mutateAsync({ actividadesNivelacion: plan.semana2y3.actividadesNivelacion });
      const nuevas: ParejaConivelacion[] = res.parejasSugeridas.map((s) => ({
        id: nuevoId(),
        estudianteApoyoNombre: "",
        estudianteApoyadoNombre: "",
        destrezaFocoCodigo: s.destrezaFocoCodigo,
        destrezaFocoDescripcion: s.destrezaFocoDescripcion,
        notas: s.sugerenciaEnfoque,
      }));
      setPlan((p) => ({ ...p, semana2y3: { ...p.semana2y3, parejasConivelacion: [...p.semana2y3.parejasConivelacion, ...nuevas] } }));
    } catch (err: any) {
      Alert.alert("Error al sugerir", err?.data?.message || err?.message || "No se pudo generar la sugerencia.");
    }
  }

  function updatePareja(id: string, campo: keyof ParejaConivelacion, valor: string) {
    setPlan((p) => ({
      ...p,
      semana2y3: {
        ...p.semana2y3,
        parejasConivelacion: p.semana2y3.parejasConivelacion.map((pc) => pc.id === id ? { ...pc, [campo]: valor } : pc),
      },
    }));
  }

  const habilidadesSeleccionables = HABILIDADES_SOCIOEMOCIONALES.filter((h) => !h.caiOnly);

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 22, color: colors.primary }}>←</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>Conecta, Nivela y Crea</Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>Arranque del año escolar — 5 semanas</Text>
          </View>
        </View>

        <StepBar current={step} total={6} colors={colors} />

        {/* ── PASO 0: Identificación ── */}
        {step === 0 && (
          <View>
            <SectionHeading text="Contexto pedagógico" colors={colors} />
            <Field label="Institución educativa" value={plan.institucion} onChangeText={(v) => setPlan((p) => ({ ...p, institucion: v }))} colors={colors} />
            <Field label="Docente" value={plan.docente} onChangeText={(v) => setPlan((p) => ({ ...p, docente: v }))} colors={colors} />
            <Field label="Año lectivo" value={plan.anioLectivo} onChangeText={(v) => setPlan((p) => ({ ...p, anioLectivo: v }))} colors={colors} />

            <Label text="Grado / Curso" colors={colors} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {(esBT ? GRADOS_BT : GRADOS_TODOS).map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setPlan((p) => ({ ...p, grado: g }))}
                  style={{
                    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
                    backgroundColor: plan.grado === g ? colors.primary : colors.surface,
                    borderWidth: 1, borderColor: plan.grado === g ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 11, color: plan.grado === g ? "#fff" : colors.text }}>{g}</Text>
                </Pressable>
              ))}
            </View>

            <Field label="Paralelo" value={plan.paralelo} onChangeText={(v) => setPlan((p) => ({ ...p, paralelo: v }))} colors={colors} placeholder="Ej: A" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Modalidad" colors={colors} />
            <ChipGroup
              options={["general", "bt"] as const}
              selected={plan.modalidad}
              onSelect={(v) => setPlan((p) => ({
                ...p,
                modalidad: v,
                // El grado seleccionado pertenece a la lista de la modalidad
                // anterior (EGB/BGU vs. BT); se limpia para no dejar un
                // valor que ya no aparece entre las opciones visibles.
                grado: v !== p.modalidad ? "" : p.grado,
                figuraProfesionalId: undefined,
                moduloId: undefined,
              }))}
              colors={colors}
              getLabel={(v) => v === "general" ? "General (EGB/BGU)" : "Bachillerato Técnico"}
            />

            {esBT && (
              <>
                <Label text="Figura Profesional" colors={colors} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {FIGURAS_PROFESIONALES.map((f) => (
                    <Pressable
                      key={f.id}
                      onPress={() => setPlan((p) => ({ ...p, figuraProfesionalId: f.id, moduloId: undefined }))}
                      style={{
                        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
                        backgroundColor: plan.figuraProfesionalId === f.id ? colors.primary : colors.surface,
                        borderWidth: 1, borderColor: plan.figuraProfesionalId === f.id ? colors.primary : colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 11, color: plan.figuraProfesionalId === f.id ? "#fff" : colors.text }}>{f.nombre}</Text>
                    </Pressable>
                  ))}
                </View>

                {figuraSeleccionada && (
                  <>
                    <Label text="Módulo" colors={colors} />
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {figuraSeleccionada.modulos.map((m) => (
                        <Pressable
                          key={m.codigo}
                          onPress={() => setPlan((p) => ({ ...p, moduloId: m.codigo }))}
                          style={{
                            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
                            backgroundColor: plan.moduloId === m.codigo ? colors.primary : colors.surface,
                            borderWidth: 1, borderColor: plan.moduloId === m.codigo ? colors.primary : colors.border,
                          }}
                        >
                          <Text style={{ fontSize: 11, color: plan.moduloId === m.codigo ? "#fff" : colors.text }}>{m.codigo} — {m.nombre}</Text>
                        </Pressable>
                      ))}
                    </View>
                    {moduloSeleccionado && !moduloSeleccionado.resultadosAprendizaje?.length && (
                      <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#F59E0B", marginBottom: 12 }}>
                        <Text style={{ fontSize: 11, color: "#92400E" }}>
                          ⚠️ Este módulo aún no tiene catálogo técnico transcrito (RA/CE o UC/EC/CD). El diagnóstico técnico quedará limitado a lo que escribas manualmente — la IA no inventará criterios.
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* ── PASO 4: Diagnóstico ── */}
        {step === 4 && (
          <View>
            <SectionHeading text="Diagnóstico" colors={colors} />
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
              Vincula una evaluación diagnóstica de Lengua y Literatura o Matemática para prellenar el diagnóstico académico de la Semana 1 con sus brechas, o crea una nueva.
            </Text>

            {evaluacionVinculadaId && (
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#16A34A", marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#15803D" }}>✅ Evaluación vinculada</Text>
                {(() => {
                  const x = evaluacionesCNC.find((e) => e.ev.id === evaluacionVinculadaId);
                  if (!x) return null;
                  return (
                    <>
                      <Text style={{ fontSize: 12, color: "#166534", marginTop: 4 }}>{x.ev.nombre}</Text>
                      <Text style={{ fontSize: 11, color: "#166534", marginTop: 2 }}>
                        {x.ev.area === "LL" ? "Lengua y Literatura" : "Matemática"} · {x.aplicados} aplicado(s) — {plan.semana1.diagnosticoAcademico.length} DCD importadas a Semana 1.
                      </Text>
                    </>
                  );
                })()}
              </View>
            )}

            <Pressable
              onPress={() => {
                pendingAutoLinkRef.current = true;
                const dcds = Array.from(
                  new Set([
                    ...plan.semana1.diagnosticoAcademico.map((d) => d.destrezaCodigo),
                    ...plan.semana2y3.actividadesNivelacion.map((a) => a.destrezaCodigo),
                  ])
                );
                const q = [
                  `from=cnc`,
                  `anioLectivo=${encodeURIComponent(plan.anioLectivo || "")}`,
                  `grado=${encodeURIComponent(plan.grado || "")}`,
                  `paralelo=${encodeURIComponent(plan.paralelo || "")}`,
                  dcds.length ? `dcds=${encodeURIComponent(dcds.join(","))}` : "",
                ].filter(Boolean).join("&");
                router.push(`/evaluacion-diagnostica?${q}` as any);
              }}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1D4ED8", borderRadius: 12, paddingVertical: 14, marginBottom: 16 }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>＋</Text>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Crear evaluación diagnóstica</Text>
            </Pressable>

            <SectionHeading text="Evaluaciones disponibles (Lengua y Matemática)" colors={colors} />
            {evaluacionesCNC.length === 0 ? (
              <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", paddingVertical: 24 }}>
                Aún no hay evaluaciones de Lengua y Matemática. Crea una para poder vincularla.
              </Text>
            ) : (
              evaluacionesCNC.map(({ ev, aplicados, brechas }) => {
                const vinculada = ev.id === evaluacionVinculadaId;
                const linkable = aplicados > 0;
                const dominadas = brechas.filter((b) => nivelDominanteEstado(b) === "dominado").length;
                const enProceso = brechas.filter((b) => nivelDominanteEstado(b) === "en_proceso").length;
                const refuerzo = brechas.filter((b) => nivelDominanteEstado(b) === "requiere_refuerzo").length;
                return (
                  <View
                    key={ev.id}
                    style={{
                      backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 10,
                      borderWidth: 1, borderColor: vinculada ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }} numberOfLines={1}>{ev.nombre}</Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                      {ev.grado} {ev.paralelo ? `· ${ev.paralelo}` : ""} · {ev.area === "LL" ? "Lengua y Literatura" : "Matemática"}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
                      {aplicados} aplicado(s) · Brechas: 🟢 {dominadas} · 🟡 {enProceso} · 🔴 {refuerzo}
                    </Text>
                    {!linkable ? (
                      <Text style={{ fontSize: 11, color: "#92400E", marginTop: 6 }}>
                        ⚠️ Debe ser aplicada primero para vincular sus resultados.
                      </Text>
                    ) : (
                      <Pressable
                        onPress={() => vincularEvaluacion(ev.id)}
                        style={{
                          marginTop: 8, alignSelf: "flex-start", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14,
                          backgroundColor: vinculada ? colors.surface : colors.primary, borderWidth: 1,
                          borderColor: vinculada ? colors.primary : colors.primary,
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "700", color: vinculada ? colors.primary : "#fff" }}>
                          {vinculada ? "Vincular de nuevo" : "Vincular a Semana 1"}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ── PASO 1: Semana 1 — Conecta ── */}
        {step === 1 && (
          <View>
            <SectionHeading text="Semana 1 — Conecta" colors={colors} />
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
              Adaptación al inicio del año + diagnóstico dual (académico y socioemocional), coordinado con el equipo DECE.
            </Text>

            <Field
              label="Actividades de adaptación (una por línea)"
              value={plan.semana1.actividadesAdaptacion.join("\n")}
              onChangeText={(v) => setPlan((p) => ({ ...p, semana1: { ...p.semana1, actividadesAdaptacion: v.split("\n") } }))}
              colors={colors}
              multiline
              placeholder="Ej: Dinámica de bienvenida...&#10;Construcción de normas de convivencia..."
            />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Diagnóstico académico (Lengua y Matemática)" colors={colors} />
            <DestrezaBuscadorCNC area="LL" subnivelCurso={subnivelCurso} onSelect={(c, d) => addDiagnosticoAcademico(c, d, "LL")} colors={colors} />
            <DestrezaBuscadorCNC area="M" subnivelCurso={subnivelCurso} onSelect={(c, d) => addDiagnosticoAcademico(c, d, "M")} colors={colors} />
            {plan.semana1.diagnosticoAcademico.map((d, i) => (
              <View key={i} style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>[{d.area}] {d.destrezaCodigo}</Text>
                <Text style={{ fontSize: 11, color: colors.text }} numberOfLines={2}>{d.destrezaDescripcion}</Text>
              </View>
            ))}

            {esBT && (
              <>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
                <SectionHeading text="Reconocimiento de espacios técnicos" colors={colors} />
                <Field
                  label="Talleres / laboratorios / granjas (uno por línea)"
                  value={(plan.semana1BT?.reconocimientoEspacios ?? []).join("\n")}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana1BT: { reconocimientoEspacios: v.split("\n"), diagnosticoTecnico: p.semana1BT?.diagnosticoTecnico ?? [] } }))}
                  colors={colors}
                  multiline
                  placeholder="Ej: Taller de mecánica, Laboratorio de cómputo..."
                />
                {moduloSeleccionado?.resultadosAprendizaje?.length ? (
                  <>
                    <Label text="Criterios técnicos del módulo (toca para agregar al diagnóstico)" colors={colors} />
                    {moduloSeleccionado.resultadosAprendizaje.map((ra) => (
                      <Pressable
                        key={ra.id}
                        onPress={() => setPlan((p) => ({
                          ...p,
                          semana1BT: {
                            reconocimientoEspacios: p.semana1BT?.reconocimientoEspacios ?? [],
                            diagnosticoTecnico: [...(p.semana1BT?.diagnosticoTecnico ?? []), { criterioId: ra.id, criterioTexto: ra.texto, observaciones: "", nivelDetectado: "en_proceso" }],
                          },
                        }))}
                        style={{ padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 6, backgroundColor: colors.surface }}
                      >
                        <Text style={{ fontSize: 11, color: colors.text }}>{ra.texto}</Text>
                      </Pressable>
                    ))}
                  </>
                ) : null}
                {(plan.semana1BT?.diagnosticoTecnico ?? []).map((d, i) => (
                  <View key={i} style={{ backgroundColor: "#DBEAFE", borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#2563EB" }}>
                    <Text style={{ fontSize: 11, color: "#1E3A8A" }} numberOfLines={2}>{d.criterioTexto}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Diagnóstico socioemocional" colors={colors} />
            <MultiChip
              options={habilidadesSeleccionables.map((h) => h.id)}
              selected={plan.semana1.diagnosticoSocioemocional.map((h) => h.habilidadId)}
              onToggle={toggleHabilidadSocioemocional}
              colors={colors}
              getLabel={(id) => {
                const h = habilidadesSeleccionables.find((x) => x.id === id);
                return h ? `${h.emoji} ${h.nombre}` : id;
              }}
            />

            <Pressable
              onPress={handleSugerirReflexionDece}
              disabled={sugerirReflexionMutation.isPending}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: colors.primary + "20", borderRadius: 10, borderWidth: 1, borderColor: colors.primary, paddingVertical: 10, marginBottom: 12 }}
            >
              {sugerirReflexionMutation.isPending ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={{ fontSize: 13 }}>✨</Text>
              )}
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
                {sugerirReflexionMutation.isPending ? "Sugiriendo..." : "Sugerir con IA (técnicas + nota DECE)"}
              </Text>
            </Pressable>

            <Field
              label="Nota de coordinación con DECE"
              value={plan.semana1.coordinacionDece}
              onChangeText={(v) => setPlan((p) => ({ ...p, semana1: { ...p.semana1, coordinacionDece: v } }))}
              colors={colors}
              multiline
              placeholder="Ej: Se compartió el diagnóstico socioemocional con el equipo DECE para seguimiento conjunto..."
            />

            <Field
              label="Técnicas de reflexión (una por línea)"
              value={plan.semana1.tecnicasReflexion.join("\n")}
              onChangeText={(v) => setPlan((p) => ({ ...p, semana1: { ...p.semana1, tecnicasReflexion: v.split("\n") } }))}
              colors={colors}
              multiline
              placeholder="Ej: ¿Qué nos falta por aprender?&#10;¿Dónde usaste Matemática el año pasado?"
            />
          </View>
        )}

        {/* ── PASO 2: Semanas 2-3 — Nivela ── */}
        {step === 2 && (
          <View>
            <SectionHeading text="Semanas 2-3 — Nivela" colors={colors} />
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
              Refuerzo focalizado en Lengua y Matemática, con "conivelación" (tutoría entre pares).
            </Text>

            <DestrezaBuscadorCNC area="LL" subnivelCurso={subnivelCurso} onSelect={(c, d) => addActividadNivelacion(c, d, "LL", 2)} colors={colors} />
            <DestrezaBuscadorCNC area="M" subnivelCurso={subnivelCurso} onSelect={(c, d) => addActividadNivelacion(c, d, "M", 2)} colors={colors} />
            {plan.semana2y3.actividadesNivelacion.map((a, i) => (
              <View key={i} style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>[{a.area}] {a.destrezaCodigo} — semana {a.semana}</Text>
                <Text style={{ fontSize: 11, color: colors.text }} numberOfLines={2}>{a.destrezaDescripcion}</Text>
              </View>
            ))}

            {esBT && moduloSeleccionado?.resultadosAprendizaje?.length ? (
              <>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
                <SectionHeading text="Nivelación técnica" colors={colors} />
                <Label text="Criterios técnicos del módulo (toca para agregar a la nivelación)" colors={colors} />
                {moduloSeleccionado.resultadosAprendizaje.map((ra) => (
                  <Pressable
                    key={ra.id}
                    onPress={() => setPlan((p) => ({
                      ...p,
                      semana2y3BT: {
                        actividadesNivelacionTecnica: [...(p.semana2y3BT?.actividadesNivelacionTecnica ?? []), { criterioId: ra.id, criterioTexto: ra.texto, descripcionActividad: "", semana: 2 }],
                      },
                    }))}
                    style={{ padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 6, backgroundColor: colors.surface }}
                  >
                    <Text style={{ fontSize: 11, color: colors.text }}>{ra.texto}</Text>
                  </Pressable>
                ))}
                {(plan.semana2y3BT?.actividadesNivelacionTecnica ?? []).map((a, i) => (
                  <View key={i} style={{ backgroundColor: "#DBEAFE", borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: "#2563EB" }}>
                    <Text style={{ fontSize: 11, color: "#1E3A8A" }} numberOfLines={2}>{a.criterioTexto}</Text>
                  </View>
                ))}
              </>
            ) : null}

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
            <SectionHeading text="Parejas de conivelación" colors={colors} />
            <Pressable
              onPress={handleSugerirConivelacion}
              disabled={sugerirConivelacionMutation.isPending}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: colors.primary + "20", borderRadius: 10, borderWidth: 1, borderColor: colors.primary, paddingVertical: 10, marginBottom: 12 }}
            >
              {sugerirConivelacionMutation.isPending ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={{ fontSize: 13 }}>✨</Text>
              )}
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
                {sugerirConivelacionMutation.isPending ? "Sugiriendo..." : "Sugerir parejas con IA (por destreza)"}
              </Text>
            </Pressable>
            {plan.semana2y3.parejasConivelacion.map((pc) => (
              <View key={pc.id} style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border }}>
                {pc.notas ? (
                  <View style={{ backgroundColor: colors.primary + "15", borderRadius: 6, padding: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: colors.primary, marginBottom: 2 }}>✨ SUGERENCIA IA</Text>
                    <Text style={{ fontSize: 11, color: colors.text }}>{pc.notas}</Text>
                  </View>
                ) : null}
                <Field label="Estudiante que apoya" value={pc.estudianteApoyoNombre} onChangeText={(v) => updatePareja(pc.id, "estudianteApoyoNombre", v)} colors={colors} />
                <Field label="Estudiante apoyado" value={pc.estudianteApoyadoNombre} onChangeText={(v) => updatePareja(pc.id, "estudianteApoyadoNombre", v)} colors={colors} />
                <Field label="Destreza foco" value={pc.destrezaFocoDescripcion} onChangeText={(v) => updatePareja(pc.id, "destrezaFocoDescripcion", v)} colors={colors} placeholder="Ej: Fracciones" />
              </View>
            ))}
            <Pressable onPress={addPareja} style={{ paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 8, borderStyle: "dashed" }}>
              <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>+ Agregar pareja de conivelación</Text>
            </Pressable>
          </View>
        )}

        {/* ── PASO 3: Semanas 4-5 — Crea ── */}
        {step === 3 && (
          <View>
            <SectionHeading text="Semanas 4-5 — Crea" colors={colors} />
            <View style={{ backgroundColor: "#FEF3C7", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#F59E0B", marginBottom: 14 }}>
              <Text style={{ fontSize: 11, color: "#92400E" }}>
                Este proyecto interdisciplinario corresponde a la evaluación sumativa del trimestre — se aplica al finalizar cada período académico y evidencia aprendizajes cognitivos, procedimentales y actitudinales.
              </Text>
            </View>

            {!esBT && (
              <>
                <Field label="Título del proyecto (opcional — la IA sugiere uno si lo dejas vacío)" value={plan.semana4y5.proyecto.titulo} onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, titulo: v } } }))} colors={colors} />
                <Field label="Descripción / notas" value={plan.semana4y5.proyecto.descripcion} onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, descripcion: v } } }))} colors={colors} multiline />
                <Field
                  label="Áreas a integrar (una por línea, ej: CN, CS, ECA)"
                  value={plan.semana4y5.proyecto.areasIntegradas.join("\n")}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, areasIntegradas: v.split("\n") } } }))}
                  colors={colors}
                  multiline
                />
                <Field
                  label="Producto final (opcional — la IA sugiere uno si lo dejas vacío)"
                  value={plan.semana4y5.proyecto.productoFinal}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, productoFinal: v } } }))}
                  colors={colors}
                  multiline
                  placeholder="Ej: Decálogo ilustrado de convivencia y seguridad integral"
                />
                <Field
                  label="Actividades Semana 4 (una por línea)"
                  value={plan.semana4y5.proyecto.actividadesSemana4.join("\n")}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, actividadesSemana4: v.split("\n") } } }))}
                  colors={colors}
                  multiline
                  placeholder={"Ej: Planificación del proyecto...\nOrganización de equipos de trabajo..."}
                />
                <Field
                  label="Actividades Semana 5 (una por línea)"
                  value={plan.semana4y5.proyecto.actividadesSemana5.join("\n")}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5: { proyecto: { ...p.semana4y5.proyecto, actividadesSemana5: v.split("\n") } } }))}
                  colors={colors}
                  multiline
                  placeholder={"Ej: Finalización del producto...\nSocialización y presentación..."}
                />
              </>
            )}

            {esBT && (
              <>
                <Label text="Tipo de producto acreditable" colors={colors} />
                <ChipGroup
                  options={TIPOS_PRODUCTO_BT.map((t) => t.id)}
                  selected={plan.semana4y5BT?.productoAcreditable.tipo ?? "maqueta"}
                  onSelect={(v) => setPlan((p) => ({ ...p, semana4y5BT: { productoAcreditable: { tipo: v, descripcion: p.semana4y5BT?.productoAcreditable.descripcion ?? "", actividadesSemana4: p.semana4y5BT?.productoAcreditable.actividadesSemana4 ?? [], actividadesSemana5: p.semana4y5BT?.productoAcreditable.actividadesSemana5 ?? [] } } }))}
                  colors={colors}
                  getLabel={(v) => TIPOS_PRODUCTO_BT.find((t) => t.id === v)?.label ?? v}
                />
                <Field
                  label="Descripción del producto"
                  value={plan.semana4y5BT?.productoAcreditable.descripcion ?? ""}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5BT: { productoAcreditable: { tipo: p.semana4y5BT?.productoAcreditable.tipo ?? "maqueta", descripcion: v, actividadesSemana4: p.semana4y5BT?.productoAcreditable.actividadesSemana4 ?? [], actividadesSemana5: p.semana4y5BT?.productoAcreditable.actividadesSemana5 ?? [] } } }))}
                  colors={colors}
                  multiline
                />
                <Field
                  label="Actividades Semana 4 (una por línea)"
                  value={plan.semana4y5BT?.productoAcreditable.actividadesSemana4?.join("\n") ?? ""}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5BT: { productoAcreditable: { tipo: p.semana4y5BT?.productoAcreditable.tipo ?? "maqueta", descripcion: p.semana4y5BT?.productoAcreditable.descripcion ?? "", actividadesSemana4: v.split("\n"), actividadesSemana5: p.semana4y5BT?.productoAcreditable.actividadesSemana5 ?? [] } } }))}
                  colors={colors}
                  multiline
                  placeholder={"Ej: Selección de materiales...\nElaboración del producto..."}
                />
                <Field
                  label="Actividades Semana 5 (una por línea)"
                  value={plan.semana4y5BT?.productoAcreditable.actividadesSemana5?.join("\n") ?? ""}
                  onChangeText={(v) => setPlan((p) => ({ ...p, semana4y5BT: { productoAcreditable: { tipo: p.semana4y5BT?.productoAcreditable.tipo ?? "maqueta", descripcion: p.semana4y5BT?.productoAcreditable.descripcion ?? "", actividadesSemana4: p.semana4y5BT?.productoAcreditable.actividadesSemana4 ?? [], actividadesSemana5: v.split("\n") } } }))}
                  colors={colors}
                  multiline
                  placeholder={"Ej: Presentación del producto...\nEvaluación sumativa del trimestre..."}
                />
              </>
            )}

            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 12 }}
            >
              {generateMutation.isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Generando plan...</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>✨ Generar Plan Conecta, Nivela y Crea</Text>
              )}
            </Pressable>

            {generateError && (
              <View style={{ backgroundColor: "#FEE2E2", borderRadius: 10, padding: 14, marginTop: 14, borderWidth: 1, borderColor: "#FCA5A5" }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#DC2626", marginBottom: 4 }}>❌ Error al generar</Text>
                <Text style={{ fontSize: 12, color: "#991B1B" }}>{generateError}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── PASO 5: Resultado ── */}
        {step === 5 && !aiResult && (
          <View style={{ padding: 24, alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 40 }}>⚠️</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#DC2626", textAlign: "center" }}>No se pudo obtener el resultado</Text>
            <Pressable onPress={() => { setStep(3); scrollTop(); }} style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>← Volver a Generar</Text>
            </Pressable>
          </View>
        )}

        {step === 5 && aiResult && (
          <View>
            <View style={{ backgroundColor: "#DCFCE7", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#16A34A", marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#15803D" }}>✅ Plan generado{saved ? " y guardado" : ""}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <Pressable onPress={() => handleExport("word")} disabled={!!exporting} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#1E3A8A", borderRadius: 12, paddingVertical: 14 }}>
                {exporting === "word" ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 16 }}>📄</Text>}
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Word</Text>
              </Pressable>
              <Pressable onPress={() => handleExport("pdf")} disabled={!!exporting} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#B91C1C", borderRadius: 12, paddingVertical: 14 }}>
                {exporting === "pdf" ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ fontSize: 16 }}>📕</Text>}
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>PDF</Text>
              </Pressable>
            </View>

            <ResultSection title="Cronograma de las 5 semanas" emoji="🗓️" color={colors.primary}>
              <Text style={{ fontSize: 12, color: colors.text }}>{aiResult.cronogramaSemanal}</Text>
            </ResultSection>

            <ResultSection title="Semana 1 — Adaptación sugerida" emoji="🤝" color={colors.primary}>
              {aiResult.actividadesAdaptacionSugeridas.map((a, i) => (
                <Text key={i} style={{ fontSize: 12, color: colors.text, marginBottom: 2 }}>• {a}</Text>
              ))}
            </ResultSection>

            <ResultSection title="Semanas 2-3 — Nivelación sugerida" emoji="📈" color="#B45309">
              {aiResult.actividadesNivelacionSugeridas.map((a, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>[{a.area}] {a.destrezaCodigo}</Text>
                  <Text style={{ fontSize: 12, color: colors.text }}>{a.descripcionActividad}</Text>
                  {a.estrategiaConivelacion && (
                    <Text style={{ fontSize: 11, color: "#7C3AED", marginTop: 2 }}>🤝 Conivelación: {a.estrategiaConivelacion}</Text>
                  )}
                </View>
              ))}
            </ResultSection>

            <View style={{ borderWidth: 1.5, borderColor: "#DC262635", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              <View style={{ backgroundColor: "#DC2626", paddingHorizontal: 14, paddingVertical: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>🎯 Semanas 4-5 — {esBT ? "Producto acreditable" : "Proyecto interdisciplinario"}</Text>
              </View>
              <View style={{ padding: 14 }}>
                <View style={{ backgroundColor: "#FEE2E2", borderRadius: 8, padding: 8, marginBottom: 10 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#991B1B" }}>EVALUACIÓN SUMATIVA DEL TRIMESTRE</Text>
                </View>
                {!esBT ? (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{plan.semana4y5.proyecto.titulo}</Text>
                    <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{plan.semana4y5.proyecto.descripcion}</Text>
                    {!!plan.semana4y5.proyecto.productoFinal && (
                      <View style={{ marginTop: 8, backgroundColor: "#FFF7ED", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#FDBA74" }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#9A3412" }}>📦 Producto final</Text>
                        <Text style={{ fontSize: 12, color: "#431407", marginTop: 2 }}>{plan.semana4y5.proyecto.productoFinal}</Text>
                      </View>
                    )}
                    {plan.semana4y5.proyecto.actividadesSemana4?.filter(Boolean).length ? (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#7C3AED" }}>Semana 4 — Planificación y elaboración</Text>
                        {plan.semana4y5.proyecto.actividadesSemana4.filter(Boolean).map((a, i) => (
                          <Text key={`s4-${i}`} style={{ fontSize: 12, color: colors.text, marginTop: 3 }}>• {a}</Text>
                        ))}
                      </View>
                    ) : null}
                    {plan.semana4y5.proyecto.actividadesSemana5?.filter(Boolean).length ? (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#7C3AED" }}>Semana 5 — Socialización y reflexión</Text>
                        {plan.semana4y5.proyecto.actividadesSemana5.filter(Boolean).map((a, i) => (
                          <Text key={`s5-${i}`} style={{ fontSize: 12, color: colors.text, marginTop: 3 }}>• {a}</Text>
                        ))}
                      </View>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>
                      {TIPOS_PRODUCTO_BT.find((t) => t.id === plan.semana4y5BT?.productoAcreditable.tipo)?.label ?? "Producto acreditable"}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{plan.semana4y5BT?.productoAcreditable.descripcion}</Text>
                    {plan.semana4y5BT?.productoAcreditable.actividadesSemana4?.filter(Boolean).length ? (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#7C3AED" }}>Semana 4 — Elaboración del producto</Text>
                        {plan.semana4y5BT.productoAcreditable.actividadesSemana4.filter(Boolean).map((a, i) => (
                          <Text key={`s4bt-${i}`} style={{ fontSize: 12, color: colors.text, marginTop: 3 }}>• {a}</Text>
                        ))}
                      </View>
                    ) : null}
                    {plan.semana4y5BT?.productoAcreditable.actividadesSemana5?.filter(Boolean).length ? (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#7C3AED" }}>Semana 5 — Presentación y evaluación</Text>
                        {plan.semana4y5BT.productoAcreditable.actividadesSemana5.filter(Boolean).map((a, i) => (
                          <Text key={`s5bt-${i}`} style={{ fontSize: 12, color: colors.text, marginTop: 3 }}>• {a}</Text>
                        ))}
                      </View>
                    ) : null}
                  </>
                )}
              </View>
            </View>
          </View>
        )}

        {validationError && step < 3 && (
          <View style={{ backgroundColor: "#FEF3C7", borderRadius: 8, padding: 12, marginTop: 8, borderWidth: 1, borderColor: "#F59E0B", flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 14 }}>⚠️</Text>
            <Text style={{ fontSize: 12, color: "#92400E", flex: 1 }}>{validationError}</Text>
          </View>
        )}

        {step < 5 && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20, marginBottom: 8 }}>
            {step > 0 && (
              <Pressable onPress={prevStep} style={{ flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                <Text style={{ color: colors.text, fontWeight: "600" }}>← Anterior</Text>
              </Pressable>
            )}
            {(step < 3 || step === 4) && (
              <Pressable onPress={handleNext} style={{ flex: 2, borderRadius: 10, paddingVertical: 12, alignItems: "center", backgroundColor: colors.primary }}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Siguiente →</Text>
              </Pressable>
            )}
          </View>
        )}

        {step === 5 && (
          <Pressable
            onPress={() => { setStep(0); setAiResult(null); setPlan(planVacio()); setSaved(false); setGenerateError(null); }}
            style={{ alignItems: "center", marginTop: 20 }}
          >
            <Text style={{ fontSize: 12, color: colors.primary, textDecorationLine: "underline" }}>+ Nuevo plan</Text>
          </Pressable>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function ResultSection({ title, emoji, color, children }: { title: string; emoji: string; color: string; children: React.ReactNode }) {
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

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  dropdownItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
});
