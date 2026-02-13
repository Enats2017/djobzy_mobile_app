import React, { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import MapView from "react-native-maps";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddressSection = ({ addressError, setAddressError }) => {
  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [activeLangId, setActiveLangId] = useState(null);
  const [loadingLang, setLoadingLang] = useState(false);
  const [activeLevelId, setActiveLevelId] = useState(null);

  const LEVEL_OPTIONS = [
    { label: "Basic", value: "1" },
    { label: "Medium", value: "2" },
    { label: "Advanced", value: "3" },
  ];

  const { requirements, languages, address, setField } =
    useCreateJobGlobalStore();

  const fetchLanguages = async (text, selectedLangs = []) => {
    if (!text || text.length < 1) {
      setLanguageSuggestions([]);
      return;
    }
    try {
      setLoadingLang(true);

      const res = await fetch(`${API_URL}/language`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: text,
          existing_lang: selectedLangs,
        }),
      });

      const json = await res.json();
      setLanguageSuggestions(json.data || []);
    } catch (e) {
      console.log("Language API error:", e);
    } finally {
      setLoadingLang(false);
    }
  };

  const addRequirement = () => {
    setField("requirements", [...requirements, { id: Date.now(), value: "" }]);
  };

  const removeRequirement = (id) => {
    setField(
      "requirements",
      requirements.filter((r) => r.id !== id),
    );
  };

  const updateRequirement = (id, text) => {
    setField(
      "requirements",
      requirements.map((r) => (r.id === id ? { ...r, value: text } : r)),
    );
  };

  const addLanguage = () => {
    setField("languages", [
      ...languages,
      { id: Date.now(), lang: "", level: "", text: "" },
    ]);
  };

  const removeLanguage = (id) => {
    setField(
      "languages",
      languages.filter((l) => l.id !== id),
    );
  };

  const updateLanguage = (id, field, value) => {
    setField(
      "languages",
      languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  return (
     <TouchableWithoutFeedback
    onPress={() => {
      setActiveLangId(null);
      setActiveLevelId(null);
      setLanguageSuggestions([]);
      Keyboard.dismiss();
    }}
  >
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements (Optional)</Text>
          {requirements.map((req, index) => (
            <View key={req.id} style={styles.requirementBox}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}.</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Write your requirement here"
                value={req.value}
                onChangeText={(text) => updateRequirement(req.id, text)}
              />
              <TouchableOpacity onPress={() => removeRequirement(req.id)}>
                <FontAwesome5 name="trash" size={15} color="#666666" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addRequirement}>
            <Text style={styles.addBtnText}>
              <Entypo name="circle-with-plus" size={18} color="black" /> Add
              Requirement
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language (Optional)</Text>

          {languages.map((lang) => (
            <View key={lang.id} style={{ marginBottom: 2, zIndex: 1000 }}>
              {/* Row */}
              <View style={styles.languageRow}>
                {/* Language Input */}
                <TextInput
                  style={styles.languageInput}
                  placeholder="Add Language"
                  value={lang.lang}
                  onFocus={() => {
                    setActiveLangId(lang.id);
                    setActiveLevelId(null);
                  }}
                  onChangeText={(text) => {
                    updateLanguage(lang.id, "lang", text);
                    fetchLanguages(
                      text,
                      languages.map((l) => l.lang).filter(Boolean),
                    );
                  }}
                />

                {/* Level Dropdown */}
                <TouchableOpacity
                  style={styles.languageInput}
                  onPress={() => {
                    setActiveLevelId(lang.id);
                    setActiveLangId(null);
                    setLanguageSuggestions([]);
                  }}
                >
                  <Text>{lang.text || "Select Level"}</Text>
                </TouchableOpacity>

                {/* Remove */}
                <TouchableOpacity
                  style={styles.levelInput}
                  onPress={() => removeLanguage(lang.id)}
                >
                  <FontAwesome name="minus-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>

              {/* ============================= */}
              {/* Language Suggestions */}
              {/* ============================= */}
              {activeLangId === lang.id && languageSuggestions.length > 0 && (
                <View style={styles.dropdown}>
                  {languageSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        updateLanguage(lang.id, "lang", item.value);
                        setActiveLangId(null);
                        setLanguageSuggestions([]);
                      }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* ============================= */}
              {/* Level Dropdown */}
              {/* ============================= */}
              {activeLevelId === lang.id && (
                <View style={styles.dropdown}>
                  {LEVEL_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={styles.dropdownItem}
                       

                      onPress={() => {
                        setField(
                          "languages",
                          languages.map((l) =>
                            l.id === lang.id
                              ? {
                                  ...l,
                                  level: item.value,
                                  text: item.label,
                                }
                              : l,
                          ),
                        );

                        setActiveLevelId(null);
                      }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Add Language Button */}
          <TouchableOpacity style={styles.addBtn} onPress={addLanguage}>
            <Text style={styles.addBtnText}>Add Language</Text>
          </TouchableOpacity>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address of the Job</Text>
          <View style={styles.addressInput}>
          <TextInput
            style={styles.input}
            placeholder="Write the Address"
            value={address}
            onChangeText={(text) => {
              setField("address", text);
              if (text.trim()) setAddressError(false);
            }}
            
          />

          </View>
          {addressError && (
            <Text style={styles.errorText}>*Please Enter Your Address</Text>
          )}
          {/* <View style={styles.mapscetion}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 0,
                  longitude: 0,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
                }}
              />
            </View> */}
        </View>
      </ScrollView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mapscetion: {
    height: 300,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    color: "#faf8f8ff",
    marginBottom: 6,
  },
  requirementBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  addressInput: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },

  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#666666",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    color: "#333",
  },

  addBtn: {
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#ebbe56",
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000000",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  languageInput: {
    flex: 1,
    fontSize: 15,
    marginRight: 5,
    fontFamily: "Montserrat_500Medium",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  levelInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },
  suggestionBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 140,
    elevation: 3,
  },

  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  suggestionText: {
    fontSize: 14,
    color: "#333",
  },

  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  dropdown: {
    backgroundColor: "#fff",

    borderRadius: 6,
    marginTop: 3,
    marginBottom: 10,
    elevation: 5,
    zIndex: 999,
  },

  dropdownItem: {
    padding: 10,

    borderBottomColor: "#eee",
  },
});

export default AddressSection;
