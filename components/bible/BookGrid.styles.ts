import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  booksGrid: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    flex: 1,
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  bookButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 45,
    maxWidth: 60,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  bookButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
