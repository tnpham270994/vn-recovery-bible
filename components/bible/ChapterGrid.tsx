import { ThemedText } from '@/components/ThemedText';
import { getChaptersForBook } from '@/data/bibleUtils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './ChapterGrid.styles';

interface ChapterGridProps {
  bookCode: string;
  onChapterSelect: (chapter: number) => void;
  bookButtonColor: string;
}

export const ChapterGrid: React.FC<ChapterGridProps> = ({ bookCode, onChapterSelect, bookButtonColor }) => {
  const chapters = getChaptersForBook(bookCode);
  
  return (
    <View style={styles.chapterSection}>
      <ThemedText style={styles.chapterSectionTitle}>CÁC CHƯƠNG</ThemedText>
      <View style={styles.chapterGrid}>
        {chapters.map((chapter: number) => (
          <TouchableOpacity
            key={chapter}
            style={[styles.chapterButton, { backgroundColor: bookButtonColor }]}
            onPress={() => onChapterSelect(chapter)}
          >
            <ThemedText style={styles.chapterButtonText}>{chapter}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
