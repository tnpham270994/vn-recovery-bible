import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Book } from '@/constants/bibleData';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useFontSettings } from '@/contexts/FontSettingsContext';
import { HIGHLIGHT_COLORS, useHighlights } from '@/contexts/HighlightsContext';
import { useNotes } from '@/contexts/NotesContext';
import { useTags } from '@/contexts/TagsContext';
import { useFootnotes } from '@/hooks/useFootnotes';
import { getChaptersForBook, getFootnotesForVerse, getRefsForVerse, getVersesForChapter, parseTextWithHTML, parseTextWithOnlyHTML, sortFootnotesAndRefs } from '@/utils/bibleUtils';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontControls } from './FontControls';
import { FootnoteModal } from './FootnoteModal';
import { NoteModal } from './NoteModal';
import { TagModal } from './TagModal';
import { TextSelectionToolbar } from './TextSelectionToolbar';
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
  fontSettings: { fontSize: number; fontFamily: string },
  highlights?: { color: string; text: string; position: number }[],
  onVerseSelect?: (verseNumber: number) => void,
  hasNote?: boolean,
  isSelected?: boolean
) => {
  // Parse the verse text and create styled segments
  const segments = parseTextWithHTML(verseText);
  
  // If there are any highlights, use the first one's color for the entire verse
  const hasHighlights = highlights && highlights.length > 0;
  const highlightColor = hasHighlights ? highlights[0].color : undefined;

  return (
    <TouchableOpacity 
      id={`verse-${verseNumber}`} 
      style={[
        styles.verseTextContainer,
        isSelected && styles.selectedVerseContainer
      ]}
      onLongPress={() => {
        if (Platform.OS !== 'web') {
          onVerseSelect?.(verseNumber);
        }
      }}
    >
      <ThemedText 
        style={[
          styles.verseText,
          {
            fontSize: fontSettings.fontSize || 18,
            fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily,
            ...(hasNote && styles.noteUnderline),
          }
        ]}
      >
        {segments.map((segment, index) => {
          if (segment.isFootnote) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onFootnotePress(segment.footnoteId!, segment.referenceId!, verseNumber)}
                style={styles.superscriptContainer}
              >
                <ThemedText 
                  style={[
                    styles.superscriptText,
                    {
                      fontSize: (fontSettings.fontSize || 18) * 0.8,
                      lineHeight: (fontSettings.fontSize || 18) * 0.8,
                    ...(false ? {
                      backgroundColor: '#000',
                      borderRadius: 2,
                    } : {}),
                    },
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
                ...(highlightColor && {
                  backgroundColor: highlightColor,
                  borderRadius: 2,
                  paddingHorizontal: 1,
                }),
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
    </TouchableOpacity>
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
  const { getHighlightsForVerse, addHighlight, removeHighlight } = useHighlights();
  const { getNoteForVerse, addNote, updateNote, deleteNote } = useNotes();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { getTagsForVerse } = useTags();
  
  // Verse selection state for highlighting
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#FFFF00');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);

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

  const handleVerseDoubleClick = (verseNumber: number) => {
    setSelectedVerse(verseNumber);
  };

  const handleHighlightVerse = () => {
    if (selectedVerse > 0) {
      const verse: any = verses[selectedVerse - 1];
      const verseText = verse.content;
      const segments = parseTextWithHTML(verseText);
      const flatText = segments.map(s => s.text).join('');
      
      // Check if this verse is already highlighted
      const existingHighlights = getHighlightsForVerse(book.code, chapter, selectedVerse);
      const existingHighlight = existingHighlights.find(h => 
        h.text === flatText && h.color === selectedHighlightColor
      );
      
      if (existingHighlight) {
        // Remove the existing highlight
        removeHighlight(existingHighlight.id);
      } else {
        // Add a new highlight for the entire verse
        addHighlight({
          bookCode: book.code,
          chapter: chapter,
          verse: selectedVerse,
          text: flatText,
          color: selectedHighlightColor,
          position: 0,
        });
      }
      
      setSelectedVerse(0);
    }
  };

  const handleCopyVerse = () => {
    if (selectedVerse > 0) {
      const verse: any = verses[selectedVerse - 1];
      const verseText = verse.content;
      const segments = parseTextWithOnlyHTML(verseText);
      
      // Format: bookCode chapter:verse content
      const formattedText = `${book.shortName} ${chapter}:${selectedVerse} ${segments}`;
      navigator.clipboard.writeText(formattedText);
      setSelectedVerse(0);
    }
  };

  const handleRemoveHighlight = () => {
    if (selectedVerse > 0) {
      // Find all highlights for this verse
      const existingHighlights = getHighlightsForVerse(book.code, chapter, selectedVerse);
      // Remove all highlights
      existingHighlights.forEach(h => {
        removeHighlight(h.id);
      });
      setSelectedVerse(0);
    }
  };

  const handleOpenNote = () => {
    if (selectedVerse > 0) {
      setNoteModalVisible(true);
    }
  };

  const handleSaveNote = (text: string) => {
    if (selectedVerse > 0) {
      const existingNote = getNoteForVerse(book.code, chapter, selectedVerse);
      if (existingNote) {
        updateNote(existingNote.id, text);
      } else {
        addNote({
          bookCode: book.code,
          chapter: chapter,
          verse: selectedVerse,
          text: text,
        });
      }
    }
  };

  const handleDeleteNote = () => {
    if (selectedVerse > 0) {
      const existingNote = getNoteForVerse(book.code, chapter, selectedVerse);
      if (existingNote) {
        deleteNote(existingNote.id);
      }
    }
  };

  const handleToggleBookmark = () => {
    if (selectedVerse > 0) {
      toggleBookmark(book.code, chapter, selectedVerse);
    }
  };

  const handleOpenTagModal = () => {
    if (selectedVerse > 0) {
      setTagModalVisible(true);
    }
  };

  useEffect(() => {
    if (targetVerse) {
      handleVersePress(targetVerse);
    }
  }, [targetVerse]);

  // Handle double click on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const verseElement = target.closest('[id^="verse-"]');
      if (verseElement) {
        const verseId = verseElement.id;
        const verseMatch = verseId.match(/verse-(\d+)/);
        if (verseMatch) {
          const verseNumber = parseInt(verseMatch[1]);
          setSelectedVerse(verseNumber);
        }
      }
    };
    
    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

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
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => false}
        onResponderGrant={() => {
          if (Platform.OS !== 'web' && selectedVerse > 0) {
            setSelectedVerse(0);
          }
        }}
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
          {verses.map((verse: any, index: number) => {
            if (verse.type === 'verse') {
              const verseContent = verse.content;
              const verseNumber = verse.verse_no;
              const verseHighlights = getHighlightsForVerse(book.code, chapter, verseNumber);
              return (
                <View 
                  key={index} 
                  ref={(ref) => {
                    verseRefs.current[verseNumber] = ref;
                  }}
                  style={styles.verseItem}
                >
                  <ThemedText style={[styles.verseLabel, { fontSize: fontSettings.fontSize || 18, fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily }]}>
                    {chapter}:{verseNumber}
                  </ThemedText>
                  {parseVerseWithFootnotes(
                    verseContent, 
                    verseNumber, 
                    handleVerseFootnotePress, 
                    fontSettings, 
                    verseHighlights,
                    handleVerseDoubleClick,
                    !!getNoteForVerse(book.code, chapter, verseNumber),
                    selectedVerse === verseNumber
                  )}
                </View>
              );
            } else {
              return (
                <View key={index} style={styles.verseItem}>
                  <ThemedText style={[styles.verseLabel, { fontSize: fontSettings.fontSize || 18, fontFamily: fontSettings.fontFamily === 'System' ? undefined : fontSettings.fontFamily }]}>
                    {verse.content}
                  </ThemedText>
                </View>
              );
            }
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
      <FontControls 
        highlightColor={selectedHighlightColor}
        onHighlightColorChange={setSelectedHighlightColor}
      />
      
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
      
      <TextSelectionToolbar
        visible={selectedVerse > 0}
        onHighlight={handleHighlightVerse}
        onCopy={handleCopyVerse}
        onNote={handleOpenNote}
        onBookmark={handleToggleBookmark}
        onTag={handleOpenTagModal}
        onRemoveHighlight={handleRemoveHighlight}
        isHighlighted={selectedVerse > 0 && getHighlightsForVerse(book.code, chapter, selectedVerse).length > 0}
        hasNote={selectedVerse > 0 && !!getNoteForVerse(book.code, chapter, selectedVerse)}
        isBookmarked={selectedVerse > 0 && isBookmarked(book.code, chapter, selectedVerse)}
        hasTags={selectedVerse > 0 && getTagsForVerse(book.code, chapter, selectedVerse).length > 0}
        onClose={() => setSelectedVerse(0)}
      />
      
      <TagModal
        visible={tagModalVisible}
        bookCode={book.code}
        chapter={chapter}
        verse={selectedVerse}
        onClose={() => {
          setTagModalVisible(false);
          setSelectedVerse(0);
        }}
      />
      
      <NoteModal
        visible={noteModalVisible}
        book={book}
        chapter={chapter}
        verse={selectedVerse}
        existingNote={selectedVerse > 0 ? getNoteForVerse(book.code, chapter, selectedVerse)?.text : undefined}
        scale={1}
        onClose={() => setNoteModalVisible(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
      
      {/* Color Picker Modal - Removed, now using FontControls */}
      {false && (
        <Modal
          visible={false}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Choose Highlight Color</ThemedText>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                {HIGHLIGHT_COLORS.map((color: string) => (
                  <TouchableOpacity
                    key={color}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: color,
                      margin: 10,
                      borderWidth: selectedHighlightColor === color ? 4 : 2,
                      borderColor: selectedHighlightColor === color ? '#333' : '#ddd',
                    }}
                    onPress={() => {
                      setSelectedHighlightColor(color);
                      // Modal is disabled - using FontControls instead
                    }}
                  />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};
