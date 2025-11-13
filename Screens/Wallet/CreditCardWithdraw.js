import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import GradientButton from "../../components/GradientButton";

export default function CreditCardWithdraw() {
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const [isCountryDropdownVisible, setIsCountryDropdownVisible] =
    useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");

  const countryOptions = ["India", "Canada", "USA", "Australia", "UK"];

  const handleSubmit = () => {
    // empty field check
    if (
      !fullName.trim() ||
      selectedCountry === "Select Country" ||
      !cardNumber.trim() ||
      !expMonth.trim() ||
      !expYear.trim()
    ) {
      Alert.alert("Missing Information", "Please fill all the fields.");
      return;
    }

    // MM must be exactly 2 digits
    if (expMonth.length !== 2 || isNaN(expMonth)) {
      Alert.alert(
        "Invalid Month",
        "Month must be written in 2 digits (e.g., 01, 05, 12)."
      );
      return;
    }

    // YYYY must be exactly 4 digits
    if (expYear.length !== 4 || isNaN(expYear)) {
      Alert.alert(
        "Invalid Year",
        "Year must be written in 4 digits (e.g., 2001, 2024)."
      );
      return;
    }

    Alert.alert("Success", "Your card withdraw request has been submitted!");
  };

  return (
    <View style={styles.cardBox}>
      <Text style={styles.cardTitle}>
        Fill out your credit/debit card information
      </Text>

      <Text style={styles.cardLabel}>Full Name</Text>
      <TextInput
        placeholder="Enter your Name"
        placeholderTextColor="#888"
        style={styles.cardInput}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.cardLabel}>Card Issuing Country</Text>

      <View>
        <TouchableOpacity
          style={styles.countryDropdownButton}
          onPress={() => setIsCountryDropdownVisible(!isCountryDropdownVisible)}
        >
          <Text
            style={[
              styles.countryDropdownButtonText,
              selectedCountry === "Select Country"
                ? styles.dropdownPlaceholderText
                : styles.dropdownSelectedText,
            ]}
          >
            {selectedCountry}
          </Text>

          <Entypo
            name={
              isCountryDropdownVisible
                ? "chevron-small-up"
                : "chevron-small-down"
            }
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {isCountryDropdownVisible && (
          <View style={styles.countryDropdownList}>
            {countryOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.countryDropdownOption}
                onPress={() => {
                  setSelectedCountry(item);
                  setIsCountryDropdownVisible(false);
                }}
              >
                <Text style={styles.countryDropdownOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.cardLabel}>Card Number</Text>
      <TextInput
        placeholder="Enter your Card Number"
        placeholderTextColor="#888"
        style={styles.cardInput}
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <Text style={styles.cardLabel}>Expiry Date</Text>
      <View style={styles.expiryRow}>
        <TextInput
          placeholder="MM"
          placeholderTextColor="#888"
          style={styles.expiryInput}
          maxLength={2}
          keyboardType="numeric"
          value={expMonth}
          onChangeText={setExpMonth}
        />

        <TextInput
          placeholder="YYYY"
          placeholderTextColor="#888"
          style={styles.expiryInput}
          maxLength={4}
          keyboardType="numeric"
          value={expYear}
          onChangeText={setExpYear}
        />
      </View>

      <GradientButton title="Request a Withdraw" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    marginTop: 15,
    backgroundColor: "#d9d9d91a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    fontFamily: "Montserrat_600SemiBold",
  },

  cardLabel: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Montserrat_500Medium",
  },

  cardInput: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  countryDropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D2D2D",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },

  countryDropdownButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  dropdownPlaceholderText: {
    color: "#666666",
  },

  dropdownSelectedText: {
    color: "#333",
  },

  countryDropdownList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D2D2D",
    marginTop: -5,
    marginBottom: 15,
    overflow: "hidden",
  },

  countryDropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  countryDropdownOptionText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  expiryRow: {
    flexDirection: "row",
    gap: 10,
  },

  expiryInput: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 8,
    width: 80,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 15,
  },

  cardButton: {
    backgroundColor: "#D17B68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 25,
  },

  cardButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
});
