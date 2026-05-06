import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/theme";
import IconButton from "../ui/IconButton";
import ScoreBadge from "../ui/ScoreBadge";

interface VoteControlsProps {
  score: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  onVoteUp: () => void;
  onVoteDown: () => void;
  disabled?: boolean;
}

const VoteControls: React.FC<VoteControlsProps> = ({
  score,
  userUpvoted,
  userDownvoted,
  onVoteUp,
  onVoteDown,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconButton
          iconName={userUpvoted ? "thumbs-up" : "thumbs-up-outline"}
          iconSize={16}
          active={userUpvoted}
          activeColor={Colors.voteUp}
          iconColor={Colors.textSecondary}
          label=""
          labelColor={Colors.textSecondary}
          onPress={onVoteUp}
          disabled={disabled}
        />
      </View>

      <ScoreBadge score={score} />

      <View style={styles.iconWrapper}>
        <IconButton
          iconName={userDownvoted ? "thumbs-down" : "thumbs-down-outline"}
          iconSize={16}
          active={userDownvoted}
          activeColor={Colors.voteDown}
          iconColor={Colors.textSecondary}
          label=""
          labelColor={Colors.textSecondary}
          onPress={onVoteDown}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: Spacing.sm,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VoteControls;
