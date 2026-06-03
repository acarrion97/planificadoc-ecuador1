/**
 * Pantalla: Planificación Semanal de Educación Inicial
 * Flujo: datos básicos → ámbitos + clases (generadas con IA) → export .docx
 */
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { shareAsync } from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { AREAS_INFO } from "@/data";
import { destrezasInicial } from "@/data/destrezas-inicial";
import { generarWordPlanificacionInicial } from "@/lib/plan-inicial-word-generator";
import type {
  PlanificacionInicialSemanal,
  AmbitoInicial,
  ClaseInicial,
} from "@/data/types-inicial";

// ── Constantes ────────────────────────────────────────────────────────────────
const GRADOS = ["Inicial 1 (3 a 4 años)", "Inicial 2 (4 a 5 años)"];

const OBJETIVO_GRAL: Record<string, string> = {
  "Inicial 1 (3 a 4 años)":
    "Descubrir y relacionarse con su entorno inmediato, desarrollando su identidad y autonomía mediante actividades de juego y exploración.",
  "Inicial 2 (4 a 5 años)":
    "Descubrir y relacionarse adecuadamente con el medio social para desarrollar actitudes que le permitan tener una convivencia armónica con las personas de su entorno.",
};

const METODOLOGIAS = ["Juego-trabajo", "Juego libre", "Rincones de aprendizaje", "Experiencia directa"];

const EJES = [
  "Permanencia Escolar",
  "Socioemocional",
  "Lógico-matemático",
  "Corporal y motriz",
  "Artístico",
  "Lengua y comunicación",
];

const METODOS_EVAL = ["Observación", "Fichas anecdóticas", "Fichas de cotejo", "Portfolio"];

const AMBITOS_INI = AREAS_INFO["INI"].bloques; // {1: "Identidad y Autonomía", ...}
const AMBITO_KEYS = Object.keys(AMBITOS_INI).map(Number).sort();

// ── Tipos locales ─────────────────────────────────────────────────────────────
interface ClaseState {
  id: string;
  numero: number;
  tema: string;
  metodologia: string;
  generando: boolean;
  generado: boolean;
  objetivoEspecifico: string;
  inicioText: string;   // líneas separadas por \n
  desarrolloText: string;
  cierreText: string;
  metodoEvaluacion: string[];
}

interface AmbitoState {
  id: string;
  ambitoKey: number;          // 1-7
  competenciaCodigo: string;
  competenciaDescripcion: string;
  destrezas: string[];         // descripciones seleccionadas
  ejesTransversales: string[];
  clases: ClaseState[];
  expandido: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function claseVacia(numero: number): ClaseState {
  return {
    id: uid(),
    numero,
    tema: "",
    metodologia: "Juego-trabajo",
    generando: false,
    generado: false,
    objetivoEspecifico: "",
    inicioText: "",
    desarrolloText: "",
    cierreText: "",
    metodoEvaluacion: ["Observación", "Fichas anecdóticas", "Fichas de cotejo"],
  };
}

function ambitoVacio(): AmbitoState {
  return {
    id: uid(),
    ambitoKey: 1,
    competenciaCodigo: "",
    competenciaDescripcion: "",
    destrezas: [],
    ejesTransversales: ["Permanencia Escolar"],
    clases: [claseVacia(1)],
    expandido: true,
  };
}

function lineasAArray(text: string): string[] {
  return text.split("\n").map(l => l.replace(/^[•\-\d.\s]+/, "").trim()).filter(Boolean);
}

// ── Componentes pequeños ──────────────────────────────────────────────────────
function SectionHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function Label({ text }: { text: string }) {
  const colors = useColors();
  return <Text style={[s.label, { color: colors.muted }]}>{text}</Text>;
}

function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  const colors = useColors();
  const bg = selected ? (color ?? colors.primary) : colors.surface;
  const border = selected ? (color ?? colors.primary) : colors.border;
  const textColor = selected ? "#fff" : colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[s.chipText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function PlanificarInicialScreen() {
  const colors = useColors();
  const router = useRouter();
  const generateClaseMutation = trpc.inicial.generateClase.useMutation();

  // ── Estado: datos básicos ──────────────────────────────────────────────────
  const [grado, setGrado] = useState(GRADOS[1]);
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [duracion, setDuracion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [bibliografia, setBibliografia] = useState(
    "Ministerio de Educación del Ecuador. (2024). Currículo Priorizado Educación Inicial. Quito: MinEduc."
  );

  // ── Estado: firmantes ─────────────────────────────────────────────────────
  const [elaboradoNombre, setElaboradoNombre] = useState("");
  const [revisadoNombre, setRevisadoNombre] = useState("");
  const [revisadoCargo, setRevisadoCargo] = useState("DECE");
  const [coordinadorNombre, setCoordinadorNombre] = useState("");
  const [aprobadoNombre, setAprobadoNombre] = useState("");
  const [aprobadoCargo, setAprobadoCargo] = useState("Vicerrector/a");

  // ── Estado: ámbitos ───────────────────────────────────────────────────────
  const [ambitos, setAmbitos] = useState<AmbitoState[]>([ambitoVacio()]);

  // ── Estado: exportación ───────────────────────────────────────────────────
  const [exportando, setExportando] = useState(false);

  // ── Helpers de mutación de ámbitos ───────────────────────────────────────
  const updateAmbito = useCallback(
    (ambitoId: string, patch: Partial<AmbitoState>) =>
      setAmbitos(prev =>
        prev.map(a => (a.id === ambitoId ? { ...a, ...patch } : a))
      ),
    []
  );

  const updateClase = useCallback(
    (ambitoId: string, claseId: string, patch: Partial<ClaseState>) =>
      setAmbitos(prev =>
        prev.map(a =>
          a.id !== ambitoId
            ? a
            : { ...a, clases: a.clases.map(c => (c.id === claseId ? { ...c, ...patch } : c)) }
        )
      ),
    []
  );

  // ── Generación IA de una clase ────────────────────────────────────────────
  const handleGenerarClase = useCallback(
    async (ambitoId: string, claseId: string) => {
      const amb = ambitos.find(a => a.id === ambitoId);
      const cls = amb?.clases.find(c => c.id === claseId);
      if (!amb || !cls) return;

      if (!cls.tema.trim()) {
        if (Platform.OS === "web") alert("Escribe el tema de la clase primero.");
        else Alert.alert("", "Escribe el tema de la clase primero.");
        return;
      }

      if (!amb.competenciaCodigo) {
        if (Platform.OS === "web") alert("Selecciona una competencia/destreza en el ámbito.");
        else Alert.alert("", "Selecciona una competencia/destreza en el ámbito.");
        return;
      }

      updateClase(ambitoId, claseId, { generando: true });

      try {
        const res = await generateClaseMutation.mutateAsync({
          grado,
          ambito: AMBITOS_INI[amb.ambitoKey],
          competenciaCodigo: amb.competenciaCodigo,
          competenciaDescripcion: amb.competenciaDescripcion,
          destrezas: amb.destrezas.length > 0 ? amb.destrezas : [amb.competenciaDescripcion],
          ejesTransversales: amb.ejesTransversales,
          tema: cls.tema.trim(),
          metodologia: cls.metodologia,
          numeroClase: cls.numero,
        });

        updateClase(ambitoId, claseId, {
          generando: false,
          generado: true,
          objetivoEspecifico: res.objetivoEspecifico,
          inicioText: res.inicio.map(a => `• ${a}`).join("\n"),
          desarrolloText: res.desarrollo.map(a => `• ${a}`).join("\n"),
          cierreText: res.cierre.map(a => `• ${a}`).join("\n"),
        });
      } catch (err: any) {
        updateClase(ambitoId, claseId, { generando: false });
        const msg = err?.message ?? "Error al conectar con la IA. Intenta de nuevo.";
        if (Platform.OS === "web") alert(msg);
        else Alert.alert("Error IA", msg);
      }
    },
    [ambitos, grado, generateClaseMutation, updateClase]
  );

  // ── Exportar Word ─────────────────────────────────────────────────────────
  const handleExportar = useCallback(async () => {
    if (!docente.trim()) {
      const msg = "Ingresa el nombre del docente antes de exportar.";
      if (Platform.OS === "web") alert(msg);
      else Alert.alert("", msg);
      return;
    }

    const ambitosData: AmbitoInicial[] = ambitos.map(a => ({
      ambito: AMBITOS_INI[a.ambitoKey],
      competenciaCodigo: a.competenciaCodigo || "—",
      competenciaDescripcion: a.competenciaDescripcion || "—",
      destrezas: a.destrezas.length > 0 ? a.destrezas : ["—"],
      ejesTransversales: a.ejesTransversales,
      clases: a.clases.map(c => ({
        numero: c.numero,
        tema: c.tema || "—",
        objetivoEspecifico: c.objetivoEspecifico || "—",
        metodologia: c.metodologia,
        inicio: lineasAArray(c.inicioText),
        desarrollo: lineasAArray(c.desarrolloText),
        cierre: lineasAArray(c.cierreText),
        metodoEvaluacion: c.metodoEvaluacion,
      } satisfies ClaseInicial)),
    }));

    const plan: PlanificacionInicialSemanal = {
      id: uid(),
      institucion: institucion.trim() || "—",
      docente: docente.trim(),
      grado,
      duracion: duracion.trim() || "—",
      objetivoGeneral: OBJETIVO_GRAL[grado] ?? "",
      ambitos: ambitosData,
      observaciones: observaciones.trim() || undefined,
      bibliografia: bibliografia.trim() || undefined,
      elaboradoPor: elaboradoNombre ? { nombre: elaboradoNombre, cargo: "Docente" } : undefined,
      revisadoPor: revisadoNombre ? { nombre: revisadoNombre, cargo: revisadoCargo } : undefined,
      coordinadorPor: coordinadorNombre ? { nombre: coordinadorNombre, cargo: "Coordinadora/o" } : undefined,
      aprobadoPor: aprobadoNombre ? { nombre: aprobadoNombre, cargo: aprobadoCargo } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExportando(true);
    try {
      const blob = await generarWordPlanificacionInicial(plan);
      const filename = `PlanInicial-${grado.includes("1") ? "I1" : "I2"}-${Date.now()}.docx`;

      if (Platform.OS === "web") {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const uri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
        await shareAsync(uri, {
          UTI: ".docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          dialogTitle: `Planificación Inicial — ${grado}`,
        });
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message ?? "No se pudo generar el Word.";
      if (Platform.OS === "web") alert(`Error al exportar: ${msg}`);
      else Alert.alert("Error", msg);
    } finally {
      setExportando(false);
    }
  }, [
    ambitos, docente, grado, institucion, duracion, observaciones, bibliografia,
    elaboradoNombre, revisadoNombre, revisadoCargo, coordinadorNombre, aprobadoNombre, aprobadoCargo,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1">
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.headerRow}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, flexDirection: "row", alignItems: "center" })}>
            <Text style={{ fontSize: 18 }}>{"←"}</Text>
            <Text style={[s.backText, { color: colors.primary }]}> Atrás</Text>
          </Pressable>
        </View>

        <View style={s.titleBox}>
          <Text style={s.titleEmoji}>🧒</Text>
          <View>
            <Text style={[s.titleText, { color: colors.foreground }]}>Planificación Inicial</Text>
            <Text style={[s.titleSub, { color: colors.muted }]}>Semanal por Experiencia de Aprendizaje</Text>
          </View>
        </View>

        {/* ── 1. Datos básicos ── */}
        <SectionHeader title="Datos de la semana" emoji="📋" />

        {/* Grado */}
        <View style={s.px}>
          <Label text="Grado" />
          <View style={s.chipRow}>
            {GRADOS.map(g => (
              <Chip key={g} label={g} selected={grado === g} onPress={() => setGrado(g)} color="#0EA5E9" />
            ))}
          </View>
        </View>

        <FieldInput label="Institución" value={institucion} onChange={setInstitucion} placeholder="Unidad Educativa..." colors={colors} />
        <FieldInput label="Docente" value={docente} onChange={setDocente} placeholder="Lcda. / Lic." colors={colors} />
        <FieldInput
          label="Semana (rango de fechas)"
          value={duracion}
          onChange={setDuracion}
          placeholder="del 19 al 23 de mayo del 2025"
          colors={colors}
        />
        <FieldInput label="Observaciones" value={observaciones} onChange={setObservaciones} placeholder="Feriados, eventos..." multiline colors={colors} />
        <FieldInput label="Bibliografía" value={bibliografia} onChange={setBibliografia} placeholder="MinEduc..." multiline colors={colors} />

        {/* ── 2. Ámbitos ── */}
        <SectionHeader title="Ámbitos de la semana" emoji="📚" />

        {ambitos.map((amb, ambitoIdx) => (
          <AmbitoCard
            key={amb.id}
            amb={amb}
            ambitoIdx={ambitoIdx}
            colors={colors}
            grado={grado}
            onUpdate={patch => updateAmbito(amb.id, patch)}
            onUpdateClase={(claseId, patch) => updateClase(amb.id, claseId, patch)}
            onGenerarClase={claseId => handleGenerarClase(amb.id, claseId)}
            onAddClase={() =>
              updateAmbito(amb.id, {
                clases: [...amb.clases, claseVacia(amb.clases.length + 1)],
              })
            }
            onRemoveClase={claseId =>
              updateAmbito(amb.id, {
                clases: amb.clases.filter(c => c.id !== claseId),
              })
            }
            onRemove={() => setAmbitos(prev => prev.filter(a => a.id !== amb.id))}
          />
        ))}

        <View style={s.px}>
          <Pressable
            onPress={() => setAmbitos(prev => [...prev, ambitoVacio()])}
            style={({ pressed }) => [s.addBtn, { borderColor: "#0EA5E9", opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[s.addBtnText, { color: "#0EA5E9" }]}>+ Agregar ámbito</Text>
          </Pressable>
        </View>

        {/* ── 3. Firmantes ── */}
        <SectionHeader title="Firmantes" emoji="✍️" />

        <FieldInput label="Elaborado por (nombre docente)" value={elaboradoNombre} onChange={setElaboradoNombre} placeholder="Lcda. Nombre Apellido" colors={colors} />
        <View style={[s.px, { flexDirection: "row", gap: 8 }]}>
          <View style={{ flex: 2 }}>
            <FieldInput label="Revisado por (nombre)" value={revisadoNombre} onChange={setRevisadoNombre} placeholder="Nombre" colors={colors} noPad />
          </View>
          <View style={{ flex: 1 }}>
            <FieldInput label="Cargo" value={revisadoCargo} onChange={setRevisadoCargo} placeholder="DECE" colors={colors} noPad />
          </View>
        </View>
        <FieldInput label="Coordinadora/o (nombre)" value={coordinadorNombre} onChange={setCoordinadorNombre} placeholder="Nombre" colors={colors} />
        <View style={[s.px, { flexDirection: "row", gap: 8 }]}>
          <View style={{ flex: 2 }}>
            <FieldInput label="Aprobado por (nombre)" value={aprobadoNombre} onChange={setAprobadoNombre} placeholder="Nombre" colors={colors} noPad />
          </View>
          <View style={{ flex: 1 }}>
            <FieldInput label="Cargo" value={aprobadoCargo} onChange={setAprobadoCargo} placeholder="Vicerrector/a" colors={colors} noPad />
          </View>
        </View>

        {/* ── 4. Exportar ── */}
        <View style={[s.px, { marginTop: 32 }]}>
          <Pressable
            onPress={handleExportar}
            disabled={exportando}
            style={({ pressed }) => [
              s.exportBtn,
              { backgroundColor: exportando ? colors.muted : "#1A6BAE", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            {exportando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.exportBtnText}>📄 Generar Word (.docx)</Text>
            )}
          </Pressable>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ── Componente AmbitoCard ─────────────────────────────────────────────────────
function AmbitoCard({
  amb,
  ambitoIdx,
  colors,
  grado,
  onUpdate,
  onUpdateClase,
  onGenerarClase,
  onAddClase,
  onRemoveClase,
  onRemove,
}: {
  amb: AmbitoState;
  ambitoIdx: number;
  colors: any;
  grado: string;
  onUpdate: (patch: Partial<AmbitoState>) => void;
  onUpdateClase: (claseId: string, patch: Partial<ClaseState>) => void;
  onGenerarClase: (claseId: string) => void;
  onAddClase: () => void;
  onRemoveClase: (claseId: string) => void;
  onRemove: () => void;
}) {
  // Destrezas filtradas por ámbito y subnivel
  const subnivel = grado.includes("1") ? -1 : 0;
  const destrezasFiltradas = destrezasInicial.filter(
    d => d.bloque === amb.ambitoKey && d.subnivel === subnivel
  );

  return (
    <View style={[s.ambitoCard, { backgroundColor: colors.surface, borderColor: "#0EA5E9" + "40" }]}>
      {/* Cabecera del ámbito */}
      <Pressable
        onPress={() => onUpdate({ expandido: !amb.expandido })}
        style={s.ambitoHeader}
      >
        <View style={s.ambitoHeaderLeft}>
          <View style={[s.ambitoNum, { backgroundColor: "#0EA5E9" }]}>
            <Text style={s.ambitoNumText}>{ambitoIdx + 1}</Text>
          </View>
          <Text style={[s.ambitoNombre, { color: colors.foreground }]} numberOfLines={2}>
            {AMBITOS_INI[amb.ambitoKey]}
          </Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: 18 }}>{amb.expandido ? "▲" : "▼"}</Text>
      </Pressable>

      {amb.expandido && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>

          {/* Selector de ámbito */}
          <Label text="Ámbito de desarrollo" />
          <View style={s.chipRow}>
            {AMBITO_KEYS.map(k => (
              <Chip
                key={k}
                label={`${k}. ${(AMBITOS_INI[k] ?? "").split(" ").slice(0, 2).join(" ")}`}
                selected={amb.ambitoKey === k}
                onPress={() => onUpdate({ ambitoKey: k, competenciaCodigo: "", competenciaDescripcion: "", destrezas: [] })}
                color="#0EA5E9"
              />
            ))}
          </View>

          {/* Selector de competencia/destreza */}
          <Label text="Competencia / Destreza" />
          {destrezasFiltradas.length === 0 ? (
            <Text style={[s.hint, { color: colors.muted }]}>No hay destrezas registradas para este ámbito.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: "row", gap: 6, paddingVertical: 4 }}>
                {destrezasFiltradas.map(d => (
                  <Pressable
                    key={d.codigo}
                    onPress={() =>
                      onUpdate({
                        competenciaCodigo: d.codigo,
                        competenciaDescripcion: d.descripcion,
                        destrezas: [d.descripcion],
                      })
                    }
                    style={({ pressed }) => [
                      s.destrezaChip,
                      {
                        backgroundColor: amb.competenciaCodigo === d.codigo ? "#0EA5E9" : colors.background,
                        borderColor: amb.competenciaCodigo === d.codigo ? "#0EA5E9" : colors.border,
                        opacity: pressed ? 0.75 : 1,
                        maxWidth: 220,
                      },
                    ]}
                  >
                    <Text style={[s.destrezaCode, { color: amb.competenciaCodigo === d.codigo ? "#fff" : "#0EA5E9" }]}>
                      {d.codigo}
                    </Text>
                    <Text
                      style={[s.destrezaDesc, { color: amb.competenciaCodigo === d.codigo ? "#fff" : colors.foreground }]}
                      numberOfLines={3}
                    >
                      {d.descripcion}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Competencia seleccionada (editable) */}
          {amb.competenciaCodigo !== "" && (
            <View style={[s.selectedBox, { backgroundColor: "#0EA5E910", borderColor: "#0EA5E940" }]}>
              <Text style={{ color: "#0EA5E9", fontWeight: "700", fontSize: 13 }}>{amb.competenciaCodigo}</Text>
              <Text style={{ color: colors.foreground, fontSize: 12, marginTop: 2 }}>{amb.competenciaDescripcion}</Text>
            </View>
          )}

          {/* Ejes transversales */}
          <Label text="Ejes transversales" />
          <View style={s.chipRow}>
            {EJES.map(eje => (
              <Chip
                key={eje}
                label={eje}
                selected={amb.ejesTransversales.includes(eje)}
                onPress={() => {
                  const tiene = amb.ejesTransversales.includes(eje);
                  onUpdate({
                    ejesTransversales: tiene
                      ? amb.ejesTransversales.filter(e => e !== eje)
                      : [...amb.ejesTransversales, eje],
                  });
                }}
                color="#64748B"
              />
            ))}
          </View>

          {/* Clases */}
          <View style={s.clasesHeader}>
            <Text style={[s.clasesTitle, { color: colors.foreground }]}>Clases de este ámbito</Text>
          </View>

          {amb.clases.map((cls, ci) => (
            <ClaseCard
              key={cls.id}
              cls={cls}
              claseIdx={ci}
              colors={colors}
              onUpdate={patch => onUpdateClase(cls.id, patch)}
              onGenerar={() => onGenerarClase(cls.id)}
              onRemove={amb.clases.length > 1 ? () => onRemoveClase(cls.id) : undefined}
            />
          ))}

          <Pressable
            onPress={onAddClase}
            style={({ pressed }) => [s.addClaseBtn, { borderColor: "#0EA5E9", opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[s.addClaseBtnText, { color: "#0EA5E9" }]}>+ Agregar clase</Text>
          </Pressable>

          {/* Eliminar ámbito */}
          <Pressable onPress={onRemove} style={s.removeAmbitoBtn}>
            <Text style={s.removeAmbito}>Eliminar este ámbito</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ── Componente ClaseCard ──────────────────────────────────────────────────────
function ClaseCard({
  cls,
  claseIdx,
  colors,
  onUpdate,
  onGenerar,
  onRemove,
}: {
  cls: ClaseState;
  claseIdx: number;
  colors: any;
  onUpdate: (patch: Partial<ClaseState>) => void;
  onGenerar: () => void;
  onRemove?: () => void;
}) {
  return (
    <View style={[s.claseCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* Cabecera clase */}
      <View style={s.claseHeader}>
        {onRemove && (
          <Pressable onPress={onRemove} style={{ marginLeft: "auto" }}>
            <Text style={s.removeClase}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Tema */}
      <Label text="Tema de la clase" />
      <TextInput
        value={cls.tema}
        onChangeText={t => onUpdate({ tema: t })}
        placeholder='ej: "Color rojo", "Conductas positivas"'
        placeholderTextColor={colors.muted}
        style={[s.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
      />

      {/* Metodología */}
      <Label text="Metodología" />
      <View style={s.chipRow}>
        {METODOLOGIAS.map(m => (
          <Chip key={m} label={m} selected={cls.metodologia === m} onPress={() => onUpdate({ metodologia: m })} color="#0EA5E9" />
        ))}
      </View>

      {/* Botón IA */}
      <Pressable
        onPress={onGenerar}
        disabled={cls.generando}
        style={({ pressed }) => [
          s.iaBtn,
          { backgroundColor: cls.generando ? colors.muted : "#1A6BAE", opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {cls.generando ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={s.iaBtnText}>Generando con IA...</Text>
          </View>
        ) : (
          <Text style={s.iaBtnText}>{cls.generado ? "✨ Regenerar con IA" : "✨ Generar con IA"}</Text>
        )}
      </Pressable>

      {/* Campos generados (siempre visibles para edición manual) */}
      {(cls.generado || cls.objetivoEspecifico) && (
        <>
          <View style={[s.generadoBanner, { backgroundColor: "#0EA5E910" }]}>
            <Text style={{ color: "#0EA5E9", fontSize: 12, fontWeight: "600" }}>
              ✓ Generado con IA — puedes editar antes de exportar
            </Text>
          </View>

          <Label text="Objetivo específico" />
          <TextInput
            value={cls.objetivoEspecifico}
            onChangeText={t => onUpdate({ objetivoEspecifico: t })}
            multiline
            textAlignVertical="top"
            style={[s.input, s.inputMulti, { backgroundColor: colors.surface, borderColor: "#0EA5E950", color: colors.foreground }]}
          />
        </>
      )}

      <EtapaField
        label="INICIO"
        color="#154360"
        value={cls.inicioText}
        onChange={t => onUpdate({ inicioText: t })}
        colors={colors}
        placeholder={"• Saludo y bienvenida\n• Observar el clima y ubicar la fecha\n• Registrar asistencia..."}
      />
      <EtapaField
        label="DESARROLLO"
        color="#145A32"
        value={cls.desarrolloText}
        onChange={t => onUpdate({ desarrolloText: t })}
        colors={colors}
        placeholder={"• Actividad de exploración\n• Preguntas abiertas..."}
      />
      <EtapaField
        label="CIERRE"
        color="#784212"
        value={cls.cierreText}
        onChange={t => onUpdate({ cierreText: t })}
        colors={colors}
        placeholder={"• Actividad en cuadernillo\n• Retroalimentación\n• Despedida"}
      />

      {/* Método evaluación */}
      <Label text="Método de evaluación" />
      <View style={s.chipRow}>
        {METODOS_EVAL.map(m => (
          <Chip
            key={m}
            label={m}
            selected={cls.metodoEvaluacion.includes(m)}
            onPress={() => {
              const tiene = cls.metodoEvaluacion.includes(m);
              onUpdate({
                metodoEvaluacion: tiene
                  ? cls.metodoEvaluacion.filter(x => x !== m)
                  : [...cls.metodoEvaluacion, m],
              });
            }}
            color="#64748B"
          />
        ))}
      </View>
    </View>
  );
}

// ── EtapaField ────────────────────────────────────────────────────────────────
function EtapaField({
  label, color, value, onChange, colors, placeholder,
}: {
  label: string; color: string; value: string; onChange: (t: string) => void;
  colors: any; placeholder?: string;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[s.etapaLabel, { color }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[
          s.input,
          s.inputMulti,
          { backgroundColor: colors.surface, borderColor: color + "40", color: colors.foreground },
        ]}
      />
    </View>
  );
}

// ── FieldInput ────────────────────────────────────────────────────────────────
function FieldInput({
  label, value, onChange, placeholder, multiline, colors, noPad,
}: {
  label: string; value: string; onChange: (t: string) => void; placeholder?: string;
  multiline?: boolean; colors: any; noPad?: boolean;
}) {
  return (
    <View style={noPad ? undefined : s.px}>
      <Label text={label} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[
          s.input,
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground },
          multiline && s.inputMulti,
        ]}
      />
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  px: { paddingHorizontal: 16, marginTop: 10 },
  headerRow: { paddingHorizontal: 16, paddingTop: 16 },
  backText: { fontSize: 16 },
  titleBox: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 10, gap: 12 },
  titleEmoji: { fontSize: 36 },
  titleText: { fontSize: 20, fontWeight: "800" },
  titleSub: { fontSize: 12, marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 24, marginBottom: 4, gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1E293B" },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 44 },
  inputMulti: { minHeight: 90, lineHeight: 20 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "500" },
  // Ámbito card
  ambitoCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1.5, overflow: "hidden" },
  ambitoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  ambitoHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  ambitoNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  ambitoNumText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  ambitoNombre: { fontSize: 14, fontWeight: "600", flex: 1 },
  // Destreza chips
  destrezaChip: { borderRadius: 10, borderWidth: 1, padding: 8, minWidth: 140 },
  destrezaCode: { fontSize: 11, fontWeight: "800", marginBottom: 2 },
  destrezaDesc: { fontSize: 11, lineHeight: 15 },
  selectedBox: { borderRadius: 8, borderWidth: 1, padding: 8, marginTop: 4 },
  // Clases
  clasesHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14, marginBottom: 6 },
  clasesTitle: { fontSize: 14, fontWeight: "700" },
  claseCard: { borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 8 },
  claseHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  claseNum: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  claseNumText: { fontSize: 13, fontWeight: "700" },
  removeClase: { color: "#EF4444", fontSize: 16, paddingHorizontal: 6 },
  iaBtn: { marginTop: 10, borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  iaBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  generadoBanner: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8 },
  etapaLabel: { fontSize: 13, fontWeight: "800", marginBottom: 4 },
  addClaseBtn: { borderWidth: 1.5, borderStyle: "dashed", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 10 },
  addClaseBtnText: { fontWeight: "600", fontSize: 14 },
  removeAmbitoBtn: { alignItems: "center", marginTop: 12 },
  removeAmbito: { color: "#EF4444", fontSize: 13 },
  // Botón añadir ámbito
  addBtn: { borderWidth: 2, borderStyle: "dashed", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 12 },
  addBtnText: { fontSize: 15, fontWeight: "700" },
  // Exportar
  exportBtn: { borderRadius: 14, paddingVertical: 18, alignItems: "center" },
  exportBtnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  hint: { fontSize: 12, fontStyle: "italic", marginBottom: 6 },
});
