import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase'; // Importer Supabase

const AlertItem = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'political':
        return { name: 'warning', color: '#f59e0b' }; // Orange pour les risques politiques
      case 'health':
        return { name: 'alert-circle', color: '#ef4444' }; // Rouge pour les risques sanitaires
      case 'climate':
        return { name: 'information-circle', color: '#3b82f6' }; // Bleu pour les risques climatiques
      default:
        return { name: 'information-circle', color: '#3b82f6' }; // Par défaut
    }
  };

  // Déterminer le type d'alerte en fonction des risques
  const getAlertType = (alert) => {
    if (alert.political_risks) return 'political';
    if (alert.health_risks) return 'health';
    if (alert.climate_risks) return 'climate';
    return 'info';
  };

  const alertType = getAlertType(alert);
  const icon = getAlertIcon(alertType);

  return (
    <View style={styles.alertItem}>
      <Ionicons name={icon.name} size={24} color={icon.color} />
      <View style={styles.alertContent}>
        <Text style={styles.alertCountry}>{alert.country?.name || 'Unknown Country'}</Text>
        {alert.political_risks && (
          <Text style={styles.alertMessage}>Political Risks: {alert.political_risks}</Text>
        )}
        {alert.health_risks && (
          <Text style={styles.alertMessage}>Health Risks: {alert.health_risks}</Text>
        )}
        {alert.climate_risks && (
          <Text style={styles.alertMessage}>Climate Risks: {alert.climate_risks}</Text>
        )}
      </View>
    </View>
  );
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // Récupérer les alertes en temps réel depuis Supabase
      const { data, error } = await supabase
        .from('real_time_alerts')
        .select(`
          *,
          country:countries (name)
        `);

      if (error) throw error;

      setAlerts(data);
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertItem alert={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts available.</Text>
          </View>
        }
      />
    </View>
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
  listContainer: {
    padding: 16,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
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
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertCountry: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});