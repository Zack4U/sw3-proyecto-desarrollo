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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.md,
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
  tabBadge: {
    position: "absolute",
    top: -4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.round,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  listContainer: {
    flex: 1,
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
  pickupCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  pickupCardTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  pickupCardBody: {
    marginBottom: Spacing.sm,
  },
  pickupInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  pickupInfoIcon: {
    width: 20,
    textAlign: "center",
    marginRight: Spacing.sm,
  },
  pickupInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  pickupInfoTextBold: {
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  pickupCardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  completeButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
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
  },
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
  refreshing: {
    paddingVertical: Spacing.md,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  modalText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  modalButtonDanger: {
    backgroundColor: Colors.error,
  },
  modalButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  modalButtonTextCancel: {
    color: Colors.textSecondary,
  },
  modalButtonTextConfirm: {
    color: Colors.textLight,
  },
  // Additional styles needed by PickupManagementScreen
  pickupCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  pickupCardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  pickupCardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusIcon: {
    fontSize: FontSizes.sm,
    marginRight: 4,
  },
  pickupInfoHighlight: {
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  visitButton: {
    backgroundColor: "#9C27B0",
    flex: 1,
    justifyContent: "center",
  },
  visitButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
    textAlign: "center",
  },
  waitingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  waitingIcon: {
    fontSize: FontSizes.lg,
  },
  waitingText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
  rejectButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  confirmButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  completeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  pickupDate: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  modalDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalInputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalCancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    backgroundColor: Colors.primary,
  },
  modalConfirmButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  modalRejectButton: {
    backgroundColor: Colors.error,
  },
  modalRejectButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
});
