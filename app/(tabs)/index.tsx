import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Types
interface Book {
  code: string;
  name: string;
}

interface BookDetail {
  author: string;
  time: string;
  place: string;
  recipients: string;
  theme: string;
}

interface Footnote {
  id: string;
  text: string;
}

// Constants
const CHAPTER_COUNTS: { [key: string]: number } = {
  'Mat.': 28, 'Mác': 16, 'Lu.': 24, 'Gi.': 21, 'Công.': 28, 'La.': 16,
  '1 Cô.': 16, '2 Cô.': 13, 'Ga.': 6, 'Êph.': 6, 'Phil.': 4, 'Côl.': 4,
  '1 Tê.': 5, '2 Tê.': 3, '1 TL': 6, '2 TL': 4, 'Tít': 3, 'Philm.': 1,
  'Hê.': 13, 'Gia.': 5, '1 Phi.': 5, '2 Phi.': 3, '1 Gi.': 5, '2 Gi.': 1,
  '3 Gi.': 1, 'Giu.': 1, 'Khải.': 22
};

const BOOK_DETAILS: { [key: string]: BookDetail } = {
  'Mat.': {
    author: 'Ma-thi-ơ, cũng gọi là Lê-vi, trước đây là một người thu thuế, về sau là một sứ đồ (9:9; Lu. 5:27)',
    time: 'Khoảng năm 37-40 S.C., không lâu sau khi Chúa phục sinh (28:15) và trước khi đền thờ bị hủy phá (24:2)',
    place: 'Có lẽ là xứ Giu-đê',
    recipients: 'Người Do Thái nói chung',
    theme: 'Phúc âm vương quốc – Chứng minh rằng Jesus Christ là Đấng cứu rỗi – Nhà vua'
  },
  'Mác': {
    author: 'Mác, cũng gọi là Giăng Mác, con của Ma-ri (Công. 12:12)',
    time: 'Khoảng năm 50-60 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Người La Mã và dân ngoại',
    theme: 'Phúc âm của Chúa Jesus Christ, Con Đức Chúa Trời'
  },
  'Lu.': {
    author: 'Lu-ca, bác sĩ yêu dấu (Côl. 4:14)',
    time: 'Khoảng năm 60-61 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Thê-ô-phi-lơ và tất cả các tín đồ',
    theme: 'Phúc âm của sự cứu rỗi cho tất cả mọi người'
  },
  'Gi.': {
    author: 'Giăng, sứ đồ yêu dấu của Chúa Jesus',
    time: 'Khoảng năm 85-90 S.C.',
    place: 'Có lẽ là Ê-phê-sô',
    recipients: 'Tất cả các tín đồ',
    theme: 'Phúc âm của sự sống đời đời'
  },
  'Công.': {
    author: 'Lu-ca, tác giả của sách Lu-ca',
    time: 'Khoảng năm 61-63 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Thê-ô-phi-lơ',
    theme: 'Lịch sử của Hội thánh ban đầu'
  },
  'La.': {
    author: 'Phao-lô, sứ đồ của Chúa Jesus Christ',
    time: 'Khoảng năm 57-58 S.C.',
    place: 'Cô-rinh-tô',
    recipients: 'Tất cả các tín đồ ở Rô-ma',
    theme: 'Phúc âm của sự công bình của Đức Chúa Trời'
  }
};

const FOOTNOTES_DATA: { [key: string]: { [key: number]: { [key: number]: Footnote[] } } } = {
  'Mat.': {
    1: {
      1: [
        { id: '1', text: "Gia phổ: Bản ghi chép về dòng dõi tổ tiên, thường được dùng để chứng minh quyền thừa kế hoặc danh phận." },
        { id: '2', text: "Jesus Christ: Jesus là tên riêng, có nghĩa là 'Đức Giê-hô-va là sự cứu rỗi'. Christ là tước hiệu, có nghĩa là 'Đấng được xức dầu' hoặc 'Đấng Mê-si'." },
        { id: '3', text: "Đa-vít: Vua thứ hai của Y-sơ-ra-ên, được gọi là 'người theo lòng Đức Chúa Trời'. Chúa Jesus là con cháu của Đa-vít theo huyết thống." },
        { id: '4', text: "Áp-ra-ham: Tổ phụ của dân Y-sơ-ra-ên, được gọi là 'bạn của Đức Chúa Trời'. Chúa Jesus là con cháu của Áp-ra-ham theo lời hứa." },
        { id: 'a', text: "Con cháu: Chỉ về dòng dõi huyết thống, thể hiện sự liên tục của gia phả từ thế hệ này sang thế hệ khác." },
        { id: 'b', text: "Huyết thống: Mối liên hệ gia đình qua dòng máu, quan trọng trong việc xác định quyền thừa kế và danh phận." },
        { id: 'c', text: "Lời hứa: Đức Chúa Trời đã hứa với Áp-ra-ham rằng qua dòng dõi người, tất cả các dân tộc sẽ được phước." },
        { id: 'd', text: "Vương quốc: Chúa Jesus sẽ cai trị vương quốc đời đời, thực hiện lời hứa về Đấng Mê-si đến từ dòng dõi Đa-vít." }
      ]
    }
  }
};

const VERSE_DATA: { [key: string]: { [key: number]: string[] } } = {
  'Mat.': {
    1: [
      "Gia phổ[1] của Jesus Christ[2], con cháu[a] Đa-vít[3], con cháu Áp-ra-ham[4]",
      "Áp-ra-ham sinh Y-sác; Y-sác sinh Gia-cốp; Gia-cốp sinh Giu-đa và các anh em người;",
      "Giu-đa sinh Pha-rê và Xa-ra bởi Ta-ma; Pha-rê sinh Hết-rôm; Hết-rôm sinh A-ram;",
      "A-ram sinh A-mi-na-đáp; A-mi-na-đáp sinh Na-ách-son; Na-ách-son sinh Sanh-môn;",
      "Sanh-môn sinh Bô-ô bởi Ra-háp; Bô-ô sinh Ô-bết bởi Ru-tơ; Ô-bết sinh Y-sai;"
    ],
    2: [
      "Bấy giờ, sau khi Jesus được sinh ra tại Bết-lê-hem thuộc Giu-đê trong đời vua Hê-rốt, kia, các nhà chiêm tình từ phương Đông đến Giê-ru-sa-lem,",
      "nói rằng: \"Đấng đã được sinh ra làm Vua dân Do Thái ở đâu? Bởi lẽ, chúng tôi đã thấy ngôi sao Ngài mọc lên nên đến để thờ phượng Ngài.\"",
      "Khi vua Hê-rốt nghe điều đó thì bối rối, và cả thành Giê-ru-sa-lem cũng vậy.",
      "Vua bèn nhóm hết thảy các thầy tế lễ cả và các thầy thông giáo trong dân lại, mà tra hỏi họ rằng Đấng Christ phải sinh ra tại đâu.",
      "Tâu rằng: \"Tại Bết-lê-hem, xứ Giu-đê, vì có lời tiên tri chép rằng:",
      "Còn ngươi, hỡi Bết-lê-hem, đất Giu-đa! Thật ngươi chẳng phải là kém gì trong các thành lớn của Giu-đa đâu, vì từ nơi ngươi sẽ ra một tướng, là Đấng chăn dân Y-sơ-ra-ên của ta.\""
    ],
    3: [
      "Lúc ấy, Giăng Báp-tít đến giảng trong đồng vắng xứ Giu-đê,",
      "rằng: \"Hãy ăn năn, vì nước thiên đàng đã đến gần!\"",
      "Vì đây là người mà Đấng tiên tri Ê-sai đã nói rằng: Có tiếng kêu trong đồng vắng: Hãy dọn đường Chúa, Ban bằng các nẻo Ngài.",
      "Giăng mặc áo bằng lông lạc đà, thắt lưng bằng da, ăn châu chấu và mật ong rừng.",
      "Bấy giờ, dân thành Giê-ru-sa-lem, cả xứ Giu-đê, và cả miền chung quanh sông Giô-đanh đều đến cùng người,"
    ]
  }
};

const BOOK_NAMES: Book[] = [
  { code: "Mat.", name: "Ma-thi-ơ" },
  { code: "Mác", name: "Mác" },
  { code: "Lu.", name: "Lu-ca" },
  { code: "Gi.", name: "Giăng" },
  { code: "Công.", name: "Công vụ các Sứ đồ" },
  { code: "La.", name: "La Mã" },
  { code: "1 Cô.", name: "1 Cô-rin-tô" },
  { code: "2 Cô.", name: "2 Cô-rin-tô" },
  { code: "Ga.", name: "Ga-la-ti" },
  { code: "Êph.", name: "Ê-phê-sô" },
  { code: "Phil.", name: "Phi-líp" },
  { code: "Côl.", name: "Cô-lô-se" },
  { code: "1 Tê.", name: "1 Tê-sa-lô-ni-ca" },
  { code: "2 Tê.", name: "2 Tê-sa-lô-ni-ca" },
  { code: "1 TL", name: "1 Ti-mô-thê" },
  { code: "2 TL", name: "2 Ti-mô-thê" },
  { code: "Tít", name: "Tít" },
  { code: "Philm.", name: "Phi-lê-môn" },
  { code: "Hê.", name: "Hê-bơ-rơ" },
  { code: "Gia.", name: "Gia-cơ" },
  { code: "1 Phi.", name: "1 Phi-e-rơ" },
  { code: "2 Phi.", name: "2 Phi-e-rơ" },
  { code: "1 Gi.", name: "1 Giăng" },
  { code: "2 Gi.", name: "2 Giăng" },
  { code: "3 Gi.", name: "3 Giăng" },
  { code: "Giu.", name: "Giu-đe" },
  { code: "Khải.", name: "Khải Thị" }
];

// Utility functions
const getChaptersForBook = (bookCode: string): number[] => {
  const totalChapters = CHAPTER_COUNTS[bookCode] || 1;
  return Array.from({ length: totalChapters }, (_, i) => i + 1);
};

const getVersesForChapter = (bookCode: string, chapter: number): string[] => {
  return VERSE_DATA[bookCode]?.[chapter] || [
    "Đây là câu đầu tiên của chương này.",
    "Đây là câu thứ hai của chương này.",
    "Đây là câu thứ ba của chương này.",
    "Đây là câu thứ tư của chương này.",
    "Đây là câu thứ năm của chương này."
  ];
};

const getBookDetail = (bookCode: string): BookDetail => {
  return BOOK_DETAILS[bookCode] || {
    author: 'Không rõ tác giả',
    time: 'Không rõ thời gian',
    place: 'Không rõ nơi viết',
    recipients: 'Tất cả các tín đồ',
    theme: 'Phúc âm của Chúa Jesus Christ'
  };
};

const getFootnotesForVerse = (bookCode: string, chapter: number, verse: number): Footnote[] => {
  return FOOTNOTES_DATA[bookCode]?.[chapter]?.[verse] || [];
};

const parseVerseWithFootnotes = (verseText: string, verseNumber: number, onFootnotePress: (footnoteId: string, verseNumber: number) => void) => {
  // Split text by footnote patterns like [1], [2], [a], [1a], [*], etc.
  const parts = verseText.split(/(\[[^\]]+\])/);
  
  return parts.map((part, index) => {
    // Match any string that starts with [ and ends with ]
    const footnoteMatch = part.match(/^\[([^\]]+)\]$/);
    if (footnoteMatch) {
      const footnoteId = footnoteMatch[1];
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onFootnotePress(footnoteId, verseNumber)}
          style={styles.superscriptContainer}
        >
          <ThemedText style={styles.superscriptText}>[{footnoteId}]</ThemedText>
        </TouchableOpacity>
      );
    }
    return <ThemedText key={index} style={styles.verseText}>{part}</ThemedText>;
  });
};

// Components
const FootnoteModal = ({ 
  visible, 
  footnotes, 
  verseNumber,
  bookCode,
  chapter,
  selectedFootnoteId,
  onClose,
  onFootnoteSelect
}: { 
  visible: boolean; 
  footnotes: Footnote[]; 
  verseNumber: number;
  bookCode: string;
  chapter: number;
  selectedFootnoteId: string | null;
  onClose: () => void;
  onFootnoteSelect: (footnoteId: string) => void;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (visible && selectedFootnoteId && footnotes.length > 0) {
      // Find the index of the selected footnote
      const footnoteIndex = footnotes.findIndex(f => f.id === selectedFootnoteId);
      
      if (footnoteIndex !== -1) {
        // Scroll to the selected footnote after a short delay to ensure modal is rendered
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: footnoteIndex * 120, // More accurate height per footnote item including margins
            animated: true
          });
        }, 200);
      }
    }
  }, [visible, selectedFootnoteId, footnotes]);
  
  if (footnotes.length === 0) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContentBottom} onPress={(e: any) => e.stopPropagation()}>
          <View style={styles.modalDragIndicator} />
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Chú thích {bookCode} {chapter}:{verseNumber}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color="#5A4A3A" />
            </TouchableOpacity>
          </View>
          <ScrollView ref={scrollViewRef} style={styles.modalScrollView}>
            {footnotes.map((footnote) => {
              const isSelected = footnote.id === selectedFootnoteId;
              
              return (
                <TouchableOpacity
                  key={footnote.id}
                  onPress={() => onFootnoteSelect(footnote.id)}
                  style={[
                    styles.modalFootnoteItem,
                    isSelected && styles.modalFootnoteItemSelected
                  ]}
                >
                  <ThemedText style={[
                    styles.modalFootnoteNumber,
                    isSelected && styles.modalFootnoteNumberSelected
                  ]}>[{footnote.id}]</ThemedText>
                  <ThemedText style={[
                    styles.modalFootnoteText,
                    isSelected && styles.modalFootnoteTextSelected
                  ]}>{footnote.text}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const BookGrid = ({ books, onBookSelect, bookButtonColor }: {
  books: Book[];
  onBookSelect: (book: Book) => void;
  bookButtonColor: string;
}) => {
  const groupedBooks = books.reduce((rows: Book[][], book: Book, index: number) => {
    const rowIndex = Math.floor(index / 3);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push(book);
    return rows;
  }, []);

  return (
    <View style={styles.booksGrid}>
      {groupedBooks.map((row: Book[], rowIndex: number) => (
        <View key={rowIndex} style={styles.bookRow}>
          {row.map((book: Book) => (
            <TouchableOpacity
              key={book.code}
              style={[styles.bookButton, { backgroundColor: bookButtonColor }]}
              onPress={() => onBookSelect(book)}
            >
              <ThemedText style={styles.bookButtonText}>{book.code}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const BookInfo = ({ bookCode }: { bookCode: string }) => {
  const detail = getBookDetail(bookCode);
  
  return (
    <View style={styles.bookInfoContainer}>
      <View style={styles.infoItem}>
        <IconSymbol name="person.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Tác giả:</ThemedText> {detail.author}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="clock.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Thời gian viết:</ThemedText> {detail.time}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="location.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Nơi viết:</ThemedText> {detail.place}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="person.2.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Người nhận:</ThemedText> {detail.recipients}
        </ThemedText>
      </View>
      <View style={styles.infoItem}>
        <IconSymbol name="lightbulb.fill" size={16} color="#5A4A3A" style={styles.infoIcon} />
        <ThemedText style={styles.bookInfoText}>
          <ThemedText style={styles.infoLabel}>Chủ đề:</ThemedText> {detail.theme}
        </ThemedText>
      </View>
    </View>
  );
};

const ChapterGrid = ({ bookCode, onChapterSelect, bookButtonColor }: {
  bookCode: string;
  onChapterSelect: (chapter: number) => void;
  bookButtonColor: string;
}) => {
  const chapters = getChaptersForBook(bookCode);
  
  return (
    <View style={styles.chapterSection}>
      <ThemedText style={styles.chapterSectionTitle}>CÁC CHƯƠNG</ThemedText>
      <View style={styles.chapterGrid}>
        {chapters.map((chapter: number) => (
          <TouchableOpacity
            key={chapter}
            style={[styles.chapterButton, { backgroundColor: bookButtonColor }]}
            onPress={() => onChapterSelect(chapter)}
          >
            <ThemedText style={styles.chapterButtonText}>{chapter}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const VerseDisplay = ({ book, chapter, onBackToChapters }: {
  book: Book;
  chapter: number;
  onBackToChapters: () => void;
}) => {
  const verses = getVersesForChapter(book.code, chapter);
  const [selectedFootnotes, setSelectedFootnotes] = useState<Footnote[]>([]);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(0);
  const [selectedFootnoteId, setSelectedFootnoteId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleFootnotePress = (footnoteId: string, verseNumber: number) => {
    const footnotes = getFootnotesForVerse(book.code, chapter, verseNumber);
    if (footnotes.length > 0) {
      setSelectedFootnotes(footnotes);
      setSelectedVerseNumber(verseNumber);
      setSelectedFootnoteId(footnoteId);
      setModalVisible(true);
    }
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedFootnotes([]);
    setSelectedVerseNumber(0);
    setSelectedFootnoteId(null);
  };
  
  const handleFootnoteSelect = (footnoteId: string) => {
    setSelectedFootnoteId(footnoteId);
  };
  
  return (
    <View style={styles.verseDisplayContainer}>
      <View style={styles.chapterHeader}>
        <ThemedText style={styles.chapterTitle}>
          Chương {chapter}
        </ThemedText>
        <TouchableOpacity 
          style={styles.backToChaptersButton}
          onPress={onBackToChapters}
        >
          <IconSymbol name="arrow.left" size={20} color="#5A4A3A" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.versesScrollView}>
        {verses.map((verse: string, index: number) => {
          const verseNumber = index + 1;          
          return (
            <View key={index} style={styles.verseItem}>
              <ThemedText style={styles.verseLabel}>
                {book.code} {chapter}:{verseNumber}
              </ThemedText>
              <View style={styles.verseTextContainer}>
                {parseVerseWithFootnotes(verse, verseNumber, handleFootnotePress)}
              </View>
            </View>
          );
        })}
      </ScrollView>
      
      <FootnoteModal 
        visible={modalVisible}
        footnotes={selectedFootnotes}
        verseNumber={selectedVerseNumber}
        bookCode={book.code}
        chapter={chapter}
        selectedFootnoteId={selectedFootnoteId}
        onClose={closeModal}
        onFootnoteSelect={handleFootnoteSelect}
      />
    </View>
  );
};

// Main Component
export default function HomeScreen() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  
  const headerFooterColor = useThemeColor({}, 'headerFooter');
  const searchButtonColor = useThemeColor({}, 'searchButton');
  const bookButtonColor = useThemeColor({}, 'bookButton');

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: headerFooterColor }]}>
        <ThemedText style={styles.headerText}>KINH THÁNH BẢN KHÔI PHỤC</ThemedText>
        <ThemedText style={styles.headerText}>Bản văn</ThemedText>
      </ThemedView>

      {/* Main Content */}
      <ThemedView style={styles.mainContent}>
        {/* Book Selection Grid - Only show when no book is selected */}
        {!selectedBook && (
          <BookGrid 
            books={BOOK_NAMES}
            onBookSelect={handleBookSelect}
            bookButtonColor={bookButtonColor}
          />
        )}

        {/* Book Detail View */}
        {selectedBook && (
          <ThemedView style={styles.bookDetailContainer}>
            {/* Book Header */}
            <View style={styles.bookHeader}>
              <TouchableOpacity 
                  style={styles.backButton}
                  onPress={handleBackToBooks}
                >
                  <IconSymbol name="menubar.rectangle" size={20} color="#5A4A3A" />
              </TouchableOpacity>
              <ThemedText style={styles.bookTitle}>{selectedBook.name.toUpperCase()}</ThemedText>
            </View>

            {/* Book Information - Only show when no chapter is selected */}
            {!selectedChapter && <BookInfo bookCode={selectedBook.code} />}

            {/* Chapter Grid - Only show when no chapter is selected */}
            {!selectedChapter && (
              <ChapterGrid 
                bookCode={selectedBook.code}
                onChapterSelect={handleChapterSelect}
                bookButtonColor={bookButtonColor}
              />
            )}

            {/* Verse Display - Show when chapter is selected */}
            {selectedChapter && (
              <VerseDisplay 
                book={selectedBook}
                chapter={selectedChapter}
                onBackToChapters={handleBackToChapters}
              />
            )}
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#5A4A3A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    height: '100%',
    padding: 0,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#000',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#5A4A3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  booksGrid: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  bookButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 45,
    maxWidth: 60,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#E0D5C7',
    flex: 1,
  },
  bookButtonText: {
    color: '#5A4A3A',
    fontSize: 14,
    fontWeight: '500',
  },
  // Book Detail View Styles
  bookDetailContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: '#FEFCF8',
  },
  bookHeader: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B8860B',
    textAlign: 'center',
  },
  bookInfoContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F8F4F0',
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  bookInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5A4A3A',
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  chapterSection: {
    marginBottom: 20,
  },
  chapterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A4A3A',
    textAlign: 'center',
    marginBottom: 15,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chapterButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  chapterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0E6D2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D5C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  // Verse Display Styles
  verseDisplayContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  versesScrollView: {
    flex: 1,
  },
  verseItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  verseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#5A4A3A',
    textAlign: 'justify',
  },
  // Chapter Header Styles
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A4A3A',
    flex: 1,
  },
  backToChaptersButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F0E6D2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0D5C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Footnotes Styles
  footnotesContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8F4F0',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#B8860B',
  },
  footnotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  footnoteItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  footnoteNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
    marginRight: 8,
    minWidth: 20,
  },
  footnoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5A4A3A',
    flex: 1,
  },
  // Superscript and Modal Styles
  verseTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  superscriptContainer: {
    marginHorizontal: 1,
    paddingVertical: 2,
    paddingHorizontal: 2,
    minHeight: 20,
    minWidth: 20,
    backgroundColor: 'rgba(184, 134, 11, 0.1)',
    borderRadius: 3,
  },
  superscriptText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FEFCF8',
    borderRadius: 12,
    padding: 20,
    maxWidth: '90%',
    width: 400,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  modalContentBottom: {
    backgroundColor: '#FEFCF8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: '85%',
    borderWidth: 1,
    borderColor: '#E0D5C7',
    borderBottomWidth: 0,
  },
  modalDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0D5C7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A4A3A',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5A4A3A',
    textAlign: 'justify',
  },
  modalScrollView: {
    flex: 1,
    paddingVertical: 10,
  },
  modalFootnoteItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  modalFootnoteNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B8860B',
    marginRight: 12,
    minWidth: 30,
  },
  modalFootnoteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5A4A3A',
    flex: 1,
  },
  // Selected footnote styles
  modalFootnoteItemSelected: {
    backgroundColor: '#E6F3FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalFootnoteNumberSelected: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
    minWidth: 32,
  },
  modalFootnoteTextSelected: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});