// S01 — Onboarding
import React from "react";
import {
  View, Text, Image, ScrollView, useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Clock, MapPin, BarChart3 } from "lucide-react-native";

const FEATURES = [
  {
    icon: <Clock size={28} color="#1e4fd4" />,
    title: "Chấm công nhanh",
    desc: "GPS, WiFi hoặc QR — chấm công chỉ 1 chạm, không cần máy chấm công.",
  },
  {
    icon: <MapPin size={28} color="#15803d" />,
    title: "Xác minh vị trí",
    desc: "Hệ thống tự động xác nhận bạn đang ở văn phòng trước khi ghi nhận.",
  },
  {
    icon: <BarChart3 size={28} color="#b45309" />,
    title: "Bảng lương tự động",
    desc: "Tính lương, tăng ca và nghỉ phép tự động cuối mỗi tháng.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View
        className="bg-accent items-center justify-center"
        style={{ height: height * 0.38 }}
      >
        <View
          className="w-24 h-24 rounded-card bg-white items-center justify-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 }}
        >
          <Clock size={48} color="#1e4fd4" />
        </View>
        <Text className="text-on-accent text-display font-bold mt-4">LATIO</Text>
        <Text className="text-on-accent text-sm opacity-80 mt-1">
          Chấm công thông minh cho doanh nghiệp
        </Text>
      </View>

      {/* Features */}
      <View className="px-6 pt-8 gap-6">
        {FEATURES.map((f, i) => (
          <View key={i} className="flex-row items-start gap-4">
            <View className="w-12 h-12 rounded-md bg-bg-subtle items-center justify-center shrink-0">
              {f.icon}
            </View>
            <View className="flex-1">
              <Text className="text-md font-semibold text-text">{f.title}</Text>
              <Text className="text-sm text-text-muted mt-0.5">{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View className="px-6 mt-10 gap-3">
        <Button
          size="lg"
          onPress={() => router.push("/(auth)/login")}
          className="w-full"
        >
          Bắt đầu ngay
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onPress={() => router.push("/(auth)/login")}
          className="w-full"
        >
          Đã có tài khoản? Đăng nhập
        </Button>
      </View>

      {/* Footer */}
      <Text className="text-center text-xs text-text-subtle mt-6 px-6">
        Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của LATIO.
      </Text>
    </ScrollView>
  );
}
