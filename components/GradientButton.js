import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = ({
  title = "Next",
  onPress,
  paddingHorizontal = 55,
  fontSize = 20,
  styleOverride = {}, 
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={["#C96B59", "#D17B68",]}
        
        style={[styles.button, { paddingHorizontal },styleOverride]}
      >
        <Text style={[styles.buttonText, { fontSize }]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    borderRadius: 12,
    marginTop:4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
   
  },
});

export default GradientButton;
