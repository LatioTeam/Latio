import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStore } from "@/lib/store";
import "../global.css";

export default function RootLayout() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const workspace = useStore((s) => s.workspace);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inWorkspaceGroup = segments[0] === "workspace";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/");
    } else if (isAuthenticated && !workspace && !inWorkspaceGroup && !inAuthGroup) {
      router.replace("/workspace/create");
    } else if (isAuthenticated && workspace && (inAuthGroup || inWorkspaceGroup)) {
      router.replace("/(app)/");
    }
  }, [isAuthenticated, workspace, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="workspace" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
