import { Spacing } from "@/constants/theme";
import { Dimensions } from "react-native";

export const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const NUM_COLUMNS = SCREEN_WIDTH >= 600 ? 3 : 2;

export const CARD_MARGIN = Spacing.sm;

export const CARD_WIDTH =
  (SCREEN_WIDTH - CARD_MARGIN * (NUM_COLUMNS + 1) * 2) / NUM_COLUMNS;

export const IMAGE_HEIGHT = CARD_WIDTH;
