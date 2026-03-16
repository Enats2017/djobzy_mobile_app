import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BorderButton = ({
  title = "Next",
  onPress,
  disabled = false,
  paddingHorizontal = 0,
  paddingVertical = 10,
  marginTop = 10,
  fontSize = 18,
  color = "#fff",
  borderColor = "#c3c3c3",
  borderRadius = 12,
  styleOverride = {},
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}
        style={[
          styles.button,
          { paddingHorizontal, marginTop, borderColor, paddingVertical, borderRadius },
          disabled && styles.disabledButton,
          styleOverride,
        ]}
        disabled={disabled}
      >
        <Text style={[
          styles.buttonText,
          { color, fontSize },
          disabled && styles.disabledText,
        ]}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  disabledButton: {
    borderColor: "#666",
    backgroundColor: "#2a2a2a",
    opacity: 0.45,
  },

  disabledText: {
    color: "#999",
  }
});
export default BorderButton;
