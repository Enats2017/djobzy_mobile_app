import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UploadBox from "../../components/UploadBox";
import GradientButton from "../../components/GradientButton";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import FilePreview from "../../components/FilePreview";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";

export default function IDVerificationUploadScreen() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected, setSelected] = useState("Select Document Type");
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
   const [admin, setAdmin] = useState(0);
  const navigation = useNavigation();

  const data = ["Driving License", "Passport", "National ID"];
  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    setAdmin(user?.admin);
  };
  useEffect(() => {
    loadUser();
  }, []);

  const handleVerify = async () => {
    if (
      !personalPhoto ||
      !docFront ||
      !docBack ||
      selected === "Select Document Type"
    ) {
      Alert.alert("Error", "Please upload all required images");
      return;
    }

    const formData = new FormData();

    formData.append("card_type", selected);

    formData.append("FacePhoto", {
      uri: personalPhoto.uri,
      name: "face.jpg",
      type: "image/jpeg",
    });

    formData.append("DocumentFront", {
      uri: docFront.uri,
      name: "front.jpg",
      type: "image/jpeg",
    });

    formData.append("DocumentBack", {
      uri: docBack.uri,
      name: "back.jpg",
      type: "image/jpeg",
    });

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/doc-verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);
      if (data.status == 200) {
        Alert.alert("Success", "Document verified successfully");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      Alert.alert("Error", "Upload failed");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <PageNameHeaderBar
          title="Identity Verification"
          navigation={navigation}
        />
        <View>
          <Text style={styles.title}>Identity Verification</Text>

          {/* Dropdown */}
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>{selected}</Text>
            <Ionicons name="chevron-down" size={20} />
          </TouchableOpacity>

          {openDropdown && (
            <View style={styles.dropdownBody}>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelected(item);
                    setOpenDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Personal Photo */}
          <Text style={styles.sectionLabel}>Personal Photo</Text>
          <UploadBox
            label="Upload Personal Photo"
            onSelect={setPersonalPhoto}
          />
          <FilePreview
            file={personalPhoto}
            onRemove={() => setPersonalPhoto(null)}
          />

          {/* Document Images */}
          <Text style={styles.sectionLabel}>
            Document Images (Front & Back)
          </Text>
          <View style={styles.row}>
            <UploadBox
              label="Front Image"
              type="document"
              small
              onSelect={setDocFront}
            />
            
            <UploadBox label="Back Image"
            type="document"
             small 
             onSelect={setDocBack} />
           
          </View>
          <FilePreview file={docFront} onRemove={() => setDocFront(null)} />
             <FilePreview file={docBack} onRemove={() => setDocBack(null)} />
        </View>

        <GradientButton title="Verify Identity" onPress={handleVerify} />
      </View>
        {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingHorizontal: 15, flex: 1, backgroundColor: "#222222" },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionLabel: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },

  dropdownWrapper: {
    width: "100%",
    marginBottom: 15,
  },
  dropdownHeader: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#FFFFFF33",
    borderRadius: 8,
    height: 110,
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  uploadIcon: { fontSize: 20, color: "#9fa4a6", marginBottom: 6 },
  uploadText: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  smallBox: { flex: 1, marginRight: 6 },

  verifyBtn: {
    backgroundColor: "#e27f73",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 18,
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontWeight: "600" },

  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeText: { color: "#b8b8b8", marginRight: 8 },
  badgeTick: { color: "#3fc77a" },
});
