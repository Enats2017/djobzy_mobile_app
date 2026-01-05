import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilePreview = ({ file, onRemove }) => {
  if (!file) return null;

  const fileName = file.name || file.fileName || file.uri?.split("/").pop();
  const fileType = file.mimeType || file.type || "";

  const isImage =
    fileType.startsWith("image") ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

    const shortFileName = (name, maxLength = 22) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  };

  return (
    <View style={styles.container}>
      {/* Left Icon / Image */}
      {isImage ? (
        <Image source={{ uri: file.uri }} style={styles.iconImage} />
      ) : (
        <Ionicons
          name="document-text-outline"
          size={22}
          color="#e63939ff"
          style={styles.icon}
        />
      )}

      {/* File Name */}
      <Text numberOfLines={1} style={styles.fileName}>
        {shortFileName(fileName)}
      </Text>

      {/* Close Icon */}
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close" size={20} color="#d62525ff" />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",    
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginTop: 5,
  },

  icon: {
    marginRight: 8,
  },

  iconImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },

  fileName: {
    flex: 1,
    fontSize: 13,
    color: "#fff",
  },
});


export default FilePreview;
