import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from './global';

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  filterContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  picker: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  buttonContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  resultList: {
    flex: 1,
    marginTop: Spacing.md,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  name: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    marginBottom: 4,
  },

  address: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },

  neighborhood: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  noResults: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
  },

  loadingText: {
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.lg,
  },

  errorText: {
    textAlign: 'center',
    color: Colors.error,
    marginVertical: Spacing.md,
  },
});
