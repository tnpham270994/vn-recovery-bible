import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getVersesForChapter } from '@/utils/bibleUtils';
import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { FootnoteModal } from './FootnoteModal';
import { styles } from './VerseDisplay.styles';
import { VerseNavigation } from './VerseNavigation';


interface VerseDisplayProps {
  book: Book;
  chapter: number;
  onBackToChapters: () => void;
  onChapterChange?: (newChapter: number) => void;
  targetVerse?: number;
}

export const parseVerseWithFootnotes = (
  verseText: string, 
  verseNumber: number, 
  onFootnotePress: (footnoteId: string, verseNumber: number) => void,
  onAnchorPress?: (targetVerse: number) => void
) => {
  // Split text by footnote patterns like [1], [2], [a], [1a], [*], etc.
  // and anchor patterns like #1, #2, #verse1, #verse2, etc.
  const parts = verseText.split(/(\[[^\]]+\]|#[a-zA-Z]*\d+)/);
  
  return (
    <View style={styles.verseTextContainer}>
      {parts.map((part, index) => {
        // Match footnote patterns like [1], [2], [a], etc.
        const footnoteMatch = part.match(/^\[([^\]]+)\]$/);
        if (footnoteMatch) {
          const footnoteId = footnoteMatch[1];
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onFootnotePress(footnoteId, verseNumber)}
              style={styles.superscriptContainer}
            >
              <ThemedText style={styles.superscriptText}>[{footnoteId}]</ThemedText>
            </TouchableOpacity>
          );
        }
        
        // Match anchor patterns like #1, #2, #verse1, #verse2, etc.
        const anchorMatch = part.match(/^#([a-zA-Z]*)(\d+)$/);
        if (anchorMatch && onAnchorPress) {
          const targetVerse = parseInt(anchorMatch[2], 10);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onAnchorPress(targetVerse)}
              style={styles.anchorContainer}
            >
              <ThemedText style={styles.anchorText}>{part}</ThemedText>
            </TouchableOpacity>
          );
        }
        
        return (
          <ThemedText key={index} style={styles.verseText}>
            {part}
          </ThemedText>
        );
      })}
    </View>
  );
};

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ book, chapter, onBackToChapters, onChapterChange, targetVerse }) => {
  const verses = getVersesForChapter(book.code, chapter);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const {
    selectedFootnotes,
    selectedVerseNumber,
    selectedFootnoteId,
    modalVisible,
    handleFootnotePress,
    closeModal,
    handleFootnoteSelect,
  } = useFootnotes();
  
  const handleVerseFootnotePress = (footnoteId: string, verseNumber: number) => {
    const footnotes = getFootnotesForVerse(book.code, chapter, verseNumber);
    handleFootnotePress(footnoteId, verseNumber, footnotes);
  };

  const handleVersePress = (verseNumber: number) => {
    if (!scrollViewRef.current) {
      return;
    }
    console.log('handleVersePress', verseNumber);
    // Calculate scroll position based on verse number
    // Each verse has approximately: label (30px) + text (80px) + margins (30px) = 140px
    const verseIndex = verseNumber - 1;
    const scrollY = verseIndex * 140;
    
    scrollViewRef.current.scrollTo({
      y: scrollY,
      animated: true
    });
  };

  const handleAnchorPress = (targetVerse: number) => {
    console.log('Anchor clicked, jumping to verse:', targetVerse);
    handleVersePress(targetVerse);
  };

  // Scroll to target verse when component mounts
  useEffect(() => {
    if (targetVerse && scrollViewRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        handleVersePress(targetVerse);
      }, 100);
    }
  }, [targetVerse]);

  const handlePreviousChapter = () => {
    if (chapter > 1 && onChapterChange) {
      onChapterChange(chapter - 1);
    }
  };

  const handleNextChapter = () => {
    const totalChapters = getChaptersForBook(book.code).length;
    if (chapter < totalChapters && onChapterChange) {
      onChapterChange(chapter + 1);
    }
  };

  
  return (
    <View style={styles.verseDisplayContainer}>
      <View style={styles.chapterHeader}>     
        <View style={styles.chapterTitleContainer}>
          <ThemedText style={styles.chapterTitle}>
            Chương {chapter}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.backToChaptersButton}
          onPress={onBackToChapters}
        >
          <IconSymbol name="list.bullet" size={20} color="#5A4A3A" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.navigationContainer}>
        <VerseNavigation 
          totalVerses={verses.length}
          onVersePress={handleVersePress}
        />
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.versesScrollView}
      >
        {verses.map((verse: string, index: number) => {
          const verseNumber = index + 1;          
          return (
            <View 
              key={index} 
              style={styles.verseItem}
            >
              <ThemedText style={styles.verseLabel}>
                {book.code} {chapter}:{verseNumber}
              </ThemedText>
              {parseVerseWithFootnotes(verse, verseNumber, handleVerseFootnotePress, handleAnchorPress)}
            </View>
          );
        })}
      </ScrollView>
      
      {/* Chapter Navigation Footer */}
      <View style={styles.chapterFooter}>
        <TouchableOpacity
          style={[styles.footerNavButton, !onChapterChange || chapter <= 1 ? styles.footerNavButtonDisabled : null]}
          onPress={handlePreviousChapter}
          disabled={!onChapterChange || chapter <= 1}
        >
          <IconSymbol name="chevron.left" size={24} color={chapter <= 1 ? "#ccc" : "#5A4A3A"} />
          <ThemedText style={[styles.footerNavButtonText, chapter <= 1 ? styles.footerNavButtonTextDisabled : null]}>
            Chương trước
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.footerNavButton, !onChapterChange || chapter >= getChaptersForBook(book.code).length ? styles.footerNavButtonDisabled : null]}
          onPress={handleNextChapter}
          disabled={!onChapterChange || chapter >= getChaptersForBook(book.code).length}
        >
          <ThemedText style={[styles.footerNavButtonText, chapter >= getChaptersForBook(book.code).length ? styles.footerNavButtonTextDisabled : null]}>
            Chương sau
          </ThemedText>
          <IconSymbol name="chevron.right" size={24} color={chapter >= getChaptersForBook(book.code).length ? "#ccc" : "#5A4A3A"} />
        </TouchableOpacity>
      </View>
      
      <FootnoteModal
        visible={modalVisible}
        footnotes={selectedFootnotes}
        verseNumber={selectedVerseNumber}
        bookCode={book.code}
        chapter={chapter}
        selectedFootnoteId={selectedFootnoteId}
        onClose={closeModal}
        onFootnoteSelect={handleFootnoteSelect}
      />
    </View>
  );
};
