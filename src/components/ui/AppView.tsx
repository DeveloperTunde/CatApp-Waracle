import { Colors } from "@constants/colors";
import { BorderRadius, Shadows } from "@constants/theme";
import React from "react";
import { View, ViewProps } from "react-native";

type BgColor = keyof typeof Colors;
type ShadowSize = keyof typeof Shadows;

interface AppViewProps extends ViewProps {
  bg?: BgColor;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  rounded?: keyof typeof BorderRadius;
  shadow?: ShadowSize;
  flex?: number;
  row?: boolean;
  center?: boolean;
  align?: "flex-start" | "flex-end" | "center" | "stretch";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
}

const AppView: React.FC<AppViewProps> = ({
  bg,
  p,
  px,
  py,
  pt,
  pb,
  m,
  mx,
  my,
  mt,
  mb,
  rounded,
  shadow,
  flex,
  row,
  center,
  align,
  justify,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        bg ? { backgroundColor: Colors[bg] } : undefined,
        p !== undefined ? { padding: p } : undefined,
        px !== undefined ? { paddingHorizontal: px } : undefined,
        py !== undefined ? { paddingVertical: py } : undefined,
        pt !== undefined ? { paddingTop: pt } : undefined,
        pb !== undefined ? { paddingBottom: pb } : undefined,
        m !== undefined ? { margin: m } : undefined,
        mx !== undefined ? { marginHorizontal: mx } : undefined,
        my !== undefined ? { marginVertical: my } : undefined,
        mt !== undefined ? { marginTop: mt } : undefined,
        mb !== undefined ? { marginBottom: mb } : undefined,
        rounded ? { borderRadius: BorderRadius[rounded] } : undefined,
        shadow ? Shadows[shadow] : undefined,
        flex !== undefined ? { flex } : undefined,
        row ? { flexDirection: "row" } : undefined,
        center ? { alignItems: "center", justifyContent: "center" } : undefined,
        align ? { alignItems: align } : undefined,
        justify ? { justifyContent: justify } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default AppView;
