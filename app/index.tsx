import AppHeader from "@components/layouts/AppHeader";
import CatGrid from "@components/layouts/CatGrid";
import { Colors } from "@constants/colors";
import { Shadows } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { queryKeys } from "@hooks/useCatQueries";
import { useQueryClient } from "@tanstack/react-query";
import IconButton from "@ui/IconButton";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const queryClient = useQueryClient();

  const handleUploadPress = useCallback(() => {
    router.push("/upload");
  }, []);

  const handleRefresh = useCallback(async () => {
    // Force refetch from server even if cache is fresh
    await queryClient.invalidateQueries({ queryKey: queryKeys.images });
    await queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    await queryClient.invalidateQueries({ queryKey: queryKeys.favourites });
  }, [queryClient]);

  return (
    <View style={styles.container}>
      <AppHeader
        showLogo
        right={
          <IconButton
            iconName="cloud-upload-outline"
            iconColor={Colors.primary}
            iconSize={26}
            onPress={handleUploadPress}
          />
        }
      />

      <View style={styles.body}>
        <CatGrid onUploadPress={handleUploadPress} onRefresh={handleRefresh} />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleUploadPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
});
