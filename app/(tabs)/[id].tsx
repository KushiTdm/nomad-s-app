import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function CountryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountryDetails();
  }, [id]);

  const fetchCountryDetails = async () => {
    try {
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
    console.log('Données récupérées :', countryData);

      
      setCountry(countryData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !country) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Country not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: country.image }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{country.name}</Text>
        
        <Section title="Entry Requirements">
  <Text style={styles.text}>
    Visa Required: {country.entry_requirements?.[0]?.visa_required ? 'Yes' : 'No' || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Visa Duration: {country.entry_requirements?.[0]?.visa_duration || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Visa Cost: {country.entry_requirements?.[0]?.visa_cost || 'N/A'}
  </Text>
  <Text style={styles.text}>
    E-Visa Available: {country.entry_requirements?.[0]?.e_visa_available ? 'Yes' : 'No' || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Exemptions: {country.entry_requirements?.[0]?.exemptions || 'N/A'}
  </Text>
</Section>

<Section title="Climate & Time">
  <Text style={styles.text}>
    Passport Validity: {country.passport_validity || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Climate: {country.climate || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Time Zone: {country.time_zone || 'N/A'}
  </Text>
</Section>

<Section title="Vaccines">
  {country.vaccines?.length > 0 ? (
    country.vaccines.map((vaccine, index) => (
      <Text key={index} style={styles.text}>
        {vaccine.type === 'mandatory' ? 'Mandatory' : 'Recommended'}: {vaccine.vaccine_name}
      </Text>
    ))
  ) : (
    <Text style={styles.text}>N/A</Text>
  )}
</Section>

<Section title="Customs Restrictions">
  <Text style={styles.text}>
    Prohibited Items: {country.customs_restrictions?.[0].prohibited_items?.join(', ') || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Specific Rules: {country.customs_restrictions?.[0]?.specific_rules || 'N/A'}
  </Text>
</Section>

<Section title="Estimated Budget">
  <Text style={styles.text}>
    Accommodation: {country.estimated_budget?.[0]?.accommodation || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Transport: {country.estimated_budget?.[0]?.transport || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Meals: {country.estimated_budget?.[0]?.meals || 'N/A'}
  </Text>
</Section>

<Section title="Real-Time Alerts">
  <Text style={styles.text}>
    Political Risks: {country.real_time_alerts?.[0]?.political_risks || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Health Risks: {country.real_time_alerts?.[0]?.health_risks || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Climate Risks: {country.real_time_alerts?.[0]?.climate_risks || 'N/A'}
  </Text>
</Section>

<Section title="Emergency Contacts">
  <Text style={styles.text}>
    Police: {country.emergency_contacts?.[0].police || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Ambulance: {country.emergency_contacts?.[0].ambulance || 'N/A'}
  </Text>
  <Text style={styles.text}>
    French Embassy Email: {country.emergency_contacts?.[0].french_embassy_email || 'N/A'}
  </Text>
</Section>

<Section title="Currency">
  <Text style={styles.text}>
    Local Currency: {country.currency?.[0].local_currency || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Exchange Rate: {country.currency?.[0].exchange_rate || 'N/A'}
  </Text>
</Section>

<Section title="Payment Methods">
  <Text style={styles.text}>
    Credit Card: {country.payment_methods?.credit_card ? 'Yes' : 'No' || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Cash: {country.payment_methods?.cash ? 'Yes' : 'No' || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Crypto: {country.payment_methods?.crypto ? 'Yes' : 'No' || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Apple Pay: {country.payment_methods?.apple_pay ? 'Yes' : 'No' || 'N/A'}
  </Text>
</Section>

<Section title="Languages Spoken">
  {country.languages_spoken?.length > 0 ? (
    country.languages_spoken.map((language, index) => (
      <Text key={index} style={styles.text}>
        {language.language || 'N/A'}
      </Text>
    ))
  ) : (
    <Text style={styles.text}>N/A</Text>
  )}
</Section>

<Section title="Dominant Religions">
  {country.dominant_religions?.length > 0 ? (
    country.dominant_religions.map((religion, index) => (
      <Text key={index} style={styles.text}>
        {religion.religion || 'N/A'}
      </Text>
    ))
  ) : (
    <Text style={styles.text}>N/A</Text>
  )}
</Section>

<Section title="Local Laws & Customs">
  {country.local_laws_customs?.length > 0 && country.local_laws_customs[0]?.main_rules?.length > 0 ? (
    country.local_laws_customs[0].main_rules.map((rule, index) => (
      <Text key={index} style={styles.text}>
        {rule || 'N/A'}
      </Text>
    ))
  ) : (
    <Text style={styles.text}>N/A</Text>
  )}
</Section>

<Section title="Survival Phrasebook">
  {country.survival_phrasebook?.length > 0 ? (
    country.survival_phrasebook.map((phrase, index) => (
      <Text key={index} style={styles.text}>
        {phrase.english || 'N/A'}: {phrase.translation || 'N/A'}
      </Text>
    ))
  ) : (
    <Text style={styles.text}>N/A</Text>
  )}
</Section>

<Section title="SIM/eSIM">
  <Text style={styles.text}>
    Providers: {country.sim_esim?.[0].providers?.join(', ') || 'N/A'}
  </Text>
  <Text style={styles.text}>
    Budget: {country.sim_esim?.[0].budget || 'N/A'}
  </Text>
</Section>

      </View>
    </ScrollView>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

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
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
});