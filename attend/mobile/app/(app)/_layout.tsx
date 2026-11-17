import { Stack } from "expo-router";
import { View } from "react-native";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export default function AppLayout() {
  return (
    <View className="flex-1 bg-bg">
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="checkin" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="checkout" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="history" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="leave/index" />
        <Stack.Screen name="leave/new" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="payroll" />
      </Stack>
      <BottomNavBar />
    </View>
  );
}
