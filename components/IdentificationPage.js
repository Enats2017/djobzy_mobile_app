import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const Identity = ({
  heading = "Update Identity Verification",
  documentTypes = ["Driving license", "Passport", "Aadhar Card"],
  selectedType,
  onSelectType = () => {},
  onUploadPersonal = () => {},
  onUploadFront = () => {},
  onUploadBack = () => {},
  onVerify = () => {},
  idVerified = false,
  interviewVerified = false,
}) => {
  return (
    <View style={styles.identycontainer}>
      <Text style={styles.heading}>{heading}</Text>

      {/* Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => onSelectType(itemValue)}
          style={styles.dropdown}
        >
          {documentTypes.map((item, index) => (
            <Picker.Item label={item} value={item} key={index} />
          ))}
        </Picker>
      </View>

      {/* Personal Photo Upload */}
      <View style={styles.uploadBox}>
        <TouchableOpacity style={styles.uploadButton} onPress={onUploadPersonal}>
          <Image
            source={{ uri: "https://img.icons8.com/ios/50/upload--v1.png" }}
            style={styles.uploadIcon}
          />
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>
      </View>

      {/* Front & Back */}
      <View style={styles.row}>
        <View style={styles.uploadBoxSmall}>
          <TouchableOpacity style={styles.uploadButton} onPress={onUploadFront}>
            <Image
              source={{ uri: "https://img.icons8.com/ios/50/upload--v1.png" }}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadBoxSmall}>
          <TouchableOpacity style={styles.uploadButton} onPress={onUploadBack}>
            <Image
              source={{ uri: "https://img.icons8.com/ios/50/upload--v1.png" }}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyBtn} onPress={onVerify}>
        <Text style={styles.verifyText}>Verify Identity</Text>
      </TouchableOpacity>

      {/* Status */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>ID Verification</Text>
        <Text style={styles.statusDot}>{idVerified ? "🟢" : "⚪"}</Text>
        <Text style={[styles.statusText, { marginLeft: 14 }]}>Interview</Text>
        <Text style={styles.statusDot}>{interviewVerified ? "🟢" : "⚪"}</Text>
      </View>
    </View>
  );
};

export default Identity;

const styles = StyleSheet.create({

  heading: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 15,
  },
  dropdownWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 18,
  },
  dropdown: {
    height: 45,
  },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 8,
    height: 95,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  uploadBoxSmall: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 8,
    height: 95,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  uploadButton: {
    alignItems: "center",
  },
  uploadIcon: {
    width: 28,
    height: 28,
    marginBottom: 6,
  },
  uploadText: {
    color: "#fff",
  },
  verifyBtn: {
    backgroundColor: "#CF7D63",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 18,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
  },
  statusDot: {
    fontSize: 14,
    marginLeft: 6,
  },
});
