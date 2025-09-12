import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  verseDisplayContainer: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Account for iOS safe area
    backgroundColor: COLORS.background,
  },
  navigationContainer: {
    marginBottom: SPACING.md
  },
  versesContainer: {
    flex: 1,
  },
  verseItem: {
    marginBottom: SPACING.xl,
    width: '100%',
  },
  verseLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  verseText: {
    fontSize: FONT_SIZES.lg,
    lineHeight: 28,
    color: COLORS.text,
    textAlign: 'justify',
    flexShrink: 1,
    ...(Platform.OS === 'ios' && {
      lineHeight: 32, // Slightly more line height for iOS to accommodate superscripts
    }),
    ...(Platform.OS === 'android' && {
      lineHeight: 30, // Slightly more line height for Android to accommodate superscripts
    }),
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.background,
    borderColor: '#e0e0e0',
  },
  chapterTitleContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chapterTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    flex: 1,
  },
  backToChaptersButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
    flex: 1,
    ...(Platform.OS === 'ios' && {
      alignItems: 'baseline',
    }),
    ...(Platform.OS === 'android' && {
      alignItems: 'baseline',
    }),
  },
  superscriptContainer: {
    marginRight: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 16,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    ...(Platform.OS === 'ios' && {
      alignSelf: 'baseline',
      marginTop: -2,
    }),
    ...(Platform.OS === 'android' && {
      alignSelf: 'baseline',
      marginTop: -3,
    }),
  },
  superscriptText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#007AFF',
    lineHeight: 10,
    ...(Platform.OS === 'web' 
      ? { 
          transform: [{ translateY: -6 }],
        }
      : Platform.OS === 'ios'
      ? {
          fontSize: 8,
          lineHeight: 8,
          marginTop: -4,
        }
      : {
          // Android
          fontSize: 9,
          lineHeight: 9,
          marginTop: -5,
        }
    ),
  },
  anchorContainer: {
    marginHorizontal: 2,
    paddingVertical: 1,
    paddingHorizontal: 3,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  anchorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  chapterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
    justifyContent: 'center',
  },
  footerNavButtonDisabled: {
    backgroundColor: COLORS.background,
    borderColor: '#e0e0e0',
  },
  footerNavButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
  },
  footerNavButtonTextDisabled: {
    color: '#ccc',
  },
  italicText: {
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: 'bold',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  highlightedText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  highlightedTextContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 2,
  },
});
