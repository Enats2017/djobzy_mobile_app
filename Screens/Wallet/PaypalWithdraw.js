import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import GradientButton from "../../components/GradientButton";

export default function PaypalWithdraw() {
  const [paypalId, setPaypalId] = useState("");

  const handlePaypalSubmit = () => {
    if (!paypalId.trim()) {
      Alert.alert("Missing Information", "Please enter your PayPal ID.");
      return;
    }

    Alert.alert("Success", "Your withdraw request has been submitted!");
  };

  return (
    <View style={styles.paypalBox}>
      <Text style={styles.paypalTitle}>Fill out your PayPal information</Text>

      <Text style={styles.paypalLabel}>PayPal ID</Text>

      <TextInput
        placeholder="Enter your PayPal ID"
        placeholderTextColor="#666666"
        style={styles.paypalInput}
        value={paypalId}
        onChangeText={setPaypalId}
      />

      <GradientButton title="Request a Withdraw" onPress={handlePaypalSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  paypalBox: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#d9d9d91a",
    padding: 12,
    borderRadius: 10,
  },

  paypalTitle: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },

  paypalLabel: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
  },

  paypalInput: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  paypalButton: {
    backgroundColor: "#D17B68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  paypalButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});
