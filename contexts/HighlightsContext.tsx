import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Highlight {
  id: string;
  bookCode: string;
  chapter: number;
  verse: number;
  text: string; // The exact text that was highlighted
  color: string;
  position: number; // Position of the highlight in the verse text
  createdAt: number;
}

interface HighlightsContextType {
  highlights: Highlight[];
  addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  removeHighlight: (id: string) => void;
  getHighlightsForVerse: (bookCode: string, chapter: number, verse: number) => Highlight[];
  clearAllHighlights: () => void;
}

const HighlightsContext = createContext<HighlightsContextType | undefined>(undefined);

interface HighlightsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@vn-recovery-bible:highlights';
export const HIGHLIGHT_COLORS = [
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
];

export const HighlightsProvider: React.FC<HighlightsProviderProps> = ({ children }) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHighlights(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading highlights:', error);
      }
    };
    loadHighlights();
  }, []);

  useEffect(() => {
    const saveHighlights = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
      } catch (error) {
        console.error('Error saving highlights:', error);
      }
    };
    saveHighlights();
  }, [highlights]);

  const addHighlight = useCallback((highlight: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlight,
      id: `${highlight.bookCode}-${highlight.chapter}-${highlight.verse}-${Date.now()}`,
      createdAt: Date.now(),
    };
    setHighlights(prev => [...prev, newHighlight]);
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  const getHighlightsForVerse = useCallback((bookCode: string, chapter: number, verse: number) => {
    return highlights.filter(h => 
      h.bookCode === bookCode && 
      h.chapter === chapter && 
      h.verse === verse
    );
  }, [highlights]);

  const clearAllHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  const value: HighlightsContextType = {
    highlights,
    addHighlight,
    removeHighlight,
    getHighlightsForVerse,
    clearAllHighlights,
  };

  return (
    <HighlightsContext.Provider value={value}>
      {children}
    </HighlightsContext.Provider>
  );
};

export const useHighlights = (): HighlightsContextType => {
  const context = useContext(HighlightsContext);
  if (context === undefined) {
    throw new Error('useHighlights must be used within a HighlightsProvider');
  }
  return context;
};
