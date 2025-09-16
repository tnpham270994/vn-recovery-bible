import { ThemedText } from '@/components/ThemedText';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { COLORS } from '@/constants/styles';
import React, { useState } from 'react';
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
  const [pressedButton, setPressedButton] = useState<number | null>(null);

  // Create verse numbers with the pattern: 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75
  const createVerseNumbers = () => {
    const numbers = [];
    
    // Add 1
    numbers.push(1);
    
    // Add multiples of 5 from 5 to totalVerses
    for (let i = 5; i <= totalVerses; i += 5) {
      numbers.push(i);
    }
    
    // Add the last verse if it's not already included
    if (totalVerses > 1 && !numbers.includes(totalVerses)) {
      numbers.push(totalVerses);
    }
    
    return numbers;
  };

  const verseNumbers = createVerseNumbers();

  // Create navigation items with dots between numbers
  const createNavigationItems = () => {
    const items = [];
    
    for (let i = 0; i < verseNumbers.length; i++) {
      const currentNumber = verseNumbers[i];
      const nextNumber = verseNumbers[i + 1];
      
      // Add the current number
      items.push({
        type: 'number',
        value: currentNumber,
        key: `number-${currentNumber}`
      });
      
      // Add dots if there's a next number and the gap is more than 1
      if (nextNumber && nextNumber - currentNumber > 1) {
        const gap = nextNumber - currentNumber;
        const dotsCount = Math.min(gap - 1, 4); // Maximum 4 dots
        
        for (let j = 1; j <= dotsCount; j++) {
          const targetVerse = currentNumber + j;
          items.push({
            type: 'dot',
            value: targetVerse,
            key: `dot-${currentNumber}-${j}`
          });
        }
      }
    }
    
    return items;
  };

  const navigationItems = createNavigationItems();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>CÁC CÂU</ThemedText>

      <View style={styles.navigationRow}>
        {navigationItems.map((item) => {
          if (item.type === 'number') {
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.verseButton,
                  pressedButton === item.value && styles.verseButtonPressed
                ]}
                onPress={() => onVersePress(item.value)}
                onPressIn={() => setPressedButton(item.value)}
                onPressOut={() => setPressedButton(null)}
              >
                <ThemedText style={[
                  styles.verseButtonText,
                  pressedButton === item.value && styles.verseButtonTextPressed
                ]}>
                  {item.value}
                </ThemedText>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.dotButton,
                  pressedButton === item.value && styles.dotButtonPressed
                ]}
                onPress={() => onVersePress(item.value)}
                onPressIn={() => setPressedButton(item.value)}
                onPressOut={() => setPressedButton(null)}
              >
                <FontAwesome6 name="diamond" size={8} color={COLORS.secondary} />
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </View>
  );
};
