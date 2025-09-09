import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Footnote } from '@/constants/bibleData';
import React, { useEffect, useRef } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './FootnoteModal.styles';

interface FootnoteModalProps {
  visible: boolean;
  footnotes: Footnote[];
  verseNumber: number;
  bookCode: string;
  chapter: number;
  selectedFootnoteId: string | null;
  onClose: () => void;
  onFootnoteSelect: (footnoteId: string) => void;
}

export const FootnoteModal: React.FC<FootnoteModalProps> = ({
  visible,
  footnotes,
  verseNumber,
  bookCode,
  chapter,
  selectedFootnoteId,
  onClose,
  onFootnoteSelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (visible && selectedFootnoteId && footnotes.length > 0) {
      const footnoteIndex = footnotes.findIndex(f => f.id === selectedFootnoteId);
      
      if (footnoteIndex !== -1) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: footnoteIndex * 120,
            animated: true
          });
        }, 200);
      }
    }
  }, [visible, selectedFootnoteId, footnotes]);
  
  if (footnotes.length === 0) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContentBottom} onPress={(e: any) => e.stopPropagation()}>
          <View style={styles.modalDragIndicator} />
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Chú thích {bookCode} {chapter}:{verseNumber}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color="#5A4A3A" />
            </TouchableOpacity>
          </View>
          <ScrollView ref={scrollViewRef} style={styles.modalScrollView}>
            {footnotes.map((footnote) => {
              const isSelected = footnote.id === selectedFootnoteId;
              
              return (
                <TouchableOpacity
                  key={footnote.id}
                  onPress={() => onFootnoteSelect(footnote.id)}
                  style={[
                    styles.modalFootnoteItem,
                    isSelected && styles.modalFootnoteItemSelected
                  ]}
                >
                  <ThemedText style={[
                    styles.modalFootnoteNumber,
                    isSelected && styles.modalFootnoteNumberSelected
                  ]}>[{footnote.id}]</ThemedText>
                  <ThemedText style={[
                    styles.modalFootnoteText,
                    isSelected && styles.modalFootnoteTextSelected
                  ]}>{footnote.text}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
