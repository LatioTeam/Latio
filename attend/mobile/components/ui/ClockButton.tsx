import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity, Text, View, ActivityIndicator, Animated,
} from "react-native";
import { LogIn, LogOut, Check } from "lucide-react-native";

type ClockState = "idle" | "verifying" | "success" | "error";
type ClockVariant = "clock-in" | "clock-out";

interface ClockButtonProps {
  variant: ClockVariant;
  state?: ClockState;
  onPress: () => void;
  disabled?: boolean;
}

export function ClockButton({
  variant, state = "idle", onPress, disabled = false,
}: ClockButtonProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevState = useRef(state);

  const isClockIn = variant === "clock-in";
  const bgColor = isClockIn ? "#15803d" : "#b91c1c";
  const label = {
    idle:      isClockIn ? "Chấm công vào" : "Chấm công ra",
    verifying: "Đang xác minh...",
    success:   isClockIn ? "Đã chấm vào" : "Đã chấm ra",
    error:     "Thử lại",
  }[state];

  useEffect(() => {
    if (prevState.current === "verifying" && state === "success") {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
    if (state === "error") {
      Animated.sequence([
        ...Array.from({ length: 3 }, () => [
          Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        ]).flat(),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
    prevState.current = state;
  }, [state]);

  return (
    <View className="items-center gap-3">
      <Animated.View
        style={{
          transform: [
            { translateX: shakeAnim },
            { scale: scaleAnim },
          ],
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || state === "verifying" || state === "success"}
          accessibilityRole="button"
          accessibilityLabel={`${label} — ${state === "verifying" ? "đang chờ xác minh GPS" : "nhấn để chấm công"}`}
          activeOpacity={0.85}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
            opacity: (disabled || state === "success") ? 0.6 : 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          {state === "verifying" ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : state === "success" ? (
            <Check size={36} color="#ffffff" strokeWidth={2.5} />
          ) : isClockIn ? (
            <LogIn size={32} color="#ffffff" strokeWidth={2} />
          ) : (
            <LogOut size={32} color="#ffffff" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </Animated.View>

      <Text
        className="text-sm font-medium text-text-muted"
        accessibilityLiveRegion="assertive"
      >
        {label}
      </Text>
    </View>
  );
}
