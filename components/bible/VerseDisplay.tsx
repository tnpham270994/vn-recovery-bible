import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getVersesForChapter, parseTextWithHTML } from '@/utils/bibleUtils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
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
      <ThemedText style={styles.verseText}>
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

  const handleVersePress = useCallback((verseNumber: number) => {
    if (!scrollViewRef.current) {
      return;
    }
    
    const verseIndex = verseNumber - 1;
    
    // Calculate scroll position based on verseHeights array
    let scrollY = 0;
    
    // Add header offset
    const headerOffset = 120; // Height of chapter header and navigation
    scrollY += headerOffset;
    
    // Sum heights of all verses before the target verse
    for (let i = 0; i < verseIndex; i++) {
      const height = verseHeights[i] || 0;
      if (height > 0) {
        scrollY += height;
      } else {
        // Fallback for unmeasured verses
        const fallbackHeight = 200; // Estimated height
        scrollY += fallbackHeight;
      }
    }
    
    // Get screen dimensions for centering
    const { height: screenHeight } = Dimensions.get('window');
    const availableHeight = screenHeight - headerOffset;
    
    // Calculate padding to show verse in upper portion of screen
    const paddingAbove = Math.min(availableHeight * 0.3, 200);
    scrollY = Math.max(0, scrollY - paddingAbove);
    

    scrollViewRef.current.scrollTo({
      y: scrollY,
      animated: true
    });
  }, [verseHeights]);


  // Calculate verse height more accurately
  const calculateVerseHeight = (measuredHeight: number, verseText: string, containerWidth?: number) => {
    // Base components
    const verseLabelHeight = 24; // Verse number label height
    const paddingBottom = 20; // SPACING.xl
    
    // Get screen width for accurate character calculation
    const { width: screenWidth } = Dimensions.get('window');
    const availableWidth = containerWidth || (screenWidth - 40); // Account for padding
    
    // Calculate characters per line based on screen width
    const fontSize = 18; // FONT_SIZES.lg from styles
    const averageCharWidth = fontSize * 0.6; // Approximate character width
    const averageCharsPerLine = Math.floor(availableWidth / averageCharWidth);
    
    // Estimate text height based on content length and line height
    const lineHeight = 28; // From styles
    const estimatedLines = Math.ceil(verseText.length / averageCharsPerLine);
    const estimatedTextHeight = Math.max(estimatedLines * lineHeight, 50);
    
    // Use the larger of measured height or estimated height
    const textHeight = Math.max(measuredHeight - verseLabelHeight, estimatedTextHeight);
    
    // Total height including all components
    const totalHeight = verseLabelHeight + textHeight + paddingBottom;
    
    return {
      verseLabelHeight,
      textHeight,
      paddingBottom,
      totalHeight: Math.max(totalHeight, 100), // Minimum 100px
      screenWidth,
      availableWidth,
      averageCharsPerLine,
      estimatedLines
    };
  };

  // Pre-calculate heights for all verses based on content
  const preCalculateHeights = () => {
    const calculatedHeights = verses.map((verseText, index) => {
      const heightData = calculateVerseHeight(0, verseText); // Use estimation only
      return heightData.totalHeight;
    });    
    setVerseHeights(calculatedHeights);
  };
  // Pre-calculate heights only once when component mounts
  useEffect(() => {
    if (verses.length > 0 && verseHeights.length === 0) {
      preCalculateHeights();
    }
  }, [verses.length]); // Only depend on length, not the entire array

  // Scroll to target verse when component mounts
  useEffect(() => {
    if (targetVerse && scrollViewRef.current) {
      // Delay to ensure the component is fully rendered and heights are measured
      setTimeout(() => {
        handleVersePress(targetVerse);
      }, 500); // Increased delay to ensure heights are measured
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

  // Remove expensive re-measurement effect for better performance

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
      />
    </>
  );
};
