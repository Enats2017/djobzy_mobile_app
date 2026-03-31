import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Tooltip from "./Tooltip";

const QuestionMark = ({
  title = "My Offer",
  tooltipMessage = "Default message Default message Default message",
  iconName = "question-circle",
  iconSize = 14,
  iconColor = "#c3c3c3",
  containerStyle,
  textStyle,
  textFamily = "Montserrat_600SemiBold",
}) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Text style={[styles.offerText, { fontFamily: textFamily }, textStyle]}>{title}</Text>
      <Tooltip text={tooltipMessage}>
        <FontAwesome
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={containerStyle}
        />
      </Tooltip>

    </View>
  );
};

const styles = StyleSheet.create({
  offerText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default QuestionMark;
