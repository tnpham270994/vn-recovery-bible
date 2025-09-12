import { Footnote } from '@/constants/bibleData';
import { useState } from 'react';

export const useFootnotes = () => {
  const [selectedFootnotes, setSelectedFootnotes] = useState<Footnote[]>([]);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(0);
  const [selectedFootnoteId, setSelectedFootnoteId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFootnotePress = (footnoteId: string, verseNumber: number, footnotes: Footnote[]) => {
    if (footnotes.length > 0) {
      setSelectedFootnotes(footnotes);
      setSelectedVerseNumber(verseNumber);
      setSelectedFootnoteId(footnoteId);
      setModalVisible(true);
    }
    const footnoteElement = document.getElementById(`footnote-${footnoteId}`);
    if (footnoteElement) {
      footnoteElement.scrollIntoView({ behavior: 'smooth', block: 'center'});
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
