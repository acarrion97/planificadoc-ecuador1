import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { MarkdownDoc, parseMarkdown, plainText, type MdBlock } from "@/components/markdown-doc";
import { ScreenContainer } from "@/components/screen-container";
import { getApiBaseUrl } from "@/constants/oauth";
import { useColors } from "@/hooks/use-colors";

/**
 * Manual de usuario en línea `/ayuda/manual`: los capítulos viven como Markdown
 * en `public/manual/*.md` (generados con `scripts/manual-pdf-a-md.py`) y se
 * muestran aquí con índice lateral, buscador y navegación anterior/siguiente.
 * El PDF original se ofrece para descarga.
 */

interface Capitulo {
  file: string;
  title: string;
  id: string;
  sections: { title: string; id: string }[];
}
interface Indice {
  title: string;
  version: string;
  date: string;
  pdf: string;
  chapters: Capitulo[];
}

// En web los archivos salen del mismo origen (public/); en nativo, del dominio de la app.
const BASE = `${Platform.OS === "web" ? "" : getApiBaseUrl()}/manual/`;

let indiceCache: Indice | null = null;
const capCache = new Map<string, MdBlock[]>();

async function cargarIndice(): Promise<Indice> {
  if (indiceCache) return indiceCache;
  const r = await fetch(`${BASE}index.json`);
  if (!r.ok) throw new Error("No se pudo cargar el índice del manual");
  indiceCache = (await r.json()) as Indice;
  return indiceCache;
}

async function cargarCapitulo(file: string): Promise<MdBlock[]> {
  const hit = capCache.get(file);
  if (hit) return hit;
  const r = await fetch(`${BASE}${file}`);
  if (!r.ok) throw new Error("No se pudo cargar el capítulo");
  const blocks = parseMarkdown(await r.text());
  capCache.set(file, blocks);
  return blocks;
}

function normalizar(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface Hallazgo {
  cap: Capitulo;
  seccion: string | null;
  seccionId: string | null;
  fragmento: string;
}

export default function ManualScreen() {
  const colors = useColors();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ancho = width >= 960;
  const params = useLocalSearchParams<{ c?: string; s?: string }>();

  const [indice, setIndice] = useState<Indice | null>(null);
  const [blocks, setBlocks] = useState<MdBlock[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [hallazgos, setHallazgos] = useState<Hallazgo[] | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const headingY = useRef<Record<string, number>>({});
  const contenidoY = useRef(0);
  const pendienteScroll = useRef<string | null>(null);

  useEffect(() => {
    cargarIndice().then(setIndice).catch((e) => setError(String(e.message ?? e)));
  }, []);

  const capActual = useMemo(() => {
    if (!indice) return null;
    return indice.chapters.find((c) => c.id === params.c) ?? indice.chapters[0];
  }, [indice, params.c]);
  const idx = capActual && indice ? indice.chapters.indexOf(capActual) : -1;

  useEffect(() => {
    if (!capActual) return;
    let vivo = true;
    setBlocks(null);
    headingY.current = {};
    cargarCapitulo(capActual.file)
      .then((b) => vivo && setBlocks(b))
      .catch((e) => vivo && setError(String(e.message ?? e)));
    return () => {
      vivo = false;
    };
  }, [capActual]);

  // Al cambiar de capítulo/sección: sube al inicio o salta a la sección pedida.
  useEffect(() => {
    if (!blocks) return;
    pendienteScroll.current = params.s ?? null;
    if (!params.s) scrollRef.current?.scrollTo({ y: 0, animated: false });
    else setTimeout(irASeccion, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, params.s]);

  const irASeccion = useCallback(() => {
    const id = pendienteScroll.current;
    if (!id) return;
    const y = headingY.current[id];
    if (y != null) scrollRef.current?.scrollTo({ y: contenidoY.current + y + 8, animated: true });
  }, []);

  const onHeading = useCallback(
    (id: string, y: number) => {
      headingY.current[id] = y;
      if (pendienteScroll.current === id) setTimeout(irASeccion, 60);
    },
    [irASeccion]
  );

  const abrir = (cap: Capitulo, seccion?: string | null) => {
    router.setParams({ c: cap.id, s: seccion ?? "" } as any);
    setMenuAbierto(false);
    setConsulta("");
    setHallazgos(null);
  };

  // Buscador: carga los capítulos (una vez) y busca en párrafos, listas y tablas.
  useEffect(() => {
    const q = normalizar(consulta.trim());
    if (q.length < 3 || !indice) {
      setHallazgos(null);
      return;
    }
    let vivo = true;
    const t = setTimeout(async () => {
      const res: Hallazgo[] = [];
      for (const cap of indice.chapters) {
        let b: MdBlock[];
        try {
          b = await cargarCapitulo(cap.file);
        } catch {
          continue;
        }
        let sec: { title: string; id: string } | null = null;
        for (const bl of b) {
          if (bl.t === "h") {
            if (bl.lvl >= 2) sec = { title: bl.text, id: bl.id };
            if (normalizar(bl.text).includes(q))
              res.push({ cap, seccion: bl.lvl === 1 ? null : bl.text, seccionId: bl.lvl === 1 ? null : bl.id, fragmento: bl.text });
            continue;
          }
          const txt = bl.t === "table" ? [...bl.head, ...bl.rows.flat()].join(" · ") : bl.t === "img" ? "" : bl.text;
          const plano = plainText(txt);
          const pos = normalizar(plano).indexOf(q);
          if (pos >= 0 && res.length < 40) {
            const ini = Math.max(0, pos - 50);
            res.push({
              cap,
              seccion: sec?.title ?? null,
              seccionId: sec?.id ?? null,
              fragmento: (ini > 0 ? "…" : "") + plano.slice(ini, pos + q.length + 90) + "…",
            });
          }
        }
      }
      if (vivo) setHallazgos(res.slice(0, 40));
    }, 250);
    return () => {
      vivo = false;
      clearTimeout(t);
    };
  }, [consulta, indice]);

  const pdfUrl = indice ? `${BASE}${indice.pdf}` : `${BASE}manual-usuario-planificadoc-v1.0.pdf`;

  const Indice_ = (
    <View style={{ gap: 4 }}>
      {indice?.chapters.map((c) => {
        const activo = c.id === capActual?.id;
        return (
          <View key={c.id}>
            <Pressable
              onPress={() => abrir(c)}
              accessibilityRole="button"
              accessibilityState={{ selected: activo }}
              style={({ pressed }) => ({
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: activo ? colors.brandFg + "1A" : pressed ? colors.muted + "1A" : "transparent",
              })}
            >
              <Text style={{ color: activo ? colors.brandFg : colors.foreground, fontSize: 14, fontWeight: activo ? "800" : "600" }}>
                {c.title}
              </Text>
            </Pressable>
            {activo &&
              c.sections.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => abrir(c, s.id)}
                  accessibilityRole="link"
                  style={({ pressed }) => ({ paddingVertical: 5, paddingLeft: 22, paddingRight: 8, opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{ color: params.s === s.id ? colors.brandFg : colors.muted, fontSize: 13, fontWeight: params.s === s.id ? "700" : "400" }}>
                    {s.title}
                  </Text>
                </Pressable>
              ))}
          </View>
        );
      })}
    </View>
  );

  const buscador = (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 12,
        }}
      >
        <MaterialCommunityIcons name="magnify" size={20} color={colors.muted} />
        <TextInput
          value={consulta}
          onChangeText={setConsulta}
          placeholder="Buscar en el manual"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Buscar en el manual"
          style={{ flex: 1, paddingVertical: 10, color: colors.foreground, fontSize: 15 }}
        />
        {consulta.length > 0 && (
          <Pressable onPress={() => setConsulta("")} accessibilityLabel="Limpiar búsqueda" hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const resultados =
    consulta.trim().length >= 3 ? (
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          {hallazgos == null ? "Buscando…" : hallazgos.length === 0 ? `Sin resultados para “${consulta}”.` : `${hallazgos.length} resultado(s)`}
        </Text>
        {hallazgos?.map((h, i) => (
          <Pressable
            key={i}
            onPress={() => abrir(h.cap, h.seccionId)}
            accessibilityRole="link"
            style={({ pressed }) => ({
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              padding: 12,
              gap: 3,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: colors.brandFg, fontSize: 12, fontWeight: "700" }}>
              {h.cap.title}
              {h.seccion ? `  ›  ${h.seccion}` : ""}
            </Text>
            <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19 }}>{h.fragmento}</Text>
          </Pressable>
        ))}
      </View>
    ) : null;

  const botonPdf = (
    <Pressable
      onPress={() => Linking.openURL(pdfUrl)}
      accessibilityRole="link"
      accessibilityLabel="Descargar el manual en PDF"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        backgroundColor: colors.brand,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <MaterialCommunityIcons name="file-pdf-box" size={18} color="#FFFFFF" />
      <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>Descargar PDF</Text>
    </Pressable>
  );

  const navegacion = capActual && indice && (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginTop: 24 }}>
      {idx > 0 ? (
        <Pressable
          onPress={() => abrir(indice.chapters[idx - 1])}
          accessibilityRole="link"
          style={({ pressed }) => ({ flex: 1, minWidth: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={{ color: colors.muted, fontSize: 12 }}>‹ Anterior</Text>
          <Text style={{ color: colors.brandFg, fontSize: 14, fontWeight: "700" }}>{indice.chapters[idx - 1].title}</Text>
        </Pressable>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {idx < indice.chapters.length - 1 ? (
        <Pressable
          onPress={() => abrir(indice.chapters[idx + 1])}
          accessibilityRole="link"
          style={({ pressed }) => ({ flex: 1, minWidth: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, backgroundColor: colors.surface, alignItems: "flex-end", opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={{ color: colors.muted, fontSize: 12 }}>Siguiente ›</Text>
          <Text style={{ color: colors.brandFg, fontSize: 14, fontWeight: "700" }}>{indice.chapters[idx + 1].title}</Text>
        </Pressable>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </View>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View style={{ flex: 1, flexDirection: "row", width: "100%", maxWidth: 1240, alignSelf: "center" }}>
        {ancho && (
          <ScrollView style={{ width: 290, borderRightWidth: 1, borderRightColor: colors.border }} contentContainerStyle={{ padding: 16, gap: 14 }}>
            <Pressable onPress={() => router.push("/ayuda" as any)} accessibilityRole="link" hitSlop={6} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialCommunityIcons name="chevron-left" size={18} color={colors.brandFg} />
              <Text style={{ color: colors.brandFg, fontSize: 13, fontWeight: "700" }}>Ayuda</Text>
            </Pressable>
            {buscador}
            {Indice_}
          </ScrollView>
        )}

        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: "100%", maxWidth: 860, alignSelf: "center", gap: 16 }}>
            {!ancho && (
              <View style={{ gap: 12 }}>
                <Pressable onPress={() => router.push("/ayuda" as any)} accessibilityRole="link" hitSlop={6} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialCommunityIcons name="chevron-left" size={18} color={colors.brandFg} />
                  <Text style={{ color: colors.brandFg, fontSize: 13, fontWeight: "700" }}>Ayuda</Text>
                </Pressable>
                {buscador}
                <Pressable
                  onPress={() => setMenuAbierto((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: menuAbierto }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 10, padding: 12 }}
                >
                  <MaterialCommunityIcons name="format-list-bulleted" size={18} color={colors.brandFg} />
                  <Text style={{ flex: 1, color: colors.foreground, fontSize: 14, fontWeight: "700" }}>Contenido del manual</Text>
                  <MaterialCommunityIcons name={menuAbierto ? "chevron-up" : "chevron-down"} size={20} color={colors.muted} />
                </Pressable>
                {menuAbierto && Indice_}
              </View>
            )}

            <View style={{ gap: 6 }}>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 0.5 }}>
                MANUAL DE USUARIO · VERSIÓN {indice?.version ?? "1.0"}
              </Text>
              {botonPdf}
            </View>

            {resultados}

            {!resultados && error && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: colors.error, fontSize: 14 }}>No se pudo cargar el manual en línea. Puedes descargarlo en PDF.</Text>
              </View>
            )}
            {!resultados && !error && !blocks && <ActivityIndicator color={colors.brandFg} style={{ marginTop: 40 }} />}
            {!resultados && blocks && (
              <View onLayout={(e) => (contenidoY.current = e.nativeEvent.layout.y)}>
                <MarkdownDoc blocks={blocks} baseUrl={BASE} onLayoutHeading={onHeading} />
                {navegacion}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
