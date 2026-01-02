import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Foundation } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export default function UploadBox({
  label,
  type = "image", // "image" | "document"
  onSelect,
  small = false,
}) {
  const handlePress = async () => {
    try {
      if (type === "image") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

        if (!result.canceled) {
          onSelect(result.assets[0]);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets.length > 0) {
          onSelect(result.assets[0]);
        }
      }
    } catch (err) {
      console.log("Picker error:", err);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.box, small && styles.small]}
      onPress={handlePress}
    >
      <Foundation name="upload" size={22} color="#fff" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
  box: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#FFFFFF33",
    borderRadius: 8,
    height: 110,
    marginBottom:15,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  small: { flex: 1, marginRight: 6, height: 110 },
  text: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginTop: 6,
  },
});
