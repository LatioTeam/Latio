// S02 — Đăng nhập (OTP + Google SSO)
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/lib/store";

type Step = "phone" | "otp";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signIn = useStore((s) => s.signIn);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhone = (v: string) => /^(0|\+84)[0-9]{9}$/.test(v.replace(/\s/g, ""));

  const handleSendOtp = () => {
    const clean = phone.replace(/\s/g, "");
    if (!validatePhone(clean)) {
      setPhoneError("Số điện thoại không hợp lệ. Ví dụ: 0901234567");
      return;
    }
    setPhoneError("");
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Mã OTP gồm 6 chữ số.");
      return;
    }
    setOtpError("");
    setLoading(true);
    try {
      await signIn(phone, otp);
      // Navigation handled by root layout
    } catch (e: any) {
      setOtpError(e.message ?? "Xác minh thất bại. Thử lại.");
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
        {/* Header */}
        <View
          style={{ paddingTop: insets.top + 8 }}
          className="flex-row items-center px-4 pb-4"
        >
          <TouchableOpacity
            onPress={() => step === "otp" ? setStep("phone") : router.back()}
            className="p-2 -ml-2"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-4">
          {step === "phone" ? (
            <>
              <Text className="text-display font-bold text-text">Đăng nhập</Text>
              <Text className="text-base text-text-muted mt-2 mb-8">
                Nhập số điện thoại để nhận mã OTP.
              </Text>
              <Input
                label="Số điện thoại"
                placeholder="0901 234 567"
                value={phone}
                onChangeText={(t) => { setPhone(t); setPhoneError(""); }}
                error={phoneError}
                keyboardType="phone-pad"
                autoComplete="tel"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSendOtp}
              />
              <Button
                className="mt-6 w-full"
                size="lg"
                onPress={handleSendOtp}
              >
                Gửi mã OTP
              </Button>

              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-sm text-text-muted">hoặc</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onPress={() => Alert.alert("Google SSO", "Sẽ tích hợp sau khi cấu hình OAuth.")}
              >
                Tiếp tục với Google
              </Button>
            </>
          ) : (
            <>
              <Text className="text-display font-bold text-text">Xác minh OTP</Text>
              <Text className="text-base text-text-muted mt-2 mb-8">
                Nhập mã 6 chữ số đã gửi đến{"\n"}
                <Text className="font-semibold text-text">{phone}</Text>
              </Text>
              <Input
                label="Mã OTP"
                placeholder="000000"
                value={otp}
                onChangeText={(t) => { setOtp(t.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                error={otpError}
                keyboardType="number-pad"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleVerifyOtp}
              />
              <Button
                className="mt-6 w-full"
                size="lg"
                loading={loading}
                onPress={handleVerifyOtp}
              >
                Xác minh
              </Button>
              <TouchableOpacity
                className="mt-4 items-center"
                onPress={() => setStep("phone")}
              >
                <Text className="text-sm text-accent font-medium">
                  Gửi lại mã OTP
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
