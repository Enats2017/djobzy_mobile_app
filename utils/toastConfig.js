import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.container, styles.success]}>
      <Ionicons name="checkmark-circle" size={28} color="#fff" />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.container, styles.error]}>
      <Ionicons name="close-circle" size={28} color="#fff" />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[styles.container, styles.info]}>
      <Ionicons name="information-circle" size={28} color="#fff" />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 5,
  },
  textWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontFamily:"Montserrat_500Medium"
  },
  message: {
    color: "#f1f1f1",
    fontSize: 13,
    marginTop: 2,
  },
  success: {
    backgroundColor: "#28a745",
  },
  error: {
    backgroundColor: "#dc3545",
  },
  info: {
    backgroundColor: "#007bff",
  },
});
