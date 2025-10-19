// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.large,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.large,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});
