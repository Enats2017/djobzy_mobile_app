import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const NoSocialFeed = ({ navigation, estimateCount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconStack}>
        <View style={styles.ring} />
        <View style={styles.ringInner}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#1A1A1A" />
        </View>
        <View style={[styles.dot, styles.dot1]}>
          <Ionicons name="image" size={11} color="#D17B68" />
        </View>
        <View style={[styles.dot, styles.dot2]}>
          <MaterialCommunityIcons name="video-outline" size={12} color="#D17B68" />
        </View>
      </View>

      <Text style={styles.title}>Your feed is waiting</Text>
      <Text style={styles.subtitle}>
        Share an update, a project win, or what you're working on — your network won't know unless you post it.
      </Text>

      <TouchableOpacity
        style={styles.cta}
        onPress={() =>
          navigation.navigate("CreateFeedPost", {
            estimate_reach_count: estimateCount,
          })
        }
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="pencil" size={14} color="#FFFFFF" />
        <Text style={styles.ctaText}>Create your first post</Text>
      </TouchableOpacity>

      {/* Chips */}
      <View style={styles.chips}>
        <View style={styles.chip}>
          <Ionicons name="image" size={15} color="#D17B68" />
          <Text style={styles.chipText}>Image</Text>
        </View>
        <View style={styles.chip}>
          <MaterialCommunityIcons name="video" size={15} color="#D17B68" />
          <Text style={styles.chipText}>Video</Text>
        </View>
        <View style={styles.chip}>
          <MaterialCommunityIcons name="pencil" size={15} color="#D17B68" />
          <Text style={styles.chipText}>AI video</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff1a',
    paddingTop: 44,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: "100%"
  },

  // Icon stack
  iconStack: {
    width: 84,
    height: 84,
    marginBottom: 16,
  },
  ring: {
    position: 'absolute',
    width: 84,
    height: 84,
    backgroundColor: '#312a29',
    borderRadius: 42,
  },
  ringInner: {
    position: 'absolute',
    top: 11,
    left: 11,
    right: 11,
    bottom: 11,
    borderRadius: 31,
    backgroundColor: '#D17B68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#262220',
    borderWidth: 1,
    borderColor: '#312b28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot1: {
    top: -2,
    right: -4,
  },
  dot2: {
    bottom: 4,
    left: -8,
  },

  // Text
  title: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: '#FFFFFF',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A8A29C',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 250,
    fontFamily: "Montserrat_400Regular",
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 20,
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    fontFamily: "Montserrat_600SemiBold",
    color: '#FFFFFF',
  },

  // Chips
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#241D1A',
    borderWidth: 0.5,
    borderColor: '#4A2D21',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Montserrat_500Medium",
    color: '#FFFFFF',
  },
});

export default NoSocialFeed;