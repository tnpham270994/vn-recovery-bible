import { Book } from '@/constants/bibleData';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface BibleContextType {
  selectedBook: Book | null;
  selectedChapter: number | null;
  targetVerse: number | null;
  handleBookSelect: (book: Book) => void;
  handleChapterSelect: (chapter: number, targetVerse?: number) => void;
  handleBackToBooks: () => void;
  handleBackToChapters: () => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

interface BibleProviderProps {
  children: ReactNode;
}

export const BibleProvider: React.FC<BibleProviderProps> = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [targetVerse, setTargetVerse] = useState<number | null>(null);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setTargetVerse(null);
  };

  const handleChapterSelect = (chapter: number, targetVerse?: number) => {
    setSelectedChapter(chapter);
    setTargetVerse(targetVerse || null);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setTargetVerse(null);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setTargetVerse(null);
  };

  const value: BibleContextType = {
    selectedBook,
    selectedChapter,
    targetVerse,
    handleBookSelect,
    handleChapterSelect,
    handleBackToBooks,
    handleBackToChapters,
  };

  return (
    <BibleContext.Provider value={value}>
      {children}
    </BibleContext.Provider>
  );
};

export const useBibleContext = (): BibleContextType => {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBibleContext must be used within a BibleProvider');
  }
  return context;
};
