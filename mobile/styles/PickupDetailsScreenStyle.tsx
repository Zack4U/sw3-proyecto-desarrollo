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
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xxl + 10,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
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
  statusBadgeLarge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  statusTextLarge: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  section: {
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  // Timeline
  timelineContainer: {
    paddingLeft: Spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  timelineItemLast: {
    marginBottom: 0,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineDotCompleted: {
    backgroundColor: Colors.success,
  },
  timelineDotPending: {
    backgroundColor: Colors.border,
  },
  timelineLine: {
    position: "absolute",
    left: 5,
    top: 16,
    bottom: -16,
    width: 2,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.success,
  },
  timelineLinePending: {
    backgroundColor: Colors.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  timelineTitlePending: {
    color: Colors.textSecondary,
  },
  timelineDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  // Food info
  foodContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  foodImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  foodImagePlaceholderText: {
    fontSize: 32,
  },
  foodInfo: {
    flex: 1,
    justifyContent: "center",
  },
  foodName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  foodMeta: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  foodQuantities: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  quantityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  quantityText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  quantityUnit: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Establishment/Beneficiary info
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  infoRowLast: {
    marginBottom: 0,
  },
  infoIcon: {
    width: 24,
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  // Map
  mapContainer: {
    height: 150,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginTop: Spacing.md,
  },
  map: {
    flex: 1,
  },
  // Notes
  notesContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  notesLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  // Actions
  actionsContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  successButton: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  actionButtonIcon: {
    fontSize: FontSizes.lg,
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
  // Modal
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
  modalLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
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
  // Additional styles for PickupDetailsScreen
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  statusHeader: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  statusHeaderIcon: {
    fontSize: 32,
  },
  statusHeaderText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  foodDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  quantitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quantityItem: {
    alignItems: "center",
    padding: Spacing.md,
  },
  quantityValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  quantityLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  scheduleIcon: {
    fontSize: FontSizes.lg,
    width: 30,
    marginRight: Spacing.sm,
  },
  scheduleText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  establishmentName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  addressIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
  },
  addressText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  addressAction: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  beneficiaryName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  cancellationCard: {
    backgroundColor: "#FFEBEE",
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  cancellationText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cancelledByText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  timeline: {
    paddingVertical: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  confirmButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  rejectButton: {
    backgroundColor: Colors.error,
    flex: 1,
  },
  rejectButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  visitButton: {
    backgroundColor: "#9C27B0",
    flex: 1,
  },
  visitButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  completeButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textLight,
  },
  // Additional modal styles
  modalDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: "center",
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
});
