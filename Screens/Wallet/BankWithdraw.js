import React, { useState } from "react";
import GradientButton from "../../components/GradientButton";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function BankWithdraw() {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [otherCode, setOtherCode] = useState("");

  const handleSubmit = () => {
    if (
      !beneficiaryName.trim() ||
      !beneficiaryAddress.trim() ||
      !accountNumber.trim() ||
      !otherCode.trim()
    ) {
      Alert.alert("Missing Information", "Please fill all the fields.");
      return;
    }

    Alert.alert("Success", "Your bank withdraw request has been submitted!");
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Fill out your banking information</Text>

      <Text style={styles.label}>Full Beneficiary Name</Text>
      <TextInput
        placeholder="Enter your Name"
        placeholderTextColor="#666666"
        style={styles.input}
        value={beneficiaryName}
        onChangeText={setBeneficiaryName}
      />

      <Text style={styles.label}>Beneficiary Address</Text>
      <TextInput
        placeholder="Address"
        placeholderTextColor="#666666"
        style={styles.input}
        value={beneficiaryAddress}
        onChangeText={setBeneficiaryAddress}
      />

      <Text style={styles.label}>Bank Account Number</Text>
      <TextInput
        placeholder="Bank Account Number"
        placeholderTextColor="#666666"
        keyboardType="numeric"
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <Text style={styles.label}>Other Code</Text>
      <TextInput
        placeholder="Code"
        placeholderTextColor="#666666"
        style={styles.input}
        value={otherCode}
        onChangeText={setOtherCode}
      />

      <GradientButton title="Request a Withdraw" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#d9d9d91a",
    padding: 15,
    borderRadius: 10,
  },

  title: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 14,
    fontFamily: "Montserrat_600SemiBold",
  },

  label: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Montserrat_500Medium",
  },

  input: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  button: {
    backgroundColor: "#D17B68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
});
