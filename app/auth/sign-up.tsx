import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import RNPickerSelect from 'react-native-picker-select'; // Pour les menus déroulants

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
  try {
    setLoading(true);
    setError(null);

    // Vérifier que l'année de naissance est valide
    const year = parseInt(birthYear, 10);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      throw new Error('Please enter a valid birth year (1900 - current year).');
    }

    // Inscription avec Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (signUpData.user) {
      // Création du profil dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          email, // Utiliser l'email comme clé primaire
          username,
          birth_year: year,
          gender,
          country_of_origin: countryOfOrigin,
        }]);

      if (profileError) throw profileError;
    }

    router.replace('/(tabs)');
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

  const handleYearChange = (text) => {
    // Ne permettre que des chiffres
    const cleanedText = text.replace(/[^0-9]/g, '');
    setBirthYear(cleanedText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Birth Year (YYYY)"
          value={birthYear}
          onChangeText={handleYearChange}
          keyboardType="numeric"
          maxLength={4}
        />

        <View style={styles.input}>
          <RNPickerSelect
            onValueChange={(value) => setGender(value)}
            items={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            value={gender}
            placeholder={{ label: 'Select Gender', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.input}>
          <RNPickerSelect
            onValueChange={(value) => setCountryOfOrigin(value)}
            items={[
              { label: 'France', value: 'FR' },
              { label: 'United States', value: 'US' },
              { label: 'Germany', value: 'DE' },
              // Ajoute d'autres pays ici
            ]}
            value={countryOfOrigin}
            placeholder={{ label: 'Select Country of Origin', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Link href="/auth/sign-in" style={styles.link}>
          <Text>Already have an account? Sign in</Text>
        </Link>
      </View>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#0f172a',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    color: '#0f172a',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    alignSelf: 'center',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
});