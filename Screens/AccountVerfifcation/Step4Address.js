import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import FilePreview from "../../components/FilePreview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";
import Map from "../../components/Map";

const Step4Address = ({ onNext }) => {
  const [addressDocs, setAddressDocs] = useState([]);
  const [postal, setPostal] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      multiple: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAddressDocs((prev) => [...prev, ...result.assets]);
    }
  };

  const removeResume = (index) => {
    const updated = [...addressDocs];
    updated.splice(index, 1);
    setAddressDocs(updated);
  };

  const submitContactInfo = async () => {
    if (!location) {
      toastError("Location is required");
      return;
    }
    if (addressDocs.length === 0) {
      toastError("Address document is required");
      return;
    }
    let imageNames = [];
    const formData = new FormData();
    formData.append("postal_code", postal);
    formData.append("searchInput", location);
    addressDocs.forEach((file) => {
      imageNames.push(file.name);
      formData.append("adress_docs[]", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || file.type || "application/octet-stream",
      });
    });
    formData.append("images", imageNames.join(","));

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/step4-post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status == 200) {
        toastSuccess("Contact info saved successfully");
        onNext();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      toastWarning("netweork error");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Text style={styles.setptext}>STEP 4</Text>
      <Text style={styles.headtext}>Address</Text>

      <TextInput
        placeholder="Postal Code"
        placeholderTextColor="#777"
        style={styles.input}
        value={postal}
        onChangeText={setPostal}
        keyboardType="numeric"
      />
      <View style={styles.mapButton}>
        <SimpleLineIcons name="location-pin" size={14} color="#000000" />
        <TextInput
          placeholder="Location address on map"
          placeholderTextColor="#777"
          style={styles.locationinput}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.fileRow}>
        {addressDocs.map((file, index) => (
          <FilePreview
            file={file}
            key={index}
            fileText={styles.customFileText}
            onRemove={() => removeResume(index)}
            removeicon={styles.customRemoveIcon}
          />
        ))}
      </View>
      <View style={styles.mapsection}>
        <Map />
      </View>
      <GradientButton title="Uplaod document" onPress={pickResume} />
      <TouchableOpacity style={styles.nextBtn} onPress={submitContactInfo} >
        {
          submitting ? (
            <ActivityIndicator color="#fff" size={28} />
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )
        }
      </TouchableOpacity>
    </>
  );
};

export default Step4Address;
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
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  placeholder: {
    color: "#777",
    fontSize: 14,
  },

  arrow: {
    color: "#777",
    fontSize: 12,
  },
  mapButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 12,
    gap: 6,
    alignItems: "center",
  },
  locationinput: {
    fontSize: 14,
    color: "#000",
    width: "100%"
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 14,
    color: "#000",
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },

  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityText: {
    fontSize: 14,
    color: "#333",
  },

  mapIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  mapText: {
    color: "#777",
    fontSize: 14,
  },
  fileRow: {
    backgroundColor: "#c3c3c3c3",
    marginTop: 10,
    borderRadius: 8,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
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
