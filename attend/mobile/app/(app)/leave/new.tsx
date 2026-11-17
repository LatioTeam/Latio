// S11 — Tạo đơn nghỉ phép mới
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store";
import type { LeaveType } from "@/types";

const LEAVE_TYPES: { key: LeaveType; label: string }[] = [
  { key: "annual",  label: "Phép năm" },
  { key: "sick",    label: "Nghỉ ốm" },
  { key: "unpaid",  label: "Không lương" },
  { key: "other",   label: "Khác" },
];

export default function NewLeaveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const submitLeave = useStore((s) => s.submitLeave);
  const balance = useStore((s) => s.balance);

  const [leaveType, setLeaveType] = useState<LeaveType>("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!startDate.match(/^\d{4}-\d{2}-\d{2}$/)) e.startDate = "Định dạng: YYYY-MM-DD";
    if (!endDate.match(/^\d{4}-\d{2}-\d{2}$/))   e.endDate   = "Định dạng: YYYY-MM-DD";
    if (startDate > endDate) e.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    if (reason.trim().length < 5) e.reason = "Lý do cần ít nhất 5 ký tự";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await submitLeave({ leave_type: leaveType, start_date: startDate, end_date: endDate,
        is_half_day: false, reason });
      Alert.alert("Đã gửi", "Đơn nghỉ phép đang chờ duyệt.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message ?? "Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const remaining = (balance?.annual_days ?? 0) - (balance?.annual_used ?? 0);

  return (
    <KeyboardAvoidingView className="flex-1 bg-bg" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View className="flex-row items-center justify-between px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-lg font-semibold text-text">Đơn nghỉ phép</Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Đóng">
          <X size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        {/* Leave type */}
        <View>
          <Text className="text-sm font-medium text-text mb-2">Loại nghỉ phép</Text>
          <View className="flex-row gap-2 flex-wrap">
            {LEAVE_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                className={`px-4 py-2 rounded-pill border ${
                  leaveType === t.key ? "bg-accent border-accent" : "border-border bg-bg"
                }`}
                onPress={() => setLeaveType(t.key)}
              >
                <Text className={`text-sm font-medium ${leaveType === t.key ? "text-on-accent" : "text-text"}`}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {leaveType === "annual" && (
            <Text className="text-xs text-text-muted mt-2">
              Còn lại: {remaining} ngày phép năm
            </Text>
          )}
        </View>

        {/* Dates */}
        <Input
          label="Ngày bắt đầu"
          placeholder="2026-12-20"
          value={startDate}
          onChangeText={(t) => { setStartDate(t); setErrors((e) => ({ ...e, startDate: "" })); }}
          error={errors.startDate}
          keyboardType="numbers-and-punctuation"
        />
        <Input
          label="Ngày kết thúc"
          placeholder="2026-12-22"
          value={endDate}
          onChangeText={(t) => { setEndDate(t); setErrors((e) => ({ ...e, endDate: "" })); }}
          error={errors.endDate}
          keyboardType="numbers-and-punctuation"
        />
        <Input
          label="Lý do"
          placeholder="Lý do nghỉ phép…"
          value={reason}
          onChangeText={(t) => { setReason(t); setErrors((e) => ({ ...e, reason: "" })); }}
          error={errors.reason}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }}
        />

        <Button size="lg" loading={loading} onPress={handleSubmit} className="mt-2 w-full">
          Gửi đơn
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
