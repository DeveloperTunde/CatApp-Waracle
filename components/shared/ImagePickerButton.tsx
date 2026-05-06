import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { BorderRadius, Shadows, Spacing } from "../../constants/theme";
import AppText from "../ui/AppText";

interface ImagePickerButtonProps {
  uri?: string | null;
  onPress: () => void;
  disabled?: boolean;
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  uri,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, disabled && styles.disabled]}
    >
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
          <View style={styles.changeOverlay}>
            <Ionicons name="camera" size={24} color={Colors.white} />
            <AppText variant="label" style={styles.changeText}>
              Change photo
            </AppText>
          </View>
        </>
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name="cloud-upload-outline"
            size={52}
            color={Colors.primary}
          />
          <AppText variant="h3" color="primary" style={styles.uploadLabel}>
            Upload a Cat
          </AppText>
          <AppText
            variant="bodySmall"
            color="textSecondary"
            align="center"
            style={styles.hint}
          >
            Tap to select a photo from your library
          </AppText>
          <AppText
            variant="caption"
            color="textDisabled"
            align="center"
            style={styles.formats}
          >
            JPG, PNG, GIF, WEBP • Max 10MB
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary + "40",
    borderStyle: "dashed",
    overflow: "hidden",
    backgroundColor: Colors.primary + "08",
    ...Shadows.sm,
  },
  disabled: { opacity: 0.6 },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  uploadLabel: {
    marginTop: Spacing.md,
  },
  hint: {
    marginTop: Spacing.sm,
  },
  formats: {
    marginTop: Spacing.xs,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlay,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  changeText: {
    color: Colors.white,
  },
});

export default ImagePickerButton;
