import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getVersesForChapter, parseTextWithHTML } from '@/utils/bibleUtils';
import React, { useEffect, useRef, useState } from 'react';
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
) => {
  // Parse the verse text and create styled segments
  
  const segments = parseTextWithHTML(verseText);
  
  return (
    <View style={styles.verseTextContainer}>
      {segments.map((segment, index) => {
        if (segment.isFootnote) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onFootnotePress(segment.footnoteId!, verseNumber)}
              style={styles.superscriptContainer}
            >
              <ThemedText style={styles.superscriptText}>{segment.text}</ThemedText>
            </TouchableOpacity>
          );
        }
        
        if (segment.text) {
          const textStyle = [
            styles.verseText
          ].filter(Boolean);
          
          return (
            <ThemedText key={index} style={textStyle}>
              {segment.text}
            </ThemedText>
          );
        }
        
        return null;
      })}
    </View>
  );
};

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ book, chapter, onBackToChapters, onChapterChange, targetVerse }) => {
  const verses = getVersesForChapter(book.code, chapter);
  const scrollViewRef = useRef<ScrollView>(null);
  const [verseHeights, setVerseHeights] = useState<number[]>([]);
    
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
    
    // Calculate scroll position based on actual verse heights
    const verseIndex = verseNumber - 1;
    let scrollY = 0;
    
    // If we have measured heights, use them for accurate scrolling
    if (verseHeights.length > verseIndex) {
      for (let i = 0; i < verseIndex; i++) {
        scrollY += verseHeights[i] || 150; // fallback to 140px if height not measured
      }
    } else {
      // Fallback to estimated height if measurements not available
      scrollY = verseIndex * 150;
    }
    
    scrollViewRef.current.scrollTo({
      y: scrollY,
      animated: true
    });
  };


  const handleVerseLayout = (event: any, verseIndex: number) => {
    const { height } = event.nativeEvent.layout;
    setVerseHeights((prev: number[]) => {
      const newHeights = [...prev];
      newHeights[verseIndex] = height;
      return newHeights;
    });
  };


  // Scroll to target verse when component mounts
  useEffect(() => {
    if (targetVerse && scrollViewRef.current) {
      // Delay to ensure the component is fully rendered and heights are measured
      setTimeout(() => {
        handleVersePress(targetVerse);
      }, 300);
    }
  }, [targetVerse]);

  // Also scroll when verse heights are updated and we have a target verse
  useEffect(() => {
    if (targetVerse && verseHeights.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        handleVersePress(targetVerse);
      }, 100);
    }
  }, [verseHeights, targetVerse]);

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
    <>
      <View style={styles.verseDisplayContainer}>
        <View style={styles.chapterHeader}>     
          <View style={styles.chapterTitleContainer}>
            <ThemedText style={styles.chapterTitle}>
              Chương {chapter}
            </ThemedText>
            <TouchableOpacity
                style={styles.backToChaptersButton}
                onPress={onBackToChapters}
            >
              <IconSymbol name="list.bullet" size={20} color="#5A4A3A" />
            </TouchableOpacity>
          </View>
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
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEnabled={true}
        >
          {verses.map((verse: string, index: number) => {
            const verseNumber = index + 1;          
            return (
              <View 
                key={index} 
                style={styles.verseItem}
                onLayout={(event) => handleVerseLayout(event, index)}
              >
                <ThemedText style={styles.verseLabel}>
                  {book.code}. {chapter}:{verseNumber}
                </ThemedText>
                {parseVerseWithFootnotes(verse, verseNumber, handleVerseFootnotePress)}
              </View>
            );
          })}
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
        </ScrollView>     
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
    </>
  );
};
