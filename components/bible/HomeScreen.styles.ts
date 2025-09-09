import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    height: '100%',
    padding: 0,
    paddingBottom: Platform.OS === 'ios' ? 100 : 0, // Account for iOS tab bar height
    alignItems: 'center',
  },
  bookDetailContainer: {
    flex: 1,
    padding: SPACING.xl,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: COLORS.background,
  },
  bookHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bookTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
});
