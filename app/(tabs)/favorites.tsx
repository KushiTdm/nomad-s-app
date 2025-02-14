import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_FAVORITES = [
  {
    id: '1',
    country: 'Japan',
    city: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
    isFavorite: true,
  },
  {
    id: '2',
    country: 'France',
    city: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
    isFavorite: true,
  },
  {
    id: '3',
    country: 'Italy',
    city: 'Rome',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format&fit=crop',
    isFavorite: true,
  },
];

const FavoriteItem = ({ item }) => (
  <TouchableOpacity style={styles.favoriteItem}>
    <Image source={{ uri: item.image }} style={styles.favoriteImage} />
    <View style={styles.favoriteContent}>
      <View>
        <Text style={styles.favoriteCity}>{item.city}</Text>
        <Text style={styles.favoriteCountry}>{item.country}</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color="#ef4444"
        />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_FAVORITES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FavoriteItem item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
  },
  favoriteItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  favoriteImage: {
    width: '100%',
    height: 200,
  },
  favoriteContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteCity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  favoriteCountry: {
    fontSize: 14,
    color: '#64748b',
  },
  favoriteButton: {
    padding: 8,
  },
});