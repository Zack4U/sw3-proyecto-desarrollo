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
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xxl + 10,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    opacity: 0.9,
  },
  // Stats section
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: -Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    gap: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  // Tabs
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textLight,
  },
  // List
  listContainer: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pickupCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  pickupCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  pickupCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  pickupCardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  pickupCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  pickupCardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  statusIcon: {
    fontSize: FontSizes.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  pickupCardBody: {
    gap: Spacing.xs,
  },
  pickupInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickupInfoIcon: {
    width: 20,
    fontSize: FontSizes.md,
    marginRight: Spacing.sm,
  },
  pickupInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  pickupInfoHighlight: {
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  pickupCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pickupDate: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  viewDetailsText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  emptyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  // Refresh
  refreshing: {
    paddingVertical: Spacing.md,
  },
});
