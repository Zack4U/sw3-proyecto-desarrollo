import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  GlobalStyles,
} from "./global";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    ...GlobalStyles.header,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  title: {
    ...GlobalStyles.headerTitle,
  },
  subtitle: {
    ...GlobalStyles.headerSubtitle,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginHorizontal: Spacing.xs,
    minWidth: 120,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  toggleButtonTextActive: {
    color: Colors.textLight,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 5,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  markerCallout: {
    minWidth: 200,
    padding: Spacing.sm,
  },
  markerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  markerAddress: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  markerType: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  markerFoodAvailable: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.error,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  errorText: {
    color: Colors.textLight,
    fontSize: FontSizes.md,
    textAlign: "center",
  },
});
