import { BookInfo } from '@/components/bible/BookInfo';
import { ChapterGrid } from '@/components/bible/ChapterGrid';
import { VerseDisplay } from '@/components/bible/VerseDisplay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBibleContext } from '@/contexts/BibleContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles } from '@/styles/tabs/books.styles';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

export default function BooksScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    selectedBook,
    selectedChapter,
    handleBookSelect,
    handleChapterSelect,
    handleBackToBooks,
    handleBackToChapters,
  } = useBibleContext();

  // Clear query parameters
  const clearQueryParams = () => {
    router.replace('/(tabs)/books');
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
      const BOOK_NAMES = require('@/constants/bibleData').BOOK_NAMES;
      const book = BOOK_NAMES.find((b: any) => b.code === bookCode);
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

  const bookButtonColor = useThemeColor({}, 'bookButton');
  // If no book is selected, show a message to select from index tab
  if (!selectedBook) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={styles.mainContent}>
          <ThemedView style={styles.emptyStateContainer}>
            <FontAwesome6 name="book-bible" size={48} color="#5A4A3A" />
            <ThemedText style={styles.emptyStateTitle}>Chọn Sách Kinh Thánh</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              Vui lòng chọn một sách từ tab "Trang chủ" để xem chương và câu
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <ThemedView style={styles.mainContent}>
        {/* Book Detail View */}
        <ThemedView style={styles.bookDetailContainer}>
          {/* Book Header */}
          <View style={styles.bookHeader}>
            <ThemedText style={styles.bookTitle}>{selectedBook.name.toUpperCase()}</ThemedText>
          </View>

          {/* Book Information and Chapter Grid - Only show when no chapter is selected */}
          {!selectedChapter && (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <BookInfo bookCode={selectedBook.code} />
              <ChapterGrid 
                bookCode={selectedBook.code}
                onChapterSelect={handleChapterSelect}
                bookButtonColor={bookButtonColor}
              />
            </ScrollView>
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
    </ThemedView>
  );
}
