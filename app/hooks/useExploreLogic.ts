import { useEffect, useState } from 'react';
import { fetchCountries } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { getItem, setItem } from '../../services/storage';
import { router } from 'expo-router';

export const useExploreLogic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const init = async () => {
      await loadCountries();
      await loadFavorites();
      await loadUserProfile();
    };
    init();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
      setFilteredCountries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await getItem('favorites');
      setFavorites(favorites ? JSON.parse(favorites) : []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (countryId) => {
    try {
      const updatedFavorites = favorites.includes(countryId)
        ? favorites.filter((id) => id !== countryId)
        : [...favorites, countryId];
      await setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      setUserProfile(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const incrementViewCount = async (countryId) => {
    try {
      const { data: existingStat, error: fetchError } = await supabase
        .from('statistics')
        .select('*')
        .eq('country_id', countryId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingStat) {
        const { error: updateError } = await supabase
          .from('statistics')
          .update({
            last_viewed: new Date().toISOString(),
            view_count: existingStat.view_count + 1,
          })
          .eq('country_id', countryId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('statistics')
          .insert([
            {
              country_id: countryId,
              last_viewed: new Date().toISOString(),
              view_count: 1,
            },
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleCountryPress = async (countryId) => {
    await incrementViewCount(countryId);
    router.push(`/(details)/${countryId}`);
  };

  const filterMostViewedCountries = async () => {
    try {
      const { data: stats, error: statsError } = await supabase
        .from('statistics')
        .select('country_id, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      if (statsError) throw statsError;

      const mostViewedCountryIds = stats.map((stat) => stat.country_id);
      const filtered = countries
        .filter((country) => mostViewedCountryIds.includes(country.id))
        .sort((a, b) => {
          const viewA = stats.find((stat) => stat.country_id === a.id)?.view_count || 0;
          const viewB = stats.find((stat) => stat.country_id === b.id)?.view_count || 0;
          return viewB - viewA;
        });

      setFilteredCountries(filtered);
    } catch (error) {
      console.error('Failed to filter most viewed countries:', error);
    }
  };

  const filterCountries = async (categoryId) => {
    if (activeFilter === categoryId) {
      setActiveFilter(null);
      setFilteredCountries(countries);
    } else {
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
            return budget?.cost_indicator <= 2;
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
        case 'for-you':
          if (userProfile) {
            const { frequent_destinations, travel_interests } = userProfile;
            const filtered = countries.filter(country => {
              const matchesDestination = frequent_destinations?.includes(country.id);
              const matchesInterest = travel_interests?.some(interest => 
                country.tags?.includes(interest)
              );
              return matchesDestination || matchesInterest;
            });
            setFilteredCountries(filtered);
          }
          break;
        case 'most-viewed':
            filterMostViewedCountries();
          break;
        default:
          setFilteredCountries(countries);
          break;
      }
    }
  };

const handleSearch = (query) => {
  setSearchQuery(query); // Met à jour l'état local
  const filtered = countries.filter(country =>
    country.name.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredCountries(filtered); // Met à jour les pays filtrés
};

  return {
    searchQuery,
    setSearchQuery,
    countries,
    filteredCountries,
    loading,
    error,
    activeFilter,
    favorites,
    userProfile,
    toggleFavorite,
    handleCountryPress,
    filterCountries,
    handleSearch,
  };
};