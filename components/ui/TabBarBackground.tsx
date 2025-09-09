import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  if (Platform.OS === 'ios') {
    return null; // Use the iOS-specific blur background
  }
  
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          paddingTop: Platform.OS === 'web' ? 8 : insets.top,
          paddingBottom: 8,
        }
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
