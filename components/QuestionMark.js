import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Tooltip from "react-native-walkthrough-tooltip";

const QuestionMark = ({
  title = "My Offer",
  tooltipMessage = "Default message",
  iconName = "question-circle",
  iconSize = 15,
  iconColor = "#c3c3c3",
  containerStyle,
  textStyle,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ alignSelf: "flex-start" }}>
      <Tooltip
        isVisible={visible}
        
        content={
          <Text style={{ color: "#000", fontSize: 13 }}>
            {tooltipMessage}
          </Text>
        }
        placement="top"
        onClose={() => setVisible(false)}
        useReactNativeModal={true}  
        showChildInTooltip={false}
        contentStyle={styles.tooltipBox}
      >
        <TouchableOpacity
          style={[styles.offerHeader, containerStyle]}
          onPress={() => setVisible(true)}
        
        >
          <Text style={[styles.offerText, textStyle]}>{title}</Text>
          <FontAwesome
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

const styles = StyleSheet.create({
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

   tooltipBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
   
    maxWidth: 220,
    elevation: 5, // Android shadow
  },

  offerText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },


});

export default QuestionMark;
