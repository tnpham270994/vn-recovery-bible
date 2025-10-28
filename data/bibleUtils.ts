import { BOOK_DETAILS, BOOK_NAMES, BookDetail, CHAPTER_COUNTS } from '@/constants/bibleData';

// Import all JSON data files statically
import co1Data from '@/data/1co.json';
import gi1Data from '@/data/1gi.json';
import phi1Data from '@/data/1phi.json';
import te1Data from '@/data/1te.json';
import ti1Data from '@/data/1ti.json';
import co2Data from '@/data/2co.json';
import gi2Data from '@/data/2gi.json';
import phi2Data from '@/data/2phi.json';
import te2Data from '@/data/2te.json';
import ti2Data from '@/data/2ti.json';
import gi3Data from '@/data/3gi.json';
import colData from '@/data/col.json';
import congData from '@/data/cong.json';
import ephData from '@/data/eph.json';
import gaData from '@/data/ga.json';
import giData from '@/data/gi.json';
import giaData from '@/data/gia.json';
import giuData from '@/data/giu.json';
import heData from '@/data/he.json';
import khaiData from '@/data/khai.json';
import laData from '@/data/la.json';
import luData from '@/data/lu.json';
import macData from '@/data/mac.json';
import matData from '@/data/mat.json';
import philData from '@/data/phil.json';
import plmData from '@/data/plm.json';
import titData from '@/data/tit.json';

// Map book codes to their data
const dataFiles: { [key: string]: any } = {
  'mat': matData,
  'mac': macData,
  'lu': luData,
  'gi': giData,
  'cong': congData,
  'la': laData,
  '1co': co1Data,
  '2co': co2Data,
  'ga': gaData,
  'eph': ephData,
  'phil': philData,
  'col': colData,
  '1te': te1Data,
  '2te': te2Data,
  '1ti': ti1Data,
  '2ti': ti2Data,
  'tit': titData,
  'plm': plmData,
  'he': heData,
  'gia': giaData,
  '1phi': phi1Data,
  '2phi': phi2Data,
  '1gi': gi1Data,
  '2gi': gi2Data,
  '3gi': gi3Data,
  'giu': giuData,
  'khai': khaiData,
};

// Function to get data file
const getDataFile = (bookCode: string) => {
  return dataFiles[bookCode] || null;
};

// Function to strip HTML tags from text
export const stripHTMLTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

export const getChaptersForBook = (bookCode: string): number[] => {
  const totalChapters = CHAPTER_COUNTS[bookCode] || 1;
  return Array.from({ length: totalChapters }, (_, i) => i + 1);
};

export const getVersesForChapter = (bookCode: string, chapter: number): string[] => {
  try {
    const data = getDataFile(bookCode);
    if (!data || !data.verse_data || !data.verse_data[chapter.toString()]) {
      return [
        "Đây là câu đầu tiên của chương này.",
        "Đây là câu thứ hai của chương này.",
        "Đây là câu thứ ba của chương này.",
        "Đây là câu thứ tư của chương này.",
        "Đây là câu thứ năm của chương này."
      ];
    }
    
    return data.verse_data[chapter.toString()];
  } catch (error) {
    console.error(`Error loading verses for ${bookCode} chapter ${chapter}:`, error);
    return [
      "Đây là câu đầu tiên của chương này.",
      "Đây là câu thứ hai của chương này.",
      "Đây là câu thứ ba của chương này.",
      "Đây là câu thứ tư của chương này.",
      "Đây là câu thứ năm của chương này."
    ];
  }
};

export const getBookDetail = (bookCode: string): BookDetail => {
  return BOOK_DETAILS[bookCode] || {
    author: 'Không rõ tác giả',
    time: 'Không rõ thời gian',
    place: 'Không rõ nơi viết',
    recipients: 'Tất cả các tín đồ',
    theme: 'Phúc âm của Chúa Jesus Christ'
  };
};

export const getFootnotesForVerse = (bookCode: string, chapter: number, verse: number): any => {
  try {
    const data = getDataFile(bookCode);
    if (!data || !data.footnotes || !data.footnotes[chapter.toString()] || !data.footnotes[chapter.toString()][verse.toString()]) {
      return [];
    }
    let result = data.footnotes[chapter.toString()][verse.toString()].map((v: any) => ({
      ...v,
      isFootnote: true
    }))
    return result;
  } catch (error) {
    console.error(`Error loading footnotes for ${bookCode} ${chapter}:${verse}:`, error);
    return [];
  }
};

export const getRefsForVerse = (bookCode: string, chapter: number, verse: number): any => {
  try {
    const data = getDataFile(bookCode);
    if (!data || !data.refs || !data.refs[chapter.toString()] || !data.refs[chapter.toString()][verse.toString()]) {
      return [];
    }
    
    const refString = data.refs[chapter.toString()][verse.toString()];
    // map to array object [{id: key, text: 'value'}]
    return Object.entries(refString).map(([key, value]) => ({
      id: key,
      text: typeof value === 'string' ? value : JSON.stringify(value),
      isFootnote: false
    }));
  } catch (error) {
    console.error(`Error loading refs for ${bookCode} ${chapter}:${verse}:`, error);
    return [];
  }
};

export interface SearchResult {
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
  content: string;
  fullReference: string;
}

export const searchVersesByKeyword = (keyword: string): SearchResult[] => {
  if (!keyword.trim()) return [];
  
  const searchTerm = keyword.toLowerCase().trim();
  const results: SearchResult[] = [];
  
  // Get all available book codes from BOOK_NAMES
  const bookCodes = BOOK_NAMES.map((book: any) => book.code);
  
  // Search through all books
  for (const bookCode of bookCodes) {
    try {
      const data = getDataFile(bookCode);
      if (!data || !data.verse_data) continue;
      
      const bookName = BOOK_NAMES.find((book: any) => book.code === bookCode)?.name || bookCode;
      
      // Search through all chapters in the book
      Object.keys(data.verse_data).forEach(chapterStr => {
        const chapter = parseInt(chapterStr, 10);
        const verses = data.verse_data[chapter];
        
        // Search through all verses in the chapter
        verses.forEach((verseContent: string, index: number) => {
          const verseNumber = index + 1;
          
          // Remove HTML tags for searching
          const cleanContent = verseContent.replace(/<[^>]*>/g, '');
          
          // Check if the keyword exists in the verse content (case-insensitive)
          if (cleanContent.toLowerCase().includes(searchTerm)) {
            results.push({
              bookCode,
              bookName,
              chapter,
              verse: verseNumber,
              content: stripHTMLTags(verseContent), // Strip HTML tags from content
              fullReference: `${bookName} ${chapter}:${verseNumber}`
            });
          }
        });
      });
    } catch (error) {
      console.error(`Error searching in book ${bookCode}:`, error);
    }
  }
  
  // Sort results by book order (following BOOK_NAMES order)
  const bookOrder = BOOK_NAMES.map((book: any) => book.code);
  results.sort((a, b) => {
    const aIndex = bookOrder.indexOf(a.bookCode);
    const bIndex = bookOrder.indexOf(b.bookCode);
    
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    
    // If same book, sort by chapter
    if (a.chapter !== b.chapter) {
      return a.chapter - b.chapter;
    }
    
    // If same chapter, sort by verse
    return a.verse - b.verse;
  });
  
  return results;
};

// Modify this function
// when text like this: [1a]ban dau -> footnoteId is 1 and referenceId is 1a
// when text like this: [a]ban dau -> footnoteId is a and referenceId is a

export const parseTextWithHTML = (text: string) => {
  const segments: Array<{
    text: string;
    isFootnote: boolean;
    footnoteId?: string;
    referenceId?: string;
    isHighlighted?: boolean;
    isItalic?: boolean;
    isBold?: boolean;
    isUnderline?: boolean;
  }> = [];
  
  let currentText = text;
  let currentSegment = '';
  let currentFormatting = {
    isItalic: false,
    isBold: false,
    isUnderline: false
  };
  
  // Process HTML tags and special patterns
  while (currentText.length > 0) {
    const newFootnoteMatch = currentText.match(/^(\[([^|]+)\|([^\]]+)\])/);
    if (newFootnoteMatch) {
      // Save current segment if it has content
      if (currentSegment.trim()) {
        segments.push({
          text: currentSegment,
          isFootnote: false,
          ...currentFormatting
        });
        currentSegment = '';
      }
      
      // Add the superscript footnote marker
      segments.push({
        text: newFootnoteMatch[2],
        isFootnote: true,
        footnoteId: newFootnoteMatch[2]
      });
      
      // Add the highlighted text
      segments.push({
        text: newFootnoteMatch[3],
        isFootnote: false,
        isHighlighted: true,
        footnoteId: newFootnoteMatch[2],
        ...currentFormatting
      });
      
      currentText = currentText.substring(newFootnoteMatch[1].length);
      continue;
    }
    
    // Check for old footnote patterns like [1], [2], [a], [1a], etc.
    const footnoteMatch = currentText.match(/^(\[([^\]]+)\])/);
    if (footnoteMatch) {
      // Save current segment if it has content
      if (currentSegment.trim()) {
        segments.push({
          text: currentSegment,
          isFootnote: false,
          ...currentFormatting
        });
        currentSegment = '';
      }
      
      const fullReference = footnoteMatch[2];
      let footnoteId = fullReference;
      let referenceId = fullReference;
      
      // Handle cases like [1a] where footnoteId should be 1 and referenceId should be 1a
      const numberLetterMatch = fullReference.match(/^(\d+)([a-zA-Z]+)$/);
      if (numberLetterMatch) {
        footnoteId = numberLetterMatch[1]; // Extract the numeric part
        referenceId = fullReference; // Keep the full reference
      }
      
      segments.push({
        text: fullReference,
        isFootnote: true,
        footnoteId: footnoteId,
        referenceId: referenceId
      });
      currentText = currentText.substring(footnoteMatch[1].length);
      continue;
    }

    // Check for opening HTML tags
    const openTagMatch = currentText.match(/^<(i|b|u|em|strong)>/);
    if (openTagMatch) {
      // Save current segment if it has content
      if (currentSegment.trim()) {
        segments.push({
          text: currentSegment,
          isFootnote: false,
          ...currentFormatting
        });
        currentSegment = '';
      }
      
      // Update formatting
      const tag = openTagMatch[1];
      if (tag === 'i' || tag === 'em') currentFormatting.isItalic = true;
      if (tag === 'b' || tag === 'strong') currentFormatting.isBold = true;
      if (tag === 'u') currentFormatting.isUnderline = true;
      
      currentText = currentText.substring(openTagMatch[0].length);
      continue;
    }

    // Check for closing HTML tags
    const closeTagMatch = currentText.match(/^<\/(i|b|u|em|strong)>/);
    if (closeTagMatch) {
      // Save current segment if it has content
      if (currentSegment.trim()) {
        segments.push({
          text: currentSegment,
          isFootnote: false,
          ...currentFormatting
        });
        currentSegment = '';
      }
      
      // Update formatting
      const tag = closeTagMatch[1];
      if (tag === 'i' || tag === 'em') currentFormatting.isItalic = false;
      if (tag === 'b' || tag === 'strong') currentFormatting.isBold = false;
      if (tag === 'u') currentFormatting.isUnderline = false;
      
      currentText = currentText.substring(closeTagMatch[0].length);
      continue;
    }
    
    // Regular character - add to current segment
    currentSegment += currentText[0];
    currentText = currentText.substring(1);
  }
  
  // Save final segment if it has content
  if (currentSegment.trim()) {
    segments.push({
      text: currentSegment,
      isFootnote: false,
      ...currentFormatting
    });
  }
  
  return segments;
};

export const parseTextWithOnlyHTML = (text: string) => {
  return text.replace(/<[^>]*>/g, '');
};

// Additional utility functions for working with the new data structure

export const getAllBookCodes = (): string[] => {
  return BOOK_NAMES.map((book: any) => book.code);
};

export const getBookName = (bookCode: string): string => {
  return BOOK_NAMES.find((book: any) => book.code === bookCode)?.name || bookCode;
};

export const getBookData = (bookCode: string) => {
  try {
    return getDataFile(bookCode);
  } catch (error) {
    console.error(`Error loading book data for ${bookCode}:`, error);
    return null;
  }
};

export const getVerseWithFootnotes = (bookCode: string, chapter: number, verse: number) => {
  try {
    const data = getDataFile(bookCode);
    if (!data || !data.verse_data || !data.verse_data[chapter.toString()]) {
      return null;
    }
    
    const verseContent = data.verse_data[chapter.toString()][verse - 1];
    const footnotes = getFootnotesForVerse(bookCode, chapter, verse);
    const refs = getRefsForVerse(bookCode, chapter, verse);
    
    return {
      content: verseContent,
      footnotes,
      refs
    };
  } catch (error) {
    console.error(`Error loading verse with footnotes for ${bookCode} ${chapter}:${verse}:`, error);
    return null;
  }
};

export const getChapterData = (bookCode: string, chapter: number) => {
  try {
    const data = getDataFile(bookCode);
    if (!data || !data.verse_data || !data.verse_data[chapter.toString()]) {
      return null;
    }
    
    const verses = data.verse_data[chapter.toString()];
    const footnotes = data.footnotes?.[chapter.toString()] || {};
    const refs = data.refs?.[chapter.toString()] || {};
    
    return {
      verses,
      footnotes,
      refs
    };
  } catch (error) {
    console.error(`Error loading chapter data for ${bookCode} chapter ${chapter}:`, error);
    return null;
  }
};

export const sortFootnotesAndRefs = (items: any[]) => {
  return items.sort((a, b) => {
    const aId = a.id;
    const bId = b.id;
    
    // Helper function to parse the ID into sortable parts
    const parseId = (id: string) => {
      // Match patterns like: "a", "1", "1a", "2b", etc.
      const match = id.match(/^(\d*)([a-z]*)$/);
      if (!match) return { number: 0, letter: '' };
      
      const number = match[1] ? parseInt(match[1]) : 0;
      const letter = match[2] || '';
      
      return { number, letter };
    };
    
    const aParsed = parseId(aId);
    const bParsed = parseId(bId);
    
    // First sort by number
    if (aParsed.number !== bParsed.number) {
      return aParsed.number - bParsed.number;
    }
    
    // If numbers are the same, sort by letter (empty string comes before letters)
    if (!aParsed.letter && bParsed.letter) return -1;
    if (aParsed.letter && !bParsed.letter) return 1;
    if (aParsed.letter && bParsed.letter) {
      return aParsed.letter.localeCompare(bParsed.letter);
    }
    
    // If both number and letter are the same, sort by original string
    return aId.localeCompare(bId);
  });
};

export const getBookFromShortName = (shortName: string) => {
  return BOOK_NAMES.find((book: any) => book.shortName === shortName)?.code || '';
};