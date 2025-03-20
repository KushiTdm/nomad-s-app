import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router'; // Importer le routeur
import { getItem, setItem } from '../../services/storage';


const FavoriteItem = ({ item, onToggleFavorite }) => (
  <TouchableOpacity
    style={styles.favoriteItem}
    onPress={() => router.push(`/(details)/${item.id}`)} // Naviguer vers la page des détails
  >
    <Image source={{ uri: item.image }} style={styles.favoriteImage} />
    <View style={styles.favoriteContent}>
      <View>
        <Text style={styles.favoriteCity}>{item.name}</Text>
        <Text style={styles.favoriteCountry}>{item.climate}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation(); // Empêcher la propagation du clic au parent
          onToggleFavorite(item.id);
        }}
      >
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
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const init = async () => {
    await loadFavorites(); // Charger les favoris de manière asynchrone
  };
  init();
}, []);

  const loadFavorites = async () => {
  try {
    const favoriteIds = await getItem('favorites');
    const parsedIds = favoriteIds ? JSON.parse(favoriteIds) : [];
    // Récupérer les détails des pays favoris depuis Supabase
    const { data: countries, error: fetchError } = await supabase
      .from('countries')
      .select('*')
      .in('id', parsedIds);

    if (fetchError) throw fetchError;

    const favoritesWithFlag = countries.map((country) => ({
      ...country,
      isFavorite: true,
    }));

    setFavorites(favoritesWithFlag);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

const toggleFavorite = async (countryId) => {
  try {
    const updatedFavorites = favorites.filter((fav) => fav.id !== countryId);
    await setItem('favorites', JSON.stringify(updatedFavorites.map((fav) => fav.id)));
    setFavorites(updatedFavorites);
  } catch (error) {
    console.error('Failed to update favorites:', error);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteItem item={item} onToggleFavorite={toggleFavorite} />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet. Start adding some!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});