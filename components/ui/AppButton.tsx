import { Colors } from "@constants/colors";
import { BorderRadius, Spacing } from "@constants/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface AppButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label: string;
}

const variantConfig: Record<
  ButtonVariant,
  { bg: string; text: string; border?: string }
> = {
  primary: { bg: Colors.primary, text: Colors.white },
  secondary: { bg: Colors.surfaceSecondary, text: Colors.text },
  outline: { bg: "transparent", text: Colors.primary, border: Colors.primary },
  ghost: { bg: "transparent", text: Colors.primary },
  danger: { bg: Colors.error, text: Colors.white },
};

const sizeConfig: Record<
  ButtonSize,
  { py: number; px: number; fontSize: number; borderRadius: number }
> = {
  sm: {
    py: Spacing.xs,
    px: Spacing.md,
    fontSize: 13,
    borderRadius: BorderRadius.sm,
  },
  md: {
    py: Spacing.sm + 2,
    px: Spacing.xl,
    fontSize: 15,
    borderRadius: BorderRadius.md,
  },
  lg: {
    py: Spacing.md,
    px: Spacing.xxl,
    fontSize: 17,
    borderRadius: BorderRadius.lg,
  },
};

const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  label,
  disabled,
  style,
  ...props
}) => {
  const vConfig = variantConfig[variant];
  const sConfig = sizeConfig[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: vConfig.bg,
          borderColor: vConfig.border ?? "transparent",
          borderWidth: vConfig.border ? 1.5 : 0,
          paddingVertical: sConfig.py,
          paddingHorizontal: sConfig.px,
          borderRadius: sConfig.borderRadius,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={vConfig.text} size="small" />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant="button"
            style={{
              color: vConfig.text,
              fontSize: sConfig.fontSize,
              marginLeft: leftIcon ? 6 : 0,
              marginRight: rightIcon ? 6 : 0,
            }}
          >
            {label}
          </AppText>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
