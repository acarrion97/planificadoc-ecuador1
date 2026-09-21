import { useState, useEffect, useMemo, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import {
  MATERIAS_EGB_BGU,
  nivelesDeMateria,
  gradosDeNivel,
  competenciasDeGrado,
  obtenerMateria,
  ceDisponibleParaGrados,
  resolverBloquePorGrado,
} from "@/data/competencias-especificas-egb-bgu";
import type { CompetenciaEspecificaCompleta } from "@/data/types-competencias-especificas";
import type {
  BloqueCurricularGrado,
  SemanaMultigrado,
} from "@/data/types-curriculo-competencias";

type PasoFlujo = "contexto" | "competencias" | "datos" | "generar";
type Modalidad = "unigrado" | "multigrado";

const BLOQUE_VACIO: BloqueCurricularGrado = {
  indicadores: [],
  declarativos: [],
  procedimentales: [],
  actitudinales: [],
};

const PASOS: { key: PasoFlujo; label: string }[] = [
  { key: "contexto", label: "Contexto" },
  { key: "competencias", label: "Competencias" },
  { key: "datos", label: "Datos" },
  { key: "generar", label: "Generar" },
];

const TRIMESTRES = ["Primer trimestre", "Segundo trimestre", "Tercer trimestre"];
const PARALELOS = ["A", "B", "C", "D", "E"];

export default function EGBBGUIntegradoFormScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const [paso, setPaso] = useState<PasoFlujo>("contexto");
  const [cargando, setCargando] = useState(isEdit);

  // ── Step 1: Contexto ──
  const [modalidad, setModalidad] = useState<Modalidad>("unigrado");
  const [materiaId, setMateriaId] = useState(MATERIAS_EGB_BGU[0].id);
  const [nivel, setNivel] = useState("");
  const [grado, setGrado] = useState("");

  const nivelesDisponibles = useMemo(() => nivelesDeMateria(materiaId), [materiaId]);
  const gradosDisponibles = useMemo(() => (nivel ? gradosDeNivel(materiaId, nivel) : []), [materiaId, nivel]);

  // Al cambiar materia, resetear nivel/grado a los primeros disponibles
  useEffect(() => {
    const niveles = nivelesDeMateria(materiaId);
    setNivel((prev) => (niveles.includes(prev) ? prev : niveles[0] || ""));
  }, [materiaId]);

  useEffect(() => {
    const grados = nivel ? gradosDeNivel(materiaId, nivel) : [];
    setGrado((prev) => (grados.includes(prev) ? prev : grados[0] || ""));
  }, [materiaId, nivel]);

  // ── Multigrado: selección de grados combinados + CE común ──
  const [gradosSeleccionados, setGradosSeleccionados] = useState<string[]>([]);
  const [cesMultigrado, setCesMultigrado] = useState<CompetenciaEspecificaCompleta[]>([]);
  const [bloquesPorGrado, setBloquesPorGrado] = useState<Record<string, BloqueCurricularGrado>>({});
  const [incompatMensaje, setIncompatMensaje] = useState("");

  // Al cambiar materia/nivel, quitar de la selección grados que ya no apliquen
  useEffect(() => {
    setGradosSeleccionados((prev) => prev.filter((g) => gradosDisponibles.includes(g)));
  }, [gradosDisponibles]);

  const ceCandidatasMultigrado = useMemo(() => {
    if (!nivel) return [];
    const materia = obtenerMateria(materiaId);
    if (!materia) return [];
    return materia.competencias.filter((c) => c.porGrado.some((pg) => pg.nivel === nivel));
  }, [materiaId, nivel]);

  // Si la CE elegida deja de cubrir todos los grados seleccionados (cambió la
  // selección de grados), se limpia para forzar una nueva elección explícita.
  useEffect(() => {
    if (cesMultigrado.length === 0) return;
    const validas = cesMultigrado.filter((ce) => {
      const cobertura = ceDisponibleParaGrados(materiaId, ce.codigo, gradosSeleccionados);
      return cobertura.valido;
    });
    if (validas.length !== cesMultigrado.length) {
      setCesMultigrado(validas);
      if (validas.length === 0) setBloquesPorGrado({});
    }
  }, [gradosSeleccionados, materiaId]);

  // Las semanas generadas por IA quedan obsoletas si cambian los grados o
  // las CE seleccionadas (referencian gradoIds y contenido de un contexto
  // distinto) — se descartan para forzar una nueva generación. Se omite
  // justo después de precargar un plan existente (ver efecto de carga).
  useEffect(() => {
    if (precargandoMultigradoRef.current) {
      precargandoMultigradoRef.current = false;
      return;
    }
    setSemanasMultigrado([]);
  }, [gradosSeleccionados, cesMultigrado]);

  const toggleGradoMultigrado = (g: string) => {
    setIncompatMensaje("");
    setGradosSeleccionados((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const seleccionarCEMultigrado = (ce: CompetenciaEspecificaCompleta) => {
    const cobertura = ceDisponibleParaGrados(materiaId, ce.codigo, gradosSeleccionados);
    if (!cobertura.valido) {
      setIncompatMensaje(
        `${ce.codigo} no tiene desagregación para: ${cobertura.gradosNoCubiertos.join(", ")}. Elige otra competencia o ajusta los grados seleccionados.`
      );
      return;
    }
    setIncompatMensaje("");
    setCesMultigrado((prev) => {
      const exists = prev.some((c) => c.codigo === ce.codigo);
      const next = exists ? prev.filter((c) => c.codigo !== ce.codigo) : [...prev, ce];
      // Resolver bloques para todos los grados con las CEs seleccionadas
      const newBloques: Record<string, BloqueCurricularGrado> = {};
      for (const g of gradosSeleccionados) {
        for (const selected of next) {
          const resolved = resolverBloquePorGrado(materiaId, selected.codigo, [g]);
          if (resolved[g]) {
            newBloques[g] = resolved[g];
            break;
          }
        }
      }
      setBloquesPorGrado(newBloques);
      return next;
    });
  };

  const actualizarBloqueCampo = (
    g: string,
    campo: keyof BloqueCurricularGrado,
    texto: string
  ) => {
    setBloquesPorGrado((prev) => ({
      ...prev,
      [g]: {
        ...(prev[g] ?? BLOQUE_VACIO),
        [campo]: texto.split("\n"),
      },
    }));
  };

  // Semanas generadas por IA: el docente puede ajustar el tema y cada campo de
  // la actividad por grado, o volver a generarlas con IA.
  const [semanasMultigrado, setSemanasMultigrado] = useState<SemanaMultigrado[]>([]);

  const actualizarTemaSemana = (numero: number, tema: string) => {
    setSemanasMultigrado((prev) => prev.map((s) => (s.numero === numero ? { ...s, tema } : s)));
  };

  const actualizarActividadSemana = (
    numero: number,
    gradoId: string,
    campo: "inicio" | "desarrollo" | "cierre" | "recursos" | "tecnica" | "instrumento",
    valor: string
  ) => {
    setSemanasMultigrado((prev) =>
      prev.map((s) => {
        if (s.numero !== numero) return s;
        return {
          ...s,
          actividades: s.actividades.map((a) => {
            if (a.gradoId !== gradoId) return a;
            return campo === "inicio" || campo === "desarrollo" || campo === "cierre"
              ? { ...a, estrategiasDUA: { ...a.estrategiasDUA, [campo]: valor } }
              : { ...a, [campo]: valor };
          }),
        };
      })
    );
  };
  // Evita que el efecto de "descartar semanas obsoletas" borre las semanas
  // recién precargadas al abrir un plan existente para editar (ver el efecto
  // de carga más abajo, que activa esta bandera antes de poblar el estado).
  const precargandoMultigradoRef = useRef(false);

  // ── Step 2: Competencias ──
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<CompetenciaEspecificaCompleta[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const competenciasDisponibles = useMemo(
    () => (nivel && grado ? competenciasDeGrado(materiaId, nivel, grado) : []),
    [materiaId, nivel, grado]
  );

  // Al cambiar materia/nivel/grado, quitar de la selección lo que ya no aplique
  useEffect(() => {
    const codigosValidos = new Set(competenciasDisponibles.map((c) => c.codigo));
    setCompetenciasSeleccionadas((prev) => prev.filter((c) => codigosValidos.has(c.codigo)));
  }, [competenciasDisponibles]);

  // ── Step 3: Datos ──
  const [trimestre, setTrimestre] = useState("Primer trimestre");
  const [paralelo, setParalelo] = useState("A");
  const [noSemanas, setNoSemanas] = useState("8");
  const [titulo, setTitulo] = useState("");
  const [situacionAprendizaje, setSituacionAprendizaje] = useState("");
  const [temasTrimestre, setTemasTrimestre] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [docente, setDocente] = useState("");
  const [hayNEE, setHayNEE] = useState(false);
  const [compartir, setCompartir] = useState(false);

  // ── Cargar datos existentes (modo edición) ──
  const { data: planExistente } = trpc.curriculoCompetencias.getById.useQuery(
    { id: Number(id) },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (planExistente?.formData) {
      const fd = planExistente.formData as any;
      setInstitucion(fd.institucion || "");
      setDocente(fd.docente || "");
      setTrimestre(fd.trimestre || "Primer trimestre");
      setParalelo(fd.paralelo || "A");
      setNoSemanas(fd.noSemanasClase?.toString() || "8");
      setTitulo(fd.situacionAprendizaje?.titulo || "");
      setSituacionAprendizaje(fd.situacionAprendizaje?.descripcion || "");

      // Un registro multigrado no tiene `ambitos`/`grado` singular — se
      // precarga por separado para no tratarlo como single-grade (lo que
      // guardaría con la mutation equivocada al presionar "Guardar Cambios").
      if (fd.modalidad === "multigrado") {
        precargandoMultigradoRef.current = true;
        setModalidad("multigrado");
        setNivel(fd.nivel || "");
        const materia = MATERIAS_EGB_BGU.find((m) => m.id === fd.asignatura);
        if (materia) setMateriaId(materia.id);
        const grados: string[] = (fd.grados ?? []).map((g: any) => g.grado).filter(Boolean);
        setGradosSeleccionados(grados);
        const bloques: Record<string, BloqueCurricularGrado> = {};
        for (const g of fd.grados ?? []) {
          if (g.grado) bloques[g.grado] = g.bloqueCurricular ?? BLOQUE_VACIO;
        }
        setBloquesPorGrado(bloques);
        // El campo persistido es `competenciasEspecifica` (array, ver
        // normalizarPlanificacionMultigrado); se mantiene el fallback al
        // nombre singular `competenciaEspecifica` solo por si hay registros
        // guardados con un shape más antiguo.
        const ceRaw = fd.competenciasEspecifica ?? fd.competenciaEspecifica;
        if (Array.isArray(ceRaw)) {
          if (materia) {
            const selected = ceRaw
              .map((c: any) => materia.competencias.find((comp) => comp.codigo === c.codigo))
              .filter(Boolean) as CompetenciaEspecificaCompleta[];
            setCesMultigrado(selected);
          }
        } else if (ceRaw?.codigo && materia) {
          const ce = materia.competencias.find((c) => c.codigo === ceRaw.codigo);
          if (ce) setCesMultigrado([ce]);
        }
        setSemanasMultigrado(Array.isArray(fd.semanas) ? fd.semanas : []);
        setCargando(false);
        return;
      }

      setGrado(fd.grado || "");
      setNivel(fd.nivel || "");
      if (fd.ambitos?.length > 0) {
        const primerCodigo = fd.ambitos[0]?.competenciaCodigo || "";
        const materia = MATERIAS_EGB_BGU.find((m) => m.competencias.some((c) => c.codigo === primerCodigo));
        if (materia) {
          setMateriaId(materia.id);
          const codes = fd.ambitos.map((a: any) => a.competenciaCodigo).filter(Boolean);
          const selected = materia.competencias.filter((c) => codes.includes(c.codigo));
          setCompetenciasSeleccionadas(selected);
        }
      }
      setCargando(false);
    }
  }, [planExistente]);

  // ── Mutations (comparten backend con Inicial: mismo shape de planificación) ──
  const utils = trpc.useContext();
  const createMutation = trpc.curriculoCompetencias.createInicial.useMutation({
    onSuccess: (data) => {
      utils.curriculoCompetencias.list.invalidate();
      const nuevoId = (data as any)?.id;
      if (nuevoId) {
        router.push(`/curriculo-competencias/ver/${nuevoId}` as any);
      } else {
        router.back();
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear la planificación.");
    },
  });

  const updateMutation = trpc.curriculoCompetencias.updateInicial.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      router.push(`/curriculo-competencias/ver/${id}` as any);
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar la planificación.");
    },
  });

  const createMultigradoMutation = trpc.curriculoCompetencias.createMultigrado.useMutation({
    onSuccess: (data) => {
      utils.curriculoCompetencias.list.invalidate();
      const nuevoId = (data as any)?.id;
      if (nuevoId) {
        router.push(`/curriculo-competencias/ver/${nuevoId}` as any);
      } else {
        router.back();
      }
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo crear la planificación multigrado.");
    },
  });

  const updateMultigradoMutation = trpc.curriculoCompetencias.updateMultigrado.useMutation({
    onSuccess: () => {
      utils.curriculoCompetencias.list.invalidate();
      router.push(`/curriculo-competencias/ver/${id}` as any);
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo actualizar la planificación multigrado.");
    },
  });

  const sugerirTituloMutation = trpc.curriculoCompetencias.sugerirSituacionAprendizaje.useMutation({
    onSuccess: (data) => {
      setTitulo(data.titulo);
      if (!situacionAprendizaje.trim() && data.descripcion) {
        setSituacionAprendizaje(data.descripcion);
      }
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo sugerir un título. Intenta de nuevo.");
    },
  });

  const competenciasParaSugerencia = useMemo(() => {
    if (modalidad === "multigrado") {
      return cesMultigrado.map((c) => ({ codigo: c.codigo, descripcion: c.descripcion }));
    }
    return competenciasSeleccionadas.map((c) => ({ codigo: c.codigo, descripcion: c.descripcion }));
  }, [modalidad, cesMultigrado, competenciasSeleccionadas]);

  const handleSugerirTitulo = () => {
    if (competenciasParaSugerencia.length === 0) return;
    sugerirTituloMutation.mutate({
      materia: MATERIAS_EGB_BGU.find((m) => m.id === materiaId)?.nombre,
      nivel,
      grado: modalidad === "multigrado" ? gradosSeleccionados.join(", ") : grado,
      competencias: competenciasParaSugerencia,
      temasTrimestre: temasTrimestre.trim() || undefined,
    });
  };

  const sugerirSemanasMutation = trpc.curriculoCompetencias.sugerirSemanasMultigrado.useMutation({
    onSuccess: (data) => {
      setSemanasMultigrado(data.semanas as SemanaMultigrado[]);
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudieron generar las semanas. Intenta de nuevo.");
    },
  });

  const handleGenerarSemanasIA = () => {
    if (gradosSeleccionados.length < 2 || cesMultigrado.length === 0) return;
    sugerirSemanasMutation.mutate({
      materia: MATERIAS_EGB_BGU.find((m) => m.id === materiaId)?.nombre,
      nivel,
      competenciasEspecifica: cesMultigrado.map((c) => ({ codigo: c.codigo, descripcion: c.descripcion })),
      situacionAprendizaje: { titulo, descripcion: situacionAprendizaje },
      temasTrimestre: temasTrimestre.trim() || undefined,
      noSemanas: parseInt(noSemanas, 10) || 8,
      grados: gradosSeleccionados.map((g) => ({
        id: g,
        grado: g,
        bloqueCurricular: bloquesPorGrado[g] ?? BLOQUE_VACIO,
      })),
    });
  };

  // ── Competencias filtering ──
  const competenciasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return competenciasDisponibles;
    const q = busqueda.trim().toLowerCase();
    return competenciasDisponibles.filter(
      (c) => c.codigo.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q)
    );
  }, [competenciasDisponibles, busqueda]);

  const selectedCodes = useMemo(() => new Set(competenciasSeleccionadas.map((c) => c.codigo)), [competenciasSeleccionadas]);

  const toggleCompetencia = (comp: CompetenciaEspecificaCompleta) => {
    if (selectedCodes.has(comp.codigo)) {
      setCompetenciasSeleccionadas((prev) => prev.filter((c) => c.codigo !== comp.codigo));
    } else {
      setCompetenciasSeleccionadas((prev) => [...prev, comp]);
    }
  };

  const removeCompetencia = (codigo: string) => {
    setCompetenciasSeleccionadas((prev) => prev.filter((c) => c.codigo !== codigo));
  };

  // ── Navigation ──
  const canAdvance = () => {
    if (paso === "contexto") {
      if (modalidad === "multigrado") return !!nivel;
      return !!nivel && !!grado;
    }
    if (paso === "competencias") {
      if (modalidad === "multigrado") {
        return gradosSeleccionados.length >= 2 && cesMultigrado.length > 0;
      }
      return competenciasSeleccionadas.length > 0;
    }
    return true;
  };

  const advancePaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx < PASOS.length - 1) setPaso(PASOS[idx + 1].key);
  };

  const retreatPaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx > 0) setPaso(PASOS[idx - 1].key);
  };

  // ── Save ──
  const handleSaveMultigrado = () => {
    // `id` se envía explícito (= el mismo nombre de grado usado como gradoId
    // en las actividades de `semanasMultigrado`) para que el servidor lo use
    // tal cual en vez de derivar su propio slug — si no coincidieran, el
    // normalizador del servidor descartaría silenciosamente todas las
    // actividades semanales al filtrar por id de grado.
    const gradosPayload = gradosSeleccionados.map((g) => ({
      id: g,
      grado: g,
      nivel,
      bloqueCurricular: bloquesPorGrado[g] ?? BLOQUE_VACIO,
    }));

    const payload = {
      sessionId: "default",
      institucion,
      docente,
      paralelo,
      asignatura: materiaId,
      trimestre,
      noSemanasClase: parseInt(noSemanas, 10) || 8,
      nivel,
      grados: gradosPayload,
      competenciaEspecifica: cesMultigrado.length > 0
        ? cesMultigrado.map((c) => ({ codigo: c.codigo, descripcion: c.descripcion }))
        : undefined,
      situacionAprendizaje: {
        titulo,
        descripcion: situacionAprendizaje,
      },
      temasTrimestre,
      semanas: semanasMultigrado,
    };

    if (isEdit) {
      updateMultigradoMutation.mutate({ ...payload, id: Number(id) });
    } else {
      createMultigradoMutation.mutate(payload);
    }
  };

  const handleSave = () => {
    if (modalidad === "multigrado") {
      handleSaveMultigrado();
      return;
    }

    const temas = temasTrimestre.split("\n").map((t) => t.trim()).filter(Boolean);
    const ambitosPayload = competenciasSeleccionadas.map((comp) => ({
      ambito: comp.descripcion.split(",")[0].substring(0, 50),
      competenciaCodigo: comp.codigo,
      competenciaDescripcion: comp.descripcion,
      competencias: comp.competenciasClave.slice(0, 2),
      destrezas: [comp.descripcion],
      clases: temas.map((tema, i) => ({
        numero: i + 1,
        tema,
        objetivoEspecifico: comp.descripcion,
        metodologia: "",
        inicio: [],
        desarrollo: [],
        cierre: [],
        metodoEvaluacion: [],
      })),
    }));

    if (ambitosPayload.length > 0 && ambitosPayload[0].clases.length === 0) {
      ambitosPayload[0].clases = [{
        numero: 1,
        tema: titulo || "Situación de aprendizaje",
        objetivoEspecifico: competenciasSeleccionadas[0]?.descripcion || "",
        metodologia: "",
        inicio: [],
        desarrollo: [],
        cierre: [],
        metodoEvaluacion: [],
      }];
    }

    const payload = {
      sessionId: "default",
      grado,
      nivel,
      institucion,
      docente,
      duracion: "2026-2027",
      trimestre,
      paralelo,
      noSemanasClase: parseInt(noSemanas) || 8,
      objetivoGeneral: situacionAprendizaje,
      situacionAprendizaje: {
        titulo,
        descripcion: situacionAprendizaje,
      },
      ambitos: ambitosPayload,
    };

    if (isEdit) {
      updateMutation.mutate({ ...payload, id: Number(id) });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ── Render helpers ──
  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );

  const renderSubHeader = (title: string) => (
    <Text style={[styles.subSectionTitle, { color: colors.primary }]}>{title}</Text>
  );

  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View style={styles.selectRow}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.selectChip,
              {
                backgroundColor: value === opt ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: value === opt ? "#fff" : colors.foreground, fontSize: 13 }}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { placeholder?: string; multiline?: boolean; keyboard?: "default" | "numeric" } = {}
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={opts.placeholder || label}
        placeholderTextColor={colors.muted + "80"}
        multiline={opts.multiline}
        numberOfLines={opts.multiline ? 4 : 1}
        keyboardType={opts.keyboard || "default"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: opts.multiline ? "top" : "center",
            minHeight: opts.multiline ? 80 : 44,
          },
        ]}
      />
    </View>
  );

  // ── Step 1: Contexto curricular ──
  const renderContexto = () => (
    <View>
      {renderSectionHeader("Contexto curricular", "🎓")}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Planificación</Text>
        <View style={styles.selectRow}>
          {(
            [
              { key: "unigrado" as const, label: "Un solo grado" },
              { key: "multigrado" as const, label: "Multigrado" },
            ]
          ).map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setModalidad(opt.key)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: modalidad === opt.key ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ color: modalidad === opt.key ? "#fff" : colors.foreground, fontSize: 13 }}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {modalidad === "multigrado" && (
          <Text style={[styles.helperText, { color: colors.muted, marginTop: 6 }]}>
            Combina 2 o más grados del mismo subnivel en una sola planificación (aulas multigrado). Los grados se eligen en el siguiente paso.
          </Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Materia</Text>
        <View style={styles.selectRow}>
          {MATERIAS_EGB_BGU.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMateriaId(m.id)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: materiaId === m.id ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ color: materiaId === m.id ? "#fff" : colors.foreground, fontSize: 13 }}>
                {m.nombre}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {renderSelect("Nivel", nivel, nivelesDisponibles, setNivel)}

      {modalidad === "unigrado" && (
        gradosDisponibles.length > 0 ? (
          renderSelect("Grado / Curso", grado, gradosDisponibles, setGrado)
        ) : (
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Esta materia no tiene datos para el nivel seleccionado.
          </Text>
        )
      )}

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Currículo integrado</Text>
        <View style={[styles.selectRow, { backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }]}>
          <Text style={{ color: colors.foreground, fontSize: 15 }}>CE — Competencias específicas (EGB / BGU)</Text>
        </View>
      </View>
    </View>
  );

  // ── Step 2: Competencias específicas (multigrado) ──
  const renderBloqueTextarea = (
    label: string,
    grado: string,
    campo: keyof BloqueCurricularGrado
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={(bloquesPorGrado[grado]?.[campo] ?? []).join("\n")}
        onChangeText={(texto) => actualizarBloqueCampo(grado, campo, texto)}
        multiline
        numberOfLines={4}
        placeholder="Un ítem por línea"
        placeholderTextColor={colors.muted + "80"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: "top",
            minHeight: 80,
            fontSize: 13,
          },
        ]}
      />
    </View>
  );

  const cesSeleccionadasMultigrado = useMemo(() => new Set(cesMultigrado.map((c) => c.codigo)), [cesMultigrado]);

  const renderCompetenciasMultigrado = () => (
    <View>
      {renderSectionHeader("Competencias específicas · multigrado", "🧩")}

      <Text style={[styles.helperText, { color: colors.muted }]}>
        Elige 2 o más grados de {nivel || "este subnivel"} y al menos una Competencia Específica (CE) que cubra a todos.
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>
          Grados combinados ({gradosSeleccionados.length})
        </Text>
        <View style={styles.selectRow}>
          {gradosDisponibles.map((g) => {
            const selected = gradosSeleccionados.includes(g);
            return (
              <Pressable
                key={g}
                onPress={() => toggleGradoMultigrado(g)}
                style={[
                  styles.selectChip,
                  { backgroundColor: selected ? colors.primary : colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: selected ? "#fff" : colors.foreground, fontSize: 13 }}>{g}</Text>
              </Pressable>
            );
          })}
        </View>
        {gradosSeleccionados.length === 1 && (
          <Text style={[styles.helperText, { color: colors.muted, marginTop: 6 }]}>
            La modalidad multigrado requiere al menos 2 grados.
          </Text>
        )}
      </View>

      {gradosSeleccionados.length >= 2 && (
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>
            Competencias específicas ({cesMultigrado.length} seleccionadas)
          </Text>
          <View style={[styles.listaContainer, { borderColor: colors.border }]}>
            {ceCandidatasMultigrado.length === 0 ? (
              <Text style={{ color: colors.muted, padding: 12, fontSize: 13 }}>
                No hay competencias para esta materia/nivel.
              </Text>
            ) : (
              ceCandidatasMultigrado.map((ce) => {
                const cobertura = ceDisponibleParaGrados(materiaId, ce.codigo, gradosSeleccionados);
                const selected = cesSeleccionadasMultigrado.has(ce.codigo);
                return (
                  <Pressable
                    key={ce.codigo}
                    onPress={() => seleccionarCEMultigrado(ce)}
                    style={[
                      styles.listaItem,
                      {
                        borderBottomColor: colors.border,
                        backgroundColor: selected ? colors.primary + "10" : "transparent",
                        opacity: cobertura.valido ? 1 : 0.5,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: selected ? colors.primary : colors.border,
                          backgroundColor: selected ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      {selected && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.listaCodigo, { color: colors.primary }]}>{ce.codigo}</Text>
                      <Text style={[styles.listaDesc, { color: colors.foreground }]} numberOfLines={2}>
                        {ce.descripcion}
                      </Text>
                      {!cobertura.valido && (
                        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                          No cubre: {cobertura.gradosNoCubiertos.join(", ")}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      )}

      {!!incompatMensaje && (
        <View style={[styles.disclaimer, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
          <Text style={[styles.disclaimerText, { color: "#B91C1C", fontStyle: "normal" }]}>
            ⚠️ {incompatMensaje}
          </Text>
        </View>
      )}

      {cesMultigrado.length > 0 && gradosSeleccionados.length >= 2 && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.subSectionTitle, { color: colors.primary }]}>
            Bloque curricular resuelto por grado
          </Text>
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Se resolvió automáticamente desde el catálogo oficial. Puedes editarlo antes de generar.
          </Text>
          {gradosSeleccionados.map((g) => (
            <View
              key={g}
              style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 12 }]}
            >
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>{g}</Text>
              {renderBloqueTextarea("Indicadores de evaluación", g, "indicadores")}
              {renderBloqueTextarea("Saberes declarativos", g, "declarativos")}
              {renderBloqueTextarea("Saberes procedimentales", g, "procedimentales")}
              {renderBloqueTextarea("Saberes actitudinales", g, "actitudinales")}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // ── Step 2: Competencias específicas ──
  const renderCompetenciasUnigrado = () => (
    <View>
      {renderSectionHeader("Competencias específicas", "🧩")}

      <Text style={[styles.helperText, { color: colors.muted }]}>
        Elige las competencias específicas de {grado || "este grado"}. Los indicadores y saberes se resuelven al generar.
      </Text>

      <TextInput
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar por código o texto..."
        placeholderTextColor={colors.muted + "80"}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            marginBottom: 12,
          },
        ]}
      />

      {competenciasSeleccionadas.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>
            Competencias elegidas ({competenciasSeleccionadas.length})
          </Text>
          <View style={styles.chipsWrap}>
            {competenciasSeleccionadas.map((comp) => (
              <View key={comp.codigo} style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}>
                <Text style={[styles.chipCode, { color: "#4C1D95" }]}>{comp.codigo}</Text>
                <Text style={[styles.chipDesc, { color: "#6D28D9" }]} numberOfLines={1}>
                  {comp.descripcion.length > 35 ? comp.descripcion.substring(0, 35) + "..." : comp.descripcion}
                </Text>
                <Pressable onPress={() => removeCompetencia(comp.codigo)} hitSlop={6} style={styles.chipX}>
                  <Text style={{ color: "#7C3AED", fontSize: 15, fontWeight: "700" }}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={[styles.fieldLabel, { color: colors.muted }]}>Agregar competencias</Text>
      <View style={[styles.listaContainer, { borderColor: colors.border }]}>
        {competenciasFiltradas.length === 0 ? (
          <Text style={{ color: colors.muted, padding: 12, fontSize: 13 }}>
            No hay competencias para esta combinación de materia/nivel/grado.
          </Text>
        ) : (
          competenciasFiltradas.map((comp) => (
            <Pressable
              key={comp.codigo}
              onPress={() => toggleCompetencia(comp)}
              style={[
                styles.listaItem,
                { borderBottomColor: colors.border, backgroundColor: selectedCodes.has(comp.codigo) ? colors.primary + "10" : "transparent" },
              ]}
            >
              <View style={[styles.checkbox, { borderColor: selectedCodes.has(comp.codigo) ? colors.primary : colors.border, backgroundColor: selectedCodes.has(comp.codigo) ? colors.primary : "transparent" }]}>
                {selectedCodes.has(comp.codigo) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listaCodigo, { color: colors.primary }]}>{comp.codigo}</Text>
                <Text style={[styles.listaDesc, { color: colors.foreground }]} numberOfLines={2}>
                  {comp.descripcion}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );

  const renderCompetencias = () =>
    modalidad === "multigrado" ? renderCompetenciasMultigrado() : renderCompetenciasUnigrado();

  // ── Step 3: Datos ──
  const renderDatos = () => (
    <View>
      {renderSectionHeader("Datos administrativos", "📋")}

      {renderSubHeader("Identificación")}
      {renderField("Institución", institucion, setInstitucion, {
        placeholder: "Nombre de la unidad educativa",
      })}
      {renderField("Docente", docente, setDocente, {
        placeholder: "Nombre del docente",
      })}

      {renderSubHeader("Programación del trimestre")}
      {renderSelect("Trimestre", trimestre, TRIMESTRES, setTrimestre)}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {renderSelect("Paralelo", paralelo, PARALELOS, setParalelo)}
        </View>
        <View style={{ flex: 1 }}>
          {renderField("N.° de semanas", noSemanas, setNoSemanas, { keyboard: "numeric" })}
        </View>
      </View>

      {renderSubHeader("Situación de aprendizaje")}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: colors.muted, marginBottom: 0 }]}>Título</Text>
          <Pressable
            onPress={handleSugerirTitulo}
            disabled={sugerirTituloMutation.isPending || competenciasParaSugerencia.length === 0}
            style={[
              styles.sugerirBtn,
              { opacity: sugerirTituloMutation.isPending || competenciasParaSugerencia.length === 0 ? 0.5 : 1 },
            ]}
          >
            {sugerirTituloMutation.isPending ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>✨ Sugerir con IA</Text>
            )}
          </Pressable>
        </View>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Pensamiento crítico, voz ética y creación"
          placeholderTextColor={colors.muted + "80"}
          style={[
            styles.textInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground },
          ]}
        />
      </View>

      {renderField("Descripción", situacionAprendizaje, setSituacionAprendizaje, {
        placeholder: "Opcional. Si lo dejás vacío, se redacta a partir de las competencias (o de la sugerencia con IA).",
        multiline: true,
      })}

      {renderField("Temas del trimestre", temasTrimestre, setTemasTrimestre, {
        placeholder: "Opcional. Escribí un tema por línea.\nEj: El mito y el logos\nLa argumentación filosófica",
        multiline: true,
      })}

      {renderSubHeader("Configuración")}
      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>¿Hay estudiantes con NEE en este paralelo?</Text>
        </View>
        <Switch
          value={hayNEE}
          onValueChange={setHayNEE}
          trackColor={{ false: colors.border, true: colors.primary + "60" }}
          thumbColor={hayNEE ? colors.primary : colors.muted}
        />
      </View>

      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>¿Compartir con la comunidad?</Text>
          <Text style={[styles.toggleSub, { color: colors.muted }]}>Otros docentes podrán ver y clonar tu planificación.</Text>
        </View>
        <Switch
          value={compartir}
          onValueChange={setCompartir}
          trackColor={{ false: colors.border, true: colors.primary + "60" }}
          thumbColor={compartir ? colors.primary : colors.muted}
        />
      </View>
    </View>
  );

  // ── Step 4: Generar ──
  const renderGenerarUnigrado = () => (
    <View>
      {renderSectionHeader("Generar planificación", "✨")}

      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Resumen</Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Materia:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {MATERIAS_EGB_BGU.find((m) => m.id === materiaId)?.nombre}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Nivel:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{nivel}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Grado:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{grado}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Trimestre:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{trimestre}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Paralelo:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{paralelo}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Semanas:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{noSemanas}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Competencias:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {competenciasSeleccionadas.map((c) => c.codigo).join(", ")}
          </Text>
        </View>

        {titulo ? (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Título:</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{titulo}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.disclaimer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.disclaimerText, { color: colors.muted }]}>
          Esta herramienta pedagógica genera propuestas de planificación basadas en los lineamientos técnicos y formatos socializados en la fase de piloto. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito.
        </Text>
      </View>
    </View>
  );

  const renderGenerarMultigrado = () => (
    <View>
      {renderSectionHeader("Generar planificación · multigrado", "✨")}

      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Resumen</Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Materia:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {MATERIAS_EGB_BGU.find((m) => m.id === materiaId)?.nombre}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Subnivel:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{nivel}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Grados:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {gradosSeleccionados.join(", ") || "—"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Competencias:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {cesMultigrado.map((c) => c.codigo).join(", ") || "—"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Trimestre:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{trimestre}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Paralelo:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{paralelo}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Semanas:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>{noSemanas}</Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text style={[styles.summaryTitle, { color: colors.foreground, marginBottom: 0 }]}>
            Semanas del trimestre ({semanasMultigrado.length || noSemanas})
          </Text>
          <Pressable
            onPress={handleGenerarSemanasIA}
            disabled={sugerirSemanasMutation.isPending || gradosSeleccionados.length < 2 || cesMultigrado.length === 0}
            style={[
              styles.sugerirBtn,
              {
                opacity:
                  sugerirSemanasMutation.isPending || gradosSeleccionados.length < 2 || cesMultigrado.length === 0
                    ? 0.5
                    : 1,
              },
            ]}
          >
            {sugerirSemanasMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ActivityIndicator color={colors.primary} size="small" />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>Generando…</Text>
              </View>
            ) : (
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                ✨ {semanasMultigrado.length > 0 ? "Regenerar con IA" : "Generar con IA"}
              </Text>
            )}
          </Pressable>
        </View>

        {semanasMultigrado.length === 0 ? (
          <Text style={[styles.helperText, { color: colors.muted, marginBottom: 0 }]}>
            Todavía no se generó el contenido semanal. Presiona "Generar con IA" para crear un tema y una actividad
            diferenciada por grado en cada semana, a partir de la(s) competencia(s) y los grados seleccionados. El
            resultado es editable: puedes ajustar cualquier campo o volver a generarlo.
          </Text>
        ) : (
          semanasMultigrado.map((semana) => (
            <View
              key={semana.numero}
              style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 10 }}
            >
              <Text style={[styles.subSectionTitle, { color: colors.primary, marginBottom: 6 }]}>
                Semana {semana.numero}
              </Text>
              {renderField("Tema de la semana", semana.tema, (v) => actualizarTemaSemana(semana.numero, v))}
              {gradosSeleccionados.map((g) => {
                const actividad = semana.actividades.find((a) => a.gradoId === g);
                if (!actividad) return null;
                const campos: Array<{
                  label: string;
                  campo: "inicio" | "desarrollo" | "cierre" | "recursos" | "tecnica" | "instrumento";
                  valor: string;
                  multiline: boolean;
                }> = [
                  { label: "Inicio", campo: "inicio", valor: actividad.estrategiasDUA.inicio, multiline: true },
                  { label: "Desarrollo", campo: "desarrollo", valor: actividad.estrategiasDUA.desarrollo, multiline: true },
                  { label: "Cierre", campo: "cierre", valor: actividad.estrategiasDUA.cierre, multiline: true },
                  { label: "Recursos", campo: "recursos", valor: actividad.recursos, multiline: true },
                  { label: "Técnica", campo: "tecnica", valor: actividad.tecnica, multiline: false },
                  { label: "Instrumento", campo: "instrumento", valor: actividad.instrumento, multiline: false },
                ];
                return (
                  <View key={g} style={{ marginBottom: 8 }}>
                    <Text style={[styles.listaCodigo, { color: colors.foreground, marginBottom: 2 }]}>{g}</Text>
                    {campos.map((c) => (
                      <View key={c.campo}>
                        {renderField(
                          c.label,
                          c.valor,
                          (v) => actualizarActividadSemana(semana.numero, g, c.campo, v),
                          { multiline: c.multiline }
                        )}
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          ))
        )}
      </View>

      {!multigradoListoParaGuardar && (
        <View style={[styles.disclaimer, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
          <Text style={[styles.disclaimerText, { color: "#B91C1C", fontStyle: "normal" }]}>
            ⚠️ {gradosSeleccionados.length < 2 || cesMultigrado.length === 0
              ? "Falta completar el paso de Competencias: selecciona 2 o más grados y al menos una Competencia Específica."
              : "Falta generar el contenido semanal con IA antes de guardar."}
          </Text>
        </View>
      )}

      <View style={[styles.disclaimer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.disclaimerText, { color: colors.muted }]}>
          Esta herramienta pedagógica genera propuestas de planificación basadas en los lineamientos técnicos y formatos socializados en la fase de piloto. Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa y distrito.
        </Text>
      </View>
    </View>
  );

  const renderGenerar = () =>
    modalidad === "multigrado" ? renderGenerarMultigrado() : renderGenerarUnigrado();

  const renderPasoActual = () => {
    switch (paso) {
      case "contexto": return renderContexto();
      case "competencias": return renderCompetencias();
      case "datos": return renderDatos();
      case "generar": return renderGenerar();
    }
  };

  if (cargando) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 8 }}>Cargando planificación...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    createMultigradoMutation.isPending ||
    updateMultigradoMutation.isPending;
  const multigradoListoParaGuardar =
    gradosSeleccionados.length >= 2 && cesMultigrado.length > 0 && semanasMultigrado.length > 0;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-base text-muted">
            {isEdit ? "Editar Planificación" : "Nueva microcurricular por competencias"}
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            Currículo Integrado — EGB / BGU
          </Text>
          <Text className="text-sm text-muted mt-1">
            Elige materia, nivel, grado y competencias; arma el trimestre.
          </Text>
        </View>

        <View style={styles.progressLinks}>
          {PASOS.map((p, i) => {
            const currentIdx = PASOS.findIndex((x) => x.key === paso);
            const isActive = p.key === paso;
            const isDone = i < currentIdx;
            return (
              <Pressable
                key={p.key}
                onPress={() => { if (i <= currentIdx) setPaso(p.key); }}
                style={styles.progressLink}
              >
                <Text style={{
                  fontSize: 13,
                  color: isActive ? colors.primary : isDone ? colors.success : colors.muted,
                  fontWeight: isActive ? "700" : "400",
                  textDecorationLine: isDone ? "line-through" : "none",
                }}>
                  {i + 1}. {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 20 }}>{renderPasoActual()}</View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          {paso !== "contexto" ? (
            <Pressable
              onPress={retreatPaso}
              style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Anterior</Text>
            </Pressable>
          ) : <View />}

          {paso !== "generar" ? (
            <Pressable
              onPress={advancePaso}
              disabled={!canAdvance()}
              style={[styles.navBtn, { backgroundColor: canAdvance() ? colors.primary : colors.muted + "40" }]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Siguiente</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSave}
              disabled={isPending || (modalidad === "multigrado" && !multigradoListoParaGuardar)}
              style={[
                styles.navBtn,
                {
                  backgroundColor:
                    isPending || (modalidad === "multigrado" && !multigradoListoParaGuardar)
                      ? colors.muted + "40"
                      : colors.primary,
                },
              ]}
            >
              {isPending ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Guardando…</Text>
                </View>
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  ✨ {isEdit ? "Guardar Cambios" : "Generar planificación"}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  subSectionTitle: { fontSize: 13, fontWeight: "700", marginTop: 4, marginBottom: 10 },
  helperText: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  sugerirBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  row: { flexDirection: "row", gap: 12 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, gap: 6 },
  chipCode: { fontSize: 12, fontWeight: "700" },
  chipDesc: { fontSize: 11, maxWidth: 180 },
  chipX: { paddingLeft: 4 },
  listaContainer: { borderWidth: 1, borderRadius: 10, maxHeight: 300 },
  listaItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderBottomWidth: 1, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  listaCodigo: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  listaDesc: { fontSize: 12, lineHeight: 17 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  toggleLabel: { fontSize: 14, fontWeight: "600" },
  toggleSub: { fontSize: 12, marginTop: 2 },
  summaryCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  summaryRow: { flexDirection: "row", marginBottom: 6, gap: 8 },
  summaryLabel: { fontSize: 13, fontWeight: "600", width: 100 },
  summaryValue: { fontSize: 13, flex: 1 },
  disclaimer: { borderRadius: 10, borderWidth: 1, padding: 14, borderStyle: "dashed" },
  disclaimerText: { fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  progressLinks: { flexDirection: "row", paddingHorizontal: 20, gap: 16, marginBottom: 16, marginTop: 4 },
  progressLink: {},
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12 },
  bottomBarInner: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
});
