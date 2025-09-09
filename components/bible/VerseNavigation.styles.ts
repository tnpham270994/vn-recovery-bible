import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    maxHeight: 120, // Increased height to accommodate multiple rows
  },
  title: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 320, // Fixed width for 10 items (28px each + margins)
    paddingHorizontal: SPACING.xs,
    marginBottom: 10, // Add 10px margin bottom between rows
  },
  verseButton: {
    minWidth: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    paddingHorizontal: 4,
  },
  verseButtonText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
});
