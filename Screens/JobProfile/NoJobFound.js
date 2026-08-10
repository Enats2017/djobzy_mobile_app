import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const NoJobFound = ({
  icon = "briefcase-outline",
  title = "No job found",
  message = "You don't have an active job right now. This job post may have been removed, closed or is no longer available.",
  actionLabel = "Browse other jobs",
  actionIcon = "magnify",
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconStack}>
          <View style={styles.ring} />
          <View style={styles.ringInner}>
            <Ionicons name={icon} size={28} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>

        {onAction && (
          <TouchableOpacity
            style={styles.cta}
            onPress={onAction}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name={actionIcon} size={15} color="#FFFFFF" />
            <Text style={styles.ctaText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  card: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff1a",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 30,
    elevation: 3,
  },

  // Icon
  iconStack: {
    width: 76,
    height: 76,
    marginBottom: 18,
  },
  ring: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#ffffff1a",
  },
  ringInner: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 28,
    backgroundColor: "#D17B68",
    alignItems: "center",
    justifyContent: "center",
  },

  // Text
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  },

  // Action
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 22,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
});

export default NoJobFound;
