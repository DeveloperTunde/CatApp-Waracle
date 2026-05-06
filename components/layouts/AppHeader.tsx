import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Shadows, Spacing } from "../../constants/theme";
import AppText from "../ui/AppText";

interface AppHeaderProps {
  title?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  showLogo?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  right,
  left,
  showLogo = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.row}>
        <View style={styles.side}>{left}</View>

        <View style={styles.center}>
          {showLogo ? (
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : title ? (
            <AppText variant="h3">{title}</AppText>
          ) : null}
        </View>

        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  side: {
    flex: 1,
    alignItems: "flex-start",
  },
  sideRight: {
    alignItems: "flex-end",
  },
  center: {
    flex: 3,
    alignItems: "center",
  },
  logo: {
    height: 32,
    width: 120,
  },
});

export default AppHeader;
