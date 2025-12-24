import React,{useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, Foundation } from "@expo/vector-icons";

import { Picker } from "@react-native-picker/picker";

const Identity = ({
  heading = "Update Identity Verification",
  documentTypes = ["Driving license", "Passport", "Aadhar Card"],
  selectedType,
  openDropdown,
  setOpenDropdown =()=>{},
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
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedType}</Text>
            <Ionicons
              name={openDropdown ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </TouchableOpacity>
          {openDropdown && (
            <View style={styles.dropdownBody}>
              {documentTypes.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      onSelectType(item);
                      setOpenDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                  {index !== documentTypes.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          )}
        </View>

      {/* Personal Photo Upload */}
      <View style={styles.uploadBox}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={onUploadPersonal}
        >
          <Foundation name="upload" size={24} color="#fff" />
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>
      </View>

      {/* Front & Back */}
      <View style={styles.row}>
        <View style={styles.uploadBoxSmall}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              console.log("BUTTON ` `");
              onUploadFront();
            }}
          >
                      <Foundation name="upload" size={24} color="#fff" />

            <Text style={styles.uploadText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadBoxSmall}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              console.log("Back Button Pressed");
              onUploadBack();
            }}
          >
                      <Foundation name="upload" size={24} color="#fff" />

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
    fontSize: 18,
    color: "#fff",
    
    marginBottom: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  dropdownWrapper: {
    width: "100%",
  },
  dropdownHeader: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#444",
  },
  dropdownBody: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  
  uploadButton: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    overflow: "hidden", // IMPORTANT
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
    overflow: "hidden", // IMPORTANT
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
