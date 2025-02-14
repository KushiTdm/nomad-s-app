import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'warning',
    country: 'France',
    message: 'Planned transportation strikes in Paris next week',
    date: '2024-02-15',
  },
  {
    id: '2',
    type: 'info',
    country: 'Japan',
    message: 'Cherry blossom season starting earlier than usual',
    date: '2024-03-01',
  },
  {
    id: '3',
    type: 'danger',
    country: 'Thailand',
    message: 'Heavy rainfall and flooding in southern regions',
    date: '2024-02-10',
  },
];

const AlertItem = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'warning', color: '#f59e0b' };
      case 'danger':
        return { name: 'alert-circle', color: '#ef4444' };
      case 'info':
        return { name: 'information-circle', color: '#3b82f6' };
      default:
        return { name: 'information-circle', color: '#3b82f6' };
    }
  };

  const icon = getAlertIcon(alert.type);

  return (
    <View style={styles.alertItem}>
      <Ionicons name={icon.name} size={24} color={icon.color} />
      <View style={styles.alertContent}>
        <Text style={styles.alertCountry}>{alert.country}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <Text style={styles.alertDate}>{alert.date}</Text>
      </View>
    </View>
  );
};

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_ALERTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertItem alert={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  alertDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});