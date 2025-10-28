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
    width: '100%',
  },
  verseLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textSecondary,
  },
  verseText: {
    // fontSize removed - will be set dynamically
    lineHeight: 32,
    color: COLORS.text,
    textAlign: 'justify'
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
    flex: 1
  },
  superscriptContainer: {
    marginRight: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 6,
  },
  superscriptText: {
    // fontSize and lineHeight removed - will be set dynamically relative to main font size
    fontWeight: 'bold',
    color: '#007AFF',
    transform: [Platform.OS === 'web' ? { translateY: -6 } : { translateY: 0 }],
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
  noteUnderline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLORS.primary
  },
  selectedVerseContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
});
