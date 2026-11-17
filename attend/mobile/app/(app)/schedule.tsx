// S09 — Lịch làm việc (stub)
import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";
import { SEED_SHIFT } from "@/lib/seed";

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-bg-subtle">
      <View className="bg-bg px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-xl font-bold text-text">Lịch làm việc</Text>
        <Text className="text-sm text-text-muted mt-0.5">Tháng 11/2026</Text>
      </View>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Calendar size={48} color="#9ca3af" />
        <Text className="text-lg font-semibold text-text">{SEED_SHIFT.name}</Text>
        <Text className="text-base text-text-muted text-center">
          {SEED_SHIFT.start_time} – {SEED_SHIFT.end_time}{"\n"}
          Nghỉ giữa ca: {SEED_SHIFT.break_minutes} phút
        </Text>
        <Text className="text-sm text-text-subtle">(Lịch chi tiết sẽ hiển thị tại đây)</Text>
      </View>
    </View>
  );
}
