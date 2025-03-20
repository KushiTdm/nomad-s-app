import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import RNPickerSelect from 'react-native-picker-select';

const AVATAR_OPTIONS = [
  { id: '1', uri: 'https://previews.123rf.com/images/jemastock/jemastock1706/jemastock170619890/81137503-femme-voyageur-ou-touriste-ic%C3%B4ne-de-l-avatar-image-illustration-vectorielle-design.jpg' },
  { id: '2', uri: 'https://previews.123rf.com/images/jemastock/jemastock1706/jemastock170619891/81137467-voyageur-ou-homme-touristique-avec-l-ic%C3%B4ne-de-l-h%C3%B4tel-silhouette-de-conception.jpg' },
  { id: '3', uri: 'https://previews.123rf.com/images/jemastock/jemastock1903/jemastock190311405/119190061-femme-de-tourisme-avec-valise-et-carte-avatar-vector-illustration-graphisme.jpg' },
];

const TRAVEL_INTERESTS = [
  'Adventure', 'Beach', 'Culture', 'Food', 'History', 'Nature', 'Shopping', 'Sports',
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    avatar_url: AVATAR_OPTIONS[0].uri,
    birth_year: '',
    gender: '',
    country_of_origin: '',
    preferred_language: 'French',
    travel_interests: [],
    frequent_destinations: [],
  });

  useEffect(() => {
    loadProfile();
    fetchCountries();
  }, []);

  const loadProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email) // Utiliser email comme clé primaire
      .single();

    if (error) throw error;

    setProfile(data);
    setFormData({
      username: data.username || '',
      full_name: data.full_name || '',
      avatar_url: data.avatar_url || AVATAR_OPTIONS[0].uri,
      birth_year: data.birth_year?.toString() || '',
      gender: data.gender || '',
      country_of_origin: data.country_of_origin || '',
      preferred_language: data.preferred_language || 'French',
      travel_interests: data.travel_interests || [],
      frequent_destinations: data.frequent_destinations || [],
    });
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('name, id');

      if (error) throw error;
      setCountries(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUpdate = async () => {
  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        travel_interests: formData.travel_interests || [],
        frequent_destinations: formData.frequent_destinations || [],
      })
      .eq('email', user.email); // Utiliser email comme clé primaire

    if (error) throw error;

    setProfile({ ...profile, ...formData });
    setIsEditing(false);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/auth/sign-in');
    }
  };

  const handleYearChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setFormData({ ...formData, birth_year: cleanedText });
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
          <Image
            source={{ uri: formData.avatar_url }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        {!isEditing && (
          <>
            <Text style={styles.name}>{profile?.full_name || 'Update your profile'}</Text>
            <Text style={styles.email}>{profile?.email || 'No email'}</Text>
          </>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      

      {isEditing ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            placeholder="Full Name"
          />
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            value={formData.birth_year}
            onChangeText={handleYearChange}
            placeholder="Birth Year (YYYY)"
            keyboardType="numeric"
            maxLength={4}
          />
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, gender: value || '' })}
              items={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
              ]}
              value={formData.gender || ''}
              placeholder={{ label: 'Select Gender', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, country_of_origin: value || '' })}
              items={countries.map((country) => ({ label: country.name, value: country.id }))}
              value={formData.country_of_origin || ''}
              placeholder={{ label: 'Select Country of Origin', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, preferred_language: value || 'French' })}
              items={[
                { label: 'French', value: 'French' },
                { label: 'English', value: 'English' },
                { label: 'Spanish', value: 'Spanish' },
                { label: 'German', value: 'German' },
                { label: 'Chinese', value: 'Chinese' },
                { label: 'Arabic', value: 'Arabic' },
              ]}
              value={formData.preferred_language || 'French'}
              placeholder={{ label: 'Select Preferred Language', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={(values) => setFormData({ ...formData, travel_interests: values ? [values] : [] })}
              items={TRAVEL_INTERESTS.map((interest) => ({ label: interest, value: interest }))}
              value={formData.travel_interests?.[0] || ''}
              placeholder={{ label: 'Select Travel Interests', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={(values) => setFormData({ ...formData, frequent_destinations: values ? [values] : [] })}
              items={countries.map((country) => ({ label: country.name, value: country.id }))}
              value={formData.frequent_destinations?.[0] || ''}
              placeholder={{ label: 'Select Frequent Destinations', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileInfo}>
          <ProfileField label="Username" value={profile?.username} />
          <ProfileField label="Full Name" value={profile?.full_name} />
          <ProfileField label="Birth Year" value={profile?.birth_year} />
          <ProfileField label="Gender" value={profile?.gender} />
          <ProfileField label="Country of Origin" value={profile?.country_of_origin} />
          <ProfileField label="Preferred Language" value={profile?.preferred_language} />
          <ProfileField 
            label="Travel Interests" 
            value={profile?.travel_interests?.join(', ')} 
          />
          <ProfileField 
            label="Frequent Destinations" 
            value={profile?.frequent_destinations?.join(', ')} 
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={20} color="#2563eb" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {showAvatarPicker && (
        <View style={styles.avatarPicker}>
          <Text style={styles.avatarPickerTitle}>Choose an Avatar</Text>
          <FlatList
            data={AVATAR_OPTIONS}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setFormData({ ...formData, avatar_url: item.uri });
                  setShowAvatarPicker(false);
                }}>
                <Image source={{ uri: item.uri }} style={styles.avatarOption} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ProfileField = ({ label, value }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || 'Not set'}</Text>
  </View>
);

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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
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
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
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
  editButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
  profileInfo: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
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
  fieldLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  avatarPicker: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  avatarPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
});