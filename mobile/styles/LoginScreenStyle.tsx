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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    gap: Spacing.md,
  },
  actions: {
    marginTop: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  linkText: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  divider: {
    marginTop: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  googleContainer: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  link: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
});
