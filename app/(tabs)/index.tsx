import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useExploreLogic } from '../hooks/useExploreLogic';
import SearchBar from '../components/SearchBar';
import CountryCard from '../components/CountryCard';
import CategoryButton from '../components/CategoryButton';

const categories = [
  { id: 'visa-free', label: 'Visa-Free' },
  { id: 'budget', label: 'Budget' },
  { id: 'safe', label: 'Safe' },
  { id: 'beach', label: 'Beach' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'culture', label: 'Culture' },
  { id: 'health', label: 'Health' },
  { id: 'for-you', label: 'For You' },
  { id: 'most-viewed', label: 'Most Viewed' },
];

const ExploreScreen = () => {
  const {
    searchQuery,
    filteredCountries,
    loading,
    error,
    activeFilter,
    favorites,
    handleCountryPress,
    toggleFavorite,
    filterCountries,
    handleSearch, // Assurez-vous que handleSearch est bien extraite de useExploreLogic
  } = useExploreLogic();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} /> {/* Passez handleSearch ici */}

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sectionTitle}>Featured Destinations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            onPress={() => handleCountryPress(country.id)}
            onToggleFavorite={() => toggleFavorite(country.id)}
            isFavorite={favorites.includes(country.id)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            label={category.label}
            isActive={activeFilter === category.id}
            onPress={() => filterCountries(category.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

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
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    color: '#0f172a',
  },
  featuredContainer: {
    paddingLeft: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
});

export default ExploreScreen;