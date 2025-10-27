import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useFontSettings } from '@/contexts/FontSettingsContext';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getRefsForVerse, getVersesForChapter, parseTextWithHTML, sortFootnotesAndRefs } from '@/utils/bibleUtils';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { FontControls } from './FontControls';
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
  onFootnotePress: (footnoteId: string, referenceId: string, verseNumber: number) => void,
  fontSettings: { fontSize: number; fontFamily: string }
) => {
  // Parse the verse text and create styled segments
  const segments = parseTextWithHTML(verseText);
  return (
    <View id={`verse-${verseNumber}`} style={styles.verseTextContainer}>
      <ThemedText style={[
        styles.verseText,
        {
          fontSize: fontSettings.fontSize || 18, // Default to 18 if not set
          fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily,
        }
      ]}>
        {segments.map((segment, index) => {
          if (segment.isFootnote) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onFootnotePress(segment.footnoteId!, segment.referenceId!, verseNumber)}
                style={styles.superscriptContainer}
              >
                <ThemedText 
                  id={`verse-${verseNumber}`} 
                  style={[
                    styles.superscriptText,
                    {
                      fontSize: (fontSettings.fontSize || 18) * 0.8, // 40% of main font size
                      lineHeight: (fontSettings.fontSize || 18) * 0.8, // 50% of main font size
                    }
                  ]}
                >
                  {segment.text}
                </ThemedText>
              </TouchableOpacity>
            );
          }
          
          if (segment.text) {
            const textStyle = [
              segment.isItalic && styles.italicText,
              segment.isBold && styles.boldText,
              segment.isUnderline && styles.underlineText,
              segment.isHighlighted && styles.highlightedText,
              {
                fontSize: fontSettings.fontSize || 18,
                fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily,
              }
            ].filter(Boolean);
            
            if (segment.isHighlighted && segment.footnoteId) {
              return (
                <ThemedText style={textStyle} onPress={() => onFootnotePress(segment.footnoteId!, segment.referenceId!, verseNumber)}>
                  {segment.text}
                </ThemedText>
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
  const footnoteRefs = useRef<{ [key: string]: View | null }>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verses = getVersesForChapter(book.code, chapter);
  const { fontSettings } = useFontSettings();

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

  const scrollToFootnote = (footnoteId: string) => {
    // Prevent multiple rapid calls
    if (isScrolling) {
      return;
    }

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const footnoteRef = footnoteRefs.current[footnoteId];
    if (!footnoteRef || !scrollViewRef.current) {
      console.log('Footnote ref or scrollView ref not found');
      return;
    }

    setIsScrolling(true);

    // Use a longer delay to ensure all footnotes are rendered and measured
    setTimeout(() => {
      footnoteRef.measureLayout(
        scrollViewRef.current as any,
        (x, y, width, height) => {
          console.log(`Footnote ${footnoteId} position:`, { x, y, width, height });
          
          if (scrollViewRef.current) {
            // Calculate the center position of the footnote
            const footnoteCenter = y + (height / 2);
            const scrollViewHeight = 600; // Use fixed height for calculation
            const targetY = Math.max(0, footnoteCenter - (scrollViewHeight / 2));
            
            scrollViewRef.current.scrollTo({
              y: targetY,
              animated: true,
            });
          }
          
          // Reset scrolling state after animation completes
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 800); // Longer timeout for footnote scrolling
        },
        () => {
          console.log('Error measuring footnote, trying alternative approach');
          
          // Alternative approach: measure all footnotes and calculate position
          if (scrollViewRef.current) {
            const allFootnotes = Object.keys(footnoteRefs.current);
            const targetIndex = allFootnotes.indexOf(footnoteId);
            
            if (targetIndex !== -1) {
              // Try to measure all previous footnotes to get accurate position
              let accumulatedHeight = 0;
              
              const measurePreviousFootnotes = (index: number) => {
                if (index >= allFootnotes.length) {
                  // All measurements done, scroll to calculated position
                  scrollViewRef.current?.scrollTo({
                    y: Math.max(0, accumulatedHeight - 50),
                    animated: true,
                  });
                  
                  scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false);
                  }, 800);
                  return;
                }
                
                const currentFootnoteRef = footnoteRefs.current[allFootnotes[index]];
                if (currentFootnoteRef) {
                  currentFootnoteRef.measureLayout(
                    scrollViewRef.current as any,
                    (x, y, width, height) => {
                      if (index < targetIndex) {
                        accumulatedHeight += height + 10; // Add some padding
                      }
                      measurePreviousFootnotes(index + 1);
                    },
                    () => {
                      // If measurement fails, add estimated height
                      if (index < targetIndex) {
                        accumulatedHeight += 150; // Estimated height
                      }
                      measurePreviousFootnotes(index + 1);
                    }
                  );
                } else {
                  // If ref not found, add estimated height
                  if (index < targetIndex) {
                    accumulatedHeight += 150;
                  }
                  measurePreviousFootnotes(index + 1);
                }
              };
              
              measurePreviousFootnotes(0);
            } else {
              // Last resort: scroll to top
              scrollViewRef.current.scrollTo({
                y: 0,
                animated: true,
              });
              
              scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
              }, 800);
            }
          }
        }
      );
    }, 150); // Longer delay to ensure all content is rendered
  };

  const handleVersePress = scrollToVerse;

  // Initialize footnotes hook with scrollToFootnote function
  const {
    selectedFootnotes,
    selectedVerseNumber,
    selectedFootnoteId,
    modalVisible,
    handleFootnotePress,
    closeModal,
    handleFootnoteSelect,
  } = useFootnotes(scrollToFootnote);

  const handleVerseFootnotePress = (footnoteId: string, referenceId: string, verseNumber: number) => {
    const footnotes = getFootnotesForVerse(book.code, chapter, verseNumber);
    const refs = getRefsForVerse(book.code, chapter, verseNumber);
    // order by key with letter a, b, c, 1,1a,1b, 2,...etc
    let footnotesAndRefs = [...footnotes, ...refs];    
    footnotesAndRefs = sortFootnotesAndRefs(footnotesAndRefs);
    handleFootnotePress(footnoteId, referenceId, verseNumber, footnotesAndRefs);
  };
  const handlePreviousChapter = () => {
    if (chapter > 1 && onChapterChange) {
      onChapterChange(chapter - 1);
      setTimeout(() => {
        scrollToVerse(1);
      }, 100);
    }
  };

  const handleNextChapter = () => {
    const totalChapters = getChaptersForBook(book.code).length;
    if (chapter < totalChapters && onChapterChange) {
      onChapterChange(chapter + 1);
      setTimeout(() => {
        scrollToVerse(1);
      }, 100);
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
                <ThemedText style={[styles.verseLabel, { fontSize: fontSettings.fontSize || 18, fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily }]}>
                  {book.shortName}. {chapter}:{verseNumber}
                </ThemedText>
                {parseVerseWithFootnotes(verse, verseNumber, handleVerseFootnotePress, fontSettings)}
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
      
      {/* Font Controls */}
      <FontControls />
      
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
        footnoteRefs={footnoteRefs}
      />
    </>
  );
};
