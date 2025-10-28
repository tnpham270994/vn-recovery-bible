import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TextSelectionToolbarProps {
  visible: boolean;
  onHighlight: () => void;
  onCopy: () => void;
  onRemoveHighlight?: () => void;
  isHighlighted?: boolean;
  onClose?: () => void;
}

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  visible,
  onHighlight,
  onCopy,
  onRemoveHighlight,
  isHighlighted = false,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View 
      style={styles.floatingButtons}
      data-toolbar
    >
      {onClose && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <FontAwesome name="times" size={18} color="#666" />
        </TouchableOpacity>
      )}
      {isHighlighted && onRemoveHighlight ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRemoveHighlight}
        >
          <FontAwesome name="eraser" size={24} color="#FF3B30" />
          <Text style={styles.buttonLabel}>Remove</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onHighlight}
        >
          <FontAwesome name="paint-brush" size={24} color="#007AFF" />
          <Text style={styles.buttonLabel}>Highlight</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={onCopy}
      >
        <FontAwesome name="clone" size={24} color="#34C759" />
        <Text style={styles.buttonLabel}>Copy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtons: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -100 }],
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    gap: 8,
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
