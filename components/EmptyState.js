import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({
  icon = 'document-text-outline',
  title = 'No data found',
  subtitle = 'Data will appear here once available.',
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={32} color="#9CA3AF" />

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: "#6464641a",
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    marginTop: 10
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#F1F5F9",
  },
  subtitle: {
    fontSize: 12,
    color: "#A1A1AA",
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },
});

export default EmptyState;