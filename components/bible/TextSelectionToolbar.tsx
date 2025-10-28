import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TextSelectionToolbarProps {
  visible: boolean;
  onHighlight: () => void;
  onCopy: () => void;
  onNote?: () => void;
  onBookmark?: () => void;
  onTag?: () => void;  // Add this
  onRemoveHighlight?: () => void;
  isHighlighted?: boolean;
  hasNote?: boolean;
  isBookmarked?: boolean;
  hasTags?: boolean;  // Add this
  onClose?: () => void;
}
export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  visible,
  onHighlight,
  onCopy,
  onNote,
  onBookmark,
  onRemoveHighlight,
  isHighlighted = false,
  hasNote = false,
  isBookmarked = false,
  hasTags = false,
  onTag,
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
          <FontAwesome name="eraser" size={18} color="#FF3B30" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onHighlight}
        >
          <FontAwesome name="paint-brush" size={18} color="#007AFF" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={onCopy}
      >
        <FontAwesome name="clone" size={18} color="#34C759" />
      </TouchableOpacity>

      {onNote && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onNote}
        >
          <FontAwesome 
            name={hasNote ? "sticky-note-o" : "sticky-note"} 
            size={18} 
            color={hasNote ? "#FF9500" : "#8E8E93"} 
          />
        </TouchableOpacity>
      )}

      {onBookmark && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onBookmark}
        >
          <FontAwesome 
            name={isBookmarked ? "bookmark" : "bookmark-o"} 
            size={18} 
            color={isBookmarked ? "#007AFF" : "#8E8E93"} 
          />
        </TouchableOpacity>
      )}

      {onTag && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onTag}
        >
          <FontAwesome 
            name={hasTags ? "tags" : "tag"} 
            size={18} 
            color={hasTags ? "#AF52DE" : "#8E8E93"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtons: {
    position: 'absolute',
    bottom: 16,
    left: '40%',
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
