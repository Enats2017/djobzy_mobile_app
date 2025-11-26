import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Foundation } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export default function UploadBox({
  label,
  type = "image", // "image" | "document"
  onSelect = () => {}, // returns picked file
  small = false,
  style,
  showIcon = true,
}) {
  const handlePress = async () => {
    try {
      if (type === "image") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled) {
          onSelect(result.assets[0]); // return image file
        }
      } else {
        const res = await DocumentPicker.pickSingle({
          type: DocumentPicker.types.allFiles,
        });
        onSelect(res); // return document file
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("Canceled");
      } else {
        console.log("Error:", err);
      }
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.box, small && styles.small, style]}
    >
      {showIcon && <Foundation name="upload" size={24} color="#fff" />}
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
