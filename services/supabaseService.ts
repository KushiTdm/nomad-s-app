import { supabase } from '../lib/supabase';

// Récupérer tous les pays
export const fetchCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select(`
      *,
      entry_requirements (*),
      vaccines (*),
      customs_restrictions (*),
      estimated_budget (*),
      real_time_alerts (*),
      emergency_contacts (*),
      currency (*),
      payment_methods (*),
      languages_spoken (*),
      dominant_religions (*),
      local_laws_customs (*),
      survival_phrasebook (*),
      sim_esim (*)
    `);

  if (error) throw error;
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