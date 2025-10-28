import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BibleProvider } from '@/contexts/BibleContext';
import { BookmarkProvider } from '@/contexts/BookmarkContext';
import { FontSettingsProvider } from '@/contexts/FontSettingsContext';
import { HighlightsProvider } from '@/contexts/HighlightsContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { TagsProvider } from '@/contexts/TagsContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <BibleProvider>
        <FontSettingsProvider>
          <HighlightsProvider>
            <NotesProvider>
              <BookmarkProvider>
                <TagsProvider>
                  <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="dark" />
            </ThemeProvider>
                </TagsProvider>
              </BookmarkProvider>
            </NotesProvider>
          </HighlightsProvider>
        </FontSettingsProvider>
      </BibleProvider>
    </SafeAreaProvider>
  );
}
