import { ThemedText } from '@/components/ThemedText';
import { BOOK_NAMES } from '@/constants/bibleData';
import { COLORS } from '@/constants/styles';
import { useTags } from '@/contexts/TagsContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AllTagsScreenProps {
  onBack?: () => void;
}

export const AllTagsScreen: React.FC<AllTagsScreenProps> = ({ onBack }) => {
  const router = useRouter();
  const { tags, verseTags } = useTags();

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

  // Group verse tags by tag ID
  const tagsWithVerses = useMemo(() => {
    return tags.map(tag => {
      const verses = verseTags.filter(vt => vt.tagId === tag.id);
      return {
        tag,
        verses: verses.sort((a, b) => b.createdAt - a.createdAt)
      };
    }).filter(item => item.verses.length > 0);
  }, [tags, verseTags]);

  const sortedTags = useMemo(() => {
    return [...tagsWithVerses].sort((a, b) => b.tag.createdAt - a.tag.createdAt);
  }, [tagsWithVerses]);

  if (tags.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <ThemedText style={styles.headerTitle}>Tất cả thẻ</ThemedText>
        </View>
        
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <FontAwesome name="tags" size={64} color={COLORS.border} />
          <ThemedText style={styles.emptyTitle}>Chưa có thẻ nào</ThemedText>
          <ThemedText style={styles.emptyText}>
            Bạn có thể thêm thẻ bằng cách chọn một câu và nhấn vào biểu tượng thẻ
          </ThemedText>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <ThemedText style={styles.headerTitle}>Tất cả thẻ</ThemedText>
      </View>
      
      {sortedTags.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <FontAwesome name="tag" size={64} color={COLORS.border} />
          <ThemedText style={styles.emptyTitle}>Chưa có thẻ nào được sử dụng</ThemedText>
          <ThemedText style={styles.emptyText}>
            Thêm thẻ vào các câu để xem chúng ở đây
          </ThemedText>
        </ScrollView>
      ) : (
        <ScrollView>
          {sortedTags.map(({ tag, verses }) => (
            <View key={tag.id} style={styles.tagGroup}>
              <View style={styles.tagHeader}>
                <View style={styles.tagHeaderLeft}>
                  <View style={[styles.tagColorIndicator, { backgroundColor: tag.color }]} />
                  <ThemedText style={styles.tagName}>{tag.name}</ThemedText>
                </View>
                <View style={styles.tagCountBadge}>
                  <ThemedText style={styles.tagCountText}>{verses.length}</ThemedText>
                </View>
              </View>
              
              {verses.map((verseTag) => {
                return (
                  <TouchableOpacity
                    key={verseTag.id}
                    style={styles.verseCard}
                    onPress={() => navigateToVerse(verseTag.bookCode, verseTag.chapter, verseTag.verse)}
                  >
                    <View style={styles.verseCardContent}>
                      <FontAwesome name="book" size={16} color={tag.color} />
                      <View style={styles.verseText}>
                        <ThemedText style={styles.reference}>
                          {getBookName(verseTag.bookCode)} {verseTag.chapter}:{verseTag.verse}
                        </ThemedText>
                        <ThemedText style={styles.date}>
                          {new Date(verseTag.createdAt).toLocaleDateString('vi-VN')}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
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
  tagGroup: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tagHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tagColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tagName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tagCountBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  verseCard: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verseText: {
    flex: 1,
  },
  reference: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
