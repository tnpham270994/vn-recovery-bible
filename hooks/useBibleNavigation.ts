import { Book } from '@/constants/bibleData';
import { useState } from 'react';

export const useBibleNavigation = () => {
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

  return {
    selectedBook,
    selectedChapter,
    handleBookSelect,
    handleChapterSelect,
    handleBackToBooks,
    handleBackToChapters,
  };
};
