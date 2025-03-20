import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseService';

const ContributionSection = ({ countryId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [contribution, setContribution] = useState('');

  const contributionTypes = [
    { label: 'Coût du visa', value: 'visa_cost' },
    { label: 'Délai de visa', value: 'visa_duration' },
    { label: 'Disponibilité e-visa', value: 'e_visa_availability' },
    { label: 'Méthodes de paiement', value: 'payment_methods' },
    { label: 'Alerte sécurité', value: 'alert_update' },
    { label: 'Autre', value: 'other' },
  ];

  const handleSubmit = async () => {
    if (!contribution.trim() || !selectedType) return;
    // Intégration avec Supabase
    try {
      const { error } = await supabase
  .from('community_contributions')
  .insert({
    country_id: countryId,
    user_id: supabase.auth.user()?.id, // Ajout de la vérification d'utilisateur
    type: selectedType,
    content: { value: contribution },
    status: 'pending'
  });

      if (!error) {
        setContribution('');
        setSelectedType('');
        alert('Merci pour votre contribution ! Elle sera vérifiée sous 24h.');
      }
    } catch (error) {
      console.error('Erreur de soumission:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.title}>Contributions de la communauté (3)</Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#64748b" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.label}>Type de contribution</Text>
          <View style={styles.typeContainer}>
            {contributionTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  selectedType === type.value && styles.selectedType
                ]}
                onPress={() => setSelectedType(type.value)}
              >
                <Text style={styles.typeText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Décrivez votre mise à jour..."
            value={contribution}
            onChangeText={setContribution}
            multiline
            maxLength={280}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={!selectedType || !contribution}
          >
            <Text style={styles.buttonText}>Soumettre</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  content: {
    marginTop: 16,
  },
  label: {
    color: '#64748b',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  selectedType: {
    backgroundColor: '#2563eb',
  },
  typeText: {
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default ContributionSection;