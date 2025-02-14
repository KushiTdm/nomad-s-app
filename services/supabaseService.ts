import { supabase } from '../lib/supabase';

// Récupérer tous les pays
export const fetchCountries = async () => {
  const { data, error } = await supabase.from('countries').select('*');
  if (error) throw error;
    console.log('Fetched countries:', data); // Ajoutez cette ligne
  return data;
};

// Récupérer les exigences d'entrée pour un pays
export const fetchEntryRequirements = async (countryId: string) => {
  const { data, error } = await supabase
    .from('entry_requirements')
    .select('*')
    .eq('country_id', countryId);
  if (error) throw error;
  return data;
};

// Récupérer les vaccins pour un pays
export const fetchVaccines = async (countryId: string) => {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('country_id', countryId);
  if (error) throw error;
  return data;
};

// Ajouter d'autres fonctions pour les autres tables au besoin