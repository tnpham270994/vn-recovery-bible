import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './VerseNavigation.styles';

interface VerseNavigationProps {
  totalVerses: number;
  onVersePress: (verseNumber: number) => void;
}

export const VerseNavigation: React.FC<VerseNavigationProps> = ({ 
  totalVerses, 
  onVersePress
}) => {
  const verseNumbers = Array.from({ length: totalVerses }, (_, i) => i + 1);
  
  // Group verses into rows of 10
  const verseRows = [];
  for (let i = 0; i < verseNumbers.length; i += 10) {
    verseRows.push(verseNumbers.slice(i, i + 10));
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>CÁC CÂU</ThemedText>

        {verseRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.verseRow}>
            {row.map((verseNumber) => (
                <TouchableOpacity
                key={verseNumber}
                style={styles.verseButton}
                onPress={() => onVersePress(verseNumber)}
                >
                <ThemedText style={styles.verseButtonText}>
                    {verseNumber}
                </ThemedText>
                </TouchableOpacity>
            ))}
            </View>
        ))}
    </View>
  );
};
