import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const QuestionMark = ({
  title = "My Offer",
  iconName = "question-circle",
  iconSize = 15,
  iconColor = "#c3c3c3",
  onPress,
  containerStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.offerHeader, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.offerText, textStyle]}>{title}</Text>

      <FontAwesome
        name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
      offerHeader: {
    flexDirection: "row",
    alignItems:"center",
    marginBottom:"5",  
    gap: 6,
  },

   offerText:{
     color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",

  },


})

export default QuestionMark;
