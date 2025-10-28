import { ThemedText } from '@/components/ThemedText';
import { BOOK_NAMES } from '@/constants/bibleData';
import { COLORS } from '@/constants/styles';
import { useBookmarks } from '@/contexts/BookmarkContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AllBookmarksScreenProps {
  onBack?: () => void;
}

export const AllBookmarksScreen: React.FC<AllBookmarksScreenProps> = ({ onBack }) => {
  const router = useRouter();
  const { bookmarks } = useBookmarks();
    
  const navigateToVerse = (bookCode: string, chapter: number, verse: number) => {
    router.push({
      pathname: '/(tabs)/books',
      params: {
        book: bookCode,
        chapter: chapter.toString(),
        verse: verse.toString()
      }
    });
  };

  const getBookName = (bookCode: string): string => {
    const book = BOOK_NAMES.find(b => b.code === bookCode);
    return book ? book.name : bookCode;
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <ThemedText style={styles.headerTitle}>Tất cả dấu trang</ThemedText>
      </View>
      
      {bookmarks.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={64} color={COLORS.border} />
          <ThemedText style={styles.emptyTitle}>Chưa có dấu trang nào</ThemedText>
          <ThemedText style={styles.emptyText}>
            Bạn có thể thêm dấu trang bằng cách chọn một câu và nhấn vào biểu tượng dấu trang
          </ThemedText>
        </ScrollView>
      ) : (
        <ScrollView>
          {sortedBookmarks.map((bookmark) => (
            <TouchableOpacity
              key={bookmark.id}
              style={styles.bookmarkCard}
              onPress={() => navigateToVerse(bookmark.bookCode, bookmark.chapter, bookmark.verse)}
            >
              <View style={styles.headerContent}>
                <View style={styles.bookmarkIcon}>
                  <FontAwesome name="bookmark" size={20} color="#007AFF" />
                </View>
                <View style={styles.headerText}>
                  <ThemedText style={styles.reference}>
                    {getBookName(bookmark.bookCode)} {bookmark.chapter}:{bookmark.verse}
                  </ThemedText>
                  <ThemedText style={styles.date}>
                    Đã thêm: {new Date(bookmark.createdAt).toLocaleDateString('vi-VN')}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bookmarkCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  reference: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
