// S14 — Hồ sơ cá nhân
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User, Building2, ChevronRight, LogOut, Bell, Shield, HelpCircle,
} from "lucide-react-native";
import { useStore } from "@/lib/store";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { SEED_MEMBERS } from "@/lib/seed";

const ROLE_LABEL: Record<string, string> = {
  owner: "Chủ sở hữu", admin: "Quản trị", manager: "Quản lý", member: "Nhân viên",
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const workspace = useStore((s) => s.workspace);
  const signOut = useStore((s) => s.signOut);

  const member = SEED_MEMBERS.find((m) => m.user_id === user?.id);

  const handleSignOut = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn chắc chắn muốn đăng xuất khỏi LATIO?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: signOut },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-bg-subtle" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View className="bg-bg px-4 pb-6" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-xl font-bold text-text mb-4">Cá nhân</Text>
        <View className="flex-row items-center gap-4">
          <EmployeeAvatar name={user?.full_name ?? ""} size="lg" />
          <View className="flex-1">
            <Text className="text-lg font-bold text-text">{user?.full_name}</Text>
            <Text className="text-sm text-text-muted">{user?.email}</Text>
            {member && (
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-xs text-text-subtle">{member.position}</Text>
                {member.employee_code && (
                  <Text className="text-xs bg-surface px-2 py-0.5 rounded-pill text-text-muted">
                    {member.employee_code}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Workspace info */}
      <View className="mx-4 mt-4 bg-bg rounded-card p-4">
        <View className="flex-row items-center gap-3">
          <Building2 size={20} color="#1e4fd4" />
          <View className="flex-1">
            <Text className="text-sm text-text-muted">Workspace</Text>
            <Text className="text-base font-semibold text-text">{workspace?.name}</Text>
          </View>
          {member && (
            <View className="px-2 py-1 bg-accent-subtle rounded-pill">
              <Text className="text-xs text-accent font-medium">
                {ROLE_LABEL[member.role]}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Menu */}
      <View className="mx-4 mt-4 bg-bg rounded-card">
        {[
          { icon: <Bell size={18} color="#9ca3af" />, label: "Cài đặt thông báo" },
          { icon: <Shield size={18} color="#9ca3af" />, label: "Bảo mật & quyền riêng tư" },
          { icon: <HelpCircle size={18} color="#9ca3af" />, label: "Trợ giúp & hỗ trợ" },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            className={`flex-row items-center px-4 py-3.5 gap-3 ${i > 0 ? "border-t border-border" : ""}`}
          >
            {item.icon}
            <Text className="flex-1 text-base text-text">{item.label}</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity
        className="mx-4 mt-4 bg-danger-bg rounded-card p-4 flex-row items-center gap-3"
        onPress={handleSignOut}
      >
        <LogOut size={18} color="#b91c1c" />
        <Text className="text-danger font-medium">Đăng xuất</Text>
      </TouchableOpacity>

      <Text className="text-center text-xs text-text-subtle mt-6">
        LATIO Chấm Công v1.0.0
      </Text>
    </ScrollView>
  );
}
