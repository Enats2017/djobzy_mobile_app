import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import GradientButton from '../../../components/GradientButton';

export default function FeedJobCard({ data }) {
  if (!data) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Job details unavailable</Text>
      </View>
    );
  }

  const handleViewJob = () => {
    if (data.view_job_url) {
      Linking.openURL(data.view_job_url).catch(() => { });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {data.title}
        </Text>
      </View>

      {data.tags?.length > 0 && (
        <View style={styles.tagWrap}>
          {data.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {data.details?.length > 0 && (
        <View style={styles.detailsBox}>
          {data.details.map((d, i) => (
            <React.Fragment key={i}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel} numberOfLines={1}>
                  {d.label ? d.label.toUpperCase() : ''}
                </Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {d.value}
                </Text>
              </View>
              {i < data.details.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      )}

      {!!data.view_job_url && (
        <GradientButton title="View" onPress={handleViewJob} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: '#FFFFFF',
    lineHeight: 21,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#ffffff1a',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Montserrat_500Medium",
  },
  detailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    backgroundColor: "#FFFFFF1A",
    borderRadius: 10,
    paddingVertical: 12,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1.3,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  detailLabel: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Montserrat_700Bold",
    color: '#FFFFFF',
  },
  fallback: {
    padding: 12,
  },
  fallbackText: {
    fontSize: 12.5,
    fontFamily: "Montserrat_400Regular",
    color: '#B0B0B0',
  },
});