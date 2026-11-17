// S05 — Home Dashboard (nhân viên)
import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, ChevronRight, LogIn, LogOut } from "lucide-react-native";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { formatTime, formatDateVI } from "@/lib/utils";
import { SEED_SHIFT } from "@/lib/seed";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const workspace = useStore((s) => s.workspace);
  const todayRecord = useStore((s) => s.todayRecord);
  const unreadCount = useStore((s) => s.unreadCount);
  const balance = useStore((s) => s.balance);

  const isClocked = !!todayRecord?.clock_in_at;
  const isClockedOut = !!todayRecord?.clock_out_at;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ScrollView
      className="flex-1 bg-bg-subtle"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        className="bg-nav-bg px-5 pb-5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <EmployeeAvatar
              name={user?.full_name ?? ""}
              size="md"
              status={isClocked && !isClockedOut ? "clocked-in" : "not-yet"}
            />
            <View>
              <Text className="text-nav-text text-xs">Xin chào,</Text>
              <Text className="text-white font-semibold text-base">
                {user?.full_name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/notifications")}
            className="relative p-2"
            accessibilityLabel={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ""}`}
          >
            <Bell size={22} color="#cbd5e1" />
            {unreadCount > 0 && (
              <View className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Date & Workspace */}
        <Text className="text-nav-text text-xs mb-0.5">
          {workspace?.name}
        </Text>
        <Text className="text-nav-text text-sm">
          {formatDateVI(today)}
        </Text>
      </View>

      {/* Clock-in Card */}
      <View className="px-4 -mt-4">
        <View
          className="bg-bg rounded-card p-5"
          style={{ shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-sm text-text-muted">Ca hôm nay</Text>
              <Text className="text-base font-semibold text-text">{SEED_SHIFT.name}</Text>
              <Text className="text-sm text-text-muted">
                {SEED_SHIFT.start_time} – {SEED_SHIFT.end_time}
              </Text>
            </View>
            {todayRecord && (
              <StatusBadge type={todayRecord.status} />
            )}
          </View>

          {/* Time row */}
          <View className="flex-row">
            <View className="flex-1 items-center p-3 bg-success-bg rounded-md">
              <LogIn size={16} color="#15803d" />
              <Text className="text-xs text-text-muted mt-1">Vào</Text>
              <Text className="text-base font-bold text-success">
                {formatTime(todayRecord?.clock_in_at)}
              </Text>
            </View>
            <View className="w-px bg-border mx-3" />
            <View className="flex-1 items-center p-3 bg-danger-bg rounded-md">
              <LogOut size={16} color="#b91c1c" />
              <Text className="text-xs text-text-muted mt-1">Ra</Text>
              <Text className="text-base font-bold text-danger">
                {formatTime(todayRecord?.clock_out_at)}
              </Text>
            </View>
          </View>

          {/* Action button */}
          <TouchableOpacity
            className={`mt-4 h-12 rounded-pill items-center justify-center flex-row gap-2 ${
              isClockedOut ? "bg-surface" : isClocked ? "bg-checkout" : "bg-checkin"
            }`}
            onPress={() => {
              if (!isClocked) router.push("/(app)/checkin");
              else if (!isClockedOut) router.push("/(app)/checkout");
            }}
            disabled={isClockedOut}
            accessibilityLabel={
              isClockedOut ? "Đã hoàn thành hôm nay" :
              isClocked ? "Chấm công ra" : "Chấm công vào"
            }
          >
            {isClockedOut ? (
              <Text className="text-text-muted font-semibold">Đã hoàn thành hôm nay ✓</Text>
            ) : isClocked ? (
              <>
                <LogOut size={18} color="#ffffff" />
                <Text className="text-white font-semibold">Chấm công ra</Text>
              </>
            ) : (
              <>
                <LogIn size={18} color="#ffffff" />
                <Text className="text-white font-semibold">Chấm công vào</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-4 mt-4 flex-row gap-3">
        <View className="flex-1 bg-bg rounded-card p-4">
          <Text className="text-xs text-text-muted mb-1">Phép còn lại</Text>
          <Text className="text-xl font-bold text-text">
            {(balance?.annual_days ?? 0) - (balance?.annual_used ?? 0)}
          </Text>
          <Text className="text-xs text-text-muted">ngày</Text>
        </View>
        <View className="flex-1 bg-bg rounded-card p-4">
          <Text className="text-xs text-text-muted mb-1">Đi muộn tháng này</Text>
          <Text className="text-xl font-bold text-text">2</Text>
          <Text className="text-xs text-text-muted">lần</Text>
        </View>
        <View className="flex-1 bg-bg rounded-card p-4">
          <Text className="text-xs text-text-muted mb-1">Tăng ca tháng này</Text>
          <Text className="text-xl font-bold text-text">3.5</Text>
          <Text className="text-xs text-text-muted">giờ</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mt-4">
        <Text className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wide">
          Thao tác nhanh
        </Text>
        {[
          { label: "Lịch sử chấm công", href: "/(app)/history" },
          { label: "Đăng ký nghỉ phép", href: "/(app)/leave/new" },
          { label: "Lịch làm việc", href: "/(app)/schedule" },
          { label: "Phiếu lương", href: "/(app)/payroll" },
        ].map((item) => (
          <TouchableOpacity
            key={item.href}
            className="flex-row items-center justify-between bg-bg px-4 py-3.5 rounded-card mb-2"
            onPress={() => router.push(item.href as any)}
            accessibilityLabel={item.label}
          >
            <Text className="text-base text-text">{item.label}</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
