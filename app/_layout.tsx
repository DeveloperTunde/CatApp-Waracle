import ErrorBanner from "@/components/shared/ErrorBanner";
import { Colors } from "@constants/colors";
import { useCatStore } from "@stores/catStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const loadInitial = useCatStore((s) => s.loadInitial);
  const error = useCatStore((s) => s.error);
  const clearError = useCatStore((s) => s.clearError);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style={"light"} />
          {error ? (
            <ErrorBanner message={error} onDismiss={clearError} />
          ) : null}
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="upload"
              options={{ animation: "slide_from_bottom" }}
            />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
