import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCountries } from '../../services/supabaseService';

const categories = [
  { id: 'visa-free', label: 'Visa-Free' },
  { id: 'budget', label: 'Budget' },
  { id: 'safe', label: 'Safe' },
  { id: 'beach', label: 'Beach' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'culture', label: 'Culture' },
  { id: 'health', label: 'Health' },
  { id: 'payment-methods', label: 'Payment Methods' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      console.log('Fetched countries with entry requirements:', data);
      setCountries(data);
      setFilteredCountries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryPress = (countryId) => {
    router.push(`/(details)/${countryId}`);
  };

  const filterCountries = (categoryId) => {
    setActiveFilter(categoryId);

    switch (categoryId) {
      case 'visa-free':
        setFilteredCountries(countries.filter(country => 
          country.entry_requirements?.some(req => req.visa_required === false)
        ));
        break;
      case 'budget':
        setFilteredCountries(countries.filter(country => {
          const budget = country.estimated_budget?.[0];
          return (
            budget?.accommodation === 'Low' ||
            budget?.transport === 'Low' ||
            budget?.meals === 'Low'
          );
        }));
        break;
      case 'safe':
        setFilteredCountries(countries.filter(country => {
          const alerts = country.real_time_alerts?.[0];
          return (
            alerts?.political_risks === 'Low' &&
            alerts?.health_risks === 'Low'
          );
        }));
        break;
      case 'beach':
        setFilteredCountries(countries.filter(country => country.climate === 'Tropical'));
        break;
      case 'mountains':
        setFilteredCountries(countries.filter(country => country.climate === 'Mountainous'));
        break;
      case 'culture':
        setFilteredCountries(countries.filter(country => 
          country.local_laws_customs?.[0]?.main_rules?.includes('Cultural')
        ));
        break;
      case 'health':
        setFilteredCountries(countries.filter(country => 
          country.vaccines?.some(vaccine => vaccine.type === 'mandatory')
        ));
        break;
      case 'payment-methods':
        setFilteredCountries(countries.filter(country => 
          country.payment_methods?.credit_card === true ||
          country.payment_methods?.apple_pay === true
        ));
        break;
      default:
        setFilteredCountries(countries);
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sectionTitle}>Featured Destinations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredContainer}>
        {filteredCountries.map((country) => (
          <TouchableOpacity
            key={country.id}
            style={styles.featuredCard}
            onPress={() => handleCountryPress(country.id)}>
            <Image
              source={{ uri: country.image }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>{country.name}</Text>
              <Text style={styles.featuredDescription}>
                {country.climate}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              activeFilter === category.id && styles.activeCategoryCard,
            ]}
            onPress={() => filterCountries(category.id)}>
            <Text style={[
              styles.categoryText,
              activeFilter === category.id && styles.activeCategoryText,
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    minWidth: '30%',
    alignItems: 'center',
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
  activeCategoryCard: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  activeCategoryText: {
    color: '#fff',
  },
});