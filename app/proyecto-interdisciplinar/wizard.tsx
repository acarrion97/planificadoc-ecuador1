import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import type { BaseCurricular, FaseProyecto, RubricaProyecto } from "@/data/types-proyecto-interdisciplinar";
import {
  FASES_OFICIALES,
  normalizarFase,
  rubricaDisciplinarPorDefecto,
  rubricaInterdisciplinarPorDefecto,
  criterioRubricaVacio,
} from "@/data/proyecto-interdisciplinar-formato";
import { Subnivel, AREAS_INFO, AREAS_POR_SUBNIVEL, SUBNIVEL_NAMES, filtrarPorAreaYSubnivel, buscarPorCodigo } from "@/data";
import { MATERIAS_EGB_BGU, gradosDeNivel, competenciasDeGrado, buscarCompetenciaEspecificaEGBBGU } from "@/data/competencias-especificas-egb-bgu";

/** Mismo patrón que app/planificacion-anual/index.tsx: id de dispositivo persistido en AsyncStorage. */
async function getSessionId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

function generarIdLocal(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * `Alert.alert` de react-native-web es un no-op silencioso
 * (`node_modules/react-native-web/dist/exports/Alert/index.js` — `static alert() {}`),
 * así que en la app web (donde corre este wizard en producción/preview) los
 * mensajes de validación, error y éxito nunca se mostraban. Mismo patrón ya
 * usado en app/planificar-semanal/index.tsx y otros.
 */
function mostrarAlerta(titulo: string, mensaje: string): void {
  if (Platform.OS === "web") {
    alert(titulo ? `${titulo}\n\n${mensaje}` : mensaje);
  } else {
    Alert.alert(titulo, mensaje);
  }
}

/** Las 5 fases oficiales del formato "Proyecto Interdisciplinar para la Evaluación Sumativa". */
const FASES_PROYECTO: { key: FaseProyecto; label: string }[] = FASES_OFICIALES.map((f) => ({
  key: f.key,
  label: f.corto,
}));

/**
 * Subniveles con destrezas organizadas por área (Elemental..Bachillerato).
 * Preparatoria/Inicial usan ámbitos de desarrollo, una estructura distinta
 * que no encaja en el modelo "un elemento curricular por área" de este
 * módulo — quedan fuera de alcance (ver openspec/changes/proyecto-interdisciplinar/tasks.md).
 */
const SUBNIVELES_CON_AREAS: Subnivel[] = [2, 3, 4, 5];

/** Mismo patrón local que app/planificacion-anual/index.tsx (constante duplicada por pantalla). */
const GRADOS_POR_SUBNIVEL: Record<number, string[]> = {
  2: ["2.° EGB", "3.° EGB", "4.° EGB"],
  3: ["5.° EGB", "6.° EGB", "7.° EGB"],
  4: ["8.° EGB", "9.° EGB", "10.° EGB"],
  5: ["1.° BGU", "2.° BGU", "3.° BGU"],
};

/** Niveles compartidos por las 7 materias base del catálogo de competencias (excluye electivas de BGU como Biología/Química/Física). */
const NIVELES_COMPETENCIAS: string[] = ["ELEMENTAL", "MEDIA", "SUPERIOR", "BACHILLERATO"];

/** Grados disponibles para un nivel de competencias, cruzando todas las materias base. */
function gradosDeNivelCompetencias(nivel: string): string[] {
  const grados: string[] = [];
  for (const m of MATERIAS_EGB_BGU) {
    for (const g of gradosDeNivel(m.id, nivel)) {
      if (!grados.includes(g)) grados.push(g);
    }
  }
  return grados;
}

interface ElementoCatalogo {
  codigo: string;
  descripcion: string;
  area: string;
  nombreArea: string;
}

/** Elementos curriculares disponibles para el nivel/grado elegido, de TODAS las áreas de ese nivel (destrezas). */
function elementosDisponiblesDestrezas(subnivel: Subnivel): ElementoCatalogo[] {
  const areas = AREAS_POR_SUBNIVEL[subnivel] ?? [];
  const out: ElementoCatalogo[] = [];
  for (const area of areas) {
    for (const d of filtrarPorAreaYSubnivel(area, subnivel)) {
      out.push({ codigo: d.codigo, descripcion: d.descripcion, area, nombreArea: AREAS_INFO[area]?.name || area });
    }
  }
  return out;
}

/** Elementos curriculares disponibles para el nivel/grado elegido, de TODAS las materias (competencias). */
function elementosDisponiblesCompetencias(nivel: string, grado: string): ElementoCatalogo[] {
  const out: ElementoCatalogo[] = [];
  for (const m of MATERIAS_EGB_BGU) {
    for (const c of competenciasDeGrado(m.id, nivel, grado)) {
      out.push({ codigo: c.codigo, descripcion: c.descripcion, area: m.id, nombreArea: m.nombre });
    }
  }
  return out;
}

/** Resuelve la descripción de un código contra el catálogo VIGENTE (nunca se copia al guardar). */
function descripcionDeElemento(baseCurricular: BaseCurricular, codigo: string): string | null {
  if (baseCurricular === "destrezas") {
    return buscarPorCodigo(codigo)?.descripcion ?? null;
  }
  return buscarCompetenciaEspecificaEGBBGU(codigo)?.descripcion ?? null;
}

interface ElementoEnEdicion {
  codigo: string;
  area: string;
  nombreArea: string;
}

interface ActividadEnEdicion {
  id: string;
  fase: FaseProyecto;
  actividad: string;
  recursos: string;
  evidencia: string;
  evaluacion: string;
  instrumentoEvaluacion?: string;
  criteriosVinculados?: string[];
}

/** Bloque de una fase dentro del plan de una asignatura (sección del formato oficial). */
interface FaseAreaEdicion {
  fase: FaseProyecto;
  semana: string;
  preguntaOrientadora: string;
  /** Una actividad por línea. */
  actividades: string;
  /** Un recurso por línea. */
  recursos: string;
}

/** Plan de una asignatura dentro del proyecto. */
interface DetalleAreaEdicion {
  areaId: string;
  fases: FaseAreaEdicion[];
}

/** Fila del cronograma día a día (formato oficial). */
interface DiaEdicion {
  id: string;
  fase: FaseProyecto;
  dia: string;
  fecha: string;
  actividad: string;
  productoDiario: string;
}

/** Las 5 fases oficiales vacías, para crear el plan de una asignatura. */
function fasesVaciasParaArea(): FaseAreaEdicion[] {
  return FASES_OFICIALES.map((f) => ({
    fase: f.key,
    semana: "",
    preguntaOrientadora: "",
    actividades: "",
    recursos: "",
  }));
}

function diaVacio(fase: FaseProyecto = "planificacion"): DiaEdicion {
  return { id: generarIdLocal("dia"), fase, dia: "", fecha: "", actividad: "", productoDiario: "" };
}

/** Convierte el array de un string multi-línea en lista limpia. */
function lineasATexto(items: string[] | undefined): string {
  return (items ?? []).join("\n");
}

/**
 * Año lectivo ecuatoriano vigente: el ciclo va de agosto a julio, así que
 * desde agosto el año lectivo termina en el año siguiente (ago/2026 → 2026–2027).
 */
function anioLectivoActual(hoy: Date = new Date()): string {
  const anio = hoy.getFullYear();
  const inicio = hoy.getMonth() >= 7 ? anio : anio - 1;
  return `${inicio}–${inicio + 1}`;
}

/** Duraciones predefinidas del selector; cualquier otra se escribe en "Otro…". */
const DURACIONES_PREDEFINIDAS = ["1 semana", "2 semanas", "3 semanas", "4 semanas"];

export default function ProyectoInterdisciplinarWizardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id, baseCurricular: baseCurricularParam } = useLocalSearchParams<{
    id?: string;
    baseCurricular?: string;
  }>();
  const isEdit = !!id;
  const [cargando, setCargando] = useState(isEdit);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    getSessionId().then(setSessionId);
  }, []);

  const [baseCurricular, setBaseCurricular] = useState<BaseCurricular>(
    baseCurricularParam === "competencias" ? "competencias" : "destrezas"
  );

  // ── Contexto curricular (nivel/grado únicos para todo el proyecto) ──
  const [subnivelDestrezas, setSubnivelDestrezas] = useState<Subnivel>(2);
  const [gradoDestrezas, setGradoDestrezas] = useState(GRADOS_POR_SUBNIVEL[2][0]);
  const [nivelCompetencias, setNivelCompetencias] = useState(NIVELES_COMPETENCIAS[0]);
  const [gradoCompetencias, setGradoCompetencias] = useState("");

  useEffect(() => {
    setGradoDestrezas((prev) =>
      GRADOS_POR_SUBNIVEL[subnivelDestrezas].includes(prev) ? prev : GRADOS_POR_SUBNIVEL[subnivelDestrezas][0]
    );
  }, [subnivelDestrezas]);

  useEffect(() => {
    const grados = gradosDeNivelCompetencias(nivelCompetencias);
    setGradoCompetencias((prev) => (grados.includes(prev) ? prev : grados[0] || ""));
  }, [nivelCompetencias]);

  const nivelLabel = baseCurricular === "destrezas" ? SUBNIVEL_NAMES[subnivelDestrezas] : nivelCompetencias;
  const gradoLabel = baseCurricular === "destrezas" ? gradoDestrezas : gradoCompetencias;
  const elementosDisponibles =
    baseCurricular === "destrezas"
      ? elementosDisponiblesDestrezas(subnivelDestrezas)
      : elementosDisponiblesCompetencias(nivelCompetencias, gradoCompetencias);

  // Al cambiar nivel/grado a mano, se quitan los elementos ya elegidos que no
  // pertenecen al nuevo nivel (si no, el documento mezclaba, p. ej., una
  // destreza de Superior con un curso de Media). No corre al precargar un
  // proyecto guardado: solo después de que el usuario toca el contexto.
  const contextoCambiadoPorUsuario = useRef(false);
  const cambiarContexto = <T,>(setter: (v: T) => void) => (v: T) => {
    contextoCambiadoPorUsuario.current = true;
    setter(v);
  };

  // ── Datos del proyecto ──
  const [titulo, setTitulo] = useState("");
  const [contexto, setContexto] = useState("");
  const [preguntaGuia, setPreguntaGuia] = useState("");
  const [productoFinal, setProductoFinal] = useState("");
  const [duracion, setDuracion] = useState("");
  // true cuando la duración no está en el selector ("Otro…") y se escribe a mano.
  const [duracionOtra, setDuracionOtra] = useState(false);
  const [institucion, setInstitucion] = useState("");
  const [docentesTexto, setDocentesTexto] = useState("");

  // ── Datos informativos del formato oficial ──
  const [anioLectivo, setAnioLectivo] = useState(anioLectivoActual);
  const [trimestre, setTrimestre] = useState("1");
  const [paralelo, setParalelo] = useState("");

  // ── Sección por asignatura (formato oficial) ──
  const [detalleAreas, setDetalleAreas] = useState<DetalleAreaEdicion[]>([]);
  const [areaDetalleAbierta, setAreaDetalleAbierta] = useState<string | null>(null);

  // ── Planificación día a día (formato oficial) ──
  const [diaPorDia, setDiaPorDia] = useState<DiaEdicion[]>([]);

  // ── Rúbricas del formato oficial (disciplinar e interdisciplinar) ──
  const [rubricaDisciplinar, setRubricaDisciplinar] = useState<RubricaProyecto | null>(null);
  const [rubricaInterdisciplinar, setRubricaInterdisciplinar] = useState<RubricaProyecto | null>(null);

  // ── Competencias/destrezas de varias áreas ──
  const [elementos, setElementos] = useState<ElementoEnEdicion[]>([]);
  const [busquedaElemento, setBusquedaElemento] = useState("");
  const areasUnicas = new Set(elementos.map((e) => e.area)).size;

  useEffect(() => {
    if (!contextoCambiadoPorUsuario.current) return;
    const vigentes = new Set(elementosDisponibles.map((e) => e.codigo));
    const validos = elementos.filter((e) => vigentes.has(e.codigo));
    if (validos.length !== elementos.length) {
      const quitados = elementos.length - validos.length;
      setElementos(validos);
      mostrarAlerta(
        "Elementos quitados",
        `Se quitaron ${quitados} elemento(s) curricular(es) que no pertenecen al nivel/grado elegido. Vuelve a elegirlos del nuevo nivel.`
      );
    }
  }, [baseCurricular, subnivelDestrezas, gradoDestrezas, nivelCompetencias, gradoCompetencias]);

  const toggleElemento = (e: ElementoCatalogo) => {
    setElementos((prev) => {
      const yaSeleccionado = prev.some((s) => s.codigo === e.codigo);
      if (yaSeleccionado) return prev.filter((s) => s.codigo !== e.codigo);
      return [...prev, { codigo: e.codigo, area: e.area, nombreArea: e.nombreArea }];
    });
  };

  // ── Resultado generado (objetivo, actividades, evaluación) ──
  const [objetivoGeneral, setObjetivoGeneral] = useState("");
  const [evaluacionGeneral, setEvaluacionGeneral] = useState("");
  const [actividades, setActividades] = useState<ActividadEnEdicion[]>([]);
  const generado = actividades.length > 0;

  const actualizarInstrumentoActividad = (actividadId: string, instrumento: string) => {
    setActividades((prev) => prev.map((a) => (a.id === actividadId ? { ...a, instrumentoEvaluacion: instrumento } : a)));
  };

  const toggleCriterioVinculado = (actividadId: string, codigo: string) => {
    setActividades((prev) =>
      prev.map((a) => {
        if (a.id !== actividadId) return a;
        const actuales = a.criteriosVinculados || [];
        const yaVinculado = actuales.includes(codigo);
        return { ...a, criteriosVinculados: yaVinculado ? actuales.filter((c) => c !== codigo) : [...actuales, codigo] };
      })
    );
  };

  // ── Cargar datos existentes (modo edición) ──
  const { data: proyectoExistente } = trpc.proyectoInterdisciplinar.getById.useQuery(
    { id: Number(id) },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (proyectoExistente?.formData) {
      const fd = proyectoExistente.formData;
      setBaseCurricular(fd.baseCurricular);
      setTitulo(fd.titulo || "");
      setContexto(fd.contexto || "");
      setPreguntaGuia(fd.preguntaGuia || "");
      setProductoFinal(fd.productoFinal || "");
      setDuracion(fd.duracion || "");
      setDuracionOtra(!!fd.duracion && !DURACIONES_PREDEFINIDAS.includes(fd.duracion));
      setObjetivoGeneral(fd.objetivoGeneral || "");
      setEvaluacionGeneral(fd.evaluacionGeneral || "");
      setInstitucion(fd.institucion || "");
      setDocentesTexto((fd.docentesParticipantes || []).join("\n"));
      // El año lectivo se muestra siempre como el vigente (campo deshabilitado).
      setAnioLectivo(anioLectivoActual());
      setTrimestre(fd.trimestre || "1");
      setParalelo(fd.paralelo || "");
      setDetalleAreas(
        (fd.detalleAreas || [])
          .filter((d) => d.areaProyectoId)
          .map((d) => ({
            areaId: d.areaProyectoId,
            fases: FASES_OFICIALES.map((f) => {
              const bloque = (d.fases || []).find((b) => normalizarFase(b.fase) === f.key);
              return {
                fase: f.key,
                semana: bloque?.semana || "",
                preguntaOrientadora: bloque?.preguntaOrientadora || "",
                actividades: lineasATexto(bloque?.actividades),
                recursos: lineasATexto(bloque?.recursos),
              };
            }),
          }))
      );
      setDiaPorDia(
        (fd.diaPorDia || []).map((d) => ({
          id: generarIdLocal("dia"),
          fase: normalizarFase(d.fase),
          dia: d.dia || "",
          fecha: d.fecha || "",
          actividad: d.actividad || "",
          productoDiario: d.productoDiario || "",
        }))
      );
      setRubricaDisciplinar(fd.rubricaDisciplinar?.criterios?.length ? fd.rubricaDisciplinar : null);
      setRubricaInterdisciplinar(fd.rubricaInterdisciplinar?.criterios?.length ? fd.rubricaInterdisciplinar : null);
      const primeraArea = fd.areas?.[0];
      if (primeraArea) {
        if (fd.baseCurricular === "destrezas") {
          const entry = (Object.entries(SUBNIVEL_NAMES) as [string, string][]).find(([, label]) => label === primeraArea.nivel);
          if (entry) setSubnivelDestrezas(Number(entry[0]) as Subnivel);
          setGradoDestrezas(primeraArea.grado);
        } else {
          setNivelCompetencias(primeraArea.nivel);
          setGradoCompetencias(primeraArea.grado);
        }
      }
      setElementos(
        (fd.elementosCurriculares || []).map((e) => ({
          codigo: e.codigo,
          area: e.area,
          nombreArea: fd.areas?.find((a) => a.id === e.areaProyectoId)?.nombreArea || e.area,
        }))
      );
      setActividades(
        (fd.actividades || []).map((a) => ({
          id: a.id,
          fase: a.fase,
          actividad: a.actividad,
          recursos: a.recursos,
          evidencia: a.evidencia,
          evaluacion: a.evaluacion,
          instrumentoEvaluacion: a.instrumentoEvaluacion,
          criteriosVinculados: a.criteriosVinculados,
        }))
      );
      setCargando(false);
    }
  }, [proyectoExistente]);

  // ── Construir payload y guardar ──
  const utils = trpc.useContext();
  const [generando, setGenerando] = useState(false);

  const construirAreas = () => {
    const areasPorCodigo = new Map<string, { id: string; areaId: string; nombreArea: string }>();
    for (const e of elementos) {
      if (!areasPorCodigo.has(e.area)) {
        areasPorCodigo.set(e.area, { id: e.area, areaId: e.area, nombreArea: e.nombreArea });
      }
    }
    return Array.from(areasPorCodigo.values()).map((a) => ({
      id: a.id,
      areaId: a.areaId,
      nombreArea: a.nombreArea,
      nivel: nivelLabel,
      subnivel: baseCurricular === "destrezas" ? nivelLabel : undefined,
      grado: gradoLabel,
    }));
  };

  /** Sección por asignatura del formato oficial → payload del servidor. */
  const construirDetalleAreasPayload = (fuente: DetalleAreaEdicion[] = detalleAreas) =>
    fuente
      .map((d) => ({
        areaProyectoId: d.areaId,
        fases: d.fases
          .filter((f) => f.actividades.trim() || f.recursos.trim() || f.semana.trim() || f.preguntaOrientadora.trim())
          .map((f) => ({
            fase: f.fase,
            semana: f.semana.trim() || undefined,
            preguntaOrientadora: f.preguntaOrientadora.trim() || undefined,
            actividades: f.actividades.split("\n").map((t) => t.trim()).filter(Boolean),
            recursos: f.recursos.split("\n").map((t) => t.trim()).filter(Boolean),
          })),
      }))
      .filter((d) => d.fases.length > 0);

  /** Cronograma día a día del formato oficial → payload del servidor. */
  const construirDiaPorDiaPayload = (fuente: DiaEdicion[] = diaPorDia) =>
    fuente
      .filter((d) => d.actividad.trim() || d.productoDiario.trim())
      .map((d) => ({
        fase: d.fase,
        dia: d.dia.trim() || undefined,
        fecha: d.fecha.trim() || undefined,
        actividad: d.actividad.trim() || undefined,
        productoDiario: d.productoDiario.trim() || undefined,
      }));

  const construirPayload = () => ({
    sessionId,
    baseCurricular,
    titulo: titulo.trim() || undefined,
    contexto: contexto.trim() || undefined,
    preguntaGuia: preguntaGuia.trim() || undefined,
    objetivoGeneral: objetivoGeneral.trim() || undefined,
    productoFinal: productoFinal.trim() || undefined,
    duracion: duracion.trim() || undefined,
    anioLectivo: anioLectivo.trim() || undefined,
    trimestre: trimestre.trim() || undefined,
    paralelo: paralelo.trim() || undefined,
    areas: construirAreas(),
    elementosCurriculares: elementos.map((e) => ({ areaProyectoId: e.area, codigo: e.codigo })),
    actividades: actividades.map((a) => ({
      id: a.id,
      fase: a.fase,
      actividad: a.actividad,
      recursos: a.recursos,
      evidencia: a.evidencia,
      evaluacion: a.evaluacion,
      instrumentoEvaluacion: a.instrumentoEvaluacion,
      criteriosVinculados: a.criteriosVinculados,
    })),
    detalleAreas: construirDetalleAreasPayload(),
    diaPorDia: construirDiaPorDiaPayload(),
    rubricaDisciplinar: rubricaDisciplinar?.criterios.length ? rubricaDisciplinar : undefined,
    rubricaInterdisciplinar: rubricaInterdisciplinar?.criterios.length ? rubricaInterdisciplinar : undefined,
    evaluacionGeneral: evaluacionGeneral.trim() || undefined,
    institucion: institucion.trim() || undefined,
    docentesParticipantes: docentesTexto.split("\n").map((t) => t.trim()).filter(Boolean),
  });

  const createMutation = trpc.proyectoInterdisciplinar.create.useMutation({
    onSuccess: (data) => {
      utils.proyectoInterdisciplinar.list.invalidate();
      if (data?.id) {
        router.replace(`/proyecto-interdisciplinar/wizard?id=${data.id}` as any);
      }
    },
    onError: (err) => {
      if (!generando) mostrarAlerta("Error", err.message || "No se pudo guardar el proyecto.");
    },
  });

  const updateMutation = trpc.proyectoInterdisciplinar.update.useMutation({
    onSuccess: () => {
      utils.proyectoInterdisciplinar.list.invalidate();
      if (!generando) mostrarAlerta("Guardado", "Los cambios se guardaron correctamente.");
    },
    onError: (err) => {
      if (!generando) mostrarAlerta("Error", err.message || "No se pudo guardar el proyecto.");
    },
  });

  const updateStatusMutation = trpc.proyectoInterdisciplinar.updateStatus.useMutation();

  const generarCompletoMutation = trpc.proyectoInterdisciplinar.generarProyectoCompleto.useMutation({
    onError: (err) => {
      mostrarAlerta("No se pudo generar", err.message || "Intenta de nuevo.");
    },
  });

  const sugerirMutation = trpc.proyectoInterdisciplinar.sugerirProyecto.useMutation({
    onError: (err) => {
      mostrarAlerta("No se pudo sugerir", err.message || "Intenta de nuevo.");
    },
  });

  const sugerirInstrumentosMutation = trpc.proyectoInterdisciplinar.sugerirInstrumentosEvaluacion.useMutation({
    onError: (err) => {
      mostrarAlerta("No se pudo sugerir", err.message || "Intenta de nuevo.");
    },
  });
  // Actividades cuyo instrumento se está pidiendo a la IA (una o todas).
  const [instrumentoCargandoIds, setInstrumentoCargandoIds] = useState<string[]>([]);

  /**
   * Pide a la IA un instrumento de evaluación para las actividades indicadas,
   * alineado a las destrezas/competencias elegidas. Los criterios vinculados
   * solo se rellenan si la actividad todavía no tiene ninguno.
   */
  const handleSugerirInstrumentos = (ids: string[]) => {
    const objetivo = actividades.filter((a) => ids.includes(a.id));
    if (objetivo.length === 0) return;
    setInstrumentoCargandoIds((prev) => Array.from(new Set([...prev, ...ids])));
    sugerirInstrumentosMutation.mutate(
      {
        baseCurricular,
        titulo: titulo.trim() || undefined,
        productoFinal: productoFinal.trim() || undefined,
        elementosCurriculares: elementos.map((e) => ({
          codigo: e.codigo,
          nombreArea: e.nombreArea,
          descripcion: descripcionDeElemento(baseCurricular, e.codigo) || undefined,
        })),
        actividades: objetivo.map((a) => ({
          id: a.id,
          fase: a.fase,
          actividad: a.actividad,
          evidencia: a.evidencia || undefined,
          evaluacion: a.evaluacion || undefined,
        })),
      },
      {
        onSuccess: (r) => {
          setActividades((prev) =>
            prev.map((a) => {
              const sugerido = (r.instrumentos as Array<{ id: string; instrumento: string; criteriosVinculados: string[] }>).find((i) => i.id === a.id);
              if (!sugerido) return a;
              const sinCriterios = !a.criteriosVinculados || a.criteriosVinculados.length === 0;
              return {
                ...a,
                instrumentoEvaluacion: sugerido.instrumento,
                criteriosVinculados: sinCriterios ? sugerido.criteriosVinculados : a.criteriosVinculados,
              };
            })
          );
        },
        onSettled: () => setInstrumentoCargandoIds((prev) => prev.filter((x) => !ids.includes(x))),
      }
    );
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || generarCompletoMutation.isPending || generando;

  const handleGuardarBorrador = () => {
    if (!sessionId) return;
    const payload = construirPayload();
    if (isEdit) {
      updateMutation.mutate({ ...payload, id: Number(id) });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleSugerirTitulo = () => {
    sugerirMutation.mutate(
      {
        baseCurricular,
        areas: construirAreas().map((a) => ({ nombreArea: a.nombreArea, nivel: a.nivel, grado: a.grado })),
        elementosCurriculares: elementos.map((e) => ({
          codigo: e.codigo,
          descripcion: descripcionDeElemento(baseCurricular, e.codigo) || undefined,
        })),
        campos: ["titulo"],
      },
      { onSuccess: (r) => r.titulo && !titulo.trim() && setTitulo(r.titulo) }
    );
  };

  /**
   * Acción única "Generar planificación": valida el mínimo (≥2 elementos de
   * ≥2 áreas distintas), pide a la IA que complete contexto/pregunta
   * guía/objetivo/producto/actividades/evaluación a partir de lo ya
   * seleccionado, guarda el proyecto y lo marca como generado.
   */
  const handleGenerar = async () => {
    if (!sessionId) return;
    if (elementos.length < 2 || areasUnicas < 2) {
      mostrarAlerta(
        "Faltan competencias",
        "Elige al menos dos elementos curriculares de al menos dos áreas distintas antes de generar."
      );
      return;
    }
    if (!duracion.trim() || !institucion.trim()) {
      mostrarAlerta(
        "Faltan datos",
        "Completa la duración y la institución antes de generar (son obligatorias para marcar el proyecto como generado)."
      );
      return;
    }
    setGenerando(true);
    try {
      const resultado = await generarCompletoMutation.mutateAsync({
        baseCurricular,
        titulo: titulo.trim() || undefined,
        contexto: contexto.trim() || undefined,
        preguntaGuia: preguntaGuia.trim() || undefined,
        productoFinal: productoFinal.trim() || undefined,
        elementosCurriculares: elementos.map((e) => ({
          codigo: e.codigo,
          area: e.area,
          nombreArea: e.nombreArea,
          descripcion: descripcionDeElemento(baseCurricular, e.codigo) || undefined,
        })),
      });

      const nuevoTitulo = titulo.trim() || resultado.titulo || "";
      const nuevoContexto = contexto.trim() || resultado.contexto || "";
      const nuevaPreguntaGuia = preguntaGuia.trim() || resultado.preguntaGuia || "";
      const nuevoProducto = productoFinal.trim() || resultado.productoFinal || "";
      const nuevasActividades: ActividadEnEdicion[] = resultado.actividades.map((a: {
        fase: FaseProyecto;
        actividad: string;
        recursos: string;
        evidencia: string;
        evaluacion: string;
        instrumentoEvaluacion?: string;
      }) => ({
        id: generarIdLocal("actividad"),
        fase: a.fase,
        actividad: a.actividad,
        recursos: a.recursos,
        evidencia: a.evidencia,
        evaluacion: a.evaluacion,
        instrumentoEvaluacion: a.instrumentoEvaluacion,
      }));

      setTitulo(nuevoTitulo);
      setContexto(nuevoContexto);
      setPreguntaGuia(nuevaPreguntaGuia);
      setProductoFinal(nuevoProducto);
      setObjetivoGeneral(resultado.objetivoGeneral);
      setEvaluacionGeneral(resultado.evaluacionGeneral);
      setActividades(nuevasActividades);

      // Sección por asignatura devuelta por la IA (solo si trae contenido);
      // si no, se conserva la que el docente haya escrito a mano.
      const detalleResultado: DetalleAreaEdicion[] = (resultado.detalleAreas || []).map((d: {
        areaId: string;
        fases?: { fase: FaseProyecto; semana?: string; actividades?: string[]; recursos?: string[] }[];
      }) => ({
        areaId: d.areaId,
        fases: FASES_OFICIALES.map((f) => {
          const bloque = (d.fases || []).find((b) => normalizarFase(b.fase) === f.key);
          return {
            fase: f.key,
            semana: bloque?.semana || "",
            preguntaOrientadora: "",
            actividades: lineasATexto(bloque?.actividades),
            recursos: lineasATexto(bloque?.recursos),
          };
        }),
      }));
      const detalleFinal = detalleResultado.length ? detalleResultado : detalleAreas;
      setDetalleAreas(detalleFinal);

      // Las rúbricas usan las plantillas oficiales por defecto si el docente
      // todavía no incluyó las suyas (no las genera la IA: así se garantiza
      // la fidelidad al formato oficial).
      const rubricaDiscFinal = rubricaDisciplinar ?? rubricaDisciplinarPorDefecto();
      const rubricaInterFinal = rubricaInterdisciplinar ?? rubricaInterdisciplinarPorDefecto();
      setRubricaDisciplinar(rubricaDiscFinal);
      setRubricaInterdisciplinar(rubricaInterFinal);

      const payload = {
        sessionId,
        baseCurricular,
        titulo: nuevoTitulo || undefined,
        contexto: nuevoContexto || undefined,
        preguntaGuia: nuevaPreguntaGuia || undefined,
        objetivoGeneral: resultado.objetivoGeneral || undefined,
        productoFinal: nuevoProducto || undefined,
        duracion: duracion.trim() || undefined,
        anioLectivo: anioLectivo.trim() || undefined,
        trimestre: trimestre.trim() || undefined,
        paralelo: paralelo.trim() || undefined,
        areas: construirAreas(),
        elementosCurriculares: elementos.map((e) => ({ areaProyectoId: e.area, codigo: e.codigo })),
        actividades: nuevasActividades.map((a) => ({
          id: a.id,
          fase: a.fase,
          actividad: a.actividad,
          recursos: a.recursos,
          evidencia: a.evidencia,
          evaluacion: a.evaluacion,
          instrumentoEvaluacion: a.instrumentoEvaluacion,
        })),
        detalleAreas: construirDetalleAreasPayload(detalleFinal),
        diaPorDia: construirDiaPorDiaPayload(),
        rubricaDisciplinar: rubricaDiscFinal,
        rubricaInterdisciplinar: rubricaInterFinal,
        evaluacionGeneral: resultado.evaluacionGeneral || undefined,
        institucion: institucion.trim() || undefined,
        docentesParticipantes: docentesTexto.split("\n").map((t) => t.trim()).filter(Boolean),
      };

      let projectId = isEdit ? Number(id) : undefined;
      if (projectId) {
        await updateMutation.mutateAsync({ ...payload, id: projectId });
      } else {
        const creado = await createMutation.mutateAsync(payload);
        projectId = creado?.id;
      }
      if (!projectId) throw new Error("No se pudo guardar el proyecto generado.");
      await updateStatusMutation.mutateAsync({ id: projectId, estado: "generado" });

      if (!isEdit && projectId) {
        router.replace(`/proyecto-interdisciplinar/wizard?id=${projectId}` as any);
      }
      mostrarAlerta("Proyecto generado", "La IA completó el proyecto. Puedes editar cualquier campo antes de exportar.");
    } catch (err: any) {
      mostrarAlerta("No se pudo generar", err.message || "Intenta de nuevo.");
    } finally {
      setGenerando(false);
    }
  };

  // ── Exportación ──
  const exportWordMutation = trpc.proyectoInterdisciplinar.exportWord.useMutation({
    onSuccess: (data) => {
      try {
        const binary = atob(data.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        mostrarAlerta("Error", "No se pudo descargar el archivo Word.");
      }
    },
    onError: () => mostrarAlerta("Error", "No se pudo generar el documento Word. Intenta de nuevo."),
  });

  const exportPdfMutation = trpc.proyectoInterdisciplinar.exportPdf.useMutation({
    onSuccess: (data) => {
      try {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(data.html);
          win.document.close();
          setTimeout(() => win.print(), 300);
        } else {
          mostrarAlerta("Aviso", "Se abrió una nueva ventana con el PDF. Si no lo ves, revisa el bloqueador de pop-ups.");
        }
      } catch {
        mostrarAlerta("Error", "No se pudo abrir el PDF. Intenta de nuevo.");
      }
    },
    onError: () => mostrarAlerta("Error", "No se pudo generar el PDF. Intenta de nuevo."),
  });

  // ── Render helpers ──
  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { placeholder?: string; multiline?: boolean; helper?: string; onSugerir?: () => void; sugerirCargando?: boolean; disabled?: boolean } = {}
  ) => (
    <View style={styles.fieldGroup}>
      {opts.onSugerir ? (
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: colors.muted, marginBottom: 0 }]}>{label}</Text>
          <Pressable onPress={opts.onSugerir} disabled={opts.sugerirCargando} style={[styles.sugerirBtn, { opacity: opts.sugerirCargando ? 0.5 : 1 }]}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
              {opts.sugerirCargando ? "Pensando…" : "✨ Sugerir con IA"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      )}
      {opts.helper && <Text style={[styles.helperText, { color: colors.muted }]}>{opts.helper}</Text>}
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={!opts.disabled}
        placeholder={opts.placeholder || label}
        placeholderTextColor={colors.muted + "80"}
        multiline={opts.multiline}
        numberOfLines={opts.multiline ? 4 : 1}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
            textAlignVertical: opts.multiline ? "top" : "center",
            minHeight: opts.multiline ? 80 : 44,
            opacity: opts.disabled ? 0.65 : 1,
          },
        ]}
      />
    </View>
  );

  const renderSelectChips = <T extends string | number>(
    label: string,
    value: T,
    options: { value: T; label: string }[],
    onChange: (v: T) => void
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View style={styles.selectRow}>
        {options.map((opt) => (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            style={[styles.selectChip, { backgroundColor: value === opt.value ? colors.primary : colors.surface, borderColor: colors.border }]}
          >
            <Text style={{ color: value === opt.value ? "#fff" : colors.foreground, fontSize: 13 }}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const elementosFiltrados = (() => {
    const q = busquedaElemento.trim().toLowerCase();
    if (!q) return elementosDisponibles.slice(0, 60);
    return elementosDisponibles
      .filter((e) => e.codigo.toLowerCase().includes(q) || e.descripcion.toLowerCase().includes(q) || e.nombreArea.toLowerCase().includes(q))
      .slice(0, 60);
  })();
  const codigosSeleccionados = new Set(elementos.map((e) => e.codigo));

  if (cargando) {
    return (
      <ScreenContainer className="flex-1">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 8 }}>Cargando proyecto...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-base text-muted">
            {isEdit ? "Editar Proyecto Interdisciplinar" : "Nuevo Proyecto Interdisciplinar"}
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {baseCurricular === "destrezas" ? "Base: Destrezas con criterios de desempeño" : "Base: Competencias específicas (CNC)"}
          </Text>
          <Text className="text-sm text-muted mt-1">
            Integra varias áreas alrededor de un producto final común. Elige el nivel/grado y al menos dos
            elementos curriculares de áreas distintas; la IA arma el resto.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ── Contexto curricular ── */}
          {renderSectionHeader("Contexto curricular", "📚")}
          {baseCurricular === "destrezas" ? (
            <>
              {renderSelectChips(
                "Subnivel",
                subnivelDestrezas,
                SUBNIVELES_CON_AREAS.map((s) => ({ value: s, label: SUBNIVEL_NAMES[s] })),
                cambiarContexto(setSubnivelDestrezas)
              )}
              {renderSelectChips(
                "Grado",
                gradoDestrezas,
                GRADOS_POR_SUBNIVEL[subnivelDestrezas].map((g) => ({ value: g, label: g })),
                cambiarContexto(setGradoDestrezas)
              )}
            </>
          ) : (
            <>
              {renderSelectChips(
                "Nivel",
                nivelCompetencias,
                NIVELES_COMPETENCIAS.map((n) => ({ value: n, label: n })),
                cambiarContexto(setNivelCompetencias)
              )}
              {renderSelectChips(
                "Grado",
                gradoCompetencias,
                gradosDeNivelCompetencias(nivelCompetencias).map((g) => ({ value: g, label: g })),
                cambiarContexto(setGradoCompetencias)
              )}
            </>
          )}

          {/* ── Datos del proyecto ── */}
          {renderSectionHeader("Proyecto", "📝")}
          {renderField("Nombre del proyecto", titulo, setTitulo, {
            placeholder: "Ej. Guardianes del patrimonio natural y cultural",
            onSugerir: handleSugerirTitulo,
            sugerirCargando: sugerirMutation.isPending,
          })}
          {renderField("Descripción preliminar", contexto, setContexto, {
            multiline: true,
            placeholder: "Opcional. Descripción breve del proyecto; la IA la completa.",
          })}
          {renderField("Desafío / pregunta guía", preguntaGuia, setPreguntaGuia, {
            multiline: true,
            placeholder: "Opcional. Si lo dejas vacío, la IA propone el desafío.",
            helper: "Propuesto para UX — no confirmado como campo oficial del instructivo.",
          })}
          {renderField("Producto preferido", productoFinal, setProductoFinal, {
            placeholder: "Opcional. Ej. Stand, dossier, podcast...",
          })}
          {renderSelectChips(
            "Duración",
            duracionOtra ? "__otro" : duracion,
            [
              ...DURACIONES_PREDEFINIDAS.map((d) => ({ value: d, label: d })),
              { value: "__otro", label: "Otro…" },
            ],
            (v) => {
              if (v === "__otro") {
                setDuracionOtra(true);
                setDuracion("");
              } else {
                setDuracionOtra(false);
                setDuracion(v);
              }
            }
          )}
          {duracionOtra &&
            renderField("Duración (personalizada)", duracion, setDuracion, {
              placeholder: "Ej. 6 semanas, 1 trimestre...",
            })}

          {/* ── Información institucional ── */}
          {renderSectionHeader("Información institucional", "🏫")}
          {renderField("Institución", institucion, setInstitucion, { placeholder: "Nombre de la unidad educativa" })}
          {renderField("Año lectivo", anioLectivo, setAnioLectivo, {
            disabled: true,
            helper: "Se completa automáticamente con el año lectivo vigente.",
          })}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              {renderSelectChips(
                "Trimestre",
                trimestre,
                [
                  { value: "1", label: "1.er trimestre" },
                  { value: "2", label: "2.º trimestre" },
                  { value: "3", label: "3.er trimestre" },
                  ...(trimestre.trim() && !["1", "2", "3"].includes(trimestre)
                    ? [{ value: trimestre, label: trimestre }]
                    : []),
                ],
                setTrimestre
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderField("Paralelo", paralelo, setParalelo, { placeholder: "Ej. A" })}
            </View>
          </View>
          {renderField("Docentes participantes (uno por línea)", docentesTexto, setDocentesTexto, {
            multiline: true,
            placeholder: "Un nombre por línea",
          })}

          {/* ── Competencias de varias asignaturas ── */}
          {renderSectionHeader("Competencias de varias asignaturas", "🧩")}
          <Text style={[styles.helperText, { color: colors.muted, marginBottom: 10 }]}>
            Elige al menos dos elementos de áreas distintas. La IA arma la matriz (actividades y evaluación) hacia un solo producto.
            {elementos.length > 0 ? ` ${elementos.length} seleccionada(s), ${areasUnicas} área(s).` : ""}
          </Text>

          {elementos.length > 0 && (
            <View style={styles.chipsWrap}>
              {elementos.map((e) => {
                const descripcion = descripcionDeElemento(baseCurricular, e.codigo);
                return (
                  <View key={e.codigo} style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}>
                    <Text style={[styles.chipCode, { color: "#4C1D95" }]}>{e.codigo}</Text>
                    <Text style={[styles.chipDesc, { color: "#6D28D9" }]} numberOfLines={1}>
                      {e.nombreArea}
                      {descripcion === null ? " · no encontrado en el catálogo actual" : ""}
                    </Text>
                    <Pressable onPress={() => setElementos((prev) => prev.filter((s) => s.codigo !== e.codigo))} hitSlop={6}>
                      <Text style={{ color: "#7C3AED", fontSize: 15, fontWeight: "700" }}>×</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          <TextInput
            value={busquedaElemento}
            onChangeText={setBusquedaElemento}
            placeholder="Buscar por código, área o texto..."
            placeholderTextColor={colors.muted + "80"}
            style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground, marginBottom: 8 }]}
          />
          <View style={[styles.listaContainer, { borderColor: colors.border }]}>
            {elementosFiltrados.length === 0 ? (
              <Text style={{ color: colors.muted, padding: 12, fontSize: 13 }}>
                No hay elementos curriculares para esta combinación de nivel/grado.
              </Text>
            ) : (
              <ScrollView style={{ maxHeight: 320 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
              {elementosFiltrados.map((e) => {
                const seleccionado = codigosSeleccionados.has(e.codigo);
                return (
                  <Pressable
                    key={e.codigo}
                    onPress={() => toggleElemento(e)}
                    style={[styles.listaItem, { borderBottomColor: colors.border, backgroundColor: seleccionado ? colors.primary + "10" : "transparent" }]}
                  >
                    <View style={[styles.checkbox, { borderColor: seleccionado ? colors.primary : colors.border, backgroundColor: seleccionado ? colors.primary : "transparent" }]}>
                      {seleccionado && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.listaCodigo, { color: colors.primary }]}>
                        {e.codigo} <Text style={{ color: colors.muted, fontWeight: "400" }}>· {e.nombreArea}</Text>
                      </Text>
                      <Text style={[styles.listaDesc, { color: colors.foreground }]} numberOfLines={2}>{e.descripcion}</Text>
                    </View>
                  </Pressable>
                );
              })}
              </ScrollView>
            )}
          </View>

          <View style={[styles.disclaimer, { borderColor: colors.border, marginTop: 20 }]}>
            <Text style={[styles.disclaimerText, { color: colors.muted }]}>
              Esta herramienta genera propuestas de planificación basadas en los lineamientos técnicos oficiales.
              Es responsabilidad del docente validar y ajustar el contenido conforme a las disposiciones de su
              institución educativa y distrito.
            </Text>
          </View>

          <Pressable
            onPress={handleGenerar}
            disabled={isPending || !sessionId}
            style={[styles.generarBtn, { backgroundColor: isPending || !sessionId ? colors.muted + "40" : colors.primary, marginTop: 16 }]}
          >
            {generando ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={{ color: "#fff", fontWeight: "700" }}>Generando…</Text>
              </View>
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>✨ Generar planificación</Text>
            )}
          </Pressable>

          {/* ── Formato oficial: plan por asignatura ── */}
          {renderSectionHeader("Plan por asignatura (formato oficial)", "🗂️")}
          <Text style={[styles.helperText, { color: colors.muted }]}>
            El formato oficial dedica una sección por asignatura con sus actividades y recursos por fase
            (Semana 1 y 2). Opcional: si lo dejas vacío, el documento solo muestra las fases generales.
          </Text>
          {construirAreas().length === 0 ? (
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              Selecciona al menos un elemento curricular para ver las asignaturas del proyecto.
            </Text>
          ) : (
            construirAreas().map((area) => {
              const detalle = detalleAreas.find((d) => d.areaId === area.id);
              const abierta = areaDetalleAbierta === area.id;
              return (
                <View key={area.id} style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 }]}>
                  <Pressable
                    onPress={() => setAreaDetalleAbierta(abierta ? null : area.id)}
                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <Text style={[styles.subSectionTitle, { color: colors.primary, marginTop: 0, marginBottom: 0 }]}>
                      {area.nombreArea}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 16 }}>{abierta ? "▾" : "▸"}</Text>
                  </Pressable>
                  {!abierta ? null : !detalle ? (
                    <Pressable
                      onPress={() => setDetalleAreas((prev) => [...prev, { areaId: area.id, fases: fasesVaciasParaArea() }])}
                      style={[styles.exportBtn, { backgroundColor: colors.primary, marginTop: 10 }]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>+ Agregar plan de esta asignatura</Text>
                    </Pressable>
                  ) : (
                    <View style={{ marginTop: 10 }}>
                      {detalle.fases.map((f) => (
                        <View key={f.fase} style={{ borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 8, marginBottom: 8 }}>
                          <Text style={[styles.fieldLabel, { color: colors.primary }]}>
                            {FASES_OFICIALES.find((x) => x.key === f.fase)?.label}
                          </Text>
                          {renderField("Semana (opcional)", f.semana, (v) =>
                            setDetalleAreas((prev) => prev.map((d) => d.areaId !== area.id ? d : { ...d, fases: d.fases.map((x) => x.fase === f.fase ? { ...x, semana: v } : x) }))
                          , { placeholder: "Ej. Semana 1" })}
                          {renderField("Pregunta orientadora (opcional)", f.preguntaOrientadora, (v) =>
                            setDetalleAreas((prev) => prev.map((d) => d.areaId !== area.id ? d : { ...d, fases: d.fases.map((x) => x.fase === f.fase ? { ...x, preguntaOrientadora: v } : x) }))
                          , { placeholder: "Ej. ¿Cómo representamos...?" })}
                          {renderField("Actividades (una por línea)", f.actividades, (v) =>
                            setDetalleAreas((prev) => prev.map((d) => d.areaId !== area.id ? d : { ...d, fases: d.fases.map((x) => x.fase === f.fase ? { ...x, actividades: v } : x) }))
                          , { multiline: true })}
                          {renderField("Recursos (uno por línea)", f.recursos, (v) =>
                            setDetalleAreas((prev) => prev.map((d) => d.areaId !== area.id ? d : { ...d, fases: d.fases.map((x) => x.fase === f.fase ? { ...x, recursos: v } : x) }))
                          , { multiline: true })}
                        </View>
                      ))}
                      <Pressable
                        onPress={() => setDetalleAreas((prev) => prev.filter((d) => d.areaId !== area.id))}
                        style={[styles.exportBtn, { backgroundColor: "#B91C1C", marginTop: 4 }]}
                      >
                        <Text style={{ color: "#fff", fontWeight: "700" }}>Quitar plan de esta asignatura</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {/* ── Formato oficial: planificación día a día ── */}
          {renderSectionHeader("Planificación día a día (formato oficial)", "📅")}
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Cronograma paso a paso: fase, día, fecha, actividad diaria y producto específico de cada día. Opcional.
          </Text>
          {diaPorDia.map((d, idx) => (
            <View key={d.id} style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={[styles.subSectionTitle, { color: colors.primary, marginTop: 0, marginBottom: 0 }]}>
                  Día {idx + 1}
                </Text>
                <Pressable onPress={() => setDiaPorDia((prev) => prev.filter((x) => x.id !== d.id))} hitSlop={8}>
                  <Text style={{ color: "#B91C1C", fontSize: 16, fontWeight: "700" }}>×</Text>
                </Pressable>
              </View>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Fase</Text>
              <View style={styles.selectRow}>
                {FASES_PROYECTO.map((f) => (
                  <Pressable
                    key={f.key}
                    onPress={() => setDiaPorDia((prev) => prev.map((x) => x.id === d.id ? { ...x, fase: f.key } : x))}
                    style={[styles.selectChip, { backgroundColor: d.fase === f.key ? colors.primary : "transparent", borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 6 }]}
                  >
                    <Text style={{ color: d.fase === f.key ? "#fff" : colors.foreground, fontSize: 11 }}>{f.label}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  {renderField("Día", d.dia, (v) => setDiaPorDia((prev) => prev.map((x) => x.id === d.id ? { ...x, dia: v } : x)), { placeholder: "Ej. Día 1" })}
                </View>
                <View style={{ flex: 1 }}>
                  {renderField("Fecha", d.fecha, (v) => setDiaPorDia((prev) => prev.map((x) => x.id === d.id ? { ...x, fecha: v } : x)), { placeholder: "Ej. Lunes" })}
                </View>
              </View>
              {renderField("Actividad diaria paso a paso", d.actividad, (v) => setDiaPorDia((prev) => prev.map((x) => x.id === d.id ? { ...x, actividad: v } : x)), { multiline: true })}
              {renderField("Producto diario específico", d.productoDiario, (v) => setDiaPorDia((prev) => prev.map((x) => x.id === d.id ? { ...x, productoDiario: v } : x)), { multiline: true })}
            </View>
          ))}
          <Pressable
            onPress={() => setDiaPorDia((prev) => [...prev, diaVacio()])}
            style={[styles.exportBtn, { backgroundColor: colors.primary, marginBottom: 16 }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>+ Agregar día</Text>
          </Pressable>

          {/* ── Formato oficial: rúbricas de evaluación ── */}
          {renderSectionHeader("Instrumentos de evaluación (formato oficial)", "📊")}
          <Text style={[styles.helperText, { color: colors.muted }]}>
            El formato oficial usa una rúbrica analítica disciplinar por asignatura (4–3–2–1, sobre 20 puntos)
            y una rúbrica interdisciplinar común para el producto final (sobre 24 puntos). La nota final de
            cada asignatura es el promedio entre ambas.
          </Text>
          {(
            [
              {
                key: "disc" as const,
                tituloSeccion: "Rúbrica disciplinar",
                rubrica: rubricaDisciplinar,
                setRubrica: setRubricaDisciplinar,
                porDefecto: () => rubricaDisciplinarPorDefecto(),
              },
              {
                key: "inter" as const,
                tituloSeccion: "Rúbrica interdisciplinar (común del producto final)",
                rubrica: rubricaInterdisciplinar,
                setRubrica: setRubricaInterdisciplinar,
                porDefecto: () => rubricaInterdisciplinarPorDefecto(),
              },
            ]
          ).map((bloque) => (
            <View key={bloque.key} style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 }]}>
              <Text style={[styles.subSectionTitle, { color: colors.primary, marginTop: 0 }]}>{bloque.tituloSeccion}</Text>
              {!bloque.rubrica ? (
                <Pressable
                  onPress={() => bloque.setRubrica(bloque.porDefecto())}
                  style={[styles.exportBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>+ Incluir esta rúbrica (criterios oficiales)</Text>
                </Pressable>
              ) : (
                <View>
                  {renderField("Asignatura / eje evaluado", bloque.rubrica.titulo, (v) =>
                    bloque.setRubrica({ ...(bloque.rubrica as RubricaProyecto), titulo: v })
                  )}
                  {bloque.rubrica.criterios.map((c, idx) => (
                    <View key={idx} style={{ borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 8, marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={[styles.fieldLabel, { color: colors.muted, marginBottom: 6 }]}>Criterio {idx + 1}</Text>
                        <Pressable
                          onPress={() =>
                            bloque.setRubrica({
                              ...(bloque.rubrica as RubricaProyecto),
                              criterios: bloque.rubrica!.criterios.filter((_, i) => i !== idx),
                            })
                          }
                          hitSlop={8}
                        >
                          <Text style={{ color: "#B91C1C", fontSize: 16, fontWeight: "700" }}>×</Text>
                        </Pressable>
                      </View>
                      {renderField("Criterio", c.criterio, (v) =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: bloque.rubrica!.criterios.map((x, i) => i === idx ? { ...x, criterio: v } : x),
                        })
                      )}
                      {renderField("4 – Logro destacado", c.nivel4, (v) =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: bloque.rubrica!.criterios.map((x, i) => i === idx ? { ...x, nivel4: v } : x),
                        })
                      , { multiline: true })}
                      {renderField("3 – Logro esperado", c.nivel3, (v) =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: bloque.rubrica!.criterios.map((x, i) => i === idx ? { ...x, nivel3: v } : x),
                        })
                      , { multiline: true })}
                      {renderField("2 – En proceso", c.nivel2, (v) =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: bloque.rubrica!.criterios.map((x, i) => i === idx ? { ...x, nivel2: v } : x),
                        })
                      , { multiline: true })}
                      {renderField("1 – Requiere apoyo", c.nivel1, (v) =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: bloque.rubrica!.criterios.map((x, i) => i === idx ? { ...x, nivel1: v } : x),
                        })
                      , { multiline: true })}
                    </View>
                  ))}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      onPress={() =>
                        bloque.setRubrica({
                          ...(bloque.rubrica as RubricaProyecto),
                          criterios: [...bloque.rubrica!.criterios, criterioRubricaVacio()],
                        })
                      }
                      style={[styles.exportBtn, { flex: 1, backgroundColor: colors.primary }]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>+ Criterio</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => bloque.setRubrica(bloque.porDefecto())}
                      style={[styles.exportBtn, { flex: 1, backgroundColor: colors.muted + "60" }]}
                    >
                      <Text style={{ color: colors.foreground, fontWeight: "700" }}>Restablecer criterios oficiales</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => bloque.setRubrica(null)}
                      style={[styles.exportBtn, { flex: 1, backgroundColor: "#B91C1C" }]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>Quitar rúbrica</Text>
                    </Pressable>
                  </View>
                  <Text style={[styles.helperText, { color: colors.muted, marginTop: 8 }]}>
                    Puntaje máximo: {bloque.rubrica.criterios.length * 4} puntos. Calificación = (puntaje obtenido ÷{" "}
                    {bloque.rubrica.criterios.length * 4}) × 10
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* ── Resultado generado ── */}
          {generado && (
            <View style={{ marginTop: 28 }}>
              {renderSectionHeader("Resultado generado", "✅")}

              {renderField("Objetivo general", objetivoGeneral, setObjetivoGeneral, { multiline: true })}

              <View style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 16 }]}>
                <Text style={[styles.helperText, { color: colors.muted }]}>
                  La IA propone un instrumento por actividad (lista de cotejo, rúbrica, escala…) a partir de{" "}
                  {baseCurricular === "destrezas" ? "las destrezas con criterios de desempeño" : "las competencias específicas"} que elegiste.
                  Solo completa las actividades que aún no tienen instrumento; usa el botón de cada actividad para reemplazarlo.
                </Text>
                <Pressable
                  onPress={() =>
                    handleSugerirInstrumentos(actividades.filter((a) => !a.instrumentoEvaluacion?.trim()).map((a) => a.id))
                  }
                  disabled={
                    instrumentoCargandoIds.length > 0 || actividades.every((a) => !!a.instrumentoEvaluacion?.trim())
                  }
                  style={[
                    styles.generarBtn,
                    {
                      backgroundColor: colors.primary,
                      opacity:
                        instrumentoCargandoIds.length > 0 || actividades.every((a) => !!a.instrumentoEvaluacion?.trim()) ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {instrumentoCargandoIds.length > 0 ? "Pensando…" : "✨ Sugerir instrumentos de evaluación con IA"}
                  </Text>
                </Pressable>
              </View>

              {FASES_PROYECTO.map((f) => {
                const deFase = actividades.filter((a) => a.fase === f.key);
                if (deFase.length === 0) return null;
                return (
                  <View key={f.key} style={{ marginBottom: 16 }}>
                    <Text style={[styles.subSectionTitle, { color: colors.primary }]}>{f.label}</Text>
                    {deFase.map((a) => (
                      <View key={a.id} style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 8 }]}>
                        <Text style={[styles.actividadTexto, { color: colors.foreground }]}>{a.actividad}</Text>
                        {!!a.recursos && <Text style={[styles.actividadDetalle, { color: colors.muted }]}>Recursos: {a.recursos}</Text>}
                        {!!a.evidencia && <Text style={[styles.actividadDetalle, { color: colors.muted }]}>Evidencia: {a.evidencia}</Text>}
                        {!!a.evaluacion && <Text style={[styles.actividadDetalle, { color: colors.muted, marginBottom: 8 }]}>Evaluación: {a.evaluacion}</Text>}
                        {renderField("Instrumento de evaluación", a.instrumentoEvaluacion || "", (v) => actualizarInstrumentoActividad(a.id, v), {
                          placeholder: "Ej. lista de cotejo, rúbrica...",
                          multiline: true,
                          onSugerir: () => handleSugerirInstrumentos([a.id]),
                          sugerirCargando: instrumentoCargandoIds.includes(a.id),
                        })}
                        <Text style={[styles.fieldLabel, { color: colors.muted }]}>Criterios / indicadores vinculados</Text>
                        <View style={styles.chipsWrap}>
                          {elementos.map((e) => {
                            const vinculado = (a.criteriosVinculados || []).includes(e.codigo);
                            return (
                              <Pressable
                                key={e.codigo}
                                onPress={() => toggleCriterioVinculado(a.id, e.codigo)}
                                style={[styles.chip, { backgroundColor: vinculado ? "#EEEDFE" : "transparent", borderColor: vinculado ? "#7C3AED" : colors.border }]}
                              >
                                <Text style={{ color: vinculado ? "#4C1D95" : colors.foreground, fontSize: 12, fontWeight: "600" }}>{e.codigo}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}

              {renderField("Evaluación general", evaluacionGeneral, setEvaluacionGeneral, {
                multiline: true,
                helper: "Rúbrica y/o portafolio (sugerido por el instructivo oficial) — editable.",
              })}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <Pressable
                  onPress={() => isEdit && exportWordMutation.mutate({ id: Number(id) })}
                  disabled={!isEdit || exportWordMutation.isPending}
                  style={[styles.exportBtn, { flex: 1, backgroundColor: !isEdit || exportWordMutation.isPending ? colors.muted + "40" : "#1D4ED8" }]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {exportWordMutation.isPending ? "Generando…" : "⬇ Exportar a Word"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => isEdit && exportPdfMutation.mutate({ id: Number(id) })}
                  disabled={!isEdit || exportPdfMutation.isPending}
                  style={[styles.exportBtn, { flex: 1, backgroundColor: !isEdit || exportPdfMutation.isPending ? colors.muted + "40" : "#B91C1C" }]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {exportPdfMutation.isPending ? "Generando…" : "⬇ Exportar a PDF"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleGuardarBorrador}
          disabled={isPending || !sessionId}
          style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, opacity: isPending || !sessionId ? 0.5 : 1 }]}
        >
          <Text style={{ color: colors.foreground, fontWeight: "600" }}>Guardar borrador</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 8 },
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  subSectionTitle: { fontSize: 13, fontWeight: "700", marginTop: 4, marginBottom: 8 },
  helperText: { fontSize: 12, marginBottom: 6, lineHeight: 16, fontStyle: "italic" },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  sugerirBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, gap: 6 },
  chipCode: { fontSize: 12, fontWeight: "700" },
  chipDesc: { fontSize: 11, maxWidth: 180 },
  listaContainer: { borderWidth: 1, borderRadius: 10, overflow: "hidden" },
  listaItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderBottomWidth: 1, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  listaCodigo: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  listaDesc: { fontSize: 12, lineHeight: 17 },
  disclaimer: { borderRadius: 10, borderWidth: 1, padding: 14, borderStyle: "dashed" },
  disclaimerText: { fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  generarBtn: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  actividadEvalCard: { borderWidth: 1, borderRadius: 12, padding: 14 },
  actividadTexto: { fontSize: 14, fontWeight: "600" },
  actividadDetalle: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  exportBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12 },
  navBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
});
