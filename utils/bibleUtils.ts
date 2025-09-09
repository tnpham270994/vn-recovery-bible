import { BOOK_DETAILS, BookDetail, CHAPTER_COUNTS, Footnote, FOOTNOTES_DATA, VERSE_DATA } from '@/constants/bibleData';

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
