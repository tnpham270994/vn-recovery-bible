import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface VerseTag {
  id: string;
  bookCode: string;
  chapter: number;
  verse: number;
  tagId: string;
  createdAt: number;
}

interface TagsContextType {
  tags: Tag[];
  verseTags: VerseTag[];
  addTag: (name: string, color?: string) => string;
  deleteTag: (id: string) => void;
  updateTag: (id: string, name: string, color?: string) => void;
  addTagToVerse: (bookCode: string, chapter: number, verse: number, tagId: string) => void;
  removeTagFromVerse: (verseTagId: string) => void;
  getTagsForVerse: (bookCode: string, chapter: number, verse: number) => Tag[];
  hasTag: (bookCode: string, chapter: number, verse: number, tagId: string) => boolean;
  getAllTags: () => Tag[];
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

const STORAGE_KEY_TAGS = '@vn-recovery-bible:tags';
const STORAGE_KEY_VERSE_TAGS = '@vn-recovery-bible:verse-tags';

export const TagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [verseTags, setVerseTags] = useState<VerseTag[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTags, storedVerseTags] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_TAGS),
          AsyncStorage.getItem(STORAGE_KEY_VERSE_TAGS),
        ]);
        if (storedTags) setTags(JSON.parse(storedTags));
        if (storedVerseTags) setVerseTags(JSON.parse(storedVerseTags));
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags)),
          AsyncStorage.setItem(STORAGE_KEY_VERSE_TAGS, JSON.stringify(verseTags)),
        ]);
      } catch (error) {
        console.error('Error saving tags:', error);
      }
    };
    saveData();
  }, [tags, verseTags]);

  const addTag = useCallback((name: string, color: string = '#007AFF') => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color,
      createdAt: Date.now(),
    };
    setTags(prev => [...prev, newTag]);
    return newTag.id;
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    setVerseTags(prev => prev.filter(vt => vt.tagId !== id));
  }, []);

  const updateTag = useCallback((id: string, name: string, color?: string) => {
    setTags(prev => prev.map(tag =>
      tag.id === id
        ? { ...tag, name: name.trim(), ...(color && { color }) }
        : tag
    ));
  }, []);

  const addTagToVerse = useCallback((bookCode: string, chapter: number, verse: number, tagId: string) => {
    const newVerseTag: VerseTag = {
      id: `vt-${Date.now()}`,
      bookCode,
      chapter,
      verse,
      tagId,
      createdAt: Date.now(),
    };
    setVerseTags(prev => [...prev, newVerseTag]);
  }, []);

  const removeTagFromVerse = useCallback((verseTagId: string) => {
    setVerseTags(prev => prev.filter(vt => vt.id !== verseTagId));
  }, []);

  const getTagsForVerse = useCallback((bookCode: string, chapter: number, verse: number): Tag[] => {
    const verseTagIds = verseTags
      .filter(vt => vt.bookCode === bookCode && vt.chapter === chapter && vt.verse === verse)
      .map(vt => vt.tagId);
    
    return tags.filter(tag => verseTagIds.includes(tag.id));
  }, [tags, verseTags]);

  const hasTag = useCallback((bookCode: string, chapter: number, verse: number, tagId: string): boolean => {
    return verseTags.some(vt =>
      vt.bookCode === bookCode &&
      vt.chapter === chapter &&
      vt.verse === verse &&
      vt.tagId === tagId
    );
  }, [verseTags]);

  const getAllTags = useCallback(() => tags, [tags]);

  return (
    <TagsContext.Provider value={{
      tags,
      verseTags,
      addTag,
      deleteTag,
      updateTag,
      addTagToVerse,
      removeTagFromVerse,
      getTagsForVerse,
      hasTag,
      getAllTags,
    }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = (): TagsContextType => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within TagsProvider');
  }
  return context;
};