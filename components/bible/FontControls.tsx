import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/styles';
import { FONT_FAMILIES, FONT_SIZES, useFontSettings } from '@/contexts/FontSettingsContext';
import { HIGHLIGHT_COLORS } from '@/contexts/HighlightsContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './FontControls.styles';

interface FontControlsProps {
  onClose?: () => void;
  highlightColor?: string;
  onHighlightColorChange?: (color: string) => void;
}

export const FontControls: React.FC<FontControlsProps> = ({ onClose, highlightColor, onHighlightColorChange }) => {
  const { fontSettings, updateFontSize, updateFontFamily, resetFontSettings } = useFontSettings();
  const [showFontMenu, setShowFontMenu] = useState(false);

  const handleFontSizeChange = (size: number) => {
    updateFontSize(size);
  };

  const handleFontFamilyChange = (family: string) => {
    updateFontFamily(family);
  };

  const handleReset = () => {
    resetFontSettings();
    setShowFontMenu(false);
    onClose?.();
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowFontMenu(true)}
        activeOpacity={0.8}
      >
        <FontAwesome name="font" size={18} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Font Menu Modal */}
      <Modal
        visible={showFontMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFontMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFontMenu(false)}
        >
          <View style={styles.floatingMenu}>
            <View style={styles.menuHeader}>
              <ThemedText style={styles.menuTitle}>Font Settings</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFontMenu(false)}
              >
                <IconSymbol name="xmark" size={20} color="#5A4A3A" />
              </TouchableOpacity>
            </View>

            {/* Font Size Section */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Font Size</ThemedText>
              <View style={styles.sizeButtons}>
                {FONT_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      fontSettings.fontSize === size && styles.selectedSizeButton
                    ]}
                    onPress={() => handleFontSizeChange(size)}
                  >
                    <ThemedText style={[
                      styles.sizeButtonText,
                      fontSettings.fontSize === size && styles.selectedSizeButtonText
                    ]}>
                      {size}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Font Family Section */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Font Family</ThemedText>
              <ScrollView style={styles.familyList} showsVerticalScrollIndicator={false}>
                {FONT_FAMILIES.map((family) => (
                  <TouchableOpacity
                    key={family.value}
                    style={[
                      styles.familyItem,
                      fontSettings.fontFamily === family.value && styles.selectedFamilyItem
                    ]}
                    onPress={() => handleFontFamilyChange(family.value)}
                  >
                    <ThemedText style={[
                      styles.familyText,
                      { fontFamily: family.value === 'System' ? undefined : family.value },
                      fontSettings.fontFamily === family.value && styles.selectedFamilyText
                    ]}>
                      {family.name}
                    </ThemedText>
                    {fontSettings.fontFamily === family.value && (
                      <IconSymbol name="checkmark" size={16} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Highlight Color Section */}
            {onHighlightColorChange && (
              <View style={styles.menuSection}>
                <ThemedText style={styles.sectionTitle}>Highlight Color</ThemedText>
                <View style={styles.colorPicker}>
                  {HIGHLIGHT_COLORS.map((color: string) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        highlightColor === color && styles.selectedColorButton
                      ]}
                      onPress={() => onHighlightColorChange(color)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <IconSymbol name="arrow.clockwise" size={18} color="#5A4A3A" />
              <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
