import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Foundation,EvilIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export default function NewUploadBox({
  label,
  type = "image",
  file,
  onSelect,
  onRemove,
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
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.uploadBox}>
        <TouchableOpacity style={styles.browseBtn} onPress={handlePress}>
          <Text style={styles.browseText}>Browse File</Text>
        </TouchableOpacity>

        {file && (
          <View style={styles.fileRow}>
            <Foundation name="page" size={18} color="#303030" />
            <Text style={styles.fileName}>
              {file.name || file.fileName || "file"}
            </Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeicon}>
              
              <EvilIcons name="trash" size={22} color="#CB4F34" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    marginBottom: 5,
    fontSize: 14,
    fontFamily:"Montserrat_500Medium"
  },

  uploadBox: {
    borderWidth: 2,
    borderColor: "#303030",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  browseBtn: {
    backgroundColor: "#6C9BA1",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  browseText: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },

  fileRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECEDEF",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 10,
    maxWidth: "70%",

    gap: 6,
  },

  fileName: {
    flex: 1,
    color: "#303030",
    fontSize: 13,
  },
  removeicon: {
    backgroundColor: "#CFCFCF",
    width: 25,
    height: 25,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  verifyBtn: {
    backgroundColor: "#d98c7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  verifyText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
