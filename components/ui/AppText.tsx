import { Colors } from "@constants/colors";
import { Typography } from "@constants/theme";
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "button";
type TextColor = keyof typeof Colors;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextStyle["textAlign"];
  italic?: boolean;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  h1: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.extrabold,
    lineHeight: Typography.fontSizes.xxxl * Typography.lineHeights.tight,
  },
  h2: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    lineHeight: Typography.fontSizes.xxl * Typography.lineHeights.tight,
  },
  h3: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.semibold,
    lineHeight: Typography.fontSizes.xl * Typography.lineHeights.normal,
  },
  body: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.regular,
    lineHeight: Typography.fontSizes.md * Typography.lineHeights.normal,
  },
  bodySmall: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.regular,
    lineHeight: Typography.fontSizes.sm * Typography.lineHeights.normal,
  },
  caption: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.regular,
    lineHeight: Typography.fontSizes.xs * Typography.lineHeights.relaxed,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    lineHeight: Typography.fontSizes.sm * Typography.lineHeights.normal,
    letterSpacing: 0.3,
  },
  button: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    lineHeight: Typography.fontSizes.md * Typography.lineHeights.normal,
  },
};

const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color = "text",
  align,
  italic = false,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: Colors[color] },
        align ? { textAlign: align } : undefined,
        italic ? { fontStyle: "italic" } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
