import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import * as DocumentPicker from "expo-document-picker";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import FilePreview from "../../components/FilePreview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastSuccess } from "../../utils/toast";

const Step4Address = ({ onNext }) => {
  const [country, setCountry] = useState("India");
  const [countryCode, setCountryCode] = useState("IN");
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [postal, setPostal] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Ahmedabad",
  ];

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (!result.canceled && result.assets?.length > 0) {
      setResumeFile(result.assets[0]);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

  const submitContactInfo = async () => {
    if (!postal || !location) {
      alert("Fill the  all Input");
      return;
    }
    const formData = new FormData();
    formData.append("postal_code", postal);
    formData.append("searchInput", location);
    formData.append("images", {
      uri: resumeFile.uri,
      name: resumeFile.name,
      type: "application/pdf",
    });

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/step4-post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
      <View>
        <Text style={styles.setptext}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      <View style={styles.inputBox}>
        <TouchableOpacity style={styles.row}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCountryNameButton
            onSelect={(c) => {
              setCountryCode(c.cca2);
              setCountry(c.name.common);
            }}
          />
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(!open)}>
        <Text style={styles.placeholder}>
          {selectedCity || "State / Province / City"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.listContainer}>
          {cities.map((city, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => {
                setSelectedCity(city);
                setOpen(false);
              }}
            >
              <Text style={styles.cityText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Street */}
      <TextInput
        placeholder="Street, building number, apartment"
        placeholderTextColor="#777"
        style={styles.input}
      />
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
        <FilePreview
          file={resumeFile}
          onRemove={removeResume}
          fileText={styles.customFileText}
          removeicon={styles.customRemoveIcon}
        />
      </View>
      <GradientButton title="Uplaod document" onPress={pickResume} />
      <TouchableOpacity style={styles.nextBtn} onPress={submitContactInfo}>
        <Text style={styles.nextText}>Next</Text>
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
