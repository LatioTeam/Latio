import React from "react";
import {
  TouchableOpacity, Text, View, ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   "bg-accent",
  secondary: "bg-surface border border-border",
  ghost:     "bg-transparent",
  danger:    "bg-danger",
  success:   "bg-success",
};

const textClasses: Record<Variant, string> = {
  primary:   "text-on-accent",
  secondary: "text-text",
  ghost:     "text-accent",
  danger:    "text-white",
  success:   "text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
  lg: "h-12 px-6",
};

const textSizeClasses: Record<Size, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      activeOpacity={0.75}
      className={cn(
        "flex-row items-center justify-center rounded-pill",
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && "opacity-40",
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "secondary" || variant === "ghost" ? "#1e4fd4" : "#ffffff"}
          className="mr-2"
        />
      ) : leftIcon ? (
        <View className="mr-2">{leftIcon}</View>
      ) : null}
      <Text className={cn(textClasses[variant], textSizeClasses[size])}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
