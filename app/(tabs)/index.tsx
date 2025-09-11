import { BookGrid } from '@/components/bible/BookGrid';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BOOK_NAMES } from '@/constants/bibleData';
import { useBibleContext } from '@/contexts/BibleContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles } from '@/styles/tabs/index.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const { selectedBook, handleBookSelect } = useBibleContext();
  const bookButtonColor = useThemeColor({}, 'bookButton');


  const handleBookSelection = (book: any) => {
    try {
      // Select the book first
      handleBookSelect(book);
      // Immediately navigate to books tab
      router.replace('/(tabs)/books');
    } catch (error) {
      console.error('Error selecting book:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Book Grid */}
      <ThemedView style={styles.mainContent}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <ThemedText style={styles.headerText}>KINH THÁNH</ThemedText>
        <ThemedText style={styles.headerText}>TÂN ƯỚC</ThemedText>
        <ThemedText style={styles.subtitleText}>BẢN KHÔI PHỤC</ThemedText>
        <BookGrid 
          books={BOOK_NAMES}
          onBookSelect={handleBookSelection}
          bookButtonColor={bookButtonColor}
        />
      </ThemedView>
    </ScrollView>
  );
}