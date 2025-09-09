import { BOOK_DETAILS, BOOK_NAMES, BookDetail, CHAPTER_COUNTS, Footnote, FOOTNOTES_DATA, VERSE_DATA } from '@/constants/bibleData';

export const getChaptersForBook = (bookCode: string): number[] => {
  const totalChapters = CHAPTER_COUNTS[bookCode] || 1;
  return Array.from({ length: totalChapters }, (_, i) => i + 1);
};

export const getVersesForChapter = (bookCode: string, chapter: number): string[] => {
  return VERSE_DATA[bookCode]?.[chapter] || [
    "Đây là câu đầu tiên của chương này.",
    "Đây là câu thứ hai của chương này.",
    "Đây là câu thứ ba của chương này.",
    "Đây là câu thứ tư của chương này.",
    "Đây là câu thứ năm của chương này."
  ];
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
            content: verseContent, // Keep original content with HTML tags for display
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
    isItalic: boolean;
    isBold: boolean;
    isUnderline: boolean;
    isFootnote: boolean;
    isAnchor: boolean;
    footnoteId?: string;
    anchorVerse?: number;
  }> = [];
  
  let currentText = text;
  let isItalic = false;
  let isBold = false;
  let isUnderline = false;
  
  // Process HTML tags and special patterns
  while (currentText.length > 0) {
    // Check for footnote patterns like [1], [2], [a], etc.
    const footnoteMatch = currentText.match(/^(\[([^\]]+)\])/);
    if (footnoteMatch) {
      if (segments.length > 0 && segments[segments.length - 1].text) {
        // Add current accumulated text
        segments.push({
          text: '',
          isItalic,
          isBold,
          isUnderline,
          isFootnote: false,
          isAnchor: false
        });
      }
      segments.push({
        text: footnoteMatch[1],
        isItalic: false,
        isBold: false,
        isUnderline: false,
        isFootnote: true,
        isAnchor: false,
        footnoteId: footnoteMatch[2]
      });
      currentText = currentText.substring(footnoteMatch[1].length);
      continue;
    }
    
    // Check for HTML tags
    const htmlTagMatch = currentText.match(/^(<\/?[^>]+>)/);
    if (htmlTagMatch) {
      const tag = htmlTagMatch[1];
      const isClosingTag = tag.startsWith('</');
      const tagName = tag.replace(/<\/?([^>]+)>/, '$1').toLowerCase();
      
      // Update styling state
      if (tagName === 'i') {
        isItalic = !isClosingTag;
      } else if (tagName === 'b' || tagName === 'strong') {
        isBold = !isClosingTag;
      } else if (tagName === 'u') {
        isUnderline = !isClosingTag;
      }
      
      currentText = currentText.substring(tag.length);
      continue;
    }
    
    // Regular character
    const char = currentText[0];
    if (segments.length === 0 || 
        segments[segments.length - 1].isFootnote || 
        segments[segments.length - 1].isAnchor ||
        segments[segments.length - 1].isItalic !== isItalic ||
        segments[segments.length - 1].isBold !== isBold ||
        segments[segments.length - 1].isUnderline !== isUnderline) {
      // Start a new segment
      segments.push({
        text: char,
        isItalic,
        isBold,
        isUnderline,
        isFootnote: false,
        isAnchor: false
      });
    } else {
      // Add to current segment
      segments[segments.length - 1].text += char;
    }
    currentText = currentText.substring(1);
  }
  
  return segments;
};
