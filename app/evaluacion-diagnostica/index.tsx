/**
 * Creación de Evaluación Diagnóstica — form multi-paso (patrón CNC):
 *  0 Contexto → 1 Selección de DCD → 2 Banco de preguntas (manual + IA)
 *  → 3 Matriz → 4 Revisar / Guardar / Publicar.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { DcdMultiSelector } from "@/components/DcdMultiSelector";
import {
  AREAS_INFO,
  SUBNIVEL_NAMES,
  filtrarPorAreaYSubnivel,
  buscarPorCodigo,
  obtenerNombreSubnivel,
  Area,
} from "@/data";
import type { Destreza } from "@/data/types";
import { resolverPrerrequisitoPorGrado } from "@/lib/curriculo-prerrequisitos";
import {
  TIPO_PREGUNTA_INFO,
  DIFICULTAD_INFO,
  EvaluacionDiagnostica,
  PreguntaDiagnostica,
  OpcionPregunta,
  DificultadPregunta,
  TipoPreguntaDiagnostica,
  EstatusEvaluacion,
} from "@/data/types-evaluacion";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import { UMBRALES_DEFECTO, subnivelDesdeGrado, subnivelDelGradoAnterior, esBachilleratoTecnico } from "@/lib/evaluacion-utils";
import { trpc } from "@/lib/trpc";

const hoy = new Date();
const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

function nuevoId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const STEP_LABELS = ["Contexto", "DCD", "Preguntas", "Matriz", "Revisar"];

function StepBar({ current, colors }: { current: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 }}>
      {STEP_LABELS.map((label, i) => (
        <View key={label} style={{ flex: 1, flexDirection: "column", alignItems: "center", gap: 2 }}>
          <View
            style={{
              height: 4,
              width: "100%",
              borderRadius: 2,
              backgroundColor: i <= current ? colors.primary : colors.border,
            }}
          />
          <Text style={{ fontSize: 9, color: i === current ? colors.primary : colors.muted }}>
            {label}
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
  label, value, onChangeText, colors, multiline = false, placeholder = "", keyboardType,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  colors: any; multiline?: boolean; placeholder?: string; keyboardType?: any;
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
        keyboardType={keyboardType}
        style={[styles.input, {
          borderColor: colors.border, color: colors.text, backgroundColor: colors.surface,
          minHeight: multiline ? 72 : 40, textAlignVertical: multiline ? "top" : "center",
        }]}
      />
    </View>
  );
}

function ChipGroup<T extends string | number>({
  options, selected, onSelect, colors, getLabel,
}: {
  options: T[]; selected: T; onSelect: (v: T) => void; colors: any; getLabel?: (v: T) => string;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {options.map((opt) => (
        <Pressable
          key={String(opt)}
          onPress={() => onSelect(opt)}
          style={{
            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
            backgroundColor: selected === opt ? colors.primary : colors.surface,
            borderWidth: 1, borderColor: selected === opt ? colors.primary : colors.border,
          }}
        >
          <Text style={{ fontSize: 12, color: selected === opt ? "#fff" : colors.text }}>
            {getLabel ? getLabel(opt) : String(opt)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const AREAS = Object.keys(AREAS_INFO) as Area[];
// CAI ("Cívica — Acompañamiento Integral") es un período pedagógico
// transversal, no una materia independiente para la que un docente cree una
// evaluación diagnóstica propia (a diferencia de EG "Emprendimiento y
// Gestión", que sí es una materia real de Bachillerato con sus propios
// bloques). Decisión de producto, no un mandato curricular: el ministerio no
// restringe la evaluación diagnóstica general por materia — el instructivo
// oficial "Herramientas para la evaluación diagnóstica" (2026-2027) incluso
// ejemplifica con Ciencias Naturales.
const AREAS_DIAGNOSTICO = AREAS.filter((a) => a !== "CAI");
// "Conecta, Nivela y Crea" está oficialmente restringido a las asignaturas
// fundacionales (Lengua y Literatura, Matemática) — verificado en
// "Lineamientos pedagógicos. Costa-Galápagos; 2026-2027", sección 2.1
// (educacion.gob.ec). Cuando la evaluación se crea desde el wizard CNC, el
// área debe quedar acotada a lo que esa fase realmente evalúa; fuera de ese
// flujo, el módulo sigue siendo de propósito general (ver AREAS_DIAGNOSTICO).
const AREAS_CNC: Area[] = ["LL", "M"];

const TIPOS_PREGUNTA = Object.keys(TIPO_PREGUNTA_INFO) as TipoPreguntaDiagnostica[];
const DIFICULTADES = Object.keys(DIFICULTAD_INFO) as DificultadPregunta[];

export default function EvaluacionDiagnosticaScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; anioLectivo?: string; grado?: string; paralelo?: string; dcds?: string }>();
  const desdeCNC = params.from === "cnc";
  const dcdsDeWizard = useMemo(
    () => String(params.dcds ?? "").split(",").map((c) => c.trim()).filter(Boolean),
    [params.dcds]
  );
  const { addEvaluacion, bancoPreguntas, addPreguntaBanco } = useEvaluaciones();
  const sugerirMutation = trpc.evaluacion.sugerirPreguntas.useMutation();
  const sugerirNombreMutation = trpc.evaluacion.sugerirNombre.useMutation();
  const backupMutation = trpc.evaluacion.guardarBackup.useMutation();

  const [step, setStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Contexto ──
  const [nombre, setNombre] = useState("");
  const [anioLectivo, setAnioLectivo] = useState(String(params.anioLectivo ?? "2026-2027"));
  const [area, setArea] = useState<Area | null>(null);
  const [grado, setGrado] = useState(String(params.grado ?? ""));
  const [paralelo, setParalelo] = useState(String(params.paralelo ?? ""));
  const subnivel = subnivelDesdeGrado(grado);
  const [asignatura, setAsignatura] = useState("");
  const [fecha, setFecha] = useState(fechaHoy);
  const [duracion, setDuracion] = useState("30");
  const [instrucciones, setInstrucciones] = useState("");
  const [puntajeTotal, setPuntajeTotal] = useState("10");
  const [dominadoMin, setDominadoMin] = useState(String(UMBRALES_DEFECTO.dominadoMin));
  const [refuerzoMax, setRefuerzoMax] = useState(String(UMBRALES_DEFECTO.refuerzoMax));

  // ── DCD seleccionadas (DcdSeleccionada[] = codigo + enunciado) ──
  const [seleccion, setSeleccion] = useState<{ codigo: string; enunciado: string }[]>([]);
  const [dcdsAuto, setDcdsAuto] = useState(0);

  // ── Preguntas de la evaluación ──
  const [preguntas, setPreguntas] = useState<PreguntaDiagnostica[]>([]);

  // ── IA: sugerencias en revisión ──
  const [sugerencias, setSugerencias] = useState<PreguntaDiagnostica[]>([]);
  const [aceptadas, setAceptadas] = useState<Set<string>>(new Set());
  const [iaError, setIaError] = useState<string | null>(null);

  // ── Form manual ──
  const [qEnunciado, setQEnunciado] = useState("");
  const [qTipo, setQTipo] = useState<TipoPreguntaDiagnostica>("opcion_multiple");
  const [qDificultad, setQDificultad] = useState<DificultadPregunta>("basica");
  const [qPuntaje, setQPuntaje] = useState("1");
  const [qDcd, setQDcd] = useState<string>("");
  const [qOpciones, setQOpciones] = useState<string[]>(["", "", "", ""]);
  const [qCorrecta, setQCorrecta] = useState(0);
  const [qRespuesta, setQRespuesta] = useState("");
  const [qRetro, setQRetro] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  // ── Subnivel a diagnosticar ──
  // Un diagnóstico mide aprendizajes previos, así que por defecto se ofrecen
  // las DCD del subnivel prerrequisito (del grado anterior); el subnivel del
  // curso queda disponible para que el docente lo agregue (imprescindible en
  // grados que comparten subnivel con su anterior, como 5.° y 6.° EGB). Ver
  // design.md D10.
  const prerrequisito = useMemo(
    () => (area && grado.trim() ? resolverPrerrequisitoPorGrado(area, grado) : null),
    [area, grado]
  );
  // null porque el grado anterior comparte subnivel con el curso (no es "área
  // sin predecesor"): el diagnóstico se apoya en el subnivel del curso.
  const gradoAnteriorEnMismoSubnivel =
    prerrequisito === null &&
    subnivel !== null &&
    subnivelDelGradoAnterior(grado) === subnivel;
  const [incluirPrerrequisito, setIncluirPrerrequisito] = useState(true);
  const [incluirActual, setIncluirActual] = useState(false);

  // Sin prerrequisito definido solo queda el subnivel del curso (10.5).
  const prerrequisitoActivo = !!prerrequisito && incluirPrerrequisito;
  const actualActivo = !prerrequisito || incluirActual;

  function alternarPrerrequisito() {
    // Nunca dejar los dos grupos apagados: quedaría un selector vacío.
    if (incluirPrerrequisito && !incluirActual) setIncluirActual(true);
    setIncluirPrerrequisito((v) => !v);
  }

  function alternarActual() {
    if (!prerrequisito) return; // único grupo disponible
    if (incluirActual && !incluirPrerrequisito) setIncluirPrerrequisito(true);
    setIncluirActual((v) => !v);
  }

  const destrezasPorContexto = useMemo(() => {
    if (!area || subnivel === null) return [];
    const lista: Destreza[] = [];
    if (prerrequisito && prerrequisitoActivo) {
      lista.push(
        ...filtrarPorAreaYSubnivel(prerrequisito.area, prerrequisito.subnivel)
      );
    }
    if (actualActivo) lista.push(...filtrarPorAreaYSubnivel(area, subnivel));
    return lista;
  }, [area, subnivel, prerrequisito, prerrequisitoActivo, actualActivo]);

  function preseleccionarDcdsDeWizard(v: Area) {
    if (seleccion.length > 0 || subnivel === null || dcdsDeWizard.length === 0) return;
    // Mismo resolvedor que la selección manual: un plan CNC puede referenciar
    // DCD de arrastre, y filtrarlas por el subnivel del curso las descartaría
    // en silencio. Se calcula desde `v` porque el estado `area` aún no se
    // actualizó cuando esta función corre. Ver design.md D10.
    const prerreqDeWizard = resolverPrerrequisitoPorGrado(v, grado);
    const admisibles = dcdsDeWizard
      .map((codigo) => buscarPorCodigo(codigo))
      .filter((d): d is NonNullable<typeof d> => {
        if (!d) return false;
        if (d.area === v && d.subnivel === subnivel) return true;
        return (
          !!prerreqDeWizard &&
          d.area === prerreqDeWizard.area &&
          d.subnivel === prerreqDeWizard.subnivel
        );
      });
    if (!admisibles.length) return;

    // Activar los grupos que aportaron DCD, para que las preseleccionadas sean
    // visibles en el selector y no queden como chips sin fila correspondiente.
    if (admisibles.some((d) => d.subnivel === subnivel && d.area === v)) {
      setIncluirActual(true);
    }
    if (
      prerreqDeWizard &&
      admisibles.some(
        (d) => d.area === prerreqDeWizard.area && d.subnivel === prerreqDeWizard.subnivel
      )
    ) {
      setIncluirPrerrequisito(true);
    }

    const pre = admisibles.map((d) => ({ codigo: d.codigo, enunciado: d.descripcion }));
    setSeleccion(pre);
    setDcdsAuto(pre.length);
  }

  // Auto-selección de área al venir desde el wizard CNC: las DCD del paso anterior
  // determinan el área (LL o M — la de mayor presencia); el docente puede ajustarla.
  useEffect(() => {
    if (!desdeCNC || dcdsDeWizard.length === 0) return;
    const conteoPorArea: Partial<Record<Area, number>> = {};
    for (const codigo of dcdsDeWizard) {
      const dest = buscarPorCodigo(codigo);
      if (dest?.area) conteoPorArea[dest.area] = (conteoPorArea[dest.area] ?? 0) + 1;
    }
    const conArea = AREAS_CNC.filter((a) => (conteoPorArea[a] ?? 0) > 0);
    if (conArea.length === 0) return;
    conArea.sort((a, b) => (conteoPorArea[b] ?? 0) - (conteoPorArea[a] ?? 0));
    const ganadora = conArea[0];
    setArea(ganadora);
    setAsignatura(AREAS_INFO[ganadora].name);
    if (!nombre.trim()) setNombre(`Diagnóstico inicial de ${AREAS_INFO[ganadora].name}`);
    preseleccionarDcdsDeWizard(ganadora);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dcdsEvaluadas = useMemo(
    () =>
      seleccion.map((s) => {
        const dest = buscarPorCodigo(s.codigo);
        return {
          codigo: s.codigo,
          descripcion: s.enunciado,
          indicadores: dest?.indicadoresEvaluacion ?? [],
        };
      }),
    [seleccion]
  );

  const preguntasDeBanco = useMemo(() => {
    const codigos = new Set(seleccion.map((s) => s.codigo));
    return bancoPreguntas.filter((p) => codigos.has(p.dcdCodigo));
  }, [bancoPreguntas, seleccion]);

  function scrollTop() {}

  function nextStep() { setStep((s) => s + 1); scrollTop(); }
  function prevStep() { setStep((s) => s - 1); scrollTop(); }

  function validateStep(): string | null {
    if (step === 0) {
      if (!nombre.trim()) return "Escribe el nombre de la evaluación.";
      if (!area) return "Selecciona el área.";
      if (subnivel === null) return "Escribe un grado o curso válido (ej: 8.° EGB, 1.° BGU).";
      if (!grado.trim()) return "Escribe el grado o curso.";
      const pt = Number(puntajeTotal);
      if (!pt || pt <= 0) return "Define un puntaje total válido.";
    }
    if (step === 1) {
      if (!seleccion.length) return "Selecciona al menos una DCD para diagnosticar.";
    }
    if (step === 2) {
      if (!preguntas.length) return "Agrega al menos una pregunta a la evaluación.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    nextStep();
  }

  // ── Preguntas manuales ──
  function agregarPreguntaManual() {
    if (!qEnunciado.trim()) { setValidationError("Escribe el enunciado de la pregunta."); return; }
    if (!qDcd) { setValidationError("Asocia la pregunta a una DCD."); return; }
    if (qTipo === "opcion_multiple" && qOpciones.filter((o) => o.trim()).length < 2) {
      setValidationError("Agrega al menos 2 opciones.");
      return;
    }
    if (qTipo === "v_f") {
      setValidationError(null);
      const correcta: boolean = qCorrecta === 0;
      const nueva: PreguntaDiagnostica = {
        id: nuevoId(), enunciado: qEnunciado.trim(), tipo: qTipo, dificultad: qDificultad,
        puntaje: Number(qPuntaje) || 1, dcdCodigo: qDcd,
        opciones: [
          { id: "v", texto: "Verdadero", esCorrecta: correcta },
          { id: "f", texto: "Falso", esCorrecta: !correcta },
        ],
        retroalimentacion: qRetro.trim() || undefined, activa: true,
      };
      setPreguntas((prev) => [...prev, nueva]);
      addPreguntaBanco(nueva);
      limpiarFormManual();
      return;
    }
    if (qTipo === "opcion_multiple") {
      const opciones: OpcionPregunta[] = qOpciones
        .filter((o) => o.trim())
        .map((o, i) => ({ id: "op" + i, texto: o.trim(), esCorrecta: i === qCorrecta }));
      const nueva: PreguntaDiagnostica = {
        id: nuevoId(), enunciado: qEnunciado.trim(), tipo: qTipo, dificultad: qDificultad,
        puntaje: Number(qPuntaje) || 1, dcdCodigo: qDcd,
        opciones, retroalimentacion: qRetro.trim() || undefined, activa: true,
      };
      setPreguntas((prev) => [...prev, nueva]);
      addPreguntaBanco(nueva);
      limpiarFormManual();
      return;
    }
    // respuesta_corta / ejercicio
    setValidationError(null);
    const nueva: PreguntaDiagnostica = {
      id: nuevoId(), enunciado: qEnunciado.trim(), tipo: qTipo, dificultad: qDificultad,
      puntaje: Number(qPuntaje) || 1, dcdCodigo: qDcd,
      respuestaCorrecta: qRespuesta.trim() || undefined,
      retroalimentacion: qRetro.trim() || undefined, activa: true,
    };
    setPreguntas((prev) => [...prev, nueva]);
    addPreguntaBanco(nueva);
    limpiarFormManual();
  }

  function limpiarFormManual() {
    setQEnunciado(""); setQRespuesta(""); setQRetro("");
    setQOpciones(["", "", "", ""]); setQCorrecta(0); setQPuntaje("1");
    setShowManualForm(false);
    setValidationError(null);
  }

  function agregarDeBanco(p: PreguntaDiagnostica) {
    if (preguntas.some((q) => q.id === p.id)) return;
    setPreguntas((prev) => [...prev, { ...p, id: nuevoId() }]);
  }

  function quitarPregunta(id: string) {
    setPreguntas((prev) => prev.filter((q) => q.id !== id));
  }

  // ── IA ──
  async function sugerirNombreConIA() {
    if (!area) { setValidationError("Selecciona el área para generar el nombre con IA."); return; }
    setValidationError(null);
    try {
      const res = await sugerirNombreMutation.mutateAsync({
        area: AREAS_INFO[area].name,
        grado,
        paralelo,
        anioLectivo,
      });
      if (res?.nombre) setNombre(res.nombre);
    } catch (e: any) {
      setValidationError(e?.message ?? "No se pudo generar el nombre. Intenta de nuevo.");
    }
  }

  async function sugerirConIA() {
    setIaError(null);
    setSugerencias([]);
    try {
      const res = await sugerirMutation.mutateAsync({
        dcds: dcdsEvaluadas.map((d) => {
          const dest = buscarPorCodigo(d.codigo);
          return {
            codigo: d.codigo,
            descripcion: d.descripcion,
            indicadores: dest?.indicadoresEvaluacion ?? [],
            criterios: dest?.criteriosEvaluacion ?? [],
          };
        }),
      });
      const convertidas: PreguntaDiagnostica[] = res.preguntas.map((s) => ({
        id: nuevoId(),
        enunciado: s.enunciado,
        tipo: s.tipo,
        dificultad: s.dificultad,
        puntaje: s.puntaje,
        dcdCodigo: s.dcdCodigo,
        opciones: s.opciones?.map((o, i) => ({ id: "op" + i, texto: o.texto, esCorrecta: o.esCorrecta })),
        respuestaCorrecta: s.respuestaCorrecta,
        retroalimentacion: s.retroalimentacion,
        activa: true,
      }));
      setSugerencias(convertidas);
      setAceptadas(new Set(convertidas.map((c) => c.id)));
    } catch (e: any) {
      setIaError(e?.message || "No se pudieron generar preguntas. Intenta de nuevo.");
    }
  }

  function incorporarSugerencias() {
    const elegidas = sugerencias.filter((s) => aceptadas.has(s.id));
    setPreguntas((prev) => [...prev, ...elegidas.map((s) => ({ ...s, id: nuevoId() }))]);
    setSugerencias([]);
    setAceptadas(new Set());
    setValidationError(null);
  }

  // ── Matriz editable ──
  function moverPregunta(id: string, nuevoDcd: string) {
    setPreguntas((prev) => prev.map((q) => (q.id === id ? { ...q, dcdCodigo: nuevoDcd } : q)));
  }
  function cambiarPuntaje(id: string, puntaje: number) {
    setPreguntas((prev) => prev.map((q) => (q.id === id ? { ...q, puntaje } : q)));
  }

  const matriz = useMemo(() => {
    return dcdsEvaluadas.map((d) => {
      const preg = preguntas.filter((p) => p.dcdCodigo === d.codigo);
      return {
        dcd: d,
        preguntas: preg,
        puntaje: preg.reduce((s, p) => s + p.puntaje, 0),
      };
    });
  }, [dcdsEvaluadas, preguntas]);

  const sumaPuntajePreguntas = useMemo(
    () => preguntas.reduce((s, p) => s + p.puntaje, 0),
    [preguntas]
  );

  // ── Guardar / Publicar ──
  async function sessionId(): Promise<string> {
    let sid = await AsyncStorage.getItem("@planificadoc_device_id");
    if (!sid) {
      sid = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      await AsyncStorage.setItem("@planificadoc_device_id", sid);
    }
    return sid;
  }

  function construirEvaluacion(status: EstatusEvaluacion): EvaluacionDiagnostica {
    const now = new Date().toISOString();
    return {
      id: nuevoId(),
      nombre: nombre.trim(), anioLectivo, area: area!, subnivel: subnivel!,
      grado: grado.trim(), paralelo: paralelo.trim(), asignatura: asignatura.trim(),
      fecha, duracionMinutos: Number(duracion) || 30, instrucciones: instrucciones.trim(),
      puntajeTotal: Number(puntajeTotal) || 0,
      dcdsEvaluadas,
      preguntas,
      estudiantes: [],
      resultados: [],
      umbrales: { dominadoMin: Number(dominadoMin) || UMBRALES_DEFECTO.dominadoMin, refuerzoMax: Number(refuerzoMax) || UMBRALES_DEFECTO.refuerzoMax },
      status,
      createdAt: now, updatedAt: now,
    };
  }

  async function persistirYGuardarBackup(ev: EvaluacionDiagnostica) {
    await addEvaluacion(ev);
    try {
      const sid = await sessionId();
      await backupMutation.mutateAsync({ sessionId: sid, status: ev.status, form: JSON.stringify(ev) });
    } catch (e) {
      console.warn("[evaluacion] backup failed (non-critical):", e);
    }
  }

  async function handleGuardar() {
    const err = validateStep();
    if (err) { setValidationError(err); return; }
    setSaving(true);
    try {
      const ev = construirEvaluacion("borrador");
      await persistirYGuardarBackup(ev);
      // Al venir del wizard CNC se regresa al wizard (paso Diagnóstico / Resultado)
      // para continuar el flujo de planificación; el detalle con resultados se
      // abre desde el wizard o desde el plan generado.
      if (desdeCNC) router.back();
      else router.replace(`/ver-evaluacion/${ev.id}` as any);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublicar() {
    const err = validateStep();
    if (err) { setValidationError(err); return; }
    if (sumaPuntajePreguntas !== (Number(puntajeTotal) || 0)) {
      setValidationError(`La suma del puntaje de las preguntas (${sumaPuntajePreguntas}) no coincide con el puntaje total (${puntajeTotal}). Revísalo en la matriz.`);
      return;
    }
    setSaving(true);
    try {
      const ev = construirEvaluacion("publicada");
      await persistirYGuardarBackup(ev);
      if (desdeCNC) router.back();
      else router.replace(`/ver-evaluacion/${ev.id}` as any);
    } finally {
      setSaving(false);
    }
  }

  const confirmarNavegar = useCallback(
    (destino: string) => {
      const confirma = () => router.replace(destino as any);
      if (Platform.OS === "web") {
        if (confirm("¿Salir sin guardar?")) confirma();
      } else {
        Alert.alert("Salir", "¿Salir sin guardar?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: confirma },
        ]);
      }
    },
    [router]
  );

  return (
    <ScreenContainer className="flex-1">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Pressable onPress={() => (step === 0 ? confirmarNavegar("/(tabs)/planes") : prevStep())} style={{ padding: 4 }}>
          <Text style={{ fontSize: 22, color: colors.text }}>‹</Text>
        </Pressable>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: colors.foreground }}>
          Evaluación Diagnóstica
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <StepBar current={step} colors={colors} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {validationError && (
          <View style={[styles.errorBox, { backgroundColor: "#DC262610", borderColor: "#DC2626" }]}>
            <Text style={{ color: "#DC2626", fontSize: 13 }}>{validationError}</Text>
          </View>
        )}

        {/* ── Paso 0: Contexto ── */}
        {step === 0 && (
          <View>
            {!desdeCNC && (
              <>
                <Field label="Año lectivo" value={anioLectivo} onChangeText={setAnioLectivo} colors={colors} />
                <Field label="Grado / Curso" value={grado} onChangeText={setGrado} placeholder="Ej. 3ro EGB" colors={colors} />
                <Field label="Paralelo" value={paralelo} onChangeText={setParalelo} placeholder="Ej. A" colors={colors} />
              </>
            )}
            <Label text="Nombre de la evaluación" colors={colors} />
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Diagnóstico inicial de Matemática"
              placeholderTextColor={colors.muted}
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            />
            <Pressable
              onPress={sugerirNombreConIA}
              disabled={sugerirNombreMutation.isPending}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 6 }}
            >
              {sugerirNombreMutation.isPending ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={{ fontSize: 13 }}>✨</Text>
              )}
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
                {sugerirNombreMutation.isPending ? "Generando nombre..." : "Generar nombre con IA"}
              </Text>
            </Pressable>
            <Label text="Área" colors={colors} />
            {desdeCNC && (
              <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>
                Conecta, Nivela y Crea diagnostica únicamente Lengua y Literatura y Matemática.
              </Text>
            )}
            <ChipGroup<Area>
              options={desdeCNC ? AREAS_CNC : AREAS_DIAGNOSTICO}
              selected={area ?? ("" as Area)}
              onSelect={(v) => {
                setArea(v);
                // La asignatura es la materia específica que se diagnostica; el
                // área ya la determina (LL → Lengua y Literatura, M →
                // Matemática...), así que no hace falta pedirla por separado.
                setAsignatura(AREAS_INFO[v].name);
                if (!nombre.trim()) setNombre(`Diagnóstico inicial de ${AREAS_INFO[v].name}`);
                preseleccionarDcdsDeWizard(v);
              }}
              colors={colors}
              getLabel={(a) => `${AREAS_INFO[a].emoji} ${AREAS_INFO[a].name}`}
            />
            <Field label="Fecha" value={fecha} onChangeText={setFecha} placeholder="Ej. 2026-09-01" colors={colors} />
            <Field label="Duración (minutos)" value={duracion} onChangeText={setDuracion} colors={colors} keyboardType="numeric" />
            <Field label="Instrucciones" value={instrucciones} onChangeText={setInstrucciones} multiline placeholder="Instrucciones para los estudiantes" colors={colors} />
            <Field label="Puntaje total" value={puntajeTotal} onChangeText={setPuntajeTotal} colors={colors} keyboardType="numeric" />
            <Label text="Umbrales de clasificación (configurables)" colors={colors} />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Dominado ≥ (%)" value={dominadoMin} onChangeText={setDominadoMin} colors={colors} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Refuerzo < (%)" value={refuerzoMax} onChangeText={setRefuerzoMax} colors={colors} keyboardType="numeric" />
              </View>
            </View>
          </View>
        )}

        {/* ── Paso 1: DCD ── */}
        {step === 1 && (
          <View>
            {dcdsAuto > 0 && (
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#16A34A", marginBottom: 12 }}>
                <Text style={{ fontSize: 12, color: "#166534" }}>
                  ✅ {dcdsAuto} destreza(s) preseleccionada(s) desde tus pasos anteriores (Conecta/Nivela). Puedes ajustarlas aquí.
                </Text>
              </View>
            )}
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
              Selecciona las destrezas (DCD) que deseas diagnosticar. Se usan los indicadores y criterios reales del catálogo curricular.
            </Text>

            {/* Subnivel a diagnosticar: prerrequisito por defecto, actual disponible */}
            {area && subnivel !== null && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground, marginBottom: 6 }}>
                  ¿De qué nivel son los aprendizajes a diagnosticar?
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {prerrequisito && (
                    <Pressable
                      onPress={alternarPrerrequisito}
                      style={[
                        styles.subnivelChip,
                        {
                          borderColor: prerrequisitoActivo ? "#7C3AED" : colors.border,
                          backgroundColor: prerrequisitoActivo ? "#EEEDFE" : colors.surface,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "700", color: prerrequisitoActivo ? "#4C1D95" : colors.text }}>
                        {prerrequisitoActivo ? "✓ " : ""}
                        {AREAS_INFO[prerrequisito.area]?.name ?? prerrequisito.area} ·{" "}
                        {obtenerNombreSubnivel(prerrequisito.subnivel)}
                      </Text>
                      <Text style={{ fontSize: 10, color: colors.muted }}>Prerrequisito (arrastre)</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={alternarActual}
                    style={[
                      styles.subnivelChip,
                      {
                        borderColor: actualActivo ? "#7C3AED" : colors.border,
                        backgroundColor: actualActivo ? "#EEEDFE" : colors.surface,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: actualActivo ? "#4C1D95" : colors.text }}>
                      {actualActivo ? "✓ " : ""}
                      {AREAS_INFO[area]?.name ?? area} · {obtenerNombreSubnivel(subnivel)}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.muted }}>Nivel actual del curso</Text>
                  </Pressable>
                </View>

                {!prerrequisito ? (
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>
                    {gradoAnteriorEnMismoSubnivel
                      ? `ℹ️ El grado anterior (${grado}) pertenece al mismo subnivel que este curso, así que se diagnostican las destrezas del nivel actual.`
                      : `ℹ️ ${AREAS_INFO[area]?.name ?? area} no tiene un nivel prerrequisito definido en el catálogo curricular, así que solo se ofrecen las destrezas del nivel actual. No se proponen áreas sustitutas.`}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>
                    Un diagnóstico mide lo que el estudiante debería traer, por eso viene marcado el
                    nivel prerrequisito. Puedes agregar el nivel actual si también quieres evaluarlo.
                  </Text>
                )}

                {esBachilleratoTecnico(grado) && (
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>
                    🔧 Bachillerato Técnico: se diagnostican las destrezas de formación general del
                    área seleccionada. El diagnóstico técnico por módulos formativos y resultados de
                    aprendizaje todavía no está disponible.
                  </Text>
                )}
              </View>
            )}

            <DcdMultiSelector
              destrezas={destrezasPorContexto}
              value={seleccion}
              onChange={setSeleccion}
              placeholder="Buscar destreza..."
              mostrarSubnivel
            />
          </View>
        )}

        {/* ── Paso 2: Preguntas ── */}
        {step === 2 && (
          <View>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>
              Preguntas de la evaluación ({preguntas.length})
            </Text>

            <Pressable onPress={() => sugerirConIA()} disabled={sugerirMutation.isPending}
              style={({ pressed }) => [styles.iaBtn, { opacity: pressed ? 0.85 : sugerirMutation.isPending ? 0.5 : 1 }]}>
              <Text style={{ fontSize: 18 }}>🤖</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.iaBtnTitle}>
                  {sugerirMutation.isPending ? "Generando sugerencias..." : "Sugerir preguntas con IA"}
                </Text>
                <Text style={styles.iaBtnSub}>Fundadas en los indicadores reales de las DCD seleccionadas</Text>
              </View>
            </Pressable>
            {iaError && <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>{iaError}</Text>}

            {sugerencias.length > 0 && (
              <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
                  Sugerencias de IA — revisa antes de incorporar
                </Text>
                {sugerencias.map((s) => (
                  <View key={s.id} style={{ marginBottom: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Pressable onPress={() => setAceptadas((prev) => { const n = new Set(prev); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); return n; })}
                      style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                      <Text style={{ fontSize: 16 }}>{aceptadas.has(s.id) ? "☑️" : "⬜"}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: colors.text }}>{s.enunciado}</Text>
                        <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                          {TIPO_PREGUNTA_INFO[s.tipo].nombre} · {DIFICULTAD_INFO[s.dificultad].nombre} · {s.dcdCodigo} · {s.puntaje} pt
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                ))}
                <Pressable onPress={incorporarSugerencias} style={[styles.smallBtn, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Incorporar seleccionadas</Text>
                </Pressable>
              </View>
            )}

            {preguntasDeBanco.length > 0 && (
              <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
                  Del banco de preguntas ({preguntasDeBanco.length})
                </Text>
                {preguntasDeBanco.map((p) => (
                  <View key={p.id} style={{ marginBottom: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ fontSize: 13, color: colors.text }}>{p.enunciado}</Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                      {TIPO_PREGUNTA_INFO[p.tipo].nombre} · {p.dcdCodigo} · {p.puntaje} pt
                    </Text>
                    <Pressable onPress={() => agregarDeBanco(p)} style={[styles.smallBtn, { backgroundColor: colors.primary, marginTop: 6 }]}>
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Añadir a la evaluación</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <Pressable onPress={() => setShowManualForm((v) => !v)} style={[styles.smallBtn, { backgroundColor: colors.primary, marginBottom: 12 }]}>
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                {showManualForm ? "Ocultar formulario manual" : "＋ Crear pregunta manualmente"}
              </Text>
            </Pressable>

            {showManualForm && (
              <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Label text="Tipo de pregunta" colors={colors} />
                <ChipGroup<TipoPreguntaDiagnostica> options={TIPOS_PREGUNTA} selected={qTipo} onSelect={setQTipo} colors={colors} getLabel={(t) => `${TIPO_PREGUNTA_INFO[t].emoji} ${TIPO_PREGUNTA_INFO[t].nombre}`} />
                <Field label="Enunciado" value={qEnunciado} onChangeText={setQEnunciado} multiline placeholder="Escribe la pregunta" colors={colors} />
                <Label text="DCD asociada" colors={colors} />
                <ChipGroup<string> options={dcdsEvaluadas.map((d) => d.codigo)} selected={qDcd} onSelect={setQDcd} colors={colors} />
                <Label text="Dificultad" colors={colors} />
                <ChipGroup<DificultadPregunta> options={DIFICULTADES} selected={qDificultad} onSelect={setQDificultad} colors={colors} getLabel={(d) => DIFICULTAD_INFO[d].nombre} />
                <Field label="Puntaje" value={qPuntaje} onChangeText={setQPuntaje} colors={colors} keyboardType="numeric" />

                {(qTipo === "opcion_multiple" || qTipo === "v_f") && (
                  <View>
                    <Label text="Opciones" colors={colors} />
                    {qOpciones.map((op, i) => (
                      <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Pressable onPress={() => setQCorrecta(i)} style={{ padding: 4 }}>
                          <Text style={{ fontSize: 16 }}>{i === qCorrecta ? "⭕" : "⚪"}</Text>
                        </Pressable>
                        <TextInput
                          value={op}
                          onChangeText={(t) => setQOpciones((prev) => prev.map((o, j) => (j === i ? t : o)))}
                          placeholder={i === qCorrecta ? "Opción correcta" : `Opción ${i + 1}`}
                          placeholderTextColor={colors.muted}
                          style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                        />
                      </View>
                    ))}
                    <Text style={{ fontSize: 11, color: colors.muted }}>Marca la opción correcta con ⭕</Text>
                  </View>
                )}

                {(qTipo === "respuesta_corta" || qTipo === "ejercicio") && (
                  <Field label="Respuesta correcta esperada" value={qRespuesta} onChangeText={setQRespuesta} multiline colors={colors} />
                )}
                <Field label="Retroalimentación (opcional)" value={qRetro} onChangeText={setQRetro} colors={colors} />

                <Pressable onPress={agregarPreguntaManual} style={[styles.smallBtn, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Guardar pregunta</Text>
                </Pressable>
              </View>
            )}

            {preguntas.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 6 }}>AGREGADAS</Text>
                {preguntas.map((p) => (
                  <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, color: colors.text }} numberOfLines={2}>{p.enunciado}</Text>
                      <Text style={{ fontSize: 11, color: colors.muted }}>{p.dcdCodigo} · {p.puntaje} pt · {TIPO_PREGUNTA_INFO[p.tipo].nombre}</Text>
                    </View>
                    <Pressable onPress={() => quitarPregunta(p.id)} style={{ padding: 4 }}>
                      <Text style={{ fontSize: 16 }}>🗑️</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Paso 3: Matriz ── */}
        {step === 3 && (
          <View>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>
              Distribución de preguntas por aprendizaje. Puedes mover preguntas entre DCD y ajustar puntajes.
            </Text>
            <View style={{ flexDirection: "row", backgroundColor: colors.surface, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}>
              <Text style={{ flex: 2.2, fontSize: 11, fontWeight: "700", color: colors.muted }}>DCD</Text>
              <Text style={{ flex: 2, fontSize: 11, fontWeight: "700", color: colors.muted }}>Indicador</Text>
              <Text style={{ flex: 0.8, fontSize: 11, fontWeight: "700", color: colors.muted, textAlign: "center" }}>#</Text>
              <Text style={{ flex: 0.8, fontSize: 11, fontWeight: "700", color: colors.muted, textAlign: "center" }}>Punt.</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: "700", color: colors.muted, textAlign: "center" }}>Dificultad</Text>
            </View>
            {matriz.map((fila) => (
              <View key={fila.dcd.codigo} style={{ marginBottom: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{fila.dcd.codigo}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>{fila.dcd.descripcion}</Text>
                <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>{fila.preguntas.length} preguntas · {fila.puntaje} pts</Text>
                {fila.preguntas.map((p) => (
                  <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 11, color: colors.text }} numberOfLines={2}>{p.enunciado}</Text>
                    </View>
                    <ChipGroup<string> options={dcdsEvaluadas.map((d) => d.codigo)} selected={p.dcdCodigo} onSelect={(v) => moverPregunta(p.id, v)} colors={colors} />
                    <TextInput
                      value={String(p.puntaje)}
                      onChangeText={(t) => cambiarPuntaje(p.id, Number(t) || 0)}
                      keyboardType="numeric"
                      style={[styles.puntajeInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                    />
                    <Text style={{ fontSize: 10, color: colors.muted, width: 70, textAlign: "right" }}>{DIFICULTAD_INFO[p.dificultad].nombre}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={[styles.errorBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Suma de puntajes de preguntas: <Text style={{ fontWeight: "700", color: sumaPuntajePreguntas === (Number(puntajeTotal) || 0) ? "#16A34A" : "#DC2626" }}>{sumaPuntajePreguntas}</Text> / Puntaje total: <Text style={{ fontWeight: "700", color: colors.text }}>{puntajeTotal}</Text>
              </Text>
            </View>
          </View>
        )}

        {/* ── Paso 4: Revisar ── */}
        {step === 4 && (
          <View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>{nombre}</Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
              {AREAS_INFO[area as Area]?.name} · {subnivel !== null ? SUBNIVEL_NAMES[subnivel] : ""} · {grado} {paralelo ? `· Paralelo ${paralelo}` : ""}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
              {asignatura} · {anioLectivo} · Puntaje total {puntajeTotal} · Duración {duracion} min
            </Text>
            <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 6 }}>RESUMEN</Text>
              <Text style={{ fontSize: 13, color: colors.text }}>DCD evaluadas: {dcdsEvaluadas.length}</Text>
              <Text style={{ fontSize: 13, color: colors.text }}>Preguntas: {preguntas.length}</Text>
              <Text style={{ fontSize: 13, color: colors.text }}>Estudiantes: 0 (se registran al aplicar)</Text>
              <Text style={{ fontSize: 13, color: colors.text }}>Umbrales: Dominado ≥ {dominadoMin}% · Refuerzo &lt; {refuerzoMax}%</Text>
            </View>
            {desdeCNC ? (
              // Al crear la evaluación desde el wizard CNC, publicar es una
              // decisión aparte que el docente puede tomar más tarde desde la
              // evaluación ya guardada — acá solo se guarda el borrador para
              // no interrumpir el flujo de planificación con esa decisión.
              <Pressable onPress={handleGuardar} disabled={saving}
                style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.primary, marginTop: 16, opacity: pressed ? 0.8 : saving ? 0.5 : 1 }]}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>{saving ? "Guardando..." : "Guardar"}</Text>
              </Pressable>
            ) : (
              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                <Pressable onPress={handleGuardar} disabled={saving}
                  style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>Guardar borrador</Text>
                </Pressable>
                <Pressable onPress={handlePublicar} disabled={saving}
                  style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : saving ? 0.5 : 1 }]}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>{saving ? "Guardando..." : "Publicar evaluación"}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {step < 4 && (
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Pressable onPress={handleNext} style={[styles.nextBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Continuar ›</Text>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14,
  },
  errorBox: {
    borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12,
  },
  iaBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#0F766E", borderRadius: 12, padding: 14, marginBottom: 12,
  },
  iaBtnTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  iaBtnSub: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 1 },
  section: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 12 },
  smallBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", alignSelf: "flex-start" },
  subnivelChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, minWidth: 150 },
  puntajeInput: { width: 44, borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 4, fontSize: 12, textAlign: "center" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 0.5,
    paddingBottom: Platform.OS === "web" ? 16 : 24,
  },
  nextBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  actionBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
});