import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getVersesForChapter, parseTextWithHTML } from '@/utils/bibleUtils';
import { router } from 'expo-router';
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
    const verseRef = verseRefs.current[verseNumber];
    if (verseRef && scrollViewRef.current) {
      // Measure the verse element and scroll to it
      verseRef.measureLayout(
        scrollViewRef.current as any,
        (x, y, width, height) => {
          scrollViewRef.current?.scrollTo({
            y: y - 50, // Offset to center the verse better
            animated: true,
          });
        },
        () => {
          console.log('Error measuring verse');
          // Fallback to estimated position
          const estimatedPosition = (verseNumber - 1) * 100;
          scrollViewRef.current?.scrollTo({
            y: estimatedPosition,
            animated: true,
          });
        }
      );
    }
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
