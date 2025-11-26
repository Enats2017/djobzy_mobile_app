import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function DynamicInputSection({
  label,
  values,
  type,
  updateItem,
  addItem,
  removeItem,
  styles,
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>

      {/* First input row */}
      <View style={styles.plusInput}>
        <TextInput
          style={styles.innerInput}
          placeholder="Write here"
          placeholderTextColor="#bfbfbf"
          value={values[0].value}
          onChangeText={(t) => updateItem(type, values[0].id, t)}
        />
        <TouchableOpacity onPress={() => addItem(type)}>
          <Entypo name="circle-with-plus" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Remaining rows */}
      {values.slice(1).map((item) => (
        <View key={item.id} style={styles.childRow}>
          <TextInput
            style={styles.innerInput}
            placeholder="Write here"
            placeholderTextColor="#bfbfbf"
            value={item.value}
            onChangeText={(t) => updateItem(type, item.id, t)}
          />
          <TouchableOpacity onPress={() => removeItem(type, item.id)}>
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}
