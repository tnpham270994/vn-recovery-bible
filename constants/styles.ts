import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#5A4A3A',
  secondary: '#B8860B',
  background: '#FEFCF8',
  surface: '#F8F4F0',
  border: '#E0D5C7',
  text: '#5A4A3A',
  textSecondary: '#8B4513',
  accent: '#F0E6D2',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  selected: '#007AFF',
  selectedBackground: '#E6F3FF',
  white: '#FFFFFF',
  shadow: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  bold: 'bold' as const,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
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
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  grid: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    color: COLORS.text,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    fontStyle: 'italic',
    color: COLORS.text,
    textAlign: 'center',
  },
});
