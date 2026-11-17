// S10 — Danh sách đơn nghỉ phép
import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/StatusBadge";

const LEAVE_TYPE_LABEL: Record<string, string> = {
  annual: "Phép năm", sick: "Nghỉ ốm", unpaid: "Không lương", other: "Khác",
};

export default function LeaveListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const requests = useStore((s) => s.requests);
  const balance = useStore((s) => s.balance);

  return (
    <View className="flex-1 bg-bg-subtle">
      <View className="bg-bg px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-text">Nghỉ phép</Text>
            <Text className="text-sm text-text-muted mt-0.5">
              Còn lại: {(balance?.annual_days ?? 0) - (balance?.annual_used ?? 0)} ngày phép năm
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-accent items-center justify-center"
            onPress={() => router.push("/(app)/leave/new")}
            accessibilityLabel="Tạo đơn nghỉ phép mới"
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: r }) => (
          <View className="bg-bg rounded-card p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-text">
                {LEAVE_TYPE_LABEL[r.leave_type]}
              </Text>
              <StatusBadge type={r.status} />
            </View>
            <Text className="text-sm text-text-muted">
              {new Date(r.start_date).toLocaleDateString("vi-VN")}
              {r.start_date !== r.end_date && ` – ${new Date(r.end_date).toLocaleDateString("vi-VN")}`}
            </Text>
            {r.reason && (
              <Text className="text-sm text-text-muted mt-1 italic" numberOfLines={2}>
                "{r.reason}"
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-text-muted text-base">Chưa có đơn nghỉ phép nào</Text>
            <TouchableOpacity className="mt-4" onPress={() => router.push("/(app)/leave/new")}>
              <Text className="text-accent font-medium">+ Tạo đơn mới</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
