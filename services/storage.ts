// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';


// Fonction pour vérifier si on est sur le web
const isWeb = typeof window !== 'undefined' && window.localStorage;

// Fonction pour stocker des données
export const setItem = async (key: string, value: string) => {
  if (isWeb) {
    // Web : utiliser localStorage
    localStorage.setItem(key, value);
  } else {
    // Mobile : utiliser AsyncStorage
    await AsyncStorage.setItem(key, value);
  }
};

// Fonction pour récupérer des données
export const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    // Web : utiliser localStorage
    return localStorage.getItem(key);
  } else {
    // Mobile : utiliser AsyncStorage
    return await AsyncStorage.getItem(key);
  }
};

// Fonction pour supprimer des données
export const removeItem = async (key: string) => {
  if (isWeb) {
    // Web : utiliser localStorage
    localStorage.removeItem(key);
  } else {
    // Mobile : utiliser AsyncStorage
    await AsyncStorage.removeItem(key);
  }
};

// Utilisation du cache pour améliorer la scalabilité
const CACHE_KEY = 'country_cache';

// Fonction pour stocker les données en cache
export const setCache = async (key: string, data: any) => {
  try {
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    const cachedData = cache ? JSON.parse(cache) : {};
    cachedData[key] = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Failed to set cache:', error);
  }
};

// Fonction pour récupérer les données en cache
export const getCache = async (key: string) => {
  try {
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    if (cache) {
      const cachedData = JSON.parse(cache);
      if (cachedData[key] && Date.now() - cachedData[key].timestamp < 24 * 60 * 60 * 1000) {
        return cachedData[key].data; // Retourne les données si elles sont encore valides (24 heures)
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get cache:', error);
    return null;
  }
};

// Fonction pour effacer le cache
export const clearCache = async () => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};