import { BORDER_RADIUS, COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/styles';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Floating Action Button
  floatingButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    width:32,
    height: 32,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240,230,210,1.00)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Menu
  floatingMenu: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.lg,
    maxWidth: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  // Menu Header
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  menuTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },

  closeButton: {
    padding: SPACING.sm,
  },

  // Menu Sections
  menuSection: {
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  // Font Size Buttons
  sizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  sizeButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 40,
    alignItems: 'center',
  },

  selectedSizeButton: {
    backgroundColor: COLORS.selectedBackground,
    borderColor: COLORS.selected,
  },

  sizeButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },

  selectedSizeButtonText: {
    color: COLORS.selected,
    fontWeight: FONT_WEIGHTS.bold,
  },

  // Font Family List
  familyList: {
    maxHeight: 200,
  },

  familyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },

  selectedFamilyItem: {
    backgroundColor: COLORS.selectedBackground,
  },

  familyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },

  selectedFamilyText: {
    color: COLORS.selected,
    fontWeight: FONT_WEIGHTS.bold,
  },

  // Color Picker
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },

  selectedColorButton: {
    borderColor: '#333',
    borderWidth: 3,
  },

  // Reset Button
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },

  resetButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
});
