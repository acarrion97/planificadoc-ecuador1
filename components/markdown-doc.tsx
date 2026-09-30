import { memo, useEffect, useMemo, useState } from "react";
import { Image, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

/**
 * Renderizador mínimo de Markdown para el Manual de usuario (`/ayuda/manual`).
 * Soporta solo el subconjunto que produce `scripts/manual-pdf-a-md.py`:
 * encabezados #–###, párrafos, listas (con anidación), imágenes, citas como
 * avisos (Nota/Consejo/Importante), tablas y **negrita** / *cursiva* / `código`.
 */

export type MdBlock =
  | { t: "h"; lvl: 1 | 2 | 3; text: string; id: string }
  | { t: "p"; text: string }
  | { t: "li"; lvl: number; ord: number | null; text: string }
  | { t: "img"; alt: string; src: string }
  | { t: "quote"; text: string }
  | { t: "table"; head: string[]; rows: string[][] };

export function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.replace(/\\\|/g, "|").trim());

export function parseMarkdown(src: string): MdBlock[] {
  const lines = src.split(/\r?\n/);
  const out: MdBlock[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ t: "p", text: para.join(" ") });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) {
      flush();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = l.match(/^(#{1,3})\s+(.*)$/))) {
      flush();
      out.push({ t: "h", lvl: m[1].length as 1 | 2 | 3, text: m[2], id: slugify(m[2]) });
    } else if ((m = l.match(/^!\[(.*?)\]\((.*?)\)\s*$/))) {
      flush();
      out.push({ t: "img", alt: m[1], src: m[2] });
    } else if (l.startsWith(">")) {
      flush();
      out.push({ t: "quote", text: l.replace(/^>\s?/, "") });
    } else if (l.startsWith("|")) {
      flush();
      const head = splitRow(l);
      i += 2; // fila de encabezado + separador
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(splitRow(lines[i++]));
      i--;
      out.push({ t: "table", head, rows });
    } else if ((m = l.match(/^(\s*)(-|\d+\.)\s+(.*)$/))) {
      flush();
      out.push({
        t: "li",
        lvl: Math.floor(m[1].length / 2),
        ord: m[2] === "-" ? null : parseInt(m[2], 10),
        text: m[3],
      });
    } else {
      para.push(l.trim());
    }
  }
  flush();
  return out;
}

/** Texto plano (sin marcas) de un bloque, para el buscador. */
export function plainText(s: string) {
  return s.replace(/[*`]/g, "");
}

// ── Inline ────────────────────────────────────────────────────────────────

function Inline({ text, color, size, weight }: { text: string; color: string; size: number; weight?: "700" }) {
  const colors = useColors();
  const parts = useMemo(() => {
    const res: { s: string; b?: boolean; i?: boolean; c?: boolean }[] = [];
    const re = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) res.push({ s: text.slice(last, m.index) });
      const tok = m[0];
      if (tok.startsWith("***")) res.push({ s: tok.slice(3, -3), b: true, i: true });
      else if (tok.startsWith("**")) res.push({ s: tok.slice(2, -2), b: true });
      else if (tok.startsWith("`")) res.push({ s: tok.slice(1, -1), c: true });
      else res.push({ s: tok.slice(1, -1), i: true });
      last = m.index + tok.length;
    }
    if (last < text.length) res.push({ s: text.slice(last) });
    return res;
  }, [text]);

  return (
    <Text style={{ color, fontSize: size, lineHeight: size * 1.55, fontWeight: weight }}>
      {parts.map((p, k) => {
        if (p.c) {
          return (
            <Text key={k} style={{ fontFamily: Platform.OS === "web" ? "monospace" : undefined, fontSize: size - 1, color: colors.foreground, backgroundColor: colors.muted + "22" }}>
              {p.s}
            </Text>
          );
        }
        return (
          <Text key={k} style={{ fontWeight: p.b ? "700" : undefined, fontStyle: p.i ? "italic" : undefined }}>
            {p.s}
          </Text>
        );
      })}
    </Text>
  );
}

/** Muestra de color para códigos #RRGGBB de la paleta. */
function Swatch({ hex }: { hex: string }) {
  return <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: hex, marginRight: 6, borderWidth: 1, borderColor: "#00000033" }} />;
}

// ── Imagen con proporción real ────────────────────────────────────────────

function MdImage({ uri, alt }: { uri: string; alt: string }) {
  const colors = useColors();
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    let vivo = true;
    Image.getSize(
      uri,
      (w, h) => vivo && h > 0 && setRatio(w / h),
      () => vivo && setRatio(1.6)
    );
    return () => {
      vivo = false;
    };
  }, [uri]);
  return (
    <Pressable
      onPress={() => Linking.openURL(uri)}
      accessibilityRole="imagebutton"
      accessibilityLabel={alt ? `${alt} (abrir en tamaño completo)` : "Abrir imagen en tamaño completo"}
      style={{ width: "100%", alignItems: "center" }}
    >
      <Image
        source={{ uri }}
        accessibilityLabel={alt}
        resizeMode="contain"
        style={{
          width: "100%",
          maxWidth: 820,
          aspectRatio: ratio ?? 1.6,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          backgroundColor: colors.surface,
        }}
      />
    </Pressable>
  );
}

// ── Bloques ───────────────────────────────────────────────────────────────

const CALLOUT: Record<string, "brandFg" | "success" | "warning" | "error"> = {
  Nota: "brandFg",
  Consejo: "success",
  Importante: "warning",
  Advertencia: "error",
  Atención: "error",
};

const Block = memo(function Block({
  b,
  baseUrl,
  onLayoutHeading,
}: {
  b: MdBlock;
  baseUrl: string;
  onLayoutHeading?: (id: string, y: number) => void;
}) {
  const colors = useColors();
  switch (b.t) {
    case "h": {
      const size = b.lvl === 1 ? 28 : b.lvl === 2 ? 21 : 17;
      return (
        <View
          onLayout={(e) => onLayoutHeading?.(b.id, e.nativeEvent.layout.y)}
          style={{
            marginTop: b.lvl === 1 ? 0 : b.lvl === 2 ? 18 : 6,
            paddingBottom: b.lvl === 2 ? 6 : 0,
            borderBottomWidth: b.lvl <= 2 ? 1 : 0,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            accessibilityRole="header"
            style={{ color: b.lvl === 3 ? colors.foreground : colors.brandFg, fontSize: size, fontWeight: "800", lineHeight: size * 1.3 }}
          >
            {b.text}
          </Text>
        </View>
      );
    }
    case "p":
      return <Inline text={b.text} color={colors.foreground} size={15} />;
    case "li":
      return (
        <View style={{ flexDirection: "row", gap: 8, paddingLeft: 6 + b.lvl * 20 }}>
          <Text style={{ color: colors.brandFg, fontSize: 15, lineHeight: 23, minWidth: 18, fontWeight: "700" }}>
            {b.ord ? `${b.ord}.` : "•"}
          </Text>
          <View style={{ flex: 1 }}>
            <Inline text={b.text} color={colors.foreground} size={15} />
          </View>
        </View>
      );
    case "img":
      return <MdImage uri={b.src.startsWith("http") ? b.src : `${baseUrl}${b.src}`} alt={b.alt} />;
    case "quote": {
      const m = b.text.match(/^\*\*(Nota|Consejo|Importante|Advertencia|Atención):\*\*\s*(.*)$/);
      const tone = colors[m ? CALLOUT[m[1]] : "brandFg"];
      return (
        <View style={{ borderLeftWidth: 4, borderLeftColor: tone, backgroundColor: tone + "14", borderRadius: 8, padding: 12 }}>
          <Inline text={m ? `**${m[1]}:** ${m[2]}` : b.text} color={colors.foreground} size={14} />
        </View>
      );
    }
    case "table": {
      const n = Math.max(b.head.length, ...b.rows.map((r) => r.length));
      const sinEncabezado = b.head.every((h) => !h);
      const cell = (txt: string, head: boolean, k: number, last: boolean) => {
        const hex = txt.match(/`(#[0-9A-Fa-f]{6})`/);
        return (
          <View
            key={k}
            style={{
              flex: 1,
              minWidth: n > 2 ? 150 : 120,
              padding: 10,
              borderRightWidth: last ? 0 : 1,
              borderRightColor: colors.border,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {hex && k === 0 ? <Swatch hex={hex[1]} /> : null}
            <View style={{ flex: 1 }}>
              <Inline text={hex && k === 0 ? txt.replace(/`#[0-9A-Fa-f]{6}`/, (x) => x.slice(1, -1)) : txt} color={colors.foreground} size={13} weight={head ? "700" : undefined} />
            </View>
          </View>
        );
      };
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
          <View style={{ minWidth: "100%" as any }}>
            {!sinEncabezado && (
              <View style={{ flexDirection: "row", backgroundColor: colors.brandFg + "14", borderBottomWidth: 1, borderBottomColor: colors.border }}>
                {Array.from({ length: n }, (_, k) => cell(b.head[k] ?? "", true, k, k === n - 1))}
              </View>
            )}
            {b.rows.map((r, ri) => (
              <View
                key={ri}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: ri === b.rows.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                  backgroundColor: ri % 2 ? colors.muted + "0D" : "transparent",
                }}
              >
                {Array.from({ length: n }, (_, k) => cell(r[k] ?? "", false, k, k === n - 1))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }
  }
});

export function MarkdownDoc({
  blocks,
  baseUrl,
  onLayoutHeading,
}: {
  blocks: MdBlock[];
  baseUrl: string;
  onLayoutHeading?: (id: string, y: number) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      {blocks.map((b, i) => (
        <Block key={i} b={b} baseUrl={baseUrl} onLayoutHeading={onLayoutHeading} />
      ))}
    </View>
  );
}
