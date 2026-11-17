// S08 — Lịch sử chấm công
import React, { useEffect } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatTime, formatDuration } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react-native";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const history = useStore((s) => s.history);
  const loadHistory = useStore((s) => s.loadHistory);

  useEffect(() => { loadHistory(); }, []);

  return (
    <View className="flex-1 bg-bg-subtle">
      <View className="bg-bg px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-xl font-bold text-text">Lịch sử chấm công</Text>
        <Text className="text-sm text-text-muted mt-0.5">Tháng 11/2026</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: r }) => (
          <View className="bg-bg rounded-card p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-text">
                {new Date(r.date).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
              </Text>
              <StatusBadge type={r.status} />
            </View>
            <View className="flex-row gap-4">
              <View className="flex-row items-center gap-1.5">
                <LogIn size={14} color="#15803d" />
                <Text className="text-sm text-text-muted">
                  Vào: <Text className="text-text font-medium">{formatTime(r.clock_in_at)}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <LogOut size={14} color="#b91c1c" />
                <Text className="text-sm text-text-muted">
                  Ra: <Text className="text-text font-medium">{formatTime(r.clock_out_at)}</Text>
                </Text>
              </View>
              {r.worked_minutes && (
                <Text className="text-sm text-text-muted ml-auto">
                  {formatDuration(r.worked_minutes)}
                </Text>
              )}
            </View>
            {r.clock_in_method && (
              <Text className="text-xs text-text-subtle mt-2 capitalize">
                Phương thức: {r.clock_in_method}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-text-muted text-base">Chưa có dữ liệu chấm công</Text>
          </View>
        }
      />
    </View>
  );
}
