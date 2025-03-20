// app/components/CategoryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const CategoryButton = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, isActive && styles.activeCategoryCard]}
      onPress={onPress}
    >
      <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    minWidth: '30%',
    alignItems: 'center',
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
  activeCategoryCard: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  activeCategoryText: {
    color: '#fff',
  },
});

export default CategoryButton;