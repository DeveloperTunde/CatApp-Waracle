import { Colors } from "@constants/colors";
import { Spacing } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@ui/AppButton";
import AppText from "@ui/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = "images-outline",
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={72} color={Colors.border} />
      <AppText
        variant="h3"
        color="textSecondary"
        align="center"
        style={styles.title}
      >
        {title}
      </AppText>
      {subtitle ? (
        <AppText
          variant="body"
          color="textDisabled"
          align="center"
          style={styles.subtitle}
        >
          {subtitle}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.action}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
  },
  title: {
    marginTop: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  action: {
    marginTop: Spacing.xl,
  },
});

export default EmptyState;
