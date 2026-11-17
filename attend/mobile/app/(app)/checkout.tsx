// S07 — Màn hình Chấm công ra
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { X, MapPin, Wifi, QrCode, LogIn, LogOut } from "lucide-react-native";
import { ClockButton } from "@/components/ui/ClockButton";
import { useStore } from "@/lib/store";
import { formatTime, formatDuration } from "@/lib/utils";
import { SEED_CHECKIN_RULES } from "@/lib/seed";

type CheckinMethod = "gps" | "wifi" | "qr";
type ClockState = "idle" | "verifying" | "success" | "error";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clockOut = useStore((s) => s.clockOut);
  const todayRecord = useStore((s) => s.todayRecord);

  const [method, setMethod] = useState<CheckinMethod>("gps");
  const [clockState, setClockState] = useState<ClockState>("idle");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);
      }
    } catch {
      setUserLat(SEED_CHECKIN_RULES.gps_lat!);
      setUserLng(SEED_CHECKIN_RULES.gps_lng!);
    }
  };

  const handleClockOut = async () => {
    if (clockState !== "idle") return;
    setClockState("verifying");
    try {
      await clockOut(method, userLat ?? undefined, userLng ?? undefined);
      setClockState("success");
      setTimeout(() => router.replace("/(app)/"), 1200);
    } catch (e: any) {
      setClockState("error");
      Alert.alert("Lỗi chấm công", e.message ?? "Thử lại sau.");
      setTimeout(() => setClockState("idle"), 2000);
    }
  };

  const clockInAt = todayRecord?.clock_in_at;
  const workedSoFar = clockInAt
    ? Math.round((currentTime.getTime() - new Date(clockInAt).getTime()) / 60000)
    : 0;

  const clockHH = currentTime.getHours().toString().padStart(2, "0");
  const clockMM = currentTime.getMinutes().toString().padStart(2, "0");
  const clockSS = currentTime.getSeconds().toString().padStart(2, "0");

  const methods: { key: CheckinMethod; label: string; icon: React.ReactNode }[] = [
    { key: "gps",  label: "GPS",  icon: <MapPin size={16} color={method==="gps" ? "#1e4fd4" : "#9ca3af"} /> },
    { key: "wifi", label: "WiFi", icon: <Wifi size={16} color={method==="wifi" ? "#1e4fd4" : "#9ca3af"} /> },
    { key: "qr",   label: "QR",   icon: <QrCode size={16} color={method==="qr" ? "#1e4fd4" : "#9ca3af"} /> },
  ];

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-lg font-semibold text-text">Chấm công ra</Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Đóng">
          <X size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Live clock */}
        <Text
          className="font-bold text-text"
          style={{ fontSize: 48, lineHeight: 56, letterSpacing: -1.5 }}
        >
          {clockHH}:{clockMM}
          <Text style={{ fontSize: 32, color: "#9ca3af" }}>:{clockSS}</Text>
        </Text>

        {/* Work summary */}
        <View className="w-full mt-5 mb-6 bg-bg-subtle rounded-card p-4 flex-row">
          <View className="flex-1 items-center">
            <View className="flex-row items-center gap-1 mb-1">
              <LogIn size={14} color="#15803d" />
              <Text className="text-xs text-text-muted">Đã vào</Text>
            </View>
            <Text className="text-base font-bold text-success">
              {formatTime(clockInAt)}
            </Text>
          </View>
          <View className="w-px bg-border" />
          <View className="flex-1 items-center">
            <View className="flex-row items-center gap-1 mb-1">
              <LogOut size={14} color="#b91c1c" />
              <Text className="text-xs text-text-muted">Thời gian làm</Text>
            </View>
            <Text className="text-base font-bold text-text">
              {formatDuration(workedSoFar)}
            </Text>
          </View>
        </View>

        {/* Method selector */}
        <View className="flex-row gap-2 mb-8 p-1 bg-surface rounded-sm w-full">
          {methods.map((m) => (
            <TouchableOpacity
              key={m.key}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xs ${
                method === m.key ? "bg-bg shadow-xs" : ""
              }`}
              onPress={() => setMethod(m.key)}
            >
              {m.icon}
              <Text className={`text-sm font-medium ${
                method === m.key ? "text-accent" : "text-text-muted"
              }`}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clock out button */}
        <ClockButton
          variant="clock-out"
          state={clockState}
          onPress={handleClockOut}
        />

        <Text className="text-xs text-text-subtle mt-6 text-center">
          Ca kết thúc lúc {SEED_CHECKIN_RULES ? "17:30" : ""} · Có thể chấm sau 30 phút
        </Text>
      </ScrollView>
    </View>
  );
}
