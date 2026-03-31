import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import PhoneNumberInput from "./PhoneNumberInput";

const ContactInfo = ({
  postalCodeValue,
  onChangePostalCode,
  locationValue,
  label,
  onChangeLocation,
  postalError,
  locationError,
  postalPlaceholder = "Enter Postal Code",
  locationPlaceholder = "Enter Location",
  containerStyle = {},
  inputStyle = {},
  showPhone = true,
  showPostal = true,
  showLocation = true,
}) => {
  return (
    <View style={[styles.infosection, containerStyle]}>
      {showPostal && (
        <View style={styles.field}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={postalPlaceholder}
            placeholderTextColor="#999"
            value={postalCodeValue}
            onChangeText={onChangePostalCode}
          />
          {postalError ? (
            <Text style={styles.errorText}>{postalError}</Text>
          ) : null}
        </View>
      )}

      {showLocation && (
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={locationPlaceholder}
            placeholderTextColor="#999"
            value={locationValue}
            onChangeText={onChangeLocation}
          />
          {locationError ? (
            <Text style={styles.errorText}>{locationError}</Text>
          ) : null}
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
  },
});

export default ContactInfo;
