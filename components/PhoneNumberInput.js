import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { Ionicons } from "@expo/vector-icons";
import { isValidPhoneNumber } from "libphonenumber-js";

const PhoneNumberInput = ({
  value = "",
  onChange = () => {},
  defaultFlag = "🇨🇦",
  defaultCallingCode = "+1",
  defaultCountryISO = "CA",
  placeholder = "Enter phone number",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [flag, setFlag] = useState(defaultFlag);
  const [callingCode, setCallingCode] = useState(defaultCallingCode);
  const [countryISO, setCountryISO] = useState(defaultCountryISO);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPhoneNumber(value);
    validateNumber(value, countryISO, callingCode);
  }, [value]);

  const validateNumber = (number, isoCode, dialCode) => {
    if (!number) {
      setIsValid(false);
      setError("");
      return;
    }

    try {
      const fullNumber = `${dialCode}${number}`;
      const valid = isValidPhoneNumber(fullNumber, isoCode);

      setIsValid(valid);
      setError(valid ? "" : "Invalid phone number");
    } catch (e) {
      setIsValid(false);
      setError("Invalid phone number");
    }
  };

  const handleChange = (text) => {
    const digits = text.replace(/[^0-9]/g, "");
    setPhoneNumber(digits);

    onChange({
      phone: digits,
      countryCode: callingCode.replace("+", ""),
      countryISO,
    });
    validateNumber(digits, countryISO, callingCode);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          { borderColor: isValid ? "#28a745" : "#ccc" },
        ]}
      >
        {/* Flag + country code */}
        <TouchableOpacity
          style={styles.flagContainer}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.flag}>{flag}</Text>
          <Text style={styles.callingCode}>{callingCode}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleChange}
        />

        {isValid && (
          <Ionicons
            name="checkmark-done-circle-sharp"
            size={24}
            color="green"
            style={styles.icon}
          />
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <CountryPicker
              show={true}
              enableSearch={true}
              searchPlaceholder="Search country..."
              pickerButtonOnPress={(item) => {
                setFlag(item.flag);
                setCallingCode(item.dial_code);
                setCountryISO(item.code);

                onChange({
                  phone: phoneNumber,
                  countryCode: item.dial_code.replace("+", ""),
                  countryISO: item.code,
                });

                validateNumber(phoneNumber, item.code, item.dial_code);
                setShowPicker(false);
              }}
              style={{
                modal: { height: 400 },
                searchBar: {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                  margin: 10,
                  paddingHorizontal: 10,
                },
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
    backgroundColor: "#fff",
    elevation: 2,
    position: "relative",
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  flag: {
    fontSize: 22,
    marginRight: 6,
  },
  callingCode: {
    fontSize: 15,
    color: "#000",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 0,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -2 }],
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
});
