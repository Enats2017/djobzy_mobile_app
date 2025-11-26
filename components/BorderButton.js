import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BorderButton = ({
  title = "Next",
  onPress,
  paddingHorizontal = 25,
  marginTop = 10,
  fontSize = 20,
  color = "#fff",
  borderColor= "#c3c3c3",
  styleOverride = {},
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}
        style={[styles.button, { paddingHorizontal, borderColor, marginTop }, styleOverride, ]}
      >
        <Text style={[styles.buttonText,{color, fontSize} ]}>{title}</Text>
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
});
export default BorderButton;
