import { Colors } from "@constants/colors";
import { BorderRadius, Spacing } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

interface IconButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  label?: string;
  labelColor?: string;
  active?: boolean;
  activeColor?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline";
}

const sizeMap = { sm: 20, md: 24, lg: 28 };

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconSize,
  iconColor,
  label,
  labelColor,
  active = false,
  activeColor,
  size = "md",
  variant = "default",
  style,
  disabled,
  ...props
}) => {
  const resolvedIconSize = iconSize ?? sizeMap[size];
  const resolvedIconColor =
    active && activeColor ? activeColor : (iconColor ?? Colors.textSecondary);
  const resolvedLabelColor =
    active && activeColor ? activeColor : (labelColor ?? Colors.textSecondary);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.base,
        variant === "filled" && {
          backgroundColor: resolvedIconColor + "20",
          borderRadius: BorderRadius.full,
        },
        variant === "outline" && {
          borderWidth: 1,
          borderColor: resolvedIconColor,
          borderRadius: BorderRadius.full,
          padding: Spacing.xs,
        },
        disabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      <Ionicons
        name={iconName}
        size={resolvedIconSize}
        color={resolvedIconColor}
      />
      {label ? (
        <AppText
          variant="caption"
          style={{ color: resolvedLabelColor, marginTop: 2, fontWeight: "600" }}
        >
          {label}
        </AppText>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xs,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default IconButton;
