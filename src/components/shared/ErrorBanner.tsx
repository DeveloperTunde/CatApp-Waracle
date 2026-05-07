import { Colors } from "@constants/colors";
import { BorderRadius, Spacing } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AppText from "@ui/AppText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle"
        size={18}
        color={Colors.error}
        style={styles.icon}
      />
      <AppText variant="bodySmall" style={styles.message} color="error">
        {message}
      </AppText>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={18} color={Colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.error + "15",
    borderWidth: 1,
    borderColor: Colors.error + "40",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs,
    flexShrink: 0,
  },
  message: {
    flex: 1,
    marginRight: Spacing.xs,
  },
});

export default ErrorBanner;
