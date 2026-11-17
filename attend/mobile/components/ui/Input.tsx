import React, { useState } from "react";
import {
  View, TextInput, Text,
  type TextInputProps,
} from "react-native";
import { AlertCircle } from "lucide-react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, className, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-text mb-1" accessibilityLabel={label}>
          {label}
        </Text>
      )}
      <View
        className={cn(
          "flex-row items-center border rounded-sm bg-bg px-3",
          focused ? "border-accent" : error ? "border-danger" : "border-border-input",
          props.editable === false && "opacity-50 bg-surface"
        )}
        style={{ height: 44 }}
      >
        <TextInput
          className={cn("flex-1 text-base text-text py-0", className)}
          placeholderTextColor="#9ca3af"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityInvalid={!!error}
          {...props}
        />
        {error && (
          <AlertCircle size={18} color="#b91c1c" />
        )}
      </View>
      {error && (
        <Text className="text-xs text-danger mt-1" accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      {helper && !error && (
        <Text className="text-xs text-text-muted mt-1">{helper}</Text>
      )}
    </View>
  );
}
