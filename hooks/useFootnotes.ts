import { Footnote } from '@/constants/bibleData';
import { useState } from 'react';
import { Platform } from 'react-native';

export const useFootnotes = (scrollToFootnote?: (footnoteId: string) => void) => {
  const [selectedFootnotes, setSelectedFootnotes] = useState<Footnote[]>([]);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(0);
  const [selectedFootnoteId, setSelectedFootnoteId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFootnotePress = (footnoteId: string, referenceId: string, verseNumber: number, footnotes: Footnote[]) => {
    if (footnotes.length > 0) {
      setSelectedFootnotes(footnotes);
      setSelectedVerseNumber(verseNumber);
      setSelectedFootnoteId(footnoteId);
      setModalVisible(true);
    }
    
    // Use cross-platform scrolling behavior
    if (Platform.OS === 'web') {
      // Web: use DOM API
      const footnoteElement = document.getElementById(`footnote-${footnoteId}`);
      if (footnoteElement) {
        footnoteElement.scrollIntoView({ behavior: 'smooth', block: 'center'});
      }
    } else {
      // Mobile: use the provided scrollToFootnote function
      if (scrollToFootnote) {
        scrollToFootnote(footnoteId);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFootnotes([]);
    setSelectedVerseNumber(0);
    setSelectedFootnoteId(null);
  };

  const handleFootnoteSelect = (footnoteId: string) => {
    setSelectedFootnoteId(footnoteId);
  };

  return {
    selectedFootnotes,
    selectedVerseNumber,
    selectedFootnoteId,
    modalVisible,
    handleFootnotePress,
    closeModal,
    handleFootnoteSelect,
  };
};
