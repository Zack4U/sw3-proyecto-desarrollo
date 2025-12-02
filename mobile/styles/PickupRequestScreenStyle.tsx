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
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadows.md,
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  foodCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  foodImage: {
    width: "100%",
    height: 150,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  foodImagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  foodImagePlaceholderText: {
    fontSize: 48,
  },
  foodName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  foodDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  foodMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  foodMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  foodMetaIcon: {
    marginRight: Spacing.xs,
  },
  foodMetaText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  textArea: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: "top",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  quantityInput: {
    flex: 1,
  },
  quantityInfo: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  datePickerButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  datePickerPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  datePickerIcon: {
    fontSize: FontSizes.lg,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
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
    maxHeight: "70%",
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  dateOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.background,
    alignItems: "center",
  },
  dateOptionSelected: {
    backgroundColor: Colors.primary,
  },
  dateOptionText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  dateOptionTextSelected: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  modalCloseButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalCloseButtonText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
});
