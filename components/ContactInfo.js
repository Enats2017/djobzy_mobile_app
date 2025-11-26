import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import PhoneNumberInput from "./PhoneNumberInput";

const ContactInfo = ({
  phoneValue,
  onChangePhone,
  postalCodeValue,
  onChangePostalCode,
  locationValue,
  label,
  onChangeLocation,
  postalPlaceholder = "Enter Postal Code",
  locationPlaceholder = "Enter Location",
  containerStyle = {},
  inputStyle = {},
  showPhone = true,
  showPostal = true,
  showLocation = true,
}) => {
  return (
    <View style={[styles. infosection, containerStyle]}>
      {showPhone && (
        <>
          <Text style={styles.label}>{label}</Text>
          <PhoneNumberInput value={phoneValue} onChangeText={onChangePhone} />
        </>
      )}

      {showPostal && (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={postalPlaceholder}
            placeholderTextColor="#999"
            value={postalCodeValue}
            onChangeText={onChangePostalCode}
          />
        </View>
      )}

      {showLocation && (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={locationPlaceholder}
            placeholderTextColor="#999"
            value={locationValue}
            onChangeText={onChangeLocation}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infosection: {
    paddingTop: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    marginBottom: 5,
  },
  field: {
    paddingTop: 15,
  },
  input: {
    backgroundColor: "#ffff",
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 10,
  },
});

export default ContactInfo;
