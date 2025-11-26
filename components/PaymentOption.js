import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


const PaymentOption = ({ title, icon, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
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
    borderColor: "#fff",
  },
  active: {
    borderColor: "#fff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
});

export default PaymentOption;
