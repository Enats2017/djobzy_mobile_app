import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BorderButton = ({
  title = "Next",
  onPress,
  paddingHorizontal = 55,
  fontSize = 20,
  styleOverride = {},
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}
        style={[styles.button, { paddingHorizontal }, styleOverride]}
      >
        <Text style={styles.buttonText }>{title}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
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
