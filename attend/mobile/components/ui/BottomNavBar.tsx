import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { House, Clock3, Calendar, User } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

const TABS = [
  { key: "home",     label: "Trang chủ",  icon: House,     href: "/(app)/" },
  { key: "history",  label: "Lịch sử",    icon: Clock3,    href: "/(app)/history" },
  { key: "schedule", label: "Lịch làm",   icon: Calendar,  href: "/(app)/schedule" },
  { key: "profile",  label: "Cá nhân",    icon: User,      href: "/(app)/profile" },
] as const;

export function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      accessibilityRole="navigation"
      accessibilityLabel="Điều hướng chính"
      style={{
        paddingBottom: insets.bottom,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#dde1e7",
      }}
    >
      <View className="flex-row" style={{ height: 64 }}>
        {TABS.map(({ key, label, icon: Icon, href }) => {
          const isActive = pathname.startsWith(href.replace("/(app)", "").replace(/\/$/, "") || "/");
          const isHome = href === "/(app)/";
          const active = isHome
            ? pathname === "/" || pathname === "/(app)/"
            : pathname.includes(key);

          return (
            <TouchableOpacity
              key={key}
              className="flex-1 items-center justify-center gap-0.5"
              style={{ minHeight: 44 }}
              onPress={() => router.push(href as any)}
              accessibilityRole="link"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
            >
              <View
                style={active ? {
                  width: 32, height: 2, backgroundColor: "#1e4fd4",
                  position: "absolute", top: 8, borderRadius: 1,
                } : undefined}
              />
              <Icon
                size={22}
                color={active ? "#1e4fd4" : "#9ca3af"}
                strokeWidth={active ? 2.5 : 1.75}
              />
              <Text
                className={active ? "text-xs font-medium text-accent" : "text-xs text-text-subtle"}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
