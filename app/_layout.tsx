import "react-native-gesture-handler";

import { StyledProvider } from "@gluestack-style/react";
import { config } from "@gluestack-ui/config";
import { Center, GluestackUIProvider, Spinner } from "@gluestack-ui/themed";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { ToastContainer } from "@/src/shared/components/ToastContainer";
import { useAuthStore } from "@/src/shared/store/useAuthStore";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    const inAuthRoute = pathname.startsWith("/(auth)");
    if (!isAuthenticated && !inAuthRoute) {
      router.replace("/(auth)/login");
      return;
    }
    if (isAuthenticated && inAuthRoute) {
      router.replace("/(tabs)/schools/list");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated) {
    return (
      <StyledProvider config={config}>
        <GluestackUIProvider config={config}>
          <StatusBar style="dark" />
          <Center flex={1} bg="$coolGray50">
            <Spinner size="large" />
          </Center>
        </GluestackUIProvider>
      </StyledProvider>
    );
  }

  return (
    <StyledProvider config={config}>
      <GluestackUIProvider config={config}>
        <StatusBar style="dark" />
        <ToastContainer />
        <Stack screenOptions={{ headerTitleStyle: { fontWeight: "600" } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </StyledProvider>
  );
}
