import React from "react";
import { View, Text, Image } from "react-native";
import { getInitials, nameToColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";
type StatusDot = "clocked-in" | "not-yet" | "absent" | null;

const sizeMap: Record<AvatarSize, { container: number; text: string }> = {
  xs: { container: 24, text: "text-[10px]" },
  sm: { container: 32, text: "text-xs" },
  md: { container: 48, text: "text-base" },
  lg: { container: 64, text: "text-xl" },
};

const dotColors: Record<Exclude<StatusDot, null>, string> = {
  "clocked-in": "#15803d",
  "not-yet":    "#9ca3af",
  "absent":     "#b91c1c",
};

interface EmployeeAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: AvatarSize;
  status?: StatusDot;
  className?: string;
}

export function EmployeeAvatar({
  name, avatarUrl, size = "md", status = null, className,
}: EmployeeAvatarProps) {
  const { container, text } = sizeMap[size];
  const initials = getInitials(name);
  const bgColor = nameToColor(name);
  const dotSize = Math.round(container * 0.25);

  return (
    <View className={cn("relative", className)} style={{ width: container, height: container }}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: container, height: container, borderRadius: container / 2 }}
          accessibilityLabel={`Ảnh đại diện của ${name}`}
        />
      ) : (
        <View
          style={{
            width: container,
            height: container,
            borderRadius: container / 2,
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityRole="image"
          accessibilityLabel={`Ảnh đại diện của ${name}`}
        >
          <Text
            className={cn("text-white font-semibold", text)}
            style={{ lineHeight: container * 0.5 }}
          >
            {initials}
          </Text>
        </View>
      )}
      {status && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: dotColors[status],
            borderWidth: 1.5,
            borderColor: "#ffffff",
          }}
        />
      )}
    </View>
  );
}
