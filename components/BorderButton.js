import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BorderButton = ({
  title = "Next",
  onPress,
  disabled = false,
  paddingHorizontal = 0,
  marginTop = 10,
  fontSize = 20,
  color = "#fff",
  borderColor= "#c3c3c3",
  styleOverride = {},
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}
       style={[
        styles.button,
        { paddingHorizontal, borderColor, marginTop },
        disabled && styles.disabledButton, // 🔥 dull style
        styleOverride,
      ]}
        disabled={disabled}
      >
        <Text  style={[
          styles.buttonText,
          { color, fontSize },
          disabled && styles.disabledText, // 🔥 dull text
        ]}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 9,
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
