import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function SearchScreen() {
  const headerFooterColor = useThemeColor({}, 'headerFooter');
  const searchButtonColor = useThemeColor({}, 'searchButton');
  const bookButtonColor = useThemeColor({}, 'bookButton');

  const searchCategories = [
    'Tìm theo sách',
    'Tìm theo chương',
    'Tìm theo câu',
    'Tìm theo từ khóa',
    'Tìm theo chủ đề',
    'Tìm theo tác giả'
  ];

  const recentSearches = [
    'Tình yêu thương',
    'Đức tin',
    'Hy vọng',
    'Cầu nguyện',
    'Sự tha thứ'
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: headerFooterColor }]}>
        <ThemedText style={styles.headerText}>TÌM KIẾM KINH THÁNH</ThemedText>
      </ThemedView>

      {/* Search Input */}
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchInputContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập từ khóa tìm kiếm..."
            placeholderTextColor="#666"
          />
        </ThemedView>
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: searchButtonColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color="#5A4A3A" />
        </TouchableOpacity>
      </ThemedView>

      {/* Search Categories */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Tìm kiếm theo</ThemedText>
        <ThemedView style={styles.categoriesGrid}>
          {searchCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, { backgroundColor: bookButtonColor }]}
            >
              <ThemedText style={styles.categoryText}>{category}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Recent Searches */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Tìm kiếm gần đây</ThemedText>
        {recentSearches.map((search, index) => (
          <TouchableOpacity key={index} style={styles.recentSearchItem}>
            <IconSymbol name="clock" size={16} color="#666" />
            <ThemedText style={styles.recentSearchText}>{search}</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Quick Access */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Truy cập nhanh</ThemedText>
        <ThemedView style={styles.quickAccessGrid}>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="book.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Sách mới nhất</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="star.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Yêu thích</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="bookmark.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Đánh dấu</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAccessButton, { backgroundColor: bookButtonColor }]}>
            <IconSymbol name="clock.fill" size={24} color="#000" />
            <ThemedText style={styles.quickAccessText}>Gần đây</ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A4A3A',
    marginBottom: 15,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  recentSearchText: {
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
});