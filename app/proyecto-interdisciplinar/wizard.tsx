import { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import type { BaseCurricular, FaseProyecto } from "@/data/types-proyecto-interdisciplinar";
import {
  Area,
  Subnivel,
  AREAS_INFO,
  AREAS_POR_SUBNIVEL,
  SUBNIVEL_NAMES,
  filtrarPorAreaYSubnivel,
  buscarPorCodigo,
} from "@/data";
import {
  MATERIAS_EGB_BGU,
  nivelesDeMateria,
  gradosDeNivel,
  competenciasDeGrado,
  obtenerMateria,
  buscarCompetenciaEspecificaEGBBGU,
} from "@/data/competencias-especificas-egb-bgu";

type PasoFlujo = "informacion" | "areas" | "articulacion" | "actividades" | "evaluacion" | "revision";

const PASOS: { key: PasoFlujo; label: string }[] = [
  { key: "informacion", label: "Información" },
  { key: "areas", label: "Áreas" },
  { key: "articulacion", label: "Currículo" },
  { key: "actividades", label: "Actividades" },
  { key: "evaluacion", label: "Evaluación" },
  { key: "revision", label: "Revisión" },
];

function esPasoValido(v: string | undefined): v is PasoFlujo {
  return !!v && PASOS.some((p) => p.key === v);
}

const FASES_PROYECTO: { key: FaseProyecto; label: string }[] = [
  { key: "planificacion", label: "Planificación" },
  { key: "gestion", label: "Gestión" },
  { key: "evaluacion", label: "Evaluación" },
];

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
 * Subniveles con destrezas organizadas por área (Elemental..Bachillerato).
 * Preparatoria/Inicial usan ámbitos de desarrollo, una estructura distinta
 * que no encaja en el modelo "un elemento curricular por área" de este
 * módulo — quedan fuera de alcance (ver openspec/changes/proyecto-interdisciplinar/tasks.md).
 */
const SUBNIVELES_CON_AREAS: Subnivel[] = [2, 3, 4, 5];

/** Mismo patrón local que app/planificacion-anual/index.tsx (constante duplicada por pantalla, no un catálogo compartido). */
const GRADOS_POR_SUBNIVEL: Record<number, string[]> = {
  2: ["2.° EGB", "3.° EGB", "4.° EGB"],
  3: ["5.° EGB", "6.° EGB", "7.° EGB"],
  4: ["8.° EGB", "9.° EGB", "10.° EGB"],
  5: ["1.° BGU", "2.° BGU", "3.° BGU"],
};

function subnivelNumericoDeNombre(nombre: string | undefined): Subnivel | undefined {
  if (!nombre) return undefined;
  const found = (Object.entries(SUBNIVEL_NAMES) as [string, string][]).find(
    ([, label]) => label === nombre
  );
  return found ? (Number(found[0]) as Subnivel) : undefined;
}

/** Área participante mientras se edita en el wizard (mismo shape que AreaProyectoRaw del backend). */
interface AreaEnEdicion {
  id: string;
  areaId: string;
  nombreArea: string;
  nivel: string;
  subnivel?: string;
  grado: string;
}

/** Elemento curricular seleccionado para un área (mismo shape que ElementoCurricularRaw del backend). */
interface ElementoEnEdicion {
  areaProyectoId: string;
  codigo: string;
}

/**
 * Actividad en edición (mismo shape que ActividadProyectoRaw del backend).
 * `instrumentoEvaluacion`/`criteriosVinculados` se completan en la Fase 6
 * (paso Evaluación) — aquí solo se editan los campos base.
 */
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

/**
 * Resuelve la descripción de un elemento contra el catálogo estático
 * correspondiente a la base curricular. `null` si el código ya no existe en
 * el catálogo actual (spec: Elemento curricular no encontrado) — nunca
 * lanza, para no romper el render.
 */
function descripcionDeElemento(baseCurricular: BaseCurricular, codigo: string): string | null {
  if (baseCurricular === "destrezas") {
    return buscarPorCodigo(codigo)?.descripcion ?? null;
  }
  return buscarCompetenciaEspecificaEGBBGU(codigo)?.descripcion ?? null;
}

/** Lista de elementos curriculares disponibles para un área ya agregada. */
function elementosDisponiblesParaArea(
  baseCurricular: BaseCurricular,
  area: AreaEnEdicion
): { codigo: string; descripcion: string }[] {
  if (baseCurricular === "destrezas") {
    const subnivel = subnivelNumericoDeNombre(area.subnivel);
    if (subnivel === undefined) return [];
    return filtrarPorAreaYSubnivel(area.areaId as Area, subnivel).map((d) => ({
      codigo: d.codigo,
      descripcion: d.descripcion,
    }));
  }
  return competenciasDeGrado(area.areaId, area.nivel, area.grado).map((c) => ({
    codigo: c.codigo,
    descripcion: c.descripcion,
  }));
}

export default function ProyectoInterdisciplinarWizardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id, baseCurricular: baseCurricularParam, paso: pasoParam } = useLocalSearchParams<{
    id?: string;
    baseCurricular?: string;
    paso?: string;
  }>();
  const isEdit = !!id;
  const [paso, setPaso] = useState<PasoFlujo>(esPasoValido(pasoParam) ? pasoParam : "informacion");
  const [cargando, setCargando] = useState(isEdit);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    getSessionId().then(setSessionId);
  }, []);

  const [baseCurricular, setBaseCurricular] = useState<BaseCurricular>(
    baseCurricularParam === "competencias" ? "competencias" : "destrezas"
  );

  // ── Paso 1: Información general ──
  const [titulo, setTitulo] = useState("");
  const [contexto, setContexto] = useState("");
  const [preguntaGuia, setPreguntaGuia] = useState("");
  const [objetivoGeneral, setObjetivoGeneral] = useState("");
  const [objetivosEspecificosTexto, setObjetivosEspecificosTexto] = useState("");
  const [productoFinal, setProductoFinal] = useState("");
  const [duracion, setDuracion] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [docentesTexto, setDocentesTexto] = useState("");

  // ── Campos nuevos para Proyecto interdisciplinar ──
  const [curriculoPriorizado, setCurriculoPriorizado] = useState("Destrezas con criterios de desempeño");
  const [asignaturaAncla, setAsignaturaAncla] = useState("M");
  const [paralelo, setParalelo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [compartirComunidad, setCompartirComunidad] = useState(false);
  const [mostrarNombreAutor, setMostrarNombreAutor] = useState(false);
  const [busquedaDestrezaProyecto, setBusquedaDestrezaProyecto] = useState("");

  // ── Paso 2: Áreas participantes ──
  const [areas, setAreas] = useState<AreaEnEdicion[]>([]);
  // Mini-formulario "agregar área" (destrezas)
  const [nuevaSubnivel, setNuevaSubnivel] = useState<Subnivel>(2);
  const [nuevaAreaDestrezas, setNuevaAreaDestrezas] = useState<Area>("M");
  const [nuevoGradoDestrezas, setNuevoGradoDestrezas] = useState("");
  // Mini-formulario "agregar área" (competencias)
  const [nuevaMateriaId, setNuevaMateriaId] = useState(MATERIAS_EGB_BGU[0].id);
  const [nuevoNivelCompetencias, setNuevoNivelCompetencias] = useState("");
  const [nuevoGradoCompetencias, setNuevoGradoCompetencias] = useState("");

  const areasDisponiblesDestrezas = AREAS_POR_SUBNIVEL[nuevaSubnivel] ?? [];
  const gradosDisponiblesDestrezas = GRADOS_POR_SUBNIVEL[nuevaSubnivel] ?? [];

  useEffect(() => {
    if (!areasDisponiblesDestrezas.includes(nuevaAreaDestrezas)) {
      setNuevaAreaDestrezas(areasDisponiblesDestrezas[0] ?? "M");
    }
  }, [nuevaSubnivel]);

  useEffect(() => {
    setNuevoGradoDestrezas((prev) =>
      gradosDisponiblesDestrezas.includes(prev) ? prev : gradosDisponiblesDestrezas[0] || ""
    );
  }, [nuevaSubnivel]);

  const nivelesDisponiblesCompetencias = useMemo(
    () => nivelesDeMateria(nuevaMateriaId),
    [nuevaMateriaId]
  );
  const gradosDisponiblesCompetencias = useMemo(
    () => (nuevoNivelCompetencias ? gradosDeNivel(nuevaMateriaId, nuevoNivelCompetencias) : []),
    [nuevaMateriaId, nuevoNivelCompetencias]
  );

  useEffect(() => {
    const niveles = nivelesDeMateria(nuevaMateriaId);
    setNuevoNivelCompetencias((prev) => (niveles.includes(prev) ? prev : niveles[0] || ""));
  }, [nuevaMateriaId]);

  useEffect(() => {
    const grados = nuevoNivelCompetencias ? gradosDeNivel(nuevaMateriaId, nuevoNivelCompetencias) : [];
    setNuevoGradoCompetencias((prev) => (grados.includes(prev) ? prev : grados[0] || ""));
  }, [nuevaMateriaId, nuevoNivelCompetencias]);

  const agregarArea = () => {
    if (baseCurricular === "destrezas") {
      if (!nuevoGradoDestrezas) return;
      const nueva: AreaEnEdicion = {
        id: generarIdLocal("area"),
        areaId: nuevaAreaDestrezas,
        nombreArea: AREAS_INFO[nuevaAreaDestrezas]?.name || nuevaAreaDestrezas,
        nivel: SUBNIVEL_NAMES[nuevaSubnivel],
        subnivel: SUBNIVEL_NAMES[nuevaSubnivel],
        grado: nuevoGradoDestrezas,
      };
      const yaExiste = areas.some(
        (a) => a.areaId === nueva.areaId && a.grado === nueva.grado
      );
      if (yaExiste) {
        Alert.alert("Área ya agregada", "Esa área y grado ya están en el proyecto.");
        return;
      }
      setAreas((prev) => [...prev, nueva]);
    } else {
      if (!nuevoNivelCompetencias || !nuevoGradoCompetencias) return;
      const materia = obtenerMateria(nuevaMateriaId);
      const nueva: AreaEnEdicion = {
        id: generarIdLocal("area"),
        areaId: nuevaMateriaId,
        nombreArea: materia?.nombre || nuevaMateriaId,
        nivel: nuevoNivelCompetencias,
        grado: nuevoGradoCompetencias,
      };
      const yaExiste = areas.some(
        (a) => a.areaId === nueva.areaId && a.nivel === nueva.nivel && a.grado === nueva.grado
      );
      if (yaExiste) {
        Alert.alert("Área ya agregada", "Esa área, nivel y grado ya están en el proyecto.");
        return;
      }
      setAreas((prev) => [...prev, nueva]);
    }
  };

  const eliminarArea = (areaId: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== areaId));
    // Un área eliminada se lleva consigo todos sus elementos curriculares
    // (Requirement: Eliminar un área participante).
    setElementos((prev) => prev.filter((e) => e.areaProyectoId !== areaId));
  };

  // ── Paso 3: Articulación curricular ──
  const [elementos, setElementos] = useState<ElementoEnEdicion[]>([]);
  const [busquedaPorArea, setBusquedaPorArea] = useState<Record<string, string>>({});

  const toggleElemento = (area: AreaEnEdicion, codigo: string) => {
    setElementos((prev) => {
      const yaSeleccionado = prev.some(
        (e) => e.areaProyectoId === area.id && e.codigo === codigo
      );
      if (yaSeleccionado) {
        return prev.filter((e) => !(e.areaProyectoId === area.id && e.codigo === codigo));
      }
      return [...prev, { areaProyectoId: area.id, codigo }];
    });
  };

  // ── Paso 4: Actividades por fase ──
  const [actividades, setActividades] = useState<ActividadEnEdicion[]>([]);
  const [nuevaFase, setNuevaFase] = useState<FaseProyecto>("planificacion");
  const [nuevaActividadTexto, setNuevaActividadTexto] = useState("");
  const [nuevaActividadRecursos, setNuevaActividadRecursos] = useState("");
  const [nuevaActividadEvidencia, setNuevaActividadEvidencia] = useState("");
  const [nuevaActividadEvaluacion, setNuevaActividadEvaluacion] = useState("");

  const agregarActividad = () => {
    if (!nuevaActividadTexto.trim()) return;
    const nueva: ActividadEnEdicion = {
      id: generarIdLocal("actividad"),
      fase: nuevaFase,
      actividad: nuevaActividadTexto.trim(),
      recursos: nuevaActividadRecursos.trim(),
      evidencia: nuevaActividadEvidencia.trim(),
      evaluacion: nuevaActividadEvaluacion.trim(),
    };
    setActividades((prev) => [...prev, nueva]);
    setNuevaActividadTexto("");
    setNuevaActividadRecursos("");
    setNuevaActividadEvidencia("");
    setNuevaActividadEvaluacion("");
  };

  const eliminarActividad = (actividadId: string) => {
    setActividades((prev) => prev.filter((a) => a.id !== actividadId));
  };

  // ── Paso 5: Evaluación ──
  const [evaluacionGeneral, setEvaluacionGeneral] = useState("");

  const actualizarInstrumentoActividad = (actividadId: string, instrumento: string) => {
    setActividades((prev) =>
      prev.map((a) => (a.id === actividadId ? { ...a, instrumentoEvaluacion: instrumento } : a))
    );
  };

  const toggleCriterioVinculado = (actividadId: string, codigo: string) => {
    setActividades((prev) =>
      prev.map((a) => {
        if (a.id !== actividadId) return a;
        const actuales = a.criteriosVinculados || [];
        const yaVinculado = actuales.includes(codigo);
        return {
          ...a,
          criteriosVinculados: yaVinculado
            ? actuales.filter((c) => c !== codigo)
            : [...actuales, codigo],
        };
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
      setObjetivoGeneral(fd.objetivoGeneral || "");
      setObjetivosEspecificosTexto((fd.objetivosEspecificos || []).join("\n"));
      setProductoFinal(fd.productoFinal || "");
      setDuracion(fd.duracion || "");
      setMetodologia(fd.metodologia || "");
      setEvaluacionGeneral(fd.evaluacionGeneral || "");
      setInstitucion(fd.institucion || "");
      setDocentesTexto((fd.docentesParticipantes || []).join("\n"));
      // Campos nuevos
      setCurriculoPriorizado(fd.curriculoPriorizado || "Destrezas con criterios de desempeño");
      setAsignaturaAncla(fd.asignaturaAncla || "M");
      setParalelo(fd.paralelo || "");
      setFechaInicio(fd.fechaInicio || "");
      setFechaFin(fd.fechaFin || "");
      setCompartirComunidad(fd.compartirComunidad || false);
      setMostrarNombreAutor(fd.mostrarNombreAutor || false);
      setAreas(
        (fd.areas || []).map((a) => ({
          id: a.id,
          areaId: a.areaId,
          nombreArea: a.nombreArea,
          nivel: a.nivel,
          subnivel: a.subnivel,
          grado: a.grado,
        }))
      );
      setElementos(
        (fd.elementosCurriculares || []).map((e) => ({
          areaProyectoId: e.areaProyectoId,
          codigo: e.codigo,
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

  // ── Guardar borrador / Generar ──
  const utils = trpc.useContext();
  const [generando, setGenerando] = useState(false);

  const construirPayload = () => ({
    sessionId,
    baseCurricular,
    titulo: titulo.trim() || undefined,
    contexto: contexto.trim() || undefined,
    preguntaGuia: preguntaGuia.trim() || undefined,
    objetivoGeneral: objetivoGeneral.trim() || undefined,
    objetivosEspecificos: objetivosEspecificosTexto
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
    productoFinal: productoFinal.trim() || undefined,
    duracion: duracion.trim() || undefined,
    metodologia: metodologia.trim() || undefined,
    // Campos nuevos
    curriculoPriorizado,
    asignaturaAncla,
    paralelo: paralelo.trim() || undefined,
    fechaInicio: fechaInicio.trim() || undefined,
    fechaFin: fechaFin.trim() || undefined,
    compartirComunidad,
    mostrarNombreAutor,
    areas: areas.map((a) => ({
      id: a.id,
      areaId: a.areaId,
      nombreArea: a.nombreArea,
      nivel: a.nivel,
      subnivel: a.subnivel,
      grado: a.grado,
    })),
    elementosCurriculares: elementos,
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
    evaluacionGeneral: evaluacionGeneral.trim() || undefined,
    institucion: institucion.trim() || undefined,
    docentesParticipantes: docentesTexto
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
  });

  const createMutation = trpc.proyectoInterdisciplinar.create.useMutation({
    onSuccess: (data) => {
      utils.proyectoInterdisciplinar.list.invalidate();
      // Sin vista de detalle todavía: se sigue editando el mismo borrador
      // por id (conservando el paso actual) para no perder el trabajo ya guardado.
      if (data?.id) {
        router.replace(`/proyecto-interdisciplinar/wizard?id=${data.id}&paso=${paso}` as any);
      }
    },
    onError: (err) => {
      if (!generando) Alert.alert("Error", err.message || "No se pudo guardar el proyecto.");
    },
  });

  const updateMutation = trpc.proyectoInterdisciplinar.update.useMutation({
    onSuccess: () => {
      utils.proyectoInterdisciplinar.list.invalidate();
      if (!generando) Alert.alert("Guardado", "El borrador se guardó correctamente.");
    },
    onError: (err) => {
      if (!generando) Alert.alert("Error", err.message || "No se pudo guardar el proyecto.");
    },
  });

  const updateStatusMutation = trpc.proyectoInterdisciplinar.updateStatus.useMutation();

  // ── Exportación Word (mismo patrón de descarga que curriculo-competencias/ver/[id].tsx) ──
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
        Alert.alert("Error", "No se pudo descargar el archivo Word.");
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo generar el documento Word. Intenta de nuevo.");
    },
  });

  // ── Exportación PDF (mismo patrón que curriculo-competencias/ver/[id].tsx) ──
  const exportPdfMutation = trpc.proyectoInterdisciplinar.exportPdf.useMutation({
    onSuccess: (data) => {
      try {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(data.html);
          win.document.close();
          setTimeout(() => win.print(), 300);
        } else {
          Alert.alert("Aviso", "Se abrió una nueva ventana con el PDF. Si no lo ves, revisa el bloqueador de pop-ups.");
        }
      } catch {
        Alert.alert("Error", "No se pudo abrir el PDF. Intenta de nuevo.");
      }
    },
    onError: () => {
      Alert.alert("Error", "No se pudo generar el PDF. Intenta de nuevo.");
    },
  });

  // ── Asistencia por IA (solo texto — nunca códigos curriculares) ──
  const sugerirMutation = trpc.proyectoInterdisciplinar.sugerirProyecto.useMutation({
    onError: (err) => {
      Alert.alert("No se pudo sugerir", err.message || "Intenta de nuevo.");
    },
  });

  /**
   * Pide sugerencias de texto a la IA sobre las áreas/elementos curriculares
   * ya seleccionados por el docente (nunca al revés: la IA no puede agregar
   * códigos curriculares, solo recibe los ya elegidos como contexto de solo
   * lectura). `onResultado` decide en qué campo(s) de estado va cada clave.
   */
  const sugerirConIA = (
    campos: (
      | "titulo"
      | "preguntaGuia"
      | "objetivoGeneral"
      | "productoFinal"
      | "actividadesSugeridas"
      | "recursos"
      | "instrumentoEvaluacion"
    )[],
    onResultado: (resultado: Partial<Record<string, string>>) => void
  ) => {
    sugerirMutation.mutate(
      {
        baseCurricular,
        areas: areas.map((a) => ({ nombreArea: a.nombreArea, nivel: a.nivel, grado: a.grado })),
        elementosCurriculares: elementos.map((e) => ({
          codigo: e.codigo,
          descripcion: descripcionDeElemento(baseCurricular, e.codigo) || undefined,
        })),
        campos,
      },
      { onSuccess: onResultado }
    );
  };

  const handleSugerirInformacion = () => {
    sugerirConIA(
      ["titulo", "preguntaGuia", "objetivoGeneral", "productoFinal"],
      (r) => {
        if (r.titulo && !titulo.trim()) setTitulo(r.titulo);
        if (r.preguntaGuia && !preguntaGuia.trim()) setPreguntaGuia(r.preguntaGuia);
        if (r.objetivoGeneral && !objetivoGeneral.trim()) setObjetivoGeneral(r.objetivoGeneral);
        if (r.productoFinal && !productoFinal.trim()) setProductoFinal(r.productoFinal);
      }
    );
  };

  const handleSugerirActividad = () => {
    sugerirConIA(["actividadesSugeridas", "recursos"], (r) => {
      if (r.actividadesSugeridas && !nuevaActividadTexto.trim()) {
        setNuevaActividadTexto(r.actividadesSugeridas);
      }
      if (r.recursos && !nuevaActividadRecursos.trim()) {
        setNuevaActividadRecursos(r.recursos);
      }
    });
  };

  const handleSugerirInstrumento = (actividadId: string) => {
    sugerirConIA(["instrumentoEvaluacion"], (r) => {
      if (r.instrumentoEvaluacion) {
        actualizarInstrumentoActividad(actividadId, r.instrumentoEvaluacion);
      }
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending || generando;

  const handleGuardar = () => {
    if (!sessionId) return;
    const payload = construirPayload();
    if (isEdit) {
      updateMutation.mutate({ ...payload, id: Number(id) });
    } else {
      createMutation.mutate(payload);
    }
  };

  /**
   * Guarda los cambios pendientes y marca el proyecto como "generado".
   * `updateStatus` corre `validarProyectoParaGenerar` en el servidor — si
   * falta un campo obligatorio, lanza un error con el detalle exacto
   * (spec: Bloquear generación incompleta), que se muestra tal cual.
   */
  const handleGenerar = async () => {
    if (!sessionId) return;
    setGenerando(true);
    try {
      const payload = construirPayload();
      let projectId = isEdit ? Number(id) : undefined;
      if (projectId) {
        await updateMutation.mutateAsync({ ...payload, id: projectId });
      } else {
        const creado = await createMutation.mutateAsync(payload);
        projectId = creado?.id;
      }
      if (!projectId) {
        throw new Error("No se pudo guardar el proyecto antes de generarlo.");
      }
      await updateStatusMutation.mutateAsync({ id: projectId, estado: "generado" });
      Alert.alert("Proyecto generado", "El proyecto quedó marcado como generado.");
    } catch (err: any) {
      Alert.alert("No se pudo generar", err.message || "Revisa los campos obligatorios.");
    } finally {
      setGenerando(false);
    }
  };

  // ── Navegación entre pasos ──
  const canAdvance = () => {
    if (paso === "informacion") return true;
    if (paso === "areas") return areas.length > 0;
    if (paso === "articulacion") {
      return areas.every((a) => elementos.some((e) => e.areaProyectoId === a.id));
    }
    if (paso === "actividades") return actividades.length > 0;
    // "evaluacion" no exige mínimos para avanzar: vincular criterio/instrumento
    // es opcional por actividad (spec usa SHALL permitir, no SHALL exigir).
    return true;
  };

  const esUltimoPaso = paso === PASOS[PASOS.length - 1].key;

  const advancePaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx < PASOS.length - 1) setPaso(PASOS[idx + 1].key);
  };

  const retreatPaso = () => {
    const idx = PASOS.findIndex((p) => p.key === paso);
    if (idx > 0) setPaso(PASOS[idx - 1].key);
  };

  // ── Render helpers (mismo patrón visual que egb-bgu-integrado.tsx) ──
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
    opts: {
      placeholder?: string;
      multiline?: boolean;
      helper?: string;
      onSugerir?: () => void;
      sugerirCargando?: boolean;
    } = {}
  ) => (
    <View style={styles.fieldGroup}>
      {opts.onSugerir ? (
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, { color: colors.muted, marginBottom: 0 }]}>{label}</Text>
          <Pressable
            onPress={opts.onSugerir}
            disabled={opts.sugerirCargando}
            style={[styles.sugerirBtn, { opacity: opts.sugerirCargando ? 0.5 : 1 }]}
          >
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
              {opts.sugerirCargando ? "Pensando…" : "✨ Sugerir con IA"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      )}
      {opts.helper && (
        <Text style={[styles.helperText, { color: colors.muted }]}>{opts.helper}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChange}
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
            style={[
              styles.selectChip,
              {
                backgroundColor: value === opt.value ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: value === opt.value ? "#fff" : colors.foreground, fontSize: 13 }}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // ── Paso 1 ──
  const renderInformacion = () => (
    <View>
      {renderSectionHeader("Proyecto interdisciplinar", "🧩")}
      <Text style={[styles.helperText, { color: colors.muted, marginBottom: 14 }]}>
        Proyecto interdisciplinar · Integra varias áreas alrededor de un producto final común. El área elegida es el ancla: la IA arma portada multiárea, agenda y filas con destrezas de varias asignaturas.
      </Text>

      {/* ── Contexto curricular ── */}
      <View style={[styles.sectionCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border }]}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>📚 Contexto curricular</Text>
        </View>
        <View style={styles.sectionCardBody}>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Currículo priorizado</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {["Destrezas con criterios de desempeño", "Competencias específicas (CNC)"].map((opt) => (
              <Pressable
                key={opt}
                onPress={() => setCurriculoPriorizado(opt)}
                style={{
                  paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
                  backgroundColor: curriculoPriorizado === opt ? colors.primary : colors.background,
                  borderWidth: 1, borderColor: curriculoPriorizado === opt ? colors.primary : colors.border,
                }}
              >
                <Text style={{ fontSize: 12, color: curriculoPriorizado === opt ? "#fff" : colors.foreground }}>
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Grado</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {["8.° EGB", "9.° EGB", "10.° EGB", "1.° BGU", "2.° BGU", "3.° BGU"].map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => {/* handled by areas step */}}
                    style={{
                      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
                      backgroundColor: colors.background,
                      borderWidth: 1, borderColor: colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: colors.foreground }}>{g}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Asignatura ancla</Text>
              <Text style={[styles.helperText, { color: colors.muted, marginBottom: 6 }]}>
                Ancla del proyecto (p. ej. Matemática o Lengua). Lengua y Matemática son la base; otras áreas solo si aportan al producto.
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {Object.entries(AREAS_INFO).slice(0, 6).map(([code, info]) => (
                  <Pressable
                    key={code}
                    onPress={() => setAsignaturaAncla(code)}
                    style={{
                      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
                      backgroundColor: asignaturaAncla === code ? info.color : colors.background,
                      borderWidth: 1, borderColor: asignaturaAncla === code ? info.color : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: asignaturaAncla === code ? "#fff" : colors.foreground }}>
                      {info.emoji} {info.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── Datos del proyecto ── */}
      <View style={[styles.sectionCard, { borderColor: colors.border, backgroundColor: colors.surface, marginTop: 14 }]}>
        <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border }]}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>📝 Datos del proyecto</Text>
        </View>
        <View style={styles.sectionCardBody}>
          {renderField("Título", titulo, setTitulo, {
            placeholder: "Nombre del proyecto interdisciplinar",
            onSugerir: handleSugerirInformacion,
            sugerirCargando: sugerirMutation.isPending,
          })}
          {renderField("Contexto / situación", contexto, setContexto, {
            multiline: true,
            placeholder: "¿Qué problema o situación motiva este proyecto?",
          })}
          {renderField("Pregunta guía", preguntaGuia, setPreguntaGuia, {
            multiline: true,
            placeholder: "Pregunta abierta que orienta la indagación",
          })}
          {renderField("Objetivo general", objetivoGeneral, setObjetivoGeneral, {
            multiline: true,
          })}
          {renderField(
            "Objetivos específicos (uno por línea)",
            objetivosEspecificosTexto,
            setObjetivosEspecificosTexto,
            { multiline: true }
          )}
          {renderField("Producto final", productoFinal, setProductoFinal, {
            multiline: true,
            placeholder: "¿Qué van a producir los estudiantes?",
          })}
          {renderField("Duración", duracion, setDuracion, {
            placeholder: "Ej. 3 semanas",
          })}
          {renderField("Metodología", metodologia, setMetodologia, {
            multiline: true,
          })}
        </View>
      </View>

      {/* ── Datos administrativos ── */}
      <View style={[styles.sectionCard, { borderColor: colors.border, backgroundColor: colors.surface, marginTop: 14 }]}>
        <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border }]}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>📋 Datos administrativos</Text>
        </View>
        <View style={styles.sectionCardBody}>
          {renderField("Institución", institucion, setInstitucion, {
            placeholder: "Nombre de la unidad educativa",
          })}
          {renderField(
            "Docentes participantes (uno por línea)",
            docentesTexto,
            setDocentesTexto,
            { multiline: true, placeholder: "Un nombre por línea" }
          )}

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              {renderField("Paralelo", paralelo, setParalelo, {
                placeholder: "Ej: A",
              })}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Fecha de inicio</Text>
              <TextInput
                value={fechaInicio}
                onChangeText={setFechaInicio}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.muted + "80"}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
              />
              <Text style={[styles.helperText, { color: colors.muted }]}>Opcional (membrante / cronograma).</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Fecha de fin</Text>
              <TextInput
                value={fechaFin}
                onChangeText={setFechaFin}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.muted + "80"}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
              />
              <Text style={[styles.helperText, { color: colors.muted }]}>Opcional.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Banco de la comunidad ── */}
      <View style={[styles.sectionCard, { borderColor: colors.border, backgroundColor: colors.surface, marginTop: 14 }]}>
        <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", gap: 8 }]}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>🌐 Banco de la comunidad</Text>
          <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#F59E0B" }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#92400E" }}>OPCIONAL</Text>
          </View>
        </View>
        <View style={styles.sectionCardBody}>
          <Text style={[styles.helperText, { color: colors.muted, marginBottom: 12 }]}>
            Compartir es opcional y siempre bajo tu decisión. Se publica solo el resultado de la IA, sin datos de tu escuela ni de estudiantes con NEE.
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Pressable
              onPress={() => setCompartirComunidad(!compartirComunidad)}
              style={[
                styles.checkbox,
                {
                  borderColor: compartirComunidad ? colors.primary : colors.border,
                  backgroundColor: compartirComunidad ? colors.primary : "transparent",
                },
              ]}
            >
              {compartirComunidad && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
            </Pressable>
            <Text style={{ fontSize: 12, color: colors.foreground, flex: 1 }}>
              ¿Compartir con la comunidad? Otros docentes podrán ver y clonar tu planificación.
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={() => setMostrarNombreAutor(!mostrarNombreAutor)}
              style={[
                styles.checkbox,
                {
                  borderColor: mostrarNombreAutor ? colors.primary : colors.border,
                  backgroundColor: mostrarNombreAutor ? colors.primary : "transparent",
                },
              ]}
            >
              {mostrarNombreAutor && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
            </Pressable>
            <Text style={{ fontSize: 12, color: colors.foreground }}>
              Mostrar mi nombre como autora/autor (opcional y separado).
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // ── Paso 2 ──
  const renderAreas = () => (
    <View>
      {renderSectionHeader("Áreas participantes", "🏷️")}
      <Text style={[styles.helperText, { color: colors.muted, marginBottom: 12 }]}>
        Agrega una o más áreas. Cada una puede tener su propio nivel, subnivel
        y grado.
      </Text>

      {areas.length > 0 && (
        <View style={{ marginBottom: 16, gap: 8 }}>
          {areas.map((a) => (
            <View
              key={a.id}
              style={[styles.areaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.areaCardTitle, { color: colors.foreground }]}>{a.nombreArea}</Text>
                <Text style={[styles.areaCardSub, { color: colors.muted }]}>
                  {a.nivel} · {a.grado}
                </Text>
                <Text style={[styles.areaCardSub, { color: colors.muted }]}>
                  {elementos.filter((e) => e.areaProyectoId === a.id).length} elemento(s) curricular(es)
                </Text>
              </View>
              <Pressable onPress={() => eliminarArea(a.id)} hitSlop={8}>
                <Text style={{ color: colors.error, fontSize: 20 }}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.addAreaBox, { borderColor: colors.border }]}>
        <Text style={[styles.fieldLabel, { color: colors.primary, marginBottom: 10 }]}>
          Agregar área
        </Text>
        {baseCurricular === "destrezas" ? (
          <>
            {renderSelectChips(
              "Subnivel",
              nuevaSubnivel,
              SUBNIVELES_CON_AREAS.map((s) => ({ value: s, label: SUBNIVEL_NAMES[s] })),
              setNuevaSubnivel
            )}
            {renderSelectChips(
              "Área",
              nuevaAreaDestrezas,
              areasDisponiblesDestrezas.map((a) => ({ value: a, label: AREAS_INFO[a]?.name || a })),
              setNuevaAreaDestrezas
            )}
            {renderSelectChips(
              "Grado",
              nuevoGradoDestrezas,
              gradosDisponiblesDestrezas.map((g) => ({ value: g, label: g })),
              setNuevoGradoDestrezas
            )}
          </>
        ) : (
          <>
            {renderSelectChips(
              "Materia",
              nuevaMateriaId,
              MATERIAS_EGB_BGU.map((m) => ({ value: m.id, label: m.nombre })),
              setNuevaMateriaId
            )}
            {renderSelectChips(
              "Nivel",
              nuevoNivelCompetencias,
              nivelesDisponiblesCompetencias.map((n) => ({ value: n, label: n })),
              setNuevoNivelCompetencias
            )}
            {renderSelectChips(
              "Grado",
              nuevoGradoCompetencias,
              gradosDisponiblesCompetencias.map((g) => ({ value: g, label: g })),
              setNuevoGradoCompetencias
            )}
          </>
        )}
        <Pressable
          onPress={agregarArea}
          style={[styles.addAreaBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Agregar área</Text>
        </Pressable>
      </View>
    </View>
  );

  // ── Paso 3 ──
  const renderArticulacion = () => (
    <View>
      {renderSectionHeader("Articulación curricular", "🔗")}
      {areas.length === 0 ? (
        <Text style={{ color: colors.muted }}>
          Agrega áreas en el paso anterior antes de seleccionar elementos curriculares.
        </Text>
      ) : (
        areas.map((area) => {
          const disponibles = elementosDisponiblesParaArea(baseCurricular, area);
          const busqueda = (busquedaPorArea[area.id] || "").trim().toLowerCase();
          const filtrados = busqueda
            ? disponibles.filter(
                (e) =>
                  e.codigo.toLowerCase().includes(busqueda) ||
                  e.descripcion.toLowerCase().includes(busqueda)
              )
            : disponibles;
          const seleccionados = elementos.filter((e) => e.areaProyectoId === area.id);
          const codigosSeleccionados = new Set(seleccionados.map((e) => e.codigo));

          return (
            <View
              key={area.id}
              style={[styles.areaArticCard, { borderColor: colors.border }]}
            >
              <Text style={[styles.areaArticTitle, { color: colors.foreground }]}>
                {area.nombreArea} — {area.nivel} · {area.grado}
              </Text>

              {seleccionados.length > 0 && (
                <View style={styles.chipsWrap}>
                  {seleccionados.map((e) => {
                    const descripcion = descripcionDeElemento(baseCurricular, e.codigo);
                    return (
                      <View
                        key={e.codigo}
                        style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}
                      >
                        <Text style={[styles.chipCode, { color: "#4C1D95" }]}>{e.codigo}</Text>
                        {descripcion === null ? (
                          <Text style={[styles.chipDesc, { color: "#B45309" }]}>
                            no encontrado en el catálogo actual
                          </Text>
                        ) : (
                          <Text style={[styles.chipDesc, { color: "#6D28D9" }]} numberOfLines={1}>
                            {descripcion.length > 35 ? descripcion.substring(0, 35) + "..." : descripcion}
                          </Text>
                        )}
                        <Pressable onPress={() => toggleElemento(area, e.codigo)} hitSlop={6}>
                          <Text style={{ color: "#7C3AED", fontSize: 15, fontWeight: "700" }}>×</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}

              <TextInput
                value={busquedaPorArea[area.id] || ""}
                onChangeText={(t) => setBusquedaPorArea((prev) => ({ ...prev, [area.id]: t }))}
                placeholder="Buscar por código o palabra clave..."
                placeholderTextColor={colors.muted + "80"}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground, marginBottom: 8 },
                ]}
              />

              <View style={[styles.listaContainer, { borderColor: colors.border }]}>
                {filtrados.length === 0 ? (
                  <Text style={{ color: colors.muted, padding: 12, fontSize: 13 }}>
                    No hay elementos curriculares para esta combinación.
                  </Text>
                ) : (
                  filtrados.map((e) => (
                    <Pressable
                      key={e.codigo}
                      onPress={() => toggleElemento(area, e.codigo)}
                      style={[
                        styles.listaItem,
                        {
                          borderBottomColor: colors.border,
                          backgroundColor: codigosSeleccionados.has(e.codigo) ? colors.primary + "10" : "transparent",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: codigosSeleccionados.has(e.codigo) ? colors.primary : colors.border,
                            backgroundColor: codigosSeleccionados.has(e.codigo) ? colors.primary : "transparent",
                          },
                        ]}
                      >
                        {codigosSeleccionados.has(e.codigo) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.listaCodigo, { color: colors.primary }]}>{e.codigo}</Text>
                        <Text style={[styles.listaDesc, { color: colors.foreground }]} numberOfLines={2}>
                          {e.descripcion}
                        </Text>
                      </View>
                    </Pressable>
                  ))
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );

  // ── Paso 4 ──
  const renderActividades = () => (
    <View>
      {renderSectionHeader("Actividades por fase", "🛠️")}
      <Text style={[styles.helperText, { color: colors.muted, marginBottom: 12 }]}>
        Organiza las actividades del proyecto en las 3 fases del instructivo
        oficial: Planificación, Gestión y Evaluación.
      </Text>

      {FASES_PROYECTO.map((f) => {
        const actividadesDeFase = actividades.filter((a) => a.fase === f.key);
        return (
          <View key={f.key} style={{ marginBottom: 18 }}>
            <Text style={[styles.subSectionTitle, { color: colors.primary }]}>{f.label}</Text>
            {actividadesDeFase.length === 0 ? (
              <Text style={{ color: colors.muted, fontSize: 13 }}>Sin actividades todavía.</Text>
            ) : (
              <View style={{ gap: 8 }}>
                {actividadesDeFase.map((a) => (
                  <View
                    key={a.id}
                    style={[styles.actividadCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actividadTexto, { color: colors.foreground }]}>{a.actividad}</Text>
                      {!!a.recursos && (
                        <Text style={[styles.actividadDetalle, { color: colors.muted }]}>
                          Recursos: {a.recursos}
                        </Text>
                      )}
                      {!!a.evidencia && (
                        <Text style={[styles.actividadDetalle, { color: colors.muted }]}>
                          Evidencia: {a.evidencia}
                        </Text>
                      )}
                      {!!a.evaluacion && (
                        <Text style={[styles.actividadDetalle, { color: colors.muted }]}>
                          Evaluación: {a.evaluacion}
                        </Text>
                      )}
                    </View>
                    <Pressable onPress={() => eliminarActividad(a.id)} hitSlop={8}>
                      <Text style={{ color: colors.error, fontSize: 20 }}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={[styles.addAreaBox, { borderColor: colors.border }]}>
        <Text style={[styles.fieldLabel, { color: colors.primary, marginBottom: 10 }]}>
          Agregar actividad
        </Text>
        {renderSelectChips(
          "Fase",
          nuevaFase,
          FASES_PROYECTO.map((f) => ({ value: f.key, label: f.label })),
          setNuevaFase
        )}
        {renderField("Actividad", nuevaActividadTexto, setNuevaActividadTexto, {
          multiline: true,
          placeholder: "¿Qué van a hacer los estudiantes en esta actividad?",
          onSugerir: handleSugerirActividad,
          sugerirCargando: sugerirMutation.isPending,
        })}
        {renderField("Recursos", nuevaActividadRecursos, setNuevaActividadRecursos, {
          placeholder: "Materiales o recursos necesarios",
        })}
        {renderField("Evidencia", nuevaActividadEvidencia, setNuevaActividadEvidencia, {
          placeholder: "¿Qué evidencia queda de esta actividad?",
        })}
        {renderField("Evaluación", nuevaActividadEvaluacion, setNuevaActividadEvaluacion, {
          placeholder: "¿Cómo se evalúa esta actividad?",
        })}
        <Pressable
          onPress={agregarActividad}
          disabled={!nuevaActividadTexto.trim()}
          style={[
            styles.addAreaBtn,
            { backgroundColor: nuevaActividadTexto.trim() ? colors.primary : colors.muted + "40" },
          ]}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Agregar actividad</Text>
        </Pressable>
      </View>
    </View>
  );

  // ── Paso 5 ──
  const renderEvaluacion = () => (
    <View>
      {renderSectionHeader("Evaluación", "📊")}
      {renderField("Evaluación general del proyecto", evaluacionGeneral, setEvaluacionGeneral, {
        multiline: true,
        placeholder: "Rúbrica y/o portafolio (sugerido por el instructivo oficial) — editable",
      })}

      <Text style={[styles.subSectionTitle, { color: colors.primary, marginTop: 6 }]}>
        Vincular actividades con criterios e instrumento
      </Text>

      {actividades.length === 0 ? (
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          Agrega actividades en el paso anterior primero.
        </Text>
      ) : (
        <View style={{ gap: 12 }}>
          {actividades.map((act) => (
            <View
              key={act.id}
              style={[styles.actividadEvalCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Text style={[styles.actividadTexto, { color: colors.foreground }]}>{act.actividad}</Text>
              <Text style={[styles.actividadDetalle, { color: colors.muted, marginBottom: 8 }]}>
                Fase: {FASES_PROYECTO.find((f) => f.key === act.fase)?.label}
              </Text>

              {renderField(
                "Instrumento de evaluación",
                act.instrumentoEvaluacion || "",
                (v) => actualizarInstrumentoActividad(act.id, v),
                {
                  placeholder: "Ej. lista de cotejo, rúbrica, escala de valoración...",
                  onSugerir: () => handleSugerirInstrumento(act.id),
                  sugerirCargando: sugerirMutation.isPending,
                }
              )}

              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Criterios / indicadores vinculados
              </Text>
              {elementos.length === 0 ? (
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  Selecciona elementos curriculares en el paso &quot;Currículo&quot; primero.
                </Text>
              ) : (
                <View style={styles.chipsWrap}>
                  {elementos.map((e) => {
                    const area = areas.find((a) => a.id === e.areaProyectoId);
                    const vinculado = (act.criteriosVinculados || []).includes(e.codigo);
                    return (
                      <Pressable
                        key={e.codigo}
                        onPress={() => toggleCriterioVinculado(act.id, e.codigo)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: vinculado ? "#EEEDFE" : "transparent",
                            borderColor: vinculado ? "#7C3AED" : colors.border,
                          },
                        ]}
                      >
                        <Text style={{ color: vinculado ? "#4C1D95" : colors.foreground, fontSize: 12, fontWeight: "600" }}>
                          {e.codigo}
                          {area ? ` · ${area.nombreArea}` : ""}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // ── Paso 6 ──
  const renderResumenLinea = (label: string, value: string | undefined) => (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.foreground }]}>{value || "—"}</Text>
    </View>
  );

  const renderRevision = () => (
    <View>
      {renderSectionHeader("Revisión", "✅")}

      <View style={{ marginBottom: 16, flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => isEdit && exportWordMutation.mutate({ id: Number(id) })}
          disabled={!isEdit || exportWordMutation.isPending}
          style={[
            styles.exportBtn,
            { flex: 1, backgroundColor: !isEdit || exportWordMutation.isPending ? colors.muted + "40" : "#1D4ED8" },
          ]}
        >
          {exportWordMutation.isPending ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>Generando Word…</Text>
            </View>
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>⬇ Exportar a Word</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => isEdit && exportPdfMutation.mutate({ id: Number(id) })}
          disabled={!isEdit || exportPdfMutation.isPending}
          style={[
            styles.exportBtn,
            { flex: 1, backgroundColor: !isEdit || exportPdfMutation.isPending ? colors.muted + "40" : "#B91C1C" },
          ]}
        >
          {exportPdfMutation.isPending ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>Generando PDF…</Text>
            </View>
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>⬇ Exportar a PDF</Text>
          )}
        </Pressable>
      </View>
      {!isEdit && (
        <View style={{ marginBottom: 16, marginTop: -10 }}>
          <Text style={[styles.helperText, { color: colors.muted }]}>
            Guarda un borrador primero para poder exportar.
          </Text>
        </View>
      )}

      <View style={[styles.summaryCard, { borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Información general</Text>
        {renderResumenLinea("Título", titulo)}
        {renderResumenLinea("Contexto", contexto)}
        {renderResumenLinea("Pregunta guía", preguntaGuia)}
        {renderResumenLinea("Objetivo general", objetivoGeneral)}
        {renderResumenLinea("Producto final", productoFinal)}
        {renderResumenLinea("Duración", duracion)}
        {renderResumenLinea("Metodología", metodologia)}
        {renderResumenLinea("Institución", institucion)}
      </View>

      <View style={[styles.summaryCard, { borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
          Áreas y articulación curricular ({areas.length})
        </Text>
        {areas.length === 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13 }}>Sin áreas agregadas.</Text>
        ) : (
          areas.map((a) => {
            const elementosArea = elementos.filter((e) => e.areaProyectoId === a.id);
            return (
              <View key={a.id} style={{ marginBottom: 10 }}>
                <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 13 }}>
                  {a.nombreArea} — {a.nivel} · {a.grado}
                </Text>
                {elementosArea.length === 0 ? (
                  <Text style={{ color: "#B45309", fontSize: 12 }}>
                    Sin elementos curriculares seleccionados.
                  </Text>
                ) : (
                  elementosArea.map((e) => (
                    <Text key={e.codigo} style={{ color: colors.muted, fontSize: 12 }}>
                      • {e.codigo} — {descripcionDeElemento(baseCurricular, e.codigo) ?? "no encontrado en el catálogo actual"}
                    </Text>
                  ))
                )}
              </View>
            );
          })
        )}
      </View>

      <View style={[styles.summaryCard, { borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
          Actividades ({actividades.length})
        </Text>
        {actividades.length === 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13 }}>Sin actividades.</Text>
        ) : (
          FASES_PROYECTO.map((f) => {
            const deFase = actividades.filter((a) => a.fase === f.key);
            if (deFase.length === 0) return null;
            return (
              <View key={f.key} style={{ marginBottom: 8 }}>
                <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 13 }}>{f.label}</Text>
                {deFase.map((a) => (
                  <Text key={a.id} style={{ color: colors.muted, fontSize: 12 }}>
                    • {a.actividad}
                    {a.instrumentoEvaluacion ? ` (${a.instrumentoEvaluacion})` : ""}
                  </Text>
                ))}
              </View>
            );
          })
        )}
      </View>

      <View style={[styles.summaryCard, { borderColor: colors.border }]}>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Evaluación</Text>
        {renderResumenLinea("Evaluación general", evaluacionGeneral)}
      </View>

      <View style={[styles.disclaimer, { borderColor: colors.border }]}>
        <Text style={[styles.disclaimerText, { color: colors.muted }]}>
          &quot;Generar proyecto&quot; exige: título, al menos un área con al menos un
          elemento curricular cada una, duración, producto final, al menos
          una actividad e información institucional. Si falta algo, se
          indicará exactamente qué.
        </Text>
      </View>
    </View>
  );

  const renderPasoActual = () => {
    if (paso === "informacion") return renderInformacion();
    if (paso === "areas") return renderAreas();
    if (paso === "articulacion") return renderArticulacion();
    if (paso === "actividades") return renderActividades();
    if (paso === "evaluacion") return renderEvaluacion();
    return renderRevision();
  };

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
            {baseCurricular === "destrezas"
              ? "Base: Destrezas con criterios de desempeño"
              : "Base: Competencias específicas (CNC)"}
          </Text>
          <Text className="text-sm text-muted mt-1">
            Integra varias áreas alrededor de un producto final común.
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
                onPress={() => {
                  if (i <= currentIdx) setPaso(p.key);
                }}
                style={styles.progressLink}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: isActive ? colors.primary : isDone ? colors.success : colors.muted,
                    fontWeight: isActive ? "700" : "400",
                    textDecorationLine: isDone ? "line-through" : "none",
                  }}
                >
                  {i + 1}. {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 20 }}>{renderPasoActual()}</View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.bottomBarInner}>
          {paso !== "informacion" ? (
            <Pressable
              onPress={retreatPaso}
              style={[styles.navBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>Anterior</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {!esUltimoPaso ? (
            <Pressable
              onPress={advancePaso}
              disabled={!canAdvance()}
              style={[styles.navBtn, { backgroundColor: canAdvance() ? colors.primary : colors.muted + "40" }]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Siguiente</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={handleGuardar}
                disabled={isPending || !sessionId}
                style={[
                  styles.navBtn,
                  { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, opacity: isPending || !sessionId ? 0.5 : 1 },
                ]}
              >
                <Text style={{ color: colors.foreground, fontWeight: "600" }}>Guardar borrador</Text>
              </Pressable>
              <Pressable
                onPress={handleGenerar}
                disabled={isPending || !sessionId}
                style={[styles.navBtn, { backgroundColor: isPending || !sessionId ? colors.muted + "40" : colors.primary }]}
              >
                {generando ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Generando…</Text>
                  </View>
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Generar proyecto</Text>
                )}
              </Pressable>
            </View>
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
  helperText: { fontSize: 12, marginBottom: 6, lineHeight: 16, fontStyle: "italic" },
  fieldGroup: { marginBottom: 14 },
  sectionCard: { borderWidth: 1, borderRadius: 12, overflow: "hidden" },
  sectionCardHeader: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  sectionCardBody: { padding: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sugerirBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  progressLinks: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  progressLink: {},
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  bottomBarInner: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },

  areaCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  areaCardTitle: { fontSize: 15, fontWeight: "700" },
  areaCardSub: { fontSize: 12, marginTop: 2 },

  addAreaBox: { borderWidth: 1, borderRadius: 12, borderStyle: "dashed", padding: 14 },
  addAreaBtn: { borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 4 },

  areaArticCard: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  areaArticTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  chipCode: { fontSize: 12, fontWeight: "700" },
  chipDesc: { fontSize: 11, maxWidth: 180 },

  listaContainer: { borderWidth: 1, borderRadius: 10, maxHeight: 260 },
  listaItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderBottomWidth: 1, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  listaCodigo: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  listaDesc: { fontSize: 12, lineHeight: 17 },

  subSectionTitle: { fontSize: 13, fontWeight: "700", marginTop: 4, marginBottom: 8 },
  actividadCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  actividadTexto: { fontSize: 14, fontWeight: "600" },
  actividadEvalCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },

  summaryCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  summaryRow: { flexDirection: "row", marginBottom: 6, gap: 8 },
  summaryLabel: { fontSize: 13, fontWeight: "600", width: 110 },
  summaryValue: { fontSize: 13, flex: 1 },
  disclaimer: { borderRadius: 10, borderWidth: 1, padding: 14, borderStyle: "dashed" },
  disclaimerText: { fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  exportBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  actividadDetalle: { fontSize: 12, marginTop: 2, lineHeight: 16 },
});
