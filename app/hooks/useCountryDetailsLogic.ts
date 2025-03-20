// hooks/useCountryDetailsLogic.ts
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getItem, setItem, getCache, setCache } from '../../services/storage';

export const useCountryDetailsLogic = (id: string) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchCountryDetails();
      await checkIfFavorite();
    };
    init();
  }, [id]);

  const fetchCountryDetails = async () => {
    try {
      // Vérifier si les données sont en cache
      const cachedData = await getCache(`country_${id}`);
      if (cachedData) {
        setCountry(cachedData);
        setLoading(false);
        return;
      }

      // Si aucune donnée en cache, faire un appel réseau
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select(`
          *,
          entry_requirements(*),
          vaccines(*),
          customs_restrictions(*),
          estimated_budget(*),
          real_time_alerts(*),
          emergency_contacts(*),
          currency(*),
          payment_methods(*),
          languages_spoken(*),
          dominant_religions(*),
          local_laws_customs(*),
          survival_phrasebook(*),
          sim_esim(*)
        `)
        .eq('id', id)
        .single();

      if (countryError) throw countryError;

      // Mettre en cache les données récupérées
      await setCache(`country_${id}`, countryData);
      setCountry(countryData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favorites = await getItem('favorites');
      const parsedFavorites = favorites ? JSON.parse(favorites) : [];
      setIsFavorite(parsedFavorites.includes(id));
    } catch (error) {
      console.error('Failed to check favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await getItem('favorites');
      const parsedFavorites = favorites ? JSON.parse(favorites) : [];
      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = parsedFavorites.filter((favId) => favId !== id);
      } else {
        updatedFavorites = [...parsedFavorites, id];
      }

      await setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return {
    country,
    loading,
    error,
    isFavorite,
    toggleFavorite,
  };
};