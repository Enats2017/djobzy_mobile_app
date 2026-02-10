import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = ({
  title = "Next",
  onPress,
  paddingHorizontal = 10,
  marginTop = 10,
  borderRadius=12,
  paddingVertical = 10,
  fontSize = 20,
  loading = false,
  disabled = false,
   colors = ["#C96B59", "#D17B68"],
    textColor = "#fff",


  styleOverride = {},
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}   disabled={disabled || loading}>
      <LinearGradient
       colors={colors}
        style={[
          styles.button,
          { paddingHorizontal, marginTop, paddingVertical, borderRadius},
          styleOverride, 
           (disabled || loading)
        ]}
        
      >
        {loading ? (
          <ActivityIndicator color="#fff"  size={26} />
        ) : (
          <Text style={[styles.buttonText, { color: textColor, fontSize }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    textAlign:"center",
    fontFamily: "Montserrat_700Bold",
  },
});

export default GradientButton;
