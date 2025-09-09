import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BOOK_NAMES } from '@/constants/bibleData';
import { COLORS } from '@/constants/styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getVersesForChapter, parseTextWithHTML, searchVersesByKeyword } from '@/utils/bibleUtils';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const headerFooterColor = useThemeColor({}, 'headerFooter');
  const searchButtonColor = useThemeColor({}, 'searchButton');
  const bookButtonColor = useThemeColor({}, 'bookButton');

  // State for single choice selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>('address'); // Default to first option
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for search results modal
  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchErrors, setSearchErrors] = useState<string[]>([]);
  
  // State for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchCategories = [
    {
      label: 'Tìm theo địa chỉ',
      value: 'address'  
    },
    {
      label: 'Tìm theo từ khóa',
      value: 'keyword'
    }
  ];

  // Load recent searches from storage on component mount
  React.useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      // For now, we'll use a simple in-memory storage
      // In a real app, you'd use AsyncStorage or similar
      setRecentSearches([]);
    } catch (error) {
      console.log('Error loading recent searches:', error);
    }
  };

  // Add search to recent searches
  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== searchTerm);
      // Add to beginning and limit to 10 items
      return [searchTerm, ...filtered].slice(0, 10);
    });
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // Trigger search automatically
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Handle single choice selection
  const selectCategory = (value: string) => {
    setSelectedCategory(selectedCategory === value ? null : value);
  };

  // Navigate to specific book and chapter
  const navigateToVerse = (bookCode: string, chapter: number, verse: number) => {
    // Close modal first
    setModalVisible(false);
    
    // Navigate to the home tab (index) with parameters
    router.push({
      pathname: '/(tabs)',
      params: {
        book: bookCode,
        chapter: chapter.toString(),
        verse: verse.toString()
      }
    });
  };

  // Parse Bible address references
  const parseBibleAddress = (addressString: string) => {
    // Split by semicolon to get multiple references
    const references = addressString.split(';').map(ref => ref.trim()).filter(ref => ref);
    
    const parsedReferences = references.map(ref => {
      // Match pattern like "Mat. 1:1" or "Gi. 1:1"
      const match = ref.match(/^([A-Za-z]+\.?)\s+(\d+):(\d+)$/);
      if (match) {
        const [, bookCode, chapter, verse] = match;
        const cleanBookCode = bookCode.replace('.', ''); // Remove trailing dot
        
        // Validate book code exists in our Bible data
        const bookExists = BOOK_NAMES.some(book => book.code === cleanBookCode);
        
        if (bookExists) {
          return {
            bookCode: cleanBookCode,
            chapter: parseInt(chapter, 10),
            verse: parseInt(verse, 10),
            original: ref,
            isValid: true
          };
        } else {
          return {
            bookCode: cleanBookCode,
            chapter: parseInt(chapter, 10),
            verse: parseInt(verse, 10),
            original: ref,
            isValid: false,
            error: `Không tìm thấy sách "${cleanBookCode}"`
          };
        }
      }
      return {
        original: ref,
        isValid: false,
        error: "Sai định dạng. Sử dụng: Sách. Chương:Câu"
      };
    });
    
    return parsedReferences;
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() && selectedCategory !== null) {
      // Add to recent searches
      addToRecentSearches(searchQuery.trim());
      
      if (selectedCategory === 'address') {
        const parsedAddresses = parseBibleAddress(searchQuery);
        
        const validReferences = parsedAddresses.filter(ref => ref.isValid);
        const invalidReferences = parsedAddresses.filter(ref => !ref.isValid);
        
        // Fetch verse content for valid references
        const resultsWithContent = validReferences.map(ref => {
          try {
            const verses = getVersesForChapter(ref.bookCode || '', ref.chapter || 1);
            let verseContent = '';
            if (ref.verse) {
              verseContent = verses[ref.verse - 1]
            } else {
              verseContent = 'Không tìm thấy';
            }
            const bookName = BOOK_NAMES.find(book => book.code === ref.bookCode)?.name || ref.bookCode;
            
            return {
              ...ref,
              bookName,
              verseContent,
              fullReference: `${ref.bookCode} ${ref.chapter}:${ref.verse}`
            };
          } catch (error) {
            return {
              ...ref,
              bookName: ref.bookCode,
              verseContent: 'Không tìm thấy',
              fullReference: `${ref.bookCode} ${ref.chapter}:${ref.verse}`,
              isValid: false,
              error: 'Không tìm thấy chương hoặc câu'
            };
          }
        });
        
        // Separate valid results from those that failed to load
        const validResults = resultsWithContent.filter(ref => ref.isValid);
        const failedResults = resultsWithContent.filter(ref => !ref.isValid);
        
        // Set results and errors
        setSearchResults(validResults);
        setSearchErrors([
          ...invalidReferences.map(ref => `${ref.original}: ${ref.error}`),
          ...failedResults.map(ref => `${ref.original}: ${ref.error}`)
        ]);
        
        // Show modal with results
        setModalVisible(true);
      } else if (selectedCategory === 'keyword') {
        // Perform keyword search
        const keywordResults = searchVersesByKeyword(searchQuery.trim());
        
        if (keywordResults.length > 0) {
          setSearchResults(keywordResults);
          setSearchErrors([]);
        } else {
          setSearchResults([]);
          setSearchErrors([`Không tìm thấy kết quả nào cho từ khóa "${searchQuery.trim()}"`]);
        }
        
        // Show modal with results
        setModalVisible(true);
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ 
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 100 : 0 // Account for iOS tab bar height
      }}
    >
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: headerFooterColor }]}>
      </ThemedView>

      {/* Search Input */}
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchInputContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedCategory === 'address' ? "Ví dụ: Mat. 1:1; Gi. 1:1" : "Nhập từ khóa tìm kiếm..."}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
        <TouchableOpacity 
          style={[
            styles.searchButton, 
            { 
              backgroundColor: searchButtonColor,
              opacity: (searchQuery.trim() && selectedCategory !== null) ? 1 : 0.5
            }
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || selectedCategory === null}
        >
          <IconSymbol name="magnifyingglass" size={20} color="#5A4A3A" />
        </TouchableOpacity>
      </ThemedView>

      {/* Search Categories */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Tìm kiếm theo</ThemedText>
        <ThemedView style={styles.categoriesGrid}>
          {searchCategories.map((category) => {
            const isSelected = selectedCategory === category.value;
            return (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  { 
                    backgroundColor: isSelected ? '#5A4A3A' : '#eee',
                    opacity: isSelected ? 1 : 0.7,
                    borderColor: isSelected ? '#5A4A3A' : '#E0D5C7'
                  }
                ]}
                onPress={() => selectCategory(category.value)}
              >
                <ThemedText style={[
                  styles.categoryText,
                  { 
                    fontWeight: isSelected ? 'bold' : 'normal',
                    color: isSelected ? '#fff' : '#5A4A3A'
                  }
                ]}>
                  {category.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ThemedView>
      </ThemedView>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Tìm kiếm gần đây</ThemedText>
            <TouchableOpacity 
              onPress={clearRecentSearches}
              style={styles.clearRecentButton}
            >
              <Fontisto name="trash" size={16} color="#5A4A3A" />            
            </TouchableOpacity>   
          </View>
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchSelect(search)}
            >
              <IconSymbol name="clock" size={16} color="#666" />
              <ThemedText style={styles.recentSearchText}>{search}</ThemedText>
              <IconSymbol name="chevron.right" size={14} color="#999" />
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}

      {/* Quick Access */}
      {/* <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Truy cập nhanh</ThemedText>
        <ThemedView style={styles.quickAccessGrid}>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="bookmark.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Đánh dấu</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="clock.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Gần đây</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView> */}
      
      {/* Search Results Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Kết quả tìm kiếm</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <IconSymbol name="xmark" size={24} color="#5A4A3A" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {searchResults.length > 0 && (
                <View style={styles.resultsSection}>
                  <ThemedText style={styles.sectionTitle}>Kết quả tìm thấy</ThemedText>
                  {searchResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resultItem}
                    >
                      <View style={styles.resultContent}>
                        <View style={styles.resultHeader}>
                          <IconSymbol name="book" size={20} color="#5A4A3A" />
                          <ThemedText style={styles.resultReference}>
                            {result.fullReference}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.verseContent} numberOfLines={3}>
                          {parseTextWithHTML(result.content || result.verseContent || '').map((segment, index) => (
                            <ThemedText key={index}>{segment.text}</ThemedText>
                          ))}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {searchErrors.length > 0 && (
                <View style={styles.errorsSection}>
                  <ThemedText style={styles.sectionTitle}>Không tìm thấy</ThemedText>
                  {searchErrors.map((error, index) => (
                    <View key={index} style={styles.errorItem}>
                      <IconSymbol name="exclamationmark.triangle" size={20} color="#ff6b6b" />
                      <ThemedText style={styles.errorText}>
                        {error}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
              
              {searchResults.length === 0 && searchErrors.length === 0 && (
                <View style={styles.noResultsSection}>
                  <IconSymbol name="magnifyingglass" size={48} color="#ccc" />
                  <ThemedText style={styles.noResultsText}>
                    Không tìm thấy kết quả nào
                  </ThemedText>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.background,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#5A4A3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  clearRecentButton: {
    padding: 5
  },
  clearRecentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  categoryText: {
    color: '#5A4A3A',
    fontSize: 14,
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  recentSearchText: {
    flex: 1,
    color: '#5A4A3A',
    fontSize: 14,
    marginLeft: 10,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickAccessButton: {
    width: '45%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E0D5C7',
  },
  quickAccessText: {
    color: '#5A4A3A',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A4A3A',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsSection: {
    marginTop: 15,
  },
  errorsSection: {
    marginTop: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultReference: {
    fontSize: 16,
    color: '#5A4A3A',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  verseContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#ff6b6b',
  },
  noResultsSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});