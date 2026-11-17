// S13 — Thông báo
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Calendar, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react-native";
import { useStore } from "@/lib/store";
import { relativeTime } from "@/lib/utils";
import type { NotificationType } from "@/types";

const iconFor = (type: NotificationType) => {
  const map: Record<NotificationType, React.ReactNode> = {
    leave_request:  <Calendar size={20} color="#b45309" />,
    leave_approved: <CheckCircle2 size={20} color="#15803d" />,
    leave_rejected: <AlertTriangle size={20} color="#b91c1c" />,
    payroll_ready:  <DollarSign size={20} color="#0369a1" />,
    shift_change:   <Calendar size={20} color="#6d28d9" />,
    reminder:       <Bell size={20} color="#9ca3af" />,
  };
  return map[type];
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markRead);
  const markAllRead = useStore((s) => s.markAllRead);
  const unreadCount = useStore((s) => s.unreadCount);

  return (
    <View className="flex-1 bg-bg-subtle">
      <View className="bg-bg px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-text">Thông báo</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text className="text-sm text-accent font-medium">Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item: n }) => (
          <TouchableOpacity
            className={`flex-row items-start px-4 py-3.5 gap-3 border-b border-border ${
              !n.is_read ? "bg-accent-subtle border-l-2 border-l-accent" : "bg-bg"
            }`}
            onPress={() => markRead(n.id)}
            accessibilityLabel={`${!n.is_read ? "Thông báo chưa đọc: " : ""}${n.title}`}
          >
            <View className={`w-10 h-10 rounded-full items-center justify-center ${
              !n.is_read ? "bg-bg" : "bg-surface"
            }`}>
              {iconFor(n.type)}
            </View>
            <View className="flex-1">
              <Text className={`text-sm ${!n.is_read ? "font-semibold text-text" : "font-medium text-text-muted"}`}>
                {n.title}
              </Text>
              <Text className="text-sm text-text-muted mt-0.5" numberOfLines={2}>
                {n.body}
              </Text>
              <Text className="text-xs text-text-subtle mt-1">
                {relativeTime(n.created_at)}
              </Text>
            </View>
            {!n.is_read && (
              <View className="w-2 h-2 rounded-full bg-accent mt-1.5" />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Bell size={48} color="#9ca3af" />
            <Text className="text-text-muted text-base mt-4">Không có thông báo mới</Text>
          </View>
        }
      />
    </View>
  );
}
