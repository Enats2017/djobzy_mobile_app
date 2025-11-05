import * as DocumentPicker from "expo-document-picker";

import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FileUpload = ({
 fileData,
 setFileData
}) => {


  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
    if (result.type === "success") {
      setFileData({ fileName: result.name, fileUri: result.uri });
    }
  };
  const handleNext = () => {
    // Pass file data to parent even if null (optional file)
    onNext(fileData);
  };

  return (
    <>
      <View style={styles.upload}>
        <TouchableOpacity style={styles.fileinput} onPress={pickDocument}>
          <View style={styles.innerContent}>
            <Icon name="insert-drive-file" size={32} color="#Ebbe56" />
            <Text style={styles.addText}>Add Attachment</Text>
          </View>
          <Text style={styles.optionalText}>Optional</Text>
        </TouchableOpacity>

        {fileData.fileName && (
          <Text style={styles.fileName}>{fileData.fileName}</Text>
        )}

        <View style={styles.notesContainer}>
          <Text style={styles.note}>• The maximum file size is 30 MB.</Text>
          <Text style={styles.note}>
            • The accepted formats are jpg, jpeg, doc, docx, pdf, png.
          </Text>
          <Text style={styles.note}>
            • The following formats are not accepted: svg, mp4, mov, and mkv.
          </Text>
        </View>
      </View>
     
    </>
  );
};

const styles = StyleSheet.create({

  
  fileinput: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#A0A0A0",
    borderRadius: 8,
    height: 120,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
  },
  innerContent: {
    alignItems: "center",
  },
  addText: {
    marginTop: 8,
    fontFamily: "Montserrat_500Medium",
    color: "#EBBE56",
    fontSize: 16,
    fontWeight: "500",
  },
  optionalText: {
    position: "absolute",
    fontFamily: "Montserrat_400Regular",
    bottom: -23,
    right: 4,
    color: "#c3c3c3",
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  uploadBox: {
    width: 90,
    height: 90,
    backgroundColor: "#F7C843", // yellow background
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#333",
    marginBottom: 5,
  },

  fileName: {
    marginTop: 8,
    fontSize: 16,
    color: "#fdfdfdff",
  },
  notesContainer: {
    
    marginTop: 40,
    paddingHorizontal: 5,
  },
  note: {
    fontSize: 12,
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    paddingVertical: 3,
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    paddingTop:160
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    
  },
  buttonText: {
    color: "#ebe8e8ff",
    fontSize: 20,
    fontFamily:"Montserrat_700Bold",
    
  },
});

export default FileUpload;
