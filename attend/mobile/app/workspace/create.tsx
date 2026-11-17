// S03 — Tạo Workspace
import React, { useState } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Building2 } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store";

export default function CreateWorkspaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createWorkspace = useStore((s) => s.createWorkspace);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (name.trim().length < 2) {
      setNameError("Tên công ty cần ít nhất 2 ký tự.");
      return;
    }
    setNameError("");
    setLoading(true);
    try {
      await createWorkspace(name.trim());
      // Root layout navigates to (app)/
    } catch (e: any) {
      setNameError(e.message ?? "Có lỗi xảy ra. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: insets.top + 24 }} className="flex-1 px-6">
          <View className="w-16 h-16 rounded-card bg-accent-subtle items-center justify-center mb-6">
            <Building2 size={32} color="#1e4fd4" />
          </View>

          <Text className="text-display font-bold text-text">
            Tạo workspace
          </Text>
          <Text className="text-base text-text-muted mt-2 mb-8">
            Dành cho quản lý muốn tạo hệ thống chấm công cho doanh nghiệp.
          </Text>

          <Input
            label="Tên công ty / tổ chức"
            placeholder="Ví dụ: LATIO Agency"
            value={name}
            onChangeText={(t) => { setName(t); setNameError(""); }}
            error={nameError}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />

          <View className="mt-4 p-4 bg-accent-subtle rounded-md">
            <Text className="text-sm text-accent font-medium mb-1">
              Với tư cách quản lý, bạn có thể:
            </Text>
            <Text className="text-sm text-text-muted">• Mời nhân viên qua mã invite</Text>
            <Text className="text-sm text-text-muted">• Cài đặt ca làm việc và vị trí GPS</Text>
            <Text className="text-sm text-text-muted">• Duyệt đơn nghỉ và xuất bảng lương</Text>
          </View>

          <Button
            className="mt-8 w-full"
            size="lg"
            loading={loading}
            onPress={handleCreate}
          >
            Tạo workspace
          </Button>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.push("/workspace/join")}
          >
            <Text className="text-sm text-accent font-medium">
              Đã có workspace? Tham gia ngay
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
