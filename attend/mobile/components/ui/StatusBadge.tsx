import React from "react";
import { View, Text } from "react-native";
import {
  CheckCircle, Clock, XCircle, CalendarOff, TrendingUp,
} from "lucide-react-native";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

type BadgeType = AttendanceStatus | "pending" | "approved" | "rejected";

const config: Record<BadgeType, {
  bg: string; text: string; icon: React.ReactNode; label: string;
}> = {
  "on-time":  { bg: "bg-success-bg", text: "text-success",  icon: <CheckCircle size={12} color="#15803d" />, label: "Đúng giờ" },
  "late":     { bg: "bg-warning-bg", text: "text-warning",  icon: <Clock size={12} color="#b45309" />,        label: "Đi muộn" },
  "absent":   { bg: "bg-surface",    text: "text-absent",   icon: <XCircle size={12} color="#4b5563" />,      label: "Vắng" },
  "leave":    { bg: "bg-[#ede9fe]",  text: "text-leave",    icon: <CalendarOff size={12} color="#6d28d9" />,  label: "Nghỉ phép" },
  "ot":       { bg: "bg-info-bg",    text: "text-ot",       icon: <TrendingUp size={12} color="#0369a1" />,   label: "Tăng ca" },
  "pending":  { bg: "bg-warning-bg", text: "text-warning",  icon: <Clock size={12} color="#b45309" />,        label: "Chờ duyệt" },
  "approved": { bg: "bg-success-bg", text: "text-success",  icon: <CheckCircle size={12} color="#15803d" />,  label: "Đã duyệt" },
  "rejected": { bg: "bg-danger-bg",  text: "text-danger",   icon: <XCircle size={12} color="#b91c1c" />,      label: "Từ chối" },
};

interface StatusBadgeProps {
  type: BadgeType;
  label?: string;
  size?: "xs" | "md";
}

export function StatusBadge({ type, label, size = "xs" }: StatusBadgeProps) {
  const c = config[type];
  const displayLabel = label ?? c.label;

  return (
    <View
      className={cn("flex-row items-center gap-1 px-2 rounded-pill", c.bg,
        size === "xs" ? "py-0.5" : "py-1"
      )}
      accessibilityRole="text"
      accessibilityLabel={`Trạng thái: ${displayLabel}`}
    >
      {c.icon}
      <Text className={cn("font-medium", c.text, size === "xs" ? "text-xs" : "text-sm")}>
        {displayLabel}
      </Text>
    </View>
  );
}
