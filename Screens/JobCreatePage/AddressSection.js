import React, { useEffect, useState, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
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
  const [selectedLangId, setSelectedLangId] = useState(null);
  const debounceRef = useRef(null);
  const placeholderColor = "#666666";

  const LEVEL_OPTIONS = [
    { label: "Basic", value: "1" },
    { label: "Medium", value: "2" },
    { label: "Advanced", value: "3" },
  ];

  const { requirements, languages, address, setField, isRemoteJob } = useCreateJobGlobalStore();

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          scrollEnabled={false}
        >
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
                    // onChangeText={(text) => {
                    //   updateLanguage(lang.id, "lang", text);
                    //   fetchLanguages(
                    //     text,
                    //     languages.map((l) => l.lang).filter(Boolean),
                    //   );
                    // }}
                    onChangeText={(text) => {
                      updateLanguage(lang.id, "lang", text);
                      if (debounceRef.current) {
                        clearTimeout(debounceRef.current);
                      }
                      if (text.trim().length > 0) {
                        debounceRef.current = setTimeout(() => {
                          setActiveLangId(lang.id);
                          fetchLanguages(
                            text,
                            languages.map((l) => l.lang).filter(Boolean),
                          );
                        }, 300);
                      } else {
                        setActiveLangId(null);
                        setLanguageSuggestions([]);
                      }
                    }}
                  />

                  {/* Level Dropdown */}
                  {(selectedLangId === lang.id || lang.level) && (
                    <TouchableOpacity
                      style={styles.languageInput}
                      onPress={() => {
                        setActiveLevelId(lang.id);
                        setActiveLangId(null);
                        setLanguageSuggestions([]);
                      }}
                    >
                      <Text style={styles.languageInputlevel}>{lang.text || "Select Level"}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Remove */}
                  <TouchableOpacity
                    style={styles.levelInput}
                    onPress={() => removeLanguage(lang.id)}
                  >
                    <FontAwesome name="minus-circle" size={18} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Language Suggestions */}
                {activeLangId === lang.id && languageSuggestions.length > 0 && (
                  <View style={styles.dropdown}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                    >
                      {languageSuggestions.map((item) => (
                        <TouchableOpacity
                          key={item.value}
                          style={styles.dropdownItem}
                          onPress={() => {
                            updateLanguage(lang.id, "lang", item.value);
                            setSelectedLangId(lang.id);
                            setActiveLangId(null);
                            setLanguageSuggestions([]);
                          }}
                        >
                          <Text>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Level Dropdown */}
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
                placeholder="Enter Job Location / Address"
                placeholderTextColor={placeholderColor}
                value={address}
                onChangeText={(text) => {
                  setField("address", text);
                  if (text.trim()) setAddressError(false);
                }}
              />
            </View>
            {addressError && (
              <Text style={styles.errorText}>*Please Enter Job Location / Address</Text>
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
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => {
                const newValue = isRemoteJob === 1 ? 0 : 1;
                setField("isRemoteJob", newValue);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  isRemoteJob === 1 && styles.checkboxChecked,
                ]}
              >
                {isRemoteJob === 1 && (
                  <Ionicons name="checkmark" size={14} color="#000" />
                )}
              </View>

              <Text style={styles.rememberText}>
                Mark the job as a{" "}
                <Text style={styles.clickText}>Remote</Text>
              </Text>
            </TouchableOpacity>
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
  languageInputlevel: {
    fontSize: 15,
    marginRight: 5,
    fontFamily: "Montserrat_500Medium",
    borderRadius: 10,
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
  row: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: 10,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  rememberText: {
    color: "#fff",
    marginLeft: 10,
    flexShrink: 1,
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    lineHeight: 22,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  click: {
    alignContent: "center",
  },
  clickText: {
    color: "#C96B59",
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    lineHeight: 22,
  },
});

export default AddressSection;
