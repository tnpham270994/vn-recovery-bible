import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f0',
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
  selectedBookText: {
    color: '#5A4A3A',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
