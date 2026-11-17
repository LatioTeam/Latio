// S04 — Tham gia Workspace
import React, { useState } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserPlus } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store";

export default function JoinWorkspaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const joinWorkspace = useStore((s) => s.joinWorkspace);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setCodeError("Mã invite gồm ít nhất 4 ký tự.");
      return;
    }
    setCodeError("");
    setLoading(true);
    try {
      await joinWorkspace(trimmed);
      // Root layout navigates to (app)/
    } catch (e: any) {
      setCodeError(e.message ?? "Mã không hợp lệ hoặc đã hết hạn.");
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
          <View className="w-16 h-16 rounded-card bg-success-bg items-center justify-center mb-6">
            <UserPlus size={32} color="#15803d" />
          </View>

          <Text className="text-display font-bold text-text">
            Tham gia workspace
          </Text>
          <Text className="text-base text-text-muted mt-2 mb-8">
            Nhập mã invite do quản lý cung cấp để tham gia hệ thống chấm công.
          </Text>

          <Input
            label="Mã invite"
            placeholder="Ví dụ: LATIO2026"
            value={code}
            onChangeText={(t) => { setCode(t.toUpperCase()); setCodeError(""); }}
            error={codeError}
            autoFocus
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleJoin}
            helper="Hỏi quản lý của bạn để lấy mã invite."
          />

          <Button
            className="mt-8 w-full"
            size="lg"
            loading={loading}
            onPress={handleJoin}
          >
            Tham gia
          </Button>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.push("/workspace/create")}
          >
            <Text className="text-sm text-accent font-medium">
              Tôi là quản lý — Tạo workspace mới
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
