import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="join" />
    </Stack>
  );
}
