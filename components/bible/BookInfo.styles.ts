import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bookInfoContainer: {
    marginBottom: SPACING.xxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  bookInfoText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    color: COLORS.text,
    flex: 1,
  },
  infoLabel: {
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
});
