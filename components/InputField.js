import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  inputStyle = {},
  containerStyle = {},
  keyboardType = "default",
     secureTextEntry = false,
}) => {
  return (
    <View style={[styles.field, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    paddingTop: 15,
  },
  label: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 10,
  },
});

export default InputField;
