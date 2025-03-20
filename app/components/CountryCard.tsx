// app/components/CountryCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CountryCard = ({ country, onPress, onToggleFavorite, isFavorite }) => {
  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <Image source={{ uri: country.image }} style={styles.featuredImage} />
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{country.name}</Text>
        <Text style={styles.featuredDescription}>{country.climate}</Text>
        <TouchableOpacity style={styles.favoriteIcon} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#ef4444' : '#64748b'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
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
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0f172a',
  },
  featuredDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default CountryCard;