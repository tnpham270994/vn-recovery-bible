import { Book } from '@/constants/bibleData';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface BibleContextType {
  selectedBook: Book | null;
  selectedChapter: number | null;
  handleBookSelect: (book: Book) => void;
  handleChapterSelect: (chapter: number) => void;
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

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  const value: BibleContextType = {
    selectedBook,
    selectedChapter,
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
