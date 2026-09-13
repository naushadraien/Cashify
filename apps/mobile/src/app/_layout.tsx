import { Toaster } from "@/components";
import { AppProviders, useAuth } from "@/providers";
import { FONTS } from "@/theme";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <AuthNavigator />
      <Toaster />
      <StatusBar style="light" />
    </AppProviders>
  );
}

function AuthNavigator() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null; // Or a loader component
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
