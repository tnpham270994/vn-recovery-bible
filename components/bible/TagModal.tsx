import { ThemedText } from '@/components/ThemedText';
import { useTags } from '@/contexts/TagsContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TagModalProps {
  visible: boolean;
  bookCode: string;
  chapter: number;
  verse: number;
  onClose: () => void;
}

const TAG_COLORS = [ '#FFFF00', '#00FF00', '#FF00FF', '#00FFFF', '#FFA500'];

export const TagModal: React.FC<TagModalProps> = ({ visible, bookCode, chapter, verse, onClose }) => {
  const { tags, addTag, hasTag, addTagToVerse, removeTagFromVerse, verseTags } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  
  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      const tagId = addTag(newTagName, selectedColor);
      addTagToVerse(bookCode, chapter, verse, tagId);
      setNewTagName('');
    }
  };
  
  const handleToggleTag = (tagId: string) => {
    const verseTag = verseTags.find(vt =>
      vt.bookCode === bookCode &&
      vt.chapter === chapter &&
      vt.verse === verse &&
      vt.tagId === tagId
    );
    
    if (verseTag) {
      removeTagFromVerse(verseTag.id);
    } else {
      addTagToVerse(bookCode, chapter, verse, tagId);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <FontAwesome name="tags" size={24} color="#5A4A3A" />
            <ThemedText style={styles.headerTitle}>Add Tags</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Create new tag */}
          <View style={styles.newTagSection}>
            <ThemedText style={styles.sectionTitle}>Create New Tag</ThemedText>
            <View style={styles.colorPicker}>
              {TAG_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, selectedColor === color && styles.colorOptionSelected]}
                  onPress={() => setSelectedColor(color)}
                >
                  <View style={[styles.colorCircle, { backgroundColor: color }]} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Tag name"
                value={newTagName}
                onChangeText={setNewTagName}
                onSubmitEditing={handleAddNewTag}
              />
              <TouchableOpacity style={[styles.addButton, !newTagName.trim() && styles.addButtonDisabled]} onPress={handleAddNewTag}>
                <FontAwesome name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Existing tags */}
          <View style={styles.existingTagsSection}>
            <ThemedText style={styles.sectionTitle}>Existing Tags</ThemedText>
            <View style={styles.tagsList}>
              {tags.map((tag) => {
                const isSelected = hasTag(bookCode, chapter, verse, tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                    onPress={() => handleToggleTag(tag.id)}
                  >
                    <View style={[styles.tagColorIndicator, { backgroundColor: tag.color }]} />
                    <ThemedText style={[styles.tagName, isSelected && styles.tagNameSelected]}>
                      {tag.name}
                    </ThemedText>
                    {isSelected && <FontAwesome name="check" size={14} color="#fff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  closeButton: {
    padding: 8,
  },
  newTagSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  colorOption: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  existingTagsSection: {
    flex: 1,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  tagChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagName: {
    fontSize: 14,
    color: '#333',
  },
  tagNameSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});