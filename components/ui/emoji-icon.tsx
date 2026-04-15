import { Text, type StyleProp, type TextStyle } from "react-native";

/**
 * Mapeo centralizado de nombres de íconos a emojis Unicode.
 * Esto garantiza que los emojis se rendericen correctamente en todas las plataformas
 * (iOS, Android, Web) sin depender de fuentes de íconos externas.
 */
const EMOJI_MAP: Record<string, string> = {
  // Navegación
  "arrow-back": "\u2190",
  "chevron-right": "\u203A",
  "expand-more": "\u25BC",
  "expand-less": "\u25B2",
  "close": "\u2715",

  // Áreas curriculares
  "calculate": "\uD83D\uDCCA", // 📊
  "menu-book": "\uD83D\uDCD6", // 📖
  "science": "\uD83E\uDD89", // 🔬 → using 🦉 for nature, let's use proper
  "public": "\uD83C\uDF0D", // 🌍
  "sports-soccer": "\u26BD", // ⚽
  "palette": "\uD83C\uDFA8", // 🎨

  // Acciones
  "search": "\uD83D\uDD0D", // 🔍
  "search-off": "\uD83D\uDD0E", // 🔎
  "edit": "\u270F\uFE0F", // ✏️
  "edit-note": "\uD83D\uDCDD", // 📝
  "save": "\uD83D\uDCBE", // 💾
  "delete": "\uD83D\uDDD1\uFE0F", // 🗑️
  "delete-outline": "\uD83D\uDDD1\uFE0F", // 🗑️
  "check": "\u2714\uFE0F", // ✔️
  "check-circle": "\u2705", // ✅
  "auto-awesome": "\u2728", // ✨

  // Información
  "info": "\u2139\uFE0F", // ℹ️
  "error-outline": "\u26A0\uFE0F", // ⚠️
  "flag": "\uD83C\uDFF3\uFE0F", // 🏳️ → 🎯
  "star": "\u2B50", // ⭐
  "school": "\uD83C\uDFEB", // 🏫
  "description": "\uD83D\uDCC4", // 📄
  "note": "\uD83D\uDCCC", // 📌
  "view-module": "\uD83D\uDCE6", // 📦

  // Tiempo y calendario
  "schedule": "\u23F0", // ⏰
  "event": "\uD83D\uDCC5", // 📅

  // Evaluación
  "assessment": "\uD83D\uDCCA", // 📊
  "checklist": "\u2611\uFE0F", // ☑️
  "inventory": "\uD83D\uDCE6", // 📦

  // Fases de clase
  "lightbulb": "\uD83D\uDCA1", // 💡
  "build": "\uD83D\uDD27", // 🔧

  // PDF y exportación
  "picture-as-pdf": "\uD83D\uDCC4", // 📄

  // Accesibilidad
  "accessibility": "\u267F", // ♿

  // Otros
  "assignment": "\uD83D\uDCCB", // 📋
  "home": "\uD83C\uDFE0", // 🏠
};

// Emojis específicos para áreas curriculares (más representativos)
export const AREA_EMOJIS: Record<string, string> = {
  M: "\uD83D\uDD22",     // 🔢
  LL: "\uD83D\uDCD6",    // 📖
  CN: "\uD83E\uDD89",    // 🔬 → 🦉 → let's use 🧪
  CS: "\uD83C\uDF0D",    // 🌍
  EF: "\u26BD",           // ⚽
  ECA: "\uD83C\uDFA8",   // 🎨
};

export interface EmojiIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Componente de ícono basado en emojis Unicode.
 * Reemplaza MaterialIcons para garantizar renderizado correcto en todas las plataformas.
 */
export function EmojiIcon({ name, size = 24, color, style }: EmojiIconProps) {
  const emoji = EMOJI_MAP[name] || "\u2022"; // fallback: bullet
  return (
    <Text
      style={[
        {
          fontSize: size * 0.85,
          lineHeight: size * 1.2,
          textAlign: "center" as const,
          width: size,
          height: size * 1.2,
        },
        style,
      ]}
      allowFontScaling={false}
    >
      {emoji}
    </Text>
  );
}

/**
 * Obtiene el emoji para un nombre de ícono dado.
 */
export function getEmoji(name: string): string {
  return EMOJI_MAP[name] || "\u2022";
}
