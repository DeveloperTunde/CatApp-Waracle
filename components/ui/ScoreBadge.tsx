import { Colors } from "@constants/colors";
import { BorderRadius, Spacing } from "@constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const isPositive = score > 0;
  const isNegative = score < 0;

  const bg = isPositive
    ? Colors.voteUp + "22"
    : isNegative
      ? Colors.voteDown + "22"
      : Colors.surfaceSecondary;

  const textColor = isPositive
    ? Colors.voteUp
    : isNegative
      ? Colors.voteDown
      : Colors.textSecondary;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText variant="label" style={{ color: textColor }}>
        {isPositive ? `+${score}` : score}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
});

export default ScoreBadge;
