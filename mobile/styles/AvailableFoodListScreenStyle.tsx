import { StyleSheet } from "react-native";
import { Colors, Spacing } from "./global";

export const availableFoodListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as any,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as any,
    color: Colors.textLight,
    opacity: 0.9,
  },

  // Filtros
  filtersContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: Spacing.md,
  },
  pickerContainer: {
    marginBottom: Spacing.md,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500" as any,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  picker: {
    height: 50,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButton: {
    marginTop: Spacing.xs,
  },

  // Card de alimento
  foodCard: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: 0,
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.border,
  },
  urgentBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    zIndex: 1,
  },
  urgentBadgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: "700" as any,
  },
  foodInfo: {
    padding: Spacing.md,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "700" as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  foodDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500" as any,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  establishmentAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 100,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm,
  },
  expiringText: {
    color: Colors.warning,
    fontWeight: "700" as any,
  },

  // Estado vacío
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as any,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
});
