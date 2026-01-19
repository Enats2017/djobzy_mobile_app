import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const PaymentOption = ({ title, icon, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
         {React.cloneElement(icon, {
          color: selected ? "#000" : "#fff",
        })}
        <Text style={[styles.title, selected && styles.activeText]}>{title}</Text>
      </View>

      <View style={[styles.radioOuter , selected && styles.rdiocircle]}>
        {selected && <MaterialIcons name="done" size={16} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
     
   card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    paddingHorizontal: 18,
     marginBottom: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#FFFFFF4D",
  },
  active: {
    backgroundColor: "#fff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily:"Montserrat_500Medium"
  },
  activeText:{
    color:"#303030"

  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFFFFF4D",
    alignItems: "center",
    justifyContent: "center",
  },
  rdiocircle:{
      borderColor: "#303030",
      backgroundColor:"#303030",
      
  },
 
});

export default PaymentOption;
