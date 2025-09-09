import { styles } from '@/components/bible/BookDetailScreen.styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BOOK_NAMES } from '@/constants/bibleData';
import { useBibleNavigation } from '@/hooks/useBibleNavigation';
import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BookInfo } from './BookInfo';
import { ChapterGrid } from './ChapterGrid';
import { VerseDisplay } from './VerseDisplay';

export const BookDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    selectedBook,
    selectedChapter,
    handleBookSelect,
    handleChapterSelect,
    handleBackToBooks,
    handleBackToChapters,
  } = useBibleNavigation();

  // Clear query parameters
  const clearQueryParams = () => {
    router.replace('/(tabs)');
  };

  // Handle chapter change with parameter clearing
  const handleChapterChange = (newChapter: number) => {
    handleChapterSelect(newChapter);
    // Clear query parameters when changing chapters
    clearQueryParams();
  };

  // Handle back to books with parameter clearing
  const handleBackToBooksWithClear = () => {
    handleBackToBooks();
    clearQueryParams();
  };

  // Handle back to chapters with parameter clearing
  const handleBackToChaptersWithClear = () => {
    handleBackToChapters();
    clearQueryParams();
  };

  // Handle navigation from search results
  useEffect(() => {
    if (params.book && params.chapter) {
      const bookCode = params.book as string;
      const chapter = parseInt(params.chapter as string, 10);
      
      // Find the book by code
      const book = BOOK_NAMES.find(b => b.code === bookCode);
      if (book) {
        handleBookSelect(book);
        handleChapterSelect(chapter);
        // Clear parameters after navigation
        setTimeout(() => {
          clearQueryParams();
        }, 1000); // Small delay to ensure navigation is complete
      }
    }
  }, [params.book, params.chapter, handleBookSelect, handleChapterSelect]);

  // Clear parameters when component unmounts or when no search params
  useEffect(() => {
    // Clear parameters if they exist but no book/chapter is selected
    if (params.book && !selectedBook) {
      clearQueryParams();
    }
  }, [selectedBook, params.book]);

  const headerFooterColor = useThemeColor({}, 'headerFooter');
  const bookButtonColor = useThemeColor({}, 'bookButton');

  // If no book is selected, show a message to select from books tab
  if (!selectedBook) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={[styles.header, { backgroundColor: headerFooterColor }]}>
          <ThemedText style={styles.headerText}>KINH THÁNH BẢN KHÔI PHỤC</ThemedText>
        </ThemedView>
        <ThemedView style={styles.mainContent}>
          <ThemedView style={styles.emptyStateContainer}>
            <FontAwesome6 name="book-bible" size={48} color="#5A4A3A" />
            <ThemedText style={styles.emptyStateTitle}>Chọn Sách Kinh Thánh</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              Vui lòng chọn một sách từ tab "Sách" để xem chi tiết và chương
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: headerFooterColor }]}>
        <ThemedText style={styles.headerText}>KINH THÁNH BẢN KHÔI PHỤC</ThemedText>
      </ThemedView>

      {/* Main Content */}
      <ThemedView style={styles.mainContent}>
        {/* Book Detail View */}
        <ThemedView style={styles.bookDetailContainer}>
          {/* Book Header */}
          <View style={styles.bookHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToBooksWithClear}
            >
              <FontAwesome6 name="book-bible" size={20} color="#5A4A3A" />
            </TouchableOpacity>
            <ThemedText style={styles.bookTitle}>{selectedBook.name.toUpperCase()}</ThemedText>
          </View>

          {/* Book Information - Only show when no chapter is selected */}
          {!selectedChapter && <BookInfo bookCode={selectedBook.code} />}

          {/* Chapter Grid - Only show when no chapter is selected */}
          {!selectedChapter && (
            <ChapterGrid 
              bookCode={selectedBook.code}
              onChapterSelect={handleChapterSelect}
              bookButtonColor={bookButtonColor}
            />
          )}

          {/* Verse Display - Show when chapter is selected */}
          {selectedChapter && (
            <VerseDisplay 
              book={selectedBook}
              chapter={selectedChapter}
              onBackToChapters={handleBackToChaptersWithClear}
              onChapterChange={handleChapterChange}
              targetVerse={params.verse ? parseInt(params.verse as string, 10) : undefined}
            />
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};
