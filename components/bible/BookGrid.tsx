import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/constants/bibleData';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './BookGrid.styles';

interface BookGridProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  bookButtonColor: string;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onBookSelect, bookButtonColor }) => {
  const groupedBooks = books.reduce((rows: Book[][], book: Book, index: number) => {
    const rowIndex = Math.floor(index / 3);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push(book);
    return rows;
  }, []);

  return (
    <View style={styles.booksGrid}>
      {groupedBooks.map((row: Book[], rowIndex: number) => (
        <View key={rowIndex} style={styles.bookRow}>
          {row.map((book: Book) => (
            <TouchableOpacity
              key={book.code}
              style={[styles.bookButton, { backgroundColor: bookButtonColor }]}
              onPress={() => onBookSelect(book)}
            >
              <ThemedText style={styles.bookButtonText}>{book.code}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
