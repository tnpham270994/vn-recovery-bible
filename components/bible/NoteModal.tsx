import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/constants/bibleData';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface NoteModalProps {
  visible: boolean;
  book: Book;
  chapter: number;
  verse: number;
  existingNote?: string;
  scale: number;
  onClose: () => void;
  onSave: (text: string) => void;
  onDelete: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  visible,
  book,
  chapter,
  verse,
  existingNote,
  scale,
  onClose,
  onSave,
  onDelete,
}) => {
  const [noteText, setNoteText] = useState(existingNote || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNoteText(existingNote || '');
    setIsEditing(!existingNote);
  }, [existingNote, visible]);

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(noteText);
      setIsEditing(false);
    } else {
      onDelete();
    }
    onClose();
  };

  const handleDelete = () => {
    setNoteText('');
    onDelete();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[styles.modalContent, { transform: [{ scale }] }]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FontAwesome name="sticky-note" size={24} color="#5A4A3A" />
              <View style={styles.headerText}>
                <ThemedText style={styles.headerTitle}>Note</ThemedText>
                <ThemedText style={styles.verseReference}>
                  {book.shortName} {chapter}:{verse}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Add your note here..."
            placeholderTextColor="#999"
            value={noteText}
            onChangeText={setNoteText}
            editable={isEditing}
            autoFocus={isEditing && Platform.OS !== 'web'}
          />

          <View style={styles.footer}>
            {existingNote && !isEditing && (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <FontAwesome name="pencil" size={16} color="#fff" />
                <ThemedText style={styles.buttonText}>Edit</ThemedText>
              </TouchableOpacity>
            )}
            {existingNote && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <FontAwesome name="trash" size={16} color="#fff" />
                <ThemedText style={styles.buttonText}>Delete</ThemedText>
              </TouchableOpacity>
            )}
            {isEditing && (
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <FontAwesome name="check" size={16} color="#fff" />
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              </TouchableOpacity>
            )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  verseReference: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  textInput: {
    minHeight: 150,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#333',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
