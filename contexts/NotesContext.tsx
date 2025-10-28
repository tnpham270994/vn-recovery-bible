import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Note {
  id: string;
  bookCode: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  getNoteForVerse: (bookCode: string, chapter: number, verse: number) => Note | undefined;
  clearAllNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@vn-recovery-bible:notes';

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotes(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };
    saveNotes();
  }, [notes]);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `${note.bookCode}-${note.chapter}-${note.verse}-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, text, updatedAt: Date.now() }
        : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const getNoteForVerse = useCallback((bookCode: string, chapter: number, verse: number) => {
    return notes.find(note => 
      note.bookCode === bookCode && 
      note.chapter === chapter && 
      note.verse === verse
    );
  }, [notes]);

  const clearAllNotes = useCallback(() => {
    setNotes([]);
  }, []);

  const value: NotesContextType = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteForVerse,
    clearAllNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
