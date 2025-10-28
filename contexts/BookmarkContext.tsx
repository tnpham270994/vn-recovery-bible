import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Bookmark {
  id: string;
  bookCode: string;
  chapter: number;
  verse: number;
  createdAt: number;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (bookCode: string, chapter: number, verse: number) => void;
  isBookmarked: (bookCode: string, chapter: number, verse: number) => boolean;
  getBookmarkForVerse: (bookCode: string, chapter: number, verse: number) => Bookmark | undefined;
  getAllBookmarks: () => Bookmark[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@vn-recovery-bible:bookmarks';

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBookmarks(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };
    loadBookmarks();
  }, []);

  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    };
    saveBookmarks();
  }, [bookmarks]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const existing = getBookmarkForVerse(bookmark.bookCode, bookmark.chapter, bookmark.verse);
    if (!existing) {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `${bookmark.bookCode}-${bookmark.chapter}-${bookmark.verse}-${Date.now()}`,
        createdAt: Date.now(),
      };
      setBookmarks(prev => [...prev, newBookmark]);
    }
  }, [bookmarks]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  }, []);

  const toggleBookmark = useCallback((bookCode: string, chapter: number, verse: number) => {
    const existing = getBookmarkForVerse(bookCode, chapter, verse);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({ bookCode, chapter, verse });
    }
  }, [bookmarks]);

  const getBookmarkForVerse = useCallback((bookCode: string, chapter: number, verse: number) => {
    return bookmarks.find(bookmark => 
      bookmark.bookCode === bookCode && 
      bookmark.chapter === chapter && 
      bookmark.verse === verse
    );
  }, [bookmarks]);

  const isBookmarked = useCallback((bookCode: string, chapter: number, verse: number) => {
    return !!getBookmarkForVerse(bookCode, chapter, verse);
  }, [bookmarks]);

  const getAllBookmarks = useCallback(() => {
    return bookmarks.sort((a, b) => b.createdAt - a.createdAt);
  }, [bookmarks]);

  const value: BookmarkContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarkForVerse,
    getAllBookmarks,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

