import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../../components/EmptyState';

const ReviewCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.photo }} style={styles.avatar} />
          <Text style={styles.name}>{item.full_name}</Text>
        </View>
        <View style={styles.ratingWrap}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {item.star_rate}
            <Text style={styles.ratingMax}>/5</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{item.subject}</Text>
      <Text style={styles.subtitle}>{item.comment}</Text>
    </View>
  );
};

const ContractReviewCard = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon="star-outline"
        title="No Reviews Yet"
        subtitle="You don’t have any reviews yet. Once work is completed, reviews will appear here."
      />
    );
  }
  return (
    <View style={styles.section}>
      {reviews.map((item, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <ReviewCard item={item} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffff1a',
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
  },
  name: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: '#F9FAFB',
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: '#F9FAFB',
    lineHeight: 19
  },
  ratingMax: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: '#9CA3AF',
  },
  title: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },
});

export default ContractReviewCard;
