import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getBookData, getBookFromShortName, parseTextWithOnlyHTML } from '@/utils/bibleUtils';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './FootnoteModal.styles';

interface FootnoteModalProps {
  visible: boolean;
  footnotes: any;
  verseNumber: number;
  bookCode: string;
  chapter: number;
  selectedFootnoteId: string | null;
  onClose: () => void;
  onFootnoteSelect: (footnoteId: string) => void;
  onNavigateToVerse?: (bookCode: string, chapter: number, verse: number) => void;
  footnoteRefs?: React.MutableRefObject<{ [key: string]: View | null }>;
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
  onNavigateToVerse,
  footnoteRefs,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [verseModalVisible, setVerseModalVisible] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Array<{ book: string, bookRef: string, chapter: number, verse: number, endVerse?: number, text: string}>>([]);
  

  // Parse reference string (e.g., "1 Gi. 1:1; Côl. 1:17; Sáng. 1:1") and get verse data
  const parseReference = (reference: string) => {
    const references = reference.split(';').map(ref => ref.trim());
    const verses = references.map(ref => {
      // Split by period to get book name and chapter:verse part
      const parts = ref.split('.');
      
      if (parts.length < 2) {
        console.log(`Invalid reference format: ${ref}`);
        return null;
      }
      
      const bookRef = parts[0].trim();
      const chapterVersePart = parts[1].trim();
      // get book code from book name
      const bookCode = getBookFromShortName(bookRef);
      
      // Match single verse: 1:1
      const singleVerseMatch = chapterVersePart.match(/^(\d+):(\d+)$/);
      if (singleVerseMatch) {
        const [, chapter, verse] = singleVerseMatch;
        
        // Get book data using the new utility function
        const bookData = getBookData(bookCode);
        if (!bookData || !bookData.verse_data) {
          return {
            book: bookCode,
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            text: `Book "${bookRef}" not available in this version`,
            bookRef: bookRef,
          };
        }
        
        const verseText = bookData.verse_data[parseInt(chapter)]?.[parseInt(verse) - 1]; // verse_data is 0-indexed
        return {
          book: bookCode,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          text: verseText || 'Verse not found',
          bookRef: bookRef,
        };
      }
      
      // Match verse range: 1:1-3
      const rangeMatch = chapterVersePart.match(/^(\d+):(\d+)-(\d+)$/);
      if (rangeMatch) {
        const [, chapter, startVerse, endVerse] = rangeMatch;
        
        // Get book data using the new utility function
        const bookData = getBookData(bookRef.toLowerCase());
        if (!bookData || !bookData.verse_data) {
          return {
            book: bookRef,
            chapter: parseInt(chapter),
            verse: parseInt(startVerse),
            endVerse: parseInt(endVerse),
            text: `Book "${bookRef}" not available in this version`,
            bookRef: bookRef,
          };
        }
        
        const start = parseInt(startVerse);
        const end = parseInt(endVerse);
        const verseTexts = [];
        
        for (let verse = start; verse <= end; verse++) {
          const verseText = bookData.verse_data[parseInt(chapter)]?.[verse - 1]; // verse_data is 0-indexed
          if (verseText) {
            verseTexts.push(`${verse} ${verseText}`);
          }
        }
        
        return {
          book: bookCode,
          chapter: parseInt(chapter),
          verse: start,
          endVerse: end,
          text: verseTexts.length > 0 ? verseTexts.join('\n') : 'Verses not found',
          bookRef: bookRef,
        };
      }
      
      return null;
    }).filter((verse): verse is NonNullable<typeof verse> => verse !== null);    
    return verses;
  };

  const handleReferenceClick = (reference: string) => {
    const verses = parseReference(reference);
    if (verses.length > 0) {
      // Ensure all verses have valid text
      const validVerses = verses.filter(verse => verse && verse.text);
      if (validVerses.length > 0) {
        setSelectedVerses(validVerses);
        setVerseModalVisible(true);
      }
    }
  };

  const handleVerseNavigation = (verse: {book: string, chapter: number, verse: number}) => {
    // Close both modals
    setVerseModalVisible(false);
    onClose();
    
    // Navigate to the verse if callback is provided
    if (onNavigateToVerse) {
      onNavigateToVerse(verse.book, verse.chapter, verse.verse);
    }
  };
  
  useEffect(() => {
    if (visible && selectedFootnoteId && footnotes.length > 0) {
      const footnoteIndex = footnotes.findIndex(f => f.id === selectedFootnoteId);
      
      if (footnoteIndex !== -1) {
        // Wait for the modal to be fully rendered and refs to be set
        setTimeout(() => {
          if (scrollViewRef.current) {
            // Try to use the actual footnote ref if available
            if (footnoteRefs && footnoteRefs.current[selectedFootnoteId]) {
              const footnoteRef = footnoteRefs.current[selectedFootnoteId];
              footnoteRef.measureLayout(
                scrollViewRef.current as any,
                (x, y, width, height) => {
                  console.log(`Modal footnote ${selectedFootnoteId} position:`, { x, y, width, height });
                  scrollViewRef.current?.scrollTo({
                    y: Math.max(0, y - 50),
                    animated: true,
                  });
                },
                () => {
                  // Fallback to estimated position
                  const estimatedPosition = footnoteIndex * 120;
                  scrollViewRef.current?.scrollTo({
                    y: estimatedPosition,
                    animated: true,
                  });
                }
              );
            } else {
              // Fallback to estimated position
              const estimatedPosition = footnoteIndex * 120;
              scrollViewRef.current.scrollTo({
                y: estimatedPosition,
                animated: true,
              });
            }
          }
        }, 300); // Longer delay to ensure refs are set
      }
    }
  }, [visible, selectedFootnoteId, footnotes, footnoteRefs]);
  
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
            {footnotes.map((footnote: any) => {
              const footnoteNumber = footnote.id.match(/[0-9]+/)?.[0] || '';
              const footnoteLetter = footnote.id.match(/[a-z]+/)?.[0] || '';
              return (
                <TouchableOpacity
                  key={footnote.id}
                  ref={(ref) => {
                    if (footnoteRefs) {
                      footnoteRefs.current[footnote.id] = ref;
                    }
                  }}
                  onPress={() => onFootnoteSelect(footnote.id)}
                  style={styles.modalFootnoteItem}
                  id={`footnote-${footnote.id}`}
                >
                  <ThemedText style={styles.modalFootnoteNumber}>{footnote.isFootnote ? footnoteNumber : footnoteLetter}</ThemedText>
                  <ThemedText style={styles.modalFootnoteContent}>
                    {
                      footnote.isFootnote ? (<ThemedText style={styles.modalFootnoteText}>{footnote.text}</ThemedText>) : (
                        <TouchableOpacity onPress={() => handleReferenceClick(footnote.text)}>
                          <ThemedText style={styles.modalFootnoteReference}>{footnote.text}</ThemedText>
                        </TouchableOpacity>
                      )
                    }
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
      
      {/* Verse Modal */}
      <Modal
        visible={verseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVerseModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVerseModalVisible(false)}>
          <Pressable style={styles.modalRefContentBottom} onPress={(e: any) => e.stopPropagation()}>
            <View style={styles.verseModalHeader}>
              <ThemedText style={styles.verseModalTitle}>Kết quả tham chiếu: </ThemedText>
              <TouchableOpacity onPress={() => setVerseModalVisible(false)} style={styles.closeButton}>
                <IconSymbol name="xmark" size={20} color="#5A4A3A" />
              </TouchableOpacity>
              
            </View>
            <ScrollView style={styles.verseModalScrollView}>
              {selectedVerses.map((verse, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.verseSection}
                  onPress={() => handleVerseNavigation(verse)}
                >
                  <ThemedText style={styles.verseSectionTitle}>
                    {`${verse.bookRef} ${verse.chapter}:${verse.verse}${verse.endVerse && verse.endVerse !== verse.verse ? `-${verse.endVerse}` : ''}`}
                  </ThemedText>
                  <ThemedText>
                    {verse.text ? verse.text.split('\n').map((line, lineIndex) => (
                      <ThemedText key={lineIndex} style={styles.verseModalText}>
                        {parseTextWithOnlyHTML(line) || ''}
                      </ThemedText>
                    )) : (
                      <ThemedText style={styles.verseModalText}>
                        Chưa có dữ liệu
                      </ThemedText>
                    )}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
};
