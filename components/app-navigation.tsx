/**
 * Navegación principal de PlanificaDoc (spec `navegacion-principal`).
 *
 * Dos presentaciones sobre el mismo modelo de items:
 *  - Escritorio / tablet (≥768px): sidebar izquierdo persistente, expandido a
 *    240px (≥1024px) o colapsado a 64px, con control manual de colapso.
 *  - Móvil (<768px): encabezado con `☰` + drawer lateral.
 *
 * La navegación vive en el layout RAÍZ (`app/_layout.tsx`) para que siga
 * disponible también en pantallas profundas (detalle de destreza, wizards),
 * como exige el escenario "Navegación desde cualquier pantalla" del spec.
 * El nombre del grupo de rutas `(tabs)` se conserva sin cambios (design D1).
 */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useColors } from "@/hooks/use-colors";

export type NavKey = "inicio" | "crear" | "explorar" | "planes" | "cuenta" | "ayuda";

type NavIcon = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export interface NavDef {
  key: NavKey;
  label: string;
  href: string;
  icon: NavIcon;
}

/** Breakpoints por ancho de viewport (design D2). */
export const NAV_BREAKPOINTS = { mobile: 768, expanded: 1024 } as const;
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const DRAWER_WIDTH = 280;

/** Zona principal: ir a una sección. */
export const NAV_PRINCIPAL: NavDef[] = [
  { key: "inicio", label: "Inicio", href: "/", icon: "home-variant" },
  { key: "crear", label: "Crear", href: "/crear", icon: "plus-circle" },
  { key: "explorar", label: "Explorar", href: "/explorar", icon: "book-open-variant" },
  { key: "planes", label: "Mis planes", href: "/planes", icon: "clipboard-text" },
];

/** Zona gestión: configuración y ayuda. */
export const NAV_GESTION: NavDef[] = [
  { key: "cuenta", label: "Mi cuenta", href: "/cuenta", icon: "account-circle" },
  { key: "ayuda", label: "Ayuda", href: "/ayuda", icon: "help-circle" },
];

const TAB_SECTION: Record<string, NavKey> = {
  index: "inicio",
  explorar: "explorar",
  planes: "planes",
  cuenta: "cuenta",
};

/**
 * Resuelve la sección activa a partir de los segmentos de ruta.
 * Devuelve `null` en pantallas profundas (el componente conserva la última
 * sección conocida = "sección de origen").
 */
export function resolveNavSection(segments: readonly string[]): NavKey | null {
  const head = segments[0];
  if (head === "(tabs)") return TAB_SECTION[segments[1] ?? "index"] ?? "inicio";
  if (head === "crear") return "crear";
  if (head === "ayuda") return "ayuda";
  if (head === "paywall" || head === "oauth") return null;
  // Pantallas profundas: destreza, planificar, ver-plan, previews, etc.
  if (head === "destreza" || head === "planificar" || head === "explorar") return "explorar";
  if (head === "ver-plan" || head === "ver-semana" || head === "ver-cnc" || head === "ver-evaluacion") {
    return "planes";
  }
  return null;
}

/** ¿La ruta actual debe mostrar la navegación? (paywall/oauth son plenas) */
export function shouldShowNavigation(segments: readonly string[]): boolean {
  const head = segments[0];
  return head !== "paywall" && head !== "oauth";
}

// ─── Ítem de navegación ────────────────────────────────────────────────────

interface NavItemProps {
  item: NavDef;
  active: boolean;
  collapsed: boolean;
  onPress: () => void;
}

function NavItem({ item, active, collapsed, onPress }: NavItemProps) {
  const colors = useColors();
  const isCrear = item.key === "crear";

  const background = active
    ? colors.brand
    : isCrear
      ? colors.brand + "14"
      : "transparent";
  const foreground = active ? "#FFFFFF" : isCrear ? colors.brand : colors.muted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: background,
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: collapsed ? 0 : 12,
        justifyContent: collapsed ? "center" : "flex-start",
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <MaterialCommunityIcons name={item.icon} size={22} color={foreground} />
      {!collapsed && (
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: foreground,
            fontSize: 14,
            fontWeight: isCrear || active ? "700" : "500",
          }}
        >
          {item.label}
        </Text>
      )}
      {!collapsed && isCrear && !active && (
        <MaterialCommunityIcons name="arrow-right" size={16} color={foreground} />
      )}
    </Pressable>
  );
}

// ─── Cuerpo compartido de sidebar y drawer ────────────────────────────────

interface NavBodyProps {
  active: NavKey;
  collapsed: boolean;
  onNavigate: () => void;
}

function NavBody({ active, collapsed, onNavigate }: NavBodyProps) {
  const colors = useColors();
  const router = useRouter();

  const go = (item: NavDef) => {
    router.push(item.href as any);
    onNavigate();
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: collapsed ? 8 : 14, paddingTop: 14 }}>
      {/* Zona principal */}
      <View style={{ gap: 4 }}>
        {NAV_PRINCIPAL.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            active={active === item.key}
            collapsed={collapsed}
            onPress={() => go(item)}
          />
        ))}
      </View>

      <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

      {/* Zona gestión */}
      <View style={{ gap: 4 }}>
        {NAV_GESTION.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            active={active === item.key}
            collapsed={collapsed}
            onPress={() => go(item)}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* Marca al pie */}
      {!collapsed && (
        <View style={{ paddingBottom: 12 }}>
          <Text style={{ color: colors.brand, fontSize: 13, fontWeight: "800" }}>
            PlanificaDoc Ecuador
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Sidebar persistente (escritorio / tablet) ────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  active: NavKey;
}

function Sidebar({ collapsed, onToggle, active }: SidebarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        paddingTop: insets.top,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      }}
    >
      {/* Marca / monograma + control de colapso */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          paddingHorizontal: collapsed ? 0 : 14,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {collapsed ? (
          <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "800" }}>PD</Text>
        ) : (
          <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "800" }}>
            PlanificaDoc
          </Text>
        )}
        {!collapsed && (
          <Pressable
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel="Colapsar navegación"
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {collapsed && (
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel="Expandir navegación"
          style={({ pressed }) => ({
            alignItems: "center",
            paddingVertical: 6,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
        </Pressable>
      )}

      <NavBody active={active} collapsed={collapsed} onNavigate={() => {}} />
    </View>
  );
}

// ─── Móvil: encabezado + drawer ───────────────────────────────────────────

function MobileHeader({ onMenu, section }: { onMenu: () => void; section: NavDef | undefined }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          height: 52,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          gap: 10,
        }}
      >
        <Pressable
          onPress={onMenu}
          accessibilityRole="button"
          accessibilityLabel="Abrir navegación"
          hitSlop={8}
          style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}
        >
          <MaterialCommunityIcons name="menu" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "800" }}>
          PlanificaDoc
        </Text>
        <View style={{ flex: 1 }} />
        {section && (
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600" }}>
            {section.label}
          </Text>
        )}
      </View>
    </View>
  );
}

interface DrawerProps {
  open: boolean;
  active: NavKey;
  onClose: () => void;
}

function Drawer({ open, active, onClose }: DrawerProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "rgba(15, 23, 42, 0.45)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar navegación"
          onPress={onClose}
          style={{ width: DRAWER_WIDTH + 40 }}
        />
        <View
          style={{
            width: DRAWER_WIDTH,
            paddingTop: insets.top,
            backgroundColor: colors.surface,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "800" }}>
              PlanificaDoc
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar navegación"
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
            >
              <MaterialCommunityIcons name="close" size={20} color={colors.muted} />
            </Pressable>
          </View>
          <NavBody active={active} collapsed={false} onNavigate={onClose} />
        </View>
      </View>
    </Modal>
  );
}

// ─── Contenedor raíz ──────────────────────────────────────────────────────

export function AppNavigation({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const segments = useSegments();

  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<NavKey>("inicio");

  const resolved = resolveNavSection(segments);

  // Conserva la última sección conocida en pantallas profundas (design: la
  // navegación "marca la sección de origen").
  useEffect(() => {
    if (resolved) setActive(resolved);
  }, [resolved]);

  const showNav = shouldShowNavigation(segments);

  const isMobile = width < NAV_BREAKPOINTS.mobile;
  // Colapso: decisión del usuario si la hay; si no, colapsado en tablet.
  const collapsed = collapsedOverride ?? width < NAV_BREAKPOINTS.expanded;

  const toggleCollapse = useCallback(() => {
    setCollapsedOverride((prev) => {
      const current = prev ?? width < NAV_BREAKPOINTS.expanded;
      return !current;
    });
  }, [width]);

  const sectionDef = [...NAV_PRINCIPAL, ...NAV_GESTION].find((i) => i.key === active);

  // Cierra el drawer al cambiar de ruta por cualquier otro medio.
  const rutaActual = segments.join("/");
  useEffect(() => {
    setDrawerOpen(false);
  }, [rutaActual]);

  if (!showNav) {
    return <View style={{ flex: 1, backgroundColor: colors.background }}>{children}</View>;
  }

  if (isMobile) {
    // El encabezado consume el safe-area superior; para que las pantallas no lo
    // repliquen, se les entrega top = 0 (design D8 / riesgo R2).
    const contentInsets = { ...insets, top: 0 };

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <MobileHeader onMenu={() => setDrawerOpen(true)} section={sectionDef} />
        <SafeAreaInsetsContext.Provider value={contentInsets}>
          <View style={{ flex: 1, paddingBottom: insets.bottom }}>{children}</View>
        </SafeAreaInsetsContext.Provider>
        <Drawer open={drawerOpen} active={active} onClose={() => setDrawerOpen(false)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: colors.background }}>
      <Sidebar collapsed={collapsed} onToggle={toggleCollapse} active={active} />
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>{children}</View>
    </View>
  );
}
