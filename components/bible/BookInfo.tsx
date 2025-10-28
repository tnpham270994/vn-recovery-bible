import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getBookDetail } from '@/utils/bibleUtils';
import React from 'react';
import { View } from 'react-native';
import { styles } from './BookInfo.styles';

interface BookInfoProps {
  bookCode: string;
}

export const BookInfo: React.FC<BookInfoProps> = ({ bookCode }) => {
  const detail = getBookDetail(bookCode);
  
  return (
    <View style={styles.bookInfoContainer}>
      <View style={styles.infoItem}>
        <IconSymbol name="person.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Tác giả:</ThemedText> {detail.author}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="clock.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Thời gian viết:</ThemedText> {detail.time}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="location.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Nơi viết:</ThemedText> {detail.place}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="person.2.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Người nhận:</ThemedText> {detail.recipients}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="lightbulb.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Chủ đề:</ThemedText> {detail.theme}
        </ThemedText>
      </View>
    </View>
  );
};
