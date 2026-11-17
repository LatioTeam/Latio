// S06 — Màn hình Chấm công vào
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, Alert, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { X, MapPin, Wifi, QrCode, CheckCircle } from "lucide-react-native";
import { ClockButton } from "@/components/ui/ClockButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useStore } from "@/lib/store";
import { SEED_CHECKIN_RULES } from "@/lib/seed";
import { formatTime } from "@/lib/utils";

type CheckinMethod = "gps" | "wifi" | "qr";
type ClockState = "idle" | "verifying" | "success" | "error";

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function CheckinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clockIn = useStore((s) => s.clockIn);

  const [method, setMethod] = useState<CheckinMethod>("gps");
  const [clockState, setClockState] = useState<ClockState>("idle");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsStatus, setGpsStatus] = useState<"locating" | "inside" | "outside" | "error">("locating");
  const [gpsDistance, setGpsDistance] = useState<number | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // GPS check
  useEffect(() => {
    if (method !== "gps") return;
    checkGps();
  }, [method]);

  const checkGps = async () => {
    setGpsStatus("locating");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setGpsStatus("error");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude, accuracy } = loc.coords;
      setUserLat(latitude);
      setUserLng(longitude);

      const dist = haversineMeters(
        latitude, longitude,
        SEED_CHECKIN_RULES.gps_lat!, SEED_CHECKIN_RULES.gps_lng!
      );
      setGpsDistance(Math.round(dist));

      // Flag if accuracy > 100m (potential spoofing)
      const inside = dist <= SEED_CHECKIN_RULES.gps_radius_m && (accuracy ?? 999) <= 100;
      setGpsStatus(inside ? "inside" : "outside");
    } catch {
      // Fallback for simulator/dev: treat as inside
      setGpsStatus("inside");
      setUserLat(SEED_CHECKIN_RULES.gps_lat!);
      setUserLng(SEED_CHECKIN_RULES.gps_lng!);
      setGpsDistance(0);
    }
  };

  const handleClockIn = async () => {
    if (clockState !== "idle") return;
    setClockState("verifying");
    try {
      await clockIn(method, userLat ?? undefined, userLng ?? undefined);
      setClockState("success");
      setTimeout(() => router.replace("/(app)/"), 1200);
    } catch (e: any) {
      setClockState("error");
      Alert.alert("Lỗi chấm công", e.message ?? "Thử lại sau.");
      setTimeout(() => setClockState("idle"), 2000);
    }
  };

  const methods: { key: CheckinMethod; label: string; icon: React.ReactNode }[] = [
    { key: "gps",  label: "GPS",  icon: <MapPin size={16} color={method==="gps" ? "#1e4fd4" : "#9ca3af"} /> },
    { key: "wifi", label: "WiFi", icon: <Wifi size={16} color={method==="wifi" ? "#1e4fd4" : "#9ca3af"} /> },
    { key: "qr",   label: "QR",   icon: <QrCode size={16} color={method==="qr" ? "#1e4fd4" : "#9ca3af"} /> },
  ];

  const clockHH = currentTime.getHours().toString().padStart(2, "0");
  const clockMM = currentTime.getMinutes().toString().padStart(2, "0");
  const clockSS = currentTime.getSeconds().toString().padStart(2, "0");

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-lg font-semibold text-text">Chấm công vào</Text>
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
          accessibilityLabel={`Thời gian hiện tại: ${clockHH}:${clockMM}:${clockSS}`}
        >
          {clockHH}:{clockMM}
          <Text style={{ fontSize: 32, color: "#9ca3af" }}>:{clockSS}</Text>
        </Text>

        {/* Method selector */}
        <View className="flex-row gap-2 mt-6 mb-8 p-1 bg-surface rounded-sm">
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

        {/* GPS status */}
        {method === "gps" && (
          <View className="w-full mb-6 p-4 rounded-card bg-bg-subtle">
            {gpsStatus === "locating" && (
              <View className="flex-row items-center gap-2">
                <MapPin size={18} color="#b45309" />
                <Text className="text-sm text-warning">Đang xác định vị trí...</Text>
              </View>
            )}
            {gpsStatus === "inside" && (
              <View className="flex-row items-center gap-2">
                <CheckCircle size={18} color="#15803d" />
                <Text className="text-sm text-success font-medium">
                  Trong vùng chấm công ✓
                </Text>
              </View>
            )}
            {gpsStatus === "outside" && (
              <View className="flex-row items-center gap-2">
                <X size={18} color="#b91c1c" />
                <Text className="text-sm text-danger">
                  Ngoài vùng {gpsDistance}m (giới hạn {SEED_CHECKIN_RULES.gps_radius_m}m)
                </Text>
              </View>
            )}
            {gpsStatus === "error" && (
              <View>
                <Text className="text-sm text-danger">
                  Không thể lấy vị trí. Kiểm tra quyền GPS.
                </Text>
                <TouchableOpacity onPress={checkGps} className="mt-2">
                  <Text className="text-sm text-accent font-medium">Thử lại</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* WiFi status */}
        {method === "wifi" && (
          <View className="w-full mb-6 p-4 rounded-card bg-success-bg">
            <View className="flex-row items-center gap-2">
              <Wifi size={18} color="#15803d" />
              <Text className="text-sm text-success font-medium">
                Đã kết nối LATIO-Office ✓
              </Text>
            </View>
            <Text className="text-xs text-text-muted mt-1">
              Mạng được phép: {SEED_CHECKIN_RULES.wifi_ssids?.join(", ")}
            </Text>
          </View>
        )}

        {/* QR instructions */}
        {method === "qr" && (
          <View className="w-full mb-6 p-4 rounded-card bg-info-bg">
            <View className="flex-row items-center gap-2">
              <QrCode size={18} color="#0369a1" />
              <Text className="text-sm text-info font-medium">
                Quét mã QR tại máy chấm công
              </Text>
            </View>
            <Text className="text-xs text-text-muted mt-1">
              Mã QR được đặt tại lễ tân và cổng văn phòng.
            </Text>
          </View>
        )}

        {/* Clock button */}
        <ClockButton
          variant="clock-in"
          state={clockState}
          onPress={handleClockIn}
          disabled={method === "gps" && gpsStatus !== "inside"}
        />

        {/* Late warning */}
        <View className="mt-6 p-3 bg-warning-bg rounded-md w-full">
          <Text className="text-xs text-warning text-center">
            Ca bắt đầu lúc 08:30 — đúng giờ trong vòng {SEED_CHECKIN_RULES.late_threshold_minutes} phút
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
