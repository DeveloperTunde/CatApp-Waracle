import AppHeader from "@components/layouts/AppHeader";
import ErrorBanner from "@components/shared/ErrorBanner";
import ImagePickerButton from "@components/shared/ImagePickerButton";
import AppButton from "@components/ui/AppButton";
import AppText from "@components/ui/AppText";
import IconButton from "@components/ui/IconButton";
import { Colors } from "@constants/colors";
import { BorderRadius, Spacing } from "@constants/theme";
import { useUploadMutation } from "@hooks/useCatQueries";
import { useImagePicker } from "@hooks/useImagePicker";
import { useUploadStore } from "@stores/uploadStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const { pickImage } = useImagePicker();
  const {
    mutateAsync: upload,
    isPending,
    error: mutationError,
  } = useUploadMutation();

  const selectedUri = useUploadStore((s) => s.selectedUri);
  const validationErrors = useUploadStore((s) => s.validationErrors);
  const storeError = useUploadStore((s) => s.error);
  const selectImage = useUploadStore((s) => s.selectImage);
  const clearSelection = useUploadStore((s) => s.clearSelection);
  const clearError = useUploadStore((s) => s.clearError);

  const handlePickImage = useCallback(async () => {
    const uri = await pickImage();
    if (uri) selectImage(uri);
  }, [pickImage, selectImage]);

  const handleUpload = useCallback(async () => {
    if (!selectedUri || validationErrors.length > 0) return;
    try {
      await upload(selectedUri);
      clearSelection();
      router.replace("/");
    } catch {
      // error handled by mutation state
    }
  }, [selectedUri, validationErrors, upload, clearSelection]);

  const handleBack = useCallback(() => {
    clearSelection();
    router.back();
  }, [clearSelection]);

  const apiError = mutationError?.message ?? storeError;
  const allErrors = [...(apiError ? [apiError] : []), ...validationErrors];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <AppHeader
          title="Upload a Cat"
          left={
            <IconButton
              iconName="arrow-back"
              iconColor={Colors.text}
              iconSize={24}
              onPress={handleBack}
              disabled={isPending}
            />
          }
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {allErrors.map((msg, i) => (
            <ErrorBanner
              key={i}
              message={msg}
              onDismiss={i === 0 ? clearError : undefined}
            />
          ))}

          <View style={styles.section}>
            <AppText
              variant="label"
              color="textSecondary"
              style={styles.sectionLabel}
            >
              SELECT PHOTO
            </AppText>
            <ImagePickerButton
              uri={selectedUri}
              onPress={handlePickImage}
              disabled={isPending}
            />
          </View>

          {!selectedUri && (
            <View style={styles.instructionsCard}>
              <AppText
                variant="label"
                color="textSecondary"
                style={styles.instructionsTitle}
              >
                Tips for a great cat photo
              </AppText>
              <AppText
                variant="bodySmall"
                color="textSecondary"
                style={styles.instructionText}
              >
                • Make sure you select an actual cat photo, not a human selfie
                or another object!
              </AppText>
              <AppText
                variant="bodySmall"
                color="textSecondary"
                style={styles.instructionText}
              >
                • Make sure your cat is clearly visible
              </AppText>
              <AppText
                variant="bodySmall"
                color="textSecondary"
                style={styles.instructionText}
              >
                • Supported formats: JPG, PNG, GIF, WEBP
              </AppText>
            </View>
          )}

          {selectedUri && (
            <View style={styles.uploadSection}>
              <AppButton
                label={isPending ? "Uploading..." : "Upload Cat"}
                variant="primary"
                size="lg"
                fullWidth
                loading={isPending}
                disabled={validationErrors.length > 0 || isPending}
                onPress={handleUpload}
              />
              {!isPending && (
                <AppButton
                  label="Cancel"
                  variant="ghost"
                  size="md"
                  fullWidth
                  onPress={handleBack}
                  style={styles.cancelButton}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    marginBottom: Spacing.xs,
  },
  instructionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  instructionsTitle: {
    marginBottom: Spacing.xs,
    color: Colors.text,
  },
  instructionText: {
    lineHeight: 22,
  },
  uploadSection: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    marginTop: Spacing.xs,
  },
});
