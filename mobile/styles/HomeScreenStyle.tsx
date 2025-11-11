import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "./global";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    flex: 1,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  profileButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary || "#10B981",
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButtonText: {
    fontSize: FontSizes.md,
    color: "#FFFFFF",
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.error || "#EF4444",
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  menuContainer: {
    gap: Spacing.md,
  },
  menuButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    ...Shadows.md,
  },
  establishmentButton: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
  },
  beneficiaryButton: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.secondary,
  },
  notificationTestButton: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  // foodButton removed for simplified menu
  buttonIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  buttonDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tokenStatusSmall: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    marginTop: Spacing.xs,
    fontWeight: FontWeights.semibold,
  },
});
