import { BOOK_DETAILS, BOOK_NAMES, BookDetail, CHAPTER_COUNTS, Footnote, FOOTNOTES_DATA, VERSE_DATA } from '@/constants/bibleData';

// Function to strip HTML tags from text
export const stripHTMLTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

export const getChaptersForBook = (bookCode: string): number[] => {
  const totalChapters = CHAPTER_COUNTS[bookCode] || 1;
  return Array.from({ length: totalChapters }, (_, i) => i + 1);
};

export const getVersesForChapter = (bookCode: string, chapter: number): string[] => {
  const verses = VERSE_DATA[bookCode]?.[chapter] || [
    "Đây là câu đầu tiên của chương này.",
    "Đây là câu thứ hai của chương này.",
    "Đây là câu thứ ba của chương này.",
    "Đây là câu thứ tư của chương này.",
    "Đây là câu thứ năm của chương này."
  ];
  
  // Return verses with HTML formatting preserved
  return verses;
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

export const getFootnotesForVerse = (bookCode: string, chapter: number, verse: number): Footnote[] => {
  return FOOTNOTES_DATA[bookCode]?.[chapter]?.[verse] || [];
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
  
  // Search through all books
  Object.keys(VERSE_DATA).forEach(bookCode => {
    const bookData = VERSE_DATA[bookCode];
    const bookName = BOOK_NAMES.find((book: any) => book.code === bookCode)?.name || bookCode;
    
    // Search through all chapters in the book
    Object.keys(bookData).forEach(chapterStr => {
      const chapter = parseInt(chapterStr, 10);
      const verses = bookData[chapter];
      
      // Search through all verses in the chapter
      verses.forEach((verseContent, index) => {
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
  });
  
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

export const parseTextWithHTML = (text: string) => {
  const segments: Array<{
    text: string;
    isFootnote: boolean;
    footnoteId?: string;
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
    // Check for footnote patterns like [1], [2], [a], etc.
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
      
      segments.push({
        text: footnoteMatch[1],
        isFootnote: true,
        footnoteId: footnoteMatch[2]
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
