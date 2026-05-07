import { Colors } from "@constants/colors";
import { Spacing } from "@constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface DividerProps {
  my?: number;
  color?: string;
}

const Divider: React.FC<DividerProps> = ({
  my = Spacing.sm,
  color = Colors.border,
}) => (
  <View
    style={[styles.divider, { marginVertical: my, backgroundColor: color }]}
  />
);

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});

export default Divider;
