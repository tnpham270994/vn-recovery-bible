import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getVersesForChapter, parseTextWithHTML } from '@/utils/bibleUtils';
import { router } from 'expo-router';
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
    <View id={`verse-${verseNumber}`} style={styles.verseTextContainer}>
      <ThemedText style={styles.verseText}>
        {segments.map((segment, index) => {
          if (segment.isFootnote) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onFootnotePress(segment.footnoteId!, verseNumber)}
                style={styles.superscriptContainer}
              >
                <ThemedText id={`verse-${verseNumber}`} style={styles.superscriptText}>{segment.text}</ThemedText>
              </TouchableOpacity>
            );
          }
          
          if (segment.text) {
            const textStyle = [
              segment.isItalic && styles.italicText,
              segment.isBold && styles.boldText,
              segment.isUnderline && styles.underlineText,
              segment.isHighlighted && styles.highlightedText
            ].filter(Boolean);
            
            if (segment.isHighlighted && segment.footnoteId) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onFootnotePress(segment.footnoteId!, verseNumber)}
                >
                  <ThemedText style={textStyle}>
                    {segment.text}
                  </ThemedText>
                </TouchableOpacity>
              );
            }
            
            return (
              <ThemedText key={index} style={textStyle}>
                {segment.text}
              </ThemedText>
            );
          }
          
          return null;
        })}
      </ThemedText>
    </View>
  );
};

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ book, chapter, onBackToChapters, onChapterChange, targetVerse }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const verseRefs = useRef<{ [key: number]: View | null }>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verses = getVersesForChapter(book.code, chapter);
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

  const scrollToVerse = (verseNumber: number) => {
    // Prevent multiple rapid calls
    if (isScrolling) {
      return;
    }

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const verseRef = verseRefs.current[verseNumber];
    if (!verseRef || !scrollViewRef.current) {
      return;
    }

    setIsScrolling(true);

    // Use a small delay to ensure the ref is properly mounted
    setTimeout(() => {
      verseRef.measureLayout(
        scrollViewRef.current as any,
        (x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              y: Math.max(0, y - 50), // Ensure y is not negative
              animated: true,
            });
          }
          
          // Reset scrolling state after animation completes
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 500); // Adjust timing based on your animation duration
        },
        () => {
          console.log('Error measuring verse, using fallback');
          // Fallback to estimated position
          const estimatedPosition = Math.max(0, (verseNumber - 1) * 100);
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              y: estimatedPosition,
              animated: true,
            });
          }
          
          // Reset scrolling state
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 500);
        }
      );
    }, 50); // Small delay to ensure refs are ready
  };

  const handleVersePress = scrollToVerse;

  // Helper functions for navigation
  const scrollToNextVerse = () => {
    const currentVerse = selectedVerseNumber || 1;
    const nextVerse = Math.min(currentVerse + 1, verses.length);
    scrollToVerse(nextVerse);
  };

  const scrollToPreviousVerse = () => {
    const currentVerse = selectedVerseNumber || 1;
    const prevVerse = Math.max(currentVerse - 1, 1);
    scrollToVerse(prevVerse);
  };

  // Navigate to a specific verse by number
  const navigateToVerse = (verseNumber: number) => {
    if (verseNumber >= 1 && verseNumber <= verses.length) {
      scrollToVerse(verseNumber);
    }
  };

  // Navigate to first/last verse
  const scrollToFirstVerse = () => scrollToVerse(1);
  const scrollToLastVerse = () => scrollToVerse(verses.length);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);


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

  const handleNavigateToVerse = (bookCode: string, chapter: number, verse: number) => {
    router.push({
      pathname: '/(tabs)/books',
      params: {
        book: bookCode,
        chapter: chapter.toString(),
        verse: verse.toString()
      }
    });
  };

  useEffect(() => {
    if (targetVerse) {
      handleVersePress(targetVerse);
    }
  }, [targetVerse]);
  
  return (
    <>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.verseDisplayContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
      >
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
        
        <View style={styles.versesContainer}>
          {verses.map((verse: string, index: number) => {
            const verseNumber = index + 1;          
            return (
              <View 
                key={index} 
                ref={(ref) => {
                  verseRefs.current[verseNumber] = ref;
                }}
                style={styles.verseItem}
              >
                <ThemedText style={styles.verseLabel}>
                  {book.code}. {chapter}:{verseNumber}
                </ThemedText>
                {parseVerseWithFootnotes(verse, verseNumber, handleVerseFootnotePress)}
              </View>
            );
          })}
        </View>
        
        {/* Chapter Navigation Footer */}
        <View style={styles.chapterFooter}>
          <TouchableOpacity
            style={[styles.footerNavButton, !onChapterChange || chapter <= 1 ? styles.footerNavButtonDisabled : null]}
            onPress={handlePreviousChapter}
            disabled={!onChapterChange || chapter <= 1}
          >
            <IconSymbol name="chevron.left" size={24} color={chapter <= 1 ? "#ccc" : "#5A4A3A"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.footerNavButton, !onChapterChange || chapter >= getChaptersForBook(book.code).length ? styles.footerNavButtonDisabled : null]}
            onPress={handleNextChapter}
            disabled={!onChapterChange || chapter >= getChaptersForBook(book.code).length}
          >
            <IconSymbol name="chevron.right" size={24} color={chapter >= getChaptersForBook(book.code).length ? "#ccc" : "#5A4A3A"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FootnoteModal
        visible={modalVisible}
        footnotes={selectedFootnotes}
        verseNumber={selectedVerseNumber}
        bookCode={book.code}
        chapter={chapter}
        selectedFootnoteId={selectedFootnoteId}
        onClose={closeModal}
        onFootnoteSelect={handleFootnoteSelect}
        onNavigateToVerse={handleNavigateToVerse}
      />
    </>
  );
};
