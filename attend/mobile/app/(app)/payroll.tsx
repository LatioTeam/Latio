// S22 — Phiếu lương (nhân viên xem)
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DollarSign } from "lucide-react-native";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatVND } from "@/lib/utils";
import { SEED_PAYROLL } from "@/lib/seed";

const STATUS_MAP: Record<string, "pending" | "approved" | "on-time"> = {
  calculating: "pending",
  ready: "approved",
  exported: "on-time",
};

export default function PayrollScreen() {
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);

  const p = SEED_PAYROLL;

  return (
    <ScrollView className="flex-1 bg-bg-subtle">
      <View className="bg-bg px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-xl font-bold text-text">Phiếu lương</Text>
        <Text className="text-sm text-text-muted mt-0.5">
          Tháng {p.period_month}/{p.period_year}
        </Text>
      </View>

      <View className="m-4 bg-bg rounded-card p-5">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <DollarSign size={22} color="#1e4fd4" />
            <Text className="text-lg font-semibold text-text">
              Tháng {p.period_month}/{p.period_year}
            </Text>
          </View>
          <StatusBadge
            type={STATUS_MAP[p.status]}
            label={{ calculating: "Đang tính", ready: "Sẵn sàng", exported: "Đã xuất" }[p.status]}
          />
        </View>

        {[
          { label: "Ngày làm việc", value: `${p.worked_days} ngày` },
          { label: "Ngày nghỉ phép", value: `${p.leave_days} ngày` },
          { label: "Giờ tăng ca", value: `${p.ot_hours} giờ` },
          { label: "Lương tăng ca", value: formatVND(p.ot_amount) },
          { label: "Khấu trừ", value: formatVND(p.deductions) },
        ].map((row, i) => (
          <View
            key={i}
            className={`flex-row justify-between py-2.5 ${i < 4 ? "border-b border-border" : ""}`}
          >
            <Text className="text-sm text-text-muted">{row.label}</Text>
            <Text className="text-sm text-text font-medium">{row.value}</Text>
          </View>
        ))}

        <View className="mt-3 pt-3 border-t border-border flex-row justify-between items-center">
          <Text className="text-base font-semibold text-text">Lương net</Text>
          <Text
            className="text-xl font-bold text-accent"
            accessibilityLabel={`${formatVND(p.net_salary)}`}
          >
            {formatVND(p.net_salary)}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-text-subtle text-center mx-6 mt-2">
        Bảng lương sẽ được xác nhận bởi quản lý trước khi thanh toán.
      </Text>
    </ScrollView>
  );
}
