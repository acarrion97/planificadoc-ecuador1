import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>{"\uD83C\uDFE0"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>{"\uD83D\uDD0D"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="planes"
        options={{
          title: "Mis Planes",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>{"\uD83D\uDCCB"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: "Mi Cuenta",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>{"\uD83D\uDC64"}</Text>
          ),
        }}
      />
    </Tabs>
  );
}
