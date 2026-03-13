import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NewUploadBox from "../../components/NewUploadBox";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";

const Step5Identyfication = () => {
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isCardVerified, setIsCardVerified] = useState(0);
  const [selected, setSelected] = useState("Select Document Type");

  const data = ["Driving License", "Passport", "National ID"];

  const handleVerify = async () => {
    if (!personalPhoto || !docFront || !docBack || selected === "Select Document Type") {
      Alert.alert("Error", "Please upload all required images");
      return;
    }

    const formData = new FormData();
    formData.append("card_type", selected);
    formData.append("FacePhoto", {
      uri: personalPhoto.uri,
      name: personalPhoto.fileName || personalPhoto.uri.split("/").pop(),
      type: personalPhoto.mimeType || "image/jpeg",
    });
    formData.append("DocumentFront", {
      uri: docFront.uri,
      name: docFront.fileName || docFront.uri.split("/").pop(),
      type: docFront.mimeType || "image/jpeg",
    });
    formData.append("DocumentBack", {
      uri: docBack.uri,
      name: docBack.fileName || docBack.uri.split("/").pop(),
      type: docBack.mimeType || "image/jpeg",
    });
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/verify-doc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);
      if (data.status == 200) {
        toastSuccess("Document verified successfully");
        setVerified(true);
        setIsCardVerified(data.cardVerified);
      } else {
        toastError(data.message);
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      toastError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async () => {
    if(verified) {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_URL}/step5-post`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: {
            card_type: selected,
            is_verified : isCardVerified
          },
        });
  
        const result = await res.json();
  
        if (result.status == 200) {
          toastSuccess("Documents verified successfully.");
          onNext();
        } else {
          toastError(result.message || "Something went wrong");
        }
      } catch (error) {
        console.error("API Error:", error);
        toastWarning("netweork error");
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Please complete document verification.');
    }
  };

  return (
    <>
      <Text style={styles.setptext}>STEP 4</Text>
      <Text style={styles.headtext}>ID Card and Certificates</Text>
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
      <NewUploadBox
        label="Personal Photo"
        file={personalPhoto}
        onSelect={setPersonalPhoto}
        onRemove={() => setPersonalPhoto(null)}
      />

      <NewUploadBox
        label="Document Image (Front)"
        file={docFront}
        onSelect={setDocFront}
        onRemove={() => setDocFront(null)}
      />

      <NewUploadBox
        label="Document Image (Back)"
        file={docBack}
        onSelect={setDocBack}
        onRemove={() => setDocBack(null)}
      />

      {
        !verified && (
          <GradientButton title="Verify" onPress={handleVerify} loading={loading} disabled={loading} />
        )
      }
      <TouchableOpacity style={styles.nextBtn} onPress={submitVerify}>
        {
          loading ? (
            <ActivityIndicator color="#fff" size={28} />
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )
        }
      </TouchableOpacity>
    </>
  );
};

export default Step5Identyfication;

const styles = StyleSheet.create({
  setptext: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  headtext: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 5,
  },
  dropdownHeader: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#444",
  },
  dropdownBody: {
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
  nextBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: "#000000",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
  },
});
