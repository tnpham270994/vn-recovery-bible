import { BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f0',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: SPACING.sm,
    borderRadius: 8,
  },
  headerText: {
    color: '#5A4A3A',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Account for iOS tab bar height
  },
  bookDetailContainer: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#f5f5f5',
  },
  changeBookButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#f5f5f5',
  },
  bookTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#5A4A3A',
    flex: 1,
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#5A4A3A',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
