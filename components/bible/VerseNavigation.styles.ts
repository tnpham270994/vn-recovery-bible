import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    marginBottom: 8,
    gap: 4,
    flexWrap: 'wrap',
  },
  verseButton: {
    minWidth: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.accent, // Use app's accent color
    borderWidth: 1,
    borderColor: COLORS.border, // Use app's border color
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  verseButtonText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text, // Use app's text color
  },
  verseButtonPressed: {
    backgroundColor: COLORS.primary, // Darker background when pressed
    borderColor: COLORS.secondary, // Golden border when pressed
  },
  verseButtonTextPressed: {
    color: COLORS.white, // White text when pressed
    fontWeight: FONT_WEIGHTS.bold,
  },
  dotButton: {
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dotButtonPressed: {
    backgroundColor: COLORS.primary,
  },
  emptySlot: {
    minWidth: 32,
    height: 32,
  },
});
