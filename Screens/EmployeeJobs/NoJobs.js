import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NoJobs = () => {
  return (
    <View style={styles.noJobContainer}>
      <Image
        source={require("../../assets/images/Jobs.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.noContractText}>You don't have any contract</Text>
      <TouchableOpacity style={styles.findJobButton}>
        <Text style={styles.findJobButtonText}>Find a Job</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  noJobContainer: {
    flex: "1",
    justifyContent: "center",
    alignItems: "center",
  
  },

  noContractText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 10,
    fontFamily: "Montserrat_500Medium",
  },
  findJobButton: {
    backgroundColor: "#eb8676",
    borderRadius: 14,
    paddingVertical: 14,
    width: 360,
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
  },
  findJobButtonText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "Montserrat_700Bold",
  },
});

export default NoJobs;
